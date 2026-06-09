// Runtime environment helpers for the MercyBlade k6 load scripts.
//
// These guard against accidentally pointing a load run at production and keep
// auth/payload wiring driven by env vars (k6's `__ENV`).

/**
 * Resolve and validate the API base URL. Throws (aborting setup) when BASE_URL
 * is missing so a run can never silently hit a default/production host.
 */
export function requireBaseUrl(env) {
  const baseUrl = env && env.BASE_URL;
  if (!baseUrl) {
    throw new Error(
      "BASE_URL is required. Point it at a STAGING or local target, never production. " +
        "Example: BASE_URL=https://staging.example.dev k6 run tests/load/mercy-ai.load.js",
    );
  }
  return String(baseUrl).replace(/\/+$/, "");
}

/** Standard JSON headers, with a bearer token when MERCY_JWT is provided. */
export function authHeaders(env) {
  const token = (env && env.MERCY_JWT) || "";
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

/** Parse a JSON payload override from env[key], falling back to `fallback`. */
export function jsonPayload(env, key, fallback) {
  const raw = env && env[key];
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
