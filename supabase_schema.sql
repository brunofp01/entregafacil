-- Profiles table for Users (Tenant, Agency, Admin)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'tenant', -- 'tenant', 'agency', 'admin'
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Properties table
CREATE TABLE properties (
  id BIGSERIAL PRIMARY KEY,
  address TEXT NOT NULL,
  size_m2 INTEGER NOT NULL,
  finish_standard TEXT NOT NULL, -- 'economico', 'standard', 'premium'
  owner_id UUID REFERENCES profiles(id),
  agency_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Subscription Contracts
CREATE TABLE contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id BIGINT REFERENCES properties(id),
  tenant_id UUID REFERENCES profiles(id),
  monthly_fee DECIMAL(10,2) NOT NULL,
  total_months INTEGER DEFAULT 30,
  months_paid INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- 'active', 'pending', 'cancelled'
  start_date DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Inspections (Vistorias)
CREATE TABLE inspections (
  id BIGSERIAL PRIMARY KEY,
  contract_id UUID REFERENCES contracts(id),
  type TEXT NOT NULL, -- 'entrada', 'saida'
  photo_urls TEXT[], 
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Examples)
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Tenants can view own contracts." ON contracts FOR SELECT USING (auth.uid() = tenant_id);
