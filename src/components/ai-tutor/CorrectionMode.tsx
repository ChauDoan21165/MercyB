// src/components/ai-tutor/CorrectionMode.tsx
// Input and correction result display.
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

type Props = {
  input: string;
  setInput: (value: string) => void;
  loading: boolean;
  result: CorrectionResult | null;
  error: string | null;
  micSupported: boolean;
  micListening: boolean;
  voiceDraft: string;
  speechLang: string;
  onSubmit: () => void;
  onMicToggle: () => void;
  onUseVoiceDraft: () => void;
  onClearVoiceDraft: () => void;
  onSendToSpeak: (correctedSentence: string) => void;
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
  micSupported,
  micListening,
  voiceDraft,
  speechLang: _speechLang,
  onSubmit,
  onMicToggle,
  onUseVoiceDraft,
  onClearVoiceDraft,
  onSendToSpeak,
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
            <label htmlFor="ai-tutor-grammar-input" className="text-xs font-black uppercase text-slate-500">
              {ui.inputLabel}
            </label>
            <span className="shrink-0 text-[11px] font-medium text-slate-500">
              {charCount} / 500
            </span>
          </div>

          <textarea
            id="ai-tutor-grammar-input"
            value={input}
            onChange={(e) => {
              if (e.target.value.length <= 500) setInput(e.target.value);
            }}
            placeholder={tutorCopy.placeholder}
            rows={5}
            autoFocus
            className="w-full min-w-0 resize-none rounded-[14px] border border-slate-200 bg-slate-50 p-4 text-[15px] leading-relaxed text-slate-900 placeholder-slate-400 transition focus:border-indigo-300 focus:bg-white focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                onSubmit();
              }
            }}
          />

          <div className="mt-3 flex flex-col gap-3">
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

            <div className="rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-xs font-black uppercase text-slate-500">
                {ui.voiceInputTitle}
              </div>
              <div className="mt-3">
                <TeacherMercyVoiceControls
                  kind="mic"
                  supported={micSupported}
                  active={micListening}
                  unavailableLabel={tutorCopy.micLabels.unavailable}
                  inactiveLabel={ui.voiceInputTitle}
                  activeLabel={tutorCopy.micLabels.listening}
                  ariaStart={tutorCopy.micLabels.ariaStart}
                  ariaStop={tutorCopy.micLabels.ariaStop}
                  onToggle={onMicToggle}
                  className="w-full"
                  fallbackTestId="ai-tutor-mic-fallback"
                />
              </div>
              {voiceDraft && (
                <div
                  data-testid="ai-tutor-voice-draft"
                  className="mt-3 rounded-[14px] border border-amber-200 bg-amber-50 px-4 py-3"
                >
                  <div className="text-[11px] font-black uppercase text-amber-700">
                    {ui.voiceDraftTitle}
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
                      {ui.useVoiceDraft}
                    </button>
                    <button
                      type="button"
                      onClick={onClearVoiceDraft}
                      className="min-h-10 rounded-full border border-amber-200 bg-white px-4 py-2 text-xs font-bold text-amber-800 transition hover:bg-amber-100"
                    >
                      {ui.clearVoiceDraft}
                    </button>
                  </div>
                </div>
              )}
            </div>

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

          <button
            type="button"
            onClick={() => onSendToSpeak(result.correctedText)}
            className="min-h-[48px] rounded-full bg-indigo-700 px-4 py-3 text-sm font-black text-white transition hover:bg-indigo-800"
          >
            {ui.sendToSpeak}
          </button>

          <button
            type="button"
            onClick={onClear}
            className="min-h-[48px] rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            {ui.tryAnother}
          </button>
        </section>
      )}
    </div>
  );
}
