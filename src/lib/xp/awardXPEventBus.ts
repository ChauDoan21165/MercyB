// src/lib/xp/awardXPEventBus.ts
//
// Tiny in-process pub/sub for XP award events. Components subscribe
// (XPBadge for the +N toast, level-up modal listener for celebrations)
// and the awardXPEvent client publishes after each successful award.
//
// Why a window CustomEvent rather than a React context: components
// that need this signal live in different parts of the tree (Home
// header badge, page-level modal) and a context would require
// wrapping the whole app. The event bus is one line per subscriber
// and zero ceremony.

export const XP_AWARDED_EVENT = "mb:xp:awarded";

export interface XPAwardedDetail {
  awarded: number;
  total_xp: number;
  current_level: number;
  previous_level: number;
  level_changed: boolean;
}

export function publishXPAwarded(detail: XPAwardedDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<XPAwardedDetail>(XP_AWARDED_EVENT, { detail }),
  );
}
