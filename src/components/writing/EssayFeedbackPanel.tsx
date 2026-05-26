// src/components/writing/EssayFeedbackPanel.tsx
//
// Renders a WritingRubric as a compact, mobile-first panel:
//   - Overall score (big number)
//   - 5-bar visual per dimension (5 pips, filled by score)
//   - Per-issue VN explanations pulled from l1-vn-explanations.ts
//   - Spelling errors and structure flags
//
// VN-first surface. English is parenthetical.

import React from "react";
import { CheckCircle2, AlertCircle, BookOpen } from "lucide-react";
import {
  L1_VN_EXPLANATIONS,
} from "@/lib/feedback/l1-vn-explanations";
import { getWeaknessEntry } from "@/lib/weakness/weakness-catalog";
import { overallScore, type WritingRubric } from "@/lib/writing-feedback/rubric";
import { WRITING_COPY } from "./writingFeedbackCopy";

interface EssayFeedbackPanelProps {
  rubric: WritingRubric;
  /**
   * Optional click handler when a user taps "open micro-lesson" for an
   * issue. Receives the L1 weakness tag. If omitted, the button links
   * to the existing weakness micro-lesson route.
   */
  onOpenMicroLesson?: (tag: string) => void;
}

export function EssayFeedbackPanel({
  rubric,
  onOpenMicroLesson,
}: EssayFeedbackPanelProps) {
  const overall = overallScore(rubric);

  return (
    <div className="space-y-4">
      {/* Overall */}
      <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {WRITING_COPY.overallLabel.vi}
        </p>
        <p className="mt-1 text-3xl font-semibold text-foreground">
          {overall.toFixed(1)}
          <span className="ml-1 text-base font-normal text-muted-foreground">
            / 5
          </span>
        </p>
      </div>

      {/* Dimensions */}
      <div className="space-y-3">
        <DimensionRow
          label={WRITING_COPY.dimensionLabels.grammar.vi}
          score={rubric.grammar.score}
        >
          {rubric.grammar.issues.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              {WRITING_COPY.noIssuesGood.vi}
            </p>
          ) : null}
        </DimensionRow>

        <DimensionRow
          label={WRITING_COPY.dimensionLabels.vocabulary.vi}
          score={rubric.vocabulary.score}
        >
          <p className="text-xs text-muted-foreground">
            {WRITING_COPY.cefrEstimate(rubric.vocabulary.level_estimate).vi}
          </p>
          {rubric.vocabulary.notes.map((n, i) => (
            <p key={i} className="text-xs text-muted-foreground">
              · {n}
            </p>
          ))}
        </DimensionRow>

        <DimensionRow
          label={WRITING_COPY.dimensionLabels.structure.vi}
          score={rubric.structure.score}
        >
          <p className="text-xs text-muted-foreground">
            {WRITING_COPY.paragraphCount(rubric.structure.paragraph_count).vi}
          </p>
          <p className="text-xs text-muted-foreground">
            ·{" "}
            {rubric.structure.has_intro
              ? WRITING_COPY.introYes.vi
              : WRITING_COPY.introNo.vi}
          </p>
          <p className="text-xs text-muted-foreground">
            ·{" "}
            {rubric.structure.has_conclusion
              ? WRITING_COPY.conclusionYes.vi
              : WRITING_COPY.conclusionNo.vi}
          </p>
        </DimensionRow>

        <DimensionRow
          label={WRITING_COPY.dimensionLabels.spelling_punctuation.vi}
          score={rubric.spelling_punctuation.score}
        >
          {rubric.spelling_punctuation.errors.length > 0 && (
            <>
              <p className="text-xs font-medium text-foreground">
                {WRITING_COPY.spellingHeading.vi}
              </p>
              <p className="text-xs text-muted-foreground">
                {rubric.spelling_punctuation.errors.join(", ")}
              </p>
            </>
          )}
        </DimensionRow>

        <DimensionRow
          label={WRITING_COPY.dimensionLabels.coherence.vi}
          score={rubric.coherence.score}
        >
          {rubric.coherence.notes.map((n, i) => (
            <p key={i} className="text-xs text-muted-foreground">
              · {n}
            </p>
          ))}
        </DimensionRow>
      </div>

      {/* Issues with VN explanations */}
      {rubric.grammar.issues.length > 0 && (
        <div className="space-y-3 rounded-xl border border-amber-300/40 bg-amber-50/60 p-4">
          <p className="text-sm font-semibold text-foreground">
            {WRITING_COPY.issuesHeading.vi}
          </p>
          {rubric.grammar.issues.map((tag) => (
            <IssueCard
              key={tag}
              tag={tag}
              onOpenMicroLesson={onOpenMicroLesson}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── DimensionRow ──────────────────────────────────────────────────────────

interface DimensionRowProps {
  label: string;
  score: number;
  children?: React.ReactNode;
}

function DimensionRow({ label, score, children }: DimensionRowProps) {
  return (
    <div className="rounded-lg border border-primary/10 bg-white/80 p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <ScoreBar score={score} />
      </div>
      <div className="mt-1 space-y-0.5">{children}</div>
    </div>
  );
}

function ScoreBar({ score }: { score: number }) {
  const pips = [0, 1, 2, 3, 4];
  return (
    <div className="flex items-center gap-1" aria-label={`Score ${score}/5`}>
      {pips.map((i) => (
        <span
          key={i}
          className={
            "block h-2 w-3 rounded-sm " +
            (i < score ? "bg-primary" : "bg-primary/15")
          }
        />
      ))}
    </div>
  );
}

// ── IssueCard ─────────────────────────────────────────────────────────────

interface IssueCardProps {
  tag: string;
  onOpenMicroLesson?: (tag: string) => void;
}

function IssueCard({ tag, onOpenMicroLesson }: IssueCardProps) {
  const explanation =
    (L1_VN_EXPLANATIONS as Record<string, { name_vi: string; explanation_vi: string }>)[tag];
  const catalogEntry = getWeaknessEntry(tag as never);

  const name =
    explanation?.name_vi ?? catalogEntry?.shortLabel?.vi ?? tag;
  const explanationVi =
    explanation?.explanation_vi ??
    catalogEntry?.longDescription?.vi ??
    "";

  return (
    <div className="rounded-md border border-amber-200/60 bg-white/70 p-3">
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 h-4 w-4 text-amber-600" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">{name}</p>
          {explanationVi && (
            <p className="mt-1 text-xs text-muted-foreground">
              {explanationVi}
            </p>
          )}

          {onOpenMicroLesson && (
            <button
              type="button"
              onClick={() => onOpenMicroLesson(tag)}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <BookOpen className="h-3 w-3" />
              {WRITING_COPY.microLessonCta.vi}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function EssayFeedbackPanelEmpty() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-primary/15 bg-primary/5 p-4 text-sm text-muted-foreground">
      <CheckCircle2 className="h-4 w-4 text-primary" />
      <span>Bắt đầu viết, rồi nhấn "Nhận phản hồi" để xem điểm.</span>
    </div>
  );
}
