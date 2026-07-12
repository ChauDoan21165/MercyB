export const SPEAK_REPEAT_CLARIFICATION =
  "Mercy chưa nghe rõ. Bạn nói lại câu đó nhé. I didn't catch that clearly. Can you say it again?";

const SPEAK_WEAK_TARGET_PATTERN =
  /\b(?:the\s+)?(?:general|guys?|things?|stuff|reasons?|ideas?|parts?|ways?|cases?|points?|contexts?|some|this|that)\b/i;

export function norm(s: unknown): string {
  return typeof s === "string" ? s.trim() : "";
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export function normalizeSpeakQuestion(value: unknown): string {
  const raw = norm(value)
    .replace(/^["'""]+|["'""]+$/g, "")
    .replace(/^(?:en|answer|question)\s*:\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!raw) return "";
  const firstLine = raw.split(/\r?\n/).map((line) => line.trim()).find(Boolean) ?? "";
  const firstQuestion = firstLine.match(/[^?]+\?/u)?.[0]?.trim() ?? firstLine;
  if (!firstQuestion.endsWith("?")) return "";
  if (firstQuestion.length > 180) return "";
  if (/\bwhy did you choose the\b/i.test(firstQuestion)) return "";
  if (SPEAK_WEAK_TARGET_PATTERN.test(firstQuestion) && /\b(?:choose|about|with|for|like)\b/i.test(firstQuestion)) {
    return "";
  }
  return firstQuestion;
}

export type SpeakFollowUpError = { ok: false; retryable: true; reason: "speak_followup_unavailable" };

const SPEAK_FOLLOWUP_ERROR: SpeakFollowUpError = { ok: false, retryable: true, reason: "speak_followup_unavailable" };

type SpeakEnv = {
  DEEPSEEK_API_KEY?: string;
  DEEPSEEK_SPEAK_MODEL?: string;
  GEMINI_API_KEY?: string;
  GEMINI_SPEAK_MODEL?: string;
};

function fallbackProcessEnv(): SpeakEnv {
  const globalWithProcess = globalThis as typeof globalThis & {
    process?: { env?: SpeakEnv };
  };
  return globalWithProcess.process?.env ?? {};
}

// ── Provider call helpers ─────────────────────────────────────────────────

type SpeakOutcome =
  | { kind: "ok"; raw: string; usage?: SpeakProviderUsage }
  | { kind: "fail" };

export type SpeakProviderUsage = {
  inputTokens: number;
  outputTokens: number;
  cacheHitInputTokens?: number;
  cacheMissInputTokens?: number;
};

function normalizeUsageToken(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.round(value)
    : 0;
}

function normalizeDeepSeekUsage(value: unknown): SpeakProviderUsage | undefined {
  if (!isRecord(value)) return undefined;
  const usage = value as {
    prompt_tokens?: unknown;
    completion_tokens?: unknown;
    prompt_cache_hit_tokens?: unknown;
    prompt_cache_miss_tokens?: unknown;
  };
  const inputTokens = normalizeUsageToken(usage.prompt_tokens);
  const outputTokens = normalizeUsageToken(usage.completion_tokens);
  if (inputTokens === 0 && outputTokens === 0) return undefined;
  return {
    inputTokens,
    outputTokens,
    cacheHitInputTokens: normalizeUsageToken(usage.prompt_cache_hit_tokens),
    cacheMissInputTokens: normalizeUsageToken(usage.prompt_cache_miss_tokens),
  };
}

async function callDeepSeekForSpeak(
  systemPrompt: string,
  userMsg: string,
  apiKey: string,
  model: string,
  signal: AbortSignal,
): Promise<SpeakOutcome> {
  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMsg },
        ],
        temperature: 0.2,
        max_tokens: 80,
        stream: false,
      }),
      signal,
    });
    if (!response.ok) return { kind: "fail" };
    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: unknown;
    };
    const raw = data?.choices?.[0]?.message?.content ?? "";
    if (!raw) return { kind: "fail" };
    return { kind: "ok", raw, usage: normalizeDeepSeekUsage(data.usage) };
  } catch {
    return { kind: "fail" };
  }
}

async function callGeminiForSpeak(
  systemPrompt: string,
  userMsg: string,
  apiKey: string,
  model: string,
  signal: AbortSignal,
): Promise<SpeakOutcome> {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent` +
    `?key=${encodeURIComponent(apiKey)}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: userMsg }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { temperature: 0.2, maxOutputTokens: 80 },
      }),
      signal,
    });
    if (!response.ok) return { kind: "fail" };
    const data = (await response.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };
    const parts = data?.candidates?.[0]?.content?.parts;
    const raw = Array.isArray(parts) ? parts.map((p) => p?.text ?? "").join("") : "";
    if (!raw) return { kind: "fail" };
    return { kind: "ok", raw };
  } catch {
    return { kind: "fail" };
  }
}

// ── Public API ────────────────────────────────────────────────────────────

export async function buildDeepSeekSpeakFollowUp(input: {
  transcript: string;
  learnerLevel: string;
  currentTopic: string;
  recentTurns: Array<{ role: "learner" | "assistant"; text: string }>;
  turnsOnTopic?: number;
  /**
   * Tokens the learner's transcript may have misheard (browser STT), flagged by
   * transcriptSanity FREE-ANSWER mode. The follow-up must not predicate on them
   * (abstain-over-guess; S18 standard). Optional/empty → no effect.
   */
  avoidTokens?: string[];
  env?: SpeakEnv;
}): Promise<{ question: string; provider: "deepseek" | "gemini"; model: string; usage?: SpeakProviderUsage } | SpeakFollowUpError | null> {
  const env = input.env ?? fallbackProcessEnv();
  const round = Math.max(0, input.turnsOnTopic ?? 0);

  const avoidTokens = (input.avoidTokens ?? [])
    .map((token) => (typeof token === "string" ? token.trim() : ""))
    .filter(Boolean);

  const systemPrompt = [
    "You are Mercy, an English speaking tutor for Vietnamese learners.",
    "Reply with exactly one short follow-up question.",
    "Use simple beginner English.",
    round >= 1
      ? "The learner has already answered one or more follow-ups on this sentence. Reference the specific words they used in their last answer — ask about something they actually mentioned."
      : "This is the first follow-up. Ask about the most concrete object or action in their sentence.",
    "If the learner sentence is unclear, broken, or likely STT garbage, ask them to repeat.",
    "Do not invent objects.",
    "Do not ask about weak extracted words like general, guys, thing, stuff, some, this, that.",
    "Do not pretend to understand.",
    ...(avoidTokens.length > 0
      ? [
          `The learner's transcript may contain speech-to-text errors. Do NOT predicate a follow-up question on these possibly-misheard words: ${avoidTokens.join(", ")}.`,
        ]
      : []),
  ].join(" ");

  const recentContext = input.recentTurns
    .slice(-6)
    .map((turn) => `${turn.role}: ${turn.text}`)
    .join("\n");

  const userMsg = [
    `Learner level: ${input.learnerLevel || "beginner"}`,
    `Current topic: ${input.currentTopic || "unknown"}`,
    `Round: ${round + 1} of 4`,
    recentContext ? `Recent Speak context:\n${recentContext}` : "Recent Speak context: none",
    `Learner transcript: ${input.transcript}`,
    "Return only the one question. No labels. No explanation.",
  ].join("\n\n");

  // ── DeepSeek (primary) ──────────────────────────────────────────────────
  const deepseekKey = env.DEEPSEEK_API_KEY;
  if (deepseekKey) {
    const model = env.DEEPSEEK_SPEAK_MODEL || "deepseek-chat";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);
    let outcome: SpeakOutcome;
    try {
      outcome = await callDeepSeekForSpeak(systemPrompt, userMsg, deepseekKey, model, controller.signal);
    } finally {
      clearTimeout(timeout);
    }
    if (outcome.kind === "ok") {
      console.log("[deepseekSpeak] provider=deepseek model=" + model);
      const question = normalizeSpeakQuestion(outcome.raw);
      // AI returned content but it didn't parse as a valid question — genuine unclear input.
      if (!question) return null;
      return { question, provider: "deepseek", model, usage: outcome.usage };
    }
    console.warn("[deepseekSpeak] deepseek failed — falling over to gemini");
  }

  // ── Gemini (fallback) ───────────────────────────────────────────────────
  const geminiKey = env.GEMINI_API_KEY;
  if (geminiKey) {
    const model = env.GEMINI_SPEAK_MODEL || "gemini-2.5-flash";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);
    let outcome: SpeakOutcome;
    try {
      outcome = await callGeminiForSpeak(systemPrompt, userMsg, geminiKey, model, controller.signal);
    } finally {
      clearTimeout(timeout);
    }
    if (outcome.kind === "ok") {
      console.log("[deepseekSpeak] provider=gemini model=" + model);
      const question = normalizeSpeakQuestion(outcome.raw);
      if (!question) return null;
      return { question, provider: "gemini", model };
    }
    console.warn("[deepseekSpeak] gemini failed — no providers remaining");
  }

  // Neither key present or both failed — typed retryable error.
  return SPEAK_FOLLOWUP_ERROR;
}

export function toSpeakRecentTurns(value: unknown): Array<{ role: "learner" | "assistant"; text: string }> {
  return Array.isArray(value)
    ? value.slice(-6).map((turn): { role: "learner" | "assistant"; text: string } => {
        const entry = isRecord(turn) ? turn : {};
        return {
          role: entry.role === "assistant" ? "assistant" : "learner",
          text: norm(entry.text).slice(0, 240),
        };
      }).filter((turn: { text: string }) => turn.text)
    : [];
}
