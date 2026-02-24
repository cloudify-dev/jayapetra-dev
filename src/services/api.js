import axios from 'axios';

// Base URL API - kosong = same origin (satu port), atau backend terpisah (dev)
const API_URL = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_STRAPI_URL ?? '';
const API_TOKEN = import.meta.env.VITE_STRAPI_TOKEN || import.meta.env.VITE_API_TOKEN || '';

const api = axios.create({
  baseURL: API_URL ? `${API_URL.replace(/\/$/, '')}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
    ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
  },
});

// Normalizer: format backend baru → format Strapi-like (supaya frontend tetap jalan)
const toStrapiArticle = (a) => ({
  id: a.id,
  documentId: a.documentId || a.id,
  attributes: {
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    content: a.content,
    publishedAt: a.publishedAt,
    category: a.category ? { data: { attributes: { name: a.category.name } } } : null,
    thumbnail: a.thumbnail ? { data: { attributes: { url: a.thumbnail.url } } } : { data: null },
    author: null,
  },
});

const toStrapiProgram = (p) => ({
  id: p.id,
  documentId: p.documentId || p.id,
  attributes: {
    title: p.title,
    slug: p.slug,
    description: p.description,
    content: p.content,
    icon: p.icon,
    beneficiaries: p.beneficiaries,
    location: p.location,
    order: p.order,
    image: p.image ? { data: { attributes: { url: p.image.url } } } : { data: null },
  },
});

// Normalize images from backend [{url}] or Strapi v5 {data:[...]} / array
const normGalleryImages = (g) => {
  if (!g.images) return [];
  if (Array.isArray(g.images)) return g.images.map((img) => ({ attributes: { url: img?.url ?? img?.attributes?.url } }));
  if (g.images?.data) return (Array.isArray(g.images.data) ? g.images.data : []).map((img) => ({ attributes: { url: img?.url ?? img?.attributes?.url } }));
  return [];
};

const toStrapiGallery = (g) => ({
  id: g.id ?? g.documentId,
  documentId: g.documentId || g.id,
  attributes: {
    title: g.title ?? g.attributes?.title,
    description: g.description ?? g.attributes?.description,
    eventDate: g.eventDate ?? g.attributes?.eventDate,
    images: { data: normGalleryImages(g) },
  },
});

// ─── Berita / Artikel ────────────────────────────────────────────────────────

export const getArticles = async (params = {}) => {
  const res = await api.get('/articles', { params: { sort: 'publishedAt:desc', ...params } });
  const raw = res.data?.data ?? [];
  return { data: { data: raw.map(toStrapiArticle) } };
};

export const getArticleBySlug = async (slug) => {
  const res = await api.get('/articles', { params: { filters: { slug: { $eq: slug } } } });
  const raw = res.data?.data ?? [];
  return { data: { data: raw.map(toStrapiArticle) } };
};

// ─── Program Yayasan ─────────────────────────────────────────────────────────

export const getPrograms = async (params = {}) => {
  const res = await api.get('/programs', params);
  const raw = res.data?.data ?? [];
  return { data: { data: raw.map(toStrapiProgram) } };
};

export const getProgramBySlug = async (slug) => {
  const res = await api.get('/programs', { params: { filters: { slug: { $eq: slug } } } });
  const raw = res.data?.data ?? [];
  return { data: { data: raw.map(toStrapiProgram) } };
};

// ─── Galeri ───────────────────────────────────────────────────────────────────

export const getGalleries = async (params = {}) => {
  const res = await api.get('/galleries', { params: { populate: 'images', ...params } });
  const raw = res.data?.data ?? [];
  return { data: { data: raw.map(toStrapiGallery) } };
};

// ─── Profil / Tentang Kami ───────────────────────────────────────────────────

export const getAboutPage = () => api.get('/about-page');

// ─── Kontak ───────────────────────────────────────────────────────────────────

export const submitContactForm = (data) => api.post('/contacts', { data });

// ─── Statistik / Angka Dampak ────────────────────────────────────────────────

export const getStats = () => api.get('/statistic');

// ─── Site Settings (CMS) ─────────────────────────────────────────────────────

export const getSiteSettings = async () => {
  const res = await api.get('/site-settings');
  return res.data?.data ?? null;
};

// ─── Rekening Donasi ─────────────────────────────────────────────────────────

export const getDonationAccounts = async () => {
  const res = await api.get('/donation-accounts');
  const list = res.data?.data ?? [];
  return { data: list };
};

// ─── Pengurus ───────────────────────────────────────────────────────────────

export const getBoardMembers = async () => {
  const res = await api.get('/board-members');
  const list = res.data?.data ?? [];
  return { data: list };
};

// Helper: ambil URL lengkap untuk media (same origin pakai path saja)
export const getStrapiMedia = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return API_URL ? `${API_URL}${url}` : url;
};

export default api;
