/**
 * Stage 3A — Placement v3 snapshot adapter.
 *
 * Local-only mirror of the placement-completion snapshot. The server-side
 * `placement-v3-session` edge function already writes the canonical
 * `profiles.placement_cefr` / `placement_weaknesses` / `placement_completed_at`
 * columns on session completion (PR #1159, "directional carve-out" of the
 * "no Placement writeback" invariant). This adapter writes a redundant
 * copy to `localStorage` so the Stage 3A "What I'm Weak At" screen can
 * read it without a Supabase round-trip.
 *
 * Design source: `docs/stage-3a/local-weakness-map-design.md` §2.2 +
 * §4. The design proposes the minimum shape `{ completedAt, weaknessTags }`;
 * this adapter's brief extends it with `cefr` + `sessionId` so the Stage 3A
 * aggregator can disambiguate snapshots and surface the level honestly.
 *
 * Hard invariants:
 *   - Local-only. NEVER writes to `profiles.placement_*` or any Supabase
 *     row. The placement engine itself is the only writer of that row;
 *     this adapter is a read-side mirror only.
 *   - Best-effort. localStorage may be denied (private mode, quota,
 *     embedded WebView) — writes drop silently. The Supabase row is the
 *     source of truth; this mirror is a UX accelerator.
 *   - Latest-only. Single object (not an array). A new snapshot
 *     overwrites the previous one. Aligns with the design doc's
 *     "Single write per completion" requirement.
 */

const STORAGE_KEY = "mb.stage3a.placement.snapshot";

export interface PlacementSnapshot {
  /** CEFR band (e.g. "A2", "B1"). */
  cefr: string;
  /** Stable tag IDs (e.g. `l1Flags[].id`, snake_case). No learner text. */
  weaknesses: string[];
  /** Epoch milliseconds — `Date.parse(results.completedAt)`. */
  completedAt: number;
  /** Session UUID — matches `placement_v3_sessions.id`. */
  sessionId: string;
}

function getLocalStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

export function recordPlacementSnapshot(snapshot: PlacementSnapshot): void {
  const ls = getLocalStorage();
  if (!ls) return;
  try {
    ls.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Quota exceeded, denied, or any other write failure — drop silently.
    // The server-side write to `profiles.placement_*` is the source of
    // truth; this mirror is an accelerator, not a correctness boundary.
  }
}

export function readPlacementSnapshot(): PlacementSnapshot | null {
  const ls = getLocalStorage();
  if (!ls) return null;
  try {
    const raw = ls.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const s = parsed as Partial<PlacementSnapshot>;
    if (
      typeof s.cefr !== "string" ||
      typeof s.completedAt !== "number" ||
      typeof s.sessionId !== "string" ||
      !Array.isArray(s.weaknesses) ||
      !s.weaknesses.every((w) => typeof w === "string")
    ) {
      return null;
    }
    return {
      cefr: s.cefr,
      weaknesses: s.weaknesses,
      completedAt: s.completedAt,
      sessionId: s.sessionId,
    };
  } catch {
    // Malformed JSON, storage exception — treat as "no snapshot".
    return null;
  }
}
