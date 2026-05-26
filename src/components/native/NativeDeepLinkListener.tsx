// src/components/native/NativeDeepLinkListener.tsx
//
// Cat-4 native shell — M2. App-level native deep-link / OAuth-callback
// listener.
//
// THE BUG IT FIXES: registerDeepLinkListener was invoked ONLY inside
// LoginPage's useEffect. A native OAuth callback (Google/Facebook/Apple
// via signInWithNativeOAuth — also started from ConvertAccount) that
// resolved while the user was NOT on /login delivered `appUrlOpen` to
// no listener, so handleDeepLink never ran, the session was never set,
// and sign-in silently failed.
//
// THE FIX: register exactly ONE listener at the router root (same
// headless pattern as AndroidBackButton). handleDeepLink() already calls
// supabase.auth.setSession() / exchangeCodeForSession(), which every
// auth consumer observes through supabase.auth.onAuthStateChange —
// including AuthProvider, LoginPage's own session subscription (which
// then runs routeAfterAuth, preserving ?returnTo), and ConvertAccount's
// post-auth navigation. So once the session is established globally,
// existing per-screen routing handles navigation exactly as before;
// this component intentionally adds NO new routing behavior (smallest
// safe change). LoginPage's now-redundant listener is removed so the
// single-use PKCE code is not exchanged twice.
//
// Pure src/ change — @capacitor/app is already installed and wired in
// both native projects. registerDeepLinkListener no-ops off native.
//
// Renders nothing.

import React from "react";

import { registerDeepLinkListener } from "@/lib/nativeOAuth";

export default function NativeDeepLinkListener(): React.ReactElement {
  React.useEffect(() => {
    let unsubscribe: (() => Promise<void>) | null = null;
    let cancelled = false;

    void (async () => {
      try {
        const off = await registerDeepLinkListener((session) => {
          // handleDeepLink has already called setSession/exchangeCode;
          // the global supabase auth-state change drives AuthProvider and
          // every screen's own auth subscription. Nothing to route here.
          if (session && import.meta.env.DEV) {
            console.info("[NativeDeepLinkListener] session established via deep link");
          }
        });
        if (cancelled) {
          void off();
          return;
        }
        unsubscribe = off;
      } catch (err) {
        console.error("[NativeDeepLinkListener] registration failed:", err);
      }
    })();

    return () => {
      cancelled = true;
      if (unsubscribe) void unsubscribe();
    };
  }, []);

  return <></>;
}
