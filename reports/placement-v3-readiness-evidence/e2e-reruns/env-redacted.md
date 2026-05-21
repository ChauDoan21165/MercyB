# Redacted env used for reruns

- VITE_PLACEMENT_TEST_ENABLED: unset for run 1; true for runs 2 and 3
- VITE_PLACEMENT_V3_UI_ENABLED: unset for run 1; true for runs 2 and 3
- VITE_SUPABASE_URL: unset/default for run 1; https://placeholder.invalid.supabase.co for runs 2 and 3
- VITE_SUPABASE_ANON_KEY: unset/default for run 1; redacted placeholder for runs 2 and 3
- TEST_BASE_URL: default http://127.0.0.1:3107
- Playwright config: playwright.smoke.config.ts
- Note: stale port 3107 dev server was stopped before each run when present so Vite env matched the command.
