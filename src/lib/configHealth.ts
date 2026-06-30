// src/lib/configHealth.ts
//
// Runs once on app startup (deferred boot work in main.tsx).
// Checks that external service configuration is present and not a
// placeholder value. Missing config is logged to console.warn in dev
// and, in production, forwarded through the gated captureMessage()
// wrapper so the admin dashboard's CRITICAL alert catches it. The
// wrapper is a no-op unless Sentry has already been route-gated on
// this session (see report() below) — so a config gap on a static
// legal/marketing page never itself pulls the @sentry/react SDK.

import { isVoiceConfigured } from "@/config/mercyVoices";
import { isSentryEnabled } from "@/lib/monitoring/sentryInit";
import { captureMessage } from "@/lib/monitoring/captureException";

interface ConfigCheck {
  name: string;
  key: string;
  present: boolean;
}

let didRun = false;

/**
 * Call ONCE during deferred boot. Reporting routes through the gated
 * captureMessage() wrapper, which only emits when Sentry is already
 * active for this session — it never imports the SDK itself.
 */
export async function runConfigHealthCheck(): Promise<ConfigCheck[]> {
  if (didRun) return [];
  didRun = true;

  const checks: ConfigCheck[] = [];
  const isDev = import.meta.env.DEV;

  // ── ElevenLabs ────────────────────────────────────────────────────
  const elevenLabsOk = isVoiceConfigured("en");
  checks.push({ name: "ElevenLabs", key: "ELEVENLABS_VOICE_ID", present: elevenLabsOk });
  if (!elevenLabsOk) report("ElevenLabs voice not configured (en)", isDev);

  // ── Supabase ──────────────────────────────────────────────────────
  const supaUrl = import.meta.env.VITE_SUPABASE_URL;
  const supaAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const supaOk = Boolean(supaUrl && supaUrl !== "placeholder" && supaAnon && supaAnon !== "placeholder");
  checks.push({ name: "Supabase", key: "VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY", present: supaOk });
  if (!supaUrl || supaUrl === "placeholder") report("Supabase URL not configured", isDev);
  if (!supaAnon || supaAnon === "placeholder") report("Supabase anon key not configured", isDev);

  // ── Stripe (optional — skip if not defined) ──────────────────────
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  if (stripeKey !== undefined && (!stripeKey || stripeKey === "placeholder")) {
    checks.push({ name: "Stripe", key: "VITE_STRIPE_PUBLISHABLE_KEY", present: false });
    report("Stripe publishable key not configured", isDev);
  }

  // ── RevenueCat (optional — skip if not defined) ──────────────────
  const rcKey = import.meta.env.VITE_REVENUECAT_APPLE_API_KEY;
  if (rcKey !== undefined && (!rcKey || rcKey === "placeholder")) {
    checks.push({ name: "RevenueCat", key: "VITE_REVENUECAT_APPLE_API_KEY", present: false });
    report("RevenueCat Apple API key not configured", isDev);
  }

  return checks;
}

function report(message: string, isDev: boolean) {
  if (isDev) {
    console.warn(`[configHealth] ${message}`);
    return;
  }

  // isSentryEnabled() guard is load-bearing. A raw `import("@sentry/react")`
  // here (the old implementation) pulled the ~470 KB SDK chunk on EVERY
  // production session that hit a config gap — including anonymous visits
  // to static legal/marketing pages that PR #720 deliberately keeps
  // Sentry-free. captureMessage() is the gated wrapper: it reads the
  // already-loaded module via getSentryModule() and is a no-op when Sentry
  // isn't active, so it never re-imports the SDK. Checking isSentryEnabled()
  // first keeps the intent explicit and the no-op path branch-cheap.
  if (isSentryEnabled()) captureMessage(`[config] ${message}`, "warning");
}
