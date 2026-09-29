import { Router } from 'express';
import { getMandiData, getTrends } from '../../controllers/mandiController.js';

const router = Router();

router.get('/', getMandiData);
router.get('/trends', getTrends);

export default router;
