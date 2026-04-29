const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1400] as const;

export function calculateXP(summary: {
  turnCount: number;
  successCriteriaMet: number;
  totalCriteria: number;
  vocabUsed: number;
  targetVocab: number;
}): number {
  let xp = 20;
  if (summary.successCriteriaMet >= 2) xp += 10;
  if (summary.vocabUsed >= 2) xp += 10;
  if (summary.turnCount >= 6) xp += 10;
  if (xp < 0) xp = 0;
  if (xp > 50) xp = 50;
  return xp;
}

export function getLevel(totalXP: number): {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  progress: number;
} {
  const xp = Math.max(0, Math.floor(totalXP));
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }
  const currentLevelStart = LEVEL_THRESHOLDS[level - 1];
  const nextLevelStart = LEVEL_THRESHOLDS[level];
  const currentXP = xp - currentLevelStart;

  if (nextLevelStart === undefined) {
    return { level, currentXP, nextLevelXP: 0, progress: 1 };
  }

  const nextLevelXP = nextLevelStart - currentLevelStart;
  const progress = nextLevelXP > 0 ? Math.min(1, currentXP / nextLevelXP) : 1;
  return { level, currentXP, nextLevelXP, progress };
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function updateStreak(lastActiveDate: string | null): {
  streak: number;
  today: string;
} {
  const now = new Date();
  const today = toISODate(now);

  if (!lastActiveDate) return { streak: 1, today };
  if (lastActiveDate === today) return { streak: 1, today };

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (lastActiveDate === toISODate(yesterday)) return { streak: 2, today };

  return { streak: 1, today };
}
