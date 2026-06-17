import { describe, expect, it } from "vitest";
import { C2_DISK_FLOOR_RULE, classifyDiskFloorFailure } from "../../scripts/ops/c2-runner-disk-floor-rule.mjs";

describe("C2 runner disk-floor factory rule", () => {
  it("documents the C2 disk floor and build target", () => {
    expect(C2_DISK_FLOOR_RULE).toMatchObject({
      machine: "C2",
      targetPath: "/Users/chaudoanm3/gitlab-runner-builds",
      floorGb: 14,
    });
  });

  it("classifies a DISK_GATE floor miss as runner infrastructure, not product code", () => {
    const result = classifyDiskFloorFailure(
      "DISK_GATE: 13.90GB < 14GB floor - job refused (target=/Users/chaudoanm3/gitlab-runner-builds runner=mac-runner-2)",
    );

    expect(result).toMatchObject({
      matched: true,
      classification: "runner_infrastructure_disk_floor",
      productCodeFailure: false,
      successStreakCanAdvance: false,
      freeGb: 13.9,
      floorGb: 14,
      machine: "C2",
      targetPath: "/Users/chaudoanm3/gitlab-runner-builds",
    });
    expect(result.actions).toEqual([
      "quarantine_or_clean_runner_before_retry",
      "retry_main_pipeline_after_runner_disk_recovers",
      "advance_success_streak_only_after_clean_retry",
    ]);
  });

  it("does not classify unrelated script failures as disk-floor failures", () => {
    const result = classifyDiskFloorFailure("npm test failed with assertion error");

    expect(result).toEqual({
      matched: false,
      classification: "unknown",
      productCodeFailure: null,
      successStreakCanAdvance: null,
      actions: [],
    });
  });
});
