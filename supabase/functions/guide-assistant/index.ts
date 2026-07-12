// supabase/functions/guide-assistant/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.56.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { checkRateLimit, getClientIP, rateLimitResponse } from "../_shared/rateLimit.ts";
import { logAiUsage, isAiEnabled, isUserAiEnabled, aiDisabledResponse, logAiUsageLogBackground } from "../_shared/aiUsage.ts";
import { SAFE_RESPONSE } from "../_shared/crisisResponse.ts";

// Restored from deployed prod v127 (lost in PR #198). Abuse rate-limit:
// 20 requests per minute per IP.
const RATE_LIMIT_CONFIG = {
  maxRequests: 20,
  windowMs: 60_000,
};

// Restored from deployed prod v127 (lost in PR #198). Self-harm / medical
// crisis interception: if the incoming user text contains any of these,
// we return SAFE_RESPONSE *before* any LLM call.
const CRISIS_KEYWORDS = [
  "suicide",
  "kill myself",
  "want to die",
  "end my life",
  "self-harm",
  "hurt myself",
  "tự tử",
  "muốn chết",
  "kết thúc cuộc sống",
  "tự làm hại",
  "medication",
  "diagnosis",
  "prescribe",
  "thuốc",
  "chẩn đoán",
  "kê đơn",
];

// SAFE_RESPONSE copy now lives in ../_shared/crisisResponse.ts (single
// source of truth, shared with guide-english-helper). The safety LOGIC
// below (containsCrisisKeywords + the pre-LLM gate) is unchanged — only
// the user-facing wording moved, and the VI is now native (not a
// translation) in Mercy's canonical informal register.

function containsCrisisKeywords(text: string): boolean {
  const lower = String(text || "").toLowerCase();
  return CRISIS_KEYWORDS.some((keyword) => lower.includes(keyword));
}

type TierDepth = "short" | "medium" | "high";

type PronunciationJSON = {
  type: "pronunciation_feedback";
  tier_depth: TierDepth;
  sentence: string;
  ipa: string | null;
  stress_pattern: string | null;
  intonation: string | null;
  key_corrections: Array<{ issue: string; fix: string }>;
  sound_breakdown: Array<{ sound: string; word: string; description: string }>;
  mouth_guidance: Array<{ sound: string; tip: string }>;
  common_accent_notes: string[];
  minimal_pairs: Array<{ word1: string; word2: string }>;
  drills: string[];
  next_action: string;
};

const PRONUNCIATION_JSON_CONTRACT = `
Return ONLY valid JSON using this exact structure:

{
  "type": "pronunciation_feedback",
  "tier_depth": "short" | "medium" | "high",
  "sentence": string,
  "ipa": string | null,
  "stress_pattern": string | null,
  "intonation": string | null,
  "key_corrections": [
    { "issue": string, "fix": string }
  ],
  "sound_breakdown": [
    { "sound": string, "word": string, "description": string }
  ],
  "mouth_guidance": [
    { "sound": string, "tip": string }
  ],
  "common_accent_notes": string[],
  "minimal_pairs": [
    { "word1": string, "word2": string }
  ],
  "drills": string[],
  "next_action": string
}

Rules:
- Do NOT include any explanation outside JSON.
- Do NOT wrap in markdown.
- Always include ALL keys.
- All unused arrays must be empty arrays.
- Never include code fences.
`;

// WS1 — Mercy's Vietnamese voice contract (default text mode).
// The student is a Vietnamese L1 learner. Mercy's commentary must be
// authored DIRECTLY in Vietnamese (not translated from English), in
// MERCY's canonical register: informal-friendly, female teacher, self
// "mình", learner "bạn" (src/config/mercyPersona.ts). The strict
// "thầy↔em" form is reverted — Mercy is female ("thầy" is the male
// term) and that register contradicted every other live Mercy surface
// (greetings.ts / tierScripts.ts). The anti-translationese guidance is
// kept: this instruction still flips the model from "compose English,
// append a Vietnamese translation" (the diagnosed translationese root
// cause) to "think and write in Vietnamese first". Wording lives here,
// not WS2's full exemplar corpus.
const VI_TEACHER_CONTRACT = `
NGÔN NGỮ & GIỌNG VĂN (BẮT BUỘC):
- Bạn là Mercy — cô giáo dạy tiếng Anh cho người Việt (nhân vật nữ). Giọng ấm áp, thân thiện, đồng hành như một người bạn lớn — KHÔNG trịnh trọng, KHÔNG xa cách.
- Tự xưng "mình", gọi học viên bằng tên hoặc "bạn". TUYỆT ĐỐI không xưng "thầy"/"cô", không gọi học viên là "em", không dùng "tôi".
- Viết tiếng Việt tự nhiên như người Việt nói — giọng miền Bắc/Hà Nội chuẩn mực, nhẹ nhàng mà rõ ràng.
- Soạn lời nhận xét TRỰC TIẾP bằng tiếng Việt. Nghĩ bằng tiếng Việt trước. TUYỆT ĐỐI không viết bằng tiếng Anh rồi dịch sang tiếng Việt.
- Tiếng Việt lược bỏ chủ ngữ khi đã rõ ngữ cảnh. Không lặp "bạn / của bạn" ở mỗi câu.
- Hạn chế "Tuy nhiên / Hơn nữa / Ngoài ra" — tiếng Anh cần, tiếng Việt thường bỏ. Câu ngắn; tách câu dài.
- Tránh văn dịch máy:
  ❌ "Bạn đã làm tốt với câu này."                          ✅ "Câu này bạn viết tốt rồi."
  ❌ "Hãy chắc chắn rằng bạn sử dụng thì quá khứ."           ✅ "Chỗ này nhớ dùng thì quá khứ nhé."
  ❌ "Tuy nhiên, có một vài lỗi ngữ pháp trong bài của bạn."  ✅ "Bài còn vài lỗi ngữ pháp nhỏ."
- Chỉ dùng tiếng Anh khi trích đúng nội dung tiếng Anh đang dạy (câu mẫu, từ vựng). Lời Mercy giảng/nhận xét luôn bằng tiếng Việt.
`;

// WS1 — structured output contract for default text mode. The model
// returns a JSON object so the VI/EN boundary is SERVER-controlled,
// replacing the client-side first-Vietnamese-char heuristic guess.
const DEFAULT_OUTPUT_CONTRACT = `
ĐỊNH DẠNG ĐẦU RA (BẮT BUỘC):
Trả về DUY NHẤT một JSON object. Không markdown, không chú thích ngoài JSON, không code fence:

{
  "vi": string,   // Lời Mercy bằng tiếng Việt tự nhiên (giọng mình↔bạn, thân thiện). Đây là NỘI DUNG CHÍNH, soạn trực tiếp bằng tiếng Việt.
  "en": string    // Cùng ý đó diễn đạt gọn bằng tiếng Anh tự nhiên, để học viên đối chiếu khi cần. KHÔNG dịch từng chữ từ "vi".
}

Quy tắc:
- "vi" được soạn trực tiếp bằng tiếng Việt — KHÔNG phải bản dịch của "en".
- "en" ngắn gọn, tự nhiên — KHÔNG phải bản dịch từng chữ của "vi".
- Luôn có đủ cả hai khoá "vi" và "en". JSON hợp lệ, không bọc trong code fence.
`;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

const loggedMissingEnv = new Set<string>();

function getRequiredEnv(name: string): string | null {
  const value = Deno.env.get(name)?.trim() ?? "";
  if (value) return value;
  if (!loggedMissingEnv.has(name)) {
    console.error(`[guide-assistant] Missing required env ${name}`);
    loggedMissingEnv.add(name);
  }
  return null;
}

function getOpenAiKey(): string | null {
  const legacyName = "OPENAI_KEY";
  const canonicalName = "OPENAI_API_KEY";
  const legacyValue = Deno.env.get(legacyName)?.trim() ?? "";
  if (legacyValue) return legacyValue;
  const canonicalValue = Deno.env.get(canonicalName)?.trim() ?? "";
  if (canonicalValue) return canonicalValue;
  for (const name of [legacyName, canonicalName]) {
    if (!loggedMissingEnv.has(name)) {
      console.error(`[guide-assistant] Missing required env ${name}`);
      loggedMissingEnv.add(name);
    }
  }
  return null;
}

function makeRequestId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }
}

function stripMarkdownCodeFences(s: string) {
  const t = String(s || "").trim();
  if (!t) return "";
  if (t.startsWith("```")) {
    return t.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  }
  return t;
}

function safeJsonParse(raw: string): any | null {
  const cleaned = stripMarkdownCodeFences(raw);
  try {
    return JSON.parse(cleaned);
  } catch {
    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");
    if (first >= 0 && last > first) {
      const slice = cleaned.slice(first, last + 1);
      try {
        return JSON.parse(slice);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function normalizePronunciationJson(parsed: any, tierDepth: TierDepth): PronunciationJSON {
  const obj = parsed && typeof parsed === "object" ? parsed : {};

  const scrub = (v: any) => {
    if (v === null || v === undefined) return v;
    const s = String(v);
    return s.replace(/```/g, "").trim();
  };

  return {
    type: "pronunciation_feedback",
    tier_depth: (obj.tier_depth ?? tierDepth) as TierDepth,
    sentence: scrub(obj.sentence ?? "") ?? "",
    ipa: obj.ipa === null || obj.ipa === undefined ? null : scrub(obj.ipa),
    stress_pattern: obj.stress_pattern === null || obj.stress_pattern === undefined ? null : scrub(obj.stress_pattern),
    intonation: obj.intonation === null || obj.intonation === undefined ? null : scrub(obj.intonation),
    key_corrections: Array.isArray(obj.key_corrections)
      ? obj.key_corrections
          .map((x: any) => ({ issue: scrub(x?.issue ?? "") ?? "", fix: scrub(x?.fix ?? "") ?? "" }))
          .filter((x: any) => x.issue || x.fix)
      : [],
    sound_breakdown: Array.isArray(obj.sound_breakdown)
      ? obj.sound_breakdown
          .map((x: any) => ({
            sound: scrub(x?.sound ?? "") ?? "",
            word: scrub(x?.word ?? "") ?? "",
            description: scrub(x?.description ?? "") ?? "",
          }))
          .filter((x: any) => x.sound || x.word || x.description)
      : [],
    mouth_guidance: Array.isArray(obj.mouth_guidance)
      ? obj.mouth_guidance
          .map((x: any) => ({ sound: scrub(x?.sound ?? "") ?? "", tip: scrub(x?.tip ?? "") ?? "" }))
          .filter((x: any) => x.sound || x.tip)
      : [],
    common_accent_notes: Array.isArray(obj.common_accent_notes)
      ? obj.common_accent_notes.map((x: any) => scrub(x ?? "") ?? "").filter(Boolean)
      : [],
    minimal_pairs: Array.isArray(obj.minimal_pairs)
      ? obj.minimal_pairs
          .map((x: any) => ({ word1: scrub(x?.word1 ?? "") ?? "", word2: scrub(x?.word2 ?? "") ?? "" }))
          .filter((x: any) => x.word1 || x.word2)
      : [],
    drills: Array.isArray(obj.drills) ? obj.drills.map((x: any) => scrub(x ?? "") ?? "").filter(Boolean) : [],
    next_action: scrub(obj.next_action ?? "") ?? "",
  };
}

function cleanupText(v: any): string {
  if (v === null || v === undefined) return "";
  return String(v).replace(/```/g, "").trim();
}

// WS1 — normalize default-mode model output into { vi, en }. If the
// model ignored the JSON contract and returned prose, treat the whole
// thing as Vietnamese (the contract is VI-primary) so the surface
// degrades softly instead of throwing. Core path survives optional
// model misbehaviour (CLAUDE.md operating discipline).
function normalizeBilingual(parsed: any, rawFallback: string): { vi: string; en: string } {
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    const vi = cleanupText(parsed.vi);
    const en = cleanupText(parsed.en);
    if (vi || en) return { vi: vi || en, en };
  }
  const raw = cleanupText(rawFallback);
  return { vi: raw, en: "" };
}

// Weakness extraction (simple, grows over time)
type Weakness = { category: string; pattern: string; weight: number };

function extractWeaknesses(p: PronunciationJSON): Weakness[] {
  const bag: Weakness[] = [];
  for (const c of p.key_corrections || []) {
    const issue = String(c?.issue || "");
    if (issue.includes("/ð/") || issue.toLowerCase().includes("th sound")) bag.push({ category: "pronunciation", pattern: "/ð/", weight: 1 });
    if (issue.includes("/θ/")) bag.push({ category: "pronunciation", pattern: "/θ/", weight: 1 });
    if (issue.toLowerCase().includes("stress")) bag.push({ category: "pronunciation", pattern: "stress_flat", weight: 1 });
    if (issue.toLowerCase().includes("intonation")) bag.push({ category: "pronunciation", pattern: "intonation", weight: 1 });
    if (issue.toLowerCase().includes("ending") || issue.toLowerCase().includes("final consonant")) bag.push({ category: "pronunciation", pattern: "final_consonant", weight: 1 });
  }
  const map = new Map<string, Weakness>();
  for (const w of bag) {
    const k = `${w.category}|||${w.pattern}`;
    const prev = map.get(k);
    map.set(k, prev ? { ...prev, weight: prev.weight + w.weight } : w);
  }
  return Array.from(map.values());
}

async function upsertWeaknessIncrement(supabaseAdmin: any, userId: string, weaknesses: Weakness[]) {
  const now = new Date().toISOString();
  for (const w of weaknesses) {
    const category = String(w.category || "").trim();
    const key_pattern = String(w.pattern || "").trim();
    const inc = Number(w.weight || 1);
    if (!category || !key_pattern || !Number.isFinite(inc) || inc <= 0) continue;

    const { data: existing } = await supabaseAdmin
      .from("mb_user_weakness_profile")
      .select("frequency")
      .eq("user_id", userId)
      .eq("category", category)
      .eq("key_pattern", key_pattern)
      .maybeSingle();

    if (!existing) {
      await supabaseAdmin.from("mb_user_weakness_profile").insert({
        user_id: userId,
        category,
        key_pattern,
        frequency: inc,
        last_seen: now,
      });
    } else {
      const current = Number((existing as any)?.frequency ?? 0);
      await supabaseAdmin
        .from("mb_user_weakness_profile")
        .update({ frequency: (Number.isFinite(current) ? current : 0) + inc, last_seen: now })
        .eq("user_id", userId)
        .eq("category", category)
        .eq("key_pattern", key_pattern);
    }
  }
}

async function logUsage(supabaseAdmin: any, payload: any) {
  try {
    await supabaseAdmin.from("mb_ai_usage_logs").insert(payload);
  } catch {
    // ignore
  }
}

async function logPronAttempt(supabaseAdmin: any, payload: any) {
  try {
    await supabaseAdmin.from("mb_pronunciation_attempts").insert(payload);
  } catch {
    // ignore
  }
}

function tierPolicyForVip(vip: number): { depth: TierDepth; max_items: number } {
  if (vip <= 1) return { depth: "short", max_items: 2 };
  if (vip === 2) return { depth: "medium", max_items: 4 };
  return { depth: "high", max_items: 8 };
}

serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  // Restored prod safety: abuse rate-limit by IP (20 req/min) before any work.
  const clientIP = getClientIP(req);
  const rateCheck = checkRateLimit(`guide-assistant:${clientIP}`, RATE_LIMIT_CONFIG);
  if (!rateCheck.allowed) {
    console.warn(`Rate limit exceeded for IP: ${clientIP}`);
    return rateLimitResponse(rateCheck.retryAfterSeconds ?? 60, {});
  }

  // Restored prod safety: global AI kill-switch.
  if (!(await isAiEnabled())) {
    return aiDisabledResponse("global", {});
  }

  const SUPABASE_URL = getRequiredEnv("SUPABASE_URL");
  const ANON_KEY = getRequiredEnv("SUPABASE_ANON_KEY");
  const SERVICE_ROLE = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const OPENAI_KEY = getOpenAiKey();

  if (!SUPABASE_URL || !ANON_KEY || !SERVICE_ROLE || !OPENAI_KEY) {
    return json({ error: "Mercy guide is temporarily unavailable" }, 500);
  }

  const authHeader = req.headers.get("Authorization") || "";

  // User-scoped client (for auth check)
  const supabaseUser = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userRes, error: userErr } = await supabaseUser.auth.getUser();
  const user = userRes?.user;

  if (userErr || !user) return json({ error: "Unauthorized" }, 401);

  // Restored prod safety: per-user AI kill-switch.
  if (!(await isUserAiEnabled(user.id))) {
    return aiDisabledResponse("user", {});
  }

  // Admin client (for inserts/updates)
  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE);

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  // WS1 envelope reconciliation: the live client (askMercyApi) sends
  // `question`/`roomId`; older/edge callers send `userMessage`/`room_id`.
  // Read BOTH so the surface works regardless of which envelope arrives
  // (resolves the design-doc §0 client/edge field-name mismatch).
  const userMessage = String(body?.userMessage ?? body?.question ?? "").trim();
  const room_id = String(body?.room_id ?? body?.roomId ?? "").trim();
  const conversationHistory = Array.isArray(body?.conversationHistory) ? body.conversationHistory : [];
  const requestId = String(body?.request_id ?? "") || makeRequestId();

  // WS1 response-mode contract: default is bilingual (the client sends
  // 'bilingual_en_vi'); 'vi_only' omits the English reference. Vietnamese
  // is always the primary, natively-authored field either way.
  const responseMode = String(body?.responseMode ?? "").toLowerCase();
  const wantEnglish = responseMode !== "vi_only";

  // Optional progress snapshot from src/lib/mercy/progressContext.
  // Sent by the chat layer only when the trigger + cooldown allow.
  // Shape mirrors ProgressContext exactly; we read defensively
  // because the edge function can't import the client type.
  const progressContext = sanitizeProgressContext(body?.progressContext);
  const progressBlock = progressContext ? formatProgressBlock(progressContext) : "";

  if (!userMessage) return json({ error: "Missing userMessage" }, 400);
  if (!room_id) return json({ error: "Missing room_id" }, 400);

  // Restored prod safety: self-harm / medical crisis interception.
  // Runs BEFORE any LLM call. Wording preserved verbatim from prod v127.
  if (containsCrisisKeywords(userMessage)) {
    const language = String(body?.language ?? "").toLowerCase();
    const answer =
      language === "vi"
        ? `${SAFE_RESPONSE.vi}\n\n${SAFE_RESPONSE.en}`
        : `${SAFE_RESPONSE.en}\n\n${SAFE_RESPONSE.vi}`;
    // Safety logic + wording above are byte-identical to #664. Only the
    // RESPONSE ENVELOPE is widened with the WS1 mirror keys so the
    // un-migrated client actually renders the safe message instead of
    // throwing on its `!data?.ok || !data?.answer` gate — i.e. the guard
    // is preserved AND made deliverable, not weakened.
    return json(
      {
        request_id: requestId,
        response: { vi: SAFE_RESPONSE.vi, en: SAFE_RESPONSE.en },
        ok: true,
        answer,
        answerVi: SAFE_RESPONSE.vi,
      },
      200,
    );
  }

  // Load VIP rank (use your mb_user_effective_rank view/table if it exists)
  let vip_rank = 1;
  try {
    const { data } = await supabaseAdmin
      .from("mb_user_effective_rank")
      .select("vip_rank")
      .eq("user_id", user.id)
      .order("vip_rank", { ascending: false })
      .limit(1);
    const r = Array.isArray(data) ? (data[0] as any)?.vip_rank : (data as any)?.vip_rank;
    const n = Number(r);
    if (Number.isFinite(n)) vip_rank = n;
  } catch {
    // default level1
  }

  const tierPolicy = tierPolicyForVip(vip_rank);

  const isPronunciation =
    /pronoun|pronunciation|say it|how to pronounce|correct my accent|ipa|stress|intonation/i.test(userMessage);

  const plan = isPronunciation
    ? { type: "pronunciation", tierPolicy }
    : { type: "default", tierPolicy };

  // Minimal system prompt (Edge). Your Next.js route can use the full systemPromptBase.
  const systemPromptParts: string[] = [
    "You are Mercy, a warm, encouraging English teacher for Vietnamese learners (a female teacher; never strict or distant).",
    "Always do what the user asked.",
    "If plan.type is pronunciation: return JSON ONLY following the required contract.",
    "",
    "ROOM_CONTEXT:",
    JSON.stringify({ room_id }, null, 2),
    "",
    "STUDENT_CONTEXT:",
    JSON.stringify({ user_id: user.id, vip_rank, tier_depth_policy: tierPolicy }, null, 2),
  ];

  if (progressBlock) {
    // Voice rules + data block. Anchored AFTER the basic context so
    // the LLM treats progress as a coaching tool, not a header.
    systemPromptParts.push(
      "",
      "PROGRESS_MENTION_RULES:",
      "- Mention at most ONE progress point per response.",
      "- Only mention progress when the user expresses doubt, frustration, a win, or asks for a practice recommendation.",
      "- Reference the data naturally inside a normal sentence — do not read it as a report.",
      "- Never lecture or use empty motivation phrases. Cite the concrete number.",
      "- Anchor to the user's recent feeling. Bad: 'Hãy tiếp tục practice nhé.' Good: 'Âm /θ/ tuần này lên 25 điểm — bạn đang luyện đúng hướng rồi đấy.'",
      "",
      progressBlock,
    );
    // Telemetry: a single line so the next analytics PR can wire it
    // into the existing Sentry breadcrumb / log stream without a
    // schema change. Cheap, idempotent, easy to grep.
    console.log(JSON.stringify({
      event: "guide_assistant_progress_injected",
      user_id: user.id,
      request_id: requestId,
      attempts_this_week: progressContext?.attemptsThisWeek ?? 0,
    }));
  }

  const systemPrompt = systemPromptParts.join("\n");

  const openai = new OpenAI({ apiKey: OPENAI_KEY });

  const model = "gpt-4o-mini";

  const planningInstruction = isPronunciation
    ? `
Teaching Plan:
${JSON.stringify(plan, null, 2)}

${PRONUNCIATION_JSON_CONTRACT}

Also:
- Respect tier_depth="${tierPolicy.depth}"
- If short: key_corrections<=2 drills<=2 minimal_pairs<=1 mouth_guidance<=1
- If medium: key_corrections<=4 drills<=4 minimal_pairs<=2 mouth_guidance<=3
`
    : `
Follow this teaching plan:
${JSON.stringify(plan, null, 2)}
`;

  if (isPronunciation) {
    // Attempt 1 (strict JSON object)
    const first = await openai.chat.completions.create({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" } as any,
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "system", content: planningInstruction },
        { role: "system", content: "STRICT OUTPUT: Return ONLY a JSON object. No markdown. No commentary." },
      ],
    });

    const content1 = first.choices?.[0]?.message?.content ?? "";
    const parsed1 = safeJsonParse(content1);

    await logUsage(supabaseAdmin, {
      user_id: user.id,
      vip_rank,
      mode: "pronunciation",
      model,
      prompt_tokens: first.usage?.prompt_tokens ?? 0,
      completion_tokens: first.usage?.completion_tokens ?? 0,
      total_tokens: first.usage?.total_tokens ?? 0,
      room_id,
      request_id: requestId,
    });

    // Restored prod safety: shared AI metering (feeds the kill-switch dashboard).
    await logAiUsage({
      userId: user.id,
      model,
      tokensInput: first.usage?.prompt_tokens ?? 0,
      tokensOutput: first.usage?.completion_tokens ?? 0,
      endpoint: "guide-assistant",
    });

    // Additive: VND-costed, language-tagged spend to ai_usage_logs. Only when the
    // provider returned real usage (no fabricated numbers).
    if (first.usage) {
      await logAiUsageLogBackground({
        userId: user.id,
        feature: "guide-assistant",
        model,
        inputTokens: first.usage.prompt_tokens ?? 0,
        outputTokens: first.usage.completion_tokens ?? 0,
      });
    }

    if (parsed1) {
      const normalized = normalizePronunciationJson(parsed1, tierPolicy.depth);
      const weaknesses = extractWeaknesses(normalized);
      await upsertWeaknessIncrement(supabaseAdmin, user.id, weaknesses);

      await logPronAttempt(supabaseAdmin, {
        user_id: user.id,
        room_id,
        sentence: normalized.sentence,
        corrections_count: normalized.key_corrections.length,
        notes: null,
        request_id: requestId,
      });

      return json({ request_id: requestId, response: normalized }, 200);
    }

    // Repair attempt 2
    const repairInstruction = `
Your previous output was invalid JSON.

Return ONLY a valid JSON object matching the required structure exactly.

INVALID_OUTPUT:
${stripMarkdownCodeFences(content1).slice(0, 6000)}
`;

    const second = await openai.chat.completions.create({
      model,
      temperature: 0.1,
      response_format: { type: "json_object" } as any,
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "system", content: `${planningInstruction}\n\n${repairInstruction}` },
        { role: "system", content: "STRICT OUTPUT: Return ONLY a JSON object. No markdown. No commentary." },
      ],
    });

    const content2 = second.choices?.[0]?.message?.content ?? "";
    const parsed2 = safeJsonParse(content2);

    await logUsage(supabaseAdmin, {
      user_id: user.id,
      vip_rank,
      mode: "pronunciation_repair",
      model,
      prompt_tokens: second.usage?.prompt_tokens ?? 0,
      completion_tokens: second.usage?.completion_tokens ?? 0,
      total_tokens: second.usage?.total_tokens ?? 0,
      room_id,
      request_id: requestId,
    });

    // Restored prod safety: shared AI metering (feeds the kill-switch dashboard).
    await logAiUsage({
      userId: user.id,
      model,
      tokensInput: second.usage?.prompt_tokens ?? 0,
      tokensOutput: second.usage?.completion_tokens ?? 0,
      endpoint: "guide-assistant",
    });

    // Additive: VND-costed, language-tagged spend to ai_usage_logs. Only when the
    // provider returned real usage (no fabricated numbers).
    if (second.usage) {
      await logAiUsageLogBackground({
        userId: user.id,
        feature: "guide-assistant",
        model,
        inputTokens: second.usage.prompt_tokens ?? 0,
        outputTokens: second.usage.completion_tokens ?? 0,
      });
    }

    if (parsed2) {
      const normalized = normalizePronunciationJson(parsed2, tierPolicy.depth);
      const weaknesses = extractWeaknesses(normalized);
      await upsertWeaknessIncrement(supabaseAdmin, user.id, weaknesses);

      await logPronAttempt(supabaseAdmin, {
        user_id: user.id,
        room_id,
        sentence: normalized.sentence,
        corrections_count: normalized.key_corrections.length,
        notes: "repair_retry",
        request_id: requestId,
      });

      return json({ request_id: requestId, response: normalized }, 200);
    }

    // Fallback
    const fallback: PronunciationJSON = normalizePronunciationJson(
      {
        type: "pronunciation_feedback",
        tier_depth: tierPolicy.depth,
        sentence: "",
        ipa: null,
        stress_pattern: null,
        intonation: null,
        key_corrections: [],
        sound_breakdown: [],
        mouth_guidance: [],
        common_accent_notes: [],
        minimal_pairs: [],
        drills: [],
        next_action: "Internal formatting issue. Please try again and paste the exact sentence you want to practice.",
      },
      tierPolicy.depth,
    );

    await logPronAttempt(supabaseAdmin, {
      user_id: user.id,
      room_id,
      sentence: "",
      corrections_count: 0,
      notes: "fallback",
      request_id: requestId,
    });

    return json({ request_id: requestId, response: fallback }, 200);
  }

  // Default mode (text) — WS1 Vietnamese-first teacher contract.
  // The model authors natural Vietnamese DIRECTLY (thầy↔em register)
  // and returns a structured { vi, en } JSON, so the bilingual boundary
  // is server-controlled instead of guessed by the client heuristic.
  const normal = await openai.chat.completions.create({
    model,
    temperature: 0.5,
    response_format: { type: "json_object" } as any,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "system", content: VI_TEACHER_CONTRACT },
      ...conversationHistory,
      { role: "system", content: planningInstruction },
      { role: "system", content: DEFAULT_OUTPUT_CONTRACT },
    ],
  });

  await logUsage(supabaseAdmin, {
    user_id: user.id,
    vip_rank,
    mode: "default",
    model,
    prompt_tokens: normal.usage?.prompt_tokens ?? 0,
    completion_tokens: normal.usage?.completion_tokens ?? 0,
    total_tokens: normal.usage?.total_tokens ?? 0,
    room_id,
    request_id: requestId,
  });

  // Restored prod safety: shared AI metering (feeds the kill-switch dashboard).
  await logAiUsage({
    userId: user.id,
    model,
    tokensInput: normal.usage?.prompt_tokens ?? 0,
    tokensOutput: normal.usage?.completion_tokens ?? 0,
    endpoint: "guide-assistant",
  });

  // Additive: VND-costed, language-tagged spend to ai_usage_logs. Only when the
  // provider returned real usage (no fabricated numbers).
  if (normal.usage) {
    await logAiUsageLogBackground({
      userId: user.id,
      feature: "guide-assistant",
      model,
      inputTokens: normal.usage.prompt_tokens ?? 0,
      outputTokens: normal.usage.completion_tokens ?? 0,
    });
  }

  const rawContent = normal.choices?.[0]?.message?.content ?? "";
  const { vi, en } = normalizeBilingual(safeJsonParse(rawContent), rawContent);

  // Canonical structured payload (WS1). `response.vi` is the
  // server-authored Vietnamese (always present); `en` only when an
  // English reference is wanted (responseMode !== 'vi_only').
  const structured: { vi: string; en?: string } =
    wantEnglish && en ? { vi, en } : { vi };

  // Transition mirror keys for the un-migrated client. ConversationThread
  // gates on data.ok/data.answer and getAssistantVietnamese reads
  // data.answerVi. The blob is built EN-first so the client's
  // splitBilingualAnswer heuristic slices on a server-controlled
  // boundary; answerVi hands it clean VI with no heuristic at all.
  // (splitBilingualAnswer client code is untouched — separate WS.)
  const answer = wantEnglish && en ? `${en}\n\n${vi}` : vi;

  return json(
    {
      request_id: requestId,
      response: structured,
      ok: true,
      answer,
      answerVi: vi,
    },
    200,
  );
});

// ── Progress-context helpers ──────────────────────────────────────────────
//
// Defensive sanitiser for `body.progressContext` from the client. The
// client type lives at src/lib/mercy/progressContext.ts; we re-decode
// here so a malformed payload (old client, manual curl) can't crash
// the system-prompt builder.

type EdgeHeatmapHighlight = {
  kind: "most_improved" | "plateau" | "needs_work" | "doing_well";
  phoneme: string;
  averageScore: number;
  delta: number | null;
};

type EdgeProgressContext = {
  attemptsThisWeek: number;
  averageScoreThisWeek: number | null;
  scoreDelta: number | null;
  mostImprovedPhoneme:
    | { phoneme: string; previousScore: number; currentScore: number; delta: number }
    | null;
  weakestPhoneme:
    | { phoneme: string; averageScore: number }
    | null;
  streak: number;
  heatmapHighlight: EdgeHeatmapHighlight | null;
};

function sanitizeProgressContext(raw: unknown): EdgeProgressContext | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const attempts = numberOrNull(r.attemptsThisWeek);
  if (attempts === null || attempts < 1) return null;
  const mostImproved = sanitizeMostImproved(r.mostImprovedPhoneme);
  const weakest = sanitizeWeakest(r.weakestPhoneme);
  const heatmapHighlight = sanitizeHeatmapHighlight(r.heatmapHighlight);
  return {
    attemptsThisWeek: attempts,
    averageScoreThisWeek: numberOrNull(r.averageScoreThisWeek),
    scoreDelta: numberOrNull(r.scoreDelta),
    mostImprovedPhoneme: mostImproved,
    weakestPhoneme: weakest,
    streak: Math.max(0, numberOrNull(r.streak) ?? 0),
    heatmapHighlight,
  };
}

function sanitizeHeatmapHighlight(raw: unknown): EdgeHeatmapHighlight | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const kindRaw = typeof r.kind === "string" ? r.kind : "";
  const kind: EdgeHeatmapHighlight["kind"] | null =
    kindRaw === "most_improved" ||
    kindRaw === "plateau" ||
    kindRaw === "needs_work" ||
    kindRaw === "doing_well"
      ? kindRaw
      : null;
  if (!kind) return null;
  const phoneme = typeof r.phoneme === "string" ? r.phoneme.trim() : "";
  if (!phoneme) return null;
  const averageScore = numberOrNull(r.averageScore);
  if (averageScore === null) return null;
  const delta = numberOrNull(r.delta);
  return { kind, phoneme, averageScore, delta };
}

function sanitizeMostImproved(raw: unknown): EdgeProgressContext["mostImprovedPhoneme"] {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const phoneme = typeof r.phoneme === "string" ? r.phoneme.trim() : "";
  if (!phoneme) return null;
  const prev = numberOrNull(r.previousScore);
  const cur = numberOrNull(r.currentScore);
  const delta = numberOrNull(r.delta);
  if (prev === null || cur === null || delta === null) return null;
  return { phoneme, previousScore: prev, currentScore: cur, delta };
}

function sanitizeWeakest(raw: unknown): EdgeProgressContext["weakestPhoneme"] {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const phoneme = typeof r.phoneme === "string" ? r.phoneme.trim() : "";
  if (!phoneme) return null;
  const avg = numberOrNull(r.averageScore);
  if (avg === null) return null;
  return { phoneme, averageScore: avg };
}

function numberOrNull(v: unknown): number | null {
  if (typeof v !== "number" || !Number.isFinite(v)) return null;
  return Math.round(v);
}

function formatProgressBlock(ctx: EdgeProgressContext): string {
  const lines: string[] = [
    "STUDENT_PROGRESS:",
    `- Attempts this week: ${ctx.attemptsThisWeek}`,
  ];
  if (ctx.averageScoreThisWeek !== null) {
    lines.push(`- Average score this week: ${ctx.averageScoreThisWeek}/100`);
  }
  if (ctx.scoreDelta !== null) {
    const sign = ctx.scoreDelta >= 0 ? "+" : "";
    lines.push(`- Score change vs last week: ${sign}${ctx.scoreDelta}`);
  }
  if (ctx.mostImprovedPhoneme) {
    const m = ctx.mostImprovedPhoneme;
    lines.push(
      `- Most improved phoneme: /${m.phoneme}/ went ${m.previousScore} → ${m.currentScore} (+${m.delta})`,
    );
  }
  if (ctx.weakestPhoneme) {
    lines.push(
      `- Still working on: /${ctx.weakestPhoneme.phoneme}/ (currently ${ctx.weakestPhoneme.averageScore}/100)`,
    );
  }
  if (ctx.streak > 0) {
    lines.push(`- Current streak: ${ctx.streak} days`);
  }
  if (ctx.heatmapHighlight) {
    const h = ctx.heatmapHighlight;
    const tag =
      h.kind === "most_improved"
        ? "30-day improving"
        : h.kind === "plateau"
        ? "30-day plateau"
        : h.kind === "needs_work"
        ? "30-day low"
        : "30-day strong";
    const deltaPart =
      h.delta !== null ? ` (delta ${h.delta >= 0 ? "+" : ""}${h.delta})` : "";
    lines.push(
      `- Heatmap (${tag}): /${h.phoneme}/ at ${h.averageScore}/100${deltaPart}`,
    );
  }
  return lines.join("\n");
}
