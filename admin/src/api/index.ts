import { api } from './axios';

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ data: { token: string; user: { id: string; email: string; name: string } } }>('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get<{ data: { id: string; email: string; name: string } }>('/auth/me'),
};

export const articlesApi = {
  list: (page = 1, pageSize = 10) =>
    api.get<{ results: Article[]; pagination: Pagination }>('/articles', { params: { page, pageSize } }),
  get: (id: string) => api.get<Article>(`/articles/${id}`),
  create: (data: Partial<Article>) => api.post<Article>('/articles', data),
  update: (id: string, data: Partial<Article>) => api.put<Article>(`/articles/${id}`, data),
  delete: (id: string) => api.delete(`/articles/${id}`),
  publish: (id: string) => api.post(`/articles/${id}/publish`),
  unpublish: (id: string) => api.post(`/articles/${id}/unpublish`),
};

export const categoriesApi = {
  list: () => api.get<{ data: Category[] }>('/categories'),
  create: (data: { name: string }) => api.post<Category>('/categories', data),
  update: (id: string, data: { name?: string }) => api.put<Category>(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

export const programsApi = {
  list: (page = 1, pageSize = 20) =>
    api.get<{ results: Program[]; pagination: Pagination }>('/programs', { params: { page, pageSize } }),
  get: (id: string) => api.get<Program>(`/programs/${id}`),
  create: (data: Partial<Program>) => api.post<Program>('/programs', data),
  update: (id: string, data: Partial<Program>) => api.put<Program>(`/programs/${id}`, data),
  delete: (id: string) => api.delete(`/programs/${id}`),
  publish: (id: string) => api.post(`/programs/${id}/publish`),
};

export const galleriesApi = {
  list: (page = 1) =>
    api.get<{ results: Gallery[]; pagination: Pagination }>('/galleries', { params: { page, pageSize: 20 } }),
  get: (id: string) => api.get<Gallery>(`/galleries/${id}`),
  create: (data: Partial<Gallery>) => api.post<Gallery>('/galleries', data),
  update: (id: string, data: Partial<Gallery>) => api.put<Gallery>(`/galleries/${id}`, data),
  delete: (id: string) => api.delete(`/galleries/${id}`),
  publish: (id: string) => api.post(`/galleries/${id}/publish`),
};

export const contactsApi = {
  list: (page = 1) =>
    api.get<{ results: Contact[]; pagination: Pagination }>('/contacts', { params: { page, pageSize: 20 } }),
  update: (id: string, data: { isRead?: boolean }) => api.put(`/contacts/${id}`, data),
  delete: (id: string) => api.delete(`/contacts/${id}`),
};

export const aboutApi = {
  get: () => api.get<AboutPage>('/about'),
  update: (data: Partial<AboutPage>) => api.put<AboutPage>('/about', data),
};

export const dashboardApi = {
  stats: () => api.get<{ articles: number; programs: number; galleries: number; contacts: number }>('/dashboard/stats'),
};

export const uploadApi = {
  file: (formData: FormData) =>
    api.post<{ data: { id: string; url: string } }>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  publishedAt: string | null;
  categoryId: string | null;
  category?: Category | null;
  thumbnailId: string | null;
  thumbnail?: { url: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string | null;
  icon?: string | null;
  beneficiaries?: string | null;
  location?: string | null;
  order: number;
  published: boolean;
  publishedAt: string | null;
  imageId?: string | null;
  image?: { url: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface Gallery {
  id: string;
  title: string;
  description?: string | null;
  eventDate?: string | null;
  published: boolean;
  publishedAt: string | null;
  images: { id: string; url: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AboutPage {
  id: string;
  vision: string;
  mission: string;
  values?: string | null;
  history?: string | null;
  establishedYear?: number | null;
  heroImageId?: string | null;
  heroImage?: { url: string } | null;
  published?: boolean;
}
