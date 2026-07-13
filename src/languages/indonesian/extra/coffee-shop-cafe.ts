// Coffee Shop & Cafe Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It follows the established Indonesian extra
// lesson format: Indonesian target text lives in `en`, Vietnamese glosses live in
// `vi`, and each Vietnamese-facing learning note has an English companion.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus -- same length + order. */
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
  /** Part of speech, e.g. "noun", "verb", "phrase". */
  pos: string;
  /** Vietnamese pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English pronunciation hint, stressed syllable in CAPS. */
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

// Loosely typed so per-type fields (translation, fill-blank, matching) can vary.
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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_coffee_shop_cafe",
    level: "A2",
    category: "food",
    title_vi: "Quán cà phê: gọi đồ, Wi-Fi và trả tiền",
    title_en: "Coffee shop: ordering, Wi-Fi and paying",
    sentences: [
      {
        en: "Saya mau pesan es kopi susu satu.",
        vi: "Tôi muốn gọi một ly cà phê sữa đá.",
        pronunciation_focus: [
          "SA-ya mau PE-san es KO-pi SU-su SA-tu -- `es kopi susu` = cà phê sữa đá kiểu Indonesia.",
          "Lỗi người Việt: nói `kopi susu es`. Trật tự tự nhiên là `es + kopi susu`: `es kopi susu`.",
          "Luyện: `Saya mau pesan es kopi susu satu.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau PE-san es KO-pi SOO-soo SA-tu -- `es kopi susu` = Indonesian iced milk coffee.",
          "VN-speaker trap: saying `kopi susu es`. Natural order is `es + kopi susu`: `es kopi susu`.",
          "Drill: `Saya mau pesan es kopi susu satu.`",
        ],
      },
      {
        en: "Kedai kopi ini enak untuk nongkrong.",
        vi: "Quán cà phê này hợp để ngồi chơi/tụ tập.",
        pronunciation_focus: [
          "ke-DAI KO-pi I-ni E-nak UN-tuk NONG-krong -- `kedai kopi` = quán cà phê; `nongkrong` = ngồi chơi/tụ tập.",
          "`enak untuk...` không chỉ nói đồ ăn ngon; còn nghĩa là 'hợp/thoải mái để...' trong đời thường.",
          "Luyện: `Kedai kopi ini enak untuk nongkrong.`",
        ],
        pronunciation_focus_en: [
          "ke-DAI KO-pi EE-ni E-nak OON-tuk NONG-krong -- `kedai kopi` = coffee shop; `nongkrong` = hang out.",
          "`Enak untuk...` does not only mean tasty; colloquially it can mean comfortable/good for doing something.",
          "Drill: `Kedai kopi ini enak untuk nongkrong.`",
        ],
      },
      {
        en: "Ada meja kosong untuk dua orang?",
        vi: "Có bàn trống cho hai người không?",
        pronunciation_focus: [
          "A-da ME-ja KO-song UN-tuk DU-a O-rang -- `meja kosong` = bàn trống; `untuk dua orang` = cho hai người.",
          "Lỗi người Việt: hỏi `kosong meja ada?` theo thứ tự tiếng Việt. Câu tự nhiên: `Ada meja kosong?`",
          "Luyện: `Ada meja kosong untuk dua orang?`",
        ],
        pronunciation_focus_en: [
          "A-da ME-ja KO-song OON-tuk DOO-a O-rang -- `meja kosong` = empty table; `untuk dua orang` = for two people.",
          "VN-speaker trap: asking `kosong meja ada?` with Vietnamese order. Natural: `Ada meja kosong?`",
          "Drill: `Ada meja kosong untuk dua orang?`",
        ],
      },
      {
        en: "Password Wi-Fi-nya apa, Mas?",
        vi: "Mật khẩu Wi-Fi là gì vậy anh?",
        pronunciation_focus: [
          "PAS-word WAI-fai-nya A-pa, Mas -- `Wi-Fi-nya` = Wi-Fi ở đây/của quán; `apa` = gì.",
          "Mẹo: thêm `Mas` hoặc `Mbak` khi hỏi nhân viên trẻ để nghe thân thiện và lịch sự.",
          "Luyện: `Password Wi-Fi-nya apa?`",
        ],
        pronunciation_focus_en: [
          "PAS-word WAI-fai-nya A-pa, Mas -- `Wi-Fi-nya` = this place's Wi-Fi; `apa` = what.",
          "Tip: add `Mas` or `Mbak` when asking young staff to sound friendly and polite.",
          "Drill: `Password Wi-Fi-nya apa?`",
        ],
      },
      {
        en: "Kopinya jangan terlalu manis, ya.",
        vi: "Cà phê đừng ngọt quá nhé.",
        pronunciation_focus: [
          "KO-pi-nya JA-ngan ter-LA-lu MA-nis, ya -- `jangan terlalu manis` = đừng ngọt quá.",
          "`jangan terlalu...` là mẫu gọi đồ uống rất hữu ích: `jangan terlalu manis`, `jangan terlalu banyak es`.",
          "Luyện: `Jangan terlalu manis.`",
        ],
        pronunciation_focus_en: [
          "KO-pi-nya JA-ngan ter-LA-loo MA-nis, ya -- `jangan terlalu manis` = not too sweet.",
          "`Jangan terlalu...` is useful for drink orders: `jangan terlalu manis`, `jangan terlalu banyak es`.",
          "Drill: `Jangan terlalu manis.`",
        ],
      },
      {
        en: "Baristanya bisa rekomendasi kopi yang ringan?",
        vi: "Barista có thể gợi ý loại cà phê nhẹ không?",
        pronunciation_focus: [
          "ba-RIS-ta-nya BI-sa re-ko-men-DA-si KO-pi yang RI-ngan -- `rekomendasi` = gợi ý/đề xuất; `ringan` = nhẹ.",
          "Lỗi người Việt: nói `kopi light` khi không cần. Từ Indonesia tự nhiên là `kopi yang ringan`.",
          "Luyện: `Bisa rekomendasi kopi yang ringan?`",
        ],
        pronunciation_focus_en: [
          "ba-RIS-ta-nya BEE-sa re-ko-men-DA-si KO-pi yang REE-ngan -- `rekomendasi` = recommend; `ringan` = light/mild.",
          "VN-speaker trap: saying `kopi light` when not needed. Natural Indonesian: `kopi yang ringan`.",
          "Drill: `Bisa rekomendasi kopi yang ringan?`",
        ],
      },
      {
        en: "Saya bayar di kasir setelah pesan.",
        vi: "Tôi trả tiền ở quầy thu ngân sau khi gọi món.",
        pronunciation_focus: [
          "SA-ya BA-yar di KA-sir se-TE-lah PE-san -- `kasir` = quầy thu ngân/thu ngân; `setelah` = sau khi.",
          "Nhớ `di kasir` = ở quầy thu ngân. Không dùng `ke kasir` nếu đang nói nơi thanh toán diễn ra.",
          "Luyện: `Saya bayar di kasir.`",
        ],
        pronunciation_focus_en: [
          "SA-ya BA-yar di KA-sir se-TE-lah PE-san -- `kasir` = cashier/cash register; `setelah` = after.",
          "Remember `di kasir` = at the cashier. Do not use `ke kasir` when describing where payment happens.",
          "Drill: `Saya bayar di kasir.`",
        ],
      },
      {
        en: "Boleh duduk lama kalau saya pesan lagi?",
        vi: "Tôi ngồi lâu được không nếu gọi thêm đồ?",
        pronunciation_focus: [
          "BO-leh DU-duk LA-ma KA-lau SA-ya PE-san LA-gi -- `duduk lama` = ngồi lâu; `pesan lagi` = gọi thêm.",
          "`boleh` hỏi xin phép, rất hợp khi muốn ngồi làm việc hoặc học lâu ở quán.",
          "Luyện: `Boleh duduk lama?`",
        ],
        pronunciation_focus_en: [
          "BO-leh DOO-duk LA-ma KA-lau SA-ya PE-san LA-gi -- `duduk lama` = sit/stay a long time; `pesan lagi` = order again.",
          "`Boleh` asks permission, useful when you want to work or study in a cafe for a long time.",
          "Drill: `Boleh duduk lama?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, `kedai kopi` và `kafe` là nơi uống cà phê, làm việc, học bài, hẹn bạn, hoặc `nongkrong`. Nhiều quán có Wi-Fi và ổ cắm, nhưng nếu ngồi lâu, lịch sự nhất là gọi thêm đồ. `Es kopi susu` là món rất phổ biến ở các chuỗi cà phê hiện đại. Khi gọi nhân viên, dùng `Mas` cho nam trẻ, `Mbak` cho nữ trẻ, `Pak/Bu` cho người lớn tuổi hơn.",
    cultural_notes_en:
      "In Indonesia, a `kedai kopi` or `kafe` is a place for coffee, work, study, meeting friends, or `nongkrong` (hanging out). Many cafes have Wi-Fi and power outlets, but if you stay long, ordering something else is polite. `Es kopi susu` is very popular in modern coffee chains. Address staff as `Mas` for a young man, `Mbak` for a young woman, and `Pak/Bu` for older adults.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt `pesan kopi` (gọi cà phê), `nongkrong` (ngồi chơi/tụ tập), `meja kosong` (bàn trống), `password Wi-Fi`, và `bayar di kasir` (trả ở quầy). Tiếng Indonesia không chia động từ, nên câu quán cà phê rất gọn: `Saya mau pesan...`, `Ada meja kosong?`, `Password Wi-Fi-nya apa?`",
    tip_advice_en:
      "Tip for Vietnamese speakers: separate `pesan kopi` (order coffee), `nongkrong` (hang out), `meja kosong` (empty table), `password Wi-Fi`, and `bayar di kasir` (pay at the cashier). Indonesian has no verb conjugation, so cafe sentences stay compact: `Saya mau pesan...`, `Ada meja kosong?`, `Password Wi-Fi-nya apa?`",
    vocabulary: [
      {
        cell_id: "c0ab7b83-1f00-49e6-a2a9-0b07e6a2b519",
        word: "kedai kopi",
        en: "coffee shop",
        vi: "quán cà phê",
        pos: "noun phrase",
        pronunciation_vi: "ke-DAI KO-pi",
        pronunciation_en: "ke-DAI KO-pi",
      },
      {
        cell_id: "d98c4341-0f64-445d-9604-e4e85fb1e053",
        word: "pesan kopi",
        en: "order coffee",
        vi: "gọi cà phê",
        pos: "verb phrase",
        pronunciation_vi: "PE-san KO-pi",
        pronunciation_en: "PE-san KO-pi",
      },
      {
        cell_id: "1ffce0c0-fbdd-4188-a652-e6fd5e9ee994",
        word: "es kopi susu",
        en: "iced milk coffee",
        vi: "cà phê sữa đá",
        pos: "noun phrase",
        pronunciation_vi: "es KO-pi SU-su",
        pronunciation_en: "es KO-pi SOO-soo",
      },
      {
        cell_id: "7c0c5312-3d44-4aed-9bb8-23bf373d3456",
        word: "barista",
        en: "barista",
        vi: "barista / người pha cà phê",
        pos: "noun",
        pronunciation_vi: "ba-RIS-ta",
        pronunciation_en: "ba-RIS-ta",
      },
      {
        cell_id: "c5c579a8-4bb0-47c8-b151-7f434f6b0c14",
        word: "nongkrong",
        en: "hang out",
        vi: "ngồi chơi / tụ tập",
        pos: "verb",
        pronunciation_vi: "NONG-krong",
        pronunciation_en: "NONG-krong",
      },
      {
        cell_id: "344cb4f4-66ed-47af-8058-3b9046e35381",
        word: "Wi-Fi",
        en: "Wi-Fi",
        vi: "Wi-Fi",
        pos: "noun",
        pronunciation_vi: "WAI-fai",
        pronunciation_en: "WAI-fai",
      },
      {
        cell_id: "39e6178c-bd18-43bf-9ce8-75a0a50dcb77",
        word: "meja kosong",
        en: "empty table",
        vi: "bàn trống",
        pos: "noun phrase",
        pronunciation_vi: "ME-ja KO-song",
        pronunciation_en: "ME-ja KO-song",
      },
      {
        cell_id: "a0b1c0b6-e312-4d7c-ac2c-9d2402ef6563",
        word: "bayar di kasir",
        en: "pay at the cashier",
        vi: "trả tiền ở quầy thu ngân",
        pos: "verb phrase",
        pronunciation_vi: "BA-yar di KA-sir",
        pronunciation_en: "BA-yar di KA-sir",
      },
      {
        cell_id: "af664970-bef1-4286-8239-1f2b23f7aa9e",
        word: "jangan terlalu manis",
        en: "not too sweet",
        vi: "đừng ngọt quá",
        pos: "phrase",
        pronunciation_vi: "JA-ngan ter-LA-lu MA-nis",
        pronunciation_en: "JA-ngan ter-LA-loo MA-nis",
      },
      {
        cell_id: "5454e197-0631-4b9d-abe8-e926e6c1e15e",
        word: "pesan lagi",
        en: "order again / order more",
        vi: "gọi thêm",
        pos: "verb phrase",
        pronunciation_vi: "PE-san LA-gi",
        pronunciation_en: "PE-san LA-gi",
      },
    ],
    dialogue: [
      {
        cell_id: "63209fb3-b3b8-4ea9-839f-a9dcacd4d488",
        speaker: "Pelanggan",
        text: "Mas, saya mau pesan es kopi susu satu.",
        vi: "Anh ơi, tôi muốn gọi một ly cà phê sữa đá.",
        en: "Sir, I want to order one iced milk coffee.",
      },
      {
        cell_id: "4b7fe2d8-608d-453d-b718-3a98fdc916ab",
        speaker: "Barista",
        text: "Mau gula normal atau tidak terlalu manis?",
        vi: "Muốn đường bình thường hay không quá ngọt?",
        en: "Do you want normal sugar or not too sweet?",
      },
      {
        cell_id: "8ac98a12-a5cc-442d-8c8d-eda388fe93b3",
        speaker: "Pelanggan",
        text: "Jangan terlalu manis, ya. Password Wi-Fi-nya apa?",
        vi: "Đừng ngọt quá nhé. Mật khẩu Wi-Fi là gì?",
        en: "Not too sweet, please. What is the Wi-Fi password?",
      },
      {
        cell_id: "fb6b8ff1-cad5-4089-b11f-86bc24428bbd",
        speaker: "Barista",
        text: "Password-nya ada di struk. Bayar di kasir dulu, ya.",
        vi: "Mật khẩu ở trên hóa đơn. Trả tiền ở quầy trước nhé.",
        en: "The password is on the receipt. Please pay at the cashier first.",
      },
      {
        cell_id: "04db353e-9733-45d7-956f-1a42ada3d166",
        speaker: "Pelanggan",
        text: "Baik. Ada meja kosong dekat colokan?",
        vi: "Vâng. Có bàn trống gần ổ cắm không?",
        en: "Okay. Is there an empty table near a power outlet?",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi muốn gọi một ly cà phê sữa đá.",
        prompt_en: "Translate into Indonesian: I want to order one iced milk coffee.",
        answer: "Saya mau pesan es kopi susu satu.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Password ____-nya apa, Mas?",
        prompt_en: "Fill in the blank: Password ____-nya apa, Mas?",
        answer: "Wi-Fi",
      },
      {
        type: "matching",
        prompt_vi: "Ghép từ với nghĩa đúng.",
        prompt_en: "Match each word with the correct meaning.",
        pairs: [
          ["kedai kopi", "quán cà phê / coffee shop"],
          ["nongkrong", "ngồi chơi / hang out"],
          ["meja kosong", "bàn trống / empty table"],
          ["bayar di kasir", "trả ở quầy / pay at the cashier"],
        ],
      },
    ],
    content:
      "Useful cafe chunks: `Saya mau pesan es kopi susu` (I want to order iced milk coffee), `Ada meja kosong?` (is there an empty table?), `Password Wi-Fi-nya apa?` (what is the Wi-Fi password?), `Jangan terlalu manis` (not too sweet), `Bayar di kasir` (pay at the cashier), and `Boleh duduk lama?` (may I stay a long time?).",
  },
];
