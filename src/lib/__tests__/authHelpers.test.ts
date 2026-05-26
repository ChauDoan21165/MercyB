// src/lib/__tests__/authHelpers.test.ts
//
// Coverage for humanizeAuthError() in the new code-first OTP flow.
// Asserts:
//   - Vietnamese-first multi-line output (\n separator).
//   - OTP-specific failures map to explicit "expired", "wrong code",
//     "rate limit", "network" messages — not the generic fallback.
//   - The legacy password / already-registered branches are still
//     mapped (regression guard).

import { describe, it, expect } from "vitest";
import { humanizeAuthError, type EmailMode } from "@/lib/authHelpers";

function asEmailMode(m: EmailMode): EmailMode {
  return m;
}

describe("humanizeAuthError — code_email mode (new OTP flow)", () => {
  const mode = asEmailMode("code_email");

  it("maps otp_expired error code to 'expired or already used' VI-first", () => {
    const out = humanizeAuthError(
      { code: "otp_expired", message: "Token has expired" },
      mode,
    );
    expect(out.split("\n")[0]).toContain("hết hạn");
    expect(out).toContain("Resend code");
  });

  it("maps 'token has expired' message even without an error code", () => {
    const out = humanizeAuthError(
      { message: "Token has expired or is invalid" },
      mode,
    );
    expect(out).toContain("hết hạn");
  });

  it("maps invalid_otp / invalid token to wrong-code copy", () => {
    const out = humanizeAuthError(
      { code: "invalid_otp", message: "Token has invalid value" },
      mode,
    );
    expect(out.split("\n")[0]).toContain("Mã không đúng");
    expect(out).toContain("Wrong code");
  });

  it("maps rate-limit errors to a Vietnamese throttling message", () => {
    const out = humanizeAuthError(
      { message: "rate limit exceeded — too many requests" },
      mode,
    );
    expect(out.split("\n")[0]).toContain("quá nhiều lần");
    expect(out).toContain("Too many code requests");
  });

  it("maps a network failure (TypeError-style) to 'can't reach the server'", () => {
    const out = humanizeAuthError(
      { message: "Failed to fetch" },
      mode,
    );
    expect(out.split("\n")[0]).toContain("Không kết nối");
    expect(out).toContain("Can't reach the server");
  });

  it("falls back to OTP map even for outer modes (link-fallback path)", () => {
    const out = humanizeAuthError(
      { code: "otp_expired", message: "" },
      asEmailMode("password_signin"),
    );
    // password_signin doesn't pre-route to OTP map but the post-fall-
    // through map should still catch otp_expired so a user landing
    // back from a stale magic link sees a helpful message.
    expect(out).toContain("hết hạn");
  });
});

describe("humanizeAuthError — regression guards on existing branches", () => {
  it("'invalid login credentials' on password_signin still maps to wrong-pw copy (now bilingual)", () => {
    const out = humanizeAuthError(
      { message: "Invalid login credentials" },
      asEmailMode("password_signin"),
    );
    expect(out).toContain("Sai email hoặc mật khẩu");
    expect(out).toContain("Wrong email or password");
  });

  it("'email not confirmed' is bilingual VI-first", () => {
    const out = humanizeAuthError(
      { message: "Email not confirmed" },
      asEmailMode("password_signin"),
    );
    expect(out.split("\n")[0]).toContain("chưa được xác nhận");
    expect(out).toContain("not confirmed yet");
  });

  it("user_already_exists code routes to alreadyRegisteredStatusText (bilingual)", () => {
    const out = humanizeAuthError(
      { code: "user_already_exists", message: "User already registered" },
      asEmailMode("code_email"),
    );
    expect(out).toContain("đã được đăng ký");
    expect(out).toContain("already registered");
  });

  it("'provider is not enabled' is bilingual VI-first", () => {
    const out = humanizeAuthError(
      { message: "Provider is not enabled" },
      asEmailMode("password_signin"),
    );
    expect(out.split("\n")[0]).toContain("chưa được bật");
    expect(out).toContain("provider is not enabled");
  });

  it("unknown error returns the raw message", () => {
    const out = humanizeAuthError(
      { message: "kaboom" },
      asEmailMode("password_signin"),
    );
    expect(out).toBe("kaboom");
  });

  it("empty error returns a bilingual default", () => {
    const out = humanizeAuthError({ message: "" }, asEmailMode("password_signin"));
    expect(out).toContain("không xác định");
    expect(out).toContain("Unknown authentication error");
  });
});
