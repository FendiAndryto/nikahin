-- Migration: Create weddings table
-- Phase 2: Dashboard & Core CRUD

CREATE TABLE IF NOT EXISTS public.weddings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  groom_name TEXT NOT NULL,
  bride_name TEXT NOT NULL,
  event_date TIMESTAMPTZ,
  theme_id TEXT DEFAULT 'default',
  cover_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;

-- Owner can do everything
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'weddings' AND policyname = 'Users can CRUD own weddings'
  ) THEN
    CREATE POLICY "Users can CRUD own weddings"
      ON public.weddings FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Public can read (for invitation page, Phase 4)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'weddings' AND policyname = 'Public can view weddings by slug'
  ) THEN
    CREATE POLICY "Public can view weddings by slug"
      ON public.weddings FOR SELECT
      USING (true);
  END IF;
END $$;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'weddings_updated_at'
  ) THEN
    CREATE TRIGGER weddings_updated_at
      BEFORE UPDATE ON public.weddings
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;
