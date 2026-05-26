// Path: src/components/mercy/ConversationCostCapPrompt.tsx
//
// Bilingual prompt shown when ai-chat returns 402 with error_code
// CONVERSATION_COST_CAP_EXCEEDED. Replaces the chat input area with a
// single "Start fresh" CTA so the user knows the thread reached its
// limit and can move to a new one without losing their per-user
// episodic memory (mercy_user_facts is per-user, not per-thread, so
// the new thread re-loads the same facts automatically).
//
// VN-first per CLAUDE.md: VN copy is the primary surface, EN is the
// support text underneath.

import type { ConversationCostCapExceeded } from "@/lib/mercy/conversationCostCap";

export type ConversationCostCapPromptProps = {
  /** Parsed cap-exceeded result from `parseCapExceeded`. */
  detail: ConversationCostCapExceeded;
  /** Called when the user taps "Start fresh". */
  onStartNew: () => void;
  /** Called when the user dismisses the prompt without starting fresh. */
  onDismiss?: () => void;
};

export default function ConversationCostCapPrompt({
  detail,
  onStartNew,
  onDismiss,
}: ConversationCostCapPromptProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        margin: "12px 0",
        padding: "14px 16px",
        borderRadius: 14,
        border: "1px solid rgba(13,148,136,0.22)",
        background: "rgba(240,253,250,0.96)",
        color: "#115e59",
      }}
    >
      <div style={{ fontWeight: 800, marginBottom: 4 }}>
        Cuộc trò chuyện này đã dài quá. Bạn muốn bắt đầu cuộc trò chuyện mới không?
      </div>
      <div style={{ fontSize: 13, color: "#0f766e", marginBottom: 10, lineHeight: 1.5 }}>
        This conversation has gotten long. Want to start a new one?
      </div>

      <div style={{ fontSize: 13, color: "#115e59", marginBottom: 12, lineHeight: 1.6 }}>
        {detail.messageVi}
      </div>
      <div
        style={{
          fontSize: 12,
          fontStyle: "italic",
          color: "#0f766e",
          marginBottom: 14,
          lineHeight: 1.5,
        }}
      >
        {detail.messageEn}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={onStartNew}
          style={{
            borderRadius: 12,
            minHeight: 42,
            padding: "10px 16px",
            border: "1px solid rgba(15,23,42,0.12)",
            background: "#0f172a",
            color: "#fff",
            fontWeight: 800,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Bắt đầu mới · Start fresh
        </button>
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            style={{
              borderRadius: 12,
              minHeight: 42,
              padding: "10px 14px",
              border: "1px solid rgba(15,23,42,0.10)",
              background: "#fff",
              color: "#0f172a",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Để sau · Not now
          </button>
        ) : null}
      </div>
    </div>
  );
}
