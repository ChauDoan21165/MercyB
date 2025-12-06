-- Add unique constraint on gift_codes.code to prevent race condition duplicates
CREATE UNIQUE INDEX IF NOT EXISTS gift_codes_code_unique ON public.gift_codes (code);