import { describe, expect, it } from "vitest";
import { sequenceToStudyItems } from "@/lib/ai-tutor/studyPath";
import { createEmptyLearnerHistoryProfile } from "@/lib/tutor/learnerHistoryProfile";
import { VN_L1_INTERFERENCE_PATTERNS } from "@/data/placement/vnL1Interference";

const NOW = 1_700_000_000_000;

describe("sequenceToStudyItems", () => {
  it("returns the full catalogue ordered for an empty history (default curriculum)", () => {
    const profile = createEmptyLearnerHistoryProfile("ai-tutor", "en", NOW);
    const items = sequenceToStudyItems(profile, NOW);
    expect(items.length).toBe(VN_L1_INTERFERENCE_PATTERNS.length);
    // Every emitted id is a known pattern, appearing exactly once.
    const ids = items.map((i) => i.patternId);
    expect(new Set(ids).size).toBe(ids.length);
    const known = new Set(VN_L1_INTERFERENCE_PATTERNS.map((p) => p.id));
    expect(ids.every((id) => known.has(id))).toBe(true);
  });

  it("populates each item from the VN_L1 catalogue + sequencer rationale", () => {
    const profile = createEmptyLearnerHistoryProfile("ai-tutor", "en", NOW);
    const [first] = sequenceToStudyItems(profile, NOW);
    const pattern = VN_L1_INTERFERENCE_PATTERNS.find((p) => p.id === first.patternId)!;
    expect(first.name).toBe(pattern.name);
    expect(first.shortDescription).toBe(pattern.shortDescription);
    expect(first.remediation).toBe(pattern.remediation);
    expect(first.rationale.trim().length).toBeGreaterThan(0);
  });

  it("orders highest-severity-first by default (severity high before low)", () => {
    const profile = createEmptyLearnerHistoryProfile("ai-tutor", "en", NOW);
    const items = sequenceToStudyItems(profile, NOW);
    const sevOf = (id: string) =>
      VN_L1_INTERFERENCE_PATTERNS.find((p) => p.id === id)!.severity;
    const rank = { high: 0, medium: 1, low: 2 } as const;
    // The first item should be no lower priority than the last.
    expect(rank[sevOf(items[0].patternId)]).toBeLessThanOrEqual(rank[sevOf(items.at(-1)!.patternId)]);
  });
});
