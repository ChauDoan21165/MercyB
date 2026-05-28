// src/lib/parent-view/categories.ts
//
// L6 — Parent / Family layer. Category-bucket + explainer-video config.
//
// Decision L6-Q3=B, PHASED (docs/architecture/L6-parent-teacher-family-
// layer.md § Decision: L6-Q3): the parent view is built around category
// buckets, and each bucket carries a slot for a ~90-second Vietnamese
// explainer video — the differentiation wedge. The *structure* (this
// config + the slot) ships now; the *video content* is a separate
// authoring workstream that backfills into `videoUrl` later.
//
// Hard contract: `videoUrl` is `null` today for every category and the UI
// MUST be null-safe — render the bucket fully without a video, and only
// show the player when a non-null URL is present. Do not block a bucket on
// its video.
//
// The three buckets mirror the L3 aggregator's three sources
// (src/lib/stage-3a/aggregator.ts) one-to-one, so the parent view reads
// the SAME aggregate that powers /weak-at — no re-classification, no new
// signal. This keeps L6 a pure downstream reader (doc § What L6 is NOT:
// "L6 reads only").

export type ParentCategoryId = "grammar" | "placement" | "pronunciation";

export interface ParentCategoryConfig {
  id: ParentCategoryId;
  /** VI-primary bucket title (non-negotiable #1). */
  titleVi: string;
  /** EN secondary — shown more prominently for EN-locale parents (Q2=C). */
  titleEn: string;
  /**
   * ~90-second Vietnamese explainer video for this category.
   *
   * Q3=B PHASED: the slot exists now; content backfills later. ALWAYS
   * null-safe — `null` means "no video yet", render the bucket without it.
   * When the content workstream lands, set this to the hosted URL (the
   * same `room-audio`-style public bucket pattern, or a CDN URL).
   */
  videoUrl: string | null;
}

/**
 * Category-bucket registry. Order is the parent-view render order:
 * grammar first (most legible to a parent), then placement, then
 * pronunciation.
 *
 * `videoUrl: null` across the board today — Q3=B phased. The structure is
 * the deliverable; the videos are the follow-up content workstream.
 */
export const PARENT_CATEGORIES: readonly ParentCategoryConfig[] = [
  {
    id: "grammar",
    titleVi: "Ngữ pháp đang luyện",
    titleEn: "Grammar in progress",
    videoUrl: null, // Q3=B phased — backfilled by the video workstream.
  },
  {
    id: "placement",
    titleVi: "Từ bài kiểm tra trình độ",
    titleEn: "From the placement test",
    videoUrl: null, // Q3=B phased — backfilled by the video workstream.
  },
  {
    id: "pronunciation",
    titleVi: "Phát âm đang luyện",
    titleEn: "Pronunciation in progress",
    videoUrl: null, // Q3=B phased — backfilled by the video workstream.
  },
] as const;

export function getCategoryConfig(
  id: ParentCategoryId,
): ParentCategoryConfig | undefined {
  return PARENT_CATEGORIES.find((c) => c.id === id);
}
