import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store/userSlice';
import { useDispatch } from 'react-redux';
import Axios from '../utils/Axios'; // Changed to use custom Axios instance
import SummeryApi from '../common/SummeryApi';
import AxiosToastError from "../utils/AxiosToastError";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { RxExternalLink } from "react-icons/rx";
import isAdmin from '../utils/isAdmin';



const UserMenu = ({handleCloseAccount = () => {}}) => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await Axios({
                ...SummeryApi.logout,
            });
            if (response.data.success) {
                dispatch(logout());
                localStorage.clear();
                toast.success("Logout Successfully");
                navigate("/");
                handleCloseAccount();
            }
        } catch (err) {
            AxiosToastError(err);
        }
    }

    const handleLinkClick = (path) => {
        navigate(path);
        handleCloseAccount();
    }

    return (
        <div className='p-4'>
            <div className='flex justify-between flex-col gap-3'>
                <div>
                    <p className='text-lg font-semibold mb-1'>My Account</p>
                    <div onClick={() => handleLinkClick("/dashboard/profile")} className='text-sm text-gray-500 flex items-center gap-1 cursor-pointer hover:text-primary-200'>
                        {user.name || user.mobile} 
                        <span className='text-red-600 text-medium'>{user.role=="ADMIN"?"(Admin)":""}</span> 
                        <RxExternalLink /> 
                    </div>
                </div>
                <div className='h-[1px] bg-gray-200'></div>
                <div className='flex flex-col justify-normal items-start gap-2'>
                    {isAdmin(user.role) && (
                        <>
                            <div onClick={() => handleLinkClick("/dashboard/reply-mail")} className='text-sm text-gray-500 hover:bg-orange-100 px-3 py-2 rounded-md w-full cursor-pointer transition-colors'>
                                Reply Mails
                            </div>
                        </>
                    )}
                    <div onClick={() => handleLinkClick("/dashboard/performance")} className='text-sm text-gray-500 hover:bg-orange-100 px-3 py-2 rounded-md w-full cursor-pointer transition-colors'>
                        Performance
                    </div>
                    {/* <div onClick={() => handleLinkClick("/dashboard/my-courses")} className='text-sm text-gray-500 hover:bg-orange-100 px-3 py-2 rounded-md w-full cursor-pointer transition-colors'>
                        My Courses
                    </div> */}
                    <button onClick={handleLogout} className='text-sm bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 w-full transition-colors'>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UserMenu
