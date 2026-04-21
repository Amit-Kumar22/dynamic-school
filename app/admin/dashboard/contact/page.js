'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllContacts, createContact, updateContact, deleteContact } from '@/lib/api'
import { FaArrowLeft, FaSave, FaPlus, FaTimes, FaCheckCircle, FaTrash } from 'react-icons/fa'
import DataTable from '@/components/DataTable'

export default function ContactAdminPage() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    schoolName: '',
    address: '',
    phone: '',
    email: '',
    alternatePhone: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: ''
    }
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await getAllContacts()
      const contactData = Array.isArray(response.data) ? response.data : [response.data].filter(Boolean)
      setContacts(contactData)
    } catch (err) {
      console.error('Fetch contacts error:', err)
      setContacts([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (contact) => {
    setEditingItem(contact)
    setFormData({
      schoolName: contact.schoolName || '',
      address: contact.address || '',
      phone: contact.phone || '',
      email: contact.email || '',
      alternatePhone: contact.alternatePhone || '',
      socialLinks: contact.socialLinks || {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: ''
      }
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this contact?')) return

    try {
      await deleteContact(id)
      fetchContacts()
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
        await updateContact(editingItem._id, formData)
      } else {
        await createContact(formData)
      }
      setShowModal(false)
      fetchContacts()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      resetForm()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save contact')
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setFormData({
      schoolName: '',
      address: '',
      phone: '',
      email: '',
      alternatePhone: '',
      socialLinks: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: ''
      }
    })
    setEditingItem(null)
  }

  if (loading) {
    return <div className="flex items-center justify-center py-12">Loading...</div>
  }

  // Define table columns
  const columns = [
    {
      key: 'schoolName',
      label: 'School Name',
      sortable: true,
      width: '20%',
      render: (row) => (
        <div className="font-semibold text-gray-900">{row.schoolName}</div>
      )
    },
    {
      key: 'address',
      label: 'Address',
      sortable: false,
      width: '30%',
      render: (row) => (
        <p className="text-gray-600 line-clamp-2">📍 {row.address}</p>
      )
    },
    {
      key: 'contact',
      label: 'Contact',
      sortable: false,
      width: '25%',
      render: (row) => (
        <div className="text-xs text-gray-600">
          <div>📞 {row.phone}</div>
          <div className="mt-1">✉️ {row.email}</div>
        </div>
      )
    },
    {
      key: 'socialLinks',
      label: 'Social Links',
      sortable: false,
      width: '25%',
      render: (row) => {
        const socialCount = Object.values(row.socialLinks || {}).filter(link => link).length
        return (
          <span className="text-xs text-gray-500">
            {socialCount > 0 ? `🔗 ${socialCount} links` : 'No links'}
          </span>
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
            <h1 className="text-xl font-bold text-gray-900">Contact Information</h1>
            <p className="text-xs text-gray-600">{contacts.length} items</p>
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
        data={contacts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No contact information yet"
        itemName="contacts"
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">
                {editingItem ? 'Edit' : 'Add'} Contact
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* School Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">School Name *</label>
                <input
                  type="text"
                  required
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="School Name"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Address *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  placeholder="Full address"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="+1 234 567 8900"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="info@school.com"
                />
              </div>

              {/* Alternate Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Alternate Phone</label>
                <input
                  type="tel"
                  value={formData.alternatePhone}
                  onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="+1 234 567 8901"
                />
              </div>

              {/* Social Links */}
              <div className="pt-3 border-t border-gray-200">
                <label className="text-xs font-semibold text-gray-900 mb-2 block">Social Media Links</label>
                <div className="space-y-2">
                  <input
                    type="url"
                    value={formData.socialLinks.facebook}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Facebook URL"
                  />
                  <input
                    type="url"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Twitter URL"
                  />
                  <input
                    type="url"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Instagram URL"
                  />
                  <input
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="LinkedIn URL"
                  />
                  <input
                    type="url"
                    value={formData.socialLinks.youtube}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, youtube: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="YouTube URL"
                  />
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
