import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

/**
 * Unit test for the Supabase env guard (scripts/validate-vite-supabase-env.mjs) —
 * the pre-check now wired into every dev/build entry path (predev, predev:frontend,
 * prebuild, prebuild:dev). It runs the guard as a subprocess inside an isolated temp
 * cwd so the repo's own .env / .env.local files cannot leak into the assertions.
 *
 * This is a UNIT test (vitest) that drives the real guard script.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const GUARD = path.resolve(here, "../../../scripts/validate-vite-supabase-env.mjs");

function runGuard(vars: Record<string, string>) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "supabase-env-guard-"));
  const env = { ...process.env } as Record<string, string>;
  // Strip any inherited Supabase env so each case is deterministic.
  delete env.VITE_SUPABASE_URL;
  delete env.VITE_SUPABASE_ANON_KEY;
  Object.assign(env, vars);
  return spawnSync("node", [GUARD], { cwd: tmp, env, encoding: "utf8" });
}

describe("Supabase env guard (validate-vite-supabase-env.mjs)", () => {
  it("(a) valid env → exits 0 (boots clean)", () => {
    const r = runGuard({
      VITE_SUPABASE_URL: "https://example.supabase.co",
      VITE_SUPABASE_ANON_KEY: "test-anon-key",
    });
    expect(r.status).toBe(0);
  });

  it("(b) missing VITE_SUPABASE_URL → exit 2 with a clear, actionable message (not a stack trace)", () => {
    const r = runGuard({
      VITE_SUPABASE_ANON_KEY: "test-anon-key",
      // VITE_SUPABASE_URL intentionally omitted
    });
    const out = `${r.stdout ?? ""}${r.stderr ?? ""}`;
    // guard refuses the build/boot with a non-zero, non-crash exit code
    expect(r.status).toBe(2);
    // names the specific missing var and points to the fix
    expect(out).toContain("VITE_SUPABASE_URL");
    expect(out).toContain("Missing required build env");
    expect(out).toContain(".env.example");
    // clear message — NOT a raw Node stack trace
    expect(out).not.toMatch(/\n\s+at\s+.+:\d+:\d+/);
  });
});
