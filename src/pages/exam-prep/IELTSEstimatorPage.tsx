// src/pages/exam-prep/IELTSEstimatorPage.tsx — /exam/ielts/estimator

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { IELTSBandEstimator } from "@/components/exam-prep/ielts/IELTSBandEstimator";
import { PremiumGate } from "@/components/exam-prep/ielts/PremiumGate";
import { IELTS_COPY } from "@/components/exam-prep/ielts/ieltsCopy";

export default function IELTSEstimatorPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          {IELTS_COPY.estimatorTitle.vi}
        </h1>
        <Button asChild size="sm" variant="ghost">
          <Link to="/exam/ielts">{IELTS_COPY.backToOverview.vi}</Link>
        </Button>
      </header>
      <PremiumGate>
        <IELTSBandEstimator />
      </PremiumGate>
    </div>
  );
}
