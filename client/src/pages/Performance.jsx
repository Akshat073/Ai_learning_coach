import React from 'react';
import { useSelector } from 'react-redux';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { AiFillTrophy } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { BsLightningCharge, BsArrowUpCircle } from 'react-icons/bs';

const Performance = () => {
    const user = useSelector(state => state.user);
    const totalAttempts = user.correctAnswer + user.wrongAnswer;
    const accuracy = totalAttempts > 0 ? ((user.correctAnswer / totalAttempts) * 100).toFixed(1) : 0;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity:1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const calculateLevel = (correct) => {
        if (correct >= 100) return { level: "Expert", color: "text-purple-600" };
        if (correct >= 50) return { level: "Advanced", color: "text-blue-600" };
        if (correct >= 20) return { level: "Intermediate", color: "text-green-600" };
        return { level: "Beginner", color: "text-orange-600" };
    };

    const userLevel = calculateLevel(user.correctAnswer);

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    Your Learning Journey
                </h1>
                <p className="text-gray-600 text-lg">Track your progress and unlock achievements</p>
            </motion.div>

            {/* Level Badge */}
            <motion.div
                variants={itemVariants}
                className="mb-8 text-center"
            >
                <div className="inline-block bg-white rounded-full shadow-lg px-6 py-3">
                    <div className="flex items-center space-x-2">
                        <BsLightningCharge className={`text-2xl ${userLevel.color}`} />
                        <span className={`font-semibold ${userLevel.color}`}>Level: {userLevel.level}</span>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Total Questions Card */}
                <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-600 text-lg font-medium">Total Questions</h3>
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <AiFillTrophy className="text-yellow-500 text-2xl" />
                        </div>
                    </div>
                    <motion.p 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-4xl font-bold text-gray-800"
                    >
                        {totalAttempts}
                    </motion.p>
                    <p className="text-sm text-gray-500 mt-2">Questions attempted</p>
                </motion.div>

                {/* Correct Answers Card */}
                <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-600 text-lg font-medium">Correct Answers</h3>
                        <div className="p-3 bg-green-100 rounded-full">
                            <FaCheckCircle className="text-green-500 text-2xl" />
                        </div>
                    </div>
                    <motion.p 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-4xl font-bold text-green-500"
                    >
                        {user.correctAnswer}
                    </motion.p>
                    <p className="text-sm text-gray-500 mt-2">Questions answered correctly</p>
                </motion.div>

                {/* Wrong Answers Card */}
                <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-600 text-lg font-medium">Wrong Answers</h3>
                        <div className="p-3 bg-red-100 rounded-full">
                            <FaTimesCircle className="text-red-500 text-2xl" />
                        </div>
                    </div>
                    <motion.p 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-4xl font-bold text-red-500"
                    >
                        {user.wrongAnswer}
                    </motion.p>
                    <p className="text-sm text-gray-500 mt-2">Questions answered incorrectly</p>
                </motion.div>
            </motion.div>

            {/* Accuracy Section */}
            <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg p-8 mb-12"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Overall Accuracy</h2>
                <div className="w-full bg-gray-100 rounded-full h-6 mb-6">
                    <motion.div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-6 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${accuracy}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <span className="flex h-full items-center justify-end pr-3 text-white text-sm font-semibold">
                            {accuracy}%
                        </span>
                    </motion.div>
                </div>
                <p className="text-gray-600 text-lg">
                    Your accuracy rate is <span className="font-semibold text-blue-600">{accuracy}%</span>
                </p>
            </motion.div>

            {/* Tips Section */}
            <motion.div
                variants={itemVariants}
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg"
            >
                <div className="flex items-center mb-6">
                    <BsArrowUpCircle className="text-blue-600 text-2xl mr-3" />
                    <h3 className="text-2xl font-bold text-gray-800">Tips to Level Up</h3>
                </div>
                <motion.ul 
                    className="space-y-4 text-gray-700"
                    variants={containerVariants}
                >
                    {[
                        "Review questions you've answered incorrectly to learn from mistakes",
                        "Take regular practice tests to build consistency",
                        "Focus on topics where you have lower accuracy scores",
                        "Set daily learning goals and track your progress",
                        "Try to maintain a study streak for better retention"
                    ].map((tip, index) => (
                        <motion.li
                            key={index}
                            variants={itemVariants}
                            className="flex items-center space-x-3 bg-white/50 p-4 rounded-xl"
                        >
                            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                            <span>{tip}</span>
                        </motion.li>
                    ))}
                </motion.ul>
            </motion.div>
        </motion.div>
    );
};

export default Performance;
