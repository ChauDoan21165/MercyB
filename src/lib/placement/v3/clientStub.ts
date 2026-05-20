import { supabase } from "@/lib/supabaseClient";
import type {
  PlacementV3Cefr,
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
} from "./types";

type BilingualText = { en: string; vi: string };

type OrchestratorPrompt = {
  id: string;
  modality: PlacementV3Modality;
  cefr?: PlacementV3Cefr;
  promptText?: string;
  expectedResponse?: "text" | "audio" | "choice";
  metadata?: Record<string, unknown>;
};

type OrchestratorProgress = {
  current?: number;
  total?: number;
  state?: string;
};

type OrchestratorProfile = {
  session_id?: string;
  computed_at?: string;
  cefr_overall?: PlacementV3Cefr;
  cefr_overall_confidence?: number;
  cefr_per_skill?: Partial<Record<PlacementV3Modality, { level?: PlacementV3Cefr; confidence?: number }>>;
  l1_interference_flags?: Array<{ patternId?: string; id?: string; severity?: string; evidence?: string }>;
  recommended_lessons?: Array<{
    lessonId?: string;
    lessonTitle?: string;
    reason?: string;
    priority?: number;
    category?: string;
    cefrLevel?: string;
  }>;
  strengths?: string[];
  gaps?: string[];
};

type OrchestratorEnvelope = {
  sessionId?: string;
  currentTask?: OrchestratorPrompt | null;
  totalTasks?: number;
  progress?: OrchestratorProgress;
  resumed?: boolean;
  type?: "next_task" | "modality_complete" | "session_complete" | "expired" | "no_session" | "resumed";
  nextModality?: PlacementV3Modality;
  profile?: OrchestratorProfile | null;
  recommendations?: OrchestratorProfile["recommended_lessons"];
  sessionState?: string;
  currentModality?: PlacementV3Modality;
  status?: string;
  error?: string;
  message?: string;
};

const SESSION_CACHE_KEY = "mb.placement.v3.session";
const RESULT_KEY = "mb.placement.v3.results.";

const modalities: PlacementV3Modality[] = [
  "writing",
  "speaking",
  "reading",
  "listening",
  "conversation",
];

const modalityInstruction: Record<PlacementV3Modality, BilingualText> = {
  writing: {
    en: "Write in English. Accuracy matters more than length.",
    vi: "Viết bằng tiếng Anh. Độ chính xác quan trọng hơn độ dài.",
  },
  speaking: {
    en: "Speak naturally, or type your answer if the microphone is unavailable.",
    vi: "Nói tự nhiên, hoặc gõ câu trả lời nếu không dùng được micro.",
  },
  reading: {
    en: "Read the prompt and answer in English.",
    vi: "Đọc đề và trả lời bằng tiếng Anh.",
  },
  listening: {
    en: "Listen, then answer in English.",
    vi: "Nghe rồi trả lời bằng tiếng Anh.",
  },
  conversation: {
    en: "Reply to Mercy naturally in English.",
    vi: "Trả lời Mercy tự nhiên bằng tiếng Anh.",
  },
};

function nowIso() {
  return new Date().toISOString();
}

function expiresIso() {
  return new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();
}

function readCachedSession(): PlacementV3Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_CACHE_KEY);
    return raw ? (JSON.parse(raw) as PlacementV3Session) : null;
  } catch {
    return null;
  }
}

function writeCachedSession(session: PlacementV3Session | null) {
  if (typeof window === "undefined") return;
  if (!session) {
    window.localStorage.removeItem(SESSION_CACHE_KEY);
    return;
  }
  window.localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(session));
}

function bilingual(en: string, vi?: string): BilingualText {
  return { en, vi: vi ?? en };
}

function taskTypeFor(prompt: OrchestratorPrompt): PlacementV3TaskType {
  if (prompt.modality === "reading") return "reading_short";
  if (prompt.modality === "listening") return "listening_short";
  return prompt.modality;
}

function toTask(prompt: OrchestratorPrompt | null | undefined): PlacementV3Task | null {
  if (!prompt) return null;
  const text = prompt.promptText || String(prompt.metadata?.promptText ?? "Answer in English.");
  const task: PlacementV3Task = {
    id: prompt.id,
    modality: prompt.modality,
    type: taskTypeFor(prompt),
    instruction: modalityInstruction[prompt.modality],
    prompt: bilingual(text),
  };
  if (prompt.modality === "conversation") {
    task.mercyTurn = bilingual(text);
    task.prompt = bilingual("Write your reply to Mercy.", "Viết câu trả lời cho Mercy.");
  }
  if (prompt.modality === "listening") {
    task.audioUrl = typeof prompt.metadata?.audioUrl === "string" ? prompt.metadata.audioUrl : undefined;
  }
  return task;
}

function sessionFromEnvelope(
  envelope: OrchestratorEnvelope,
  previous?: PlacementV3Session | null,
): PlacementV3Session {
  const currentTask = toTask(envelope.currentTask);
  const progress = envelope.progress ?? {};
  const sessionId = envelope.sessionId ?? previous?.sessionId ?? envelope.profile?.session_id ?? "";
  const status =
    envelope.type === "expired"
      ? "expired"
      : envelope.type === "session_complete" || envelope.sessionState === "completed"
        ? "completed"
        : envelope.status === "abandoned"
          ? "abandoned"
          : "in_progress";
  const answeredCount = Math.max(0, Number(progress.current ?? previous?.answeredCount ?? 0));
  const estimatedTotal = Math.max(1, Number(progress.total ?? envelope.totalTasks ?? previous?.estimatedTotal ?? 5));
  const modality = currentTask?.modality ?? envelope.currentModality ?? previous?.currentTask?.modality ?? "writing";

  return {
    sessionId,
    status,
    currentTask,
    answeredCount,
    estimatedTotal,
    modalityIndex: Math.max(0, modalities.indexOf(modality)),
    modalities,
    startedAt: previous?.startedAt ?? nowIso(),
    expiresAt: previous?.expiresAt ?? expiresIso(),
  };
}

function asCefr(value: unknown): PlacementV3Cefr {
  return value === "pre_a1" || value === "A1" || value === "A2" || value === "B1" || value === "B2" || value === "C1" || value === "C2"
    ? value
    : "A1";
}

function textSummary(text: string): BilingualText {
  return { en: text, vi: text };
}

function resultsFromProfile(profile: OrchestratorProfile): PlacementV3Results {
  const skills: PlacementV3SkillProfile[] = Object.entries(profile.cefr_per_skill ?? {}).map(([modality, skill]) => ({
    modality: modality as PlacementV3Modality,
    cefr: asCefr(skill?.level),
    confidence: Number(skill?.confidence ?? 0.5),
    summary: textSummary(`${modality} estimate: ${asCefr(skill?.level)}.`),
  }));

  const l1Flags: PlacementV3L1Flag[] = (profile.l1_interference_flags ?? []).map((flag) => {
    const id = String(flag.patternId ?? flag.id ?? "unknown");
    const severity = flag.severity === "high" || flag.severity === "medium" || flag.severity === "low"
      ? flag.severity
      : "low";
    return {
      id,
      severity,
      label: textSummary(id.replace(/[_-]/g, " ")),
      evidence: textSummary(flag.evidence ?? "Detected during placement."),
    };
  });

  const recommendations: PlacementV3Recommendation[] = (profile.recommended_lessons ?? []).map((lesson) => ({
    roomId: String(lesson.lessonId ?? "rooms"),
    title: textSummary(String(lesson.lessonTitle ?? lesson.lessonId ?? "Recommended lesson")),
    description: textSummary(String(lesson.category ?? "Placement recommendation")),
    cefr: asCefr(lesson.cefrLevel),
    reason: textSummary(String(lesson.reason ?? "Matches your placement profile.")),
  }));

  return {
    sessionId: String(profile.session_id ?? ""),
    completedAt: profile.computed_at ?? nowIso(),
    overallCefr: asCefr(profile.cefr_overall),
    overallConfidence: Number(profile.cefr_overall_confidence ?? 0.5),
    overallSummary: textSummary("This profile is based on your placement responses."),
    skills,
    l1Flags,
    recommendations,
    strengths: (profile.strengths ?? []).map(textSummary),
    gaps: (profile.gaps ?? []).map(textSummary),
    questionCount: skills.length || 1,
  };
}

async function callSession(action: string, body: Record<string, unknown> = {}): Promise<OrchestratorEnvelope> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const res = await fetch("/functions/v1/placement-v3-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ action, ...body }),
  });
  const json = (await res.json().catch(() => ({}))) as OrchestratorEnvelope;
  if (!res.ok || json.error) {
    throw new Error(json.message || json.error || `Placement request failed (${res.status})`);
  }
  return json;
}

export async function startSession(): Promise<PlacementV3Session> {
  const envelope = await callSession("start", {
    languagePair: { native: "vi", target: "en" },
    initialLevel: "A2",
  });
  const session = sessionFromEnvelope(envelope);
  writeCachedSession(session);
  return session;
}

export async function submitResponse(
  payload: PlacementV3ResponsePayload,
): Promise<PlacementV3SubmitResult> {
  const previous = readCachedSession();
  const envelope = await callSession("respond", {
    response: {
      sessionId: payload.sessionId,
      taskIndex: previous?.answeredCount ?? 0,
      promptId: payload.taskId,
      responseText: payload.value,
      responseDurationMs: payload.elapsedMs,
    },
  });
  const session = sessionFromEnvelope(envelope, previous);
  writeCachedSession(session);
  if (envelope.type === "session_complete" && envelope.profile) {
    const results = resultsFromProfile({
      ...envelope.profile,
      recommended_lessons: envelope.profile.recommended_lessons ?? envelope.recommendations,
    });
    if (typeof window !== "undefined") {
      window.localStorage.setItem(`${RESULT_KEY}${session.sessionId}`, JSON.stringify(results));
    }
    return { session, completed: true, results };
  }
  return { session, completed: session.status === "completed" };
}

export async function getResults(sessionId: string): Promise<PlacementV3Results> {
  if (typeof window !== "undefined") {
    const raw = window.localStorage.getItem(`${RESULT_KEY}${sessionId}`);
    if (raw) return JSON.parse(raw) as PlacementV3Results;
  }
  const envelope = await callSession("status", { sessionId });
  if (!envelope.profile) throw new Error("Placement results are not ready yet.");
  return resultsFromProfile(envelope.profile);
}

export async function abandonSession(sessionId: string): Promise<{ ok: true }> {
  await callSession("abandon", { sessionId });
  const existing = readCachedSession();
  if (existing?.sessionId === sessionId) writeCachedSession({ ...existing, status: "abandoned" });
  return { ok: true };
}

export async function resumeSession(): Promise<PlacementV3Session | null> {
  const envelope = await callSession("resume");
  if (envelope.type === "no_session") {
    writeCachedSession(null);
    return null;
  }
  const session = sessionFromEnvelope(envelope, readCachedSession());
  writeCachedSession(session);
  return session.status === "in_progress" || session.status === "expired" ? session : null;
}

const sampleTasks: PlacementV3Task[] = [
  {
    id: "sample-writing",
    modality: "writing",
    type: "writing",
    minWords: 25,
    instruction: modalityInstruction.writing,
    prompt: bilingual("Describe your usual weekday and one thing you want to improve this month."),
  },
  {
    id: "sample-speaking",
    modality: "speaking",
    type: "speaking",
    instruction: modalityInstruction.speaking,
    prompt: bilingual("Introduce yourself and explain why you are learning English."),
  },
  {
    id: "sample-reading",
    modality: "reading",
    type: "reading_short",
    instruction: modalityInstruction.reading,
    prompt: bilingual("What does Linh need to do before Wednesday noon?"),
  },
  {
    id: "sample-listening",
    modality: "listening",
    type: "listening_short",
    instruction: modalityInstruction.listening,
    prompt: bilingual("Why will the class start later?"),
  },
  {
    id: "sample-conversation",
    modality: "conversation",
    type: "conversation",
    instruction: modalityInstruction.conversation,
    mercyTurn: bilingual("What kind of job are you aiming for, and what English do you need there?"),
    prompt: bilingual("Write your reply."),
  },
];

function buildSampleResults(sessionId: string): PlacementV3Results {
  return resultsFromProfile({
    session_id: sessionId,
    computed_at: nowIso(),
    cefr_overall: "A2",
    cefr_overall_confidence: 0.76,
    cefr_per_skill: {
      writing: { level: "A2", confidence: 0.78 },
      speaking: { level: "A2", confidence: 0.7 },
      reading: { level: "B1", confidence: 0.82 },
      listening: { level: "A2", confidence: 0.66 },
    },
    l1_interference_flags: [
      { patternId: "final-consonants", severity: "high", evidence: "Likely dropping final sounds." },
    ],
    recommended_lessons: [
      {
        lessonId: "final_consonants_vietnamese_speakers_l1",
        lessonTitle: "Final Consonants for Vietnamese Speakers",
        cefrLevel: "A2",
        category: "pronunciation",
        reason: "Targets the strongest Vietnamese L1 flag from this session.",
      },
    ],
    strengths: ["You communicate personal goals clearly."],
    gaps: ["Final sounds and tense range need focused practice."],
  });
}

export const placementV3StubInternals = {
  tasks: sampleTasks,
  buildResults: buildSampleResults,
  storageKey: SESSION_CACHE_KEY,
};
