// FILE: api/mercy-feedback.ts
// Server endpoint to receive Mercy Host feedback batches
// Writes accepted feedback items into Supabase.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

type FeedbackItem = {
  v?: number;
  ts?: number;
  appKey?: string;
  authUserId?: string | null;
  tier?: string | null;
  lang?: string | null;
  mode?: string | null;
  path?: string | null;
  msgId?: string | null;
  responseId?: string | null;
  vote?: "up" | "down" | string | null;
  feedbackReason?: string | null;
  answerText?: string | null;
};

type FeedbackRequestBody = {
  schema?: string;
  appKey?: string;
  client?: {
    version?: string | null;
    buildTime?: string | null;
    platform?: string | null;
    locale?: string | null;
    tzOffsetMin?: number | null;
  };
  actor?: {
    anonId?: string | null;
    sessionId?: string | null;
  };
  context?: {
    pagePath?: string | null;
    mode?: string | null;
    contextLine?: string | null;
    conversationId?: string | null;
  };
  model?: {
    name?: string | null;
    promptVersion?: string | null;
  };
  items?: FeedbackItem[];
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey)
    : null;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      acceptedCount: 0,
      error: "method_not_allowed",
    });
  }

  if (!supabase) {
    return res.status(500).json({
      ok: false,
      acceptedCount: 0,
      error: "supabase_not_configured",
      details: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    });
  }

  try {
    const body = (req.body ?? {}) as FeedbackRequestBody;
    const items = Array.isArray(body.items) ? body.items : [];
    const accepted = items.slice(0, 50);

    if (accepted.length === 0) {
      return res.status(200).json({
        ok: true,
        acceptedCount: 0,
      });
    }

    const rows = accepted.map((item) => ({
      schema_name: body.schema ?? null,
      request_app_key: body.appKey ?? null,

      client_version: body.client?.version ?? null,
      client_build_time: body.client?.buildTime ?? null,
      client_platform: body.client?.platform ?? null,
      client_locale: body.client?.locale ?? null,
      client_tz_offset_min: body.client?.tzOffsetMin ?? null,

      actor_anon_id: body.actor?.anonId ?? null,
      session_id: body.actor?.sessionId ?? null,
      conversation_id: body.context?.conversationId ?? null,

      context_page_path: body.context?.pagePath ?? null,
      context_mode: body.context?.mode ?? null,
      context_line: body.context?.contextLine ?? null,

      prompt_version: body.model?.promptVersion ?? null,
      model_name: body.model?.name ?? null,

      item_v: item.v ?? null,
      item_ts: item.ts ?? null,
      item_app_key: item.appKey ?? null,
      auth_user_id: item.authUserId ?? null,
      tier: item.tier ?? null,
      lang: item.lang ?? null,
      mode: item.mode ?? null,
      path: item.path ?? null,
      msg_id: item.msgId ?? null,
      response_id: item.responseId ?? null,
      vote: item.vote ?? null,
      feedback_reason: item.feedbackReason ?? null,

      answer_text_snapshot: item.answerText ?? null,

      raw_item: item,
    }));

    const { error } = await supabase
      .from("mercy_feedback_events")
      .insert(rows);

    if (error) {
      console.error("Mercy feedback insert error", error);

      return res.status(500).json({
        ok: false,
        acceptedCount: 0,
        error: "supabase_insert_failed",
        details: error.message,
      });
    }

    return res.status(200).json({
      ok: true,
      acceptedCount: rows.length,
    });
  } catch (err) {
    console.error("Mercy feedback error", err);

    return res.status(500).json({
      ok: false,
      acceptedCount: 0,
      error: "internal",
      details: err instanceof Error ? err.message : "unknown_error",
    });
  }
}