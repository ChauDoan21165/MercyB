/**
 * AI Tutor <-> Placement V5 read-only context bridge.
 *
 * This module is intentionally narrow:
 * - reads only caller-supplied V5 summary shapes;
 * - never imports V5 runtime helpers;
 * - never writes to V5 or tutor state;
 * - never exposes raw answers, numeric scores, provider payloads, or user IDs.
 */

import type {
  V5AdminCurriculumPlanSummary,
  V5AdminLearnerMemorySummary,
  V5AdminTelemetryDaily,
} from "@/lib/placement/v5/persistenceTypes";

export type PlacementV5TutorContextInput = {
  learnerMemory?: Pick<V5AdminLearnerMemorySummary, "event_count" | "updated_at" | "schema_version"> | null;
  telemetry?: ReadonlyArray<Pick<V5AdminTelemetryDaily, "event_type" | "event_count">> | null;
  curriculumPlan?: Pick<V5AdminCurriculumPlanSummary, "plan_length_days" | "generated_at" | "superseded_at"> | null;
};

export type PlacementV5TutorContextResult = {
  context: string;
  included: boolean;
};

const SAFE_EVENT_TYPE = /^[a-z0-9_.:-]{1,48}$/i;

function safePositiveInteger(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value >= 0
    ? value
    : null;
}

function safeIsoDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (!/^\d{4}-\d{2}-\d{2}/.test(value)) return null;
  return value.slice(0, 10);
}

function safeEventType(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return SAFE_EVENT_TYPE.test(value) ? value : null;
}

export function buildPlacementV5TutorContext(
  input: PlacementV5TutorContextInput | null | undefined,
): PlacementV5TutorContextResult {
  if (!input) return { context: "", included: false };

  const lines: string[] = [];

  const eventCount = safePositiveInteger(input.learnerMemory?.event_count);
  if (eventCount !== null) {
    lines.push(`Placement V5 read-only activity count: ${eventCount}.`);
  }

  const updatedAt = safeIsoDate(input.learnerMemory?.updated_at);
  if (updatedAt) {
    lines.push(`Placement V5 last updated date: ${updatedAt}.`);
  }

  const planDays = safePositiveInteger(input.curriculumPlan?.plan_length_days);
  if (planDays !== null) {
    lines.push(`Placement V5 current plan length: ${planDays} days.`);
  }

  const generatedAt = safeIsoDate(input.curriculumPlan?.generated_at);
  if (generatedAt) {
    lines.push(`Placement V5 plan generated date: ${generatedAt}.`);
  }

  const activePlan = input.curriculumPlan && input.curriculumPlan.superseded_at === null;
  if (input.curriculumPlan) {
    lines.push(`Placement V5 plan state: ${activePlan ? "active" : "superseded"}.`);
  }

  const topEvents = (input.telemetry ?? [])
    .map((row) => ({
      type: safeEventType(row.event_type),
      count: safePositiveInteger(row.event_count),
    }))
    .filter((row): row is { type: string; count: number } => Boolean(row.type) && row.count !== null)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((row) => row.type);

  if (topEvents.length > 0) {
    lines.push(`Placement V5 top activity signals: ${topEvents.join(", ")}.`);
  }

  if (lines.length === 0) return { context: "", included: false };

  return {
    context: [
      "Placement V5 context is read-only and sanitized.",
      ...lines,
      "Do not mention raw answers, numeric scores, or internal V5 telemetry to the learner.",
    ].join("\n"),
    included: true,
  };
}
