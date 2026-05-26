// src/components/placement/QuestionCard.tsx
//
// Renders one placement question (MC or reading variant) per wireframe
// Screens 3 & 4. Pure presentational — no engine references; receives
// question + selected id + callbacks from the parent TestPage.
//
// Revision B: selection is changeable until Next is clicked. This
// component surfaces selection state via the controlled `selectedOptionId`
// prop; parent decides when to commit (via Next).

import React, { useRef, useState } from 'react';
import type { PlacementQuestion } from '@/lib/placement/questions';
import { useAudioUrl } from '@/hooks/useAudioUrl';

// Audio key for pre-recorded question instruction narration.
// Tap-to-hear only — no autoplay. Resolved via Supabase room-audio bucket.
const INSTRUCTION_AUDIO_KEY = 'placement/test-instruction.mp3';

type Props = {
  question: PlacementQuestion;
  selectedOptionId: 'a' | 'b' | 'c' | 'd' | null;
  onSelect: (id: 'a' | 'b' | 'c' | 'd') => void;
  /**
   * For reading questions: called with the new VI-revealed state when
   * the user toggles "Show Vietnamese". MC questions ignore this.
   */
  onViRevealChange?: (revealed: boolean) => void;
};

const cardStyle: React.CSSProperties = {
  border: '1px solid rgba(0,0,0,0.10)',
  borderRadius: 18,
  padding: 22,
  background: 'rgba(255,255,255,0.96)',
  boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
};

const passageCardStyle: React.CSSProperties = {
  ...cardStyle,
  background: '#f8fafc',
  marginBottom: 16,
};

const instructionLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: 0.6,
  color: 'rgba(0,0,0,0.55)',
  marginBottom: 10,
};

const instructionVi: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 400,
  letterSpacing: 0,
  textTransform: 'none',
  color: '#94a3b8',
  marginTop: 2,
};

const promptStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  color: 'rgba(0,0,0,0.92)',
  lineHeight: 1.45,
  margin: 0,
};

const promptViStyle: React.CSSProperties = {
  marginTop: 6,
  fontSize: 14,
  color: '#94a3b8',
  lineHeight: 1.45,
};

const passageTitleRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 12,
};

const passageTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
  color: 'rgba(0,0,0,0.65)',
};

const passageTitleVi: React.CSSProperties = {
  display: 'inline',
  marginLeft: 6,
  fontSize: 13,
  fontWeight: 400,
  color: '#94a3b8',
};

const toggleBtnStyle: React.CSSProperties = {
  border: '1px solid rgba(0,0,0,0.14)',
  borderRadius: 9999,
  background: 'white',
  fontSize: 11,
  fontWeight: 700,
  padding: '6px 12px',
  cursor: 'pointer',
  color: 'rgba(0,0,0,0.72)',
  whiteSpace: 'nowrap',
};

const passageEnStyle: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.65,
  color: 'rgba(0,0,0,0.86)',
  margin: 0,
};

const passageViStyle: React.CSSProperties = {
  marginTop: 10,
  fontSize: 14,
  lineHeight: 1.6,
  color: '#94a3b8',
};

const optionsList: React.CSSProperties = {
  marginTop: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

function optionCardStyle(selected: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    minHeight: 64,
    padding: '14px 16px',
    borderRadius: 14,
    border: selected
      ? '2px solid #10b981'
      : '1px solid rgba(0,0,0,0.14)',
    background: selected ? 'rgba(16,185,129,0.06)' : 'white',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    transition: 'border-color 120ms ease, background 120ms ease',
    fontFamily: 'inherit',
    fontSize: 16,
    color: 'rgba(0,0,0,0.88)',
  };
}

const badgeStyle: React.CSSProperties = {
  flex: '0 0 auto',
  width: 28,
  height: 28,
  borderRadius: 9999,
  background: '#f1f5f9',
  color: 'rgba(0,0,0,0.72)',
  fontSize: 12,
  fontWeight: 800,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  textTransform: 'uppercase',
  letterSpacing: 0.4,
};

export function QuestionCard({
  question,
  selectedOptionId,
  onSelect,
  onViRevealChange,
}: Props) {
  const [viRevealed, setViRevealed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const { url: instructionAudioUrl } = useAudioUrl(INSTRUCTION_AUDIO_KEY);
  const isReading = question.type === 'reading_comprehension';

  const handleToggleAudio = () => {
    if (!audioRef.current) {
      if (!instructionAudioUrl) return;
      const a = new Audio(instructionAudioUrl);
      a.preload = 'metadata';
      a.onplay = () => setAudioPlaying(true);
      a.onpause = () => setAudioPlaying(false);
      a.onended = () => setAudioPlaying(false);
      a.onerror = () => setAudioPlaying(false);
      audioRef.current = a;
      a.play().catch(() => setAudioPlaying(false));
    } else if (audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  };

  const handleToggle = () => {
    const next = !viRevealed;
    setViRevealed(next);
    onViRevealChange?.(next);
  };

  return (
    <>
      {isReading ? (
        <div style={passageCardStyle}>
          <div style={passageTitleRow}>
            <div>
              <span style={passageTitle}>📖 Read the passage</span>
              <span style={passageTitleVi}>· Đọc đoạn văn sau</span>
            </div>
            <button
              type="button"
              onClick={handleToggle}
              style={toggleBtnStyle}
              aria-pressed={viRevealed}
            >
              {viRevealed
                ? 'Hide Vietnamese · Ẩn tiếng Việt'
                : 'Show Vietnamese · Hiện tiếng Việt'}
            </button>
          </div>

          <p style={passageEnStyle}>{question.passage.en}</p>
          {viRevealed ? (
            <p style={passageViStyle}>{question.passage.vi}</p>
          ) : null}
        </div>
      ) : null}

      <div style={cardStyle}>
        <div style={{ ...instructionLabel, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <span style={{ flex: 1 }}>
            Choose the best answer
            <span style={instructionVi}>Chọn đáp án đúng nhất</span>
          </span>
          <button
            type="button"
            onClick={handleToggleAudio}
            style={{
              flex: '0 0 auto',
              width: 28,
              height: 28,
              borderRadius: 9999,
              border: '1px solid rgba(0,0,0,0.10)',
              background: 'white',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              color: 'rgba(0,0,0,0.50)',
              fontSize: 12,
              transition: 'background 0.15s, color 0.15s',
            }}
            aria-label={audioPlaying ? 'Pause instruction audio' : 'Listen to instruction'}
            title={audioPlaying ? 'Pause' : 'Listen'}
          >
            {audioPlaying ? '⏸' : '🔊'}
          </button>
        </div>

        <p style={promptStyle}>{question.prompt.en}</p>
        {question.prompt.vi && question.prompt.vi !== question.prompt.en ? (
          <p style={promptViStyle}>{question.prompt.vi}</p>
        ) : null}

        <div style={optionsList} role="radiogroup" aria-label="Answer options">
          {question.options.map((opt) => {
            const selected = selectedOptionId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onSelect(opt.id)}
                style={optionCardStyle(selected)}
              >
                <span style={badgeStyle}>{opt.id}</span>
                <span style={{ flex: 1 }}>{opt.text.en}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default QuestionCard;
