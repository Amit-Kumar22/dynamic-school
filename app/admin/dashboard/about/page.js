'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllAbout, createAbout, updateAbout, deleteAbout } from '@/lib/api'
import { FaArrowLeft, FaSave, FaPlus, FaTimes, FaCheckCircle, FaTrash } from 'react-icons/fa'
import DataTable from '@/components/DataTable'

export default function AboutAdminPage() {
  const [abouts, setAbouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mission: '',
    vision: '',
    image: '',
    stats: []
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAbouts()
  }, [])

  const fetchAbouts = async () => {
    try {
      const response = await getAllAbout()
      const aboutData = Array.isArray(response.data) ? response.data : [response.data].filter(Boolean)
      setAbouts(aboutData)
    } catch (err) {
      console.error('Fetch abouts error:', err)
      setAbouts([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (about) => {
    setEditingItem(about)
    setFormData({
      title: about.title || '',
      description: about.description || '',
      mission: about.mission || '',
      vision: about.vision || '',
      image: about.image || '',
      stats: about.stats || []
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this about section?')) return

    try {
      await deleteAbout(id)
      fetchAbouts()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      if (editingItem) {
        await updateAbout(editingItem._id, formData)
      } else {
        await createAbout(formData)
      }
      setShowModal(false)
      fetchAbouts()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      resetForm()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save about section')
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      mission: '',
      vision: '',
      image: '',
      stats: []
    })
    setEditingItem(null)
  }

  const addStat = () => {
    setFormData({
      ...formData,
      stats: [...formData.stats, { label: '', value: '' }]
    })
  }

  const removeStat = (index) => {
    setFormData({
      ...formData,
      stats: formData.stats.filter((_, i) => i !== index)
    })
  }

  const updateStat = (index, field, value) => {
    const newStats = [...formData.stats]
    newStats[index][field] = value
    setFormData({ ...formData, stats: newStats })
  }

  if (loading) {
    return <div className="flex items-center justify-center py-12">Loading...</div>
  }

  // Define table columns
  const columns = [
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      width: '20%',
      render: (row) => (
        <div className="font-semibold text-gray-900">{row.title}</div>
      )
    },
    {
      key: 'description',
      label: 'Description',
      sortable: false,
      width: '40%',
      render: (row) => (
        <p className="text-gray-600 line-clamp-2">{row.description}</p>
      )
    },
    {
      key: 'stats',
      label: 'Statistics',
      sortable: false,
      width: '20%',
      render: (row) => (
        <span className="text-xs text-gray-500">
          {row.stats?.length > 0 ? `📊 ${row.stats.length} stats` : 'No stats'}
        </span>
      )
    },
    {
      key: 'image',
      label: 'Image',
      sortable: false,
      width: '20%',
      render: (row) => (
        row.image ? (
          <span className="text-xs text-gray-500">📷 Image added</span>
        ) : (
          <span className="text-xs text-gray-400">No image</span>
        )
      )
    }
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <FaArrowLeft className="text-xs text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">About Sections</h1>
            <p className="text-xs text-gray-600">{abouts.length} items</p>
          </div>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-1.5"
        >
          <FaPlus className="text-xs" /> Add New
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded flex items-center gap-2">
          <FaCheckCircle /> Operation successful!
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-600 text-sm rounded">
          {error}
        </div>
      )}

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={abouts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No about sections yet"
        itemName="about sections"
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">
                {editingItem ? 'Edit' : 'Add'} About Section
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="About Our School"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  placeholder="School description..."
                />
              </div>

              {/* Mission */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Mission *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.mission}
                  onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  placeholder="Our mission..."
                />
              </div>

              {/* Vision */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Vision *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.vision}
                  onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  placeholder="Our vision..."
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Stats */}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-900">Statistics</label>
                  <button
                    type="button"
                    onClick={addStat}
                    className="px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded hover:bg-primary-700 transition-colors flex items-center gap-1"
                  >
                    <FaPlus className="text-xs" /> Add Stat
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.stats.map((stat, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => updateStat(index, 'label', e.target.value)}
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="Label (e.g., Students)"
                      />
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => updateStat(index, 'value', e.target.value)}
                        className="w-24 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="Value"
                      />
                      <button
                        type="button"
                        onClick={() => removeStat(index)}
                        className="px-2 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  <FaSave className="text-xs" />
                  {saving ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
