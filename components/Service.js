'use client'

import { useEffect, useState } from 'react'
import { getAllServices } from '@/lib/api'
import { FaGraduationCap, FaBookOpen, FaUsers } from 'react-icons/fa'
import Image from 'next/image'

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getAllServices()
        setServices(response.data || [])
      } catch (error) {
        console.error('Error fetching services:', error)
        setServices([])
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  if (loading) {
    return (
      <section id="services" className="section-padding bg-gray-50">
        <div className="section-container text-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </section>
    )
  }

  if (!services.length) {
    return (
      <section id="services" className="section-padding bg-gray-50">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Services</h2>
          <p className="text-gray-600">No services available at the moment.</p>
        </div>
      </section>
    )
  }

  // Default icon mapping for services without images
  const getDefaultIcon = (index) => {
    const icons = [FaGraduationCap, FaBookOpen, FaUsers]
    const IconComponent = icons[index % icons.length]
    return <IconComponent className="text-3xl text-blue-600 mb-3" />
  }

  return (
    <section id="services" className="section-padding bg-gray-50">
      <div className="section-container">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Our Services
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-sm">
            Discover the comprehensive range of educational services and facilities we offer 
            to ensure every student receives the best learning experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div 
              key={service._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
            >
              {/* Service Image or Default Icon */}
              <div className="relative h-32 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                {service.imageUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={service.imageUrl}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                    <div className="absolute inset-0 bg-blue-600/10"></div>
                    {/* Fallback icon (hidden by default, shown if image fails) */}
                    <div className="absolute inset-0 flex items-center justify-center" style={{ display: 'none' }}>
                      {getDefaultIcon(index)}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    {getDefaultIcon(index)}
                  </div>
                )}
              </div>

              {/* Service Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                {service.description && (
                  <p className="text-gray-600 leading-relaxed text-sm line-clamp-3">
                    {service.description}
                  </p>
                )}
              </div>

              {/* Hover Effect Bar */}
              <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}