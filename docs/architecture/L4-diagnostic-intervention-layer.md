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

## Decisions recorded

> Follows the !126 decision-record protocol — see
> `L5-pedagogy-decision-record.md` § How to use this doc. Past
> decisions are immutable; revisions supersede; cross-link from
> code. The § Open questions list above is the historical record
> of what was open when each decision was made; entries there are
> NOT edited.

### Decision: L4-Q1 — Rule storage

- **Context:** § Open questions #1. Where do L4 rule definitions live? Choices were **A** hard-coded TS rule table, **B** JSON in `public/data/`, **C** Supabase table + admin UI.
- **Decision:** **A** — hard-coded TypeScript rule table (e.g. `src/lib/stage-3a/l4/rules.ts`).
- **Rationale:** Fastest to ship, fully type-safe, no new admin surface or RLS work, and rule edits stay in the same review path as the engine they drive. Non-engineer rule-authoring can be revisited if L4 scales past a handful of rules.
- **Decided by:** Chau
- **Decided when:** 2026-05-28
- **Reversibility:** Medium. Moving to **B** or **C** later is a refactor: extract the rule shape, write a loader, migrate the table; the rule data itself is the same shape regardless of source.
- **Cross-link:** `STAGE-4-5-decision-queue.md` § Decidable now #10.

### Decision: L4-Q4 — Re-suggestion after dismiss

- **Context:** § Open questions #4. When a learner dismisses an L4-emitted suggestion, does it ever re-surface? Choices were **A** never re-surface, **B** re-evaluate next session, **C** per-rule override (L5 decides).
- **Decision:** **A** — dismiss is permanent. The engine honors a deterministic dismissed-suggestion-id set; once an id is dismissed it does not re-emit. Option **C** is moot per X2 (L5 does not own per-rule policy).
- **Rationale:** Strong learner-agency signal (dismiss means dismiss). Deterministic behavior is easier to reason about and test than re-evaluation rules. The accidental-dismiss risk is accepted; learners can resurface a pattern by re-encountering it through normal practice.
- **Decided by:** Chau
- **Decided when:** 2026-05-28
- **Reversibility:** Medium. The dismissed-id set is a pure-function input; switching to **B** is a policy swap in the resolver, not a schema change.
- **Cross-link:** `STAGE-4-5-decision-queue.md` § Decidable now #11; `L5-pedagogy-decision-record.md` § Decisions made → Cross-layer X2.

### Decision: L4-Q5 — Attribution surface (engineering shape)

- **Context:** § Open questions #5. How does L4 emit the rationale for a suggestion? Choices were **A** L4 emits the user-facing `reason` string verbatim, **B** L4 emits a structured reason (id + signal context), consumer composes the user-facing text, **C** L5-authored reason library.
- **Decision:** **B** — engine emits a structured `TriggerReason` (rule-id + signal context); the presentation layer composes the VI/EN user-facing text via `<Bilingual>` (see `src/components/Bilingual.tsx`). Option **C** is moot per X2.
- **Rationale:** Separation of engine and presentation: the engine reasons about evidence, the UI reasons about copy. Each surface (in-app card, parent digest, future teacher view) can render the same `TriggerReason` in its own register without engine-side branching. The `<Bilingual>` wrapper already exists and enforces VI/EN lang-attribute discipline.
- **Decided by:** Chau
- **Decided when:** 2026-05-28
- **Reversibility:** Easy. Collapsing back to **A** is a refactor that moves string composition into the engine; the `TriggerReason` payload is a superset.
- **Cross-link:** `STAGE-4-5-decision-queue.md` § Decidable now #12; `L5-pedagogy-decision-record.md` § Decisions made → Cross-layer X2.

### Decision: L4-Q6 — L1 tag vs placement conflict

- **Context:** § Open questions #6. When the live L1 stream and a stale placement snapshot disagree about a learner's pattern strength, which signal wins? Choices were **A** L1 recent wins (live > stale), **B** placement wins until next run, **C** both fire, consumer arbitrates.
- **Decision:** **A** — the live signal wins over stale placement. L4 reads the most recent L1 tag history and disregards the placement snapshot when the two disagree.
- **Rationale:** Placement is a point-in-time estimate; live L1 signal is current evidence. Respecting current learner state matters more than honoring an aging commitment. Placement's value is initial scoping; ongoing L4 behavior should reflect what the learner is doing now.
- **Decided by:** Chau
- **Decided when:** 2026-05-28
- **Reversibility:** Easy. Pure-function arbitration; swap the resolver to **B** or **C** without schema impact.
- **Cross-link:** `STAGE-4-5-decision-queue.md` § Decidable now #13.

### Decision: L4-Q7 — Frequency cap

- **Context:** § Open questions #7. How many L4-sourced suggestions can fire per session? Choices were **A** ≤1/session, **B** ≤1/surface, **C** no cap (TTLs handle it).
- **Decision:** **A** — at most one L4 suggestion per session anywhere. A learner with multiple active patterns sees one at a time.
- **Rationale:** Gentle posture aligns with the outcomes-over-engagement non-negotiable. Crowding interventions across surfaces risks the experience reading as nagging. The trade — only the top-priority pattern surfaces per session — is accepted; lower-priority patterns will surface in subsequent sessions.
- **Decided by:** Chau
- **Decided when:** 2026-05-28
- **Reversibility:** Easy. The cap is a single integer in the rule resolver.
- **Cross-link:** `STAGE-4-5-decision-queue.md` § Decidable now #14.

### Decision: L4-Q8 — First rule's domain

- **Context:** § Open questions #8. Which L1-transfer pattern does L4 implement first as a proof-of-concept rule? Choices were **A** Vietnamese L1 past-tense-marker omission, **B** pronunciation final-consonant-cluster reduction, **C** topic-comment fronting.
- **Decision:** **A** — Vietnamese L1 past-tense-marker omission (e.g. learner says "yesterday I go" / "hôm qua tôi đi" → expected "yesterday I went"). The detector for this pattern has the largest evidence base in the existing L1-detector tests.
- **Rationale:** Highest-confidence detector + text-only signal = cheapest path to a demo-able L4 surface; strongest "Vietnamese-first" pedagogy demo. Pronunciation (option **B**) depends on the Stage 3A pronunciation adapter maturing further. Topic-comment fronting (option **C**) has a smaller affected population for a less-visible payoff.
- **Decided by:** Chau
- **Decided when:** 2026-05-28
- **Reversibility:** Easy. Each rule is independent; the choice of *first* rule does not constrain later rule additions.
- **Cross-link:** `STAGE-4-5-decision-queue.md` § Decidable now #15.

### Decision: L4-Q9 — Read-loop posture

- **Context:** § Open questions #9. When does L4 evaluate its rules? Choices were **A** synchronously on read (every render), **B** on signal-change (write-side hook in the ring-buffer adapters), **C** periodic debounce.
- **Decision:** **B** — evaluate on signal change. L4 hooks the L3 ring-buffer write path; rule outputs update when the underlying signal changes, not on every consumer read.
- **Rationale:** Cheap per-read cost (consumers just read the current rule outputs); avoids burning cycles re-evaluating rules every render. The risk — a missed signal-change edge leaving outputs stale — is accepted as a smaller cost than per-read re-evaluation across many consumer surfaces.
- **Decided by:** Chau
- **Decided when:** 2026-05-28
- **Reversibility:** Medium. Swapping to **A** or **C** is a re-architecture of when evaluation runs, but the rule shape itself is unchanged.
- **Cross-link:** `STAGE-4-5-decision-queue.md` § Decidable now #16.

### Decision: L4-Q10 — L5 prerequisite gate (provisional)

- **Context:** § Open questions #10 (meta-question). Ship L4 scope-1 now with hard-coded defaults for the L5-blocked entries (Q2, Q3), or block on L5 ratification?
- **Decision:** **A** — ship L4 scope-1 now with provisional L5-blocked defaults. Every default that depends on an L5 [PENDING] entry is tagged `// L5-PENDING` at its implementation site so a grep finds them when L5 lands. This decision is the L4 face of cross-layer X1.
- **Rationale:** L4 progress should not be gated on pedagogy-adviser cadence; provisional defaults are honest because they are marked and traceable to specific § Decisions deferred entries in the L5 doc. L5 ratifies by replacing the constants and removing the tag.
- **Decided by:** Chau
- **Decided when:** 2026-05-28
- **Reversibility:** Easy at the constant level; medium at the policy level.
- **Cross-link:** `STAGE-4-5-decision-queue.md` § Cross-layer X1; `L5-pedagogy-decision-record.md` § Decisions made → Cross-layer X1.

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
