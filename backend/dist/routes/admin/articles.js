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
    const pageSize = Math.min(50, Math.max(1, parseInt(String(req.query.pageSize)) || 10));
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
        prisma.article.findMany({
            skip,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
            include: {
                categoryLnk: { include: { category: true } },
            },
        }),
        prisma.article.count(),
    ]);
    const withMedia = await Promise.all(items.map(async (a) => {
        const category = a.categoryLnk[0]?.category;
        const thumbnail = await getMediaForEntity('api::article.article', 'thumbnail', a.id);
        return {
            id: String(a.id),
            title: a.title,
            slug: a.slug,
            excerpt: a.excerpt,
            content: a.content,
            publishedAt: a.publishedAt,
            createdAt: a.createdAt,
            updatedAt: a.updatedAt,
            categoryId: category?.id ? String(category.id) : null,
            category: category ? { id: String(category.id), name: category.name, slug: category.slug } : null,
            thumbnailId: thumbnail?.id ? String(thumbnail.id) : null,
            thumbnail: thumbnail ? { id: String(thumbnail.id), url: thumbnail.url } : null,
        };
    }));
    return res.json({
        results: withMedia,
        pagination: { page, pageSize, total, pageCount: Math.ceil(total / pageSize) },
    });
});
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid id' });
    const item = await prisma.article.findUnique({
        where: { id },
        include: { categoryLnk: { include: { category: true } } },
    });
    if (!item)
        return res.status(404).json({ error: 'Not found' });
    const category = item.categoryLnk[0]?.category;
    const thumbnail = await getMediaForEntity('api::article.article', 'thumbnail', item.id);
    return res.json({
        id: String(item.id),
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        publishedAt: item.publishedAt,
        createdAt: item.createdAt,
        categoryId: category?.id ? String(category.id) : null,
        category,
        thumbnailId: thumbnail?.id ? String(thumbnail.id) : null,
        thumbnail: thumbnail ? { id: String(thumbnail.id), url: thumbnail.url } : null,
    });
});
router.post('/', async (req, res) => {
    const { title, excerpt, content, categoryId, thumbnailId } = req.body;
    if (!title || !excerpt || !content) {
        return res.status(400).json({ error: 'title, excerpt, content required' });
    }
    const slug = slugify(title) + '-' + Date.now().toString(36);
    const item = await prisma.article.create({
        data: { title, slug, excerpt, content },
        include: { categoryLnk: { include: { category: true } } },
    });
    if (categoryId) {
        await prisma.articlesCategoryLnk.create({
            data: { articleId: item.id, categoryId: parseInt(categoryId) },
        });
    }
    if (thumbnailId) {
        await setMediaForEntity('api::article.article', 'thumbnail', item.id, parseInt(thumbnailId));
    }
    const category = (await prisma.articlesCategoryLnk.findFirst({ where: { articleId: item.id }, include: { category: true } }))?.category;
    const thumbnail = await getMediaForEntity('api::article.article', 'thumbnail', item.id);
    return res.status(201).json({
        id: String(item.id),
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        publishedAt: item.publishedAt,
        categoryId: category?.id ? String(category.id) : null,
        category,
        thumbnailId: thumbnail?.id ? String(thumbnail.id) : null,
        thumbnail,
    });
});
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid id' });
    const { title, excerpt, content, categoryId, thumbnailId, published } = req.body;
    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing)
        return res.status(404).json({ error: 'Not found' });
    const data = {};
    if (title !== undefined)
        data.title = title;
    if (excerpt !== undefined)
        data.excerpt = excerpt;
    if (content !== undefined)
        data.content = content;
    if (published !== undefined) {
        data.publishedAt = published ? new Date() : null;
    }
    await prisma.article.update({ where: { id }, data });
    if (categoryId !== undefined) {
        await prisma.articlesCategoryLnk.deleteMany({ where: { articleId: id } });
        if (categoryId) {
            await prisma.articlesCategoryLnk.create({
                data: { articleId: id, categoryId: parseInt(categoryId) },
            });
        }
    }
    if (thumbnailId !== undefined) {
        await setMediaForEntity('api::article.article', 'thumbnail', id, thumbnailId ? parseInt(thumbnailId) : null);
    }
    const item = await prisma.article.findUnique({
        where: { id },
        include: { categoryLnk: { include: { category: true } } },
    });
    const category = item?.categoryLnk[0]?.category;
    const thumbnail = await getMediaForEntity('api::article.article', 'thumbnail', id);
    return res.json({
        id: String(item.id),
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        publishedAt: item.publishedAt,
        categoryId: category?.id ? String(category.id) : null,
        category,
        thumbnailId: thumbnail?.id ? String(thumbnail.id) : null,
        thumbnail,
    });
});
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid id' });
    await prisma.articlesCategoryLnk.deleteMany({ where: { articleId: id } });
    await prisma.fileRelatedMph.deleteMany({
        where: { relatedId: id, relatedType: 'api::article.article' },
    });
    await prisma.article.delete({ where: { id } }).catch(() => null);
    return res.status(204).send();
});
router.post('/:id/publish', async (req, res) => {
    const id = parseInt(req.params.id);
    await prisma.article.update({
        where: { id },
        data: { publishedAt: new Date() },
    });
    return res.json({ ok: true });
});
router.post('/:id/unpublish', async (req, res) => {
    const id = parseInt(req.params.id);
    await prisma.article.update({
        where: { id },
        data: { publishedAt: null },
    });
    return res.json({ ok: true });
});
export default router;
