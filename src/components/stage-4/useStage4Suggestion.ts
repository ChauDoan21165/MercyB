// src/components/stage-4/useStage4Suggestion.ts
//
// Stage 4 (L4) — consumer hook.
//
// Reads the persisted L4 suggestion buffer and applies the
// ≤1-per-session cap (Q7=A) at display time. Per Q9=B the hook does NOT
// re-evaluate the rule table — that happens on the signal-change write
// path (`signalHook.ts`). This hook is a cheap read of the already-
// computed buffer plus a single session-marker write when a suggestion
// is surfaced.
//
// Returns the suggestion to render (or null) and a `dismiss` callback
// that permanently dismisses it (Q4=A, via Stage 3B's dismissed-id set).

import { useCallback, useMemo, useState } from "react";

import {
  applySessionCap,
  claimSessionOwner,
  dismissStage4Suggestion,
  readSessionOwnerId,
  readStoredStage4Suggestion,
} from "@/lib/stage-4/store";
import type { Stage4Suggestion } from "@/lib/stage-4/types";

export interface UseStage4SuggestionResult {
  suggestion: Stage4Suggestion | null;
  dismiss: (id: string) => void;
}

export interface UseStage4SuggestionOptions {
  /** Test seam — inject the evaluation clock. Production omits. */
  now?: number;
}

export function useStage4Suggestion(
  options: UseStage4SuggestionOptions = {},
): UseStage4SuggestionResult {
  const now = options.now ?? Date.now();

  // Resolve once per mount: read the buffer (TTL-expired inside the
  // store) and apply the session cap. `claimId` is the single session
  // write we perform — only when a suggestion newly claims the slot.
  const initial = useMemo(() => {
    const candidate = readStoredStage4Suggestion(now);
    const owner = readSessionOwnerId();
    const { surfaced, claimId } = applySessionCap(candidate, owner);
    if (claimId) claimSessionOwner(claimId);
    return surfaced;
    // `now` is captured once at mount; re-evaluation is driven by the
    // signal-change write path, not by this hook re-running.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [suggestion, setSuggestion] = useState<Stage4Suggestion | null>(
    initial,
  );

  const dismiss = useCallback((id: string) => {
    dismissStage4Suggestion(id);
    setSuggestion(null);
  }, []);

  return { suggestion, dismiss };
}
