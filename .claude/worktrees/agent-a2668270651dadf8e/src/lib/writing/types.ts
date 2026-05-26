// src/lib/writing/types.ts
//
// Shared types for the real-life writing practice surface
// (/writing list, /writing/:promptId session, writing-feedback edge fn).
// Mirrors the SQL enums in
// supabase/migrations/20260606000000_writing_practice.sql so a schema
// drift fails type-check.

export type WritingPromptCategory =
  | "workplace_email"
  | "customer_service"
  | "social_media"
  | "personal_message"
  | "dating_profile"
  | "job_application"
  | "daily_life"
  | "creative";

export type WritingPromptDifficulty = "easy" | "medium" | "hard";

export interface WritingPrompt {
  id: string;
  category: WritingPromptCategory;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  target_words_min: number;
  target_words_max: number;
  difficulty: WritingPromptDifficulty;
}

/**
 * Structured AI feedback shape — what writing-feedback edge fn returns
 * and what user_writing_submissions.ai_feedback stores. Keep this in
 * sync with `supabase/functions/writing-feedback/core.ts` (no module
 * sharing across Deno boundary, same as mercyVoices).
 */
export interface WritingCorrection {
  /** The exact substring from the user's submission that needs work. */
  original: string;
  /** The improved version. */
  suggested: string;
  /** Short bilingual rationale; VN primary. */
  reason_vi: string;
  reason_en: string;
}

export interface WritingVocabSuggestion {
  /** Word/phrase the user wrote that could be lifted. */
  user_word: string;
  /** A better register choice. */
  better: string;
  /** One-line context — when to prefer the better word. */
  context_vi: string;
  context_en: string;
}

export interface WritingGrammarIssue {
  /** Snippet that contains the issue. */
  snippet: string;
  /** What rule is being broken. */
  rule_vi: string;
  rule_en: string;
  /** A corrected version of the snippet. */
  corrected: string;
}

export interface WritingFeedback {
  /** 0–100. */
  score: number;
  /** One-paragraph summary in VN, then EN. */
  summary_vi: string;
  summary_en: string;
  /** Up to ~6 inline corrections. */
  corrections: WritingCorrection[];
  /** 3–5 vocabulary upgrades. */
  vocabulary: WritingVocabSuggestion[];
  /** Grammar issues. */
  grammar: WritingGrammarIssue[];
  /**
   * Cultural notes — e.g. "Americans tend to be more direct in this
   * context". Optional; the model can return zero when nothing notable.
   */
  cultural_notes_vi: string[];
  cultural_notes_en: string[];
}

/** Database row shape for user_writing_submissions. */
export interface WritingSubmissionRow {
  id: string;
  user_id: string;
  prompt_id: string;
  submission_text: string;
  ai_feedback: WritingFeedback | null;
  score: number | null;
  submitted_at: string;
  time_spent_seconds: number;
}

/** Bilingual labels for the category enum, used by the list-page chip filter. */
export const CATEGORY_LABELS: Record<
  WritingPromptCategory,
  { vi: string; en: string; emoji: string }
> = {
  workplace_email: { vi: "Email công việc", en: "Workplace email", emoji: "💼" },
  customer_service: { vi: "Dịch vụ khách hàng", en: "Customer service", emoji: "🎧" },
  social_media: { vi: "Mạng xã hội", en: "Social media", emoji: "📱" },
  personal_message: { vi: "Tin nhắn cá nhân", en: "Personal message", emoji: "💬" },
  dating_profile: { vi: "Hồ sơ hẹn hò", en: "Dating profile", emoji: "💝" },
  job_application: { vi: "Đơn xin việc", en: "Job application", emoji: "📄" },
  daily_life: { vi: "Đời sống hàng ngày", en: "Daily life", emoji: "🏠" },
  creative: { vi: "Sáng tạo", en: "Creative", emoji: "✨" },
};

export const DIFFICULTY_LABELS: Record<
  WritingPromptDifficulty,
  { vi: string; en: string }
> = {
  easy: { vi: "Dễ", en: "Easy" },
  medium: { vi: "Trung bình", en: "Medium" },
  hard: { vi: "Khó", en: "Hard" },
};

export const ALL_CATEGORIES: readonly WritingPromptCategory[] = [
  "workplace_email",
  "customer_service",
  "social_media",
  "personal_message",
  "dating_profile",
  "job_application",
  "daily_life",
  "creative",
];

export const ALL_DIFFICULTIES: readonly WritingPromptDifficulty[] = [
  "easy",
  "medium",
  "hard",
];
