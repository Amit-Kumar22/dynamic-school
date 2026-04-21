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
    <footer id="contact" className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="section-container py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-primary-400">
              {contact?.schoolName || 'Our School'}
            </h3>
            <p className="text-gray-300 mb-4">
              Empowering students to achieve excellence and build a better future through quality education.
            </p>
            {/* Social Links */}
            {contact?.socialLinks && (
              <div className="flex gap-3">
                {Object.entries(contact.socialLinks).map(([platform, url]) => {
                  if (!url) return null
                  const Icon = socialIcons[platform]
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors"
                    >
                      <Icon className="text-lg" />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About', 'Admissions', 'Gallery'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-gray-300 hover:text-primary-400 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-3">
              {contact?.address && (
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-primary-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">{contact.address}</p>
                </div>
              )}
              {contact?.phone && (
                <div className="flex items-center gap-3">
                  <FaPhone className="text-primary-400 flex-shrink-0" />
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-gray-300 hover:text-primary-400 transition-colors"
                  >
                    {contact.phone}
                  </a>
                </div>
              )}
              {contact?.email && (
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-primary-400 flex-shrink-0" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-gray-300 hover:text-primary-400 transition-colors"
                  >
                    {contact.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="section-container py-6">
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} {contact?.schoolName || 'Our School'}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
