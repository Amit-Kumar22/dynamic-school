'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getActiveImportantNotices } from '@/lib/api'
import { 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaExclamationCircle, 
  FaCheckCircle,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt
} from 'react-icons/fa'

export default function ImportantNotice() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [tickerNotices, setTickerNotices] = useState([])
  const [tickerIndex, setTickerIndex] = useState(0)

  useEffect(() => {
    fetchNotices()
  }, [])

  // Auto-rotation for ticker notices
  useEffect(() => {
    if (tickerNotices.length > 1) {
      const timer = setInterval(() => {
        setTickerIndex((prev) => (prev + 1) % tickerNotices.length)
      }, 5000) // Change every 5 seconds
      return () => clearInterval(timer)
    }
  }, [tickerNotices.length])

  // Auto-rotation for regular notices
  useEffect(() => {
    if (notices.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % notices.length)
      }, 8000) // Change every 8 seconds
      return () => clearInterval(timer)
    }
  }, [notices.length])

  const fetchNotices = async () => {
    try {
      const response = await getActiveImportantNotices({ limit: 10 })
      console.log('Important notices API response:', response) // Debug log
      const allNotices = response.data || []
      
      // Separate ticker and regular notices
      const ticker = allNotices.filter(notice => notice.showAsTicker)
      const regular = allNotices.filter(notice => !notice.showAsTicker)
      
      console.log('Ticker notices:', ticker) // Debug log
      console.log('Regular notices:', regular) // Debug log
      
      setTickerNotices(ticker)
      setNotices(regular)
    } catch (err) {
      console.error('Fetch important notices error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (type, priority) => {
    const iconClass = "text-lg"
    
    if (priority === 'urgent') {
      return <FaExclamationTriangle className={`${iconClass} text-red-500`} />
    }
    
    switch (type) {
      case 'alert':
        return <FaExclamationCircle className={`${iconClass} text-red-500`} />
      case 'warning':
        return <FaExclamationTriangle className={`${iconClass} text-yellow-500`} />
      case 'success':
        return <FaCheckCircle className={`${iconClass} text-green-500`} />
      case 'info':
      default:
        return <FaInfoCircle className={`${iconClass} text-blue-500`} />
    }
  }

  const getNoticeColor = (type, priority) => {
    if (priority === 'urgent') {
      return 'bg-red-50 border-red-200 text-red-900'
    }
    
    switch (type) {
      case 'alert':
        return 'bg-red-50 border-red-200 text-red-900'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900'
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900'
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-900'
    }
  }

  const getTickerColor = (type, priority) => {
    if (priority === 'urgent') {
      return 'bg-red-600 text-white'
    }
    
    switch (type) {
      case 'alert':
        return 'bg-red-600 text-white'
      case 'warning':
        return 'bg-yellow-600 text-white'
      case 'success':
        return 'bg-green-600 text-white'
      case 'info':
      default:
        return 'bg-blue-600 text-white'
    }
  }

  const nextNotice = () => {
    setCurrentIndex((prev) => (prev + 1) % notices.length)
  }

  const prevNotice = () => {
    setCurrentIndex((prev) => (prev - 1 + notices.length) % notices.length)
  }

  const dismissNotice = () => {
    setIsVisible(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-2">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-800 text-sm">
          Loading important notices...
        </div>
      </div>
    ) // Show loading state for debugging
  }

  // Debug: Show component is working even if no notices
  if (notices.length === 0 && tickerNotices.length === 0) {
    return (
      <div className="container mx-auto px-4 py-2">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-600 text-sm">
          Important Notice component loaded - No active notices found
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Ticker Notices */}
      {tickerNotices.length > 0 && (
        <div className={`${getTickerColor(tickerNotices[tickerIndex]?.type, tickerNotices[tickerIndex]?.priority)} py-2 px-4 shadow-sm`}>
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {getIcon(tickerNotices[tickerIndex]?.type, tickerNotices[tickerIndex]?.priority)}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">
                    {tickerNotices[tickerIndex]?.title}
                  </div>
                  <div className="text-xs opacity-90 truncate">
                    {tickerNotices[tickerIndex]?.description}
                  </div>
                </div>
              </div>
              
              {tickerNotices[tickerIndex]?.link && (
                <Link
                  href={tickerNotices[tickerIndex].link}
                  className="flex-shrink-0 ml-4 text-xs px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                  target={tickerNotices[tickerIndex].link.startsWith('http') ? '_blank' : '_self'}
                >
                  <span className="flex items-center gap-1">
                    {tickerNotices[tickerIndex].linkText}
                    {tickerNotices[tickerIndex].link.startsWith('http') && (
                      <FaExternalLinkAlt className="text-xs" />
                    )}
                  </span>
                </Link>
              )}

              {tickerNotices.length > 1 && (
                <div className="flex-shrink-0 ml-2 text-xs opacity-75">
                  {tickerIndex + 1}/{tickerNotices.length}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Regular Important Notices */}
      {notices.length > 0 && isVisible && (
        <div className="container mx-auto px-4">
          <div className={`relative border rounded-lg shadow-sm overflow-hidden ${getNoticeColor(notices[currentIndex]?.type, notices[currentIndex]?.priority)}`}>
            <div className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notices[currentIndex]?.type, notices[currentIndex]?.priority)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold mb-2">
                        {notices[currentIndex]?.title}
                      </h3>
                      <p className="text-sm leading-relaxed mb-3">
                        {notices[currentIndex]?.description}
                      </p>
                      
                      {notices[currentIndex]?.link && (
                        <Link
                          href={notices[currentIndex].link}
                          className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                          target={notices[currentIndex].link.startsWith('http') ? '_blank' : '_self'}
                        >
                          {notices[currentIndex].linkText}
                          {notices[currentIndex].link.startsWith('http') && (
                            <FaExternalLinkAlt className="text-xs" />
                          )}
                        </Link>
                      )}
                    </div>

                    <button
                      onClick={dismissNotice}
                      className="flex-shrink-0 ml-4 p-1 hover:bg-black/10 rounded-full transition-colors"
                      title="Dismiss notice"
                    >
                      <FaTimes className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation for multiple notices */}
              {notices.length > 1 && (
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-current/20">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevNotice}
                      className="p-1 hover:bg-black/10 rounded-full transition-colors"
                      title="Previous notice"
                    >
                      <FaChevronLeft className="text-sm" />
                    </button>
                    
                    <span className="text-xs px-2">
                      {currentIndex + 1} of {notices.length}
                    </span>
                    
                    <button
                      onClick={nextNotice}
                      className="p-1 hover:bg-black/10 rounded-full transition-colors"
                      title="Next notice"
                    >
                      <FaChevronRight className="text-sm" />
                    </button>
                  </div>

                  <div className="flex gap-1">
                    {notices.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentIndex 
                            ? 'bg-current' 
                            : 'bg-current/30 hover:bg-current/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}