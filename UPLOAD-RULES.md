# Aturan Upload File & Gambar

Dokumen ini merangkum batasan upload yang dipakai di backend dan admin, agar pengguna tidak salah format/ukuran.

---

## Galeri (foto album)

| Aturan        | Nilai                    | Keterangan                          |
|---------------|--------------------------|-------------------------------------|
| **Format**    | JPG, PNG, GIF, WebP      | Tipe MIME: `image/jpeg`, `image/png`, `image/gif`, `image/webp` |
| **Ukuran**    | Maks. **5 MB** per file  | Backend menolak file lebih besar    |
| **Field name**| `file`                   | FormData key saat POST ke backend   |
| **Endpoint**  | `POST /api/admin/upload` | Per file (single upload), auth wajib |

**Tidak didukung:** PDF, DOC, HEIC, BMP, TIFF, dll. Jika perlu jenis file lain, ubah `backend/src/routes/upload.ts` (fileFilter & limits) dan `src/constants/upload.js`.

---

## Sinkronisasi frontend–backend

- Konstanta aturan dipusatkan di **`src/constants/upload.js`** (max size, MIME, `accept`, validasi).
- Backend mengikuti batas yang sama di **`backend/src/routes/upload.ts`**.
- Pesan error backend (ukuran/tipe) dalam bahasa Indonesia; frontend menampilkan rekomendasi di form upload.

---

## Menambah tipe upload baru

1. Tentukan format & ukuran max di backend (multer `limits`, `fileFilter`).
2. Tambah konstanta dan validasi di `src/constants/upload.js` (atau buat objek baru, mis. `DOCUMENT_UPLOAD`).
3. Tampilkan rekomendasi di halaman admin yang memakai upload tersebut.
4. Update dokumen ini.
