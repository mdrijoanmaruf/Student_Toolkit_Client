import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { 
  HiMenu, 
  HiX, 
  HiHome, 
  HiLogout, 
  HiUser, 
  HiAcademicCap,
  HiBookOpen,
  HiCalendar,
  HiClipboardList,
  HiCog,
  HiChartBar,
  HiCurrencyDollar,
  HiClock,
  HiQuestionMarkCircle,
  HiSparkles
} from 'react-icons/hi'
import useAuth from '../Hook/useAuth'
import useWebsiteLoading from '../Hook/useWebsiteLoading.jsx'
import Swal from 'sweetalert2'
import Logo from '../Shared/Logo/Logo.jsx'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logOut } = useAuth()
  const { withLoading } = useWebsiteLoading()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Sign Out?',
      text: 'Are you sure you want to sign out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Sign Out',
      cancelButtonText: 'Cancel',
      background: '#1f2937',
      color: '#f9fafb',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#9333ea',
      customClass: {
        popup: 'dark-popup'
      }
    })

    if (result.isConfirmed) {
      try {
        await withLoading(async () => {
          await logOut()
          navigate('/')
        })
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
  }

  const handleBackToHome = () => {
    navigate('/')
  }

  const sidebarItems = [
    { icon: HiChartBar, label: 'Dashboard Home', path: '/dashboard' },
    { icon: HiCurrencyDollar, label: 'Budget Tracker', path: '/dashboard/budget-tracker' },
    { icon: HiCalendar, label: 'Class Schedule', path: '/dashboard/class-schedule' },
    { icon: HiBookOpen, label: 'Course Materials', path: '/dashboard/course-materials' },
    { icon: HiQuestionMarkCircle, label: 'Exam Q&A', path: '/dashboard/exam-qna' },
    { icon: HiClock, label: 'Study Planner', path: '/dashboard/study-planner' },
    { icon: HiSparkles, label: 'Ask AI', path: '/dashboard/ask-ai' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
          {[...Array(96)].map((_, i) => (
            <div
              key={i}
              className="border border-purple-500/20 animate-pulse"
              style={{
                animationDelay: `${(i * 0.1) % 3}s`,
                animationDuration: '4s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-20 animate-float"
            style={{
              left: `${15 + (i * 15)}%`,
              top: `${25 + (i * 10)}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${5 + (i * 0.3)}s`
            }}
          />
        ))}
      </div>

      {/* Sidebar for Desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col z-30">
        <div className="flex flex-col flex-grow bg-gray-800/40 backdrop-blur-md border-r border-gray-700/50 relative z-30">
          {/* Logo */}
          <div className="flex items-center justify-center h-18 px-6 border-b border-gray-700/50">
            <Logo/>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 relative z-40">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative z-40 ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-purple-600 to-violet-600 shadow-md'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 transition-transform duration-200 ${
                    isActive ? 'text-white' : 'group-hover:scale-110'
                  }`} />
                  {item.label}
                  {isActive && (
                    <span className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full"></span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-700/50 space-y-2 relative z-40">
            <button
              onClick={handleBackToHome}
              className="w-full flex items-center px-4 py-3 text-gray-300 rounded-xl hover:bg-blue-600/20 hover:text-blue-300 transition-all duration-200 group relative z-40"
            >
              <HiHome className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              Back to Home
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-gray-300 rounded-xl hover:bg-red-600/20 hover:text-red-300 transition-all duration-200 group relative z-40"
            >
              <HiLogout className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
          
          {/* Mobile Sidebar */}
          <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-gray-800/95 backdrop-blur-md border-r border-gray-700/50 z-50">
            {/* Mobile Header */}
            <div className="flex items-center justify-between h-20 px-6 border-b border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 via-violet-600 to-purple-800 rounded-full flex items-center justify-center">
                  <HiAcademicCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                  StudyMate
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {sidebarItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                      isActive
                        ? 'text-white bg-gradient-to-r from-purple-600 to-violet-600 shadow-md'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 transition-transform duration-200 ${
                      isActive ? 'text-white' : 'group-hover:scale-110'
                    }`} />
                    {item.label}
                    {isActive && (
                      <span className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full"></span>
                    )}
                  </button>
                )
              })}
            </nav>

            {/* Mobile Bottom Actions */}
            <div className="p-4 border-t border-gray-700/50 space-y-2">
              <button
                onClick={() => {
                  handleBackToHome()
                  setSidebarOpen(false)
                }}
                className="w-full flex items-center px-4 py-3 text-gray-300 rounded-xl hover:bg-blue-600/20 hover:text-blue-300 transition-all duration-200 group"
              >
                <HiHome className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                Back to Home
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-gray-300 rounded-xl hover:bg-red-600/20 hover:text-red-300 transition-all duration-200 group"
              >
                <HiLogout className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen relative z-20">
        {/* Fixed Top Header */}
        <header className="fixed top-0 right-0 left-0 lg:left-64 bg-gray-800/40 backdrop-blur-md border-b border-gray-700/50 px-4 py-4 sm:px-6 lg:px-8 z-30">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
              >
                <HiMenu className="w-6 h-6" />
              </button>
              
              {/* Page Title - Hidden on Mobile */}
              <h1 className="hidden sm:block ml-4 lg:ml-0 text-2xl font-bold text-white">
                Dashboard
              </h1>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              {/* User Avatar and Info */}
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-white">
                    {user?.displayName || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {user?.email}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center shadow-lg">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <HiUser className="w-5 h-5 text-white" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content with top padding to account for fixed header */}
        <main className="flex-1 pt-20 md:p-6 p-3 md:pt-24">
          <div className="md:mx-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout