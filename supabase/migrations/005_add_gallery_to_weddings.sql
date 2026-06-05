-- Migration: Add gallery_urls to weddings
-- Phase 5: Integration & Polish

ALTER TABLE public.weddings
ADD COLUMN IF NOT EXISTS gallery_urls TEXT[] DEFAULT '{}';
