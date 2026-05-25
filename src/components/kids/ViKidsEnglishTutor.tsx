import { Suspense, useState } from "react";
import type { KidsPageId } from "@/components/mercy-guide/MercyTeacherTab";
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
  { id: "kidsTeacher", label: "Pick a Picture" },
  { id: "kidsSpeak", label: "Mercy Speak" },
];

export default function ViKidsEnglishTutor() {
  const [mode, setMode] = useState<ExtendedKidsMode>("kidsTeacher");

  // Page + object selection state owned at the tutor level so it
  // survives tab switches: a kid who picks "dog" on the Mercy Teacher
  // tab and switches to Mercy Speak should still see the dog.
  // MercyTeacherTab + MercySpeakTab both accept these props but neither
  // manages the state internally — without the lift here, the page
  // selector defaulted to 'page1' permanently and onSelect* was undefined.
  const [selectedKidsPage, setSelectedKidsPage] = useState<KidsPageId>("page1");
  const [selectedKidsObjectKey, setSelectedKidsObjectKey] = useState<string | null>(null);

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
      {/*
       * Height-bounded mount wrapper. MercyTeacherTab's kids picture grid
       * uses h-full + overflow-y-auto for the scroll container — but
       * `h-full` is percentage of parent. Without a defined-height
       * ancestor, the percentage chain collapses to `auto` and the scroll
       * container has nothing to scroll against. Symptom: /kids/vi-english
       * → Mercy Teacher tab → Page 16 → only first 2-3 rows visible, no
       * scroll. Reserving 290px / 330px of dvh (route header + tutor
       * avatar block + mode tabs + section padding for mobile vs sm+)
       * gives the grid a real pixel height the overflow-y-auto can act on.
       */}
      {mode === "kidsTeacher" && (
        <div
          data-testid="vi-kids-mercy-teacher-mount"
          className="h-[calc(100dvh-290px)] sm:h-[calc(100dvh-330px)]"
        >
          <Suspense
            fallback={
              <div className="rounded-[16px] border border-indigo-100 bg-indigo-50/40 p-4 text-sm font-semibold text-indigo-700">
                Đang tải Pick a Picture…
              </div>
            }
          >
            <MercyTeacherTab
              isKidsMode
              selectedKidsPage={selectedKidsPage}
              onSelectKidsPage={setSelectedKidsPage}
              selectedKidsObjectKey={selectedKidsObjectKey}
              onSelectKidsObject={setSelectedKidsObjectKey}
            />
          </Suspense>
        </div>
      )}

      {mode === "kidsSpeak" && (
        <div
          data-testid="vi-kids-mercy-speak-mount"
          className="h-[calc(100dvh-290px)] sm:h-[calc(100dvh-330px)]"
        >
          <Suspense
            fallback={
              <div className="rounded-[16px] border border-violet-100 bg-violet-50/40 p-4 text-sm font-semibold text-violet-700">
                Đang tải Mercy Speak…
              </div>
            }
          >
            <MercySpeakTab
              isKidsMode
              selectedKidsObjectKey={selectedKidsObjectKey}
            />
          </Suspense>
        </div>
      )}
    </TeacherMercyLearningShell>
  );
}
