// supabase/functions/_shared/accountConversionOAuth.ts
//
// OAuth conversion path: anon user → permanent user via Google/Apple.
// Different shape than the email path:
//   1. The OAuth signin already created the new permanent user (the
//      client did this via the regular OAuth flow before calling
//      this function).
//   2. We MERGE the anon user's owned rows into the permanent user
//      via the `merge_anon_user_into_permanent` Postgres function.
//   3. The anon auth.users row is deleted at the end of the merge.
//
// The merge is atomic: a single Postgres function call wrapped in
// an implicit transaction. Either the full migration succeeds or
// nothing changes.

import type { ConversionSource, TelemetryWriter } from "./accountConversion.ts";

export interface OAuthMergeOptions {
  anonUserId: string;
  permanentUserId: string;
  source: Extract<ConversionSource, "google" | "apple" | "other">;
  /** Seconds since the anon session was created. */
  anonSessionAgeSeconds?: number;
}

export interface MergeRpcSurface {
  /**
   * Calls `public.merge_anon_user_into_permanent(p_anon_id, p_permanent_id)`
   * via the supabase admin client's RPC method.
   */
  mergeAnonIntoPermanent: (
    anonUserId: string,
    permanentUserId: string,
  ) => Promise<{
    data: { rows_migrated_total: number } | null;
    error: { message: string; code?: string } | null;
  }>;
}

export type OAuthMergeStatus =
  | "success"
  | "failed_same_id"
  | "failed_anon_required"
  | "failed_other";

export interface OAuthMergeResult {
  ok: boolean;
  status: OAuthMergeStatus;
  rows_migrated_total?: number;
  error_code?:
    | "same_id"
    | "anon_required"
    | "rpc_error"
    | "unknown";
  detail?: string;
}

/**
 * Merge the anon user's owned rows into the permanent user, then
 * delete the anon auth.users row. Atomic via the SQL function.
 */
export async function mergeAnonIntoPermanent(
  options: OAuthMergeOptions,
  rpc: MergeRpcSurface,
  telemetry: TelemetryWriter,
): Promise<OAuthMergeResult> {
  const { anonUserId, permanentUserId, source, anonSessionAgeSeconds } = options;

  // Cheap pre-flight: don't even call the function if the ids are
  // identical or empty. The SQL function would RAISE EXCEPTION but
  // failing fast keeps the failure path local.
  if (!anonUserId || !permanentUserId) {
    await telemetry.recordConversion({
      anonUserId: anonUserId ?? "",
      permanentUserId: permanentUserId ?? null,
      source,
      status: "failed_other",
      errorCode: "missing_id",
      anonSessionAgeSeconds,
    });
    return { ok: false, status: "failed_other", error_code: "unknown", detail: "missing_id" };
  }
  if (anonUserId === permanentUserId) {
    await telemetry.recordConversion({
      anonUserId,
      permanentUserId,
      source,
      status: "failed_other",
      errorCode: "same_id",
      anonSessionAgeSeconds,
    });
    return { ok: false, status: "failed_same_id", error_code: "same_id", detail: "anon and permanent ids are identical" };
  }

  const result = await rpc.mergeAnonIntoPermanent(anonUserId, permanentUserId);
  if (result.error) {
    const status = mapMergeRpcError(result.error.message ?? "");
    await telemetry.recordConversion({
      anonUserId,
      permanentUserId,
      source,
      status: status === "failed_anon_required" ? "failed_other" : "failed_other",
      errorCode: result.error.code ?? "rpc_error",
      anonSessionAgeSeconds,
    });
    return {
      ok: false,
      status,
      error_code: status === "failed_anon_required" ? "anon_required" : "rpc_error",
      detail: result.error.message,
    };
  }

  const rowsMigrated = result.data?.rows_migrated_total ?? 0;
  await telemetry.recordConversion({
    anonUserId,
    permanentUserId,
    source,
    status: "success",
    anonSessionAgeSeconds,
  });

  return {
    ok: true,
    status: "success",
    rows_migrated_total: rowsMigrated,
  };
}

export function mapMergeRpcError(message: string): OAuthMergeStatus {
  const msg = message.toLowerCase();
  if (msg.includes("not anonymous")) return "failed_anon_required";
  if (msg.includes("cannot match") || msg.includes("ids cannot match")) return "failed_same_id";
  return "failed_other";
}
