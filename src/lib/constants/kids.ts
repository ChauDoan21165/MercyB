// Kids constants following Mercy Blade Design System v1.1

export const KIDS_TABLE = "kids_rooms";
export const KIDS_ROUTE_PREFIX = "/kids-chat";
export const KIDS_LEVEL_IDS = ["level1", "level2", "level3"] as const;

export type KidsLevelId = typeof KIDS_LEVEL_IDS[number];

export const KIDS_LEVEL_LABELS = {
  level1: { en: "Kids Level 1", vi: "Trẻ em cấp 1", ageRange: "Ages 4-7" },
  level2: { en: "Kids Level 2", vi: "Trẻ em cấp 2", ageRange: "Ages 7-10" },
  level3: { en: "Kids Level 3", vi: "Trẻ em cấp 3", ageRange: "Ages 10-13" },
} as const;
