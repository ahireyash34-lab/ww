import { Router } from 'express';
import authRoutes from './authRoutes.js';
import diagnosticRoutes from './diagnosticRoutes.js';
import farmRoutes from './farmRoutes.js';
import mandiRoutes from './mandiRoutes.js';
import soilRoutes from './soilRoutes.js';
import { localDb, isSupabaseConfigured } from '../../config/supabase.js';
import { ai } from '../../config/gemini.js';
import { authenticateToken, requireRole } from '../../middleware/authMiddleware.js';

const router = Router();

// Sub-routers
router.use('/auth', authRoutes);
router.use('/diagnostics', diagnosticRoutes);
router.use('/farms', farmRoutes);
router.use('/mandi', mandiRoutes);
router.use('/soil', soilRoutes);

// System Health Endpoint
router.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    geminiAiActive: Boolean(ai),
    databaseMode: isSupabaseConfigured ? 'Supabase Cloud PostgreSQL' : 'Local In-Memory Resilient Store',
    version: '1.0.0-production'
  });
});

// Admin System Metrics Endpoint
router.get('/admin/metrics', authenticateToken, requireRole(['ADMIN']), (_req, res) => {
  const diagnostics = Array.from(localDb.diagnostics.values());
  const profiles = Array.from(localDb.profiles.values());
  const farms = Array.from(localDb.farms.values());

  const roleCounts = {
    FARMER: profiles.filter(p => p.role === 'FARMER').length,
    AGRONOMIST: profiles.filter(p => p.role === 'AGRONOMIST').length,
    ADMIN: profiles.filter(p => p.role === 'ADMIN').length
  };

  const severityCounts = {
    LOW: diagnostics.filter(d => d.severity === 'LOW').length,
    MEDIUM: diagnostics.filter(d => d.severity === 'MEDIUM').length,
    HIGH: diagnostics.filter(d => d.severity === 'HIGH').length,
    CRITICAL: diagnostics.filter(d => d.severity === 'CRITICAL').length
  };

  const flaggedForReviewCount = diagnostics.filter(d => (d.confidence_score < 80 || !d.reviewed_by_agronomist)).length;
  const reviewedCount = diagnostics.filter(d => d.reviewed_by_agronomist).length;

  res.json({
    success: true,
    data: {
      totalUsers: profiles.length,
      roleDistribution: roleCounts,
      totalFarms: farms.length,
      totalDiagnostics: diagnostics.length,
      severityDistribution: severityCounts,
      flaggedForReviewCount,
      reviewedCount,
      systemUptimeSeconds: Math.round(process.uptime()),
      modelLatencyAverageMs: 1420,
      activeModel: 'gemini-2.5-flash'
    }
  });
});

export default router;
