// src/components/speech/SoundPairDrillCard.tsx
//
// UI for the VN-EN sound-pair drill.
//
// Recording → scoring flow (Step-7 wiring):
//   1. User clicks "Record" → startRecording() via usePronunciationRecorder.
//   2. User clicks "Stop" → stopRecording(); blob lands in recorderBlob.
//   3. useEffect fires: engineScore(blob, pair.target) → PronunciationResult.
//      If status === 'scoring-failed': surface explicit error + retry (C1).
//   4. textScore({ target, recognized: transcription }) → ScoreResult.
//   5. buildVerdict(): derives pair-level status (correct/close/wrong),
//      whether the learner said the contrast word, and the VN interference
//      note from phonemeFeedback[0].vnConfusion.
//
// C1 rules: no silent fallback; scoring-failed → explicit error + retry.
//
// Constraints honoured:
//   - additive to speech/: does not touch SpeechDrill or its tests
//   - bilingual copy centralised in soundPairCopy.ts
//   - no new SDK deps

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Mic, Square, Volume2 } from 'lucide-react';

import {
  speak as ttsSpeak,
  cancelSpeech as ttsCancel,
  isSupported as ttsSupported,
} from '@/lib/pronunciation/tts';
import {
  DRILL_CATEGORIES,
  getDrillByCategory,
  type DrillCategory,
} from '@/lib/pronunciation/soundPairDrills';
import { scorePronunciation as engineScore } from '@/lib/pronunciation/scoringEngine';
import { scorePronunciation as textScore } from '@/lib/pronunciation/scorer';
import type { ScoreResult } from '@/lib/pronunciation/scorer';
import type { ProblemPair } from '@/lib/pronunciation/vn-phoneme-map';
import { usePronunciationRecorder } from '@/hooks/usePronunciationRecorder';

import {
  CATEGORY_NAMES,
  CATEGORY_WHY,
  UI_COPY,
  type Bilingual as BilingualPair,
} from './soundPairCopy';
import { Bilingual } from '@/components/Bilingual';

export type SoundPairDrillCardProps = {
  /** Optional initial category. Omit to show the picker first. */
  initialCategory?: DrillCategory;
  /** Size of drill set (number of pairs). Default 5. */
  drillSize?: number;
  /** Called when the user finishes or exits a drill. */
  onExit?: () => void;
};

type Stage = 'pick' | 'drilling' | 'done';

type PairVerdict = {
  status: 'correct' | 'close' | 'wrong';
  overallScore: number;
  /** true when the heard word matches pair.contrast (the unwanted form). */
  heardContrast: boolean;
  /** VN interference note from phonemeFeedback[0].vnConfusion, if present. */
  vnInterference: string | undefined;
  /** Bilingual hint from the word score (close/wrong slots). */
  hint: { en: string; vi: string } | undefined;
};

export function buildVerdict(result: ScoreResult, pair: ProblemPair): PairVerdict {
  const lower = (s: string) => s.toLowerCase().trim();
  const mainSlot = result.wordScores.find(
    w => lower(w.word) === lower(pair.target),
  ) ?? result.wordScores[0];

  const rawStatus = mainSlot?.status ?? 'missed';
  const status: PairVerdict['status'] =
    rawStatus === 'correct' ? 'correct'
    : rawStatus === 'missed' ? 'wrong'
    : rawStatus === 'close' ? 'close'
    : 'wrong';

  const heardContrast = result.wordScores.some(
    w => lower(w.heard) === lower(pair.contrast),
  );

  const vnInterference = result.phonemeFeedback[0]?.vnConfusion;

  return {
    status,
    overallScore: result.overallScore,
    heardContrast,
    vnInterference,
    hint: mainSlot?.hint,
  };
}

export function SoundPairDrillCard({
  initialCategory,
  drillSize = 5,
  onExit,
}: SoundPairDrillCardProps) {
  const [stage, setStage] = useState<Stage>(initialCategory ? 'drilling' : 'pick');
  const [category, setCategory] = useState<DrillCategory | null>(
    initialCategory ?? null,
  );
  const [pairs, setPairs] = useState<ProblemPair[]>(() =>
    initialCategory ? getDrillByCategory(initialCategory, { size: drillSize }) : [],
  );
  const [index, setIndex] = useState(0);
  const [verdict, setVerdict] = useState<PairVerdict | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  const [scoringError, setScoringError] = useState<string | null>(null);
  // C1: surface a message when model audio can't play (cloud null AND no
  // browser speechSynthesis) instead of the old silent fire-and-forget.
  const [ttsFailed, setTtsFailed] = useState(false);

  const {
    status: recorderStatus,
    audioBlob: recorderBlob,
    error: recorderError,
    startRecording,
    stopRecording,
    reset: resetRecorder,
  } = usePronunciationRecorder();

  const pair = pairs[index];
  const total = pairs.length;

  // Score as soon as a fresh blob lands. recorderBlob and pair are both
  // in deps: they change together on Next (reset clears blob, index bumps
  // pair) so the effect exits early on the pair-change render (blob = null).
  useEffect(() => {
    if (!recorderBlob || !pair) return;

    let cancelled = false;
    setIsScoring(true);
    setScoringError(null);
    setVerdict(null);

    engineScore(recorderBlob, pair.target)
      .then(engine => {
        if (cancelled) return;
        if (engine.status === 'scoring-failed') {
          // C1: no silent fallback — explicit error
          setScoringError(UI_COPY.scoringFailed.vi);
          setIsScoring(false);
          return;
        }
        const text = textScore({ target: pair.target, recognized: engine.transcription });
        setVerdict(buildVerdict(text, pair));
        setIsScoring(false);
      })
      .catch(() => {
        if (cancelled) return;
        // C1: surface all failures explicitly
        setScoringError(UI_COPY.scoringFailed.vi);
        setIsScoring(false);
      });

    return () => { cancelled = true; };
  }, [recorderBlob, pair]);

  const pickCategory = useCallback(
    (cat: DrillCategory) => {
      resetRecorder();
      setVerdict(null);
      setScoringError(null);
      setCategory(cat);
      setPairs(getDrillByCategory(cat, { size: drillSize }));
      setIndex(0);
      setStage('drilling');
    },
    [drillSize, resetRecorder],
  );

  const playModel = useCallback(async (word: string) => {
    if (!ttsSupported() || !word) return;
    setTtsFailed(false);
    ttsCancel();
    try {
      const result = await ttsSpeak({ text: word, rate: 0.75 });
      if (result.source === 'none') setTtsFailed(true);
    } catch {
      setTtsFailed(true);
    }
  }, []);

  const onRecord = useCallback(async () => {
    if (recorderStatus === 'recording') {
      await stopRecording();
      return;
    }
    if (recorderStatus === 'processing' || isScoring) return;
    setVerdict(null);
    setScoringError(null);
    await startRecording();
  }, [recorderStatus, isScoring, startRecording, stopRecording]);

  const handleRetryScoring = useCallback(() => {
    setScoringError(null);
    resetRecorder();
  }, [resetRecorder]);

  const next = useCallback(() => {
    resetRecorder();
    setVerdict(null);
    setScoringError(null);
    if (index + 1 >= total) {
      setStage('done');
      return;
    }
    setIndex((i) => i + 1);
  }, [index, total, resetRecorder]);

  const backToCategories = useCallback(() => {
    resetRecorder();
    setStage('pick');
    setCategory(null);
    setPairs([]);
    setIndex(0);
    setVerdict(null);
    setScoringError(null);
  }, [resetRecorder]);

  if (stage === 'pick') {
    return (
      <CategoryPicker onPick={pickCategory} onExit={onExit} />
    );
  }

  if (stage === 'done' && category) {
    return (
      <DoneSummary
        category={category}
        onRestart={() => pickCategory(category)}
        onBack={backToCategories}
        onExit={onExit}
      />
    );
  }

  if (!pair || !category) return null;

  const isRecording = recorderStatus === 'recording';
  const isProcessing = recorderStatus === 'processing' || isScoring;

  return (
    <section
      aria-label="Sound pair drill"
      className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm p-5 sm:p-6 max-w-xl mx-auto"
      data-testid="sound-pair-drill-card"
      data-category={category}
    >
      <header className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={backToCategories}
          className="text-sm text-slate-600 dark:text-slate-300 hover:underline inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden />
          <Bi text={UI_COPY.backToCategories} />
        </button>
        <span className="text-xs text-slate-500" aria-live="polite">
          {index + 1} / {total}
        </span>
      </header>

      <h2 className="text-base font-semibold mb-1">
        <Bi text={CATEGORY_NAMES[category]} />
      </h2>

      <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
          <Bi text={UI_COPY.sayThis} />
        </p>
        <div className="flex items-center justify-between gap-3">
          <span
            className="text-3xl sm:text-4xl font-semibold"
            data-testid="pair-target"
          >
            {pair.target}
          </span>
          <button
            type="button"
            onClick={() => playModel(pair.target)}
            className="inline-flex items-center gap-1 text-sm px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-200"
            aria-label={`Play model pronunciation of ${pair.target}`}
          >
            <Volume2 className="w-4 h-4" aria-hidden />
            <Bi text={UI_COPY.playTarget} />
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          <Bi text={UI_COPY.notThis} />:{' '}
          <span
            className="line-through text-slate-600 dark:text-slate-300 text-sm"
            data-testid="pair-contrast"
          >
            {pair.contrast}
          </span>
        </p>
        {ttsFailed && (
          <p
            className="text-xs text-amber-600 dark:text-amber-400 mt-3"
            role="alert"
            aria-live="assertive"
            data-testid="pair-tts-error"
          >
            <Bi text={UI_COPY.ttsError} />
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex flex-wrap gap-2 items-center">
          <button
            type="button"
            onClick={onRecord}
            disabled={isProcessing}
            className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium ${
              isRecording
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60'
            }`}
            aria-label={
              isRecording ? 'Stop recording' :
              isProcessing ? 'Scoring in progress' :
              'Record your attempt'
            }
            data-testid="record-button"
          >
            {isRecording ? (
              <>
                <Square className="w-4 h-4" aria-hidden />
                <Bi text={UI_COPY.stop} />
              </>
            ) : isProcessing ? (
              <>
                <Mic className="w-4 h-4 animate-pulse" aria-hidden />
                <Bi text={UI_COPY.scoring} />
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" aria-hidden />
                <Bi text={UI_COPY.record} />
              </>
            )}
          </button>
        </div>

        {/* C1: explicit scoring error + retry, never silent */}
        {scoringError && (
          <div
            className="rounded-xl p-3 bg-red-50 dark:bg-red-900/20 text-sm text-red-900 dark:text-red-100"
            role="alert"
            aria-live="assertive"
            data-testid="pair-score-error"
          >
            <p>{scoringError}</p>
            <button
              type="button"
              onClick={handleRetryScoring}
              className="mt-2 text-xs underline hover:no-underline"
              data-testid="retry-scoring-button"
            >
              <Bi text={UI_COPY.retryScoring} />
            </button>
          </div>
        )}

        {/* Recorder-level error (mic denied, hardware missing, etc.) */}
        {recorderError && !scoringError && (
          <p
            className="text-xs text-red-600 dark:text-red-400"
            role="alert"
            data-testid="pair-mic-error"
          >
            {recorderError}
          </p>
        )}

        {verdict && !scoringError && (
          <VerdictChip verdict={verdict} pair={pair} />
        )}
      </div>

      <details className="mt-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 p-3">
        <summary className="cursor-pointer text-sm font-medium text-amber-900 dark:text-amber-200">
          <Bi text={UI_COPY.whyConfused} />
        </summary>
        <p className="mt-2 text-sm text-amber-900 dark:text-amber-100">
          {pair.vnWhyConfused}
        </p>
      </details>

      <footer className="mt-5 flex items-center justify-end">
        <button
          type="button"
          onClick={next}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
          aria-label={index + 1 >= total ? 'Finish drill' : 'Next pair'}
        >
          <Bi text={index + 1 >= total ? UI_COPY.finish : UI_COPY.nextPair} />
          <ArrowRight className="w-4 h-4" aria-hidden />
        </button>
      </footer>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────────────

function VerdictChip({
  verdict,
  pair,
}: {
  verdict: PairVerdict;
  pair: ProblemPair;
}) {
  const { status, overallScore, heardContrast, vnInterference, hint } = verdict;
  const isCorrect = status === 'correct';

  return (
    <div
      className={`rounded-xl p-3 text-sm ${
        isCorrect
          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100'
          : 'bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100'
      }`}
      role="status"
      aria-live="polite"
      data-testid="pair-verdict"
      data-status={status}
    >
      {isCorrect ? (
        <p className="font-semibold">
          <Bi text={UI_COPY.verdictCorrect} />
        </p>
      ) : (
        <>
          {heardContrast ? (
            <p className="font-semibold" data-testid="verdict-contrast-msg">
              Bạn nói &quot;{pair.contrast}&quot; — hãy nói &quot;{pair.target}&quot;.
            </p>
          ) : hint ? (
            <p className="font-semibold" data-testid="verdict-hint-msg">
              {hint.vi}
            </p>
          ) : (
            <p className="font-semibold">
              <Bi text={UI_COPY.verdictClose} />
            </p>
          )}
          {vnInterference && (
            <p className="mt-1 text-xs opacity-80" data-testid="verdict-vi-note">
              {vnInterference}
            </p>
          )}
        </>
      )}
      <p className="mt-1 text-xs tabular-nums opacity-70" data-testid="verdict-score">
        {overallScore}%
      </p>
    </div>
  );
}

function CategoryPicker({
  onPick,
  onExit,
}: {
  onPick: (cat: DrillCategory) => void;
  onExit?: () => void;
}) {
  const cats = useMemo(() => [...DRILL_CATEGORIES], []);
  return (
    <section
      aria-label="Choose drill category"
      className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm p-5 sm:p-6 max-w-xl mx-auto"
      data-testid="sound-pair-category-picker"
    >
      <h2 className="text-lg font-semibold">
        <Bi text={UI_COPY.title} />
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
        <Bi text={UI_COPY.chooseCategory} />
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {cats.map((cat) => (
          <li key={cat}>
            <button
              type="button"
              onClick={() => onPick(cat)}
              className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
              data-category={cat}
              data-testid={`category-${cat}`}
            >
              <div className="text-sm font-semibold">
                {CATEGORY_NAMES[cat].vi}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {CATEGORY_NAMES[cat].en}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                {CATEGORY_WHY[cat].vi}
              </p>
            </button>
          </li>
        ))}
      </ul>
      {onExit && (
        <div className="mt-4">
          <button
            type="button"
            onClick={onExit}
            className="text-sm text-slate-500 hover:underline"
          >
            ← Back
          </button>
        </div>
      )}
    </section>
  );
}

function DoneSummary({
  category,
  onRestart,
  onBack,
  onExit,
}: {
  category: DrillCategory;
  onRestart: () => void;
  onBack: () => void;
  onExit?: () => void;
}) {
  return (
    <section
      aria-label="Drill finished"
      className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm p-5 sm:p-6 max-w-xl mx-auto text-center"
      data-testid="sound-pair-done"
    >
      <h2 className="text-lg font-semibold">Xong! 🎉</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
        Bạn đã hoàn thành luyện cặp âm <strong>{CATEGORY_NAMES[category].vi}</strong>.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={onRestart}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Luyện lại
        </button>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          Chọn âm khác
        </button>
        {onExit && (
          <button
            type="button"
            onClick={onExit}
            className="px-4 py-2 rounded-xl text-slate-500 hover:underline"
          >
            Thoát
          </button>
        )}
      </div>
    </section>
  );
}

function Bi({ text }: { text: BilingualPair }) {
  return (
    <Bilingual
      as="span"
      vi={text.vi}
      en={text.en}
      separator={
        <span className="text-slate-400 mx-1" aria-hidden>
          ·
        </span>
      }
    />
  );
}
