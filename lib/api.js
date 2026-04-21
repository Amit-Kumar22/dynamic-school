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

export const register = async (username, email, password) => {
  const response = await api.post('/auth/register', { username, email, password });
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

export default api;
