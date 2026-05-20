# Native — App Store submission blockers verified (A5h)

**Reviewer:** A5h (read-only verify)
**Worktree:** `/private/tmp/A5h-submission-blockers-verify` off `origin/main` @ `424d9080f`
**Date:** 2026-05-19
**Trigger:** PR #852 (A5g) bumped `CURRENT_PROJECT_VERSION 16 → 17`; before Chau Archives, confirm the 3 store-policy blockers from PR #838 (A5d) are actually on `main` so `cap sync ios` picks them up.

---

## Headline verdict

```
╔══════════════════════════════════════════════════════════════╗
║  CLEAR-TO-ARCHIVE  ✅                                        ║
║  All 3 submission blockers verified on origin/main today.    ║
╚══════════════════════════════════════════════════════════════╝
```

| PR | Title | Merged | Verdict |
|---:|---|---|---|
| **#796** | `fix(privacy): guard marketing trackers against native execution (per A41)` | 2026-05-19 22:19:24 UTC | ✅ ON-MAIN |
| **#821** | `feat(native): iOS dSYM upload script + Xcode Run Script docs (Sentry gap #1)` | 2026-05-19 22:28:33 UTC | ✅ ON-MAIN |
| **#811** | `fix(privacy): add 42 missing user-id tables to delete-account manifest (B1 follow-up to #797)` | 2026-05-19 22:28:29 UTC | ✅ ON-MAIN |

---

## 1. Merge commits visible on `origin/main`

`git log origin/main --oneline -30 | rg '#796|#821|#811'`:

```
522dcd348 feat(native): iOS dSYM upload script + Xcode Run Script docs (Sentry gap #1) (#821)
dafa9b540 fix(privacy): add 42 missing user-id tables to delete-account manifest (B1 follow-up to #797) (#811)
9c2182924 fix(privacy): guard marketing trackers against native execution (per A41) (#796)
```

All three are in the recent 15-commit window on `origin/main`; the worktree was branched off `424d9080f` (HEAD at audit time), which already contains them. The next `git pull --ff-only` Chau runs from `main` will keep them.

---

## 2. Per-blocker file-content verification

### #796 — native-platform guard on marketing trackers ✅

**Expected:** `initMarketingTracking()` short-circuits inside the Capacitor native WebView before any consent read or tracker import.

**Found** (`src/services/behaviorTrackingFlag.ts:155-174`):

```ts
export async function initMarketingTracking(): Promise<{
  consent: boolean;
  utmCaptured: boolean;
  pixelLoaded: boolean;
  ga4Loaded: boolean;
  clarityLoaded: boolean;
}> {
  // App Store / Play compliance (A41 Blocker 1): marketing trackers
  // (Meta Pixel / GA4 / Microsoft Clarity) must never run inside the
  // native WebView. Short-circuit before the consent check so a native
  // build neither touches localStorage consent nor imports a tracker.
  if (isNativePlatform()) {
    return {
      consent: false,
      utmCaptured: false,
      pixelLoaded: false,
      ga4Loaded: false,
      clarityLoaded: false,
    };
  }
  ...
```

Helper imported from `@/lib/platform` (`src/services/behaviorTrackingFlag.ts:39`). Comment explicitly cites A41 Blocker 1 and the App Store / Play compliance rationale. The short-circuit is **before** the consent check, **before** any tracker import — exactly the contract A5d called for. Privacy policy promise ("the iOS and Android apps do not use Clarity") is now true in code.

**Note** — the dispatch's expected path `src/lib/marketingTrackers.ts` does not exist; the actual mount point is `src/services/behaviorTrackingFlag.ts` (the `initMarketingTracking` export) called from `src/main.tsx`. Same lever, different file — the dispatch's path was speculative.

### #821 — iOS dSYM upload script ✅

**Expected:** `scripts/upload-ios-dsyms.sh` exists on main.

**Found:**
```
-rwxr-xr-x  1 admin  wheel  4546  scripts/upload-ios-dsyms.sh
                                  docs/IOS-DSYM-UPLOAD.md
```

Script header confirms scope: uploads dSYMs to Sentry, designed for Xcode Run Script build phase on Release configuration, with manual `xcodebuild archive` fallback. Requires `SENTRY_AUTH_TOKEN` + `SENTRY_ORG=chau-doan` + `SENTRY_PROJECT=mercyblade-web`. Plus a separate `docs/IOS-DSYM-UPLOAD.md` for the Xcode wiring instructions.

⚠️ **Wiring caveat:** this PR added the script and the docs, but the Xcode Run Script phase itself needs Chau to add it inside Xcode UI (Build Phases → New Run Script Phase). The dSYM script is on main; whether the project.pbxproj has the Run Script phase wired is a separate manual step. **A5h is read-only verify; recommend Chau confirm the Run Script phase exists in Xcode before the first symbolicated Archive.** If it's not wired, the script exists but won't run during Archive — dSYMs land in `~/Library/Developer/Xcode/Archives/<date>/<archive>.xcarchive/dSYMs/` and can be uploaded manually post-Archive via `./scripts/upload-ios-dsyms.sh <path>`.

### #811 — delete-account manifest +42 tables ✅

**Expected:** `supabase/functions/delete-account/user-data-manifest.ts` exists with ~190+ table entries.

**Found:**
```
$ wc -l supabase/functions/delete-account/user-data-manifest.ts
     440
$ grep -c "table:" supabase/functions/delete-account/user-data-manifest.ts
199
```

**199 `table:` entries** in 440 lines — comfortably over the 190+ target and consistent with the original ~148 baseline + the 42 new entries (and 9 prior anonymize/skip classifications). The file's docstring confirms all four action types (delete / anonymize / skip_view / skip_admin) are present with explicit P0-for-Apple-5.1.1(v) + GDPR Art. 17 rationale. A CI check at `scripts/check-delete-account-coverage.mjs` fails the build if a new user-id table lands without classification → drift protection in place.

---

## 3. Other A5d / A5g items quickly re-confirmed

- **`CURRENT_PROJECT_VERSION = 17`** on both Debug + Release configs in `ios/App/App.xcodeproj/project.pbxproj` (PR #852 not yet merged but is OPEN + MERGEABLE; Chau merges it as the immediate next step before Archive).
- **`MARKETING_VERSION = 1.0.6`** unchanged on both configs.
- **Android version sync** (PR #846) is open + MERGEABLE; not strictly required for an iOS-only TestFlight Archive, but should land in the same session to keep the platforms in lockstep going forward.

---

## 4. Exact Archive command sequence (CLEAR-TO-ARCHIVE path)

Pre-merge step: **merge PR #852** (`chore(native): bump iOS build number 16→17`) so `cap sync` picks up build 17.

Then, from a clean main worktree:

```bash
# 0. Land on a clean main with all 3 blockers + the iOS build-17 bump.
git fetch origin
git checkout main
git pull --ff-only

# 1. Lockfile-faithful install.
npm ci --legacy-peer-deps

# 2. Build the web shell that the iOS WebView will load.
npm run build

# 3. Sync dist/, Capacitor config, and Pods into ios/.
npx cap sync ios

# 4. Confirm sync didn't introduce surprise edits beyond Podfile.lock /
#    ios/App/App/public/. Inspect before continuing.
git status
git diff -- ios/App/Podfile.lock

# 5. Open the Xcode workspace (always the .xcworkspace, never the .xcodeproj alone).
npx cap open ios

# 6. In Xcode:
#    a. Confirm Project → App target → General → Build = "17" (PR #852 set this).
#    b. Confirm Build Phases → "Upload dSYMs to Sentry" Run Script exists.
#       If missing, add it now per docs/IOS-DSYM-UPLOAD.md before Archive
#       (so this Archive is symbolicated).
#    c. Select "Any iOS Device (arm64)" as the run destination.
#    d. Product → Archive.
#    e. Wait for the archive to appear in Organizer (~2-5 min).
#    f. Distribute App → App Store Connect → Upload → follow prompts.

# 7. After upload completes:
#    - TestFlight → Builds → confirm "1.0.6 (17)" appears + "Processing".
#    - Once processing completes (~10-30 min), invite internal testers.
#    - Promote to App Store review only after a TestFlight pass.
```

---

## 5. Pre-Archive sanity (device-verify, recommended not blocking)

Per A5d step §4.7, ideally run a TestFlight Internal build through one device before App Store review to catch:

- Marketing trackers really staying silent on native (verify via device console / network inspector — `initMarketingTracking()` short-circuit should mean zero `connect.facebook.net`, `googletagmanager`, `clarity.ms` requests).
- Delete-account flow runs end-to-end on a test user without errors (touches the new manifest's 199 tables).
- No surprise Sentry init noise on cold boot (route-gated init from #720; Sentry shouldn't fire on `/privacy` or anonymous landing visits).

None of these block the Archive itself — they're TestFlight-loop checks before App Store review submission.

---

## 6. Recommendation

1. **Merge PR #852** (iOS build → 17). Trivial. CI green.
2. **Optionally merge PR #846** (Android bump) to keep the platforms in lockstep. Not required for this iOS Archive but ideal hygiene.
3. **Pull main**, run §4's command sequence.
4. **Archive + upload to TestFlight.** All 3 store-policy blockers are now in the bytes that get archived.
5. **TestFlight loop §5** before promoting to App Store review.
