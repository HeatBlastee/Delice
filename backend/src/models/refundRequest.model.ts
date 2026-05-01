import mongoose, { Document, Schema, Model } from "mongoose";

export interface IRefundRequest extends Document {
    order: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    shop: mongoose.Types.ObjectId;
    reason: string;
    photoUrl?: string;
    status: "pending" | "approved" | "rejected";
    adminNote?: string;
    createdAt: Date;
    updatedAt: Date;
}

const refundRequestSchema = new Schema<IRefundRequest>({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    photoUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    adminNote: {
        type: String
    }
}, { timestamps: true });

const RefundRequest: Model<IRefundRequest> = mongoose.model<IRefundRequest>("RefundRequest", refundRequestSchema);

export default RefundRequest;
