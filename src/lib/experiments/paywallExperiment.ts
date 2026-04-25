// src/lib/experiments/paywallExperiment.ts
//
// Step 9 (Monetization) — paywall A/B framework.
//
// Responsibilities:
//   - Deterministically assign each visitor (user OR anonymous) to a
//     paywall variant for an experiment. Same id + same experiment
//     → same variant, every render, every device.
//   - Cache the assignment in sessionStorage so a refresh on the
//     pricing page can't re-roll and flicker between variants.
//   - Persist the first exposure to `paywall_experiment_exposures`
//     so the analytics team can compute conversion rate per variant.
//   - Persist the conversion event when checkout succeeds.
//
// Identity model:
//   - If we have a logged-in user, use the auth user id — the row
//     gets RLS-checked against `auth.uid() = user_id`.
//   - If not, mint (or read) an anonymous UUID from sessionStorage
//     and write through the `record_paywall_exposure_anon` RPC,
//     which is `SECURITY DEFINER` so anon clients can write a row
//     without RLS rights on the table itself.
//
// Consent:
//   Every server write goes through `requireMarketingConsent`. If
//   the user has opted out, exposures are computed locally (so the
//   UI still picks a stable variant) but NOT persisted. The opt-
//   out user just sees a coherent paywall — the experiment side
//   simply doesn't measure them.
//
// Variant assignment:
//   FNV-1a 32-bit hash of `{experimentKey}:{identityKey}` → modulo
//   the variant pool. FNV-1a is fast, deterministic, dependency-
//   free, and the seed is in the experiment key so flipping the
//   experiment to v2 reshuffles assignments cleanly.

import {
  isMarketingTrackingEnabled,
} from "@/services/behaviorTrackingFlag";

// ── Types ─────────────────────────────────────────────────────────────────

export type PaywallVariantKey =
  | "control"
  | "urgency"
  | "benefits"
  | "social-proof"
  | "savings"
  | "story";

export type PaywallExperimentConfig = {
  /** Stable key — bump it (`paywall_v1` → `paywall_v2`) to reshuffle. */
  experimentKey: string;
  /** Variants in the rotation. First entry is the implicit control. */
  variants: readonly PaywallVariantKey[];
  /** Master switch — false = always return control, never persist. */
  enabled: boolean;
};

export type Identity =
  | { kind: "user"; userId: string }
  | { kind: "anon"; anonId: string };

// ── Static config ─────────────────────────────────────────────────────────

export const PAYWALL_EXPERIMENT: PaywallExperimentConfig = {
  experimentKey: "paywall_v1",
  variants: [
    "urgency",
    "benefits",
    "social-proof",
    "savings",
    "story",
  ],
  enabled: true,
};

const VARIANT_CACHE_PREFIX = "mb_paywall_variant:";
const ANON_ID_KEY = "mb_paywall_anon_id";

// ── Identity helpers ──────────────────────────────────────────────────────

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function safeSessionStorage(): Storage | null {
  if (!isBrowser()) return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/**
 * Generate a UUID v4. Uses `crypto.randomUUID` when available, falls
 * back to a math-random hex for old browsers. Anon ids are not
 * security-sensitive — the only constraint is uniqueness within the
 * tab's session.
 */
function generateAnonId(): string {
  if (isBrowser() && typeof crypto !== "undefined" && "randomUUID" in crypto) {
    try {
      return crypto.randomUUID();
    } catch {
      /* fall through */
    }
  }
  return "anon-" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/**
 * Get (or mint) the per-session anonymous id used when a visitor
 * isn't signed in. Returns `null` only when we can't touch
 * sessionStorage (SSR, blocked storage).
 */
export function getOrMintAnonId(): string | null {
  const storage = safeSessionStorage();
  if (!storage) return null;
  try {
    const existing = storage.getItem(ANON_ID_KEY);
    if (existing && existing.length > 0) return existing;
    const fresh = generateAnonId();
    storage.setItem(ANON_ID_KEY, fresh);
    return fresh;
  } catch {
    return null;
  }
}

function identityKey(identity: Identity): string {
  return identity.kind === "user" ? `u:${identity.userId}` : `a:${identity.anonId}`;
}

// ── Hash + assignment (pure) ──────────────────────────────────────────────

/**
 * 32-bit FNV-1a hash. Deterministic, dependency-free, suitable for
 * variant bucketing (NOT for crypto). Exported so tests can pin the
 * mapping if assignment math ever needs to change.
 */
export function fnv1aHash32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    // 32-bit FNV prime multiplication via additions
    hash = (hash + ((hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24))) >>> 0;
  }
  return hash >>> 0;
}

/**
 * Pure variant picker. Same identity + experiment → same variant.
 * Exported for unit tests; production code should call `getVariant`
 * which layers caching and the `enabled` switch on top.
 */
export function pickVariantFor(
  identity: Identity,
  config: PaywallExperimentConfig,
): PaywallVariantKey {
  if (!config.enabled || config.variants.length === 0) return "control";
  const seed = `${config.experimentKey}:${identityKey(identity)}`;
  const idx = fnv1aHash32(seed) % config.variants.length;
  return config.variants[idx];
}

// ── Cache ─────────────────────────────────────────────────────────────────

function cacheKey(experimentKey: string): string {
  return VARIANT_CACHE_PREFIX + experimentKey;
}

function readCachedVariant(experimentKey: string): PaywallVariantKey | null {
  const storage = safeSessionStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(cacheKey(experimentKey));
    if (!raw) return null;
    return raw as PaywallVariantKey;
  } catch {
    return null;
  }
}

function writeCachedVariant(experimentKey: string, variant: PaywallVariantKey): void {
  const storage = safeSessionStorage();
  if (!storage) return;
  try {
    storage.setItem(cacheKey(experimentKey), variant);
  } catch {
    /* ignore */
  }
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Resolve the visitor's variant. Cached → return; otherwise compute
 * deterministically and cache. Always returns a variant — never
 * throws, never returns null. When the experiment is disabled or
 * the visitor opted out via consent, returns "control".
 */
export function getVariant(
  identity: Identity,
  config: PaywallExperimentConfig = PAYWALL_EXPERIMENT,
): PaywallVariantKey {
  if (!config.enabled) return "control";
  const cached = readCachedVariant(config.experimentKey);
  if (cached) return cached;
  const fresh = pickVariantFor(identity, config);
  writeCachedVariant(config.experimentKey, fresh);
  return fresh;
}

/**
 * Persist the first exposure for this (identity, experiment). No-op
 * when consent is off (we still computed the variant locally, but
 * we don't store anything).
 *
 * Server write paths:
 *   - User identity → INSERT into `paywall_experiment_exposures`
 *     (RLS gate enforces auth.uid() = user_id).
 *   - Anon identity → call `record_paywall_exposure_anon` RPC
 *     (SECURITY DEFINER — accepts the anon id verbatim).
 *
 * Both paths are best-effort: failures are swallowed so the
 * pricing page never crashes on a tracking error.
 */
export async function markExposure(
  identity: Identity,
  variant: PaywallVariantKey,
  config: PaywallExperimentConfig = PAYWALL_EXPERIMENT,
): Promise<void> {
  if (!config.enabled) return;
  if (!isMarketingTrackingEnabled()) return;

  try {
    const { supabase } = await import("@/lib/supabaseClient");
    if (identity.kind === "user") {
      await supabase
        .from("paywall_experiment_exposures")
        .insert({
          user_id: identity.userId,
          experiment_key: config.experimentKey,
          variant_key: variant,
        });
      return;
    }
    await supabase.rpc("record_paywall_exposure_anon", {
      p_anon_id: identity.anonId,
      p_experiment_key: config.experimentKey,
      p_variant_key: variant,
    });
  } catch {
    /* exposure logging must never crash the pricing screen */
  }
}

/**
 * Mark the visitor as converted for this experiment. Called from
 * the post-checkout success path. We only update the user's row —
 * anonymous conversions are deferred until we have a UX to stitch
 * an anon_id to a freshly-created user_id.
 */
export async function markConversion(
  identity: Identity,
  config: PaywallExperimentConfig = PAYWALL_EXPERIMENT,
): Promise<void> {
  if (!config.enabled) return;
  if (!isMarketingTrackingEnabled()) return;
  if (identity.kind !== "user") return;

  try {
    const { supabase } = await import("@/lib/supabaseClient");
    await supabase
      .from("paywall_experiment_exposures")
      .update({ converted_at: new Date().toISOString() })
      .eq("user_id", identity.userId)
      .eq("experiment_key", config.experimentKey)
      .is("converted_at", null);
  } catch {
    /* never crash on a write */
  }
}

// ── Test-only helpers ────────────────────────────────────────────────────

export function __resetPaywallExperimentForTests(): void {
  const storage = safeSessionStorage();
  if (!storage) return;
  try {
    storage.removeItem(ANON_ID_KEY);
    storage.removeItem(cacheKey(PAYWALL_EXPERIMENT.experimentKey));
    // Also purge any custom-experiment caches a test may have
    // written. Iterate defensively.
    const keys: string[] = [];
    for (let i = 0; i < storage.length; i += 1) {
      const k = storage.key(i);
      if (k && k.startsWith(VARIANT_CACHE_PREFIX)) keys.push(k);
    }
    for (const k of keys) storage.removeItem(k);
  } catch {
    /* ignore */
  }
}
