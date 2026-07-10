// WP-001 thesis — top surprises concentrate planted defects better than random.
//
// Constraint 6: on committed fixtures, the top-10 by surprise must concentrate the
// planted defects better than a seeded random 10. If this ever fails, the feature is
// cut. The means are printed so the MR can quote them honestly.
import { describe, it, expect } from "vitest";
import { buildThesisFixture } from "@/lib/tm-int/pred/fixtures";
import { computeThesisMetric } from "@/lib/tm-int/pred/thesis";

describe("WP-001: thesis metric on committed fixtures", () => {
  it("top-10 by surprise concentrates planted defects better than a seeded random 10", () => {
    const fixture = buildThesisFixture();
    const metric = computeThesisMetric(fixture.resolutions, fixture.plantedAnchors, { k: 10, randomTrials: 500 });

    // Print the means so they can be quoted in the MR (constraint 6).
    // eslint-disable-next-line no-console
    console.log(
      `[WP-001 thesis] k=${metric.k} planted=${metric.plantedCount}/${metric.acceptedCount} ` +
        `topConcentration=${metric.topConcentration} randomConcentration=${metric.randomConcentration} ` +
        `lift=${metric.lift} pass=${metric.pass}`,
    );

    expect(fixture.plantedAnchors.length).toBe(10);
    expect(metric.acceptedCount).toBe(60); // all thesis pairs are valid (strictly-before)
    expect(metric.pass).toBe(true);
    // The top set is overwhelmingly planted defects; random is near the base rate (10/60).
    expect(metric.topConcentration).toBeGreaterThanOrEqual(0.7);
    expect(metric.randomConcentration).toBeLessThan(0.3);
    expect(metric.lift).toBeGreaterThan(0.4);
  });

  it("is deterministic — identical means across rebuilds of the committed fixture", () => {
    const a = computeThesisMetric(buildThesisFixture().resolutions, buildThesisFixture().plantedAnchors, { k: 10, randomTrials: 500 });
    const b = computeThesisMetric(buildThesisFixture().resolutions, buildThesisFixture().plantedAnchors, { k: 10, randomTrials: 500 });
    expect(a).toStrictEqual(b);
  });
});
