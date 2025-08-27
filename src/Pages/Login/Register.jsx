import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../Hook/useAuth";
import Swal from "sweetalert2";
import { updateProfile } from "firebase/auth";
import { InlineLoading } from "../../Loading";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    photoFile: null
  });
  const [loading, setLoading] = useState(false);
  const { createUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.password) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#9333ea',
        customClass: {
          popup: 'dark-popup'
        }
      });
      return;
    }

    if (formData.password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Weak Password',
        text: 'Password must be at least 6 characters long',
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
      // Create user account
      const result = await createUser(formData.email, formData.password);
      
      // Update user profile with name and photo
      if (result.user) {
        let photoURL = null;
        
        // If photo file is selected, you might want to upload it to Firebase Storage
        // For now, we'll use a default photo URL or leave it empty
        if (formData.photoFile) {
          // TODO: Implement photo upload to Firebase Storage
          // photoURL = await uploadPhotoToStorage(formData.photoFile);
        }
        
        await updateProfile(result.user, {
          displayName: formData.fullName,
          photoURL: photoURL
        });
      }
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Registration successful!',
        timer: 1500,
        showConfirmButton: false,
        background: '#1f2937',
        color: '#f9fafb',
        customClass: {
          popup: 'dark-popup'
        }
      });
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.message || 'Failed to create account',
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

  const handleGoogleSignUp = async () => {
    setLoading(true);
    
    try {
      await signInWithGoogle();
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Registration successful!',
        timer: 1500,
        showConfirmButton: false,
        background: '#1f2937',
        color: '#f9fafb',
        customClass: {
          popup: 'dark-popup'
        }
      });
      navigate("/");
    } catch (error) {
      console.error("Google sign-up error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Google Sign-up Failed',
        text: error.message || 'Failed to sign up with Google',
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
        
        {/* Left Section - Illustration */}
        <div className="hidden md:flex flex-col items-center justify-center space-y-4 w-1/2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/5087/5087579.png"
            alt="Register Illustration"
            className="w-64 h-64"
          />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
            Join Us!
          </h2>
          <p className="text-gray-400 text-center text-sm">
            Create your account to manage your student toolkit and access premium features.
          </p>
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-1/2 space-y-6">
          <h2 className="text-3xl font-bold text-white text-center md:text-left">
            Create Account
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="block text-gray-300 text-sm mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200"
                required
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-gray-300 text-sm mb-1">Profile Photo (Optional)</label>
              <input
                type="file"
                name="photoFile"
                accept="image/*"
                onChange={handleInputChange}
                className="w-full text-gray-300 text-sm cursor-pointer file:bg-gray-700 file:text-white file:px-4 file:py-2 file:rounded-lg file:border-none file:mr-4 hover:file:bg-purple-600 transition-all duration-200"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-300 text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 text-sm mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password (min 6 characters)"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200"
                required
                minLength={6}
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <InlineLoading text="Creating Account..." size="sm" showIcon={false} />
              ) : (
                "Register"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center justify-center space-x-2">
            <span className="h-px bg-gray-700 w-24"></span>
            <span className="text-gray-400 text-sm">or</span>
            <span className="h-px bg-gray-700 w-24"></span>
          </div>

          {/* Google Sign-Up */}
          <button
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 border border-gray-700 hover:border-gray-500 bg-gray-900 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <InlineLoading text="Signing up..." size="sm" showIcon={false} />
            ) : (
              <>
                <FcGoogle className="w-6 h-6" />
                <span className="text-gray-300 font-medium">Continue with Google</span>
              </>
            )}
          </button>

          {/* Already have account */}
          <div className="text-center mt-4 text-gray-400 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-400 hover:underline transition duration-200">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
