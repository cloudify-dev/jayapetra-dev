import { Router } from 'express';
import authRoutes from '../auth.js';
import articlesRoutes from './articles.js';
import categoriesRoutes from './categories.js';
import programsRoutes from './programs.js';
import galleriesRoutes from './galleries.js';
import contactsRoutes from './contacts.js';
import aboutRoutes from './about.js';
import dashboardRoutes from './dashboard.js';
import uploadRoutes from '../upload.js';
import siteSettingsRoutes from './site-settings.js';
import donationAccountsRoutes from './donation-accounts.js';
import boardMembersRoutes from './board-members.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/articles', articlesRoutes);
router.use('/categories', categoriesRoutes);
router.use('/programs', programsRoutes);
router.use('/galleries', galleriesRoutes);
router.use('/contacts', contactsRoutes);
router.use('/about', aboutRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/upload', uploadRoutes);
router.use('/site-settings', siteSettingsRoutes);
router.use('/donation-accounts', donationAccountsRoutes);
router.use('/board-members', boardMembersRoutes);

export default router;
