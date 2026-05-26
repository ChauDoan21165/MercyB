# Native — Xcode Run Script phase wiring verify (A5i)

**Reviewer:** A5i (read-only verify)
**Worktree:** `/private/tmp/A5i-xcode-runscript-verify` off `origin/main` @ `29cb0d934`
**Date:** 2026-05-19
**Trigger:** A5h (PR #858) flagged that `scripts/upload-ios-dsyms.sh` is on main but the Xcode Run Script Build Phase that invokes it is a separate step. This PR resolves that ambiguity by reading `project.pbxproj` directly.

---

## Headline verdict

```
╔══════════════════════════════════════════════════════════════╗
║  NOT-WIRED — but by design                                   ║
║                                                              ║
║  project.pbxproj has zero references to upload-ios-dsyms,    ║
║  sentry-cli, or any dSYM-related Run Script phase. The docs  ║
║  explicitly state this is intentional: Xcode project files   ║
║  are deliberately untouched by PR #821, with Chau adding the ║
║  phase by hand once per machine.                             ║
╚══════════════════════════════════════════════════════════════╝
```

**Operational implication:** if Chau hasn't manually added the Run Script phase on the current Mac, the next Archive will produce un-symbolicated iOS Sentry crashes. The wiring is a 60-second one-time Xcode UI task — paste below.

---

## 1. Evidence — every `PBXShellScriptBuildPhase` in the project today

`grep -nE "shellScript|upload-ios-dsyms|sentry-cli|PBXShellScriptBuildPhase|dSYM" ios/App/App.xcodeproj/project.pbxproj`:

```
174:/* Begin PBXShellScriptBuildPhase section */
176:			isa = PBXShellScriptBuildPhase;
190:			shellScript = "diff \"${PODS_PODFILE_DIR_PATH}/Podfile.lock\" \"${PODS_ROOT}/Manifest.lock\" > /dev/null\nif [ $? != 0 ] ; then\n    # print error to STDERR\n    echo \"error: The sandbox is not in sync with the Podfile.lock. Run 'pod install' or update your CocoaPods installation.\" >&2\n    exit 1\nfi\n# This output is used by Xcode 'outputs' to avoid re-running this script phase.\necho \"SUCCESS\" > \"${SCRIPT_OUTPUT_FILE_0}\"\n";
194:			isa = PBXShellScriptBuildPhase;
205:			shellScript = "\"${PODS_ROOT}/Target Support Files/Pods-App/Pods-App-frameworks.sh\"\n";
208:/* End PBXShellScriptBuildPhase section */
```

Two phases total, both CocoaPods boilerplate:

1. **Line 176-190** — `[CP] Check Pods Manifest.lock`. Diffs `Podfile.lock` against the sandbox `Manifest.lock`. Standard CocoaPods sanity check.
2. **Line 194-205** — `[CP] Embed Pods Frameworks`. Invokes `Pods-App-frameworks.sh` to copy framework binaries into the app bundle. Standard CocoaPods framework embed.

**No third phase** — no `Upload dSYMs to Sentry`, no `sentry-cli upload-dif`, no reference to `upload-ios-dsyms.sh`. **Confirmed NOT-WIRED.**

---

## 2. NOT-WIRED is the intended state per the docs

`docs/IOS-DSYM-UPLOAD.md` line 41-45 spells this out:

> Done once per machine, not committed (Xcode project files are deliberately not touched in this PR — adding the phase by hand keeps the A7c audit's "no native config touched" boundary intact and lets us revert the phase locally if Sentry has an outage without a code change).

The reasoning, in plain terms:

- **Audit boundary:** PR #821 / #816 deliberately avoided touching `project.pbxproj` so the dSYM-upload change couldn't accidentally break any other Xcode setting.
- **Outage resilience:** if `sentry-cli` upload starts failing in a Sentry outage, removing the local Run Script unblocks Archives without a code revert.

**Verdict on the design choice:** defensible but has an obvious cost — every machine that builds for Archive needs the manual step or that build's crashes are unsymbolicated. For a solo-founder repo with one build machine, the cost is concentrated; for a team, it would balloon. **A5i does not recommend changing this — but the manual step must be in the pre-Archive checklist.**

---

## 3. Exact wiring text Chau pastes in Xcode

From `docs/IOS-DSYM-UPLOAD.md` §"Wiring the Xcode Run Script phase", reproduced verbatim so this report is self-contained:

### Where in Xcode

1. Open `ios/App/App.xcworkspace` (always the workspace, not the `.xcodeproj`).
2. Select the **`App` target** in the left sidebar.
3. Switch to the **Build Phases** tab (top of the editor pane).
4. Click the **`+`** in the top-left of the phases list → **New Run Script Phase**.
5. **Rename** the new phase to **`Upload dSYMs to Sentry`** (double-click the title).
6. **Drag the phase** to run **after** `[CP] Embed Pods Frameworks` — dSYMs must be on disk first.
7. **Uncheck** _"Based on dependency analysis"_ (input/output globs don't model dSYMs cleanly; suppresses cosmetic warnings).

### What to paste into the script body

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

### Prerequisite — one-time Mac setup (if not already done)

```sh
# Add the Sentry token to the keychain. Get the token from
# Sentry → Settings → Auth Tokens → New (scope: project:write).
security add-generic-password \
  -s mb-sentry-auth-token \
  -a "$(whoami)" \
  -w "<paste-token-here>"
```

Per memory `project_sentry_infra_access`: token already in keychain as `mb-sentry-auth-token`. If `security find-generic-password -s mb-sentry-auth-token` returns a value, the keychain step is already done.

### One more Build Setting to confirm

**Build Settings → Debug Information Format** for the **Release** configuration must be `DWARF with dSYM File`. Apple's App Store archive preset sets this by default, but worth confirming — without it, no dSYMs exist for the script to upload.

---

## 4. How Chau verifies it worked (after the manual wiring + an Archive)

1. **Product → Archive** in Xcode (or `xcodebuild archive`).
2. In Xcode's **Report Navigator → latest build → `Upload dSYMs to Sentry`**, expect to see:
   ```
   [upload-ios-dsyms] uploading dSYMs from: /Users/.../App.xcarchive/dSYMs
   [upload-ios-dsyms] target: chau-doan/mercyblade-web
   ... (sentry-cli output)
   [upload-ios-dsyms] done.
   ```
3. **Sentry → Settings → Projects → mercyblade-web → Debug Files** should show a fresh entry matching the build's UUID within seconds.
4. Optionally trigger the smoke-test route from PR #808 inside the TestFlight build: `https://mercyblade.com/__sentry-smoke-test?confirm=throw` (requires `VITE_SENTRY_SMOKE_TEST_ENABLED=true` in Vercel prod env). Native iOS frames should now resolve to `AppDelegate.swift:NN` instead of `0x...`.

---

## 5. Fallback — if Chau forgets the manual step before Archive

The Archive will succeed (no build failure — the script isn't invoked, so it can't fail). But Sentry will receive raw memory addresses for any iOS crash in that build.

**Recovery:** post-Archive, the dSYMs live at `~/Library/Developer/Xcode/Archives/<date>/<archive-name>.xcarchive/dSYMs/`. Push them manually:

```sh
export SENTRY_AUTH_TOKEN="$(security find-generic-password -w -s mb-sentry-auth-token)"
export SENTRY_ORG="chau-doan"
export SENTRY_PROJECT="mercyblade-web"
./scripts/upload-ios-dsyms.sh ~/Library/Developer/Xcode/Archives/<date>/<archive>.xcarchive/dSYMs
```

The script accepts the dSYMs path as `$1` (per its header comment). Same outcome as the Run Script phase, just lagged behind the Archive instead of synchronous.

---

## 6. Recommendation

**Do NOT commit the Run Script phase to `project.pbxproj`** in a code PR — that would override the deliberate design from #821 and remove the outage-resilience that motivated keeping it local. If a future operator-count or CI build expansion makes the manual step too brittle, revisit at that point with a deliberate design change (e.g., a Fastlane lane that adds and removes the phase around an Archive).

**Do** add the manual wiring to Chau's pre-Archive checklist:

```diff
  Pre-Archive checklist (A5d / A5h / A5i):
  - [ ] git pull --ff-only on main
  - [ ] npm ci --legacy-peer-deps
  - [ ] npm run build
  - [ ] npx cap sync ios
+ - [ ] Xcode → App target → Build Phases → confirm "Upload dSYMs to
+       Sentry" Run Script exists (add per docs/IOS-DSYM-UPLOAD.md if not)
  - [ ] Confirm Build = 17 (PR #852)
  - [ ] Product → Archive
  - [ ] Distribute App → App Store Connect → Upload
```

Or — pragmatically — Chau adds the phase **once** on the current Mac and never thinks about it again, since the phase persists in the local pbxproj (just not pushed to git). The only re-add is needed if Xcode is reset, the project is opened on a different Mac, or Xcode upgrades wipe the phase.

---

## 7. One-line summary

`scripts/upload-ios-dsyms.sh` ships in the repo but the Xcode Run Script phase that invokes it does not — by design per PR #821's audit boundary. Chau adds the phase once per machine using the verbatim script body above; verify before the next Archive so the first symbolicated iOS Sentry crash arrives with `AppDelegate.swift:NN` instead of `0x100abcdef`.
