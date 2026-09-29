import { Router } from 'express';
import { 
  createDiagnosis, 
  getDiagnostics, 
  getDiagnosticById, 
  reviewDiagnosis 
} from '../../controllers/diagnosticController.js';
import { authenticateToken, requireRole } from '../../middleware/authMiddleware.js';
import { uploadMiddleware, validateFileMagicBytes } from '../../middleware/fileUpload.js';

const router = Router();

// Primary multimodal diagnosis upload
router.post(
  '/',
  authenticateToken,
  uploadMiddleware,
  validateFileMagicBytes,
  createDiagnosis
);

// Diagnostic records history
router.get('/', authenticateToken, getDiagnostics);

// Single diagnostic record
router.get('/:id', authenticateToken, getDiagnosticById);

// Agronomist review endpoint
router.patch(
  '/:id/review',
  authenticateToken,
  requireRole(['AGRONOMIST', 'ADMIN']),
  reviewDiagnosis
);

export default router;
