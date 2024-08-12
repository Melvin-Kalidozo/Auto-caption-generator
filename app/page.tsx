
import React from 'react';
import Sidebar from './Sidebar'; 

const Home = () => {
  return (
    <div className="flex">
      <Sidebar />   {/* I have imported Sidebar component */}
      <div className="flex-grow p-4">
        <div className="flex items-center p-2 row">
          <div className="flex items-center p-2 px-4 row">
            <div className="bg-black text-white p-2 rounded-xl m-2">
              Upload
            </div>
            <div className="bg-black text-white p-2 rounded-xl">
              Record
            </div>
          </div>
        </div>


        <hr className="border-t-2 border-gray-300 mt-2 mx-4" />


               {/* using a url for now*/}
        <div className="flex items-center">
          <div className="video-container flex pl-8 mt-4 row">
            <video
              src="https://youtu.be/PN6fRSr4ciM?t=14"   
              controls
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
