-- Migration: Create gift_accounts table
-- Phase 5: Integration & Polish

CREATE TABLE IF NOT EXISTS public.gift_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE NOT NULL,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  qris_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.gift_accounts ENABLE ROW LEVEL SECURITY;

-- Owner can CRUD their wedding's gift accounts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'gift_accounts' AND policyname = 'Users can CRUD gift accounts of their weddings'
  ) THEN
    CREATE POLICY "Users can CRUD gift accounts of their weddings"
      ON public.gift_accounts FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.weddings w
          WHERE w.id = gift_accounts.wedding_id
          AND w.user_id = auth.uid()
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.weddings w
          WHERE w.id = gift_accounts.wedding_id
          AND w.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Public can read gift accounts for invitation page
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'gift_accounts' AND policyname = 'Public can view gift accounts'
  ) THEN
    CREATE POLICY "Public can view gift accounts"
      ON public.gift_accounts FOR SELECT
      USING (true);
  END IF;
END $$;

-- Auto-update updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'gift_accounts_updated_at'
  ) THEN
    CREATE TRIGGER gift_accounts_updated_at
      BEFORE UPDATE ON public.gift_accounts
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;
