// RoomMaster Rules - All validation rules in one place

import type { TierId } from "./roomMasterTypes";

export const RULES = {
  // ID Rules
  ID: {
    PATTERN: /^[a-z0-9]+(_[a-z0-9]+)*$/,
    MESSAGE: "Room ID must be lowercase snake_case: letters, numbers, underscores only",
    EXAMPLE: "strategic_foundations_vip9",
  },

  // Slug Rules
  SLUG: {
    PATTERN: /^[a-z0-9]+(-[a-z0-9]+)*$/,
    MESSAGE: "Entry slug must be lowercase kebab-case: letters, numbers, hyphens only",
    EXAMPLE: "meaning-of-life",
  },

  // Tier Rules
  TIER: {
    VALID_TIERS: [
      "free",
      "Free / Miễn phí",
      "vip1",
      "VIP1",
      "vip2",
      "VIP2",
      "vip3",
      "VIP3",
      "vip3ii",
      "VIP3II",
      "vip4",
      "VIP4",
      "vip5",
      "VIP5",
      "vip6",
      "VIP6",
      "vip7",
      "VIP7",
      "vip8",
      "VIP8",
      "vip9",
      "VIP9",
      "kids_1",
      "Kids Level 1",
      "kids_2",
      "Kids Level 2",
      "kids_3",
      "Kids Level 3",
    ] as const,

    // IMPORTANT: This map is intentionally broader than TierId.
    // Some legacy labels normalize into TierId; some normalize to null via normalizeTier().
    // TS fix: keep values as "as const", do NOT force-cast to Record<string, TierId>.
    NORMALIZE_MAP: {
      "Free / Miễn phí": "free",
      free: "free",

      VIP1: "vip1",
      vip1: "vip1",

      VIP2: "vip2",
      vip2: "vip2",

      VIP3: "vip3",
      vip3: "vip3",

      // ✅ Legacy tier: normalize to vip3 (TierId-safe)
      VIP3II: "vip3",
      vip3ii: "vip3",

      VIP4: "vip4",
      vip4: "vip4",

      VIP5: "vip5",
      vip5: "vip5",

      VIP6: "vip6",
      vip6: "vip6",

      VIP7: "vip7",
      vip7: "vip7",

      VIP8: "vip8",
      vip8: "vip8",

      VIP9: "vip9",
      vip9: "vip9",

      "Kids Level 1": "kids_1",
      kids_1: "kids_1",

      "Kids Level 2": "kids_2",
      kids_2: "kids_2",

      "Kids Level 3": "kids_3",
      kids_3: "kids_3",
    } as const,
  },

  // Entry Rules
  ENTRIES: {
    MIN_COUNT: 2,
    MAX_COUNT: 8,
    MESSAGE: "Room must have 2-8 entries",
  },

  // Keywords Rules
  KEYWORDS: {
    MIN_COUNT: 3,
    MAX_COUNT: 5,
    MESSAGE: "Each entry must have 3-5 keywords (both EN and VI)",
  },

  // Copy Length Rules (word count)
  COPY: {
    MIN_WORDS: 50,
    MAX_WORDS: 150,
    MESSAGE: "Entry copy must be 50-150 words in both EN and VI",
  },

  // Intro Length Rules (word count for room.content)
  INTRO: {
    MIN_WORDS: 80,
    MAX_WORDS: 140,
    MESSAGE: "Room intro (content) must be 80-140 words in both EN and VI",
  },

  // Audio Rules
  AUDIO: {
    PATTERN: /^[a-z0-9_]+_\d+_en\.mp3$/,
    MESSAGE: "Audio filename must match pattern: roomid_index_en.mp3",
    EXAMPLE: "strategic_foundations_vip9_01_en.mp3",
    FOLDER: "/audio/",
  },

  // Tags Rules
  TAGS: {
    ALLOWED: [
      "emotional",
      "behavioral",
      "mindset",
      "safety",
      "crisis",
      "skill",
      "habit",
      "art",
      "creativity",
      "imagination",
      "games",
      "creative-thinking",
    ] as const,
    MIN_COUNT: 2,
    MAX_COUNT: 4,
    MESSAGE: "Each entry must have 2-4 tags from the allowed list",
  },

  // Bilingual Rules
  BILINGUAL: {
    REQUIRED_FIELDS: ["title", "content", "copy"] as const,
    MESSAGE: "All text fields must have both EN and VI translations",
  },

  // Filename Match Rules
  FILENAME_MATCH: {
    MESSAGE: "JSON filename must exactly match room ID: {id}.json",
  },

  // Crisis Detection Keywords
  CRISIS_KEYWORDS: {
    HIGH_SEVERITY: ["suicide", "self-harm", "kill myself", "end my life", "want to die", "no reason to live", "better off dead"] as const,
    MEDIUM_SEVERITY: ["severe depression", "can't go on", "overwhelming pain", "unbearable", "hopeless", "helpless"] as const,
    LOW_SEVERITY: ["violence", "abuse", "trauma", "flashback", "panic attack"] as const,
  },

  // Safety Disclaimer Requirements
  SAFETY: {
    // ✅ Remove vip3ii from TierId-facing set (we normalize vip3ii -> vip3)
    REQUIRED_FOR_TIERS: ["vip1", "vip2", "vip3", "vip4", "vip5", "vip6", "vip9"] as const,
    DEFAULT_EN:
      "This content is for educational purposes only and is not a substitute for professional medical or mental health advice. If you are experiencing a crisis, please contact emergency services or a qualified healthcare provider immediately.",
    DEFAULT_VI:
      "Nội dung này chỉ nhằm mục đích giáo dục và không thay thế cho lời khuyên y tế hoặc sức khỏe tâm thần chuyên nghiệp. Nếu bạn đang trải qua khủng hoảng, vui lòng liên hệ dịch vụ khẩn cấp hoặc nhà cung cấp dịch vụ chăm sóc sức khỏe có trình độ ngay lập tức.",
  },

  // All-Entry Rules
  ALL_ENTRY: {
    SLUG: "all-entry",
    MESSAGE: 'Last entry must be "all-entry" containing concatenated ALL entries in order',
  },
} as const;

export const validateRoomId = (id: string): boolean => {
  return RULES.ID.PATTERN.test(id);
};

export const validateSlug = (slug: string): boolean => {
  return RULES.SLUG.PATTERN.test(slug);
};

// TS fix: normalizeTier returns TierId | null, but RULES.TIER.NORMALIZE_MAP is wider.
// We only return TierId values (vip3ii is normalized to vip3 above).
export const normalizeTier = (tier: string): TierId | null => {
  const v = (RULES.TIER.NORMALIZE_MAP as Record<string, string | undefined>)[tier];
  return (v as TierId) || null;
};

// TS fix: includes() on a readonly tuple narrows to the union of its elements.
// Accept string input and check against VALID_TIERS safely.
export const validateTier = (tier: string): boolean => {
  return (RULES.TIER.VALID_TIERS as readonly string[]).includes(tier);
};

export const validateAudioFilename = (filename: string): boolean => {
  return RULES.AUDIO.PATTERN.test(filename);
};

// TS fix: includes() expects the literal union; accept string by widening allowed list to readonly string[]
export const validateTags = (tags: string[]): boolean => {
  const allowed = RULES.TAGS.ALLOWED as readonly string[];
  return tags.every((tag) => allowed.includes(tag));
};

export const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter((w) => w.length > 0).length;
};
