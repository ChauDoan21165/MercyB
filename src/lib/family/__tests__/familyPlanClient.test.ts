import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabaseClient", async () => {
  const mod = await vi.importActual<any>("@/test/mocks/supabaseMock");
  const supabase = mod.createSupabaseMock();
  return { supabase, __mock: supabase };
});

import * as SupaMod from "@/lib/supabaseClient";
const supabaseMock = (SupaMod as any).__mock;

import {
  createFamilyPlan,
  inviteMember,
  redeemInvite,
  removeMember,
  leaveFamily,
  generateInviteCode,
  listMembers,
} from "../familyPlanClient";

beforeEach(() => {
  vi.clearAllMocks();
  supabaseMock.rpc.mockResolvedValue({ data: null, error: null });
});

function chain(terminalPayload: { data: unknown; error: unknown } | null) {
  const c: any = {};
  const ret = () => c;
  c.select = vi.fn(ret);
  c.insert = vi.fn(ret);
  c.update = vi.fn(ret);
  c.delete = vi.fn(ret);
  c.eq = vi.fn(ret);
  c.is = vi.fn(ret);
  c.gt = vi.fn(ret);
  c.order = vi.fn(ret);
  c.maybeSingle = vi.fn(() =>
    Promise.resolve(terminalPayload ?? { data: null, error: null }),
  );
  c.then = (resolve: (v: unknown) => unknown) =>
    resolve(terminalPayload ?? { data: [], error: null });
  return c;
}

describe("generateInviteCode", () => {
  it("returns 8-char strings from the unambiguous alphabet", () => {
    for (let i = 0; i < 50; i++) {
      const code = generateInviteCode();
      expect(code).toMatch(/^[A-HJ-NP-Z2-9]{8}$/);
    }
  });
  it("avoids I, O, 0, 1 in many samples", () => {
    for (let i = 0; i < 100; i++) {
      const code = generateInviteCode();
      expect(code).not.toMatch(/[IO01]/);
    }
  });
});

describe("createFamilyPlan", () => {
  it("rejects empty owner without DB hit", async () => {
    expect(await createFamilyPlan("", 5)).toBeNull();
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("rejects out-of-range maxMembers without DB hit", async () => {
    expect(await createFamilyPlan("u1", 1)).toBeNull();
    expect(await createFamilyPlan("u1", 9)).toBeNull();
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("inserts and maps the row to camelCase", async () => {
    supabaseMock.from.mockReturnValueOnce(
      chain({
        data: {
          id: "plan-1",
          owner_user_id: "u1",
          stripe_subscription_id: null,
          max_members: 5,
          active: true,
          created_at: "2026-04-25T00:00:00Z",
        },
        error: null,
      }),
    );

    const plan = await createFamilyPlan("u1", 5);
    expect(plan).toMatchObject({
      id: "plan-1",
      ownerUserId: "u1",
      maxMembers: 5,
      active: true,
    });
  });

  it("returns null on DB error", async () => {
    supabaseMock.from.mockReturnValueOnce(
      chain({ data: null, error: { message: "permission denied" } }),
    );
    expect(await createFamilyPlan("u1", 5)).toBeNull();
  });
});

describe("inviteMember", () => {
  it("rejects empty plan id", async () => {
    expect(await inviteMember("", null)).toBeNull();
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("inserts an invite with a generated 8-char code", async () => {
    const insertSpy = vi.fn(function (this: any, _row: Record<string, unknown>) {
      return this;
    });
    const c = chain({
      data: {
        id: "i1",
        family_plan_id: "p1",
        invited_email: "test@example.com",
        invite_code: "ABCDEFGH",
        expires_at: "2099-01-01T00:00:00Z",
        redeemed_by_user_id: null,
        redeemed_at: null,
        created_at: "2026-04-25T00:00:00Z",
      },
      error: null,
    });
    c.insert = insertSpy;
    supabaseMock.from.mockReturnValueOnce(c);

    const invite = await inviteMember("p1", "test@example.com");
    expect(invite?.inviteCode).toBe("ABCDEFGH");
    const insertedRow = insertSpy.mock.calls[0][0];
    expect(insertedRow.invite_code).toMatch(/^[A-HJ-NP-Z2-9]{8}$/);
    expect(insertedRow.invited_email).toBe("test@example.com");
  });

  it("normalizes empty/whitespace email to null", async () => {
    const insertSpy = vi.fn(function (this: any, _row: Record<string, unknown>) {
      return this;
    });
    const c = chain({
      data: { id: "i1", family_plan_id: "p1", invite_code: "ABCDEFGH" },
      error: null,
    });
    c.insert = insertSpy;
    supabaseMock.from.mockReturnValueOnce(c);

    await inviteMember("p1", "   ");
    expect(insertSpy.mock.calls[0][0].invited_email).toBeNull();
  });
});

describe("redeemInvite", () => {
  it("rejects unauth callers without RPC", async () => {
    const result = await redeemInvite("ABCDEFGH", "");
    expect(result).toEqual({ error: "not authenticated" });
    expect(supabaseMock.rpc).not.toHaveBeenCalled();
  });

  it("rejects empty code without RPC", async () => {
    const result = await redeemInvite("   ", "u1");
    expect(result).toEqual({ error: "missing invite code" });
    expect(supabaseMock.rpc).not.toHaveBeenCalled();
  });

  it("calls RPC with uppercased trimmed code and returns plan id", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: "plan-A",
      error: null,
    });

    const result = await redeemInvite("  abcdefgh  ", "u1");
    expect(supabaseMock.rpc).toHaveBeenCalledWith(
      "family_plan_redeem_invite",
      { p_code: "ABCDEFGH" },
    );
    expect(result).toEqual({ familyPlanId: "plan-A" });
  });

  it("humanizes 'already in a family plan' RPC error", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: null,
      error: { message: "already in a family plan", code: "22023" },
    });
    const result = await redeemInvite("ABCDEFGH", "u1");
    expect(result).toEqual({ error: "already in a family plan" });
  });

  it("humanizes 'invite expired'", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: null,
      error: { message: "invite expired" },
    });
    const result = await redeemInvite("ABCDEFGH", "u1");
    expect(result).toEqual({ error: "invite expired" });
  });

  it("humanizes 'family plan is full' from member-cap trigger", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: null,
      error: { message: "family plan p1 is full (max_members = 5)" },
    });
    const result = await redeemInvite("ABCDEFGH", "u1");
    expect(result).toEqual({ error: "family plan is full" });
  });
});

describe("removeMember", () => {
  it("rejects empty ids", async () => {
    expect(await removeMember("", "u1")).toBe(false);
    expect(await removeMember("p1", "")).toBe(false);
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("returns true on success", async () => {
    supabaseMock.from.mockReturnValueOnce(chain({ data: null, error: null }));
    expect(await removeMember("p1", "u1")).toBe(true);
  });

  it("returns false on error", async () => {
    supabaseMock.from.mockReturnValueOnce(
      chain({ data: null, error: { message: "permission denied" } }),
    );
    expect(await removeMember("p1", "u1")).toBe(false);
  });
});

describe("leaveFamily", () => {
  it("returns true when delete succeeds", async () => {
    supabaseMock.from.mockReturnValueOnce(chain({ data: null, error: null }));
    expect(await leaveFamily("u1")).toBe(true);
  });

  it("returns false on empty userId", async () => {
    expect(await leaveFamily("")).toBe(false);
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });
});

describe("listMembers", () => {
  it("returns mapped rows", async () => {
    const rows = [
      {
        family_plan_id: "p1",
        user_id: "u1",
        invited_by: null,
        joined_at: "2026-04-25T00:00:00Z",
      },
      {
        family_plan_id: "p1",
        user_id: "u2",
        invited_by: "u1",
        joined_at: "2026-04-26T00:00:00Z",
      },
    ];
    supabaseMock.from.mockReturnValueOnce(chain({ data: rows, error: null }));
    const result = await listMembers("p1");
    expect(result).toHaveLength(2);
    expect(result[1].invitedBy).toBe("u1");
  });

  it("returns [] on error", async () => {
    supabaseMock.from.mockReturnValueOnce(
      chain({ data: null, error: { message: "boom" } }),
    );
    expect(await listMembers("p1")).toEqual([]);
  });
});
