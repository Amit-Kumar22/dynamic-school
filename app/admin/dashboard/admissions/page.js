'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllAdmissions, createAdmission, updateAdmission, deleteAdmission } from '@/lib/api'
import { FaArrowLeft, FaSave, FaPlus, FaTimes, FaCheckCircle, FaTrash } from 'react-icons/fa'
import DataTable from '@/components/DataTable'

export default function AdmissionsAdminPage() {
  const [admissions, setAdmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    steps: [],
    requirements: []
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAdmissions()
  }, [])

  const fetchAdmissions = async () => {
    try {
      const response = await getAllAdmissions()
      const admissionData = Array.isArray(response.data) ? response.data : [response.data].filter(Boolean)
      setAdmissions(admissionData)
    } catch (err) {
      console.error('Fetch admissions error:', err)
      setAdmissions([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (admission) => {
    setEditingItem(admission)
    setFormData({
      title: admission.title || '',
      description: admission.description || '',
      steps: admission.steps || [],
      requirements: admission.requirements || []
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this admission process?')) return

    try {
      await deleteAdmission(id)
      fetchAdmissions()
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
        await updateAdmission(editingItem._id, formData)
      } else {
        await createAdmission(formData)
      }
      setShowModal(false)
      fetchAdmissions()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      resetForm()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save admission process')
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      steps: [],
      requirements: []
    })
    setEditingItem(null)
  }

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [
        ...formData.steps,
        { stepNumber: formData.steps.length + 1, title: '', description: '', icon: '' }
      ]
    })
  }

  const removeStep = (index) => {
    const newSteps = formData.steps.filter((_, i) => i !== index)
    newSteps.forEach((step, i) => { step.stepNumber = i + 1 })
    setFormData({ ...formData, steps: newSteps })
  }

  const updateStep = (index, field, value) => {
    const newSteps = [...formData.steps]
    newSteps[index][field] = value
    setFormData({ ...formData, steps: newSteps })
  }

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, '']
    })
  }

  const removeRequirement = (index) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index)
    })
  }

  const updateRequirement = (index, value) => {
    const newRequirements = [...formData.requirements]
    newRequirements[index] = value
    setFormData({ ...formData, requirements: newRequirements })
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
        <div className="font-semibold text-gray-900">{row.title}</div>
      )
    },
    {
      key: 'description',
      label: 'Description',
      sortable: false,
      width: '35%',
      render: (row) => (
        <p className="text-gray-600 line-clamp-2">{row.description}</p>
      )
    },
    {
      key: 'steps',
      label: 'Steps',
      sortable: false,
      width: '20%',
      render: (row) => (
        <span className="text-xs text-gray-500">
          {row.steps?.length > 0 ? `📋 ${row.steps.length} steps` : 'No steps'}
        </span>
      )
    },
    {
      key: 'requirements',
      label: 'Requirements',
      sortable: false,
      width: '20%',
      render: (row) => (
        <span className="text-xs text-gray-500">
          {row.requirements?.length > 0 ? `✅ ${row.requirements.length} items` : 'No requirements'}
        </span>
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
            <h1 className="text-xl font-bold text-gray-900">Admission Processes</h1>
            <p className="text-xs text-gray-600">{admissions.length} items</p>
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
        data={admissions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No admission processes yet"
        itemName="admission processes"
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full p-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">
                {editingItem ? 'Edit' : 'Add'} Admission Process
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
                  placeholder="Admission Process 2024"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  placeholder="Admission process description..."
                />
              </div>

              {/* Steps */}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-900">Admission Steps</label>
                  <button
                    type="button"
                    onClick={addStep}
                    className="px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded hover:bg-primary-700 transition-colors flex items-center gap-1"
                  >
                    <FaPlus className="text-xs" /> Add Step
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.steps.map((step, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-700">Step {step.stepNumber}</span>
                        <button
                          type="button"
                          onClick={() => removeStep(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => updateStep(index, 'title', e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                          placeholder="Step title"
                        />
                        <textarea
                          rows={2}
                          value={step.description}
                          onChange={(e) => updateStep(index, 'description', e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none bg-white"
                          placeholder="Step description"
                        />
                        <input
                          type="text"
                          value={step.icon}
                          onChange={(e) => updateStep(index, 'icon', e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                          placeholder="Icon (e.g., FaUserPlus, FaFileAlt)"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-900">Requirements</label>
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded hover:bg-primary-700 transition-colors flex items-center gap-1"
                  >
                    <FaPlus className="text-xs" /> Add Requirement
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => updateRequirement(index, e.target.value)}
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="Requirement text"
                      />
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
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
