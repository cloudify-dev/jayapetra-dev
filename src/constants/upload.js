/**
 * Aturan upload file/gambar — sinkron dengan backend (backend/src/routes/upload.ts).
 * Gunakan konstanta ini di form upload agar pengguna tidak salah format/ukuran.
 */

// ─── Galeri / Gambar (Admin) ─────────────────────────────────────────────────
export const IMAGE_UPLOAD = {
  /** Ukuran maksimal per file (bytes) — backend: 5MB */
  maxSizeBytes: 5 * 1024 * 1024,
  /** Ukuran maksimal dalam teks untuk ditampilkan */
  maxSizeLabel: '5 MB',
  /** Tipe MIME yang diterima (harus sama dengan backend fileFilter) */
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  /** Ekstensi untuk input accept (untuk filter di dialog pilih file) */
  accept: 'image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp',
  /** Nama field saat kirim ke backend */
  fieldName: 'file',
};

/** Cek apakah file gambar valid (tipe + ukuran) sebelum upload */
export function validateImageFile(file) {
  if (!file) return { valid: false, message: 'Tidak ada file dipilih.' };
  if (file.size > IMAGE_UPLOAD.maxSizeBytes) {
    return { valid: false, message: `Ukuran file "${file.name}" melebihi ${IMAGE_UPLOAD.maxSizeLabel}. Pilih file yang lebih kecil.` };
  }
  if (!IMAGE_UPLOAD.allowedMimeTypes.includes(file.type)) {
    const ext = file.name.split('.').pop()?.toLowerCase();
    return {
      valid: false,
      message: `Format "${ext || file.name}" tidak didukung. Gunakan: JPG, PNG, GIF, atau WebP.`,
    };
  }
  return { valid: true };
}

export default { IMAGE_UPLOAD, validateImageFile };
