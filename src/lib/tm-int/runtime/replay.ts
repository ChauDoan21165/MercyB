import type { ObservationPacket } from "../obs/types";
import { buildTeacherContext } from "./contextBuilder";
import type { TeacherContext } from "./types";

export type TeacherContextReplayResult = {
  pass: boolean;
  deterministic: boolean;
  failures: string[];
  first: TeacherContext;
  second: TeacherContext;
};

function stableJson(value: unknown): string {
  return JSON.stringify(value);
}

export function replayTeacherContext(observationPacket: ObservationPacket): TeacherContextReplayResult {
  const first = buildTeacherContext(observationPacket);
  const second = buildTeacherContext(observationPacket);
  const deterministic = stableJson(first) === stableJson(second);
  const failures: string[] = [];

  if (!deterministic) failures.push("TeacherContext replay changed between runs.");
  if (first.recommendations.some((recommendation) => recommendation.evidenceCount === 0)) {
    failures.push("Recommendation emitted without evidence.");
  }
  if (/weak listening|weak speaking|poor learner|bad learner|low ability|lazy|careless|\"verified\":true/i.test(stableJson(first))) {
    failures.push("TeacherContext contains unsafe learner inference or verification claim.");
  }

  return {
    pass: deterministic && failures.length === 0,
    deterministic,
    failures,
    first,
    second,
  };
}
