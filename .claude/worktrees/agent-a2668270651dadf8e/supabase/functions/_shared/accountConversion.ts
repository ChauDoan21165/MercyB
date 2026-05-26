// supabase/functions/_shared/accountConversion.ts
//
// Email/password conversion: anonymous user → permanent user.
//
// Strategy: `auth.admin.updateUser(anonUserId, { email, password })`.
// The Supabase admin endpoint preserves `auth.users.id`, so every FK
// in `public.*` that references the anon id (speech_attempts, profiles,
// user_room_progress, mercy_user_facts, mock_interview_sessions, user_xp,
// streak counters, leaderboard rows) survives untouched. No row
// migration needed on this path.
//
// Pure-ish module — DI for the admin client + telemetry writer so
// vitest can hit the validation + error-mapping logic without a
// Supabase round-trip.

// ── Validation rules ────────────────────────────────────────────────────

export const MIN_PASSWORD_LENGTH = 8;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type EmailValidationError = "empty" | "invalid_format" | "too_long";
export type PasswordValidationError =
  | "empty"
  | "too_short"
  | "too_long"
  | "no_letter"
  | "no_digit";

export function validateEmail(raw: unknown): EmailValidationError | null {
  if (typeof raw !== "string" || raw.trim().length === 0) return "empty";
  const value = raw.trim();
  if (value.length > 320) return "too_long";
  if (!EMAIL_REGEX.test(value)) return "invalid_format";
  return null;
}

export function validatePassword(raw: unknown): PasswordValidationError | null {
  if (typeof raw !== "string" || raw.length === 0) return "empty";
  if (raw.length < MIN_PASSWORD_LENGTH) return "too_short";
  if (raw.length > 200) return "too_long";
  if (!/[A-Za-z]/.test(raw)) return "no_letter";
  if (!/[0-9]/.test(raw)) return "no_digit";
  return null;
}

// ── Conversion entry ────────────────────────────────────────────────────

export type ConversionStatus =
  | "success"
  | "failed_email_in_use"
  | "failed_weak_password"
  | "failed_other";

export type ConversionSource = "email" | "google" | "apple" | "other";

export interface ConversionResult {
  ok: boolean;
  status: ConversionStatus;
  /** Stable error code suitable for UI messaging + telemetry. */
  error_code?:
    | "email_invalid"
    | "email_in_use"
    | "password_invalid"
    | "anon_required"
    | "supabase_error"
    | "unknown";
  /** Human-readable detail (server logs only — UI gets the code). */
  detail?: string;
}

export interface AdminAuthSurface {
  /**
   * Mirror of `supabase.auth.admin.getUserById`. Required so we can
   * verify the caller's row is_anonymous before mutating it.
   */
  getUserById: (userId: string) => Promise<{
    data: { user: { id: string; is_anonymous?: boolean | null; email?: string | null } | null };
    error: { message: string; status?: number } | null;
  }>;
  /**
   * Mirror of `supabase.auth.admin.updateUserById`. Used to flip
   * is_anonymous=false and set the email/password on the existing row.
   */
  updateUserById: (
    userId: string,
    attrs: { email?: string; password?: string },
  ) => Promise<{
    data: { user: { id: string } | null };
    error: { message: string; status?: number; code?: string } | null;
  }>;
}

export interface TelemetryWriter {
  recordConversion: (input: {
    anonUserId: string;
    permanentUserId?: string | null;
    source: ConversionSource;
    status: ConversionStatus;
    errorCode?: string | null;
    anonSessionAgeSeconds?: number | null;
  }) => Promise<void>;
}

export interface ConvertEmailOptions {
  anonUserId: string;
  email: string;
  password: string;
  /** Seconds since the anon session was created — drives funnel timing. */
  anonSessionAgeSeconds?: number;
}

/**
 * Convert an anonymous user to email/password. Idempotent in the sense
 * that re-running on a non-anon user is a no-op (`anon_required`).
 */
export async function convertAnonymousToEmail(
  options: ConvertEmailOptions,
  admin: AdminAuthSurface,
  telemetry: TelemetryWriter,
): Promise<ConversionResult> {
  const { anonUserId, email, password, anonSessionAgeSeconds } = options;

  const emailErr = validateEmail(email);
  if (emailErr) {
    await telemetry.recordConversion({
      anonUserId,
      source: "email",
      status: "failed_other",
      errorCode: `email_${emailErr}`,
      anonSessionAgeSeconds,
    });
    return { ok: false, status: "failed_other", error_code: "email_invalid", detail: emailErr };
  }

  const passwordErr = validatePassword(password);
  if (passwordErr) {
    await telemetry.recordConversion({
      anonUserId,
      source: "email",
      status: "failed_weak_password",
      errorCode: passwordErr,
      anonSessionAgeSeconds,
    });
    return { ok: false, status: "failed_weak_password", error_code: "password_invalid", detail: passwordErr };
  }

  // Verify the source row really is anonymous. Don't trust the caller.
  const lookup = await admin.getUserById(anonUserId);
  if (lookup.error || !lookup.data?.user) {
    await telemetry.recordConversion({
      anonUserId,
      source: "email",
      status: "failed_other",
      errorCode: "anon_lookup_failed",
      anonSessionAgeSeconds,
    });
    return { ok: false, status: "failed_other", error_code: "anon_required", detail: lookup.error?.message };
  }
  if (lookup.data.user.is_anonymous !== true) {
    await telemetry.recordConversion({
      anonUserId,
      source: "email",
      status: "failed_other",
      errorCode: "not_anonymous",
      anonSessionAgeSeconds,
    });
    return { ok: false, status: "failed_other", error_code: "anon_required", detail: "user is not anonymous" };
  }

  // The actual conversion. Same userId is preserved, FK references
  // survive automatically.
  const update = await admin.updateUserById(anonUserId, {
    email: email.trim().toLowerCase(),
    password,
  });

  if (update.error) {
    const status = mapAdminUpdateError(update.error);
    await telemetry.recordConversion({
      anonUserId,
      source: "email",
      status,
      errorCode: update.error.code ?? update.error.message,
      anonSessionAgeSeconds,
    });
    return {
      ok: false,
      status,
      error_code: status === "failed_email_in_use" ? "email_in_use" : "supabase_error",
      detail: update.error.message,
    };
  }

  await telemetry.recordConversion({
    anonUserId,
    permanentUserId: anonUserId, // Same id is preserved on email path.
    source: "email",
    status: "success",
    anonSessionAgeSeconds,
  });

  return { ok: true, status: "success" };
}

/**
 * Map Supabase admin-API errors to our conversion status enum. The
 * exact strings shift across supabase-js versions; matching on
 * substrings is the pragmatic approach.
 */
export function mapAdminUpdateError(error: {
  message: string;
  status?: number;
  code?: string;
}): ConversionStatus {
  const msg = (error.message ?? "").toLowerCase();
  const code = (error.code ?? "").toLowerCase();
  if (
    code === "email_exists" ||
    code === "user_already_exists" ||
    msg.includes("already registered") ||
    msg.includes("already exists") ||
    msg.includes("email_exists")
  ) {
    return "failed_email_in_use";
  }
  if (
    code === "weak_password" ||
    msg.includes("password") && msg.includes("weak")
  ) {
    return "failed_weak_password";
  }
  return "failed_other";
}
