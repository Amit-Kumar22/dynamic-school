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
              className="absolute inset-0 bg-cover bg-center scale-110 transition-transform duration-[20s] hover:scale-100"
              style={{ backgroundImage: `url(${hero.backgroundImage})` }}
            />
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-indigo-800/40 to-purple-900/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </>
        ) : (
          // Enhanced fallback gradient
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-transparent to-transparent" />
            {/* Animated background shapes */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-float" />
            <div className="absolute top-32 right-20 w-24 h-24 bg-blue-300/20 rounded-full animate-float" style={{animationDelay: '1s'}} />
            <div className="absolute bottom-20 left-32 w-16 h-16 bg-indigo-300/30 rounded-full animate-float" style={{animationDelay: '2s'}} />
          </div>
        )}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => {
          const positions = [
            { left: '10%', top: '20%' },
            { left: '85%', top: '15%' },
            { left: '15%', top: '70%' },
            { left: '75%', top: '65%' },
            { left: '45%', top: '30%' },
            { left: '60%', top: '80%' }
          ];
          return (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-white/30 rounded-full animate-float`}
              style={{
                left: positions[i].left,
                top: positions[i].top,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${3 + (i * 0.5)}s`
              }}
            />
          )
        })}
      </div>

      {/* Content */}
      <div className="relative z-10 section-container text-center text-white mt-8">
        <div className="max-w-3xl mx-auto drop-shadow-lg">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-bounce-in drop-shadow-lg">
            <span className="block leading-tight">
              {hero?.title?.split(' ').map((word, index) => (
                <span 
                  key={index} 
                  className="inline-block mr-2 hover:text-yellow-300 transition-colors duration-300"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {word}
                </span>
              )) || (
                <>
                  <span className="gradient-text">Welcome to</span>
                  <br />
                  <span className="text-white">Our School</span>
                </>
              )}
            </span>
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto animate-slide-up opacity-90 leading-relaxed drop-shadow-md">
            {hero?.subtitle || 'Empowering minds, building futures, creating tomorrow\'s leaders through excellence in education'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-slide-up">
            <a
              href={hero?.ctaLink || '#about'}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-bold text-base hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-xl drop-shadow-lg hover:shadow-orange-500/25 hover:drop-shadow-xl hover:scale-105 transform group"
            >
              {hero?.ctaText || 'Discover More'}
              <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
            </a>
            <a
              href="#admissions"
              className="inline-flex items-center gap-2 glass text-white px-6 py-3 rounded-full font-semibold text-base hover:bg-white/20 transition-all duration-300 shadow-lg drop-shadow-md hover:shadow-xl hover:drop-shadow-lg hover:scale-105 transform border border-white/30 hover:border-white/50 hover:shadow-white/20"
            >
              Admissions Open
            </a>
          </div>
        </div>
      </div>

      {/* Enhanced decorative wave */}
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
            className="drop-shadow-lg"
          />
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="rgb(255, 255, 255)"
            className="opacity-50"
          />
        </svg>
      </div>
    </section>
  )
}
