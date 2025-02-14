import React, { useState } from 'react'
import { RxEyeOpen } from "react-icons/rx";
import { GoEyeClosed } from "react-icons/go";
import SummeryApi from '../common/SummeryApi';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { fetchUserDetail } from '../utils/fetchUserDetail';

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        email: "",
        password: "",
    })
    const handleChange = (e) => {
        const { name, value } = e.target
        setData((prev) => ({ ...prev, [name]: value }))
    }
    const validateData = Object.values(data).every(value => value)
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            setLoading(true)
            const response = await Axios({
                ...SummeryApi.login,
                data:{
                    email:data.email,
                    password:data.password
                }
            })
            if(response.data.success){
                toast.success(response.data.message)
                localStorage.setItem("accessToken",response.data.data.accessToken)
                localStorage.setItem("refreshToken",response.data.data.refreshToken)
                const userDetails = await fetchUserDetail()
                dispatch(setUserDetails(userDetails.data))
                setData({
                    email:"",
                    password:"",
                })
                navigate("/")
            }
        }
        catch(error){
            AxiosToastError(error)
        }
        finally{
            setLoading(false)
        }
    }

    return (
        <div>
            <section className='h-[calc(100vh-10rem)] flex items-center justify-center contanier'>
                <div className='w-full  max-w-md p-6 bg-white rounded-lg shadow-md'>
                    <h1 className='text-2xl font-bold mb-4'>Login</h1>
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                        <input 
                            type="email" 
                            value={data.email} 
                            placeholder='Email' 
                            name='email' 
                            className='focus:outline-primery-200 w-full p-2 mb-4 border border-gray-300 rounded-md' 
                            onChange={handleChange} 
                        />
                        <div className='flex items-center justify-center relative'>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={data.password} 
                                placeholder='Password' 
                                name='password' 
                                className='focus:outline-primery-200 w-full p-2 mb-4 border border-gray-300 rounded-md' 
                                onChange={handleChange} 
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

                        {/* <p className='text-center text-gray-500'>
                            <Link to="/forgot-password" className='ml-auto p-0 hover:text-primary-200'>
                                Forgot Password?
                            </Link>
                        </p> */}
                        <button 
                            disabled={!validateData || loading} 
                            type="submit" 
                            className={`${validateData && !loading ? "bg-green-600" : "bg-gray-600"} w-full p-2 text-white rounded-md`}
                        >
                            {loading ? "Loading..." : "Login"}
                        </button>
                    </form>
                    <p className='text-center text-gray-500 mt-4'>
                        Don't have an account? 
                        <Link to="/register" className='text-green-500 hover:text-green-600 ml-1'>
                            Register
                        </Link>
                    </p>
                </div>
            </section>
        </div>
    )
}

export default Login;
