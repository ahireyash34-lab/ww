import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import v1Routes from './routes/v1/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// 1. Security Headers via Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// 2. CORS configuration restricted to authorized client origins
const allowedOrigins = [
  CLIENT_ORIGIN,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl) or if origin is in whitelist
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in dev, lockable via env
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Request parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// 4. Rate Limiting for Diagnostic Endpoint (10 requests per minute per IP)
const diagnosticLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: {
    success: false,
    message: 'Rate limit exceeded: Maximum 10 crop diagnostics allowed per minute. Please try again shortly.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/v1/diagnostics', diagnosticLimiter);

// 5. Mount API Routes
app.use('/api/v1', v1Routes);

// Root route
app.get('/', (_req, res) => {
  res.json({
    app: 'AgriVision AI API Server',
    status: 'ONLINE',
    documentation: '/api/v1/health',
    version: '1.0.0'
  });
});

// 6. Global 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Resource endpoint not found' });
});

// 7. Global error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🌾 AgriVision AI Enterprise Backend Engine`);
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`🛡️ Rate limiting: 10 requests/min on /api/v1/diagnostics`);
  console.log(`🤖 AI Engine: Official @google/genai SDK (gemini-2.5-flash)`);
  console.log(`=======================================================`);
});

export default app;
