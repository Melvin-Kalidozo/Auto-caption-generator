"use client";

import './globals.css';
import React from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import Link from 'next/link';

const videoList = [
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://www.w3schools.com/html/movie.mp4',
  'https://www.w3schools.com/html/mov_bbb.mp4',
];

const carouselSettings = {
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 6000,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        centerPadding: '0%',
      },
    },
  ],
};

const WelcomePage = () => {
  return (
    <div className="relative min-h-screen grid-background">
      <div className="absolute inset-0 bg-[#202124] bg-opacity-50"></div>

      <div className="relative flex flex-col items-center justify-center p-4 min-h-screen">
        <div className=' flex justify-start items-start flex-col'>
          <div className="w-full  text-left mb-6">
            <h1 className="text-[4rem] font-bold text-white mb-4">Welcome to <span className='text-[#0078D4]'>CaptureApp</span> captions creator</h1>
            <p className="text-lg text-gray-200">Manage your projects, start something new, and create amazing captions!</p>
          </div>
          <div className="text-left mb-6">
            <p className="text-xl mb-4 font-semibold text-white">Get Started on your New Project</p>
            <Link href="/caption">
              <button className="w-full bg-[#353535] text-[#0078D4] text-lg px-6 py-3 rounded-2xl flex items-center justify-center">
                <FaPlusCircle className="mr-2" size={24} />
                Create
              </button>
            </Link>
          </div>


          {/* Uncomment the following lines if you want to use the carousel */}
          {/* <div className="w-full max-w-4xl mb-2">
          <Slider {...carouselSettings}>
            {videoList.map((video, index) => (
              <div key={index} className="mx-4 relative flex justify-center items-center">
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
        </div> */}

        </div>
      </div>
    </div>
  )
};

export default WelcomePage;
