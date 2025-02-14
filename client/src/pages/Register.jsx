import React, { useState } from 'react'
import { RxEyeOpen } from "react-icons/rx";
import { GoEyeClosed } from "react-icons/go";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummeryApi from '../common/SummeryApi';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { fetchUserDetail } from '../utils/fetchUserDetail';
import emailjs from '@emailjs/browser';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const Frontend_key = import.meta.env.VITE_FRONTEND_URL;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    const validateData = Object.values(data).every(value => value)

    
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (data.password !== data.confirmPassword) {
            toast.error("Password and Confirm Password do not match")
            return
        }

        try {
            setLoading(true)
            const response = await Axios({
                ...SummeryApi.register,
                data: {
                    name: data.username,
                    email: data.email,
                    password: data.password
                }
            })

            if (response.data.success) {
                const verifyEmailUrl = `${Frontend_key}/verify-email?code=${response.data.data._id}`;
                
                const template = {
                    from_name : 'surya (Kid Tutor)',
                    to_name : response.data.data.name,
                    to_email : response.data.data.email,
                    verification_link : verifyEmailUrl,
                }
                
                console.log(template);
                emailjs
                    .send('service_bt497p6', 'template_kpqymxb', template, {
                        publicKey: 'C6F0vjxXkp0ZmjA2w',
                    })
                    .then(
                        () => {
                            console.log('SUCCESS!');
                        },
                        (error) => {
                            console.log('FAILED...', error);
                        }
                    );
                // Store tokens
                localStorage.setItem("accessToken", response.data.data.accessToken)
                localStorage.setItem("refreshToken", response.data.data.refreshToken)
                // Fetch and set user details
                const userDetails = await fetchUserDetail()
                dispatch(setUserDetails(userDetails.data))
                toast.success(response.data.message)
                setData({
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                })
                navigate("/")
            }
        } catch (error) {
            // Improved error handling
            const errorMessage = error.response?.data?.message ||
                error.message ||
                "An unexpected error occurred"
            toast.error(errorMessage)
            console.error("Registration error:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className='h-[calc(100vh-10rem)] flex items-center justify-center contanier'>
            <div className='w-full  max-w-md p-6 bg-white rounded-lg shadow-md'>
                <h1 className='text-2xl font-bold mb-4'>Register</h1>
                <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={data.username}
                        placeholder='Username'
                        name='username'
                        autoFocus
                        className='focus:outline-primery-200 w-full p-2 mb-4 border border-gray-300 rounded-md'
                        onChange={(e) => handleChange(e)}
                    />
                    <input
                        type="email"
                        value={data.email}
                        placeholder='Email'
                        name='email'
                        className='focus:outline-primery-200 w-full p-2 mb-4 border border-gray-300 rounded-md'
                        onChange={(e) => handleChange(e)}
                    />
                    <div className='flex items-center justify-center relative'>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={data.password}
                            placeholder='Password'
                            name='password'
                            className='focus:outline-primery-200 w-full p-2 mb-4 border border-gray-300 rounded-md'
                            onChange={(e) => handleChange(e)}
                        />
                        {
                            showPassword ? <RxEyeOpen
                                className='absolute right-2 top-1/2 -translate-y-4 text-gray-500 cursor-pointer'
                                onClick={() => setShowPassword(false)}
                            />
                                : <GoEyeClosed
                                    className='absolute right-2 top-1/2 -translate-y-4 text-gray-500 cursor-pointer'
                                    onClick={() => setShowPassword(true)}
                                />
                        }
                    </div>
                    <div className='flex items-center justify-center relative'>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={data.confirmPassword}
                            placeholder='Confirm Password'
                            name='confirmPassword'
                            className='focus:outline-primery-200 w-full p-2 mb-4 border border-gray-300 rounded-md'
                            onChange={(e) => handleChange(e)}
                        />
                        {
                            showConfirmPassword ? <RxEyeOpen
                                className='absolute right-2 top-1/2 -translate-y-4 text-gray-500 cursor-pointer'
                                onClick={() => setShowConfirmPassword(false)}
                            />
                                : <GoEyeClosed
                                    className='absolute right-2 top-1/2 -translate-y-4 text-gray-500 cursor-pointer'
                                    onClick={() => setShowConfirmPassword(true)}
                                />
                        }
                    </div>
                    <button
                        type="submit"
                        disabled={!validateData || loading}
                        className={`w-full p-2 text-white rounded-md ${validateData && !loading
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {loading ? "Loading..." : "Register"}
                    </button>
                </form>
                <p className='text-center text-gray-500'>Already have an account? <Link to="/login" className='text-green-500 hover:text-green-600'>Login</Link></p>
            </div>
        </section>
    )
}

export default Register
