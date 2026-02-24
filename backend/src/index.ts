import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import adminRoutes from './routes/admin/index.js';
import publicRoutes from './routes/public/index.js';
import { config } from './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:4000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:4000',
  ],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// Static files (uploads) - pakai folder Strapi cms/public/uploads
app.use('/uploads', express.static(config.uploadDir));

// Public API (for main website)
app.use('/api', publicRoutes);

// Admin API
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));

// Satu port: layani build frontend (root/dist) kalau folder ada
const rootDir = path.join(__dirname, '..', '..');
const distPath = path.join(rootDir, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
  if (fs.existsSync(distPath)) {
    console.log(`Frontend (build) dilayani dari port yang sama. Buka http://localhost:${config.port}`);
  }
});
