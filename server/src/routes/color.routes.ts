import { Router } from 'express';
import * as colorController from '../controllers/color.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', colorController.getAllColors);

// Protected admin routes
router.use(authenticate, isAdmin);
router.post('/', colorController.createColor);
router.delete('/:id', colorController.deleteColor);

export default router;
