// src/pages/exam-prep/IELTSWritingPage.tsx — /exam/ielts/writing

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { IELTSWritingTask } from "@/components/exam-prep/ielts/IELTSWritingTask";
import { PremiumGate } from "@/components/exam-prep/ielts/PremiumGate";
import { IELTS_COPY } from "@/components/exam-prep/ielts/ieltsCopy";
import samples from "@/data/exam-prep/ielts/sample-questions.json";
import { IELTS_WRITING_TOPICS } from "@/data/exam-prep/ielts/writing-topics";

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

      {/* Task 2 topic catalogue — each entry links to its dedicated SEO
          landing page. Surfaces additional Vietnamese-relevant prompts
          beyond the single example in sample-questions.json. */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-1">
          Chủ đề Task 2 phổ biến · Popular Task 2 topics
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Mẹo, dàn bài và từ vựng cho từng chủ đề — viết riêng cho người Việt.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {IELTS_WRITING_TOPICS.map((topic) => (
            <li key={topic.id}>
              <Link
                to={`/ielts/writing/topic/${topic.id}`}
                className="block rounded-lg border border-border bg-card p-3 hover:bg-accent text-sm"
              >
                <div className="font-semibold">{topic.topic_title_vi}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {topic.topic_title_en}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
