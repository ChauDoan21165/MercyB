// Sick child doctor Indonesian (Vietnamese -> Indonesian study track).
//
// A6 Wave 21 file. Covers anak demam, dokter anak, batuk pilek, obat sirup,
// izin sekolah, kompres, suhu tubuh, and kontrol ulang.
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
    id: "indonesian_sick_child_doctor",
    level: "A2",
    category: "health",
    title_vi: "Đưa con bị sốt đi khám bác sĩ nhi",
    title_en: "Taking a sick child to the pediatrician",
    sentences: [
      {
        en: "Anak saya demam sejak tadi malam.",
        vi: "Con tôi bị sốt từ tối qua.",
        pronunciation_focus: [
          "A-nak SA-ya de-MAM se-JAK TA-di MA-lam - `anak saya` = con tôi; `demam` = sốt; `sejak tadi malam` = từ tối qua.",
          "`demam` rõ hơn `panas` trong ngữ cảnh y tế, dù người Indonesia đôi khi nói thân mật `badannya panas`.",
          "Lỗi người Việt: thêm từ bị động như 'bị' vào tiếng Indonesia. Chỉ cần `anak saya demam`.",
        ],
        pronunciation_focus_en: [
          "A-nak SA-ya de-MAM se-JAK TA-dee MA-lam - `anak saya` = my child; `demam` = fever; `sejak tadi malam` = since last night.",
          "`demam` is clearer than `panas` in medical contexts, though Indonesians may casually say `badannya panas`.",
          "VN-speaker trap: adding a passive word like Vietnamese 'bị'. Just say `anak saya demam`.",
        ],
      },
      {
        en: "Suhu tubuhnya tiga puluh delapan koma lima derajat.",
        vi: "Nhiệt độ cơ thể của bé là ba mươi tám phẩy năm độ.",
        pronunciation_focus: [
          "SU-hu TU-buh-nya TI-ga PU-luh de-LA-pan KO-ma LI-ma de-RA-jat - `suhu tubuh` = nhiệt độ cơ thể; `koma` = dấu phẩy thập phân.",
          "Trong tiếng Indonesia, 38,5 đọc là `tiga puluh delapan koma lima`.",
          "Lỗi người Việt: đọc số thập phân theo tiếng Việt mà quên `koma`. Khi báo sốt, nói rõ `koma`.",
        ],
        pronunciation_focus_en: [
          "SOO-hoo TOO-booh-nya TEE-ga POO-looh de-LA-pan KO-ma LEE-ma de-RA-jat - `suhu tubuh` = body temperature; `koma` = decimal comma.",
          "In Indonesian, 38.5 is read `tiga puluh delapan koma lima`.",
          "VN-speaker trap: reading decimals Vietnamese-style and forgetting `koma`. When reporting fever, say `koma` clearly.",
        ],
      },
      {
        en: "Saya mau periksa ke dokter anak.",
        vi: "Tôi muốn đưa con đi khám bác sĩ nhi.",
        pronunciation_focus: [
          "SA-ya MAU pe-RIK-sa ke DOK-ter A-nak - `dokter anak` = bác sĩ nhi; `periksa ke` = đi khám ở/đến bác sĩ.",
          "`ke dokter anak` dùng `ke` vì có ý đi đến nơi/bác sĩ.",
          "Lỗi người Việt: nói `dokter bayi` hoặc `dokter kecil`. Chuyên khoa là `dokter anak`.",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU pe-RIK-sa ke DOK-ter A-nak - `dokter anak` = pediatrician; `periksa ke` = go see a doctor.",
          "`ke dokter anak` uses `ke` because there is movement toward the doctor/place.",
          "VN-speaker trap: saying `dokter bayi` or `dokter kecil`. The specialty is `dokter anak`.",
        ],
      },
      {
        en: "Anak saya batuk pilek dan susah tidur.",
        vi: "Con tôi ho, sổ mũi và khó ngủ.",
        pronunciation_focus: [
          "A-nak SA-ya BA-tuk PI-lek dan SU-sah TI-dur - `batuk pilek` = ho và sổ mũi/cảm; `susah tidur` = khó ngủ.",
          "`batuk pilek` là cụm rất tự nhiên khi trẻ cảm lạnh.",
          "Lỗi người Việt: tách dài thành `batuk dan hidung keluar air` khi chỉ cần cụm gọn `batuk pilek`.",
        ],
        pronunciation_focus_en: [
          "A-nak SA-ya BA-tuk PEE-lek dan SOO-sah TEE-door - `batuk pilek` = cough and runny nose/cold; `susah tidur` = trouble sleeping.",
          "`batuk pilek` is a very natural phrase for a child with a cold.",
          "VN-speaker trap: making a long phrase like `batuk dan hidung keluar air` when the compact `batuk pilek` fits.",
        ],
      },
      {
        en: "Apakah obat sirup ini aman untuk anak dua tahun?",
        vi: "Thuốc siro này có an toàn cho trẻ hai tuổi không?",
        pronunciation_focus: [
          "a-pa-KAH O-bat SI-rup I-ni A-man UN-tuk A-nak DU-a TA-hun - `obat sirup` = thuốc dạng siro; `aman untuk` = an toàn cho.",
          "`dua tahun` = hai tuổi trong ngữ cảnh trẻ em, không cần thêm từ `umur` nếu câu đã rõ.",
          "Lỗi người Việt: nói `sirup obat` theo trật tự Việt. Tự nhiên là `obat sirup`.",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH O-bat SEE-rup EE-nee A-man UN-tuk A-nak DOO-a TA-hoon - `obat sirup` = syrup medicine; `aman untuk` = safe for.",
          "`dua tahun` = two years old in a child context; no need to add `umur` if the sentence is clear.",
          "VN-speaker trap: saying `sirup obat` with Vietnamese order. Natural Indonesian is `obat sirup`.",
        ],
      },
      {
        en: "Berapa dosis obatnya untuk berat badan anak saya?",
        vi: "Liều thuốc là bao nhiêu theo cân nặng của con tôi?",
        pronunciation_focus: [
          "be-RA-pa DO-sis O-bat-nya UN-tuk BE-rat BA-dan A-nak SA-ya - `dosis` = liều; `berat badan` = cân nặng.",
          "`obatnya` = thuốc đó; hậu tố `-nya` giúp nối với thuốc vừa được nhắc.",
          "Lỗi người Việt: hỏi `berapa kali obat` cho liều. Hỏi chính xác: `berapa dosis obatnya?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa DO-sis O-bat-nya UN-tuk BE-rat BA-dan A-nak SA-ya - `dosis` = dose; `berat badan` = body weight.",
          "`obatnya` = that medicine; `-nya` links back to the medicine just mentioned.",
          "VN-speaker trap: asking `berapa kali obat` for dosage. Ask precisely: `berapa dosis obatnya?`",
        ],
      },
      {
        en: "Saya sudah kompres anak dengan air hangat.",
        vi: "Tôi đã chườm/lau mát cho con bằng nước ấm.",
        pronunciation_focus: [
          "SA-ya SU-dah KOM-pres A-nak de-NGAN A-ir HA-ngat - `kompres` = chườm/lau hạ sốt; `air hangat` = nước ấm.",
          "Trong chăm sóc trẻ, `kompres air hangat` là cụm quen thuộc.",
          "Lỗi người Việt: dịch 'chườm lạnh' trực tiếp thành `kompres dingin` trong mọi trường hợp. Khi hỏi/khai với bác sĩ, nói đúng việc đã làm.",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah KOM-pres A-nak de-NGAN A-ir HA-ngat - `kompres` = compress/sponge; `air hangat` = warm water.",
          "In child care, `kompres air hangat` is a common phrase.",
          "VN-speaker trap: translating 'cold compress' as `kompres dingin` for every case. When talking to a doctor, state exactly what you did.",
        ],
      },
      {
        en: "Kami perlu surat izin sekolah untuk hari ini.",
        vi: "Chúng tôi cần giấy xin phép nghỉ học cho hôm nay.",
        pronunciation_focus: [
          "KA-mi PER-lu SU-rat I-zin se-KO-lah UN-tuk HA-ri I-ni - `surat izin sekolah` = giấy xin phép nghỉ học/giấy xác nhận cho trường.",
          "`izin` trong câu này là phép vắng mặt, không phải giấy phép kinh doanh.",
          "Lỗi người Việt: dịch 'nghỉ học' thành `libur sekolah`. `Libur` là kỳ nghỉ/ngày nghỉ; xin nghỉ vì bệnh dùng `izin sekolah` hoặc `izin sakit`.",
        ],
        pronunciation_focus_en: [
          "KA-mi PER-loo SOO-rat EE-zin se-KO-lah UN-tuk HA-ree EE-nee - `surat izin sekolah` = school absence note/permission letter.",
          "`izin` here means permission to be absent, not a business permit.",
          "VN-speaker trap: translating 'take a school sick day' as `libur sekolah`. `Libur` means holiday/day off; illness absence uses `izin sekolah` or `izin sakit`.",
        ],
      },
      {
        en: "Kalau demamnya tidak turun, kapan harus kontrol ulang?",
        vi: "Nếu sốt không hạ, khi nào phải tái khám?",
        pronunciation_focus: [
          "KA-lau de-MAM-nya TI-dak TU-run, KA-pan HA-rus KON-trol U-lang - `demamnya turun` = sốt hạ; `kontrol ulang` = tái khám.",
          "`turun` ở đây là giảm/hạ nhiệt, không phải đi xuống cầu thang.",
          "Lỗi người Việt: nói `demam kurang` theo tiếng Việt. Tự nhiên là `demam turun`.",
        ],
        pronunciation_focus_en: [
          "KA-lau de-MAM-nya TEE-dak TOO-roon, KA-pan HA-rus KON-trol OO-lang - `demamnya turun` = the fever goes down; `kontrol ulang` = follow-up visit.",
          "`turun` here means decrease/go down in temperature, not go downstairs.",
          "VN-speaker trap: saying `demam kurang` from Vietnamese. Natural Indonesian is `demam turun`.",
        ],
      },
      {
        en: "Tolong tuliskan aturan minum obatnya dengan jelas.",
        vi: "Làm ơn viết rõ cách uống thuốc.",
        pronunciation_focus: [
          "TO-long TU-lis-kan a-TU-ran MI-num O-bat-nya de-NGAN JE-las - `aturan minum obat` = hướng dẫn/cách uống thuốc; `dengan jelas` = rõ ràng.",
          "`minum obat` = uống thuốc; tiếng Indonesia dùng `minum` cho thuốc, không phải `makan obat` trong ngữ cảnh chuẩn.",
          "Lỗi người Việt: hỏi `cara makan obat`. Với thuốc nước/siro/viên trong chuẩn y tế, dùng `minum obat`.",
        ],
        pronunciation_focus_en: [
          "TO-long TOO-lis-kan a-TOO-ran MEE-noom O-bat-nya de-NGAN JE-las - `aturan minum obat` = medicine-taking instructions; `dengan jelas` = clearly.",
          "`minum obat` = take medicine; Indonesian uses `minum` for medicine in standard contexts, not `makan obat`.",
          "VN-speaker trap: asking `cara makan obat`. For liquid/syrup/tablets in standard medical talk, use `minum obat`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, khi trẻ sốt hoặc `batuk pilek`, phụ huynh có thể đến `dokter anak`, phòng khám, Puskesmas, hoặc bệnh viện tùy mức độ. Khi đi khám, nên nói rõ `suhu tubuh`, thời gian sốt, triệu chứng kèm theo, thuốc đã dùng, dị ứng thuốc, và cân nặng của trẻ vì liều thuốc trẻ em thường liên quan đến cân nặng/tuổi. Trường học có thể cần `surat izin sakit` hoặc `surat izin sekolah` nếu trẻ nghỉ học.",
    cultural_notes_en:
      "In Indonesia, when a child has fever or `batuk pilek`, parents may go to a `dokter anak`, clinic, Puskesmas, or hospital depending on severity. At the visit, it helps to state the `suhu tubuh`, duration of fever, accompanying symptoms, medicine already taken, drug allergies, and the child's weight because pediatric dosage often depends on weight/age. Schools may need a `surat izin sakit` or `surat izin sekolah` if the child is absent.",
    tip_advice_vi:
      "Mẹo cho người Việt: dùng `demam turun` để nói sốt hạ, `kontrol ulang` để nói tái khám, `obat sirup` cho thuốc siro, và `aturan minum obat` cho hướng dẫn uống thuốc. Tránh dùng `libur sekolah` khi con nghỉ vì bệnh; nói `izin sakit` hoặc `surat izin sekolah`. Nếu có số đo nhiệt độ, nói rõ `tiga puluh delapan koma lima derajat`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: use `demam turun` for fever going down, `kontrol ulang` for follow-up visit, `obat sirup` for syrup medicine, and `aturan minum obat` for dosing instructions. Avoid `libur sekolah` when a child is absent because of illness; say `izin sakit` or `surat izin sekolah`. If you have a temperature reading, state it clearly: `tiga puluh delapan koma lima derajat`.",
    vocabulary: [
      { word: "anak demam", en: "child with a fever", vi: "trẻ bị sốt", pos: "noun phrase", pronunciation_vi: "A-nak de-MAM", pronunciation_en: "A-nak de-MAM" },
      { word: "dokter anak", en: "pediatrician", vi: "bác sĩ nhi", pos: "noun phrase", pronunciation_vi: "DOK-ter A-nak", pronunciation_en: "DOK-ter A-nak" },
      { word: "batuk pilek", en: "cough and runny nose / cold", vi: "ho và sổ mũi/cảm", pos: "noun phrase", pronunciation_vi: "BA-tuk PI-lek", pronunciation_en: "BA-tuk PEE-lek" },
      { word: "obat sirup", en: "syrup medicine", vi: "thuốc siro", pos: "noun phrase", pronunciation_vi: "O-bat SI-rup", pronunciation_en: "O-bat SEE-rup" },
      { word: "izin sekolah", en: "permission to miss school", vi: "xin phép nghỉ học", pos: "noun phrase", pronunciation_vi: "I-zin se-KO-lah", pronunciation_en: "EE-zin se-KO-lah" },
      { word: "kompres", en: "compress / sponge down", vi: "chườm/lau hạ sốt", pos: "verb/noun", pronunciation_vi: "KOM-pres", pronunciation_en: "KOM-pres" },
      { word: "suhu tubuh", en: "body temperature", vi: "nhiệt độ cơ thể", pos: "noun phrase", pronunciation_vi: "SU-hu TU-buh", pronunciation_en: "SOO-hoo TOO-booh" },
      { word: "kontrol ulang", en: "follow-up visit", vi: "tái khám", pos: "noun phrase", pronunciation_vi: "KON-trol U-lang", pronunciation_en: "KON-trol OO-lang" },
      { word: "demam turun", en: "fever goes down", vi: "sốt hạ", pos: "clause", pronunciation_vi: "de-MAM TU-run", pronunciation_en: "de-MAM TOO-roon" },
      { word: "aturan minum obat", en: "medicine-taking instructions", vi: "hướng dẫn uống thuốc", pos: "noun phrase", pronunciation_vi: "a-TU-ran MI-num O-bat", pronunciation_en: "a-TOO-ran MEE-noom O-bat" },
    ],
    dialogue: [
      {
        speaker: "Orang tua",
        text: "Dok, anak saya demam sejak tadi malam.",
        vi: "Bác sĩ ơi, con tôi bị sốt từ tối qua.",
        en: "Doctor, my child has had a fever since last night.",
      },
      {
        speaker: "Dokter",
        text: "Suhu tubuhnya berapa?",
        vi: "Nhiệt độ cơ thể của bé là bao nhiêu?",
        en: "What is the child's body temperature?",
      },
      {
        speaker: "Orang tua",
        text: "Tadi pagi tiga puluh delapan koma lima derajat. Dia juga batuk pilek.",
        vi: "Sáng nay ba mươi tám phẩy năm độ. Bé cũng ho và sổ mũi.",
        en: "This morning it was 38.5 degrees. The child also has a cough and runny nose.",
      },
      {
        speaker: "Dokter",
        text: "Saya beri obat sirup. Tolong ikuti aturan minum obatnya.",
        vi: "Tôi cho thuốc siro. Làm ơn làm theo hướng dẫn uống thuốc.",
        en: "I will give syrup medicine. Please follow the dosing instructions.",
      },
      {
        speaker: "Orang tua",
        text: "Kalau demamnya tidak turun, kapan harus kontrol ulang?",
        vi: "Nếu sốt không hạ, khi nào phải tái khám?",
        en: "If the fever does not go down, when should we come for a follow-up?",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "dokter anak", answer: "bác sĩ nhi" },
          { prompt: "batuk pilek", answer: "ho và sổ mũi/cảm" },
          { prompt: "suhu tubuh", answer: "nhiệt độ cơ thể" },
          { prompt: "kontrol ulang", answer: "tái khám" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Con tôi bị sốt từ tối qua.", answer: "Anak saya demam sejak tadi malam." },
          { prompt: "Thuốc siro này có an toàn cho trẻ hai tuổi không?", answer: "Apakah obat sirup ini aman untuk anak dua tahun?" },
          { prompt: "Nếu sốt không hạ, khi nào phải tái khám?", answer: "Kalau demamnya tidak turun, kapan harus kontrol ulang?" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu.",
        instruction_en: "Fill in the missing word.",
        items: [
          { prompt: "Anak saya ___ sejak tadi malam.", answer: "demam" },
          { prompt: "Suhu tubuhnya tiga puluh delapan ___ lima derajat.", answer: "koma" },
          { prompt: "Kami perlu surat ___ sekolah untuk hari ini.", answer: "izin" },
        ],
      },
    ],
  },
];
