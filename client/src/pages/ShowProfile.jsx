import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import SummeryApi from '../common/SummeryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { FiCheckCircle, FiXCircle, FiUser, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

const ShowProfile = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const response = await Axios({ ...SummeryApi.showProfile,
                params: {
                    id,
                },
            });
            if (response.data.success) {
                console.log(response.data.data);
                setUser(response.data.data);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    const getPerformanceColor = (percentage) => {
        if (percentage >= 70) return 'text-green-500';
        if (percentage >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        <div className="h-32 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Failed to load user profile
                    </h2>
                    <button
                        onClick={fetchUser}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const totalQuestions = user.correctAnswer + user.wrongAnswer;
    const accuracy = totalQuestions > 0 
        ? Math.round((user.correctAnswer / totalQuestions) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full relative">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                    <FiArrowLeft className="w-6 h-6" />
                </button>

                <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        {user.avatar ? (
                            <img src={user.avatar} alt="User Avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <FiUser className="w-12 h-12 text-indigo-600" />
                        )}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
                    <p className="text-gray-600 mt-2">{user.email}</p>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Performance Stats</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-50 p-4 rounded-lg text-center">
                                <FiCheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <span className="block text-2xl font-bold text-gray-800">
                                    {user.correctAnswer}
                                </span>
                                <span className="text-sm text-gray-600">Correct Answers</span>
                            </div>
                            
                            <div className="bg-red-50 p-4 rounded-lg text-center">
                                <FiXCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                                <span className="block text-2xl font-bold text-gray-800">
                                    {user.wrongAnswer}
                                </span>
                                <span className="text-sm text-gray-600">Wrong Answers</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Accuracy</span>
                                <span className={`text-sm font-semibold ${getPerformanceColor(accuracy)}`}>
                                    {accuracy}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`${getPerformanceColor(accuracy).replace('text', 'bg')} h-2 rounded-full`}
                                    style={{ width: `${accuracy}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-50 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Stats</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Attempts</span>
                                <span className="font-medium text-gray-800">{totalQuestions}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Success Ratio</span>
                                <span className="font-medium text-gray-800">
                                    {user.correctAnswer}:{user.wrongAnswer}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Profile updated: {new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

export default ShowProfile;