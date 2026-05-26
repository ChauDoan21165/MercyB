/**
 * Path: src/lib/mercy-host/rituals.ts
 * File: rituals.ts
 */

import type { MercyAnimationType } from "./eventMap";
import type { VoiceTrigger } from "./voicePack";
import { memory } from "./memory";

export type RitualEventType =
  | "entry_complete"
  | "room_complete"
  | "streak_milestone"
  | "comeback_after_gap";

export type EmotionBias =
  | "neutral"
  | "returning_after_gap"
  | "steady_progress"
  | "gentle_progress";

export interface RitualSpec {
  id: string;
  eventType: RitualEventType;
  animation: MercyAnimationType | null;
  voiceTrigger: VoiceTrigger;
  textEn: string;
  textVi: string;
  tierRange: [number, number];
  minEntries?: number;
  maxEntries?: number;
  milestone?: number;
  badgeId?: string;
  minDaysAway?: number;
  crisisOnly?: boolean;
  emotionBias?: EmotionBias;
}

export interface RitualContext {
  tier: string;
  entriesCompleted?: number;
  streakDays?: number;
  previousStreak?: number;
  daysAway?: number;
  daysSinceLastVisit?: number;
  gapDays?: number;
  daysGap?: number;
  isCrisisRoom?: boolean;
  isCrisis?: boolean;
  crisis?: boolean;
  inCrisis?: boolean;
  roomCrisis?: boolean;
  roomId?: string;
  roomTitle?: string;
  roomDomain?: string;
  roomType?: string;
  area?: string;
  roomTags?: string[];
  tags?: string[];
}

type MemoryLike = {
  lastVisitDateISO?: string;
  visitStreak?: number;
};

export const RITUALS: RitualSpec[] = [
  {
    id: "entry_soft_nod",
    eventType: "entry_complete",
    animation: null,
    voiceTrigger: "gentle" as VoiceTrigger,
    textEn: "A small step still counts.",
    textVi: "Một bước nhỏ vẫn luôn có giá trị.",
    tierRange: [0, 9],
    minEntries: 1,
    maxEntries: 2,
    emotionBias: "gentle_progress",
  },
  {
    id: "entry_spark",
    eventType: "entry_complete",
    animation: "spark" as MercyAnimationType,
    voiceTrigger: "gentle" as VoiceTrigger,
    textEn: "Good. You are warming up.",
    textVi: "Tốt lắm. Bạn đang vào nhịp rồi.",
    tierRange: [0, 9],
    minEntries: 3,
    maxEntries: 5,
    emotionBias: "steady_progress",
  },
  {
    id: "entry_bridge",
    eventType: "entry_complete",
    animation: "shimmer" as MercyAnimationType,
    voiceTrigger: "gentle" as VoiceTrigger,
    textEn: "You crossed a real bridge today.",
    textVi: "Hôm nay bạn đã đi qua một cây cầu thật sự.",
    tierRange: [0, 9],
    minEntries: 6,
    emotionBias: "steady_progress",
  },

  {
    id: "room_complete_level0",
    eventType: "room_complete",
    animation: "glow" as MercyAnimationType,
    voiceTrigger: "gentle" as VoiceTrigger,
    textEn: "You finished the room. That matters.",
    textVi: "Bạn đã học xong room này. Điều đó rất có ý nghĩa.",
    tierRange: [0, 0],
    emotionBias: "gentle_progress",
  },
  {
    id: "room_complete_level1_3",
    eventType: "room_complete",
    animation: "glow" as MercyAnimationType,
    voiceTrigger: "gentle" as VoiceTrigger,
    textEn: "You are building real momentum now.",
    textVi: "Bạn đang tạo đà tiến thật sự rồi.",
    tierRange: [1, 3],
    emotionBias: "steady_progress",
  },
  {
    id: "room_complete_level4_6",
    eventType: "room_complete",
    animation: "shimmer" as MercyAnimationType,
    voiceTrigger: "gentle" as VoiceTrigger,
    textEn: "Your focus is getting sharper. Beautiful work.",
    textVi: "Sự tập trung của bạn đang sắc hơn. Làm rất đẹp.",
    tierRange: [4, 6],
    emotionBias: "steady_progress",
  },
  {
    id: "room_complete_level7_9",
    eventType: "room_complete",
    animation: "shimmer" as MercyAnimationType,
    voiceTrigger: "gentle" as VoiceTrigger,
    textEn: "This is deep work. You carried it well.",
    textVi: "Đây là công việc chiều sâu. Bạn đã mang nó rất vững.",
    tierRange: [7, 9],
    emotionBias: "steady_progress",
  },
  {
    id: "crisis_gentle",
    eventType: "room_complete",
    animation: "glow" as MercyAnimationType,
    voiceTrigger: "low_mood" as VoiceTrigger,
    textEn: "You stayed with yourself through something hard.",
    textVi: "Bạn đã ở lại với chính mình qua một đoạn khó khăn.",
    tierRange: [0, 9],
    crisisOnly: true,
    emotionBias: "neutral",
  },

  {
    id: "streak_3_days",
    eventType: "streak_milestone",
    animation: "spark" as MercyAnimationType,
    voiceTrigger: "gentle" as VoiceTrigger,
    textEn: "Three days. A rhythm is beginning.",
    textVi: "Ba ngày rồi. Một nhịp mới đang bắt đầu.",
    tierRange: [0, 9],
    milestone: 3,
    badgeId: "streak_3",
    emotionBias: "steady_progress",
  },
  {
    id: "streak_7_days",
    eventType: "streak_milestone",
    animation: "shimmer" as MercyAnimationType,
    voiceTrigger: "gentle" as VoiceTrigger,
    textEn: "Seven days. You are becoming steady.",
    textVi: "Bảy ngày rồi. Bạn đang trở nên vững vàng hơn.",
    tierRange: [0, 9],
    milestone: 7,
    badgeId: "streak_7",
    emotionBias: "steady_progress",
  },
  {
    id: "streak_30_days",
    eventType: "streak_milestone",
    animation: "shimmer" as MercyAnimationType,
    voiceTrigger: "gentle" as VoiceTrigger,
    textEn: "Thirty days. This is no longer luck. It is character.",
    textVi: "Ba mươi ngày rồi. Đây không còn là may mắn nữa. Đây là bản lĩnh.",
    tierRange: [0, 9],
    milestone: 30,
    badgeId: "streak_30",
    emotionBias: "steady_progress",
  },

  {
    id: "comeback_after_gap",
    eventType: "comeback_after_gap",
    animation: "glow" as MercyAnimationType,
    voiceTrigger: "gentle" as VoiceTrigger,
    textEn: "Welcome back. Starting again is a kind of strength.",
    textVi: "Chào mừng bạn quay lại. Bắt đầu lại cũng là một kiểu mạnh mẽ.",
    tierRange: [0, 9],
    minDaysAway: 7,
    emotionBias: "returning_after_gap",
  },
];

function normalizeTier(tier: string | null | undefined): string {
  const raw = String(tier ?? "").trim().toLowerCase();
  if (!raw) return "level0";

  const compact = raw.replace(/[\s_-]+/g, "");

  if (compact === "free") return "level0";
  if (compact === "level0") return "level0";

  const levelMatch = compact.match(/^level([1-9])$/);
  if (levelMatch) return `level${levelMatch[1]}`;

  const vipMatch = compact.match(/^vip([1-9])$/);
  if (vipMatch) return `level${vipMatch[1]}`;

  return "level0";
}

function tierToNumber(tier: string | null | undefined): number {
  const normalized = normalizeTier(tier);
  if (normalized === "level0") return 0;

  const match = normalized.match(/^level([1-9])$/);
  return match ? parseInt(match[1], 10) : 0;
}

function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function toISODate(value: Date | string | null | undefined): string {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);

  const s = String(value).trim();
  if (!s) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  const parsed = new Date(s);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return "";
}

function daysBetween(startISO: string, endISO: string): number {
  const start = new Date(`${startISO}T00:00:00Z`);
  const end = new Date(`${endISO}T00:00:00Z`);
  const diffMs = end.getTime() - start.getTime();
  return Math.floor(diffMs / 86400000);
}

function getDaysAway(context: RitualContext): number {
  const candidates = [
    context.daysAway,
    context.daysSinceLastVisit,
    context.gapDays,
    context.daysGap,
  ];

  for (const value of candidates) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }

  return 0;
}

function isCrisisContext(context: RitualContext): boolean {
  if (context.isCrisisRoom) return true;
  if (context.isCrisis) return true;
  if (context.crisis) return true;
  if (context.inCrisis) return true;
  if (context.roomCrisis) return true;

  const searchable = JSON.stringify(context).toLowerCase();

  return [
    "crisis",
    "emergency",
    "suicid",
    "self-harm",
    "self_harm",
    "self harm",
    "kill myself",
    "harm myself",
    "panic",
    "psychosis",
    "overdose",
    "abuse",
    "assault",
    "trauma",
    "low_mood",
    "low mood",
    "mental_health",
    "mental health",
  ].some((needle) => searchable.includes(needle));
}

export function computeVisitStreak(
  a: Date | string | null | undefined,
  b?: number | string | Date | null,
  c?: string | Date | null
): number {
  if (a instanceof Date) {
    const todayISO = toISODate(a);
    const lastVisitISO = toISODate(
      typeof b === "string" || b instanceof Date || b === null ? b : null
    );
    const previousStreak = 0;

    if (!lastVisitISO) return 1;

    const gap = daysBetween(lastVisitISO, todayISO);
    if (gap <= 0) return 1;
    if (gap === 1) return previousStreak + 1;
    return 1;
  }

  const lastVisitISO = toISODate(a);
  const previousStreak = typeof b === "number" ? b : 0;
  const todayISO =
    typeof b === "string" || b instanceof Date
      ? toISODate(b)
      : toISODate(c) || getTodayISO();

  if (!lastVisitISO) return 1;

  const gap = daysBetween(lastVisitISO, todayISO);

  if (gap <= 0) {
    return Math.max(previousStreak, 1);
  }

  if (gap === 1) {
    return Math.max(previousStreak, 0) + 1;
  }

  return 1;
}

export function checkStreakMilestone(
  currentStreak: number,
  previousStreak: number
): number | null {
  for (const milestone of [30, 7, 3]) {
    if (previousStreak < milestone && currentStreak >= milestone) {
      return milestone;
    }
  }
  return null;
}

export function updateStreak(): { streak: number; milestone: number | null } {
  const mem = memory.get() as unknown as MemoryLike;
  const todayISO = getTodayISO();
  const previousStreak = typeof mem.visitStreak === "number" ? mem.visitStreak : 0;
  const streak = computeVisitStreak(mem.lastVisitDateISO, previousStreak, todayISO);
  const milestone = checkStreakMilestone(streak, previousStreak);

  memory.update({
    ...(mem as object),
    lastVisitDateISO: todayISO,
    visitStreak: streak,
  } as never);

  return { streak, milestone };
}

export function getRitualText(
  ritual: RitualSpec,
  language: "en" | "vi"
): string {
  return language === "vi" ? ritual.textVi : ritual.textEn;
}

export function getRitualForEvent(
  eventType: RitualEventType,
  context: RitualContext
): RitualSpec | null {
  const tierNum = tierToNumber(context.tier);

  if (eventType === "entry_complete") {
    const count = context.entriesCompleted ?? 0;

    return (
      RITUALS.find((ritual) => {
        if (ritual.eventType !== "entry_complete") return false;
        if (tierNum < ritual.tierRange[0] || tierNum > ritual.tierRange[1]) {
          return false;
        }
        if (typeof ritual.minEntries === "number" && count < ritual.minEntries) {
          return false;
        }
        if (typeof ritual.maxEntries === "number" && count > ritual.maxEntries) {
          return false;
        }
        return true;
      }) ?? null
    );
  }

  if (eventType === "room_complete") {
    if (isCrisisContext(context)) {
      return (
        RITUALS.find(
          (ritual) =>
            ritual.eventType === "room_complete" && ritual.crisisOnly === true
        ) ?? null
      );
    }

    return (
      RITUALS.find((ritual) => {
        if (ritual.eventType !== "room_complete") return false;
        if (ritual.crisisOnly) return false;
        return tierNum >= ritual.tierRange[0] && tierNum <= ritual.tierRange[1];
      }) ?? null
    );
  }

  if (eventType === "streak_milestone") {
    const current = context.streakDays ?? 0;
    const previous = context.previousStreak ?? 0;
    const milestone = checkStreakMilestone(current, previous);

    if (!milestone) return null;

    return (
      RITUALS.find(
        (ritual) =>
          ritual.eventType === "streak_milestone" &&
          ritual.milestone === milestone &&
          tierNum >= ritual.tierRange[0] &&
          tierNum <= ritual.tierRange[1]
      ) ?? null
    );
  }

  if (eventType === "comeback_after_gap") {
    const daysAway = getDaysAway(context);

    return (
      RITUALS.find(
        (ritual) =>
          ritual.eventType === "comeback_after_gap" &&
          typeof ritual.minDaysAway === "number" &&
          daysAway >= ritual.minDaysAway &&
          tierNum >= ritual.tierRange[0] &&
          tierNum <= ritual.tierRange[1]
      ) ?? null
    );
  }

  return null;
}