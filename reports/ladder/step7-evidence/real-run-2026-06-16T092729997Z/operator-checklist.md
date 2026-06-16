# Step 7 Operator Checklist

validation_id=real-run-2026-06-16T092729997Z
generated_at=2026-06-16T09:27:29.998Z

## Before Running Live Azure Smoke

- [ ] Use a staging or explicitly approved production target.
- [ ] Confirm no secret values will be pasted into reports.
- [ ] Confirm STEP7_LIVE_AZURE_SMOKE=true.
- [ ] Confirm VITE_AZURE_PHONEME_BATCH_ENABLED=true.
- [ ] Confirm VITE_SUPABASE_URL is set.
- [ ] Provide either STEP7_SMOKE_USER_JWT or smoke-user email/password plus Supabase anon key.
- [ ] Confirm the smoke WAV exists and is approved for this validation.

## Commands

Local readiness only:

```bash
node scripts/step7-evidence-pack.mjs --local-smoke
```

Live Azure evidence capture:

```bash
node scripts/step7-evidence-pack.mjs --run-live-azure --local-smoke
```

## Evidence Review

- [ ] manifest.json says liveAzureSmokeStatus=passed.
- [ ] live-azure-smoke.log contains no secret values.
- [ ] live-azure-smoke.log proves provider=azure or mode=azure_phoneme_batch and nonzero phoneme evidence through the harness result.
- [ ] native-ear-scores.csv is completed by real reviewer(s).
- [ ] Owner accepts the evidence before any Step 7 completion claim.
