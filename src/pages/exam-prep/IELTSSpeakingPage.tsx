// src/pages/exam-prep/IELTSSpeakingPage.tsx — /exam/ielts/speaking

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { IELTSSpeakingPractice } from "@/components/exam-prep/ielts/IELTSSpeakingPractice";
import { PremiumGate } from "@/components/exam-prep/ielts/PremiumGate";
import { IELTS_COPY } from "@/components/exam-prep/ielts/ieltsCopy";
import { IELTS_SPEAKING_TOPICS } from "@/data/exam-prep/ielts/speaking-topics";
import samples from "@/data/exam-prep/ielts/sample-questions.json";

type Part = "part_1" | "part_2" | "part_3";

const FIRST_TOPIC_BY_PART = {
  part_1: IELTS_SPEAKING_TOPICS.find((topic) => topic.part === 1),
  part_2: IELTS_SPEAKING_TOPICS.find((topic) => topic.part === 2),
  part_3: IELTS_SPEAKING_TOPICS.find((topic) => topic.part === 3),
} as const;

export default function IELTSSpeakingPage() {
  const [active, setActive] = useState<Part>("part_1");
  const s = (samples as typeof samples).speaking;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          {IELTS_COPY.speakingTitle.vi}
        </h1>
        <Button asChild size="sm" variant="ghost">
          <Link to="/exam/ielts">{IELTS_COPY.backToOverview.vi}</Link>
        </Button>
      </header>

      <PremiumGate>
        <div className="mb-3 flex gap-2">
          <Button
            size="sm"
            variant={active === "part_1" ? "default" : "ghost"}
            onClick={() => setActive("part_1")}
          >
            Part 1
          </Button>
          <Button
            size="sm"
            variant={active === "part_2" ? "default" : "ghost"}
            onClick={() => setActive("part_2")}
          >
            Part 2
          </Button>
          <Button
            size="sm"
            variant={active === "part_3" ? "default" : "ghost"}
            onClick={() => setActive("part_3")}
          >
            Part 3
          </Button>
        </div>

        {active === "part_1" && (
          <IELTSSpeakingPractice
            topicId={FIRST_TOPIC_BY_PART.part_1?.id}
            partTitle={IELTS_COPY.speakingPart1.vi}
            prompts_vi={s.part_1.prompts_vi}
            prompts_en={s.part_1.prompts_en}
            sample_answer_band_7={FIRST_TOPIC_BY_PART.part_1?.sample_strong_answer_band_7}
            sample_answer_band_5={FIRST_TOPIC_BY_PART.part_1?.sample_weak_answer_band_5}
          />
        )}

        {active === "part_2" && (
          <IELTSSpeakingPractice
            topicId={FIRST_TOPIC_BY_PART.part_2?.id}
            partTitle={IELTS_COPY.speakingPart2.vi}
            prompts_vi={[s.part_2.prompt_vi]}
            prompts_en={[s.part_2.prompt_en]}
            countdownSec={s.part_2.preparation_sec + s.part_2.speaking_sec}
            sample_answer_band_7={FIRST_TOPIC_BY_PART.part_2?.sample_strong_answer_band_7}
            sample_answer_band_5={FIRST_TOPIC_BY_PART.part_2?.sample_weak_answer_band_5}
          />
        )}

        {active === "part_3" && (
          <IELTSSpeakingPractice
            topicId={FIRST_TOPIC_BY_PART.part_3?.id}
            partTitle={IELTS_COPY.speakingPart3.vi}
            prompts_vi={s.part_3.prompts_vi}
            prompts_en={s.part_3.prompts_en}
            sample_answer_band_7={FIRST_TOPIC_BY_PART.part_3?.sample_strong_answer_band_7}
            sample_answer_band_5={FIRST_TOPIC_BY_PART.part_3?.sample_weak_answer_band_5}
          />
        )}
      </PremiumGate>
    </div>
  );
}
