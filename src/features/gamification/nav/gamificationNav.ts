// src/features/gamification/nav/gamificationNav.ts
//
// Nav descriptor for the module's entry point. Exposed as data (not JSX) so
// any nav surface — bottom bar, account menu, drawer — can render it the way
// it renders its own items. `available` folds in the feature flag, so callers
// just spread `gamificationNavItems()` into their item list and get nothing
// when the flag is OFF.

import { isGamificationEnabled } from "../flag";

export interface GamificationNavItem {
  /** Stable key for React lists / analytics. */
  key: string;
  /** Route path (matches the <Route> in AppRouter). */
  to: string;
  /** VI-first label. */
  label: string;
  /** Emoji/icon key the host nav can map to its own icon set. */
  icon: string;
}

export const GAMIFICATION_ROUTE = "/progress/play";

const ITEM: GamificationNavItem = {
  key: "gamification",
  to: GAMIFICATION_ROUTE,
  label: "Tiến độ",
  icon: "trophy",
};

/** Returns the nav item(s) to render, or [] when the flag is OFF. */
export function gamificationNavItems(): GamificationNavItem[] {
  return isGamificationEnabled() ? [ITEM] : [];
}
