// One-shot: dump every column of every anonymize-target table so we can
// audit for free-text fields that might retain identifying info after
// user_id is nulled.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  const out = {};
  for (const f of [".env", ".env.local"]) {
    try {
      const raw = readFileSync(resolve(process.cwd(), f), "utf8");
      for (const line of raw.split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (m) out[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
      }
    } catch {}
  }
  return out;
}
const env = loadEnv();
const res = await fetch(
  `${env.VITE_SUPABASE_URL}/rest/v1/?apikey=${env.SUPABASE_SERVICE_ROLE_KEY}`,
  { headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` } },
);
const spec = await res.json();

const ANONYMIZE_TARGETS = [
  // billing / financial
  "apple_iap_events","bank_payment_requests","bank_transfer_orders","billing_customers",
  "entitlement_events","organization_users","payment_events","payment_proof_submissions",
  "payment_transactions","payments","subscription_usage","subscriptions","tier_memberships",
  "user_entitlements","user_entitlements_raw","user_entitlements_raw_20260301_181303",
  "user_promo_redemptions","user_subscription_state","user_subscriptions","user_tiers",
  "webhook_events","webhook_events_pending","payment_proof_audit_log",
  // security / moderation / audit
  "audit_logs","feedback","security_events","system_logs",
  "user_moderation_status","user_moderation_violations","user_role_audit","user_security_status",
];

for (const t of ANONYMIZE_TARGETS) {
  const def = spec.definitions?.[t];
  if (!def) { console.log(`### ❌ ${t} — not in OpenAPI`); continue; }
  console.log(`### ${t}`);
  for (const [name, meta] of Object.entries(def.properties || {})) {
    const type = meta.format || meta.type || "?";
    const maxLen = meta.maxLength ? ` maxLen=${meta.maxLength}` : "";
    console.log(`  ${name}: ${type}${maxLen}`);
  }
  console.log();
}
