// src/lib/certificates/types.ts
//
// Public types for the Progress Certificates surface. A1 will replace
// the mock RPC layer with real Supabase calls; the shapes here are the
// contract both sides commit to.
//
// IMPORTANT: `id` is the internal row id (uuid). `certificate_code` is
// the separate public-facing slug used in the verify URL:
//   https://mercyblade.com/cert/{certificate_code}
// Never expose `id` in shareable URLs.

export type CertificateType =
  // XP milestones
  | "xp_100"
  | "xp_500"
  | "xp_1000"
  | "xp_5000"
  // Streak milestones
  | "streak_7"
  | "streak_30"
  | "streak_100"
  // Room completions
  | "rooms_10"
  | "rooms_50"
  | "rooms_100"
  // Vocab mastery
  | "vocab_50"
  | "vocab_200"
  | "vocab_500"
  // Pronunciation drills
  | "pronunciation_25"
  | "pronunciation_100"
  // Writing submissions
  | "writing_10"
  | "writing_50";

export interface MilestoneSnapshot {
  /** Total XP earned to date. */
  total_xp: number;
  /** Current streak length in days. */
  streak_days: number;
  /** Distinct rooms (lessons) marked complete. */
  rooms_completed: number;
  /** Vocabulary items reviewed/mastered. */
  vocab_mastered: number;
  /** Pronunciation drill completions. */
  pronunciation_drills: number;
  /** Writing submissions accepted. */
  writing_submissions: number;
}

export interface EarnedCertificate {
  /** Internal row id (uuid). Never include in public URLs. */
  id: string;
  user_id: string;
  certificate_type: CertificateType;
  earned_at: string; // ISO
  /** Public-facing slug for shareable links. Distinct from `id`. */
  certificate_code: string;
  /** Free-form metadata persisted alongside the row. The backfill
   *  flow sets `backfilled: true` so the toast stays quiet for
   *  retroactive grants. */
  metadata: Record<string, unknown> & { backfilled?: boolean };
}

/** Build the public verify URL for a certificate. Single source of
 *  truth — change here if the route ever moves. */
export function publicCertificateUrl(certificateCode: string): string {
  return `https://mercyblade.com/cert/${encodeURIComponent(certificateCode)}`;
}
