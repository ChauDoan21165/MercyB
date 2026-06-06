// supabase/functions/learner-capture/__tests__/sanitize.test.ts
//
// Locks the security-critical core of the learner-capture trust boundary:
// the HMAC anonymization and the PII scrub that run server-side before any
// row is written. These are the guarantees that must hold the instant
// LEARNING_CAPTURE_ENABLED flips on. Pure functions, no Deno shell — runs
// under vitest (crypto.subtle + TextEncoder exist in both Deno and Node).

import { describe, it, expect } from "vitest";
import {
  clampScore,
  hmacHex,
  MAX_RULE_IDS,
  MAX_TEXT_LENGTH,
  sanitizeRuleIds,
  scrubPii,
} from "../sanitize";

const PEPPER = "test-pepper-not-the-real-one";
const USER_A = "11111111-1111-4111-8111-111111111111";
const USER_B = "22222222-2222-4222-8222-222222222222";

describe("hmacHex — anonymization is one-way, deterministic, pepper-bound", () => {
  it("never returns the raw input (the user id is not recoverable from the row)", async () => {
    const hash = await hmacHex(USER_A, PEPPER);
    expect(hash).not.toBe(USER_A);
    expect(hash).not.toContain(USER_A);
    expect(hash.includes(USER_A.replace(/-/g, ""))).toBe(false);
  });

  it("is a 64-char lowercase hex digest (SHA-256)", async () => {
    const hash = await hmacHex(USER_A, PEPPER);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("is deterministic — same user + same pepper → same hash (so cohorts dedup)", async () => {
    const a1 = await hmacHex(USER_A, PEPPER);
    const a2 = await hmacHex(USER_A, PEPPER);
    expect(a1).toBe(a2);
  });

  it("distinct users → distinct hashes", async () => {
    const a = await hmacHex(USER_A, PEPPER);
    const b = await hmacHex(USER_B, PEPPER);
    expect(a).not.toBe(b);
  });

  it("is pepper-bound — rotating the pepper changes every hash (no cross-pepper linkage)", async () => {
    const withPepper1 = await hmacHex(USER_A, PEPPER);
    const withPepper2 = await hmacHex(USER_A, "a-different-pepper");
    expect(withPepper1).not.toBe(withPepper2);
  });
});

describe("scrubPii — no PII survives into a free-text column", () => {
  it("redacts email addresses", () => {
    expect(scrubPii("contact me at jane.doe+tag@example.co.uk please")).toBe(
      "contact me at [redacted-email] please",
    );
  });

  it("redacts http(s) URLs", () => {
    expect(scrubPii("see https://evil.example.com/path?x=1 now")).toBe(
      "see [redacted-url] now",
    );
  });

  it("redacts UUIDs (e.g. a leaked user id pasted into text)", () => {
    expect(scrubPii(`my id is ${USER_A}`)).toBe("my id is [redacted-id]");
  });

  it("redacts 6+ digit runs (phone numbers / ids)", () => {
    expect(scrubPii("call 0987654321 or 123456")).toBe(
      "call [redacted-number] or [redacted-number]",
    );
  });

  it("leaves short digit runs (<=5) alone — they are not identifiers", () => {
    expect(scrubPii("I scored 95 on 12345")).toBe("I scored 95 on 12345");
  });

  it("collapses whitespace and trims", () => {
    expect(scrubPii("  too    many   spaces  ")).toBe("too many spaces");
  });

  it("returns null for non-strings and for empty/whitespace-only input", () => {
    expect(scrubPii(undefined)).toBeNull();
    expect(scrubPii(null)).toBeNull();
    expect(scrubPii(42)).toBeNull();
    expect(scrubPii({})).toBeNull();
    expect(scrubPii("   ")).toBeNull();
  });

  it("truncates to MAX_TEXT_LENGTH", () => {
    const long = "a".repeat(MAX_TEXT_LENGTH + 500);
    expect(scrubPii(long)?.length).toBe(MAX_TEXT_LENGTH);
  });

  it("redacts several PII kinds in one pass", () => {
    const out = scrubPii("mail x@y.com id 0123456789 link http://z.io/a");
    expect(out).toBe("mail [redacted-email] id [redacted-number] link [redacted-url]");
    expect(out).not.toMatch(/@y\.com/);
    expect(out).not.toMatch(/0123456789/);
    expect(out).not.toMatch(/http/);
  });
});

describe("clampScore — bounded, rounded, fail-safe", () => {
  it("clamps into [0, 100]", () => {
    expect(clampScore(-5)).toBe(0);
    expect(clampScore(150)).toBe(100);
    expect(clampScore(73)).toBe(73);
  });

  it("rounds to an integer", () => {
    expect(clampScore(82.6)).toBe(83);
  });

  it("returns null for non-finite / non-number values", () => {
    expect(clampScore(NaN)).toBeNull();
    expect(clampScore(Infinity)).toBeNull();
    expect(clampScore("90")).toBeNull();
    expect(clampScore(null)).toBeNull();
  });
});

describe("sanitizeRuleIds — bounded, trimmed, string-only", () => {
  it("drops non-strings and empties, trims, and keeps order", () => {
    expect(
      sanitizeRuleIds(["  a-rule ", "", 7, null, "b-rule", "   "]),
    ).toEqual(["a-rule", "b-rule"]);
  });

  it("caps each id at 80 chars", () => {
    const long = "r".repeat(200);
    expect(sanitizeRuleIds([long])[0].length).toBe(80);
  });

  it("caps the array at MAX_RULE_IDS entries", () => {
    const many = Array.from({ length: MAX_RULE_IDS + 20 }, (_, i) => `rule-${i}`);
    expect(sanitizeRuleIds(many).length).toBe(MAX_RULE_IDS);
  });

  it("returns [] for non-array input", () => {
    expect(sanitizeRuleIds("nope")).toEqual([]);
    expect(sanitizeRuleIds(undefined)).toEqual([]);
  });
});
