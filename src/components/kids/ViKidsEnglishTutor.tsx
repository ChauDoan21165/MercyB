import { useState } from "react";
import TeacherMercyLearningShell from "@/components/teacher-mercy/TeacherMercyLearningShell";
import TeacherMercyVoiceControls from "@/components/teacher-mercy/TeacherMercyVoiceControls";
import { useBrowserStt } from "@/lib/ai-tutor/useBrowserStt";
import { useTtsSpeaker } from "@/lib/ai-tutor/useTtsSpeaker";
import {
  VI_KIDS_TUTOR_COPY,
  VI_KIDS_TUTOR_TABS,
  type ViKidsTutorMode,
} from "@/lib/kids/viKidsTutorCopy";

export default function ViKidsEnglishTutor() {
  const [mode, setMode] = useState<ViKidsTutorMode>("journey");
  const [answer, setAnswer] = useState("");
  const stt = useBrowserStt("en-US");
  const tts = useTtsSpeaker();

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
    void tts.speak(VI_KIDS_TUTOR_COPY.speakLine, "en-US", "en");
  };

  return (
    <TeacherMercyLearningShell
      title={VI_KIDS_TUTOR_COPY.title}
      subtitle={VI_KIDS_TUTOR_COPY.subtitle}
      helper={VI_KIDS_TUTOR_COPY.helper}
      eyebrow={VI_KIDS_TUTOR_COPY.eyebrow}
      badge="Kids"
      modeTabs={VI_KIDS_TUTOR_TABS}
      activeMode={mode}
      onModeChange={setMode}
      memorySlot={
        <section className="mx-auto mb-5 w-full max-w-[720px] rounded-[16px] border border-indigo-100 bg-white p-4 shadow-sm">
          <div className="text-xs font-black uppercase text-indigo-500">
            {VI_KIDS_TUTOR_COPY.memoryTitle}
          </div>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
            {VI_KIDS_TUTOR_COPY.memoryBody}
          </p>
        </section>
      }
      footer={VI_KIDS_TUTOR_COPY.footer}
      testId="vi-kids-english-tutor"
    >
      <section className="mx-auto grid w-full max-w-3xl gap-5 rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <div className="text-xs font-black uppercase text-indigo-600">
            English practice · Giải thích tiếng Việt
          </div>
          <h2 className="mt-1 text-xl font-black text-slate-900">
            {mode === "journey" ? VI_KIDS_TUTOR_COPY.conversationTitle : "Mercy luyện cùng bé"}
          </h2>
        </div>

        {mode === "journey" && (
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
                preparingLabel="Đang chuẩn bị..."
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
      </section>
    </TeacherMercyLearningShell>
  );
}
