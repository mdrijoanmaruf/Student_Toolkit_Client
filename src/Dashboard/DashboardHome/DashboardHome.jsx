import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  HiCurrencyDollar, 
  HiCalendar, 
  HiQuestionMarkCircle, 
  HiClock,
  HiChartBar,
  HiTrendingUp
} from 'react-icons/hi'

const DashboardHome = () => {
  const navigate = useNavigate()

  const dashboardCards = [
    {
      title: 'Budget Tracker',
      description: 'Track your expenses and manage your budget',
      icon: HiCurrencyDollar,
      path: '/dashboard/budget-tracker',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      title: 'Class Schedule',
      description: 'Manage your class timetable and schedule',
      icon: HiCalendar,
      path: '/dashboard/class-schedule',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Exam Q&A Generator',
      description: 'Generate practice questions for your exams',
      icon: HiQuestionMarkCircle,
      path: '/dashboard/exam-qna',
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      title: 'Study Planner',
      description: 'Plan and organize your study sessions',
      icon: HiClock,
      path: '/dashboard/study-planner',
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600/20 to-violet-600/20 rounded-2xl p-6 border border-purple-500/20">
        <div className="flex items-center space-x-3 mb-4">
          <HiChartBar className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        </div>
        <p className="text-gray-300 text-lg">
          Welcome to your Student Life Toolkit! Manage all aspects of your student life from one place.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Tools</p>
              <p className="text-2xl font-bold text-white">4</p>
            </div>
            <HiTrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Sessions</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
            <HiClock className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">This Week</p>
              <p className="text-2xl font-bold text-white">New</p>
            </div>
            <HiCalendar className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-gray-800/40 backdrop-blur-md rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Budget Status</p>
              <p className="text-2xl font-bold text-white">Good</p>
            </div>
            <HiCurrencyDollar className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Available Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              className={`${card.bgColor} ${card.borderColor} border rounded-2xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 group`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                    {card.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {card.description}
                  </p>
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