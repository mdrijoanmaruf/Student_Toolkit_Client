import React, { useState, useEffect } from 'react'
import { 
  HiBookOpen, 
  HiPlus, 
  HiPencil, 
  HiTrash,
  HiExternalLink,
  HiSearch,
  HiFilter,
  HiDocument,
  HiLink,
  HiAcademicCap,
  HiCollection,
  HiX,
  HiDownload,
  HiEye,
  HiClock
} from 'react-icons/hi'
import useAuth from '../../Hook/useAuth'
import useAxios from '../../Hook/useAxios'
import Swal from 'sweetalert2'

const CourseMaterial = () => {
  const { user } = useAuth()
  const axiosSecure = useAxios()
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [newMaterial, setNewMaterial] = useState({
    title: '',
    type: 'notes',
    links: [{ title: '', url: '' }]
  })

  const materialTypes = [
    { value: 'notes', label: 'Notes', icon: HiDocument },
    { value: 'slides', label: 'Slides', icon: HiCollection },
    { value: 'video', label: 'Video', icon: HiEye },
    { value: 'article', label: 'Article', icon: HiLink },
    { value: 'textbook', label: 'Textbook', icon: HiBookOpen },
    { value: 'assignment', label: 'Assignment', icon: HiAcademicCap }
  ]

  // Initialize with dummy data
  useEffect(() => {
    fetchMaterials()
  }, [user])

  // Fetch materials from API
  const fetchMaterials = async () => {
    if (!user?.uid) return
    
    try {
      setLoading(true)
      const response = await axiosSecure.get(`/api/course-materials/${user.uid}`)
      const data = response.data
      
      if (data.success) {
        setMaterials(data.data)
      } else {
        console.error('Error fetching materials:', data.message)
      }
    } catch (error) {
      console.error('Error fetching materials:', error)
      await Swal.fire({
        title: 'Error',
        text: 'Failed to fetch course materials',
        icon: 'error',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#dc2626'
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter materials based on search
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  // Add new material
  const handleAddMaterial = async () => {
    if (!newMaterial.title || newMaterial.links.every(link => !link.title.trim() || !link.url.trim())) {
      await Swal.fire({
        title: 'Missing Information',
        text: 'Please fill in all required fields (Title and at least one Link with title and URL)',
        icon: 'warning',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#9333ea'
      })
      return
    }

    setSubmitting(true)
    try {
      const response = await axiosSecure.post('/api/course-materials', {
        userId: user.uid,
        title: newMaterial.title,
        type: newMaterial.type,
        links: newMaterial.links.filter(link => link.title.trim() !== '' && link.url.trim() !== '')
      })

      const data = response.data
      
      if (data.success) {
        // Refresh materials list
        await fetchMaterials()
        
        setNewMaterial({
          title: '',
          type: 'notes',
          links: [{ title: '', url: '' }]
        })
        setShowAddForm(false)

        await Swal.fire({
          title: 'Success!',
          text: 'Course material added successfully',
          icon: 'success',
          background: '#1f2937',
          color: '#f9fafb',
          confirmButtonColor: '#10b981',
          timer: 2000,
          showConfirmButton: false
        })
      } else {
        await Swal.fire({
          title: 'Error',
          text: data.message || 'Failed to add course material',
          icon: 'error',
          background: '#1f2937',
          color: '#f9fafb',
          confirmButtonColor: '#dc2626'
        })
      }
    } catch (error) {
      console.error('Error adding material:', error)
      await Swal.fire({
        title: 'Error',
        text: 'Failed to add course material',
        icon: 'error',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#dc2626'
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Edit material
  const handleEditMaterial = async () => {
    if (!editingMaterial.title || editingMaterial.links.every(link => !link.title.trim() || !link.url.trim())) {
      await Swal.fire({
        title: 'Missing Information',
        text: 'Please fill in all required fields (Title and at least one Link with title and URL)',
        icon: 'warning',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#9333ea'
      })
      return
    }

    setSubmitting(true)
    try {
      const response = await axiosSecure.put(`/api/course-materials/${editingMaterial._id}`, {
        title: editingMaterial.title,
        type: editingMaterial.type,
        links: editingMaterial.links.filter(link => link.title.trim() !== '' && link.url.trim() !== '')
      })

      const data = response.data
      
      if (data.success) {
        // Refresh materials list
        await fetchMaterials()
        setEditingMaterial(null)
        setShowEditForm(false)

        await Swal.fire({
          title: 'Updated!',
          text: 'Course material updated successfully',
          icon: 'success',
          background: '#1f2937',
          color: '#f9fafb',
          confirmButtonColor: '#10b981',
          timer: 2000,
          showConfirmButton: false
        })
      } else {
        await Swal.fire({
          title: 'Error',
          text: data.message || 'Failed to update course material',
          icon: 'error',
          background: '#1f2937',
          color: '#f9fafb',
          confirmButtonColor: '#dc2626'
        })
      }
    } catch (error) {
      console.error('Error updating material:', error)
      await Swal.fire({
        title: 'Error',
        text: 'Failed to update course material',
        icon: 'error',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#dc2626'
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Handle edit material click
  const handleEditMaterialClick = (material) => {
    setEditingMaterial(material)
    setShowEditForm(true)
    setShowAddForm(false)
  }

  // Delete material
  const handleDeleteMaterial = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Material?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      background: '#1f2937',
      color: '#f9fafb',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#9333ea'
    })

    if (result.isConfirmed) {
      try {
        const response = await axiosSecure.delete(`/api/course-materials/${id}`)
        const data = response.data
        
        if (data.success) {
          // Refresh materials list
          await fetchMaterials()
          
          await Swal.fire({
            title: 'Deleted!',
            text: 'Material has been deleted',
            icon: 'success',
            background: '#1f2937',
            color: '#f9fafb',
            confirmButtonColor: '#10b981',
            timer: 2000,
            showConfirmButton: false
          })
        } else {
          await Swal.fire({
            title: 'Error',
            text: data.message || 'Failed to delete material',
            icon: 'error',
            background: '#1f2937',
            color: '#f9fafb',
            confirmButtonColor: '#dc2626'
          })
        }
      } catch (error) {
        console.error('Error deleting material:', error)
        await Swal.fire({
          title: 'Error',
          text: 'Failed to delete material',
          icon: 'error',
          background: '#1f2937',
          color: '#f9fafb',
          confirmButtonColor: '#dc2626'
        })
      }
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    } catch (error) {
      return 'N/A'
    }
  }

  // Update last accessed time
  const handleLinkClick = async (materialId, url) => {
    try {
      // Update last accessed time in background
      axiosSecure.patch(`/api/course-materials/${materialId}/access`)
      
      // Open the link
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('Error updating access time:', error)
      // Still open the link even if updating fails
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  // Add new link field
  const addLinkField = (isEditing = false) => {
    if (isEditing) {
      setEditingMaterial({
        ...editingMaterial,
        links: [...editingMaterial.links, { title: '', url: '' }]
      })
    } else {
      setNewMaterial({
        ...newMaterial,
        links: [...newMaterial.links, { title: '', url: '' }]
      })
    }
  }

  // Remove link field
  const removeLinkField = (index, isEditing = false) => {
    if (isEditing) {
      const newLinks = editingMaterial.links.filter((_, i) => i !== index)
      setEditingMaterial({
        ...editingMaterial,
        links: newLinks.length > 0 ? newLinks : [{ title: '', url: '' }]
      })
    } else {
      const newLinks = newMaterial.links.filter((_, i) => i !== index)
      setNewMaterial({
        ...newMaterial,
        links: newLinks.length > 0 ? newLinks : [{ title: '', url: '' }]
      })
    }
  }

  // Update link field
  const updateLinkField = (index, field, value, isEditing = false) => {
    if (isEditing) {
      const newLinks = [...editingMaterial.links]
      newLinks[index] = { ...newLinks[index], [field]: value }
      setEditingMaterial({
        ...editingMaterial,
        links: newLinks
      })
    } else {
      const newLinks = [...newMaterial.links]
      newLinks[index] = { ...newLinks[index], [field]: value }
      setNewMaterial({
        ...newMaterial,
        links: newLinks
      })
    }
  }

  // Get type icon
  const getTypeIcon = (type) => {
    const typeObj = materialTypes.find(t => t.value === type)
    return typeObj ? typeObj.icon : HiDocument
  }

  // Get type color
  const getTypeColor = (type) => {
    const colors = {
      notes: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      slides: 'text-green-400 bg-green-500/10 border-green-500/20',
      video: 'text-red-400 bg-red-500/10 border-red-500/20',
      article: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      textbook: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
      assignment: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    }
    return colors[type] || colors.notes
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl p-6 border border-blue-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 backdrop-blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <HiBookOpen className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Course Materials</h1>
              <p className="text-blue-300">Organize and access your study resources</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-2">
                <HiCollection className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">Total Materials</span>
              </div>
              <p className="text-2xl font-bold text-blue-400 mt-1">{materials.length}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-2">
                <HiDocument className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">Types</span>
              </div>
              <p className="text-2xl font-bold text-purple-400 mt-1">
                {new Set(materials.map(m => m.type)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              />
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={() => {
              setShowAddForm(!showAddForm)
              setShowEditForm(false)
              setEditingMaterial(null)
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <HiPlus className="w-5 h-5" />
            <span>{showAddForm ? 'Cancel' : 'Add Material'}</span>
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <HiPlus className="w-5 h-5 mr-2 text-green-400" />
            Add New Material
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={newMaterial.title}
                onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Enter material title"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type
              </label>
              <select
                value={newMaterial.type}
                onChange={(e) => setNewMaterial({...newMaterial, type: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {materialTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Links */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Links * (at least one required)
                </label>
                <button
                  type="button"
                  onClick={() => addLinkField(false)}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg text-sm transition-all duration-200"
                >
                  <HiPlus className="w-4 h-4" />
                  <span>Add Link</span>
                </button>
              </div>
              <div className="space-y-3">
                {newMaterial.links.map((link, index) => (
                  <div key={index} className="border border-gray-600/30 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">Link {index + 1}</span>
                      {newMaterial.links.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLinkField(index, false)}
                          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-all duration-200"
                        >
                          <HiX className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Title *</label>
                        <input
                          type="text"
                          value={link.title || ''}
                          onChange={(e) => updateLinkField(index, 'title', e.target.value, false)}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                          placeholder="e.g., Course Notes, Video Lecture"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">URL *</label>
                        <input
                          type="url"
                          value={link.url || ''}
                          onChange={(e) => updateLinkField(index, 'url', e.target.value, false)}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false)
                setNewMaterial({
                  title: '',
                  type: 'notes',
                  links: [{ title: '', url: '' }]
                })
              }}
              className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddMaterial}
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-200"
            >
              {submitting ? 'Adding...' : 'Add Material'}
            </button>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {showEditForm && editingMaterial && (
        <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <HiPencil className="w-5 h-5 mr-2 text-yellow-400" />
            Edit Material
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={editingMaterial.title}
                onChange={(e) => setEditingMaterial({...editingMaterial, title: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Enter material title"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type
              </label>
              <select
                value={editingMaterial.type}
                onChange={(e) => setEditingMaterial({...editingMaterial, type: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {materialTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Links */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Links * (at least one required)
                </label>
                <button
                  type="button"
                  onClick={() => addLinkField(true)}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg text-sm transition-all duration-200"
                >
                  <HiPlus className="w-4 h-4" />
                  <span>Add Link</span>
                </button>
              </div>
              <div className="space-y-3">
                {editingMaterial.links.map((link, index) => (
                  <div key={index} className="border border-gray-600/30 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">Link {index + 1}</span>
                      {editingMaterial.links.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLinkField(index, true)}
                          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-all duration-200"
                        >
                          <HiX className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Title *</label>
                        <input
                          type="text"
                          value={link.title || ''}
                          onChange={(e) => updateLinkField(index, 'title', e.target.value, true)}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                          placeholder="e.g., Course Notes, Video Lecture"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">URL *</label>
                        <input
                          type="url"
                          value={link.url || ''}
                          onChange={(e) => updateLinkField(index, 'url', e.target.value, true)}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowEditForm(false)
                setEditingMaterial(null)
              }}
              className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleEditMaterial}
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-200"
            >
              {submitting ? 'Updating...' : 'Update Material'}
            </button>
          </div>
        </div>
      )}

      {/* Materials Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeleton
          [...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 animate-pulse"
            >
              {/* Header skeleton */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-gray-700 rounded-lg"></div>
                  <div className="w-8 h-8 bg-gray-700 rounded-lg"></div>
                </div>
              </div>

              {/* Links skeleton */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-4 h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-20"></div>
                </div>
                <div className="space-y-3">
                  {[...Array(2)].map((_, linkIndex) => (
                    <div key={linkIndex} className="bg-gray-700/30 rounded-lg p-3">
                      <div className="h-4 bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer skeleton */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
                <div className="flex items-center space-x-4">
                  <div className="h-3 bg-gray-700 rounded w-20"></div>
                  <div className="h-3 bg-gray-700 rounded w-24"></div>
                </div>
                <div className="h-5 bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          ))
        ) : filteredMaterials.map((material) => {
          const TypeIcon = getTypeIcon(material.type)
          const typeColor = getTypeColor(material.type)
          
          // Handle legacy data - ensure links is always an array
          const materialLinks = Array.isArray(material.links) 
            ? material.links 
            : (material.links ? [{ title: 'Link', url: material.links }] : [])
          
          return (
            <div
              key={material._id}
              className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-200 group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg border ${typeColor}`}>
                    <TypeIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {material.title}
                    </h3>
                    <p className="text-sm text-gray-400 capitalize">{material.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditMaterialClick({
                      ...material,
                      links: materialLinks
                    })}
                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                  >
                    <HiPencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMaterial(material._id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Links */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-3">
                  <HiLink className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">
                    {materialLinks.length} Link{materialLinks.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-3">
                  {materialLinks.slice(0, 3).map((link, index) => (
                    <div key={index} className="bg-gray-700/30 rounded-lg p-3 hover:bg-gray-700/50 transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-white mb-1 truncate">
                            {link.title}
                          </h4>
                          <button
                            onClick={() => handleLinkClick(material._id, link.url)}
                            className="text-blue-400 hover:text-blue-300 text-xs truncate block w-full text-left underline underline-offset-2"
                          >
                            {link.url}
                          </button>
                        </div>
                        <button
                          onClick={() => handleLinkClick(material._id, link.url)}
                          className="ml-2 p-1 text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <HiExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {materialLinks.length > 3 && (
                    <div className="text-center">
                      <span className="text-xs text-gray-500 bg-gray-700/30 px-3 py-1 rounded-full">
                        +{materialLinks.length - 3} more link{materialLinks.length - 3 !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
                <div className="flex items-center space-x-4">
                  <div className="text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <HiClock className="w-3 h-3" />
                      <span>Added {formatDate(material.createdAt)}</span>
                    </div>
                  </div>
                  {material.lastAccessed && (
                    <div className="text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <HiEye className="w-3 h-3" />
                        <span>Accessed {formatDate(material.lastAccessed)}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColor.replace('border-', 'bg-').replace('/30', '/20')} ${typeColor.replace('border-', 'text-')}`}>
                    {material.type}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {!loading && filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <HiBookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No materials found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? 'Try adjusting your search criteria'
              : 'Start by adding your first material'
            }
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-medium transition-all duration-200"
          >
            Add Your First Material
          </button>
        </div>
      )}
    </div>
  )
}

export default CourseMaterial