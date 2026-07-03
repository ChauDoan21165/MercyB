import { supabase } from "@/lib/supabaseClient";

/**
 * Sign-in modes for the email auth block.
 *
 *   - `password_signin` — email + password (TOTP-gated if a verified factor exists).
 *   - `code_email`      — email-only; user enters the 6-digit code mailed by
 *                         Supabase. Replaces the legacy "magic link" + "sign
 *                         up via email link" tabs (which were both
 *                         signInWithOtp under the hood). Works for both new
 *                         and returning users transparently.
 *   - `reset`           — password reset email.
 */
export type EmailMode = "password_signin" | "code_email" | "reset";

export function readBoolEnv(key: string): boolean {
  const env = import.meta.env as Record<string, unknown>;
  const v = String(env[key] ?? "").trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes" || v === "on";
}

export function isUserAlreadyRegisteredError(e: unknown): boolean {
  const err = e as Record<string, unknown> | null | undefined;
  const msg = String(err?.message ?? "").toLowerCase();
  const code = String(err?.code ?? err?.error_code ?? err?.error ?? "").toLowerCase();

  return (
    msg.includes("user already registered") ||
    msg.includes("already registered") ||
    msg.includes("already exists") ||
    msg.includes("user already exists") ||
    (msg.includes("email address already") && msg.includes("exists")) ||
    code === "user_already_exists" ||
    code === "user_already_registered"
  );
}

export function alreadyRegisteredStatusText(): string {
  return "Email này đã được đăng ký.\n\nThis email is already registered. Chuyển sang Đăng nhập (hoặc bấm \"Quên mật khẩu\" để đặt lại).";
}

/**
 * Map an OTP / verifyOtp throw to a bilingual user-facing message.
 * Returns null if the error doesn't look OTP-shaped, so callers can
 * fall back to the generic humanizer.
 */
function humanizeOtpError(e: unknown): string | null {
  const err = e as Record<string, unknown> | null | undefined;
  const raw = String(err?.message ?? "");
  const msg = raw.toLowerCase();
  const code = String(err?.code ?? err?.error_code ?? "").toLowerCase();

  if (
    code === "otp_expired" ||
    msg.includes("token has expired") ||
    msg.includes("invalid or has expired")
  ) {
    return "Mã đã hết hạn hoặc đã được dùng. Hãy bấm \"Gửi lại mã\".\nCode expired or already used. Tap \"Resend code\".";
  }

  if (
    code === "invalid_otp" ||
    msg.includes("token has invalid") ||
    msg.includes("invalid token") ||
    msg.includes("invalid otp")
  ) {
    return "Mã không đúng. Kiểm tra email và nhập lại 6 chữ số.\nWrong code. Check your email and re-enter the 6 digits.";
  }

  if (
    code === "over_email_send_rate_limit" ||
    msg.includes("rate limit") ||
    msg.includes("too many requests")
  ) {
    return "Bạn yêu cầu mã quá nhiều lần. Đợi một chút rồi thử lại.\nToo many code requests. Wait a moment and try again.";
  }

  if (msg.includes("network") || msg.includes("failed to fetch")) {
    return "Không kết nối được máy chủ. Kiểm tra mạng và thử lại.\nCan't reach the server. Check your connection and try again.";
  }

  return null;
}

export function humanizeAuthError(e: unknown, mode: EmailMode): string {
  const err = e as Record<string, unknown> | null | undefined;
  const raw = String(err?.message ?? "");
  const msg = raw.toLowerCase();

  // OTP-specific errors take priority for the code-email flow but are
  // also useful surface for the link-click fallback path.
  if (mode === "code_email") {
    const otp = humanizeOtpError(e);
    if (otp) return otp;
  }

  if (msg.includes("invalid login credentials")) {
    return mode === "password_signin"
      ? "Sai email hoặc mật khẩu.\nWrong email or password. Cách sửa nhanh nhất: bấm \"Quên mật khẩu\" để đặt lại."
      : "Email này có thể đã tồn tại.\nThis email may already exist. Thử Đăng nhập, hoặc bấm \"Quên mật khẩu\" để đặt mật khẩu.";
  }

  if (msg.includes("email not confirmed")) {
    return "Email chưa được xác nhận.\nYour email is not confirmed yet. Hãy kiểm tra hộp thư để tìm email xác nhận.";
  }

  if (isUserAlreadyRegisteredError(e)) {
    return alreadyRegisteredStatusText();
  }

  if (msg.includes("provider is not enabled") || msg.includes("unsupported provider")) {
    return "Phương thức đăng nhập này chưa được bật.\nThis sign-in provider is not enabled yet. Hãy dùng Email hoặc Số điện thoại.";
  }

  // Last-resort: try OTP map even outside code_email mode (link fallback).
  const otp = humanizeOtpError(e);
  if (otp) return otp;

  return raw || "Lỗi đăng nhập không xác định. Vui lòng thử lại.\nUnknown authentication error. Please try again.";
}

export async function ensureSessionOrThrow() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!data?.session) {
    throw new Error("No active session after authentication. Please sign in again.");
  }
  return data.session;
}

export async function fetchAdminFlagsSafe(
  userId: string,
): Promise<{ isAdmin: boolean }> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_admin, admin_level")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.warn("[fetchAdminFlagsSafe] profiles query error:", error);
      return { isAdmin: false };
    }

    const profile = data as Record<string, unknown> | null;
    const isAdmin =
      Boolean(profile?.is_admin) ||
      Number(profile?.admin_level ?? 0) >= 1;

    return { isAdmin };
  } catch (err) {
    console.error("[fetchAdminFlagsSafe] unexpected error:", err);
    return { isAdmin: false };
  }
}
