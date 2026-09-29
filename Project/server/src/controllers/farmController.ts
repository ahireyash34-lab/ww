import { Request, Response } from 'express';
import { supabase, isSupabaseConfigured, localDb } from '../config/supabase.js';
import { FarmRegistrationSchema } from '../../../shared/validators.js';

export async function createFarm(req: Request, res: Response): Promise<void> {
  try {
    const validated = FarmRegistrationSchema.parse(req.body);
    const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';

    const farmId = `farm-${Date.now()}`;
    const newFarm = {
      id: farmId,
      user_id: userId,
      farm_name: validated.farmName,
      acreage: validated.acreage,
      soil_type: validated.soilType,
      irrigation_type: validated.irrigationType,
      state: validated.state,
      district: validated.district,
      latitude: validated.latitude || 19.9975,
      longitude: validated.longitude || 73.7898,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('farms').insert({
        user_id: userId,
        farm_name: validated.farmName,
        acreage: validated.acreage,
        soil_type: validated.soilType,
        irrigation_type: validated.irrigationType,
        state: validated.state,
        district: validated.district,
        latitude: validated.latitude,
        longitude: validated.longitude
      }).select().single();

      if (!error && data) {
        localDb.farms.set(data.id, data);
        res.status(201).json({ success: true, data });
        return;
      }
    }

    localDb.farms.set(farmId, newFarm);
    res.status(201).json({ success: true, data: newFarm });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Farm registration failed', errors: error.errors });
  }
}

export async function getFarms(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('farms').select('*');
      if (userRole === 'FARMER' && userId) {
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        res.json({ success: true, data });
        return;
      }
    }

    let farms = Array.from(localDb.farms.values());
    if (userRole === 'FARMER' && userId) {
      farms = farms.filter(f => f.user_id === userId);
    }

    res.json({ success: true, data: farms });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
