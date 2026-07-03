import {
  type CEFRAssessment,
  type GraderInput,
  type GraderResult,
} from "./types.ts";

export const GRADER_TIMEOUT_MS = 12_000;

export interface WritingGraderClient {
  gradeWriting(input: GraderInput): Promise<GraderResult>;
  gradeConversation?: (input: GraderInput) => Promise<GraderResult>;
}

/**
 * Contract for the future speaking grader.
 *
 * Input:
 * - modality: "speaking"
 * - prompt: the exact PromptTask served by this orchestrator
 * - responseText: transcript text when available; may be empty if only audio exists
 * - audioStoragePath: Supabase Storage path for the captured learner audio
 * - responseDurationMs: client-measured duration
 *
 * Output:
 * - a CEFRAssessment with overallLevel, confidence, strengths, gaps, and
 *   optional Vietnamese L1 interference flags
 * - metadata should include pronunciation evidence such as phoneme issues,
 *   fluency rate, and final-consonant/stress findings when the grader supports it
 *
 * Replacement rule: keep this return shape stable so scoring.ts and
 * persistence.ts do not need to change when the real speaking grader ships.
 */
export interface SpeakingGraderClient {
  gradeSpeaking(input: GraderInput): Promise<GraderResult>;
}

export interface GraderFetchConfig {
  functionBaseUrl: string;
  serviceRoleKey: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

export function createHttpWritingGrader(config: GraderFetchConfig): WritingGraderClient {
  const fetchImpl = config.fetchImpl ?? fetch;
  return {
    async gradeWriting(input) {
      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(),
        config.timeoutMs ?? GRADER_TIMEOUT_MS,
      );
      try {
        const res = await fetchImpl(
          `${config.functionBaseUrl.replace(/\/$/, "")}/placement-v3-grade-writing`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${config.serviceRoleKey}`,
              apikey: config.serviceRoleKey,
            },
            body: JSON.stringify({
              promptId: input.prompt.id,
              taskText: input.prompt.promptText,
              userResponse: input.responseText,
              targetLanguage: "en",
              userId: input.userId,
            }),
            signal: controller.signal,
          },
        );
        if (res.status === 429) {
          return fallbackAssessment(input, "rate_limited", "Writing grader rate-limited");
        }
        if (!res.ok) {
          return fallbackAssessment(input, "http_error", `Writing grader HTTP ${res.status}`);
        }
        const json = await res.json();
        const assessment = normalizeAssessment(json?.assessment ?? json);
        if (!assessment) {
          return fallbackAssessment(input, "malformed_json", "Writing grader returned invalid JSON");
        }
        const modelTrace = json?.modelTrace && typeof json.modelTrace === "object"
          ? json.modelTrace as { provider?: unknown; model?: unknown }
          : null;
        const version = modelTrace
          ? `${String(modelTrace.provider ?? "ai")}:${String(modelTrace.model ?? "unknown")}`
          : String(json?.version ?? "placement-v3-grade-writing");
        return { ok: true, assessment, version };
      } catch (err) {
        const isTimeout =
          typeof err === "object" &&
          err !== null &&
          "name" in err &&
          String((err as { name?: unknown }).name) === "AbortError";
        return fallbackAssessment(
          input,
          isTimeout ? "timeout" : "network_error",
          isTimeout ? "Writing grader timed out" : "Writing grader call failed",
        );
      } finally {
        clearTimeout(timeout);
      }
    },
    async gradeConversation(input) {
      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(),
        config.timeoutMs ?? GRADER_TIMEOUT_MS,
      );
      try {
        const res = await fetchImpl(
          `${config.functionBaseUrl.replace(/\/$/, "")}/placement-v3-mercy-conversation`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${config.serviceRoleKey}`,
              apikey: config.serviceRoleKey,
            },
            body: JSON.stringify({
              action: "grade",
              transcript: [
                {
                  speaker: "mercy",
                  text: input.prompt.promptText,
                  timestamp_seconds: 0,
                  language_marker: "en",
                },
                {
                  speaker: "user",
                  text: input.responseText,
                  timestamp_seconds: Math.max(1, Math.round((input.responseDurationMs ?? 30_000) / 1000)),
                  language_marker: "en",
                },
              ],
            }),
            signal: controller.signal,
          },
        );
        if (!res.ok) {
          return fallbackAssessment(input, "http_error", `Conversation grader HTTP ${res.status}`);
        }
        const json = await res.json();
        const assessment = normalizeConversationAssessment(json?.assessment ?? json);
        if (!assessment) {
          return fallbackAssessment(input, "malformed_json", "Conversation grader returned invalid JSON");
        }
        return { ok: true, assessment, version: "placement-v3-mercy-conversation" };
      } catch (err) {
        const isTimeout =
          typeof err === "object" &&
          err !== null &&
          "name" in err &&
          String((err as { name?: unknown }).name) === "AbortError";
        return fallbackAssessment(
          input,
          isTimeout ? "timeout" : "network_error",
          isTimeout ? "Conversation grader timed out" : "Conversation grader call failed",
        );
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}

export async function gradeWithClient(
  input: GraderInput,
  writingClient?: WritingGraderClient,
): Promise<GraderResult> {
  if (input.modality === "writing" && writingClient) {
    return writingClient.gradeWriting(input);
  }
  if (input.modality === "conversation" && writingClient?.gradeConversation) {
    return writingClient.gradeConversation(input);
  }
  return stubGrade(input);
}

export async function stubGrade(input: GraderInput): Promise<GraderResult> {
  return {
    ok: true,
    assessment: heuristicAssessment(input),
    version: `stub-${input.modality}-grader-v1`,
  };
}

export function fallbackAssessment(
  input: GraderInput,
  errorCode: string,
  errorMessage: string,
): GraderResult {
  return {
    ok: false,
    assessment: {
      ...heuristicAssessment(input),
      confidence: 0.35,
      gaps: ["Needs a retry or human review because grading confidence was low."],
      metadata: { errorCode, errorMessage, fallback: true },
    },
    version: `fallback-${input.modality}-grader-v1`,
    errorCode,
    errorMessage,
  };
}

function heuristicAssessment(input: GraderInput): CEFRAssessment {
  const text = input.responseText.trim();
  const words = text ? text.split(/\s+/).length : 0;
  if (input.modality === "speaking") {
    return speakingHeuristicAssessment(input, text, words);
  }
  return textHeuristicAssessment(input, text, words);
}

function speakingHeuristicAssessment(
  input: GraderInput,
  text: string,
  words: number,
): CEFRAssessment {
  const hasPlayableAudio = hasUsableAudioPath(input.audioStoragePath);
  if (words === 0 && !hasPlayableAudio) {
    return {
      overallLevel: "A1",
      confidence: 0,
      strengths: [],
      gaps: [
        "Speaking audio was unavailable or unplayable, so no speaking CEFR evidence was counted.",
      ],
      l1InterferenceFlags: [],
      metadata: {
        stub: true,
        words,
        speakingEvidenceStatus: "not_counted",
        audioEvidence: "unavailable_or_unplayable",
        cefrEvidence: "none",
      },
    };
  }

  const base = textHeuristicAssessment(input, text, words);
  if (!hasPlayableAudio) {
    return {
      ...base,
      confidence: Math.min(base.confidence, 0.55),
      gaps: [
        ...(base.gaps ?? []),
        "Speaking was scored from typed/transcribed text because audio evidence was unavailable.",
      ],
      metadata: {
        ...(base.metadata ?? {}),
        speakingEvidenceStatus: "degraded_text_fallback",
        audioEvidence: "unavailable_or_unplayable",
        cefrEvidence: "text_fallback",
      },
    };
  }

  return {
    ...base,
    metadata: {
      ...(base.metadata ?? {}),
      speakingEvidenceStatus: "counted",
      audioEvidence: "available",
      cefrEvidence: "audio_or_transcript",
    },
  };
}

function textHeuristicAssessment(
  input: GraderInput,
  text: string,
  words: number,
): CEFRAssessment {
  const level = words < 8 ? "A1" : words < 25 ? "A2" : words < 60 ? "B1" : words < 120 ? "B2" : "C1";
  const hasVietnamese = /[ăâđêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i.test(text);
  const promptText = input.prompt.promptText.toLowerCase();
  const responseText = text.toLowerCase();
  const copiedPrompt = text.length > 20 &&
    (promptText.includes(responseText) ||
      responseText.includes(promptText) ||
      looksLikeInstructionEcho(responseText) ||
      lexicalOverlap(promptText, responseText) >= 0.75);
  return {
    overallLevel: copiedPrompt ? "A1" : level,
    confidence: copiedPrompt ? 0.3 : Math.min(0.78, 0.45 + words / 180),
    strengths: words > 20 ? ["Provides enough language for diagnosis."] : [],
    gaps: [
      ...(words < 12 ? ["Response is too short for a confident estimate."] : []),
      ...(hasVietnamese ? ["Uses Vietnamese inside an English placement response."] : []),
      ...(copiedPrompt ? ["Copies the prompt instead of answering it."] : []),
    ],
    l1InterferenceFlags: hasVietnamese
      ? [{ patternId: "vn_code_switching", severity: "medium", evidence: "Vietnamese characters detected." }]
      : [],
    metadata: { stub: input.modality !== "writing", words },
  };
}

function hasUsableAudioPath(path: string | undefined): boolean {
  if (!path) return false;
  const normalized = path.trim().toLowerCase();
  if (!normalized) return false;
  return ![
    "unavailable",
    "unplayable",
    "audio_unavailable",
    "audio-unavailable",
    "recording_failed",
    "recording-failed",
  ].includes(normalized);
}

function looksLikeInstructionEcho(text: string): boolean {
  return /\bwrite in english\b/.test(text) &&
    (/\b(a1|a2|b1|b2|c1|c2)\b/.test(text) || /\bdaily routine\b/.test(text));
}

function lexicalOverlap(a: string, b: string): number {
  const left = new Set(a.split(/[^a-z0-9']+/).filter((word) => word.length > 2));
  const right = new Set(b.split(/[^a-z0-9']+/).filter((word) => word.length > 2));
  if (left.size === 0 || right.size === 0) return 0;
  let shared = 0;
  for (const word of right) {
    if (left.has(word)) shared += 1;
  }
  return shared / Math.min(left.size, right.size);
}

function normalizeAssessment(raw: unknown): CEFRAssessment | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Partial<CEFRAssessment> & {
    overall?: { level?: unknown; confidence?: unknown };
    subskills?: Record<string, { level?: unknown; confidence?: unknown; notes?: unknown }>;
    recommendedFocusAreas?: unknown;
  };
  const overallLevel = obj.overallLevel ?? obj.overall?.level;
  const confidence = obj.confidence ?? obj.overall?.confidence;
  if (!overallLevel || confidence === undefined) return null;
  if (!["A1", "A2", "B1", "B2", "C1", "C2"].includes(String(overallLevel))) {
    return null;
  }
  return {
    overallLevel: overallLevel as CEFRAssessment["overallLevel"],
    confidence: Math.min(1, Math.max(0, Number(confidence))),
    criteria: obj.criteria ?? normalizeSubskills(obj.subskills),
    strengths: Array.isArray(obj.strengths) ? obj.strengths.map(String) : [],
    gaps: [
      ...(Array.isArray(obj.gaps) ? obj.gaps.map(String) : []),
      ...(Array.isArray(obj.recommendedFocusAreas)
        ? obj.recommendedFocusAreas.map(String)
        : []),
    ],
    l1InterferenceFlags: Array.isArray(obj.l1InterferenceFlags)
      ? obj.l1InterferenceFlags.map((flag) => {
          const f = flag as {
            patternId?: unknown;
            pattern?: unknown;
            severity?: unknown;
            evidence?: unknown;
            examples?: unknown;
          };
          const rawSeverity = String(f.severity ?? "low");
          return {
            patternId: String(f.patternId ?? f.pattern ?? "unknown"),
            severity: rawSeverity === "med" ? "medium" : rawSeverity,
            evidence: String(
              f.evidence ??
                (Array.isArray(f.examples) ? f.examples.join("; ") : ""),
            ),
          };
        }).filter((flag) =>
          ["low", "medium", "high"].includes(flag.severity)
        ) as CEFRAssessment["l1InterferenceFlags"]
      : [],
    metadata: obj.metadata && typeof obj.metadata === "object" ? obj.metadata : {},
  };
}

function normalizeConversationAssessment(raw: unknown): CEFRAssessment | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as {
    cefr?: unknown;
    confidence?: unknown;
    strengths?: unknown;
    gaps?: unknown;
    recommendedFocus?: unknown;
    l1Interference?: unknown;
    perSkill?: Record<string, { cefr?: unknown; score?: unknown; confidence?: unknown }>;
    numericLevel?: unknown;
  };
  if (!["A1", "A2", "B1", "B2", "C1", "C2"].includes(String(obj.cefr))) {
    return null;
  }
  return {
    overallLevel: obj.cefr as CEFRAssessment["overallLevel"],
    confidence: Math.min(1, Math.max(0, Number(obj.confidence ?? 0.5))),
    criteria: obj.perSkill
      ? Object.fromEntries(
          Object.entries(obj.perSkill)
            .filter(([, value]) => ["A1", "A2", "B1", "B2", "C1", "C2"].includes(String(value.cefr)))
            .map(([key, value]) => [
              key,
              {
                level: value.cefr as CEFRAssessment["overallLevel"],
                score: typeof value.score === "number" ? value.score : undefined,
                evidence: typeof value.confidence === "number" ? `confidence ${value.confidence}` : undefined,
              },
            ]),
        )
      : undefined,
    strengths: Array.isArray(obj.strengths) ? obj.strengths.map(String) : [],
    gaps: [
      ...(Array.isArray(obj.gaps) ? obj.gaps.map(String) : []),
      ...(Array.isArray(obj.recommendedFocus) ? obj.recommendedFocus.map(String) : []),
    ],
    l1InterferenceFlags: Array.isArray(obj.l1Interference)
      ? obj.l1Interference.map((flag) => {
          const f = flag as { patternId?: unknown; id?: unknown; severity?: unknown; evidence?: unknown };
          const rawSeverity = String(f.severity ?? "medium");
          return {
            patternId: String(f.patternId ?? f.id ?? "unknown"),
            severity: rawSeverity === "med" ? "medium" : rawSeverity,
            evidence: String(f.evidence ?? ""),
          };
        }).filter((flag) =>
          ["low", "medium", "high"].includes(flag.severity)
        ) as CEFRAssessment["l1InterferenceFlags"]
      : [],
    metadata: {
      source: "placement-v3-mercy-conversation",
      numericLevel: obj.numericLevel,
    },
  };
}

function normalizeSubskills(
  subskills: Record<string, { level?: unknown; confidence?: unknown; notes?: unknown }> | undefined,
): CEFRAssessment["criteria"] {
  if (!subskills) return undefined;
  return Object.fromEntries(
    Object.entries(subskills)
      .filter(([, value]) => ["A1", "A2", "B1", "B2", "C1", "C2"].includes(String(value.level)))
      .map(([key, value]) => [
        key,
        {
          level: value.level as CEFRAssessment["overallLevel"],
          score: typeof value.confidence === "number" ? value.confidence : undefined,
          evidence: typeof value.notes === "string" ? value.notes : undefined,
        },
      ]),
  );
}
