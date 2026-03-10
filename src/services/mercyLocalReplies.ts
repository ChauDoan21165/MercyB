// src/services/mercyLocalReplies.ts

export type RegionalOrigin = 'HANOI' | 'SAIGON' | 'OTHER';
export type RoomTier = 'FREE' | 'VIP1' | 'VIP2' | 'VIP3';

interface MercyFeedback {
  text: string;
  actionHint: string; // Used for UI buttons like "Try R Sound"
  audioKey?: string;  // Link to a specific "Mercy" warmth audio clip
}

const FEEDBACK_LIBRARY: Record<string, Record<RegionalOrigin, string>> = {
  MISSING_FINAL_S: {
    SAIGON: "You're doing great! In the South, we often skip the final 'S', but for this word, let's try to make it hiss.",
    HANOI: "Focus on that final 'S'—keep it sharp and clear.",
    OTHER: "Don't forget the final 'S'! It's the secret to being understood clearly."
  },
  R_Z_CONFUSION: {
    HANOI: "Careful with that 'R'. In the North, it often sounds like 'Z'. Try rounding your lips more.",
    SAIGON: "Make sure your 'R' is strong and vibrating, not swallowed.",
    OTHER: "The 'R' sound needs more curve in the tongue. Try again?"
  },
  VOWEL_FLATTENING: {
    SAIGON: "You're flattening the vowel a bit—open your mouth wider for this one.",
    HANOI: "Try to let this vowel resonate a bit longer.",
    OTHER: "The vowel sound is the heart of this word. Let's try to brighten it."
  }
};

export function getMercyReply(
  errorCode: string,
  origin: RegionalOrigin,
  tier: RoomTier
): MercyFeedback {
  // 1. Get the regional specific text
  const baseText = FEEDBACK_LIBRARY[errorCode]?.[origin] || "That was close! Let's try one more time.";

  // 2. Adjust "Tone" based on Tier (VIP3 is more direct/professional)
  let finalMessage = baseText;
  if (tier === 'VIP3') {
    finalMessage = finalMessage.replace("You're doing great!", "Good attempt.");
  }

  return {
    text: finalMessage,
    actionHint: errorCode.toLowerCase().replace('_', '-'),
    audioKey: `warmth_${errorCode.toLowerCase()}_${origin.toLowerCase()}`
  };
}