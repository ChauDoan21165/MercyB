-- Cost-per-language instrumentation.
--
-- OUTPUT ONLY. Apply MANUALLY via the Supabase SQL Editor or the psql pooler.
-- Do NOT run `supabase db push`. Non-destructive: adds one nullable column.
--
-- No backfill — the per-language cost chart starts from instrumentation day
-- (the admin UI states this). The column is populated server-side by the
-- ai-chat edge function: language_pair = "<profiles.native_language>-en"
-- (the Mercy tutor's target language is English — the X→English factory thesis).

alter table public.ai_usage_logs
  add column if not exists language_pair text;

-- Supports the per-pair, per-day grouped reads the admin chart issues.
create index if not exists ai_usage_logs_language_pair_created_idx
  on public.ai_usage_logs (language_pair, created_at)
  where language_pair is not null;

comment on column public.ai_usage_logs.language_pair is
  'Native-target language pair for the spend event, e.g. "vi-en" (X→English). '
  'Null for events recorded before instrumentation or when native_language is unset.';
