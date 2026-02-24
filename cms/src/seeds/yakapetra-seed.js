'use strict';

/**
 * Script untuk mengisi data awal (seed) Yakapetra.
 * Jalankan dengan: node src/seeds/yakapetra-seed.js
 * (setelah Strapi berjalan dan admin pertama sudah dibuat)
 *
 * Atau gunakan Strapi bootstrap di src/index.js
 */

const categories = [
  { name: 'Pendidikan', slug: 'pendidikan' },
  { name: 'Pembinaan', slug: 'pembinaan' },
  { name: 'Kegiatan',  slug: 'kegiatan'  },
  { name: 'Berita',    slug: 'berita'    },
  { name: 'Program',   slug: 'program'   },
  { name: 'Prestasi',  slug: 'prestasi'  },
];

const programs = [
  {
    title: 'Bimbingan Pendidikan Anak Binaan',
    slug: 'bimbingan-pendidikan',
    description: 'Program bimbingan belajar dan pendampingan akademik bagi anak-anak binaan Yakapetra.',
    icon: '📚',
    beneficiaries: '100+ anak binaan',
    location: 'Klender, Jakarta Timur',
    order: 1,
  },
  {
    title: 'Hari Anak Nasional 2025',
    slug: 'hari-anak-nasional-2025',
    description: 'Program bimbingan khusus dalam rangka memperingati Hari Anak Nasional 2025.',
    icon: '🎉',
    beneficiaries: 'Seluruh anak binaan',
    location: 'Jakarta Timur',
    order: 2,
  },
  {
    title: 'Pembinaan Karakter & Kerohanian',
    slug: 'pembinaan-karakter',
    description: 'Pembinaan nilai-nilai karakter mulia dan kerohanian bagi anak-anak binaan Yakapetra.',
    icon: '✝️',
    beneficiaries: '100+ anak binaan',
    location: 'Klender, Jakarta Timur',
    order: 3,
  },
];

module.exports = { categories, programs };
