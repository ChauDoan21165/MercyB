import TeacherMercyVoiceControls from "@/components/teacher-mercy/TeacherMercyVoiceControls";
import SelfCompareRecorder from "@/components/pronunciation/SelfCompareRecorder";
import { SPEAK_DETAIL_CAP_MESSAGE_VI } from "@/lib/pronunciation/speakDetailGate";
import EnglishPronunciationFeedbackCard from "@/components/ai-tutor/EnglishPronunciationFeedbackCard";
import VietnameseToneFeedbackCard from "@/components/ai-tutor/VietnameseToneFeedbackCard";
import PronunciationProgressTrail from "@/components/ai-tutor/PronunciationProgressTrail";
import type { EnglishPronunciationFeedbackDisplay } from "@/lib/pronunciation/englishPronunciationFeedback";
import type { VietnameseToneFeedbackDisplay } from "@/lib/pronunciation/vietnameseToneFeedback";
import type { PronunciationProgressDisplay } from "@/lib/pronunciation/pronunciationProgressTrail";
import type { TutorCopy } from "@/lib/tutor/tutorCopy";
import type { BilingualText } from "@/lib/tutor/englishOnlyTts";
import { hasDisplayableReadBackWordAccuracy } from "./readBackWordScores";

const VIETNAMESE_LETTER_PATTERN = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

export function isSpeakFollowUpReadAloudEligible(text: string | null | undefined) {
  const trimmed = String(text ?? "").trim();
  return Boolean(trimmed) && (/[a-z]/i.test(trimmed) || VIETNAMESE_LETTER_PATTERN.test(trimmed));
}

export type SpeakPronunciationResult = {
  mode: "local-fallback" | "azure-batch";
  provider?: "local" | "azure";
  overallScore?: number | null;
  toneContour?: {
    bucket: "match" | "mismatch";
    score?: number | null;
    confidence: number;
    expectedContour: "rising" | "falling";
  };
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

type DisplayableAzureWord = NonNullable<SpeakPronunciationResult["words"]>[number] & {
  accuracyScore: number;
};

function isDisplayableAzureWord(
  word: NonNullable<SpeakPronunciationResult["words"]>[number],
): word is DisplayableAzureWord {
  return word.word.trim() !== "" && hasDisplayableReadBackWordAccuracy(word.accuracyScore);
}

type Props = {
  targetSentence: string | null;
  repeatInput: string;
  pronunciationResult?: SpeakPronunciationResult | null;
  /** Premium learner has exhausted the per-session detailed-scoring cap. Shows
   *  a warm message in place of the score; by-ear self-compare stays usable. */
  detailScoreCapReached?: boolean;
  micSupported: boolean;
  micListening: boolean;
  micError?: string | null;
  ttsSupported: boolean;
  ttsSpeaking: boolean;
  ttsPreparing: boolean;
  ttsVoiceSource?: "mercy" | "device" | null;
  ttsError?: string | null;
  ttsErrorScope?: "target" | "follow-up" | null;
  followUpPrompt: BilingualText | null;
  followUpIsPivot: boolean;
  followUpProviderError?: boolean;
  followUpTtsSpeaking: boolean;
  followUpTtsPreparing: boolean;
  englishPronunciationFeedbackEnabled?: boolean;
  englishPronunciationFeedback?: EnglishPronunciationFeedbackDisplay | null;
  vietnameseToneFeedbackEnabled?: boolean;
  vietnameseToneFeedback?: VietnameseToneFeedbackDisplay | null;
  vietnameseToneProgress?: PronunciationProgressDisplay | null;
  englishPronunciationProgress?: PronunciationProgressDisplay | null;
  onMicToggle: () => void;
  onReadTarget: () => void;
  /** Awaitable model-sentence playback (same path as "Mercy đọc"); resolves
   *  true if the model actually spoke. Used by the self-compare by-ear flow. */
  onPlayModel?: () => Promise<boolean>;
  onReadFollowUp: () => void;
  onRetryFollowUp?: () => void;
  onRepeatInputChange: (value: string) => void;
  onResetBoard?: () => void;
  /** True only when the depth-cap pivot fired (not for content-aware bilingual pivots).
   *  Renders the two-button close-out block instead of the next follow-up question. */
  followUpIsCloseOut?: boolean;
  /** Fires when learner taps "check this sentence in the Logic tab" at close-out. */
  onCheckInLogicTab?: () => void;
  /** Fires when learner taps "start a fresh sentence" at close-out. */
  onStartFreshSentence?: () => void;
  tutorCopy: TutorCopy;
};

export default function SpeakPracticeMode({
  targetSentence,
  repeatInput,
  pronunciationResult,
  detailScoreCapReached = false,
  micSupported,
  micListening,
  micError,
  ttsSupported,
  ttsSpeaking,
  ttsPreparing,
  ttsVoiceSource,
  ttsError,
  ttsErrorScope,
  followUpPrompt,
  followUpIsPivot,
  followUpProviderError = false,
  followUpTtsSpeaking,
  followUpTtsPreparing,
  englishPronunciationFeedbackEnabled = false,
  englishPronunciationFeedback = null,
  vietnameseToneFeedbackEnabled = false,
  vietnameseToneFeedback = null,
  vietnameseToneProgress = null,
  englishPronunciationProgress = null,
  onMicToggle,
  onReadTarget,
  onPlayModel,
  onReadFollowUp,
  onRetryFollowUp,
  onRepeatInputChange,
  onResetBoard,
  followUpIsCloseOut = false,
  onCheckInLogicTab,
  onStartFreshSentence,
  tutorCopy,
}: Props) {
  const fallbackTarget = tutorCopy.starterQuestions[0] ?? "What do you usually do in the morning?";
  const practiceTarget = targetSentence?.trim() || fallbackTarget;
  const hasCorrectedTarget = Boolean(targetSentence?.trim());
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
    ? (pronunciationResult.words ?? []).filter(isDisplayableAzureWord)
    : [];
  // Honest gating: a numeric percent is shown ONLY for an audio-gated Azure
  // batch result. The local/text path never produces a displayed score — typed
  // or stale transcript text must never read as a real audio measurement.
  const score = hasAzureBatchResult ? azureOverallScore : null;
  // The feedback card appears only once a real scorer result lands (set by the
  // parent solely when fresh audio/transcript produced it). Typed/stale text in
  // the textarea alone can never surface the card.
  const showFeedbackCard = Boolean(pronunciationResult);
  const toneContour = pronunciationResult?.toneContour;
  const toneContourDirection =
    toneContour?.expectedContour === "rising" ? "đi lên" : "đi xuống";
  const micFallbackMessage = micError
    ? "Không dùng được micro. Hãy cho phép micro trong trình duyệt hoặc gõ câu của bạn."
    : "Không dùng được giọng nói trên thiết bị hoặc trình duyệt này. Bạn vẫn có thể luyện bằng cách nghe câu mẫu trước.";
  const targetTtsError = ttsErrorScope === "follow-up" ? null : ttsError;
  const followUpTtsError = ttsErrorScope === "follow-up" ? ttsError : null;
  const canReadFollowUp = !followUpIsPivot && isSpeakFollowUpReadAloudEligible(followUpPrompt?.en);

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
      {onResetBoard && (
        <button
          type="button"
          onClick={onResetBoard}
          className="mt-3 min-h-10 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-600 transition hover:bg-slate-50"
        >
          Xóa bảng để nhập câu mới
        </button>
      )}

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
                activeLabel="Đang đọc…"
                preparingLabel={tutorCopy.ui.ttsPreparing}
                ariaStart={tutorCopy.ui.ttsAriaPlay}
                ariaStop={tutorCopy.ui.ttsAriaStop}
                onToggle={onReadTarget}
                className="mt-3"
              />
            ) : (
              <div className="mt-2 text-[11px] text-slate-600">{tutorCopy.ui.ttsUnavailable}</div>
            )}
            {ttsVoiceSource && (
              <div className={`mt-2 text-[11px] font-semibold ${ttsVoiceSource === "mercy" ? "text-emerald-700" : "text-amber-700"}`}>
                {ttsVoiceSource === "mercy" ? tutorCopy.ui.ttsMercyVoiceLabel : tutorCopy.ui.ttsDeviceVoiceFallbackLabel}
              </div>
            )}
            {targetTtsError && (
              <div
                className="mt-2 rounded-[12px] border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold leading-5 text-amber-900"
                data-testid="ai-tutor-speak-tts-error"
                role="status"
              >
                <span>{targetTtsError}</span>
                <button
                  type="button"
                  onClick={onReadTarget}
                  className="ml-2 rounded-full border border-amber-300 bg-white px-2 py-0.5 text-[11px] font-black text-amber-900"
                >
                  Thử lại
                </button>
              </div>
            )}
          </div>

          {/* By-ear self-compare: hear the model sentence, record your own
              voice, replay it, compare by ear, and re-record. No score, no
              percent, no ML — independent of the scorer path below. */}
          <SelfCompareRecorder
            referenceText={practiceTarget}
            onPlayModel={onPlayModel}
            className="mt-4 rounded-[16px] border border-emerald-100 bg-emerald-50/60 px-4 py-4"
          />

          <VietnameseToneFeedbackCard
            enabled={vietnameseToneFeedbackEnabled}
            feedback={vietnameseToneFeedback}
          />

          <PronunciationProgressTrail
            enabled={vietnameseToneFeedbackEnabled}
            display={vietnameseToneProgress}
          />

          <EnglishPronunciationFeedbackCard
            enabled={englishPronunciationFeedbackEnabled}
            feedback={englishPronunciationFeedback}
          />

          <PronunciationProgressTrail
            enabled={englishPronunciationFeedbackEnabled}
            display={englishPronunciationProgress}
          />

          <div className="mt-4 rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="text-xs font-black uppercase text-slate-600">
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
              className="mt-3 block text-xs font-black uppercase text-slate-600"
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

          {detailScoreCapReached && (
            <div
              data-testid="ai-tutor-speak-detail-cap"
              role="status"
              className="mt-4 rounded-[16px] border border-amber-200 bg-amber-50 px-4 py-4 text-sm font-bold leading-6 text-amber-900"
            >
              {SPEAK_DETAIL_CAP_MESSAGE_VI}
            </div>
          )}

          {showFeedbackCard && (
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
                    <div
                      data-testid="ai-tutor-speak-word-detail"
                      className="mt-3 rounded-[14px] border border-indigo-100 bg-white px-3 py-3"
                    >
                      <div className="text-xs font-black uppercase text-indigo-700">
                        Độ rõ theo từng từ
                      </div>
                      <p className="mt-1 text-xs font-semibold leading-5 text-indigo-900">
                        Chỉ hiện những từ Azure đo đủ tin cậy.
                      </p>
                      <ul className="mt-3 space-y-2">
                        {azureWords.map((word, wordIndex) => (
                          <li
                            key={`${word.word}-${wordIndex}`}
                            className="rounded-[12px] border border-indigo-100 bg-indigo-50/50 px-3 py-2 text-sm font-semibold leading-6 text-slate-800"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-black text-slate-950">{word.word}</span>
                              <span className="text-xs font-black text-indigo-700">
                                {Math.round(word.accuracyScore)}%
                              </span>
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
                    </div>
                  )}
                </>
              ) : (
                <p
                  data-testid="ai-tutor-speak-listening-note"
                  className="text-sm font-black leading-6 text-indigo-950"
                >
                  Đang nghe, chấm điểm chi tiết sẽ có sau.
                </p>
              )}
              {toneContour && (
                <div
                  data-testid="ai-tutor-speak-tone-contour"
                  className="mt-3 rounded-[12px] border border-indigo-100 bg-white px-3 py-2"
                >
                  <p className="text-sm font-black leading-6 text-indigo-950">
                    {toneContour.bucket === "match"
                      ? `Đường cao độ có vẻ đúng: giọng ${toneContourDirection} như câu mẫu.`
                      : `Đường cao độ có vẻ chưa khớp: câu này nên ${toneContourDirection}.`}
                  </p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-indigo-800">
                    Mercy chỉ đang xem đường giọng, không thay thế nhận xét âm riêng lẻ.
                  </p>
                </div>
              )}
            </div>
          )}

          {!followUpPrompt && followUpProviderError && (
            <div
              data-testid="ai-tutor-speak-follow-up-error"
              className="mt-4 rounded-[16px] border border-amber-200 bg-amber-50 px-4 py-4"
              role="status"
            >
              <p className="text-sm font-bold leading-6 text-amber-900">
                Mercy chưa lấy được câu hỏi tiếp theo. Bấm thử lại nhé.
              </p>
              {onRetryFollowUp && (
                <button
                  type="button"
                  onClick={onRetryFollowUp}
                  className="mt-2 rounded-full border border-amber-300 bg-white px-3 py-1 text-xs font-black text-amber-900"
                >
                  Thử lại
                </button>
              )}
            </div>
          )}

          {followUpPrompt && (
            <div data-testid="ai-tutor-speak-follow-up" className="mt-4 rounded-[16px] border border-slate-200 bg-white px-4 py-4">
              <div className="text-xs font-black uppercase text-slate-600">
                {followUpIsPivot ? "Đổi câu luyện" : "Câu hỏi tiếp theo"}
              </div>

              {followUpIsCloseOut ? (
                /* Close-out affordance: two navigation choices, not a reply from Mercy. */
                <div data-testid="ai-tutor-speak-close-out">
                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">
                    Bạn đã luyện đủ vòng cho câu này.
                  </p>
                  <p className="text-[11px] font-semibold text-slate-600">
                    You've completed this sentence's rounds.
                  </p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      data-testid="ai-tutor-speak-close-logic"
                      onClick={onCheckInLogicTab}
                      className="flex-1 rounded-[12px] border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-black text-indigo-800 transition hover:bg-indigo-100"
                    >
                      Kiểm tra câu trong tab Logic
                      <span className="block text-[10px] font-semibold text-indigo-500">
                        Check this sentence in the Logic tab
                      </span>
                    </button>
                    <button
                      type="button"
                      data-testid="ai-tutor-speak-close-fresh"
                      onClick={onStartFreshSentence}
                      className="flex-1 rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-100"
                    >
                      Bắt đầu câu mới
                      <span className="block text-[10px] font-semibold text-slate-600">
                        Start a fresh sentence
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mt-1 text-sm font-black leading-6 text-slate-900">
                    {followUpPrompt.vi}
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">
                    {followUpPrompt.en}
                  </p>
                  {canReadFollowUp && ttsSupported ? (
                    <TeacherMercyVoiceControls
                      kind="speaker"
                      supported={ttsSupported}
                      active={followUpTtsSpeaking}
                      preparing={followUpTtsPreparing}
                      unavailableLabel={tutorCopy.ui.ttsUnavailable}
                      inactiveLabel="Mercy đọc"
                      activeLabel="Đang đọc…"
                      preparingLabel={tutorCopy.ui.ttsPreparing}
                      ariaStart="Mercy đọc câu hỏi tiếp theo"
                      ariaStop={tutorCopy.ui.ttsAriaStop}
                      onToggle={onReadFollowUp}
                      className="mt-3"
                    />
                  ) : canReadFollowUp ? (
                    <div className="mt-2 text-[11px] text-slate-600">{tutorCopy.ui.ttsUnavailable}</div>
                  ) : null}
                  {canReadFollowUp && followUpTtsError && (
                    <div
                      className="mt-2 rounded-[12px] border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold leading-5 text-amber-900"
                      data-testid="ai-tutor-speak-follow-up-tts-error"
                      role="status"
                    >
                      <span>{followUpTtsError}</span>
                      <button
                        type="button"
                        onClick={onReadFollowUp}
                        className="ml-2 rounded-full border border-amber-300 bg-white px-2 py-0.5 text-[11px] font-black text-amber-900"
                      >
                        Thử lại
                      </button>
                    </div>
                  )}

                  {/* Answer-by-voice for the follow-up. Without this the learner had
                      no recording control attached to the question and would reuse
                      the by-ear SelfCompareRecorder above (which never feeds the
                      loop), trapping Speak on the first sentence. This shares the
                      same mic toggle as "Bạn đọc lại": its STT commit updates the
                      current spoken response and advances to the next follow-up. */}
                  <div className="mt-3" data-testid="ai-tutor-speak-follow-up-answer">
                    <div className="text-xs font-black uppercase text-slate-600">
                      Trả lời câu hỏi này
                    </div>
                    <div className="mt-2">
                      <TeacherMercyVoiceControls
                        kind="mic"
                        supported={micSupported}
                        active={micListening}
                        unavailableLabel={tutorCopy.micLabels.unavailable}
                        inactiveLabel="Trả lời bằng giọng nói"
                        activeLabel={tutorCopy.micLabels.listening}
                        ariaStart="Trả lời câu hỏi bằng giọng nói"
                        ariaStop={tutorCopy.micLabels.ariaStop}
                        onToggle={onMicToggle}
                        fallbackTestId="ai-tutor-speak-follow-up-mic-fallback"
                      />
                    </div>
                    {(!micSupported || micError) && (
                      <p
                        className="mt-2 rounded-[12px] border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold leading-5 text-amber-900"
                        data-testid="ai-tutor-speak-follow-up-mic-fallback-message"
                        role="status"
                      >
                        {micFallbackMessage}
                      </p>
                    )}
                    <p className="mt-2 text-[11px] font-semibold leading-5 text-slate-600">
                      Hoặc gõ câu trả lời vào ô "Gõ câu bạn đọc lại" phía trên.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </>
    </section>
  );
}
