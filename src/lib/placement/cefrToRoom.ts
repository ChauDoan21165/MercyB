// src/lib/placement/cefrToRoom.ts
//
// Static mapping from placement-test CEFR result → recommended starting
// room id. Chosen during Phase 1 audit based on the actual room files in
// `public/data/*.json`.
//
// Design notes:
// - There are no `english_b2_*` rooms in the curriculum. B2 users are
//   pointed at the first C1 room as a stretch target (aligned with the
//   Phase 1 proposal).
// - C2 targets `master_english_high_efficiency_vip3` — the only room
//   that explicitly references CEFR. It sits behind a paid tier; C2
//   placers are, by definition, advanced learners and a paid room is
//   the correct pedagogical target even if access requires upgrade.
// - Kid branch doesn't use this map — kids are routed to
//   alphabet_adventure_kids_l1 directly from the "Who is this for?"
//   screen (see docs/placement-test-wireframes.md Screen 2).

import type { ResultCEFR } from './engine';

export const CEFR_TO_ROOM: Record<ResultCEFR, string> = {
  pre_a1: 'english_foundation_ef01',
  A1: 'english_a1_a101',
  A2: 'english_a2_a201',
  B1: 'english_b1_b101',
  // No B2-prefixed rooms exist; stretch to C1.
  B2: 'english_c1_c101',
  C1: 'english_c1_c101',
  // The single room that references CEFR directly. Paid tier.
  C2: 'master_english_high_efficiency_vip3',
};

/** Look up the recommended room id for a CEFR result. Returns the A1 room as a defensive fallback. */
export function roomForCefr(cefr: ResultCEFR): string {
  return CEFR_TO_ROOM[cefr] ?? CEFR_TO_ROOM.A1;
}

/** Bilingual warm taglines shown next to the big CEFR number on the Results screen. */
export const CEFR_TAGLINE: Record<ResultCEFR, { en: string; vi: string }> = {
  pre_a1: {
    en: 'Absolute beginner — a clean start',
    vi: 'Mới hoàn toàn — một khởi đầu sạch sẽ',
  },
  A1: {
    en: 'Beginner — first words and phrases',
    vi: 'Sơ khởi — từ vựng và câu đầu tiên',
  },
  A2: {
    en: 'Elementary — solid foundation',
    vi: 'Sơ cấp — nền tảng đã vững',
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
    vi: 'Cao cấp — làm chủ và tinh tế',
  },
  C2: {
    en: 'Proficient — near-native precision',
    vi: 'Thành thạo — gần như bản ngữ',
  },
};
