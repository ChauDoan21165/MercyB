import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import { getUserFromAuthHeader } from "../_shared/security.ts";
import { wrapHandler } from "../_shared/sentry.ts";

import { handleAction } from "./core.ts";
import { createHttpWritingGrader } from "./graderClient.ts";
import { createPersistence, recommendLessons } from "./persistence.ts";
import type {
  OrchestratorResponse,
  PlacementV3Request,
  PlacementV3Session,
} from "./types.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

// Untyped on purpose: placement_v3_* may be on an unmerged migration branch
// when this function is developed locally. persistence.ts owns row mapping.
// deno-lint-ignore no-explicit-any
const db: any = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const writingGrader = createHttpWritingGrader({
  functionBaseUrl: `${supabaseUrl}/functions/v1`,
  serviceRoleKey,
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function progress(session: PlacementV3Session) {
  return {
    current: session.current_task_index,
    total: session.total_tasks ?? 0,
    state: session.flow_state,
  };
}

function publicResult(result: OrchestratorResponse): unknown {
  if (!result.ok) return result;
  if (result.action === "start") {
    return {
      sessionId: result.session.id,
      currentTask: result.prompt,
      totalTasks: result.session.total_tasks ?? 0,
      progress: progress(result.session),
      resumed: result.resumed ?? false,
    };
  }
  if (result.action === "respond") {
    if (result.profile) {
      return {
        type: "session_complete",
        profile: result.profile,
        recommendations: result.profile.recommended_lessons,
      };
    }
    if (result.prompt && result.session.metadata.lastCompletedModality) {
      return {
        type: "modality_complete",
        nextModality: result.prompt.modality,
        currentTask: result.prompt,
        progress: progress(result.session),
      };
    }
    return {
      type: "next_task",
      currentTask: result.prompt,
      progress: progress(result.session),
    };
  }
  if (result.action === "abandon") return { status: "abandoned" };
  if (result.action === "resume") {
    if (result.session.flow_state === "abandoned") {
      return { type: "expired", lastActivity: result.session.updated_at };
    }
    return {
      type: "resumed",
      sessionId: result.session.id,
      currentTask: result.prompt,
      progress: progress(result.session),
    };
  }
  return {
    sessionState: result.session.flow_state,
    currentModality: result.session.current_modality,
    currentTask: result.prompt,
    progress: progress(result.session),
    profile: result.profile,
  };
}

serve(
  wrapHandler("placement-v3-session", async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
    if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

    const user = await getUserFromAuthHeader(req);
    if (!user) {
      return json({
        ok: false,
        error: "auth_required",
        message: "Sign in to start placement.",
      }, 401);
    }

    let body: PlacementV3Request;
    try {
      body = await req.json() as PlacementV3Request;
    } catch {
      return json({ ok: false, error: "invalid_json", message: "Invalid JSON." }, 400);
    }
    if (!body || typeof body.action !== "string") {
      return json({ ok: false, error: "action_required", message: "Action is required." }, 400);
    }

    const persistence = createPersistence(db, {
      now: () => new Date().toISOString(),
      newId: () => crypto.randomUUID(),
      log: (event, meta) => console.log(JSON.stringify({ event, ...meta })),
    });

    const result = await handleAction({
      userId: user.id,
      request: body,
      deps: {
        ...persistence,
        grade: (input) => writingGrader.gradeWriting(input),
        writingGrader,
        recommendLessons,
      },
    });
    if (!result.ok && body.action === "resume" && result.error === "session_not_found") {
      return json({ type: "no_session" }, 200);
    }
    return json(publicResult(result), result.ok ? 200 : result.status);
  }),
);
