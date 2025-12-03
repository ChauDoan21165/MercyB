/**
 * Companion Lines Utility
 * Loads and provides random lines for the Companion Friend Mode
 * Supports EN and VI languages
 */

export type CompanionCategory =
  | 'greeting'
  | 'audioIntro'
  | 'postAudio'
  | 'reflectionHint'
  | 'reflectionThanks'
  | 'pathProgress'
  | 'returnAfterGap_short'
  | 'returnAfterGap_long'
  | 'moodFollowup_heavy'
  | 'moodFollowup_okay'
  | 'nextRoomSuggestion'
  | 'voiceQuiet';

type CompanionLinesData = Record<CompanionCategory, string[]>;

// Cache for both languages
const cachedLines: Record<string, CompanionLinesData> = {};
const loadPromises: Record<string, Promise<CompanionLinesData>> = {};

/**
 * Get current app language from localStorage or default to 'en'
 */
export function getAppLanguage(): 'en' | 'vi' {
  const stored = localStorage.getItem('app_language');
  return stored === 'vi' ? 'vi' : 'en';
}

/**
 * Set app language
 */
export function setAppLanguage(lang: 'en' | 'vi'): void {
  localStorage.setItem('app_language', lang);
}

async function loadCompanionLines(lang: 'en' | 'vi' = 'en'): Promise<CompanionLinesData> {
  const cacheKey = lang;
  
  if (cachedLines[cacheKey]) return cachedLines[cacheKey];
  if (loadPromises[cacheKey]) return loadPromises[cacheKey];
  
  const filename = lang === 'vi' 
    ? '/data/companion_lines_friend_vi.json'
    : '/data/companion_lines_friend_en.json';
  
  loadPromises[cacheKey] = fetch(filename)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load ${filename}`);
      return res.json();
    })
    .then((data: CompanionLinesData) => {
      cachedLines[cacheKey] = data;
      return data;
    })
    .catch((err) => {
      console.warn(`Failed to load companion lines for ${lang}:`, err);
      // Fall back to English if Vietnamese fails
      if (lang === 'vi' && cachedLines['en']) {
        return cachedLines['en'];
      }
      return getDefaultLines();
    });
  
  return loadPromises[cacheKey];
}

function getDefaultLines(): CompanionLinesData {
  return {
    greeting: ["Welcome back."],
    audioIntro: ["Press play to listen."],
    postAudio: ["Nice job finishing that."],
    reflectionHint: ["What stayed with you?"],
    reflectionThanks: ["Thanks for sharing."],
    pathProgress: ["One more step forward."],
    returnAfterGap_short: ["Good to see you."],
    returnAfterGap_long: ["Welcome back after a while."],
    moodFollowup_heavy: ["Heavy days are allowed."],
    moodFollowup_okay: ["Okay is good enough."],
    nextRoomSuggestion: ["Ready for the next room?"],
    voiceQuiet: ["Today my voice is a bit quiet, but I'm still here with you."],
  };
}

/**
 * Get a random companion line for the given category
 * Uses current app language
 */
export function getRandomCompanionLine(category: CompanionCategory): string {
  const lang = getAppLanguage();
  const lines = cachedLines[lang] || cachedLines['en'] || getDefaultLines();
  const categoryLines = lines[category];
  
  if (!categoryLines || categoryLines.length === 0) {
    return "I'm here with you.";
  }
  
  const randomIndex = Math.floor(Math.random() * categoryLines.length);
  return categoryLines[randomIndex];
}

/**
 * Preload companion lines for both languages
 */
export function preloadCompanionLines(): void {
  loadCompanionLines('en');
  loadCompanionLines('vi');
}

/**
 * Get line with async loading guarantee
 * Uses current app language
 */
export async function getRandomCompanionLineAsync(category: CompanionCategory): Promise<string> {
  const lang = getAppLanguage();
  
  try {
    const lines = await loadCompanionLines(lang);
    const categoryLines = lines[category];
    
    if (!categoryLines || categoryLines.length === 0) {
      return "I'm here with you.";
    }
    
    const randomIndex = Math.floor(Math.random() * categoryLines.length);
    return categoryLines[randomIndex];
  } catch {
    // Graceful fallback
    const defaults = getDefaultLines();
    const categoryLines = defaults[category];
    if (!categoryLines || categoryLines.length === 0) {
      return "I'm here with you.";
    }
    return categoryLines[Math.floor(Math.random() * categoryLines.length)];
  }
}

/**
 * Get the "voice quiet" fallback line for when TTS fails
 */
export function getVoiceQuietLine(): string {
  return getRandomCompanionLine('voiceQuiet');
}
