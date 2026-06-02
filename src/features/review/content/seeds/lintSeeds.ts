// src/features/review/content/seeds/lintSeeds.ts
//
// Content-lint (DC4): the safety net that proves no UNCERTIFIED card ever sits
// in a committed seed. Pure logic shared by the standalone lint script and the
// CI-enforced vitest test, so the check runs both ways from one source of truth.
//
// What it re-verifies on every committed card: the FULL structural gate
// (non-empty, front-is-Vietnamese, per-language back script, reading/tone, CEFR,
// length, intra-seed dedup). It does NOT re-run the back-translation round-trip
// for generated cards — that needs the build-time Translator (the authored maps),
// which is not persisted in the seed. The round-trip was enforced at build time;
// the lint guards against STRUCTURAL regressions in the committed artifacts (a
// hand-edit, a bad merge, a schema drift). Generated cards are re-gated with a
// pass-through round-trip so a structural regression still fails the lint.

import { runGateBatch, type GateOptions, type ReviewCandidate } from "../validate";
import type { Seed } from "./buildSeed";

export interface SeedLintResult {
  flow: string;
  level: string;
  total: number;
  ok: boolean;
  failures: Array<{ id: string; front: string; reasons: string[] }>;
  statusOk: boolean;
}

// Generated cards already cleared the round-trip at build time; re-running it
// here is impossible (no persisted Translator). Pass-through so the structural
// gate still runs and DUP_ID is still enforced across the seed.
const PASSTHROUGH_ROUNDTRIP: GateOptions = {
  roundTrip: async () => ({ ok: true, similarity: 1 }),
};

/** Lint one parsed seed object. Pure. */
export async function lintSeed(seed: Seed): Promise<SeedLintResult> {
  const cards = (seed.cards ?? []) as ReviewCandidate[];
  const { quarantined } = await runGateBatch(cards, PASSTHROUGH_ROUNDTRIP);

  const statusOk = seed.status === "for-review";

  return {
    flow: String(seed.flow),
    level: String(seed.level),
    total: cards.length,
    ok: quarantined.length === 0 && statusOk,
    statusOk,
    failures: quarantined.map((q) => ({
      id: q.candidate.id,
      front: q.candidate.front,
      reasons: q.reasons,
    })),
  };
}

/** Lint many seeds; ok iff every seed is clean. */
export async function lintSeeds(seeds: readonly Seed[]): Promise<{
  ok: boolean;
  results: SeedLintResult[];
}> {
  const results: SeedLintResult[] = [];
  for (const s of seeds) results.push(await lintSeed(s));
  return { ok: results.every((r) => r.ok), results };
}
