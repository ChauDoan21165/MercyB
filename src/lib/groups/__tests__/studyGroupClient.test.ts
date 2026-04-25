// Unit tests for studyGroupClient.
//
// Scope: RPC paths (joinGroup, kickMember), guard logic (no userId →
// early return), and the snake_case → camelCase mappers (toGroup,
// toMember). The .from(...) read paths rely on RLS and are covered by
// integration testing rather than unit tests against the supabaseMock,
// which doesn't currently support thenable chains.

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabaseClient", async () => {
  const mod = await vi.importActual<any>("@/test/mocks/supabaseMock");
  const supabase = mod.createSupabaseMock();
  return { supabase, __mock: supabase };
});

import * as SupaMod from "@/lib/supabaseClient";
const supabaseMock = (SupaMod as any).__mock;

import {
  joinGroup,
  leaveGroup,
  kickMember,
  createGroup,
  toGroup,
  toMember,
} from "../studyGroupClient";

beforeEach(() => {
  vi.clearAllMocks();
  supabaseMock.rpc.mockResolvedValue({ data: null, error: null });
});

describe("toGroup mapper", () => {
  it("maps snake_case Supabase row to camelCase StudyGroup", () => {
    const row = {
      id: "g1",
      name: "Vietnamese IELTS",
      description: "Daily 30-min practice",
      owner_user_id: "u1",
      is_private: true,
      invite_code: "ABC12345",
      created_at: "2026-04-24T12:00:00Z",
      member_count: 7,
    };
    expect(toGroup(row)).toEqual({
      id: "g1",
      name: "Vietnamese IELTS",
      description: "Daily 30-min practice",
      ownerUserId: "u1",
      isPrivate: true,
      inviteCode: "ABC12345",
      createdAt: "2026-04-24T12:00:00Z",
      memberCount: 7,
    });
  });

  it("preserves null description / invite_code", () => {
    const row = {
      id: "g2",
      name: "Public",
      description: null,
      owner_user_id: "u1",
      is_private: false,
      invite_code: null,
      created_at: "2026-04-24T12:00:00Z",
      member_count: 0,
    };
    const g = toGroup(row);
    expect(g.description).toBeNull();
    expect(g.inviteCode).toBeNull();
    expect(g.isPrivate).toBe(false);
  });

  it("coerces missing fields to safe defaults", () => {
    const g = toGroup({});
    expect(g).toEqual({
      id: "",
      name: "",
      description: null,
      ownerUserId: "",
      isPrivate: false,
      inviteCode: null,
      createdAt: "",
      memberCount: 0,
    });
  });
});

describe("toMember mapper", () => {
  it("maps role 'owner' / 'admin' / 'member' verbatim", () => {
    expect(toMember({ role: "owner" }).role).toBe("owner");
    expect(toMember({ role: "admin" }).role).toBe("admin");
    expect(toMember({ role: "member" }).role).toBe("member");
  });

  it("falls back to 'member' for unknown roles", () => {
    expect(toMember({ role: "wizard" }).role).toBe("member");
    expect(toMember({}).role).toBe("member");
  });

  it("maps the rest of the row", () => {
    const m = toMember({
      group_id: "g1",
      user_id: "u1",
      joined_at: "2026-04-24T12:00:00Z",
      role: "admin",
    });
    expect(m).toEqual({
      groupId: "g1",
      userId: "u1",
      joinedAt: "2026-04-24T12:00:00Z",
      role: "admin",
    });
  });
});

describe("joinGroup", () => {
  it("returns ok:true with groupId on successful RPC", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: { ok: true, group_id: "g1" },
      error: null,
    });

    const result = await joinGroup("g1");
    expect(supabaseMock.rpc).toHaveBeenCalledWith(
      "join_study_group",
      { p_group_id: "g1", p_invite_code: null },
    );
    expect(result).toEqual({ ok: true, groupId: "g1" });
  });

  it("forwards inviteCode to the RPC for private groups", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: { ok: true, group_id: "g2" },
      error: null,
    });

    await joinGroup("g2", "ABC12345");
    expect(supabaseMock.rpc).toHaveBeenCalledWith(
      "join_study_group",
      { p_group_id: "g2", p_invite_code: "ABC12345" },
    );
  });

  it("propagates structured errors from the RPC", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: { ok: false, error: "invalid_invite_code" },
      error: null,
    });

    const result = await joinGroup("g2", "WRONGCODE");
    expect(result).toEqual({ ok: false, error: "invalid_invite_code" });
  });

  it("returns rpc_failed when supabase returns a transport error", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: null,
      error: { message: "boom" },
    });

    const result = await joinGroup("g1");
    expect(result).toEqual({ ok: false, error: "rpc_failed" });
  });

  it("returns rpc_failed when the RPC payload is malformed", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: { something: "weird" },
      error: null,
    });

    const result = await joinGroup("g1");
    expect(result).toEqual({ ok: false, error: "rpc_failed" });
  });
});

describe("kickMember", () => {
  it("returns ok:true on successful RPC", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: { ok: true },
      error: null,
    });

    const result = await kickMember("g1", "u2");
    expect(supabaseMock.rpc).toHaveBeenCalledWith(
      "kick_study_group_member",
      { p_group_id: "g1", p_user_id: "u2" },
    );
    expect(result).toEqual({ ok: true });
  });

  it("propagates not_owner error from the RPC", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: { ok: false, error: "not_owner" },
      error: null,
    });

    const result = await kickMember("g1", "u2");
    expect(result).toEqual({ ok: false, error: "not_owner" });
  });

  it("propagates cannot_kick_owner error", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: { ok: false, error: "cannot_kick_owner" },
      error: null,
    });

    const result = await kickMember("g1", "owner-uid");
    expect(result).toEqual({ ok: false, error: "cannot_kick_owner" });
  });

  it("returns rpc_failed when the RPC errors out", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: null,
      error: { message: "denied" },
    });
    const result = await kickMember("g1", "u2");
    expect(result).toEqual({ ok: false, error: "rpc_failed" });
  });
});

describe("leaveGroup guard", () => {
  it("returns ok:false without touching supabase when userId is missing", async () => {
    const result = await leaveGroup(null, "g1");
    expect(result).toEqual({ ok: false });
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });
});

describe("createGroup guards", () => {
  it("returns null without touching supabase when userId is missing", async () => {
    const result = await createGroup({
      userId: undefined,
      name: "Valid name",
    });
    expect(result).toBeNull();
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("rejects names shorter than 2 chars", async () => {
    const result = await createGroup({
      userId: "u1",
      name: " a ",
    });
    expect(result).toBeNull();
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("rejects names longer than 80 chars", async () => {
    const result = await createGroup({
      userId: "u1",
      name: "x".repeat(81),
    });
    expect(result).toBeNull();
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });
});
