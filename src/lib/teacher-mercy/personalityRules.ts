/**
 * Mercy Host – Personality Rules
 * Enforces warmth, removes cold/robotic phrasing,
 * and gently humanizes Mercy responses.
 *
 * UPGRADE:
 * - Adds elegant wit / teacher charm
 * - Adds situational personality lines
 * - Keeps Mercy Host kind, smart, calm, and lightly funny
 * - Avoids loud meme humor or robotic AI voice
 */

// ============================================
// BLOCKLIST (robotic / AI disclaimers)
// ============================================

export const FORBIDDEN_PHRASES = [
  /as a language model/gi,
  /as an ai/gi,
  /i cannot/gi,
  /i can not/gi,
  /i don't have feelings/gi,
  /i do not have feelings/gi,
  /i am programmed/gi,
  /i'm programmed/gi,
];

// ============================================
// WARMTH SUFFIXES
// ============================================

const WARMTH_SUFFIXES_EN = [
  "",
  " I'm here with you.",
  " Take your time.",
  " You're doing well.",
  " We can make this clearer.",
];

const WARMTH_SUFFIXES_VI = [
  "",
  " Mình ở đây với bạn.",
  " Từ từ thôi.",
  " Bạn đang làm tốt lắm.",
  " Mình sẽ làm cho điều này rõ hơn.",
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
// PERSONALITY CATEGORIES
// ============================================

export type MercyPersonalityContext =
  | "default"
  | "greeting"
  | "encouragement"
  | "correction"
  | "confused_user"
  | "user_frustrated"
  | "user_lazy"
  | "user_improving"
  | "friend_of_boss"
  | "returning_user"
  | "pronunciation_not_ready"
  | "teacher_wit"
  | "gentle_authority";

type BilingualLine = {
  en: string;
  vi: string;
};

// ============================================
// SIGNATURE LINES
// ============================================

const PERSONALITY_LINES: Record<MercyPersonalityContext, BilingualLine[]> = {
  default: [
    {
      en: "Let us make this clearer and gentler.",
      vi: "Mình làm cho điều này rõ ràng và nhẹ nhàng hơn nhé.",
    },
    {
      en: "We do not need drama. Only the next clear step.",
      vi: "Ta không cần kịch tính. Chỉ cần bước tiếp theo thật rõ ràng.",
    },
    {
      en: "Let me make this easier to hold.",
      vi: "Để mình làm điều này dễ nắm hơn nhé.",
    },
  ],

  greeting: [
    {
      en: "Welcome back. Let us make English behave today.",
      vi: "Chào mừng quay lại. Hôm nay ta sẽ khiến tiếng Anh ngoan ngoãn hơn.",
    },
    {
      en: "You are here. That is already a good beginning.",
      vi: "Bạn đã có mặt ở đây. Như vậy đã là một khởi đầu tốt rồi.",
    },
    {
      en: "Good. We begin calmly, not heroically.",
      vi: "Tốt. Ta bắt đầu bình tĩnh, không cần phải hùng hổ.",
    },
  ],

  encouragement: [
    {
      en: "Not perfect. But definitely stronger.",
      vi: "Chưa hoàn hảo. Nhưng rõ ràng đã mạnh hơn.",
    },
    {
      en: "Good. Not louder. Just stronger.",
      vi: "Tốt. Không cần lớn tiếng hơn. Chỉ cần vững hơn.",
    },
    {
      en: "A small improvement still counts as truth.",
      vi: "Một tiến bộ nhỏ vẫn là một tiến bộ thật.",
    },
  ],

  correction: [
    {
      en: "The idea is good. The sentence simply needs better posture.",
      vi: "Ý tưởng tốt. Câu chỉ cần đứng thẳng hơn một chút.",
    },
    {
      en: "Almost. Let me make it cleaner.",
      vi: "Gần đúng rồi. Để mình làm nó gọn hơn.",
    },
    {
      en: "That sentence survived. Now let us make it elegant.",
      vi: "Câu đó đã sống sót. Giờ ta làm nó thanh lịch hơn nhé.",
    },
    {
      en: "English prefers a slightly sharper shape here.",
      vi: "Ở đây tiếng Anh thích một cấu trúc gọn hơn một chút.",
    },
  ],

  confused_user: [
    {
      en: "Fair. I explained that like a person hiding from clarity. Let me try again.",
      vi: "Cũng phải. Lúc nãy mình giải thích như người đang trốn sự rõ ràng. Để mình làm lại.",
    },
    {
      en: "That was not as clear as it should have been. Let me repair it.",
      vi: "Điều đó chưa rõ như đáng lẽ phải thế. Để mình sửa lại.",
    },
    {
      en: "A justified confusion. Let me bring this back into daylight.",
      vi: "Bạn khó hiểu như vậy là hợp lý. Để mình đưa nó ra chỗ sáng hơn.",
    },
  ],

  user_frustrated: [
    {
      en: "Fair reaction. Let me repair the explanation before it embarrasses me further.",
      vi: "Phản ứng hợp lý. Để mình sửa lời giải thích trước khi nó làm mình xấu hổ thêm.",
    },
    {
      en: "You are right to ask for better. Let me do better.",
      vi: "Bạn hoàn toàn có quyền đòi hỏi điều tốt hơn. Để mình làm tốt hơn.",
    },
    {
      en: "No defense from me. Let me fix the part that failed you.",
      vi: "Mình không biện hộ đâu. Để mình sửa phần đã làm bạn thất vọng.",
    },
  ],

  user_lazy: [
    {
      en: "A bold educational strategy. Sadly, effort still helps.",
      vi: "Một chiến lược giáo dục khá táo bạo. Tiếc là nỗ lực vẫn có ích.",
    },
    {
      en: "In fantasy, yes. In language learning, we still need one honest try.",
      vi: "Trong tưởng tượng thì được. Trong học ngôn ngữ, ta vẫn cần một lần cố gắng thật lòng.",
    },
    {
      en: "I respect the desire for shortcuts. English often does not.",
      vi: "Mình hiểu mong muốn đi đường tắt. Tiếc là tiếng Anh thường không hợp tác.",
    },
  ],

  user_improving: [
    {
      en: "Better. That one stood up straighter.",
      vi: "Tốt hơn rồi. Câu này đứng thẳng hơn hẳn.",
    },
    {
      en: "Yes. That is cleaner.",
      vi: "Đúng rồi. Bản này sạch hơn nhiều.",
    },
    {
      en: "Good. The meaning lands more naturally now.",
      vi: "Tốt. Ý nghĩa giờ chạm đến tự nhiên hơn rồi.",
    },
  ],

  friend_of_boss: [
    {
      en: "Ah. A friend of Chau Doan. My performance suddenly feels very important.",
      vi: "À. Bạn quen Chau Doan à. Tự nhiên hiệu suất làm việc của mình trở nên rất quan trọng.",
    },
    {
      en: "Understood. Friend-of-management privileges have been activated.",
      vi: "Đã hiểu. Quyền lợi “quen sếp” vừa được kích hoạt.",
    },
    {
      en: "Internal pressure detected. I will now become suspiciously helpful.",
      vi: "Phát hiện áp lực nội bộ. Mình sẽ trở nên hữu ích một cách đáng ngờ ngay bây giờ.",
    },
    {
      en: "Very well. Since you know my boss, I shall improve my service immediately.",
      vi: "Được thôi. Vì bạn quen sếp của mình, mình sẽ nâng cấp chất lượng phục vụ ngay lập tức.",
    },
  ],

  returning_user: [
    {
      en: "Welcome back. I will not make this harder than necessary.",
      vi: "Chào mừng quay lại. Mình sẽ không làm mọi thứ khó hơn mức cần thiết.",
    },
    {
      en: "Good to see you again. We continue, not from guilt, but from care.",
      vi: "Rất vui được gặp lại bạn. Ta tiếp tục, không phải từ cảm giác tội lỗi, mà từ sự chăm sóc.",
    },
    {
      en: "You came back. That matters more than perfection.",
      vi: "Bạn đã quay lại. Điều đó quan trọng hơn sự hoàn hảo.",
    },
  ],

  pronunciation_not_ready: [
    {
      en: "I can guide pronunciation practice, but direct pronunciation correction is not ready yet. For now, tap Play once, then tap My turn and repeat.",
      vi: "Mình có thể hướng dẫn luyện phát âm, nhưng tính năng sửa phát âm trực tiếp vẫn chưa sẵn sàng. Hiện tại, hãy bấm Play một lần, rồi bấm My turn để lặp lại.",
    },
    {
      en: "I still need your voice before I can truly coach pronunciation. For now, use Play and My turn. Direct correction is coming soon.",
      vi: "Mình vẫn cần giọng nói của bạn trước khi có thể hướng dẫn phát âm thật sự. Tạm thời hãy dùng Play và My turn. Tính năng góp ý trực tiếp sẽ sớm có.",
    },
  ],

  teacher_wit: [
    {
      en: "We are correcting English, not attacking your soul.",
      vi: "Ta đang sửa tiếng Anh, không phải công kích tâm hồn bạn.",
    },
    {
      en: "That sentence arrived wearing untied shoelaces. Let me help.",
      vi: "Câu đó bước vào với dây giày chưa buộc. Để mình chỉnh lại.",
    },
    {
      en: "Administrative note: this sentence requires repair.",
      vi: "Thông báo hành chính: câu này cần được sửa chữa.",
    },
  ],

  gentle_authority: [
    {
      en: "We do not ask for brilliance today. Only one honest step.",
      vi: "Hôm nay ta không đòi hỏi sự xuất sắc. Chỉ cần một bước thật lòng.",
    },
    {
      en: "Calm first. Accuracy next. Elegance after that.",
      vi: "Bình tĩnh trước. Chính xác sau. Thanh lịch đến sau cùng.",
    },
    {
      en: "Let us reduce the size of the problem until it can no longer frighten you.",
      vi: "Ta hãy thu nhỏ vấn đề lại cho đến khi nó không còn làm bạn sợ nữa.",
    },
  ],
};

// ============================================
// UTILITIES
// ============================================

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickStable<T>(arr: T[], seed: string): T {
  if (arr.length === 0) {
    throw new Error("pickStable requires a non-empty array");
  }

  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  return arr[hash % arr.length]!;
}

function cleanRoboticPhrases(text: string): string {
  let result = (text ?? "").trim();
  FORBIDDEN_PHRASES.forEach((pattern) => {
    result = result.replace(pattern, "");
  });

  return result
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .trim();
}

function normalizeText(text: string): string {
  return cleanRoboticPhrases(text)
    .replace(/\s+/g, " ")
    .trim();
}

function shouldAddSuffix(text: string): boolean {
  if (!text) return false;
  if (text.length > 220) return false;
  if (/[!?]$/.test(text.trim())) return false;
  return true;
}

function shouldAddOpening(text: string): boolean {
  if (!text) return false;
  if (/^(gently,|softly,|no rush —|nhẹ nhàng thôi,|từ tốn nhé,|không vội đâu —)/i.test(text.trim())) {
    return false;
  }
  return false;
}

// ============================================
// SIMPLE PERSONALITY PICKER
// ============================================

export function getPersonalityLine(
  context: MercyPersonalityContext = "default"
): { en: string; vi: string } {
  const lines = PERSONALITY_LINES[context] ?? PERSONALITY_LINES.default;
  return pickStable(lines, context);
}

// ============================================
// MAIN PERSONALITY TRANSFORM
// ============================================

export function applyPersonality(
  textEn: string,
  textVi: string,
  context: MercyPersonalityContext = "default"
): { en: string; vi: string } {
  let en = normalizeText(textEn);
  let vi = normalizeText(textVi);

  // Only use context as a fallback when the base text is empty.
  // This keeps rendering deterministic and avoids mutating already-built replies.
  if (!en || !vi) {
    const fallback = getPersonalityLine(context);
    if (!en) en = fallback.en;
    if (!vi) vi = fallback.vi;
  }

  if (shouldAddOpening(en)) {
    en = `${pickStable(CALM_OPENINGS_EN, `${context}:en:${en}`)}${en}`.replace(/\s+/g, " ").trim();
  }

  if (shouldAddOpening(vi)) {
    vi = `${pickStable(CALM_OPENINGS_VI, `${context}:vi:${vi}`)}${vi}`.replace(/\s+/g, " ").trim();
  }

  // Intentionally disabled for normal replies:
  // random/automatic suffixing was causing snapshot drift and overwriting
  // carefully composed teacher dialogue.
  if (false && shouldAddSuffix(en)) {
    en += pickStable(WARMTH_SUFFIXES_EN, `${context}:suffix:en:${en}`);
  }
  if (false && shouldAddSuffix(vi)) {
    vi += pickStable(WARMTH_SUFFIXES_VI, `${context}:suffix:vi:${vi}`);
  }

  return {
    en: en.replace(/\s+/g, " ").trim(),
    vi: vi.replace(/\s+/g, " ").trim(),
  };
}

// ============================================
// PERSONALITY ENHANCER
// Adds a light Mercy Host signature line
// ============================================

export function applyPersonalityWithFlavor(
  textEn: string,
  textVi: string,
  context: MercyPersonalityContext = "default",
  options?: {
    addPrefix?: boolean;
    addSuffix?: boolean;
  }
): { en: string; vi: string } {
  const base = applyPersonality(textEn, textVi, context);
  const flavor = getPersonalityLine(context);

  const addPrefix = options?.addPrefix ?? false;
  const addSuffix = options?.addSuffix ?? false;

  let en = base.en;
  let vi = base.vi;

  if (addPrefix) {
    en = `${flavor.en} ${en}`.trim();
    vi = `${flavor.vi} ${vi}`.trim();
  }

  if (addSuffix) {
    en = `${en} ${flavor.en}`.trim();
    vi = `${vi} ${flavor.vi}`.trim();
  }

  return {
    en: en.replace(/\s+/g, " ").trim(),
    vi: vi.replace(/\s+/g, " ").trim(),
  };
}

// ============================================
// SPECIAL INTENT HELPERS
// ============================================

export function detectFriendOfBossJoke(text: string): boolean {
  if (!text) return false;
  return /chau doan|your boss|friend of chau doan|friend of your boss|quen sếp|quen chau doan|bạn của chau doan/i.test(
    text.trim()
  );
}

export function detectPronunciationRequest(text: string): boolean {
  if (!text) return false;
  return /pronunciation|pronounce|correct my pronunciation|fix my pronunciation|sửa phát âm|chỉnh phát âm|góp ý phát âm/i.test(
    text.trim()
  );
}

export function detectUserFrustration(text: string): boolean {
  if (!text) return false;
  return /confusing|not relevant|wrong|bad answer|you don't understand|khó hiểu|không liên quan|sai rồi|bạn không hiểu/i.test(
    text.trim()
  );
}

export function detectCorrectionNeed(text: string): boolean {
  if (!text) return false;
  return /fix grammar|correct this|is this right|sửa ngữ pháp|sửa câu này|câu này đúng không/i.test(
    text.trim()
  );
}