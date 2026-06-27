// src/components/ai-tutor/ConversationMode.tsx
// Chat-style Teacher Mercy practice mode. Local/mock only; no provider calls.

import { Send, Square, Volume2, Lock, RotateCcw } from "lucide-react";
import type { TutorTurn } from "@/lib/tutor/tutorTypes";
import type { TutorCopy } from "@/lib/tutor/tutorCopy";
import type { VietlishLogicDiagnosisResult } from "@/lib/tutor/vietlishLogicEngine";
import type { ConversationPronunciationResult } from "@/lib/pronunciation/conversationPronunciation";
import TeacherMercyVoiceControls from "@/components/teacher-mercy/TeacherMercyVoiceControls";

/**
 * Premium gate state for the conversation engine (Steps 8-9-10).
 * IMPORTANT (standing CEO directive): the PARENT computes `isPremium` from subscription
 * status + current_period_end + provider — NEVER from a Stripe `price_id`. This component
 * only renders the gate; it derives no entitlement itself.
 * Omit the prop entirely (legacy callers) to render with no gate.
 */
export type ConversationEntitlement = {
  isPremium: boolean;
};

/** 50-turn/session cost-cap surface. Engine owns the counting; UI only renders it. */
export type ConversationTurnUsage = {
  used: number;
  limit: number;
};

/**
 * Engine abstention redirect. When the engine is not confident (null pronunciation score,
 * low-confidence interference/Vietlish call) it MUST redirect into engaging practice rather
 * than dead-end. The component renders the engine-provided, Vietnamese-primary redirect prompt
 * and keeps the input live so the learner can continue.
 */
export type ConversationAbstentionRedirect = {
  redirectPrompt: string;
};

export type UserConversationMessage = {
  id: string;
  role: "user";
  text: string;
};

export type MercyConversationMessage = TutorTurn & {
  role: "mercy";
  logicDiagnosis?: VietlishLogicDiagnosisResult;
};

export type ConversationMessage = UserConversationMessage | MercyConversationMessage;

type Props = {
  mode: "journey" | "speak" | "logic";
  messages: ConversationMessage[];
  input: string;
  setInput: (value: string) => void;
  loading: boolean;
  micSupported: boolean;
  micListening: boolean;
  micError?: string | null;
  ttsSupported: boolean;
  ttsSpeaking: boolean;
  ttsPreparing: boolean;
  ttsVoiceSource?: "mercy" | "device" | null;
  speakingMessageId: string | null;
  onSend: () => void;
  onMicToggle: () => void;
  onSpeak: (message: MercyConversationMessage) => void;
  onStartCorrection?: () => void;
  tutorCopy: TutorCopy;
  /** Engine contract (Steps 8-9-10). All optional + additive so legacy callers are unaffected. */
  entitlement?: ConversationEntitlement;
  turnUsage?: ConversationTurnUsage;
  /** Per-turn pronunciation result keyed by learner message id. Only present when the learner
   * actually recorded audio for that turn. A null/absent entry => no score is rendered. */
  pronunciationByMessageId?: Record<string, ConversationPronunciationResult | null | undefined>;
  abstentionRedirect?: ConversationAbstentionRedirect | null;
  onUpgrade?: () => void;
  /** Start-over control for speech recording. Parent clears the audio buffer + recording state
   * so no stale recorded audio can be submitted. UI only signals intent; it holds no buffer. */
  onClearRecording?: () => void;
  /** True when there is recorded/in-progress audio the learner could discard. Drives the
   * "Làm lại" control's enabled state; omit/false => enabled only when there is typed input. */
  hasRecording?: boolean;
};

export default function ConversationMode({
  mode,
  messages,
  input,
  setInput,
  loading,
  micSupported,
  micListening,
  micError,
  ttsSupported,
  ttsSpeaking,
  ttsPreparing,
  ttsVoiceSource,
  speakingMessageId,
  onSend,
  onMicToggle,
  onSpeak,
  onStartCorrection,
  tutorCopy,
  entitlement,
  turnUsage,
  pronunciationByMessageId,
  abstentionRedirect,
  onUpgrade,
  onClearRecording,
  hasRecording,
}: Props) {
  const isEmpty = !input.trim();
  const isLogicMode = mode === "logic";
  const { ui } = tutorCopy;
  // Recording start-over ("Làm lại"): only where speech recording is possible (non-logic modes)
  // and only when there is something to discard — live recording, captured audio, or typed text.
  // Reset never submits; it clears the parent's audio buffer + recording state and the textarea,
  // so stale audio can never be sent.
  const canResetRecording =
    !isLogicMode && Boolean(onClearRecording) && (micListening || Boolean(hasRecording) || !isEmpty);
  const handleResetRecording = () => {
    onClearRecording?.();
    setInput("");
  };
  // Premium-only conversation engine. Gate only when the parent supplied entitlement and the
  // learner is not premium; legacy callers (no entitlement prop) are never gated.
  const isPremiumGated = entitlement ? !entitlement.isPremium : false;
  // 50-turn/session cost cap. At the cap we keep the screen usable (never a dead-end) but stop
  // new sends so we don't exceed the ~$0.01/session ceiling.
  const atTurnCap = turnUsage ? turnUsage.used >= turnUsage.limit : false;
  const turnsRemaining = turnUsage ? Math.max(0, turnUsage.limit - turnUsage.used) : null;
  const allowTts = mode !== "logic";
  const showMicFallback = mode === "speak" && !isLogicMode && (!micSupported || Boolean(micError));
  const micFallbackMessage = micError
    ? "Không dùng được micro. Hãy cho phép micro trong trình duyệt hoặc gõ câu của bạn."
    : "Không dùng được giọng nói trên thiết bị hoặc trình duyệt này. Bạn vẫn có thể gõ câu và bấm gửi.";
  const modeCopy = {
    journey: {
      eyebrow: ui.conversationEyebrow,
      title: ui.journeyTitle,
      description: ui.journeyDescription,
      inputLabel: ui.conversationInputLabel,
      placeholder: ui.conversationPlaceholder,
      send: ui.conversationSend,
    },
    speak: {
      eyebrow: ui.speakModeLabel,
      title: ui.speakTitle,
      description: ui.speakDescription,
      inputLabel: ui.speakInputLabel,
      placeholder: ui.speakPlaceholder,
      send: ui.speakSend,
    },
    logic: {
      eyebrow: ui.logicModeLabel,
      title: ui.logicTitle,
      description: ui.logicDescription,
      inputLabel: ui.logicInputLabel,
      placeholder: ui.logicPlaceholder,
      send: ui.logicSend,
    },
  }[mode];

  if (mode === "journey") {
    return (
      <section
        className="mx-auto w-full max-w-3xl rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm"
        data-testid="ai-tutor-journey-path"
      >
        <div className="text-xs font-black uppercase text-indigo-600">
          {ui.journeyModeLabel}
        </div>
        <h2 className="mt-1 text-xl font-black text-slate-900">
          Lộ trình học hôm nay
        </h2>
        <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
          Bắt đầu bằng một câu ngắn. Mercy sẽ sửa và giúp bạn thử lại.
        </p>

        <ol className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
          <li className="rounded-[14px] border border-slate-100 bg-slate-50 px-4 py-3">
            1. Sửa một câu
          </li>
          <li className="rounded-[14px] border border-slate-100 bg-slate-50 px-4 py-3">
            2. Nghe Mercy giải thích
          </li>
          <li className="rounded-[14px] border border-slate-100 bg-slate-50 px-4 py-3">
            3. Thử lại bằng một câu mới
          </li>
        </ol>

        <button
          type="button"
          onClick={onStartCorrection}
          className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-black text-white transition hover:bg-slate-800 sm:w-auto"
        >
          Bắt đầu sửa câu
        </button>
      </section>
    );
  }

  // Premium-only conversation engine. Vietnamese-primary gate, English secondary.
  // No entitlement is derived here and no Stripe price_id is referenced.
  if (isPremiumGated) {
    return (
      <section
        className="mx-auto flex min-h-[320px] w-full max-w-3xl flex-col items-center justify-center rounded-[18px] border border-slate-200 bg-white p-8 text-center shadow-sm"
        data-testid="ai-tutor-conversation-premium-gate"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <Lock className="h-5 w-5" aria-hidden />
        </div>
        <h2 className="mt-4 text-xl font-black text-slate-900">
          Trò chuyện cùng Mercy là tính năng Premium
        </h2>
        <p className="mt-1 text-sm font-bold leading-6 text-slate-600">
          Premium feature — unlimited conversation practice
        </p>
        <p className="mt-3 max-w-md text-sm font-semibold leading-6 text-slate-600">
          Nâng cấp Premium để luyện hội thoại tiếng Anh không giới hạn, được Mercy sửa lỗi
          tư duy Việt → Anh và giải thích bằng tiếng Việt.
        </p>
        <button
          type="button"
          onClick={onUpgrade}
          className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-black text-white transition hover:bg-slate-800"
          data-testid="ai-tutor-conversation-upgrade"
        >
          Nâng cấp Premium
        </button>
      </section>
    );
  }

  return (
    <section
      className="mx-auto flex min-h-[620px] w-full max-w-3xl flex-col rounded-[18px] border border-slate-200 bg-white shadow-sm"
      data-testid="ai-tutor-conversation"
    >
      <div className="border-b border-slate-100 p-5">
        <div className="text-xs font-black uppercase text-indigo-600">
          {modeCopy.eyebrow}
        </div>
        <h2 className="mt-1 text-xl font-black text-slate-900">
          {modeCopy.title}
        </h2>
        <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
          {modeCopy.description}
        </p>
        {turnUsage && (
          <div
            className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-black ${
              atTurnCap ? "bg-amber-50 text-amber-800" : "bg-slate-100 text-slate-600"
            }`}
            data-testid="ai-tutor-conversation-turn-cap"
            role="status"
          >
            {atTurnCap
              ? `Bạn đã dùng hết ${turnUsage.limit} lượt cho buổi này. Hãy quay lại buổi sau nhé.`
              : `Lượt còn lại buổi này: ${turnsRemaining}/${turnUsage.limit}`}
          </div>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/60 p-4 sm:p-5">
        {messages.length === 0 && (
          <div className="rounded-[16px] border border-dashed border-slate-200 bg-white p-5 text-center text-sm font-bold text-slate-600">
            {ui.conversationEmpty}
          </div>
        )}

        {messages.map((message) => {
          const isMercy = message.role === "mercy";
          const pron = !isMercy ? pronunciationByMessageId?.[message.id] : undefined;
          // Honest pronunciation surface: only ever show a number when Azure gave a real
          // measurement. Null score / no-audio / low-confidence / shouldAskRetry => encourage a
          // retry, never a fabricated percent. (C1 trust-floor contract.)
          const showPronScore =
            !!pron && pron.overallScore !== null && pron.quality === "ok" && !pron.shouldAskRetry;
          const isActiveVoice = speakingMessageId === message.id;
          const isPreparingVoice = isActiveVoice && ttsPreparing;
          const isSpeakingVoice = isActiveVoice && ttsSpeaking;
          const speakLabel = isSpeakingVoice ? ui.ttsAriaStop : ui.ttsAriaPlay;

          return (
            <article
              key={message.id}
              className={`flex ${isMercy ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[88%] rounded-[18px] px-4 py-3 shadow-sm ${
                  isMercy
                    ? "rounded-tl-[6px] border border-indigo-100 bg-white text-slate-800"
                    : "rounded-tr-[6px] bg-slate-900 text-white"
                }`}
              >
                <div className={`mb-1 text-[11px] font-black uppercase ${isMercy ? "text-indigo-500" : "text-slate-300"}`}>
                  {isMercy ? tutorCopy.speakerLabels.tutor : tutorCopy.speakerLabels.learner}
                </div>

                {isMercy ? (
                  <div className="space-y-3">
                    {isLogicMode && message.logicDiagnosis ? (
                      <div className="space-y-3" data-testid="ai-tutor-logic-diagnosis">
                        {!message.logicDiagnosis.isKnownPattern && message.logicDiagnosis.fallbackMessage && (
                          <div className="rounded-[12px] border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-bold leading-6 text-amber-900">
                            {message.logicDiagnosis.fallbackMessage}
                          </div>
                        )}
                        <div>
                          <div className="text-[11px] font-black uppercase text-emerald-600">Natural correction</div>
                          <p className="mt-1 text-sm font-black leading-6 text-emerald-800">{message.logicDiagnosis.correctedExample}</p>
                        </div>
                        <div>
                          <div className="text-[11px] font-black uppercase text-amber-600">Vietnamese-thinking cause</div>
                          <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">{message.logicDiagnosis.vietnameseThinking}</p>
                        </div>
                        <div>
                          <div className="text-[11px] font-black uppercase text-sky-600">English logic</div>
                          <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">{message.logicDiagnosis.englishLogic}</p>
                        </div>
                        <div>
                          <div className="text-[11px] font-black uppercase text-indigo-500">Remember rule</div>
                          <p className="mt-1 text-sm font-semibold leading-6 text-slate-800">{message.logicDiagnosis.rememberRule}</p>
                        </div>
                        <p className="rounded-[12px] bg-indigo-50 px-3 py-2 text-sm font-black leading-6 text-indigo-800">
                          {message.logicDiagnosis.retryPrompt}
                        </p>
                      </div>
                    ) : (
                      <>
                    {message.correctedText && (
                      <div>
                        <div className="text-[11px] font-black uppercase text-emerald-600">{tutorCopy.speakerLabels.correctedVersion}</div>
                        <p className="mt-1 text-sm font-black leading-6 text-emerald-800">{message.correctedText}</p>
                      </div>
                    )}
                    {message.explanation && (
                      <div>
                        <div className="text-[11px] font-black uppercase text-slate-600">{tutorCopy.speakerLabels.shortExplanation}</div>
                        <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">{message.explanation}</p>
                      </div>
                    )}
                    {message.naturalReply && (
                      <div>
                        <div className="text-[11px] font-black uppercase text-indigo-500">{tutorCopy.speakerLabels.naturalReply}</div>
                        <p className="mt-1 text-sm font-semibold leading-6 text-slate-800">{message.naturalReply}</p>
                      </div>
                    )}
                    {message.nextQuestion && (
                      <p className="rounded-[12px] bg-indigo-50 px-3 py-2 text-sm font-black leading-6 text-indigo-800">
                        {message.nextQuestion}
                      </p>
                    )}
                      </>
                    )}
                    {allowTts && ttsSupported ? (
                      <button
                        type="button"
                        onClick={() => onSpeak(message)}
                        disabled={isPreparingVoice}
                        className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                          isSpeakingVoice
                            ? "border-red-300 bg-red-50 text-red-700"
                            : "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                        }`}
                        aria-label={speakLabel}
                      >
                        {isPreparingVoice ? (
                          <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                        ) : isSpeakingVoice ? (
                          <Square className="h-3.5 w-3.5" aria-hidden />
                        ) : (
                          <Volume2 className="h-3.5 w-3.5" aria-hidden />
                        )}
                        {isPreparingVoice ? ui.ttsPreparing : isSpeakingVoice ? ui.ttsStop : ui.ttsPlay}
                      </button>
                    ) : allowTts ? (
                      <div className="text-[11px] font-medium text-slate-600">{ui.ttsUnavailable}</div>
                    ) : null}
                    {allowTts && isActiveVoice && ttsVoiceSource && (
                      <div className={`text-[11px] font-semibold ${ttsVoiceSource === "mercy" ? "text-emerald-700" : "text-amber-700"}`}>
                        {ttsVoiceSource === "mercy" ? ui.ttsMercyVoiceLabel : ui.ttsDeviceVoiceFallbackLabel}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="whitespace-pre-wrap text-sm font-semibold leading-6">{message.text}</p>
                    {pron && (showPronScore ? (
                      <div
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] font-black text-emerald-100"
                        data-testid="ai-tutor-conversation-pron-score"
                      >
                        Phát âm: {pron.overallScore}%
                      </div>
                    ) : (
                      <div
                        className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold text-slate-200"
                        data-testid="ai-tutor-conversation-pron-retry"
                      >
                        Chưa nghe rõ — mình thử lại câu này nhé.
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          );
        })}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-bold text-indigo-700 shadow-sm">
              {tutorCopy.speakerLabels.thinking}
            </div>
          </div>
        )}

        {abstentionRedirect && (
          <div className="flex justify-start">
            <div
              className="max-w-[88%] rounded-[16px] rounded-tl-[6px] border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-bold leading-6 text-sky-900 shadow-sm"
              data-testid="ai-tutor-conversation-abstention-redirect"
              role="status"
            >
              {abstentionRedirect.redirectPrompt}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 p-4">
        <label className="mb-2 block text-xs font-black uppercase text-slate-600">
          {modeCopy.inputLabel}
        </label>
        <textarea
          value={input}
          onChange={(e) => {
            if (e.target.value.length <= 500) setInput(e.target.value);
          }}
          placeholder={modeCopy.placeholder}
          rows={3}
          className="w-full resize-none rounded-[14px] border border-slate-200 bg-slate-50 p-3 text-[15px] leading-relaxed text-slate-900 placeholder-slate-500 transition focus:border-indigo-300 focus:bg-white focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onSend();
          }}
        />
        <div className={`mt-3 grid gap-2 ${isLogicMode ? "" : "sm:grid-cols-[minmax(0,1fr)_auto]"}`}>
          {!isLogicMode && (
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
          )}
          <div className="flex gap-2">
            {!isLogicMode && onClearRecording && (
              <button
                type="button"
                onClick={handleResetRecording}
                disabled={!canResetRecording || loading}
                className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-300"
                data-testid="ai-tutor-conversation-reset-recording"
                aria-label="Làm lại — Start over"
                title="Làm lại — Start over"
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
                Làm lại
              </button>
            )}
            <button
              type="button"
              onClick={onSend}
              disabled={isEmpty || loading || atTurnCap}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-600"
            >
              <Send className="h-4 w-4" aria-hidden />
              {modeCopy.send}
            </button>
          </div>
        </div>
        {showMicFallback && (
          <p
            className="mt-2 rounded-[12px] border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold leading-5 text-amber-900"
            data-testid="ai-tutor-speak-mic-fallback-message"
            role="status"
          >
            {micFallbackMessage}
          </p>
        )}
      </div>
    </section>
  );
}
