import React, { useState, useEffect } from 'react'
import useAuth from '../../Hook/useAuth'
import useStudyPlannerApi from '../../Hook/useStudyPlannerApi'
import Swal from 'sweetalert2'
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
  HiAcademicCap,
  HiChartBar,
  HiTag,
  HiDocumentText,
  HiLink,
  HiRefresh,
  HiEye,
  HiLightBulb,
  HiStar,
  HiTrendingUp,
  HiFilter,
  HiSearch,
  HiCog,
  HiCollection,
  HiClipboard,
  HiPencil
} from 'react-icons/hi'

const StudyPlaner = () => {
  const { user } = useAuth()
  const {
    loading,
    error,
    getStudyPlans,
    addStudyTask,
    updateStudyTask,
    deleteStudyTask,
    addStudySession,
    getStudyGoals,
    updateStudyGoals,
    getStudyAnalytics
  } = useStudyPlannerApi()

  const [studyPlan, setStudyPlan] = useState([])
  const [studyGoals, setStudyGoals] = useState({
    weekly: { target: 20, current: 0 },
    monthly: { target: 80, current: 0 }
  })
  const [analytics, setAnalytics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    totalPlannedTime: 0,
    totalActualTime: 0,
    completedStudyTime: 0,
    averageSessionLength: 0,
    subjectStats: {},
    completionRate: 0,
    efficiency: 0
  })

  const [newTask, setNewTask] = useState({
    subject: '',
    topic: '',
    duration: '',
    priority: 'medium',
    dueDate: '',
    difficulty: 'medium',
    tags: '',
    notes: '',
    resources: '',
    recurring: null
  })

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [timer, setTimer] = useState({ 
    isActive: false, 
    time: 0, 
    taskId: null, 
    mode: 'study', // 'study', 'break', 'longBreak'
    pomodoroCount: 0,
    isPomodoro: false
  })

  const [currentView, setCurrentView] = useState('list') // 'list', 'calendar', 'analytics'
  const [filterBy, setFilterBy] = useState('all') // 'all', 'pending', 'completed', 'overdue'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // Pomodoro settings
  const pomodoroSettings = {
    study: 25 * 60, // 25 minutes
    break: 5 * 60,  // 5 minutes
    longBreak: 15 * 60 // 15 minutes
  }

  const priorities = [
    { value: 'high', label: 'High', color: 'text-red-400 bg-red-500/20 border-red-500/30' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30' },
    { value: 'low', label: 'Low', color: 'text-green-400 bg-green-500/20 border-green-500/30' }
  ]

  const difficulties = [
    { value: 'easy', label: 'Easy', color: 'text-green-400' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
    { value: 'hard', label: 'Hard', color: 'text-red-400' }
  ]

  const viewTabs = [
    { id: 'list', label: 'List View', icon: HiClipboard },
    { id: 'calendar', label: 'Calendar', icon: HiCalendar },
    { id: 'analytics', label: 'Analytics', icon: HiChartBar }
  ]

  const handleAddTask = async () => {
    if (newTask.subject && newTask.topic && newTask.duration && newTask.dueDate && user?.uid) {
      try {
        const tagsArray = newTask.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        const resourcesArray = newTask.resources.split(',').map(resource => resource.trim()).filter(resource => resource)
        
        const taskData = {
          userId: user.uid,
          subject: newTask.subject,
          topic: newTask.topic,
          duration: parseInt(newTask.duration),
          priority: newTask.priority,
          dueDate: newTask.dueDate,
          difficulty: newTask.difficulty,
          tags: tagsArray,
          notes: newTask.notes,
          resources: resourcesArray
        }

        const response = await addStudyTask(taskData)
        
        if (response.success) {
          // Add the new task to local state
          setStudyPlan(prev => [response.data, ...prev])
          
          // Reset form
          resetForm()
          setShowAddForm(false)
          
          // Refresh analytics
          const analyticsResponse = await getStudyAnalytics(user.uid)
          if (analyticsResponse.success) {
            setAnalytics(analyticsResponse.data)
          }

          // Success notification
          Swal.fire({
            icon: 'success',
            title: 'Task Added!',
            text: 'Your study task has been added successfully.',
            timer: 2000,
            showConfirmButton: false,
            background: '#1f2937',
            color: '#fff'
          })
        }
      } catch (error) {
        console.error('Error adding task:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add task. Please try again.',
          background: '#1f2937',
          color: '#fff'
        })
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in all required fields (Subject, Topic, Duration, Due Date).',
        background: '#1f2937',
        color: '#fff'
      })
    }
  }

  const handleEditTask = async () => {
    if (editingTask && newTask.subject && newTask.topic && newTask.duration && newTask.dueDate && user?.uid) {
      try {
        const tagsArray = newTask.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        const resourcesArray = newTask.resources.split(',').map(resource => resource.trim()).filter(resource => resource)
        
        const taskData = {
          subject: newTask.subject,
          topic: newTask.topic,
          duration: parseInt(newTask.duration),
          priority: newTask.priority,
          dueDate: newTask.dueDate,
          difficulty: newTask.difficulty,
          tags: tagsArray,
          notes: newTask.notes,
          resources: resourcesArray,
          completed: editingTask.completed,
          actualTimeSpent: editingTask.actualTimeSpent,
          sessions: editingTask.sessions
        }

        const response = await updateStudyTask(editingTask._id, taskData)
        
        if (response.success) {
          // Update local state
          setStudyPlan(prev => prev.map(task => 
            task._id === editingTask._id ? { ...task, ...taskData } : task
          ))
          
          // Reset form
          resetForm()
          setEditingTask(null)
          
          // Refresh analytics
          const analyticsResponse = await getStudyAnalytics(user.uid)
          if (analyticsResponse.success) {
            setAnalytics(analyticsResponse.data)
          }

          // Success notification
          Swal.fire({
            icon: 'success',
            title: 'Task Updated!',
            text: 'Your study task has been updated successfully.',
            timer: 2000,
            showConfirmButton: false,
            background: '#1f2937',
            color: '#fff'
          })
        }
      } catch (error) {
        console.error('Error updating task:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update task. Please try again.',
          background: '#1f2937',
          color: '#fff'
        })
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in all required fields.',
        background: '#1f2937',
        color: '#fff'
      })
    }
  }

  const startEditTask = (task) => {
    setEditingTask(task)
    setNewTask({
      subject: task.subject,
      topic: task.topic,
      duration: task.duration.toString(),
      priority: task.priority,
      dueDate: task.dueDate,
      difficulty: task.difficulty,
      tags: task.tags ? task.tags.join(', ') : '',
      notes: task.notes || '',
      resources: task.resources ? task.resources.join(', ') : '',
      recurring: task.recurring
    })
    setShowAddForm(true)
  }

  const resetForm = () => {
    setNewTask({
      subject: '',
      topic: '',
      duration: '',
      priority: 'medium',
      dueDate: '',
      difficulty: 'medium',
      tags: '',
      notes: '',
      resources: '',
      recurring: null
    })
  }

  const cancelForm = () => {
    if (editingTask) {
      setEditingTask(null)
    }
    resetForm()
    setShowAddForm(false)
  }

  const toggleTask = async (taskId) => {
    try {
      const task = studyPlan.find(t => t._id === taskId)
      if (!task) return

      const updatedTaskData = {
        ...task,
        completed: !task.completed
      }

      // If completing the task and timer is running, add the session
      if (!task.completed && timer.taskId === taskId) {
        const sessionTime = Math.floor(timer.time / 60) // Convert to minutes
        updatedTaskData.actualTimeSpent = (task.actualTimeSpent || 0) + sessionTime
        updatedTaskData.sessions = [
          ...(task.sessions || []),
          {
            date: new Date().toISOString().split('T')[0],
            duration: sessionTime,
            completed: true
          }
        ]
        stopTimer()
      }

      const response = await updateStudyTask(taskId, updatedTaskData)
      
      if (response.success) {
        // Update local state
        setStudyPlan(prev => prev.map(t => 
          t._id === taskId ? { ...t, ...updatedTaskData } : t
        ))
        
        // Refresh analytics
        const analyticsResponse = await getStudyAnalytics(user.uid)
        if (analyticsResponse.success) {
          setAnalytics(analyticsResponse.data)
        }

        // Success notification
        Swal.fire({
          icon: 'success',
          title: updatedTaskData.completed ? 'Task Completed!' : 'Task Reopened!',
          text: updatedTaskData.completed ? 'Great job on completing your study task!' : 'Task has been reopened.',
          timer: 1500,
          showConfirmButton: false,
          background: '#1f2937',
          color: '#fff'
        })
      }
    } catch (error) {
      console.error('Error toggling task:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update task status. Please try again.',
        background: '#1f2937',
        color: '#fff'
      })
    }
  }

  const deleteTask = async (taskId) => {
    try {
      const task = studyPlan.find(t => t._id === taskId)
      
      const result = await Swal.fire({
        title: 'Delete Task?',
        text: `Are you sure you want to delete "${task?.subject} - ${task?.topic}"? This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        background: '#1f2937',
        color: '#fff'
      })

      if (result.isConfirmed) {
        if (timer.taskId === taskId) {
          stopTimer()
        }

        const response = await deleteStudyTask(taskId)
        
        if (response.success) {
          // Update local state
          setStudyPlan(prev => prev.filter(task => task._id !== taskId))
          
          // Refresh analytics
          const analyticsResponse = await getStudyAnalytics(user.uid)
          if (analyticsResponse.success) {
            setAnalytics(analyticsResponse.data)
          }

          // Success notification
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'The study task has been deleted.',
            timer: 1500,
            showConfirmButton: false,
            background: '#1f2937',
            color: '#fff'
          })
        }
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete task. Please try again.',
        background: '#1f2937',
        color: '#fff'
      })
    }
  }

  const startTimer = (taskId, isPomodoro = false) => {
    const targetTime = isPomodoro ? pomodoroSettings.study : 0
    setTimer({ 
      isActive: true, 
      time: 0, 
      taskId, 
      mode: 'study',
      pomodoroCount: 0,
      isPomodoro,
      targetTime
    })
  }

  const startPomodoroTimer = (taskId) => {
    startTimer(taskId, true)
  }

  const stopTimer = async () => {
    if (timer.taskId && timer.time > 0) {
      try {
        // Save the study session
        const sessionMinutes = Math.floor(timer.time / 60)
        
        if (sessionMinutes > 0) {
          const sessionData = {
            duration: sessionMinutes,
            completed: sessionMinutes >= 25 // 25 minutes minimum for a "completed" session
          }

          const response = await addStudySession(timer.taskId, sessionData)
          
          if (response.success) {
            // Update local state
            setStudyPlan(prev => prev.map(task => {
              if (task._id === timer.taskId) {
                return {
                  ...task,
                  actualTimeSpent: (task.actualTimeSpent || 0) + sessionMinutes,
                  sessions: [
                    ...(task.sessions || []),
                    response.data
                  ]
                }
              }
              return task
            }))
            
            // Refresh analytics
            const analyticsResponse = await getStudyAnalytics(user.uid)
            if (analyticsResponse.success) {
              setAnalytics(analyticsResponse.data)
            }
          }
        }
      } catch (error) {
        console.error('Error saving study session:', error)
      }
    }
    
    setTimer({ isActive: false, time: 0, taskId: null, mode: 'study', pomodoroCount: 0, isPomodoro: false })
  }

  const handlePomodoroComplete = () => {
    const newCount = timer.pomodoroCount + 1
    if (newCount % 4 === 0) {
      // Long break after 4 pomodoros
      setTimer(prev => ({ 
        ...prev, 
        mode: 'longBreak', 
        time: 0, 
        pomodoroCount: newCount,
        targetTime: pomodoroSettings.longBreak
      }))
    } else {
      // Short break
      setTimer(prev => ({ 
        ...prev, 
        mode: 'break', 
        time: 0, 
        pomodoroCount: newCount,
        targetTime: pomodoroSettings.break
      }))
    }
  }

  const handleBreakComplete = () => {
    setTimer(prev => ({ 
      ...prev, 
      mode: 'study', 
      time: 0,
      targetTime: pomodoroSettings.study
    }))
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

  // Timer effect
  useEffect(() => {
    let interval = null
    if (timer.isActive) {
      interval = setInterval(() => {
        setTimer(prev => {
          const newTime = prev.time + 1
          
          // Check if pomodoro timer completed
          if (prev.isPomodoro && prev.targetTime && newTime >= prev.targetTime) {
            if (prev.mode === 'study') {
              handlePomodoroComplete()
            } else if (prev.mode === 'break' || prev.mode === 'longBreak') {
              handleBreakComplete()
            }
            return { ...prev, time: 0, isActive: false }
          }
          
          return { ...prev, time: newTime }
        })
      }, 1000)
    } else if (!timer.isActive && timer.time !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [timer.isActive, timer.time])

  // Filter and search functions
  const getFilteredTasks = () => {
    let filtered = studyPlan

    // Filter by completion status
    if (filterBy === 'pending') {
      filtered = filtered.filter(task => !task.completed)
    } else if (filterBy === 'completed') {
      filtered = filtered.filter(task => task.completed)
    } else if (filterBy === 'overdue') {
      filtered = filtered.filter(task => 
        !task.completed && new Date(task.dueDate) < new Date()
      )
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    return filtered
  }

  // Load data on component mount
  useEffect(() => {
    if (user?.uid) {
      loadStudyData()
    }
  }, [user])

  const loadStudyData = async () => {
    try {
      const [plansResponse, goalsResponse, analyticsResponse] = await Promise.all([
        getStudyPlans(user.uid),
        getStudyGoals(user.uid),
        getStudyAnalytics(user.uid)
      ])
      
      if (plansResponse.success) {
        setStudyPlan(plansResponse.data)
      }
      
      if (goalsResponse.success) {
        setStudyGoals(goalsResponse.data)
      }
      
      if (analyticsResponse.success) {
        setAnalytics(analyticsResponse.data)
      }
    } catch (error) {
      console.error('Error loading study data:', error)
    }
  }

  const filteredTasks = getFilteredTasks()

  // Show loading state
  if (loading && studyPlan.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading study planner...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error && studyPlan.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
            <p className="text-red-400 mb-4">Error loading study planner: {error}</p>
            <button
              onClick={loadStudyData}
              className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-3">
          <HiClock className="w-8 h-8 text-orange-400" />
          <h1 className="text-3xl font-bold text-white">Study Planner</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-200 flex items-center space-x-2"
          >
            <HiPlus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex space-x-1 bg-gray-800/40 backdrop-blur-md rounded-xl p-1 border border-gray-700/50">
        {viewTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentView(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 flex-1 justify-center ${
              currentView === tab.id
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Enhanced Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">Total Tasks</p>
              <p className="text-2xl font-bold text-white">{analytics.totalTasks}</p>
              <p className="text-xs text-gray-400">{analytics.overdueTasks} overdue</p>
            </div>
            <HiBookOpen className="w-6 h-6 text-blue-400" />
          </div>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium">Completed</p>
              <p className="text-2xl font-bold text-white">{analytics.completedTasks}</p>
              <p className="text-xs text-gray-400">{analytics.completionRate.toFixed(1)}% completion rate</p>
            </div>
            <HiCheckCircle className="w-6 h-6 text-green-400" />
          </div>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm font-medium">Study Time</p>
              <p className="text-2xl font-bold text-white">{Math.round(analytics.totalActualTime / 60)}h</p>
              <p className="text-xs text-gray-400">
                {analytics.totalPlannedTime > 0 
                  ? `${analytics.efficiency.toFixed(1)}% efficiency`
                  : 'No planned time'
                }
              </p>
            </div>
            <HiClock className="w-6 h-6 text-purple-400" />
          </div>
        </div>

        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-400 text-sm font-medium">Weekly Goal</p>
              <p className="text-2xl font-bold text-white">
                {studyGoals.weekly.current}h / {studyGoals.weekly.target}h
              </p>
              <p className="text-xs text-gray-400">
                {((studyGoals.weekly.current / studyGoals.weekly.target) * 100).toFixed(1)}% complete
              </p>
            </div>
            <HiTrendingUp className="w-6 h-6 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Study Goals */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-6 border border-indigo-500/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <HiStar className="w-5 h-5 mr-2 text-indigo-400" />
          Study Goals Progress
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">Weekly Goal</span>
              <span className="text-sm text-gray-300">
                {studyGoals.weekly.current}h / {studyGoals.weekly.target}h
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((studyGoals.weekly.current / studyGoals.weekly.target) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">Monthly Goal</span>
              <span className="text-sm text-gray-300">
                {studyGoals.monthly.current}h / {studyGoals.monthly.target}h
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((studyGoals.monthly.current / studyGoals.monthly.target) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Timer Section */}
      {timer.taskId && (
        <div className={`rounded-2xl p-6 border transition-all duration-300 ${
          timer.mode === 'study' 
            ? 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 border-purple-500/20'
            : timer.mode === 'break'
            ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/20'
            : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/20'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-white">
                  {timer.mode === 'study' ? 'Study Session' : 
                   timer.mode === 'break' ? 'Short Break' : 'Long Break'}
                </h3>
                {timer.isPomodoro && (
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 4 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < timer.pomodoroCount ? 'bg-purple-400' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <p className="text-3xl font-bold text-purple-300 mb-2">
                {formatTime(timer.time)}
                {timer.isPomodoro && timer.targetTime && (
                  <span className="text-lg text-gray-400 ml-2">
                    / {formatTime(timer.targetTime)}
                  </span>
                )}
              </p>
              {timer.mode !== 'study' && (
                <p className="text-sm text-gray-300">
                  {timer.mode === 'break' ? 'Take a short break!' : 'Enjoy your long break!'}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
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
              {timer.isPomodoro && timer.targetTime && (
                <div className="w-16 h-16 relative">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-gray-600"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - timer.time / timer.targetTime)}`}
                      className={`transition-all duration-300 ${
                        timer.mode === 'study' ? 'text-purple-400' :
                        timer.mode === 'break' ? 'text-green-400' : 'text-blue-400'
                      }`}
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Add/Edit Task Form */}
      {showAddForm && (
        <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-6">
            {editingTask ? 'Edit Study Task' : 'Add Study Task'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject *
              </label>
              <input
                type="text"
                placeholder="e.g., Mathematics"
                value={newTask.subject}
                onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Topic *
              </label>
              <input
                type="text"
                placeholder="e.g., Linear Algebra"
                value={newTask.topic}
                onChange={(e) => setNewTask({...newTask, topic: e.target.value})}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duration (minutes) *
              </label>
              <input
                type="number"
                placeholder="60"
                min="1"
                value={newTask.duration}
                onChange={(e) => setNewTask({...newTask, duration: e.target.value})}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority Level
              </label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {priorities.map(priority => (
                  <option key={priority.value} value={priority.value}>{priority.label} Priority</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Difficulty Level
              </label>
              <select
                value={newTask.difficulty}
                onChange={(e) => setNewTask({...newTask, difficulty: e.target.value})}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.value} value={difficulty.value}>{difficulty.label}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags
                <span className="text-gray-500 text-xs ml-1">(comma separated)</span>
              </label>
              <input
                type="text"
                placeholder="e.g., calculus, derivatives, math"
                value={newTask.tags}
                onChange={(e) => setNewTask({...newTask, tags: e.target.value})}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Study Notes
                <span className="text-gray-500 text-xs ml-1">(optional)</span>
              </label>
              <textarea
                placeholder="Add any study notes, key points to focus on, or reminders..."
                value={newTask.notes}
                onChange={(e) => setNewTask({...newTask, notes: e.target.value})}
                rows="3"
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Resources & Links
                <span className="text-gray-500 text-xs ml-1">(comma separated URLs)</span>
              </label>
              <input
                type="text"
                placeholder="e.g., https://example.com/tutorial, https://textbook.com/chapter5"
                value={newTask.resources}
                onChange={(e) => setNewTask({...newTask, resources: e.target.value})}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={editingTask ? handleEditTask : handleAddTask}
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : editingTask ? (
                <HiPencil className="w-4 h-4" />
              ) : (
                <HiPlus className="w-4 h-4" />
              )}
              <span>
                {loading ? (editingTask ? 'Updating...' : 'Adding...') : (editingTask ? 'Update Task' : 'Add Task')}
              </span>
            </button>
            <button
              onClick={cancelForm}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {currentView === 'list' && (
        <>
          {/* Filters and Search */}
          <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-4 border border-gray-700/50">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <HiSearch className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-1 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <HiFilter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div className="text-sm text-gray-400">
                {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>

          {/* Study Plan List */}
          <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-white mb-4">Study Tasks</h2>
            <div className="space-y-3">
              {filteredTasks.map((task) => {
                const priority = priorities.find(p => p.value === task.priority)
                const difficulty = difficulties.find(d => d.value === task.difficulty)
                const isOverdue = new Date(task.dueDate) < new Date() && !task.completed
                
                return (
                  <div
                    key={task._id}
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      task.completed 
                        ? 'bg-green-500/10 border-green-500/20' 
                        : isOverdue
                        ? 'bg-red-500/10 border-red-500/20'
                        : 'bg-gray-700/30 border-gray-600/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <button
                          onClick={() => toggleTask(task._id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-1 ${
                            task.completed
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-400 hover:border-green-500'
                          }`}
                        >
                          {task.completed && <HiCheckCircle className="w-4 h-4" />}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2 flex-wrap">
                            <h3 className={`font-semibold ${task.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                              {task.subject}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priority.color}`}>
                              {priority.label}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficulty.color}`}>
                              ★ {difficulty.label}
                            </span>
                          </div>
                          <p className={`${task.completed ? 'text-gray-500' : 'text-gray-300'} text-sm mb-2`}>
                            {task.topic}
                          </p>
                          
                          {task.notes && (
                            <p className="text-xs text-gray-400 mb-2 flex items-start">
                              <HiDocumentText className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                              {task.notes}
                            </p>
                          )}
                          
                          {task.tags && task.tags.length > 0 && (
                            <div className="flex items-center space-x-1 mb-2 flex-wrap gap-1">
                              <HiTag className="w-3 h-3 text-gray-400" />
                              {task.tags.map((tag, index) => (
                                <span key={index} className="bg-gray-600/50 text-gray-300 px-2 py-1 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {task.resources && task.resources.length > 0 && (
                            <div className="mb-2">
                              {task.resources.map((resource, index) => (
                                <a
                                  key={index}
                                  href={resource}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 text-xs inline-flex items-center mr-4"
                                >
                                  <HiLink className="w-3 h-3 mr-1" />
                                  Resource {index + 1}
                                </a>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-400 flex-wrap gap-2">
                            <span className="flex items-center space-x-1">
                              <HiClock className="w-3 h-3" />
                              <span>{task.duration} min planned</span>
                            </span>
                            {task.actualTimeSpent > 0 && (
                              <span className="flex items-center space-x-1">
                                <HiPlay className="w-3 h-3" />
                                <span>{task.actualTimeSpent} min studied</span>
                              </span>
                            )}
                            <span className="flex items-center space-x-1">
                              <HiCalendar className="w-3 h-3" />
                              <span>Due: {task.dueDate}</span>
                            </span>
                            {task.sessions.length > 0 && (
                              <span className="flex items-center space-x-1">
                                <HiCollection className="w-3 h-3" />
                                <span>{task.sessions.length} session{task.sessions.length !== 1 ? 's' : ''}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {!task.completed && (
                          <>
                            <button
                              onClick={() => startTimer(task._id)}
                              disabled={timer.taskId === task._id && !timer.isPomodoro}
                              className="p-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Start regular timer"
                            >
                              <HiPlay className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => startPomodoroTimer(task._id)}
                              disabled={timer.taskId === task._id}
                              className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Start Pomodoro timer"
                            >
                              <HiLightBulb className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => startEditTask(task)}
                          className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all duration-200"
                          title="Edit task"
                        >
                          <HiPencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTask(task._id)}
                          className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-200"
                          title="Delete task"
                        >
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
              
              {filteredTasks.length === 0 && (
                <div className="text-center py-12">
                  <HiBookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {searchTerm || filterBy !== 'all' 
                      ? 'No tasks match your filters.' 
                      : 'No study tasks yet. Add your first task to get started!'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {/* Calendar View */}
      {currentView === 'calendar' && (
        <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Calendar View</h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium text-gray-400 p-2">
                {day}
              </div>
            ))}
            
            {/* Generate calendar days */}
            {(() => {
              const date = new Date(selectedDate || new Date())
              const year = date.getFullYear()
              const month = date.getMonth()
              const firstDay = new Date(year, month, 1).getDay()
              const daysInMonth = new Date(year, month + 1, 0).getDate()
              const days = []
              
              // Add empty cells for days before the first day of the month
              for (let i = 0; i < firstDay; i++) {
                days.push(<div key={`empty-${i}`} className="p-2"></div>)
              }
              
              // Add days of the month
              for (let day = 1; day <= daysInMonth; day++) {
                const dayDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const dayTasks = studyPlan.filter(task => task.dueDate === dayDate)
                const isToday = dayDate === new Date().toISOString().split('T')[0]
                const isSelected = dayDate === selectedDate
                
                days.push(
                  <div
                    key={day}
                    onClick={() => setSelectedDate(dayDate)}
                    className={`p-2 cursor-pointer rounded-lg transition-all duration-200 ${
                      isSelected ? 'bg-purple-500/30 border border-purple-500' :
                      isToday ? 'bg-blue-500/20 border border-blue-500/30' :
                      'hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="text-white text-sm font-medium">{day}</div>
                    {dayTasks.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {dayTasks.slice(0, 3).map((task, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              task.completed ? 'bg-green-400' :
                              task.priority === 'high' ? 'bg-red-400' :
                              task.priority === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
                            }`}
                          />
                        ))}
                        {dayTasks.length > 3 && (
                          <div className="text-xs text-gray-400">+{dayTasks.length - 3}</div>
                        )}
                      </div>
                    )}
                  </div>
                )
              }
              
              return days
            })()}
          </div>
          
          {/* Selected Date Tasks */}
          {selectedDate && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Tasks for {new Date(selectedDate).toLocaleDateString()}
              </h3>
              <div className="space-y-2">
                {studyPlan
                  .filter(task => task.dueDate === selectedDate)
                  .map(task => {
                    const priority = priorities.find(p => p.value === task.priority)
                    return (
                      <div
                        key={task._id}
                        className={`p-3 rounded-lg border ${
                          task.completed 
                            ? 'bg-green-500/10 border-green-500/20' 
                            : 'bg-gray-700/30 border-gray-600/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => toggleTask(task._id)}
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                task.completed
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-gray-400 hover:border-green-500'
                              }`}
                            >
                              {task.completed && <HiCheckCircle className="w-3 h-3" />}
                            </button>
                            <div>
                              <p className={`font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                                {task.subject} - {task.topic}
                              </p>
                              <p className="text-xs text-gray-400">{task.duration} min</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priority.color}`}>
                              {priority.label}
                            </span>
                          </div>
                          <div className="flex space-x-1">
                            {!task.completed && (
                              <button
                                onClick={() => startTimer(task._id)}
                                className="p-1 rounded bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                                title="Start timer"
                              >
                                <HiPlay className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => startEditTask(task)}
                              className="p-1 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                              title="Edit task"
                            >
                              <HiPencil className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => deleteTask(task._id)}
                              className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                              title="Delete task"
                            >
                              <HiTrash className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                {studyPlan.filter(task => task.dueDate === selectedDate).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No tasks scheduled for this date.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Analytics View */}
      {currentView === 'analytics' && (
        <div className="space-y-6">
          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Study Efficiency</h3>
              <div className="text-3xl font-bold text-purple-300 mb-2">{analytics.efficiency.toFixed(1)}%</div>
              <p className="text-xs text-gray-400">
                Actual vs Planned Study Time
              </p>
              <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-violet-500 h-2 rounded-full"
                  style={{ width: `${Math.min(analytics.efficiency, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Average Session</h3>
              <div className="text-3xl font-bold text-blue-300 mb-2">
                {analytics.averageSessionLength.toFixed(0)}m
              </div>
              <p className="text-xs text-gray-400">
                Per study session
              </p>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Total Study Time</h3>
              <div className="text-3xl font-bold text-green-300 mb-2">
                {Math.round(analytics.totalActualTime / 60)}h
              </div>
              <p className="text-xs text-gray-400">
                {analytics.totalActualTime} minutes total
              </p>
            </div>
          </div>

          {/* Subject Performance */}
          <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Subject Performance</h3>
            <div className="space-y-4">
              {Object.entries(analytics.subjectStats).map(([subject, stats]) => (
                <div key={subject} className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{subject}</h4>
                    <span className="text-sm text-gray-400">
                      {stats.completed}/{stats.tasks} tasks completed
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Planned Time</p>
                      <p className="text-white font-medium">{stats.planned} min</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Actual Time</p>
                      <p className="text-white font-medium">{stats.actual} min</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Completion Rate</span>
                      <span>{((stats.completed / stats.tasks) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${(stats.completed / stats.tasks) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              {Object.keys(analytics.subjectStats).length === 0 && (
                <p className="text-gray-500 text-center py-8">No study data available yet.</p>
              )}
            </div>
          </div>

          {/* Weekly Progress Chart */}
          <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Weekly Study Progress</h3>
            <div className="flex items-end space-x-2 h-40">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                // This is a simplified chart - in a real app you'd calculate actual daily study time
                const dailyTime = Math.random() * 4 // Random data for demo
                const height = (dailyTime / 4) * 100
                return (
                  <div key={day} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-purple-500 to-violet-400 rounded-t"
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="mt-2 text-xs text-gray-400">{day}</div>
                    <div className="text-xs text-gray-300">{dailyTime.toFixed(1)}h</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudyPlaner