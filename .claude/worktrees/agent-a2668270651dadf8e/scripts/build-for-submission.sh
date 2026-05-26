#!/usr/bin/env bash
# scripts/build-for-submission.sh — one-command build for App Store / Play Store.
#
# Usage:
#   scripts/build-for-submission.sh ios       # IPA via xcodebuild
#   scripts/build-for-submission.sh android   # AAB via gradle
#   scripts/build-for-submission.sh both      # do both, sequentially
#
# Pre-flight checks (run for any target):
#   - npm run typecheck
#   - npm test
#   - npm run lint
#   - vite build (web bundle)
#   - npx cap sync (refreshes native projects)
#
# What it doesn't do (intentional):
#   - Sign the build. xcodebuild signs based on your already-configured Apple
#     Developer account; gradle signs from your local keystore. This script
#     does NOT touch credentials. Configure signing in Xcode / build.gradle.
#   - Upload anything. Final upload is a deliberate human action via Xcode
#     Organizer (iOS) or Play Console web UI (Android). Automating upload
#     hides too many sanity checks.
#
# Exit codes:
#   0 — build succeeded (artifact path printed at end)
#   1 — bad CLI usage
#   2 — pre-flight check failed (typecheck, tests, lint, build)
#   3 — native build failed (xcodebuild / gradle)

set -euo pipefail

TARGET="${1:-}"
if [[ "$TARGET" != "ios" && "$TARGET" != "android" && "$TARGET" != "both" ]]; then
  echo "Usage: $0 ios|android|both" >&2
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "[build] root=$ROOT_DIR  target=$TARGET"

run_preflight() {
  echo "[build] pre-flight: typecheck"
  npm run typecheck

  echo "[build] pre-flight: tests"
  npm test -- --run

  echo "[build] pre-flight: lint"
  npm run lint

  echo "[build] pre-flight: vite build"
  npm run build

  echo "[build] pre-flight: cap sync"
  npx cap sync
}

build_ios() {
  echo "[build] iOS — xcodebuild"
  local IOS_DIR="$ROOT_DIR/ios/App"
  if [[ ! -d "$IOS_DIR" ]]; then
    echo "[build] ios/App not found — is Capacitor iOS configured?" >&2
    exit 3
  fi

  cd "$IOS_DIR"
  local OUT_DIR="$ROOT_DIR/dist/submission/ios"
  mkdir -p "$OUT_DIR"

  xcodebuild \
    -workspace App.xcworkspace \
    -scheme App \
    -configuration Release \
    -archivePath "$OUT_DIR/App.xcarchive" \
    archive

  xcodebuild \
    -exportArchive \
    -archivePath "$OUT_DIR/App.xcarchive" \
    -exportPath "$OUT_DIR" \
    -exportOptionsPlist "$ROOT_DIR/scripts/exportOptions.plist"

  echo "[build] iOS done: $OUT_DIR/App.ipa"
  cd "$ROOT_DIR"
}

build_android() {
  echo "[build] Android — gradle bundleRelease"
  local AND_DIR="$ROOT_DIR/android"
  if [[ ! -d "$AND_DIR" ]]; then
    echo "[build] android/ not found — is Capacitor Android configured?" >&2
    exit 3
  fi

  cd "$AND_DIR"
  ./gradlew bundleRelease
  local AAB_PATH="$AND_DIR/app/build/outputs/bundle/release/app-release.aab"
  local OUT_DIR="$ROOT_DIR/dist/submission/android"
  mkdir -p "$OUT_DIR"
  cp "$AAB_PATH" "$OUT_DIR/app-release.aab"
  echo "[build] Android done: $OUT_DIR/app-release.aab"
  cd "$ROOT_DIR"
}

run_preflight

case "$TARGET" in
  ios) build_ios ;;
  android) build_android ;;
  both)
    build_ios
    build_android
    ;;
esac

echo "[build] OK"
