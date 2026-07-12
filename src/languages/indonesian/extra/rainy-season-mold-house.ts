// Rainy Season Mold House Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for rainy-season home maintenance: damp
// walls, mold, roof leaks, ventilation, cleaning, musty smell, and repairs.
// Indonesian target text lives in `en`, Vietnamese glosses in `vi`, Vietnamese
// L1 notes in `pronunciation_focus`, and English companions in
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

export const rainySeasonMoldHouseLessons: IndonesianLesson[] = [
  {
    id: "indonesian_rainy_season_mold_house",
    level: "A2",
    category: "home_living",
    title_vi: "Mùa mưa: nhà ẩm, mốc và dột",
    title_en: "Rainy season: damp house, mold, and leaks",
    sentences: [
      {
        en: "Musim hujan ini rumah jadi lembap sekali.",
        vi: "Mùa mưa này nhà trở nên rất ẩm.",
        pronunciation_focus: [
          "mu-SIM HU-jan - `musim hujan` = mùa mưa.",
          "`lembap` = ẩm ướt; dùng cho không khí, tường, phòng, nhà.",
          "Lỗi người Việt: nói `basah sekali` cho mọi thứ. `Basah` là ướt; không khí và tường thường là `lembap`.",
          "Luyện: `Rumah jadi lembap sekali.`",
        ],
        pronunciation_focus_en: [
          "moo-SIM HOO-jan - `musim hujan` = rainy season.",
          "`lembap` = damp/humid; used for air, walls, rooms, and houses.",
          "VN-speaker trap: using `basah sekali` for everything. `Basah` = wet; air and walls are often `lembap`.",
          "Drill: `Rumah jadi lembap sekali.`",
        ],
      },
      {
        en: "Dinding kamar belakang mulai berjamur.",
        vi: "Tường phòng phía sau bắt đầu bị mốc.",
        pronunciation_focus: [
          "ber-JA-mur - `berjamur` = bị nấm mốc/phủ mốc.",
          "`dinding kamar` = tường phòng; `mulai` = bắt đầu.",
          "Lỗi người Việt: nói `jamur di dinding` được, nhưng khi mô tả tình trạng, `berjamur` ngắn và tự nhiên hơn.",
          "Luyện: `Dinding mulai berjamur.`",
        ],
        pronunciation_focus_en: [
          "ber-JAH-moor - `berjamur` = moldy / covered with mold.",
          "`dinding kamar` = room wall; `mulai` = begin.",
          "VN-speaker trap: `jamur di dinding` is understandable, but as a condition `berjamur` is shorter and more natural.",
          "Drill: `Dinding mulai berjamur.`",
        ],
      },
      {
        en: "Atapnya bocor saat hujan deras.",
        vi: "Mái nhà bị dột khi trời mưa lớn.",
        pronunciation_focus: [
          "a-TAP-nya BO-cor - `bocor` = rò rỉ/dột; dùng cho mái, pipa, ember, gas.",
          "`saat hujan deras` = khi mưa lớn; `deras` = mạnh, nặng hạt.",
          "Lỗi người Việt: nói `atap rusak air masuk` dài dòng. Với mái nhà, từ đúng là `bocor`.",
          "Luyện: `Atap bocor saat hujan deras.`",
        ],
        pronunciation_focus_en: [
          "a-TAHP-nya BOH-chor - `bocor` = leak; used for roofs, pipes, buckets, gas.",
          "`saat hujan deras` = during heavy rain; `deras` = strong/intense.",
          "VN-speaker trap: verbose `atap rusak air masuk`. For roofs, the correct word is `bocor`.",
          "Drill: `Atap bocor saat hujan deras.`",
        ],
      },
      {
        en: "Kami perlu memperbaiki ventilasi supaya udara lebih lancar.",
        vi: "Chúng tôi cần sửa thông gió để không khí lưu thông tốt hơn.",
        pronunciation_focus: [
          "ven-ti-LA-si - `ventilasi` = thông gió.",
          "`supaya` = để/nhằm; rất tự nhiên khi giải thích mục đích.",
          "`udara lebih lancar` = không khí lưu thông tốt hơn; `lancar` = trôi chảy/thông suốt.",
          "Luyện: `Kami perlu memperbaiki ventilasi.`",
        ],
        pronunciation_focus_en: [
          "ven-ti-LA-si - `ventilation` / `ventilasi` = air circulation.",
          "`supaya` = so that / in order to; natural for explaining purpose.",
          "`udara lebih lancar` = air flows better; `lancar` = smooth/flowing.",
          "Drill: `Kami perlu memperbaiki ventilasi.`",
        ],
      },
      {
        en: "Kalau ruangan tertutup, bau apek muncul lebih cepat.",
        vi: "Nếu phòng kín, mùi ẩm mốc sẽ xuất hiện nhanh hơn.",
        pronunciation_focus: [
          "ba-u A-pek - `bau apek` = mùi ẩm mốc, mùi hôi do kín/ẩm.",
          "`ruangan tertutup` = phòng kín; `tertutup` = đóng/kín.",
          "Lỗi người Việt: nói `bau busuk` cho mọi mùi khó chịu. `Apek` rất chuẩn khi nói nhà ẩm, quần áo cất lâu, phòng kín.",
          "Luyện: `Bau apek muncul lebih cepat.`",
        ],
        pronunciation_focus_en: [
          "BAH-oo AH-pek - `bau apek` = musty smell caused by dampness or closed rooms.",
          "`ruangan tertutup` = closed room; `tertutup` = closed/sealed.",
          "VN-speaker trap: `bau busuk` for every bad smell. `Apek` is the right word for damp houses, stored clothes, and closed rooms.",
          "Drill: `Bau apek muncul lebih cepat.`",
        ],
      },
      {
        en: "Saya sudah membersihkan jamur dengan cairan pembersih.",
        vi: "Tôi đã dọn sạch mốc bằng dung dịch tẩy rửa.",
        pronunciation_focus: [
          "mem-ber-SIH-kan - `membersihkan` = làm sạch/dọn sạch.",
          "`jamur` = nấm mốc; `cairan pembersih` = dung dịch làm sạch.",
          "Lỗi người Việt: nói `hapus jamur` nghe chưa chuẩn. Với việc làm sạch, `membersihkan` tự nhiên hơn.",
          "Luyện: `Saya membersihkan jamur.`",
        ],
        pronunciation_focus_en: [
          "mem-ber-SEEH-kan - `membersihkan` = clean/clean up.",
          "`jamur` = mold; `cairan pembersih` = cleaning liquid.",
          "VN-speaker trap: `hapus jamur` sounds less natural. For cleaning, `membersihkan` is better.",
          "Drill: `Saya membersihkan jamur.`",
        ],
      },
      {
        en: "Kami harus mengecat ulang dinding yang rusak.",
        vi: "Chúng tôi phải sơn lại bức tường bị hỏng.",
        pronunciation_focus: [
          "meN-ge-CAT u-LANG - `mengecat ulang` = sơn lại.",
          "`dinding yang rusak` = bức tường bị hỏng; `yang` nối mệnh đề mô tả.",
          "Lỗi người Việt: nói `cat lagi` được hiểu, nhưng `mengecat ulang` là cách nói rõ ràng hơn trong sửa nhà.",
          "Luyện: `Kami harus mengecat ulang dinding.`",
        ],
        pronunciation_focus_en: [
          "mehn-ge-CHAT oo-LANG - `mengecat ulang` = repaint.",
          "`dinding yang rusak` = damaged wall; `yang` links the descriptive clause.",
          "VN-speaker trap: `cat lagi` is understood, but `mengecat ulang` is clearer in home repair contexts.",
          "Drill: `Kami harus mengecat ulang dinding.`",
        ],
      },
      {
        en: "Tolong buka jendela supaya kamar tidak terlalu lembap.",
        vi: "Làm ơn mở cửa sổ để phòng không quá ẩm.",
        pronunciation_focus: [
          "jen-DE-la - `jendela` = cửa sổ.",
          "`tidak terlalu lembap` = không quá ẩm; `terlalu` = quá/mức độ cao hơn mức cần.",
          "Lỗi người Việt: dùng `dingin` hay `basah` cho phòng ẩm. Khi nói về độ ẩm, dùng `lembap`.",
          "Luyện: `Buka jendela supaya kamar tidak lembap.`",
        ],
        pronunciation_focus_en: [
          "jen-DEH-lah - `jendela` = window.",
          "`tidak terlalu lembap` = not too damp; `terlalu` = too much / overly.",
          "VN-speaker trap: using `dingin` or `basah` for humidity. For moisture, use `lembap`.",
          "Drill: `Buka jendela supaya kamar tidak lembap.`",
        ],
      },
      {
        en: "Saya mencium bau apek dari lemari pakaian.",
        vi: "Tôi ngửi thấy mùi ẩm mốc từ tủ quần áo.",
        pronunciation_focus: [
          "me-NCI-um - `mencium` = ngửi thấy.",
          "`lemari pakaian` = tủ quần áo; thường bị ẩm trong mùa hujan.",
          "Lỗi người Việt: nói `bau dari closet` trộn tiếng Anh. `Lemari pakaian` là cách nói tự nhiên.",
          "Luyện: `Saya mencium bau apek.`",
        ],
        pronunciation_focus_en: [
          "mehn-CHEE-oom - `mencium` = smell / detect by smell.",
          "`lemari pakaian` = wardrobe/clothes cabinet; often gets damp in rainy season.",
          "VN-speaker trap: mixing English `closet`. `Lemari pakaian` is the natural Indonesian phrase.",
          "Drill: `Saya mencium bau apek.`",
        ],
      },
      {
        en: "Kalau perlu, panggil tukang untuk perbaikan atap.",
        vi: "Nếu cần, hãy gọi thợ sửa mái nhà.",
        pronunciation_focus: [
          "pang-GIL TU-kang - `panggil tukang` = gọi thợ.",
          "`perbaikan atap` = việc sửa mái nhà; `perbaikan` là danh từ trang trọng.",
          "Lỗi người Việt: dùng `servis atap`. Với nhà cửa, `perbaikan` hoặc `memperbaiki` tự nhiên hơn.",
          "Luyện: `Panggil tukang untuk perbaikan atap.`",
        ],
        pronunciation_focus_en: [
          "pang-GEEL TOO-kang - `panggil tukang` = call a repair worker.",
          "`perbaikan atap` = roof repair; `perbaikan` is the formal noun.",
          "VN-speaker trap: using `servis atap`. For home repairs, `perbaikan` or `memperbaiki` sounds more natural.",
          "Drill: `Panggil tukang untuk perbaikan atap.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Vào mùa hujan ở Indonesia, nhà ẩm, tường mốc, mái dột, và mùi apek là chuyện rất thường gặp. Người ta thường xử lý bằng cách mở ventilasi, lau sạch dinding yang berjamur, kiểm tra atap bocor, rồi gọi tukang nếu cần. Trong hội thoại sửa nhà, các từ `lembap`, `bocor`, `berjamur`, `ventilasi`, và `bau apek` rất tự nhiên.",
    cultural_notes_en:
      "During the rainy season in Indonesia, damp rooms, moldy walls, roof leaks, and musty smells are very common. People usually deal with them by opening ventilation, cleaning moldy walls, checking for roof leaks, and calling a repair worker if needed. In home-repair conversation, words like `lembap`, `bocor`, `berjamur`, `ventilasi`, and `bau apek` sound natural.",
    tip_advice_vi:
      "Mẫu hữu ích: `Rumah jadi lembap`, `Atapnya bocor`, `Dinding berjamur`, `Bau apek muncul`, `Tolong buka jendela`. Với nhà ẩm mốc, `lembap` mô tả độ ẩm, `berjamur` mô tả tình trạng bị mốc, và `bocor` dùng cho mái, ống, hoặc chỗ rò nước.",
    tip_advice_en:
      "Useful patterns: `Rumah jadi lembap`, `Atapnya bocor`, `Dinding berjamur`, `Bau apek muncul`, `Tolong buka jendela`. For damp homes, `lembap` describes humidity, `berjamur` describes the moldy condition, and `bocor` is used for roofs, pipes, or leaks.",
    vocabulary: [
      {
        cell_id: "c4213b73-38fb-4d01-aae7-ceb634090d10",
        word: "musim hujan",
        en: "rainy season",
        vi: "mùa mưa",
        pos: "noun phrase",
        pronunciation_vi: "mu-SIM HU-jan",
        pronunciation_en: "moo-SIM HOO-jan",
      },
      {
        cell_id: "06fff362-69bb-4aba-9d08-b1c787b2b6b3",
        word: "lembap",
        en: "damp / humid",
        vi: "ẩm",
        pos: "adjective",
        pronunciation_vi: "lem-BAP",
        pronunciation_en: "lem-BUP",
      },
      {
        cell_id: "3abf92e8-ac79-46c3-943b-08cedcaf8d34",
        word: "berjamur",
        en: "moldy",
        vi: "bị mốc",
        pos: "adjective",
        pronunciation_vi: "ber-JA-mur",
        pronunciation_en: "ber-JAH-moor",
      },
      {
        cell_id: "f5f6b161-310e-47a1-b642-f44136cd0968",
        word: "bocor",
        en: "leaking",
        vi: "bị dột / rò rỉ",
        pos: "adjective",
        pronunciation_vi: "BO-cor",
        pronunciation_en: "BOH-chor",
      },
      {
        cell_id: "bd394199-7d52-4a88-9011-d255e4bead64",
        word: "ventilasi",
        en: "ventilation",
        vi: "thông gió",
        pos: "noun",
        pronunciation_vi: "ven-ti-LA-si",
        pronunciation_en: "ven-ti-LA-si",
      },
      {
        cell_id: "d1c0e0b4-6594-42d4-97dd-24d543301732",
        word: "bau apek",
        en: "musty smell",
        vi: "mùi ẩm mốc",
        pos: "noun phrase",
        pronunciation_vi: "ba-u A-pek",
        pronunciation_en: "BAH-oo AH-pek",
      },
      {
        cell_id: "4ecebe8d-64f3-4c71-a5d4-14a6b756731a",
        word: "membersihkan",
        en: "to clean / clean up",
        vi: "làm sạch, dọn sạch",
        pos: "verb",
        pronunciation_vi: "mem-ber-SIH-kan",
        pronunciation_en: "mem-ber-SEEH-kan",
      },
      {
        cell_id: "cc0b4f88-0e55-468a-bc85-a6e54b701f32",
        word: "mengecat ulang",
        en: "to repaint",
        vi: "sơn lại",
        pos: "verb phrase",
        pronunciation_vi: "meN-ge-CAT u-LANG",
        pronunciation_en: "mehn-ge-CHAT oo-LANG",
      },
      {
        cell_id: "82c29bb1-ba1f-4ac0-8494-5d566719a91c",
        word: "jendela",
        en: "window",
        vi: "cửa sổ",
        pos: "noun",
        pronunciation_vi: "jen-DE-la",
        pronunciation_en: "jen-DEH-lah",
      },
      {
        cell_id: "f5ad1101-9448-40bf-9da7-63fb6b068f27",
        word: "lemari pakaian",
        en: "wardrobe / clothes cabinet",
        vi: "tủ quần áo",
        pos: "noun phrase",
        pronunciation_vi: "le-MA-ri pa-KAI-an",
        pronunciation_en: "leh-MA-ree pah-KAI-ahn",
      },
    ],
    dialogue: [
      {
        cell_id: "5859e5ff-e958-44f5-a9f2-2303a09c40fd",
        speaker: "Pemilik rumah",
        text: "Musim hujan ini rumah jadi lembap sekali.",
        vi: "Mùa mưa này nhà trở nên rất ẩm.",
        en: "This rainy season, the house has become very damp.",
      },
      {
        cell_id: "7726151d-5d6d-40b6-b3be-36184479a8c1",
        speaker: "Tukang",
        text: "Saya lihat dinding belakang mulai berjamur.",
        vi: "Tôi thấy tường phía sau bắt đầu bị mốc.",
        en: "I can see the back wall is starting to get moldy.",
      },
      {
        cell_id: "4124e431-4143-4020-b594-ca1ba27ac4eb",
        speaker: "Pemilik rumah",
        text: "Atapnya juga bocor saat hujan deras.",
        vi: "Mái nhà cũng bị dột khi mưa lớn.",
        en: "The roof also leaks during heavy rain.",
      },
      {
        cell_id: "4520b3b8-d697-4af3-bd7d-e26adda5ee46",
        speaker: "Tukang",
        text: "Baik, kita perbaiki atap dan cek ventilasi supaya udara lebih lancar.",
        vi: "Được, chúng ta sửa mái và kiểm tra thông gió để không khí lưu thông tốt hơn.",
        en: "Okay, we will repair the roof and check the ventilation so the air flows better.",
      },
      {
        cell_id: "66ee4d93-f0fd-4c05-9a8d-c267d2649a0a",
        speaker: "Pemilik rumah",
        text: "Saya juga mencium bau apek dari lemari pakaian.",
        vi: "Tôi cũng ngửi thấy mùi ẩm mốc từ tủ quần áo.",
        en: "I also smell a musty odor from the wardrobe.",
      },
      {
        cell_id: "2b52f86e-c4f8-44d1-97b2-faabaeedd96f",
        speaker: "Tukang",
        text: "Tolong buka jendela dan bersihkan jamurnya dulu.",
        vi: "Làm ơn mở cửa sổ và dọn sạch mốc trước đã.",
        en: "Please open the windows and clean the mold first.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt: "Translate into Indonesian: Nhà trở nên rất ẩm vào mùa mưa này.",
        answer: "Musim hujan ini rumah jadi lembap sekali.",
      },
      {
        type: "translation",
        prompt: "Translate into Vietnamese: Atapnya bocor saat hujan deras.",
        answer: "Mái nhà bị dột khi trời mưa lớn.",
      },
      {
        type: "fill_blank",
        prompt: "Dinding kamar belakang mulai ____.",
        answer: "berjamur",
      },
      {
        type: "fill_blank",
        prompt: "Tolong buka ____ supaya kamar tidak terlalu lembap.",
        answer: "jendela",
      },
      {
        type: "matching",
        prompt: "Match the Indonesian phrase to the meaning.",
        pairs: [
          ["lembap", "damp / ẩm"],
          ["bau apek", "musty smell / mùi ẩm mốc"],
          ["ventilasi", "ventilation / thông gió"],
          ["mengecat ulang", "repaint / sơn lại"],
        ],
      },
    ],
  },
];

export default rainySeasonMoldHouseLessons;
