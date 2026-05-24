// src/pages/AiTutor.tsx
// AI Tutor mock UI — static responses, no real provider calls.
// M3: Safe aggregate reminder card using IndexedDB getMemorySummary.

import { Mic, MicOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import {
  putCorrection,
  markPracticed,
  getMemorySummary,
} from "@/lib/ai-tutor/learningMemory";
import type { MemorySummary } from "@/lib/ai-tutor/learningMemory";

type CorrectionResult = {
  corrected: string;
  explanation: string;
  grammarTip: string;
  practicePrompt: string;
};

type PracticeFeedback = {
  encouragement: string;
  tip: string;
  nextStep: string;
};

type TutorTarget = "en" | "fr" | "zh";

type TutorTargetCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  helper: string;
  placeholder: string;
  label: string;
  voiceLabel: string;
  voiceFallback: string;
  inputLabel: string;
};

const TARGET_COPY: Record<TutorTarget, TutorTargetCopy> = {
  en: {
    eyebrow: "New AI Tutor",
    title: "Teacher Mercy AI Tutor",
    subtitle: "Sửa câu tiếng Anh bằng AI thật, ghi nhớ lỗi hay gặp, rồi luyện lại với Mercy.",
    helper: "Write a sentence — AI corrects it, explains it, and gives follow-up practice.",
    placeholder: 'gõ câu của bạn ở đây, ví dụ: "She go to school every day"',
    label: "English correction",
    voiceLabel: "Speak sentence",
    voiceFallback: "Microphone unavailable in this browser",
    inputLabel: "Your sentence",
  },
  fr: {
    eyebrow: "AI Tutor tiếng Pháp",
    title: "Teacher Mercy · French Tutor",
    subtitle: "Luyện tiếng Pháp với Mercy: sửa câu, giải thích lỗi, và ôn lại điểm cần nhớ.",
    helper: "Pratique le français avec Mercy — correction, explication, et révision.",
    placeholder: 'gõ câu tiếng Pháp của bạn ở đây, ví dụ: "Je suis aller au marché"',
    label: "French practice",
    voiceLabel: "Speak French",
    voiceFallback: "Microphone unavailable for French practice",
    inputLabel: "Your French sentence",
  },
  zh: {
    eyebrow: "AI Tutor tiếng Trung",
    title: "Teacher Mercy · Chinese Tutor",
    subtitle: "Luyện tiếng Trung với Mercy: sửa câu, giải thích lỗi, và ôn lại điểm cần nhớ.",
    helper: "练习中文 — Mercy helps correct, explain, and review your sentence.",
    placeholder: 'gõ câu tiếng Trung của bạn ở đây, ví dụ: "我昨天去商店"',
    label: "Chinese practice",
    voiceLabel: "Speak Chinese",
    voiceFallback: "Microphone unavailable for Chinese practice",
    inputLabel: "Your Chinese sentence",
  },
};

const MOCK_RESULTS: Array<CorrectionResult & { feedback: PracticeFeedback }> = [
  {
    corrected: "She goes to school every day.",
    explanation:
      "Third-person singular subjects (she / he / it) need the verb with -s or -es in the present simple.",
    grammarTip:
      "Quy tắc: Chủ ngữ ngôi thứ ba số ít → động từ thêm -s/-es.",
    practicePrompt: "Viết một câu về thói quen hằng ngày của bạn dùng thì hiện tại đơn.",
    feedback: {
      encouragement: "Tốt lắm! Bạn đã thực hành thì hiện tại đơn. 🎯",
      tip: "Nhớ thêm -s/-es cho động từ khi chủ ngữ là she / he / it nhé.",
      nextStep: "Thử viết thêm một câu khác về người thân của bạn.",
    },
  },
  {
    corrected: "I have been learning English for two years.",
    explanation:
      "Use the present perfect continuous (have been + -ing) for actions that started in the past and continue now.",
    grammarTip:
      "Dùng have been + V-ing khi hành động bắt đầu trong quá khứ và vẫn đang tiếp diễn.",
    practicePrompt: "Bạn đã làm gì từ sáng đến giờ? Viết một câu dùng thì hiện tại hoàn thành tiếp diễn.",
    feedback: {
      encouragement: "Rất đúng! Bạn đã dùng đúng cấu trúc have been + V-ing. ⭐",
      tip: "Dùng 'since' cho mốc thời gian cụ thể, 'for' cho khoảng thời gian.",
      nextStep: "Thử đặt câu với 'for' thay vì 'since'.",
    },
  },
  {
    corrected: "If I were you, I would practice every day.",
    explanation:
      "The second conditional uses 'if + past simple' and 'would + base verb' for hypothetical situations.",
    grammarTip:
      "Câu điều kiện loại 2: If + quá khứ đơn, would + động từ nguyên mẫu.",
    practicePrompt: "Nếu bạn có nhiều thời gian hơn, bạn sẽ làm gì? Viết một câu điều kiện loại 2.",
    feedback: {
      encouragement: "Chính xác! Câu điều kiện của bạn rất tự nhiên. 👏",
      tip: "Nhớ: mệnh đề If dùng quá khứ đơn, mệnh đề chính dùng would + V.",
      nextStep: "Thử đảo hai mệnh đề: 'I would... if I...'",
    },
  },
];

const MOCK_DELAY_MS = 600;
const TEACHER_MERCY_AVATAR_SRC = "/teacher-mercy.webp";

function getTutorTargetFromSearch(search: string): TutorTarget {
  const value = new URLSearchParams(search).get("target")?.toLowerCase();
  if (value === "fr" || value === "french") return "fr";
  if (value === "zh" || value === "chinese" || value === "cn") return "zh";
  return "en";
}

function hasSpeechRecognitionSupport() {
  if (typeof window === "undefined") return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export default function AiTutorPage() {
  const shellRef = useRef<HTMLElement | null>(null);

  // ── Display name / greeting ─────────────────────────────────────
  const { user } = useAuth();
  const nickname: string | undefined =
    (user?.user_metadata as Record<string, unknown> | undefined)?.nickname as string | undefined;
  const greetingName = (nickname ?? "").trim() || undefined;

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CorrectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useCount, setUseCount] = useState(0);

  // Practice flow
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [practiceFeedback, setPracticeFeedback] = useState<PracticeFeedback | null>(null);
  const [practiceLoading, setPracticeLoading] = useState(false);

  // ── M3: Learning memory ──────────────────────────────────────────
  const [memoryLoaded, setMemoryLoaded] = useState(false);
  const [memory, setMemory] = useState<MemorySummary | null>(null);
  const [lastSavedId, setLastSavedId] = useState<string | null>(null);
  const [isFloatingShell, setIsFloatingShell] = useState(true);
  const [target, setTarget] = useState<TutorTarget>(() =>
    typeof window === "undefined" ? "en" : getTutorTargetFromSearch(window.location.search),
  );
  const [speechSupported, setSpeechSupported] = useState(hasSpeechRecognitionSupport);

  const targetCopy = TARGET_COPY[target];

  const loadMemory = async () => {
    try {
      setMemory(await getMemorySummary());
    } catch {
      // IndexedDB unavailable — degrade silently
    }
    setMemoryLoaded(true);
  };

  useEffect(() => { loadMemory(); }, []);

  useEffect(() => {
    const syncTarget = () => setTarget(getTutorTargetFromSearch(window.location.search));
    syncTarget();
    window.addEventListener("popstate", syncTarget);
    return () => window.removeEventListener("popstate", syncTarget);
  }, []);

  useEffect(() => {
    setSpeechSupported(hasSpeechRecognitionSupport());
  }, []);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return undefined;

    const detectLayoutMode = () => {
      const shellWidth = shell.getBoundingClientRect().width;
      const explicitFloatingShell = Boolean(
        shell.parentElement?.closest(
          [
            "[data-floating-shell]",
            "[data-ai-tutor-floating-shell]",
            "[data-mercy-floating-shell]",
            ".ai-tutor-floating-shell",
            ".mercy-floating-shell",
          ].join(","),
        ),
      );

      setIsFloatingShell(explicitFloatingShell || shellWidth < 1040);
    };

    detectLayoutMode();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", detectLayoutMode);
      return () => window.removeEventListener("resize", detectLayoutMode);
    }

    const observer = new ResizeObserver(detectLayoutMode);
    observer.observe(shell);

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setError(null);
    setLoading(true);
    setResult(null);
    setPracticeAnswer("");
    setPracticeFeedback(null);

    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));

    const next = MOCK_RESULTS[useCount % MOCK_RESULTS.length];
    setResult({
      corrected: next.corrected,
      explanation: next.explanation,
      grammarTip: next.grammarTip,
      practicePrompt: next.practicePrompt,
    });
    setUseCount((n) => n + 1);
    setLoading(false);

    // M3: Save correction to IndexedDB
    const id = `corr-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    setLastSavedId(id);
    putCorrection({
      id,
      original: trimmed,
      corrected: next.corrected,
      topic: next.grammarTip.slice(0, 60),
      cefr: "B1",
      createdAt: Date.now(),
      practiced: false,
    }).then(() => loadMemory()).catch(() => {});
  };

  const handlePracticeSubmit = async () => {
    if (!practiceAnswer.trim()) return;
    setPracticeLoading(true);
    setPracticeFeedback(null);

    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));

    const mock = MOCK_RESULTS[(useCount - 1 + MOCK_RESULTS.length) % MOCK_RESULTS.length];
    setPracticeFeedback(mock.feedback);
    setPracticeLoading(false);

    // M3: Mark last saved correction as practiced
    if (lastSavedId) {
      markPracticed(lastSavedId).then(() => loadMemory()).catch(() => {});
    }
  };

  const handleClear = () => {
    setInput("");
    setResult(null);
    setError(null);
    setPracticeAnswer("");
    setPracticeFeedback(null);
  };

  const charCount = input.length;
  const isEmpty = !input.trim();
  const hasResult = Boolean(result && !loading);

  return (
    <main
      ref={shellRef}
      data-testid="ai-tutor-shell"
      data-floating-shell={isFloatingShell ? "true" : "false"}
      className="ai-tutor-shell mx-auto min-h-[calc(100vh-72px)] w-full max-w-full px-4 py-6 sm:px-6 lg:px-8"
    >
      <style>{`
        .ai-tutor-shell {
          container-type: inline-size;
          padding-left: 0.75rem;
          padding-right: 0.75rem;
        }
        @media (min-width: 640px) {
          .ai-tutor-shell {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
        .ai-tutor-result-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 1.25rem;
          width: 100%;
          max-width: 100%;
          min-width: 0;
        }
        @container (min-width: 1040px) {
          .ai-tutor-shell[data-floating-shell="false"] .ai-tutor-result-layout[data-expanded="true"] {
            grid-template-columns: minmax(320px, 420px) minmax(0, 1fr);
            align-items: start;
          }
        }
        .ai-tutor-shell[data-floating-shell="true"] .ai-tutor-result-layout[data-expanded="true"] {
          grid-template-columns: minmax(0, 1fr);
        }
        .ai-tutor-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .ai-tutor-copy {
          overflow-wrap: break-word;
          word-break: normal;
        }
        .ai-tutor-memory-card {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow: hidden;
        }
        .ai-tutor-memory-pill-list {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 0.5rem;
        }
        .ai-tutor-memory-pill {
          min-width: 0;
          max-width: 100%;
          white-space: normal;
          overflow-wrap: break-word;
        }
        @container (min-width: 560px) {
          .ai-tutor-memory-pill-list {
            display: flex;
            flex-wrap: wrap;
          }
        }
        @container (max-width: 360px) {
          .ai-tutor-shell-title {
            font-size: 1.5rem;
            line-height: 2rem;
          }
          .ai-tutor-shell-copy {
            font-size: 0.8125rem;
            line-height: 1.25rem;
          }
        }
      `}</style>
      {/* Header */}
      <section className="mx-auto mb-6 w-full max-w-3xl text-center" data-testid="ai-tutor-header">
        <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full border border-indigo-100 bg-white p-1 shadow-sm sm:h-32 sm:w-32">
          <img
            src={TEACHER_MERCY_AVATAR_SRC}
            alt="Teacher Mercy"
            className="h-full w-full rounded-full object-cover"
            data-testid="ai-tutor-mercy-avatar"
          />
        </div>
        {/* Greeting — uses nickname, never email */}
        <div className="mb-3 text-sm font-bold text-slate-600" data-testid="ai-tutor-greeting">
          {greetingName ? (
            <>
              Chào {greetingName} · Hi {greetingName}
            </>
          ) : (
            <>
              Chào bạn · Hi there
            </>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <h1 className="ai-tutor-shell-title text-2xl font-black text-slate-950 sm:text-3xl">
            {targetCopy.title}
          </h1>
          <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-black uppercase text-indigo-700">
            {targetCopy.eyebrow}
          </span>
          <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-black uppercase text-amber-700">
            Mock
          </span>
        </div>
        <p className="ai-tutor-copy ai-tutor-shell-copy mt-2 text-sm font-medium text-slate-500">
          {targetCopy.subtitle}
        </p>
        <p className="ai-tutor-copy mt-1 text-xs text-slate-400">
          {targetCopy.helper}
        </p>
      </section>

      {/* ── M3: Aggregate memory reminder card ──────────────────── */}
      {memoryLoaded && memory && memory.totalCorrections > 0 && (
        <section
          data-testid="ai-tutor-memory-card"
          className="ai-tutor-memory-card mx-auto mb-5 rounded-[16px] border border-indigo-100 bg-white p-4 shadow-sm"
        >
          <div className="text-xs font-black uppercase text-indigo-500">
            Học tập gần đây · Recent Learning
          </div>
          <div className="ai-tutor-memory-pill-list mt-1.5 text-xs">
            <span className="ai-tutor-copy ai-tutor-memory-pill font-bold text-slate-700">
              {memory.totalCorrections} câu đã sửa
            </span>
            <span className="ai-tutor-copy ai-tutor-memory-pill font-medium text-slate-500">
              {memory.practicedCount} đã luyện tập
            </span>
          </div>
          <div className="ai-tutor-memory-pill-list mt-2 text-[11px]">
            {memory.strongestTopic && (
              <span className="ai-tutor-memory-pill rounded-full bg-emerald-50 px-2.5 py-1 font-bold text-emerald-700">
                Mạnh nhất: {memory.strongestTopic}
              </span>
            )}
            {memory.topicNeedingReview && (
              <span className="ai-tutor-memory-pill rounded-full bg-amber-50 px-2.5 py-1 font-bold text-amber-700">
                Cần ôn: {memory.topicNeedingReview}
              </span>
            )}
            {memory.lastPracticedTopic && (
              <span className="ai-tutor-memory-pill rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
                Gần nhất: {memory.lastPracticedTopic}
              </span>
            )}
          </div>
          {memory.suggestedNextFocus && (
            <div className="ai-tutor-copy mt-2 text-xs font-medium text-indigo-600">
              Gợi ý tiếp theo: {memory.suggestedNextFocus}
            </div>
          )}
        </section>
      )}

      {/* ── M3: Empty memory state ────────────────────────────────── */}
      {memoryLoaded && memory && memory.totalCorrections === 0 && (
        <section
          data-testid="ai-tutor-memory-empty"
          className="mx-auto mb-5 w-full max-w-[720px] rounded-[16px] border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center"
        >
          <div className="text-xs font-medium text-slate-400">
            Chưa có lịch sử sửa câu. Gửi câu đầu tiên để bắt đầu!
          </div>
        </section>
      )}

      <div
        data-testid="ai-tutor-layout"
        data-expanded={hasResult ? "true" : "false"}
        className={`ai-tutor-result-layout ${hasResult ? "" : "mx-auto max-w-[720px]"}`}
      >
        <div className="min-w-0">
          {/* Input area */}
          <section className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="text-xs font-black uppercase text-slate-500">
                {targetCopy.inputLabel}
              </label>
              <span className="shrink-0 text-[11px] font-medium text-slate-400">
                {charCount} / 500
              </span>
            </div>

            <textarea
              value={input}
              onChange={(e) => {
                if (e.target.value.length <= 500) setInput(e.target.value);
              }}
              placeholder={targetCopy.placeholder}
              rows={4}
              className="w-full min-w-0 resize-none rounded-[14px] border border-slate-200 bg-slate-50 p-4 text-[15px] leading-relaxed text-slate-900 placeholder-slate-400 transition focus:border-indigo-300 focus:bg-white focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleSubmit();
                }
              }}
            />

            <div className="ai-tutor-actions mt-3">
              {speechSupported ? (
                <button
                  type="button"
                  className="min-h-[44px] w-full rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-black text-indigo-700 transition hover:bg-indigo-100"
                  aria-label={targetCopy.voiceLabel}
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <Mic className="h-4 w-4" aria-hidden />
                    {targetCopy.voiceLabel}
                  </span>
                </button>
              ) : (
                <div
                  role="status"
                  className="min-h-[44px] w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-center text-xs font-bold text-slate-500"
                  data-testid="ai-tutor-mic-fallback"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <MicOff className="h-4 w-4" aria-hidden />
                    {targetCopy.voiceFallback}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isEmpty || loading}
                className="min-h-[48px] w-full flex-1 rounded-full bg-slate-900 px-4 py-3 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                {loading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Đang sửa...
                  </span>
                ) : (
                  "Sửa câu này · Correct my sentence"
                )}
              </button>

              {result && !loading && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="min-h-[48px] w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50"
                >
                  Làm mới
                </button>
              )}
            </div>
          </section>

          {/* Error state */}
          {error && (
            <section className="mt-4 rounded-[16px] border border-rose-200 bg-rose-50 p-5">
              <div className="text-sm font-black text-rose-700">Lỗi · Error</div>
              <p className="mt-1 text-sm font-medium text-rose-600">{error}</p>
            </section>
          )}

          {/* Empty state */}
          {!result && !loading && !error && (
            <section className="mt-5 rounded-[18px] border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
              <div className="text-3xl">✨</div>
              <div className="mt-2 text-sm font-black text-slate-600">
                AI sẵn sàng sửa câu của bạn
              </div>
              <div className="mt-1 text-xs font-medium text-slate-400">
                Gõ một câu tiếng Anh bên trên và nhấn Sửa câu này.
              </div>
            </section>
          )}

          {/* Loading state */}
          {loading && (
            <section className="mt-4 rounded-[16px] border border-indigo-100 bg-indigo-50/60 p-6 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-200 border-t-indigo-500" />
              <div className="mt-3 text-sm font-black text-indigo-700">
                AI đang phân tích câu của bạn...
              </div>
              <div className="mt-1 text-xs font-medium text-indigo-400">
                Analyzing your sentence...
              </div>
            </section>
          )}
        </div>

        {/* Result */}
        {result && !loading && (
          <section className="grid min-w-0 gap-4">
            {/* Corrected */}
            <div className="rounded-[18px] border border-emerald-200 bg-emerald-50 p-5">
              <div className="mb-2 text-xs font-black uppercase text-emerald-600">
                Câu đã sửa · Corrected
              </div>
              <div className="text-xl font-black leading-snug text-emerald-900">
                {result.corrected}
              </div>
            </div>

            {/* Explanation */}
            <div className="rounded-[16px] border border-slate-200 bg-white p-5">
              <div className="mb-2 text-xs font-black uppercase text-slate-500">
                Giải thích · Explanation
              </div>
              <p className="text-sm font-semibold leading-6 text-slate-700">
                {result.explanation}
              </p>
            </div>

            {/* Grammar tip */}
            <div className="rounded-[16px] border border-indigo-100 bg-indigo-50/50 p-5">
              <div className="mb-2 text-xs font-black uppercase text-indigo-500">
                Mẹo ngữ pháp · Grammar Tip
              </div>
              <p className="text-sm font-semibold leading-6 text-indigo-800">
                {result.grammarTip}
              </p>
            </div>

            {/* Practice section */}
            {!practiceFeedback && (
              <div className="rounded-[18px] border border-violet-200 bg-violet-50/50 p-5">
                <div className="mb-2 text-xs font-black uppercase text-violet-600">
                  Luyện tập · Practice
                </div>
                <p className="text-sm font-semibold leading-6 text-slate-700">
                  {result.practicePrompt}
                </p>

                <textarea
                  value={practiceAnswer}
                  onChange={(e) => setPracticeAnswer(e.target.value)}
                  placeholder="Viết câu trả lời của bạn ở đây..."
                  rows={3}
                  className="mt-3 w-full min-w-0 resize-none rounded-[12px] border border-violet-200 bg-white p-3 text-[14px] leading-relaxed text-slate-900 placeholder-slate-400 transition focus:border-violet-400 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={handlePracticeSubmit}
                  disabled={!practiceAnswer.trim() || practiceLoading}
                  className="mt-3 min-h-[44px] w-full rounded-full bg-violet-700 px-4 py-2.5 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:bg-violet-200 disabled:text-violet-400"
                >
                  {practiceLoading ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Đang kiểm tra...
                    </span>
                  ) : (
                    "Gửi câu trả lời · Submit answer"
                  )}
                </button>
              </div>
            )}

            {/* Practice feedback */}
            {practiceFeedback && (
              <div className="rounded-[18px] border border-emerald-200 bg-emerald-50 p-5">
                <div className="mb-2 text-xs font-black uppercase text-emerald-600">
                  Nhận xét · Feedback
                </div>
                <p className="text-sm font-bold leading-6 text-emerald-800">
                  {practiceFeedback.encouragement}
                </p>
                <div className="mt-3 rounded-[12px] bg-white/70 p-3">
                  <div className="text-xs font-black uppercase text-slate-500">Mẹo · Tip</div>
                  <p className="mt-1 text-sm font-medium leading-6 text-slate-700">{practiceFeedback.tip}</p>
                </div>
                <div className="mt-3 rounded-[12px] bg-white/70 p-3">
                  <div className="text-xs font-black uppercase text-slate-500">Bước tiếp theo · Next Step</div>
                  <p className="mt-1 text-sm font-medium leading-6 text-slate-700">{practiceFeedback.nextStep}</p>
                </div>

                <button
                  type="button"
                  onClick={handleClear}
                  className="mt-4 min-h-[48px] w-full rounded-full border border-emerald-300 bg-white px-4 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
                >
                  Sửa câu khác · Try another sentence
                </button>
              </div>
            )}

            {/* Try another (when practice not yet submitted) */}
            {!practiceFeedback && (
              <button
                type="button"
                onClick={handleClear}
                className="min-h-[48px] rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                Sửa câu khác · Try another sentence
              </button>
            )}
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-[11px] font-medium text-slate-300">
        Mock UI — no real AI provider calls are made.
      </footer>
    </main>
  );
}
