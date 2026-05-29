// src/components/ai-tutor/ConversationMode.tsx
// Chat-style Teacher Mercy practice mode. Local/mock only; no provider calls.

import { Send, Square, Volume2 } from "lucide-react";
import type { TutorTurn } from "@/lib/tutor/tutorTypes";
import type { TutorCopy } from "@/lib/tutor/tutorCopy";
import type { VietlishLogicDiagnosisResult } from "@/lib/tutor/vietlishLogicEngine";
import TeacherMercyVoiceControls from "@/components/teacher-mercy/TeacherMercyVoiceControls";

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
};

export default function ConversationMode({
  mode,
  messages,
  input,
  setInput,
  loading,
  micSupported,
  micListening,
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
}: Props) {
  const isEmpty = !input.trim();
  const isLogicMode = mode === "logic";
  const { ui } = tutorCopy;
  const allowTts = mode !== "logic";
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
        <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
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
        <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
          {modeCopy.description}
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/60 p-4 sm:p-5">
        {messages.length === 0 && (
          <div className="rounded-[16px] border border-dashed border-slate-200 bg-white p-5 text-center text-sm font-bold text-slate-500">
            {ui.conversationEmpty}
          </div>
        )}

        {messages.map((message) => {
          const isMercy = message.role === "mercy";
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
                        <div className="text-[11px] font-black uppercase text-slate-500">{tutorCopy.speakerLabels.shortExplanation}</div>
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
                      <div className="text-[11px] font-medium text-slate-500">{ui.ttsUnavailable}</div>
                    ) : null}
                    {allowTts && isActiveVoice && ttsVoiceSource && (
                      <div className={`text-[11px] font-semibold ${ttsVoiceSource === "mercy" ? "text-emerald-700" : "text-amber-700"}`}>
                        {ttsVoiceSource === "mercy" ? ui.ttsMercyVoiceLabel : ui.ttsDeviceVoiceFallbackLabel}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap text-sm font-semibold leading-6">{message.text}</p>
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
      </div>

      <div className="border-t border-slate-100 p-4">
        <label className="mb-2 block text-xs font-black uppercase text-slate-500">
          {modeCopy.inputLabel}
        </label>
        <textarea
          value={input}
          onChange={(e) => {
            if (e.target.value.length <= 500) setInput(e.target.value);
          }}
          placeholder={modeCopy.placeholder}
          rows={3}
          className="w-full resize-none rounded-[14px] border border-slate-200 bg-slate-50 p-3 text-[15px] leading-relaxed text-slate-900 placeholder-slate-400 transition focus:border-indigo-300 focus:bg-white focus:outline-none"
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
          <button
            type="button"
            onClick={onSend}
            disabled={isEmpty || loading}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            <Send className="h-4 w-4" aria-hidden />
            {modeCopy.send}
          </button>
        </div>
      </div>
    </section>
  );
}
