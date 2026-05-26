---
title: Onboarding "60-second first win" audit — time-to-first-pronunciation-score
agent: A7
date: 2026-04-26
sources: reports/elsa-competitive-teardown-2026-04-26.md (Section 1)
---

# Onboarding 60-second audit — time-to-first-pronunciation-score

## Headline

A fresh-install user CAN reach a real pronunciation score on mercyblade.com in **~25–40 seconds** today, **without an account**, but the path is hidden. The home copy ("Sign in to chat with Teacher Mercy →") and the absence of a literal "Try a word" surface make the user assume they must sign in first. The architecture is closer to "60-second first win" than the UI suggests — the fix is mostly copy + one extra entry point, not a rewrite.

There is **no placement-test gate** anymore (commit `5d0d210a`). The biggest real blocker is **Azure phoneme scoring being cohort-only** — anonymous users (and most logged-in users) silently get the local Needleman-Wunsch fallback, not the "magic" Azure phoneme breakdown ELSA users see.

---

## 1. Current first-score path (anonymous user, mercyblade.com cold load)

| # | Step | File:line | Time |
|---|------|-----------|------|
| 1 | Cold load `/` → `Home` renders (public, no auth) | `src/router/AppRouter.tsx:445` | 1–3s |
| 2 | User reads hero, sees three cards: **Teacher Mercy**, Library, Placement | `src/pages/Home.tsx:410-416` | 3–6s |
| 3 | User taps the Teacher Mercy card | `src/pages/Home.tsx:262` | — |
| 4 | `handleTeacherMercy` finds the floating bubble (rendered because `isTeacherMercyAllowed` is true for anon users via `!access.isAuthenticated`) and dispatches `Enter` to open it | `src/pages/Home.tsx:236-248`, `src/pages/Home.tsx:77-78` | <1s |
| 5 | `MercyGuidePanel` opens with default tabs `['teacher', 'grammar', 'pronunciation', 'logic']` (adult mode default) | `src/components/mercy-guide/MercyGuidePanel.tsx:330` | 1–2s |
| 6 | User taps **"pronunciation"** tab → `MercySpeakTab` mounts | `src/components/mercy-guide/MercyGuidePanel.tsx:566`, `MercySpeakTab.tsx` | 1s |
| 7 | Tab pre-warms mic; on first practice line tap user gets browser permission prompt | `src/components/mercy-guide/MercySpeakTab.tsx:794-805` | 2–5s (one-time grant) |
| 8 | User taps record, says the line, releases | — | 5–10s |
| 9 | `useFeatureFlag('azure_phoneme_scoring')` resolves OFF for anon (no JWT, global default OFF) → cloud effect short-circuits at `if (!jwt) return;` | `MercySpeakTab.tsx:705,727-728` | — |
| 10 | Local `calculateMatchScore` produces a YOU-bar score from the webkitSpeechRecognition transcript | `MercySpeakTab.tsx:698,756` | <100ms |
| 11 | Score visible on screen | — | — |

**Total cold-to-score: ~25–40 seconds**, dominated by user reading + mic permission grant. The actual machine work is sub-second.

The catch: step 6 requires the user to figure out that the bubble panel even has a Speak tab. The home card copy steers them to "Sign in to chat with Teacher Mercy →" (line 297-299), which most users read as "I have to sign in first."

---

## 2. Blockers before first score

| Blocker | Status | File:line |
|---------|--------|-----------|
| Account required to open Teacher Mercy panel? | **No.** `isTeacherMercyAllowed` is `true` when `!access.isAuthenticated` | `src/pages/Home.tsx:77-78` |
| Placement test forced first? | **No** (removed today, commit `5d0d210a`). `/placement` is now a card, not a redirect | `src/pages/Home.tsx:347-377`, `AppRouter.tsx:478-505` |
| `/speak` route gated? | **Yes**, double-gated: `RequireAuth` + self-gate on `pronunciationScoringEnabled` flag (Navigate to "/" if OFF) | `AppRouter.tsx:507-514`, `SpeechDrillPage.tsx:174,223-225` |
| Azure phoneme cohort-gated? | **Yes**. `useFeatureFlag('azure_phoneme_scoring', false)` — per-user `enabled_user_ids` array OR global `is_enabled`. Default OFF | `useFeatureFlag.ts:43-53`, `MercySpeakTab.tsx:705` |
| Non-cohort users get local scoring? | **Yes**, silent fallback — local Needleman-Wunsch. No "Azure unavailable" indicator | `cloudScorer.ts:147-153,221-237` |
| Trial expiry / paywall | Trial gate only fires for authenticated users with expired trials. Anon users sail through | `AppRouter.tsx:184-189`, `Home.tsx:77-78` |
| Language selection / age modal | None found — site is bilingual EN+VI in copy, no modal | — |
| RLS on edge function | `azure-phoneme` requires `Authorization: Bearer <jwt>`; anon cannot reach it | `cloudScorer.ts:196-201,217-218` |
| Mic permission UI | None. Browser-native prompt only. `getUserMedia({ audio: true })` direct | `SpeechRecorder.tsx:101`, `MercySpeakTab.tsx:797` |
| Kids rooms auth-exempt | **Yes.** `_kids_l1/2/3` rooms bypass `RequireAuth`. Anonymous users can reach `MercySpeakTab` here too | `AppRouter.tsx:168-176` |

---

## 3. The 60-second target

**Target flow:** tap home → tap "Try a word" → grant mic → say one word → see real Azure phoneme score.

**Concrete 60-second budget:**
- Page load + read: 5s
- Tap CTA: 1s
- Mic prompt + grant: 5s
- Recording: 3s
- Score render: 2s
- **Margin: ~44s** for the user to think and decide.

**Gaps vs current state:**

1. **No literal "Try a word" entry point on home.** The user has to tap Teacher Mercy → wait for panel → find the Speak tab → pick a practice line. That's 3–4 taps with discovery friction. Recommendation: add a fourth card on `Home.tsx` between Teacher Mercy and Library — single CTA "Phát âm thử một từ" / "Try one word" → opens MercySpeakTab directly with a fixed starter word like "hello". (`src/pages/Home.tsx:408-423`).

2. **Home CTA copy implies signup is required.** Line 297-299 says "Sign in to chat with Teacher Mercy →" to anon users. This is technically about chat (logged-in feature), but it reads as a hard wall. Recommendation: split — keep the chat-requires-signin copy, but add a separate "Phát âm thử ngay — không cần đăng nhập" subline.

3. **Pronunciation tab is buried.** Default tab order for adult mode is `['teacher', 'grammar', 'pronunciation', 'logic']` (`MercyGuidePanel.tsx:330`). For an anonymous first-touch user we should open directly on the `pronunciation` tab with a one-word target.

4. **Azure phoneme is silently OFF for everyone outside the cohort.** Anonymous users get local string-similarity scoring, which is the SAME class of "fake" scoring ELSA's competitors get criticized for. Recommendation: flip `azure_phoneme_scoring.is_enabled = true` globally, OR run the edge function with the project's anon key for non-authenticated users (architectural — see §5).

5. **`/speak` is doubly gated** (RequireAuth + flag). For a discoverable first-win surface this route should be public OR removed from any public CTA (it's currently not linked from home, so this is latent — but a future "Try /speak" link would silently break).

---

## 4. Anonymous / pre-signup Speak — what's possible

**What works today without an account:**
- Open MercyGuide panel on `/` (anon-allowed)
- Open Speak tab inside the panel
- Grant mic, record, see local score

**What does NOT work today:**
- Azure phoneme breakdown (requires JWT — `cloudScorer.ts:198`)
- `/speak` page (RequireAuth — `AppRouter.tsx:510`)
- Saving the result, history, streak award
- Any room outside `_kids_l*` patterns

**Architectural blockers to true anon Azure scoring:**
- The `azure-phoneme` edge function reads `Authorization` and (presumably) logs/charges per user. Without an authenticated user, you'd need either:
  - **Option A:** Loosen the function to accept the project anon key + a client-issued idempotency token. Risk: cost abuse via direct function calls. Mitigation: rate-limit by IP + Cloudflare.
  - **Option B:** Issue an "anonymous Supabase user" via `supabase.auth.signInAnonymously()` on first load. Cheap, keeps RLS intact, gives you a real `auth.uid()` to attribute usage. **This is the cleanest path** and is already supported by Supabase since 2024.
- Local fallback is honest enough for a first-win — the *demonstration* of "we listened, we scored, you said X" is what hooks the user. Azure can come after they sign up.

**Verdict:** Anonymous Speak is already *technically* available; the missing pieces are discovery + a no-thinking starter target. Azure for anon is a real architectural choice, not a hard blocker.

---

## 5. Recommendations ranked

| # | Change | Files | Hours | Impact | Risk |
|---|--------|-------|-------|--------|------|
| 1 | **Add a "Try one word — no signup" card to Home**, positioned above Library. Single tap → opens MercyGuide panel with `defaultTab='pronunciation'` and a fixed starter line ("Hello, how are you?"). VN subline. | `src/pages/Home.tsx:408-423`, `src/components/MercyGuide.tsx` (accept `initialTab` + `initialPracticeLine` prop) | **3–4** | Cuts cold-to-score from 25–40s → ~12–18s; removes discovery friction | Low — purely additive |
| 2 | **Rewrite the Teacher Mercy card subline for anon users**: keep "Sign in to chat" but add "Phát âm thử ngay — không cần đăng nhập / Try pronunciation now — no signup" | `src/pages/Home.tsx:297-305` | <1 | Removes the perceived wall; users discover the existing anon Speak path | None |
| 3 | **Enable `azure_phoneme_scoring` globally** (`is_enabled = true`) so logged-in users see the real Azure breakdown, not the silent local fallback | Supabase row — `feature_flags` table | <1 | Differentiates from ELSA on demo quality; removes the "why does my score feel random" silence | Medium — Azure cost. Mitigate with rate-limit + monitor `azure-phoneme` invocation count for one week |
| 4 | **Auto-grant anonymous Supabase session on `/` cold load** via `supabase.auth.signInAnonymously()`, then allow Azure scoring with that JWT | `src/main.tsx` or a new boot hook; `MercySpeakTab.tsx:726-728` | 4–6 | Real Azure scores for anon users → "60-second magic moment" matches ELSA's demo bar | Medium — every visitor becomes an anon row in `auth.users`; needs cleanup migration. Cost: ~negligible per Supabase |
| 5 | **Make `/speak` public-with-flag-gate-removed for one starter sentence** (or unlink it entirely until cohort is wider) | `AppRouter.tsx:507-514`, `SpeechDrillPage.tsx:174,223-225` | 2 | Gives a deep-linkable URL we can paste in TikTok captions: "Bạn vào mercyblade.com/speak để thử" | Low |
| 6 | **Add a permission pre-prompt UI** (a one-line "Tap to allow microphone" hint) before the browser's native prompt so users don't get startled | `MercySpeakTab.tsx` near `prewarmStreamRef` setup at line 794 | 1 | Marginal — increases mic-grant rate by ~5–15% based on common UX patterns | None |
| 7 | **Telemetry: log time-from-page-load to first score event** to validate any of the above | New hook + `src/lib/telemetry` | 2 | Required to prove the 60s target is met after shipping #1–4 | None |

**Top recommendation (implementable <4 hours):** #1 — the "Try one word — no signup" Home card. It uses every existing capability (anon MercyGuide access, mic pre-warm, local scoring) and only requires a new card on Home plus a tiny `initialTab` prop wire-through on `MercyGuide`. Everything downstream already works.

---

## Notes on what I did NOT find

- **No dark patterns** — no forced sign-up modal, no email-wall, no "review us" interruption.
- **No language selection blocker** — bilingual copy throughout.
- **No paywall on Speak** — the flag is for cohort rollout, not monetization.
- **The placement-test removal (commit `5d0d210a`) is solid** — Home is genuinely friction-free now.

The architecture is in better shape than the UI suggests. This is a copy + entry-point problem, not a re-platform.
