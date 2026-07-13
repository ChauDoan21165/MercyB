// src/languages/indonesian/extra/workplace-culture.ts
//
// Indonesian workplace-culture pack for Vietnamese learners.
// Covers: honorifics & hierarchy (Pak/Bu/Mas/Mbak, atasan/bawahan), the social
// glue of small talk and "rubber time" (basa-basi, jam karet, rapat etiquette),
// and office politics + how to resign gracefully (pamit, surat pengunduran diri).
// Hand-crafted, no filler.
//
// Shape mirrors the named template src/languages/portuguese/lessons-a1.ts and the
// sibling extra packs so the page UI stays consistent across language verticals.
// The types are defined inline because the Indonesian pack has no sibling
// lessons.ts registry yet (A7 owns it) — this file is self-contained on purpose.
// Types are NOT exported and the lesson array uses a unique name so a future
// barrel `export *` cannot collide with the sibling extra packs.
//
// Field convention (inherited from the Portuguese pack): a sentence's `en` slot
// holds the TARGET-LANGUAGE text (here: Indonesian), `vi` holds the Vietnamese
// gloss. `pronunciation_focus` carries Vietnamese-facing pronunciation/grammar
// notes (incl. the common Vietnamese-speaker mistake = L1 note);
// `pronunciation_focus_en` is the English-speaker companion, same length + order.
//
// Indonesian uses the Latin alphabet — no special script rendering needed.

type LessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

type DialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields (fill_blank, matching, translation) vary.
type Exercise = Record<string, unknown>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: VocabEntry[];
  dialogue?: DialogueLine[];
  exercises?: Exercise[];
};

export const workplaceCultureLessons: IndonesianLesson[] = [
  {
    id: "indonesian_work_honorifics_hierarchy",
    level: "A1",
    category: "workplace",
    title_vi: "Pak, Bu, Mas, Mbak — xưng hô và thứ bậc nơi làm việc",
    title_en: "Pak, Bu, Mas, Mbak — address and hierarchy at work",
    sentences: [
      {
        en: "Selamat pagi, Pak. Apa kabar?",
        vi: "Chào buổi sáng, anh/chú. Anh khỏe không?",
        pronunciation_focus: [
          "Pak → 'anh/chú/ngài' — gọi đàn ông lớn tuổi hơn hoặc cấp trên (rút từ Bapak)",
          "selamat pagi → 'chào buổi sáng' (selamat = chúc, pagi = sáng)",
          "apa kabar → 'có khỏe không' (thành ngữ chào hỏi)",
        ],
        pronunciation_focus_en: [
          "Pak → 'sir / Mr' — address for an older man or a superior (short for Bapak)",
          "selamat pagi → 'good morning'",
          "apa kabar → 'how are you' (fixed greeting)",
        ],
      },
      {
        en: "Bu, boleh saya bertanya sebentar?",
        vi: "Chị/cô ơi, em hỏi một chút được không ạ?",
        pronunciation_focus: [
          "Bu → 'chị/cô/bà' — gọi phụ nữ lớn tuổi hơn hoặc cấp trên (rút từ Ibu)",
          "boleh → BO-leh, 'được phép' (xin phép lịch sự)",
          "sebentar → se-ben-TAR, 'một chút/lát'",
        ],
        pronunciation_focus_en: [
          "Bu → 'ma'am / Mrs' — address for an older woman or a superior (short for Ibu)",
          "boleh → 'BOH-leh' — may / be allowed (polite permission)",
          "sebentar → 'se-ben-TAR' — a moment / a little while",
        ],
      },
      {
        en: "Mas, tolong kirim laporannya ke saya, ya.",
        vi: "Anh ơi, gửi báo cáo cho em với nhé.",
        pronunciation_focus: [
          "Mas → 'anh' — gọi đàn ông trẻ/ngang hàng (gốc Java, dùng khắp nơi)",
          "laporan → la-PO-ran, 'báo cáo' (gốc lapor)",
          "ke saya → 'cho tôi/đến tôi'",
        ],
        pronunciation_focus_en: [
          "Mas → 'bro / young man' — for a young or peer-level man (Javanese, used widely)",
          "laporan → 'la-POH-ran' — report (root 'lapor')",
          "ke saya → 'to me'",
        ],
      },
      {
        en: "Mbak, ini berkasnya sudah saya periksa.",
        vi: "Chị ơi, hồ sơ này em đã kiểm tra rồi.",
        pronunciation_focus: [
          "Mbak → 'chị' — gọi phụ nữ trẻ/ngang hàng ('mb' bật môi nhẹ)",
          "berkas → BER-kas, 'hồ sơ/tập tài liệu'",
          "sudah saya periksa → 'tôi đã kiểm tra rồi' (sudah = đã/rồi)",
        ],
        pronunciation_focus_en: [
          "Mbak → 'miss / sis' — for a young or peer-level woman ('mb' lightly bilabial)",
          "berkas → 'BER-kas' — file / set of documents",
          "sudah saya periksa → 'I have already checked' (sudah = already)",
        ],
      },
      {
        en: "Saya akan laporkan ini kepada atasan saya.",
        vi: "Tôi sẽ báo cáo việc này lên cấp trên của tôi.",
        pronunciation_focus: [
          "akan → A-kan, 'sẽ' (dấu hiệu tương lai)",
          "atasan → a-TA-san, 'cấp trên/sếp' (gốc atas = trên)",
          "kepada → ke-PA-da, 'tới/cho' (trang trọng hơn 'ke')",
        ],
        pronunciation_focus_en: [
          "akan → 'A-kan' — will (future marker)",
          "atasan → 'a-TA-san' — superior / boss (root 'atas' = above)",
          "kepada → 'ke-PA-da' — to (more formal than 'ke')",
        ],
      },
    ],
    cultural_notes_vi:
      "Xưng hô đúng là nền tảng văn hóa công sở Indonesia. Bốn từ vàng: PAK (Bapak — đàn ông lớn tuổi hơn/cấp trên), BU (Ibu — phụ nữ lớn tuổi hơn/cấp trên), MAS (đàn ông trẻ/ngang hàng, gốc Java), MBAK (phụ nữ trẻ/ngang hàng). Gọi sếp bằng 'Pak/Bu + tên' (vd 'Pak Budi', 'Bu Sari') gần như BẮT BUỘC — gọi trống tên là bất lịch sự. Khác với phương Tây, ít ai gọi cấp trên bằng tên trống. Thứ bậc (hierarki) được coi trọng: 'atasan' (cấp trên) và 'bawahan' (cấp dưới) có ranh giới rõ. Tôn trọng người lớn tuổi và chức vụ là giá trị cốt lõi.",
    cultural_notes_en:
      "Correct address is the foundation of Indonesian office culture. The four golden words: PAK (Bapak — an older man/superior), BU (Ibu — an older woman/superior), MAS (a young or peer-level man, from Javanese), MBAK (a young or peer-level woman). Calling a boss 'Pak/Bu + name' (e.g. 'Pak Budi', 'Bu Sari') is all but mandatory — using a bare first name is rude. Unlike the West, almost no one addresses a superior by first name alone. Hierarchy (hierarki) matters: 'atasan' (superior) and 'bawahan' (subordinate) have clear boundaries. Respect for elders and rank is a core value.",
    tip_advice_vi:
      "Mẹo cho người Việt: hệ Pak/Bu/Mas/Mbak gần với 'anh/chị/cô/chú' của tiếng Việt nên DỄ cho người Việt hiểu — nhưng nhớ Pak/Bu thiên về tuổi+chức vụ, Mas/Mbak thiên về ngang hàng/trẻ. Khi chưa chắc, dùng Pak/Bu cho an toàn (lịch sự hơn là suồng sã). Luôn kèm TÊN sau: 'Pak Budi' chứ không chỉ 'Pak' khi đã biết tên. 'Sudah' (đã/rồi) đặt trước động từ để chỉ việc hoàn thành, không cần chia thì. 'Boleh saya…?' = 'Tôi … được không?' — mẫu xin phép cực kỳ thông dụng.",
    tip_advice_en:
      "Tip for Vietnamese speakers: the Pak/Bu/Mas/Mbak system maps neatly onto Vietnamese 'anh/chị/cô/chú', so it's intuitive — but Pak/Bu lean on age+rank, Mas/Mbak on peer/youth. When unsure, default to Pak/Bu (politely formal beats too casual). Always add the NAME once you know it: 'Pak Budi', not just 'Pak'. 'Sudah' (already) goes before the verb to mark completion — no tense conjugation needed. 'Boleh saya…?' = 'May I…?' — an extremely common permission frame.",
    vocabulary: [
      { cell_id: "428160dc-0364-455f-8394-7eeb926740ff", word: "Pak (Bapak)", en: "sir / Mr (older man, superior)", vi: "anh / chú / ngài", pos: "honorific", pronunciation_vi: "pak (BA-pak)", pronunciation_en: "pak (BA-pak)" },
      { cell_id: "379bb335-202d-4920-99f6-bf32a8373cbb", word: "Bu (Ibu)", en: "ma'am / Mrs (older woman, superior)", vi: "chị / cô / bà", pos: "honorific", pronunciation_vi: "bu (I-bu)", pronunciation_en: "boo (EE-boo)" },
      { cell_id: "a9520e06-d891-4d32-876a-6eeefbc3a332", word: "Mas", en: "bro (young/peer man)", vi: "anh (trẻ/ngang hàng)", pos: "honorific", pronunciation_vi: "mas", pronunciation_en: "mas" },
      { cell_id: "3050b57d-c76b-427c-a148-1cfb96e30d80", word: "Mbak", en: "miss (young/peer woman)", vi: "chị (trẻ/ngang hàng)", pos: "honorific", pronunciation_vi: "mbak", pronunciation_en: "mbak" },
      { cell_id: "3e2bb8e0-6118-45e5-a982-e20efa9411ea", word: "atasan", en: "superior / boss", vi: "cấp trên / sếp", pos: "noun", pronunciation_vi: "a-TA-san", pronunciation_en: "a-TA-san" },
      { cell_id: "3f941d41-ae74-4801-a201-77f472f145ec", word: "bawahan", en: "subordinate", vi: "cấp dưới", pos: "noun", pronunciation_vi: "ba-WA-han", pronunciation_en: "ba-WA-han" },
      { cell_id: "419bdf3d-df41-46a2-bae0-07a3c550437e", word: "laporan", en: "report", vi: "báo cáo", pos: "noun", pronunciation_vi: "la-PO-ran", pronunciation_en: "la-POH-ran" },
      { cell_id: "d2bc4f15-3eb2-4c22-a0d0-1f3c3e1027e9", word: "berkas", en: "file / documents", vi: "hồ sơ", pos: "noun", pronunciation_vi: "BER-kas", pronunciation_en: "BER-kas" },
      { cell_id: "b2bfe74c-785b-4497-844c-54c13af18512", word: "kepada", en: "to (formal)", vi: "tới / cho (trang trọng)", pos: "prep.", pronunciation_vi: "ke-PA-da", pronunciation_en: "ke-PA-da" },
    ],
    dialogue: [
      { cell_id: "fcb636d9-59b0-45fa-9545-233f3774c466", speaker: "Karyawan", text: "Selamat pagi, Pak Budi. Boleh saya bertanya sebentar?", vi: "Chào buổi sáng, anh Budi. Em hỏi một chút được không ạ?", en: "Good morning, Mr Budi. May I ask you something briefly?" },
      { cell_id: "19e56500-bf12-4768-b1d9-d023893a6a8d", speaker: "Atasan", text: "Pagi. Boleh, silakan. Ada apa?", vi: "Chào. Được chứ, nói đi. Có việc gì?", en: "Morning. Sure, go ahead. What is it?" },
      { cell_id: "1422c218-d542-4c0c-8be3-a526843fe885", speaker: "Karyawan", text: "Laporannya sudah saya periksa. Saya kirim ke Bapak sekarang, ya.", vi: "Báo cáo em đã kiểm tra rồi. Em gửi cho anh ngay nhé.", en: "I've checked the report. I'll send it to you now." },
      { cell_id: "e734cb35-6fa4-45b3-89f4-fe7339c2ae6b", speaker: "Atasan", text: "Bagus. Nanti saya teruskan ke Bu Sari juga.", vi: "Tốt. Lát tôi chuyển cho chị Sari nữa.", en: "Good. I'll forward it to Mrs Sari as well." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ xưng hô/công sở còn thiếu:",
        instruction_en: "Fill in the missing address/office word:",
        items: [
          { prompt: "Selamat pagi, ___ Budi. Apa kabar? (anh/sếp nam)", answer: "Pak", options: ["Pak", "Bu", "Mbak"] },
          { prompt: "Saya akan laporkan ini kepada ___ saya. (cấp trên)", answer: "atasan", options: ["atasan", "bawahan", "berkas"] },
          { prompt: "___ saya bertanya sebentar? (xin phép: được không)", answer: "Boleh", options: ["Boleh", "Bukan", "Banyak"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "Pak", answer: "anh / chú (sếp nam)" },
          { prompt: "Bu", answer: "chị / cô (sếp nữ)" },
          { prompt: "atasan", answer: "cấp trên" },
          { prompt: "laporan", answer: "báo cáo" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Chị ơi, em hỏi một chút được không ạ?", answer: "Bu, boleh saya bertanya sebentar?" },
          { prompt: "Báo cáo này em đã kiểm tra rồi.", answer: "Laporan ini sudah saya periksa." },
          { prompt: "Tôi sẽ báo cáo việc này lên cấp trên.", answer: "Saya akan laporkan ini kepada atasan." },
        ],
      },
    ],
  },
  {
    id: "indonesian_work_jamkaret_basabasi",
    level: "A2",
    category: "workplace",
    title_vi: "Jam karet và basa-basi — giờ giấc và xã giao công sở",
    title_en: "Jam karet and basa-basi — time and small talk at work",
    sentences: [
      {
        en: "Maaf saya terlambat, tadi macet sekali.",
        vi: "Xin lỗi tôi đến muộn, vừa nãy kẹt xe quá.",
        pronunciation_focus: [
          "terlambat → ter-LAM-bat, 'trễ/muộn' (tiền tố ter- chỉ trạng thái)",
          "macet → MA-chet, 'kẹt xe' ('c' đọc như 'ch')",
          "sekali → se-KA-li, 'rất/lắm' (đặt sau tính từ)",
        ],
        pronunciation_focus_en: [
          "terlambat → 'ter-LAM-bat' — late (prefix 'ter-' marks a state)",
          "macet → 'MA-chet' — traffic jam ('c' = 'ch')",
          "sekali → 'se-KA-lee' — very (placed after the adjective)",
        ],
      },
      {
        en: "Rapatnya mulai jam berapa, ya?",
        vi: "Cuộc họp bắt đầu lúc mấy giờ vậy?",
        pronunciation_focus: [
          "rapat → RA-pat, 'cuộc họp'",
          "mulai → mu-LAI, 'bắt đầu'",
          "jam berapa → 'lúc mấy giờ'; 'ya' cuối câu làm mềm giọng",
        ],
        pronunciation_focus_en: [
          "rapat → 'RA-pat' — meeting",
          "mulai → 'moo-LAI' — to start / begin",
          "jam berapa → 'what time'; final 'ya' softens the tone",
        ],
      },
      {
        en: "Sudah makan siang belum, Mbak?",
        vi: "Chị ăn trưa chưa, chị?",
        pronunciation_focus: [
          "sudah … belum → 'đã … chưa' (mẫu hỏi đã làm hay chưa)",
          "makan siang → 'ăn trưa' (makan = ăn, siang = trưa)",
          "câu này là basa-basi (xã giao), không hẳn hỏi thật",
        ],
        pronunciation_focus_en: [
          "sudah … belum → 'have you … yet?' (the 'done-or-not-yet' question frame)",
          "makan siang → 'lunch' (makan = eat, siang = midday)",
          "this is basa-basi (phatic small talk), not always a literal question",
        ],
      },
      {
        en: "Mau ke mana, Mas? Buru-buru sekali.",
        vi: "Anh đi đâu thế? Vội ghê.",
        pronunciation_focus: [
          "mau ke mana → 'đi đâu' — câu chào xã giao rất phổ biến",
          "buru-buru → bu-ru-BU-ru, 'vội vàng' (từ láy)",
          "không cần trả lời chi tiết — chỉ là chào hỏi",
        ],
        pronunciation_focus_en: [
          "mau ke mana → 'where are you off to?' — a very common phatic greeting",
          "buru-buru → 'boo-roo-BOO-roo' — in a hurry (reduplication)",
          "no detailed answer needed — it's just a greeting",
        ],
      },
      {
        en: "Mari, saya duluan, ya. Sampai nanti.",
        vi: "Thôi, tôi đi trước nhé. Hẹn gặp lại.",
        pronunciation_focus: [
          "mari → MA-ri, 'nào/thôi' (lời chào lịch sự khi rời đi)",
          "duluan → du-LU-an, 'đi trước/trước' (khẩu ngữ)",
          "sampai nanti → 'hẹn gặp lại (lát nữa)'",
        ],
        pronunciation_focus_en: [
          "mari → 'MA-ree' — 'well then / let's' (a polite leave-taking)",
          "duluan → 'doo-LOO-an' — go first / ahead (colloquial)",
          "sampai nanti → 'see you later'",
        ],
      },
    ],
    cultural_notes_vi:
      "'JAM KARET' (giờ dây thun — co giãn) chỉ thói quen co giãn về giờ giấc: hẹn 9 giờ nhưng tới 9 rưỡi vẫn được xem là 'bình thường' trong nhiều bối cảnh xã hội. NHƯNG ở công ty chuyên nghiệp, ngân hàng, công ty đa quốc gia thì đúng giờ vẫn được kỳ vọng — đừng vin vào jam karet để đi trễ. 'BASA-BASI' là xã giao mở đầu (small talk) — người Indonesia ít vào việc ngay; họ hỏi 'Sudah makan?' (Ăn chưa?), 'Mau ke mana?' (Đi đâu đó?) như một cách chào, KHÔNG phải tò mò. Trả lời ngắn gọn thân thiện là đủ. Bỏ qua basa-basi để 'vào thẳng vấn đề' có thể bị thấy là lạnh lùng, thiếu lịch sự.",
    cultural_notes_en:
      "'JAM KARET' (rubber time) is the elastic attitude to punctuality: a 9 o'clock appointment that starts at 9:30 is still considered 'normal' in many social settings. BUT professional firms, banks and multinationals still expect punctuality — don't lean on jam karet to show up late. 'BASA-BASI' is opening small talk — Indonesians rarely dive straight into business; they ask 'Sudah makan?' (Have you eaten?), 'Mau ke mana?' (Where are you off to?) as a greeting, NOT out of nosiness. A short friendly reply is enough. Skipping basa-basi to 'get to the point' can read as cold or rude.",
    tip_advice_vi:
      "Mẹo cho người Việt: basa-basi rất giống văn hóa Việt ('Ăn cơm chưa?', 'Đi đâu đấy?') nên người Việt dễ bắt nhịp — KHÔNG trả lời dài dòng, chỉ cười và đáp ngắn ('Sudah, Mas' / 'Ke kantor'). Mẫu hỏi 'Sudah … belum?' rất quan trọng: 'Sudah makan belum?' (Ăn chưa?) → đáp 'Sudah' (rồi) hoặc 'Belum' (chưa). 'Sekali' đứng SAU tính từ để nhấn ('macet sekali' = kẹt xe lắm), khác với 'sangat' đứng TRƯỚC ('sangat macet'). Dù có jam karet, người chuyên nghiệp vẫn nên đúng giờ và xin lỗi nếu trễ ('Maaf saya terlambat').",
    tip_advice_en:
      "Tip for Vietnamese speakers: basa-basi closely mirrors Vietnamese culture ('Have you eaten?', 'Where are you going?'), so it's easy to pick up — DON'T over-answer, just smile and reply briefly ('Sudah, Mas' / 'Ke kantor'). The 'Sudah … belum?' frame is key: 'Sudah makan belum?' → answer 'Sudah' (yes) or 'Belum' (not yet). 'Sekali' goes AFTER the adjective for emphasis ('macet sekali' = very jammed), whereas 'sangat' goes BEFORE ('sangat macet'). Despite jam karet, professionals should still be punctual and apologize if late ('Maaf saya terlambat').",
    vocabulary: [
      { cell_id: "e57bbc80-5cb7-4f9b-8f48-74fbc66f5b8d", word: "jam karet", en: "rubber time / casual lateness", vi: "giờ dây thun (co giãn)", pos: "phrase", pronunciation_vi: "jam KA-ret", pronunciation_en: "jam KA-ret" },
      { cell_id: "b028e22e-9d75-4a97-a95c-bb22d13f505b", word: "basa-basi", en: "small talk / pleasantries", vi: "xã giao mở đầu", pos: "noun", pronunciation_vi: "BA-sa BA-si", pronunciation_en: "BA-sa BA-see" },
      { cell_id: "0bbfb041-bc6f-42a6-8a7e-65a50a1fecab", word: "terlambat", en: "late", vi: "trễ / muộn", pos: "adj.", pronunciation_vi: "ter-LAM-bat", pronunciation_en: "ter-LAM-bat" },
      { cell_id: "97ea9f88-8b5a-4d42-9276-671b9d47deb3", word: "macet", en: "traffic jam / stuck", vi: "kẹt xe", pos: "adj./noun", pronunciation_vi: "MA-chet", pronunciation_en: "MA-chet" },
      { cell_id: "81fa0833-43c2-4a9c-ac78-bcaaf2209794", word: "rapat", en: "meeting", vi: "cuộc họp", pos: "noun", pronunciation_vi: "RA-pat", pronunciation_en: "RA-pat" },
      { cell_id: "bb428150-1212-469e-93d5-9329090a5224", word: "mulai", en: "to start / begin", vi: "bắt đầu", pos: "verb", pronunciation_vi: "mu-LAI", pronunciation_en: "moo-LAI" },
      { cell_id: "3492c6ab-a6e2-4dde-880f-fe01e8edbc8f", word: "buru-buru", en: "in a hurry", vi: "vội vàng", pos: "adj.", pronunciation_vi: "bu-ru-BU-ru", pronunciation_en: "boo-roo-BOO-roo" },
      { cell_id: "eb6f94e9-97fb-459c-b4fd-bacc04b6068f", word: "sampai nanti", en: "see you later", vi: "hẹn gặp lại", pos: "phrase", pronunciation_vi: "SAM-pai NAN-ti", pronunciation_en: "SAM-pai NAN-tee" },
      { cell_id: "1f20c66f-db40-4acd-85c5-c1f91a73aaa8", word: "sekali", en: "very (after adjective)", vi: "rất / lắm", pos: "adv.", pronunciation_vi: "se-KA-li", pronunciation_en: "se-KA-lee" },
    ],
    dialogue: [
      { cell_id: "b3ae6a20-ffef-41e1-a4c4-6f234d363ec3", speaker: "Andi", text: "Pagi, Mbak Rina. Sudah makan belum?", vi: "Chào sáng, chị Rina. Ăn chưa?", en: "Morning, Rina. Have you eaten yet?" },
      { cell_id: "fb23ca35-0c69-4efe-b47a-f4171a9c78ed", speaker: "Rina", text: "Sudah, Mas. Eh, rapatnya mulai jam berapa, ya?", vi: "Rồi anh. À, cuộc họp bắt đầu lúc mấy giờ nhỉ?", en: "Yes, I have. Oh, what time does the meeting start?" },
      { cell_id: "7c8d25fa-7ad7-4b6a-9d82-1844a1938878", speaker: "Andi", text: "Harusnya jam sembilan, tapi Pak Budi masih di jalan. Macet katanya.", vi: "Đáng lẽ chín giờ, nhưng anh Budi còn trên đường. Nghe nói kẹt xe.", en: "It's supposed to be nine, but Mr Budi is still on the way. Traffic, he says." },
      { cell_id: "b75e9a4d-508b-4469-a49a-161241afe9e7", speaker: "Rina", text: "Jam karet, deh. Ya sudah, saya siapkan dulu berkasnya.", vi: "Lại giờ dây thun rồi. Thôi vậy, tôi chuẩn bị hồ sơ trước.", en: "Rubber time again. Alright then, I'll get the files ready first." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về giờ giấc/xã giao còn thiếu:",
        instruction_en: "Fill in the missing time/small-talk word:",
        items: [
          { prompt: "Maaf saya ___, tadi macet sekali. (đến muộn)", answer: "terlambat", options: ["terlambat", "terkenal", "terbuka"] },
          { prompt: "Sudah makan siang ___, Mbak? (chưa)", answer: "belum", options: ["belum", "bukan", "boleh"] },
          { prompt: "___ mulai jam berapa, ya? (cuộc họp)", answer: "Rapatnya", options: ["Rapatnya", "Rumahnya", "Ramainya"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "jam karet", answer: "giờ dây thun" },
          { prompt: "basa-basi", answer: "xã giao mở đầu" },
          { prompt: "macet", answer: "kẹt xe" },
          { prompt: "rapat", answer: "cuộc họp" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Xin lỗi tôi đến muộn, vừa nãy kẹt xe quá.", answer: "Maaf saya terlambat, tadi macet sekali." },
          { prompt: "Cuộc họp bắt đầu lúc mấy giờ vậy?", answer: "Rapatnya mulai jam berapa, ya?" },
          { prompt: "Chị ăn trưa chưa?", answer: "Sudah makan siang belum, Mbak?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_work_resign_politics",
    level: "B1",
    category: "workplace",
    title_vi: "Nghỉ việc và quan hệ công sở — xin thôi việc cho đúng phép",
    title_en: "Resigning and office relations — quitting gracefully",
    sentences: [
      {
        en: "Saya ingin mengundurkan diri secara baik-baik.",
        vi: "Tôi muốn xin nghỉ việc một cách êm đẹp.",
        pronunciation_focus: [
          "mengundurkan diri → 'xin từ chức/nghỉ việc' (thành ngữ trang trọng)",
          "secara → se-CA-ra, 'một cách' (tạo trạng từ)",
          "baik-baik → 'tử tế/êm đẹp' (từ láy, ở đây nghĩa 'cho phải phép')",
        ],
        pronunciation_focus_en: [
          "mengundurkan diri → 'to resign / step down' (a formal idiom)",
          "secara → 'se-CHA-ra' — in a … manner (forms adverbs)",
          "baik-baik → 'properly / amicably' (reduplication)",
        ],
      },
      {
        en: "Saya akan mengajukan surat pengunduran diri bulan depan.",
        vi: "Tôi sẽ nộp đơn xin thôi việc vào tháng sau.",
        pronunciation_focus: [
          "mengajukan → me-nga-JU-kan, 'đệ trình/nộp' (gốc aju)",
          "surat pengunduran diri → 'đơn xin nghỉ việc'",
          "bulan depan → 'tháng sau'",
        ],
        pronunciation_focus_en: [
          "mengajukan → 'me-nga-JOO-kan' — to submit / put forward (root 'aju')",
          "surat pengunduran diri → 'a resignation letter'",
          "bulan depan → 'next month'",
        ],
      },
      {
        en: "Saya berterima kasih atas kesempatan dan bimbingannya.",
        vi: "Tôi xin cảm ơn vì cơ hội và sự dìu dắt.",
        pronunciation_focus: [
          "berterima kasih → 'tỏ lòng biết ơn' (ber- + terima kasih)",
          "kesempatan → ke-sem-PA-tan, 'cơ hội'",
          "bimbingan → bim-BING-an, 'sự hướng dẫn/dìu dắt'",
        ],
        pronunciation_focus_en: [
          "berterima kasih → 'to express thanks' (ber- + terima kasih)",
          "kesempatan → 'ke-sem-PA-tan' — opportunity",
          "bimbingan → 'beem-BEENG-an' — guidance / mentoring",
        ],
      },
      {
        en: "Saya akan menyelesaikan semua tugas sebelum pergi.",
        vi: "Tôi sẽ hoàn thành mọi công việc trước khi đi.",
        pronunciation_focus: [
          "menyelesaikan → me-nye-le-SAI-kan, 'hoàn thành/giải quyết' (gốc selesai)",
          "tugas → TU-gas, 'nhiệm vụ/công việc'",
          "sebelum → se-BE-lum, 'trước khi' (ngược 'sesudah' = sau khi)",
        ],
        pronunciation_focus_en: [
          "menyelesaikan → 'me-nye-le-SAI-kan' — to finish/complete (root 'selesai')",
          "tugas → 'TOO-gas' — task / duty",
          "sebelum → 'se-BE-loom' — before (opposite 'sesudah' = after)",
        ],
      },
      {
        en: "Mohon maaf bila ada salah selama saya bekerja di sini.",
        vi: "Xin lượng thứ nếu có sai sót trong thời gian tôi làm việc ở đây.",
        pronunciation_focus: [
          "mohon maaf → 'xin lỗi/xin lượng thứ' (trang trọng hơn 'maaf')",
          "bila → BI-la, 'nếu/khi' (trang trọng)",
          "selama → se-LA-ma, 'trong suốt (thời gian)'",
        ],
        pronunciation_focus_en: [
          "mohon maaf → 'I sincerely apologize' (more formal than 'maaf')",
          "bila → 'BEE-la' — if / when (formal)",
          "selama → 'se-LA-ma' — during / throughout",
        ],
      },
    ],
    cultural_notes_vi:
      "Nghỉ việc ở Indonesia coi trọng sự ÊM ĐẸP ('keluar baik-baik'). Quy trình chuẩn: báo trước (thường 'one month notice' = sebulan sebelumnya), nộp 'surat pengunduran diri' (đơn xin thôi việc) chính thức, rồi 'pamit' — chào tạm biệt từng người, cảm ơn cấp trên và đồng nghiệp. Giữ quan hệ tốt rất quan trọng vì mạng lưới ('jaringan') và tiếng lành đồn xa; ngành nghề ở Indonesia khá khép kín, ra đi 'đốt cầu' sẽ theo bạn. VỀ OFFICE POLITICS: tránh nói xấu sếp/đồng nghiệp công khai; người Indonesia trọng 'menjaga muka' (giữ thể diện) cho cả hai bên. Bất đồng thường được nói khéo, gián tiếp ('halus') chứ không đối đầu thẳng — đối đầu công khai làm mất mặt là điều tối kỵ.",
    cultural_notes_en:
      "Resigning in Indonesia values leaving AMICABLY ('keluar baik-baik'). The standard flow: give notice (usually one month — sebulan sebelumnya), submit a formal 'surat pengunduran diri' (resignation letter), then 'pamit' — say goodbye to people individually, thanking your superior and colleagues. Keeping good relations matters because of network ('jaringan') and reputation; Indonesian industries are fairly small-world, so burning bridges follows you. ON OFFICE POLITICS: avoid openly badmouthing a boss/colleague; Indonesians prize 'menjaga muka' (saving face) for both sides. Disagreement is usually voiced tactfully and indirectly ('halus') rather than head-on — public confrontation that causes loss of face is a serious taboo.",
    tip_advice_vi:
      "Mẹo cho người Việt: cụm cố định 'mengundurkan diri' = từ chức/nghỉ việc (đừng dịch máy 'rút lui bản thân'). 'Pamit' (xin phép cáo từ) không có từ tương đương gọn trong tiếng Anh — là nghi thức chào trước khi rời đi, dùng cả khi về sớm hằng ngày ('Pak, saya pamit duluan, ya'). Khi viết đơn nghỉ: (1) nêu ý định + ngày hiệu lực, (2) cảm ơn 'atas kesempatan dan bimbingan', (3) xin lỗi 'mohon maaf bila ada salah'. Tiền tố 'meng-/me-nye-' tạo động từ chủ động (mengajukan, menyelesaikan) — văn phong trang trọng cần dùng đúng. Tránh đối đầu thẳng; nói khéo ('halus') để giữ thể diện cho cả hai.",
    tip_advice_en:
      "Tip for Vietnamese speakers: the fixed idiom 'mengundurkan diri' = to resign (don't translate literally as 'withdraw oneself'). 'Pamit' (to take one's leave) has no neat English equivalent — it's the ritual of saying goodbye before leaving, used even for leaving early daily ('Pak, saya pamit duluan, ya'). A resignation letter: (1) state intent + effective date, (2) thank 'atas kesempatan dan bimbingan', (3) apologize 'mohon maaf bila ada salah'. The 'meng-/me-nye-' prefixes form active verbs (mengajukan, menyelesaikan) — formal writing needs them right. Avoid head-on confrontation; speak tactfully ('halus') to save face for both sides.",
    vocabulary: [
      { cell_id: "8c4a0eb7-ef2e-442d-bc87-f361b3b77a5d", word: "mengundurkan diri", en: "to resign / step down", vi: "xin nghỉ việc / từ chức", pos: "verb phrase", pronunciation_vi: "me-ngun-DUR-kan DI-ri", pronunciation_en: "me-ngoon-DOOR-kan DEE-ree" },
      { cell_id: "7f95983f-927a-4b47-a1c5-a47c438a3fe3", word: "surat pengunduran diri", en: "resignation letter", vi: "đơn xin thôi việc", pos: "noun", pronunciation_vi: "SU-rat pe-ngun-DU-ran DI-ri", pronunciation_en: "SOO-rat pe-ngoon-DOO-ran DEE-ree" },
      { cell_id: "268fc1bd-3005-4662-8a94-18803737eb4b", word: "pamit", en: "to take one's leave / say goodbye", vi: "cáo từ / xin phép về", pos: "verb", pronunciation_vi: "PA-mit", pronunciation_en: "PA-meet" },
      { cell_id: "3e707145-3007-49a1-b12d-081e864f2f3d", word: "kesempatan", en: "opportunity", vi: "cơ hội", pos: "noun", pronunciation_vi: "ke-sem-PA-tan", pronunciation_en: "ke-sem-PA-tan" },
      { cell_id: "d2ba43ad-2c12-46b9-b45f-6048936444f8", word: "bimbingan", en: "guidance / mentoring", vi: "sự dìu dắt", pos: "noun", pronunciation_vi: "bim-BING-an", pronunciation_en: "beem-BEENG-an" },
      { cell_id: "0af9e4a3-9f86-42ac-8424-294938efa88d", word: "menyelesaikan", en: "to finish / complete", vi: "hoàn thành", pos: "verb", pronunciation_vi: "me-nye-le-SAI-kan", pronunciation_en: "me-nye-le-SAI-kan" },
      { cell_id: "cca6c305-7715-4e41-b5e9-65894c6dd024", word: "tugas", en: "task / duty", vi: "nhiệm vụ / công việc", pos: "noun", pronunciation_vi: "TU-gas", pronunciation_en: "TOO-gas" },
      { cell_id: "8d3ef84a-0256-479d-9628-da192ae62a5c", word: "menjaga muka", en: "to save face", vi: "giữ thể diện", pos: "verb phrase", pronunciation_vi: "men-JA-ga MU-ka", pronunciation_en: "men-JA-ga MOO-ka" },
      { cell_id: "c8008631-0962-4827-96c2-2f7c5e287484", word: "jaringan", en: "network (professional)", vi: "mạng lưới quan hệ", pos: "noun", pronunciation_vi: "ja-RING-an", pronunciation_en: "ja-REENG-an" },
    ],
    dialogue: [
      { cell_id: "03ed5130-d76d-4439-82e0-d8fef9474668", speaker: "Karyawan", text: "Pak, mohon maaf, saya ingin menyampaikan sesuatu. Saya berniat mengundurkan diri.", vi: "Anh ơi, xin lỗi, em muốn thưa một việc. Em định xin nghỉ việc.", en: "Sir, I'm sorry, I'd like to share something. I intend to resign." },
      { cell_id: "34a8cbc9-64b6-4906-93f2-195ca822d125", speaker: "Atasan", text: "Oh, begitu. Boleh saya tahu alasannya, Mas?", vi: "Ồ, vậy à. Tôi có thể biết lý do không?", en: "Oh, I see. May I know the reason?" },
      { cell_id: "380b366d-a2d7-40d6-81d0-e11252b6e746", speaker: "Karyawan", text: "Saya dapat kesempatan baru. Saya akan selesaikan semua tugas dan ajukan suratnya bulan ini.", vi: "Em có cơ hội mới. Em sẽ hoàn thành mọi việc và nộp đơn trong tháng này.", en: "I've got a new opportunity. I'll finish all my tasks and submit the letter this month." },
      { cell_id: "a1659694-b83d-402b-b9b6-988a2e52c834", speaker: "Atasan", text: "Baik, saya hargai sikapmu. Terima kasih sudah keluar baik-baik.", vi: "Được, tôi trân trọng thái độ của em. Cảm ơn em đã ra đi êm đẹp.", en: "Alright, I appreciate your attitude. Thank you for leaving on good terms." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về nghỉ việc/công sở còn thiếu:",
        instruction_en: "Fill in the missing resignation/office word:",
        items: [
          { prompt: "Saya ingin ___ secara baik-baik. (xin nghỉ việc)", answer: "mengundurkan diri", options: ["mengundurkan diri", "mengajukan tugas", "menyelesaikan rapat"] },
          { prompt: "Saya akan menyelesaikan semua ___ sebelum pergi. (công việc)", answer: "tugas", options: ["tugas", "tamu", "tahun"] },
          { prompt: "Saya berterima kasih atas kesempatan dan ___. (sự dìu dắt)", answer: "bimbingannya", options: ["bimbingannya", "bawahannya", "berkasnya"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "mengundurkan diri", answer: "xin nghỉ việc" },
          { prompt: "pamit", answer: "cáo từ / xin phép về" },
          { prompt: "kesempatan", answer: "cơ hội" },
          { prompt: "menjaga muka", answer: "giữ thể diện" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn xin nghỉ việc một cách êm đẹp.", answer: "Saya ingin mengundurkan diri secara baik-baik." },
          { prompt: "Tôi sẽ nộp đơn xin thôi việc vào tháng sau.", answer: "Saya akan mengajukan surat pengunduran diri bulan depan." },
          { prompt: "Tôi sẽ hoàn thành mọi công việc trước khi đi.", answer: "Saya akan menyelesaikan semua tugas sebelum pergi." },
        ],
      },
    ],
  },
];

export default workplaceCultureLessons;
