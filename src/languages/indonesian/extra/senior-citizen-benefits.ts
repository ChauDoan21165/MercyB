// Indonesian senior citizen benefits lesson pack for Vietnamese learners.
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
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type DialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

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
  content?: string;
};

export const seniorCitizenBenefitsLessons: IndonesianLesson[] = [
  {
    id: "indonesian_lansia_social_assistance_documents",
    level: "B1",
    category: "public_services",
    title_vi: "Lansia, bantuan sosial và dokumen cần chuẩn bị",
    title_en: "Senior citizens, social assistance, and required documents",
    sentences: [
      {
        en: "Nenek saya sudah lansia dan tinggal bersama keluarga.",
        vi: "Bà tôi đã là người cao tuổi và sống cùng gia đình.",
        pronunciation_focus: [
          "NE-nek SA-ya SU-dah LAN-si-a dan TING-gal ber-SA-ma ke-LU-ar-ga.",
          "`lansia` = lanjut usia, người cao tuổi; ngắn gọn và phổ biến trong dịch vụ công.",
          "L1 Việt: `orang tua` có thể nghĩa là cha mẹ, nên khi nói người cao tuổi hãy dùng `lansia` hoặc `lanjut usia`.",
        ],
        pronunciation_focus_en: [
          "NE-nek SA-ya SU-dah LAN-si-a dan TING-gal ber-SA-ma ke-LU-ar-ga.",
          "`lansia` = elderly/senior citizen; short for `lanjut usia` and common in public services.",
          "VN-speaker trap: `orang tua` can mean parents, so use `lansia` or `lanjut usia` for senior citizens.",
        ],
      },
      {
        en: "Apakah ada bantuan sosial untuk lansia di kelurahan ini?",
        vi: "Có trợ cấp xã hội cho người cao tuổi ở phường này không?",
        pronunciation_focus: [
          "a-PA-kah A-da ban-TU-an so-SI-al UN-tuk LAN-si-a di ke-lu-RA-han I-ni.",
          "`bantuan sosial` = trợ cấp/hỗ trợ xã hội; thường rút gọn là `bansos`.",
          "L1 Việt: hỏi có/không trong văn phòng dùng `apakah ada...` nghe rõ và lịch sự.",
        ],
        pronunciation_focus_en: [
          "a-PA-kah A-da ban-TU-an so-SI-al UN-tuk LAN-si-a di ke-lu-RA-han I-ni.",
          "`bantuan sosial` = social assistance; often shortened to `bansos`.",
          "VN-speaker note: for yes/no office questions, `apakah ada...` is clear and polite.",
        ],
      },
      {
        en: "Dokumen apa saja yang perlu dibawa untuk daftar kartu lansia?",
        vi: "Cần mang những giấy tờ gì để đăng ký thẻ người cao tuổi?",
        pronunciation_focus: [
          "DO-ku-men A-pa SA-ja yang per-LU di-BA-wa UN-tuk DAF-tar KAR-tu LAN-si-a.",
          "`kartu lansia` = thẻ người cao tuổi; `apa saja` hỏi cả danh sách giấy tờ.",
          "L1 Việt: đừng hỏi `dokumen apa` nếu cần danh sách. Thêm `saja`: `dokumen apa saja`.",
        ],
        pronunciation_focus_en: [
          "DO-ku-men A-pa SA-ja yang per-LU di-BA-wa UN-tuk DAF-tar KAR-tu LAN-si-a.",
          "`kartu lansia` = senior citizen card; `apa saja` asks for the full document list.",
          "VN-speaker trap: do not ask `dokumen apa` if you need a list. Add `saja`: `dokumen apa saja`.",
        ],
      },
      {
        en: "Kami membawa KTP, kartu keluarga, dan surat keterangan domisili.",
        vi: "Chúng tôi mang KTP, sổ hộ khẩu và giấy xác nhận nơi cư trú.",
        pronunciation_focus: [
          "KA-mi mem-BA-wa ka-te-PE, KAR-tu ke-LU-ar-ga, dan SU-rat ke-te-RANG-an do-mi-SI-li.",
          "`kartu keluarga` = thẻ/sổ gia đình; `surat keterangan domisili` = giấy xác nhận cư trú.",
          "L1 Việt: đọc `KTP` theo chữ cái Indonesia: ka-te-PE, không đọc kiểu tiếng Anh.",
        ],
        pronunciation_focus_en: [
          "KA-mi mem-BA-wa ka-te-PE, KAR-tu ke-LU-ar-ga, dan SU-rat ke-te-RANG-an do-mi-SI-li.",
          "`kartu keluarga` = family card; `surat keterangan domisili` = residence certificate.",
          "VN-speaker trap: spell `KTP` using Indonesian letter names: ka-te-PE, not English-style letters.",
        ],
      },
      {
        en: "Keluarga pendamping boleh membantu mengisi formulir.",
        vi: "Người nhà đi cùng có thể hỗ trợ điền biểu mẫu.",
        pronunciation_focus: [
          "ke-LU-ar-ga pen-DAM-ping BO-leh mem-BAN-tu me-NGI-si for-MU-lir.",
          "`keluarga pendamping` = người nhà đi cùng/hỗ trợ; `mengisi formulir` = điền biểu mẫu.",
          "L1 Việt: `boleh` ở đây là được phép, không chỉ là 'có thể' về khả năng.",
        ],
        pronunciation_focus_en: [
          "ke-LU-ar-ga pen-DAM-ping BO-leh mem-BAN-tu me-NGI-si for-MU-lir.",
          "`keluarga pendamping` = accompanying family member; `mengisi formulir` = fill out a form.",
          "VN-speaker note: `boleh` here means allowed/permitted, not only physically able.",
        ],
      },
    ],
    cultural_notes_vi:
      "Istilah `lansia` sering dipakai di puskesmas, kelurahan, kantor dinas sosial, dan layanan warga. Bantuan untuk lansia bisa berbeda menurut daerah: bantuan sosial, kartu lansia, layanan kesehatan, antrean prioritas, atau kegiatan posyandu lansia. Dokumen biasanya melibatkan KTP, kartu keluarga, alamat domisili, dan kadang surat keterangan dari RT/RW atau kelurahan.",
    cultural_notes_en:
      "`Lansia` is commonly used at puskesmas, neighborhood offices, social affairs offices, and community services. Senior assistance varies by region: social assistance, senior cards, healthcare services, priority queues, or elderly posyandu activities. Documents often involve ID, family card, residence address, and sometimes a letter from RT/RW or the local office.",
    tip_advice_vi:
      "Mẫu hành chính cần thuộc: `Apakah ada bantuan sosial untuk lansia?`, `Dokumen apa saja yang perlu dibawa?`, `Kami membawa KTP...`, `Keluarga pendamping boleh membantu?`. Người Việt nên dùng `lansia` thay vì dịch thô `người già`.",
    tip_advice_en:
      "Administrative chunks to memorize: `Apakah ada bantuan sosial untuk lansia?`, `Dokumen apa saja yang perlu dibawa?`, `Kami membawa KTP...`, `Keluarga pendamping boleh membantu?`. Vietnamese speakers should use `lansia` instead of a blunt literal 'old person'.",
    vocabulary: [
      {
        cell_id: "25d07a84-e274-403e-ba55-ae96f11d6523",
        word: "lansia",
        en: "senior citizen / elderly person",
        vi: "người cao tuổi",
        pos: "noun",
        pronunciation_vi: "LAN-si-a",
        pronunciation_en: "LAN-see-a",
      },
      {
        cell_id: "7bdb1ddc-af45-48a9-95db-6daf321488a6",
        word: "bantuan sosial",
        en: "social assistance",
        vi: "trợ cấp / hỗ trợ xã hội",
        pos: "noun phrase",
        pronunciation_vi: "ban-TU-an so-SI-al",
        pronunciation_en: "ban-TOO-an so-SEE-al",
      },
      {
        cell_id: "5cd3d521-9446-4c88-a485-bed451c381f1",
        word: "kartu lansia",
        en: "senior citizen card",
        vi: "thẻ người cao tuổi",
        pos: "noun phrase",
        pronunciation_vi: "KAR-tu LAN-si-a",
        pronunciation_en: "KAR-too LAN-see-a",
      },
      {
        cell_id: "f1b1d76a-3c6d-4ce0-b6b0-f953020d6a51",
        word: "kartu keluarga",
        en: "family card",
        vi: "sổ/thẻ gia đình",
        pos: "noun phrase",
        pronunciation_vi: "KAR-tu ke-LU-ar-ga",
        pronunciation_en: "KAR-too ke-LOO-ar-ga",
      },
      {
        cell_id: "506842f0-4e48-4aa5-865d-4d61b4bd8a79",
        word: "keluarga pendamping",
        en: "accompanying family member",
        vi: "người nhà đi cùng / hỗ trợ",
        pos: "noun phrase",
        pronunciation_vi: "ke-LU-ar-ga pen-DAM-ping",
        pronunciation_en: "ke-LOO-ar-ga pen-DAM-ping",
      },
      {
        cell_id: "e7bc8460-fcc2-48c4-98e0-0d5d4d3d7849",
        word: "dokumen",
        en: "documents",
        vi: "giấy tờ / tài liệu",
        pos: "noun",
        pronunciation_vi: "DO-ku-men",
        pronunciation_en: "DO-ku-men",
      },
    ],
    dialogue: [
      {
        cell_id: "882152b9-243f-4374-a4a7-aabd83babfc8",
        speaker: "Keluarga",
        text: "Permisi, Bu. Apakah ada bantuan sosial untuk lansia?",
        vi: "Xin lỗi cô/chị. Có trợ cấp xã hội cho người cao tuổi không?",
        en: "Excuse me, Ma'am. Is there social assistance for seniors?",
      },
      {
        cell_id: "ab96d023-4b83-465e-a8b5-3d30869705d7",
        speaker: "Petugas",
        text: "Ada program daerah, tetapi harus cek data dulu.",
        vi: "Có chương trình địa phương, nhưng phải kiểm tra dữ liệu trước.",
        en: "There is a local program, but we need to check the data first.",
      },
      {
        cell_id: "88255e24-364c-4577-a483-16eb6be9abf8",
        speaker: "Keluarga",
        text: "Dokumen apa saja yang perlu kami bawa?",
        vi: "Chúng tôi cần mang những giấy tờ gì?",
        en: "What documents do we need to bring?",
      },
      {
        cell_id: "28a0a9f0-9d6e-4f96-bc57-12b4c2552e5b",
        speaker: "Petugas",
        text: "Bawa KTP, kartu keluarga, dan surat keterangan domisili.",
        vi: "Mang KTP, thẻ gia đình và giấy xác nhận cư trú.",
        en: "Bring the ID card, family card, and residence certificate.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ phù hợp về layanan lansia:",
        instruction_en: "Fill in the suitable senior-service word:",
        items: [
          {
            prompt: "Apakah ada bantuan sosial untuk ___? (người cao tuổi)",
            answer: "lansia",
            options: ["lansia", "laundry", "lampu"],
          },
          {
            prompt: "Dokumen apa ___ yang perlu dibawa? (những gì)",
            answer: "saja",
            options: ["saja", "sakit", "salah"],
          },
          {
            prompt: "Keluarga pendamping boleh membantu mengisi ___. (biểu mẫu)",
            answer: "formulir",
            options: ["formulir", "fasilitas", "fotokopi"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Có trợ cấp xã hội cho người cao tuổi không?", answer: "Apakah ada bantuan sosial untuk lansia?" },
          { prompt: "Cần mang những giấy tờ gì?", answer: "Dokumen apa saja yang perlu dibawa?" },
          { prompt: "Người nhà đi cùng có thể hỗ trợ điền biểu mẫu.", answer: "Keluarga pendamping boleh membantu mengisi formulir." },
        ],
      },
    ],
  },
  {
    id: "indonesian_priority_queue_puskesmas_lansia",
    level: "B1",
    category: "public_services",
    title_vi: "Antrean prioritas, puskesmas và layanan warga cho lansia",
    title_en: "Priority queues, puskesmas, and community services for seniors",
    sentences: [
      {
        en: "Apakah ada antrean prioritas untuk lansia?",
        vi: "Có hàng chờ ưu tiên cho người cao tuổi không?",
        pronunciation_focus: [
          "a-PA-kah A-da an-TRE-an pri-o-ri-TAS UN-tuk LAN-si-a.",
          "`antrean prioritas` = hàng chờ ưu tiên; thường dùng cho lansia, difabel, ibu hamil.",
          "L1 Việt: `prioritas` là từ mượn, nhấn cuối: pri-o-ri-TAS.",
        ],
        pronunciation_focus_en: [
          "a-PA-kah A-da an-TRE-an pri-o-ri-TAS UN-tuk LAN-si-a.",
          "`antrean prioritas` = priority queue; often for seniors, disabled people, pregnant women.",
          "VN-speaker note: `prioritas` is a loanword with final stress: pri-o-ri-TAS.",
        ],
      },
      {
        en: "Puskesmas menyediakan layanan pemeriksaan rutin untuk lansia.",
        vi: "Puskesmas cung cấp dịch vụ kiểm tra định kỳ cho người cao tuổi.",
        pronunciation_focus: [
          "PUS-kes-mas me-nye-DI-a-kan LA-yan-an pe-me-RIK-sa-an ru-TIN UN-tuk LAN-si-a.",
          "`pemeriksaan rutin` = kiểm tra định kỳ; `menyediakan layanan` = cung cấp dịch vụ.",
          "L1 Việt: `puskesmas` là trung tâm y tế cộng đồng, không phải bệnh viện lớn.",
        ],
        pronunciation_focus_en: [
          "PUS-kes-mas me-nye-DI-a-kan LA-yan-an pe-me-RIK-sa-an ru-TIN UN-tuk LAN-si-a.",
          "`pemeriksaan rutin` = routine checkup; `menyediakan layanan` = provide a service.",
          "VN-speaker trap: `puskesmas` is a community health center, not a large hospital.",
        ],
      },
      {
        en: "Bapak bisa datang dengan keluarga pendamping.",
        vi: "Ông/bác có thể đến cùng người nhà đi kèm.",
        pronunciation_focus: [
          "BA-pak BI-sa DA-tang de-NGAN ke-LU-ar-ga pen-DAM-ping.",
          "`datang dengan keluarga pendamping` = đến cùng người nhà hỗ trợ.",
          "L1 Việt: trong dịch vụ công, `Bapak/Ibu` là cách gọi lịch sự, không nhất thiết là cha/mẹ.",
        ],
        pronunciation_focus_en: [
          "BA-pak BI-sa DA-tang de-NGAN ke-LU-ar-ga pen-DAM-ping.",
          "`datang dengan keluarga pendamping` = come with an accompanying family member.",
          "VN-speaker note: in public services, `Bapak/Ibu` is polite address, not necessarily father/mother.",
        ],
      },
      {
        en: "Kalau sulit berjalan, petugas bisa membantu di loket.",
        vi: "Nếu khó đi lại, nhân viên có thể hỗ trợ ở quầy.",
        pronunciation_focus: [
          "KA-lau SU-lit ber-JA-lan, pe-TU-gas BI-sa mem-BAN-tu di LO-ket.",
          "`sulit berjalan` = khó đi lại; `petugas` = nhân viên/cán bộ đang làm nhiệm vụ.",
          "L1 Việt: `loket` là quầy/cửa giao dịch; đọc rõ âm cuối `t`.",
        ],
        pronunciation_focus_en: [
          "KA-lau SU-lit ber-JA-lan, pe-TU-gas BI-sa mem-BAN-tu di LO-ket.",
          "`sulit berjalan` = have difficulty walking; `petugas` = staff/officer on duty.",
          "VN-speaker note: `loket` is a counter/window; pronounce the final `t` clearly.",
        ],
      },
      {
        en: "Informasi layanan warga bisa ditanyakan ke Pak RT atau kelurahan.",
        vi: "Thông tin dịch vụ cư dân có thể hỏi Pak RT hoặc phường.",
        pronunciation_focus: [
          "in-for-MA-si LA-yan-an WAR-ga BI-sa di-TA-nya-kan ke Pak er-TE A-tau ke-lu-RA-han.",
          "`layanan warga` = dịch vụ cho cư dân; `ditanyakan ke` = có thể hỏi tới/ở.",
          "L1 Việt: khi hỏi nơi/người nhận câu hỏi, dùng `ke Pak RT` hoặc `ke kelurahan`.",
        ],
        pronunciation_focus_en: [
          "in-for-MA-si LA-yan-an WAR-ga BI-sa di-TA-nya-kan ke Pak er-TE A-tau ke-lu-RA-han.",
          "`layanan warga` = resident/community services; `ditanyakan ke` = can be asked to/at.",
          "VN-speaker note: for the person/place receiving the question, use `ke Pak RT` or `ke kelurahan`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Lansia sering mendapat perhatian khusus dalam layanan warga: antrean prioritas, pemeriksaan rutin di puskesmas, kegiatan posyandu lansia, atau bantuan sosial tertentu. Nhưng aturan thực tế phụ thuộc daerah, data kependudukan, usia, kondisi ekonomi, dan program yang sedang berjalan. Tanyakan secara langsung ke kelurahan, RT/RW, puskesmas, atau dinas sosial setempat.",
    cultural_notes_en:
      "Seniors often receive special attention in community services: priority queues, routine checkups at puskesmas, elderly posyandu activities, or certain social assistance programs. Actual rules depend on the region, population data, age, economic condition, and active programs. Ask directly at the neighborhood office, RT/RW, puskesmas, or local social affairs office.",
    tip_advice_vi:
      "Mẫu nên dùng với petugas: `Apakah ada antrean prioritas?`, `Puskesmas menyediakan layanan apa?`, `Bisa datang dengan keluarga pendamping?`, `Informasi layanan warga bisa ditanyakan ke mana?`. Giữ giọng lễ phép với `Pak/Bu`, `mohon`, `boleh`, `apakah`.",
    tip_advice_en:
      "Useful staff-facing frames: `Apakah ada antrean prioritas?`, `Puskesmas menyediakan layanan apa?`, `Bisa datang dengan keluarga pendamping?`, `Informasi layanan warga bisa ditanyakan ke mana?`. Keep the register polite with `Pak/Bu`, `mohon`, `boleh`, `apakah`.",
    vocabulary: [
      {
        cell_id: "933be1c1-4377-4750-bd22-eec30a598beb",
        word: "antrean prioritas",
        en: "priority queue",
        vi: "hàng chờ ưu tiên",
        pos: "noun phrase",
        pronunciation_vi: "an-TRE-an pri-o-ri-TAS",
        pronunciation_en: "an-TRE-an pri-o-ri-TAS",
      },
      {
        cell_id: "d38a62b3-3735-47b1-a995-83e3b33ec380",
        word: "puskesmas",
        en: "community health center",
        vi: "trung tâm y tế cộng đồng",
        pos: "noun",
        pronunciation_vi: "PUS-kes-mas",
        pronunciation_en: "PUS-kes-mas",
      },
      {
        cell_id: "d29a2908-7b70-4cb3-b0d6-03f3bf7d9232",
        word: "pemeriksaan rutin",
        en: "routine checkup",
        vi: "kiểm tra định kỳ",
        pos: "noun phrase",
        pronunciation_vi: "pe-me-RIK-sa-an ru-TIN",
        pronunciation_en: "pe-me-RIK-sa-an roo-TEEN",
      },
      {
        cell_id: "f3ceb9b7-bf14-481a-bf6c-09b13b2e1e8f",
        word: "layanan warga",
        en: "resident/community service",
        vi: "dịch vụ cư dân / cộng đồng",
        pos: "noun phrase",
        pronunciation_vi: "LA-yan-an WAR-ga",
        pronunciation_en: "LA-yan-an WAR-ga",
      },
      {
        cell_id: "3ade90f4-2658-43c0-add9-943c456d3720",
        word: "petugas",
        en: "staff / officer on duty",
        vi: "nhân viên / cán bộ phụ trách",
        pos: "noun",
        pronunciation_vi: "pe-TU-gas",
        pronunciation_en: "pe-TOO-gas",
      },
      {
        cell_id: "4da340eb-dae3-4056-84fd-bc7955f8f330",
        word: "sulit berjalan",
        en: "difficulty walking",
        vi: "khó đi lại",
        pos: "phrase",
        pronunciation_vi: "SU-lit ber-JA-lan",
        pronunciation_en: "SOO-lit ber-JA-lan",
      },
    ],
    dialogue: [
      {
        cell_id: "b2506aa1-8325-4801-8057-b7055ff01c4e",
        speaker: "Keluarga",
        text: "Apakah ada antrean prioritas untuk lansia di puskesmas ini?",
        vi: "Ở puskesmas này có hàng chờ ưu tiên cho người cao tuổi không?",
        en: "Is there a priority queue for seniors at this puskesmas?",
      },
      {
        cell_id: "9ced2d07-853a-4f5b-adc7-fa9ff7079e39",
        speaker: "Petugas",
        text: "Ada, Pak. Lansia bisa daftar di loket sebelah kiri.",
        vi: "Có ạ. Người cao tuổi có thể đăng ký ở quầy bên trái.",
        en: "Yes, Sir. Seniors can register at the counter on the left.",
      },
      {
        cell_id: "af3b8b58-c860-4457-b4d2-8373ff97a0e0",
        speaker: "Keluarga",
        text: "Bapak saya sulit berjalan. Boleh saya dampingi sampai loket?",
        vi: "Bố tôi khó đi lại. Tôi có thể đi cùng hỗ trợ đến quầy không?",
        en: "My father has difficulty walking. May I accompany him to the counter?",
      },
      {
        cell_id: "840fe56a-4960-4aa5-910c-3b9dd4ac5e6a",
        speaker: "Petugas",
        text: "Boleh. Kalau perlu, petugas juga bisa membantu.",
        vi: "Được. Nếu cần, nhân viên cũng có thể hỗ trợ.",
        en: "Yes. If needed, staff can also help.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa tiếng Việt:",
        instruction_en: "Match each phrase with its Vietnamese meaning:",
        items: [
          { prompt: "antrean prioritas", answer: "hàng chờ ưu tiên" },
          { prompt: "puskesmas", answer: "trung tâm y tế cộng đồng" },
          { prompt: "layanan warga", answer: "dịch vụ cư dân / cộng đồng" },
          { prompt: "sulit berjalan", answer: "khó đi lại" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Chọn từ đúng:",
        instruction_en: "Choose the correct word:",
        items: [
          {
            prompt: "Apakah ada antrean ___ untuk lansia? (ưu tiên)",
            answer: "prioritas",
            options: ["prioritas", "pindahan", "perbaikan"],
          },
          {
            prompt: "Puskesmas menyediakan layanan pemeriksaan ___ untuk lansia. (định kỳ)",
            answer: "rutin",
            options: ["rutin", "rusak", "ringan"],
          },
          {
            prompt: "Informasi layanan warga bisa ditanyakan ke Pak ___ atau kelurahan.",
            answer: "RT",
            options: ["RT", "AC", "SIM"],
          },
        ],
      },
    ],
  },
];
