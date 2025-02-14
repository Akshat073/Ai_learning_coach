import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import MainLogo from '../assets/MainLogo.png'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import UserMenu from './UserMenu';
import { LuContact } from "react-icons/lu";
import { MdAccountCircle } from "react-icons/md";
import { MdLogin } from "react-icons/md";
import useIsMobile from '../hooks/useIsMobile';
import { FaRankingStar } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import { GiArcheryTarget } from "react-icons/gi";


const Header = () => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const user = useSelector((state) => state.user);

  const handleAccount = () => {
    setIsAccountOpen(!isAccountOpen);
  }

  function handleCloseAccount() {
    setIsAccountOpen(false);
  }

  return (
    <header className='fixed top-0 z-50 lg:pt-0 pt-1 bg-white shadow-md w-full lg:h-[10%] h-[8%]'>
      <div className='container mx-auto lg:px-8 px-4 flex items-center justify-between'>
        {/* Logo */}
        <Link to="/" className='flex items-center lg:w-[70px] w-[50px] ml-4'>
          <img
            src={MainLogo}
            alt="Main Logo"
            height={75}
          />
        </Link>


        {/* Navigation Links */}
        <nav className='items-center space-x-8 flex'>
        {/* <Link to="/" className='text-lg hover:text-blue-600 transition-colors'>
            <p className="hidden lg:block text-lg">Home</p>
            <p className="block lg:hidden text-2xl"><IoHome /></p>
          </Link> */}
          {
            user?._id && (<Link to="/practice" className='text-lg hover:text-blue-600 transition-colors'>
              <p className="hidden lg:block text-lg">Practice</p>
              <p className="block lg:hidden text-2xl"><GiArcheryTarget /></p>
            </Link>)
          }
          <Link to="/leaderBoard" className='text-lg hover:text-blue-600 transition-colors'>
            <p className="hidden lg:block text-lg">Ranking</p>
            <p className="block lg:hidden text-2xl"><FaRankingStar /></p>
          </Link>
          <Link
            to="/contact-us"
            className='text-lg hover:text-blue-600 transition-colors'
          >
            <p className='lg:hidden block text-2xl'><LuContact /></p>
            <p className='lg:block hidden'>Contact Us</p>
          </Link>

          {
            user?._id ? (
              <div className='relative'>
                <div onClick={handleAccount} className='flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors text-lg'>
                  <p className='lg:block hidden'>Account</p>
                  <p className='lg:hidden block text-2xl'><MdAccountCircle /></p>
                  {isAccountOpen ? (
                    <FaAngleUp className="text-2xl" />
                  ) : (
                    <FaAngleDown className="text-2xl" />
                  )}
                </div>
                {isAccountOpen && (
                  <div className={`absolute ${isMobile ? 'top-10' : 'top-12'} z-51 right-0`}>
                    <div className='bg-white p-4 rounded-lg lg:shadow-md min-w-[250px]'>
                      <UserMenu handleCloseAccount={handleCloseAccount} />
                    </div>
                  </div>
                )}
              </div>
            ) :
              (
                <Link to="/login" className='text-lg px-2 hover:text-blue-600 transition-colors'>
                  <p className='lg:block hidden'>Login</p>
                  <p className='lg:hidden block text-2xl'><MdLogin /></p>
                </Link>
              )
          }
        </nav>
      </div>
    </header>
  )
}

export default Header
