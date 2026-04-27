/**
 * Path: supabase/functions/ai-chat/index.ts
 */

//// import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { logAiUsage as logAiUsageEvent } from "../_shared/aiUsage.ts";
import { streamChatWithFailover } from "../_shared/aiProvider.ts";
import { wrapHandler } from "../_shared/sentry.ts";
import {
  EdgeUserFact,
  MAX_FACTS_IN_PROMPT,
  formatUserFactsSection,
  selectTopFacts,
} from "./factSlotting.ts";
import {
  buildCapExceededResponseBody,
  decideConversationCostCap,
  resolveCapVndFromEnv,
} from "./conversationCostCap.ts";
import {
  buildRateLimitErrorBody,
  checkIpRateLimit,
} from "../_shared/ipRateLimit.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const FREE_TRIAL_DAYS = 3;
const AI_MODEL = "gpt-4.1-mini";

const MERCY_MESSAGES = {
  ALREADY_SUBSCRIBED: {
    en: "You are already subscribed. Please check your current plan.",
    vi: "Bạn đã nâng cấp rồi. Hãy kiểm tra gói hiện tại của bạn nhé."
  },
  DECLINED: {
    en: "It looks like your bank needs a quick check. Let's try again in a moment.",
    vi: "Có vẻ ngân hàng cần kiểm tra lại một chút. Chúng mình thử lại sau nhé."
  },
  TRIAL_ENDED: {
    en: "Your free trial has finished. Please upgrade to continue using Teacher Mercy.",
    vi: "Thời gian dùng thử miễn phí của bạn đã hết. Vui lòng nâng cấp để tiếp tục dùng Teacher Mercy."
  }
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Admin client (bypasses RLS): safe for server-only reads
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// ---------------------------
// AI budget helpers
// ---------------------------
type AiBudgetResult = {
  allowed: boolean;
  message?: string | null;
  reset_at?: string | null;
  usage_ratio?: number | string | null;
};

async function checkAiBudget(
  userId: string,
  reserveVnd = 0,
): Promise<AiBudgetResult> {
  const { data, error } = await supabaseAdmin.rpc("check_ai_budget", {
    p_user_id: userId,
    p_request_reserve_vnd: reserveVnd,
  });

  if (error) {
    throw error;
  }

  const budget = Array.isArray(data) ? data[0] : data;

  return {
    allowed: Boolean(budget?.allowed),
    message: budget?.message ?? null,
    reset_at: budget?.reset_at ?? null,
    usage_ratio: budget?.usage_ratio ?? null,
  };
}

function estimateOpenAICostVnd(params: {
  model: string;
  inputTokens: number;
  outputTokens: number;
}): number {
  const usdToVnd = Number(Deno.env.get("USD_TO_VND") || "26000");

  const pricingByModel: Record<
    string,
    { inputUsdPer1M: number; outputUsdPer1M: number }
  > = {
    "gpt-4.1-mini": {
      inputUsdPer1M: Number(Deno.env.get("GPT_41_MINI_INPUT_USD_PER_1M") || "0.40"),
      outputUsdPer1M: Number(Deno.env.get("GPT_41_MINI_OUTPUT_USD_PER_1M") || "1.60"),
    },
    "gpt-4.5-preview": {
      inputUsdPer1M: 6.00,
      outputUsdPer1M: 18.00,
    }
  };

  const pricing = pricingByModel[params.model] || pricingByModel["gpt-4.1-mini"];

  const inputUsd = (params.inputTokens / 1_000_000) * pricing.inputUsdPer1M;
  const outputUsd = (params.outputTokens / 1_000_000) * pricing.outputUsdPer1M;
  const totalVnd = (inputUsd + outputUsd) * usdToVnd;

  return Number(totalVnd.toFixed(2));
}

// ---------------------------
// Mercy episodic memory — fact loading + write-back
// ---------------------------

/**
 * Read the top active facts for this user. Mirrors the JS client in
 * `src/lib/mercy/userFacts.ts` (confidence DESC, last_referenced_at DESC),
 * but issues a server-side query through the admin client so the edge
 * function doesn't need a separate auth round-trip.
 */
async function loadActiveFactsForUser(
  userId: string,
  limit: number = MAX_FACTS_IN_PROMPT,
): Promise<EdgeUserFact[]> {
  if (!userId) return [];

  try {
    const { data, error } = await supabaseAdmin
      .from("mercy_user_facts")
      .select("id, fact_type, content, confidence, last_referenced_at")
      .eq("user_id", userId)
      .is("superseded_by", null)
      .order("confidence", { ascending: false })
      .order("last_referenced_at", { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) {
      console.warn("[ai-chat] loadActiveFactsForUser error:", error.message);
      return [];
    }
    if (!Array.isArray(data)) return [];
    // Re-run selectTopFacts so the in-process filter (drop < 0.3 confidence)
    // applies even if the DB sort returns low-confidence rows.
    return selectTopFacts(data as EdgeUserFact[], limit);
  } catch (e) {
    console.warn("[ai-chat] loadActiveFactsForUser threw:", e);
    return [];
  }
}

/**
 * Bump `last_referenced_at` on a batch of fact ids. Heuristic per the
 * brief: mark ALL fetched facts as referenced when the response
 * succeeds. We split into individual updates so a partial failure
 * doesn't roll the whole batch back, and we keep this fire-and-forget
 * inside the existing background task.
 */
async function markFactsReferencedBatch(factIds: string[]): Promise<void> {
  if (factIds.length === 0) return;
  const now = new Date().toISOString();
  await Promise.allSettled(
    factIds.map((id) =>
      supabaseAdmin
        .from("mercy_user_facts")
        .update({ last_referenced_at: now })
        .eq("id", id),
    ),
  );
}

async function logAiUsageLog(params: {
  userId: string;
  feature: string;
  model: string;
  requestId?: string | null;
  inputTokens: number;
  outputTokens: number;
  estimatedCostVnd: number;
  meta?: Record<string, unknown>;
  /** Optional conversation grouping key — read by the cap gate on next turn. */
  conversationId?: string | null;
}) {
  try {
    const { error } = await supabaseAdmin
      .from("ai_usage_logs")
      .insert({
        user_id: params.userId,
        feature: params.feature,
        model: params.model,
        request_id: params.requestId ?? null,
        input_tokens: params.inputTokens,
        output_tokens: params.outputTokens,
        estimated_cost_vnd: params.estimatedCostVnd,
        meta: params.meta ?? {},
        conversation_id: params.conversationId ?? null,
      });

    if (error) {
      console.warn("Failed to log AI usage:", error);
    }
  } catch (e) {
    console.warn("Failed to log AI usage:", e);
  }
}

// ── A4: per-conversation cost cap ──────────────────────────────────────────
//
// On every turn, before we hit OpenAI, sum the cumulative VND already spent
// on this conversation. When the sum exceeds the cap (default 1200 VND
// ≈ $0.05 USD, configurable via CONVERSATION_COST_CAP_VND env), return 402
// with a structured bilingual error. Admin level >= 9 bypasses; the
// `conversation_cost_cap_enabled` feature flag is the kill switch.

async function loadCostCapEnabledFlag(): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .from("feature_flags")
      .select("is_enabled")
      .eq("flag_key", "conversation_cost_cap_enabled")
      .maybeSingle();
    if (error) {
      console.warn("[ai-chat] cost-cap flag fetch failed:", error.message);
      return true; // fail-on (gate active) when we can't read the flag.
    }
    if (!data) return true; // missing row → keep the gate on by default.
    return Boolean((data as { is_enabled?: boolean | null }).is_enabled);
  } catch (e) {
    console.warn("[ai-chat] cost-cap flag fetch threw:", e);
    return true;
  }
}

async function getConversationCumulativeCostVnd(
  userId: string,
  conversationId: string,
): Promise<number> {
  try {
    const { data, error } = await supabaseAdmin
      .from("ai_usage_logs")
      .select("estimated_cost_vnd")
      .eq("user_id", userId)
      .eq("conversation_id", conversationId);
    if (error || !data) {
      // Fail-open: if we can't read the log, don't block. The next turn
      // will retry; a sustained read failure is observable in the
      // edge-function logs.
      return 0;
    }
    let sum = 0;
    for (const row of data as Array<{ estimated_cost_vnd?: number | string | null }>) {
      const v = Number(row.estimated_cost_vnd ?? 0);
      if (Number.isFinite(v)) sum += v;
    }
    return sum;
  } catch {
    return 0;
  }
}

async function isAdminLevel9(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin.rpc("get_admin_level", {
      _user_id: userId,
    });
    if (error) return false;
    return Number(data ?? 0) >= 9;
  } catch {
    return false;
  }
}

async function logCostCapHit(params: {
  userId: string;
  conversationId: string;
  observedCostVnd: number;
  capVnd: number;
}): Promise<void> {
  try {
    await supabaseAdmin.from("audit_logs").insert({
      type: "ai_chat.conversation_cost_cap_exceeded",
      user_id: params.userId,
      metadata: {
        conversation_id: params.conversationId,
        observed_cost_vnd: params.observedCostVnd,
        cap_vnd: params.capVnd,
      },
    });
  } catch (e) {
    console.warn("[ai-chat] cap-hit audit insert failed:", e);
  }
}

async function consumeOpenAiSseStream(
  stream: ReadableStream<Uint8Array>,
  onParsed: (parsed: any) => void,
) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      while (true) {
        const newlineIndex = buffer.indexOf("\n");
        if (newlineIndex === -1) break;

        const rawLine = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);

        const line = rawLine.replace(/\r$/, "").trim();
        if (!line.startsWith("data:")) continue;

        const payload = line.slice(5).trim();
        if (!payload) continue;
        if (payload === "[DONE]") return;

        try {
          const parsed = JSON.parse(payload);
          onParsed(parsed);
        } catch {
          // ignore malformed/partial payloads
        }
      }
    }

    const remaining = buffer.trim();
    if (remaining.startsWith("data:")) {
      const payload = remaining.slice(5).trim();
      if (payload && payload !== "[DONE]") {
        try {
          const parsed = JSON.parse(payload);
          onParsed(parsed);
        } catch {}
      }
    }
  } finally {
    reader.releaseLock();
  }
}

function isTrialExpired(createdAt: string | null | undefined): boolean {
  if (!createdAt) {
    return false;
  }

  const createdAtMs = new Date(createdAt).getTime();
  if (!Number.isFinite(createdAtMs)) {
    return false;
  }

  const elapsedMs = Date.now() - createdAtMs;
  const trialMs = FREE_TRIAL_DAYS * 24 * 60 * 60 * 1000;

  return elapsedMs > trialMs;
}

// Room data files mapping (Full Mapping Kept)
const roomFiles: { [key: string]: string } = {
  "abdominal-pain": "abdominal_pain.json",
  "addiction": "addiction.json",
  "ai": "AI.json",
  "autoimmune": "autoimmune_diseases.json",
  "burnout": "burnout.json",
  "career-burnout": "career_burnout.json",
  "business-negotiation": "business_negotiation_compass.json",
  "business-strategy": "business_strategy.json",
  "cancer-support": "cancer_support.json",
  "cardiovascular": "cardiovascular.json",
  "child-health": "child_health.json",
  "cholesterol": "cholesterol.json",
  "chronic-fatigue": "chronic_fatigue.json",
  "cough": "cough.json",
  "crypto": "crypto.json",
  "depression": "depression.json",
  "diabetes": "diabetes.json",
  "digestive": "digestive_system.json",
  "elderly-care": "elderly_care.json",
  "endocrine": "endocrine_system.json",
  "exercise-medicine": "exercise_medicine.json",
  "fever": "fever.json",
  "finance": "finance.json",
  "fitness": "fitness_room.json",
  "food-nutrition": "food_and_nutrition.json",
  "grief": "grief.json",
  "gut-brain": "gut_brain_axis.json",
  "headache": "headache.json",
  "soul-mate": "how_to_find_your_soul_mate_vip1.json",
  "confidence-building-level1": "confidence_building_vip1.json",
  "nutrition-basics-level1": "nutrition_basics_vip1.json",
  "financial-wellness-level1": "financial_wellness_vip1.json",
  "sleep-improvement-level1": "sleep_improvement_vip1.json",
  "husband-dealing": "husband_dealing.json",
  "husband-dealing-level2": "husband_dealing_vip2.json",
  "hypertension": "hypertension.json",
  "immune-system": "immune_system.json",
  "immunity-boost": "immunity_boost.json",
  "injury-bleeding": "injury_and_bleeding.json",
  "matchmaker": "matchmaker_traits.json",
  "mens-health": "men_health.json",
  "mental-health": "mental_health.json",
  "mindful-movement": "mindful_movement.json",
  "mindfulness-healing": "mindfulness_and_healing.json",
  "nutrition-basics": "nutrition_basics.json",
  "obesity": "obesity.json",
  "obesity-management-level2": "obesity_management_vip2.json",
  "obesity-management-level3": "obesity_management_vip3.json",
  "sleep-improvement-level0": "sleep_improvement_free.json",
  "sleep-improvement-level2": "sleep_improvement_vip2.json",
  "sleep-improvement-level3": "sleep_improvement_vip3.json",
  "office-survival": "office_survival.json",
  "pain-management": "pain_management.json",
  "phobia": "phobia.json",
  "rare-diseases": "rare_diseases.json",
  "renal-health": "renal_health.json",
  "reproductive": "reproductive_health.json",
  "respiratory": "respiratory_system.json",
  "screening": "screening_and_prevention.json",
  "sexuality": "sexuality_and_intimacy.json",
  "sexuality-intimacy-level2": "sexuality_intimacy_vip2.json",
  "skin-health": "skin_health.json",
  "sleep-health": "sleep_health.json",
  "social-connection": "social_connection.json",
  "speaking-crowd": "speaking_crowd.json",
  "stoicism": "stoicism.json",
  "stress-anxiety": "stress_and_anxiety.json",
  "teen": "teen.json",
  "toddler": "toddler.json",
  "train-brain": "train_brain_memory.json",
  "trauma": "trauma.json",
  "user-profile-dashboard": "user_profile_dashboard.json",
  "wife-dealing": "wife_dealing.json",
  "wife-dealing-level2": "wife_dealing_vip2.json",
  "womens-health": "women_health.json",
  "habit-building": "habit_building.json",
  "negotiation-mastery": "negotiation_mastery.json",
  "diabetes-advanced": "diabetes_advanced.json",
  "confidence-building": "confidence_building.json",
  "financial-planning": "financial_planning_101.json",
  "onboarding-level0-users": "onboarding_free_users.json",
  "parenting-toddlers": "parenting_toddlers.json",
  "relationship-conflicts": "relationship_conflicts.json",
  "weight-loss": "weight_loss_program.json",
  "anxiety-toolkit": "anxiety_toolkit.json",
  "keep-soul-calm-level3": "keep_soul_calm_vip3.json",
  "mental-sharpness-level3": "sharpen_mind_vip3.json",
  "overcome-storm-level3": "overcome_storm_vip3.json",
  "shadow-work-level3": "unlock_shadow_vip3.json",
  "human-rights-level3": "human_rights_vip3.json",
  "confidence-level3": "confidence_vip3.json",
  "nutrition-level3": "nutrition_vip3.json",
  "meaning-of-life-level3": "meaning_of_life_vip3.json",
  "philosophy-of-everyday-level3": "philosophy_of_everyday_vip3.json",
  "finding-gods-peace-level0": "finding_gods_peace_free.json",
  "gods-guidance-level1": "gods_guidance_vip1.json",
  "gods-strength-level2-resilience": "gods_strength_vip2_resilience.json",
  "gods-purpose-level3": "gods_purpose_vip3.json",
  "proverbs-wisdom-level1": "proverbs_wisdom_VIP1.json",
};

const embeddedFallbackData: Record<string, any> = {
  generic: {
    schema_version: "1.0",
    schema_id: "generic_room",
    room_essay: {
      en: "Welcome! I will provide concise, supportive guidance using general best practices for this topic.",
      vi: "Chào bạn! Tôi sẽ hỗ trợ ngắn gọn, hữu ích dựa trên các thực hành tốt nhất về chủ đề này.",
    },
    safety_disclaimer: {
      en: "Educational guidance only; not a substitute for professional advice or emergency care.",
      vi: "Chỉ mang tính giáo dục; không thay thế tư vấn chuyên môn hoặc chăm sóc khẩn cấp.",
    },
    crisis_footer: {
      en: "If symptoms are severe or worsening, seek local professional help immediately.",
      vi: "Nếu triệu chứng nặng hoặc xấu đi, hãy tìm trợ giúp chuyên môn ngay.",
    },
    entries: [],
  },
};

async function loadRoomData(roomId: string): Promise<any | null> {
  const fileName = roomFiles[roomId];
  if (!fileName) {
    console.log(`Room ${roomId} not found in mapping`);
    return embeddedFallbackData.generic;
  }

  try {
    const url = new URL(`./data/${fileName}`, import.meta.url);
    const mod = await import(url.href, { with: { type: "json" } } as any);
    const data = (mod as any).default || mod;
    return data;
  } catch (_e) {
    try {
      const url = new URL(`./data/${fileName}`, import.meta.url);
      const text = await Deno.readTextFile(url);
      return JSON.parse(text);
    } catch (error) {
      console.error(`Failed to load room data for ${roomId}:`, error);
      return embeddedFallbackData.generic;
    }
  }
}

serve(wrapHandler("ai-chat", async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const reqBody = await req.json();
    const { roomId, messages } = reqBody;
    const conversationIdRaw = (reqBody as { conversationId?: unknown })?.conversationId;
    const conversationId =
      typeof conversationIdRaw === "string" && conversationIdRaw.trim().length > 0
        ? conversationIdRaw.trim()
        : null;
    const authHeader = req.headers.get("authorization");

    if (!roomId || !messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "roomId and messages required" }),
        { status: 400, headers: corsHeaders },
      );
    }

    const lastMessage = messages[messages.length - 1];
    const messageContent = (lastMessage?.content || "").trim();

    if (messageContent.length === 0 || messageContent.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Invalid message length" }),
        { status: 400, headers: corsHeaders },
      );
    }

    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Auth required" }),
        { status: 401, headers: corsHeaders },
      );
    }

    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    const {
      data: { user },
      error: authError,
    } = await supabaseUser.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid auth" }),
        { status: 401, headers: corsHeaders },
      );
    }

    // ── Per-IP rate limit ────────────────────────────────────────────────
    // Sits BEFORE trial / suspension / budget checks so abusive callers
    // never reach the heavier downstream work. Helper fails OPEN on
    // missing IP / RPC error to protect legitimate traffic. Admin level
    // >= 9 bypasses entirely (Chau testing).
    try {
      const adminLevel = await (async () => {
        try {
          const { data, error } = await supabaseAdmin.rpc("get_admin_level", {
            p_user_id: user.id,
          });
          if (error || typeof data !== "number") return 0;
          return data;
        } catch {
          return 0;
        }
      })();
      const ipResult = await checkIpRateLimit(req, {
        supabase: supabaseAdmin,
        surface: "ai-chat",
        isAdminBypass: adminLevel >= 9,
      });
      if (!ipResult.allowed) {
        const retry = ipResult.retryAfterSeconds ?? 60;
        return new Response(
          JSON.stringify(buildRateLimitErrorBody(retry)),
          {
            status: 429,
            headers: {
              ...corsHeaders,
              "Retry-After": String(retry),
            },
          },
        );
      }
    } catch (err) {
      console.error("[ai-chat] checkIpRateLimit threw:", err);
      // Fail open.
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("is_premium, created_at")
      .eq("id", user.id)
      .single();

    const isPremium = profile?.is_premium ?? false;
    const trialExpired = !isPremium && isTrialExpired(profile?.created_at);

    if (trialExpired) {
      return new Response(
        JSON.stringify({
          error: "trial_expired",
          mercy: MERCY_MESSAGES.TRIAL_ENDED,
        }),
        { status: 403, headers: corsHeaders },
      );
    }

    const { data: modStatus } = await supabaseAdmin
      .from("user_moderation_status")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (modStatus?.is_suspended) {
      return new Response(
        JSON.stringify({ error: "Suspended" }),
        { status: 403, headers: corsHeaders },
      );
    }

    const roomData = await loadRoomData(roomId);

    let contextInfo = `You are an AI advisor in the "${roomData.schema_id}" room.\n\n`;
    if (roomData.room_essay) {
      contextInfo += `Room Overview (EN): ${roomData.room_essay.en}\nRoom Overview (VI): ${roomData.room_essay.vi}\n\n`;
    }

    // Step 7 — episodic user-fact memory. Load the top-N active facts
    // for this user and slot them into the system prompt. When the user
    // has zero facts (new account, freshly reset memory), the helper
    // returns "" and the prompt is unchanged.
    const activeFacts = await loadActiveFactsForUser(user.id);
    const factsSection = formatUserFactsSection(activeFacts);
    const factsBlock = factsSection ? `\n\n${factsSection}\n\n` : "";

    const systemPrompt = `${contextInfo}${factsBlock}
    CRITICAL INSTRUCTIONS:
    - Respond in BOTH English and Vietnamese.
    - Base guidance on room data.
    - Act as Mercy Blade's advisor.`;

    // ── A4: per-conversation cost cap (hard gate) ──────────────────────
    // Runs BEFORE the user-level checkAiBudget. The two are different
    // protection layers: checkAiBudget is daily/monthly per-user; this
    // is per-conversation. A long thread can hit this without the user
    // being anywhere near their daily ceiling.
    if (conversationId) {
      const [capEnabled, isAdmin, cumulativeCostVnd] = await Promise.all([
        loadCostCapEnabledFlag(),
        isAdminLevel9(user.id),
        getConversationCumulativeCostVnd(user.id, conversationId),
      ]);
      const capVnd = resolveCapVndFromEnv(Deno.env.get("CONVERSATION_COST_CAP_VND"));
      const decision = decideConversationCostCap({
        conversationId,
        cumulativeCostVnd,
        capVnd,
        capEnabled,
        isAdmin,
      });
      if (decision.kind === "block") {
        await logCostCapHit({
          userId: user.id,
          conversationId,
          observedCostVnd: decision.observedCostVnd,
          capVnd: decision.capVnd,
        });
        const body = buildCapExceededResponseBody({
          observedCostVnd: decision.observedCostVnd,
          capVnd: decision.capVnd,
        });
        return new Response(JSON.stringify(body), {
          status: 402,
          headers: corsHeaders,
        });
      }
    }

    const budget = await checkAiBudget(user.id, 1500);
    if (!budget.allowed) {
      return new Response(
        JSON.stringify({
          error: "limit_reached",
          message: budget.message,
        }),
        { status: 402, headers: corsHeaders },
      );
    }

    // Failover-aware streaming. Tries OpenAI first; on connection-
    // establishment failure (timeout, 429, 5xx, network) falls over to
    // Gemini and translates Gemini's SSE chunks into OpenAI shape so
    // the client + cost tracker pipeline below work unchanged.
    const streamResult = await streamChatWithFailover({
      systemPrompt,
      userMessage: messages[messages.length - 1]?.content ?? "",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      openaiModel: AI_MODEL,
      temperature: 0.4,
      includeUsage: true,
    });

    if ("ok" in streamResult && streamResult.ok === false) {
      console.error(
        `[ai-chat] both providers failed errorKind=${streamResult.errorKind} attempts=[${streamResult.attempts.join(",")}]`,
      );
      throw new Error("AI provider error");
    }

    console.log(
      `[ai-chat] provider=${streamResult.provider} attempts=[${streamResult.attempts.join(",")}]`,
    );

    const [clientStream, parseStream] = streamResult.body.tee();

    const backgroundTask = (async () => {
      let promptTokens = 0;
      let completionTokens = 0;

      await consumeOpenAiSseStream(parseStream, (parsed) => {
        if (parsed?.usage) {
          promptTokens = parsed.usage.prompt_tokens;
          completionTokens = parsed.usage.completion_tokens;
        }
      });

      const estimatedCostVnd = estimateOpenAICostVnd({
        model: AI_MODEL,
        inputTokens: promptTokens,
        outputTokens: completionTokens,
      });

      await Promise.allSettled([
        logAiUsageEvent({
          userId: user.id,
          model: AI_MODEL,
          tokensInput: promptTokens,
          tokensOutput: completionTokens,
          endpoint: "ai-chat",
        }),
        logAiUsageLog({
          userId: user.id,
          feature: "ai-chat",
          model: AI_MODEL,
          inputTokens: promptTokens,
          outputTokens: completionTokens,
          estimatedCostVnd,
          conversationId,
        }),
        // Step 7 — bump last_referenced_at on every fact we slotted into
        // this turn's prompt. Heuristic per the brief: mark ALL fetched
        // facts as referenced when the response stream completes (no
        // LLM-detected "substantively used" attribution yet).
        markFactsReferencedBatch(activeFacts.map((f) => f.id)),
      ]);
    })();

    void backgroundTask;

    return new Response(clientStream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
      },
    });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: corsHeaders },
    );
  }
}));