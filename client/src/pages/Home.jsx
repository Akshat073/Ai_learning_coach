import React from 'react'
import BookModel from '../components/BookModel'
import CourseVideos from '../components/CourseVideos'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useRef } from 'react'
import RotatingText from '../components/RotatingText'

const Home = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const containerRef = useRef(null);
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <BookModel />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
            <h1 class="text-6xl font-bold text-white tracking-widest mb-4">Welcome to Kid Tutor</h1>
          <div class="items-center justify-center h-[10%] w-[50%] hidden lg:flex mb-15">
            <p class="text-2xl font-bold text-white tracking-widest mr-2">Here You Find </p>

  
  <RotatingText
    texts={['Interactive Lessons', 'Expert Tutors', 'Personalized Learning', 'Fun Activities']}
    mainClassName="px-2 text-2xl text-white font-bold sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
    staggerFrom={"last"}
    initial={{ y: "100%" }}
    animate={{ y: 0 }}
    exit={{ y: "-120%" }}
    staggerDuration={0.025}
    splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
    transition={{ type: "spring", damping: 30, stiffness: 400 }}
    rotationInterval={4000}
    />
          </div>
          <p class="lg:hidden block text-2xl text-white mb-8">Discover the Amazing Experience</p>
          {user._id ? (
            <Link 
              to="/practice" 
              className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-lg font-semibold"
            >
              Get Started
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="px-12 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-lg font-semibold"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Course Videos Section */}
      <CourseVideos />

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students already learning with us
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home
