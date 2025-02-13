import React, { useState, useRef } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import SummeryApi from '../common/SummeryApi';
import Axios from '../utils/Axios';
import emailjs from '@emailjs/browser';


const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const Templates = {
        from_name: 'Surya (Kid Tutor)',
        to_name: formData.name,
        to_email: formData.email,
        year: new Date().getFullYear(),
        company_name: 'Kid Tutor',
    };
    const [loading, setLoading] = useState(false);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error('Please fill all fields');
            return;
        }
        try {
            setLoading(true);
            const response = await Axios({
                ...SummeryApi.postcontact,
                data: {
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message
                }
            })
            console.log(response);
            if (response.data.success) {
                emailjs
                    .send('service_nrj1ns5', 'template_t7t9bbr', Templates, {
                        publicKey: 'NGSr2K5ribYEjAk_V',
                    })
                    .then(
                        () => {
                            console.log('SUCCESS!');
                        },
                        (error) => {
                            console.log('FAILED...', error);
                        }
                    );
                toast.success('Message sent successfully! We will get back to you soon.');
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            } else {
                toast.error(response.data.message || 'Failed to send message');
            }
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: <FiMail className="w-6 h-6" />,
            title: 'Email',
            value: 'Suryansh1440@gmail.com',
            link: 'mailto:suryansh1440@gmail.com'
        },
        {
            icon: <FiPhone className="w-6 h-6" />,
            title: 'Phone',
            value: '+91 7054842131',
            link: 'tel:+91 7054842131'
        },
        {
            icon: <FiMapPin className="w-6 h-6" />,
            title: 'Address',
            value: 'Lovely Professional University',
            link: 'https://maps.google.com'
        }
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8"
        >
            <motion.div variants={itemVariants} className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-4 animate-gradient">
                    Let's Connect
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                    Have questions about our platform? Want to partner with us? We'd love to hear from you.
                    Send us a message and we'll respond as soon as possible.
                </p>
            </motion.div>

            <motion.div
                variants={containerVariants}
                className="grid md:grid-cols-3 gap-8 mb-16"
            >
                {contactInfo.map((info, index) => (
                    <motion.a
                        key={index}
                        variants={itemVariants}
                        href={info.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center space-x-6">
                            <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                                {info.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-1">{info.title}</h3>
                                <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">{info.value}</p>
                            </div>
                        </div>
                    </motion.a>
                ))}
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 backdrop-blur-lg bg-opacity-50"
            >
                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="relative">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-0 peer transition-all duration-300"
                                placeholder=" "
                            />
                            <label className="absolute left-4 top-3 px-1 text-gray-500 pointer-events-none transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-orange-600 -top-3 text-sm bg-white">
                                Name
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-0 peer transition-all duration-300"
                                placeholder=" "
                            />
                            <label className="absolute left-4 top-3 px-1 text-gray-500 pointer-events-none transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-orange-600 -top-3 text-sm bg-white">
                                Email
                            </label>
                        </div>
                    </div>

                    <div className="space-y-6 md:col-span-2">
                        <div className="relative">
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-0 peer transition-all duration-300"
                                placeholder=" "
                            />
                            <label className="absolute left-4 top-3 px-1 text-gray-500 pointer-events-none transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-orange-600 -top-3 text-sm bg-white">
                                Subject
                            </label>
                        </div>
                        <div className="relative">
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="6"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-0 peer transition-all duration-300 resize-none"
                                placeholder=" "
                            />
                            <label className="absolute left-4 top-3 px-1 text-gray-500 pointer-events-none transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-orange-600 -top-3 text-sm bg-white">
                                Message
                            </label>
                        </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl shadow-lg hover:shadow-orange-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <FiSend className="mr-2 animate-bounce-x" />
                                    Send Message
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="mt-16 rounded-3xl overflow-hidden shadow-2xl border-8 border-white"
            >
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3032.856477256904!2d75.72223331533209!3d31.273345022205242!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a6bf703e5d015%3A0x8252c67ff4242c5a!2sLovely%20Professional%20University!5e0!3m2!1sen!2sin!4v1615972586449"
                    width="100%"
                    height="450"
                    className="filter grayscale hover:grayscale-0 transition-all duration-500"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lovely Professional University Location Map"
                />

            </motion.div>
        </motion.div>
    );
};

export default Contact;