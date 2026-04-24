'use client'

import { useEffect, useState } from 'react'
import { getGallery } from '@/lib/api'

export default function Gallery() {
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Events', 'Campus', 'Students', 'Sports', 'Cultural', 'Academic']

  useEffect(() => {
    fetchGallery(selectedCategory)
  }, [selectedCategory])

  const fetchGallery = async (category) => {
    try {
      setLoading(true)
      const response = await getGallery(category === 'All' ? '' : category)
      setGallery(response.data)
    } catch (error) {
      console.error('Error fetching gallery:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="gallery" className="section-padding bg-white">
      <div className="section-container">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Our Gallery
          </h2>
          <p className="text-base text-gray-600 max-w-xl mx-auto mb-2">
            Explore memorable moments from our school
          </p>
          <div className="w-16 h-0.5 bg-primary-600 mx-auto rounded-full" />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-gray-500">Loading gallery...</div>
          </div>
        ) : gallery.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No images found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {gallery.map((item) => (
              <div
                key={item._id}
                className="group relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Image */}
                <img
                  src={item.image || '/placeholder.jpg'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <h3 className="text-white font-semibold text-sm mb-0.5 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-primary-300 text-xs font-medium">
                      {item.category}
                    </p>
                    {item.description && (
                      <p className="text-gray-300 text-xs mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-semibold text-primary-600">
                  {item.category}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
