// scripts/validate-edge-functions.ts
//
// Verify every Edge Function in supabase/functions/ is actually deployed
// to the Supabase project. A deployed function gates auth and replies
// 401 to an unauthenticated GET; an undeployed function returns 404
// from the Supabase functions router. The 401-vs-404 distinction is
// the cheapest signal we can probe without a real session.
//
// Run:
//   npx tsx scripts/validate-edge-functions.ts
//
// Env (loaded from .env.local then .env):
//   VITE_SUPABASE_URL       — the supabase project URL
//   VITE_SUPABASE_ANON_KEY, SUPABASE_ANON_KEY, or
//   VITE_SUPABASE_PUBLISHABLE_KEY — needed in the apikey header so the
//                                  gateway routes the request to functions
//
// Exits 1 if any function is undeployed. Designed to run in CI so a
// PR that adds a new function but forgets to deploy it fails the
// pipeline.

import { existsSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { config as loadDotenv } from "dotenv";

for (const p of [".env.local", ".env"]) {
  if (existsSync(p)) loadDotenv({ path: p });
}

const SUPABASE_URL = (process.env.VITE_SUPABASE_URL ?? "").trim();
const ANON_KEY = (
  process.env.VITE_SUPABASE_ANON_KEY ??
  process.env.SUPABASE_ANON_KEY ??
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  ""
).trim();

if (!SUPABASE_URL || !ANON_KEY) {
  console.error(
    "[validate-edge-functions] missing VITE_SUPABASE_URL and one of VITE_SUPABASE_ANON_KEY, SUPABASE_ANON_KEY, or VITE_SUPABASE_PUBLISHABLE_KEY",
  );
  process.exit(2);
}

const FUNCTIONS_DIR = resolve("supabase/functions");
// `_shared` holds helper modules used by multiple functions — not a
// function itself. Skip any directory starting with `_`.
function isFunctionDir(name: string): boolean {
  if (name.startsWith("_") || name.startsWith(".")) return false;
  const full = resolve(FUNCTIONS_DIR, name);
  if (!statSync(full).isDirectory()) return false;
  return existsSync(resolve(full, "index.ts"));
}

const names = readdirSync(FUNCTIONS_DIR).filter(isFunctionDir).sort();

async function probe(name: string): Promise<"deployed" | "missing" | "unknown"> {
  const url = `${SUPABASE_URL}/functions/v1/${name}`;
  try {
    const resp = await fetch(url, {
      method: "GET",
      headers: { apikey: ANON_KEY },
    });
    if (resp.status === 404) return "missing";
    // Anything other than 404 means the function is reachable. The
    // typical response is 401 (auth gate firing). Some functions
    // accept GET without auth and return 200 / 405 / 500 — all are
    // "deployed".
    return "deployed";
  } catch (err) {
    console.warn(`[validate-edge-functions] network error for ${name}:`, err);
    return "unknown";
  }
}

async function main(): Promise<void> {
  console.log(
    `[validate-edge-functions] probing ${names.length} functions at ${SUPABASE_URL}`,
  );
  let missing = 0;
  let unknown = 0;
  for (const name of names) {
    // eslint-disable-next-line no-await-in-loop
    const status = await probe(name);
    if (status === "deployed") {
      console.log(`  ✅ ${name}`);
    } else if (status === "missing") {
      console.log(`  ❌ ${name} — NOT DEPLOYED`);
      missing++;
    } else {
      console.log(`  ⚠️  ${name} — probe failed (treating as unknown)`);
      unknown++;
    }
  }
  console.log(
    `\n[validate-edge-functions] total=${names.length} deployed=${names.length - missing - unknown} missing=${missing} unknown=${unknown}`,
  );
  if (missing > 0) process.exit(1);
}

main().catch((err) => {
  console.error("[validate-edge-functions] fatal:", err);
  process.exit(2);
});
