export interface PronunciationFeedback {
  type: "pronunciation_feedback";
  tier_depth: "short" | "medium" | "high";
  sentence: string;
  ipa: string | null;
  stress_pattern: string | null;
  intonation: string | null;
  key_corrections: {
    issue: string;
    fix: string;
  }[];
  sound_breakdown: {
    sound: string;
    word: string;
    description: string;
  }[];
  mouth_guidance: {
    sound: string;
    tip: string;
  }[];
  common_accent_notes: string[];
  minimal_pairs: {
    word1: string;
    word2: string;
  }[];
  drills: string[];
  next_action: string;
}