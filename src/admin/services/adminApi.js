import axios from 'axios';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

// Instance axios khusus admin — token diambil dari localStorage setelah login
const adminApi = axios.create({ baseURL: STRAPI_URL });

// Sisipkan token admin ke setiap request secara otomatis
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('yakapetra_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Jika token expired (401), paksa logout
adminApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('yakapetra_admin_token');
      localStorage.removeItem('yakapetra_admin_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const adminLogin = (email, password) =>
  adminApi.post('/admin/login', { email, password });

// ─── Artikel ──────────────────────────────────────────────────────────────────
const ARTICLE_UID = 'api::article.article';
export const getArticles  = (page = 1, pageSize = 10) =>
  adminApi.get(`/content-manager/collection-types/${ARTICLE_UID}`, {
    params: { page, pageSize, sort: 'createdAt:desc' },
  });
export const getArticle   = (id) => adminApi.get(`/content-manager/collection-types/${ARTICLE_UID}/${id}`);
export const createArticle = (data) => adminApi.post(`/content-manager/collection-types/${ARTICLE_UID}`, data);
export const updateArticle = (id, data) => adminApi.put(`/content-manager/collection-types/${ARTICLE_UID}/${id}`, data);
export const deleteArticle = (id) => adminApi.delete(`/content-manager/collection-types/${ARTICLE_UID}/${id}`);
export const publishArticle = (id) => adminApi.post(`/content-manager/collection-types/${ARTICLE_UID}/${id}/actions/publish`);
export const unpublishArticle = (id) => adminApi.post(`/content-manager/collection-types/${ARTICLE_UID}/${id}/actions/unpublish`);

// ─── Program ──────────────────────────────────────────────────────────────────
const PROGRAM_UID = 'api::program.program';
export const getPrograms   = (page = 1, pageSize = 20) =>
  adminApi.get(`/content-manager/collection-types/${PROGRAM_UID}`, { params: { page, pageSize } });
export const getProgram    = (id) => adminApi.get(`/content-manager/collection-types/${PROGRAM_UID}/${id}`);
export const createProgram = (data) => adminApi.post(`/content-manager/collection-types/${PROGRAM_UID}`, data);
export const updateProgram = (id, data) => adminApi.put(`/content-manager/collection-types/${PROGRAM_UID}/${id}`, data);
export const deleteProgram = (id) => adminApi.delete(`/content-manager/collection-types/${PROGRAM_UID}/${id}`);
export const publishProgram   = (id) => adminApi.post(`/content-manager/collection-types/${PROGRAM_UID}/${id}/actions/publish`);

// ─── Galeri ───────────────────────────────────────────────────────────────────
const GALLERY_UID = 'api::gallery.gallery';
export const getGalleries  = (page = 1) =>
  adminApi.get(`/content-manager/collection-types/${GALLERY_UID}`, { params: { page, pageSize: 20 } });
export const createGallery = (data) => adminApi.post(`/content-manager/collection-types/${GALLERY_UID}`, data);
export const updateGallery = (id, data) => adminApi.put(`/content-manager/collection-types/${GALLERY_UID}/${id}`, data);
export const deleteGallery = (id) => adminApi.delete(`/content-manager/collection-types/${GALLERY_UID}/${id}`);
export const publishGallery = (id) => adminApi.post(`/content-manager/collection-types/${GALLERY_UID}/${id}/actions/publish`);

// ─── Pesan Kontak ─────────────────────────────────────────────────────────────
const CONTACT_UID = 'api::contact.contact';
export const getContacts  = (page = 1) =>
  adminApi.get(`/content-manager/collection-types/${CONTACT_UID}`, {
    params: { page, pageSize: 20, sort: 'createdAt:desc' },
  });
export const deleteContact = (id) => adminApi.delete(`/content-manager/collection-types/${CONTACT_UID}/${id}`);
export const updateContact = (id, data) => adminApi.put(`/content-manager/collection-types/${CONTACT_UID}/${id}`, data);

// ─── Upload File / Gambar ─────────────────────────────────────────────────────
// Admin upload: POST /upload (Admin API, accepts admin JWT). NOT /api/upload (Content API).
export const uploadFile = (formData) =>
  adminApi.post('/upload', formData);

export const getUploadedFiles = () =>
  adminApi.get('/upload/files', { params: { sort: 'createdAt:desc', pageSize: 50 } });

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const getDashboardStats = async () => {
  const [articles, programs, galleries, contacts] = await Promise.all([
    adminApi.get(`/content-manager/collection-types/${ARTICLE_UID}`, { params: { pageSize: 1 } }),
    adminApi.get(`/content-manager/collection-types/${PROGRAM_UID}`, { params: { pageSize: 1 } }),
    adminApi.get(`/content-manager/collection-types/${GALLERY_UID}`, { params: { pageSize: 1 } }),
    adminApi.get(`/content-manager/collection-types/${CONTACT_UID}`, { params: { pageSize: 1 } }),
  ]);
  return {
    articles:  articles.data.pagination?.total  ?? 0,
    programs:  programs.data.pagination?.total  ?? 0,
    galleries: galleries.data.pagination?.total ?? 0,
    contacts:  contacts.data.pagination?.total  ?? 0,
  };
};

export default adminApi;
