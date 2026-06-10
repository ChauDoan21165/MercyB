// src/components/speech/SoundPairDrillCard.tsx
//
// UI for the VN-EN sound-pair drill. Presentation-only:
//   1. Pick a category (th/t, r/l, -ed, -s).
//   2. See a shuffled set of 5 minimal pairs.
//   3. Play the target via TTS, "record" an attempt, see a mock score.
//   4. Read why Vietnamese speakers typically confuse this pair.
//
// STT wiring is deferred. `scoreFromAudio` returns a stub today; the
// UI copy explicitly tells the user this is a preview score. The seam
// is in place — swap the implementation in soundPairDrills.ts when the
// vendor decision lands (see reports/a7-phoneme-runbook.md).
//
// Constraints honoured:
//   - additive to speech/: does not touch SpeechDrill or its tests
//   - bilingual copy centralised in soundPairCopy.ts
//   - no new SDK deps

import React, { useCallback, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Mic, Volume2 } from 'lucide-react';

import {
  speak as ttsSpeak,
  cancelSpeech as ttsCancel,
  isSupported as ttsSupported,
} from '@/lib/pronunciation/tts';
import {
  DRILL_CATEGORIES,
  getDrillByCategory,
  scoreDrillAttempt,
  scoreFromAudio,
  type DrillCategory,
} from '@/lib/pronunciation/soundPairDrills';
import type { ProblemPair } from '@/lib/pronunciation/vn-phoneme-map';

import {
  bandForConfidence,
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

type PairResult = {
  confidence: number;
  mocked: boolean;
};

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
  const [lastResult, setLastResult] = useState<PairResult | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  // C1: surface a message when model audio can't play (cloud null AND no
  // browser speechSynthesis) instead of the old silent fire-and-forget.
  // The play button doubles as the retry control (re-press clears + retries).
  const [ttsFailed, setTtsFailed] = useState(false);

  const pair = pairs[index];
  const total = pairs.length;

  const pickCategory = useCallback(
    (cat: DrillCategory) => {
      setCategory(cat);
      setPairs(getDrillByCategory(cat, { size: drillSize }));
      setIndex(0);
      setLastResult(null);
      setStage('drilling');
    },
    [drillSize],
  );

  const playModel = useCallback(async (word: string) => {
    if (!ttsSupported() || !word) return;
    setTtsFailed(false);
    ttsCancel();
    try {
      const result = await ttsSpeak({ text: word, rate: 0.75 });
      if (result.source === 'none') setTtsFailed(true);
    } catch {
      // Defensive net for the cloud Audio path; speak() itself no longer throws.
      setTtsFailed(true);
    }
  }, []);

  const onRecord = useCallback(async () => {
    if (!pair || isRecording) return;
    setIsRecording(true);
    try {
      // STT stub — no real mic capture yet. Shape the seam so the wiring
      // layer can drop in without changing the component.
      const stt = await scoreFromAudio(null);
      // Cross-check the mock transcript (empty today) against the target
      // via the pure scorer; combined with the stub confidence, this
      // gives a plausible preview number until vendor wiring lands.
      const textSim = scoreDrillAttempt(pair.target, stt.transcript);
      const blended = stt.mocked ? stt.confidence : (stt.confidence * 0.5 + textSim * 0.5);
      setLastResult({ confidence: blended, mocked: stt.mocked });
    } finally {
      setIsRecording(false);
    }
  }, [pair, isRecording]);

  const next = useCallback(() => {
    if (index + 1 >= total) {
      setStage('done');
      return;
    }
    setIndex((i) => i + 1);
    setLastResult(null);
  }, [index, total]);

  const backToCategories = useCallback(() => {
    setStage('pick');
    setCategory(null);
    setPairs([]);
    setIndex(0);
    setLastResult(null);
  }, []);

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

      <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:items-center">
        <button
          type="button"
          onClick={onRecord}
          disabled={isRecording}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 font-medium"
          aria-label={isRecording ? 'Recording in progress' : 'Record your attempt'}
        >
          <Mic className="w-4 h-4" aria-hidden />
          {isRecording ? (
            <Bi text={UI_COPY.recording} />
          ) : (
            <Bi text={UI_COPY.record} />
          )}
        </button>

        {lastResult && (
          <ResultChip result={lastResult} />
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

function ResultChip({ result }: { result: PairResult }) {
  const band = bandForConfidence(result.confidence);
  const pct = Math.round(result.confidence * 100);
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm"
      role="status"
      aria-live="polite"
      data-testid="pair-result"
      data-mocked={result.mocked ? 'true' : 'false'}
    >
      <span className="font-semibold tabular-nums">{pct}%</span>
      <span className="text-slate-600 dark:text-slate-300">
        {band.vi}
      </span>
      {result.mocked && (
        <span
          className="ml-1 text-xs italic text-amber-700 dark:text-amber-300"
          title={UI_COPY.sttUnavailable.en}
        >
          ({UI_COPY.sttUnavailable.vi})
        </span>
      )}
    </div>
  );
}

function Bi({ text }: { text: BilingualPair }) {
  // Tier-2 sweep migration to <Bilingual> — see docs/copy/bilingual-audit.md
  // "Tier-2 backlog" section. The local `Bilingual` TYPE from
  // ./soundPairCopy is aliased to `BilingualPair` to free the
  // `Bilingual` identifier for the shared component import. The
  // middle `·` separator preserves its original aria-hidden styling
  // exactly — the muted-slate color stays on the same line as
  // aria-hidden so the !64 contrast-test exemption applies.
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
