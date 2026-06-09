export type AiConversationRole = "learner" | "assistant";

export type AiConversationHistoryTurn = {
  role: AiConversationRole;
  text: string;
  correction?: AiConversationCorrection | null;
};

export type AiConversationCorrection = {
  original: string;
  corrected: string;
  explanationVi: string;
  interferencePattern: string;
  confidence: "high";
};

export type AiConversationRequest = {
  scenarioId: string;
  learnerText: string;
  history: AiConversationHistoryTurn[];
  turnCount: number;
};

export type AiConversationResponse = {
  reply: string;
  correction: AiConversationCorrection | null;
  summary: {
    practiced: string[];
    errorsCaught: string[];
    progressNote: string;
  } | null;
  cost: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedUsd: number;
  };
  provider: "openai";
  model: string;
  correctionGateModel: string;
};

type Scenario = {
  id: "job-interview";
  title: string;
  themeContext: string;
  learnerRole: string;
  aiRole: string;
  topicBoundaries: string[];
  l1InterferenceNotes: Array<{
    id: string;
    pattern: string;
    watchFor: string;
    correctionHintVi: string;
  }>;
};

type DraftResponse = {
  reply?: string;
  correctionCandidate?: {
    original?: string;
    corrected?: string;
    explanationVi?: string;
    interferencePattern?: string;
    evidence?: string;
  } | null;
};

type GateResponse = {
  accept?: boolean;
  reason?: string;
};

const TURN_MODEL = "gpt-4o-mini";
const CORRECTION_GATE_MODEL = "gpt-4o";
const MAX_TURNS = 50;

const JOB_INTERVIEW_SCENARIO: Scenario = {
  id: "job-interview",
  title: "Job interview practice",
  themeContext:
    "A Vietnamese learner is practicing a realistic English job interview for an entry-level or mid-level office/service role.",
  learnerRole:
    "The learner is the candidate. They answer in English and may make Vietnamese-to-English transfer errors.",
  aiRole:
    "Mercy is the interviewer and coach. Mercy asks one interview question at a time, reacts to the learner's answer, and only corrects clear high-confidence language issues.",
  topicBoundaries: [
    "Stay inside job interview practice: background, strengths, teamwork, challenges, availability, and motivation.",
    "Do not drift into general life advice, therapy, pronunciation scoring, salary negotiation details, immigration, or unrelated small talk.",
    "For at least four learner turns, keep the scenario moving like a real interview.",
  ],
  l1InterferenceNotes: [
    {
      id: "vn-en-be-missing-role",
      pattern: "Vietnamese often omits 'be', so learners may say 'I confident' or 'I suitable'.",
      watchFor: "missing am/is/are before adjectives or role descriptions",
      correctionHintVi:
        "Tiếng Việt không cần 'to be', nhưng tiếng Anh cần 'am/is/are' trước tính từ hoặc vai trò.",
    },
    {
      id: "vn-en-have-experience",
      pattern: "Vietnamese 'có kinh nghiệm' can become 'I have experience about...' in English.",
      watchFor: "have experience about/in + a task where 'experience with' is more natural",
      correctionHintVi:
        "Mẫu tự nhiên là 'experience with + việc/kỹ năng' hoặc 'experience in + lĩnh vực'.",
    },
    {
      id: "vn-en-responsible-for",
      pattern: "Vietnamese word order can produce 'I responsible for' without 'am'.",
      watchFor: "responsible for without a form of be",
      correctionHintVi:
        "Trong tiếng Anh, nói 'I am responsible for...', không nói 'I responsible for...'.",
    },
  ],
};

export function normalizeAiConversationHistory(value: unknown): AiConversationHistoryTurn[] {
  if (!Array.isArray(value)) return [];
  return value.slice(-12).map((turn) => {
    const record = isRecord(turn) ? turn : {};
    const role = record.role === "assistant" ? "assistant" : "learner";
    return {
      role,
      text: stringValue(record.text, 1200),
      correction: normalizeCorrection(record.correction),
    };
  }).filter((turn) => turn.text);
}

export function buildAiConversationSystemPrompt(scenario: Scenario = JOB_INTERVIEW_SCENARIO): string {
  return [
    "You are Mercy, a warm English conversation coach for Vietnamese learners.",
    "",
    `Scenario: ${scenario.title}`,
    `Theme context: ${scenario.themeContext}`,
    `Learner role: ${scenario.learnerRole}`,
    `AI role: ${scenario.aiRole}`,
    "",
    "Topic boundaries:",
    ...scenario.topicBoundaries.map((boundary) => `- ${boundary}`),
    "",
    "Vietnamese-to-English interference notes to watch for:",
    ...scenario.l1InterferenceNotes.map((note) =>
      `- ${note.id}: ${note.pattern} Watch for: ${note.watchFor}. Vietnamese explanation hint: ${note.correctionHintVi}`,
    ),
    "",
    "Warmth rules:",
    "- Encourage in a Vietnamese-calibrated, low-shame way.",
    "- Never sound clinical, condescending, or like a test grader.",
    "- Be identity-affirming: the learner is capable; the error is a normal transfer pattern.",
    "",
    "Correction rules:",
    "- Respond naturally first.",
    "- Correct only one clear, high-confidence issue from the learner's latest answer.",
    "- If correcting, explain in Vietnamese and mention the Vietnamese interference pattern.",
    "- If unsure, do not correct. Redirect into engaging practice with a specific next interview question.",
    "- Wrong correction is worse than no correction.",
    "",
    "Pivot rules:",
    "- The next AI turn must reference something the learner actually said.",
    "- No generic follow-up theater. Do not ask a question that could follow any answer.",
    "",
    "Return strict JSON only:",
    '{"reply":"natural English reply and next interview question","correctionCandidate":null}',
    "or",
    '{"reply":"natural English reply and next interview question","correctionCandidate":{"original":"learner phrase","corrected":"corrected phrase","explanationVi":"Vietnamese explanation","interferencePattern":"named Vietnamese interference pattern","evidence":"why this is clear"}}',
  ].join("\n");
}

export function buildAiConversationUserPrompt(input: AiConversationRequest): string {
  const history = input.history
    .slice(-8)
    .map((turn) => `${turn.role === "assistant" ? "Mercy" : "Learner"}: ${turn.text}`)
    .join("\n");
  return [
    `Learner turn count before this answer: ${input.turnCount}`,
    history ? `Recent conversation:\n${history}` : "Recent conversation: none",
    `Latest learner answer: ${input.learnerText}`,
    "",
    "Write the next Mercy turn for the job interview scenario.",
    "Reference the latest learner answer directly.",
    "Keep the reply 2-5 short sentences.",
  ].join("\n");
}

export function buildCorrectionGatePrompt(params: {
  learnerText: string;
  correction: NonNullable<DraftResponse["correctionCandidate"]>;
}): string {
  return [
    "You are the correction quality gate. Decide if this English correction is unquestionably safe.",
    "Accept only if the learner text clearly contains the proposed error and the correction is natural.",
    "Reject if the issue could be style, dialect, missing context, or if the correction overreaches.",
    "Return strict JSON only: {\"accept\":true,\"reason\":\"...\"} or {\"accept\":false,\"reason\":\"...\"}.",
    "",
    `Learner text: ${params.learnerText}`,
    `Original phrase: ${params.correction.original ?? ""}`,
    `Corrected phrase: ${params.correction.corrected ?? ""}`,
    `Vietnamese explanation: ${params.correction.explanationVi ?? ""}`,
    `Interference pattern: ${params.correction.interferencePattern ?? ""}`,
    `Evidence: ${params.correction.evidence ?? ""}`,
  ].join("\n");
}

export async function buildAiConversationTurn(input: AiConversationRequest): Promise<AiConversationResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");
  if (!input.learnerText.trim()) throw new Error("Missing learnerText");
  if (input.turnCount >= MAX_TURNS) throw new Error("Session turn cap reached");

  const scenario = JOB_INTERVIEW_SCENARIO;
  const system = buildAiConversationSystemPrompt(scenario);
  const user = buildAiConversationUserPrompt(input);
  const draftData = await callOpenAiJson<DraftResponse>({
    apiKey,
    model: TURN_MODEL,
    messages: [
      { role: "developer", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.35,
    maxTokens: 380,
  });

  const draft = draftData.value;
  let correction: AiConversationCorrection | null = null;
  const candidate = draft.correctionCandidate && isCorrectionCandidateComplete(draft.correctionCandidate)
    ? draft.correctionCandidate
    : null;

  let gateUsage = emptyUsage();
  if (candidate) {
    const gateData = await callOpenAiJson<GateResponse>({
      apiKey,
      model: CORRECTION_GATE_MODEL,
      messages: [
        { role: "developer", content: "You are a strict language-correction trust floor." },
        { role: "user", content: buildCorrectionGatePrompt({ learnerText: input.learnerText, correction: candidate }) },
      ],
      temperature: 0,
      maxTokens: 80,
    });
    gateUsage = gateData.usage;
    if (gateData.value.accept === true) {
      correction = {
        original: candidate.original.trim(),
        corrected: candidate.corrected.trim(),
        explanationVi: candidate.explanationVi.trim(),
        interferencePattern: candidate.interferencePattern.trim(),
        confidence: "high",
      };
    }
  }

  const reply = sanitizeReply(draft.reply) ||
    `I hear that you said "${input.learnerText.slice(0, 80)}." Let's keep it practical: what is one strength you would bring to this role?`;
  const historyWithNext: AiConversationHistoryTurn[] = [
    ...input.history,
    { role: "learner", text: input.learnerText },
    { role: "assistant", text: reply, correction },
  ];
  return {
    reply,
    correction,
    summary: input.turnCount + 1 >= 4 ? buildSummary(historyWithNext) : null,
    cost: estimateCost(addUsage(draftData.usage, gateUsage)),
    provider: "openai",
    model: TURN_MODEL,
    correctionGateModel: CORRECTION_GATE_MODEL,
  };
}

async function callOpenAiJson<T>(params: {
  apiKey: string;
  model: string;
  messages: Array<{ role: "developer" | "user"; content: string }>;
  temperature: number;
  maxTokens: number;
}): Promise<{ value: T; usage: Usage }> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.apiKey}`,
    },
    body: JSON.stringify({
      model: params.model,
      messages: params.messages,
      temperature: params.temperature,
      max_tokens: params.maxTokens,
      response_format: { type: "json_object" },
    }),
  });
  if (!response.ok) throw new Error(`OpenAI ${response.status}`);
  const data = await response.json() as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
  };
  const content = data.choices?.[0]?.message?.content || "{}";
  return {
    value: JSON.parse(content) as T,
    usage: {
      promptTokens: data.usage?.prompt_tokens ?? 0,
      completionTokens: data.usage?.completion_tokens ?? 0,
      totalTokens: data.usage?.total_tokens ?? 0,
    },
  };
}

type Usage = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

function emptyUsage(): Usage {
  return { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
}

function addUsage(a: Usage, b: Usage): Usage {
  return {
    promptTokens: a.promptTokens + b.promptTokens,
    completionTokens: a.completionTokens + b.completionTokens,
    totalTokens: a.totalTokens + b.totalTokens,
  };
}

function estimateCost(usage: Usage): AiConversationResponse["cost"] {
  const miniInput = usage.promptTokens * 0.00000015;
  const miniOutput = usage.completionTokens * 0.0000006;
  return {
    ...usage,
    estimatedUsd: Number((miniInput + miniOutput).toFixed(6)),
  };
}

function buildSummary(history: AiConversationHistoryTurn[]): AiConversationResponse["summary"] {
  const corrections = history
    .map((turn) => turn.correction)
    .filter((correction): correction is AiConversationCorrection => Boolean(correction));
  return {
    practiced: [
      "job interview answers",
      "answer-specific follow-up questions",
      "Vietnamese-to-English transfer awareness",
    ],
    errorsCaught: [...new Set(corrections.map((correction) => correction.interferencePattern))],
    progressNote:
      "You completed a coherent interview sequence and kept building from your own answers.",
  };
}

function isCorrectionCandidateComplete(
  candidate: NonNullable<DraftResponse["correctionCandidate"]>,
): candidate is Required<NonNullable<DraftResponse["correctionCandidate"]>> {
  return Boolean(
    candidate.original?.trim() &&
      candidate.corrected?.trim() &&
      candidate.explanationVi?.trim() &&
      candidate.interferencePattern?.trim() &&
      candidate.evidence?.trim(),
  );
}

function normalizeCorrection(value: unknown): AiConversationCorrection | null {
  if (!isRecord(value)) return null;
  const original = stringValue(value.original, 300);
  const corrected = stringValue(value.corrected, 300);
  const explanationVi = stringValue(value.explanationVi, 600);
  const interferencePattern = stringValue(value.interferencePattern, 300);
  if (!original || !corrected || !explanationVi || !interferencePattern) return null;
  return { original, corrected, explanationVi, interferencePattern, confidence: "high" };
}

function sanitizeReply(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, 1200) : "";
}

function stringValue(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
