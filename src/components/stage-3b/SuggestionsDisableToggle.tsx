// src/components/stage-3b/SuggestionsDisableToggle.tsx
//
// Stage 3B — global "turn suggestions off" toggle (brick 2).
//
// Wraps `setSuggestionsDisabled` so a learner can flip the engine off
// entirely (Per ROADMAP §3B: "learner can turn suggestions off
// entirely."). When the toggle is ON, `getSuggestion` returns null for
// every call until the learner re-enables.
//
// Hard invariants (per ROADMAP §3B):
//   - State API only — never reads or writes localStorage directly.
//   - Bilingual chrome via `<Bilingual>`. VI-primary.
//   - No streak / XP / shame / daily-requirement framing. The toggle
//     label is calm and descriptive — never punitive ("don't lose your
//     streak", etc.).

import { useState } from "react";

import { Bilingual } from "@/components/Bilingual";
import {
  isSuggestionsDisabled,
  setSuggestionsDisabled,
} from "@/lib/stage-3b/suggestionState";

export interface SuggestionsDisableToggleProps {
  /**
   * Notified whenever the toggle flips. Optional — the toggle persists
   * via `setSuggestionsDisabled` whether or not a listener is wired.
   */
  onChange?: (disabled: boolean) => void;
}

export default function SuggestionsDisableToggle({
  onChange,
}: SuggestionsDisableToggleProps = {}) {
  // Seed once from the engine's gate reader. SSR-safe — the reader
  // returns false when window/localStorage is unavailable.
  const [disabled, setDisabled] = useState<boolean>(() =>
    isSuggestionsDisabled(),
  );

  const handleChange = (next: boolean) => {
    setSuggestionsDisabled(next);
    setDisabled(next);
    onChange?.(next);
  };

  return (
    <label
      data-testid="suggestions-disable-toggle"
      className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4"
    >
      <input
        type="checkbox"
        checked={disabled}
        onChange={(e) => handleChange(e.target.checked)}
        data-testid="suggestions-disable-toggle-input"
        aria-label="Turn off suggestions / Tắt gợi ý"
        className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-slate-700 focus:ring-slate-400"
      />
      <div className="min-w-0 flex-1">
        <Bilingual
          vi="Tắt gợi ý từ Mercy"
          en="Turn off Mercy's suggestions"
          viClassName="text-base leading-snug text-slate-900"
          enClassName="mt-1 text-sm leading-snug text-slate-500"
        />
      </div>
    </label>
  );
}
