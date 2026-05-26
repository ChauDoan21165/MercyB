/**
 * Admin client for the feedback triage inbox (Step 11 / VoC).
 *
 * Reads + writes go through the existing public.feedback table; RLS
 * already gates SELECT * to admins (level >= 9) and writes to admin or
 * the row owner. The new sentiment / admin_status columns ride on top
 * of those existing policies.
 */

import { supabase } from "@/lib/supabaseClient";

export type FeedbackAdminStatus =
  | "new" | "triaged" | "in_progress" | "shipped" | "wontfix";

export type FeedbackSentiment =
  | "positive" | "neutral" | "negative" | "mixed";

export type FeedbackRow = {
  id: string;
  userId: string | null;
  message: string;
  category: string | null;
  priority: string | null;
  status: string | null;
  sentiment: FeedbackSentiment | null;
  sentimentTags: string[];
  adminStatus: FeedbackAdminStatus;
  adminNotes: string | null;
  createdAt: string;
};

export async function listFeedback(opts?: {
  adminStatus?: FeedbackAdminStatus;
  sentiment?: FeedbackSentiment;
  limit?: number;
}): Promise<FeedbackRow[]> {
  let q = supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(opts?.limit ?? 200);

  if (opts?.adminStatus) q = q.eq("admin_status", opts.adminStatus);
  if (opts?.sentiment)   q = q.eq("sentiment", opts.sentiment);

  const { data, error } = await q;
  if (error) {
    console.warn("[feedback-triage] list failed:", error.message);
    return [];
  }
  return Array.isArray(data) ? data.map(toRow) : [];
}

export async function setFeedbackAdminStatus(
  id: string,
  status: FeedbackAdminStatus,
  notes?: string | null,
): Promise<{ ok: boolean }> {
  const update: Record<string, unknown> = { admin_status: status };
  if (notes !== undefined) update.admin_notes = notes;

  const { error } = await supabase
    .from("feedback")
    .update(update)
    .eq("id", id);

  if (error) {
    console.warn("[feedback-triage] setStatus failed:", error.message);
    return { ok: false };
  }
  return { ok: true };
}

export async function overrideSentiment(
  id: string,
  sentiment: FeedbackSentiment | null,
): Promise<{ ok: boolean }> {
  const { error } = await supabase
    .from("feedback")
    .update({ sentiment })
    .eq("id", id);

  if (error) {
    console.warn("[feedback-triage] overrideSentiment failed:", error.message);
    return { ok: false };
  }
  return { ok: true };
}

// ── helpers ──────────────────────────────────────────────────────────────

function toRow(raw: unknown): FeedbackRow {
  const r = (raw ?? {}) as Record<string, unknown>;
  const sentiment = r.sentiment as string | null | undefined;
  const safeSentiment: FeedbackSentiment | null =
    sentiment === "positive" || sentiment === "neutral" ||
    sentiment === "negative" || sentiment === "mixed"
      ? sentiment
      : null;

  const adminStatus = String(r.admin_status ?? "new");
  const safeAdminStatus: FeedbackAdminStatus =
    adminStatus === "new" || adminStatus === "triaged" ||
    adminStatus === "in_progress" || adminStatus === "shipped" ||
    adminStatus === "wontfix"
      ? (adminStatus as FeedbackAdminStatus)
      : "new";

  const tagsRaw = r.sentiment_tags;
  const tags = Array.isArray(tagsRaw) ? tagsRaw.map((t) => String(t)) : [];

  return {
    id: String(r.id ?? ""),
    userId: r.user_id == null ? null : String(r.user_id),
    message: String(r.message ?? ""),
    category: r.category == null ? null : String(r.category),
    priority: r.priority == null ? null : String(r.priority),
    status: r.status == null ? null : String(r.status),
    sentiment: safeSentiment,
    sentimentTags: tags,
    adminStatus: safeAdminStatus,
    adminNotes: r.admin_notes == null ? null : String(r.admin_notes),
    createdAt: String(r.created_at ?? ""),
  };
}

export const __test = { toRow };
