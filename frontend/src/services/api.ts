import axios from 'axios';
import type {
  ApiResponse, Project, ProjectDTO,
  Service, ServiceDTO, Contact, ContactDTO,
} from '../types';

// Base URL — Use environment variable, fallback to /api for dev
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ── Projects ─────────────────────────────────────────────────
export const projectApi = {
  getAll: () =>
    api.get<ApiResponse<Project[]>>('/projects').then(r => r.data),

  getFeatured: () =>
    api.get<ApiResponse<Project[]>>('/projects/featured').then(r => r.data),

  getById: (id: number) =>
    api.get<ApiResponse<Project>>(`/projects/${id}`).then(r => r.data),

  create: (dto: ProjectDTO) =>
    api.post<ApiResponse<Project>>('/projects', dto).then(r => r.data),

  update: (id: number, dto: ProjectDTO) =>
    api.put<ApiResponse<Project>>(`/projects/${id}`, dto).then(r => r.data),

  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/projects/${id}`).then(r => r.data),
};

// ── Services ─────────────────────────────────────────────────
export const serviceApi = {
  getActive: () =>
    api.get<ApiResponse<Service[]>>('/services').then(r => r.data),

  getAll: () =>
    api.get<ApiResponse<Service[]>>('/services/all').then(r => r.data),

  getById: (id: number) =>
    api.get<ApiResponse<Service>>(`/services/${id}`).then(r => r.data),

  create: (dto: ServiceDTO) =>
    api.post<ApiResponse<Service>>('/services', dto).then(r => r.data),

  update: (id: number, dto: ServiceDTO) =>
    api.put<ApiResponse<Service>>(`/services/${id}`, dto).then(r => r.data),

  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/services/${id}`).then(r => r.data),
};

// ── Contact ──────────────────────────────────────────────────
export const contactApi = {
  submit: (dto: ContactDTO) =>
    api.post<ApiResponse<Contact>>('/contact', dto).then(r => r.data),

  getAll: () =>
    api.get<ApiResponse<Contact[]>>('/contact').then(r => r.data),

  getUnread: () =>
    api.get<ApiResponse<Contact[]>>('/contact/unread').then(r => r.data),

  getUnreadCount: () =>
    api.get<ApiResponse<{ count: number }>>('/contact/unread-count').then(r => r.data),

  markAsRead: (id: number) =>
    api.put<ApiResponse<Contact>>(`/contact/${id}/read`).then(r => r.data),

  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/contact/${id}`).then(r => r.data),
};

export default api;
