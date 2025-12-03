/**
 * Mercy module - centralized exports for the Mercy reply system
 */

// Reply library
export {
  type MercyReplyId,
  type MercyReplyCategory,
  type MercyReply,
  type MercyReplyLibrary,
  loadMercyReplyLibrary,
  getMercyReply,
  getMercyAudioPath,
  getMercyReplySync,
  getMercyRepliesByCategory,
  isMercyLibraryLoaded,
  preloadMercyLibrary,
} from './replies';

// TTS Cache
export {
  ensureMercyAudio,
  hasMercyAudio,
  getMercyContent,
  getMercyBilingualContent,
} from './ttsCache';

// Brain (decision logic)
export {
  type MercyContext,
  getGreetingReplyId,
  getPraiseReplyId,
  getBreathingReplyId,
  getCalmReplyId,
  getSuggestionReplyId,
  getEndSessionReplyId,
  getEnglishCoachReplyId,
  getPronunciationPraiseReplyId,
  getTeacherReplyId,
  buildMercyContext,
} from './brain';
