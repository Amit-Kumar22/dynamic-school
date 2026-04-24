'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllNotices, createNotice, updateNotice, deleteNotice } from '@/lib/api'
import { FaArrowLeft, FaSave, FaPlus, FaTimes, FaCheckCircle, FaCalendar } from 'react-icons/fa'
import DataTable from '@/components/DataTable'

export default function NoticeAdminPage() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    date: '',
    isActive: true
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchNotices()
  }, [])

  const fetchNotices = async () => {
    try {
      const response = await getAllNotices({ limit: 50 })
      setNotices(response.data || [])
    } catch (err) {
      console.error('Fetch notices error:', err)
      setNotices([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleEdit = (notice) => {
    setEditingItem(notice)
    setFormData({
      title: notice.title || '',
      description: notice.description || '',
      imageUrl: notice.imageUrl || '',
      date: notice.date ? new Date(notice.date).toISOString().split('T')[0] : '',
      isActive: notice.isActive !== undefined ? notice.isActive : true
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this notice? This will also delete any attached file.')) return

    try {
      await deleteNotice(id)
      fetchNotices()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete notice')
      setTimeout(() => setError(''), 3000)
    }
  }

  const validateImageUrl = (url) => {
    if (!url || !url.trim()) return true
    try {
      new URL(url)
      return /^https?:\/\/.+\..+/.test(url)
    } catch {
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    // Validate image URL if provided
    if (formData.imageUrl && !validateImageUrl(formData.imageUrl)) {
      setError('Please provide a valid image URL (http/https)')
      setSaving(false)
      return
    }

    try {
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        isActive: formData.isActive
      }
      
      if (formData.date) {
        submitData.date = formData.date
      }
      
      if (formData.imageUrl && formData.imageUrl.trim()) {
        submitData.imageUrl = formData.imageUrl.trim()
      }

      if (editingItem) {
        await updateNotice(editingItem._id, submitData)
      } else {
        await createNotice(submitData)
      }
      
      setShowModal(false)
      fetchNotices()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      resetForm()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save notice')
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      date: '',
      isActive: true
    })
    setEditingItem(null)
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
    setError('')
  }

  const downloadFile = (notice) => {
    if (notice.imageUrl) {
      window.open(notice.imageUrl, '_blank')
    }
  }

  const columns = [
    {
      header: 'Title',
      accessor: 'title',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.title}</div>
          {row.description && (
            <div className="text-sm text-gray-500 mt-1 line-clamp-2">{row.description}</div>
          )}
        </div>
      )
    },
    {
      header: 'Date',
      accessor: 'date',
      render: (row) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <FaCalendar className="text-xs" />
          {formatDate(row.date)}
        </div>
      )
    },
    {
      header: 'Image',
      accessor: 'imageUrl',
      render: (row) => (
        <div>
          {row.imageUrl ? (
            <button
              onClick={() => downloadFile(row)}
              className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm"
            >
              <img 
                src={row.imageUrl} 
                alt="Preview" 
                className="w-8 h-8 object-cover rounded"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'inline'
                }}
              />
              <span className="hidden">View Image</span>
            </button>
          ) : (
            <span className="text-gray-400 text-sm">No image</span>
          )}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'isActive',
      render: (row) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          row.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6 w-1/3"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
            <FaArrowLeft />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notice Management</h1>
            <p className="text-gray-600 text-sm mt-1">Manage website notices and announcements</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <FaPlus /> Add Notice
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
          <div className="flex items-center">
            <FaCheckCircle className="text-green-500 mr-2" />
            <p className="text-green-700 font-medium">Notice saved successfully!</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        data={notices}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No notices found. Create your first notice to get started!"
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingItem ? 'Edit Notice' : 'Add New Notice'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input"
                    placeholder="Enter notice title"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input"
                    rows="4"
                    placeholder="Enter notice description (optional)"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="input"
                  />
                  <p className="text-sm text-gray-500 mt-1">Leave empty to use current date</p>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="input"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter a valid image URL (jpg, png, gif, webp)
                  </p>
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="w-20 h-20 object-cover rounded border"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'block'
                        }}
                      />
                      <p className="hidden text-red-500 text-sm mt-1">Invalid image URL</p>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active (visible on website)
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn btn-secondary"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !formData.title.trim()}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <FaSave />
                    {saving ? 'Saving...' : (editingItem ? 'Update Notice' : 'Create Notice')}
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