// Earthquake Preparedness Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It mirrors sibling Indonesian `extra/*`
// files: target-language text is stored in `en`, Vietnamese glosses in `vi`,
// Vietnamese-facing L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.
//
// Survival register note: earthquake Indonesian favors short imperatives and
// official terms such as `gempa bumi`, `P3K`, `titik kumpul`, `BMKG`, `siaga`,
// `evakuasi`, and `gempa susulan`. The practical goal is fast comprehension
// before, during, and after shaking.

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
    id: "indonesian_earthquake_preparedness",
    level: "B1",
    category: "emergency",
    title_vi: "Chuẩn bị ứng phó động đất bằng tiếng Indonesia",
    title_en: "Earthquake preparedness Indonesian",
    sentences: [
      {
        en: "Kita harus siap sebelum gempa bumi terjadi.",
        vi: "Chúng ta phải sẵn sàng trước khi động đất xảy ra.",
        pronunciation_focus: [
          "KI-ta HA-rus SI-ap se-BE-lum GEM-pa BU-mi ter-JA-di - `gempa bumi` = động đất; `terjadi` = xảy ra.",
          "Lỗi người Việt: chỉ nói `gempa` là hiểu được, nhưng trong thông báo chính thức thường dùng `gempa bumi`.",
          "Luyện: `Siap sebelum gempa bumi terjadi.`",
        ],
        pronunciation_focus_en: [
          "KI-ta HA-roos SEE-ap se-BE-lum GEM-pa BOO-mee ter-JA-dee - `gempa bumi` = earthquake; `terjadi` = happen.",
          "VN-speaker trap: `gempa` is understood, but official notices often say `gempa bumi`.",
          "Drill: `Siap sebelum gempa bumi terjadi.`",
        ],
      },
      {
        en: "Simpan tas siaga di dekat pintu.",
        vi: "Hãy để túi khẩn cấp gần cửa.",
        pronunciation_focus: [
          "SIM-pan tas si-A-ga di DE-kat PIN-tu - `tas siaga` = túi khẩn cấp; `di dekat` = ở gần.",
          "Lỗi người Việt: dùng `ke dekat`. Vị trí đứng yên dùng `di dekat`, hướng đi mới dùng `ke`.",
          "Luyện: `Tas siaga di dekat pintu.`",
        ],
        pronunciation_focus_en: [
          "SIM-pan tas see-A-ga dee DE-kat PIN-too - `tas siaga` = emergency go-bag; `di dekat` = near.",
          "VN-speaker trap: using `ke dekat`. A fixed location takes `di dekat`; direction takes `ke`.",
          "Drill: `Tas siaga di dekat pintu.`",
        ],
      },
      {
        en: "Masukkan air minum, makanan ringan, senter, dan obat P3K.",
        vi: "Cho nước uống, đồ ăn nhẹ, đèn pin và thuốc sơ cứu vào.",
        pronunciation_focus: [
          "ma-SUK-kan A-ir MI-num, ma-KA-nan RI-ngan, SEN-ter, dan O-bat PE-ti-GA-ka - `P3K` = sơ cứu.",
          "Lỗi người Việt: đọc từng chữ P-3-K bằng tiếng Việt. Ở Indonesia thường đọc `pe tiga ka`.",
          "Luyện: `Obat P3K ada di tas siaga.`",
        ],
        pronunciation_focus_en: [
          "ma-SOOK-kan A-eer MEE-num, ma-KA-nan REE-ngan, SEN-ter, dan O-bat PEH-tee-GA-kah - `P3K` = first aid.",
          "VN-speaker trap: reading P3K with Vietnamese letter names. In Indonesian, say `pe tiga ka`.",
          "Drill: `Obat P3K ada di tas siaga.`",
        ],
      },
      {
        en: "Saat gempa, berlindung di bawah meja yang kuat.",
        vi: "Khi động đất, hãy trú dưới cái bàn chắc chắn.",
        pronunciation_focus: [
          "SA-at GEM-pa, ber-LIN-dung di BA-wah ME-ja yang KU-at - `berlindung` = trú/nấp; `di bawah` = ở dưới.",
          "Lỗi người Việt: dịch 'núp' bằng `sembunyi` trong mọi tình huống. Khi tránh nguy hiểm, dùng `berlindung`.",
          "Luyện: `Berlindung di bawah meja.`",
        ],
        pronunciation_focus_en: [
          "SA-at GEM-pa, ber-LIN-doong dee BA-wah MEH-ja yang KOO-at - `berlindung` = take shelter; `di bawah` = under.",
          "VN-speaker trap: using `sembunyi` for every 'hide'. For protection from danger, use `berlindung`.",
          "Drill: `Berlindung di bawah meja.`",
        ],
      },
      {
        en: "Jangan panik dan jangan langsung lari ke tangga.",
        vi: "Đừng hoảng loạn và đừng chạy ngay ra cầu thang.",
        pronunciation_focus: [
          "JA-ngan PA-nik dan JA-ngan LANG-sung LA-ri ke TANG-ga - `jangan` = đừng; `langsung` = ngay lập tức.",
          "Lỗi người Việt: dùng `tidak` để cấm. Cấm/đừng làm gì phải dùng `jangan`.",
          "Luyện: `Jangan panik.`",
        ],
        pronunciation_focus_en: [
          "JA-ngan PA-nik dan JA-ngan LANG-soong LA-ree ke TANG-ga - `jangan` = don't; `langsung` = immediately.",
          "VN-speaker trap: using `tidak` for prohibitions. For 'do not', use `jangan`.",
          "Drill: `Jangan panik.`",
        ],
      },
      {
        en: "Setelah guncangan berhenti, evakuasi lewat jalur aman.",
        vi: "Sau khi rung lắc dừng lại, hãy sơ tán qua lối an toàn.",
        pronunciation_focus: [
          "se-TE-lah gun-CA-ngan ber-HEN-ti, e-va-ku-A-si LE-wat JA-lur A-man - `guncangan` = rung lắc.",
          "Lỗi người Việt: `evakuasi` có thể là danh từ hoặc động từ trong chỉ dẫn ngắn; đừng thêm cấu trúc quá dài.",
          "Luyện: `Evakuasi lewat jalur aman.`",
        ],
        pronunciation_focus_en: [
          "se-TE-lah goon-CHA-ngan ber-HEN-tee, eh-va-koo-A-see LEH-wat JA-loor A-man - `guncangan` = shaking.",
          "VN-speaker trap: `evakuasi` can function as a noun or short instruction verb; do not overbuild the sentence.",
          "Drill: `Evakuasi lewat jalur aman.`",
        ],
      },
      {
        en: "Jangan gunakan lift saat evakuasi.",
        vi: "Đừng dùng thang máy khi sơ tán.",
        pronunciation_focus: [
          "JA-ngan GU-na-kan lift SA-at e-va-ku-A-si - `gunakan` = sử dụng; `lift` = thang máy.",
          "Lỗi người Việt: nói `pakai lift` vẫn hiểu, nhưng biển báo/trường học hay dùng `gunakan`.",
          "Luyện: `Jangan gunakan lift.`",
        ],
        pronunciation_focus_en: [
          "JA-ngan GOO-na-kan lift SA-at eh-va-koo-A-see - `gunakan` = use; `lift` = elevator.",
          "VN-speaker trap: `pakai lift` is understood, but signs and drills often use `gunakan`.",
          "Drill: `Jangan gunakan lift.`",
        ],
      },
      {
        en: "Semua orang berkumpul di titik kumpul.",
        vi: "Mọi người tập trung tại điểm tập kết.",
        pronunciation_focus: [
          "se-MU-a O-rang ber-KUM-pul di TI-tik KUM-pul - `titik kumpul` = điểm tập kết.",
          "Lỗi người Việt: dịch thành `tempat kumpul` cũng hiểu, nhưng thuật ngữ an toàn là `titik kumpul`.",
          "Luyện: `Berkumpul di titik kumpul.`",
        ],
        pronunciation_focus_en: [
          "se-MOO-a O-rang ber-KOOM-pool dee TEE-tik KOOM-pool - `titik kumpul` = assembly point.",
          "VN-speaker trap: `tempat kumpul` is understandable, but the safety term is `titik kumpul`.",
          "Drill: `Berkumpul di titik kumpul.`",
        ],
      },
      {
        en: "Periksa informasi resmi dari BMKG.",
        vi: "Hãy kiểm tra thông tin chính thức từ BMKG.",
        pronunciation_focus: [
          "pe-RIK-sa in-for-MA-si res-MI DA-ri BE-EM-KA-GE - `BMKG` = cơ quan khí tượng, khí hậu và địa vật lý Indonesia.",
          "Lỗi người Việt: đọc `BMKG` như một từ. Thường đọc từng chữ: `be em ka ge`.",
          "Luyện: `Informasi resmi dari BMKG.`",
        ],
        pronunciation_focus_en: [
          "pe-RIK-sa in-for-MA-see res-MEE DA-ree BEH-EM-KA-GEH - `BMKG` = Indonesia's meteorology, climatology, and geophysics agency.",
          "VN-speaker trap: reading `BMKG` as one word. It is usually spelled out: `be em ka ge`.",
          "Drill: `Informasi resmi dari BMKG.`",
        ],
      },
      {
        en: "Waspada gempa susulan setelah gempa besar.",
        vi: "Hãy cảnh giác dư chấn sau trận động đất lớn.",
        pronunciation_focus: [
          "was-PA-da GEM-pa su-SU-lan se-TE-lah GEM-pa be-SAR - `gempa susulan` = dư chấn.",
          "Lỗi người Việt: dùng `aftershock` trong câu Indonesia. Từ tự nhiên/chính thức là `gempa susulan`.",
          "Luyện: `Waspada gempa susulan.`",
        ],
        pronunciation_focus_en: [
          "was-PA-da GEM-pa soo-SOO-lan se-TE-lah GEM-pa be-SAR - `gempa susulan` = aftershock.",
          "VN-speaker trap: inserting English `aftershock`. Natural/official Indonesian is `gempa susulan`.",
          "Drill: `Waspada gempa susulan.`",
        ],
      },
      {
        en: "Kalau ada yang terluka, ambil kotak P3K.",
        vi: "Nếu có người bị thương, hãy lấy hộp sơ cứu.",
        pronunciation_focus: [
          "KA-lau A-da yang ter-LU-ka, AM-bil KO-tak PE-ti-GA-ka - `terluka` = bị thương; `kotak P3K` = hộp sơ cứu.",
          "Lỗi người Việt: dùng `luka` cho người. `Luka` là vết thương; người bị thương là `terluka`.",
          "Luyện: `Ada yang terluka.`",
        ],
        pronunciation_focus_en: [
          "KA-lau A-da yang ter-LOO-ka, AM-bil KO-tak PEH-tee-GA-kah - `terluka` = injured; `kotak P3K` = first-aid kit.",
          "VN-speaker trap: using `luka` for a person. `Luka` is a wound; an injured person is `terluka`.",
          "Drill: `Ada yang terluka.`",
        ],
      },
      {
        en: "Latihan evakuasi membuat keluarga lebih siap.",
        vi: "Diễn tập sơ tán giúp gia đình sẵn sàng hơn.",
        pronunciation_focus: [
          "LA-tih-an e-va-ku-A-si mem-BU-at ke-LU-ar-ga le-BIH SI-ap - `latihan` = luyện tập/diễn tập; `lebih siap` = sẵn sàng hơn.",
          "Lợi thế người Việt: so sánh hơn dùng `lebih + tính từ`, giống 'hơn' rất dễ nhớ.",
          "Luyện: `Keluarga lebih siap.`",
        ],
        pronunciation_focus_en: [
          "LA-tee-han eh-va-koo-A-see mem-BOO-at ke-LOO-ar-ga le-BEEH SEE-ap - `latihan` = drill/practice; `lebih siap` = more prepared.",
          "VN-speaker win: comparatives use `lebih + adjective`, a straightforward pattern.",
          "Drill: `Keluarga lebih siap.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Indonesia nằm trên Vành đai Lửa nên động đất là kiến thức sinh tồn hằng ngày, đặc biệt ở Jawa, Sumatra, Bali, Nusa Tenggara, Sulawesi và Papua. `BMKG` là nguồn thông tin chính thức về động đất, cảnh báo tsunami và thời tiết. Ở trường học, văn phòng, khách sạn và chung cư thường có biển `jalur evakuasi` và `titik kumpul`; người học nên nhận ra các từ này ngay cả khi chưa nói trôi chảy.",
    cultural_notes_en:
      "Indonesia sits on the Ring of Fire, so earthquake readiness is everyday survival knowledge, especially in Java, Sumatra, Bali, Nusa Tenggara, Sulawesi, and Papua. `BMKG` is the official source for earthquake information, tsunami warnings, and weather. Schools, offices, hotels, and apartment buildings often mark `jalur evakuasi` and `titik kumpul`; learners should recognize these terms even before they speak fluently.",
    tip_advice_vi:
      "Mẹo cho người Việt: trong tình huống khẩn cấp, câu Indonesia càng ngắn càng tốt. Học thuộc các khung: `Jangan panik`, `Berlindung di bawah meja`, `Evakuasi lewat jalur aman`, `Berkumpul di titik kumpul`, `Waspada gempa susulan`. Phân biệt `di` = ở vị trí, `ke` = đi đến, và `dari` = từ nguồn/thông tin.",
    tip_advice_en:
      "Tip for Vietnamese speakers: in emergencies, shorter Indonesian is better. Memorize these frames: `Jangan panik`, `Berlindung di bawah meja`, `Evakuasi lewat jalur aman`, `Berkumpul di titik kumpul`, `Waspada gempa susulan`. Keep `di` = at/in, `ke` = to, and `dari` = from/source distinct.",
    vocabulary: [
      {
        cell_id: "b236331e-8279-41f5-9857-d44c09d2d1b3",
        word: "gempa bumi",
        en: "earthquake",
        vi: "động đất",
        pos: "noun",
        pronunciation_vi: "GEM-pa BU-mi",
        pronunciation_en: "GEM-pa BOO-mee",
      },
      {
        cell_id: "bf618e5b-654f-4cc9-b58b-15a3a66fa723",
        word: "siaga",
        en: "alert / ready",
        vi: "sẵn sàng / cảnh giác",
        pos: "adjective",
        pronunciation_vi: "si-A-ga",
        pronunciation_en: "see-A-ga",
      },
      {
        cell_id: "e11672e3-d50e-46d2-87f8-028fc65ee013",
        word: "tas siaga",
        en: "emergency go-bag",
        vi: "túi khẩn cấp",
        pos: "noun phrase",
        pronunciation_vi: "tas si-A-ga",
        pronunciation_en: "tas see-A-ga",
      },
      {
        cell_id: "ca2a8648-d248-4a3c-967b-af0970965b46",
        word: "P3K",
        en: "first aid",
        vi: "sơ cứu",
        pos: "noun",
        pronunciation_vi: "PE-ti-GA-ka",
        pronunciation_en: "PEH-tee-GA-kah",
      },
      {
        cell_id: "e0e87657-6526-4eec-b67e-0b00a245ab68",
        word: "kotak P3K",
        en: "first-aid kit",
        vi: "hộp sơ cứu",
        pos: "noun phrase",
        pronunciation_vi: "KO-tak PE-ti-GA-ka",
        pronunciation_en: "KO-tak PEH-tee-GA-kah",
      },
      {
        cell_id: "b0b9037d-6284-451e-9b49-c2b28e3609e9",
        word: "evakuasi",
        en: "evacuation / evacuate",
        vi: "sơ tán",
        pos: "noun / verb",
        pronunciation_vi: "e-va-ku-A-si",
        pronunciation_en: "eh-va-koo-A-see",
      },
      {
        cell_id: "136652bd-d17c-4214-ac4f-a513e56a8731",
        word: "jalur evakuasi",
        en: "evacuation route",
        vi: "lối sơ tán",
        pos: "noun phrase",
        pronunciation_vi: "JA-lur e-va-ku-A-si",
        pronunciation_en: "JA-loor eh-va-koo-A-see",
      },
      {
        cell_id: "18836c8d-d186-433d-b0cc-f4f87aa35ee0",
        word: "titik kumpul",
        en: "assembly point",
        vi: "điểm tập kết",
        pos: "noun phrase",
        pronunciation_vi: "TI-tik KUM-pul",
        pronunciation_en: "TEE-tik KOOM-pool",
      },
      {
        cell_id: "7a27ff22-965a-4b62-9c24-2af7597fa753",
        word: "BMKG",
        en: "Indonesian meteorology, climatology, and geophysics agency",
        vi: "cơ quan khí tượng, khí hậu và địa vật lý Indonesia",
        pos: "proper noun",
        pronunciation_vi: "BE-EM-KA-GE",
        pronunciation_en: "BEH-EM-KA-GEH",
      },
      {
        cell_id: "5b786b25-c0f4-47e7-90ce-696453b63dc6",
        word: "gempa susulan",
        en: "aftershock",
        vi: "dư chấn",
        pos: "noun phrase",
        pronunciation_vi: "GEM-pa su-SU-lan",
        pronunciation_en: "GEM-pa soo-SOO-lan",
      },
      {
        cell_id: "cb8b06a1-fd26-4805-9052-6c30e78e9967",
        word: "guncangan",
        en: "shaking",
        vi: "rung lắc",
        pos: "noun",
        pronunciation_vi: "gun-CA-ngan",
        pronunciation_en: "goon-CHA-ngan",
      },
      {
        cell_id: "6e74eaeb-7b2b-48f2-9609-8b9cbe42505d",
        word: "berlindung",
        en: "to take shelter",
        vi: "trú ẩn / nấp để an toàn",
        pos: "verb",
        pronunciation_vi: "ber-LIN-dung",
        pronunciation_en: "ber-LIN-doong",
      },
    ],
    dialogue: [
      {
        cell_id: "2fe00377-9f57-4b7d-843a-dac85c71c4c6",
        speaker: "Petugas",
        text: "Jangan panik. Setelah guncangan berhenti, ikuti jalur evakuasi.",
        vi: "Đừng hoảng loạn. Sau khi rung lắc dừng lại, hãy theo lối sơ tán.",
        en: "Do not panic. After the shaking stops, follow the evacuation route.",
      },
      {
        cell_id: "ffb0cde2-e263-47dc-811d-c7a837d75422",
        speaker: "Warga",
        text: "Titik kumpulnya di mana?",
        vi: "Điểm tập kết ở đâu?",
        en: "Where is the assembly point?",
      },
      {
        cell_id: "26d623f3-e7f3-4aaa-878c-80a93c3b6c6a",
        speaker: "Petugas",
        text: "Di lapangan depan. Jangan gunakan lift.",
        vi: "Ở sân phía trước. Đừng dùng thang máy.",
        en: "At the front field. Do not use the elevator.",
      },
      {
        cell_id: "af755c28-39d3-46d3-8e10-ef56a5e8c7d1",
        speaker: "Warga",
        text: "Baik. Saya ambil tas siaga dan kotak P3K.",
        vi: "Vâng. Tôi lấy túi khẩn cấp và hộp sơ cứu.",
        en: "Okay. I will take the emergency bag and first-aid kit.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Đừng hoảng loạn và hãy đi đến điểm tập kết.",
        answer: "Jangan panik dan pergi ke titik kumpul.",
      },
      {
        type: "fill_blank",
        prompt: "Waspada gempa ____ setelah gempa besar.",
        answer: "susulan",
        explanation_vi: "`gempa susulan` = dư chấn / aftershock.",
        explanation_en: "`gempa susulan` = aftershock.",
      },
      {
        type: "multiple_choice",
        prompt: "Which term means 'evacuation route'?",
        choices: ["jalur evakuasi", "kotak P3K", "gempa susulan", "air minum"],
        answer: "jalur evakuasi",
      },
      {
        type: "matching",
        pairs: [
          ["gempa bumi", "động đất"],
          ["P3K", "sơ cứu"],
          ["titik kumpul", "điểm tập kết"],
          ["BMKG", "cơ quan thông tin chính thức"],
        ],
      },
    ],
  },
];

export default lessons;
