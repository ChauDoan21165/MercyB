// supabase/functions/delete-account/__tests__/index-wiring.test.ts
//
// Companion guard to aal-gate.test.ts (issue #233, PR #748).
//
// aal-gate.test.ts proves the PURE gate logic is correct. It does NOT
// prove the gate is actually WIRED into the irreversible code path:
// index.ts runs under `Deno.serve` and cannot be exercised by vitest,
// so a refactor that (a) deleted the `evaluateDeleteAccountAal` call,
// (b) moved its early-return AFTER the deletion passes, or (c) stopped
// failing closed on a factor-lookup error would leave aal-gate.test.ts
// fully green while re-opening the exact #233 bypass.
//
// Account deletion is irreversible and entitlement/subscription-
// adjacent (money-path). This source-invariant test locks the wiring
// contract so any such refactor must be a deliberate, reviewed change
// to this test — not a silent regression.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { describe, expect, it } from "vitest";

const indexSrc = readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "index.ts"),
  "utf8",
);

describe("delete-account/index.ts wires the #233 aal=2 gate", () => {
  it("imports the pure gate helpers from ./aal-gate", () => {
    expect(indexSrc).toMatch(
      /import\s*\{[^}]*evaluateDeleteAccountAal[^}]*\}\s*from\s*["']\.\/aal-gate(\.ts)?["']/s,
    );
    expect(indexSrc).toContain("readAalFromJwt");
  });

  it("invokes evaluateDeleteAccountAal and early-returns its denial", () => {
    expect(indexSrc).toContain("evaluateDeleteAccountAal({");
    expect(indexSrc).toMatch(
      /if\s*\(\s*denial\s*\)\s*return\s+json\(\s*denial\.payload\s*,\s*denial\.status\s*\)/,
    );
  });

  it("runs the gate BEFORE any destructive operation (the #233 invariant)", () => {
    const denialReturnIdx = indexSrc.search(
      /if\s*\(\s*denial\s*\)\s*return\s+json\(\s*denial\.payload/,
    );
    const gateCallIdx = indexSrc.indexOf("evaluateDeleteAccountAal({");

    // Destructive markers: Pass-1 personal-data delete loop, the
    // profiles delete, and the terminal auth.users wipe.
    const firstDeleteLoopIdx = indexSrc.indexOf("getDeleteEntries()");
    const deleteUserIdx = indexSrc.indexOf(
      "admin.auth.admin.deleteUser(",
    );

    expect(gateCallIdx).toBeGreaterThan(-1);
    expect(denialReturnIdx).toBeGreaterThan(-1);
    expect(firstDeleteLoopIdx).toBeGreaterThan(-1);
    expect(deleteUserIdx).toBeGreaterThan(-1);

    // The denial must be evaluated and returned before the first row
    // is touched. If this fails, the gate has been moved past a wipe.
    expect(denialReturnIdx).toBeGreaterThan(gateCallIdx);
    expect(denialReturnIdx).toBeLessThan(firstDeleteLoopIdx);
    expect(denialReturnIdx).toBeLessThan(deleteUserIdx);
  });

  it("looks up VERIFIED TOTP factors via the admin MFA API", () => {
    expect(indexSrc).toContain("admin.auth.admin.mfa.listFactors(");
    expect(indexSrc).toContain('"verified"');
    expect(indexSrc).toContain('"totp"');
  });

  it("fails CLOSED: a factor-lookup throw sets factorLookupFailed=true", () => {
    // The listFactors call must be inside a try whose catch flips the
    // fail-closed flag, so an irreversible op never assumes "no MFA".
    const catchBlock = indexSrc.match(/catch\s*\{[^}]*\}/s)?.[0] ?? "";
    expect(catchBlock).toContain("factorLookupFailed = true");
  });
});
