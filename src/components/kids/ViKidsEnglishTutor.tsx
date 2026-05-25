import { Suspense, useEffect, useState } from "react";
import TutorMemoryCard, { TutorMemoryEmpty } from "@/components/ai-tutor/TutorMemoryCard";
import TeacherMercyLearningShell from "@/components/teacher-mercy/TeacherMercyLearningShell";
import type { TeacherMercyModeTab } from "@/components/teacher-mercy/TeacherMercyModeTabs";
import TeacherMercyVoiceControls from "@/components/teacher-mercy/TeacherMercyVoiceControls";
import { getMemorySummary, type MemorySummary, type TutorProduct } from "@/lib/ai-tutor/learningMemory";
import { useBrowserStt } from "@/lib/ai-tutor/useBrowserStt";
import { useTtsSpeaker } from "@/lib/ai-tutor/useTtsSpeaker";
import {
  VI_KIDS_TUTOR_COPY,
  VI_KIDS_TUTOR_TABS,
  type ViKidsTutorMode,
} from "@/lib/kids/viKidsTutorCopy";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import { getSpeechLocale, getTtsLocale, type TutorLanguageCode } from "@/lib/tutor/languageRegistry";
import { getSafetyLabel, viKidsEnglish as viKidsEnglishConfig } from "@/lib/tutor/productConfigs";

// MercyTeacherTab was orphaned by PR #1093 (floating-helper simplification);
// remounted here in kids mode. MercyTeacherTab has an explicit `if (isKidsMode)`
// early-return diversion to a kids-safe pipeline, so passing `isKidsMode` actually
// neuters the adult path.
//
// MercySpeakTab is intentionally NOT mounted here. PR #1141 mounted it without
// `isKidsMode`, and even with the prop the adult path remains reachable: the
// `startRecording()` function calls `navigator.mediaDevices.getUserMedia({audio: true})`
// + `new MediaRecorder(stream)` gated only by `supportsMediaRecording`, not by
// `isKidsMode`. `scoreCloud()` (cloud audio upload) is similarly ungated. The
// `isKidsMode` flag inside MercySpeakTab only swaps the displayed sentence + image;
// it does NOT gate the recording/upload branch. Mounting MercySpeakTab on
// /kids/vi-english — with or without the prop — violates CLAUDE.md #2 (Kids mode
// is sacred. No raw audio.) and the viKidsEnglish productConfig
// (`rawAudioAllowed: false`, `transcriptStorageAllowed: false`).
//
// Restoring user-reachable Mercy Speak on the kids page requires first hardening
// MercySpeakTab itself to gate `startRecording()` + `scoreCloud()` behind
// `isKidsMode === false`. Tracked as a follow-up.
const MercyTeacherTab = lazyWithRetry(
  () => import("@/components/mercy-guide/MercyTeacherTab").then((m) => ({ default: m.MercyTeacherTab })),
);

const TUTOR_PRODUCT: TutorProduct = "vi-kids-english";
const TARGET_LANGUAGE = viKidsEnglishConfig.defaultTargetLanguage as TutorLanguageCode;

// Local extension of ViKidsTutorMode for the two restored kids surfaces.
// Kept local (rather than extending the productConfigs TutorProductMode
// union) to keep this change contained to /kids/vi-english per the
// Option B dispatch — the new modes are kids-specific tabs, not a
// product-wide modes-list change.
type ExtendedKidsMode = ViKidsTutorMode | "kidsTeacher";

const EXTENDED_KIDS_TABS: TeacherMercyModeTab<ExtendedKidsMode>[] = [
  ...VI_KIDS_TUTOR_TABS,
  { id: "kidsTeacher", label: "Mercy Teacher" },
];

export default function ViKidsEnglishTutor() {
  const [mode, setMode] = useState<ExtendedKidsMode>("conversation");
  const [answer, setAnswer] = useState("");
  const [memoryLoaded, setMemoryLoaded] = useState(false);
  const [memory, setMemory] = useState<MemorySummary | null>(null);
  const stt = useBrowserStt(getSpeechLocale(TARGET_LANGUAGE));
  const tts = useTtsSpeaker();

  useEffect(() => {
    if (!viKidsEnglishConfig.memoryEnabled) {
      void getMemorySummary(TUTOR_PRODUCT, TARGET_LANGUAGE);
      setMemoryLoaded(true);
      return;
    }
    getMemorySummary(TUTOR_PRODUCT, TARGET_LANGUAGE)
      .then(setMemory)
      .catch(() => {})
      .finally(() => setMemoryLoaded(true));
  }, []);

  const handleMicToggle = () => {
    if (stt.listening) {
      stt.stop();
      return;
    }
    stt.start();
  };

  const speakLine = () => {
    if (tts.speaking) {
      tts.stop();
      return;
    }
    void tts.speak(VI_KIDS_TUTOR_COPY.speakLine, getTtsLocale(TARGET_LANGUAGE), TARGET_LANGUAGE, {
      voiceStyle: "kid-friendly",
    });
  };

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
      memorySlot={viKidsEnglishConfig.memoryEnabled ? <TutorMemoryCard memoryLoaded={memoryLoaded} memory={memory} /> : undefined}
      reminderSlot={viKidsEnglishConfig.memoryEnabled ? <TutorMemoryEmpty memoryLoaded={memoryLoaded} memory={memory} /> : undefined}
      footer={VI_KIDS_TUTOR_COPY.footer}
      testId="vi-kids-english-tutor"
    >
      <section className="mx-auto grid w-full max-w-3xl gap-5 rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <div className="text-xs font-black uppercase text-indigo-600">
            English practice · Giải thích tiếng Việt
          </div>
          <h2 className="mt-1 text-xl font-black text-slate-900">
            {mode === "conversation" ? VI_KIDS_TUTOR_COPY.conversationTitle : "Mercy luyện cùng bé"}
          </h2>
        </div>

        {mode === "conversation" && (
          <div className="rounded-[16px] border border-indigo-100 bg-indigo-50/60 p-4">
            <p className="text-sm font-bold leading-6 text-slate-700">
              {VI_KIDS_TUTOR_COPY.conversationQuestion}
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-indigo-700">
              {VI_KIDS_TUTOR_COPY.conversationHint}
            </p>
          </div>
        )}

        {mode === "grammar" && (
          <div className="grid gap-3">
            <div className="rounded-[16px] border border-emerald-200 bg-emerald-50 p-4">
              <div className="text-xs font-black uppercase text-emerald-600">
                {VI_KIDS_TUTOR_COPY.correctedLabel}
              </div>
              <p className="mt-1 text-lg font-black text-emerald-900">
                {VI_KIDS_TUTOR_COPY.correctedExample}
              </p>
            </div>
            <div className="rounded-[16px] border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-black uppercase text-slate-500">
                {VI_KIDS_TUTOR_COPY.explanationLabel}
              </div>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">
                {VI_KIDS_TUTOR_COPY.explanation}
              </p>
            </div>
            {tts.voiceSource && (
              <div className={`mt-2 text-[11px] font-semibold ${tts.voiceSource === "mercy" ? "text-emerald-700" : "text-amber-700"}`}>
                {tts.voiceSource === "mercy" ? "Mercy voice" : "Device voice fallback"}
              </div>
            )}
          </div>
        )}

        {mode === "speak" && (
          <div className="rounded-[16px] border border-violet-200 bg-violet-50/60 p-4">
            <p className="text-lg font-black text-violet-900">
              {VI_KIDS_TUTOR_COPY.speakLine}
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <TeacherMercyVoiceControls
                kind="speaker"
                supported={tts.supported}
                active={tts.speaking}
                preparing={tts.preparing}
                unavailableLabel={VI_KIDS_TUTOR_COPY.ttsUnavailable}
                inactiveLabel={VI_KIDS_TUTOR_COPY.ttsPlay}
                activeLabel={VI_KIDS_TUTOR_COPY.ttsStop}
                preparingLabel="Preparing Mercy voice…"
                ariaStart="Mercy đọc câu tiếng Anh"
                ariaStop="Dừng Mercy đọc"
                onToggle={speakLine}
              />
              <TeacherMercyVoiceControls
                kind="mic"
                supported={stt.supported}
                active={stt.listening}
                unavailableLabel={VI_KIDS_TUTOR_COPY.micUnavailable}
                inactiveLabel={VI_KIDS_TUTOR_COPY.micInput}
                activeLabel={VI_KIDS_TUTOR_COPY.micListening}
                ariaStart={VI_KIDS_TUTOR_COPY.micAriaStart}
                ariaStop={VI_KIDS_TUTOR_COPY.micAriaStop}
                onToggle={handleMicToggle}
              />
            </div>
          </div>
        )}

        {mode === "logic" && (
          <div className="rounded-[16px] border border-amber-200 bg-amber-50/60 p-4">
            <p className="text-sm font-bold leading-6 text-amber-900">
              {VI_KIDS_TUTOR_COPY.logicTask}
            </p>
          </div>
        )}

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

        {mode !== "kidsTeacher" && (
          <>
            <label className="text-xs font-black uppercase text-slate-500">
              {VI_KIDS_TUTOR_COPY.correctionPrompt}
            </label>
            <textarea
              value={answer || stt.transcript}
              onChange={(event) => setAnswer(event.target.value.slice(0, 300))}
              placeholder={VI_KIDS_TUTOR_COPY.correctionPlaceholder}
              rows={3}
              className="w-full resize-none rounded-[14px] border border-slate-200 bg-slate-50 p-3 text-[15px] leading-relaxed text-slate-900 placeholder-slate-400 transition focus:border-indigo-300 focus:bg-white focus:outline-none"
            />
          </>
        )}
      </section>
    </TeacherMercyLearningShell>
  );
}
