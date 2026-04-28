// src/lib/writing/draftStorage.ts
//
// localStorage-backed draft store keyed by prompt id. The session page
// calls `saveDraft` on a 5-second debounce so users don't lose work to
// a refresh / sleep / route change. We never sync to Supabase: drafts
// are pre-submission state and the privacy story is "stays on this
// device until you click Submit".
//
// Storage key: `mb_writing_draft:<promptId>` — keeps each prompt
// independent so switching prompts doesn't blow away the other draft.

const PREFIX = "mb_writing_draft:";

export interface WritingDraft {
  text: string;
  /** ms since epoch — used to age out stale drafts. */
  updatedAt: number;
  /** Cumulative seconds the user has spent on this prompt. */
  timeSpentSeconds: number;
}

function key(promptId: string): string {
  return `${PREFIX}${promptId}`;
}

export function loadDraft(promptId: string): WritingDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key(promptId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<WritingDraft>;
    if (typeof parsed.text !== "string") return null;
    return {
      text: parsed.text,
      updatedAt:
        typeof parsed.updatedAt === "number" ? parsed.updatedAt : Date.now(),
      timeSpentSeconds:
        typeof parsed.timeSpentSeconds === "number" ? parsed.timeSpentSeconds : 0,
    };
  } catch {
    return null;
  }
}

export function saveDraft(promptId: string, draft: WritingDraft): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key(promptId), JSON.stringify(draft));
  } catch {
    /* private mode / quota — silently no-op */
  }
}

export function clearDraft(promptId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key(promptId));
  } catch {
    /* no-op */
  }
}

/**
 * Word counter — splits on whitespace and ignores empty tokens. Matches
 * the count Mercy and the AI feedback function will see.
 */
export function countWords(text: string): number {
  if (!text) return 0;
  const tokens = text.trim().split(/\s+/);
  if (tokens.length === 1 && tokens[0] === "") return 0;
  return tokens.length;
}
