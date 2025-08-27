import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../Hook/useAuth";
import useWebsiteLoading from "../../Hook/useWebsiteLoading.jsx";
import Swal from "sweetalert2";
import { InlineLoading } from "../../Loading";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const { withLoading } = useWebsiteLoading();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all fields',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#9333ea',
        customClass: {
          popup: 'dark-popup'
        }
      });
      return;
    }

    setLoading(true);
    
    try {
      await withLoading(async () => {
        await signIn(email, password);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Login successful!',
          timer: 1500,
          showConfirmButton: false,
          background: '#1f2937',
          color: '#f9fafb',
          customClass: {
            popup: 'dark-popup'
          }
        });
        navigate("/");
      });
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message || 'Failed to login',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#9333ea',
        customClass: {
          popup: 'dark-popup'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    
    try {
      await withLoading(async () => {
        await signInWithGoogle();
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Login successful!',
          timer: 1500,
          showConfirmButton: false,
          background: '#1f2937',
          color: '#f9fafb',
          customClass: {
            popup: 'dark-popup'
          }
        });
        navigate("/");
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Google Sign-in Failed',
        text: error.message || 'Failed to sign in with Google',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#9333ea',
        customClass: {
          popup: 'dark-popup'
        }
      });
    } finally {
      setLoading(false);
    }
  };
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

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-gray-300 text-sm mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 text-sm mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <InlineLoading text="Logging in..." size="sm" showIcon={false} />
              ) : (
                "Login"
              )}
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
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 border border-gray-700 hover:border-gray-500 bg-gray-900 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <InlineLoading text="Signing in..." size="sm" showIcon={false} />
            ) : (
              <>
                <FcGoogle className="w-6 h-6" />
                <span className="text-gray-300 font-medium">Continue with Google</span>
              </>
            )}
          </button>

          {/* Forgot Password & Sign Up */}
          <div className="flex justify-between text-sm text-gray-400 mt-4">
            <a href="#" className="hover:text-purple-400 transition duration-200">
              Forgot Password?
            </a>
            <Link to="/register" className="hover:text-purple-400 transition duration-200">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
