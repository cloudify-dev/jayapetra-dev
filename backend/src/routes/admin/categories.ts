import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../../middleware/auth.js';
import { slugify } from '../../utils/slug.js';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

router.get('/', async (_req, res) => {
  const items = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { articleLnk: true } } },
  });
  const data = items.map((c) => ({
    id: String(c.id),
    name: c.name,
    slug: c.slug,
    _count: c._count,
  }));
  return res.json({ data });
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const slug = slugify(name);
  const item = await prisma.category.create({ data: { name, slug } });
  return res.status(201).json({ id: String(item.id), name: item.name, slug: item.slug });
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ error: 'Not found' });
  const slug = name ? slugify(name) : existing.slug;
  const item = await prisma.category.update({
    where: { id },
    data: { ...(name && { name, slug }) },
  });
  return res.json({ id: String(item.id), name: item.name, slug: item.slug });
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  await prisma.articlesCategoryLnk.deleteMany({ where: { categoryId: id } });
  await prisma.category.delete({ where: { id } }).catch(() => null);
  return res.status(204).send();
});

export default router;
