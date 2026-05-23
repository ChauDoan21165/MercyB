/**
 * AITutorTab — AI Tutor chat interface.
 *
 * Phase C Option B — UI integration with mock provider only.
 * Calls useAITutor hook. No direct PB2/PB3/PB4 imports.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Send, RotateCcw, AlertTriangle, Shield, Ban } from "lucide-react";
import { useAITutor } from "../hooks/useAITutor";
import type { UseAITutorState } from "../hooks/useAITutor";
import type { TutorTier } from "@/lib/ai-tutor/types";

// ─── Props ────────────────────────────────────────────────────────────

type AITutorTabProps = {
  userId: string | null;
  tier?: TutorTier;
};

// ─── Component ────────────────────────────────────────────────────────

const AITutorTab: React.FC<AITutorTabProps> = ({
  userId,
  tier = "free",
}) => {
  const { state, send, reset } = useAITutor(userId, tier);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "mercy"; content: string }>>([]);
  const [showTimeout, setShowTimeout] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, state]);

  // Show timeout message after 8 seconds of loading
  useEffect(() => {
    if (state.phase === "loading") {
      setShowTimeout(false);
      timeoutRef.current = setTimeout(() => {
        setShowTimeout(true);
      }, 8000);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setShowTimeout(false);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [state.phase]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = useCallback(() => {
    if (!input.trim() || state.phase === "loading") return;

    const text = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    send(text);
  }, [input, state.phase, send]);

  const handleReset = useCallback(() => {
    reset();
    setMessages([]);
    setInput("");
    inputRef.current?.focus();
  }, [reset]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  // Add mercy response to messages when state changes
  const prevStateRef = useRef<UseAITutorState>(state);
  useEffect(() => {
    const prev = prevStateRef.current;
    prevStateRef.current = state;

    if (
      state.phase === "response" &&
      prev.phase === "loading"
    ) {
      setMessages((prevMsgs) => [
        ...prevMsgs,
        { role: "mercy", content: state.response.vi },
      ]);
    }
  }, [state]);

  // ─── Render ─────────────────────────────────────────────────────────

  return (
    <div className="flex h-full min-h-0 flex-col" data-testid="ai-tutor-tab">
      {/* Chat area */}
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-4"
      >
        {/* Welcome message */}
        {messages.length === 0 && state.phase === "idle" ? (
          <div className="rounded-2xl bg-white/72 p-4 shadow-sm">
            <p className="text-sm font-medium text-slate-700">
              Chào bạn! Mình là Mercy, gia sư tiếng Anh của bạn.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Bạn có thể hỏi mình về ngữ pháp, nhờ mình sửa câu, hoặc luyện nói.
            </p>
          </div>
        ) : null}

        {/* Messages */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md"
                  : "bg-white/85 text-slate-700 shadow-sm border border-slate-100"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {state.phase === "loading" ? (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl bg-white/85 px-4 py-3 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:300ms]" />
                </div>
                <span className="text-xs text-slate-400">Mercy đang nghĩ...</span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Timeout message */}
        {showTimeout && state.phase === "loading" ? (
          <div className="flex justify-center">
            <p className="text-xs text-slate-400 italic">
              Hơi lâu một chút — Mercy đang xử lý...
            </p>
          </div>
        ) : null}

        {/* Error state */}
        {state.phase === "error" ? (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl border border-red-200 bg-red-50/85 px-4 py-3 shadow-sm">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-500" />
                <p className="text-sm text-red-700">{state.response.vi}</p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Safety block */}
        {state.phase === "safety" ? (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl border border-amber-200 bg-amber-50/85 px-4 py-3 shadow-sm">
              <div className="flex items-start gap-2">
                <Shield size={16} className="mt-0.5 shrink-0 text-amber-600" />
                <p className="text-sm text-amber-800">{state.messageVi}</p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Budget exceeded */}
        {state.phase === "budget" ? (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl border border-slate-200 bg-slate-50/85 px-4 py-3 shadow-sm">
              <div className="flex items-start gap-2">
                <Ban size={16} className="mt-0.5 shrink-0 text-slate-500" />
                <p className="text-sm text-slate-700">{state.messageVi}</p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Session ended */}
        {state.phase === "ended" ? (
          <div className="flex justify-center">
            <p className="text-xs text-slate-400">Phiên học đã kết thúc.</p>
          </div>
        ) : null}
      </div>

      {/* Next-step chips */}
      {state.phase === "response" ? (
        <div className="flex flex-wrap gap-2 px-3 pb-2">
          {state.response.nextSteps?.map((step, i) => {
            const icons: Record<string, string> = {
              speak: "🎤",
              logic: "🧠",
              write: "✏️",
              room: "📚",
              drill: "🔁",
            };
            return (
              <button
                key={i}
                type="button"
                className="rounded-full border border-violet-200 bg-violet-50/80 px-3 py-1.5 text-xs font-medium text-violet-700 transition hover:bg-violet-100"
                onClick={() => {
                  // Future: navigate to speak/logic/write/room/drill
                }}
              >
                {icons[step.action] ?? "→"} {step.labelVi}
              </button>
            );
          })}
        </div>
      ) : null}

      {/* Input area */}
      <div className="border-t border-slate-100 bg-white/60 px-3 py-2.5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập câu hỏi tiếng Anh..."
            disabled={state.phase === "loading"}
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 disabled:opacity-50"
            aria-label="Tutor message input"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || state.phase === "loading"}
            className="shrink-0 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 p-2.5 text-white shadow-md transition hover:from-violet-600 hover:to-fuchsia-600 disabled:opacity-40 disabled:shadow-none"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="shrink-0 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-400 transition hover:text-slate-600"
            aria-label="Reset conversation"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutorTab;
