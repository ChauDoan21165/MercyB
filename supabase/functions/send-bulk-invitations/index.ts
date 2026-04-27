// supabase/functions/send-bulk-invitations/index.ts
//
// Day-of Deno entry. Wires production deps (admin client, JWT
// resolver, real Resend send via existing _shared/sendEmail.ts) and
// delegates to handleRequest in core.ts.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import {
  createSupabaseAdminClient,
  getUserFromAuthHeader,
} from "../_shared/security.ts";
import { wrapHandler } from "../_shared/sentry.ts";
import { sendEmail } from "../_shared/sendEmail.ts";
import { handleRequest, type Deps, type InsertInvitationParams } from "./core.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const PUBLIC_URL_BASE =
  Deno.env.get("MERCYBLADE_PUBLIC_URL") ?? "https://mercyblade.com";

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function resolveUserId(req: Request): Promise<string | null> {
  const user = await getUserFromAuthHeader(req);
  return user?.id ?? null;
}

async function isFlagEnabled(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("feature_flags")
      .select("is_enabled")
      .eq("flag_key", "family_bulk_invite_enabled")
      .maybeSingle();
    if (error) return true; // Fail open — default behaviour is enabled.
    return data?.is_enabled !== false;
  } catch {
    return true;
  }
}

async function countInWindow(userId: string, windowSeconds: number): Promise<number> {
  const { data, error } = await supabase.rpc("count_family_invitations_in_window", {
    p_inviter_user_id: userId,
    p_window_seconds: windowSeconds,
  });
  if (error) {
    console.warn("[send-bulk-invitations] count RPC failed:", error.message);
    return 0;
  }
  return typeof data === "number" ? data : 0;
}

async function insertInvitation(
  params: InsertInvitationParams,
): Promise<{ ok: boolean; error_code?: "duplicate" | "db_error" }> {
  const { error } = await supabase.from("family_invitations").insert({
    inviter_user_id: params.inviterUserId,
    recipient_name: params.recipient.name,
    recipient_email: params.recipient.email,
    recipient_phone: params.recipient.phone,
    relationship: params.recipient.relationship,
    template_key: params.templateKey,
    custom_message: params.customMessage,
    invite_token: params.inviteToken,
    status: "pending",
  });
  if (!error) return { ok: true };
  const code = (error as { code?: string }).code;
  if (code === "23505") return { ok: false, error_code: "duplicate" };
  console.warn("[send-bulk-invitations] insert failed:", error.message);
  return { ok: false, error_code: "db_error" };
}

async function sendInviteMessage(params: {
  recipient: { name: string | null; email: string | null; phone: string | null };
  templateKey: string;
  customMessage: string | null;
  inviteToken: string;
  inviterUserId: string;
}): Promise<{ ok: boolean; error_code?: string }> {
  // Best-effort email send. Phone (SMS) path falls through to "ok"
  // for now — the phone field is stored on the row so a future
  // Twilio sender pass can pick those up.
  if (!params.recipient.email) {
    if (params.recipient.phone) {
      // SMS path deferred. Mark as 'sent' so the row tracks the
      // invitation; the dashboard will show "0 emails sent" until
      // SMS lands.
      await markSent(params.inviteToken);
      return { ok: true };
    }
    return { ok: false, error_code: "no_contact" };
  }

  // Look up the inviter's display name for personalisation.
  let inviterName = "MercyBlade";
  try {
    const { data } = await supabase
      .from("profiles")
      .select("preferred_name, full_name")
      .eq("id", params.inviterUserId)
      .maybeSingle();
    if (data) {
      const row = data as { preferred_name?: string | null; full_name?: string | null };
      inviterName = row.preferred_name ?? row.full_name ?? inviterName;
    }
  } catch {
    // ignore — fall back to default name.
  }

  const inviteUrl = `${PUBLIC_URL_BASE.replace(/\/$/, "")}/invite/${params.inviteToken}`;
  try {
    await sendEmail({
      to: params.recipient.email,
      templateKey: "family_invite",
      variables: {
        recipient_name: params.recipient.name ?? "",
        inviter_name: inviterName,
        invite_url: inviteUrl,
        custom_message: params.customMessage ?? "",
        template_key: params.templateKey,
      },
    });
    await markSent(params.inviteToken);
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "send_failed";
    await markFailed(params.inviteToken, message);
    return { ok: false, error_code: "send_failed" };
  }
}

async function markSent(inviteToken: string): Promise<void> {
  await supabase
    .from("family_invitations")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("invite_token", inviteToken);
}

async function markFailed(inviteToken: string, message: string): Promise<void> {
  await supabase
    .from("family_invitations")
    .update({ status: "failed", error_message: message.slice(0, 500) })
    .eq("invite_token", inviteToken);
}

const productionDeps: Deps = {
  resolveUserId,
  isFlagEnabled,
  rateLimit: { countInWindow },
  insertInvitation,
  sendInviteMessage,
};

void createSupabaseAdminClient; // re-exported for symmetry; not used here

serve(wrapHandler("send-bulk-invitations", (req) => handleRequest(req, productionDeps)));
