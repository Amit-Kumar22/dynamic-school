'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
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
    <section id="about" className="py-6 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-5 right-5 w-24 h-24 bg-blue-100/50 rounded-full blur-2xl animate-pulse-slow" />
      <div className="absolute bottom-10 left-10 w-20 h-20 bg-indigo-100/50 rounded-full blur-xl animate-float" />
      
      <div className="section-container relative">
        <div className="text-center mb-5 animate-bounce-in">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            <span className="gradient-text">
              {about?.title || 'About Our School'}
            </span>
          </h2>
          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full mb-2" />
          <p className="text-sm text-gray-600 max-w-lg mx-auto">
            Discover our commitment to excellence in education and holistic development
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 items-center">
          {/* Enhanced Image Section */}
          <div className="relative animate-slide-in-left">
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-700 group">
                {about?.image ? (
                  <Image
                    src={about.image}
                    alt={about?.title || 'School Image'}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    quality={90}
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">School Image</span>
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              {/* Floating decorative elements */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg opacity-80 animate-float shadow-lg" />
              <div className="absolute -bottom-3 -left-3 w-7 h-7 bg-gradient-to-br from-blue-400 to-indigo-500 rounded opacity-70 animate-float shadow-lg" style={{animationDelay: '1s'}} />
            </div>
          </div>

          {/* Enhanced Content Section */}
          <div className="space-y-3 animate-slide-in-right">
            <p className="text-gray-700 text-sm leading-relaxed">
              {about?.description}
            </p>

            <div className="space-y-3">
              {/* Enhanced Mission Card */}
              <div className="card-glass p-3 transform hover:scale-105 transition-all duration-300 group">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FaCheck className="text-white text-xs" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1 gradient-text">Our Mission</h3>
                    <p className="text-gray-700 leading-relaxed text-xs">{about?.mission}</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Vision Card */}
              {about?.vision && (
                <div className="card-glass p-3 transform hover:scale-105 transition-all duration-300 group">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <FaCheck className="text-white text-xs" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-1 gradient-text">Our Vision</h3>
                      <p className="text-gray-700 leading-relaxed text-xs">{about?.vision}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Stats */}
            {about?.stats && about.stats.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {about.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="card-elevated p-2 text-center transform hover:scale-110 transition-all duration-300 animate-bounce-in"
                    style={{animationDelay: `${index * 0.2}s`}}
                  >
                    <div className="text-lg font-bold gradient-text mb-0.5">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
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
