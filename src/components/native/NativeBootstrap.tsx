// src/components/native/NativeBootstrap.tsx
//
// Cat-4 native shell — N4. One-shot native UX bootstrap: hide the splash
// screen, set the iOS status-bar style, and lock the Android keyboard
// resize mode.
//
// WHAT IT FIXES:
//   - Splash: capacitor.config.ts sets `SplashScreen.launchAutoHide:false`,
//     so the native splash stays up until *we* hide it. Without this
//     component the app would hang on the splash forever. Hiding it here —
//     after React has committed and painted — kills the cold-start blank
//     flash you'd otherwise get between an auto-hidden splash and first
//     web paint.
//   - Status bar (iOS): the app uses
//     UIViewControllerBasedStatusBarAppearance=true, so the bar style is a
//     runtime call, not an Info.plist constant. With a white splash + light
//     shell we want dark glyphs so the bar stays legible.
//   - Keyboard (Android): pin the resize mode so a focused input is pushed
//     above the IME instead of sitting behind it. (iOS resize is set
//     declaratively in capacitor.config.ts.)
//
// CONVENTION: same headless, single-owner, platform-gated pattern as
// AndroidBackButton (N1) / NativeDeepLinkListener (N2) — mounted once at
// the router root in main.tsx, renders nothing. The plugin packages are
// dynamically imported INSIDE the native branch so they never enter the
// web bundle or run on web (Capacitor's web shims are no-ops anyway, but
// not shipping them at all is cleaner). Every native call is wrapped so a
// missing/failed plugin can never break app boot — the core path survives
// optional failures.
//
// Pure src/ change. Requires `npx cap sync` after install so the three
// plugins register in the iOS/Android projects (manual step for Chau).
//
// Renders nothing.

import React from "react";

import { getPlatform, isNativePlatform } from "@/lib/platform";

const dev = import.meta.env.DEV;

export default function NativeBootstrap(): React.ReactElement {
  React.useEffect(() => {
    // Hard no-op on web (desktop browser, mobile Safari/Chrome, PWA).
    if (!isNativePlatform()) return;

    let cancelled = false;

    void (async () => {
      try {
        const [{ SplashScreen }, { StatusBar, Style }, { Keyboard, KeyboardResize }] =
          await Promise.all([
            import("@capacitor/splash-screen"),
            import("@capacitor/status-bar"),
            import("@capacitor/keyboard"),
          ]);

        if (cancelled) return;

        const platform = getPlatform();

        // iOS status bar — dark glyphs on the light shell/splash. Style.Light
        // means "light background" (i.e. dark content), per the plugin's
        // enum. No-op'd off iOS; wrapped so a failure can't block the hide.
        if (platform === "ios") {
          try {
            await StatusBar.setStyle({ style: Style.Light });
          } catch (err) {
            if (dev) console.warn("[NativeBootstrap] StatusBar.setStyle failed", err);
          }
        }

        // Android keyboard — keep focused inputs above the IME. iOS uses the
        // declarative `Keyboard.resize` from capacitor.config.ts; this is the
        // runtime parity call for Android.
        if (platform === "android") {
          try {
            await Keyboard.setResizeMode({ mode: KeyboardResize.Native });
          } catch (err) {
            if (dev) console.warn("[NativeBootstrap] Keyboard.setResizeMode failed", err);
          }
        }

        // Hide the splash LAST — after the style/keyboard calls and after
        // this effect (post first React commit + paint) so the shell is
        // already on screen when the splash lifts.
        try {
          await SplashScreen.hide();
        } catch (err) {
          if (dev) console.warn("[NativeBootstrap] SplashScreen.hide failed", err);
        }
      } catch (err) {
        // Plugins unavailable (sync not run, or a web path slipped through).
        // Never let native bootstrap break the app.
        if (dev) console.warn("[NativeBootstrap] native bootstrap skipped", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return <></>;
}
