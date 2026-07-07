# FACTORY REPORT FOR CHATGPT — A3 · OBS-003 + OBS-004 vertical slice

**Scope:** the 35 `status=attributed` / `confidence=high` promptAssembly records
from A2's OBS-002. Prove the pipe OBS-002 → replay → evidence packet → real
Judge verdict, end-to-end, on one group. A2's target map / enumeration untouched.

## OBS-003 — Replay: **35 / 35 PASS**
Each attributed record re-ran the **real** MercyB `promptAssembly` function via
the exact OBS-001 driver probe binding (same hookmap, same `AXIS_PROBE`, same
inputs), re-derived digests with the same `sha256(str | JSON.stringify)` fn
OBS-001 used, and compared to OBS-001's recorded values. All three checks —
`code_path`, `input_digest`, `output_digest` — matched **byte-for-byte** on all
35. Zero replay fails. 12 distinct probes exercised.
- Artifact: `state/OBS-003-replays.jsonl`
- Replay target is OBS-001's recorded `output_digest` (not the OBS-002
  "sharpened" digest), e.g. TM-INT-2198 → `sha256:f3af…` matches OBS-001.

## OBS-004 — Evidence packets: **35 built**
One Judge-consumable packet per replay-passing record
(`tm-int-obs-evidence-packet-v1`), each carrying `tm_int_id, axis, code_path,
input, output, output_digest, replay_proof` (recorded vs replayed digests +
per-check booleans), `attribution` (status/confidence/evidence/sharpened), and
`run_ids` + `lineage` linking OBS-003 → OBS-002 → OBS-001.
- Artifacts: `state/OBS-004-evidence-packets/*.json` (+ `manifest.json`)

## Judge verdict — **ACCEPT (staging, zero prod writes)**
Judge lane: TM-INT registry lane; runnable entrypoint =
`c2-submit-evidence.py` + `c2-judge-capability.py` (unmodified logic, ROOT
redirected to a staging sandbox; staging DB = copy of prod). One packet
(`OBS-004-TM-INT-234.json`) submitted. Verdict **verbatim**:
```
JUDGE_ACCEPTED OBS-PROMPTASSEMBLY-VERTICAL-001   (exit 0)
completions: judge_id=OBS-INT-STAGING-JUDGE-01
             decision_note="all required evidence passed"  evidence_ids=["313"]
```
Full contract + honest scope of the accept: `JUDGE_CONTRACT_ANALYSIS.md`.
Transcript + staging inputs: `state/OBS-004-judge-verdict/`.

### Coverage counters — prod UNCHANGED (verified)
No counter edited by hand. The verdict was issued by the real Judge in staging
only. Prod `c2_execution.sqlite3` and `c2_dashboard_state.json` **sha256
identical** before/after; prod rows unchanged (ledger 312 / completions 49 /
proof_judge_decisions 221 / proof_judge_confirmed 220). Prod **Judge Verified /
Pending Judge did not move** — as required for a staging class-validation probe.

## Owner-gated next step (NOT done here)
Per instruction, A3 stopped before any prod submission. Promoting this verdict
to prod (which would move real coverage) is a separate owner decision. On a
prod accept, A2's report says the next lease unblocks (`aiTutorService`,
84 IDs / 4 probes).

## Compliance
Registry read-only. No Judge / Promotion / dashboard / counter code changed. No
fake TM INT IDs. PAUSE markers untouched. Deterministic scripts for
replay/packet-build/submission; Claude for wiring + analysis. Branch
`obs/obs-003-004-vertical` (own branch, off A2's OBS-001 base for lineage) —
MR open, owner-only merge.
