# Android ProGuard Sentry upload — scope + activation plan (A7e)

**Owner:** A7
**Date:** 2026-05-19
**Status:** scoping only — no native build config touched; nothing yet runnable
**Parent audit:** PR #816 (`reports/NATIVE-sentry-init-audit-A7c.md`), gap #4
**iOS counterpart already shipped:** PR #821 (`scripts/upload-ios-dsyms.sh` + `docs/IOS-DSYM-UPLOAD.md`)

## TL;DR

Gap #4 from A7c remains a no-op today because Android release builds have **`minifyEnabled false`** (verified in `android/app/build.gradle:39`). Stack traces are already readable. The moment we flip `minifyEnabled true` for the Play Store submission build — and we will, for APK size + obfuscation — Android crash symbols become unreadable in Sentry until a ProGuard mapping is uploaded for every build. This doc scopes the **single PR** that ships at that flip moment, plus a marked-`.draft` stub script so the work is already pre-staged.

## 1. Current state on `main`

### `android/app/build.gradle:37-43`

```gradle
buildTypes {
    release {
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        signingConfig signingConfigs.release
    }
}
```

- `minifyEnabled false` — R8 / ProGuard does not run, so no `mapping.txt` is produced.
- `proguardFiles` are configured but inert until minify flips on.
- Other relevant context from `build.gradle`: `namespace "com.mercyapps.mercyblade"`, `applicationId "com.mercyapps.mercyblade"`, `versionCode 12`, `versionName "1.0.2"`.

### `android/app/proguard-rules.pro`

Default Android Studio boilerplate. All rules commented out — no custom keep-rules, no WebView JS-interface preservation. Becomes meaningful only when minify flips on.

### `android/app/src/main/AndroidManifest.xml`

**Re-verified per brief:** zero Sentry references. No `<meta-data android:name="io.sentry.dsn" .../>`, no Sentry tags of any kind. The Sentry DSN flows from JS through `@sentry/capacitor`'s bridge to the Android native SDK at runtime — single source of truth (`import.meta.env.VITE_SENTRY_DSN`, fed from Vercel env). This is the correct pattern; do not add a hard-coded DSN to the manifest.

## 2. What changes when `minifyEnabled true` ships

Three things start happening on every `./gradlew bundleRelease`:

1. **R8 runs** — class/method/field names get obfuscated (`com.mercyapps.mercyblade.MainActivity` → `a.b.c`).
2. **`mapping.txt` is produced** at `android/app/build/outputs/mapping/release/mapping.txt`. This is the reverse map.
3. **Native Java/Kotlin stack traces in Sentry become unreadable** unless the matching `mapping.txt` has been uploaded for the corresponding `versionCode`. Each release ships a different mapping — uploading is per-build, not one-time.

Without the upload, every Sentry event under `featureArea:other` that originated in a native Capacitor plugin or a third-party Android library bubble-ups looks like `a.b.c$d.e(Unknown Source:0)`. Same severity as the pre-PR-#821 iOS state was.

## 3. Upload pipeline scope

### Confirmed pre-requisites (already in place — no new work needed)

- **`sentry-cli`** is bundled at `node_modules/.bin/sentry-cli` (version 2.58.5, transitive via `@sentry/vite-plugin`). Same binary already used by `scripts/upload-ios-dsyms.sh`. Supports `--type proguard` for Android mapping files — no Android-specific install needed.
- **Sentry org/project** stays `chau-doan/mercyblade-web` (consistent with web sourcemaps + iOS dSYMs — three platforms, one Sentry project; native vs web disambiguated by the `platform` tag set in `src/lib/monitoring/sentryInit.ts:233`).
- **Auth token** lives in the macOS keychain at `mb-sentry-auth-token` (per memory) — same secret used by the iOS pipeline.

### The actual sentry-cli call (committed in `scripts/upload-android-mapping.sh.draft` as a documented stub)

```sh
sentry-cli debug-files upload \
  --org "$SENTRY_ORG" \
  --project "$SENTRY_PROJECT" \
  --type proguard \
  android/app/build/outputs/mapping/release/mapping.txt
```

`--type proguard` is the canonical sentry-cli 2.x form for R8 / ProGuard mapping files. It associates the mapping with a UUID embedded in the build via a generated `META-INF/proguard/sentry-debug-meta.properties` file, which Sentry uses to match incoming crashes to the right mapping.

### Two pipeline shapes — pick at flip time

**(a) Bash script + manual / CI invocation** — exact mirror of the iOS pipeline. The dispatch PR renames `.draft` → `.sh`, marks executable, and adds either an Xcode-style "Run after Gradle assembleRelease" step or a `release` GitHub Actions workflow that runs after `./gradlew bundleRelease`. Pros: identical mental model to iOS; one script per platform. Cons: each release needs a manual `./scripts/upload-android-mapping.sh` invocation (or a CI step) — no automatic per-build upload.

**(b) Sentry Android Gradle plugin (`io.sentry.android.gradle`)** — recommended by Sentry for Android. Adding the plugin to `android/app/build.gradle` plus a one-time `sentry { ... }` block makes every release build automatically generate the debug-id, upload the mapping, and embed the UUID in the APK/AAB. Pros: zero manual steps per release, idempotent, handles native NDK symbols too. Cons: heavier build-time integration; if Sentry has an outage during build, the plugin fails the build by default (configurable). The `tryHardier` style of A7c's "core path survives optional failures" suggests we should configure the plugin to fail soft on upload errors.

**Recommendation for the dispatch PR:** start with (a) — bash script — because it mirrors the iOS workflow and Chau already operates that pattern. Migrate to (b) Gradle plugin in a follow-up after one or two real Play Store releases prove the script works. The Gradle plugin is a strict improvement but it's a separate change, not a coupled prerequisite.

## 4. The minify-flip checklist (the dispatch PR's actual work)

When the time comes to flip `minifyEnabled true`, the dispatch PR is approximately this:

1. **Edit `android/app/build.gradle:39`** — set `minifyEnabled true`.
2. **Confirm `proguardFiles` line is intact** (line 40 — keeps the default + custom rules).
3. **Audit `android/app/proguard-rules.pro`** — uncomment the WebView JS-interface keep rule (commented at lines 11–13 of the current file) because Capacitor's bridge uses `@JavascriptInterface`. Also add Capacitor-specific keep rules — Capacitor docs list these.
4. **Test on a Debug build with `minifyEnabled true` temporarily** before shipping to release — `./gradlew assembleDebug` with the flag flipped catches missing keep rules before they hit the Play Store. Common failure modes: reflection-based plugin calls fail at runtime; JSON deserialization breaks; native plugin method names get renamed.
5. **Rename `scripts/upload-android-mapping.sh.draft` → `.sh`** and `chmod +x`.
6. **Add a GitHub Actions workflow** (or document the manual command) so each Play Store release runs the upload — Mac-or-Linux-agnostic, the upload itself doesn't need a Mac.
7. **Document the new flow** in `docs/ANDROID-PROGUARD-UPLOAD.md` (the parallel of `docs/IOS-DSYM-UPLOAD.md`).
8. **Verify against the smoke-test route** (PR #808) — trigger from an Android Internal Testing build, confirm Sentry event arrives with `platform: android` and stack frames resolve to readable class/method names instead of `a.b.c$d.e`.
9. **Sentry organisation step (not in code):** confirm uploads land in the same `mercyblade-web` project. If we later want a separate `mercyblade-android` project (A7c gap #5), do that as its own dashboard task.

### What breaks if mapping upload fails

- **Crashes still report.** The Sentry SDK keeps capturing — only symbolication is broken.
- **`featureArea`, `priority`, all tags still apply** — the JS-side `enrichEventTags()` runs regardless.
- **Triage cost goes from minutes to hours.** A `a.b.c$d.e(Unknown Source:0)` frame is debuggable only by re-running R8 locally with the original mapping, or by build-version-correlating to a stored mapping. Painful but recoverable.
- **Recommended fallback:** stash every `mapping.txt` in object storage keyed by `versionCode` alongside the upload. If Sentry symbolication is missing, the file is still available for offline `proguard-retrace`. The dispatch PR should add this stash step (Vercel Blob or similar) — cheap insurance.

## 5. Dispatch size — confirming the audit's estimate

A7c estimated **one PR** for gap #4 the moment minify flips. Re-confirmed:

- Script rename + chmod + executability: ~5 lines
- `android/app/build.gradle` flip + proguard-rules.pro keep-rules audit: ~5–15 lines
- New `docs/ANDROID-PROGUARD-UPLOAD.md`: ~150 lines (mirror of `docs/IOS-DSYM-UPLOAD.md`)
- Optional CI workflow step: ~20 lines
- **Total: one self-contained PR**, estimated <250 lines diff. No `src/` touches. No iOS touches.

The Gradle-plugin migration (option b above) is a **second, follow-up PR** — strict improvement, not blocker.

## 6. What's pre-staged in this PR

| Artefact | State | When it activates |
| --- | --- | --- |
| `reports/NATIVE-android-proguard-scope-A7e.md` (this file) | committed | already-active reference |
| `scripts/upload-android-mapping.sh.draft` | committed, **inert** — `.draft` extension prevents accidental execution; `set -euo pipefail` + `exit 1` so any direct invocation fails loud | renamed → `.sh` + `chmod +x` in the dispatch PR |
| `android/app/build.gradle` `minifyEnabled` | **unchanged** — still `false` | flipped in the dispatch PR |
| `docs/ANDROID-PROGUARD-UPLOAD.md` | **not in this PR** | created in the dispatch PR |

## 7. Open questions for the dispatch PR

1. **Does the Play Store submission build use `bundleRelease` (.aab) or `assembleRelease` (.apk)?** Both produce the same `mapping.txt`, but the keep-rule audit (step 3) and the verify step (step 8) need to match the actual artefact. Likely `.aab` (Play Store requires App Bundle since Aug 2021).
2. **Will the minify flip ship with the Play Store submission**, or as a prerequisite PR a few weeks earlier? Chau's call. Earlier is safer (more time to catch reflection bugs).
3. **Sentry Android Gradle plugin migration timing** — bundle into the same PR or follow-up? Recommend follow-up per §3.

## References

- A7c parent audit: PR #816 (`reports/NATIVE-sentry-init-audit-A7c.md`)
- iOS counterpart (already shipped): PR #821 (`scripts/upload-ios-dsyms.sh`, `docs/IOS-DSYM-UPLOAD.md`)
- Current `minifyEnabled` line: `android/app/build.gradle:39`
- Current mapping output path (when minify on): `android/app/build/outputs/mapping/release/mapping.txt`
- sentry-cli 2.58.5 via `node_modules/.bin/sentry-cli` (transitive from `@sentry/vite-plugin`)
- Sentry credentials: keychain `mb-sentry-auth-token`, org `chau-doan`, project `mercyblade-web`
- Memory: `project_android_urls` — Android `applicationId com.mercyapps.mercyblade` (locked at Play publish, intentionally divergent from iOS bundle id)
