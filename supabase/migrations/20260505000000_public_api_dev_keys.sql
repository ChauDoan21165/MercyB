-- Step 11 — Public API: developer accounts, API keys, request logs.
--
-- Goal: let third-party apps integrate MercyBlade. This migration lays
-- the persistence layer; the matching edge function lives at
-- supabase/functions/public-api/.
--
-- Three tables, parent-child:
--   developer_accounts   — one row per signed-up developer (email + app)
--   developer_api_keys   — N keys per account; SHA-256 hash stored, raw
--                          key shown to user once at creation
--   api_request_logs     — append-only request log for rate-limit math +
--                          observability. anon_ip is opt-in metadata.
--
-- RLS: zero public access. Admin role (get_admin_level >= 7) is the only
-- reader. Writes happen via the edge function under the service-role
-- key, which bypasses RLS — policies guard against accidental misuse
-- from the anon/authenticated paths.
--
-- Reversibility:
--   DROP TABLE IF EXISTS public.api_request_logs;
--   DROP TABLE IF EXISTS public.developer_api_keys;
--   DROP TABLE IF EXISTS public.developer_accounts;

-- ── 1. Tables ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.developer_accounts (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  app_name    text not null,
  contact     text,                         -- optional secondary contact
  created_at  timestamptz not null default now(),
  active      boolean not null default true
);

CREATE INDEX IF NOT EXISTS idx_developer_accounts_email
  ON public.developer_accounts (email);

CREATE TABLE IF NOT EXISTS public.developer_api_keys (
  id                     uuid primary key default gen_random_uuid(),
  developer_account_id   uuid not null references public.developer_accounts(id) on delete cascade,
  key_hash               text not null,    -- SHA-256 hex of the raw key
  key_prefix             text not null,    -- first 8 chars of raw key, for UI display + lookup
  name                   text,             -- developer-supplied label
  scopes                 text[] not null default '{}'::text[],
  created_at             timestamptz not null default now(),
  last_used_at           timestamptz,
  revoked_at             timestamptz
);

-- Lookup path on hot reads: bearer token → SHA-256 hash → row by hash.
CREATE INDEX IF NOT EXISTS idx_developer_api_keys_hash
  ON public.developer_api_keys (key_hash);

-- Prefix lookup for UI and admin search ("show me keys starting with mb_…").
CREATE INDEX IF NOT EXISTS idx_developer_api_keys_prefix
  ON public.developer_api_keys (key_prefix);

CREATE INDEX IF NOT EXISTS idx_developer_api_keys_account_active
  ON public.developer_api_keys (developer_account_id)
  WHERE revoked_at IS NULL;

CREATE TABLE IF NOT EXISTS public.api_request_logs (
  id            bigserial primary key,
  key_id        uuid references public.developer_api_keys(id) on delete cascade,
  endpoint      text not null,
  status_code   int not null,
  ms            int not null,
  anon_ip       text,                       -- opt-in IP for abuse triage
  created_at    timestamptz not null default now()
);

-- Sliding-window rate limit reads: "all rows for key X in the last 1 hour".
-- Composite index on (key_id, created_at) makes that range scan cheap.
CREATE INDEX IF NOT EXISTS idx_api_request_logs_key_window
  ON public.api_request_logs (key_id, created_at DESC);

-- ── 2. RLS — admin-only ───────────────────────────────────────────────────

ALTER TABLE public.developer_accounts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_api_keys  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_request_logs    ENABLE ROW LEVEL SECURITY;

-- Helper: existing get_admin_level function. Threshold 7 follows other
-- admin-gated tables (audit, billing-metrics).
DROP POLICY IF EXISTS "developer_accounts_admin_select" ON public.developer_accounts;
CREATE POLICY "developer_accounts_admin_select"
  ON public.developer_accounts FOR SELECT
  USING (public.get_admin_level() >= 7);

DROP POLICY IF EXISTS "developer_api_keys_admin_select" ON public.developer_api_keys;
CREATE POLICY "developer_api_keys_admin_select"
  ON public.developer_api_keys FOR SELECT
  USING (public.get_admin_level() >= 7);

DROP POLICY IF EXISTS "api_request_logs_admin_select" ON public.api_request_logs;
CREATE POLICY "api_request_logs_admin_select"
  ON public.api_request_logs FOR SELECT
  USING (public.get_admin_level() >= 7);

-- No INSERT/UPDATE/DELETE policies are declared. The edge function
-- writes via the service-role key (bypasses RLS); the anon and
-- authenticated roles get zero write access by RLS default-deny.

-- Documentation
COMMENT ON TABLE public.developer_accounts IS
  'Step 11: third-party developer accounts that can be issued API keys.';
COMMENT ON TABLE public.developer_api_keys IS
  'Step 11: hashed API keys. Raw key is shown to the user only once at creation; only SHA-256 hash + prefix are stored.';
COMMENT ON TABLE public.api_request_logs IS
  'Step 11: append-only public-API request log. Drives rate-limit math + admin observability. anon_ip is opt-in.';
COMMENT ON COLUMN public.developer_api_keys.key_hash IS
  'SHA-256 hex of the raw key. Compared with constant-time equality at request time.';
COMMENT ON COLUMN public.developer_api_keys.key_prefix IS
  'First 8 chars of the raw key, for UI display ("mb_abc123…") and admin search.';
COMMENT ON COLUMN public.developer_api_keys.scopes IS
  'Array of scope strings (e.g. {"sentence:read","l1:detect"}). Empty array = no scoped endpoints; future-proofing.';
