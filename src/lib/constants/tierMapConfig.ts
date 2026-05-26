// PATH: src/lib/constants/tierMapConfig.ts

/**
 * TIER MAP CONFIGURATION - Mercy Blade Design System
 *
 * This config defines the 3-column structure for ALL tiers:
 * - LEFT: English Pathway (all English learning)
 * - CENTER: Core Mercy Blade (health, stress, AI, philosophy, psychology, meaning of life)
 * - RIGHT: Life Skills / Survival (debate, martial arts, productivity, public speaking)
 *
 * CRITICAL RULES:
 * 1. Same 3-column structure for every tier (FREE → Level 9)
 * 2. Only content difficulty climbs with tiers, not the structure
 * 3. Level 3 is CORE SPECIALIZATION (center column only) - contains sensitive/heavy topics
 * 4. Level 3 is NOT a separate tier - Level 3 users have full access to Level 3
 * 5. Never auto-mix rooms - use ONLY this explicit config
 */

import type { TierId } from "./tiers";

export interface TierColumnConfig {
  english: string[];
  core: string[];
  skills: string[];
}

export type TierMapConfig = Record<TierId, TierColumnConfig>;

/**
 * Room categorization patterns for auto-classification
 * Used as fallback when room is not explicitly configured
 */
export const COLUMN_PATTERNS = {
  english: [
    /english/i,
    /^a1/i,
    /^a2/i,
    /^b1/i,
    /^b2/i,
    /^c1/i,
    /^c2/i,
    /grammar/i,
    /writing.*deep/i,
    /listening/i,
    /speaking.*english/i,
    /vocabulary/i,
    /sentence/i,
    /communication.*english/i,
    /master.*english/i,
    /cognitive.*fluency/i,
    /storytelling/i,
  ],

  core: [
    /health/i,
    /stress/i,
    /sleep/i,
    /philosophy/i,
    /psychology/i,
    /meaning.*life/i,
    /god/i,
    /spiritual/i,
    /emotion/i,
    /anxiety/i,
    /trauma/i,
    /healing/i,
    /mental/i,
    /ai.*thinking/i,
    /bilingual/i,
    /schizophrenia/i,
    /sexuality/i,
    /sex.*education/i,
    /finance/i,
    /obesity/i,
    /weight/i,
    /sexual.*health/i,
    /emotional.*well/i,
    /lullabies/i,
    /tired.*heart/i,
  ],

  skills: [
    /survival/i,
    /first.*aid/i,
    /debate/i,
    /martial.*art/i,
    /public.*speaking/i,
    /social.*intelligence/i,
    /work.*skill/i,
    /financial.*habit/i,
    /job.*prep/i,
    /productivity/i,
    /strategy.*life/i,
    /delivery.*presence/i,
    /structuring.*message/i,
  ],
} as const;

/**
 * Categorize a room into a column based on ID and title
 */
export function categorizeRoom(
  roomId: string,
  titleEn?: string
): "english" | "core" | "skills" {
  const searchStr = `${roomId} ${titleEn || ""}`.toLowerCase();

  for (const pattern of COLUMN_PATTERNS.english) {
    if (pattern.test(searchStr)) return "english";
  }

  for (const pattern of COLUMN_PATTERNS.skills) {
    if (pattern.test(searchStr)) return "skills";
  }

  for (const pattern of COLUMN_PATTERNS.core) {
    if (pattern.test(searchStr)) return "core";
  }

  return "core";
}

/**
 * Check if a room belongs to Level 3 specialization (by ID pattern)
 * Level 3 rooms are CORE specialization containing sensitive/heavy topics
 */
export function isVip3IIRoom(roomId: string): boolean {
  const id = roomId.toLowerCase();
  return id.includes("level3") || id.includes("vip3_ii") || id.includes("level3-ii");
}

/**
 * Column labels for display
 */
export const COLUMN_LABELS = {
  english: {
    en: "English Pathway",
    vi: "Lộ Trình Tiếng Anh",
  },
  core: {
    en: "Core Mercy Blade",
    vi: "Cốt Lõi Mercy Blade",
  },
  skills: {
    en: "Life Skills / Survival",
    vi: "Kỹ Năng Sống / Sinh Tồn",
  },
} as const;

/**
 * Tier-specific content descriptions for the Tier Map
 * Maps each tier to what content belongs in each column
 */
export const TIER_CONTENT_MAP = {
  level0: {
    english: {
      title: "English Foundation",
      titleVi: "Nền Tảng Tiếng Anh",
      subtitle: "14 rooms for beginners",
    },
    core: {
      title: "Foundations of Life",
      titleVi: "Nền Tảng Cuộc Sống",
      subtitle: "Health, stress basics",
    },
    skills: {
      title: "Life Skills (Preview)",
      titleVi: "Kỹ Năng Sống (Xem Trước)",
      subtitle: "Intro only (no Survival series here)",
    },
  },

  premium_month: {
    english: {
      title: "Premium Monthly English",
      titleVi: "Premium Tháng - Tiếng Anh",
      subtitle: "Monthly premium access",
    },
    core: {
      title: "Premium Monthly Core",
      titleVi: "Premium Tháng - Cốt Lõi",
      subtitle: "Monthly premium access",
    },
    skills: {
      title: "Premium Monthly Skills",
      titleVi: "Premium Tháng - Kỹ Năng",
      subtitle: "Monthly premium access",
    },
  },

  premium_year: {
    english: {
      title: "Premium Yearly English",
      titleVi: "Premium Năm - Tiếng Anh",
      subtitle: "Yearly premium access",
    },
    core: {
      title: "Premium Yearly Core",
      titleVi: "Premium Năm - Cốt Lõi",
      subtitle: "Yearly premium access",
    },
    skills: {
      title: "Premium Yearly Skills",
      titleVi: "Premium Năm - Kỹ Năng",
      subtitle: "Yearly premium access",
    },
  },

  level1: {
    english: {
      title: "A1 Beginner",
      titleVi: "A1 Sơ Cấp",
      subtitle: "Beginner English",
    },
    core: {
      title: "Basic Habits",
      titleVi: "Thói Quen Cơ Bản",
      subtitle: "Foundation habits",
    },
    skills: {
      title: "Survival Skills",
      titleVi: "Kỹ Năng Sinh Tồn",
      subtitle: "Safety + resilience series",
    },
  },

  level2: {
    english: {
      title: "A2 + B1",
      titleVi: "A2 + B1",
      subtitle: "Pre-Intermediate",
    },
    core: {
      title: "Intermediate Skills",
      titleVi: "Kỹ Năng Trung Cấp",
    },
    skills: {
      title: "Debate",
      titleVi: "Tranh Biện",
    },
  },

  level3: {
    english: {
      title: "B2 + C1 + C2",
      titleVi: "B2 + C1 + C2",
      subtitle: "Advanced English",
    },
    core: {
      title: "Advanced Core",
      titleVi: "Nội Dung Nâng Cao",
      subtitle: "Philosophy, Psychology, Life Meaning",
    },
    skills: {
      title: "Martial Arts & Public Speaking",
      titleVi: "Võ Thuật & Nói Trước Đám Đông",
    },
  },

  level4: {
    english: {
      title: "Career English",
      titleVi: "Tiếng Anh Nghề Nghiệp",
    },
    core: {
      title: "CareerZ",
      titleVi: "Nghề Nghiệp",
      subtitle: "Career Development",
    },
    skills: {
      title: "Work Skills",
      titleVi: "Kỹ Năng Công Việc",
    },
  },

  level5: {
    english: {
      title: "Writing English",
      titleVi: "Viết Tiếng Anh",
    },
    core: {
      title: "Writing",
      titleVi: "Viết Lách",
      subtitle: "Advanced Writing Skills",
    },
    skills: {
      title: "Professional Communication",
      titleVi: "Giao Tiếp Chuyên Nghiệp",
    },
  },

  level6: {
    english: {
      title: "—",
      titleVi: "—",
    },
    core: {
      title: "Psychology",
      titleVi: "Tâm Lý Học",
      subtitle: "Shadow Psychology & Mental Health",
    },
    skills: {
      title: "—",
      titleVi: "—",
    },
  },

  level7: {
    english: { title: "Level 7", titleVi: "Level 7" },
    core: { title: "Level 7", titleVi: "Level 7" },
    skills: { title: "Level 7", titleVi: "Level 7" },
  },

  level8: {
    english: { title: "Level 8", titleVi: "Level 8" },
    core: { title: "Level 8", titleVi: "Level 8" },
    skills: { title: "Level 8", titleVi: "Level 8" },
  },

  level9: {
    english: {
      title: "—",
      titleVi: "—",
    },
    core: {
      title: "Strategy Mindset",
      titleVi: "Tư Duy Chiến Lược",
      subtitle: "Individual, Corporate, National, Historical",
    },
    skills: {
      title: "Strategic Leadership",
      titleVi: "Lãnh Đạo Chiến Lược",
    },
  },

  kids_1: {
    english: {
      title: "Kids English L1",
      titleVi: "Tiếng Anh Trẻ Em L1",
      subtitle: "Ages 3-6",
    },
    core: {
      title: "Kids Foundation",
      titleVi: "Nền Tảng Trẻ Em",
    },
    skills: {
      title: "Basic Safety",
      titleVi: "An Toàn Cơ Bản",
    },
  },

  kids_2: {
    english: {
      title: "Kids English L2",
      titleVi: "Tiếng Anh Trẻ Em L2",
      subtitle: "Ages 6-9",
    },
    core: {
      title: "Kids Intermediate",
      titleVi: "Trẻ Em Trung Cấp",
    },
    skills: {
      title: "Life Skills for Kids",
      titleVi: "Kỹ Năng Sống Trẻ Em",
    },
  },

  kids_3: {
    english: {
      title: "Kids English L3",
      titleVi: "Tiếng Anh Trẻ Em L3",
      subtitle: "Ages 9-12",
    },
    core: {
      title: "Kids Advanced",
      titleVi: "Trẻ Em Nâng Cao",
    },
    skills: {
      title: "Pre-Teen Skills",
      titleVi: "Kỹ Năng Tiền Thiếu Niên",
    },
  },
} satisfies Record<
  TierId,
  {
    english: { title: string; titleVi: string; subtitle?: string };
    core: { title: string; titleVi: string; subtitle?: string };
    skills: { title: string; titleVi: string; subtitle?: string };
  }
>;

/**
 * Level 3 is a CORE SPECIALIZATION block, NOT a separate tier
 * Level 3 users MUST see Level 3 rooms (same access level = 3)
 */
export const VIP3_DESCRIPTION = {
  en: "Core Specialization — Sensitive & Advanced Topics",
  vi: "Chuyên Biệt Cốt Lõi — Chủ Đề Nhạy Cảm & Nâng Cao",
} as const;

/**
 * Tier display order for the Tier Map (top to bottom = highest to lowest)
 */
export const TIER_MAP_ORDER: TierId[] = [
  "level9",
  "level8",
  "level7",
  "level6",
  "level5",
  "level4",
  "level3",
  "level2",
  "level1",
  "premium_year",
  "premium_month",
  "level0",
];

/**
 * Get the route path for a tier
 */
export function getTierPath(tierId: TierId): string {
  switch (tierId) {
    case "level0":
      return "/rooms";
    case "premium_month":
      return "/pricing";
    case "premium_year":
      return "/pricing";
    case "level1":
      return "/vip/level1";
    case "level2":
      return "/vip/level2";
    case "level3":
      return "/vip/level3";
    case "level4":
      return "/vip/level4";
    case "level5":
      return "/vip/level5";
    case "level6":
      return "/vip/level6";
    case "level7":
      return "/vip/level7";
    case "level8":
      return "/vip/level8";
    case "level9":
      return "/vip/level9";
    case "kids_1":
      return "/kids-level1";
    case "kids_2":
      return "/kids-level2";
    case "kids_3":
      return "/kids-level3";
    default:
      return "/rooms";
  }
}

/**
 * Get display label for a tier
 */
export function getTierLabel(tierId: TierId): string {
  switch (tierId) {
    case "level0":
      return "Level 0";
    case "premium_month":
      return "Premium Monthly";
    case "premium_year":
      return "Premium Yearly";
    case "level1":
      return "Level 1";
    case "level2":
      return "Level 2";
    case "level3":
      return "Level 3";
    case "level4":
      return "Level 4";
    case "level5":
      return "Level 5";
    case "level6":
      return "Level 6";
    case "level7":
      return "Level 7";
    case "level8":
      return "Level 8";
    case "level9":
      return "Level 9";
    case "kids_1":
      return "Kids L1";
    case "kids_2":
      return "Kids L2";
    case "kids_3":
      return "Kids L3";
    default:
      return String(tierId).toUpperCase();
  }
}