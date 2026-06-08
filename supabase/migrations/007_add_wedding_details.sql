-- Migration: Add dynamic text fields for wedding details
-- Phase 3: Enhancements

ALTER TABLE public.weddings
  ADD COLUMN IF NOT EXISTS quote TEXT,
  ADD COLUMN IF NOT EXISTS groom_parents TEXT,
  ADD COLUMN IF NOT EXISTS bride_parents TEXT,
  ADD COLUMN IF NOT EXISTS akad_time TEXT,
  ADD COLUMN IF NOT EXISTS akad_location TEXT,
  ADD COLUMN IF NOT EXISTS akad_address TEXT,
  ADD COLUMN IF NOT EXISTS resepsi_time TEXT,
  ADD COLUMN IF NOT EXISTS resepsi_location TEXT,
  ADD COLUMN IF NOT EXISTS resepsi_address TEXT;

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
