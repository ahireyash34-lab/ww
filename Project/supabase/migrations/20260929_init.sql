-- AgriVision AI - Database Initialization Migration
-- PostgreSQL 15+ / Supabase Schema

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('FARMER', 'AGRONOMIST', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE crop_stage AS ENUM ('NURSERY', 'VEGETATIVE', 'FLOWERING', 'FRUITING', 'HARVEST_READY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE severity_level AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE irrigation_type AS ENUM ('DRIP', 'SPRINKLER', 'FLOOD', 'RAIN_FED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users Profile Table (Extends Auth.Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone_number TEXT UNIQUE,
    role user_role DEFAULT 'FARMER'::user_role NOT NULL,
    preferred_language TEXT DEFAULT 'en' NOT NULL,
    state TEXT,
    district TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Farms / Plots Table
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    farm_name TEXT NOT NULL,
    acreage NUMERIC(6, 2) NOT NULL,
    soil_type TEXT NOT NULL,
    irrigation_type irrigation_type DEFAULT 'RAIN_FED' NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Diagnostics Records Table
CREATE TABLE IF NOT EXISTS public.diagnostics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    crop_stage crop_stage NOT NULL,
    image_url TEXT NOT NULL,
    detected_issue TEXT NOT NULL,
    pathogen_type TEXT,
    confidence_score NUMERIC(5, 2) NOT NULL,
    severity severity_level NOT NULL,
    organic_remedies JSONB NOT NULL,
    chemical_remedies JSONB NOT NULL,
    preventive_measures JSONB NOT NULL,
    fertilizer_advice JSONB,
    reviewed_by_agronomist BOOLEAN DEFAULT FALSE NOT NULL,
    agronomist_notes TEXT,
    raw_ai_response JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Mandi Prices Cache Table
CREATE TABLE IF NOT EXISTS public.mandi_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    market_name TEXT NOT NULL,
    commodity TEXT NOT NULL,
    variety TEXT,
    min_price NUMERIC(10, 2) NOT NULL,
    max_price NUMERIC(10, 2) NOT NULL,
    modal_price NUMERIC(10, 2) NOT NULL,
    arrival_date DATE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(market_name, commodity, arrival_date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_diagnostics_user ON public.diagnostics(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnostics_farm ON public.diagnostics(farm_id);
CREATE INDEX IF NOT EXISTS idx_diagnostics_created ON public.diagnostics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mandi_lookup ON public.mandi_prices(state, district, commodity);
CREATE INDEX IF NOT EXISTS idx_mandi_arrival ON public.mandi_prices(arrival_date DESC);

-- Enable RLS on Tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandi_prices ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles 
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles 
    FOR UPDATE USING (auth.uid() = id);

-- Farms Policies
DROP POLICY IF EXISTS "Farmers can manage their own farms" ON public.farms;
CREATE POLICY "Farmers can manage their own farms" ON public.farms 
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Agronomists can view all farms" ON public.farms;
CREATE POLICY "Agronomists can view all farms" ON public.farms 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('AGRONOMIST', 'ADMIN'))
    );

-- Diagnostics Policies
DROP POLICY IF EXISTS "Farmers can read/write own diagnostics" ON public.diagnostics;
CREATE POLICY "Farmers can read/write own diagnostics" ON public.diagnostics 
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Agronomists can read diagnostics" ON public.diagnostics;
CREATE POLICY "Agronomists can read diagnostics" ON public.diagnostics 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('AGRONOMIST', 'ADMIN'))
    );

DROP POLICY IF EXISTS "Agronomists can update prescription notes" ON public.diagnostics;
CREATE POLICY "Agronomists can update prescription notes" ON public.diagnostics 
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('AGRONOMIST', 'ADMIN'))
    );

-- Mandi Prices Policies (Public read-only for authenticated or anon)
DROP POLICY IF EXISTS "Anyone authenticated can read mandi prices" ON public.mandi_prices;
CREATE POLICY "Anyone authenticated can read mandi prices" ON public.mandi_prices 
    FOR SELECT USING (true);
