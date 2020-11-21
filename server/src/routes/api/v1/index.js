import authRoutes from './auth';
import userRoutes from './user';
import timelineRoutes from './timeline';
import categoriesRoutes from './categories';

import { Router } from 'express';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/timeline', timelineRoutes);
router.use('/categories', categoriesRoutes);

export default router;
