// src/pages/writing/WritingFeedbackPage.tsx
//
// /writing-feedback — auth-gated page (route guard set in AppRouter).
// Pairs EssayInputForm with EssayFeedbackPanel; the rubric stays in
// component-local state until the user submits a new essay.
//
// VN-rubric integration (PR #ielts-writing-vn-rubric):
//   When the `vn_writing_feedback` feature flag is ON, the page runs
//   the Vietnamese-learner-aware scorer (`scoreEssayForVietnameseLearner`)
//   and renders the new `<WritingFeedbackVN>` panel instead of the
//   generic `<EssayFeedbackPanel>`. The base scoreEssay rubric is still
//   computed (it's the input to the VN scorer) — existing IELTS / TOEIC
//   surfaces that import scoreEssay directly are unaffected.

import React, { useState } from "react";
import { EssayInputForm } from "@/components/writing/EssayInputForm";
import {
  EssayFeedbackPanel,
  EssayFeedbackPanelEmpty,
} from "@/components/writing/EssayFeedbackPanel";
import { WritingFeedbackVN } from "@/components/writing/WritingFeedbackVN";
import { WRITING_COPY } from "@/components/writing/writingFeedbackCopy";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import type { WritingRubric } from "@/lib/writing-feedback/rubric";
import {
  scoreEssayForVietnameseLearner,
  type VnEnhancedFeedback,
} from "@/lib/writing-feedback/scoreEssayVN";

export default function WritingFeedbackPage() {
  const [rubric, setRubric] = useState<WritingRubric | null>(null);
  const [vnFeedback, setVnFeedback] = useState<VnEnhancedFeedback | null>(null);
  const { enabled: vnFlagEnabled } = useFeatureFlag("vn_writing_feedback", false);

  const handleScored = (r: WritingRubric, text: string) => {
    setRubric(r);
    if (vnFlagEnabled) {
      setVnFeedback(scoreEssayForVietnameseLearner(text));
    } else {
      setVnFeedback(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-foreground">
          {WRITING_COPY.pageTitle.vi}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {WRITING_COPY.pageIntro.vi}
        </p>
        {vnFlagEnabled ? (
          <p className="mt-2 text-xs font-semibold text-rose-700">
            {WRITING_COPY.vnFeedbackBanner.vi}
            <span className="ml-1 font-normal text-rose-700/70">
              · {WRITING_COPY.vnFeedbackBanner.en}
            </span>
          </p>
        ) : null}
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <section>
          <EssayInputForm onScored={handleScored} />
        </section>

        <section>
          {vnFlagEnabled && vnFeedback ? (
            <WritingFeedbackVN feedback={vnFeedback} />
          ) : rubric ? (
            <EssayFeedbackPanel rubric={rubric} />
          ) : (
            <EssayFeedbackPanelEmpty />
          )}
        </section>
      </div>
    </div>
  );
}
