import React, { useState } from "react";
import { FaFacebook, FaInstagram, FaGithub, FaLinkedin, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane } from "react-icons/fa";
import { HiAcademicCap, HiMail, HiLocationMarker } from "react-icons/hi";
import Swal from "sweetalert2";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill in all fields',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#9333ea',
        customClass: {
          popup: 'dark-popup'
        }
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate form submission
    setTimeout(() => {
      Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: 'Thank you for contacting us. We\'ll get back to you soon!',
        timer: 3000,
        showConfirmButton: false,
        background: '#1f2937',
        color: '#f9fafb',
        customClass: {
          popup: 'dark-popup'
        }
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 via-violet-600 to-purple-800 rounded-full flex items-center justify-center shadow-2xl">
              <HiAcademicCap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-purple-300 bg-clip-text text-transparent mb-6">
            Get In Touch
          </h1>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
            Have questions about StudyMate? Want to share feedback or need support? 
            We'd love to hear from you and help make your student journey better.
          </p>
          <div className="flex items-center justify-center space-x-2 mt-6">
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent w-20"></div>
            <span className="text-sm font-medium tracking-widest uppercase text-gray-400">Contact Us</span>
            <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent w-20"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 p-8 md:p-10">
              <div className="flex items-center mb-8">
                <FaPaperPlane className="w-6 h-6 text-purple-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Send us a Message</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2 ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:from-purple-700 hover:via-violet-700 hover:to-purple-800'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            
            {/* Contact Cards */}
            <div className="space-y-6">
              {/* Email Card */}
              <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FaEnvelope className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Email Us</h3>
                    <p className="text-purple-300">rijoanmaruf@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:border-violet-500/50 transition-all duration-300 group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FaPhone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Call Us</h3>
                    <p className="text-violet-300">+8801813606468</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-semibold text-white mb-6">Connect With Us</h3>
              <div className="grid grid-cols-3 gap-4">
                <a 
                  href="https://www.facebook.com/md.rijoanmaruf" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex flex-col items-center p-4 rounded-xl bg-gray-900/50 hover:bg-blue-600/20 border border-gray-600/50 hover:border-blue-500/50 transition-all duration-300"
                >
                  <FaFacebook className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                  <span className="text-xs text-gray-400 group-hover:text-blue-400 mt-2">Facebook</span>
                </a>
                
                <a 
                  href="https://www.instagram.com/rijoanmaruf" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex flex-col items-center p-4 rounded-xl bg-gray-900/50 hover:bg-pink-600/20 border border-gray-600/50 hover:border-pink-500/50 transition-all duration-300"
                >
                  <FaInstagram className="w-6 h-6 text-gray-400 group-hover:text-pink-400 transition-colors duration-300" />
                  <span className="text-xs text-gray-400 group-hover:text-pink-400 mt-2">Instagram</span>
                </a>
                
                <a 
                  href="https://github.com/mdrijoanmaruf" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex flex-col items-center p-4 rounded-xl bg-gray-900/50 hover:bg-gray-600/20 border border-gray-600/50 hover:border-gray-400/50 transition-all duration-300"
                >
                  <FaGithub className="w-6 h-6 text-gray-400 group-hover:text-gray-300 transition-colors duration-300" />
                  <span className="text-xs text-gray-400 group-hover:text-gray-300 mt-2">GitHub</span>
                </a>
                
                <a 
                  href="https://www.linkedin.com/in/mdrijoanmaruf/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex flex-col items-center p-4 rounded-xl bg-gray-900/50 hover:bg-blue-700/20 border border-gray-600/50 hover:border-blue-600/50 transition-all duration-300"
                >
                  <FaLinkedin className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                  <span className="text-xs text-gray-400 group-hover:text-blue-400 mt-2">LinkedIn</span>
                </a>
                
                <a 
                  href="https://x.com/rijianmaruf" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex flex-col items-center p-4 rounded-xl bg-gray-900/50 hover:bg-blue-500/20 border border-gray-600/50 hover:border-blue-400/50 transition-all duration-300"
                >
                  <FaTwitter className="w-6 h-6 text-gray-400 group-hover:text-blue-300 transition-colors duration-300" />
                  <span className="text-xs text-gray-400 group-hover:text-blue-300 mt-2">Twitter</span>
                </a>
                
                <div className="group flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-purple-600/10 to-violet-600/10 border border-purple-500/30">
                  <HiAcademicCap className="w-6 h-6 text-purple-400" />
                  <span className="text-xs text-purple-400 mt-2">StudyMate</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
