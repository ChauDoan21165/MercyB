// NGO Field Interview Indonesian (Vietnamese -> Indonesian study track).
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
    id: "indonesian_ngo_field_interview",
    level: "B1",
    category: "community",
    title_vi: "Phỏng vấn thực địa cho NGO",
    title_en: "NGO field interview",
    sentences: [
      {
        en: "Selamat pagi, saya dari tim survei lapangan.",
        vi: "Chào buổi sáng, tôi từ nhóm khảo sát thực địa.",
        pronunciation_focus: [
          "se-la-MAT pa-GI, sa-YA da-RI tim sur-VEI la-PAng-an -- `survei lapangan` = khảo sát thực địa.",
          "Lỗi người Việt: đọc `lapangan` quá nhanh thành một mớ âm mơ hồ. Tách rõ `la-PANG-an` sẽ tự nhiên hơn.",
          "Luyện: `Saya dari tim survei lapangan.`",
        ],
        pronunciation_focus_en: [
          "se-la-MAHT pa-GEE, sa-YA da-REE tim soor-VAY la-PAHNG-an -- `survei lapangan` = field survey.",
          "VN-speaker trap: rushing `lapangan` into an unclear blur. Separate it as `la-PANG-an` for a natural rhythm.",
          "Drill: `Saya dari tim survei lapangan.`",
        ],
      },
      {
        en: "Apakah Bapak atau Ibu bersedia menjadi responden?",
        vi: "Anh/chị có sẵn lòng trở thành người trả lời khảo sát không?",
        pronunciation_focus: [
          "`Apakah` dipakai untuk câu hỏi trang trọng; `Bapak atau Ibu` là cách gọi lịch sự untuk orang dewasa yang belum akrab.",
          "Lỗi người Việt: dùng `kamu` atau `saudara` trong wawancara publik. Với lapangan, `Bapak/Ibu` aman dan sopan.",
          "Luyện: `Bersedia menjadi responden?`",
        ],
        pronunciation_focus_en: [
          "`Apakah` is a formal question marker; `Bapak atau Ibu` is respectful for adults you do not know well.",
          "VN-speaker trap: using `kamu` or `saudara` in public interviews. For fieldwork, `Bapak/Ibu` is safe and polite.",
          "Drill: `Bersedia menjadi responden?`",
        ],
      },
      {
        en: "Kami ingin meminta izin untuk merekam percakapan ini.",
        vi: "Chúng tôi muốn xin phép ghi âm cuộc trò chuyện này.",
        pronunciation_focus: [
          "`meminta izin` = xin phép; `merekam percakapan` = ghi âm cuộc trò chuyện.",
          "Hãy nói trước khi bật thiết bị. Di Indonesia, izin rekaman penting để membangun kepercayaan.",
          "Luyện: `Kami ingin meminta izin.`",
        ],
        pronunciation_focus_en: [
          "`meminta izin` = ask permission; `merekam percakapan` = record the conversation.",
          "Say this before turning on the device. In Indonesia, recording permission matters for building trust.",
          "Drill: `Kami ingin meminta izin.`",
        ],
      },
      {
        en: "Ada beberapa pertanyaan sensitif, jadi Anda boleh tidak menjawab.",
        vi: "Có một vài câu hỏi nhạy cảm, nên anh/chị có thể không trả lời.",
        pronunciation_focus: [
          "`pertanyaan sensitif` = câu hỏi nhạy cảm; `boleh tidak menjawab` = có thể không trả lời.",
          "Mẹo: thêm câu này giúp responden merasa aman, terutama ketika topiknya tentang pendapatan, keluarga, atau kesehatan.",
          "Luyện: `Anda boleh tidak menjawab.`",
        ],
        pronunciation_focus_en: [
          "`pertanyaan sensitif` = sensitive questions; `boleh tidak menjawab` = you may choose not to answer.",
          "Tip: this sentence helps respondents feel safe, especially for topics like income, family, or health.",
          "Drill: `Anda boleh tidak menjawab.`",
        ],
      },
      {
        en: "Data warga akan kami gunakan hanya untuk laporan survei.",
        vi: "Dữ liệu của người dân sẽ chỉ được chúng tôi dùng cho báo cáo khảo sát.",
        pronunciation_focus: [
          "`data warga` = dữ liệu người dân; `laporan survei` = báo cáo khảo sát.",
          "Lỗi người Việt: ghép `warga` với nghĩa quá rộng. Trong konteks ini, `warga` biasanya nghĩa là cư dân hoặc người dân địa phương.",
          "Luyện: `Hanya untuk laporan survei.`",
        ],
        pronunciation_focus_en: [
          "`data warga` = residents' data; `laporan survei` = survey report.",
          "VN-speaker trap: treating `warga` too broadly. In this context, it usually means local residents or citizens.",
          "Drill: `Hanya untuk laporan survei.`",
        ],
      },
      {
        en: "Nama Anda tidak akan dicantumkan dalam laporan.",
        vi: "Tên của anh/chị sẽ không được ghi trong báo cáo.",
        pronunciation_focus: [
          "`tidak akan dicantumkan` = sẽ không được ghi vào; ini lebih formal daripada `tidak ditulis`.",
          "Dalam wawancara lapangan, kalimat ini sangat penting untuk menjaga privasi.",
          "Luyện: `Nama Anda tidak akan dicantumkan.`",
        ],
        pronunciation_focus_en: [
          "`tidak akan dicantumkan` = will not be included/listed; this is more formal than `tidak ditulis`.",
          "In field interviews, this sentence is important for privacy protection.",
          "Drill: `Nama Anda tidak akan dicantumkan.`",
        ],
      },
      {
        en: "Terima kasih atas waktunya, dan kami sangat menghargai bantuan Anda.",
        vi: "Cảm ơn anh/chị đã dành thời gian, và chúng tôi rất trân trọng sự giúp đỡ của anh/chị.",
        pronunciation_focus: [
          "`atas waktunya` = vì thời gian của anh/chị; sangat sopan dalam penutupan wawancara.",
          "`menghargai bantuan Anda` cocok untuk konteks NGO karena terdengar tulus dan profesional.",
          "Luyện: `Terima kasih atas waktunya.`",
        ],
        pronunciation_focus_en: [
          "`atas waktunya` = for your time; very polite at the end of an interview.",
          "`menghargai bantuan Anda` fits NGO contexts because it sounds sincere and professional.",
          "Drill: `Terima kasih atas waktunya.`",
        ],
      },
      {
        en: "Kalau Anda setuju, kami bisa lanjut dengan beberapa pertanyaan singkat.",
        vi: "Nếu anh/chị đồng ý, chúng tôi có thể tiếp tục với vài câu hỏi ngắn.",
        pronunciation_focus: [
          "`Kalau Anda setuju` = nếu anh/chị đồng ý; memberi pilihan rõ ràng.",
          "Mẹo: luôn beri kontrol cho responden. `bisa lanjut` terdengar lebih mềm hơn `kami mulai sekarang`.",
          "Luyện: `Kami bisa lanjut.`",
        ],
        pronunciation_focus_en: [
          "`Kalau Anda setuju` = if you agree; it gives clear choice.",
          "Tip: always give respondents control. `bisa lanjut` sounds softer than `kami mulai sekarang`.",
          "Drill: `Kami bisa lanjut.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong wawancara lapangan di Indonesia, sopan santun rất penting. Người phỏng vấn thường tự giới thiệu dulu, menjelaskan tujuan singkat, dan meminta izin sebelum merekam hoặc mengambil data pribadi. Với topik sensitif seperti pendapatan, kesehatan, atau keluarga, bahasa harus lembut dan memberi quyền từ chối. Các organisasi NGO thường juga menjaga kerahasiaan nama responden, jadi câu hứa seperti `nama Anda tidak akan dicantumkan` sangat berguna.",
    cultural_notes_en:
      "In field interviews in Indonesia, politeness matters a lot. Interviewers usually introduce themselves first, explain the purpose briefly, and ask permission before recording or collecting personal data. For sensitive topics such as income, health, or family, the language should be soft and should give the respondent the right to decline. NGOs often protect respondent confidentiality, so a sentence like `nama Anda tidak akan dicantumkan` is very useful.",
    tip_advice_vi:
      "Mẹo cho người Việt: đừng dịch cứng như trong sách. Untuk lapangan, pakai pola: `saya dari tim...`, `apakah Bapak/Ibu bersedia...`, `kami ingin meminta izin...`, `Anda boleh tidak menjawab`. Chuỗi này giúp bạn nghe chuyên nghiệp và an toàn hơn. Khi nói về data, luôn nhấn mạnh `hanya untuk laporan` và `nama tidak dicantumkan`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: do not translate too literally. For fieldwork, use the pattern: `saya dari tim...`, `apakah Bapak/Ibu bersedia...`, `kami ingin meminta izin...`, `Anda boleh tidak menjawab`. This sequence makes you sound professional and safe. When talking about data, always emphasize `hanya untuk laporan` and `nama tidak dicantumkan`.",
    vocabulary: [
      {
        cell_id: "7b852841-4af3-4ad1-b5cd-8f6d61fdf365",
        word: "wawancara lapangan",
        en: "field interview",
        vi: "phỏng vấn thực địa",
        pos: "noun phrase",
        pronunciation_vi: "wa-WAN-ca-ra la-PANG-an",
        pronunciation_en: "WAH-wahn-CHAH-rah la-PAHNG-an",
      },
      {
        cell_id: "cfabe542-6d12-4fad-92d4-3bb45a97f5bb",
        word: "responden",
        en: "respondent",
        vi: "người trả lời khảo sát",
        pos: "noun",
        pronunciation_vi: "res-pon-DEN",
        pronunciation_en: "res-pon-DEN",
      },
      {
        cell_id: "e4005d9b-eb4e-4830-ab21-f1d4a0fc8a2f",
        word: "izin rekaman",
        en: "recording permission",
        vi: "sự cho phép ghi âm",
        pos: "noun phrase",
        pronunciation_vi: "I-zin re-KA-man",
        pronunciation_en: "EE-zin reh-KAH-mahn",
      },
      {
        cell_id: "fce38d59-b9c2-4639-82d0-875dc590ecaf",
        word: "pertanyaan sensitif",
        en: "sensitive question",
        vi: "câu hỏi nhạy cảm",
        pos: "noun phrase",
        pronunciation_vi: "per-ta-NYA-an sen-si-TIF",
        pronunciation_en: "per-tah-NYAH-ahn sen-see-TEEF",
      },
      {
        cell_id: "34cffd47-6083-4aaa-a106-35acc290b685",
        word: "data warga",
        en: "residents' data",
        vi: "dữ liệu người dân",
        pos: "noun phrase",
        pronunciation_vi: "DA-ta WAR-ga",
        pronunciation_en: "DAH-tah WAR-gah",
      },
      {
        cell_id: "0377a294-2356-480d-b835-d244c5472346",
        word: "laporan survei",
        en: "survey report",
        vi: "báo cáo khảo sát",
        pos: "noun phrase",
        pronunciation_vi: "la-PO-ran sur-VEI",
        pronunciation_en: "la-POH-rahn soor-VAY",
      },
      {
        cell_id: "e81b22b4-d1b1-4a0f-9125-457209e505d8",
        word: "sopan santun",
        en: "politeness / etiquette",
        vi: "sự lịch sự",
        pos: "noun phrase",
        pronunciation_vi: "SO-pan SAN-tun",
        pronunciation_en: "SOH-pahn SAHN-toon",
      },
      {
        cell_id: "dbe09554-145b-4206-acd6-4927f1d206f9",
        word: "tidak menjawab",
        en: "not to answer",
        vi: "không trả lời",
        pos: "phrase",
        pronunciation_vi: "TI-dak men-JA-wab",
        pronunciation_en: "TEE-dahk men-JAH-wab",
      },
    ],
    dialogue: [
      {
        cell_id: "5a468a16-e646-46eb-9f1b-8d34835de18a",
        speaker: "Petugas",
        text: "Selamat siang, kami dari tim survei lapangan.",
        vi: "Chào buổi trưa, chúng tôi từ nhóm khảo sát thực địa.",
        en: "Good afternoon, we are from the field survey team.",
      },
      {
        cell_id: "9c2760ee-e0f3-49bf-8337-6eef0f5be824",
        speaker: "Responden",
        text: "Iya, silakan. Ada apa ya?",
        vi: "Vâng, mời. Có việc gì vậy?",
        en: "Yes, please go ahead. What is this about?",
      },
      {
        cell_id: "69a38eb0-714a-4db8-9e99-a536761d7e7a",
        speaker: "Petugas",
        text: "Kami ingin meminta izin untuk merekam percakapan ini.",
        vi: "Chúng tôi muốn xin phép ghi âm cuộc trò chuyện này.",
        en: "We would like to ask permission to record this conversation.",
      },
      {
        cell_id: "e69b9d9c-9327-4e09-982d-b1cfe05024f4",
        speaker: "Responden",
        text: "Boleh, asal data saya dijaga kerahasiaannya.",
        vi: "Được, miễn là dữ liệu của tôi được giữ bí mật.",
        en: "Sure, as long as my data is kept confidential.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi từ nhóm khảo sát thực địa.",
        answer: "Saya dari tim survei lapangan.",
      },
      {
        type: "fill_blank",
        prompt: "Kami ingin meminta ____ untuk merekam percakapan ini.",
        answer: "izin",
      },
      {
        type: "matching",
        prompt_vi: "Ghép từ với nghĩa đúng.",
        pairs: [
          ["responden", "người trả lời khảo sát"],
          ["laporan survei", "báo cáo khảo sát"],
          ["sopan santun", "sự lịch sự"],
        ],
      },
      {
        type: "roleplay",
        prompt_vi:
          "Bạn là petugas NGO. Hãy mở đầu wawancara với lời chào, giới thiệu tim, xin izin rekaman, và nói rằng responden boleh tidak menjawab pertanyaan sensitif.",
        answer:
          "Selamat pagi, saya dari tim survei lapangan. Kami ingin meminta izin untuk merekam percakapan ini. Ada beberapa pertanyaan sensitif, jadi Anda boleh tidak menjawab.",
      },
    ],
    content:
      "Lesson on polite NGO field interviews in Indonesian: introductions, respondent permission, recording consent, sensitive questions, confidentiality, and closing the survey respectfully.",
  },
];
