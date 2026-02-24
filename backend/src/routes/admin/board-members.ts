import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

router.get('/', async (_req, res) => {
  const items = await prisma.boardMember.findMany({
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
  });
  return res.json({ data: items });
});

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  const item = await prisma.boardMember.findUnique({ where: { id } });
  if (!item) return res.status(404).json({ error: 'Not found' });
  return res.json({ data: item });
});

router.post('/', async (req, res) => {
  const body = req.body?.data ?? req.body;
  const { name, position, description, photoUrl, sortOrder, isActive } = body;
  if (!name || !position) {
    return res.status(400).json({ error: 'name, position required' });
  }
  const item = await prisma.boardMember.create({
    data: {
      name,
      position,
      description: description ?? null,
      photoUrl: photoUrl ?? null,
      sortOrder: sortOrder != null ? Number(sortOrder) : 0,
      isActive: isActive !== false,
    },
  });
  return res.status(201).json({ data: item });
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  const body = req.body?.data ?? req.body;
  const { name, position, description, photoUrl, sortOrder, isActive } = body;
  const item = await prisma.boardMember.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(position !== undefined && { position }),
      ...(description !== undefined && { description }),
      ...(photoUrl !== undefined && { photoUrl }),
      ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
      ...(isActive !== undefined && { isActive: Boolean(isActive) }),
    },
  });
  return res.json({ data: item });
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  await prisma.boardMember.delete({ where: { id } }).catch(() => null);
  return res.status(204).send();
});

export default router;
