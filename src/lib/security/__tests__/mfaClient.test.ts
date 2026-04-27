import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Supabase client BEFORE importing the module under test.
// We mock the full mfa shape so each test can stub return values.
vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      mfa: {
        listFactors: vi.fn(),
        enroll: vi.fn(),
        unenroll: vi.fn(),
        challenge: vi.fn(),
        verify: vi.fn(),
      },
    },
  },
}));

// Mock the monitoring layer so we don't get noisy Sentry calls in tests.
vi.mock("@/lib/monitoring/captureException", () => ({
  addBreadcrumb: vi.fn(),
  captureError: vi.fn(),
  setTag: vi.fn(),
}));

import { supabase } from "@/lib/supabaseClient";
import {
  cancelEnrollment,
  challengeFactor,
  disableTotpFactor,
  enrollTotp,
  findFirstVerifiedTotp,
  hasVerifiedTotpFactor,
  humanizeMfaError,
  listMfaFactors,
  verifyChallenge,
  verifyEnrollment,
  type MfaFactor,
} from "../mfaClient";

const sb = supabase as unknown as {
  auth: {
    mfa: {
      listFactors: ReturnType<typeof vi.fn>;
      enroll: ReturnType<typeof vi.fn>;
      unenroll: ReturnType<typeof vi.fn>;
      challenge: ReturnType<typeof vi.fn>;
      verify: ReturnType<typeof vi.fn>;
    };
  };
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("findFirstVerifiedTotp / hasVerifiedTotpFactor", () => {
  it("returns null and false on empty factor list", () => {
    expect(findFirstVerifiedTotp([])).toBeNull();
    expect(hasVerifiedTotpFactor([])).toBe(false);
  });

  it("ignores unverified TOTP factors", () => {
    const factors: MfaFactor[] = [
      { id: "f1", factor_type: "totp", status: "unverified" },
    ];
    expect(findFirstVerifiedTotp(factors)).toBeNull();
    expect(hasVerifiedTotpFactor(factors)).toBe(false);
  });

  it("ignores phone factors even if verified (Phase 1 is TOTP-only)", () => {
    const factors: MfaFactor[] = [
      { id: "f1", factor_type: "phone", status: "verified" },
    ];
    expect(findFirstVerifiedTotp(factors)).toBeNull();
    expect(hasVerifiedTotpFactor(factors)).toBe(false);
  });

  it("returns the first verified TOTP when multiple exist", () => {
    const factors: MfaFactor[] = [
      { id: "f1", factor_type: "totp", status: "unverified" },
      { id: "f2", factor_type: "totp", status: "verified" },
      { id: "f3", factor_type: "totp", status: "verified" },
    ];
    expect(findFirstVerifiedTotp(factors)?.id).toBe("f2");
    expect(hasVerifiedTotpFactor(factors)).toBe(true);
  });
});

describe("listMfaFactors — flattens TOTP + phone arrays", () => {
  it("flattens grouped factors into a single list", async () => {
    sb.auth.mfa.listFactors.mockResolvedValue({
      data: {
        totp: [{ id: "t1", factor_type: "totp", status: "verified" }],
        phone: [{ id: "p1", factor_type: "phone", status: "unverified" }],
      },
      error: null,
    });
    const out = await listMfaFactors();
    expect(out).toHaveLength(2);
    expect(out[0].id).toBe("t1");
    expect(out[1].id).toBe("p1");
  });

  it("returns empty array when both groups are missing", async () => {
    sb.auth.mfa.listFactors.mockResolvedValue({ data: {}, error: null });
    const out = await listMfaFactors();
    expect(out).toEqual([]);
  });

  it("rethrows when the SDK returns an error", async () => {
    sb.auth.mfa.listFactors.mockResolvedValue({
      data: null,
      error: { message: "boom" },
    });
    await expect(listMfaFactors()).rejects.toBeTruthy();
  });
});

describe("enrollTotp — happy path", () => {
  it("returns factorId, qrCode, secret, uri", async () => {
    sb.auth.mfa.enroll.mockResolvedValue({
      data: {
        id: "factor-123",
        type: "totp",
        totp: {
          qr_code: "data:image/svg+xml;base64,<svg/>",
          secret: "ABCDEFGHIJKLMNOP",
          uri: "otpauth://totp/Mercy:user@x?secret=ABC",
        },
      },
      error: null,
    });
    const out = await enrollTotp();
    expect(out.factorId).toBe("factor-123");
    expect(out.qrCode).toContain("data:image");
    expect(out.secret).toBe("ABCDEFGHIJKLMNOP");
    expect(out.uri).toContain("otpauth://");
  });

  it("rejects when SDK returns an error", async () => {
    sb.auth.mfa.enroll.mockResolvedValue({
      data: null,
      error: { message: "denied" },
    });
    await expect(enrollTotp()).rejects.toBeTruthy();
  });

  it("rejects when SDK returns a non-totp factor type", async () => {
    sb.auth.mfa.enroll.mockResolvedValue({
      data: { id: "x", type: "phone" },
      error: null,
    });
    await expect(enrollTotp()).rejects.toThrow("mfa_enroll_unexpected_response");
  });
});

describe("cancelEnrollment — best-effort cleanup", () => {
  it("calls unenroll on the factor id", async () => {
    sb.auth.mfa.unenroll.mockResolvedValue({ data: null, error: null });
    await cancelEnrollment("factor-x");
    expect(sb.auth.mfa.unenroll).toHaveBeenCalledWith({ factorId: "factor-x" });
  });

  it("swallows errors silently — caller doesn't see the failure", async () => {
    sb.auth.mfa.unenroll.mockResolvedValue({
      data: null,
      error: { message: "network down" },
    });
    // The whole point is this doesn't throw — best-effort cleanup.
    await expect(cancelEnrollment("factor-x")).resolves.toBeUndefined();
  });
});

describe("verifyEnrollment — challenge + verify", () => {
  it("issues a challenge then verifies the code", async () => {
    sb.auth.mfa.challenge.mockResolvedValue({
      data: { id: "challenge-1" },
      error: null,
    });
    sb.auth.mfa.verify.mockResolvedValue({ data: null, error: null });
    await verifyEnrollment("factor-1", "123456");
    expect(sb.auth.mfa.challenge).toHaveBeenCalledWith({ factorId: "factor-1" });
    expect(sb.auth.mfa.verify).toHaveBeenCalledWith({
      factorId: "factor-1",
      challengeId: "challenge-1",
      code: "123456",
    });
  });

  it("rethrows when the challenge step returns an error", async () => {
    sb.auth.mfa.challenge.mockResolvedValue({
      data: null,
      error: { message: "rate-limited" },
    });
    await expect(verifyEnrollment("f1", "123456")).rejects.toBeTruthy();
    expect(sb.auth.mfa.verify).not.toHaveBeenCalled();
  });

  it("rethrows when the verify step returns an error", async () => {
    sb.auth.mfa.challenge.mockResolvedValue({
      data: { id: "ch1" },
      error: null,
    });
    sb.auth.mfa.verify.mockResolvedValue({
      data: null,
      error: { message: "Invalid TOTP code" },
    });
    await expect(verifyEnrollment("f1", "999999")).rejects.toBeTruthy();
  });
});

describe("challengeFactor + verifyChallenge — login-time flow", () => {
  it("challengeFactor returns factorId + challengeId", async () => {
    sb.auth.mfa.challenge.mockResolvedValue({
      data: { id: "challenge-77" },
      error: null,
    });
    const out = await challengeFactor("factor-9");
    expect(out).toEqual({ factorId: "factor-9", challengeId: "challenge-77" });
  });

  it("verifyChallenge succeeds quietly on a valid code", async () => {
    sb.auth.mfa.verify.mockResolvedValue({ data: null, error: null });
    await expect(verifyChallenge("f1", "ch1", "123456")).resolves.toBeUndefined();
  });

  it("verifyChallenge rethrows on invalid code", async () => {
    sb.auth.mfa.verify.mockResolvedValue({
      data: null,
      error: { message: "Invalid TOTP code" },
    });
    await expect(verifyChallenge("f1", "ch1", "000000")).rejects.toBeTruthy();
  });
});

describe("disableTotpFactor", () => {
  it("calls unenroll and resolves on success", async () => {
    sb.auth.mfa.unenroll.mockResolvedValue({ data: null, error: null });
    await expect(disableTotpFactor("factor-x")).resolves.toBeUndefined();
    expect(sb.auth.mfa.unenroll).toHaveBeenCalledWith({ factorId: "factor-x" });
  });

  it("rethrows on SDK error (e.g. aal=2 not satisfied)", async () => {
    sb.auth.mfa.unenroll.mockResolvedValue({
      data: null,
      error: { message: "AAL2 required" },
    });
    await expect(disableTotpFactor("factor-x")).rejects.toBeTruthy();
  });
});

describe("humanizeMfaError — bilingual messages", () => {
  it("invalid TOTP code returns clock-skew hint", () => {
    const out = humanizeMfaError(new Error("Invalid TOTP code"));
    expect(out.en).toContain("didn't match");
    expect(out.vi).toContain("không khớp");
  });

  it("rate-limit error returns wait-a-minute message", () => {
    const out = humanizeMfaError(new Error("Too many requests"));
    expect(out.en).toContain("Too many attempts");
    expect(out.vi).toContain("quá nhiều lần");
  });

  it("aal2 error returns enter-code-first message", () => {
    const out = humanizeMfaError(new Error("AAL2 required"));
    expect(out.en).toContain("authenticator code");
    expect(out.vi).toContain("xác thực");
  });

  it("unknown error returns generic message", () => {
    const out = humanizeMfaError(new Error("???"));
    expect(out.en).toContain("Something went wrong");
    expect(out.vi).toContain("lỗi");
  });

  it("works on non-Error throws (string, undefined)", () => {
    expect(humanizeMfaError("Invalid TOTP code").en).toContain("didn't match");
    expect(humanizeMfaError(undefined).en).toContain("Something went wrong");
  });
});
