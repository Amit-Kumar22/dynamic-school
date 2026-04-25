'use client'

import { useEffect, useState } from 'react'
import { getAllContacts } from '@/lib/api'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'

export default function Footer() {
  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await getAllContacts()
        setContact(response.data?.[0])
      } catch (error) {
        console.error('Error fetching contact:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchContact()
  }, [])

  const socialIcons = {
    facebook: FaFacebook,
    twitter: FaTwitter,
    instagram: FaInstagram,
    linkedin: FaLinkedin,
    youtube: FaYoutube,
  }

  if (loading) {
    return (
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="section-container text-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </footer>
    )
  }

  return (
    <footer id="contact" className="bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl animate-float" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="section-container py-12 relative">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          {/* Enhanced About Section */}
          <div className="lg:col-span-2 animate-slide-in-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-xl">
                <span className="text-white font-bold text-base">S</span>
              </div>
              <h3 className="text-xl font-bold gradient-text">
                {contact?.schoolName || 'Our School'}
              </h3>
            </div>
            <p className="text-gray-300 mb-4 text-base leading-relaxed max-w-sm">
              Empowering students to achieve excellence and build a better future through innovative education and holistic development.
            </p>
            
            {/* Enhanced Social Links */}
            {contact?.socialLinks && (
              <div className="space-y-2">
                <h4 className="text-base font-semibold text-gray-200">Connect With Us</h4>
                <div className="flex gap-2">
                  {Object.entries(contact.socialLinks).map(([platform, url], index) => {
                    if (!url) return null
                    const Icon = socialIcons[platform]
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 animate-bounce-in"
                        style={{animationDelay: `${index * 0.1}s`}}
                      >
                        <Icon className="text-base" />
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Quick Links */}
          <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
            <h3 className="text-lg font-bold mb-4 text-gray-100">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About', 'Admissions', 'Facilities', 'Gallery', 'Contact'].map((link, index) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="group flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-all duration-300 text-sm animate-slide-in-right"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full transition-all duration-300 group-hover:w-1.5 group-hover:h-1.5" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Contact Info */}
          <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
            <h3 className="text-lg font-bold mb-4 text-gray-100">Contact Information</h3>
            <div className="space-y-3">
              {contact?.address && (
                <div className="group">
                  <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/5 transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                      <FaMapMarkerAlt className="text-white text-sm" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Address</p>
                      <p className="text-gray-200 text-sm leading-relaxed">{contact.address}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {contact?.phone && (
                <div className="group">
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                      <FaPhone className="text-white text-sm" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Phone</p>
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-gray-200 hover:text-blue-400 transition-colors text-sm font-semibold"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                </div>
              )}
              
              {contact?.email && (
                <div className="group">
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                      <FaEnvelope className="text-white text-sm" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Email</p>
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-gray-200 hover:text-purple-400 transition-colors text-sm font-semibold"
                      >
                        {contact.email}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Bar */}
      <div className="border-t border-gray-700/50 relative">
        <div className="section-container py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="text-center md:text-left">
              <p className="text-gray-300 text-sm">
                &copy; {new Date().getFullYear()} 
                <span className="font-semibold gradient-text ml-1">
                  {contact?.schoolName || 'Our School'}
                </span>
                . All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
