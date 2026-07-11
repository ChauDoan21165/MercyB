# /api/mercy-ai 502 trace — landlord roleplay (ai-conversation-turn)

**Reproducible:** `POST https://mercyblade.com/api/mercy-ai` (mode `ai-conversation-turn`,
landlord roleplay) returned **502** in three consecutive golden-flows-prod GATE runs —
`prod-golden-flows.pw.ts:109`, `expect(landlordResponse.status()).toBe(200)` received 502:
- pipeline **2668764981** (job 15294501725) — 2026-07-10T**23:41:52Z**
- pipeline **2668786171** (job 15294630010) — 2026-07-11T**00:06:50Z**
- pipeline **2668809725** (job 15294767267) — 2026-07-11T**00:24:49Z**
Pharmacy variant untested (the spec aborts at the landlord failure). Trace only — no fix.

---

## 1. What serves /api/mercy-ai in prod
**Cloudflare Pages Function: `functions/api/mercy-ai.ts`** (prod is Cloudflare Pages —
`wrangler pages deploy`; `functions/api/mercy-ai.ts` maps to the `/api/mercy-ai` route via
`onRequestPost`). The `netlify/functions/mercy-ai.ts`, `netlify/edge-functions/mercy-ai-proxy.ts`,
and root `api/mercy-ai.ts` are other-platform mirrors, NOT what prod serves.
- The `ai-conversation-turn` branch is `functions/api/mercy-ai.ts:176-237`; it calls
  **`buildAiConversationTurn(...)`** (`:201`) — the LLM turn (OpenAI; `OPENAI_API_KEY`).

## 2. Cloudflare-origin vs upstream — discriminating evidence → **CLOUDFLARE ORIGIN (Worker timeout/crash)**
All three response bodies are the **Cloudflare-branded HTML error page**:
```
<title>mercyblade.com | 502: Bad gateway</title>
Error code 502 · "The web server reported a bad gateway error."
cloudflare.com/5xx-error-landing … (CF footer)
```
This is decisive because the handler already has an application 502 path
(`functions/api/mercy-ai.ts:232-235`):
```js
} catch (err) {
  return json({ error: err.message ?? "AI conversation failed" }, 502);
}
```
If the AI **provider** had errored, the function would return that **JSON** body (`{"error": …}`)
with status 502. The observed body is instead **Cloudflare's own HTML 502 page** — which
Cloudflare serves only when it gets **no valid response from the origin Worker** (unhandled
exception, CPU/wall-clock limit, or the request killed before returning). So the Worker **never
returned** — the app's own catch never fired. **⇒ Cloudflare/origin-side: the Pages Function was
killed (timeout/limit) on the roleplay LLM call — NOT an upstream provider error surfaced through
the function.** (Discriminating between exact timeout vs CPU-limit vs crash needs the Cloudflare
Workers/Pages logs — a Chau dashboard step; the CF-page-vs-JSON split already rules out "upstream
provider error passed through.")

Most-likely mechanism: `buildAiConversationTurn` (`:201`) awaits a slow LLM subrequest with no
in-function timeout; Cloudflare Pages Functions enforce time/CPU limits, so a slow roleplay turn
gets the Worker killed → Cloudflare 502 before the `catch` (or the `json(result)` return) runs.

## 3. Shared root with placement-v3 cold-start (BUG-2026-07-09)? → **DISTINCT**
BUG-2026-07-09 is the **placement-v3 cold-start / gateway drop** on the **Supabase edge function**
`placement-v3-session` (golden flow (e): "never `net::ERR_FAILED`"), mitigated by a keepalive
(`supabase/migrations/20260709120000_placement_v3_session_keepalive.sql`). That is a **Supabase
Deno edge** runtime cold-start/drop.
The mercy-ai 502 is a **Cloudflare Pages Worker** crash/timeout — a **different runtime** and a
**different failure mode** (Worker CPU/time-limit kill, not edge cold-start). Superficially both are
"gateway 5xx on a latency-sensitive AI path," but the roots are distinct; the placement-v3 keepalive
does nothing for the mercy-ai Pages Worker. **Not the same family.**

## 4. New since today's deploys (12ff73c1→) or latent? → **NOT a today-source regression; likely latent infra/limit**
- **Source unchanged today:** every commit that touches `functions/api/mercy-ai.ts` /
  `api/_lib/deepseekSpeak.ts` (`7ae17fa56` CF-Pages port, `929c3a1a0` cost telemetry, `85944c55a`
  stt, `14b01dbd6` merge) is an **ancestor of `12ff73c1`** — i.e. it landed **before** today's deploy
  window. So today's deploys did **not** change the mercy-ai handler code.
- **Measurement is sparse:** `golden-flows-prod` runs only on `schedule` (main) or manual
  `push`/`web` (`.gitlab-ci.yml:1547` rules), so there is no dense history; I could not find a
  golden-flows GATE run that **passed** the landlord roleplay before 23:41 to prove it worked earlier.
- **Verdict:** the reproducible CF 502 is **not a today-source-code regression** (mercy-ai source is
  unchanged, ancestry-proven). It is most consistent with a **latent infra/limit condition** — the
  Pages Worker exceeding Cloudflare limits on the slow roleplay LLM call — now surfaced by three
  consecutive GATE runs. **Caveat:** today's deploy DID re-upload the Pages bundle (new Worker
  version + whatever env is configured in Cloudflare), so an **environment** change (a missing/renamed
  env var, a Cloudflare plan/limit change) can't be excluded without the Cloudflare Worker logs —
  but the application code is unchanged.

## 5. MR !2587 (synthetic selector fix) — MERGED
`!2587` state **merged**, merge commit **`75b2a45ba`**, confirmed on `origin/main`.

---

## Suggested next probe (for the fix thread, not done here)
- Read the **Cloudflare Pages → Functions → real-time logs / Workers logs** for `/api/mercy-ai`
  around the three timestamps to confirm timeout-vs-exception and see the `console.log` cost line
  (`:216`) — its presence/absence tells whether `buildAiConversationTurn` returned before the kill.
- If it's a wall-clock timeout on the LLM: add an in-function `AbortController` timeout around
  `buildAiConversationTurn` so the handler returns its own `502 {error}` (fast, observable) instead
  of being killed by Cloudflare, and/or move the heavy turn to a Supabase edge function with a
  longer budget. (Design only — out of scope for this trace.)
