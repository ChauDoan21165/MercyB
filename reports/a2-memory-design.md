> ⚠️ **ARCHIVE-CLASS (April 2026)** — historical runbook/recon kept in
> place due to live cross-references outside `reports/`. Do not act on
> this document without verifying current state. See
> `reports/archive/agent-runs-2026-04/README.md` for context.

# A2 — Mercy episodic user-fact memory: design

Step 7 (AI Teacher v2). Cross-session, server-backed facts about each
learner that survive a single conversation and a single device. This
doc explains how the layer fits into the Mercy stack, how facts flow
into prompts, the decay strategy, and the path to LLM-based extraction.

## What's in this PR

- `supabase/migrations/20260501000000_mercy_user_facts.sql`
  — table + indexes + RLS (owner-only).
- `src/lib/mercy/userFacts.ts`
  — typed client: `addFact`, `getActiveFactsForUser`, `supersedeFact`,
  `markFactReferenced`, `decayUnusedFacts`.
- `src/lib/mercy/factExtractor.ts`
  — heuristic extractor: regex → fact candidates @ confidence 0.5.
- Unit tests for both.

## Where this fits in the existing memory stack

There are now four memory layers, each with a different concern:

| Layer | Where it lives | Scope | Purpose |
| --- | --- | --- | --- |
| `memorySchema.ts` (`mercy_host_memory`) | localStorage | per-device | UI prefs, streak, talk budget, ritual intensity |
| `teacherMemoryEngine.ts` | in-memory | per-session | last N teaching turns; continuity insights |
| `useMercyMemory.ts` (`mercy-student-memory-v2`) | localStorage | per-device | recent lesson context, trouble-words |
| **`mercy_user_facts`** (this PR) | Supabase | **cross-device, lifetime** | "what does Mercy know about this human?" |

**This PR does not modify the first three.** They serve their own
purposes and have their own validation/migration logic. Don't merge
them — `mercy_user_facts` is the long-term layer the others can read
into, not a replacement for any of them.

## Data model

```
mercy_user_facts (
  id, user_id, fact_type, content, source, confidence,
  created_at, last_referenced_at, superseded_by
)
```

- `fact_type` ∈ {`preference`, `goal`, `context`, `avoidance`}.
  Tightly bounded — adding a new type is a discussion, not a silent
  expansion.
- `source` records provenance: `user_stated` (the user told Mercy
  directly), `inferred` (heuristic extractor or future LLM extractor),
  `admin_set` (Chau or admin tool — used sparingly for known truths).
- `superseded_by` is the audit chain. Updates never overwrite — they
  insert a new row and link the old one. Reads filter on
  `superseded_by IS NULL`. Lets us answer "what did we believe last
  month, and when did it change?" without resorting to backups.
- `(user_id, fact_type, content)` is unique. The client treats unique
  violations as success and re-reads the existing row (idempotent).

RLS: owner-only on every CRUD verb. The table never exposes one user's
facts to another.

## How facts feed into prompts

The integration point is the `ai-chat` edge function (and any future
Mercy-prompt builder). The intended call sequence per chat turn:

1. **Read.** Before composing the system prompt:

   ```ts
   const facts = await getActiveFactsForUser(userId);
   ```

   Sort already happens in the client (confidence desc, then
   last-referenced desc). Take the top N (recommended N = 8 for
   normal turns, N = 20 for first-turn-of-session "deep prime").

2. **Format.** Slot into a dedicated section of the system prompt:

   ```
   ## What I know about this learner
   - Goal: pass IELTS 7.5 by June  (high confidence)
   - Context: works as a nurse in Saigon  (high confidence)
   - Preference: prefers short replies  (med confidence)
   - Avoidance: dislikes long lectures  (med confidence)
   ```

   Confidence buckets: ≥ 0.8 high, 0.5–0.8 medium, < 0.5 low. Below
   0.3 → drop entirely.

3. **Write back.** When a fact actually shaped the response (the
   model used the goal to choose pacing, or the avoidance to skip a
   format), call:

   ```ts
   await markFactReferenced(factId);
   ```

   This isn't free — it's an update per fact per turn — so only call
   for facts the prompt actually leaned on, not the whole top-N. The
   easiest implementation is to ask the model to emit the IDs it
   used (a `cited_fact_ids: []` field in the response JSON) and bump
   only those.

4. **Extract.** For user messages that look like factual statements
   ("I work as…", "I want to…"), the heuristic extractor proposes
   candidates @ 0.5. Two surfacing options:

   - **Silent autosave** (low friction, low trust): `addFact` immediately
     with `source = 'inferred'`. Confidence stays at 0.5 — these will
     decay first if never used.
   - **Confirmation chip** (high trust, more friction): show a small UI
     "Save: 'works as nurse'?" — on confirm, `addFact` with
     `source = 'user_stated'` @ 0.8.

   Recommended default: silent autosave for `goal`/`context`,
   confirmation for `avoidance` (false positives there feel intrusive).

## Decay strategy

The longer a fact sits unused, the less Mercy should trust it. People
change jobs, finish goals, drop preferences. Decay model:

- Threshold: **90 days** since `last_referenced_at` (or, for never-used
  facts, since `created_at`).
- Step: **−0.2** per decay run.
- Floor: **0**. Facts at 0 stay queryable for audit but are filtered
  out at prompt-build time (anything below 0.3 is dropped).
- Cadence: run weekly per user (e.g., on first authenticated load of
  the week). Idempotent — a fact already at the floor is skipped.

Implementation lives in `decayUnusedFacts(userId, daysUnused, step)`.
Runs client-side rather than as a SQL RPC because the policy will
likely change as we learn — we don't want a migration every time.
The candidate count per user is small (tens, not thousands), so the
client round-trip cost is fine. If it ever grows, lift it to a
SECURITY DEFINER RPC.

There's no automatic deletion. Old facts stay in the table forever
unless explicitly removed. The audit trail matters more than the
storage cost (these rows are tiny).

## Future LLM-extractor migration path

The heuristic extractor is the bootstrap. It catches obvious patterns
("I work as a…", "I want to…", "tôi không thích…") and misses
everything else. The migration to LLM-based extraction has a clear
shape:

1. **Keep the public API stable.** `extractFactsFromMessage(text)` →
   `FactCandidate[]` is the exported contract. Callers don't need to
   know whether the implementation is regex or LLM.

2. **Move to a server function.** Edge function
   `mercy-extract-facts` takes a message + recent context, returns
   the same `FactCandidate[]` shape. Calls Anthropic (Claude Haiku is
   plenty for this) with prompt caching keyed on the system prompt.

3. **Tune confidence.** LLM-extracted facts can self-report
   confidence; the function caps it at 0.6 (still half-trust — the
   model can be confidently wrong). User-confirmed facts are the
   only path to ≥ 0.8.

4. **Pick the right turns.** Not every message needs extraction. Run
   it on:
   - first user turn of a session,
   - any turn longer than ~80 characters,
   - any turn that contains first-person pronouns ("I", "tôi", "my",
     "của tôi").

5. **Delete the heuristic.** Once the LLM extractor is stable in
   prod, the regex layer becomes dead code. Either delete it or keep
   it as the dev-mode fallback when the edge function is unreachable.

## Test coverage

- `userFacts.test.ts`: 17 tests covering happy paths (insert, list,
  supersede), error paths (unique violation re-read, non-unique
  errors), and decay semantics (dedup of overlapping never-ref/old-ref
  candidates, floor-at-0 no-op).
- `factExtractor.test.ts`: 18 tests across all four fact types, both
  English and Vietnamese patterns, multi-fact extraction, dedup, and
  the avoidance-before-preference ordering invariant ("I don't like
  X" must NOT also yield "I like X").

Mocks live in `src/test/mocks/supabaseMock.ts` (existing helper).

## What this PR does NOT touch

Per the brief:

- `src/lib/teacher-mercy/memorySchema.ts` — unchanged.
- `src/lib/teacher-mercy/teacherMemoryEngine.ts` — unchanged.
- `src/lib/teacher-mercy/learningStyleProfile.ts` — unchanged.
- No edge function modifications. The wiring into `ai-chat` is a
  follow-up PR.
- No LLM calls — heuristic only.

## Follow-ups (not this PR)

- Wire `getActiveFactsForUser` into the `ai-chat` system-prompt
  builder; emit `cited_fact_ids` in responses; bump
  `last_referenced_at` from the edge fn.
- UI for "what does Mercy know about me?" — read-only at first; later,
  let the user delete or edit individual facts.
- Weekly decay job — run `decayUnusedFacts` once on Monday's first
  authenticated load (per user).
- LLM extractor edge function (see migration path above).
- Surface fact candidates to Chau via an admin queue before they go
  live, while we tune the heuristic.
