// Traditional Health & Jamu Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack. The shape mirrors sibling Indonesian extra
// files: Indonesian target text lives in `en`, Vietnamese glosses in `vi`,
// `pronunciation_focus` contains Vietnamese L1 notes, and
// `pronunciation_focus_en` is the English companion in the same order.

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
  cell_id?: string;
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
  cell_id?: string;
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

export const traditionalHealthJamuLessons: IndonesianLesson[] = [
  {
    id: "indonesian_traditional_health_jamu",
    level: "B1",
    category: "health_culture",
    title_vi: "Jamu và văn hóa chăm sóc sức khỏe truyền thống",
    title_en: "Jamu and traditional health culture",
    sentences: [
      {
        en: "Saya minum jamu kunyit asam kalau badan terasa kurang enak.",
        vi: "Tôi uống jamu nghệ me khi người thấy không khỏe.",
        pronunciation_focus: [
          "JA-mu KU-nyit A-sam - `jamu` = đồ uống/thảo dược truyền thống; `kunyit asam` = nghệ me.",
          "`badan terasa kurang enak` = người/cơ thể thấy không khỏe; rất tự nhiên trong nói chuyện.",
          "Lỗi người Việt: dịch 'không khỏe' thành `tidak sehat` trong mọi câu. Với cảm giác nhẹ, dùng `kurang enak badan`.",
          "Luyện: `Badan saya kurang enak.`",
        ],
        pronunciation_focus_en: [
          "JA-moo KOO-nyit A-sam - `jamu` = traditional herbal drink/medicine; `kunyit asam` = turmeric-tamarind jamu.",
          "`badan terasa kurang enak` = the body feels unwell; very natural in conversation.",
          "VN-speaker trap: translating 'not well' as `tidak sehat` every time. For mild malaise, use `kurang enak badan`.",
          "Drill: `Badan saya kurang enak.`",
        ],
      },
      {
        en: "Nenek saya sering membuat jamu dari jahe dan serai.",
        vi: "Bà tôi thường làm jamu từ gừng và sả.",
        pronunciation_focus: [
          "NE-nek SA-ya SE-ring mem-BU-at JA-mu - `nenek` = bà; `sering` = thường.",
          "`dari jahe dan serai` = từ gừng và sả; `jahe` = gừng, `serai` = sả.",
          "Mẹo: nhiều tên thảo mộc giống bếp nấu ăn, nên học cùng món ăn: jahe, kunyit, serai, temulawak.",
          "Luyện: `Jamu dari jahe dan serai.`",
        ],
        pronunciation_focus_en: [
          "NE-nek SA-ya SE-ring mem-BOO-at JA-moo - `nenek` = grandmother; `sering` = often.",
          "`dari jahe dan serai` = from ginger and lemongrass; `jahe` = ginger, `serai` = lemongrass.",
          "Tip: many herbal names overlap with cooking, so learn them with food terms: jahe, kunyit, serai, temulawak.",
          "Drill: `Jamu dari jahe dan serai.`",
        ],
      },
      {
        en: "Kalau masuk angin, banyak orang memakai minyak kayu putih.",
        vi: "Khi bị 'trúng gió/cảm gió', nhiều người dùng dầu khuynh diệp.",
        pronunciation_focus: [
          "MA-suk AN-gin - `masuk angin` là khái niệm dân gian: lạnh người, đầy hơi, mệt, giống 'trúng gió/cảm gió'.",
          "`minyak kayu putih` = dầu khuynh diệp/cajeput oil, rất phổ biến ở Indonesia.",
          "Lỗi người Việt: dịch từng chữ `gió vào`. Hãy học nguyên cụm `masuk angin`.",
          "Luyện: `Saya masuk angin.`",
        ],
        pronunciation_focus_en: [
          "MA-suk AN-gin - `masuk angin` is a folk concept: chills, bloating, fatigue, like 'catching wind'.",
          "`minyak kayu putih` = cajeput/eucalyptus-style oil, very common in Indonesia.",
          "VN-speaker trap: translating it word by word as 'wind enters'. Learn `masuk angin` as a fixed phrase.",
          "Drill: `Saya masuk angin.`",
        ],
      },
      {
        en: "Tolong oleskan minyak kayu putih di punggung saya.",
        vi: "Làm ơn thoa dầu khuynh diệp lên lưng tôi.",
        pronunciation_focus: [
          "TO-long o-LES-kan MI-nyak KA-yu PU-tih - `oleskan` = thoa/bôi lên.",
          "`di punggung saya` = trên lưng tôi; bộ phận cơ thể + `saya` giống tiếng Việt.",
          "Lỗi người Việt: dùng `taruh` (đặt) cho dầu. Với dầu/kem, dùng `oleskan`.",
          "Luyện: `Oleskan minyak di punggung.`",
        ],
        pronunciation_focus_en: [
          "TO-long o-LES-kan MEE-nyak KA-yoo POO-tih - `oleskan` = apply/rub on.",
          "`di punggung saya` = on my back; body part + `saya` maps well to Vietnamese.",
          "VN-speaker trap: using `taruh` (put/place) for oil. For oil/cream, use `oleskan`.",
          "Drill: `Oleskan minyak di punggung.`",
        ],
      },
      {
        en: "Kerokan meninggalkan bekas merah di kulit.",
        vi: "Cạo gió kiểu kerokan để lại vết đỏ trên da.",
        pronunciation_focus: [
          "ke-RO-kan - `kerokan` = cạo gió/đánh gió kiểu Indonesia bằng đồng xu hoặc dụng cụ.",
          "`meninggalkan bekas merah` = để lại vết đỏ; `bekas` = vết/dấu còn lại.",
          "Mẹo văn hóa: kerokan giống cạo gió Việt Nam, nhưng vẫn nên hỏi người bệnh có muốn không.",
          "Luyện: `Kerokan meninggalkan bekas merah.`",
        ],
        pronunciation_focus_en: [
          "ke-RO-kan - `kerokan` = Indonesian scraping therapy, similar to Vietnamese cạo gió.",
          "`meninggalkan bekas merah` = leaves red marks; `bekas` = mark/trace left behind.",
          "Culture tip: kerokan resembles Vietnamese coin rubbing, but still ask whether the person wants it.",
          "Drill: `Kerokan meninggalkan bekas merah.`",
        ],
      },
      {
        en: "Badan saya pegal setelah perjalanan jauh.",
        vi: "Người tôi đau mỏi sau chuyến đi xa.",
        pronunciation_focus: [
          "BA-dan SA-ya PE-gal - `pegal` = đau mỏi/căng mỏi cơ.",
          "`perjalanan jauh` = chuyến đi xa; `jauh` = xa.",
          "Lỗi người Việt: dùng `sakit` cho mọi loại đau. `Pegal` chính xác hơn cho đau mỏi cơ.",
          "Luyện: `Badan saya pegal.`",
        ],
        pronunciation_focus_en: [
          "BA-dan SA-ya PE-gal - `pegal` = sore/aching muscles.",
          "`perjalanan jauh` = long trip; `jauh` = far.",
          "VN-speaker trap: using `sakit` for every pain. `Pegal` is more precise for body/muscle aches.",
          "Drill: `Badan saya pegal.`",
        ],
      },
      {
        en: "Saya mau pijat tradisional, tapi jangan terlalu keras.",
        vi: "Tôi muốn mát xa truyền thống, nhưng đừng mạnh quá.",
        pronunciation_focus: [
          "PI-jat tra-di-si-o-NAL - `pijat tradisional` = mát xa truyền thống.",
          "`jangan terlalu keras` = đừng quá mạnh; câu rất quan trọng khi đi mát xa.",
          "Lỗi người Việt: nói `kuat` cho lực tay. Nói với người mát xa tự nhiên hơn: `jangan terlalu keras`.",
          "Luyện: `Jangan terlalu keras.`",
        ],
        pronunciation_focus_en: [
          "PEE-jat tra-dee-see-o-NAL - `pijat tradisional` = traditional massage.",
          "`jangan terlalu keras` = not too hard/strong; an important massage phrase.",
          "VN-speaker trap: saying `kuat` for pressure. With a masseur, `jangan terlalu keras` is more natural.",
          "Drill: `Jangan terlalu keras.`",
        ],
      },
      {
        en: "Kalau demam tinggi atau nyeri berat, sebaiknya periksa ke dokter.",
        vi: "Nếu sốt cao hoặc đau nặng, tốt nhất nên đi khám bác sĩ.",
        pronunciation_focus: [
          "de-MAM TING-gi / NYE-ri BE-rat - `demam tinggi` = sốt cao; `nyeri berat` = đau nặng.",
          "`sebaiknya periksa ke dokter` = tốt nhất nên đi khám bác sĩ; `sebaiknya` mềm nhưng rõ.",
          "Mẹo an toàn: jamu và chăm sóc truyền thống là văn hóa, không thay thế bác sĩ khi triệu chứng nặng.",
          "Luyện: `Sebaiknya periksa ke dokter.`",
        ],
        pronunciation_focus_en: [
          "de-MAM TING-gee / NYE-ree BE-rat - `demam tinggi` = high fever; `nyeri berat` = severe pain.",
          "`sebaiknya periksa ke dokter` = it is best to see a doctor; `sebaiknya` is gentle but clear.",
          "Safety tip: jamu and traditional care are cultural practices, not a substitute for medical care when symptoms are serious.",
          "Drill: `Sebaiknya periksa ke dokter.`",
        ],
      },
    ],
    cultural_notes_vi:
      "`Jamu` là truyền thống thảo dược lâu đời ở Indonesia, thường bán ở chai, quầy chợ, hoặc bởi `mbok jamu` đi bán rong. Các loại phổ biến gồm `kunyit asam`, `beras kencur`, `temulawak`, đồ uống jahe/serai. `Minyak kayu putih` rất hay có trong gia đình để xoa khi đầy hơi, chóng mặt, lạnh người hoặc `masuk angin`. `Kerokan` và `pijat tradisional` giống nhiều thực hành dân gian Việt Nam, nhưng ở Indonesia vẫn cần hỏi ý và tôn trọng mức thoải mái của từng người. Với sốt cao, khó thở, đau nặng, dị ứng hoặc triệu chứng kéo dài, người Indonesia cũng nói `periksa ke dokter`.",
    cultural_notes_en:
      "`Jamu` is Indonesia's long-standing herbal tradition, sold in bottles, at markets, or by itinerant `mbok jamu` sellers. Common types include `kunyit asam`, `beras kencur`, `temulawak`, and ginger/lemongrass drinks. `Minyak kayu putih` is a household staple rubbed on for bloating, dizziness, chills, or `masuk angin`. `Kerokan` and `pijat tradisional` resemble Vietnamese folk care, but in Indonesia you still ask permission and respect each person's comfort. For high fever, breathing trouble, severe pain, allergies, or lasting symptoms, Indonesians also say `periksa ke dokter`.",
    tip_advice_vi:
      "Mẹo cho người Việt: học theo cụm cố định thay vì dịch từng chữ: `masuk angin`, `kurang enak badan`, `badan pegal`, `oleskan minyak`, `pijat tradisional`, `periksa ke dokter`. Tiếng Việt có 'cạo gió/dầu gió', nên khái niệm gần; khác là từ Indonesia và mức lịch sự khi hỏi: `Mau dikerok?`, `Boleh saya oleskan minyak?`, `Terlalu keras tidak?`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn fixed chunks rather than translating word by word: `masuk angin`, `kurang enak badan`, `badan pegal`, `oleskan minyak`, `pijat tradisional`, `periksa ke dokter`. Vietnamese has similar folk-care concepts, but the Indonesian words and polite permission frames matter: `Mau dikerok?`, `Boleh saya oleskan minyak?`, `Terlalu keras tidak?`.",
    vocabulary: [
      {
        cell_id: "097aa101-34ca-4822-8125-c6e5f94bc645",
        word: "jamu",
        en: "traditional herbal drink/medicine",
        vi: "thuốc/thức uống thảo dược truyền thống",
        pos: "noun",
        pronunciation_vi: "JA-mu",
        pronunciation_en: "JA-moo",
      },
      {
        cell_id: "6cb04d34-3afc-4c86-a06f-dc3e1abbb134",
        word: "minyak kayu putih",
        en: "cajeput/eucalyptus-style oil",
        vi: "dầu khuynh diệp / dầu gió Indonesia",
        pos: "noun phrase",
        pronunciation_vi: "MI-nyak KA-yu PU-tih",
        pronunciation_en: "MEE-nyak KA-yoo POO-tih",
      },
      {
        cell_id: "0b96a8db-34a9-485f-bf74-a57ce7b5158e",
        word: "kerokan",
        en: "scraping therapy",
        vi: "cạo gió kiểu Indonesia",
        pos: "noun",
        pronunciation_vi: "ke-RO-kan",
        pronunciation_en: "ke-RO-kan",
      },
      {
        cell_id: "fef4bf7b-7da9-494d-87dd-6594a1afdbb4",
        word: "masuk angin",
        en: "folk illness: chills/bloating/fatigue",
        vi: "trúng gió / cảm gió",
        pos: "phrase",
        pronunciation_vi: "MA-suk AN-gin",
        pronunciation_en: "MA-sook AN-gin",
      },
      {
        cell_id: "84c18f6c-170a-44f9-863f-1436123521d0",
        word: "pijat tradisional",
        en: "traditional massage",
        vi: "mát xa truyền thống",
        pos: "noun phrase",
        pronunciation_vi: "PI-jat tra-di-si-o-NAL",
        pronunciation_en: "PEE-jat tra-dee-see-o-NAL",
      },
      {
        cell_id: "1b6663e5-034d-4455-b1fa-2269548f1c7e",
        word: "herbal",
        en: "herbal",
        vi: "thảo dược",
        pos: "adjective",
        pronunciation_vi: "HER-bal",
        pronunciation_en: "HER-bal",
      },
      {
        cell_id: "10c2a579-1c34-45bc-8f33-62da9ed8289f",
        word: "badan pegal",
        en: "body aches / sore body",
        vi: "người đau mỏi",
        pos: "phrase",
        pronunciation_vi: "BA-dan PE-gal",
        pronunciation_en: "BA-dan PE-gal",
      },
      {
        cell_id: "23b6ae0b-164f-42fc-a156-eb5f79e870a4",
        word: "kurang enak badan",
        en: "feeling unwell",
        vi: "thấy không khỏe",
        pos: "phrase",
        pronunciation_vi: "KU-rang E-nak BA-dan",
        pronunciation_en: "KOO-rang E-nak BA-dan",
      },
      {
        cell_id: "71c74fbf-060f-41b1-8796-14acdd82f41d",
        word: "oleskan",
        en: "apply/rub on",
        vi: "thoa / bôi",
        pos: "verb",
        pronunciation_vi: "o-LES-kan",
        pronunciation_en: "o-LES-kan",
      },
      {
        cell_id: "ccbd9924-504b-4997-9383-de4c76709479",
        word: "budaya sehat",
        en: "health culture",
        vi: "văn hóa chăm sóc sức khỏe",
        pos: "noun phrase",
        pronunciation_vi: "bu-DA-ya SE-hat",
        pronunciation_en: "boo-DA-ya SE-hat",
      },
    ],
    dialogue: [
      {
        cell_id: "87520ec3-0d6a-4d79-9efa-7042a52455c3",
        speaker: "Linh",
        text: "Bu, badan saya kurang enak dan agak masuk angin.",
        vi: "Cô ơi, người tôi không khỏe và hơi bị trúng gió/cảm gió.",
        en: "Ma'am, I feel unwell and a bit masuk angin.",
      },
      {
        cell_id: "56606481-c66b-4694-b3c2-7a4a85e76c57",
        speaker: "Ibu Sari",
        text: "Mau minum jamu jahe dulu? Bisa juga pakai minyak kayu putih.",
        vi: "Muốn uống jamu gừng trước không? Cũng có thể dùng dầu khuynh diệp.",
        en: "Would you like ginger jamu first? You can also use cajeput oil.",
      },
      {
        cell_id: "5d9383c9-7cb9-405d-bf31-4a0f23c73cac",
        speaker: "Linh",
        text: "Boleh. Tolong oleskan sedikit di punggung saya.",
        vi: "Được ạ. Làm ơn thoa một ít lên lưng tôi.",
        en: "Yes. Please rub a little on my back.",
      },
      {
        cell_id: "32243ad3-251d-4105-a35a-ab182b54ba9d",
        speaker: "Ibu Sari",
        text: "Kalau demam tinggi, sebaiknya tetap periksa ke dokter.",
        vi: "Nếu sốt cao, tốt nhất vẫn nên đi khám bác sĩ.",
        en: "If you have a high fever, it is still best to see a doctor.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ/cụm từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word or phrase with its Vietnamese meaning:",
        items: [
          { prompt: "jamu", answer: "thảo dược truyền thống" },
          { prompt: "minyak kayu putih", answer: "dầu khuynh diệp" },
          { prompt: "kerokan", answer: "cạo gió kiểu Indonesia" },
          { prompt: "badan pegal", answer: "người đau mỏi" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu:",
        instruction_en: "Fill in the missing word:",
        items: [
          {
            prompt: "Saya minum ___ kunyit asam. (thảo dược truyền thống)",
            answer: "jamu",
            options: ["jamu", "janji", "jalan"],
          },
          {
            prompt: "Kalau masuk angin, banyak orang memakai minyak kayu ___.",
            answer: "putih",
            options: ["putih", "pedas", "panas"],
          },
          {
            prompt: "Badan saya ___ setelah perjalanan jauh. (đau mỏi)",
            answer: "pegal",
            options: ["pegal", "pagi", "pasar"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi bị trúng gió/cảm gió.", answer: "Saya masuk angin." },
          { prompt: "Làm ơn thoa dầu lên lưng tôi.", answer: "Tolong oleskan minyak di punggung saya." },
          { prompt: "Tốt nhất nên đi khám bác sĩ.", answer: "Sebaiknya periksa ke dokter." },
        ],
      },
    ],
  },
];

export default traditionalHealthJamuLessons;
