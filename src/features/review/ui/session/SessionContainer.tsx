// src/features/review/ui/session/SessionContainer.tsx — Lane D / D5
//
// The STATEFUL container for a review session. It is the only piece in this
// slice that holds session state and calls the D4 session API. It does NOT
// instantiate the real scheduler/store/content — those arrive via `deps` so the
// composition root (lane leader) wires the concrete D1/D2/D3 impls and tests
// pass in-memory fakes.
//
// Flow:
//   1. On mount (and when deps/flow/nowMs change), buildQueue → startSession.
//   2. Show the current card's front; "Hiện đáp án" reveals the back.
//   3. On grade: gradeCard(deps, state, grade, now) → advance; reset to front.
//   4. When the queue is exhausted: summarize(...) → SessionComplete.

import React from "react";
import type {
  ReviewFlowId,
  ReviewGrade,
  ReviewSessionState,
  SessionSummary,
} from "@/features/review/types";
import {
  buildQueue,
  gradeCard,
  startSession,
  summarize,
  type SessionDeps,
} from "@/features/review/session";
import { getFlow } from "@/features/review/flows";
import { SessionView } from "./SessionView";
import type { GradePreview } from "./GradeButtons";

export interface SessionContainerProps {
  deps: SessionDeps;
  flow: ReviewFlowId;
  /** Injectable clock (ms-epoch). Defaults to Date.now() in production. */
  nowMs?: number;
  /** Optional read-only audio playback, forwarded to the card. */
  onPlayAudio?: (key: string) => void;
  /** Optional "done" affordance on the completion panel. */
  onDone?: () => void;
}

export function SessionContainer({
  deps,
  flow,
  nowMs,
  onPlayAudio,
  onDone,
}: SessionContainerProps) {
  // Resolve the clock once per render cycle. A fixed nowMs makes tests
  // deterministic; production passes nothing and gets the wall clock.
  const now = nowMs ?? Date.now();

  const [state, setState] = React.useState<ReviewSessionState | null>(null);
  const [revealed, setRevealed] = React.useState(false);
  const [summary, setSummary] = React.useState<SessionSummary | null>(null);
  const [busy, setBusy] = React.useState(false);

  const flowDef = getFlow(flow);

  // ── Build the queue on mount / when the inputs change. ────────────────────
  React.useEffect(() => {
    let cancelled = false;
    setState(null);
    setSummary(null);
    setRevealed(false);

    void (async () => {
      try {
        const queue = await buildQueue(deps, flow, { nowMs: now });
        if (cancelled) return;
        const session = startSession(flow, queue);
        setState(session);
        // Empty queue → summarize immediately so we land on the celebration /
        // "nothing left today" panel rather than a blank screen.
        if (queue.length === 0) {
          const s = await summarize(deps, session, now);
          if (!cancelled) setSummary(s);
        }
      } catch {
        // Fail soft: an unexpected build error leaves an empty completed state.
        if (cancelled) return;
        const empty = startSession(flow, []);
        setState(empty);
        try {
          const s = await summarize(deps, empty, now);
          if (!cancelled) setSummary(s);
        } catch {
          if (!cancelled)
            setSummary({
              flow,
              reviewed: 0,
              newIntroduced: 0,
              grades: { again: 0, hard: 0, good: 0, easy: 0 },
              nextDueAt: null,
            });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // `deps` is an object; callers should pass a stable reference. We key the
    // effect on its parts plus flow + clock.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deps, flow, now]);

  const current =
    state && state.index < state.queue.length ? state.queue[state.index] : null;

  const previews: GradePreview = React.useMemo(() => {
    if (!current) return { again: 0, hard: 0, good: 0, easy: 0 };
    return deps.scheduler.preview(current.card.state, now);
  }, [current, deps, now]);

  const handleReveal = React.useCallback(() => setRevealed(true), []);

  const handleGrade = React.useCallback(
    (grade: ReviewGrade) => {
      if (!state || busy) return;
      if (state.index >= state.queue.length) return;
      setBusy(true);
      void (async () => {
        try {
          const next = await gradeCard(deps, state, grade, now);
          setState(next);
          setRevealed(false);
          if (next.index >= next.queue.length) {
            const s = await summarize(deps, next, now);
            setSummary(s);
          }
        } finally {
          setBusy(false);
        }
      })();
    },
    [state, busy, deps, now],
  );

  const promptLang = flowDef?.prompt ?? "vi";
  const answerLang = flowDef?.answer ?? "en";

  return (
    <SessionView
      current={current}
      promptLang={promptLang}
      answerLang={answerLang}
      revealed={revealed}
      onReveal={handleReveal}
      onGrade={handleGrade}
      previews={previews}
      completed={state ? state.index : 0}
      total={state ? state.queue.length : 0}
      summary={current == null ? summary : null}
      onPlayAudio={onPlayAudio}
      onDone={onDone}
    />
  );
}
