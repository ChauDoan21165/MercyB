// supabase/functions/guide-assistant/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.56.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

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

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
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

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const OPENAI_KEY = Deno.env.get("OPENAI_KEY") || Deno.env.get("OPENAI_API_KEY")!;

  if (!SUPABASE_URL || !ANON_KEY || !SERVICE_ROLE || !OPENAI_KEY) {
    return json({ error: "Missing env vars (SUPABASE_URL/ANON_KEY/SERVICE_ROLE/OPENAI_KEY)" }, 500);
  }

  const authHeader = req.headers.get("Authorization") || "";

  // User-scoped client (for auth check)
  const supabaseUser = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userRes, error: userErr } = await supabaseUser.auth.getUser();
  const user = userRes?.user;

  if (userErr || !user) return json({ error: "Unauthorized" }, 401);

  // Admin client (for inserts/updates)
  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE);

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const userMessage = String(body?.userMessage ?? "").trim();
  const room_id = String(body?.room_id ?? "").trim();
  const conversationHistory = Array.isArray(body?.conversationHistory) ? body.conversationHistory : [];
  const requestId = String(body?.request_id ?? "") || makeRequestId();

  if (!userMessage) return json({ error: "Missing userMessage" }, 400);
  if (!room_id) return json({ error: "Missing room_id" }, 400);

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
    // default vip1
  }

  const tierPolicy = tierPolicyForVip(vip_rank);

  const isPronunciation =
    /pronoun|pronunciation|say it|how to pronounce|correct my accent|ipa|stress|intonation/i.test(userMessage);

  const plan = isPronunciation
    ? { type: "pronunciation", tierPolicy }
    : { type: "default", tierPolicy };

  // Minimal system prompt (Edge). Your Next.js route can use the full systemPromptBase.
  const systemPrompt = [
    "You are Mercy Host, a strict, kind teacher.",
    "Always do what the user asked.",
    "If plan.type is pronunciation: return JSON ONLY following the required contract.",
    "",
    "ROOM_CONTEXT:",
    JSON.stringify({ room_id }, null, 2),
    "",
    "STUDENT_CONTEXT:",
    JSON.stringify({ user_id: user.id, vip_rank, tier_depth_policy: tierPolicy }, null, 2),
  ].join("\n");

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

  // Default mode (text)
  const normal = await openai.chat.completions.create({
    model,
    temperature: 0.5,
    messages: [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "system", content: planningInstruction },
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

  return json({ request_id: requestId, response: normal.choices?.[0]?.message?.content ?? "" }, 200);
});