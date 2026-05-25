// src/lib/stage-3a/adapters/pronunciation-recent.ts
//
// Stage 3A — Local Weakness Map adapter for the pronunciation signal.
// Mirrors per-phoneme scores from completed Speak-tab attempts into a
// localStorage ring buffer at `mb.stage3a.pronunciation.recent`,
// capped at the last 30 entries. Each entry: phoneme key + numeric
// score + timestamp.
//
// `sessionAttempts.ts` is explicitly in-memory only (its header at
// lines 1-17 says "DB-backed long-term history is /progress
// dashboard's concern"). This adapter mirrors a slice across
// sessions for the local-only Stage 3A surface, without touching
// the per-session scorer state.
//
// Local-only. Phoneme key strings + numeric scores + timestamps
// ONLY — no audio blobs, no transcripts, no learner text, no PII
// per ROADMAP line 103.

const KEY = "mb.stage3a.pronunciation.recent";
const CAP = 30;

export type PronunciationRecentEntry = { phoneme: string; score: number; t: number };

export function recordPronunciationPhonemes(
  phonemes: ReadonlyArray<{ phoneme: string; score: number }>,
  now: number = Date.now(),
): void {
  if (typeof window === "undefined" || !Array.isArray(phonemes) || phonemes.length === 0) return;
  try {
    const raw = window.localStorage.getItem(KEY);
    const prev: PronunciationRecentEntry[] = raw ? JSON.parse(raw) : [];
    const incoming = phonemes
      .filter((p) => typeof p?.phoneme === "string" && p.phoneme.length > 0 && Number.isFinite(p?.score))
      .map((p) => ({ phoneme: p.phoneme, score: p.score, t: now }));
    if (incoming.length === 0) return;
    const next = [...prev, ...incoming].slice(-CAP);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // localStorage quota / disabled — swallow; never break the Speak tab.
  }
}
