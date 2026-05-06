// src/lib/placement/cefrToRoom.ts
//
// Static mapping from placement-test CEFR result → recommended starting
// room id. Based on the actual room files in `public/data/*.json` and
// refined per Chau's Step C review.
//
// Design notes:
// - No `english_b2_*` rooms exist. Jumping a B2 learner straight into
//   C1 is the single worst failure mode for Vietnamese adult learners
//   (overwhelming content → quit). Instead, B2 gets the HIGHEST B1
//   room (upper-intermediate territory). The Results screen can offer
//   "Stretch to C1" as a secondary action.
// - The primary "Start this lesson" button must never paywall. C2
//   therefore maps to the most advanced free C1 room (c114). Paid C2
//   content can be surfaced as a secondary nudge — not here.
// - Kid branch doesn't use this map — kids route to
//   alphabet_adventure_kids_l1 directly from the "Who is this for?"
//   screen (see docs/placement-test-wireframes.md Screen 2).
// - Every roomId in this map is validated against public/data/*.json
//   by the companion test cefrToRoom.test.ts — CI fails loudly if any
//   room is renamed or removed.

import type { ResultCEFR } from './engine';

export const CEFR_TO_ROOM: Record<ResultCEFR, string> = {
  pre_a1: 'english_foundation_ef01',
  A1: 'english_a1_a101',
  A2: 'english_a2_a201',
  B1: 'english_b1_b101',
  // No B2-prefixed rooms exist. Ship B2 learners the most advanced B1
  // room (upper-intermediate territory) to solidify before the C1 jump.
  B2: 'english_b1_b114',
  C1: 'english_c1_c101',
  // No free C2 content exists. Use the most advanced free C1 room so
  // the primary CTA never paywalls.
  C2: 'english_c1_c114',
};

/** Look up the recommended room id for a CEFR result. Returns the A1 room as a defensive fallback. */
export function roomForCefr(cefr: ResultCEFR): string {
  return CEFR_TO_ROOM[cefr] ?? CEFR_TO_ROOM.A1;
}

/** Bilingual warm taglines shown next to the big CEFR number on the Results screen. */
export const CEFR_TAGLINE: Record<ResultCEFR, { en: string; vi: string }> = {
  pre_a1: {
    en: 'Absolute beginner — a clean start',
    vi: 'Mới hoàn toàn — một khởi đầu rõ ràng',
  },
  A1: {
    en: 'Beginner — first words and phrases',
    vi: 'Mới bắt đầu — những từ và câu đầu tiên',
  },
  A2: {
    en: 'Elementary — solid foundation',
    vi: 'Sơ cấp — nền tảng đang vững dần',
  },
  B1: {
    en: 'Intermediate — conversational confidence',
    vi: 'Trung cấp — tự tin giao tiếp',
  },
  B2: {
    en: 'Upper intermediate — fluent and flexible',
    vi: 'Trung cấp cao — trôi chảy và linh hoạt',
  },
  C1: {
    en: 'Advanced — command and nuance',
    vi: 'Nâng cao — dùng tiếng Anh chính xác và tinh tế',
  },
  C2: {
    en: 'Proficient — near-native precision',
    vi: 'Thành thạo — độ chính xác gần như bản ngữ',
  },
};
