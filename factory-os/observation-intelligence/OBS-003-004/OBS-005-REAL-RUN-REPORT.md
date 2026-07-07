# OBS-005 — REAL run: evidence-gated flip 447→480 + Guardrail 2 + provenance split

Owner-approved real run. Exactly the 33 flipped through the evidence gate; the
447 backfill and 2 anchors untouched; Guardrail-2 guard applied and proven;
dashboard now shows the backfill/earned split.

## The flip — real registry, via the gate
Backup first: `state/int_registry.sqlite3.bak-pre-obs005-20260707` (sha `c64ea58e…`).

| | sha256 | verified | report_only |
|---|---|---|---|
| **before** | `c64ea58e2271…` | **447** | 2290 |
| **after flip** | `2819ec1ae2bf…` | **480** | 2257 |
| after guard install | `75e2a33e9f76…` | 480 | 2257 |

- Live gate output: **flip_count=33, refuse_count=2**. The 33 flipped list
  **equals the dry-run list exactly** (asserted `sorted(real)==sorted(dry)`), so
  copy and real agree — no delta.
- The 2 refused: `TM-INT-234`, `TM-INT-235` → `not_report_only:verified`
  (pre-existing `promptAssemblytest` anchors, untouched).
- The count moved **because the gate ran** — verified rows carrying an evidence
  ref = **33**; verified rows without a ref (the untouched backfill) = **447**.
- Each of the 33 carries a re-derivable `verified_evidence_ref`, e.g. TM-INT-2198:
  `{"packet_id":"OBS-004-TM-INT-2198","output_digest":"sha256:f3afe433…",
    "obs003_run_id":"obs003-proof-run-001","obs001_run_id":"obs001-proof-run-001"}`
- **33** `int_registry_events` rows `type=verified_from_obs_evidence`.
- The 447 backfill rows and the 2 anchors: **unchanged** (no status change, no
  ref, no event).
- Artifact: `state/OBS-005-verify-from-obs/real-flip-output.json`.

## Guardrail 2 — verified is now unreachable without an evidence ref
Two triggers on `int_registry` (`bin/guardrail2.sql`), grandfathering the 447
(triggers fire only on new INSERT/UPDATE, existing rows untouched):
```sql
BEFORE INSERT / BEFORE UPDATE OF status
WHEN NEW.status='verified' AND NEW.verified_evidence_ref IS NULL
  -> RAISE(ABORT, 'status=verified requires verified_evidence_ref');
```
Tested on a COPY, then applied to the real DB:
- ungated raw `UPDATE … SET status='verified'` (no ref) → **ABORT**, row stays report_only.
- ungated `int-registry.py register --status verified` → **ABORT**, no row inserted.
- evidence-backed verify (ref set) → **allowed** (honest path unblocked).
- On the real DB (post-install): a transactional ungated re-verify **ABORTS**
  (rolled back, zero net change). 480 verified intact.

## Provenance split — dashboard DISPLAY (rows unaltered)
`bin/tm-int-dashboard.py` `state()` now emits `verified_provenance`
(read-only aggregation; the 447 rows are never touched):
```
480 = 447 trusted-source backfill + 33 OBS-evidence-earned
```
`trusted_source_backfill` = verified with `verified_evidence_ref IS NULL` (447);
`obs_evidence_earned` = verified with a ref (33). Rendered as a "Verified
Provenance" row in the dashboard HTML. Guarded so registries lacking the column
degrade gracefully.

## Net
Coverage moved 447→480 **honestly**: only IDs with a replay-passing OBS-004
packet whose digest re-derived at flip time were verified, each carrying an
auditable evidence ref. Going forward, `verified` cannot be asserted by decree —
the guard requires a ref. The headline now distinguishes the 447 legacy
trusted-source backfill from the 33 (and future) OBS-evidence-earned.
