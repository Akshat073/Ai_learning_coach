import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import SummeryApi from '../common/SummeryApi';
import toast from 'react-hot-toast';
import emailjs from '@emailjs/browser';


const ReplyMail = () => {
    const [mails, setMails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMail, setSelectedMail] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    const fetchMails = async () => {
        try {
            const response = await Axios({ ...SummeryApi.getMail });
            if (response.data.success) {
                const filteredMails = response.data.data.filter(mail => !mail.isReplied);
                setMails(filteredMails);
            }
        } catch (error) {
            toast.error('Failed to fetch mails');
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (mailId) => {
        try {
            const response = await Axios({
                ...SummeryApi.deleteMail,
                data: { 
                    id: mailId
                }
            });
            if (response.data.success) {
                setShowDeleteConfirm(null);
                toast.success('Mail deleted successfully');
                fetchMails();
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete mail');
        }
    };

    
    const handleReply = async (mailId) => {
        if (!replyContent.trim()) return;
        try {
            const mail = mails.find(mail => mail._id === mailId);
            if (!mail) return;

            const replytemplate = {
                from_name: 'Surya (kid tutor)',
                original_message: mail.message,
                reply_message: replyContent,
                to_name: mail.name,
                to_email: mail.email,
            };

            const response = await Axios({
                ...SummeryApi.replyMailById,
                data: { 
                    content: replyContent,
                    id: mailId
                }
            });
            if (response.data.success) {
                emailjs
                    .send('service_nrj1ns5', 'template_38rfs59', replytemplate, {
                        publicKey: 'NGSr2K5ribYEjAk_V',
                    })
                    .then(
                        () => {
                            toast.success('Reply sent successfully');
                            console.log('SUCCESS!');
                        },
                        (error) => {
                            console.log('FAILED...', error);
                        }
                    );
                fetchMails();
                setSelectedMail(null);
                setReplyContent('');
            }
        } catch (error) {
            toast.error('Failed to send reply');
            console.log(error);
        }
    };

    useEffect(() => {
        fetchMails();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 transform hover:scale-105 transition-transform">
                        📨 Reply Mail
                    </h1>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {mails.length > 0 ? (
                            mails.map((mail) => (
                                <div 
                                    key={mail._id}
                                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative"
                                >
                                    {showDeleteConfirm === mail._id && (
                                        <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center rounded-lg">
                                            <div className="text-center">
                                                <p className="mb-4 font-medium">Delete this message?</p>
                                                <div className="space-x-4">
                                                    <button
                                                        onClick={() => setShowDeleteConfirm(null)}
                                                        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(mail._id)}
                                                        className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800">{mail.subject}</h2>
                                            <p className="text-sm text-gray-500 mt-1">From: {mail.email}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setSelectedMail(selectedMail === mail._id ? null : mail._id)}
                                                className="p-2 hover:bg-blue-50 rounded-full transition-colors"
                                            >
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteConfirm(mail._id)}
                                                className="p-2 hover:bg-red-50 rounded-full transition-colors"
                                            >
                                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-gray-600">{mail.message}</p>

                                    {selectedMail === mail._id && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <textarea
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                rows="3"
                                                placeholder="Type your reply here..."
                                            />
                                            <div className="mt-2 flex justify-end space-x-2">
                                                <button
                                                    onClick={() => setSelectedMail(null)}
                                                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleReply(mail._id)}
                                                    className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                                >
                                                    Send Reply
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                                <div className="text-6xl mb-4">📭</div>
                                <p className="text-gray-600 font-medium">No messages found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReplyMail;