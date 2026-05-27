# Placement v3 Engine — Deep Dive

> **Sibling of** [system-overview.md §8](../system-overview.md#8-placement-engine-adaptive-english-level-test).
>
> The Placement v3 engine is the **server-side 2PL IRT** adaptive
> English-level test. Given a Vietnamese learner, it returns a CEFR
> band (A1–C2), a list of flagged interference patterns, and a
> recommended starting room. It is the bootstrap entry into the
> adult-side learning surface (the kids surface does not use it).
>
> The engine is split into a **server-side pure kernel** (~1900 lines
> across nine `.ts` modules under `supabase/functions/placement-session/engine/`)
> and a **browser-side recommender + UI** (`src/lib/placement/v3/` +
> `src/pages/placement/v3/`). The split is deliberate: the kernel
> stays Deno-free and golden-testable; the recommender stays
> browser-friendly and uses the static `LESSON_INDEX` for room
> selection.
>
> **Read first:**
> - `supabase/functions/placement-session/engine/irt.ts` — pure 2PL
>   IRT math kernel (Baker & Kim 2017).
> - `supabase/functions/placement-session/engine/thetaEstimator.ts` —
>   EAP / MLE θ estimation.
> - `supabase/functions/placement-session/engine/itemSelector.ts` —
>   maximum-information item selection + randomesque-K exposure
>   control.
> - `supabase/functions/placement-session/engine/terminator.ts` —
>   stop-rule (precision-driven, hard-quota gated).
> - `supabase/functions/placement-session/engine/session.ts` +
>   `advance.ts` + `result.ts` — orchestration + scored-turn + result
>   assembly.
> - `src/lib/placement/v3/recommender.ts` + `lessonIndex.ts` —
>   browser-side recommender mapping CEFR → room.
> - `src/lib/placement/cefrToRoom.ts` — CEFR → room mapping (validated
>   against `public/data/*.json`).
> - `docs/placement-test-v3-design.md`,
>   `docs/placement-v3-recommendation-algorithm.md` — design source.
> - `docs/runbooks/placement-to-lesson.md` — operational runbook.

---

## 1. What it does, and why it matters strategically

A Vietnamese learner opens the app for the first time (or returns and
wants to re-take placement) and lands at `/placement/v3/welcome`. The
flow is:

1. **Welcome** (`WelcomePage.tsx`) — explains the test in Vietnamese.
2. **Who-for** (`WhoForPage.tsx`) — captures self-rating ("I'm
   learning for school / work / travel / family / curious"). The
   self-rating seeds the IRT prior (the learner's first θ̂ before
   any item is answered).
3. **Test** (`TestPage.tsx`) — adaptive loop. Each turn:
   - Server selects next item via maximum-information +
     randomesque-K exposure control.
   - User answers.
   - Server applies the response, re-estimates θ̂ (EAP early, MLE
     after enough data), runs the terminator.
   - If `stop` → finalize result.
   - If `continue` → select next item.
4. **Results** (`ResultsPage.tsx`) — shows the CEFR band, flagged
   interference patterns, recommended room, the "retest cooldown"
   note (if applicable), and a calm "what's next" CTA.
5. **Resume** (`ResumePage.tsx`) — re-entry after abandon (the
   session has a TTL of `SESSION_ABANDON_TTL_MIN` minutes).
6. **Skip** (`SkipConfirmPage.tsx`) — confirm dialog for the "skip
   placement" path; sets `profiles.placement_*` to a default
   (configurable) starting state.

Why it matters strategically:

- **§15 Axis 1 Bar #5 — CLOSED.** Placement → lesson routing E2E
  shipped via PR #1143. The recommender + `cefrToRoom` are the
  bridge.
- **`STRATEGY.md` §12 "Placement Writeback Boundary".** Placement is
  the **only** writer of `profiles.placement_cefr` /
  `profiles.placement_weaknesses` / `profiles.placement_completed_at`.
  No other surface (Stage 3A, AI Tutor, Mercy memory, Kids, …)
  writes those columns. This is the *directional* contract — the
  engine writes its own results back, no other surface ever touches
  placement state.
- **`CLAUDE.md` non-negotiable #2 (Kids mode is sacred).** Kids do
  NOT take the placement test. The kids-route entry is offline-first,
  no-login, age-appropriate; running an adaptive IRT test against a
  five-year-old would violate every principle.
- **Honesty over engagement.** The engine returns its real θ̂ with
  honest standard error. A learner whose θ̂ is mid-band gets an
  honest "you're between B1 and B2" framing, not a flatter "you're
  B2!" upsell.
- **Determinism.** The whole engine kernel is deterministic given
  injected `SessionDeps` (id, now, rng). This means goldens are
  trivially testable and a placement run can be replayed for
  forensics (`src/lib/placementForensics/`).

---

## 2. Two halves — server kernel vs browser recommender

This is the single most important orientation point.

### Half A — Server-side pure kernel

`supabase/functions/placement-session/engine/*.ts` — **nine modules,
~1900 LOC**. **Deno-free + DI-pure + golden-tested.**

The kernel is intentionally not imported anywhere in the browser
bundle. It lives under `supabase/functions/` to make this obvious
and to typecheck under `tsconfig.functions.json` (gate #6). Imports
are only from sibling kernel modules + the local `config.ts`. No
`https://` URL imports, no Deno-only APIs.

The kernel ships nine modules in a layered dependency:

```
config.ts ────────► everyone (constants)
irt.ts ───────────► thetaEstimator.ts ──► itemSelector.ts ──► session.ts
                                                              │
                                          ┌───────────────────┤
                                          ▼                   ▼
                                  terminator.ts ───────► advance.ts ─► result.ts
                                          ▲                   │
                                          └───────────────────┘
itemBank.ts ──► itemSelector.ts (item supply)
scoring.ts ───► advance.ts (Response → ScoredItem)
```

Owner-per-function discipline (each header documents what edge it
owns):

- `session.ts` — owns abandon / resume / phase edges except
  `in_progress → terminating` and `terminating → complete`.
- `advance.ts` — owns `in_progress → in_progress | terminating`
  edges (the scored-turn loop).
- `result.ts` — owns `terminating → complete` (result assembly,
  CEFR banding, retest cooldown decisions).

### Half B — Browser-side recommender + UI

`src/lib/placement/v3/*.ts` — recommender that maps `CEFRAssessment`
output to a `Recommendation` (next room + rationale). Uses the
static `LESSON_INDEX` built at compile time.

`src/pages/placement/v3/*.tsx` — page components (Welcome / WhoFor /
Test / Results / Resume / SkipConfirm) wrapped in `PlacementRouteShell`.

`src/lib/placement/cefrToRoom.ts` — the CEFR → starting-room map,
validated against `public/data/*.json` at build time. This is the
**single source of truth** for the CEFR-to-room association; the
server kernel deliberately injects a `roomForCefr` callback rather
than importing this map (browser/server split).

Why split. The kernel is pure server math. The recommender needs to
know what rooms exist in the corpus (~488 JSON files), which is a
browser-bundle concern. Keeping the map in the browser:

- Lets the recommender re-rank in response to the user's other
  signals (history, language pair, kids-mode flag) without a server
  round trip.
- Keeps the server kernel small and golden-testable in isolation.
- Avoids duplicating the corpus catalog server-side.

---

## 3. Key files and their roles

### Server kernel — math

- **`engine/config.ts`** — every constant the kernel reads:
  `PRIOR_SD`, `D` (logistic scaling), `SESSION_ABANDON_TTL_MIN`,
  `SELF_RATING_PRIOR_MEAN`, `RETEST_COOLDOWN_DAYS`,
  `MIN_PRECISION_SE`, hard-quota counts. **One file, no magic
  numbers scattered.** Design §2.7 invariant.
- **`engine/irt.ts`** (~165 lines) — pure 2PL kernel. `prob2PL`,
  `itemInformation`, `testInformation`, `seFromInformation`,
  `logLikelihood`, `scoreFn`, `infoFn`. Notation from Baker & Kim
  (2017). **No imports beyond `D` from config.** Trivially
  golden-testable.
- **`engine/thetaEstimator.ts`** (~245 lines) — `priorMeanForSelfRating`
  (self-rating → θ̂ prior), `seed` (initial `ThetaEstimate`),
  `estimateEAP` (early-test EAP estimate), `estimateMLE`
  (late-test MLE estimate), `estimate` (auto-picks EAP vs MLE based
  on item count + likelihood shape). Pure functions over arrays.

### Server kernel — selection + termination

- **`engine/itemBank.ts`** (~220 lines) — the item-supply abstraction.
  `ItemBank` interface, `Item` shape, `ItemType` discriminator
  (`'mcq' | 'cloze' | 'writing_sample' | ...`). Bank reads are pure;
  the DB layer is one level up.
- **`engine/itemSelector.ts`** (~295 lines) — selection logic.
  `eligibleItems`, `chooseTargetType`, `rankByInformation`,
  `randomesqueK` (exposure control — k=4 early, decays as `2 + 6 /
  ceil(administered/2)`), `randomesqueDraw`, `selectNextItem`.
  `SCORED_TYPES` excludes `'writing_sample'` (writing samples are
  collected for grading but do not contribute to θ̂; decision-#3
  exclusion).
- **`engine/terminator.ts`** (~135 lines) — stop-rule. `hardQuotasMet`
  (≥ N per type), `evaluateTermination` (combines hard quotas +
  precision SE threshold + eligible-item-exhaustion). Stop reasons:
  `'precision_reached'`, `'quotas_met_at_precision'`,
  `'bank_exhausted'`, `'max_items'`.

### Server kernel — orchestration

- **`engine/session.ts`** (~245 lines) — session lifecycle. Phases:
  `'pending' → 'self_rating' → 'in_progress' → 'terminating' →
  'complete' | 'abandoned'`. Owns `startSession`,
  `applySelfRating` (writes the seeded θ̂), `applyAbandon`
  (TTL-driven), `applyResume` (anchor-driven). Scoring-free by
  design — the scored-turn step lives in `advance.ts`.
- **`engine/advance.ts`** (~210 lines) — the scored turn step.
  `advance(state, response, deps)`: re-estimate θ̂, run terminator,
  select next item, transition. Idempotent — a stale / mismatched
  submit is a no-op (defensive guard).
- **`engine/scoring.ts`** (~115 lines) — `Response → ScoredItem`
  mapping. Handles the L1-revealed discount (a response that
  *reveals* the L1 pattern reduces the item's diagnostic weight)
  and the writing-sample exclusion.
- **`engine/result.ts`** (~305 lines) — `assembleResult`. Maps a
  settled `SessionState` to `ResultPayload`. Owns `terminating →
  complete`. Injects:
  - `roomForCefr` (the browser-side `cefrToRoom.ts` map)
  - Learner's prior placement-history row (DB read, injected)
  - `now`, `rng` (from `SessionDeps`)
- **`engine/types.ts`** — internal type definitions for the kernel.

### Browser-side recommender

- **`src/lib/placement/v3/recommender.ts`** — browser recommender.
  Maps `CEFRAssessment` (the kernel's output) → `Recommendation`.
  Uses `CEFR_RANK` ordering + `SKILL_TO_CATEGORY` mapping + the
  `L1_ALIASES` lookup (legacy → canonical tag rewrites).
- **`src/lib/placement/v3/lessonIndex.ts`** — `LESSON_INDEX`: a
  compile-time-built index of every room in `public/data/*.json`,
  keyed by `IndexedLesson` (id, cefr, category, l1_pattern_tags).
- **`src/lib/placement/v3/clientStub.ts`** — local-only stub for
  dev/test (lets the UI run without hitting the edge function).
- **`src/lib/placement/v3/types.ts`**,
  **`recommenderTypes.ts`** — public type surface.
- **`src/lib/placement/v3/placement-v3-types.d.ts`** — ambient type
  declarations for the cross-tree contract.

### Shared CEFR → room mapping

- **`src/lib/placement/cefrToRoom.ts`** — the single map. Validated
  against `public/data/*.json` at build time (`rooms:check` prebuild
  hook).
- **`src/lib/placement/cefrToRoom.ts`** is the source of truth even
  for the server kernel — the kernel asks for `roomForCefr` as an
  injected callback rather than importing it.

### UI pages

- **`src/pages/placement/v3/PlacementRouteShell.tsx`** — shared
  layout wrapper (header, progress indicator).
- **`WelcomePage.tsx`** — entry. Vietnamese-first copy.
- **`WhoForPage.tsx`** — self-rating capture.
- **`TestPage.tsx`** — adaptive loop, item presentation.
- **`ResultsPage.tsx`** — CEFR band, flagged patterns, recommended
  room.
- **`ResumePage.tsx`** — re-entry into an abandoned session.
- **`SkipConfirmPage.tsx`** — "skip placement" confirmation.
- **`src/lib/placement/availability.ts`** — gates the placement
  entry on `profiles.placement_completed_at` + retest cooldown.
- **`src/lib/placement/persistence.ts`** — client-side persistence
  helpers (read placement results from `profiles.*`, mirror to
  `mb.stage3a.placement.snapshot` via the Stage 3A adapter).
- **`src/lib/placement/engine.ts`** — client glue calling the edge
  function and threading `SessionDeps`.

### Edge function entry

- **`supabase/functions/placement-session/index.ts`** — the HTTPS
  edge endpoint. Threads the request body into the engine, calls
  `startSession` / `applySelfRating` / `advance` / `assembleResult`
  as appropriate, writes the result back to `profiles.placement_*`
  + the `placement_v3_sessions` table.
- **`supabase/functions/placement-v3-mercy-conversation/`** — the
  related "talk to Mercy about your placement" surface (separate
  edge function, not part of the kernel).

### Forensics

- **`src/lib/placementForensics/*`** — debugging telemetry for
  placement runs. Records every selected item + every response +
  the per-turn `ThetaEstimate`, persisting them for later replay
  via the kernel's deterministic seed/rng pair.
- **`src/pages/placement-forensics/*`** — admin-only forensics
  dashboard.

---

## 4. Public API / surface contracts

### Kernel public surface (server)

```ts
// session lifecycle
startSession(deps: SessionDeps): SessionState
applySelfRating(state, rating: SelfRating, deps): SessionState
applyAbandon(state, deps): SessionState
applyResume(state, deps): SessionState

// scored turn
advance(state: SessionState, response: Response, deps): {
  state: SessionState;
  item: Item | null;       // next item; null when terminating
  termination: TerminationDecision | null;
}

// result assembly (called when state.phase === 'terminating')
assembleResult(state: SessionState, deps: ResultDeps): ResultPayload
```

### `SessionDeps` (injected at every call site)

```ts
interface SessionDeps {
  newSessionId(): string;
  now(): string;       // ISO timestamp
  rng(): number;       // [0, 1)
  bank: ItemBank;
}
```

The engine NEVER calls `Date.now()` / `Math.random()` / generates a
UUID itself. All non-deterministic inputs are DI. This is what makes
the kernel golden-testable.

### `ResultPayload` (engine → caller)

```ts
interface ResultPayload {
  cefr: CefrBand;                 // 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  thetaHat: number;
  thetaSe: number;
  weaknesses: string[];           // canonical tag IDs
  recommendedRoomId: string;      // via injected roomForCefr
  retest: {
    eligibleAt: string | null;    // ISO; null = no cooldown
    rationale: string;            // stable machine key
  };
  growth: {
    narrativeKey: string;         // UI looks up VI copy
  };
  // … plus persistence-side metadata (sessionId, completedAt, etc.)
}
```

**No user-facing strings.** The engine emits machine keys (e.g.
`retest.rationale: 'cooldown_active'`); the UI looks up the
Vietnamese copy. This is what keeps the engine surface
deterministic + localizable.

### `Recommendation` (browser recommender → UI)

```ts
interface Recommendation {
  roomId: string;
  rationale: 'cefr_match' | 'l1_pattern_match' | 'skill_focus' | ...;
  alternates: string[];           // fallback room ids
}
```

### Database surface

- **`placement_v3_sessions`** (Postgres) — per-session row.
  `(id, user_id, phase, theta_hat, theta_se, items_administered,
  responses, started_at, completed_at, ...)`. The edge function
  writes; the engine never touches this directly.
- **`profiles.placement_cefr`**, **`profiles.placement_weaknesses`**,
  **`profiles.placement_completed_at`** — the directional-writeback
  columns. ONLY the placement edge function writes them.
- **`placement_items`** (Postgres) — IRT item bank. Read-only at
  test time; bank-authoring is a separate flow.

---

## 5. Invariants

### "No placement writeback" is *directional*, not "no writes"

`STRATEGY.md` §12. The placement edge function itself writes
`profiles.placement_*`. No OTHER surface (Stage 3A, AI Tutor,
Mercy memory, Kids, recommender re-rank, …) may write to those
columns. Misreading this as "no writes at all" would block
placement from persisting its own results.

### The kernel is Deno-free

Imports only sibling kernel files + `config.ts`. NO `https://`
URLs, no `Deno.*` APIs. This lets `tsconfig.functions.json` (gate
#6) typecheck it and lets vitest run goldens against it directly
without a Deno runtime.

### Deterministic given `SessionDeps`

Every non-deterministic input (session id, wall clock, RNG) is DI.
The kernel calls `deps.newSessionId()` / `deps.now()` /
`deps.rng()` — never the global versions. A regression that
introduces `Date.now()` inside the kernel breaks goldens AND
forensics replay.

### Owner-per-function discipline

Each module owns specific phase edges; the file headers document
which. Adding a new phase transition: edit the OWNING module, not
a different one. `advance.ts` owns `in_progress → in_progress |
terminating`. `result.ts` owns `terminating → complete`. Adding a
new transition outside this map is a strategy edit.

### Writing-sample exclusion (decision #3)

`SCORED_TYPES` in `itemSelector.ts` excludes `'writing_sample'`.
Writing samples are collected (the user types) but do not feed θ̂.
A regression that includes them in the score would inflate
information at one end of θ̂ and bias the band. Documented in
multiple kernel-file headers.

### The terminator is precision-gated AND hard-quota-gated

Both must be satisfied for `'precision_reached'`. Quota-only or
precision-only is NOT a stop. This avoids early termination on a
narrow item bank.

### `idempotent advance` — stale / mismatched submits no-op

`advance.ts` returns the unchanged state when the response doesn't
target the current item. Defensive — protects against
double-submission, replay attacks, and edge-fn retries. Don't
remove the guard.

### CEFR → room map lives in browser code

The kernel uses an injected `roomForCefr` callback. The actual map
is `src/lib/placement/cefrToRoom.ts` (browser bundle) and is
validated against `public/data/*.json` at build. The kernel must
not import the map directly; doing so re-introduces a browser-only
dependency to a Deno-free file.

### No user-facing strings in the kernel

`ResultPayload` carries machine keys. The Vietnamese copy lives in
the UI components (`ResultsPage.tsx` + `tutorUiCopy.ts`-class files).
A regression that hard-codes VI text in the kernel breaks the
localization boundary.

### Retest cooldown is in `result.ts` — not the terminator

The cooldown is post-test policy, not stop-rule logic. The
terminator doesn't know about it. `result.ts` reads the user's
prior placement history (injected) and sets
`retest.eligibleAt` / `retest.rationale`.

### Anonymous learners get a JWT before placement

Placement requires an authenticated request (the edge function
keys writes by `auth.uid()`). Anonymous-bootstrap (see
`src/lib/auth/anonymousBootstrap.ts`) provides a JWT for an
anonymous learner so they can take placement without forced
signup.

---

## 6. Known gotchas / pitfalls

### Multiple version directories (v3 / v4 / v5)

`src/lib/placement/v3/`, `v4/`, `v5/` all exist. **v3 is current
on-main**. v4 and v5 are in-flight iterations not yet wired into
the UI. Importing from the wrong version is a silent surface
divergence. Always import from `v3` unless explicitly migrating.

### Reading kernel headers is not optional

Every kernel file has a 30–40 line header explaining what edge it
owns, what decisions are locked, what doesn't live here. The
`session.ts` header alone is ~40 lines of "what is NOT in this
file". A PR that skips them re-derives decisions the team already
locked.

### "Reconstruction notes" in headers — context this session may not
have

Several kernel files (`session.ts`, `advance.ts`) carry
"RECONSTRUCTION NOTE" blocks explaining that the design + sequence
docs were ephemeral and unavailable when the file was written.
Decisions in those files are anchored to existing named constants;
the headers are the authoritative trace. Treat the headers as
canonical.

### `placement_items` bank changes are out-of-band

Adding / changing items in the bank is a strategy edit (it changes
what every learner sees). The bank lives in Postgres and is not
in repo source. Bank authoring goes through a separate flow; a
"fix the placement question" PR is a smell unless paired with a
documented bank-edit decision.

### Forensics depends on kernel determinism

`src/lib/placementForensics/` records every input and replays via
the kernel's seeded `rng`. A regression that introduces
non-determinism in the kernel breaks forensics silently — the
replay won't reproduce the original session.

### The Stage 3A snapshot adapter mirrors placement state — read-only

`src/lib/stage-3a/adapters/placementSnapshotAdapter.ts` writes
`mb.stage3a.placement.snapshot` from the canonical
`profiles.placement_*` columns after a session completes. This is
the **only** mirror, and it goes one direction
(`profiles.placement_*` → localStorage). Reversing the direction
would let local state corrupt server-truth.

### Multiple `recommender*` files (v3 + v4 + v5)

The v3 recommender is the one wired into `ResultsPage.tsx`. v4
and v5 ship parallel recommenders for in-flight iterations. The
docs at `docs/placement-v3-recommendation-algorithm.md` describe
v3; v4 / v5 designs live in their own subfolders.

### `randomesqueK` exposure control is not "random"

The k value is `max(2, 2 + 6 / ceil(administered/2))`. Early test
has high k (more exposure spread), late test has k=2 (tight
information maximization). A PR that "simplifies" to a constant k
re-introduces the early-test exposure problem the formula solves.

### CEFR cuts are in `result.ts` — not a separate config

`CEFR_CUTS` is local to `result.ts`. Changing where CEFR bands fall
is a kernel edit, not a config tweak. Pair with golden updates +
strategy review.

### Self-rating prior is the FIRST θ̂

Before any item is answered, the self-rating drives the prior mean
(via `priorMeanForSelfRating`). This is what makes the first 1-2
items appropriately calibrated. Removing the self-rating step
makes the first item harder/easier on average and reduces
information from the first 2-3 turns.

### Skip-placement writes a DEFAULT, not null

`SkipConfirmPage.tsx` confirms the skip; the persistence layer
writes a configurable default (typically A2 starting point) to
`profiles.placement_*`. The user is not in an "unknown CEFR"
state after skip — they're in the default state. A "placement
shows up again after skip" report likely means the default write
failed.

### The `placement-v3-mercy-conversation` edge function is separate

Don't confuse `placement-session/` (the engine endpoint) with
`placement-v3-mercy-conversation/` (the talk-to-Mercy surface for
placement results). They share data but are different endpoints
with different shapes.

---

## 7. Cross-references

- **`./study-os-stage-3.md`** — Stage 3A consumes
  `profiles.placement_weaknesses` (read-only) via the
  `placementSnapshotAdapter`. Boundary discussion lives there.
- **`./ai-tutor.md`** — AI Tutor injects the L1 profile + flagged
  interference patterns from placement into the prompt.
  Cross-surface read.
- **`./mercy-guide.md`** — the in-context guide surfaces the
  recommended room as a suggestion when the user opens the panel
  shortly after completing placement.
- **`../system-overview.md` §8** — high-level summary.
- **`docs/placement-test-v3-design.md`** — canonical design (the
  *what* and *why*).
- **`docs/placement-v3-recommendation-algorithm.md`** — recommender
  algorithm spec.
- **`docs/runbooks/placement-to-lesson.md`** — operational runbook.
- **`docs/placement-v3-integration-*.md`** — integration audit + bug
  log + PR body history (multiple files).
- **`docs/placement-test-wireframes.md`** — UI wireframes.
- **`STRATEGY.md` §12 "Placement Writeback Boundary"** — the canonical
  one-way-writeback rule.
- **`CLAUDE.md` "Don't break" section** under §8 in
  `system-overview.md` — the short reference.

---

## 8. How to extend this — checklist

### Adding a new item type

1. Add the discriminator to `ItemType` in `engine/itemBank.ts`.
2. Decide whether the type is `SCORED` or excluded (writing-sample
   pattern). Update `SCORED_TYPES` in `engine/itemSelector.ts` if
   it is scored.
3. Update `engine/scoring.ts` to map a `Response` of the new type
   to a `ScoredItem` (or skip if excluded).
4. Update `chooseTargetType` in `itemSelector.ts` if the new type
   has a target-count quota.
5. Write goldens at `engine/__tests__/` covering the new type's
   selection + scoring.
6. Author bank items for the new type (out-of-repo, via the bank
   authoring flow).

### Tuning the precision / stop rule

1. Read `STRATEGY.md` §12 + run the design-team check first. Stop
   rule changes affect every learner's experience.
2. The threshold lives in `engine/config.ts` (`MIN_PRECISION_SE`)
   + the hard-quota counts.
3. Update goldens at `engine/__tests__/terminator.test.ts`.
4. Run forensics replay on a sample of historical sessions to
   estimate the impact (would-have-stopped-X-items-earlier-or-later).

### Adding a new CEFR cut or rebanding

1. `CEFR_CUTS` in `engine/result.ts`. Change is a strategy edit —
   pair with `STRATEGY.md` + design review.
2. Update `cefrToRoom.ts` if the new band wants a different starting
   room.
3. Update goldens.

### Adding a new self-rating bucket

1. Add the literal to `SelfRating` in `engine/types.ts`.
2. Add the corresponding `priorMeanForSelfRating` case.
3. Update `WhoForPage.tsx` UI.
4. Update goldens for the prior-seeding test.

### Adding a new recommender rule (browser)

1. The browser recommender (`src/lib/placement/v3/recommender.ts`)
   is the right place. The kernel result is fixed — only the
   recommender decides which room to surface.
2. Update `Recommendation.rationale` union if a new rule emits a
   new rationale.
3. Add unit tests in `src/lib/placement/v3/__tests__/`.

### Modifying the room corpus (adding / removing rooms)

1. Add the JSON file to `public/data/`.
2. Update `src/lib/placement/cefrToRoom.ts` if the new room should
   be CEFR-anchored.
3. The build-time `rooms:check` prebuild hook validates that every
   referenced room exists.
4. The `LESSON_INDEX` rebuilds automatically.

### Server-side bank schema migration

1. Migration goes in `supabase/migrations/` (timestamped filename).
2. Apply via Supabase SQL Editor (per memory:
   [[project_agent_infra_access]] — agent-applied is fine via SQL
   Editor, not `db push`).
3. Update `engine/itemBank.ts` shape if the migration changes
   readable fields.
4. Pair with kernel goldens that exercise the new fields.

---

## 9. The two-line summary

Placement v3 is a server-side 2PL IRT adaptive English-level test
with a Deno-free DI-pure kernel (~1900 LOC across 9 files) and a
browser-side recommender that maps the kernel's CEFR output to a
starting room via the validated `cefrToRoom` map. The hard rails
are the directional writeback boundary (only the engine writes
`profiles.placement_*`), kernel determinism (everything DI), the
writing-sample exclusion, and the owner-per-function phase-edge
discipline.
