

//Here it is the page for video caption 

"use client";
import '../globals.css';
import React, { useState } from 'react';
import { FaUpload, FaFilter, FaTextHeight } from 'react-icons/fa';
import Header from '../Header';
import { FaClosedCaptioning } from "react-icons/fa";


const Caption: React.FC = () => {
  const [videoSrc, setVideoSrc] = useState('https://www.w3schools.com/html/mov_bbb.mp4');// I just used Url
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [brightness, setBrightness] = useState(100); // Brightness state
  const [fontSize, setFontSize] = useState(16); // Font size state
  const [fontColor, setFontColor] = useState('#ffffff'); // Font color state
  const [fontFamily, setFontFamily] = useState('Arial'); // Font family state
  const [showFontOptions, setShowFontOptions] = useState(false); // Toggle font options





  const handleUpload = () => {
    //logic for uploading the video
    console.log('Uploading video...');
  };





  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //apa logic for brightness change
    setBrightness(Number(e.target.value));
  };

  
  
  
  const toggleFontOptions = () => {
    //here it is the logic for font options
    setShowFontOptions(!showFontOptions);
  };




  return (
    <div 
      className="bg-black text-white flex flex-col min-h-screen"
      style={{ filter: `brightness(${brightness}%)` }} // Applying brightness to the background
    >
      <Header />
      <div className="flex-grow flex justify-center items-center">
        <div className="video-container w-full relative">
          <video
            src={videoSrc}
            controls
            className="shadow-lg w-full h-[75vh] max-h-[750px]"
            ref={(ref) => setVideoRef(ref)}
            style={{ filter: `brightness(${brightness}%)` }} // Applying the brightness to the video
            autoPlay
          />
        </div>
      </div>



      {/* This is the footer Section */}
      <footer className="bg-gray-900 text-white p-8 px-4 mt-auto">



           
        {/* Here is the font Options after pressing font button*/}
        {showFontOptions && (
          <div className="flex flex-col mb-4 space-y-4 items-center justify-center">
            <div className="flex items-center">
              <label className="mr-4">Font Size:</label>
              <input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="text-black w-60 p-1 rounded-xl"
              />
            </div>
            <div className="flex items-center">
              <label className="mr-2">Font Color:</label>
              <input
                type="color"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className="w-60 p-1 rounded-xl"
              />
            </div>
            <div className="flex items-center">
              <label className="mr-3">Font Type:</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="text-black w-60 p-1 rounded-xl"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Verdana">Verdana</option>
              </select>
            </div>
          </div>
        )}





        <div className="flex justify-center">
          <button 
            className="bg-gray-900 text-white px-4 mr-2 py-2 rounded-xl border border-black"
            onClick={handleUpload}
          >
            <FaUpload size={26} className="items-center text-center ml-3" />
            <h1>Upload</h1>
          </button>
          <button 
            className="bg-gray-900 text-white  px-4 mr-2 py-2 rounded-xl items-center border border-black"
            onClick={handleUpload}
          >
            <FaClosedCaptioning size={26} className="ml-3" /> Caption
          </button>
          
          <button 
            className="bg-gray-900 text-white px-3 py-2 rounded-xl items-center border border-black"
            onClick={toggleFontOptions}
          >
            <FaTextHeight size={26} className="ml-3" /> Edit Font
          </button>
        </div>

        {/* Here is the brightness Control */}
        <div className="flex w-full mt-4 items-center justify-center">
          <label className="mr-2">Brightness:</label>
          <input
            type="range"
            min="50"
            max="150"
            value={brightness}
            onChange={handleBrightnessChange}
            className="w-60 "
          />
        </div>

      </footer>
    </div>
  );
};

export default Caption;
