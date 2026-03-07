/**
 * Mercy Martial Coach Scripts - Phase 8
 *
 * Martial arts coaching with mindset, discipline, and safety focus.
 * All lines ≤140 chars, calm and disciplined tone, no violent language.
 *
 * NOTE:
 * - This file remains the RAW content source for martial coaching.
 * - Personality styling is applied later in engine.ts to avoid double-styling.
 */

export type MartialCoachLevel = "off" | "gentle" | "focused" | "dojo";

export type MartialContext =
  | "martial_room_enter"
  | "martial_entry_complete"
  | "martial_low_mood"
  | "martial_stressed"
  | "martial_failure_reframe"
  | "martial_victory";

export interface MartialCoachTip {
  id: string;
  level: MartialCoachLevel;
  context: MartialContext;
  en: string;
  vi: string;
}

export type DomainCategory = "martial" | "general";

// -----------------------------
// Domain detection (test-backed)
// -----------------------------

function normalizeText(input: string): string {
  return String(input ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[_\s]+/g, " ")
    .trim();
}

function includesAny(haystack: string, needles: string[]): boolean {
  for (const n of needles) {
    if (haystack.includes(n)) return true;
  }
  return false;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function cleanPlaceholder(text: string, userName?: string | null): string {
  if (userName) {
    return text.replace(/\{\{name\}\}/g, userName).replace(/\s+/g, " ").trim();
  }

  return text
    .replace(/\{\{name\}\},?\s*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const MARTIAL_DOMAIN_KEYWORDS = [
  // general
  "martial",
  "martial arts",
  "combat",
  "dojo",
  "academy",
  "self defense",
  "self-defence",
  "self defence",
  "self-protection",
  "self protection",
  "sparring",

  // ✅ test-backed: "Kung Fu Academy"
  "kung fu",
  "kungfu",
  "wushu",

  // common disciplines
  "karate",
  "taekwondo",
  "tkd",
  "muay thai",
  "kickboxing",
  "kick boxing",
  "boxing",
  "jiu jitsu",
  "jiujitsu",
  "bjj",
  "brazilian jiu jitsu",
  "grappling",
  "wrestling",
  "judo",
  "aikido",
  "krav maga",
  "kendo",
  "fencing",
  "sword",
  "swords",
];

const MARTIAL_TAG_KEYWORDS = [
  "martial",
  "combat",
  "dojo",
  "academy",
  "kungfu",
  "kung fu",
  "wushu",
  "karate",
  "taekwondo",
  "boxing",
  "bjj",
  "jiu-jitsu",
  "jiu jitsu",
  "muaythai",
  "muay thai",
  "self-defense",
  "self defence",
  "self defense",
  "krav",
  "judo",
  "fencing",
  "sword",
];

/**
 * Detect if the content belongs to the martial domain.
 * Supports detection by roomId, roomDomain (title/category), and tags.
 *
 * ✅ Test-backed requirement: roomDomain strings must match "Kung Fu Academy".
 */
export function isMartialDomain(
  roomId?: string | null,
  roomDomain?: string | null,
  tags?: string[] | null
): boolean {
  const idNorm = roomId ? normalizeText(roomId).replace(/\s+/g, "_") : "";
  const domainNorm = roomDomain ? normalizeText(roomDomain) : "";

  if (idNorm) {
    // fast path for ids that often contain category tokens
    if (
      includesAny(idNorm, [
        "martial",
        "combat",
        "dojo",
        "kung_fu",
        "kungfu",
        "wushu",
        "karate",
        "taekwondo",
        "boxing",
        "bjj",
        "jiu",
        "muay_thai",
        "krav",
        "judo",
        "kendo",
        "fencing",
        "sword",
      ])
    ) {
      return true;
    }
  }

  if (domainNorm) {
    // ✅ this is where "Kung Fu Academy" must match
    if (includesAny(domainNorm, MARTIAL_DOMAIN_KEYWORDS)) return true;
  }

  if (tags && tags.length > 0) {
    for (const t of tags) {
      const tagNorm = normalizeText(String(t));
      if (includesAny(tagNorm, MARTIAL_TAG_KEYWORDS)) return true;
    }
  }

  return false;
}

/**
 * Higher-level category helper used by the host.
 */
export function getDomainCategory(
  roomId?: string | null,
  roomDomain?: string | null,
  tags?: string[] | null
): DomainCategory {
  return isMartialDomain(roomId, roomDomain, tags) ? "martial" : "general";
}

/**
 * Martial coach tips organized by level and context
 */
const MARTIAL_TIPS: MartialCoachTip[] = [
  // === GENTLE LEVEL ===
  // Room enter
  {
    id: "gentle_enter_1",
    level: "gentle",
    context: "martial_room_enter",
    en: "Welcome to the dojo. Move at your own pace.",
    vi: "Chào mừng đến dojo. Di chuyển theo nhịp riêng của bạn.",
  },
  {
    id: "gentle_enter_2",
    level: "gentle",
    context: "martial_room_enter",
    en: "Breathe first. The path unfolds naturally.",
    vi: "Hít thở trước. Con đường sẽ tự mở ra.",
  },
  // Entry complete
  {
    id: "gentle_complete_1",
    level: "gentle",
    context: "martial_entry_complete",
    en: "One step completed. Each step matters.",
    vi: "Một bước hoàn thành. Mỗi bước đều quan trọng.",
  },
  // Low mood
  {
    id: "gentle_low_1",
    level: "gentle",
    context: "martial_low_mood",
    en: "Even the greatest warriors rest. Your stillness is strength.",
    vi: "Ngay cả chiến binh vĩ đại nhất cũng nghỉ ngơi. Sự tĩnh lặng của bạn là sức mạnh.",
  },
  // Stressed
  {
    id: "gentle_stressed_1",
    level: "gentle",
    context: "martial_stressed",
    en: "Center yourself. The dojo is a place of peace.",
    vi: "Tập trung vào bản thân. Dojo là nơi yên bình.",
  },
  // Failure reframe
  {
    id: "gentle_failure_1",
    level: "gentle",
    context: "martial_failure_reframe",
    en: "Every fall teaches balance. Rest and return.",
    vi: "Mỗi lần ngã đều dạy cách giữ thăng bằng. Nghỉ ngơi và quay lại.",
  },
  // Victory
  {
    id: "gentle_victory_1",
    level: "gentle",
    context: "martial_victory",
    en: "Well done. Progress flows from consistency.",
    vi: "Làm tốt lắm. Tiến bộ đến từ sự kiên định.",
  },

  // === FOCUSED LEVEL ===
  // Room enter
  {
    id: "focused_enter_1",
    level: "focused",
    context: "martial_room_enter",
    en: "Clear your mind. Training begins with focus.",
    vi: "Tĩnh tâm. Tập luyện bắt đầu từ sự tập trung.",
  },
  {
    id: "focused_enter_2",
    level: "focused",
    context: "martial_room_enter",
    en: "Discipline is the bridge between goals and results.",
    vi: "Kỷ luật là cầu nối giữa mục tiêu và kết quả.",
  },
  // Entry complete
  {
    id: "focused_complete_1",
    level: "focused",
    context: "martial_entry_complete",
    en: "Technique refined. Continue your practice.",
    vi: "Kỹ thuật được trau dồi. Tiếp tục luyện tập.",
  },
  {
    id: "focused_complete_2",
    level: "focused",
    context: "martial_entry_complete",
    en: "Good form. Now repeat until it becomes natural.",
    vi: "Tư thế tốt. Bây giờ lặp lại cho đến khi trở nên tự nhiên.",
  },
  // Low mood
  {
    id: "focused_low_1",
    level: "focused",
    context: "martial_low_mood",
    en: "The warrior's path includes valleys. Keep breathing.",
    vi: "Con đường chiến binh có cả thung lũng. Tiếp tục hít thở.",
  },
  // Stressed
  {
    id: "focused_stressed_1",
    level: "focused",
    context: "martial_stressed",
    en: "Tension blocks flow. Exhale fully. Begin again.",
    vi: "Căng thẳng chặn dòng chảy. Thở ra hoàn toàn. Bắt đầu lại.",
  },
  // Failure reframe
  {
    id: "focused_failure_1",
    level: "focused",
    context: "martial_failure_reframe",
    en: "Setbacks sharpen focus. Analyze, adapt, advance.",
    vi: "Thất bại mài sắc sự tập trung. Phân tích, thích nghi, tiến lên.",
  },
  // Victory
  {
    id: "focused_victory_1",
    level: "focused",
    context: "martial_victory",
    en: "Victory earned through practice. Celebrate quietly, then prepare.",
    vi: "Chiến thắng có được qua luyện tập. Ăn mừng nhẹ nhàng, rồi chuẩn bị.",
  },

  // === DOJO LEVEL ===
  // Room enter
  {
    id: "dojo_enter_1",
    level: "dojo",
    context: "martial_room_enter",
    en: "Bow in. Train with intention. Every session builds mastery.",
    vi: "Cúi chào. Tập luyện có chủ đích. Mỗi buổi tập xây dựng sự thành thạo.",
  },
  {
    id: "dojo_enter_2",
    level: "dojo",
    context: "martial_room_enter",
    en: "The dojo awaits. Show up. Execute. Grow.",
    vi: "Dojo đang chờ. Xuất hiện. Thực hiện. Phát triển.",
  },
  // Entry complete
  {
    id: "dojo_complete_1",
    level: "dojo",
    context: "martial_entry_complete",
    en: "Strong execution. Log this and review tomorrow.",
    vi: "Thực hiện mạnh mẽ. Ghi lại và xem lại ngày mai.",
  },
  {
    id: "dojo_complete_2",
    level: "dojo",
    context: "martial_entry_complete",
    en: "Movement recorded. Next: apply under pressure.",
    vi: "Động tác đã ghi nhận. Tiếp theo: áp dụng dưới áp lực.",
  },
  // Low mood
  {
    id: "dojo_low_1",
    level: "dojo",
    context: "martial_low_mood",
    en: "Even in low energy, show up. Light training still builds.",
    vi: "Ngay cả khi năng lượng thấp, hãy xuất hiện. Tập nhẹ vẫn xây dựng.",
  },
  // Stressed
  {
    id: "dojo_stressed_1",
    level: "dojo",
    context: "martial_stressed",
    en: "Use this tension. Channel it into controlled movement.",
    vi: "Sử dụng căng thẳng này. Hướng nó vào chuyển động có kiểm soát.",
  },
  // Failure reframe
  {
    id: "dojo_failure_1",
    level: "dojo",
    context: "martial_failure_reframe",
    en: "Failure is data. Adjust your stance and try again.",
    vi: "Thất bại là dữ liệu. Điều chỉnh tư thế và thử lại.",
  },
  // Victory
  {
    id: "dojo_victory_1",
    level: "dojo",
    context: "martial_victory",
    en: "Bow out. You showed discipline today. Return stronger.",
    vi: "Cúi chào ra. Bạn đã thể hiện kỷ luật hôm nay. Trở lại mạnh mẽ hơn.",
  },
];

/**
 * Get a martial coach tip for the given context
 */
export function getMartialCoachTip(args: {
  level: MartialCoachLevel;
  context: MartialContext;
  userName?: string | null;
}): { id: string; en: string; vi: string } {
  const { level, context, userName } = args;

  // 'off' level returns empty tip
  if (level === "off") {
    return { id: "martial_off", en: "", vi: "" };
  }

  // Filter tips by level and context
  const matchingTips = MARTIAL_TIPS.filter((tip) => tip.level === level && tip.context === context);

  // Fallback to room enter if no matching context
  const tips =
    matchingTips.length > 0
      ? matchingTips
      : MARTIAL_TIPS.filter((tip) => tip.level === level && tip.context === "martial_room_enter");

  if (tips.length === 0) {
    return {
      id: "martial_default",
      en: "Focus. Breathe. Train.",
      vi: "Tập trung. Hít thở. Luyện tập.",
    };
  }

  // Pick random tip
  const tip = pickRandom(tips);

  // Replace {{name}} placeholder if userName provided
  const en = cleanPlaceholder(tip.en, userName);
  const vi = cleanPlaceholder(tip.vi, userName);

  return { id: tip.id, en, vi };
}

/**
 * Validate all martial coach tips
 */
export function validateMartialCoachTips(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const MAX_LENGTH = 140;
  const activeLevels: MartialCoachLevel[] = ["gentle", "focused", "dojo"];

  for (const tip of MARTIAL_TIPS) {
    // Check length
    if (tip.en.length > MAX_LENGTH) {
      errors.push(`${tip.id}: EN too long (${tip.en.length}): "${tip.en}"`);
    }
    if (tip.vi.length > MAX_LENGTH) {
      errors.push(`${tip.id}: VI too long (${tip.vi.length}): "${tip.vi}"`);
    }

    // Check non-empty for active levels
    if (activeLevels.includes(tip.level)) {
      if (!tip.en.trim()) {
        errors.push(`${tip.id}: EN is empty`);
      }
      if (!tip.vi.trim()) {
        errors.push(`${tip.id}: VI is empty`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Get all tips for testing/validation
 */
export function getAllMartialTips(): MartialCoachTip[] {
  return [...MARTIAL_TIPS];
}

/**
 * Infer martial discipline from room metadata.
 * (Extra args are optional; tests may pass only roomId.)
 */
export function inferMartialDiscipline(
  roomId: string,
  roomDomain?: string | null,
  tags?: string[] | null
): string {
  const parts: string[] = [];
  if (roomId) parts.push(roomId);
  if (roomDomain) parts.push(roomDomain);
  if (tags?.length) parts.push(tags.join(" "));

  const text = normalizeText(parts.join(" ")).replace(/\s+/g, " ");

  if (includesAny(text, ["fencing", "kendo", "sword", "swords", "samurai"])) return "sword";
  if (includesAny(text, ["boxing", "kickboxing", "kick boxing"])) return "boxing";
  if (includesAny(text, ["bjj", "brazilian jiu jitsu", "jiu jitsu", "jiujitsu", "grappling"])) return "bjj";
  if (includesAny(text, ["karate"])) return "karate";
  if (includesAny(text, ["taekwondo", "tkd"])) return "taekwondo";
  if (includesAny(text, ["muay thai"])) return "muay_thai";
  if (includesAny(text, ["judo"])) return "judo";
  if (includesAny(text, ["aikido"])) return "aikido";
  if (includesAny(text, ["kung fu", "kungfu", "wushu"])) return "kung_fu";

  return "martial";
}