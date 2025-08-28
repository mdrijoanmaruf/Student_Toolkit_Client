import React, { useState } from 'react'
import { 
  HiCalendar, 
  HiClock, 
  HiLocationMarker, 
  HiAcademicCap,
  HiPlus,
  HiPencil,
  HiTrash
} from 'react-icons/hi'

const ClassScheduleTracker = () => {
  const [schedule, setSchedule] = useState([
    {
      id: 1,
      subject: 'Mathematics',
      professor: 'Dr. Smith',
      time: '09:00 - 10:30',
      location: 'Room 101',
      day: 'Monday',
      color: 'blue'
    },
    {
      id: 2,
      subject: 'Computer Science',
      professor: 'Prof. Johnson',
      time: '11:00 - 12:30',
      location: 'Lab 204',
      day: 'Monday',
      color: 'purple'
    },
    {
      id: 3,
      subject: 'Physics',
      professor: 'Dr. Brown',
      time: '14:00 - 15:30',
      location: 'Room 305',
      day: 'Tuesday',
      color: 'green'
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newClass, setNewClass] = useState({
    subject: '',
    professor: '',
    time: '',
    location: '',
    day: 'Monday',
    color: 'blue'
  })

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

  const handleAddClass = () => {
    if (newClass.subject && newClass.professor && newClass.time && newClass.location) {
      setSchedule([
        ...schedule,
        {
          id: Date.now(),
          ...newClass
        }
      ])
      setNewClass({
        subject: '',
        professor: '',
        time: '',
        location: '',
        day: 'Monday',
        color: 'blue'
      })
      setShowAddForm(false)
    }
  }

  const handleDeleteClass = (id) => {
    setSchedule(schedule.filter(cls => cls.id !== id))
  }

  const getClassesForDay = (day) => {
    return schedule.filter(cls => cls.day === day).sort((a, b) => a.time.localeCompare(b.time))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <HiCalendar className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold text-white">Class Schedule</h1>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-200 flex items-center space-x-2"
        >
          <HiPlus className="w-4 h-4" />
          <span>Add Class</span>
        </button>
      </div>

      {/* Add Class Form */}
      {showAddForm && (
        <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">Add New Class</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Subject"
              value={newClass.subject}
              onChange={(e) => setNewClass({...newClass, subject: e.target.value})}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Professor"
              value={newClass.professor}
              onChange={(e) => setNewClass({...newClass, professor: e.target.value})}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Time (e.g., 09:00 - 10:30)"
              value={newClass.time}
              onChange={(e) => setNewClass({...newClass, time: e.target.value})}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Location"
              value={newClass.location}
              onChange={(e) => setNewClass({...newClass, location: e.target.value})}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={newClass.day}
              onChange={(e) => setNewClass({...newClass, day: e.target.value})}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <select
              value={newClass.color}
              onChange={(e) => setNewClass({...newClass, color: e.target.value})}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {colors.map(color => (
                <option key={color} value={color}>{color.charAt(0).toUpperCase() + color.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleAddClass}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
            >
              Add Class
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Weekly Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {days.map((day) => (
          <div key={day} className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-4 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">{day}</h3>
            <div className="space-y-3">
              {getClassesForDay(day).map((cls) => (
                <div
                  key={cls.id}
                  className={`${colorClasses[cls.color]} border rounded-lg p-3 relative group`}
                >
                  <button
                    onClick={() => handleDeleteClass(cls.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-400 hover:text-red-300"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                  
                  <div className="pr-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <HiAcademicCap className="w-4 h-4" />
                      <h4 className="font-semibold text-sm">{cls.subject}</h4>
                    </div>
                    
                    <div className="space-y-1 text-xs opacity-90">
                      <div className="flex items-center space-x-2">
                        <HiClock className="w-3 h-3" />
                        <span>{cls.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <HiLocationMarker className="w-3 h-3" />
                        <span>{cls.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <HiPencil className="w-3 h-3" />
                        <span>{cls.professor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {getClassesForDay(day).length === 0 && (
                <div className="text-center text-gray-500 text-sm py-8">
                  No classes scheduled
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Today's Schedule */}
      <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
        <h2 className="text-xl font-semibold text-white mb-4">Today's Classes</h2>
        <div className="space-y-3">
          {getClassesForDay(days[new Date().getDay() - 1] || 'Monday').map((cls) => (
            <div
              key={cls.id}
              className={`${colorClasses[cls.color]} border rounded-lg p-4 flex items-center justify-between`}
            >
              <div className="flex items-center space-x-4">
                <HiAcademicCap className="w-6 h-6" />
                <div>
                  <h4 className="font-semibold">{cls.subject}</h4>
                  <p className="text-sm opacity-80">{cls.professor}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{cls.time}</p>
                <p className="text-sm opacity-80">{cls.location}</p>
              </div>
            </div>
          ))}
          
          {getClassesForDay(days[new Date().getDay() - 1] || 'Monday').length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No classes scheduled for today
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClassScheduleTracker