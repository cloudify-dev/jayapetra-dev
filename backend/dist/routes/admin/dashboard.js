import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../../middleware/auth.js';
const router = Router();
const prisma = new PrismaClient();
router.use(authMiddleware);
router.get('/stats', async (_req, res) => {
    const [articles, programs, galleries, contacts] = await Promise.all([
        prisma.article.count(),
        prisma.program.count(),
        prisma.gallery.count(),
        prisma.contact.count(),
    ]);
    return res.json({
        articles,
        programs,
        galleries,
        contacts,
    });
});
export default router;
