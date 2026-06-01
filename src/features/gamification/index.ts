// src/features/gamification/index.ts
//
// Public surface of the gamification module. The rest of the app imports ONLY
// from here ("@/features/gamification"), never from deep paths. STEP-0 exports
// the contract, flag, defaults, store factory and nav descriptor; the engines
// (F1–F4), full store (F5) and UI (F6) are wired in during final integration.

// ── Contract ──
export * from "./types";

// ── Flag ──
export { isGamificationEnabled } from "./flag";

// ── Defaults / date helpers ──
export {
  createDefaultState,
  toIsoDate,
  fromIsoDate,
  daysBetween,
  DEFAULT_DAILY_GOAL,
  DEFAULT_STREAK_CONFIG,
} from "./defaults";

// ── Store ──
export { createGamificationStore } from "./store/createGamificationStore";
export { InMemoryGamificationStore } from "./store/InMemoryGamificationStore";

export { IndexedDbGamificationStore } from "./store/IndexedDbGamificationStore"; // F5

// ── Engines (pure reducers) ──
export { streakEngine } from "./engines/streakEngine"; // F1
export { xpEngine } from "./engines/xpEngine"; // F2
export { dailyGoalEngine } from "./engines/dailyGoalEngine"; // F3
export { achievementEngine, ACHIEVEMENTS } from "./engines/achievementEngine"; // F4

// ── React layer ──
export { useGamification } from "./hooks/useGamification"; // F6
export { default as StreakWidget } from "./components/StreakWidget";
export { default as XpWidget } from "./components/XpWidget";
export { default as DailyGoalWidget } from "./components/DailyGoalWidget";
export { default as AchievementsScreen } from "./components/AchievementsScreen";
export { default as GamificationPage } from "./routes/GamificationPage";

// ── Nav ──
export {
  gamificationNavItems,
  GAMIFICATION_ROUTE,
  type GamificationNavItem,
} from "./nav/gamificationNav";
