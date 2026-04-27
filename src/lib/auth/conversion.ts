// src/lib/auth/conversion.ts
//
// Client wrapper for the `account-convert` edge function. Two paths:
//   - convertWithEmail({ email, password })
//   - convertWithOAuth({ provider }) — uses supabase.auth.signInWithOAuth
//     to spin up a permanent user, then calls the merge endpoint.
//
// All branching is encoded in the discriminated `ConversionResult`
// type so the UI can switch cleanly without parsing strings.

import { supabase } from "@/lib/supabaseClient";

const FUNCTION_NAME = "account-convert";

export type EmailErrorCode =
  | "email_in_use"
  | "email_invalid"
  | "password_invalid"
  | "anon_required"
  | "supabase_error"
  | "unknown";

export type OAuthErrorCode =
  | "same_id"
  | "anon_required"
  | "rpc_error"
  | "unknown";

export type ConvertEmailResult =
  | { kind: "ok"; userId: string }
  | { kind: "error"; code: EmailErrorCode; messageVi: string; messageEn: string }
  | { kind: "transport_error"; httpStatus?: number };

export type ConvertOAuthResult =
  | { kind: "ok"; userId: string; rowsMigratedTotal: number }
  | { kind: "error"; code: OAuthErrorCode; messageVi: string; messageEn: string }
  | { kind: "transport_error"; httpStatus?: number };

/**
 * Convert the current anon session to email/password. Same auth.users.id
 * is preserved — every FK reference survives.
 */
export async function convertWithEmail(
  email: string,
  password: string,
): Promise<ConvertEmailResult> {
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData?.session?.access_token;
  if (!accessToken) return { kind: "transport_error" };

  let res: Response;
  try {
    res = await fetch(resolveFunctionUrl("/email"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return { kind: "transport_error" };
  }

  if (!res.ok && res.status !== 200) {
    return { kind: "transport_error", httpStatus: res.status };
  }

  let body: Record<string, unknown>;
  try {
    body = (await res.json()) as Record<string, unknown>;
  } catch {
    return { kind: "transport_error", httpStatus: res.status };
  }

  if (body.ok === true && typeof body.user_id === "string") {
    // Refresh the local session — supabase-js needs to pick up the
    // is_anonymous=false flip and the new email/password identity.
    await supabase.auth.refreshSession();
    return { kind: "ok", userId: body.user_id };
  }

  return {
    kind: "error",
    code: (body.error_code as EmailErrorCode) ?? "unknown",
    messageVi: typeof body.message_vi === "string" ? body.message_vi : "",
    messageEn: typeof body.message_en === "string" ? body.message_en : "",
  };
}

/**
 * Tell the server to merge the current anon session's data into a
 * just-created permanent user (typically immediately after an OAuth
 * sign-in completes). Returns the migrated-row count for the UI.
 */
export async function mergeAnonIntoPermanent(
  permanentUserId: string,
  source: "google" | "apple" | "other",
): Promise<ConvertOAuthResult> {
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData?.session?.access_token;
  if (!accessToken) return { kind: "transport_error" };

  let res: Response;
  try {
    res = await fetch(resolveFunctionUrl("/oauth-merge"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ permanentUserId, source }),
    });
  } catch {
    return { kind: "transport_error" };
  }

  if (!res.ok && res.status !== 200) {
    return { kind: "transport_error", httpStatus: res.status };
  }

  let body: Record<string, unknown>;
  try {
    body = (await res.json()) as Record<string, unknown>;
  } catch {
    return { kind: "transport_error", httpStatus: res.status };
  }

  if (body.ok === true && typeof body.user_id === "string") {
    await supabase.auth.refreshSession();
    return {
      kind: "ok",
      userId: body.user_id,
      rowsMigratedTotal:
        typeof body.rows_migrated_total === "number" ? body.rows_migrated_total : 0,
    };
  }

  return {
    kind: "error",
    code: (body.error_code as OAuthErrorCode) ?? "unknown",
    messageVi: typeof body.message_vi === "string" ? body.message_vi : "",
    messageEn: typeof body.message_en === "string" ? body.message_en : "",
  };
}

function resolveFunctionUrl(suffix: string): string {
  const env = (import.meta as ImportMeta & { env?: Record<string, string> }).env;
  const base = env?.VITE_SUPABASE_URL;
  if (typeof base === "string" && base.length > 0) {
    return `${base.replace(/\/$/, "")}/functions/v1/${FUNCTION_NAME}${suffix}`;
  }
  return `/functions/v1/${FUNCTION_NAME}${suffix}`;
}
