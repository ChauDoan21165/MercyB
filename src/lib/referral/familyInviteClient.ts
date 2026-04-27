// src/lib/referral/familyInviteClient.ts
//
// Thin wrapper around the `send-bulk-invitations` edge function.
// Returns a discriminated union so the UI can branch cleanly.

import { supabase } from "@/lib/supabaseClient";
import type { FamilyInviteTemplateKey } from "./familyInviteCopy";

const FUNCTION_NAME = "send-bulk-invitations";

export interface BulkRecipient {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  relationship?: string | null;
}

export interface BulkSendResultRow {
  index: number;
  invite_token: string;
  status: "sent" | "failed";
  error_code?: string;
}

export type BulkSendResult =
  | {
      kind: "ok";
      results: BulkSendResultRow[];
      summary: { attempted: number; sent: number; failed: number };
      quota: { hourly_remaining: number; daily_remaining: number } | null;
    }
  | {
      kind: "rate_limited";
      messageVi: string;
      messageEn: string;
      hourlyRemaining: number;
      dailyRemaining: number;
      exceeded?: "hour" | "day";
    }
  | {
      kind: "feature_disabled";
      messageVi: string;
      messageEn: string;
    }
  | { kind: "validation_error"; messageEn: string }
  | { kind: "transport_error"; httpStatus?: number };

export async function sendBulkInvitations(
  recipients: BulkRecipient[],
  templateKey: FamilyInviteTemplateKey,
  customMessage: string | null,
): Promise<BulkSendResult> {
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData?.session?.access_token;
  if (!accessToken) return { kind: "transport_error" };

  let res: Response;
  try {
    res = await fetch(resolveFunctionUrl(""), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ recipients, templateKey, customMessage }),
    });
  } catch {
    return { kind: "transport_error" };
  }

  let body: Record<string, unknown>;
  try {
    body = (await res.json()) as Record<string, unknown>;
  } catch {
    return { kind: "transport_error", httpStatus: res.status };
  }

  if (res.status === 429) {
    return {
      kind: "rate_limited",
      messageVi: typeof body.error_message_vi === "string" ? body.error_message_vi : "",
      messageEn: typeof body.error_message_en === "string" ? body.error_message_en : "",
      hourlyRemaining:
        typeof body.hourly_remaining === "number" ? body.hourly_remaining : 0,
      dailyRemaining:
        typeof body.daily_remaining === "number" ? body.daily_remaining : 0,
      exceeded:
        body.exceeded === "hour" || body.exceeded === "day"
          ? body.exceeded
          : undefined,
    };
  }
  if (res.status === 503) {
    return {
      kind: "feature_disabled",
      messageVi: typeof body.error_message_vi === "string" ? body.error_message_vi : "",
      messageEn: typeof body.error_message_en === "string" ? body.error_message_en : "",
    };
  }
  if (res.status === 400) {
    return {
      kind: "validation_error",
      messageEn: typeof body.error === "string" ? body.error : "validation_failed",
    };
  }
  if (!res.ok) {
    return { kind: "transport_error", httpStatus: res.status };
  }

  return {
    kind: "ok",
    results: Array.isArray(body.results) ? (body.results as BulkSendResultRow[]) : [],
    summary:
      body.summary && typeof body.summary === "object"
        ? (body.summary as { attempted: number; sent: number; failed: number })
        : { attempted: 0, sent: 0, failed: 0 },
    quota:
      body.quota && typeof body.quota === "object" && body.quota !== null
        ? (body.quota as { hourly_remaining: number; daily_remaining: number })
        : null,
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
