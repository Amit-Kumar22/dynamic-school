'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaPhone, 
  FaClock,
  FaStar,
  FaCheck,
  FaInfoCircle,
  FaGraduationCap,
  FaRunning,
  FaCogs,
  FaLaptop,
  FaGamepad,
  FaQuestionCircle
} from 'react-icons/fa';
import { getActiveFacilities } from '../lib/api';

const Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    console.log('Facilities component mounted, fetching data...');
    fetchFacilities();
  }, []); // Empty dependency array to run only once on mount

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      console.log('Fetching active facilities for homepage...');
      const response = await getActiveFacilities({ limit: 8 });
      console.log('Facilities response:', response);
      console.log('Raw facilities data:', response.data);
      console.log('Number of facilities received:', response.data?.length || 0);
      
      // Check for duplicates in received data
      if (response.data && Array.isArray(response.data)) {
        const uniqueFacilities = response.data.filter((facility, index, self) => 
          index === self.findIndex(f => f._id === facility._id)
        );
        console.log('Unique facilities after dedup:', uniqueFacilities.length);
        setFacilities(uniqueFacilities);
      } else {
        setFacilities([]);
      }
      setError(null);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      setError('Failed to load facilities');
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'academic': FaGraduationCap,
      'sports': FaRunning,
      'infrastructure': FaBuilding,
      'technology': FaLaptop,
      'recreation': FaGamepad,
      'other': FaQuestionCircle
    };
    return icons[category] || FaQuestionCircle;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'academic': 'from-blue-500 to-blue-600',
      'sports': 'from-green-500 to-green-600',
      'infrastructure': 'from-orange-500 to-orange-600',
      'technology': 'from-purple-500 to-purple-600',
      'recreation': 'from-pink-500 to-pink-600',
      'other': 'from-gray-500 to-gray-600'
    };
    return colors[category] || colors['other'];
  };

  const getAvailabilityIcon = (availability) => {
    switch(availability) {
      case 'available': return <FaCheck className="text-green-600" />;
      case 'unavailable': return <FaClock className="text-red-600" />;
      case 'maintenance': return <FaCogs className="text-yellow-600" />;
      case 'limited': return <FaInfoCircle className="text-orange-600" />;
      default: return <FaCheck className="text-green-600" />;
    }
  };

  const getAvailabilityText = (availability) => {
    switch(availability) {
      case 'available': return 'Available';
      case 'unavailable': return 'Unavailable';
      case 'maintenance': return 'Under Maintenance';
      case 'limited': return 'Limited Access';
      default: return 'Available';
    }
  };

  const categories = ['all', ...new Set(facilities.map(f => f.category))];

  const filteredFacilities = selectedCategory === 'all' 
    ? facilities 
    : facilities.filter(f => f.category === selectedCategory);

  if (loading) {
    return (
      <section className="py-3 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-3">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              School Facilities
            </h2>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 text-xs">Loading facilities...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-3 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-3">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              School Facilities
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-2 max-w-md mx-auto">
              <p className="text-red-600 text-xs">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (facilities.length === 0) {
    return (
      <section className="py-3 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-3">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              School Facilities
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 max-w-md mx-auto">
              <FaBuilding className="mx-auto text-lg text-yellow-600 mb-1" />
              <p className="text-yellow-700 text-xs">No facilities found</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-purple-200/30 rounded-full blur-2xl animate-pulse-slow" />
      <div className="absolute bottom-10 right-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl animate-float" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Enhanced Header */}
        <div className="text-center mb-5 animate-bounce-in">
          <div className="flex justify-center items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg animate-float">
              <FaBuilding className="text-lg text-white" />
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              <span className="gradient-text">Our Facilities</span>
            </h2>
          </div>
          <div className="w-12 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto rounded-full mb-2" />
          <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
            State-of-the-art facilities designed to provide the best learning environment and support student growth.
          </p>
        </div>

        {/* Enhanced Category Filter */}
        {categories.length > 2 && (
          <div className="flex flex-wrap justify-center gap-1.5 mb-5 animate-slide-up">
            {categories.map((category, index) => {
              const CategoryIcon = category === 'all' ? FaBuilding : getCategoryIcon(category);
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 animate-bounce-in ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-600 border border-purple-200'
                  }`}
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <CategoryIcon className="text-xs" />
                  {category === 'all' ? 'All Facilities' : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              );
            })}
          </div>
        )}

        {/* Enhanced Facilities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredFacilities.map((facility, index) => {
            const CategoryIcon = getCategoryIcon(facility.category);
            console.log(`Rendering facility ${index + 1}: ${facility.title} (ID: ${facility._id})`);
            
            return (
              <div
                key={facility._id}
                className="card-elevated group cursor-pointer animate-slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {/* Enhanced Image */}
                <div className="relative h-28 overflow-hidden">
                  {facility.imageUrl ? (
                    <Image
                      src={facility.imageUrl}
                      alt={facility.title || 'Facility Image'}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      quality={80}
                      loading="lazy"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(facility.category)} flex items-center justify-center relative`}>
                      <CategoryIcon className="text-2xl text-white/80" />
                      {/* Decorative pattern */}
                      <div className="absolute inset-0 opacity-20">
                        {[...Array(6)].map((_, i) => {
                          const positions = [
                            { left: '15%', top: '25%' },
                            { left: '70%', top: '20%' },
                            { left: '25%', top: '65%' },
                            { left: '80%', top: '70%' },
                            { left: '45%', top: '40%' },
                            { left: '60%', top: '85%' }
                          ];
                          return (
                            <div
                              key={i}
                              className="absolute w-2 h-2 bg-white rounded-full animate-float"
                              style={{
                                left: positions[i].left,
                                top: positions[i].top,
                                animationDelay: `${i * 0.5}s`,
                              }}
                            />
                          )
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Enhanced Category Badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getCategoryColor(facility.category)} shadow-lg`}>
                      <CategoryIcon className="text-xs" />
                      {facility.category}
                    </span>
                  </div>

                  {/* Priority Star */}
                  {facility.priority > 5 && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full p-1 shadow-lg animate-pulse">
                        <FaStar className="text-xs" />
                      </div>
                    </div>
                  )}

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Enhanced Content */}
                <div className="p-3">
                  <h3 className="font-bold text-base text-gray-900 mb-1.5 group-hover:text-purple-600 transition-colors duration-300 line-clamp-2">
                    {facility.title}
                  </h3>
                  
                  <p className="text-gray-600 text-xs mb-2 leading-relaxed line-clamp-2">
                    {facility.description}
                  </p>

                  {/* Enhanced Details */}
                  <div className="space-y-1.5 mb-2">
                    {facility.location && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center flex-shrink-0">
                          <FaMapMarkerAlt className="text-purple-600 text-xs" />
                        </div>
                        <span className="truncate text-xs">{facility.location}</span>
                      </div>
                    )}
                    
                    {facility.capacity && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                          <FaUsers className="text-blue-600 text-xs" />
                        </div>
                        <span className="truncate text-xs">Capacity: {facility.capacity}</span>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Features */}
                  {facility.features && facility.features.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold text-gray-900">Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {facility.features.slice(0, 2).map((feature, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-1.5 py-0.5 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 text-xs font-medium rounded border border-purple-200"
                          >
                            {feature}
                          </span>
                        ))}
                        {facility.features.length > 2 && (
                          <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded border border-gray-200">
                            +{facility.features.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Empty State */}
        {filteredFacilities.length === 0 && selectedCategory !== 'all' && (
          <div className="text-center py-16 animate-bounce-in">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <FaBuilding className="text-3xl text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No facilities found
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              No facilities available in "{selectedCategory}" category.
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="btn btn-primary"
            >
              View All Facilities
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Facilities;