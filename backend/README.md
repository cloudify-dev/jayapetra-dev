# Backend CMS Yakapetra

Express + TypeScript + Prisma (MySQL) + JWT + bcrypt

## Setup

1. **Install dependencies**
   ```bash
   cd backend && npm install
   ```

2. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env - set DATABASE_URL, JWT secrets, dll
   ```

3. **Generate Prisma client** (tabel sudah ada di yayasan_cms, jangan db:push)
   ```bash
   npm run db:generate
   ```

4. **Jalankan**
   ```bash
   npm run dev
   ```

   Server: http://localhost:4000

## API

### Public (untuk website)
- `GET /api/articles` - Daftar artikel published
- `GET /api/articles?filters[slug][$eq]=...` - Artikel by slug
- `GET /api/programs` - Daftar program
- `GET /api/galleries` - Daftar galeri
- `GET /api/categories` - Kategori
- `GET /api/about-page` - Halaman tentang
- `POST /api/contacts` - Submit form kontak

### Admin (butuh token)
- `POST /api/admin/auth/login` - Login
- `POST /api/admin/auth/refresh` - Refresh token
- `GET /api/admin/auth/me` - Profile
- `GET/POST/PUT/DELETE /api/admin/articles`
- `GET/POST/PUT/DELETE /api/admin/programs`
- `GET/POST/PUT/DELETE /api/admin/galleries`
- `GET/PUT /api/admin/about`
- `GET /api/admin/contacts`
- `POST /api/admin/upload` - Upload file
