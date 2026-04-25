// src/pages/writing/WritingFeedbackPage.tsx
//
// /writing-feedback — auth-gated page (route guard set in AppRouter).
// Pairs EssayInputForm with EssayFeedbackPanel; the rubric stays in
// component-local state until the user submits a new essay.

import React, { useState } from "react";
import { EssayInputForm } from "@/components/writing/EssayInputForm";
import {
  EssayFeedbackPanel,
  EssayFeedbackPanelEmpty,
} from "@/components/writing/EssayFeedbackPanel";
import { WRITING_COPY } from "@/components/writing/writingFeedbackCopy";
import type { WritingRubric } from "@/lib/writing-feedback/rubric";

export default function WritingFeedbackPage() {
  const [rubric, setRubric] = useState<WritingRubric | null>(null);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-foreground">
          {WRITING_COPY.pageTitle.vi}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {WRITING_COPY.pageIntro.vi}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <section>
          <EssayInputForm onScored={(r) => setRubric(r)} />
        </section>

        <section>
          {rubric ? (
            <EssayFeedbackPanel rubric={rubric} />
          ) : (
            <EssayFeedbackPanelEmpty />
          )}
        </section>
      </div>
    </div>
  );
}
