// supabase/functions/admin-management/__tests__/http-status.test.ts
//
// Source-contract tests for the A16f HTTP-status-code fix.
//
// We test the SOURCE rather than the live handler because admin-management
// is a Deno.serve top-level entrypoint with no extracted handleRequest —
// invoking it in vitest would require mocking auth.getUser, several Postgres
// queries, and auth.admin.listUsers. The status-code-only fix is mechanical:
// each error-path callsite gets an explicit status arg. A static-pattern
// check pins exactly that: condition X is followed by a `send(..., NNN)`
// emitting the right status.
//
// If a future PR extracts a handleRequest(req, deps) shape (recommended,
// see audit #915), these tests can be replaced by handler-level assertions
// (e.g. account-convert/__tests__/core.test.ts) and the source-grep can go
// away. Until then, this file is the cheapest test that pins the contract.

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), "../index.ts"),
  "utf8",
);

function statusAfter(re: RegExp): string | null {
  const m = SRC.match(re);
  if (!m) return null;
  const status = m[0].match(/return send\([^)]*\)[^)]*?,\s*(\d{3})\s*\)/) ??
    m[0].match(/,\s*(\d{3})\s*\)\s*;?\s*$/m);
  return status?.[1] ?? null;
}

describe("admin-management — HTTP status contract", () => {
  it("send() helper accepts a status parameter (default 200)", () => {
    expect(SRC).toMatch(/function send\([^)]*status\s*=\s*200/);
  });

  it("missing Authorization header returns 401", () => {
    expect(statusAfter(/if \(!authHeader\)[\s\S]*?return send\([^)]*?,\s*\d{3}\s*\)/))
      .toBe("401");
  });

  it("invalid/expired bearer token returns 401", () => {
    expect(statusAfter(/authError \|\| !userData\?\.user[\s\S]*?return send\([^)]*?,\s*\d{3}\s*\)/))
      .toBe("401");
  });

  it("requestor is not an admin returns 403", () => {
    expect(statusAfter(/adminError \|\| !requestorAdmin[\s\S]*?return send\([^)]*?,\s*\d{3}\s*\)/))
      .toBe("403");
  });

  it("create action — missing email returns 400", () => {
    expect(statusAfter(/if \(!email\)[\s\S]*?return send\([^)]*?,\s*\d{3}\s*\)/))
      .toBe("400");
  });

  it("create action — level < 9 returns 403", () => {
    expect(statusAfter(/Only Level 9\+ can create admins[^)]*?,\s*\d{3}\s*\)/))
      .toBe("403");
  });

  it("create action — already admin returns 409", () => {
    expect(statusAfter(/User is already an admin[^)]*?,\s*\d{3}\s*\)/))
      .toBe("409");
  });

  it("create action — target user not found returns 404", () => {
    expect(statusAfter(/User not found\. They must sign up first\.[^)]*?,\s*\d{3}\s*\)/))
      .toBe("404");
  });

  it("update_level — admin not found returns 404", () => {
    expect(statusAfter(/Admin not found[^)]*?,\s*\d{3}\s*\)/))
      .toBe("404");
  });

  it("update_level — cannot modify Admin Master returns 403", () => {
    expect(statusAfter(/Cannot modify Admin Master[^)]*?,\s*\d{3}\s*\)/))
      .toBe("403");
  });

  it("unknown action returns 400", () => {
    expect(statusAfter(/Unknown action: \$\{action\}[^)]*?,\s*\d{3}\s*\)/))
      .toBe("400");
  });

  it("top-level catch returns 500", () => {
    expect(statusAfter(/catch \(error: unknown\)[\s\S]*?return send\([^)]*?,\s*\d{3}\s*\)/))
      .toBe("500");
  });

  it("no error path still defaults to 200 (auth-success / list / my-role)", () => {
    // The default `send({ ok: true, ... })` without explicit status is
    // allowed — the helper still defaults to 200. Confirm at least one
    // happy-path callsite exists with no status arg.
    expect(SRC).toMatch(/return send\(\{\s*\n[\s\S]*?ok: true[\s\S]*?\}\)\s*;?/m);
  });
});
