export type UserRole = 'FARMER' | 'AGRONOMIST' | 'ADMIN';
export type CropStage = 'NURSERY' | 'VEGETATIVE' | 'FLOWERING' | 'FRUITING' | 'HARVEST_READY';
export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IrrigationType = 'DRIP' | 'SPRINKLER' | 'FLOOD' | 'RAIN_FED';
export type SoilType = 'BLACK_COTTON' | 'RED_LOAMY' | 'ALLUVIAL' | 'CLAY' | 'SANDY';
export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'te' | 'ta';

export type PathogenType = 
  | 'FUNGI' 
  | 'BACTERIA' 
  | 'VIRUS' 
  | 'PEST' 
  | 'NUTRIENT_DEFICIENCY' 
  | 'ABIOTIC_STRESS' 
  | 'UNKNOWN';

export interface OrganicRemedy {
  title: string;
  recipeOrProduct: string;
  dosagePerAcre: string;
  applicationMethod: string;
}

export interface ChemicalRemedy {
  chemicalName: string;
  commercialProductExample?: string;
  dosagePerLiter: string;
  preHarvestIntervalDays?: number;
  safetyPrecautions: string;
}

export interface FertilizerAdvice {
  ureaKgPerAcre?: number;
  dapKgPerAcre?: number;
  mopKgPerAcre?: number;
  micronutrients?: string[];
  schedule?: string;
}

export interface DiagnosticResult {
  id?: string;
  cropIdentified: string;
  detectedIssue: string;
  pathogenType: PathogenType;
  confidenceScore: number;
  severity: SeverityLevel;
  symptomsObserved: string[];
  organicRemedies: OrganicRemedy[];
  chemicalRemedies: ChemicalRemedy[];
  preventiveMeasures: string[];
  fertilizerAdvice?: FertilizerAdvice;
  localizedDescription: string;
  weatherAdvisory?: {
    temperature: string;
    humidity: string;
    sprayWindowAdvisable: boolean;
    reason: string;
  };
  flaggedForReview?: boolean;
}

export interface DiagnosticRecord {
  id: string;
  user_id: string;
  farm_id?: string;
  crop_name: string;
  crop_stage: CropStage;
  image_url: string;
  detected_issue: string;
  pathogen_type: PathogenType;
  confidence_score: number;
  severity: SeverityLevel;
  organic_remedies: OrganicRemedy[];
  chemical_remedies: ChemicalRemedy[];
  preventive_measures: string[];
  fertilizer_advice?: FertilizerAdvice;
  reviewed_by_agronomist: boolean;
  agronomist_notes?: string;
  raw_ai_response: DiagnosticResult;
  created_at: string;
  farm_name?: string;
  farmer_name?: string;
}

export interface MandiPriceRecord {
  id: string;
  state: string;
  district: string;
  market_name: string;
  commodity: string;
  variety?: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  arrival_date: string;
  updated_at: string;
  price_change_24h?: number;
  predicted_trend?: 'BULLISH' | 'BEARISH' | 'STABLE';
}

export interface FarmRecord {
  id: string;
  user_id: string;
  farm_name: string;
  acreage: number;
  soil_type: string;
  irrigation_type: IrrigationType;
  state: string;
  district: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  role: UserRole;
  preferred_language: SupportedLanguage;
  state?: string;
  district?: string;
  created_at: string;
  updated_at: string;
}

export interface SoilAnalysisResult {
  nitrogenRating: 'DEFICIENT' | 'OPTIMAL' | 'EXCESS';
  phosphorusRating: 'DEFICIENT' | 'OPTIMAL' | 'EXCESS';
  potassiumRating: 'DEFICIENT' | 'OPTIMAL' | 'EXCESS';
  phClassification: 'STRONGLY_ACIDIC' | 'MODERATELY_ACIDIC' | 'NEUTRAL' | 'ALKALINE';
  salinityRisk: 'LOW' | 'MODERATE' | 'HIGH';
  fertilizerPlan: {
    ureaKg: number;
    dapKg: number;
    mopKg: number;
    gypsumKg?: number;
    biofertilizers: string[];
    applicationStages: {
      stage: string;
      fertilizers: string;
      waterRequirement: string;
    }[];
  };
  scientificExplanation: string;
}
