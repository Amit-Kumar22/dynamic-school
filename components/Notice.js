'use client'

import { useEffect, useState } from 'react'
import { getAllNotices } from '@/lib/api'
import { FaBell, FaCalendar, FaTimes } from 'react-icons/fa'

export default function Notice() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedNotice, setSelectedNotice] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await getAllNotices({ isActive: true, limit: 5 })
        setNotices(response.data)
      } catch (error) {
        console.error('Error fetching notices:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchNotices()
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedNotice(null)
  }

  const handleImageError = (e) => {
    e.target.style.display = 'none'
  }

  if (loading) {
    return (
      <section className="section-padding bg-gray-50">
        <div className="section-container text-center">
          <div className="animate-pulse">Loading notices...</div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section id="notices" className="section-padding bg-gray-50">
        <div className="section-container">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Latest Notices
            </h2>
            <p className="text-base text-gray-600 max-w-xl mx-auto mb-2">
              Stay updated with our latest announcements and important information
            </p>
            <div className="w-16 h-0.5 bg-primary-600 mx-auto rounded-full" />
          </div>

          {/* Notices */}
          {notices.length === 0 ? (
            <div className="text-center py-8">
              <FaBell className="text-4xl text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">No Notices Available</h3>
              <p className="text-gray-400">Check back later for important updates and announcements.</p>
            </div>
          ) : (
            <div className="grid gap-4 max-w-4xl mx-auto">
              {notices.map((notice) => (
                <div
                  key={notice._id}
                  className="card p-4 hover:shadow-lg transition-all duration-300 border-l-4 border-primary-500 cursor-pointer hover:scale-[1.02]"
                  onClick={() => handleNoticeClick(notice)}
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    {notice.imageUrl && (
                      <div className="flex-shrink-0">
                        <img
                          src={notice.imageUrl}
                          alt={notice.title}
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={handleImageError}
                        />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <FaBell className="text-primary-600 text-sm flex-shrink-0" />
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {notice.title}
                        </h3>
                      </div>
                      
                      {notice.description && (
                        <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                          {notice.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <FaCalendar className="text-xs" />
                        <span>{formatDate(notice.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* View All Link */}
          {notices.length > 0 && (
            <div className="text-center mt-6">
              <button className="btn btn-secondary">
                View All Notices
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Notice Detail Modal */}
      {showModal && selectedNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 z-10"
              >
                <FaTimes />
              </button>

              {/* Modal Content */}
              <div className="p-6">
                {/* Image */}
                {selectedNotice.imageUrl && (
                  <div className="mb-6">
                    <img
                      src={selectedNotice.imageUrl}
                      alt={selectedNotice.title}
                      className="w-full h-64 object-cover rounded-lg"
                      onError={handleImageError}
                    />
                  </div>
                )}

                {/* Title & Date */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaBell className="text-primary-600" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedNotice.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <FaCalendar className="text-xs" />
                    <span>{formatDate(selectedNotice.date)}</span>
                  </div>
                </div>

                {/* Description */}
                {selectedNotice.description && (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {selectedNotice.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}