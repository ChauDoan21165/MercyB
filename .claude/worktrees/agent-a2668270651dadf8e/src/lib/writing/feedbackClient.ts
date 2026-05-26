// src/lib/writing/feedbackClient.ts
//
// Browser-side client for the writing-feedback edge function. POSTs the
// user's submission + prompt id; the edge function calls Claude with a
// 1000-token cap and returns a structured `WritingFeedback`.
//
// Shape decisions:
//   - Auth via Bearer JWT (passed in by the caller — same pattern as
//     `cloudScorer.ts`).
//   - Network failures throw — let the page render an inline error and
//     keep the draft intact so the user can retry without retyping.
//   - 401 propagates so the page can prompt re-auth.

import type { WritingFeedback } from "./types";

export interface RequestWritingFeedbackInput {
  promptId: string;
  submissionText: string;
  timeSpentSeconds: number;
  userJwt: string;
  /** Optional override for tests. Defaults to import.meta.env.VITE_SUPABASE_URL. */
  supabaseUrl?: string;
  /** Optional injected fetch — tests pass a stub. */
  fetchImpl?: typeof fetch;
  /** Network timeout (ms). Defaults to 30s — Claude calls can be slow. */
  timeoutMs?: number;
}

export class WritingFeedbackError extends Error {
  constructor(
    message: string,
    public readonly reason:
      | "auth_required"
      | "timeout"
      | "rate_limited"
      | "server_error"
      | "bad_response"
      | "network_error",
  ) {
    super(message);
    this.name = "WritingFeedbackError";
  }
}

const DEFAULT_TIMEOUT_MS = 30_000;

function resolveSupabaseUrl(override?: string): string | null {
  if (override && override.trim()) return override.trim().replace(/\/+$/, "");
  try {
    const env = (import.meta as ImportMeta & { env?: Record<string, string> }).env;
    const url = env?.VITE_SUPABASE_URL ?? "";
    return url.trim() ? url.trim().replace(/\/+$/, "") : null;
  } catch {
    return null;
  }
}

export async function requestWritingFeedback(
  input: RequestWritingFeedbackInput,
): Promise<WritingFeedback> {
  const supabaseUrl = resolveSupabaseUrl(input.supabaseUrl);
  if (!supabaseUrl) {
    throw new WritingFeedbackError(
      "Supabase URL not configured.",
      "network_error",
    );
  }

  const url = `${supabaseUrl}/functions/v1/writing-feedback`;
  const fetchImpl = input.fetchImpl ?? globalThis.fetch;
  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(),
    input.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  );

  let response: Response;
  try {
    response = await fetchImpl(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${input.userJwt}`,
      },
      body: JSON.stringify({
        prompt_id: input.promptId,
        submission_text: input.submissionText,
        time_spent_seconds: input.timeSpentSeconds,
      }),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === "AbortError") {
      throw new WritingFeedbackError("Request timed out.", "timeout");
    }
    throw new WritingFeedbackError(
      err instanceof Error ? err.message : "network failure",
      "network_error",
    );
  }
  clearTimeout(timer);

  if (response.status === 401) {
    throw new WritingFeedbackError("Sign in required.", "auth_required");
  }
  if (response.status === 429) {
    throw new WritingFeedbackError("Too many requests.", "rate_limited");
  }
  if (response.status >= 500) {
    throw new WritingFeedbackError(
      `Server error: ${response.status}`,
      "server_error",
    );
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new WritingFeedbackError("Non-JSON response.", "bad_response");
  }

  return parseFeedback(body);
}

/**
 * Strict-but-forgiving parser. Rejects the response with bad_response
 * only when fields the UI relies on are missing or malformed; lists
 * default to [] when absent.
 *
 * Exported for tests.
 */
export function parseFeedback(raw: unknown): WritingFeedback {
  if (!raw || typeof raw !== "object") {
    throw new WritingFeedbackError("Empty response body.", "bad_response");
  }
  const obj = raw as Record<string, unknown>;

  const score = clampScore(obj.score);
  const summary_vi = stringOrEmpty(obj.summary_vi);
  const summary_en = stringOrEmpty(obj.summary_en);

  if (!summary_vi && !summary_en) {
    throw new WritingFeedbackError(
      "Missing summary field in response.",
      "bad_response",
    );
  }

  return {
    score,
    summary_vi,
    summary_en,
    corrections: Array.isArray(obj.corrections)
      ? obj.corrections.flatMap((c) => parseCorrection(c))
      : [],
    vocabulary: Array.isArray(obj.vocabulary)
      ? obj.vocabulary.flatMap((v) => parseVocab(v))
      : [],
    grammar: Array.isArray(obj.grammar)
      ? obj.grammar.flatMap((g) => parseGrammar(g))
      : [],
    cultural_notes_vi: Array.isArray(obj.cultural_notes_vi)
      ? obj.cultural_notes_vi.filter((s): s is string => typeof s === "string")
      : [],
    cultural_notes_en: Array.isArray(obj.cultural_notes_en)
      ? obj.cultural_notes_en.filter((s): s is string => typeof s === "string")
      : [],
  };
}

function clampScore(raw: unknown): number {
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function stringOrEmpty(raw: unknown): string {
  return typeof raw === "string" ? raw : "";
}

function parseCorrection(raw: unknown): WritingFeedback["corrections"] {
  if (!raw || typeof raw !== "object") return [];
  const o = raw as Record<string, unknown>;
  const original = stringOrEmpty(o.original);
  const suggested = stringOrEmpty(o.suggested);
  if (!original || !suggested) return [];
  return [
    {
      original,
      suggested,
      reason_vi: stringOrEmpty(o.reason_vi),
      reason_en: stringOrEmpty(o.reason_en),
    },
  ];
}

function parseVocab(raw: unknown): WritingFeedback["vocabulary"] {
  if (!raw || typeof raw !== "object") return [];
  const o = raw as Record<string, unknown>;
  const user_word = stringOrEmpty(o.user_word);
  const better = stringOrEmpty(o.better);
  if (!user_word || !better) return [];
  return [
    {
      user_word,
      better,
      context_vi: stringOrEmpty(o.context_vi),
      context_en: stringOrEmpty(o.context_en),
    },
  ];
}

function parseGrammar(raw: unknown): WritingFeedback["grammar"] {
  if (!raw || typeof raw !== "object") return [];
  const o = raw as Record<string, unknown>;
  const snippet = stringOrEmpty(o.snippet);
  const corrected = stringOrEmpty(o.corrected);
  if (!snippet || !corrected) return [];
  return [
    {
      snippet,
      rule_vi: stringOrEmpty(o.rule_vi),
      rule_en: stringOrEmpty(o.rule_en),
      corrected,
    },
  ];
}
