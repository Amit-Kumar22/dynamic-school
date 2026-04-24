'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllServicesAdmin, createService, updateService, deleteService } from '@/lib/api'
import { FaArrowLeft, FaSave, FaPlus, FaTimes, FaCheckCircle, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa'
import DataTable from '@/components/DataTable'

export default function ServicesAdminPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    isActive: true
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await getAllServicesAdmin()
      setServices(response.data || [])
    } catch (err) {
      console.error('Fetch services error:', err)
      setServices([])
      setError('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (service) => {
    setEditingItem(service)
    setFormData({
      title: service.title || '',
      description: service.description || '',
      imageUrl: service.imageUrl || '',
      isActive: service.isActive !== undefined ? service.isActive : true
    })
    setShowModal(true)
  }

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      isActive: true
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    setSuccess(false)

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        setError('Title is required')
        setSaving(false)
        return
      }

      // Validate URL if provided
      if (formData.imageUrl && !isValidURL(formData.imageUrl)) {
        setError('Please provide a valid image URL')
        setSaving(false)
        return
      }

      const serviceData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim(),
        isActive: formData.isActive
      }

      if (editingItem) {
        await updateService(editingItem._id, serviceData)
      } else {
        await createService(serviceData)
      }

      setSuccess(true)
      setTimeout(() => {
        setShowModal(false)
        fetchServices()
        resetForm()
      }, 1500)
    } catch (err) {
      console.error('Save error:', err)
      setError(err.response?.data?.message || 'Failed to save service')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      await deleteService(id)
      fetchServices()
    } catch (err) {
      console.error('Delete error:', err)
      setError('Failed to delete service')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      isActive: true
    })
    setEditingItem(null)
    setError('')
    setSuccess(false)
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

  const isValidURL = (string) => {
    try {
      new URL(string)
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(string)
    } catch (_) {
      return false
    }
  }

  const columns = [
    {
      header: 'Title',
      accessor: 'title',
      cell: (service) => (
        <div>
          <div className="font-medium">{service.title}</div>
          {service.description && (
            <div className="text-sm text-gray-500 truncate max-w-xs">
              {service.description}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Image',
      accessor: 'imageUrl',
      cell: (service) => (
        <div className="flex items-center">
          {service.imageUrl ? (
            <div className="w-12 h-12 rounded overflow-hidden">
              <img
                src={service.imageUrl}
                alt={service.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder.png' // Fallback image
                }}
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'isActive',
      cell: (service) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          service.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {service.isActive ? (
            <>
              <FaEye className="mr-1" />
              Active
            </>
          ) : (
            <>
              <FaEyeSlash className="mr-1" />
              Inactive
            </>
          )}
        </span>
      )
    },
    {
      header: 'Created',
      accessor: 'createdAt',
      cell: (service) => new Date(service.createdAt).toLocaleDateString()
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (service) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(service)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(service._id)}
            className="text-red-600 hover:text-red-800 p-1 rounded"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      )
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading services...</span>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Service Management</h1>
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" />
            Add Service
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && !showModal && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Services Table */}
      <div className="bg-white rounded-lg shadow">
        <DataTable
          data={services}
          columns={columns}
          emptyMessage="No services found. Create your first service to get started."
        />
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingItem ? 'Edit Service' : 'Add New Service'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                  disabled={saving}
                >
                  <FaTimes />
                </button>
              </div>

              {/* Success Message */}
              {success && (
                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center">
                  <FaCheckCircle className="mr-2" />
                  Service {editingItem ? 'updated' : 'created'} successfully!
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter service title"
                      required
                      maxLength={100}
                      disabled={saving}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter service description (optional)"
                      rows={3}
                      maxLength={500}
                      disabled={saving}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.description.length}/500 characters
                    </p>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                      disabled={saving}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Optional. Provide a direct link to an image file (JPG, PNG, GIF, WebP)
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        disabled={saving}
                      />
                      <span className="ml-2 text-sm text-gray-700">Active (visible on website)</span>
                    </label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !formData.title.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" />
                        {editingItem ? 'Update' : 'Create'} Service
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}