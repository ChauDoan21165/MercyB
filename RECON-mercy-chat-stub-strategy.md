# RECON — `/mercy/chat` Stub Shell: Diagnosis + Strategy (B1)

**Date:** 2026-05-19
**Author:** B1
**Status:** DECISION DOC — no code. Chau decides go/no-go.
**Trigger:** A89's anon-feedback scoping (PR #759) surfaced a latent gap
bigger than its own brief: `/mercy/chat` is a UX shell with a hardcoded
`craftReply()` stub, not a live LLM chat. This doc evaluates what to do
about it.

---

## TL;DR

**Recommendation: Option B — convert `/mercy/chat` into an honest
preview/CTA surface.** It is the only option that ends the active
deception, aligns with STRATEGY, carries zero cost/abuse/infra
liability, and keeps the door open to real anon Mercy later (correctly
sequenced).

**Two findings reframe the brief's premises:**

1. **Option A is not a ~20-LOC task.** A89's "transport already
   anon-native, ~15–25 LOC, zero infra" estimate is correct **only for
   the `mercy-feedback` widget endpoint** (`api/mercy-feedback.ts`:
   CORS `*`, no auth, service-role write). It is **false for
   `guide-assistant`**, the LLM. `guide-assistant` **hard-rejects
   anonymous callers** and is `user.id`-coupled end to end. Wiring it
   for anon is a central-file refactor or a new edge function — not a
   render-block change.

2. **`/mercy/chat` is an orphan route, not a funnel.** Zero inbound
   links anywhere in `src` — no component, menu, or onboarding flow
   navigates to it. It is reachable only by direct URL / SEO crawl.
   So Option C "cuts off the funnel surface" cuts off ~nothing, and
   the brief's "most fragile funnel surface" framing overstates its
   *traffic* — but it understates its *brand-impression* damage: any
   direct visitor or crawler sees a full chat UI + an AI-disclosure
   modal that then returns 5 fixed strings. The flagship
   differentiator presents as broken.

---

## 1. The stub claim — confirmed

`src/components/mercy-guide/UnifiedMercyChat.tsx:60–90`. `handleSend`
(line 179) sets every Mercy reply to `craftReply(inline, lang)` — a
`switch` over 5 fixed bilingual strings (e.g. `"Mercy đây — mình muốn
luyện gì hôm nay?"`). The file comment is explicit: *"Tiny canned
reply — the real product hooks an LLM in here."* No network call. No
model. The "AI" the `AIDisclosureModal` (Apple 5.1.1 gate, line 397)
discloses does not exist on this surface; the input is even
`data-clarity-mask`'d (line 373) as if it carried sensitive real
processing. The UI is full theater: mic button, settings, reset,
session hydration — all real; the intelligence — none.

`MercyUnifiedPage.tsx` is a thin full-page host for it.
`AppRouter.tsx:988–990` mounts it at `/mercy/chat` with **no
`RequireAuth`** (contrast `/mercy` at 978–984, which *is*
`RequireAuth`-wrapped and is the real Mercy v2 thread).

## 2. The dead-code path — confirmed, and it's abandoned-mid-build

`rg` across `src` (excluding self/tests):

| Symbol | Live consumers | Verdict |
|---|---|---|
| `useMercyChat.ts` | **none** | dead |
| `routeMercyMessage.ts` | only `useMercyChat` | dead (transitive) |
| `askMercyApi.ts` | **`ConversationThread.tsx` (live, auth-gated `/mercy`)** + dead chain | **LIVE shared infra — not dead** |

So the precise dead chain is `routeMercyMessage → useMercyChat →
(nothing)`. `askMercyApi` itself is **alive** — it powers the
auth-gated `/mercy` v2 thread.

**Abandoned mid-build, not deliberately decoupled.** Evidence:
`UnifiedMercyChat`'s own header comment says it *"replaces the
multi-tab drawer"* and `craftReply`'s comment says *"the real product
hooks an LLM in here"* — intent to wire, never executed. The classic
bubble's LLM chat hook (`useMercyChat`) was superseded by **two**
newer surfaces: `ConversationThread` (kept the real `askMercyApi`
path, auth-gated) and `UnifiedMercyChat` (kept the UX, dropped the
LLM seam). The unified surface shipped its shell ahead of its model
wiring and the wiring never landed. This is an unfinished build, not
an architectural decision to keep Mercy stub-only.

## 3. The decisive technical fact — `guide-assistant` rejects anon

`supabase/config.toml:85–86`: `[functions.guide-assistant]` →
`verify_jwt = true`.

`supabase/functions/guide-assistant/index.ts`:

- L363–373: reads `Authorization`, calls `supabaseUser.auth.getUser()`,
  then **`if (userErr || !user) return json({ error: "Unauthorized" },
  401)`**. The anon key JWT carries no user → **hard 401 for every
  anonymous caller.**
- L376 per-user AI kill-switch (`isUserAiEnabled(user.id)`); L446/280
  weakness tracking by `user_id`; L475 tier-depth policy by user;
  L497/544/557 AI-usage logging by `user_id`; L694/707 response
  persistence by `user_id`. The **entire pipeline is keyed on a real
  user.**

The only abuse backstop is `_shared/rateLimit.ts` `checkRateLimit` —
an **in-memory `Map`, per-instance, keyed on client IP**. Not shared
across serverless instances, resets on cold start, IP is rotatable. A
DB-backed `rateLimit()` exists in the same file but `guide-assistant`
does **not** use it. For an *authenticated* endpoint this is a fine
backstop (the real gate is `auth.getUser()` + per-user budget). For an
*unauthenticated public LLM endpoint* it is effectively **no
protection** — it would be the only thing between the open internet
and unbounded OpenAI-billed `gpt-4o-mini` (model, L507) calls, with
**no per-anon budget** (all budget controls are `user.id`-keyed).

## 4. Strategy alignment (STRATEGY.md)

- **§5 "What MercyBlade does NOT do": "❌ Add 'AI chat' without a
  specific learning job to do."** A free, ungated, anonymous generic
  Mercy chat is *precisely* the named anti-goal.
- **§10 north star = Monthly Active Paying Users; "Signups without
  engagement" is an explicit vanity metric to ignore.** Anon
  engagement that doesn't capture identity/activation scores low by
  the strategy's own framework.
- **§11 the conversion lever is the identity moat** (exiled
  journalist + 220K diaspora trust), not a free LLM toy.
- Scale context (§6/§10): ~6 paying users last documented, soft-launch
  ~100 profiles. Every evaluating prospect matters; an open-wallet
  endpoint is a disproportionate liability at this scale.

---

## 5. The three options

### Option A — wire `/mercy/chat` → `guide-assistant` (anon LLM)

**Estimate (corrected): NOT ~20 LOC.** `guide-assistant` 401s anon and
is `user.id`-coupled throughout. Two real paths, both large:
- **A1: refactor `guide-assistant` for a nullable-user anon path** —
  touches a central, safety-critical LLM file (crisis-keyword
  interception, weakness tracking, usage logging, tier policy,
  persistence). CLAUDE.md: *"Central files are dangerous"*, *"separate
  layers before fixing"*. High blast radius.
- **A2: new slimmed anon-only edge function** — new infra, duplicate
  persona/safety logic (drift risk; violates *"one owner per
  function"*), new abuse surface.
- Realistic scope: ~150–400+ LOC across edge fn + client + config +
  a **real distributed rate-limit store** + bot/Turnstile check + a
  **hard OpenAI cost cap** + QA of the crisis-keyword path on an
  unauthenticated surface (safety-critical). The hardening is itself
  a project.

| Axis | Assessment |
|---|---|
| Strategic alignment | ✗ **Conflicts** with §5 (aimless AI chat) + §10 (vanity engagement). Gives the paid differentiator away free with no activation capture. |
| Abuse vector | ✗ **Severe.** Unauthenticated public `gpt-4o-mini`, OpenAI-billed, only an in-memory per-IP-per-instance limiter (rotatable, cold-start-reset, not cross-instance), no per-anon budget. Open-wallet endpoint. |
| User-perception | ✓ Fixes the deception (real Mercy) — but trades it for a strategy + cost/abuse liability. |

### Option B — honest preview/CTA surface (RECOMMENDED)

Replace `UnifiedMercyChat`'s body on `/mercy/chat` with a marketing
preview: what Mercy does (bilingual, VI-first), 2–3 **verbatim real
Mercy** sample exchanges rendered statically (curated, not live), a
strong Vietnamese sign-in/start CTA, and the identity-moat trust line.
Keep the `UnifiedMercyChat` component and the route intact for the
future authed wiring.

**Estimate:** small, src-only, **zero infra**. ~1 new preview
component + route element swap. The real work is design + Vietnamese
copy — appropriate investment for a public brand surface.

| Axis | Assessment |
|---|---|
| Strategic alignment | ✓ **Strongest.** Turns a broken public surface into a conversion surface using the §11 identity moat — the actual lever. Honors §5 (no fake AI chat) and §10 (drives toward activation, not vanity). |
| Abuse vector | ✓ **None.** No LLM exposed to anon. |
| User-perception | ✓ Replaces "the product is broken" with an honest, compelling reason to sign in. **Caveat:** samples must be verbatim real Mercy output, VI-first, labeled as examples — aspirational fiction would just relocate the deception. |

### Option C — `RequireAuth`-gate `/mercy/chat`

Wrap `<MercyUnifiedPage/>` in `<RequireAuth>` (mirror
`AppRouter.tsx:978–984`). **~3 LOC.**

| Axis | Assessment |
|---|---|
| Strategic alignment | ~ Removes anon deception but **does not fix the stub** — authed users still hit `craftReply()`. And `/mercy` (v2, auth-gated) is already the *real* authed Mercy chat → gated `/mercy/chat` becomes a worse duplicate (violates *"one owner per function"*). Defensible only as emergency stop-the-bleed. |
| Abuse vector | ✓ None. |
| User-perception | ~ Anon lose a (broken, orphan, ~0-traffic) entry point — near-neutral. Authed users still misled unless paired with deleting/wiring the route. |

---

## 6. Recommendation + sequencing

**Do Option B.** It is the only option that simultaneously (1) ends
the active deception on a public brand surface, (2) aligns with
STRATEGY (§5/§10/§11), (3) carries zero cost/abuse/infra liability,
and (4) preserves the path to real anon Mercy later.

**The real insight: "anon" and "wire the LLM" are being conflated.**
`guide-assistant`'s cost/safety/budget model only holds *behind auth*.
The correct sequence is:

1. **Now → Option B.** Honest preview + CTA. Stops the brand bleed,
   serves the soft-launch conversion job.
2. **Next (separate dispatch) → wire `UnifiedMercyChat` →
   `guide-assistant` for *authenticated* users.** Real Mercy behind
   sign-in, where the user-keyed cost/abuse/safety model already
   works. Small, low-risk, no new infra. This also un-orphans the
   dead `routeMercyMessage`/`useMercyChat` decision (delete vs revive).
3. **Then → A89's feedback-widget pickup** (~20 LOC) lands naturally
   on the now-real authed chat.
4. **Only if** a deliberate anon-LLM funnel is later wanted: Option A
   as a *scoped project* (distributed rate-limit + bot check + hard
   OpenAI cost cap + anon path), not a quick wire.

Option A is not rejected forever — it is rejected **as an anonymous
surface** and **as a 20-LOC task**. Option C is the 3-LOC interim
stop-gap *only* if B cannot be scheduled immediately (and even then,
B supersedes it).

### Tradeoffs acknowledged

- **B forfeits "let anon try real Mercy."** Counter: STRATEGY §5
  explicitly doesn't want ungated AI chat; there is no real anon Mercy
  to forfeit today (B replaces a broken surface, not a working one);
  the conversion lever is trust + sign-in, not a free toy.
- **B costs design + VI copy** (unlike C's 3 LOC). Worth it for a
  public brand surface.
- **B's risk:** aspirational samples would re-introduce the deception
  subtly. Mitigation: verbatim real Mercy output only, labeled.
- **Orphan-route caveat:** `/mercy/chat` has ~0 internal traffic, so
  the *urgency* is brand/SEO impression, not funnel volume. This
  lowers the cost of doing nothing — but the fix is cheap (B) and the
  downside of a crawlable broken-flagship page is asymmetric.

*No code changed. Deliverable is this doc. Chau decides go/no-go.*
