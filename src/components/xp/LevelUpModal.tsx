// src/components/xp/LevelUpModal.tsx
//
// Full-screen modal that pops when an awardXPEvent published a level
// change. Shown once per (user, level) — localStorage anchor prevents
// re-show on page refresh.
//
// Tone: warm, celebratory, no shame, no comparison to other users.

import { useEffect, useState } from "react";

import {
  XP_AWARDED_EVENT,
  type XPAwardedDetail,
} from "@/lib/xp/awardXPEventBus";

const SEEN_LS_PREFIX = "mb:xp:level-up-seen:";

function seenKey(level: number): string {
  return `${SEEN_LS_PREFIX}${level}`;
}

function hasSeen(level: number): boolean {
  try {
    return localStorage.getItem(seenKey(level)) === "1";
  } catch {
    return false;
  }
}

function markSeen(level: number): void {
  try {
    localStorage.setItem(seenKey(level), "1");
  } catch {
    // ignore storage failure
  }
}

interface ActiveCelebration {
  newLevel: number;
  prevLevel: number;
}

export function LevelUpModal() {
  const [active, setActive] = useState<ActiveCelebration | null>(null);

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent<XPAwardedDetail>).detail;
      if (!detail || !detail.level_changed) return;
      if (detail.current_level <= detail.previous_level) return;
      if (hasSeen(detail.current_level)) return;
      setActive({
        newLevel: detail.current_level,
        prevLevel: detail.previous_level,
      });
    }
    window.addEventListener(XP_AWARDED_EVENT, handler as EventListener);
    return () => {
      window.removeEventListener(XP_AWARDED_EVENT, handler as EventListener);
    };
  }, []);

  if (!active) return null;

  const dismiss = () => {
    markSeen(active.newLevel);
    setActive(null);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="level-up-title"
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div aria-hidden className="text-5xl">🎉</div>
        <h2
          id="level-up-title"
          className="mt-3 text-2xl font-bold text-emerald-700"
        >
          Bạn đã lên Level {active.newLevel}!
        </h2>
        <p className="mt-1 text-sm italic text-black/55">
          You reached Level {active.newLevel}
        </p>
        <p className="mt-4 text-sm text-black/80">
          Tuyệt vời. Tiếp tục giữ nhịp luyện và Mercy sẽ đi cùng bạn.
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="mt-6 inline-flex w-full justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700"
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
}
