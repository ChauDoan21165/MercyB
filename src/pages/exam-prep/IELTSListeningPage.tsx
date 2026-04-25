// src/pages/exam-prep/IELTSListeningPage.tsx — /exam/ielts/listening

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { IELTSListeningPractice } from "@/components/exam-prep/ielts/IELTSListeningPractice";
import { PremiumGate } from "@/components/exam-prep/ielts/PremiumGate";
import { IELTS_COPY } from "@/components/exam-prep/ielts/ieltsCopy";
import samples from "@/data/exam-prep/ielts/sample-questions.json";

export default function IELTSListeningPage() {
  const l = (samples as typeof samples).listening;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          {IELTS_COPY.listeningTitle.vi}
        </h1>
        <Button asChild size="sm" variant="ghost">
          <Link to="/exam/ielts">{IELTS_COPY.backToOverview.vi}</Link>
        </Button>
      </header>

      <PremiumGate>
        <IELTSListeningPractice
          audioUrl={l.audio_placeholder_url}
          transcript_en={l.transcript_en}
          questions={l.questions}
        />
      </PremiumGate>
    </div>
  );
}
