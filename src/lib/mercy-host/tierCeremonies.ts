/**
 * Path: src/lib/mercy-host/tierCeremonies.ts
 * File: tierCeremonies.ts
 */

import type { MercyAnimationType } from "./eventMap";
import type { VoiceTrigger } from "./voicePack";
import { memory } from "./memory";

export interface TierCeremonySpec {
  tier: string;
  animation: MercyAnimationType;
  voiceTrigger: VoiceTrigger;
  textEn: string;
  textVi: string;
}

export const TIER_CEREMONIES: Record<string, TierCeremonySpec> = {
  level1: {
    tier: "level1",
    animation: "shimmer",
    voiceTrigger: "celebration",
    textEn: "Welcome deeper. Your commitment to growth inspires me.",
    textVi: "Chào mừng sâu hơn. Cam kết phát triển của bạn truyền cảm hứng cho mình.",
  },
  level2: {
    tier: "level2",
    animation: "shimmer",
    voiceTrigger: "celebration",
    textEn: "You're building real momentum now. I'm honored to walk with you.",
    textVi: "Bạn đang tạo đà tiến thực sự. Mình vinh dự được bước cùng bạn.",
  },
  level3: {
    tier: "level3",
    animation: "glow",
    voiceTrigger: "celebration",
    textEn: "The depths call to you. Welcome to clearer waters.",
    textVi: "Chiều sâu gọi bạn. Chào mừng đến vùng nước trong hơn.",
  },
  level4: {
    tier: "level4",
    animation: "glow",
    voiceTrigger: "celebration",
    textEn: "Precision becomes your ally. This tier shapes focus.",
    textVi: "Sự chính xác trở thành đồng minh. Tầng này định hình sự tập trung.",
  },
  level5: {
    tier: "level5",
    animation: "shimmer",
    voiceTrigger: "celebration",
    textEn: "Your influence grows. Lead with the heart you carry.",
    textVi: "Ảnh hưởng của bạn tăng lên. Dẫn dắt bằng trái tim bạn mang.",
  },
  level6: {
    tier: "level6",
    animation: "glow",
    voiceTrigger: "celebration",
    textEn: "Strategy and serenity merge here. Welcome, thoughtful one.",
    textVi: "Chiến lược và thanh thản hợp nhất ở đây. Chào mừng, người suy tư.",
  },
  level7: {
    tier: "level7",
    animation: "shimmer",
    voiceTrigger: "celebration",
    textEn: "The horizon opens. You're becoming a creator now.",
    textVi: "Chân trời mở ra. Bạn đang trở thành người sáng tạo.",
  },
  level8: {
    tier: "level8",
    animation: "glow",
    voiceTrigger: "celebration",
    textEn: "Light becomes language here. Welcome to transcendence.",
    textVi: "Ánh sáng trở thành ngôn ngữ ở đây. Chào mừng đến siêu việt.",
  },
  level9: {
    tier: "level9",
    animation: "shimmer",
    voiceTrigger: "celebration",
    textEn: "Distinguished one, you've arrived. Mercy bows to your path.",
    textVi: "Người xuất sắc, bạn đã đến. Mercy cúi chào con đường của bạn.",
  },
};

function normalizeTierKey(tier: string | null | undefined): string {
  const raw = String(tier ?? "").trim().toLowerCase();

  if (!raw) return "level0";

  const compact = raw.replace(/[\s_-]+/g, "");

  if (compact === "free") return "level0";
  if (compact === "level0") return "level0";

  const levelMatch = compact.match(/^level([1-9])$/);
  if (levelMatch) {
    return `level${levelMatch[1]}`;
  }

  const vipMatch = compact.match(/^vip([1-9])$/);
  if (vipMatch) {
    return `level${vipMatch[1]}`;
  }

  return compact;
}

export function getTierCeremony(tier: string): TierCeremonySpec | null {
  const normalizedTier = normalizeTierKey(tier);
  return TIER_CEREMONIES[normalizedTier] || null;
}

export function hasCeremonyBeenPlayed(tier: string): boolean {
  const mem = memory.get() as unknown as Record<string, unknown>;
  const celebrated = Array.isArray(mem.tiersCelebrated)
    ? (mem.tiersCelebrated as string[])
    : [];

  const normalizedTier = normalizeTierKey(tier);
  return celebrated.map(normalizeTierKey).includes(normalizedTier);
}

export function markCeremonyPlayed(tier: string): void {
  const mem = memory.get() as unknown as Record<string, unknown>;
  const celebrated = Array.isArray(mem.tiersCelebrated)
    ? (mem.tiersCelebrated as string[])
    : [];

  const normalizedTier = normalizeTierKey(tier);

  if (!celebrated.map(normalizeTierKey).includes(normalizedTier)) {
    memory.update({
      ...mem,
      tiersCelebrated: [...celebrated, normalizedTier],
    } as never);
  }
}

export function getCeremonyText(
  ceremony: TierCeremonySpec,
  language: "en" | "vi"
): string {
  return language === "vi" ? ceremony.textVi : ceremony.textEn;
}

export function executeTierCeremony(
  newTier: string,
  previousTier?: string
): TierCeremonySpec | null {
  const normalizedNewTier = normalizeTierKey(newTier);
  const ceremony = getTierCeremony(normalizedNewTier);

  if (!ceremony) {
    return null;
  }

  if (previousTier) {
    const newNum = tierToNumber(normalizedNewTier);
    const prevNum = tierToNumber(previousTier);

    if (newNum <= prevNum) {
      return null;
    }
  }

  if (hasCeremonyBeenPlayed(normalizedNewTier)) {
    return null;
  }

  markCeremonyPlayed(normalizedNewTier);
  return ceremony;
}

function tierToNumber(tier: string): number {
  const normalized = normalizeTierKey(tier);

  if (normalized === "level0") return 0;

  const match = normalized.match(/^level([1-9])$/);
  return match ? parseInt(match[1], 10) : 0;
}