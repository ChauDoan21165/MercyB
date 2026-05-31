// CI guard: prove the deployed delete-account flow can erase a real test user.
//
// This is intentionally separate from check-delete-account-coverage.mjs:
// coverage proves the manifest tracks user-owned tables, while this guard
// proves the production edge-function path can create, authenticate, delete,
// and verify erasure for an account.
//
// Required in CI:
//   VITE_SUPABASE_URL or SUPABASE_URL
//   VITE_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY or VITE_SUPABASE_PUBLISHABLE_KEY
//   SUPABASE_SERVICE_ROLE_KEY

import { randomUUID } from "node:crypto";
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
    } catch {
      /* ignore */
    }
  }
  for (const k of Object.keys(process.env)) {
    if (!(k in out)) out[k] = process.env[k];
  }
  return out;
}

function fail(message) {
  console.error(`[check-delete-account-live] ${message}`);
  process.exit(1);
}

function requireEnv(env, names) {
  for (const name of names) {
    const value = env[name]?.trim();
    if (value) return value;
  }
  return "";
}

async function bestEffortCleanup(admin, userId) {
  if (!userId) return;
  try {
    await admin.from("profiles").delete().eq("id", userId);
  } catch {
    /* best effort */
  }
  try {
    await admin.auth.admin.deleteUser(userId);
  } catch {
    /* best effort */
  }
}

const env = loadEnv();
const supabaseUrl = requireEnv(env, ["VITE_SUPABASE_URL", "SUPABASE_URL"]);
const anonKey = requireEnv(env, [
  "VITE_SUPABASE_ANON_KEY",
  "SUPABASE_ANON_KEY",
  "VITE_SUPABASE_PUBLISHABLE_KEY",
]);
const serviceRoleKey = requireEnv(env, ["SUPABASE_SERVICE_ROLE_KEY"]);

const missing = [];
if (!supabaseUrl) missing.push("VITE_SUPABASE_URL or SUPABASE_URL");
if (!anonKey) {
  missing.push(
    "VITE_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY or VITE_SUPABASE_PUBLISHABLE_KEY",
  );
}
if (!serviceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");

if (missing.length > 0) {
  const msg = `Missing ${missing.join(", ")}.`;
  if (env.CI) {
    fail(`${msg} This CI guard must run with Supabase test/project credentials.`);
  }
  console.warn(
    `[check-delete-account-live] ${msg} Skipping live deletion guard outside CI.`,
  );
  process.exit(0);
}

const { createClient } = await import("@supabase/supabase-js");

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const anon = createClient(supabaseUrl, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const runId = `${Date.now()}-${randomUUID().slice(0, 8)}`;
const email = `delete-account-ci+${runId}@mercyblade.test`;
const password = `Mb-delete-${randomUUID()}!1a`;
let userId = "";

try {
  const created = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "Delete Account CI Guard" },
  });
  if (created.error || !created.data.user) {
    throw new Error(
      `Could not create test user: ${created.error?.message ?? "no user returned"}`,
    );
  }
  userId = created.data.user.id;

  // The production signup trigger normally creates profiles. Upsert here too
  // so the guard has a concrete personal-data row to verify after deletion.
  const profile = await admin.from("profiles").upsert({
    id: userId,
    email,
    full_name: "Delete Account CI Guard",
  });
  if (profile.error) {
    throw new Error(`Could not seed profile row: ${profile.error.message}`);
  }

  const signedIn = await anon.auth.signInWithPassword({ email, password });
  if (signedIn.error || !signedIn.data.session?.access_token) {
    throw new Error(
      `Could not sign in test user: ${signedIn.error?.message ?? "no session returned"}`,
    );
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/delete-account`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${signedIn.data.session.access_token}`,
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: "{}",
  });
  const bodyText = await response.text();
  let body = null;
  try {
    body = bodyText ? JSON.parse(bodyText) : null;
  } catch {
    /* keep raw body in failure message */
  }

  if (!response.ok || body?.success !== true) {
    throw new Error(
      `delete-account returned ${response.status}: ${bodyText || "<empty response>"}`,
    );
  }
  if (Array.isArray(body?.report?.errors) && body.report.errors.length > 0) {
    throw new Error(
      `delete-account reported wipe errors: ${JSON.stringify(body.report.errors)}`,
    );
  }

  const secondLogin = await anon.auth.signInWithPassword({ email, password });
  if (!secondLogin.error || secondLogin.data.session) {
    throw new Error("Deleted user can still sign in.");
  }

  const authLookup = await admin.auth.admin.getUserById(userId);
  if (!authLookup.error && authLookup.data.user) {
    throw new Error("Deleted user still exists in auth.users.");
  }

  const profileLookup = await admin
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();
  if (profileLookup.error) {
    throw new Error(`Could not verify profile purge: ${profileLookup.error.message}`);
  }
  if (profileLookup.data) {
    throw new Error("Deleted user's profile row still exists.");
  }

  console.log(
    "[check-delete-account-live] OK — create/sign-in/delete/sign-in-denied/profile-purged verified.",
  );
} catch (error) {
  await bestEffortCleanup(admin, userId);
  fail(error instanceof Error ? error.message : String(error));
}
