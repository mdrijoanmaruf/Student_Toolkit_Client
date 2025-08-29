import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  HiCurrencyDollar, 
  HiCalendar, 
  HiQuestionMarkCircle, 
  HiClock,
  HiChartBar,
  HiTrendingUp,
  HiSparkles,
  HiAcademicCap,
  HiLightBulb,
  HiArrowRight,
  HiBookOpen
} from 'react-icons/hi'
import useAuth from '../../Hook/useAuth'

const DashboardHome = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Get greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const dashboardCards = [
    {
      title: 'Budget Tracker',
      description: 'Track expenses and manage your student budget efficiently',
      icon: HiCurrencyDollar,
      path: '/dashboard/budget-tracker',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      features: ['Expense tracking', 'Budget planning', 'Financial insights']
    },
    {
      title: 'Class Schedule',
      description: 'Organize your classes and never miss important sessions',
      icon: HiCalendar,
      path: '/dashboard/class-schedule',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      features: ['Timetable management', 'Class reminders', 'Schedule optimization']
    },
    {
      title: 'Course Materials',
      description: 'Store and organize your study resources and course notes',
      icon: HiBookOpen,
      path: '/dashboard/course-materials',
      color: 'from-indigo-500 to-blue-600',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
      features: ['Resource organization', 'Link management', 'Course-wise sorting'],
      isNew: true
    },
    {
      title: 'Exam Q&A Generator',
      description: 'AI-powered practice questions for effective exam preparation',
      icon: HiQuestionMarkCircle,
      path: '/dashboard/exam-qna',
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      features: ['AI question generation', 'Multiple formats', 'Instant feedback']
    },
    {
      title: 'Study Planner',
      description: 'Plan and organize your study sessions for maximum productivity',
      icon: HiClock,
      path: '/dashboard/study-planner',
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      features: ['Session planning', 'Progress tracking', 'Goal setting']
    },
    {
      title: 'Ask AI Assistant',
      description: 'Get instant help with your studies from AI-powered assistant',
      icon: HiSparkles,
      path: '/dashboard/ask-ai',
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      features: ['24/7 AI support', 'Study assistance', 'Instant answers'],
      isPopular: true
    }
  ]

  const quickActions = [
    { title: 'Start Study Session', icon: HiAcademicCap, action: () => navigate('/dashboard/study-planner') },
    { title: 'Browse Materials', icon: HiBookOpen, action: () => navigate('/dashboard/course-materials') },
    { title: 'Ask AI Question', icon: HiSparkles, action: () => navigate('/dashboard/ask-ai') },
    { title: 'Check Schedule', icon: HiCalendar, action: () => navigate('/dashboard/class-schedule') }
  ]

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600/20 to-violet-600/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-violet-500/5 backdrop-blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 mb-4">
            <div className="flex items-center space-x-3">
              <HiChartBar className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {getGreeting()}, {user?.displayName?.split(' ')[0] || 'Student'}! 👋
                </h1>
                <p className="text-purple-300 text-sm sm:text-base">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Ready to boost your productivity? Your comprehensive Student Life Toolkit awaits!
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800/40 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700/50">
        <div className="flex items-center space-x-2 mb-4">
          <HiLightBulb className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
          <h2 className="text-lg sm:text-xl font-semibold text-white">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-gray-700/30 hover:bg-gray-600/40 rounded-lg sm:rounded-xl transition-all duration-200 group"
            >
              <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
              <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors text-center leading-tight">
                {action.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gray-800/40 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Available Tools</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{dashboardCards.length}</p>
            </div>
            <HiTrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gray-800/40 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Study Time</p>
              <p className="text-xl sm:text-2xl font-bold text-white">2.5h</p>
            </div>
            <HiClock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gray-800/40 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">This Week</p>
              <p className="text-xl sm:text-2xl font-bold text-white">7</p>
            </div>
            <HiCalendar className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-gray-800/40 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Budget</p>
              <p className="text-xl sm:text-2xl font-bold text-white">$450</p>
            </div>
            <HiCurrencyDollar className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Available Tools</h2>
          <span className="text-xs sm:text-sm text-gray-400 bg-gray-800/50 px-2 sm:px-3 py-1 rounded-full">
            {dashboardCards.length} tools
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              className={`${card.bgColor} ${card.borderColor} border rounded-xl sm:rounded-2xl p-4 sm:p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden`}
            >
              {/* Background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Badges */}
              <div className="absolute top-3 right-3 flex space-x-1">
                {card.isNew && (
                  <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30">
                    New
                  </span>
                )}
                {card.isPopular && (
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full border border-yellow-500/30">
                    Popular
                  </span>
                )}
              </div>

              <div className="relative z-10">
                <div className="flex items-start space-x-3 sm:space-x-4 mb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${card.color} rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <card.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                      {card.title}
                    </h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 text-sm sm:text-base leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-1 sm:space-y-2 mb-4">
                  {card.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-400 rounded-full"></div>
                      <span className="text-xs sm:text-sm text-gray-400">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action */}
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-purple-400 group-hover:text-purple-300 transition-colors duration-300">
                    Click to explore
                  </span>
                  <HiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 group-hover:text-purple-300 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardHome