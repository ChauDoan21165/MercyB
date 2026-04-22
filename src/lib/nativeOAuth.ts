/**
 * MercyBlade — Native OAuth helper for Capacitor (iOS + Android).
 *
 * Goal: keep OAuth sign-in IN-APP (SFSafariViewController / Chrome Custom Tabs)
 * so Apple App Review guideline 4.0 is satisfied. No jumps to external Safari.
 *
 * Flow:
 *   1. Call signInWithNativeOAuth({ provider }) from a user gesture.
 *   2. Supabase returns an authorization URL; we open it via @capacitor/browser.
 *   3. Supabase completes OAuth and redirects to our scheme:
 *        com.mercyapps.mercyblade://auth/callback#access_token=...&refresh_token=...
 *   4. iOS/Android delivers that URL to the Capacitor App plugin (appUrlOpen).
 *   5. handleDeepLink(url) parses tokens, calls supabase.auth.setSession(),
 *      closes the browser, returns the Session.
 *
 * CC3 (Sign-in-with-Apple track) can reuse handleDeepLink(url) unchanged —
 * the Apple flow emits the same fragment shape.
 *
 * Contract is stable:
 *   - handleDeepLink(url: string) => Promise<Session | null>
 *   - registerDeepLinkListener(onSession) => Promise<() => void>
 *   - signInWithNativeOAuth({ provider, returnTo? }) => Promise<void>
 */

import { App, type URLOpenListenerEvent } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import type { Provider, Session } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabaseClient";

const NATIVE_REDIRECT_URL = "com.mercyapps.mercyblade://auth/callback";
const NATIVE_SCHEME_PREFIX = "com.mercyapps.mercyblade://";

type SupportedProvider = Extract<Provider, "google" | "facebook" | "apple">;

export type NativeOAuthOptions = {
  provider: SupportedProvider;
  /** Optional in-app path to navigate to after auth completes. */
  returnTo?: string;
};

/**
 * Returns true when running inside the Capacitor native container (iOS/Android).
 * Web builds return false so the existing web OAuth path is preserved.
 */
export function isNativeAuthPlatform(): boolean {
  return Capacitor.isNativePlatform();
}

/**
 * Start a native OAuth sign-in. Opens SFSafariViewController (iOS) or
 * Chrome Custom Tabs (Android) in-app; does NOT redirect to external Safari.
 */
export async function signInWithNativeOAuth(
  opts: NativeOAuthOptions,
): Promise<void> {
  const { provider } = opts;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: NATIVE_REDIRECT_URL,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;
  if (!data?.url) throw new Error("Supabase returned no OAuth URL");

  await Browser.open({
    url: data.url,
    presentationStyle: "popover",
    windowName: "_self",
  });
}

/**
 * Parse an incoming deep-link URL and, if it carries auth tokens, hydrate the
 * Supabase session. Safe to call with unrelated URLs — returns null in that case.
 * Shared entry point for Google/Facebook (CC4) and Sign-in-with-Apple (CC3).
 */
export async function handleDeepLink(url: string): Promise<Session | null> {
  if (!url || !url.startsWith(NATIVE_SCHEME_PREFIX)) return null;

  const fragment = extractFragment(url);
  const query = extractQuery(url);
  const params = new URLSearchParams(fragment || query);

  const providerError = params.get("error_description") || params.get("error");
  if (providerError) {
    await safeCloseBrowser();
    throw new Error(decodeURIComponent(providerError));
  }

  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");

  if (!accessToken || !refreshToken) {
    return null;
  }

  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  await safeCloseBrowser();

  if (error) throw error;
  return data.session ?? null;
}

/**
 * Attach an appUrlOpen listener that forwards native deep links through
 * handleDeepLink and invokes onSession with the resulting Session (or null).
 * Returns an async unsubscribe function.
 */
export async function registerDeepLinkListener(
  onSession: (session: Session | null) => void,
): Promise<() => Promise<void>> {
  if (!isNativeAuthPlatform()) {
    return async () => {};
  }

  const handle = await App.addListener(
    "appUrlOpen",
    (event: URLOpenListenerEvent) => {
      void (async () => {
        try {
          const session = await handleDeepLink(event.url);
          if (session) onSession(session);
        } catch (err) {
          console.error("[nativeOAuth] deep-link handler failed:", err);
        }
      })();
    },
  );

  return async () => {
    await handle.remove();
  };
}

function extractFragment(url: string): string {
  const hashIdx = url.indexOf("#");
  return hashIdx === -1 ? "" : url.slice(hashIdx + 1);
}

function extractQuery(url: string): string {
  const qIdx = url.indexOf("?");
  if (qIdx === -1) return "";
  const hashIdx = url.indexOf("#", qIdx);
  return hashIdx === -1 ? url.slice(qIdx + 1) : url.slice(qIdx + 1, hashIdx);
}

async function safeCloseBrowser(): Promise<void> {
  try {
    await Browser.close();
  } catch {
    /* Browser may already be closed; ignore. */
  }
}
