import { z } from 'zod';

export const DiagnosticRequestSchema = z.object({
  cropType: z.string().min(2, 'Crop type must be specified'),
  cropStage: z.enum(['NURSERY', 'VEGETATIVE', 'FLOWERING', 'FRUITING', 'HARVEST_READY']),
  farmId: z.string().uuid().optional().or(z.literal('')),
  language: z.enum(['en', 'hi', 'mr', 'te', 'ta']).default('en'),
  soilType: z.enum(['BLACK_COTTON', 'RED_LOAMY', 'ALLUVIAL', 'CLAY', 'SANDY']).optional(),
  irrigationMethod: z.enum(['DRIP', 'SPRINKLER', 'FLOOD', 'RAIN_FED']).optional(),
  symptomsObserved: z.array(z.string()).optional().default([]),
  recentFoliarSpray: z.string().optional(),
  affectedAreaPercentage: z.number().min(0).max(100).optional().default(10),
  location: z.string().optional().default('General Agricultural Region'),
  notes: z.string().max(500).optional()
});

export const SoilAnalysisSchema = z.object({
  nitrogenPpm: z.number().min(0).max(1000),
  phosphorusPpm: z.number().min(0).max(1000),
  potassiumPpm: z.number().min(0).max(1000),
  phLevel: z.number().min(1).max(14),
  ecValue: z.number().min(0).max(20),
  cropTarget: z.string().min(2),
  farmSizeAcres: z.number().positive().optional().default(1),
  irrigationType: z.enum(['DRIP', 'SPRINKLER', 'FLOOD', 'RAIN_FED']).optional().default('DRIP')
});

export const FarmRegistrationSchema = z.object({
  farmName: z.string().min(3, 'Farm name must be at least 3 characters'),
  acreage: z.number().positive('Acreage must be greater than 0'),
  soilType: z.string().min(2, 'Soil type is required'),
  irrigationType: z.enum(['DRIP', 'SPRINKLER', 'FLOOD', 'RAIN_FED']),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional()
});

export const AgronomistReviewSchema = z.object({
  reviewedBy: z.string().min(2),
  notes: z.string().min(5, 'Prescription note must be at least 5 characters'),
  status: z.enum(['VERIFIED', 'MODIFIED', 'REJECTED']),
  recommendedChemicalOverride: z.string().optional(),
  recommendedDosageOverride: z.string().optional()
});

export const UserSignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  phoneNumber: z.string().min(10, 'Valid phone number required'),
  role: z.enum(['FARMER', 'AGRONOMIST', 'ADMIN']).default('FARMER'),
  preferredLanguage: z.enum(['en', 'hi', 'mr', 'te', 'ta']).default('en'),
  state: z.string().optional(),
  district: z.string().optional()
});

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required')
});

export type DiagnosticRequestInput = z.infer<typeof DiagnosticRequestSchema>;
export type SoilAnalysisInput = z.infer<typeof SoilAnalysisSchema>;
export type FarmRegistrationInput = z.infer<typeof FarmRegistrationSchema>;
export type AgronomistReviewInput = z.infer<typeof AgronomistReviewSchema>;
export type UserSignupInput = z.infer<typeof UserSignupSchema>;
export type UserLoginInput = z.infer<typeof UserLoginSchema>;
