"use client";

import React, { useEffect } from 'react';
import Slider from 'react-slick'; // Import react-slick
import { FaPlusCircle } from 'react-icons/fa';
import Header from '../Header';
import Link from 'next/link';

// Sample video URLs for carousel
const videoList = [
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://www.w3schools.com/html/movie.mp4',
  'https://www.w3schools.com/html/mov_bbb.mp4',
];

// Settings for the carousel
const carouselSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 6000, // Change this value to adjust the speed
};

const Projects = () => {
  useEffect(() => {
    const timer = setInterval(() => {
      window.location.reload();
    }, 50000); // Refresh every 5 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <div
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://th.bing.com/th?id=OIP.mrHo6OAO98pXXc1FxB595AHaJQ&w=223&h=279&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div> {/* Overlay */}
        
        <div className="relative flex flex-col items-center justify-center p-4 min-h-screen">
          <div className="w-full max-w-lg text-center mb-6">
            <h1 className="text-4xl font-bold text-white mb-4">Welcome to CaptureApp captions creator</h1>
            <p className="text-lg text-gray-200">Manage your projects, start something new, and create amazing captions!</p>
          </div>
          <div className="text-center mb-6">
            <p className="text-xl mb-4 font-semibold text-white">Get Started on your New Project</p>
       
           <Link  href = "/PostVideo">
            <button className="w-full bg-gray-800 text-white text-lg px-6 py-3 rounded-2xl flex items-center justify-center">
              <FaPlusCircle className="mr-2" size={24} />
              Create
            </button>
            </Link>
          </div>




          
          
          {/* Video Carousel */}
          <div className="w-80 max-w-lg mb-2">
            <Slider {...carouselSettings}>
              {videoList.map((video, index) => (
                <div key={index} className="relative">
                  <video
                    className="w-full h-auto rounded-3xl"
                    src={video}
                    autoPlay
                    muted
                    playsInline
                  />
                </div>
              ))}
            </Slider>
          </div>
          
       
        </div>
      </div>
    </div>
  );
};

export default Projects;
