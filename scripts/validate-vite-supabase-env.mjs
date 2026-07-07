#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const mode = process.env.MODE || process.env.NODE_ENV || "production";

function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;

    process.env[key] = rawValue
      .trim()
      .replace(/^(['"])(.*)\1$/, "$2");
  }
}

for (const file of [
  ".env",
  ".env.local",
  `.env.${mode}`,
  `.env.${mode}.local`,
]) {
  loadEnvFile(path.join(root, file));
}

const required = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"];
const missing = required.filter((key) => !String(process.env[key] ?? "").trim());

if (missing.length > 0) {
  console.error(
    `[validate-vite-supabase-env] Missing required build env: ${missing.join(", ")}`,
  );
  console.error(
    "[validate-vite-supabase-env] Refusing to build; production auth must never fall back to placeholder Supabase config.",
  );
  console.error("[validate-vite-supabase-env] How to fix:");
  console.error(
    "  • Local build: create .env.local (or .env) in the repo root and set the missing var(s). See the",
  );
  console.error(
    "    'Supabase (core build env)' section of .env.example for the exact keys.",
  );
  console.error(
    "  • CI build: provide the var(s) via the pipeline's build environment / secrets, not a committed file.",
  );
  console.error(
    `  • Missing now: ${missing.map((key) => `${key}=<value>`).join("  ")}`,
  );
  process.exit(2);
}

const supabaseUrl = String(process.env.VITE_SUPABASE_URL).trim();

if (supabaseUrl.includes("placeholder.invalid")) {
  console.error(
    "[validate-vite-supabase-env] VITE_SUPABASE_URL contains placeholder.invalid; refusing to build.",
  );
  process.exit(2);
}

try {
  const parsed = new URL(supabaseUrl);
  if (!/^https?:$/.test(parsed.protocol)) {
    throw new Error(`unsupported protocol ${parsed.protocol}`);
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(
    `[validate-vite-supabase-env] VITE_SUPABASE_URL is not a valid URL: ${message}`,
  );
  process.exit(2);
}
