// src/lib/configHealth.ts
//
// Runs once on app startup (called from main.tsx after Sentry init).
// Checks that external service configuration is present and not a
// placeholder value. Missing config is logged to console.warn in dev
// and sent to Sentry as a warning event in production so the admin
// dashboard's CRITICAL alert catches it.

import { isVoiceConfigured } from "@/config/mercyVoices";

interface ConfigCheck {
  name: string;
  key: string;
  present: boolean;
}

let didRun = false;

/**
 * Call ONCE after Sentry is initialized. Uses dynamic import to avoid
 * bundling Sentry's captureMessage in code paths where it isn't needed.
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
  const stripeKey = (import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY;
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

async function report(message: string, isDev: boolean) {
  if (isDev) {
    console.warn(`[configHealth] ${message}`);
    return;
  }

  try {
    // Dynamic import so @sentry/react doesn't bundle eagerly when
    // DSN is unset (the Sentry init already handles this, but this
    // double-guards the import path).
    const Sentry = await import("@sentry/react");
    Sentry.captureMessage(`[config] ${message}`, "warning");
  } catch {
    // Sentry not available — not a problem, the startup Sentry init
    // may have failed silently. console.warn still fires above in dev.
  }
}
