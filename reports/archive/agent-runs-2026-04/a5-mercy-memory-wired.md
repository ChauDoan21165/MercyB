# A5 — Mercy episodic memory wired into ai-chat

**Step 7 (AI Teacher v2)** — A2 shipped the `mercy_user_facts` table
and the typed JS client, but the table was a black box: facts came
in, nothing went out. This branch closes that loop. Every ai-chat
turn now reads the user's top active facts, slots them into the
system prompt, and bumps `last_referenced_at` on the way out.

## What lands in this branch

| File | Change | Why |
| --- | --- | --- |
| `supabase/functions/ai-chat/factSlotting.ts` | **new** — pure helpers (`selectTopFacts`, `formatUserFactsSection`, `confidenceBucket`) | Pulls all logic that doesn't need Deno into a vitest-friendly module, mirroring the `categorizeUsers` pattern from email-reengagement. |
| `supabase/functions/ai-chat/index.ts` | adds `loadActiveFactsForUser`, `markFactsReferencedBatch`, threads facts into the system prompt + write-back into the background task | The actual wiring. Edge fn imports the pure helpers above. |
| `supabase/functions/ai-chat/__tests__/factSlotting.test.ts` | **new** — 15 tests covering 0/1/10 facts, sort order, confidence floor, bucket labels, header rendering | Locks the slotting behavior so future prompt tweaks don't silently regress. |

`src/lib/mercy/userFacts.ts` (A2's client) is **untouched**.
`supabase/migrations/20260501000000_mercy_user_facts.sql` is
**untouched**. No new heuristics, no LLM calls.

## Per-turn flow

1. **Authenticate** (existing). `user.id` is in scope.
2. **Load facts.** `loadActiveFactsForUser(user.id, 10)` runs against
   `mercy_user_facts` via the admin client:
   ```sql
   SELECT id, fact_type, content, confidence, last_referenced_at
   FROM mercy_user_facts
   WHERE user_id = $1 AND superseded_by IS NULL
   ORDER BY confidence DESC, last_referenced_at DESC NULLS LAST
   LIMIT 10
   ```
   Then `selectTopFacts` re-applies the in-process filter (drop
   confidence < 0.3) so a future schema relaxation can't leak weak
   facts into the prompt.
3. **Format.** `formatUserFactsSection(facts)` builds:
   ```
   ## Things I remember about you
   Use these facts to choose pacing, tone, and examples. Don't quote them
   back at the learner verbatim — adapt your reply to fit them.

   - Goal: pass IELTS 7.5 by June  (high confidence)
   - Context: lives in Saigon  (high confidence)
   - Preference: wants short replies  (medium confidence)
   - Avoidance: dislikes long lectures  (low confidence)
   ```
   Empty list → empty string → no header bleed.
4. **Inject** into the existing `systemPrompt` template, immediately
   after the room context and before the CRITICAL INSTRUCTIONS block.
   Keeps the model's instruction-priority intact.
5. **Stream** to the client (unchanged).
6. **Write back.** When the background task finishes parsing usage
   from the OpenAI SSE tail, it calls
   `markFactsReferencedBatch(activeFacts.map(f => f.id))` alongside
   the existing `logAiUsageEvent` / `logAiUsageLog` writes. All three
   ride `Promise.allSettled` so a write-back failure doesn't block
   token logging or vice versa.

## Heuristic: which facts get marked referenced?

Per the brief, **all fetched facts** are marked referenced for now.
The "substantively used" attribution would require the model to emit
a `cited_fact_ids: []` field — that's mapped out in the design doc
(reports/a2-memory-design.md §3) but explicitly deferred. For now the
trade-off is:

- **Upside:** simple, no model-output parsing, no schema bump on
  the response.
- **Downside:** facts decay slower than they should, since "fetched
  but ignored by the model" still counts as referenced.

This biases the system toward **keeping** facts longer. That's the
correct direction for a 100-user beta — false-keeps are a small UX
nuisance, false-drops are a trust violation. Revisit once we ship
LLM-based fact citation (Step 7 follow-up).

## What's NOT in this branch

- **Confidence decay job.** `decayUnusedFacts` exists in A2's client
  but isn't called anywhere yet. Ship that as its own PR (a weekly
  cron + first-of-week trigger is the design-doc plan).
- **`cited_fact_ids` response shape.** Requires both a model-prompt
  change (ask for the array) and a stream-parse change (extract from
  the JSON tail). Saved for Step 7 follow-up.
- **LLM-based fact extraction.** The heuristic extractor in
  `src/lib/mercy/factExtractor.ts` (A2) keeps doing the writes; this
  branch only handles the read path.
- **Admin "what does Mercy know about me?" UI.** Read-only first
  surface, then editable. Tracked in design doc §"Future LLM-extractor
  migration path".

## Deploy notes

The edge function ships **separately** from the `db push` flow:

```bash
supabase functions deploy ai-chat
```

The migration that backs this work (`mercy_user_facts`) is already
live in production from PR #90 — no migration changes in this branch.

## Verification

- `npm run typecheck` — clean (`tsc -p tsconfig.typecheck.json --noEmit`).
- `npx vitest run supabase/functions/ai-chat/__tests__/factSlotting.test.ts`
  — 15/15 pass.
- Manual edge function smoke test deferred until deploy — the existing
  ai-chat surface area is unchanged for users with zero facts (the
  prompt is identical to before when `formatUserFactsSection` returns
  `""`).

## Risk surface

| Risk | Mitigation |
| --- | --- |
| Slow fact query blocks the chat response | `loadActiveFactsForUser` is wrapped in try/catch; any error → `[]` → unchanged prompt. Index on `(user_id, fact_type, confidence DESC)` already exists from A2's migration. |
| Facts leak between users | `eq("user_id", user.id)` is the only filter; admin client is server-only; RLS still enforces ownership at the DB layer. Tested by the existing `userFacts.test.ts` RLS suite (A2). |
| Prompt size blows past context | Cap at 10 facts × ~200 chars = ~2 KB in the worst case; well below the 1 K-char user message floor that already drives token budgets. |
| Write-back floods the table on idle reload | Bumps only on a successful streaming response (after the SSE finishes), not on every page mount. |
