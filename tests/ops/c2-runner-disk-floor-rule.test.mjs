import { describe, expect, it } from "vitest";
import { C2_DISK_FLOOR_RULE, classifyDiskFloorFailure } from "../../scripts/ops/c2-runner-disk-floor-rule.mjs";

describe("C2 runner disk-floor factory rule", () => {
  it("documents the C2 disk floor and build target", () => {
    expect(C2_DISK_FLOOR_RULE).toMatchObject({
      machine: "C2",
      targetPath: "/Users/chaudoanm3/gitlab-runner-builds",
      floorGb: 14,
      classification: "runner_disk_floor",
    });
    expect(C2_DISK_FLOOR_RULE.diskGatePattern.test("DISK_GATE")).toBe(true);
  });

  it("classifies a DISK_GATE floor miss as runner_disk_floor, not product code", () => {
    const result = classifyDiskFloorFailure(
      "DISK_GATE: 13.90GB < 14GB floor - job refused (target=/Users/chaudoanm3/gitlab-runner-builds runner=mac-runner-2)",
    );

    expect(result).toMatchObject({
      matched: true,
      classification: "runner_disk_floor",
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

  it("classifies C2 disk-floor traces regardless of failed job name", () => {
    const examples = [
      {
        jobName: "module-boundaries",
        trace: "DISK_GATE 11.18GB < 14GB floor",
      },
      {
        jobName: "playwright-perf-budgets",
        trace: "DISK_GATE 11.34GB < 14GB floor",
      },
      {
        jobName: "any-code-or-browser-job",
        trace: "runner refused job: 11.18GB < 14GB floor",
      },
    ];

    for (const example of examples) {
      expect(classifyDiskFloorFailure(`${example.jobName}\n${example.trace}`)).toMatchObject({
        matched: true,
        classification: "runner_disk_floor",
        productCodeFailure: false,
        successStreakCanAdvance: false,
        floorGb: 14,
      });
    }
  });

  it("classifies a DISK_GATE trace even when the floor number is omitted", () => {
    expect(classifyDiskFloorFailure("DISK_GATE refused job before checkout")).toMatchObject({
      matched: true,
      classification: "runner_disk_floor",
      productCodeFailure: false,
      successStreakCanAdvance: false,
      freeGb: null,
      floorGb: 14,
    });
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
