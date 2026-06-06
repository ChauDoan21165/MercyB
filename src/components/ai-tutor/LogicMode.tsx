import { useEffect, useMemo, useState } from "react";
import {
  VIETLISH_CURATED_PATTERNS,
  buildLongTailLogicFallback,
  findCuratedLogicPattern,
  type VietlishCuratedPattern,
} from "@/lib/tutor/vietlishCuratedLogic";

type Props = {
  latestCorrectedSentence: string | null;
  latestSourceSentence?: string | null;
  boardResetCount?: number;
};

type LogicExplanation = Omit<VietlishCuratedPattern, "id" | "match"> & {
  id?: string;
  match?: RegExp;
};

export default function LogicMode({ latestCorrectedSentence, latestSourceSentence = null, boardResetCount = 0 }: Props) {
  const [selectedId, setSelectedId] = useState(VIETLISH_CURATED_PATTERNS[0]?.id ?? "");
  const [freeText, setFreeText] = useState("");
  const [fallbackSentence, setFallbackSentence] = useState("");
  const [manualPatternRequested, setManualPatternRequested] = useState(false);
  const selectedPattern = useMemo(
    () => VIETLISH_CURATED_PATTERNS.find((pattern) => pattern.id === selectedId) ?? VIETLISH_CURATED_PATTERNS[0],
    [selectedId],
  );
  const fallback = fallbackSentence ? buildLongTailLogicFallback(fallbackSentence) : null;
  const currentSentence = latestSourceSentence?.trim() || latestCorrectedSentence?.trim() || "";
  const currentPattern = useMemo(
    () => {
      const sourcePattern = latestSourceSentence?.trim()
        ? findCuratedLogicPattern(latestSourceSentence)
        : null;
      if (sourcePattern) return sourcePattern;
      return latestCorrectedSentence?.trim()
        ? findCuratedLogicPattern(latestCorrectedSentence)
        : null;
    },
    [latestCorrectedSentence, latestSourceSentence],
  );
  const currentFallback = currentSentence && !currentPattern
    ? buildLongTailLogicFallback(currentSentence)
    : null;
  const activeExplanation: LogicExplanation | null =
    currentPattern ?? currentFallback ?? (boardResetCount > 0 && !manualPatternRequested ? null : selectedPattern) ?? null;

  useEffect(() => {
    setFreeText("");
    setFallbackSentence("");
    setManualPatternRequested(false);
  }, [currentSentence]);

  const handleExplainFreeText = () => {
    const trimmed = freeText.trim();
    if (!trimmed) return;
    const curated = findCuratedLogicPattern(trimmed);
    if (curated) {
      setManualPatternRequested(true);
      setSelectedId(curated.id);
      setFallbackSentence("");
      return;
    }
    setFallbackSentence(trimmed);
  };

  return (
    <section
      className="mx-auto w-full max-w-3xl rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm"
      data-testid="ai-tutor-logic-mode"
    >
      <div className="text-xs font-black uppercase text-indigo-600">
        Logic
      </div>
      <h2 className="mt-1 text-xl font-black text-slate-900">
        Hiểu vì sao tiếng Anh nói vậy
      </h2>

      {currentSentence ? (
        <div
          className="mt-4 rounded-[14px] border border-emerald-100 bg-emerald-50 px-4 py-3"
          data-testid="ai-tutor-logic-current-board"
        >
          {latestSourceSentence && (
            <>
              <div className="text-xs font-black uppercase text-slate-500">
                Câu người học hiện tại
              </div>
              <p className="mt-1 text-sm font-bold leading-6 text-slate-800">
                {latestSourceSentence}
              </p>
            </>
          )}
          <div className="text-xs font-black uppercase text-emerald-700">
            Câu đã sửa mới nhất
          </div>
          <p className="mt-1 text-sm font-bold leading-6 text-emerald-950">
            {latestCorrectedSentence}
          </p>
        </div>
      ) : (
        <div
          className="mt-4 rounded-[14px] border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold leading-6 text-slate-600"
          data-testid="ai-tutor-logic-empty-board"
        >
          Chưa có câu mới trên bảng. Hãy sửa một câu hoặc nhập câu bên dưới để xem logic.
        </div>
      )}

      <label className="mt-4 block text-xs font-black uppercase text-slate-500" htmlFor="ai-tutor-logic-pattern">
        Chọn mẫu Vietlish
      </label>
      <select
        id="ai-tutor-logic-pattern"
        value={selectedId}
        onChange={(event) => {
          setManualPatternRequested(true);
          setSelectedId(event.target.value);
          setFallbackSentence("");
        }}
        className="mt-2 w-full rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold text-slate-900 focus:border-indigo-300 focus:bg-white focus:outline-none"
      >
        {VIETLISH_CURATED_PATTERNS.map((pattern) => (
          <option key={pattern.id} value={pattern.id}>
            {pattern.title}
          </option>
        ))}
      </select>

      {activeExplanation && <PatternExplanation pattern={activeExplanation} />}

      <div className="mt-5 rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-4">
        <label className="text-xs font-black uppercase text-slate-500" htmlFor="ai-tutor-logic-free-text">
          Hoặc nhập câu muốn giải thích
        </label>
        <textarea
          id="ai-tutor-logic-free-text"
          value={freeText}
          onChange={(event) => setFreeText(event.target.value.slice(0, 500))}
          rows={3}
          className="mt-2 w-full resize-none rounded-[12px] border border-slate-200 bg-white p-3 text-[15px] leading-relaxed text-slate-900 placeholder-slate-400 focus:border-indigo-300 focus:outline-none"
          placeholder="Nhập một câu tiếng Anh hoặc Vietlish..."
        />
        <button
          type="button"
          onClick={handleExplainFreeText}
          disabled={!freeText.trim()}
          className="mt-3 min-h-[44px] w-full rounded-full bg-slate-900 px-5 py-2.5 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 sm:w-auto"
        >
          Giải thích câu này
        </button>
      </div>

      {fallback && (
        <div data-testid="ai-tutor-logic-llm-fallback" className="mt-4 rounded-[16px] border border-amber-200 bg-amber-50 px-4 py-4">
          <div className="text-xs font-black uppercase text-amber-700">
            Long-tail fallback
          </div>
          <p className="mt-1 text-sm font-bold leading-6 text-amber-950">
            {fallback.explanationVi}
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-amber-950">
            {fallback.memoryAid}
          </p>
        </div>
      )}
    </section>
  );
}

function PatternExplanation({ pattern }: { pattern: LogicExplanation }) {
  return (
    <div data-testid="ai-tutor-logic-curated-explanation" className="mt-4 grid gap-3">
      <div className="rounded-[16px] border border-indigo-100 bg-indigo-50 px-4 py-4">
        <div className="text-xs font-black uppercase text-indigo-600">
          Bẫy Vietlish
        </div>
        <p className="mt-1 text-sm font-semibold leading-6 text-indigo-950">
          {pattern.explanationVi}
        </p>
      </div>
      <div className="rounded-[16px] border border-emerald-100 bg-emerald-50 px-4 py-4">
        <div className="text-xs font-black uppercase text-emerald-700">
          Câu đúng
        </div>
        <p className="mt-1 text-sm font-black leading-6 text-emerald-950">
          {pattern.correctExample}
        </p>
      </div>
      <div className="rounded-[16px] border border-rose-100 bg-rose-50 px-4 py-4">
        <div className="text-xs font-black uppercase text-rose-700">
          Cách nghĩ dễ sai
        </div>
        <p className="mt-1 text-sm font-bold leading-6 text-rose-950">
          {pattern.trapExample}
        </p>
      </div>
      <div className="rounded-[16px] border border-slate-200 bg-white px-4 py-4">
        <div className="text-xs font-black uppercase text-slate-500">
          Mẹo nhớ
        </div>
        <p className="mt-1 text-sm font-semibold leading-6 text-slate-800">
          {pattern.memoryAid}
        </p>
      </div>
    </div>
  );
}
