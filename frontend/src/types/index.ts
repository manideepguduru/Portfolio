// ── API wrapper ──────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// ── Project ──────────────────────────────────────────────────
export interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string;       // comma-separated string from backend
  githubUrl: string | null;
  liveUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDTO {
  title: string;
  description: string;
  techStack: string;
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  sortOrder: number;
}

// ── Service ──────────────────────────────────────────────────
export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string | null;
  priceRange: string | null;
  techStack: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceDTO {
  title: string;
  description: string;
  icon?: string;
  priceRange?: string;
  techStack?: string;
  githubUrl?: string;
  liveUrl?: string;
  sortOrder: number;
  active: boolean;
}

// ── Contact ──────────────────────────────────────────────────
export interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  readStatus: boolean;
  createdAt: string;
}

export interface ContactDTO {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// ── Form validation errors ───────────────────────────────────
export type FormErrors<T> = Partial<Record<keyof T, string>>;
