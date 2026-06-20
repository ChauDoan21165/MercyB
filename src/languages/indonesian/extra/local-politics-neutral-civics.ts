// Local politics and neutral civics Indonesian (Vietnamese -> Indonesian study track).
//
// A6 Wave 32 file. Covers pemilu, TPS, KTP, surat suara, petugas, netral,
// hak warga, and informasi resmi.
// Self-contained so no registry or sibling agent files are touched.
//
// Field convention: sentence `en` holds the target Indonesian line, `vi` holds
// the Vietnamese gloss. `pronunciation_focus` carries Vietnamese-facing notes
// and common L1 traps; `pronunciation_focus_en` mirrors the same order for
// English-speaking companions.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length and order. */
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
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
  speaker: string;
  /** Indonesian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
  en?: string;
};

// Loosely typed so per-type fields (translation, fill-blank, matching) can vary.
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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_local_politics_neutral_civics",
    level: "B1",
    category: "public_services",
    title_vi: "Công dân và bầu cử địa phương: nói trung lập",
    title_en: "Local civics and elections: neutral language",
    sentences: [
      {
        en: "Saya ingin memahami proses pemilu secara netral.",
        vi: "Tôi muốn hiểu quy trình bầu cử một cách trung lập.",
        pronunciation_focus: [
          "SA-ya IN-gin me-ma-HA-mi PRO-ses pe-MI-lu se-CA-ra NE-tral - `pemilu` = pemilihan umum, bầu cử.",
          "`secara netral` = một cách trung lập; hữu ích khi tránh tranh luận đảng phái.",
          "Lỗi người Việt: nói `netral politik` theo tiếng Việt. Cụm tự nhiên hơn là `secara netral` hoặc `sikap netral`.",
        ],
        pronunciation_focus_en: [
          "SA-ya IN-gin meh-ma-HA-mee PRO-ses peh-MEE-loo seh-CHA-ra NE-tral - `pemilu` = general election.",
          "`secara netral` = neutrally; useful when avoiding partisan debate.",
          "VN-speaker trap: saying Vietnamese-style `netral politik`. More natural: `secara netral` or `sikap netral`.",
        ],
      },
      {
        en: "TPS saya ada di dekat kantor kelurahan.",
        vi: "Điểm bỏ phiếu của tôi ở gần văn phòng phường.",
        pronunciation_focus: [
          "TE-PE-ES SA-ya A-da di de-KAT KAN-tor ke-lu-RA-han - `TPS` đọc từng chữ: te-pe-es.",
          "`ada di dekat...` = nằm ở gần; khung câu rất dùng được khi hỏi địa điểm.",
          "Lỗi người Việt: đọc `TPS` theo chữ cái tiếng Anh. Ở Indonesia đọc theo chữ cái Indonesia: te-pe-es.",
        ],
        pronunciation_focus_en: [
          "TE-PE-ES SA-ya A-da dee deh-KAT KAN-tor keh-loo-RA-han - spell `TPS` with Indonesian letter names: te-pe-es.",
          "`ada di dekat...` = is located near; a useful frame for locations.",
          "VN-speaker trap: reading `TPS` with English letters. In Indonesian, say te-pe-es.",
        ],
      },
      {
        en: "Apakah saya perlu membawa KTP asli ke TPS?",
        vi: "Tôi có cần mang KTP bản gốc đến điểm bỏ phiếu không?",
        pronunciation_focus: [
          "a-PA-kah SA-ya PER-lu mem-BA-wa KA-TE-PE AS-li ke TE-PE-ES - `KTP asli` = thẻ căn cước bản gốc.",
          "`perlu membawa` = cần mang theo; nghe lịch sự và rõ ràng ở bối cảnh hành chính.",
          "Lỗi người Việt: dùng `harus bawa` trong mọi câu. `Perlu membawa` mềm hơn khi hỏi quy định.",
        ],
        pronunciation_focus_en: [
          "a-PA-kah SA-ya PER-loo mem-BA-wa KA-TE-PE AS-lee keh TE-PE-ES - `KTP asli` = original ID card.",
          "`perlu membawa` = need to bring; polite and clear in administrative contexts.",
          "VN-speaker trap: using `harus bawa` for every question. `Perlu membawa` sounds softer when asking rules.",
        ],
      },
      {
        en: "Petugas akan memeriksa nama saya di daftar pemilih.",
        vi: "Nhân viên sẽ kiểm tra tên tôi trong danh sách cử tri.",
        pronunciation_focus: [
          "pe-TU-gas A-kan me-me-RIK-sa NA-ma SA-ya di DAF-tar pe-MI-lih - `petugas` = nhân viên/cán bộ làm nhiệm vụ.",
          "`daftar pemilih` = danh sách cử tri; `pemilih` từ gốc `pilih` = chọn/bầu.",
          "Lỗi người Việt: dịch 'voter' thành `orang vote`. Dùng từ Indonesia: `pemilih`.",
        ],
        pronunciation_focus_en: [
          "peh-TOO-gas A-kan meh-meh-RIK-sa NA-ma SA-ya dee DAF-tar peh-MEE-lih - `petugas` = officer/staff on duty.",
          "`daftar pemilih` = voter list; `pemilih` comes from `pilih` = choose/vote.",
          "VN-speaker trap: translating voter as `orang vote`. Use the Indonesian word: `pemilih`.",
        ],
      },
      {
        en: "Saya menerima surat suara dari petugas.",
        vi: "Tôi nhận phiếu bầu từ nhân viên phụ trách.",
        pronunciation_focus: [
          "SA-ya me-ne-RI-ma SU-rat SU-a-ra da-ri pe-TU-gas - `surat suara` = phiếu bầu.",
          "`menerima` trang trọng hơn `dapat` trong mô tả quy trình.",
          "Lỗi người Việt: dịch `ballot` thành `kertas vote`. Cụm chuẩn là `surat suara`.",
        ],
        pronunciation_focus_en: [
          "SA-ya meh-neh-REE-ma SOO-rat SOO-a-ra da-ree peh-TOO-gas - `surat suara` = ballot paper.",
          "`menerima` is more formal than `dapat` when describing a procedure.",
          "VN-speaker trap: translating ballot as `kertas vote`. The standard phrase is `surat suara`.",
        ],
      },
      {
        en: "Saya tidak mau membahas pilihan politik pribadi.",
        vi: "Tôi không muốn bàn về lựa chọn chính trị cá nhân.",
        pronunciation_focus: [
          "SA-ya TI-dak MAU mem-BA-has pi-LIH-an po-LI-tik pri-BA-di - `pilihan politik pribadi` = lựa chọn chính trị cá nhân.",
          "`tidak mau membahas` là cách từ chối nói chuyện mà vẫn lịch sự.",
          "Lỗi người Việt: nói `rahasia saya` nghe hơi gắt. Câu này mềm hơn và trung lập hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya TEE-dak MAU mem-BA-has pee-LEE-han po-LEE-tik pree-BA-dee - `pilihan politik pribadi` = personal political choice.",
          "`tidak mau membahas` politely declines a discussion.",
          "VN-speaker trap: saying blunt `rahasia saya`. This sentence is softer and more neutral.",
        ],
      },
      {
        en: "Setiap warga punya hak warga untuk bertanya dan mendapat informasi resmi.",
        vi: "Mỗi cư dân/công dân có quyền hỏi và nhận thông tin chính thức.",
        pronunciation_focus: [
          "se-TI-ap WAR-ga PU-nya HAK WAR-ga UN-tuk ber-TA-nya dan men-DA-pat in-for-MA-si res-MI - `hak warga` = quyền của cư dân/công dân.",
          "`informasi resmi` = thông tin chính thức; dùng khi phân biệt với tin đồn.",
          "Lỗi người Việt: dùng `info official` nửa Anh nửa Indonesia. Cụm tự nhiên là `informasi resmi`.",
        ],
        pronunciation_focus_en: [
          "seh-TEE-ap WAR-ga POO-nya HAK WAR-ga OON-took ber-TA-nya dan men-DA-pat in-for-MA-see res-MEE - `hak warga` = citizen/resident rights.",
          "`informasi resmi` = official information; useful when separating it from rumors.",
          "VN-speaker trap: saying half-English `info official`. Natural Indonesian is `informasi resmi`.",
        ],
      },
      {
        en: "Kalau ada informasi yang membingungkan, sebaiknya cek sumber resmi.",
        vi: "Nếu có thông tin gây khó hiểu, tốt nhất nên kiểm tra nguồn chính thức.",
        pronunciation_focus: [
          "KA-lau A-da in-for-MA-si yang mem-BI-ngung-kan, se-BAIK-nya cek SUM-ber res-MI - `sumber resmi` = nguồn chính thức.",
          "`sebaiknya` = tốt nhất là/nên; phù hợp khi đưa lời khuyên trung lập.",
          "Lỗi người Việt: dùng `bingung informasi`. Đúng trật tự là `informasi yang membingungkan`.",
        ],
        pronunciation_focus_en: [
          "KA-lau A-da in-for-MA-see yang mem-BING-goong-kan, seh-BAIK-nya chek SOOM-ber res-MEE - `sumber resmi` = official source.",
          "`sebaiknya` = preferably/it is better to; good for neutral advice.",
          "VN-speaker trap: saying `bingung informasi`. Correct order: `informasi yang membingungkan`.",
        ],
      },
      {
        en: "Petugas TPS harus bersikap netral saat melayani pemilih.",
        vi: "Nhân viên điểm bỏ phiếu phải giữ thái độ trung lập khi phục vụ cử tri.",
        pronunciation_focus: [
          "pe-TU-gas TE-PE-ES HA-rus ber-SI-kap NE-tral saat me-la-YA-ni pe-MI-lih - `bersikap netral` = giữ thái độ trung lập.",
          "`melayani pemilih` = phục vụ cử tri; nghe hành chính và tôn trọng.",
          "Lỗi người Việt: dùng `jadi netral`. Với thái độ/hành vi, dùng `bersikap netral`.",
        ],
        pronunciation_focus_en: [
          "peh-TOO-gas TE-PE-ES HA-roos ber-SEE-kap NE-tral saat meh-la-YA-nee peh-MEE-lih - `bersikap netral` = act/remain neutral.",
          "`melayani pemilih` = serve voters; administrative and respectful.",
          "VN-speaker trap: using `jadi netral`. For attitude or conduct, use `bersikap netral`.",
        ],
      },
      {
        en: "Saya hanya ingin tahu jadwal, lokasi TPS, dan dokumen yang diperlukan.",
        vi: "Tôi chỉ muốn biết lịch, địa điểm TPS, và giấy tờ cần thiết.",
        pronunciation_focus: [
          "SA-ya HA-nya IN-gin TA-hu JAD-wal, lo-KA-si TE-PE-ES, dan DO-ku-men yang di-per-LU-kan - `hanya ingin tahu` = chỉ muốn biết.",
          "Câu này giúp giữ cuộc trò chuyện ở mức thông tin thực tế, không tranh luận chính trị.",
          "Lỗi người Việt: dùng `mau tahu saja` cuối câu có thể nghe hơi cộc. `Saya hanya ingin tahu...` lịch sự hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya HA-nya IN-gin TA-hoo JAD-wal, lo-KA-see TE-PE-ES, dan DO-ku-men yang dee-per-LOO-kan - `hanya ingin tahu` = only want to know.",
          "This sentence keeps the conversation factual, not political.",
          "VN-speaker trap: ending with `mau tahu saja` can sound blunt. `Saya hanya ingin tahu...` is more polite.",
        ],
      },
    ],
    cultural_notes_vi:
      "Bài này tập trung vào ngôn ngữ công dân trung lập: hỏi địa điểm TPS, giấy tờ, surat suara, petugas, quyền hỏi thông tin, và nguồn resmi. Nội dung không hướng dẫn chọn ứng viên hay đảng phái. Khi không muốn nói về lựa chọn cá nhân, có thể nói lịch sự: `Saya tidak mau membahas pilihan politik pribadi.`",
    cultural_notes_en:
      "This lesson focuses on neutral civics language: asking about TPS location, documents, ballot papers, officers, the right to ask for information, and official sources. It does not advise choosing candidates or parties. If you do not want to discuss personal choices, politely say: `Saya tidak mau membahas pilihan politik pribadi.`",
    tip_advice_vi:
      "Mẹo cho người Việt: các chữ viết tắt như `KTP` và `TPS` đọc theo chữ cái Indonesia: ka-te-pe, te-pe-es. Để giữ trung lập, dùng `informasi resmi`, `sumber resmi`, `secara netral`, và tránh hỏi trực tiếp người khác chọn ai.",
    tip_advice_en:
      "Tip for Vietnamese speakers: abbreviations like `KTP` and `TPS` are read with Indonesian letter names: ka-te-pe, te-pe-es. To stay neutral, use `informasi resmi`, `sumber resmi`, `secara netral`, and avoid directly asking who someone chose.",
    vocabulary: [
      {
        word: "pemilu",
        en: "general election",
        vi: "bầu cử",
        pos: "noun",
        pronunciation_vi: "pe-MI-lu",
        pronunciation_en: "peh-MEE-loo",
      },
      {
        word: "TPS",
        en: "polling station",
        vi: "điểm bỏ phiếu",
        pos: "noun abbreviation",
        pronunciation_vi: "te-pe-es",
        pronunciation_en: "te-pe-es",
      },
      {
        word: "KTP",
        en: "Indonesian ID card",
        vi: "thẻ căn cước Indonesia",
        pos: "noun abbreviation",
        pronunciation_vi: "ka-te-pe",
        pronunciation_en: "ka-te-pe",
      },
      {
        word: "surat suara",
        en: "ballot paper",
        vi: "phiếu bầu",
        pos: "noun phrase",
        pronunciation_vi: "SU-rat SU-a-ra",
        pronunciation_en: "SOO-rat SOO-a-ra",
      },
      {
        word: "petugas",
        en: "officer; staff on duty",
        vi: "nhân viên/cán bộ phụ trách",
        pos: "noun",
        pronunciation_vi: "pe-TU-gas",
        pronunciation_en: "peh-TOO-gas",
      },
      {
        word: "netral",
        en: "neutral",
        vi: "trung lập",
        pos: "adjective",
        pronunciation_vi: "NE-tral",
        pronunciation_en: "NE-tral",
      },
      {
        word: "hak warga",
        en: "resident/citizen rights",
        vi: "quyền của cư dân/công dân",
        pos: "noun phrase",
        pronunciation_vi: "HAK WAR-ga",
        pronunciation_en: "HAK WAR-ga",
      },
      {
        word: "informasi resmi",
        en: "official information",
        vi: "thông tin chính thức",
        pos: "noun phrase",
        pronunciation_vi: "in-for-MA-si res-MI",
        pronunciation_en: "in-for-MA-see res-MEE",
      },
      {
        word: "daftar pemilih",
        en: "voter list",
        vi: "danh sách cử tri",
        pos: "noun phrase",
        pronunciation_vi: "DAF-tar pe-MI-lih",
        pronunciation_en: "DAF-tar peh-MEE-lih",
      },
      {
        word: "sumber resmi",
        en: "official source",
        vi: "nguồn chính thức",
        pos: "noun phrase",
        pronunciation_vi: "SUM-ber res-MI",
        pronunciation_en: "SOOM-ber res-MEE",
      },
    ],
    dialogue: [
      {
        speaker: "Warga",
        text: "Pak, saya hanya ingin tahu lokasi TPS dan dokumen yang perlu dibawa.",
        vi: "Chú ơi, tôi chỉ muốn biết địa điểm TPS và giấy tờ cần mang theo.",
        en: "Sir, I only want to know the TPS location and the documents I need to bring.",
      },
      {
        speaker: "Petugas",
        text: "Silakan cek informasi resmi di papan pengumuman kelurahan.",
        vi: "Xin hãy kiểm tra thông tin chính thức trên bảng thông báo của phường.",
        en: "Please check the official information on the kelurahan notice board.",
      },
      {
        speaker: "Warga",
        text: "Apakah saya perlu membawa KTP asli?",
        vi: "Tôi có cần mang KTP bản gốc không?",
        en: "Do I need to bring the original KTP?",
      },
      {
        speaker: "Petugas",
        text: "Ya, bawa KTP asli dan datang sesuai jadwal.",
        vi: "Có, hãy mang KTP bản gốc và đến đúng lịch.",
        en: "Yes, bring the original KTP and come according to the schedule.",
      },
      {
        speaker: "Tetangga",
        text: "Kamu pilih siapa?",
        vi: "Bạn chọn ai?",
        en: "Who are you voting for?",
      },
      {
        speaker: "Warga",
        text: "Maaf, saya tidak mau membahas pilihan politik pribadi.",
        vi: "Xin lỗi, tôi không muốn bàn về lựa chọn chính trị cá nhân.",
        en: "Sorry, I do not want to discuss my personal political choice.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: 'Tôi chỉ muốn biết địa điểm TPS.'",
        prompt_en: "Translate into Indonesian: 'I only want to know the TPS location.'",
        answer: "Saya hanya ingin tahu lokasi TPS.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ đúng: Kalau ada informasi yang membingungkan, sebaiknya cek sumber ____.",
        prompt_en: "Fill in the correct word: Kalau ada informasi yang membingungkan, sebaiknya cek sumber ____.",
        answer: "resmi",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm từ với nghĩa: pemilu, TPS, surat suara, informasi resmi.",
        prompt_en: "Match the phrases with meanings: pemilu, TPS, surat suara, informasi resmi.",
        answer: "pemilu = election; TPS = polling station; surat suara = ballot paper; informasi resmi = official information.",
      },
      {
        type: "roleplay",
        prompt_vi: "Đóng vai người dân hỏi petugas về TPS, KTP, surat suara, và thông tin resmi. Giữ giọng trung lập.",
        prompt_en: "Roleplay as a resident asking an officer about TPS, KTP, ballot papers, and official information. Keep the tone neutral.",
        sample_answer: "Pak, saya ingin bertanya secara netral. TPS saya di mana? Apakah perlu membawa KTP asli? Di mana saya bisa cek informasi resmi?",
      },
    ],
  },
];
