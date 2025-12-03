/**
 * Companion Lines Utility
 * Loads and provides random lines for the Companion Friend Mode
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
  | 'nextRoomSuggestion';

type CompanionLinesData = Record<CompanionCategory, string[]>;

let cachedLines: CompanionLinesData | null = null;
let loadPromise: Promise<CompanionLinesData> | null = null;

async function loadCompanionLines(): Promise<CompanionLinesData> {
  if (cachedLines) return cachedLines;
  
  if (loadPromise) return loadPromise;
  
  loadPromise = fetch('/data/companion_lines_friend_en.json')
    .then((res) => res.json())
    .then((data: CompanionLinesData) => {
      cachedLines = data;
      return data;
    })
    .catch((err) => {
      console.error('Failed to load companion lines:', err);
      // Return fallback
      return getDefaultLines();
    });
  
  return loadPromise;
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
  };
}

/**
 * Get a random companion line for the given category
 * Returns synchronously if lines are cached, otherwise returns a default
 */
export function getRandomCompanionLine(category: CompanionCategory): string {
  const lines = cachedLines || getDefaultLines();
  const categoryLines = lines[category];
  
  if (!categoryLines || categoryLines.length === 0) {
    return "I'm here with you.";
  }
  
  const randomIndex = Math.floor(Math.random() * categoryLines.length);
  return categoryLines[randomIndex];
}

/**
 * Preload companion lines (call early in app lifecycle)
 */
export function preloadCompanionLines(): void {
  loadCompanionLines();
}

/**
 * Get line with async loading guarantee
 */
export async function getRandomCompanionLineAsync(category: CompanionCategory): Promise<string> {
  const lines = await loadCompanionLines();
  const categoryLines = lines[category];
  
  if (!categoryLines || categoryLines.length === 0) {
    return 'I'm here with you.';
  }
  
  const randomIndex = Math.floor(Math.random() * categoryLines.length);
  return categoryLines[randomIndex];
}
