-- ==============================================================================
-- DOCKLY PRO: CURRENT ORGANIZATION & CONFIDENTIAL DOSSIER PATCH
-- Run this script in the Supabase SQL Editor to activate Organization and Dossier Vault.
-- ==============================================================================

-- 1. Primary Organization & Executive Affiliation
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS org_name TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS org_role TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS org_url TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS org_logo TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS org_start_year TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS org_enabled BOOLEAN DEFAULT false;

-- 2. Confidential Executive Dossier & Resume Vault
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dossier_enabled BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dossier_title TEXT DEFAULT 'Executive Curriculum Vitae';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dossier_description TEXT DEFAULT 'Confidential career dossier and institutional track record.';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dossier_file_url TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dossier_passcode TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dossier_requires_passcode BOOLEAN DEFAULT true;
