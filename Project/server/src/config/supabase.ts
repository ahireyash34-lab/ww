import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseServiceKey && !supabaseUrl.includes('your-project'));

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

if (isSupabaseConfigured) {
  console.log('✅ Connected to Supabase Cloud PostgreSQL');
} else {
  console.log('ℹ️ Running with Resilient In-Memory / Local PostgreSQL Mirror Store. Provide SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env to switch to remote cloud database.');
}

// In-Memory Fallback Data Store for Local Development & Offline Resiliency
export interface InMemoryStore {
  profiles: Map<string, any>;
  farms: Map<string, any>;
  diagnostics: Map<string, any>;
  mandiPrices: any[];
}

export const localDb: InMemoryStore = {
  profiles: new Map(),
  farms: new Map(),
  diagnostics: new Map(),
  mandiPrices: [
    {
      id: 'm1',
      state: 'Maharashtra',
      district: 'Nashik',
      market_name: 'Nashik APMC',
      commodity: 'Tomato',
      variety: 'Hybrid Red',
      min_price: 1800,
      max_price: 2400,
      modal_price: 2150,
      arrival_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
      price_change_24h: 4.8,
      predicted_trend: 'BULLISH'
    },
    {
      id: 'm2',
      state: 'Maharashtra',
      district: 'Nashik',
      market_name: 'Lasalgaon APMC',
      commodity: 'Onion',
      variety: 'Red Medium',
      min_price: 2200,
      max_price: 3100,
      modal_price: 2750,
      arrival_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
      price_change_24h: -1.2,
      predicted_trend: 'STABLE'
    },
    {
      id: 'm3',
      state: 'Maharashtra',
      district: 'Nagpur',
      market_name: 'Nagpur APMC',
      commodity: 'Cotton',
      variety: 'Long Staple BT',
      min_price: 7100,
      max_price: 7850,
      modal_price: 7550,
      arrival_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
      price_change_24h: 2.1,
      predicted_trend: 'BULLISH'
    },
    {
      id: 'm4',
      state: 'Punjab',
      district: 'Ludhiana',
      market_name: 'Khanna APMC',
      commodity: 'Wheat',
      variety: 'PBW 550 Sharbati',
      min_price: 2350,
      max_price: 2750,
      modal_price: 2550,
      arrival_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
      price_change_24h: 0.5,
      predicted_trend: 'STABLE'
    },
    {
      id: 'm5',
      state: 'Andhra Pradesh',
      district: 'Guntur',
      market_name: 'Guntur Yard',
      commodity: 'Chilli',
      variety: 'Teja / S17 Super',
      min_price: 16500,
      max_price: 21000,
      modal_price: 19200,
      arrival_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
      price_change_24h: 3.5,
      predicted_trend: 'BULLISH'
    },
    {
      id: 'm6',
      state: 'Telangana',
      district: 'Warangal',
      market_name: 'Warangal Enamamula',
      commodity: 'Cotton',
      variety: 'DCH-32 Hybrid',
      min_price: 7200,
      max_price: 8100,
      modal_price: 7750,
      arrival_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
      price_change_24h: 1.8,
      predicted_trend: 'BULLISH'
    },
    {
      id: 'm7',
      state: 'Karnataka',
      district: 'Kolar',
      market_name: 'Kolar APMC',
      commodity: 'Tomato',
      variety: 'Roma Hybrid',
      min_price: 2100,
      max_price: 2700,
      modal_price: 2450,
      arrival_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
      price_change_24h: -2.0,
      predicted_trend: 'BEARISH'
    },
    {
      id: 'm8',
      state: 'Tamil Nadu',
      district: 'Thanjavur',
      market_name: 'Thanjavur Regulated',
      commodity: 'Rice / Paddy',
      variety: 'ADT 45 Fine',
      min_price: 2300,
      max_price: 2800,
      modal_price: 2600,
      arrival_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
      price_change_24h: 1.0,
      predicted_trend: 'STABLE'
    },
    {
      id: 'm9',
      state: 'Maharashtra',
      district: 'Latur',
      market_name: 'Latur APMC',
      commodity: 'Chickpea (Chana)',
      variety: 'Desi Annagiri',
      min_price: 5400,
      max_price: 6200,
      modal_price: 5850,
      arrival_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
      price_change_24h: 2.4,
      predicted_trend: 'BULLISH'
    },
    {
      id: 'm10',
      state: 'Gujarat',
      district: 'Rajkot',
      market_name: 'Rajkot Yard',
      commodity: 'Groundnut (Peanut)',
      variety: 'GG-20 Bold',
      min_price: 6100,
      max_price: 6900,
      modal_price: 6500,
      arrival_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
      price_change_24h: -0.8,
      predicted_trend: 'STABLE'
    }
  ]
};

// Seed default demo user profiles
const demoFarmer = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'farmer@agrivision.ai',
  full_name: 'Ramesh Patel',
  phone_number: '9876543210',
  role: 'FARMER',
  preferred_language: 'hi',
  state: 'Maharashtra',
  district: 'Nashik',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const demoAgronomist = {
  id: '00000000-0000-0000-0000-000000000002',
  email: 'agronomist@agrivision.ai',
  full_name: 'Dr. Ananya Sharma (Ph.D. Plant Pathology)',
  phone_number: '9876543211',
  role: 'AGRONOMIST',
  preferred_language: 'en',
  state: 'Maharashtra',
  district: 'Pune',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const demoAdmin = {
  id: '00000000-0000-0000-0000-000000000003',
  email: 'admin@agrivision.ai',
  full_name: 'AgriVision Operations Admin',
  phone_number: '9876543212',
  role: 'ADMIN',
  preferred_language: 'en',
  state: 'Delhi',
  district: 'New Delhi',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

localDb.profiles.set(demoFarmer.id, demoFarmer);
localDb.profiles.set(demoAgronomist.id, demoAgronomist);
localDb.profiles.set(demoAdmin.id, demoAdmin);

// Seed initial farm for Ramesh
const demoFarm = {
  id: '11111111-1111-1111-1111-111111111111',
  user_id: demoFarmer.id,
  farm_name: 'Patel Organic Orchards & Vegetable Plot',
  acreage: 5.5,
  soil_type: 'BLACK_COTTON',
  irrigation_type: 'DRIP',
  state: 'Maharashtra',
  district: 'Nashik',
  latitude: 20.0059,
  longitude: 73.7910,
  created_at: new Date().toISOString()
};
localDb.farms.set(demoFarm.id, demoFarm);

// Seed sample historical diagnostic
const sampleDiagnostic = {
  id: '22222222-2222-2222-2222-222222222222',
  user_id: demoFarmer.id,
  farm_id: demoFarm.id,
  crop_name: 'Tomato',
  crop_stage: 'FLOWERING',
  image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80',
  detected_issue: 'Early Blight (Alternaria solani)',
  pathogen_type: 'FUNGI',
  confidence_score: 94.2,
  severity: 'MEDIUM',
  organic_remedies: [
    {
      title: 'Neem Seed Kernel Extract (NSKE 5%)',
      recipeOrProduct: '50g crushed neem seeds soaked overnight in 1L water with 1g soap nut powder',
      dosagePerAcre: '20 Liters total solution (100ml / 15L knapsack pump)',
      applicationMethod: 'Foliar spray in early morning or late afternoon'
    },
    {
      title: 'Copper Hydroxide Bio-Formulation',
      recipeOrProduct: 'Certified Organic Bordeaux Mixture (1% neutralization)',
      dosagePerAcre: '400g per 200L water per acre',
      applicationMethod: 'Target undersides of lower canopy foliage'
    }
  ],
  chemicalRemedies: [
    {
      chemicalName: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
      commercialProductExample: 'Amistar Top',
      dosagePerLiter: '1.0 ml / liter of water',
      preHarvestIntervalDays: 5,
      safetyPrecautions: 'Wear nitrile gloves, mask, avoid spraying during high wind speed (>10 km/h).'
    }
  ],
  preventiveMeasures: [
    'Sterilize pruning shears with 70% isopropyl alcohol between rows.',
    'Increase plant spacing to improve canopy air circulation.',
    'Avoid overhead sprinkler irrigation; maintain strict drip emitters at base.'
  ],
  fertilizerAdvice: {
    ureaKgPerAcre: 15,
    dapKgPerAcre: 25,
    mopKgPerAcre: 30,
    micronutrients: ['Zinc Sulphate 0.5%', 'Boron 0.1%'],
    schedule: 'Apply balanced potash split dose during flowering to strengthen cell wall resistance.'
  },
  reviewed_by_agronomist: true,
  agronomist_notes: 'Confirmed Alternaria concentric rings on lower leaves. Chemical intervention justified if lesion coverage exceeds 15%. Good adherence to organic preventative spray.',
  raw_ai_response: {
    cropIdentified: 'Tomato (Solanum lycopersicum)',
    detectedIssue: 'Early Blight (Alternaria solani)',
    pathogenType: 'FUNGI',
    confidenceScore: 94.2,
    severity: 'MEDIUM',
    symptomsObserved: ['Concentric dark brown target-spot rings', 'Yellow halo surrounding lesions', 'Leaf chlorosis'],
    organicRemedies: [],
    chemicalRemedies: [],
    preventiveMeasures: [],
    localizedDescription: 'टमाटर की अगेती झुलसा बीमारी की पुष्टि हुई है। निचली पत्तियों पर भूरे छल्लेदार धब्बे दिख रहे हैं। तुरंत फफूंदनाशक या नीम अर्क का छिड़काव करें।'
  },
  created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  farm_name: demoFarm.farm_name,
  farmer_name: demoFarmer.full_name
};
localDb.diagnostics.set(sampleDiagnostic.id, sampleDiagnostic);
