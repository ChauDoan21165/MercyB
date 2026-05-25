import { Suspense, useState } from "react";
import TeacherMercyLearningShell from "@/components/teacher-mercy/TeacherMercyLearningShell";
import type { TeacherMercyModeTab } from "@/components/teacher-mercy/TeacherMercyModeTabs";
import { VI_KIDS_TUTOR_COPY } from "@/lib/kids/viKidsTutorCopy";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import { getSafetyLabel, viKidsEnglish as viKidsEnglishConfig } from "@/lib/tutor/productConfigs";

// Mercy Kids — two-tab surface: Mercy Teacher + Mercy Speak.
//
// The original 4 modes (Journey / Grammar / Speak / Logic) lived in the
// adult Vietnamese tutor experience and never matched the Kids product
// brief. Trim per /kids/vi-english product call: keep only the
// kids-specific picture browser + Speak panel.
//
// Both tab components are kept kid-safe by `isKidsMode={true}` on the
// MercySpeakTab mount (PR #1165 pins both cloud-recording feature flags
// OFF when isKidsMode is true; see MercySpeakTab.tsx around line 689).
const MercyTeacherTab = lazyWithRetry(
  () => import("@/components/mercy-guide/MercyTeacherTab").then((m) => ({ default: m.MercyTeacherTab })),
);
const MercySpeakTab = lazyWithRetry(() => import("@/components/mercy-guide/MercySpeakTab"));

type ExtendedKidsMode = "kidsTeacher" | "kidsSpeak";

const EXTENDED_KIDS_TABS: TeacherMercyModeTab<ExtendedKidsMode>[] = [
  { id: "kidsTeacher", label: "Mercy Teacher" },
  { id: "kidsSpeak", label: "Mercy Speak" },
];

export default function ViKidsEnglishTutor() {
  const [mode, setMode] = useState<ExtendedKidsMode>("kidsTeacher");

  return (
    <TeacherMercyLearningShell
      title={VI_KIDS_TUTOR_COPY.title}
      subtitle={VI_KIDS_TUTOR_COPY.subtitle}
      helper={VI_KIDS_TUTOR_COPY.helper}
      eyebrow={VI_KIDS_TUTOR_COPY.eyebrow}
      badge={getSafetyLabel(viKidsEnglishConfig)}
      modeTabs={EXTENDED_KIDS_TABS}
      activeMode={mode}
      onModeChange={setMode}
      footer={VI_KIDS_TUTOR_COPY.footer}
      testId="vi-kids-english-tutor"
    >
      {mode === "kidsTeacher" && (
        <div data-testid="vi-kids-mercy-teacher-mount">
          <Suspense
            fallback={
              <div className="rounded-[16px] border border-indigo-100 bg-indigo-50/40 p-4 text-sm font-semibold text-indigo-700">
                Đang tải Mercy Teacher…
              </div>
            }
          >
            <MercyTeacherTab isKidsMode />
          </Suspense>
        </div>
      )}

      {mode === "kidsSpeak" && (
        <div data-testid="vi-kids-mercy-speak-mount">
          <Suspense
            fallback={
              <div className="rounded-[16px] border border-violet-100 bg-violet-50/40 p-4 text-sm font-semibold text-violet-700">
                Đang tải Mercy Speak…
              </div>
            }
          >
            <MercySpeakTab isKidsMode />
          </Suspense>
        </div>
      )}
    </TeacherMercyLearningShell>
  );
}
