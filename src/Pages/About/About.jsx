import React from "react";
import { HiCalendar, HiCash, HiAcademicCap, HiCheckCircle } from "react-icons/hi";

const About = () => {
  return (
    <div className=" text-white min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <div className="text-center md:text-left mb-12">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-4">
            About Student Life Toolkit
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-3xl mx-auto md:mx-0">
            Student Life Toolkit is a React web application designed to make student life easier.
            It provides tools to manage classes, budget, study plans, and exam preparation in a single platform.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1: Class Schedule Tracker */}
          <div className="bg-gray-800/50 rounded-xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 shadow-lg">
            <HiCalendar className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Class Schedule Tracker</h3>
            <p className="text-gray-300 text-sm">
              Keep track of daily or weekly classes. Add, edit, or delete classes, and color-code subjects for easy reference.
            </p>
          </div>

          {/* Feature 2: Budget Tracker */}
          <div className="bg-gray-800/50 rounded-xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 shadow-lg">
            <HiCash className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Budget Tracker</h3>
            <p className="text-gray-300 text-sm">
              Track income, expenses, and savings. Visual charts help you manage your finances efficiently.
            </p>
          </div>

          {/* Feature 3: Exam Q&A Generator */}
          <div className="bg-gray-800/50 rounded-xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 shadow-lg">
            <HiAcademicCap className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Exam Q&A Generator</h3>
            <p className="text-gray-300 text-sm">
              Generate practice questions (MCQs, short answers, true/false) with selectable difficulty levels to prepare for exams.
            </p>
          </div>

          {/* Feature 4: Study Planner */}
          <div className="bg-gray-800/50 rounded-xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 shadow-lg">
            <HiCheckCircle className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Study Planner</h3>
            <p className="text-gray-300 text-sm">
              Break down big study goals into smaller tasks. Assign subject/topic, priority, and deadlines for efficient planning.
            </p>
          </div>

          {/* Unique Feature */}
          <div className="bg-gray-800/50 rounded-xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 shadow-lg">
            <HiCheckCircle className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Notifications</h3>
            <p className="text-gray-300 text-sm">
              Get smart reminders for classes, study sessions, and budget goals, helping students stay on track effortlessly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
