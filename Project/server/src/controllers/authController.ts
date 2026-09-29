import { Request, Response } from 'express';
import { supabase, isSupabaseConfigured, localDb } from '../config/supabase.js';
import { UserSignupSchema, UserLoginSchema } from '../../../shared/validators.js';

export async function signup(req: Request, res: Response): Promise<void> {
  try {
    const validated = UserSignupSchema.parse(req.body);

    if (isSupabaseConfigured && supabase) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: {
          data: {
            full_name: validated.fullName,
            role: validated.role
          }
        }
      });

      if (authError || !authData.user) {
        res.status(400).json({ success: false, message: authError?.message || 'Signup failed' });
        return;
      }

      // Upsert into public.profiles
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: authData.user.id,
        full_name: validated.fullName,
        phone_number: validated.phoneNumber,
        role: validated.role,
        preferred_language: validated.preferredLanguage,
        state: validated.state,
        district: validated.district,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      if (profileError) {
        console.warn('Profile sync note:', profileError.message);
      }

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: authData.user.id,
            email: validated.email,
            full_name: validated.fullName,
            role: validated.role,
            preferred_language: validated.preferredLanguage
          },
          session: authData.session
        }
      });
      return;
    }

    // Local / In-Memory Mock Auth
    const newId = `usr-${Date.now()}`;
    const newProfile = {
      id: newId,
      email: validated.email,
      full_name: validated.fullName,
      phone_number: validated.phoneNumber,
      role: validated.role,
      preferred_language: validated.preferredLanguage,
      state: validated.state || 'Maharashtra',
      district: validated.district || 'Nashik',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    localDb.profiles.set(newId, newProfile);

    res.status(201).json({
      success: true,
      data: {
        user: newProfile,
        token: `demo-${validated.role.toLowerCase()}-token`
      }
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Validation error', errors: error.errors });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const validated = UserLoginSchema.parse(req.body);

    if (isSupabaseConfigured && supabase) {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password
      });

      if (authError || !authData.user) {
        res.status(401).json({ success: false, message: authError?.message || 'Invalid credentials' });
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      res.json({
        success: true,
        data: {
          user: {
            id: authData.user.id,
            email: authData.user.email,
            full_name: profile?.full_name || 'Farmer',
            role: profile?.role || 'FARMER',
            preferred_language: profile?.preferred_language || 'en'
          },
          token: authData.session?.access_token
        }
      });
      return;
    }

    // Local authentication lookup
    let foundProfile = Array.from(localDb.profiles.values()).find(p => p.email.toLowerCase() === validated.email.toLowerCase());
    
    // Auto-login for demo personas if standard demo email or any email
    if (!foundProfile) {
      if (validated.email.includes('agronomist')) {
        foundProfile = localDb.profiles.get('00000000-0000-0000-0000-000000000002');
      } else if (validated.email.includes('admin')) {
        foundProfile = localDb.profiles.get('00000000-0000-0000-0000-000000000003');
      } else {
        foundProfile = localDb.profiles.get('00000000-0000-0000-0000-000000000001');
      }
    }

    res.json({
      success: true,
      data: {
        user: foundProfile,
        token: `demo-${foundProfile.role.toLowerCase()}-token`
      }
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Validation error' });
  }
}

export async function getMe(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  res.json({
    success: true,
    data: req.user
  });
}
