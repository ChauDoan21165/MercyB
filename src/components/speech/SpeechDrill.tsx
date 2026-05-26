// src/components/speech/SpeechDrill.tsx
//
// One pronunciation drill: shows a target English sentence, captures
// the learner's spoken attempt via the Web Speech API (CC1's
// recognizeOnce), scores it with CC1's scorer, and renders a
// color-coded result with per-word highlighting.
//
// Pure presentational layer over CC1's src/lib/pronunciation/*.
// No persistence, no analytics — that's Wave 2 Step 3.
//
// Note: recognizeOnce hard-codes interimResults:false, so the UI
// can't surface a live transcript during listening. We fall back to
// a calm pulsing mic and a "listening" label.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Mic, MicOff, RefreshCw, ArrowRight, Volume2 } from 'lucide-react';

import {
  isSpeechRecognitionSupported,
  recognizeOnce,
} from '@/lib/pronunciation/recognizer';
import type { RecognitionResult } from '@/lib/pronunciation/recognizer';
import {
  scorePronunciation,
  type PhonemeTip,
  type ScoreResult,
  type WordScore,
  type WordStatus,
} from '@/lib/pronunciation/scorer';
import {
  speak as ttsSpeak,
  cancelSpeech as ttsCancel,
  isSupported as ttsSupported,
} from '@/lib/pronunciation/tts';

export type DrillState = 'unsupported' | 'idle' | 'listening' | 'scoring' | 'result' | 'error';

type RecognitionFailure = {
  supported: boolean;
  reason: string;
  message: string;
};

export type SpeechAttemptEvent = {
  target: string;
  recognized: string;
  score: ScoreResult;
  elapsedMs: number;
};

export type SpeechDrillProps = {
  /** The English sentence the learner is asked to say. */
  targetSentence: string;
  /** Bilingual translation of the target, displayed below in lighter text. */
  targetSentenceVi?: string;
  /** Called when the user taps "Next sentence". Omit to hide the button. */
  onNext?: () => void;
  /** Called when a score lands, for the parent to log/collect if it wants. */
  onScore?: (score: ScoreResult) => void;
  /**
   * Called once per scored attempt with the full metadata needed for
   * persistence (target, recognized text, elapsed time). Fires AFTER
   * onScore. Kept separate so consumers that only want the score can
   * ignore this, and persistence callers can get the richer payload.
   */
  onAttempt?: (event: SpeechAttemptEvent) => void;
  /**
   * Optional. When a user taps a "Try this word" button in the phoneme
   * feedback section, we emit the single word so a parent can swap the
   * drill target for focused practice. Omit to hide the button entirely;
   * practice words still render for visual reference.
   */
  onPracticeWord?: (word: string) => void;
  /**
   * Called when the user taps "View your history" after a score lands.
   * Omit to hide the link — the component does no routing of its own.
   */
  onViewHistory?: () => void;
};

// ── Style tokens (match AccountPage / placement work) ───────────────

const cardStyle: React.CSSProperties = {
  border: '1px solid rgba(0,0,0,0.10)',
  borderRadius: 22,
  padding: 28,
  background: 'white',
  boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
  display: 'flex',
  flexDirection: 'column',
  gap: 22,
  alignItems: 'center',
  textAlign: 'center',
};

const promptLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: 0.6,
  color: 'rgba(0,0,0,0.55)',
};

const promptLabelVi: React.CSSProperties = {
  display: 'inline',
  marginLeft: 6,
  fontSize: 12,
  fontWeight: 400,
  color: '#94a3b8',
  textTransform: 'none',
  letterSpacing: 0,
};

const targetEnStyle: React.CSSProperties = {
  fontSize: 'clamp(22px, 5.2vw, 30px)',
  fontWeight: 800,
  lineHeight: 1.3,
  color: 'rgba(10,10,10,0.94)',
  letterSpacing: -0.3,
  margin: 0,
};

const targetViStyle: React.CSSProperties = {
  marginTop: 6,
  fontSize: 15,
  color: '#94a3b8',
  lineHeight: 1.45,
};

function micButtonStyle(state: DrillState): React.CSSProperties {
  const base: React.CSSProperties = {
    width: 96,
    height: 96,
    borderRadius: 9999,
    border: 'none',
    cursor: state === 'scoring' ? 'wait' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 12px 32px rgba(16,185,129,0.20)',
    transition: 'transform 150ms ease, background 200ms ease',
    color: 'white',
  };
  if (state === 'listening') {
    return {
      ...base,
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      animation: 'mb-speech-pulse 1.2s ease-in-out infinite',
    };
  }
  if (state === 'scoring') {
    return {
      ...base,
      background: '#94a3b8',
      cursor: 'wait',
    };
  }
  return {
    ...base,
    background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
  };
}

const keyframesStyle = `
@keyframes mb-speech-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16,185,129,0.45); }
  50%      { transform: scale(1.05); box-shadow: 0 0 0 18px rgba(16,185,129,0); }
}
`;

const secondaryBtn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  background: 'white',
  color: 'rgba(0,0,0,0.78)',
  border: '1px solid rgba(0,0,0,0.14)',
  borderRadius: 9999,
  minHeight: 44,
  padding: '10px 20px',
  fontSize: 14,
  fontWeight: 700,
  cursor: 'pointer',
};

const primaryBtn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  background: '#111827',
  color: 'white',
  border: 'none',
  borderRadius: 9999,
  minHeight: 44,
  padding: '10px 22px',
  fontSize: 14,
  fontWeight: 900,
  cursor: 'pointer',
};

// ── Helpers ─────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 85) return '#059669'; // emerald-600
  if (score >= 60) return '#d97706'; // amber-600
  return '#dc2626'; // red-600
}

function wordColor(status: WordStatus): string {
  switch (status) {
    case 'correct': return '#059669';
    case 'close': return '#d97706';
    case 'wrong': return '#dc2626';
    case 'missed': return '#94a3b8';
  }
}

function scoreBandLabel(score: number): { en: string; vi: string } {
  if (score >= 85) return { en: 'Great pronunciation!', vi: 'Phát âm tốt lắm!' };
  if (score >= 60) return { en: 'Good — a few slips', vi: 'Khá ổn — còn vài chỗ cần sửa' };
  return { en: 'Keep practicing', vi: 'Tiếp tục luyện nhé' };
}

function failureCopy(reason: string): { en: string; vi: string } {
  switch (reason) {
    case 'no-speech':
      return {
        en: "We didn't hear anything. Try again a little louder.",
        vi: 'Chúng tôi chưa nghe thấy gì. Thử lại to hơn một chút nhé.',
      };
    case 'not-allowed':
    case 'service-not-allowed':
      return {
        en: 'Mic access was blocked. Allow microphone access and try again.',
        vi: 'Quyền truy cập micro đang bị chặn. Hãy cho phép dùng micro rồi thử lại.',
      };
    case 'audio-capture':
      return {
        en: "We couldn't reach your microphone. Check that it's plugged in.",
        vi: 'Mercy không truy cập được micro. Hãy kiểm tra xem micro đã được cắm hoặc bật chưa.',
      };
    case 'network':
      return {
        en: 'Network problem during recognition. Check your connection.',
        vi: 'Có sự cố mạng khi nhận dạng giọng nói. Kiểm tra kết nối rồi thử lại nhé.',
      };
    default:
      return {
        en: "Something went wrong. Let's try again.",
        vi: 'Có lỗi xảy ra. Hãy thử lại nhé.',
      };
  }
}

// ── Component ───────────────────────────────────────────────────────

export function SpeechDrill({
  targetSentence,
  targetSentenceVi,
  onNext,
  onScore,
  onAttempt,
  onPracticeWord,
  onViewHistory,
}: SpeechDrillProps) {
  // Gate the whole UI on support detection. Run once — if the browser
  // doesn't have SpeechRecognition, the entire component body renders
  // the fallback instead of the mic/result chrome.
  const supported = useMemo(() => isSpeechRecognitionSupported(), []);
  const ttsAvailable = useMemo(() => ttsSupported(), []);

  const [state, setState] = useState<DrillState>(supported ? 'idle' : 'unsupported');
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [errorCopy, setErrorCopy] = useState<{ en: string; vi: string } | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => () => { mountedRef.current = false; }, []);

  // Reset transient state whenever the caller hands us a new target.
  useEffect(() => {
    if (!supported) return;
    setState('idle');
    setScore(null);
    setErrorCopy(null);
  }, [targetSentence, supported]);

  const handleMicClick = useCallback(async () => {
    if (state !== 'idle' && state !== 'error') return;

    setState('listening');
    setScore(null);
    setErrorCopy(null);

    let recognition: RecognitionResult;
    const recognitionStart = Date.now();
    try {
      recognition = await recognizeOnce({ lang: 'en-US' });
    } catch (failure) {
      if (!mountedRef.current) return;
      const fail = failure as RecognitionFailure;
      setErrorCopy(failureCopy(fail?.reason ?? 'unknown'));
      setState('error');
      return;
    }
    const elapsedMs = Date.now() - recognitionStart;

    if (!mountedRef.current) return;
    setState('scoring');

    try {
      const result = scorePronunciation({
        target: targetSentence,
        recognized: recognition.transcript,
      });
      if (!mountedRef.current) return;
      setScore(result);
      setState('result');
      onScore?.(result);
      onAttempt?.({
        target: targetSentence,
        recognized: recognition.transcript,
        score: result,
        elapsedMs,
      });
    } catch (err) {
      if (!mountedRef.current) return;
      console.warn('[SpeechDrill] scorePronunciation threw:', err);
      setErrorCopy(failureCopy('unknown'));
      setState('error');
    }
  }, [state, targetSentence, onScore, onAttempt]);

  const handleTryAgain = useCallback(() => {
    setState('idle');
    setScore(null);
    setErrorCopy(null);
  }, []);

  // ── Renders ───────────────────────────────────────────────────────

  if (state === 'unsupported') {
    return (
      <div style={cardStyle} role="region" aria-label="Speech drill">
        <MicOff size={40} color="#94a3b8" aria-hidden />
        <div>
          <div style={{ fontSize: 17, fontWeight: 800, color: 'rgba(0,0,0,0.84)' }}>
            Pronunciation practice works best in Chrome or Safari on iOS
          </div>
          <div style={{ marginTop: 6, fontSize: 14, color: '#94a3b8' }}>
            Tính năng luyện phát âm hoạt động tốt nhất trên Chrome hoặc Safari
          </div>
        </div>
      </div>
    );
  }

  const caption: { en: string; vi: string } = (() => {
    if (state === 'listening') return { en: 'Listening…', vi: 'Đang nghe…' };
    if (state === 'scoring') return { en: 'Scoring…', vi: 'Đang chấm…' };
    if (state === 'error') return errorCopy ?? { en: 'Something went wrong.', vi: 'Có lỗi.' };
    if (state === 'result' && score) return scoreBandLabel(score.overallScore);
    return { en: 'Tap to speak', vi: 'Nhấn để nói' };
  })();

  return (
    <div style={cardStyle} role="region" aria-label="Speech drill">
      <style>{keyframesStyle}</style>

      <div>
        <span style={promptLabel}>Say this out loud</span>
        <span style={promptLabelVi}>· Đọc to câu này</span>
      </div>

      <div>
        <p style={targetEnStyle}>{targetSentence}</p>
        {targetSentenceVi ? <p style={targetViStyle}>{targetSentenceVi}</p> : null}
      </div>

      {ttsAvailable ? (
        <ListenControls text={targetSentence} />
      ) : null}

      <button
        type="button"
        aria-label={state === 'listening' ? 'Listening' : 'Start recording'}
        aria-pressed={state === 'listening'}
        onClick={handleMicClick}
        disabled={state === 'listening' || state === 'scoring'}
        style={micButtonStyle(state)}
      >
        <Mic size={40} aria-hidden />
      </button>

      <div style={{ minHeight: 48 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: state === 'error' ? '#dc2626'
              : state === 'result' && score ? scoreColor(score.overallScore)
              : 'rgba(0,0,0,0.78)',
          }}
          aria-live="polite"
        >
          {caption.en}
        </div>
        <div style={{ marginTop: 3, fontSize: 13, fontWeight: 400, color: '#94a3b8' }}>
          {caption.vi}
        </div>
      </div>

      {state === 'result' && score ? (
        <ResultBlock
          score={score}
          onPracticeWord={onPracticeWord}
          ttsAvailable={ttsAvailable}
        />
      ) : null}

      {state === 'result' || state === 'error' ? (
        <div
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <button type="button" style={secondaryBtn} onClick={handleTryAgain}>
            <RefreshCw size={16} aria-hidden />
            Try again · Thử lại
          </button>
          {onNext ? (
            <button type="button" style={primaryBtn} onClick={onNext}>
              Next · Tiếp theo
              <ArrowRight size={16} aria-hidden />
            </button>
          ) : null}
        </div>
      ) : null}

      {state === 'result' && onViewHistory ? (
        <button
          type="button"
          onClick={onViewHistory}
          style={{
            marginTop: 4,
            background: 'transparent',
            border: 'none',
            color: '#475569',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
          aria-label="View your pronunciation history"
          data-testid="speech-drill-view-history"
        >
          View history · Xem lịch sử
        </button>
      ) : null}
    </div>
  );
}

function ResultBlock({
  score,
  onPracticeWord,
  ttsAvailable,
}: {
  score: ScoreResult;
  onPracticeWord?: (word: string) => void;
  ttsAvailable: boolean;
}) {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div
        style={{
          fontSize: 56,
          fontWeight: 950,
          letterSpacing: -2,
          color: scoreColor(score.overallScore),
          lineHeight: 1,
        }}
        aria-label={`Overall score ${score.overallScore} out of 100`}
      >
        {score.overallScore}
        <span style={{ fontSize: 18, fontWeight: 700, color: '#94a3b8', marginLeft: 6 }}>
          / 100
        </span>
      </div>

      <WordRow words={score.wordScores} ttsAvailable={ttsAvailable} />

      <div style={{ fontSize: 14, lineHeight: 1.55, color: '#475569' }}>
        {score.feedback.en}
        <span style={{ display: 'block', marginTop: 4, fontSize: 13, color: '#94a3b8' }}>
          {score.feedback.vi}
        </span>
      </div>

      {score.phonemeFeedback.length > 0 ? (
        <PhonemeFeedbackSection
          tips={score.phonemeFeedback}
          onPracticeWord={onPracticeWord}
        />
      ) : null}
    </div>
  );
}

const phonemeSectionStyle: React.CSSProperties = {
  width: '100%',
  marginTop: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  textAlign: 'left',
};

const phonemeSectionHeading: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: 0.6,
  color: 'rgba(0,0,0,0.55)',
};

const phonemeSectionHeadingVi: React.CSSProperties = {
  display: 'inline',
  marginLeft: 6,
  fontSize: 12,
  fontWeight: 400,
  color: '#94a3b8',
  textTransform: 'none',
  letterSpacing: 0,
};

const phonemeCardStyle: React.CSSProperties = {
  border: '1px solid rgba(0,0,0,0.10)',
  borderRadius: 14,
  padding: '12px 14px',
  background: '#fafafa',
};

const phonemeSummaryStyle: React.CSSProperties = {
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 800,
  color: 'rgba(0,0,0,0.84)',
  listStyle: 'none',
  outline: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
};

const phonemeSummaryViStyle: React.CSSProperties = {
  display: 'block',
  marginTop: 2,
  fontSize: 12,
  fontWeight: 400,
  color: '#94a3b8',
};

const phonemeBodyStyle: React.CSSProperties = {
  marginTop: 10,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const practiceWordBtn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  background: 'white',
  color: 'rgba(0,0,0,0.82)',
  border: '1px solid rgba(0,0,0,0.14)',
  borderRadius: 9999,
  padding: '6px 12px',
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const practiceWordChip: React.CSSProperties = {
  ...practiceWordBtn,
  cursor: 'default',
};

function phonemeLabel(key: string): string {
  // Strip internal tokens like 'th-voiceless' → 'th'. Fall back to key.
  const head = key.split('-')[0];
  if (/^[a-z]+$/.test(head)) return head;
  return key;
}

function PhonemeFeedbackSection({
  tips,
  onPracticeWord,
}: {
  tips: PhonemeTip[];
  onPracticeWord?: (word: string) => void;
}) {
  return (
    <section style={phonemeSectionStyle} aria-label="Phonemes to practice">
      <div style={phonemeSectionHeading}>
        Phonemes to practice
        <span style={phonemeSectionHeadingVi}>· Âm cần luyện</span>
      </div>

      {tips.map((tip) => {
        const labelShort = phonemeLabel(tip.phoneme);
        return (
          <details key={tip.phoneme} style={phonemeCardStyle} data-phoneme={tip.phoneme}>
            <summary style={phonemeSummaryStyle}>
              <span>
                Practice: [{labelShort}]
                <span style={phonemeSummaryViStyle}>Luyện âm: [{labelShort}]</span>
              </span>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>
                tap to expand
              </span>
            </summary>

            <div style={phonemeBodyStyle}>
              <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
                {tip.vnConfusion}
              </p>

              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(0,0,0,0.84)', lineHeight: 1.5 }}>
                  {tip.articulation.en}
                </div>
                <div style={{ marginTop: 2, fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
                  {tip.articulation.vi}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.6, color: 'rgba(0,0,0,0.55)', marginBottom: 6 }}>
                  Practice words
                  <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 400, color: '#94a3b8', textTransform: 'none', letterSpacing: 0 }}>
                    · Từ luyện tập
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {tip.practiceWords.map((w) =>
                    onPracticeWord ? (
                      <button
                        key={w}
                        type="button"
                        style={practiceWordBtn}
                        onClick={() => onPracticeWord(w)}
                        aria-label={`Try the word ${w}`}
                      >
                        {w}
                      </button>
                    ) : (
                      <span key={w} style={practiceWordChip}>{w}</span>
                    ),
                  )}
                </div>
                {onPracticeWord ? (
                  <div style={{ marginTop: 6, fontSize: 11, color: '#94a3b8' }}>
                    Tap a word to practice it · Nhấn vào một từ để luyện
                  </div>
                ) : null}
              </div>
            </div>
          </details>
        );
      })}
    </section>
  );
}

function WordRow({ words, ttsAvailable }: { words: WordScore[]; ttsAvailable: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        justifyContent: 'center',
      }}
      aria-label="Word-by-word score"
    >
      {words.map((w, i) => {
        const color = wordColor(w.status);
        const showStrike = w.status === 'missed';
        const label = w.word || w.heard || '—';
        // Per-word Listen only for target words the learner didn't get right.
        // Extra heard slots (empty target) have nothing useful to play back.
        const showWordListen =
          ttsAvailable && !!w.word && w.status !== 'correct';
        return (
          <span
            key={`${w.word}-${i}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 15,
              fontWeight: 700,
              color,
              textDecoration: showStrike ? 'line-through' : 'none',
              padding: '4px 10px',
              borderRadius: 9999,
              background: `${color}14`,
              border: `1px solid ${color}33`,
            }}
            title={w.hint ? `${w.hint.en} · ${w.hint.vi}` : undefined}
            data-status={w.status}
          >
            {label}
            {showWordListen ? (
              <button
                type="button"
                aria-label={`Listen to ${w.word}`}
                onClick={(e) => {
                  e.stopPropagation();
                  void ttsSpeak({ text: w.word, rate: 0.8 });
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  marginLeft: 2,
                  cursor: 'pointer',
                  color,
                  opacity: 0.78,
                }}
                data-word-listen={w.word}
              >
                <Volume2 size={14} aria-hidden />
              </button>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

// ── Listen button: tap = 0.8x, long press = 0.5x ─────────────────

const LONG_PRESS_MS = 350;

const listenPrimaryBtn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  background: 'white',
  color: 'rgba(0,0,0,0.82)',
  border: '1px solid rgba(0,0,0,0.14)',
  borderRadius: 9999,
  padding: '10px 18px',
  fontSize: 14,
  fontWeight: 800,
  cursor: 'pointer',
  fontFamily: 'inherit',
  minHeight: 40,
  userSelect: 'none',
  touchAction: 'manipulation',
};

const listenGhostLink: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#64748b',
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
  padding: '4px 6px',
  marginTop: 2,
  fontFamily: 'inherit',
};

function ListenControls({
  text,
  onPlaying,
}: {
  text: string;
  onPlaying?: (playing: boolean) => void;
}) {
  const longPressTimer = useRef<number | null>(null);
  const longPressTriggered = useRef(false);

  const play = useCallback(
    async (rate: number) => {
      try {
        onPlaying?.(true);
        await ttsSpeak({ text, rate });
      } catch (err) {
        console.warn('[SpeechDrill] TTS playback failed:', err);
      } finally {
        onPlaying?.(false);
      }
    },
    [text, onPlaying],
  );

  const cancelTimer = () => {
    if (longPressTimer.current !== null) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handlePointerDown: React.PointerEventHandler<HTMLButtonElement> = () => {
    longPressTriggered.current = false;
    cancelTimer();
    longPressTimer.current = window.setTimeout(() => {
      longPressTriggered.current = true;
      void play(0.5);
    }, LONG_PRESS_MS);
  };

  const handlePointerUp: React.PointerEventHandler<HTMLButtonElement> = () => {
    const wasLongPress = longPressTriggered.current;
    cancelTimer();
    if (!wasLongPress) void play(0.8);
    longPressTriggered.current = false;
  };

  const handlePointerCancel: React.PointerEventHandler<HTMLButtonElement> = () => {
    cancelTimer();
    longPressTriggered.current = false;
  };

  useEffect(() => () => {
    cancelTimer();
    // Make sure playback doesn't outlive the component.
    ttsCancel();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <button
        type="button"
        aria-label="Listen"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerCancel}
        onPointerCancel={handlePointerCancel}
        // Prevent the browser's built-in context menu on long press
        // (otherwise mobile Safari steals the gesture).
        onContextMenu={(e) => e.preventDefault()}
        style={listenPrimaryBtn}
        data-testid="tts-listen-primary"
      >
        <Volume2 size={16} aria-hidden />
        Listen
        <span style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8', marginLeft: 4 }}>
          · Nghe
        </span>
      </button>
      <button
        type="button"
        onClick={() => void play(0.5)}
        style={listenGhostLink}
        data-testid="tts-listen-slow"
      >
        Listen slowly · Nghe chậm
      </button>
    </div>
  );
}

export default SpeechDrill;
