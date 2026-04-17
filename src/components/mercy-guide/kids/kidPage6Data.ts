/**
 * Path: src/components/mercy-guide/kids/kidPage6Data.ts
 * File: kidPage6Data.ts
 */

export type KidPage6LessonCard = {
  key: string;
  label: string;
  sentence: string;
  imageSrc: string;
  aliases: string[];
};

const KID_PAGE6_KEYS = [
  'k6_001_clap_your_hands',
  'k6_002_sit_down',
  'k6_003_stand_up',
  'k6_004_come_here',
  'k6_005_go_back',
  'k6_006_open_the_book',
  'k6_007_close_the_door',
  'k6_008_touch_your_head',
  'k6_009_raise_your_hand',
  'k6_010_turn_around',
  'k6_011_jump_up',
  'k6_012_wave_hello',
  'k6_013_point_to_the_window',
  'k6_014_pick_it_up',
  'k6_015_put_it_down',
  'k6_016_shake_your_head',
  'k6_017_nod_your_head',
  'k6_018_stomp_your_feet',
  'k6_019_touch_your_nose',
  'k6_020_open_your_mouth',
  'k6_021_close_your_eyes',
  'k6_022_spin_around',
  'k6_023_bend_your_knees',
  'k6_024_stretch_your_arms',
  'k6_025_take_a_step',
  'k6_026_run_in_place',
  'k6_027_freeze',
  'k6_028_whisper',
  'k6_029_shout',
  'k6_030_tiptoe',
  'k6_031_march',
  'k6_032_hop_on_one_foot',
  'k6_033_clap_three_times',
  'k6_034_touch_your_toes',
  'k6_035_reach_up_high',
  'k6_036_crouch_down',
  'k6_037_clap_above_your_head',
  'k6_038_touch_your_ears',
  'k6_039_pat_your_head',
  'k6_040_rub_your_tummy',
  'k6_041_wiggle_your_fingers',
  'k6_042_stamp_your_foot',
  'k6_043_touch_the_floor',
  'k6_044_look_up',
  'k6_045_look_down',
  'k6_046_roll_your_shoulders',
  'k6_047_swing_your_arms',
  'k6_048_smile',
  'k6_049_show_me_your_hands',
  'k6_050_say_hello',
  'k6_051_say_goodbye',
  'k6_052_count_with_me',
  'k6_053_listen_carefully',
  'k6_054_look_at_me',
  'k6_055_sit_like_a_frog',
  'k6_056_fly_like_a_bird',
  'k6_057_walk_slowly',
  'k6_058_walk_fast',
  'k6_059_jump_like_a_frog',
  'k6_060_great_job',
] as const;

function cleanText(value?: string | null): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function normalizePage6Key(value?: string | null): string {
  return cleanText(value).replace(/\.png$/i, '');
}

export function isPage6LessonKey(value?: string | null): boolean {
  return /^k6_\d+_/i.test(normalizePage6Key(value));
}

function toTitleCase(words: string[]): string {
  return words
    .map((word) => {
      if (word === 'a') return 'A';
      if (word === 'me') return 'Me';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function formatPage6WordsFromKey(key: string): string[] {
  const normalized = normalizePage6Key(key);
  if (!normalized) return [];

  const slug = normalized.replace(/^k6_\d+_/i, '');
  if (!slug) return [];

  return slug
    .split('_')
    .filter(Boolean)
    .map((word) => word.toLowerCase());
}

function toPage6Sentence(key: string): string {
  const words = formatPage6WordsFromKey(key);
  if (words.length === 0) return '';

  const text = words.join(' ');
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}.`;
}

function toPage6Label(key: string): string {
  const words = formatPage6WordsFromKey(key);
  if (words.length === 0) return '';
  return toTitleCase(words);
}

function toPage6Aliases(key: string): string[] {
  const normalized = normalizePage6Key(key);
  const words = formatPage6WordsFromKey(key);
  const text = words.join(' ');

  return Array.from(
    new Set([
      normalized,
      ...words,
      text,
      text.replace(/\s+/g, '-'),
    ].filter(Boolean)),
  );
}

export const KID_PAGE6_LESSONS: KidPage6LessonCard[] = KID_PAGE6_KEYS.map(
  (key) => ({
    key,
    label: toPage6Label(key),
    sentence: toPage6Sentence(key),
    imageSrc: `/images/mercy-kids-page-6/${key}.png`,
    aliases: toPage6Aliases(key),
  }),
);

export function getPage6LessonByKey(
  key?: string | null,
): KidPage6LessonCard | null {
  if (!isPage6LessonKey(key)) return null;

  const normalized = normalizePage6Key(key);
  if (!normalized) return null;

  return KID_PAGE6_LESSONS.find((item) => item.key === normalized) ?? null;
}