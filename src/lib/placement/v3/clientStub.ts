import type {
  BilingualText,
  PlacementV3L1Flag,
  PlacementV3Modality,
  PlacementV3Recommendation,
  PlacementV3ResponsePayload,
  PlacementV3Results,
  PlacementV3Session,
  PlacementV3SkillProfile,
  PlacementV3SubmitResult,
  PlacementV3Task,
  PlacementV3TaskType,
  PlacementV3ObservationTimelineItem,
} from "./types";
import {
  applyPlacementRuntimeDecision,
  buildPlacementTeacherContext,
  placementTimelineItemFromSubmit,
} from "./runtimeIntegration";

const SESSION_CACHE_KEY = "mb.placement.v3.session";
const RESULT_KEY = "mb.placement.v3.results.";
const RUNTIME_TIMELINE_KEY = "mb.placement.v3.runtime.";

const modalities: PlacementV3Modality[] = [
  "writing",
  "speaking",
  "reading",
  "listening",
  "conversation",
];

type PublicPrompt = {
  id: string;
  modality: PlacementV3Modality;
  cefr: string;
  promptText: string;
  expectedResponse: "text" | "audio" | "choice";
  metadata?: Record<string, unknown>;
};

type PublicProgress = {
  current: number;
  total: number;
  state: "in_progress" | "completed" | "abandoned" | "error";
};

type StartResponse = {
  sessionId: string;
  currentTask: PublicPrompt | null;
  totalTasks: number;
  progress: PublicProgress;
  resumed?: boolean;
};

type RespondResponse =
  | {
      type: "next_task" | "modality_complete";
      nextModality?: PlacementV3Modality;
      currentTask: PublicPrompt | null;
      progress: PublicProgress;
    }
  | {
      type: "session_complete";
      profile: PlacementProfile;
      recommendations?: RawRecommendation[];
    };

type StatusResponse = {
  sessionState?: "in_progress" | "completed" | "abandoned" | "error";
  currentModality?: PlacementV3Modality | null;
  currentTask?: PublicPrompt | null;
  progress?: PublicProgress;
  profile?: PlacementProfile | null;
  type?: "no_session" | "expired" | "resumed";
  sessionId?: string;
};

type PlacementProfile = {
  session_id: string;
  cefr_overall: string;
  cefr_overall_confidence: number;
  cefr_per_skill?: Partial<Record<PlacementV3Modality, { level?: string; confidence?: number }>>;
  l1_interference_flags?: Array<{ patternId?: string; id?: string; severity?: string; evidence?: string }>;
  strengths?: string[];
  gaps?: string[];
  recommended_lessons?: RawRecommendation[];
  computed_at?: string;
};

type RawRecommendation = {
  lessonId?: string;
  lessonTitle?: string;
  roomId?: string;
  title?: string;
  titleVi?: string;
  reason?: string;
  priority?: number;
  category?: string;
  cefrLevel?: string;
};

async function callPlacementSession(body: unknown): Promise<unknown> {
  const { supabase } = await import("@/lib/supabaseClient");
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Sign in to start placement.");

  const supabaseUrl = String(import.meta.env.VITE_SUPABASE_URL ?? "").replace(/\/$/, "");
  const anonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? "");
  if (!supabaseUrl || !anonKey) throw new Error("Placement service is not configured.");

  const res = await fetch(`${supabaseUrl}/functions/v1/placement-v3-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      apikey: anonKey,
    },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.ok === false) {
    throw new Error(String(json?.message ?? json?.error ?? `Placement request failed (${res.status})`));
  }
  return json;
}

function cacheSession(session: PlacementV3Session | null) {
  if (typeof window === "undefined") return;
  if (!session) window.localStorage.removeItem(SESSION_CACHE_KEY);
  else window.localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(session));
}

function readCachedSession(): PlacementV3Session | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_CACHE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PlacementV3Session;
  } catch {
    return null;
  }
}

function runtimeTimelineKey(sessionId: string): string {
  return `${RUNTIME_TIMELINE_KEY}${sessionId}`;
}

export function readPlacementRuntimeTimeline(sessionId: string): PlacementV3ObservationTimelineItem[] {
  if (typeof window === "undefined") return [];
  const raw = window.sessionStorage.getItem(runtimeTimelineKey(sessionId));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as PlacementV3ObservationTimelineItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writePlacementRuntimeTimeline(sessionId: string, timeline: readonly PlacementV3ObservationTimelineItem[]) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(runtimeTimelineKey(sessionId), JSON.stringify(timeline));
}

function appendPlacementRuntimeTimeline(
  payload: PlacementV3ResponsePayload,
  task: PlacementV3Task | null | undefined,
) {
  const items = placementTimelineItemFromSubmit(payload, task);
  if (!items.length) return;
  writePlacementRuntimeTimeline(payload.sessionId, [...readPlacementRuntimeTimeline(payload.sessionId), ...items]);
}

function applyRuntimeToResults(results: PlacementV3Results): PlacementV3Results {
  const timeline = readPlacementRuntimeTimeline(results.sessionId);
  const runtime = buildPlacementTeacherContext(timeline, results.completedAt);
  return applyPlacementRuntimeDecision(results, runtime.teacherContext, runtime.decision, timeline);
}

function taskType(prompt: PublicPrompt): PlacementV3TaskType {
  if (prompt.modality === "reading") return "reading_short";
  if (prompt.modality === "listening") return "listening_short";
  return prompt.modality;
}

function bilingual(en: string, vi?: unknown): BilingualText {
  return { en, vi: typeof vi === "string" && vi.trim() ? vi : en };
}

function toTask(prompt: PublicPrompt | null): PlacementV3Task | null {
  if (!prompt) return null;
  const metadata = prompt.metadata ?? {};
  const question = Array.isArray(metadata.questions) ? metadata.questions[0] as Record<string, unknown> : null;
  const promptText = question && typeof question.questionText === "string"
    ? question.questionText
    : prompt.promptText;
  const options = Array.isArray(question?.options)
    ? (question?.options as unknown[]).map((option, index) => ({
        id: String.fromCharCode(97 + index),
        label: bilingual(String(option)),
      }))
    : undefined;

  return {
    id: prompt.id,
    modality: prompt.modality,
    type: options?.length
      ? prompt.modality === "listening" ? "listening_mcq" : "reading_mcq"
      : taskType(prompt),
    minWords: prompt.modality === "writing" ? Number(metadata.minResponseLength ?? 25) : undefined,
    estimatedSeconds: typeof metadata.expectedDurationSec === "number" ? metadata.expectedDurationSec : undefined,
    instruction: bilingual(instructionFor(prompt), metadata.promptTextVi),
    prompt: bilingual(promptText, question?.questionTextVi ?? metadata.promptTextVi),
    passage: typeof metadata.passageText === "string"
      ? bilingual(metadata.passageText, metadata.passageTextVi)
      : undefined,
    audioUrl: typeof metadata.audioUrl === "string" ? metadata.audioUrl : undefined,
    mercyTurn: prompt.modality === "conversation" ? bilingual(String(metadata.mercyTurn ?? prompt.promptText)) : undefined,
    options,
  };
}

function instructionFor(prompt: PublicPrompt): string {
  if (prompt.modality === "writing") return "Write your answer in English.";
  if (prompt.modality === "speaking") return "Speak naturally, or type your answer if the microphone is unavailable.";
  if (prompt.modality === "reading") return "Read the prompt and answer in English.";
  if (prompt.modality === "listening") return "Use the listening prompt and answer in English.";
  return "Reply to Mercy naturally in English.";
}

function toSession(input: {
  sessionId: string;
  prompt: PublicPrompt | null;
  progress: PublicProgress;
  totalTasks?: number;
  existing?: PlacementV3Session | null;
}): PlacementV3Session {
  const status = input.progress.state === "completed"
    ? "completed"
    : input.progress.state === "abandoned"
      ? "abandoned"
      : "in_progress";
  const currentTask = toTask(input.prompt);
  const modalityIndex = currentTask
    ? Math.max(0, modalities.indexOf(currentTask.modality))
    : input.existing?.modalityIndex ?? 0;
  return {
    sessionId: input.sessionId,
    status,
    currentTask,
    answeredCount: Math.max(0, input.progress.current),
    estimatedTotal: input.totalTasks ?? input.progress.total ?? input.existing?.estimatedTotal ?? 0,
    modalityIndex,
    modalities,
    startedAt: input.existing?.startedAt ?? new Date().toISOString(),
    expiresAt: input.existing?.expiresAt ?? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}

export async function startSession(): Promise<PlacementV3Session> {
  const json = await callPlacementSession({
    action: "start",
    languagePair: { native: "vi", target: "en" },
    initialLevel: "A2",
  }) as StartResponse;
  const session = toSession({
    sessionId: json.sessionId,
    prompt: json.currentTask,
    progress: json.progress,
    totalTasks: json.totalTasks,
    existing: readCachedSession(),
  });
  cacheSession(session);
  writePlacementRuntimeTimeline(session.sessionId, []);
  return session;
}

export async function submitResponse(
  payload: PlacementV3ResponsePayload,
): Promise<PlacementV3SubmitResult> {
  const existing = readCachedSession();
  const json = await callPlacementSession({
    action: "respond",
    response: {
      sessionId: payload.sessionId,
      taskIndex: existing?.answeredCount ?? 0,
      promptId: payload.taskId,
      responseText: payload.value,
      responseDurationMs: payload.elapsedMs,
    },
  }) as RespondResponse;
  appendPlacementRuntimeTimeline(payload, existing?.currentTask);

  if (json.type === "session_complete") {
    const results = applyRuntimeToResults(
      profileToResults(json.profile, json.recommendations ?? json.profile.recommended_lessons ?? []),
    );
    const completed: PlacementV3Session = {
      ...(existing ?? toSession({
        sessionId: payload.sessionId,
        prompt: null,
        progress: { current: results.questionCount, total: results.questionCount, state: "completed" },
      })),
      status: "completed",
      currentTask: null,
      answeredCount: results.questionCount,
      estimatedTotal: results.questionCount,
    };
    cacheSession(completed);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(`${RESULT_KEY}${payload.sessionId}`, JSON.stringify(results));
    }
    return { session: completed, completed: true, results };
  }

  const session = toSession({
    sessionId: payload.sessionId,
    prompt: json.currentTask,
    progress: json.progress,
    existing,
  });
  cacheSession(session);
  return { session, completed: false };
}

export async function getResults(sessionId: string): Promise<PlacementV3Results> {
  const json = await callPlacementSession({ action: "status", sessionId }) as StatusResponse;
  if (!json.profile) throw new Error("Placement results are not ready yet.");
  return applyRuntimeToResults(profileToResults(json.profile, json.profile.recommended_lessons ?? []));
}

export async function abandonSession(sessionId: string): Promise<{ ok: true }> {
  await callPlacementSession({ action: "abandon", sessionId });
  const existing = readCachedSession();
  if (existing?.sessionId === sessionId) cacheSession({ ...existing, status: "abandoned" });
  return { ok: true };
}

export async function resumeSession(): Promise<PlacementV3Session | null> {
  const json = await callPlacementSession({ action: "resume" }) as StatusResponse | StartResponse;
  if ("type" in json && json.type === "no_session") {
    cacheSession(null);
    return null;
  }
  const sessionId = "sessionId" in json && typeof json.sessionId === "string"
    ? json.sessionId
    : readCachedSession()?.sessionId;
  if (!sessionId) return null;
  const progress = "progress" in json && json.progress
    ? json.progress
    : { current: 0, total: 0, state: "in_progress" as const };
  const prompt = "currentTask" in json ? json.currentTask ?? null : null;
  const session = toSession({ sessionId, prompt, progress, existing: readCachedSession() });
  cacheSession(session);
  return session;
}

function profileToResults(profile: PlacementProfile, recommendations: RawRecommendation[]): PlacementV3Results {
  const skills = Object.entries(profile.cefr_per_skill ?? {}).map(([modality, skill]) => ({
    modality: modality as PlacementV3Modality,
    cefr: normalizeCefr(skill?.level),
    confidence: clampConfidence(skill?.confidence),
    summary: bilingual(
      `Estimated around ${normalizeCefr(skill?.level)} for this skill.`,
      `Kỹ năng này khoảng ${normalizeCefr(skill?.level)}.`,
    ),
  } satisfies PlacementV3SkillProfile));

  return {
    sessionId: profile.session_id,
    completedAt: profile.computed_at ?? new Date().toISOString(),
    overallCefr: normalizeCefr(profile.cefr_overall),
    overallConfidence: clampConfidence(profile.cefr_overall_confidence),
    overallSummary: bilingual(
      `Mercy placed your current working level around ${normalizeCefr(profile.cefr_overall)} and prepared a focused next path.`,
      `Mercy xếp trình độ hiện tại của bạn khoảng ${normalizeCefr(profile.cefr_overall)} và chuẩn bị lộ trình tiếp theo.`,
    ),
    skills,
    l1Flags: (profile.l1_interference_flags ?? []).map(toL1Flag),
    recommendations: recommendations.map(toRecommendation).slice(0, 6),
    strengths: (profile.strengths ?? []).map((s) => bilingual(s)),
    gaps: (profile.gaps ?? []).map((g) => bilingual(g)),
    questionCount: Math.max(1, skills.length),
    placementValidity: "valid",
  };
}

function toRecommendation(raw: RawRecommendation): PlacementV3Recommendation {
  const roomId = raw.roomId ?? raw.lessonId ?? "daily:a1-basics";
  const title = raw.lessonTitle ?? raw.title ?? roomId.replace(/^[^:]+:/, "").replace(/[-_]/g, " ");
  return {
    roomId,
    cefr: normalizeCefr(raw.cefrLevel),
    title: bilingual(title, raw.titleVi),
    description: bilingual(`${raw.category ?? "Practice"} lesson selected from your placement profile.`),
    reason: bilingual(raw.reason ?? "Matches your placement profile."),
  };
}

function toL1Flag(raw: NonNullable<PlacementProfile["l1_interference_flags"]>[number]): PlacementV3L1Flag {
  const id = raw.patternId ?? raw.id ?? "l1-pattern";
  const label = id.replace(/[-_]/g, " ");
  return {
    id,
    severity: raw.severity === "high" || raw.severity === "low" ? raw.severity : "medium",
    label: bilingual(label, label.includes("final consonants") || label.includes("final consonant") ? "Âm cuối" : label),
    evidence: bilingual(raw.evidence ?? "Detected during placement."),
  };
}

function normalizeCefr(value: unknown): PlacementV3Results["overallCefr"] {
  const raw = String(value ?? "A1").toUpperCase();
  return raw === "A1" || raw === "A2" || raw === "B1" || raw === "B2" || raw === "C1" || raw === "C2"
    ? raw
    : "A1";
}

function clampConfidence(value: unknown): number {
  const n = typeof value === "number" && Number.isFinite(value) ? value : Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : 0.5;
}

function labelForModality(modality: string): string {
  return modality.charAt(0).toUpperCase() + modality.slice(1);
}

export const placementV3StubInternals = {
  tasks: [
    {
      id: "writing-a2-daily-routine-1",
      modality: "writing",
      type: "writing",
      minWords: 25,
      estimatedSeconds: 240,
      instruction: bilingual("Write your answer in English.", "Viết câu trả lời bằng tiếng Anh."),
      prompt: bilingual(
        "Describe your usual weekday and one thing you want to improve this month.",
        "Mô tả một ngày thường của bạn và một điều bạn muốn cải thiện trong tháng này.",
      ),
    },
    {
      id: "speaking-a2-learning-goals-1",
      modality: "speaking",
      type: "speaking",
      estimatedSeconds: 90,
      instruction: bilingual(
        "Speak naturally, or type your answer if the microphone is unavailable.",
        "Nói tự nhiên, hoặc gõ câu trả lời nếu chưa dùng được micro.",
      ),
      prompt: bilingual(
        "Introduce yourself and explain why you are learning English.",
        "Giới thiệu bản thân và giải thích vì sao bạn học tiếng Anh.",
      ),
    },
    {
      id: "reading-b1-work-email-1",
      modality: "reading",
      type: "reading_mcq",
      estimatedSeconds: 90,
      instruction: bilingual("Read the prompt and choose the best answer.", "Đọc đoạn ngắn và chọn đáp án đúng nhất."),
      prompt: bilingual("What does Linh need to send?", "Linh cần gửi gì?"),
      passage: bilingual(
        "Hi Linh, please send three feedback slides before Wednesday noon so the team can review them.",
        "Linh ơi, vui lòng gửi ba slide phản hồi trước trưa thứ Tư để nhóm xem lại.",
      ),
      options: [
        { id: "a", label: bilingual("A full report") },
        { id: "b", label: bilingual("Send three feedback slides") },
        { id: "c", label: bilingual("A new meeting link") },
      ],
    },
    {
      id: "listening-a2-class-delay-1",
      modality: "listening",
      type: "listening_mcq",
      estimatedSeconds: 75,
      instruction: bilingual("Listen and choose the best answer.", "Nghe và chọn đáp án đúng nhất."),
      prompt: bilingual("Why is the class starting late?", "Vì sao lớp học bắt đầu muộn?"),
      audioUrl: "/audio/placement-v3/listening-a2-class-delay-1.mp3",
      options: [
        { id: "a", label: bilingual("the teacher is sick") },
        { id: "b", label: bilingual("the room is closed") },
        { id: "c", label: bilingual("the bus is delayed") },
      ],
    },
    {
      id: "conversation-a2-job-goals-1",
      modality: "conversation",
      type: "conversation",
      estimatedSeconds: 120,
      instruction: bilingual("Reply to Mercy naturally in English.", "Trả lời Mercy tự nhiên bằng tiếng Anh."),
      prompt: bilingual("Talk with Mercy about your English goals.", "Trò chuyện với Mercy về mục tiêu tiếng Anh của bạn."),
      mercyTurn: bilingual(
        "You mentioned wanting a better job. What kind of job are you aiming for, and what English do you need there?",
        "Bạn nói muốn có công việc tốt hơn. Bạn đang nhắm tới công việc gì, và cần tiếng Anh như thế nào ở đó?",
      ),
    },
  ] as PlacementV3Task[],
  buildResults: (sessionId: string) => profileToResults({
    session_id: sessionId,
    cefr_overall: "A2",
    cefr_overall_confidence: 0.6,
    cefr_per_skill: {
      writing: { level: "A2", confidence: 0.66 },
      speaking: { level: "A2", confidence: 0.61 },
      reading: { level: "B1", confidence: 0.72 },
      listening: { level: "A2", confidence: 0.58 },
      conversation: { level: "A2", confidence: 0.64 },
    },
    l1_interference_flags: [
      {
        patternId: "final-consonants",
        severity: "high",
        evidence: "Ending sounds are often dropped in spoken and typed responses.",
      },
    ],
    strengths: ["Communicates everyday goals clearly."],
    gaps: ["Needs more control with final consonants and present perfect forms."],
    recommended_lessons: [
      {
        lessonId: "present_perfect_experiences_l1",
        lessonTitle: "Present Perfect for Vietnamese Speakers",
        category: "grammar",
        cefrLevel: "A2",
        reason: "Targets a high-value next grammar step after the placement result.",
      },
    ],
    computed_at: new Date().toISOString(),
  }, [
    {
      lessonId: "present_perfect_experiences_l1",
      lessonTitle: "Present Perfect for Vietnamese Speakers",
      category: "grammar",
      cefrLevel: "A2",
      reason: "Targets a high-value next grammar step after the placement result.",
    },
  ]),
  storageKey: SESSION_CACHE_KEY,
};
