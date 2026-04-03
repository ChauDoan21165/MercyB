import { supabase } from "@/lib/supabaseClient";

export type EmailMode = "password_signin" | "password_signup" | "magic" | "reset";

export function readBoolEnv(key: string): boolean {
  const env: Record<string, unknown> = (import.meta as any)?.env ?? {};
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
  return "This email is already registered.\n\nSwitch to Sign in (or click “Forgot password” to reset).";
}

export function humanizeAuthError(e: unknown, mode: EmailMode): string {
  const err = e as Record<string, unknown> | null | undefined;
  const raw = String(err?.message ?? "");
  const msg = raw.toLowerCase();

  if (msg.includes("invalid login credentials")) {
    return mode === "password_signin"
      ? "Wrong email or password.\n\nMost common fix: click “Forgot password” to reset your password."
      : "This email may already exist.\n\nTry Sign in, or click “Forgot password” to set a password.";
  }

  if (msg.includes("email not confirmed")) {
    return "Your email is not confirmed yet.\n\nPlease check your inbox for the confirmation email.";
  }

  if (isUserAlreadyRegisteredError(e)) {
    return alreadyRegisteredStatusText();
  }

  if (msg.includes("provider is not enabled") || msg.includes("unsupported provider")) {
    return "This sign-in provider is not enabled yet. Please use Email or Phone for now.";
  }

  return raw || "Unknown authentication error. Please try again.";
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

    const isAdmin =
      Boolean((data as any)?.is_admin) ||
      Number((data as any)?.admin_level ?? 0) >= 1;

    return { isAdmin };
  } catch (err) {
    console.error("[fetchAdminFlagsSafe] unexpected error:", err);
    return { isAdmin: false };
  }
}