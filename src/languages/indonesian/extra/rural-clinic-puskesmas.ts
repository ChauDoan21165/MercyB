// Rural clinic & Puskesmas Indonesian (Vietnamese -> Indonesian study track).
//
// A6 Wave 26 file. Covers puskesmas desa, bidan, perawat, antrean,
// kartu berobat, obat generik, rujukan, and jam pelayanan.
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
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
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
  /** Part of speech, e.g. "noun", "verb", "phrase". */
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
    id: "indonesian_rural_clinic_puskesmas",
    level: "A2",
    category: "health",
    title_vi: "Khám bệnh ở Puskesmas desa",
    title_en: "Visiting a rural Puskesmas clinic",
    sentences: [
      {
        en: "Saya mau berobat di puskesmas desa.",
        vi: "Tôi muốn đi khám/chữa bệnh ở trạm Puskesmas làng.",
        pronunciation_focus: [
          "SA-ya MAU ber-O-bat di PUS-kes-mas DE-sa - `berobat` = đi khám/chữa bệnh; `puskesmas desa` = trung tâm y tế xã/làng.",
          "`di puskesmas` dùng `di` vì nói địa điểm khám. Nếu đang đi đến đó, nói `ke puskesmas`.",
          "Lỗi người Việt: nói `pergi dokter` thiếu giới từ. Tự nhiên hơn: `berobat di puskesmas` hoặc `periksa ke dokter`.",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU ber-O-bat di POOS-kes-mas DE-sa - `berobat` = seek treatment; `puskesmas desa` = rural village community clinic.",
          "`di puskesmas` uses `di` because it marks the clinic location. If going there, say `ke puskesmas`.",
          "VN-speaker trap: saying `pergi dokter` without a preposition. More natural: `berobat di puskesmas` or `periksa ke dokter`.",
        ],
      },
      {
        en: "Jam pelayanan puskesmas sampai jam dua siang.",
        vi: "Giờ phục vụ của Puskesmas đến hai giờ chiều.",
        pronunciation_focus: [
          "jam pe-la-YA-nan PUS-kes-mas SAM-pai jam DU-a SI-ang - `jam pelayanan` = giờ phục vụ/giờ làm việc; `sampai` = đến.",
          "`jam dua siang` = 2 giờ chiều sớm. Trong nhiều nơi có thể nói `jam dua` nếu ngữ cảnh rõ.",
          "Lỗi người Việt: dịch `giờ mở cửa` thành `jam buka` cho mọi dịch vụ. Ở cơ sở y tế, `jam pelayanan` rất tự nhiên.",
        ],
        pronunciation_focus_en: [
          "jam pe-la-YA-nan POOS-kes-mas SAM-pai jam DOO-a SEE-ang - `jam pelayanan` = service hours; `sampai` = until.",
          "`jam dua siang` = 2 p.m. In many places, `jam dua` is enough if context is clear.",
          "VN-speaker trap: using `jam buka` for every service. In health facilities, `jam pelayanan` is very natural.",
        ],
      },
      {
        en: "Saya ambil nomor antrean dulu di loket pendaftaran.",
        vi: "Tôi lấy số thứ tự trước ở quầy đăng ký.",
        pronunciation_focus: [
          "SA-ya AM-bil NO-mor AN-tre-an DU-lu di LO-ket pen-DAF-tar-an - `nomor antrean` = số thứ tự; `loket pendaftaran` = quầy đăng ký.",
          "`dulu` ở cuối câu nghĩa là trước đã, rất tự nhiên trong thủ tục.",
          "Lỗi người Việt: nói `ambil nomor tunggu`. Cụm chuẩn và thường gặp là `nomor antrean`.",
        ],
        pronunciation_focus_en: [
          "SA-ya AM-bil NO-mor AN-tre-an DOO-loo di LO-ket pen-DAF-tar-an - `nomor antrean` = queue number; `loket pendaftaran` = registration counter.",
          "Final `dulu` means first/for now, very natural in procedures.",
          "VN-speaker trap: saying `ambil nomor tunggu`. The standard common phrase is `nomor antrean`.",
        ],
      },
      {
        en: "Apakah saya perlu membawa kartu berobat?",
        vi: "Tôi có cần mang thẻ khám bệnh không?",
        pronunciation_focus: [
          "a-pa-KAH SA-ya PER-lu mem-BA-wa KAR-tu ber-O-bat - `kartu berobat` = thẻ khám/chữa bệnh; `perlu` = cần.",
          "`membawa` là dạng đầy đủ của `bawa`, phù hợp khi hỏi nhân viên.",
          "Lỗi người Việt: dịch `thẻ bệnh viện` thành `kartu rumah sakit` ở mọi nơi. Ở Puskesmas, hỏi `kartu berobat` rõ hơn.",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH SA-ya PER-loo mem-BA-wa KAR-too ber-O-bat - `kartu berobat` = patient/treatment card; `perlu` = need.",
          "`membawa` is the full form of `bawa`, suitable when speaking with staff.",
          "VN-speaker trap: translating 'hospital card' as `kartu rumah sakit` everywhere. At a Puskesmas, `kartu berobat` is clearer.",
        ],
      },
      {
        en: "Hari ini bidan praktik sampai jam sebelas.",
        vi: "Hôm nay nữ hộ sinh khám/làm việc đến mười một giờ.",
        pronunciation_focus: [
          "HA-ri I-ni BI-dan PRAK-tik SAM-pai jam se-BE-las - `bidan` = nữ hộ sinh; `praktik` = có lịch khám/hành nghề.",
          "Với nhân viên y tế, `praktik` tự nhiên hơn `kerja` khi hỏi lịch khám.",
          "Lỗi người Việt: gọi mọi nhân viên y tế là `dokter`. Ở Puskesmas, `bidan` và `perawat` có vai trò riêng.",
        ],
        pronunciation_focus_en: [
          "HA-ree EE-nee BEE-dan PRAK-tik SAM-pai jam se-BE-las - `bidan` = midwife; `praktik` = be seeing patients/practicing.",
          "For health workers, `praktik` is more natural than `kerja` when asking clinic hours.",
          "VN-speaker trap: calling every health worker `dokter`. At a Puskesmas, `bidan` and `perawat` have distinct roles.",
        ],
      },
      {
        en: "Perawat akan mengecek tekanan darah saya.",
        vi: "Y tá sẽ kiểm tra huyết áp của tôi.",
        pronunciation_focus: [
          "pe-RA-wat A-kan me-NGE-cek te-KA-nan DA-rah SA-ya - `perawat` = y tá/điều dưỡng; `tekanan darah` = huyết áp.",
          "`akan mengecek` = sẽ kiểm tra; trong nói thường cũng nghe `akan cek`.",
          "Lỗi người Việt: dịch huyết áp từng chữ lạ. Tiếng Indonesia chuẩn là `tekanan darah`.",
        ],
        pronunciation_focus_en: [
          "pe-RA-wat A-kan me-NGE-chek te-KA-nan DA-rah SA-ya - `perawat` = nurse; `tekanan darah` = blood pressure.",
          "`akan mengecek` = will check; in casual speech you may hear `akan cek`.",
          "VN-speaker trap: guessing a word-for-word blood pressure phrase. Standard Indonesian is `tekanan darah`.",
        ],
      },
      {
        en: "Dokter memberi saya obat generik untuk tiga hari.",
        vi: "Bác sĩ cho tôi thuốc generic trong ba ngày.",
        pronunciation_focus: [
          "DOK-ter mem-BE-ri SA-ya O-bat ge-NE-rik UN-tuk TI-ga HA-ri - `obat generik` = thuốc generic; `untuk tiga hari` = dùng cho ba ngày.",
          "`obat` = thuốc; `resep` = đơn thuốc. Đừng lẫn hai từ này.",
          "Lỗi người Việt: nói `obat umum` để chỉ thuốc generic. Thuật ngữ đúng là `obat generik`.",
        ],
        pronunciation_focus_en: [
          "DOK-ter mem-BE-ree SA-ya O-bat ge-NE-rik UN-tuk TEE-ga HA-ree - `obat generik` = generic medicine; `untuk tiga hari` = for three days.",
          "`obat` = medicine; `resep` = prescription. Do not mix these up.",
          "VN-speaker trap: saying `obat umum` for generic medicine. The correct term is `obat generik`.",
        ],
      },
      {
        en: "Kalau keluhan belum membaik, saya perlu rujukan ke rumah sakit.",
        vi: "Nếu triệu chứng chưa đỡ, tôi cần giấy chuyển tuyến đến bệnh viện.",
        pronunciation_focus: [
          "KA-lau ke-LU-han be-LUM mem-BA-ik, SA-ya PER-lu ru-JU-kan ke RU-mah SA-kit - `keluhan` = triệu chứng/phàn nàn; `rujukan` = giấy chuyển tuyến.",
          "`belum membaik` = chưa cải thiện/đỡ hơn. Đây là cách nói y tế tự nhiên.",
          "Lỗi người Việt: nói `belum baik` nghe như chưa tốt. Với bệnh, dùng `belum membaik`.",
        ],
        pronunciation_focus_en: [
          "KA-lau ke-LOO-han be-LOOM mem-BA-ik, SA-ya PER-loo roo-JOO-kan ke ROO-mah SA-kit - `keluhan` = complaint/symptom; `rujukan` = referral.",
          "`belum membaik` = has not improved yet. This is natural medical language.",
          "VN-speaker trap: saying `belum baik`, which sounds like not good yet. For illness, use `belum membaik`.",
        ],
      },
      {
        en: "Apakah puskesmas ini melayani pasien BPJS?",
        vi: "Puskesmas này có phục vụ bệnh nhân BPJS không?",
        pronunciation_focus: [
          "a-pa-KAH PUS-kes-mas I-ni me-la-YA-ni PA-sien be-pe-je-es - `melayani pasien` = phục vụ/tiếp nhận bệnh nhân; `BPJS` = bảo hiểm y tế/xã hội Indonesia.",
          "`pasien` = bệnh nhân; không phải `sabar` dù tiếng Anh patient có hai nghĩa.",
          "Lỗi người Việt: nói `terima BPJS?` quá ngắn. Dễ hiểu hơn: `melayani pasien BPJS?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH POOS-kes-mas EE-nee me-la-YA-nee PA-sien be-pe-je-es - `melayani pasien` = serve/accept patients; `BPJS` = Indonesian public insurance system.",
          "`pasien` = patient; not `sabar`, even though English patient has two meanings.",
          "VN-speaker trap: saying very short `terima BPJS?`. Clearer: `melayani pasien BPJS?`",
        ],
      },
      {
        en: "Tolong jelaskan aturan minum obatnya.",
        vi: "Làm ơn giải thích cách uống thuốc.",
        pronunciation_focus: [
          "TO-long je-LAS-kan a-TU-ran MI-num O-bat-nya - `aturan minum obat` = hướng dẫn uống thuốc; `jelaskan` = giải thích.",
          "Tiếng Indonesia chuẩn dùng `minum obat` cho uống thuốc, kể cả thuốc viên.",
          "Lỗi người Việt: nói `makan obat` theo thói quen. Trong quầy thuốc/phòng khám, dùng `minum obat`.",
        ],
        pronunciation_focus_en: [
          "TO-long je-LAS-kan a-TOO-ran MEE-noom O-bat-nya - `aturan minum obat` = medicine-taking instructions; `jelaskan` = explain.",
          "Standard Indonesian uses `minum obat` for taking medicine, even tablets.",
          "VN-speaker trap: saying `makan obat` from habit. At a clinic/pharmacy, use `minum obat`.",
        ],
      },
    ],
    cultural_notes_vi:
      "`Puskesmas` là trung tâm y tế cộng đồng cấp phường/xã ở Indonesia, đặc biệt quan trọng ở vùng nông thôn. Ở đó có thể gặp `bidan`, `perawat`, dokter umum, loket pendaftaran, obat generik, và quy trình `rujukan` lên bệnh viện nếu ca bệnh cần chuyên khoa. Nhiều nơi có `jam pelayanan` giới hạn, nên nên đến sớm, lấy `nomor antrean`, và mang KTP/BPJS/kartu berobat nếu có.",
    cultural_notes_en:
      "`Puskesmas` is a community health center at subdistrict/village level in Indonesia, especially important in rural areas. There you may meet a `bidan`, `perawat`, general doctor, registration counter, generic medicines, and a `rujukan` process to a hospital if specialist care is needed. Many locations have limited `jam pelayanan`, so it is best to arrive early, take a `nomor antrean`, and bring KTP/BPJS/patient card if available.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt `bidan` = nữ hộ sinh, `perawat` = y tá/điều dưỡng, `dokter` = bác sĩ. `Berobat` là đi chữa/khám bệnh nói chung; `periksa` là khám/kiểm tra. Câu sống còn ở Puskesmas: `Saya ambil nomor antrean dulu`, `Jam pelayanan sampai jam berapa?`, `Apakah perlu rujukan?`",
    tip_advice_en:
      "Tip for Vietnamese speakers: separate `bidan` = midwife, `perawat` = nurse, and `dokter` = doctor. `Berobat` means seek treatment generally; `periksa` means examine/check. Survival lines at a Puskesmas: `Saya ambil nomor antrean dulu`, `Jam pelayanan sampai jam berapa?`, `Apakah perlu rujukan?`",
    vocabulary: [
      { word: "puskesmas desa", en: "rural community health center", vi: "trạm/trung tâm y tế xã/làng", pos: "noun phrase", pronunciation_vi: "PUS-kes-mas DE-sa", pronunciation_en: "POOS-kes-mas DE-sa" },
      { word: "bidan", en: "midwife", vi: "nữ hộ sinh", pos: "noun", pronunciation_vi: "BI-dan", pronunciation_en: "BEE-dan" },
      { word: "perawat", en: "nurse", vi: "y tá/điều dưỡng", pos: "noun", pronunciation_vi: "pe-RA-wat", pronunciation_en: "pe-RA-wat" },
      { word: "antrean", en: "queue", vi: "hàng chờ/số thứ tự", pos: "noun", pronunciation_vi: "AN-tre-an", pronunciation_en: "AN-tre-an" },
      { word: "kartu berobat", en: "patient card", vi: "thẻ khám/chữa bệnh", pos: "noun phrase", pronunciation_vi: "KAR-tu ber-O-bat", pronunciation_en: "KAR-too ber-O-bat" },
      { word: "obat generik", en: "generic medicine", vi: "thuốc generic", pos: "noun phrase", pronunciation_vi: "O-bat ge-NE-rik", pronunciation_en: "O-bat ge-NE-rik" },
      { word: "rujukan", en: "referral", vi: "giấy chuyển tuyến/giới thiệu", pos: "noun", pronunciation_vi: "ru-JU-kan", pronunciation_en: "roo-JOO-kan" },
      { word: "jam pelayanan", en: "service hours", vi: "giờ phục vụ/làm việc", pos: "noun phrase", pronunciation_vi: "jam pe-la-YA-nan", pronunciation_en: "jam pe-la-YA-nan" },
      { word: "loket pendaftaran", en: "registration counter", vi: "quầy đăng ký", pos: "noun phrase", pronunciation_vi: "LO-ket pen-DAF-tar-an", pronunciation_en: "LO-ket pen-DAF-tar-an" },
      { word: "aturan minum obat", en: "medicine-taking instructions", vi: "hướng dẫn uống thuốc", pos: "noun phrase", pronunciation_vi: "a-TU-ran MI-num O-bat", pronunciation_en: "a-TOO-ran MEE-noom O-bat" },
    ],
    dialogue: [
      {
        speaker: "Pasien",
        text: "Selamat pagi, saya mau berobat di puskesmas desa ini.",
        vi: "Chào buổi sáng, tôi muốn đi khám ở Puskesmas làng này.",
        en: "Good morning, I want to seek treatment at this rural Puskesmas.",
      },
      {
        speaker: "Petugas",
        text: "Silakan ambil nomor antrean dulu di loket pendaftaran.",
        vi: "Vui lòng lấy số thứ tự trước ở quầy đăng ký.",
        en: "Please take a queue number first at the registration counter.",
      },
      {
        speaker: "Pasien",
        text: "Apakah saya perlu membawa kartu berobat dan BPJS?",
        vi: "Tôi có cần mang thẻ khám bệnh và BPJS không?",
        en: "Do I need to bring my patient card and BPJS?",
      },
      {
        speaker: "Petugas",
        text: "Iya. Nanti perawat akan mengecek tekanan darah dulu.",
        vi: "Có. Lát nữa y tá sẽ kiểm tra huyết áp trước.",
        en: "Yes. Later the nurse will check your blood pressure first.",
      },
      {
        speaker: "Pasien",
        text: "Kalau keluhan belum membaik, apakah saya perlu rujukan?",
        vi: "Nếu triệu chứng chưa đỡ, tôi có cần giấy chuyển tuyến không?",
        en: "If the symptoms have not improved, do I need a referral?",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "puskesmas desa", answer: "trung tâm y tế xã/làng" },
          { prompt: "bidan", answer: "nữ hộ sinh" },
          { prompt: "obat generik", answer: "thuốc generic" },
          { prompt: "rujukan", answer: "giấy chuyển tuyến" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi muốn đi khám ở Puskesmas làng.", answer: "Saya mau berobat di puskesmas desa." },
          { prompt: "Tôi lấy số thứ tự trước ở quầy đăng ký.", answer: "Saya ambil nomor antrean dulu di loket pendaftaran." },
          { prompt: "Làm ơn giải thích cách uống thuốc.", answer: "Tolong jelaskan aturan minum obatnya." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu.",
        instruction_en: "Fill in the missing word.",
        items: [
          { prompt: "Jam ___ puskesmas sampai jam dua siang.", answer: "pelayanan" },
          { prompt: "Perawat akan mengecek ___ darah saya.", answer: "tekanan" },
          { prompt: "Kalau keluhan belum membaik, saya perlu ___.", answer: "rujukan" },
        ],
      },
    ],
  },
];
