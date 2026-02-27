// src/server/host/renderer.ts
//
// MERGED + HARDENED (production-grade, refactored / de-duplicated):
// ✅ Pronunciation mode: strict JSON-only output (no markdown leaks) with parse/repair fallback
// ✅ Weakness extraction + safe upsert/increment into mb_user_weakness_profile
// ✅ Pronunciation attempt analytics into mb_pronunciation_attempts
// ✅ AI usage logging into mb_ai_usage_logs (token tracking per VIP tier) — aligned to real columns
// ✅ Optional Whisper transcription (audioBuffer) to guide pronunciation feedback
// ✅ Quality-event logging into mb_ai_quality_events using requestId (ALIGNED TO REAL COLUMNS)
// ✅ Automatic self-healing if JSON fails twice (3rd pass: "repair from raw")
// ✅ Quality score computation (0..100) recorded in notes
// ✅ Confidence decay if repeated failures (streak from mb_ai_quality_events)
// ✅ Intent mismatch detection (plan type vs user message) using BOTH message + room skill focus (via plan.context)
//
// Notes / Compatibility:
// - Uses Chat Completions + response_format: { type: "json_object" } to force a JSON object.
// - Weakness table columns: user_id, category, key_pattern, frequency, last_seen, (optional) severity_score
// - mb_ai_usage_logs columns: id, user_id, vip_rank, prompt_tokens, completion_tokens, total_tokens, created_at
// - mb_ai_quality_events columns (your posted schema):
//   id, created_at, request_id, user_id, room_id, vip_rank, mode, model,
//   intent_match, json_valid, has_next_action, ask_back_present, error_code, notes,
//   prompt_tokens, completion_tokens, total_tokens
// - This file must run server-side only (service role key).

import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { toFile } from "openai/uploads"; // OpenAI Node SDK helper

/* =========================================================
   CLIENTS
========================================================= */

const client = new OpenAI({
  apiKey: process.env.OPENAI_KEY!,
});

// IMPORTANT: service role key must never ship to browser. This file must run server-side only.
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

/* =========================================================
   TYPES
========================================================= */

type TierDepth = "short" | "medium" | "high";

export type PronunciationJSON = {
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

type RenderMode = "default" | "pronunciation";

/* =========================================================
   INTENT + QUALITY HELPERS
========================================================= */

// minimal, deterministic pronunciation intent detector (message-only)
function detectPronunciationIntentFromText(text: string): boolean {
  const msg = String(text || "");
  return /pronoun|pronunciation|say it|how to pronounce|accent|ipa|stress|intonation|mouth|tongue|sound|phonetic|repeat after me/i.test(
    msg,
  );
}

// room-skill focus detector (from plan.context.room_skill_focus)
function detectPronunciationIntentFromRoom(skillFocus?: string | null): boolean {
  const sf = String(skillFocus ?? "").toLowerCase();
  return sf.includes("pronunciation");
}

// combined intent signal (message OR room focus)
function detectPronunciationIntentCombined(params: { userText: string; roomSkillFocus?: string | null }): boolean {
  return detectPronunciationIntentFromText(params.userText) || detectPronunciationIntentFromRoom(params.roomSkillFocus);
}

// best-effort: last user message from conversation history
function getLastUserMessage(history: any[]): string {
  const arr = Array.isArray(history) ? history : [];
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i]?.role === "user") return String(arr[i]?.content ?? "");
  }
  return "";
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function computeAskBackPresentPronunciation(p: PronunciationJSON): boolean {
  // heuristic: a question somewhere in next_action or drills
  const na = String(p?.next_action ?? "");
  if (/\?/.test(na)) return true;
  for (const d of p?.drills ?? []) if (/\?/.test(String(d))) return true;
  return false;
}

function computeAskBackPresentDefault(text: string): boolean {
  return /\?/.test(String(text ?? ""));
}

function computeHasNextActionPronunciation(p: PronunciationJSON): boolean {
  return Boolean(String(p?.next_action ?? "").trim().length >= 4);
}

function computeHasNextActionDefault(text: string): boolean {
  // heuristic for normal responses (you can tune later)
  return /next action|next step|try|practice|repeat|your turn|quick check|now you/i.test(String(text ?? ""));
}

function safeUsage(usage: any) {
  return {
    prompt_tokens: Number(usage?.prompt_tokens ?? 0) || 0,
    completion_tokens: Number(usage?.completion_tokens ?? 0) || 0,
    total_tokens: Number(usage?.total_tokens ?? 0) || 0,
  };
}

/**
 * Pull a short tail of recent quality events to compute failure streak.
 * "Failure" here means json_valid=false OR error_code not null for pronunciation mode.
 */
async function getPronunciationFailureStreak(userId?: string | null): Promise<number> {
  const uid = userId ?? null;
  if (!uid) return 0;

  try {
    const { data } = await supabase
      .from("mb_ai_quality_events")
      .select("json_valid, error_code, mode")
      .eq("user_id", uid)
      .eq("mode", "pronunciation")
      .order("created_at", { ascending: false })
      .limit(10);

    const rows = Array.isArray(data) ? data : [];
    let streak = 0;

    for (const r of rows) {
      const jsonValid = Boolean((r as any)?.json_valid);
      const err = (r as any)?.error_code;
      const failed = !jsonValid || Boolean(err);
      if (failed) streak++;
      else break;
    }

    return streak;
  } catch {
    return 0;
  }
}

function computeQualityScore(params: {
  intentMatch: boolean;
  jsonValid: boolean;
  hasNextAction: boolean;
  askBackPresent: boolean;
  failureStreak: number; // consecutive recent failures BEFORE this response
  stage: "first_pass" | "repair_pass" | "self_heal_pass" | "fallback" | "default_pass";
}) {
  // start at 100, subtract penalties
  let score = 100;

  if (!params.intentMatch) score -= 30;
  if (!params.jsonValid) score -= 50;
  if (params.jsonValid && !params.hasNextAction) score -= 15;
  if (params.jsonValid && !params.askBackPresent) score -= 10;

  // repeated failure penalty (trust impact)
  score -= params.failureStreak * 5;

  // extra penalty if we had to self-heal or fallback
  if (params.stage === "repair_pass") score -= 5;
  if (params.stage === "self_heal_pass") score -= 12;
  if (params.stage === "fallback") score -= 35;

  score = clamp(score, 0, 100);

  // confidence decays with streak; never below 0.20
  const confidence = clamp(1 - 0.18 * params.failureStreak, 0.2, 1);

  return { score, confidence };
}

/* =========================================================
   QUALITY EVENTS LOGGER (ALIGNED TO YOUR REAL COLUMNS)
========================================================= */

async function logQualityEvent(params: {
  requestId?: string | null;
  userId?: string | null;
  roomId?: string | null;
  vipRank?: number | null;
  mode: RenderMode;
  model: string;

  intentMatch: boolean;
  jsonValid: boolean;
  hasNextAction: boolean;
  askBackPresent: boolean;

  errorCode?: string | null; // ex: "JSON_PARSE_FAILED"
  notes?: string | null; // metadata string
  usage?: any; // prompt/completion/total
}) {
  const row: any = {
    request_id: params.requestId ?? null,
    user_id: params.userId ?? null,
    room_id: params.roomId ?? null,
    vip_rank: Number(params.vipRank ?? 0),
    mode: params.mode,
    model: params.model,

    intent_match: Boolean(params.intentMatch),
    json_valid: Boolean(params.jsonValid),
    has_next_action: Boolean(params.hasNextAction),
    ask_back_present: Boolean(params.askBackPresent),

    error_code: params.errorCode ?? null,
    notes: params.notes ?? null,

    ...safeUsage(params.usage),
  };

  try {
    await supabase.from("mb_ai_quality_events").insert(row);
  } catch {
    // best-effort only; never break response
  }
}

/* =========================================================
   PRONUNCIATION OUTPUT CONTRACT (JSON-only)
========================================================= */

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

/* =========================================================
   JSON HARDENING / NORMALIZATION
========================================================= */

function stripMarkdownCodeFences(s: string) {
  const t = String(s || "").trim();
  if (!t) return "";
  if (!t.startsWith("```")) return t;
  // handle ```json ... ```
  return t.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
}

function safeJsonParse(raw: string): any | null {
  const cleaned = stripMarkdownCodeFences(raw);

  try {
    return JSON.parse(cleaned);
  } catch {
    // best-effort extraction (model sometimes prepends text)
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

// Remove markdown/codefences and trim. Keep nulls as nulls.
function scrubText(v: any): any {
  if (v === null || v === undefined) return v;
  const s = String(v);
  return stripMarkdownCodeFences(s).replace(/```/g, "").trim();
}

function normalizeTierDepth(x: any, fallback: TierDepth): TierDepth {
  const t = String(x ?? "").trim().toLowerCase();
  if (t === "short" || t === "medium" || t === "high") return t;
  return fallback;
}

function normalizePronunciationJson(parsed: any, tierDepth: TierDepth): PronunciationJSON {
  const obj = parsed && typeof parsed === "object" ? parsed : {};

  const out: PronunciationJSON = {
    type: "pronunciation_feedback",
    tier_depth: normalizeTierDepth(obj.tier_depth, tierDepth),
    sentence: scrubText(obj.sentence ?? "") || "",
    ipa: obj.ipa === null || obj.ipa === undefined ? null : scrubText(obj.ipa),
    stress_pattern:
      obj.stress_pattern === null || obj.stress_pattern === undefined ? null : scrubText(obj.stress_pattern),
    intonation: obj.intonation === null || obj.intonation === undefined ? null : scrubText(obj.intonation),

    key_corrections: Array.isArray(obj.key_corrections)
      ? obj.key_corrections
          .map((x: any) => ({ issue: scrubText(x?.issue ?? "") || "", fix: scrubText(x?.fix ?? "") || "" }))
          .filter((x: any) => x.issue || x.fix)
      : [],

    sound_breakdown: Array.isArray(obj.sound_breakdown)
      ? obj.sound_breakdown
          .map((x: any) => ({
            sound: scrubText(x?.sound ?? "") || "",
            word: scrubText(x?.word ?? "") || "",
            description: scrubText(x?.description ?? "") || "",
          }))
          .filter((x: any) => x.sound || x.word || x.description)
      : [],

    mouth_guidance: Array.isArray(obj.mouth_guidance)
      ? obj.mouth_guidance
          .map((x: any) => ({ sound: scrubText(x?.sound ?? "") || "", tip: scrubText(x?.tip ?? "") || "" }))
          .filter((x: any) => x.sound || x.tip)
      : [],

    common_accent_notes: Array.isArray(obj.common_accent_notes)
      ? obj.common_accent_notes.map((x: any) => scrubText(x ?? "") || "").filter(Boolean)
      : [],

    minimal_pairs: Array.isArray(obj.minimal_pairs)
      ? obj.minimal_pairs
          .map((x: any) => ({ word1: scrubText(x?.word1 ?? "") || "", word2: scrubText(x?.word2 ?? "") || "" }))
          .filter((x: any) => x.word1 || x.word2)
      : [],

    drills: Array.isArray(obj.drills) ? obj.drills.map((x: any) => scrubText(x ?? "") || "").filter(Boolean) : [],
    next_action: scrubText(obj.next_action ?? "") || "",
  };

  // Guarantee arrays
  out.key_corrections ||= [];
  out.sound_breakdown ||= [];
  out.mouth_guidance ||= [];
  out.common_accent_notes ||= [];
  out.minimal_pairs ||= [];
  out.drills ||= [];

  return out;
}

/* =========================================================
   WEAKNESS EXTRACTION + SAFE UPSERT (INCREMENT)
========================================================= */

type Weakness = {
  category: string; // e.g., "pronunciation"
  pattern: string; // e.g., "/ð/" or "stress_flat"
  weight: number; // increment amount
};

function extractWeaknesses(p: PronunciationJSON): Weakness[] {
  const bag: Weakness[] = [];

  for (const c of p.key_corrections || []) {
    const issue = String(c?.issue || "").toLowerCase();

    // Tune these rules as you learn common issues
    if (issue.includes("/ð/") || issue.includes("th sound") || issue.includes("voiced th")) {
      bag.push({ category: "pronunciation", pattern: "/ð/", weight: 1 });
    }
    if (issue.includes("/θ/") || issue.includes("unvoiced th")) {
      bag.push({ category: "pronunciation", pattern: "/θ/", weight: 1 });
    }
    if (issue.includes("stress")) {
      bag.push({ category: "pronunciation", pattern: "stress_flat", weight: 1 });
    }
    if (issue.includes("intonation")) {
      bag.push({ category: "pronunciation", pattern: "intonation", weight: 1 });
    }
    if (issue.includes("final consonant") || issue.includes("ending sound")) {
      bag.push({ category: "pronunciation", pattern: "final_consonant", weight: 1 });
    }
    if (issue.includes("linking") || issue.includes("connected speech")) {
      bag.push({ category: "pronunciation", pattern: "linking", weight: 1 });
    }
  }

  // Deduplicate by category+pattern (sum weights)
  const map = new Map<string, Weakness>();
  for (const w of bag) {
    const k = `${w.category}|||${w.pattern}`;
    const prev = map.get(k);
    if (!prev) map.set(k, w);
    else map.set(k, { ...prev, weight: prev.weight + w.weight });
  }

  return Array.from(map.values());
}

async function upsertWeaknessIncrement(userId: string | null | undefined, weaknesses: Weakness[]) {
  if (!userId) return;
  if (!Array.isArray(weaknesses) || weaknesses.length === 0) return;

  const now = new Date().toISOString();

  for (const w of weaknesses) {
    const category = String(w.category || "").trim();
    const key_pattern = String(w.pattern || "").trim();
    const inc = Number(w.weight || 1);

    if (!category || !key_pattern || !Number.isFinite(inc) || inc <= 0) continue;

    try {
      const { data: existing } = await supabase
        .from("mb_user_weakness_profile")
        .select("user_id, category, key_pattern, frequency")
        .eq("user_id", userId)
        .eq("category", category)
        .eq("key_pattern", key_pattern)
        .maybeSingle();

      if (!existing) {
        await supabase.from("mb_user_weakness_profile").insert({
          user_id: userId,
          category,
          key_pattern,
          frequency: inc,
          last_seen: now,
        });
        continue;
      }

      const current = Number((existing as any)?.frequency ?? 0);
      const next = (Number.isFinite(current) ? current : 0) + inc;

      await supabase
        .from("mb_user_weakness_profile")
        .update({ frequency: next, last_seen: now })
        .eq("user_id", userId)
        .eq("category", category)
        .eq("key_pattern", key_pattern);
    } catch {
      // ignore
    }
  }
}

/* =========================================================
   USAGE LOGGING (TOKENS / VIP)
========================================================= */

async function logUsage(params: { userId?: string | null; vipRank?: number | null; usage: any }) {
  const userId = params.userId ?? null;
  if (!userId) return;

  const u = safeUsage(params.usage);

  const payload: any = {
    user_id: userId,
    vip_rank: Number(params.vipRank ?? 0),
    prompt_tokens: u.prompt_tokens,
    completion_tokens: u.completion_tokens,
    total_tokens: u.total_tokens,
  };

  try {
    await supabase.from("mb_ai_usage_logs").insert(payload);
  } catch {
    // ignore
  }
}

/* =========================================================
   PRONUNCIATION ATTEMPT ANALYTICS (best-effort)
========================================================= */

async function logPronunciationAttempt(params: {
  userId?: string | null;
  roomId?: string | null;
  sentence: string;
  correctionsCount: number;
  overallScore?: number | null;
  notes?: string | null;
}) {
  const userId = params.userId ?? null;
  if (!userId) return;

  const payload: any = {
    user_id: userId,
    room_id: params.roomId ?? null,
    sentence: params.sentence,
    corrections_count: params.correctionsCount,
    overall_score: params.overallScore ?? null,
    notes: params.notes ?? null,
  };

  try {
    await supabase.from("mb_pronunciation_attempts").insert(payload);
  } catch {
    // ignore
  }
}

/* =========================================================
   OPTIONAL WHISPER TRANSCRIPTION (pronunciation)
========================================================= */

async function transcribeAudio(audioBuffer: Buffer) {
  const file = await toFile(audioBuffer, "speech.webm");
  const transcript = await client.audio.transcriptions.create({
    file,
    model: "whisper-1",
  });
  return String((transcript as any)?.text ?? "").trim();
}

/* =========================================================
   SHARED MODEL CALLER
========================================================= */

async function callChatModel(params: {
  systemPrompt: string;
  conversationHistory: any[];
  planningInstruction: string;
  model: string;
  temperature: number;
  forceJsonObject: boolean;
}) {
  const { systemPrompt, conversationHistory, planningInstruction, model, temperature, forceJsonObject } = params;

  const messages: any[] = [
    { role: "system", content: systemPrompt },
    ...(Array.isArray(conversationHistory) ? conversationHistory : []),
    { role: "system", content: planningInstruction },
  ];

  if (forceJsonObject) {
    messages.push({
      role: "system",
      content: "STRICT OUTPUT: Return ONLY a single JSON object. No markdown. No commentary. No code fences.",
    });
  }

  const completion = await client.chat.completions.create({
    model,
    temperature,
    messages,
    ...(forceJsonObject ? { response_format: { type: "json_object" } as any } : {}),
  });

  return {
    content: completion.choices?.[0]?.message?.content ?? "",
    usage: completion.usage ?? null,
    model,
  };
}

/* =========================================================
   PRONUNCIATION PIPELINE
========================================================= */

async function attemptPronunciationJson(params: {
  systemPrompt: string;
  conversationHistory: any[];
  planningInstruction: string;
  tierDepth: TierDepth;
  model: string;
  temperature: number;
}) {
  const res = await callChatModel({
    systemPrompt: params.systemPrompt,
    conversationHistory: params.conversationHistory,
    planningInstruction: params.planningInstruction,
    model: params.model,
    temperature: params.temperature,
    forceJsonObject: true,
  });

  const parsed = safeJsonParse(res.content);
  if (!parsed) {
    return { ok: false as const, normalized: null as any, raw: res.content, usage: res.usage, model: res.model };
  }

  const normalized = normalizePronunciationJson(parsed, params.tierDepth);
  return { ok: true as const, normalized, raw: res.content, usage: res.usage, model: res.model };
}

/**
 * Third-pass self-heal:
 * Take the invalid raw outputs and force-convert into the required JSON schema.
 * This is DIFFERENT from "retry the original task"; it's a "repair tool" pass.
 */
async function selfHealPronunciationJson(params: {
  tierDepth: TierDepth;
  model: string;
  rawOutputs: { firstRaw: string; secondRaw: string };
}) {
  const repairSystem = `
You are a strict JSON repair tool.
Your job: output ONE valid JSON object that matches the required schema exactly.
No markdown. No commentary. No extra keys.
If information is missing, use empty strings, nulls, or empty arrays to satisfy the schema.
`.trim();

  const repairInstruction = `
You will be given two invalid/failed outputs.
Extract anything useful and produce a single valid JSON object following the schema.

SCHEMA:
${PRONUNCIATION_JSON_CONTRACT}

INVALID_OUTPUT_1:
${stripMarkdownCodeFences(params.rawOutputs.firstRaw).slice(0, 6000)}

INVALID_OUTPUT_2:
${stripMarkdownCodeFences(params.rawOutputs.secondRaw).slice(0, 6000)}
`.trim();

  const completion = await client.chat.completions.create({
    model: params.model,
    temperature: 0,
    messages: [
      { role: "system", content: repairSystem },
      { role: "system", content: repairInstruction },
    ],
    response_format: { type: "json_object" } as any,
  });

  const content = completion.choices?.[0]?.message?.content ?? "";
  const usage = completion.usage ?? null;

  const parsed = safeJsonParse(content);
  if (!parsed) {
    return { ok: false as const, normalized: null as any, raw: content, usage, model: params.model };
  }

  const normalized = normalizePronunciationJson(parsed, params.tierDepth);
  return { ok: true as const, normalized, raw: content, usage, model: params.model };
}

async function persistPronunciationSideEffects(params: {
  userId?: string | null;
  roomId?: string | null;
  normalized: PronunciationJSON;
  attemptNotes?: string | null;
}) {
  const { userId, roomId, normalized, attemptNotes } = params;

  const weaknesses = extractWeaknesses(normalized);
  await upsertWeaknessIncrement(userId, weaknesses);

  await logPronunciationAttempt({
    userId,
    roomId,
    sentence: normalized.sentence,
    correctionsCount: normalized.key_corrections.length,
    notes: attemptNotes ?? null,
  });
}

/* =========================================================
   MAIN RENDER FUNCTION
========================================================= */

export async function renderResponse({
  systemPrompt,
  conversationHistory,
  plan,
  userId,
  vipRank,
  roomId,
  requestId,
  audioBuffer,
}: {
  systemPrompt: string;
  conversationHistory: any[];
  plan: any;
  userId?: string;
  vipRank?: number;
  roomId?: string | null;
  requestId?: string | null;
  audioBuffer?: Buffer | null;
}) {
  const isPronunciation = plan?.type === "pronunciation";
  const mode: RenderMode = isPronunciation ? "pronunciation" : "default";
  const tierDepth: TierDepth = normalizeTierDepth(plan?.tierPolicy?.depth, "short");
  const model = "gpt-4o-mini";

  // Clone history defensively (we may append transcription)
  let history = Array.isArray(conversationHistory) ? [...conversationHistory] : [];

  // Smarter intent match: use BOTH last user message + room skill focus (passed via plan.context)
  const lastUserMsg = getLastUserMessage(history);
  const roomSkillFocus = (plan?.context?.room_skill_focus ?? null) as string | null;

  const wantsPronunciationCombined = detectPronunciationIntentCombined({
    userText: lastUserMsg,
    roomSkillFocus,
  });

  // Plan says pronunciation => match if user OR room focus indicates pronunciation, OR audio is provided
  const intentMatch = isPronunciation ? wantsPronunciationCombined || Boolean(audioBuffer) : !wantsPronunciationCombined;

  // For confidence decay: get streak BEFORE this response outcome
  const priorFailureStreak = await getPronunciationFailureStreak(userId ?? null);

  // Optional: if pronunciation + audioBuffer provided, transcribe and inject
  if (isPronunciation && audioBuffer) {
    try {
      const transcript = await transcribeAudio(audioBuffer);
      if (transcript) {
        history.push({
          role: "system",
          content: `TRANSCRIPTION (user speech): "${transcript}"`,
        });
      }
    } catch (e) {
      // do not fail request
      console.error("Whisper transcription failed:", e);
    }
  }

  // Build planning instruction
  const planningInstruction = isPronunciation
    ? `
Teaching Plan:
${JSON.stringify(plan, null, 2)}

${PRONUNCIATION_JSON_CONTRACT}

Also:
- Respect tier_depth = "${tierDepth}".
- If tier_depth="short": keep key_corrections <= 2, drills <= 2, minimal_pairs <= 1, mouth_guidance <= 1.
- If tier_depth="medium": keep key_corrections <= 4, drills <= 4, minimal_pairs <= 2, mouth_guidance <= 3.
- If tier_depth="high": you may fully populate all fields (still stay concise and teacher-like).
`
    : `
Follow this teaching plan:
${JSON.stringify(plan, null, 2)}
`;

  /* ===============================
     PRONUNCIATION MODE (STRICT JSON)
  =============================== */
  if (isPronunciation) {
    // Attempt #1
    const first = await attemptPronunciationJson({
      systemPrompt,
      conversationHistory: history,
      planningInstruction,
      tierDepth,
      model,
      temperature: 0.2,
    });

    // Always log usage for attempt #1
    await logUsage({ userId: userId ?? null, vipRank: vipRank ?? null, usage: first.usage });

    if (first.ok) {
      await persistPronunciationSideEffects({
        userId: userId ?? null,
        roomId: roomId ?? null,
        normalized: first.normalized,
      });

      const hasNext = computeHasNextActionPronunciation(first.normalized);
      const askBack = computeAskBackPresentPronunciation(first.normalized);
      const { score, confidence } = computeQualityScore({
        intentMatch,
        jsonValid: true,
        hasNextAction: hasNext,
        askBackPresent: askBack,
        failureStreak: priorFailureStreak,
        stage: "first_pass",
      });

      await logQualityEvent({
        requestId,
        userId: userId ?? null,
        roomId: roomId ?? null,
        vipRank: vipRank ?? null,
        mode,
        model: first.model,
        intentMatch,
        jsonValid: true,
        hasNextAction: hasNext,
        askBackPresent: askBack,
        errorCode: null,
        notes: `stage=first_pass;quality_score=${score};confidence=${confidence.toFixed(
          2,
        )};prior_failure_streak=${priorFailureStreak};room_skill_focus=${String(roomSkillFocus ?? "")}`,
        usage: first.usage,
      });

      return first.normalized;
    }

    // Attempt #2: retry with explicit repair instruction
    const repairInstruction = `
Your previous output was invalid JSON.
Return ONLY a valid JSON object matching the required structure exactly.

INVALID_OUTPUT:
${stripMarkdownCodeFences(first.raw).slice(0, 6000)}
`;

    const second = await attemptPronunciationJson({
      systemPrompt,
      conversationHistory: history,
      planningInstruction: `${planningInstruction}\n\n${repairInstruction}`,
      tierDepth,
      model,
      temperature: 0.1,
    });

    await logUsage({ userId: userId ?? null, vipRank: vipRank ?? null, usage: second.usage });

    if (second.ok) {
      await persistPronunciationSideEffects({
        userId: userId ?? null,
        roomId: roomId ?? null,
        normalized: second.normalized,
        attemptNotes: "repair_retry",
      });

      const hasNext = computeHasNextActionPronunciation(second.normalized);
      const askBack = computeAskBackPresentPronunciation(second.normalized);
      const { score, confidence } = computeQualityScore({
        intentMatch,
        jsonValid: true,
        hasNextAction: hasNext,
        askBackPresent: askBack,
        failureStreak: priorFailureStreak,
        stage: "repair_pass",
      });

      await logQualityEvent({
        requestId,
        userId: userId ?? null,
        roomId: roomId ?? null,
        vipRank: vipRank ?? null,
        mode,
        model: second.model,
        intentMatch,
        jsonValid: true,
        hasNextAction: hasNext,
        askBackPresent: askBack,
        errorCode: null,
        notes: `stage=repair_pass;quality_score=${score};confidence=${confidence.toFixed(
          2,
        )};prior_failure_streak=${priorFailureStreak};note=repair_retry;room_skill_focus=${String(roomSkillFocus ?? "")}`,
        usage: second.usage,
      });

      return second.normalized;
    }

    /* =====================================================
       Self-healing Attempt #3 (repair-from-raw)
    ===================================================== */

    const third = await selfHealPronunciationJson({
      tierDepth,
      model,
      rawOutputs: { firstRaw: first.raw, secondRaw: second.raw },
    });

    await logUsage({ userId: userId ?? null, vipRank: vipRank ?? null, usage: third.usage });

    if (third.ok) {
      await persistPronunciationSideEffects({
        userId: userId ?? null,
        roomId: roomId ?? null,
        normalized: third.normalized,
        attemptNotes: "self_heal_from_raw",
      });

      const hasNext = computeHasNextActionPronunciation(third.normalized);
      const askBack = computeAskBackPresentPronunciation(third.normalized);
      const { score, confidence } = computeQualityScore({
        intentMatch,
        jsonValid: true,
        hasNextAction: hasNext,
        askBackPresent: askBack,
        failureStreak: priorFailureStreak,
        stage: "self_heal_pass",
      });

      await logQualityEvent({
        requestId,
        userId: userId ?? null,
        roomId: roomId ?? null,
        vipRank: vipRank ?? null,
        mode,
        model: third.model,
        intentMatch,
        jsonValid: true,
        hasNextAction: hasNext,
        askBackPresent: askBack,
        errorCode: null,
        notes: `stage=self_heal_pass;quality_score=${score};confidence=${confidence.toFixed(
          2,
        )};prior_failure_streak=${priorFailureStreak};note=self_heal_from_raw;room_skill_focus=${String(
          roomSkillFocus ?? "",
        )}`,
        usage: third.usage,
      });

      return third.normalized;
    }

    /* =====================================================
       Final fallback (never leak markdown / never crash)
    ===================================================== */

    const fallback = normalizePronunciationJson(
      {
        type: "pronunciation_feedback",
        tier_depth: tierDepth,
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
        next_action: "Internal formatting issue. Please try again (or paste the exact sentence you want to practice).",
      },
      tierDepth,
    );

    await logPronunciationAttempt({
      userId: userId ?? null,
      roomId: roomId ?? null,
      sentence: "",
      correctionsCount: 0,
      notes: "fallback",
    });

    const hasNext = computeHasNextActionPronunciation(fallback);
    const askBack = computeAskBackPresentPronunciation(fallback);
    const { score, confidence } = computeQualityScore({
      intentMatch,
      jsonValid: false,
      hasNextAction: hasNext,
      askBackPresent: askBack,
      failureStreak: priorFailureStreak,
      stage: "fallback",
    });

    await logQualityEvent({
      requestId,
      userId: userId ?? null,
      roomId: roomId ?? null,
      vipRank: vipRank ?? null,
      mode,
      model,
      intentMatch,
      jsonValid: false,
      hasNextAction: hasNext,
      askBackPresent: askBack,
      errorCode: "JSON_FAILED_TWICE_AND_SELF_HEAL_FAILED",
      notes: `stage=fallback;quality_score=${score};confidence=${confidence.toFixed(
        2,
      )};prior_failure_streak=${priorFailureStreak};room_skill_focus=${String(roomSkillFocus ?? "")};first_preview=${stripMarkdownCodeFences(
        first.raw,
      ).slice(0, 180)};second_preview=${stripMarkdownCodeFences(second.raw).slice(
        0,
        180,
      )};third_preview=${stripMarkdownCodeFences(third.raw).slice(0, 180)}`,
      usage: null,
    });

    return fallback;
  }

  /* ===============================
     NORMAL RESPONSE (TEXT)
  =============================== */

  const normal = await callChatModel({
    systemPrompt,
    conversationHistory: history,
    planningInstruction,
    model,
    temperature: 0.5,
    forceJsonObject: false,
  });

  await logUsage({
    userId: userId ?? null,
    vipRank: vipRank ?? null,
    usage: normal.usage,
  });

  const content = String(normal.content ?? "");
  const askBack = computeAskBackPresentDefault(content);
  const hasNextAction = computeHasNextActionDefault(content);

  const { score, confidence } = computeQualityScore({
    intentMatch,
    jsonValid: true,
    hasNextAction,
    askBackPresent: askBack,
    failureStreak: 0,
    stage: "default_pass",
  });

  await logQualityEvent({
    requestId,
    userId: userId ?? null,
    roomId: roomId ?? null,
    vipRank: vipRank ?? null,
    mode,
    model: normal.model,
    intentMatch,
    jsonValid: true,
    hasNextAction,
    askBackPresent: askBack,
    errorCode: null,
    notes: `stage=default;quality_score=${score};confidence=${confidence.toFixed(
      2,
    )};content_len=${content.length};room_skill_focus=${String(roomSkillFocus ?? "")}`,
    usage: normal.usage,
  });

  return content;
}