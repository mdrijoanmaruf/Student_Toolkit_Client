import React from 'react';
import { HiAcademicCap } from 'react-icons/hi';

const InlineLoading = ({ 
  size = 'md', 
  text = 'Loading...', 
  showIcon = true,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={`flex items-center justify-center space-x-3 ${className}`}>
      {showIcon && (
        <div className="relative">
          <div className={`bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center ${sizeClasses[size]} animate-pulse`}>
            <HiAcademicCap className={`text-white ${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-6 h-6'}`} />
          </div>
          <div className={`absolute inset-0 border-2 border-transparent border-t-purple-500 rounded-full animate-spin`}></div>
        </div>
      )}
      
      {text && (
        <span className={`text-gray-300 ${textSizes[size]} animate-pulse`}>
          {text}
        </span>
      )}
      
      {!showIcon && (
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      )}
    </div>
  );
};

export default InlineLoading;
