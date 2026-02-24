import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../../middleware/auth.js';
import { getMediaForEntity, setMediaForEntity } from '../../utils/media.js';

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

router.get('/', async (_req, res) => {
  let item = await prisma.aboutPage.findFirst();
  if (!item) {
    item = await prisma.aboutPage.create({
      data: { vision: '', mission: '' },
    });
  }
  const heroImage = await getMediaForEntity('api::about-page.about-page', 'hero_image', item.id);
  return res.json({
    id: String(item.id),
    vision: item.vision,
    mission: item.mission,
    values: item.values,
    history: item.history,
    establishedYear: item.establishedYear,
    publishedAt: item.publishedAt,
    heroImageId: heroImage?.id ? String(heroImage.id) : null,
    heroImage: heroImage ? { id: String(heroImage.id), url: heroImage.url } : null,
  });
});

router.put('/', async (req, res) => {
  const { vision, mission, values, history, establishedYear, heroImageId, published } = req.body;
  let item = await prisma.aboutPage.findFirst();
  if (!item) {
    item = await prisma.aboutPage.create({
      data: { vision: vision || '', mission: mission || '' },
    });
  }

  const data: Record<string, unknown> = {};
  if (vision !== undefined) data.vision = vision;
  if (mission !== undefined) data.mission = mission;
  if (values !== undefined) data.values = values;
  if (history !== undefined) data.history = history;
  if (establishedYear !== undefined) data.establishedYear = establishedYear;
  if (published !== undefined) {
    data.publishedAt = published ? new Date() : null;
  }
  if (heroImageId !== undefined) {
    await setMediaForEntity('api::about-page.about-page', 'hero_image', item.id, heroImageId ? parseInt(heroImageId) : null);
  }

  const updated = await prisma.aboutPage.update({ where: { id: item.id }, data });
  const heroImage = await getMediaForEntity('api::about-page.about-page', 'hero_image', updated.id);
  return res.json({
    id: String(updated.id),
    vision: updated.vision,
    mission: updated.mission,
    values: updated.values,
    history: updated.history,
    establishedYear: updated.establishedYear,
    publishedAt: updated.publishedAt,
    heroImageId: heroImage?.id ? String(heroImage.id) : null,
    heroImage: heroImage ? { id: String(heroImage.id), url: heroImage.url } : null,
  });
});

export default router;
