-- ==============================================================================
-- DOCKLY PRO: CAREER TRAJECTORY & MILESTONES PATCH
-- Run this script in the Supabase SQL Editor to activate the Milestones Module.
-- ==============================================================================

-- 1. Create milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  organization TEXT,
  description TEXT,
  category TEXT DEFAULT 'Milestone',
  badge TEXT,
  url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row-Level Security
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- 3. Configure RLS Policies
DROP POLICY IF EXISTS "Milestones are viewable by everyone if profile not private." ON milestones;
DROP POLICY IF EXISTS "Users can manage their own milestones." ON milestones;

CREATE POLICY "Milestones are viewable by everyone if profile not private." ON milestones FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = milestones.profile_id AND (NOT profiles.is_private OR auth.uid() = profiles.id))
);

CREATE POLICY "Users can manage their own milestones." ON milestones FOR ALL USING (auth.uid() = profile_id);

-- 4. Add to Realtime Publication
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'milestones') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE milestones;
  END IF;
END $$;
