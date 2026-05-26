/**
 * Centralised bilingual copy for the sound-pair drill UI.
 *
 * Keeping category names, tooltips, and result strings in one file so
 * future copy passes (VN teacher review, tone tuning) don't require
 * chasing strings through the React tree.
 *
 * Vietnamese-first: every user-visible string has a VN and EN pair.
 */

import type { DrillCategory } from '@/lib/pronunciation/soundPairDrills';

export type Bilingual = { en: string; vi: string };

export const CATEGORY_NAMES: Record<DrillCategory, Bilingual> = {
  'th-t': {
    en: 'th vs t',
    vi: 'Phân biệt "th" và "t"',
  },
  'r-l': {
    en: 'r vs l',
    vi: 'Phân biệt "r" và "l"',
  },
  ed: {
    en: 'Past tense -ed',
    vi: 'Âm "-ed" quá khứ',
  },
  s: {
    en: 'Plural -s / -es',
    vi: 'Âm "-s / -es" số nhiều',
  },
  stress: {
    en: 'Word stress',
    vi: 'Trọng âm từ',
  },
  intonation: {
    en: 'Question vs statement',
    vi: 'Giai điệu câu hỏi vs câu khẳng định',
  },
};

export const CATEGORY_WHY: Record<DrillCategory, Bilingual> = {
  'th-t': {
    en: 'Vietnamese has no "th" sound, so learners often swap it for "t". Fixing this one contrast unlocks dozens of common words.',
    vi: 'Tiếng Việt không có âm "th", nên người học thường thay thành "t". Chỉnh được cặp âm này là mở khoá hàng chục từ thường dùng.',
  },
  'r-l': {
    en: 'Some Vietnamese regions flip "r" and "l", and the English "r" is different from the Vietnamese one. Minimal pairs train the distinction.',
    vi: 'Một số vùng Việt Nam đổi "r" ↔ "l", và âm "r" tiếng Anh khác âm "r" tiếng Việt. Luyện cặp tối thiểu để tách biệt.',
  },
  ed: {
    en: 'Vietnamese doesn\'t add sounds to mark tense — so learners often drop the "-ed" and the past tense disappears.',
    vi: 'Tiếng Việt không thêm âm để đánh dấu thì, nên người học hay bỏ "-ed" và thì quá khứ biến mất.',
  },
  s: {
    en: 'Final consonants are weak in Vietnamese — the plural "-s" and "-es" are easy to drop, and the meaning shifts with it.',
    vi: 'Phụ âm cuối yếu trong tiếng Việt — "-s" và "-es" số nhiều dễ bị bỏ, và nghĩa thay đổi theo.',
  },
  stress: {
    en: 'Vietnamese is syllable-timed — every syllable gets equal weight. English moves stress to change meaning (REcord/reCORD, GREENhouse/green HOUSE). Train the contrast and meaning follows.',
    vi: 'Tiếng Việt phát âm tiết đều nhau. Tiếng Anh đổi trọng âm để đổi nghĩa (REcord/reCORD, GREENhouse/green HOUSE). Luyện cặp đối lập để nhận ra nghĩa khác biệt.',
  },
  intonation: {
    en: 'Vietnamese is tonal — pitch lives on the syllable. English uses pitch on the whole sentence: rising for yes/no questions, falling for statements. Same words, different tune, different meaning.',
    vi: 'Tiếng Việt có thanh điệu trên từng âm tiết. Tiếng Anh dùng giai điệu cả câu: nâng cuối câu hỏi yes/no, hạ cuối câu khẳng định. Cùng chữ, khác giai điệu, khác nghĩa.',
  },
};

export const SCORE_BANDS = {
  excellent: {
    en: 'Excellent — that sound is clear.',
    vi: 'Xuất sắc — âm đó đã rõ ràng.',
  } as Bilingual,
  good: {
    en: 'Good — close to the model.',
    vi: 'Tốt — gần giống mẫu rồi.',
  } as Bilingual,
  close: {
    en: 'Close — try rounding the sound a bit more.',
    vi: 'Gần đúng — thử phát âm rõ hơn một chút.',
  } as Bilingual,
  retry: {
    en: 'Let\'s try again — listen to the model first.',
    vi: 'Thử lại nhé — nghe mẫu trước rồi lặp lại.',
  } as Bilingual,
};

/** Pick a score band label from a 0..1 confidence. */
export function bandForConfidence(c: number): Bilingual {
  if (c >= 0.9) return SCORE_BANDS.excellent;
  if (c >= 0.75) return SCORE_BANDS.good;
  if (c >= 0.55) return SCORE_BANDS.close;
  return SCORE_BANDS.retry;
}

export const UI_COPY = {
  title: {
    en: 'Sound-pair drill',
    vi: 'Luyện cặp âm',
  } as Bilingual,
  chooseCategory: {
    en: 'Choose a sound to practise',
    vi: 'Chọn một âm để luyện',
  } as Bilingual,
  sayThis: {
    en: 'Say this word',
    vi: 'Nói từ này',
  } as Bilingual,
  notThis: {
    en: 'Not this one',
    vi: 'Không phải từ này',
  } as Bilingual,
  playTarget: {
    en: 'Play model',
    vi: 'Nghe mẫu',
  } as Bilingual,
  record: {
    en: 'Record your attempt',
    vi: 'Thu âm thử',
  } as Bilingual,
  recording: {
    en: 'Listening…',
    vi: 'Đang nghe…',
  } as Bilingual,
  whyConfused: {
    en: 'Why Vietnamese speakers confuse this',
    vi: 'Vì sao người Việt hay nhầm',
  } as Bilingual,
  nextPair: {
    en: 'Next pair',
    vi: 'Cặp tiếp theo',
  } as Bilingual,
  finish: {
    en: 'Finish drill',
    vi: 'Kết thúc',
  } as Bilingual,
  backToCategories: {
    en: 'Back to categories',
    vi: 'Về danh sách âm',
  } as Bilingual,
  sttUnavailable: {
    en: 'Live scoring isn\'t wired up yet — this is a preview score so you can see the flow.',
    vi: 'Chấm điểm trực tiếp chưa sẵn sàng — điểm bên dưới chỉ là bản xem trước.',
  } as Bilingual,
};
