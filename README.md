# Yayasan Cahaya Harapan Indonesia — Website

Website resmi yayasan sosial berbasis **React + Vite** dengan **Strapi** sebagai headless CMS.

---

## Arsitektur Proyek

```
yayasan-website/
├── src/                        # Source code React frontend
│   ├── components/
│   │   ├── layout/             # Navbar, Footer, Layout wrapper
│   │   ├── ui/                 # Komponen reusable (Button, Card, Loading, dll)
│   │   └── sections/           # Section halaman beranda (Hero, Program, News, dst)
│   ├── pages/                  # Halaman-halaman utama
│   ├── services/
│   │   └── api.js              # Semua pemanggilan API ke Strapi
│   ├── hooks/
│   │   └── useFetch.js         # Custom hook untuk data fetching
│   ├── context/
│   │   └── AppContext.jsx      # State global (notifikasi, mobile menu)
│   ├── utils/
│   │   └── helpers.js          # Fungsi utilitas (formatDate, truncate, dll)
│   ├── App.jsx                 # Router dan provider utama
│   └── main.jsx                # Entry point React
├── cms/                        # Folder Strapi CMS (diinstall terpisah)
│   └── SETUP.md                # Panduan setup Strapi lengkap
├── .env.example                # Template konfigurasi environment
└── README.md
```

---

## Halaman yang Tersedia

| Halaman        | URL              | Deskripsi                                    |
|----------------|------------------|----------------------------------------------|
| Beranda        | `/`              | Hero, statistik, program, berita, CTA        |
| Tentang Kami   | `/tentang`       | Visi-misi, timeline sejarah, pengurus        |
| Program        | `/program`       | Daftar semua program yayasan                 |
| Berita         | `/berita`        | Blog/artikel dengan fitur pencarian          |
| Detail Berita  | `/berita/:slug`  | Konten artikel lengkap                       |
| Galeri         | `/galeri`        | Grid foto dengan lightbox                    |
| Kontak         | `/kontak`        | Form kontak + informasi kantor               |

---

## Cara Menjalankan (Development)

### Prasyarat
- Node.js versi **20 atau 22** (bukan 23/24/25)
- MAMP (untuk MySQL jika menggunakan Strapi)

### 1. Frontend React

```bash
cd yayasan-website
npm install
npm run dev
```

Frontend berjalan di: **http://localhost:5173**

> **Catatan:** Website bisa langsung dijalankan tanpa Strapi. Data fallback (statis)
> akan ditampilkan secara otomatis.

### 2. CMS Strapi (opsional)

Lihat panduan lengkap di: `cms/SETUP.md`

---

## Environment Variables

Salin `.env.example` ke `.env` dan isi:

```env
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_TOKEN=your_api_token_here
```

---

## Tech Stack

| Layer     | Teknologi              |
|-----------|------------------------|
| Frontend  | React 19 + Vite        |
| Styling   | Tailwind CSS v3        |
| Routing   | React Router v6        |
| HTTP      | Axios                  |
| Icons     | React Icons            |
| CMS       | Strapi v5              |
| Database  | MySQL (via MAMP)       |

---

## Fitur Unggulan

- ✅ Responsive (mobile-first design)
- ✅ Data fallback otomatis saat Strapi offline
- ✅ Galeri dengan lightbox navigasi
- ✅ Form kontak dengan validasi
- ✅ Animasi counter statistik
- ✅ Search berita real-time
- ✅ Navbar sticky dengan efek scroll
- ✅ Loading & error state yang informatif
