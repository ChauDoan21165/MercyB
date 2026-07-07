# OBS-003-004 — Prod-gate flag resolution (read-only, zero prod writes)

Both flags answered from prod code + prod DB reads only. No prod writes; no
counter edits. Prod `c2_execution.sqlite3` and `int_registry.sqlite3` read-only.

## FLAG 1 — accept-gate strength: **PRESENCE + FILE-INTEGRITY, not digest re-derivation → promotion-ready**

No prod Judge entrypoint in this lane re-derives the output sha256 by re-running
the code path. Evidence, per entrypoint:

| Entrypoint | What it does with the hash | Re-derives output? |
|---|---|---|
| `c2-judge-capability.py` | reads `evidence_ledger`; accepts iff every `required_evidence` type has a row with `verdict="pass"` | ✗ presence gate |
| `c2-submit-evidence.py` | `sha256(open(artifact,"rb").read())` → stores in `evidence_ledger.artifact_sha`; **no comparison, no code run** | ✗ file-byte capture |
| off-disk proof-confirm judge | recorded warnings say `declared artifact hash checks: N` = declared manifest sha256 vs actual **file** sha256 | ✗ file-integrity only |
| `int-registry.py` governor transition | normalizes text, dedup check, flips `status` | ✗ status flip |

The output-digest re-derivation (re-run `promptAssembly`, hash the output,
compare to OBS-001) is done in **OBS-003 (35/35 byte-for-byte)** — the correct
place for it. As a second, independent check I re-hashed each packet's own
recorded `output` and compared to its stored `output_digest` and
`replay_proof.recorded_output_digest`: **35/35 pass**.

→ Because prod gates on presence + file-integrity and the digest proof already
rides inside each packet (OBS-003), **the slice is promotion-ready as-is**. No
staging re-derivation gate to pass because prod has none.

## FLAG 2 — the sibling is **NOT** the entrypoint prod coverage reads from

Prod **Judge Verified** coverage = `COUNT(int_registry WHERE status='verified')`
in **`state/int_registry.sqlite3`** — currently **447** verified / 2290
report_only.

`c2-judge-capability.py` (the sibling used for the staging verdict) writes to
`completions` in **`c2_execution.sqlite3`** — a **different database**. It never
opens `int_registry.sqlite3`, so an accept there — staging *or* prod — does
**not** move the 447. The off-disk one-shot confirm judge wrote to
`tm_int_existing_proof_judge_confirmed`, also in `c2_execution.sqlite3` — **also
not** the coverage source; restoring it is **not** required for coverage to
count.

The entrypoint that actually moves prod coverage is the **int_registry
judge-governor status transition** (`int-registry.py`, gated by
`INT_REGISTRY_ALLOW_COVERED_BY == "judge-governor"`): `report_only → verified`.

State of my 35 IDs in `int_registry` today: **33 report_only** (the real
`promptAssembly` behavioral rows = *pending judge*) + 2 marked `verified` but
under module **`promptAssemblytest`** (pre-existing anchor rows, axis
`existing-product-evidence` — a separate test module, not the behavioral
coverage). So all 35 behavioral attributions are effectively pending.

→ **The sibling is the correct lane for a presence verdict, but NOT the
coverage-moving entrypoint.** For a prod accept to count toward Judge Verified,
the owner-gated step must route the accepted, replay-proven packet through the
**int_registry judge-governor** (`report_only → verified`) — the read-only
registry the mission protects. That governor transition, not the sibling and not
the missing one-shot, is the true prod coverage gate.

## Net for the owner-gated prod submit
1. Gate strength: promotion-ready (prod = presence + file-integrity; digest
   proof is in the packets via OBS-003, independently re-derived 35/35).
2. Coverage path: a prod verdict via `c2-judge-capability.py` proves the packet
   but will **not** move Judge Verified. Moving it requires the int_registry
   judge-governor `report_only → verified` transition on these 33 IDs — an
   explicit governor-authorized action, correctly owner-gated.

Prod untouched: `int_registry.sqlite3` verified count still 447; prod
`c2_execution.sqlite3` sha256 unchanged from the OBS-004 baseline.
