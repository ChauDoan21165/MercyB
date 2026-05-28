// src/components/stage-4/useStage4Suggestion.ts
//
// Stage 4 (L4) — consumer hook.
//
// Reads the persisted L4 suggestion buffer and applies the
// ≤1-per-session cap (Q7=A) at display time. Per Q9=B the hook does NOT
// re-evaluate rules on render — it subscribes to the L1 ring-buffer
// WRITE path and recomputes the buffer only when a signal changes, then
// re-reads it. A render that doesn't follow a signal change just shows
// the current buffer.
//
// Returns the suggestion to render (or null) and a `dismiss` callback
// that permanently dismisses it (Q4=A, via Stage 3B's dismissed-id set).
//
// Public contract is unchanged from !153 — `{ suggestion, dismiss }` plus
// the optional `now` test seam; the reactivity is an internal addition.

import { useCallback, useEffect, useState } from "react";

import { subscribeL1TagRecorded } from "@/lib/stage-3a/adapters/l1TagAdapter";
import { runStage4OnSignalChange } from "@/lib/stage-4/signalHook";
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
  const nowOption = options.now;

  // Read the buffer + apply the session cap WITHOUT claiming the slot.
  // Kept pure (no session write) so it is safe to call from the useState
  // initializer; the claim happens in the effect, out of render.
  const peek = useCallback((): {
    surfaced: Stage4Suggestion | null;
    claimId: string | null;
  } => {
    const now = nowOption ?? Date.now();
    const candidate = readStoredStage4Suggestion(now);
    return applySessionCap(candidate, readSessionOwnerId());
  }, [nowOption]);

  const [suggestion, setSuggestion] = useState<Stage4Suggestion | null>(
    () => peek().surfaced,
  );

  useEffect(() => {
    const apply = () => {
      const { surfaced, claimId } = peek();
      if (claimId) claimSessionOwner(claimId);
      setSuggestion(surfaced);
    };

    // Reflect the current buffer at mount (and perform the slot claim
    // here, outside the render phase).
    apply();

    // Q9=B: re-evaluate on signal change, not on render. The L1 ring
    // buffer is already written by the time `recordL1Tag` notifies, so
    // recomputing here reads fresh signals; we then re-read the buffer.
    const off = subscribeL1TagRecorded(() => {
      runStage4OnSignalChange(nowOption ?? Date.now());
      apply();
    });
    return off;
  }, [peek, nowOption]);

  const dismiss = useCallback((id: string) => {
    dismissStage4Suggestion(id);
    setSuggestion(null);
  }, []);

  return { suggestion, dismiss };
}
