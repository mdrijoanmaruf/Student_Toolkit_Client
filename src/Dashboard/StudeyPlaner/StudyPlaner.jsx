import React, { useState } from 'react'
import { 
  HiClock, 
  HiCalendar, 
  HiBookOpen, 
  HiCheckCircle,
  HiPlus,
  HiTrash,
  HiPlay,
  HiPause,
  HiStop,
  HiAcademicCap
} from 'react-icons/hi'

const StudyPlaner = () => {
  const [studyPlan, setStudyPlan] = useState([
    {
      id: 1,
      subject: 'Mathematics',
      topic: 'Calculus - Derivatives',
      duration: 60,
      completed: false,
      priority: 'high',
      dueDate: '2025-08-30'
    },
    {
      id: 2,
      subject: 'Physics',
      topic: 'Quantum Mechanics',
      duration: 90,
      completed: false,
      priority: 'medium',
      dueDate: '2025-09-01'
    },
    {
      id: 3,
      subject: 'Computer Science',
      topic: 'Data Structures - Trees',
      duration: 45,
      completed: true,
      priority: 'low',
      dueDate: '2025-08-28'
    }
  ])

  const [newTask, setNewTask] = useState({
    subject: '',
    topic: '',
    duration: '',
    priority: 'medium',
    dueDate: ''
  })

  const [showAddForm, setShowAddForm] = useState(false)
  const [timer, setTimer] = useState({ isActive: false, time: 0, taskId: null })

  const priorities = [
    { value: 'high', label: 'High', color: 'text-red-400 bg-red-500/20 border-red-500/30' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30' },
    { value: 'low', label: 'Low', color: 'text-green-400 bg-green-500/20 border-green-500/30' }
  ]

  const handleAddTask = () => {
    if (newTask.subject && newTask.topic && newTask.duration && newTask.dueDate) {
      setStudyPlan([
        ...studyPlan,
        {
          id: Date.now(),
          ...newTask,
          duration: parseInt(newTask.duration),
          completed: false
        }
      ])
      setNewTask({
        subject: '',
        topic: '',
        duration: '',
        priority: 'medium',
        dueDate: ''
      })
      setShowAddForm(false)
    }
  }

  const toggleTask = (id) => {
    setStudyPlan(studyPlan.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id) => {
    setStudyPlan(studyPlan.filter(task => task.id !== id))
  }

  const startTimer = (taskId) => {
    setTimer({ isActive: true, time: 0, taskId })
  }

  const stopTimer = () => {
    setTimer({ isActive: false, time: 0, taskId: null })
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // Timer effect would go here in a real app
  React.useEffect(() => {
    let interval = null
    if (timer.isActive) {
      interval = setInterval(() => {
        setTimer(prev => ({ ...prev, time: prev.time + 1 }))
      }, 1000)
    } else if (!timer.isActive && timer.time !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [timer.isActive, timer.time])

  const completedTasks = studyPlan.filter(task => task.completed).length
  const totalTasks = studyPlan.length
  const totalStudyTime = studyPlan.reduce((total, task) => total + task.duration, 0)
  const completedStudyTime = studyPlan.filter(task => task.completed).reduce((total, task) => total + task.duration, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <HiClock className="w-8 h-8 text-orange-400" />
          <h1 className="text-3xl font-bold text-white">Study Planner</h1>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-200 flex items-center space-x-2"
        >
          <HiPlus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">Total Tasks</p>
              <p className="text-2xl font-bold text-white">{totalTasks}</p>
            </div>
            <HiBookOpen className="w-6 h-6 text-blue-400" />
          </div>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium">Completed</p>
              <p className="text-2xl font-bold text-white">{completedTasks}</p>
            </div>
            <HiCheckCircle className="w-6 h-6 text-green-400" />
          </div>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm font-medium">Study Time</p>
              <p className="text-2xl font-bold text-white">{totalStudyTime}m</p>
            </div>
            <HiClock className="w-6 h-6 text-purple-400" />
          </div>
        </div>

        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-400 text-sm font-medium">Progress</p>
              <p className="text-2xl font-bold text-white">
                {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
              </p>
            </div>
            <HiAcademicCap className="w-6 h-6 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Timer Section */}
      {timer.taskId && (
        <div className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Study Timer</h3>
              <p className="text-3xl font-bold text-purple-300">{formatTime(timer.time)}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setTimer(prev => ({ ...prev, isActive: !prev.isActive }))}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  timer.isActive 
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                }`}
              >
                {timer.isActive ? <HiPause className="w-5 h-5" /> : <HiPlay className="w-5 h-5" />}
              </button>
              <button
                onClick={stopTimer}
                className="p-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-200"
              >
                <HiStop className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Form */}
      {showAddForm && (
        <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">Add Study Task</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Subject"
              value={newTask.subject}
              onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Topic"
              value={newTask.topic}
              onChange={(e) => setNewTask({...newTask, topic: e.target.value})}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={newTask.duration}
              onChange={(e) => setNewTask({...newTask, duration: e.target.value})}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 md:col-span-2"
            >
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>{priority.label} Priority</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleAddTask}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
            >
              Add Task
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

      {/* Study Plan List */}
      <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
        <h2 className="text-xl font-semibold text-white mb-4">Study Tasks</h2>
        <div className="space-y-3">
          {studyPlan.map((task) => {
            const priority = priorities.find(p => p.value === task.priority)
            const isOverdue = new Date(task.dueDate) < new Date() && !task.completed
            
            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  task.completed 
                    ? 'bg-green-500/10 border-green-500/20' 
                    : isOverdue
                    ? 'bg-red-500/10 border-red-500/20'
                    : 'bg-gray-700/30 border-gray-600/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        task.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-400 hover:border-green-500'
                      }`}
                    >
                      {task.completed && <HiCheckCircle className="w-4 h-4" />}
                    </button>
                    
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className={`font-semibold ${task.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                          {task.subject}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priority.color}`}>
                          {priority.label}
                        </span>
                      </div>
                      <p className={`${task.completed ? 'text-gray-500' : 'text-gray-300'} text-sm mb-1`}>
                        {task.topic}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span className="flex items-center space-x-1">
                          <HiClock className="w-3 h-3" />
                          <span>{task.duration} min</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <HiCalendar className="w-3 h-3" />
                          <span>Due: {task.dueDate}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!task.completed && (
                      <button
                        onClick={() => startTimer(task.id)}
                        disabled={timer.taskId === task.id}
                        className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <HiPlay className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-200"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
          
          {studyPlan.length === 0 && (
            <div className="text-center py-12">
              <HiBookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-500">No study tasks yet. Add your first task to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudyPlaner