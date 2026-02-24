/**
 * Script: Set Public Permissions untuk Strapi API
 *
 * Jalankan SETELAH membuat akun admin pertama di http://localhost:1337/admin
 *
 * Cara pakai:
 *   1. Buka http://localhost:1337/admin → buat akun admin
 *   2. Masuk → Settings → API Tokens → Create new token
 *      - Name: "setup-script"
 *      - Type: Full access
 *      - Copy token-nya
 *   3. Jalankan: STRAPI_TOKEN=<token> node scripts/set-permissions.js
 *
 * Atau lebih mudah: set permission manual di
 *   Settings > Users & Permissions > Roles > Public
 */

const axios = require('axios');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const TOKEN      = process.env.STRAPI_TOKEN;

if (!TOKEN) {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║          SET PUBLIC PERMISSIONS — CARA MANUAL                ║
╚══════════════════════════════════════════════════════════════╝

1. Buka: http://localhost:1337/admin
2. Login dengan akun admin Anda
3. Pergi ke: Settings → Users & Permissions Plugin → Roles → Public

4. Aktifkan permission berikut:

   📰 Article (Artikel/Berita)
      ✅ find    ✅ findOne

   📋 Program
      ✅ find    ✅ findOne

   🖼️  Gallery (Galeri)
      ✅ find    ✅ findOne

   🏷️  Category (Kategori)
      ✅ find    ✅ findOne

   📄 About-page (Tentang Kami)
      ✅ find

   📬 Contact (Pesan Kontak)
      ✅ create

5. Klik Save

Setelah itu, API bisa diakses di:
   http://localhost:1337/api/articles
   http://localhost:1337/api/programs
   http://localhost:1337/api/galleries
   http://localhost:1337/api/categories
   http://localhost:1337/api/about-page
  `);
  process.exit(0);
}

// Jika token tersedia, set permission via API
async function setPermissions() {
  const client = axios.create({
    baseURL: STRAPI_URL,
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  // Ambil role public
  const { data: roles } = await client.get('/api/users-permissions/roles');
  const publicRole = roles.roles.find((r) => r.type === 'public');
  
  if (!publicRole) {
    console.error('Role public tidak ditemukan');
    process.exit(1);
  }

  // Ambil permissions yang ada
  const { data: roleData } = await client.get(`/api/users-permissions/roles/${publicRole.id}`);
  const permissions = roleData.role.permissions;

  // Enable permissions untuk content types
  const toEnable = {
    'api::article.article':      ['find', 'findOne'],
    'api::program.program':      ['find', 'findOne'],
    'api::gallery.gallery':      ['find', 'findOne'],
    'api::category.category':    ['find', 'findOne'],
    'api::about-page.about-page': ['find'],
    'api::contact.contact':      ['create'],
  };

  Object.entries(toEnable).forEach(([contentType, actions]) => {
    if (permissions[contentType]) {
      actions.forEach((action) => {
        if (permissions[contentType].controllers) {
          const ctKey = contentType.split('.')[1];
          if (permissions[contentType].controllers[ctKey]) {
            permissions[contentType].controllers[ctKey][action] = { enabled: true };
          }
        }
      });
    }
  });

  await client.put(`/api/users-permissions/roles/${publicRole.id}`, {
    permissions,
  });

  console.log('✅ Public permissions berhasil diset!');
}

setPermissions().catch(console.error);
