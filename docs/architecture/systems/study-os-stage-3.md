# Study OS (Stage 3) — Deep Dive

> **Sibling of** [system-overview.md §6](../system-overview.md#6-stage-3a--local-weakness-map-study-os)
> **and §7** [(weakness recommender)](../system-overview.md#7-weakness-recommendation-engine-study-os-v1-surface).
>
> Stage 3 in `layer-model.md` is *four bricks, sequenced* — 3A → 3B → 3C
> → 3D. The bricks were designed under hard local-only posture
> constraints; the data they read is detector / placement /
> pronunciation signal; their job is to make the Vietnamese learner
> the one Duolingo cannot serve. This doc covers Stage 3 end-to-end
> with honest state-as-of-this-audit on what is live, what is
> feat-branched, and what is paper-only.
>
> **Read first:**
> - `layer-model.md` §3A / §3B / §3C / §3D
> - the **Study OS Summary Boundary** section below (this doc) +
>   the **Placement Writeback Boundary** in `placement-v3.md`
> - `docs/stage-3a/local-weakness-map-design.md` (the canonical 3A
>   design)
> - The three adapter files in `src/lib/stage-3a/adapters/` (file-head
>   comments are load-bearing).

---

## 1. What it does, and why it matters strategically

Stage 3 is the **Study OS**. It is the brick that turns the
detector/placement/pronunciation signal MercyBlade already collects
into a learner-facing surface that answers four questions, in order:

1. *What am I weak at?* (Stage 3A)
2. *What should I practice?* (Stage 3B)
3. *What should I review?* (Stage 3C)
4. *What do I appear to know?* (Stage 3D)

Why it matters strategically:

- **§1 mission test.** A Vietnamese learner who can publicly say "this
  app told me exactly why I keep making the same mistake, and showed
  me the fix" is the §15 Axis 1 Bar #7 evidence. Stage 3 produces that
  affordance. Without it, the detector / placement / pronunciation
  signals exist but never reach the learner as a *thesis* — "here is
  what your L1 keeps doing to your English."
- **Competitive thesis.** `STRATEGY.md` (V3 — Competitive thesis):
  *"Duolingo tells you to
  keep a streak. MercyBlade tells Vietnamese learners why they keep
  making the same English mistake."* That is the one-sentence pitch
  for Stage 3A's marketing artifact. The whole Stage 3 sequence
  hardens that pitch.
- **Study OS Summary Boundary.** The strategic reason Stage 3 is
  *local-only* is not technical — it's that the boundary is what
  protects `mercy_user_facts` (semantic person memory) from becoming
  an indirect sync layer for behavioral state. Lose that boundary and
  you've leaked PII through the side door, AND you've collapsed two
  distinct memory layers into one less-useful blob.

Strategic anchors:

- **`layer-model.md` §"Stage 3 — Study OS Sequence"** — four bricks,
  sequenced, each with its own safety rule encoded in the name.
- **`CURRENT-STATE.md` §15 Axis 1 Bar #1** — closed (`vi_l1_*` detectors
  shipped, eval baseline 65/65). The Stage 3A hard prereq is met.
- **`STRATEGY.md` §6 status snapshot** — *"Stage 3A is designed and
  adapter-prepped, but the screen implementation has not started"*
  (as of 2026-05-26).
- **`placement-v3.md` Placement Writeback Boundary** — Stage 3A's
  placement adapter is a **read-side mirror**, not a writeback.

---

## 2. Live state — what is actually on `origin/main` today

Honesty matters here because Stage 3 is partly built. Treating it as
finished or assuming the next brick is in flight when it isn't are
both planning failures.

| Brick | Owner-lane | Designed | Adapters live | Screen live | Notes |
|-------|------------|----------|---------------|-------------|-------|
| **3A — Local Weakness Map** | A-side | ✓ `docs/stage-3a/` | ✓ 3 adapters (PRs #1201, #1202, #1203) | ✗ | Hard prereq Bar #1 closed; screen impl not started. |
| **3B — Suggested Practice** | A-side | ✓ `layer-model.md` §3B | ✗ engine not on main | ✗ | `feat/stage-3b-suggested-practice-engine`, `feat/stage-3b-suggested-practice-ui`, `feat/stage-3b-perf-and-counter` exist as feat branches. |
| **3C — Review Queue** | A-side | ✓ `layer-model.md` §3C | ✗ | ✗ | Paper-only. |
| **3D — Mastery Map** | A-side | ✓ `layer-model.md` §3D | ✗ | ✗ | Deferred per `layer-model.md` — *"Hardest brick of the four; depends on the others producing signal first."* |
| **v1 weakness recommender** (parallel surface) | A-side | ✓ (predates 3A) | ✓ `src/lib/weakness/` on main | ✓ (Home card, Focus Areas, daily challenge) | NOT a Stage 3 brick — server-state reader; lives next to Stage 3 until 3A's screen lands. |

The v1 surface (`src/lib/weakness/`) is **not** Stage 3. It reads
`mb_user_weakness_profile` (Supabase view) and writes nothing. It
serves the same *learner question* (what should I practice next?) as
the future 3B, but from server state rather than local signal. The
two will coexist on `main` until 3A's screen is in place; expect a
later consolidation.

---

## 3. Key files and their roles

### 3a. Stage 3A — Local Weakness Map

| File                                                          | Role                                                                                                                          |
|---------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| `docs/stage-3a/local-weakness-map-design.md`                  | Canonical design. PR #1199. Read for the *why* of every adapter shape.                                                        |
| `src/lib/stage-3a/adapters/l1TagAdapter.ts`                   | Appends an L1 `weaknessTag` from a tutor turn into `mb.stage3a.l1.recent`. Cap = 50, FIFO. PR #1201 re-land.                  |
| `src/lib/stage-3a/adapters/placementSnapshotAdapter.ts`       | Mirrors the most recent placement-session result (`{ cefr, weaknesses, completedAt, sessionId }`) into `mb.stage3a.placement.snapshot`. Latest-only (single object, not an array). PR #1202 re-land. |
| `src/lib/stage-3a/adapters/pronunciationAdapter.ts`           | Appends `PhonemeResult[]` from a Speak-tab attempt into `mb.stage3a.pronunciation.recent`. Cap = 100, FIFO. PR #1203 re-land. |
| `src/lib/stage-3a/adapters/__tests__/`                        | Per-adapter contract tests + storage-edge tests (private mode, quota, schema drift).                                          |

### 3b. Stage 3A inputs (the things adapters read from)

| Source                                                    | Where signal originates                                                                  |
|-----------------------------------------------------------|------------------------------------------------------------------------------------------|
| `src/lib/feedback/l1-error-detector.ts`                   | `detectErrors(turn, expected)` returns `L1DetectionResult` with `weaknessTag`. Pure function, called per tutor turn. |
| `src/lib/feedback/index.ts`                               | `detectL1Error` — the VN-pack adapter callsite consumers actually invoke.                |
| `supabase/functions/placement-v3-session/persistence.ts` + `core.ts` | Server-side placement engine; writes the authoritative `profiles.placement_*` row on completion. PR #1159 directional carve-out. |
| `src/lib/placement/v3/clientStub.ts`                      | Client-side placement cache (NOT the adapter — that's `placementSnapshotAdapter.ts`).    |
| `src/lib/pronunciation/sessionAttempts.ts`                | In-memory per-session attempts; the source for `recordPronunciationPhonemes` calls.      |
| `src/lib/pronunciation/cloudScorer.ts` + `scorer.ts`      | The actual scoring; the adapter records the resulting phoneme accuracies.                |

### 3c. Stage 3A outputs (what reads the adapters)

As of this audit: **nothing**. The aggregator (`aggregate-weaknesses.ts`)
and the `/weakness-map` route described in the design doc have not
been authored on `main`. The adapters write; nobody reads yet.

When the aggregator lands, it will live at:

- `src/lib/stage-3a/aggregator/` (likely) — pure reducer over the
  three ring buffers + snapshot.
- `src/pages/weakness-map/` or `/practice/weak-map/` — route TBD per
  the design doc.
- `src/components/weakness-map/` — descriptive UI; no recommendations.

### 3d. Stage 3B — Suggested Practice (not on `main`)

Currently feat-branched (see §2 table). When it lands:

- **Engine** — likely at `src/lib/stage-3b/`. Reads Stage 3A buffers
  + recent practice activity, picks **one** soft suggestion per `(c+)`
  trigger.
- **UI** — `<SuggestedPractice>` component, mounted at appropriate
  surfaces (Home? Post-lesson?). One soft prompt, dismissible.
- **Trigger semantics.** *"You may want to practice X."* Never *"You
  must complete X."*

### 3e. Weakness recommender — v1 server-state surface (live, parallel to Stage 3)

Lives at `src/lib/weakness/`. Not a Stage 3 brick but currently serves
the same learner question.

| File                                              | Role                                                                                                        |
|---------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| `recommendationEngine.ts`                         | `getTopWeaknesses(userId, n=3)`, `recommendNextLesson`, `recommendDailyChallenge`. Pure scoring + Supabase loader. |
| `weakness-catalog.ts`                             | The rule catalog (read-only): per-rule CEFR, severity, micro-lesson id.                                     |
| `micro-lessons.ts`                                | Micro-lesson definitions consumed by `recommendNextLesson`.                                                 |
| `focusAreasLogic.ts`                              | Pure state machine for the Focus Areas card (loading / no_placement / no_weaknesses / weaknesses).          |
| `focusAreasAnalytics.ts`                          | Analytics for the Focus Areas surface.                                                                      |
| `richLessonSchema.ts`                             | Lesson schema for the rich content surfaced in micro-lessons.                                               |
| `renderInlineBold.tsx`                            | Render helper (only `.tsx` here — UI helper).                                                               |

The v1 recommender reads from `mb_user_weakness_profile` (Supabase
view). It is the surface backing the Home card, Mercy debrief, and
the daily challenge.

---

## 4. Public API / surface contracts

### 4a. Stage 3A adapter contracts

All three adapters share a contract:

```ts
// Local-only, idempotent on identical inputs, no network, no Supabase,
// no `mercy_user_facts` touch. Tolerates absent localStorage.
export function appendX(entry: XEntry): void;
export function readX(): XEntry[] | XEntry | null;
```

**l1TagAdapter** — `appendL1Tag({ tag, ts })`, `readRecentL1Tags()`. Ring
buffer at `mb.stage3a.l1.recent`, capped 50, FIFO.

**placementSnapshotAdapter** — `recordPlacementSnapshot(snapshot)`,
`readPlacementSnapshot()`. Single object at
`mb.stage3a.placement.snapshot`. Overwrites on new completion.

**pronunciationAdapter** — `recordPronunciationPhonemes(phonemes)`,
`readPronunciationRecent()`. Ring buffer at
`mb.stage3a.pronunciation.recent`, capped 100, FIFO.

### 4b. Tag type — the public contract with §4 detector

```ts
// src/lib/feedback/l1-error-detector.ts
export type L1WeaknessTag = "vi_l1_no_aux_negation" | "vi_l1_subject_gender"
  | "vi_l1_co_transfer" | "vi_l1_topic_comment_fronting"
  | "vi_l1_future_adverb_bare" | …;
```

The detector's tag enum **is** the public API. Stage 3A's adapter
stores the string; the future aggregator + UI map it back to a
display string via `WEAKNESS_CATALOG` (which lives in the v1
recommender's `src/lib/weakness/weakness-catalog.ts`).

Renaming or removing a tag in the detector is a breaking change to
Stage 3A's storage shape. Add aliases or do a migration; do not
silently rename.

### 4c. Phoneme axis enum — the public contract with §5 pronunciation

```ts
// src/lib/stage-3a/adapters/pronunciationAdapter.ts
export type PainPointAxis =
  | 'TH_T' | 'R_L' | 'ED_ENDINGS' | 'S_PLURALS'
  | 'STRESS' | 'INTONATION';
```

Mirrors the `PROBLEM_PAIRS_*` constants in
`src/lib/pronunciation/vn-phoneme-map.ts`. The mapping is many-to-one:
multiple phonemes can map to a single axis. The adapter accepts the
axis as a *hint* at emit time (caller fills it in if they know),
otherwise the future aggregator derives it from the phoneme alone.

### 4d. Placement snapshot shape

```ts
interface PlacementSnapshot {
  cefr: string;             // "A2", "B1", etc.
  weaknesses: string[];     // Stable tag IDs, snake_case
  completedAt: number;      // Epoch ms
  sessionId: string;        // UUID — placement_v3_sessions.id
}
```

This is **a mirror** of `profiles.placement_*`. The server-side row
is the source of truth; the local snapshot is a UX accelerator that
lets the 3A screen render instantly without a Supabase round-trip.

### 4e. v1 recommender API

```ts
// src/lib/weakness/recommendationEngine.ts
export async function getTopWeaknesses(
  userId: string,
  n?: number,
  opts?: { fetchHistory?, now? },
): Promise<RankedRule[]>;

export async function recommendNextLesson(userId: string, opts?): Promise<MicroLesson | null>;
export async function recommendDailyChallenge(userId: string, opts?): Promise<RankedRule>;

// Pure scoring — exported for direct unit testing.
export function rankWeaknesses(history, now): RankedRule[];
```

Scoring algorithm:

```text
errorScore   = min(1, errorCount / 5)            ← saturates at 5
recencyScore = min(1, daysSinceLastAttempt / 14) ← older = higher
cefrAlign    = 1 - |ruleCefrIdx - userCefrIdx| / 5

score      = 0.6 * errorScore + 0.3 * recencyScore + 0.1 * cefrAlign
confidence = min(1, errorCount / 5)
```

Cold start (zero history): falls back to CEFR alignment alone,
returning rules in A1 → A2 → B1 order. `reason: "cold_start"` flag
on the returned recommendation.

---

## 5. Invariants

### 5a. The Stage 3A "never" list

- **Never write to Supabase from an adapter.** Per file-head comments
  on all three adapters. The `profiles.placement_*` row is the source
  of truth; the local mirror is descriptive only.
- **Never read from Supabase to render Stage 3A.** Local-only posture
  (`layer-model.md` §"Local-Only Posture"). The screen reads
  `localStorage` and the in-process `WEAKNESS_CATALOG`; nothing else.
- **Never write to `mercy_user_facts` from Stage 3A.** Semantic
  person memory and behavioral signal are distinct stores
  (the **Study OS Summary Boundary** section below, this doc).
- **Never store learner text.** Tags, timestamps, axes — yes. Raw
  user input, corrected sentences, transcripts, audio — **no**. Per
  `layer-model.md` §"Stage 3 Study OS Boundaries".
- **Never write back to placement state.** Stage 3A reads
  `profiles.placement_*` (via the snapshot mirror) but does **not**
  write it; the placement engine is the only writer
  (`placement-v3.md` "Placement Writeback Boundary").
- **Never throw from an adapter.** The Speak tab / tutor turn / room
  flow is the primary path; an adapter write failure must be a
  silent no-op so the primary path stays alive.

### 5b. The Stage 3B "never" list (per `layer-model.md` §3B)

When 3B lands:

- No daily requirement.
- No streak language.
- No XP / reward loop.
- No shame or guilt copy.
- No pushy modal.
- **No server write.**
- No global learner score.
- Dismissible every time.
- Learner can turn suggestions off entirely.

### 5c. Storage budget

Per the design doc's "≤ 4 KB per key, ≤ 12 KB total Stage-3A" budget:

| Key                                       | Cap entries | Approx bytes per entry | Approx total |
|-------------------------------------------|-------------|------------------------|--------------|
| `mb.stage3a.l1.recent`                    | 50          | ~50                    | ~2.5 KB      |
| `mb.stage3a.placement.snapshot`           | 1           | ~300                   | ~0.3 KB      |
| `mb.stage3a.pronunciation.recent`         | 100         | ~80                    | ~8 KB        |

Total ~11 KB — within the budget. If a new adapter wants more, it
must justify against this budget; localStorage has hard quota limits
(typically 5–10 MB per origin) and a noisy Stage 3A could push other
features into quota-exceeded errors.

### 5d. Schema-drift resilience

Every adapter's `read*` function **validates the parsed shape** and
filters bad entries, rather than throwing. This is intentional —
schema drift across browser sessions is the norm (a user's
localStorage carries entries from a prior version of the adapter).
The read path treats bad entries as if they didn't exist; the write
path always emits the current schema.

Add a new field? Make it optional. Remove a field? The read path
should ignore the absent field gracefully. Rename a field? The read
path must still accept the old name for at least one release.

### 5e. Idempotency

- **`l1TagAdapter`** — idempotent on the same `(tag, ts)` pair.
  Duplicate appends are silently dropped.
- **`placementSnapshotAdapter`** — latest-only. A second write
  overwrites; no duplicate detection beyond that.
- **`pronunciationAdapter`** — appends every call; the caller is
  responsible for not double-emitting the same attempt. (The Speak
  tab's session state already de-duplicates at the source.)

### 5f. Cross-system contracts

- **Tag enum** — owned by `src/lib/feedback/l1-error-detector.ts`;
  consumed by `l1TagAdapter`. Rename = breaking.
- **`PainPointAxis`** — owned by `pronunciationAdapter.ts`; mirrors
  `vn-phoneme-map.ts`. Add an axis here AND update `vn-phoneme-map.ts`
  in the same PR.
- **`placement_v3_sessions.id`** — owned by the placement engine;
  the snapshot's `sessionId` field stores it for disambiguation.

---

## 6. Known gotchas / pitfalls

### 6a. The session-storage results key is not Stage 3A

`src/lib/placement/v3/clientStub.ts:15-16` defines two keys:

- `mb.placement.v3.session` — **localStorage**, in-progress session.
  Long-lived; survives tab close.
- `mb.placement.v3.results.{sessionId}` — **sessionStorage**,
  per-session results. Cleared when the tab closes. **Not** a Stage
  3A source.

If you find yourself reading `sessionStorage` for a Stage 3A signal,
you have the wrong source. The right source is
`placementSnapshotAdapter.readPlacementSnapshot()` (which reads
localStorage).

### 6b. The L1 detector payload includes `feedback.vi/en` — don't store it

The per-turn `L1HintPayload` is `{ weaknessTag, feedback: { en, vi } }`.
The `feedback` text is **learner-facing copy**, not data — it's
human-readable and may contain L1-specific examples that could leak
learner state (e.g. "you wrote 'X yesterday' but English uses past
tense"). Storing it in a ring buffer would also bloat the budget
out of bounds.

Stage 3A stores **only the tag string**. Tag → display text is
reconstructed at read time via `WEAKNESS_CATALOG`. This is the
load-bearing design choice in the §"Stage 3 Study OS Boundaries"
posture.

### 6c. Tag enum drift across releases

Detector tag enums **will** rename across releases (e.g. when a rule
pack is split or a tag is renamed for clarity). Stage 3A's read path
already filters unknown tags. But if a user's local buffer has 50
entries under the old name, they'll all be silently dropped after
the rename.

If you rename a tag and care about historical buffer entries (you
usually shouldn't — they're descriptive, not load-bearing), add an
alias map at the read site rather than mutating localStorage on
upgrade.

### 6d. The v1 recommender reads from Supabase

`src/lib/weakness/recommendationEngine.ts` is **NOT** local-only. It
queries `mb_user_weakness_profile` (a Supabase view backed by tutor
turn / room attempt history). The v1 surface is a SERVER-state
reader.

If you find a brief that says "make Stage 3A read from
`mb_user_weakness_profile`", refuse — that's the v1 path, not Stage
3A. The two coexist deliberately.

### 6e. Aggregator empty-state branch is the *correct* empty state

The design doc and the adapter file-heads both say: "the screen
degrades to 'not enough signal yet' when this buffer is empty,
which is the correct empty state per the design doc."

Don't add a backfill mechanism that primes the buffer with synthetic
data on cold start. The empty state is honest UX — the screen tells
the learner "do a few lessons and we'll have signal." Faking it is
the same anti-pattern as a fake streak number.

### 6f. Stage 3B trigger is `(c+)` — read carefully

Per `layer-model.md` §3B: *"Trigger semantics (c+): context-triggered
AND learner-controllable."* That is:

- **Context-triggered** — only when fresh local evidence is available
  AND a useful next action exists. Cron / daily schedule do not
  qualify as context.
- **Learner-controllable** — the learner can turn suggestions off
  entirely. A dismissed suggestion stays dismissed for the session.

Implementing "show one suggestion per day at 7pm" violates the (c+)
contract. Implementing "show one suggestion after every lesson
completion if there's fresh signal" is correct.

### 6g. The `mb.placement.v3.results.{sessionId}` key bloats

If you ever find yourself in localStorage cleanup work, note that
`sessionStorage` (not localStorage) holds the per-session results
key — but the actual count of these is bounded by how many placement
sessions one tab does in its lifetime, typically 1–2. The localStorage
worry is the in-progress key (single object) and the Stage 3A
buffers (capped).

### 6h. Pronunciation adapter receives an *array*

`recordPronunciationPhonemes(phonemes: PhonemeResult[])` accepts a
batch. The Speak tab typically emits 5–10 phonemes per attempt; the
adapter applies the FIFO cap after appending the whole batch. Don't
loop calling it per phoneme — it'll re-read the storage 5–10 times
per attempt.

---

## 7. Cross-references

- **[system-overview.md §6](../system-overview.md#6-stage-3a--local-weakness-map-study-os)** — Stage 3A overview.
- **[system-overview.md §7](../system-overview.md#7-weakness-recommendation-engine-study-os-v1-surface)** — v1 weakness recommender overview.
- **[data-flow.md §1](../data-flow.md#1-learner-signal-flow-anon--stage-3a--stage-3b--practice)** — the signal flow diagram.
- **`docs/stage-3a/local-weakness-map-design.md`** — canonical
  design doc.
- **`layer-model.md`** §"Stage 3 — Study OS Sequence" — the four-brick
  spec.
- **Study OS Summary Boundary** (this doc, section below) +
  **Placement Writeback Boundary** (`placement-v3.md`).
- **Sibling deep-dives:**
  - [`billing-entitlement.md`](./billing-entitlement.md) — Stage 3
    surfaces gate on entitlement via the same hook
    (`useEntitlementQuery`); no Stage 3 surface gates on
    `profiles.tier`.
  - [`ai-tutor.md`](./ai-tutor.md) — the L1 detector turns that
    populate `l1TagAdapter` originate from tutor turns; the tutor's
    `promptAssembly.ts` reads the L1 profile separately for prompt
    injection. The two paths share the detector but not the buffer.

---

## 8. How to extend this — checklist

When you add a Stage 3 capability, walk this list.

### 8a. Adding a new Stage 3A signal source

- [ ] Confirm the source is already in the §4 detectors / §5
      pronunciation / §8 placement family. Stage 3A does not
      arbitrarily mirror other signals — each must justify against
      §"Stage 3 Study OS Boundaries".
- [ ] Define the storage shape in a fresh adapter file under
      `src/lib/stage-3a/adapters/`. Reuse the file-head boilerplate
      from the existing three.
- [ ] Pick a localStorage key under `mb.stage3a.<name>.*`. Stay
      under the §5c budget.
- [ ] Implement `record*` and `read*`. Both must tolerate absent /
      private-mode storage.
- [ ] Schema-validate on read; silently drop bad entries.
- [ ] Tests: `__tests__/<name>Adapter.test.ts` covering append,
      cap behavior, schema drift, private-mode storage, quota
      exceeded.
- [ ] Wire emit-site: the source's call site emits the adapter call
      after the original write (e.g. after the placement edge
      function's profile write completes, the client mirrors locally).
- [ ] Update `docs/stage-3a/local-weakness-map-design.md` with the
      new shape.
- [ ] Update this doc's §3 table.
- [ ] Update `MEMORY.md` if the new adapter changes a public
      contract.

### 8b. Building Stage 3A's screen (when the dispatch lands)

- [ ] Read the design doc end-to-end before the first file.
- [ ] Implement the **aggregator** as a pure function first
      (`src/lib/stage-3a/aggregator/`). Inputs: results of the three
      `read*` calls. Output: a `WeaknessMap` shape (TBD per design).
- [ ] Tests on the aggregator BEFORE the UI.
- [ ] Then the UI: descriptive only, no scores, no streaks. The §1
      marketing artifact is *one screen, one story, one sentence*.
- [ ] Empty state is the **correct** state when buffers are empty —
      tell the learner "do a few lessons and we'll have signal."
- [ ] Route under `/practice/weak-map` or `/weakness-map` per the
      design doc.
- [ ] Mount the screen behind a feature flag for the first PR; flip
      after the screen has been seen by Chau on real hardware.

### 8c. Building Stage 3B (when the dispatch lands)

- [ ] Engine first, pure function. Inputs: 3A buffers + recent
      practice activity + dismissal state. Output: at most ONE
      `SuggestedPractice` shape.
- [ ] Trigger semantics: (c+) — context-triggered AND
      learner-controllable. Implement the dismissal store FIRST so
      the engine can read it.
- [ ] **Zero server writes.** This is the §3B hard rule.
- [ ] UI: dismissible, copy in learner's native language, never
      shame / never "must" / never streak language.
- [ ] Mount at: post-lesson completion + Home (if no fresh signal,
      render nothing; the (c+) trigger means "absence is OK").
- [ ] Off-switch in user settings.

### 8d. Building Stage 3C (Review Queue) or 3D (Mastery Map)

These are paper-only as of this audit. Before starting either:

- [ ] Confirm with Chau that the prior brick produced enough signal.
      3D depends on 3A–C; 3C depends on 3A.
- [ ] Re-read `layer-model.md` §3C / §3D — they exist as named bricks
      with explicit non-negotiables (no XP, no streak pressure).
- [ ] If the design requires a server write, the entire posture
      changes — that is a `layer-model.md` §"Local-Only Posture"
      break and requires explicit owner sign-off, not implicit by
      implementation.

### 8e. Removing or consolidating the v1 recommender

When Stage 3B is live and proven, the v1 recommender at
`src/lib/weakness/` likely consolidates. Before deleting:

- [ ] Confirm Home card, Mercy debrief, daily challenge, and
      FocusAreas all read from Stage 3B (not v1).
- [ ] Confirm the migration covers cold-start cases — v1 has a
      cold-start fallback the local-only Stage 3B doesn't yet.
- [ ] Confirm `mb_user_weakness_profile` view consumers are gone or
      ported.
- [ ] Stage the removal: feature flag → flag readers gone → flag
      removed → v1 code removed. Each step is its own PR.

---

## 9. The two-line summary

> Stage 3 turns detector + placement + pronunciation signal into a
> learner-facing "what am I weak at / what to practice / what to
> review / what do I know" sequence. As of this audit: 3A's three
> adapters are live on `main`, the screen is not; 3B is feat-branched,
> not merged; 3C/3D are paper-only; the parallel v1 weakness
> recommender at `src/lib/weakness/` is the server-state surface
> currently in production and will be consolidated when 3B lands.
> The entire sequence is local-only by strategic design —
> `mercy_user_facts` is semantic person memory and stays separate
> from behavioral signal.

If you ever need to explain Stage 3 in two sentences, those are them.

---

## Strategic invariant: Study OS Summary Boundary (migrated from STRATEGY.md §12)

> **Migrated 2026-06-05 (V3 forward-fix), verbatim from `STRATEGY.md@d73f91674^` §12.**
> This is the canonical home for the Study OS Summary Boundary. References that
> formerly read "`STRATEGY.md` §12 — Study OS Summary Boundary" now point here.

### Study OS Summary Boundary

Study OS needs safe behavioral signals, but those signals are not the same thing as Mercy's semantic memory.

- `mercy_user_facts` / episodic memory = semantic person memory: what Mercy remembers about the learner/person.
- Study OS event summaries = local, time-windowed behavioral summaries: what the learner has been doing recently in study flows.

Study OS event summaries may be derived from #1109 safe local learning events only as counts, booleans, timestamps, and other safe aggregates. They must not contain raw learner text, corrected sentence text, full transcripts, raw audio, PII, child identity, Placement result/status/writeback, Supabase sync, or external analytics.
