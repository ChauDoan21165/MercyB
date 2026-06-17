import { describe, expect, it } from "vitest";
import {
  CLEAN_LOOPS_PER_PROMOTION,
  FACTORY_LEVELS,
  FAILURE_CLASSIFICATION,
  SERIOUS_FAILURES,
  capacityForLevel,
  evaluateSuccessStreakPromotion,
  isSeriousFailure,
} from "../../scripts/ops/factory-success-streak-promotion.mjs";

describe("factory success-streak promotion", () => {
  it("keeps Level 1 constrained to one worker, one open MR, and one running pipeline", () => {
    expect(FACTORY_LEVELS[1]).toMatchObject({
      maxWorkers: 1,
      maxOpenMrs: 1,
      maxRunningPipelines: 1,
      roles: ["Admin"],
    });
  });

  it("promotes from Level 1 to Level 2 only after 10 clean loops", () => {
    expect(evaluateSuccessStreakPromotion({ level: 1, cleanLoopsAtLevel: 8, event: "clean_loop" })).toMatchObject({
      level: 1,
      cleanLoopsAtLevel: 9,
      promoted: false,
      capacity: FACTORY_LEVELS[1],
    });

    expect(evaluateSuccessStreakPromotion({ level: 1, cleanLoopsAtLevel: 9, event: "clean_loop" })).toMatchObject({
      level: 2,
      cleanLoopsAtLevel: 0,
      promoted: true,
      capacity: {
        maxWorkers: 2,
        maxOpenMrs: 1,
        maxRunningPipelines: 1,
      },
    });
  });

  it("promotes from Level 2 to Admin plus C2 plus C4 only after 10 more clean Level-2 loops", () => {
    const result = evaluateSuccessStreakPromotion({ level: 2, cleanLoopsAtLevel: 9, event: "clean_loop" });

    expect(result).toMatchObject({
      level: 3,
      cleanLoopsAtLevel: 0,
      promoted: true,
      capacity: {
        maxWorkers: 3,
        maxOpenMrs: 1,
        maxRunningPipelines: 1,
        roles: ["Admin", "C2", "C4"],
      },
    });
  });

  it("does not exceed Level 3 after additional clean loops", () => {
    expect(evaluateSuccessStreakPromotion({ level: 3, cleanLoopsAtLevel: 12, event: "clean_loop" })).toMatchObject({
      level: 3,
      promoted: false,
      capacity: FACTORY_LEVELS[3],
    });
  });

  it("treats every named serious failure as streak-resetting", () => {
    expect([...SERIOUS_FAILURES]).toEqual([
      "runner_system_failure",
      "runner_disk_floor",
      "feeder_leak",
      "duplicate_pipeline",
      "duplicate_mr",
      "scope_violation",
      "failed_job_twice",
    ]);

    for (const failure of SERIOUS_FAILURES) {
      expect(isSeriousFailure(failure)).toBe(true);
      expect(evaluateSuccessStreakPromotion({ level: 2, cleanLoopsAtLevel: 7, event: failure })).toMatchObject({
        level: 1,
        cleanLoopsAtLevel: 0,
        promoted: false,
        downgraded: true,
        seriousFailure: failure,
        capacity: capacityForLevel(1),
      });
    }
  });

  it("resets but cannot downgrade below Level 1", () => {
    expect(evaluateSuccessStreakPromotion({ level: 1, cleanLoopsAtLevel: 7, event: "duplicate_mr" })).toMatchObject({
      level: 1,
      cleanLoopsAtLevel: 0,
      downgraded: false,
    });
  });

  it("documents runner_disk_floor as infrastructure, not a product-code failure", () => {
    expect(FAILURE_CLASSIFICATION.runner_disk_floor).toMatchObject({
      serious: true,
      productCodeFailure: false,
      successStreakCanAdvance: false,
    });

    expect(evaluateSuccessStreakPromotion({ level: 2, cleanLoopsAtLevel: 9, event: "runner_disk_floor" })).toMatchObject({
      level: 1,
      cleanLoopsAtLevel: 0,
      productCodeFailure: false,
      seriousFailure: "runner_disk_floor",
    });
  });

  it("uses a 10-loop promotion threshold", () => {
    expect(CLEAN_LOOPS_PER_PROMOTION).toBe(10);
  });
});
