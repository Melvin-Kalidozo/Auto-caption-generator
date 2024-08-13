import React from 'react';
import { IoClose, IoVideocam } from 'react-icons/io5';
import { IoMdAddCircle } from "react-icons/io";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Button to close the sidebar */}
      <button 
        className={`fixed top-4 right-4 text-black text-2xl md:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={onClose}
      >
        <IoClose />
      </button>

      {/* Sidebar content */}
      <div className={`bg-gray-900 text-white h-screen w-40 p-4 fixed md:relative md:w-40 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <h2 className="text-xl font-bold mb-4">CaptureApp</h2>
        <ul>
          <li className="mb-2 flex items-center">
            <IoMdAddCircle   className="mr-2" />
            <a href="#" className="hover:underline">Post Video</a>
          
          </li>
          <li className="mb-2 flex items-center">
            <IoVideocam className="mr-2" />
            <a href="#" className="hover:underline">Videos</a>
          
          </li>
          {/* Add more links as needed */}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
