import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const page = Math.max(1, parseInt(String(req.query.page)) || 1);
  const pageSize = parseInt(String(req.query.pageSize)) || 20;
  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    prisma.contact.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.contact.count(),
  ]);

  return res.json({
    results: items.map((c) => ({ ...c, id: String(c.id), is_read: c.isRead })),
    pagination: { page, pageSize, total, pageCount: Math.ceil(total / pageSize) },
  });
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { isRead } = req.body;
  const item = await prisma.contact.update({
    where: { id },
    data: { ...(isRead !== undefined && { isRead }) },
  });
  return res.json({ ...item, id: String(item.id) });
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  await prisma.contact.delete({ where: { id } }).catch(() => null);
  return res.status(204).send();
});

export default router;
