// Construction Site Safety Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for construction-site safety: project
// helmets, danger zones, supervisors, workers, falling materials, entry
// permission, and incident reports. Indonesian target text lives in `en`,
// Vietnamese glosses in `vi`, Vietnamese L1 notes in `pronunciation_focus`,
// and English companions in `pronunciation_focus_en`.

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
  speaker: string;
  /** Indonesian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
  en?: string;
};

// Loosely typed so per-type fields (translation, fill_blank, matching) can vary.
export type IndonesianExercise = Record<string, any>;

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

export const constructionSiteSafetyLessons: IndonesianLesson[] = [
  {
    id: "indonesian_construction_site_safety",
    level: "A2",
    category: "workplace_safety",
    title_vi: "An toàn ở công trường xây dựng",
    title_en: "Construction site safety",
    sentences: [
      {
        en: "Semua pekerja wajib memakai helm proyek di area bangunan.",
        vi: "Tất cả công nhân bắt buộc phải đội mũ bảo hộ ở khu vực công trình.",
        pronunciation_focus: [
          "he-lm pro-yek - `helm proyek` = mũ bảo hộ công trình.",
          "`wajib memakai` = bắt buộc phải mặc/đội/dùng; mạnh hơn `harus` trong quy định.",
          "Lỗi người Việt: nói `pakai safety` nghe được, nhưng trong công trường nên dùng `helm proyek` hoặc `APD`.",
          "Luyện: `Semua pekerja wajib memakai helm proyek.`",
        ],
        pronunciation_focus_en: [
          "helm pro-yek - `helm proyek` = construction helmet / hard hat.",
          "`wajib memakai` = required to wear/use; stronger than `harus` in rules.",
          "VN-speaker trap: `pakai safety` is understood, but on a construction site use `helm proyek` or `APD`.",
          "Drill: `Semua pekerja wajib memakai helm proyek.`",
        ],
      },
      {
        en: "Jangan masuk ke area bahaya tanpa izin mandor.",
        vi: "Đừng vào khu vực nguy hiểm khi chưa có phép của quản lý công trường.",
        pronunciation_focus: [
          "JA-ngan MA-suk ke A-re-a BA-ha-ya - `jangan` = đừng/cấm; dùng cho biển cảnh báo.",
          "`izin mandor` = phép của người phụ trách; `mandor` thường là đội trưởng/giám sát công trường.",
          "Lỗi người Việt: dùng `tidak masuk` chỉ là không vào. Lệnh cấm phải dùng `jangan masuk`.",
          "Luyện: `Jangan masuk ke area bahaya.`",
        ],
        pronunciation_focus_en: [
          "JA-ngan MA-sook ke AH-re-ah BAH-hah-yah - `jangan` = do not / forbidden; used for warning signs.",
          "`izin mandor` = the supervisor's permission; `mandor` is often the site foreman.",
          "VN-speaker trap: `tidak masuk` only says not entering. A prohibition uses `jangan masuk`.",
          "Drill: `Jangan masuk ke area bahaya.`",
        ],
      },
      {
        en: "Mandor mengingatkan kami untuk berhati-hati di dekat alat berat.",
        vi: "Quản lý nhắc chúng tôi phải cẩn thận gần máy móc nặng.",
        pronunciation_focus: [
          "MAN-dor me-ngi-NGAT-kan - `mengingatkan` = nhắc nhở.",
          "`alat berat` = máy móc nặng; đây là cụm rất phổ biến ở công trường.",
          "`berhati-hati` = cẩn thận; trạng thái/tính chất chứ không phải danh từ.",
          "Luyện: `Mandor mengingatkan kami untuk berhati-hati.`",
        ],
        pronunciation_focus_en: [
          "MAN-dor me-ngi-NGAT-kan - `mengingatkan` = remind / warn.",
          "`alat berat` = heavy machinery; very common construction wording.",
          "`berhati-hati` = be careful; a state/quality, not a noun.",
          "Drill: `Mandor mengingatkan kami untuk berhati-hati.`",
        ],
      },
      {
        en: "Ada material jatuh dari lantai atas.",
        vi: "Có vật liệu rơi từ tầng trên xuống.",
        pronunciation_focus: [
          "ma-te-ri-AL ja-TUH - `material` = vật liệu; `jatuh` = rơi/ngã.",
          "`dari lantai atas` = từ tầng trên; `dari` = từ.",
          "Lỗi người Việt: nói `turun dari atas` dài dòng. Với đồ rơi, `material jatuh` ngắn và tự nhiên hơn.",
          "Luyện: `Ada material jatuh dari lantai atas.`",
        ],
        pronunciation_focus_en: [
          "mah-te-ree-AHL jah-TOO - `material` = materials; `jatuh` = fall/drop.",
          "`dari lantai atas` = from the upper floor; `dari` = from.",
          "VN-speaker trap: over-saying `turun dari atas`. For falling objects, `material jatuh` is shorter and natural.",
          "Drill: `Ada material jatuh dari lantai atas.`",
        ],
      },
      {
        en: "Tolong beri tanda di area yang berbahaya.",
        vi: "Làm ơn đánh dấu ở khu vực nguy hiểm.",
        pronunciation_focus: [
          "be-RI TAN-da - `beri tanda` = đánh dấu/đặt dấu hiệu.",
          "`area yang berbahaya` = khu vực nguy hiểm; `yang` nối mệnh đề phụ.",
          "Lỗi người Việt: dùng `buat tanda` vẫn hiểu, nhưng `beri tanda` tự nhiên hơn trong chỉ dẫn.",
          "Luyện: `Beri tanda di area berbahaya.`",
        ],
        pronunciation_focus_en: [
          "be-REE TAN-dah - `beri tanda` = mark / place a sign.",
          "`area yang berbahaya` = the dangerous area; `yang` links a relative clause.",
          "VN-speaker trap: `buat tanda` is understood, but `beri tanda` sounds more natural in instructions.",
          "Drill: `Beri tanda di area berbahaya.`",
        ],
      },
      {
        en: "Kami harus melapor ke supervisor sebelum mulai kerja.",
        vi: "Chúng tôi phải báo cáo với giám sát trước khi bắt đầu làm việc.",
        pronunciation_focus: [
          "me-la-POR ke su-per-VAI-sor - `melapor` = báo cáo/báo với ai đó.",
          "`sebelum mulai kerja` = trước khi bắt đầu làm; `mulai` = bắt đầu.",
          "Lỗi người Việt: nói `lapor ke bos` được hiểu, nhưng trong công trường `supervisor` hoặc `mandor` rõ hơn.",
          "Luyện: `Kami harus melapor ke supervisor.`",
        ],
        pronunciation_focus_en: [
          "me-la-POOR ke soo-per-VAI-sor - `melapor` = report / inform.",
          "`sebelum mulai kerja` = before starting work; `mulai` = begin.",
          "VN-speaker trap: `lapor ke bos` may be understood, but on site `supervisor` or `mandor` is clearer.",
          "Drill: `Kami harus melapor ke supervisor.`",
        ],
      },
      {
        en: "Jika ada kecelakaan, segera buat laporan insiden.",
        vi: "Nếu có tai nạn, hãy lập báo cáo sự cố ngay.",
        pronunciation_focus: [
          "ke-ce-la-KA-an - `kecelakaan` = tai nạn.",
          "`laporan insiden` = báo cáo sự cố/tai nạn; cụm văn phòng-công trường rất thường dùng.",
          "`segera` = ngay lập tức; dùng tốt trong tình huống khẩn.",
          "Luyện: `Segera buat laporan insiden.`",
        ],
        pronunciation_focus_en: [
          "ke-che-la-KA-an - `kecelakaan` = accident.",
          "`laporan insiden` = incident report; common in workplace and site contexts.",
          "`segera` = immediately; useful in urgent situations.",
          "Drill: `Segera buat laporan insiden.`",
        ],
      },
      {
        en: "Pekerja baru harus ikut briefing keselamatan.",
        vi: "Công nhân mới phải tham gia buổi phổ biến an toàn.",
        pronunciation_focus: [
          "bri-FING ke-se-la-MAT-an - `briefing keselamatan` = buổi phổ biến an toàn.",
          "`ikut` = tham gia; rất hay đi với rapat, briefing, pelatihan.",
          "Lỗi người Việt: dịch `nghe hướng dẫn` thành `dengar petunjuk`. Trong công sở/công trường, `ikut briefing` tự nhiên hơn.",
          "Luyện: `Pekerja baru harus ikut briefing keselamatan.`",
        ],
        pronunciation_focus_en: [
          "bree-FING ke-se-la-MAT-an - `briefing keselamatan` = safety briefing.",
          "`ikut` = attend/join; common with meetings, briefings, and training.",
          "VN-speaker trap: translating `listen to instructions` as `dengar petunjuk`. On site, `ikut briefing` sounds more natural.",
          "Drill: `Pekerja baru harus ikut briefing keselamatan.`",
        ],
      },
      {
        en: "Saya belum boleh masuk sebelum izin kerja keluar.",
        vi: "Tôi chưa được phép vào trước khi giấy phép làm việc được cấp.",
        pronunciation_focus: [
          "be-lum BO-leh MA-suk - `belum boleh` = chưa được phép.",
          "`izin kerja` = giấy phép làm việc/giấy phép vào làm việc.",
          "Lỗi người Việt: dùng `tidak boleh` khi ý là chưa tới lúc được phép. `Belum boleh` mềm và đúng hơn.",
          "Luyện: `Saya belum boleh masuk.`",
        ],
        pronunciation_focus_en: [
          "beh-lum BO-leh MAH-sook - `belum boleh` = not allowed yet.",
          "`izin kerja` = work permit / work authorization.",
          "VN-speaker trap: use `tidak boleh` when you mean it is not yet permitted. `Belum boleh` is softer and more precise.",
          "Drill: `Saya belum boleh masuk.`",
        ],
      },
      {
        en: "Tolong cek lagi apakah semua pekerja sudah pakai APD.",
        vi: "Làm ơn kiểm tra lại xem tất cả công nhân đã dùng đồ bảo hộ chưa.",
        pronunciation_focus: [
          "cek la-GI - `cek lagi` = kiểm tra lại.",
          "`sudah pakai APD` = đã dùng đồ bảo hộ; `APD` = alat pelindung diri.",
          "`apakah` mở câu hỏi gián tiếp, phù hợp khi nhờ kiểm tra.",
          "Luyện: `Tolong cek lagi apakah semua pekerja sudah pakai APD.`",
        ],
        pronunciation_focus_en: [
          "chek la-GEE - `cek lagi` = check again.",
          "`sudah pakai APD` = have already worn PPE; `APD` = personal protective equipment.",
          "`apakah` opens an indirect question, suitable when asking someone to verify.",
          "Drill: `Tolong cek lagi apakah semua pekerja sudah pakai APD.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở công trường Indonesia, từ khóa thực tế là `mandor`, `pekerja`, `helm proyek`, `APD`, `area bahaya`, `izin kerja`, và `laporan insiden`. Người ta thường nói ngắn, rõ, và ưu tiên mệnh lệnh an toàn như `jangan masuk`, `berhati-hati`, `segera lapor`. Nếu cần nhắc nhở, giọng lịch sự nhưng dứt khoát là chuẩn nhất.",
    cultural_notes_en:
      "On Indonesian construction sites, the practical keywords are `mandor`, `pekerja`, `helm proyek`, `APD`, `area bahaya`, `izin kerja`, and `laporan insiden`. People usually speak briefly and clearly, prioritizing safety commands like `jangan masuk`, `berhati-hati`, and `segera lapor`. When reminding someone, a polite but firm tone is the norm.",
    tip_advice_vi:
      "Mẫu hữu ích: `Jangan masuk...`, `Tolong beri tanda...`, `Kami harus melapor...`, `Saya belum boleh masuk...`. Khi nói về an toàn, dùng `jangan` cho cấm, `wajib` cho bắt buộc, `belum boleh` cho chưa được phép. Đừng dùng `tidak` thay cho mọi tình huống.",
    tip_advice_en:
      "Useful patterns: `Jangan masuk...`, `Tolong beri tanda...`, `Kami harus melapor...`, `Saya belum boleh masuk...`. For safety, use `jangan` for prohibition, `wajib` for mandatory rules, and `belum boleh` for not-yet-allowed. Do not replace everything with `tidak`.",
    vocabulary: [
      {
        word: "helm proyek",
        en: "construction helmet / hard hat",
        vi: "mũ bảo hộ công trình",
        pos: "noun phrase",
        pronunciation_vi: "helm pro-yek",
        pronunciation_en: "helm PRO-yek",
      },
      {
        word: "area bahaya",
        en: "danger zone",
        vi: "khu vực nguy hiểm",
        pos: "noun phrase",
        pronunciation_vi: "A-re-a BA-ha-ya",
        pronunciation_en: "AH-re-ah BAH-hah-yah",
      },
      {
        word: "mandor",
        en: "foreman / site supervisor",
        vi: "quản lý công trường",
        pos: "noun",
        pronunciation_vi: "MAN-dor",
        pronunciation_en: "MAN-dor",
      },
      {
        word: "pekerja",
        en: "worker",
        vi: "công nhân, người lao động",
        pos: "noun",
        pronunciation_vi: "pe-KER-ja",
        pronunciation_en: "pe-KER-jah",
      },
      {
        word: "material jatuh",
        en: "falling material",
        vi: "vật liệu rơi",
        pos: "noun phrase",
        pronunciation_vi: "ma-te-ri-AL ja-TUH",
        pronunciation_en: "mah-te-ree-AHL jah-TOO",
      },
      {
        word: "izin masuk",
        en: "entry permission",
        vi: "giấy phép vào, quyền vào",
        pos: "noun phrase",
        pronunciation_vi: "I-zin MA-suk",
        pronunciation_en: "EE-zeen MAH-sook",
      },
      {
        word: "laporan insiden",
        en: "incident report",
        vi: "báo cáo sự cố",
        pos: "noun phrase",
        pronunciation_vi: "la-PO-ran in-SI-den",
        pronunciation_en: "la-PO-ran in-SEE-den",
      },
      {
        word: "briefing keselamatan",
        en: "safety briefing",
        vi: "buổi phổ biến an toàn",
        pos: "noun phrase",
        pronunciation_vi: "bri-FING ke-se-la-MAT-an",
        pronunciation_en: "BREE-fing ke-se-la-MAT-an",
      },
      {
        word: "izin kerja",
        en: "work permit / work authorization",
        vi: "giấy phép làm việc",
        pos: "noun phrase",
        pronunciation_vi: "I-zin KER-ja",
        pronunciation_en: "EE-zeen KER-jah",
      },
      {
        word: "berhati-hati",
        en: "be careful",
        vi: "cẩn thận",
        pos: "adjective / instruction",
        pronunciation_vi: "ber-HA-ti HA-ti",
        pronunciation_en: "ber-HAH-tee HAH-tee",
      },
    ],
    dialogue: [
      {
        speaker: "Mandor",
        text: "Semua pekerja harus pakai helm proyek sebelum masuk.",
        vi: "Tất cả công nhân phải đội mũ bảo hộ trước khi vào.",
        en: "All workers must wear a hard hat before entering.",
      },
      {
        speaker: "Pekerja",
        text: "Baik, Pak. Saya belum boleh masuk sebelum izin kerja keluar, ya?",
        vi: "Vâng, anh. Tôi chưa được phép vào trước khi giấy phép làm việc được cấp, phải không ạ?",
        en: "Okay, sir. I am not allowed to enter before the work permit is issued, right?",
      },
      {
        speaker: "Mandor",
        text: "Betul. Area itu berbahaya karena ada material jatuh dari atas.",
        vi: "Đúng vậy. Khu đó nguy hiểm vì có vật liệu rơi từ trên xuống.",
        en: "Correct. That area is dangerous because material may fall from above.",
      },
      {
        speaker: "Pekerja",
        text: "Kalau saya melihat masalah, apakah saya langsung melapor ke supervisor?",
        vi: "Nếu tôi thấy có vấn đề, tôi báo trực tiếp cho giám sát luôn được không?",
        en: "If I see a problem, should I report directly to the supervisor?",
      },
      {
        speaker: "Mandor",
        text: "Ya, segera lapor dan jangan masuk ke area bahaya tanpa izin.",
        vi: "Có, hãy báo ngay và đừng vào khu vực nguy hiểm khi chưa được phép.",
        en: "Yes, report immediately and do not enter the danger zone without permission.",
      },
      {
        speaker: "Pekerja",
        text: "Baik. Saya akan cek lagi apakah semua pekerja sudah pakai APD.",
        vi: "Vâng. Tôi sẽ kiểm tra lại xem tất cả công nhân đã dùng đồ bảo hộ chưa.",
        en: "Okay. I will check again whether all workers are wearing PPE.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt: "Translate into Indonesian: Tất cả công nhân bắt buộc phải đội mũ bảo hộ công trình.",
        answer: "Semua pekerja wajib memakai helm proyek.",
      },
      {
        type: "translation",
        prompt: "Translate into Vietnamese: Jangan masuk ke area bahaya tanpa izin mandor.",
        answer: "Đừng vào khu vực nguy hiểm khi chưa có phép của quản lý công trường.",
      },
      {
        type: "fill_blank",
        prompt: "_____ masuk ke area bahaya tanpa izin.",
        answer: "Jangan",
      },
      {
        type: "fill_blank",
        prompt: "Kami harus melapor ke _____ sebelum mulai kerja.",
        answer: "supervisor",
      },
      {
        type: "matching",
        prompt: "Match the Indonesian phrase to the meaning.",
        pairs: [
          ["helm proyek", "construction helmet / mũ bảo hộ công trình"],
          ["laporan insiden", "incident report / báo cáo sự cố"],
          ["izin kerja", "work permit / giấy phép làm việc"],
          ["berhati-hati", "be careful / cẩn thận"],
        ],
      },
    ],
  },
];

export default constructionSiteSafetyLessons;
