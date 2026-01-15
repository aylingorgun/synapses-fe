import React from 'react';
import Link from 'next/link';

const Navbar = ({ breadcrumbs = [] }) => {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-50">
      <div className="items-center space-x-4 mr-auto">
        <h1 className="text-red-500 text-2xl font-bold">Hello World</h1>
      </div>
    </div>
  );
};

export default Navbar;
