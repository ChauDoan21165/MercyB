// src/lib/stage-3a/adapters/l1-recent.ts
//
// Stage 3A — Local Weakness Map adapter for the L1 detector signal.
// Writes a per-tag timestamp into a small localStorage ring buffer
// when the detector flags an L1-transfer pattern on a tutor turn.
//
// Local-only. Writes counts + timestamps + tag strings ONLY (no raw
// learner text, no transcripts, no corrected sentence text, no PII).
// See ROADMAP §"Stage 3 Study OS Boundaries" (lines 85-105) and §
// "Local-Only Posture" (lines 107-111).
//
// Read-side aggregation + windowing lives in the Stage 3A read PR.
// This adapter is intentionally dumb: append, trim to cap, write.

const KEY = "mb.stage3a.l1.recent";
const CAP = 20;

export type L1RecentEntry = { tag: string; t: number };

export function recordL1Tag(tag: string, now: number = Date.now()): void {
  if (typeof window === "undefined" || !tag) return;
  try {
    const raw = window.localStorage.getItem(KEY);
    const prev: L1RecentEntry[] = raw ? JSON.parse(raw) : [];
    const next = [...prev, { tag, t: now }].slice(-CAP);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // localStorage may throw on quota / disabled cookies — swallow.
    // Stage 3A is a nice-to-have surface; never break the tutor.
  }
}
