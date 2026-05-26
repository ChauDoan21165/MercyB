# Icon regeneration (iOS + Android)

Runbook for regenerating MercyBlade app icons from a single 1024×1024 source when the brand changes.

Tooling: [`@capacitor/assets`](https://github.com/ionic-team/capacitor-assets) (dev dep). Writes directly to the native projects — no `cap sync` needed.

## Source requirements

One square PNG at `public/brand/app-icon-1024.png`:

- Exactly **1024×1024 px**
- **Opaque** (no alpha channel — Apple rejects transparent marketing icons)
- **No rounded corners** — iOS applies the mask itself; pre-rounded corners look doubly-rounded
- **No text too close to edges** — iOS crops ~10% on the rounded mask; Android adaptive icons crop even more (keep the mark inside a centered ~66% safe zone or the tool's auto-padding handles it)
- sRGB colorspace, 8-bit

If the source isn't 1024×1024 the tool errors out; re-export before retrying.

## Regenerate

From the repo root (inside the icons worktree, or main — same project layout):

```bash
# 1. Stage the source where the tool expects it
mkdir -p assets
cp public/brand/app-icon-1024.png assets/logo.png

# 2. Generate iOS + Android icons only (no splash, no PWA)
npx capacitor-assets generate \
  --ios \
  --android \
  --iconBackgroundColor '#FFFFFF' \
  --iconBackgroundColorDark '#111111'
```

Background-color flags control the Android adaptive-icon background layer and the iOS dark-appearance fallback. Pick whatever matches the brand — white is a safe default.

## What it writes

- `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png` (1024×1024 marketing icon — the only size modern Xcode needs)
- `ios/App/App/Assets.xcassets/AppIcon.appiconset/Contents.json`
- `android/app/src/main/res/mipmap-{m,h,xh,xxh,xxxh}dpi/ic_launcher*.png` (all density buckets, round + square variants)
- `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher{,_round}.xml` (adaptive icon manifests)
- `android/app/src/main/res/drawable*/` (adaptive icon foreground/background layers)

Splash screens are **not** regenerated because `assets/splash.png` isn't present — keep it that way unless you explicitly want splash regen too.

## Verify

```bash
# iOS — single file + Contents.json
ls -la ios/App/App/Assets.xcassets/AppIcon.appiconset/

# Android — highest-density bucket
ls -la android/app/src/main/res/mipmap-xxxhdpi/
```

Open `ios/App/App.xcworkspace` in Xcode → Assets → AppIcon → confirm the marketing 1024 slot shows the new brand. Build to a simulator and look at the home-screen icon.

For Android, open `android/` in Android Studio and look at `res/mipmap` previews, or build & run on an emulator.

## Commit

```bash
git add \
  assets/logo.png \
  ios/App/App/Assets.xcassets/AppIcon.appiconset/ \
  android/app/src/main/res/mipmap-*/ \
  android/app/src/main/res/drawable*/
git commit -m "fix(ios): replace placeholder icons with MercyBlade branding (Apple 2.3.8)"
```

`package.json` / `package-lock.json` changes from the `@capacitor/assets` install belong in a separate, earlier commit (already landed when the tool was first wired up).

## Troubleshooting

- **"Asset directory not found"** — `assets/` is missing. Run `mkdir -p assets` and drop `logo.png` there.
- **"Source image must be at least 1024×1024"** — re-export the source PNG at the required size.
- **Icon looks pixelated in the simulator** — delete the app from the simulator (home-screen long-press) and reinstall; iOS aggressively caches icons.
- **Xcode still shows the old icon** — Product → Clean Build Folder (⇧⌘K), then rebuild. `DerivedData` also caches icons.
- **Adaptive icon foreground is clipped on Android** — the logo is too close to the edge. Re-export with more padding, or switch to Custom Mode (`icon-foreground.png` + `icon-background.png`) for per-layer control.

## Switching to Custom Mode (for per-layer control)

If the default Easy Mode auto-padding looks wrong on Android, provide three files instead of one:

```
assets/
├── icon-only.png        # 1024×1024, iOS icon with its own background baked in
├── icon-foreground.png  # 1024×1024, transparent outside the mark (Android foreground layer)
└── icon-background.png  # 1024×1024, solid color or gradient (Android background layer)
```

Then rerun `npx capacitor-assets generate --ios --android` without the `--iconBackgroundColor` flags.
