import TeacherMercyVoiceControls from "@/components/teacher-mercy/TeacherMercyVoiceControls";
import type { TutorCopy } from "@/lib/tutor/tutorCopy";
import { calculateSentenceMatchPercent } from "@/lib/tutor/speakFollowups";

type Props = {
  targetSentence: string | null;
  repeatInput: string;
  micSupported: boolean;
  micListening: boolean;
  micError?: string | null;
  ttsSupported: boolean;
  ttsSpeaking: boolean;
  ttsPreparing: boolean;
  ttsVoiceSource?: "mercy" | "device" | null;
  followUpPrompt: string | null;
  followUpIsPivot: boolean;
  onMicToggle: () => void;
  onReadTarget: () => void;
  tutorCopy: TutorCopy;
};

export default function SpeakPracticeMode({
  targetSentence,
  repeatInput,
  micSupported,
  micListening,
  micError,
  ttsSupported,
  ttsSpeaking,
  ttsPreparing,
  ttsVoiceSource,
  followUpPrompt,
  followUpIsPivot,
  onMicToggle,
  onReadTarget,
  tutorCopy,
}: Props) {
  const hasTarget = Boolean(targetSentence);
  const score = targetSentence && repeatInput.trim()
    ? calculateSentenceMatchPercent(repeatInput, targetSentence)
    : null;
  const micFallbackMessage = micError
    ? "Không dùng được micro. Hãy cho phép micro trong trình duyệt hoặc gõ câu của bạn."
    : "Không dùng được giọng nói trên thiết bị hoặc trình duyệt này. Bạn vẫn có thể luyện bằng cách nghe câu mẫu trước.";

  return (
    <section
      className="mx-auto w-full max-w-3xl rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm"
      data-testid="ai-tutor-speak-practice"
    >
      <div className="text-xs font-black uppercase text-indigo-600">
        Luyện nói
      </div>
      <h2 className="mt-1 text-xl font-black text-slate-900">
        Luyện nói câu đã sửa
      </h2>

      {!hasTarget ? (
        <div data-testid="ai-tutor-speak-generic-prompt" className="mt-4 rounded-[16px] border border-dashed border-slate-200 bg-slate-50 px-4 py-4">
          <p className="text-sm font-bold leading-6 text-slate-700">
            {tutorCopy.starterQuestions[0] ?? "What do you usually do in the morning?"}
          </p>
        </div>
      ) : (
        <>
          <div className="mt-4 rounded-[16px] border border-emerald-200 bg-emerald-50 px-4 py-4">
            <div className="text-xs font-black uppercase text-emerald-700">
              Câu mẫu
            </div>
            <p data-testid="ai-tutor-speak-target" className="mt-1 text-lg font-black leading-7 text-emerald-950">
              {targetSentence}
            </p>
            {ttsSupported ? (
              <TeacherMercyVoiceControls
                kind="speaker"
                supported={ttsSupported}
                active={ttsSpeaking}
                preparing={ttsPreparing}
                unavailableLabel={tutorCopy.ui.ttsUnavailable}
                inactiveLabel="Mercy đọc"
                activeLabel={tutorCopy.ui.ttsStop}
                preparingLabel={tutorCopy.ui.ttsPreparing}
                ariaStart={tutorCopy.ui.ttsAriaPlay}
                ariaStop={tutorCopy.ui.ttsAriaStop}
                onToggle={onReadTarget}
                className="mt-3"
              />
            ) : (
              <div className="mt-2 text-[11px] text-slate-500">{tutorCopy.ui.ttsUnavailable}</div>
            )}
            {ttsVoiceSource && (
              <div className={`mt-2 text-[11px] font-semibold ${ttsVoiceSource === "mercy" ? "text-emerald-700" : "text-amber-700"}`}>
                {ttsVoiceSource === "mercy" ? tutorCopy.ui.ttsMercyVoiceLabel : tutorCopy.ui.ttsDeviceVoiceFallbackLabel}
              </div>
            )}
          </div>

          <div className="mt-4 rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="text-xs font-black uppercase text-slate-500">
              Bạn đọc lại
            </div>
            <div className="mt-3">
              <TeacherMercyVoiceControls
                kind="mic"
                supported={micSupported}
                active={micListening}
                unavailableLabel={tutorCopy.micLabels.unavailable}
                inactiveLabel={tutorCopy.micLabels.input}
                activeLabel={tutorCopy.micLabels.listening}
                ariaStart={tutorCopy.micLabels.ariaStart}
                ariaStop={tutorCopy.micLabels.ariaStop}
                onToggle={onMicToggle}
                fallbackTestId="ai-tutor-conversation-mic-fallback"
              />
            </div>
            {(!micSupported || micError) && (
              <p
                className="mt-2 rounded-[12px] border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold leading-5 text-amber-900"
                data-testid="ai-tutor-speak-mic-fallback-message"
                role="status"
              >
                {micFallbackMessage}
              </p>
            )}
            {repeatInput.trim() && (
              <p data-testid="ai-tutor-speak-transcript" className="mt-3 text-sm font-semibold leading-6 text-slate-700">
                {repeatInput}
              </p>
            )}
          </div>

          {score !== null && (
            <div data-testid="ai-tutor-speak-score" className="mt-4 rounded-[16px] border border-indigo-100 bg-indigo-50 px-4 py-4">
              <p className="text-sm font-black leading-6 text-indigo-950">
                Bạn nói giống câu mẫu khoảng {score}%.
              </p>
              <p className="mt-1 text-sm font-semibold leading-6 text-indigo-900">
                Mercy đang nghe theo từ. Sẽ chấm phát âm chi tiết hơn sau.
              </p>
            </div>
          )}

          {followUpPrompt && (
            <div data-testid="ai-tutor-speak-follow-up" className="mt-4 rounded-[16px] border border-slate-200 bg-white px-4 py-4">
              <div className="text-xs font-black uppercase text-slate-500">
                {followUpIsPivot ? "Đổi câu luyện" : "Câu hỏi tiếp theo"}
              </div>
              <p className="mt-1 text-sm font-black leading-6 text-slate-900">
                {followUpPrompt}
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
