import TeacherMercyVoiceControls from "@/components/teacher-mercy/TeacherMercyVoiceControls";
import type { TutorCopy } from "@/lib/tutor/tutorCopy";
import { calculateSentenceMatchPercent } from "@/lib/tutor/speakFollowups";

export type SpeakPronunciationResult = {
  mode: "local-fallback" | "azure-batch";
  provider?: "local" | "azure";
  overallScore?: number | null;
  phonemeScores?: Array<{
    phoneme: string;
    accuracyScore?: number | null;
    word?: string | null;
  }>;
  words?: Array<{
    word: string;
    accuracyScore?: number | null;
    phonemes?: Array<{
      phoneme: string;
      accuracyScore?: number | null;
    }>;
  }>;
};

type Props = {
  targetSentence: string | null;
  repeatInput: string;
  pronunciationResult?: SpeakPronunciationResult | null;
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
  onRepeatInputChange: (value: string) => void;
  tutorCopy: TutorCopy;
};

export default function SpeakPracticeMode({
  targetSentence,
  repeatInput,
  pronunciationResult,
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
  onRepeatInputChange,
  tutorCopy,
}: Props) {
  const fallbackTarget = tutorCopy.starterQuestions[0] ?? "What do you usually do in the morning?";
  const practiceTarget = targetSentence?.trim() || fallbackTarget;
  const hasCorrectedTarget = Boolean(targetSentence?.trim());
  const localScore = practiceTarget && repeatInput.trim()
    ? calculateSentenceMatchPercent(repeatInput, practiceTarget)
    : null;
  const hasAzureBatchResult =
    pronunciationResult?.mode === "azure-batch" &&
    pronunciationResult.provider === "azure";
  const azurePhonemeScores = hasAzureBatchResult
    ? (pronunciationResult.phonemeScores ?? []).filter((score) =>
        score.phoneme.trim())
    : [];
  const hasAzurePhonemeEvidence = azurePhonemeScores.length > 0;
  const azureOverallScore =
    typeof pronunciationResult?.overallScore === "number"
      ? Math.max(0, Math.min(100, Math.round(pronunciationResult.overallScore)))
      : null;
  const azureWords = hasAzureBatchResult
    ? (pronunciationResult.words ?? []).filter((word) => word.word.trim())
    : [];
  const score = hasAzureBatchResult ? azureOverallScore : localScore;
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

      <>
          <div className="mt-4 rounded-[16px] border border-emerald-200 bg-emerald-50 px-4 py-4">
            <div className="text-xs font-black uppercase text-emerald-700">
              {hasCorrectedTarget ? "Câu mẫu" : "Câu luyện"}
            </div>
            <p data-testid="ai-tutor-speak-target" className="mt-1 text-lg font-black leading-7 text-emerald-950">
              {practiceTarget}
            </p>
            {!hasCorrectedTarget && (
              <p data-testid="ai-tutor-speak-generic-prompt" className="mt-2 text-xs font-semibold leading-5 text-emerald-800">
                Chưa có câu đã sửa. Bạn có thể luyện câu mẫu này trước.
              </p>
            )}
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
            <label
              htmlFor="ai-tutor-speak-repeat-input"
              className="mt-3 block text-xs font-black uppercase text-slate-500"
            >
              Gõ câu bạn đọc lại
            </label>
            <textarea
              id="ai-tutor-speak-repeat-input"
              data-testid="ai-tutor-speak-repeat-input"
              value={repeatInput}
              onChange={(event) => onRepeatInputChange(event.target.value)}
              rows={3}
              className="mt-2 w-full rounded-[14px] border border-slate-200 bg-white px-3 py-2 text-sm font-semibold leading-6 text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              placeholder="I bought a hat yesterday."
              aria-label="Gõ câu bạn đọc lại"
            />
          </div>

          {(score !== null || hasAzureBatchResult) && (
            <div data-testid="ai-tutor-speak-score" className="mt-4 rounded-[16px] border border-indigo-100 bg-indigo-50 px-4 py-4">
              {hasAzureBatchResult ? (
                <>
                  {hasAzurePhonemeEvidence ? (
                    <p className="text-sm font-black leading-6 text-indigo-950">
                      Mercy đã chấm phát âm chi tiết hơn bằng từng âm.
                    </p>
                  ) : (
                    <p className="text-sm font-black leading-6 text-indigo-950">
                      Mercy đã nhận kết quả luyện nói.
                    </p>
                  )}
                  {score !== null && (
                    <p className="mt-1 text-sm font-semibold leading-6 text-indigo-900">
                      Điểm tổng thể khoảng {score}%.
                    </p>
                  )}
                  {azureWords.length > 0 && (
                    <ul data-testid="ai-tutor-speak-word-detail" className="mt-3 space-y-2">
                      {azureWords.map((word, wordIndex) => (
                        <li
                          key={`${word.word}-${wordIndex}`}
                          className="rounded-[12px] border border-indigo-100 bg-white px-3 py-2 text-sm font-semibold leading-6 text-slate-800"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-black text-slate-950">{word.word}</span>
                            {typeof word.accuracyScore === "number" && (
                              <span className="text-xs font-black text-indigo-700">
                                {Math.round(word.accuracyScore)}%
                              </span>
                            )}
                          </div>
                          {hasAzurePhonemeEvidence && word.phonemes && word.phonemes.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {word.phonemes.map((phoneme, phonemeIndex) => (
                                <span
                                  key={`${word.word}-${phoneme.phoneme}-${phonemeIndex}`}
                                  className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-bold text-slate-700"
                                >
                                  /{phoneme.phoneme}/
                                  {typeof phoneme.accuracyScore === "number"
                                    ? ` ${Math.round(phoneme.accuracyScore)}%`
                                    : ""}
                                </span>
                              ))}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm font-black leading-6 text-indigo-950">
                    Bạn nói giống câu mẫu khoảng {score}%.
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-indigo-900">
                    Mercy đang nghe theo từ. Sẽ chấm phát âm chi tiết hơn sau.
                  </p>
                </>
              )}
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
    </section>
  );
}
