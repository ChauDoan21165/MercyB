import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { buildFailureTimeline } from "../../src/lib/placementForensics/buildFailureTimeline.js";
import type { PlacementForensicEvent } from "../../src/types/placementForensics.js";

type RawRun = {
  scenario?: string;
  runLabel?: string;
  events?: PlacementForensicEvent[];
};

function argValue(name: string, fallback = ""): string {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] || fallback : fallback;
}

async function main() {
  const input = argValue("input");
  const output = argValue("output");
  if (!input) {
    throw new Error("Usage: tsx scripts/placement-v3/replay-failure-timeline.ts --input <raw-run.json> [--output <timeline.json>]");
  }

  const raw = JSON.parse(await fs.readFile(input, "utf8")) as RawRun;
  const events = raw.events ?? [];
  const timeline = buildFailureTimeline(events);
  const result = {
    replayedAt: new Date().toISOString(),
    input,
    scenario: raw.scenario ?? "unknown",
    runLabel: raw.runLabel ?? "unknown",
    reconstruction: timeline,
    diagnostics: {
      missingEvents: timeline.missingSequences.length,
      inconsistentRetries: timeline.inconsistentRetries,
      orchestrationDeadEnds: timeline.orchestrationDeadEnds,
      providerSwitches: timeline.providerSwitches.length,
      fallbacks: timeline.fallbacks.length,
    },
  };

  const serialized = JSON.stringify(result, null, 2);
  if (output) {
    await fs.mkdir(path.dirname(output), { recursive: true });
    await fs.writeFile(output, serialized);
  }
  console.log(serialized);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
