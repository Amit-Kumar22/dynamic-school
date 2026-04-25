'use client'

import { useState, useEffect } from 'react'
import { getActiveSchoolTiming } from '@/lib/api'
import { FaClock, FaCalendarAlt, FaBookOpen, FaCoffee, FaUtensils, FaUsers, FaInfoCircle } from 'react-icons/fa'

export default function SchoolTiming() {
  const [timing, setTiming] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTiming()
  }, [])

  const fetchTiming = async () => {
    try {
      const response = await getActiveSchoolTiming()
      setTiming(response.data)
    } catch (err) {
      console.error('Fetch timing error:', err)
      // Don't show error to users - just hide component if no timing is available
      setError('')
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'break':
        return <FaCoffee className="text-orange-500" />
      case 'lunch':
        return <FaUtensils className="text-green-500" />
      case 'assembly':
        return <FaUsers className="text-purple-500" />
      case 'sports':
        return <FaUsers className="text-blue-500" />
      case 'class':
      default:
        return <FaBookOpen className="text-blue-600" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'break':
        return 'bg-orange-50 border-orange-200 text-orange-800'
      case 'lunch':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'assembly':
        return 'bg-purple-50 border-purple-200 text-purple-800'
      case 'sports':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'class':
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const formatTime = (time) => {
    if (!time) return ''
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  // Don't render anything if loading, error, or no timing data
  if (loading || error || !timing || !timing.displayOnHomepage) {
    return null
  }

  // Filter only active timing entries
  const activeEntries = timing.timingEntries?.filter(entry => entry.isActive) || []

  return (
    <section className="py-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-indigo-200/30 rounded-full blur-2xl animate-float" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-8 animate-bounce-in">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-xl animate-float">
              <FaClock className="text-base text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
              <span className="gradient-text">{timing.title || 'School Timing'}</span>
            </h2>
          </div>
          <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full mb-3" />
          <p className="text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
            {timing.description || 'Our comprehensive daily schedule and timing information for students and parents'}
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Enhanced School Hours Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="card-elevated p-4 text-center group animate-slide-up">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FaClock className="text-lg text-white" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">School Hours</h3>
              <div className="text-xl font-bold gradient-text mb-1">
                {formatTime(timing.schoolStartTime)} - {formatTime(timing.schoolEndTime)}
              </div>
              <p className="text-xs text-gray-600">Daily Schedule</p>
            </div>

            <div className="card-elevated p-4 text-center group animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FaCoffee className="text-lg text-white" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">Break Time</h3>
              <div className="text-lg font-bold text-orange-600 mb-1">
                {timing.breakTime || 'Not specified'}
              </div>
              <p className="text-xs text-gray-600">Refreshment Break</p>
            </div>

            <div className="card-elevated p-4 text-center group animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FaUtensils className="text-lg text-white" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">Lunch Time</h3>
              <div className="text-lg font-bold text-green-600 mb-1">
                {timing.lunchTime || 'Not specified'}
              </div>
              <p className="text-xs text-gray-600">Meal Break</p>
            </div>
          </div>

          {/* Enhanced Weekly Schedule */}
          <div className="card-elevated p-6 mb-8 animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <FaCalendarAlt className="text-sm text-white" />
              </div>
              <h3 className="text-xl font-bold gradient-text">Weekly Schedule</h3>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {timing.weekDays?.map((day, index) => (
                <span 
                  key={day}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-bounce-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {day}
                </span>
              ))}
            </div>
          </div>

          {/* Enhanced Note */}
          <div className="text-center animate-slide-up" style={{animationDelay: '0.4s'}}>
            <div className="glass p-4 rounded-xl shadow-lg max-w-xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FaInfoCircle className="text-blue-600 text-sm" />
                <h4 className="text-base font-semibold text-gray-900">Important Notice</h4>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Schedule may vary during special events, holidays, or examinations. Please check with school administration for any updates or changes to the regular timing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}