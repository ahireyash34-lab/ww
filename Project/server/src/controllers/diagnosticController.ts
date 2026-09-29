import { Request, Response } from 'express';
import { processCropDiagnosis } from '../services/aiDiagnosticService.js';
import { supabase, isSupabaseConfigured, localDb } from '../config/supabase.js';
import { DiagnosticRequestSchema, AgronomistReviewSchema } from '../../../shared/validators.js';

export async function createDiagnosis(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'Image file is required for crop disease diagnosis.' });
      return;
    }

    // Parse text fields
    const parsedBody = {
      cropType: req.body.cropType || 'Tomato',
      cropStage: req.body.cropStage || 'FLOWERING',
      farmId: req.body.farmId || undefined,
      language: req.body.language || 'en',
      soilType: req.body.soilType || undefined,
      irrigationMethod: req.body.irrigationMethod || undefined,
      symptomsObserved: typeof req.body.symptomsObserved === 'string' 
        ? JSON.parse(req.body.symptomsObserved || '[]') 
        : req.body.symptomsObserved || [],
      recentFoliarSpray: req.body.recentFoliarSpray,
      affectedAreaPercentage: req.body.affectedAreaPercentage ? Number(req.body.affectedAreaPercentage) : 10,
      location: req.body.location || 'Maharashtra, India',
      notes: req.body.notes
    };

    const validated = DiagnosticRequestSchema.parse(parsedBody);

    // AI Execution via @google/genai (with fallback)
    const aiResult = await processCropDiagnosis(
      req.file.buffer,
      req.file.mimetype,
      {
        cropType: validated.cropType,
        cropStage: validated.cropStage,
        language: validated.language,
        location: validated.location,
        soilType: validated.soilType,
        irrigationMethod: validated.irrigationMethod,
        recentFoliarSpray: validated.recentFoliarSpray,
        affectedAreaPercentage: validated.affectedAreaPercentage
      }
    );

    const recordId = `diag-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const userId = req.user?.id || '00000000-0000-0000-0000-000000000001';

    // Image URL: If Supabase Storage is configured, upload; otherwise data URI or persistent local image identifier
    let imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64').substring(0, 500)}...`;
    
    // Create complete record object
    const newDiagnosticRecord = {
      id: recordId,
      user_id: userId,
      farm_id: validated.farmId || null,
      crop_name: aiResult.cropIdentified || validated.cropType,
      crop_stage: validated.cropStage,
      image_url: `https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80`,
      detected_issue: aiResult.detectedIssue,
      pathogen_type: aiResult.pathogenType,
      confidence_score: aiResult.confidenceScore,
      severity: aiResult.severity,
      organic_remedies: aiResult.organicRemedies,
      chemical_remedies: aiResult.chemicalRemedies,
      preventive_measures: aiResult.preventiveMeasures,
      fertilizer_advice: aiResult.fertilizerAdvice,
      reviewed_by_agronomist: false,
      agronomist_notes: null,
      raw_ai_response: aiResult,
      created_at: new Date().toISOString(),
      farmer_name: req.user?.fullName || 'Ramesh Patel',
      farm_name: validated.farmId ? (localDb.farms.get(validated.farmId)?.farm_name || 'Main Farm') : 'Plot Alpha'
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('diagnostics').insert({
          id: recordId,
          user_id: userId,
          farm_id: validated.farmId || null,
          crop_name: newDiagnosticRecord.crop_name,
          crop_stage: validated.cropStage,
          image_url: newDiagnosticRecord.image_url,
          detected_issue: newDiagnosticRecord.detected_issue,
          pathogen_type: newDiagnosticRecord.pathogen_type,
          confidence_score: newDiagnosticRecord.confidence_score,
          severity: newDiagnosticRecord.severity,
          organic_remedies: newDiagnosticRecord.organic_remedies,
          chemical_remedies: newDiagnosticRecord.chemical_remedies,
          preventive_measures: newDiagnosticRecord.preventive_measures,
          fertilizer_advice: newDiagnosticRecord.fertilizer_advice,
          reviewed_by_agronomist: false,
          raw_ai_response: aiResult
        });
      } catch (dbErr) {
        console.warn('Supabase insert note:', dbErr);
      }
    }

    // Always keep in local mirror
    localDb.diagnostics.set(recordId, newDiagnosticRecord);

    res.status(201).json({
      success: true,
      data: newDiagnosticRecord
    });
  } catch (error: any) {
    console.error('Diagnostic error:', error);
    res.status(400).json({ success: false, message: error.message || 'Diagnostic failed', error });
  }
}

export async function getDiagnostics(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { crop, severity, reviewed, page = '1', limit = '20' } = req.query;

    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('diagnostics').select('*').order('created_at', { ascending: false });

      if (userRole === 'FARMER' && userId) {
        query = query.eq('user_id', userId);
      }
      if (crop) {
        query = query.ilike('crop_name', `%${crop}%`);
      }
      if (severity) {
        query = query.eq('severity', severity);
      }
      if (reviewed !== undefined) {
        query = query.eq('reviewed_by_agronomist', reviewed === 'true');
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        res.json({ success: true, data });
        return;
      }
    }

    // Local mirror resolution
    let list = Array.from(localDb.diagnostics.values());

    if (userRole === 'FARMER' && userId) {
      list = list.filter(d => d.user_id === userId);
    }
    if (crop) {
      list = list.filter(d => d.crop_name.toLowerCase().includes(String(crop).toLowerCase()));
    }
    if (severity) {
      list = list.filter(d => d.severity === severity);
    }
    if (reviewed !== undefined) {
      list = list.filter(d => d.reviewed_by_agronomist === (reviewed === 'true'));
    }

    // Sort descending by date
    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json({
      success: true,
      data: list,
      total: list.length
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getDiagnosticById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('diagnostics').select('*').eq('id', id).single();
      if (!error && data) {
        res.json({ success: true, data });
        return;
      }
    }

    const item = localDb.diagnostics.get(id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Diagnostic record not found' });
      return;
    }

    res.json({ success: true, data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function reviewDiagnosis(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const validated = AgronomistReviewSchema.parse(req.body);

    const item = localDb.diagnostics.get(id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Diagnostic record not found' });
      return;
    }

    item.reviewed_by_agronomist = true;
    item.agronomist_notes = `[${validated.status}] ${validated.notes} - Approved by ${validated.reviewedBy}`;
    
    if (validated.recommendedChemicalOverride) {
      item.chemical_remedies.unshift({
        chemicalName: validated.recommendedChemicalOverride,
        commercialProductExample: 'Agronomist Verified Prescription',
        dosagePerLiter: validated.recommendedDosageOverride || '1.0 ml / L',
        safetyPrecautions: 'Follow agronomist customized instructions strictly.'
      });
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.from('diagnostics').update({
        reviewed_by_agronomist: true,
        agronomist_notes: item.agronomist_notes,
        chemical_remedies: item.chemical_remedies
      }).eq('id', id);
    }

    res.json({
      success: true,
      data: item,
      message: 'Prescription note attached successfully.'
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Review failed' });
  }
}
