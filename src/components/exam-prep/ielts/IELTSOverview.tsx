// src/components/exam-prep/ielts/IELTSOverview.tsx
//
// Top-level grid surfacing the four IELTS sections + the band
// estimator. Each card links to its dedicated practice page.
// VN-first; English secondary.

import React from "react";
import { Link } from "react-router-dom";
import { Calculator, Clock, Headphones, Mic, BookOpen, Pencil } from "lucide-react";
import {
  IELTS_SECTIONS,
  secondsToMinutes,
  type IELTSSectionId,
} from "@/data/exam-prep/ielts/structure";
import { IELTS_COPY } from "./ieltsCopy";

const SECTION_ROUTES: Record<IELTSSectionId, string> = {
  listening: "/exam/ielts/listening",
  reading: "/exam/ielts/reading",
  writing: "/exam/ielts/writing",
  speaking: "/exam/ielts/speaking",
};

const SECTION_ICON: Record<IELTSSectionId, React.ComponentType<{ size?: number }>> = {
  listening: Headphones,
  reading: BookOpen,
  writing: Pencil,
  speaking: Mic,
};

export function IELTSOverview() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{IELTS_COPY.overviewLead.vi}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {IELTS_SECTIONS.map((section) => {
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
                {section.questionCount !== null && (
                  <>
                    <span>·</span>
                    <span>{section.questionCount} câu</span>
                  </>
                )}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {section.description_vi}
              </p>
            </Link>
          );
        })}
      </div>

      <Link
        to="/exam/ielts/estimator"
        className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4 transition hover:bg-primary/10"
      >
        <div className="flex items-center gap-2">
          <Calculator size={18} />
          <span className="text-sm font-semibold text-foreground">
            {IELTS_COPY.estimatorCta.vi}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">→</span>
      </Link>
    </div>
  );
}
