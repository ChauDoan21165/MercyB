import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { buildFailureTimeline } from "../../src/lib/placementForensics/buildFailureTimeline.js";
import type {
  PlacementForensicEvent,
  PlacementForensicFeatureFlagSnapshot,
} from "../../src/types/placementForensics.js";

const RAW_DIR = "docs/placement-v3/observability/raw-runs";

const SCENARIOS = [
  "provider-timeout",
  "malformed-json-grader-output",
  "provider-fallback",
  "retry-exhaustion",
  "recommendation-engine-failure",
  "taxonomy-parse-failure",
  "persistence-write-failure",
  "feature-flag-mismatch",
  "interrupted-session-recovery",
  "partial-orchestration-corruption",
] as const;

type Scenario = (typeof SCENARIOS)[number];
type RunMode = "before" | "after";

function argValue(name: string, fallback = ""): string {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] || fallback : fallback;
}

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function featureFlags(mode: RunMode, scenario: Scenario): PlacementForensicFeatureFlagSnapshot {
  return {
    source: "simulation",
    flags: {
      placement_v3_enabled: true,
      placement_v3_forensics: mode === "after",
      scenario,
    },
  };
}

function event(
  scenario: Scenario,
  mode: RunMode,
  sequence: number,
  partial: Partial<PlacementForensicEvent> & {
    type: PlacementForensicEvent["type"];
    step: string;
    message: string;
  },
): PlacementForensicEvent {
  const base = {
    id: `${scenario}-${mode}-${sequence}`,
    sessionId: `session-${scenario}`,
    correlationId: `corr-${scenario}-${mode}`,
    occurredAt: new Date(Date.UTC(2026, 4, 20, 18, 0, sequence)).toISOString(),
    sequence,
    severity: partial.severity ?? "info",
    featureFlags: featureFlags(mode, scenario),
    ...partial,
  };
  return base as PlacementForensicEvent;
}

function eventsForScenario(scenario: Scenario, mode: RunMode): PlacementForensicEvent[] {
  const improved = mode === "after";
  const events: PlacementForensicEvent[] = [
    event(scenario, mode, 1, {
      type: "session_event",
      step: "session.start",
      message: "Placement session started.",
      sessionState: "in_progress",
    }),
    event(scenario, mode, 2, {
      type: "feature_flag_snapshot",
      step: "flags.snapshot",
      message: "Feature flags captured.",
      featureFlags: featureFlags(mode, scenario),
    }),
    event(scenario, mode, 3, {
      type: "orchestration_transition",
      step: "orchestrator.next",
      message: "Moved from start to grading.",
      fromState: "started",
      toState: "grading",
      action: "respond",
    }),
  ];

  switch (scenario) {
    case "provider-timeout":
      events.push(
        event(scenario, mode, 4, {
          type: "provider_event",
          step: "grader.provider",
          message: "OpenAI timed out.",
          provider: "openai",
          model: "gpt-4o-mini",
          attempt: 1,
          status: "timeout",
          latencyMs: 20_000,
          severity: "warn",
        }),
        event(scenario, mode, 5, {
          type: "latency_event",
          step: "grader.provider",
          message: "Provider exceeded latency budget.",
          latencyMs: 20_000,
          budgetMs: 15_000,
          exceededBudget: true,
          severity: "warn",
        }),
      );
      if (improved) {
        events.push(event(scenario, mode, 6, {
          type: "recoverability_state",
          step: "grader.recoverability",
          message: "Timeout can recover by fallback provider.",
          state: "recoverable",
          reason: "provider timeout",
        }));
      }
      break;
    case "malformed-json-grader-output":
      events.push(event(scenario, mode, 4, {
        type: "provider_event",
        step: "grader.parse",
        message: "Provider returned malformed JSON.",
        provider: "openai",
        model: "gpt-4o-mini",
        attempt: 1,
        status: "parse_error",
        severity: "error",
        failureSnapshot: {
          errorCode: "invalid_ai_response",
          errorMessage: "JSON parse failed",
          deterministic: true,
          recoverable: improved ? "degraded_safe" : "unknown",
          safeUserOutcome: improved ? "degraded" : "unknown",
        },
      }));
      if (improved) {
        events.push(event(scenario, mode, 5, {
          type: "degraded_result",
          step: "grader.fallback",
          message: "Heuristic low-confidence grade returned.",
          marker: "heuristic_grade",
          userVisible: true,
          severity: "warn",
        }));
      }
      break;
    case "provider-fallback":
      events.push(
        event(scenario, mode, 4, {
          type: "provider_event",
          step: "provider.openai",
          message: "OpenAI upstream failed.",
          provider: "openai",
          attempt: 1,
          status: "error",
          severity: "warn",
        }),
        event(scenario, mode, 5, {
          type: "fallback_event",
          step: "provider.failover",
          message: "Failing over from OpenAI to Gemini.",
          from: "openai",
          to: "gemini",
          reason: "upstream_error",
        }),
        event(scenario, mode, 6, {
          type: "provider_event",
          step: "provider.gemini",
          message: "Gemini returned grade.",
          provider: "gemini",
          attempt: 2,
          status: "success",
          latencyMs: 1200,
        }),
      );
      break;
    case "retry-exhaustion":
      events.push(
        event(scenario, mode, 4, {
          type: "retry_event",
          step: "persistence.retry",
          message: "Retrying persistence write.",
          attempt: 1,
          maxAttempts: 2,
          reason: "transient_db_error",
          nextDelayMs: 250,
          severity: "warn",
        }),
        event(scenario, mode, 5, {
          type: "retry_event",
          step: "persistence.retry",
          message: "Retry exhausted.",
          attempt: improved ? 2 : 3,
          maxAttempts: 2,
          reason: "transient_db_error",
          severity: "error",
        }),
      );
      break;
    case "recommendation-engine-failure":
      events.push(event(scenario, mode, 4, {
        type: "recommendation_event",
        step: "recommendations",
        message: "Recommendation engine failed.",
        status: improved ? "fallback" : "failed",
        recommendationCount: improved ? 2 : 0,
        reason: "lesson lookup error",
        severity: improved ? "warn" : "error",
      }));
      break;
    case "taxonomy-parse-failure":
      events.push(event(scenario, mode, 4, {
        type: "taxonomy_trigger",
        step: "l1.taxonomy",
        message: "Vietnamese L1 taxonomy parse failed.",
        taxonomy: "vn-l1-interference",
        triggerId: "article-omission",
        status: "parse_failed",
        severity: "error",
      }));
      break;
    case "persistence-write-failure":
      events.push(event(scenario, mode, 4, {
        type: "recoverability_state",
        step: "persistence.write",
        message: "Response write failed.",
        state: improved ? "unrecoverable" : "unknown",
        reason: "write failed before advancing session",
        severity: "fatal",
        failureSnapshot: {
          errorCode: "persistence_write_failed",
          errorMessage: "insert returned error",
          deterministic: "unknown",
          recoverable: "unrecoverable",
          safeUserOutcome: "blocked",
        },
      }));
      break;
    case "feature-flag-mismatch":
      events.push(event(scenario, mode, 4, {
        type: "feature_flag_snapshot",
        step: "flags.validate",
        message: "Client and server placement flags mismatch.",
        severity: "warn",
        featureFlags: {
          source: "simulation",
          flags: {
            client_placement_v3: true,
            server_placement_v3: false,
            placement_v3_forensics: improved,
          },
        },
      }));
      break;
    case "interrupted-session-recovery":
      events.push(
        event(scenario, mode, 4, {
          type: "session_event",
          step: "session.resume",
          message: "Resume requested after interruption.",
          sessionState: "in_progress",
          severity: "warn",
        }),
        event(scenario, mode, 5, {
          type: "recoverability_state",
          step: "session.recovery",
          message: improved ? "Last prompt restored." : "Recovery state unclear.",
          state: improved ? "recovered" : "unknown",
          reason: "metadata.lastPrompt present",
        }),
      );
      break;
    case "partial-orchestration-corruption":
      events.push(event(scenario, mode, 4, {
        type: "orchestration_transition",
        step: "orchestrator.corruption",
        message: "Current modality and task index diverged.",
        fromState: "grading",
        toState: improved ? "failed" : "grading",
        action: "detect_corruption",
        severity: "error",
      }));
      break;
  }

  if (improved && !["persistence-write-failure", "partial-orchestration-corruption"].includes(scenario)) {
    const nextSequence = Math.max(...events.map((item) => item.sequence)) + 1;
    events.push(event(scenario, mode, nextSequence, {
      type: "orchestration_transition",
      step: "session.safe-result",
      message: "Session ended with safe degraded or normal result.",
      fromState: "grading",
      toState: "completed",
      action: "complete",
    }));
  }

  return events;
}

async function runScenario(scenario: Scenario, mode: RunMode, runId: string) {
  const events = eventsForScenario(scenario, mode);
  const reconstruction = buildFailureTimeline(events);
  const raw = {
    isoTimestamp: new Date().toISOString(),
    command: `tsx scripts/placement-v3/run-failure-injection.ts ${process.argv.slice(2).join(" ")}`,
    scenario,
    runLabel: mode,
    runId,
    providerValidation: "simulated-local; Placement V3 Edge Functions absent on origin/main",
    events,
    reconstruction,
  };
  const base = `${runId}-${scenario}-${mode}`;
  const rawPath = path.join(RAW_DIR, `${base}.json`);
  const reconstructionPath = path.join(RAW_DIR, `${base}-reconstruction.json`);
  await fs.mkdir(RAW_DIR, { recursive: true });
  await fs.writeFile(rawPath, JSON.stringify(raw, null, 2));
  await fs.writeFile(reconstructionPath, JSON.stringify({
    isoTimestamp: new Date().toISOString(),
    scenario,
    runLabel: mode,
    reconstruction,
  }, null, 2));
  return { rawPath, reconstructionPath, reconstruction };
}

async function main() {
  const scenarioArg = argValue("scenario", "all");
  const modeArg = argValue("mode", "both");
  const runId = argValue("run-id", new Date().toISOString().replace(/[:.]/g, ""));
  const scenarios = scenarioArg === "all"
    ? [...SCENARIOS]
    : [scenarioArg as Scenario];
  const modes: RunMode[] = modeArg === "both" ? ["before", "after"] : [modeArg as RunMode];
  const outputs = [];

  for (const scenario of scenarios) {
    if (!SCENARIOS.includes(scenario)) {
      throw new Error(`Unknown scenario: ${scenario}`);
    }
    for (const mode of modes) {
      outputs.push(await runScenario(scenario, mode, runId));
    }
  }
  console.log(JSON.stringify({ runId, count: outputs.length, outputs }, null, 2));
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
