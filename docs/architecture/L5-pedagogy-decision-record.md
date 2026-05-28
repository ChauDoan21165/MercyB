# L5 — Pedagogy Decision Record

> **Decision record stub.** Real decisions land here as they are
> made. **Do NOT pre-fill decisions before the data justifies
> them.** L5 is research-required per `ROADMAP.md` §L5 — it is
> blocked on pedagogy input and learner-data signal, not on
> engineering bandwidth.
>
> **What this doc is for:** capturing the open pedagogy decisions
> in one place so Stage 4/5 authoring doesn't have to reinvent
> them from scratch. As decisions are made, they move from §
> Decisions deferred to § Decisions made.
>
> **What this doc is NOT:** a design doc. See §"Why this is a
> decision record, not a design doc" below.

---

## What L5 is

The pedagogy layer between L4 (Diagnostic Intervention) and L6
(Parent / Teacher / Family). Per `ROADMAP.md` §L5:

> Curriculum decisions, sequencing rules, spaced-repetition
> policy, L1-transfer-aware scheduling, motivation-aware pacing.
> Engineering cannot complete this layer alone.

**The role L5 plays between L4 and L6:**

- **L4 needs L5** to ground the intervention engine. Without L5,
  L4's bias-what-the-learner-sees-next logic falls back to
  default heuristics that work-but-don't-shine (`ROADMAP.md`
  §L4: *"L4 will be too aggressive or too random until L5
  decisions exist."*).
- **L6 needs L5** to make weekly parent-view claims meaningful.
  Per !122 (L6 design doc) §Data dependencies, three of L6's
  hard claims — *"is this improvement significant?"*, *"what
  sequence of patterns to show?"*, *"is this pattern mastered?"*
  — are blocked on L5 decisions that don't yet exist.

L5 itself is not a UI surface. It is a body of decisions that
shape what L4 / L6 produce.

---

## Why this is a decision record, not a design doc

A design doc commits to *what we will build*. A decision record
captures *what we have decided*, with audit trail.

L5 decisions cannot be derived from architecture alone — they
require **real learner data** (e.g. per-pattern firing
distributions to justify a threshold), **real pedagogical
research** (sequencing literature, not architecture), and **real
product-tradeoff calls** ("mastery" is a product definition —
*"never makes this error again"* vs *"< 1× per session"* vs
*"self-reports confidence"* — and different choices ship
different products).

Each decision accumulates as evidence and intent align. A future
Stage 4/5 implementation deep-dive will reference this doc; that
deep-dive is the design doc. This one is the audit trail.

---

## Decisions deferred

Six decisions: three surfaced by !122 (L6 design doc) §Open
questions, plus three backfilled from !131 (L4 design doc)
§Open questions that C7 flagged as L5-blocked. Each is
research-blocked, not decidable tonight. Structured shape per
dispatch:

### Decision: Weakness-count significance threshold

- **Context:** At what observed-count does a flagged L1 weakness
  become "significant" enough to surface to the learner (L3),
  to bias the planner toward (L4), or to report to a parent
  (L6)? `!122` §Data dependencies L5-blocked list cites this as
  *"Is this improvement significant? — pedagogy threshold.
  Without it, the parent view either over-reports (every
  fluctuation looks like progress) or under-reports (only large
  swings counted)."*
- **Decision:** [PENDING]
- **Rationale:** [PENDING]
- **Decided by:** [PENDING]
- **Decided when:** [PENDING]
- **Reversibility:** Medium. Threshold changes propagate to all
  downstream surfaces (L3 weakness map, L4 nudges, L6 parent
  view) but are not destructive — historical signal is preserved
  and re-aggregable under a new threshold.

### Decision: Pattern sequencing strategy

- **Context:** What order should weaknesses be surfaced in a
  learner's week? Two extremes: *remediation-first* (drill the
  most-fired pattern until count drops) vs *coverage-first*
  (rotate across the §15 Bar #1 detector families to ensure
  breadth). The choice shapes L4's planner output and L6's
  parent-view weekly story. `ROADMAP.md` §L5 frames this as
  *"How should L1-transfer-aware scheduling weight a known
  weakness vs. a new pattern the learner hasn't seen?"*
- **Decision:** [PENDING]
- **Rationale:** [PENDING]
- **Decided by:** [PENDING]
- **Decided when:** [PENDING]
- **Reversibility:** Medium. The sequencing function is one
  module; swapping strategies is a pure-function edit. But
  learners adapt to whatever strategy ships, so changing
  midstream creates discontinuity in the experience.

### Decision: Pattern mastery definition

- **Context:** When is a learner "done" with a specific L1
  transfer pattern? Candidate definitions: *"detector fires 0
  times in last N tutor turns"*, *"detector fires < threshold
  per session for K consecutive sessions"*, *"learner
  self-reports confidence on a follow-up prompt"*,
  *"placement v3 re-test no longer flags the pattern"*, or
  some weighted combination. Distinct from significance
  threshold above — mastery is the exit condition, threshold
  is the entry condition.
- **Decision:** [PENDING]
- **Rationale:** [PENDING]
- **Decided by:** [PENDING]
- **Decided when:** [PENDING]
- **Reversibility:** Hard. The mastery definition shapes
  what L6 can claim to a parent, what L4 stops nudging toward,
  and what the §15 Bar §"named outcome" can credibly attribute.
  Reversing it post-launch resets the meaning of every prior
  parent-view "this pattern is now consistent" claim.

### Decision: L4 intervention threshold defaults

- **Context:** Backfilled from !131 (L4 doc) Q2 *"trigger
  threshold defaults"*: at what observed-count has a signal
  *fired enough to intervene*? Candidate shapes: *3+ L1 hits in
  7 days*, *5+ in 14 days*, *N hits in last K tutor turns
  regardless of wall-clock*. May converge with the L6 surfacing
  threshold above (one number serving both) or diverge (L4 fires
  earlier on weaker signal, L6 surfaces later on stronger
  signal). L5 owns the answer; L4 reads it.
- **Decision:** [PENDING]
- **Rationale:** [PENDING]
- **Decided by:** [PENDING]
- **Decided when:** [PENDING]
- **Reversibility:** Medium. Threshold lives in a rule table
  (per !131 §Open Q1). Adjusting it propagates to L4 nudges at
  next read; learners may experience a step-change in intervention
  frequency.

### Decision: L4 suggestion lifetime / TTL

- **Context:** Backfilled from !131 (L4 doc) Q3 *"suggestion
  lifetime"*: how long does an L4-emitted suggestion remain valid
  before re-evaluation? !131 proposes 7 days as a placeholder
  default and explicitly defers ratification to L5. Candidate
  shapes: *fixed TTL across all suggestions*, *per-rule TTL set
  by rule author*, *signal-driven invalidation (suggestion expires
  when the underlying L3 signal stops firing for K days)*.
- **Decision:** [PENDING]
- **Rationale:** [PENDING]
- **Decided by:** [PENDING]
- **Decided when:** [PENDING]
- **Reversibility:** Medium. Pure-function policy swap; no
  schema impact. Learner-experience continuity matters — TTL
  changes alter the felt-rhythm of suggestions.

### Decision: L4 attribution rationale content authorship

- **Context:** Backfilled from !131 (L4 doc) Q5 — the *"L5-authored
  content"* path of the attribution-surface question. When L4
  emits a structured reason (rule-id + signal context), who writes
  the Vietnamese/English user-facing rationale strings the
  consumer renders to the learner / parent? Three candidate shapes:
  *(a)* L4 ships hard-coded reason strings per rule (engineering
  owns), *(b)* L5 maintains a canonical reason library that L4
  selects by id (pedagogy owns), *(c)* hybrid — L4 ships a fallback
  string per rule, L5 can override per-rule via the library
  without an L4 deploy.
- **Decision:** [PENDING]
- **Rationale:** [PENDING]
- **Decided by:** [PENDING]
- **Decided when:** [PENDING]
- **Reversibility:** Easy. Reason strings are content; replacing
  them is a content-only edit. The decision determines *who is
  authorised* to make those edits, not whether they're editable.

---

## Decisions made

> Empty. Populate as decisions land.
>
> Same structured shape as § Decisions deferred above. When a
> decision moves from deferred → made, leave the deferred entry
> in place (immutable record), add a new entry here with the
> same title plus the dated decision body, and cross-link the
> two. See § How to use this doc.

*(no entries yet)*

---

## How to use this doc

Decision-record protocol:

1. **Past decisions are never edited.** Once a decision lands in
   § Decisions made with a "Decided when" date, the entry is
   immutable. Don't fix typos; don't update rationale; don't
   backfill missing fields. The audit trail is the point.
2. **A revision supersedes; it does not overwrite.** Add a new
   entry titled the same (e.g. *"Decision: Pattern mastery
   definition (v2)"*) with its own dated body, and cross-link
   to the prior one with a *"Supersedes: …"* line.
3. **Deferred → made transitions move, not delete.** When a
   decision crystallises, leave the deferred entry in place and
   add the decided entry to § Decisions made — preserves the
   historical record of what was open when.
4. **Don't author decisions before data justifies them.**
   [PENDING] is honest; a pre-filled rationale with no data
   behind it is worse than no entry.
5. **Cross-link from code.** L4 / L6 implementations should
   link to the specific entry slug from code comments so future
   readers can find the audit trail.

---

## Open questions blocking L5 design

The questions that need pedagogical / product input before any
of the three deferred decisions can be made. Per `ROADMAP.md`
§L5 + !122 §Data dependencies (L5-blocked):

- **Success metric for "good planning."** Is it competency-on-
  target by week N? Engagement minutes? Self-reported
  understanding? Number of correctly-completed rooms? Without
  a primary metric, all three deferred decisions optimize for
  different things in isolation.
- **"Well-planned week" structure for a Vietnamese intermediate-
  English learner.** Five 15-minute sessions of mixed surface
  practice? Two 30-minute placement-style assessments plus
  three drills? A focus rotation across grammar / pronunciation
  / vocabulary? The answer constrains pattern-sequencing
  strategy (decision #2 above).
- **Remediation vs coverage weighting.** Should the goal be
  *fix what's broken first* (remediation), *expose the learner
  to new patterns* (coverage), or some learner-controlled mix?
  The answer constrains both sequencing strategy (#2) and
  mastery definition (#3, since "mastered" only makes sense
  inside a sequencing frame).
- **Motivation pacing signal set (local-only).** How does the
  planner detect learner frustration without the surveillance
  the L1 substrate forbids? Signals available today: local
  Stage 3A buffers (detector tags, placement snapshots,
  pronunciation attempts). Signals NOT available: typing
  speed, dwell time, transcript content. The decision is which
  local-only signals constitute a usable frustration proxy
  *and* whether to act on them.
- **Pedagogy adviser scope.** Is Chau the sole owner of L5
  decisions, or does an external pedagogy adviser (with
  Vietnamese-English specialism) join the call? The answer
  shapes how fast deferred decisions can move and whose name
  appears on "Decided by." Out of scope for this doc but worth
  recording the question.

When any of these open questions is answered (or partially
answered with enough signal to commit), one or more deferred
decisions becomes makeable. Move them from § Decisions deferred
to § Decisions made following the protocol above.

---

## Cross-references

- `ROADMAP.md` §L5 — the canonical layer description this doc
  records decisions for.
- `docs/architecture/L6-parent-teacher-family-layer.md` (!122)
  — the L6 doc whose §Data dependencies + §Open questions
  surface the three deferred decisions.
- `docs/INDEX.md` §L5 — points readers here from the layer
  cross-reference.
- `STRATEGY.md` §15 — the Vietnamese flagship Definition of
  Done, which any L5 success-metric decision must stay
  consistent with.
- `docs/architecture/systems/study-os-stage-3.md` — L3
  implementation deep-dive (the signal source L5 decisions
  shape interpretation of).
