import { Router } from 'express';
import { seedData } from '../controllers/seed.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, isAdmin, seedData);

export default router;
