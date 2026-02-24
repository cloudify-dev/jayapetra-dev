import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';
import { config } from '../config.js';
import fs from 'fs';

const router = Router();
const prisma = new PrismaClient();

if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, config.uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const hash = crypto.createHash('md5').update(uuidv4()).digest('hex').slice(0, 16);
    const name = path.basename(file.originalname, ext).replace(/\s/g, '_') || 'file';
    cb(null, `${name}_${hash}${ext}`);
  },
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = /image\/(jpeg|png|gif|webp)/;

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    const allowed = ALLOWED_MIME.test(file.mimetype);
    if (!allowed) return cb(new Error('INVALID_TYPE'));
    cb(null, true);
  },
});

router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Tidak ada file yang diunggah. Pilih satu file gambar.' });
  }
  const urlPath = `/uploads/${req.file.filename}`;
  const hash = path.basename(req.file.filename, path.extname(req.file.filename)).split('_').pop() || uuidv4();
  // Insert ke tabel files (format Strapi)
  const file = await prisma.file.create({
    data: {
      name: req.file.originalname,
      hash,
      ext: path.extname(req.file.filename),
      mime: req.file.mimetype,
      size: req.file.size,
      url: urlPath,
    },
  });
  const fullUrl = `${config.baseUrl}${urlPath}`;
  return res.json({
    data: {
      id: file.id,
      url: fullUrl,
      filename: req.file.filename,
    },
  });
});

// Pesan error multer: ukuran/tipe file
router.use((err: Error & { code?: string }, _req: Request, res: Response, next: NextFunction) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'Ukuran file terlalu besar. Maksimal 5 MB per file. Pilih gambar yang lebih kecil.',
    });
  }
  if (err.message === 'INVALID_TYPE') {
    return res.status(400).json({
      error: 'Format file tidak didukung. Gunakan hanya: JPG, PNG, GIF, atau WebP.',
    });
  }
  next(err);
});

export default router;
