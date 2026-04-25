// Mercy persona — central, type-narrowed config for Mercy's voice.
//
// Extracted from existing code (no copy edits — Step 10 is pure
// extraction). Sources:
//   - Voice openers / encouragements / fillers
//       → src/lib/teacher-mercy/generateTeachingTurn.ts
//   - Greetings
//       → src/lib/teacher-mercy/greetings.ts
//   - Identity / boundaries
//       → src/lib/teacher-mercy/persona.ts (kept; we re-export pieces here)
//   - UI labels in the greeting overlay
//       → src/components/TeacherMercyGreeting.tsx
//
// Why this file exists:
//   1. Tune Mercy's VN voice without editing code paths.
//   2. Future Korean / Russian Mercy = config swap, not refactor.
//   3. `as const` narrows every string into a literal type so misuse
//      ("morming" instead of "morning") is a compile error.
//
// Do not import this from inside src/lib/teacher-mercy/persona.ts —
// that file remains the small, low-level identity object referenced
// by FALLBACK_NAMES and TIER_LABELS. This config sits ABOVE that one.

/* eslint-disable @typescript-eslint/no-unused-vars */

export const MERCY_PERSONA_CONFIG = {
  // ── Identity ────────────────────────────────────────────────────────
  identity: {
    name: "Mercy",
    role: "English teacher for Vietnamese learners",
    // Backstory phrased the way the existing persona.ts header phrases
    // her. Keeping the wording verbatim so a tone change here can't
    // silently drift from the safety guarantees the engine relies on.
    backstory:
      "Warm, hospitable host of every room. Bilingual VN/EN. Warm, knowledgeable, calm, supportive, never overwhelming.",
  },

  // ── Voice settings ──────────────────────────────────────────────────
  voice: {
    /** Existing tone in src/lib/teacher-mercy/persona.ts is "warm". */
    warmthLevel: "warm",
    /**
     * VN address is informal-friendly. The existing greetings address
     * the learner as "{{name}}" and refer to Mercy as "mình" (informal,
     * peer-like) rather than "tôi" (formal). "bạn" is the second-person
     * pronoun used when no name is available.
     */
    formality: "informal-friendly",
    /** True iff templates inline "{{name}}" / `${learnerName}`. */
    useFirstName: true,
    /** Source: src/lib/teacher-mercy/persona.ts FALLBACK_NAMES. */
    fallbackName: { en: "my friend", vi: "bạn hiền" },
  },

  // ── Greetings ───────────────────────────────────────────────────────
  // Each set is bilingual {en, vi} and at minimum 2 entries so the
  // greeting picker has variety. firstTime / returning come straight
  // from greetings.ts. morning / evening do not exist as time-of-day
  // sets in the current codebase — populated here from the most
  // generic GENERAL_GREETINGS so the categories are usable today
  // without inventing new copy. Tune later when time-of-day matters.
  greetings: {
    firstTime: [
      {
        en: "Hi {{name}}, Mercy welcomes you to {{roomTitle}}. Make yourself at home — I'm here to guide you.",
        vi: "Chào {{name}}, Mercy mời bạn vào phòng {{roomTitle}}. Cứ thoải mái nhé — mình luôn ở đây hỗ trợ bạn.",
      },
      {
        en: "Welcome, {{name}}. This is {{roomTitle}} — a space created just for you. Take your time.",
        vi: "Chào mừng {{name}}. Đây là {{roomTitle}} — không gian được tạo riêng cho bạn. Hãy thong thả nhé.",
      },
      {
        en: "Hello {{name}}, I'm Mercy. Let's explore {{roomTitle}} together at your own pace.",
        vi: "Xin chào {{name}}, mình là Mercy. Cùng khám phá {{roomTitle}} theo nhịp của bạn nhé.",
      },
    ],
    returning: [
      {
        en: "Welcome back, {{name}}. As a valued member, {{roomTitle}} opens its deeper layers for you.",
        vi: "Chào mừng trở lại, {{name}}. Là thành viên quý, {{roomTitle}} mở ra những tầng sâu hơn cho bạn.",
      },
      {
        en: "{{name}}, your dedication brings you here. Let's unlock what {{roomTitle}} has to offer.",
        vi: "{{name}}, sự chuyên tâm đã đưa bạn đến đây. Hãy cùng mở khóa những gì {{roomTitle}} dành tặng.",
      },
    ],
    morning: [
      {
        en: "{{name}}, welcome to {{roomTitle}}. I'm here whenever you need a gentle guide.",
        vi: "{{name}}, chào mừng đến {{roomTitle}}. Mình ở đây khi bạn cần một người đồng hành nhẹ nhàng.",
      },
      {
        en: "Glad you're here, {{name}}. {{roomTitle}} awaits — no rush, just presence.",
        vi: "Vui vì bạn đến, {{name}}. {{roomTitle}} đang chờ — không vội, chỉ cần có mặt thôi.",
      },
    ],
    evening: [
      {
        en: "Welcome, {{name}}. This is {{roomTitle}} — a space created just for you. Take your time.",
        vi: "Chào mừng {{name}}. Đây là {{roomTitle}} — không gian được tạo riêng cho bạn. Hãy thong thả nhé.",
      },
      {
        en: "Hello {{name}}, I'm Mercy. Let's explore {{roomTitle}} together at your own pace.",
        vi: "Xin chào {{name}}, mình là Mercy. Cùng khám phá {{roomTitle}} theo nhịp của bạn nhé.",
      },
    ],
  },

  // ── Encouragement fragments ─────────────────────────────────────────
  // Extracted from generateTeachingTurn.ts buildEnglishText / buildAltText.
  // Templates carry one optional "{name}" placeholder; the engine
  // substitutes it client-side before render.
  encouragements: {
    afterMistake: {
      // Used when the mistake is NEW (not a repeat). The two variants
      // are name-aware vs anonymous, mirroring the existing code path.
      en: [
        "{name}, you're close.",
        "You're close.",
      ],
      vi: [
        "Nhẹ nhàng thôi, {name}, bạn gần đúng rồi.",
        "Nhẹ nhàng thôi, bạn gần đúng rồi.",
      ],
      // Used when the mistake is a REPEAT — softer + invites a re-walk.
      enRepeated: [
        "Let's review this once more.",
      ],
      viRepeated: [
        "Hãy ôn lại phần này thêm một lần nữa.",
      ],
    },
    afterCorrect: {
      en: [
        "Good work. Keep this same structure in one more sentence.",
      ],
      vi: [
        "Tốt lắm. Bước tiếp theo: viết thêm một câu nữa với cùng cấu trúc.",
      ],
    },
    /** Mid-streak / "let's stay with this idea" — review mode (non-repeated). */
    afterStreak: {
      en: [
        "Good. Let's stay with this idea one more round.",
      ],
      vi: [
        "Tốt. Mình ở lại với ý này thêm một vòng nữa nhé.",
      ],
    },
  },

  // ── Fillers ─────────────────────────────────────────────────────────
  // Extracted from buildAltText. These are the small interstitial
  // phrases Mercy uses to acknowledge / soften.
  fillers: {
    thinking: {
      en: ["Take your time.", "Gently."],
      vi: ["Không vội đâu —", "Nhẹ nhàng thôi,"],
    },
    acknowledging: {
      en: ["I'm here with you.", "You're doing well."],
      vi: ["Mình ở đây với bạn.", "Bạn đang làm tốt lắm."],
    },
    closing: {
      en: ["I will make this clearer."],
      vi: ["Mình sẽ làm cho điều này rõ hơn."],
    },
  },

  // ── Code-switch settings ────────────────────────────────────────────
  // Mercy's VN voice often frames in Vietnamese and slips in the
  // concrete English phrase to practise. The existing buildAltText
  // does this with a "Bước tiếp theo:" marker that introduces the
  // English target sentence. Surfacing the marker here so a future
  // VN-style change can flip it without code edits.
  codeSwitch: {
    /** True: VN frame + EN target words is OK (current behaviour). */
    allowVNEnglishMix: true,
    /** Marker that introduces an EN target inside a VN sentence. */
    vnNextStepMarker: "Bước tiếp theo:",
    /** Default 2nd-person VN pronoun. */
    preferredVNTitle: "bạn",
  },

  // ── UI labels in TeacherMercyGreeting.tsx ───────────────────────────
  // Pulled out so future localization (or a future "Korean Mercy") can
  // ship the greeting overlay without touching the component.
  uiLabels: {
    showGreeting: "Show Mercy's greeting",
    dismissGreeting: "Dismiss greeting",
    hearMercy: "Hear Mercy",
    playing: "Playing...",
  },
} as const;

// ── Type narrowing helpers ──────────────────────────────────────────────

export type MercyPersonaConfig = typeof MERCY_PERSONA_CONFIG;
export type MercyGreetingSet = keyof MercyPersonaConfig["greetings"];
export type MercyEncouragementMoment =
  keyof MercyPersonaConfig["encouragements"];
export type MercyFillerKind = keyof MercyPersonaConfig["fillers"];

/**
 * Format a template string by replacing `{name}` with the supplied name,
 * or stripping the placeholder + any surrounding comma-spaces if no name
 * is available. Mirrors the inline `${learnerName}` substitution that
 * lived in generateTeachingTurn.ts.
 */
export function formatPersonaTemplate(
  template: string,
  name: string | null | undefined,
): string {
  if (name && name.trim()) {
    return template.replace(/\{name\}/g, name.trim());
  }
  // Strip "{name}, " or ", {name}" or bare "{name}" so the sentence stays
  // grammatical when no name is available.
  return template
    .replace(/,\s*\{name\}/g, "")
    .replace(/\{name\},\s*/g, "")
    .replace(/\{name\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Pick the right "afterMistake" line — name-aware or anonymous — in
 * either language. Mirrors the existing branch in buildAltText that
 * picks between two variants based on whether learnerName is set.
 */
export function pickAfterMistakeLine(
  language: "en" | "vi",
  name: string | null | undefined,
  repeated: boolean,
): string {
  const enc = MERCY_PERSONA_CONFIG.encouragements.afterMistake;
  if (repeated) {
    const arr = language === "vi" ? enc.viRepeated : enc.enRepeated;
    return formatPersonaTemplate(arr[0], name);
  }
  const arr = language === "vi" ? enc.vi : enc.en;
  // Index 0 = name-aware template; index 1 = anonymous fallback.
  const tpl = name && name.trim() ? arr[0] : arr[1] ?? arr[0];
  return formatPersonaTemplate(tpl, name);
}
