// Trash & Recycling Neighborhood Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file following the established Indonesian extra
// format. The `en` field holds TARGET-LANGUAGE Indonesian, `vi` holds the
// Vietnamese gloss, and pronunciation_focus carries Vietnamese L1 notes with
// English companion explanations in the same order.

type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

type IndonesianVocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type IndonesianDialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type IndonesianExercise = Record<string, unknown>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
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
    id: "indonesian_trash_recycling_neighborhood",
    level: "A2",
    category: "community",
    title_vi: "Rác, tái chế và vệ sinh khu phố",
    title_en: "Trash, recycling and neighborhood cleanliness",
    sentences: [
      {
        en: "Sampah di rumah saya dipilah dulu.",
        vi: "Rác ở nhà tôi được phân loại trước.",
        pronunciation_focus: [
          "SAM-pah di RU-mah SA-ya di-PI-lah DU-lu - `sampah` = rác; `dipilah` = được phân loại; `dulu` = trước đã.",
          "Lỗi người Việt: nói `pilah sampah` khi mô tả rác được phân loại. Với rác là chủ thể, dùng bị động `sampah dipilah`.",
          "Luyện: `Sampah dipilah dulu.`",
        ],
        pronunciation_focus_en: [
          "SAM-pah di ROO-mah SA-ya di-PEE-lah DOO-loo - `sampah` = trash; `dipilah` = sorted; `dulu` = first.",
          "VN-speaker trap: saying `pilah sampah` when the trash is the subject. Use passive `sampah dipilah`.",
          "Drill: `Sampah dipilah dulu.`",
        ],
      },
      {
        en: "Sampah organik dan anorganik jangan dicampur.",
        vi: "Rác hữu cơ và vô cơ đừng trộn lẫn.",
        pronunciation_focus: [
          "SAM-pah or-GA-nik dan an-or-GA-nik JA-ngan di-CAM-pur - `organik` = hữu cơ; `anorganik` = vô cơ; `dicampur` = bị trộn.",
          "Lỗi người Việt: dùng `tidak` để cấm. Lệnh cấm dùng `jangan`: `jangan dicampur`.",
          "Luyện: `Jangan dicampur.`",
        ],
        pronunciation_focus_en: [
          "SAM-pah or-GA-nik dan an-or-GA-nik JA-ngan di-CHAM-poor - `organik` = organic; `anorganik` = inorganic; `dicampur` = mixed.",
          "VN-speaker trap: using `tidak` for a prohibition. Negative commands use `jangan`: `jangan dicampur`.",
          "Drill: `Jangan dicampur.`",
        ],
      },
      {
        en: "Botol plastik bisa didaur ulang.",
        vi: "Chai nhựa có thể được tái chế.",
        pronunciation_focus: [
          "BO-tol PLAS-tik BI-sa di-DA-ur U-lang - `daur ulang` = tái chế; `didaur ulang` = được tái chế.",
          "Lỗi người Việt: nói `recycle` bằng tiếng Anh. Cụm Indonesia tự nhiên là `daur ulang`.",
          "Luyện: `Botol plastik bisa didaur ulang.`",
        ],
        pronunciation_focus_en: [
          "BO-tol PLAS-tik BEE-sa di-DA-oor OO-lang - `daur ulang` = recycling; `didaur ulang` = be recycled.",
          "VN-speaker trap: code-switching to English `recycle`. Natural Indonesian uses `daur ulang`.",
          "Drill: `Botol plastik bisa didaur ulang.`",
        ],
      },
      {
        en: "Petugas kebersihan datang setiap pagi.",
        vi: "Nhân viên vệ sinh đến mỗi sáng.",
        pronunciation_focus: [
          "pe-TU-gas ke-ber-SI-han DA-tang se-TI-ap PA-gi - `petugas kebersihan` = nhân viên vệ sinh; `setiap pagi` = mỗi sáng.",
          "Lỗi người Việt: gọi chung là `orang sampah`. Lịch sự và đúng hơn là `petugas kebersihan`.",
          "Luyện: `Petugas kebersihan datang pagi.`",
        ],
        pronunciation_focus_en: [
          "pe-TOO-gas ke-ber-SEE-han DA-tang se-TEE-ap PA-gi - `petugas kebersihan` = sanitation/cleaning worker; `setiap pagi` = every morning.",
          "VN-speaker trap: saying a blunt `orang sampah`. The polite, accurate phrase is `petugas kebersihan`.",
          "Drill: `Petugas kebersihan datang pagi.`",
        ],
      },
      {
        en: "Berapa iuran sampah per bulan?",
        vi: "Phí rác mỗi tháng là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa I-u-ran SAM-pah per BU-lan - `iuran` = khoản đóng góp/phí chung; `per bulan` = mỗi tháng.",
          "Lỗi người Việt: hỏi `apa iuran`. Hỏi số tiền luôn dùng `berapa`: `berapa iuran`.",
          "Luyện: `Berapa iuran sampah per bulan?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa EE-oo-ran SAM-pah per BOO-lan - `iuran` = dues/shared fee; `per bulan` = per month.",
          "VN-speaker trap: asking `apa iuran`. For an amount, use `berapa`: `berapa iuran`.",
          "Drill: `Berapa iuran sampah per bulan?`",
        ],
      },
      {
        en: "Hari Minggu warga gotong royong membersihkan selokan.",
        vi: "Chủ nhật cư dân cùng chung tay dọn cống rãnh.",
        pronunciation_focus: [
          "HA-ri MING-gu WAR-ga GO-tong RO-yong mem-ber-SIH-kan se-LO-kan - `gotong royong` = cùng chung tay; `selokan` = cống/rãnh.",
          "Lỗi người Việt: nói `membersih selokan`. Làm sạch cái gì cần `membersihkan` với đuôi `-kan`.",
          "Luyện: `Warga membersihkan selokan.`",
        ],
        pronunciation_focus_en: [
          "HA-ri MING-goo WAR-ga GO-tong RO-yong mem-ber-SEE-kan se-LO-kan - `gotong royong` = mutual aid; `selokan` = drainage ditch.",
          "VN-speaker trap: saying `membersih selokan`. Cleaning something takes `membersihkan` with `-kan`.",
          "Drill: `Warga membersihkan selokan.`",
        ],
      },
      {
        en: "Tolong jangan buang sampah sembarangan.",
        vi: "Làm ơn đừng vứt rác bừa bãi.",
        pronunciation_focus: [
          "TO-long JA-ngan BU-ang SAM-pah sem-ba-RA-ngan - `buang sampah` = vứt rác; `sembarangan` = bừa bãi.",
          "Lỗi người Việt: dùng `membuang` trong biển cấm ngắn. Câu nhắc hằng ngày tự nhiên là `jangan buang sampah sembarangan`.",
          "Luyện: `Jangan buang sampah sembarangan.`",
        ],
        pronunciation_focus_en: [
          "TO-long JA-ngan BOO-ang SAM-pah sem-ba-RA-ngan - `buang sampah` = throw away trash; `sembarangan` = carelessly/anywhere.",
          "VN-speaker trap: over-formalizing to `membuang` in a short warning. Daily reminders use `jangan buang sampah sembarangan`.",
          "Drill: `Jangan buang sampah sembarangan.`",
        ],
      },
      {
        en: "Lingkungan kita harus tetap bersih.",
        vi: "Môi trường/khu xóm của chúng ta phải luôn sạch.",
        pronunciation_focus: [
          "ling-KUNG-an KI-ta HA-rus TE-tap BER-sih - `lingkungan` = môi trường/khu vực sống; `tetap bersih` = giữ sạch.",
          "Lỗi người Việt: dịch `môi trường` chỉ là thiên nhiên. `Lingkungan` cũng có nghĩa khu dân cư xung quanh mình.",
          "Luyện: `Lingkungan kita tetap bersih.`",
        ],
        pronunciation_focus_en: [
          "ling-KOONG-an KEE-ta HA-rus TE-tap BER-sih - `lingkungan` = environment/surroundings; `tetap bersih` = stay clean.",
          "VN-speaker trap: thinking `environment` only means nature. `Lingkungan` also means the neighborhood around you.",
          "Drill: `Lingkungan kita tetap bersih.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở nhiều khu dân cư Indonesia, rác được thu bởi `petugas kebersihan` của RT/RW hoặc khu nhà, và cư dân đóng `iuran sampah` hàng tháng. Một số nơi có phân loại `organik` và `anorganik`, hoặc gửi chai/giấy đến `bank sampah`. `Gotong royong` và `kerja bakti` là hoạt động cộng đồng quen thuộc để dọn đường, selokan và khu chung.",
    cultural_notes_en:
      "In many Indonesian neighborhoods, trash is collected by RT/RW or building `petugas kebersihan`, and residents pay monthly `iuran sampah`. Some areas separate `organik` and `anorganik`, or send bottles/paper to a `bank sampah` recycling program. `Gotong royong` and `kerja bakti` are common community clean-up activities for streets, drains, and shared areas.",
    tip_advice_vi:
      "Mẹo cho người Việt: học ba cụm cố định `buang sampah` (vứt rác), `pilah sampah` (phân loại rác), `daur ulang` (tái chế). Khi nhắc nhở lịch sự, dùng `tolong jangan ...`; khi nói rác được xử lý, dùng bị động `dipilah`, `dicampur`, `didaur ulang`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn three fixed phrases: `buang sampah` (throw away trash), `pilah sampah` (sort trash), and `daur ulang` (recycle). For polite reminders, use `tolong jangan ...`; when the trash is being handled, use passives like `dipilah`, `dicampur`, `didaur ulang`.",
    vocabulary: [
      {
        cell_id: "8ca83847-caf4-4306-9c98-c3e62d4818df",
        word: "sampah",
        en: "trash / garbage",
        vi: "rác",
        pos: "noun",
        pronunciation_vi: "SAM-pah",
        pronunciation_en: "SAM-pah",
      },
      {
        cell_id: "2e3eb835-a1e7-47be-9c16-9606db3c1b74",
        word: "daur ulang",
        en: "recycling / recycle",
        vi: "tái chế",
        pos: "noun / verb phrase",
        pronunciation_vi: "DA-ur U-lang",
        pronunciation_en: "DA-oor OO-lang",
      },
      {
        cell_id: "d8b547cf-3a5e-47c0-ad08-af356623b8fa",
        word: "organik",
        en: "organic",
        vi: "hữu cơ",
        pos: "adjective",
        pronunciation_vi: "or-GA-nik",
        pronunciation_en: "or-GA-nik",
      },
      {
        cell_id: "db044c4b-a1eb-4612-9267-b7a5c60d1c58",
        word: "anorganik",
        en: "inorganic",
        vi: "vô cơ",
        pos: "adjective",
        pronunciation_vi: "an-or-GA-nik",
        pronunciation_en: "an-or-GA-nik",
      },
      {
        cell_id: "7f3f64e1-5709-4d6f-9521-9e87c34e196c",
        word: "petugas kebersihan",
        en: "sanitation worker / cleaner",
        vi: "nhân viên vệ sinh",
        pos: "noun phrase",
        pronunciation_vi: "pe-TU-gas ke-ber-SI-han",
        pronunciation_en: "pe-TOO-gas ke-ber-SEE-han",
      },
      {
        cell_id: "ba79ca04-43fc-45ee-9b1b-809c4c5515b2",
        word: "iuran",
        en: "dues / shared fee",
        vi: "phí đóng góp",
        pos: "noun",
        pronunciation_vi: "I-u-ran",
        pronunciation_en: "EE-oo-ran",
      },
      {
        cell_id: "4f065cf2-27a6-459c-a122-4796595bc229",
        word: "gotong royong",
        en: "mutual aid / communal work",
        vi: "cùng chung tay / lao động cộng đồng",
        pos: "noun phrase",
        pronunciation_vi: "GO-tong RO-yong",
        pronunciation_en: "GO-tong RO-yong",
      },
      {
        cell_id: "34e4475e-7771-402e-b28b-fc6d14dd8f5f",
        word: "lingkungan",
        en: "environment / neighborhood",
        vi: "môi trường / khu xóm",
        pos: "noun",
        pronunciation_vi: "ling-KUNG-an",
        pronunciation_en: "ling-KOONG-an",
      },
      {
        cell_id: "1756d257-122e-42ee-9b8f-3ab81305dac4",
        word: "selokan",
        en: "drainage ditch",
        vi: "cống rãnh",
        pos: "noun",
        pronunciation_vi: "se-LO-kan",
        pronunciation_en: "se-LO-kan",
      },
    ],
    dialogue: [
      {
        cell_id: "6ca4b7cc-efcf-4168-b596-76601661d092",
        speaker: "Tetangga",
        text: "Permisi, sampah organik dibuang di mana?",
        vi: "Xin hỏi, rác hữu cơ bỏ ở đâu ạ?",
        en: "Excuse me, where should organic trash be thrown away?",
      },
      {
        cell_id: "aed477f4-0483-4057-ae90-bf21c1fa092f",
        speaker: "Pak RT",
        text: "Yang organik di tong hijau, yang anorganik di tong kuning.",
        vi: "Rác hữu cơ vào thùng xanh lá, rác vô cơ vào thùng vàng.",
        en: "Organic goes in the green bin, inorganic in the yellow bin.",
      },
      {
        cell_id: "59502bfb-6454-45f8-95c3-6bc728c30dd4",
        speaker: "Tetangga",
        text: "Berapa iuran sampah per bulan, Pak?",
        vi: "Phí rác mỗi tháng là bao nhiêu, chú?",
        en: "How much is the monthly trash fee, sir?",
      },
      {
        cell_id: "b87a670c-b9ac-46fe-a1d9-79ac46935b71",
        speaker: "Pak RT",
        text: "Dua puluh ribu. Hari Minggu juga ada gotong royong bersih-bersih selokan.",
        vi: "Hai mươi nghìn. Chủ nhật cũng có buổi cùng dọn cống rãnh.",
        en: "Twenty thousand. On Sunday there is also a community clean-up of the drains.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Botol plastik bisa ___ ulang.`",
        prompt_en: "Fill in the blank: `Botol plastik bisa ___ ulang.`",
        answer: "didaur",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Đừng vứt rác bừa bãi.",
        prompt_en: "Translate into Indonesian: Do not throw trash carelessly.",
        answer: "Jangan buang sampah sembarangan.",
      },
      {
        type: "matching",
        prompt_vi: "Nối nghĩa đúng.",
        prompt_en: "Match the meanings.",
        pairs: [
          ["sampah", "rác"],
          ["daur ulang", "tái chế"],
          ["petugas kebersihan", "nhân viên vệ sinh"],
          ["iuran", "phí đóng góp"],
          ["lingkungan", "môi trường / khu xóm"],
        ],
      },
    ],
  },
];
