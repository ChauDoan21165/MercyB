/**
 * Sentence submission + review flow.
 *
 * Thin service layer around the `user_submitted_sentences` table. Every
 * function returns a discriminated `{ ok: true, data } | { ok: false, error }`
 * so UI callers can branch without try/catch. All auth + admin gates
 * happen at the DB (RLS) — these helpers just add validation, friendly
 * error codes, and same-day dedup guard.
 *
 * The UI should assume every operation can fail and surface the `error`
 * string to the user. Admin-only functions (`getPendingSubmissions`,
 * `approveSubmission`, `rejectSubmission`) also verify admin at the
 * client side for faster UX; the RLS policy is the real enforcement.
 */

import { supabase } from '@/lib/supabaseClient';
import { requireAdmin, requireAuth } from '@/lib/security/authGuard';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export const SUBMISSION_DIFFICULTY_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'] as const;
export type SubmissionDifficulty = (typeof SUBMISSION_DIFFICULTY_LEVELS)[number];

export interface SubmissionPayload {
  en: string;
  vi: string;
  context?: string | null;
  difficulty?: SubmissionDifficulty | null;
  suggestedL1Tag?: string | null;
}

export interface SubmissionRow {
  id: string;
  submitter_user_id: string | null;
  en: string;
  vi: string;
  context: string | null;
  difficulty: SubmissionDifficulty | null;
  suggested_l1_tag: string | null;
  submitted_at: string;
  status: SubmissionStatus;
  reviewed_at: string | null;
  reviewed_by_user_id: string | null;
  review_notes: string | null;
}

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };

const EN_MIN = 5;
const VI_MIN = 3;
const EN_MAX = 500;
const VI_MAX = 500;
const L1_TAG_PATTERN = /^vi_l1_[a-z0-9_]+$/;

// ──────────────────────────────────────────────────────────────────────
// Validation
// ──────────────────────────────────────────────────────────────────────

/**
 * Pure validator. Returns the first failing field's message, or null
 * when the payload is acceptable. Exposed so the UI can run it
 * synchronously before hitting Supabase.
 */
export function validateSubmissionPayload(
  payload: SubmissionPayload,
): string | null {
  const en = (payload.en ?? '').trim();
  const vi = (payload.vi ?? '').trim();

  if (en.length < EN_MIN) {
    return `English sentence must be at least ${EN_MIN} characters.`;
  }
  if (en.length > EN_MAX) {
    return `English sentence must be ${EN_MAX} characters or fewer.`;
  }
  if (vi.length < VI_MIN) {
    return `Vietnamese translation must be at least ${VI_MIN} characters.`;
  }
  if (vi.length > VI_MAX) {
    return `Vietnamese translation must be ${VI_MAX} characters or fewer.`;
  }
  if (
    payload.difficulty != null &&
    !SUBMISSION_DIFFICULTY_LEVELS.includes(payload.difficulty)
  ) {
    return 'Difficulty must be one of A1, A2, B1, B2, C1.';
  }
  if (
    payload.suggestedL1Tag != null &&
    payload.suggestedL1Tag !== '' &&
    !L1_TAG_PATTERN.test(payload.suggestedL1Tag)
  ) {
    return 'Suggested L1 tag must match vi_l1_<slug>.';
  }
  return null;
}

// ──────────────────────────────────────────────────────────────────────
// Submitter operations
// ──────────────────────────────────────────────────────────────────────

export async function submitSentence(
  submitterUserId: string,
  payload: SubmissionPayload,
): Promise<Result<SubmissionRow>> {
  if (!submitterUserId) {
    return { ok: false, error: 'Authentication required.', code: 'AUTH_REQUIRED' };
  }

  const validationError = validateSubmissionPayload(payload);
  if (validationError) {
    return { ok: false, error: validationError, code: 'VALIDATION' };
  }

  // Client-side same-day dedup guard: better UX than a raw unique-index
  // error. The DB still has the unique index as a last-resort check.
  const dupCheck = await hasSameDaySubmission(submitterUserId, payload.en);
  if (dupCheck.ok && dupCheck.data) {
    return {
      ok: false,
      error: 'You already submitted this sentence today. Try again tomorrow or submit a different one.',
      code: 'DUPLICATE_TODAY',
    };
  }

  const row = {
    submitter_user_id: submitterUserId,
    en: payload.en.trim(),
    vi: payload.vi.trim(),
    context: normaliseOptional(payload.context),
    difficulty: payload.difficulty ?? null,
    suggested_l1_tag: normaliseOptional(payload.suggestedL1Tag),
  };

  const { data, error } = await supabase
    .from('user_submitted_sentences')
    .insert(row)
    .select('*')
    .single();

  if (error) {
    // Map the DB unique-violation to a friendly message.
    if (error.code === '23505') {
      return {
        ok: false,
        error: 'You already submitted this sentence today.',
        code: 'DUPLICATE_TODAY',
      };
    }
    return { ok: false, error: error.message, code: error.code ?? undefined };
  }

  return { ok: true, data: data as SubmissionRow };
}

export async function getMySubmissions(
  userId: string,
): Promise<Result<SubmissionRow[]>> {
  if (!userId) {
    return { ok: false, error: 'Authentication required.', code: 'AUTH_REQUIRED' };
  }
  const { data, error } = await supabase
    .from('user_submitted_sentences')
    .select('*')
    .eq('submitter_user_id', userId)
    .order('submitted_at', { ascending: false });

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []) as SubmissionRow[] };
}

// ──────────────────────────────────────────────────────────────────────
// Admin operations
// ──────────────────────────────────────────────────────────────────────

export async function getPendingSubmissions(): Promise<Result<SubmissionRow[]>> {
  try {
    await requireAdmin();
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'ADMIN_ACCESS_REQUIRED',
      code: 'ADMIN_ACCESS_REQUIRED',
    };
  }
  const { data, error } = await supabase
    .from('user_submitted_sentences')
    .select('*')
    .eq('status', 'pending')
    .order('submitted_at', { ascending: true });

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []) as SubmissionRow[] };
}

export async function approveSubmission(
  adminUserId: string,
  submissionId: string,
  notes?: string | null,
): Promise<Result<SubmissionRow>> {
  return reviewSubmission(adminUserId, submissionId, 'approved', notes);
}

export async function rejectSubmission(
  adminUserId: string,
  submissionId: string,
  notes?: string | null,
): Promise<Result<SubmissionRow>> {
  return reviewSubmission(adminUserId, submissionId, 'rejected', notes);
}

// ──────────────────────────────────────────────────────────────────────
// Internals
// ──────────────────────────────────────────────────────────────────────

async function reviewSubmission(
  adminUserId: string,
  submissionId: string,
  status: 'approved' | 'rejected',
  notes: string | null | undefined,
): Promise<Result<SubmissionRow>> {
  if (!adminUserId) {
    return { ok: false, error: 'Admin user id required.', code: 'AUTH_REQUIRED' };
  }
  if (!submissionId) {
    return { ok: false, error: 'Submission id required.', code: 'VALIDATION' };
  }
  try {
    await requireAdmin();
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'ADMIN_ACCESS_REQUIRED',
      code: 'ADMIN_ACCESS_REQUIRED',
    };
  }

  const trimmedNotes = (notes ?? '').trim();
  const update = {
    status,
    reviewed_at: new Date().toISOString(),
    reviewed_by_user_id: adminUserId,
    review_notes: trimmedNotes.length > 0 ? trimmedNotes : null,
  };

  const { data, error } = await supabase
    .from('user_submitted_sentences')
    .update(update)
    .eq('id', submissionId)
    .eq('status', 'pending') // avoid re-reviewing an already-reviewed row
    .select('*')
    .single();

  if (error) {
    return { ok: false, error: error.message, code: error.code ?? undefined };
  }
  if (!data) {
    return {
      ok: false,
      error: 'Submission not found or already reviewed.',
      code: 'NOT_PENDING',
    };
  }
  return { ok: true, data: data as SubmissionRow };
}

async function hasSameDaySubmission(
  userId: string,
  en: string,
): Promise<Result<boolean>> {
  const today = new Date();
  const start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  const { data, error } = await supabase
    .from('user_submitted_sentences')
    .select('id')
    .eq('submitter_user_id', userId)
    .ilike('en', en.trim())
    .gte('submitted_at', start.toISOString())
    .lt('submitted_at', end.toISOString())
    .limit(1);

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []).length > 0 };
}

function normaliseOptional(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Auth helper the Contribute page can call to grab the current user id
 * with a consistent error shape.
 */
export async function getCurrentUserIdOrError(): Promise<Result<string>> {
  try {
    const ctx = await requireAuth();
    if (!ctx.user) {
      return { ok: false, error: 'AUTHENTICATION_REQUIRED', code: 'AUTH_REQUIRED' };
    }
    return { ok: true, data: ctx.user.id };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'AUTHENTICATION_REQUIRED',
      code: 'AUTH_REQUIRED',
    };
  }
}
