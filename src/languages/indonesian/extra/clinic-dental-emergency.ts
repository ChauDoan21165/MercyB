// Dental emergency clinic Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It mirrors sibling Indonesian `extra/*`
// files: target-language text is stored in `en`, Vietnamese glosses in `vi`,
// Vietnamese-facing L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.
//
// Register note: emergency dental Indonesian should be short, clear, and calm:
// `sakit gigi mendadak`, `gigi bengkak`, `dokter gigi darurat`, `obat nyeri`,
// `tambal sementara`, `cabut gigi`, and `jadwal cepat`.

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
    id: "indonesian_clinic_dental_emergency",
    level: "B1",
    category: "health",
    title_vi: "Cấp cứu nha khoa ở phòng khám",
    title_en: "Dental emergency at a clinic",
    sentences: [
      {
        en: "Saya sakit gigi mendadak sejak tadi malam.",
        vi: "Tôi bị đau răng đột ngột từ tối qua.",
        pronunciation_focus: [
          "SA-ya SA-kit GI-gi men-DA-dak se-JAK TA-di MA-lam - `sakit gigi mendadak` = đau răng đột ngột.",
          "Lỗi người Việt: lẫn `gigi` (răng) với `gusi` (nướu). Đau răng là `sakit gigi`, không phải `sakit gusi`.",
          "Luyện: `Saya sakit gigi mendadak.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SA-kit GEE-gee men-DA-dak seh-JAK TA-dee MA-lam - `sakit gigi mendadak` = sudden toothache.",
          "VN-speaker trap: confusing `gigi` (tooth) and `gusi` (gum). Toothache is `sakit gigi`, not `sakit gusi`.",
          "Drill: `Saya sakit gigi mendadak.`",
        ],
      },
      {
        en: "Gigi belakang saya bengkak dan nyut-nyutan.",
        vi: "Răng phía sau của tôi sưng và đau nhói từng cơn.",
        pronunciation_focus: [
          "GI-gi be-LA-kang SA-ya BENG-kak dan NYUT-NYUT-an - `bengkak` = sưng; `nyut-nyutan` = đau nhói/đập từng cơn.",
          "Lỗi người Việt: nói `sakit sekali` được, nhưng `nyut-nyutan` mô tả kiểu đau răng chính xác hơn.",
          "Luyện: `Gigi saya nyut-nyutan.`",
        ],
        pronunciation_focus_en: [
          "GEE-gee beh-LA-kang SA-ya BENG-kak dan NYOOT-NYOOT-an - `bengkak` = swollen; `nyut-nyutan` = throbbing pain.",
          "VN-speaker note: `sakit sekali` works, but `nyut-nyutan` describes tooth pain more precisely.",
          "Drill: `Gigi saya nyut-nyutan.`",
        ],
      },
      {
        en: "Apakah ada dokter gigi darurat hari ini?",
        vi: "Hôm nay có nha sĩ cấp cứu không?",
        pronunciation_focus: [
          "a-PA-kah A-da DOK-ter GI-gi da-RU-rat HA-ri I-ni - `dokter gigi darurat` = nha sĩ cấp cứu.",
          "Lỗi người Việt: dùng `emergency dentist` trong câu Indonesia. Cụm tự nhiên là `dokter gigi darurat`.",
          "Luyện: `Ada dokter gigi darurat?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah A-da DOK-ter GEE-gee da-ROO-rat HA-ree EE-nee - `dokter gigi darurat` = emergency dentist.",
          "VN-speaker trap: saying English `emergency dentist` inside Indonesian. Natural phrase: `dokter gigi darurat`.",
          "Drill: `Ada dokter gigi darurat?`",
        ],
      },
      {
        en: "Saya butuh jadwal cepat karena sakitnya tidak tertahan.",
        vi: "Tôi cần lịch sớm vì cơn đau không chịu nổi.",
        pronunciation_focus: [
          "SA-ya BU-tuh JAD-wal CE-pat ka-RE-na SA-kit-nya TI-dak ter-TA-han - `jadwal cepat` = lịch sớm/nhanh; `tidak tertahan` = không chịu nổi.",
          "Lỗi người Việt: nói `jadwal cepat-cepat` nghe gấp và kém tự nhiên. Dùng `jadwal cepat` hoặc `secepat mungkin`.",
          "Luyện: `Saya butuh jadwal cepat.`",
        ],
        pronunciation_focus_en: [
          "SA-ya BOO-tooh JAD-wal CHEH-pat ka-REH-na SA-kit-nya TEE-dak ter-TA-han - `jadwal cepat` = quick/early appointment; `tidak tertahan` = unbearable.",
          "VN-speaker trap: `jadwal cepat-cepat` sounds rushed and unnatural. Use `jadwal cepat` or `secepat mungkin`.",
          "Drill: `Saya butuh jadwal cepat.`",
        ],
      },
      {
        en: "Boleh minta obat nyeri sementara?",
        vi: "Có thể xin thuốc giảm đau tạm thời không?",
        pronunciation_focus: [
          "BO-leh MIN-ta O-bat NYE-ri se-men-TA-ra - `obat nyeri` = thuốc giảm đau; `sementara` = tạm thời.",
          "Lỗi người Việt: `nyeri` là đau kiểu y khoa, còn `obat nyeri` thường hiểu là thuốc giảm đau. Cũng có thể nói `obat pereda nyeri`.",
          "Luyện: `Minta obat nyeri sementara.`",
        ],
        pronunciation_focus_en: [
          "BO-leh MIN-ta O-bat NYEH-ree seh-men-TA-ra - `obat nyeri` = pain medicine; `sementara` = temporary.",
          "VN-speaker note: `nyeri` is a medical word for pain. `Obat nyeri` is understood as pain medicine; `obat pereda nyeri` is fuller.",
          "Drill: `Minta obat nyeri sementara.`",
        ],
      },
      {
        en: "Apakah gigi ini bisa ditambal sementara?",
        vi: "Cái răng này có thể trám tạm thời không?",
        pronunciation_focus: [
          "a-PA-kah GI-gi I-ni BI-sa di-TAM-bal se-men-TA-ra - `ditambal sementara` = được trám tạm thời.",
          "Lỗi người Việt: lẫn `tambal` (trám) với `cabut` (nhổ). Trám giữ răng lại; nhổ là lấy răng ra.",
          "Luyện: `Ditambal sementara.`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah GEE-gee EE-nee BEE-sa dee-TAM-bal seh-men-TA-ra - `ditambal sementara` = temporarily filled.",
          "VN-speaker trap: confusing `tambal` (fill) with `cabut` (extract). Filling keeps the tooth; extraction removes it.",
          "Drill: `Ditambal sementara.`",
        ],
      },
      {
        en: "Kalau infeksinya parah, apakah harus cabut gigi?",
        vi: "Nếu nhiễm trùng nặng, có phải nhổ răng không?",
        pronunciation_focus: [
          "KA-lau in-FEK-si-nya PA-rah, a-PA-kah HA-rus CA-but GI-gi - `infeksi parah` = nhiễm trùng nặng; `cabut gigi` = nhổ răng.",
          "Lỗi người Việt: đọc `cabut` với âm k. Trong Indonesia, `c` đọc như ch: `cha-but`.",
          "Luyện: `Harus cabut gigi?`",
        ],
        pronunciation_focus_en: [
          "KA-lau in-FEK-see-nya PA-rah, a-PA-kah HA-roos CHA-boot GEE-gee - `infeksi parah` = severe infection; `cabut gigi` = tooth extraction.",
          "VN-speaker trap: reading `cabut` with a k sound. Indonesian `c` is like ch: `cha-but`.",
          "Drill: `Harus cabut gigi?`",
        ],
      },
      {
        en: "Saya takut cabut gigi, bisa dijelaskan pilihannya?",
        vi: "Tôi sợ nhổ răng, có thể giải thích các lựa chọn không?",
        pronunciation_focus: [
          "SA-ya TA-kut CA-but GI-gi, BI-sa di-JE-las-kan pi-LIH-an-nya - `pilihan` = lựa chọn; `dijelaskan` = được giải thích.",
          "Lỗi người Việt: chỉ nói `saya takut` rồi im. Thêm `bisa dijelaskan pilihannya?` để hỏi phương án điều trị.",
          "Luyện: `Bisa dijelaskan pilihannya?`",
        ],
        pronunciation_focus_en: [
          "SA-ya TA-koot CHA-boot GEE-gee, BEE-sa dee-JEH-las-kan pee-LEE-han-nya - `pilihan` = options; `dijelaskan` = explained.",
          "VN-speaker note: do not stop at `saya takut`. Add `bisa dijelaskan pilihannya?` to ask about treatment options.",
          "Drill: `Bisa dijelaskan pilihannya?`",
        ],
      },
      {
        en: "Gusi saya juga bengkak dan terasa panas.",
        vi: "Nướu của tôi cũng sưng và cảm thấy nóng.",
        pronunciation_focus: [
          "GU-si SA-ya JU-ga BENG-kak dan te-RA-sa PA-nas - `gusi` = nướu; `terasa panas` = cảm thấy nóng/rát.",
          "Lỗi người Việt: `gigi` là răng, `gusi` là nướu. Nói đúng bộ phận giúp bác sĩ hiểu nhanh.",
          "Luyện: `Gusi saya bengkak.`",
        ],
        pronunciation_focus_en: [
          "GOO-see SA-ya JOO-ga BENG-kak dan teh-RA-sa PA-nas - `gusi` = gum; `terasa panas` = feels hot/burning.",
          "VN-speaker trap: `gigi` is tooth, `gusi` is gum. Naming the right part helps the dentist understand quickly.",
          "Drill: `Gusi saya bengkak.`",
        ],
      },
      {
        en: "Apakah perlu rontgen sebelum tindakan?",
        vi: "Có cần chụp X-quang trước khi làm thủ thuật không?",
        pronunciation_focus: [
          "a-PA-kah PER-lu RON-tgen se-BE-lum tin-DA-kan - `rontgen` = chụp X-quang; `tindakan` = thủ thuật/xử lý y tế.",
          "Lỗi người Việt: dùng `aksi` cho thủ thuật. Trong y tế dùng `tindakan`.",
          "Luyện: `Perlu rontgen sebelum tindakan?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah PER-loo RON-gen seh-BEH-loom tin-DA-kan - `rontgen` = X-ray; `tindakan` = procedure/medical action.",
          "VN-speaker trap: using `aksi` for a medical procedure. Healthcare uses `tindakan`.",
          "Drill: `Perlu rontgen sebelum tindakan?`",
        ],
      },
      {
        en: "Berapa biaya tambal sementara dan obat nyeri?",
        vi: "Chi phí trám tạm thời và thuốc giảm đau là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa BI-a-ya TAM-bal se-men-TA-ra dan O-bat NYE-ri - `biaya` = chi phí; `berapa` = bao nhiêu.",
          "Lỗi người Việt: hỏi giá bằng `apa`. Với tiền/chi phí, dùng `berapa`.",
          "Luyện: `Biaya tambal sementara berapa?`",
        ],
        pronunciation_focus_en: [
          "beh-RA-pa BEE-a-ya TAM-bal seh-men-TA-ra dan O-bat NYEH-ree - `biaya` = cost; `berapa` = how much.",
          "VN-speaker trap: asking prices with `apa`. For money/costs, use `berapa`.",
          "Drill: `Biaya tambal sementara berapa?`",
        ],
      },
      {
        en: "Kalau sakitnya bertambah parah, saya harus kembali kapan?",
        vi: "Nếu cơn đau nặng thêm, tôi phải quay lại khi nào?",
        pronunciation_focus: [
          "KA-lau SA-kit-nya ber-TAM-bah PA-rah, SA-ya HA-rus kem-BA-li KA-pan - `bertambah parah` = nặng thêm; `kembali` = quay lại.",
          "Lỗi người Việt: nói `sakit naik` không tự nhiên. Dùng `bertambah parah` hoặc `memburuk`.",
          "Luyện: `Kalau bertambah parah, kembali kapan?`",
        ],
        pronunciation_focus_en: [
          "KA-lau SA-kit-nya ber-TAM-bah PA-rah, SA-ya HA-roos kem-BA-lee KA-pan - `bertambah parah` = gets worse; `kembali` = return.",
          "VN-speaker trap: `sakit naik` is not natural. Use `bertambah parah` or `memburuk`.",
          "Drill: `Kalau bertambah parah, kembali kapan?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, phòng khám nha khoa có thể dùng từ `dokter gigi`, `klinik gigi`, `tindakan`, `tambal`, và `cabut`. Khi đau gấp, hãy nói ngắn gọn thời điểm bắt đầu đau, vị trí răng, mức độ sưng, thuốc đã uống, và hỏi liệu có `jadwal cepat`. Bài này dạy ngôn ngữ thực tế, không thay thế tư vấn y tế.",
    cultural_notes_en:
      "In Indonesia, dental clinics may use terms like `dokter gigi`, `klinik gigi`, `tindakan`, `tambal`, and `cabut`. In urgent pain, state briefly when it started, which tooth hurts, swelling level, medicine already taken, and ask whether a `jadwal cepat` is available. This lesson teaches practical language, not medical advice.",
    tip_advice_vi:
      "Mẹo cho người Việt: nhớ `gigi` = răng, `gusi` = nướu, `tambal` = trám, `cabut` = nhổ, `obat nyeri` = thuốc giảm đau. Khi sợ thủ thuật, dùng câu mềm: `Bisa dijelaskan pilihannya?`",
    tip_advice_en:
      "Tip for Vietnamese speakers: remember `gigi` = tooth, `gusi` = gum, `tambal` = filling, `cabut` = extraction, `obat nyeri` = pain medicine. If you are afraid of a procedure, use the soft question: `Bisa dijelaskan pilihannya?`",
    vocabulary: [
      {
        word: "sakit gigi mendadak",
        en: "sudden toothache",
        vi: "đau răng đột ngột",
        pos: "noun phrase",
        pronunciation_vi: "SA-kit GI-gi men-DA-dak",
        pronunciation_en: "SA-kit GEE-gee men-DA-dak",
      },
      {
        word: "gigi bengkak",
        en: "swollen tooth area",
        vi: "răng/vùng quanh răng bị sưng",
        pos: "noun phrase",
        pronunciation_vi: "GI-gi BENG-kak",
        pronunciation_en: "GEE-gee BENG-kak",
      },
      {
        word: "dokter gigi darurat",
        en: "emergency dentist",
        vi: "nha sĩ cấp cứu",
        pos: "noun phrase",
        pronunciation_vi: "DOK-ter GI-gi da-RU-rat",
        pronunciation_en: "DOK-ter GEE-gee da-ROO-rat",
      },
      {
        word: "obat nyeri",
        en: "pain medicine",
        vi: "thuốc giảm đau",
        pos: "noun phrase",
        pronunciation_vi: "O-bat NYE-ri",
        pronunciation_en: "O-bat NYEH-ree",
      },
      {
        word: "tambal sementara",
        en: "temporary filling",
        vi: "trám tạm thời",
        pos: "noun phrase",
        pronunciation_vi: "TAM-bal se-men-TA-ra",
        pronunciation_en: "TAM-bal seh-men-TA-ra",
      },
      {
        word: "cabut gigi",
        en: "tooth extraction",
        vi: "nhổ răng",
        pos: "noun / verb phrase",
        pronunciation_vi: "CA-but GI-gi",
        pronunciation_en: "CHA-boot GEE-gee",
      },
      {
        word: "jadwal cepat",
        en: "quick appointment",
        vi: "lịch sớm/nhanh",
        pos: "noun phrase",
        pronunciation_vi: "JAD-wal CE-pat",
        pronunciation_en: "JAD-wal CHEH-pat",
      },
      {
        word: "gusi",
        en: "gum",
        vi: "nướu/lợi",
        pos: "noun",
        pronunciation_vi: "GU-si",
        pronunciation_en: "GOO-see",
      },
      {
        word: "rontgen",
        en: "X-ray",
        vi: "chụp X-quang",
        pos: "noun / verb",
        pronunciation_vi: "RON-tgen",
        pronunciation_en: "RON-gen",
      },
      {
        word: "tindakan",
        en: "medical procedure",
        vi: "thủ thuật/xử lý y tế",
        pos: "noun",
        pronunciation_vi: "tin-DA-kan",
        pronunciation_en: "tin-DA-kan",
      },
    ],
    dialogue: [
      {
        speaker: "Pasien",
        text: "Permisi, saya sakit gigi mendadak dan gusi saya bengkak.",
        vi: "Xin lỗi, tôi bị đau răng đột ngột và nướu bị sưng.",
        en: "Excuse me, I have a sudden toothache and my gum is swollen.",
      },
      {
        speaker: "Resepsionis Klinik",
        text: "Kami cek dulu jadwal dokter gigi darurat. Sakitnya sejak kapan?",
        vi: "Chúng tôi kiểm tra lịch nha sĩ cấp cứu trước. Đau từ khi nào?",
        en: "We will check the emergency dentist schedule first. Since when has it hurt?",
      },
      {
        speaker: "Pasien",
        text: "Sejak tadi malam. Saya butuh jadwal cepat karena sakitnya tidak tertahan.",
        vi: "Từ tối qua. Tôi cần lịch sớm vì đau không chịu nổi.",
        en: "Since last night. I need a quick appointment because the pain is unbearable.",
      },
      {
        speaker: "Dokter Gigi",
        text: "Nanti kita periksa. Mungkin perlu rontgen sebelum tambal sementara atau cabut gigi.",
        vi: "Lát nữa chúng ta sẽ khám. Có thể cần chụp X-quang trước khi trám tạm hoặc nhổ răng.",
        en: "We will examine it later. An X-ray may be needed before a temporary filling or extraction.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: “Tôi bị đau răng đột ngột.”",
        prompt_en: "Translate into Indonesian: “I have a sudden toothache.”",
        answer: "Saya sakit gigi mendadak.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ còn thiếu: Apakah gigi ini bisa ditambal ____?",
        prompt_en: "Fill in the blank: Apakah gigi ini bisa ditambal ____?",
        answer: "sementara",
      },
      {
        type: "multiple_choice",
        prompt_vi: "Cụm nào nghĩa là “nhổ răng”?",
        prompt_en: "Which phrase means “tooth extraction”?",
        choices: ["cabut gigi", "tambal gigi", "scan gigi"],
        answer: "cabut gigi",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `obat nyeri` = ?",
        prompt_en: "Match the meaning: `obat nyeri` = ?",
        answer: "pain medicine",
      },
    ],
  },
];

export default lessons;
