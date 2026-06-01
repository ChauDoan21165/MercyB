// src/features/review/ui/session/SessionView.tsx — Lane D / D5
//
// The presentational orchestrator for ONE card's front → reveal → grade flow,
// plus the session progress bar and the completion panel. PROP-DRIVEN and pure:
// it does no data fetching, holds no session state of its own beyond the local
// front/revealed toggle, and never imports the real scheduler/store/content.
// The stateful SessionContainer drives it.

import React from "react";
import type {
  LanguageCode,
  ReviewGrade,
  SessionCard,
  SessionSummary,
} from "@/features/review/types";
import { SessionProgress } from "./SessionProgress";
import { SessionCardFront } from "./SessionCardFront";
import { SessionCardBack } from "./SessionCardBack";
import { SessionComplete } from "./SessionComplete";
import type { GradePreview } from "./GradeButtons";

export interface SessionViewProps {
  /** The card currently being shown; null when the session is complete. */
  current: SessionCard | null;
  /** Front (prompt) / back (answer) languages for the active flow. */
  promptLang: LanguageCode;
  answerLang: LanguageCode;
  /** Phase of the current card. */
  revealed: boolean;
  /** Reveal the back of the current card. */
  onReveal: () => void;
  /** Grade the current card. */
  onGrade: (grade: ReviewGrade) => void;
  /** Per-grade interval preview (days) for the current card's buttons. */
  previews: GradePreview;
  /** Progress: cards graded so far / total in queue. */
  completed: number;
  total: number;
  /** Completion summary; non-null once the queue is exhausted. */
  summary: SessionSummary | null;
  /** Optional read-only audio playback (leader wires the pipeline later). */
  onPlayAudio?: (key: string) => void;
  /** Optional "done" affordance on the completion panel. */
  onDone?: () => void;
}

export function SessionView({
  current,
  promptLang,
  answerLang,
  revealed,
  onReveal,
  onGrade,
  previews,
  completed,
  total,
  summary,
  onPlayAudio,
  onDone,
}: SessionViewProps) {
  // Completion takes precedence: no current card + a summary → celebrate.
  if (current == null) {
    if (summary) {
      return (
        <div className="mx-auto w-full max-w-md px-4">
          <SessionComplete summary={summary} onDone={onDone} />
        </div>
      );
    }
    // No card and no summary yet — empty/loading shell, fail soft.
    return (
      <div
        className="mx-auto w-full max-w-md px-4 py-8 text-center text-gray-500"
        data-testid="session-empty"
      >
        Hôm nay không còn thẻ nào
      </div>
    );
  }

  return (
    <div
      className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-4"
      data-testid="session-view"
    >
      <SessionProgress completed={completed} total={total} />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        {revealed ? (
          <SessionCardBack
            item={current.item}
            promptLang={promptLang}
            answerLang={answerLang}
            previews={previews}
            onGrade={onGrade}
            onPlayAudio={onPlayAudio}
          />
        ) : (
          <SessionCardFront
            item={current.item}
            promptLang={promptLang}
            onReveal={onReveal}
            onPlayAudio={onPlayAudio}
          />
        )}
      </div>
    </div>
  );
}
