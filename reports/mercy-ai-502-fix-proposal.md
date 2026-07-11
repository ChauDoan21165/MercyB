# Proposal (HELD): mercy-ai 502 → in-function abort deadline

**Status: proposal, not for self-merge — touches `functions/api/mercy-ai.ts` (app/functions code), held for Chau's review.**

## What this fixes

`golden-flows-prod`'s FOLLOW flow gets a **Cloudflare HTML 502** on the roleplay
`ai-conversation-turn` (`reports/mercy-ai-502-trace.md`): the Pages Worker is killed at
Cloudflare's platform time/CPU limit on the slow OpenAI turn **before** the handler's own
`catch` runs — decisive evidence being that the body is Cloudflare's branded HTML 502, not the
app's JSON `{error}` 502. So the app never gets to respond.

## The change

Give the whole turn an **abort deadline** so the function returns its OWN fast response before
Cloudflare kills it:

- `functions/api/mercy-ai.ts` — wrap `buildAiConversationTurn(...)` with an `AbortController`
  whose timer fires at `MERCY_AI_TURN_TIMEOUT_MS` (default **22 000 ms**, env-tunable, kept
  under Cloudflare's limit). `clearTimeout` in `finally`. On abort, return an observable,
  app-owned **`504 {error:"AI conversation timed out", timeout:true}`** instead of the opaque CF
  502.
- `api/_lib/aiConversation.ts` — thread `signal?: AbortSignal` through `AiConversationRequest`
  → both `callOpenAiJson` calls (draft + correction-gate) → the OpenAI `fetch`. On `AbortError`
  the fetch throws a stable `"OpenAI request timed out"` so the handler classifies it as the
  timeout. This genuinely **cancels** the in-flight OpenAI subrequest (frees the Worker) rather
  than abandoning it.

Two files, +56/-14. `tsc` clean under both `tsconfig.json` and `tsconfig.functions.json`. No
behaviour change on the success path (signal only ever fires past the deadline).

## Honest caveat — will golden-flows then go GREEN?

This converts an **opaque, unobservable CF 502 into an app-owned, classifiable 504** — strictly
better for diagnosis and it stops the Worker-kill. Whether it makes `golden-flows-prod` pass
depends on the *real* cause of the slowness:

- **If the kill was a spike / CPU-limit artifact** (normal turns finish in a few seconds, only
  occasional turns blow the limit) → normal turns now complete and return **200** → golden-flows
  goes green, with clean 504s only on genuine spikes. **Likely the common case.**
- **If the roleplay turn *consistently* needs longer than any safe Cloudflare budget** → this
  returns a 504 (still a golden-flows failure, but now *observable* with cost telemetry) and the
  real remedy is the bigger follow-up from the trace: **move the heavy turn to a Supabase edge
  function** with a longer budget. This MR is the correct, low-risk **first step** either way and
  makes the failure mode diagnosable so we can tell which case we're in.

## Review points for Chau

1. **Timeout value** — 22s is a guess under the CF limit; confirm the actual Pages Functions
   limit and tune `MERCY_AI_TURN_TIMEOUT_MS` (a CI/Pages env var, no redeploy needed to change).
2. **504 vs 502** — I chose 504 (Gateway Timeout) for the deadline case to distinguish it from
   genuine provider errors (still 502). Confirm the client handles 504 gracefully (it should
   fall back like any 5xx).
3. **Verify path** — after merge + deploy, re-run `golden-flows-prod` (manual, `RUN_…`) to see
   whether it's now 200 (green) or a clean 504 (→ schedule the edge-relocation follow-up).

## Relationship to the schedule work

Independent. The synthetic learner is proven green and its alert keys on its **own** journey
results (`syntheticReporter.ts` → `sendFailureAlert`), not pipeline status — so a red
golden-flows does not create false synthetic alarms. This 502 fix can land on its own timeline;
it does **not** gate re-enabling the synthetic schedule.
