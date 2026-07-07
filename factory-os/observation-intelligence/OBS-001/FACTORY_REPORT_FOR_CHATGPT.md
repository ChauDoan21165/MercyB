# FACTORY REPORT FOR CHATGPT — C2-OBS-INT-PHASE2-001 · `review` owner resolution

**Status:** holding — no new instrumentation lease. `aiTutorService` and every other
module stay un-leased until A3's OBS-003/004 Judge verdict on the promptAssembly
evidence class. This report delivers only the one authorized prep task.

---

## Prep task: resolve the `review` owner (42 IDs, axis `rubric-signal-preservation`)

**Verdict: NO real rubric/review/scoring runtime path executes this axis.**
But the 42 IDs are **not** report-only — their two behaviors execute in **already-owned**
modules. The OBS-002 "review / scoring" label was an artifact of the axis *name*, not its
behavior.

### What the axis actually does (registry, read-only)

42 IDs, split 21 / 21 across two behaviors:

| Behavior | IDs | Executes in | Real source path | Evidence |
|---|---:|---|---|---|
| "blocks duplicate output when prior signal already covers learner gap" | 21 | `detectorHint` | `src/lib/ai-tutor/detectorHint.ts` | per-tag dedup `hasShownHint()`/`markHintShown()`/`getShownCount()` + session-wide `SESSION_CAP` gate (lines 95, 184–185, 226–242) |
| "keeps learner-facing reply specific without inventing product state" | 21 | `promptAssembly` | `src/lib/ai-tutor/promptAssembly.ts` | `assembleContextBlock` contract "Missing data → fields omitted entirely. Never inject null/placeholder text." (line 261) — **already instrumented in OBS-001** |

### Rubric/review/scoring paths examined — none execute this axis

| Path | What it really is | Executes axis? |
|---|---|---|
| `src/lib/writing-feedback/scoreEssay.ts` | deterministic essay scorer (5 writing dimensions) | ✗ |
| `src/lib/writing-feedback/rubric.ts` | `WritingRubric` type / `emptyRubric` | ✗ |
| `src/lib/writing-feedback/vn-band-rubric.ts` | IELTS band rubric for VN learners | ✗ |
| `src/core/engine/scoring.ts` | engine scoring | ✗ |
| `src/features/review/ReviewApp.tsx` | review UI feature | ✗ |
| `src/languages/punjabi/*Review*.ts`, `assessmentRubrics.ts` | Punjabi content decks (not TM runtime) | ✗ |

Real rubric code exists, but it is **essay grading / app-review UI** — a different feature
that does not carry these two Teacher-Mercy reply-governance behaviors.

### Recommended v2 gap-list correction

- **Remove** the `review` owner (42 IDs) — it does not exist as a runtime module.
- **Reassign** by behavior:
  - `detectorHint`: 101 → **122** (+21 dedup IDs)
  - `promptAssembly`: 656 → **677** (+21 anti-invent IDs) — already instrumented, no new hook
- **Net:** remaining-to-lease surface drops by 42 (no separate `review` lease). Total
  behavioral unchanged at 1198.

Artifact: `state/observations/OBS-001-review-owner-resolution.json` (full evidence).
The `matched` sentinel (1 ID) was left untouched per instruction.

### Corrected remaining gap list (for when A3's verdict unblocks leasing)

| Rank | Owner module | IDs | Distinct probes | Note |
|---:|---|---:|---:|---|
| 1 | `studyPath` | 119 | 39 | |
| 2 | `detectorHint` | **122** | ~23 | +21 from review dedup |
| 3 | `aiTutorService` | 84 | 4 | best IDs/probe — confirmed next lease **iff** Judge accepts |
| 4 | `sessionRuntime` | 58 | 18 | |
| 5 | `costLimits` | 42 | 2 | |
| 6 | `staleSessionGuard` | 42 | 2 | |
| 7 | `tutorUiCopy` | 21 | 1 | |
| 8 | `SpeakPracticeMode` | 16 | 16 | |
| 9 | `l1FollowUpLoop` | 16 | 16 | |
| — | `UNRESOLVED` (`matched`) | 1 | 1 | left alone |

`promptAssembly` = 677, instrumented. `review` row removed.

---

## Compliance & next

- Registry read-only; no Judge / Promotion / dashboard / counter edits; no fake IDs;
  PAUSE untouched; no lease; no merge.
- Finding committed to `obs/obs-001-runtime-hooks` (MR !2518 open, owner-only merge).

**Now idle** until A3 reports the OBS-003/004 Judge verdict on the promptAssembly
evidence class. On **accept** → lease `aiTutorService` (84 IDs / 4 probes). On **reject**
→ fix the evidence-packet class before instrumenting anything new.
