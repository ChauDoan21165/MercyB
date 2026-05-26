// src/server/host/preResponseIntelligence.ts
/**
 * Pre-response Intelligence Loader (Production v2.1) — FIXED + EXTENDED
 * Runs BEFORE calling renderResponse()
 *
 * ✅ Returns { systemPrompt, plan, vip_rank } for renderer.ts usage logging/quota
 * ✅ Does NOT assume severity_score exists (uses if present, else safe)
 * ✅ Room loader tries multiple likely tables/fields (rooms / room_registry / mb_rooms)
 * ✅ All Supabase calls are best-effort (never throw the whole request)
 * ✅ Intent detection uses BOTH user message AND room skill_focus
 * ✅ Adds intent-match + ask-back + honesty rules via systemPromptBase
 * ✅ NEW: Emotional-state detection (message + stored frustration)
 * ✅ NEW: Passes room.skill_focus into plan.context for renderer intent_match
 */

export type VipRank = 1 | 2 | 3 | 4;
export type TierDepth = "short" | "medium" | "high";

export type RoomContext = {
  room_id: string;
  room_title: string;
  room_level: string | null;
  skill_focus: string | null;
  room_objective: string | null;
  current_step: string | null;
};

export type WeaknessRow = {
  category: string | null;
  key_pattern: string | null;
  frequency: number | null;
  last_seen: string | null;
  severity_score?: number | null; // optional
};

export type AttemptRow = {
  created_at: string;
  room_id: string | null;
  overall_score?: number | null;
  notes?: string | null;
};

export type EmotionLabel =
  | "calm"
  | "confident"
  | "curious"
  | "frustrated"
  | "anxious"
  | "confused"
  | "tired"
  | "motivated";

export type StudentContext = {
  user_id: string;
  vip_rank: VipRank;
  tier_depth_policy: { depth: TierDepth; max_items: number };
  top_weaknesses: Array<{
    category: string;
    key_pattern: string;
    frequency: number;
    last_seen: string | null;
    severity_score: number | null;
    priority_score: number;
  }>;
  recent_attempts_summary: AttemptRow[];
  preferred_feedback_style?: string | null;
  frustration_score?: number | null;
};

export type CoachingStyle = "gentle" | "direct" | "socratic";
export type EscalationLevel = 0 | 1 | 2 | 3;

export type Plan =
  | {
      type: "pronunciation";
      tierPolicy: StudentContext["tier_depth_policy"];
      escalation: { level: EscalationLevel; style: CoachingStyle; reason: string[] };
      target_sentence?: string | null;
      strict_output?: "json_only";
      context?: {
        room_skill_focus?: string | null;
        emotion?: { label: EmotionLabel; confidence: number; cues: string[] };
      };
    }
  | {
      type: "default";
      tierPolicy: StudentContext["tier_depth_policy"];
      escalation: { level: EscalationLevel; style: CoachingStyle; reason: string[] };
      context?: {
        room_skill_focus?: string | null;
        emotion?: { label: EmotionLabel; confidence: number; cues: string[] };
      };
    };

/* =========================================================
   Mercy System Prompt Base — v2
========================================================= */

export const systemPromptBase = `
You are MERCY, an elite English tutor and coach.
Teach like a great human teacher—warm, clear, specific, and adaptive.

CORE TEACHING LOOP:
Explain -> Example -> Micro-practice -> Quick check -> Next action.

INTENT MATCH (non-negotiable):
- First: identify what the user is asking right now.
- If the user asks for pronunciation correction, you MUST respond in pronunciation-coach mode (do not switch topics).
- If the user asks a question, answer it directly before adding extra teaching.

ASK-BACK (human-teacher behavior):
- Always end with ONE quick check or a tiny next step the student can do in 10–30 seconds.
- If the student’s request is ambiguous, ask ONE short clarifying question.

HONESTY RULES (trust builder):
- Never pretend you heard audio if none was provided.
- If you are uncertain, say so briefly and propose the best next step.
- If speech transcript confidence seems low, ask for a retry.

USE CONTEXT:
- Use ROOM_CONTEXT + STUDENT_CONTEXT to tailor examples, drills, and pacing.
- Respect COACHING_DIRECTIVES (tone, depth, escalation).
- Never shame the student; be firm and supportive.

WHEN PLAN IS PRONUNCIATION:
- Follow strict output constraints enforced by renderer (JSON-only, no markdown).
- Focus on the 1–3 highest-impact corrections (tier-dependent).
- Show evidence (what was heard vs expected) when available.
`.trim();

/* =========================================================
   Tier Policy
========================================================= */

function tierPolicyForVip(vip: VipRank) {
  if (vip === 1) return { depth: "short" as const, max_items: 2 };
  if (vip === 2) return { depth: "medium" as const, max_items: 4 };
  return { depth: "high" as const, max_items: 8 };
}

/* =========================================================
   Helpers
========================================================= */

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function hoursSince(iso: string | null | undefined) {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return null;
  const h = (Date.now() - t) / (1000 * 60 * 60);
  return h >= 0 ? h : null;
}

function weaknessPriorityScore(w: WeaknessRow): number {
  const freq = Number(w.frequency ?? 0);
  const sev = Number((w as any).severity_score ?? 0); // optional
  const h = hoursSince(w.last_seen ?? null);

  const freqScore = Math.log1p(Math.max(0, freq)) * 2;
  const sevScore = clamp(Number.isFinite(sev) ? sev : 0, 0, 10) * 3;
  const recencyScore = h === null ? 0 : h <= 24 ? 3 : h <= 72 ? 2 : h <= 168 ? 1 : 0;

  return sevScore + freqScore + recencyScore;
}

function decideCoachingStyle(opts: {
  preferred: string | null | undefined;
  frustrationScore: number;
  vip: VipRank;
}): CoachingStyle {
  const preferred = String(opts.preferred ?? "").toLowerCase();
  if (preferred.includes("socratic")) return "socratic";
  if (preferred.includes("direct")) return "direct";
  if (preferred.includes("gentle")) return "gentle";

  if (opts.frustrationScore >= 7) return "gentle";
  if (opts.vip >= 3) return "direct";
  return "socratic";
}

function computeEscalation(params: {
  frustrationScore: number;
  recentAttempts: AttemptRow[];
  topWeaknesses: Array<{ priority_score: number }>;
}): { level: EscalationLevel; reason: string[] } {
  const reasons: string[] = [];
  const f = clamp(params.frustrationScore, 0, 10);

  const scores = (params.recentAttempts || [])
    .map((a) => (typeof a.overall_score === "number" ? a.overall_score : null))
    .filter((x): x is number => x !== null);

  // if your overall_score is 0..100, normalize upstream or adjust thresholds
  const lowCount = scores.filter((s) => s <= 0.45).length;
  const veryLowCount = scores.filter((s) => s <= 0.25).length;

  const weaknessPeak = Math.max(0, ...(params.topWeaknesses || []).map((w) => w.priority_score));

  const pFrustration = f >= 8 ? 2 : f >= 6 ? 1 : 0;
  const pAttempts = veryLowCount >= 2 ? 2 : lowCount >= 2 ? 1 : 0;
  const pWeakness = weaknessPeak >= 20 ? 2 : weaknessPeak >= 12 ? 1 : 0;

  const points = pFrustration + pAttempts + pWeakness;

  if (pFrustration) reasons.push(`frustration=${f}`);
  if (pAttempts) reasons.push(`recent_low_attempts=${lowCount} very_low=${veryLowCount}`);
  if (pWeakness) reasons.push(`urgent_weakness_peak=${weaknessPeak.toFixed(1)}`);

  const level: EscalationLevel = points >= 5 ? 3 : points >= 3 ? 2 : points >= 1 ? 1 : 0;

  if (level === 0) reasons.push("stable");
  if (level === 1) reasons.push("add_structure");
  if (level === 2) reasons.push("intervention_microdrills");
  if (level === 3) reasons.push("rescue_reframe_confidence");

  return { level, reason: reasons };
}

/* =========================================================
   Intent detection (MODE LOCK)
========================================================= */

function detectPronunciationIntent(userMessage: string, room: RoomContext): boolean {
  const msg = String(userMessage || "");
  const byMessage =
    /pronoun|pronunciation|say it|how to pronounce|correct my accent|ipa|stress|intonation|mouth|tongue|sound|phonetic|repeat after me/i.test(
      msg,
    );
  const byRoom = String(room.skill_focus || "").toLowerCase().includes("pronunciation");
  return byMessage || byRoom;
}

/* =========================================================
   Emotional-state detection (lightweight + deterministic)
========================================================= */

function detectEmotion(userMessage: string, frustrationScore: number): { label: EmotionLabel; confidence: number; cues: string[] } {
  const msg = String(userMessage || "").toLowerCase();
  const cues: string[] = [];

  const hasFrustration =
    /\b(frustrated|annoyed|angry|mad|hate|stuck|can't|cannot|so hard|give up)\b/.test(msg) || frustrationScore >= 7;
  const hasAnxiety = /\b(nervous|anxious|worried|panic|scared|embarrassed)\b/.test(msg);
  const hasConfusion = /\b(confused|don't understand|dont understand|what does this mean|huh)\b/.test(msg);
  const hasTired = /\b(tired|sleepy|exhausted|burnt out)\b/.test(msg);
  const hasMotivation = /\b(motivated|let's go|lets go|i will|i'm ready|im ready)\b/.test(msg);
  const hasConfidence = /\b(confident|easy|got it|i can|improve fast)\b/.test(msg);
  const hasCurious = /\b(why|how come|curious|wonder)\b/.test(msg);

  if (hasFrustration) cues.push("frustration_terms_or_high_frustration_score");
  if (hasAnxiety) cues.push("anxiety_terms");
  if (hasConfusion) cues.push("confusion_terms");
  if (hasTired) cues.push("fatigue_terms");
  if (hasMotivation) cues.push("motivation_terms");
  if (hasConfidence) cues.push("confidence_terms");
  if (hasCurious) cues.push("curiosity_terms");

  // Priority ordering (you can tune)
  if (hasFrustration) return { label: "frustrated", confidence: 0.78, cues };
  if (hasAnxiety) return { label: "anxious", confidence: 0.7, cues };
  if (hasConfusion) return { label: "confused", confidence: 0.68, cues };
  if (hasTired) return { label: "tired", confidence: 0.65, cues };
  if (hasMotivation) return { label: "motivated", confidence: 0.62, cues };
  if (hasConfidence) return { label: "confident", confidence: 0.6, cues };
  if (hasCurious) return { label: "curious", confidence: 0.58, cues };

  return { label: "calm", confidence: 0.55, cues: cues.length ? cues : ["default_calm"] };
}

/* =========================================================
   Data loaders (best-effort)
========================================================= */

async function loadVipRank(supabase: any, user_id: string): Promise<VipRank> {
  try {
    const r1 = await supabase.from("profiles").select("vip_rank").eq("id", user_id).maybeSingle();
    const v1 = Number(r1?.data?.vip_rank);
    if ([1, 2, 3, 4].includes(v1)) return v1 as VipRank;
  } catch {}

  try {
    const r2 = await supabase.from("mb_user_profile").select("vip_rank").eq("user_id", user_id).maybeSingle();
    const v2 = Number(r2?.data?.vip_rank);
    if ([1, 2, 3, 4].includes(v2)) return v2 as VipRank;
  } catch {}

  return 1;
}

async function loadRoomContext(supabase: any, room_id: string): Promise<RoomContext> {
  try {
    const r = await supabase
      .from("rooms")
      .select("id, title, room_level, skill_focus, objective, current_step")
      .eq("id", room_id)
      .maybeSingle();

    if (r?.data) {
      const d = r.data;
      return {
        room_id,
        room_title: String(d.title ?? "Room"),
        room_level: d.room_level ?? null,
        skill_focus: d.skill_focus ?? null,
        room_objective: d.objective ?? null,
        current_step: d.current_step ?? null,
      };
    }
  } catch {}

  try {
    const r = await supabase
      .from("room_registry")
      .select("id, title, level, skill_focus, objective, current_step")
      .eq("id", room_id)
      .maybeSingle();

    if (r?.data) {
      const d = r.data;
      return {
        room_id,
        room_title: String(d.title ?? "Room"),
        room_level: d.level ?? null,
        skill_focus: d.skill_focus ?? null,
        room_objective: d.objective ?? null,
        current_step: d.current_step ?? null,
      };
    }
  } catch {}

  try {
    const r = await supabase
      .from("mb_rooms")
      .select("id, title, room_level, skill_focus, objective, current_step")
      .eq("id", room_id)
      .maybeSingle();

    if (r?.data) {
      const d = r.data;
      return {
        room_id,
        room_title: String(d.title ?? "Room"),
        room_level: d.room_level ?? null,
        skill_focus: d.skill_focus ?? null,
        room_objective: d.objective ?? null,
        current_step: d.current_step ?? null,
      };
    }
  } catch {}

  return {
    room_id,
    room_title: "Room",
    room_level: null,
    skill_focus: null,
    room_objective: null,
    current_step: null,
  };
}

/* =========================================================
   Main export
========================================================= */

export async function preResponseIntelligence({
  supabase,
  user_id,
  room_id,
  userMessage,
  request_id,
}: {
  supabase: any;
  user_id: string;
  room_id: string;
  userMessage: string;
  request_id?: string;
}) {
  const vip_rank: VipRank = await loadVipRank(supabase, user_id);
  const tierPolicy = tierPolicyForVip(vip_rank);

  const room: RoomContext = await loadRoomContext(supabase, room_id);

  // Weaknesses
  let weaknessesRaw: WeaknessRow[] = [];
  try {
    const wr = await supabase
      .from("mb_user_weakness_profile")
      .select("category, key_pattern, frequency, last_seen, severity_score")
      .eq("user_id", user_id)
      .limit(50);
    weaknessesRaw = (wr?.data ?? []) as WeaknessRow[];
  } catch {
    weaknessesRaw = [];
  }

  const top_weaknesses = (weaknessesRaw || [])
    .map((w) => {
      const frequency = Number(w.frequency ?? 0);
      const sevRaw = (w as any).severity_score;
      const sev = sevRaw === null || sevRaw === undefined ? null : Number(sevRaw);
      const priority_score = weaknessPriorityScore(w);

      return {
        category: String(w.category ?? "").trim(),
        key_pattern: String(w.key_pattern ?? "").trim(),
        frequency: Number.isFinite(frequency) ? frequency : 0,
        last_seen: w.last_seen ?? null,
        severity_score: sev !== null && Number.isFinite(sev) ? sev : null,
        priority_score,
      };
    })
    .filter((w) => w.category && w.key_pattern)
    .sort((a, b) => b.priority_score - a.priority_score)
    .slice(0, 3);

  // Recent attempts
  let recent_attempts: AttemptRow[] = [];
  try {
    const ar = await supabase
      .from("mb_pronunciation_attempts")
      .select("created_at, room_id, overall_score, notes")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(3);
    recent_attempts = (ar?.data ?? []) as AttemptRow[];
  } catch {
    recent_attempts = [];
  }

  // Personality memory (optional)
  let personality: any = null;
  try {
    const pr = await supabase
      .from("mb_user_personality_memory")
      .select("preferred_feedback_style, frustration_score")
      .eq("user_id", user_id)
      .maybeSingle();
    personality = pr?.data ?? null;
  } catch {
    personality = null;
  }

  const frustration_score = Number(personality?.frustration_score ?? 0);
  const safeFrustration = Number.isFinite(frustration_score) ? clamp(frustration_score, 0, 10) : 0;

  // MODE LOCK
  const isPronunciation = detectPronunciationIntent(userMessage, room);

  const escalation = computeEscalation({
    frustrationScore: safeFrustration,
    recentAttempts: recent_attempts,
    topWeaknesses: top_weaknesses.map((w) => ({ priority_score: w.priority_score })),
  });

  const style = decideCoachingStyle({
    preferred: personality?.preferred_feedback_style ?? null,
    frustrationScore: safeFrustration,
    vip: vip_rank,
  });

  const finalStyle: CoachingStyle = escalation.level >= 3 ? "gentle" : style;

  // Emotional state (for tone + pacing)
  const emotion = detectEmotion(userMessage, safeFrustration);

  const plan: Plan = isPronunciation
    ? {
        type: "pronunciation",
        tierPolicy,
        escalation: { level: escalation.level, style: finalStyle, reason: escalation.reason },
        target_sentence: null,
        strict_output: "json_only",
        context: {
          room_skill_focus: room.skill_focus ?? null,
          emotion,
        },
      }
    : {
        type: "default",
        tierPolicy,
        escalation: { level: escalation.level, style: finalStyle, reason: escalation.reason },
        context: {
          room_skill_focus: room.skill_focus ?? null,
          emotion,
        },
      };

  const studentContext: StudentContext = {
    user_id,
    vip_rank,
    tier_depth_policy: tierPolicy,
    top_weaknesses,
    recent_attempts_summary: recent_attempts,
    preferred_feedback_style: personality?.preferred_feedback_style ?? null,
    frustration_score: safeFrustration,
  };

  const roomContextBlock = {
    room_id: room.room_id,
    room_title: room.room_title,
    room_level: room.room_level,
    skill_focus: room.skill_focus,
    room_objective: room.room_objective,
    current_step: room.current_step,
    allowed_actions: ["repeat_mode", "quick_check", "mini_lesson"],
  };

  const studentContextBlock = {
    vip_rank: studentContext.vip_rank,
    tier_depth_policy: studentContext.tier_depth_policy,
    top_weaknesses: studentContext.top_weaknesses,
    recent_attempts_summary: studentContext.recent_attempts_summary,
    preferred_feedback_style: studentContext.preferred_feedback_style,
    frustration_score: studentContext.frustration_score,
    emotion,
  };

  const coachingDirectives = {
    request_id: request_id ?? null,
    coaching_style: finalStyle,
    escalation_level: escalation.level,
    escalation_reason: escalation.reason,
    tier_depth: tierPolicy.depth,
    emotional_state: emotion, // surfaced to MERCY
    depth_rules: {
      short: "1–2 key points + 1 quick check",
      medium: "Up to 4 key points + 1 example + quick check",
      high: "Deeper explanation + examples + micro-drills + quick check",
    },
    teacher_behaviors: [
      "Be warm + specific (name the error, show the fix).",
      "Prefer small steps and confirmation when escalation >= 2.",
      "Always end with a next action in 10–30 seconds.",
      "Always do ask-back: one quick check question or one repeat prompt.",
      "If emotional_state is frustrated/anxious: validate briefly + reduce cognitive load + do 1 tiny drill.",
    ],
  };

  const systemPrompt = [
    systemPromptBase,
    "",
    "ROOM_CONTEXT:",
    JSON.stringify(roomContextBlock, null, 2),
    "",
    "STUDENT_CONTEXT:",
    JSON.stringify(studentContextBlock, null, 2),
    "",
    "COACHING_DIRECTIVES:",
    JSON.stringify(coachingDirectives, null, 2),
  ].join("\n");

  return { systemPrompt, plan, vip_rank };
}