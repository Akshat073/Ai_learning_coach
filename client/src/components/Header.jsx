import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import MainLogo from '../assets/MainLogo.png'
import Search from './Search'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import UserMenu from './UserMenu';
import { LuContact } from "react-icons/lu";
import { MdAccountCircle } from "react-icons/md";
import { MdLogin } from "react-icons/md";
import useIsMobile from '../hooks/useIsMobile';

const Header = () => {
    const [isAccountOpen, setIsAccountOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isSearch = location.pathname === "/search";
  const isMobile = useIsMobile();
  const user = useSelector((state) => state.user);

  const handleAccount = () => {
    setIsAccountOpen(!isAccountOpen);
  }

  function handleCloseAccount(){
    setIsAccountOpen(false);
  }

    return (
        <header className={`fixed top-0 z-50 lg:pt-0 pt-1 bg-white shadow-md w-full lg:h-[10%] ${!isSearch ? 'h-[15%]' : 'h-[8%]'}`}>

          {
            isSearch && isMobile ? (<div className='mt-1'>
              <Link to="/search" className='lg:hidden block absolute w-[95%] left-1/2 transform -translate-x-1/2'>
                      <Search />
                  </Link>
              </div>) : (<>
                <div className='container mx-auto lg:px-8 px-4 flex items-center justify-between'>
                {/* Logo */}
                <Link to="/" className='flex items-center lg:w-[70px] w-[50px]    ml-4'>
                    <img
                        src={MainLogo}

                        alt="Main Logo"
                        height={75}
                    />
                </Link>

                {/* Centered Search */}

                <Link to="/search" className='lg:block hidden absolute left-1/2 transform -translate-x-1/2'>
                    <Search />
                </Link>

                

                {/* Navigation Links */}
                <nav className='items-center space-x-8 flex'>
                  {
                    user?._id && ( <Link to="/Practice" className=" text-lg hover:text-blue-600 transition-colors">
                      Practice
                  </Link>)
                  }
                    <Link to="/LeaderBoard" className='text-lg hover:text-blue-600 transition-colors'>
                        Ranking
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
                  ):
                  (
                    <Link to="/login" className='text-lg px-2 hover:text-blue-600 transition-colors'>
                        <p className='lg:block hidden'>Login</p>
                        <p className='lg:hidden block text-2xl'><MdLogin /></p>
                      </Link>
                  )
                }
                </nav>
            </div>
            <div className='mt-1'>
            <Link to="/search" className='lg:hidden block absolute w-[95%] left-1/2 transform -translate-x-1/2'>
                    <Search />
                </Link>
            </div>
            </>
              )
          }

            

        </header>
    )
}

export default Header
