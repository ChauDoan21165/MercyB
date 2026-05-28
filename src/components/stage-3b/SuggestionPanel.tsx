// src/components/stage-3b/SuggestionPanel.tsx
//
// Stage 3B — Suggestion panel (brick 2).
//
// Live consumer of `getSuggestion(event, weaknesses)`. Renders exactly
// ONE SuggestionCard when the engine returns a Suggestion, or nothing
// when it returns null. Wires the card's dismiss control to the engine's
// state API (`dismissSuggestion`).
//
// Hard invariants (per ROADMAP §3B):
//   - Local-only. Reads gate state through `getSuggestion` (which calls
//     `isSuggestionsDisabled` + `getDismissedSuggestionIds`); writes
//     through `dismissSuggestion`. NEVER touches raw localStorage —
//     state API only, per brick-2 brief.
//   - Soft: never throws. If the engine returns null for ANY reason
//     (disabled, empty weaknesses, already-dismissed, no taxonomy hit),
//     this component renders nothing.
//   - One suggestion at a time. The engine is single-pick; this panel
//     does not stack multiple cards.
//   - Dismiss is final per session: clicking dismiss removes the card
//     immediately AND persists the id so the engine won't re-emit it on
//     the next render. (Brick 1 already guards this on the engine side;
//     the local `useState` here is purely so the current view drops the
//     card without waiting for a parent re-render.)

import { useEffect, useState } from "react";

import type { LocalWeaknessMap } from "@/lib/stage-3a/aggregator";
import {
  getSuggestion,
  type ActivityEvent,
  type Suggestion,
} from "@/lib/stage-3b/suggestionEngine";
import { dismissSuggestion } from "@/lib/stage-3b/suggestionState";

import SuggestionCard from "./SuggestionCard";

export interface SuggestionPanelProps {
  /**
   * The activity event that just happened. The engine biases its first
   * probe to the matching domain (e.g. a placement_step_completed event
   * looks at placement weaknesses first).
   */
  event: ActivityEvent;
  /**
   * The Stage 3A aggregator output. Caller is responsible for passing
   * fresh data; this component reads it as-is.
   */
  weaknesses: LocalWeaknessMap;
}

export default function SuggestionPanel({
  event,
  weaknesses,
}: SuggestionPanelProps) {
  const [suggestion, setSuggestion] = useState<Suggestion | null>(() =>
    getSuggestion(event, weaknesses),
  );

  // Re-probe whenever the inputs change. Cheap (engine is pure +
  // synchronous); avoids a stale card hanging around after the parent
  // hands us a different event or fresher weaknesses.
  useEffect(() => {
    setSuggestion(getSuggestion(event, weaknesses));
  }, [event, weaknesses]);

  if (!suggestion) return null;

  const handleDismiss = (id: string) => {
    dismissSuggestion(id);
    setSuggestion(null);
  };

  return (
    <div data-testid="suggestion-panel">
      <SuggestionCard suggestion={suggestion} onDismiss={handleDismiss} />
    </div>
  );
}
