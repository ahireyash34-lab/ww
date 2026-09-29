import { Request, Response } from 'express';
import { SoilAnalysisSchema } from '../../../shared/validators.js';
import { calculateSoilNutrientBalance } from '../services/soilService.js';

export async function analyzeSoil(req: Request, res: Response): Promise<void> {
  try {
    const validated = SoilAnalysisSchema.parse(req.body);
    const result = calculateSoilNutrientBalance(validated);

    res.json({
      success: true,
      data: result,
      input: validated
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Soil analysis failed', errors: error.errors });
  }
}
