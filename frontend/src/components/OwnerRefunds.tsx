import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER_URI } from '../App';
import toast from 'react-hot-toast';

interface RefundRequest {
    _id: string;
    order: { _id: string, totalAmount: number };
    user: { fullName: string, email: string };
    reason: string;
    photoUrl?: string;
    status: "pending" | "approved" | "rejected";
    adminNote?: string;
    createdAt: string;
}

const OwnerRefunds: React.FC = () => {
    const [refunds, setRefunds] = useState<RefundRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRefunds = async () => {
        try {
            const response = await axios.get(`${SERVER_URI}/api/support/refunds`, { withCredentials: true });
            if (response.data.success) {
                setRefunds(response.data.refunds);
            }
        } catch (error) {
            console.error("Failed to fetch refunds", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRefunds();
    }, []);

    const updateStatus = async (id: string, status: "approved" | "rejected") => {
        try {
            const res = await axios.put(`${SERVER_URI}/api/support/refunds/${id}`, { status }, { withCredentials: true });
            if (res.data.success) {
                toast.success(`Refund ${status} successfully`);
                fetchRefunds();
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (loading) return <div className="p-4">Loading refunds...</div>;

    return (
        <div className='w-full max-w-6xl bg-white rounded-2xl shadow-md p-6 border border-gray-100 mt-6'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4'>AI Refund Requests</h2>
            {refunds.length === 0 ? (
                <p className="text-gray-500">No pending refund requests.</p>
            ) : (
                <div className="space-y-4">
                    {refunds.map(refund => (
                        <div key={refund._id} className={`border rounded-lg p-4 flex flex-col sm:flex-row gap-4 ${refund.status === 'pending' ? 'bg-orange-50' : 'bg-gray-50'}`}>
                            {refund.photoUrl && (
                                <img src={refund.photoUrl} alt="Evidence" className="w-32 h-32 object-cover rounded-md" />
                            )}
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-gray-800">Order: {refund.order?._id}</p>
                                        <p className="text-sm text-gray-600">Customer: {refund.user?.fullName}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                        refund.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                                        refund.status === 'approved' ? 'bg-green-200 text-green-800' :
                                        'bg-red-200 text-red-800'
                                    }`}>
                                        {refund.status}
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm"><span className="font-semibold">Reason:</span> {refund.reason}</p>
                                    {refund.adminNote && (
                                        <p className="text-sm mt-1 p-2 bg-blue-50 text-blue-800 rounded border border-blue-100">
                                            <span className="font-semibold">AI Analysis:</span> {refund.adminNote}
                                        </p>
                                    )}
                                </div>
                                {refund.status === 'pending' && (
                                    <div className="mt-4 flex gap-2">
                                        <button 
                                            onClick={() => updateStatus(refund._id, 'approved')}
                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            Approve Refund
                                        </button>
                                        <button 
                                            onClick={() => updateStatus(refund._id, 'rejected')}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            Reject Refund
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OwnerRefunds;
