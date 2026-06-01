// src/features/review/ui/session/GradeButtons.tsx — Lane D / D5
//
// The four FSRS grade buttons. Vietnamese-first, NO shame: "Again" is the
// neutral "Lại" — never "Bạn cần học lại". Each button is labeled with the
// interval it would produce (from scheduler.preview), e.g. "Tốt · 4 ngày".
// Presentational, prop-driven, pure, keyboard-reachable.

import React from "react";
import {
  REVIEW_GRADES,
  type ReviewGrade,
} from "@/features/review/types";
import { formatDays } from "./format";

/** Per-grade interval preview, in days (from scheduler.preview). */
export type GradePreview = Record<ReviewGrade, number>;

export interface GradeButtonsProps {
  previews: GradePreview;
  onGrade: (grade: ReviewGrade) => void;
}

/** Neutral Vietnamese labels — no shame on "again". */
const GRADE_LABEL: Record<ReviewGrade, string> = {
  again: "Lại",
  hard: "Khó",
  good: "Tốt",
  easy: "Dễ",
};

/** Per-grade button color. Calm, not punitive — "Lại" is amber, not red-alarm. */
const GRADE_CLASS: Record<ReviewGrade, string> = {
  again: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  hard: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  good: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
  easy: "bg-sky-100 text-sky-800 hover:bg-sky-200",
};

export function GradeButtons({ previews, onGrade }: GradeButtonsProps) {
  return (
    <div className="grid grid-cols-4 gap-2" data-testid="grade-buttons">
      {REVIEW_GRADES.map((grade) => {
        const label = GRADE_LABEL[grade];
        const interval = formatDays(previews[grade] ?? 0);
        return (
          <button
            key={grade}
            type="button"
            data-grade={grade}
            onClick={() => onGrade(grade)}
            aria-label={`${label} — lần ôn tiếp theo sau ${interval}`}
            className={`flex flex-col items-center gap-0.5 rounded-xl px-2 py-3 text-sm font-medium active:scale-[0.98] ${GRADE_CLASS[grade]}`}
          >
            <span>{label}</span>
            <span className="text-xs font-normal opacity-80">{interval}</span>
          </button>
        );
      })}
    </div>
  );
}
