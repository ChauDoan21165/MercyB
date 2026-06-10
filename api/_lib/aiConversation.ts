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
  env?: AiConversationEnv;
  messages?: AiConversationMessage[];
  scenario?: AiConversationScenarioInput | null;
  grounding?: unknown;
  promptMetadata?: Record<string, unknown> | null;
};

export type AiConversationMessage = {
  role?: string;
  text?: string;
};

export type AiConversationEnv = {
  OPENAI_API_KEY?: string;
};

export type AiConversationScenarioInput = {
  id?: unknown;
  title?: unknown;
  themeContext?: unknown;
  learnerRole?: unknown;
  aiRole?: unknown;
  topicBoundaries?: unknown;
  l1InterferenceNotes?: unknown;
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
  id: string;
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
const LEARNER_LED_SCENARIO_ID = "learner-led";

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

const LEARNER_LED_SCENARIO: Scenario = {
  id: LEARNER_LED_SCENARIO_ID,
  title: "Learner-led conversation",
  themeContext:
    "No preset scenario was chosen. The learner's own words define the situation, topic, and next useful follow-up.",
  learnerRole:
    "The learner starts with their own English sentence. Their latest message is the conversation seed.",
  aiRole:
    "Mercy is the conversation partner and coach. Mercy follows the learner's actual words, asks one grounded follow-up, and only corrects clear high-confidence Vietnamese-to-English transfer issues.",
  topicBoundaries: [
    "Do not introduce a job interview, restaurant, travel, or any other preset scenario unless the learner explicitly chose it.",
    "Start from the learner's latest words and ask about a concrete detail they mentioned.",
    "If the learner is vague, ask one clarifying question instead of switching to a script.",
    "Keep the exchange useful for multi-turn English practice shaped by the learner's own topic.",
  ],
  l1InterferenceNotes: [
    {
      id: "learner-led-high-confidence-only",
      pattern: "Learner-led mode has no preset L1 pattern; corrections must come only from clear evidence in the learner's latest words.",
      watchFor: "high-confidence Vietnamese-to-English transfer only",
      correctionHintVi:
        "Chỉ sửa khi thấy lỗi chắc chắn trong chính câu của người học; nếu chưa chắc, hỏi tiếp để người học nói rõ hơn.",
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
  const scenario = normalizeScenario(input.scenario, input.scenarioId);
  const history = input.history
    .slice(-8)
    .map((turn) => `${turn.role === "assistant" ? "Mercy" : "Learner"}: ${turn.text}`)
    .join("\n");
  const developerGrounding = normalizeDeveloperGrounding(input.messages, input.grounding);
  const promptMetadata = input.promptMetadata ? JSON.stringify(input.promptMetadata).slice(0, 1000) : "";
  return [
    `Learner turn count before this answer: ${input.turnCount}`,
    history ? `Recent conversation:\n${history}` : "Recent conversation: none",
    developerGrounding ? `Client grounding:\n${developerGrounding}` : "",
    promptMetadata ? `Prompt metadata: ${promptMetadata}` : "",
    `Latest learner answer: ${input.learnerText}`,
    "",
    `Write the next Mercy turn for the ${scenario.title} scenario.`,
    "Reference the latest learner answer directly.",
    "Keep the reply 2-5 short sentences.",
  ].filter(Boolean).join("\n");
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
  const apiKey = input.env?.OPENAI_API_KEY ?? fallbackProcessEnv().OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");
  if (!input.learnerText.trim()) throw new Error("Missing learnerText");
  if (input.turnCount >= MAX_TURNS) throw new Error("Session turn cap reached");

  const scenario = normalizeScenario(input.scenario, input.scenarioId);
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

  const reply = sanitizeReply(draft.reply) || buildFallbackReply(input, scenario);
  const historyWithNext: AiConversationHistoryTurn[] = [
    ...input.history,
    { role: "learner", text: input.learnerText },
    { role: "assistant", text: reply, correction },
  ];
  return {
    reply,
    correction,
    summary: input.turnCount + 1 >= 4 ? buildSummary(historyWithNext, scenario) : null,
    cost: estimateCost(addUsage(draftData.usage, gateUsage)),
    provider: "openai",
    model: TURN_MODEL,
    correctionGateModel: CORRECTION_GATE_MODEL,
  };
}

function fallbackProcessEnv(): AiConversationEnv {
  const globalWithProcess = globalThis as typeof globalThis & {
    process?: { env?: AiConversationEnv };
  };
  return globalWithProcess.process?.env ?? {};
}

function normalizeScenario(value: AiConversationScenarioInput | null | undefined, scenarioId: string): Scenario {
  const fallback = JOB_INTERVIEW_SCENARIO;
  const normalizedScenarioId = stringValue(scenarioId, 80);
  if (!isRecord(value)) {
    if (normalizedScenarioId === LEARNER_LED_SCENARIO_ID) return LEARNER_LED_SCENARIO;
    return {
      ...fallback,
      id: normalizedScenarioId || fallback.id,
    };
  }

  const l1Notes = Array.isArray(value.l1InterferenceNotes)
    ? value.l1InterferenceNotes.map((note) => {
      const record = isRecord(note) ? note : {};
      return {
        id: stringValue(record.id, 120),
        pattern: stringValue(record.pattern, 300),
        watchFor: stringValue(record.watchFor, 300),
        correctionHintVi: stringValue(record.correctionHintVi, 500),
      };
    }).filter((note) => note.id && note.pattern && note.watchFor && note.correctionHintVi)
    : [];

  return {
    id: stringValue(value.id, 80) || normalizedScenarioId || fallback.id,
    title: stringValue(value.title, 160) || (normalizedScenarioId === LEARNER_LED_SCENARIO_ID ? LEARNER_LED_SCENARIO.title : fallback.title),
    themeContext: stringValue(value.themeContext, 1200) || (normalizedScenarioId === LEARNER_LED_SCENARIO_ID ? LEARNER_LED_SCENARIO.themeContext : fallback.themeContext),
    learnerRole: stringValue(value.learnerRole, 600) || (normalizedScenarioId === LEARNER_LED_SCENARIO_ID ? LEARNER_LED_SCENARIO.learnerRole : fallback.learnerRole),
    aiRole: stringValue(value.aiRole, 600) || (normalizedScenarioId === LEARNER_LED_SCENARIO_ID ? LEARNER_LED_SCENARIO.aiRole : fallback.aiRole),
    topicBoundaries: normalizeStringList(
      value.topicBoundaries,
      normalizedScenarioId === LEARNER_LED_SCENARIO_ID ? LEARNER_LED_SCENARIO.topicBoundaries : fallback.topicBoundaries,
      8,
      300,
    ),
    l1InterferenceNotes: l1Notes.length
      ? l1Notes
      : normalizedScenarioId === LEARNER_LED_SCENARIO_ID
        ? LEARNER_LED_SCENARIO.l1InterferenceNotes
        : fallback.l1InterferenceNotes,
  };
}

function normalizeStringList(value: unknown, fallback: string[], limit: number, max: number): string[] {
  if (!Array.isArray(value)) return fallback;
  const normalized = value.map((item) => stringValue(item, max)).filter(Boolean).slice(0, limit);
  return normalized.length ? normalized : fallback;
}

function normalizeDeveloperGrounding(messages: AiConversationMessage[] | undefined, grounding: unknown): string {
  const developerMessages = Array.isArray(messages)
    ? messages
      .filter((message) => message?.role === "developer")
      .map((message) => stringValue(message.text, 1600))
      .filter(Boolean)
      .slice(-3)
    : [];
  const explicitGrounding = typeof grounding === "string"
    ? stringValue(grounding, 1600)
    : isRecord(grounding)
      ? JSON.stringify(grounding).slice(0, 1600)
      : "";
  return [...developerMessages, explicitGrounding].filter(Boolean).join("\n\n");
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

function buildFallbackReply(input: AiConversationRequest, scenario: Scenario): string {
  const snippet = input.learnerText.slice(0, 80);
  if (scenario.id === LEARNER_LED_SCENARIO_ID) {
    return `I hear that you said "${snippet}." What happened next?`;
  }
  return `I hear that you said "${snippet}." Let's keep it practical: what is one strength you would bring to this role?`;
}

function buildSummary(history: AiConversationHistoryTurn[], scenario: Scenario): AiConversationResponse["summary"] {
  const corrections = history
    .map((turn) => turn.correction)
    .filter((correction): correction is AiConversationCorrection => Boolean(correction));
  const learnerLed = scenario.id === LEARNER_LED_SCENARIO_ID;
  return {
    practiced: [
      learnerLed ? "learner-led conversation turns" : "job interview answers",
      "answer-specific follow-up questions",
      "Vietnamese-to-English transfer awareness",
    ],
    errorsCaught: [...new Set(corrections.map((correction) => correction.interferencePattern))],
    progressNote:
      learnerLed
        ? "You built a conversation from your own words and kept adding context."
        : "You completed a coherent interview sequence and kept building from your own answers.",
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
