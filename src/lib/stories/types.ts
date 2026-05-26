// Shared types + constants for the user-stories feature. Mirrors the
// enums + columns in supabase/migrations/20260426000000_user_stories.sql.

export type StoryStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "published"
  | "archived";

export type StoryContext =
  | "before_mercyblade"
  | "progress_milestone"
  | "specific_win";

export interface UserStoryRow {
  id: string;
  user_id: string;
  submitted_at: string;
  approved_at: string | null;
  published_at: string | null;
  status: StoryStatus;
  story_text_vi: string;
  story_text_en: string | null;
  display_name: string;
  display_avatar_url: string | null;
  context: StoryContext | null;
  ielts_band_before: number | null;
  ielts_band_after: number | null;
  vstep_level_before: string | null;
  vstep_level_after: string | null;
  profession: string | null;
  photo_consent_given: boolean;
  tags: string[];
  rejection_reason: string | null;
  takedown_requested_at: string | null;
}

// Canonical tag list — keep in sync with Stories filter UI, share form,
// and admin moderation queue.
export const STORY_TAGS = [
  "IELTS",
  "VSTEP",
  "TOEIC",
  "Career change",
  "Confidence",
  "Daily life",
] as const;

export type StoryTag = (typeof STORY_TAGS)[number];

export const EXAM_TAGS: ReadonlySet<StoryTag> = new Set(["IELTS", "VSTEP", "TOEIC"]);

// Vietnamese display labels for the context dropdown.
export const STORY_CONTEXT_LABELS_VI: Record<StoryContext, string> = {
  before_mercyblade: "Trước khi dùng MercyBlade",
  progress_milestone: "Cột mốc tiến bộ",
  specific_win: "Một thành công cụ thể",
};

export const STORY_CONTEXT_LABELS_EN: Record<StoryContext, string> = {
  before_mercyblade: "Before MercyBlade",
  progress_milestone: "Progress milestone",
  specific_win: "A specific win",
};

// Truncate helper for card excerpts. Cuts on word boundary when possible.
export function excerpt(text: string, maxChars = 120): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxChars) return trimmed;
  const slice = trimmed.slice(0, maxChars);
  const lastSpace = slice.lastIndexOf(" ");
  return (lastSpace > 60 ? slice.slice(0, lastSpace) : slice).trimEnd() + "…";
}
