// Dentist appointment Indonesian (Vietnamese -> Indonesian study track).
//
// A1 Wave 12 file. Covers dokter gigi, sakit gigi, tambal gigi, cabut gigi,
// behel, karang gigi, jadwal kontrol, and biaya perawatan. Self-contained so no
// registry or sibling agent files are touched.
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

export const dentistAppointmentLessons: IndonesianLesson[] = [
  {
    id: "indonesian_dentist_booking_toothache",
    level: "A2",
    category: "health",
    title_vi: "Đặt lịch nha sĩ và nói đau răng",
    title_en: "Booking a dentist and describing toothache",
    sentences: [
      {
        en: "Saya mau buat janji dengan dokter gigi.",
        vi: "Tôi muốn đặt lịch hẹn với nha sĩ.",
        pronunciation_focus: [
          "SA-ya mau BU-at JAN-ji de-NGAN DOK-ter GI-gi - `buat janji` = đặt lịch hẹn; `dokter gigi` = nha sĩ.",
          "`gigi` = răng; đọc `g` cứng cả hai lần, không phải âm `gi` mềm.",
          "Lỗi người Việt: dịch 'đặt lịch' thành `pesan jadwal`. Ở phòng khám, `buat janji` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya mau BOO-at JAN-jee de-NGAN DOK-ter GEE-gee - `buat janji` = make an appointment; `dokter gigi` = dentist.",
          "`gigi` = tooth/teeth; both `g` sounds are hard.",
          "VN-speaker trap: translating 'book a schedule' as `pesan jadwal`. At clinics, `buat janji` is more natural.",
        ],
      },
      {
        en: "Gigi saya sakit sejak tadi malam.",
        vi: "Răng tôi đau từ tối qua.",
        pronunciation_focus: [
          "GI-gi SA-ya SA-kit se-JAK TA-di MA-lam - `sakit gigi` = đau răng; `sejak` = từ/kể từ.",
          "Thứ tự giống tiếng Việt: bộ phận + `saya` + `sakit` = răng tôi đau.",
          "Lỗi người Việt: lẫn `gigi` (răng) với `gusi` (nướu). Đau răng = `gigi saya sakit`; đau nướu = `gusi saya sakit`.",
        ],
        pronunciation_focus_en: [
          "GEE-gee SA-ya SA-kit se-JAK TA-dee MA-lam - `sakit gigi` = toothache; `sejak` = since.",
          "The order matches Vietnamese: body part + `saya` + `sakit` = my tooth hurts.",
          "VN-speaker trap: confusing `gigi` (tooth) with `gusi` (gum). Toothache = `gigi saya sakit`; gum pain = `gusi saya sakit`.",
        ],
      },
      {
        en: "Apakah masih ada jadwal kosong hari ini?",
        vi: "Hôm nay còn lịch trống không ạ?",
        pronunciation_focus: [
          "A-pa-kah ma-SIH A-da JAD-wal KO-song HA-ri I-ni - `jadwal kosong` = lịch trống.",
          "`masih ada` = vẫn còn; rất hữu ích khi hỏi lịch hẹn.",
          "Lỗi người Việt: nói `ada waktu kosong?` vẫn hiểu, nhưng phòng khám hay nói `jadwal kosong`.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah ma-SIH A-da JAD-wal KO-song HA-ree EE-nee - `jadwal kosong` = available slot.",
          "`masih ada` = still available; useful when asking for appointments.",
          "VN-speaker trap: `ada waktu kosong?` is understandable, but clinics commonly say `jadwal kosong`.",
        ],
      },
      {
        en: "Saya takut, tapi sakitnya makin parah.",
        vi: "Tôi sợ, nhưng cơn đau ngày càng nặng.",
        pronunciation_focus: [
          "SA-ya TA-kut, TA-pi SA-kit-nya MA-kin PA-rah - `makin parah` = ngày càng nặng.",
          "`sakitnya` = cơn đau đó; `-nya` giúp nhắc lại vấn đề đang nói.",
          "Lỗi người Việt: nói `sakit lebih berat`. Với bệnh/đau nặng hơn, `makin parah` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya TA-koot, TA-pee SA-kit-nya MA-kin PA-rah - `makin parah` = getting worse.",
          "`sakitnya` = the pain; `-nya` points back to the current problem.",
          "VN-speaker trap: saying `sakit lebih berat`. For pain/illness getting worse, `makin parah` is natural.",
        ],
      },
      {
        en: "Tolong periksa gigi yang sebelah kanan.",
        vi: "Làm ơn khám cái răng bên phải.",
        pronunciation_focus: [
          "TO-long pe-RIK-sa GI-gi yang se-BE-lah KA-nan - `sebelah kanan` = bên phải.",
          "`yang` nối danh từ với mô tả: cái răng mà ở bên phải.",
          "Lỗi người Việt: đặt `kanan` trước danh từ kiểu tiếng Việt. Đúng: `gigi yang sebelah kanan`.",
        ],
        pronunciation_focus_en: [
          "TO-long pe-RIK-sa GEE-gee yang se-BE-lah KA-nan - `sebelah kanan` = right side.",
          "`yang` links the noun to its description: the tooth that is on the right.",
          "VN-speaker trap: putting `kanan` before the noun Vietnamese-style. Correct: `gigi yang sebelah kanan`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, phòng khám nha khoa tư nhân thường gọi là `klinik gigi`, còn nha sĩ là `dokter gigi`. Bạn có thể đặt lịch qua WhatsApp, app, hoặc gọi điện. Khi đau răng, mô tả vị trí (`sebelah kanan/kiri`, `atas/bawah`, `belakang`) và thời gian (`sejak tadi malam`, `sudah tiga hari`) sẽ giúp nha sĩ hiểu nhanh. Nếu đau dữ dội, hỏi lịch gần nhất thay vì chờ jadwal kontrol thông thường.",
    cultural_notes_en:
      "In Indonesia, a private dental clinic is often called `klinik gigi`, and a dentist is `dokter gigi`. You may book by WhatsApp, app, or phone. For toothache, describe location (`sebelah kanan/kiri`, `atas/bawah`, `belakang`) and timing (`sejak tadi malam`, `sudah tiga hari`) so the dentist understands quickly. If the pain is severe, ask for the nearest slot instead of waiting for a routine check-up.",
    tip_advice_vi:
      "Bộ câu mở đầu: `Saya mau buat janji dengan dokter gigi`, `Gigi saya sakit`, `Masih ada jadwal kosong?`. Bẫy lớn là `gigi` vs `gusi`, và thứ tự sở hữu: `gigi saya`, không phải `saya gigi`.",
    tip_advice_en:
      "Opening set: `Saya mau buat janji dengan dokter gigi`, `Gigi saya sakit`, `Masih ada jadwal kosong?`. The big traps are `gigi` vs `gusi`, and possessive order: `gigi saya`, not `saya gigi`.",
    vocabulary: [
      { word: "dokter gigi", en: "dentist", vi: "nha sĩ", pos: "noun", pronunciation_vi: "DOK-ter GI-gi", pronunciation_en: "DOK-ter GEE-gee" },
      { word: "buat janji", en: "make an appointment", vi: "đặt lịch hẹn", pos: "verb phrase", pronunciation_vi: "BU-at JAN-ji", pronunciation_en: "BOO-at JAN-jee" },
      { word: "sakit gigi", en: "toothache", vi: "đau răng", pos: "noun phrase", pronunciation_vi: "SA-kit GI-gi", pronunciation_en: "SA-kit GEE-gee" },
      { word: "jadwal kosong", en: "available slot", vi: "lịch trống", pos: "noun phrase", pronunciation_vi: "JAD-wal KO-song", pronunciation_en: "JAD-wal KO-song" },
      { word: "sebelah kanan", en: "right side", vi: "bên phải", pos: "phrase", pronunciation_vi: "se-BE-lah KA-nan", pronunciation_en: "se-BE-lah KA-nan" },
      { word: "makin parah", en: "getting worse", vi: "ngày càng nặng", pos: "phrase", pronunciation_vi: "MA-kin PA-rah", pronunciation_en: "MA-kin PA-rah" },
    ],
    dialogue: [
      { speaker: "Pasien", text: "Selamat pagi. Saya mau buat janji dengan dokter gigi.", vi: "Chào buổi sáng. Tôi muốn đặt lịch hẹn với nha sĩ.", en: "Good morning. I want to make an appointment with a dentist." },
      { speaker: "Resepsionis", text: "Keluhannya apa, Pak?", vi: "Anh có triệu chứng/vấn đề gì ạ?", en: "What is the complaint, sir?" },
      { speaker: "Pasien", text: "Gigi saya sakit sejak tadi malam. Apakah masih ada jadwal kosong hari ini?", vi: "Răng tôi đau từ tối qua. Hôm nay còn lịch trống không ạ?", en: "My tooth has hurt since last night. Is there any available slot today?" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "dokter gigi", answer: "nha sĩ" },
          { prompt: "sakit gigi", answer: "đau răng" },
          { prompt: "jadwal kosong", answer: "lịch trống" },
          { prompt: "sebelah kanan", answer: "bên phải" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi muốn đặt lịch hẹn với nha sĩ.", answer: "Saya mau buat janji dengan dokter gigi." },
          { prompt: "Răng tôi đau từ tối qua.", answer: "Gigi saya sakit sejak tadi malam." },
        ],
      },
    ],
  },
  {
    id: "indonesian_dental_treatment_costs",
    level: "B1",
    category: "health",
    title_vi: "Trám răng, nhổ răng và chi phí điều trị",
    title_en: "Fillings, extractions and treatment costs",
    sentences: [
      {
        en: "Apakah gigi ini perlu ditambal?",
        vi: "Cái răng này có cần trám không ạ?",
        pronunciation_focus: [
          "A-pa-kah GI-gi I-ni per-LU di-TAM-bal - `ditambal` = được trám (bị động `di-` + `tambal`).",
          "`perlu` = cần; lịch sự và mềm hơn `harus` khi hỏi lựa chọn điều trị.",
          "Lỗi người Việt: bỏ bị động `di-` và nói `perlu tambal`. Tự nhiên hơn: `perlu ditambal`.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah GEE-gee EE-nee per-LOO dee-TAM-bal - `ditambal` = be filled (passive `di-` + `tambal`).",
          "`perlu` = need; softer than `harus` when asking about treatment options.",
          "VN-speaker trap: dropping passive `di-` and saying `perlu tambal`. More natural: `perlu ditambal`.",
        ],
      },
      {
        en: "Kalau tidak bisa ditambal, apakah harus dicabut?",
        vi: "Nếu không trám được, có phải nhổ không ạ?",
        pronunciation_focus: [
          "KA-lau TI-dak BI-sa di-TAM-bal, A-pa-kah HA-rus di-CA-but - `dicabut` = được/bị nhổ.",
          "`c` trong `cabut` đọc như 'ch': CHA-but, không phải KA-but.",
          "Lỗi người Việt: lẫn `tambal` (trám) với `cabut` (nhổ). Đây là hai thủ thuật rất khác nhau.",
        ],
        pronunciation_focus_en: [
          "KA-lau TEE-dak BEE-sa dee-TAM-bal, A-pa-kah HA-roos dee-CHA-boot - `dicabut` = be extracted.",
          "`c` in `cabut` is `ch`: CHA-boot, not KA-boot.",
          "VN-speaker trap: confusing `tambal` (fill) with `cabut` (extract). These are very different procedures.",
        ],
      },
      {
        en: "Berapa biaya perawatan untuk tambal gigi?",
        vi: "Chi phí điều trị trám răng là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa BI-a-ya pe-ra-WA-tan UN-tuk TAM-bal GI-gi - `biaya perawatan` = chi phí điều trị/chăm sóc.",
          "`berapa biaya` = chi phí bao nhiêu; không dùng `apa biaya`.",
          "Lỗi người Việt: nói `harga perawatan`. Có thể hiểu, nhưng phòng khám thường dùng `biaya perawatan`.",
        ],
        pronunciation_focus_en: [
          "be-RA-pa BEE-a-ya pe-ra-WA-tan OON-tuk TAM-bal GEE-gee - `biaya perawatan` = treatment cost.",
          "`berapa biaya` = how much is the cost; not `apa biaya`.",
          "VN-speaker trap: saying `harga perawatan`. Understandable, but clinics usually use `biaya perawatan`.",
        ],
      },
      {
        en: "Apakah biayanya sudah termasuk obat?",
        vi: "Chi phí đã bao gồm thuốc chưa?",
        pronunciation_focus: [
          "A-pa-kah BI-a-ya-nya SU-dah ter-MA-suk O-bat - `termasuk` = bao gồm.",
          "`obat` = thuốc; không phải đơn thuốc (`resep`).",
          "Lỗi người Việt: lẫn `obat` với `resep`. Thuốc uống là `obat`; giấy kê thuốc là `resep`.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah BEE-a-ya-nya SOO-dah ter-MA-sook O-bat - `termasuk` = included.",
          "`obat` = medicine; not prescription (`resep`).",
          "VN-speaker trap: confusing `obat` with `resep`. The medicine is `obat`; the prescription paper is `resep`.",
        ],
      },
      {
        en: "Saya mau tahu risiko sebelum cabut gigi.",
        vi: "Tôi muốn biết rủi ro trước khi nhổ răng.",
        pronunciation_focus: [
          "SA-ya mau TA-hu RI-si-ko se-BE-lum CA-but GI-gi - `risiko` = rủi ro.",
          "`sebelum` = trước khi; đặt trước thủ thuật.",
          "Lỗi người Việt: hỏi quá ngắn `bahaya apa?`. Câu đầy đủ `Saya mau tahu risiko...` lịch sự và rõ hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya mau TA-hoo REE-see-ko se-BE-loom CHA-boot GEE-gee - `risiko` = risk.",
          "`sebelum` = before; place it before the procedure.",
          "VN-speaker trap: asking too bluntly `bahaya apa?`. Full `Saya mau tahu risiko...` is clearer and polite.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở phòng khám nha khoa Indonesia, bạn có thể nghe nhiều từ thủ thuật như `tambal gigi`, `cabut gigi`, `scaling`, `karang gigi`, và `behel`. Trước khi đồng ý điều trị, hỏi `biaya perawatan`, liệu thuốc đã termasuk, cần bao nhiêu lần datang, và có jadwal kontrol không. Nếu chưa hiểu, câu `Bisa dijelaskan pelan-pelan?` rất hữu ích.",
    cultural_notes_en:
      "At Indonesian dental clinics, you may hear procedure terms such as `tambal gigi`, `cabut gigi`, `scaling`, `karang gigi`, and `behel`. Before agreeing to treatment, ask the `biaya perawatan`, whether medicine is included, how many visits are needed, and whether there is a follow-up schedule. If you do not understand, `Bisa dijelaskan pelan-pelan?` is useful.",
    tip_advice_vi:
      "Phân biệt ba động từ thủ thuật: `tambal` = trám, `cabut` = nhổ, `bersihkan` = làm sạch/cạo vôi. Khi nói răng được xử lý, tiếng Indonesia hay dùng bị động `di-`: `ditambal`, `dicabut`, `dibersihkan`.",
    tip_advice_en:
      "Distinguish three procedure verbs: `tambal` = fill, `cabut` = extract, `bersihkan` = clean. When the tooth receives treatment, Indonesian often uses passive `di-`: `ditambal`, `dicabut`, `dibersihkan`.",
    vocabulary: [
      { word: "tambal gigi", en: "tooth filling", vi: "trám răng", pos: "noun/verb phrase", pronunciation_vi: "TAM-bal GI-gi", pronunciation_en: "TAM-bal GEE-gee" },
      { word: "cabut gigi", en: "tooth extraction", vi: "nhổ răng", pos: "noun/verb phrase", pronunciation_vi: "CA-but GI-gi", pronunciation_en: "CHA-boot GEE-gee" },
      { word: "ditambal", en: "filled", vi: "được trám", pos: "passive verb", pronunciation_vi: "di-TAM-bal", pronunciation_en: "dee-TAM-bal" },
      { word: "dicabut", en: "extracted", vi: "được/bị nhổ", pos: "passive verb", pronunciation_vi: "di-CA-but", pronunciation_en: "dee-CHA-boot" },
      { word: "biaya perawatan", en: "treatment cost", vi: "chi phí điều trị", pos: "noun phrase", pronunciation_vi: "BI-a-ya pe-ra-WA-tan", pronunciation_en: "BEE-a-ya pe-ra-WA-tan" },
      { word: "risiko", en: "risk", vi: "rủi ro", pos: "noun", pronunciation_vi: "RI-si-ko", pronunciation_en: "REE-see-ko" },
    ],
    dialogue: [
      { speaker: "Dokter gigi", text: "Gigi ini berlubang cukup besar.", vi: "Cái răng này bị sâu/lỗ khá lớn.", en: "This tooth has quite a large cavity." },
      { speaker: "Pasien", text: "Apakah masih bisa ditambal, Dok?", vi: "Vẫn trám được không, bác sĩ?", en: "Can it still be filled, doctor?" },
      { speaker: "Pasien", text: "Berapa biaya perawatan untuk tambal gigi?", vi: "Chi phí điều trị trám răng là bao nhiêu?", en: "How much is the treatment cost for a filling?" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng.",
        instruction_en: "Fill in the correct word.",
        items: [
          { prompt: "Apakah gigi ini perlu ___?", answer: "ditambal" },
          { prompt: "Kalau tidak bisa ditambal, apakah harus ___?", answer: "dicabut" },
          { prompt: "Berapa ___ perawatan untuk tambal gigi?", answer: "biaya" },
        ],
      },
      {
        type: "rewrite",
        instruction_vi: "Sửa câu Việt hóa sang câu tự nhiên hơn.",
        instruction_en: "Rewrite the Vietnamese-style sentence into natural Indonesian.",
        items: [
          { prompt: "Gigi perlu tambal?", answer: "Apakah gigi ini perlu ditambal?" },
          { prompt: "Harga perawatan berapa?", answer: "Berapa biaya perawatannya?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_braces_scaling_followup",
    level: "B1",
    category: "health",
    title_vi: "Niềng răng, cạo vôi và lịch tái khám",
    title_en: "Braces, scaling and follow-up appointments",
    sentences: [
      {
        en: "Saya mau konsultasi tentang behel.",
        vi: "Tôi muốn tư vấn về niềng răng.",
        pronunciation_focus: [
          "SA-ya mau kon-sul-TA-si ten-TANG BE-hel - `behel` = niềng răng.",
          "`konsultasi tentang` = tư vấn/hỏi về; hợp trước khi quyết định điều trị.",
          "Lỗi người Việt: nói `braces` bằng tiếng Anh. Ở Indonesia, từ đời thường rất phổ biến là `behel`.",
        ],
        pronunciation_focus_en: [
          "SA-ya mau kon-sool-TA-see ten-TANG BE-hel - `behel` = braces.",
          "`konsultasi tentang` = consult about; useful before deciding on treatment.",
          "VN-speaker trap: saying English `braces`. In Indonesia, the everyday word is `behel`.",
        ],
      },
      {
        en: "Tolong bersihkan karang gigi saya.",
        vi: "Làm ơn cạo vôi răng giúp tôi.",
        pronunciation_focus: [
          "TO-long ber-sih-KAN KA-rang GI-gi SA-ya - `karang gigi` = cao/vôi răng; `bersihkan` = làm sạch.",
          "`bersih` là tính từ 'sạch'; `bersihkan` là động từ 'làm cho sạch'.",
          "Lỗi người Việt: nói `tolong bersih`. Cần hậu tố `-kan`: `tolong bersihkan`.",
        ],
        pronunciation_focus_en: [
          "TO-long ber-sih-KAN KA-rang GEE-gee SA-ya - `karang gigi` = tartar/plaque; `bersihkan` = clean it.",
          "`bersih` is the adjective 'clean'; `bersihkan` is the verb 'make clean'.",
          "VN-speaker trap: saying `tolong bersih`. You need the suffix `-kan`: `tolong bersihkan`.",
        ],
      },
      {
        en: "Kapan jadwal kontrol berikutnya?",
        vi: "Lịch tái khám tiếp theo là khi nào?",
        pronunciation_focus: [
          "KA-pan JAD-wal kon-TROL be-ri-KUT-nya - `jadwal kontrol` = lịch tái khám/kiểm tra lại.",
          "`berikutnya` = tiếp theo; dùng cho lần hẹn sau.",
          "Lỗi người Việt: dịch 'tái khám' thành một động từ dài. Trong nha khoa, cứ hỏi `jadwal kontrol`.",
        ],
        pronunciation_focus_en: [
          "KA-pan JAD-wal kon-TROL be-ree-KOOT-nya - `jadwal kontrol` = follow-up/control appointment.",
          "`berikutnya` = next; used for the next visit.",
          "VN-speaker trap: over-translating 'follow-up visit'. In dentistry, ask for `jadwal kontrol`.",
        ],
      },
      {
        en: "Saya harus kontrol sebulan sekali.",
        vi: "Tôi phải tái khám mỗi tháng một lần.",
        pronunciation_focus: [
          "SA-ya HA-rus kon-TROL se-BU-lan se-KA-li - `sebulan sekali` = mỗi tháng một lần.",
          "Cấu trúc tần suất: `se- + thời gian + sekali` = mỗi ... một lần.",
          "Lỗi người Việt: nói `satu bulan satu kali`. Hiểu được, nhưng `sebulan sekali` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya HA-roos kon-TROL se-BOO-lan se-KA-lee - `sebulan sekali` = once a month.",
          "Frequency frame: `se- + time period + sekali` = once per ...",
          "VN-speaker trap: saying `satu bulan satu kali`. Understandable, but `sebulan sekali` is more natural.",
        ],
      },
      {
        en: "Kalau kawat behel lepas, saya harus bagaimana?",
        vi: "Nếu dây niềng bị bung, tôi phải làm sao?",
        pronunciation_focus: [
          "KA-lau KA-wat BE-hel LE-pas, SA-ya HA-rus ba-gai-MA-na - `kawat behel` = dây niềng; `lepas` = bung/tuột.",
          "`harus bagaimana?` = phải làm sao; câu cứu nguy rất thực tế.",
          "Lỗi người Việt: hỏi `saya harus apa?` nghe thiếu tự nhiên. Nói `saya harus bagaimana?`.",
        ],
        pronunciation_focus_en: [
          "KA-lau KA-wat BE-hel LE-pas, SA-ya HA-roos ba-gai-MA-na - `kawat behel` = braces wire; `lepas` = comes loose.",
          "`harus bagaimana?` = what should I do; a practical emergency question.",
          "VN-speaker trap: asking `saya harus apa?`, which sounds less natural. Say `saya harus bagaimana?`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, `behel` là từ rất phổ biến cho niềng răng. Người đeo behel thường có `jadwal kontrol` định kỳ, có thể mỗi tháng một lần. `Karang gigi` là cao/vôi răng; thủ thuật làm sạch thường được gọi là `scaling` hoặc `membersihkan karang gigi`. Nếu dây behel bung hoặc đau bất thường, nhắn phòng khám bằng câu ngắn, rõ: vấn đề gì, từ khi nào, có đau không.",
    cultural_notes_en:
      "In Indonesia, `behel` is the common word for braces. People with braces usually have regular `jadwal kontrol`, sometimes once a month. `Karang gigi` is tartar/plaque; cleaning is often called `scaling` or `membersihkan karang gigi`. If a braces wire comes loose or pain is unusual, message the clinic briefly and clearly: what happened, since when, and whether it hurts.",
    tip_advice_vi:
      "Cụm nha khoa định kỳ: `konsultasi tentang behel`, `bersihkan karang gigi`, `jadwal kontrol`, `sebulan sekali`. Bẫy người Việt là `bersih` vs `bersihkan`: tính từ không đủ cho câu nhờ làm sạch.",
    tip_advice_en:
      "Routine dental phrases: `konsultasi tentang behel`, `bersihkan karang gigi`, `jadwal kontrol`, `sebulan sekali`. The VN-speaker trap is `bersih` vs `bersihkan`: the adjective alone is not enough when requesting cleaning.",
    vocabulary: [
      { word: "behel", en: "braces", vi: "niềng răng", pos: "noun", pronunciation_vi: "BE-hel", pronunciation_en: "BE-hel" },
      { word: "karang gigi", en: "tartar/plaque", vi: "cao răng/vôi răng", pos: "noun phrase", pronunciation_vi: "KA-rang GI-gi", pronunciation_en: "KA-rang GEE-gee" },
      { word: "bersihkan", en: "clean it", vi: "làm sạch/cạo", pos: "verb", pronunciation_vi: "ber-sih-KAN", pronunciation_en: "ber-sih-KAN" },
      { word: "jadwal kontrol", en: "follow-up appointment", vi: "lịch tái khám", pos: "noun phrase", pronunciation_vi: "JAD-wal kon-TROL", pronunciation_en: "JAD-wal kon-TROL" },
      { word: "sebulan sekali", en: "once a month", vi: "mỗi tháng một lần", pos: "phrase", pronunciation_vi: "se-BU-lan se-KA-li", pronunciation_en: "se-BOO-lan se-KA-lee" },
      { word: "kawat behel", en: "braces wire", vi: "dây niềng", pos: "noun phrase", pronunciation_vi: "KA-wat BE-hel", pronunciation_en: "KA-wat BE-hel" },
    ],
    dialogue: [
      { speaker: "Pasien", text: "Saya mau konsultasi tentang behel.", vi: "Tôi muốn tư vấn về niềng răng.", en: "I want to consult about braces." },
      { speaker: "Dokter gigi", text: "Bisa. Nanti kita cek kondisi gigi dulu.", vi: "Được. Lát nữa chúng ta kiểm tra tình trạng răng trước.", en: "Sure. Later we will check the condition of your teeth first." },
      { speaker: "Pasien", text: "Kalau pakai behel, jadwal kontrolnya kapan?", vi: "Nếu niềng răng, lịch tái khám là khi nào?", en: "If I use braces, when are the follow-up appointments?" },
    ],
    exercises: [
      {
        type: "scenario",
        instruction_vi: "Chọn câu phù hợp cho tình huống.",
        instruction_en: "Choose the suitable sentence for the situation.",
        items: [
          { prompt: "Bạn muốn tư vấn niềng răng.", answer: "Saya mau konsultasi tentang behel." },
          { prompt: "Bạn muốn cạo vôi răng.", answer: "Tolong bersihkan karang gigi saya." },
          { prompt: "Bạn hỏi lịch tái khám tiếp theo.", answer: "Kapan jadwal kontrol berikutnya?" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi phải tái khám mỗi tháng một lần.", answer: "Saya harus kontrol sebulan sekali." },
          { prompt: "Nếu dây niềng bị bung, tôi phải làm sao?", answer: "Kalau kawat behel lepas, saya harus bagaimana?" },
        ],
      },
    ],
  },
];
