import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../../middleware/auth.js';
import { getMediaListForEntity, setMediaListForEntity } from '../../utils/media.js';
const router = Router();
const prisma = new PrismaClient();
router.use(authMiddleware);
router.get('/', async (req, res) => {
    const page = Math.max(1, parseInt(String(req.query.page)) || 1);
    const pageSize = parseInt(String(req.query.pageSize)) || 20;
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
        prisma.gallery.findMany({
            skip,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.gallery.count(),
    ]);
    const withImages = await Promise.all(items.map(async (g) => {
        const images = await getMediaListForEntity('api::gallery.gallery', 'images', g.id);
        return {
            id: String(g.id),
            title: g.title,
            description: g.description,
            eventDate: g.eventDate,
            publishedAt: g.publishedAt,
            createdAt: g.createdAt,
            updatedAt: g.updatedAt,
            images: images.map((i) => ({ id: String(i.id), url: i.url })),
        };
    }));
    return res.json({
        results: withImages,
        pagination: { page, pageSize, total, pageCount: Math.ceil(total / pageSize) },
    });
});
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid id' });
    const item = await prisma.gallery.findUnique({ where: { id } });
    if (!item)
        return res.status(404).json({ error: 'Not found' });
    const images = await getMediaListForEntity('api::gallery.gallery', 'images', item.id);
    const { id: _id, ...rest } = item;
    return res.json({
        ...rest,
        id: String(_id),
        images: images.map((i) => ({ id: String(i.id), url: i.url })),
    });
});
router.post('/', async (req, res) => {
    const { title, description, eventDate, imageIds } = req.body;
    if (!title)
        return res.status(400).json({ error: 'title required' });
    const gallery = await prisma.gallery.create({
        data: {
            title,
            description: description || null,
            eventDate: eventDate ? new Date(eventDate) : null,
        },
    });
    if (Array.isArray(imageIds) && imageIds.length > 0) {
        await setMediaListForEntity('api::gallery.gallery', 'images', gallery.id, imageIds.map((x) => parseInt(x)));
    }
    const images = await getMediaListForEntity('api::gallery.gallery', 'images', gallery.id);
    const { id: _id, ...rest } = gallery;
    return res.status(201).json({
        ...rest,
        id: String(_id),
        images: images.map((i) => ({ id: String(i.id), url: i.url })),
    });
});
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { title, description, eventDate, imageIds, published } = req.body;
    const existing = await prisma.gallery.findUnique({ where: { id } });
    if (!existing)
        return res.status(404).json({ error: 'Not found' });
    const data = {};
    if (title !== undefined)
        data.title = title;
    if (description !== undefined)
        data.description = description;
    if (eventDate !== undefined)
        data.eventDate = eventDate ? new Date(eventDate) : null;
    if (published !== undefined)
        data.publishedAt = published ? new Date() : null;
    await prisma.gallery.update({ where: { id }, data });
    if (Array.isArray(imageIds)) {
        await setMediaListForEntity('api::gallery.gallery', 'images', id, imageIds.map((x) => parseInt(x)));
    }
    const item = await prisma.gallery.findUnique({ where: { id } });
    const images = await getMediaListForEntity('api::gallery.gallery', 'images', id);
    if (!item)
        return res.status(404).json({ error: 'Not found' });
    const { id: _id, ...rest } = item;
    return res.json({
        ...rest,
        id: String(_id),
        images: images.map((i) => ({ id: String(i.id), url: i.url })),
    });
});
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    await prisma.fileRelatedMph.deleteMany({
        where: { relatedId: id, relatedType: 'api::gallery.gallery' },
    });
    await prisma.gallery.delete({ where: { id } }).catch(() => null);
    return res.status(204).send();
});
router.post('/:id/publish', async (req, res) => {
    const id = parseInt(req.params.id);
    await prisma.gallery.update({ where: { id }, data: { publishedAt: new Date() } });
    return res.json({ ok: true });
});
export default router;
