// Indonesian disability accessibility / public service lesson pack for Vietnamese learners.
//
// Self-contained extra lesson file following the established Indonesian format.
// The `en` field holds TARGET-LANGUAGE Indonesian; `vi` holds the Vietnamese
// gloss. Pronunciation notes include Vietnamese L1 traps plus English companions.

type LessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type Exercise = Record<string, any>;

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
  content?: string;
};

export const disabilityAccessibilityServiceLessons: IndonesianLesson[] = [
  {
    id: "indonesian_accessibility_public_service",
    level: "A2",
    category: "public_services",
    title_vi: "Hỏi về hỗ trợ tiếp cận trong dịch vụ công",
    title_en: "Asking about accessibility support in public services",
    sentences: [
      {
        en: "Apakah kantor ini punya akses untuk difabel?",
        vi: "Văn phòng này có lối tiếp cận cho người khuyết tật không?",
        pronunciation_focus: [
          "a-PA-kah KAN-tor I-ni PU-nya AK-ses UN-tuk di-FA-bel.",
          "`akses untuk difabel` = lối/khả năng tiếp cận cho người khuyết tật; `difabel` là từ khá tôn trọng trong Indonesia.",
          "L1 Việt: `punya akses` trong nói hằng ngày = có lối/tiện ích tiếp cận, không phải chỉ 'sở hữu'.",
        ],
        pronunciation_focus_en: [
          "a-PA-kah KAN-tor I-ni PU-nya AK-ses UN-tuk di-FA-bel.",
          "`akses untuk difabel` = access for disabled people; `difabel` is a fairly respectful Indonesian term.",
          "VN-speaker note: everyday `punya akses` means has access/facilities, not only owns.",
        ],
      },
      {
        en: "Saya memakai kursi roda dan perlu jalur landai.",
        vi: "Tôi dùng xe lăn và cần đường dốc.",
        pronunciation_focus: [
          "SA-ya me-MA-kai KUR-si RO-da dan per-LU JA-lur LAN-dai.",
          "`kursi roda` = xe lăn; `jalur landai` = đường dốc/lối dốc cho xe lăn.",
          "L1 Việt: `memakai` = dùng/đeo/mặc tùy ngữ cảnh. Với alat bantu, `memakai kursi roda` tự nhiên.",
        ],
        pronunciation_focus_en: [
          "SA-ya me-MA-kai KUR-si RO-da dan per-LU JA-lur LAN-dai.",
          "`kursi roda` = wheelchair; `jalur landai` = ramp / sloped access path.",
          "VN-speaker note: `memakai` means use/wear depending on context. With assistive devices, `memakai kursi roda` is natural.",
        ],
      },
      {
        en: "Di mana pintu masuk yang ramah kursi roda?",
        vi: "Lối vào thân thiện với xe lăn ở đâu?",
        pronunciation_focus: [
          "di MA-na PIN-tu MA-suk yang RA-mah KUR-si RO-da.",
          "`ramah kursi roda` = thân thiện/phù hợp với xe lăn; rất hay dùng cho fasilitas.",
          "L1 Việt: tính từ/cụm mô tả đứng sau danh từ: `pintu masuk yang ramah...`, không đảo như tiếng Anh.",
        ],
        pronunciation_focus_en: [
          "di MA-na PIN-tu MA-suk yang RA-mah KUR-si RO-da.",
          "`ramah kursi roda` = wheelchair-friendly; common for facilities.",
          "VN-speaker note: the descriptive phrase follows the noun: `pintu masuk yang ramah...`, not English-style reversal.",
        ],
      },
      {
        en: "Apakah ada loket prioritas untuk penyandang disabilitas?",
        vi: "Có quầy ưu tiên cho người khuyết tật không?",
        pronunciation_focus: [
          "a-PA-kah A-da LO-ket pri-o-ri-TAS UN-tuk pe-NYAN-dang di-sa-bi-li-TAS.",
          "`penyandang disabilitas` = người khuyết tật; trang trọng hơn `difabel` trong văn bản/dịch vụ công.",
          "L1 Việt: `loket prioritas` = quầy ưu tiên. Hỏi bằng `apakah ada...` nghe lịch sự và rõ.",
        ],
        pronunciation_focus_en: [
          "a-PA-kah A-da LO-ket pri-o-ri-TAS UN-tuk pe-NYAN-dang di-sa-bi-li-TAS.",
          "`penyandang disabilitas` = person with a disability; more formal than `difabel` in official settings.",
          "VN-speaker note: `loket prioritas` = priority counter. `Apakah ada...` sounds polite and clear.",
        ],
      },
      {
        en: "Pendamping saya boleh masuk bersama saya?",
        vi: "Người đi cùng/hỗ trợ tôi có được vào cùng tôi không?",
        pronunciation_focus: [
          "pen-DAM-ping SA-ya BO-leh MA-suk ber-SA-ma SA-ya.",
          "`pendamping` = người đi cùng/hỗ trợ; `boleh` = được phép/có thể.",
          "L1 Việt: `bersama saya` = cùng tôi. Đừng dùng `dengan saya` nếu muốn nhấn mạnh đi vào cùng nhau.",
        ],
        pronunciation_focus_en: [
          "pen-DAM-ping SA-ya BO-leh MA-suk ber-SA-ma SA-ya.",
          "`pendamping` = companion/assistant; `boleh` = may / be allowed to.",
          "VN-speaker trap: `bersama saya` = together with me. Use this when emphasizing entering together.",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong dịch vụ công Indonesia, bạn có thể gặp các cụm như `akses difabel`, `ramah disabilitas`, `loket prioritas`, `jalur landai`, dan `bantuan petugas`. `Penyandang disabilitas` là cách nói trang trọng, còn `difabel` cũng phổ biến và thường được xem là lịch sự. Khi cần hỗ trợ, hỏi trực tiếp nhưng mềm: `Boleh minta bantuan?` hoặc `Apakah ada layanan prioritas?`.",
    cultural_notes_en:
      "In Indonesian public services, you may see phrases such as `akses difabel`, `ramah disabilitas`, `loket prioritas`, `jalur landai`, and `bantuan petugas`. `Penyandang disabilitas` is formal, while `difabel` is also common and usually respectful. When you need support, ask directly but gently: `Boleh minta bantuan?` or `Apakah ada layanan prioritas?`.",
    tip_advice_vi:
      "Mẫu an toàn: `Saya memakai kursi roda`, `Saya perlu jalur landai`, `Apakah ada loket prioritas?`, `Pendamping saya boleh masuk?`. Người Việt nên nhớ `untuk` = cho, `bersama` = cùng, `di mana` = ở đâu.",
    tip_advice_en:
      "Safe frames: `Saya memakai kursi roda`, `Saya perlu jalur landai`, `Apakah ada loket prioritas?`, `Pendamping saya boleh masuk?`. Vietnamese speakers should remember `untuk` = for, `bersama` = together with, `di mana` = where.",
    vocabulary: [
      {
        word: "akses difabel",
        en: "disabled access",
        vi: "lối/khả năng tiếp cận cho người khuyết tật",
        pos: "noun phrase",
        pronunciation_vi: "AK-ses di-FA-bel",
        pronunciation_en: "AK-ses dee-FA-bel",
      },
      {
        word: "kursi roda",
        en: "wheelchair",
        vi: "xe lăn",
        pos: "noun",
        pronunciation_vi: "KUR-si RO-da",
        pronunciation_en: "KOOR-see RO-da",
      },
      {
        word: "jalur landai",
        en: "ramp / sloped access path",
        vi: "đường dốc / lối dốc",
        pos: "noun phrase",
        pronunciation_vi: "JA-lur LAN-dai",
        pronunciation_en: "JA-loor LAN-dai",
      },
      {
        word: "loket prioritas",
        en: "priority counter",
        vi: "quầy ưu tiên",
        pos: "noun phrase",
        pronunciation_vi: "LO-ket pri-o-ri-TAS",
        pronunciation_en: "LO-ket pree-o-ree-TAS",
      },
      {
        word: "penyandang disabilitas",
        en: "person with a disability",
        vi: "người khuyết tật",
        pos: "noun phrase",
        pronunciation_vi: "pe-NYAN-dang di-sa-bi-li-TAS",
        pronunciation_en: "pe-NYAN-dang dee-sa-bee-lee-TAS",
      },
      {
        word: "pendamping",
        en: "companion / assistant",
        vi: "người đi cùng / người hỗ trợ",
        pos: "noun",
        pronunciation_vi: "pen-DAM-ping",
        pronunciation_en: "pen-DAM-ping",
      },
    ],
    dialogue: [
      {
        speaker: "Pengunjung",
        text: "Permisi, apakah kantor ini punya akses untuk difabel?",
        vi: "Xin lỗi, văn phòng này có lối tiếp cận cho người khuyết tật không?",
        en: "Excuse me, does this office have disabled access?",
      },
      {
        speaker: "Petugas",
        text: "Ada, Pak. Jalur landai ada di pintu samping.",
        vi: "Có ạ. Đường dốc ở cửa bên.",
        en: "Yes, Sir. The ramp is at the side entrance.",
      },
      {
        speaker: "Pengunjung",
        text: "Saya memakai kursi roda. Pendamping saya boleh masuk?",
        vi: "Tôi dùng xe lăn. Người hỗ trợ tôi có được vào không?",
        en: "I use a wheelchair. May my companion enter?",
      },
      {
        speaker: "Petugas",
        text: "Boleh. Silakan ke loket prioritas.",
        vi: "Được ạ. Mời đến quầy ưu tiên.",
        en: "Yes. Please go to the priority counter.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ phù hợp về tiếp cận và ưu tiên:",
        instruction_en: "Fill in the suitable accessibility word:",
        items: [
          {
            prompt: "Saya memakai kursi ___ dan perlu jalur landai. (xe lăn)",
            answer: "roda",
            options: ["roda", "rasa", "rumah"],
          },
          {
            prompt: "Apakah ada loket ___ untuk penyandang disabilitas? (ưu tiên)",
            answer: "prioritas",
            options: ["prioritas", "pintu", "paket"],
          },
          {
            prompt: "Pendamping saya boleh masuk ___ saya? (cùng)",
            answer: "bersama",
            options: ["bersama", "belakang", "berangkat"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi dùng xe lăn và cần đường dốc.", answer: "Saya memakai kursi roda dan perlu jalur landai." },
          { prompt: "Có quầy ưu tiên cho người khuyết tật không?", answer: "Apakah ada loket prioritas untuk penyandang disabilitas?" },
          { prompt: "Người hỗ trợ tôi có được vào cùng tôi không?", answer: "Pendamping saya boleh masuk bersama saya?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_asking_petugas_for_assistance",
    level: "B1",
    category: "public_services",
    title_vi: "Nhờ petugas hỗ trợ trong không gian công cộng",
    title_en: "Asking staff for assistance in public spaces",
    sentences: [
      {
        en: "Boleh minta bantuan petugas sebentar?",
        vi: "Tôi có thể nhờ nhân viên hỗ trợ một lát không?",
        pronunciation_focus: [
          "BO-leh MIN-ta ban-TU-an pe-TU-gas se-BEN-tar.",
          "`minta bantuan` = xin/nhờ hỗ trợ; `petugas` = nhân viên/cán bộ đang làm nhiệm vụ.",
          "L1 Việt: `boleh minta...` là khung lịch sự, mềm hơn câu ra lệnh trực tiếp.",
        ],
        pronunciation_focus_en: [
          "BO-leh MIN-ta ban-TU-an pe-TU-gas se-BEN-tar.",
          "`minta bantuan` = ask for help/assistance; `petugas` = staff/officer on duty.",
          "VN-speaker note: `boleh minta...` is a polite frame, softer than a direct command.",
        ],
      },
      {
        en: "Saya kesulitan naik tangga karena memakai alat bantu jalan.",
        vi: "Tôi gặp khó khăn khi lên cầu thang vì dùng dụng cụ hỗ trợ đi lại.",
        pronunciation_focus: [
          "SA-ya ke-su-LI-tan naik TANG-ga ka-RE-na me-MA-kai A-lat BAN-tu JA-lan.",
          "`kesulitan` = gặp khó khăn; `alat bantu jalan` = dụng cụ hỗ trợ đi lại.",
          "L1 Việt: `karena` nối lý do sau câu chính, giống 'vì' trong tiếng Việt nên rất dễ dùng.",
        ],
        pronunciation_focus_en: [
          "SA-ya ke-su-LI-tan naik TANG-ga ka-RE-na me-MA-kai A-lat BAN-tu JA-lan.",
          "`kesulitan` = have difficulty; `alat bantu jalan` = walking aid.",
          "VN-speaker win: `karena` links the reason after the main clause, like Vietnamese 'vì'.",
        ],
      },
      {
        en: "Apakah lift ini bisa dipakai oleh pengguna kursi roda?",
        vi: "Thang máy này người dùng xe lăn có thể sử dụng không?",
        pronunciation_focus: [
          "a-PA-kah lift I-ni BI-sa di-PA-kai O-leh peng-GU-na KUR-si RO-da.",
          "`pengguna kursi roda` = người dùng xe lăn; `dipakai oleh` = được sử dụng bởi.",
          "L1 Việt: dạng bị động `bisa dipakai oleh...` tự nhiên trong câu hỏi về fasilitas.",
        ],
        pronunciation_focus_en: [
          "a-PA-kah lift I-ni BI-sa di-PA-kai O-leh peng-GU-na KUR-si RO-da.",
          "`pengguna kursi roda` = wheelchair user; `dipakai oleh` = be used by.",
          "VN-speaker note: the passive `bisa dipakai oleh...` is natural in questions about facilities.",
        ],
      },
      {
        en: "Tolong tunjukkan jalur yang paling mudah.",
        vi: "Làm ơn chỉ giúp lối đi dễ nhất.",
        pronunciation_focus: [
          "TO-long tun-JUK-kan JA-lur yang PA-ling MU-dah.",
          "`tunjukkan` = chỉ cho/xem cho; `paling mudah` = dễ nhất.",
          "L1 Việt: `paling + tính từ` tạo so sánh nhất, giống 'nhất': `paling mudah`, `paling dekat`.",
        ],
        pronunciation_focus_en: [
          "TO-long tun-JUK-kan JA-lur yang PA-ling MU-dah.",
          "`tunjukkan` = show/point out; `paling mudah` = easiest.",
          "VN-speaker note: `paling + adjective` forms the superlative, like Vietnamese 'nhất': `paling mudah`, `paling dekat`.",
        ],
      },
      {
        en: "Terima kasih sudah membantu dengan sabar.",
        vi: "Cảm ơn vì đã hỗ trợ một cách kiên nhẫn.",
        pronunciation_focus: [
          "te-RI-ma KA-sih SU-dah mem-BAN-tu de-NGAN SA-bar.",
          "`dengan sabar` = một cách kiên nhẫn; dùng khi cảm ơn sự hỗ trợ tử tế.",
          "L1 Việt: `sudah membantu` = đã giúp; `sudah` gần với 'đã/rồi' trong tiếng Việt.",
        ],
        pronunciation_focus_en: [
          "te-RI-ma KA-sih SU-dah mem-BAN-tu de-NGAN SA-bar.",
          "`dengan sabar` = patiently; useful when thanking someone for kind support.",
          "VN-speaker win: `sudah membantu` = have helped; `sudah` maps neatly to Vietnamese 'đã/rồi'.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, `petugas` có thể là nhân viên quầy, bảo vệ, nhân viên sân ga, cán bộ dịch vụ công, hoặc người đang phụ trách khu vực. Khi cần hỗ trợ tiếp cận, câu mở đầu lịch sự như `Permisi, boleh minta bantuan?` thường hiệu quả. Nếu một fasilitas không ramah disabilitas, hãy hỏi jalur alternatif hoặc bantuan petugas thay vì cố tự đi qua khu nguy hiểm.",
    cultural_notes_en:
      "In Indonesia, `petugas` can be counter staff, security staff, station staff, public-service officers, or anyone officially on duty in an area. When you need accessibility support, a polite opener like `Permisi, boleh minta bantuan?` usually works well. If a facility is not disability-friendly, ask for an alternative route or staff assistance rather than trying to pass through an unsafe area.",
    tip_advice_vi:
      "Mẫu nhờ giúp: `Boleh minta bantuan petugas?`, `Saya kesulitan...`, `Tolong tunjukkan...`, `Apakah lift ini bisa dipakai...?`. Dùng `tolong` cho yêu cầu cụ thể, và `terima kasih` sau khi được hỗ trợ.",
    tip_advice_en:
      "Help-request frames: `Boleh minta bantuan petugas?`, `Saya kesulitan...`, `Tolong tunjukkan...`, `Apakah lift ini bisa dipakai...?`. Use `tolong` for a concrete request, and `terima kasih` after receiving help.",
    vocabulary: [
      {
        word: "bantuan petugas",
        en: "staff assistance",
        vi: "sự hỗ trợ của nhân viên/cán bộ",
        pos: "noun phrase",
        pronunciation_vi: "ban-TU-an pe-TU-gas",
        pronunciation_en: "ban-TOO-an pe-TOO-gas",
      },
      {
        word: "kesulitan",
        en: "difficulty",
        vi: "khó khăn",
        pos: "noun / verb phrase marker",
        pronunciation_vi: "ke-su-LI-tan",
        pronunciation_en: "ke-su-LEE-tan",
      },
      {
        word: "alat bantu jalan",
        en: "walking aid",
        vi: "dụng cụ hỗ trợ đi lại",
        pos: "noun phrase",
        pronunciation_vi: "A-lat BAN-tu JA-lan",
        pronunciation_en: "A-lat BAN-too JA-lan",
      },
      {
        word: "pengguna kursi roda",
        en: "wheelchair user",
        vi: "người dùng xe lăn",
        pos: "noun phrase",
        pronunciation_vi: "peng-GU-na KUR-si RO-da",
        pronunciation_en: "peng-GOO-na KOOR-see RO-da",
      },
      {
        word: "jalur alternatif",
        en: "alternative route",
        vi: "lối đi thay thế",
        pos: "noun phrase",
        pronunciation_vi: "JA-lur al-ter-na-TIF",
        pronunciation_en: "JA-loor al-ter-na-TEEF",
      },
      {
        word: "dengan sabar",
        en: "patiently",
        vi: "một cách kiên nhẫn",
        pos: "adverbial phrase",
        pronunciation_vi: "de-NGAN SA-bar",
        pronunciation_en: "de-NGAN SA-bar",
      },
    ],
    dialogue: [
      {
        speaker: "Pengunjung",
        text: "Permisi, boleh minta bantuan petugas sebentar?",
        vi: "Xin lỗi, tôi có thể nhờ nhân viên hỗ trợ một lát không?",
        en: "Excuse me, may I ask for staff assistance for a moment?",
      },
      {
        speaker: "Petugas",
        text: "Tentu. Apa yang bisa saya bantu?",
        vi: "Tất nhiên. Tôi có thể giúp gì?",
        en: "Of course. How can I help?",
      },
      {
        speaker: "Pengunjung",
        text: "Saya kesulitan naik tangga. Apakah ada jalur alternatif?",
        vi: "Tôi gặp khó khăn khi lên cầu thang. Có lối đi thay thế không?",
        en: "I have difficulty climbing stairs. Is there an alternative route?",
      },
      {
        speaker: "Petugas",
        text: "Ada. Saya tunjukkan lift yang ramah kursi roda.",
        vi: "Có. Tôi sẽ chỉ thang máy thân thiện với xe lăn.",
        en: "Yes. I will show you the wheelchair-friendly elevator.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa tiếng Việt:",
        instruction_en: "Match each phrase with its Vietnamese meaning:",
        items: [
          { prompt: "bantuan petugas", answer: "hỗ trợ của nhân viên" },
          { prompt: "kesulitan", answer: "khó khăn" },
          { prompt: "alat bantu jalan", answer: "dụng cụ hỗ trợ đi lại" },
          { prompt: "jalur alternatif", answer: "lối đi thay thế" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Chọn từ đúng:",
        instruction_en: "Choose the correct word:",
        items: [
          {
            prompt: "Boleh minta ___ petugas sebentar? (hỗ trợ)",
            answer: "bantuan",
            options: ["bantuan", "bagasi", "bayaran"],
          },
          {
            prompt: "Saya ___ naik tangga. (gặp khó khăn)",
            answer: "kesulitan",
            options: ["kesulitan", "ketinggalan", "kebetulan"],
          },
          {
            prompt: "Tolong tunjukkan jalur yang paling ___. (dễ)",
            answer: "mudah",
            options: ["mudah", "murah", "marah"],
          },
        ],
      },
    ],
  },
];
