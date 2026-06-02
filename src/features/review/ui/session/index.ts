// src/features/review/ui/session/index.ts — Lane D / D5 public surface.
//
// The session UI slice. SessionView is the pure presentational orchestrator;
// SessionContainer is the stateful wrapper the lane leader mounts on the
// /review/:flow route (deps injected by the composition root).

export { SessionView } from "./SessionView";
export type { SessionViewProps } from "./SessionView";

export { SessionContainer } from "./SessionContainer";
export type { SessionContainerProps } from "./SessionContainer";
