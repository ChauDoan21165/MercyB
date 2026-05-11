// scripts/validate-secrets.ts
//
// Find every secret that an Edge Function reads via `Deno.env.get(...)`
// and confirm it's set in the linked Supabase project. Prevents the
// class of bug where a function is deployed against an unset env var
// and silently fails at first invocation (e.g. ELEVENLABS_API_KEY,
// FPT_API_KEY).
//
// Run:
//   npx tsx scripts/validate-secrets.ts
//
// Reads:
//   - supabase/functions/**/*.ts — finds Deno.env.get("NAME") strings
//   - `supabase secrets list` (CLI) — lists project secrets
//
// Exits 1 if any referenced secret is missing from the project. Some
// "secrets" (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY,
// SUPABASE_DB_URL) are auto-provided by the platform and not present
// in `secrets list`; the script whitelists those.
//
// Designed to run in CI. Requires SUPABASE_ACCESS_TOKEN in the env so
// the CLI can talk to the API non-interactively.

import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

const FUNCTIONS_DIR = resolve("supabase/functions");
const PROJECT_REF = "buemdfxyhxunzpgdoqin";

// Supabase platform always injects these into Edge Function runtime —
// they don't show up in `secrets list` but they ARE available. Skip.
const PLATFORM_PROVIDED = new Set([
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_DB_URL",
]);

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith(".")) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === "node_modules" || entry.startsWith("__tests__")) continue;
      walk(full, out);
    } else if (entry.endsWith(".ts") || entry.endsWith(".tsx")) {
      out.push(full);
    }
  }
  return out;
}

function extractSecrets(files: string[]): Map<string, string[]> {
  // Map from secret name → list of files that reference it (for the
  // human-readable report when a secret is missing).
  const found = new Map<string, string[]>();
  const re = /Deno\.env\.get\(\s*["'`]([A-Z][A-Z0-9_]*)["'`]\s*\)/g;
  for (const file of files) {
    let body: string;
    try {
      body = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const match of body.matchAll(re)) {
      const name = match[1];
      if (!name) continue;
      const list = found.get(name) ?? [];
      if (!list.includes(file)) list.push(file);
      found.set(name, list);
    }
  }
  return found;
}

function listProjectSecrets(): Set<string> {
  // `supabase secrets list --project-ref <ref>` prints a Markdown-table
  // style block with NAME / DIGEST columns. Parse the NAME column.
  let raw: string;
  try {
    raw = execSync(
      `supabase secrets list --project-ref ${PROJECT_REF}`,
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );
  } catch (err) {
    console.error(
      "[validate-secrets] `supabase secrets list` failed. " +
        "Either the CLI isn't authenticated (set SUPABASE_ACCESS_TOKEN) " +
        "or the project ref is wrong.",
    );
    throw err;
  }
  const set = new Set<string>();
  for (const line of raw.split("\n")) {
    // Lines look like:  "   NAME_HERE   | <digest>"
    const m = line.match(/^\s*([A-Z][A-Z0-9_]*)\s+\|\s+[0-9a-f]{8,}/);
    if (m) set.add(m[1]);
  }
  return set;
}

function main(): void {
  if (!existsSync(FUNCTIONS_DIR)) {
    console.error(`[validate-secrets] ${FUNCTIONS_DIR} not found`);
    process.exit(2);
  }

  const files = walk(FUNCTIONS_DIR);
  const referenced = extractSecrets(files);
  console.log(
    `[validate-secrets] scanned ${files.length} files, found ${referenced.size} unique secret references`,
  );

  const projectSecrets = listProjectSecrets();
  console.log(
    `[validate-secrets] project has ${projectSecrets.size} secrets configured\n`,
  );

  const missing: string[] = [];
  const platform: string[] = [];
  const ok: string[] = [];

  for (const name of [...referenced.keys()].sort()) {
    if (PLATFORM_PROVIDED.has(name)) {
      platform.push(name);
      continue;
    }
    if (projectSecrets.has(name)) {
      ok.push(name);
    } else {
      missing.push(name);
    }
  }

  for (const name of ok) console.log(`  ✅ ${name}`);
  for (const name of platform) console.log(`  ➖ ${name}  (platform-provided)`);
  for (const name of missing) {
    const refs = referenced.get(name) ?? [];
    const shortRefs = refs.slice(0, 3).map((p) => p.replace(FUNCTIONS_DIR + "/", ""));
    console.log(`  ❌ ${name} — MISSING (referenced in ${shortRefs.join(", ")}${refs.length > 3 ? ` +${refs.length - 3} more` : ""})`);
  }

  console.log(
    `\n[validate-secrets] referenced=${referenced.size} set=${ok.length} platform=${platform.length} missing=${missing.length}`,
  );
  if (missing.length > 0) process.exit(1);
}

main();
