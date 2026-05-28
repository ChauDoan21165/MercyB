// src/components/stage-4/Stage4SuggestionCard.tsx
//
// Stage 4 (L4) — intervention card (presentation).
//
// Renders ONE L4 `Stage4Suggestion`. Pure presentation: it composes the
// VI/EN copy from the suggestion's STRUCTURED `triggerReason` (Q5=B) via
// `composeStage4Reason` and renders it through `<Bilingual>`; it never
// reads or writes state itself. The dismiss control calls back to the
// caller, which owns the permanent-dismiss wiring (Q4=A).
//
// Hard invariants:
//   - Bilingual via `<Bilingual>`. VI-primary, per-side `lang` attrs
//     (WCAG 3.1.2).
//   - Mobile-first 375–414px. Vertical flow, no horizontal overflow.
//   - Zero gamification / shame / daily-requirement copy. The composed
//     text comes from the taxonomy-backed composer, which stays within
//     the Stage 3B forbidden-phrase contract.
//   - The dismiss control is always visible — every L4 suggestion is
//     dismissible, and dismiss is permanent.

import { X } from "lucide-react";

import { Bilingual } from "@/components/Bilingual";
import type { Stage4Suggestion } from "@/lib/stage-4/types";

import { composeStage4Reason } from "./composeStage4Reason";

export interface Stage4SuggestionCardProps {
  suggestion: Stage4Suggestion;
  onDismiss: (id: string) => void;
}

export default function Stage4SuggestionCard({
  suggestion,
  onDismiss,
}: Stage4SuggestionCardProps) {
  const text = composeStage4Reason(suggestion.triggerReason);

  return (
    <section
      role="region"
      aria-label="Mercy suggestion / Gợi ý từ Mercy"
      data-testid="stage4-suggestion-card"
      data-suggestion-id={suggestion.id}
      data-rule-id={suggestion.ruleId}
      className="mx-auto flex w-full max-w-[420px] items-start justify-between gap-3 rounded-2xl border border-violet-200/70 bg-white p-4 shadow-sm"
    >
      <div className="min-w-0 flex-1">
        <Bilingual
          vi={text.vi}
          en={text.en}
          viClassName="text-base leading-snug text-slate-900"
          enClassName="mt-1 text-sm leading-snug text-slate-500"
        />
      </div>
      <button
        type="button"
        onClick={() => onDismiss(suggestion.id)}
        data-testid="stage4-suggestion-dismiss"
        aria-label="Dismiss suggestion / Đóng gợi ý"
        className="-mr-1 -mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      >
        <X aria-hidden="true" className="h-5 w-5" />
      </button>
    </section>
  );
}
