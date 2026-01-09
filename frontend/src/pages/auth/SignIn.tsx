import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from "axios";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { SERVER_URI } from '../../App';
import { setUserData } from '../../redux/userSlice';
import { auth } from '../../utils/firebase';
import type { User } from '../schema';
import toast from 'react-hot-toast';

// 1. Define Types
interface SignInResponse {
    user: User; 
    token?: string;
    message?: string;
}

const COLORS = {
    primary: "#ff4d2d",
    hover: "#e64323",
    bg: "#fff9f6",
    border: "#ddd"
};


function SignIn() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        const loadingToast = toast.loading("Signing in...");
        setLoading(true);
        try {
            const { data } = await axios.post<SignInResponse>(
                `${SERVER_URI}/api/auth/signin`,
                { email, password },
                { withCredentials: true }
            );
            dispatch(setUserData(data.user));
            toast.success("Welcome back!", { id: loadingToast });
            navigate('/');
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const message = axiosError.response?.data?.message || "Sign in failed";
            toast.error(message, { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const { data } = await axios.post<SignInResponse>(
                `${SERVER_URI}/api/auth/google-auth`,
                { email: result.user.email },
                { withCredentials: true }
            );
            dispatch(setUserData(data.user));
            toast.success("Successfully signed in with Google!");
            navigate('/');
        } catch (error) {
            console.log(error)
            toast.error("Google authentication failed");
        }
    };

    return (
        <div className='min-h-screen w-full flex items-center justify-center p-4' style={{ backgroundColor: COLORS.bg }}>
            <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-8 border' style={{ borderColor: COLORS.border }}>

                <h1 className='text-3xl font-bold mb-2' style={{ color: COLORS.primary }}>Delice</h1>
                <p className='text-gray-600 mb-6'>Sign in to your account to get started.</p>


                <div className='space-y-4'>
                    {/* Email Input */}
                    <div>
                        <label className='block text-gray-700 font-medium mb-1'>Email</label>
                        <input
                            type="email"
                            className='w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#ff4d2d]/20 focus:outline-none'
                            style={{ borderColor: COLORS.border }}
                            placeholder='Enter your email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className='block text-gray-700 font-medium mb-1'>Password</label>
                        <div className='relative'>
                            <input
                                type={showPassword ? "text" : "password"}
                                className='w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#ff4d2d]/20 focus:outline-none pr-10'
                                style={{ borderColor: COLORS.border }}
                                placeholder='Enter password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className='text-right mt-2 mb-6'>
                    <span
                        className='cursor-pointer text-[#ff4d2d] font-medium text-sm'
                        onClick={() => navigate("/forgot-password")}
                    >
                        Forgot Password?
                    </span>
                </div>

                <button
                    className='w-full font-semibold py-2.5 rounded-lg transition-colors text-white disabled:opacity-70'
                    style={{ backgroundColor: COLORS.primary }}
                    onClick={handleSignIn}
                    disabled={loading}
                >
                    {loading ? <ClipLoader size={20} color='white' /> : "Sign In"}
                </button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-300"></span></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">Or continue with</span></div>
                </div>

                <button
                    className='w-full flex items-center justify-center gap-2 border rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors'
                    onClick={handleGoogleAuth}
                >
                    <FcGoogle size={20} />
                    <span className="font-medium">Google</span>
                </button>

                <p className='text-center mt-8 text-gray-600'>
                    Don't have an account?
                    <span className='text-[#ff4d2d] ml-1 font-medium cursor-pointer' onClick={() => navigate("/signup")}>Sign Up</span>
                </p>
            </div>
        </div>
    );
}

export default SignIn;