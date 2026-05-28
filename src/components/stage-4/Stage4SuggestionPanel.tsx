// src/components/stage-4/Stage4SuggestionPanel.tsx
//
// Stage 4 (L4) → Stage 3B display wiring.
//
// Routes L4's `useStage4Suggestion` output through Stage 3B's
// `SuggestionPanel` (injected mode) so that when an L4 rule fires, its
// suggestion renders as the same dismissible card the Stage 3B surface
// uses — no second card chrome, no engine fork.
//
// This is wire-only:
//   - L4 owns the decision: `useStage4Suggestion` applies the rule
//     output, the ≤1-per-session cap (Q7=A), TTL, and the dismissed-id
//     gate (Q4=A).
//   - Q5=B presentation step: the structured `TriggerReason` is composed
//     into VI/EN copy here via `composeStage4Reason`, then handed to the
//     Stage 3B `Suggestion` shape the card expects.
//   - Dismiss is delegated to L4's `dismiss`, which persists through
//     Stage 3B's `dismissSuggestion` API — so a dismissal is permanent
//     and shared, honored exactly once, by the same set the Stage 3B
//     surface reads.

import SuggestionPanel from "@/components/stage-3b/SuggestionPanel";
import type { Suggestion } from "@/lib/stage-3b/suggestionEngine";
import type { Stage4Suggestion } from "@/lib/stage-4/types";

import { composeStage4Reason } from "./composeStage4Reason";
import { useStage4Suggestion } from "./useStage4Suggestion";

/**
 * Adapt an L4 `Stage4Suggestion` into the Stage 3B `Suggestion` shape the
 * card renders. The structured reason is composed into user-facing copy
 * here (Q5=B); the trigger/action are already the shared Stage 3B
 * contract, so they pass through unchanged. Every L4 suggestion is
 * dismissible.
 */
export function toStage3BSuggestion(s: Stage4Suggestion): Suggestion {
  return {
    id: s.id,
    triggerReason: s.triggerReason,
    suggestionText: composeStage4Reason(s.triggerReason),
    targetAction: s.targetAction,
    dismissible: true,
  };
}

export interface Stage4SuggestionPanelProps {
  /** Test seam — inject the evaluation clock. Production omits. */
  now?: number;
}

export default function Stage4SuggestionPanel({
  now,
}: Stage4SuggestionPanelProps = {}) {
  const { suggestion, dismiss } = useStage4Suggestion(now ? { now } : {});
  const adapted = suggestion ? toStage3BSuggestion(suggestion) : null;
  return <SuggestionPanel suggestion={adapted} onDismiss={dismiss} />;
}
