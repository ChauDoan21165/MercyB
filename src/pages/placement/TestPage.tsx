// src/pages/placement/TestPage.tsx
//
// Screen 3 & 4 runtime — the adaptive test itself. Uses the engine from
// src/lib/placement/engine.ts, renders QuestionCard + ProgressStrip.
// Routes to /placement/results on completion (or Finish Early at Q8+).
// Browser back button triggers SkipModal per wireframe Screen 7.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  createPlacementEngine,
  type EngineSnapshot,
  type PlacementEngine,
} from '@/lib/placement/engine';
import { roomForCefr } from '@/lib/placement/cefrToRoom';
import ProgressStrip from '@/components/placement/ProgressStrip';
import QuestionCard from '@/components/placement/QuestionCard';
import SkipModal from '@/components/placement/SkipModal';
import { stashResult } from './resultStash';

const PAGE_MAX = 720;

const pageWrap: React.CSSProperties = {
  width: '100%',
  minHeight: 'calc(100vh - 72px)',
  display: 'flex',
  flexDirection: 'column',
};

const contentWrap: React.CSSProperties = {
  width: '100%',
  maxWidth: PAGE_MAX,
  margin: '0 auto',
  padding: '20px 16px 120px',
  flex: 1,
};

const finishEarlyRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '6px 16px 0',
  maxWidth: PAGE_MAX,
  margin: '0 auto',
  width: '100%',
};

const finishEarlyBtn: React.CSSProperties = {
  background: 'white',
  border: '1px solid rgba(0,0,0,0.14)',
  borderRadius: 9999,
  fontSize: 12,
  fontWeight: 700,
  color: 'rgba(0,0,0,0.72)',
  padding: '8px 14px',
  cursor: 'pointer',
  minHeight: 36,
};

const stickyFooter: React.CSSProperties = {
  position: 'sticky',
  bottom: 0,
  background: 'rgba(255,255,255,0.96)',
  backdropFilter: 'blur(8px)',
  borderTop: '1px solid rgba(0,0,0,0.06)',
  padding: '12px 16px calc(12px + env(safe-area-inset-bottom, 0px))',
};

function nextBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    background: '#111827',
    color: 'white',
    borderRadius: 9999,
    minHeight: 48,
    padding: '14px 24px',
    fontSize: 16,
    fontWeight: 900,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: '100%',
    maxWidth: PAGE_MAX,
    margin: '0 auto',
    display: 'block',
    opacity: disabled ? 0.5 : 1,
  };
}

export default function TestPage() {
  const nav = useNavigate();

  // Engine lives in a ref — not React state — because it mutates itself
  // on submit(). We mirror getState() into a snapshot state for render.
  const engineRef = useRef<PlacementEngine | null>(null);
  if (engineRef.current === null) {
    engineRef.current = createPlacementEngine();
  }
  const engine = engineRef.current;

  const [snapshot, setSnapshot] = useState<EngineSnapshot>(() =>
    engine.getState(),
  );
  const [selected, setSelected] = useState<'a' | 'b' | 'c' | 'd' | null>(null);
  const [viRevealed, setViRevealed] = useState(false);
  const [skipOpen, setSkipOpen] = useState(false);
  const startedAtRef = useRef<number>(Date.now());
  const questionStartAtRef = useRef<number>(Date.now());

  // Reset per-question transient state when the question changes.
  useEffect(() => {
    setSelected(null);
    setViRevealed(false);
    questionStartAtRef.current = Date.now();
  }, [snapshot.currentQuestion?.id]);

  // Browser-back escape hatch → confirm skip.
  useEffect(() => {
    const onPopState = () => {
      setSkipOpen(true);
      // Push ourselves back onto the stack so a second pop doesn't leave.
      window.history.pushState(null, '', window.location.href);
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // If engine is already done on first render (shouldn't normally happen
  // with our question bank, but defensive), route to results.
  const finalCefr = snapshot.finalCefr;
  useEffect(() => {
    if (!snapshot.isDone || !finalCefr) return;
    const roomId = roomForCefr(finalCefr);
    stashResult({
      snapshot,
      roomId,
      elapsedMs: Date.now() - startedAtRef.current,
    });
    nav('/placement/results', { replace: true });
  }, [snapshot, finalCefr, nav]);

  const handleNext = () => {
    if (!selected || !snapshot.currentQuestion) return;
    engine.submit({
      selectedOptionId: selected,
      viRevealed,
      elapsedMs: Date.now() - questionStartAtRef.current,
    });
    setSnapshot(engine.getState());
  };

  const handleFinishEarly = () => {
    engine.finishEarly();
    setSnapshot(engine.getState());
  };

  const onSkipConfirmed = () => {
    setSkipOpen(false);
    nav('/', { replace: true });
  };

  const current = snapshot.currentQuestion;
  const progress = useMemo(() => {
    // While active, questionCount is the 1-indexed ordinal of the
    // currently-showing question. If we've already finished, snap to the
    // total.
    const ordinal = snapshot.isDone
      ? snapshot.questionCount
      : snapshot.questionCount;
    return Math.max(1, ordinal);
  }, [snapshot.questionCount, snapshot.isDone]);

  if (!current) {
    // Waiting for the nav effect to route us to /placement/results.
    return <div style={{ padding: 24, opacity: 0.72 }}>Loading…</div>;
  }

  return (
    <div style={pageWrap}>
      <ProgressStrip current={progress} total={snapshot.estimatedTotal} />

      {snapshot.canFinishEarly ? (
        <div style={finishEarlyRow}>
          <button
            type="button"
            style={finishEarlyBtn}
            onClick={handleFinishEarly}
          >
            Finish early · Kết thúc sớm
          </button>
        </div>
      ) : null}

      <div style={contentWrap}>
        <QuestionCard
          question={current}
          selectedOptionId={selected}
          onSelect={setSelected}
          onViRevealChange={setViRevealed}
        />
      </div>

      <div style={stickyFooter}>
        <button
          type="button"
          style={nextBtnStyle(!selected)}
          onClick={handleNext}
          disabled={!selected}
        >
          Next question
          <span style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.78)', marginTop: 2 }}>
            Câu tiếp theo
          </span>
        </button>
      </div>

      <SkipModal
        open={skipOpen}
        onOpenChange={setSkipOpen}
        onKeepTesting={() => setSkipOpen(false)}
        onSkip={onSkipConfirmed}
      />
    </div>
  );
}
