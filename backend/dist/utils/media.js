import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const TYPE_FIELD = {
    articleThumbnail: ['api::article.article', 'thumbnail'],
    programImage: ['api::program.program', 'image'],
    galleryImages: ['api::gallery.gallery', 'images'],
    aboutHero: ['api::about-page.about-page', 'hero_image'],
};
export async function getMediaForEntity(relatedType, field, relatedId) {
    const link = await prisma.fileRelatedMph.findFirst({
        where: { relatedId, relatedType, field },
        orderBy: { order: 'asc' },
    });
    if (!link?.fileId)
        return null;
    const file = await prisma.file.findUnique({ where: { id: link.fileId } });
    if (!file?.url)
        return null;
    return { id: file.id, url: file.url };
}
export async function getMediaListForEntity(relatedType, field, relatedId) {
    const links = await prisma.fileRelatedMph.findMany({
        where: { relatedId, relatedType, field },
        orderBy: { order: 'asc' },
    });
    const files = await prisma.file.findMany({
        where: { id: { in: links.map((l) => l.fileId).filter(Boolean) } },
    });
    const byId = Object.fromEntries(files.map((f) => [f.id, f]));
    return links
        .map((l) => byId[l.fileId])
        .filter(Boolean)
        .map((f) => ({ id: f.id, url: f.url || '' }));
}
export async function setMediaForEntity(relatedType, field, relatedId, fileId) {
    await prisma.fileRelatedMph.deleteMany({
        where: { relatedId, relatedType, field },
    });
    if (fileId) {
        await prisma.fileRelatedMph.create({
            data: { fileId, relatedId, relatedType, field, order: 0 },
        });
    }
}
export async function setMediaListForEntity(relatedType, field, relatedId, fileIds) {
    await prisma.fileRelatedMph.deleteMany({
        where: { relatedId, relatedType, field },
    });
    for (let i = 0; i < fileIds.length; i++) {
        await prisma.fileRelatedMph.create({
            data: { fileId: fileIds[i], relatedId, relatedType, field, order: i },
        });
    }
}
