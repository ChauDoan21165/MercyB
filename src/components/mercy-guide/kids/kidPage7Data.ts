/**
 * Path: src/components/mercy-guide/kids/kidPage7Data.ts
 * File: kidPage7Data.ts
 */

export type KidPage7LessonCard = {
  key: string;
  label: string;
  sentence: string;
  imageSrc: string;
  aliases: string[];
};

type Page7LessonSpec = {
  key: string;
  sentence: string;
};

const KID_PAGE7_SPECS: Page7LessonSpec[] = [
  { key: 'k7_001_excited', sentence: 'I am excited.' },
  { key: 'k7_002_bored', sentence: 'I am bored.' },
  { key: 'k7_003_surprised', sentence: 'I am surprised.' },
  { key: 'k7_004_nervous', sentence: 'I am nervous.' },
  { key: 'k7_005_proud', sentence: 'I am proud.' },
  { key: 'k7_006_confused', sentence: 'I am confused.' },
  { key: 'k7_007_silly', sentence: 'I am silly.' },
  { key: 'k7_008_calm', sentence: 'I am calm.' },
  { key: 'k7_009_loved', sentence: 'I feel loved.' },
  { key: 'k7_010_tired', sentence: 'I am tired.' },
  { key: 'k7_011_hungry', sentence: 'I am hungry.' },
  { key: 'k7_012_thirsty', sentence: 'I am thirsty.' },
  { key: 'k7_013_hot', sentence: 'I feel hot.' },
  { key: 'k7_014_cold', sentence: 'I feel cold.' },
  { key: 'k7_015_sick', sentence: 'I feel sick.' },
  { key: 'k7_016_better', sentence: 'I feel better.' },
  { key: 'k7_017_scared', sentence: 'I am scared.' },
  { key: 'k7_018_brave', sentence: 'I am brave.' },
  { key: 'k7_019_grateful', sentence: 'I am grateful.' },
  { key: 'k7_020_embarrassed', sentence: 'I am embarrassed.' },
  { key: 'k7_021_curious', sentence: 'I am curious.' },
  { key: 'k7_022_lonely', sentence: 'I am lonely.' },
  { key: 'k7_023_hopeful', sentence: 'I am hopeful.' },
  { key: 'k7_024_frustrated', sentence: 'I am frustrated.' },
  { key: 'k7_025_relieved', sentence: 'I am relieved.' },
  { key: 'k7_026_disgusted', sentence: 'I am disgusted.' },
  { key: 'k7_027_shy', sentence: 'I am shy.' },
  { key: 'k7_028_jealous', sentence: 'I am jealous.' },
  { key: 'k7_029_peaceful', sentence: 'I am peaceful.' },
  { key: 'k7_030_angry', sentence: 'I am angry.' },
  { key: 'k7_031_happy', sentence: 'I am happy.' },
  { key: 'k7_032_sad', sentence: 'I am sad.' },
  { key: 'k7_033_very_happy', sentence: 'I am very happy.' },
  { key: 'k7_034_a_little_sad', sentence: 'I am a little sad.' },
  { key: 'k7_035_very_scared', sentence: 'I am very scared.' },
  { key: 'k7_036_a_little_scared', sentence: 'I am a little scared.' },
  { key: 'k7_037_so_excited', sentence: 'I am so excited.' },
  { key: 'k7_038_not_happy', sentence: 'I am not happy.' },
  { key: 'k7_039_surprised_and_happy', sentence: 'I am surprised and happy.' },
  { key: 'k7_040_tired_and_happy', sentence: 'I am tired and happy.' },
  { key: 'k7_041_feeling_good', sentence: 'I am feeling good.' },
  { key: 'k7_042_not_feeling_well', sentence: 'I am not feeling well.' },
  { key: 'k7_043_full', sentence: 'I am full.' },
  { key: 'k7_044_proud_of_myself', sentence: 'I am proud of myself.' },
  { key: 'k7_045_miss_someone', sentence: 'I miss someone.' },
  { key: 'k7_046_want_to_play', sentence: 'I want to play.' },
  { key: 'k7_047_dont_want_to', sentence: "I don't want to." },
  { key: 'k7_048_ouch', sentence: 'Ouch.' },
  { key: 'k7_049_yay', sentence: 'Yay!' },
  { key: 'k7_050_aww', sentence: 'Aww.' },
  { key: 'k7_051_uh_oh', sentence: 'Uh oh.' },
  { key: 'k7_052_no_no_no', sentence: 'No, no, no.' },
  { key: 'k7_053_yes_yes_yes', sentence: 'Yes, yes, yes.' },
  { key: 'k7_054_i_dont_know', sentence: "I don't know." },
  { key: 'k7_055_wow', sentence: 'Wow!' },
  { key: 'k7_056_sleepy', sentence: 'I feel sleepy.' },
  { key: 'k7_057_loving', sentence: 'I am loving.' },
  { key: 'k7_058_grumpy', sentence: 'I am grumpy.' },
  { key: 'k7_059_cozy', sentence: 'I feel cozy.' },
  { key: 'k7_060_peaceful', sentence: 'I am peaceful.' },
] as const;

const KID_PAGE7_KEYS = KID_PAGE7_SPECS.map((item) => item.key) as readonly string[];

function cleanText(value?: string | null): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function normalizePage7Key(value?: string | null): string {
  return cleanText(value).replace(/\.png$/i, '');
}

export function isPage7LessonKey(value?: string | null): boolean {
  return /^k7_\d+_/i.test(normalizePage7Key(value));
}

function toTitleCase(words: string[]): string {
  return words
    .map((word) => {
      if (word === 'i') return 'I';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function formatPage7WordsFromKey(key: string): string[] {
  const normalized = normalizePage7Key(key);
  if (!normalized) return [];

  const slug = normalized.replace(/^k7_\d+_/i, '');
  if (!slug) return [];

  return slug
    .split('_')
    .filter(Boolean)
    .map((word) => word.toLowerCase());
}

function toPage7Label(key: string): string {
  const words = formatPage7WordsFromKey(key);
  if (words.length === 0) return '';
  return toTitleCase(words);
}

function toPage7Sentence(key: string): string {
  const normalized = normalizePage7Key(key);
  if (!normalized) return '';

  return (
    KID_PAGE7_SPECS.find((item) => item.key === normalized)?.sentence ?? ''
  );
}

function toPage7Aliases(key: string): string[] {
  const normalized = normalizePage7Key(key);
  const words = formatPage7WordsFromKey(key);
  const phrase = words.join(' ');
  const sentence = toPage7Sentence(key)
    .toLowerCase()
    .replace(/[.!?]+$/g, '');

  const expandedAliases: string[] = [];

  if (normalized === 'k7_047_dont_want_to') {
    expandedAliases.push("don't want to");
  }

  if (normalized === 'k7_054_i_dont_know') {
    expandedAliases.push("i don't know", "don't know");
  }

  if (normalized === 'k7_051_uh_oh') {
    expandedAliases.push('uh-oh');
  }

  if (normalized === 'k7_052_no_no_no') {
    expandedAliases.push('no no no');
  }

  if (normalized === 'k7_053_yes_yes_yes') {
    expandedAliases.push('yes yes yes');
  }

  return Array.from(
    new Set(
      [
        normalized,
        ...words,
        phrase,
        phrase.replace(/\s+/g, '-'),
        sentence,
        ...expandedAliases,
      ].filter(Boolean),
    ),
  );
}

export const KID_PAGE7_LESSONS: KidPage7LessonCard[] = KID_PAGE7_SPECS.map(
  ({ key, sentence }) => ({
    key,
    label: toPage7Label(key),
    sentence,
    imageSrc: `/images/mercy-kids-page-7/${key}.png`,
    aliases: toPage7Aliases(key),
  }),
);

export function getPage7LessonByKey(
  key?: string | null,
): KidPage7LessonCard | null {
  if (!isPage7LessonKey(key)) return null;

  const normalized = normalizePage7Key(key);
  if (!normalized) return null;

  return KID_PAGE7_LESSONS.find((item) => item.key === normalized) ?? null;
}