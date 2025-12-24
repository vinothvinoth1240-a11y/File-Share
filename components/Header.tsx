
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="flex justify-center items-center gap-3 mb-2 animate-float">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight">
        Nova<span className="gradient-text">Share</span>
      </h1>
      <p className="text-gray-400 mt-2 text-lg font-light">
        Simple, private, lightning-fast file sharing.
      </p>
    </header>
  );
};

export default Header;
