-- ==============================================================================
-- DOCKLY PRO: TECH STACK & ENGINEERING ARSENAL PATCH
-- Run this script in the Supabase SQL Editor to activate the Tech Stack Module.
-- ==============================================================================

-- 1. Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Languages',
  proficiency TEXT DEFAULT 'Advanced', -- 'Principal', 'Advanced', 'Proficient', 'Familiar'
  icon_key TEXT NOT NULL,
  color TEXT,
  years_exp TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row-Level Security
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- 3. Configure RLS Policies
DROP POLICY IF EXISTS "Skills are viewable by everyone if profile not private." ON skills;
DROP POLICY IF EXISTS "Users can manage their own skills." ON skills;

CREATE POLICY "Skills are viewable by everyone if profile not private." ON skills FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = skills.profile_id AND (NOT profiles.is_private OR auth.uid() = profiles.id))
);

CREATE POLICY "Users can manage their own skills." ON skills FOR ALL USING (auth.uid() = profile_id);

-- 4. Add to Realtime Publication
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'skills') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE skills;
  END IF;
END $$;
