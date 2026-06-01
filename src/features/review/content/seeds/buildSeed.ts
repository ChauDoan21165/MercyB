// src/features/review/content/seeds/buildSeed.ts
//
// Turns a list of ReviewCandidates into a gated seed: run the batch through the
// validation gate, take the first N certified cards at the requested CEFR level,
// and produce a structured seed + a quarantine summary. PURE (no IO) so it's
// fully testable; the runner script (../scripts/build-seeds.ts) wraps it with
// fs writes. A seed is "for-review" — building it does NOT wire a flow live.

import type { ReviewFlowId } from "@/features/review/types";
import {
  runGateBatch,
  type CefrLevel,
  type GateOptions,
  type QuarantineReason,
  type ReviewCandidate,
} from "../validate";

export interface BuildSeedOptions extends GateOptions {
  flow: ReviewFlowId;
  /** CEFR level to seed from (e.g. "A1"). */
  level: CefrLevel;
  /** Max cards in the seed. */
  limit: number;
}

export interface Seed {
  flow: ReviewFlowId;
  level: CefrLevel;
  /** Marker so no consumer mistakes a seed for live, reviewed content. */
  status: "for-review";
  /** Total certified across ALL levels (context for reviewers). */
  certifiedTotal: number;
  /** Certified at the seed's level. */
  certifiedAtLevel: number;
  /** The seed cards (certified, at level, capped to limit). */
  cards: ReviewCandidate[];
}

export interface QuarantineReport {
  flow: ReviewFlowId;
  total: number;
  /** Count per reason code. */
  byReason: Partial<Record<QuarantineReason, number>>;
  /** A few examples per reason for human triage. */
  samples: Array<{ id: string; front: string; back: string; reasons: QuarantineReason[] }>;
}

export interface BuildSeedResult {
  seed: Seed;
  quarantine: QuarantineReport;
}

export async function buildSeed(
  candidates: readonly ReviewCandidate[],
  opts: BuildSeedOptions,
): Promise<BuildSeedResult> {
  const { certified, quarantined } = await runGateBatch(candidates, opts);

  const atLevel = certified.filter((c) => c.cefr === opts.level);
  const cards = atLevel.slice(0, opts.limit);

  const byReason: Partial<Record<QuarantineReason, number>> = {};
  for (const q of quarantined) {
    for (const r of q.reasons) byReason[r] = (byReason[r] ?? 0) + 1;
  }

  return {
    seed: {
      flow: opts.flow,
      level: opts.level,
      status: "for-review",
      certifiedTotal: certified.length,
      certifiedAtLevel: atLevel.length,
      cards,
    },
    quarantine: {
      flow: opts.flow,
      total: quarantined.length,
      byReason,
      samples: quarantined.slice(0, 25).map((q) => ({
        id: q.candidate.id,
        front: q.candidate.front,
        back: q.candidate.back,
        reasons: q.reasons,
      })),
    },
  };
}
