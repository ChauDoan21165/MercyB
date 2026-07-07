# OBS-003-004 — Governor legitimacy of the report_only→verified flip (read-only)

Answered from prod code + prod DB reads only. Zero writes to
`int_registry.sqlite3` (sha256 unchanged: `c64ea58e…`). No governor run.

## Q1 — What authorizes the flip? **Nothing evidence-based. There is no gated flip at all.**

- `int-registry.py` exposes only `init` / `register` / `audit` — **no
  status-transition command**. A precise grep for `UPDATE int_registry` across
  `bin/` returns **nothing**: no code flips an existing `report_only` row to
  `verified`.
- `register` *inserts* a row with whatever `--status` is passed. `--status
  verified` is **not gated** (only `covered_by` / `duplicate` / `already_covered`
  require `INT_REGISTRY_ALLOW_COVERED_BY=judge-governor`). Its only "evidence" is
  `evidence_hash = sha256(f"{source_queue}|{behavior_boundary}")` — a hash of two
  **description strings**, not a link to any artifact, ledger, or replay proof.
- `int_registry_gate.py` policy, verbatim: *"new worker-created intake is
  report_only; verified is preserved only from trusted existing source rows."*
- Origin of the 447 verified rows: **100% `event_type=backfill_register`,
  `source_queue=repo-contracts`** — imported from pre-existing repo contract
  files already deemed trusted, stamped verified at import. None were *earned* by
  flipping a `report_only` row.

**Verdict:** the registry has **no evidence-gated `report_only→verified`
transition**. Setting my 33 IDs to verified would be a raw `register`/insert that
asserts verified **on command, with no precondition that reads any proof** — i.e.
a counter edit dressed as a verdict. That is exactly what "no counter edits /
Judge PASS is the only completion signal" forbids. **Do not run it.**

## Q2 — Can the governor read the OBS evidence today? **No — it is blind to it.**

The `int_registry` schema is `(tm_int_id, semantic_key, module, axis,
behavior_boundary, normalized_boundary, status, covered_by, source_queue,
evidence_hash, created_at, updated_at)`. There is **no column, join, or path**
referencing `evidence_ledger`, OBS-004 packets, `tm-int-observations.jsonl`, or
OBS-003 replays. `register`'s inputs are CLI args + a text `evidence_hash`.

So a flip today would assert `verified` **without the registry ever seeing** the
OBS-004 packet or the OBS-003 byte-for-byte replay proof. There is **no wired
path** from "OBS pipe proved this ID" to "governor may verify this ID." The pipe
proves the ID in `c2_execution.sqlite3` / the OBS JSONL; coverage lives in a
different DB that cannot see it.

## Q3 — Smallest honest wiring (describe only; this is the real OBS-005/006)

Make the flip a **function of proof**, not a decree:

1. **Evidence linkage on the registry.** Add a `verified_evidence_ref` (packet_id
   + output_digest) column/side-table on `int_registry`. A row may be `verified`
   only if this points at a real OBS-004 packet.
2. **A gated `verify-from-obs` governor command** that, per `tm_int_id`:
   - loads the OBS-004 packet for that ID and asserts
     `replay_proof.checks` all true (code_path + input_digest + output_digest);
   - re-derives `digest(packet.output) == packet.output_digest == OBS-001
     recorded` (the OBS-003 proof) at flip time;
   - binds identity: packet `module`/`axis` must equal the registry row's
     `module`/`axis` so a packet cannot verify an unrelated ID;
   - only then flips `report_only→verified`, writes `verified_evidence_ref`, and
     emits an `int_registry_events` row `type=verified_from_obs_evidence`.
   - Raw `register --status verified` with no matching packet stays blocked.
3. **Coverage generator (OBS-005/006) = attribution graph → coverage.** Walk the
   OBS-004 packets whose OBS-003 replay passed, and emit one governor-authorized
   `verify-from-obs` per ID. Coverage then advances by **exactly** the number of
   IDs with a real replay-passing packet — honestly, and re-derivable on audit.

Minimum viable form (no schema change): a governor command that **refuses** to
set `verified` unless a matching replay-passing OBS-004 packet exists on disk for
that exact `tm_int_id`, recording the packet digest in the event payload. The
column is the durable version.

## Net
- (1) The governor checks **nothing** proof-related; there is no gated flip — it
  would verify on command.
- (2) It **cannot** see OBS evidence today; a flip would be blind.
- (3) Honest fix = an evidence-gated `verify-from-obs` transition that consumes
  the OBS-004 packet + OBS-003 proof as its precondition (the OBS-005/006
  attribution-graph → coverage-generator work). Not built here.
