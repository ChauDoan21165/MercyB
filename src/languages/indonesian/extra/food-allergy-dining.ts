// src/languages/indonesian/extra/food-allergy-dining.ts
//
// Indonesian food-allergy dining pack for Vietnamese learners.
// Covers: alergi makanan, kacang, seafood, pedas, tanpa MSG, tanya bahan,
// reaksi alergi, and aman dimakan. Vietnamese-first with English companions,
// following the established Indonesian extra lesson shape.

type LessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

type DialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields (fill_blank, matching, translation) vary.
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
};

export const foodAllergyDiningLessons: IndonesianLesson[] = [
  {
    id: "indonesian_food_allergy_ordering",
    level: "A2",
    category: "food",
    title_vi: "Gọi món khi bị dị ứng thực phẩm",
    title_en: "Ordering food with allergies",
    sentences: [
      {
        en: "Maaf, saya punya alergi makanan.",
        vi: "Xin lỗi, tôi bị dị ứng thực phẩm.",
        pronunciation_focus: [
          "alergi makanan → a-LER-gi ma-KA-nan, dị ứng thực phẩm",
          "punya alergi → có/bị dị ứng; cách nói tự nhiên trong quán ăn",
          "maaf → mở lời lịch sự trước khi yêu cầu điều chỉnh món",
        ],
        pronunciation_focus_en: [
          "alergi makanan → 'a-LER-gee ma-KA-nan' — food allergy",
          "punya alergi → have an allergy; natural in restaurants",
          "maaf → polite opener before asking for a food change",
        ],
      },
      {
        en: "Saya alergi kacang, jadi tolong jangan pakai kacang.",
        vi: "Tôi dị ứng đậu phộng/các loại hạt, nên làm ơn đừng cho hạt.",
        pronunciation_focus: [
          "kacang → KA-chang, có thể là đậu phộng hoặc các loại hạt tùy ngữ cảnh",
          "jadi → vì vậy/nên; nối lý do với yêu cầu",
          "jangan pakai → đừng cho/dùng; khung gọi món rất quan trọng",
        ],
        pronunciation_focus_en: [
          "kacang → 'KA-chang' — peanut or nuts/beans depending on context",
          "jadi → so/therefore; links reason to request",
          "jangan pakai → don't use/add; key ordering frame",
        ],
      },
      {
        en: "Apakah menu ini mengandung seafood?",
        vi: "Món này có chứa hải sản không?",
        pronunciation_focus: [
          "apakah → a-PA-kah, mở câu hỏi có/không lịch sự",
          "mengandung → me-NGAN-dung, có chứa/thành phần có",
          "seafood → SI-fud, từ mượn phổ biến; cũng nói 'makanan laut'",
        ],
        pronunciation_focus_en: [
          "apakah → 'a-PA-kah' — polite yes/no opener",
          "mengandung → 'me-NGAN-doong' — contains",
          "seafood → 'SEE-food', common loanword; also 'makanan laut'",
        ],
      },
      {
        en: "Bisa dibuat tidak pedas dan tanpa MSG?",
        vi: "Có thể làm không cay và không MSG không?",
        pronunciation_focus: [
          "bisa dibuat → có thể được làm; bị động di- trong 'dibuat'",
          "tidak pedas → không cay; khác 'sedikit pedas' = hơi cay",
          "tanpa MSG → không có MSG/bột ngọt; tanpa = không có/không dùng",
        ],
        pronunciation_focus_en: [
          "bisa dibuat → can be made; passive di- in 'dibuat'",
          "tidak pedas → not spicy; different from 'sedikit pedas' = mildly spicy",
          "tanpa MSG → without MSG; tanpa = without",
        ],
      },
      {
        en: "Tolong tanya bahan masakannya dulu ke dapur.",
        vi: "Làm ơn hỏi nguyên liệu món ăn với bếp trước.",
        pronunciation_focus: [
          "tanya bahan → hỏi nguyên liệu/thành phần",
          "masakannya → món ăn đó; -nya = của nó/món đó",
          "ke dapur → tới/bên bếp; ke = hướng/đến",
        ],
        pronunciation_focus_en: [
          "tanya bahan → ask about ingredients",
          "masakannya → that dish/the cooking; -nya = its/the",
          "ke dapur → to the kitchen; ke = direction/to",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, nhiều món dùng kacang, sambal, terasi (mắm tôm), seafood, santan, và penyedap/MSG. Ở warung nhỏ, nhân viên có thể không biết chi tiết thành phần, nên nếu dị ứng nặng hãy nói rõ 'alergi berat' và hỏi bếp kiểm tra. 'Tanpa MSG' được hiểu rộng rãi, nhưng một số bumbu jadi hoặc saus vẫn có penyedap. Với dị ứng nguy hiểm, chọn món đơn giản và tránh bếp dễ nhiễm chéo.",
    cultural_notes_en:
      "In Indonesia, many dishes use peanuts/nuts, sambal, terasi (shrimp paste), seafood, coconut milk, and seasoning/MSG. At small warung, staff may not know every ingredient, so if the allergy is serious say 'alergi berat' and ask the kitchen to check. 'Tanpa MSG' is widely understood, but some premade spice mixes or sauces may still contain seasoning. For dangerous allergies, choose simple dishes and avoid kitchens with likely cross-contact.",
    tip_advice_vi:
      "Mẹo cho người Việt: 'tidak pedas' = không cay, 'tanpa...' = không có/không dùng thành phần. 'Jangan pakai kacang' là câu dặn rất trực tiếp và tự nhiên. Khi hỏi thành phần, dùng 'mengandung' cho 'có chứa', lịch sự hơn chỉ hỏi 'ada kacang?'.",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'tidak pedas' = not spicy, 'tanpa...' = without an ingredient. 'Jangan pakai kacang' is direct and natural. To ask about ingredients, use 'mengandung' for 'contains'; it is clearer than only asking 'ada kacang?'.",
    vocabulary: [
      {
        cell_id: "5a469db3-bb0d-470e-bda4-93fe54409f0f",
        word: "alergi makanan",
        en: "food allergy",
        vi: "dị ứng thực phẩm",
        pos: "noun phrase",
        pronunciation_vi: "a-LER-gi ma-KA-nan",
        pronunciation_en: "a-LER-gee ma-KA-nan",
      },
      {
        cell_id: "764b6d2e-e88c-45fc-9e30-5b0cc0cafaa9",
        word: "kacang",
        en: "peanut / nuts / beans",
        vi: "đậu phộng / hạt / đậu",
        pos: "noun",
        pronunciation_vi: "KA-chang",
        pronunciation_en: "KA-chang",
      },
      {
        cell_id: "7963eb92-ca39-4e81-99c5-ad76cc29d966",
        word: "seafood",
        en: "seafood",
        vi: "hải sản",
        pos: "noun",
        pronunciation_vi: "SI-fud",
        pronunciation_en: "SEE-food",
      },
      {
        cell_id: "096a3e6c-724c-4d75-83e6-7bb588fe9a01",
        word: "pedas",
        en: "spicy",
        vi: "cay",
        pos: "adjective",
        pronunciation_vi: "pe-DAS",
        pronunciation_en: "pe-DAS",
      },
      {
        cell_id: "ce458dc9-ea05-4850-829d-03d3ac84b2c7",
        word: "tanpa MSG",
        en: "without MSG",
        vi: "không MSG / không bột ngọt",
        pos: "phrase",
        pronunciation_vi: "TAN-pa em-es-gi",
        pronunciation_en: "TAN-pa em-ess-gee",
      },
      {
        cell_id: "7f275db0-db72-4ef1-9857-e86a66adc16a",
        word: "mengandung",
        en: "to contain",
        vi: "có chứa",
        pos: "verb",
        pronunciation_vi: "me-NGAN-dung",
        pronunciation_en: "me-NGAN-doong",
      },
      {
        cell_id: "537dcc2a-24d0-42ee-8bb2-f67b08a4216d",
        word: "bahan",
        en: "ingredient / material",
        vi: "nguyên liệu / thành phần",
        pos: "noun",
        pronunciation_vi: "BA-han",
        pronunciation_en: "BA-han",
      },
    ],
    dialogue: [
      {
        cell_id: "a2713044-add8-4652-9c52-feab9f8a1b65",
        speaker: "Tamu",
        text: "Maaf, saya punya alergi kacang. Menu ini mengandung kacang?",
        vi: "Xin lỗi, tôi bị dị ứng hạt. Món này có chứa hạt không?",
        en: "Excuse me, I have a nut allergy. Does this dish contain nuts?",
      },
      {
        cell_id: "d4ed71da-d900-41cf-a58d-aadc145a4b0a",
        speaker: "Pelayan",
        text: "Saya cek dulu ke dapur, ya.",
        vi: "Tôi kiểm tra với bếp trước nhé.",
        en: "I will check with the kitchen first.",
      },
      {
        cell_id: "7c52afab-6ecf-4a70-9018-a0614a29d111",
        speaker: "Tamu",
        text: "Tolong juga dibuat tidak pedas dan tanpa MSG.",
        vi: "Làm ơn cũng làm không cay và không MSG.",
        en: "Please also make it not spicy and without MSG.",
      },
      {
        cell_id: "b2f31a95-c7a7-4725-aa71-9a528a8fff7e",
        speaker: "Pelayan",
        text: "Baik. Kalau tidak aman, kami sarankan menu lain.",
        vi: "Vâng. Nếu không an toàn, chúng tôi đề xuất món khác.",
        en: "Okay. If it is not safe, we will suggest another dish.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ dị ứng/thành phần còn thiếu:",
        instruction_en: "Fill in the missing allergy/ingredient word:",
        items: [
          {
            prompt: "Saya punya alergi ___. (thực phẩm)",
            answer: "makanan",
            options: ["makanan", "minuman", "malam"],
          },
          {
            prompt: "Apakah menu ini ___ seafood? (có chứa)",
            answer: "mengandung",
            options: ["mengandung", "mengantar", "mengganti"],
          },
          {
            prompt: "Bisa dibuat tanpa ___? (MSG)",
            answer: "MSG",
            options: ["MSG", "SIM", "KTP"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "kacang", answer: "đậu phộng / hạt" },
          { prompt: "seafood", answer: "hải sản" },
          { prompt: "pedas", answer: "cay" },
          { prompt: "bahan", answer: "nguyên liệu" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi bị dị ứng thực phẩm.", answer: "Saya punya alergi makanan." },
          { prompt: "Món này có chứa hải sản không?", answer: "Apakah menu ini mengandung seafood?" },
          { prompt: "Có thể làm không cay và không MSG không?", answer: "Bisa dibuat tidak pedas dan tanpa MSG?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_food_allergy_reaction_safety",
    level: "B1",
    category: "food",
    title_vi: "Phản ứng dị ứng và hỏi món có an toàn không",
    title_en: "Allergic reactions and asking if food is safe",
    sentences: [
      {
        en: "Kalau saya makan seafood, saya bisa sesak napas.",
        vi: "Nếu tôi ăn hải sản, tôi có thể bị khó thở.",
        pronunciation_focus: [
          "kalau saya makan → nếu tôi ăn",
          "sesak napas → khó thở; cụm khẩn cấp cần nhớ",
          "bisa → có thể; ở đây nói nguy cơ phản ứng",
        ],
        pronunciation_focus_en: [
          "kalau saya makan → if I eat",
          "sesak napas → shortness of breath; key emergency phrase",
          "bisa → can/may; here it describes reaction risk",
        ],
      },
      {
        en: "Reaksi alergi saya biasanya gatal dan bengkak.",
        vi: "Phản ứng dị ứng của tôi thường là ngứa và sưng.",
        pronunciation_focus: [
          "reaksi alergi → phản ứng dị ứng",
          "biasanya → thường/thông thường",
          "gatal dan bengkak → ngứa và sưng",
        ],
        pronunciation_focus_en: [
          "reaksi alergi → allergic reaction",
          "biasanya → usually",
          "gatal dan bengkak → itchy and swollen",
        ],
      },
      {
        en: "Apakah makanan ini aman dimakan untuk orang yang alergi kacang?",
        vi: "Món này có an toàn để ăn cho người dị ứng hạt không?",
        pronunciation_focus: [
          "aman dimakan → an toàn để ăn; dimakan = được ăn/bị ăn",
          "untuk orang yang alergi kacang → cho người dị ứng hạt",
          "L1 note: câu dài nhưng trật tự giống tiếng Việt: món này + an toàn + cho người...",
        ],
        pronunciation_focus_en: [
          "aman dimakan → safe to eat; dimakan = eaten",
          "untuk orang yang alergi kacang → for someone allergic to nuts",
          "VN-speaker note: long sentence, but the order is close to Vietnamese: this food + safe + for someone...",
        ],
      },
      {
        en: "Tolong jangan pakai saus yang sama dengan seafood.",
        vi: "Làm ơn đừng dùng cùng loại sốt với hải sản.",
        pronunciation_focus: [
          "saus yang sama → cùng loại sốt/nước chấm",
          "dengan seafood → với hải sản",
          "jangan pakai → đừng dùng; dùng để giảm nguy cơ nhiễm chéo",
        ],
        pronunciation_focus_en: [
          "saus yang sama → the same sauce",
          "dengan seafood → with seafood",
          "jangan pakai → don't use; useful to reduce cross-contact risk",
        ],
      },
      {
        en: "Kalau tidak yakin, saya pesan nasi putih dan telur saja.",
        vi: "Nếu không chắc, tôi chỉ gọi cơm trắng và trứng thôi.",
        pronunciation_focus: [
          "tidak yakin → không chắc",
          "nasi putih → cơm trắng",
          "saja → thôi/chỉ; làm lựa chọn đơn giản hơn",
        ],
        pronunciation_focus_en: [
          "tidak yakin → not sure",
          "nasi putih → plain white rice",
          "saja → only/just; simplifies the choice",
        ],
      },
    ],
    cultural_notes_vi:
      "Khái niệm dị ứng nặng và nhiễm chéo có thể chưa được xử lý đồng đều ở mọi warung. Nhà hàng lớn thường hiểu 'alergi', 'tanpa kacang', 'tanpa seafood', nhưng quán nhỏ có thể dùng chung minyak, wajan, saus, hoặc sendok. Nếu phản ứng dị ứng của bạn nguy hiểm, hãy nói 'alergi berat' và chọn món đơn giản; nếu thấy sesak napas hoặc bengkak parah, cần tìm bantuan medis ngay.",
    cultural_notes_en:
      "Severe allergy and cross-contact practices may not be handled consistently at every warung. Larger restaurants usually understand 'alergi', 'tanpa kacang', 'tanpa seafood', but small stalls may share oil, pans, sauces, or spoons. If your allergic reaction can be dangerous, say 'alergi berat' and choose simple food; if there is shortness of breath or severe swelling, seek medical help immediately.",
    tip_advice_vi:
      "Mẹo cho người Việt: 'aman dimakan' là câu hỏi then chốt, nghĩa là 'an toàn để ăn'. 'Tidak yakin' rất hữu ích khi nhân viên không chắc thành phần. Với phản ứng, học các từ cụ thể: 'gatal' (ngứa), 'bengkak' (sưng), 'sesak napas' (khó thở).",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'aman dimakan' is the key phrase, meaning 'safe to eat'. 'Tidak yakin' is useful when staff are unsure about ingredients. For reactions, learn concrete words: 'gatal' (itchy), 'bengkak' (swollen), 'sesak napas' (shortness of breath).",
    vocabulary: [
      {
        cell_id: "e0cc851e-13ab-4607-8334-fe53e52e3bef",
        word: "reaksi alergi",
        en: "allergic reaction",
        vi: "phản ứng dị ứng",
        pos: "noun phrase",
        pronunciation_vi: "re-AK-si a-LER-gi",
        pronunciation_en: "re-AK-see a-LER-gee",
      },
      {
        cell_id: "4cd975ea-af1b-4464-8466-56f456c9c26c",
        word: "aman dimakan",
        en: "safe to eat",
        vi: "an toàn để ăn",
        pos: "phrase",
        pronunciation_vi: "A-man di-MA-kan",
        pronunciation_en: "A-man dee-MA-kan",
      },
      {
        cell_id: "28e4a4f2-9e3d-4242-a85f-b899152bdb17",
        word: "gatal",
        en: "itchy",
        vi: "ngứa",
        pos: "adjective",
        pronunciation_vi: "GA-tal",
        pronunciation_en: "GA-tal",
      },
      {
        cell_id: "5af8c2a0-57d6-4dfe-8a5a-6aff95e96894",
        word: "bengkak",
        en: "swollen",
        vi: "sưng",
        pos: "adjective",
        pronunciation_vi: "BENG-kak",
        pronunciation_en: "BENG-kak",
      },
      {
        cell_id: "2fc08975-ebc0-4263-ab8c-5953cc3533b6",
        word: "sesak napas",
        en: "shortness of breath",
        vi: "khó thở",
        pos: "noun phrase",
        pronunciation_vi: "SE-sak NA-pas",
        pronunciation_en: "SE-sak NA-pas",
      },
      {
        cell_id: "dd7df475-f99c-42b9-8e34-9fc712908b16",
        word: "tidak yakin",
        en: "not sure",
        vi: "không chắc",
        pos: "phrase",
        pronunciation_vi: "TI-dak YA-kin",
        pronunciation_en: "TEE-dak YA-kin",
      },
      {
        cell_id: "3f625670-98e8-4bc7-a668-a2e006811bac",
        word: "alergi berat",
        en: "severe allergy",
        vi: "dị ứng nặng",
        pos: "noun phrase",
        pronunciation_vi: "a-LER-gi BE-rat",
        pronunciation_en: "a-LER-gee BE-rat",
      },
    ],
    dialogue: [
      {
        cell_id: "ca5bf4de-06fc-4ace-b660-d91468eeae86",
        speaker: "Tamu",
        text: "Saya alergi seafood. Kalau makan seafood, saya bisa sesak napas.",
        vi: "Tôi dị ứng hải sản. Nếu ăn hải sản, tôi có thể khó thở.",
        en: "I am allergic to seafood. If I eat seafood, I may have shortness of breath.",
      },
      {
        cell_id: "a8e53495-c42c-4d4c-a3a9-c47a4d07612a",
        speaker: "Pelayan",
        text: "Baik, saya tanya dulu ke dapur apakah menu ini aman dimakan.",
        vi: "Vâng, tôi hỏi bếp trước xem món này có an toàn để ăn không.",
        en: "Okay, I will ask the kitchen first whether this dish is safe to eat.",
      },
      {
        cell_id: "dd2f5e22-7fdd-4a5b-a39a-147df5f37140",
        speaker: "Tamu",
        text: "Tolong jangan pakai saus yang sama dengan seafood.",
        vi: "Làm ơn đừng dùng cùng loại sốt với hải sản.",
        en: "Please do not use the same sauce as seafood.",
      },
      {
        cell_id: "68713569-a5b4-40d2-a2a1-48388eadea9b",
        speaker: "Pelayan",
        text: "Kalau tidak yakin, kami bisa buat nasi putih dan telur saja.",
        vi: "Nếu không chắc, chúng tôi có thể làm cơm trắng và trứng thôi.",
        en: "If we are not sure, we can make plain rice and eggs only.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ phản ứng dị ứng còn thiếu:",
        instruction_en: "Fill in the missing allergy-reaction word:",
        items: [
          {
            prompt: "Reaksi alergi saya biasanya ___ dan bengkak. (ngứa)",
            answer: "gatal",
            options: ["gatal", "gagal", "garam"],
          },
          {
            prompt: "Kalau makan seafood, saya bisa sesak ___. (thở)",
            answer: "napas",
            options: ["napas", "nasi", "nama"],
          },
          {
            prompt: "Apakah makanan ini ___ dimakan? (an toàn)",
            answer: "aman",
            options: ["aman", "asam", "asin"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "reaksi alergi", answer: "phản ứng dị ứng" },
          { prompt: "bengkak", answer: "sưng" },
          { prompt: "sesak napas", answer: "khó thở" },
          { prompt: "tidak yakin", answer: "không chắc" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Nếu tôi ăn hải sản, tôi có thể bị khó thở.", answer: "Kalau saya makan seafood, saya bisa sesak napas." },
          { prompt: "Món này có an toàn để ăn cho người dị ứng hạt không?", answer: "Apakah makanan ini aman dimakan untuk orang yang alergi kacang?" },
          { prompt: "Nếu không chắc, tôi chỉ gọi cơm trắng và trứng thôi.", answer: "Kalau tidak yakin, saya pesan nasi putih dan telur saja." },
        ],
      },
    ],
  },
];
