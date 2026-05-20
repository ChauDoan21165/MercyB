// supabase/functions/stripe-webhook/stripe-env.ts
//
// Extracted from core.ts in A13-circle-1 to break the
// core.ts ↔ stripe-signature.ts circular import:
//
//   core.ts          → stripe-signature.ts  (imports parseWebhookSecrets)
//   stripe-signature → core.ts              (imported env — cycle)
//
// After extraction:
//   core.ts          → stripe-env.ts        (imports env, envRaw)
//   core.ts          → stripe-signature.ts  (unchanged)
//   stripe-signature → stripe-env.ts        (imports env — was core, now env-leaf)
//
// stripe-env.ts is a pure leaf: it imports nothing from the
// stripe-webhook directory, so it cannot participate in any cycle.
//
// Behavior change: zero. The two functions' bodies are byte-identical
// to their previous definitions at core.ts:79–85.

export function env(key: string): string {
  return (Deno.env.get(key) ?? "").trim();
}

export function envRaw(key: string): string {
  return Deno.env.get(key) ?? "";
}
