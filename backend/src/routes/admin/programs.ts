import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../../middleware/auth.js';
import { getMediaForEntity, setMediaForEntity } from '../../utils/media.js';
import { slugify } from '../../utils/slug.js';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const page = Math.max(1, parseInt(String(req.query.page)) || 1);
  const pageSize = Math.min(50, parseInt(String(req.query.pageSize)) || 20);
  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    prisma.program.findMany({
      skip,
      take: pageSize,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    }),
    prisma.program.count(),
  ]);

  const withMedia = await Promise.all(
    items.map(async (p) => {
      const image = await getMediaForEntity('api::program.program', 'image', p.id);
      return {
        id: String(p.id),
        title: p.title,
        slug: p.slug,
        description: p.description,
        content: p.content,
        icon: p.icon,
        beneficiaries: p.beneficiaries,
        location: p.location,
        order: p.order ?? 0,
        publishedAt: p.publishedAt,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        imageId: image?.id ? String(image.id) : null,
        image: image ? { id: String(image.id), url: image.url } : null,
      };
    })
  );

  return res.json({
    results: withMedia,
    pagination: { page, pageSize, total, pageCount: Math.ceil(total / pageSize) },
  });
});

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  const item = await prisma.program.findUnique({ where: { id } });
  if (!item) return res.status(404).json({ error: 'Not found' });
  const image = await getMediaForEntity('api::program.program', 'image', item.id);
  const { id: _id, ...rest } = item;
  return res.json({
    ...rest,
    id: String(_id),
    order: item.order ?? 0,
    imageId: image?.id ? String(image.id) : null,
    image: image ? { id: String(image.id), url: image.url } : null,
  });
});

router.post('/', async (req, res) => {
  const { title, description, content, icon, beneficiaries, location, order, imageId } = req.body;
  if (!title || !description) return res.status(400).json({ error: 'title, description required' });
  const slug = slugify(title) + '-' + Date.now().toString(36);

  const item = await prisma.program.create({
    data: {
      title,
      slug,
      description,
      content: content || null,
      icon: icon || null,
      beneficiaries: beneficiaries || null,
      location: location || null,
      order: order ?? 0,
    },
  });

  if (imageId) {
    await setMediaForEntity('api::program.program', 'image', item.id, parseInt(imageId));
  }

  const image = await getMediaForEntity('api::program.program', 'image', item.id);
  const { id: _id, ...rest } = item;
  return res.status(201).json({
    ...rest,
    id: String(_id),
    imageId: image?.id ? String(image.id) : null,
    image,
  });
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;
  const existing = await prisma.program.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ error: 'Not found' });

  const data: Record<string, unknown> = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.description !== undefined) data.description = body.description;
  if (body.content !== undefined) data.content = body.content;
  if (body.icon !== undefined) data.icon = body.icon;
  if (body.beneficiaries !== undefined) data.beneficiaries = body.beneficiaries;
  if (body.location !== undefined) data.location = body.location;
  if (body.order !== undefined) data.order = body.order;
  if (body.published !== undefined) {
    data.publishedAt = body.published ? new Date() : null;
  }
  if (body.imageId !== undefined) {
    await setMediaForEntity('api::program.program', 'image', id, body.imageId ? parseInt(body.imageId) : null);
  }

  const item = await prisma.program.update({ where: { id }, data });
  const image = await getMediaForEntity('api::program.program', 'image', id);
  const { id: _id, ...rest } = item;
  return res.json({
    ...rest,
    id: String(_id),
    imageId: image?.id ? String(image.id) : null,
    image,
  });
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  await prisma.fileRelatedMph.deleteMany({
    where: { relatedId: id, relatedType: 'api::program.program' },
  });
  await prisma.program.delete({ where: { id } }).catch(() => null);
  return res.status(204).send();
});

router.post('/:id/publish', async (req, res) => {
  const id = parseInt(req.params.id);
  await prisma.program.update({ where: { id }, data: { publishedAt: new Date() } });
  return res.json({ ok: true });
});

export default router;
