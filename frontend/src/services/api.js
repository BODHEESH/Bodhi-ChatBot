import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bodhiChatbotToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('bodhiChatbotToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  updatePreferences: (preferences) => api.put('/auth/preferences', preferences),
};

// Chat API
export const chatAPI = {
  createChat: (chatData) => api.post('/chat/create', chatData),
  getChat: (chatId) => api.get(`/chat/${chatId}`),
  getUserChats: (userId) => api.get(`/chat/user/${userId}`),
  addMessage: (chatId, messageData) => api.post(`/chat/${chatId}/message`, messageData),
  updateChatTitle: (chatId, title) => api.put(`/chat/${chatId}/title`, { title }),
  deleteChat: (chatId) => api.delete(`/chat/${chatId}`),
};

// File API
export const fileAPI = {
  uploadFile: (formData) => api.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getFile: (fileId) => api.get(`/files/${fileId}`),
  getUserFiles: (userId) => api.get(`/files/user/${userId}`),
  compareFiles: (fileId1, fileId2) => api.post('/files/compare', { fileId1, fileId2 }),
  deleteFile: (fileId) => api.delete(`/files/${fileId}`),
};

// AI API
export const aiAPI = {
  chatWithAI: (messageData) => api.post('/ai/chat', messageData),
  analyzeDocument: (documentData) => api.post('/ai/analyze-document', documentData),
  generateCode: (codeData) => api.post('/ai/generate-code', codeData),
  getCapabilities: () => api.get('/ai/capabilities'),
  batchProcess: (requests) => api.post('/ai/batch', { requests }),
};

export default api;
