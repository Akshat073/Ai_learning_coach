import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummeryApi from '../common/SummeryApi';

const VerifyEmail = () => {
    const [isVerifying, setIsVerifying] = useState(true);
    const [verificationStatus, setVerificationStatus] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Extract code from query parameters
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');

    useEffect(() => {
        const verifyEmail = async () => {
            // Check if code exists
            if (!code) {
                setVerificationStatus('error');
                toast.error('No verification code provided');
                setIsVerifying(false);
                return;
            }

            try {
                const response = await Axios({
                    ...SummeryApi.verifyEmail,
                    data: { code: code }
                });
                console.log(response.data);
                
                if (response.data.success) {
                    setVerificationStatus('success');
                    toast.success(response.data.message);
                    
                    // Redirect to login after 3 seconds
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    setVerificationStatus('error');
                    toast.error(response.data.message);
                }
            } catch (error) {
                setVerificationStatus('error');
                const errorMessage = error.response?.data?.message || 
                                     error.message || 
                                     "Verification failed";
                toast.error(errorMessage);
            } finally {
                setIsVerifying(false);
            }
        };

        verifyEmail();
    }, [code, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div className="text-center">
                    {isVerifying ? (
                        <>
                            <svg 
                                className="mx-auto h-12 w-12 text-yellow-500 animate-spin" 
                                fill="none" 
                                viewBox="0 0 24 24"
                            >
                                <circle 
                                    className="opacity-25" 
                                    cx="12" 
                                    cy="12" 
                                    r="10" 
                                    stroke="currentColor" 
                                    strokeWidth="4"
                                ></circle>
                                <path 
                                    className="opacity-75" 
                                    fill="currentColor" 
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                Verifying Email
                            </h2>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                Please wait while we verify your email address
                            </p>
                        </>
                    ) : verificationStatus === 'success' ? (
                        <>
                            <svg 
                                className="mx-auto h-16 w-16 text-green-500" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                            </svg>
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                Email Verified
                            </h2>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                Your email has been successfully verified. Redirecting to login...
                            </p>
                        </>
                    ) : (
                        <>
                            <svg 
                                className="mx-auto h-16 w-16 text-red-500" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                            </svg>
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                Verification Failed
                            </h2>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                Unable to verify your email. Please try again or contact support.
                            </p>
                            <div className="mt-6">
                                <button 
                                    onClick={() => navigate('/register')}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-200 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-200"
                                >
                                    Back to Register
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
