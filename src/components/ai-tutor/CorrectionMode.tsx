// src/components/ai-tutor/CorrectionMode.tsx
// Input, result display, TTS, and practice flow.
// Extracted from AiTutor.tsx for reuse across modes.

import type { TutorTurn } from "@/lib/tutor/tutorTypes";
import type { TutorCopy } from "@/lib/tutor/tutorCopy";
import TeacherMercyVoiceControls from "@/components/teacher-mercy/TeacherMercyVoiceControls";
import DetectorHintChip from "@/components/ai-tutor/DetectorHintChip";
import type { DetectorHintContent } from "@/lib/ai-tutor/detectorHint";

type CorrectionResult = TutorTurn & {
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
  voiceDraft: string;
  ttsSupported: boolean;
  ttsSpeaking: boolean;
  ttsPreparing: boolean;
  ttsVoiceSource?: "mercy" | "device" | null;
  speechLang: string;
  onSubmit: () => void;
  onMicToggle: () => void;
  onUseVoiceDraft: () => void;
  onClearVoiceDraft: () => void;
  onTtsToggle: () => void;
  onPracticeSubmit: () => void;
  onClear: () => void;
  tutorCopy: TutorCopy;
  /**
   * Chip content for the L1 pattern-awareness surface, gated upstream
   * by severity + session-dedup (see lib/ai-tutor/detectorHint.ts).
   * Null → chip not rendered. Adult-tier AI Tutor only — this
   * component is not mounted from the Mercy Kids surface.
   */
  detectorHint?: DetectorHintContent | null;
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
  voiceDraft,
  ttsSupported,
  ttsSpeaking,
  ttsPreparing,
  ttsVoiceSource,
  speechLang: _speechLang,
  onSubmit,
  onMicToggle,
  onUseVoiceDraft,
  onClearVoiceDraft,
  onTtsToggle,
  onPracticeSubmit,
  onClear,
  tutorCopy,
  detectorHint = null,
}: Props) {
  const charCount = input.length;
  const isEmpty = !input.trim();
  const hasResult = Boolean(result && !loading);
  const { ui } = tutorCopy;

  return (
    <div
      data-testid="ai-tutor-layout"
      data-expanded={hasResult ? "true" : "false"}
      className={`grid gap-5 ${hasResult ? "grid-cols-1" : "mx-auto max-w-[720px] grid-cols-1"}`}
      style={hasResult ? { width: "100%", maxWidth: "100%", minWidth: 0 } as React.CSSProperties : undefined}
    >
      <div className="min-w-0">
        <section className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 rounded-[16px] border border-indigo-100 bg-indigo-50/50 px-4 py-3">
            <div className="text-xs font-black uppercase text-indigo-600">
              {ui.grammarModeLabel}
            </div>
            <h2 className="mt-1 text-xl font-black text-slate-900">
              {ui.correctionTitle}
            </h2>
            <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
              {ui.emptyBody}
            </p>
          </div>

          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="text-xs font-black uppercase text-slate-500">
              {ui.inputLabel}
            </label>
            <span className="shrink-0 text-[11px] font-medium text-slate-500">
              {charCount} / 500
            </span>
          </div>

          <textarea
            value={input}
            onChange={(e) => {
              if (e.target.value.length <= 500) setInput(e.target.value);
            }}
            placeholder={tutorCopy.placeholder}
            rows={5}
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
              unavailableLabel={tutorCopy.micLabels.unavailable}
              inactiveLabel={tutorCopy.micLabels.input}
              activeLabel={tutorCopy.micLabels.listening}
              ariaStart={tutorCopy.micLabels.ariaStart}
              ariaStop={tutorCopy.micLabels.ariaStop}
              onToggle={onMicToggle}
              className="w-full"
              fallbackTestId="ai-tutor-mic-fallback"
            />
            <p className="w-full text-xs font-medium leading-5 text-slate-500">
              {tutorCopy.micLabels.helper}
            </p>
            {voiceDraft && (
              <div
                data-testid="ai-tutor-voice-draft"
                className="rounded-[14px] border border-amber-200 bg-amber-50 px-4 py-3"
              >
                <div className="text-[11px] font-black uppercase text-amber-700">
                  Bản nháp giọng nói
                </div>
                <p className="mt-1 text-sm font-semibold leading-6 text-amber-950">
                  {voiceDraft}
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={onUseVoiceDraft}
                    className="min-h-10 rounded-full bg-amber-700 px-4 py-2 text-xs font-black text-white transition hover:bg-amber-800"
                  >
                    Dùng câu này
                  </button>
                  <button
                    type="button"
                    onClick={onClearVoiceDraft}
                    className="min-h-10 rounded-full border border-amber-200 bg-white px-4 py-2 text-xs font-bold text-amber-800 transition hover:bg-amber-100"
                  >
                    Thu lại
                  </button>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={onSubmit}
              disabled={isEmpty || loading}
              className="min-h-[48px] w-full flex-1 rounded-full bg-slate-900 px-4 py-3 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {ui.submitting}
                </span>
              ) : (
                ui.submit
              )}
            </button>

            {result && !loading && (
              <button
                type="button"
                onClick={onClear}
                className="min-h-[48px] w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50"
              >
                {ui.reset}
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
              {ui.emptyTitle}
            </div>
            <div className="mt-1 text-xs font-medium text-slate-500">
              {ui.emptyBody}
            </div>
          </section>
        )}

        {/* Loading state */}
        {loading && (
          <section className="mt-4 rounded-[16px] border border-indigo-100 bg-indigo-50/60 p-6 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-200 border-t-indigo-500" />
            <div className="mt-3 text-sm font-black text-indigo-700">
              {ui.loadingTitle}
            </div>
            <div className="mt-1 text-xs font-medium text-indigo-400">
              {ui.loadingBody}
            </div>
          </section>
        )}
      </div>

      {/* Result */}
      {result && !loading && (
        <section className="grid min-w-0 gap-4">
          <div className="rounded-[18px] border border-emerald-200 bg-emerald-50 p-5">
            <div className="mb-2 text-xs font-black uppercase text-emerald-600">
              {ui.correctedLabel}
            </div>
            <div className="text-xl font-black leading-snug text-emerald-900">
              {result.correctedText}
            </div>
            {!ttsSupported && (
              <div className="mt-2 text-[11px] text-slate-500">
                🔊 {ui.ttsUnavailable}
              </div>
            )}
            {ttsSupported && (
              <TeacherMercyVoiceControls
                kind="speaker"
                supported={ttsSupported}
                active={ttsSpeaking}
                preparing={ttsPreparing}
                unavailableLabel={ui.ttsUnavailable}
                inactiveLabel={ui.ttsPlay}
                activeLabel={ui.ttsStop}
                preparingLabel={ui.ttsPreparing}
                ariaStart={ui.ttsAriaPlay}
                ariaStop={ui.ttsAriaStop}
                onToggle={onTtsToggle}
                className="mt-3"
              />
            )}
            {ttsVoiceSource && (
              <div className={`mt-2 text-[11px] font-semibold ${ttsVoiceSource === "mercy" ? "text-emerald-700" : "text-amber-700"}`}>
                {ttsVoiceSource === "mercy" ? ui.ttsMercyVoiceLabel : ui.ttsDeviceVoiceFallbackLabel}
              </div>
            )}
          </div>

          <div className="rounded-[16px] border border-slate-200 bg-white p-5">
            <div className="mb-2 text-xs font-black uppercase text-slate-500">
              {ui.explanationLabel}
            </div>
            <p className="text-sm font-semibold leading-6 text-slate-700">
              {result.explanation}
            </p>
          </div>

          <div className="rounded-[16px] border border-indigo-100 bg-indigo-50/50 p-5">
            <div className="mb-2 text-xs font-black uppercase text-indigo-500">
              {ui.grammarTipLabel}
            </div>
            <p className="text-sm font-semibold leading-6 text-indigo-800">
              {result.grammarTip}
            </p>
          </div>

          <DetectorHintChip content={detectorHint} />

          {/* Practice section */}
          {!practiceFeedback && (
            <div className="rounded-[18px] border border-violet-200 bg-violet-50/50 p-5">
              <div className="mb-2 text-xs font-black uppercase text-violet-600">
                {ui.practiceLabel}
              </div>
              <p className="text-sm font-semibold leading-6 text-slate-700">
                {result.practicePrompt}
              </p>
              <textarea
                value={practiceAnswer}
                onChange={(e) => setPracticeAnswer(e.target.value)}
                placeholder={ui.practicePlaceholder}
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
                    {ui.practiceSubmitting}
                  </span>
                ) : (
                  ui.practiceSubmit
                )}
              </button>
            </div>
          )}

          {/* Practice feedback */}
          {practiceFeedback && (
            <div className="rounded-[18px] border border-emerald-200 bg-emerald-50 p-5">
              <div className="mb-2 text-xs font-black uppercase text-emerald-600">
                {ui.feedbackLabel}
              </div>
              <p className="text-sm font-bold leading-6 text-emerald-800">
                {practiceFeedback.encouragement}
              </p>
              <div className="mt-3 rounded-[12px] bg-white/70 p-3">
                <div className="text-xs font-black uppercase text-slate-500">{ui.tipLabel}</div>
                <p className="mt-1 text-sm font-medium leading-6 text-slate-700">{practiceFeedback.tip}</p>
              </div>
              <div className="mt-3 rounded-[12px] bg-white/70 p-3">
                <div className="text-xs font-black uppercase text-slate-500">{ui.nextStepLabel}</div>
                <p className="mt-1 text-sm font-medium leading-6 text-slate-700">{practiceFeedback.nextStep}</p>
              </div>
              <button
                type="button"
                onClick={onClear}
                className="mt-4 min-h-[48px] w-full rounded-full border border-emerald-300 bg-white px-4 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
              >
                {ui.tryAnother}
              </button>
            </div>
          )}

          {!practiceFeedback && (
            <button
              type="button"
              onClick={onClear}
              className="min-h-[48px] rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              {ui.tryAnother}
            </button>
          )}
        </section>
      )}
    </div>
  );
}
