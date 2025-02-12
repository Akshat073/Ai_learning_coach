import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import SummeryApi from '../common/SummeryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { TfiCrown } from 'react-icons/tfi';
import { FiRefreshCw, FiUser } from 'react-icons/fi';

import {Link} from 'react-router-dom';


const LeaderBoard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const response = await Axios.get('/api/user/leaderboard');
            if (response.data.success) {
                setData(response.data.data);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchData();
    };

    const handleProfileClick = (userId) => {
        window.location.href = `/showProfile?id=${userId}`;
    };

    const getRankColor = (index) => {
        if (index === 0) return 'from-yellow-400 to-yellow-200';
        if (index === 1) return 'from-gray-400 to-gray-200';
        if (index === 2) return 'from-amber-600 to-amber-400';
        return 'from-blue-100 to-blue-50';
    };

    const truncateName = (name) => {
        return name.length > 10 ? `${name.substring(0, 10)}...` : name;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto"> {/* Increased width */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 flex items-center justify-center gap-2">
                        <TfiCrown className="text-yellow-400 animate-bounce" />
                        Leaderboard
                        <TfiCrown className="text-yellow-400 animate-bounce delay-75" />
                    </h1>
                    <button
                        onClick={handleRefresh}
                        disabled={loading || isRefreshing}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50"
                    >
                        <FiRefreshCw className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
                    <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6">
                        <div className="grid grid-cols-4 text-white font-bold text-lg"> {/* Added 4th column */}
                            <span>Rank</span>
                            <span>Name</span>
                            <span className="text-right">Score</span>
                            <span className="text-right">Profile</span> {/* New column header */}
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {loading ? (
                            [...Array(5)].map((_, index) => (
                                <div key={index} className="p-6 animate-pulse">
                                    <div className="h-6 bg-gray-200 rounded w-full"></div>
                                </div>
                            ))
                        ) : data.length > 0 ? (
                            data.map((user, index) => (
                                <div
                                    key={user._id}
                                    className={`group transform transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${index < 3 ? 'bg-gradient-to-r' : ''} ${getRankColor(index)}`}
                                >
                                    <div className="grid grid-cols-4 items-center p-6"> {/* Added 4th column */}
                                        <div className="flex items-center space-x-4">
                                            <span className={`font-bold ${index < 3 ? 'text-white' : 'text-gray-700'}`}>
                                                #{index + 1}
                                            </span>
                                            {index < 3 && (
                                                <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                                                    <TfiCrown className={`${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : 'text-amber-400'}`} />
                                                </div>
                                            )}
                                        </div>
                                        <span className={`font-medium ${index < 3 ? 'text-white' : 'text-gray-900'}`}>
                                            <span className="hidden lg:inline">{user.name}</span>
                                            <span className="lg:hidden">{truncateName(user.name)}</span>
                                        </span>
                                        <span className={`text-right font-semibold ${index < 3 ? 'text-white' : 'text-green-600'}`}>
                                            {user.correctAnswer} Points
                                        </span>
                                        <div className="text-right">
                                            <button
                                                onClick={() => handleProfileClick(user._id)}
                                                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                                title="View Profile"
                                            >
                                                <Link to={`/showProfile?id=${user._id}`}><FiUser className={`w-5 h-5 ${index < 3 ? 'text-white' : 'text-indigo-600'}`} /></Link>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center">
                                <div className="text-gray-500 mb-4">📭</div>
                                <p className="text-gray-600 font-medium">No scores available yet. Be the first!</p>
                            </div>
                        )}
                    </div>
                </div>

                {!loading && data.length > 0 && (
                    <div className="mt-6 text-center text-sm text-gray-500">
                        Updated {new Date().toLocaleTimeString()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaderBoard;