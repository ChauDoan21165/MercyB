// src/pages/exam-prep/TOEFLIndexPage.tsx — /exam/toefl
//
// TOEFL iBT prep landing page. Currently a scaffolding placeholder
// with the section overview grid. Individual skill pages will be
// built in follow-up phases.
//
// Pattern mirrors IELTSIndexPage.tsx — thin page component, delegates
// to shared components. Auth-gated at the route level in AppRouter.

import React from "react";
import { TOEFLOverview } from "@/components/exam-prep/toefl/TOEFLOverview";
import { TOEFLPremiumGate } from "@/components/exam-prep/toefl/PremiumGate";
import { TOEFL_COPY } from "@/components/exam-prep/toefl/TOEFLCopy";

export default function TOEFLIndexPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-foreground">
          {TOEFL_COPY.pageTitle.vi}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {TOEFL_COPY.pageTitle.en}
        </p>
      </header>
      <TOEFLPremiumGate>
        <TOEFLOverview />
      </TOEFLPremiumGate>

      {/* TODO(TOEFL): Add section below for:
          - "What's on the TOEFL iBT?" explainer for Vietnamese learners
          - Comparison table: TOEFL vs IELTS vs TOEIC
          - Link to free /exam-prep/toefl content pack (SEO surface)
          - Test-day tips for VN test-takers (IIG Vietnam test centers)
      */}
    </div>
  );
}
