# End-to-end smoke suite

Five Playwright specs covering the critical flows shipped in the last sprint:

| Spec                                     | What it verifies                                                      |
| ---------------------------------------- | --------------------------------------------------------------------- |
| `auth-and-placement.spec.ts`             | New signup → placement → `profiles.placement_cefr_level` set → Home   |
| `grammar-and-l1-detection.spec.ts`       | Mercy Guide grammar tab → correction + L1 hint → Learn more nav       |
| `pronunciation-full-flow.spec.ts`        | `/speak` → mic → phoneme feedback → Try these words → `/speech/history` |
| `streak-flow.spec.ts`                    | `user_room_progress` insert → streak trigger → Home badge + Account panel |
| `admin-flag-control.spec.ts`             | Admin toggle in `/admin/feature-flags` → end-user gating flips        |

## Running

```bash
# Full suite against the local dev server
npm run test:e2e

# Interactive UI mode
npm run test:e2e:ui

# One spec only
npx playwright test tests/e2e/auth-and-placement.spec.ts -c playwright.smoke.config.ts
```

The smoke config spins up `npm run dev` on `127.0.0.1:3107` automatically (via `webServer:`). If you already have a dev server running, it's reused.

## Environment variables

The specs run against a **dedicated test Supabase project** — not production. Put these in `.env.test.local` (git-ignored) or export them before running:

```bash
# Required for every spec that talks to Supabase
TEST_SUPABASE_URL=https://<test-project>.supabase.co
TEST_SUPABASE_ANON_KEY=<test-anon-key>

# Required for specs that bypass RLS (seed streak row, verify profile,
# delete test user, etc.)
TEST_SUPABASE_SERVICE_KEY=<test-service-role-key>

# Required for specs that assume an existing non-admin account
TEST_USER_EMAIL=e2e-user@mercyblade-smoke.test
TEST_USER_PASSWORD=<secret>

# Required for admin-flag-control.spec
TEST_ADMIN_EMAIL=e2e-admin@mercyblade-smoke.test
TEST_ADMIN_PASSWORD=<secret>
# The admin account must have admin_level >= 9 in admin_users.

# Optional — defaults to http://127.0.0.1:3107
TEST_BASE_URL=http://127.0.0.1:3107
```

Specs call `test.skip(!hasSupabaseTestCreds(), ...)` so missing env vars produce **skipped** suites, not red failures. Read the Playwright HTML report to see which specs actually ran.

## What's stubbed

- `SpeechRecognition` / `webkitSpeechRecognition` — deterministic fake that resolves with a caller-supplied transcript after 50 ms. Installed per-test via `installWebSpeechStubs(page, { transcript })`.
- `speechSynthesis.speak` — silent no-op (still fires `onend`).
- `api.openai.com`, `api.anthropic.com`, `api.stripe.com`, `checkout.stripe.com`, `js.stripe.com` — all return a 200 with `{ stubbed: true }`. A runaway spec can't spend money or hit a live LLM.

## What's real

- Supabase (against the test project)
- The full React app
- Your local `npm run dev` server

## Test account setup (one-time)

In your test Supabase project's SQL editor:

```sql
-- After creating TEST_ADMIN_EMAIL via normal signup, promote it:
INSERT INTO public.admin_users (user_id, email, level)
SELECT id, email, 10
FROM auth.users
WHERE email = 'e2e-admin@mercyblade-smoke.test'
ON CONFLICT (user_id) DO UPDATE SET level = 10;
```

The regular `TEST_USER_EMAIL` just needs `pronunciationScoringEnabled` turned on for it (either globally or as a cohort entry) for `pronunciation-full-flow.spec` to run.

## Known bugs surfaced

See the PR description — this suite was a vehicle for finding real regressions, not just guarding against new ones.
