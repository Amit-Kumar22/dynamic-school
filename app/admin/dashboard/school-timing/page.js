'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  getAllSchoolTimings, 
  createSchoolTiming, 
  updateSchoolTiming, 
  deleteSchoolTiming,
  toggleSchoolTimingActive 
} from '@/lib/api'
import { 
  FaArrowLeft, 
  FaSave, 
  FaPlus, 
  FaTimes, 
  FaCheckCircle, 
  FaClock, 
  FaEdit, 
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa'
import DataTable from '@/components/DataTable'

export default function SchoolTimingAdminPage() {
  const [timings, setTimings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    title: 'School Timing',
    description: 'Our daily schedule and timing information',
    schoolStartTime: '08:00',
    schoolEndTime: '15:00',
    breakTime: '10:30 - 10:45',
    lunchTime: '12:30 - 13:15',
    weekDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timingEntries: [
      { period: 'Morning Assembly', startTime: '08:00', endTime: '08:15', type: 'assembly', isActive: true },
      { period: '1st Period', startTime: '08:15', endTime: '09:00', type: 'class', isActive: true },
      { period: '2nd Period', startTime: '09:00', endTime: '09:45', type: 'class', isActive: true },
      { period: '3rd Period', startTime: '09:45', endTime: '10:30', type: 'class', isActive: true },
      { period: 'Break', startTime: '10:30', endTime: '10:45', type: 'break', isActive: true },
      { period: '4th Period', startTime: '10:45', endTime: '11:30', type: 'class', isActive: true },
      { period: '5th Period', startTime: '11:30', endTime: '12:15', type: 'class', isActive: true },
      { period: '6th Period', startTime: '12:15', endTime: '13:00', type: 'class', isActive: true },
      { period: 'Lunch Break', startTime: '13:00', endTime: '13:45', type: 'lunch', isActive: true },
      { period: '7th Period', startTime: '13:45', endTime: '14:30', type: 'class', isActive: true },
      { period: '8th Period', startTime: '14:30', endTime: '15:15', type: 'class', isActive: true }
    ],
    isActive: false,
    displayOnHomepage: false
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTimings()
  }, [])

  const fetchTimings = async () => {
    try {
      const response = await getAllSchoolTimings()
      const timingData = Array.isArray(response.data) ? response.data : [response.data].filter(Boolean)
      setTimings(timingData)
    } catch (err) {
      console.error('Fetch timings error:', err)
      setTimings([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (timing) => {
    setEditingItem(timing)
    setFormData({
      title: timing.title || 'School Timing',
      description: timing.description || 'Our daily schedule and timing information',
      schoolStartTime: timing.schoolStartTime || '08:00',
      schoolEndTime: timing.schoolEndTime || '15:00',
      breakTime: timing.breakTime || '10:30 - 10:45',
      lunchTime: timing.lunchTime || '12:30 - 13:15',
      weekDays: timing.weekDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      timingEntries: timing.timingEntries || [],
      isActive: timing.isActive || false,
      displayOnHomepage: timing.displayOnHomepage || false
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this school timing?')) return

    try {
      await deleteSchoolTiming(id)
      fetchTimings()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleToggleActive = async (id) => {
    try {
      await toggleSchoolTimingActive(id)
      fetchTimings()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle status')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      if (editingItem) {
        await updateSchoolTiming(editingItem._id, formData)
      } else {
        await createSchoolTiming(formData)
      }
      setShowModal(false)
      fetchTimings()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      resetForm()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save school timing')
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: 'School Timing',
      description: 'Our daily schedule and timing information',
      schoolStartTime: '08:00',
      schoolEndTime: '15:00',
      breakTime: '10:30 - 10:45',
      lunchTime: '12:30 - 13:15',
      weekDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      timingEntries: [
        { period: 'Morning Assembly', startTime: '08:00', endTime: '08:15', type: 'assembly', isActive: true },
        { period: '1st Period', startTime: '08:15', endTime: '09:00', type: 'class', isActive: true },
        { period: '2nd Period', startTime: '09:00', endTime: '09:45', type: 'class', isActive: true },
        { period: '3rd Period', startTime: '09:45', endTime: '10:30', type: 'class', isActive: true },
        { period: 'Break', startTime: '10:30', endTime: '10:45', type: 'break', isActive: true },
        { period: '4th Period', startTime: '10:45', endTime: '11:30', type: 'class', isActive: true },
        { period: '5th Period', startTime: '11:30', endTime: '12:15', type: 'class', isActive: true },
        { period: '6th Period', startTime: '12:15', endTime: '13:00', type: 'class', isActive: true },
        { period: 'Lunch Break', startTime: '13:00', endTime: '13:45', type: 'lunch', isActive: true },
        { period: '7th Period', startTime: '13:45', endTime: '14:30', type: 'class', isActive: true },
        { period: '8th Period', startTime: '14:30', endTime: '15:15', type: 'class', isActive: true }
      ],
      isActive: false,
      displayOnHomepage: false
    })
    setEditingItem(null)
  }

  const addTimingEntry = () => {
    setFormData({
      ...formData,
      timingEntries: [...formData.timingEntries, {
        period: '',
        startTime: '',
        endTime: '',
        type: 'class',
        isActive: true
      }]
    })
  }

  const updateTimingEntry = (index, field, value) => {
    const updatedEntries = formData.timingEntries.map((entry, i) => 
      i === index ? { ...entry, [field]: value } : entry
    )
    setFormData({ ...formData, timingEntries: updatedEntries })
  }

  const removeTimingEntry = (index) => {
    const updatedEntries = formData.timingEntries.filter((_, i) => i !== index)
    setFormData({ ...formData, timingEntries: updatedEntries })
  }

  const toggleWeekDay = (day) => {
    const updatedDays = formData.weekDays.includes(day)
      ? formData.weekDays.filter(d => d !== day)
      : [...formData.weekDays, day]
    setFormData({ ...formData, weekDays: updatedDays })
  }

  const tableColumns = [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { 
      key: 'timingInfo', 
      label: 'School Hours',
      render: (item) => `${item.schoolStartTime || '08:00'} - ${item.schoolEndTime || '15:00'}`
    },
    { 
      key: 'weekDays', 
      label: 'Week Days',
      render: (item) => (item.weekDays || []).join(', ')
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {item.isActive ? 'Active' : 'Inactive'}
          </span>
          {item.displayOnHomepage && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <FaEye className="mr-1" />
              Homepage
            </span>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(item)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleToggleActive(item._id)}
            className={`p-2 rounded-lg transition-colors ${
              item.isActive 
                ? 'text-gray-600 hover:bg-gray-50' 
                : 'text-green-600 hover:bg-green-50'
            }`}
            title={item.isActive ? 'Deactivate' : 'Activate'}
          >
            {item.isActive ? <FaToggleOff /> : <FaToggleOn />}
          </button>
          <button
            onClick={() => handleDelete(item._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading school timings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/dashboard"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft />
            Back to Dashboard
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FaClock className="text-red-600" />
              School Timing Management
            </h1>
            <p className="text-gray-600">Manage school timing and daily schedule</p>
          </div>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FaPlus />
          Add New Timing
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <FaCheckCircle className="text-green-600" />
          <span className="text-green-800">Operation completed successfully!</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <FaTimes className="text-red-600" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow">
        <DataTable
          data={timings}
          columns={tableColumns}
          emptyMessage="No school timings found. Create your first timing schedule!"
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">
                {editingItem ? 'Edit School Timing' : 'Create School Timing'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* School Hours */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Start Time *
                  </label>
                  <input
                    type="time"
                    value={formData.schoolStartTime}
                    onChange={(e) => setFormData({ ...formData, schoolStartTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School End Time *
                  </label>
                  <input
                    type="time"
                    value={formData.schoolEndTime}
                    onChange={(e) => setFormData({ ...formData, schoolEndTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Break Time
                  </label>
                  <input
                    type="text"
                    value={formData.breakTime}
                    onChange={(e) => setFormData({ ...formData, breakTime: e.target.value })}
                    placeholder="10:30 - 10:45"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lunch Time
                  </label>
                  <input
                    type="text"
                    value={formData.lunchTime}
                    onChange={(e) => setFormData({ ...formData, lunchTime: e.target.value })}
                    placeholder="12:30 - 13:15"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Week Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleWeekDay(day)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        formData.weekDays.includes(day)
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timing Entries */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Daily Schedule
                  </label>
                  <button
                    type="button"
                    onClick={addTimingEntry}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FaPlus />
                    Add Period
                  </button>
                </div>
                
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {formData.timingEntries.map((entry, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 rounded-lg">
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={entry.period}
                          onChange={(e) => updateTimingEntry(index, 'period', e.target.value)}
                          placeholder="Period name"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="time"
                          value={entry.startTime}
                          onChange={(e) => updateTimingEntry(index, 'startTime', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="time"
                          value={entry.endTime}
                          onChange={(e) => updateTimingEntry(index, 'endTime', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <select
                          value={entry.type}
                          onChange={(e) => updateTimingEntry(index, 'type', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                        >
                          <option value="class">Class</option>
                          <option value="break">Break</option>
                          <option value="lunch">Lunch</option>
                          <option value="assembly">Assembly</option>
                          <option value="sports">Sports</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={entry.isActive}
                            onChange={(e) => updateTimingEntry(index, 'isActive', e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-xs text-gray-700">Active</span>
                        </label>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeTimingEntry(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Set as Active Timing</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.displayOnHomepage}
                    onChange={(e) => setFormData({ ...formData, displayOnHomepage: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Display on Homepage</span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  <FaSave />
                  {saving ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}