# OBS-005 — Evidence-gated verify-from-obs governor (built; dry-run only)

Built the transition that makes int_registry coverage move **only** as a
function of proof. Real `int_registry.sqlite3` stayed **read-only** throughout
(sha256 `c64ea58e…` unchanged before, during, after). All building/testing on
copies.

## What was built
- `bin/c2-obs-005-verify-from-obs.py` — the governor transition.
- `bin/c2-obs-005-digest.mjs` — byte-exact digest re-derivation helper (reuses
  the exact OBS-001/003/004 digest fn, so re-derivation cannot drift from how
  packets were built).

Gate (ALL must hold, else REFUSE): (1) ID in registry; (2) status ==
`report_only`; (3) OBS-004 packet on disk; (4) `packet.tm_int_id == ID`;
(5) `replay_proof.checks` all true; (6) identity bind `packet.module/axis ==
registry.module/axis`; (7) digest re-derivation at flip time —
`node_digest(packet.output) == packet.output_digest ==
replay_proof.recorded_output_digest == OBS-001 recorded`. **No flip path skips
the evidence check** — the only place `status='verified'` is written is inside
this gate, after all seven checks.

## Dry-run on a COPY of the 35 attributed IDs — **33 flip / 2 refuse**
Zero writes to the real registry (ran against `int_registry.COPY`).
- **33 would flip** (all `promptAssembly` report_only rows, identity-bound,
  replay-passing, digest chain re-derived): TM-INT-2198, 2199, 2203, 2204, 2206,
  2208, 2315, 2357, 2378, 2399, 2483, 2504, 2546, 2567, 2588, 2609, 2651, 2693,
  2735, 2756, 2840, 2882, 2903, 2924, 3008, 3029, 3071, 3092, 3113, 3134, 3176,
  3218, 3260.
- **2 refuse:**
  - `TM-INT-234` → `not_report_only:verified`
  - `TM-INT-235` → `not_report_only:verified`
  (both are pre-existing `promptAssemblytest` anchor rows already verified —
  the gate refuses to re-verify or touch non-`report_only` rows.)
- Artifact: `state/OBS-005-verify-from-obs/OBS-005-dryrun-result.json`.

## Gate is non-vacuous — negative tests (all correctly REFUSED)
| Tamper | Reason returned |
|---|---|
| output mutated so digest no longer matches | `digest_rederive_mismatch` |
| `replay_proof.checks.output_digest_match=false` | `replay_checks_failed:output_digest_match` |
| packet `axis` changed | `axis_mismatch:packet=…!=registry=…` |
| OBS-004 packet absent | `no_obs004_packet` |

## Write-path validated (on a COPY, for the owner-approved real run)
- `--commit` **without** `OBS_GOVERNOR_AUTH=obs-evidence-gate` → refused.
- `--commit` **with** auth (on copy) → 33 flipped; each verified row carries
  `verified_evidence_ref` (packet_id + output_digest + OBS-003/001 run_ids); 33
  `int_registry_events` rows `type=verified_from_obs_evidence`; copy verified
  447 → 480. Real registry untouched.

## GUARDRAIL 2 — lock the ungated verify path (recommended; NOT done)
Today `int-registry.py register --status verified` sets verified with no
evidence (its `evidence_hash` is just `sha256(source_queue|behavior_boundary)`).
Recommend, so coverage can only be **earned**:
1. In `register()`, reject `--status verified` for new behavioral intake — route
   all verifies through `c2-obs-005-verify-from-obs.py`.
2. Add a DB guard on `int_registry`: `BEFORE INSERT/UPDATE WHEN NEW.status=
   'verified' AND NEW.verified_evidence_ref IS NULL → RAISE(ABORT)`, with a
   one-time grandfather of the existing 447 backfill rows (tagged as backfill).
   After that, `verified` is unreachable without an evidence ref.
Describe-only per instruction; the DB guard + register change are the next
commit once approved.

## AUDIT — honest provenance of the existing 447 (for dashboard/investors)
> Coverage today is **447 verified** TM-INT capabilities. **All 447** were
> established by **import-time backfill** (`event_type=backfill_register`,
> `source_queue=repo-contracts`) — asserted verified from pre-existing
> repository contract files, **not** earned by runtime evidence. **0** are
> OBS-evidence-earned to date. OBS-005 is the first path by which a capability
> earns `verified` from a replay-passing runtime evidence packet; until it is run
> against the real registry (owner-approved), the OBS-evidence-earned count stays
> 0. The 447 are unaltered here — they should be **labeled "trusted-source
> backfill"** on the dashboard so the headline number stops implying runtime
> verification it never had. After the approved OBS-005 flip of the 33, coverage
> would read **480 = 447 trusted-source backfill + 33 OBS-evidence-earned**, and
> only the 33 would carry a re-derivable `verified_evidence_ref`.

## Owner gate
Real flip NOT run. On approval: `OBS_GOVERNOR_AUTH=obs-evidence-gate python3
bin/c2-obs-005-verify-from-obs.py --commit --db <REAL int_registry.sqlite3>
--packets-dir … --obs001 … --ids-from …` → flips exactly the 33, each with an
evidence ref. Real registry sha256 `c64ea58e…` unchanged until then.
