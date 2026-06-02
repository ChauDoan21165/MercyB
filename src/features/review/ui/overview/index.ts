// src/features/review/ui/overview/index.ts — Lane D / D6 public surface.
//
// The review overview slice: deck list + daily-limit settings. The leader wires
// OverviewContainer at the composition root (injecting real SessionDeps);
// OverviewView is the prop-driven presentational shell.

export { OverviewView } from "./OverviewView";
export type { OverviewViewProps, DeckSummary } from "./OverviewView";
export { OverviewContainer } from "./OverviewContainer";
export type { OverviewContainerProps } from "./OverviewContainer";
export { DeckCard } from "./DeckCard";
export type { DeckCardProps } from "./DeckCard";
export { DailyLimitControl } from "./DailyLimitControl";
export type { DailyLimitControlProps } from "./DailyLimitControl";
