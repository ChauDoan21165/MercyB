# Chau — Report from A4 · OBS-005 identity bind = AXIS (owner decision), dry-run only

**Owner decision implemented (governor semantics, my lane):** OBS-005 binds identity on
**AXIS**; `module` demoted to a **non-blocking AUDIT** field (recorded, never gating).
Not a loosening — every ID still requires report_only source + OBS-004 packet +
`replay_proof` all-true + digest re-derivation at flip + Guardrail-2. Axis-bind changes
**which** ownership column must match, not **whether** evidence is required.

**No real flip. Registry read-only** — real `int_registry.sqlite3` sha `ae7eaa3e…`
unchanged before/after every run; all governor runs on throwaway copies.

## 1. Ground truth (grep, before any change)
| governor | bind | source |
|---|---|---|
| **origin/main tracked** `OBS-003-004/bin/c2-obs-005-verify-from-obs.py` | **module-bind** | line 109-110 `module_mismatch` blocks; 0×`module_audit` |
| !2522 branch `obs/obs-aitutorservice` | **axis-bind** | line 116 `axis_mismatch` blocks; `module_audit` non-blocking |

So main **is** still module-bind — the split-brain confirmed. The axis-bind change is
this MR.

## 2. Axis-bind applied to the main-tracked governor (this MR)
The diff vs main is exactly the decision and nothing else — the blocking
`module_mismatch` check is replaced by a non-blocking `module_audit` record; the
`axis_mismatch` bind and **all** other checks (report_only, packet-on-disk, replay
all-true, digest chain, Guardrail-2) are **byte-identical** to main. Content is taken
verbatim from the reviewed !2522-branch governor.

## 3. Dry-run on the 40 module_mismatch IDs — **40 flip / 0 still-refuse** under axis-bind
On the pre-flip registry state (`int_registry.sqlite3.bak-pre-aitutor-20260707`, where
the 42 aiTutorService IDs are `report_only`), same packets/obs001, copies only:

| run | flip | refuse | note |
|---|---|---|---|
| **module-bind** / backup | **2** | **40** | reproduces !2522's `2 flip / 40 module_mismatch` |
| **axis-bind** / backup | **42** | **0** | 40 disagreements recorded as non-blocking audit |
| axis-bind / **current live** | 0 | 42 | all `not_report_only` (already verified — see §5) |

Of the exact 40 module_mismatch IDs (`TM-INT-2413…2432`, `2938…2957`): under axis-bind
**40 flip, 0 still-refuse** — every one has matching axis + complete replay evidence;
none had a real evidence gap. Artifact: `state/axisbind-dryrun-40ids.json` (lists all 40).

## 4. The change is non-vacuous + Guardrail-2 armed
Forgery suite vs the **new** axis-bind governor: control **FLIPs**;
`tampered`/`broken-replay`/`wrong-axis`/`behavior-differs` **all REFUSE**
(`state/forgery-vs-axisbind-governor.json`). Guardrail-2: **2 triggers present** on the
live registry. axis-bind does not weaken the crypto chain — `wrong_axis` still REFUSEs.

## 5. ⚠ Provenance finding you need to decide on
The dry-run against the **current live** registry shows the 42 aiTutorService IDs are
**already `verified`** (0 flippable, all `not_report_only`). They were flipped **480→522**
on the !2522 branch (`obs/obs-aitutorservice`, HEAD `510d411a9` "aiTutorService real flip
480->522") using that branch's axis-bind governor — **before** this owner decision and
**before** any tracked/merged governor. Each of the 42 carries a valid
`verified_evidence_ref` (Guardrail-2 satisfied; evidence-backed, not fabricated).

So there is **no pending real flip for these 40** — it already happened. Your call:
- **Ratify** the 522 state (the flips are evidence-backed and axis-bind is now your
  decision), documenting that they were flipped pre-approval; **or**
- **Roll back** to 480 and re-flip the 40 through the tracked, owner-approved governor
  once this MR merges, for clean provenance.
Either way it's owner-only — I did not touch it.

## 6. Does axis-bind land via !2522 or a separate MR?
**Separate governor MR (this one).** Recommendation and why:
- !2522 conflates three things — (a) the axis-bind governor decision, (b) the
  aiTutorService evidence slice, (c) an **already-executed** real flip — and its title
  (`2 flip / 40 module_mismatch STOP`) is **stale** (describes an earlier module-bind
  dry-run, not the branch's current axis-bind + flipped state).
- This MR isolates **just the governor semantics** with its own dry-run proof (40 flip /
  0 refuse) and forgery proof — the reviewable unit an owner-critical governance change
  deserves.
- Leaves !2522 to be reviewed on its own merits (the aiTutorService evidence + the
  provenance question in §5), retitled to match reality.

## Compliance
Governor + dry-run only. No real registry flip. Guardrail-2 stays armed. Registry
read-only (`ae7eaa3e…` unchanged). MR targets **main**; **owner-only merge**. STOPPED for
your approval of the dry-run numbers before any real flip.
