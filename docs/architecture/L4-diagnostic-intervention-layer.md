# L4 — Diagnostic Intervention Layer

> **Layer source:** `ROADMAP.md` §L4 (Diagnostic Intervention Layer) —
> *the planner that turns L3 signal into L5/Stage-3B behavior change.*
> Marked **NEXT engineering target** and the layer that closes ~70%
> of the diagnostic loop.
>
> **Strategic anchor:** `STRATEGY.md` §12 — Placement Writeback
> Boundary + Study OS Summary Boundary. L4 reads local signals,
> writes local action-suggestions; it does not loosen either
> boundary.
>
> **Why this doc exists:** !113's L0–L7 cross-reference and !122's L6
> design both flagged L4 as the remaining design gap that must land
> before Stage 4 authoring can start. L6 (parent transparency) cannot
> attribute *"Mercy helped"* without L4 + L5 grounding the
> intervention. This doc is the design + first-build scope artifact.
> It is **not** an implementation spec; it is a scope contract for
> whoever picks up Stage 4 authoring.

---

## What L4 is

The surface that decides, given a learner's current signals, what
Mercy should do next — a specific lesson, drill, explainer, or
Suggested Practice card.

> *"Mercy reads the signals → Mercy decides the intervention →
> Mercy surfaces it."*

L4 sits between L3 (descriptive: *"this learner keeps dropping past
tense"*) and L5 (pedagogy: *"the right teaching response to past-tense
drift is this sequence"*). L4 is the deterministic glue: take the
L3 signal, consult the L5 rule, produce a per-learner action.

Without L4, the L1 detector fires, the aggregator counts, the
Local Weakness Map renders — and nothing changes about the next
session. L4 closes that loop.

---

## Inputs from L3

L4 reads four signal streams. All are device-local; L4 does not add
its own remote reads on top.

### Signals available today

- **L1 detector tag stream** — `mb.stage3a.l1.recent`, ring buffer
  capped at 50 entries. Source:
  [`src/lib/stage-3a/adapters/l1TagAdapter.ts:31`](../../src/lib/stage-3a/adapters/l1TagAdapter.ts).
  Each entry: `{ tag: L1WeaknessTag, ts: number }`. Idempotent on
  `(tag, ts)`; tolerates missing localStorage.
- **Placement v3 snapshot** — `mb.stage3a.placement.snapshot`. Source:
  [`src/lib/stage-3a/adapters/placementSnapshotAdapter.ts:29`](../../src/lib/stage-3a/adapters/placementSnapshotAdapter.ts).
  Contains the learner's CEFR placement result and the flagged
  weakness patterns from their placement run.
- **Pronunciation attempt stream** — `mb.stage3a.pronunciation.recent`,
  ring buffer capped at 100 entries. Source:
  [`src/lib/stage-3a/adapters/pronunciationAdapter.ts:62`](../../src/lib/stage-3a/adapters/pronunciationAdapter.ts).
  Carries phoneme + score + optional pain-point axis.
- **Aggregated weakness map** — output of
  `aggregateLocalWeaknesses()` (the function that powers `/weak-at`).
  Wrapper:
  [`src/lib/stage-3a/perfInstrumentation.ts:72`](../../src/lib/stage-3a/perfInstrumentation.ts).
  Pure read over the three buffers above; L4 reads its output, not
  the raw buffers, so L3's normalization is preserved.

### Signal-windowing posture

L4's rules read time-windowed slices (*"L1 tag X seen ≥3 times in the
last 7 days"*). The aggregator already collapses the ring buffer
into per-tag counts; L4 layers thresholds on top. No new history
storage in L4 — the existing ring-buffer caps are the history horizon.

---

## Outputs to L5 and beyond

L4 produces **one shape only**: a per-learner action suggestion.

```ts
type L4Suggestion = {
  trigger: { kind: "l1_tag" | "placement_weakness" | "pron_axis",
             id: string };        // which signal fired
  action:  { kind: "lesson" | "drill" | "mercy_explainer"
                 | "suggested_practice",
             id: string };        // what to surface next
  reason:  string;                // why — short, VI/EN bilingual ready
  ttl_ms:  number;                // how long this suggestion is valid
};
```

Consumers:

- **Stage 3B Suggested Practice** —
  [`src/stage-3b/suggestedPractice.ts`](../../src/stage-3b/suggestedPractice.ts)
  +
  [`src/components/stage-3b/SuggestedPracticeList.tsx`](../../src/components/stage-3b/SuggestedPracticeList.tsx).
  Already renders a list of practice cards; L4's first build wires
  one new card source into it.
- **L6 parent view** — !122's first-build scope. L6 reads L4
  suggestions to claim *"Mercy is working on X this week"* — without
  L4, L6 can only show flagged, not worked-on (see L6 §"Data
  dependencies → L4-blocked").
- **Stage 5 / L5 pedagogy** — L5 owns the *rules* L4 evaluates
  (thresholds, sequencing, mastery). L4 consumes L5 decisions; L5
  does not consume L4 output. (See Open Questions.)

L4 does **not** push notifications, mutate placement state, or write
to any remote table. The suggestion is a read by the consumer.

---

## What L4 is NOT

The easiest place for the design to drift, so the bright lines are
loud:

- **Not a recommendation engine.** No collaborative filtering, no
  *"learners like you also studied X"*, no popularity surface. L4
  knows about THIS learner's signals only.
- **Not an ML pipeline.** No model training, no embeddings, no
  feature store. L4 is a deterministic rule engine. A given signal
  vector deterministically maps to a given suggestion. Testable
  with a fixed input → fixed output.
- **Not a placement writeback path.** L4 reads
  `placementSnapshotAdapter`; it does not write `profiles.placement_*`.
  The Placement Writeback Boundary (`STRATEGY.md` §12) holds.
- **Not a Study OS summary writer.** L4 does not push device-local
  history to `mercy_user_facts` or any remote table. The Study OS
  Summary Boundary (same §) holds.
- **Not a streak / gamification surface.** L4's outputs are
  diagnostic actions, not motivational nudges. CLAUDE.md
  non-negotiable #4 — outcomes over engagement.
- **Not the queue.** Stage 3B Suggested Practice owns the queue and
  the display order. L4 emits suggestions; Stage 3B decides which
  to render and when.

---

## Local-only posture

L4 inherits L1's substrate posture (`docs/architecture/systems/`
canonical privacy notes) and extends it:

- **Reads** only the device-local ring buffers + the device-local
  aggregator output. No new Supabase reads.
- **Writes** only the per-learner suggestion buffer (a small
  localStorage entry, capped, same shape as the existing L3 ring
  buffers). No remote writes.
- **External calls:** none. No analytics events emitted from L4
  itself; if a downstream consumer (e.g. Stage 3B) wants to record
  a click, that happens in the consumer's instrumentation, not L4.
- **mercy_user_facts:** untouched. L4 must not sync suggestions
  upstream even though they look like "user facts."
- **Anonymous + offline:** L4 must operate when localStorage is the
  only persistence layer, the same as L3.

This posture means a future "sync L4 suggestions to the parent view"
feature (per L6) is a deliberate, named, high-value loosening — same
shape as L6's own "first time L1's local-only posture is loosened"
note. Not done by default; not done by L4 alone.

---

## First-build scope

The smallest L4 feature that produces real *"Mercy explains"*
attribution for L6 + Suggested Practice. **Not a roadmap. A scope
contract.**

**Rule shape (one):**

```
IF placement.weakness CONTAINS "past_tense_marker"
   AND l1Recent.count("vi_l1_past_tense_drop") in last 7d >= 3
THEN suggest {
  trigger: { kind: "l1_tag", id: "vi_l1_past_tense_drop" },
  action:  { kind: "suggested_practice",
             id: "<existing Stage 3B card id>" },
  reason:  "Tuần này bạn hay quên đánh dấu thì quá khứ — luyện 5 phút.",
  ttl_ms:  7 * 24 * 60 * 60 * 1000,
}
```

One signal pair, one suggestion shape, one wire-up:

1. **One signal pair.** `placement.weakness` AND a specific L1 tag.
   The pair is more specific than either alone (the placement test
   confirms the pattern is unfamiliar; the recent L1 hits confirm
   the pattern is currently failing live).
2. **One suggestion shape.** Routes to an existing Stage 3B
   Suggested Practice card. No new UI surface in L4's first build.
3. **One wire-up.** Stage 3B's
   [`suggestedPractice.ts`](../../src/stage-3b/suggestedPractice.ts)
   gains an L4 source alongside its current sources.

That's the entire L4 scope-1 ship. The rule engine starts as a
single rule; the second rule (and the rule-table file) ships in
scope-2 once scope-1's wiring + tests are reviewed on prod.

**Out of scope for first build:** rule-config DSL, admin tooling to
edit rules, multi-rule arbitration (priority, dedup), pronunciation-
axis rules (deferred to scope-2 after L5 decides phoneme-vs-pattern
priority), parent-view suggestion stream (L6-blocked).

---

## Open questions

> Every question below is **decidable by Chau YES/NO or A/B/C**, per
> the same standard as !122. Several depend on L5 decisions that
> C4's L5 decision-record stub (in-flight: `docs/architecture-l5-decisions`)
> must capture. Those are flagged inline so C4 can backfill the stub.

1. **Rule storage.**
   **A** Hard-coded TypeScript rule table (single file in
   `src/lib/stage-3a/l4/rules.ts` or similar). Easiest to ship,
   easiest to test, no admin surface.
   **B** JSON file in `public/data/` like the room files.
   **C** Supabase table the admin can edit.

2. **Trigger threshold defaults.** *(L5-blocked — backfill into
   L5 decision-record stub.)*
   What is the canonical *"signal X has fired ENOUGH to intervene"*
   threshold? E.g. 3+ L1 hits in 7 days vs 5+ in 14 days. L5 owns
   the answer; L4 reads it.

3. **Suggestion lifetime.** *(L5-blocked.)*
   How long does a suggestion remain valid before L4 re-evaluates?
   Default proposed: 7 days. L5 should ratify or revise.

4. **Re-suggestion after dismiss.**
   **A** Once dismissed, never re-surface that suggestion.
   **B** Re-evaluate on next session; re-surface if the signal
   re-fires.
   **C** Per-suggestion override (some sticky, some not) — L5
   decides per-rule.

5. **Mercy attribution surface.**
   **A** L4 emits the `reason` string; consumers display verbatim.
   **B** L4 emits a structured reason; consumers compose the
   user-facing string (VI/EN, kid/parent register).
   **C** Reason string is L5-authored content; L4 selects the id.

6. **Conflict between L1 tag + placement weakness.**
   E.g. placement says CEFR-A2 *"past tense unfamiliar"* but recent
   L1 stream says learner is reliably producing past tense. Which
   wins?
   **A** L1 recent stream wins (live > stale).
   **B** Placement wins until next placement runs.
   **C** Both fire; consumer arbitrates.

7. **Frequency cap.**
   **A** At most one L4-sourced suggestion per session.
   **B** At most one per practice surface (e.g. Suggested Practice
   list can show one, /weak-at can show one).
   **C** No cap; rule TTLs handle it.

8. **First rule's domain.**
   **A** Vietnamese L1 past-tense marker (the example above —
   highest-confidence pair, large evidence base in detector tests).
   **B** Pronunciation final-consonant-cluster reduction
   (high prevalence; pronunciation axis is more recently authored).
   **C** Topic-comment fronting (most uniquely Vietnamese pattern).

9. **Read-loop posture.**
   **A** L4 evaluates synchronously on read (Suggested Practice
   list re-evaluates rules every render).
   **B** L4 evaluates on signal change (write-side hook in the
   ring-buffer adapters).
   **C** Periodic re-evaluation on a debounce timer.

10. **L5 prerequisite gate.** *(meta-question.)*
    **A** Ship L4 scope-1 immediately with hard-coded defaults for
    Q2/Q3; L5 stub captures the *"these need owner decisions"*
    list; revise once L5 lands.
    **B** Block L4 scope-1 until L5 stub has ratified Q2 + Q3 at
    minimum.

---

## What this doc is not

Not a roadmap (sequencing lives in `ROADMAP.md` §L4). Not an
implementation spec (the function signatures, file layout, and test
shape live in the Stage 4 author's eventual implementation MR). Not
a launch plan. This is the **starting point** for Stage 4 authoring
when it begins.

## Cross-references

- `ROADMAP.md` §L4 — the layer model + the *"closes ~70% of the
  diagnostic loop"* framing.
- `STRATEGY.md` §12 — Placement Writeback Boundary + Study OS
  Summary Boundary (L4 must not loosen either).
- `CLAUDE.md` non-negotiables #2 (Kids mode sacred) and #4
  (outcomes over engagement).
- `docs/architecture/systems/study-os-stage-3.md` — L3 deep-dive
  (the signal source L4 reads from).
- `docs/architecture/L6-parent-teacher-family-layer.md` — the
  downstream consumer that uses L4's output for *"Mercy helped"*
  attribution.
- `docs/INDEX.md` § Cross-reference: docs by L0–L7 layer (the
  parent doc that points here).
- C4's in-flight L5 decision-record stub
  (`docs/architecture-l5-decisions` branch) — owns the threshold /
  sequencing / mastery questions L4 reads.
