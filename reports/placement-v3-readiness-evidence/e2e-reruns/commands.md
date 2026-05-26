# Placement V3 vertical E2E rerun commands

Run 1 normal command:
npm run test:e2e -- placement-v3-vertical

Run 2 explicit flags command:
VITE_PLACEMENT_TEST_ENABLED=true VITE_PLACEMENT_V3_UI_ENABLED=true VITE_SUPABASE_URL=https://placeholder.invalid.supabase.co VITE_SUPABASE_ANON_KEY=<redacted placeholder> npm run test:e2e -- placement-v3-vertical

Run 3 explicit flags + trace command:
VITE_PLACEMENT_TEST_ENABLED=true VITE_PLACEMENT_V3_UI_ENABLED=true VITE_SUPABASE_URL=https://placeholder.invalid.supabase.co VITE_SUPABASE_ANON_KEY=<redacted placeholder> npx playwright test -c playwright.smoke.config.ts placement-v3-vertical --trace on --output reports/placement-v3-readiness-evidence/e2e-reruns/run-3-explicit-flags-trace-on/test-results
