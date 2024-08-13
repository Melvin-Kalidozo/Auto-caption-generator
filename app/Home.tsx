// pages/index.tsx (or Home.tsx)
import React from 'react';
import Link from 'next/link';

const Home = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to Our Website</h1>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link href="/about">
              <a className="text-blue-500 hover:underline">About Us</a>
            </Link>
          </li>
          <li>
            <Link href="/contact">
              <a className="text-blue-500 hover:underline">Contact Us</a>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
