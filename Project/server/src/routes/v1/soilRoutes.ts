import { Router } from 'express';
import { analyzeSoil } from '../../controllers/soilController.js';

const router = Router();

router.post('/analyze', analyzeSoil);

export default router;
