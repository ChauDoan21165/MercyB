// src/pages/exam-prep/IELTSIndexPage.tsx — /exam/ielts

import React from "react";
import { IELTSOverview } from "@/components/exam-prep/ielts/IELTSOverview";
import { PremiumGate } from "@/components/exam-prep/ielts/PremiumGate";
import { IELTS_COPY } from "@/components/exam-prep/ielts/ieltsCopy";

export default function IELTSIndexPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-foreground">
          {IELTS_COPY.pageTitle.vi}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {IELTS_COPY.pageTitle.en}
        </p>
      </header>
      <PremiumGate>
        <IELTSOverview />
      </PremiumGate>
    </div>
  );
}
