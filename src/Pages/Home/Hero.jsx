import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  HiAcademicCap, 
  HiChartBar, 
  HiCalendar, 
  HiCurrencyDollar,
  HiClock,
  HiQuestionMarkCircle,
  HiArrowRight,
  HiSparkles
} from 'react-icons/hi'
import useAuth from '../../Hook/useAuth'

const Hero = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const features = [
    {
      icon: HiCurrencyDollar,
      title: 'Budget Tracker',
      description: 'Manage your finances smartly',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: HiCalendar,
      title: 'Class Schedule',
      description: 'Never miss a class again',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: HiQuestionMarkCircle,
      title: 'Exam Q&A',
      description: 'Practice with smart questions',
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: HiClock,
      title: 'Study Planner',
      description: 'Organize your study time',
      color: 'from-orange-500 to-red-600'
    }
  ]

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      navigate('/register')
    }
  }

  return (
    <div className="relative overflow-hidden mt-24">
      {/* Main Content */}
      <div className="relative z-10 flex flex-col ">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            {/* Horizontal Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Side - Text Content */}
              <div className="text-center lg:text-left">
                {/* Logo and Badge */}
                <div className="flex justify-center lg:justify-start mb-6">
                </div>

                {/* Main Heading - Reduced Size */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  <span className="block">Your Complete</span>
                  <span className="block bg-gradient-to-r from-purple-400 via-violet-400 to-purple-600 bg-clip-text text-transparent">
                    Student Life Toolkit
                  </span>
                </h1>

                {/* Subheading */}
                <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Manage your budget, schedule classes, practice with AI-generated Q&A, 
                  and plan your studies—all in one beautiful platform.
                </p>

                {/* CTA Button */}
                <div className="flex justify-center lg:justify-start mb-8">
                  <button
                    onClick={handleGetStarted}
                    className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-violet-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>{user ? 'Go to Dashboard' : 'Get Started Free'}</span>
                      <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Side - Feature Cards */}
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group relative bg-gray-800/40 backdrop-blur-md rounded-2xl p-5 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105"
                  >
                    {/* Feature Icon */}
                    <div className={`w-10 h-10 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    
                    {/* Feature Content */}
                    <h3 className="text-base font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                      {feature.description}
                    </p>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-violet-600/0 group-hover:from-purple-600/10 group-hover:to-violet-600/10 rounded-2xl transition-all duration-300"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero