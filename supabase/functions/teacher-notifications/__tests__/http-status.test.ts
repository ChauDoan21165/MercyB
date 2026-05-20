// supabase/functions/teacher-notifications/__tests__/http-status.test.ts
//
// Source-contract tests for the A16f HTTP-status-code fix.
//
// The audit (#915) flagged teacher-notifications as the lowest-effort fix
// in the ⚠️ list: the helper already had the `send(data, status = 200)`
// signature but every callsite omitted the status argument and defaulted
// to 200. This PR adds the status arg at every error-path callsite. The
// tests below pin those callsites by source pattern.

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
  const s = m[0].match(/,\s*(\d{3})\s*\)\s*;?\s*$/m);
  return s?.[1] ?? null;
}

describe("teacher-notifications — HTTP status contract", () => {
  it("send() helper signature is parameterized (default 200)", () => {
    expect(SRC).toMatch(/function send\([^)]*status\s*=\s*200/);
  });

  it("missing/invalid Authorization header returns 401", () => {
    expect(statusAfter(/!authHeader\?\.startsWith\("Bearer "\)[\s\S]*?return send\([^)]*?,\s*\d{3}\s*\)/))
      .toBe("401");
  });

  it("invalid session token returns 401", () => {
    expect(statusAfter(/userError \|\| !userData\?\.user[\s\S]*?return send\([^)]*?,\s*\d{3}\s*\)/))
      .toBe("401");
  });

  it("caller below admin level 5 returns 403", () => {
    expect(statusAfter(/Admin level 5\+ required[^)]*?,\s*\d{3}\s*\)/))
      .toBe("403");
  });

  it("missing required fields returns 400", () => {
    expect(statusAfter(/action, content_id, and content_type are required[^)]*?,\s*\d{3}\s*\)/))
      .toBe("400");
  });

  it("admin lookup DB error returns 500", () => {
    expect(statusAfter(/admin lookup: \$\{[^)]*?,\s*\d{3}\s*\)/))
      .toBe("500");
  });

  it("revision_requested without reviewer_id returns 400", () => {
    expect(statusAfter(/reviewer_id required for revision_requested[^)]*?,\s*\d{3}\s*\)/))
      .toBe("400");
  });

  it("content_updated without reviewer_id returns 400", () => {
    expect(statusAfter(/reviewer_id required for content_updated[^)]*?,\s*\d{3}\s*\)/))
      .toBe("400");
  });

  it("unknown action returns 400", () => {
    expect(statusAfter(/Unknown action: \$\{[\s\S]*?return send\([\s\S]*?,\s*\d{3}\s*\)/))
      .toBe("400");
  });

  it("top-level catch returns 500", () => {
    expect(statusAfter(/catch \(err\)[\s\S]*?return send\(\{[\s\S]*?,\s*\d{3}\s*\)/))
      .toBe("500");
  });

  it("happy-path success callsites still default to 200 (no status arg)", () => {
    // At least one ok:true callsite remains without an explicit status —
    // the helper default 200 covers it.
    expect(SRC).toMatch(/return send\(\{\s*\n[\s\S]*?ok: true,[\s\S]*?\}\);/);
  });
});
