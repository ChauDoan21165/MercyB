/**
 * Stage 3B — Suggested Practice engine.
 *
 * Pure function that maps a learner's Stage 3A weakness state to a
 * ranked list of up to 3 practice suggestions — one per Stage 3A
 * source (L1, placement, pronunciation), surfacing the strongest
 * signal each source exposes.
 *
 * Hard invariants (per Stage 3A boundaries — they extend to 3B):
 *   - Pure function. No I/O. No localStorage reads. No fetch.
 *   - No Supabase imports. No `mercy_user_facts`.
 *   - Deterministic: identical input → identical output, byte-for-byte.
 *   - Labels resolve via `stage-3a/taxonomy.ts` — never duplicate the
 *     label tables here. Unknown tags get the taxonomy's neutral
 *     fallback, never a raw engineer-tag in user-facing copy.
 *
 * Ranking rule (v1):
 *   - At most one item per kind, in order: L1 → placement → pronunciation.
 *   - Within each kind, pick the strongest signal the aggregator
 *     surfaces. The Stage 3A aggregator already pre-sorts each source
 *     for us (L1 by count desc + lastSeen desc, pronunciation by
 *     errorRate desc) so we take the head element. Placement carries
 *     no count/severity in the local snapshot, so we take the first
 *     entry verbatim — matches the snapshot's own ordering, which is
 *     all the local source exposes today.
 *   - Empty input on a source → that source contributes nothing.
 *   - All three sources empty → returns `[]`.
 *
 * Why one-per-kind: keeps the Day-5 UI's "3 cards" layout balanced
 * across signal types. Lifting the cap would surface duplicates that
 * read as the same suggestion to a learner. The cap is intentional and
 * called out here so a future contributor doesn't quietly raise it.
 */

import type { LocalWeaknessMap } from "@/lib/stage-3a/aggregator";
import {
  describeL1Tag,
  describePhonemeAxis,
  describePlacementWeakness,
} from "@/lib/stage-3a/taxonomy";

import type { SuggestedPracticeItem } from "./types";

/**
 * Engine input alias. The Day-3 aggregator's `LocalWeaknessMap` IS the
 * Stage 3A state — re-exported under a 3B-flavoured name so call sites
 * read naturally.
 */
export type Stage3AState = LocalWeaknessMap;

export function selectSuggestedPractice(
  state: Stage3AState,
): SuggestedPracticeItem[] {
  const items: SuggestedPracticeItem[] = [];

  const topL1 = state.topL1Patterns[0];
  if (topL1) {
    const desc = describeL1Tag(topL1.tag);
    items.push({
      id: `l1:${topL1.tag}`,
      kind: "l1",
      sourceTag: topL1.tag,
      viLabel: desc.shortVi,
      enLabel: desc.shortEn,
      rationale: `Mẫu này đã xuất hiện ${topL1.count} lần gần đây.`,
    });
  }

  const topPlacement = state.placementWeaknesses[0];
  if (topPlacement) {
    const desc = describePlacementWeakness(topPlacement.tag);
    items.push({
      id: `placement:${topPlacement.tag}`,
      kind: "placement",
      sourceTag: topPlacement.tag,
      viLabel: desc.shortVi,
      enLabel: desc.shortEn,
      rationale: "Ghi nhận từ bài kiểm tra trình độ.",
    });
  }

  const topPron = state.topPronunciationPainPoints[0];
  if (topPron) {
    const desc = describePhonemeAxis(topPron.axis);
    const errorPct = Math.round(clamp01(topPron.errorRate) * 100);
    items.push({
      id: `pronunciation:${topPron.axis}`,
      kind: "pronunciation",
      sourceTag: topPron.axis,
      viLabel: desc.shortVi,
      enLabel: desc.shortEn,
      rationale: `Tỉ lệ chưa đúng ${errorPct}% qua ${topPron.samples} lần luyện.`,
    });
  }

  return items;
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}
