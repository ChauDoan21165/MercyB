// supabase/functions/stripe-webhook/stripe-env.ts
//
// Tiny Deno env helpers, extracted from `core.ts` to break the
// `core.ts ↔ stripe-signature.ts` circular dependency (A13 cycle #1).
//
// Both `core.ts` and `stripe-signature.ts` need to read environment
// variables, but neither should depend on the other for it.
// `stripe-signature.ts` previously imported `env` from `core.ts`,
// and `core.ts` imported `parseWebhookSecrets` from
// `stripe-signature.ts` — a textbook value-cycle. Moving these two
// helpers to their own leaf module is the standard extract-the-shared-
// piece refactor.

/** Read an env var, returning the trimmed value (or "" if unset). */
export function env(key: string): string {
  return (Deno.env.get(key) ?? "").trim();
}

/** Read an env var raw (no trim), returning the value or "". */
export function envRaw(key: string): string {
  return Deno.env.get(key) ?? "";
}
