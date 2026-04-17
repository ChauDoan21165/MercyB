/**
 * Path: src/components/mercy-guide/kids/kidPage8Data.ts
 * File: kidPage8Data.ts
 */

export type KidPage8LessonCard = {
  key: string;
  label: string;
  sentence: string;
  imageSrc: string;
  aliases: string[];
};

const KID_PAGE8_KEYS = [
  'k8_001_hello',
  'k8_002_hi',
  'k8_003_good_morning',
  'k8_004_good_afternoon',
  'k8_005_good_night',
  'k8_006_how_are_you',
  'k8_007_i_am_fine',
  'k8_008_i_am_happy',
  'k8_009_i_am_tired',
  'k8_010_i_am_okay',
  'k8_011_i_am_great',
  'k8_012_thank_you',
  'k8_013_youre_welcome',
  'k8_014_please',
  'k8_015_sorry',
  'k8_016_excuse_me',
  'k8_017_bye',
  'k8_018_see_you_later',
  'k8_019_see_you_tomorrow',
  'k8_020_what_is_your_name',
  'k8_021_my_name_is',
  'k8_022_how_old_are_you',
  'k8_023_i_am_five_years_old',
  'k8_024_can_i_help_you',
  'k8_025_yes_please',
  'k8_026_no_thank_you',
  'k8_027_do_you_like_it',
  'k8_028_i_like_it_very_much',
  'k8_029_what_do_you_want',
  'k8_030_i_want_water',
  'k8_031_let_us_play',
  'k8_032_are_you_ready',
  'k8_033_come_and_play_with_me',
  'k8_034_that_is_so_funny',
  'k8_035_you_are_my_friend',
  'k8_036_can_you_help_me',
  'k8_037_i_can_help_you',
  'k8_038_sharing_is_caring',
  'k8_039_i_missed_you',
  'k8_040_we_are_friends',
] as const;

function cleanText(value?: string | null): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function normalizePage8Key(value?: string | null): string {
  return cleanText(value).replace(/\.png$/i, '');
}

export function isPage8LessonKey(value?: string | null): boolean {
  return /^k8_\d+_/i.test(normalizePage8Key(value));
}

function toTitleCase(words: string[]): string {
  return words
    .map((word) => {
      if (word === 'i') return 'I';
      if (word === 'im') return "I'm";
      if (word === 'youre') return "You're";
      if (word === 'us') return 'Us';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function formatPage8WordsFromKey(key: string): string[] {
  const normalized = normalizePage8Key(key);
  if (!normalized) return [];

  const slug = normalized.replace(/^k8_\d+_/i, '');
  if (!slug) return [];

  return slug
    .split('_')
    .filter(Boolean)
    .map((word) => word.toLowerCase());
}

function toPage8Sentence(key: string): string {
  const words = formatPage8WordsFromKey(key);
  if (words.length === 0) return '';

  const text = words
    .map((word) => {
      if (word === 'i') return 'I';
      if (word === 'im') return "I'm";
      if (word === 'youre') return "you're";
      if (word === 'us') return 'us';
      return word;
    })
    .join(' ');

  const sentence = `${text.charAt(0).toUpperCase()}${text.slice(1)}`;

  const isQuestion =
    /^How /i.test(sentence) ||
    /^What /i.test(sentence) ||
    /^Can /i.test(sentence) ||
    /^Are /i.test(sentence) ||
    /^Do /i.test(sentence);

  if (isQuestion) {
    return sentence.endsWith('?') ? sentence : `${sentence}?`;
  }

  return sentence.endsWith('.') ? sentence : `${sentence}.`;
}

function toPage8Label(key: string): string {
  const words = formatPage8WordsFromKey(key);
  if (words.length === 0) return '';
  return toTitleCase(words);
}

function toPage8Aliases(key: string): string[] {
  const normalized = normalizePage8Key(key);
  const words = formatPage8WordsFromKey(key);
  const phrase = words.join(' ');
  const sentence = toPage8Sentence(key)
    .toLowerCase()
    .replace(/[.!?]+$/g, '');

  return Array.from(
    new Set([
      normalized,
      ...words,
      phrase,
      phrase.replace(/\s+/g, '-'),
      sentence,
    ].filter(Boolean)),
  );
}

export const KID_PAGE8_LESSONS: KidPage8LessonCard[] = KID_PAGE8_KEYS.map(
  (key) => ({
    key,
    label: toPage8Label(key),
    sentence: toPage8Sentence(key),
    imageSrc: `/images/mercy-kids-page-8/${key}.png`,
    aliases: toPage8Aliases(key),
  }),
);

export function getPage8LessonByKey(
  key?: string | null,
): KidPage8LessonCard | null {
  if (!isPage8LessonKey(key)) return null;

  const normalized = normalizePage8Key(key);
  if (!normalized) return null;

  return KID_PAGE8_LESSONS.find((item) => item.key === normalized) ?? null;
}