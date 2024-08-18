import React from 'react';
import Link from 'next/link';
import { IoIosArrowBack } from "react-icons/io";

const Header = () => {
  return (
    <header className=" text-white py-4 w-[95%] md:w-[80%] shadow-md  flex justify-start items-center">
      <nav className="flex items-center space-x-4">
        <Link href="/">
          <IoIosArrowBack className="text-3xl cursor-pointer hover:text-gray-400 transition duration-200 ease-in-out"/>
        </Link>
        <h1 className="text-2xl font-semibold tracking-wide">CaptureApp</h1>
      </nav>
    </header>
  );
};

export default Header;
