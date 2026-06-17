#!/usr/bin/env node

export const FACTORY_LEVELS = {
  1: {
    level: 1,
    maxWorkers: 1,
    maxOpenMrs: 1,
    maxRunningPipelines: 1,
    roles: ["Admin"],
  },
  2: {
    level: 2,
    maxWorkers: 2,
    maxOpenMrs: 1,
    maxRunningPipelines: 1,
    roles: ["Admin", "C2"],
  },
  3: {
    level: 3,
    maxWorkers: 3,
    maxOpenMrs: 1,
    maxRunningPipelines: 1,
    roles: ["Admin", "C2", "C4"],
  },
};

export const CLEAN_LOOPS_PER_PROMOTION = 10;

export const SERIOUS_FAILURES = new Set([
  "runner_system_failure",
  "runner_disk_floor",
  "feeder_leak",
  "duplicate_pipeline",
  "duplicate_mr",
  "scope_violation",
  "failed_job_twice",
]);

export const FAILURE_CLASSIFICATION = {
  runner_disk_floor: {
    serious: true,
    productCodeFailure: false,
    successStreakCanAdvance: false,
    action: "reset_streak_and_downgrade_capacity_until_clean_retry",
  },
};

function normalizeLevel(level) {
  const parsed = Number(level);
  if (parsed <= 1) return 1;
  if (parsed >= 3) return 3;
  return 2;
}

function normalizeCleanLoops(cleanLoopsAtLevel) {
  const parsed = Number(cleanLoopsAtLevel);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.floor(parsed);
}

export function capacityForLevel(level) {
  return FACTORY_LEVELS[normalizeLevel(level)];
}

export function isSeriousFailure(event) {
  return SERIOUS_FAILURES.has(String(event || ""));
}

export function evaluateSuccessStreakPromotion({ level = 1, cleanLoopsAtLevel = 0, event = "status" } = {}) {
  const currentLevel = normalizeLevel(level);
  const currentCleanLoops = normalizeCleanLoops(cleanLoopsAtLevel);
  const normalizedEvent = String(event || "status");

  if (isSeriousFailure(normalizedEvent)) {
    const nextLevel = Math.max(1, currentLevel - 1);
    return {
      level: nextLevel,
      cleanLoopsAtLevel: 0,
      promoted: false,
      downgraded: nextLevel < currentLevel,
      seriousFailure: normalizedEvent,
      capacity: capacityForLevel(nextLevel),
      productCodeFailure: FAILURE_CLASSIFICATION[normalizedEvent]?.productCodeFailure ?? null,
      reason: "serious failure resets clean-loop streak and downgrades capacity when above Level 1",
    };
  }

  if (normalizedEvent !== "clean_loop") {
    return {
      level: currentLevel,
      cleanLoopsAtLevel: currentCleanLoops,
      promoted: false,
      downgraded: false,
      seriousFailure: null,
      capacity: capacityForLevel(currentLevel),
      productCodeFailure: null,
      reason: "no clean loop recorded",
    };
  }

  const nextCleanLoops = currentCleanLoops + 1;
  if (currentLevel < 3 && nextCleanLoops >= CLEAN_LOOPS_PER_PROMOTION) {
    const nextLevel = currentLevel + 1;
    return {
      level: nextLevel,
      cleanLoopsAtLevel: 0,
      promoted: true,
      downgraded: false,
      seriousFailure: null,
      capacity: capacityForLevel(nextLevel),
      productCodeFailure: null,
      reason: `promoted after ${CLEAN_LOOPS_PER_PROMOTION} clean loops at Level ${currentLevel}`,
    };
  }

  return {
    level: currentLevel,
    cleanLoopsAtLevel: nextCleanLoops,
    promoted: false,
    downgraded: false,
    seriousFailure: null,
    capacity: capacityForLevel(currentLevel),
    productCodeFailure: null,
    reason: "clean loop recorded; promotion threshold not reached",
  };
}

function argValue(args, name) {
  const exact = `--${name}`;
  const prefix = `${exact}=`;
  const index = args.indexOf(exact);
  if (index >= 0) return args[index + 1] ?? "";
  const match = args.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : "";
}

function main() {
  const args = process.argv.slice(2);
  const result = evaluateSuccessStreakPromotion({
    level: argValue(args, "level") || process.env.FACTORY_LEVEL || 1,
    cleanLoopsAtLevel: argValue(args, "clean-loops") || process.env.FACTORY_CLEAN_LOOPS_AT_LEVEL || 0,
    event: argValue(args, "event") || process.env.FACTORY_STREAK_EVENT || "status",
  });

  console.log(JSON.stringify(result, null, 2));
  return 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exitCode = main();
}
