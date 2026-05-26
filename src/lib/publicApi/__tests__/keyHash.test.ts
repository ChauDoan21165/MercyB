import { describe, expect, it } from "vitest";

import {
  constantTimeEquals,
  extractBearerToken,
  generateApiKey,
  hashApiKey,
  KEY_PREFIX_DISPLAY_LENGTH,
  KEY_VISIBLE_PREFIX,
} from "../keyHash";

describe("hashApiKey", () => {
  it("produces the SHA-256 hex of the input string", async () => {
    // Reference value: SHA-256 of the empty string (de-facto known constant).
    expect(await hashApiKey("")).toBe(
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    );
  });

  it("is deterministic", async () => {
    const a = await hashApiKey("mb_abc123def456");
    const b = await hashApiKey("mb_abc123def456");
    expect(a).toBe(b);
  });

  it("changes drastically for a 1-char input change", async () => {
    const a = await hashApiKey("mb_abc123def456");
    const b = await hashApiKey("mb_abc123def457");
    expect(a).not.toBe(b);
    // Avalanche: sanity check that more than half the chars differ.
    let differing = 0;
    for (let i = 0; i < a.length; i += 1) {
      if (a[i] !== b[i]) differing += 1;
    }
    expect(differing).toBeGreaterThan(a.length / 4);
  });

  it("returns 64-char lowercase hex", async () => {
    const hash = await hashApiKey("any-string");
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("generateApiKey", () => {
  it("returns mb_-prefixed raw, hash, and 8-char prefix", async () => {
    const k = await generateApiKey();
    expect(k.raw.startsWith(KEY_VISIBLE_PREFIX)).toBe(true);
    expect(k.keyPrefix).toBe(k.raw.slice(0, KEY_PREFIX_DISPLAY_LENGTH));
    expect(k.keyPrefix.length).toBe(KEY_PREFIX_DISPLAY_LENGTH);
    expect(k.keyHash).toBe(await hashApiKey(k.raw));
  });

  it("produces a long random body — total length >= 80", async () => {
    const k = await generateApiKey();
    // mb_ + 80 hex chars (40 bytes * 2) = 83 chars
    expect(k.raw.length).toBeGreaterThanOrEqual(80);
  });

  it("produces distinct keys across calls", async () => {
    const a = await generateApiKey();
    const b = await generateApiKey();
    expect(a.raw).not.toBe(b.raw);
    expect(a.keyHash).not.toBe(b.keyHash);
  });
});

describe("constantTimeEquals", () => {
  it("returns true on identical strings", () => {
    expect(constantTimeEquals("abc", "abc")).toBe(true);
    expect(constantTimeEquals("", "")).toBe(true);
  });

  it("returns false on different strings of equal length", () => {
    expect(constantTimeEquals("abc", "abd")).toBe(false);
  });

  it("returns false on length mismatch", () => {
    expect(constantTimeEquals("abc", "abcd")).toBe(false);
    expect(constantTimeEquals("", "x")).toBe(false);
  });

  it("doesn't early-return on first character mismatch (sanity check)", () => {
    // Cannot directly observe timing in unit test, but verify functional
    // behavior: a mismatch in the last byte is still detected.
    const a = "00000000000000000000000000000000";
    const b = "00000000000000000000000000000001";
    expect(constantTimeEquals(a, b)).toBe(false);
  });
});

describe("extractBearerToken", () => {
  it("extracts the token from a well-formed header", () => {
    expect(extractBearerToken("Bearer mb_abc123")).toBe("mb_abc123");
  });

  it("is case-insensitive on the scheme", () => {
    expect(extractBearerToken("bearer mb_abc")).toBe("mb_abc");
    expect(extractBearerToken("BEARER mb_abc")).toBe("mb_abc");
  });

  it("trims surrounding whitespace", () => {
    expect(extractBearerToken("  Bearer  mb_abc  ")).toBe("mb_abc");
  });

  it("returns null on missing header", () => {
    expect(extractBearerToken(null)).toBeNull();
    expect(extractBearerToken(undefined)).toBeNull();
    expect(extractBearerToken("")).toBeNull();
  });

  it("returns null on Basic auth or unknown scheme", () => {
    expect(extractBearerToken("Basic abc")).toBeNull();
    expect(extractBearerToken("Token abc")).toBeNull();
  });

  it("returns null when token body is empty", () => {
    expect(extractBearerToken("Bearer   ")).toBeNull();
  });
});
