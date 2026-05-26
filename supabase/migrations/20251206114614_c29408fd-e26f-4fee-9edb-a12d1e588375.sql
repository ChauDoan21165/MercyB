-- Add unique index on gift_codes.code to prevent race condition duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_gift_codes_code_unique ON public.gift_codes (code);