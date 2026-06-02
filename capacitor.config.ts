// Path: capacitor.config.ts

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.chaudoan.mercyblade',
  appName: 'Mercy Blade',
  webDir: 'dist',
  // Cat-4 N4 — native UX plugins (status-bar + splash-hide + keyboard).
  // Values are intentionally loose objects (not imported plugin enums) so
  // this file typechecks under bare `tsc --noEmit` without pulling the
  // plugin packages into the CLI/build type graph.
  plugins: {
    // launchAutoHide:false hands splash teardown to
    // src/components/native/NativeBootstrap.tsx, which calls
    // SplashScreen.hide() after React commits — no blank flash between
    // the native splash and first web paint. backgroundColor is a
    // TEMPORARY white; N5 swaps it to the brand navy hex once art ships.
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: '#ffffff',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: false,
      splashImmersive: false,
    },
    // Native resize keeps a focused input above the iOS keyboard instead
    // of letting the IME cover bottom-of-screen fields. NativeBootstrap
    // also sets the Android resize mode at runtime for parity.
    Keyboard: {
      resize: 'native',
    },
    // iOS uses UIViewControllerBasedStatusBarAppearance=true, so the bar
    // style is a runtime call (NativeBootstrap → StatusBar.setStyle).
    // overlaysWebView:false keeps web content below the bar so the status
    // bar stays visible and legible rather than drawing under it.
    StatusBar: {
      overlaysWebView: false,
      style: 'DEFAULT',
    },
    // On-device local notifications (daily reminder + evening streak-save +
    // due-review). smallIcon expects a monochrome Android drawable named
    // ic_stat_mercy (added in a later native cycle); iconColor is a placeholder
    // brand-navy hex. Native config (Info.plist / AndroidManifest / cap sync)
    // is deferred — this block is web-safe.
    LocalNotifications: {
      smallIcon: 'ic_stat_mercy',
      iconColor: '#0B1E3F',
    },
  },
};

export default config;
