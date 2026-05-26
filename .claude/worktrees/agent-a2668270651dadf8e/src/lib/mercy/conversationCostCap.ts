// Path: src/lib/mercy/conversationCostCap.ts
//
// Client-side parser + types for the per-conversation cost-cap response
// that ai-chat returns when a thread crosses 1200 VND (~$0.05). Wire any
// caller of ai-chat through `parseCapExceeded` to detect the structured
// error and surface a graceful "start new conversation" prompt instead
// of a generic failure.
//
// Why a parser, not a thrown exception: ai-chat is invoked through two
// shapes today:
//   - `supabase.functions.invoke()` — returns { data, error }, where the
//     402 body lands in error.context.response or in data depending on
//     supabase-js version. Inconsistent.
//   - direct `fetch()` to /functions/v1/ai-chat for SSE streaming —
//     returns a Response, body is JSON or stream depending on status.
// A pure parser handles both: callers extract whatever JSON-ish body
// they have, hand it here, and check the result.

export const CAP_EXCEEDED_ERROR_CODE = "CONVERSATION_COST_CAP_EXCEEDED";

export type ConversationCostCapExceeded = {
  kind: "cost_cap_exceeded";
  /** Numeric VND cost at the moment the cap was checked. */
  currentCostVnd: number;
  /** Cap value the server compared against. */
  capVnd: number;
  /** Bilingual messages — UI surfaces these verbatim. */
  messageVi: string;
  messageEn: string;
  /** Server's recommended next step. */
  suggestedAction: "start_new_conversation";
};

export type ConversationCostCapNotExceeded = {
  kind: "not_cap_exceeded";
};

export type ConversationCostCapResult =
  | ConversationCostCapExceeded
  | ConversationCostCapNotExceeded;

/**
 * Parse a candidate response body. Returns `cost_cap_exceeded` when the
 * shape matches; otherwise `not_cap_exceeded` (call-site treats other
 * errors with their own logic).
 *
 * Accepts unknown so callers can pass `error`, `data`, or whatever the
 * supabase invoke wrapper handed them without pre-narrowing.
 */
export function parseCapExceeded(body: unknown): ConversationCostCapResult {
  if (!body || typeof body !== "object") {
    return { kind: "not_cap_exceeded" };
  }
  const b = body as Record<string, unknown>;
  if (b.error_code !== CAP_EXCEEDED_ERROR_CODE) {
    return { kind: "not_cap_exceeded" };
  }

  const currentCost = Number(b.current_cost_vnd);
  const cap = Number(b.cap_vnd);
  const vi = typeof b.error_message_vi === "string" ? b.error_message_vi : "";
  const en = typeof b.error_message_en === "string" ? b.error_message_en : "";
  const action =
    b.suggested_action === "start_new_conversation"
      ? "start_new_conversation"
      : "start_new_conversation";

  return {
    kind: "cost_cap_exceeded",
    currentCostVnd: Number.isFinite(currentCost) ? currentCost : 0,
    capVnd: Number.isFinite(cap) ? cap : 0,
    messageVi:
      vi ||
      "Cuộc trò chuyện này đã đạt giới hạn. Bạn có thể bắt đầu cuộc trò chuyện mới với Mercy.",
    messageEn:
      en ||
      "This conversation has reached the limit. You can start a new conversation with Mercy.",
    suggestedAction: action,
  };
}

/**
 * Helper for fetch-based callers: given a Response from ai-chat, return
 * a parsed cap-exceeded object when applicable, otherwise null.
 *
 * The function consumes the body — caller must not also read it.
 */
export async function parseCapExceededFromResponse(
  response: Response,
): Promise<ConversationCostCapExceeded | null> {
  if (response.status !== 402) return null;
  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    return null;
  }
  const parsed = parseCapExceeded(body);
  return parsed.kind === "cost_cap_exceeded" ? parsed : null;
}
