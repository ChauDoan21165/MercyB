//// import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { logAiUsage as logAiUsageEvent } from "../_shared/aiUsage.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// --- ELITE PROFIT GUARD CONFIG (Added per Plan) ---
const MAX_FREE_ROOMS = 10;
const PROFIT_MARGIN_THRESHOLD = 0.70; // 70% Switch point
const ELITE_MODEL = "gpt-4.5-preview"; // High Reasoning for fresh VIPs
const STANDARD_MODEL = "gpt-4.1-mini"; // High Speed for high-usage/Level 0

const MERCY_MESSAGES = {
  ALREADY_SUBSCRIBED: {
    en: "You are already a VIP! Check your current plan.",
    vi: "Bạn đã là thành viên VIP rồi! Hãy kiểm tra gói hiện tại nhé."
  },
  DECLINED: {
    en: "It looks like your bank needs a quick check. Let's try again in a moment.",
    vi: "Có vẻ ngân hàng cần kiểm tra lại một chút. Chúng mình thử lại sau nhé."
  },
  ROOM_LOCKED: {
    en: "You've mastered the basics! Unlock the 400+ Room Journey with VIP.",
    vi: "Bạn đã nắm vững căn bản! Mở khóa Hành trình 400+ phòng với VIP."
  }
};

type ActiveSubscriptionRow = {
  id?: string;
  tier?: string | null;
  status?: string | null;
  current_period_end?: string | null;
  updated_at?: string | null;
};

// ---------------------------
// Helper: tier normalization
// ---------------------------
function canonicalizeTier(value: string | null | undefined): string {
  const raw = String(value ?? "level0").toLowerCase().trim();
  const cleaned = raw.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();

  if (!cleaned || cleaned === "level0") return "level0";

  if (cleaned.includes("level9")) return "level9";
  if (cleaned.includes("level6")) return "level6";
  if (cleaned.includes("level5")) return "level5";
  if (cleaned.includes("level4")) return "level4";
  if (
    cleaned.includes("level3 ii") || cleaned.includes("vip3ii") ||
    cleaned.includes("level3")
  ) return "level3";
  if (cleaned.includes("level2")) return "level2";
  if (cleaned.includes("level1")) return "level1";

  if (cleaned.includes("kids")) {
    if (cleaned.includes("3")) return "kids_3";
    if (cleaned.includes("2")) return "kids_2";
    return "kids_1";
  }

  return cleaned.replace(/\s+/g, "");
}

function isSubscriptionCurrent(currentPeriodEnd: string | null | undefined) {
  if (!currentPeriodEnd) return true;
  const ts = new Date(currentPeriodEnd).getTime();
  return Number.isFinite(ts) && ts > Date.now();
}

const tierHierarchy: Record<string, number> = {
  level0: 1,
  level1: 2,
  level2: 3,
  level3: 4,
  level4: 5,
  level5: 6,
  level6: 7,
  level9: 10,
  kids_1: 2,
  kids_2: 3,
  kids_3: 4,
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Admin client (bypasses RLS): safe for server-only reads
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function getBestActiveSubscription(
  userId: string,
): Promise<ActiveSubscriptionRow | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .select("id, tier, status, current_period_end, updated_at")
      .eq("user_id", userId)
      .in("status", ["active", "trialing"])
      .order("current_period_end", { ascending: false, nullsFirst: false })
      .order("updated_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("getBestActiveSubscription error:", error);
      return null;
    }

    const rows = Array.isArray(data) ? data : [];
    return rows.find((row) => isSubscriptionCurrent(row.current_period_end)) ??
      null;
  } catch (error) {
    console.error("getBestActiveSubscription unexpected error:", error);
    return null;
  }
}

// ---------------------------
// Helper: verify user tier access for ROOM gating (kept)
// ---------------------------
async function verifyUserTierAccess(
  supabaseClient: any,
  userId: string,
  roomTier: string,
): Promise<{ hasAccess: boolean; tier: string }> {
  try {
    const { data: roles } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    if (roles?.some((r: any) => r.role === "admin")) {
      return { hasAccess: true, tier: "admin" };
    }

    const subscription = await getBestActiveSubscription(userId);

    if (!subscription) {
      return {
        hasAccess: canonicalizeTier(roomTier) === "level0",
        tier: "level0",
      };
    }

    const userTier = canonicalizeTier(subscription.tier);
    const normalizedRoomTier = canonicalizeTier(roomTier);

    const requiredLevel = tierHierarchy[normalizedRoomTier] || 0;
    const userLevel = tierHierarchy[userTier] || 0;

    return {
      hasAccess: userLevel >= requiredLevel,
      tier: userTier,
    };
  } catch (error) {
    console.error("Error verifying tier access:", error);
    return { hasAccess: false, tier: "level0" };
  }
}

// ---------------------------
// AI budget helpers
// ---------------------------
type AiBudgetResult = {
  allowed: boolean;
  message?: string | null;
  reset_at?: string | null;
  usage_ratio?: number | string | null;
};

async function hasPaidAiAccess(userId: string): Promise<boolean> {
  try {
    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    if (roles?.some((r: any) => r.role === "admin")) {
      return true;
    }

    const subscription = await getBestActiveSubscription(userId);
    return !!subscription;
  } catch (e) {
    console.error("hasPaidAiAccess unexpected error:", e);
    return false;
  }
}

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
      inputUsdPer1M: 6.00, // Elite Pricing
      outputUsdPer1M: 18.00,
    }
  };

  const pricing = pricingByModel[params.model] || pricingByModel["gpt-4.1-mini"];

  const inputUsd = (params.inputTokens / 1_000_000) * pricing.inputUsdPer1M;
  const outputUsd = (params.outputTokens / 1_000_000) * pricing.outputUsdPer1M;
  const totalVnd = (inputUsd + outputUsd) * usdToVnd;

  return Number(totalVnd.toFixed(2));
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
      });

    if (error) {
      console.warn("Failed to log AI usage:", error);
    }
  } catch (e) {
    console.warn("Failed to log AI usage:", e);
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
    // Final chunk processing
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
  } catch (e) {
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

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { roomId, messages } = await req.json();
    const authHeader = req.headers.get("authorization");

    if (!roomId || !messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "roomId and messages required" }), { status: 400, headers: corsHeaders });
    }

    const lastMessage = messages[messages.length - 1];
    const messageContent = (lastMessage?.content || "").trim();

    if (messageContent.length === 0 || messageContent.length > 2000) {
      return new Response(JSON.stringify({ error: "Invalid message length" }), { status: 400, headers: corsHeaders });
    }

    if (!authHeader) return new Response(JSON.stringify({ error: "Auth required" }), { status: 401, headers: corsHeaders });

    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) return new Response(JSON.stringify({ error: "Invalid auth" }), { status: 401, headers: corsHeaders });

    // --- ELITE PROFIT GUARD: PROFILE & POLICY CHECK ---
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("is_premium, monthly_api_usage_usd, subscription_value_usd")
      .eq("id", user.id)
      .single();

    const isVIP = profile?.is_premium ?? false;
    const usageUsd = profile?.monthly_api_usage_usd ?? 0;
    const subValue = profile?.subscription_value_usd ?? 14.99;

    // POLICY: THE 10-ROOM LOCKDOWN
    // Map roomId to its ordinal index in roomFiles
    const roomKeys = Object.keys(roomFiles);
    const roomIndex = roomKeys.indexOf(roomId);
    if (!isVIP && roomIndex > MAX_FREE_ROOMS) {
      return new Response(JSON.stringify({ 
        error: "vip_required", 
        mercy: MERCY_MESSAGES.ROOM_LOCKED 
      }), { status: 403, headers: corsHeaders });
    }

    // POLICY: THE 'PROFIT FIRST' ROUTER (MODEL STEERING)
    let selectedModel = isVIP ? ELITE_MODEL : STANDARD_MODEL;
    if (isVIP && (usageUsd / subValue) > PROFIT_MARGIN_THRESHOLD) {
      selectedModel = STANDARD_MODEL; // Invisible down-shift to save 70% margin
      console.log(`[Elite Profit Guard] User ${user.id} throttled to Standard Model.`);
    }

    // Moderation & Suspension Checks (Full Code Maintained)
    const { data: modStatus } = await supabaseAdmin.from("user_moderation_status").select("*").eq("user_id", user.id).single();
    if (modStatus?.is_suspended) return new Response(JSON.stringify({ error: "Suspended" }), { status: 403, headers: corsHeaders });

    // Tier Verification (Full Code Maintained)
    const { data: roomTierRow } = await supabaseAdmin.from("rooms").select("tier").eq("id", roomId).single();
    const { hasAccess, tier: userRoomTier } = await verifyUserTierAccess(supabaseAdmin, user.id, roomTierRow?.tier || "level0");
    if (!hasAccess) return new Response(JSON.stringify({ error: "Insufficient tier" }), { status: 403, headers: corsHeaders });

    const roomData = await loadRoomData(roomId);
    const userQuery = messageContent.toLowerCase();

    // Context Building (Full Content Processing Kept)
    let contextInfo = `You are an AI advisor in the "${roomData.schema_id}" room.\n\n`;
    if (roomData.room_essay) {
      contextInfo += `Room Overview (EN): ${roomData.room_essay.en}\nRoom Overview (VI): ${roomData.room_essay.vi}\n\n`;
    }

    const systemPrompt = `${contextInfo}
    CRITICAL INSTRUCTIONS:
    - Respond in BOTH English and Vietnamese.
    - Base guidance on room data.
    - Act as Mercy Blade's Elite advisor.`;

    // Monthly AI budget check (Existing RPC maintained)
    const budget = await checkAiBudget(user.id, 1500);
    if (!budget.allowed) return new Response(JSON.stringify({ error: "limit_reached", message: budget.message }), { status: 402, headers: corsHeaders });

    // OpenAI Call with Steered Model
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: selectedModel,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
        stream_options: { include_usage: true },
        temperature: 0.4,
      }),
    });

    if (!aiResponse.ok) throw new Error("AI provider error");
    const [clientStream, parseStream] = aiResponse.body!.tee();

    // Usage Tracking & Logging (Full Logic Maintained)
    const backgroundTask = (async () => {
      let fullContent = "";
      let promptTokens = 0;
      let completionTokens = 0;

      await consumeOpenAiSseStream(parseStream, (parsed) => {
        const delta = parsed?.choices?.[0]?.delta?.content;
        if (delta) fullContent += delta;
        if (parsed?.usage) {
          promptTokens = parsed.usage.prompt_tokens;
          completionTokens = parsed.usage.completion_tokens;
        }
      });

      const estimatedCostVnd = estimateOpenAICostVnd({ model: selectedModel, inputTokens: promptTokens, outputTokens: completionTokens });
      
      await Promise.allSettled([
        logAiUsageEvent({ userId: user.id, model: selectedModel, tokensInput: promptTokens, tokensOutput: completionTokens, endpoint: "ai-chat" }),
        logAiUsageLog({ userId: user.id, feature: "ai-chat", model: selectedModel, inputTokens: promptTokens, outputTokens: completionTokens, estimatedCostVnd }),
        // --- PROFIT GUARD: Increment Profile Usage ---
        supabaseAdmin.rpc('increment_api_usage_usd', { p_user_id: user.id, p_amount_usd: estimatedCostVnd / Number(Deno.env.get("USD_TO_VND") || "26000") })
      ]);
    })();

    return new Response(clientStream, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });

  } catch (error) {
    console.error("AI Chat Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});