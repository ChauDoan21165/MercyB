// supabase/functions/_shared/__tests__/familyInviteValidation.test.ts

import { afterEach, describe, it, expect, vi } from "vitest";

import {
  INVITE_TOKEN_LENGTH,
  MAX_BATCH_SIZE,
  generateInviteToken,
  normalizeBulk,
  normalizeRecipient,
} from "../familyInviteValidation";

describe("normalizeRecipient", () => {
  it("accepts a normal email-only recipient", () => {
    const r = normalizeRecipient({
      name: "Lan",
      email: "lan@example.com",
      relationship: "older_sister",
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.recipient.name).toBe("Lan");
      expect(r.recipient.email).toBe("lan@example.com");
      expect(r.recipient.relationship).toBe("older_sister");
      expect(r.recipient.phone).toBeNull();
    }
  });

  it("lowercases and trims emails", () => {
    const r = normalizeRecipient({ email: "  USER@Example.COM " });
    if (r.ok) expect(r.recipient.email).toBe("user@example.com");
    else throw new Error("expected ok");
  });

  it("normalises phone numbers (strips spaces / dashes / parens)", () => {
    const r = normalizeRecipient({ phone: "+84 (90) 123-4567" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.recipient.phone).toBe("+84901234567");
  });

  it("rejects when neither email nor phone is present", () => {
    const r = normalizeRecipient({ name: "Alice" });
    expect(r).toEqual({ ok: false, error: "missing_contact" });
  });

  it("rejects an invalid email", () => {
    expect(normalizeRecipient({ email: "not-an-email" })).toEqual({
      ok: false,
      error: "invalid_email",
    });
  });

  it("rejects an invalid phone (too short)", () => {
    expect(normalizeRecipient({ phone: "12345" })).toEqual({
      ok: false,
      error: "invalid_phone",
    });
  });

  it("rejects names over 100 chars", () => {
    expect(normalizeRecipient({ email: "a@b.com", name: "x".repeat(101) })).toEqual({
      ok: false,
      error: "name_too_long",
    });
  });

  it("normalises an unknown relationship to null instead of throwing", () => {
    const r = normalizeRecipient({ email: "a@b.com", relationship: "bestie" });
    if (r.ok) expect(r.recipient.relationship).toBeNull();
    else throw new Error("expected ok");
  });
});

describe("normalizeBulk", () => {
  it("returns valid + errors arrays with original indices", () => {
    const result = normalizeBulk([
      { email: "a@b.com" },
      { email: "not-an-email" },
      { email: "c@d.com" },
      {},
    ]);
    expect(result.valid.length).toBe(2);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        { index: 1, error: "invalid_email" },
        { index: 3, error: "missing_contact" },
      ]),
    );
  });

  it("dedupes by normalised email within the batch", () => {
    const result = normalizeBulk([
      { email: "a@b.com" },
      { email: "A@B.com" }, // duplicate after normalisation
      { email: "c@d.com" },
    ]);
    expect(result.valid.length).toBe(2);
    expect(result.dedupedFromInput).toBe(1);
    expect(result.errors).toContainEqual({ index: 1, error: "duplicate" });
  });

  it("dedupes by normalised phone", () => {
    const result = normalizeBulk([
      { phone: "+84 90 123 4567" },
      { phone: "+84-90-1234-567" }, // same digits after stripping
    ]);
    expect(result.valid.length).toBe(1);
    expect(result.errors).toContainEqual({ index: 1, error: "duplicate" });
  });

  it("caps the batch at MAX_BATCH_SIZE and marks overflow as batch_too_large", () => {
    const oversize = Array.from({ length: MAX_BATCH_SIZE + 3 }, (_, i) => ({
      email: `r${i}@example.com`,
    }));
    const result = normalizeBulk(oversize);
    expect(result.valid.length).toBe(MAX_BATCH_SIZE);
    expect(result.errors.filter((e) => e.error === "batch_too_large").length).toBe(3);
  });

  it("handles an empty input", () => {
    const result = normalizeBulk([]);
    expect(result.valid).toEqual([]);
    expect(result.errors).toEqual([]);
    expect(result.dedupedFromInput).toBe(0);
  });
});

describe("generateInviteToken", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a 12-char token by default", () => {
    expect(generateInviteToken()).toHaveLength(INVITE_TOKEN_LENGTH);
    expect(INVITE_TOKEN_LENGTH).toBe(12);
  });

  it("uses only the unambiguous alphabet (no O / 0 / I / 1)", () => {
    for (let i = 0; i < 200; i++) {
      const token = generateInviteToken();
      expect(token).toMatch(/^[2-9A-HJ-NP-Z]+$/);
    }
  });

  it("is highly likely to differ across calls", () => {
    expect(generateInviteToken()).not.toBe(generateInviteToken());
  });

  it("throws instead of falling back to Math.random when Web Crypto is unavailable", () => {
    vi.spyOn(globalThis, "crypto", "get").mockReturnValue(undefined as Crypto | undefined);

    expect(() => generateInviteToken()).toThrow(
      "generateInviteToken requires Web Crypto getRandomValues",
    );
  });
});
