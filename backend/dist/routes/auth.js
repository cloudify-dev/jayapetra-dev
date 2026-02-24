import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';
import { config } from '../config.js';
const router = Router();
const prisma = new PrismaClient();
const { accessSecret, refreshSecret, accessExpiresIn, refreshExpiresIn } = config.jwt;
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }
        const user = await prisma.adminUser.findFirst({
            where: { email, blocked: false },
        });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const valid = await bcrypt.compare(password, user.password || '');
        if (!valid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const name = [user.firstname, user.lastname].filter(Boolean).join(' ') || user.username || 'Admin';
        const accessToken = jwt.sign({ userId: String(user.id), email: user.email, type: 'access' }, accessSecret, { expiresIn: accessExpiresIn });
        const refreshToken = jwt.sign({ userId: String(user.id), email: user.email, type: 'refresh' }, refreshSecret, { expiresIn: refreshExpiresIn });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/api/admin/auth',
        });
        return res.json({
            data: {
                token: accessToken,
                refreshToken,
                user: {
                    id: String(user.id),
                    email: user.email,
                    name,
                },
            },
        });
    }
    catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Login failed' });
    }
});
router.post('/refresh', async (req, res) => {
    try {
        const refresh = req.cookies?.refreshToken || req.body?.refreshToken;
        if (!refresh) {
            return res.status(401).json({ error: 'Refresh token required' });
        }
        const decoded = jwt.verify(refresh, refreshSecret);
        if (decoded.type !== 'refresh') {
            return res.status(401).json({ error: 'Invalid token type' });
        }
        const user = await prisma.adminUser.findFirst({
            where: { id: parseInt(decoded.userId) },
        });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        const accessToken = jwt.sign({ userId: String(user.id), email: user.email, type: 'access' }, accessSecret, { expiresIn: accessExpiresIn });
        return res.json({ data: { token: accessToken } });
    }
    catch {
        return res.status(401).json({ error: 'Invalid refresh token' });
    }
});
router.get('/me', authMiddleware, async (req, res) => {
    const { userId } = req.user;
    const user = await prisma.adminUser.findFirst({
        where: { id: parseInt(userId) },
    });
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    const name = [user.firstname, user.lastname].filter(Boolean).join(' ') || user.username || 'Admin';
    return res.json({
        data: { id: String(user.id), email: user.email, name },
    });
});
router.post('/logout', (req, res) => {
    res.clearCookie('refreshToken', { path: '/api/admin/auth' });
    return res.json({ message: 'Logged out' });
});
export default router;
