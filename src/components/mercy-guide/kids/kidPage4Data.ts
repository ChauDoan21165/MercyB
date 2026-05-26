/**
 * Path: src/components/mercy-guide/kids/kidPage4Data.ts
 * File: kidPage4Data.ts
 */

export type KidPage4LessonCard = {
  key: string;
  label: string;
  sentence: string;
  imageSrc: string;
  aliases: string[];
};

const KID_PAGE4_KEYS = [
  'k4_001_jump',
  'k4_002_run',
  'k4_003_walk',
  'k4_004_clap',
  'k4_005_wave',
  'k4_006_dance',
  'k4_007_eat',
  'k4_008_drink',
  'k4_009_sleep',
  'k4_010_read',
  'k4_011_write',
  'k4_012_draw',
  'k4_013_open',
  'k4_014_close',
  'k4_015_push',
  'k4_016_pull',
  'k4_017_kick',
  'k4_018_throw',
  'k4_019_catch',
  'k4_020_swim',
  'k4_021_sing',
  'k4_022_laugh',
  'k4_023_cry',
  'k4_024_hug',
  'k4_025_point',
  'k4_026_sit',
  'k4_027_stand',
  'k4_028_bend',
  'k4_029_stretch',
  'k4_030_spin',
  'k4_031_hop',
  'k4_032_skip',
  'k4_033_crawl',
  'k4_034_roll',
  'k4_035_climb',
  'k4_036_slide',
  'k4_037_swing',
  'k4_038_dig',
  'k4_039_plant',
  'k4_040_water',
  'k4_041_cook',
  'k4_042_cut',
  'k4_043_paste',
  'k4_044_fold',
  'k4_045_count',
  'k4_046_build',
  'k4_047_break',
  'k4_048_fix',
  'k4_049_carry',
  'k4_050_lift',
  'k4_051_drop',
  'k4_052_pick_up',
  'k4_053_put_down',
  'k4_054_pour',
  'k4_055_fill',
  'k4_056_empty',
  'k4_057_wash',
  'k4_058_dry',
  'k4_059_brush',
  'k4_060_comb',
  'k4_061_dress',
  'k4_062_undress',
  'k4_063_zip',
  'k4_064_button',
  'k4_065_tie',
  'k4_066_kick_ball',
  'k4_067_bounce',
  'k4_068_roll_ball',
  'k4_069_catch_butterfly',
  'k4_070_look',
  'k4_071_listen',
  'k4_072_smell',
  'k4_073_taste',
  'k4_074_touch',
  'k4_075_hide',
  'k4_076_find',
  'k4_077_show',
  'k4_078_give',
  'k4_079_take',
  'k4_080_rest',
] as const;

function cleanText(value?: string | null): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function normalizePage4Key(value?: string | null): string {
  return cleanText(value).replace(/\.png$/i, '');
}

export function isPage4LessonKey(value?: string | null): boolean {
  return /^k4_\d+_/i.test(normalizePage4Key(value));
}

function toTitleCase(words: string[]): string {
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatPage4WordsFromKey(key: string): string[] {
  const normalized = normalizePage4Key(key);
  if (!normalized) return [];

  const slug = normalized.replace(/^k4_\d+_/i, '');
  if (!slug) return [];

  return slug
    .split('_')
    .filter(Boolean)
    .map((word) => word.toLowerCase());
}

function toPage4Label(key: string): string {
  const words = formatPage4WordsFromKey(key);
  if (words.length === 0) return '';
  return toTitleCase(words);
}

function toPage4Sentence(key: string): string {
  const words = formatPage4WordsFromKey(key);
  if (words.length === 0) return '';

  const base = words.join(' ');
  return `${base.charAt(0).toUpperCase()}${base.slice(1)}.`;
}

function toPage4Aliases(key: string): string[] {
  const normalized = normalizePage4Key(key);
  const words = formatPage4WordsFromKey(key);

  return Array.from(
    new Set([
      normalized,
      ...words,
      words.join(' '),
      words.join('-'),
    ].filter(Boolean)),
  );
}

export const KID_PAGE4_LESSONS: KidPage4LessonCard[] = KID_PAGE4_KEYS.map(
  (key) => ({
    key,
    label: toPage4Label(key),
    sentence: toPage4Sentence(key),
    imageSrc: `/images/mercy-kids-page-4/${key}.png`,
    aliases: toPage4Aliases(key),
  }),
);

export function getPage4LessonByKey(
  key?: string | null,
): KidPage4LessonCard | null {
  if (!isPage4LessonKey(key)) return null;

  const normalized = normalizePage4Key(key);
  if (!normalized) return null;

  return KID_PAGE4_LESSONS.find((item) => item.key === normalized) ?? null;
}