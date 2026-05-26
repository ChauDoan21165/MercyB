// supabase/functions/account-convert/core.ts
//
// Pure handler for the anon→permanent account conversion. Two routes:
//
//   POST /account-convert/email          body: { email, password }
//     → 200 { ok: true, user_id }
//     → 200 { ok: false, error_code: "email_in_use", ... }
//     → 400 { error: "validation_failed" }
//
//   POST /account-convert/oauth-merge    body: { permanentUserId, source }
//     → 200 { ok: true, rows_migrated_total }
//     → 400 { error: "validation_failed" }
//
// The caller's JWT must be the anonymous user's JWT — we read the
// id from the token, never trust a client-supplied anon_user_id.
//
// Split-handler so vitest under Node can drive the dispatch + error
// paths without a Deno runtime. Production wires real admin + RPC
// surfaces in `index.ts`.

import {
  type AdminAuthSurface,
  convertAnonymousToEmail,
  type TelemetryWriter,
} from "../_shared/accountConversion.ts";
import {
  type MergeRpcSurface,
  mergeAnonIntoPermanent,
} from "../_shared/accountConversionOAuth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export interface AnonUserContext {
  /** auth.uid() resolved from the JWT. */
  userId: string;
  /** True iff the auth.users row says is_anonymous=true. */
  isAnonymous: boolean;
  /** Seconds since the anon session was created — drives funnel telemetry. */
  sessionAgeSeconds: number;
}

export interface Deps {
  /**
   * Resolve the JWT to an anon-user context. Returns null when the
   * caller has no JWT or it's invalid. The handler returns 401 in
   * those cases.
   */
  resolveAnonContext: (req: Request) => Promise<AnonUserContext | null>;
  admin: AdminAuthSurface;
  rpc: MergeRpcSurface;
  telemetry: TelemetryWriter;
}

export async function handleRequest(req: Request, deps: Deps): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/^.*\/account-convert/, "") || "/";

  const ctx = await deps.resolveAnonContext(req);
  if (!ctx) {
    return json({ error: "auth_required" }, 401);
  }
  if (!ctx.isAnonymous) {
    return json({
      ok: false,
      error_code: "not_anonymous",
      message_vi: "Phiên này không phải tài khoản ẩn danh — không cần chuyển đổi.",
      message_en: "This session is not anonymous — no conversion needed.",
    }, 409);
  }

  if (path === "/email" || path === "/email/") {
    return handleEmailConversion(req, ctx, deps);
  }
  if (path === "/oauth-merge" || path === "/oauth-merge/") {
    return handleOAuthMerge(req, ctx, deps);
  }
  return json({ error: "not_found", path }, 404);
}

async function handleEmailConversion(
  req: Request,
  ctx: AnonUserContext,
  deps: Deps,
): Promise<Response> {
  let body: { email?: unknown; password?: unknown };
  try {
    body = (await req.json()) as { email?: unknown; password?: unknown };
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const result = await convertAnonymousToEmail(
    {
      anonUserId: ctx.userId,
      email: typeof body.email === "string" ? body.email : "",
      password: typeof body.password === "string" ? body.password : "",
      anonSessionAgeSeconds: ctx.sessionAgeSeconds,
    },
    deps.admin,
    deps.telemetry,
  );

  if (result.ok) {
    return json({
      ok: true,
      user_id: ctx.userId,
      status: "success",
    });
  }

  // Map every conversion failure to a structured 200 response so the
  // client can branch on `error_code`. (Keeping the HTTP code at 200
  // because the JWT was valid and the function ran — the FAILURE is a
  // domain outcome, not a transport error. UI checks `ok === false`.)
  return json({
    ok: false,
    status: result.status,
    error_code: result.error_code,
    message_vi: emailFailureMessageVi(result.error_code),
    message_en: emailFailureMessageEn(result.error_code),
  });
}

async function handleOAuthMerge(
  req: Request,
  ctx: AnonUserContext,
  deps: Deps,
): Promise<Response> {
  let body: { permanentUserId?: unknown; source?: unknown };
  try {
    body = (await req.json()) as { permanentUserId?: unknown; source?: unknown };
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const permanentUserId =
    typeof body.permanentUserId === "string" ? body.permanentUserId.trim() : "";
  const sourceRaw = typeof body.source === "string" ? body.source : "";
  const source: "google" | "apple" | "other" =
    sourceRaw === "google" ? "google" :
    sourceRaw === "apple" ? "apple" :
    "other";

  if (!permanentUserId) {
    return json({ error: "validation_failed", detail: "permanentUserId required" }, 400);
  }

  const result = await mergeAnonIntoPermanent(
    {
      anonUserId: ctx.userId,
      permanentUserId,
      source,
      anonSessionAgeSeconds: ctx.sessionAgeSeconds,
    },
    deps.rpc,
    deps.telemetry,
  );

  if (result.ok) {
    return json({
      ok: true,
      user_id: permanentUserId,
      status: "success",
      rows_migrated_total: result.rows_migrated_total ?? 0,
    });
  }

  return json({
    ok: false,
    status: result.status,
    error_code: result.error_code,
    message_vi: oauthFailureMessageVi(result.error_code),
    message_en: oauthFailureMessageEn(result.error_code),
  });
}

function emailFailureMessageVi(code?: string): string {
  switch (code) {
    case "email_in_use":
      return "Email này đã được dùng. Bạn đã có tài khoản — đăng nhập vào tài khoản đó để giữ tiến độ.";
    case "email_invalid":
      return "Email không hợp lệ.";
    case "password_invalid":
      return "Mật khẩu chưa đủ mạnh. Cần ít nhất 8 ký tự, gồm chữ và số.";
    case "anon_required":
      return "Tính năng này chỉ dành cho tài khoản ẩn danh.";
    case "supabase_error":
      return "Đã xảy ra lỗi. Vui lòng thử lại.";
    default:
      return "Không thể chuyển đổi tài khoản. Vui lòng thử lại.";
  }
}

function emailFailureMessageEn(code?: string): string {
  switch (code) {
    case "email_in_use":
      return "This email is already in use. You already have an account — sign into that one to keep your progress.";
    case "email_invalid":
      return "Email is not valid.";
    case "password_invalid":
      return "Password is not strong enough. Use at least 8 characters with letters and digits.";
    case "anon_required":
      return "This action is only available for anonymous sessions.";
    case "supabase_error":
      return "An error occurred. Please try again.";
    default:
      return "Could not convert the account. Please try again.";
  }
}

function oauthFailureMessageVi(code?: string): string {
  switch (code) {
    case "same_id":
      return "Không thể gộp một tài khoản với chính nó.";
    case "anon_required":
      return "Tính năng này chỉ dành cho tài khoản ẩn danh.";
    case "rpc_error":
      return "Đã xảy ra lỗi khi gộp tài khoản. Vui lòng thử lại.";
    default:
      return "Không thể chuyển đổi tài khoản. Vui lòng thử lại.";
  }
}

function oauthFailureMessageEn(code?: string): string {
  switch (code) {
    case "same_id":
      return "Cannot merge an account with itself.";
    case "anon_required":
      return "This action is only available for anonymous sessions.";
    case "rpc_error":
      return "Error while merging accounts. Please try again.";
    default:
      return "Could not convert the account. Please try again.";
  }
}
