-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'Creator',
  theme JSONB DEFAULT '{"id": "royale", "name": "Obsidian Royale", "primary": "#D4AF37", "bg": "#050505", "font": "Syncopate"}'::jsonb,
  is_private BOOLEAN DEFAULT false,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  top_tracks JSONB DEFAULT '[]'::jsonb,
  youtube_channel_id TEXT,
  newsletter_enabled BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create ventures (projects) table
CREATE TABLE IF NOT EXISTS ventures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[],
  url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create social_links table
CREATE TABLE IF NOT EXISTS social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create curated_products (affiliate links) table
CREATE TABLE IF NOT EXISTS curated_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  price TEXT,
  image_url TEXT,
  url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventures ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE curated_products ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can read if not private, users can manage their own
DROP POLICY IF EXISTS "Public profiles are viewable by everyone if not private." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
CREATE POLICY "Public profiles are viewable by everyone if not private." ON profiles FOR SELECT USING (NOT is_private OR auth.uid() = id);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Ventures: Public can read if profile is not private, users can manage their own
DROP POLICY IF EXISTS "Ventures are viewable by everyone if profile not private." ON ventures;
DROP POLICY IF EXISTS "Users can manage their own ventures." ON ventures;
CREATE POLICY "Ventures are viewable by everyone if profile not private." ON ventures FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = ventures.profile_id AND (NOT profiles.is_private OR auth.uid() = profiles.id))
);
CREATE POLICY "Users can manage their own ventures." ON ventures FOR ALL USING (auth.uid() = profile_id);

-- Social Links: Public can read if profile is not private, users can manage their own
DROP POLICY IF EXISTS "Social links are viewable by everyone if profile not private." ON social_links;
DROP POLICY IF EXISTS "Users can manage their own social links." ON social_links;
CREATE POLICY "Social links are viewable by everyone if profile not private." ON social_links FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = social_links.profile_id AND (NOT profiles.is_private OR auth.uid() = profiles.id))
);
CREATE POLICY "Users can manage their own social links." ON social_links FOR ALL USING (auth.uid() = profile_id);

-- Curated Products: Public can read if profile is not private, users can manage their own
DROP POLICY IF EXISTS "Curated products are viewable by everyone if profile not private." ON curated_products;
DROP POLICY IF EXISTS "Users can manage their own curated products." ON curated_products;
CREATE POLICY "Curated products are viewable by everyone if profile not private." ON curated_products FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = curated_products.profile_id AND (NOT profiles.is_private OR auth.uid() = profiles.id))
);
CREATE POLICY "Users can manage their own curated products." ON curated_products FOR ALL USING (auth.uid() = profile_id);
-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  temp_username TEXT;
BEGIN
  -- Generate a temporary username if none provided (e.g., during dashboard invites)
  temp_username := COALESCE(
    lower(new.raw_user_meta_data->>'username'),
    split_part(new.email, '@', 1),
    'user_' || substr(md5(random()::text), 1, 8)
  );

  -- Ensure uniqueness (append a short random string if needed)
  -- This is a simple safe-guard
  IF EXISTS (SELECT 1 FROM public.profiles WHERE username = temp_username) THEN
    temp_username := temp_username || '_' || substr(md5(random()::text), 1, 4);
  END IF;

  INSERT INTO public.profiles (id, full_name, username, avatar_url, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    temp_username,
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'Creator')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- STORAGE SETUP
-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload an avatar." ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update their own avatar." ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete their own avatar." ON storage.objects;

CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can upload an avatar."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );

CREATE POLICY "Anyone can update their own avatar."
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );

CREATE POLICY "Anyone can delete their own avatar."
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );

-- Analytics Tables
CREATE TABLE IF NOT EXISTS profile_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  viewer_ip TEXT,
  user_agent TEXT,
  referrer TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS link_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  link_type TEXT NOT NULL, -- 'social', 'venture', 'product'
  link_id UUID NOT NULL,
  link_url TEXT NOT NULL,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Analytics
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_clicks ENABLE ROW LEVEL SECURITY;

-- Policies: Anyone can insert, only owner can read
DROP POLICY IF EXISTS "Anyone can insert profile views." ON profile_views;
DROP POLICY IF EXISTS "Users can view views for their own profile." ON profile_views;
CREATE POLICY "Anyone can insert profile views." ON profile_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view views for their own profile." ON profile_views FOR SELECT USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Anyone can insert link clicks." ON link_clicks;
DROP POLICY IF EXISTS "Users can view clicks for their own profile." ON link_clicks;
CREATE POLICY "Anyone can insert link clicks." ON link_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view clicks for their own profile." ON link_clicks FOR SELECT USING (auth.uid() = profile_id);

-- Enable Realtime
-- Note: These may fail if already added, which is usually fine in one-off migrations
-- but for idempotency we'd need to check pg_publication_tables.
-- We'll keep them as is for now as they are usually the last step.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'profiles') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'ventures') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE ventures;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'social_links') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE social_links;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'curated_products') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE curated_products;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'profile_views') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE profile_views;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'link_clicks') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE link_clicks;
  END IF;
END $$;

-- WELCOME EMAIL HOOK
-- Enable pg_net extension to allow making HTTP requests
CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

-- Create a function to call the edge function
CREATE OR REPLACE FUNCTION public.trigger_welcome_email()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM
    net.http_post(
      url := 'https://arysrcdpzlaswrlrbmhl.supabase.co/functions/v1/send-welcome-email',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyeXNyY2Rwemxhc3dybHJibWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMTI4NTYsImV4cCI6MjA4MzU4ODg1Nn0.6290b0zQmshkukUuX0DlxztX0sGsE6YOmSrZN5VF9g8"}'::jsonb,
      body := jsonb_build_object(
        'email', new.email,
        'name', new.raw_user_meta_data->>'full_name'
      )
    );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created_email ON auth.users;
CREATE TRIGGER on_auth_user_created_email
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.trigger_welcome_email();

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(profile_id, email)
);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to subscribe
CREATE POLICY "Anyone can subscribe to newsletters" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Only owner can view their subscribers
CREATE POLICY "Owners can view their own subscribers" ON newsletter_subscribers FOR SELECT USING (auth.uid() = profile_id);
-- Add accepting_inquiries to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS accepting_inquiries BOOLEAN DEFAULT false;

-- Create inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    contact_number TEXT,
    company_name TEXT,
    inquiry_type TEXT NOT NULL,
    message TEXT NOT NULL,
    budget_range TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can send inquiries" ON inquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own inquiries" ON inquiries
    FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can update own inquiries" ON inquiries
    FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own inquiries" ON inquiries
    FOR DELETE USING (auth.uid() = profile_id);

-- Live Availability & Tactical Booking
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS availability_text TEXT DEFAULT 'Available for new opportunities';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS booking_enabled BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS booking_url TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS booking_button_text TEXT DEFAULT 'Schedule Session';

-- Client Endorsements / Wall of Distinction
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

ALTER TABLE endorsements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Endorsements are viewable by everyone if profile not private." ON endorsements;
DROP POLICY IF EXISTS "Users can manage their own endorsements." ON endorsements;

CREATE POLICY "Endorsements are viewable by everyone if profile not private." ON endorsements FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = endorsements.profile_id AND (NOT profiles.is_private OR auth.uid() = profiles.id))
);

CREATE POLICY "Users can manage their own endorsements." ON endorsements FOR ALL USING (auth.uid() = profile_id);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'endorsements') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE endorsements;
  END IF;
END $$;

-- Career Trajectory & Milestones
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

ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Milestones are viewable by everyone if profile not private." ON milestones;
DROP POLICY IF EXISTS "Users can manage their own milestones." ON milestones;

CREATE POLICY "Milestones are viewable by everyone if profile not private." ON milestones FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = milestones.profile_id AND (NOT profiles.is_private OR auth.uid() = profiles.id))
);

CREATE POLICY "Users can manage their own milestones." ON milestones FOR ALL USING (auth.uid() = profile_id);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'milestones') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE milestones;
  END IF;
END $$;

-- Primary Organization & Executive Affiliation
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS org_name TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS org_role TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS org_url TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS org_logo TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS org_start_year TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS org_enabled BOOLEAN DEFAULT false;

-- Confidential Executive Dossier & Resume Vault
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dossier_enabled BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dossier_title TEXT DEFAULT 'Executive Curriculum Vitae';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dossier_description TEXT DEFAULT 'Confidential career dossier and institutional track record.';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dossier_file_url TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dossier_passcode TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dossier_requires_passcode BOOLEAN DEFAULT true;

-- Skills & Tech Stack Module
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Languages',
  proficiency TEXT DEFAULT 'Advanced',
  icon_key TEXT NOT NULL,
  color TEXT,
  years_exp TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Skills are viewable by everyone if profile not private." ON skills;
DROP POLICY IF EXISTS "Users can manage their own skills." ON skills;

CREATE POLICY "Skills are viewable by everyone if profile not private." ON skills FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = skills.profile_id AND (NOT profiles.is_private OR auth.uid() = profiles.id))
);

CREATE POLICY "Users can manage their own skills." ON skills FOR ALL USING (auth.uid() = profile_id);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'skills') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE skills;
  END IF;
END $$;



