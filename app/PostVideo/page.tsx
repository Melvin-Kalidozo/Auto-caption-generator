"use client";

import React, { useState } from 'react';
import Sidebar from '../Sidebar'; 
import { FaPlay, FaPause, FaUpload } from 'react-icons/fa';
import { IoMenu } from 'react-icons/io5'; // Import the menu icon for mobile
import { IoIosCut } from "react-icons/io";
import Header from '../Header';

const PostVideo: React.FC = () => {
  const [videoSrc, setVideoSrc] = useState('https://www.w3schools.com/html/mov_bbb.mp4');
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoRef, setVideoRef] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility
  const [selectedFile, setSelectedFile] = useState(null);

  const togglePlayPause = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTrim = () => {
   
  };
  









  const handleUpload = () => {
    // Logic for uploading a new video
    console.log('Uploading video...');
  };










  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (<div>

    <Header />
    <div className="flex min-h-screen bg-gray-100">
      

      <div className="flex-grow p-4">
        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md mt-4">
          <div className="flex items-center space-x-4">
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center"
              onClick={handleUpload}
            >
              <FaUpload className="mr-2" /> Upload
            </button>
            <button 
              className="bg-red-500 text-white px-4 py-2 rounded-xl flex items-center"
              onClick={togglePlayPause}
            >
              {isPlaying ? <FaPause className="mr-2" /> : <FaPlay className="mr-2" />} 
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button 
              className="bg-yellow-500 text-white px-4 py-2 rounded-xl flex items-center"
              onClick={handleTrim}
            >
              <IoIosCut className="mr-2" /> Trim
            </button>
          </div>
        </div>

        <hr className="border-t-2 border-gray-300 my-4" />

        <div className="flex items-center justify-center">
          <div className="video-container flex flex-col items-center mt-4">
            <video
              src={videoSrc}   
              controls
              className="rounded-lg shadow-lg w-full max-w-xl"
              ref={(ref) => setVideoRef(ref)}
            />
            <div className="flex mt-4 space-x-4">
              <button 
                className="bg-green-500 text-white px-4 py-2 rounded-xl flex items-center"
                onClick={() => alert('Applying filter...')}
              >
                Apply Filter
              </button>
              <button 
                className="bg-purple-500 text-white px-4 py-2 rounded-xl flex items-center"
                onClick={() => alert('Adding text...')}
              >
                Add Text
              </button>
              <button 
                className="bg-indigo-500 text-white px-4 py-2 rounded-xl flex items-center"
                onClick={() => alert('Adding stickers...')}
              >
                Add Stickers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default PostVideo;
