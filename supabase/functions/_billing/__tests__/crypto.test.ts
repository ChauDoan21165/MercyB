// supabase/functions/_billing/__tests__/crypto.test.ts
//
// A12 coverage ratchet — lock the sha256Hex primitive.
// The function is one line of Web Crypto, but it ships in every billing
// idempotency key, so a regression here corrupts the entire event-ledger
// uniqueness invariant. Cheap to test, expensive to lose.

import { describe, it, expect } from "vitest";
import { sha256Hex } from "../crypto";

describe("sha256Hex", () => {
  // Known-answer tests against the NIST FIPS 180-4 vectors so any future
  // refactor (different encoding, different digest, byte-order flip)
  // produces a loud failure.

  it("hashes the empty string to e3b0c44...", async () => {
    expect(await sha256Hex("")).toBe(
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    );
  });

  it("hashes 'abc' to ba7816bf...", async () => {
    expect(await sha256Hex("abc")).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
  });

  it("returns 64 hex characters for any non-empty input", async () => {
    const hex = await sha256Hex("Mercy");
    expect(hex).toMatch(/^[0-9a-f]{64}$/);
  });

  it("is deterministic — same input twice → same output", async () => {
    const a = await sha256Hex("stripe.evt_test_123");
    const b = await sha256Hex("stripe.evt_test_123");
    expect(a).toBe(b);
  });

  it("is sensitive to a single-byte change", async () => {
    const a = await sha256Hex("event:A");
    const b = await sha256Hex("event:B");
    expect(a).not.toBe(b);
  });

  it("uses utf-8 encoding for non-ascii input (not utf-16)", async () => {
    // The implementation uses TextEncoder which is utf-8. We don't pin a
    // specific digest for non-ascii here (locale-dependent terminal copy
    // hazards) — we assert that the result differs from the same string's
    // utf-16-encoded digest, proving the TextEncoder path.
    const hexUtf8 = await sha256Hex("café");
    // Manually encode "café" as utf-16LE and hash to verify the impl
    // chose utf-8: utf-8 bytes [63 61 66 c3 a9], utf-16LE [63 00 61 00 66 00 e9 00].
    const utf16le = new Uint8Array([0x63, 0x00, 0x61, 0x00, 0x66, 0x00, 0xe9, 0x00]);
    const utf16Digest = new Uint8Array(
      await crypto.subtle.digest("SHA-256", utf16le),
    );
    const hexUtf16 = Array.from(utf16Digest)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    expect(hexUtf8).not.toBe(hexUtf16);
    expect(hexUtf8).toMatch(/^[0-9a-f]{64}$/);
  });

  it("lowercases all hex digits (consistent case for indexing)", async () => {
    const hex = await sha256Hex("anything");
    expect(hex).toBe(hex.toLowerCase());
  });
});
