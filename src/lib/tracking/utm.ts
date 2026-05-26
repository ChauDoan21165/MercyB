// src/lib/tracking/utm.ts
//
// UTM parameter capture for marketing attribution.
//
// Flow: a campaign URL like
//   https://mercyblade.com/?utm_source=facebook&utm_campaign=spring2026
// arrives, we parse the params, and store them in `sessionStorage` on
// FIRST TOUCH only. On signup we merge them into the user's metadata
// so the marketing team can answer "which channel did this learner
// come from?" without a tracking pixel.
//
// Why first-touch (not last-touch): if the user clicks an ad, browses
// a few pages internally, then signs up, we want the original ad
// attribution — not whatever utm_* leaked into a later URL. The
// session-storage write guards against overwrites within the same
// session.
//
// Why sessionStorage (not localStorage): UTM is meant to capture the
// *visit*, not the *device*. A user who comes back next week through
// a different channel should attribute to the new channel. We also
// avoid the persistent-tracker connotation of localStorage — privacy
// regulators (GDPR/CCPA) treat session storage more leniently because
// it auto-expires when the tab closes.
//
// All functions are SAFE to call in non-browser contexts (SSR, tests
// without `window`) — they no-op cleanly.

export type UtmParams = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
};

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const satisfies readonly (keyof UtmParams)[];

const STORAGE_KEY = "mb_utm_first_touch";

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

function emptyUtm(): UtmParams {
  return {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
  };
}

function hasAnyUtm(params: UtmParams): boolean {
  return UTM_KEYS.some((key) => params[key] !== null && params[key] !== "");
}

/**
 * Parse a URL string and return the five standard UTM params. Returns
 * `null` if the URL is malformed or contains zero UTM params (caller
 * shouldn't store an empty object). All values are trimmed; empty
 * strings are coerced to `null`.
 */
export function parseUtmParams(url: string): UtmParams | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const out = emptyUtm();
  for (const key of UTM_KEYS) {
    const raw = parsed.searchParams.get(key);
    if (raw === null) continue;
    const trimmed = raw.trim();
    if (trimmed === "") continue;
    out[key] = trimmed;
  }

  return hasAnyUtm(out) ? out : null;
}

/**
 * Persist UTM params as the first-touch attribution for this session.
 * No-ops if a record already exists — first touch wins.
 *
 * Safe in SSR / no-storage environments: silently no-ops.
 */
export function storeUtmInSession(params: UtmParams): void {
  const storage = safeSessionStorage();
  if (!storage) return;
  if (!hasAnyUtm(params)) return;
  try {
    const existing = storage.getItem(STORAGE_KEY);
    if (existing) return;
    storage.setItem(STORAGE_KEY, JSON.stringify(params));
  } catch {
    // sessionStorage can throw on quota / privacy mode
  }
}

/**
 * Read first-touch UTM. Returns `null` when nothing was stored or the
 * stored value is unparseable.
 */
export function getStoredUtm(): UtmParams | null {
  const storage = safeSessionStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<UtmParams> | null;
    if (!parsed || typeof parsed !== "object") return null;
    const out = emptyUtm();
    for (const key of UTM_KEYS) {
      const v = parsed[key];
      out[key] = typeof v === "string" && v.trim() !== "" ? v : null;
    }
    return hasAnyUtm(out) ? out : null;
  } catch {
    return null;
  }
}

/**
 * Test-only: clear stored UTM so tests are deterministic.
 */
export function __resetUtmStorageForTests(): void {
  const storage = safeSessionStorage();
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Convenience: read UTM from `window.location.href` and persist as
 * first touch. Called once at app boot. Returns the parsed params (or
 * `null` if nothing to capture) so callers can also forward to the
 * pixel/GA4 immediately.
 */
export function captureUtmFromCurrentUrl(): UtmParams | null {
  if (!isBrowser()) return null;
  const params = parseUtmParams(window.location.href);
  if (!params) return null;
  storeUtmInSession(params);
  return params;
}

/**
 * Merge first-touch UTM into a signup metadata payload. Shape matches
 * Supabase Auth's `options.data` for `signUp()` — keys are namespaced
 * with `utm_` so they don't collide with profile fields.
 *
 * - If nothing is stored, returns the input unchanged.
 * - Existing UTM keys on the input are NOT overwritten (caller wins).
 * - Returned object is a shallow clone — never mutates the input.
 */
export function attachUtmToSignup<
  T extends Record<string, unknown>,
>(formData: T): T & Partial<UtmParams> {
  const utm = getStoredUtm();
  if (!utm) return { ...formData };
  const out: Record<string, unknown> = { ...formData };
  for (const key of UTM_KEYS) {
    if (out[key] !== undefined) continue;
    if (utm[key] === null) continue;
    out[key] = utm[key];
  }
  return out as T & Partial<UtmParams>;
}
