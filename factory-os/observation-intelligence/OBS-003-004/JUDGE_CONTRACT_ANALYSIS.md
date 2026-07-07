# OBS-004 → Judge — Input Contract Analysis (vertical slice)

Mission constraint: *conform the packet to what the Judge already accepts; do
not invent a new Judge interface.* This documents every Judge lane examined,
why most do not fit, the lane the owner selected, and the exact schema the
Judge consumed to produce a verdict.

## Judge lanes examined

| Candidate | Input contract it actually accepts | Fit for an OBS-004 packet |
|---|---|---|
| `src/lib/tm-int/judge/*` (TeachingCase replay) | `TeachingCasePipelineOutput` (observation+dp+ped+lm) for TC-000001..3 | ✗ keyed to teaching-case pipeline, not observation packets |
| `factory-os/product-intelligence/judgeResultContract.mjs` | `sourceObjectiveId` + **PCAP + PFLOW** + 4 named checks | ✗ OBS packets carry no PCAP/PFLOW identity |
| `factory-os/.../judge/speaking-runtime-observer-judge.mjs` | capability-gate for `PCAP-TM-TONE-PRODUCTION-ASSESSMENT` | ✗ single hard-coded capability |
| `scripts/tm-int/dp-int-factory.mjs` (workpack judge) | `judge-pass <wp_id> <artifact> <commit>` over `dp_int_workpacks` | ✗ workpack-scoped, not observation-scoped |
| `bin/c2-batch-judge-40` / `c2-v6-3-2-independent-batch-judge.py` | V6.2.6 governor over git worktrees + spec/test build | ✗ build-verification judge, not evidence-packet |
| **`bin/c2-submit-evidence.py` + `bin/c2-judge-capability.py`** | capability contract `required_evidence` + `evidence_ledger` rows | ✓ **selected** — generic, argv-driven, emits real `JUDGE_ACCEPTED`/`BLOCKED` |

The per-capability proof-recheck confirm judge that populated
`tm_int_existing_proof_judge_confirmed` (220 rows) is a one-shot script no
longer present on disk; its recorded contract (manifest at
`evidence/proof-recheck-ready/<CAP>/manifest.json`, verify contract ∈
`int_capability_contracts` + artifact sha256 checks) was reconstructed from its
outputs but **not** re-implemented (that would be faking the Judge). The
runnable member of the same TM-INT registry lane is the
`c2-submit-evidence.py` + `c2-judge-capability.py` pair — the entrypoint the
owner directed A3 to run.

## The exact contract the Judge consumed

Two layers, both in the Judge's existing schema (nothing invented):

**1. Capability contract** — `roadmap/capabilities/<CAP>.json`, read by
`c2-judge-capability.py`:
```json
{ "capability_id": "OBS-PROMPTASSEMBLY-VERTICAL-001",
  "required_evidence": ["obs-replay-evidence"] }
```

**2. Evidence manifest** — read by `c2-submit-evidence.py`:
```json
{ "capability_id": "OBS-PROMPTASSEMBLY-VERTICAL-001",
  "evidence": [ { "type": "obs-replay-evidence",
                  "path": "OBS-004-TM-INT-234.json", "verdict": "pass" } ] }
```
`path` resolves relative to the manifest dir and must exist; the intake
sha256's it into `evidence_ledger`. The **artifact itself is the OBS-004
packet** (`tm-int-obs-evidence-packet-v1`).

**Judge decision logic** (`c2-judge-capability.py`, verbatim behaviour):
`required = set(contract.required_evidence)`; `passed = {row.evidence_type for
row in evidence_ledger[cap] if row.verdict == "pass"}`; if
`required - passed` is empty → INSERT `completions` row and print
`JUDGE_ACCEPTED`; else log `blocked` and exit `BLOCKED missing evidence: …`.

### Honest scope of the "accept"
This Judge is a **ledger/presence gate**: it verifies (a) the capability
contract exists, (b) every required evidence type is present with
`verdict="pass"`, and (c) the referenced artifact file exists and is hashed.
It does **not** itself re-run the replay — the byte-for-byte replay
verification is OBS-003's job (35/35 pass, done upstream). The `verdict="pass"`
in the manifest is asserted by the submitter and backed by the OBS-003 proof
carried inside the packet. The accept means *"a well-formed, replay-proven
OBS-004 packet satisfies this capability's evidence requirement"* — not that
the Judge independently re-derived the digest.

## Run mode — staging sandbox, zero prod writes
- Staging DB = a **copy** of prod `state/c2_execution.sqlite3`.
- Judge/intake scripts run as **copies** with only the `ROOT` path constant
  redirected to the staging sandbox (logic byte-identical otherwise).
- Prod `c2_execution.sqlite3` and `c2_dashboard_state.json` sha256 **identical**
  before and after; prod rows unchanged (ledger 312 / completions 49 /
  proof_judge_decisions 221 / proof_judge_confirmed 220).

## Verdict (verbatim)
```
JUDGE_ACCEPTED OBS-PROMPTASSEMBLY-VERTICAL-001   (exit 0)
completions: judge_id=OBS-INT-STAGING-JUDGE-01, decision_note="all required evidence passed", evidence_ids=["313"]
```
Per owner instruction, A3 **stops before any prod submission** — the prod run
is a separate owner-gated step.
