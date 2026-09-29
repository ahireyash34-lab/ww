import { Router } from 'express';
import { createFarm, getFarms } from '../../controllers/farmController.js';
import { authenticateToken } from '../../middleware/authMiddleware.js';

const router = Router();

router.post('/', authenticateToken, createFarm);
router.get('/', authenticateToken, getFarms);

export default router;
