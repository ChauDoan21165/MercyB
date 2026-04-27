// supabase/functions/_shared/__tests__/accountConversion.test.ts
//
// Locks the email/password conversion path:
//   - validateEmail / validatePassword boundary cases
//   - convertAnonymousToEmail short-circuits on bad input (no admin call)
//   - rejects non-anonymous source users
//   - maps Supabase admin errors to the right ConversionStatus
//   - writes the right telemetry row on success and every failure mode

import { describe, it, expect, vi } from "vitest";

import {
  type AdminAuthSurface,
  type TelemetryWriter,
  convertAnonymousToEmail,
  mapAdminUpdateError,
  validateEmail,
  validatePassword,
  MIN_PASSWORD_LENGTH,
} from "../accountConversion";

function makeAdmin(overrides: Partial<AdminAuthSurface> = {}): AdminAuthSurface {
  return {
    getUserById: vi.fn().mockResolvedValue({
      data: { user: { id: "anon-1", is_anonymous: true } },
      error: null,
    }),
    updateUserById: vi.fn().mockResolvedValue({
      data: { user: { id: "anon-1" } },
      error: null,
    }),
    ...overrides,
  };
}

function makeTelemetry(): TelemetryWriter & { calls: Array<Record<string, unknown>> } {
  const calls: Array<Record<string, unknown>> = [];
  return {
    calls,
    recordConversion: async (input) => {
      calls.push({ ...input });
    },
  };
}

// ── validateEmail ────────────────────────────────────────────────────

describe("validateEmail", () => {
  it("accepts a normal email", () => {
    expect(validateEmail("user@example.com")).toBeNull();
  });

  it("rejects empty / whitespace / non-string", () => {
    expect(validateEmail("")).toBe("empty");
    expect(validateEmail("   ")).toBe("empty");
    // @ts-expect-error — runtime guard
    expect(validateEmail(null)).toBe("empty");
    // @ts-expect-error
    expect(validateEmail(42)).toBe("empty");
  });

  it("rejects a malformed string", () => {
    expect(validateEmail("not-an-email")).toBe("invalid_format");
    expect(validateEmail("user@")).toBe("invalid_format");
    expect(validateEmail("@example.com")).toBe("invalid_format");
    expect(validateEmail("user@example")).toBe("invalid_format");
    expect(validateEmail("user @example.com")).toBe("invalid_format");
  });

  it("rejects emails over 320 chars", () => {
    const tooLong = "a".repeat(310) + "@example.com";
    expect(validateEmail(tooLong)).toBe("too_long");
  });
});

// ── validatePassword ─────────────────────────────────────────────────

describe("validatePassword", () => {
  it("accepts a password with letters, digits, and ≥ 8 chars", () => {
    expect(validatePassword("password1")).toBeNull();
    expect(validatePassword("aLongerOne42")).toBeNull();
  });

  it("rejects empty", () => {
    expect(validatePassword("")).toBe("empty");
    // @ts-expect-error
    expect(validatePassword(null)).toBe("empty");
  });

  it("rejects too short", () => {
    expect(validatePassword("a1")).toBe("too_short");
    // Strictly under the minimum: MIN_PASSWORD_LENGTH - 1 chars total.
    expect(validatePassword("a".repeat(MIN_PASSWORD_LENGTH - 2) + "1")).toBe("too_short");
  });

  it("accepts exactly MIN_PASSWORD_LENGTH chars (boundary)", () => {
    expect(validatePassword("a".repeat(MIN_PASSWORD_LENGTH - 1) + "1")).toBeNull();
  });

  it("rejects too long (> 200 chars)", () => {
    expect(validatePassword("a1".repeat(101))).toBe("too_long");
  });

  it("rejects digits-only", () => {
    expect(validatePassword("12345678")).toBe("no_letter");
  });

  it("rejects letters-only", () => {
    expect(validatePassword("abcdefgh")).toBe("no_digit");
  });
});

// ── mapAdminUpdateError ──────────────────────────────────────────────

describe("mapAdminUpdateError", () => {
  it("maps email-exists shapes to failed_email_in_use", () => {
    expect(mapAdminUpdateError({ message: "User already registered" })).toBe("failed_email_in_use");
    expect(mapAdminUpdateError({ message: "email_exists already in use" })).toBe("failed_email_in_use");
    expect(mapAdminUpdateError({ message: "anything", code: "email_exists" })).toBe("failed_email_in_use");
    expect(mapAdminUpdateError({ message: "anything", code: "user_already_exists" })).toBe("failed_email_in_use");
  });

  it("maps weak-password shapes to failed_weak_password", () => {
    expect(mapAdminUpdateError({ message: "anything", code: "weak_password" })).toBe("failed_weak_password");
    expect(mapAdminUpdateError({ message: "Password is too weak" })).toBe("failed_weak_password");
  });

  it("falls through to failed_other on unknown errors", () => {
    expect(mapAdminUpdateError({ message: "something unexpected" })).toBe("failed_other");
    expect(mapAdminUpdateError({ message: "" })).toBe("failed_other");
  });
});

// ── convertAnonymousToEmail ──────────────────────────────────────────

describe("convertAnonymousToEmail — short-circuit on bad input", () => {
  it("rejects bad email without calling the admin API", async () => {
    const admin = makeAdmin();
    const tel = makeTelemetry();
    const result = await convertAnonymousToEmail(
      { anonUserId: "anon-1", email: "not-an-email", password: "valid-pw1" },
      admin,
      tel,
    );
    expect(result.ok).toBe(false);
    expect(result.error_code).toBe("email_invalid");
    expect(admin.getUserById).not.toHaveBeenCalled();
    expect(admin.updateUserById).not.toHaveBeenCalled();
    expect(tel.calls.length).toBe(1);
    expect(tel.calls[0].status).toBe("failed_other");
  });

  it("rejects weak password without calling the admin API", async () => {
    const admin = makeAdmin();
    const tel = makeTelemetry();
    const result = await convertAnonymousToEmail(
      { anonUserId: "anon-1", email: "user@example.com", password: "abc" },
      admin,
      tel,
    );
    expect(result.error_code).toBe("password_invalid");
    expect(result.status).toBe("failed_weak_password");
    expect(admin.updateUserById).not.toHaveBeenCalled();
    expect(tel.calls[0].status).toBe("failed_weak_password");
  });
});

describe("convertAnonymousToEmail — anon enforcement", () => {
  it("rejects when the source user lookup errors", async () => {
    const admin = makeAdmin({
      getUserById: vi.fn().mockResolvedValue({
        data: { user: null },
        error: { message: "not found", status: 404 },
      }),
    });
    const tel = makeTelemetry();
    const result = await convertAnonymousToEmail(
      { anonUserId: "anon-1", email: "user@example.com", password: "valid-pw1" },
      admin,
      tel,
    );
    expect(result.error_code).toBe("anon_required");
    expect(admin.updateUserById).not.toHaveBeenCalled();
  });

  it("rejects when the source user is NOT anonymous", async () => {
    const admin = makeAdmin({
      getUserById: vi.fn().mockResolvedValue({
        data: { user: { id: "anon-1", is_anonymous: false } },
        error: null,
      }),
    });
    const tel = makeTelemetry();
    const result = await convertAnonymousToEmail(
      { anonUserId: "anon-1", email: "user@example.com", password: "valid-pw1" },
      admin,
      tel,
    );
    expect(result.error_code).toBe("anon_required");
    expect(result.detail).toContain("not anonymous");
    expect(admin.updateUserById).not.toHaveBeenCalled();
  });
});

describe("convertAnonymousToEmail — admin update errors", () => {
  it("maps email-already-exists to failed_email_in_use", async () => {
    const admin = makeAdmin({
      updateUserById: vi.fn().mockResolvedValue({
        data: { user: null },
        error: { message: "User already registered", code: "email_exists" },
      }),
    });
    const tel = makeTelemetry();
    const result = await convertAnonymousToEmail(
      { anonUserId: "anon-1", email: "user@example.com", password: "valid-pw1" },
      admin,
      tel,
    );
    expect(result.ok).toBe(false);
    expect(result.status).toBe("failed_email_in_use");
    expect(result.error_code).toBe("email_in_use");
    expect(tel.calls[0].status).toBe("failed_email_in_use");
  });

  it("maps generic admin errors to failed_other / supabase_error", async () => {
    const admin = makeAdmin({
      updateUserById: vi.fn().mockResolvedValue({
        data: { user: null },
        error: { message: "something else broke" },
      }),
    });
    const tel = makeTelemetry();
    const result = await convertAnonymousToEmail(
      { anonUserId: "anon-1", email: "user@example.com", password: "valid-pw1" },
      admin,
      tel,
    );
    expect(result.status).toBe("failed_other");
    expect(result.error_code).toBe("supabase_error");
  });
});

describe("convertAnonymousToEmail — happy path", () => {
  it("calls updateUserById with lowercased trimmed email + password", async () => {
    const admin = makeAdmin();
    const tel = makeTelemetry();
    await convertAnonymousToEmail(
      { anonUserId: "anon-1", email: "  User@Example.COM ", password: "valid-pw1" },
      admin,
      tel,
    );
    expect(admin.updateUserById).toHaveBeenCalledWith("anon-1", {
      email: "user@example.com",
      password: "valid-pw1",
    });
  });

  it("records a success telemetry row with the same id as permanent_user_id", async () => {
    const admin = makeAdmin();
    const tel = makeTelemetry();
    const result = await convertAnonymousToEmail(
      {
        anonUserId: "anon-1",
        email: "user@example.com",
        password: "valid-pw1",
        anonSessionAgeSeconds: 3600,
      },
      admin,
      tel,
    );
    expect(result.ok).toBe(true);
    expect(result.status).toBe("success");
    expect(tel.calls.length).toBe(1);
    expect(tel.calls[0]).toMatchObject({
      anonUserId: "anon-1",
      permanentUserId: "anon-1", // FK preservation invariant
      source: "email",
      status: "success",
      anonSessionAgeSeconds: 3600,
    });
  });
});
