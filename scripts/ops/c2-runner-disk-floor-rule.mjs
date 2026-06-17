#!/usr/bin/env node

export const C2_DISK_FLOOR_RULE = {
  machine: "C2",
  targetPath: "/Users/chaudoanm3/gitlab-runner-builds",
  floorGb: 14,
  tracePattern: /DISK_GATE:\s+([0-9]+(?:\.[0-9]+)?)GB\s+<\s+([0-9]+(?:\.[0-9]+)?)GB floor/i,
};

export function classifyDiskFloorFailure(trace, options = {}) {
  const rule = { ...C2_DISK_FLOOR_RULE, ...options };
  const text = String(trace || "");
  const match = text.match(rule.tracePattern);

  if (!match) {
    return {
      matched: false,
      classification: "unknown",
      productCodeFailure: null,
      successStreakCanAdvance: null,
      actions: [],
    };
  }

  const freeGb = Number(match[1]);
  const floorGb = Number(match[2]);

  return {
    matched: true,
    classification: "runner_infrastructure_disk_floor",
    productCodeFailure: false,
    successStreakCanAdvance: false,
    freeGb,
    floorGb,
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
