# Dead-Code Risk Map

> **Read-only inventory. This is NOT a deletion list.** Every tier below is a
> *candidate* set with an attached false-positive risk. Deletion decisions are
> out of scope for this document — they require the per-item verification noted
> in each tier. Produced by Agent B3 from a dependency-cruiser reachability +
> graph analysis of `src/` at the commit this doc was added.

## Why this exists

PR #298 (GitHub-legacy, inaccessible after the GitLab migration) claimed ~40K
LOC of dead code across 15 categories. No concrete, verifiable inventory
survived. Before anyone instruments or deletes anything, this map rebuilds the
inventory from the actual dependency graph and grades each candidate by
confidence, with the false-positive classes called out explicitly.

## Method (and its blind spots)

Three signals were combined over `src/` (1635 modules, 4543 edges):

1. **Reachability** from the app entry `src/main.tsx` (dependency-cruiser,
   `tsPreCompilationDeps: true` — follows static *and* resolvable `import()`).
2. **Dependent count** from the full graph: how many *non-test* modules import
   each file. Zero non-test dependents is a stronger signal than
   "unreachable from main" alone.
3. **Repo-wide basename cross-check**: does the file's basename appear anywhere
   in `src/`, `api/`, `supabase/functions/`, `scripts/`, configs, or
   `index.html` beyond its own definition? A hit means a possible string/
   dynamic reference (or a name collision) → demote confidence.

**Blind spots that create false positives — do not ignore these:**

- **Template-literal / registry dynamic imports.** dependency-cruiser cannot
  resolve ``import(`./kids/kidPage${n}Data`)``. The only such loader in `src/`
  is `src/components/mercy-guide/kidsDataLoader.ts`; its 30 `kidPage*Data.ts`
  targets are **dynamically loaded, NOT dead** (Tier 2). Any new template-literal
  loader re-introduces this class.
- **Alternate entry points.** Reachability is computed from `main.tsx` only.
  Code reached solely from tests, `api/*`, edge functions, or build scripts
  looks "unreachable" but is live in its own context (see Tier 2 test-only and
  Tier 3 islands — e.g. the `src/billing/*` cluster is fully unit-tested but
  not wired to `main.tsx`).
- **Basename cross-check is coarse** (substring match). It over-flags common
  words (e.g. `Breadcrumb`) and under-flags template-constructed names. Treat
  Tier 2 'basename-elsewhere' as *needs-a-human-look*, not proof of life.

## Headline numbers

| Tier | Confidence it is dead | Count | Gate before deletion |
|------|----------------------|-------|----------------------|
| **Tier 1** | High | 194 | Confirm no runtime/string ref; visual diff |
| **Tier 2** | Medium | 253 | Resolve the specific FP class (below) |
| **Tier 3** | Low | 357 | Whole-island analysis; likely alt-entry |
| **Total candidates** | — | 804 | — |

## Tier 1 — high confidence (zero importers, name nowhere else, not dynamic)

194 files. No module in the graph imports them (not even tests), their
basename appears nowhere else in the repo, and they are not dynamic-load targets.
Spot-checked by direct grep: 0 static importers. **Still verify** each against
runtime string refs before deleting — high confidence is not certainty.

By area:

| Area | Files |
|------|-------|
| `src/components/admin` | 22 |
| `src/components/ui` | 13 |
| `src/components/mercy-guide` | 8 |
| `src/lib/performance` | 6 |
| `src/lib/teacher-mercy` | 6 |
| `src/components/analytics` | 5 |
| `src/components/home` | 5 |
| `src/lib/security` | 5 |
| `src/components/mercy` | 4 |
| `src/components/room` | 4 |
| `src/components/auth` | 3 |
| `src/components/exam-prep` | 2 |
| `src/components/placement` | 2 |
| `src/components/security` | 2 |
| `src/components/AdminFloatingButton.tsx` | 1 |

<details><summary>Full Tier 1 list (194)</summary>

- `src/components/AdminFloatingButton.tsx`
- `src/components/AnimatedTierBadge.tsx`
- `src/components/AudioBar.tsx`
- `src/components/CreditLimitModal.tsx`
- `src/components/CreditsDisplay.tsx`
- `src/components/DemoFeatureBlocker.tsx`
- `src/components/DemoModeBanner.tsx`
- `src/components/DesignAuditReport.tsx`
- `src/components/EnglishRoadmapPanel.tsx`
- `src/components/EnhancedRoomCard.tsx`
- `src/components/FeedbackNotificationBadge.tsx`
- `src/components/GlobalAppBar.tsx`
- `src/components/GlobalHomeButton.tsx`
- `src/components/GlobalNavigationBox.tsx`
- `src/components/HeroBand.tsx`
- `src/components/LowDataModeToggle.tsx`
- `src/components/MatchmakingButton.tsx`
- `src/components/MercyGuideProfileSettings.tsx`
- `src/components/MercyGuideSettings.tsx`
- `src/components/MessageActions.tsx`
- `src/components/MoodCheck.tsx`
- `src/components/NetworkStatusIndicator.tsx`
- `src/components/OfflineDetector.tsx`
- `src/components/PageTransition.tsx`
- `src/components/ProfileAvatarUpload.tsx`
- `src/components/ProfilePrivacySettings.tsx`
- `src/components/PromoCodeBanner.tsx`
- `src/components/ResponsiveRoomGrid.tsx`
- `src/components/RoomDisclaimer.tsx`
- `src/components/RoomErrorState.tsx`
- `src/components/RoomHeaderStandard.tsx`
- `src/components/RoomLoadShell.tsx`
- `src/components/SecurityAlertSettings.tsx`
- `src/components/SmoothScrollContainer.tsx`
- `src/components/ThemeSwitchTransition.tsx`
- `src/components/TierRoomColumns.tsx`
- `src/components/TruncatedTitle.tsx`
- `src/components/UnauthenticatedBanner.tsx`
- `src/components/UpdateBanner.tsx`
- `src/components/VersionBadge.tsx`
- `src/components/VirtualizedRoomGrid.tsx`
- `src/components/admin/AdminAuditLog.tsx`
- `src/components/admin/AdminBreadcrumbs.tsx`
- `src/components/admin/AdminEntryTools.tsx`
- `src/components/admin/AdminRoomDebugDots.tsx`
- `src/components/admin/AdminThemeToggle.tsx`
- `src/components/admin/AiControlPanel.tsx`
- `src/components/admin/DeepScanPanel.tsx`
- `src/components/admin/EnvironmentBanner.tsx`
- `src/components/admin/FeedbackMessages.tsx`
- `src/components/admin/KeywordAudioCopyDot.tsx`
- `src/components/admin/RoomIssuesTable.tsx`
- `src/components/admin/RoomLinkHealth.tsx`
- `src/components/admin/RoomLockPinDialog.tsx`
- `src/components/admin/RoomSpecificationManager.tsx`
- `src/components/admin/TestPurchasePanel.tsx`
- `src/components/admin/TtsAudioGenerator.tsx`
- `src/components/admin/UiHealthPanel.tsx`
- `src/components/admin/WarmthAudioGenerator.tsx`
- `src/components/admin/users/AdminUsersHeader.tsx`
- `src/components/admin/users/AdminUsersKpiGrid.tsx`
- `src/components/admin/users/AdminUsersTable.tsx`
- `src/components/admin/widgets/AdminStatsStrip.tsx`
- `src/components/ai-tutor/TutorMemoryCard.tsx`
- `src/components/analytics/CategoryDistributionChart.tsx`
- `src/components/analytics/FeedbackStatsCards.tsx`
- `src/components/analytics/FeedbackTrendsChart.tsx`
- `src/components/analytics/PriorityDistributionChart.tsx`
- `src/components/analytics/ResponseTimesChart.tsx`
- `src/components/audio/TalkingFaceButton.tsx`
- `src/components/auth/PasswordStrengthMeter.tsx`
- `src/components/auth/RequireMercyAuth.tsx`
- `src/components/auth/SignOutButton.tsx`
- `src/components/billing/BillingStatusCard.tsx`
- `src/components/community/RoomCommunityChat.tsx`
- `src/components/design-system/AdminButton.tsx`
- `src/components/dev/DevObservabilityPanel.tsx`
- `src/components/entitlements/RequireFeature.tsx`
- `src/components/exam-prep/ielts/IELTSListeningPractice.tsx`
- `src/components/exam-prep/toeic/TOEICResultPage.tsx`
- `src/components/home/HomeHero.tsx`
- `src/components/home/ListeningSuggestionCard.tsx`
- `src/components/home/TodaysLessonCard.tsx`
- `src/components/home/VocabularyReviewBadge.tsx`
- `src/components/home/WritingPromptCard.tsx`
- `src/components/iap/RestorePurchasesButton.tsx`
- `src/components/kids/KidsRoomCard.tsx`
- `src/components/layout/PrimaryHero.tsx`
- `src/components/mercy-guide/MercyEnglishTab.tsx`
- `src/components/mercy-guide/MercyGuideReplyLibraryDebug.tsx`
- `src/components/mercy-guide/MercySuggestTab.tsx`
- `src/components/mercy-guide/classifyGuideInput.ts`
- `src/components/mercy-guide/logic/routeMercyMessage.ts`
- `src/components/mercy-guide/mercyGuideClient.ts`
- `src/components/mercy-guide/resolveMercyGuideReply.ts`
- `src/components/mercy-guide/tabs/AITutorTab.tsx`
- `src/components/mercy/AdaptivePracticePanel.tsx`
- `src/components/mercy/ConversationCostCapPrompt.tsx`
- `src/components/mercy/DecisionPanel.tsx`
- `src/components/mercy/MercyUnityBand.tsx`
- `src/components/motion/MotionSafe.tsx`
- `src/components/payment/TestModeBanner.tsx`
- `src/components/placement/QuestionCard.tsx`
- `src/components/placement/SkipModal.tsx`
- `src/components/room/CommunityChatBox.tsx`
- `src/components/room/RoomHeaderTools.tsx`
- `src/components/room/UniversalRoomChrome.tsx`
- `src/components/room/roomRenderer/keywordsBilingual.ts`
- `src/components/security/AdminWatermark.tsx`
- `src/components/security/SessionExpiryWarning.tsx`
- `src/components/speech/SpeechRecorder.tsx`
- `src/components/tiers/TierSection.tsx`
- `src/components/ui/MBButton.tsx`
- `src/components/ui/StandardConfirmDialog.tsx`
- `src/components/ui/context-menu.tsx`
- `src/components/ui/dropdown-menu.tsx`
- `src/components/ui/hover-card.tsx`
- `src/components/ui/input-otp.tsx`
- `src/components/ui/loading-skeleton.tsx`
- `src/components/ui/menubar.tsx`
- `src/components/ui/navigation-menu.tsx`
- `src/components/ui/resizable.tsx`
- `src/components/ui/retry-button.tsx`
- `src/components/ui/shimmer-skeleton.tsx`
- `src/components/ui/toggle-group.tsx`
- `src/config/deployGate.ts`
- `src/core/engine/trainingFlow.ts`
- `src/hooks/admin/useAdminStats.ts`
- `src/hooks/useAIReasoning.ts`
- `src/hooks/useAdminLevel.ts`
- `src/hooks/useCompanionLines.ts`
- `src/hooks/useDemoMode.ts`
- `src/hooks/useFavoriteRooms.tsx`
- `src/hooks/useFavoriteTracks.tsx`
- `src/hooks/useHomepageConfig.ts`
- `src/hooks/useKidsRooms.ts`
- `src/hooks/useMatchmaking.ts`
- `src/hooks/useMercyReplies.ts`
- `src/hooks/useMercyRoomIntro.ts`
- `src/hooks/useOnlineStatus.ts`
- `src/hooks/useOptimizedAudio.ts`
- `src/hooks/useOptimizedQuery.ts`
- `src/hooks/useParallax.ts`
- `src/hooks/usePaths.ts`
- `src/hooks/usePerformanceMode.ts`
- `src/hooks/usePerformanceMonitor.ts`
- `src/hooks/usePrefetchRooms.ts`
- `src/hooks/usePronunciationRecorder.ts`
- `src/hooks/useRecentRooms.tsx`
- `src/hooks/useReflectionObserver.ts`
- `src/hooks/useRoles.ts`
- `src/hooks/useRoomAnalytics.ts`
- `src/hooks/useRoomAudioPreload.ts`
- `src/hooks/useRoomCompanion.ts`
- `src/hooks/useRoomHealth.ts`
- `src/lib/ai-meter.ts`
- `src/lib/apiFailureAlert.ts`
- `src/lib/cache/globalCache.ts`
- `src/lib/console-replacer.ts`
- `src/lib/emailRender.ts`
- `src/lib/getMeEntitlement.ts`
- `src/lib/guardedCall.ts`
- `src/lib/inputValidation.ts`
- `src/lib/performance/audio-cache.ts`
- `src/lib/performance/memoization-helpers.tsx`
- `src/lib/performance/react-profiler.tsx`
- `src/lib/performance/retry-with-backoff.ts`
- `src/lib/performance/supabase-logger.ts`
- `src/lib/performance/supabase-query-cache.ts`
- `src/lib/rateLimiter.ts`
- `src/lib/runtimeAssert.ts`
- `src/lib/scripts/validateRoomData.ts`
- `src/lib/security/content-filter.ts`
- `src/lib/security/inputSanitizer.ts`
- `src/lib/security/inputValidator.ts`
- `src/lib/security/session-hardening.ts`
- `src/lib/security/storageEncryption.ts`
- `src/lib/session-manager.ts`
- `src/lib/teacher-mercy/applyAdaptiveAdjustments.ts`
- `src/lib/teacher-mercy/conceptMasteryStore.ts`
- `src/lib/teacher-mercy/pedagogicalResponseEvaluator.ts`
- `src/lib/teacher-mercy/personalityLines.ts`
- `src/lib/teacher-mercy/sessionTeachingArc.ts`
- `src/lib/teacher-mercy/workedExampleGenerator.ts`
- `src/lib/theme/themeLoader.ts`
- `src/lib/tierRoutes.ts`
- `src/middleware/cspHeaders.ts`
- `src/middleware/rateLimiter.ts`
- `src/pages/AdminLogin.tsx`
- `src/setupTests.ts`
- `src/simulator/AudioStressTester.ts`
- `src/simulator/device/runDeviceSimulations.ts`
- `src/simulator/perf/WebVitalsCollector.ts`
- `src/simulator/runFullSimulation.ts`

</details>

## Tier 2 — medium confidence (resolve the specific false-positive first)

### 2a. Dynamically loaded — CONFIRMED NOT DEAD (30)

`kidPage*Data.ts` loaded by `kidsDataLoader.ts` via a template-literal
`import()`. depcruise-blind; these are **live**. Listed so a future sweep does
not re-flag them. Excluded from the CI orphan tripwire by glob.

- `src/components/mercy-guide/kids/kidPage11Data.ts`
- `src/components/mercy-guide/kids/kidPage12Data.ts`
- `src/components/mercy-guide/kids/kidPage13Data.ts`
- `src/components/mercy-guide/kids/kidPage14Data.ts`
- `src/components/mercy-guide/kids/kidPage15Data.ts`
- `src/components/mercy-guide/kids/kidPage16Data.ts`
- …and 24 more `kidPage*Data.ts`

### 2b. Basename appears elsewhere — possible string/dynamic ref or collision (171)

Zero graph importers, but the basename occurs elsewhere in the repo. Could be a
string-keyed reference, a duplicate-named live file, or an `api/`/edge consumer.
Needs a per-file look. Examples (with where the name also appears):

- `src/components/AudioPlayer.tsx` — name also in 4 file(s): src/components/LoadingSkeleton.tsx,src/components/homepage/HomepageSection.tsx,src/components/tiers/TierSection.tsx
- `src/components/Breadcrumb.tsx` — name also in 34 file(s): index.html,src/components/GlobalAppBar.tsx,src/components/RoomHeader.tsx
- `src/components/ChatMessage.tsx` — name also in 12 file(s): src/components/LoadingSkeleton.tsx,src/components/MercyChat.tsx,src/components/feedback/MercyAnswerFeedback.tsx
- `src/components/CornerTalker.tsx` — name also in 1 file(s): scripts/validate-assets.ts
- `src/components/GlobalPlayingIndicator.tsx` — name also in 2 file(s): src/components/MusicPlayer/GlobalPlayingIndicator.tsx,supabase/functions/scan-design-violations/index.ts
- `src/components/LanguageSwitcher.tsx` — name also in 2 file(s): src/pages/Home.tsx,src/store/languageProgress.tsx
- `src/components/LayoutShell.tsx` — name also in 1 file(s): src/router/AppRouter.tsx
- `src/components/LoadingSkeleton.tsx` — name also in 1 file(s): src/components/ui/loading-skeleton.tsx

### 2c. Test-only — dead in prod, but deleting needs test cleanup (52)

Imported *only* by test files. They ship no prod bytes via `main.tsx`, but a
deletion must also remove/adjust the tests. Note `src/billing/*` here: a fully
unit-tested entitlement engine **not yet wired to the app entry** — almost
certainly pending-integration, not dead. Examples:

- `src/lib/roomRegistry.ts` ← ['src/__tests__/roomRegistryCoverage.test.ts']
- `src/lib/rooms/roomRegistryDiagnostics.ts` ← ['src/__tests__/roomRegistryCoverage.test.ts']
- `src/lib/search/searchDiagnostics.ts` ← ['src/__tests__/roomRegistryCoverage.test.ts']
- `src/billing/computeEntitlement.ts` ← ['src/billing/__tests__/computeEntitlementWithGifts.test.ts']
- `src/billing/recomputeAndPersistEntitlement.ts` ← ['src/billing/recomputeAndPersistEntitlement.test.ts']
- `src/billing/stripe/mapStripeSubscription.ts` ← ['src/billing/stripe/mapStripeSubscription.test.ts']
- `src/components/ai-tutor/speakPronunciationResultAdapter.ts` ← ['src/components/ai-tutor/__tests__/speakPronunciationResultAdapter.test.ts']
- `src/languages/chinese/lessons-c1.ts` ← ['src/components/languages/__tests__/singleLanguageRender.smoke.test.tsx']

## Tier 3 — low confidence (dead islands)

357 files that are unreachable from `main.tsx` **but are imported by
other (also-unreachable) files** — self-referential clusters. A cluster is dead
only if the *whole island* is dead; more often the island has an alternate entry
(test, `api/`, edge function) that reachability-from-main can't see. **Highest
FP risk of the three tiers.** Treat as research, not cleanup.

By area:

| Area | Files |
|------|-------|
| `src/lib/teacher-mercy` | 44 |
| `src/lib/placement` | 42 |
| `src/data/placement` | 12 |
| `src/components/mercy` | 11 |
| `src/components/mercy-guide` | 10 |
| `src/components/ui` | 10 |
| `src/lib/ai-tutor` | 7 |
| `src/lib/roomMaster` | 7 |
| `src/components/companion` | 6 |
| `src/lib/pronunciation` | 6 |
| `src/lib/performance` | 5 |
| `src/lib/stage-4` | 5 |
| `src/simulator/device` | 5 |
| `src/simulator/scenarios` | 5 |
| `src/components/room` | 4 |

Worked example — the `src/billing/` island:

```
computeEntitlement.ts        ← (no non-test importer from main)
recomputeAndPersistEntitlement.ts
subscriptionRepository.ts    ← imported by computeEntitlement, recompute…
types.ts                     ← imported by computeEntitlement, subscriptionRepository
```

All of `src/billing/*` is reachable from `src/billing/__tests__/*` and is
plausibly consumed by the Stripe webhook flow. **Do not treat as dead** without
confirming the live entitlement path.

## The CI guard (added with this doc)

A **non-blocking** orphan tripwire prevents *reaccumulation*:

- `.dependency-cruiser.orphans.cjs` — `severity: 'warn'` only; excludes tests,
  configs, and the `kidPage*Data` dynamic glob.
- `npm run depcruise:orphans` — reports files with no in/out edges.
- Wired into the existing **`module-boundaries`** job (triggers on `src/**`,
  `.dependency-cruiser.*`, `package.json`) as `npm run depcruise:orphans || true`.
  It **never fails the pipeline** — it prints `warn no-new-orphans: <file>` so a
  reviewer catches a newly-orphaned file on the PR that introduced it.

Scope note: the CI tripwire only catches the *truly isolated* (no-in-no-out)
case — the cheap, unambiguous signal. The full reachability/dependent analysis
in this doc is a heavier one-time sweep, not run per-PR.

## Recommended next steps (not done here)

1. Human-verify Tier 1 in area-sized batches; delete only confirmed-dead, with
   clinical/billing/auth areas split into their own PRs.
2. For Tier 2b, resolve each basename hit (real ref vs collision).
3. Leave Tier 3 until an island's alternate entry is confirmed dead.
4. For Supabase RPCs/edge functions (static-analysis-blind), use server-side
   invocation logs, not repo-side reachability — out of scope for this `src/` map.
