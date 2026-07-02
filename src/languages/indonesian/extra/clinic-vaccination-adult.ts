// Adult Vaccination Clinic Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for adult vaccination at clinics and
// Puskesmas. Indonesian target text lives in `en`, Vietnamese glosses in `vi`,
// Vietnamese L1 notes in `pronunciation_focus`, and English companions in
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

export const clinicVaccinationAdultLessons: IndonesianLesson[] = [
  {
    id: "indonesian_clinic_adult_vaccination",
    level: "A2",
    category: "health",
    title_vi: "Tiêm vắc-xin cho người lớn ở phòng khám",
    title_en: "Adult vaccination at a clinic",
    sentences: [
      {
        en: "Saya mau daftar vaksin untuk orang dewasa.",
        vi: "Tôi muốn đăng ký tiêm vắc-xin cho người lớn.",
        pronunciation_focus: [
          "DAF-tar VAK-sin - `daftar vaksin` = đăng ký tiêm vắc-xin.",
          "`orang dewasa` = người lớn; `dewasa` khác `remaja` (thiếu niên).",
          "Lỗi người Việt: dùng `imunisasi` và `vaksin` lẫn nhau. `Vaksin` là chất/loại vắc-xin; `imunisasi` là hoạt động/lịch chủng ngừa.",
          "Luyện: `Saya mau daftar vaksin.`",
        ],
        pronunciation_focus_en: [
          "DAF-tar VAK-sin - `daftar vaksin` = register for vaccination.",
          "`orang dewasa` = adults; `dewasa` differs from `remaja` (teenagers).",
          "VN-speaker trap: mixing `imunisasi` and `vaksin`. `Vaksin` is the vaccine; `imunisasi` is the immunization activity/schedule.",
          "Drill: `Saya mau daftar vaksin.`",
        ],
      },
      {
        en: "Apakah Puskesmas ini melayani vaksin dewasa?",
        vi: "Trạm Puskesmas này có phục vụ tiêm vắc-xin cho người lớn không?",
        pronunciation_focus: [
          "PUS-kes-mas - `Puskesmas` = trung tâm y tế cộng đồng cấp phường/xã.",
          "`melayani vaksin dewasa` = phục vụ tiêm vắc-xin cho người lớn.",
          "Lỗi người Việt: nói `ada vaksin orang besar`. Tự nhiên hơn: `vaksin dewasa` hoặc `vaksin untuk orang dewasa`.",
          "Luyện: `Puskesmas ini melayani vaksin dewasa?`",
        ],
        pronunciation_focus_en: [
          "POOS-kes-mas - `Puskesmas` = local community health center.",
          "`melayani vaksin dewasa` = provides adult vaccination services.",
          "VN-speaker trap: saying `ada vaksin orang besar`. Natural: `vaksin dewasa` or `vaksin untuk orang dewasa`.",
          "Drill: `Puskesmas ini melayani vaksin dewasa?`",
        ],
      },
      {
        en: "Saya ambil nomor antrean dulu di loket pendaftaran.",
        vi: "Tôi lấy số thứ tự trước ở quầy đăng ký.",
        pronunciation_focus: [
          "NO-mor AN-tre-an - `nomor antrean` = số thứ tự/hàng chờ.",
          "`loket pendaftaran` = quầy đăng ký; `pendaftaran` từ gốc `daftar`.",
          "`dulu` cuối câu = trước đã; rất tự nhiên khi đi làm thủ tục.",
          "Luyện: `Saya ambil nomor antrean dulu.`",
        ],
        pronunciation_focus_en: [
          "NO-mor AN-tre-an - `nomor antrean` = queue number.",
          "`loket pendaftaran` = registration counter; `pendaftaran` comes from root `daftar`.",
          "Sentence-final `dulu` = first/for now; very natural for procedures.",
          "Drill: `Saya ambil nomor antrean dulu.`",
        ],
      },
      {
        en: "Saya membawa kartu vaksin dan KTP.",
        vi: "Tôi mang thẻ tiêm chủng và căn cước KTP.",
        pronunciation_focus: [
          "KAR-tu VAK-sin - `kartu vaksin` = thẻ/phiếu tiêm chủng.",
          "`KTP` đọc `ka-te-pe`, thẻ căn cước Indonesia.",
          "Lỗi người Việt: đọc KTP theo tiếng Anh. Ở Indonesia đánh vần từng chữ kiểu Indonesia.",
          "Luyện: `Saya membawa kartu vaksin.`",
        ],
        pronunciation_focus_en: [
          "KAR-too VAK-sin - `kartu vaksin` = vaccination card.",
          "`KTP` is pronounced `ka-te-pe`, the Indonesian ID card.",
          "VN-speaker trap: reading KTP English-style. In Indonesian, spell it with Indonesian letter names.",
          "Drill: `Saya membawa kartu vaksin.`",
        ],
      },
      {
        en: "Kapan jadwal imunisasi dewasa berikutnya?",
        vi: "Lịch tiêm chủng người lớn tiếp theo là khi nào?",
        pronunciation_focus: [
          "JAD-wal i-mu-ni-SA-si de-WA-sa - `jadwal imunisasi dewasa` = lịch tiêm chủng người lớn.",
          "`berikutnya` = tiếp theo; thường dùng khi hỏi lịch hẹn/lịch mũi sau.",
          "Lỗi người Việt: hỏi `kapan vaksin lagi` nghe thân mật. Ở phòng khám, dùng `jadwal imunisasi berikutnya`.",
          "Luyện: `Kapan jadwal berikutnya?`",
        ],
        pronunciation_focus_en: [
          "JAD-wal ee-moo-nee-SA-see de-WA-sa - `jadwal imunisasi dewasa` = adult immunization schedule.",
          "`berikutnya` = next; common for follow-up appointments or next doses.",
          "VN-speaker trap: asking `kapan vaksin lagi`, which sounds casual. At a clinic use `jadwal imunisasi berikutnya`.",
          "Drill: `Kapan jadwal berikutnya?`",
        ],
      },
      {
        en: "Setelah vaksin, lengan saya agak nyeri.",
        vi: "Sau khi tiêm vắc-xin, cánh tay tôi hơi đau.",
        pronunciation_focus: [
          "se-TE-lah VAK-sin - `setelah vaksin` = sau khi tiêm vắc-xin.",
          "`lengan saya agak nyeri` = cánh tay tôi hơi đau; `nyeri` = đau nhức.",
          "Lỗi người Việt: dùng `sakit` cho mọi đau. `Nyeri` tự nhiên hơn cho đau nhức sau tiêm.",
          "Luyện: `Lengan saya agak nyeri.`",
        ],
        pronunciation_focus_en: [
          "se-TE-lah VAK-sin - `setelah vaksin` = after vaccination.",
          "`lengan saya agak nyeri` = my arm is a bit sore; `nyeri` = aching pain.",
          "VN-speaker trap: using `sakit` for every kind of pain. `Nyeri` is natural for post-shot soreness.",
          "Drill: `Lengan saya agak nyeri.`",
        ],
      },
      {
        en: "Apakah efek samping seperti demam ringan itu normal?",
        vi: "Tác dụng phụ như sốt nhẹ có bình thường không?",
        pronunciation_focus: [
          "e-FEK SAM-ping - `efek samping` = tác dụng phụ.",
          "`demam ringan` = sốt nhẹ; `ringan` = nhẹ, không nặng.",
          "Mẹo an toàn: hỏi `apakah ... normal?` để xác nhận triệu chứng sau tiêm.",
          "Luyện: `Apakah efek samping ini normal?`",
        ],
        pronunciation_focus_en: [
          "e-FEK SAM-ping - `efek samping` = side effects.",
          "`demam ringan` = mild fever; `ringan` = light/mild.",
          "Safety tip: ask `apakah ... normal?` to confirm post-vaccination symptoms.",
          "Drill: `Apakah efek samping ini normal?`",
        ],
      },
      {
        en: "Saya perlu surat keterangan vaksin untuk perjalanan.",
        vi: "Tôi cần giấy xác nhận tiêm vắc-xin để đi lại.",
        pronunciation_focus: [
          "SU-rat ke-te-RANG-an VAK-sin - `surat keterangan vaksin` = giấy xác nhận tiêm chủng.",
          "`untuk perjalanan` = để đi lại/cho chuyến đi; `perjalanan` từ gốc `jalan`.",
          "Lỗi người Việt: nói `surat vaksin` quá ngắn có thể mơ hồ. Cụm rõ là `surat keterangan vaksin`.",
          "Luyện: `Saya perlu surat keterangan vaksin.`",
        ],
        pronunciation_focus_en: [
          "SOO-rat ke-te-RANG-an VAK-sin - `surat keterangan vaksin` = vaccination certificate/letter.",
          "`untuk perjalanan` = for travel; `perjalanan` comes from root `jalan`.",
          "VN-speaker trap: saying only `surat vaksin`, which may be vague. Clear phrase: `surat keterangan vaksin`.",
          "Drill: `Saya perlu surat keterangan vaksin.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, người lớn có thể hỏi vắc-xin tại Puskesmas, klinik, rumah sakit, hoặc chương trình tiêm chủng theo chiến dịch. `Kartu vaksin` hoặc chứng nhận điện tử/giấy từng rất quen trong giai đoạn COVID, nhưng nhiều nơi vẫn dùng cụm này cho lịch sử tiêm. Khi đi tiêm, thường cần KTP hoặc giấy tờ nhận dạng, lấy `nomor antrean`, đăng ký ở `loket pendaftaran`, rồi chờ được gọi. Nếu có tiền sử dị ứng, đang sốt, đang mang thai, hoặc đang dùng thuốc đặc biệt, nên nói rõ với petugas sebelum vaksin.",
    cultural_notes_en:
      "In Indonesia, adults can ask about vaccination at a Puskesmas, clinic, hospital, or campaign-based immunization program. `Kartu vaksin` or paper/electronic certificates became familiar during COVID, but the phrase is still used for vaccination records. At a clinic you usually bring ID, take a `nomor antrean`, register at the `loket pendaftaran`, then wait to be called. If you have allergy history, fever, pregnancy, or special medication, tell the staff before vaccination.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt `vaksin` (vắc-xin/mũi tiêm), `imunisasi` (hoạt động/lịch chủng ngừa), `kartu vaksin` (thẻ tiêm), `surat keterangan vaksin` (giấy xác nhận). Để hỏi lịch dùng `Kapan jadwal ...?`; để hỏi tác dụng phụ dùng `Apakah ... normal?`; để nói đau sau tiêm dùng `lengan saya agak nyeri`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: distinguish `vaksin` (vaccine/shot), `imunisasi` (immunization activity/schedule), `kartu vaksin` (vaccination card), and `surat keterangan vaksin` (vaccination certificate). For schedules use `Kapan jadwal ...?`; for side effects use `Apakah ... normal?`; for post-shot soreness use `lengan saya agak nyeri`.",
    vocabulary: [
      {
        word: "vaksin",
        en: "vaccine / vaccination shot",
        vi: "vắc-xin / mũi tiêm",
        pos: "noun",
        pronunciation_vi: "VAK-sin",
        pronunciation_en: "VAK-sin",
      },
      {
        word: "imunisasi dewasa",
        en: "adult immunization",
        vi: "tiêm chủng cho người lớn",
        pos: "noun phrase",
        pronunciation_vi: "i-mu-ni-SA-si de-WA-sa",
        pronunciation_en: "ee-moo-nee-SA-see de-WA-sa",
      },
      {
        word: "kartu vaksin",
        en: "vaccination card",
        vi: "thẻ/phiếu tiêm chủng",
        pos: "noun phrase",
        pronunciation_vi: "KAR-tu VAK-sin",
        pronunciation_en: "KAR-too VAK-sin",
      },
      {
        word: "efek samping",
        en: "side effect",
        vi: "tác dụng phụ",
        pos: "noun phrase",
        pronunciation_vi: "e-FEK SAM-ping",
        pronunciation_en: "e-FEK SAM-ping",
      },
      {
        word: "Puskesmas",
        en: "community health center",
        vi: "trung tâm y tế cộng đồng",
        pos: "noun",
        pronunciation_vi: "PUS-kes-mas",
        pronunciation_en: "POOS-kes-mas",
      },
      {
        word: "antrean",
        en: "queue",
        vi: "hàng chờ / lượt chờ",
        pos: "noun",
        pronunciation_vi: "AN-tre-an",
        pronunciation_en: "AN-tre-an",
      },
      {
        word: "surat keterangan",
        en: "certificate / official letter",
        vi: "giấy xác nhận",
        pos: "noun phrase",
        pronunciation_vi: "SU-rat ke-te-RANG-an",
        pronunciation_en: "SOO-rat ke-te-RANG-an",
      },
      {
        word: "demam ringan",
        en: "mild fever",
        vi: "sốt nhẹ",
        pos: "noun phrase",
        pronunciation_vi: "de-MAM RING-an",
        pronunciation_en: "de-MAM RING-an",
      },
      {
        word: "lengan nyeri",
        en: "sore arm",
        vi: "đau nhức cánh tay",
        pos: "phrase",
        pronunciation_vi: "LEN-gan NYE-ri",
        pronunciation_en: "LEN-gan NYE-ree",
      },
      {
        word: "loket pendaftaran",
        en: "registration counter",
        vi: "quầy đăng ký",
        pos: "noun phrase",
        pronunciation_vi: "LO-ket pen-daf-TA-ran",
        pronunciation_en: "LO-ket pen-daf-TA-ran",
      },
    ],
    dialogue: [
      {
        speaker: "Pasien",
        text: "Selamat pagi. Saya mau daftar vaksin dewasa.",
        vi: "Chào buổi sáng. Tôi muốn đăng ký tiêm vắc-xin cho người lớn.",
        en: "Good morning. I want to register for an adult vaccination.",
      },
      {
        speaker: "Petugas",
        text: "Silakan ambil nomor antrean dan siapkan KTP.",
        vi: "Vui lòng lấy số thứ tự và chuẩn bị KTP.",
        en: "Please take a queue number and prepare your ID card.",
      },
      {
        speaker: "Pasien",
        text: "Setelah vaksin, apakah saya dapat kartu vaksin?",
        vi: "Sau khi tiêm, tôi có nhận thẻ tiêm chủng không?",
        en: "After vaccination, will I get a vaccination card?",
      },
      {
        speaker: "Petugas",
        text: "Iya. Kalau perlu untuk perjalanan, kami juga bisa buat surat keterangan.",
        vi: "Có. Nếu cần để đi lại, chúng tôi cũng có thể làm giấy xác nhận.",
        en: "Yes. If you need it for travel, we can also make a certificate.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ/cụm từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word or phrase with its Vietnamese meaning:",
        items: [
          { prompt: "kartu vaksin", answer: "thẻ tiêm chủng" },
          { prompt: "efek samping", answer: "tác dụng phụ" },
          { prompt: "antrean", answer: "hàng chờ" },
          { prompt: "surat keterangan", answer: "giấy xác nhận" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu:",
        instruction_en: "Fill in the missing word:",
        items: [
          {
            prompt: "Saya mau daftar ___ untuk orang dewasa. (vắc-xin)",
            answer: "vaksin",
            options: ["vaksin", "vitamin", "variasi"],
          },
          {
            prompt: "Saya ambil nomor ___ dulu. (hàng chờ)",
            answer: "antrean",
            options: ["antrean", "alamat", "aturan"],
          },
          {
            prompt: "Apakah efek samping seperti demam ___ itu normal? (nhẹ)",
            answer: "ringan",
            options: ["ringan", "ramai", "resmi"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi mang thẻ tiêm chủng và KTP.", answer: "Saya membawa kartu vaksin dan KTP." },
          { prompt: "Sau khi tiêm, cánh tay tôi hơi đau.", answer: "Setelah vaksin, lengan saya agak nyeri." },
          { prompt: "Tôi cần giấy xác nhận tiêm vắc-xin để đi lại.", answer: "Saya perlu surat keterangan vaksin untuk perjalanan." },
        ],
      },
    ],
  },
];

export default clinicVaccinationAdultLessons;
