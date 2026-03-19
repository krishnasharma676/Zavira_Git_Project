import { Router } from 'express';
import { authenticate, isAdmin } from '../middleware/auth.middleware';
import { upload } from '../middleware/multer.middleware';
import { createVariants, getVariants, deleteVariant, updateSizeStock } from '../controllers/variant.controller';

const router = Router();

// Public
router.get('/product/:productId', getVariants);

// Admin
router.post('/product/:productId', authenticate, isAdmin, upload.any(), createVariants);
router.delete('/:variantId', authenticate, isAdmin, deleteVariant);
router.patch('/sizes/:sizeId/stock', authenticate, isAdmin, updateSizeStock);

export default router;
