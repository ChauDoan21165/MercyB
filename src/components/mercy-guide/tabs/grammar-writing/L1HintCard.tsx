// src/components/mercy-guide/tabs/grammar-writing/L1HintCard.tsx
//
// Bilingual amber card that surfaces a Vietnamese-L1-interference hint
// from /api/mercy/grammar. Rendered below the grammar-explanation
// block inside GrammarWritingTab.
//
// Tone: warm, noticing — not alarming. Header framing is "a gentle
// pattern Mercy spotted," not "you made an error."
//
// Feature-gated by the caller (GrammarWritingTab) via
// useFeatureFlag('feedbackL1DetectorEnabled'). This component assumes
// the caller has already decided that rendering is allowed; it only
// guards against a missing/empty hint payload internally.

import React from "react";
import { BookOpen } from "lucide-react";

import { getWeaknessEntry } from "@/lib/weakness/weakness-catalog";
import { renderInlineBold } from "@/lib/weakness/renderInlineBold";
import type { L1HintPayload } from "./types";

interface L1HintCardProps {
  /** Pass through from GrammarApiResponse.l1Hint. Null/undefined renders nothing. */
  hint: L1HintPayload | null | undefined;
}

/**
 * Resolve the short badge label for a weakness tag. Every detector tag
 * is expected to live in WEAKNESS_CATALOG — that's the canonical source
 * for `shortLabel.en` / `shortLabel.vi`. For a tag the detector emits
 * before the catalog catches up, fall back to a prettified identifier
 * so the badge still shows something useful.
 */
function resolveShortLabel(tag: string): { en: string; vi: string } {
  const entry = getWeaknessEntry(tag);
  if (entry) {
    return { en: entry.shortLabel.en, vi: entry.shortLabel.vi };
  }
  const readable = tag.replace(/^vi_l1_/, "").replace(/_/g, " ").trim();
  return { en: readable || tag, vi: readable || tag };
}

export default function L1HintCard({ hint }: L1HintCardProps) {
  if (!hint) return null;

  const en = typeof hint.feedback?.en === "string" ? hint.feedback.en : "";
  const vi = typeof hint.feedback?.vi === "string" ? hint.feedback.vi : "";
  if (!en && !vi) return null;

  const label = resolveShortLabel(hint.weaknessTag);

  return (
    <section
      className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-sm dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-100"
      aria-label="Vietnamese learner hint"
    >
      <header className="mb-3 flex items-start gap-2">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-800/60 dark:text-amber-200">
          <BookOpen className="h-4 w-4" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-800/60 dark:text-amber-100">
            Pattern noticed
          </span>
          <div className="mt-1 text-sm font-semibold">
            {renderInlineBold(label.en)}
          </div>
          <div className="text-xs italic text-amber-800/80 dark:text-amber-200/80">
            {renderInlineBold(label.vi)}
          </div>
        </div>
      </header>

      {en ? (
        <p className="text-sm leading-relaxed">{renderInlineBold(en)}</p>
      ) : null}
      {vi ? (
        <p className="mt-2 text-sm italic leading-relaxed text-amber-900/80 dark:text-amber-100/80">
          {renderInlineBold(vi)}
        </p>
      ) : null}

      {/* TODO: wire to micro-lesson route once the dedicated /learn/:tag
          page exists. For now it's a no-op styled link so designers +
          analytics can preview the placement. */}
      <div className="mt-3">
        <span
          role="button"
          aria-disabled="true"
          tabIndex={-1}
          className="cursor-not-allowed text-xs font-semibold text-amber-800 underline-offset-2 opacity-60 hover:underline dark:text-amber-200"
        >
          Learn more →
        </span>
      </div>
    </section>
  );
}
