'use client'

import { useEffect, useState } from 'react'
import { getAllAbout } from '@/lib/api'
import { FaCheck } from 'react-icons/fa'

export default function About() {
  const [about, setAbout] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await getAllAbout()
        setAbout(response.data?.[0])
      } catch (error) {
        console.error('Error fetching about:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAbout()
  }, [])

  if (loading) {
    return (
      <section id="about" className="section-padding">
        <div className="section-container text-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="about" className="section-padding bg-white">
      <div className="section-container">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {about?.title || 'About Our School'}
          </h2>
          <div className="w-16 h-0.5 bg-primary-600 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
              {about?.image ? (
                <img
                  src={about.image}
                  alt="School"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <span className="text-primary-600 text-base">School Image</span>
                </div>
              )}
            </div>
            {/* Decorative element */}
            <div className="absolute -z-10 -bottom-2 -right-2 w-full h-full bg-primary-100 rounded-lg opacity-60" />
          </div>

          {/* Content */}
          <div>
            <p className="text-gray-700 text-base mb-4 leading-relaxed">
              {about?.description}
            </p>

            <div className="space-y-4">
              {/* Mission */}
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <FaCheck className="text-white text-sm" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Our Mission</h3>
                    <p className="text-gray-700 text-sm">{about?.mission}</p>
                  </div>
                </div>
              </div>

              {/* Vision */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <FaCheck className="text-white text-sm" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Our Vision</h3>
                    <p className="text-gray-700 text-sm">{about?.vision}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            {about?.stats && about.stats.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {about.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white border-2 border-primary-100 rounded-lg p-2 text-center hover:border-primary-300 transition-colors"
                  >
                    <div className="text-xl font-bold text-primary-600 mb-0.5">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
