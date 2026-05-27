# E2E coverage map — MercyBlade web app

**Audit date:** 2026-05-27
**Audit branch:** `test/e2e-coverage-audit-and-extension`
**Sources:** `src/router/AppRouter.tsx`, `tests/e2e/*.spec.ts`, `e2e/*.spec.ts` (legacy visual-regression suite).

## How to read this map

- **Spec dir:** `tests/e2e/` is the **smoke suite** (real dev server, anon + signed-in flows, `playwright.smoke.config.ts`). `e2e/` is the **legacy visual-regression suite** (`playwright.config.ts`). When a route has coverage in either, it is **not** counted as a zero-coverage gap, but the column shows which dir owns it.
- **Coverage:**
  - **none** — no E2E spec opens this route.
  - **transit** — a spec visits the route only as a pass-through (e.g. visits `/` to click a CTA) without asserting page-specific content.
  - **smoke** — a spec asserts key DOM / text on the page.
  - **full** — a spec exercises a meaningful click-through flow on the page.
- **Priority:**
  - **P0** — critical path (landing, onboarding, paywall, kids, placement, weak-at, pronunciation, the always-public legal pages an app reviewer hits).
  - **P1** — important secondary surfaces (rooms catalog, blog, language family pages, profession landings, signed-in account pages).
  - **P2** — nice-to-have (SEO landings, marketing variants, dev/admin sub-routes, share / redeem CTAs).

## Summary

- **Routes enumerated:** 191 (from `AppRouter.tsx`).
- **tests/e2e/ smoke specs:** 11 (`admin-flag-control`, `auth-and-placement`, `grammar-and-l1-detection`, `placement-forensics-dashboard`, `placement-to-first-lesson`, `placement-v3`, `placement-v3-vertical`, `practice-with-mercy-flow`, `pronunciation-full-flow`, `stage-3a-weak-at`, `streak-flow`).
- **e2e/ legacy specs:** 6 (`error-handling`, `kids-foundation`, `navigation`, `room-loading`, `user-journey`, `visual-regression`).
- **P0 routes with zero coverage in EITHER dir (today):** `/onboarding`, `/pricing` (= `/upgrade`), `/` first-visit anon (MarketingLandingPage). Three new specs in this MR close this gap.

## P0 routes

| Route | Page component | tests/e2e/ | e2e/ | Coverage | Notes |
|---|---|---|---|---|---|
| `/` (first-visit anon) | `MarketingLandingPage` | **NEW** `marketing-landing-anon.spec.ts` | — | smoke (NEW) | AnonymousOnboardingGate renders this when no anon pair + no user. Brand line is the locked phrase. |
| `/` (returning anon / signed-in) | `Home` | transit (in 4 specs) | `user-journey.spec.ts` | transit | Several specs land here as a stepping stone. No dedicated render-quality assertion. |
| `/onboarding` | `OnboardingPage` | **NEW** `onboarding-anon.spec.ts` | — | smoke (NEW) | Anon entry, locked #14. Public pair picker. |
| `/pricing` (= `/upgrade`) | `screens/Pricing` | **NEW** `pricing-anon.spec.ts` | — | smoke (NEW) | Conversion funnel terminus. Anon-viewable. |
| `/weak-at` | `WeakAt` | `stage-3a-weak-at.spec.ts` | — | full | Empty / populated / partial-state matrix via localStorage seed. |
| `/placement` | `placement/v3/IndexPage` | `placement-v3.spec.ts`, `placement-v3-vertical.spec.ts`, `placement-to-first-lesson.spec.ts`, `auth-and-placement.spec.ts` | — | full | Multiple specs; vertical + horizontal entry; happy-path to first lesson. |
| `/placement/who` | `placement/v3/WhoPage` | `placement-v3.spec.ts` | — | full | Profile question. |
| `/placement/test` | `placement/v3/TestPage` | `placement-v3.spec.ts` | — | full | Question set. |
| `/placement/results` | `placement/v3/ResultsPage` | `placement-v3.spec.ts`, `placement-to-first-lesson.spec.ts` | — | full | Results + lesson handoff. |
| `/speak` | `SpeechDrillPage` | `pronunciation-full-flow.spec.ts`, `practice-with-mercy-flow.spec.ts` | — | full | Mic + scorer + phoneme feedback. |
| `/kids/vi-english` | `ViKidsEnglishTutorPage` | — | `kids-foundation.spec.ts` | smoke | Kids sacred (CLAUDE.md non-negotiable #2). Picture + speak flow asserted. |
| `/privacy`, `/legal/privacy` | `Privacy` | — | — | **none** | App-store paperwork target. Static. P0 because reviewers must land here. |
| `/terms`, `/legal/terms` | `Terms` | — | — | **none** | Same as privacy. |
| `/legal/content-advisory` | `ContentAdvisory` | — | — | **none** | App-store policy target. |
| `/login` (`= /signin`, `= /signup`) | `LoginPage` | `auth-and-placement.spec.ts` (signup path) | — | smoke | Signup mutation covered; pure-render of the sign-in variant is not. |
| `/reset-password` | `ResetPasswordPage` | — | — | **none** | Anon, hits Supabase recovery API. |
| `/auth/save-progress` | `SaveProgressPage` | — | — | **none** | Anon → save funnel. |

## P1 routes

| Route | Page component | tests/e2e/ | e2e/ | Coverage | Notes |
|---|---|---|---|---|---|
| `/rooms` | `AllRooms` | — | `room-loading.spec.ts` | smoke | Public room catalog (~486 rooms). Visual-regression only today. |
| `/rooms/:roomId` | `RoomPage` (via roomLoader) | — | `room-loading.spec.ts` | smoke | Per-room render; legacy spec covers a sample. |
| `/blog` | `BlogIndex` | — | — | none | Public blog index. |
| `/blog/:slug` | `BlogPost` | — | — | none | Public blog post. |
| `/blog/weekly-digest`, `…/:weekStart` | `WeeklyDigest` | — | — | none | Public community digest archive. |
| `/languages` + 8 sub | `LanguageHub` + 8 | — | — | none | Public family hub + 8 individual landings (Vietnamese, French, German, Japanese, Chinese, Korean, Spanish). |
| `/professions` + 7 sub | `ProfessionsHub` + 7 | — | — | none | Public profession landings (nail-tech, restaurant, customer-service, tech-worker, healthcare, drivers, hospitality). |
| `/exam/ielts`, `/exam/toefl`, `/exam/toeic`, `/exam/vstep` (hubs) | exam hub components | — | — | none | Public exam hubs. |
| `/exam-prep/ielts/{listening,reading,speaking,writing}` | exam-prep components | `practice-with-mercy-flow.spec.ts` (speaking only) | — | full (speaking only); none (others) | One of four practice surfaces covered. |
| `/exam-prep/toefl/{listening,reading,speaking,writing}` | exam-prep components | — | — | none | TOEFL parallel suite. |
| `/exam-prep/toeic` | exam-prep TOEIC | — | — | none | TOEIC index. |
| `/support` | `Support` | — | — | none | Public support page. |
| `/account`, `/account/*` | `AccountPage` | `streak-flow.spec.ts` (touches `/account`) | — | transit | Signed-in account hub. |
| `/progress` | `Progress` | — | — | none | Signed-in long-term progress. |
| `/admin/feature-flags` | admin flags page | `admin-flag-control.spec.ts` | — | full | Admin flow covered; other `/admin/*` sub-pages are not. |
| `/listening`, `/listening/:clipId` | `ListeningLibraryPage`, `ClipPlayer` | — | — | none | Signed-in listening library. |
| `/practice/phoneme/:phonemeSlug` | `PhonemeDrillPage` | — | — | none | Drill page reached via internal CTAs. |
| `/pronunciation/srs` | `PronunciationSRSSessionPage` | — | — | none | Signed-in SRS queue. |
| `/vocabulary`, `/vocabulary/review` | `Library`, `ReviewSession` | — | — | none | Signed-in vocabulary. |
| `/writing`, `/writing/:promptId`, `/writing-feedback` | writing pages | — | — | none | Writing surfaces. |
| `/mock-interview`, `/mock-interview/:scenarioId`, `/mock-interview/community`, `/mock-interview/submit-prompt` | mock-interview pages | — | — | none | Signed-in mock-interview. |
| `/challenge`, `/challenge/history` | challenge pages | — | — | none | Signed-in challenge. |
| `/leaderboard`, `/leaderboard/referral` | `LeaderboardPage` | — | — | none | Public(ish) leaderboard. |
| `/u/:username` | profile page | — | — | none | Public user profile route. |
| `/cert/:code` | `CertVerifyPage` | — | — | none | Public cert verifier. |
| `/certificates` | certificates page | — | — | none | Signed-in. |
| `/share/progress` | share page | — | — | none | Public sharing target. |
| `/ai-tutor` | `AiTutor` | — | — | none | Signed-in chat tutor. The Stage 3B handoff routes here. |
| `/mercy`, `/mercy/chat` | Mercy character pages | — | — | none | Character landing. |
| `/contribute`, `/contribute/my-submissions` | contribute pages | — | — | none | Community contribution. |
| `/family` | family page | — | — | none | Signed-in family hub. |
| `/gift`, `/gift/my`, `/gift/redeem` | gift pages | — | — | none | Gift flow. |
| `/groups`, `/groups/:id`, `/groups/new` | groups pages | — | — | none | Signed-in groups. |
| `/corporate`, `/corporate/join`, `/corporate/setup` | corporate pages | — | — | none | B2B onboarding. |

## P2 routes

| Route | Coverage | Note |
|---|---|---|
| `/seo/hoc-tieng-anh-cho-nguoi-viet`, `/seo/sua-phat-am-tieng-anh`, `/seo/loi-tieng-anh-nguoi-viet-hay-sai`, `/seo/phong-van-tieng-anh`, `/seo/hoc-tieng-anh-mien-phi` | none | SEO landings; all static. |
| `/billing`, `/billing/success` | none | Stripe handoff — backend-driven; e2e via real Stripe is out of scope. |
| `/redeem`, `/promo-code` | none | Anon redirects. |
| `/tiers`, `/tiers/:tierId` | none | Tier map. |
| `/roleplay`, `/roadmap`, `/stories`, `/stories/:storyId`, `/stories/share` | none | Secondary feature surfaces. |
| `/interview`, `/interview/:slug`, `/interview/:slug/summary` | none | Mock interview entry. |
| `/culture/vn`, `/culture/vn/:packId` | none | Culture content. |
| `/dev/api`, `/dev/audio-test`, `/__sentry-smoke-test` | none | Developer-only diagnostics. |
| `/invite/:token`, `/referral`, `/referral/invite-family` | none | Referral flow. |
| `/auth`, `/auth/callback`, `/auth/recover`, `/auth/challenge`, `/auth/security` | none | Auth redirect / recovery edges. |
| `/unsubscribe` | none | Email unsubscribe entry. |
| `/xp` | none | XP history. |
| `/speech/history` | `pronunciation-full-flow.spec.ts` | smoke — already covered. |
| `/admin/*` (non-flags) | none | analytics, latency, payments, retention, etc. |
| `/ielts/writing/topic/:topicId`, `/vstep/speaking/:topicId`, `/toeic/practice/:itemId` | none | Topic-deep-link redirects. |
| `/pack/nail-tech` | none | Single profession pack landing (P2 because the hub at `/professions` is P1). |
| `/exam/{ielts,toefl,toeic}/estimator`, `/exam/{ielts,toefl}/{listening,reading,speaking,writing}` (sub-routes already counted) | none | Exam estimator + per-section sub-routes; secondary to the `/exam-prep/` prep flow. |

## What this MR adds

Three new specs under `tests/e2e/`:

1. `onboarding-anon.spec.ts` — `/onboarding` anon render + native-pick → target step click-through.
2. `pricing-anon.spec.ts` — `/pricing` anon render + key brand copy + tier list presence.
3. `marketing-landing-anon.spec.ts` — `/` first-visit anon → MarketingLandingPage hero + dual CTAs link to `/onboarding`.

All three are anon-only, do not touch Supabase, do not require any `TEST_*` env var, and use the `page.addInitScript` + `blockExternalServices` pattern already established by `stage-3a-weak-at.spec.ts`.

## Suggested follow-ups (NOT in this MR)

- **P0:** `legal-pages-anon.spec.ts` covering `/privacy`, `/terms`, `/legal/*`. Trivial render assertions; one spec.
- **P0:** `auth-pages-anon.spec.ts` covering `/login`, `/signin`, `/signup`, `/reset-password` render-only (no real auth). Plays nicely with the existing `auth-and-placement.spec.ts` which already does the signup mutation.
- **P1:** `rooms-catalog-anon.spec.ts` for `/rooms` — index renders some cards anonymously.
- **P1:** Expand `exam-prep` coverage from speaking-only (current) to listening + reading + writing.
- **P1:** `language-family-anon.spec.ts` parametrised across `/languages/{french,german,…}`.
- **P1:** `profession-landings-anon.spec.ts` parametrised across `/professions/{nail-tech,restaurant,…}`.
- **P2:** A `seo-landings-anon.spec.ts` smoke pass over the five `/seo/*` pages.

## Maintenance

Whenever a new top-level route lands in `src/router/AppRouter.tsx`, this table needs a row. Re-running the audit is cheap — `grep -E '^\s*<Route\s+path="' src/router/AppRouter.tsx | sed -E 's/.*path="([^"]+)".*/\1/' | sort -u` extracts the canonical route list.
