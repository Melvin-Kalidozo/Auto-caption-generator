// components/Header.js
import React from 'react';
import { IoMdAddCircle } from "react-icons/io";
import { IoVideocam } from 'react-icons/io5';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-900 text-white p-4 shadow-md w-full flex justify-between items-center">
      <nav>
        <ul className="flex space-x-4">
          <li>
            <h2 className="text-xl font-bold mb-4">CaptureApp</h2>
          </li>
          <li className="mb-2 flex items-center pl-2">
            <IoMdAddCircle className="mr-2" />
            <Link href="/PostVideo">
              <h1 className="hover:underline">Post Video</h1>
            </Link>
          </li>
          <li className="mb-2 flex items-center">
            <IoVideocam className="mr-2" />
            <Link href="/ViewVideo">
              <h1 className="hover:underline">Videos</h1>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
