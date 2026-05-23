// src/pages/AiTutor.tsx
// AI Tutor mock UI — static responses, no real provider calls.

import { useState } from "react";

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

export default function AiTutorPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CorrectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useCount, setUseCount] = useState(0);

  // Practice flow
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [practiceFeedback, setPracticeFeedback] = useState<PracticeFeedback | null>(null);
  const [practiceLoading, setPracticeLoading] = useState(false);

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
  };

  const handlePracticeSubmit = async () => {
    if (!practiceAnswer.trim()) return;
    setPracticeLoading(true);
    setPracticeFeedback(null);

    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));

    const mock = MOCK_RESULTS[(useCount - 1 + MOCK_RESULTS.length) % MOCK_RESULTS.length];
    setPracticeFeedback(mock.feedback);
    setPracticeLoading(false);
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

  return (
    <main className="mx-auto min-h-[calc(100vh-72px)] w-full max-w-[640px] px-4 py-6">
      {/* Header */}
      <section className="mb-6 text-center">
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">
            AI Tutor
          </h1>
          <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-black uppercase text-amber-700">
            Mock
          </span>
        </div>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Viết một câu tiếng Anh — AI sẽ sửa lỗi, giải thích, và cho bạn luyện tập thêm.
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Write a sentence — AI corrects it, explains, and gives you follow-up practice.
        </p>
      </section>

      {/* Input area */}
      <section className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-black uppercase text-slate-500">
            Your sentence
          </label>
          <span className="text-[11px] font-medium text-slate-400">
            {charCount} / 500
          </span>
        </div>

        <textarea
          value={input}
          onChange={(e) => {
            if (e.target.value.length <= 500) setInput(e.target.value);
          }}
          placeholder='gõ câu của bạn ở đây, ví dụ: "She go to school every day"'
          rows={4}
          className="w-full resize-none rounded-[14px] border border-slate-200 bg-slate-50 p-4 text-[15px] leading-relaxed text-slate-900 placeholder-slate-400 transition focus:border-indigo-300 focus:bg-white focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              handleSubmit();
            }
          }}
        />

        <div className="mt-3 flex gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isEmpty || loading}
            className="flex-1 rounded-full bg-slate-900 py-3 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
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
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50"
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

      {/* Result */}
      {result && !loading && (
        <section className="mt-5 grid gap-4">
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
                className="mt-3 w-full resize-none rounded-[12px] border border-violet-200 bg-white p-3 text-[14px] leading-relaxed text-slate-900 placeholder-slate-400 transition focus:border-violet-400 focus:outline-none"
              />

              <button
                type="button"
                onClick={handlePracticeSubmit}
                disabled={!practiceAnswer.trim() || practiceLoading}
                className="mt-3 w-full rounded-full bg-violet-700 py-2.5 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:bg-violet-200 disabled:text-violet-400"
              >
                {practiceLoading ? (
                  <span className="inline-flex items-center gap-2">
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
                className="mt-4 w-full rounded-full border border-emerald-300 bg-white py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
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
              className="rounded-full border border-slate-200 bg-white py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Sửa câu khác · Try another sentence
            </button>
          )}
        </section>
      )}

      {/* Footer */}
      <footer className="mt-8 text-center text-[11px] font-medium text-slate-300">
        Mock UI — no real AI provider calls are made.
      </footer>
    </main>
  );
}
