// src/lib/feedback/family-bridge/content-pack.ts
//
// Step 13 — Family-Bridge content pack.
//
// PURPOSE: all parent-facing / family-facing copy strings for the
// family-bridge surface in one authorable, testable, data-only file.
// No React, no Supabase, no routing — pure data.
//
// SCOPE (from STRATEGY.md Step 13 + docs/architecture/L6-parent-teacher-family-layer.md):
//   • parent-facing VN explainer strings (onboarding + weekly summary
//     intro that frames the surface for a Vietnamese parent)
//   • progress-share copy (what the learner sends to family; what the
//     family recipient sees as orientation copy)
//   • family CTA inventory (indexed by placement/trigger — ready for
//     any component that pulls in the family-bridge angle)
//
// NOT IN SCOPE HERE:
//   • Per-pattern FamilyBridgeExplanation entries — those live in
//     vi-grammar.ts / interference-explanations.ts.
//   • The /parent/:learnerId page — no new route yet (!670 product call
//     pending; Chau's "drop or build-into-share" decision still open).
//   • Email digest templates — separate workstream.
//
// VOICE (locked 2026-06-05, same contract as vi-grammar.ts):
//   • Address the learner as "bạn" (adult learner), never "con".
//   • Address the family member in the third person as "người thân"
//     when helpful; never presume the family member's role.
//   • Warm, respectful — never "this is wrong", frame as "đây là điều
//     rất nhiều người Việt mình gặp".
//   • Vietnamese-first prose. Hanoi-standard written form.
//   • No jargon. No English words dropped into VN unless universally
//     adopted (e.g. "app", "email").
//   • Encouraging, never corrective. The family is a helper, not a grader.
//
// VALIDATION: items have a `validated` flag (same pattern as
// FamilyBridgeExplanation). Only validated items should be rendered
// in parent-facing surfaces. Draft items are authored here for Chau's
// review; they carry `validated: false` until signed off.

// ─────────────────────────────────────────────────────────────────────────────
// 1. Parent / family onboarding intro strings
//    Used on the first screen a parent/family member sees when accessing
//    the parent-view surface (or a shared progress link).
// ─────────────────────────────────────────────────────────────────────────────

export interface FamilyBridgeIntroStrings {
  /** Short headline. ≤ 80 chars VI. */
  headlineVi: string;
  /** One-sentence sub-headline. ≤ 140 chars VI. */
  subheadVi: string;
  /** 2–3 sentence body. Explains what the parent will see. */
  bodyVi: string;
  /** English mirror of headline (for bilingual rendering). */
  headlineEn: string;
  /** English mirror of subhead. */
  subheadEn: string;
  validated: boolean;
}

/**
 * Intro strings for the parent/family landing — the first thing a parent
 * reads when they open the parent-view or a shared progress link.
 * Voice: warm, honest, no-gamification.
 */
export const FAMILY_BRIDGE_INTRO: FamilyBridgeIntroStrings = {
  headlineVi: "Con bạn đang học tiếng Anh để kết nối với gia đình",
  subheadVi:
    "MercyBlade theo dõi điều bạn thực sự cần biết — không phải điểm số, mà là bạn đang tiến bộ ở chỗ nào.",
  bodyVi:
    "Bên dưới là những điểm tiếng Anh mà bạn đang luyện tập nhiều nhất trong thời gian gần đây. " +
    "Mỗi mục đi kèm một giải thích bằng tiếng Việt — vì sao người Việt mình hay gặp khó ở chỗ đó, và gia đình có thể hỗ trợ như thế nào. " +
    "Không có điểm, không có thứ hạng — chỉ có một bức tranh trung thực về hành trình học của bạn.",
  headlineEn: "Learning English to connect with family",
  subheadEn:
    "MercyBlade tracks what your family actually needs to know — not scores, but where you're genuinely improving.",
  validated: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. Progress-share copy
//    Used on the /share/progress page and in any "share with family" flow.
//    Two sides: what the learner sends, and what the family recipient reads.
// ─────────────────────────────────────────────────────────────────────────────

export interface ProgressShareCopyEntry {
  id: string;
  /** Who is sending this (learner context). */
  senderContext: "learner";
  /** Short label for the template picker (if shown). */
  labelVi: string;
  labelEn: string;
  /**
   * Template the learner uses to share with family. Placeholders:
   *   {name} — learner's display name
   *   {streak} — current streak (days)
   *   {topPattern} — top weakness tag's patternNameVi
   */
  learnerMessageVi: string;
  learnerMessageEn: string;
  /** One-sentence VN context shown to the family RECIPIENT above the card. */
  recipientContextVi: string;
  recipientContextEn: string;
  validated: boolean;
}

/**
 * Copy templates for sharing progress with family.
 * Index by id. The share-page component picks from this list.
 */
export const PROGRESS_SHARE_COPY: readonly ProgressShareCopyEntry[] = [
  {
    id: "family-share-milestone",
    senderContext: "learner",
    labelVi: "Gửi gia đình",
    labelEn: "Send to family",
    learnerMessageVi:
      "Mình đang luyện tiếng Anh với MercyBlade. Đây là trang theo dõi tiến độ của mình — có giải thích tiếng Việt cho ba/mẹ/anh/chị em dễ hiểu.",
    learnerMessageEn:
      "I've been learning English with MercyBlade. Here's my progress page — it has Vietnamese explanations so family can follow along.",
    recipientContextVi:
      "Bạn của bạn đang luyện tiếng Anh và muốn chia sẻ hành trình với gia đình.",
    recipientContextEn:
      "Your family member is learning English and wanted to share their progress with you.",
    validated: false,
  },
  {
    id: "family-share-parent",
    senderContext: "learner",
    labelVi: "Gửi ba mẹ",
    labelEn: "Send to parents",
    learnerMessageVi:
      "Ba/mẹ ơi, đây là trang MercyBlade theo dõi tiếng Anh của con. " +
      "Có phần giải thích tiếng Việt để ba/mẹ hiểu con đang học gì và đang gặp khó ở chỗ nào.",
    learnerMessageEn:
      "Mom/Dad, this is my MercyBlade English progress page. " +
      "It has Vietnamese explanations so you can see what I'm working on.",
    recipientContextVi:
      "Con bạn đang luyện tiếng Anh với MercyBlade và muốn ba/mẹ cùng theo dõi hành trình.",
    recipientContextEn:
      "Your child is learning English with MercyBlade and wanted you to follow their journey.",
    validated: false,
  },
  {
    id: "family-share-streak",
    senderContext: "learner",
    labelVi: "Chia sẻ streak",
    labelEn: "Share streak",
    learnerMessageVi:
      "Mình đã học tiếng Anh {streak} ngày liên tiếp với MercyBlade! " +
      "Đây là trang tiến độ nếu bạn/ba mẹ muốn xem mình đang luyện gì.",
    learnerMessageEn:
      "I've been learning English for {streak} days in a row with MercyBlade! " +
      "Here's my progress page if you want to see what I'm working on.",
    recipientContextVi:
      "Người thân của bạn đang duy trì streak học tiếng Anh và muốn chia sẻ với gia đình.",
    recipientContextEn:
      "Your family member is on a learning streak and wanted to share it with you.",
    validated: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. Family CTA inventory
//    Indexed by placement + trigger. Components pull from this by id
//    so copy changes never require component edits.
// ─────────────────────────────────────────────────────────────────────────────

export type FamilyCtaPlacement =
  | "account-page" // /account → after the main content
  | "after-lesson" // displayed after a lesson completes
  | "share-progress-page" // /share/progress secondary CTA
  | "parent-view-empty" // parent view, no weakness data yet
  | "parent-view-entitled" // parent view, learner has data
  | "onboarding-final-step"; // final onboarding card

export interface FamilyBridgeCta {
  id: string;
  placement: FamilyCtaPlacement;
  /**
   * When to show this CTA. Plain English description for engineers;
   * the component implements the actual condition.
   */
  trigger: string;
  labelVi: string;
  labelEn: string;
  /** Optional supporting body text (1 sentence). */
  bodyVi?: string;
  bodyEn?: string;
  /** Link/action. Relative path or logical action key. */
  action: string;
  validated: boolean;
}

/**
 * Full CTA inventory for the family-bridge surface.
 * No rendering logic lives here — components look up CTAs by id.
 */
export const FAMILY_BRIDGE_CTA_INVENTORY: readonly FamilyBridgeCta[] = [
  // ── Account page ──────────────────────────────────────────────────────
  {
    id: "cta-account-invite-family",
    placement: "account-page",
    trigger: "Always shown on /account for authenticated users",
    labelVi: "Mời gia đình theo dõi",
    labelEn: "Invite family to follow along",
    bodyVi: "Chia sẻ hành trình tiếng Anh của bạn với người thân bằng tiếng Việt.",
    bodyEn: "Share your English journey with family in Vietnamese.",
    action: "/referral/invite-family",
    validated: false,
  },
  {
    id: "cta-account-share-progress",
    placement: "account-page",
    trigger: "Shown when learner has at least one lesson completed",
    labelVi: "Chia sẻ tiến độ",
    labelEn: "Share your progress",
    bodyVi: "Gửi cho ba/mẹ hoặc người thân một trang tóm tắt bằng tiếng Việt.",
    bodyEn: "Send your family a Vietnamese-language progress summary.",
    action: "/share/progress",
    validated: false,
  },
  // ── After lesson ──────────────────────────────────────────────────────
  {
    id: "cta-post-lesson-share",
    placement: "after-lesson",
    trigger: "Shown after every 5th lesson completion (milestone)",
    labelVi: "Kể cho gia đình nghe",
    labelEn: "Tell your family",
    bodyVi: "Bạn vừa hoàn thành một bài học. Chia sẻ tiến độ với ba/mẹ?",
    bodyEn: "You just finished a lesson. Want to share your progress with family?",
    action: "/share/progress",
    validated: false,
  },
  {
    id: "cta-post-lesson-invite",
    placement: "after-lesson",
    trigger: "Shown once after the 10th lesson if no family invite sent yet",
    labelVi: "Mời gia đình xem tiến độ của bạn",
    labelEn: "Invite family to see your progress",
    bodyVi: "Ba/mẹ hay người thân sẽ hiểu hơn về hành trình học của bạn.",
    bodyEn: "Your family will understand your learning journey better.",
    action: "/referral/invite-family",
    validated: false,
  },
  // ── Share-progress page ───────────────────────────────────────────────
  {
    id: "cta-share-page-family-explain",
    placement: "share-progress-page",
    trigger: "Always shown on /share/progress as secondary CTA below the card",
    labelVi: "Gửi kèm giải thích tiếng Việt",
    labelEn: "Send with Vietnamese explanation",
    bodyVi: "Chọn mẫu tin nhắn phù hợp để ba/mẹ hoặc người thân dễ hiểu.",
    bodyEn: "Pick a message template so family can easily follow along.",
    action: "open-share-copy-picker",
    validated: false,
  },
  // ── Parent view — empty state ─────────────────────────────────────────
  {
    id: "cta-parent-view-empty-practice",
    placement: "parent-view-empty",
    trigger: "Shown when parent view has no weakness data yet (learner hasn't practiced enough)",
    labelVi: "Bắt đầu luyện tập để xem dữ liệu",
    labelEn: "Start practicing to see data",
    bodyVi: "Sau vài buổi luyện, trang này sẽ hiện những gì bạn đang cần cải thiện.",
    bodyEn: "After a few practice sessions, this page will show what you need most.",
    action: "/rooms",
    validated: false,
  },
  // ── Parent view — has data ────────────────────────────────────────────
  {
    id: "cta-parent-view-ask-mercy",
    placement: "parent-view-entitled",
    trigger: "Shown in each weakness-tag bucket, below the explainer",
    labelVi: "Hỏi Mercy về điều này",
    labelEn: "Ask Mercy about this",
    bodyVi: undefined,
    bodyEn: undefined,
    action: "open-mercy-tutor-context",
    validated: false,
  },
  {
    id: "cta-parent-view-share",
    placement: "parent-view-entitled",
    trigger: "Shown at the bottom of parent view when data is present",
    labelVi: "Chia sẻ trang này",
    labelEn: "Share this page",
    bodyVi: "Gửi link trang tiến độ cho người thân hoặc giáo viên.",
    bodyEn: "Send a progress link to family or a teacher.",
    action: "/share/progress",
    validated: false,
  },
  // ── Onboarding ────────────────────────────────────────────────────────
  {
    id: "cta-onboarding-family-bridge",
    placement: "onboarding-final-step",
    trigger: "Shown on the final onboarding card (after goal selection)",
    labelVi: "Học để kết nối với gia đình",
    labelEn: "Learn to connect with family",
    bodyVi:
      "MercyBlade giải thích tiến độ tiếng Anh của bạn bằng tiếng Việt — để ba/mẹ và người thân hiểu và đồng hành cùng bạn.",
    bodyEn:
      "MercyBlade explains your English progress in Vietnamese — so family can understand and support you.",
    action: "next-onboarding",
    validated: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Convenience accessors
// ─────────────────────────────────────────────────────────────────────────────

/** Look up a CTA by id. Returns undefined if not found. */
export function getFamilyBridgeCta(
  id: string,
): FamilyBridgeCta | undefined {
  return FAMILY_BRIDGE_CTA_INVENTORY.find((c) => c.id === id);
}

/** All CTAs for a given placement, validated or not. */
export function getFamilyBridgeCtasForPlacement(
  placement: FamilyCtaPlacement,
): readonly FamilyBridgeCta[] {
  return FAMILY_BRIDGE_CTA_INVENTORY.filter((c) => c.placement === placement);
}

/** Only the validated (Chau-approved) CTAs for a placement. */
export function getValidatedFamilyBridgeCtasForPlacement(
  placement: FamilyCtaPlacement,
): readonly FamilyBridgeCta[] {
  return getFamilyBridgeCtasForPlacement(placement).filter((c) => c.validated);
}
