// Top-level axios config and interceptors
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refreshToken,
          });
          
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API endpoints object
export const endpoints = {
  // Authentication
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
    resendVerification: '/auth/resend-verification',
  },
  
  // Users
  users: {
    profile: '/users/profile',
    updateProfile: '/users/profile',
    changePassword: '/users/change-password',
    uploadAvatar: '/users/avatar',
    preferences: '/users/preferences',
    notifications: '/users/notifications',
  },
  
  // Organizations
  organizations: {
    list: '/organizations',
    create: '/organizations',
    get: (id) => `/organizations/${id}`,
    update: (id) => `/organizations/${id}`,
    delete: (id) => `/organizations/${id}`,
    members: (id) => `/organizations/${id}/members`,
    invite: (id) => `/organizations/${id}/invite`,
  },
  
  // Consultations
  consultations: {
    list: '/consultations',
    create: '/consultations',
    get: (id) => `/consultations/${id}`,
    update: (id) => `/consultations/${id}`,
    delete: (id) => `/consultations/${id}`,
    book: '/consultations/book',
    availability: '/consultations/availability',
    messages: (id) => `/consultations/${id}/messages`,
    files: (id) => `/consultations/${id}/files`,
    status: (id) => `/consultations/${id}/status`,
  },
  
  // Courses & Learning
  courses: {
    list: '/courses',
    create: '/courses',
    get: (id) => `/courses/${id}`,
    update: (id) => `/courses/${id}`,
    delete: (id) => `/courses/${id}`,
    enroll: (id) => `/courses/${id}/enroll`,
    progress: (id) => `/courses/${id}/progress`,
    modules: (id) => `/courses/${id}/modules`,
    quizzes: (id) => `/courses/${id}/quizzes`,
    certificates: (id) => `/courses/${id}/certificates`,
  },
  
  // Drug Information
  drugs: {
    search: '/drugs/search',
    list: '/drugs',
    get: (id) => `/drugs/${id}`,
    interactions: (id) => `/drugs/${id}/interactions`,
    sideEffects: (id) => `/drugs/${id}/side-effects`,
    dosage: (id) => `/drugs/${id}/dosage`,
    alternatives: (id) => `/drugs/${id}/alternatives`,
    formulary: '/drugs/formulary',
    categories: '/drugs/categories',
  },
  
  // Payments & Subscriptions
  payments: {
    create: '/payments',
    list: '/payments',
    get: (id) => `/payments/${id}`,
    webhook: '/payments/webhook',
    subscriptions: '/payments/subscriptions',
    createSubscription: '/payments/subscriptions',
    cancelSubscription: (id) => `/payments/subscriptions/${id}/cancel`,
    updateSubscription: (id) => `/payments/subscriptions/${id}`,
    invoices: '/payments/invoices',
  },
  
  // Content & Blog
  posts: {
    list: '/posts',
    create: '/posts',
    get: (slug) => `/posts/${slug}`,
    update: (id) => `/posts/${id}`,
    delete: (id) => `/posts/${id}`,
    categories: '/posts/categories',
    tags: '/posts/tags',
    search: '/posts/search',
  },
  
  // Support & Contact
  support: {
    tickets: '/support/tickets',
    createTicket: '/support/tickets',
    getTicket: (id) => `/support/tickets/${id}`,
    updateTicket: (id) => `/support/tickets/${id}`,
    messages: (id) => `/support/tickets/${id}/messages`,
    faq: '/support/faq',
    categories: '/support/categories',
  },
  
  // Analytics & Metrics
  analytics: {
    dashboard: '/analytics/dashboard',
    pageViews: '/analytics/page-views',
    userActivity: '/analytics/user-activity',
    conversions: '/analytics/conversions',
    revenue: '/analytics/revenue',
    custom: '/analytics/custom',
  },
  
  // Search
  search: {
    global: '/search',
    drugs: '/search/drugs',
    courses: '/search/courses',
    posts: '/search/posts',
    users: '/search/users',
  },
  
  // File Upload
  files: {
    upload: '/files/upload',
    delete: (id) => `/files/${id}`,
    get: (id) => `/files/${id}`,
    list: '/files',
  },
  
  // Notifications
  notifications: {
    list: '/notifications',
    markRead: (id) => `/notifications/${id}/read`,
    markAllRead: '/notifications/mark-all-read',
    settings: '/notifications/settings',
    subscribe: '/notifications/subscribe',
  },
  
  // External APIs
  external: {
    nhs: '/external/nhs',
    openfda: '/external/openfda',
    snomed: '/external/snomed',
    icd10: '/external/icd10',
    rxnorm: '/external/rxnorm',
  },
};

// API service methods
export const apiService = {
  // Generic CRUD methods
  async get(endpoint, params = {}) {
    const response = await api.get(endpoint, { params });
    return response.data;
  },
  
  async post(endpoint, data = {}) {
    const response = await api.post(endpoint, data);
    return response.data;
  },
  
  async put(endpoint, data = {}) {
    const response = await api.put(endpoint, data);
    return response.data;
  },
  
  async patch(endpoint, data = {}) {
    const response = await api.patch(endpoint, data);
    return response.data;
  },
  
  async delete(endpoint) {
    const response = await api.delete(endpoint);
    return response.data;
  },
  
  // File upload
  async uploadFile(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(endpoints.files.upload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress,
    });
    
    return response.data;
  },
  
  // Search with pagination
  async search(endpoint, query, page = 1, limit = 20) {
    const params = {
      q: query,
      page,
      limit,
    };
    
    const response = await api.get(endpoint, { params });
    return response.data;
  },
  
  // Paginated list
  async getPaginated(endpoint, page = 1, limit = 20, filters = {}) {
    const params = {
      page,
      limit,
      ...filters,
    };
    
    const response = await api.get(endpoint, { params });
    return response.data;
  },
};

// Specific service methods
export const authService = {
  async login(credentials) {
    return apiService.post(endpoints.auth.login, credentials);
  },
  
  async register(userData) {
    return apiService.post(endpoints.auth.register, userData);
  },
  
  async refreshToken(refreshToken) {
    return apiService.post(endpoints.auth.refresh, { refreshToken });
  },
  
  async logout() {
    return apiService.post(endpoints.auth.logout);
  },
  
  async forgotPassword(email) {
    return apiService.post(endpoints.auth.forgotPassword, { email });
  },
  
  async resetPassword(token, password) {
    return apiService.post(endpoints.auth.resetPassword, { token, password });
  },
};

export const userService = {
  async getProfile() {
    return apiService.get(endpoints.users.profile);
  },
  
  async updateProfile(profileData) {
    return apiService.put(endpoints.users.updateProfile, profileData);
  },
  
  async changePassword(passwords) {
    return apiService.put(endpoints.users.changePassword, passwords);
  },
  
  async uploadAvatar(file) {
    return apiService.uploadFile(file);
  },
};

export const consultationService = {
  async getConsultations(page = 1, limit = 20) {
    return apiService.getPaginated(endpoints.consultations.list, page, limit);
  },
  
  async createConsultation(consultationData) {
    return apiService.post(endpoints.consultations.create, consultationData);
  },
  
  async getConsultation(id) {
    return apiService.get(endpoints.consultations.get(id));
  },
  
  async updateConsultation(id, updateData) {
    return apiService.put(endpoints.consultations.update(id), updateData);
  },
  
  async bookConsultation(bookingData) {
    return apiService.post(endpoints.consultations.book, bookingData);
  },
  
  async getAvailability(consultantId, date) {
    return apiService.get(endpoints.consultations.availability, { consultantId, date });
  },
};

export const courseService = {
  async getCourses(page = 1, limit = 20, category = null) {
    const filters = category ? { category } : {};
    return apiService.getPaginated(endpoints.courses.list, page, limit, filters);
  },
  
  async getCourse(id) {
    return apiService.get(endpoints.courses.get(id));
  },
  
  async enrollInCourse(courseId) {
    return apiService.post(endpoints.courses.enroll(courseId));
  },
  
  async getProgress(courseId) {
    return apiService.get(endpoints.courses.progress(courseId));
  },
};

export const drugService = {
  async searchDrugs(query, page = 1, limit = 20) {
    return apiService.search(endpoints.drugs.search, query, page, limit);
  },
  
  async getDrug(id) {
    return apiService.get(endpoints.drugs.get(id));
  },
  
  async getInteractions(drugId) {
    return apiService.get(endpoints.drugs.interactions(drugId));
  },
  
  async getFormulary() {
    return apiService.get(endpoints.drugs.formulary);
  },
};

export const paymentService = {
  async createSubscription(subscriptionData) {
    return apiService.post(endpoints.payments.createSubscription, subscriptionData);
  },
  
  async cancelSubscription(subscriptionId) {
    return apiService.post(endpoints.payments.cancelSubscription(subscriptionId));
  },
  
  async getInvoices() {
    return apiService.get(endpoints.payments.invoices);
  },
};

export const postService = {
  async getPosts(page = 1, limit = 20, category = null) {
    const filters = category ? { category } : {};
    return apiService.getPaginated(endpoints.posts.list, page, limit, filters);
  },
  
  async getPost(slug) {
    return apiService.get(endpoints.posts.get(slug));
  },
  
  async searchPosts(query, page = 1, limit = 20) {
    return apiService.search(endpoints.posts.search, query, page, limit);
  },
};

export const supportService = {
  async createTicket(ticketData) {
    return apiService.post(endpoints.support.createTicket, ticketData);
  },
  
  async getTickets(page = 1, limit = 20) {
    return apiService.getPaginated(endpoints.support.tickets, page, limit);
  },
  
  async getTicket(id) {
    return apiService.get(endpoints.support.getTicket(id));
  },
  
  async getFAQ() {
    return apiService.get(endpoints.support.faq);
  },
};

export const analyticsService = {
  async getDashboard() {
    return apiService.get(endpoints.analytics.dashboard);
  },
  
  async getPageViews(dateRange) {
    return apiService.get(endpoints.analytics.pageViews, dateRange);
  },
  
  async getRevenue(dateRange) {
    return apiService.get(endpoints.analytics.revenue, dateRange);
  },
};

export const searchService = {
  async globalSearch(query, page = 1, limit = 20) {
    return apiService.search(endpoints.search.global, query, page, limit);
  },
  
  async searchDrugs(query, page = 1, limit = 20) {
    return apiService.search(endpoints.search.drugs, query, page, limit);
  },
  
  async searchCourses(query, page = 1, limit = 20) {
    return apiService.search(endpoints.search.courses, query, page, limit);
  },
};

export default api;
