// supabase/functions/email-broadcast/__tests__/http-status.test.ts
//
// Source-contract tests for the A16f HTTP-status-code fix. The send()
// helper went from hard-coded status:200 to a parameterized
// `send(data, status = 200)`. Each error-path callsite now passes the
// correct status arg. Tests pin the source patterns so a future edit
// that drops a status arg is caught at CI.

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

describe("email-broadcast — HTTP status contract", () => {
  it("send() helper accepts status parameter (default 200)", () => {
    expect(SRC).toMatch(/function send\([^)]*status\s*=\s*200/);
  });

  it("missing/invalid Authorization header returns 401", () => {
    expect(statusAfter(/!authHeader\?\.startsWith\("Bearer "\)[\s\S]*?return send\([^)]*?,\s*\d{3}\s*\)/))
      .toBe("401");
  });

  it("invalid/expired session returns 401", () => {
    expect(statusAfter(/userError \|\| !userData\?\.user[\s\S]*?return send\([^)]*?,\s*\d{3}\s*\)/))
      .toBe("401");
  });

  it("insufficient admin level (< 9) returns 403", () => {
    expect(statusAfter(/Insufficient permissions\. Admin level 9\+ required\.[^)]*?,\s*\d{3}\s*\)/))
      .toBe("403");
  });

  it("missing required fields returns 400", () => {
    expect(statusAfter(/Missing required fields: action, subject, body_html, audience_type[^)]*?,\s*\d{3}\s*\)/))
      .toBe("400");
  });

  it("manual mode without emails returns 400", () => {
    expect(statusAfter(/Manual emails list is required[^)]*?,\s*\d{3}\s*\)/))
      .toBe("400");
  });

  it("tiers query DB error returns 500", () => {
    expect(statusAfter(/Failed to query tiers[^)]*?,\s*\d{3}\s*\)/))
      .toBe("500");
  });

  it("subscriptions query DB error returns 500", () => {
    expect(statusAfter(/Failed to query subscriptions[^)]*?,\s*\d{3}\s*\)/))
      .toBe("500");
  });

  it("profiles query DB error returns 500", () => {
    expect(statusAfter(/Failed to query user profiles[^)]*?,\s*\d{3}\s*\)/))
      .toBe("500");
  });

  it("campaign insert DB error returns 500", () => {
    expect(statusAfter(/Failed to create campaign record[^)]*?,\s*\d{3}\s*\)/))
      .toBe("500");
  });

  it("missing RESEND_API_KEY returns 500", () => {
    expect(statusAfter(/Email service not configured[^)]*?,\s*\d{3}\s*\)/))
      .toBe("500");
  });

  it("top-level catch returns 500", () => {
    expect(statusAfter(/catch \(err\)[\s\S]*?Unexpected error[\s\S]*?return send\([^)]*?,\s*\d{3}\s*\)/))
      .toBe("500");
  });

  it("happy-path preview/send still default to 200 (no explicit status)", () => {
    // The successful preview returns ok:true without an explicit status —
    // the helper default 200 covers it.
    expect(SRC).toMatch(/return send\(\{\s*\n[\s\S]*?ok: true,[\s\S]*?\}\);/);
  });
});
