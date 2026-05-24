// src/components/ai-tutor/CorrectionMode.tsx
// Input, result display, TTS, and practice flow.
// Extracted from AiTutor.tsx for reuse across modes.

import { Square, Volume2 } from "lucide-react";
import type { TutorTarget, TutorTargetCopy, UiCopy } from "@/lib/ai-tutor/tutorUiCopy";
import TeacherMercyVoiceControls from "@/components/teacher-mercy/TeacherMercyVoiceControls";

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

type Props = {
  input: string;
  setInput: (value: string) => void;
  loading: boolean;
  result: CorrectionResult | null;
  error: string | null;
  practiceAnswer: string;
  setPracticeAnswer: (value: string) => void;
  practiceFeedback: PracticeFeedback | null;
  practiceLoading: boolean;
  micSupported: boolean;
  micListening: boolean;
  ttsSupported: boolean;
  ttsSpeaking: boolean;
  ttsPreparing: boolean;
  ttsBrowserFallback: boolean;
  ttsVoiceSource: "idle" | "cloud" | "device";
  speechLang: string;
  onSubmit: () => void;
  onMicToggle: () => void;
  onTtsToggle: () => void;
  onPracticeSubmit: () => void;
  onClear: () => void;
  targetCopy: TutorTargetCopy;
  uiCopy: UiCopy;
};

export default function CorrectionMode({
  input,
  setInput,
  loading,
  result,
  error,
  practiceAnswer,
  setPracticeAnswer,
  practiceFeedback,
  practiceLoading,
  micSupported,
  micListening,
  ttsSupported,
  ttsSpeaking,
  ttsPreparing,
  ttsBrowserFallback,
  ttsVoiceSource,
  speechLang: _speechLang,
  onSubmit,
  onMicToggle,
  onTtsToggle,
  onPracticeSubmit,
  onClear,
  targetCopy,
  uiCopy,
}: Props) {
  const charCount = input.length;
  const isEmpty = !input.trim();
  const hasResult = Boolean(result && !loading);

  return (
    <div
      data-testid="ai-tutor-layout"
      data-expanded={hasResult ? "true" : "false"}
      className={`grid gap-5 ${hasResult ? "grid-cols-1" : "mx-auto max-w-[720px] grid-cols-1"}`}
      style={hasResult ? { width: "100%", maxWidth: "100%", minWidth: 0 } as React.CSSProperties : undefined}
    >
      <div className="min-w-0">
        <section className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="text-xs font-black uppercase text-slate-500">
              {uiCopy.inputLabel(targetCopy)}
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
                onSubmit();
              }
            }}
          />

          <div className="mt-3 flex flex-col gap-3">
            <TeacherMercyVoiceControls
              kind="mic"
              supported={micSupported}
              active={micListening}
              unavailableLabel={uiCopy.micUnavailable}
              inactiveLabel={uiCopy.micInput}
              activeLabel={uiCopy.micListening}
              ariaStart={uiCopy.micAriaStart}
              ariaStop={uiCopy.micAriaStop}
              onToggle={onMicToggle}
              className="w-full"
              fallbackTestId="ai-tutor-mic-fallback"
            />
            <p className="w-full text-xs font-medium leading-5 text-slate-500">
              {uiCopy.micHelper}
            </p>
            <button
              type="button"
              onClick={onSubmit}
              disabled={isEmpty || loading}
              className="min-h-[48px] w-full flex-1 rounded-full bg-slate-900 px-4 py-3 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {uiCopy.submitting}
                </span>
              ) : (
                uiCopy.submit
              )}
            </button>

            {result && !loading && (
              <button
                type="button"
                onClick={onClear}
                className="min-h-[48px] w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50"
              >
                {uiCopy.reset}
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
              {uiCopy.emptyTitle}
            </div>
            <div className="mt-1 text-xs font-medium text-slate-400">
              {uiCopy.emptyBody(targetCopy)}
            </div>
          </section>
        )}

        {/* Loading state */}
        {loading && (
          <section className="mt-4 rounded-[16px] border border-indigo-100 bg-indigo-50/60 p-6 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-200 border-t-indigo-500" />
            <div className="mt-3 text-sm font-black text-indigo-700">
              {uiCopy.loadingTitle}
            </div>
            <div className="mt-1 text-xs font-medium text-indigo-400">
              {uiCopy.loadingBody}
            </div>
          </section>
        )}
      </div>

      {/* Result */}
      {result && !loading && (
        <section className="grid min-w-0 gap-4">
          <div className="rounded-[18px] border border-emerald-200 bg-emerald-50 p-5">
            <div className="mb-2 text-xs font-black uppercase text-emerald-600">
              {uiCopy.correctedLabel}
            </div>
            <div className="text-xl font-black leading-snug text-emerald-900">
              {result.corrected}
            </div>
            {!ttsSupported && (
              <div className="mt-2 text-[11px] text-slate-400">
                🔊 {uiCopy.ttsUnavailable}
              </div>
            )}
            {ttsSupported && (
              <button
                type="button"
                onClick={onTtsToggle}
                disabled={ttsPreparing}
                className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                  ttsSpeaking
                    ? "border-red-300 bg-red-50 text-red-700"
                    : "border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50"
                }`}
                aria-label={ttsSpeaking ? uiCopy.ttsAriaStop : uiCopy.ttsAriaPlay}
              >
                {ttsPreparing ? (
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />
                ) : ttsSpeaking ? (
                  <Square className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <Volume2 className="h-3.5 w-3.5" aria-hidden />
                )}
                {ttsPreparing ? uiCopy.ttsPreparing : ttsSpeaking ? uiCopy.ttsStop : uiCopy.ttsPlay}
              </button>
            )}
            {ttsBrowserFallback && (
              <div className="mt-2 text-[11px] font-semibold text-amber-600">
                Device voice fallback · {uiCopy.ttsBrowserFallback}
              </div>
            )}
            {ttsVoiceSource === "cloud" && (
              <div className="mt-2 text-[11px] font-semibold text-emerald-700">
                Mercy voice
              </div>
            )}
          </div>

          <div className="rounded-[16px] border border-slate-200 bg-white p-5">
            <div className="mb-2 text-xs font-black uppercase text-slate-500">
              {uiCopy.explanationLabel}
            </div>
            <p className="text-sm font-semibold leading-6 text-slate-700">
              {result.explanation}
            </p>
          </div>

          <div className="rounded-[16px] border border-indigo-100 bg-indigo-50/50 p-5">
            <div className="mb-2 text-xs font-black uppercase text-indigo-500">
              {uiCopy.grammarTipLabel}
            </div>
            <p className="text-sm font-semibold leading-6 text-indigo-800">
              {result.grammarTip}
            </p>
          </div>

          {/* Practice section */}
          {!practiceFeedback && (
            <div className="rounded-[18px] border border-violet-200 bg-violet-50/50 p-5">
              <div className="mb-2 text-xs font-black uppercase text-violet-600">
                {uiCopy.practiceLabel}
              </div>
              <p className="text-sm font-semibold leading-6 text-slate-700">
                {result.practicePrompt}
              </p>
              <textarea
                value={practiceAnswer}
                onChange={(e) => setPracticeAnswer(e.target.value)}
                placeholder={uiCopy.practicePlaceholder}
                rows={3}
                className="mt-3 w-full min-w-0 resize-none rounded-[12px] border border-violet-200 bg-white p-3 text-[14px] leading-relaxed text-slate-900 placeholder-slate-400 transition focus:border-violet-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={onPracticeSubmit}
                disabled={!practiceAnswer.trim() || practiceLoading}
                className="mt-3 min-h-[44px] w-full rounded-full bg-violet-700 px-4 py-2.5 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:bg-violet-200 disabled:text-violet-400"
              >
                {practiceLoading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {uiCopy.practiceSubmitting}
                  </span>
                ) : (
                  uiCopy.practiceSubmit
                )}
              </button>
            </div>
          )}

          {/* Practice feedback */}
          {practiceFeedback && (
            <div className="rounded-[18px] border border-emerald-200 bg-emerald-50 p-5">
              <div className="mb-2 text-xs font-black uppercase text-emerald-600">
                {uiCopy.feedbackLabel}
              </div>
              <p className="text-sm font-bold leading-6 text-emerald-800">
                {practiceFeedback.encouragement}
              </p>
              <div className="mt-3 rounded-[12px] bg-white/70 p-3">
                <div className="text-xs font-black uppercase text-slate-500">{uiCopy.tipLabel}</div>
                <p className="mt-1 text-sm font-medium leading-6 text-slate-700">{practiceFeedback.tip}</p>
              </div>
              <div className="mt-3 rounded-[12px] bg-white/70 p-3">
                <div className="text-xs font-black uppercase text-slate-500">{uiCopy.nextStepLabel}</div>
                <p className="mt-1 text-sm font-medium leading-6 text-slate-700">{practiceFeedback.nextStep}</p>
              </div>
              <button
                type="button"
                onClick={onClear}
                className="mt-4 min-h-[48px] w-full rounded-full border border-emerald-300 bg-white px-4 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
              >
                {uiCopy.tryAnother}
              </button>
            </div>
          )}

          {!practiceFeedback && (
            <button
              type="button"
              onClick={onClear}
              className="min-h-[48px] rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              {uiCopy.tryAnother}
            </button>
          )}
        </section>
      )}
    </div>
  );
}
