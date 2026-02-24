import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const backendAdminApi = axios.create({
  baseURL: `${API_URL}/api/admin`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

backendAdminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('yakapetra_backend_token') || localStorage.getItem('yakapetra_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

backendAdminApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('yakapetra_backend_token');
    }
    return Promise.reject(err);
  }
);

// Site Settings (singleton)
export const getSiteSettings = () => backendAdminApi.get('/site-settings');
export const updateSiteSettings = (data) => backendAdminApi.put('/site-settings', { data });

// Donation Accounts
export const getDonationAccounts = () => backendAdminApi.get('/donation-accounts');
export const getDonationAccount = (id) => backendAdminApi.get(`/donation-accounts/${id}`);
export const createDonationAccount = (data) => backendAdminApi.post('/donation-accounts', { data });
export const updateDonationAccount = (id, data) => backendAdminApi.put(`/donation-accounts/${id}`, { data });
export const deleteDonationAccount = (id) => backendAdminApi.delete(`/donation-accounts/${id}`);

// Board Members
export const getBoardMembers = () => backendAdminApi.get('/board-members');
export const getBoardMember = (id) => backendAdminApi.get(`/board-members/${id}`);
export const createBoardMember = (data) => backendAdminApi.post('/board-members', { data });
export const updateBoardMember = (id, data) => backendAdminApi.put(`/board-members/${id}`, { data });
export const deleteBoardMember = (id) => backendAdminApi.delete(`/board-members/${id}`);

// ─── Artikel (admin) ─────────────────────────────────────────────────────────
export const getArticlesBackend = (page = 1, pageSize = 10) =>
  backendAdminApi.get('/articles', { params: { page, pageSize } }).then((r) => r.data);
export const getArticleBackend = (id) => backendAdminApi.get(`/articles/${id}`).then((r) => r.data);
export const createArticleBackend = (data) => backendAdminApi.post('/articles', data).then((r) => r.data);
export const updateArticleBackend = (id, data) => backendAdminApi.put(`/articles/${id}`, data).then((r) => r.data);
export const deleteArticleBackend = (id) => backendAdminApi.delete(`/articles/${id}`);
export const publishArticleBackend = (id) => backendAdminApi.post(`/articles/${id}/publish`);
export const unpublishArticleBackend = (id) => backendAdminApi.post(`/articles/${id}/unpublish`);

// ─── Program (admin) ─────────────────────────────────────────────────────────
export const getProgramsBackend = (page = 1, pageSize = 20) =>
  backendAdminApi.get('/programs', { params: { page, pageSize } }).then((r) => r.data);
export const getProgramBackend = (id) => backendAdminApi.get(`/programs/${id}`).then((r) => r.data);
export const createProgramBackend = (data) => backendAdminApi.post('/programs', data).then((r) => r.data);
export const updateProgramBackend = (id, data) => backendAdminApi.put(`/programs/${id}`, data).then((r) => r.data);
export const deleteProgramBackend = (id) => backendAdminApi.delete(`/programs/${id}`);
export const publishProgramBackend = (id) => backendAdminApi.post(`/programs/${id}/publish`);

// ─── Kontak / Pesan (admin) ──────────────────────────────────────────────────
export const getContactsBackend = (page = 1, pageSize = 20) =>
  backendAdminApi.get('/contacts', { params: { page, pageSize } }).then((r) => r.data);
export const updateContactBackend = (id, data) =>
  backendAdminApi.put(`/contacts/${id}`, { isRead: data.is_read ?? data.isRead });
export const deleteContactBackend = (id) => backendAdminApi.delete(`/contacts/${id}`);

// ─── Galeri (admin) ─────────────────────────────────────────────────────────
export const getGalleriesBackend = (page = 1, pageSize = 20) =>
  backendAdminApi.get('/galleries', { params: { page, pageSize } });
export const getGalleryBackend = (id) => backendAdminApi.get(`/galleries/${id}`);
export const createGalleryBackend = (data) => backendAdminApi.post('/galleries', data);
export const updateGalleryBackend = (id, data) => backendAdminApi.put(`/galleries/${id}`, data);
export const deleteGalleryBackend = (id) => backendAdminApi.delete(`/galleries/${id}`);
export const publishGalleryBackend = (id) => backendAdminApi.post(`/galleries/${id}/publish`);

// Upload file (backend) — field name: file
export const uploadFileBackend = (formData) =>
  backendAdminApi.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Dashboard stats (backend — tanpa Strapi)
export const getDashboardStatsBackend = () =>
  backendAdminApi.get('/dashboard/stats').then((res) => res.data);

// Backend auth (untuk login ke backend terpisah dari Strapi)
export const backendLogin = (email, password) =>
  axios.post(`${API_URL}/api/admin/auth/login`, { email, password }, { headers: { 'Content-Type': 'application/json' } });

export default backendAdminApi;
