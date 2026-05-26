// src/lib/gift/__tests__/giftSubscriptionClient.test.ts
//
// Step 9 — covers the pure surface of the gift client (code generator,
// validation gates) plus the privacy-preserving lookup behavior. The
// Supabase round-trips are stubbed via vi.mock so no network calls.

import { describe, expect, it, vi, beforeEach } from "vitest";

import {
  ALLOWED_DURATIONS,
  GIFT_CODE_LENGTH,
  PERSONAL_MESSAGE_MAX,
  generateGiftCode,
  generateGiftCodeString,
  listMyPurchasedGifts,
  listMyRedeemedGifts,
  lookupGiftCode,
  redeemGiftCode,
} from "../giftSubscriptionClient";

// ── Supabase mock ────────────────────────────────────────────────────────
//
// Each test sets `state.next` to the result the next terminal call
// should resolve with. The fluent chain (.from().select().eq()...) is
// just `this`-returning, terminating at .maybeSingle() / awaitable order.

interface MockResult {
  data: unknown;
  error: unknown;
}

const state = {
  insertQueue: [] as MockResult[],
  selectResult: { data: null, error: null } as MockResult,
  updateResult: { data: null, error: null } as MockResult,
  listResult: { data: [] as unknown[], error: null } as MockResult,
};

vi.mock("@/lib/supabaseClient", () => {
  // The chain object shared across one .from() invocation.
  function buildChain() {
    const orderThenable = {
      then: (resolve: (val: unknown) => unknown) =>
        Promise.resolve(resolve(state.listResult)),
    };

    const chain: Record<string, unknown> = {};
    chain.select = vi.fn(() => chain);
    chain.eq = vi.fn(() => chain);
    chain.is = vi.fn(() => chain);
    chain.not = vi.fn(() => chain);
    chain.order = vi.fn(() => orderThenable);
    chain.maybeSingle = vi.fn(() => Promise.resolve(state.selectResult));

    chain.insert = vi.fn(() => ({
      select: () => ({
        maybeSingle: () =>
          Promise.resolve(state.insertQueue.shift() ?? { data: null, error: null }),
      }),
    }));

    chain.update = vi.fn(() => ({
      eq: () => ({
        is: () => ({
          select: () => ({
            maybeSingle: () => Promise.resolve(state.updateResult),
          }),
        }),
      }),
    }));

    return chain;
  }

  return {
    supabase: {
      from: vi.fn(() => buildChain()),
    },
  };
});

beforeEach(() => {
  state.insertQueue = [];
  state.selectResult = { data: null, error: null };
  state.updateResult = { data: null, error: null };
  state.listResult = { data: [], error: null };
});

// ── generateGiftCodeString ───────────────────────────────────────────────

describe("generateGiftCodeString", () => {
  it("returns a 12-char string by default", () => {
    const code = generateGiftCodeString();
    expect(code).toHaveLength(GIFT_CODE_LENGTH);
    expect(code).toHaveLength(12);
  });

  it("respects an explicit length argument", () => {
    expect(generateGiftCodeString(8)).toHaveLength(8);
    expect(generateGiftCodeString(20)).toHaveLength(20);
  });

  it("never includes ambiguous characters O / 0 / I / 1 / L / U / V", () => {
    const banned = new Set(["O", "0", "I", "1", "L", "U", "V"]);
    for (let i = 0; i < 200; i++) {
      const code = generateGiftCodeString();
      for (const ch of code) {
        expect(banned.has(ch)).toBe(false);
      }
    }
  });

  it("only emits uppercase ASCII letters + digits", () => {
    const code = generateGiftCodeString(60);
    expect(code).toMatch(/^[A-Z0-9]+$/);
  });

  it("produces different codes on repeated calls (overwhelmingly likely)", () => {
    const a = generateGiftCodeString();
    const b = generateGiftCodeString();
    expect(a).not.toBe(b);
  });
});

describe("constants", () => {
  it("ALLOWED_DURATIONS matches the DB CHECK list", () => {
    expect([...ALLOWED_DURATIONS]).toEqual([1, 3, 6, 12]);
  });

  it("PERSONAL_MESSAGE_MAX matches the DB CHECK length cap", () => {
    expect(PERSONAL_MESSAGE_MAX).toBe(280);
  });
});

// ── generateGiftCode validation gates ────────────────────────────────────

describe("generateGiftCode validation", () => {
  it("rejects an unsupported duration without hitting the DB", async () => {
    const result = await generateGiftCode("u1", 4, "x@y.com", null);
    expect(result.row).toBeNull();
    expect(result.error).toBe("invalid_duration");
  });

  it("rejects a personal_message over 280 chars", async () => {
    const result = await generateGiftCode(
      "u1",
      6,
      "x@y.com",
      "x".repeat(PERSONAL_MESSAGE_MAX + 1),
    );
    expect(result.row).toBeNull();
    expect(result.error).toBe("message_too_long");
  });

  it("accepts a 280-char message exactly at the boundary", async () => {
    state.insertQueue.push({
      data: {
        id: "g1",
        code: "ABCDEFGH2345",
        duration_months: 3,
        purchaser_user_id: "u1",
        purchaser_email: null,
        recipient_email: "x@y.com",
        recipient_user_id: null,
        personal_message: "x".repeat(PERSONAL_MESSAGE_MAX),
        created_at: "2026-04-25T00:00:00Z",
        redeemed_at: null,
        expires_at: "2027-04-25T00:00:00Z",
      },
      error: null,
    });
    const result = await generateGiftCode(
      "u1",
      3,
      "x@y.com",
      "x".repeat(PERSONAL_MESSAGE_MAX),
    );
    expect(result.error).toBeNull();
    expect(result.row?.id).toBe("g1");
  });

  it("returns 'no_unique_code' after repeated 23505 collisions", async () => {
    for (let i = 0; i < 5; i++) {
      state.insertQueue.push({
        data: null,
        error: { code: "23505", message: "duplicate key value" },
      });
    }
    const result = await generateGiftCode("u1", 6, "x@y.com", null);
    expect(result.row).toBeNull();
    expect(result.error).toBe("no_unique_code");
  });
});

// ── lookupGiftCode privacy gating ────────────────────────────────────────

describe("lookupGiftCode privacy gating", () => {
  it("returns not_found for a code of the wrong length without DB call", async () => {
    const result = await lookupGiftCode("ABC");
    expect(result.status).toBe("not_found");
    expect(result.row).toBeNull();
  });

  it("returns not_found when the row doesn't exist", async () => {
    state.selectResult = { data: null, error: null };
    const result = await lookupGiftCode("ABCDEFGH2345");
    expect(result.status).toBe("not_found");
  });

  it("returns not_found on RLS error (no leakage)", async () => {
    state.selectResult = { data: null, error: { message: "boom" } };
    const result = await lookupGiftCode("ABCDEFGH2345");
    expect(result.status).toBe("not_found");
  });

  it("returns already_redeemed when redeemed_at is set", async () => {
    state.selectResult = {
      data: {
        id: "g1",
        code: "ABCDEFGH2345",
        duration_months: 6,
        recipient_user_id: "u-other",
        redeemed_at: "2026-02-01T00:00:00Z",
        expires_at: "2027-01-01T00:00:00Z",
        created_at: "2026-01-01T00:00:00Z",
      },
      error: null,
    };
    const result = await lookupGiftCode("ABCDEFGH2345");
    expect(result.status).toBe("already_redeemed");
  });

  it("returns expired when expires_at is in the past", async () => {
    state.selectResult = {
      data: {
        id: "g1",
        code: "ABCDEFGH2345",
        duration_months: 6,
        redeemed_at: null,
        expires_at: "2024-12-31T00:00:00Z",
        created_at: "2024-01-01T00:00:00Z",
      },
      error: null,
    };
    const result = await lookupGiftCode("ABCDEFGH2345");
    expect(result.status).toBe("expired");
  });

  it("returns available for an unredeemed, unexpired code", async () => {
    state.selectResult = {
      data: {
        id: "g1",
        code: "ABCDEFGH2345",
        duration_months: 6,
        purchaser_user_id: "u1",
        redeemed_at: null,
        expires_at: "2027-04-01T00:00:00Z",
        created_at: "2026-04-01T00:00:00Z",
      },
      error: null,
    };
    const result = await lookupGiftCode("ABCDEFGH2345");
    expect(result.status).toBe("available");
    expect(result.row?.id).toBe("g1");
  });
});

// ── redeemGiftCode short-circuits ────────────────────────────────────────

describe("redeemGiftCode", () => {
  it("returns not_found for a code of the wrong length", async () => {
    const result = await redeemGiftCode("u1", "ABC");
    expect(result.error).toBe("not_found");
  });

  it("returns already_redeemed without a write when lookup says so", async () => {
    state.selectResult = {
      data: {
        id: "g1",
        code: "ABCDEFGH2345",
        duration_months: 6,
        recipient_user_id: "u-other",
        redeemed_at: "2026-02-01T00:00:00Z",
        expires_at: "2027-01-01T00:00:00Z",
        created_at: "2026-01-01T00:00:00Z",
      },
      error: null,
    };
    const result = await redeemGiftCode("u1", "ABCDEFGH2345");
    expect(result.error).toBe("already_redeemed");
    expect(result.row).toBeNull();
  });

  it("returns 'already_redeemed' if the UPDATE returns no row (RLS race)", async () => {
    state.selectResult = {
      data: {
        id: "g1",
        code: "ABCDEFGH2345",
        duration_months: 6,
        redeemed_at: null,
        expires_at: "2027-04-01T00:00:00Z",
        created_at: "2026-04-01T00:00:00Z",
      },
      error: null,
    };
    state.updateResult = { data: null, error: null };
    const result = await redeemGiftCode("u1", "ABCDEFGH2345");
    expect(result.error).toBe("already_redeemed");
  });

  it("returns the row on a successful redemption", async () => {
    state.selectResult = {
      data: {
        id: "g1",
        code: "ABCDEFGH2345",
        duration_months: 6,
        redeemed_at: null,
        expires_at: "2027-04-01T00:00:00Z",
        created_at: "2026-04-01T00:00:00Z",
      },
      error: null,
    };
    state.updateResult = {
      data: {
        id: "g1",
        code: "ABCDEFGH2345",
        duration_months: 6,
        recipient_user_id: "u1",
        redeemed_at: "2026-04-25T12:00:00Z",
        expires_at: "2027-04-01T00:00:00Z",
        created_at: "2026-04-01T00:00:00Z",
      },
      error: null,
    };
    const result = await redeemGiftCode("u1", "ABCDEFGH2345");
    expect(result.error).toBeNull();
    expect(result.row?.recipientUserId).toBe("u1");
    expect(result.row?.redeemedAt).toBe("2026-04-25T12:00:00Z");
  });
});

// ── list helpers ────────────────────────────────────────────────────────

describe("list helpers", () => {
  it("listMyPurchasedGifts returns [] for empty userId", async () => {
    expect(await listMyPurchasedGifts("")).toEqual([]);
  });

  it("listMyRedeemedGifts returns [] for empty userId", async () => {
    expect(await listMyRedeemedGifts("")).toEqual([]);
  });
});
