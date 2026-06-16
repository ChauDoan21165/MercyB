# Step 7 Real Azure Native-Ear Evidence

Date: 2026-06-16
Validation ID: real-run-2026-06-16T092729997Z
Status: Blocked by owner

## Non-Claims

This packet does not claim Step 7 is complete.
This packet does not claim Azure ran.
This packet does not claim native-ear review has been completed.
This packet does not include production secrets, fake Azure evidence, fake reviewer evidence, or synthetic native-ear scores.

## Evidence Packet

Required run directory:

- `reports/ladder/step7-evidence/real-run-2026-06-16T092729997Z/`

Required artifacts present:

- `manifest.json`
- `live-azure-smoke.log`
- `native-ear-scores.csv`
- `owner-acceptance.md`

Additional support artifacts present:

- `preflight.json`
- `local-smoke.log`
- `native-ear-review-packet.md`
- `operator-checklist.md`

## What Ran

Command:

```bash
node scripts/step7-evidence-pack.mjs --run-live-azure --local-smoke
```

Result:

- Local no-Azure readiness smoke passed.
- Live Azure smoke was requested.
- Live Azure preflight failed because required live settings and smoke-user access were not present in the execution environment.
- `live-azure-smoke.log` records: `result=blocked_missing_preconditions` and `No live request was sent.`

## Azure Evidence Status

Blocked by owner.

`preflight.json` records these required live preconditions as missing:

- `STEP7_LIVE_AZURE_SMOKE`
- `VITE_AZURE_PHONEME_BATCH_ENABLED`
- `VITE_SUPABASE_URL`
- `STEP7_SMOKE_USER_JWT`
- `STEP7_SMOKE_USER_EMAIL`
- `STEP7_SMOKE_USER_PASSWORD`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_ANON_KEY`

The WAV fixture exists at `src/lib/pronunciation/__fixtures__/step7-known-good-i-went-to-school-yesterday.wav` and was available for the smoke path.

Durable log captured:

- `reports/ladder/step7-evidence/real-run-2026-06-16T092729997Z/live-azure-smoke.log`
- Log outcome: Azure did not run; no live request was sent.
- Presence snapshot is included without secret values.

## Native-Ear Review Status

Blocked by owner.

Prepared reviewer artifacts:

- `native-ear-review-packet.md`
- `native-ear-scores.csv`

`native-ear-scores.csv` is a 10-row completion template covering clear speech, VN-accented English, weak final consonants, /th/ substitutions, vowels, question intonation, and a poor-audio or no-match control. It is not reviewer evidence until real reviewer IDs, roles, dates, rubric scores, verdicts, and notes are filled in by native-ear reviewers against real Azure smoke output.

## Owner Acceptance Status

Blocked by owner.

`owner-acceptance.md` is present and currently records:

- `owner_acceptance_status=not_accepted`
- Blocked until real Azure evidence and real native-ear review are attached.

## Completion Gate

Step 7 remains incomplete until all of the following are attached to a `real-run-*` packet:

- `manifest.json` reports `liveAzureSmokeStatus=passed`.
- `live-azure-smoke.log` proves provider `azure`, mode `azure_phoneme_batch`, and nonzero phoneme evidence from the real smoke path.
- `native-ear-scores.csv` is completed by real native-ear reviewer(s).
- Owner accepts the exact validation ID in `owner-acceptance.md`.

## Owner Inputs Needed

- Approved live-smoke target and dashboard/runtime settings.
- Smoke-user auth path without writing secrets into reports.
- Native-ear reviewer assignments and completed scores.
- Owner acceptance after both real evidence classes are attached.
