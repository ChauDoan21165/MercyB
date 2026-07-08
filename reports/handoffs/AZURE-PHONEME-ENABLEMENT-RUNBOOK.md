# Azure Phoneme Scoring — Enablement Runbook

Status as of 2026-07-08: BUILT, config-disabled, gated behind human validation.
This is your flagship pronunciation-scoring feature. It is deliberately gated behind
a native-ear review + owner acceptance (Step 7 quality gate). Do NOT flip it live
until every gate below passes. Rushing past the gate ships unvalidated pronunciation
feedback to Vietnamese learners — worse than leaving it dark.

Owner: Chau (secrets, Azure/Supabase/Cloudflare accounts, final acceptance).
Reviewers: 2+ native-ear reviewers required before closeout.

---

## What "enabled" actually requires (two sides + a region fix)

The feature is gated by TWO different env vars in TWO different places, plus a region
that must NOT be left at the default:

BACKEND (Supabase Edge Function `azure-phoneme` secrets):
- AZURE_SPEECH_KEY            = <from Azure portal, mercyblade-speech-asia resource>
- AZURE_SPEECH_REGION         = <the ASIAN region string — NOT the default>
- AZURE_PHONEME_BATCH_ENABLED = true

FRONTEND (Cloudflare Pages build env, then rebuild+deploy):
- VITE_AZURE_PHONEME_BATCH_ENABLED = true

CRITICAL REGION BUG: every function defaults AZURE_SPEECH_REGION to "canadacentral"
(supabase/functions/azure-phoneme/index.ts:52, azure-stt/index.ts:16,
azure-phoneme-stream/index.ts:67). Your resource is mercyblade-speech-asia (Asian).
If you enable WITHOUT explicitly setting AZURE_SPEECH_REGION to the correct Asian
region, requests hit the wrong region and fail. The region string is NOT
"mercyblade-speech-asia" (that's the resource name) — it's an Azure region like
"southeastasia" or "eastasia". Get the exact value from the Azure portal.

---

## STEP 0 — Get the real values (Azure portal, ~5 min)
- [ ] Azure portal → mercyblade-speech-asia resource → note the exact Region
      (e.g. southeastasia / eastasia).
- [ ] Copy KEY 1 (subscription key).
- [ ] Do NOT paste either value into any committed file or into chat.

## STEP 1 — Local readiness smoke (no Azure spend, no live calls)
Confirms the harness works end-to-end with your REAL Supabase before spending Azure.
Fill real values (these are shell exports; nothing is committed):
```bash
export STEP7_LIVE_AZURE_SMOKE=true
export VITE_AZURE_PHONEME_BATCH_ENABLED=true
export VITE_SUPABASE_URL="<real supabase url>"
export VITE_SUPABASE_ANON_KEY="<real anon key>"
export STEP7_SMOKE_USER_EMAIL="chaudoan@yahoo.com"   # canary account
export STEP7_SMOKE_USER_PASSWORD="<canary password>"
node scripts/step7-evidence-pack.mjs --local-smoke 2>&1 | tail -30
```
- [ ] manifest shows localSmokePassed=true. (If false, fix before spending Azure.)
NOTE: last dry-run left VITE_SUPABASE_URL as the literal placeholder "<your supabase
url>" — the preconditions "ready" flag was a false positive. Use REAL values here.

## STEP 2 — Set Azure secrets on the DEPLOYED function (Supabase)
The azure-phoneme function reads its env from Supabase Edge Function secrets, NOT
local .env. Set via dashboard or CLI:
```bash
# CLI form (values from Step 0 — not echoed here):
supabase secrets set AZURE_SPEECH_KEY="<key>" \
  AZURE_SPEECH_REGION="<asia-region>" \
  AZURE_PHONEME_BATCH_ENABLED="true" \
  --project-ref buemdfxyhxunzpgdoqin
```
- [ ] All three set. Region is the ASIAN string, not canadacentral.
- [ ] Redeploy the azure-phoneme function if your setup requires it to pick up secrets.

## STEP 3 — Live Azure smoke (real phoneme evidence)
```bash
# same exports as Step 1, then:
node scripts/step7-evidence-pack.mjs --run-live-azure --local-smoke 2>&1 | tail -40
```
- [ ] manifest.json: liveAzureSmokeStatus=passed
- [ ] live-azure-smoke.log proves provider=azure / mode=azure_phoneme_batch with
      nonzero phoneme evidence
- [ ] live-azure-smoke.log contains NO secret values (check before sharing)

## STEP 4 — Native-ear validation (the human gate — required)
- [ ] >= 2 native-ear reviewers score all 10 rows in native-ear-scores.csv:
      clear speech, VN-accented English, weak final consonants, /th/ substitution,
      vowels, question intonation, and one no-match/poor-audio case.
- [ ] Reviewers judge: is the learner-facing feedback ACCURATE, KIND, and USEFUL?
- [ ] Any overclaim (phoneme/tone claims not supported by evidence) = FAIL. Fix or
      explicitly waive.

## STEP 5 — Owner acceptance
- [ ] Chau reviews the evidence pack + reviewer scores.
- [ ] Sign owner-acceptance.md. Step 7 is NOT complete without this.

## STEP 6 — Ship to learners (only after Steps 1–5 pass)
- [ ] Cloudflare Pages build env: set VITE_AZURE_PHONEME_BATCH_ENABLED=true
- [ ] Rebuild + deploy (VITE_CONVERSATION_RETENTION_HOOKS=true npm run build →
      wrangler pages deploy dist --project-name mercyblade --branch=main)
- [ ] Verify in production with a real learner flow that phoneme feedback renders.
- [ ] Monitor Azure billing + Sentry (org chau-doan / project mercyblade-web) for
      the first live sessions.

## ROLLBACK
If live feedback is wrong/unsafe after launch: set
VITE_AZURE_PHONEME_BATCH_ENABLED=false in Cloudflare, rebuild+deploy. Feature goes
dark, no code revert needed. Optionally set AZURE_PHONEME_BATCH_ENABLED=false in
Supabase to stop backend calls + Azure spend.

---

## Why this is gated (do not shortcut)
This is the VN<->EN pronunciation moat. Wrong or unkind feedback to a Vietnamese
learner damages the exact differentiator vs Duolingo. The native-ear + owner gate
exists on purpose. Enabling is a product milestone to schedule with reviewers, not a
config flip to rush.
