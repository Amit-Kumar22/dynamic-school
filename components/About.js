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
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {about?.title || 'About Our School'}
          </h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              {about?.image ? (
                <img
                  src={about.image}
                  alt="School"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <span className="text-primary-600 text-lg">School Image</span>
                </div>
              )}
            </div>
            {/* Decorative element */}
            <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full bg-primary-100 rounded-2xl" />
          </div>

          {/* Content */}
          <div>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              {about?.description}
            </p>

            <div className="space-y-6">
              {/* Mission */}
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-6 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                    <FaCheck className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Mission</h3>
                    <p className="text-gray-700">{about?.mission}</p>
                  </div>
                </div>
              </div>

              {/* Vision */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <FaCheck className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Vision</h3>
                    <p className="text-gray-700">{about?.vision}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            {about?.stats && about.stats.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-8">
                {about.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white border-2 border-primary-100 rounded-xl p-4 text-center hover:border-primary-300 transition-colors"
                  >
                    <div className="text-3xl font-bold text-primary-600 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
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
