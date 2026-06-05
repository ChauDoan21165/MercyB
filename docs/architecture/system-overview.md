# System Overview

> Reference map of every major system that lives in `src/` (plus the Supabase
> edge-function and Postgres surface it talks to). Use this when you need to
> figure out *where* a feature lives before changing it.
>
> **Read order:** `STRATEGY.md` → `PRINCIPLES.md` → `CLAUDE.md` → this doc.
> Strategy explains *why* a system exists; this doc explains *where its
> code is*. If the two ever contradict, strategy wins — open an issue
> against this doc.
>
> Not a tutorial. Not a runbook. Treat it as the table of contents for the
> codebase.

---

## Conventions used in this doc

- **Owner-lane** is the planner who currently dispatches work on a system.
  Lanes are coarse:
  - **A-side** — *Vietnamese-native learners studying English* (the §1
    flagship — ~95% of effort). Lives across the L1 detector, AI Tutor,
    Mercy persona, pronunciation, placement, rooms.
  - **C-side** — *English-native learners studying a target language*
    (the second axis — ~5% of effort today, content already shipped
    across KO/JA/ZH/FR/DE/ES/VN-for-foreigners). Lives across the
    `languages/*` tracks, EN→VN detectors, the classifier room.
  - **Kids** — *Mercy Kids surface*. Sacred (CLAUDE.md non-negotiable
    #2). Offline-first, no login, no monetization CTAs.
  - **Platform** — *cross-cutting infra* (auth, billing, observability,
    routing, caching, dev server) shared by every lane.
- **Strategic priority** = the bar in `CURRENT-STATE.md` §15 (or the
  `layer-model.md` stage) the system is currently held against. "—" means the
  system is mature enough that it isn't gating an open §15 bar.
- **Key files** are anchors, not exhaustive lists. Grep + `git log -p`
  for the full surface.
- Where a system is described in detail elsewhere (`CLAUDE.md`,
  a system-specific doc under `docs/`), the existing doc is cited and
  this overview does not duplicate it.

---

## 1. Application shell & routing

**What it does.** Boots the SPA, registers the PWA service worker,
mounts global providers (auth, query client, theme, music player),
mounts the router, and renders the lazy-loaded route tree.

**Key files.**
- `src/main.tsx` — boot entry. PWA registration, fatal-error overlay,
  one-time chunk-failure recovery, legacy path normalization, deep-link
  session restore. See `CLAUDE.md` → "Boot entry".
- `src/router/AppRouter.tsx` (~1760 lines) — every route in the app.
  Wraps `/` in `AnonymousOnboardingGate`. Auth-gated routes are wrapped
  in `RequireAuth`; kids routes deliberately are not.
- `src/router/AnonymousOnboardingGate.tsx` — root-route gate. First-time
  anonymous visitor → marketing landing; returning anon (has stored
  language pair) or signed-in → Home. **Doctrine note in-file** is
  load-bearing — read it before changing the gate.
- `src/router/AppLayout.tsx`, `src/router/WebOnlyRoute.tsx` — layout
  wrappers + a route-level guard that blocks native-only paths in web.
- `src/providers/` — global React providers wired in `main.tsx`
  (auth provider, query client, theme, audio, etc.).

**Owner-lane.** Platform.
**Strategic priority.** —

**Don't break.** The boot file's one-time chunk-failure auto-reload is
the only thing that keeps users on a stale deploy from seeing a white
screen. The `AnonymousOnboardingGate` doctrine block (file head) is the
fix for the marketing-landing audit; "restoring" the old
`/onboarding` redirect re-breaks the landing CTA flow.

---

## 2. Room content pipeline

**What it does.** Loads, validates, renders, and audio-plays the ~488
room JSON files in `public/data/`. The room is the core lesson surface
for the A-side; the URL pattern is `/room/:roomId` where `roomId` is
the JSON filename minus `.json`.

**Key files.**
- `public/data/*.json` (488 files) — the learning-content corpus.
- `src/lib/roomLoader*.ts` — fetch + normalize JSON.
- `src/components/room/RoomRenderer.tsx` and
  `src/components/room/roomRenderer/helpers.ts` — pre-processors. Emit
  canonical audio *keys*, not URLs (passed to `<TalkingFacePlayButton>`).
- `src/components/room/RoomRendererUI.tsx` — render layer.
- `src/lib/roomAudioResolver.ts` — `toAudioKey` (idempotent) +
  `tryResolveLocal` + `resolveRoomAudioUrl`. See `CLAUDE.md` for the
  invariants — re-localizing kids/music audio breaks the Google Play
  200 MB cap and reverses post-d2951ddd doctrine.
- `src/hooks/useAudioUrl.ts` — React-facing wrapper.
- `scripts/rooms:check`, `scripts/validate-rooms` — prebuild validation.

**Owner-lane.** A-side (Vietnamese → English rooms).
**Strategic priority.** —

**Don't break.** `toAudioKey`'s while-loop on `audio/` is idempotent
**by design** — call sites use it defensively. All non-`http(s)://` and
non-`images/…` keys resolve through the Supabase `room-audio` public
bucket. The PWA SW caches responses so playback works offline after
first play.

**See also.** `ROOM_GUIDE.md` (canonical room-system reference),
`docs/MERCY_BLADE_ROOM_SPECIFICATION.md`.

---

## 3. Teacher Mercy engine

**What it does.** The in-product teacher character — voice, persona,
adaptive teaching loop, learner memory, repetition guard, talk budget,
tone calibration. Mercy is the through-line across every pair (every
lane uses the same engine; per-pair specifics live in §4 detectors).

**Key files.**
- `src/lib/teacher-mercy/*` — engine. Notable modules:
  - `engine.ts`, `teacherMercy.ts` — orchestration.
  - `memory.ts`, `memorySchema.ts`, `teacherMemoryEngine.ts` —
    semantic person memory (`mercy_user_facts`).
  - `responsePlanner.ts`, `repetitionGuard.ts`, `talkBudget.ts` —
    safety/quality rails.
  - `voiceEngine.ts`, `voicePack.ts` — ElevenLabs Mercy + Josh voice
    glue.
- `src/config/mercyPersona.ts` — persona constants. Treated as live
  code (read by core rooms + Account page + ~28 tests). Don't delete.
- `src/components/mercy/`, `src/components/mercy-guide/` — UI surfaces.
  Notable: `MercyGuidePanel` (Journey / Grammar / Speak / Logic tabs).
- `src/components/teacher-mercy/` — character widget UI.
- `src/mercy/brain.ts`, `replies.ts`, `ttsCache.ts` — thin app-layer
  helpers around the engine.

**Owner-lane.** Platform (the engine) + A-side (Vietnamese-side prompt
+ memory). C-side reuses the engine; per-target-language voice glue
lives next to its language track.

**Strategic priority.** Closed §15 Axis 1 Bar #3 (tutor consumes L1
profile, PR #1131).

**Don't break.** `mercy_user_facts` = semantic person memory. Study OS
event summaries are a separate behavioral signal layer (see §6 below
and `study-os-stage-3.md` "Study OS Summary Boundary"). Do not merge,
sync, or write between the two. The Speak-tab TTS chunking logic
(`speakViaTTS` + `chunkForTTS`) handles Chrome `speechSynthesis`
quirks — see `CLAUDE.md` "Mercy character / Speak tab dual invariant".

---

## 4. L1 transfer-error detection (per pair)

**What it does.** Per learner-pair rule packs that flag transfer
errors from the L1 in target-language output. Powers the tutor's
correction copy, the weakness ring buffers (§5), and the Stage 3A
"What I'm Weak At" surface (§6).

**Key files.**
- `src/lib/feedback/l1-error-detector.ts` — engine + the `L1WeaknessTag`
  type, the canonical tag enum every adapter and recommender consumes.
- `src/lib/feedback/rule-packs/vi/` — Vietnamese-side rules (A-side,
  VN→EN). 15 grammar families covered (§15 Axis 1 Bar #1, closed).
- `src/lib/feedback/rule-packs/en-vn/` — English-side rules (C-side,
  EN→VN). 8 detector rules covering 8 of 10 EN→VN transfer families.
  Wired in via `detectEnVnError`.
- `src/lib/feedback/rule-pack-types.ts` — rule-pack contract.
- `src/lib/feedback/vinglish-detector.ts` — calque/Vinglish detection
  (Vietnamese-side).
- `src/lib/feedback/l1-vn-explanations.ts` — VN-language explanations
  surfaced in the UI.
- `src/lib/l1-profiles/vi.ts` — Vietnamese L1 profile (taxonomy +
  interference patterns).
- `src/lib/l1-profiles/en.ts` — English L1 profile (mirror, for
  EN→VN learners). §15 Axis 2 Bar #1, closed.
- `evals/.baseline.json`, `evals/vi-grammar-cases.json`,
  `evals/en-vn-grammar-cases.json` — golden eval set. Detector
  regressions are caught here; the §15 Axis 1 Bar #2 (≥ 95% pass) is
  enforced against these fixtures.

**Owner-lane.** A-side (`rule-packs/vi`) + C-side (`rule-packs/en-vn`).
**Strategic priority.** §15 Axis 1 Bar #1 (closed), Bar #2 (closed,
65/65 baseline); §15 Axis 2 Bar #1 (closed), Bar #4 (closed).

**Don't break.** Adding or weakening a tag is a strategy-level edit
(it touches what the recommender ranks). Update `evals/.baseline.json`
and the relevant `*-grammar-cases.json` in the same PR. Detector tag
names are part of the public contract with Stage 3A's `l1TagAdapter`.

---

## 5. Pronunciation pipeline

**What it does.** Phoneme-level scoring + drill graduation for the
Vietnamese pain points named in `STRATEGY.md` §5. Cloud scorer (Azure)
falls back to a local Needleman-Wunsch scorer when the JWT is
missing.

**Key files.**
- `src/lib/pronunciation/vn-phoneme-map.ts` — `PROBLEM_PAIRS_*` sets
  for `th`, `r`, `l`, `final consonants` (ED endings + S plurals),
  `stress`, `intonation`. §15 Axis 1 Bar #4, closed.
- `src/lib/pronunciation/soundPairDrills.ts` — `CATEGORY_POOLS` and
  drill assembly.
- `src/lib/pronunciation/cloudScorer.ts` — Azure-backed scorer.
- `src/lib/pronunciation/scorer.ts` — local fallback.
- `src/lib/pronunciation/scoringEngine.ts`, `scoreTone.ts` — scoring
  primitives (general + tone).
- `src/lib/pronunciation/drillTelemetry.ts`,
  `phonemeHeatmap.ts`, `heatmapInsights.ts` — analytics + UI signals.
- `src/lib/pronunciation/useStreamingPronunciation.ts`,
  `streamingProtocol.ts`, `streamingScorer.ts` — streaming variant.
- `supabase/functions/azure-phoneme/`,
  `supabase/functions/azure-phoneme-stream/` — server-side Azure proxy +
  rate limiting.
- `src/components/pronunciation/` — drill UI.
- `src/pages/SpeechDrillPage.tsx`, `src/pages/PronunciationSRSSessionPage.tsx`
  — surfaces.

**Owner-lane.** A-side.
**Strategic priority.** §15 Axis 1 Bar #4 (closed). Axis 2 Bar #2
(Vietnamese tone production) is **open** — Option A scorer failed
empirical adjacent-tone verification; Option B local-pitch design
failed production-scoring viability. See `CURRENT-STATE.md` §15 for the
current honest state.

**Don't break.** Cloud scorer requires a JWT (anonymous or signed-in).
Without it, the user gets the local scorer and the per-phoneme detail
disappears silently. See `src/lib/auth/anonymousBootstrap.ts` —
flag-gated anon sign-in is the bridge.

---

## 6. Stage 3A — Local Weakness Map (Study OS)

**What it does.** Read-only, local-only mirrors of three signal
sources (L1 detector tags, placement snapshots, pronunciation phoneme
attempts) into `localStorage` ring buffers, so the upcoming Stage 3A
*"What I'm Weak At"* screen can surface recent weakness patterns
without any server round-trip, sync, or analytics.

**Key files.**
- `src/lib/stage-3a/adapters/l1TagAdapter.ts` — L1 detector tag mirror
  (`mb.stage3a.l1.recent`, ring cap = 50).
- `src/lib/stage-3a/adapters/placementSnapshotAdapter.ts` — placement
  v3 snapshot mirror.
- `src/lib/stage-3a/adapters/pronunciationAdapter.ts` — pronunciation
  phoneme mirror.
- `docs/stage-3a/local-weakness-map-design.md` (and the rest of
  `docs/stage-3a/`) — canonical design.

**Owner-lane.** A-side (Stage 3A is the §6 / `layer-model.md` step in flight).
**Strategic priority.** `layer-model.md` Stage 3 — Study OS Sequence brick A.
Adapters are landed; the screen itself is not implemented yet
(see `STRATEGY.md` §6).

**Don't break.** The adapters enforce: no Supabase writes, no network,
no `mercy_user_facts` touch, no placement-state writeback (per
`placement-v3.md` "Placement Writeback Boundary"). They tolerate
absent `localStorage` (SSR / private mode) without throwing. Tag
names are the public contract with §4's detector — keep stable.

**See also.** Stage 3B (Suggested Practice) and 3C/3D (Review Queue,
Mastery Map) are designed but not on `main` as of this audit.
Feat branches: `feat/stage-3b-suggested-practice-engine`,
`feat/stage-3b-suggested-practice-ui`. Treat them as in flight, not
canonical, until merged.

---

## 7. Weakness recommendation engine (Study OS v1 surface)

**What it does.** Scores rules from `WEAKNESS_CATALOG` against a
learner's L1-error history and returns ranked recommendations the UI
(Home card, Mercy debrief, FocusAreas CTA, daily challenge) can render
directly. Sits **next to** Stage 3A; predates it; reads from the
Supabase `mb_user_weakness_profile` view rather than the local ring
buffers.

**Key files.**
- `src/lib/weakness/recommendationEngine.ts` — `getTopWeaknesses`,
  `recommendNextLesson`, `recommendDailyChallenge`. Pure scoring is
  exported as `rankWeaknesses` for direct unit testing.
- `src/lib/weakness/weakness-catalog.ts` — rule catalog (read-only).
- `src/lib/weakness/micro-lessons.ts` — micro-lesson definitions.
- `src/lib/weakness/focusAreasLogic.ts`, `focusAreasAnalytics.ts` —
  Focus Areas card UX + analytics.
- `src/lib/weakness/richLessonSchema.ts` — lesson schema.

**Owner-lane.** A-side.
**Strategic priority.** —

**Don't conflate.** This is the v1 Study OS surface that already
exists; Stage 3A (§6) is the v2 local-only successor under build.
Both can coexist on `main` while 3A's screen lands. Recommender reads
server state; 3A reads localStorage. They are not redundant — they
serve different boundary contracts (server-side history vs. local
behavioral signal).

---

## 8. Placement engine (adaptive English-level test)

**What it does.** Adaptive placement test that gives a Vietnamese
learner a CEFR estimate, flagged interference patterns, and a starting
room. Server-side 2PL IRT engine; the learner-facing flow lives at
`/placement/*`.

**Key files.**
- `supabase/functions/placement-session/engine/*` — server-side engine.
  IRT scoring, item-bank queries, response persistence.
- `supabase/functions/placement-session/` — edge function endpoint.
- `src/lib/placement/engine.ts`, `questions.ts`, `availability.ts`,
  `cefrToRoom.ts`, `persistence.ts` — client glue.
- `src/lib/placement/v3/`, `src/lib/placement/v4/`,
  `src/lib/placement/v5/` — version-suffixed iterations.
- `src/lib/placementForensics/` — debugging telemetry for placement
  runs.
- `src/components/placement/` — UI components.
- `src/pages/placement/*`, plus the top-level `/placement` route in
  `AppRouter.tsx` lines ~862–923.
- `placement_items` table (Postgres) — IRT item bank.

**Owner-lane.** A-side.
**Strategic priority.** §15 Axis 1 Bar #5 (placement → lesson routing
E2E, closed via PR #1143).

**Don't break.** "No placement writeback" is a **directional**
contract, not a no-writes contract (`placement-v3.md` "Placement Writeback Boundary"). The placement
edge function writes its own results to `profiles.placement_*`. No
other surface (Study OS, `mercy_user_facts`, AI Tutor, Kids, etc.)
may write to placement state.

**See also.** `docs/placement-test-v3-design.md`,
`docs/placement-v3-recommendation-algorithm.md`,
`docs/runbooks/placement-to-lesson.md`.

---

## 9. AI Tutor

**What it does.** Conversational tutor surface — assembles prompts
that inject the L1 profile (§15 Axis 1 Bar #3), runs the conversation
through a provider, applies safety rails, persists session memory.

**Key files.**
- `src/lib/ai-tutor/promptAssembly.ts` — prompt assembly. Injects
  `vietnameseL1Profile.interference` into the Vietnamese teacher-voice
  block (line ~295).
- `src/lib/ai-tutor/aiTutorService.ts` — service entry.
- `src/lib/ai-tutor/sessionRuntime.ts`, `learningMemory.ts` — session
  state.
- `src/lib/ai-tutor/mockProvider.ts` — test/dev provider.
- `src/lib/ai-tutor/safety.ts`, `costLimits.ts` — safety + cost rails.
- `src/lib/ai-tutor/useBrowserStt.ts`, `useTtsSpeaker.ts` — STT/TTS
  hooks.
- `src/lib/ai-tutor/detectorHint.ts` — surface for L1 hints in the
  tutor UI.
- `src/lib/ai-tutor/tutorUiCopy.ts`, `types.ts` — copy + contracts.
- `src/pages/AiTutor.tsx` — page.
- `src/components/ai-tutor/` — UI.
- `supabase/functions/ai-tutor/`, `supabase/functions/ai-chat/`,
  `supabase/functions/ai-reasoning/` — server-side provider proxy +
  audit.

**Owner-lane.** A-side. Kids do **not** see AI Tutor (per PR #1205
re-land — the entry was removed from the launcher modal).

**Strategic priority.** §15 Axis 1 Bar #3 (closed).

---

## 10. Kids surface (Mercy Kids)

**What it does.** Offline-first, picture-and-speak, no-login,
age-appropriate learning surface for Vietnamese kids learning English.
Sacred per CLAUDE.md non-negotiable #2.

**Key files.**
- `src/lib/kids/viKidsTutorCopy.ts` — Vietnamese-language copy.
- `src/components/kids/ViKidsEnglishTutor.tsx`, `KidsRoomCard.tsx` —
  components.
- `src/pages/kids/ViKidsEnglishTutorPage.tsx` — page.
- Route: `/kids/vi-english` (registered in `AppRouter.tsx` line ~1085).
- Kids audio: `kids/*` keys resolve through Supabase `room-audio`
  bucket (post-d2951ddd) and are SW-cached for offline-after-first-play.

**Owner-lane.** Kids.
**Strategic priority.** Always-on guard. No new gating, no
monetization CTA, no AI Tutor entry.

**Don't break.** No login friction, no monetization CTA, no
streak-shaming, mobile-first at 375 px. The AI Tutor entry stayed
removed (PR #1205); re-adding is a strategy violation. Kids audio
re-localization would re-bloat the bundle past Google Play's 200 MB
cap — see `roomAudioResolver.ts` invariant.

---

## 11. Per-language tracks (C-side: KO, JA, ZH, FR, DE, ES, VN-for-foreigners)

**What it does.** Lesson tracks for English-speaking learners
studying target languages other than English. ~862 A1–C2 lessons
across six target-language tracks plus 536 Vietnamese-for-foreigners
lessons. Per `STRATEGY.md` §6 inventory.

**Key files.**
- `src/languages/<lang>/lessons.ts` — canonical `<LANG>_TOTAL_LESSONS`
  constant per track. Source of truth for the strategy-doc inventory.
- `src/languages/<lang>/` — per-track data (KO, JA, ZH, FR, DE, ES,
  VN) and any normalizers.
- `src/components/languages/`, `src/pages/languages/` — UI.
- `/languages` index — registered in `AppRouter.tsx`.
- `src/components/LanguageSwitcher.tsx` — top-level language switch.

**Owner-lane.** C-side.
**Strategic priority.** Maintained, kept discoverable (per `STRATEGY.md`
§4 — the v3.0 reset reversed the un-surfacing decision). Not the focus
of new authoring today.

**Don't break.** Un-surfacing any of these tracks is rejected by the
v3.0 strategy reset. `LanguageSwitcher`, the `/languages` index, and
per-language pages stay user-discoverable.

---

## 12. Billing & entitlement

**What it does.** Derives a user's entitlement (active or inactive,
expiry, source) from subscription rows + redeemed gifts + family-plan
flow-through + corporate seats. Powers every gate in the app.

**Key files.**
- `src/billing/computeEntitlement.ts` — pure entitlement function +
  `computeEntitlementForUser` (family-plan flow-through) +
  `computeEntitlementWithGifts` (gift stacking) +
  `getCorporateSeatEntitlement`. Heavily commented; read top-to-bottom
  for the contract.
- `src/billing/subscriptionRepository.ts` —
  `deriveEntitlementFromSubscriptions` (the canonical derivation rule)
  and the `isEntitlingSubscription` predicate.
- `src/billing/stripe/mapStripeSubscription.ts` — Stripe → internal
  shape.
- `src/billing/types.ts` — `SubscriptionRow`, `EntitlementResult`,
  `BillingProvider`, etc.
- `src/lib/getMeEntitlement.ts`, `src/lib/queries/useEntitlementQuery.ts`
  — client-facing fetch hooks.
- `supabase/functions/me-entitlement/`, `supabase/functions/_shared/entitlement/`,
  `supabase/functions/_shared/entitlement.ts`,
  `supabase/functions/_shared/premiumEntitlement.ts` — server-side
  derivation (parity with the client function above).
- `src/components/billing/`, `src/components/entitlements/`,
  `src/components/iap/`, `src/components/payment/`,
  `src/components/pricing/`, `src/screens/Pricing.tsx` — UI.
- `supabase/functions/apple-iap-sync/`, `apple-webhook/`,
  `billing-google-attach-purchase/`, `billing-stripe-change-plan/`,
  `create-billing-portal-session/`, `admin-billing-*` — edge functions
  per provider.

**Owner-lane.** Platform.
**Strategic priority.** `layer-model.md` Step 9 (Monetization Depth) — Phase A
merged (`_shared/entitlement.ts`, gates reading entitlement instead of
stale `profiles.tier`).

**Don't break.** The entitlement rule reads `status` +
`current_period_end` + `provider` from the `subscriptions` table.
**Never gate on `price_id`** — pricing experiments change `price_id`
without changing entitlement. Family-plan flow-through is depth=1
max; the seed trigger creates an owner-as-member row that
`computeEntitlementForUser` deliberately ignores. See
`docs/billing/` and `docs/billing-foundation/` for the wider runbook.

---

## 13. Auth (Supabase + anonymous)

**What it does.** Supabase auth (`@supabase/supabase-js`) + a
flag-gated anonymous sign-in bootstrap so Speak-tab users get a real
JWT for the cloud scorer without forcing signup.

**Key files.**
- `src/lib/supabaseClient.ts` — **the only** browser Supabase client
  (anon key). Singleton. Server-side service-role clients live in
  the Vercel-style serverless functions under `api/*` (today's
  registered entries per `vercel.json` are `mercy/grammar`,
  `mercy-ai`, `mercy-feedback`, `mercy-guide`, `tts` — NOT
  Stripe-webhook-related) and the Supabase edge functions under
  `supabase/functions/*` (including `stripe-webhook`, `apple-webhook`,
  and all billing webhooks). Never bundled.
- `src/integrations/supabase/client.ts` — re-export.
- `src/lib/auth/anonymousBootstrap.ts` — flag-gated anon sign-in.
- `src/lib/auth/conversion.ts`, `conversionTriggers.ts` — anon → signed
  conversion.
- `src/lib/authService.ts`, `authHelpers.ts`, `authRedirect.ts`,
  `auth.ts`, `mercyAuth.ts` — app-layer auth helpers.
- `src/providers/AuthProvider*` — context.
- `src/components/auth/` — sign-in / sign-up / reset UI.
- `src/pages/auth/`, `LoginPage.tsx`, `ResetPasswordPage.tsx`,
  `SignIn.tsx`, `Logout.tsx`.
- `supabase/functions/account-convert/`,
  `supabase/functions/account-conversion-welcome/`,
  `supabase/functions/delete-account/`.

**Owner-lane.** Platform.
**Strategic priority.** —

**Don't break.** Profile RLS hardening (PRs #578, #562 applied
2026-05-18) is closed; no agent should re-apply or re-flag those.
Browser-side `profiles` writes are removed (`fix/profiles-rls-auth-backfill`).
Auth email templates live in the Supabase dashboard, not the repo, and
**must** keep `{{ .Token }}` (the app uses 6-digit OTP entry, not link).

---

## 14. Onboarding & language pair

**What it does.** Anonymous language-pair selection (native + target),
stored in `localStorage`. Read by `AnonymousOnboardingGate` for the
return-visit path and by Home for pair-aware rendering.

**Key files.**
- `src/lib/languagePair/anonymousPair.ts` — `hasAnonymousPair`,
  read/write helpers.
- `src/lib/languagePair/languagePair.ts`, `usePairMutation.ts` — typed
  pair representation + mutation hook.
- `src/lib/onboarding/types.ts` — onboarding shape.
- `src/pages/onboarding/` — screens.
- `src/router/AnonymousOnboardingGate.tsx` — the gate.

**Owner-lane.** Platform (A-side biased — the picker defaults frame
the VN→EN path).
**Strategic priority.** Locked #14 (the picker is the anon entry
point pre-signup); `STRATEGY.md` §7 Step 10 (Duolingo-style pair
picker is a separate future dispatch).

**Don't break.** PR #590's `DEFAULT 'vi'` migration was reversed under
Locked #14 — **never re-apply**. The picker is anonymous-first; do not
re-route it behind auth.

---

## 15. Marketing & SEO

**What it does.** Static marketing surfaces (landing page, blog,
SEO pages) + on-page tracking (route-gated Sentry, GA4/Pixel, UTM
attribution). Bilingual landing per the 2026-05-18 audit.

**Key files.**
- `src/pages/MarketingLandingPage.tsx` — the bilingual landing.
- `src/pages/blog/`, `src/data/blog-posts/` — blog content.
- `src/pages/seo/` — SEO landing pages (`/seo/hoc-tieng-anh-cho-nguoi-viet`,
  `/seo/sua-phat-am-tieng-anh`, etc.).
- `src/components/seo/`, `src/lib/seo/` — meta tags, schema.org,
  sitemap helpers.
- `src/lib/tracking/`, `src/lib/analytics/` — tracking surfaces.
  `setMarketingConsent` gates Pixel/GA4/UTM (localStorage, per-device).
  Email opt-out is a separate concern at `/account/notifications`.
- `public/version.json`, `public/audio/manifest.json` — auto-generated
  by the prebuild hook (gitignored).

**Owner-lane.** Platform / A-side (Vietnamese marketing copy is the
primary surface).
**Strategic priority.** `layer-model.md` Step 5 (Marketing Infrastructure ~70%).

**Don't break.** Tracking consent ≠ email consent (memory:
[[project_marketing_consent_is_tracking]]). Never conflate. The
bilingual landing supersedes the older "onboarding-as-landing"
framing.

---

## 16. Observability (Sentry + monitoring + perf)

**What it does.** Production error tracking (Sentry), performance
budgets, native crash telemetry, custom event logging.

**Key files.**
- `src/lib/monitoring/`, `src/lib/observability/`,
  `src/components/monitoring/` — wiring.
- `src/lib/perf/`, `src/lib/performance/`,
  `src/components/performance/`, `src/components/perf/` — perf budgets.
- `src/simulator/perf/` — perf simulator.
- `supabase/functions/_shared/sentry.ts` — server-side Sentry.
- `src/pages/SentrySmokeTest.tsx` — manual smoke surface.
- Sentry config: org `chau-doan`, project `mercyblade-web`, region
  `us.sentry.io` (memory: [[project_sentry_infra_access]]).

**Owner-lane.** Platform.
**Strategic priority.** §15 Axis 1 Bar #6 (on-device native crash
telemetry — wiring shipped via PR #1132, owner-gated on Chau's
on-device probe).

**Don't break.** Sentry SDK is **route-gated** — static legal /
marketing pages must not fetch the SDK (PRs #720, #740). Pre-#657 CI
greens cannot be trusted (legacy GitHub Actions state, pre-migration).
Post-2026-05-27 migration: production deploys go through Netlify's
GitLab integration; the `production-deploy.yml` workflow that was the
sole pre-migration prod-ship path is legacy. The `NETLIFY_CONTEXT`
env var drives Sentry's deploy-environment tag (memory:
[[project_vercel_prod_deploy]] is stale on "primary" — see
`docs/runbooks/disaster-recovery.md`).

**See also.** `docs/OBSERVABILITY.md`, `docs/slo-handbook.md`.

---

## 17. Email & lifecycle

**What it does.** Transactional + campaign email via Resend. ~9 edge
functions for broadcast, campaign, automations, reply, redeem, daily
admin digest, mercy-builder, test.

**Key files.**
- `src/emails/*.txt` — transactional plaintext templates (NOT
  marketing).
- `supabase/functions/email-broadcast/`, `send-email-campaign/`,
  `email-automations/`, `email-reengagement/`, `email-unsubscribe/`,
  `admin-daily-digest/`, `send-pending-emails/`,
  `mercy-ai-builder-email/`, `test-email/`.
- `email_campaigns`, `email_events` tables (admin-gated, `get_admin_level >= 9`).

**Owner-lane.** Platform.
**Strategic priority.** `layer-model.md` Step 4 (Retention Engine ~85%).

**Don't break.** Unsubscribe system is still being built — no
`email_unsubscribes` table, no footer in campaign templates. **Do
not send marketing emails** until this lands. `send-email-campaign`
vs `email-broadcast` disagree on `audience_type` values (both mix the
legacy `vip` naming with the newer `level` system); treat as broken
until reconciled. Prefer `email-broadcast` (newer, has a `preview`
action). Sender: `admin@mercyblade.com` (NOT `hello@`).

---

## 18. Music / audio playback

**What it does.** Global background music + in-room audio playback.

**Key files.**
- `src/components/MusicPlayer/` — UI.
- `src/lib/musicAudioUrl.ts` — music URL resolution.
- `MusicPlayerContext` — global play/pause state.
- `src/lib/roomAudioResolver.ts` — shared resolver (see §2).

**Owner-lane.** Platform.
**Strategic priority.** —

**Don't break.** `music/*` keys resolve through Supabase (same
post-d2951ddd doctrine as kids/*). Re-localization re-bloats the bundle.

---

## 19. Admin surface

**What it does.** Admin-gated tooling (hide/publish rooms, set tier,
list users, billing portal, daily digest, security health).

**Key files.**
- `src/lib/admin/`, `src/lib/adminAppContext.ts`, `src/lib/adminBilling.ts`
  — client.
- `src/components/admin/`, `src/pages/admin/`, `src/pages/AdminLogin.tsx`
  — UI.
- `src/hooks/admin/` — admin-side hooks.
- `supabase/functions/admin-*` — 11+ edge functions, all gated on
  `get_admin_level >= N`.

**Owner-lane.** Platform.
**Strategic priority.** —

**Don't break.** Admin level is enforced server-side. There is **no
admin UI** for drafting email campaigns — campaigns are INSERTed via
SQL Editor then invoked.

---

## 20. Native shells (Capacitor — iOS + Android)

**What it does.** Capacitor 8 native shells around the SPA. iOS and
Android publish to their respective stores.

**Key files.**
- `ios/App/App.xcworkspace`, `ios/App/App/Info.plist` (don't touch
  unless a new permission is needed — memory:
  [[feedback_ios_info_plist_stability]]).
- `android/` — Android shell. Application ID:
  `com.mercyapps.mercyblade` (locked at first Play publish;
  permanently divergent from iOS `com.chaudoan.mercyblade` — do NOT
  "align"; memory: [[project_android_urls]]).
- `capacitor.config.ts` — Capacitor config.
- `npx cap sync ios` / `npx cap sync android` — copy `dist/` into
  the shell, reinstall pods. Needs a throwaway `dist/index.html`
  placeholder; `ios/` is mostly gitignored but `Podfile` /
  `Podfile.lock` are tracked (memory: [[feedback_cap_sync_ios_mechanics]]).
- `src/components/native/` — native-bridge React glue (NOT
  `src/lib/native/`).
- iOS subscriptions: routed through Apple IAP via RevenueCat (App
  Store rule 3.1.1).
- Last builds: Apple Build 8 (April 25), Google Play Build 4
  (April 25) — both pre-this-session per `STRATEGY.md` §6.

**Owner-lane.** Platform.
**Strategic priority.** `layer-model.md` Step 1 (iOS + Android in Stores ~60%).

**Don't break.** "Web-only today; do only zero-decision `src/`-pure
native PRs now, defer store-coupled native-file work to ~2-4wk
pre-submission" — memory: [[feedback_native_work_phasing]]. Hard
stop if a `src/` fix needs `ios/` or `android/` edits.

---

## 21. Dev server & build

**What it does.** Vite dev server + a separate grammar server proxied
under `/api/*`. PWA service worker registers in production only.

**Key files.**
- `vite.config.ts`, `vite.config.*.ts` — Vite + Workbox config.
- `scripts/grammar-server/` — grammar server.
- `npm run dev` — both, concurrently. Vite on `127.0.0.1:3107`
  (`--strictPort`), grammar on `127.0.0.1:3001`.
- `/functions/v1/*` proxied to Supabase.
- Service worker registered by `registerPwaServiceWorker` IIFE in
  `main.tsx`. Disabled in dev.
- `package.json` `prebuild` hook runs `rooms:check` (registry +
  validation).

**Owner-lane.** Platform.

**Don't break.** Port 3107 is `--strictPort` — kill the stale PID,
don't fall back. Workbox `room-audio` cache pattern matches
`(sign|public)` — don't narrow it back to `/sign/` only.

---

## 22. Hosting + CI/CD

**What it does.** Production hosting + the PR/CI gates. Post-2026-05-27
migration (see `docs/runbooks/disaster-recovery.md`), **Netlify** is
primary; **Vercel** is the documented recovery host (`vercel.json`
retained for the §2.2 emergency redeploy). **GitLab** is the canonical
repository; the `.github/workflows/*.yml` files are **legacy** (the
GitHub Actions runner doesn't fire on GitLab). `.gitlab-ci.yml`
carries the only currently-scheduled CI job (nightly Postgres backup);
PR-time gates are not yet ported from the legacy workflows — that's
its own dispatch.

**Key files.**
- `.github/workflows/DEPLOYMENT.md` — canonical deploy runbook
  (Netlify primary, Vercel recovery, legacy GitHub Actions noted).
- `.github/workflows/ROLLBACK.md` — canonical rollback runbook
  (Netlify Publish-deploy primary, Vercel recovery, git revert
  last-resort).
- `docs/runbooks/disaster-recovery.md` — authoritative
  incident-recovery runbook (provider outages, account lockouts,
  full-migration playbook). The source-of-truth for "what's
  primary, what's recovery."
- `.gitlab-ci.yml` — current GitLab CI config. Today scopes only the
  nightly Postgres backup; PR-time gates not yet ported.
- `vercel.json` — retained for the documented recovery deploy path.
  The GitHub-App auto-deploy block is stale shape from the
  pre-migration state; memory:
  [[project_vercel_prod_deploy]] (now stale on "primary" — Vercel is
  recovery-only).
- `.github/workflows/*.yml` (legacy): `ci.yml`, `production-deploy.yml`,
  `sync-lessons.yml`, `deploy-edge-functions.yml`. These are reference
  for the prior pipeline shape; they do not run on GitLab. Memories
  [[project_ci_workflow_consolidation]], [[project_lessons_autosync_prod]],
  [[project_edge_fn_ci_deploy]] still describe the *intent* but the
  *trigger* is no longer GitHub Actions.

**Owner-lane.** Platform.
**Strategic priority.** —

**Don't break.** Don't trust pre-#657 green CI runs (legacy Actions
state). Repository remote is GitLab (`origin = git@gitlab.com:cd12536/mercyB.git`);
the old GitHub remote is `old-origin`. Use `glab` for MRs, not
`gh pr`. The Stripe webhook is a **Supabase edge function** at
`supabase/functions/stripe-webhook/`, posted to directly by Stripe
at `https://buemdfxyhxunzpgdoqin.supabase.co/functions/v1/stripe-webhook`
— not routed through Netlify, Vercel, or Cloudflare. See
[`systems/billing-entitlement.md` §5d](./systems/billing-entitlement.md)
for the verified treatment.

---

## 23. Tests

**What it does.** Two test runners (vitest unit/integration + Playwright
e2e). Rule-pack golden tests in `evals/`.

**Key files.**
- `vitest.config.ts`, `tsconfig.scripts.json` — vitest config.
- `src/**/__tests__/` — colocated unit tests.
- `tests/e2e/` — Playwright specs (e.g. `placement-to-first-lesson.spec.ts`).
- `evals/` — detector golden eval. `evals/.baseline.json` is the
  §15 Axis 1 Bar #2 gate.
- `npm test` (vitest run), `npx playwright test` (e2e).

**Owner-lane.** Platform.
**Strategic priority.** Detector eval baseline ≥ 95% (§15 Axis 1
Bar #2, closed).

**Don't break.** `npm run typecheck` excludes `vite.config.ts` etc.;
**always run `npm run typecheck:ci` before push** (it is what CI runs).

---

## 24. Misc cross-cutting

**Notebook (saved learner content).** `src/components/notebook/`,
`src/lib/userContent/`.

**Streaks / XP / Leaderboards.** `src/lib/streaks/`, `src/lib/xp/`,
`src/lib/leaderboard/`, `src/components/streak/`, `src/components/xp/`,
`src/components/leaderboard/`. `layer-model.md` Step 4. Per
`STRATEGY.md` (V3 — Competitive thesis), streaks must not be the **primary** retention
mechanic; per §10 they are not a tracked KPI.

**Family / Groups / Community / Referral / Gift / Corporate.**
Each has matching `src/lib/<name>/`, `src/components/<name>/`, and
`src/pages/<name>/` directories. Most have at least one edge function
(e.g. `supabase/functions/generate-gift-code/`,
`supabase/functions/admin-billing-portal-session/`).

**Roleplay / Mock interviews / Stories / Speech / Listening / Writing /
Vocabulary / Pronunciation challenges.** Each is a content surface
with a matching `src/data/<name>/`, `src/pages/<name>/`,
`src/lib/<name>/` triple.

**Feedback.** `src/lib/feedback/` (L1 detector, see §4) is the
language-feedback engine. `src/components/feedback/`,
`src/components/FeedbackBar.tsx` are the in-product *"Báo lỗi"* report
button (PRINCIPLES.md §8 — feedback loop is part of shipping).

**Security.** `src/lib/security/` is the live security surface (input
validation, redaction). `src/security/` is a dead duplicate (memory:
[[project_security_dir_duplicate]] — `typeGuards.ts` is the only live
file; the rest was dismantled in #558 + #571).

**Server-side host (legacy).** `src/server/host/*` was a dead OpenAI
orchestration scaffold (not SSR) and was deleted in PR #698
(memory: [[project_server_host_dead_not_ssr]]). Do not reintroduce.

---

## Reading the dependency graph from this doc

A useful frame:

1. **Anonymous boot** (§13 anon bootstrap) → **Onboarding gate** (§1,
   §14) → **Home or marketing landing**.
2. **Room pipeline** (§2) is the main learner surface for the A-side.
3. **AI Tutor** (§9) layers on top, injects **L1 profile** (§4) into
   prompts.
4. **Pronunciation** (§5) is its own surface (`/speak`, drill pages).
5. **Placement** (§8) is the bootstrap that flags interference
   patterns; its results are read by lesson routing (§2) + Stage 3A
   adapters (§6).
6. **Stage 3A adapters** (§6) mirror **L1 detector tags** (§4),
   **placement snapshots** (§8), and **pronunciation phoneme attempts**
   (§5) into `localStorage` ring buffers. Stage 3A's screen reads
   them (not yet implemented on `main`).
7. **Billing & entitlement** (§12) is consulted by every gate — never
   `profiles.tier`, never `price_id`, always the derived entitlement.
8. **Kids** (§10) deliberately bypasses §9, §12 monetization CTAs, §4
   adult-tutor surfaces. Sacred.

When you start work, identify which of these systems your change
touches **before** opening files. If a "small" change spans §4 + §6 +
§8, treat it as a strategy edit, not a refactor.

---

## What this overview does NOT cover

- **Per-room or per-lesson content authoring conventions.** See
  `ROOM_GUIDE.md` and the room-specific docs under `docs/`.
- **Operational runbooks.** See `docs/runbooks/`,
  `.github/workflows/DEPLOYMENT.md`, `.github/workflows/ROLLBACK.md`.
- **Per-table schema details.** See `supabase/migrations/` (file
  names are timestamped). Memory:
  [[project_db_schema_drift_audit]] for the current drift inventory.
- **Per-PR history of any system.** Use `git log -p -- <path>` and
  `git log --grep`. PR numbers in this doc are anchors, not a
  changelog.

If you need any of those, navigate from this doc to the right
sub-doc — don't try to expand this one.
