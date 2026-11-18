import axios from 'axios';
import {
  SurplusOffer,
  RecipientNeed,
  WasteObservation,
  User,
  AuthResponse,
  RegisterPayload,
  LoginPayload,
  AdminOverview,
  NearbySurplusItem,
  NearbyNeedItem,
  MapMarker,
} from './types';

// Base URL points to the FastAPI backend (running on localhost:8000)
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 10000,
});

// Attach Authorization Bearer token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('urban_food_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==============================================================================
// Authentication Endpoints
// ==============================================================================
export const registerUser = (data: RegisterPayload) =>
  api.post<AuthResponse>('/auth/register', data);

export const loginUser = (data: LoginPayload) =>
  api.post<AuthResponse>('/auth/login', data);

export const fetchCurrentUser = () =>
  api.get<User>('/auth/me');

export const updateUserProfile = (data: Partial<User>) =>
  api.put<User>('/auth/profile', data);

export const forgotPassword = (email: string) =>
  api.post('/auth/forgot-password', { email });

// ==============================================================================
// Administrator & Database Management Endpoints
// ==============================================================================
export const fetchAdminOverview = () =>
  api.get<AdminOverview>('/admin/overview');

export const fetchAdminUsers = (params?: { search?: string; role?: string; limit?: number; offset?: number }) =>
  api.get<User[]>('/admin/users', { params });

export const updateAdminUser = (userId: number, data: Partial<User>) =>
  api.put<User>(`/admin/users/${userId}`, data);

export const deleteAdminUser = (userId: number) =>
  api.delete(`/admin/users/${userId}`);

// ==============================================================================
// Location & Nearby Discovery Endpoints
// ==============================================================================
export const fetchNearbySurplus = (params: { lat: number; lng: number; radius_km?: number; category?: string }) =>
  api.get<NearbySurplusItem[]>('/location/nearby-surplus', { params });

export const fetchNearbyNeeds = (params: { lat: number; lng: number; radius_km?: number; category?: string }) =>
  api.get<NearbyNeedItem[]>('/location/nearby-needs', { params });

export const fetchAllMarkers = (params?: { user_lat?: number; user_lng?: number }) =>
  api.get<MapMarker[]>('/location/all-markers', { params });

// ==============================================================================
// Surplus Endpoints
// ==============================================================================
export const fetchSurpluses = () => api.get<SurplusOffer[]>('/surplus/');
export const fetchSurplus = (id: number) => api.get<SurplusOffer>(`/surplus/${id}`);
export const createSurplus = (data: Partial<SurplusOffer>) => api.post<SurplusOffer>('/surplus/', data);
export const deleteSurplus = (id: number) => api.delete(`/surplus/${id}`);

// ==============================================================================
// Recipient Need Endpoints
// ==============================================================================
export const fetchNeeds = () => api.get<RecipientNeed[]>('/need/');
export const fetchNeed = (id: number) => api.get<RecipientNeed>(`/need/${id}`);
export const createNeed = (data: Partial<RecipientNeed>) => api.post<RecipientNeed>('/need/', data);
export const deleteNeed = (id: number) => api.delete(`/need/${id}`);

// ==============================================================================
// Waste Observation Endpoints
// ==============================================================================
export const fetchWaste = () => api.get<WasteObservation[]>('/waste/');
export const createWaste = (data: Partial<WasteObservation>) => api.post<WasteObservation>('/waste/', data);
export const deleteWaste = (id: number) => api.delete(`/waste/${id}`);

// ==============================================================================
// Analytics Endpoints
// ==============================================================================
export const fetchAnalyticsSummary = () => api.get('/analytics/summary');
export const fetchAnalyticsCategory = () => api.get('/analytics/category_breakdown');
export const fetchAnalyticsTrend = (metric: string = 'surplus', days: number = 30) =>
  api.get('/analytics/trend', { params: { metric, days } });

// ==============================================================================
// Match Endpoints
// ==============================================================================
export const generateMatches = () => api.post('/match/generate');
export const fetchMatches = () => api.get('/match/');
export const decideMatch = (matchId: number, decision: 'approved' | 'rejected' | 'cancelled') =>
  api.patch(`/match/${matchId}?decision=${decision}`);

// ==============================================================================
// Data Import Endpoints
// ==============================================================================
export const uploadSurplusCSV = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/import/surplus', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const uploadNeedCSV = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/import/need', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const uploadWasteCSV = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/import/waste', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default api;
