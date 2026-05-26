// Path: src/services/notebookService.ts
// Personal notebook — per-user saved words & grammar points with SM-2 SRS.

import { supabase } from '@/lib/supabaseClient';

export type NotebookItemType = 'word' | 'grammar';
export type NotebookItemSource = 'room' | 'teacher' | 'manual';
export type NotebookRating = 'again' | 'hard' | 'good' | 'easy';

export const FREE_TIER_LIMIT = 30;

export interface NotebookItem {
  id: string;
  user_id: string;
  item_type: NotebookItemType;
  content_en: string;
  content_vi: string | null;
  notes: string | null;
  source: NotebookItemSource;
  source_ref: string | null;
  audio_url: string | null;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  review_count: number;
  next_review_at: string;
  last_reviewed_at: string | null;
  created_at: string;
}

export interface SaveNotebookInput {
  item_type: NotebookItemType;
  content_en: string;
  content_vi?: string | null;
  notes?: string | null;
  source: NotebookItemSource;
  source_ref?: string | null;
  audio_url?: string | null;
}

export interface SaveResult {
  item: NotebookItem;
  alreadyExisted: boolean;
}

export class NotebookLimitError extends Error {
  constructor(public limit: number) {
    super(`Notebook full (${limit} items on free tier)`);
    this.name = 'NotebookLimitError';
  }
}

export class NotebookAuthError extends Error {
  constructor() {
    super('Not signed in');
    this.name = 'NotebookAuthError';
  }
}

async function requireUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  if (!data.user?.id) throw new NotebookAuthError();
  return data.user.id;
}

export async function listItems(
  filter?: { type?: NotebookItemType | 'all' },
): Promise<NotebookItem[]> {
  const userId = await requireUserId();
  let query = supabase
    .from('user_notebook_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (filter?.type && filter.type !== 'all') {
    query = query.eq('item_type', filter.type);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as NotebookItem[];
}

export async function getDueItems(): Promise<NotebookItem[]> {
  const userId = await requireUserId();
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from('user_notebook_items')
    .select('*')
    .eq('user_id', userId)
    .lte('next_review_at', nowIso)
    .order('next_review_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as NotebookItem[];
}

export async function countItems(): Promise<number> {
  const userId = await requireUserId();
  const { count, error } = await supabase
    .from('user_notebook_items')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) throw error;
  return count ?? 0;
}

export async function findItem(
  itemType: NotebookItemType,
  contentEn: string,
): Promise<NotebookItem | null> {
  const userId = await requireUserId();
  const normalized = contentEn.trim().toLowerCase();
  const { data, error } = await supabase
    .from('user_notebook_items')
    .select('*')
    .eq('user_id', userId)
    .eq('item_type', itemType)
    .ilike('content_en', normalized)
    .maybeSingle();

  if (error) throw error;
  return (data as NotebookItem | null) ?? null;
}

export async function saveItem(
  input: SaveNotebookInput,
  opts: { limit?: number } = {},
): Promise<SaveResult> {
  const userId = await requireUserId();
  const normalized = input.content_en.trim();
  if (!normalized) throw new Error('content_en is required');

  const existing = await findItem(input.item_type, normalized);
  if (existing) return { item: existing, alreadyExisted: true };

  const limit = opts.limit ?? Infinity;
  if (Number.isFinite(limit)) {
    const current = await countItems();
    if (current >= limit) throw new NotebookLimitError(limit);
  }

  const { data, error } = await supabase
    .from('user_notebook_items')
    .insert({
      user_id: userId,
      item_type: input.item_type,
      content_en: normalized,
      content_vi: input.content_vi ?? null,
      notes: input.notes ?? null,
      source: input.source,
      source_ref: input.source_ref ?? null,
      audio_url: input.audio_url ?? null,
    })
    .select('*')
    .single();

  if (error) throw error;
  return { item: data as NotebookItem, alreadyExisted: false };
}

export async function deleteItem(id: string): Promise<void> {
  const userId = await requireUserId();
  const { error } = await supabase
    .from('user_notebook_items')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}

export async function updateItem(
  id: string,
  patch: Partial<Pick<NotebookItem, 'content_vi' | 'notes' | 'audio_url'>>,
): Promise<NotebookItem> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from('user_notebook_items')
    .update(patch)
    .eq('id', id)
    .eq('user_id', userId)
    .select('*')
    .single();
  if (error) throw error;
  return data as NotebookItem;
}

// ── SM-2 spaced repetition ──────────────────────────────────────────────────

const EASE_MIN = 1.3;

interface SrsState {
  ease_factor: number;
  interval_days: number;
  repetitions: number;
}

interface SrsNext {
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_at: string;
}

export function computeNextReview(
  state: SrsState,
  rating: NotebookRating,
  now: Date = new Date(),
): SrsNext {
  let { ease_factor: ease, interval_days: interval, repetitions: reps } = state;

  switch (rating) {
    case 'again':
      reps = 0;
      interval = 1;
      ease = Math.max(EASE_MIN, ease - 0.2);
      break;
    case 'hard':
      interval = Math.max(1, Math.round(interval * 1.2));
      ease = Math.max(EASE_MIN, ease - 0.15);
      break;
    case 'good':
      reps += 1;
      if (reps === 1) interval = 1;
      else if (reps === 2) interval = 6;
      else interval = Math.round(interval * ease);
      break;
    case 'easy':
      reps += 1;
      if (reps === 1) interval = 1;
      else if (reps === 2) interval = 6;
      else interval = Math.round(interval * ease);
      interval = Math.round(interval * 1.3);
      ease = ease + 0.15;
      break;
  }

  const next = new Date(now.getTime());
  next.setDate(next.getDate() + Math.max(1, interval));

  return {
    ease_factor: Math.round(ease * 100) / 100,
    interval_days: Math.max(1, interval),
    repetitions: reps,
    next_review_at: next.toISOString(),
  };
}

export async function reviewItem(
  id: string,
  rating: NotebookRating,
): Promise<NotebookItem> {
  const userId = await requireUserId();

  const { data: current, error: readError } = await supabase
    .from('user_notebook_items')
    .select('ease_factor, interval_days, repetitions, review_count')
    .eq('id', id)
    .eq('user_id', userId)
    .single();
  if (readError) throw readError;
  if (!current) throw new Error('Notebook item not found');

  const now = new Date();
  const next = computeNextReview(
    {
      ease_factor: Number((current as { ease_factor: number }).ease_factor) || 2.5,
      interval_days: Number((current as { interval_days: number }).interval_days) || 0,
      repetitions: Number((current as { repetitions: number }).repetitions) || 0,
    },
    rating,
    now,
  );

  const { data, error } = await supabase
    .from('user_notebook_items')
    .update({
      ease_factor: next.ease_factor,
      interval_days: next.interval_days,
      repetitions: next.repetitions,
      next_review_at: next.next_review_at,
      last_reviewed_at: now.toISOString(),
      review_count:
        (Number((current as { review_count: number }).review_count) || 0) + 1,
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) throw error;
  return data as NotebookItem;
}
