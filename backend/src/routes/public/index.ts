import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { config } from '../../config.js';
import { getMediaForEntity, getMediaListForEntity } from '../../utils/media.js';

const router = Router();
const prisma = new PrismaClient();
const baseUrl = config.baseUrl;

function mediaUrl(url: string | null | undefined) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${baseUrl}${url}`;
}

// Articles (published only - publishedAt IS NOT NULL)
router.get('/articles', async (req, res) => {
  const filters = (req.query.filters as Record<string, unknown>) || {};
  const slugFilter = filters?.slug as Record<string, string> | undefined;
  const slug = slugFilter?.['$eq'];
  const sort = String(req.query.sort || 'publishedAt:desc');
  const [field, order] = sort.split(':');
  const page = Math.max(1, parseInt(String(req.query['pagination[page]'])) || 1);
  const pageSize = 25;
  const skip = (page - 1) * pageSize;

  const where = {
    publishedAt: { not: null },
    ...(slug && { slug }),
  };

  if (slug) {
    const item = await prisma.article.findFirst({
      where,
      include: { categoryLnk: { include: { category: true } } },
    });
    if (!item) return res.status(404).json({ error: 'Not found' });
    const category = item.categoryLnk[0]?.category;
    const thumbnail = await getMediaForEntity('api::article.article', 'thumbnail', item.id);
    const data = [{
      id: item.id,
      documentId: item.documentId,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content,
      publishedAt: item.publishedAt,
      createdAt: item.createdAt,
      category: category ? { id: category.id, name: category.name, slug: category.slug } : null,
      thumbnail: thumbnail ? { url: mediaUrl(thumbnail.url) } : null,
    }];
    return res.json({ data, meta: {} });
  }

  const [items, total] = await Promise.all([
    prisma.article.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { [field === 'publishedAt' ? 'publishedAt' : 'createdAt']: order === 'asc' ? 'asc' : 'desc' },
      include: { categoryLnk: { include: { category: true } } },
    }),
    prisma.article.count({ where }),
  ]);

  const data = await Promise.all(
    items.map(async (a) => {
      const category = a.categoryLnk[0]?.category;
      const thumbnail = await getMediaForEntity('api::article.article', 'thumbnail', a.id);
      return {
        id: a.id,
        documentId: a.documentId,
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        content: a.content,
        publishedAt: a.publishedAt,
        createdAt: a.createdAt,
        category: category ? { id: category.id, name: category.name, slug: category.slug } : null,
        thumbnail: thumbnail ? { url: mediaUrl(thumbnail.url) } : null,
      };
    })
  );

  return res.json({
    data,
    meta: { pagination: { page, pageSize, total, pageCount: Math.ceil(total / pageSize) } },
  });
});

// Programs (published only)
router.get('/programs', async (req, res) => {
  const filters = (req.query.filters as Record<string, unknown>) || {};
  const slugFilter = filters?.slug as Record<string, string> | undefined;
  const slug = slugFilter?.['$eq'];
  if (slug) {
    const item = await prisma.program.findFirst({
      where: { slug, publishedAt: { not: null } },
    });
    if (!item) return res.status(404).json({ error: 'Not found' });
    const image = await getMediaForEntity('api::program.program', 'image', item.id);
    return res.json({
      data: [{
        id: item.id,
        title: item.title,
        slug: item.slug,
        description: item.description,
        content: item.content,
        icon: item.icon,
        beneficiaries: item.beneficiaries,
        location: item.location,
        image: image ? { url: mediaUrl(image.url) } : null,
      }],
    });
  }
  const items = await prisma.program.findMany({
    where: { publishedAt: { not: null } },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
  const data = await Promise.all(
    items.map(async (p) => {
      const image = await getMediaForEntity('api::program.program', 'image', p.id);
      return {
        id: p.id,
        documentId: p.documentId,
        title: p.title,
        slug: p.slug,
        description: p.description,
        content: p.content,
        icon: p.icon,
        beneficiaries: p.beneficiaries,
        location: p.location,
        order: p.order ?? 0,
        image: image ? { url: mediaUrl(image.url) } : null,
      };
    })
  );
  return res.json({ data });
});

// Galleries (published only)
router.get('/galleries', async (_req, res) => {
  const items = await prisma.gallery.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: 'desc' },
  });
  const data = await Promise.all(
    items.map(async (g) => {
      const images = await getMediaListForEntity('api::gallery.gallery', 'images', g.id);
      return {
        id: g.id,
        documentId: g.documentId,
        title: g.title,
        description: g.description,
        eventDate: g.eventDate,
        images: images.map((i) => ({ url: mediaUrl(i.url) })),
      };
    })
  );
  return res.json({ data });
});

// Categories
router.get('/categories', async (_req, res) => {
  const items = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { articleLnk: true } } },
  });
  const data = items.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    articles: c._count.articleLnk,
  }));
  return res.json({ data });
});

// About page
router.get('/about-page', async (_req, res) => {
  const item = await prisma.aboutPage.findFirst({
    where: { publishedAt: { not: null } },
  });
  if (!item) {
    return res.json({ data: null, meta: {} });
  }
  const heroImage = await getMediaForEntity('api::about-page.about-page', 'hero_image', item.id);
  const data = {
    id: item.id,
    vision: item.vision,
    mission: item.mission,
    values: item.values,
    history: item.history,
    establishedYear: item.establishedYear,
    heroImage: heroImage ? { url: mediaUrl(heroImage.url) } : null,
  };
  return res.json({ data, meta: {} });
});

// Contact form
router.post('/contacts', async (req, res) => {
  const body = req.body?.data || req.body;
  const { name, email, phone, subject, message } = body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'name, email, subject, message required' });
  }
  const item = await prisma.contact.create({
    data: { name, email, phone: phone || null, subject, message },
  });
  return res.status(201).json({ data: item });
});

// Statistic
router.get('/statistic', async (_req, res) => {
  const [articles, programs] = await Promise.all([
    prisma.article.count({ where: { publishedAt: { not: null } } }),
    prisma.program.count({ where: { publishedAt: { not: null } } }),
  ]);
  const data = {
    articles,
    programs,
    beneficiaries: 100,
  };
  return res.json({ data, meta: {} });
});

// Site settings (singleton, public read)
router.get('/site-settings', async (_req, res) => {
  let row = await prisma.siteSetting.findFirst({ orderBy: { id: 'asc' } });
  if (!row) {
    return res.json({
      data: {
        heroText: 'Selamat Datang di Yakapetra',
        tagline: 'Yayasan Kasih Penerus Transformasi',
        footerText: null,
        whatsappNumber: '6285287402336',
        ctaCopy: 'Mari Berkolaborasi',
      },
      meta: {},
    });
  }
  return res.json({
    data: {
      heroText: row.heroText,
      tagline: row.tagline,
      footerText: row.footerText,
      whatsappNumber: row.whatsappNumber,
      ctaCopy: row.ctaCopy,
    },
    meta: {},
  });
});

// Donation accounts (public read)
router.get('/donation-accounts', async (_req, res) => {
  const items = await prisma.donationAccount.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  return res.json({
    data: items.map((a) => ({
      id: a.id,
      bankCode: a.bankCode,
      bankName: a.bankName,
      accountNo: a.accountNo,
      accountName: a.accountName,
      description: a.description,
    })),
    meta: {},
  });
});

// Board members (active only, public read)
router.get('/board-members', async (_req, res) => {
  const items = await prisma.boardMember.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
  });
  return res.json({
    data: items.map((m) => ({
      id: m.id,
      name: m.name,
      position: m.position,
      description: m.description,
      photoUrl: m.photoUrl,
    })),
    meta: {},
  });
});

export default router;
