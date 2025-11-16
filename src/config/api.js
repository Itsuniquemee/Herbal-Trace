// API Configuration for TraceHerbss Frontend - Full Integration
// NOTE: This is for legacy backend integration only. Supabase is the primary backend.
const API_BASE_URL = process.env.REACT_APP_API_URL || null; // Disabled by default

// HTTP Client with Authentication
import axios from 'axios';

// Create axios instance with default config (only if backend URL is provided)
const apiClient = API_BASE_URL ? axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}) : null;

// DISABLED: Request interceptor to add auth token (Firebase handles auth now)
// Old backend token logic disabled to prevent conflicts with Firebase
/*
if (apiClient) {
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('traceherbs_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for error handling
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('traceherbs_token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
}
*/

// API Endpoints Configuration
export const apiEndpoints = {
  // Base URL
  baseURL: API_BASE_URL,
  
  // Health and Status
  health: `${API_BASE_URL}/health`,
  status: `${API_BASE_URL}/status`,
  docs: `${API_BASE_URL}/docs`,
  
  // Authentication
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    me: `${API_BASE_URL}/auth/me`,
    forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
    resetPassword: `${API_BASE_URL}/auth/reset-password`,
    verifyEmail: `${API_BASE_URL}/auth/verify-email`
  },
  
  // Farmer Endpoints
  farmer: {
    dashboard: `${API_BASE_URL}/farmer/dashboard`,
    profile: `${API_BASE_URL}/farmer/profile`,
    batches: `${API_BASE_URL}/farmer/batches`,
    createBatch: `${API_BASE_URL}/farmer/batches`,
    uploadDocuments: `${API_BASE_URL}/farmer/documents`,
    crops: `${API_BASE_URL}/farmer/crops`,
    analytics: `${API_BASE_URL}/farmer/analytics`,
    generateQR: `${API_BASE_URL}/farmer/generate-qr`,
    qrCodes: `${API_BASE_URL}/farmer/qr-codes`
  },
  
  // Processor Endpoints
  processor: {
    dashboard: `${API_BASE_URL}/processor/dashboard`,
    profile: `${API_BASE_URL}/processor/profile`,
    receiveBatch: `${API_BASE_URL}/processor/receive`,
    processing: `${API_BASE_URL}/processor/processing`,
    qualityTests: `${API_BASE_URL}/processor/quality-tests`,
    generateQR: `${API_BASE_URL}/processor/generate-qr`,
    transfers: `${API_BASE_URL}/processor/transfers`
  },
  
  // Consumer Endpoints
  consumer: {
    verify: (qrCode) => `${API_BASE_URL}/consumer/verify/${qrCode}`,
    trace: (traceId) => `${API_BASE_URL}/consumer/trace/${traceId}`,
    feedback: `${API_BASE_URL}/consumer/feedback`,
    favorites: `${API_BASE_URL}/consumer/favorites`,
    search: `${API_BASE_URL}/consumer/search`
  },
  
  // Admin Endpoints
  admin: {
    dashboard: `${API_BASE_URL}/admin/dashboard`,
    users: `${API_BASE_URL}/admin/users`,
    batches: `${API_BASE_URL}/admin/batches`,
    analytics: `${API_BASE_URL}/admin/analytics`,
    settings: `${API_BASE_URL}/admin/settings`,
    reports: `${API_BASE_URL}/admin/reports`
  },
  
  // QR Code & Tracing
  qr: {
    generate: (batchId) => `${API_BASE_URL}/qr/${batchId}`,
    scan: `${API_BASE_URL}/qr/scan`,
    validate: `${API_BASE_URL}/qr/validate`
  },
  
  // Tracing
  trace: {
    product: (traceId) => `${API_BASE_URL}/trace/${traceId}`,
    journey: (batchId) => `${API_BASE_URL}/trace/journey/${batchId}`,
    timeline: (batchId) => `${API_BASE_URL}/trace/timeline/${batchId}`
  },
  
  // Analytics
  analytics: {
    overview: `${API_BASE_URL}/analytics/overview`,
    farmer: `${API_BASE_URL}/analytics/farmer`,
    processor: `${API_BASE_URL}/analytics/processor`,
    consumer: `${API_BASE_URL}/analytics/consumer`,
    supply_chain: `${API_BASE_URL}/analytics/supply-chain`
  },
  
  // Notifications
  notifications: {
    list: `${API_BASE_URL}/notifications`,
    read: (id) => `${API_BASE_URL}/notifications/${id}/read`,
    markAllRead: `${API_BASE_URL}/notifications/mark-all-read`,
    unreadCount: `${API_BASE_URL}/notifications/unread-count`
  },
  
  // File Upload
  upload: {
    single: `${API_BASE_URL}/upload/single`,
    multiple: `${API_BASE_URL}/upload/multiple`,
    documents: `${API_BASE_URL}/upload/documents`,
    images: `${API_BASE_URL}/upload/images`
  }
};

// HTTP Client Configuration
export const httpConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Authentication Token Helpers
export const authHelpers = {
  getToken: () => localStorage.getItem('traceherbs_token'),
  setToken: (token) => localStorage.setItem('traceherbs_token', token),
  removeToken: () => localStorage.removeItem('traceherbs_token'),
  
  // Add auth header to requests
  getAuthHeaders: () => {
    const token = authHelpers.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};

// WebSocket Configuration (for real-time features)
export const wsConfig = {
  url: process.env.REACT_APP_WS_URL || 'ws://localhost:3001',
  reconnectInterval: 3000,
  maxReconnectAttempts: 5
};

// Export the configured axios client
export { apiClient };

export default {
  apiEndpoints,
  httpConfig,
  authHelpers,
  wsConfig,
  apiClient,
  API_BASE_URL
};