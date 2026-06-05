-- Migration: Create wishes table
-- Phase 4: Public Invitation & RSVP

CREATE TABLE IF NOT EXISTS public.wishes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE NOT NULL,
  guest_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_wishes_wedding_id ON public.wishes(wedding_id);

-- RLS
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

-- Anyone can view wishes
CREATE POLICY "Public can view wishes"
  ON public.wishes FOR SELECT
  USING (true);

-- Anyone can insert wishes (public form)
CREATE POLICY "Public can insert wishes"
  ON public.wishes FOR INSERT
  WITH CHECK (true);

-- Wedding owner can delete wishes
CREATE POLICY "Wedding owner can delete wishes"
  ON public.wishes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.weddings
      WHERE weddings.id = wishes.wedding_id
      AND weddings.user_id = auth.uid()
    )
  );

-- Enable realtime for wishes table
ALTER PUBLICATION supabase_realtime ADD TABLE public.wishes;
