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
      <section id="notices" className="section-padding bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-orange-200/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-red-200/30 rounded-full blur-2xl animate-float" />
        
        <div className="section-container relative">
          <div className="text-center mb-8 animate-bounce-in">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-xl animate-float">
                <FaBell className="text-xl text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                <span className="gradient-text-warm">Latest Notices</span>
              </h2>
            </div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-red-500 to-orange-600 mx-auto rounded-full mb-3" />
            <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Stay updated with our latest announcements, important information, and school events
            </p>
          </div>

          {/* Enhanced Notices */}
          {notices.length === 0 ? (
            <div className="text-center py-12 animate-bounce-in">
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <FaBell className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Notices Available</h3>
              <p className="text-base text-gray-600">Check back later for important updates and announcements.</p>
            </div>
          ) : (
            <div className="grid gap-4 max-w-4xl mx-auto">
              {notices.map((notice, index) => (
                <div
                  key={notice._id}
                  className="card-elevated group cursor-pointer border-l-4 border-gradient-to-b from-red-500 to-orange-600 animate-slide-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                  onClick={() => handleNoticeClick(notice)}
                >
                  <div className="p-4">
                    <div className="flex gap-4">
                      {/* Enhanced Image */}
                      {notice.imageUrl && (
                        <div className="flex-shrink-0">
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-lg">
                            <Image
                              src={notice.imageUrl}
                              alt={notice.title || 'Notice Image'}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                              quality={75}
                              loading="lazy"
                              sizes="80px"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          </div>
                        </div>
                      )}
                      
                      {/* Enhanced Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <FaBell className="text-white text-sm" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
                            {notice.title}
                          </h3>
                        </div>
                        
                        {notice.description && (
                          <p className="text-gray-700 text-sm mb-3 line-clamp-2 leading-relaxed">
                            {notice.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-500">
                            <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                              <FaCalendar className="text-xs text-gray-600" />
                            </div>
                            <span className="text-sm font-medium">{formatDate(notice.date)}</span>
                          </div>
                          <div className="text-sm text-red-600 font-semibold group-hover:text-orange-600 transition-colors duration-300">
                            Read More →
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Enhanced View All Link */}
          {notices.length > 0 && (
            <div className="text-center mt-8 animate-slide-up" style={{animationDelay: '0.6s'}}>
              <button className="btn btn-accent">
                View All Notices
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Notice Detail Modal */}
      {showModal && selectedNotice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="card-glass max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-bounce-in">
            <div className="relative">
              {/* Enhanced Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 text-white rounded-lg shadow-lg flex items-center justify-center hover:from-red-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-110 z-10"
              >
                <FaTimes />
              </button>

              {/* Enhanced Modal Content */}
              <div className="p-6">
                {/* Enhanced Image */}
                {selectedNotice.imageUrl && (
                  <div className="mb-6">
                    <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-xl">
                      <Image
                        src={selectedNotice.imageUrl}
                        alt={selectedNotice.title || 'Notice Image'}
                        fill
                        className="object-cover"
                        quality={90}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                  </div>
                )}

                {/* Enhanced Title & Date */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-xl">
                      <FaBell className="text-white text-lg" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 gradient-text-warm">
                      {selectedNotice.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FaCalendar className="text-gray-500" />
                    </div>
                    <span className="text-base font-medium">{formatDate(selectedNotice.date)}</span>
                  </div>
                </div>

                {/* Enhanced Description */}
                {selectedNotice.description && (
                  <div className="prose max-w-none">
                    <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm border border-gray-100">
                      {selectedNotice.description}
                    </div>
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