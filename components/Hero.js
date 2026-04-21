'use client'

import { useEffect, useState } from 'react'
import { getAllHero } from '@/lib/api'
import { FaArrowRight } from 'react-icons/fa'

export default function Hero() {
  const [hero, setHero] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await getAllHero()
        // Find the active hero or use the first one
        const activeHero = response.data?.find(h => h.isActive) || response.data?.[0]
        setHero(activeHero)
      } catch (error) {
        console.error('Error fetching hero:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchHero()
  }, [])

  if (loading) {
    return (
      <section id="hero" className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </section>
    )
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {hero?.backgroundImage ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${hero.backgroundImage})` }}
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40" />
          </>
        ) : (
          // Fallback gradient if no image
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 section-container text-center text-white mt-16">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up drop-shadow-lg">
          {hero?.title || 'Welcome to Our School'}
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-slide-up drop-shadow-md">
          {hero?.subtitle || 'Empowering minds, shaping futures'}
        </p>
        <a
          href={hero?.ctaLink || '#about'}
          className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 animate-slide-up"
        >
          {hero?.ctaText || 'Learn More'}
          <FaArrowRight className="text-sm" />
        </a>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="rgb(249, 250, 251)"
          />
        </svg>
      </div>
    </section>
  )
}
