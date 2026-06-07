import { useEffect, useRef } from "react";

import { usePronunciationRecorder } from "@/hooks/usePronunciationRecorder";

/**
 * Honest by-ear self-compare loop, shared by the pronunciation practice page
 * and the AiTutor Speak surface.
 *
 * The learner records their own voice, plays it back, and — when a model
 * sentence is available (`referenceText`) — hears the model immediately
 * followed by their own take so they can compare BY EAR.
 *
 * The opposite of the fake score we removed: there is NO score, NO percent,
 * NO judgment, NO ML claim, NO server call. Pure client-side capture +
 * playback via `usePronunciationRecorder` (MediaRecorder + the Web Speech
 * model voice). It does not import or touch the research-gated scorer.
 *
 * Mic-permission-denied and unsupported-recording both surface a clear
 * message via the hook's `error`, shown in a polite live region — never a
 * dead button. Focus moves to the play-back control once a recording exists
 * and back to the record button after a reset.
 */
export default function SelfCompareRecorder({
  referenceText,
  className,
}: {
  /**
   * Model sentence to compare against. When provided, a "compare by ear"
   * control plays this text in the device voice, then the learner's recording.
   */
  referenceText?: string;
  className?: string;
}) {
  const {
    status,
    error,
    lastRecordedAudioUrl,
    isPlayingRecorded,
    isComparing,
    startRecording,
    stopRecording,
    playRecorded,
    clearRecordedAudio,
    compareWithReference,
  } = usePronunciationRecorder();

  const isRecording = status === "recording";
  const isProcessing = status === "processing";
  const hasRecording = Boolean(lastRecordedAudioUrl) && !isRecording;
  const reference = referenceText?.trim();

  // Focus management: when a recording first appears, move focus to the
  // "play your recording" control; when it's cleared, return focus to the
  // record button. Track the previous presence so focus only moves on the
  // transition, never on every render.
  const recordBtnRef = useRef<HTMLButtonElement | null>(null);
  const playBtnRef = useRef<HTMLButtonElement | null>(null);
  const hadRecordingRef = useRef(false);

  useEffect(() => {
    if (hasRecording && !hadRecordingRef.current) {
      playBtnRef.current?.focus();
    } else if (!hasRecording && hadRecordingRef.current && !isRecording) {
      recordBtnRef.current?.focus();
    }
    hadRecordingRef.current = hasRecording;
  }, [hasRecording, isRecording]);

  return (
    <section
      data-testid="self-compare-recorder"
      aria-labelledby="self-compare-heading"
      className={
        className ??
        "mt-6 rounded-[16px] border border-emerald-100 bg-emerald-50/60 px-4 py-4"
      }
    >
      <h2 id="self-compare-heading" className="text-lg font-black text-slate-900">
        Tự thu &amp; so sánh
      </h2>
      <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
        Không chấm điểm — bạn tự thu giọng mình, nghe lại, rồi so sánh bằng tai
        với câu mẫu ở trên.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {!isRecording ? (
          <button
            ref={recordBtnRef}
            type="button"
            data-testid="self-compare-record"
            aria-label="Thu âm giọng của bạn"
            onClick={() => void startRecording()}
            disabled={isProcessing || isComparing}
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-sm font-black text-white disabled:opacity-60"
          >
            <span aria-hidden="true">●</span> Thu âm của bạn
          </button>
        ) : (
          <button
            type="button"
            data-testid="self-compare-stop"
            aria-label="Dừng thu âm"
            onClick={() => void stopRecording()}
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-black text-white"
          >
            <span aria-hidden="true">■</span> Dừng thu
          </button>
        )}

        {hasRecording && (
          <>
            <button
              ref={playBtnRef}
              type="button"
              data-testid="self-compare-play"
              aria-label="Nghe lại giọng vừa thu của bạn"
              onClick={() => void playRecorded()}
              disabled={isComparing}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-black text-indigo-800 disabled:opacity-60"
            >
              <span aria-hidden="true">▶</span>{" "}
              {isPlayingRecorded ? "Đang phát…" : "Nghe lại giọng bạn"}
            </button>

            {reference && (
              <button
                type="button"
                data-testid="self-compare-by-ear"
                aria-label="Nghe câu mẫu rồi nghe lại giọng bạn để so sánh bằng tai"
                onClick={() => void compareWithReference(reference)}
                disabled={isComparing}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm font-black text-emerald-800 disabled:opacity-60"
              >
                <span aria-hidden="true">⇄</span>{" "}
                {isComparing ? "Đang so sánh…" : "Nghe mẫu → giọng bạn"}
              </button>
            )}

            <button
              type="button"
              data-testid="self-compare-reset"
              aria-label="Xoá bản thu và thu lại"
              onClick={() => clearRecordedAudio()}
              disabled={isComparing}
              className="inline-flex min-h-10 items-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 disabled:opacity-60"
            >
              Thu lại
            </button>
          </>
        )}
      </div>

      {/* Single polite live region so screen readers announce recording start,
          the captured-recording prompt, and any mic error without stealing
          focus. */}
      <div aria-live="polite" role="status">
        {isRecording && (
          <p
            className="mt-2 text-xs font-bold text-rose-700"
            data-testid="self-compare-recording-note"
          >
            Đang thu… nói câu bạn muốn luyện rồi bấm “Dừng thu”.
          </p>
        )}
        {error && (
          <p className="mt-2 rounded-[12px] border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold leading-5 text-amber-900">
            {error}
          </p>
        )}
      </div>
      <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
        Tự nghe và so sánh — không có điểm số
      </p>
    </section>
  );
}
