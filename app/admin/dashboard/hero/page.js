'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllHero, createHero, updateHero, deleteHero } from '@/lib/api'
import { FaArrowLeft, FaSave, FaPlus, FaTimes, FaCheckCircle } from 'react-icons/fa'
import DataTable from '@/components/DataTable'

export default function HeroAdminPage() {
  const [heroes, setHeroes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    ctaText: '',
    ctaLink: '',
    backgroundImage: '',
    isActive: false
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchHeroes()
  }, [])

  const fetchHeroes = async () => {
    try {
      const response = await getAllHero()
      // Handle both array and object responses
      const heroData = Array.isArray(response.data) ? response.data : [response.data].filter(Boolean)
      setHeroes(heroData)
    } catch (err) {
      console.error('Fetch heroes error:', err)
      setHeroes([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (hero) => {
    setEditingItem(hero)
    setFormData({
      title: hero.title || '',
      subtitle: hero.subtitle || '',
      ctaText: hero.ctaText || '',
      ctaLink: hero.ctaLink || '',
      backgroundImage: hero.backgroundImage || '',
      isActive: hero.isActive || false
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this hero section?')) return

    try {
      await deleteHero(id)
      fetchHeroes()
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
        await updateHero(editingItem._id, formData)
      } else {
        await createHero(formData)
      }
      setShowModal(false)
      fetchHeroes()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      resetForm()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save hero section')
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      ctaText: '',
      ctaLink: '',
      backgroundImage: '',
      isActive: false
    })
    setEditingItem(null)
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
      width: '25%',
      render: (row) => (
        <div>
          <div className="font-semibold text-gray-900">{row.title}</div>
          {row.isActive && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
              Active
            </span>
          )}
        </div>
      )
    },
    {
      key: 'subtitle',
      label: 'Subtitle',
      sortable: true,
      width: '30%',
      render: (row) => (
        <p className="text-gray-600 line-clamp-2">{row.subtitle}</p>
      )
    },
    {
      key: 'ctaText',
      label: 'Button',
      sortable: false,
      width: '15%',
      render: (row) => (
        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
          {row.ctaText || 'Learn More'}
        </span>
      )
    },
    {
      key: 'backgroundImage',
      label: 'Background Image',
      sortable: false,
      width: '30%',
      render: (row) => {
        if (!row.backgroundImage) {
          return <span className="text-xs text-gray-400">No image</span>
        }
        
        return (
          <div className="flex items-center gap-2">
            <img 
              src={row.backgroundImage} 
              alt="Hero background" 
              className="w-16 h-10 object-cover rounded border border-gray-200"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="40" viewBox="0 0 64 40"%3E%3Crect fill="%23f3f4f6" width="64" height="40"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="10"%3E❌%3C/text%3E%3C/svg%3E'
              }}
            />
            {/* <span className="text-xs text-gray-500 truncate max-w-[120px]" title={row.backgroundImage}>
              {row.backgroundImage.substring(0, 30)}...
            </span> */}
          </div>
        )
      }
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
            <h1 className="text-xl font-bold text-gray-900">Hero Sections</h1>
            <p className="text-xs text-gray-600">{heroes.length} items</p>
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
        data={heroes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No hero sections yet"
        itemName="hero sections"
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">
                {editingItem ? 'Edit' : 'Add'} Hero Section
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
                  placeholder="Welcome to Our School"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Subtitle *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  placeholder="Empowering minds, shaping futures"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {/* CTA Text */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Button Text</label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Learn More"
                  />
                </div>

                {/* CTA Link */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Button Link</label>
                  <input
                    type="text"
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="#about"
                  />
                </div>
              </div>

              {/* Background Image */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Background Image URL</label>
                <input
                  type="text"
                  value={formData.backgroundImage}
                  onChange={(e) => setFormData({ ...formData, backgroundImage: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="https://example.com/image.jpg"
                />
                {/* Image Preview */}
                {formData.backgroundImage && (
                  <div className="mt-2">
                    <img 
                      src={formData.backgroundImage} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded-lg border border-gray-300"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'block'
                      }}
                    />
                    <p className="text-xs text-red-500 mt-1" style={{ display: 'none' }}>
                      ⚠️ Failed to load image. Please check the URL.
                    </p>
                  </div>
                )}
              </div>

              {/* Is Active */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="isActive" className="text-xs font-medium text-gray-700">
                  Set as active (only one can be active at a time)
                </label>
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
