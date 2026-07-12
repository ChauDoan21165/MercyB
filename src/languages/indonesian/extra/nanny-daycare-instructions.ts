// Nanny & Daycare Instructions Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for giving childcare instructions: caregiver
// routines, meal times, naps, child allergies, emergency numbers, pickup, and
// daily routines. Indonesian target text lives in `en`, Vietnamese glosses in
// `vi`, Vietnamese L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  cell_id?: string;
  /** Indonesian word/phrase. */
  word: string;
  /** English meaning. */
  en: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Part of speech. */
  pos: string;
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  cell_id?: string;
  speaker: string;
  /** Indonesian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
  en?: string;
};

// Loosely typed so per-type fields (translation, fill_blank, matching) can vary.
export type IndonesianExercise = Record<string, unknown>;

export type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: IndonesianLessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: IndonesianVocabEntry[];
  dialogue?: IndonesianDialogueLine[];
  exercises?: IndonesianExercise[];
  content?: string;
};

export const nannyDaycareInstructionsLessons: IndonesianLesson[] = [
  {
    id: "indonesian_nanny_daycare_instructions",
    level: "A2",
    category: "childcare_parenting",
    title_vi: "Dặn pengasuh và daycare về rutinitas anak",
    title_en: "Giving nanny and daycare instructions for a child's routine",
    sentences: [
      {
        en: "Ini instruksi untuk pengasuh anak saya hari ini.",
        vi: "Đây là hướng dẫn cho người trông con tôi hôm nay.",
        pronunciation_focus: [
          "in-STRUK-si pe-NGA-suh - `instruksi pengasuh` = hướng dẫn/dặn dò cho người trông trẻ.",
          "`pengasuh` = người chăm sóc/trông trẻ; tự nhiên hơn dịch chữ `orang jaga anak`.",
          "`hari ini` đứng cuối câu để nói rõ lịch hôm nay, không phải quy tắc mãi mãi.",
          "Luyện: `Ini instruksi untuk pengasuh.`",
        ],
        pronunciation_focus_en: [
          "in-STRUK-si pe-NGA-sooh - `instruksi pengasuh` = instructions for the caregiver/nanny.",
          "`pengasuh` = caregiver/nanny; more natural than literal `orang jaga anak`.",
          "`hari ini` at the end makes it today's plan, not a permanent rule.",
          "Drill: `Ini instruksi untuk pengasuh.`",
        ],
      },
      {
        en: "Jam makan pagi anak saya biasanya pukul delapan.",
        vi: "Giờ ăn sáng của con tôi thường là tám giờ.",
        pronunciation_focus: [
          "JAM MA-kan PA-gi - `jam makan pagi` = giờ ăn sáng.",
          "`biasanya` = thường/thường lệ; hữu ích khi nói rutinitas harian.",
          "`pukul delapan` = tám giờ; `pukul` trang trọng/rõ hơn `jam` khi nói giờ cụ thể.",
          "Luyện: `Jam makan pagi pukul delapan.`",
        ],
        pronunciation_focus_en: [
          "JAM MA-kan PA-gee - `jam makan pagi` = breakfast time.",
          "`biasanya` = usually; useful for daily routines.",
          "`pukul delapan` = eight o'clock; `pukul` is clearer/more formal for clock time than `jam`.",
          "Drill: `Jam makan pagi pukul delapan.`",
        ],
      },
      {
        en: "Tolong beri dia makan siang sedikit demi sedikit.",
        vi: "Làm ơn cho bé ăn trưa từng chút một.",
        pronunciation_focus: [
          "BE-ri DI-a MA-kan SI-ang - `beri dia makan` = cho bé ăn.",
          "`sedikit demi sedikit` = từng chút một; mềm hơn ép trẻ ăn nhanh.",
          "Lỗi người Việt: nói `kasih makan dia` rất khẩu ngữ. Với instruksi tertulis, `beri dia makan` rõ hơn.",
          "Luyện: `Tolong beri dia makan siang.`",
        ],
        pronunciation_focus_en: [
          "BE-ree DEE-a MA-kan SEE-ang - `beri dia makan` = feed him/her.",
          "`sedikit demi sedikit` = little by little; softer than forcing fast eating.",
          "VN-speaker trap: `kasih makan dia` is very colloquial. In written instructions, `beri dia makan` is clearer.",
          "Drill: `Tolong beri dia makan siang.`",
        ],
      },
      {
        en: "Dia tidur siang setelah makan dan biasanya bangun pukul dua.",
        vi: "Bé ngủ trưa sau khi ăn và thường dậy lúc hai giờ.",
        pronunciation_focus: [
          "TI-dur SI-ang - `tidur siang` = ngủ trưa; không nói `tidur trưa` theo tiếng Việt.",
          "`setelah makan` = sau khi ăn; `bangun` = thức dậy.",
          "`pukul dua` trong ngữ cảnh daycare thường hiểu là 2 giờ chiều.",
          "Luyện: `Dia tidur siang setelah makan.`",
        ],
        pronunciation_focus_en: [
          "TEE-door SEE-ang - `tidur siang` = nap; do not say Vietnamese-style `tidur trưa`.",
          "`setelah makan` = after eating; `bangun` = wake up.",
          "`pukul dua` in daycare context usually means 2 p.m.",
          "Drill: `Dia tidur siang setelah makan.`",
        ],
      },
      {
        en: "Anak saya punya alergi kacang, jadi jangan beri makanan yang mengandung kacang.",
        vi: "Con tôi bị dị ứng đậu/phộng, nên đừng cho thức ăn có chứa đậu/phộng.",
        pronunciation_focus: [
          "a-LER-gi KA-cang - `alergi kacang` = dị ứng đậu/phộng.",
          "`mengandung kacang` = có chứa đậu/phộng; dùng tốt trên nhãn thức ăn.",
          "`jangan beri` = đừng cho; lệnh cấm dùng `jangan`, không dùng `tidak`.",
          "Luyện: `Anak saya punya alergi kacang.`",
        ],
        pronunciation_focus_en: [
          "a-LER-gee KA-chang - `alergi kacang` = nut/peanut allergy.",
          "`mengandung kacang` = contains nuts/peanuts; useful on food labels.",
          "`jangan beri` = do not give; prohibitions use `jangan`, not `tidak`.",
          "Drill: `Anak saya punya alergi kacang.`",
        ],
      },
      {
        en: "Kalau muncul ruam atau sesak napas, segera hubungi nomor darurat.",
        vi: "Nếu xuất hiện phát ban hoặc khó thở, hãy liên hệ số khẩn cấp ngay.",
        pronunciation_focus: [
          "RU-am a-tau SE-sak NA-pas - `ruam` = phát ban; `sesak napas` = khó thở.",
          "`segera hubungi` = liên hệ ngay; cụm quan trọng cho tình huống y tế.",
          "`nomor darurat` = số khẩn cấp; không dịch là `nomor cepat`.",
          "Luyện: `Segera hubungi nomor darurat.`",
        ],
        pronunciation_focus_en: [
          "ROO-am a-tau SE-sak NA-pas - `ruam` = rash; `sesak napas` = shortness of breath.",
          "`segera hubungi` = contact immediately; important for medical situations.",
          "`nomor darurat` = emergency number; do not translate as `nomor cepat`.",
          "Drill: `Segera hubungi nomor darurat.`",
        ],
      },
      {
        en: "Nomor darurat saya dan suami sudah tertulis di buku catatan.",
        vi: "Số khẩn cấp của tôi và chồng tôi đã được viết trong sổ ghi chú.",
        pronunciation_focus: [
          "ter-TU-lis di BU-ku ca-TA-tan - `tertulis` = được viết/có ghi.",
          "`buku catatan` = sổ ghi chú; hữu ích để giao ca giữa pengasuh.",
          "`saya dan suami` = tôi và chồng; nếu là vợ dùng `istri`.",
          "Luyện: `Nomor darurat sudah tertulis.`",
        ],
        pronunciation_focus_en: [
          "ter-TOO-lis dee BOO-koo cha-TA-tan - `tertulis` = written down.",
          "`buku catatan` = notebook/logbook; useful for caregiver handover.",
          "`saya dan suami` = me and my husband; for wife use `istri`.",
          "Drill: `Nomor darurat sudah tertulis.`",
        ],
      },
      {
        en: "Yang boleh jemput anak hanya saya, suami, atau neneknya.",
        vi: "Người được phép đón bé chỉ có tôi, chồng tôi hoặc bà của bé.",
        pronunciation_focus: [
          "yang BO-leh JEM-put - `yang boleh jemput` = người được phép đón.",
          "`hanya` = chỉ; đặt trước danh sách người được phép.",
          "Lỗi người Việt: bỏ `yang`. Khi nói 'người được phép làm X', dùng `yang boleh + động từ`.",
          "Luyện: `Yang boleh jemput hanya saya.`",
        ],
        pronunciation_focus_en: [
          "yang BOH-leh JEM-put - `yang boleh jemput` = the person allowed to pick up.",
          "`hanya` = only; placed before the allowed list.",
          "VN-speaker trap: dropping `yang`. For 'the person allowed to do X', use `yang boleh + verb`.",
          "Drill: `Yang boleh jemput hanya saya.`",
        ],
      },
      {
        en: "Tolong jangan berikan anak saya kepada orang yang tidak dikenal.",
        vi: "Làm ơn đừng giao con tôi cho người lạ.",
        pronunciation_focus: [
          "o-rang yang TI-dak di-ke-NAL - `orang yang tidak dikenal` = người không quen/người lạ.",
          "`jangan berikan` = đừng đưa/giao; lịch sự nhưng rất rõ.",
          "`kepada` trang trọng hơn `ke` khi nói giao cho người nào.",
          "Luyện: `Jangan berikan anak saya kepada orang asing.`",
        ],
        pronunciation_focus_en: [
          "o-rang yang TEE-dak dee-ke-NAL - `orang yang tidak dikenal` = unknown person/stranger.",
          "`jangan berikan` = do not hand over/give; polite but clear.",
          "`kepada` is more formal than `ke` when giving something to someone.",
          "Drill: `Jangan berikan anak saya kepada orang asing.`",
        ],
      },
      {
        en: "Rutinitas harian anak saya ada di daftar ini.",
        vi: "Thói quen/lịch sinh hoạt hằng ngày của con tôi có trong danh sách này.",
        pronunciation_focus: [
          "ru-ti-NI-tas HA-ri-an - `rutinitas harian` = lịch sinh hoạt hằng ngày.",
          "`daftar ini` = danh sách này; dùng cho checklist makan, tidur, obat, jemput.",
          "Lỗi người Việt: nói `jadwal hidup` nghe dịch chữ. Cụm tự nhiên là `rutinitas harian`.",
          "Luyện: `Rutinitas harian ada di daftar ini.`",
        ],
        pronunciation_focus_en: [
          "roo-tee-NEE-tas HA-ree-an - `rutinitas harian` = daily routine.",
          "`daftar ini` = this list; useful for checklists of meals, naps, medicine, pickup.",
          "VN-speaker trap: saying translated `jadwal hidup`. Natural phrase: `rutinitas harian`.",
          "Drill: `Rutinitas harian ada di daftar ini.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi giao anak ke pengasuh hoặc daycare ở Indonesia, phụ huynh thường viết instruksi singkat tentang jam makan, tidur siang, alergi, obat, nomor darurat, và siapa yang boleh jemput. Với dị ứng, nên nói thật rõ: bahan makanan apa yang tidak boleh diberikan và tanda bahaya seperti ruam atau sesak napas. Viết instruksi trong `buku catatan` hoặc chat giúp tránh hiểu lầm khi pengasuh berganti shift.",
    cultural_notes_en:
      "When leaving a child with a nanny or daycare in Indonesia, parents often write brief instructions about meal times, naps, allergies, medicine, emergency numbers, and who is allowed to pick up the child. For allergies, be very clear about which foods must not be given and danger signs such as rash or shortness of breath. Writing instructions in a notebook or chat helps avoid confusion when caregivers change shifts.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt `antar` = đưa đến và `jemput` = đón về. Với lệnh cấm cho trẻ, dùng `jangan`: `jangan beri`, `jangan berikan`, `jangan lupa`. Cụm cần nhớ: `instruksi pengasuh`, `jam makan`, `tidur siang`, `alergi anak`, `nomor darurat`, `yang boleh jemput`, `rutinitas harian`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: distinguish `antar` = drop off/take there and `jemput` = pick up. For child-safety prohibitions, use `jangan`: `jangan beri`, `jangan berikan`, `jangan lupa`. Key chunks: `instruksi pengasuh`, `jam makan`, `tidur siang`, `alergi anak`, `nomor darurat`, `yang boleh jemput`, `rutinitas harian`.",
    vocabulary: [
      {
        cell_id: "157abb98-51c6-41bc-b640-cf5570eb6f0c",
        word: "instruksi pengasuh",
        en: "caregiver instructions",
        vi: "hướng dẫn cho người trông trẻ",
        pos: "noun phrase",
        pronunciation_vi: "in-STRUK-si pe-NGA-suh",
        pronunciation_en: "in-STRUK-si pe-NGA-sooh",
      },
      {
        cell_id: "9bec3f4d-1e67-48cf-a8bc-d1c87524ce7c",
        word: "jam makan",
        en: "meal time",
        vi: "giờ ăn",
        pos: "noun phrase",
        pronunciation_vi: "JAM MA-kan",
        pronunciation_en: "JAM MA-kan",
      },
      {
        cell_id: "0c715f46-f922-4d81-8bc4-9847a809a911",
        word: "tidur siang",
        en: "nap / midday sleep",
        vi: "ngủ trưa",
        pos: "verb phrase / noun phrase",
        pronunciation_vi: "TI-dur SI-ang",
        pronunciation_en: "TEE-door SEE-ang",
      },
      {
        cell_id: "a62260e1-7e14-46c3-98c7-e871cba5c4d5",
        word: "alergi anak",
        en: "child allergy",
        vi: "dị ứng của trẻ",
        pos: "noun phrase",
        pronunciation_vi: "a-LER-gi A-nak",
        pronunciation_en: "a-LER-gee A-nak",
      },
      {
        cell_id: "e7ce3054-fe26-4639-9400-afd63c404f64",
        word: "nomor darurat",
        en: "emergency number",
        vi: "số khẩn cấp",
        pos: "noun phrase",
        pronunciation_vi: "NO-mor da-RU-rat",
        pronunciation_en: "NO-mor da-ROO-rat",
      },
      {
        cell_id: "4f388401-826d-4dac-8c9c-625ac0a5996c",
        word: "jemput anak",
        en: "pick up the child",
        vi: "đón con / đón trẻ",
        pos: "verb phrase",
        pronunciation_vi: "JEM-put A-nak",
        pronunciation_en: "JEM-put A-nak",
      },
      {
        cell_id: "a093b7bf-aff8-4383-92f6-aa2ca7134a04",
        word: "rutinitas harian",
        en: "daily routine",
        vi: "lịch sinh hoạt hằng ngày",
        pos: "noun phrase",
        pronunciation_vi: "ru-ti-NI-tas HA-ri-an",
        pronunciation_en: "roo-tee-NEE-tas HA-ree-an",
      },
      {
        cell_id: "7ff9aeb1-178e-4b08-ad3f-fd4aed408a65",
        word: "mengandung kacang",
        en: "contains nuts/peanuts",
        vi: "có chứa đậu/phộng",
        pos: "verb phrase",
        pronunciation_vi: "me-NGAN-dung KA-cang",
        pronunciation_en: "me-NGAN-doong KA-chang",
      },
      {
        cell_id: "1f478263-f840-45f7-b118-1a2d8dd9974c",
        word: "orang yang tidak dikenal",
        en: "unknown person / stranger",
        vi: "người lạ",
        pos: "noun phrase",
        pronunciation_vi: "O-rang yang TI-dak di-ke-NAL",
        pronunciation_en: "O-rang yang TEE-dak dee-ke-NAL",
      },
      {
        cell_id: "7cae7f95-2951-4eb0-9e2d-d92bbafbb710",
        word: "buku catatan",
        en: "notebook / logbook",
        vi: "sổ ghi chú",
        pos: "noun phrase",
        pronunciation_vi: "BU-ku ca-TA-tan",
        pronunciation_en: "BOO-koo cha-TA-tan",
      },
    ],
    dialogue: [
      {
        cell_id: "ce072b52-2571-4d9a-a9fa-5c6c5d31fa92",
        speaker: "Orang Tua",
        text: "Ini instruksi untuk pengasuh anak saya hari ini.",
        vi: "Đây là hướng dẫn cho người trông con tôi hôm nay.",
        en: "These are the instructions for my child's caregiver today.",
      },
      {
        cell_id: "f69520dd-28eb-48c0-9c6d-0196bb2d9cb6",
        speaker: "Pengasuh",
        text: "Baik, Bu. Jam makan dan tidur siangnya pukul berapa?",
        vi: "Vâng chị. Giờ ăn và ngủ trưa là mấy giờ?",
        en: "All right, ma'am. What time are meal time and nap time?",
      },
      {
        cell_id: "02aa7bbb-da02-4c61-b8d3-9b261ffe6495",
        speaker: "Orang Tua",
        text: "Makan siang pukul dua belas, lalu tidur siang setelah makan.",
        vi: "Ăn trưa lúc mười hai giờ, rồi ngủ trưa sau khi ăn.",
        en: "Lunch is at twelve, then nap time after eating.",
      },
      {
        cell_id: "dfd8a788-f6a6-43e4-a043-e15452f931f0",
        speaker: "Pengasuh",
        text: "Apakah ada alergi anak yang perlu saya perhatikan?",
        vi: "Có dị ứng nào của bé mà tôi cần chú ý không?",
        en: "Are there any child allergies I should pay attention to?",
      },
      {
        cell_id: "7d4ef3ac-2763-47d7-8ad8-0ebfd9571b4a",
        speaker: "Orang Tua",
        text: "Ada alergi kacang. Kalau muncul ruam, segera hubungi nomor darurat.",
        vi: "Có dị ứng đậu/phộng. Nếu xuất hiện phát ban, hãy liên hệ số khẩn cấp ngay.",
        en: "There is a nut allergy. If a rash appears, contact the emergency number immediately.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm từ chăm sóc trẻ còn thiếu:",
        instruction_en: "Fill in the missing childcare phrase:",
        items: [
          {
            prompt: "Ini instruksi untuk ___ anak saya.",
            answer: "pengasuh",
            options: ["pengasuh", "pengusaha", "pengunjung"],
          },
          {
            prompt: "Dia ___ siang setelah makan.",
            answer: "tidur",
            options: ["tidur", "tawar", "turun"],
          },
          {
            prompt: "Yang boleh ___ anak hanya saya atau suami.",
            answer: "jemput",
            options: ["jemput", "jual", "jatuh"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ Indonesia với nghĩa tiếng Việt:",
        instruction_en: "Match the Indonesian phrase with its Vietnamese meaning:",
        items: [
          { prompt: "instruksi pengasuh", answer: "hướng dẫn cho người trông trẻ" },
          { prompt: "jam makan", answer: "giờ ăn" },
          { prompt: "nomor darurat", answer: "số khẩn cấp" },
          { prompt: "rutinitas harian", answer: "lịch sinh hoạt hằng ngày" },
          { prompt: "orang yang tidak dikenal", answer: "người lạ" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          {
            prompt: "Đây là hướng dẫn cho người trông con tôi hôm nay.",
            answer: "Ini instruksi untuk pengasuh anak saya hari ini.",
          },
          {
            prompt: "Con tôi bị dị ứng đậu/phộng.",
            answer: "Anak saya punya alergi kacang.",
          },
          {
            prompt: "Người được phép đón bé chỉ có tôi, chồng tôi hoặc bà của bé.",
            answer: "Yang boleh jemput anak hanya saya, suami, atau neneknya.",
          },
        ],
      },
    ],
  },
];

export default nannyDaycareInstructionsLessons;
