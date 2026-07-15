// Pharmacy & Medicine Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson following the established Indonesian lesson shape.
// Field convention: sentence `en` is the TARGET-LANGUAGE text (Indonesian), and
// `vi` is the Vietnamese gloss. `pronunciation_focus` gives Vietnamese L1 notes;
// `pronunciation_focus_en` is the English companion in the same order.

export type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

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
    id: "indonesian_pharmacy_medicine",
    level: "A2",
    category: "health",
    title_vi: "Ở hiệu thuốc: thuốc, liều dùng và dị ứng",
    title_en: "At the pharmacy: medicine, dosage and allergies",
    sentences: [
      {
        en: "Di mana apotek terdekat?",
        vi: "Hiệu thuốc gần nhất ở đâu?",
        pronunciation_focus: [
          "di MA-na a-PO-tek ter-DE-kat - `apotek` = hiệu thuốc; `terdekat` = gần nhất.",
          "Lỗi người Việt: nói `apotik` hoặc nhầm với bác sĩ. Chuẩn phổ biến trên biển hiệu là `apotek`.",
          "Luyện: `Di mana apotek terdekat?`",
        ],
        pronunciation_focus_en: [
          "di MA-na a-PO-tek ter-DE-kat - `apotek` = pharmacy; `terdekat` = nearest.",
          "VN-speaker trap: saying `apotik` or confusing it with a doctor. The common sign spelling is `apotek`.",
          "Drill: `Di mana apotek terdekat?`",
        ],
      },
      {
        en: "Saya mau beli obat bebas untuk demam.",
        vi: "Tôi muốn mua thuốc không cần đơn cho sốt.",
        pronunciation_focus: [
          "SA-ya MAU be-LI O-bat BE-bas un-TUK de-MAM - `obat bebas` = thuốc bán tự do/không cần đơn; `demam` = sốt.",
          "Lỗi người Việt: dịch `thuốc tự do` thành `obat sendiri`. Cụm đúng ở hiệu thuốc là `obat bebas`.",
          "Luyện: `Saya mau beli obat bebas untuk demam.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU be-LI O-bat BE-bas un-TUK de-MAM - `obat bebas` = over-the-counter medicine; `demam` = fever.",
          "VN-speaker trap: translating 'free medicine' as `obat sendiri`. The pharmacy term is `obat bebas`.",
          "Drill: `Saya mau beli obat bebas untuk demam.`",
        ],
      },
      {
        en: "Apakah obat ini perlu resep dokter?",
        vi: "Thuốc này có cần đơn bác sĩ không?",
        pronunciation_focus: [
          "a-pa-KAH O-bat I-ni per-LU RE-sep DOK-ter - `resep dokter` = đơn thuốc của bác sĩ; `perlu` = cần.",
          "Lỗi người Việt: nhầm `resep` với công thức nấu ăn. Trong hiệu thuốc, `resep dokter` là đơn thuốc.",
          "Luyện: `Apakah obat ini perlu resep dokter?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH O-bat I-ni per-LU RE-sep DOK-ter - `resep dokter` = doctor's prescription; `perlu` = need.",
          "VN-speaker trap: confusing `resep` with a cooking recipe. In a pharmacy, `resep dokter` is a prescription.",
          "Drill: `Apakah obat ini perlu resep dokter?`",
        ],
      },
      {
        en: "Berapa dosis untuk orang dewasa?",
        vi: "Liều dùng cho người lớn là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa DO-sis un-TUK O-rang de-WA-sa - `dosis` = liều; `orang dewasa` = người lớn.",
          "Lỗi người Việt: nói `berapa kali obat`. Hỏi liều dùng bằng `berapa dosis` hoặc `dosisnya berapa`.",
          "Luyện: `Berapa dosis untuk orang dewasa?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa DO-sis un-TUK O-rang de-WA-sa - `dosis` = dose; `orang dewasa` = adult.",
          "VN-speaker trap: saying `berapa kali obat`. Ask dosage with `berapa dosis` or `dosisnya berapa`.",
          "Drill: `Berapa dosis untuk orang dewasa?`",
        ],
      },
      {
        en: "Minum satu tablet tiga kali sehari setelah makan.",
        vi: "Uống một viên, ngày ba lần sau khi ăn.",
        pronunciation_focus: [
          "MI-num SA-tu TAB-let TI-ga KA-li se-HA-ri se-TE-lah MA-kan - `sehari` = một ngày; `setelah makan` = sau khi ăn.",
          "Lỗi người Việt: đặt `makan setelah`. Tiếng Indonesia dùng `setelah + động từ/danh từ`: `setelah makan`.",
          "Luyện: `Minum satu tablet tiga kali sehari setelah makan.`",
        ],
        pronunciation_focus_en: [
          "MI-num SA-tu TAB-let TI-ga KA-li se-HA-ri se-TE-lah MA-kan - `sehari` = per day; `setelah makan` = after eating.",
          "VN-speaker trap: reversing it as `makan setelah`. Indonesian uses `setelah + verb/noun`: `setelah makan`.",
          "Drill: `Minum satu tablet tiga kali sehari setelah makan.`",
        ],
      },
      {
        en: "Apa efek samping obat ini?",
        vi: "Tác dụng phụ của thuốc này là gì?",
        pronunciation_focus: [
          "A-pa E-fek SAM-ping O-bat I-ni - `efek samping` = tác dụng phụ; `obat ini` = thuốc này.",
          "Lỗi người Việt: dịch từng chữ `tác dụng phụ` thành cụm lạ. Cứ dùng `efek samping`.",
          "Luyện: `Apa efek samping obat ini?`",
        ],
        pronunciation_focus_en: [
          "A-pa E-fek SAM-ping O-bat I-ni - `efek samping` = side effect; `obat ini` = this medicine.",
          "VN-speaker trap: translating 'side effect' word by word into an odd phrase. Use `efek samping`.",
          "Drill: `Apa efek samping obat ini?`",
        ],
      },
      {
        en: "Saya punya alergi terhadap antibiotik.",
        vi: "Tôi bị dị ứng với kháng sinh.",
        pronunciation_focus: [
          "SA-ya PU-nya a-LER-gi ter-HA-dap an-ti-bi-O-tik - `alergi terhadap` = dị ứng với; `antibiotik` = kháng sinh.",
          "Lỗi người Việt: nói `alergi dengan`. Người bán vẫn hiểu, nhưng cụm chuẩn hơn là `alergi terhadap`.",
          "Luyện: `Saya punya alergi terhadap antibiotik.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PU-nya a-LER-gi ter-HA-dap an-ti-bi-O-tik - `alergi terhadap` = allergic to; `antibiotik` = antibiotic.",
          "VN-speaker trap: saying `alergi dengan`. It is understood, but `alergi terhadap` is more standard.",
          "Drill: `Saya punya alergi terhadap antibiotik.`",
        ],
      },
      {
        en: "Anak saya batuk dan hidungnya tersumbat.",
        vi: "Con tôi ho và bị nghẹt mũi.",
        pronunciation_focus: [
          "A-nak SA-ya BA-tuk dan HI-dung-nya ter-SUM-bat - `batuk` = ho; `hidungnya tersumbat` = mũi bị nghẹt.",
          "Lỗi người Việt: bỏ `-nya` trong `hidungnya`. Với bộ phận cơ thể, `-nya` giúp nối với người vừa nói.",
          "Luyện: `Anak saya batuk dan hidungnya tersumbat.`",
        ],
        pronunciation_focus_en: [
          "A-nak SA-ya BA-tuk dan HI-dung-nya ter-SUM-bat - `batuk` = cough; `hidungnya tersumbat` = their nose is blocked.",
          "VN-speaker trap: dropping `-nya` in `hidungnya`. With body parts, `-nya` links back to the person mentioned.",
          "Drill: `Anak saya batuk dan hidungnya tersumbat.`",
        ],
      },
      {
        en: "Saya masuk angin sejak tadi malam.",
        vi: "Tôi bị cảm/trúng gió từ tối qua.",
        pronunciation_focus: [
          "SA-ya MA-suk A-ngin se-JAK TA-di MA-lam - `masuk angin` = cảm/trúng gió/khó chịu kiểu Indonesia.",
          "Lỗi người Việt: dịch là `gió vào` từng chữ. Đây là cụm cố định: `masuk angin`.",
          "Luyện: `Saya masuk angin sejak tadi malam.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MA-suk A-ngin se-JAK TA-di MA-lam - `masuk angin` = Indonesian-style cold/wind sickness/malaise.",
          "VN-speaker trap: translating it literally as 'wind enters'. It is a fixed phrase: `masuk angin`.",
          "Drill: `Saya masuk angin sejak tadi malam.`",
        ],
      },
      {
        en: "Kalau gejalanya tidak membaik, sebaiknya periksa ke dokter.",
        vi: "Nếu triệu chứng không đỡ, tốt nhất nên đi khám bác sĩ.",
        pronunciation_focus: [
          "KA-lau ge-JA-la-nya TI-dak mem-BA-ik, se-BA-ik-nya pe-RIK-sa ke DOK-ter - `gejala` = triệu chứng; `membaik` = đỡ hơn.",
          "Lỗi người Việt: dùng `di dokter` khi nói đi khám. Chuyển động đến bác sĩ dùng `ke dokter`.",
          "Luyện: `Kalau gejalanya tidak membaik, sebaiknya periksa ke dokter.`",
        ],
        pronunciation_focus_en: [
          "KA-lau ge-JA-la-nya TI-dak mem-BA-ik, se-BA-ik-nya pe-RIK-sa ke DOK-ter - `gejala` = symptom; `membaik` = improve.",
          "VN-speaker trap: using `di dokter` for going to a doctor. Movement toward the doctor uses `ke dokter`.",
          "Drill: `Kalau gejalanya tidak membaik, sebaiknya periksa ke dokter.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, `apotek` bán cả `obat bebas` (không cần đơn) và thuốc cần `resep dokter`. Dược sĩ hoặc nhân viên thường hỏi triệu chứng, tuổi người dùng, dị ứng và đã uống thuốc gì chưa. `Masuk angin` là cách nói rất phổ biến cho cảm giác lạnh, đầy bụng, mệt, đau người hoặc khó chịu sau khi dầm mưa/gió; nghĩa không trùng hoàn toàn với một chẩn đoán y khoa. Nếu sốt cao, khó thở, dị ứng nặng, đau dữ dội, hoặc triệu chứng không đỡ, nên đi khám bác sĩ hoặc bệnh viện.",
    cultural_notes_en:
      "In Indonesia, an `apotek` sells both `obat bebas` (over-the-counter medicine) and medicines requiring a `resep dokter`. Pharmacists or staff often ask about symptoms, the patient's age, allergies, and what medicine has already been taken. `Masuk angin` is a very common phrase for feeling chilled, bloated, achy, tired, or unwell after rain/wind exposure; it does not map exactly to one medical diagnosis. For high fever, breathing trouble, severe allergy, intense pain, or symptoms that do not improve, see a doctor or hospital.",
    tip_advice_vi:
      "Mẹo cho người Việt: `obat` = thuốc, `resep` = đơn thuốc, `dosis` = liều, `efek samping` = tác dụng phụ. Khi nói triệu chứng, không cần từ `bị`: `Saya demam`, `Saya batuk`, `Saya masuk angin`. Với bộ phận cơ thể, dùng mẫu `hidung saya` hoặc `hidungnya`; với hướng đi khám dùng `ke dokter`, không dùng `di dokter`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: `obat` = medicine, `resep` = prescription, `dosis` = dose, `efek samping` = side effect. For symptoms, no passive word is needed: `Saya demam`, `Saya batuk`, `Saya masuk angin`. With body parts, use `hidung saya` or `hidungnya`; for going to a doctor use `ke dokter`, not `di dokter`.",
    vocabulary: [
      {
        cell_id: "0c1cab7c-8111-4d0d-8e10-b88161081094",
        word: "apotek",
        en: "pharmacy",
        vi: "hiệu thuốc",
        pos: "noun",
        pronunciation_vi: "a-PO-tek",
        pronunciation_en: "ah-PO-tek",
      },
      {
        cell_id: "ce4d7102-c3cc-41c8-a7f0-43719b8dbfc5",
        word: "obat bebas",
        en: "over-the-counter medicine",
        vi: "thuốc không cần đơn",
        pos: "noun phrase",
        pronunciation_vi: "O-bat BE-bas",
        pronunciation_en: "OH-bat BEH-bas",
      },
      {
        cell_id: "c0830a22-d637-4721-8a88-f6742d506749",
        word: "resep dokter",
        en: "doctor's prescription",
        vi: "đơn thuốc bác sĩ",
        pos: "noun phrase",
        pronunciation_vi: "RE-sep DOK-ter",
        pronunciation_en: "REH-sep DOK-ter",
      },
      {
        cell_id: "8e003acf-02a2-4bd1-8d4a-261fc3720332",
        word: "dosis",
        en: "dose / dosage",
        vi: "liều dùng",
        pos: "noun",
        pronunciation_vi: "DO-sis",
        pronunciation_en: "DOH-sis",
      },
      {
        cell_id: "807253c0-07ea-42ad-aa4b-1f7b51d9dd1c",
        word: "efek samping",
        en: "side effect",
        vi: "tác dụng phụ",
        pos: "noun phrase",
        pronunciation_vi: "E-fek SAM-ping",
        pronunciation_en: "EH-fek SAM-ping",
      },
      {
        cell_id: "57462294-98ec-4011-a1d1-fc442f7a57fe",
        word: "alergi",
        en: "allergy",
        vi: "dị ứng",
        pos: "noun",
        pronunciation_vi: "a-LER-gi",
        pronunciation_en: "ah-LER-gee",
      },
      {
        cell_id: "269df113-69df-45e5-9cb4-59c8c2d5a43f",
        word: "demam",
        en: "fever",
        vi: "sốt",
        pos: "noun/verb",
        pronunciation_vi: "de-MAM",
        pronunciation_en: "de-MAM",
      },
      {
        cell_id: "585d0f75-3280-4839-b4f9-d70e0e4f812f",
        word: "batuk",
        en: "cough",
        vi: "ho",
        pos: "noun/verb",
        pronunciation_vi: "BA-tuk",
        pronunciation_en: "BAH-took",
      },
      {
        cell_id: "376734e2-22a8-4ff2-bdab-01a90ac34abe",
        word: "masuk angin",
        en: "wind sickness / feeling chilled and unwell",
        vi: "trúng gió / cảm lạnh kiểu Indonesia",
        pos: "phrase",
        pronunciation_vi: "MA-suk A-ngin",
        pronunciation_en: "MAH-sook AH-ngin",
      },
      {
        cell_id: "0ff5609d-fd70-4e84-9794-ebfa93b70494",
        word: "gejala",
        en: "symptom",
        vi: "triệu chứng",
        pos: "noun",
        pronunciation_vi: "ge-JA-la",
        pronunciation_en: "geh-JAH-la",
      },
    ],
    dialogue: [
      {
        cell_id: "b71598ea-6af0-4054-965c-ce53e5b61870",
        speaker: "Pelanggan",
        text: "Permisi, saya mau cari obat bebas untuk demam dan batuk.",
        vi: "Xin phép, tôi muốn tìm thuốc không cần đơn cho sốt và ho.",
        en: "Excuse me, I want to look for over-the-counter medicine for fever and cough.",
      },
      {
        cell_id: "b258feb8-4af9-4cfc-83d4-3d57ec508407",
        speaker: "Apoteker",
        text: "Untuk orang dewasa atau anak-anak?",
        vi: "Cho người lớn hay trẻ em?",
        en: "For an adult or a child?",
      },
      {
        cell_id: "a934d4ae-29d0-4912-a01f-0174767b49e7",
        speaker: "Pelanggan",
        text: "Untuk saya. Saya tidak punya alergi obat.",
        vi: "Cho tôi. Tôi không bị dị ứng thuốc.",
        en: "For me. I do not have a medicine allergy.",
      },
      {
        cell_id: "e02a1243-16d8-4c9e-a4f2-86abdaba72ff",
        speaker: "Apoteker",
        text: "Minum satu tablet tiga kali sehari setelah makan.",
        vi: "Uống một viên, ngày ba lần sau khi ăn.",
        en: "Take one tablet three times a day after eating.",
      },
      {
        cell_id: "1db46fe1-908c-422c-8c18-13f05aae0285",
        speaker: "Pelanggan",
        text: "Baik. Apa efek sampingnya?",
        vi: "Được. Tác dụng phụ là gì?",
        en: "Okay. What are the side effects?",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Apakah obat ini perlu ____ dokter?`",
        prompt_en: "Fill in the blank: `Apakah obat ini perlu ____ dokter?`",
        answer: "resep",
        explanation_vi: "`resep dokter` = đơn thuốc của bác sĩ.",
        explanation_en: "`resep dokter` = doctor's prescription.",
      },
      {
        type: "multiple_choice",
        prompt_vi: "`Obat bebas` nghĩa là gì?",
        prompt_en: "What does `obat bebas` mean?",
        choices: ["thuốc không cần đơn", "thuốc miễn phí", "thuốc cho thú cưng"],
        answer: "thuốc không cần đơn",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: `Tôi bị dị ứng với kháng sinh.`",
        prompt_en: "Translate into Indonesian: `I am allergic to antibiotics.`",
        answer: "Saya punya alergi terhadap antibiotik.",
      },
      {
        type: "word_order",
        prompt_vi: "Sắp xếp thành câu: `sehari / satu tablet / tiga kali / setelah makan / minum`",
        prompt_en: "Arrange into a sentence: `sehari / satu tablet / tiga kali / setelah makan / minum`",
        answer: "Minum satu tablet tiga kali sehari setelah makan.",
      },
    ],
  },
];
