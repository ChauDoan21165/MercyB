// src/pages/practice/PronunciationDrillsPage.tsx
//
// Minimal learner-reachable consumer for the Lane C pronunciation/tone drill
// banks (previously banked with no consumer). Route: /practice/pronunciation.
//
// What it surfaces:
//   1. EN→VN Vietnamese tone listen-compare drills (TONE_CONTRAST_EXTRA) — the
//      32 reference clips uploaded to room-audio/tones/ play here via
//      TalkingFacePlayButton (→ useAudioUrl → resolveRoomAudioUrl). Below-floor
//      hỏi/ngã pairs are clearly marked LISTEN-COMPARE only (no scoring — this
//      page never scores, so the tone trust floor is not touched).
//   2. VN→EN English minimal-pair drills (VN_EN_PRONUNCIATION_DRILL_BANKS) —
//      target vs. confusable contrast + the Vietnamese "why it collapses" note.
//      These carry no uploaded audio (audioTarget null), so they render as read
//      drills; no scorer, no TTS dependency.
//
// Deliberately NOT here: any scorer, any percent, any threshold logic. This is
// a content browse/practice surface only.

import { useEffect, useMemo, useRef } from "react";

import TalkingFacePlayButton from "@/components/audio/TalkingFacePlayButton";
import { usePronunciationRecorder } from "@/hooks/usePronunciationRecorder";
import { toAudioKey } from "@/lib/roomAudioResolver";
import {
  TONE_CONTRAST_EXTRA,
  type PendingTonePair,
} from "@/data/tone-drill/tone-contrast-extra";
import {
  VN_EN_PRONUNCIATION_DRILL_BANKS,
} from "@/lib/pronunciation/vnEnPronunciationDrills";

const VN_EN_BANK_LABELS: Record<string, string> = {
  "th-voiced": "Âm “th” (có rung) — this / they",
  r: "Âm “r” — red / right",
  l: "Âm “l” — light / feel",
  "final-consonant": "Phụ âm cuối — bag / back",
  stress: "Trọng âm từ — REcord / reCORD",
};

/**
 * Honest self-compare loop: record your own voice, play it back, and A/B it
 * by ear against the model clips above. The opposite of the fake score we
 * removed — there is NO score, NO percent, NO judgment, NO server call. Pure
 * client-side capture + playback via usePronunciationRecorder (MediaRecorder).
 */
function SelfCompareRecorder() {
  const {
    status,
    error,
    lastRecordedAudioUrl,
    isPlayingRecorded,
    startRecording,
    stopRecording,
    playRecorded,
    clearRecordedAudio,
  } = usePronunciationRecorder();

  const isRecording = status === "recording";
  const isProcessing = status === "processing";
  const hasRecording = Boolean(lastRecordedAudioUrl) && !isRecording;

  // Focus management: when a recording first appears, move focus to the
  // "play your recording" control so keyboard / screen-reader users land on
  // the next natural action. When the recording is cleared ("Thu lại"), move
  // focus back to the record button. We track the previous presence of a
  // recording so we only steal focus on the transition, never on every render.
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
      className="mt-6 rounded-[16px] border border-emerald-100 bg-emerald-50/60 px-4 py-4"
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
            disabled={isProcessing}
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
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-black text-indigo-800"
            >
              <span aria-hidden="true">▶</span>{" "}
              {isPlayingRecorded ? "Đang phát…" : "Nghe lại giọng bạn"}
            </button>
            <button
              type="button"
              data-testid="self-compare-reset"
              aria-label="Xoá bản thu và thu lại"
              onClick={() => clearRecordedAudio()}
              className="inline-flex min-h-10 items-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600"
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

function ToneTargetRow({
  syllable,
  tone,
  shapeEn,
  audioPath,
}: {
  syllable: string;
  tone: string;
  shapeEn: string;
  audioPath: string;
}) {
  // audioPath is "/audio/tones/<key>.mp3"; toAudioKey → "tones/<key>.mp3",
  // which TalkingFacePlayButton resolves through the room-audio bucket.
  const audioKey = toAudioKey(audioPath) ?? "";
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black text-slate-900">{syllable}</span>
        <span className="text-xs font-bold text-indigo-700">
          {tone} tone · {shapeEn}
        </span>
      </div>
      <TalkingFacePlayButton
        src={audioKey}
        label={`Listen: “${syllable}”`}
        ariaLabel={`${syllable} — ${tone} tone (${shapeEn})`}
        // 32 clips render at once here — fetch each clip's bytes lazily on first
        // play instead of eagerly preloading metadata for all of them on mount.
        preload="none"
      />
    </div>
  );
}

function TonePairCard({ pair }: { pair: PendingTonePair }) {
  const [a, b] = pair.contrast;
  const listenOnly = pair.listenCompareOnly;
  return (
    <li className="rounded-[16px] border border-sky-100 bg-white px-4 py-4 shadow-sm">
      {/* English-primary: this block teaches Vietnamese tones to English
          speakers, so the English gloss leads; the Vietnamese gloss (tone
          names + example words being taught) stays as the secondary line. */}
      <p className="text-sm font-black leading-6 text-slate-900">{pair.glossEn}</p>
      <p className="mt-0.5 text-xs font-semibold leading-5 text-slate-500">{pair.glossVi}</p>
      {listenOnly && (
        <p className="mt-2 inline-block rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-black text-amber-800">
          Listen &amp; compare only — not scored
        </p>
      )}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <ToneTargetRow
          syllable={a.syllable}
          tone={a.tone}
          shapeEn={a.shapeEn}
          audioPath={a.audioPath}
        />
        <ToneTargetRow
          syllable={b.syllable}
          tone={b.tone}
          shapeEn={b.shapeEn}
          audioPath={b.audioPath}
        />
      </div>
    </li>
  );
}

export default function PronunciationDrillsPage() {
  const tonePairs = useMemo(() => TONE_CONTRAST_EXTRA, []);
  const vnEnBanks = useMemo(
    () => Object.entries(VN_EN_PRONUNCIATION_DRILL_BANKS),
    [],
  );

  return (
    <main
      data-testid="pronunciation-drills-page"
      className="mx-auto w-full max-w-3xl px-4 py-6"
    >
      <header>
        <p className="text-xs font-black uppercase text-indigo-600">Luyện phát âm</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">
          Nghe &amp; luyện cặp âm dễ nhầm
        </h1>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
          Nghe câu mẫu, so sánh hai âm, rồi tự đọc theo. Trang này chỉ để nghe và
          luyện — không chấm điểm.
        </p>
      </header>

      <SelfCompareRecorder />

      {/* ── Vietnamese tone listen-compare ── */}
      <section className="mt-6" data-testid="tone-pairs-section">
        <h2 className="text-lg font-black text-slate-900">Vietnamese tones</h2>
        <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
          Listen to the same syllable said with two different tones, then
          compare them by ear. No score — this is listen-and-compare only.
        </p>
        <ul className="mt-3 grid gap-3">
          {tonePairs.map((pair) => (
            <TonePairCard key={pair.id} pair={pair} />
          ))}
        </ul>
      </section>

      {/* ── VN→EN English minimal pairs ── */}
      <section className="mt-8" data-testid="vn-en-drills-section">
        <h2 className="text-lg font-black text-slate-900">Cặp âm tiếng Anh</h2>
        <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
          Những cặp từ người Việt hay đọc lẫn. Đọc to và giữ khác biệt rõ ràng.
        </p>
        <div className="mt-3 grid gap-4">
          {vnEnBanks.map(([key, pairs]) => (
            <div key={key} data-testid={`vn-en-bank-${key}`}>
              <h3 className="text-sm font-black text-indigo-700">
                {VN_EN_BANK_LABELS[key] ?? key}
              </h3>
              <ul className="mt-2 grid gap-2">
                {pairs.map((p) => (
                  <li
                    key={`${key}-${p.target}-${p.contrast}`}
                    className="rounded-[14px] border border-slate-100 bg-white px-3 py-2 shadow-sm"
                  >
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-base font-black text-slate-900">{p.target}</span>
                      <span className="text-xs font-bold text-slate-500">vs</span>
                      <span className="text-base font-bold text-slate-500">{p.contrast}</span>
                    </div>
                    <p className="mt-0.5 text-xs font-semibold leading-5 text-slate-600">
                      {p.vnWhyConfused}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
