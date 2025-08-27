import React from "react";
import { FaFacebook, FaInstagram, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 min-h-screen pt-20 pb-16 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Heading */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-4">
            Contact Us
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
            Have a question or want to get in touch? Fill out the form below or reach us on social media.
          </p>
        </div>

        {/* Form + Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Contact Form */}
          <form className="bg-gray-800/50 p-8 rounded-xl shadow-lg backdrop-blur-sm space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Subject</label>
              <input
                type="text"
                placeholder="Enter subject"
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Message</label>
              <textarea
                placeholder="Type your message"
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info / Social Links */}
          <div className="space-y-6 flex flex-col justify-center">
            <div>
              <h2 className="text-xl font-semibold mb-2">Get in Touch</h2>
              <p className="text-gray-400 text-sm">
                Email: support@studentlifetoolkit.com
              </p>
              <p className="text-gray-400 text-sm">
                Phone: +1 (555) 123-4567
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Follow Us</h2>
              <div className="flex space-x-4 mt-2">
                <a href="https://www.facebook.com/md.rijoanmaruf" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  <FaFacebook className="w-6 h-6" />
                </a>
                <a href="https://www.instagram.com/rijoanmaruf" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  <FaInstagram className="w-6 h-6" />
                </a>
                <a href="https://github.com/mdrijoanmaruf" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  <FaGithub className="w-6 h-6" />
                </a>
                <a href="https://www.linkedin.com/in/mdrijoanmaruf/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  <FaLinkedin className="w-6 h-6" />
                </a>
                <a href="https://x.com/rijianmaruf" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                  <FaTwitter className="w-6 h-6" />
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
