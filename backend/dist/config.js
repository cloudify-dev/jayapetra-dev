import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const config = {
    port: parseInt(process.env.PORT || '4000', 10),
    databaseUrl: process.env.DATABASE_URL,
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET || 'access-secret-change-in-production',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-change-in-production',
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    // Pakai folder uploads Strapi (cms/public/uploads) agar file lama tetap bisa diakses
    uploadDir: process.env.UPLOAD_DIR
        ? (path.isAbsolute(process.env.UPLOAD_DIR) ? process.env.UPLOAD_DIR : path.resolve(__dirname, '..', process.env.UPLOAD_DIR))
        : path.resolve(__dirname, '..', '..', 'cms', 'public', 'uploads'),
    baseUrl: process.env.BASE_URL || 'http://localhost:4000',
};
