// src/languages/indonesian/extra/marriage-civil-registry.ts
//
// Indonesian marriage and civil-registry paperwork pack for Vietnamese learners.
// Covers: catatan sipil, buku nikah, akta nikah, syarat dokumen, saksi,
// legalisasi, and status perkawinan. Vietnamese-first with English companions,
// following the established Indonesian extra lesson shape.

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

export const marriageCivilRegistryLessons: IndonesianLesson[] = [
  {
    id: "indonesian_marriage_registry_documents",
    level: "B1",
    category: "life_admin",
    title_vi: "Đăng ký kết hôn ở catatan sipil",
    title_en: "Registering a marriage at civil registry",
    sentences: [
      {
        en: "Kami mau mendaftarkan pernikahan di catatan sipil.",
        vi: "Chúng tôi muốn đăng ký hôn nhân ở cơ quan hộ tịch.",
        pronunciation_focus: [
          "mendaftarkan → men-DAF-tar-kan, đăng ký một việc/hồ sơ",
          "pernikahan → per-ni-KA-han, hôn nhân/đám cưới; trang trọng hơn 'nikah'",
          "catatan sipil → ca-TA-tan SI-pil, cơ quan hộ tịch/dân sự",
        ],
        pronunciation_focus_en: [
          "mendaftarkan → 'men-DAF-tar-kan' — register something/an application",
          "pernikahan → 'per-nee-KA-han' — marriage/wedding; more formal than 'nikah'",
          "catatan sipil → 'cha-TA-tan SEE-pil' — civil registry",
        ],
      },
      {
        en: "Apa saja syarat dokumen untuk akta nikah?",
        vi: "Cần những giấy tờ nào cho giấy chứng nhận kết hôn?",
        pronunciation_focus: [
          "apa saja → những gì/những cái nào; rất hay dùng ở cơ quan",
          "syarat dokumen → điều kiện/giấy tờ bắt buộc",
          "akta nikah → giấy chứng nhận kết hôn; akta = giấy chứng nhận/hộ tịch",
        ],
        pronunciation_focus_en: [
          "apa saja → what items/which things; very common in offices",
          "syarat dokumen → required documents/conditions",
          "akta nikah → marriage certificate; akta = civil certificate/deed",
        ],
      },
      {
        en: "Kami sudah membawa KTP, KK, pas foto, dan surat pengantar.",
        vi: "Chúng tôi đã mang căn cước, sổ hộ khẩu gia đình, ảnh thẻ và giấy giới thiệu.",
        pronunciation_focus: [
          "membawa → mem-BA-wa, mang theo; dạng trang trọng của 'bawa'",
          "KTP, KK → căn cước và thẻ/sổ gia đình; đọc từng chữ",
          "surat pengantar → giấy giới thiệu/chuyển từ RT/RW hoặc cơ quan liên quan",
        ],
        pronunciation_focus_en: [
          "membawa → 'mem-BA-wa' — bring; formal form of 'bawa'",
          "KTP, KK → ID card and family card; spell the letters",
          "surat pengantar → introduction/referral letter from RT/RW or relevant office",
        ],
      },
      {
        en: "Apakah kami perlu dua orang saksi saat pendaftaran?",
        vi: "Chúng tôi có cần hai người làm chứng khi đăng ký không?",
        pronunciation_focus: [
          "perlu → PER-lu, cần",
          "dua orang saksi → hai người làm chứng; người đếm bằng 'orang'",
          "saat pendaftaran → lúc đăng ký; pendaftaran = việc đăng ký",
        ],
        pronunciation_focus_en: [
          "perlu → 'PER-loo' — need",
          "dua orang saksi → two witnesses; people are counted with 'orang'",
          "saat pendaftaran → during registration; pendaftaran = registration",
        ],
      },
      {
        en: "Status perkawinan saya masih lajang di KTP.",
        vi: "Tình trạng hôn nhân của tôi vẫn là độc thân trên căn cước.",
        pronunciation_focus: [
          "status perkawinan → tình trạng hôn nhân",
          "masih lajang → vẫn độc thân/chưa kết hôn",
          "di KTP → trên/trong căn cước; di dùng cho vị trí thông tin",
        ],
        pronunciation_focus_en: [
          "status perkawinan → marital status",
          "masih lajang → still single/unmarried",
          "di KTP → on/in the ID card; di marks information location",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, thủ tục hôn nhân phụ thuộc vào tôn giáo và tình trạng công dân. Cặp Hồi giáo thường có 'buku nikah' từ KUA (Kantor Urusan Agama). Cặp ngoài Hồi giáo thường đăng ký ở 'Dukcapil/catatan sipil' để có 'akta perkawinan' hoặc 'akta nikah'. Giấy tờ có thể gồm KTP, KK, pas foto, surat pengantar RT/RW, giấy chứng nhận chưa kết hôn, giấy từ nơi thờ tự, và saksi. Với hôn nhân có yếu tố nước ngoài, thường cần giấy tờ dari kedutaan, terjemahan tersumpah, dan legalisasi.",
    cultural_notes_en:
      "In Indonesia, marriage paperwork depends on religion and citizenship status. Muslim couples usually receive a 'buku nikah' from the KUA (Office of Religious Affairs). Non-Muslim couples usually register with 'Dukcapil/catatan sipil' to receive an 'akta perkawinan' or 'akta nikah'. Documents may include KTP, KK, passport photos, RT/RW referral letters, certificate of no impediment/single status, religious venue paperwork, and witnesses. International marriages often require embassy documents, sworn translations, and legalization.",
    tip_advice_vi:
      "Mẹo cho người Việt: 'nikah' là nói thường, còn trong giấy tờ hay gặp 'pernikahan' hoặc 'perkawinan'. 'Akta' là giấy chứng nhận hộ tịch, còn 'buku nikah' là sổ hôn nhân của KUA. Khi hỏi thủ tục, câu mạnh nhất là 'Apa saja syarat dokumennya?'",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'nikah' is conversational, while paperwork often uses 'pernikahan' or 'perkawinan'. 'Akta' is a civil certificate, while 'buku nikah' is the marriage booklet from KUA. The most useful office question is 'Apa saja syarat dokumennya?'",
    vocabulary: [
      {
        cell_id: "577e397c-4269-40c5-898f-36f07d1d52e5",
        word: "catatan sipil",
        en: "civil registry",
        vi: "cơ quan hộ tịch",
        pos: "noun phrase",
        pronunciation_vi: "ca-TA-tan SI-pil",
        pronunciation_en: "cha-TA-tan SEE-pil",
      },
      {
        cell_id: "ab4beba0-07ec-4a1c-8975-2a41566e7039",
        word: "akta nikah",
        en: "marriage certificate",
        vi: "giấy chứng nhận kết hôn",
        pos: "noun phrase",
        pronunciation_vi: "AK-ta NI-kah",
        pronunciation_en: "AK-ta NEE-kah",
      },
      {
        cell_id: "ad65c24c-f2c1-4cf8-af47-4c2f29145593",
        word: "buku nikah",
        en: "marriage booklet",
        vi: "sổ hôn nhân",
        pos: "noun phrase",
        pronunciation_vi: "BU-ku NI-kah",
        pronunciation_en: "BOO-koo NEE-kah",
      },
      {
        cell_id: "bfc9ab7b-648b-479f-87f2-b06a680a3de2",
        word: "syarat dokumen",
        en: "document requirements",
        vi: "điều kiện giấy tờ",
        pos: "noun phrase",
        pronunciation_vi: "SYA-rat do-ku-MEN",
        pronunciation_en: "SYA-rat do-ku-MEN",
      },
      {
        cell_id: "c118355f-8568-407a-b85f-70a4898f1eb9",
        word: "saksi",
        en: "witness",
        vi: "người làm chứng",
        pos: "noun",
        pronunciation_vi: "SAK-si",
        pronunciation_en: "SAK-see",
      },
      {
        cell_id: "a60db6ee-4559-48c8-b112-7437de326141",
        word: "status perkawinan",
        en: "marital status",
        vi: "tình trạng hôn nhân",
        pos: "noun phrase",
        pronunciation_vi: "STA-tus per-ka-WI-nan",
        pronunciation_en: "STA-toos per-ka-WEE-nan",
      },
      {
        cell_id: "fd12f3bf-f7d5-4faf-92ac-6430803447c3",
        word: "lajang",
        en: "single / unmarried",
        vi: "độc thân",
        pos: "adjective",
        pronunciation_vi: "LA-jang",
        pronunciation_en: "LA-jang",
      },
    ],
    dialogue: [
      {
        cell_id: "33f26df2-e4ce-4c3e-9c12-f504f483ef4c",
        speaker: "Pemohon",
        text: "Selamat pagi, kami mau mendaftarkan pernikahan di catatan sipil.",
        vi: "Chào buổi sáng, chúng tôi muốn đăng ký hôn nhân ở cơ quan hộ tịch.",
        en: "Good morning, we want to register our marriage at the civil registry.",
      },
      {
        cell_id: "4a946a6c-4d72-44db-8654-637c42e51902",
        speaker: "Petugas",
        text: "Baik. Boleh saya cek syarat dokumennya dulu?",
        vi: "Vâng. Tôi kiểm tra điều kiện giấy tờ trước được không?",
        en: "Okay. May I check the document requirements first?",
      },
      {
        cell_id: "c017f064-ebe0-4adc-a7d4-f1da6aaafd64",
        speaker: "Pemohon",
        text: "Kami membawa KTP, KK, pas foto, dan surat pengantar.",
        vi: "Chúng tôi mang căn cước, thẻ gia đình, ảnh thẻ và giấy giới thiệu.",
        en: "We brought ID cards, family cards, passport photos, and referral letters.",
      },
      {
        cell_id: "8d4edfa9-216c-472f-87c2-e771b52e604a",
        speaker: "Petugas",
        text: "Nanti saat pendaftaran perlu dua orang saksi.",
        vi: "Lát nữa khi đăng ký cần hai người làm chứng.",
        en: "Later during registration you need two witnesses.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ thủ tục hôn nhân còn thiếu:",
        instruction_en: "Fill in the missing marriage-paperwork word:",
        items: [
          {
            prompt: "Kami mau mendaftarkan pernikahan di catatan ___. (hộ tịch)",
            answer: "sipil",
            options: ["sipil", "sakit", "saksi"],
          },
          {
            prompt: "Apa saja syarat ___ untuk akta nikah? (giấy tờ)",
            answer: "dokumen",
            options: ["dokumen", "dompet", "dosen"],
          },
          {
            prompt: "Kami perlu dua orang ___. (người làm chứng)",
            answer: "saksi",
            options: ["saksi", "sapi", "saran"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "catatan sipil", answer: "cơ quan hộ tịch" },
          { prompt: "akta nikah", answer: "giấy chứng nhận kết hôn" },
          { prompt: "saksi", answer: "người làm chứng" },
          { prompt: "lajang", answer: "độc thân" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Chúng tôi muốn đăng ký hôn nhân ở cơ quan hộ tịch.", answer: "Kami mau mendaftarkan pernikahan di catatan sipil." },
          { prompt: "Cần những giấy tờ nào cho giấy chứng nhận kết hôn?", answer: "Apa saja syarat dokumen untuk akta nikah?" },
          { prompt: "Tình trạng hôn nhân của tôi vẫn là độc thân trên căn cước.", answer: "Status perkawinan saya masih lajang di KTP." },
        ],
      },
    ],
  },
  {
    id: "indonesian_marriage_certificate_legalization",
    level: "B1",
    category: "life_admin",
    title_vi: "Buku nikah, legalisasi và đổi tình trạng hôn nhân",
    title_en: "Marriage booklets, legalization and status changes",
    sentences: [
      {
        en: "Kami perlu legalisasi buku nikah untuk urusan visa.",
        vi: "Chúng tôi cần hợp pháp hóa sổ hôn nhân cho việc visa.",
        pronunciation_focus: [
          "legalisasi → le-ga-li-SA-si, hợp pháp hóa/chứng thực",
          "buku nikah → sổ hôn nhân; thường từ KUA cho cặp Hồi giáo",
          "urusan visa → việc/liên quan đến visa; urusan = công việc/vấn đề",
        ],
        pronunciation_focus_en: [
          "legalisasi → 'le-ga-lee-SA-see' — legalization/certification",
          "buku nikah → marriage booklet; usually from KUA for Muslim couples",
          "urusan visa → visa matter; urusan = matter/affair",
        ],
      },
      {
        en: "Akta nikah ini harus diterjemahkan oleh penerjemah tersumpah.",
        vi: "Giấy chứng nhận kết hôn này phải được dịch bởi phiên dịch viên tuyên thệ.",
        pronunciation_focus: [
          "harus diterjemahkan → phải được dịch; di-...-kan bị động",
          "penerjemah tersumpah → người dịch tuyên thệ/công chứng",
          "akta nikah ini → giấy chứng nhận kết hôn này",
        ],
        pronunciation_focus_en: [
          "harus diterjemahkan → must be translated; passive di-...-kan",
          "penerjemah tersumpah → sworn translator",
          "akta nikah ini → this marriage certificate",
        ],
      },
      {
        en: "Setelah menikah, saya harus mengubah status perkawinan di KTP.",
        vi: "Sau khi kết hôn, tôi phải đổi tình trạng hôn nhân trên căn cước.",
        pronunciation_focus: [
          "setelah menikah → sau khi kết hôn",
          "mengubah → me-NGU-bah, thay đổi/đổi",
          "di KTP → trên/trong căn cước; dùng di vì là vị trí thông tin",
        ],
        pronunciation_focus_en: [
          "setelah menikah → after getting married",
          "mengubah → 'me-NGOO-bah' — change",
          "di KTP → on/in the ID card; di marks information location",
        ],
      },
      {
        en: "Apakah fotokopi dokumen harus dilegalisasi juga?",
        vi: "Bản phô-tô giấy tờ cũng phải được chứng thực không?",
        pronunciation_focus: [
          "fotokopi dokumen → bản sao giấy tờ",
          "harus dilegalisasi → phải được hợp pháp hóa/chứng thực",
          "juga → cũng; đặt cuối câu để thêm ý",
        ],
        pronunciation_focus_en: [
          "fotokopi dokumen → photocopy of documents",
          "harus dilegalisasi → must be legalized/certified",
          "juga → also; placed late in the sentence to add the idea",
        ],
      },
      {
        en: "Kalau ada kesalahan nama, bagaimana cara memperbaikinya?",
        vi: "Nếu có lỗi tên, cách sửa như thế nào?",
        pronunciation_focus: [
          "kesalahan nama → lỗi tên; ke-...-an tạo danh từ trừu tượng",
          "bagaimana cara → cách như thế nào",
          "memperbaikinya → sửa nó; memper- từ gốc baik = làm cho đúng/tốt",
        ],
        pronunciation_focus_en: [
          "kesalahan nama → name error; ke-...-an forms an abstract noun",
          "bagaimana cara → what is the way/how",
          "memperbaikinya → fix it; memper- from root baik = make right/good",
        ],
      },
    ],
    cultural_notes_vi:
      "Sau khi kết hôn, một số thủ tục có thể cần cập nhật 'status perkawinan' ở KTP/KK, xin bản legalisasi, hoặc dịch 'akta nikah' sang tiếng nước ngoài. 'Legalisasi' có thể diễn ra ở Dukcapil, KUA, Kementerian, notaris, hoặc kedutaan tùy mục đích. Nếu giấy tờ dùng cho nước ngoài, hãy hỏi rõ apakah perlu apostille, terjemahan tersumpah, atau cap kedutaan. Đừng tự đoán vì mỗi cơ quan có yêu cầu khác nhau.",
    cultural_notes_en:
      "After marriage, some paperwork may require updating 'status perkawinan' on KTP/KK, getting legalized copies, or translating an 'akta nikah' into a foreign language. 'Legalisasi' may happen at Dukcapil, KUA, a ministry, notary, or embassy depending on purpose. If documents are for overseas use, ask clearly whether apostille, sworn translation, or embassy stamp is required. Do not guess because every office may have different requirements.",
    tip_advice_vi:
      "Mẹo cho người Việt: các câu thủ tục thường dùng bị động di-: 'dilegalisasi' (được chứng thực), 'diterjemahkan' (được dịch), 'diperbaiki' (được sửa). Khi phát hiện lỗi giấy tờ, dùng 'Ada kesalahan nama/tanggal lahir' rồi hỏi 'bagaimana cara memperbaikinya?'",
    tip_advice_en:
      "Tip for Vietnamese speakers: bureaucracy sentences often use passive di-: 'dilegalisasi' (legalized/certified), 'diterjemahkan' (translated), 'diperbaiki' (fixed). When you find a document error, say 'Ada kesalahan nama/tanggal lahir' and ask 'bagaimana cara memperbaikinya?'",
    vocabulary: [
      {
        cell_id: "5e7d1cab-7446-4aa5-9521-a0ce5b09ffea",
        word: "legalisasi",
        en: "legalization / certification",
        vi: "hợp pháp hóa / chứng thực",
        pos: "noun",
        pronunciation_vi: "le-ga-li-SA-si",
        pronunciation_en: "le-ga-lee-SA-see",
      },
      {
        cell_id: "edd46ed0-2bfc-43dd-b79c-4178f162e0f1",
        word: "dilegalisasi",
        en: "legalized / certified",
        vi: "được hợp pháp hóa / chứng thực",
        pos: "passive verb",
        pronunciation_vi: "di-le-ga-li-SA-si",
        pronunciation_en: "dee-le-ga-lee-SA-see",
      },
      {
        cell_id: "72b3b6ff-ff9b-4e01-8127-5d7accee652b",
        word: "penerjemah tersumpah",
        en: "sworn translator",
        vi: "người dịch tuyên thệ",
        pos: "noun phrase",
        pronunciation_vi: "pe-ner-JE-mah ter-SUM-pah",
        pronunciation_en: "pe-ner-JEH-mah ter-SOOM-pah",
      },
      {
        cell_id: "76c544c1-93d0-4258-a3f7-ad7e52332c40",
        word: "mengubah status",
        en: "to change status",
        vi: "đổi tình trạng",
        pos: "verb phrase",
        pronunciation_vi: "me-NGU-bah STA-tus",
        pronunciation_en: "me-NGOO-bah STA-toos",
      },
      {
        cell_id: "9ba89b85-aac8-4537-9140-e4e018071355",
        word: "fotokopi",
        en: "photocopy",
        vi: "bản phô-tô",
        pos: "noun",
        pronunciation_vi: "fo-to-KO-pi",
        pronunciation_en: "fo-to-KO-pee",
      },
      {
        cell_id: "0f6be456-31f9-4b12-8439-840d986fe421",
        word: "kesalahan nama",
        en: "name error",
        vi: "lỗi tên",
        pos: "noun phrase",
        pronunciation_vi: "ke-sa-LA-han NA-ma",
        pronunciation_en: "ke-sa-LA-han NA-ma",
      },
      {
        cell_id: "1fdc81b8-25dc-4d09-b23d-898a881fbf69",
        word: "memperbaiki",
        en: "to fix / correct",
        vi: "sửa / chỉnh sửa",
        pos: "verb",
        pronunciation_vi: "mem-per-ba-I-ki",
        pronunciation_en: "mem-per-ba-EE-kee",
      },
    ],
    dialogue: [
      {
        cell_id: "86fa86d8-37d1-47ae-b50d-247eea8ddfde",
        speaker: "Pemohon",
        text: "Saya perlu legalisasi buku nikah untuk urusan visa.",
        vi: "Tôi cần chứng thực sổ hôn nhân cho việc visa.",
        en: "I need legalization of the marriage booklet for a visa matter.",
      },
      {
        cell_id: "e501916a-5543-48ad-9f86-f9697e531ce6",
        speaker: "Petugas",
        text: "Apakah dokumen ini akan dipakai di luar negeri?",
        vi: "Giấy tờ này sẽ được dùng ở nước ngoài phải không?",
        en: "Will this document be used overseas?",
      },
      {
        cell_id: "49641dcc-68ee-42aa-973b-9fc20742131d",
        speaker: "Pemohon",
        text: "Iya. Apakah harus diterjemahkan oleh penerjemah tersumpah?",
        vi: "Vâng. Có phải được dịch bởi người dịch tuyên thệ không?",
        en: "Yes. Must it be translated by a sworn translator?",
      },
      {
        cell_id: "d73da1f9-12d1-4ee9-b1bd-4928a53c682d",
        speaker: "Petugas",
        text: "Betul. Fotokopi dokumen juga harus dilegalisasi.",
        vi: "Đúng. Bản phô-tô giấy tờ cũng phải được chứng thực.",
        en: "Correct. The document photocopy must also be legalized.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ chứng thực/hộ tịch còn thiếu:",
        instruction_en: "Fill in the missing legalization/civil-registry word:",
        items: [
          {
            prompt: "Kami perlu ___ buku nikah. (chứng thực/hợp pháp hóa)",
            answer: "legalisasi",
            options: ["legalisasi", "lokalisasi", "layanan"],
          },
          {
            prompt: "Akta nikah harus diterjemahkan oleh penerjemah ___. (tuyên thệ)",
            answer: "tersumpah",
            options: ["tersumpah", "terlambat", "termasuk"],
          },
          {
            prompt: "Ada ___ nama di dokumen ini. (lỗi)",
            answer: "kesalahan",
            options: ["kesalahan", "kesehatan", "keamanan"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "legalisasi", answer: "chứng thực / hợp pháp hóa" },
          { prompt: "fotokopi", answer: "bản phô-tô" },
          { prompt: "penerjemah tersumpah", answer: "người dịch tuyên thệ" },
          { prompt: "mengubah status", answer: "đổi tình trạng" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Chúng tôi cần hợp pháp hóa sổ hôn nhân cho việc visa.", answer: "Kami perlu legalisasi buku nikah untuk urusan visa." },
          { prompt: "Sau khi kết hôn, tôi phải đổi tình trạng hôn nhân trên căn cước.", answer: "Setelah menikah, saya harus mengubah status perkawinan di KTP." },
          { prompt: "Nếu có lỗi tên, cách sửa như thế nào?", answer: "Kalau ada kesalahan nama, bagaimana cara memperbaikinya?" },
        ],
      },
    ],
  },
];
