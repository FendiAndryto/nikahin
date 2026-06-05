-- Migration: Add groom photo, bride photo, and music
-- Phase: Post-Phase 5 Extras

ALTER TABLE public.weddings
ADD COLUMN IF NOT EXISTS groom_photo_url TEXT,
ADD COLUMN IF NOT EXISTS bride_photo_url TEXT,
ADD COLUMN IF NOT EXISTS music_url TEXT;
