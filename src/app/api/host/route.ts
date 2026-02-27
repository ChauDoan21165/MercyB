// src/app/api/host/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient as createAuthClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { preResponseIntelligence } from "@/server/host/preResponseIntelligence";
import { renderResponse } from "@/server/host/renderer";

// Small helper (no deps)
function makeRequestId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }
}

export async function POST(req: NextRequest) {
  /* =========================================================
     1) Clients
  ========================================================= */

  // Auth (cookie-based RLS)
  const authSupabase = createAuthClient();

  // Service role (server-only)
  const serviceSupabase = createServiceClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  /* =========================================================
     2) Parse JSON body safely
  ========================================================= */

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const userMessage = String(body?.userMessage ?? "").trim();
  const room_id = String(body?.room_id ?? "").trim();
  const conversationHistory = Array.isArray(body?.conversationHistory)
    ? body.conversationHistory
    : [];

  if (!userMessage) {
    return NextResponse.json({ error: "Missing userMessage" }, { status: 400 });
  }

  if (!room_id) {
    return NextResponse.json({ error: "Missing room_id" }, { status: 400 });
  }

  /* =========================================================
     3) Auth user
  ========================================================= */

  const {
    data: { user },
    error: userErr,
  } = await authSupabase.auth.getUser();

  if (userErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* =========================================================
     4) Request ID (critical for tracing)
  ========================================================= */

  const requestId =
    String(body?.request_id ?? "").trim() || makeRequestId();

  /* =========================================================
     5) Pre-response intelligence (SERVICE ROLE)
  ========================================================= */

  const { systemPrompt, plan, vip_rank } =
    await preResponseIntelligence({
      supabase: serviceSupabase, // 🔥 IMPORTANT FIX
      user_id: user.id,
      room_id,
      userMessage,
      request_id: requestId,
    });

  /* =========================================================
     6) Render response (SERVICE ROLE logging)
  ========================================================= */

  const response = await renderResponse({
    systemPrompt,
    conversationHistory,
    plan,
    userId: user.id,
    vipRank: Number(vip_rank ?? 0),
    roomId: room_id,
    requestId,
  });

  /* =========================================================
     7) Return
  ========================================================= */

  return NextResponse.json({
    request_id: requestId,
    response,
  });
}