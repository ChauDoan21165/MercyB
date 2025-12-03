/**
 * Mercy Reply Library - loads and serves cached replies to avoid repeated TTS calls
 */

export type MercyReplyId =
  | "greeting_return_short_break"
  | "greeting_return_long_break"
  | "greeting_first_time"
  | "praise_show_up"
  | "praise_completed_session"
  | "praise_consistency"
  | "breathing_intro"
  | "breathing_complete"
  | "calm_heavy_mood"
  | "calm_encouragement"
  | "suggestion_calm_mind"
  | "suggestion_continue_path"
  | "end_session_gentle"
  | "end_session_proud"
  | "english_coach_start"
  | "pronunciation_praise_good"
  | "pronunciation_praise_try"
  | "teacher_yesterday_studied"
  | "teacher_no_yesterday"
  | "teacher_today_start";

export type MercyReplyCategory =
  | "greeting"
  | "praise"
  | "breathing"
  | "calm"
  | "suggestion"
  | "end_of_session"
  | "english_coach"
  | "pronunciation_praise"
  | "teacher_yesterday_today";

export interface MercyReply {
  id: MercyReplyId;
  category: MercyReplyCategory;
  context: string;
  text_en: string;
  text_vi: string;
  audio_en?: string;
  audio_vi?: string;
}

export type MercyReplyLibrary = Record<MercyReplyId, MercyReply>;

// In-memory cache
let libraryCache: MercyReplyLibrary | null = null;
let loadPromise: Promise<MercyReplyLibrary> | null = null;

/**
 * Load the mercy reply library (cached after first load)
 */
export async function loadMercyReplyLibrary(): Promise<MercyReplyLibrary> {
  if (libraryCache) {
    return libraryCache;
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = fetch('/data/mercy_reply_library.json')
    .then(res => {
      if (!res.ok) {
        throw new Error(`Failed to load mercy reply library: ${res.status}`);
      }
      return res.json();
    })
    .then((data: MercyReplyLibrary) => {
      libraryCache = data;
      return data;
    })
    .catch(err => {
      console.error('Failed to load mercy reply library:', err);
      loadPromise = null;
      throw err;
    });

  return loadPromise;
}

/**
 * Get a specific mercy reply by ID
 */
export async function getMercyReply(id: MercyReplyId): Promise<MercyReply | null> {
  try {
    const library = await loadMercyReplyLibrary();
    return library[id] || null;
  } catch {
    return null;
  }
}

/**
 * Get audio path for a mercy reply (synchronous if library is loaded)
 */
export function getMercyAudioPath(id: MercyReplyId, lang: 'en' | 'vi'): string | undefined {
  if (!libraryCache) {
    return undefined;
  }
  const reply = libraryCache[id];
  if (!reply) {
    return undefined;
  }
  return lang === 'en' ? reply.audio_en : reply.audio_vi;
}

/**
 * Get mercy reply synchronously (only works if library is already loaded)
 */
export function getMercyReplySync(id: MercyReplyId): MercyReply | null {
  if (!libraryCache) {
    return null;
  }
  return libraryCache[id] || null;
}

/**
 * Get all replies by category
 */
export async function getMercyRepliesByCategory(category: MercyReplyCategory): Promise<MercyReply[]> {
  try {
    const library = await loadMercyReplyLibrary();
    return Object.values(library).filter(reply => reply.category === category);
  } catch {
    return [];
  }
}

/**
 * Check if library is loaded
 */
export function isMercyLibraryLoaded(): boolean {
  return libraryCache !== null;
}

/**
 * Preload the library (call early in app lifecycle)
 */
export function preloadMercyLibrary(): void {
  loadMercyReplyLibrary().catch(() => {
    // Silent fail on preload
  });
}
