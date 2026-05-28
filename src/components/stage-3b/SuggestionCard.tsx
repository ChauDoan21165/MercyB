// src/components/stage-3b/SuggestionCard.tsx
//
// Stage 3B — Suggestion card (brick 2).
//
// Renders ONE Suggestion produced by `suggestionEngine.decideSuggestion`
// / `getSuggestion`. Pure presentation: takes a Suggestion + an onDismiss
// callback, never reads or writes state itself. SuggestionPanel owns the
// wiring to `dismissSuggestion(id)`.
//
// Hard invariants (per ROADMAP §3B):
//   - The dismiss control is ALWAYS visible. Suggestion.dismissible is
//     a literal `true` from the engine, so there is no gated branch —
//     the button renders unconditionally.
//   - Bilingual via the existing `<Bilingual>` wrapper. VI-primary,
//     per-side `lang` attrs (WCAG 3.1.2).
//   - Mobile-first 375–414px. Vertical flow, no horizontal overflow.
//   - Zero gamification / shame / daily-requirement copy in the chrome
//     this component adds. (The engine guarantees the suggestion text
//     itself is clean via FORBIDDEN_PHRASES + FORBIDDEN_REGEXES.)

import { X } from "lucide-react";

import { Bilingual } from "@/components/Bilingual";
import type { Suggestion } from "@/lib/stage-3b/suggestionEngine";

export interface SuggestionCardProps {
  suggestion: Suggestion;
  onDismiss: (id: string) => void;
}

export default function SuggestionCard({
  suggestion,
  onDismiss,
}: SuggestionCardProps) {
  const handleDismiss = () => {
    onDismiss(suggestion.id);
  };

  return (
    <section
      role="region"
      aria-label="Mercy suggestion / Gợi ý từ Mercy"
      data-testid="suggestion-card"
      data-suggestion-id={suggestion.id}
      className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="min-w-0 flex-1">
        <Bilingual
          vi={suggestion.suggestionText.vi}
          en={suggestion.suggestionText.en}
          viClassName="text-base leading-snug text-slate-900"
          enClassName="mt-1 text-sm leading-snug text-slate-500"
        />
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        data-testid="suggestion-dismiss"
        aria-label="Dismiss suggestion / Đóng gợi ý"
        className="-mr-1 -mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      >
        <X aria-hidden="true" className="h-5 w-5" />
      </button>
    </section>
  );
}
