import jwt from 'jsonwebtoken';
import { config } from '../config.js';
const { accessSecret } = config.jwt;
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Token required' });
    }
    try {
        const decoded = jwt.verify(token, accessSecret);
        if (decoded.type !== 'access') {
            return res.status(401).json({ error: 'Invalid token type' });
        }
        req.user = decoded;
        next();
    }
    catch {
        return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' });
    }
};
