// src/lib/teacher-portal/types.ts
//
// Shared TypeScript types for the teacher review portal. Mirror of the
// Postgres schema in 20260533000000_teacher_feedback.sql.

export type ContentType =
  | "vstep"
  | "toeic"
  | "ielts"
  | "cultural"
  | "profession"
  | "room";

export const CONTENT_TYPES: ReadonlyArray<ContentType> = [
  "vstep",
  "toeic",
  "ielts",
  "cultural",
  "profession",
];

export type ContentReviewState =
  | "not_reviewed"
  | "in_review"
  | "approved"
  | "needs_revision"
  | "rejected";

export type TeacherFeedbackSeverity = "1" | "2" | "3" | "4" | "5";

export type TeacherFeedbackStatus =
  | "open"
  | "admin_acknowledged"
  | "correction_applied"
  | "rejected_by_admin";

export type TeacherDecision = "approve" | "needs_revision" | "reject";

export type TeacherIssueCategory =
  | "vocabulary"
  | "grammar"
  | "cultural_accuracy"
  | "clarity"
  | "tone";

export const ISSUE_CATEGORIES: ReadonlyArray<TeacherIssueCategory> = [
  "vocabulary",
  "grammar",
  "cultural_accuracy",
  "clarity",
  "tone",
];

export interface TeacherIssue {
  category: TeacherIssueCategory;
  note?: string;
}

export interface ContentReviewStatusRow {
  content_id: string;
  content_type: ContentType;
  status: ContentReviewState;
  marked_for_review_at: string | null;
  last_reviewed_at: string | null;
  reviewer_id: string | null;
}

export interface TeacherFeedbackRow {
  id: string;
  content_id: string;
  content_type: string;
  reviewer_id: string;
  severity: TeacherFeedbackSeverity;
  issues: TeacherIssue[];
  suggested_correction: string | null;
  decision: TeacherDecision;
  status: TeacherFeedbackStatus;
  admin_response: string | null;
  created_at: string;
  resolved_at: string | null;
}

// Vietnamese display labels — Vietnamese-first per CLAUDE.md #1.
export const CONTENT_TYPE_LABEL_VI: Record<ContentType, string> = {
  vstep: "VSTEP",
  toeic: "TOEIC",
  ielts: "IELTS",
  cultural: "Văn hoá Việt",
  profession: "Nghề nghiệp",
  room: "Phòng học",
};

export const CONTENT_TYPE_LABEL_EN: Record<ContentType, string> = {
  vstep: "VSTEP",
  toeic: "TOEIC",
  ielts: "IELTS",
  cultural: "VN Cultural",
  profession: "Profession",
  room: "Room",
};

export const ISSUE_LABEL_VI: Record<TeacherIssueCategory, string> = {
  vocabulary: "Từ vựng",
  grammar: "Ngữ pháp",
  cultural_accuracy: "Chính xác văn hoá",
  clarity: "Rõ ràng",
  tone: "Giọng điệu",
};

export const DECISION_LABEL_VI: Record<TeacherDecision, string> = {
  approve: "Duyệt",
  needs_revision: "Cần chỉnh sửa",
  reject: "Từ chối",
};

export function parseItemId(itemId: string): {
  contentType: ContentType;
  contentId: string;
} | null {
  const idx = itemId.indexOf(":");
  if (idx <= 0) return null;
  const ct = itemId.slice(0, idx) as ContentType;
  const ci = itemId.slice(idx + 1);
  if (!ci) return null;
  if (
    ct !== "vstep" &&
    ct !== "toeic" &&
    ct !== "ielts" &&
    ct !== "cultural" &&
    ct !== "profession" &&
    ct !== "room"
  ) {
    return null;
  }
  return { contentType: ct, contentId: ci };
}

export function buildItemId(contentType: ContentType, contentId: string): string {
  return `${contentType}:${contentId}`;
}
