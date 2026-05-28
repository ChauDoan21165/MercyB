// src/components/stage-3b/SuggestionPanel.tsx
//
// Stage 3B — Suggestion panel (brick 2).
//
// Live consumer of `getSuggestion(event, weaknesses)`. Renders exactly
// ONE SuggestionCard when a Suggestion is available, or nothing when not.
//
// Two modes (the second is additive — the original contract is intact):
//
//   1. Derived mode (original): pass `event` + `weaknesses`; the panel
//      derives the suggestion via the Stage 3B engine `getSuggestion`
//      and wires dismiss to `dismissSuggestion`.
//
//   2. Injected mode (added for L4 wiring): pass a ready `suggestion`
//      (already composed by an upstream producer, e.g. L4 via
//      `useStage4Suggestion` + `composeStage4Reason`) and an `onDismiss`
//      handler. The panel renders that suggestion directly and delegates
//      dismissal to `onDismiss` so the producer owns the permanent-
//      dismiss persistence. This keeps the panel a pure display surface
//      and lets L4 route its output through the same card chrome without
//      forking the engine. When `suggestion` is `null`, the panel renders
//      nothing.
//
// Hard invariants (per ROADMAP §3B), unchanged:
//   - Local-only. Derived mode reads gate state through `getSuggestion`;
//     dismissal persists through `dismissSuggestion` (or the injected
//     `onDismiss`). NEVER touches raw localStorage.
//   - Soft: never throws. Renders nothing when there is no suggestion.
//   - One suggestion at a time. Single-pick; no stacking.
//   - Dismiss removes the card immediately AND (via the engine state API
//     or the injected handler) persists so it does not re-surface.

import { useCallback, useEffect, useState } from "react";

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
   * Derived mode — the activity event that just happened. The engine
   * biases its first probe to the matching domain. Omit in injected
   * mode.
   */
  event?: ActivityEvent;
  /**
   * Derived mode — the Stage 3A aggregator output. Caller passes fresh
   * data; read as-is. Omit in injected mode.
   */
  weaknesses?: LocalWeaknessMap;
  /**
   * Injected mode — a ready suggestion to render directly (or `null` to
   * render nothing). When provided, `event`/`weaknesses` are ignored and
   * the engine is NOT consulted. Producers using this MUST also pass
   * `onDismiss` so dismissal persistence stays with the producer.
   */
  suggestion?: Suggestion | null;
  /**
   * Injected mode — dismiss handler. Called with the suggestion id when
   * the learner dismisses. Defaults to the Stage 3B `dismissSuggestion`
   * state API when omitted (derived mode behaviour).
   */
  onDismiss?: (id: string) => void;
}

export default function SuggestionPanel({
  event,
  weaknesses,
  suggestion: injectedSuggestion,
  onDismiss,
}: SuggestionPanelProps) {
  // Injected mode is active whenever the derived inputs are not both
  // present. In that mode the panel renders the externally-supplied
  // suggestion verbatim instead of deriving one.
  const isInjected = event === undefined || weaknesses === undefined;

  const compute = useCallback((): Suggestion | null => {
    if (isInjected) return injectedSuggestion ?? null;
    return getSuggestion(event as ActivityEvent, weaknesses as LocalWeaknessMap);
  }, [isInjected, injectedSuggestion, event, weaknesses]);

  const [suggestion, setSuggestion] = useState<Suggestion | null>(compute);

  // Re-probe whenever the inputs change. Cheap (engine is pure +
  // synchronous, injected mode is a passthrough); avoids a stale card
  // hanging around after the parent hands us fresher data.
  useEffect(() => {
    setSuggestion(compute());
  }, [compute]);

  if (!suggestion) return null;

  const handleDismiss = (id: string) => {
    if (onDismiss) {
      onDismiss(id);
    } else {
      dismissSuggestion(id);
    }
    setSuggestion(null);
  };

  return (
    <div data-testid="suggestion-panel">
      <SuggestionCard suggestion={suggestion} onDismiss={handleDismiss} />
    </div>
  );
}
