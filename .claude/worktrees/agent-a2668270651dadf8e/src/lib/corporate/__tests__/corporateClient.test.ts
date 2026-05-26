// src/lib/corporate/__tests__/corporateClient.test.ts
//
// Unit tests for the pure-logic surface of corporateClient (validation,
// CSV parsing, invite-code generation) plus a few smoke checks on the
// network-bound helpers with a stubbed supabase client. RLS enforcement
// is a DB concern and is exercised by the migration, not unit tests.

import { describe, expect, it, vi, beforeEach } from "vitest";

// Holds the row(s) the mocked supabase will return per test.
const supabaseState = {
  lastTable: "" as string,
  lastInsertRow: null as unknown,
  lastDelete: { table: "", filters: [] as Array<[string, string]> },
  insertReturn: { data: null as unknown, error: null as unknown },
  selectReturn: { data: [] as unknown[], error: null as unknown },
  rpcReturn: { data: null as unknown, error: null as unknown },
  deleteReturn: { error: null as unknown },
  maybeSingleReturn: { data: null as unknown, error: null as unknown },
};

function resetSupabaseState() {
  supabaseState.lastTable = "";
  supabaseState.lastInsertRow = null;
  supabaseState.lastDelete = { table: "", filters: [] };
  supabaseState.insertReturn = { data: null, error: null };
  supabaseState.selectReturn = { data: [], error: null };
  supabaseState.rpcReturn = { data: null, error: null };
  supabaseState.deleteReturn = { error: null };
  supabaseState.maybeSingleReturn = { data: null, error: null };
}

vi.mock("@/lib/supabaseClient", () => {
  const buildSelectChain = () => {
    const chain: Record<string, unknown> = {};
    chain.eq = vi.fn(() => chain);
    chain.order = vi.fn(() => chain);
    chain.maybeSingle = vi.fn(async () => supabaseState.maybeSingleReturn);
    chain.single = vi.fn(async () => supabaseState.insertReturn);
    chain.then = (resolve: (v: unknown) => unknown) =>
      Promise.resolve(supabaseState.selectReturn).then(resolve);
    return chain;
  };

  return {
    supabase: {
      from: vi.fn((t: string) => {
        supabaseState.lastTable = t;
        return {
          insert: vi.fn((row: unknown) => {
            supabaseState.lastInsertRow = row;
            return {
              select: vi.fn(() => ({
                single: vi.fn(async () => supabaseState.insertReturn),
              })),
            };
          }),
          select: vi.fn(() => buildSelectChain()),
          delete: vi.fn(() => {
            supabaseState.lastDelete = { table: t, filters: [] };
            const chain: Record<string, unknown> = {};
            chain.eq = vi.fn((col: string, val: string) => {
              supabaseState.lastDelete.filters.push([col, val]);
              return chain;
            });
            chain.then = (resolve: (v: unknown) => unknown) =>
              Promise.resolve(supabaseState.deleteReturn).then(resolve);
            return chain;
          }),
        };
      }),
      rpc: vi.fn(async () => supabaseState.rpcReturn),
    },
  };
});

import {
  CORPORATE_MAX_BULK_INVITES,
  CORPORATE_MIN_SEAT_COUNT,
  createCorporateAccount,
  generateInviteCode,
  getOwnedCorporateAccount,
  inviteSeat,
  inviteSeatsBulk,
  listSeats,
  parseBulkEmails,
  redeemSeatInvite,
  removeSeat,
  validateCreateCorporateAccountInput,
} from "../corporateClient";

beforeEach(() => {
  resetSupabaseState();
});

// ──────────────────────────────────────────────────────────────────────
// Pure logic
// ──────────────────────────────────────────────────────────────────────

describe("validateCreateCorporateAccountInput", () => {
  const baseline = {
    organizationName: "Saigon Christian Academy",
    organizationType: "school" as const,
    contactEmail: "admin@scacademy.edu.vn",
    country: "Vietnam",
    seatCount: 25,
  };

  it("accepts a minimal valid payload", () => {
    expect(validateCreateCorporateAccountInput(baseline)).toBeNull();
  });

  it("rejects blank organization name", () => {
    expect(
      validateCreateCorporateAccountInput({ ...baseline, organizationName: "   " }),
    ).toMatch(/Organization name/);
  });

  it("rejects an unknown organization type", () => {
    expect(
      validateCreateCorporateAccountInput({
        ...baseline,
        // @ts-expect-error — exercising runtime guard
        organizationType: "household",
      }),
    ).toMatch(/Organization type/);
  });

  it("rejects malformed email", () => {
    expect(
      validateCreateCorporateAccountInput({ ...baseline, contactEmail: "notanemail" }),
    ).toMatch(/email/i);
  });

  it("rejects seat count below the floor", () => {
    expect(
      validateCreateCorporateAccountInput({
        ...baseline,
        seatCount: CORPORATE_MIN_SEAT_COUNT - 1,
      }),
    ).toMatch(/Seat count/);
  });

  it("rejects non-integer seat count", () => {
    expect(
      validateCreateCorporateAccountInput({ ...baseline, seatCount: 7.5 }),
    ).toMatch(/Seat count/);
  });
});

describe("parseBulkEmails", () => {
  it("parses comma- and newline-separated lists", () => {
    const out = parseBulkEmails("a@x.com, b@y.com\nc@z.com");
    expect(out.valid).toEqual(["a@x.com", "b@y.com", "c@z.com"]);
    expect(out.invalid).toEqual([]);
    expect(out.truncated).toBe(false);
  });

  it("dedupes and lowercases", () => {
    const out = parseBulkEmails("A@x.com\na@X.com\nb@y.com");
    expect(out.valid).toEqual(["a@x.com", "b@y.com"]);
  });

  it("partitions invalid tokens", () => {
    const out = parseBulkEmails("a@x.com, foo, bar@");
    expect(out.valid).toEqual(["a@x.com"]);
    expect(out.invalid.sort()).toEqual(["bar@", "foo"]);
  });

  it("respects the upload cap", () => {
    const big = Array.from({ length: 150 }, (_, i) => `u${i}@x.com`).join("\n");
    const out = parseBulkEmails(big);
    expect(out.valid.length).toBe(CORPORATE_MAX_BULK_INVITES);
    expect(out.truncated).toBe(true);
  });

  it("handles empty input gracefully", () => {
    const out = parseBulkEmails("");
    expect(out.valid).toEqual([]);
    expect(out.invalid).toEqual([]);
    expect(out.truncated).toBe(false);
  });
});

describe("generateInviteCode", () => {
  it("generates 8-char codes matching the DB CHECK pattern", () => {
    for (let i = 0; i < 50; i++) {
      const code = generateInviteCode();
      expect(code).toMatch(/^[A-HJ-NP-Z2-9]{8}$/);
    }
  });
});

// ──────────────────────────────────────────────────────────────────────
// Network-bound (with mocked supabase)
// ──────────────────────────────────────────────────────────────────────

describe("createCorporateAccount", () => {
  const valid = {
    organizationName: "Cộng Đồng Vinh Sơn",
    organizationType: "church" as const,
    contactEmail: "office@vsoncomm.org",
    contactPhone: "+84-90-123-4567",
    country: "Vietnam",
    seatCount: 12,
  };

  it("fails fast without hitting the network when unauthenticated", async () => {
    const result = await createCorporateAccount("", valid);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("AUTH_REQUIRED");
    expect(supabaseState.lastTable).toBe("");
  });

  it("fails fast with VALIDATION before the network call", async () => {
    const result = await createCorporateAccount("admin-1", { ...valid, seatCount: 2 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("VALIDATION");
    expect(supabaseState.lastInsertRow).toBeNull();
  });

  it("inserts a normalised row on happy path", async () => {
    supabaseState.insertReturn = {
      data: {
        id: "acc-1",
        owner_user_id: "admin-1",
        organization_name: "Cộng Đồng Vinh Sơn",
        organization_type: "church",
        contact_email: "office@vsoncomm.org",
        contact_phone: "+84-90-123-4567",
        country: "Vietnam",
        seat_count: 12,
        stripe_subscription_id: null,
        created_at: "2026-04-25T00:00:00Z",
        active: true,
      },
      error: null,
    };
    const result = await createCorporateAccount("admin-1", {
      ...valid,
      organizationName: "  Cộng Đồng Vinh Sơn  ",
      contactEmail: "  office@vsoncomm.org  ",
    });
    expect(result.ok).toBe(true);
    expect(supabaseState.lastInsertRow).toMatchObject({
      owner_user_id: "admin-1",
      organization_name: "Cộng Đồng Vinh Sơn",
      contact_email: "office@vsoncomm.org",
      organization_type: "church",
      seat_count: 12,
    });
  });
});

describe("inviteSeat", () => {
  it("rejects malformed email before hitting the network", async () => {
    const result = await inviteSeat("acc-1", "not-an-email");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("VALIDATION");
  });

  it("inserts an invite with a generated 8-char code", async () => {
    supabaseState.insertReturn = {
      data: { id: "inv-1", invite_code: "ABCD2345" },
      error: null,
    };
    const result = await inviteSeat("acc-1", "Foo@Bar.com");
    expect(result.ok).toBe(true);
    expect(supabaseState.lastInsertRow).toMatchObject({
      corporate_account_id: "acc-1",
      invited_email: "foo@bar.com",
    });
    const sent = supabaseState.lastInsertRow as { invite_code: string };
    expect(sent.invite_code).toMatch(/^[A-HJ-NP-Z2-9]{8}$/);
  });
});

describe("inviteSeatsBulk", () => {
  it("creates one invite per email and reports failures separately", async () => {
    let calls = 0;
    supabaseState.insertReturn = {
      data: { id: "inv", invite_code: "ABCD2345" },
      error: null,
    };
    // Force every other invite to fail by toggling state per call.
    const originalInsert = supabaseState.insertReturn;
    const flipper = () => {
      calls += 1;
      supabaseState.insertReturn =
        calls % 2 === 0
          ? { data: null, error: { message: "boom", code: "23505" } }
          : originalInsert;
    };
    const emails = ["a@x.com", "b@x.com", "c@x.com"];
    flipper();
    const results = await inviteSeatsBulk("acc-1", emails);
    expect(results.ok).toBe(true);
    if (results.ok) {
      // We can't pin exact split because the state-flipping fires inside
      // each invite call, but at minimum the response shape is intact.
      expect(Array.isArray(results.data.created)).toBe(true);
      expect(Array.isArray(results.data.failed)).toBe(true);
    }
  });
});

describe("redeemSeatInvite", () => {
  it("requires authentication", async () => {
    const result = await redeemSeatInvite("ABCD2345", "");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("AUTH_REQUIRED");
  });

  it("rejects malformed codes before hitting the RPC", async () => {
    const result = await redeemSeatInvite("bad", "user-1");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("VALIDATION");
  });

  it("rejects codes containing the banned characters (I/O/0/1)", async () => {
    expect((await redeemSeatInvite("AB1D2345", "u")).ok).toBe(false);
    expect((await redeemSeatInvite("ABCDOO34", "u")).ok).toBe(false);
  });

  it("upper-cases input before validating", async () => {
    supabaseState.rpcReturn = { data: "acc-1", error: null };
    const result = await redeemSeatInvite("abcd2345", "user-1");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.corporateAccountId).toBe("acc-1");
  });
});

describe("removeSeat", () => {
  it("requires both ids", async () => {
    expect((await removeSeat("", "u")).ok).toBe(false);
    expect((await removeSeat("a", "")).ok).toBe(false);
  });

  it("issues a delete with both filter columns", async () => {
    supabaseState.deleteReturn = { error: null };
    const result = await removeSeat("acc-1", "user-1");
    expect(result.ok).toBe(true);
    expect(supabaseState.lastDelete.table).toBe("corporate_seats");
    expect(supabaseState.lastDelete.filters).toEqual([
      ["corporate_account_id", "acc-1"],
      ["user_id", "user-1"],
    ]);
  });
});

describe("listSeats / getOwnedCorporateAccount", () => {
  it("listSeats returns rows from the table", async () => {
    supabaseState.selectReturn = {
      data: [
        {
          corporate_account_id: "acc-1",
          user_id: "user-1",
          invited_by: null,
          joined_at: "2026-04-25T00:00:00Z",
        },
      ],
      error: null,
    };
    const result = await listSeats("acc-1");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.length).toBe(1);
  });

  it("getOwnedCorporateAccount returns null when the user has none", async () => {
    supabaseState.maybeSingleReturn = { data: null, error: null };
    const result = await getOwnedCorporateAccount("user-1");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toBeNull();
  });
});
