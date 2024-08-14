import React from 'react';
import Link from 'next/link';
import { IoIosArrowBack } from "react-icons/io";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-4 shadow-md w-full flex justify-start items-center">
      <nav className="flex items-center space-x-4">
        <Link href="/Home">
          <IoIosArrowBack className="text-3xl cursor-pointer hover:text-gray-400 transition duration-200 ease-in-out"/>
        </Link>
        <h1 className="text-2xl font-semibold tracking-wide">CaptureApp</h1>
      </nav>
    </header>
  );
};

export default Header;
