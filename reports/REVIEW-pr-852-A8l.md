# PR #852 Review — iOS Build Number 16→17 (A8l)

**Agent:** A8l (doc-only iOS build-number review; **already merged** — review is post-hoc for the record)
**Branch:** `review/852-ios-build`
**Subject:** PR #852 `chore/ios-build-bump-17` — `chore(native): bump iOS build number 16→17 for next TestFlight archive`
**Merge state:** **MERGED** at `09d300525` on `origin/main`
**Labels:** native, ios, build-bump, pre-testflight

---

## Verdict — APPROVE (post-merge)

All 5 dispatch invariants pass. CI was GREEN before merge (6 SUCCESS, 1 non-blocking queued). The bump is exactly what the commit message claims: two `CURRENT_PROJECT_VERSION` lines flip from `16` to `17`, `MARKETING_VERSION` stays at `1.0.6` on both Debug + Release configs, no other files touched. Standard pre-TestFlight discipline.

---

## 1. Check — Exactly 2 lines changed in `project.pbxproj` ✅ CORRECT

`git show 09d300525 -- ios/App/App.xcodeproj/project.pbxproj`:

```diff
@@ -352,7 +352,7 @@
 			buildSettings = {
 				ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
 				CODE_SIGN_STYLE = Automatic;
-				CURRENT_PROJECT_VERSION = 16;
+				CURRENT_PROJECT_VERSION = 17;
 				DEVELOPMENT_TEAM = 27JT9VDT45;
 				INFOPLIST_FILE = App/Info.plist;
 				IPHONEOS_DEPLOYMENT_TARGET = 15.6;
@@ -373,7 +373,7 @@
 			buildSettings = {
 				ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
 				CODE_SIGN_STYLE = Automatic;
-				CURRENT_PROJECT_VERSION = 16;
+				CURRENT_PROJECT_VERSION = 17;
 				DEVELOPMENT_TEAM = 27JT9VDT45;
 				INFOPLIST_FILE = App/Info.plist;
 				IPHONEOS_DEPLOYMENT_TARGET = 15.6;
```

- **Line 355** (Debug config): `CURRENT_PROJECT_VERSION = 16;` → `17;` ✅
- **Line 376** (Release config): `CURRENT_PROJECT_VERSION = 16;` → `17;` ✅

Both blocks bump in the same direction (forward, monotonic). App Store Connect rejects archives that reuse a previously-uploaded build number; this satisfies that constraint (16 was the last uploaded value, per commit message).

**What is NOT touched (verified critical):**
- `DEVELOPMENT_TEAM = 27JT9VDT45;` — preserved.
- `CODE_SIGN_STYLE = Automatic;` — preserved.
- `INFOPLIST_FILE`, `IPHONEOS_DEPLOYMENT_TARGET`, `ASSETCATALOG_COMPILER_APPICON_NAME` — all preserved.

---

## 2. Check — `MARKETING_VERSION` unchanged ✅ STAYS 1.0.6

Post-merge file state:

```
355: CURRENT_PROJECT_VERSION = 17;   (Debug)
360: MARKETING_VERSION = 1.0.6;      (Debug)
376: CURRENT_PROJECT_VERSION = 17;   (Release)
381: MARKETING_VERSION = 1.0.6;      (Release)
```

`MARKETING_VERSION = 1.0.6` on **both** Debug and Release. Untouched by this PR (the diff doesn't include `MARKETING_VERSION` at all — line 360 is below the 3-line context window of the line-355 hunk, and line 381 is below the line-376 hunk).

This is correctly framed as a **build-number bump for the next TestFlight archive**, not a user-facing version change. The user-facing string remains `1.0.6` (matching #846's Android `versionName`). Settings → About → Version shows `1.0.6 (17)`.

---

## 3. Check — No other native files touched ✅ CONFIRMED

`gh pr view 852 --json files` returns **exactly 1 path**:

```
ios/App/App.xcodeproj/project.pbxproj   (modified, +2/-2)
```

**Specifically NOT modified** (verified per gh PR files):
- `ios/App/App/Info.plist` — untouched (memory `feedback_ios_info_plist_stability` honored)
- `ios/App/App.xcworkspace/...` — untouched
- `ios/App/Podfile` / `ios/App/Podfile.lock` — untouched
- `android/` — untouched (already on `versionCode 16 / versionName 1.0.6` via sibling #846)
- `src/`, `supabase/`, `public/` — untouched

This is the smallest possible iOS native-version-bump diff: two lines.

---

## 4. CI state ✅ GREEN (pre-merge)

`gh pr view 852 --json statusCheckRollup` (snapshotted post-merge for the record):

| Workflow / Check | Conclusion |
|---|---|
| CI Pipeline — Build and Test | ✅ SUCCESS |
| CI Pipeline — Lint Code | ✅ SUCCESS |
| CI Pipeline — Validate Rooms | ✅ SUCCESS |
| Lighthouse Mobile (PR) | ✅ SUCCESS |
| Preview Deployment — Build Preview | ✅ SUCCESS |
| Preview Deployment — Comment on PR | 🟡 QUEUED (non-blocking; post-deploy notification) |
| Vercel | ✅ SUCCESS |
| Vercel Preview Comments | ✅ SUCCESS |

**6 SUCCESS, 0 failures, 1 non-blocking queued.** The queued "Comment on PR" runs after Build Preview already succeeded and cannot affect merge state — same shape as #846.

Note: there is **no Xcode compile in CI** by design — the PR's own commit message correctly states the actual archive runs locally via `cap sync` + Xcode Organizer. CI here only verifies that the pbxproj diff doesn't break the repo's web-side typecheck/lint/build, not that the project still archives cleanly. That archive verification is part of the pre-TestFlight checklist (commit message cites #807 / A5d audit / PR #838).

---

## 5. Memory + sibling-PR cross-checks

- **Memory `feedback_ios_info_plist_stability`** — don't touch `ios/App/App/Info.plist` unless a new feature requires it. **Honored** — only `project.pbxproj` modified.
- **Memory `feedback_native_work_phasing`** — defer store-coupled native-file work to ~2-4wk pre-submission. The bump is store-coupled (App Store Connect reads `CURRENT_PROJECT_VERSION` directly from the archive). Sibling #846 (Android `versionCode 12→16`) and #841 (iOS `1.0 → 1.0.6 / build 10 → 16`) form a coordinated pre-TestFlight wave; #852 increments the iOS build a further step (16→17) for the next archive upload. Appropriately timed per A41 (`project_appstore_reaudit_may19`).
- **Memory `project_android_urls`** — N/A, this is iOS. (But the cross-platform `MARKETING_VERSION 1.0.6` parity with #846's Android `versionName "1.0.6"` is the standard cross-store coordination.)
- **Sibling PRs**:
  - #841 — iOS `1.0 → 1.0.6 / build 10 → 16` (predecessor)
  - #846 — Android `versionCode 12 → 16 / versionName "1.0.2" → "1.0.6"` (Android catch-up)
  - **#852 — iOS `build 16 → 17`** (this PR; the next archive will be build 17)

The commit body also flags two real **pre-TestFlight blockers** that are NOT this PR's responsibility but **must land before the Archive upload**:
1. **#796** — tracker guard against native execution (must be on the archive's HEAD).
2. **#807 / A5d audit (PR #838)** — device-verify before submission.

Flagging here so they're not lost between #852 merging and the actual TestFlight upload moment.

---

## 6. Non-blocking observations

1. **Bumping both Debug + Release together is correct.** The commit body explains: keeping Debug in sync with Release avoids "why does Settings/About show a different build number on my dev install" support noise. Subtle but real — accept the convention as standard going forward.
2. **Two-line build-number bumps are about as small as a native PR can get.** Sister #846 (Android) was 2 lines in `build.gradle` + 4 lines of doc sync. #852 is 2 lines in `project.pbxproj`, no doc files. The iOS-doc parity (`reports/app-store-submission-package-2026-04-26.md`) already shipped via #846 ("iOS marketing version `1.0.6` (build 16)") — but that doc now shows build 16, while the actual archive will be build 17. **Mild doc drift** — flag as a tiny follow-up (out of A8l scope): when the next TestFlight archive uploads as build 17, that doc line should be re-touched to read `build 17`.
3. **No `cap sync ios` invocation in this PR** — correct. The PR doesn't change anything that would require regenerating `ios/App/App/public/`; the build number is a project-setting bump, not a web-asset change. `cap sync` runs at archive time, locally, per the dev's discipline.

---

## 7. Verdict summary

| # | Check | Verdict |
|---|---|---|
| 1 | Exactly 2 lines changed in `project.pbxproj` (Debug + Release) | ✅ CORRECT |
| 2 | `MARKETING_VERSION` unchanged (stays `1.0.6`) | ✅ CONFIRMED on both configs |
| 3 | No other native files touched | ✅ CONFIRMED |
| 4 | CI state | ✅ GREEN — 6 SUCCESS, 0 failures |
| 5 | Memory / sibling-PR cross-checks | ✅ All honored |

**APPROVE (post-merge).** One small follow-up flagged (§6.2 — doc says `build 16`, archive will be `build 17`) for whenever the next archive uploads.

---

## 8. Cross-refs

- PR #852 — subject under review (MERGED at `09d300525`)
- PR #841 — iOS `1.0.6 / build 16` predecessor
- PR #846 — Android `1.0.6 / versionCode 16` parity bump (A8k review at #869)
- PR #838 — A5d audit context
- PR #796 — tracker guard pre-TestFlight gate
- PR #807 — device-verify pre-TestFlight gate
- Memory `project_appstore_reaudit_may19` — the "why now" submission readiness context
- Memory `feedback_ios_info_plist_stability` — `ios/` `Info.plist` guard (honored)
- Memory `feedback_native_work_phasing` — native-PR timing discipline

---

## Status

- **No code touched.** No `project.pbxproj`, no `Info.plist`, no `ios/` or `android/` files edited by A8l.
- **No SQL executed.**
- **No production data touched.**
- Pure documentation PR (post-hoc record of a merged-clean bump).

*A8l — iOS build-number bump review. APPROVE.*
