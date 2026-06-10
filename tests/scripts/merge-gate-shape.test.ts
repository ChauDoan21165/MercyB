// tests/scripts/merge-gate-shape.test.ts
//
// Regression guard for scripts/merge-gate.sh CHECK 2 (protected-path gate).
//
// BUG (2026-06-10, CEO-2 SECOND): `glab mr diff` emits unified-diff headers
// WITHOUT git's a/ b/ prefix (`+++ src/x.ts`, not `+++ b/src/x.ts`). The
// original parser `grep '^+++ b/'` therefore matched ZERO lines, leaving
// FILES empty and CHECK 2 FAIL-OPEN — billing/auth/env/etc. changes passed
// the gate ungated.
//
// These tests pin the ROBUST parser behaviour against the exact glab header
// format so the fail-open can never silently return. They run the real
// `protected_path_hits` function from merge-gate.sh by sourcing it (the
// script's source-guard keeps `main` from executing — no network, no board
// write, no exit), then piping fixture diffs in.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const GATE = path.join(REPO_ROOT, "scripts", "merge-gate.sh");
const GATE_SRC = readFileSync(GATE, "utf8");

/** Run `protected_path_hits` from the real script against a fixture diff.
 *  The function's final `grep` exits 1 when there is no protected hit
 *  (the clear path) — that is a valid "no hit" result, not an error, so we
 *  capture via command-substitution and let the wrapper exit 0. A genuine
 *  source/bash failure still throws. */
function hits(diff: string): string {
  const out = execFileSync(
    "bash",
    ["-c", `source "${GATE}"; out=$(protected_path_hits); printf '%s' "$out"`],
    { input: diff, encoding: "utf8" },
  );
  return out.trim();
}

describe("merge-gate.sh — shape / regression pins", () => {
  it("is valid bash", () => {
    // Throws (non-zero exit) if `bash -n` finds a syntax error.
    execFileSync("bash", ["-n", GATE], { stdio: "pipe" });
  });

  it("uses the robust prefix-agnostic parser, NOT the fail-open '^+++ b/'", () => {
    // Inspect CODE only — the header comment intentionally documents the old
    // fragile pattern for posterity, so strip full-line comments first.
    const codeOnly = GATE_SRC.split("\n")
      .filter((l) => !/^\s*#/.test(l))
      .join("\n");
    // The exact fragile pattern that caused the fail-open must never return.
    expect(codeOnly).not.toMatch(/grep\s+'\^\+\+\+ b\/'/);
    // Robust parser markers: scans both --- / +++ headers, strips optional
    // a/ b/, excludes /dev/null.
    expect(codeOnly).toMatch(/\^\[-\+\]\{3\}/); // matches both --- and +++ headers
    expect(codeOnly).toMatch(/grep -vx '\/dev\/null'/);
  });

  it("guards main() so sourcing the script does not execute the gate", () => {
    expect(GATE_SRC).toMatch(/BASH_SOURCE\[0\]/);
  });
});

describe("merge-gate.sh protected_path_hits — CHECK 2 behaviour", () => {
  it("catches a protected ADD from glab headers WITHOUT a b/ prefix", () => {
    // glab format: no a/ b/ prefix. Original parser missed this entirely.
    const diff = [
      "--- src/lib/supabaseClient.ts",
      "+++ src/lib/supabaseClient.ts",
      "@@ -1 +1 @@",
      "+const x = 1;",
    ].join("\n");
    expect(hits(diff)).toContain("src/lib/supabaseClient.ts");
  });

  it("catches a protected DELETION via the --- old path (+++ is /dev/null)", () => {
    const diff = [
      "--- src/lib/billing.ts",
      "+++ /dev/null",
      "@@ -1 +0,0 @@",
      "-const gone = true;",
    ].join("\n");
    expect(hits(diff)).toContain("src/lib/billing.ts");
  });

  it("never reports /dev/null itself as a changed path", () => {
    const diff = [
      "--- /dev/null",
      "+++ src/components/Button.tsx",
      "@@ -0,0 +1 @@",
      "+export const Button = () => null;",
    ].join("\n");
    expect(hits(diff)).not.toContain("/dev/null");
  });

  it("stays clear (no hit) for a non-protected change", () => {
    const diff = [
      "--- src/components/Button.tsx",
      "+++ src/components/Button.tsx",
      "@@ -1 +1 @@",
      "+// tweak",
    ].join("\n");
    expect(hits(diff)).toBe("");
  });

  it("also handles raw git diff headers WITH a b/ prefix (back-compat)", () => {
    const diff = [
      "diff --git a/.env b/.env",
      "--- a/.env",
      "+++ b/.env",
      "@@ -1 +1 @@",
      "+SECRET=changed",
    ].join("\n");
    expect(hits(diff)).toContain(".env");
  });
});
