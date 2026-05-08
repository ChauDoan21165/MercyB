import type { KidsObjectCard, KidsLessonCard } from '../types';

export const KIDS_OBJECT_KEYS = [
  'airplane','apple','bag','ball','banana','bathtub','bed','bicycle','bird','blanket',
  'boat','book','bottle','bus','cat','chair','clock','cloud','cup','dog',
  'doll','door','duck','fish','flower','hat','house','key','leaf','milk',
  'moon','orange','pencil','phone','pillow','plate','rainbow','shirt','shoes','soap',
  'sock','spoon','star','sun','table','teddy-bear','toothbrush','toy-car','tree','window',
  'ant','baby-bib','backpack','balloon','bee','bell','block','butterfly','cake','candle',
  'carrot','cookie','cow','crayon','dinosaur','elephant','envelope','frog','gift-box','grapes',
  'hammer','helicopter','ice-cream','jar','kite','lamp','lion','lollipop','monkey','mouse',
  'mushroom','pear','pig','pizza','rabbit','rocket','sandwich','sheep','strawberry','train',
  'truck','turtle','watermelon','whistle','mitten','scarf','drum','bear-face','juice-box','juice',
] as const;

export const KIDS_UNCOUNTABLE_KEYS = new Set<string>(['milk','soap','juice','ice-cream']);

export const KIDS_EXTRA_ALIASES: Record<string, string[]> = {
  'teddy-bear': ['teddy bear', 'bear'],
  'toy-car': ['toy car', 'car'],
  'baby-bib': ['baby bib', 'bib'],
  backpack: ['back pack'],
  'gift-box': ['gift box', 'gift'],
  'ice-cream': ['ice cream'],
  'juice-box': ['juice box'],
  'bear-face': ['bear face', 'bear'],
};

export function toKidsLabel(key: string): string {
  return key.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

export function startsWithVowelSound(text: string): boolean {
  return /^[aeiou]/i.test(text.trim());
}

export function toKidsSentence(key: string): string {
  const lowerLabel = toKidsLabel(key).toLowerCase();
  if (KIDS_UNCOUNTABLE_KEYS.has(key)) return `This is ${lowerLabel}.`;
  return `This is ${startsWithVowelSound(lowerLabel) ? 'an' : 'a'} ${lowerLabel}.`;
}

export function toKidsAliases(key: string): string[] {
  const normalized = key.replace(/-/g, ' ');
  const label = toKidsLabel(key).toLowerCase();
  const extra = KIDS_EXTRA_ALIASES[key] ?? [];
  return Array.from(new Set([key, normalized, label, ...extra]));
}

export const KIDS_OBJECTS: KidsObjectCard[] = KIDS_OBJECT_KEYS.map((key) => ({
  key,
  label: toKidsLabel(key),
  sentence: toKidsSentence(key),
  imageSrc: `/images/mercy-kids/${key}.jpg`,
  aliases: toKidsAliases(key),
}));

export function cleanText(value?: string | null): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

export function normalizeForCompare(value: string): string {
  return cleanText(value).toLowerCase().replace(/[.,!?;:()[\]"''`-]/g, '').replace(/\s+/g, ' ').trim();
}

export function normalizeKidsLookup(value: string): string {
  return cleanText(value).toLowerCase().replace(/-/g, ' ');
}

export function isLikelyKidsSentence(value: string): boolean {
  const text = cleanText(value);
  if (!text) return false;
  const words = normalizeForCompare(text).split(' ').filter(Boolean);
  if (words.length === 0 || words.length > 8) return false;
  if (/[.!?].+[.!?]/.test(text)) return false;
  return /^this is\b/i.test(text) || /^it is\b/i.test(text);
}

export function getKidsObjectFromSentence(value: string): KidsObjectCard {
  const normalized = normalizeKidsLookup(value);
  if (!normalized) return KIDS_OBJECTS[0];
  const found = KIDS_OBJECTS.find((item) => item.aliases.some((alias) => normalized.includes(alias)));
  return found ?? KIDS_OBJECTS[0];
}

export function getKidsObjectByKey(key?: string | null): KidsObjectCard | null {
  if (!key) return null;
  return KIDS_OBJECTS.find((item) => item.key === key) ?? null;
}

// Page 2 helpers
export function normalizePage2Key(value?: string | null): string {
  return cleanText(value).replace(/\.png$/i, '');
}

export function isPage2LessonKey(value?: string | null): boolean {
  return /^p2_\d+_/i.test(normalizePage2Key(value));
}

export function toPage2Label(key: string): string {
  const base = formatPage2TextFromKey(key);
  return base.replace(/[.!?]+$/g, '');
}

export function toPage2Sentence(key: string): string {
  const base = formatPage2TextFromKey(key);
  if (!base) return '';
  if (/^What is this /i.test(base)) {
    const objectPart = base.replace(/^What is this /i, '').trim();
    const titledObject = objectPart.charAt(0).toUpperCase() + objectPart.slice(1);
    return titledObject ? `What is this? ${titledObject}.` : 'What is this?';
  }
  return /[.!?]$/.test(base) ? base : `${base}.`;
}

function formatPage2TextFromKey(key: string): string {
  const normalized = normalizePage2Key(key);
  if (!normalized) return '';
  const slug = normalized.replace(/^p2_\d+_/i, '');
  if (!slug) return '';
  const words = slug.split('_').filter(Boolean).map((word) => {
    const lower = word.toLowerCase();
    if (lower === 'i') return 'I';
    if (lower === 'youre') return "you're";
    if (lower === 'lets') return "let's";
    return lower;
  });
  if (words.length === 0) return '';
  const text = words.join(' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Page 3 helpers
export function normalizePage3Key(value?: string | null): string {
  return cleanText(value).replace(/\.png$/i, '');
}

export function isPage3LessonKey(value?: string | null): boolean {
  return /^k\d+_/i.test(normalizePage3Key(value));
}

export function toPage3Label(key: string): string {
  const base = formatPage3TextFromKey(key);
  return base.replace(/[.!?]+$/g, '');
}

export function toPage3Sentence(key: string): string {
  const base = formatPage3TextFromKey(key);
  if (!base) return '';
  if (/^What |^How |^Where |^Which |^Can |^Do /i.test(base)) {
    return /[?]$/.test(base) ? base : `${base}?`;
  }
  return /[.!?]$/.test(base) ? base : `${base}.`;
}

function formatPage3TextFromKey(key: string): string {
  const normalized = normalizePage3Key(key);
  if (!normalized) return '';
  const slug = normalized.replace(/^k\d+_/i, '');
  if (!slug) return '';
  const words = slug.split('_').filter(Boolean).map((word) => {
    const lower = word.toLowerCase();
    if (lower === 'i') return 'I';
    if (lower === 'im') return "I'm";
    if (lower === 'youre') return "you're";
    if (lower === 'lets') return "let's";
    if (lower === 'dont') return "don't";
    return lower;
  });
  if (words.length === 0) return '';
  const text = words.join(' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function toPhraseSentence(label: string): string {
  const base = cleanText(label);
  if (!base) return '';
  return /[.!?]$/.test(base) ? base : `${base}.`;
}

export function matchesPageKeyPrefix(key: string | null | undefined, pageNumber: number): key is string {
  const normalized = cleanText(key);
  if (!normalized) return false;
  return new RegExp(`^k${pageNumber}_`, 'i').test(normalized);
}

export function makePageLessonGetter(
  pageNumber: number,
  getItem: (key: string | null | undefined) => { key: string; label: string; image: string; dialogue?: string[] } | null | undefined
) {
  return function getLessonByKey(key?: string | null): KidsLessonCard | null {
    if (!matchesPageKeyPrefix(key, pageNumber)) return null;
    const item = getItem(key);
    if (!item) return null;
    return {
      key: item.key,
      label: item.label,
      sentence: item.dialogue ? item.dialogue[0] : toPhraseSentence(item.label),
      imageSrc: item.image,
      dialogue: item.dialogue,
    };
  };
}

export function playKidsUiSound(level: 'good' | 'great' | 'wow') {
  if (typeof window === 'undefined') return;
  const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextCtor) return;
  const ctx = new AudioContextCtor();
  void ctx.resume?.();
  const config = level === 'good' ? { notes: [587.33, 659.25, 783.99], duration: 0.12, gap: 0.08, gain: 0.04, type: 'sine' as const } :
                level === 'great' ? { notes: [659.25, 783.99, 987.77, 1318.51], duration: 0.14, gap: 0.08, gain: 0.045, type: 'triangle' as const } :
                                    { notes: [523.25, 783.99, 1046.5, 1318.51, 1567.98], duration: 0.15, gap: 0.07, gain: 0.05, type: 'triangle' as const };

  config.notes.forEach((frequency, index) => {
    const start = ctx.currentTime + 0.02 + index * config.gap;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(config.gain, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + config.duration);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(start);
    oscillator.stop(start + config.duration + 0.02);
  });

  setTimeout(() => ctx.close().catch(() => {}), 900);
}
