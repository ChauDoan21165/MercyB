// Indonesian lost passport and embassy emergency lesson pack for Vietnamese learners.
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

export const lostPassportEmbassyLessons: IndonesianLesson[] = [
  {
    id: "indonesian_lost_passport_police_report",
    level: "B1",
    category: "travel_emergency",
    title_vi: "Mất hộ chiếu và làm laporan polisi",
    title_en: "Lost passport and filing a police report",
    sentences: [
      {
        en: "Paspor saya hilang di dekat stasiun.",
        vi: "Hộ chiếu của tôi bị mất gần nhà ga.",
        pronunciation_focus: [
          "PAS-por SA-ya HI-lang di de-KAT sta-SI-un.",
          "`paspor hilang` = hộ chiếu bị mất; `di dekat` = ở gần.",
          "L1 Việt: với giấy tờ bị mất, nói `paspor saya hilang`, không nói `paspor saya kalah`.",
        ],
        pronunciation_focus_en: [
          "PAS-por SA-ya HI-lang di de-KAT sta-SI-un.",
          "`paspor hilang` = passport is lost; `di dekat` = near/at near.",
          "VN-speaker trap: for lost documents, say `paspor saya hilang`, not `paspor saya kalah`.",
        ],
      },
      {
        en: "Saya perlu membuat laporan polisi.",
        vi: "Tôi cần làm biên bản/báo cáo với công an.",
        pronunciation_focus: [
          "SA-ya per-LU mem-BU-at la-PO-ran po-LI-si.",
          "`laporan polisi` = báo cáo/biên bản của cảnh sát; cần cho nhiều thủ tục kedutaan.",
          "L1 Việt: `membuat laporan` là cụm hành chính tự nhiên, không dịch từng chữ là `bikin report`.",
        ],
        pronunciation_focus_en: [
          "SA-ya per-LU mem-BU-at la-PO-ran po-LI-si.",
          "`laporan polisi` = police report; often needed for embassy procedures.",
          "VN-speaker note: `membuat laporan` is natural administrative wording, not English-mixed `bikin report`.",
        ],
      },
      {
        en: "Kapan terakhir Bapak melihat paspornya?",
        vi: "Lần cuối anh/bác thấy hộ chiếu là khi nào?",
        pronunciation_focus: [
          "KA-pan ter-A-khir BA-pak me-LI-hat PAS-por-nya.",
          "`terakhir` = cuối cùng/lần cuối; `paspornya` = hộ chiếu đó/của Bapak.",
          "L1 Việt: `Bapak/Ibu` ở đồn cảnh sát hoặc văn phòng là cách xưng hô lịch sự, không nhất thiết là cha/mẹ.",
        ],
        pronunciation_focus_en: [
          "KA-pan ter-A-khir BA-pak me-LI-hat PAS-por-nya.",
          "`terakhir` = last/final; `paspornya` = that passport / your passport.",
          "VN-speaker note: `Bapak/Ibu` at a police station or office is polite address, not necessarily father/mother.",
        ],
      },
      {
        en: "Saya punya fotokopi paspor dan visa di ponsel.",
        vi: "Tôi có bản photo hộ chiếu và visa trong điện thoại.",
        pronunciation_focus: [
          "SA-ya PU-nya fo-to-KO-pi PAS-por dan VI-sa di PON-sel.",
          "`fotokopi paspor` = bản sao hộ chiếu; `ponsel` = điện thoại di động.",
          "L1 Việt: `di ponsel` = trong điện thoại. Nếu gửi đến điện thoại, mới dùng `ke ponsel`.",
        ],
        pronunciation_focus_en: [
          "SA-ya PU-nya fo-to-KO-pi PAS-por dan VI-sa di PON-sel.",
          "`fotokopi paspor` = passport copy; `ponsel` = mobile phone.",
          "VN-speaker trap: `di ponsel` = on/in the phone. Use `ke ponsel` only for sending to a phone.",
        ],
      },
      {
        en: "Tolong tulis nama dan alamat penginapan saya di laporan.",
        vi: "Làm ơn ghi tên và địa chỉ chỗ ở của tôi vào báo cáo.",
        pronunciation_focus: [
          "TO-long TU-lis NA-ma dan a-LA-mat pe-ngi-NA-pan SA-ya di la-PO-ran.",
          "`alamat penginapan` = địa chỉ nơi lưu trú; `di laporan` = trong báo cáo.",
          "L1 Việt: `penginapan` là nơi ở tạm/khách sạn/homestay; không dùng `rumah saya` nếu chỉ đang du lịch.",
        ],
        pronunciation_focus_en: [
          "TO-long TU-lis NA-ma dan a-LA-mat pe-ngi-NA-pan SA-ya di la-PO-ran.",
          "`alamat penginapan` = accommodation address; `di laporan` = in the report.",
          "VN-speaker note: `penginapan` is temporary lodging; avoid `rumah saya` if you are only traveling.",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi paspor hilang di Indonesia, langkah umum biasanya: cari dulu di lokasi terakhir, buat `laporan polisi`, hubungi kedutaan/konsulat negara Anda, siapkan fotokopi dokumen, foto, tiket perjalanan jika ada, dan bukti identitas lain. Prosedur berbeda menurut negara, jadi kedutaan là nguồn chính thức untuk surat perjalanan atau paspor darurat.",
    cultural_notes_en:
      "When a passport is lost in Indonesia, common steps are: check the last location, file a `laporan polisi`, contact your embassy or consulate, prepare document copies, photos, travel tickets if any, and other proof of identity. Procedures vary by country, so the embassy is the official source for a travel document or emergency passport.",
    tip_advice_vi:
      "Mẫu sống còn: `Paspor saya hilang`, `Saya perlu membuat laporan polisi`, `Saya punya fotokopi paspor`, `Alamat penginapan saya...`. Người Việt nên nhớ `hilang` = mất/thất lạc; `kehilangan` = sự mất mát hoặc bị mất, trang trọng hơn.",
    tip_advice_en:
      "Survival chunks: `Paspor saya hilang`, `Saya perlu membuat laporan polisi`, `Saya punya fotokopi paspor`, `Alamat penginapan saya...`. Vietnamese speakers should remember `hilang` = lost/missing; `kehilangan` is the more formal noun/state.",
    vocabulary: [
      {
        word: "paspor hilang",
        en: "lost passport",
        vi: "hộ chiếu bị mất",
        pos: "noun phrase",
        pronunciation_vi: "PAS-por HI-lang",
        pronunciation_en: "PAS-por HEE-lang",
      },
      {
        word: "laporan polisi",
        en: "police report",
        vi: "biên bản / báo cáo cảnh sát",
        pos: "noun phrase",
        pronunciation_vi: "la-PO-ran po-LI-si",
        pronunciation_en: "la-PO-ran po-LEE-see",
      },
      {
        word: "fotokopi dokumen",
        en: "document photocopy",
        vi: "bản photo giấy tờ",
        pos: "noun phrase",
        pronunciation_vi: "fo-to-KO-pi DO-ku-men",
        pronunciation_en: "fo-to-KO-pee DO-ku-men",
      },
      {
        word: "alamat penginapan",
        en: "accommodation address",
        vi: "địa chỉ nơi lưu trú",
        pos: "noun phrase",
        pronunciation_vi: "a-LA-mat pe-ngi-NA-pan",
        pronunciation_en: "a-LA-mat pe-ngi-NA-pan",
      },
      {
        word: "terakhir",
        en: "last / final",
        vi: "lần cuối / cuối cùng",
        pos: "adjective / adverb",
        pronunciation_vi: "ter-A-khir",
        pronunciation_en: "ter-A-khir",
      },
      {
        word: "ponsel",
        en: "mobile phone",
        vi: "điện thoại di động",
        pos: "noun",
        pronunciation_vi: "PON-sel",
        pronunciation_en: "PON-sel",
      },
    ],
    dialogue: [
      {
        speaker: "Pelapor",
        text: "Permisi, Pak. Paspor saya hilang di dekat stasiun.",
        vi: "Xin lỗi anh/bác. Hộ chiếu của tôi bị mất gần nhà ga.",
        en: "Excuse me, Sir. My passport was lost near the station.",
      },
      {
        speaker: "Polisi",
        text: "Kapan terakhir Bapak melihat paspornya?",
        vi: "Lần cuối anh/bác thấy hộ chiếu là khi nào?",
        en: "When did you last see the passport?",
      },
      {
        speaker: "Pelapor",
        text: "Tadi pagi. Saya punya fotokopi paspor di ponsel.",
        vi: "Sáng nay. Tôi có bản photo hộ chiếu trong điện thoại.",
        en: "This morning. I have a passport copy on my phone.",
      },
      {
        speaker: "Polisi",
        text: "Baik. Kami buat laporan polisi untuk dibawa ke kedutaan.",
        vi: "Được. Chúng tôi sẽ làm biên bản cảnh sát để mang đến đại sứ quán.",
        en: "Okay. We will make a police report to take to the embassy.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ phù hợp về paspor hilang:",
        instruction_en: "Fill in the suitable lost-passport word:",
        items: [
          {
            prompt: "Paspor saya ___ di dekat stasiun. (mất)",
            answer: "hilang",
            options: ["hilang", "hujan", "hidup"],
          },
          {
            prompt: "Saya perlu membuat laporan ___. (cảnh sát)",
            answer: "polisi",
            options: ["polisi", "pasar", "pajak"],
          },
          {
            prompt: "Saya punya ___ paspor di ponsel. (bản photo)",
            answer: "fotokopi",
            options: ["fotokopi", "formulir", "fasilitas"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Hộ chiếu của tôi bị mất gần nhà ga.", answer: "Paspor saya hilang di dekat stasiun." },
          { prompt: "Tôi cần làm báo cáo với cảnh sát.", answer: "Saya perlu membuat laporan polisi." },
          { prompt: "Tôi có bản photo hộ chiếu và visa trong điện thoại.", answer: "Saya punya fotokopi paspor dan visa di ponsel." },
        ],
      },
    ],
  },
  {
    id: "indonesian_embassy_emergency_travel_document",
    level: "B1",
    category: "travel_emergency",
    title_vi: "Liên hệ kedutaan và xin surat perjalanan",
    title_en: "Contacting the embassy and requesting a travel document",
    sentences: [
      {
        en: "Saya harus menghubungi kedutaan Vietnam secepatnya.",
        vi: "Tôi phải liên hệ đại sứ quán Việt Nam sớm nhất có thể.",
        pronunciation_focus: [
          "SA-ya HA-rus meng-hu-BUNG-i ke-DU-ta-an VI-et-nam se-CE-pat-nya.",
          "`kedutaan` = đại sứ quán; `menghubungi` = liên hệ/gọi.",
          "L1 Việt: `secepatnya` = càng sớm càng tốt. Chữ `c` đọc như 'ch': se-CE-pat-nya.",
        ],
        pronunciation_focus_en: [
          "SA-ya HA-rus meng-hu-BOONG-i ke-DOO-ta-an VI-et-nam se-CHE-pat-nya.",
          "`kedutaan` = embassy; `menghubungi` = contact/call.",
          "VN-speaker note: `secepatnya` = as soon as possible. Indonesian `c` sounds like 'ch'.",
        ],
      },
      {
        en: "Apakah saya perlu membuat janji temu dulu?",
        vi: "Tôi có cần đặt lịch hẹn trước không?",
        pronunciation_focus: [
          "a-PA-kah SA-ya per-LU mem-BU-at JAN-ji TE-mu DU-lu.",
          "`janji temu` = cuộc hẹn/lịch hẹn; `dulu` = trước đã.",
          "L1 Việt: `janji` một mình có thể là lời hứa; trong văn phòng, dùng đủ cụm `janji temu`.",
        ],
        pronunciation_focus_en: [
          "a-PA-kah SA-ya per-LU mem-BU-at JAN-ji TE-mu DU-lu.",
          "`janji temu` = appointment; `dulu` = first/beforehand.",
          "VN-speaker trap: `janji` alone can mean promise; for an office appointment, use full `janji temu`.",
        ],
      },
      {
        en: "Saya ingin mengurus surat perjalanan darurat.",
        vi: "Tôi muốn làm giấy thông hành khẩn cấp.",
        pronunciation_focus: [
          "SA-ya I-ngin me-ngu-RUS SU-rat per-ja-LAN-an da-RU-rat.",
          "`surat perjalanan darurat` = giấy thông hành/giấy đi đường khẩn cấp.",
          "L1 Việt: `mengurus` = lo/làm thủ tục. Trong cơ quan hành chính, cụm này rất tự nhiên.",
        ],
        pronunciation_focus_en: [
          "SA-ya I-ngin me-ngu-RUS SU-rat per-ja-LAN-an da-ROO-rat.",
          "`surat perjalanan darurat` = emergency travel document.",
          "VN-speaker note: `mengurus` = handle/process paperwork. It is very natural in administrative offices.",
        ],
      },
      {
        en: "Berapa biaya pembuatan surat perjalanan?",
        vi: "Phí làm giấy thông hành là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa BI-a-ya pem-bu-A-tan SU-rat per-ja-LAN-an.",
          "`biaya pembuatan` = phí làm/cấp giấy tờ; hỏi số tiền bằng `berapa`.",
          "L1 Việt: đừng hỏi `apa biaya`; với giá/phí, dùng `berapa biaya`.",
        ],
        pronunciation_focus_en: [
          "be-RA-pa BI-a-ya pem-bu-A-tan SU-rat per-ja-LAN-an.",
          "`biaya pembuatan` = processing/issuance fee; ask amounts with `berapa`.",
          "VN-speaker trap: do not ask `apa biaya`; for fees, use `berapa biaya`.",
        ],
      },
      {
        en: "Ini keadaan darurat karena penerbangan saya besok.",
        vi: "Đây là tình huống khẩn cấp vì chuyến bay của tôi là ngày mai.",
        pronunciation_focus: [
          "I-ni ke-a-DA-an da-RU-rat ka-RE-na pe-ner-BANG-an SA-ya BE-sok.",
          "`keadaan darurat` = tình trạng khẩn cấp; `penerbangan` = chuyến bay.",
          "L1 Việt: `karena` nối lý do rất giống 'vì' trong tiếng Việt, đặt trước lý do.",
        ],
        pronunciation_focus_en: [
          "I-ni ke-a-DA-an da-ROO-rat ka-RE-na pe-ner-BANG-an SA-ya BE-sok.",
          "`keadaan darurat` = emergency situation; `penerbangan` = flight.",
          "VN-speaker win: `karena` links a reason much like Vietnamese 'vì'; place it before the reason.",
        ],
      },
    ],
    cultural_notes_vi:
      "Kedutaan atau konsulat biasanya meminta bukti identitas, fotokopi paspor jika ada, laporan polisi, foto terbaru, formulir, tiket perjalanan, dan biaya tertentu untuk `surat perjalanan darurat`. Nama dokumen bisa berbeda menurut negara: emergency passport, emergency travel document, laissez-passer, hoặc surat perjalanan. Selalu cek informasi resmi dari kedutaan dan simpan nomor darurat kedutaan sebelum bepergian.",
    cultural_notes_en:
      "An embassy or consulate usually asks for proof of identity, passport copy if available, police report, recent photos, forms, travel tickets, and a fee for an emergency travel document. The document name can vary by country: emergency passport, emergency travel document, laissez-passer, or `surat perjalanan`. Always check official embassy information and save the embassy emergency number before traveling.",
    tip_advice_vi:
      "Mẫu cần thuộc: `Saya harus menghubungi kedutaan`, `Apakah perlu janji temu?`, `Saya ingin mengurus surat perjalanan darurat`, `Berapa biayanya?`, `Ini keadaan darurat karena...`. Dùng `ingin` và `mohon` ở kedutaan để giữ giọng lịch sự.",
    tip_advice_en:
      "Chunks to memorize: `Saya harus menghubungi kedutaan`, `Apakah perlu janji temu?`, `Saya ingin mengurus surat perjalanan darurat`, `Berapa biayanya?`, `Ini keadaan darurat karena...`. Use `ingin` and `mohon` at an embassy to keep a polite register.",
    vocabulary: [
      {
        word: "kedutaan",
        en: "embassy",
        vi: "đại sứ quán",
        pos: "noun",
        pronunciation_vi: "ke-DU-ta-an",
        pronunciation_en: "ke-DOO-ta-an",
      },
      {
        word: "konsulat",
        en: "consulate",
        vi: "lãnh sự quán",
        pos: "noun",
        pronunciation_vi: "kon-su-LAT",
        pronunciation_en: "kon-soo-LAT",
      },
      {
        word: "janji temu",
        en: "appointment",
        vi: "lịch hẹn / cuộc hẹn",
        pos: "noun phrase",
        pronunciation_vi: "JAN-ji TE-mu",
        pronunciation_en: "JAN-jee TE-moo",
      },
      {
        word: "surat perjalanan",
        en: "travel document",
        vi: "giấy thông hành / giấy đi đường",
        pos: "noun phrase",
        pronunciation_vi: "SU-rat per-ja-LAN-an",
        pronunciation_en: "SOO-rat per-ja-LAN-an",
      },
      {
        word: "biaya pembuatan",
        en: "issuance / processing fee",
        vi: "phí làm / phí cấp",
        pos: "noun phrase",
        pronunciation_vi: "BI-a-ya pem-bu-A-tan",
        pronunciation_en: "bee-A-ya pem-boo-A-tan",
      },
      {
        word: "keadaan darurat",
        en: "emergency situation",
        vi: "tình trạng khẩn cấp",
        pos: "noun phrase",
        pronunciation_vi: "ke-a-DA-an da-RU-rat",
        pronunciation_en: "ke-a-DA-an da-ROO-rat",
      },
    ],
    dialogue: [
      {
        speaker: "Pemohon",
        text: "Selamat pagi. Paspor saya hilang dan saya sudah punya laporan polisi.",
        vi: "Chào buổi sáng. Hộ chiếu của tôi bị mất và tôi đã có biên bản cảnh sát.",
        en: "Good morning. My passport is lost and I already have a police report.",
      },
      {
        speaker: "Petugas Kedutaan",
        text: "Apakah Anda sudah membuat janji temu?",
        vi: "Anh/chị đã đặt lịch hẹn chưa?",
        en: "Have you made an appointment?",
      },
      {
        speaker: "Pemohon",
        text: "Belum. Ini darurat karena penerbangan saya besok.",
        vi: "Chưa. Đây là tình huống khẩn cấp vì chuyến bay của tôi là ngày mai.",
        en: "Not yet. This is urgent because my flight is tomorrow.",
      },
      {
        speaker: "Petugas Kedutaan",
        text: "Baik. Mohon siapkan fotokopi dokumen dan biaya pembuatan surat perjalanan.",
        vi: "Vâng. Vui lòng chuẩn bị bản photo giấy tờ và phí làm giấy thông hành.",
        en: "Okay. Please prepare document copies and the travel-document issuance fee.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa tiếng Việt:",
        instruction_en: "Match each phrase with its Vietnamese meaning:",
        items: [
          { prompt: "kedutaan", answer: "đại sứ quán" },
          { prompt: "janji temu", answer: "lịch hẹn" },
          { prompt: "surat perjalanan", answer: "giấy thông hành" },
          { prompt: "keadaan darurat", answer: "tình trạng khẩn cấp" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Chọn từ đúng:",
        instruction_en: "Choose the correct word:",
        items: [
          {
            prompt: "Saya harus menghubungi ___ Vietnam secepatnya. (đại sứ quán)",
            answer: "kedutaan",
            options: ["kedutaan", "kecamatan", "kereta"],
          },
          {
            prompt: "Apakah saya perlu membuat janji ___ dulu? (hẹn)",
            answer: "temu",
            options: ["temu", "tamu", "tanda"],
          },
          {
            prompt: "Berapa biaya pembuatan surat ___? (thông hành)",
            answer: "perjalanan",
            options: ["perjalanan", "perjanjian", "pekerjaan"],
          },
        ],
      },
    ],
  },
];
