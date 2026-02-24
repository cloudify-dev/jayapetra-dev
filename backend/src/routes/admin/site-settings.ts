import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

// GET single (singleton)
router.get('/', async (_req, res) => {
  let row = await prisma.siteSetting.findFirst({ orderBy: { id: 'asc' } });
  if (!row) {
    row = await prisma.siteSetting.create({
      data: {
        heroText: 'Selamat Datang di Yakapetra',
        tagline: 'Yayasan Kasih Penerus Transformasi',
        ctaCopy: 'Mari Berkolaborasi',
        whatsappNumber: '6285287402336',
      },
    });
  }
  return res.json({ data: row });
});

// PUT update
router.put('/', async (req, res) => {
  const body = req.body?.data ?? req.body;
  const { heroText, tagline, footerText, whatsappNumber, ctaCopy } = body;
  let row = await prisma.siteSetting.findFirst({ orderBy: { id: 'asc' } });
  if (!row) {
    row = await prisma.siteSetting.create({
      data: {
        heroText: heroText ?? 'Selamat Datang di Yakapetra',
        tagline: tagline ?? 'Yayasan Kasih Penerus Transformasi',
        footerText: footerText ?? null,
        whatsappNumber: whatsappNumber ?? '6285287402336',
        ctaCopy: ctaCopy ?? 'Mari Berkolaborasi',
      },
    });
    return res.json({ data: row });
  }
  row = await prisma.siteSetting.update({
    where: { id: row.id },
    data: {
      ...(heroText !== undefined && { heroText }),
      ...(tagline !== undefined && { tagline }),
      ...(footerText !== undefined && { footerText }),
      ...(whatsappNumber !== undefined && { whatsappNumber }),
      ...(ctaCopy !== undefined && { ctaCopy }),
    },
  });
  return res.json({ data: row });
});

export default router;
