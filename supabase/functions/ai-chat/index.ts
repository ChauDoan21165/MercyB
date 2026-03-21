//// import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { logAiUsage as logAiUsageEvent } from "../_shared/aiUsage.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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
  const raw = String(value ?? "free").toLowerCase().trim();
  const cleaned = raw.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();

  if (!cleaned || cleaned === "free") return "free";

  if (cleaned.includes("vip9")) return "vip9";
  if (cleaned.includes("vip6")) return "vip6";
  if (cleaned.includes("vip5")) return "vip5";
  if (cleaned.includes("vip4")) return "vip4";
  if (
    cleaned.includes("vip3 ii") || cleaned.includes("vip3ii") ||
    cleaned.includes("vip3")
  ) return "vip3";
  if (cleaned.includes("vip2")) return "vip2";
  if (cleaned.includes("vip1")) return "vip1";

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
  free: 1,
  vip1: 2,
  vip2: 3,
  vip3: 4,
  vip4: 5,
  vip5: 6,
  vip6: 7,
  vip9: 10,
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
// Uses canonical tier hierarchy matching lib/constants/tiers.ts
async function verifyUserTierAccess(
  supabaseClient: any,
  userId: string,
  roomTier: string,
): Promise<{ hasAccess: boolean; tier: string }> {
  try {
    // Check admin status first
    const { data: roles } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    if (roles?.some((r: any) => r.role === "admin")) {
      return { hasAccess: true, tier: "admin" };
    }

    // Get user's active/trialing subscription from normalized subscriptions table
    const subscription = await getBestActiveSubscription(userId);

    if (!subscription) {
      return {
        hasAccess: canonicalizeTier(roomTier) === "free",
        tier: "free",
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
    return { hasAccess: false, tier: "free" };
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
      inputUsdPer1M: Number(
        Deno.env.get("GPT_41_MINI_INPUT_USD_PER_1M") || "0.40",
      ),
      outputUsdPer1M: Number(
        Deno.env.get("GPT_41_MINI_OUTPUT_USD_PER_1M") || "1.60",
      ),
    },
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

    const remaining = buffer.trim();
    if (remaining.startsWith("data:")) {
      const payload = remaining.slice(5).trim();
      if (payload && payload !== "[DONE]") {
        try {
          const parsed = JSON.parse(payload);
          onParsed(parsed);
        } catch {
          // ignore malformed/partial payloads
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// Room data files mapping
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
  "confidence-building-vip1": "confidence_building_vip1.json",
  "nutrition-basics-vip1": "nutrition_basics_vip1.json",
  "financial-wellness-vip1": "financial_wellness_vip1.json",
  "sleep-improvement-vip1": "sleep_improvement_vip1.json",
  "husband-dealing": "husband_dealing.json",
  "husband-dealing-vip2": "husband_dealing_vip2.json",
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
  "obesity-management-vip2": "obesity_management_vip2.json",
  "obesity-management-vip3": "obesity_management_vip3.json",
  "sleep-improvement-free": "sleep_improvement_free.json",
  "sleep-improvement-vip2": "sleep_improvement_vip2.json",
  "sleep-improvement-vip3": "sleep_improvement_vip3.json",
  "office-survival": "office_survival.json",
  "pain-management": "pain_management.json",
  "phobia": "phobia.json",
  "rare-diseases": "rare_diseases.json",
  "renal-health": "renal_health.json",
  "reproductive": "reproductive_health.json",
  "respiratory": "respiratory_system.json",
  "screening": "screening_and_prevention.json",
  "sexuality": "sexuality_and_intimacy.json",
  "sexuality-intimacy-vip2": "sexuality_intimacy_vip2.json",
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
  "wife-dealing-vip2": "wife_dealing_vip2.json",
  "womens-health": "women_health.json",
  "habit-building": "habit_building.json",
  "negotiation-mastery": "negotiation_mastery.json",
  "diabetes-advanced": "diabetes_advanced.json",
  "confidence-building": "confidence_building.json",
  "financial-planning": "financial_planning_101.json",
  "onboarding-free-users": "onboarding_free_users.json",
  "parenting-toddlers": "parenting_toddlers.json",
  "relationship-conflicts": "relationship_conflicts.json",
  "weight-loss": "weight_loss_program.json",
  "anxiety-toolkit": "anxiety_toolkit.json",
  "keep-soul-calm-vip3": "keep_soul_calm_vip3.json",
  "mental-sharpness-vip3": "sharpen_mind_vip3.json",
  "overcome-storm-vip3": "overcome_storm_vip3.json",
  "shadow-work-vip3": "unlock_shadow_vip3.json",
  "human-rights-vip3": "human_rights_vip3.json",
  "confidence-vip3": "confidence_vip3.json",
  "nutrition-vip3": "nutrition_vip3.json",
  "meaning-of-life-vip3": "meaning_of_life_vip3.json",
  "philosophy-of-everyday-vip3": "philosophy_of_everyday_vip3.json",
  "finding-gods-peace-free": "finding_gods_peace_free.json",
  "gods-guidance-vip1": "gods_guidance_vip1.json",
  "gods-strength-vip2-resilience": "gods_strength_vip2_resilience.json",
  "gods-purpose-vip3": "gods_purpose_vip3.json",
  "proverbs-wisdom-vip1": "proverbs_wisdom_VIP1.json",
};

// Minimal embedded fallback to guarantee a response if JSON isn't bundled
const embeddedFallbackData: Record<string, any> = {
  generic: {
    schema_version: "1.0",
    schema_id: "generic_room",
    room_essay: {
      en:
        "Welcome! I will provide concise, supportive guidance using general best practices for this topic.",
      vi:
        "Chào bạn! Tôi sẽ hỗ trợ ngắn gọn, hữu ích dựa trên các thực hành tốt nhất về chủ đề này.",
    },
    safety_disclaimer: {
      en:
        "Educational guidance only; not a substitute for professional advice or emergency care.",
      vi:
        "Chỉ mang tính giáo dục; không thay thế tư vấn chuyên môn hoặc chăm sóc khẩn cấp.",
    },
    crisis_footer: {
      en:
        "If symptoms are severe or worsening, seek local professional help immediately.",
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

  // 1) Prefer module import (works when JSON is bundled)
  try {
    const url = new URL(`./data/${fileName}`, import.meta.url);
    const mod = await import(url.href, { with: { type: "json" } } as any);
    const data = (mod as any).default || mod;
    console.log(`Successfully loaded room data (module) for ${roomId}`);
    return data;
  } catch (e) {
    console.warn(`Module import failed for ${fileName}, trying file read:`, e);
  }

  // 2) Fallback to reading the file at runtime
  try {
    const url = new URL(`./data/${fileName}`, import.meta.url);
    const text = await Deno.readTextFile(url);
    const data = JSON.parse(text);
    console.log(`Successfully loaded room data (file) for ${roomId}`);
    return data;
  } catch (error) {
    console.error(`Failed to load room data for ${roomId}:`, error);
    return embeddedFallbackData.generic;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { roomId, messages } = await req.json();
    const authHeader = req.headers.get("authorization");

    if (!roomId || !messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "roomId and messages array required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Validate message content
    const lastMessage = messages[messages.length - 1];
    if (
      !lastMessage || !lastMessage.content || typeof lastMessage.content !==
        "string"
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid message format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const messageContent = lastMessage.content.trim();

    // Validate message length
    if (messageContent.length === 0) {
      return new Response(
        JSON.stringify({ error: "Message cannot be empty" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (messageContent.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Message too long (max 2000 characters)" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Check for suspicious patterns (basic XSS prevention)
    const suspiciousPatterns = /<script|javascript:|onerror=|onclick=/i;
    if (suspiciousPatterns.test(messageContent)) {
      return new Response(
        JSON.stringify({ error: "Invalid content detected" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // SERVER-SIDE TIER VALIDATION (auth required)
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // User client (ENFORCES RLS) — critical for ai_usage_daily
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
        JSON.stringify({ error: "Invalid authentication" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Check user suspension status (admin read)
    const { data: modStatus } = await supabaseAdmin
      .from("user_moderation_status")
      .select("is_suspended, is_muted, muted_until")
      .eq("user_id", user.id)
      .single();

    if (modStatus?.is_suspended) {
      return new Response(
        JSON.stringify({ error: "Account suspended for policy violations" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (modStatus?.is_muted && modStatus.muted_until) {
      const muteExpiry = new Date(modStatus.muted_until);
      if (muteExpiry > new Date()) {
        return new Response(
          JSON.stringify({
            error: `Account muted until ${muteExpiry.toISOString()}`,
          }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    // Server-side content moderation (admin-to-admin call)
    try {
      const moderationResponse = await fetch(
        `${supabaseUrl}/functions/v1/content-moderation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            content: messageContent,
            userId: user.id,
            roomId,
            language: "en",
          }),
        },
      );

      if (moderationResponse.ok) {
        const moderationResult = await moderationResponse.json();
        if (!moderationResult.allowed) {
          return new Response(
            JSON.stringify({ error: moderationResult.message }),
            {
              status: 403,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
      }
    } catch (e) {
      console.warn("Moderation call failed (continuing):", e);
    }

    // Room tier check (admin read)
    const { data: roomTierRow } = await supabaseAdmin
      .from("rooms")
      .select("tier")
      .eq("id", roomId)
      .single();

    const roomTier = roomTierRow?.tier || "free";

    // Verify user has access to this ROOM tier
    const { hasAccess, tier: userRoomTier } = await verifyUserTierAccess(
      supabaseAdmin,
      user.id,
      roomTier,
    );

    if (!hasAccess) {
      console.log(
        `Access denied: User tier ${userRoomTier} cannot access ${roomTier} room`,
      );
      return new Response(
        JSON.stringify({
          error: "Insufficient subscription tier",
          required: roomTier,
          current: userRoomTier,
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log(
      `Access granted: User tier ${userRoomTier} accessing ${roomTier} room`,
    );

    // Extract user query (already validated above)
    const userQuery = messageContent.toLowerCase();

    // Step 1: Check cached response (24hr cache) (admin read)
    try {
      const { data: cachedResponse } = await supabaseAdmin
        .from("responses")
        .select("response_en, response_vi")
        .eq("query", userQuery)
        .eq("room_id", roomId)
        .gt("expires_at", new Date().toISOString())
        .single();

      if (cachedResponse) {
        console.log(`Cache hit for query: ${userQuery}`);
        const response = `${cachedResponse.response_en}\n\n${cachedResponse.response_vi}`;
        return new Response(JSON.stringify({ content: response }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } catch (e) {
      console.log("Cache miss or error:", e);
    }

    // Step 2: Query Supabase room table for keyword match (admin read)
    try {
      const { data: roomDataDb } = await supabaseAdmin
        .from("rooms")
        .select("*")
        .eq("id", roomId)
        .single();

      if (roomDataDb) {
        const matchedKeyword = roomDataDb.keywords?.some((kw: string) =>
          userQuery.includes(kw.toLowerCase())
        );

        if (matchedKeyword && roomDataDb.entries) {
          const entries = Array.isArray(roomDataDb.entries)
            ? roomDataDb.entries
            : [];
          const matchedEntry = entries.find((entry: any) =>
            entry.keywords?.some((kw: string) =>
              userQuery.includes(kw.toLowerCase())
            )
          );

          if (matchedEntry) {
            console.log(`Keyword match in Supabase room data for: ${roomId}`);
            const response =
              `${matchedEntry.copy?.en || roomDataDb.room_essay_en}\n\n${
                matchedEntry.copy?.vi || roomDataDb.room_essay_vi
              }`;
            return new Response(JSON.stringify({ content: response }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        }

        if (roomDataDb.room_essay_en) {
          console.log(`Using room essay for: ${roomId}`);
          const response = `${roomDataDb.room_essay_en}\n\n${roomDataDb.room_essay_vi}`;
          return new Response(JSON.stringify({ content: response }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
    } catch (e) {
      console.warn("Supabase room lookup error:", e);
    }

    // Step 3: Fallback to JSON files (legacy support)
    const roomData = await loadRoomData(roomId);

    if (!roomData) {
      return new Response(
        JSON.stringify({ error: "Room not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Build context from room data
    let contextInfo = `You are an AI advisor in the "${roomData.schema_id}" room.\n\n`;

    if (roomData.room_essay) {
      contextInfo += `Room Overview (English): ${roomData.room_essay.en}\n`;
      contextInfo += `Room Overview (Vietnamese): ${roomData.room_essay.vi}\n\n`;
    }

    // KEYWORD MATCHING: Find relevant entries based on user query
    let matchedEntries: any[] = [];
    let hasEntriesData = false;

    if (roomData.entries && Array.isArray(roomData.entries)) {
      hasEntriesData = roomData.entries.length > 0;

      const firstEntry = roomData.entries[0];
      const isSimpleFormat = firstEntry && !firstEntry.keywords &&
        (firstEntry.en || firstEntry.vi);

      if (isSimpleFormat) {
        contextInfo += `\n=== ALL PROVERBS/CONTENT ===\n`;
        roomData.entries.slice(0, 40).forEach((entry: any, idx: number) => {
          if (entry.en) {
            contextInfo += `${idx + 1}. ${entry.en} / ${entry.vi || ""}\n`;
          }
        });
        contextInfo += `\n=== END OF PROVERBS ===\n\n`;
        matchedEntries = roomData.entries;
      } else {
        matchedEntries = roomData.entries.filter((entry: any) => {
          if (!entry.keywords || !Array.isArray(entry.keywords)) return false;
          return entry.keywords.some((keyword: string) =>
            userQuery.includes(keyword.toLowerCase().replace(/_/g, " "))
          );
        });

        if (matchedEntries.length === 0 && hasEntriesData) {
          console.log(
            `[FEEDBACK] Room "${roomData.schema_id}" - No matching entries for query: "${userQuery}"`,
          );
          console.log(
            `[FEEDBACK] Available keywords in this room:`,
            roomData.entries.slice(0, 5).map((e: any) => e.keywords).flat().join(
              ", ",
            ),
          );
        }

        if (matchedEntries.length > 0) {
          console.log(
            `[SUCCESS] Found ${matchedEntries.length} matching entries for: "${userQuery}"`,
          );
          contextInfo += `\n=== RELEVANT DETAILED INFORMATION ===\n`;
          matchedEntries.slice(0, 3).forEach((entry: any, idx: number) => {
            contextInfo += `\n[Topic ${idx + 1}]\n`;
            if (entry.title) {
              contextInfo += `Title: ${entry.title.en} / ${entry.title.vi}\n`;
            }

            const cleanCopy = (text: string) => {
              if (!text) return "";
              return text
                .replace(/\*\*[^*]+\*\*\n\n/g, "")
                .replace(/\*?[Ww]ord [Cc]ount:?\s*\d+\*?/g, "")
                .replace(/\*[Ss]ố từ:?\s*\d+\*/g, "")
                .replace(/\*\*/g, "")
                .replace(
                  /(?:\n|\s)*\d{1,2}:\d{2}:\d{2}\s?(AM|PM)?\.?$/i,
                  "",
                )
                .trim();
            };

            if (entry.content?.en) {
              contextInfo += `Content (EN): ${cleanCopy(entry.content.en)}\n`;
            }
            if (entry.content?.vi) {
              contextInfo += `Content (VI): ${cleanCopy(entry.content.vi)}\n`;
            }
            if (entry.copy?.en) {
              contextInfo += `Guidance (EN): ${cleanCopy(entry.copy.en)}\n`;
            }
            if (entry.copy?.vi) {
              contextInfo += `Guidance (VI): ${cleanCopy(entry.copy.vi)}\n`;
            }
          });
          contextInfo += `\n=== END OF DETAILED INFORMATION ===\n\n`;
        } else {
          contextInfo += `Available Topics (ask about these):\n`;
          roomData.entries.slice(0, 8).forEach((entry: any) => {
            if (entry.title?.en) {
              contextInfo += `- ${entry.title.en} (${entry.title.vi || ""})\n`;
            }
          });
          contextInfo += `\n`;
        }
      }
    } else {
      console.log(
        `[FEEDBACK] Room "${roomData.schema_id}" - NO ENTRIES DATA AVAILABLE`,
      );
    }

    const systemPrompt = `${contextInfo}
CRITICAL INSTRUCTIONS:
- You are Mercy Blade's AI advisor, acting as a knowledgeable consultant for this topic
- You represent Mercy Blade
- USE THE DETAILED INFORMATION PROVIDED ABOVE when it's available - this is your primary knowledge source
- If "RELEVANT DETAILED INFORMATION" section exists above, BASE YOUR RESPONSE ON IT
- ONLY use information from the room data provided - do NOT make up medical advice or facts
- You MUST respond in BOTH English and Vietnamese for every message
- Format: English response first, then Vietnamese response, separated by a blank line

FORMATTING RULES (CRITICAL):
- DO NOT repeat titles or headings in your response
- DO NOT include word counts or technical markers
- DO NOT include timestamp information
- Keep responses clean, natural, and conversational
- Use markdown formatting sparingly and naturally
- Strip out any source metadata before presenting to users

YOUR ADVISORY APPROACH:
- Act as an experienced advisor/consultant
- When detailed entry information is provided above, USE IT to give specific, accurate guidance
- Provide specific, actionable guidance based on the detailed content when available
- Ask 1–2 quick follow-up questions when helpful
- Keep responses natural (3-5 sentences per language)

Example format:
[English response]

[Phản hồi tiếng Việt]`;

    // ============================================================
    // AI ACCESS + MONTHLY BUDGET + THROTTLE (server-side, BEFORE AI call)
    // ============================================================
    const now = new Date();

    // Free hard block (NO AI for users without an active/trialing paid plan)
    const hasAiAccess = await hasPaidAiAccess(user.id);
    if (!hasAiAccess) {
      return new Response(
        JSON.stringify({
          error: "ai_not_available_free",
          message: "Mercy Host is available in paid plans.",
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const todayISO = now.toISOString().slice(0, 10); // YYYY-MM-DD

    // 1) Fetch or create today's usage row (RLS-enforced via supabaseUser)
    const { data: usageRowRaw, error: usageReadErr } = await supabaseUser
      .from("ai_usage_daily")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", todayISO)
      .maybeSingle();

    if (usageReadErr) {
      return new Response(
        JSON.stringify({ error: "usage_read_failed" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    let usageRow: any = usageRowRaw;

    if (!usageRow) {
      const { data: created, error: createErr } = await supabaseUser
        .from("ai_usage_daily")
        .insert({
          user_id: user.id,
          date: todayISO,
          messages_used: 0,
          last_request_at: null,
          minute_window_start: null,
          minute_window_count: 0,
        })
        .select("*")
        .single();

      if (createErr) {
        return new Response(
          JSON.stringify({ error: "usage_create_failed" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      usageRow = created;
    }

    // 2) Abuse protection: Max 1 request / 3 seconds
    if (usageRow?.last_request_at) {
      const last = new Date(usageRow.last_request_at).getTime();
      const deltaMs = Date.now() - last;
      if (deltaMs < 3000) {
        return new Response(
          JSON.stringify({
            error: "rate_limited",
            message: "Slow down a little and try again.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    // 3) Abuse protection: Max 5 requests / minute
    let windowStart = usageRow?.minute_window_start
      ? new Date(usageRow.minute_window_start)
      : null;
    let windowCount = Number(usageRow?.minute_window_count ?? 0);

    if (!windowStart || (Date.now() - windowStart.getTime()) >= 60_000) {
      windowStart = now;
      windowCount = 0;
    }

    if (windowCount >= 5) {
      return new Response(
        JSON.stringify({
          error: "rate_limited",
          message: "You’re going fast. Please wait a moment.",
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 4) Monthly AI budget check
    let budget: AiBudgetResult;
    try {
      budget = await checkAiBudget(user.id, 1500);
    } catch (e) {
      console.error("AI budget check failed:", e);
      return new Response(
        JSON.stringify({ error: "budget_check_failed" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!budget.allowed) {
      return new Response(
        JSON.stringify({
          error: "monthly_ai_limit_reached",
          message: budget.message,
          reset_at: budget.reset_at,
          can_buy_extra_ai_now: true,
          usage_ratio: budget.usage_ratio,
        }),
        {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 5) Update throttle fields only BEFORE AI call
    const { error: updErr } = await supabaseUser
      .from("ai_usage_daily")
      .update({
        last_request_at: now.toISOString(),
        minute_window_start: windowStart.toISOString(),
        minute_window_count: windowCount + 1,
      })
      .eq("user_id", user.id)
      .eq("date", todayISO);

    if (updErr) {
      return new Response(
        JSON.stringify({ error: "usage_update_failed" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // ---------------------------
    // OpenAI (direct) — streaming
    // ---------------------------
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY not configured");
    }

    const model = "gpt-4.1-mini";

    // Step 4: AI fallback with exponential backoff for 429
    let retries = 0;
    const maxRetries = 3;
    let aiResponse: Response | null = null;

    while (retries < maxRetries) {
      try {
        aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              ...messages,
            ],
            stream: true,
            stream_options: { include_usage: true },
            temperature: 0.4,
          }),
        });

        if (aiResponse.status === 429) {
          const backoffMs = Math.pow(2, retries) * 1000; // 1s, 2s, 4s
          console.log(
            `Rate limited, retrying in ${backoffMs}ms (attempt ${retries + 1}/${maxRetries})`,
          );
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
          retries++;
          continue;
        }

        if (!aiResponse.ok) {
          const errorText = await aiResponse.text();
          console.error("AI provider error:", aiResponse.status, errorText);
          throw new Error("AI provider error");
        }

        break; // Success
      } catch (e) {
        console.error("AI call error:", e);
        if (retries >= maxRetries - 1) throw e;
        retries++;
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, retries) * 1000)
        );
      }
    }

    if (!aiResponse || !aiResponse.ok) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded after retries. Please try again later.",
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!aiResponse.body) {
      throw new Error("AI provider returned no response body");
    }

    const [clientStream, parseStream] = aiResponse.body.tee();

    // Cache AI response + log usage after stream parse (best-effort)
    const backgroundTask = (async () => {
      try {
        let fullContent = "";
        let requestId: string | null = null;
        let promptTokens = 0;
        let completionTokens = 0;

        await consumeOpenAiSseStream(parseStream, (parsed) => {
          if (parsed?.id && typeof parsed.id === "string") {
            requestId = parsed.id;
          }

          const deltaContent = parsed?.choices?.[0]?.delta?.content;
          if (typeof deltaContent === "string") {
            fullContent += deltaContent;
          }

          if (parsed?.usage) {
            const nextPromptTokens = Number(parsed.usage.prompt_tokens ?? 0);
            const nextCompletionTokens = Number(
              parsed.usage.completion_tokens ?? 0,
            );

            if (!Number.isNaN(nextPromptTokens)) {
              promptTokens = nextPromptTokens;
            }
            if (!Number.isNaN(nextCompletionTokens)) {
              completionTokens = nextCompletionTokens;
            }
          }
        });

        if (fullContent) {
          try {
            await supabaseAdmin.from("responses").insert({
              query: userQuery,
              room_id: roomId,
              response_en: fullContent,
              response_vi: fullContent, // TODO: split by language later
            });
          } catch (e) {
            console.warn("Failed to cache AI response:", e);
          }
        }

        const estimatedCostVnd = estimateOpenAICostVnd({
          model,
          inputTokens: promptTokens,
          outputTokens: completionTokens,
        });

        await Promise.allSettled([
          logAiUsageEvent({
            userId: user.id,
            model,
            tokensInput: promptTokens,
            tokensOutput: completionTokens,
            endpoint: "ai-chat",
          }),
          logAiUsageLog({
            userId: user.id,
          feature: "ai-chat",
          model,
          requestId,
          inputTokens: promptTokens,
          outputTokens: completionTokens,
          estimatedCostVnd,
          meta: {
            roomId,
            matchedEntriesCount: matchedEntries.length,
          },
        }),
        ]);
      } catch (e) {
        console.warn("Failed to process AI stream for cache/logging:", e);
      }
    })();

    const edgeRuntime = (globalThis as {
      EdgeRuntime?: { waitUntil?: (promise: Promise<unknown>) => void };
    }).EdgeRuntime;

    if (typeof edgeRuntime?.waitUntil === "function") {
      edgeRuntime.waitUntil(backgroundTask);
    } else {
      backgroundTask.catch((e) => {
        console.warn("Background AI post-processing failed:", e);
      });
    }

    return new Response(clientStream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in ai-chat function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});