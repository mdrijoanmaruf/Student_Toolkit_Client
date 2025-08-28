import { useState, useCallback } from 'react'
import useAxios from './useAxios'

const useStudyPlannerApi = () => {
  const axios = useAxios()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleApiCall = useCallback(async (apiCall) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiCall()
      setLoading(false)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred')
      setLoading(false)
      throw err
    }
  }, [])

  // Study Plans API
  const getStudyPlans = useCallback(async (userId) => {
    return handleApiCall(() => axios.get(`/api/study-plans/${userId}`))
  }, [axios, handleApiCall])

  const addStudyTask = useCallback(async (taskData) => {
    return handleApiCall(() => axios.post('/api/study-plans', taskData))
  }, [axios, handleApiCall])

  const updateStudyTask = useCallback(async (taskId, taskData) => {
    return handleApiCall(() => axios.put(`/api/study-plans/${taskId}`, taskData))
  }, [axios, handleApiCall])

  const deleteStudyTask = useCallback(async (taskId) => {
    return handleApiCall(() => axios.delete(`/api/study-plans/${taskId}`))
  }, [axios, handleApiCall])

  const addStudySession = useCallback(async (taskId, sessionData) => {
    return handleApiCall(() => axios.post(`/api/study-plans/${taskId}/sessions`, sessionData))
  }, [axios, handleApiCall])

  // Study Goals API
  const getStudyGoals = useCallback(async (userId) => {
    return handleApiCall(() => axios.get(`/api/study-goals/${userId}`))
  }, [axios, handleApiCall])

  const updateStudyGoals = useCallback(async (userId, goalsData) => {
    return handleApiCall(() => axios.put(`/api/study-goals/${userId}`, goalsData))
  }, [axios, handleApiCall])

  // Analytics API
  const getStudyAnalytics = useCallback(async (userId) => {
    return handleApiCall(() => axios.get(`/api/study-analytics/${userId}`))
  }, [axios, handleApiCall])

  return {
    loading,
    error,
    // Study Plans
    getStudyPlans,
    addStudyTask,
    updateStudyTask,
    deleteStudyTask,
    addStudySession,
    // Study Goals
    getStudyGoals,
    updateStudyGoals,
    // Analytics
    getStudyAnalytics
  }
}

export default useStudyPlannerApi
