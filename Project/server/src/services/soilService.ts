import { SoilAnalysisInput } from '../../../shared/validators.js';
import { SoilAnalysisResult } from '../../../shared/types.js';

export function calculateSoilNutrientBalance(input: SoilAnalysisInput): SoilAnalysisResult {
  const { nitrogenPpm, phosphorusPpm, potassiumPpm, phLevel, ecValue, cropTarget, farmSizeAcres = 1 } = input;

  // 1. Nutrient Level Classifications
  let nitrogenRating: 'DEFICIENT' | 'OPTIMAL' | 'EXCESS' = 'OPTIMAL';
  if (nitrogenPpm < 140) nitrogenRating = 'DEFICIENT';
  else if (nitrogenPpm > 280) nitrogenRating = 'EXCESS';

  let phosphorusRating: 'DEFICIENT' | 'OPTIMAL' | 'EXCESS' = 'OPTIMAL';
  if (phosphorusPpm < 15) phosphorusRating = 'DEFICIENT';
  else if (phosphorusPpm > 35) phosphorusRating = 'EXCESS';

  let potassiumRating: 'DEFICIENT' | 'OPTIMAL' | 'EXCESS' = 'OPTIMAL';
  if (potassiumPpm < 120) potassiumRating = 'DEFICIENT';
  else if (potassiumPpm > 250) potassiumRating = 'EXCESS';

  // 2. pH Classification
  let phClassification: 'STRONGLY_ACIDIC' | 'MODERATELY_ACIDIC' | 'NEUTRAL' | 'ALKALINE' = 'NEUTRAL';
  if (phLevel < 5.5) phClassification = 'STRONGLY_ACIDIC';
  else if (phLevel < 6.5) phClassification = 'MODERATELY_ACIDIC';
  else if (phLevel <= 7.8) phClassification = 'NEUTRAL';
  else phClassification = 'ALKALINE';

  // 3. Salinity Classification (EC dS/m)
  let salinityRisk: 'LOW' | 'MODERATE' | 'HIGH' = 'LOW';
  if (ecValue > 2.5) salinityRisk = 'HIGH';
  else if (ecValue > 1.2) salinityRisk = 'MODERATE';

  // 4. Calculate Fertilizer Dosing Requirements (kg per acre baseline scaled by farm size)
  // Baseline crop nutrient demands (N-P-K in kg/acre)
  const cropBaselines: Record<string, { n: number; p: number; k: number }> = {
    tomato: { n: 60, p: 40, k: 50 },
    cotton: { n: 50, p: 25, k: 30 },
    wheat: { n: 48, p: 24, k: 20 },
    rice: { n: 40, p: 20, k: 25 },
    chilli: { n: 55, p: 35, k: 45 },
    onion: { n: 45, p: 30, k: 40 },
    sugarcane: { n: 100, p: 40, k: 60 }
  };

  const cropKey = cropTarget.toLowerCase();
  const baseline = cropBaselines[cropKey] || { n: 50, p: 25, k: 30 };

  // Deficit adjustments based on soil test ratings
  const nMultiplier = nitrogenRating === 'DEFICIENT' ? 1.3 : nitrogenRating === 'EXCESS' ? 0.6 : 1.0;
  const pMultiplier = phosphorusRating === 'DEFICIENT' ? 1.35 : phosphorusRating === 'EXCESS' ? 0.5 : 1.0;
  const kMultiplier = potassiumRating === 'DEFICIENT' ? 1.25 : potassiumRating === 'EXCESS' ? 0.6 : 1.0;

  const targetN = baseline.n * nMultiplier;
  const targetP = baseline.p * pMultiplier;
  const targetK = baseline.k * kMultiplier;

  // Commercial Fertilizer calculations:
  // DAP supplies 18% N and 46% P2O5 -> targetP / 0.46 = kg DAP
  const dapKg = Math.round((targetP / 0.46) * farmSizeAcres);
  const nSuppliedByDap = (dapKg / farmSizeAcres) * 0.18;

  // Remainder N supplied by Urea (46% N)
  const remainingN = Math.max(0, targetN - nSuppliedByDap);
  const ureaKg = Math.round((remainingN / 0.46) * farmSizeAcres);

  // MOP supplies 60% K2O -> targetK / 0.60 = kg MOP
  const mopKg = Math.round((targetK / 0.60) * farmSizeAcres);

  // Soil amendments based on pH
  let gypsumKg: number | undefined = undefined;
  if (phClassification === 'ALKALINE') {
    gypsumKg = Math.round(150 * farmSizeAcres); // Gypsum amendment for sodic/alkaline soils
  }

  const biofertilizers = [
    'Azotobacter / Azospirillum culture (2 kg/acre for biological nitrogen fixation)',
    'Phosphorus Solubilizing Bacteria (PSB) culture (2 kg/acre for rock phosphate mobilization)',
    'VAM (Vesicular Arbuscular Mycorrhiza) 5 kg/acre for root surface expansion'
  ];

  const applicationStages = [
    {
      stage: 'Basal Soil Preparation (Pre-Planting)',
      fertilizers: `Full DAP (${dapKg} kg) + 33% Urea (${Math.round(ureaKg * 0.33)} kg) + 50% MOP (${Math.round(mopKg * 0.5)} kg)${gypsumKg ? ` + Agricultural Gypsum (${gypsumKg} kg)` : ''}`,
      waterRequirement: 'Thorough pre-soaking irrigation or moist seedbed'
    },
    {
      stage: 'Active Vegetative & Tillering / Branching',
      fertilizers: `33% Urea (${Math.round(ureaKg * 0.33)} kg) + Micronutrient foliar spray (Zinc + Boron 0.5%)`,
      waterRequirement: 'Maintain 50% field soil moisture capacity'
    },
    {
      stage: 'Flowering & Early Fruit/Grain Set',
      fertilizers: `Remaining 34% Urea (${Math.round(ureaKg * 0.34)} kg) + Remaining 50% MOP (${Math.round(mopKg * 0.5)} kg)`,
      waterRequirement: 'Critical irrigation window; prevent moisture stress'
    }
  ];

  const scientificExplanation = `
Soil profile shows pH of ${phLevel} (${phClassification}) and Electrical Conductivity of ${ecValue} dS/m (${salinityRisk} Salinity). 
Nitrogen status is ${nitrogenRating}, Phosphorus is ${phosphorusRating}, and Potassium is ${potassiumRating}. 
For a ${farmSizeAcres}-acre ${cropTarget} plot, the recommended balanced chemical input totals ${ureaKg} kg Urea, ${dapKg} kg DAP, and ${mopKg} kg MOP, delivered across 3 split doses to maximize fertilizer use efficiency (FUE) and minimize groundwater leaching.
  `.trim();

  return {
    nitrogenRating,
    phosphorusRating,
    potassiumRating,
    phClassification,
    salinityRisk,
    fertilizerPlan: {
      ureaKg,
      dapKg,
      mopKg,
      gypsumKg,
      biofertilizers,
      applicationStages
    },
    scientificExplanation
  };
}
