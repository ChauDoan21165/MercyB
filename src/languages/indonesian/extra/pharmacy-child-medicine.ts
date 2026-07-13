// Pharmacy Child Medicine Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It follows the established Indonesian extra
// lesson format: Indonesian target text lives in `en`, Vietnamese glosses live in
// `vi`, and each Vietnamese-facing learning note has an English companion.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus -- same length + order. */
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  cell_id?: string;
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
  cell_id?: string;
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
    id: "indonesian_pharmacy_child_medicine",
    level: "B1",
    category: "health",
    title_vi: "Thuốc cho trẻ em ở hiệu thuốc",
    title_en: "Child medicine at the pharmacy",
    sentences: [
      {
        en: "Saya mencari obat anak untuk demam dan batuk.",
        vi: "Tôi đang tìm thuốc cho trẻ em trị sốt và ho.",
        pronunciation_focus: [
          "SA-ya men-CA-ri O-bat A-nak UN-tuk de-MAM dan BA-tuk -- `obat anak` = thuốc cho trẻ em; `demam` = sốt.",
          "Lỗi người Việt: nói `obat anak-anak` không sai hoàn toàn, nhưng `obat anak` ngắn và tự nhiên hơn ở apotek.",
          "Luyện: `Saya mencari obat anak.`",
        ],
        pronunciation_focus_en: [
          "SA-ya men-CHA-ri O-bat A-nak OON-tuk de-MAM dan BA-tuk -- `obat anak` = children's medicine; `demam` = fever.",
          "VN-speaker trap: `obat anak-anak` is not wrong, but `obat anak` is shorter and more natural at the pharmacy.",
          "Drill: `Saya mencari obat anak.`",
        ],
      },
      {
        en: "Obat sirup ini dosis anaknya berapa?",
        vi: "Si-rô này liều cho trẻ em là bao nhiêu?",
        pronunciation_focus: [
          "O-bat SI-rup I-ni DO-sis A-nak-nya be-RA-pa -- `sirup` = si-rô/thuốc dạng lỏng; `dosis` = liều dùng.",
          "Mẹo: untuk anak, tanya `dosis anaknya berapa?` supaya jelas, jangan cuma `berapa?`",
          "Luyện: `Dosis anaknya berapa?`",
        ],
        pronunciation_focus_en: [
          "O-bat SEE-roop EE-ni DO-sis A-nak-nya be-RA-pa -- `sirup` = syrup/liquid medicine; `dosis` = dose.",
          "Tip: for children, ask `dosis anaknya berapa?` to be clear, not only `berapa?`",
          "Drill: `Dosis anaknya berapa?`",
        ],
      },
      {
        en: "Ada sendok takarnya di dalam kotak?",
        vi: "Có muỗng đong bên trong hộp không?",
        pronunciation_focus: [
          "A-da sen-DOK TA-kar-nya di da-LAM KO-tak -- `sendok takar` = muỗng đong; `di dalam kotak` = bên trong hộp.",
          "Lỗi người Việt: dùng `sendok biasa` mọi lúc. Với obat anak, `sendok takar` penting untuk dosis tepat.",
          "Luyện: `Ada sendok takarnya?`",
        ],
        pronunciation_focus_en: [
          "A-da sen-DOK TA-kar-nya di da-LAM KO-tak -- `sendok takar` = measuring spoon; `di dalam kotak` = inside the box.",
          "VN-speaker trap: using `sendok biasa` all the time. With child medicine, `sendok takar` is important for correct dosing.",
          "Drill: `Ada sendok takarnya?`",
        ],
      },
      {
        en: "Anak saya demam, tapi tidak alergi obat ya?",
        vi: "Con tôi bị sốt, nhưng không bị dị ứng thuốc chứ?",
        pronunciation_focus: [
          "A-nak SA-ya de-MAM, TA-pi TI-dak a-LER-gi O-bat ya -- `alergi obat` = dị ứng thuốc.",
          "`ya` di akhir membuat pertanyaan terdengar lembut dan mengecek ulang, bukan menuduh.",
          "Luyện: `Tidak alergi obat, ya?`",
        ],
        pronunciation_focus_en: [
          "A-nak SA-ya de-MAM, TA-pi TEE-dak a-LER-gee O-bat ya -- `alergi obat` = medicine allergy.",
          "`Ya` at the end softens the question and checks again politely, not accusing anyone.",
          "Drill: `Tidak alergi obat, ya?`",
        ],
      },
      {
        en: "Apakah ada obat yang aman untuk usia tiga tahun?",
        vi: "Có thuốc nào an toàn cho bé ba tuổi không?",
        pronunciation_focus: [
          "A-pa-kah A-da O-bat yang A-man UN-tuk U-si-a TI-ga TA-hun -- `aman` = an toàn; `usia tiga tahun` = tuổi ba.",
          "Mẹo: `aman untuk usia...` là công thức rất hữu ích khi mua thuốc cho trẻ.",
          "Luyện: `Obat yang aman untuk usia tiga tahun?`",
        ],
        pronunciation_focus_en: [
          "A-pa-kah A-da O-bat yang A-man OON-tuk OO-si-a TEE-ga TA-hoon -- `aman` = safe; `usia tiga tahun` = age three.",
          "Tip: `aman untuk usia...` is a very useful pattern when buying medicine for children.",
          "Drill: `Obat yang aman untuk usia tiga tahun?`",
        ],
      },
      {
        en: "Kalau demamnya tinggi, saya harus ke dokter dulu?",
        vi: "Nếu sốt cao, tôi có phải đi bác sĩ trước không?",
        pronunciation_focus: [
          "KA-lau de-MAM-nya TING-gi, SA-ya HA-rus ke DOK-ter DU-lu -- `demamnya tinggi` = sốt cao; `ke dokter` = đến bác sĩ.",
          "Lỗi người Việt: hỏi `pergi rumah sakit dulu?` khi vấn đề còn nhẹ. `Ke dokter dulu` tự nhiên và cụ thể hơn.",
          "Luyện: `Saya harus ke dokter dulu?`",
        ],
        pronunciation_focus_en: [
          "KA-lau de-MAM-nya TING-ghee, SA-ya HA-roos ke DOK-ter DOO-loo -- `demamnya tinggi` = high fever; `ke dokter` = to the doctor.",
          "VN-speaker trap: asking `pergi rumah sakit dulu?` when the problem is still mild. `Ke dokter dulu` is more natural and specific.",
          "Drill: `Saya harus ke dokter dulu?`",
        ],
      },
      {
        en: "Obat ini ada efek sampingnya atau tidak?",
        vi: "Thuốc này có tác dụng phụ hay không?",
        pronunciation_focus: [
          "O-bat I-ni A-da e-FEK sam-PING-nya A-tau TI-dak -- `efek samping` = tác dụng phụ.",
          "Mẹo: với thuốc anak, hỏi efek samping sangat penting, terutama kalau anak sensitif atau sedang minum obat lain.",
          "Luyện: `Ada efek sampingnya?`",
        ],
        pronunciation_focus_en: [
          "O-bat EE-ni A-da e-FEK sam-PING-nya A-tau TEE-dak -- `efek samping` = side effect.",
          "Tip: with children's medicine, asking about side effects is important, especially if the child is sensitive or taking other medicine.",
          "Drill: `Ada efek sampingnya?`",
        ],
      },
      {
        en: "Saya ada resep dokter, tolong cek obat yang cocok.",
        vi: "Tôi có toa bác sĩ, làm ơn kiểm tra thuốc phù hợp.",
        pronunciation_focus: [
          "SA-ya A-da re-SEP DOK-ter, TO-long cek O-bat yang CO-cok -- `resep dokter` = toa bác sĩ; `cocok` = phù hợp.",
          "`cek` sering dipakai langsung di apotek; natural dan ringkas.",
          "Luyện: `Tolong cek obat yang cocok.`",
        ],
        pronunciation_focus_en: [
          "SA-ya A-da re-SEP DOK-ter, TO-long chek O-bat yang CHO-chok -- `resep dokter` = doctor's prescription; `cocok` = suitable.",
          "`Cek` is commonly used directly at the pharmacy; natural and concise.",
          "Drill: `Tolong cek obat yang cocok.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, apotek thường phân biệt obat bebas, obat resep, dan obat untuk anak. Khi mua obat cho trẻ, nhân viên thường hỏi usia anak, berat badan, alergi obat, dan apakah ada resep dokter. Với thuốc dạng sirup, sendok takar harus dipakai để dosis tepat. Nếu demam tinggi, batuk berat, atau ada tanda sesak, nhân viên apotek biasanya menyarankan ke dokter atau rumah sakit.",
    cultural_notes_en:
      "In Indonesia, pharmacies often distinguish over-the-counter medicine, prescription medicine, and children's medicine. When buying medicine for a child, staff usually ask the child's age, weight, medicine allergies, and whether you have a doctor's prescription. For syrup medicine, a measuring spoon should be used for the correct dose. If there is a high fever, severe cough, or signs of breathing trouble, pharmacy staff usually advise seeing a doctor or going to a hospital.",
    tip_advice_vi:
      "Mẹo cho người Việt: học theo cụm thuốc trẻ em: `obat anak`, `sirup`, `dosis anak`, `demam`, `batuk`, `alergi obat`, `sendok takar`, `resep dokter`, `efek samping`. Luôn hỏi theo mẫu `aman untuk usia...` và `dosisnya berapa?` để tránh dùng sai.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn the children's-medicine chunks: `obat anak`, `sirup`, `dosis anak`, `demam`, `batuk`, `alergi obat`, `sendok takar`, `resep dokter`, `efek samping`. Always ask with patterns like `aman untuk usia...` and `dosisnya berapa?` to avoid misuse.",
    vocabulary: [
      {
        cell_id: "caccf9e0-bcb5-46e9-a93e-04db6e7cfac7",
        word: "obat anak",
        en: "children's medicine",
        vi: "thuốc cho trẻ em",
        pos: "noun phrase",
        pronunciation_vi: "O-bat A-nak",
        pronunciation_en: "O-bat A-nak",
      },
      {
        cell_id: "c9a7ee97-6e73-4b63-a7ae-c6dd6c7590aa",
        word: "sirup",
        en: "syrup / liquid medicine",
        vi: "si-rô / thuốc dạng lỏng",
        pos: "noun",
        pronunciation_vi: "SI-rup",
        pronunciation_en: "SEE-roop",
      },
      {
        cell_id: "26b2a749-1941-4c35-b2e7-f994b45feaa8",
        word: "dosis anak",
        en: "child dose",
        vi: "liều cho trẻ em",
        pos: "noun phrase",
        pronunciation_vi: "DO-sis A-nak",
        pronunciation_en: "DO-sis A-nak",
      },
      {
        cell_id: "3a754512-7bce-4b59-be34-b96ef8e11baa",
        word: "demam",
        en: "fever",
        vi: "sốt",
        pos: "noun",
        pronunciation_vi: "de-MAM",
        pronunciation_en: "de-MAM",
      },
      {
        cell_id: "da554634-1dd9-4110-ba73-a70b106d46a2",
        word: "batuk",
        en: "cough",
        vi: "ho",
        pos: "noun",
        pronunciation_vi: "BA-tuk",
        pronunciation_en: "BA-took",
      },
      {
        cell_id: "6c07116b-846d-4a8a-90b5-e9a44fe2e2ac",
        word: "alergi obat",
        en: "medicine allergy",
        vi: "dị ứng thuốc",
        pos: "noun phrase",
        pronunciation_vi: "a-LER-gi O-bat",
        pronunciation_en: "a-LER-gee O-bat",
      },
      {
        cell_id: "364c02f2-a7c0-4035-817b-a869d58b0b85",
        word: "sendok takar",
        en: "measuring spoon",
        vi: "muỗng đong",
        pos: "noun phrase",
        pronunciation_vi: "sen-DOK TA-kar",
        pronunciation_en: "sen-DOK TA-kar",
      },
      {
        cell_id: "b8c725bc-e390-4c71-9bb8-44ef7fed52be",
        word: "efek samping",
        en: "side effect",
        vi: "tác dụng phụ",
        pos: "noun phrase",
        pronunciation_vi: "e-FEK sam-PING",
        pronunciation_en: "e-FEK sam-PING",
      },
    ],
    dialogue: [
      {
        cell_id: "240d22b6-1bf7-41cb-acab-b4ea5336c404",
        speaker: "Orang tua",
        text: "Permisi, saya cari obat anak untuk demam dan batuk.",
        vi: "Xin phép, tôi tìm thuốc cho trẻ em trị sốt và ho.",
        en: "Excuse me, I am looking for children's medicine for fever and cough.",
      },
      {
        cell_id: "3d0c118c-3b78-4b20-906c-2084f70ae421",
        speaker: "Apoteker",
        text: "Baik. Berapa usia anaknya?",
        vi: "Được. Bé bao nhiêu tuổi?",
        en: "Okay. How old is the child?",
      },
      {
        cell_id: "94e6c4ce-10d3-4de3-aaea-bb6311a8104a",
        speaker: "Orang tua",
        text: "Usianya tiga tahun. Ada alergi obat yang harus saya sebutkan.",
        vi: "Bé ba tuổi. Có dị ứng thuốc nào tôi cần nói không.",
        en: "The child is three years old. Is there any medicine allergy I should mention?",
      },
      {
        cell_id: "6550b4b7-d77c-4d73-a8f6-cc91570646d0",
        speaker: "Apoteker",
        text: "Ada sirup ini. Dosis anaknya pakai sendok takar dua kali sehari.",
        vi: "Có loại si-rô này. Liều cho trẻ dùng muỗng đong hai lần mỗi ngày.",
        en: "There is this syrup. The child dose uses a measuring spoon twice a day.",
      },
      {
        cell_id: "de8b4f9f-ca9d-4f0b-ac5a-891c0117fc4c",
        speaker: "Orang tua",
        text: "Kalau demam tinggi atau ada efek samping, saya harus ke dokter dulu, ya?",
        vi: "Nếu sốt cao hoặc có tác dụng phụ, tôi phải đi bác sĩ trước, phải không?",
        en: "If the fever is high or there are side effects, I should see a doctor first, right?",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: 'Thuốc này có an toàn cho bé ba tuổi không?'",
        prompt_en: "Translate into Indonesian: 'Is this medicine safe for a three-year-old child?'",
        answer: "Apakah ada obat yang aman untuk usia tiga tahun?",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Ada ____ takarnya di dalam kotak?`",
        prompt_en: "Fill in the blank: `Ada ____ takarnya di dalam kotak?`",
        answer: "sendok",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm Indonesia với nghĩa tiếng Việt.",
        prompt_en: "Match the Indonesian phrase with the Vietnamese meaning.",
        pairs: [
          ["dosis anak", "liều cho trẻ em"],
          ["efek samping", "tác dụng phụ"],
          ["resep dokter", "toa bác sĩ"],
        ],
      },
      {
        type: "roleplay",
        prompt_vi:
          "Bạn ở apotek. Hỏi obat anak untuk demam dan batuk, sebut usia anak, tanya dosis, sendok takar, alergi obat, dan apakah perlu ke dokter.",
        prompt_en:
          "You are at a pharmacy. Ask for children's medicine for fever and cough, state the child's age, ask about dosage, measuring spoon, medicine allergies, and whether a doctor is needed.",
      },
    ],
    content:
      "Use this lesson for Indonesian conversations at the pharmacy about children's medicine: syrup, dosage, fever, cough, medicine allergies, measuring spoons, doctor's prescriptions, and possible side effects.",
  },
];
