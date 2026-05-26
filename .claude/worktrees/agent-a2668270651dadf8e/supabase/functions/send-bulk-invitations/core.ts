// supabase/functions/send-bulk-invitations/core.ts
//
// Bulk invite handler for the family/friend cohort. Pure(ish) split-
// handler so vitest can drive validation + dispatch + per-recipient
// outcome under Node without booting Deno.
//
// POST /send-bulk-invitations
//   Body: {
//     recipients: [{ name?, email?, phone?, relationship? }, ...],
//     templateKey?: "family" | "friend" | "colleague" | "custom",
//     customMessage?: string  (max 280)
//   }
//   Headers: Authorization: Bearer <user_jwt>
//
// Response:
//   200 OK { ok: true, results: [{ index, status, error_code? }, ...],
//            quota: { hourly_remaining, daily_remaining } }
//   400 validation failure
//   401 missing/invalid JWT
//   429 rate-limit hit (with bilingual body + remaining quota)
//   503 feature flag off

import {
  type FamilyInviteRateLimitResult,
  type RateLimitDeps,
  buildFamilyInviteRateLimitErrorBody,
  checkFamilyInviteRateLimit,
} from "../_shared/familyInviteRateLimit.ts";
import {
  FAMILY_INVITE_TEMPLATE_KEYS,
  type FamilyInviteTemplateKey,
  MAX_BATCH_SIZE,
  type NormalizedRecipient,
  generateInviteToken,
  normalizeBulk,
} from "../_shared/familyInviteValidation.ts";

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

export interface InsertedInvitation {
  index: number;
  invite_token: string;
  status: "sent" | "failed";
  error_code?: string;
}

export interface InsertInvitationParams {
  inviterUserId: string;
  recipient: NormalizedRecipient;
  templateKey: FamilyInviteTemplateKey;
  customMessage: string | null;
  inviteToken: string;
}

export interface Deps {
  resolveUserId: (req: Request) => Promise<string | null>;
  isFlagEnabled: () => Promise<boolean>;
  rateLimit: RateLimitDeps;
  insertInvitation: (params: InsertInvitationParams) => Promise<{
    ok: boolean;
    error_code?: "duplicate" | "db_error";
  }>;
  sendInviteMessage: (params: {
    recipient: NormalizedRecipient;
    templateKey: FamilyInviteTemplateKey;
    customMessage: string | null;
    inviteToken: string;
    inviterUserId: string;
  }) => Promise<{ ok: boolean; error_code?: string }>;
}

export async function handleRequest(req: Request, deps: Deps): Promise<Response> {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const userId = await deps.resolveUserId(req);
  if (!userId) return json({ error: "auth_required" }, 401);

  const flagOn = await deps.isFlagEnabled();
  if (!flagOn) {
    return json(
      {
        ok: false,
        error_code: "feature_disabled",
        error_message_vi: "Tính năng mời gia đình đang tạm dừng. Vui lòng thử lại sau.",
        error_message_en: "Family invite is temporarily disabled. Please try again later.",
      },
      503,
    );
  }

  let body: {
    recipients?: unknown;
    templateKey?: unknown;
    customMessage?: unknown;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  if (!Array.isArray(body.recipients) || body.recipients.length === 0) {
    return json({ error: "recipients_required" }, 400);
  }

  const templateKey: FamilyInviteTemplateKey =
    typeof body.templateKey === "string" &&
    (FAMILY_INVITE_TEMPLATE_KEYS as readonly string[]).includes(body.templateKey)
      ? (body.templateKey as FamilyInviteTemplateKey)
      : "family";

  const customMessage =
    typeof body.customMessage === "string" && body.customMessage.trim().length > 0
      ? body.customMessage.trim().slice(0, 280)
      : null;

  // Validate the recipient list (per-row + dedup within batch).
  const validation = normalizeBulk(body.recipients);

  // Build the per-recipient results array up-front so we can return
  // a stable index → outcome mapping even when validation drops rows.
  // First, surface validation errors that didn't pass through.
  const results: InsertedInvitation[] = [];
  for (const e of validation.errors) {
    results.push({
      index: e.index,
      invite_token: "",
      status: "failed",
      error_code: e.error,
    });
  }

  if (validation.valid.length === 0) {
    return json({
      ok: true,
      results,
      quota: null,
      summary: {
        attempted: body.recipients.length,
        sent: 0,
        failed: results.length,
      },
    });
  }

  // Rate limit on the size of the VALID batch (anti-abuse: invalid
  // rows shouldn't burn quota).
  const rate = await checkFamilyInviteRateLimit(
    userId,
    validation.valid.length,
    deps.rateLimit,
  );
  if (!rate.allowed) {
    return json(buildFamilyInviteRateLimitErrorBody(rate), 429);
  }

  // Map each valid row back to its original index in the input array
  // so callers can match results 1:1.
  const validIndices = pickValidIndices(body.recipients as unknown[], validation);

  for (let i = 0; i < validation.valid.length; i++) {
    const recipient = validation.valid[i];
    const originalIndex = validIndices[i];
    const inviteToken = generateInviteToken();

    const insert = await deps.insertInvitation({
      inviterUserId: userId,
      recipient,
      templateKey,
      customMessage,
      inviteToken,
    });
    if (!insert.ok) {
      results.push({
        index: originalIndex,
        invite_token: "",
        status: "failed",
        error_code: insert.error_code ?? "insert_failed",
      });
      continue;
    }

    const send = await deps.sendInviteMessage({
      recipient,
      templateKey,
      customMessage,
      inviteToken,
      inviterUserId: userId,
    });
    results.push({
      index: originalIndex,
      invite_token: inviteToken,
      status: send.ok ? "sent" : "failed",
      error_code: send.ok ? undefined : send.error_code ?? "send_failed",
    });
  }

  const summary = summarise(results);
  return json({
    ok: true,
    results,
    quota: {
      hourly_remaining: rate.hourly_remaining - summary.sent,
      daily_remaining: rate.daily_remaining - summary.sent,
    },
    summary: {
      attempted: body.recipients.length,
      sent: summary.sent,
      failed: summary.failed,
      max_batch_size: MAX_BATCH_SIZE,
    },
  });
}

function pickValidIndices(
  raws: unknown[],
  validation: ReturnType<typeof normalizeBulk>,
): number[] {
  const errorIndices = new Set(validation.errors.map((e) => e.index));
  const out: number[] = [];
  const limit = Math.min(raws.length, MAX_BATCH_SIZE);
  for (let i = 0; i < limit; i++) {
    if (!errorIndices.has(i)) out.push(i);
  }
  return out;
}

function summarise(results: InsertedInvitation[]): {
  sent: number;
  failed: number;
} {
  let sent = 0;
  let failed = 0;
  for (const r of results) {
    if (r.status === "sent") sent += 1;
    else failed += 1;
  }
  return { sent, failed };
}

/**
 * Surface the rate-limit result type for callers that want to render
 * the quota inline (UI dashboard).
 */
export type { FamilyInviteRateLimitResult };
