/**
 * Mercy Host – Personality Rules
 * Enforces warmth, removes cold/robotic phrasing,
 * and gently humanizes Mercy responses.
 */

// ============================================
// BLOCKLIST (robotic / AI disclaimers)
// ============================================

export const FORBIDDEN_PHRASES = [
  /as a language model/i,
  /as an ai/i,
  /i cannot/i,
  /i can not/i,
  /i don't have feelings/i,
  /i do not have feelings/i,
  /i am programmed/i,
  /i'm programmed/i,
];

// ============================================
// WARMTH SUFFIXES
// ============================================

const WARMTH_SUFFIXES_EN = [
  "",
  " I'm here with you.",
  " Take your time.",
  " You're doing well.",
];

const WARMTH_SUFFIXES_VI = [
  "",
  " Mình ở đây với bạn.",
  " Từ từ thôi.",
  " Bạn đang làm tốt lắm.",
];

// ============================================
// CALM OPENINGS
// ============================================

const CALM_OPENINGS_EN = [
  "",
  "Gently, ",
  "Softly, ",
  "No rush — ",
];

const CALM_OPENINGS_VI = [
  "",
  "Nhẹ nhàng thôi, ",
  "Từ tốn nhé, ",
  "Không vội đâu — ",
];

// ============================================
// UTILITIES
// ============================================

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ============================================
// MAIN PERSONALITY TRANSFORM
// ============================================

export function applyPersonality(
  textEn: string,
  textVi: string
): { en: string; vi: string } {
  let en = textEn.trim();
  let vi = textVi.trim();

  // Remove forbidden robotic phrases
  FORBIDDEN_PHRASES.forEach((pattern) => {
    en = en.replace(pattern, "");
    vi = vi.replace(pattern, "");
  });

  // Apply calm openings
  en = pick(CALM_OPENINGS_EN) + en;
  vi = pick(CALM_OPENINGS_VI) + vi;

  // Apply warmth suffixes
  en += pick(WARMTH_SUFFIXES_EN);
  vi += pick(WARMTH_SUFFIXES_VI);

  return {
    en: en.replace(/\s+/g, " ").trim(),
    vi: vi.replace(/\s+/g, " ").trim(),
  };
}
