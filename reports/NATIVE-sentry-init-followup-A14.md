# Native Sentry init — A14 follow-up audit

**Reviewer:** A14 (read-only)
**Worktree:** `/private/tmp/A14-native-sentry` off `origin/main` @ `10f0b1533`
**Date:** 2026-05-19 / late session
**Trigger:** A14 ship dispatch after PR #885 (web slow-query observability) — close the native-Sentry follow-up loop per STRATEGY §6.

---

## TL;DR

```
╔══════════════════════════════════════════════════════════════╗
║ 📋  NATIVE SENTRY TRACK — CODE WORK CLOSED ✅                ║
║      Remaining items: Chau-operator manual tasks only        ║
╚══════════════════════════════════════════════════════════════╝
```

A7c's audit (PR #816, merged 22:03 UTC) already covered everything the A14 dispatch asks for. PR #821 then shipped the one code follow-up A7c flagged (iOS dSYM upload). PR #863 (A5i) verified the Xcode Run Script phase is **intentionally** not committed to `project.pbxproj` per #821's design rationale. This A14 follow-up confirms A7c's findings still hold on current `main`, ties off the deltas, and declares the track closed for engineering work.

---

## 1. A7c findings re-verified on current `main`

Every claim from `reports/NATIVE-sentry-init-audit-A7c.md` was spot-checked on `origin/main @ 10f0b1533`:

| A7c claim | Spot-check result |
|---|---|
| JS fork (`Capacitor.isNativePlatform()` branch in `sentryInit.ts`) intact | ✅ confirmed at lines 200-256 — verbatim with A7c's description |
| iOS `Podfile.lock`: `Sentry 9.8.0` + `SentryCapacitor 4.0.0` | ✅ identical today |
| `AppDelegate.swift` has no `SentrySDK.start(...)` (intentional for `@sentry/capacitor`) | ✅ zero hits for `Sentry` symbol in `AppDelegate.swift` |
| `AndroidManifest.xml` has zero Sentry references (correct for the Capacitor bridge) | ✅ zero hits |
| `android/app/build.gradle` release config: `minifyEnabled false` | ✅ confirmed line 38 |
| Web sourcemap upload in `production-deploy.yml` via `@sentry/vite-plugin` | ✅ confirmed at lines 32 / 73 |

**No drift since A7c.** A7c is the source-of-truth deep audit; this PR cites it and does not duplicate the content.

---

## 2. Deltas since A7c (what changed in the 8 hours between A7c and A14)

A7c was 2026-05-19 mid-session. Two PRs landed after that targeted A7c's gap list:

### **#821** — `feat(native): iOS dSYM upload script + Xcode Run Script docs (Sentry gap #1)` · merged 22:28 UTC

Closes **A7c gap #1** ("iOS dSYM upload to Sentry has zero pipeline").

| File | Status on main today |
|---|---|
| `scripts/upload-ios-dsyms.sh` | ✅ present, executable, 4,546 B (wraps `sentry-cli debug-files upload`, Release-only) |
| `docs/IOS-DSYM-UPLOAD.md` | ✅ present, 7,967 B (operator wiring guide with verbatim Xcode steps) |
| `ios/App/App.xcodeproj/project.pbxproj` Run Script phase | ❌ **intentionally absent** per #821's design |

The design rationale (`docs/IOS-DSYM-UPLOAD.md:41-45`):

> Done once per machine, not committed (Xcode project files are deliberately not touched in this PR — adding the phase by hand keeps the A7c audit's "no native config touched" boundary intact and lets us revert the phase locally if Sentry has an outage without a code change).

This is the only nuance worth re-flagging for A14: the dSYM upload script ships in the repo, but the Xcode Build Phase that invokes it is a **one-time-per-machine manual Xcode UI step**. If forgotten before an Archive, the build still succeeds but iOS Sentry crashes arrive as raw memory addresses. Fallback: post-Archive manual upload via `./scripts/upload-ios-dsyms.sh <archive.xcarchive/dSYMs>` (also documented).

### **#863** — `docs(native): verify Xcode dSYM Run Script phase wiring (A5i)` · merged 00:51 UTC

Confirms the above design choice via direct `project.pbxproj` inspection:

```
2 × PBXShellScriptBuildPhase entries — both standard CocoaPods boilerplate
0 × references to upload-ios-dsyms / sentry-cli / dSYM
```

Verdict from A5i: **NOT-WIRED but by design.** The pre-Archive checklist (A5d / A5h / A5i) carries the manual step.

---

## 3. A7c's 5 gaps — current status

| # | A7c gap | Current status |
|---|---|---|
| **1** | iOS dSYM upload to Sentry — zero pipeline | ✅ **CLOSED** by #821 (script + docs); manual Xcode wire-up by Chau, fallback documented |
| **2** | No device-build verification of init / crash flow | ⏳ **Pending Chau** — captured in A5d/A5h pre-Archive checklist; not engineering work |
| **3** | Pre-bridge native init window (first ~100ms) | ⏳ **Deferred per A7c** — no evidence of lost data; revisit only if a real incident appears |
| **4** | Android ProGuard map upload not wired | ⏳ **Deferred per A7c** — `minifyEnabled false` keeps this a no-op until the Play minify flip; coupled item |
| **5** | Sentry project naming (`mercyblade-web` covers native too) | ⏳ **Cosmetic** — no code change needed; Sentry-dashboard task only if separate triage queues are wanted |

**Engineering work remaining: zero.** All five items are either closed (#1), pending Chau-operator action (#2), deferred until evidence (#3, #4), or cosmetic dashboard config (#5).

---

## 4. Dispatch premise check — honest correction

The A14 dispatch framed this track as substantively open:

> "Real remaining follow-up: native Sentry init iOS/Android"
> "implement what's missing"
> "Phase 2 — Fix the critical gaps (separate PRs)"

That framing was correct **before** PR #821 landed (~5 hours before this dispatch). After #821, the engineering surface for native Sentry is empty. The dispatch's Phase-2 hypothetical fix PRs (dSYM upload, native init, ProGuard) all either already shipped or are explicitly deferred per A7c.

If A14 had taken the dispatch literally and opened "PR-A: wire @sentry/capacitor in iOS + Android," it would have duplicated PR #271. If it had taken "PR-B: Xcode build phase script + CI auth token," it would have duplicated PR #821. **A14 is declining to open redundant code PRs and is reporting the track CLOSED for engineering work instead** — exactly the dispatch's "If native Sentry is already wired correctly: report that, no fix PR needed, mark this track CLOSED" branch.

---

## 5. What A14 owns going forward

Nothing. Native Sentry is wired, the gap list from the canonical audit (A7c) is either closed or deferred per documented rationale, and the remaining items are pre-Archive checklist work that belongs to Chau as operator.

If the deferred items reactivate later — Android minify flip, pre-bridge crash incident, native project split — they should be dispatched fresh with that evidence as context. A14 will not pre-emptively open PRs against deferred items.

---

## 6. Recommendation

- **Mark the native-Sentry track CLOSED** for engineering work in the session log.
- Keep the deferred items (#3, #4, #5) listed under STRATEGY §6 "future work" not "active backlog."
- When Chau next runs `Product → Archive` from Xcode, follow the A5d/A5h/A5i pre-Archive checklist — specifically: confirm the `Upload dSYMs to Sentry` Run Script phase exists in Build Phases. If absent, paste the script body from `docs/IOS-DSYM-UPLOAD.md` §"Wiring the Xcode Run Script phase." One-time-per-Mac.

---

## References

- A7c canonical audit: `reports/NATIVE-sentry-init-audit-A7c.md` (PR #816)
- iOS dSYM script + docs: `scripts/upload-ios-dsyms.sh`, `docs/IOS-DSYM-UPLOAD.md` (PR #821)
- Xcode Run Script wiring verification: `reports/NATIVE-xcode-runscript-verify-A5i.md` (PR #863)
- Pre-Archive checklist context: `reports/NATIVE-cap-sync-audit-A5d.md`, `reports/NATIVE-submission-blockers-verify-A5h.md`
- JS fork bug fix: PR #271 (`src/lib/monitoring/sentryInit.ts:200-256`)
- Web Sentry route-gate: PR #720 (`src/lib/monitoring/sentryActivation.ts`)
- Web Sentry full gate: PR #740
- Sourcemap smoke-test route: PR #808 (`/__sentry-smoke-test`)
