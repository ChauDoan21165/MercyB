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
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

import { getWeaknessEntry } from "@/lib/weakness/weakness-catalog";
import { renderInlineBold } from "@/lib/weakness/renderInlineBold";
import { trackEvent } from "@/lib/analytics";
import type { L1HintPayload } from "./types";

interface L1HintCardProps {
  /** Pass through from GrammarApiResponse.l1Hint. Null/undefined renders nothing. */
  hint: L1HintPayload | null | undefined;
}

/**
 * Short 2–4 word badge labels for the detector's known weakness tags.
 * The three that also live in WEAKNESS_CATALOG read from the catalog
 * at render time so there's one canonical display string. The six
 * others (added to the detector in PR #19) have local bilingual
 * shorthands here until Chau reviews + promotes them into the shared
 * catalog.
 */
const L1_TAG_SHORT_LABEL: Record<string, { en: string; vi: string }> = {
  vi_l1_missing_be: { en: 'Missing "be"', vi: 'Thiếu động từ "be"' },
  vi_l1_question_no_aux: { en: "Question structure", vi: "Cấu trúc câu hỏi" },
  vi_l1_missing_article: { en: "Articles a / an / the", vi: "Mạo từ a / an / the" },
  vi_l1_possessive_gender: { en: "His / her", vi: "His / her" },
  vi_l1_preposition_transfer: { en: "Prepositions", vi: "Giới từ" },
  vi_l1_countable: { en: "Countable / uncountable", vi: "Đếm được / không đếm được" },
};

/**
 * Resolve the short badge label for a weakness tag. Catalog entry wins
 * when available (canonical displayEn/displayVi). Falls back to the
 * local short-label map. For a truly unknown tag, returns a readable
 * derivation so the badge still shows something useful.
 */
function resolveShortLabel(tag: string): { en: string; vi: string } {
  const entry = getWeaknessEntry(tag);
  if (entry) {
    return { en: entry.displayEn, vi: entry.displayVi };
  }
  const local = L1_TAG_SHORT_LABEL[tag];
  if (local) return local;
  // Last-resort fallback: strip the `vi_l1_` prefix, replace
  // underscores with spaces. Good enough for a debug/ship-later tag
  // until it lands in the catalog.
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

      <div className="mt-3">
        <LearnMoreLink
          tag={hint.weaknessTag}
          linkedRoomId={resolveLinkedRoomId(hint.weaknessTag)}
        />
      </div>
    </section>
  );
}

/**
 * Resolve the linked room id for a weakness tag.
 *
 * Brief used the name `linkedRoomId`; the actual catalog field is
 * `roomId` (CC2 owns weakness-catalog.ts and is expanding it on a
 * parallel branch — this file does NOT modify the catalog). Returns
 * null when no entry exists for the tag, which signals the
 * "No lesson yet" disabled state below.
 */
function resolveLinkedRoomId(tag: string): string | null {
  const entry = getWeaknessEntry(tag);
  const roomId = (entry as { roomId?: string } | null)?.roomId;
  return typeof roomId === "string" && roomId.length > 0 ? roomId : null;
}

function LearnMoreLink({
  tag,
  linkedRoomId,
}: {
  tag: string;
  linkedRoomId: string | null;
}) {
  if (!linkedRoomId) {
    return (
      <span
        role="button"
        aria-disabled="true"
        tabIndex={-1}
        className="cursor-not-allowed text-xs font-semibold text-amber-800/70 dark:text-amber-200/70"
        data-testid="l1-hint-learn-more-disabled"
      >
        No lesson yet · Chưa có bài học
      </span>
    );
  }

  return (
    <Link
      to={`/room/${linkedRoomId}`}
      className="text-xs font-semibold text-amber-800 underline-offset-2 hover:underline dark:text-amber-200"
      data-testid="l1-hint-learn-more-link"
      onClick={() => {
        trackEvent("l1_hint_learn_more_clicked", {
          tag,
          linked_room_id: linkedRoomId,
          source: "grammar_writing",
        });
      }}
    >
      Learn more →
    </Link>
  );
}
