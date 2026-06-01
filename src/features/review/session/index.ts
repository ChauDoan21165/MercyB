// src/features/review/session/index.ts — Lane D / D4 public surface.
//
// The session slice: pure queue/grading/summary logic composed against the
// Scheduler / ReviewStore / ContentAdapter interfaces. Consumed by the UI
// slices (D5/D6).

export type { SessionDeps } from "./deps";

export { buildQueue, dayKey } from "./queueBuilder";
export { gradeCard, startSession, emptyGrades } from "./gradingLoop";
export { summarize } from "./summary";
