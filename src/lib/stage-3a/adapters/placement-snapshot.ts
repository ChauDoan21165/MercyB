// src/lib/stage-3a/adapters/placement-snapshot.ts
//
// Stage 3A — Local Weakness Map adapter for the Placement v3 signal.
// Mirrors the placement-completion weakness-flag list into a small
// localStorage snapshot at `mb.stage3a.placement.snapshot`. Single
// overwrite per completion; no history kept.
//
// The flag IDs come from `PlacementV3Results.l1Flags[].id` (already
// stable, snake_case, matches the L1 detector tag namespace). The
// human-readable label/evidence on each `l1Flags` entry is NOT
// mirrored — the Stage 3A reader reconstructs prose from
// `WEAKNESS_CATALOG` at read time.
//
// Local-only. Tag-id strings + ISO completion timestamp only — no
// raw learner answers, no recordings, no PII per ROADMAP line 103.
// Pragmatic reading of "no signal-collection code change" ratified
// by owner; this adapter sits ALONGSIDE the existing Supabase
// `profiles.placement_weaknesses` writeback, mirroring a slice for
// the local-only Stage 3A surface.

const KEY = "mb.stage3a.placement.snapshot";

export type PlacementSnapshot = {
  completedAt: string;
  weaknessTags: string[];
};

export function recordPlacementSnapshot(snapshot: PlacementSnapshot): void {
  if (typeof window === "undefined") return;
  if (!snapshot?.completedAt || !Array.isArray(snapshot.weaknessTags)) return;
  try {
    const tags = snapshot.weaknessTags.filter((t): t is string => typeof t === "string" && t.length > 0);
    window.localStorage.setItem(KEY, JSON.stringify({ completedAt: snapshot.completedAt, weaknessTags: tags }));
  } catch {
    // localStorage quota / disabled — swallow; never break placement.
  }
}
