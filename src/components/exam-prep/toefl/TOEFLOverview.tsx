// src/components/exam-prep/toefl/TOEFLOverview.tsx
//
// Top-level grid surfacing the four TOEFL sections + the score
// estimator. Each card links to its dedicated practice page.
// VN-first; English secondary.
//
// Pattern mirrors IELTSOverview.tsx — same grid layout, same icon
// pattern, same bilingual card structure.

import React from "react";
import { Link } from "react-router-dom";
import { Calculator, Clock, Headphones, Mic, BookOpen, Pencil } from "lucide-react";
import {
  TOEFL_SECTIONS,
  secondsToMinutes,
  type TOEFLSectionId,
} from "@/data/exam-prep/toefl/structure";
import { TOEFL_COPY } from "./TOEFLCopy";

const SECTION_ROUTES: Record<TOEFLSectionId, string> = {
  reading: "/exam/toefl/reading",
  listening: "/exam/toefl/listening",
  speaking: "/exam/toefl/speaking",
  writing: "/exam/toefl/writing",
};

const SECTION_ICON: Record<TOEFLSectionId, React.ComponentType<{ size?: number }>> = {
  reading: BookOpen,
  listening: Headphones,
  speaking: Mic,
  writing: Pencil,
};

export function TOEFLOverview() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{TOEFL_COPY.overviewLead.vi}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {TOEFL_SECTIONS.map((section) => {
          const Icon = SECTION_ICON[section.id];
          return (
            <Link
              key={section.id}
              to={SECTION_ROUTES[section.id]}
              className="rounded-xl border border-primary/15 bg-white/80 p-4 transition hover:bg-primary/5"
            >
              <div className="flex items-center gap-2">
                <Icon size={18} />
                <p className="text-sm font-semibold text-foreground">
                  {section.name_vi}
                </p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {section.name_en}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock size={12} />
                <span>{secondsToMinutes(section.durationSec)} phút</span>
                <span>·</span>
                <span>
                  {section.questionCount}{" "}
                  {section.id === "speaking" || section.id === "writing"
                    ? "tasks"
                    : "câu"}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {section.description_vi}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Score estimator CTA */}
      <Link
        to="/exam/toefl/estimator"
        className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4 transition hover:bg-primary/10"
      >
        <div className="flex items-center gap-2">
          <Calculator size={18} />
          <span className="text-sm font-semibold text-foreground">
            {TOEFL_COPY.estimatorCta.vi}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">→</span>
      </Link>
    </div>
  );
}
