// src/languages/thai/lessons-b2-core.ts
//
// Thai CEFR B2 ("core") lessons for Vietnamese-speaking and English-speaking
// learners.
//
// Shape mirrors the Italian B2 pack (src/languages/italian/lessons-b2.ts): the
// module is intentionally SELF-CONTAINED — it declares its own types inline and
// exports the B2 data array. The Thai vertical does not yet ship a shared
// `./lessons` registry or normalizer, so nothing here imports from a Thai
// foundation/index/normalize module (those are out of scope for this batch).
//
// Vietnamese-first: every lesson carries `l1_notes_vi` — the specific mistakes a
// Vietnamese speaker makes in Thai. Thai and Vietnamese are both tonal, mostly
// isolating languages with no verb inflection, so many structures transfer; the
// notes target where they DON'T (politeness particles, classifiers, register,
// pronoun choice, the serial-verb / topic-comment habits that leak across).
//
// B2 = "โต้แย้ง / ต่อรอง" (argue / negotiate): structured opinion, two-sided
// argument, nuance and hedging, service complaints, workplace negotiation,
// formal-vs-casual register, explaining a mistake, and longer connected turns.
//
// Romanization conventions (a readable scheme for both audiences):
//   - Tones marked on the syllable: (M)=mid, (L)=low, (F)=falling, (H)=high,
//     (R)=rising. Thai is tonal — the wrong tone is a different word.
//   - Long vowels doubled (aa, ee, oo); "ph/th/kh" are ASPIRATED p/t/k (a puff
//     of air), NOT "f/th-as-in-think/k+h". Plain "p/t/k" are UNaspirated.
//   - "dt" = unaspirated hard t (ต); "bp" = unaspirated hard p (ป); "ng" can
//     start a syllable (งง).
//   - Politeness particles: ครับ (kráp, male) / ค่ะ (kâ, female statement) /
//     คะ (ká, female question). They carry register, not meaning — drop them
//     and you sound blunt.
//
// Native review: DEFERRED. Content is hand-derived for pedagogy; it has NOT
// been validated by a native Thai reviewer.

// ── Types (inline — Thai vertical has no shared ./lessons yet) ───────────────

export type ThaiCategoryId =
  | "society"
  | "life_admin"
  | "work"
  | "expressions";

export type ThaiCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ThaiLessonSentence = {
  /** The Thai target sentence (the line the learner speaks). */
  th: string;
  /** Romanization with tone marks, for both audiences. */
  romanization: string;
  /** Vietnamese meaning. */
  vi: string;
  /** English meaning, for the secondary EN audience. */
  en: string;
  /** Pronunciation / grammar focus points, written for a Vietnamese ear. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
  pronunciation_focus_en?: string[];
};

export type ThaiVocabEntry = {
  /** Thai word. */
  word: string;
  /** Romanization with tone marks. */
  romanization: string;
  en: string;
  vi: string;
  pos: string;
};

export type ThaiDialogueLine = {
  speaker: string;
  text: string;
  romanization?: string;
  vi?: string;
  en?: string;
};

/** A Vietnamese-speaker L1-interference note: the mistake + the fix. */
export type ThaiL1Note = {
  /** The wrong form a Vietnamese learner tends to produce. */
  mistake: string;
  /** Why it happens / what the correct form is, in Vietnamese. */
  fix_vi: string;
  /** English companion for the EN audience. */
  fix_en?: string;
};

// Loosely typed so per-type exercise fields can vary (fill-blank / matching /
// translation), matching the Italian/French pack's Exercise contract.
export type ThaiExercise = Record<string, unknown>;

export type ThaiLesson = {
  id: string;
  category: ThaiCategoryId;
  level: ThaiCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: ThaiLessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  /** Vietnamese-first L1 interference notes — the heart of this pack. */
  l1_notes_vi?: ThaiL1Note[];
  vocabulary?: ThaiVocabEntry[];
  dialogue?: ThaiDialogueLine[];
  exercises?: ThaiExercise[];
};

// ── B2 lessons ───────────────────────────────────────────────────────────────

export const lessons: ThaiLesson[] = [
  // ── 1. Stating an opinion with a stance (society) ──────────────────────────
  {
    id: "thai_society_opinion_stance",
    level: "B2",
    category: "society",
    title_vi: "Nêu quan điểm có lập trường",
    title_en: "Stating an opinion with a clear stance",
    sentences: [
      {
        th: "ในความเห็นของผม การทำงานจากบ้านมีข้อดีมากกว่าข้อเสีย",
        romanization:
          "nai(M) khwaam(M)-hen(R) khɔ̌ɔng(R) phǒm(R), kaan(M)-tham(M)-ngaan(M) jàak(L) bâan(F) mii(M) khɔ̂ɔ(F)-dii(M) mâak(F) gwàa(L) khɔ̂ɔ(F)-sǐia(R)",
        vi: "Theo quan điểm của tôi, làm việc tại nhà có lợi nhiều hơn hại.",
        en: "In my opinion, working from home has more pros than cons.",
        pronunciation_focus: [
          "ความเห็น → khwaam-hen: 'kh' bật hơi, đừng đọc thành 'qu'",
          "มากกว่า → mâak(F) gwàa(L): so sánh 'hơn' đặt SAU tính từ",
        ],
        pronunciation_focus_en: [
          "ความเห็น → khwaam-hen: 'kh' is aspirated k, not English 'kw' fully",
          "มากกว่า → mâak gwàa: the comparative 'more than' follows the adjective",
        ],
      },
      {
        th: "ผมเชื่อว่าเรื่องนี้ขึ้นอยู่กับมุมมองของแต่ละคน",
        romanization:
          "phǒm(R) chʉ̂a(F) wâa(F) rʉ̂ang(F) níi(H) khʉ̂n(F)-yùu(L) gàp(L) mum(M)-mɔɔng(M) khɔ̌ɔng(R) tɛ̀ɛ(L)-lá(H)-khon(M)",
        vi: "Tôi tin rằng việc này tùy thuộc vào góc nhìn của mỗi người.",
        en: "I believe this depends on each person's perspective.",
        pronunciation_focus: [
          "เชื่อว่า → chʉ̂a wâa: 'rằng' — mệnh đề ý kiến luôn theo sau ว่า",
          "ขึ้นอยู่กับ → khʉ̂n-yùu gàp: cụm cố định 'tùy thuộc vào'",
        ],
        pronunciation_focus_en: [
          "เชื่อว่า → chʉ̂a wâa: 'that' — opinion clauses always follow ว่า",
          "ขึ้นอยู่กับ → khʉ̂n-yùu gàp: fixed chunk 'depends on'",
        ],
      },
      {
        th: "ถ้าให้ผมเลือก ผมจะสนับสนุนแนวทางนี้",
        romanization:
          "thâa(F) hâi(F) phǒm(R) lʉ̂ak(F), phǒm(R) jà(L) sà-nàp(L)-sà-nǔn(R) nɛɛw(M)-thaang(M) níi(H)",
        vi: "Nếu để tôi chọn, tôi sẽ ủng hộ hướng đi này.",
        en: "If it were up to me, I would support this approach.",
        pronunciation_focus: [
          "ถ้าให้ผมเลือก → thâa hâi … lʉ̂ak: khung điều kiện 'nếu để … chọn'",
          "สนับสนุน → sà-nàp-sà-nǔn: 4 âm tiết, đừng nuốt âm",
        ],
        pronunciation_focus_en: [
          "ถ้าให้ผมเลือก → thâa hâi … lʉ̂ak: conditional frame 'if it were up to me'",
          "สนับสนุน → sà-nàp-sà-nǔn: four syllables, don't swallow any",
        ],
      },
      {
        th: "อย่างไรก็ตาม ผมเข้าใจว่าบางคนอาจไม่เห็นด้วย",
        romanization:
          "yàang(L)-rai(M) gɔ̂ɔ(F)-dtaam(M), phǒm(R) khâo(F)-jai(M) wâa(F) baang(M)-khon(M) àat(L) mâi(F) hen(R)-dûai(F)",
        vi: "Tuy nhiên, tôi hiểu rằng một số người có thể không đồng ý.",
        en: "However, I understand that some people may disagree.",
        pronunciation_focus: [
          "อย่างไรก็ตาม → yàang-rai gɔ̂ɔ-dtaam: 'tuy nhiên' trang trọng",
          "ไม่เห็นด้วย → mâi hen-dûai: 'không đồng ý' (cố định)",
        ],
        pronunciation_focus_en: [
          "อย่างไรก็ตาม → yàang-rai gɔ̂ɔ-dtaam: formal 'however'",
          "ไม่เห็นด้วย → mâi hen-dûai: 'disagree' (fixed phrase)",
        ],
      },
      {
        th: "ด้วยเหตุนี้ ผมจึงคิดว่าควรลองดูก่อน",
        romanization:
          "dûai(F)-hèet(L) níi(H), phǒm(R) jʉng(M) khít(H) wâa(F) khuan(M) lɔɔng(M) duu(M) gɔ̀ɔn(L)",
        vi: "Vì lý do này, tôi nghĩ nên thử trước đã.",
        en: "For this reason, I think we should give it a try first.",
        pronunciation_focus: [
          "ด้วยเหตุนี้ → dûai-hèet níi: 'vì lý do này' — mở đầu kết luận",
          "จึง → jʉng: 'do đó/bèn', nối nguyên nhân → kết quả",
        ],
        pronunciation_focus_en: [
          "ด้วยเหตุนี้ → dûai-hèet níi: 'for this reason' — opens a conclusion",
          "จึง → jʉng: 'therefore', links cause → result",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở B2, người Thái mong đợi quan điểm CÓ KHUNG: 'ในความเห็นของผม/ดิฉัน…' (theo tôi) → lý do → 'อย่างไรก็ตาม…' (tuy nhiên, nhường một bước) → 'ด้วยเหตุนี้…' (kết luận). Luôn giữ particle ครับ/ค่ะ ở cuối câu khi trao đổi nghiêm túc — bỏ đi nghe cộc lốc. Tránh nói tuyệt đối ('luôn luôn', 'chắc chắn 100%'); người Thái coi giọng điệu nhường nhịn là trưởng thành.",
    cultural_notes_en:
      "At B2, Thai listeners expect a FRAMED opinion: 'ในความเห็นของผม/ดิฉัน…' (in my opinion) → reason → 'อย่างไรก็ตาม…' (however, concede a point) → 'ด้วยเหตุนี้…' (conclusion). Keep the ครับ/ค่ะ particle at the end in serious exchanges — dropping it sounds blunt. Avoid absolutes; a conceding tone reads as mature.",
    tip_advice_vi:
      "Học thuộc khung 4 bước: 'ในความเห็นของผม… / ผมเชื่อว่า… / อย่างไรก็ตาม… / ด้วยเหตุนี้…'. Nam dùng ผม, nữ dùng ดิฉัน (trang trọng) hoặc เรา (thân mật). Mỗi ý kiến cần MỘT lý do, nếu không chỉ là cảm tính.",
    tip_advice_en:
      "Memorize the 4-step frame: 'ในความเห็นของผม… / ผมเชื่อว่า… / อย่างไรก็ตาม… / ด้วยเหตุนี้…'. Men use ผม, women use ดิฉัน (formal) or เรา (casual). Every opinion needs ONE reason or it's just a feeling.",
    l1_notes_vi: [
      {
        mistake: "ผมคิด ดีมาก (bỏ ว่า).",
        fix_vi:
          "Mệnh đề ý kiến cần ว่า (wâa) nối: 'ผมคิดว่าดีมาก' (tôi nghĩ RẰNG rất tốt). Tiếng Việt hay bỏ 'rằng' nên người học quên — trong tiếng Thái ว่า gần như bắt buộc sau คิด/เชื่อ/รู้สึก.",
        fix_en:
          "Opinion clauses need ว่า (wâa) as a linker: 'ผมคิดว่าดีมาก'. Vietnamese drops 'that', so learners omit it — but ว่า is near-obligatory after think/believe/feel.",
      },
      {
        mistake: "Quên particle: 'ผมไม่เห็นด้วย' (cụt).",
        fix_vi:
          "Trong tranh luận lịch sự phải có ครับ/ค่ะ cuối câu: 'ผมไม่เห็นด้วยครับ'. Tiếng Việt dựa vào 'ạ' nhưng dùng ít hơn; trong tiếng Thái particle là bắt buộc xã giao, không phải tùy chọn.",
        fix_en:
          "Polite debate requires ครับ/ค่ะ at the end: 'ผมไม่เห็นด้วยครับ'. Vietnamese 'ạ' is used less often; in Thai the particle is socially obligatory, not optional.",
      },
    ],
    vocabulary: [
      { word: "ในความเห็นของผม", romanization: "nai khwaam-hen khɔ̌ɔng phǒm", en: "in my opinion (male)", vi: "theo quan điểm của tôi (nam)", pos: "phrase" },
      { word: "เชื่อว่า", romanization: "chʉ̂a wâa", en: "believe that", vi: "tin rằng", pos: "v." },
      { word: "ขึ้นอยู่กับ", romanization: "khʉ̂n-yùu gàp", en: "depend on", vi: "tùy thuộc vào", pos: "v." },
      { word: "สนับสนุน", romanization: "sà-nàp-sà-nǔn", en: "support / endorse", vi: "ủng hộ", pos: "v." },
      { word: "อย่างไรก็ตาม", romanization: "yàang-rai gɔ̂ɔ-dtaam", en: "however", vi: "tuy nhiên", pos: "conj." },
      { word: "เห็นด้วย", romanization: "hen-dûai", en: "agree", vi: "đồng ý", pos: "v." },
      { word: "ด้วยเหตุนี้", romanization: "dûai-hèet níi", en: "for this reason", vi: "vì lý do này", pos: "phrase" },
      { word: "มุมมอง", romanization: "mum-mɔɔng", en: "perspective", vi: "góc nhìn", pos: "n." },
    ],
    dialogue: [
      { speaker: "A", text: "คุณคิดยังไงกับการทำงานสี่วันต่อสัปดาห์ครับ", romanization: "khun khít yang-ngai gàp kaan-tham-ngaan sìi wan dtɔ̀ɔ sàp-daa kráp", en: "What do you think about a four-day work week?", vi: "Bạn nghĩ sao về tuần làm việc bốn ngày?" },
      { speaker: "B", text: "ในความเห็นของดิฉัน มันมีข้อดี แต่ขึ้นอยู่กับประเภทงานค่ะ", romanization: "nai khwaam-hen khɔ̌ɔng dì-chǎn, man mii khɔ̂ɔ-dii, dtɛ̀ɛ khʉ̂n-yùu gàp bprà-phêet ngaan kâ", en: "In my opinion it has advantages, but it depends on the type of work.", vi: "Theo tôi nó có lợi, nhưng tùy loại công việc." },
      { speaker: "A", text: "ผมเห็นด้วยครับ อย่างไรก็ตาม บางบริษัทอาจทำไม่ได้", romanization: "phǒm hen-dûai kráp, yàang-rai gɔ̂ɔ-dtaam, baang bɔɔ-rí-sàt àat tham mâi dâai", en: "I agree. However, some companies may not be able to do it.", vi: "Tôi đồng ý. Tuy nhiên, một số công ty có thể không làm được." },
    ],
    exercises: [
      { type: "fill-blank", question: "ผมคิด___ดีมากครับ (từ nối mệnh đề ý kiến)", answer: "ว่า", hint_vi: "sau คิด/เชื่อ cần ว่า", hint_en: "after think/believe use ว่า" },
      { type: "matching", pairs: [["อย่างไรก็ตาม", "tuy nhiên (however)"], ["ขึ้นอยู่กับ", "tùy thuộc vào (depend on)"], ["ด้วยเหตุนี้", "vì lý do này (for this reason)"]], instruction: "Nối từ với nghĩa", instruction_en: "Match the word with its meaning" },
      { type: "translation", vietnamese: "Theo tôi việc này tốt, tuy nhiên nó tùy thuộc vào mỗi người.", english: "In my opinion this is good, however it depends on each person.", thai: "ในความเห็นของผมเรื่องนี้ดี อย่างไรก็ตามมันขึ้นอยู่กับแต่ละคนครับ" },
    ],
  },

  // ── 2. Two-sided argument: pros and cons (society) ─────────────────────────
  {
    id: "thai_society_two_sided_argument",
    level: "B2",
    category: "society",
    title_vi: "Lập luận hai mặt: lợi và hại",
    title_en: "Two-sided argument: pros and cons",
    sentences: [
      {
        th: "ด้านหนึ่ง การใช้รถสาธารณะช่วยลดมลพิษ",
        romanization:
          "dâan(F) nʉ̀ng(L), kaan(M)-chái(H) rót(H) sǎa(R)-thaa(M)-rá-ná(H) chûai(F) lót(H) mon(M)-lá-phít(H)",
        vi: "Một mặt, dùng phương tiện công cộng giúp giảm ô nhiễm.",
        en: "On one hand, using public transport helps reduce pollution.",
        pronunciation_focus: [
          "ด้านหนึ่ง → dâan nʉ̀ng: 'một mặt' — mở vế thứ nhất",
          "สาธารณะ → sǎa-thaa-rá-ná: 4 âm, 'công cộng'",
        ],
        pronunciation_focus_en: [
          "ด้านหนึ่ง → dâan nʉ̀ng: 'on one hand' — opens the first side",
          "สาธารณะ → sǎa-thaa-rá-ná: four syllables, 'public'",
        ],
      },
      {
        th: "แต่อีกด้านหนึ่ง บางครั้งมันก็ไม่สะดวกเท่าไหร่",
        romanization:
          "dtɛ̀ɛ(L) ìik(L) dâan(F) nʉ̀ng(L), baang(M)-khráng(H) man(M) gɔ̂ɔ(F) mâi(F) sà-dùak(L) thâo(F)-rài(L)",
        vi: "Nhưng mặt khác, đôi khi nó cũng không tiện lắm.",
        en: "But on the other hand, sometimes it's not so convenient.",
        pronunciation_focus: [
          "อีกด้านหนึ่ง → ìik dâan nʉ̀ng: 'mặt khác'",
          "ไม่…เท่าไหร่ → mâi … thâo-rài: 'không … lắm' (giảm nhẹ)",
        ],
        pronunciation_focus_en: [
          "อีกด้านหนึ่ง → ìik dâan nʉ̀ng: 'on the other hand'",
          "ไม่…เท่าไหร่ → mâi … thâo-rài: 'not … much' (a softener)",
        ],
      },
      {
        th: "ยกตัวอย่างเช่น เวลาเร่งด่วนรถจะแน่นมาก",
        romanization:
          "yók(H)-dtua(M)-yàang(L) chên(F), wee(M)-laa(M) rêng(F)-dùan(L) rót(H) jà(L) nɛ̂ɛn(F) mâak(F)",
        vi: "Ví dụ như, vào giờ cao điểm xe rất đông.",
        en: "For example, during rush hour the buses are very crowded.",
        pronunciation_focus: [
          "ยกตัวอย่างเช่น → yók-dtua-yàang chên: 'ví dụ như' (cố định)",
          "เร่งด่วน → rêng-dùan: 'cao điểm/khẩn'",
        ],
        pronunciation_focus_en: [
          "ยกตัวอย่างเช่น → yók-dtua-yàang chên: 'for example' (fixed)",
          "เร่งด่วน → rêng-dùan: 'rush / urgent'",
        ],
      },
      {
        th: "ถึงอย่างนั้น ข้อดีก็ยังมีน้ำหนักมากกว่า",
        romanization:
          "thʉ̌ng(R) yàang(L) nán(H), khɔ̂ɔ(F)-dii(M) gɔ̂ɔ(F) yang(M) mii(M) nám(H)-nàk(L) mâak(F) gwàa(L)",
        vi: "Mặc dù vậy, ưu điểm vẫn có sức nặng hơn.",
        en: "Even so, the advantages still carry more weight.",
        pronunciation_focus: [
          "ถึงอย่างนั้น → thʉ̌ng yàang nán: 'mặc dù vậy'",
          "มีน้ำหนัก → mii nám-nàk: nghĩa bóng 'có sức nặng/quan trọng'",
        ],
        pronunciation_focus_en: [
          "ถึงอย่างนั้น → thʉ̌ng yàang nán: 'even so'",
          "มีน้ำหนัก → mii nám-nàk: figurative 'carries weight'",
        ],
      },
      {
        th: "โดยรวมแล้ว ผมจึงคิดว่ามันคุ้มค่าที่จะสนับสนุน",
        romanization:
          "dooi(M)-ruam(M) lɛ́ɛw(H), phǒm(R) jʉng(M) khít(H) wâa(F) man(M) khúm(H)-khâa(F) thîi(F) jà(L) sà-nàp-sà-nǔn(R)",
        vi: "Nhìn chung, vì vậy tôi nghĩ nó đáng để ủng hộ.",
        en: "Overall, I therefore think it's worth supporting.",
        pronunciation_focus: [
          "โดยรวมแล้ว → dooi-ruam lɛ́ɛw: 'nhìn chung' — mở kết luận",
          "คุ้มค่า → khúm-khâa: 'đáng (giá)'",
        ],
        pronunciation_focus_en: [
          "โดยรวมแล้ว → dooi-ruam lɛ́ɛw: 'overall' — opens conclusion",
          "คุ้มค่า → khúm-khâa: 'worth it'",
        ],
      },
    ],
    cultural_notes_vi:
      "Khung lập luận hai mặt chuẩn ở B2: 'ด้านหนึ่ง…' (một mặt) → 'แต่อีกด้านหนึ่ง…' (mặt khác) → 'ยกตัวอย่างเช่น…' (ví dụ) → 'ถึงอย่างนั้น…' (mặc dù vậy) → 'โดยรวมแล้ว…' (nhìn chung). Người Thái đánh giá cao việc bạn THỪA NHẬN mặt trái trước khi bảo vệ lập trường — nghe khách quan và đáng tin.",
    cultural_notes_en:
      "Standard two-sided frame at B2: 'ด้านหนึ่ง…' (on one hand) → 'แต่อีกด้านหนึ่ง…' (on the other) → 'ยกตัวอย่างเช่น…' (for example) → 'ถึงอย่างนั้น…' (even so) → 'โดยรวมแล้ว…' (overall). Thai listeners value that you ACKNOWLEDGE the downside before defending your stance — it sounds balanced and credible.",
    tip_advice_vi:
      "Mỗi vế phải có một BẰNG CHỨNG (ví dụ/số liệu). Đừng dồn hai ý vào một câu dài; tiếng Thái thích chuỗi câu ngắn nối bằng từ chuyển. Luân phiên แต่ / อย่างไรก็ตาม / ถึงอย่างนั้น để không lặp 'แต่'.",
    tip_advice_en:
      "Each side needs EVIDENCE (example/figure). Don't cram both into one long sentence; Thai prefers short clauses joined by transitions. Rotate แต่ / อย่างไรก็ตาม / ถึงอย่างนั้น so you don't lean on 'but'.",
    l1_notes_vi: [
      {
        mistake: "มัน convenient (chèn tiếng Anh / dịch sát).",
        fix_vi:
          "Dùng 'สะดวก' (sà-dùak = tiện) thay vì mượn từ. Người Việt hay dịch 'tiện lợi' thành cụm dài; trong tiếng Thái một từ 'สะดวก' là đủ.",
        fix_en:
          "Use 'สะดวก' (sà-dùak = convenient) rather than borrowing English. The single Thai word is enough.",
      },
      {
        mistake: "Đặt 'มากกว่า' sai chỗ: 'มากกว่ามีน้ำหนัก'.",
        fix_vi:
          "So sánh 'hơn' (มากกว่า) đứng SAU cụm bị so sánh: 'มีน้ำหนักมากกว่า'. Trật tự giống tiếng Việt 'có sức nặng hơn', đừng đảo lên trước.",
        fix_en:
          "The comparative มากกว่า follows what's compared: 'มีน้ำหนักมากกว่า' (carries weight more). Don't front it.",
      },
    ],
    vocabulary: [
      { word: "ด้านหนึ่ง", romanization: "dâan nʉ̀ng", en: "on one hand", vi: "một mặt", pos: "phrase" },
      { word: "อีกด้านหนึ่ง", romanization: "ìik dâan nʉ̀ng", en: "on the other hand", vi: "mặt khác", pos: "phrase" },
      { word: "ยกตัวอย่าง", romanization: "yók-dtua-yàang", en: "give an example", vi: "nêu ví dụ", pos: "v." },
      { word: "สะดวก", romanization: "sà-dùak", en: "convenient", vi: "tiện lợi", pos: "adj." },
      { word: "ถึงอย่างนั้น", romanization: "thʉ̌ng yàang nán", en: "even so", vi: "mặc dù vậy", pos: "conj." },
      { word: "คุ้มค่า", romanization: "khúm-khâa", en: "worth it", vi: "đáng giá", pos: "adj." },
      { word: "โดยรวมแล้ว", romanization: "dooi-ruam lɛ́ɛw", en: "overall", vi: "nhìn chung", pos: "phrase" },
      { word: "ข้อเสีย", romanization: "khɔ̂ɔ-sǐia", en: "drawback", vi: "nhược điểm", pos: "n." },
    ],
    dialogue: [
      { speaker: "A", text: "ย้ายไปอยู่ต่างจังหวัดดีไหมครับ", romanization: "yáai bpai yùu dtàang-jang-wàt dii mǎi kráp", en: "Is moving to the provinces a good idea?", vi: "Chuyển về tỉnh sống có tốt không?" },
      { speaker: "B", text: "ด้านหนึ่งค่าครองชีพถูกกว่า แต่อีกด้านหนึ่งงานก็หายากค่ะ", romanization: "dâan nʉ̀ng khâa-khrɔɔng-chîip thùuk gwàa, dtɛ̀ɛ ìik dâan nʉ̀ng ngaan gɔ̂ɔ hǎa-yâak kâ", en: "On one hand the cost of living is cheaper, but on the other jobs are hard to find.", vi: "Một mặt chi phí sống rẻ hơn, nhưng mặt khác việc làm khó tìm." },
      { speaker: "A", text: "ถึงอย่างนั้น โดยรวมแล้วคุณภาพชีวิตน่าจะดีกว่านะครับ", romanization: "thʉ̌ng yàang nán, dooi-ruam lɛ́ɛw khun-ná-phâap chii-wít nâa-jà dii gwàa ná kráp", en: "Even so, overall the quality of life is probably better.", vi: "Mặc dù vậy, nhìn chung chất lượng sống chắc tốt hơn." },
    ],
    exercises: [
      { type: "fill-blank", question: "___ ค่าครองชีพถูก แต่อีกด้านหนึ่งงานหายาก (mở vế thứ nhất)", answer: "ด้านหนึ่ง", hint_vi: "'một mặt'", hint_en: "'on one hand'" },
      { type: "matching", pairs: [["ถึงอย่างนั้น", "mặc dù vậy (even so)"], ["คุ้มค่า", "đáng giá (worth it)"], ["ยกตัวอย่าง", "nêu ví dụ (give an example)"]], instruction: "Nối từ với nghĩa", instruction_en: "Match the word with its meaning" },
      { type: "translation", vietnamese: "Một mặt nó rẻ, nhưng mặt khác nó không tiện. Nhìn chung tôi nghĩ nó đáng giá.", english: "On one hand it's cheap, but on the other it's not convenient. Overall I think it's worth it.", thai: "ด้านหนึ่งมันถูก แต่อีกด้านหนึ่งมันไม่สะดวก โดยรวมแล้วผมคิดว่ามันคุ้มค่าครับ" },
    ],
  },

  // ── 3. Agreeing and disagreeing politely (society) ─────────────────────────
  {
    id: "thai_society_agree_disagree",
    level: "B2",
    category: "society",
    title_vi: "Đồng ý và phản đối một cách lịch sự",
    title_en: "Agreeing and disagreeing politely",
    sentences: [
      {
        th: "ผมเห็นด้วยกับคุณในระดับหนึ่ง",
        romanization:
          "phǒm(R) hen(R)-dûai(F) gàp(L) khun(M) nai(M) rá-dàp(L) nʉ̀ng(L)",
        vi: "Tôi đồng ý với bạn ở một mức độ nào đó.",
        en: "I agree with you to some extent.",
        pronunciation_focus: [
          "ในระดับหนึ่ง → nai rá-dàp nʉ̀ng: 'ở một mức độ' — đồng ý nửa vời",
          "เห็นด้วยกับ → hen-dûai gàp: 'đồng ý VỚI ai'",
        ],
        pronunciation_focus_en: [
          "ในระดับหนึ่ง → nai rá-dàp nʉ̀ng: 'to some extent' — partial agreement",
          "เห็นด้วยกับ → hen-dûai gàp: 'agree WITH someone'",
        ],
      },
      {
        th: "ตรงนี้ผมขอเห็นต่างนิดหนึ่งนะครับ",
        romanization:
          "dtrong(M) níi(H) phǒm(R) khɔ̌ɔ(R) hen(R)-dtàang(L) nít(H)-nʉ̀ng(L) ná(H) kráp",
        vi: "Ở điểm này, cho phép tôi có quan điểm khác một chút nhé.",
        en: "On this point, allow me to differ slightly.",
        pronunciation_focus: [
          "ขอเห็นต่าง → khɔ̌ɔ hen-dtàang: 'xin phép khác ý' — phản đối mềm",
          "นิดหนึ่ง → nít-nʉ̀ng: 'một chút' — giảm va chạm",
        ],
        pronunciation_focus_en: [
          "ขอเห็นต่าง → khɔ̌ɔ hen-dtàang: 'may I differ' — soft disagreement",
          "นิดหนึ่ง → nít-nʉ̀ng: 'a little' — softens the clash",
        ],
      },
      {
        th: "ผมเข้าใจมุมมองของคุณ แต่ผมมองอีกแบบ",
        romanization:
          "phǒm(R) khâo(F)-jai(M) mum(M)-mɔɔng(M) khɔ̌ɔng(R) khun(M), dtɛ̀ɛ(L) phǒm(R) mɔɔng(M) ìik(L) bɛ̀ɛp(L)",
        vi: "Tôi hiểu góc nhìn của bạn, nhưng tôi nhìn theo cách khác.",
        en: "I understand your view, but I see it differently.",
        pronunciation_focus: [
          "เข้าใจมุมมอง → khâo-jai mum-mɔɔng: công nhận trước khi phản bác",
          "มองอีกแบบ → mɔɔng ìik bɛ̀ɛp: 'nhìn theo kiểu khác'",
        ],
        pronunciation_focus_en: [
          "เข้าใจมุมมอง → khâo-jai mum-mɔɔng: acknowledge before you counter",
          "มองอีกแบบ → mɔɔng ìik bɛ̀ɛp: 'see it another way'",
        ],
      },
      {
        th: "ถ้าจะให้พูดตรงๆ ผมไม่ค่อยแน่ใจเรื่องนี้",
        romanization:
          "thâa(F) jà(L) hâi(F) phûut(F) dtrong(M)-dtrong(M), phǒm(R) mâi(F) khɔ̂i(F) nɛ̂ɛ(F)-jai(M) rʉ̂ang(F) níi(H)",
        vi: "Nói thẳng ra thì tôi không chắc lắm về việc này.",
        en: "To be frank, I'm not really sure about this.",
        pronunciation_focus: [
          "พูดตรงๆ → phûut dtrong-dtrong: 'nói thẳng' — báo trước phản đối",
          "ไม่ค่อย → mâi khɔ̂i: 'không … lắm' (giảm nhẹ)",
        ],
        pronunciation_focus_en: [
          "พูดตรงๆ → phûut dtrong-dtrong: 'to be frank' — flags disagreement",
          "ไม่ค่อย → mâi khɔ̂i: 'not really' (softener)",
        ],
      },
      {
        th: "งั้นเรามาหาจุดที่เห็นตรงกันดีกว่า",
        romanization:
          "ngán(H) rao(M) maa(M) hǎa(R) jùt(L) thîi(F) hen(R) dtrong(M) gan(M) dii(M) gwàa(L)",
        vi: "Vậy thì chúng ta tìm điểm chung sẽ tốt hơn.",
        en: "Then let's find common ground instead.",
        pronunciation_focus: [
          "หาจุดที่เห็นตรงกัน → hǎa jùt … hen dtrong gan: 'tìm điểm đồng thuận'",
          "ดีกว่า → dii gwàa: 'thì hơn' — đề xuất nhẹ",
        ],
        pronunciation_focus_en: [
          "หาจุดที่เห็นตรงกัน → hǎa jùt … hen dtrong gan: 'find common ground'",
          "ดีกว่า → dii gwàa: 'would be better' — soft proposal",
        ],
      },
    ],
    cultural_notes_vi:
      "Phản đối thẳng ('คุณผิด' = bạn sai) là điều cấm kỵ trong văn hóa Thái 'giữ thể diện'. Luôn đệm: 'เห็นด้วยในระดับหนึ่ง' (đồng ý phần nào) → 'แต่ผมมองอีกแบบ' (nhưng tôi nhìn khác) → 'ขอเห็นต่างนิดหนึ่ง' (xin phép khác chút). Thêm นะ (ná) làm câu mềm đi rõ rệt.",
    cultural_notes_en:
      "Blunt contradiction ('คุณผิด' = you're wrong) is taboo in face-saving Thai culture. Always cushion: 'เห็นด้วยในระดับหนึ่ง' (agree partly) → 'แต่ผมมองอีกแบบ' (but I see it differently) → 'ขอเห็นต่างนิดหนึ่ง' (may I differ a little). Adding นะ (ná) noticeably softens the line.",
    tip_advice_vi:
      "Công thức bất đồng an toàn: CÔNG NHẬN ('ผมเข้าใจ…') → ĐỆM ('แต่…นิดหนึ่ง') → ĐỀ XUẤT ('หาจุดที่เห็นตรงกันดีกว่า'). Không bao giờ bắt đầu bằng 'ไม่' trống không.",
    tip_advice_en:
      "Safe disagreement formula: ACKNOWLEDGE ('ผมเข้าใจ…') → CUSHION ('แต่…นิดหนึ่ง') → PROPOSE ('หาจุดที่เห็นตรงกันดีกว่า'). Never open with a bare 'ไม่' (no).",
    l1_notes_vi: [
      {
        mistake: "คุณผิด / ไม่ใช่ (phản đối thẳng).",
        fix_vi:
          "Quá thẳng với người Thái. Dùng 'ผมขอเห็นต่าง' hoặc 'ผมมองอีกแบบ'. Người Việt cũng tránh nói thẳng, nhưng trong tiếng Thái mức độ đệm cao hơn nhiều — gần như luôn cần นะครับ/นะคะ.",
        fix_en:
          "Too direct in Thai. Use 'ผมขอเห็นต่าง' or 'ผมมองอีกแบบ'. The cushioning expected in Thai is heavier — almost always add นะครับ/นะคะ.",
      },
      {
        mistake: "เห็นด้วย คุณ (thiếu กับ).",
        fix_vi:
          "'Đồng ý với ai' cần giới từ กับ: 'เห็นด้วยกับคุณ'. Tiếng Việt 'đồng ý với' cũng có 'với', đừng bỏ — người học hay nuốt mất.",
        fix_en:
          "'Agree with someone' needs กับ: 'เห็นด้วยกับคุณ'. Don't drop the preposition.",
      },
    ],
    vocabulary: [
      { word: "ในระดับหนึ่ง", romanization: "nai rá-dàp nʉ̀ng", en: "to some extent", vi: "ở một mức độ nào đó", pos: "phrase" },
      { word: "เห็นต่าง", romanization: "hen-dtàang", en: "to differ / disagree", vi: "có quan điểm khác", pos: "v." },
      { word: "มุมมอง", romanization: "mum-mɔɔng", en: "viewpoint", vi: "góc nhìn", pos: "n." },
      { word: "พูดตรงๆ", romanization: "phûut dtrong-dtrong", en: "to be frank", vi: "nói thẳng", pos: "phrase" },
      { word: "ไม่ค่อย", romanization: "mâi khɔ̂i", en: "not really", vi: "không … lắm", pos: "adv." },
      { word: "จุดที่เห็นตรงกัน", romanization: "jùt thîi hen dtrong gan", en: "common ground", vi: "điểm chung", pos: "n." },
      { word: "แน่ใจ", romanization: "nɛ̂ɛ-jai", en: "sure / certain", vi: "chắc chắn", pos: "adj." },
    ],
    dialogue: [
      { speaker: "A", text: "ผมว่าเราควรลดราคาเลยนะครับ", romanization: "phǒm wâa rao khuan lót raa-khaa looei ná kráp", en: "I think we should just cut the price.", vi: "Tôi nghĩ ta nên giảm giá luôn." },
      { speaker: "B", text: "ผมเข้าใจมุมมองของคุณ แต่ขอเห็นต่างนิดหนึ่งนะครับ", romanization: "phǒm khâo-jai mum-mɔɔng khɔ̌ɔng khun, dtɛ̀ɛ khɔ̌ɔ hen-dtàang nít-nʉ̀ng ná kráp", en: "I understand your view, but allow me to differ a little.", vi: "Tôi hiểu góc nhìn của bạn, nhưng cho phép tôi khác ý một chút." },
      { speaker: "B", text: "งั้นเรามาหาจุดที่เห็นตรงกันดีกว่าครับ", romanization: "ngán rao maa hǎa jùt thîi hen dtrong gan dii gwàa kráp", en: "Then let's find common ground instead.", vi: "Vậy ta tìm điểm chung sẽ tốt hơn." },
    ],
    exercises: [
      { type: "fill-blank", question: "ผมเห็นด้วย___คุณครับ (giới từ)", answer: "กับ", hint_vi: "'đồng ý VỚI'", hint_en: "'agree WITH'" },
      { type: "matching", pairs: [["เห็นต่าง", "khác quan điểm (differ)"], ["ในระดับหนึ่ง", "ở mức độ nào đó (to some extent)"], ["จุดที่เห็นตรงกัน", "điểm chung (common ground)"]], instruction: "Nối từ với nghĩa", instruction_en: "Match the word with its meaning" },
      { type: "translation", vietnamese: "Tôi hiểu bạn, nhưng nói thẳng thì tôi không chắc lắm.", english: "I understand you, but to be frank I'm not really sure.", thai: "ผมเข้าใจคุณ แต่ถ้าจะให้พูดตรงๆ ผมไม่ค่อยแน่ใจครับ" },
    ],
  },

  // ── 4. Service complaint: restaurant / hotel (life_admin) ──────────────────
  {
    id: "thai_life_admin_service_complaint",
    level: "B2",
    category: "life_admin",
    title_vi: "Phàn nàn dịch vụ: nhà hàng / khách sạn",
    title_en: "Service complaint: restaurant / hotel",
    sentences: [
      {
        th: "ขอโทษนะครับ ผมว่าน่าจะมีอะไรผิดพลาดนิดหน่อย",
        romanization:
          "khɔ̌ɔ(R)-thôot(F) ná(H) kráp, phǒm(R) wâa(F) nâa(F)-jà(L) mii(M) à-rai(M) phìt(L)-phlâat(F) nít(H)-nɔ̀i(L)",
        vi: "Xin lỗi nhé, tôi nghĩ có lẽ có chút nhầm lẫn.",
        en: "Excuse me, I think there might be a small mistake.",
        pronunciation_focus: [
          "น่าจะมีอะไรผิดพลาด → nâa-jà mii à-rai phìt-phlâat: 'có lẽ có gì sai' — đổ lỗi gián tiếp",
          "Mở bằng ขอโทษ + นิดหน่อย để giảm căng",
        ],
        pronunciation_focus_en: [
          "น่าจะมีอะไรผิดพลาด → nâa-jà mii à-rai phìt-phlâat: 'there might be a mistake' — blame nobody directly",
          "Open with ขอโทษ + นิดหน่อย to defuse tension",
        ],
      },
      {
        th: "อาหารที่สั่งไปยังไม่ได้เลย รอเกือบชั่วโมงแล้วครับ",
        romanization:
          "aa(M)-hǎan(R) thîi(F) sàng(L) bpai(M) yang(M) mâi(F) dâai(F) looei(M), rɔɔ(M) gʉ̀ap(L) chûa(F)-moong(M) lɛ́ɛw(H) kráp",
        vi: "Món tôi gọi vẫn chưa có, đợi gần một tiếng rồi.",
        en: "The food we ordered still hasn't come — we've waited nearly an hour.",
        pronunciation_focus: [
          "ยัง…เลย → yang … looei: 'vẫn chưa … gì cả' (nhấn)",
          "เกือบชั่วโมง → gʉ̀ap chûa-moong: nêu sự việc cụ thể, không cảm thán",
        ],
        pronunciation_focus_en: [
          "ยัง…เลย → yang … looei: 'still hasn't … at all' (emphatic)",
          "เกือบชั่วโมง → gʉ̀ap chûa-moong: state the fact, don't dramatize",
        ],
      },
      {
        th: "รบกวนช่วยตรวจสอบให้หน่อยได้ไหมครับ",
        romanization:
          "róp(H)-guan(M) chûai(F) dtrùat(L)-sɔ̀ɔp(L) hâi(F) nɔ̀i(L) dâai(F) mǎi(R) kráp",
        vi: "Phiền bạn kiểm tra giúp tôi được không?",
        en: "Could I trouble you to check on it, please?",
        pronunciation_focus: [
          "รบกวน → róp-guan: 'làm phiền' — mở yêu cầu lịch sự",
          "…ได้ไหม → … dâai mǎi: biến mệnh lệnh thành câu hỏi",
        ],
        pronunciation_focus_en: [
          "รบกวน → róp-guan: 'may I trouble you' — polite request opener",
          "…ได้ไหม → … dâai mǎi: turns an order into a question",
        ],
      },
      {
        th: "ถ้าเป็นไปได้ ขอเปลี่ยนใหม่หรือลดราคาได้ไหมครับ",
        romanization:
          "thâa(F) bpen(M)-bpai(M)-dâai(F), khɔ̌ɔ(R) bplìan(L) mài(L) rʉ̌ʉ(R) lót(H) raa(M)-khaa(M) dâai(F) mǎi(R) kráp",
        vi: "Nếu được, cho tôi đổi mới hoặc giảm giá được không?",
        en: "If possible, could you replace it or give a discount?",
        pronunciation_focus: [
          "ถ้าเป็นไปได้ → thâa bpen-bpai-dâai: 'nếu được' — đề nghị mềm",
          "ขอ…ได้ไหม → khɔ̌ɔ … dâai mǎi: nêu hai phương án giải quyết",
        ],
        pronunciation_focus_en: [
          "ถ้าเป็นไปได้ → thâa bpen-bpai-dâai: 'if possible' — soft request",
          "ขอ…ได้ไหม → khɔ̌ɔ … dâai mǎi: offer two resolutions",
        ],
      },
      {
        th: "ขอบคุณที่ช่วยแก้ไขให้นะครับ",
        romanization:
          "khɔ̀ɔp(L)-khun(M) thîi(F) chûai(F) gɛ̂ɛ(F)-khǎi(R) hâi(F) ná(H) kráp",
        vi: "Cảm ơn vì đã giúp khắc phục nhé.",
        en: "Thank you for sorting it out.",
        pronunciation_focus: [
          "Kết bằng lời cảm ơn — giữ quan hệ tốt sau khi phàn nàn",
          "แก้ไข → gɛ̂ɛ-khǎi: 'sửa/khắc phục'",
        ],
        pronunciation_focus_en: [
          "Close with thanks — preserve the relationship after complaining",
          "แก้ไข → gɛ̂ɛ-khǎi: 'fix / resolve'",
        ],
      },
    ],
    cultural_notes_vi:
      "Người Thái cực kỳ coi trọng 'ไม่เสียหน้า' (không mất mặt) và 'ใจเย็น' (giữ bình tĩnh). Phàn nàn mà lớn tiếng = bạn thua, dù đúng. Công thức: ขอโทษ (xin lỗi mở đầu) → nêu SỰ VIỆC khách quan → รบกวน…ได้ไหม (nhờ kiểm tra) → ขอ…ได้ไหม (đề xuất giải pháp) → ขอบคุณ. Mỉm cười và giọng đều giúp được việc hơn là gay gắt.",
    cultural_notes_en:
      "Thai culture prizes 'not losing face' and staying 'ใจเย็น' (cool-hearted). Raising your voice means you lose, even when you're right. Formula: ขอโทษ (open with sorry) → state the FACT neutrally → รบกวน…ได้ไหม (ask them to check) → ขอ…ได้ไหม (propose a fix) → ขอบคุณ. A smile and an even tone get more done than anger.",
    tip_advice_vi:
      "Đừng dùng 'คุณ' kèm giọng buộc tội. Nêu sự việc ('อาหารยังไม่มา'), không nêu con người ('คุณช้า'). Luôn đóng khung yêu cầu bằng …ได้ไหมครับ/คะ.",
    tip_advice_en:
      "Don't pair 'คุณ' (you) with an accusing tone. State the situation ('the food hasn't come'), not the person ('you're slow'). Always frame the request with …ได้ไหมครับ/คะ.",
    l1_notes_vi: [
      {
        mistake: "คุณช้ามาก! (chỉ trích trực tiếp).",
        fix_vi:
          "Tránh đổ lỗi cá nhân. Nói sự việc: 'อาหารยังไม่มาเลยครับ'. Người Việt khi bực hay nói thẳng 'sao chậm thế', nhưng trong tiếng Thái điều đó làm cả hai mất mặt và nhân viên sẽ phòng thủ.",
        fix_en:
          "Avoid personal blame. State the fact: 'the food still hasn't come'. Direct blame makes both sides lose face and the staff defensive.",
      },
      {
        mistake: "เปลี่ยน! / ลดราคา! (mệnh lệnh trống).",
        fix_vi:
          "Biến thành câu hỏi nhờ vả: 'ขอเปลี่ยนใหม่ได้ไหมครับ'. Tiếng Thái rất ít dùng mệnh lệnh trần; thiếu ขอ…ได้ไหม nghe như ra lệnh.",
        fix_en:
          "Turn it into a request question: 'could I have it replaced?'. Bare imperatives sound like orders; use ขอ…ได้ไหม.",
      },
    ],
    vocabulary: [
      { word: "ผิดพลาด", romanization: "phìt-phlâat", en: "mistake / error", vi: "nhầm lẫn / sai sót", pos: "n./v." },
      { word: "รบกวน", romanization: "róp-guan", en: "to trouble (politely)", vi: "làm phiền", pos: "v." },
      { word: "ตรวจสอบ", romanization: "dtrùat-sɔ̀ɔp", en: "to check / verify", vi: "kiểm tra", pos: "v." },
      { word: "เปลี่ยน", romanization: "bplìan", en: "to change / replace", vi: "đổi", pos: "v." },
      { word: "ลดราคา", romanization: "lót raa-khaa", en: "to discount", vi: "giảm giá", pos: "v." },
      { word: "แก้ไข", romanization: "gɛ̂ɛ-khǎi", en: "to fix / resolve", vi: "khắc phục", pos: "v." },
      { word: "ถ้าเป็นไปได้", romanization: "thâa bpen-bpai-dâai", en: "if possible", vi: "nếu có thể", pos: "phrase" },
    ],
    dialogue: [
      { speaker: "ลูกค้า (Khách)", text: "ขอโทษนะครับ อาหารที่สั่งยังไม่มาเลย รอเกือบชั่วโมงแล้ว", romanization: "khɔ̌ɔ-thôot ná kráp, aa-hǎan thîi sàng yang mâi maa looei, rɔɔ gʉ̀ap chûa-moong lɛ́ɛw", en: "Excuse me, the food we ordered still hasn't come; we've waited nearly an hour.", vi: "Xin lỗi, món gọi vẫn chưa ra, đợi gần một tiếng rồi." },
      { speaker: "พนักงาน (NV)", text: "ต้องขออภัยจริงๆ ค่ะ เดี๋ยวดิฉันไปตรวจสอบให้ทันทีนะคะ", romanization: "dtɔ̂ng khɔ̌ɔ-à-phai jing-jing kâ, dǐao dì-chǎn bpai dtrùat-sɔ̀ɔp hâi than-thii ná ká", en: "I'm truly sorry; I'll go check on it right away.", vi: "Thành thật xin lỗi, tôi đi kiểm tra ngay đây." },
      { speaker: "ลูกค้า (Khách)", text: "ถ้าเป็นไปได้ ขอลดราคาหน่อยได้ไหมครับ ขอบคุณที่ช่วยแก้ไขนะครับ", romanization: "thâa bpen-bpai-dâai, khɔ̌ɔ lót raa-khaa nɔ̀i dâai mǎi kráp, khɔ̀ɔp-khun thîi chûai gɛ̂ɛ-khǎi ná kráp", en: "If possible, could you give a small discount? Thanks for sorting it out.", vi: "Nếu được, giảm giá chút được không? Cảm ơn đã khắc phục." },
    ],
    exercises: [
      { type: "fill-blank", question: "___ ช่วยตรวจสอบให้หน่อยได้ไหมครับ (mở yêu cầu lịch sự)", answer: "รบกวน", hint_vi: "'làm phiền'", hint_en: "'may I trouble you'" },
      { type: "matching", pairs: [["แก้ไข", "khắc phục (fix)"], ["ตรวจสอบ", "kiểm tra (check)"], ["ผิดพลาด", "nhầm lẫn (mistake)"]], instruction: "Nối từ với nghĩa", instruction_en: "Match the word with its meaning" },
      { type: "translation", vietnamese: "Xin lỗi, nếu được cho tôi đổi món mới được không?", english: "Excuse me, if possible could I have it replaced?", thai: "ขอโทษนะครับ ถ้าเป็นไปได้ ขอเปลี่ยนใหม่ได้ไหมครับ" },
    ],
  },

  // ── 5. Product / refund complaint (life_admin) ─────────────────────────────
  {
    id: "thai_life_admin_refund_complaint",
    level: "B2",
    category: "life_admin",
    title_vi: "Khiếu nại sản phẩm và yêu cầu hoàn tiền",
    title_en: "Product complaint and asking for a refund",
    sentences: [
      {
        th: "สินค้าที่ได้รับมีปัญหา ใช้งานได้ไม่ถึงสัปดาห์ก็เสีย",
        romanization:
          "sǐn(R)-kháa(H) thîi(F) dâai(F)-ráp(H) mii(M) bpan(M)-hǎa(R), chái(H)-ngaan(M) dâai(F) mâi(F) thʉ̌ng(R) sàp(L)-daa(M) gɔ̂ɔ(F) sǐia(R)",
        vi: "Sản phẩm tôi nhận bị lỗi, dùng chưa đến một tuần đã hỏng.",
        en: "The product I received has a problem; it broke within a week of use.",
        pronunciation_focus: [
          "ได้รับ → dâai-ráp: 'nhận được'",
          "ไม่ถึงสัปดาห์ → mâi thʉ̌ng sàp-daa: 'chưa đến một tuần' — bằng chứng cụ thể",
        ],
        pronunciation_focus_en: [
          "ได้รับ → dâai-ráp: 'to receive'",
          "ไม่ถึงสัปดาห์ → mâi thʉ̌ng sàp-daa: 'less than a week' — concrete evidence",
        ],
      },
      {
        th: "ผมมีใบเสร็จและรูปถ่ายเป็นหลักฐานครับ",
        romanization:
          "phǒm(R) mii(M) bai(M)-sèt(L) lɛ́(H) rûup(F)-thàai(L) bpen(M) làk(L)-thǎan(R) kráp",
        vi: "Tôi có hóa đơn và ảnh chụp làm bằng chứng.",
        en: "I have the receipt and photos as evidence.",
        pronunciation_focus: [
          "ใบเสร็จ → bai-sèt: 'hóa đơn'",
          "หลักฐาน → làk-thǎan: 'bằng chứng' — nâng độ tin cậy",
        ],
        pronunciation_focus_en: [
          "ใบเสร็จ → bai-sèt: 'receipt'",
          "หลักฐาน → làk-thǎan: 'evidence' — strengthens your claim",
        ],
      },
      {
        th: "ตามนโยบาย สินค้าที่ชำรุดควรเปลี่ยนหรือคืนเงินได้",
        romanization:
          "dtaam(M) ná-yoo(M)-baai(M), sǐn(R)-kháa(H) thîi(F) cham(M)-rút(H) khuan(M) bplìan(L) rʉ̌ʉ(R) khʉʉn(M)-ngən(M) dâai(F)",
        vi: "Theo chính sách, hàng bị lỗi nên được đổi hoặc hoàn tiền.",
        en: "According to policy, faulty goods should be replaceable or refundable.",
        pronunciation_focus: [
          "ตามนโยบาย → dtaam ná-yoo-baai: 'theo chính sách' — viện dẫn quy định",
          "คืนเงิน → khʉʉn-ngən: 'hoàn tiền'",
        ],
        pronunciation_focus_en: [
          "ตามนโยบาย → dtaam ná-yoo-baai: 'according to policy' — cite the rule",
          "คืนเงิน → khʉʉn-ngən: 'refund'",
        ],
      },
      {
        th: "ผมจึงอยากขอคืนเงินเต็มจำนวนครับ",
        romanization:
          "phǒm(R) jʉng(M) yàak(L) khɔ̌ɔ(R) khʉʉn(M)-ngən(M) dtem(M) jam(M)-nuan(M) kráp",
        vi: "Vì vậy tôi muốn xin hoàn lại toàn bộ số tiền.",
        en: "I'd therefore like to request a full refund.",
        pronunciation_focus: [
          "เต็มจำนวน → dtem jam-nuan: 'toàn bộ số tiền' — nêu rõ yêu cầu",
          "จึง → jʉng: nối lý do → yêu cầu",
        ],
        pronunciation_focus_en: [
          "เต็มจำนวน → dtem jam-nuan: 'the full amount' — state the ask clearly",
          "จึง → jʉng: links reason → request",
        ],
      },
      {
        th: "ไม่ทราบว่าต้องดำเนินการอย่างไรต่อครับ",
        romanization:
          "mâi(F) sâap(F) wâa(F) dtɔ̂ng(F) dam(M)-nəən(M)-gaan(M) yàang(L)-rai(M) dtɔ̀ɔ(L) kráp",
        vi: "Không biết tôi cần làm thủ tục tiếp theo thế nào ạ?",
        en: "May I ask what the next steps are?",
        pronunciation_focus: [
          "ไม่ทราบว่า → mâi sâap wâa: 'không biết là' — cách hỏi rất lịch sự",
          "ดำเนินการ → dam-nəən-gaan: 'tiến hành thủ tục' (trang trọng)",
        ],
        pronunciation_focus_en: [
          "ไม่ทราบว่า → mâi sâap wâa: 'I wonder if' — a very polite question opener",
          "ดำเนินการ → dam-nəən-gaan: 'to proceed / process' (formal)",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi khiếu nại chính thức (cửa hàng, tổng đài), người Thái chuyển sang đăng ký TRANG TRỌNG: dùng ทราบ (biết) thay รู้, ดำเนินการ thay ทำ. Trình tự thuyết phục: nêu LỖI → đưa หลักฐาน (bằng chứng) → viện ตามนโยบาย (chính sách) → nêu yêu cầu rõ → hỏi bước tiếp theo. Có giấy tờ + giọng điềm tĩnh là vũ khí mạnh nhất.",
    cultural_notes_en:
      "For formal complaints (shop, hotline), Thai shifts to a FORMAL register: ทราบ instead of รู้ (know), ดำเนินการ instead of ทำ (do). Persuasive order: state the FAULT → present หลักฐาน (evidence) → cite ตามนโยบาย (policy) → state the ask clearly → ask for next steps. Documents plus a calm tone are your strongest tools.",
    tip_advice_vi:
      "Nêu yêu cầu CỤ THỂ ('คืนเงินเต็มจำนวน' = hoàn toàn bộ), đừng nói chung chung 'giúp tôi'. Kết bằng câu hỏi thủ tục để nhân viên không thể lảng tránh.",
    tip_advice_en:
      "Make the ask SPECIFIC ('full refund'), not vague ('help me'). Close with a procedural question so staff can't dodge.",
    l1_notes_vi: [
      {
        mistake: "ผมรู้ว่า… (dùng รู้ trong ngữ cảnh trang trọng).",
        fix_vi:
          "Với nhân viên/cơ quan dùng ทราบ (sâap): 'ผมทราบว่า…', 'ไม่ทราบว่า…'. รู้ là thân mật. Tiếng Việt không phân tầng động từ 'biết', nên người học dễ dùng sai đăng ký.",
        fix_en:
          "With staff/officials use ทราบ (sâap), not รู้ (rúu): 'ไม่ทราบว่า…'. Vietnamese has no formal/casual split for 'know', so register slips easily.",
      },
      {
        mistake: "อยากได้เงิน (mơ hồ).",
        fix_vi:
          "Nói rõ 'ขอคืนเงินเต็มจำนวน'. Yêu cầu mơ hồ dễ bị từ chối; cụm cố định 'คืนเงิน/เปลี่ยนสินค้า' giúp đối phương hành động ngay.",
        fix_en:
          "Be explicit: 'ขอคืนเงินเต็มจำนวน' (full refund). Vague asks get deflected; fixed phrases let staff act.",
      },
    ],
    vocabulary: [
      { word: "สินค้า", romanization: "sǐn-kháa", en: "product / goods", vi: "sản phẩm / hàng hóa", pos: "n." },
      { word: "ชำรุด", romanization: "cham-rút", en: "faulty / broken", vi: "bị lỗi / hỏng", pos: "adj." },
      { word: "ใบเสร็จ", romanization: "bai-sèt", en: "receipt", vi: "hóa đơn", pos: "n." },
      { word: "หลักฐาน", romanization: "làk-thǎan", en: "evidence", vi: "bằng chứng", pos: "n." },
      { word: "คืนเงิน", romanization: "khʉʉn-ngən", en: "refund", vi: "hoàn tiền", pos: "v./n." },
      { word: "นโยบาย", romanization: "ná-yoo-baai", en: "policy", vi: "chính sách", pos: "n." },
      { word: "ดำเนินการ", romanization: "dam-nəən-gaan", en: "to proceed / process", vi: "tiến hành thủ tục", pos: "v." },
      { word: "ทราบ", romanization: "sâap", en: "to know (formal)", vi: "biết (trang trọng)", pos: "v." },
    ],
    dialogue: [
      { speaker: "ลูกค้า (Khách)", text: "สินค้าที่ได้รับชำรุดครับ ผมมีใบเสร็จเป็นหลักฐาน", romanization: "sǐn-kháa thîi dâai-ráp cham-rút kráp, phǒm mii bai-sèt bpen làk-thǎan", en: "The product I received is faulty; I have the receipt as evidence.", vi: "Hàng tôi nhận bị lỗi, tôi có hóa đơn làm bằng chứng." },
      { speaker: "พนักงาน (NV)", text: "ได้ค่ะ ตามนโยบายสามารถคืนเงินได้ ไม่ทราบว่าต้องการแบบไหนคะ", romanization: "dâai kâ, dtaam ná-yoo-baai sǎa-mâat khʉʉn-ngən dâai, mâi sâap wâa dtɔ̂ng-gaan bɛ̀ɛp nǎi ká", en: "Certainly; per policy a refund is possible. May I ask which option you'd prefer?", vi: "Được, theo chính sách có thể hoàn tiền. Không biết anh muốn cách nào ạ?" },
      { speaker: "ลูกค้า (Khách)", text: "ผมขอคืนเงินเต็มจำนวนครับ ต้องดำเนินการอย่างไรต่อครับ", romanization: "phǒm khɔ̌ɔ khʉʉn-ngən dtem jam-nuan kráp, dtɔ̂ng dam-nəən-gaan yàang-rai dtɔ̀ɔ kráp", en: "I'd like a full refund. What are the next steps?", vi: "Tôi xin hoàn toàn bộ. Cần làm thủ tục gì tiếp theo?" },
    ],
    exercises: [
      { type: "fill-blank", question: "ตาม___ สินค้าชำรุดคืนเงินได้ (viện dẫn quy định)", answer: "นโยบาย", hint_vi: "'chính sách'", hint_en: "'policy'" },
      { type: "matching", pairs: [["ชำรุด", "bị lỗi (faulty)"], ["หลักฐาน", "bằng chứng (evidence)"], ["คืนเงิน", "hoàn tiền (refund)"]], instruction: "Nối từ với nghĩa", instruction_en: "Match the word with its meaning" },
      { type: "translation", vietnamese: "Tôi muốn xin hoàn toàn bộ tiền, không biết cần làm gì tiếp?", english: "I'd like a full refund; what should I do next?", thai: "ผมขอคืนเงินเต็มจำนวนครับ ไม่ทราบว่าต้องดำเนินการอย่างไรต่อครับ" },
    ],
  },

  // ── 6. Workplace negotiation: deadline / workload (work) ───────────────────
  {
    id: "thai_work_negotiation_deadline",
    level: "B2",
    category: "work",
    title_vi: "Thương lượng nơi làm việc: hạn chót / khối lượng việc",
    title_en: "Workplace negotiation: deadline / workload",
    sentences: [
      {
        th: "ผมอยากปรึกษาเรื่องกำหนดส่งงานสักนิดครับ",
        romanization:
          "phǒm(R) yàak(L) bprʉ̀k(L)-sǎa(R) rʉ̂ang(F) gam(M)-nòt(L)-sòng(L)-ngaan(M) sàk(L) nít(H) kráp",
        vi: "Tôi muốn trao đổi một chút về hạn nộp công việc.",
        en: "I'd like to discuss the submission deadline briefly.",
        pronunciation_focus: [
          "ปรึกษา → bprʉ̀k-sǎa: 'tham khảo/bàn bạc' — mở thương lượng nhẹ",
          "กำหนดส่งงาน → gam-nòt-sòng-ngaan: 'hạn nộp'",
        ],
        pronunciation_focus_en: [
          "ปรึกษา → bprʉ̀k-sǎa: 'to consult/discuss' — soft negotiation opener",
          "กำหนดส่งงาน → gam-nòt-sòng-ngaan: 'submission deadline'",
        ],
      },
      {
        th: "ด้วยปริมาณงานตอนนี้ ผมเกรงว่าจะไม่ทันกำหนดเดิม",
        romanization:
          "dûai(F) bpà-rí-maan(M) ngaan(M) dtɔɔn(M)-níi(H), phǒm(R) greeng(M) wâa(F) jà(L) mâi(F) than(M) gam(M)-nòt(L) dəəm(M)",
        vi: "Với khối lượng việc hiện tại, tôi e là sẽ không kịp hạn cũ.",
        en: "Given the current workload, I'm afraid I won't meet the original deadline.",
        pronunciation_focus: [
          "เกรงว่า → greeng wâa: 'e rằng' — báo tin xấu cách lịch sự",
          "ไม่ทันกำหนด → mâi than gam-nòt: 'không kịp hạn'",
        ],
        pronunciation_focus_en: [
          "เกรงว่า → greeng wâa: 'I'm afraid that' — polite way to deliver bad news",
          "ไม่ทันกำหนด → mâi than gam-nòt: 'won't make the deadline'",
        ],
      },
      {
        th: "ถ้าเลื่อนได้สักสองวัน งานจะออกมาดีกว่านี้มากครับ",
        romanization:
          "thâa(F) lʉ̂an(F) dâai(F) sàk(L) sɔ̌ɔng(R) wan(M), ngaan(M) jà(L) ɔ̀ɔk(L) maa(M) dii(M) gwàa(L) níi(H) mâak(F) kráp",
        vi: "Nếu dời được khoảng hai ngày, chất lượng việc sẽ tốt hơn nhiều.",
        en: "If we could push it by two days, the work would come out much better.",
        pronunciation_focus: [
          "ถ้าเลื่อนได้ → thâa lʉ̂an dâai: 'nếu dời được' — đề xuất kèm điều kiện",
          "Gắn đề xuất với LỢI ÍCH cho công việc, không phải cho mình",
        ],
        pronunciation_focus_en: [
          "ถ้าเลื่อนได้ → thâa lʉ̂an dâai: 'if we could postpone' — conditional proposal",
          "Tie the ask to a BENEFIT for the work, not for yourself",
        ],
      },
      {
        th: "หรือถ้าจำเป็นต้องส่งวันเดิม ขอแบ่งงานบางส่วนให้ทีมช่วยได้ไหมครับ",
        romanization:
          "rʉ̌ʉ(R) thâa(F) jam(M)-bpen(M) dtɔ̂ng(F) sòng(L) wan(M) dəəm(M), khɔ̌ɔ(R) bɛ̀ng(L) ngaan(M) baang(M)-sùan(L) hâi(F) thiim(M) chûai(F) dâai(F) mǎi(R) kráp",
        vi: "Hoặc nếu buộc phải nộp đúng ngày cũ, cho tôi chia một phần việc cho nhóm hỗ trợ được không?",
        en: "Or if it must stay on the original date, could I share part of it with the team?",
        pronunciation_focus: [
          "Đưa PHƯƠNG ÁN HAI → linh hoạt, không dồn sếp vào thế bí",
          "แบ่งงานให้ทีมช่วย → bɛ̀ng ngaan hâi thiim chûai: 'chia việc cho nhóm'",
        ],
        pronunciation_focus_en: [
          "Offer a SECOND option → flexible, doesn't corner the boss",
          "แบ่งงานให้ทีมช่วย → bɛ̀ng ngaan hâi thiim chûai: 'share the work with the team'",
        ],
      },
      {
        th: "แล้วแต่คุณจะสะดวกแบบไหน ผมยินดีปรับตามครับ",
        romanization:
          "lɛ́ɛw(H)-dtɛ̀ɛ(L) khun(M) jà(L) sà-dùak(L) bɛ̀ɛp(L) nǎi(R), phǒm(R) yin(M)-dii(M) bpràp(L) dtaam(M) kráp",
        vi: "Tùy anh/chị thấy thuận tiện cách nào, tôi sẵn lòng điều chỉnh theo.",
        en: "Whichever works better for you — I'm happy to adjust.",
        pronunciation_focus: [
          "แล้วแต่คุณ → lɛ́ɛw-dtɛ̀ɛ khun: 'tùy anh/chị' — trao quyền quyết định",
          "ยินดีปรับตาม → yin-dii bpràp dtaam: 'sẵn lòng điều chỉnh'",
        ],
        pronunciation_focus_en: [
          "แล้วแต่คุณ → lɛ́ɛw-dtɛ̀ɛ khun: 'up to you' — hands the decision over",
          "ยินดีปรับตาม → yin-dii bpràp dtaam: 'happy to adjust'",
        ],
      },
    ],
    cultural_notes_vi:
      "Thương lượng với cấp trên Thái = giữ thể diện cho SẾP, không phải thắng cuộc. Đừng nói 'งานเยอะเกินไป' (việc nhiều quá) như lời than. Khung khôn ngoan: ปรึกษา (xin bàn bạc) → เกรงว่า (e rằng, nêu khó khăn) → đề xuất GẮN VỚI lợi ích công việc → đưa phương án hai → 'แล้วแต่คุณ' (trao quyền). Phân cấp (อาวุโส) rất mạnh; thể hiện tôn trọng giúp bạn được chấp thuận.",
    cultural_notes_en:
      "Negotiating with a Thai superior = preserving the BOSS's face, not winning. Don't whine 'งานเยอะเกินไป' (too much work). The savvy frame: ปรึกษา (ask to consult) → เกรงว่า (I'm afraid, state the difficulty) → propose tied to the WORK's benefit → offer a second option → 'แล้วแต่คุณ' (hand over the decision). Seniority (อาวุโส) is strong; showing deference gets you the yes.",
    tip_advice_vi:
      "Luôn mang theo MỘT giải pháp, lý tưởng là hai. 'Không kịp' mà không kèm đề xuất nghe như lời than. Gắn yêu cầu với chất lượng công việc, kết bằng 'แล้วแต่คุณ' để sếp giữ quyền.",
    tip_advice_en:
      "Always bring ONE solution, ideally two. 'I can't make it' without a proposal sounds like complaining. Tie the ask to work quality and close with 'แล้วแต่คุณ' so the boss keeps control.",
    l1_notes_vi: [
      {
        mistake: "งานเยอะเกินไป ทำไม่ได้ (than + từ chối thẳng).",
        fix_vi:
          "Đừng than rồi từ chối. Nêu khó khăn bằng 'เกรงว่า' rồi đề xuất ngay. Người Việt quen nói thẳng 'làm không nổi'; với sếp Thái cần bọc bằng giải pháp, nếu không nghe như thiếu trách nhiệm.",
        fix_en:
          "Don't complain then refuse. State the difficulty with 'เกรงว่า' and immediately propose. Wrap it in a solution or it reads as shirking.",
      },
      {
        mistake: "Gọi sếp bằng 'คุณ' khi không chắc tuổi/cấp.",
        fix_vi:
          "Với cấp trên lớn tuổi, 'พี่' (anh/chị) hoặc chức danh an toàn hơn 'คุณ'. Tiếng Việt cũng phân vai theo tuổi; trong tiếng Thái sai đại từ với người trên là lỗi lễ độ nghiêm trọng.",
        fix_en:
          "For an older superior, 'พี่' (elder) or a title is safer than 'คุณ'. Misjudging the pronoun for a senior is a real politeness error.",
      },
    ],
    vocabulary: [
      { word: "ปรึกษา", romanization: "bprʉ̀k-sǎa", en: "to consult / discuss", vi: "trao đổi / bàn bạc", pos: "v." },
      { word: "กำหนดส่งงาน", romanization: "gam-nòt-sòng-ngaan", en: "deadline", vi: "hạn nộp", pos: "n." },
      { word: "ปริมาณงาน", romanization: "bpà-rí-maan ngaan", en: "workload", vi: "khối lượng việc", pos: "n." },
      { word: "เกรงว่า", romanization: "greeng wâa", en: "I'm afraid that", vi: "tôi e rằng", pos: "phrase" },
      { word: "เลื่อน", romanization: "lʉ̂an", en: "to postpone", vi: "dời / hoãn", pos: "v." },
      { word: "แบ่งงาน", romanization: "bɛ̀ng ngaan", en: "to divide the work", vi: "chia việc", pos: "v." },
      { word: "แล้วแต่คุณ", romanization: "lɛ́ɛw-dtɛ̀ɛ khun", en: "up to you", vi: "tùy anh/chị", pos: "phrase" },
      { word: "ยินดี", romanization: "yin-dii", en: "to be glad / willing", vi: "sẵn lòng", pos: "v." },
    ],
    dialogue: [
      { speaker: "ลูกน้อง (NV)", text: "พี่ครับ ผมอยากปรึกษาเรื่องกำหนดส่งงานสักนิดครับ", romanization: "phîi kráp, phǒm yàak bprʉ̀k-sǎa rʉ̂ang gam-nòt-sòng-ngaan sàk nít kráp", en: "May I briefly discuss the deadline with you?", vi: "Anh ơi, em muốn trao đổi chút về hạn nộp." },
      { speaker: "หัวหน้า (Sếp)", text: "ได้สิ มีอะไรหรือเปล่า", romanization: "dâai sì, mii à-rai rʉ̌ʉ bplàao", en: "Sure, is something the matter?", vi: "Được chứ, có chuyện gì à?" },
      { speaker: "ลูกน้อง (NV)", text: "ด้วยปริมาณงานตอนนี้ ผมเกรงว่าจะไม่ทัน ถ้าเลื่อนได้สักสองวันงานจะดีกว่านี้ครับ หรือขอแบ่งงานให้ทีมช่วยก็ได้ แล้วแต่พี่สะดวกครับ", romanization: "dûai bpà-rí-maan ngaan dtɔɔn-níi, phǒm greeng wâa jà mâi than, thâa lʉ̂an dâai sàk sɔ̌ɔng wan ngaan jà dii gwàa níi kráp, rʉ̌ʉ khɔ̌ɔ bɛ̀ng ngaan hâi thiim chûai gɔ̂ɔ dâai, lɛ́ɛw-dtɛ̀ɛ phîi sà-dùak kráp", en: "Given the workload I'm afraid I won't make it; two more days would make the work better, or I could share it with the team — whichever suits you.", vi: "Với khối lượng hiện tại em e không kịp; dời hai ngày thì việc tốt hơn, hoặc chia cho nhóm cũng được, tùy anh." },
    ],
    exercises: [
      { type: "fill-blank", question: "ผม___ว่าจะไม่ทันกำหนดครับ (báo khó khăn lịch sự)", answer: "เกรง", hint_vi: "'e rằng'", hint_en: "'I'm afraid that'" },
      { type: "matching", pairs: [["เลื่อน", "dời/hoãn (postpone)"], ["ปริมาณงาน", "khối lượng việc (workload)"], ["แล้วแต่คุณ", "tùy anh/chị (up to you)"]], instruction: "Nối từ với nghĩa", instruction_en: "Match the word with its meaning" },
      { type: "translation", vietnamese: "Em e không kịp; nếu dời được hai ngày thì việc sẽ tốt hơn, tùy anh ạ.", english: "I'm afraid I won't make it; two more days would make it better — up to you.", thai: "ผมเกรงว่าจะไม่ทันครับ ถ้าเลื่อนได้สองวันงานจะดีกว่านี้ แล้วแต่พี่ครับ" },
    ],
  },

  // ── 7. Nuance and hedging: softening certainty (expressions) ───────────────
  {
    id: "thai_expressions_hedging_nuance",
    level: "B2",
    category: "expressions",
    title_vi: "Sắc thái và rào đón: giảm mức chắc chắn",
    title_en: "Nuance and hedging: softening certainty",
    sentences: [
      {
        th: "เท่าที่ผมเข้าใจ เรื่องนี้น่าจะซับซ้อนกว่าที่คิด",
        romanization:
          "thâo(F)-thîi(F) phǒm(R) khâo(F)-jai(M), rʉ̂ang(F) níi(H) nâa(F)-jà(L) sáp(H)-sɔ́ɔn(H) gwàa(L) thîi(F) khít(H)",
        vi: "Theo những gì tôi hiểu, việc này có lẽ phức tạp hơn ta nghĩ.",
        en: "As far as I understand, this is probably more complex than it seems.",
        pronunciation_focus: [
          "เท่าที่ → thâo-thîi: 'theo chỗ mà…' — rào đón trước khi nêu ý",
          "น่าจะ → nâa-jà: 'có lẽ' — giảm mức chắc chắn",
        ],
        pronunciation_focus_en: [
          "เท่าที่ → thâo-thîi: 'as far as…' — a hedge before the claim",
          "น่าจะ → nâa-jà: 'probably' — lowers certainty",
        ],
      },
      {
        th: "มันอาจจะใช่ แต่ก็ไม่เสมอไป",
        romanization:
          "man(M) àat(L)-jà(L) châi(F), dtɛ̀ɛ(L) gɔ̂ɔ(F) mâi(F) sà-məə(R)-bpai(M)",
        vi: "Có thể đúng, nhưng không phải lúc nào cũng vậy.",
        en: "It might be true, but not always.",
        pronunciation_focus: [
          "อาจจะ → àat-jà: 'có thể' — khả năng, không khẳng định",
          "ไม่เสมอไป → mâi sà-məə-bpai: 'không phải luôn luôn'",
        ],
        pronunciation_focus_en: [
          "อาจจะ → àat-jà: 'might' — possibility, not assertion",
          "ไม่เสมอไป → mâi sà-məə-bpai: 'not always'",
        ],
      },
      {
        th: "ค่อนข้างจะเห็นด้วย แต่ขอเก็บไว้พิจารณาก่อน",
        romanization:
          "khɔ̂n(F)-khâang(F) jà(L) hen(R)-dûai(F), dtɛ̀ɛ(L) khɔ̌ɔ(R) gèp(L) wái(H) phí-jaa(M)-rá-naa(M) gɔ̀ɔn(L)",
        vi: "Tôi khá đồng ý, nhưng xin giữ lại để cân nhắc thêm.",
        en: "I rather agree, but let me keep it for further consideration.",
        pronunciation_focus: [
          "ค่อนข้าง → khɔ̂n-khâang: 'khá' — mức độ vừa phải",
          "ขอเก็บไว้พิจารณา → khɔ̌ɔ gèp wái phí-jaa-rá-naa: 'để cân nhắc thêm'",
        ],
        pronunciation_focus_en: [
          "ค่อนข้าง → khɔ̂n-khâang: 'rather' — a middling degree",
          "ขอเก็บไว้พิจารณา → khɔ̌ɔ gèp wái phí-jaa-rá-naa: 'keep it for consideration'",
        ],
      },
      {
        th: "ดูเหมือนว่าจะมีข้อมูลบางอย่างที่เรายังไม่รู้",
        romanization:
          "duu(M)-mʉ̌an(R) wâa(F) jà(L) mii(M) khɔ̂ɔ(F)-muun(M) baang(M)-yàang(L) thîi(F) rao(M) yang(M) mâi(F) rúu(H)",
        vi: "Có vẻ như còn vài thông tin mà ta chưa biết.",
        en: "It seems there's some information we don't yet know.",
        pronunciation_focus: [
          "ดูเหมือนว่า → duu-mʉ̌an wâa: 'có vẻ như' — suy đoán dè dặt",
          "ยัง…ไม่ → yang … mâi: 'vẫn chưa'",
        ],
        pronunciation_focus_en: [
          "ดูเหมือนว่า → duu-mʉ̌an wâa: 'it seems that' — tentative inference",
          "ยัง…ไม่ → yang … mâi: 'not yet'",
        ],
      },
      {
        th: "พูดอย่างระมัดระวังก็คือ ยังสรุปไม่ได้ในตอนนี้",
        romanization:
          "phûut(F) yàang(L) rá-mát(H)-rá-wang(M) gɔ̂ɔ(F) khʉʉ(M), yang(M) sà-rùp(L) mâi(F) dâai(F) nai(M) dtɔɔn(M)-níi(H)",
        vi: "Nói một cách thận trọng thì hiện giờ chưa thể kết luận.",
        en: "Put cautiously, we can't conclude yet at this point.",
        pronunciation_focus: [
          "พูดอย่างระมัดระวัง → phûut yàang rá-mát-rá-wang: 'nói thận trọng'",
          "ยังสรุปไม่ได้ → yang sà-rùp mâi dâai: 'chưa thể kết luận'",
        ],
        pronunciation_focus_en: [
          "พูดอย่างระมัดระวัง → phûut yàang rá-mát-rá-wang: 'to put it cautiously'",
          "ยังสรุปไม่ได้ → yang sà-rùp mâi dâai: 'can't conclude yet'",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở B2, rào đón (hedging) là dấu hiệu của sự chín chắn, không phải thiếu tự tin. Người Thái tránh nói tuyệt đối để giữ thể diện cho cả hai bên nếu sau này sai. Xếp chồng các từ giảm nhẹ: 'น่าจะ' (có lẽ), 'อาจจะ' (có thể), 'ค่อนข้าง' (khá), 'ดูเหมือนว่า' (có vẻ). Khẳng định chắc nịch ('100% แน่นอน') nghe non và dễ mất mặt khi sai.",
    cultural_notes_en:
      "At B2, hedging signals maturity, not weakness. Thai speakers avoid absolutes to save face for everyone if it later proves wrong. Stack the softeners: 'น่าจะ' (probably), 'อาจจะ' (might), 'ค่อนข้าง' (rather), 'ดูเหมือนว่า' (it seems). Flat certainty ('100% sure') sounds green and risks losing face when wrong.",
    tip_advice_vi:
      "Một lớp rào đón ('น่าจะ') đủ cho câu thường; chồng hai lớp khi vấn đề nhạy cảm. Đừng quên particle cuối câu — rào đón mà cụt vẫn nghe sống sượng.",
    tip_advice_en:
      "One hedge ('น่าจะ') is enough for a normal claim; stack two for sensitive topics. Don't drop the final particle — a blunt hedge still sounds raw.",
    l1_notes_vi: [
      {
        mistake: "แน่นอน 100% (khẳng định tuyệt đối khi chưa chắc).",
        fix_vi:
          "Người Việt hay nói 'chắc chắn/100%' để nhấn mạnh, nhưng trong tiếng Thái điều đó nghe liều. Dùng 'น่าจะ' hoặc 'ค่อนข้างแน่ใจ' (khá chắc) để chừa đường lui.",
        fix_en:
          "Vietnamese often says 'definitely/100%' for emphasis, but it sounds reckless in Thai. Use 'น่าจะ' or 'ค่อนข้างแน่ใจ' (fairly sure) to leave room.",
      },
      {
        mistake: "Đặt 'có lẽ' đầu câu kiểu Việt: 'น่าจะ มัน ดี'.",
        fix_vi:
          "'น่าจะ' đứng TRƯỚC động từ/tính từ nó bổ nghĩa: 'มันน่าจะดี' (nó có lẽ tốt), không tách rời đầu câu như 'có lẽ' tiếng Việt.",
        fix_en:
          "'น่าจะ' sits right before the verb/adjective it modifies: 'มันน่าจะดี', not floated to the front like Vietnamese 'có lẽ'.",
      },
    ],
    vocabulary: [
      { word: "เท่าที่", romanization: "thâo-thîi", en: "as far as", vi: "theo chỗ mà", pos: "conj." },
      { word: "น่าจะ", romanization: "nâa-jà", en: "probably / should", vi: "có lẽ", pos: "aux." },
      { word: "อาจจะ", romanization: "àat-jà", en: "might / may", vi: "có thể", pos: "aux." },
      { word: "ค่อนข้าง", romanization: "khɔ̂n-khâang", en: "rather / fairly", vi: "khá", pos: "adv." },
      { word: "ไม่เสมอไป", romanization: "mâi sà-məə-bpai", en: "not always", vi: "không phải luôn luôn", pos: "phrase" },
      { word: "ดูเหมือนว่า", romanization: "duu-mʉ̌an wâa", en: "it seems that", vi: "có vẻ như", pos: "phrase" },
      { word: "ระมัดระวัง", romanization: "rá-mát-rá-wang", en: "cautious / careful", vi: "thận trọng", pos: "adj." },
      { word: "พิจารณา", romanization: "phí-jaa-rá-naa", en: "to consider", vi: "cân nhắc", pos: "v." },
    ],
    dialogue: [
      { speaker: "A", text: "โครงการนี้จะสำเร็จแน่ๆ ใช่ไหมครับ", romanization: "khroong-gaan níi jà sǎm-rèt nɛ̂ɛ-nɛ̂ɛ châi mǎi kráp", en: "This project will definitely succeed, right?", vi: "Dự án này chắc chắn thành công đúng không?" },
      { speaker: "B", text: "เท่าที่ผมดู มันน่าจะไปได้ดี แต่ก็ไม่เสมอไปนะครับ", romanization: "thâo-thîi phǒm duu, man nâa-jà bpai dâai dii, dtɛ̀ɛ gɔ̂ɔ mâi sà-məə-bpai ná kráp", en: "As far as I can see it should go well, but not always.", vi: "Theo tôi thấy thì có lẽ ổn, nhưng không phải lúc nào cũng vậy." },
      { speaker: "A", text: "งั้นเราขอเก็บไว้พิจารณาอีกทีดีกว่าครับ", romanization: "ngán rao khɔ̌ɔ gèp wái phí-jaa-rá-naa ìik thii dii gwàa kráp", en: "Then let's keep it for further consideration.", vi: "Vậy ta giữ lại cân nhắc thêm thì hơn." },
    ],
    exercises: [
      { type: "fill-blank", question: "มัน___ดี แต่ก็ไม่เสมอไป (giảm mức chắc chắn)", answer: "น่าจะ", hint_vi: "'có lẽ'", hint_en: "'probably'" },
      { type: "matching", pairs: [["ค่อนข้าง", "khá (rather)"], ["ดูเหมือนว่า", "có vẻ như (it seems)"], ["ไม่เสมอไป", "không phải luôn (not always)"]], instruction: "Nối từ với nghĩa", instruction_en: "Match the word with its meaning" },
      { type: "translation", vietnamese: "Theo tôi hiểu thì có lẽ phức tạp hơn, nhưng chưa thể kết luận.", english: "As far as I understand it's probably more complex, but I can't conclude yet.", thai: "เท่าที่ผมเข้าใจ มันน่าจะซับซ้อนกว่า แต่ยังสรุปไม่ได้ครับ" },
    ],
  },

  // ── 8. Formal vs casual register: the same message, two ways (expressions) ──
  {
    id: "thai_expressions_formal_casual_register",
    level: "B2",
    category: "expressions",
    title_vi: "Trang trọng vs thân mật: cùng một ý, hai cách nói",
    title_en: "Formal vs casual register: one message, two ways",
    sentences: [
      {
        th: "ขออนุญาตเรียนถามรายละเอียดเพิ่มเติมครับ",
        romanization:
          "khɔ̌ɔ(R) à-nú-yâat(F) rian(M)-thǎam(R) raai(M)-lá-ìat(L) phə̂əm(F)-dtəəm(M) kráp",
        vi: "Cho phép tôi xin hỏi thêm chi tiết ạ. (trang trọng)",
        en: "May I ask for further details, please. (formal)",
        pronunciation_focus: [
          "เรียนถาม → rian-thǎam: 'kính hỏi' — trang trọng hơn ถาม nhiều",
          "ขออนุญาต → khɔ̌ɔ à-nú-yâat: 'xin phép' — mở đầu rất lịch sự",
        ],
        pronunciation_focus_en: [
          "เรียนถาม → rian-thǎam: 'respectfully ask' — far more formal than ถาม",
          "ขออนุญาต → khɔ̌ɔ à-nú-yâat: 'may I' — a very polite opener",
        ],
      },
      {
        th: "เดี๋ยวขอถามอีกนิดนะ",
        romanization:
          "dǐao(R) khɔ̌ɔ(R) thǎam(R) ìik(L) nít(H) ná(H)",
        vi: "Khoan, hỏi thêm chút nha. (thân mật)",
        en: "Hold on, let me ask one more thing. (casual)",
        pronunciation_focus: [
          "ถาม + นะ → thǎam + ná: động từ trần + particle thân mật",
          "เดี๋ยว → dǐao: 'khoan/lát' — văn nói",
        ],
        pronunciation_focus_en: [
          "ถาม + นะ → thǎam + ná: plain verb + casual particle",
          "เดี๋ยว → dǐao: 'hold on' — colloquial",
        ],
      },
      {
        th: "รบกวนแจ้งให้ทราบด้วยจะขอบพระคุณมากครับ",
        romanization:
          "róp(H)-guan(M) jɛ̂ɛng(F) hâi(F) sâap(F) dûai(F) jà(L) khɔ̀ɔp(L)-phrá-khun(M) mâak(F) kráp",
        vi: "Phiền thông báo cho tôi biết với, xin chân thành cảm ơn ạ. (trang trọng)",
        en: "Kindly let me know; I'd be most grateful. (formal)",
        pronunciation_focus: [
          "แจ้งให้ทราบ → jɛ̂ɛng hâi sâap: 'thông báo cho biết' — trang trọng (dùng ทราบ)",
          "ขอบพระคุณ → khɔ̀ɔp-phrá-khun: 'chân thành cảm ơn' — nâng bậc ขอบคุณ",
        ],
        pronunciation_focus_en: [
          "แจ้งให้ทราบ → jɛ̂ɛng hâi sâap: 'notify' — formal (uses ทราบ, not รู้)",
          "ขอบพระคุณ → khɔ̀ɔp-phrá-khun: an elevated 'thank you'",
        ],
      },
      {
        th: "บอกกันด้วยนะ เดี๋ยวลืม",
        romanization:
          "bɔ̀ɔk(L) gan(M) dûai(F) ná(H), dǐao(R) lʉʉm(M)",
        vi: "Nhớ nói cho nhau biết nha, kẻo quên. (thân mật)",
        en: "Tell me, okay — or I'll forget. (casual)",
        pronunciation_focus: [
          "บอก → bɔ̀ɔk: 'nói/bảo' — văn nói, đối lập với แจ้ง",
          "กัน → gan: 'với nhau' — sắc thái thân mật",
        ],
        pronunciation_focus_en: [
          "บอก → bɔ̀ɔk: 'tell' — colloquial, opposite of แจ้ง",
          "กัน → gan: 'each other' — a casual flavor",
        ],
      },
      {
        th: "ขอเรียนเชิญทุกท่านเข้าร่วมประชุมตามเวลาที่กำหนดครับ",
        romanization:
          "khɔ̌ɔ(R) rian(M)-chəən(M) thúk(H) thâan(F) khâo(F)-rûam(F) bprà-chum(M) dtaam(M) wee(M)-laa(M) thîi(F) gam(M)-nòt(L) kráp",
        vi: "Kính mời quý vị tham dự cuộc họp đúng giờ quy định ạ. (trang trọng)",
        en: "I'd like to invite everyone to attend the meeting at the appointed time. (formal)",
        pronunciation_focus: [
          "เรียนเชิญ → rian-chəən: 'kính mời' — văn viết/nghi thức",
          "ท่าน → thâan: 'quý vị' — đại từ trang trọng thay คุณ",
        ],
        pronunciation_focus_en: [
          "เรียนเชิญ → rian-chəən: 'cordially invite' — written/ceremonial",
          "ท่าน → thâan: 'sir/madam' — a formal pronoun replacing คุณ",
        ],
      },
    ],
    cultural_notes_vi:
      "Tiếng Thái phân tầng đăng ký rất rõ qua TỪ VỰNG, không chỉ qua particle: กิน→ทาน→รับประทาน (ăn), รู้→ทราบ (biết), บอก→แจ้ง (báo), เธอ/คุณ→ท่าน (anh→quý vị). Tiền tố 'เรียน' (เรียนถาม, เรียนเชิญ) nâng câu lên mức nghi thức. Chọn sai tầng — dùng กิน trong email công ty, hay ท่าน với bạn thân — nghe lạc lõng. Quy tắc: bối cảnh càng chính thức / người nghe càng cao, càng leo bậc.",
    cultural_notes_en:
      "Thai layers register through VOCABULARY, not just particles: กิน→ทาน→รับประทาน (eat), รู้→ทราบ (know), บอก→แจ้ง (tell), เธอ/คุณ→ท่าน (you→sir). The prefix 'เรียน' (เรียนถาม, เรียนเชิญ) lifts a sentence to ceremonial level. Picking the wrong tier — กิน in a company email, or ท่าน with a close friend — sounds off. Rule: the more formal the setting / higher the listener, the higher you climb.",
    tip_advice_vi:
      "Học theo CẶP: กิน/รับประทาน, รู้/ทราบ, บอก/แจ้ง. Khi không chắc, leo lên một bậc — thừa lịch sự an toàn hơn thiếu. Với người trên hoặc văn bản, mặc định dùng tầng trang trọng.",
    tip_advice_en:
      "Learn them in PAIRS: กิน/รับประทาน, รู้/ทราบ, บอก/แจ้ง. When unsure, climb one tier — over-polite is safer than under. With superiors or in writing, default to the formal tier.",
    l1_notes_vi: [
      {
        mistake: "Dùng กิน / รู้ / บอก trong email công việc.",
        fix_vi:
          "Tiếng Việt phần lớn dựa vào 'ạ/dạ' và đại từ để lịch sự, nên người học giữ nguyên một động từ cho mọi tầng. Tiếng Thái đổi cả ĐỘNG TỪ: viết 'รับประทาน', 'ทราบ', 'แจ้ง' trong ngữ cảnh trang trọng.",
        fix_en:
          "Vietnamese mostly leans on 'ạ' and pronouns for politeness, so learners keep one verb for every tier. Thai swaps the VERB itself: write 'รับประทาน', 'ทราบ', 'แจ้ง' in formal contexts.",
      },
      {
        mistake: "Gọi bạn thân bằng 'ท่าน'.",
        fix_vi:
          "'ท่าน' chỉ dành cho người rất cao/nghi thức; với bạn dùng เธอ/ชื่อ. Lạm dụng tầng trang trọng nghe châm biếm hoặc xa cách.",
        fix_en:
          "'ท่าน' is only for very senior/ceremonial use; with friends use เธอ/their name. Over-formal register sounds sarcastic or distant.",
      },
    ],
    vocabulary: [
      { word: "ขออนุญาต", romanization: "khɔ̌ɔ à-nú-yâat", en: "may I / with permission", vi: "xin phép", pos: "phrase" },
      { word: "เรียนถาม", romanization: "rian-thǎam", en: "to ask (formal)", vi: "kính hỏi", pos: "v." },
      { word: "แจ้งให้ทราบ", romanization: "jɛ̂ɛng hâi sâap", en: "to notify (formal)", vi: "thông báo cho biết", pos: "v." },
      { word: "รบกวน", romanization: "róp-guan", en: "to trouble (politely)", vi: "làm phiền", pos: "v." },
      { word: "เรียนเชิญ", romanization: "rian-chəən", en: "to cordially invite", vi: "kính mời", pos: "v." },
      { word: "ท่าน", romanization: "thâan", en: "you/he/she (formal)", vi: "quý vị / ngài", pos: "pron." },
      { word: "รายละเอียด", romanization: "raai-lá-ìat", en: "details", vi: "chi tiết", pos: "n." },
      { word: "กำหนด", romanization: "gam-nòt", en: "to set / appointed", vi: "quy định / ấn định", pos: "v." },
    ],
    dialogue: [
      { speaker: "อีเมล (Email)", text: "เรียนคุณสมชาย ขออนุญาตเรียนถามรายละเอียดเพิ่มเติม รบกวนแจ้งให้ทราบด้วยครับ", romanization: "rian khun sǒm-chaai, khɔ̌ɔ à-nú-yâat rian-thǎam raai-lá-ìat phə̂əm-dtəəm, róp-guan jɛ̂ɛng hâi sâap dûai kráp", en: "Dear Khun Somchai, may I ask for more details; kindly let me know.", vi: "Kính gửi anh Somchai, cho phép tôi hỏi thêm chi tiết, phiền anh báo lại ạ." },
      { speaker: "แชต (Chat)", text: "เฮ้ย เดี๋ยวขอถามอีกนิดนะ บอกกันด้วย เดี๋ยวลืม", romanization: "hə́əi, dǐao khɔ̌ɔ thǎam ìik nít ná, bɔ̀ɔk gan dûai, dǐao lʉʉm", en: "Hey, let me ask one more thing — tell me, or I'll forget.", vi: "Ê, hỏi thêm chút nha, nói cho biết kẻo quên." },
      { speaker: "ทางการ (Formal)", text: "ขอเรียนเชิญทุกท่านเข้าร่วมประชุมตามเวลาที่กำหนดครับ", romanization: "khɔ̌ɔ rian-chəən thúk thâan khâo-rûam bprà-chum dtaam wee-laa thîi gam-nòt kráp", en: "I cordially invite everyone to attend the meeting at the appointed time.", vi: "Kính mời quý vị tham dự cuộc họp đúng giờ quy định." },
    ],
    exercises: [
      { type: "fill-blank", question: "รบกวน___ให้ทราบด้วยครับ (báo tin trang trọng)", answer: "แจ้ง", hint_vi: "trang trọng của บอก", hint_en: "the formal form of บอก" },
      { type: "matching", pairs: [["ทราบ", "biết — trang trọng (know, formal)"], ["ท่าน", "quý vị (you, formal)"], ["เรียนเชิญ", "kính mời (cordially invite)"]], instruction: "Nối từ với nghĩa", instruction_en: "Match the word with its meaning" },
      { type: "translation", vietnamese: "Cho phép tôi xin hỏi thêm chi tiết, phiền anh báo lại ạ.", english: "May I ask for more details; kindly let me know.", thai: "ขออนุญาตเรียนถามรายละเอียดเพิ่มเติม รบกวนแจ้งให้ทราบด้วยครับ" },
    ],
  },

  // ── 9. Explaining a mistake professionally (work) ──────────────────────────
  {
    id: "thai_work_explaining_mistake",
    level: "B2",
    category: "work",
    title_vi: "Giải thích lỗi một cách chuyên nghiệp",
    title_en: "Explaining a mistake professionally",
    sentences: [
      {
        th: "ต้องขออภัยด้วยครับ เรื่องนี้เป็นความผิดพลาดของผมเอง",
        romanization:
          "dtɔ̂ng(F) khɔ̌ɔ(R)-à-phai(M) dûai(F) kráp, rʉ̂ang(F) níi(H) bpen(M) khwaam(M)-phìt(L)-phlâat(F) khɔ̌ɔng(R) phǒm(R) eeng(M)",
        vi: "Tôi thành thật xin lỗi, việc này là sai sót của chính tôi.",
        en: "I must apologize; this was my own mistake.",
        pronunciation_focus: [
          "ต้องขออภัย → dtɔ̂ng khɔ̌ɔ-à-phai: 'thành thật xin lỗi' — trang trọng",
          "ของผมเอง → khɔ̌ɔng phǒm eeng: 'của chính tôi' — nhận trách nhiệm",
        ],
        pronunciation_focus_en: [
          "ต้องขออภัย → dtɔ̂ng khɔ̌ɔ-à-phai: 'I must apologize' — formal",
          "ของผมเอง → khɔ̌ɔng phǒm eeng: 'my own' — owns the fault",
        ],
      },
      {
        th: "สาเหตุคือผมเข้าใจรายละเอียดคลาดเคลื่อนไปครับ",
        romanization:
          "sǎa(R)-hèet(L) khʉʉ(M) phǒm(R) khâo(F)-jai(M) raai(M)-lá-ìat(L) khlâat(F)-khlʉ̂an(F) bpai(M) kráp",
        vi: "Nguyên nhân là tôi đã hiểu sai chi tiết.",
        en: "The cause is that I misunderstood the details.",
        pronunciation_focus: [
          "สาเหตุคือ → sǎa-hèet khʉʉ: 'nguyên nhân là' — giải thích, không bào chữa",
          "คลาดเคลื่อน → khlâat-khlʉ̂an: 'sai lệch'",
        ],
        pronunciation_focus_en: [
          "สาเหตุคือ → sǎa-hèet khʉʉ: 'the cause is' — explain, don't excuse",
          "คลาดเคลื่อน → khlâat-khlʉ̂an: 'off / deviated'",
        ],
      },
      {
        th: "ผมรับผิดชอบเต็มที่และจะรีบแก้ไขทันที",
        romanization:
          "phǒm(R) ráp(H)-phìt(L)-chɔ̂ɔp(F) dtem(M)-thîi(F) lɛ́(H) jà(L) rîip(F) gɛ̂ɛ(F)-khǎi(R) than(M)-thii(M)",
        vi: "Tôi hoàn toàn chịu trách nhiệm và sẽ khắc phục ngay.",
        en: "I take full responsibility and will fix it right away.",
        pronunciation_focus: [
          "รับผิดชอบ → ráp-phìt-chɔ̂ɔp: 'chịu trách nhiệm'",
          "เต็มที่ → dtem-thîi: 'hoàn toàn/hết mình'",
        ],
        pronunciation_focus_en: [
          "รับผิดชอบ → ráp-phìt-chɔ̂ɔp: 'take responsibility'",
          "เต็มที่ → dtem-thîi: 'fully'",
        ],
      },
      {
        th: "เพื่อไม่ให้เกิดขึ้นอีก ผมจะตรวจสอบสองรอบทุกครั้ง",
        romanization:
          "phʉ̂a(F) mâi(F) hâi(F) gəət(L)-khʉ̂n(F) ìik(L), phǒm(R) jà(L) dtrùat(L)-sɔ̀ɔp(L) sɔ̌ɔng(R) rɔ̂ɔp(F) thúk(H)-khráng(H)",
        vi: "Để không tái diễn, tôi sẽ kiểm tra hai lần mỗi lần.",
        en: "To prevent it happening again, I'll double-check every time.",
        pronunciation_focus: [
          "เพื่อไม่ให้เกิดขึ้นอีก → phʉ̂a mâi hâi gəət-khʉ̂n ìik: 'để không tái diễn' — bước phòng ngừa",
          "ตรวจสอบสองรอบ → dtrùat-sɔ̀ɔp sɔ̌ɔng rɔ̂ɔp: 'kiểm tra hai lần'",
        ],
        pronunciation_focus_en: [
          "เพื่อไม่ให้เกิดขึ้นอีก → phʉ̂a mâi hâi gəət-khʉ̂n ìik: 'so it won't recur' — the prevention step",
          "ตรวจสอบสองรอบ → dtrùat-sɔ̀ɔp sɔ̌ɔng rɔ̂ɔp: 'double-check'",
        ],
      },
      {
        th: "ขอบคุณที่เข้าใจ ผมจะระวังให้มากขึ้นครับ",
        romanization:
          "khɔ̀ɔp(L)-khun(M) thîi(F) khâo(F)-jai(M), phǒm(R) jà(L) rá-wang(M) hâi(F) mâak(F)-khʉ̂n(F) kráp",
        vi: "Cảm ơn đã thông cảm, tôi sẽ cẩn thận hơn.",
        en: "Thank you for understanding; I'll be more careful.",
        pronunciation_focus: [
          "ขอบคุณที่เข้าใจ → khɔ̀ɔp-khun thîi khâo-jai: kết bằng cảm ơn, không van xin",
          "ระวังให้มากขึ้น → rá-wang hâi mâak-khʉ̂n: 'cẩn thận hơn' — cam kết",
        ],
        pronunciation_focus_en: [
          "ขอบคุณที่เข้าใจ → khɔ̀ɔp-khun thîi khâo-jai: close with thanks, not pleading",
          "ระวังให้มากขึ้น → rá-wang hâi mâak-khʉ̂n: 'be more careful' — a commitment",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi giải thích lỗi với người Thái, nhận trách nhiệm NGẮN GỌN rồi chuyển sang giải pháp — đừng bào chữa dài dòng hay đổ lỗi người khác (làm họ mất mặt). Trình tự được tin cậy: ขออภัย (xin lỗi + nhận lỗi) → สาเหตุคือ (nêu nguyên nhân ngắn) → รับผิดชอบ + จะแก้ไข (chịu trách nhiệm, sửa) → เพื่อไม่ให้เกิดอีก (cách phòng ngừa) → ขอบคุณที่เข้าใจ. Bình tĩnh và cụ thể đáng tin hơn là xin lỗi rối rít.",
    cultural_notes_en:
      "When explaining a mistake to Thai colleagues, own it BRIEFLY then pivot to the fix — don't over-justify or blame others (that costs them face). The trusted order: ขออภัย (apologize + own it) → สาเหตุคือ (state a short cause) → รับผิดชอบ + จะแก้ไข (take responsibility, fix) → เพื่อไม่ให้เกิดอีก (prevention) → ขอบคุณที่เข้าใจ. Calm and specific beats frantic apologizing.",
    tip_advice_vi:
      "Một câu nguyên nhân là đủ — nhiều hơn nghe như bào chữa. Luôn kèm bước PHÒNG NGỪA ('เพื่อไม่ให้เกิดอีก'); đó là phần sếp Thái nhớ nhất. Tránh đổ lỗi đồng nghiệp.",
    tip_advice_en:
      "One sentence of cause is enough — more sounds like excuse-making. Always include the PREVENTION step ('so it won't recur'); that's what a Thai boss remembers most. Never shift blame to colleagues.",
    l1_notes_vi: [
      {
        mistake: "Bào chữa dài: 'tại vì… tại vì… không phải lỗi em…'",
        fix_vi:
          "Người Việt hay kể hoàn cảnh để giảm lỗi, nhưng với người Thái điều đó nghe như chối trách nhiệm. Nhận lỗi một câu ('เป็นความผิดพลาดของผมเอง') rồi sang giải pháp ngay.",
        fix_en:
          "Vietnamese often narrates context to soften fault, but to Thai ears that reads as dodging. Own it in one line ('it was my own mistake') then move to the fix.",
      },
      {
        mistake: "เป็นความผิดของ [đồng nghiệp] (đổ lỗi người khác).",
        fix_vi:
          "Đổ lỗi đồng nghiệp làm cả nhóm mất mặt. Dù không hoàn toàn lỗi mình, hãy nói 'ทีมเรา' (nhóm mình) hoặc nhận phần của mình rồi đề xuất sửa chung.",
        fix_en:
          "Blaming a coworker makes the whole team lose face. Even if it's not all yours, say 'our team' or own your part and propose a shared fix.",
      },
    ],
    vocabulary: [
      { word: "ขออภัย", romanization: "khɔ̌ɔ-à-phai", en: "to apologize (formal)", vi: "xin lỗi (trang trọng)", pos: "v." },
      { word: "ความผิดพลาด", romanization: "khwaam-phìt-phlâat", en: "mistake / error", vi: "sai sót", pos: "n." },
      { word: "สาเหตุ", romanization: "sǎa-hèet", en: "cause / reason", vi: "nguyên nhân", pos: "n." },
      { word: "คลาดเคลื่อน", romanization: "khlâat-khlʉ̂an", en: "inaccurate / off", vi: "sai lệch", pos: "adj." },
      { word: "รับผิดชอบ", romanization: "ráp-phìt-chɔ̂ɔp", en: "to be responsible", vi: "chịu trách nhiệm", pos: "v." },
      { word: "แก้ไข", romanization: "gɛ̂ɛ-khǎi", en: "to fix / correct", vi: "khắc phục", pos: "v." },
      { word: "เพื่อไม่ให้เกิดอีก", romanization: "phʉ̂a mâi hâi gəət ìik", en: "so it won't happen again", vi: "để không tái diễn", pos: "phrase" },
      { word: "ระวัง", romanization: "rá-wang", en: "to be careful", vi: "cẩn thận", pos: "v." },
    ],
    dialogue: [
      { speaker: "หัวหน้า (Sếp)", text: "รายงานที่ส่งมาตัวเลขไม่ตรงนะครับ เกิดอะไรขึ้น", romanization: "raai-ngaan thîi sòng maa dtua-lêek mâi dtrong ná kráp, gəət à-rai khʉ̂n", en: "The figures in the report you sent don't match. What happened?", vi: "Báo cáo anh gửi số liệu không khớp. Có chuyện gì vậy?" },
      { speaker: "พนักงาน (NV)", text: "ต้องขออภัยด้วยครับ เป็นความผิดพลาดของผมเอง สาเหตุคือผมเข้าใจรายละเอียดคลาดเคลื่อน", romanization: "dtɔ̂ng khɔ̌ɔ-à-phai dûai kráp, bpen khwaam-phìt-phlâat khɔ̌ɔng phǒm eeng, sǎa-hèet khʉʉ phǒm khâo-jai raai-lá-ìat khlâat-khlʉ̂an", en: "I apologize; it was my own mistake. The cause is I misunderstood the details.", vi: "Em xin lỗi, là lỗi của chính em. Nguyên nhân là em hiểu sai chi tiết." },
      { speaker: "พนักงาน (NV)", text: "ผมจะรีบแก้ไขทันที และจะตรวจสอบสองรอบเพื่อไม่ให้เกิดอีกครับ", romanization: "phǒm jà rîip gɛ̂ɛ-khǎi than-thii, lɛ́ jà dtrùat-sɔ̀ɔp sɔ̌ɔng rɔ̂ɔp phʉ̂a mâi hâi gəət ìik kráp", en: "I'll fix it right away and double-check so it won't recur.", vi: "Em sẽ sửa ngay và kiểm tra hai lần để không tái diễn." },
    ],
    exercises: [
      { type: "fill-blank", question: "ผม___เต็มที่และจะรีบแก้ไขครับ (nhận trách nhiệm)", answer: "รับผิดชอบ", hint_vi: "'chịu trách nhiệm'", hint_en: "'take responsibility'" },
      { type: "matching", pairs: [["สาเหตุ", "nguyên nhân (cause)"], ["คลาดเคลื่อน", "sai lệch (off/inaccurate)"], ["เพื่อไม่ให้เกิดอีก", "để không tái diễn (so it won't recur)"]], instruction: "Nối từ với nghĩa", instruction_en: "Match the word with its meaning" },
      { type: "translation", vietnamese: "Xin lỗi, là lỗi của em; em chịu trách nhiệm và sẽ sửa ngay để không tái diễn.", english: "I'm sorry, it's my mistake; I take responsibility and will fix it so it won't recur.", thai: "ขออภัยครับ เป็นความผิดของผมเอง ผมรับผิดชอบและจะแก้ไขทันทีเพื่อไม่ให้เกิดอีกครับ" },
    ],
  },

  // ── 10. A longer connected turn: signposting an extended point (expressions) ─
  {
    id: "thai_expressions_connected_turn",
    level: "B2",
    category: "expressions",
    title_vi: "Lượt nói dài có mạch lạc: dẫn dắt một ý kéo dài",
    title_en: "A longer connected turn: signposting an extended point",
    sentences: [
      {
        th: "ก่อนอื่น ผมขอเล่าที่มาของปัญหาสั้นๆ ก่อนครับ",
        romanization:
          "gɔ̀ɔn(L)-ʉ̀ʉn(L), phǒm(R) khɔ̌ɔ(R) lâo(F) thîi(F)-maa(M) khɔ̌ɔng(R) bpan(M)-hǎa(R) sân(F)-sân(F) gɔ̀ɔn(L) kráp",
        vi: "Trước hết, tôi xin kể ngắn gọn nguồn gốc vấn đề.",
        en: "First of all, let me briefly explain the background of the problem.",
        pronunciation_focus: [
          "ก่อนอื่น → gɔ̀ɔn-ʉ̀ʉn: 'trước hết' — mở một lượt nói dài",
          "ที่มา → thîi-maa: 'nguồn gốc/xuất xứ'",
        ],
        pronunciation_focus_en: [
          "ก่อนอื่น → gɔ̀ɔn-ʉ̀ʉn: 'first of all' — opens a long turn",
          "ที่มา → thîi-maa: 'origin / background'",
        ],
      },
      {
        th: "หลังจากนั้น เราก็ลองหลายวิธีแต่ยังไม่ได้ผล",
        romanization:
          "lǎng(R)-jàak(L)-nán(H), rao(M) gɔ̂ɔ(F) lɔɔng(M) lǎai(R) wí-thii(M) dtɛ̀ɛ(L) yang(M) mâi(F) dâai(F)-phǒn(R)",
        vi: "Sau đó, chúng tôi đã thử nhiều cách nhưng vẫn chưa hiệu quả.",
        en: "After that, we tried several methods but still got no results.",
        pronunciation_focus: [
          "หลังจากนั้น → lǎng-jàak-nán: 'sau đó' — nối trình tự thời gian",
          "ไม่ได้ผล → mâi dâai-phǒn: 'không hiệu quả'",
        ],
        pronunciation_focus_en: [
          "หลังจากนั้น → lǎng-jàak-nán: 'after that' — sequences time",
          "ไม่ได้ผล → mâi dâai-phǒn: 'no results'",
        ],
      },
      {
        th: "นอกจากนี้ ยังมีอีกประเด็นที่ผมอยากพูดถึงด้วย",
        romanization:
          "nɔ̂ɔk(F)-jàak(L)-níi(H), yang(M) mii(M) ìik(L) bprà-den(M) thîi(F) phǒm(R) yàak(L) phûut(F)-thʉ̌ng(R) dûai(F)",
        vi: "Ngoài ra, còn một vấn đề nữa tôi muốn nhắc đến.",
        en: "Besides this, there's another point I'd like to mention.",
        pronunciation_focus: [
          "นอกจากนี้ → nɔ̂ɔk-jàak-níi: 'ngoài ra' — thêm một ý mới",
          "ประเด็น → bprà-den: 'vấn đề/luận điểm'",
        ],
        pronunciation_focus_en: [
          "นอกจากนี้ → nɔ̂ɔk-jàak-níi: 'besides this' — adds a new point",
          "ประเด็น → bprà-den: 'point / issue'",
        ],
      },
      {
        th: "ดังนั้น ผมจึงเสนอให้เราปรับแผนใหม่ทั้งหมด",
        romanization:
          "dang(M)-nán(H), phǒm(R) jʉng(M) sà-nə̌ə(R) hâi(F) rao(M) bpràp(L) phɛ̌ɛn(R) mài(L) tháng(H)-mòt(L)",
        vi: "Do đó, tôi đề xuất chúng ta điều chỉnh lại toàn bộ kế hoạch.",
        en: "Therefore, I propose we revise the entire plan.",
        pronunciation_focus: [
          "ดังนั้น…จึง → dang-nán … jʉng: 'do đó…bèn' — nối kết luận",
          "เสนอให้ → sà-nə̌ə hâi: 'đề xuất rằng'",
        ],
        pronunciation_focus_en: [
          "ดังนั้น…จึง → dang-nán … jʉng: 'therefore' — links to a conclusion",
          "เสนอให้ → sà-nə̌ə hâi: 'propose that'",
        ],
      },
      {
        th: "สุดท้ายแล้ว ผมเชื่อว่าถ้าร่วมมือกัน เราจะแก้ปัญหาได้แน่นอน",
        romanization:
          "sùt(L)-tháai(H) lɛ́ɛw(H), phǒm(R) chʉ̂a(F) wâa(F) thâa(F) rûam(F)-mʉʉ(M) gan(M), rao(M) jà(L) gɛ̂ɛ(F) bpan(M)-hǎa(R) dâai(F) nɛ̂ɛ(F)-nɔɔn(M)",
        vi: "Cuối cùng, tôi tin nếu hợp tác thì ta chắc chắn giải quyết được.",
        en: "Finally, I believe that if we cooperate, we'll surely solve it.",
        pronunciation_focus: [
          "สุดท้ายแล้ว → sùt-tháai lɛ́ɛw: 'cuối cùng' — đóng lượt nói dài",
          "ร่วมมือกัน → rûam-mʉʉ gan: 'hợp tác cùng nhau'",
        ],
        pronunciation_focus_en: [
          "สุดท้ายแล้ว → sùt-tháai lɛ́ɛw: 'finally' — closes the long turn",
          "ร่วมมือกัน → rûam-mʉʉ gan: 'cooperate together'",
        ],
      },
    ],
    cultural_notes_vi:
      "Để giữ lượt nói dài mà người nghe vẫn theo kịp, người Thái dùng từ DẪN DẮT đặt đầu mỗi ý: 'ก่อนอื่น' (trước hết) → 'หลังจากนั้น' (sau đó) → 'นอกจากนี้' (ngoài ra) → 'ดังนั้น' (do đó) → 'สุดท้ายแล้ว' (cuối cùng). Những mốc này như biển báo, cho phép bạn giữ sàn một cách lịch sự và giúp người nghe biết bạn đang ở đâu trong mạch lập luận. Lượt nói dài có cấu trúc, không vội vã, được đánh giá là điềm đạm và đáng tin ở B2.",
    cultural_notes_en:
      "To hold a long turn while the listener keeps up, Thai uses SIGNPOST words at the head of each idea: 'ก่อนอื่น' (first of all) → 'หลังจากนั้น' (after that) → 'นอกจากนี้' (besides) → 'ดังนั้น' (therefore) → 'สุดท้ายแล้ว' (finally). These act as road signs, let you keep the floor politely, and tell the listener where you are in the argument. A structured, unhurried long turn reads as composed and credible at B2.",
    tip_advice_vi:
      "Mỗi ý mới mở bằng MỘT từ dẫn dắt — đừng nối tất cả bằng 'แล้ว…แล้ว' (rồi…rồi). Luân phiên từ chuyển để mạch không đơn điệu. Đóng lại bằng 'สุดท้ายแล้ว' để báo hiệu bạn sắp nhường lời.",
    tip_advice_en:
      "Open each new idea with ONE signpost — don't string everything with 'แล้ว…แล้ว' (and then…and then). Rotate connectors so the flow isn't monotone. Close with 'สุดท้ายแล้ว' to signal you're handing the floor back.",
    l1_notes_vi: [
      {
        mistake: "Nối cả đoạn bằng 'แล้ว…แล้ว…แล้ว' (rồi…rồi…rồi).",
        fix_vi:
          "Người Việt quen kể chuỗi bằng 'rồi'. Trong tiếng Thái lặp 'แล้ว' nghe trẻ con; dùng các mốc khác nhau: หลังจากนั้น / นอกจากนี้ / ดังนั้น để nâng độ trưởng thành.",
        fix_en:
          "Vietnamese chains events with 'rồi'. Repeating 'แล้ว' sounds childish in Thai; vary the markers — หลังจากนั้น / นอกจากนี้ / ดังนั้น — to sound mature.",
      },
      {
        mistake: "Bỏ qua từ dẫn dắt, nói một mạch không mốc.",
        fix_vi:
          "Không có biển báo, người nghe Thái khó theo và có thể cắt lời. Đặt 'ก่อนอื่น/นอกจากนี้/สุดท้ายแล้ว' ở đầu ý để giữ sàn lịch sự.",
        fix_en:
          "Without signposts, a Thai listener loses the thread and may cut in. Place 'ก่อนอื่น/นอกจากนี้/สุดท้ายแล้ว' at the head of each idea to keep the floor politely.",
      },
    ],
    vocabulary: [
      { word: "ก่อนอื่น", romanization: "gɔ̀ɔn-ʉ̀ʉn", en: "first of all", vi: "trước hết", pos: "adv." },
      { word: "หลังจากนั้น", romanization: "lǎng-jàak-nán", en: "after that", vi: "sau đó", pos: "adv." },
      { word: "นอกจากนี้", romanization: "nɔ̂ɔk-jàak-níi", en: "besides this", vi: "ngoài ra", pos: "conj." },
      { word: "ดังนั้น", romanization: "dang-nán", en: "therefore", vi: "do đó", pos: "conj." },
      { word: "สุดท้ายแล้ว", romanization: "sùt-tháai lɛ́ɛw", en: "finally", vi: "cuối cùng", pos: "adv." },
      { word: "ประเด็น", romanization: "bprà-den", en: "point / issue", vi: "vấn đề / luận điểm", pos: "n." },
      { word: "เสนอ", romanization: "sà-nə̌ə", en: "to propose", vi: "đề xuất", pos: "v." },
      { word: "ร่วมมือ", romanization: "rûam-mʉʉ", en: "to cooperate", vi: "hợp tác", pos: "v." },
    ],
    dialogue: [
      { speaker: "A", text: "ช่วยสรุปสถานการณ์ให้หน่อยได้ไหมครับ", romanization: "chûai sà-rùp sà-thǎan-ná-gaan hâi nɔ̀i dâai mǎi kráp", en: "Could you summarize the situation for us?", vi: "Anh tóm tắt tình hình giúp được không?" },
      { speaker: "B", text: "ได้ครับ ก่อนอื่นผมขอเล่าที่มาสั้นๆ หลังจากนั้นเราลองหลายวิธีแต่ยังไม่ได้ผล", romanization: "dâai kráp, gɔ̀ɔn-ʉ̀ʉn phǒm khɔ̌ɔ lâo thîi-maa sân-sân, lǎng-jàak-nán rao lɔɔng lǎai wí-thii dtɛ̀ɛ yang mâi dâai-phǒn", en: "Sure. First, let me give the background briefly; after that, we tried several methods but got no results.", vi: "Được. Trước hết tôi kể ngắn nguồn gốc, sau đó chúng tôi thử nhiều cách nhưng chưa hiệu quả." },
      { speaker: "B", text: "ดังนั้นผมจึงเสนอให้ปรับแผนใหม่ สุดท้ายแล้วถ้าร่วมมือกันเราแก้ได้แน่นอนครับ", romanization: "dang-nán phǒm jʉng sà-nə̌ə hâi bpràp phɛ̌ɛn mài, sùt-tháai lɛ́ɛw thâa rûam-mʉʉ gan rao gɛ̂ɛ dâai nɛ̂ɛ-nɔɔn kráp", en: "So I propose we revise the plan; finally, if we cooperate, we'll surely solve it.", vi: "Do đó tôi đề xuất điều chỉnh kế hoạch; cuối cùng nếu hợp tác thì ta chắc chắn làm được." },
    ],
    exercises: [
      { type: "fill-blank", question: "___ ผมขอเล่าที่มาของปัญหาก่อนครับ (mở lượt nói dài)", answer: "ก่อนอื่น", hint_vi: "'trước hết'", hint_en: "'first of all'" },
      { type: "matching", pairs: [["หลังจากนั้น", "sau đó (after that)"], ["นอกจากนี้", "ngoài ra (besides)"], ["สุดท้ายแล้ว", "cuối cùng (finally)"]], instruction: "Nối từ với nghĩa", instruction_en: "Match the word with its meaning" },
      { type: "translation", vietnamese: "Trước hết tôi kể nguồn gốc, sau đó nêu giải pháp, cuối cùng tôi tin ta làm được.", english: "First I'll give the background, after that the solution, and finally I believe we can do it.", thai: "ก่อนอื่นผมขอเล่าที่มา หลังจากนั้นเสนอวิธีแก้ สุดท้ายแล้วผมเชื่อว่าเราทำได้ครับ" },
    ],
  },
];

export default lessons;
