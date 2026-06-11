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
};

function fallbackProcessEnv(): SpeakEnv {
  const globalWithProcess = globalThis as typeof globalThis & {
    process?: { env?: SpeakEnv };
  };
  return globalWithProcess.process?.env ?? {};
}

export async function buildDeepSeekSpeakFollowUp(input: {
  transcript: string;
  learnerLevel: string;
  currentTopic: string;
  recentTurns: Array<{ role: "learner" | "assistant"; text: string }>;
  env?: SpeakEnv;
}): Promise<{ question: string; provider: "deepseek"; model: string } | SpeakFollowUpError | null> {
  const env = input.env ?? fallbackProcessEnv();
  const apiKey = env.DEEPSEEK_API_KEY;
  // Missing key = infrastructure not configured, not an unclear-input case.
  if (!apiKey) return SPEAK_FOLLOWUP_ERROR;

  const model = env.DEEPSEEK_SPEAK_MODEL || "deepseek-chat";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  const system = [
    "You are Mercy, an English speaking tutor for Vietnamese learners.",
    "Reply with exactly one short follow-up question.",
    "Use simple beginner English.",
    "If the learner sentence is unclear, broken, or likely STT garbage, ask them to repeat.",
    "Do not invent objects.",
    "Do not ask about weak extracted words like general, guys, thing, stuff, some, this, that.",
    "Do not pretend to understand.",
  ].join(" ");
  const recentContext = input.recentTurns
    .slice(-6)
    .map((turn) => `${turn.role}: ${turn.text}`)
    .join("\n");
  const user = [
    `Learner level: ${input.learnerLevel || "beginner"}`,
    `Current topic: ${input.currentTopic || "unknown"}`,
    recentContext ? `Recent Speak context:\n${recentContext}` : "Recent Speak context: none",
    `Learner transcript: ${input.transcript}`,
    "Return only the one question. No labels. No explanation.",
  ].join("\n\n");

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
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.2,
        max_tokens: 80,
        stream: false,
      }),
      signal: controller.signal,
    });

    // Provider returned an error status — infrastructure failure, not unclear input.
    if (!response.ok) return SPEAK_FOLLOWUP_ERROR;
    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const question = normalizeSpeakQuestion(data?.choices?.[0]?.message?.content);
    // API worked but produced no usable question — genuine unclear-input case.
    if (!question) return null;
    return { question, provider: "deepseek", model };
  } catch {
    // Network failure / timeout — infrastructure failure.
    return SPEAK_FOLLOWUP_ERROR;
  } finally {
    clearTimeout(timeout);
  }
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
