import { Request, Response, NextFunction } from 'express';
import { supabase, isSupabaseConfigured, localDb } from '../config/supabase.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'FARMER' | 'AGRONOMIST' | 'ADMIN';
  fullName: string;
  preferredLanguage: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function authenticateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  // If Supabase is configured and we have a valid token
  if (isSupabaseConfigured && supabase && token && token !== 'demo-farmer-token' && token !== 'demo-agronomist-token' && token !== 'demo-admin-token') {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        res.status(401).json({ success: false, message: 'Invalid or expired session token' });
        return;
      }

      // Fetch user profile from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      req.user = {
        id: user.id,
        email: user.email || '',
        role: profile?.role || 'FARMER',
        fullName: profile?.full_name || user.user_metadata?.full_name || 'Farmer',
        preferredLanguage: profile?.preferred_language || 'en'
      };
      next();
      return;
    } catch (err) {
      console.error('Auth verification error:', err);
    }
  }

  // Local/Demo Auth Resolution
  if (token === 'demo-agronomist-token') {
    const agronomist = localDb.profiles.get('00000000-0000-0000-0000-000000000002');
    req.user = {
      id: agronomist.id,
      email: agronomist.email,
      role: agronomist.role,
      fullName: agronomist.full_name,
      preferredLanguage: agronomist.preferred_language
    };
    next();
    return;
  }

  if (token === 'demo-admin-token') {
    const admin = localDb.profiles.get('00000000-0000-0000-0000-000000000003');
    req.user = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      fullName: admin.full_name,
      preferredLanguage: admin.preferred_language
    };
    next();
    return;
  }

  // Default to Ramesh Patel (Farmer) for development / demo ease if token is demo-farmer-token or unauthenticated
  const farmer = localDb.profiles.get('00000000-0000-0000-0000-000000000001');
  req.user = {
    id: farmer.id,
    email: farmer.email,
    role: farmer.role,
    fullName: farmer.full_name,
    preferredLanguage: farmer.preferred_language
  };
  next();
}

export function requireRole(allowedRoles: ('FARMER' | 'AGRONOMIST' | 'ADMIN')[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of [${allowedRoles.join(', ')}] roles`
      });
      return;
    }
    next();
  };
}
