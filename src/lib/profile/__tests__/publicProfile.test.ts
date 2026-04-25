// src/lib/profile/__tests__/publicProfile.test.ts
//
// Step 6 (Community) — pure-function validators + privacy gating for
// the public profile surface. The Supabase round-trips are stubbed via
// vi.mock so the tests never hit the network.

import { describe, expect, it, vi, beforeEach } from "vitest";

import {
  validateUsername,
  validateBio,
  validateCountry,
  USERNAME_MIN,
  USERNAME_MAX,
  BIO_MAX,
  getPublicProfile,
  togglePublic,
  updateUsername,
  updateBio,
} from "../publicProfile";

const supabaseMock = {
  rpc: vi.fn(),
  from: vi.fn(),
};

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    rpc: (name: string, args?: unknown) => supabaseMock.rpc(name, args),
    from: (table: string) => supabaseMock.from(table),
  },
}));

beforeEach(() => {
  supabaseMock.rpc.mockReset();
  supabaseMock.from.mockReset();
});

describe("validateUsername", () => {
  it("accepts 3–20 char alphanumeric+underscore strings", () => {
    expect(validateUsername("abc")).toBeNull();
    expect(validateUsername("abc_123")).toBeNull();
    expect(validateUsername("user_name_99")).toBeNull();
    expect(validateUsername("a".repeat(USERNAME_MAX))).toBeNull();
  });

  it("rejects empty + too-short usernames", () => {
    expect(validateUsername("")).toBe("empty");
    expect(validateUsername("   ")).toBe("empty");
    expect(validateUsername("a".repeat(USERNAME_MIN - 1))).toBe("too_short");
  });

  it("rejects too-long usernames", () => {
    expect(validateUsername("a".repeat(USERNAME_MAX + 1))).toBe("too_long");
  });

  it("rejects usernames with disallowed characters", () => {
    expect(validateUsername("ab c")).toBe("invalid_chars");
    expect(validateUsername("ab-cd")).toBe("invalid_chars");
    expect(validateUsername("ab.cd")).toBe("invalid_chars");
    expect(validateUsername("ab😀cd")).toBe("invalid_chars");
    expect(validateUsername("ab/cd")).toBe("invalid_chars");
  });
});

describe("validateBio", () => {
  it("allows null / empty / short bios", () => {
    expect(validateBio(null)).toBeNull();
    expect(validateBio(undefined)).toBeNull();
    expect(validateBio("")).toBeNull();
    expect(validateBio("Short bio")).toBeNull();
  });

  it("allows the exact max length", () => {
    expect(validateBio("x".repeat(BIO_MAX))).toBeNull();
  });

  it("rejects bios longer than 280 chars", () => {
    expect(validateBio("x".repeat(BIO_MAX + 1))).toBe("too_long");
  });
});

describe("validateCountry", () => {
  it("allows null / empty", () => {
    expect(validateCountry(null)).toBeNull();
    expect(validateCountry(undefined)).toBeNull();
    expect(validateCountry("")).toBeNull();
  });

  it("accepts ISO alpha-2 uppercase codes", () => {
    expect(validateCountry("VN")).toBeNull();
    expect(validateCountry("US")).toBeNull();
  });

  it("rejects lowercase, 1-letter, or 3-letter codes", () => {
    expect(validateCountry("vn")).toBe("invalid_format");
    expect(validateCountry("V")).toBe("invalid_format");
    expect(validateCountry("VNM")).toBe("invalid_format");
    expect(validateCountry("V1")).toBe("invalid_format");
  });
});

describe("getPublicProfile (privacy gating)", () => {
  it("returns null when the username doesn't exist", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({ data: [], error: null });
    expect(await getPublicProfile("ghost")).toBeNull();
  });

  it("returns null when RPC returns no rows (private profile)", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({ data: null, error: null });
    expect(await getPublicProfile("private_user")).toBeNull();
  });

  it("returns null on RPC error (no leakage)", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: null,
      error: { message: "boom" },
    });
    expect(await getPublicProfile("anything")).toBeNull();
  });

  it("returns the profile row when public", async () => {
    const row = {
      id: "u1",
      username: "chau",
      display_name: "Chau",
      bio: "Hello",
      country: "VN",
      avatar_url: null,
      learning_started_at: null,
      streak_current: 5,
      streak_longest: 10,
      total_xp: 1200,
      lessons_completed: 8,
    };
    supabaseMock.rpc.mockResolvedValueOnce({ data: [row], error: null });
    const result = await getPublicProfile("chau");
    expect(result).toEqual(row);
    expect(supabaseMock.rpc).toHaveBeenCalledWith(
      "get_public_profile_by_username",
      { p_username: "chau" },
    );
  });

  it("trims whitespace from username before lookup", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({ data: null, error: null });
    await getPublicProfile("   chau   ");
    expect(supabaseMock.rpc).toHaveBeenCalledWith(
      "get_public_profile_by_username",
      { p_username: "chau" },
    );
  });

  it("returns null for empty / whitespace-only usernames without calling RPC", async () => {
    expect(await getPublicProfile("")).toBeNull();
    expect(await getPublicProfile("   ")).toBeNull();
    expect(supabaseMock.rpc).not.toHaveBeenCalled();
  });
});

describe("togglePublic", () => {
  it("updates is_public on the owner's row", async () => {
    const eqMock = vi.fn().mockResolvedValue({ error: null });
    const updateMock = vi.fn().mockReturnValue({ eq: eqMock });
    supabaseMock.from.mockReturnValueOnce({ update: updateMock });
    const { error } = await togglePublic("u1", true);
    expect(error).toBeNull();
    expect(supabaseMock.from).toHaveBeenCalledWith("profiles");
    expect(updateMock).toHaveBeenCalledWith({ is_public: true });
    expect(eqMock).toHaveBeenCalledWith("id", "u1");
  });
});

describe("updateUsername", () => {
  it("rejects invalid usernames before hitting the DB", async () => {
    const result = await updateUsername("u1", "ab");
    expect(result.error).toBe("too_short");
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("returns 'taken' on unique-constraint violation", async () => {
    const eqMock = vi
      .fn()
      .mockResolvedValue({ error: { code: "23505", message: "duplicate key" } });
    const updateMock = vi.fn().mockReturnValue({ eq: eqMock });
    supabaseMock.from.mockReturnValueOnce({ update: updateMock });
    const result = await updateUsername("u1", "valid_name");
    expect(result.error).toBe("taken");
  });

  it("returns null on success", async () => {
    const eqMock = vi.fn().mockResolvedValue({ error: null });
    const updateMock = vi.fn().mockReturnValue({ eq: eqMock });
    supabaseMock.from.mockReturnValueOnce({ update: updateMock });
    const result = await updateUsername("u1", "valid_name");
    expect(result.error).toBeNull();
    expect(updateMock).toHaveBeenCalledWith({ username: "valid_name" });
  });
});

describe("updateBio", () => {
  it("rejects bios over 280 chars", async () => {
    const result = await updateBio("u1", "x".repeat(BIO_MAX + 1));
    expect(result.error).toBe("too_long");
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("saves null when bio is whitespace-only (clearing)", async () => {
    const eqMock = vi.fn().mockResolvedValue({ error: null });
    const updateMock = vi.fn().mockReturnValue({ eq: eqMock });
    supabaseMock.from.mockReturnValueOnce({ update: updateMock });
    await updateBio("u1", "   ");
    expect(updateMock).toHaveBeenCalledWith({ bio: null });
  });

  it("saves the bio string on success", async () => {
    const eqMock = vi.fn().mockResolvedValue({ error: null });
    const updateMock = vi.fn().mockReturnValue({ eq: eqMock });
    supabaseMock.from.mockReturnValueOnce({ update: updateMock });
    await updateBio("u1", "hello world");
    expect(updateMock).toHaveBeenCalledWith({ bio: "hello world" });
  });
});
