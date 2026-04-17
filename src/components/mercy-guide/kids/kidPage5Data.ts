/**
 * Path: src/components/mercy-guide/kids/kidPage5Data.ts
 * File: kidPage5Data.ts
 */

export type KidPage5LessonCard = {
  key: string;
  label: string;
  sentence: string;
  imageSrc: string;
  aliases: string[];
};

const KID_PAGE5_KEYS = [
  'k5_001_i_can_jump',
  'k5_002_i_can_run',
  'k5_003_i_can_sing',
  'k5_004_i_can_read',
  'k5_005_i_can_draw',
  'k5_006_i_can_swim',
  'k5_007_i_can_dance',
  'k5_008_i_can_ride_a_bike',
  'k5_009_i_can_write',
  'k5_010_i_can_count',
  'k5_011_i_can_clap',
  'k5_012_i_can_wave',
  'k5_013_i_can_cook',
  'k5_014_i_can_climb',
  'k5_015_i_can_kick',
  'k5_016_i_can_throw',
  'k5_017_i_can_catch',
  'k5_018_i_can_build',
  'k5_019_i_can_fold',
  'k5_020_i_can_pour',
  'k5_021_i_can_wash',
  'k5_022_i_can_dress',
  'k5_023_i_can_zip',
  'k5_024_i_can_tie',
  'k5_025_i_can_hop',
  'k5_026_i_can_skip',
  'k5_027_i_can_spin',
  'k5_028_i_can_roll',
  'k5_029_i_can_crawl',
  'k5_030_i_can_stretch',
  'k5_031_i_can_bend',
  'k5_032_i_can_lift',
  'k5_033_i_can_carry',
  'k5_034_i_can_find',
  'k5_035_i_can_show',
  'k5_036_i_can_give',
  'k5_037_i_can_share',
  'k5_038_i_can_help',
  'k5_039_i_can_bounce',
  'k5_040_i_can_slide',
  'k5_041_i_can_swing',
  'k5_042_i_can_dig',
  'k5_043_i_can_plant',
  'k5_044_i_can_water',
  'k5_045_i_can_cut',
  'k5_046_i_can_paste',
  'k5_047_i_can_draw_a_picture',
  'k5_048_i_can_whistle',
  'k5_049_i_can_snap_fingers',
  'k5_050_i_can_wink',
  'k5_051_i_can_nod',
  'k5_052_i_can_blink',
  'k5_053_i_can_blow',
  'k5_054_i_can_point',
  'k5_055_i_can_look',
  'k5_056_i_can_listen',
  'k5_057_i_can_smell',
  'k5_058_i_can_taste',
  'k5_059_i_can_touch',
  'k5_060_i_can_hide',
  'k5_061_i_can_pick_up',
  'k5_062_i_can_put_down',
  'k5_063_i_can_fill',
  'k5_064_i_can_empty',
  'k5_065_i_can_brush_teeth',
  'k5_066_i_can_comb_hair',
  'k5_067_i_can_button',
  'k5_068_i_can_push',
  'k5_069_i_can_pull',
  'k5_070_i_can_fix',
  'k5_071_i_can_break',
  'k5_072_i_can_open',
  'k5_073_i_can_close',
  'k5_074_i_can_drop',
  'k5_075_i_can_rest',
  'k5_076_i_can_walk',
  'k5_077_i_can_catch_a_butterfly',
  'k5_078_i_can_count_to_five',
  'k5_079_i_can_share_a_cookie',
  'k5_080_i_can_do_it',
] as const;

function cleanText(value?: string | null): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function normalizePage5Key(value?: string | null): string {
  return cleanText(value).replace(/\.png$/i, '');
}

export function isPage5LessonKey(value?: string | null): boolean {
  return /^k5_\d+_/i.test(normalizePage5Key(value));
}

function toTitleCase(words: string[]): string {
  return words
    .map((word) => {
      if (word === 'i') return 'I';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function formatPage5WordsFromKey(key: string): string[] {
  const normalized = normalizePage5Key(key);
  if (!normalized) return [];

  const slug = normalized.replace(/^k5_\d+_/i, '');
  if (!slug) return [];

  return slug
    .split('_')
    .filter(Boolean)
    .map((word) => word.toLowerCase());
}

function toPage5Sentence(key: string): string {
  const words = formatPage5WordsFromKey(key);
  if (words.length === 0) return '';

  const text = words
    .map((word) => (word === 'i' ? 'I' : word))
    .join(' ');

  return `${text.charAt(0).toUpperCase()}${text.slice(1)}.`;
}

function toPage5Label(key: string): string {
  const words = formatPage5WordsFromKey(key);
  if (words.length === 0) return '';
  return toTitleCase(words);
}

function toPage5Aliases(key: string): string[] {
  const normalized = normalizePage5Key(key);
  const words = formatPage5WordsFromKey(key);
  const text = words
    .map((word) => (word === 'i' ? 'i' : word))
    .join(' ');

  return Array.from(
    new Set([
      normalized,
      ...words,
      text,
      text.replace(/\s+/g, '-'),
    ].filter(Boolean)),
  );
}

export const KID_PAGE5_LESSONS: KidPage5LessonCard[] = KID_PAGE5_KEYS.map(
  (key) => ({
    key,
    label: toPage5Label(key),
    sentence: toPage5Sentence(key),
    imageSrc: `/images/mercy-kids-page-5/${key}.png`,
    aliases: toPage5Aliases(key),
  }),
);

export function getPage5LessonByKey(
  key?: string | null,
): KidPage5LessonCard | null {
  if (!isPage5LessonKey(key)) return null;

  const normalized = normalizePage5Key(key);
  if (!normalized) return null;

  return KID_PAGE5_LESSONS.find((item) => item.key === normalized) ?? null;
}