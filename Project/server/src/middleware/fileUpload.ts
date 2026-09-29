import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

// Store in memory for direct Google Gen AI inlineData processing & Supabase storage upload
const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are permitted.'));
    }
  }
}).single('image');

/**
 * Validates file buffer magic bytes to ensure the payload is truly an image
 */
export function validateFileMagicBytes(req: Request, res: Response, next: NextFunction): void {
  if (!req.file || !req.file.buffer) {
    next();
    return;
  }

  const buffer = req.file.buffer;
  if (buffer.length < 12) {
    res.status(400).json({ success: false, message: 'Uploaded file is corrupted or too small' });
    return;
  }

  const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
  const isWebp = (
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 && // 'RIFF'
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50 // 'WEBP'
  );

  if (!isJpeg && !isPng && !isWebp) {
    res.status(400).json({
      success: false,
      message: 'Security validation failed: File binary header does not match approved JPEG, PNG, or WebP magic bytes.'
    });
    return;
  }

  next();
}
