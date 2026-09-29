-- AgriVision AI - Seed Data for Mandi Prices, Sample Farms & Demo Data

-- Sample Mandi Prices Cache
INSERT INTO public.mandi_prices (state, district, market_name, commodity, variety, min_price, max_price, modal_price, arrival_date)
VALUES
-- Tomato
('Maharashtra', 'Nashik', 'Nashik APMC', 'Tomato', 'Hybrid Red', 1800.00, 2400.00, 2150.00, CURRENT_DATE),
('Maharashtra', 'Pune', 'Pune Gultekdi', 'Tomato', 'Desi Local', 1600.00, 2200.00, 1950.00, CURRENT_DATE),
('Karnataka', 'Kolar', 'Kolar APMC', 'Tomato', 'Roma Hybrid', 2100.00, 2700.00, 2450.00, CURRENT_DATE),
('Andhra Pradesh', 'Chittoor', 'Madanapalle APMC', 'Tomato', 'Naveen Super', 1900.00, 2500.00, 2250.00, CURRENT_DATE),

-- Onion
('Maharashtra', 'Nashik', 'Lasalgaon APMC', 'Onion', 'Red Medium', 2200.00, 3100.00, 2750.00, CURRENT_DATE),
('Maharashtra', 'Ahmednagar', 'Rahata APMC', 'Onion', 'Garwa Grade-1', 2100.00, 2900.00, 2600.00, CURRENT_DATE),
('Madhya Pradesh', 'Indore', 'Indore Mandi', 'Onion', 'Local Nasik', 1950.00, 2800.00, 2450.00, CURRENT_DATE),

-- Cotton
('Maharashtra', 'Nagpur', 'Nagpur APMC', 'Cotton', 'Long Staple BT', 7100.00, 7850.00, 7550.00, CURRENT_DATE),
('Telangana', 'Warangal', 'Warangal Enamamula', 'Cotton', 'DCH-32 Hybrid', 7200.00, 8100.00, 7750.00, CURRENT_DATE),
('Gujarat', 'Rajkot', 'Rajkot Yard', 'Cotton', 'Shankar-6', 7300.00, 8200.00, 7800.00, CURRENT_DATE),

-- Wheat
('Punjab', 'Ludhiana', 'Khanna APMC', 'Wheat', 'PBW 550 Sharbati', 2350.00, 2750.00, 2550.00, CURRENT_DATE),
('Madhya Pradesh', 'Sehore', 'Sehore Mandi', 'Wheat', 'Lokwan Golden', 2600.00, 3200.00, 2950.00, CURRENT_DATE),

-- Rice / Paddy
('Andhra Pradesh', 'East Godavari', 'Kakinada Market', 'Paddy (Dhan)', 'BPT 5204 (Samba Masuri)', 2400.00, 2950.00, 2720.00, CURRENT_DATE),
('Tamil Nadu', 'Thanjavur', 'Thanjavur Regulated', 'Paddy (Dhan)', 'ADT 45 Fine', 2300.00, 2800.00, 2600.00, CURRENT_DATE),

-- Chilli
('Andhra Pradesh', 'Guntur', 'Guntur Yard', 'Chilli', 'Teja / S17 Super', 16500.00, 21000.00, 19200.00, CURRENT_DATE),
('Telangana', 'Khammam', 'Khammam APMC', 'Chilli', 'Fatki Medium', 14000.00, 18500.00, 16800.00, CURRENT_DATE),

-- Chickpea (Chana)
('Maharashtra', 'Latur', 'Latur APMC', 'Chickpea (Chana)', 'Desi Annagiri', 5400.00, 6200.00, 5850.00, CURRENT_DATE),
('Karnataka', 'Gulbarga', 'Kalaburagi APMC', 'Pigeon Pea (Tur)', 'Maruti G-1', 9400.00, 11200.00, 10450.00, CURRENT_DATE),

-- Sugarcane
('Maharashtra', 'Kolhapur', 'Kolhapur Mandi', 'Sugarcane', 'CO-86032', 3200.00, 3600.00, 3450.00, CURRENT_DATE)
ON CONFLICT (market_name, commodity, arrival_date) 
DO UPDATE SET 
  min_price = EXCLUDED.min_price,
  max_price = EXCLUDED.max_price,
  modal_price = EXCLUDED.modal_price,
  updated_at = NOW();
