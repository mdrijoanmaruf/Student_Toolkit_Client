import React from "react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-8 md:p-10 flex flex-col md:flex-row items-center md:space-x-10 transition-all duration-300">
        
        {/* Left Section - Image or Logo */}
        <div className="hidden md:flex flex-col items-center justify-center space-y-4 w-1/2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/5087/5087579.png"
            alt="Login Illustration"
            className="w-64 h-64"
          />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
            Welcome Back!
          </h2>
          <p className="text-gray-400 text-center text-sm">
            Sign in to access your dashboard and manage your student toolkit.
          </p>
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-1/2 space-y-6">
          <h2 className="text-3xl font-bold text-white text-center md:text-left">
            Login to Your Account
          </h2>

          <form className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-gray-300 text-sm mb-1">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 text-sm mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center justify-center space-x-2">
            <span className="h-px bg-gray-700 w-24"></span>
            <span className="text-gray-400 text-sm">or</span>
            <span className="h-px bg-gray-700 w-24"></span>
          </div>

          {/* Google Login */}
          <button
            className="w-full flex items-center justify-center space-x-3 border border-gray-700 hover:border-gray-500 bg-gray-900 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <FcGoogle className="w-6 h-6" />
            <span className="text-gray-300 font-medium">Continue with Google</span>
          </button>

          {/* Forgot Password & Sign Up */}
          <div className="flex justify-between text-sm text-gray-400 mt-4">
            <a href="#" className="hover:text-purple-400 transition duration-200">
              Forgot Password?
            </a>
            <a href="/register" className="hover:text-purple-400 transition duration-200">
              Create an Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
