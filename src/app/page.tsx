"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [showMsg, setShowMsg] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-start justify-center px-6 sm:pl-16 lg:pl-24 xl:pl-32 overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/bg.webp"
          alt="Cinematic background"
          fill
          priority
          quality={100}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30" />
      </div>

      {/* Content */}
      <div className={`space-y-8 transition-all duration-700 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Title with cinematic effect */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-pink-400 drop-shadow-2xl select-none">
          Movie Hub
          <span className="ml-2 text-4xl align-top">🎬</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-300 max-w-md">
          Your ultimate destination for movie discovery and collections
        </p>
        
        {/* Sign In Button */}
        <button
          onClick={() => setShowMsg(true)}
          className="group relative px-8 py-3.5 rounded-lg bg-gradient-to-r from-[#e63946] to-[#ff758f] text-lg font-semibold text-white transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-black/50"
        >
          <span className="relative z-10">Sign In</span>
          <span className="absolute inset-0 bg-gradient-to-r from-[#ff758f] to-[#e63946] opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300" />
        </button>
      </div>

      {/* Modal */}
      {showMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
            onClick={() => setShowMsg(false)}
          />
          
          {/* Modal Content */}
          <div className="relative z-10 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl px-8 py-6 flex flex-col items-center max-w-sm w-full mx-4 animate-scaleIn">
            <button
              onClick={() => setShowMsg(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-light transition-colors duration-200 focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>
            
            {/* Icon */}
            <div className="mb-4 p-3 bg-blue-900/30 rounded-full border border-blue-700/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
            
            {/* Message */}
            <p className="text-gray-300 text-center mb-6">
              This app is currently in development. Stay tuned for upcoming features!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}