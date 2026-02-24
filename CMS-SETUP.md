# Panduan Setup CMS Baru (Database yayasan_cms)

Backend menggunakan **database yayasan_cms yang sudah ada** (dari Strapi). Tidak perlu buat database baru.

## Struktur

```
yayasan-website/
├── backend/     # API Express + TypeScript + Prisma
├── admin/       # Panel admin React + TypeScript
└── src/         # Website publik
```

## 1. Database

Gunakan database **yayasan_cms** yang sudah di-import dari `yayasan_cms.sql`.

Pastikan MySQL jalan (MAMP: port **8889**).

## 2. Setup Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
- `DATABASE_URL` — sesuaikan: `mysql://root:root@localhost:8889/yayasan_cms` (MAMP default)
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` — ganti dengan string acak minimal 32 karakter

```bash
npm install
npm run db:generate   # Hanya generate Prisma client (JANGAN db:push — tabel sudah ada)
npm run dev
```

Backend: http://localhost:4000

## 3. Login Admin

Pakai **akun admin yang sudah ada** di database (dari Strapi):
- Email: `wahyuadi2189@gmail.com` (atau email admin Anda)
- Password: sama seperti di Strapi

## 4. Setup Admin Panel

```bash
cd admin
npm install
npm run dev
```

Admin: http://localhost:5174

## 5. Upload File

File baru disimpan di `cms/public/uploads` (sama seperti Strapi) agar file lama tetap bisa diakses.

## 6. Website Publik

`.env` di root:
```
VITE_API_URL=http://localhost:4000
```

```bash
npm run dev
```

## 7. Tabel Baru (Site Settings, Rekening Donasi, Pengurus)

Backend memakai tabel tambahan yang **tidak** dari Strapi. Buat sekali dengan salah satu cara:

**Opsi A – MySQL CLI**
```bash
mysql -u root -p yayasan_cms < backend/prisma/migrations/20260219000000_add_cms_models/migration.sql
```

**Opsi B – phpMyAdmin**  
Buka database `yayasan_cms` → SQL → paste isi file `backend/prisma/migrations/20260219000000_add_cms_models/migration.sql` → Jalankan.

Setelah itu jalankan `npx prisma generate` di folder `backend` (sudah termasuk model baru).

## Penting

- **Jangan** jalankan `db:push` atau `db:migrate` untuk tabel Strapi yang sudah ada
- Untuk tabel baru (site_settings, donation_accounts, board_members) gunakan migration SQL di atas sekali saja
- Hanya `npm run db:generate` untuk generate Prisma client
