/**
 * Format tanggal ke format Indonesia.
 * Contoh: "19 Februari 2026"
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Potong teks panjang dan tambahkan "..." di akhir.
 */
export const truncateText = (text, maxLength = 120) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format angka besar ke format singkat (1000 → 1rb, 1000000 → 1jt).
 */
export const formatNumber = (num) => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}jt`;
  if (num >= 1_000)     return `${(num / 1_000).toFixed(0)}rb`;
  return String(num);
};

/**
 * Buat slug dari judul teks.
 * Contoh: "Program Beasiswa 2026" → "program-beasiswa-2026"
 */
export const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
