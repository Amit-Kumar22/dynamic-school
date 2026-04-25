import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions

// Auth
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (fullName, email, password) => {
  const response = await api.post('/auth/register', { fullName, email, password });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Hero
export const getAllHero = async () => {
  const response = await api.get('/hero');
  return response.data;
};

export const getHeroById = async (id) => {
  const response = await api.get(`/hero/${id}`);
  return response.data;
};

export const createHero = async (data) => {
  const response = await api.post('/hero', data);
  return response.data;
};

export const updateHero = async (id, data) => {
  const response = await api.put(`/hero/${id}`, data);
  return response.data;
};

export const deleteHero = async (id) => {
  const response = await api.delete(`/hero/${id}`);
  return response.data;
};

// About
export const getAllAbout = async () => {
  const response = await api.get('/about');
  return response.data;
};

export const getAboutById = async (id) => {
  const response = await api.get(`/about/${id}`);
  return response.data;
};

export const createAbout = async (data) => {
  const response = await api.post('/about', data);
  return response.data;
};

export const updateAbout = async (id, data) => {
  const response = await api.put(`/about/${id}`, data);
  return response.data;
};

export const deleteAbout = async (id) => {
  const response = await api.delete(`/about/${id}`);
  return response.data;
};

// Admissions
export const getAllAdmissions = async () => {
  const response = await api.get('/admissions');
  return response.data;
};

export const getAdmissionById = async (id) => {
  const response = await api.get(`/admissions/${id}`);
  return response.data;
};

export const createAdmission = async (data) => {
  const response = await api.post('/admissions', data);
  return response.data;
};

export const updateAdmission = async (id, data) => {
  const response = await api.put(`/admissions/${id}`, data);
  return response.data;
};

export const deleteAdmission = async (id) => {
  const response = await api.delete(`/admissions/${id}`);
  return response.data;
};

// Gallery
export const getGallery = async (category = '') => {
  const response = await api.get('/gallery', { params: { category } });
  return response.data;
};

export const getGalleryById = async (id) => {
  const response = await api.get(`/gallery/${id}`);
  return response.data;
};

export const createGallery = async (data) => {
  const response = await api.post('/gallery', data);
  return response.data;
};

export const updateGallery = async (id, data) => {
  const response = await api.put(`/gallery/${id}`, data);
  return response.data;
};

export const deleteGallery = async (id) => {
  const response = await api.delete(`/gallery/${id}`);
  return response.data;
};

export const getGalleryCategories = async () => {
  const response = await api.get('/gallery/categories');
  return response.data;
};

// Contact
export const getAllContacts = async () => {
  const response = await api.get('/contact');
  return response.data;
};

export const getContactById = async (id) => {
  const response = await api.get(`/contact/${id}`);
  return response.data;
};

export const createContact = async (data) => {
  const response = await api.post('/contact', data);
  return response.data;
};

export const updateContact = async (id, data) => {
  const response = await api.put(`/contact/${id}`, data);
  return response.data;
};

export const deleteContact = async (id) => {
  const response = await api.delete(`/contact/${id}`);
  return response.data;
};

// Notices
export const getAllNotices = async (params = {}) => {
  const response = await api.get('/notices', { params });
  return response.data;
};

export const getNoticeById = async (id) => {
  const response = await api.get(`/notices/${id}`);
  return response.data;
};

export const createNotice = async (data) => {
  const response = await api.post('/notices', data);
  return response.data;
};

export const updateNotice = async (id, data) => {
  const response = await api.put(`/notices/${id}`, data);
  return response.data;
};

export const deleteNotice = async (id) => {
  const response = await api.delete(`/notices/${id}`);
  return response.data;
};

// Services
export const getAllServices = async () => {
  const response = await api.get('/services');
  return response.data;
};

export const getAllServicesAdmin = async () => {
  const response = await api.get('/services/admin/all');
  return response.data;
};

export const getServiceById = async (id) => {
  const response = await api.get(`/services/${id}`);
  return response.data;
};

export const createService = async (data) => {
  const response = await api.post('/services', data);
  return response.data;
};

export const updateService = async (id, data) => {
  const response = await api.put(`/services/${id}`, data);
  return response.data;
};

export const deleteService = async (id) => {
  const response = await api.delete(`/services/${id}`);
  return response.data;
};

// School Timing
export const getAllSchoolTimings = async () => {
  const response = await api.get('/school-timing');
  return response.data;
};

export const getActiveSchoolTiming = async () => {
  const response = await api.get('/school-timing/active');
  return response.data;
};

export const getSchoolTimingById = async (id) => {
  const response = await api.get(`/school-timing/${id}`);
  return response.data;
};

export const createSchoolTiming = async (data) => {
  const response = await api.post('/school-timing', data);
  return response.data;
};

export const updateSchoolTiming = async (id, data) => {
  const response = await api.put(`/school-timing/${id}`, data);
  return response.data;
};

export const deleteSchoolTiming = async (id) => {
  const response = await api.delete(`/school-timing/${id}`);
  return response.data;
};

export const toggleSchoolTimingActive = async (id) => {
  const response = await api.patch(`/school-timing/${id}/toggle-active`);
  return response.data;
};

// Important Notices
export const getAllImportantNotices = async (params = {}) => {
  const response = await api.get('/important-notices', { params });
  return response.data;
};

export const getActiveImportantNotices = async (params = {}) => {
  const response = await api.get('/important-notices/active', { params });
  return response.data;
};

export const getImportantNoticeById = async (id) => {
  const response = await api.get(`/important-notices/${id}`);
  return response.data;
};

export const createImportantNotice = async (data) => {
  const response = await api.post('/important-notices', data);
  return response.data;
};

export const updateImportantNotice = async (id, data) => {
  const response = await api.put(`/important-notices/${id}`, data);
  return response.data;
};

export const deleteImportantNotice = async (id) => {
  const response = await api.delete(`/important-notices/${id}`);
  return response.data;
};

export const toggleImportantNoticeActive = async (id) => {
  const response = await api.patch(`/important-notices/${id}/toggle-active`);
  return response.data;
};

export const getImportantNoticeStats = async () => {
  const response = await api.get('/important-notices/stats');
  return response.data;
};

// Facilities
export const getAllFacilities = async (params = {}) => {
  const response = await api.get('/facilities', { params });
  return response.data;
};

export const getActiveFacilities = async (params = {}) => {
  const response = await api.get('/facilities/active', { params });
  return response.data;
};

export const getFacilitiesByCategory = async (category) => {
  const response = await api.get(`/facilities/category/${category}`);
  return response.data;
};

export const getFacilityById = async (id) => {
  const response = await api.get(`/facilities/${id}`);
  return response.data;
};

export const createFacility = async (data) => {
  const response = await api.post('/facilities', data);
  return response.data;
};

export const updateFacility = async (id, data) => {
  const response = await api.put(`/facilities/${id}`, data);
  return response.data;
};

export const deleteFacility = async (id) => {
  const response = await api.delete(`/facilities/${id}`);
  return response.data;
};

export const toggleFacilityActive = async (id) => {
  const response = await api.patch(`/facilities/${id}/toggle-active`);
  return response.data;
};

export const getFacilityCategories = async () => {
  const response = await api.get('/facilities/categories/list');
  return response.data;
};

export const getFacilityStats = async () => {
  const response = await api.get('/facilities/stats');
  return response.data;
};

export default api;
