import React from 'react';
import { HiAcademicCap } from 'react-icons/hi';

const WebsiteLoading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
          {[...Array(96)].map((_, i) => (
            <div
              key={i}
              className="border border-purple-500/10 animate-pulse"
              style={{
                animationDelay: `${(i * 0.1) % 3}s`,
                animationDuration: '3s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Central Loading Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Main Loading Animation - Centered */}
        <div className="relative flex items-center justify-center mb-12">
          {/* Outer Ring */}
          <div className="w-32 h-32 border-4 border-purple-500/20 rounded-full animate-spin-slow relative flex items-center justify-center">
            {/* Inner Ring */}
            <div className="absolute w-24 h-24 border-4 border-t-purple-400 border-r-violet-400 border-b-purple-600 border-l-violet-600 rounded-full animate-spin"></div>
            
            {/* Core Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-violet-600 to-purple-800 rounded-full flex items-center justify-center shadow-2xl z-10">
              <HiAcademicCap className="w-8 h-8 text-white animate-pulse" />
            </div>

            {/* Orbiting Dots */}
            <div className="absolute inset-0 animate-spin-reverse">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"></div>
              <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-3 h-3 bg-violet-400 rounded-full shadow-lg shadow-violet-400/50"></div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"></div>
              <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-3 h-3 bg-violet-400 rounded-full shadow-lg shadow-violet-400/50"></div>
            </div>
          </div>

          {/* Pulsing Background Circle */}
          <div className="absolute w-48 h-48 bg-purple-600/10 rounded-full animate-ping"></div>
        </div>

        {/* Brand */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-purple-300 bg-clip-text text-transparent mb-3 tracking-wide">
            StudyMate
          </h1>
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent w-12"></div>
            <span className="text-sm font-medium tracking-widest uppercase">Student Life Toolkit</span>
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent w-12"></div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-8 text-center">
          {/* Animated Progress Bar */}
          <div className="w-80 mx-auto mb-4">
            <div className="bg-gray-800/50 rounded-full h-2 overflow-hidden backdrop-blur-sm border border-gray-700/50">
              <div className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 h-full rounded-full animate-pulse shadow-lg shadow-purple-500/30">
                <div className="h-full bg-gradient-to-r from-white/20 to-transparent rounded-full animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Loading Text with Typewriter Effect */}
          <div className="text-gray-300 text-lg font-medium">
            <span className="inline-block animate-pulse">Initializing your workspace</span>
            <span className="inline-block animate-bounce ml-1">...</span>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-30 animate-float"
              style={{
                left: `${15 + (i * 15)}%`,
                top: `${20 + (i * 10)}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${3 + (i * 0.5)}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-4 left-4 w-20 h-20 border-l-2 border-t-2 border-purple-500/30 animate-pulse"></div>
      <div className="absolute top-4 right-4 w-20 h-20 border-r-2 border-t-2 border-violet-500/30 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-4 left-4 w-20 h-20 border-l-2 border-b-2 border-purple-500/30 animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-4 right-4 w-20 h-20 border-r-2 border-b-2 border-violet-500/30 animate-pulse" style={{animationDelay: '1.5s'}}></div>

      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 pointer-events-none"></div>
    </div>
  );
};

export default WebsiteLoading;