import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

router.get('/', async (_req, res) => {
  const items = await prisma.donationAccount.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  return res.json({ data: items });
});

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  const item = await prisma.donationAccount.findUnique({ where: { id } });
  if (!item) return res.status(404).json({ error: 'Not found' });
  return res.json({ data: item });
});

router.post('/', async (req, res) => {
  const body = req.body?.data ?? req.body;
  const { bankCode, bankName, accountNo, accountName, description, sortOrder } = body;
  if (!bankName || !accountNo || !accountName) {
    return res.status(400).json({ error: 'bankName, accountNo, accountName required' });
  }
  const item = await prisma.donationAccount.create({
    data: {
      bankCode: bankCode && String(bankCode).trim() ? String(bankCode).trim() : null,
      bankName,
      accountNo: String(accountNo),
      accountName,
      description: description ?? null,
      sortOrder: sortOrder != null ? Number(sortOrder) : 0,
    },
  });
  return res.status(201).json({ data: item });
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  const body = req.body?.data ?? req.body;
  const { bankCode, bankName, accountNo, accountName, description, sortOrder } = body;
  const item = await prisma.donationAccount.update({
    where: { id },
    data: {
      ...(bankCode !== undefined && { bankCode: bankCode && String(bankCode).trim() ? String(bankCode).trim() : null }),
      ...(bankName !== undefined && { bankName }),
      ...(accountNo !== undefined && { accountNo: String(accountNo) }),
      ...(accountName !== undefined && { accountName }),
      ...(description !== undefined && { description }),
      ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
    },
  });
  return res.json({ data: item });
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  await prisma.donationAccount.delete({ where: { id } }).catch(() => null);
  return res.status(204).send();
});

export default router;
