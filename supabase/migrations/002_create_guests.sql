-- Migration: Create guests table
-- Phase 3: Guest Management

CREATE TABLE IF NOT EXISTS public.guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  phone_number TEXT,
  is_attending BOOLEAN DEFAULT NULL,
  companion_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  -- Unique slug per wedding
  UNIQUE(wedding_id, slug)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_guests_wedding_id ON public.guests(wedding_id);
CREATE INDEX IF NOT EXISTS idx_guests_slug ON public.guests(wedding_id, slug);

-- RLS
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Owner (wedding creator) can do everything
CREATE POLICY "Wedding owner can CRUD guests"
  ON public.guests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.weddings
      WHERE weddings.id = guests.wedding_id
      AND weddings.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.weddings
      WHERE weddings.id = guests.wedding_id
      AND weddings.user_id = auth.uid()
    )
  );

-- Public can view guests (for RSVP page to look up guest by slug)
CREATE POLICY "Public can view guests"
  ON public.guests FOR SELECT
  USING (true);

-- Public can update RSVP fields (is_attending, companion_count)
CREATE POLICY "Public can RSVP"
  ON public.guests FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Auto-update updated_at trigger (reuse existing function)
CREATE TRIGGER guests_updated_at
  BEFORE UPDATE ON public.guests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
