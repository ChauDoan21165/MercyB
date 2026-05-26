# iOS dSYM Xcode wire-up — instruction verify (A7g)

**Owner:** A7
**Date:** 2026-05-19
**Status:** read-only verify; no Xcode project file touched
**Parent PR:** #821 (`scripts/upload-ios-dsyms.sh` + `docs/IOS-DSYM-UPLOAD.md`) — still OPEN at audit time, doc content read from `origin/feat/ios-dsym-upload`
**Verdict: NEEDS-CORRECTION** — two cosmetic prose errors in the doc's explanation; the actual commands and final paths are correct and will work as written

## TL;DR

Walked every claim in `docs/IOS-DSYM-UPLOAD.md` §"Wiring the Xcode Run Script phase" against the live `ios/App/App.xcodeproj/project.pbxproj` on `main` (414 lines, last modified by PR #683 / A28 cap-sync chain). The Run Script body, the script path, the keychain command, and the Release `DEBUG_INFORMATION_FORMAT` prerequisite all check out. **Two prose statements are wrong and should be corrected in a follow-up edit:**

1. The doc claims `${PROJECT_DIR}` resolves to `<repo>/ios/App/App` — it actually resolves to `<repo>/ios/App/`. The doc's path math (`../../scripts/...` = repo-root `scripts/`) still lands in the right place, so an operator who pastes the script verbatim succeeds. But the explanation is off-by-one and a maintainer trying to relocate the script would compute the wrong depth.
2. The doc tells Chau to reorder the new phase to run "after `Embed Frameworks` and after `[CP] Embed Pods Frameworks`". There is **no** `Embed Frameworks` phase in this project — only `[CP] Embed Pods Frameworks` exists. The intent ("run last, after frameworks are on disk") is right; the phase name reference is wrong.

Neither is a runtime bug — both are documentation-only fixes — but a clean doc avoids a "wait, where's that phase?" moment when Chau is staring at the Build Phases list for the first time.

## Method

1. Confirmed PR #821 still OPEN (`gh pr view 821` → `state: OPEN`, `mergedAt: null`). Doc content not on `main` yet — fetched from `origin/feat/ios-dsym-upload` for this audit.
2. Read `ios/App/App.xcodeproj/project.pbxproj` from `origin/main` (post-cap-sync) end-to-end.
3. Walked the doc's eight wiring steps against the pbxproj.

This audit is read-only: no `.xcodeproj` write, no native config touched, no script touched.

## Verified claims (all ✓)

### Single target named `App`

`project.pbxproj:103` — `504EC3031FED79650016851F /* App */ = { isa = PBXNativeTarget; ... name = App; ... };`

There is exactly one `PBXNativeTarget`. No `AppTests`, no `AppExtension`, no widget target. The doc's "select the `App` target" instruction is unambiguous and correct.

### Release config produces dSYMs by default

`project.pbxproj:330` — `DEBUG_INFORMATION_FORMAT = "dwarf-with-dsym";` on the Release config (`504EC3151FED79650016851F`). This is exactly the prerequisite the doc names ("must be `DWARF with dSYM File`"). No action required — Apple's archive default is already set.

For completeness: Debug at line 273 has `DEBUG_INFORMATION_FORMAT = dwarf` (no dSYMs). The script's `CONFIGURATION != Release → exit 0` short-circuit (line 36 of the script) correctly handles this; Debug builds skip the upload cleanly.

### Existing Run Script phases

Two `PBXShellScriptBuildPhase` blocks exist (lines 174–208):

| Phase | Location in `buildPhases` array | Purpose |
| --- | --- | --- |
| `[CP] Check Pods Manifest.lock` | first | CocoaPods sanity check |
| `[CP] Embed Pods Frameworks` | last | CocoaPods framework embedding |

The new `Upload dSYMs to Sentry` phase Chau adds becomes the **third** shell-script phase, listed below `[CP] Embed Pods Frameworks` in the buildPhases list — see correction (2) below.

### Build phase order on the live target

From `project.pbxproj:106–112`:

```
[CP] Check Pods Manifest.lock
Sources                          (= "Compile Sources" in the GUI)
Frameworks                       (= "Link Binary With Libraries" in the GUI)
Resources                        (= "Copy Bundle Resources" in the GUI)
[CP] Embed Pods Frameworks
```

This is a stock Capacitor template — no extra "Embed Frameworks" phase, no asset-catalog post-process, no other shell scripts. The doc's instruction to "run after frameworks are on disk" is satisfied by placing the new phase after `[CP] Embed Pods Frameworks`, i.e. **at the very end of the buildPhases list**.

### Relative path `../../scripts/upload-ios-dsyms.sh` from `${PROJECT_DIR}`

The `.xcodeproj` lives at `ios/App/App.xcodeproj/`. Xcode's `${PROJECT_DIR}` is **the parent directory of the `.xcodeproj`**, i.e. `<repo>/ios/App/`. From there:

```
${PROJECT_DIR}             = <repo>/ios/App/
${PROJECT_DIR}/..          = <repo>/ios/
${PROJECT_DIR}/../..       = <repo>/         ← repo root
${PROJECT_DIR}/../../scripts/upload-ios-dsyms.sh
                           = <repo>/scripts/upload-ios-dsyms.sh   ✓
```

The path the doc tells Chau to paste **lands in the right place**. The script exists at that final location on `origin/feat/ios-dsym-upload` (verified by `git show origin/feat/ios-dsym-upload:scripts/upload-ios-dsyms.sh` returned a real file, 104 lines).

### Keychain command syntax

Doc: `security find-generic-password -w -s mb-sentry-auth-token 2>/dev/null || true`

- `-w` outputs the password value only (no metadata) — correct
- `-s <service>` matches the service-name field — correct
- `mb-sentry-auth-token` is the canonical entry name per memory (`project_sentry_infra_access`) — correct
- `2>/dev/null || true` gracefully soft-fails when the entry is missing so the rest of the Run Script can print a `[upload-ios-dsyms]` skip line — correct

Standard `security(1)` syntax. No corrections needed.

## Errors to correct (cosmetic, doc-only)

### (1) `${PROJECT_DIR}` resolves to `ios/App/`, not `ios/App/App/`

**Current doc text (last paragraph of step 5):**

> Path note: `${PROJECT_DIR}` inside an Xcode Run Script for this app resolves to `<repo>/ios/App/App`, so `../../scripts/...` lands at `<repo>/scripts/upload-ios-dsyms.sh`.

**Wrong.** `${PROJECT_DIR}` is the directory containing the `.xcodeproj`, which is `<repo>/ios/App/`. The directory `<repo>/ios/App/App/` is the *source group* inside the project (where `Info.plist`, `AppDelegate.swift`, etc. live — see `INFOPLIST_FILE = App/Info.plist` at `project.pbxproj:357`). They're two different things.

The final path that gets executed (`<repo>/scripts/upload-ios-dsyms.sh`) is correct because `../../` from `<repo>/ios/App/` lands at the repo root anyway. The math works out; the explanation is off-by-one.

**Suggested replacement:**

> Path note: `${PROJECT_DIR}` inside an Xcode Run Script resolves to `<repo>/ios/App/` (the directory holding `App.xcodeproj`, not the `App/` source group inside it). So `${PROJECT_DIR}/../..` is the repo root and `${PROJECT_DIR}/../../scripts/upload-ios-dsyms.sh` is the committed script. If you move the script, update the path here.

### (2) `Embed Frameworks` phase doesn't exist in this project

**Current doc text (step 4):**

> Reorder it to run **after** `Embed Frameworks` and after `[CP] Embed Pods Frameworks` — the dSYMs need to be on disk first.

**Wrong.** The pbxproj has no `Embed Frameworks` phase. The only embed phase is `[CP] Embed Pods Frameworks` (line 193, the CocoaPods-generated one). The intent — "run last, after frameworks are on disk" — is correct; the phase name reference is stale (probably copied from a stock Apple project that includes Apple's own `Embed Frameworks` phase, which Capacitor projects skip in favour of the CocoaPods variant).

**Suggested replacement:**

> Reorder it to run **at the end of the buildPhases list**, after `[CP] Embed Pods Frameworks` — the dSYMs need to be on disk first. (This Capacitor project does not have a separate `Embed Frameworks` phase; the CocoaPods-managed `[CP] Embed Pods Frameworks` is the only embed step.)

## What stays the same (no edit needed)

- The Run Script body in step 5 (the `if [ "${CONFIGURATION}" = "Release" ]; then ...` block) — correct as written, copy-pasteable verbatim
- The keychain command in step 5 — correct
- Steps 1, 2, 3 (target select, `+ → New Run Script Phase`, rename to `Upload dSYMs to Sentry`) — correct
- Step 6 (uncheck "Based on dependency analysis") — correct
- Step 7 (Release `DEBUG_INFORMATION_FORMAT = DWARF with dSYM File`) — correct prerequisite; already satisfied by the current pbxproj
- All troubleshooting entries — accurate

## Recommended dispatch

A **one-edit follow-up PR** to `docs/IOS-DSYM-UPLOAD.md`, modifying the two paragraphs above. Estimated diff: ~10 lines. Can be picked up by any agent or applied by Chau directly when reviewing this report. **No prerequisite on PR #821 merging** — the edit can be cherry-picked onto `feat/ios-dsym-upload` before merge, or applied to `main` as a fast-follow once #821 lands.

## References

- `ios/App/App.xcodeproj/project.pbxproj` lines 103 (single `App` target), 106–112 (buildPhases order), 174–208 (existing shell-script phases), 273 (Debug `DEBUG_INFORMATION_FORMAT = dwarf`), 330 (Release `DEBUG_INFORMATION_FORMAT = dwarf-with-dsym`), 357 (`INFOPLIST_FILE = App/Info.plist`)
- Parent PR: #821 (`scripts/upload-ios-dsyms.sh`, `docs/IOS-DSYM-UPLOAD.md`) — `origin/feat/ios-dsym-upload`
- A7c audit: PR #816 (`reports/NATIVE-sentry-init-audit-A7c.md`)
- Memory: `project_sentry_infra_access` (keychain entry `mb-sentry-auth-token`), `project_android_urls` (note: iOS bundle id `com.chaudoan.mercyblade`, intentionally divergent from Android)
