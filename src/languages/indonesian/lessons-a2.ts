// src/languages/indonesian/lessons-a2.ts
//
// Indonesian (Bahasa Indonesia) A2 lessons for Vietnamese learners.
//
// Shape mirrors the Brazilian Portuguese A2 pack
// (src/languages/portuguese/lessons-a2.ts) so the shared lesson page UI stays
// consistent across language verticals. The types are declared INLINE here
// because the Indonesian vertical's `./lessons` registry is owned by a separate
// file; keeping this module self-contained avoids a load-order dependency. When
// the shared registry is wired up, swap these to a type-only import.
//
// Variety: standard Bahasa Indonesia (Jakarta-centred where it matters: ojek
// online / Gojek / Grab, Indomaret, KRL, QRIS, rupiah). Regional or Malaysian
// forms are intentionally NOT used.
//
// Vietnamese-first: every lesson carries L1 notes — the specific mistakes a
// Vietnamese speaker makes — under `l1_notes_vi`, focused on the AFFIX SYSTEM
// (ber-, meN-, peN-, di-, ter-, -kan, -an, ke-…-an), which is the single
// biggest hurdle for Vietnamese learners (Vietnamese has no productive
// affixation). Hand-crafted; no AI filler.
//
// A2 target: describe a daily routine, shop and bargain at a market, use public
// transport, tell the time / days / months, talk about the weather, and look
// for and rent a place to live.
//
// Pronunciation conventions for Vietnamese readers (Indonesian is almost
// perfectly phonetic — one letter, one sound — which is a HUGE advantage for
// Vietnamese speakers; viết sao đọc vậy):
//   - 'c'  → "ch"  (cari → CHA-ri)        ; 'j' → "j"/"gi" voiced (jam → "jam")
//   - 'ng' → giống "ng" tiếng Việt, kể cả đầu từ (ngantuk) — RẤT dễ cho ng. Việt
//   - 'ny' → "nh"  (nyala → NHA-la)       ; 'sy' → "s/sh" ; 'kh' → "kh"
//   - 'e'  có hai cách đọc: âm mờ schwa ≈ "ơ" nhẹ (besar → bơ-SAR) hoặc rõ "ê"
//   - 'r'  rung nhẹ đầu lưỡi ; 'h' cuối từ đọc nhẹ (rumah → RU-mah)
//   - không có thanh điệu, không nối âm phức tạp ; trọng âm nhẹ, thường ở âm áp chót
//   - stressed syllable is written in CAPS in the respellings below

// ── Types (inline — Indonesian vertical keeps each lesson file self-contained) ─

export type IndonesianCategoryId =
  | "daily_routine"
  | "shopping"
  | "transport"
  | "time"
  | "weather"
  | "housing";

export type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type IndonesianLessonSentence = {
  /** The Indonesian target sentence (the line the learner speaks). */
  id: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Literal English gloss, for the secondary EN audience. */
  en?: string;
  /** Pronunciation / grammar focus points, written for a Vietnamese ear. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  cell_id?: string;
  /** Indonesian word (base or affixed form, as the learner will meet it). */
  word: string;
  en: string;
  vi: string;
  pos: string;
  /** Pronunciation respelled for a Vietnamese reader; stressed syllable CAPS. */
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

/** A Vietnamese-speaker L1-interference note: the mistake + the fix. */
export type IndonesianL1Note = {
  /** The wrong form a Vietnamese learner tends to produce. */
  mistake: string;
  /** Why it happens / what the correct form is, in Vietnamese. */
  fix_vi: string;
};

// Loosely typed so per-type exercise fields can vary (fill_blank / matching /
// translation), matching the Portuguese pack's Exercise contract.
export type IndonesianExercise = Record<string, unknown>;

export type IndonesianLesson = {
  id: string;
  category: IndonesianCategoryId;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: IndonesianLessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  /** Vietnamese-first L1 interference notes — the heart of this pack. */
  l1_notes_vi?: IndonesianL1Note[];
  vocabulary?: IndonesianVocabEntry[];
  dialogue?: IndonesianDialogueLine[];
  exercises?: IndonesianExercise[];
};

// ── A2 lessons ───────────────────────────────────────────────────────────────

export const lessons: IndonesianLesson[] = [
  // ── 1. Daily routine & schedule ─────────────────────────────────────────────
  {
    id: "indonesian_daily_routine",
    level: "A2",
    category: "daily_routine",
    title_vi: "Rutinitas hằng ngày",
    title_en: "Daily routine and schedule",
    sentences: [
      {
        id: "Saya bangun jam enam pagi.",
        vi: "Tôi thức dậy lúc sáu giờ sáng.",
        en: "I wake up at six in the morning.",
        pronunciation_focus: [
          "bangun → 'BA-ngun', 'ng' giống tiếng Việt — rất dễ",
          "jam enam → 'jam e-NAM' = lúc sáu giờ",
          "pagi → 'PA-gi', g cứng như 'g' tiếng Việt",
        ],
        pronunciation_focus_en: [
          "bangun → 'BAH-ngoon' — 'ng' as in 'singer'; means to wake up",
          "'jam enam' = at six o'clock ('jam' = hour/o'clock)",
          "pagi → 'PAH-ghee' = morning; hard 'g'",
        ],
      },
      {
        id: "Setelah mandi, saya sarapan.",
        vi: "Sau khi tắm, tôi ăn sáng.",
        en: "After showering, I have breakfast.",
        pronunciation_focus: [
          "setelah → 'se-TE-lah' = sau khi",
          "mandi → 'MAN-di' = tắm",
          "sarapan → 'sa-RA-pan' = bữa sáng / ăn sáng",
        ],
        pronunciation_focus_en: [
          "setelah → 'suh-TUH-lah' = after",
          "mandi → 'MAHN-dee' = to bathe/shower",
          "sarapan → 'sah-RAH-pahn' = breakfast / to have breakfast",
        ],
      },
      {
        id: "Saya berangkat ke kantor naik ojek.",
        vi: "Tôi đi đến văn phòng bằng xe ôm.",
        en: "I leave for the office by motorbike taxi.",
        pronunciation_focus: [
          "berangkat → 'be-RANG-kat', tiền tố 'ber-' = khởi hành",
          "kantor → 'KAN-tor' = văn phòng",
          "naik ojek → 'NA-ik Ô-jek' = đi bằng xe ôm",
        ],
        pronunciation_focus_en: [
          "berangkat → 'buh-RAHNG-kat' — 'ber-' prefix; means to depart/set off",
          "kantor → 'KAHN-tor' = office",
          "'naik ojek' = to ride a motorbike taxi ('naik' = to board/ride)",
        ],
      },
      {
        id: "Saya bekerja dari jam sembilan sampai jam lima.",
        vi: "Tôi làm việc từ chín giờ đến năm giờ.",
        en: "I work from nine until five.",
        pronunciation_focus: [
          "bekerja → 'be-KER-ja', 'ber-' + kerja → bekerja (việc → làm việc)",
          "dari … sampai … → 'DA-ri … SAM-pai …' = từ … đến …",
          "sembilan → 'sem-BI-lan' = chín",
        ],
        pronunciation_focus_en: [
          "bekerja → 'buh-KER-jah' — 'ber-' + 'kerja' (work) = to work",
          "'dari … sampai …' = from … until …",
          "sembilan → 'sem-BEE-lahn' = nine",
        ],
      },
      {
        id: "Malam hari saya beristirahat di rumah.",
        vi: "Buổi tối tôi nghỉ ngơi ở nhà.",
        en: "In the evening I rest at home.",
        pronunciation_focus: [
          "malam → 'MA-lam' = buổi tối / đêm",
          "beristirahat → 'be-ris-ti-RA-hat', 'ber-' + istirahat = nghỉ ngơi",
          "di rumah → 'di RU-mah' = ở nhà, 'di' = ở (vị trí)",
        ],
        pronunciation_focus_en: [
          "malam → 'MAH-lahm' = night/evening",
          "beristirahat → 'buh-ris-tee-RAH-hat' — 'ber-' + 'istirahat' = to rest",
          "'di rumah' = at home ('di' = at/in, marks location)",
        ],
      },
    ],
    cultural_notes_vi:
      "Người Indonesia dậy sớm — nhiều người theo đạo Hồi dậy lúc ~4h30 cho buổi cầu nguyện subuh, nên một ngày bắt đầu rất sớm. Ở các thành phố lớn như Jakarta, kẹt xe (macet) rất nặng, nên dân công sở thường đi làm sớm và dùng ojek online (Gojek/Grab) để luồn lách. Bữa sáng (sarapan) thường có nasi uduk, bubur ayam hoặc roti, ăn nhanh trước khi ra đường.",
    cultural_notes_en:
      "Indonesians start the day early — many Muslims rise around 4:30 for the dawn (subuh) prayer. In big cities like Jakarta, traffic ('macet') is brutal, so office workers leave early and lean on app-based motorbike taxis (Gojek/Grab) to weave through it. Breakfast ('sarapan') — nasi uduk, chicken porridge, or bread — is quick, eaten before heading out.",
    tip_advice_vi:
      "Tin vui cho người Việt: động từ tiếng Indonesia KHÔNG chia theo ngôi hay thì. 'Saya makan', 'dia makan', 'kemarin saya makan' — động từ 'makan' không đổi. Thì được thể hiện bằng từ thời gian (sudah = đã, akan = sẽ, kemarin = hôm qua, besok = ngày mai). Việc khó duy nhất là TIỀN TỐ: 'ber-' biến danh từ/gốc thành động từ nội động (kerja → bekerja, angkat → berangkat).",
    tip_advice_en:
      "Good news for Vietnamese speakers: Indonesian verbs do NOT conjugate for person or tense. 'Saya makan', 'dia makan', 'kemarin saya makan' all keep 'makan' unchanged. Tense is shown with time words (sudah = already, akan = will, kemarin = yesterday, besok = tomorrow). The one real challenge is AFFIXES: 'ber-' turns a root into an intransitive verb (kerja → bekerja, angkat → berangkat).",
    l1_notes_vi: [
      {
        mistake: "Cố chia động từ theo thì như tiếng Anh (thêm '-ed', '-s').",
        fix_vi: "Tiếng Indonesia không đổi đuôi động từ. 'Hôm qua tôi đi' = 'Kemarin saya pergi' — 'pergi' giữ nguyên. Dùng từ thời gian, đừng đổi động từ. Điều này giống tiếng Việt.",
      },
      {
        mistake: "Bỏ tiền tố 'ber-': nói 'saya kerja', 'saya angkat ke kantor'.",
        fix_vi: "'ber-' tạo động từ nội động: kerja (việc) → bekerja (làm việc), angkat → berangkat (khởi hành), istirahat → beristirahat (nghỉ). Trong nói chuyện đời thường 'saya kerja' nghe được, nhưng dạng chuẩn là 'bekerja'. Lưu ý: 'ber-' + r → 'be-' (bekerja, beristirahat).",
      },
      {
        mistake: "Quên giới từ 'di' chỉ vị trí (nói 'saya rumah' = tôi nhà).",
        fix_vi: "'di' = ở (tại một nơi): 'di rumah' (ở nhà), 'di kantor' (ở văn phòng). Khác 'ke' = đến (hướng đi): 'ke kantor' (đến văn phòng). Đừng lẫn 'di' với 'ke'.",
      },
    ],
    vocabulary: [
      { cell_id: "05c84804-fc83-435c-8113-bc00060c6a30", word: "bangun", en: "to wake up", vi: "thức dậy", pos: "verb", pronunciation_vi: "BA-ngun", pronunciation_en: "BAH-ngoon" },
      { cell_id: "ec7c2f5e-9281-44c5-ab62-f0acbf8280a0", word: "mandi", en: "to bathe / shower", vi: "tắm", pos: "verb", pronunciation_vi: "MAN-di", pronunciation_en: "MAHN-dee" },
      { cell_id: "adac9c56-b4ba-44ab-a6cc-8cda39dbef8a", word: "sarapan", en: "breakfast", vi: "bữa sáng", pos: "noun/verb", pronunciation_vi: "sa-RA-pan", pronunciation_en: "sah-RAH-pahn" },
      { cell_id: "ed2bdc62-51ca-48a6-add3-5a810a725ec2", word: "berangkat", en: "to depart / leave for", vi: "khởi hành / đi tới", pos: "verb (ber-)", pronunciation_vi: "be-RANG-kat", pronunciation_en: "buh-RAHNG-kat" },
      { cell_id: "0c7b47cd-0118-4788-961b-68a1ddd8e50f", word: "kantor", en: "office", vi: "văn phòng", pos: "noun", pronunciation_vi: "KAN-tor", pronunciation_en: "KAHN-tor" },
      { cell_id: "4ee32b5b-d443-4dc7-a88a-370e8239b68d", word: "bekerja", en: "to work", vi: "làm việc", pos: "verb (ber-)", pronunciation_vi: "be-KER-ja", pronunciation_en: "buh-KER-jah" },
      { cell_id: "9f139381-95eb-48ea-bc66-6e41670cc3e2", word: "beristirahat", en: "to rest", vi: "nghỉ ngơi", pos: "verb (ber-)", pronunciation_vi: "be-ris-ti-RA-hat", pronunciation_en: "buh-ris-tee-RAH-hat" },
      { cell_id: "ba1cf15a-df87-43a4-9820-10754a0b90b7", word: "setiap hari", en: "every day", vi: "mỗi ngày", pos: "phrase", pronunciation_vi: "se-TI-ap HA-ri", pronunciation_en: "suh-TEE-ap HAH-ree" },
    ],
    dialogue: [
      { cell_id: "fff8ee64-dad2-4021-aed1-c881b1ca1da2", speaker: "A", text: "Jam berapa kamu bangun?", vi: "Bạn thức dậy lúc mấy giờ?", en: "What time do you wake up?" },
      { cell_id: "267043eb-6098-4d5a-8d7a-53f9bf30148c", speaker: "B", text: "Saya bangun jam enam. Lalu mandi dan sarapan.", vi: "Tôi dậy lúc sáu giờ. Rồi tắm và ăn sáng.", en: "I wake up at six. Then I shower and have breakfast." },
      { cell_id: "aeba7fd3-9eea-4069-80be-f4ca4697e0bf", speaker: "A", text: "Kamu berangkat ke kantor naik apa?", vi: "Bạn đi đến văn phòng bằng gì?", en: "How do you get to the office?" },
      { cell_id: "298d066a-2d72-4e16-9ca7-bb5b6b7867ce", speaker: "B", text: "Naik ojek online. Malam hari saya beristirahat di rumah.", vi: "Bằng xe ôm công nghệ. Buổi tối tôi nghỉ ngơi ở nhà.", en: "By app motorbike taxi. In the evening I rest at home." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền tiền tố 'ber-' đúng dạng, hoặc giới từ đúng:",
        instruction_en: "Fill in the right 'ber-' verb form or preposition:",
        items: [
          { prompt: "Saya ___ ke kantor jam tujuh. (angkat → khởi hành)", answer: "berangkat", options: ["berangkat", "angkat", "mengangkat"] },
          { prompt: "Saya ___ dari jam sembilan sampai lima. (kerja → làm việc)", answer: "bekerja", options: ["bekerja", "kerja", "dikerja"] },
          { prompt: "Saya istirahat ___ rumah. (ở)", answer: "di", options: ["di", "ke", "dari"] },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi thức dậy lúc sáu giờ sáng.", answer: "Saya bangun jam enam pagi." },
          { prompt: "Sau khi tắm, tôi ăn sáng.", answer: "Setelah mandi, saya sarapan." },
          { prompt: "Buổi tối tôi nghỉ ngơi ở nhà.", answer: "Malam hari saya beristirahat di rumah." },
        ],
      },
    ],
  },

  // ── 2. Shopping & bargaining at the market ──────────────────────────────────
  {
    id: "indonesian_shopping_market",
    level: "A2",
    category: "shopping",
    title_vi: "Mua sắm & trả giá ở chợ",
    title_en: "Shopping and bargaining at the market",
    sentences: [
      {
        id: "Berapa harga satu kilo mangga, Bu?",
        vi: "Một ký xoài giá bao nhiêu vậy cô?",
        en: "How much is a kilo of mangoes, ma'am?",
        pronunciation_focus: [
          "berapa → 'be-RA-pa' = bao nhiêu",
          "harga → 'HAR-ga' = giá",
          "Bu → 'bu' (gọi phụ nữ lớn tuổi, lịch sự, từ 'Ibu')",
        ],
        pronunciation_focus_en: [
          "berapa → 'buh-RAH-pah' = how much / how many",
          "harga → 'HAR-gah' = price",
          "'Bu' (short for 'Ibu') = polite address for an adult woman, like 'ma'am'",
        ],
      },
      {
        id: "Ini terlalu mahal. Boleh kurang?",
        vi: "Cái này đắt quá. Bớt được không?",
        en: "This is too expensive. Can you lower it?",
        pronunciation_focus: [
          "terlalu → 'ter-LA-lu' = quá / quá mức",
          "mahal → 'MA-hal' = đắt",
          "boleh kurang? → 'BÔ-leh KU-rang?' = bớt được không? (câu mặc cả vàng)",
        ],
        pronunciation_focus_en: [
          "terlalu → 'ter-LAH-loo' = too (excessively)",
          "mahal → 'MAH-hal' = expensive",
          "'Boleh kurang?' = the golden bargaining line: 'can you take a bit off?'",
        ],
      },
      {
        id: "Kalau saya beli dua kilo, dapat diskon?",
        vi: "Nếu tôi mua hai ký thì có giảm giá không?",
        en: "If I buy two kilos, do I get a discount?",
        pronunciation_focus: [
          "kalau → 'KA-lau' = nếu",
          "beli → 'BE-li' = mua (gốc; dạng chuẩn 'membeli')",
          "dapat diskon → 'DA-pat DIS-kon' = được giảm giá",
        ],
        pronunciation_focus_en: [
          "kalau → 'KAH-low' = if",
          "beli → 'BUH-lee' = to buy (root; full form 'membeli')",
          "'dapat diskon' = to get a discount",
        ],
      },
      {
        id: "Saya mau membeli sayur dan buah.",
        vi: "Tôi muốn mua rau và trái cây.",
        en: "I want to buy vegetables and fruit.",
        pronunciation_focus: [
          "mau → 'MA-u' = muốn",
          "membeli → 'mem-BE-li', tiền tố 'meN-': beli → membeli (gốc 'b' → 'mem-')",
          "sayur dan buah → 'SA-yur dan BU-ah' = rau và trái cây",
        ],
        pronunciation_focus_en: [
          "mau → 'MAH-oo' = to want",
          "membeli → 'mem-BUH-lee' — 'meN-' prefix: a 'b' root takes 'mem-'",
          "'sayur dan buah' = vegetables and fruit",
        ],
      },
      {
        id: "Saya bayar tunai saja, ya.",
        vi: "Tôi trả tiền mặt thôi nhé.",
        en: "I'll just pay in cash, okay.",
        pronunciation_focus: [
          "bayar → 'BA-yar' = trả (tiền); dạng chuẩn 'membayar'",
          "tunai → 'TU-nai' = tiền mặt",
          "saja → 'SA-ja' = thôi / chỉ; 'ya' = nhé (làm câu mềm hơn)",
        ],
        pronunciation_focus_en: [
          "bayar → 'BAH-yar' = to pay (full form 'membayar')",
          "tunai → 'TOO-nigh' = cash",
          "'saja' = just/only; 'ya' softens the sentence ('…, okay?')",
        ],
      },
    ],
    cultural_notes_vi:
      "Người Indonesia mua rau quả ở 'pasar' (chợ truyền thống, thường ẩm ướt — 'pasar basah') hoặc ở minimarket (Indomaret, Alfamart) và siêu thị. Ở chợ thì TRẢ GIÁ (tawar-menawar) là chuyện bình thường và được mong đợi; ở toko/siêu thị thì giá niêm yết cố định ('harga pas') — đừng trả giá. Tiền là rupiah (Rp), số rất lớn: 'ribu' = nghìn, 'juta' = triệu (một tô phở ~ Rp 25.000). Thanh toán QRIS (quét mã QR) cực phổ biến.",
    cultural_notes_en:
      "Indonesians buy produce at a 'pasar' (traditional, often 'pasar basah' — wet market) or at minimarkets (Indomaret, Alfamart) and supermarkets. At the pasar, BARGAINING ('tawar-menawar') is normal and expected; at a toko/supermarket the price is fixed ('harga pas') — don't haggle. The currency is the rupiah (Rp) with big numbers: 'ribu' = thousand, 'juta' = million. QR-code payment (QRIS) is everywhere.",
    tip_advice_vi:
      "Trong nói chuyện đời thường người ta thường bỏ tiền tố 'meN-' (nói 'saya beli', 'saya bayar'), nhưng dạng CHUẨN có tiền tố: beli → membeli, bayar → membayar, jual → menjual. Quy tắc 'meN-': gốc bắt đầu bằng b/p → 'mem-' (beli→membeli, pakai→memakai); gốc c/d/j/t → 'men-' (cari→mencari). Học hai câu vàng để mua hàng: 'Berapa harga…?' và 'Boleh kurang?'.",
    tip_advice_en:
      "In casual speech the 'meN-' prefix is often dropped ('saya beli', 'saya bayar'), but the standard form carries it: beli → membeli, bayar → membayar, jual → menjual. 'meN-' rule: roots starting with b/p take 'mem-' (beli→membeli, pakai→memakai); roots with c/d/j/t take 'men-' (cari→mencari). Two golden shopping lines: 'Berapa harga…?' and 'Boleh kurang?'.",
    l1_notes_vi: [
      {
        mistake: "Luôn dùng dạng gốc trần ('saya beli', 'penjual jual') ngay cả khi viết.",
        fix_vi: "Nói thường thì bỏ tiền tố được, nhưng văn viết/lịch sự cần 'meN-': membeli, menjual, membayar. Người bán = 'penjual' (peN- + jual), người mua = 'pembeli' (peN- + beli) — tiền tố 'peN-' tạo danh từ chỉ người làm.",
      },
      {
        mistake: "Nói số tiền thiếu bậc nghìn: nói 'lima belas' khi định nói 'lima belas ribu' (15.000).",
        fix_vi: "Giá ở Indonesia luôn tính bằng nghìn (ribu) hoặc triệu (juta). 'lima belas ribu' = 15.000 Rp. Đừng quên 'ribu', nếu không bạn nói 15 đồng thay vì 15 nghìn.",
      },
      {
        mistake: "Trả giá ở Indomaret / siêu thị.",
        fix_vi: "Chỉ trả giá ở 'pasar'. Toko, minimarket, siêu thị có 'harga pas' (giá cố định) — hỏi 'boleh kurang?' ở đó sẽ bị nhìn lạ.",
      },
    ],
    vocabulary: [
      { cell_id: "7a030265-a59a-48c6-b44a-6876408b4f4e", word: "pasar", en: "market", vi: "chợ", pos: "noun", pronunciation_vi: "PA-sar", pronunciation_en: "PAH-sar" },
      { cell_id: "859a17fd-0824-4b85-baa8-7cbf5a6ef0e5", word: "toko", en: "shop / store", vi: "cửa hàng", pos: "noun", pronunciation_vi: "TÔ-ko", pronunciation_en: "TOH-koh" },
      { cell_id: "5a4edf6a-5d08-4bb2-bbee-19d22a266844", word: "harga", en: "price", vi: "giá", pos: "noun", pronunciation_vi: "HAR-ga", pronunciation_en: "HAR-gah" },
      { cell_id: "386777f9-a5ea-40d2-8590-2c2fae1c07f4", word: "menawar", en: "to bargain / haggle", vi: "trả giá / mặc cả", pos: "verb (meN-)", pronunciation_vi: "me-NA-war", pronunciation_en: "muh-NAH-war" },
      { cell_id: "2e29e92e-5a9d-4e38-8afb-1c47427fd975", word: "membeli", en: "to buy", vi: "mua", pos: "verb (meN-)", pronunciation_vi: "mem-BE-li", pronunciation_en: "mem-BUH-lee" },
      { cell_id: "99ba5206-303d-48da-96c9-08b51af118c9", word: "membayar", en: "to pay", vi: "trả tiền", pos: "verb (meN-)", pronunciation_vi: "mem-BA-yar", pronunciation_en: "mem-BAH-yar" },
      { cell_id: "7675ceba-3dda-43f6-9dde-38b88966c2a4", word: "mahal", en: "expensive", vi: "đắt", pos: "adj.", pronunciation_vi: "MA-hal", pronunciation_en: "MAH-hal" },
      { cell_id: "a800964b-bd84-4774-8305-3b945571c81e", word: "murah", en: "cheap", vi: "rẻ", pos: "adj.", pronunciation_vi: "MU-rah", pronunciation_en: "MOO-rah" },
      { cell_id: "f89d1268-0926-4e94-bbb3-66ab91c409f3", word: "tunai", en: "cash", vi: "tiền mặt", pos: "noun", pronunciation_vi: "TU-nai", pronunciation_en: "TOO-nigh" },
      { cell_id: "f33b3321-c61a-4dbd-ae32-e62475e48585", word: "ribu", en: "thousand", vi: "nghìn", pos: "num.", pronunciation_vi: "RI-bu", pronunciation_en: "REE-boo" },
    ],
    dialogue: [
      { cell_id: "23739912-368f-4449-829e-86984bfb6bfd", speaker: "Pembeli", text: "Bu, berapa harga satu kilo mangga?", vi: "Cô ơi, một ký xoài bao nhiêu?", en: "Ma'am, how much is a kilo of mangoes?" },
      { cell_id: "c22bf21b-b92d-453e-800a-5231bd8088e9", speaker: "Penjual", text: "Dua puluh lima ribu, Mas.", vi: "Hai lăm nghìn, anh.", en: "Twenty-five thousand, sir." },
      { cell_id: "e038e276-89d9-4af8-8a37-9d03d85e45ac", speaker: "Pembeli", text: "Mahal. Boleh kurang? Dua puluh ribu, ya?", vi: "Đắt quá. Bớt được không? Hai mươi nghìn nhé?", en: "Pricey. Can you lower it? Twenty thousand?" },
      { cell_id: "5e1ffe5a-4a1c-4e1e-bc68-c7e39d97ba6b", speaker: "Penjual", text: "Boleh, dua puluh dua ribu. Bayar tunai atau QRIS?", vi: "Được, hai hai nghìn. Trả tiền mặt hay QRIS?", en: "Okay, twenty-two thousand. Cash or QRIS?" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền dạng 'meN-'/'peN-' đúng, hoặc từ vựng đúng:",
        instruction_en: "Fill in the right 'meN-'/'peN-' form or vocabulary word:",
        items: [
          { prompt: "Saya mau ___ sayur. (beli → mua, dạng chuẩn)", answer: "membeli", options: ["membeli", "beli", "pembeli"] },
          { prompt: "Orang yang menjual disebut ___. (người bán)", answer: "penjual", options: ["penjual", "pembeli", "menjual"] },
          { prompt: "Harga di Indomaret sudah ___, tidak bisa ditawar. (cố định)", answer: "pas", options: ["pas", "mahal", "murah"] },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Một ký xoài giá bao nhiêu?", answer: "Berapa harga satu kilo mangga?" },
          { prompt: "Đắt quá. Bớt được không?", answer: "Terlalu mahal. Boleh kurang?" },
          { prompt: "Tôi trả tiền mặt thôi.", answer: "Saya bayar tunai saja." },
        ],
      },
    ],
  },

  // ── 3. Public transport ─────────────────────────────────────────────────────
  {
    id: "indonesian_transport",
    level: "A2",
    category: "transport",
    title_vi: "Phương tiện đi lại",
    title_en: "Getting around / public transport",
    sentences: [
      {
        id: "Saya naik ojek online ke stasiun.",
        vi: "Tôi đi xe ôm công nghệ đến nhà ga.",
        en: "I take an app motorbike taxi to the station.",
        pronunciation_focus: [
          "naik → 'NA-ik' = lên (xe) / đi bằng",
          "ojek online → 'Ô-jek ÔN-lain' = xe ôm công nghệ (Gojek/Grab)",
          "stasiun → 'sta-SI-un' = nhà ga (tàu)",
        ],
        pronunciation_focus_en: [
          "naik → 'NAH-eek' = to board / ride / go up",
          "'ojek online' = app-based motorbike taxi (Gojek/Grab)",
          "stasiun → 'stah-SEE-oon' = (train) station",
        ],
      },
      {
        id: "Berapa harga tiket kereta ke Bandung?",
        vi: "Vé tàu đến Bandung giá bao nhiêu?",
        en: "How much is a train ticket to Bandung?",
        pronunciation_focus: [
          "tiket → 'TI-ket' = vé",
          "kereta → 'ke-RÊ-ta' = tàu hỏa",
          "ke Bandung → 'ke BAN-dung' = đến Bandung, 'ke' = đến (hướng)",
        ],
        pronunciation_focus_en: [
          "tiket → 'TEE-ket' = ticket",
          "kereta → 'kuh-REH-tah' = train",
          "'ke Bandung' = to Bandung ('ke' = to/towards)",
        ],
      },
      {
        id: "Bus ini berhenti di mana?",
        vi: "Xe buýt này dừng ở đâu?",
        en: "Where does this bus stop?",
        pronunciation_focus: [
          "bus → 'bus' (cũng viết 'bis')",
          "berhenti → 'ber-HEN-ti', 'ber-' + henti = dừng (nội động)",
          "di mana? → 'di MA-na?' = ở đâu?",
        ],
        pronunciation_focus_en: [
          "bus → 'boos' (also spelled 'bis')",
          "berhenti → 'ber-HEN-tee' — 'ber-' + 'henti' = to stop (intransitive)",
          "'di mana?' = where? (for a location)",
        ],
      },
      {
        id: "Tolong antar saya ke bandara.",
        vi: "Làm ơn đưa tôi đến sân bay.",
        en: "Please take me to the airport.",
        pronunciation_focus: [
          "tolong → 'TÔ-long' = làm ơn / xin",
          "antar → 'AN-tar' = đưa/chở (dạng chuẩn 'mengantar')",
          "bandara → 'ban-DA-ra' = sân bay (viết tắt của 'bandar udara')",
        ],
        pronunciation_focus_en: [
          "tolong → 'TOH-long' = please / help",
          "antar → 'AHN-tar' = to take/deliver (full form 'mengantar')",
          "bandara → 'bahn-DAH-rah' = airport (short for 'bandar udara')",
        ],
      },
      {
        id: "Becak lebih lambat tapi lebih murah.",
        vi: "Xe xích lô chậm hơn nhưng rẻ hơn.",
        en: "A pedicab is slower but cheaper.",
        pronunciation_focus: [
          "becak → 'BÊ-chak', 'c' = 'ch' = xe xích lô đạp",
          "lebih … → 'le-BIH …' = … hơn (so sánh hơn)",
          "lambat → 'LAM-bat' = chậm; tapi → 'TA-pi' = nhưng",
        ],
        pronunciation_focus_en: [
          "becak → 'BEH-chak' — 'c' = 'ch'; a cycle-rickshaw/pedicab",
          "'lebih + adj' = more … (comparative): lebih lambat = slower",
          "lambat → 'LAHM-bat' = slow; tapi → 'TAH-pee' = but",
        ],
      },
    ],
    cultural_notes_vi:
      "Đi lại ở Indonesia rất đa dạng: 'ojek online' (xe ôm app Gojek/Grab) là vua đường phố, luồn qua 'macet' (kẹt xe) nhanh nhất. Jakarta có TransJakarta (xe buýt làn riêng), KRL (tàu điện ngoại ô), và MRT mới. Tàu liên tỉnh do KAI vận hành, đặt vé qua app. 'Becak' (xích lô) và 'angkot' (xe khách nhỏ chạy tuyến) vẫn phổ biến ở thành phố nhỏ như Yogyakarta. Khi lên ojek, nhớ đội mũ bảo hiểm (helm) tài xế đưa.",
    cultural_notes_en:
      "Transport in Indonesia is varied: the app motorbike taxi ('ojek online' — Gojek/Grab) rules the streets, slicing through 'macet' (traffic jams). Jakarta has TransJakarta (bus rapid transit), the KRL commuter rail, and a new MRT. Intercity trains are run by KAI, booked via app. 'Becak' (pedicabs) and 'angkot' (route minibuses) are still common in smaller cities like Yogyakarta. On an ojek, wear the helmet ('helm') the driver hands you.",
    tip_advice_vi:
      "Phân biệt hai tiền tố động từ: 'ber-' tạo động từ NỘI ĐỘNG (không có tân ngữ) — berhenti (tự dừng), berangkat (khởi hành); 'meN-' tạo động từ NGOẠI ĐỘNG (có tân ngữ) — mengantar (đưa AI ĐÓ): 'mengantar saya'. Từ 'naik' (lên/đi bằng) là gốc trần, cực kỳ thông dụng: naik ojek, naik bus, naik kereta. So sánh hơn chỉ cần thêm 'lebih': lebih cepat (nhanh hơn), lebih murah (rẻ hơn).",
    tip_advice_en:
      "Tell two verb prefixes apart: 'ber-' makes INTRANSITIVE verbs (no object) — berhenti (to stop), berangkat (to depart); 'meN-' makes TRANSITIVE verbs (take an object) — mengantar (to take someone): 'mengantar saya'. The word 'naik' (board/go by) is a bare root and super common: naik ojek, naik bus, naik kereta. Comparatives just add 'lebih': lebih cepat (faster), lebih murah (cheaper).",
    l1_notes_vi: [
      {
        mistake: "Dùng 'berhenti' với tân ngữ ('saya berhenti bus' = tôi dừng xe buýt).",
        fix_vi: "'berhenti' (ber-) là nội động: 'bus berhenti' (xe buýt dừng). Muốn 'dừng/đậu cái gì' dùng 'memberhentikan' hoặc đổi câu. Tiền tố 'ber-' = hành động tự thân, không tác động lên vật khác.",
      },
      {
        mistake: "Bỏ 'meN-' khi cần tân ngữ: 'tolong antar saya' so với dạng chuẩn.",
        fix_vi: "'antar' → 'mengantar' (meN-, gốc bắt đầu nguyên âm → 'meng-'). 'Tolong antar saya' nghe được trong khẩu ngữ, nhưng dạng đầy đủ là 'tolong mengantar saya'. Quy tắc 'meN-': gốc bắt đầu nguyên âm hoặc g/h/k → 'meng-' (antar→mengantar, kirim→mengirim).",
      },
      {
        mistake: "Quên 'lebih' khi so sánh: nói 'becak lambat tapi murah' khi muốn nói 'chậm hơn'.",
        fix_vi: "So sánh hơn = 'lebih + tính từ': lebih lambat (chậm hơn), lebih murah (rẻ hơn). Muốn so sánh với cái gì thì thêm 'daripada': 'lebih murah daripada taksi' (rẻ hơn taxi).",
      },
    ],
    vocabulary: [
      { cell_id: "df25dd0b-8df0-4335-8103-021e93ccafe1", word: "naik", en: "to ride / board / go by", vi: "lên (xe) / đi bằng", pos: "verb", pronunciation_vi: "NA-ik", pronunciation_en: "NAH-eek" },
      { cell_id: "cfa762bd-4bbf-4d89-b6a9-8f31574291f5", word: "ojek", en: "motorbike taxi", vi: "xe ôm", pos: "noun", pronunciation_vi: "Ô-jek", pronunciation_en: "OH-jek" },
      { cell_id: "b8a17e54-d33b-48a0-b262-c1eacc07306b", word: "kereta", en: "train", vi: "tàu hỏa", pos: "noun", pronunciation_vi: "ke-RÊ-ta", pronunciation_en: "kuh-REH-tah" },
      { cell_id: "68e771ad-1932-4d41-8464-0a9ce19c88bf", word: "stasiun", en: "(train) station", vi: "nhà ga", pos: "noun", pronunciation_vi: "sta-SI-un", pronunciation_en: "stah-SEE-oon" },
      { cell_id: "e5d392b1-ce60-4165-ba7f-1b5cc7b30ad4", word: "berhenti", en: "to stop", vi: "dừng lại", pos: "verb (ber-)", pronunciation_vi: "ber-HEN-ti", pronunciation_en: "ber-HEN-tee" },
      { cell_id: "07619a77-1f6a-4bb0-a5d0-1326135a05c2", word: "mengantar", en: "to take / deliver (someone)", vi: "đưa / chở", pos: "verb (meN-)", pronunciation_vi: "me-ngan-TAR", pronunciation_en: "muh-ngahn-TAR" },
      { cell_id: "63598091-7075-4959-85ee-fb1df68ffd0e", word: "bandara", en: "airport", vi: "sân bay", pos: "noun", pronunciation_vi: "ban-DA-ra", pronunciation_en: "bahn-DAH-rah" },
      { cell_id: "bba9d486-aebf-4dd2-b0a8-975baf138dbb", word: "becak", en: "pedicab / cycle-rickshaw", vi: "xe xích lô", pos: "noun", pronunciation_vi: "BÊ-chak", pronunciation_en: "BEH-chak" },
      { cell_id: "bee6641e-f340-4a37-afe6-48564bacb615", word: "macet", en: "traffic jam / congested", vi: "kẹt xe", pos: "noun/adj.", pronunciation_vi: "MA-chet", pronunciation_en: "MAH-chet" },
    ],
    dialogue: [
      { cell_id: "fd92baa0-c91a-4d35-9d41-a82f2ddea182", speaker: "A", text: "Mau ke Bandung naik apa?", vi: "Đi Bandung bằng gì?", en: "How are you getting to Bandung?" },
      { cell_id: "dea238b1-62ac-4154-b1aa-57be894d3070", speaker: "B", text: "Naik kereta. Tiketnya seratus ribu.", vi: "Đi tàu. Vé một trăm nghìn.", en: "By train. The ticket is a hundred thousand." },
      { cell_id: "bbc9399c-4b30-4c0d-a6c8-c751c4eeb5e8", speaker: "A", text: "Ke stasiun naik apa?", vi: "Đến nhà ga bằng gì?", en: "How do you get to the station?" },
      { cell_id: "12b2f86c-c4e3-4977-9347-16e6451a6fe8", speaker: "B", text: "Naik ojek online, lebih cepat daripada bus.", vi: "Đi xe ôm app, nhanh hơn xe buýt.", en: "App motorbike taxi — faster than the bus." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Chọn 'ber-' hay 'meN-' hay so sánh đúng:",
        instruction_en: "Choose the right 'ber-'/'meN-' form or comparative:",
        items: [
          { prompt: "Bus ini ___ di depan pasar. (henti → dừng)", answer: "berhenti", options: ["berhenti", "menghenti", "henti"] },
          { prompt: "Tolong ___ saya ke bandara. (antar → đưa, dạng chuẩn)", answer: "mengantar", options: ["mengantar", "berantar", "antar"] },
          { prompt: "Becak ___ lambat daripada motor. (chậm hơn)", answer: "lebih", options: ["lebih", "paling", "sangat"] },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi đi xe ôm đến nhà ga.", answer: "Saya naik ojek ke stasiun." },
          { prompt: "Xe buýt này dừng ở đâu?", answer: "Bus ini berhenti di mana?" },
          { prompt: "Làm ơn đưa tôi đến sân bay.", answer: "Tolong antar saya ke bandara." },
        ],
      },
    ],
  },

  // ── 4. Time, days & months ──────────────────────────────────────────────────
  {
    id: "indonesian_time_days_months",
    level: "A2",
    category: "time",
    title_vi: "Giờ giấc, thứ & tháng",
    title_en: "Telling the time, days and months",
    sentences: [
      {
        id: "Sekarang jam berapa?",
        vi: "Bây giờ mấy giờ?",
        en: "What time is it now?",
        pronunciation_focus: [
          "sekarang → 'se-KA-rang' = bây giờ",
          "jam berapa? → 'jam be-RA-pa?' = mấy giờ?",
          "'jam' = giờ (cả 'đồng hồ' lẫn 'giờ trên đồng hồ')",
        ],
        pronunciation_focus_en: [
          "sekarang → 'suh-KAH-rahng' = now",
          "'jam berapa?' = what time? ('jam' = hour/o'clock and also 'clock')",
          "answer with 'jam' + number: 'jam tiga' = three o'clock",
        ],
      },
      {
        id: "Hari ini hari Senin.",
        vi: "Hôm nay là thứ Hai.",
        en: "Today is Monday.",
        pronunciation_focus: [
          "hari ini → 'HA-ri I-ni' = hôm nay ('hari' = ngày)",
          "Senin → 'se-NIN' = thứ Hai (từ tiếng Ả Rập, không đánh số)",
          "các thứ: Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, Minggu",
        ],
        pronunciation_focus_en: [
          "'hari ini' = today ('hari' = day)",
          "Senin → 'suh-NIN' = Monday (Arabic-derived, not numbered)",
          "days: Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, Minggu",
        ],
      },
      {
        id: "Saya lahir bulan Maret.",
        vi: "Tôi sinh tháng Ba.",
        en: "I was born in March.",
        pronunciation_focus: [
          "lahir → 'LA-hir' = sinh ra",
          "bulan → 'BU-lan' = tháng (cũng nghĩa 'mặt trăng')",
          "Maret → 'MA-ret' = tháng Ba (tên tháng giống tiếng Anh)",
        ],
        pronunciation_focus_en: [
          "lahir → 'LAH-heer' = to be born",
          "bulan → 'BOO-lahn' = month (also 'moon')",
          "Maret → 'MAH-ret' = March (month names resemble English)",
        ],
      },
      {
        id: "Toko buka dari jam delapan sampai jam sembilan malam.",
        vi: "Cửa hàng mở từ tám giờ đến chín giờ tối.",
        en: "The shop is open from eight until nine in the evening.",
        pronunciation_focus: [
          "buka → 'BU-ka' = mở (ngược lại: tutup = đóng)",
          "delapan → 'de-LA-pan' = tám",
          "sampai → 'SAM-pai' = đến (mốc kết thúc)",
        ],
        pronunciation_focus_en: [
          "buka → 'BOO-kah' = open (opposite: tutup = closed)",
          "delapan → 'duh-LAH-pahn' = eight",
          "sampai → 'SAHM-pigh' = until / up to",
        ],
      },
      {
        id: "Sampai jumpa minggu depan!",
        vi: "Hẹn gặp tuần sau!",
        en: "See you next week!",
        pronunciation_focus: [
          "sampai jumpa → 'SAM-pai JUM-pa' = hẹn gặp lại",
          "minggu → 'MING-gu' = tuần (viết hoa 'Minggu' = Chủ nhật)",
          "depan → 'de-PAN' = sau / tới (minggu depan = tuần sau)",
        ],
        pronunciation_focus_en: [
          "'sampai jumpa' = see you / until we meet",
          "minggu → 'MING-goo' = week (capital 'Minggu' = Sunday)",
          "depan → 'duh-PAHN' = next/ahead (minggu depan = next week)",
        ],
      },
    ],
    cultural_notes_vi:
      "Indonesia có 3 múi giờ: WIB (miền Tây — Jakarta), WITA (miền Trung — Bali), WIT (miền Đông — Papua). Lịch trình chính thức hay dùng giờ 24h (jam 14.00). Trong đời sống có khái niệm vui 'jam karet' (giờ cao su) — hẹn xã giao trễ 15-30 phút là bình thường, nhưng công việc và giao thông công cộng thì đúng giờ. Tuần bắt đầu từ thứ Hai (Senin); thứ Sáu (Jumat) là ngày cầu nguyện chung của người Hồi giáo, nhiều nơi nghỉ trưa dài hơn.",
    cultural_notes_en:
      "Indonesia spans 3 time zones: WIB (west — Jakarta), WITA (central — Bali), WIT (east — Papua). Official schedules use the 24-hour clock (jam 14.00). Socially there's the wry idea of 'jam karet' ('rubber time') — being 15-30 minutes late to casual meetups is normal, though work and public transport run on time. The week starts on Monday (Senin); Friday (Jumat) is the Muslim congregational prayer day, with a longer midday break in many places.",
    tip_advice_vi:
      "Tiền tố/hậu tố thời gian dùng hậu tố '-an' để tạo nghĩa 'theo chu kỳ': hari → harian (hằng ngày), minggu → mingguan (hằng tuần), bulan → bulanan (hằng tháng), tahun → tahunan (hằng năm). Từ chỉ thời điểm: 'depan' = tới/sau (minggu depan, bulan depan), 'lalu' hoặc 'kemarin' = trước/qua (minggu lalu = tuần trước). 'Jam' vừa là 'giờ' vừa là 'đồng hồ' — ngữ cảnh quyết định.",
    tip_advice_en:
      "Time words use the '-an' suffix to mean 'on a … cycle': hari → harian (daily), minggu → mingguan (weekly), bulan → bulanan (monthly), tahun → tahunan (yearly). Position words: 'depan' = next/coming (minggu depan, bulan depan), 'lalu' or 'kemarin' = last/past (minggu lalu = last week). 'Jam' means both 'hour/o'clock' and 'clock' — context decides.",
    l1_notes_vi: [
      {
        mistake: "Dịch thẳng 'thứ Hai' thành số: nói 'hari dua' thay vì 'Senin'.",
        fix_vi: "Khác tiếng Việt, các thứ trong tuần tiếng Indonesia KHÔNG đánh số. Phải nhớ tên riêng: Senin (T2), Selasa (T3), Rabu (T4), Kamis (T5), Jumat (T6), Sabtu (T7), Minggu (CN). 'Minggu' viết hoa = Chủ nhật, viết thường = tuần.",
      },
      {
        mistake: "Dùng sai hậu tố '-an' hoặc bỏ qua nó (nói 'gaji bulan' thay vì 'gaji bulanan').",
        fix_vi: "'-an' biến từ chỉ thời gian thành 'theo chu kỳ': 'gaji bulanan' = lương tháng, 'tiket harian' = vé ngày, 'laporan mingguan' = báo cáo tuần. Đây là một trong những cách dùng dễ nhất của hậu tố '-an'.",
      },
      {
        mistake: "Lẫn 'depan' (tới) với 'lalu' (qua): nói 'minggu depan' khi định nói 'tuần trước'.",
        fix_vi: "'depan' = tương lai (sau): minggu depan = tuần SAU. 'lalu' = quá khứ (trước): minggu lalu = tuần TRƯỚC. Nhớ: 'depan' nghĩa đen là 'phía trước' nhưng dùng cho thời gian = sắp tới.",
      },
    ],
    vocabulary: [
      { cell_id: "e9472996-2feb-4101-ba0d-faa20277e55b", word: "jam", en: "hour / o'clock / clock", vi: "giờ / đồng hồ", pos: "noun", pronunciation_vi: "jam", pronunciation_en: "jahm" },
      { cell_id: "37b4c464-320c-4c7a-9711-3bcf4ba2355e", word: "hari", en: "day", vi: "ngày", pos: "noun", pronunciation_vi: "HA-ri", pronunciation_en: "HAH-ree" },
      { cell_id: "ec1e4e9e-5ba1-4ee8-a330-1eaa083af8f7", word: "minggu", en: "week / Sunday", vi: "tuần / Chủ nhật", pos: "noun", pronunciation_vi: "MING-gu", pronunciation_en: "MING-goo" },
      { cell_id: "e1a63ddf-6e72-4dc9-9ea1-8dd8103ad9ce", word: "bulan", en: "month / moon", vi: "tháng / mặt trăng", pos: "noun", pronunciation_vi: "BU-lan", pronunciation_en: "BOO-lahn" },
      { cell_id: "66f5448e-2f6a-43d5-8d0d-3ee50753cf58", word: "tahun", en: "year", vi: "năm", pos: "noun", pronunciation_vi: "TA-hun", pronunciation_en: "TAH-hoon" },
      { cell_id: "2fcd6fbf-2704-4cc0-8e72-177308fc197c", word: "sekarang", en: "now", vi: "bây giờ", pos: "adv.", pronunciation_vi: "se-KA-rang", pronunciation_en: "suh-KAH-rahng" },
      { cell_id: "eda5a55d-d636-4dc6-912e-b5c925510612", word: "depan", en: "next / front", vi: "tới / phía trước", pos: "adj./prep.", pronunciation_vi: "de-PAN", pronunciation_en: "duh-PAHN" },
      { cell_id: "b6e14b87-a521-4aa7-8494-14f785f3ec6d", word: "buka", en: "open", vi: "mở", pos: "verb/adj.", pronunciation_vi: "BU-ka", pronunciation_en: "BOO-kah" },
      { cell_id: "bc9682e4-3e8e-46bd-97d8-a834b64d5634", word: "tutup", en: "closed / to close", vi: "đóng", pos: "verb/adj.", pronunciation_vi: "TU-tup", pronunciation_en: "TOO-toop" },
    ],
    dialogue: [
      { cell_id: "f500f49f-bb6a-45de-9be8-df431aa88928", speaker: "A", text: "Sekarang jam berapa?", vi: "Bây giờ mấy giờ?", en: "What time is it now?" },
      { cell_id: "2efb9614-9df2-4275-b58a-276e525d6d78", speaker: "B", text: "Jam setengah tiga. Toko buka sampai jam sembilan.", vi: "Hai giờ rưỡi. Cửa hàng mở đến chín giờ.", en: "Half past two. The shop is open until nine." },
      { cell_id: "f7170ea5-a02f-44b3-91ee-0dbb4275320a", speaker: "A", text: "Hari ini hari apa?", vi: "Hôm nay là thứ mấy?", en: "What day is it today?" },
      { cell_id: "5b14f9b5-c939-41be-809f-ff074eb68304", speaker: "B", text: "Hari Kamis. Sampai jumpa minggu depan, ya!", vi: "Thứ Năm. Hẹn gặp tuần sau nhé!", en: "Thursday. See you next week!" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền hậu tố '-an' hoặc từ thời gian đúng:",
        instruction_en: "Fill in the '-an' suffix form or the right time word:",
        items: [
          { prompt: "Saya bayar sewa kos secara ___. (bulan → hằng tháng)", answer: "bulanan", options: ["bulanan", "bulan", "berbulan"] },
          { prompt: "Hari setelah hari Senin adalah hari ___.", answer: "Selasa", options: ["Selasa", "Minggu", "Rabu"] },
          { prompt: "Sampai jumpa minggu ___! (tới)", answer: "depan", options: ["depan", "lalu", "kemarin"] },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Bây giờ mấy giờ?", answer: "Sekarang jam berapa?" },
          { prompt: "Hôm nay là thứ Hai.", answer: "Hari ini hari Senin." },
          { prompt: "Tôi sinh tháng Ba.", answer: "Saya lahir bulan Maret." },
        ],
      },
    ],
  },

  // ── 5. Weather & seasons ────────────────────────────────────────────────────
  {
    id: "indonesian_weather",
    level: "A2",
    category: "weather",
    title_vi: "Thời tiết & mùa",
    title_en: "Weather and seasons",
    sentences: [
      {
        id: "Hari ini panas sekali, tolong nyalakan AC.",
        vi: "Hôm nay nóng quá, làm ơn bật điều hòa.",
        en: "It's very hot today, please turn on the AC.",
        pronunciation_focus: [
          "panas → 'PA-nas' = nóng; sekali → 'se-KA-li' = rất (đặt sau tính từ)",
          "nyalakan → 'nya-LA-kan', 'ny' = 'nh'; nyala + '-kan' = bật/làm cháy",
          "AC → đọc kiểu Anh 'a-sê' = máy điều hòa",
        ],
        pronunciation_focus_en: [
          "panas → 'PAH-nas' = hot; 'sekali' (after the adj) = very",
          "nyalakan → 'nyah-LAH-kahn' — 'ny' = 'ny'; nyala + '-kan' = to turn on",
          "AC → spoken 'ah-SEH' = air conditioner",
        ],
      },
      {
        id: "Sepertinya akan hujan sebentar lagi.",
        vi: "Hình như sắp mưa rồi.",
        en: "It looks like it'll rain soon.",
        pronunciation_focus: [
          "sepertinya → 'se-per-TI-nya' = hình như / có vẻ",
          "akan → 'A-kan' = sẽ (dấu hiệu thì tương lai)",
          "hujan → 'HU-jan' = mưa",
        ],
        pronunciation_focus_en: [
          "sepertinya → 'suh-per-TEE-nyah' = it seems / looks like",
          "akan → 'AH-kahn' = will (future marker)",
          "hujan → 'HOO-jahn' = rain",
        ],
      },
      {
        id: "Di Bandung udaranya lebih dingin daripada di Jakarta.",
        vi: "Ở Bandung không khí lạnh hơn ở Jakarta.",
        en: "In Bandung the air is colder than in Jakarta.",
        pronunciation_focus: [
          "udara → 'u-DA-ra' = không khí; udaranya = không khí (của nơi đó)",
          "dingin → 'DI-ngin' = lạnh",
          "lebih … daripada … → 'le-BIH … DA-ri-PA-da …' = … hơn so với …",
        ],
        pronunciation_focus_en: [
          "udara → 'oo-DAH-rah' = air; '-nya' = its (the air there)",
          "dingin → 'DEE-ngin' = cold",
          "'lebih … daripada …' = more … than …",
        ],
      },
      {
        id: "Jangan lupa bawa payung kalau keluar.",
        vi: "Đừng quên mang ô khi ra ngoài.",
        en: "Don't forget to bring an umbrella if you go out.",
        pronunciation_focus: [
          "jangan → 'JA-ngan' = đừng (cấm đoán)",
          "lupa → 'LU-pa' = quên; bawa → 'BA-wa' = mang/đem",
          "payung → 'PA-yung' = cái ô / dù",
        ],
        pronunciation_focus_en: [
          "jangan → 'JAH-ngahn' = don't (prohibition)",
          "lupa → 'LOO-pah' = to forget; bawa → 'BAH-wah' = to bring",
          "payung → 'PAH-yoong' = umbrella",
        ],
      },
      {
        id: "Saya kehujanan tadi pagi.",
        vi: "Sáng nay tôi bị mắc mưa.",
        en: "I got caught in the rain this morning.",
        pronunciation_focus: [
          "kehujanan → 'ke-hu-JA-nan', vòng 'ke-…-an' quanh 'hujan' = bị mắc mưa",
          "tadi → 'TA-di' = lúc nãy (quá khứ gần)",
          "pagi → 'PA-gi' = buổi sáng",
        ],
        pronunciation_focus_en: [
          "kehujanan → 'kuh-hoo-JAH-nan' — 'ke-…-an' around 'hujan' = to get rained on",
          "tadi → 'TAH-dee' = earlier (recent past)",
          "'tadi pagi' = this morning (earlier today)",
        ],
      },
    ],
    cultural_notes_vi:
      "Indonesia nằm ở xích đạo, khí hậu nhiệt đới, chỉ có HAI mùa: 'musim hujan' (mùa mưa, khoảng tháng 10–3) và 'musim kemarau' (mùa khô, khoảng tháng 4–9) — không có đông, không có tuyết. Mùa mưa thường mưa rào dữ dội buổi chiều; ở Jakarta hay xảy ra 'banjir' (ngập lụt). Vùng cao như Bandung, Bogor mát hơn nhiều. Trong nhà, văn phòng, xe buýt thường bật AC rất lạnh, nên mang theo áo khoác mỏng là khôn ngoan.",
    cultural_notes_en:
      "Indonesia sits on the equator with a tropical climate and just TWO seasons: 'musim hujan' (wet, roughly Oct–Mar) and 'musim kemarau' (dry, roughly Apr–Sep) — no winter, no snow. The wet season brings heavy afternoon downpours; Jakarta often sees 'banjir' (flooding). Highland areas like Bandung and Bogor are much cooler. Indoors — offices, malls, buses — the AC is often freezing, so a light jacket is wise.",
    tip_advice_vi:
      "Hai cấu trúc affix quan trọng cho bài này: (1) Hậu tố '-kan' tạo nghĩa SAI KHIẾN/TÁC ĐỘNG: nyala (cháy/sáng) → nyalakan (bật), mati (tắt) → matikan (tắt đi), dingin (lạnh) → dinginkan (làm lạnh). (2) Vòng 'ke-…-an' bao quanh một từ chỉ trạng thái = 'BỊ … (ngoài ý muốn)': hujan → kehujanan (bị mắc mưa), panas → kepanasan (bị nóng quá), dingin → kedinginan (bị lạnh cóng), banjir → kebanjiran (bị ngập). 'sekali' đặt SAU tính từ = 'rất' (panas sekali = rất nóng).",
    tip_advice_en:
      "Two key affix patterns here: (1) The '-kan' suffix makes a CAUSATIVE: nyala (alight) → nyalakan (turn on), mati (off/dead) → matikan (turn off), dingin (cold) → dinginkan (cool down). (2) The 'ke-…-an' circumfix around a state word = 'to SUFFER / get caught in (unintentionally)': hujan → kehujanan (got rained on), panas → kepanasan (overheated), dingin → kedinginan (freezing), banjir → kebanjiran (flooded out). 'sekali' goes AFTER an adjective = 'very' (panas sekali = very hot).",
    l1_notes_vi: [
      {
        mistake: "Đặt 'rất' trước tính từ kiểu tiếng Việt: nói 'sekali panas'.",
        fix_vi: "'sekali' đứng SAU tính từ: 'panas sekali' (nóng lắm), 'dingin sekali' (lạnh lắm). Nếu muốn đặt trước thì dùng từ khác: 'sangat panas' (rất nóng) — 'sangat' đứng trước.",
      },
      {
        mistake: "Quên hậu tố '-kan' khi muốn ra lệnh tác động: nói 'tolong nyala AC'.",
        fix_vi: "Để 'bật cái gì' cần '-kan' sai khiến: 'nyalakan AC' (bật điều hòa), 'matikan lampu' (tắt đèn). Gốc trần 'nyala/mati' chỉ mô tả trạng thái, không phải hành động tác động.",
      },
      {
        mistake: "Dùng dạng chủ động cho việc bị mưa: nói 'saya hujan' (tôi mưa).",
        fix_vi: "Bị mắc mưa = vòng 'ke-…-an': 'saya kehujanan'. Cấu trúc này diễn tả điều xảy ra NGOÀI Ý MUỐN với mình. Cũng vậy: kepanasan (bị nóng), kedinginan (bị lạnh), kebanjiran (bị ngập). Tiếng Việt không có affix nên dễ quên.",
      },
    ],
    vocabulary: [
      { cell_id: "f0a743a2-8930-46ab-87e0-54adf34eed95", word: "panas", en: "hot", vi: "nóng", pos: "adj.", pronunciation_vi: "PA-nas", pronunciation_en: "PAH-nas" },
      { cell_id: "9e4124c8-5d70-491e-bed0-f674643b6ca7", word: "dingin", en: "cold", vi: "lạnh", pos: "adj.", pronunciation_vi: "DI-ngin", pronunciation_en: "DEE-ngin" },
      { cell_id: "8fd9474a-3e50-4b58-96f5-03f5cb3c6f30", word: "hujan", en: "rain", vi: "mưa", pos: "noun/verb", pronunciation_vi: "HU-jan", pronunciation_en: "HOO-jahn" },
      { cell_id: "ab13d7e7-99d8-4a6b-8fcb-3428ed69db40", word: "musim", en: "season", vi: "mùa", pos: "noun", pronunciation_vi: "MU-sim", pronunciation_en: "MOO-sim" },
      { cell_id: "acf3c9a5-1820-4f77-9a2f-5148364e5dcb", word: "musim hujan", en: "rainy season", vi: "mùa mưa", pos: "noun", pronunciation_vi: "MU-sim HU-jan", pronunciation_en: "MOO-sim HOO-jahn" },
      { cell_id: "dc3b2407-6cfc-4ea0-a2e3-3695cbcfa4e0", word: "musim kemarau", en: "dry season", vi: "mùa khô", pos: "noun", pronunciation_vi: "MU-sim ke-MA-rau", pronunciation_en: "MOO-sim kuh-MAH-row" },
      { cell_id: "8622b7b3-2158-49fa-aadb-e7d59e53a0bb", word: "payung", en: "umbrella", vi: "cái ô / dù", pos: "noun", pronunciation_vi: "PA-yung", pronunciation_en: "PAH-yoong" },
      { cell_id: "2be00cd2-6dbe-404e-b0c7-c95be2187902", word: "nyalakan", en: "to turn on", vi: "bật (lên)", pos: "verb (-kan)", pronunciation_vi: "nya-LA-kan", pronunciation_en: "nyah-LAH-kahn" },
      { cell_id: "e167e43e-faf6-41aa-9e63-6b8f387216d0", word: "kehujanan", en: "to get caught in the rain", vi: "bị mắc mưa", pos: "verb (ke-…-an)", pronunciation_vi: "ke-hu-JA-nan", pronunciation_en: "kuh-hoo-JAH-nan" },
    ],
    dialogue: [
      { cell_id: "7f3e5cf1-85a7-44f1-84c2-73aaee6fdbac", speaker: "A", text: "Panas sekali hari ini, ya.", vi: "Hôm nay nóng quá nhỉ.", en: "It's so hot today." },
      { cell_id: "bc12d475-f013-4cc1-b216-d16df34f8c74", speaker: "B", text: "Iya. Tolong nyalakan AC-nya.", vi: "Ừ. Làm ơn bật điều hòa đi.", en: "Yeah. Please turn on the AC." },
      { cell_id: "f7c81e40-7805-4a0a-85c1-8f3f5e4fa0e5", speaker: "A", text: "Tapi sepertinya nanti sore akan hujan.", vi: "Nhưng hình như chiều nay sắp mưa.", en: "But it looks like it'll rain this afternoon." },
      { cell_id: "22e766ec-9333-4dca-8525-633da7b53a56", speaker: "B", text: "Jangan lupa bawa payung. Tadi pagi saya kehujanan.", vi: "Đừng quên mang ô. Sáng nay tôi bị mắc mưa.", en: "Don't forget an umbrella. I got rained on this morning." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền '-kan', 'ke-…-an', hoặc trật tự 'rất' đúng:",
        instruction_en: "Fill in '-kan', 'ke-…-an', or the right 'very' word order:",
        items: [
          { prompt: "Tolong ___ lampu, gelap. (mati → tắt)", answer: "matikan", options: ["matikan", "mati", "kematian"] },
          { prompt: "Saya ___ karena lupa bawa payung. (hujan → bị mắc mưa)", answer: "kehujanan", options: ["kehujanan", "hujan", "menghujan"] },
          { prompt: "Hari ini panas ___. (rất, đặt sau tính từ)", answer: "sekali", options: ["sekali", "sangat", "terlalu"] },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Hôm nay nóng quá.", answer: "Hari ini panas sekali." },
          { prompt: "Hình như sắp mưa.", answer: "Sepertinya akan hujan." },
          { prompt: "Đừng quên mang ô.", answer: "Jangan lupa bawa payung." },
        ],
      },
    ],
  },

  // ── 6. Housing (looking for / renting) ──────────────────────────────────────
  {
    id: "indonesian_housing",
    level: "A2",
    category: "housing",
    title_vi: "Nhà ở (tìm & thuê)",
    title_en: "Housing (looking for and renting)",
    sentences: [
      {
        id: "Saya sedang mencari kamar untuk disewa.",
        vi: "Tôi đang tìm phòng để thuê.",
        en: "I'm looking for a room to rent.",
        pronunciation_focus: [
          "sedang → 'se-DANG' = đang (dấu hiệu thì tiếp diễn)",
          "mencari → 'men-CHA-ri', 'meN-' + cari (gốc 'c') → 'men-' = tìm",
          "disewa → 'di-SÊ-wa', tiền tố bị động 'di-' + sewa = được thuê",
        ],
        pronunciation_focus_en: [
          "sedang → 'suh-DAHNG' = currently (progressive marker)",
          "mencari → 'men-CHAH-ree' — 'meN-' + 'cari' (c-root) → 'men-' = to look for",
          "disewa → 'dee-SEH-wah' — passive 'di-' + 'sewa' = to be rented",
        ],
      },
      {
        id: "Berapa harga sewa per bulan?",
        vi: "Giá thuê mỗi tháng bao nhiêu?",
        en: "How much is the rent per month?",
        pronunciation_focus: [
          "sewa → 'SÊ-wa' = thuê / tiền thuê",
          "per bulan → 'per BU-lan' = mỗi tháng",
          "câu vàng khi thuê: 'Berapa harga sewa per bulan?'",
        ],
        pronunciation_focus_en: [
          "sewa → 'SEH-wah' = rent (the payment / to rent)",
          "'per bulan' = per month",
          "golden renting line: 'Berapa harga sewa per bulan?'",
        ],
      },
      {
        id: "Rumah ini punya tiga kamar tidur.",
        vi: "Nhà này có ba phòng ngủ.",
        en: "This house has three bedrooms.",
        pronunciation_focus: [
          "rumah → 'RU-mah' = nhà, 'h' cuối đọc nhẹ",
          "punya → 'PU-nya', 'ny' = 'nh' = có / sở hữu",
          "kamar tidur → 'KA-mar TI-dur' = phòng ngủ (kamar = phòng, tidur = ngủ)",
        ],
        pronunciation_focus_en: [
          "rumah → 'ROO-mah' = house; final 'h' is light",
          "punya → 'POO-nyah' = to have/own ('ny' = 'ny')",
          "'kamar tidur' = bedroom (kamar = room, tidur = to sleep)",
        ],
      },
      {
        id: "Apakah sudah termasuk listrik dan air?",
        vi: "Đã bao gồm điện và nước chưa?",
        en: "Does it already include electricity and water?",
        pronunciation_focus: [
          "apakah → 'A-pa-kah' = (từ mở đầu câu hỏi có/không)",
          "termasuk → 'ter-MA-suk', 'ter-' + masuk = bao gồm / được tính vào",
          "listrik … air → 'LIS-trik … A-ir' = điện … nước",
        ],
        pronunciation_focus_en: [
          "apakah → 'AH-pah-kah' = (opens a yes/no question)",
          "termasuk → 'ter-MAH-sook' — 'ter-' + 'masuk' = included",
          "listrik → 'LEES-trik' = electricity; air → 'AH-eer' = water",
        ],
      },
      {
        id: "Boleh saya lihat kamar mandinya?",
        vi: "Tôi xem nhà tắm được không?",
        en: "May I see the bathroom?",
        pronunciation_focus: [
          "boleh → 'BÔ-leh' = được (xin phép)",
          "lihat → 'LI-hat' = nhìn / xem",
          "kamar mandi → 'KA-mar MAN-di' = phòng tắm/WC; '-nya' = (của nó)",
        ],
        pronunciation_focus_en: [
          "boleh → 'BOH-leh' = may / be allowed",
          "lihat → 'LEE-hat' = to see/look",
          "'kamar mandi' = bathroom; '-nya' = the/its",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia có nhiều kiểu thuê: 'kos' (hoặc 'kost'/'indekos') là phòng trọ thuê theo tháng, rất phổ biến với sinh viên và người đi làm — thường có 'ibu/bapak kos' (chủ trọ) ở cùng và có nội quy (giờ giấc, khách qua đêm). 'Kontrakan' là nhà nguyên căn thuê theo NĂM, trả trước cả năm. Điện thường dùng token trả trước (token listrik PLN — nạp như thẻ điện thoại). Khi xem phòng nhớ hỏi đã bao gồm 'listrik, air, WiFi' chưa, và phòng tắm là kiểu 'kamar mandi kering' (vòi sen) hay truyền thống (bak air + gayung — bể nước + gáo dội).",
    cultural_notes_en:
      "Indonesia has several rental types: 'kos' (a.k.a. 'kost'/'indekos') is a monthly rented room, very common for students and workers — often with an on-site landlord ('ibu/bapak kos') and house rules (curfew, overnight guests). A 'kontrakan' is a whole house rented by the YEAR, paid up front. Electricity is often prepaid via a PLN token (topped up like phone credit). When viewing, ask whether 'listrik, air, WiFi' are included, and whether the bathroom is a 'dry' shower room or the traditional water-tub-and-dipper ('bak air + gayung') style.",
    tip_advice_vi:
      "Bài này gom nhiều affix: 'meN-' tạo động từ chủ động (cari → mencari = tìm, sewa → menyewa = thuê — gốc 's' → 'meny-'); 'di-' tạo BỊ ĐỘNG (sewa → disewa = được thuê, bayar → dibayar = được trả); 'peN-' tạo người làm (sewa → penyewa = người thuê, milik → pemilik = chủ); 'ter-' = trạng thái/'đã được' (masuk → termasuk = bao gồm, sedia → tersedia = có sẵn). 'sedang' = đang (thì tiếp diễn). Đừng quên các tiền tố này khi viết câu trang trọng.",
    tip_advice_en:
      "This lesson bundles several affixes: 'meN-' makes active verbs (cari → mencari = look for, sewa → menyewa = rent; an 's' root becomes 'meny-'); 'di-' makes the PASSIVE (sewa → disewa = is rented, bayar → dibayar = is paid); 'peN-' makes the doer noun (sewa → penyewa = renter, milik → pemilik = owner); 'ter-' = state/'already' (masuk → termasuk = included, sedia → tersedia = available). 'sedang' = the progressive 'currently'. Keep these prefixes in formal sentences.",
    l1_notes_vi: [
      {
        mistake: "Dùng dạng chủ động khi nghĩa là bị động: 'kamar untuk sewa' thay vì 'untuk disewa'.",
        fix_vi: "Phòng 'được thuê' là bị động → tiền tố 'di-': 'kamar untuk disewa'. 'di-' (viết liền) là tiền tố bị động, KHÁC 'di' (viết rời) là giới từ chỉ nơi chốn. So sánh: 'disewa' (được thuê) vs 'di rumah' (ở nhà).",
      },
      {
        mistake: "Lẫn 'menyewa' (người thuê làm) với 'menyewakan' (cho thuê).",
        fix_vi: "'menyewa' = thuê (tôi thuê phòng). Thêm '-kan' → 'menyewakan' = cho thuê (chủ cho thuê phòng). Hậu tố '-kan' đảo vai: người thuê ↔ người cho thuê. Người thuê = 'penyewa', chủ nhà = 'pemilik'.",
      },
      {
        mistake: "Bỏ tiền tố 'ter-' của 'termasuk': hỏi 'sudah masuk listrik?'.",
        fix_vi: "'termasuk' (ter- + masuk) = bao gồm/được tính vào — đây là từ cố định khi hỏi giá thuê: 'Apakah sudah termasuk listrik?'. 'masuk' trần chỉ nghĩa 'đi vào', không phải 'bao gồm'.",
      },
    ],
    vocabulary: [
      { cell_id: "5c7e317c-8759-4423-a40f-6f717ef3d191", word: "rumah", en: "house", vi: "nhà", pos: "noun", pronunciation_vi: "RU-mah", pronunciation_en: "ROO-mah" },
      { cell_id: "e91b4f69-cc87-40d7-ac12-e6177d152b35", word: "kamar", en: "room", vi: "phòng", pos: "noun", pronunciation_vi: "KA-mar", pronunciation_en: "KAH-mar" },
      { cell_id: "fa0a40ad-3f8f-4b6f-b6f8-a38912f5193d", word: "kamar tidur", en: "bedroom", vi: "phòng ngủ", pos: "noun", pronunciation_vi: "KA-mar TI-dur", pronunciation_en: "KAH-mar TEE-door" },
      { cell_id: "08dfe154-ba51-4611-8706-27c9d7bdac64", word: "kamar mandi", en: "bathroom", vi: "phòng tắm / nhà vệ sinh", pos: "noun", pronunciation_vi: "KA-mar MAN-di", pronunciation_en: "KAH-mar MAHN-dee" },
      { cell_id: "d0c0a28e-0c70-46ce-9bf7-74e7d1fa9cfa", word: "sewa", en: "rent / to rent", vi: "thuê / tiền thuê", pos: "noun/verb", pronunciation_vi: "SÊ-wa", pronunciation_en: "SEH-wah" },
      { cell_id: "6ed83405-7890-4f73-a4f0-4d58a2231af3", word: "menyewa", en: "to rent (from)", vi: "thuê", pos: "verb (meN-)", pronunciation_vi: "me-NYÊ-wa", pronunciation_en: "muh-NYEH-wah" },
      { cell_id: "dcc055e3-1747-4c43-9444-20c85ad5b2a1", word: "penyewa", en: "renter / tenant", vi: "người thuê", pos: "noun (peN-)", pronunciation_vi: "pe-NYÊ-wa", pronunciation_en: "puh-NYEH-wah" },
      { cell_id: "2f69fee5-cd65-4a00-85ce-f137884d8fe9", word: "listrik", en: "electricity", vi: "điện", pos: "noun", pronunciation_vi: "LIS-trik", pronunciation_en: "LEES-trik" },
      { cell_id: "c9895f6d-6728-4d3f-9810-d510a5e31270", word: "air", en: "water", vi: "nước", pos: "noun", pronunciation_vi: "A-ir", pronunciation_en: "AH-eer" },
      { cell_id: "394b67b4-88c6-443b-9a9a-38b325d7541e", word: "termasuk", en: "included", vi: "bao gồm", pos: "verb (ter-)", pronunciation_vi: "ter-MA-suk", pronunciation_en: "ter-MAH-sook" },
    ],
    dialogue: [
      { cell_id: "5c3e2684-c45a-4763-a762-0657e7007de1", speaker: "Penyewa", text: "Permisi, saya mencari kamar kos untuk disewa.", vi: "Xin lỗi, tôi đang tìm phòng trọ để thuê.", en: "Excuse me, I'm looking for a boarding room to rent." },
      { cell_id: "0d454599-38af-4cac-a5ed-8ddd7dd37453", speaker: "Pemilik", text: "Ada. Harganya satu juta per bulan.", vi: "Có. Giá một triệu mỗi tháng.", en: "I have one. It's a million per month." },
      { cell_id: "f262f8d7-74ed-46f4-b32d-22d8acd6c08e", speaker: "Penyewa", text: "Apakah sudah termasuk listrik dan air?", vi: "Đã bao gồm điện nước chưa?", en: "Does that include electricity and water?" },
      { cell_id: "15450034-173c-40e9-bbfe-a64b9f71927f", speaker: "Pemilik", text: "Air sudah termasuk, listrik pakai token. Mau lihat kamarnya?", vi: "Nước đã gồm, điện dùng token. Muốn xem phòng không?", en: "Water's included, electricity is on a token. Want to see the room?" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền tiền tố 'meN-'/'di-'/'peN-'/'ter-' đúng:",
        instruction_en: "Fill in the right 'meN-'/'di-'/'peN-'/'ter-' affix:",
        items: [
          { prompt: "Saya sedang ___ kamar. (cari → tìm, dạng chuẩn)", answer: "mencari", options: ["mencari", "dicari", "pencari"] },
          { prompt: "Kamar ini untuk ___. (sewa → được thuê, bị động)", answer: "disewa", options: ["disewa", "menyewa", "penyewa"] },
          { prompt: "Apakah sudah ___ listrik? (masuk → bao gồm)", answer: "termasuk", options: ["termasuk", "memasuk", "dimasuk"] },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi đang tìm phòng để thuê.", answer: "Saya sedang mencari kamar untuk disewa." },
          { prompt: "Giá thuê mỗi tháng bao nhiêu?", answer: "Berapa harga sewa per bulan?" },
          { prompt: "Đã bao gồm điện và nước chưa?", answer: "Apakah sudah termasuk listrik dan air?" },
        ],
      },
    ],
  },
];

export default lessons;
