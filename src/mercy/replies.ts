/**
 * Mercy Reply Library - loads and serves cached replies to avoid repeated TTS calls
 */

export type MercyReplyId =
  // Greetings
  | "greeting_return_short_break"
  | "greeting_return_long_break"
  | "greeting_first_time"
  | "greeting_new_day"
  | "greeting_morning"
  | "greeting_evening"
  // Praise
  | "praise_show_up"
  | "praise_small_step"
  | "praise_effort"
  | "praise_completed_session"
  | "praise_consistency"
  | "praise_pronunciation_attempt"
  // Breathing
  | "breathing_intro"
  | "breathing_step_1"
  | "breathing_step_2"
  | "breathing_step_3"
  | "breathing_complete"
  // Calm
  | "calm_heavy_mood"
  | "calm_encouragement"
  | "calm_presence_1"
  | "calm_presence_2"
  // Reframe
  | "reframe_soft_1"
  | "reframe_soft_2"
  | "reframe_soft_3"
  // Suggestion
  | "suggestion_calm_mind"
  | "suggestion_continue_path"
  | "suggestion_today_path"
  | "suggestion_soft_room"
  // End of session
  | "end_session_gentle"
  | "end_session_proud"
  | "session_end_soft"
  | "session_end_focus"
  // English coach
  | "english_coach_start"
  | "english_intro"
  | "english_word_repeat"
  | "english_pronunciation_tip"
  // Pronunciation praise
  | "pronunciation_praise_good"
  | "pronunciation_praise_try"
  | "pronunciation_soft_correct_1"
  | "pronunciation_soft_correct_2"
  | "pronunciation_soft_praise"
  // Teacher
  | "teacher_yesterday_studied"
  | "teacher_no_yesterday"
  | "teacher_today_start"
  | "teacher_today_plan"
  // Discipline
  | "discipline_soft_focus"
  | "discipline_gentle_effort"
  | "discipline_soft_reset"
  // Reflection
  | "reflection_intro"
  | "reflection_soft_prompt_1"
  | "reflection_soft_prompt_2"
  // Comeback
  | "comeback_gentle"
  | "comeback_encouragement"
  // Study
  | "study_start_gentle"
  | "study_complete_praise"
  // Encouragement
  | "encouragement_tired"
  | "encouragement_stuck"
  | "encouragement_doubt"
  // Mindfulness
  | "mindfulness_start"
  | "mindfulness_body_scan"
  // Gratitude
  | "gratitude_prompt"
  | "gratitude_acknowledge"
  // Transition
  | "transition_next_topic"
  | "transition_pause"
  // Closing
  | "night_closing"
  | "general_closing";

export type MercyReplyCategory =
  | "greeting"
  | "praise"
  | "breathing"
  | "calm"
  | "reframe"
  | "suggestion"
  | "end_of_session"
  | "session"
  | "english_coach"
  | "english"
  | "pronunciation_praise"
  | "pronunciation"
  | "teacher_yesterday_today"
  | "teacher"
  | "discipline"
  | "reflection"
  | "comeback"
  | "study"
  | "encouragement"
  | "mindfulness"
  | "gratitude"
  | "transition"
  | "closing";

export interface MercyReply {
  id: MercyReplyId;
  category: MercyReplyCategory;
  context?: string;
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

/**
 * Get a random reply from a category
 */
export async function getRandomMercyReply(category: MercyReplyCategory): Promise<MercyReply | null> {
  const replies = await getMercyRepliesByCategory(category);
  if (replies.length === 0) return null;
  return replies[Math.floor(Math.random() * replies.length)];
}
