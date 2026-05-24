// src/components/kids/ViKidsEnglishTutor.tsx
// /kids/vi-english hosts the same Mercy Kids floating-box shell used by MercyGuide.

import { useState } from "react";
import MercyGuidePanel from "@/components/mercy-guide/MercyGuidePanel";

type KidsPanelTab = "teacher" | "pronunciation";

export default function ViKidsEnglishTutor() {
  const [activeTab, setActiveTab] = useState<KidsPanelTab>("teacher");

  return (
    <main
      data-testid="vi-kids-english-tutor"
      className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-5xl items-stretch px-3 py-4 sm:px-6 sm:py-6"
    >
      <section
        data-testid="mercy-kids-hosted-floating-shell"
        className="mx-auto h-[calc(100vh-112px)] min-h-[620px] w-full max-w-[760px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl"
      >
        <MercyGuidePanel
          isOpen
          activeTab={activeTab}
          setActiveTab={(nextTab) => {
            setActiveTab(nextTab === "pronunciation" ? "pronunciation" : "teacher");
          }}
          teacherMode="kids"
          isKidsMode
          bubbleLabel="Mercy Kids"
          panelTitle="Mercy Kids"
          journeyTitle="Mercy Kids"
          availableTabs={["teacher", "pronunciation"]}
          hideGrammarTab
          hideLogicTab
          disableTeacherWriting
          disableGrammarAnalysis
          disableEnglishLogic
          preferPronunciationFirst={false}
          preferTapAndRepeat
        />
      </section>
    </main>
  );
}
