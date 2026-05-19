# Native — Android version-sync plan (versionCode + versionName bump to match iOS)

**Reviewer:** A5e (read-only — documentation only)
**Worktree:** `/private/tmp/A5e-android-version-sync` off `origin/main` @ `7da69afc7`
**Date:** 2026-05-19
**Trigger:** A5d audit (PR #838) flagged iOS-vs-Android version drift; this scopes the bump PR

---

## TL;DR

| | Current (today) | Target (this plan) | Δ |
|---|---|---|---|
| `versionCode` | `12` | **`16`** | +4 |
| `versionName` | `"1.0.2"` | **`"1.0.6"`** | +4 patches |

- **Verdict:** match iOS exactly (CURRENT_PROJECT_VERSION = 16, MARKETING_VERSION = 1.0.6). Solo-founder simplification (STRATEGY §1, outcomes-first).
- **Play Store risk of jumping `versionCode` from 12 → 16:** **None.** Play requires monotonic increase, not contiguity.
- **Files changed in the bump PR:** `android/app/build.gradle` only — a two-line diff.

---

## 1. Current state — confirmed

From `android/app/build.gradle` (lines 17-21):

```groovy
defaultConfig {
    applicationId "com.mercyapps.mercyblade"
    minSdkVersion rootProject.ext.minSdkVersion
    targetSdkVersion rootProject.ext.targetSdkVersion
    versionCode 12
    versionName "1.0.2"
    ...
}
```

iOS reference (`ios/App/App.xcodeproj/project.pbxproj`):

```
CURRENT_PROJECT_VERSION = 16
MARKETING_VERSION = 1.0.6
```

Drift: Android is **4 build numbers** and **4 patch versions** behind iOS, exactly as A5d (PR #838) reported.

---

## 2. Submission history — best-effort reconstruction

The two source-of-truth documents are stale relative to today's `build.gradle`:

- `docs/app-store-submission/android-submission-checklist.md` line 14-15: `Version name 1.0.1 / Version code 3`
- `reports/app-store-submission-package-2026-04-26.md` line 21: `Android version 1.0.1 (versionCode 3)`

Git log on `android/app/build.gradle` only shows ~6 commits over the project's lifetime — and only the early ones are version bumps:

| Commit | Subject | versionCode / Name at that point |
|---|---|---|
| `0ddf452bc` | `Add Capacitor iOS and Android shells` | initial (1 / "1.0") |
| `2bee82102` | `chore(android): pin androidx.browser 1.8.0 + bump to 1.0.1 (versionCode 2) (#13)` | 2 / "1.0.1" |
| `28a91d064` | `chore: iOS Build 7 + Android Build 3 bumps + Apple Sign In diagnosis` | 3 / "1.0.1" |
| `02e9d9563` | `fix(app-store): align bundle ID, add support page, hide non-IAP payments on iOS (#152)` | unchanged (3 / "1.0.1") |
| `37772d9cf` | `Fix Speak grammar safety + stabilize Supabase auth lock on native` | **the jump to 12 / "1.0.2"** appears to have happened here |

The jump from 3 to 12 was not driven by published Play submissions — Android has not been the active submission target since the initial publish. The local `12` is most likely cap-sync churn / device-build numbering that accumulated during iOS-focused work and never got reset. Either way, Play Store only cares about **monotonic increase relative to the last AAB it accepted**.

**Per `docs/app-store-submission/SUBMISSION_RUNBOOK.md` line 27:** `com.mercyapps.mercyblade` has been the live Play Store applicationId since first publish. PR #152's bundle-ID alignment changed iOS only. So whatever versionCode Play currently has on file is the constraint, and any value strictly greater than that is acceptable.

---

## 3. Decision — match iOS exactly

Apply STRATEGY §1 (outcomes-first; the rest is engagement theater) plus the operating-discipline rule "**One owner per function**" (CLAUDE.md). For a solo founder shipping both stores, keeping the two platforms' version numbers in lockstep is the simplest possible ops model:

- One mental model: "MercyBlade is on version `1.0.6`".
- One release-notes block instead of two divergent ones.
- One support conversation: a user reporting a bug on "1.0.6" is on the same code regardless of platform.
- One bump-step per release: `+1 build / +1 patch` on both, in one PR each release going forward.

**Counter-arguments considered:**

- *"Don't bump Android more than needed — Play already accepts higher numbers from a previous local build."* This argues for `versionCode 13`. But it preserves the `versionName` divergence ("1.0.2" vs "1.0.6"), which leaks into every support interaction, release-notes copy bank, and store-listing screenshot. The cost of a 3-integer-larger `versionCode` is zero; the cost of mismatched marketing strings is ongoing. Prefer alignment.
- *"Match iOS now, then re-diverge if Android ever leads on a feature."* That's fine — when Android leads, bump it. The point is to start lockstep, not to stay there at all costs.

---

## 4. The exact change (two-line diff)

```diff
--- a/android/app/build.gradle
+++ b/android/app/build.gradle
@@ -18,8 +18,8 @@ android {
         applicationId "com.mercyapps.mercyblade"
         minSdkVersion rootProject.ext.minSdkVersion
         targetSdkVersion rootProject.ext.targetSdkVersion
-        versionCode 12
-        versionName "1.0.2"
+        versionCode 16
+        versionName "1.0.6"
         testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
         aaptOptions {
             # ...
```

That is the entire native config change. Nothing else in the bump PR's diff except, optionally, the doc refreshes called out in §6.

---

## 5. Play Store `versionCode` jump risk — none

Google Play documents the constraint as:

> The version code is an integer value … *each update* of the app should have a higher version code than the last one.
> ([Play Console — Set version requirements](https://support.google.com/googleplay/android-developer/answer/9859152))

There is no Play-side requirement that `versionCode` increment by 1. Skipping from 12 → 16 is identical, from Play's standpoint, to skipping from 12 → 13. The only constraint is `new > previously-accepted-AAB`.

`versionName` is a free-form string and has no Play-side numeric constraint at all.

**Conclusion: zero risk to the jump.** The only thing to verify is that no in-flight internal-track AAB at `versionCode 13/14/15` exists in Play Console that this PR could "skip past" — extremely unlikely given Android hasn't been the active submission target, but worth a 30-second sanity check in Play Console when Chau opens the bump PR.

---

## 6. Bump-PR scope (when Chau opens it)

### Files changed

| File | Change |
|---|---|
| `android/app/build.gradle` | `versionCode 12 → 16`, `versionName "1.0.2" → "1.0.6"` |
| `docs/app-store-submission/android-submission-checklist.md` (optional) | Line 14-15 `1.0.1 (versionCode 3)` → `1.0.6 (versionCode 16)` |
| `reports/app-store-submission-package-2026-04-26.md` (optional) | Line 21 `1.0.1 (versionCode 3)` → `1.0.6 (versionCode 16)` |
| `docs/app-store-submission/whats-new/v1.0.6.md` (optional, new) | New file mirroring `v1.0.0.md`, Android release notes ≤500 chars |

The doc refreshes can ride in the same PR (`docs/app-store-submission/*` and the dated submission-package report are clearly tied to the version bump). If Chau prefers small commits, split them — the bump itself is irreducibly a two-line change.

### Gates to run before opening the PR

- `npm run typecheck` — JS side unchanged but cheap to run.
- `npm test` — no Android source affected, but the test suite reads from a few config files; cheap.
- `npm run build` — also unchanged, but produces the `dist/` the device-build will package.
- `npx cap sync android` — syncs `dist/` into `android/app/src/main/assets/public/`.
- `cd android && ./gradlew bundleRelease` — produces the AAB. Requires `android/keystore.properties` (gitignored) to be present locally, otherwise falls back to unsigned debug.

### Device-verify before Play submission

- AAB size < 200 MB (memory `project_bundle_size_deferred.md` deferred the ~21 MB room-JSON move; total AAB stays well under today).
- Install AAB on a physical Android device (or run via `adb install -r`).
- Open the app → Settings / About → confirm version string reads `1.0.6 (16)`.
- Verify the same three policy/ops blockers as iOS (A5d / PR #838): #796 tracker guard, #821 dSYM equivalent isn't relevant for Android (Crashlytics/Sentry symbol files for Android come from Gradle, not Xcode — separate concern), #811 delete-account manifest. **#796 is the Android-side critical one** — Play Data Safety reviewers check this.

---

## 7. Non-recommendations (things deliberately NOT in this plan)

- **Do not** edit `android/app/build.gradle` in this PR — A5e is documentation only, per dispatch.
- **Do not** introduce a `cap-set-version` script or a single-source-of-truth automation just to match the two platforms. STRATEGY §1 again: a one-line manual bump twice per release is fine; the ops overhead of a tool that has to parse `pbxproj` exceeds the savings until release cadence is much higher.
- **Do not** start tracking `package.json#version` as a source of truth (still `"0.0.0"`). The two native files remain authoritative.
- **Do not** delete the historical stale entries in the submission-package report; refresh them in the bump PR rather than rewriting history.

---

## 8. Recommendation in one line

Open a small PR titled `chore(android): bump versionCode 12→16 and versionName 1.0.2→1.0.6 to match iOS`, two-line diff to `android/app/build.gradle`, optional doc refresh, gates clean, device-install verified. Then **#796 needs to land** before any actual Play submission — same blocker iOS has, possibly more material on Android because Play Data Safety reviews trackers heavily.
