# RECON — Anonymous Mercy Feedback Scoping (A89)

**Date:** 2026-05-19
**Author:** A89
**Status:** SCOPING ONLY — no code. Chau decides go/no-go.
**Trigger:** A79 surfaced that anon users have zero UI surface for the
mercy-feedback 👎 widget (both `MercyAnswerFeedback` mounts are auth-gated).
Feedback API + DB verified working (`mercy_feedback_events` id=3, service-role read).

---

## TL;DR

**Recommendation: Option B — leave feedback auth-only.** Not for the
"auth has higher signal" reason in the brief, but for a stronger one
the audit uncovered:

> **There is no live, anonymous-reachable surface that produces real
> Mercy *LLM* output a user would meaningfully thumbs-down.** The two
> existing auth-gated mounts already cover **100%** of live real-Mercy-
> output surfaces.

The A79 gap ("anon has no feedback widget") is real but **moot**: anon
users also have no real Mercy answer to rate. Option A as literally
specified (mount on `/mercy/chat`) would attach the widget to **canned
stub text**, capturing noise — the opposite of what the feedback
workstream exists for.

The actionable insight for Chau is a *different* gap: `/mercy/chat`
(`UnifiedMercyChat`) is a UX shell with a hardcoded `craftReply()` stub,
not a live LLM chat. When that TODO is wired to `guide-assistant`,
anon feedback there becomes genuinely valuable and is ~15–25 LOC with
**zero** RLS/CORS/rate-limit work (transport is already anon-native).

---

## 1. Strategy alignment check (STRATEGY.md / NORTH_STAR)

STRATEGY.md §10 — the single most important number is *Monthly Active
Paying Users*; "Signups without engagement" is an explicit **vanity
metric to ignore**. §13 decision framework Q5: "Is the effort justified
by the impact?"

Catching real-user pain fast (the soft-launch goal) **does** favor anon
feedback *in principle* — the loudest pain signal is from someone who
bounced before signing up. But the principle only pays off if the anon
surface actually emits the thing being rated. It does not (Section 3).
So anon feedback today scores low on Q5: effort spent collecting
thumbs-down on canned stub strings is effort not justified by impact.

No conflict with the five non-negotiables *except* one hard constraint:
**Non-negotiable #2 (Kids mode is sacred — no monetization CTAs, no
added UI friction, parents trust us).** Any anon-feedback design must
hard-suppress the widget in kids mode. `MercyGuidePanel` already exposes
`kidsModeActive` (panel line 974) as a clean guard.

---

## 2. Anon UX surface audit

Route gating read from `src/router/AppRouter.tsx`. "Anon-reachable" =
route renders without `RequireAuth` and the page does not internally
redirect signed-out users away before Mercy output.

| Surface | Route | Anon-reachable? | Produces Mercy output? | Real LLM? |
|---|---|---|---|---|
| Unified chat | `/mercy/chat` → `MercyUnifiedPage` → `UnifiedMercyChat` | ✅ yes (no `RequireAuth`) | ✅ yes, visible "mercy" bubbles | ❌ **canned `craftReply()` stub** |
| Mercy v2 thread | `/mercy` → `MercyThreadPage` → `ConversationThread` | ❌ `RequireAuth` | ✅ yes | ✅ `guide-assistant` |
| Writing session | `/writing/:promptId` → `WritingPracticeSessionPage` | ⚠️ route is anon, but `handleSubmit` hard-blocks without `userId` ("Bạn cần đăng nhập để gửi bài") | feedback only renders post-submit | ✅ (auth-required to reach it) |
| Classic Mercy bubble | `MercyGuide` → `MercyGuidePanel`, mounted in `AppShell` (Home), `Home.tsx`, `RoomRenderer` (`MercyGuideCorner`), `ChatHub` | ✅ yes (incl. anon kids/free rooms) | tabs: Teacher / Speak / Grammar / Logic | ⚠️ **see §3** |
| Kids rooms | `/room/:roomId` where id matches `_kids_l1/2/3` (`RequireAuthForRoom` skips auth) | ✅ yes | Speak tab = **pre-recorded mp3**, persona | ❌ no LLM text |
| `/onboarding` | anon per A79 | picker UI | ❌ no Mercy answer | n/a |

### The decisive detail — the classic bubble's LLM path is dead code

The real Mercy LLM caller is `askMercyApi.ts` → `guide-assistant` edge
function. Its consumers:

- `ConversationThread.tsx` — the auth-gated `/mercy` page (already has the widget).
- `routeMercyMessage.ts` → consumed **only** by `useMercyChat.ts` → **consumed by nothing** (zero `.ts`/`.tsx` importers outside itself).

So `askMercyApi → routeMercyMessage → useMercyChat` is a **dead chain**
for the classic bubble. `MercyTeacherTab` (live in anon rooms via
`MercyGuidePanel`) does **not** call `askMercyApi`. The live
`MercyGuidePanel` Grammar/Logic tabs are gated by `accessFeatures`
(tier/paid) **and** `!kidsModeActive` — not anon.

**Net: the only live surfaces emitting real Mercy LLM bilingual answers
are the two existing auth-gated `MercyAnswerFeedback` mounts.** They are
correctly auth-gated because the LLM itself (`guide-assistant`, writing
feedback) is auth/tier-coupled.

---

## 3. Per-surface "worth a thumbs-down?" verdict

- **`/mercy/chat` (anon, highest-traffic anon Mercy entry):** Mercy
  "replies" are `craftReply(inline, lang)` — fixed strings like
  *"Mercy đây — mình muốn luyện gì hôm nay?"*. The file comment is
  explicit: *"Tiny canned reply — the real product hooks an LLM in
  here."* Rating these captures **noise**, not the
  `vi_machine_translated` signal `MercyAnswerFeedback` was built for
  (its header: *"so we can finally read real machine-translated VN
  samples"*). **Not a valid target today.**
- **Classic bubble (anon, Home/rooms):** real LLM chat path is dead
  code; live tabs are access-gated or persona/mp3. **No anon LLM text
  to rate.**
- **Kids rooms (anon):** pre-recorded audio + persona, no LLM text;
  and non-negotiable #2 forbids the extra UI. **Excluded by policy.**
- **Existing two mounts:** already capturing the real signal, gated
  because the LLM is gated. **Working as intended.**

High-traffic enough to matter? `/mercy/chat` is the highest-traffic
anon Mercy *entry point* — but it has no real output to evaluate, so
traffic doesn't convert to signal.

---

## 4. Recommendation

### ✅ Option B — leave feedback auth-only (RECOMMENDED)

Rationale (stronger than the brief's "higher signal"): **no live anon
surface emits real Mercy LLM output**, so anon feedback today either
collects noise (mount on `/mercy/chat` stub) or requires first building
a live anon LLM chat (large, out of scope). The auth-gated mounts
already cover 100% of live real-Mercy-output surfaces. Zero code,
zero risk, no strategy conflict.

### ⏸ Option A — mount on `/mercy/chat` — DEFER, do not do now

Correct *only after* `UnifiedMercyChat`'s `craftReply()` stub is
replaced with a real `guide-assistant` call (the existing in-code TODO,
unowned). Until then it mounts feedback on canned strings. Recorded
here so it's a one-step pickup the moment the LLM seam lands.

### ❌ Option C — anon + Turnstile + rate-limit — NOT recommended

Overkill for a ~100-user soft-launch, and pointless while there is no
real anon output to protect the collection of. Noted only for
completeness.

---

## 5. Implementation sketch (for Option A — *when* the LLM seam lands)

This is the future pickup, not this PR.

**Files touched (est. 1 file, ~15–25 LOC):**

- `src/components/mercy-guide/UnifiedMercyChat.tsx` — render
  `<MercyAnswerFeedback>` under each `role === "mercy"` message in the
  `state.messages.map(...)` block (~line 295). Props derive from data
  already in scope:
  - `answerText={m.text}`
  - `responseId={m.id}` / `msgId={m.id}`
  - `conversationId` = the session id from `loadSession()` (already hydrated)
  - `surface` — add a 3rd literal to the `MercyFeedbackSurface` union
    in `MercyAnswerFeedback.tsx` (`"unified_chat"`), ~1 LOC + its test.
  - `mode="unified_chat"`, `lang` from `m.language`.
- Suppress in kids mode if `UnifiedMercyChat` is ever reachable in a
  kids context (not today — `/mercy/chat` is adult).

**Transport: already 100% anon-native — no new infra.**

- `MercyAnswerFeedback` already uses `getAnonId()` / `getSessionId()`;
  it does **not** read auth. It deliberately bypasses the
  ChatMessage-coupled `useMercyFeedback` hook (dead).
- `src/lib/send-feedback.ts` hardcodes `authUserId: null` and POSTs to
  `/api/mercy-feedback`.
- `api/mercy-feedback.ts`: CORS `*`, `POST/OPTIONS`, **no auth check**,
  writes via **service-role** key (RLS-bypassing) into
  `mercy_feedback_events`.

**New RLS / CORS / rate-limit concerns:**

- **RLS:** none. Server writes with service-role; RLS is not on the
  insert path. (`mercy_feedback_events` RLS posture is irrelevant to
  the write — it's a server endpoint, not a browser table write.)
- **CORS:** none. Already `Access-Control-Allow-Origin: *`.
- **Rate-limit:** **the only real new exposure.** Endpoint is unauthenticated,
  CORS-open, capped only at `items.slice(0, 50)` per request — no
  per-IP / per-anonId throttle, no bot check. For a ~100-user
  soft-launch this is an acceptable, *noted* risk (Option C is the
  hardening path if abuse appears). Flag for Chau, do not gate Option A
  on it.

**LOC estimate:** ~15–25 (one render block + one union member + its
unit-test line). No migration, no edge function, no env, no infra.

---

## 6. What Chau actually decides

1. **Now:** Option B (do nothing) — recommended. The A79 gap is moot.
2. **Latent product gap worth knowing:** `/mercy/chat` is a canned-stub
   shell, not a live LLM chat. That is the real thing to fix — and it's
   a separate, bigger dispatch (wire `UnifiedMercyChat` →
   `guide-assistant`), not a feedback task.
3. **Pre-wired pickup:** the moment that LLM seam lands, Option A is a
   ~20-LOC, zero-infra follow-up. This doc is the spec for it.

*No code changed. Deliverable is this doc.*
