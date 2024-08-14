"use client";

import React, { useState } from 'react';
import Sidebar from '../Sidebar'; 
import { FaPlay, FaPause, FaUpload } from 'react-icons/fa';
import { IoMenu } from 'react-icons/io5'; 
import Header from '../Header';



const Video = () => {
  const [videos, setVideos] = useState([
    'https://www.w3schools.com/html/mov_bbb.mp4',
    'https://www.w3schools.com/html/movie.mp4',
    'https://www.w3schools.com/html/mov_bbb.mp4',
    'https://www.w3schools.com/html/movie.mp4',
    'https://www.w3schools.com/html/movie.mp4',
    'https://www.w3schools.com/html/movie.mp4',
    'https://www.w3schools.com/html/movie.mp4',
    'https://www.w3schools.com/html/movie.mp4',
    'https://www.w3schools.com/html/movie.mp4',
    'https://www.w3schools.com/html/movie.mp4',
    'https://www.w3schools.com/html/movie.mp4',
    
    // Add more video URLs here
  ]);
  const [playingIndex, setPlayingIndex] = useState(null); // Track which video is playing
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const togglePlayPause = (index, videoRef) => {
    if (playingIndex === index) {
      videoRef.pause();
      setPlayingIndex(null);
    } else {
      if (playingIndex !== null) {
        document.querySelector(`video[data-index="${playingIndex}"]`).pause();
      }
      videoRef.play();
      setPlayingIndex(index);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div>
      <Header />
      <div className="flex min-h-screen bg-gray-100">
        
        {/* Button to open the sidebar on mobile */}
    



        <hr className="border-t-4 border-gray-300 my-8" />

        {/* Main content area where the videos will be displayed */}
        <div className="flex flex-wrap items-center justify-center w-full p-8 gap-4">
          {videos.map((videoSrc, index) => (
            <div key={index} className="flex flex-col items-center justify-center w-full p-4 bg-white shadow-lg rounded-xl">
              <video
                src={videoSrc}
                data-index={index}
                className="w-full h-auto rounded-xl"
                controls
              />
              <h1>Title</h1>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-xl"
                onClick={(e) => togglePlayPause(index, e.target.previousSibling)}
              >
                {playingIndex === index ? <FaPause /> : <FaPlay />}
                <span className="ml-2">{playingIndex === index ? 'Pause' : 'Play'}</span>
              </button>
              <h1 className='text-sm  font-semibold' >Posted 1 min ago</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Video;
