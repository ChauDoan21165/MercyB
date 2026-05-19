# iOS dSYM upload to Sentry

Native iOS crashes that reach Sentry symbolicate to readable source frames
(`AppDelegate.swift:42`) only when the matching dSYM bundles have been
uploaded to Sentry. Without upload, every native crash arrives as raw
addresses (`0x100abcdef`) and triage is impossible.

This page is the **operator** guide for wiring the upload step. The
script lives at `scripts/upload-ios-dsyms.sh` (committed); the Xcode Run
Script phase you add manually is what calls it.

> Source: A7c audit gap #1 (PR #816, `reports/NATIVE-sentry-init-audit-A7c.md`).
> Native Sentry wiring otherwise looks healthy — JS-bridged init is intact
> and pods are installed — only debug-symbol upload was missing.

## What this affects

- **Release archive builds → TestFlight / App Store.** That's where dSYMs
  are generated and uploaded. Debug builds skip the upload (the script
  exits 0 on non-Release configs).
- **Native iOS crashes only.** JS errors and web Sentry events are
  handled by the existing `@sentry/vite-plugin` sourcemap upload in
  `.github/workflows/production-deploy.yml` — orthogonal pipeline.
- **Android is NOT covered here.** Release builds today have
  `minifyEnabled false`, so traces aren't obfuscated and ProGuard map
  upload isn't required yet. Becomes a coupled task with the
  `minifyEnabled true` flip (audit gap #4).

## Prerequisites (one-time)

1. `SENTRY_AUTH_TOKEN` must exist in your local keychain. Per memory:
   the canonical entry is `mb-sentry-auth-token`. The token needs
   `project:write` scope so it can upload debug files.
2. `npm ci` from the repo root so `@sentry/cli` lands in
   `node_modules/.bin/sentry-cli`. It's pulled in transitively by
   `@sentry/vite-plugin`, no extra dependency needed.
3. `ios/App/App.xcworkspace` open in Xcode. **Always the workspace**, not
   the `.xcodeproj` (per `CLAUDE.md` iOS notes).

## Wiring the Xcode Run Script phase

Done once per machine, not committed (Xcode project files are
deliberately not touched in this PR — adding the phase by hand keeps the
A7c audit's "no native config touched" boundary intact and lets us
revert the phase locally if Sentry has an outage without a code change).

1. **Xcode → select the `App` target → Build Phases tab.**
2. Click the **`+` (top-left of the phases list) → New Run Script Phase**.
3. Rename the new phase to **`Upload dSYMs to Sentry`** so it's
   recognisable in the phase list.
4. **Reorder** it to run **after** `Embed Frameworks` and after `[CP]
   Embed Pods Frameworks` — the dSYMs need to be on disk first.
5. Paste this into the script body:

   ```sh
   if [ "${CONFIGURATION}" = "Release" ]; then
     # Pull Sentry credentials from the macOS keychain so they never live
     # in the project file. The `security` calls are no-ops on CI runners
     # and the script itself will fail-loud if any of these end up empty.
     export SENTRY_AUTH_TOKEN="$(security find-generic-password -w -s mb-sentry-auth-token 2>/dev/null || true)"
     export SENTRY_ORG="chau-doan"
     export SENTRY_PROJECT="mercyblade-web"
     "${PROJECT_DIR}/../../scripts/upload-ios-dsyms.sh"
   else
     echo "[upload-ios-dsyms] skip — CONFIGURATION=${CONFIGURATION}"
   fi
   ```

   Path note: `${PROJECT_DIR}` inside an Xcode Run Script for this app
   resolves to `<repo>/ios/App/App`, so `../../scripts/...` lands at
   `<repo>/scripts/upload-ios-dsyms.sh`. If you move the script, update
   the path here.

6. **Uncheck** _"Based on dependency analysis"_ — Xcode tries to track
   inputs/outputs by file globs and dSYMs aren't in its graph; the warn
   stays cosmetic but cleaner to disable.
7. **Build Settings → Debug Information Format** for the Release
   configuration must be `DWARF with dSYM File`. Apple's App Store
   archive preset already sets this; verify and don't change Debug.

## What runs when

| Action                          | Triggers dSYM upload? |
| ------------------------------- | --------------------- |
| `xcodebuild -configuration Debug` | No — script exits 0 on non-Release |
| Run on simulator (Debug)        | No                    |
| Run on device (Debug)           | No                    |
| **Product → Archive (Release)** | **Yes**               |
| TestFlight upload from Organiser | Already uploaded by the phase above when the archive was created |

## How to verify it worked

1. Run **Product → Archive** in Xcode (or `xcodebuild archive`).
2. The Run Script phase output (Report Navigator → latest build →
   `Upload dSYMs to Sentry`) should show:
   ```
   [upload-ios-dsyms] uploading dSYMs from: /Users/.../App.xcarchive/dSYMs
   [upload-ios-dsyms] target: chau-doan/mercyblade-web
   ... (sentry-cli output)
   [upload-ios-dsyms] done.
   ```
3. Open **Sentry → Settings → Projects → mercyblade-web → Debug Files**.
   A new entry should appear within a few seconds matching your build's
   UUID. Look for `App.dSYM` and any embedded framework dSYMs.
4. Trigger the smoke-test route from PR #808 inside the TestFlight build:
   `https://mercyblade.com/__sentry-smoke-test?confirm=throw`
   (requires `VITE_SENTRY_SMOKE_TEST_ENABLED=true` in Vercel prod env).
5. In Sentry, find the `SENTRY_SOURCEMAP_SMOKE_TEST_v1` event. The
   `platform` tag should read `ios`. JS frames already resolve to
   `src/pages/SentrySmokeTest.tsx` (PR #808). Native iOS frames (if a
   crash gets surfaced via the bridge) should now resolve to
   `AppDelegate.swift:NN` instead of `0x...` — this is the audit gap #1
   verification.

## Manual one-off upload (no Xcode build)

If a dSYM bundle is sitting on disk from a previous archive and you just
want to push it:

```sh
export SENTRY_AUTH_TOKEN="$(security find-generic-password -w -s mb-sentry-auth-token)"
export SENTRY_ORG="chau-doan"
export SENTRY_PROJECT="mercyblade-web"
./scripts/upload-ios-dsyms.sh /path/to/App.xcarchive/dSYMs
```

The script accepts the dSYMs path as its first positional argument and
behaves the same as when called from the Xcode phase.

## Troubleshooting

- **`error: missing required env: SENTRY_AUTH_TOKEN`** — the keychain
  entry `mb-sentry-auth-token` is missing or the script lacks keychain
  access. Run the `security` command standalone and confirm it returns
  a token. On a fresh Mac you'll need to `security add-generic-password
  -s mb-sentry-auth-token -a "$(whoami)" -w "<token>"` once.
- **`error: sentry-cli not found at .../node_modules/.bin/sentry-cli`**
   — run `npm ci` from the repo root.
- **Upload succeeds but Sentry still shows raw addresses** — wait a
  minute; debug-file ingestion is async. If after 5 min frames still
  don't symbolicate, confirm the dSYM UUID matches the binary UUID via
  `dwarfdump --uuid /path/to/App.dSYM` and `dwarfdump --uuid App.app/App`.
- **Build fails with `dSYMs directory does not exist`** — the Run Script
  phase ran before the linker produced the dSYMs. Reorder it later in
  the Build Phases list.

## What this does NOT cover (open gaps from A7c)

- **Gap #2** — no one has yet hit the smoke-test route from a real device
  build. Do that once an iOS build with this Run Script phase ships;
  that's the actual proof native symbolication works end-to-end.
- **Gap #3** — `@sentry/capacitor` doesn't capture crashes that happen
  in the first few hundred milliseconds before the JS bridge initialises.
  Mitigation would be a manual `SentrySDK.start()` in `AppDelegate.swift`
  before the WebView mounts. Deferred until we see evidence of lost data.
- **Gap #4** — Android ProGuard map upload is a no-op today
  (`minifyEnabled false`) and becomes blocking only when the Play Store
  release flips minification on.
