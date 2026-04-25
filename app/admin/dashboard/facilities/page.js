'use client'

import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaToggleOn, 
  FaToggleOff,
  FaBuilding,
  FaImage,
  FaList,
  FaStar,
  FaCheck,
  FaTimes,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaUsers
} from 'react-icons/fa';
import { 
  getAllFacilities, 
  createFacility, 
  updateFacility, 
  deleteFacility,
  toggleFacilityActive,
  getFacilityStats,
  getFacilityCategories
} from '../../../../lib/api';

const FacilitiesPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [stats, setStats] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    isActive: '',
    displayOnHomepage: ''
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    features: [],
    category: 'other',
    priority: 0,
    isActive: true,
    displayOnHomepage: true,
    capacity: '',
    location: '',
    availability: 'available',
    contactInfo: ''
  });

  const [newFeature, setNewFeature] = useState('');
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    fetchFacilities();
    fetchStats();
    fetchCategories();
  }, [currentPage, filters]);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const response = await getAllFacilities({
        page: currentPage,
        limit: 10,
        ...filters
      });
      setFacilities(response.data);
      setTotalPages(response.pages);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getFacilityStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getFacilityCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFacility) {
        await updateFacility(editingFacility._id, formData);
      } else {
        await createFacility(formData);
      }
      resetForm();
      fetchFacilities();
      fetchStats();
    } catch (error) {
      console.error('Error saving facility:', error);
      alert('Error saving facility. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      features: [],
      category: 'other',
      priority: 0,
      isActive: true,
      displayOnHomepage: true,
      capacity: '',
      location: '',
      availability: 'available',
      contactInfo: ''
    });
    setEditingFacility(null);
    setShowForm(false);
    setNewFeature('');
  };

  const handleEdit = (facility) => {
    setFormData(facility);
    setEditingFacility(facility);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this facility?')) return;
    try {
      await deleteFacility(id);
      fetchFacilities();
      fetchStats();
    } catch (error) {
      console.error('Error deleting facility:', error);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await toggleFacilityActive(id);
      fetchFacilities();
      fetchStats();
    } catch (error) {
      console.error('Error toggling facility status:', error);
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'academic': 'bg-blue-100 text-blue-800',
      'sports': 'bg-green-100 text-green-800',
      'infrastructure': 'bg-orange-100 text-orange-800',
      'technology': 'bg-purple-100 text-purple-800',
      'recreation': 'bg-pink-100 text-pink-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['other'];
  };

  const getAvailabilityColor = (availability) => {
    const colors = {
      'available': 'bg-green-100 text-green-800',
      'unavailable': 'bg-red-100 text-red-800',
      'maintenance': 'bg-yellow-100 text-yellow-800',
      'limited': 'bg-orange-100 text-orange-800'
    };
    return colors[availability] || colors['available'];
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FaBuilding className="text-purple-600" />
            <span className="hidden sm:inline">Facilities Management</span>
            <span className="sm:hidden">Facilities</span>
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage school facilities and amenities</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={() => setShowStats(!showStats)}
            className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <FaPlus /> <span className="hidden sm:inline">Add Facility</span><span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      {showStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <FaBuilding className="text-xl sm:text-2xl text-purple-600" />
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Total</p>
                <p className="text-lg sm:text-2xl font-bold">{stats.totalFacilities || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <FaCheck className="text-xl sm:text-2xl text-green-600" />
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Active</p>
                <p className="text-lg sm:text-2xl font-bold">{stats.activeFacilities || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <FaEye className="text-xl sm:text-2xl text-blue-600" />
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Homepage</p>
                <p className="text-lg sm:text-2xl font-bold">{stats.homepageFacilities || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <FaList className="text-xl sm:text-2xl text-indigo-600" />
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Categories</p>
                <p className="text-lg sm:text-2xl font-bold">{stats.categoryStats?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <select
            value={filters.isActive}
            onChange={(e) => handleFilterChange('isActive', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <select
            value={filters.displayOnHomepage}
            onChange={(e) => handleFilterChange('displayOnHomepage', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          >
            <option value="">All Display</option>
            <option value="true">On Homepage</option>
            <option value="false">Not on Homepage</option>
          </select>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mt-2 sm:mt-0">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl sm:text-2xl font-bold">
                  {editingFacility ? 'Edit Facility' : 'Add New Facility'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700 p-2 sm:p-1"
                >
                  <FaTimes size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      placeholder="Enter facility title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                    >
                      <option value="academic">Academic Facilities</option>
                      <option value="sports">Sports & Recreation</option>
                      <option value="infrastructure">Infrastructure</option>
                      <option value="technology">Technology</option>
                      <option value="recreation">Recreation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter facility description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter image URL"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      placeholder="Enter location"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity
                    </label>
                    <input
                      type="text"
                      value={formData.capacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      placeholder="e.g., 50 students"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Availability
                    </label>
                    <select
                      value={formData.availability}
                      onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                    >
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                      <option value="maintenance">Under Maintenance</option>
                      <option value="limited">Limited Access</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority (0-10)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Info
                    </label>
                    <input
                      type="text"
                      value={formData.contactInfo}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      placeholder="Contact information"
                    />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2 mb-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      placeholder="Add a feature"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm sm:text-base"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          <FaTimes size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.displayOnHomepage}
                      onChange={(e) => setFormData(prev => ({ ...prev, displayOnHomepage: e.target.checked }))}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Display on Homepage</span>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base order-2 sm:order-1"
                  >
                    {editingFacility ? 'Update' : 'Create'} Facility
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm sm:text-base order-1 sm:order-2"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Facilities List */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="animate-spin rounded-full h-8 sm:h-12 w-8 sm:w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading facilities...</p>
          </div>
        ) : facilities.length === 0 ? (
          <div className="p-6 sm:p-8 text-center">
            <FaBuilding className="mx-auto text-3xl sm:text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500 text-sm sm:text-base">No facilities found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Facility
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Availability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {facilities.map((facility) => (
                    <tr key={facility._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-start gap-3">
                          {facility.imageUrl && (
                            <img
                              src={facility.imageUrl}
                              alt={facility.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{facility.title}</div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {facility.description}
                            </div>
                            {facility.location && (
                              <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                <FaMapMarkerAlt />
                                {facility.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(facility.category)}`}>
                          {facility.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            facility.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {facility.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {facility.displayOnHomepage && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              On Homepage
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(facility.availability)}`}>
                          {facility.availability}
                        </span>
                        {facility.capacity && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <FaUsers />
                            {facility.capacity}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-500" />
                          <span className="text-sm text-gray-900">{facility.priority}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(facility)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleToggleActive(facility._id)}
                            className={`${facility.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                            title={facility.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {facility.isActive ? <FaToggleOff /> : <FaToggleOn />}
                          </button>
                          <button
                            onClick={() => handleDelete(facility._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4 p-4">
              {facilities.map((facility) => (
                <div key={facility._id} className="admin-mobile-card">
                  <div className="admin-mobile-card-header">
                    {facility.imageUrl && (
                      <img
                        src={facility.imageUrl}
                        alt={facility.title}
                        className="admin-mobile-card-image"
                      />
                    )}
                    <div className="admin-mobile-card-content">
                      <h3 className="admin-mobile-card-title">{facility.title}</h3>
                      <p className="admin-mobile-card-description">{facility.description}</p>
                      {facility.location && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <FaMapMarkerAlt />
                          <span className="truncate">{facility.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="admin-mobile-card-badges">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(facility.category)}`}>
                      {facility.category}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      facility.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {facility.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {facility.displayOnHomepage && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Homepage
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(facility.availability)}`}>
                      {facility.availability}
                    </span>
                  </div>

                  <div className="admin-mobile-card-actions">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-500 text-xs" />
                        <span>{facility.priority}</span>
                      </div>
                      {facility.capacity && (
                        <div className="flex items-center gap-1">
                          <FaUsers className="text-xs" />
                          <span className="text-xs">{facility.capacity}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(facility)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleToggleActive(facility._id)}
                        className={`p-1 ${facility.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        title={facility.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {facility.isActive ? <FaToggleOff size={16} /> : <FaToggleOn size={16} />}
                      </button>
                      <button
                        onClick={() => handleDelete(facility._id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 sm:px-6 py-3 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
              <div className="text-xs sm:text-sm text-gray-700 order-2 sm:order-1">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2 order-1 sm:order-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 text-sm"
                >
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">‹</span>
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 text-sm"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:inline">›</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilitiesPage;