import type {
  PlacementV3L1Flag,
  PlacementV3Modality,
  PlacementV3Recommendation,
  PlacementV3ResponsePayload,
  PlacementV3Results,
  PlacementV3Session,
  PlacementV3SkillProfile,
  PlacementV3SubmitResult,
  PlacementV3Task,
} from "./types";

/**
 * Placement v3 orchestrator contract for A28.
 *
 * The UI expects the production client to expose the same async functions
 * below. Functions must be safe for retries, return bilingual copy, and never
 * expose per-task correctness before results. `submitResponse` accepts text
 * for every modality; speaking may additionally include an `audioBlob`.
 *
 * Expected backend behavior:
 * - startSession(): create an in_progress session and return the first task.
 * - submitResponse(payload): persist one response, update adaptive state, and
 *   return the next task or completed results.
 * - getResults(sessionId): return completed multi-skill profile.
 * - abandonSession(sessionId): mark abandoned without writing a level.
 * - resumeSession(): return the most recent in_progress session, or null.
 *
 * This stub intentionally delays 200-800ms so loading and retry states are
 * visible during local UI work. It stores mock sessions in localStorage only.
 */

const STORAGE_KEY = "mb.placement.v3.stub.session";
const RESULT_KEY = "mb.placement.v3.stub.results.";
const DELAY_MIN = 200;
const DELAY_MAX = 800;

const modalities: PlacementV3Modality[] = [
  "writing",
  "speaking",
  "reading",
  "listening",
  "conversation",
];

const tasks: PlacementV3Task[] = [
  {
    id: "write-daily-routine",
    modality: "writing",
    type: "writing",
    minWords: 25,
    instruction: {
      en: "Write 4-6 sentences. Accuracy matters more than length.",
      vi: "Viết 4-6 câu. Độ chính xác quan trọng hơn độ dài.",
    },
    prompt: {
      en: "Describe your usual weekday and one thing you want to improve this month.",
      vi: "Hãy mô tả một ngày thường trong tuần của bạn và một điều bạn muốn cải thiện trong tháng này.",
    },
  },
  {
    id: "speak-introduction",
    modality: "speaking",
    type: "speaking",
    estimatedSeconds: 35,
    instruction: {
      en: "Speak naturally for 30-45 seconds. You can type instead if the microphone is unavailable.",
      vi: "Nói tự nhiên trong 30-45 giây. Nếu không dùng được micro, bạn có thể gõ câu trả lời.",
    },
    prompt: {
      en: "Introduce yourself and explain why you are learning English.",
      vi: "Hãy giới thiệu bản thân và giải thích vì sao bạn học tiếng Anh.",
    },
  },
  {
    id: "read-work-email",
    modality: "reading",
    type: "reading_mcq",
    instruction: {
      en: "Read the passage, then choose the best answer.",
      vi: "Đọc đoạn văn, sau đó chọn đáp án phù hợp nhất.",
    },
    passage: {
      en: "Linh received an email from her manager. The meeting has moved from Tuesday morning to Thursday afternoon because two clients cannot attend earlier. Linh needs to prepare three slides about customer feedback and send them before noon on Wednesday.",
      vi: "Linh nhận được email từ quản lý. Cuộc họp được dời từ sáng thứ Ba sang chiều thứ Năm vì hai khách hàng không thể tham dự sớm hơn. Linh cần chuẩn bị ba slide về phản hồi khách hàng và gửi trước trưa thứ Tư.",
    },
    prompt: {
      en: "What does Linh need to do before Wednesday noon?",
      vi: "Linh cần làm gì trước trưa thứ Tư?",
    },
    options: [
      { id: "a", label: { en: "Call both clients", vi: "Gọi cho cả hai khách hàng" } },
      { id: "b", label: { en: "Send three feedback slides", vi: "Gửi ba slide về phản hồi" } },
      { id: "c", label: { en: "Move the meeting again", vi: "Dời cuộc họp lần nữa" } },
      { id: "d", label: { en: "Attend on Tuesday morning", vi: "Tham dự vào sáng thứ Ba" } },
    ],
  },
  {
    id: "listen-announcement",
    modality: "listening",
    type: "listening_mcq",
    audioUrl: "/audio/placement/listening-sample.mp3",
    instruction: {
      en: "Listen once or twice, then answer.",
      vi: "Nghe một hoặc hai lần, sau đó trả lời.",
    },
    prompt: {
      en: "The recording says the class will start later because...",
      vi: "Đoạn nghe nói lớp học bắt đầu muộn hơn vì...",
    },
    options: [
      { id: "a", label: { en: "the teacher is sick", vi: "giáo viên bị ốm" } },
      { id: "b", label: { en: "the room is being cleaned", vi: "phòng học đang được dọn" } },
      { id: "c", label: { en: "the bus is delayed", vi: "xe buýt bị trễ" } },
      { id: "d", label: { en: "there is a test today", vi: "hôm nay có bài kiểm tra" } },
    ],
  },
  {
    id: "conversation-mercy",
    modality: "conversation",
    type: "conversation",
    instruction: {
      en: "Reply to Mercy as if this were a real short conversation.",
      vi: "Trả lời Mercy như trong một đoạn hội thoại ngắn thật.",
    },
    mercyTurn: {
      en: "You said you want a better job. What kind of job are you aiming for, and what English do you need there?",
      vi: "Bạn nói muốn có công việc tốt hơn. Bạn đang hướng tới công việc nào, và cần tiếng Anh kiểu gì trong công việc đó?",
    },
    prompt: {
      en: "Write your reply.",
      vi: "Viết câu trả lời của bạn.",
    },
  },
];

function delay(): Promise<void> {
  const ms = DELAY_MIN + Math.floor(Math.random() * (DELAY_MAX - DELAY_MIN));
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function nowIso() {
  return new Date().toISOString();
}

function expiresIso() {
  return new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();
}

function readStoredSession(): PlacementV3Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PlacementV3Session) : null;
  } catch {
    return null;
  }
}

function writeSession(session: PlacementV3Session | null) {
  if (typeof window === "undefined") return;
  if (!session) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function buildSession(answeredCount = 0): PlacementV3Session {
  const currentTask = tasks[answeredCount] ?? null;
  const modalityIndex = currentTask
    ? modalities.indexOf(currentTask.modality)
    : modalities.length - 1;
  return {
    sessionId: `stub_${Date.now().toString(36)}`,
    status: currentTask ? "in_progress" : "completed",
    currentTask,
    answeredCount,
    estimatedTotal: tasks.length,
    modalityIndex: Math.max(0, modalityIndex),
    modalities,
    startedAt: nowIso(),
    expiresAt: expiresIso(),
  };
}

const skills: PlacementV3SkillProfile[] = [
  {
    modality: "writing",
    cefr: "A2",
    confidence: 0.78,
    summary: {
      en: "Clear everyday ideas, with tense control still developing.",
      vi: "Diễn đạt ý hằng ngày khá rõ, nhưng kiểm soát thì vẫn cần luyện thêm.",
    },
  },
  {
    modality: "speaking",
    cefr: "A2",
    confidence: 0.7,
    summary: {
      en: "Understandable short answers; final consonants need attention.",
      vi: "Câu trả lời ngắn dễ hiểu; cần chú ý âm cuối.",
    },
  },
  {
    modality: "reading",
    cefr: "B1",
    confidence: 0.82,
    summary: {
      en: "Good grasp of workplace messages and time details.",
      vi: "Nắm khá tốt thông báo công việc và chi tiết thời gian.",
    },
  },
  {
    modality: "listening",
    cefr: "A2",
    confidence: 0.66,
    summary: {
      en: "Main ideas are present; fast details are less stable.",
      vi: "Bắt được ý chính; chi tiết nói nhanh chưa ổn định.",
    },
  },
];

const l1Flags: PlacementV3L1Flag[] = [
  {
    id: "final-consonants",
    severity: "high",
    label: { en: "Final consonants", vi: "Âm cuối" },
    evidence: {
      en: "Likely dropping /t/, /d/, or /s/ endings in speech and grammar.",
      vi: "Có dấu hiệu bỏ /t/, /d/ hoặc /s/ ở cuối từ khi nói và viết.",
    },
  },
  {
    id: "article-choice",
    severity: "medium",
    label: { en: "Articles: a, an, the", vi: "Mạo từ: a, an, the" },
    evidence: {
      en: "Uses nouns clearly, but article choice is inconsistent.",
      vi: "Dùng danh từ rõ nghĩa, nhưng chọn mạo từ chưa đều.",
    },
  },
];

const recommendations: PlacementV3Recommendation[] = [
  {
    roomId: "present_perfect_experiences_l1",
    cefr: "A2",
    title: {
      en: "Present Perfect — Experiences",
      vi: "Thì hiện tại hoàn thành — trải nghiệm",
    },
    description: {
      en: "Say what you have done and where you have been with have/has + past participle.",
      vi: "Nói những gì bạn đã làm và nơi bạn đã từng đến với have/has + phân từ II.",
    },
    reason: {
      en: "Best next step for tense range after your writing answer.",
      vi: "Bước tiếp theo phù hợp để mở rộng cách dùng thì sau phần viết.",
    },
  },
  {
    roomId: "final_consonants_vietnamese_speakers_l1",
    cefr: "A2",
    title: { en: "Final Consonants for Vietnamese Speakers", vi: "Âm cuối cho người Việt" },
    description: {
      en: "Practice the endings that change meaning in work and exam English.",
      vi: "Luyện các âm cuối làm thay đổi nghĩa trong tiếng Anh công việc và bài thi.",
    },
    reason: {
      en: "Targets the strongest Vietnamese L1 flag from this session.",
      vi: "Đánh thẳng vào dấu hiệu ảnh hưởng tiếng Việt rõ nhất trong bài này.",
    },
  },
  {
    roomId: "work_email_time_changes_l1",
    cefr: "B1",
    title: { en: "Work Emails — Schedule Changes", vi: "Email công việc — đổi lịch" },
    description: {
      en: "Read and write short messages about meetings, deadlines, and changes.",
      vi: "Đọc và viết tin nhắn ngắn về cuộc họp, hạn chót và thay đổi.",
    },
    reason: {
      en: "Builds on your reading strength with useful workplace English.",
      vi: "Tận dụng điểm mạnh đọc hiểu của bạn bằng tiếng Anh công việc thực tế.",
    },
  },
];

function buildResults(sessionId: string): PlacementV3Results {
  return {
    sessionId,
    completedAt: nowIso(),
    overallCefr: "A2",
    overallConfidence: 0.76,
    overallSummary: {
      en: "You can handle everyday English and short workplace messages. Your next gains will come from verb range, final sounds, and listening details.",
      vi: "Bạn xử lý được tiếng Anh hằng ngày và thông báo công việc ngắn. Tiến bộ tiếp theo sẽ đến từ mở rộng thì, luyện âm cuối và nghe chi tiết.",
    },
    skills,
    l1Flags,
    recommendations,
    strengths: [
      {
        en: "You understood the main point of practical reading tasks.",
        vi: "Bạn hiểu được ý chính trong bài đọc thực tế.",
      },
      {
        en: "Your writing communicates personal goals clearly.",
        vi: "Phần viết diễn đạt mục tiêu cá nhân khá rõ.",
      },
    ],
    gaps: [
      {
        en: "Tense range is still narrow when explaining experience.",
        vi: "Cách dùng thì còn hẹp khi kể về trải nghiệm.",
      },
      {
        en: "Listening details need slower, repeated practice before exam speed.",
        vi: "Chi tiết nghe cần luyện chậm và lặp lại trước khi lên tốc độ bài thi.",
      },
    ],
    questionCount: tasks.length,
  };
}

export async function startSession(): Promise<PlacementV3Session> {
  await delay();
  const session = buildSession(0);
  writeSession(session);
  return session;
}

export async function submitResponse(
  payload: PlacementV3ResponsePayload,
): Promise<PlacementV3SubmitResult> {
  await delay();
  if (payload.value.toLowerCase().includes("__network_fail_once__")) {
    throw new Error("Simulated placement network failure");
  }
  const existing = readStoredSession() ?? buildSession(0);
  if (new Date(existing.expiresAt).getTime() < Date.now()) {
    const expired = { ...existing, status: "expired" as const };
    writeSession(expired);
    return { session: expired, completed: false };
  }
  const nextAnswered = Math.min(tasks.length, existing.answeredCount + 1);
  const session = {
    ...existing,
    answeredCount: nextAnswered,
    currentTask: tasks[nextAnswered] ?? null,
    modalityIndex: tasks[nextAnswered]
      ? modalities.indexOf(tasks[nextAnswered].modality)
      : modalities.length - 1,
    status: nextAnswered >= tasks.length ? "completed" as const : "in_progress" as const,
  };
  writeSession(session);
  if (session.status === "completed") {
    const results = buildResults(session.sessionId);
    window.localStorage.setItem(`${RESULT_KEY}${session.sessionId}`, JSON.stringify(results));
    return { session, completed: true, results };
  }
  return { session, completed: false };
}

export async function getResults(sessionId: string): Promise<PlacementV3Results> {
  await delay();
  if (typeof window !== "undefined") {
    const raw = window.localStorage.getItem(`${RESULT_KEY}${sessionId}`);
    if (raw) return JSON.parse(raw) as PlacementV3Results;
  }
  return buildResults(sessionId);
}

export async function abandonSession(sessionId: string): Promise<{ ok: true }> {
  await delay();
  const existing = readStoredSession();
  if (existing?.sessionId === sessionId) {
    writeSession({ ...existing, status: "abandoned" });
  }
  return { ok: true };
}

export async function resumeSession(): Promise<PlacementV3Session | null> {
  await delay();
  const existing = readStoredSession();
  if (!existing || existing.status !== "in_progress") return null;
  if (new Date(existing.expiresAt).getTime() < Date.now()) {
    const expired = { ...existing, status: "expired" as const };
    writeSession(expired);
    return expired;
  }
  return existing;
}

export const placementV3StubInternals = {
  tasks,
  buildResults,
  storageKey: STORAGE_KEY,
};
