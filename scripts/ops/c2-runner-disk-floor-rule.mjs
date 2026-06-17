#!/usr/bin/env node

export const C2_DISK_FLOOR_RULE = {
  machine: "C2",
  targetPath: "/Users/chaudoanm3/gitlab-runner-builds",
  floorGb: 14,
  diskGatePattern: /DISK_GATE/i,
  floorPattern: /([0-9]+(?:\.[0-9]+)?)GB\s+<\s+(14(?:\.0+)?)GB floor/i,
  classification: "runner_disk_floor",
};

export function classifyDiskFloorFailure(trace, options = {}) {
  const rule = { ...C2_DISK_FLOOR_RULE, ...options };
  const text = String(trace || "");
  const floorMatch = text.match(rule.floorPattern);
  const matched = rule.diskGatePattern.test(text) || Boolean(floorMatch);

  if (!matched) {
    return {
      matched: false,
      classification: "unknown",
      productCodeFailure: null,
      successStreakCanAdvance: null,
      actions: [],
    };
  }

  return {
    matched: true,
    classification: rule.classification,
    productCodeFailure: false,
    successStreakCanAdvance: false,
    freeGb: floorMatch ? Number(floorMatch[1]) : null,
    floorGb: floorMatch ? Number(floorMatch[2]) : rule.floorGb,
    machine: rule.machine,
    targetPath: rule.targetPath,
    actions: [
      "quarantine_or_clean_runner_before_retry",
      "retry_main_pipeline_after_runner_disk_recovers",
      "advance_success_streak_only_after_clean_retry",
    ],
  };
}

function main() {
  const trace = process.argv.slice(2).join(" ") || "";
  const result = classifyDiskFloorFailure(trace);
  console.log(JSON.stringify(result, null, 2));
  return result.matched ? 0 : 1;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exitCode = main();
}
