import React, { useState, useEffect } from 'react'
import { 
  HiCalendar, 
  HiClock, 
  HiLocationMarker, 
  HiAcademicCap,
  HiPlus,
  HiPencil,
  HiTrash
} from 'react-icons/hi'
import useAxios from '../../Hook/useAxios'
import useAuth from '../../Hook/useAuth'
import Swal from 'sweetalert2'

const ClassScheduleTracker = () => {
  const { user } = useAuth()
  const axiosInstance = useAxios()
  
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [newClass, setNewClass] = useState({
    subject: '',
    timeFrom: '',
    timeTo: '',
    location: '',
    day: 'Monday',
    color: 'blue'
  })

  // Update current time every second for real-time countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Fetch classes when component mounts or user changes
  useEffect(() => {
    if (user?.uid) {
      fetchClasses()
    }
  }, [user])

  // Fetch all classes for the current user
  const fetchClasses = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axiosInstance.get(`/api/classes/${user.uid}`)
      if (response.data.success) {
        setSchedule(response.data.data)
      } else {
        setError('Failed to fetch classes')
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
      setError('Error fetching classes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const colors = ['blue', 'purple', 'green', 'red', 'yellow', 'pink', 'indigo']

  const colorClasses = {
    blue: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
    purple: 'bg-purple-500/20 border-purple-500/30 text-purple-300',
    green: 'bg-green-500/20 border-green-500/30 text-green-300',
    red: 'bg-red-500/20 border-red-500/30 text-red-300',
    yellow: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300',
    pink: 'bg-pink-500/20 border-pink-500/30 text-pink-300',
    indigo: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
  }

  const handleAddClass = async () => {
    if (newClass.subject && newClass.timeFrom && newClass.timeTo && newClass.location && user?.uid) {
      try {
        setError('')
        const response = await axiosInstance.post('/api/classes', {
          userId: user.uid,
          ...newClass
        })
        
        if (response.data.success) {
          // Refresh the classes list
          await fetchClasses()
          setNewClass({
            subject: '',
            timeFrom: '',
            timeTo: '',
            location: '',
            day: 'Monday',
            color: 'blue'
          })
          setShowAddForm(false)
          
          // Success alert
          Swal.fire({
            title: 'Success!',
            text: 'Class added successfully!',
            icon: 'success',
            confirmButtonColor: '#10b981',
            background: '#1f2937',
            color: '#ffffff'
          })
        } else {
          setError('Failed to add class')
        }
      } catch (error) {
        console.error('Error adding class:', error)
        setError('Error adding class. Please try again.')
        Swal.fire({
          title: 'Error!',
          text: 'Failed to add class. Please try again.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          background: '#1f2937',
          color: '#ffffff'
        })
      }
    }
  }

  const handleEditClass = (cls) => {
    // Extract timeFrom and timeTo from the time string
    const [timeFrom, timeTo] = cls.time.split(' - ')
    
    setEditingClass({
      ...cls,
      timeFrom,
      timeTo
    })
    setShowEditForm(true)
    setShowAddForm(false)
  }

  const handleUpdateClass = async () => {
    if (editingClass.subject && editingClass.timeFrom && editingClass.timeTo && editingClass.location) {
      try {
        setError('')
        const response = await axiosInstance.put(`/api/classes/${editingClass._id}`, {
          subject: editingClass.subject,
          timeFrom: editingClass.timeFrom,
          timeTo: editingClass.timeTo,
          location: editingClass.location,
          day: editingClass.day,
          color: editingClass.color
        })
        
        if (response.data.success) {
          // Refresh the classes list
          await fetchClasses()
          setEditingClass(null)
          setShowEditForm(false)
          
          // Success alert
          Swal.fire({
            title: 'Success!',
            text: 'Class updated successfully!',
            icon: 'success',
            confirmButtonColor: '#10b981',
            background: '#1f2937',
            color: '#ffffff'
          })
        } else {
          setError('Failed to update class')
        }
      } catch (error) {
        console.error('Error updating class:', error)
        setError('Error updating class. Please try again.')
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update class. Please try again.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          background: '#1f2937',
          color: '#ffffff'
        })
      }
    }
  }

  const handleDeleteClass = async (id, subject) => {
    // Confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${subject}" class?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#1f2937',
      color: '#ffffff'
    })

    if (result.isConfirmed) {
      try {
        setError('')
        const response = await axiosInstance.delete(`/api/classes/${id}`)
        if (response.data.success) {
          // Refresh the classes list
          await fetchClasses()
          
          // Success alert
          Swal.fire({
            title: 'Deleted!',
            text: 'Class has been deleted successfully.',
            icon: 'success',
            confirmButtonColor: '#10b981',
            background: '#1f2937',
            color: '#ffffff'
          })
        } else {
          setError('Failed to delete class')
        }
      } catch (error) {
        console.error('Error deleting class:', error)
        setError('Error deleting class. Please try again.')
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete class. Please try again.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          background: '#1f2937',
          color: '#ffffff'
        })
      }
    }
  }

  const getClassesForDay = (day) => {
    return schedule.filter(cls => cls.day === day).sort((a, b) => a.time.localeCompare(b.time))
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-lg">Loading classes...</div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-300">
          {error}
        </div>
        <button
          onClick={fetchClasses}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
        >
          Retry
        </button>
      </div>
    )
  }

  // Helper function to convert 24-hour time to 12-hour format
  const formatTo12Hour = (time24) => {
    if (!time24) return time24
    const [hours, minutes] = time24.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  // Helper function to get current time in HH:MM:SS format
  const getCurrentTime = () => {
    const now = new Date()
    return now.getHours().toString().padStart(2, '0') + ':' + 
           now.getMinutes().toString().padStart(2, '0') + ':' +
           now.getSeconds().toString().padStart(2, '0')
  }

  // Helper function to calculate time difference in seconds
  const getTimeDifferenceInSeconds = (targetTime) => {
    const now = new Date()
    const [targetHour, targetMinute] = targetTime.split(':').map(Number)
    const target = new Date()
    target.setHours(targetHour, targetMinute, 0, 0)
    
    return Math.floor((target - now) / 1000)
  }

  // Helper function to format time duration with seconds
  const formatDuration = (seconds) => {
    if (seconds < 0) return null
    
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  // Helper function to get today's day name
  const getTodayName = () => {
    const today = new Date().getDay()
    return days[today === 0 ? 6 : today - 1] // Adjust for Sunday = 0
  }

  // Helper function to check class status
  const getClassStatus = (timeString) => {
    const currentTime = getCurrentTime().substring(0, 5) // Get HH:MM part for comparison
    const [startTime, endTime] = timeString.split(' - ')
    
    if (currentTime < startTime) {
      const secondsUntilStart = getTimeDifferenceInSeconds(startTime)
      const duration = formatDuration(secondsUntilStart)
      return { 
        status: 'upcoming', 
        message: duration ? `Starts in ${duration}` : `Starts at ${formatTo12Hour(startTime)}` 
      }
    } else if (currentTime >= startTime && currentTime <= endTime) {
      const secondsUntilEnd = getTimeDifferenceInSeconds(endTime)
      const duration = formatDuration(secondsUntilEnd)
      return { 
        status: 'ongoing', 
        message: duration ? `Ends in ${duration}` : `Ends at ${formatTo12Hour(endTime)}` 
      }
    } else {
      return { status: 'ended', message: 'Class ended' }
    }
  }

  // Get today's classes with status
  const getTodayClasses = () => {
    const todayName = getTodayName()
    return getClassesForDay(todayName).map(cls => ({
      ...cls,
      statusInfo: getClassStatus(cls.time)
    }))
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <HiCalendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Class Schedule</h1>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm)
            setShowEditForm(false)
            setEditingClass(null)
          }}
          className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base w-full sm:w-auto"
        >
          <HiPlus className="w-4 h-4" />
          <span>Add Class</span>
        </button>
      </div>

      {/* Today's Schedule - Moved to Top */}
      <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700/50">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Today's Classes - {getTodayName()}</h2>
        <div className="space-y-3">
          {getTodayClasses().map((cls) => (
            <div
              key={cls.id}
              className={`${colorClasses[cls.color]} border rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0`}
            >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <HiAcademicCap className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base">{cls.subject}</h4>
                    <p className="text-xs sm:text-sm opacity-80">{cls.location}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right ml-8 sm:ml-0">
                  <p className="font-medium text-sm sm:text-base">{cls.displayTime || cls.time}</p>
                  <p className={`text-xs sm:text-sm font-medium ${
                    cls.statusInfo.status === 'ongoing' ? 'text-green-400' :
                    cls.statusInfo.status === 'upcoming' ? 'text-blue-400' :
                    'text-red-400'
                  }`}>
                    {cls.statusInfo.message}
                  </p>
                </div>
              </div>
            ))}
            
            {getTodayClasses().length === 0 && (
              <div className="text-center text-gray-500 py-6 sm:py-8 text-sm sm:text-base">
                No classes scheduled for today
              </div>
            )}
        </div>
      </div>

      {/* Add Class Form */}
      {showAddForm && (
        <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700/50">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Add New Class</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
            <input
              type="text"
              placeholder="Subject"
              value={newClass.subject}
              onChange={(e) => setNewClass({...newClass, subject: e.target.value})}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 sm:px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
            <input
              type="text"
              placeholder="Location"
              value={newClass.location}
              onChange={(e) => setNewClass({...newClass, location: e.target.value})}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 sm:px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
            <div className="sm:col-span-2 grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">From Time</label>
                <input
                  type="time"
                  value={newClass.timeFrom}
                  onChange={(e) => setNewClass({...newClass, timeFrom: e.target.value})}
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">To Time</label>
                <input
                  type="time"
                  value={newClass.timeTo}
                  onChange={(e) => setNewClass({...newClass, timeTo: e.target.value})}
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                />
              </div>
            </div>
            <select
              value={newClass.day}
              onChange={(e) => setNewClass({...newClass, day: e.target.value})}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            >
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <select
              value={newClass.color}
              onChange={(e) => setNewClass({...newClass, color: e.target.value})}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            >
              {colors.map(color => (
                <option key={color} value={color}>{color.charAt(0).toUpperCase() + color.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleAddClass}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
            >
              Add Class
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Class Form */}
      {showEditForm && editingClass && (
        <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-gray-700/50">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Edit Class</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
            <input
              type="text"
              placeholder="Subject"
              value={editingClass.subject}
              onChange={(e) => setEditingClass({...editingClass, subject: e.target.value})}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 sm:px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
            <input
              type="text"
              placeholder="Location"
              value={editingClass.location}
              onChange={(e) => setEditingClass({...editingClass, location: e.target.value})}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 sm:px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
            <div className="sm:col-span-2 grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">From Time</label>
                <input
                  type="time"
                  value={editingClass.timeFrom}
                  onChange={(e) => setEditingClass({...editingClass, timeFrom: e.target.value})}
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">To Time</label>
                <input
                  type="time"
                  value={editingClass.timeTo}
                  onChange={(e) => setEditingClass({...editingClass, timeTo: e.target.value})}
                  className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                />
              </div>
            </div>
            <select
              value={editingClass.day}
              onChange={(e) => setEditingClass({...editingClass, day: e.target.value})}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            >
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <select
              value={editingClass.color}
              onChange={(e) => setEditingClass({...editingClass, color: e.target.value})}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            >
              {colors.map(color => (
                <option key={color} value={color}>{color.charAt(0).toUpperCase() + color.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleUpdateClass}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
            >
              Update Class
            </button>
            <button
              onClick={() => {
                setShowEditForm(false)
                setEditingClass(null)
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Weekly Schedule */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3 sm:gap-4">
        {days.map((day) => (
          <div key={day} className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-gray-700/50">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 text-center">{day}</h3>
            <div className="space-y-2 sm:space-y-3">
              {getClassesForDay(day).map((cls) => (
                <div
                  key={cls._id}
                  className={`${colorClasses[cls.color]} border rounded-lg p-2 sm:p-3 relative group`}
                >
                  <div className="absolute top-1 sm:top-2 right-1 sm:right-2 flex space-x-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEditClass(cls)}
                      className="text-blue-400 hover:text-blue-300 p-1"
                      title="Edit class"
                    >
                      <HiPencil className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClass(cls._id, cls.subject)}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Delete class"
                    >
                      <HiTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                  
                  <div className="pr-12 sm:pr-16">
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                      <HiAcademicCap className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <h4 className="font-semibold text-xs sm:text-sm leading-tight">{cls.subject}</h4>
                    </div>
                    
                    <div className="space-y-0.5 sm:space-y-1 text-xs opacity-90">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <HiClock className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                        <span className="text-xs truncate">{cls.displayTime || cls.time}</span>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <HiLocationMarker className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                        <span className="text-xs truncate">{cls.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {getClassesForDay(day).length === 0 && (
                <div className="text-center text-gray-500 text-xs sm:text-sm py-4 sm:py-8">
                  No classes scheduled
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClassScheduleTracker