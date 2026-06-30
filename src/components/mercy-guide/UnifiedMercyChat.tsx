// src/components/mercy-guide/UnifiedMercyChat.tsx
//
// One-pane Mercy chat. The new entry point that replaces the multi-tab
// drawer (Speak / Say / Teacher / Notebook) for users who haven't opted
// into 'classic' mode. The component itself stays small — heavy logic
// lives in pure helpers (intentDetection, chatReducer, sessionClient)
// so it remains easy to test and easy to reason about.
//
// VI-first per the product non-negotiables: placeholder copy, system
// prompts, and inline-panel headings default to Vietnamese with English
// shown as a secondary line. The intent classifier reads either; the
// rendered UI does not assume one.
//
// Inline modes:
//   - pronunciation : record/playback panel inline, no tab switch
//   - grammar       : sentence-correction snippet inline
//   - lesson        : link/launch the requested lesson
//   - encouragement : warm bubble + a "tiny next step" suggestion
//   - none          : plain chat, falls through to Mercy reply text

import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { ArrowUp, Mic, RotateCcw, Settings, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { detectIntent } from "@/lib/mercy/intentDetection";
import {
  chatReducer,
  initialChatState,
  type ChatMessage,
  type InlineMode,
} from "@/lib/mercy/chatReducer";
import {
  loadSession,
  patchContext,
  setSessionType,
  type MercySessionType,
} from "@/lib/mercy/sessionClient";
import {
  AIDisclosureModal,
  readAIDisclosureAccepted,
  writeAIDisclosureAccepted,
} from "@/components/mercy/AIDisclosureModal";

const VI_PLACEHOLDER =
  "Nhắn cho Mercy — phát âm, ngữ pháp, bài học, hoặc tâm sự…";
const EN_PLACEHOLDER =
  "Ask Mercy anything — pronunciation, grammar, a lesson, or just chat";

const INLINE_HEADERS: Record<Exclude<InlineMode["kind"], "none">, [string, string]> = {
  pronunciation: ["Luyện phát âm", "Practice pronunciation"],
  grammar: ["Kiểm tra ngữ pháp", "Grammar check"],
  lesson: ["Mở bài học", "Open lesson"],
  encouragement: ["Mercy ở đây", "Mercy is here"],
};

function freshId(role: "learner" | "mercy"): string {
  return `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Tiny canned reply — the real product hooks an LLM in here. Keeping
 * the seam simple lets us ship the UX without blocking on the model
 * pipeline. The shape is what matters: every inline mode gets its own
 * VI-primary copy; chat falls through to a friendly default.
 */
function craftReply(inline: InlineMode, learnerLanguage: "vi" | "en" | "mixed"): string {
  const isVI = learnerLanguage === "vi" || learnerLanguage === "mixed";
  switch (inline.kind) {
    case "pronunciation":
      return isVI
        ? `Cùng luyện "${inline.target || "từ này"}" nhé — bấm mic để thu âm.`
        : `Let's practice "${inline.target || "this word"}" — tap the mic to record.`;
    case "grammar":
      return isVI
        ? `Mercy soi câu "${inline.target}" giúp em nha.`
        : `Mercy will check "${inline.target}" for you.`;
    case "lesson":
      return isVI
        ? `Mở bài về ${inline.topic} ngay đây.`
        : `Opening the ${inline.topic} lesson.`;
    case "encouragement":
      return isVI
        ? "Mercy hiểu, từ từ thôi — mình thử một câu nhỏ trước nha."
        : "Mercy hears you — let's try one tiny step together.";
    default:
      return isVI
        ? "Mercy đây — mình muốn luyện gì hôm nay?"
        : "Mercy here — what should we work on today?";
  }
}

export type UnifiedMercyChatProps = {
  /**
   * If the session row already loaded (e.g. from a parent), skip the
   * fetch and render immediately. Tests pass this in directly.
   */
  initialSessionType?: MercySessionType;
  /**
   * Fired when the learner asks to switch to the legacy multi-tab UI.
   * The parent handles the actual remount; this component just signals.
   */
  onRequestClassic?: () => void;
};

export function UnifiedMercyChat(props: UnifiedMercyChatProps) {
  const [state, dispatch] = useReducer(chatReducer, initialChatState);
  const [sessionType, setLocalType] = useState<MercySessionType>(
    props.initialSessionType ?? "unified",
  );
  const [showSettings, setShowSettings] = useState(false);
  // Apple Guideline 5.1.1 — must disclose AI processing before the
  // first message is sent. Seeded lazily from localStorage so the
  // modal does not flash for returning learners who already accepted.
  const [aiDisclosureAccepted, setAIDisclosureAccepted] = useState<boolean>(
    () => readAIDisclosureAccepted(),
  );
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Hydrate session from Supabase on mount (fire-and-forget; default is fine).
  useEffect(() => {
    if (props.initialSessionType) return;
    void loadSession().then((row) => {
      if (row?.session_type) setLocalType(row.session_type);
    });
  }, [props.initialSessionType]);

  useEffect(() => {
    const node = scrollRef.current;
    // jsdom (tests) doesn't implement scrollTo — guard it.
    if (node && typeof node.scrollTo === "function") {
      node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
    }
  }, [state.messages.length, state.inline.kind]);

  const handleAcceptAIDisclosure = useCallback(() => {
    writeAIDisclosureAccepted();
    setAIDisclosureAccepted(true);
  }, []);

  const handleSend = useCallback(() => {
    const text = state.draft.trim();
    if (!text) return;
    // Apple 5.1.1 gate: refuse to dispatch the message until the user
    // has acknowledged the AI disclosure. The modal is rendered below
    // (over the chat surface) whenever this flag is false.
    if (!aiDisclosureAccepted) return;

    const intent = detectIntent(text);
    const learnerMessage: ChatMessage = {
      id: freshId("learner"),
      role: "learner",
      text,
      language: intent.language,
      createdAt: Date.now(),
    };
    dispatch({ type: "learnerSubmitted", message: learnerMessage, intent });

    // Mercy reply runs on the same tick — the reducer state used here
    // is the next state, computed via the helper to stay deterministic.
    const inline = (() => {
      if (intent.confidence < 0.6) return { kind: "none" } as InlineMode;
      switch (intent.intent) {
        case "pronunciation":
          return { kind: "pronunciation", target: intent.target } as InlineMode;
        case "grammar_check":
          return { kind: "grammar", target: intent.target } as InlineMode;
        case "lesson_request":
          return { kind: "lesson", topic: intent.target } as InlineMode;
        case "encouragement":
          return { kind: "encouragement", cue: intent.target } as InlineMode;
        default:
          return { kind: "none" } as InlineMode;
      }
    })();

    const replyMessage: ChatMessage = {
      id: freshId("mercy"),
      role: "mercy",
      text: craftReply(inline, intent.language),
      language: intent.language,
      createdAt: Date.now() + 1,
    };
    dispatch({ type: "mercyResponded", message: replyMessage });

    void patchContext({ lastIntent: intent.intent, lastSentence: text });
  }, [state.draft, aiDisclosureAccepted]);

  const handleClassic = useCallback(async () => {
    setLocalType("classic");
    await setSessionType("classic");
    dispatch({ type: "classicRequested", value: true });
    props.onRequestClassic?.();
  }, [props]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  return (
    <div
      data-testid="unified-mercy-chat"
      className="flex h-full w-full flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div>
          <p className="text-sm font-semibold">Mercy</p>
          <p className="text-xs text-slate-600">
            Bạn muốn học gì hôm nay? · How can I help today?
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Reset conversation"
            data-testid="unified-mercy-reset"
            onClick={() => dispatch({ type: "reset" })}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Settings"
            data-testid="unified-mercy-settings"
            onClick={() => setShowSettings((v) => !v)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showSettings ? (
        <div
          data-testid="unified-mercy-settings-panel"
          className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="mb-2 font-medium">
            Chế độ giao diện · View mode
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={sessionType === "unified" ? "default" : "outline"}
              onClick={async () => {
                setLocalType("unified");
                await setSessionType("unified");
              }}
            >
              Chat hợp nhất · Unified
            </Button>
            <Button
              type="button"
              size="sm"
              variant={sessionType === "classic" ? "default" : "outline"}
              data-testid="unified-mercy-classic-toggle"
              onClick={handleClassic}
            >
              Nhiều tab · Classic
            </Button>
          </div>
          <p className="mt-2 text-xs text-slate-600">
            Đổi sang Classic nếu em quen dùng các tab cũ. Vẫn dùng được mọi lúc.
          </p>
        </div>
      ) : null}

      {/* Message stream */}
      <div
        ref={scrollRef}
        data-testid="unified-mercy-stream"
        className="flex-1 space-y-3 overflow-y-auto px-4 py-3"
      >
        {state.messages.length === 0 ? (
          <div className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <p className="font-medium">
              Chào em — Mercy ở đây.
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Hỏi Mercy về phát âm, ngữ pháp, hay nhờ Mercy ra bài tiếp theo.
            </p>
          </div>
        ) : null}

        {state.messages.map((m) => (
          <div
            key={m.id}
            data-testid={`unified-mercy-bubble-${m.role}`}
            className={
              m.role === "learner"
                ? "ml-auto max-w-[85%] rounded-2xl bg-emerald-600 px-3 py-2 text-sm text-white"
                : "mr-auto max-w-[85%] rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100"
            }
          >
            {m.text}
          </div>
        ))}

        {state.inline.kind !== "none" ? (
          <div
            data-testid={`unified-mercy-inline-${state.inline.kind}`}
            className="mr-auto w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm dark:border-emerald-800 dark:bg-emerald-950"
          >
            <div className="mb-1 flex items-center justify-between">
              <p className="font-semibold">
                {INLINE_HEADERS[state.inline.kind][0]}
                <span className="ml-2 text-xs font-normal text-slate-600">
                  · {INLINE_HEADERS[state.inline.kind][1]}
                </span>
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Dismiss inline panel"
                data-testid="unified-mercy-inline-dismiss"
                onClick={() => dispatch({ type: "inlineDismissed" })}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            {state.inline.kind === "pronunciation" ? (
              <p className="text-slate-700 dark:text-slate-200">
                Bấm mic để thu âm "{state.inline.target || "từ này"}". Mercy
                sẽ chấm điểm và đọc mẫu lại cho em.
              </p>
            ) : null}
            {state.inline.kind === "grammar" ? (
              <p className="text-slate-700 dark:text-slate-200">
                Câu cần kiểm tra: <em>{state.inline.target}</em>
              </p>
            ) : null}
            {state.inline.kind === "lesson" ? (
              <p className="text-slate-700 dark:text-slate-200">
                Bài học: <strong>{state.inline.topic || "tiếp theo"}</strong>
              </p>
            ) : null}
            {state.inline.kind === "encouragement" ? (
              <p className="text-slate-700 dark:text-slate-200">
                Mercy thấy em đang khó. Mình thử một câu thật nhỏ — không sao
                nếu sai, mình cùng sửa.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Input bar */}
      <div className="border-t border-slate-200 px-3 py-2 dark:border-slate-800">
        <div className="flex items-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Voice input"
            data-testid="unified-mercy-mic"
          >
            <Mic className="h-4 w-4" />
          </Button>
          <textarea
            data-testid="unified-mercy-input"
            // Privacy: Mercy chat free text is sensitive — never let
            // Clarity session replay capture it. See clarity.ts.
            data-clarity-mask="true"
            value={state.draft}
            onChange={(e) =>
              dispatch({ type: "draftChanged", value: e.target.value })
            }
            onKeyDown={onKeyDown}
            placeholder={`${VI_PLACEHOLDER}\n${EN_PLACEHOLDER}`}
            rows={2}
            className="flex-1 resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900"
          />
          <Button
            type="button"
            size="sm"
            aria-label="Send"
            data-testid="unified-mercy-send"
            disabled={!state.draft.trim() || !aiDisclosureAccepted}
            onClick={handleSend}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!aiDisclosureAccepted ? (
        <AIDisclosureModal onAccept={handleAcceptAIDisclosure} />
      ) : null}
    </div>
  );
}

export default UnifiedMercyChat;
