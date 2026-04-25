// src/pages/exam-prep/IELTSWritingPage.tsx — /exam/ielts/writing

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { IELTSWritingTask } from "@/components/exam-prep/ielts/IELTSWritingTask";
import { PremiumGate } from "@/components/exam-prep/ielts/PremiumGate";
import { IELTS_COPY } from "@/components/exam-prep/ielts/ieltsCopy";
import samples from "@/data/exam-prep/ielts/sample-questions.json";

type ActiveTask = "writing_task_1" | "writing_task_2";

export default function IELTSWritingPage() {
  const [active, setActive] = useState<ActiveTask>("writing_task_1");

  const w = (samples as typeof samples).writing;
  const t = active === "writing_task_1" ? w.task_1 : w.task_2;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          {IELTS_COPY.writingTitle.vi}
        </h1>
        <Button asChild size="sm" variant="ghost">
          <Link to="/exam/ielts">{IELTS_COPY.backToOverview.vi}</Link>
        </Button>
      </header>

      <PremiumGate>
        <div className="mb-3 flex gap-2">
          <Button
            size="sm"
            variant={active === "writing_task_1" ? "default" : "ghost"}
            onClick={() => setActive("writing_task_1")}
          >
            Task 1
          </Button>
          <Button
            size="sm"
            variant={active === "writing_task_2" ? "default" : "ghost"}
            onClick={() => setActive("writing_task_2")}
          >
            Task 2
          </Button>
        </div>

        <IELTSWritingTask
          taskId={active}
          prompt_vi={t.prompt_vi}
          prompt_en={t.prompt_en}
          minWords={t.min_words}
          recommendedSec={active === "writing_task_1" ? 20 * 60 : 40 * 60}
        />
      </PremiumGate>
    </div>
  );
}
