"use client"
import './globals.css';
import React, { useEffect, useRef } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import Link from 'next/link';

interface Video {
  url: string;
  label: string;
}

const videoList: Video[] = [
  {
    url: '/captionVideos/1.mp4',
    label: 'Video 1',
  },
  {
    url: '/captionVideos/2.mp4',
    label: 'Video 2',
  },
  {
    url: '/captionVideos/3.mp4',
    label: 'Video 3',
  },
  {
    url: '/captionVideos/4.mp4',
    label: 'Video 4',
  },
];

const WelcomePage: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    let scrollAmount = 0;
    const scrollStep = 2; // Adjust scrolling speed
    const scrollInterval = 20; // Adjust scroll interval

    const scrollContent = () => {
      if (scrollContainer) {
        scrollContainer.scrollLeft += scrollStep;
        scrollAmount += scrollStep;

        // Reset scroll position to the beginning when reaching the end
        if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          scrollAmount = 0;
          scrollContainer.scrollLeft = 0;
        }
      }
    };

    const intervalId = setInterval(scrollContent, scrollInterval);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative min-h-screen grid-background">
      <div className="absolute inset-0 bg-[#202124] bg-opacity-50"></div>

      <div className="relative flex flex-col items-center justify-center p-4 min-h-screen">
        <div className='flex justify-start items-start flex-col w-full max-w-[90%] md:max-w-[90%]'>
          <div className="w-full text-left mb-6">
            <h1 className="text-[2.5rem] md:text-[4rem] font-bold text-white mb-4">
              Welcome to <span className='text-[#0078D4]'>CaptureApp</span> captions creator
            </h1>
            <p className="text-base md:text-lg font-thin w-full md:w-[70%] text-gray-200">
              Welcome to your go-to platform for effortless caption and subtitle creation! Whether you're managing existing projects or starting something new, our tools make it easy to add the perfect captions to your videos. Dive in and start transforming your content today!
            </p>
          </div>
          <div className="text-left mb-6 w-full">
            <p className="text-lg md:text-xl mb-4 font-semibold text-white">
              Get Started on your New Project
            </p>
            <Link href="/caption">
              <button className="flex justify-start items-start w-full md:w-[30%] bg-[#353535] text-[#0078D4] text-lg px-6 py-3 rounded-2xl hover:bg-[#444444] hover:text-[#005a9e] transition-all duration-300">
                <FaPlusCircle className="mr-2" size={24} />
                Create
              </button>
            </Link>
          </div>

          <div className="mb-4 w-full m-auto mt-6">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto scrollbar-none space-x-4 scroll-smooth"
            >
              {videoList.map((video, index) => (
                <div
                  key={index}
                  className={`text-gray-300 flex flex-col justify-center items-center `}
                  style={{
                    minWidth: "400px",
                    height: "100%",
                    padding: ".5em",
                    boxSizing: "border-box",
                  }}
                >
                  <video
                    src={video.url}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    playsInline
                    controls={false}
                    loop
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
