# PR #846 Review — Android versionCode/Name Bump (A8k)

**Agent:** A8k (doc-only release-version review)
**Branch:** `review/846-android-version`
**Subject:** PR #846 `chore/android-version-bump-16` — `chore(native): bump Android versionCode 12→16 / versionName 1.0.2→1.0.6 (match iOS, per #841)`
**Labels:** native, android, version-bump, pre-submission
**Diff size:** +6 / −6, 3 files changed

---

## Verdict — APPROVE

**All 5 dispatch invariants pass.** CI was green at review time (6 SUCCESS checks, 1 non-blocking queued post-deploy job). The bump is minimal, correctly scoped, doesn't touch `applicationId` (permanently locked per memory `project_android_urls`), doesn't touch any `ios/` files, and as a bonus re-syncs two doc files that had drifted ahead of `build.gradle`.

---

## 1. Check — Exactly 2 lines changed in `android/app/build.gradle` ✅ CORRECT

`git diff` output verbatim:

```diff
@@ -17,8 +17,8 @@ android {
         applicationId "com.mercyapps.mercyblade"
         minSdkVersion rootProject.ext.minSdkVersion
         targetSdkVersion rootProject.ext.targetSdkVersion
-        versionCode 12
-        versionName "1.0.2"
+        versionCode 16
+        versionName "1.0.6"
         testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
```

Exactly two lines changed — `versionCode` and `versionName`. Surgical.

**What is NOT touched (verified critical):**
- `applicationId "com.mercyapps.mercyblade"` — **preserved verbatim**. Per memory `project_android_urls`, this string is locked at first Play publish and is **permanently divergent** from iOS `com.chaudoan.mercyblade`. The bump correctly leaves it alone.
- `minSdkVersion`, `targetSdkVersion`, `testInstrumentationRunner`, `aaptOptions` — all unchanged.

**Version-monotonicity sanity:** the bump is forward (`12 → 16`, `1.0.2 → 1.0.6`). Google Play rejects a non-increasing `versionCode` on every upload; this is the cheapest possible self-check and it passes. Per PR title the iOS side (#841) already shipped `1.0.6 / build 16` — Android catches up to the same numbers, the standard pre-submission alignment pattern.

---

## 2. Check — Two stale docs updated correctly ✅ CORRECT

### 2.1 `docs/app-store-submission/android-submission-checklist.md`

```diff
-| Version name | `1.0.1` | ✅ | bump per release |
-| Version code | `3` | ✅ | bump per release |
+| Version name | `1.0.6` | ✅ | bump per release |
+| Version code | `16` | ✅ | bump per release |
```

**Observation worth surfacing:** the prior doc value (`1.0.1` / `3`) was MORE stale than `build.gradle` itself (`1.0.2` / `12`). The doc had drifted away from code at least one release cycle ago and was never re-synced. This PR repairs that staleness in one step — the doc now matches `build.gradle` exactly. Net positive: not just a bump, also a doc-code lockstep restoration.

The surrounding rows are correctly **not** touched:
- `Application ID | com.mercyapps.mercyblade | ✅ | Locked at first publish.` — preserved.
- `Bundle ID alignment with iOS … divergent | 🟡 | decide before first publish.` — preserved (memory `project_android_urls`: do NOT align, divergence is intentional and locked).

### 2.2 `reports/app-store-submission-package-2026-04-26.md`

```diff
-| iOS marketing version | `1.0` (build 10) | `project.pbxproj` |
-| Android version | `1.0.1` (versionCode 3) | `build.gradle` |
+| iOS marketing version | `1.0.6` (build 16) | `project.pbxproj` |
+| Android version | `1.0.6` (versionCode 16) | `build.gradle` |
```

Both rows updated to the same `1.0.6 / 16` pair. The iOS marketing-version line is a **doc update**, not an `ios/` source-file change (the file lives at `reports/`, not `ios/`). It reflects the actual state shipped in #841. ✅

Surrounding rows preserved:
- `iOS bundle ID | com.chaudoan.mercyblade | ios/App/App.xcodeproj/project.pbxproj` — unchanged.
- `Android applicationId | com.mercyapps.mercyblade | android/app/build.gradle` — unchanged.
- The 🚩 bundle-ID-divergence flag paragraph immediately after this table — unchanged.

---

## 3. Check — No `ios/` files touched ✅ CONFIRMED

`gh pr view 846 --json files` returns **exactly 3 paths**:

```
android/app/build.gradle
docs/app-store-submission/android-submission-checklist.md
reports/app-store-submission-package-2026-04-26.md
```

None of these are under `ios/`. The mention of "iOS marketing version" in `reports/app-store-submission-package-2026-04-26.md` is purely descriptive doc content (reflecting #841's already-shipped iOS bump), not an iOS source-file modification.

Memory `feedback_ios_info_plist_stability` (don't touch `ios/App/App/Info.plist` unless a new feature requires a new permission) is **not at risk** — `ios/` is untouched. ✅

---

## 4. CI verdict ✅ GREEN

`gh pr view 846 --json statusCheckRollup` at review time:

| Workflow / Check | Conclusion |
|---|---|
| CI Pipeline — Build and Test | ✅ SUCCESS |
| CI Pipeline — Lint Code | ✅ SUCCESS |
| CI Pipeline — Validate Rooms | ✅ SUCCESS |
| Lighthouse Mobile (PR) | ✅ SUCCESS |
| Preview Deployment — Build Preview | ✅ SUCCESS |
| Preview Deployment — Comment on PR | 🟡 QUEUED (non-blocking; runs after build) |
| Vercel | ✅ SUCCESS |
| Vercel Preview Comments | ✅ SUCCESS |

**6 SUCCESS, 1 non-blocking queued, 0 failures.** The queued "Comment on PR" is a notification job that runs after `Build Preview` already succeeded — it cannot affect merge state.

The dispatch said "CI still pending due to runner queue backlog. Review the diff now; CI verdict when it clears." It already cleared. ✅

---

## 5. Cross-checks against memory + sibling PRs

- **Memory `project_android_urls`** — applicationId `com.mercyapps.mercyblade` locked, permanently divergent from iOS `com.chaudoan.mercyblade`. **Honored** — applicationId line is preserved verbatim in `build.gradle`.
- **Memory `feedback_native_work_phasing`** — defer store-coupled native-file work to ~2-4wk pre-submission. The version bump is store-coupled (it's literally the value Google Play reads for the upload). Given #841 has already done the iOS side and memory `project_appstore_reaudit_may19` (A41 re-audit done 2026-05-19) indicates submission readiness work is in flight, this is appropriately timed. Defer-rule respected — review-only.
- **Memory `feedback_ios_info_plist_stability`** — don't touch `ios/App/App/Info.plist` unless a new feature requires it. **Not at risk** — this PR touches nothing under `ios/`.
- **Sibling #841 (iOS bump to 1.0.6 / build 16)** — cited in this PR's title as the source of the version pair. The cross-platform alignment is the entire reason for #846. ✅

---

## 6. Non-blocking observations

1. **The two stale docs were ≥1 release behind `build.gradle`** before this PR (`1.0.1 / 3` in docs vs `1.0.2 / 12` in code). Fixing this in the same PR is a clean win, but it also flags a process gap: doc drift was not caught for at least one prior cycle. Worth a small follow-up (out of A8k scope) to either add a CI gate that diffs `build.gradle` against the checklist doc, OR to drop the version columns from the doc entirely and have the doc point to `build.gradle` as source-of-truth. Not for this PR.
2. The PR title format `(match iOS, per #841)` makes the cross-PR coordination explicit and machine-grep-able. Positive — accept as a convention worth keeping for paired native bumps.
3. No `npx cap sync ios` / `cap sync android` is run as part of this PR — but neither is required for a pure native version bump. `dist/` isn't being rebuilt; only the manifest version is changing. Correct scope.

---

## 7. Cross-refs

- PR #846 — subject under review
- PR #841 — iOS version bump (1.0 → 1.0.6, build 10 → 16); cited in #846's title as the alignment target
- Memory `project_android_urls` — `applicationId` lock + intentional iOS/Android divergence
- Memory `feedback_native_work_phasing` — native PRs gated on pre-submission timing
- Memory `feedback_ios_info_plist_stability` — `ios/` source-file guard
- Memory `project_appstore_reaudit_may19` — A41's submission re-audit (context for why version alignment is happening now)

---

## 8. Verdict summary

| # | Check | Verdict |
|---|---|---|
| 1 | Exactly 2 lines changed in `build.gradle` | ✅ CORRECT |
| 2 | Two stale docs updated correctly | ✅ CORRECT (bonus: also fixes pre-existing doc drift) |
| 3 | No `ios/` files touched | ✅ CONFIRMED |
| 4 | CI status (was pending at dispatch time) | ✅ GREEN — 6 SUCCESS, 0 failures |

**APPROVE.** Three small observations (§6) flagged as follow-up worthwhile-but-not-required; none block the bump.

---

## Status

- **No code touched.** No `build.gradle`, no docs, no `ios/` files edited.
- **No SQL executed.**
- **No production data touched.**
- Pure documentation PR.

*A8k — Android version-bump release-doc review. APPROVE.*
