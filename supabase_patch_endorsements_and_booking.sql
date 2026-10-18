-- ==============================================================================
-- DOCKLY.PRO - CLIENT ENDORSEMENTS & LIVE AVAILABILITY / BOOKING MIGRATION
-- ==============================================================================

-- 1. Extend profiles with Live Availability & Booking fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS availability_text TEXT DEFAULT 'Available for new opportunities';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS booking_enabled BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS booking_url TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS booking_button_text TEXT DEFAULT 'Schedule Session';

-- 2. Create endorsements (Client Testimonials & Wall of Distinction) table
CREATE TABLE IF NOT EXISTS endorsements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT NOT NULL,
  client_role TEXT,
  company_name TEXT,
  client_avatar TEXT,
  quote TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  project_title TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Set up Row-Level Security (RLS) for endorsements
ALTER TABLE endorsements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Endorsements are viewable by everyone if profile not private." ON endorsements;
DROP POLICY IF EXISTS "Users can manage their own endorsements." ON endorsements;

CREATE POLICY "Endorsements are viewable by everyone if profile not private." ON endorsements FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = endorsements.profile_id AND (NOT profiles.is_private OR auth.uid() = profiles.id))
);

CREATE POLICY "Users can manage their own endorsements." ON endorsements FOR ALL USING (auth.uid() = profile_id);

-- 4. Enable Realtime updates for endorsements
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'endorsements') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE endorsements;
  END IF;
END $$;
