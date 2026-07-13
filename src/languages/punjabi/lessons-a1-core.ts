// src/languages/punjabi/lessons-a1-core.ts
//
// Punjabi CEFR A1 core lesson batch for Vietnamese-speaking and
// English-speaking learners.
//
// Gurmukhi is the primary script. Romanization is practical learner support,
// not a pronunciation-scoring standard. Shahmukhi is mentioned only for script
// awareness because this batch is not a Shahmukhi course.
//
// Native-speaker review is deferred; this file does not claim native review.

export type PunjabiCategoryId =
  | "greetings"
  | "names"
  | "family"
  | "numbers"
  | "food_drink"
  | "shopping"
  | "transport"
  | "simple_questions"
  | "yes_no"
  | "thanks_apology"
  | "polite_basics"
  | "pronouns_copula";

export type PunjabiCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type PunjabiLessonSentence = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type PunjabiVocabEntry = {
  cell_id?: string;
  word: string;
  romanization: string;
  vi: string;
  en: string;
  pos: string;
};

export type PunjabiDialogueLine = {
  cell_id?: string;
  speaker: string;
  pa: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiL1Note = {
  audience: "vi" | "en" | "both";
  mistake: string;
  fix_vi: string;
  fix_en: string;
};

export type PunjabiExercise = Record<string, unknown>;

export type PunjabiLesson = {
  id: string;
  level: PunjabiCefrLevel;
  category: PunjabiCategoryId;
  title_vi: string;
  title_en: string;
  sentences: PunjabiLessonSentence[];
  cultural_notes_vi?: string;
  cultural_notes_en?: string;
  tip_advice_vi?: string;
  tip_advice_en?: string;
  l1_notes: PunjabiL1Note[];
  vocabulary: PunjabiVocabEntry[];
  dialogue: PunjabiDialogueLine[];
  exercises: PunjabiExercise[];
};

export const lessons: PunjabiLesson[] = [
  {
    id: "punjabi_a1_greetings",
    level: "A1",
    category: "greetings",
    title_vi: "Chào hỏi cơ bản",
    title_en: "Basic greetings",
    sentences: [
      {
        pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
        romanization: "sat sri akal",
        vi: "Xin chào / chào trang trọng.",
        en: "Hello / respectful greeting.",
        pronunciation_focus: ["ਸਤ thường nghe như 'sat'; giữ âm t cuối nhẹ, không thêm nguyên âm sau t."],
        pronunciation_focus_en: ["Keep the final t in sat light; do not add an extra vowel after it."],
      },
      {
        pa: "ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?",
        romanization: "tusi kive ho?",
        vi: "Bạn khỏe không? / Anh chị thế nào?",
        en: "How are you?",
        pronunciation_focus: ["ਤੁਸੀਂ là dạng lịch sự/số nhiều; đọc gần 'tu-si', không phải 'tu-sin'."],
        pronunciation_focus_en: ["ਤੁਸੀਂ is polite/plural you; the nasal mark is light, not a full n."],
      },
      {
        pa: "ਮੈਂ ਠੀਕ ਹਾਂ।",
        romanization: "main thik han",
        vi: "Tôi khỏe / tôi ổn.",
        en: "I am fine.",
        pronunciation_focus: ["ਠ là phụ âm bật hơi; người Việt đừng đọc như t thường."],
        pronunciation_focus_en: ["ਠ is aspirated; English speakers should make the puff audible."],
      },
      {
        pa: "ਫਿਰ ਮਿਲਾਂਗੇ।",
        romanization: "phir milange",
        vi: "Hẹn gặp lại.",
        en: "See you again.",
        pronunciation_focus: ["ਫਿਰ có ph bật hơi nhẹ; không kéo thành âm f quá mạnh."],
        pronunciation_focus_en: ["ਫ is closer to aspirated p in many learner contexts; avoid overdoing English f."],
      },
    ],
    cultural_notes_vi: "Gurmukhi là chữ chính trong khóa này. Shahmukhi cũng dùng cho Punjabi ở một số cộng đồng, nhưng bài này chỉ giới thiệu để nhận biết, không dạy như một hệ chữ đầy đủ.",
    cultural_notes_en: "Gurmukhi is primary in this course. Shahmukhi is also used for Punjabi in some communities, but here it is awareness only, not a full script track.",
    tip_advice_vi: "Ở A1, học theo cụm cố định trước: chào, hỏi thăm, trả lời ngắn.",
    tip_advice_en: "At A1, learn fixed chunks first: greet, ask, answer briefly.",
    l1_notes: [
      {
        audience: "vi",
        mistake: "Đọc ਸਭ/ਸਤ với nguyên âm phụ ở cuối: 'sata'.",
        fix_vi: "Punjabi có nhiều phụ âm cuối ngắn. Dừng ở t trong ਸਤ.",
        fix_en: "Vietnamese speakers may add a final vowel. Stop cleanly on the final t in ਸਤ.",
      },
      {
        audience: "en",
        mistake: "Using ਤੂੰ with new adults because English has only one 'you'.",
        fix_vi: "Với người mới gặp, dùng ਤੁਸੀਂ lịch sự hơn ਤੂੰ.",
        fix_en: "Use ਤੁਸੀਂ for polite 'you' with new adults; ਤੂੰ is intimate or downward in status.",
      },
    ],
    vocabulary: [
      { cell_id: "4fd48d4d-9d86-4816-865f-2a41b9f1ed43", word: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", romanization: "sat sri akal", vi: "xin chào", en: "hello", pos: "phrase" },
      { cell_id: "25708d2e-5bf5-4a8b-9419-5c49cdfa933a", word: "ਕਿਵੇਂ", romanization: "kive", vi: "như thế nào", en: "how", pos: "adverb" },
      { cell_id: "aa95011e-a829-413d-89e1-8e1d97b41e40", word: "ਠੀਕ", romanization: "thik", vi: "ổn, khỏe", en: "fine, okay", pos: "adjective" },
      { cell_id: "b448ee6e-b279-4679-8d93-e59fd9593455", word: "ਫਿਰ", romanization: "phir", vi: "lại, sau đó", en: "again, then", pos: "adverb" },
      { cell_id: "382ab3f2-9ac4-4296-a428-f23afcd2982e", word: "ਮਿਲਾਂਗੇ", romanization: "milange", vi: "sẽ gặp", en: "will meet", pos: "verb" },
    ],
    dialogue: [
      { cell_id: "4a1341a4-3c81-4cc2-b867-636ba5cc2d96", speaker: "A", pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?", romanization: "sat sri akal. tusi kive ho?", vi: "Xin chào. Bạn khỏe không?", en: "Hello. How are you?" },
      { cell_id: "67292c73-9a8a-4192-94c5-8b7e98870a39", speaker: "B", pa: "ਮੈਂ ਠੀਕ ਹਾਂ। ਧੰਨਵਾਦ।", romanization: "main thik han. dhanvad.", vi: "Tôi khỏe. Cảm ơn.", en: "I am fine. Thank you." },
      { cell_id: "291c0497-0721-48ba-b5d0-d88dd473f727", speaker: "A", pa: "ਫਿਰ ਮਿਲਾਂਗੇ।", romanization: "phir milange.", vi: "Hẹn gặp lại.", en: "See you again." },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang Punjabi Gurmukhi.",
        instruction_en: "Translate into Punjabi Gurmukhi.",
        items: [
          { vi: "Xin chào.", en: "Hello.", answer: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।" },
          { vi: "Tôi khỏe.", en: "I am fine.", answer: "ਮੈਂ ਠੀਕ ਹਾਂ।" },
        ],
      },
    ],
  },
  {
    id: "punjabi_a1_names",
    level: "A1",
    category: "names",
    title_vi: "Tên và giới thiệu",
    title_en: "Names and introductions",
    sentences: [
      {
        pa: "ਮੇਰਾ ਨਾਮ ਲਾਨ ਹੈ।",
        romanization: "mera nam Lan hai",
        vi: "Tên tôi là Lan.",
        en: "My name is Lan.",
        pronunciation_focus: ["ਮੇਰਾ dùng cho 'của tôi' với danh từ giống đực số ít như ਨਾਮ."],
        pronunciation_focus_en: ["ਮੇਰਾ agrees with masculine singular ਨਾਮ; memorize the whole chunk ਮੇਰਾ ਨਾਮ."],
      },
      {
        pa: "ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
        romanization: "tuhada nam ki hai?",
        vi: "Tên bạn là gì?",
        en: "What is your name?",
        pronunciation_focus: ["ਕੀ là 'gì/cái gì'; đặt trước ਹੈ trong mẫu này."],
        pronunciation_focus_en: ["ਕੀ means what; in this pattern it comes before ਹੈ."],
      },
      {
        pa: "ਮੈਂ ਵੀਅਤਨਾਮ ਤੋਂ ਹਾਂ।",
        romanization: "main Vianam ton han",
        vi: "Tôi đến từ Việt Nam.",
        en: "I am from Vietnam.",
        pronunciation_focus: ["ਤੋਂ nghĩa là 'từ'; có nguyên âm mũi, đọc nhẹ qua mũi."],
        pronunciation_focus_en: ["ਤੋਂ means from; keep the nasal vowel light."],
      },
      {
        pa: "ਤੁਹਾਨੂੰ ਮਿਲ ਕੇ ਖੁਸ਼ੀ ਹੋਈ।",
        romanization: "tuhanu mil ke khushi hoi",
        vi: "Rất vui được gặp bạn.",
        en: "Nice to meet you.",
        pronunciation_focus: ["ਖੁਸ਼ੀ có kh bật hơi; đừng đọc như 'ku-si'."],
        pronunciation_focus_en: ["Make the kh in ਖੁਸ਼ੀ audible, not plain k."],
      },
    ],
    l1_notes: [
      {
        audience: "both",
        mistake: "Putting ਕੀ at the very end: 'ਤੁਹਾਡਾ ਨਾਮ ਹੈ ਕੀ?'",
        fix_vi: "Ở mẫu A1 tự nhiên, dùng: ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
        fix_en: "For the basic A1 pattern, use: ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
      },
      {
        audience: "vi",
        mistake: "Bỏ ਹੈ vì tiếng Việt không cần 'là' trong một số câu.",
        fix_vi: "Punjabi cần ਹੈ trong câu 'X là Y': ਮੇਰਾ ਨਾਮ ਲਾਨ ਹੈ।",
        fix_en: "Vietnamese speakers may drop 'is'. Punjabi needs ਹੈ in this sentence.",
      },
    ],
    vocabulary: [
      { cell_id: "0a090c20-9fb6-4c6d-9b3d-509f3ffdc5eb", word: "ਨਾਮ", romanization: "nam", vi: "tên", en: "name", pos: "noun" },
      { cell_id: "c4adde3b-6131-48b7-90af-b521cfeada8f", word: "ਮੇਰਾ", romanization: "mera", vi: "của tôi", en: "my", pos: "possessive" },
      { cell_id: "248de169-12ad-4140-b137-05a6fd39e3bf", word: "ਤੁਹਾਡਾ", romanization: "tuhada", vi: "của bạn", en: "your", pos: "possessive" },
      { cell_id: "79ef6a68-3527-4e08-a3dd-d014a4862497", word: "ਕੀ", romanization: "ki", vi: "gì", en: "what", pos: "question word" },
      { cell_id: "37b2e9a9-8501-4759-ad75-9eb3b463c629", word: "ਤੋਂ", romanization: "ton", vi: "từ", en: "from", pos: "postposition" },
    ],
    dialogue: [
      { cell_id: "6c3e7464-c857-4124-8303-c9684be7f0f1", speaker: "A", pa: "ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?", romanization: "tuhada nam ki hai?", vi: "Tên bạn là gì?", en: "What is your name?" },
      { cell_id: "268c6612-cce1-4fba-8173-c0510a04025f", speaker: "B", pa: "ਮੇਰਾ ਨਾਮ ਲਾਨ ਹੈ।", romanization: "mera nam Lan hai.", vi: "Tên tôi là Lan.", en: "My name is Lan." },
      { cell_id: "4caa76bb-0bbd-407b-af9e-cad7f1a5e830", speaker: "A", pa: "ਤੁਹਾਨੂੰ ਮਿਲ ਕੇ ਖੁਸ਼ੀ ਹੋਈ।", romanization: "tuhanu mil ke khushi hoi.", vi: "Rất vui được gặp bạn.", en: "Nice to meet you." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu.",
        instruction_en: "Fill in the missing word.",
        items: [{ prompt: "ਮੇਰਾ ___ ਲਾਨ ਹੈ।", answer: "ਨਾਮ" }],
      },
    ],
  },
  {
    id: "punjabi_a1_pronouns_copula",
    level: "A1",
    category: "pronouns_copula",
    title_vi: "Đại từ và 'là/ở'",
    title_en: "Pronouns and 'be'",
    sentences: [
      {
        pa: "ਮੈਂ ਵਿਦਿਆਰਥੀ ਹਾਂ।",
        romanization: "main vidiarthi han",
        vi: "Tôi là học sinh/sinh viên.",
        en: "I am a student.",
        pronunciation_focus: ["ਹਾਂ đi với ਮੈਂ; đây là dạng 'am' ở hiện tại."],
        pronunciation_focus_en: ["ਹਾਂ goes with ਮੈਂ; treat it as the present 'am' form."],
      },
      {
        pa: "ਤੁਸੀਂ ਅਧਿਆਪਕ ਹੋ।",
        romanization: "tusi adhiapak ho",
        vi: "Bạn là giáo viên.",
        en: "You are a teacher.",
        pronunciation_focus: ["ਹੋ đi với ਤੁਸੀਂ; không dùng ਹੈ ở đây."],
        pronunciation_focus_en: ["ਹੋ goes with ਤੁਸੀਂ; do not use ਹੈ in this pattern."],
      },
      {
        pa: "ਉਹ ਘਰ ਵਿੱਚ ਹੈ।",
        romanization: "oh ghar vich hai",
        vi: "Anh ấy/cô ấy ở trong nhà.",
        en: "He/she is in the house.",
        pronunciation_focus: ["ਉਹ có thể là he/she/that; ngữ cảnh quyết định."],
        pronunciation_focus_en: ["ਉਹ can mean he, she, or that; context decides."],
      },
      {
        pa: "ਅਸੀਂ ਦੋਸਤ ਹਾਂ।",
        romanization: "asi dost han",
        vi: "Chúng tôi là bạn bè.",
        en: "We are friends.",
        pronunciation_focus: ["ਅਸੀਂ là 'chúng tôi/chúng ta'; có âm mũi nhẹ ở cuối."],
        pronunciation_focus_en: ["ਅਸੀਂ is we; keep the final nasalization light."],
      },
    ],
    l1_notes: [
      {
        audience: "en",
        mistake: "Using one 'is' form everywhere: ਮੈਂ ਵਿਦਿਆਰਥੀ ਹੈ।",
        fix_vi: "Punjabi đổi dạng theo chủ ngữ: ਮੈਂ ... ਹਾਂ, ਤੁਸੀਂ ... ਹੋ, ਉਹ ... ਹੈ.",
        fix_en: "Punjabi changes the copula by subject: ਮੈਂ ... ਹਾਂ, ਤੁਸੀਂ ... ਹੋ, ਉਹ ... ਹੈ.",
      },
      {
        audience: "vi",
        mistake: "Dịch 'ở trong' thành một từ trước danh từ.",
        fix_vi: "Punjabi dùng postposition sau danh từ: ਘਰ ਵਿੱਚ = trong nhà.",
        fix_en: "Punjabi uses postpositions after nouns: ਘਰ ਵਿੱਚ = in the house.",
      },
    ],
    vocabulary: [
      { cell_id: "423b89f6-4cf1-412b-9eb3-00ca87df6a18", word: "ਮੈਂ", romanization: "main", vi: "tôi", en: "I", pos: "pronoun" },
      { cell_id: "868384a7-e4ca-4d40-9051-41129c123f77", word: "ਤੁਸੀਂ", romanization: "tusi", vi: "bạn/anh chị", en: "you", pos: "pronoun" },
      { cell_id: "82ae5769-764a-4285-bae3-e05cfdbb89c3", word: "ਉਹ", romanization: "oh", vi: "anh ấy/cô ấy/đó", en: "he/she/that", pos: "pronoun" },
      { cell_id: "1b22f88e-fea9-4b74-ae81-72f8a4136dd4", word: "ਅਸੀਂ", romanization: "asi", vi: "chúng tôi", en: "we", pos: "pronoun" },
      { cell_id: "8d8a39c1-6906-4f08-9605-f68a1ccb73fa", word: "ਵਿੱਚ", romanization: "vich", vi: "trong", en: "in", pos: "postposition" },
    ],
    dialogue: [
      { cell_id: "b29d8227-e12c-478c-b33a-9ed1ad697a13", speaker: "A", pa: "ਤੁਸੀਂ ਵਿਦਿਆਰਥੀ ਹੋ?", romanization: "tusi vidiarthi ho?", vi: "Bạn là sinh viên à?", en: "Are you a student?" },
      { cell_id: "b7f83c78-34c6-443d-8356-47f50024abf2", speaker: "B", pa: "ਹਾਂ, ਮੈਂ ਵਿਦਿਆਰਥੀ ਹਾਂ।", romanization: "han, main vidiarthi han.", vi: "Vâng, tôi là sinh viên.", en: "Yes, I am a student." },
      { cell_id: "eea937fd-4c28-4419-ba82-2d7c4273c3dc", speaker: "A", pa: "ਉਹ ਅਧਿਆਪਕ ਹੈ।", romanization: "oh adhiapak hai.", vi: "Cô ấy/anh ấy là giáo viên.", en: "He/she is a teacher." },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối chủ ngữ với dạng 'be'.",
        instruction_en: "Match the subject with the 'be' form.",
        pairs: [
          { a: "ਮੈਂ", b: "ਹਾਂ" },
          { a: "ਤੁਸੀਂ", b: "ਹੋ" },
          { a: "ਉਹ", b: "ਹੈ" },
        ],
      },
    ],
  },
  {
    id: "punjabi_a1_family",
    level: "A1",
    category: "family",
    title_vi: "Gia đình",
    title_en: "Family",
    sentences: [
      {
        pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ।",
        romanization: "ih meri ma hai",
        vi: "Đây là mẹ tôi.",
        en: "This is my mother.",
        pronunciation_focus: ["ਮੇਰੀ dùng với ਮਾਂ vì từ này giống cái."],
        pronunciation_focus_en: ["ਮੇਰੀ agrees with feminine ਮਾਂ; learn ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ as a chunk."],
      },
      {
        pa: "ਇਹ ਮੇਰੇ ਪਿਤਾ ਜੀ ਹਨ।",
        romanization: "ih mere pita ji han",
        vi: "Đây là bố tôi.",
        en: "This is my father.",
        pronunciation_focus: ["ਜੀ thêm sắc thái kính trọng sau tên/người thân."],
        pronunciation_focus_en: ["ਜੀ adds respect after names or family terms."],
      },
      {
        pa: "ਮੇਰਾ ਇੱਕ ਭਰਾ ਹੈ।",
        romanization: "mera ik bhra hai",
        vi: "Tôi có một anh/em trai.",
        en: "I have one brother.",
        pronunciation_focus: ["Punjabi thường nói 'my one brother is' để diễn đạt 'I have'."],
        pronunciation_focus_en: ["Punjabi often uses 'my one brother is' for 'I have a brother'."],
      },
      {
        pa: "ਮੇਰੀ ਇੱਕ ਭੈਣ ਹੈ।",
        romanization: "meri ik bhain hai",
        vi: "Tôi có một chị/em gái.",
        en: "I have one sister.",
        pronunciation_focus: ["ਭੈਣ có nguyên âm giống 'ai' ngắn; giữ âm mũi cuối nhẹ."],
        pronunciation_focus_en: ["ਭੈਣ has a short ai-like vowel plus light nasal ending."],
      },
    ],
    l1_notes: [
      {
        audience: "both",
        mistake: "Using ਮੇਰਾ for every family word.",
        fix_vi: "Tính từ sở hữu đổi theo giống/số: ਮੇਰਾ ਭਰਾ, ਮੇਰੀ ਮਾਂ, ਮੇਰੇ ਪਿਤਾ ਜੀ.",
        fix_en: "Possessives agree: ਮੇਰਾ ਭਰਾ, ਮੇਰੀ ਮਾਂ, ਮੇਰੇ ਪਿਤਾ ਜੀ.",
      },
      {
        audience: "vi",
        mistake: "Dịch trực tiếp 'tôi có' bằng một động từ 'có'.",
        fix_vi: "Mẫu tự nhiên ở A1: ਮੇਰਾ/ਮੇਰੀ ਇੱਕ ... ਹੈ.",
        fix_en: "Vietnamese speakers may look for a direct 'have'. Use ਮੇਰਾ/ਮੇਰੀ ਇੱਕ ... ਹੈ.",
      },
    ],
    vocabulary: [
      { cell_id: "5c16fc1d-838a-4bd3-949e-ddab71dca60e", word: "ਮਾਂ", romanization: "ma", vi: "mẹ", en: "mother", pos: "noun" },
      { cell_id: "d97fca86-8af2-4fa6-9c78-3151e9ca9b6c", word: "ਪਿਤਾ ਜੀ", romanization: "pita ji", vi: "bố/cha", en: "father", pos: "noun" },
      { cell_id: "d717ad1e-412f-4f6d-a2af-65a4e5cc08f1", word: "ਭਰਾ", romanization: "bhra", vi: "anh/em trai", en: "brother", pos: "noun" },
      { cell_id: "38b9f414-16d7-4ce9-b180-06c5bb843276", word: "ਭੈਣ", romanization: "bhain", vi: "chị/em gái", en: "sister", pos: "noun" },
      { cell_id: "c0d5c4d4-dd63-4eb7-bd52-802674f9b085", word: "ਪਰਿਵਾਰ", romanization: "parivar", vi: "gia đình", en: "family", pos: "noun" },
    ],
    dialogue: [
      { cell_id: "5efa5f76-0b85-4b8e-a35c-06b52b81f93b", speaker: "A", pa: "ਇਹ ਕੌਣ ਹੈ?", romanization: "ih kaun hai?", vi: "Đây là ai?", en: "Who is this?" },
      { cell_id: "c5298d7b-021c-4859-ad1a-1150dcded7f4", speaker: "B", pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ।", romanization: "ih meri ma hai.", vi: "Đây là mẹ tôi.", en: "This is my mother." },
      { cell_id: "1543efe2-7947-4baa-852f-b6956c497501", speaker: "A", pa: "ਤੁਹਾਡਾ ਪਰਿਵਾਰ ਵੱਡਾ ਹੈ?", romanization: "tuhada parivar vadda hai?", vi: "Gia đình bạn lớn không?", en: "Is your family big?" },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang Punjabi.",
        instruction_en: "Translate into Punjabi.",
        items: [{ vi: "Đây là mẹ tôi.", en: "This is my mother.", answer: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ।" }],
      },
    ],
  },
  {
    id: "punjabi_a1_numbers",
    level: "A1",
    category: "numbers",
    title_vi: "Số 0-10",
    title_en: "Numbers 0-10",
    sentences: [
      {
        pa: "ਇੱਕ, ਦੋ, ਤਿੰਨ।",
        romanization: "ik, do, tinn",
        vi: "Một, hai, ba.",
        en: "One, two, three.",
        pronunciation_focus: ["ਤਿੰਨ có âm n cuối rõ hơn tiếng Việt nhưng không thêm 'ơ'."],
        pronunciation_focus_en: ["Hold the final nn in ਤਿੰਨ briefly; do not add a vowel."],
      },
      {
        pa: "ਚਾਰ, ਪੰਜ, ਛੇ।",
        romanization: "char, panj, chhe",
        vi: "Bốn, năm, sáu.",
        en: "Four, five, six.",
        pronunciation_focus: ["ਪੰਜ kết thúc bằng j nhẹ; ਛੇ có chh bật hơi."],
        pronunciation_focus_en: ["ਪੰਜ ends with a light j; ਛੇ starts with aspirated chh."],
      },
      {
        pa: "ਸੱਤ, ਅੱਠ, ਨੌਂ, ਦਸ।",
        romanization: "satt, ath, nau, das",
        vi: "Bảy, tám, chín, mười.",
        en: "Seven, eight, nine, ten.",
        pronunciation_focus: ["ੱ báo phụ âm đôi/ngắn mạnh: ਸੱਤ, ਅੱਠ."],
        pronunciation_focus_en: ["ੱ marks a doubled or tightened consonant: ਸੱਤ, ਅੱਠ."],
      },
      {
        pa: "ਮੇਰੇ ਕੋਲ ਦੋ ਟਿਕਟਾਂ ਹਨ।",
        romanization: "mere kol do tiktan han",
        vi: "Tôi có hai vé.",
        en: "I have two tickets.",
        pronunciation_focus: ["ਮੇਰੇ ਕੋਲ = ở chỗ tôi/của tôi có; mẫu hay dùng cho 'have'."],
        pronunciation_focus_en: ["ਮੇਰੇ ਕੋਲ literally means 'with me'; it is common for 'I have'."],
      },
    ],
    l1_notes: [
      {
        audience: "en",
        mistake: "Reading ਅੱਠ as 'at' with no aspiration.",
        fix_vi: "ਅੱਠ có phụ âm bật hơi cuối; nghe gần 'ath' mạnh.",
        fix_en: "ਅੱਠ has aspiration; aim for a stronger 'ath', not plain 'at'.",
      },
      {
        audience: "vi",
        mistake: "Thêm classifier như tiếng Việt: 'hai cái vé'.",
        fix_vi: "Punjabi cơ bản thường đặt số trực tiếp trước danh từ: ਦੋ ਟਿਕਟਾਂ.",
        fix_en: "Punjabi usually puts the number directly before the noun here: ਦੋ ਟਿਕਟਾਂ.",
      },
    ],
    vocabulary: [
      { cell_id: "d4e9a0d5-c633-4a67-97d2-b452858148f0", word: "ਸਿਫਰ", romanization: "sifar", vi: "số không", en: "zero", pos: "number" },
      { cell_id: "43eadd79-6b6c-4107-82ce-3525fc7bfe01", word: "ਇੱਕ", romanization: "ik", vi: "một", en: "one", pos: "number" },
      { cell_id: "834fd419-079f-4eac-8731-75d1daba1229", word: "ਦੋ", romanization: "do", vi: "hai", en: "two", pos: "number" },
      { cell_id: "43a8ba83-0251-41e8-b724-8263914e4681", word: "ਤਿੰਨ", romanization: "tinn", vi: "ba", en: "three", pos: "number" },
      { cell_id: "43b2112a-6894-40a1-85b9-1ec5c0c983fb", word: "ਦਸ", romanization: "das", vi: "mười", en: "ten", pos: "number" },
    ],
    dialogue: [
      { cell_id: "5901a34b-8604-4a94-8d13-88e26839df0e", speaker: "A", pa: "ਕਿੰਨੇ ਟਿਕਟ?", romanization: "kinne tiket?", vi: "Bao nhiêu vé?", en: "How many tickets?" },
      { cell_id: "d7d3af17-ab86-4b8c-9e20-eb31101dcf36", speaker: "B", pa: "ਦੋ ਟਿਕਟਾਂ।", romanization: "do tiktan.", vi: "Hai vé.", en: "Two tickets." },
      { cell_id: "b3b4f927-f7f2-4a6a-82b5-05bd1416e31c", speaker: "A", pa: "ਠੀਕ ਹੈ।", romanization: "thik hai.", vi: "Được rồi.", en: "Okay." },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối số với nghĩa.",
        instruction_en: "Match the number with the meaning.",
        pairs: [
          { a: "ਇੱਕ", b: "one / một" },
          { a: "ਦੋ", b: "two / hai" },
          { a: "ਤਿੰਨ", b: "three / ba" },
        ],
      },
    ],
  },
  {
    id: "punjabi_a1_food_drink",
    level: "A1",
    category: "food_drink",
    title_vi: "Đồ ăn và đồ uống",
    title_en: "Food and drink",
    sentences: [
      {
        pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
        romanization: "mainu pani chahida hai",
        vi: "Tôi cần nước / cho tôi nước.",
        en: "I need water / I would like water.",
        pronunciation_focus: ["ਮੈਨੂੰ là 'cho tôi/đối với tôi'; dùng khi nói nhu cầu."],
        pronunciation_focus_en: ["ਮੈਨੂੰ means to/for me; use it for wants and needs."],
      },
      {
        pa: "ਮੈਨੂੰ ਚਾਹ ਪਸੰਦ ਹੈ।",
        romanization: "mainu chah pasand hai",
        vi: "Tôi thích trà.",
        en: "I like tea.",
        pronunciation_focus: ["ਪਸੰਦ ਹੈ là mẫu 'thích'; chủ thể thường đi với ਨੂੰ."],
        pronunciation_focus_en: ["ਪਸੰਦ ਹੈ is the like pattern; the experiencer often takes ਨੂੰ."],
      },
      {
        pa: "ਇਹ ਖਾਣਾ ਚੰਗਾ ਹੈ।",
        romanization: "ih khana changa hai",
        vi: "Món ăn này ngon/tốt.",
        en: "This food is good.",
        pronunciation_focus: ["ਚੰਗਾ có ch; không đọc thành s."],
        pronunciation_focus_en: ["ਚੰਗਾ begins with ch, not s or sh."],
      },
      {
        pa: "ਮਸਾਲਾ ਘੱਟ ਕਰੋ ਜੀ।",
        romanization: "masala ghatt karo ji",
        vi: "Làm ít gia vị/cay hơn giúp tôi ạ.",
        en: "Please make it less spicy.",
        pronunciation_focus: ["ਘੱਟ nghĩa là ít hơn; ਘ có hơi bật từ cổ họng nhẹ."],
        pronunciation_focus_en: ["ਘੱਟ means less; ਘ is voiced and aspirated."],
      },
    ],
    l1_notes: [
      {
        audience: "both",
        mistake: "Saying ਮੈਂ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ instead of ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ.",
        fix_vi: "Với 'cần/muốn', dùng ਮੈਨੂੰ, không dùng ਮੈਂ.",
        fix_en: "For need/want patterns, use ਮੈਨੂੰ, not ਮੈਂ.",
      },
      {
        audience: "vi",
        mistake: "Dùng 'cay' như một tính từ duy nhất cho mọi mức gia vị.",
        fix_vi: "Ở nhà hàng A1, học cụm an toàn: ਮਸਾਲਾ ਘੱਟ ਕਰੋ ਜੀ.",
        fix_en: "For restaurants, memorize the safe A1 request: ਮਸਾਲਾ ਘੱਟ ਕਰੋ ਜੀ.",
      },
    ],
    vocabulary: [
      { cell_id: "f236eb71-d2a7-48df-81a2-7967fbd3fcf9", word: "ਪਾਣੀ", romanization: "pani", vi: "nước", en: "water", pos: "noun" },
      { cell_id: "9a7d4efe-2a7e-420a-a186-0a21b364bd22", word: "ਚਾਹ", romanization: "chah", vi: "trà", en: "tea", pos: "noun" },
      { cell_id: "c8380a74-d0c5-46b4-b467-c6f09ec43692", word: "ਖਾਣਾ", romanization: "khana", vi: "đồ ăn", en: "food", pos: "noun" },
      { cell_id: "ce1d86dc-5d84-4990-9345-b24a7a0bf6bf", word: "ਚੰਗਾ", romanization: "changa", vi: "tốt, ngon", en: "good", pos: "adjective" },
      { cell_id: "9a766687-c7be-4ee7-94b1-eb3745d61bbc", word: "ਘੱਟ", romanization: "ghatt", vi: "ít hơn", en: "less", pos: "adjective/adverb" },
    ],
    dialogue: [
      { cell_id: "aff11cf0-004f-4247-a642-95efb64dde84", speaker: "A", pa: "ਤੁਹਾਨੂੰ ਕੀ ਚਾਹੀਦਾ ਹੈ?", romanization: "tuhanu ki chahida hai?", vi: "Bạn cần gì?", en: "What would you like?" },
      { cell_id: "04f5663e-488f-4c62-a75c-8e350e6e4ea9", speaker: "B", pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।", romanization: "mainu pani chahida hai.", vi: "Tôi cần nước.", en: "I would like water." },
      { cell_id: "743011bd-d3d3-435a-8f99-5f24e7aff540", speaker: "B", pa: "ਮਸਾਲਾ ਘੱਟ ਕਰੋ ਜੀ।", romanization: "masala ghatt karo ji.", vi: "Ít cay/gia vị giúp tôi ạ.", en: "Please make it less spicy." },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch câu yêu cầu lịch sự.",
        instruction_en: "Translate the polite request.",
        items: [{ vi: "Cho tôi nước.", en: "I would like water.", answer: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।" }],
      },
    ],
  },
  {
    id: "punjabi_a1_shopping",
    level: "A1",
    category: "shopping",
    title_vi: "Mua sắm cơ bản",
    title_en: "Basic shopping",
    sentences: [
      {
        pa: "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?",
        romanization: "ih kinne da hai?",
        vi: "Cái này giá bao nhiêu?",
        en: "How much is this?",
        pronunciation_focus: ["ਕਿੰਨੇ ਦਾ là cụm hỏi giá; học nguyên cụm."],
        pronunciation_focus_en: ["ਕਿੰਨੇ ਦਾ is the price question chunk; memorize it whole."],
      },
      {
        pa: "ਇਹ ਬਹੁਤ ਮਹਿੰਗਾ ਹੈ।",
        romanization: "ih bahut mahinga hai",
        vi: "Cái này rất đắt.",
        en: "This is very expensive.",
        pronunciation_focus: ["ਬਹੁਤ thường nói nhanh gần 'bohat/bahut'."],
        pronunciation_focus_en: ["ਬਹੁਤ may sound like bohat/bahut in speech."],
      },
      {
        pa: "ਸਸਤਾ ਹੈ?",
        romanization: "sasta hai?",
        vi: "Có rẻ không?",
        en: "Is it cheap?",
        pronunciation_focus: ["Lên giọng cuối câu giúp câu nghe như câu hỏi yes/no."],
        pronunciation_focus_en: ["Rising intonation helps mark this as a yes/no question."],
      },
      {
        pa: "ਮੈਨੂੰ ਇਹ ਚਾਹੀਦਾ ਹੈ।",
        romanization: "mainu ih chahida hai",
        vi: "Tôi muốn cái này.",
        en: "I want this.",
        pronunciation_focus: ["ਇਹ = cái này/đây; phát âm ngắn, không kéo dài."],
        pronunciation_focus_en: ["ਇਹ means this; keep it short."],
      },
    ],
    l1_notes: [
      {
        audience: "en",
        mistake: "Translating 'how much' word-for-word and losing ਦਾ.",
        fix_vi: "Hỏi giá dùng cụm ਕਿੰਨੇ ਦਾ ਹੈ, có ਦਾ.",
        fix_en: "Use the price chunk ਕਿੰਨੇ ਦਾ ਹੈ; do not omit ਦਾ.",
      },
      {
        audience: "vi",
        mistake: "Dùng 'rẻ không' nhưng quên ਹੈ.",
        fix_vi: "Câu tính từ Punjabi vẫn cần ਹੈ: ਸਸਤਾ ਹੈ?",
        fix_en: "Punjabi adjective questions still use ਹੈ: ਸਸਤਾ ਹੈ?",
      },
    ],
    vocabulary: [
      { cell_id: "8039971b-79ae-41ea-98cd-0f87ef462706", word: "ਕਿੰਨੇ ਦਾ", romanization: "kinne da", vi: "giá bao nhiêu", en: "how much", pos: "price phrase" },
      { cell_id: "b41e225e-bc74-4162-9562-7b1aaeb53ca9", word: "ਮਹਿੰਗਾ", romanization: "mahinga", vi: "đắt", en: "expensive", pos: "adjective" },
      { cell_id: "4c218713-7461-4ca9-9a6e-6e945dff121c", word: "ਸਸਤਾ", romanization: "sasta", vi: "rẻ", en: "cheap", pos: "adjective" },
      { cell_id: "a7068d02-1f6d-4ea2-bd31-697ed12f2306", word: "ਬਹੁਤ", romanization: "bahut", vi: "rất", en: "very", pos: "adverb" },
      { cell_id: "df44a5cf-7ad5-47a4-ae71-63591b544fb3", word: "ਇਹ", romanization: "ih", vi: "cái này", en: "this", pos: "pronoun" },
    ],
    dialogue: [
      { cell_id: "6db08306-8fb0-4c3d-9b61-0aa11259a7d1", speaker: "A", pa: "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?", romanization: "ih kinne da hai?", vi: "Cái này giá bao nhiêu?", en: "How much is this?" },
      { cell_id: "f47e4d40-eef9-4117-b9f6-4e8adce59d27", speaker: "B", pa: "ਇਹ ਦਸ ਰੁਪਏ ਦਾ ਹੈ।", romanization: "ih das rupaye da hai.", vi: "Cái này giá mười rupee.", en: "This is ten rupees." },
      { cell_id: "ec8eda02-9d05-4f33-8cb8-e9ca87a0c87b", speaker: "A", pa: "ਠੀਕ ਹੈ, ਮੈਨੂੰ ਇਹ ਚਾਹੀਦਾ ਹੈ।", romanization: "thik hai, mainu ih chahida hai.", vi: "Được, tôi muốn cái này.", en: "Okay, I want this." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Hoàn thành câu hỏi giá.",
        instruction_en: "Complete the price question.",
        items: [{ prompt: "ਇਹ ___ ਦਾ ਹੈ?", answer: "ਕਿੰਨੇ" }],
      },
    ],
  },
  {
    id: "punjabi_a1_transport",
    level: "A1",
    category: "transport",
    title_vi: "Đi lại",
    title_en: "Transport",
    sentences: [
      {
        pa: "ਬੱਸ ਕਿੱਥੇ ਹੈ?",
        romanization: "bas kithe hai?",
        vi: "Xe buýt ở đâu?",
        en: "Where is the bus?",
        pronunciation_focus: ["ਕਿੱਥੇ = ở đâu; phụ âm tth bật hơi."],
        pronunciation_focus_en: ["ਕਿੱਥੇ means where; tth is aspirated."],
      },
      {
        pa: "ਸਟੇਸ਼ਨ ਨੇੜੇ ਹੈ।",
        romanization: "station nere hai",
        vi: "Nhà ga ở gần.",
        en: "The station is near.",
        pronunciation_focus: ["ਨੇੜੇ có âm retroflex ੜ; cong lưỡi nhẹ."],
        pronunciation_focus_en: ["ਨੇੜੇ has ੜ, a retroflex flap; curl the tongue slightly."],
      },
      {
        pa: "ਟੈਕਸੀ ਰੋਕੋ ਜੀ।",
        romanization: "taiksi roko ji",
        vi: "Làm ơn dừng taxi lại.",
        en: "Please stop the taxi.",
        pronunciation_focus: ["ਜੀ làm câu mệnh lệnh mềm và lịch sự hơn."],
        pronunciation_focus_en: ["ਜੀ softens the command and makes it polite."],
      },
      {
        pa: "ਮੈਂ ਹਵਾਈ ਅੱਡੇ ਜਾਣਾ ਹੈ।",
        romanization: "main havai adde jana hai",
        vi: "Tôi cần đi sân bay.",
        en: "I need to go to the airport.",
        pronunciation_focus: ["ਜਾਣਾ ਹੈ là mẫu 'phải/cần đi' ở mức A1."],
        pronunciation_focus_en: ["ਜਾਣਾ ਹੈ is a useful A1 chunk for need to go."],
      },
    ],
    l1_notes: [
      {
        audience: "both",
        mistake: "Putting the location word before the noun like English/Vietnamese prepositions.",
        fix_vi: "Punjabi dùng từ vị trí sau danh từ: ਸਟੇਸ਼ਨ ਨੇੜੇ = gần nhà ga.",
        fix_en: "Punjabi places location/postposition words after the noun: ਸਟੇਸ਼ਨ ਨੇੜੇ = near the station.",
      },
      {
        audience: "en",
        mistake: "Pronouncing ੜ as English r.",
        fix_vi: "ੜ là âm bật/cong lưỡi; không giống r kéo dài.",
        fix_en: "ੜ is a retroflex flap, not a long English r.",
      },
    ],
    vocabulary: [
      { cell_id: "4caeea7c-b5e0-4de9-bb39-168742788fd4", word: "ਬੱਸ", romanization: "bas", vi: "xe buýt", en: "bus", pos: "noun" },
      { cell_id: "3559f597-3592-456b-8d65-488e5ca6bc2f", word: "ਟੈਕਸੀ", romanization: "taiksi", vi: "taxi", en: "taxi", pos: "noun" },
      { cell_id: "9422d799-9f13-49f5-91b7-a6444ae970da", word: "ਸਟੇਸ਼ਨ", romanization: "station", vi: "nhà ga", en: "station", pos: "noun" },
      { cell_id: "3826d178-63cd-47e9-ac20-cb341d9ac5ce", word: "ਨੇੜੇ", romanization: "nere", vi: "gần", en: "near", pos: "location word" },
      { cell_id: "d31e5cf6-5462-470b-b28c-e13ab3aaf164", word: "ਹਵਾਈ ਅੱਡਾ", romanization: "havai adda", vi: "sân bay", en: "airport", pos: "noun" },
    ],
    dialogue: [
      { cell_id: "90893705-3cdc-43b0-8219-c957f384087d", speaker: "A", pa: "ਬੱਸ ਕਿੱਥੇ ਹੈ?", romanization: "bas kithe hai?", vi: "Xe buýt ở đâu?", en: "Where is the bus?" },
      { cell_id: "e01b873f-89f6-4b1d-a43e-7cc9c4ca5b30", speaker: "B", pa: "ਸਟੇਸ਼ਨ ਨੇੜੇ ਹੈ।", romanization: "station nere hai.", vi: "Ở gần nhà ga.", en: "It is near the station." },
      { cell_id: "fd9a1beb-767d-4904-9dab-a602d4f1c13f", speaker: "A", pa: "ਧੰਨਵਾਦ।", romanization: "dhanvad.", vi: "Cảm ơn.", en: "Thank you." },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch câu hỏi.",
        instruction_en: "Translate the question.",
        items: [{ vi: "Xe buýt ở đâu?", en: "Where is the bus?", answer: "ਬੱਸ ਕਿੱਥੇ ਹੈ?" }],
      },
    ],
  },
  {
    id: "punjabi_a1_simple_questions",
    level: "A1",
    category: "simple_questions",
    title_vi: "Câu hỏi đơn giản",
    title_en: "Simple questions",
    sentences: [
      {
        pa: "ਇਹ ਕੀ ਹੈ?",
        romanization: "ih ki hai?",
        vi: "Đây là cái gì?",
        en: "What is this?",
        pronunciation_focus: ["ਕੀ ngắn và cao vừa; không đọc thành 'kì' kéo dài."],
        pronunciation_focus_en: ["Keep ਕੀ short; do not turn it into a long 'kee' every time."],
      },
      {
        pa: "ਉਹ ਕੌਣ ਹੈ?",
        romanization: "oh kaun hai?",
        vi: "Người đó là ai?",
        en: "Who is that?",
        pronunciation_focus: ["ਕੌਣ có nguyên âm au; âm n cuối nhẹ."],
        pronunciation_focus_en: ["ਕੌਣ has an au vowel and a light final nasal."],
      },
      {
        pa: "ਤੁਸੀਂ ਕਿੱਥੇ ਰਹਿੰਦੇ ਹੋ?",
        romanization: "tusi kithe rahinde ho?",
        vi: "Bạn sống ở đâu?",
        en: "Where do you live?",
        pronunciation_focus: ["ਰਹਿੰਦੇ là dạng lịch sự/số nhiều với ਤੁਸੀਂ."],
        pronunciation_focus_en: ["ਰਹਿੰਦੇ matches polite/plural ਤੁਸੀਂ."],
      },
      {
        pa: "ਕਦੋਂ ਆਉਣਾ ਹੈ?",
        romanization: "kadon auna hai?",
        vi: "Khi nào cần đến?",
        en: "When to come?",
        pronunciation_focus: ["ਕਦੋਂ = khi nào; có nguyên âm mũi ở cuối."],
        pronunciation_focus_en: ["ਕਦੋਂ means when; finish with light nasalization."],
      },
    ],
    l1_notes: [
      {
        audience: "vi",
        mistake: "Để từ hỏi cuối câu theo thói quen tiếng Việt: ਇਹ ਹੈ ਕੀ?",
        fix_vi: "Mẫu cơ bản đặt ਕੀ trước ਹੈ: ਇਹ ਕੀ ਹੈ?",
        fix_en: "Vietnamese word order may push the question word late. Use ਇਹ ਕੀ ਹੈ?",
      },
      {
        audience: "en",
        mistake: "Adding do-support: ਤੁਸੀਂ ਕਿੱਥੇ do ਰਹਿੰਦੇ ਹੋ?",
        fix_vi: "Punjabi không dùng trợ động từ 'do' trong câu hỏi kiểu này.",
        fix_en: "Punjabi does not use English do-support in this question pattern.",
      },
    ],
    vocabulary: [
      { cell_id: "e6a4fd50-2705-429d-be84-015b414693ef", word: "ਕੀ", romanization: "ki", vi: "gì", en: "what", pos: "question word" },
      { cell_id: "82fad985-ab2c-4e3b-8ac0-d269815f9617", word: "ਕੌਣ", romanization: "kaun", vi: "ai", en: "who", pos: "question word" },
      { cell_id: "8c838bcc-ab26-40d4-8147-26e808663a82", word: "ਕਿੱਥੇ", romanization: "kithe", vi: "ở đâu", en: "where", pos: "question word" },
      { cell_id: "13026182-a930-4bdd-b149-1b99d5cc1f2b", word: "ਕਦੋਂ", romanization: "kadon", vi: "khi nào", en: "when", pos: "question word" },
      { cell_id: "7dfa104f-b1f2-4ab4-9a8b-656b6f563962", word: "ਰਹਿੰਦੇ", romanization: "rahinde", vi: "sống/ở", en: "live", pos: "verb" },
    ],
    dialogue: [
      { cell_id: "d63aa057-1184-4a44-bb4a-212ac6d178ff", speaker: "A", pa: "ਤੁਸੀਂ ਕਿੱਥੇ ਰਹਿੰਦੇ ਹੋ?", romanization: "tusi kithe rahinde ho?", vi: "Bạn sống ở đâu?", en: "Where do you live?" },
      { cell_id: "8176656e-a925-4707-8264-6a25daef4759", speaker: "B", pa: "ਮੈਂ ਹੋ ਚੀ ਮਿੰਹ ਸ਼ਹਿਰ ਵਿੱਚ ਰਹਿੰਦਾ ਹਾਂ।", romanization: "main Ho Chi Minh shahir vich rahinda han.", vi: "Tôi sống ở Thành phố Hồ Chí Minh.", en: "I live in Ho Chi Minh City." },
      { cell_id: "61a779ac-06d8-48c3-ac46-330e0909c58b", speaker: "A", pa: "ਉਹ ਕੌਣ ਹੈ?", romanization: "oh kaun hai?", vi: "Người đó là ai?", en: "Who is that?" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ hỏi.",
        instruction_en: "Match the question word.",
        pairs: [
          { a: "ਕੀ", b: "what / gì" },
          { a: "ਕੌਣ", b: "who / ai" },
          { a: "ਕਿੱਥੇ", b: "where / ở đâu" },
        ],
      },
    ],
  },
  {
    id: "punjabi_a1_yes_no",
    level: "A1",
    category: "yes_no",
    title_vi: "Có/không và phủ định",
    title_en: "Yes/no and negation",
    sentences: [
      {
        pa: "ਹਾਂ, ਇਹ ਠੀਕ ਹੈ।",
        romanization: "han, ih thik hai",
        vi: "Vâng, cái này đúng/ổn.",
        en: "Yes, this is okay.",
        pronunciation_focus: ["ਹਾਂ là 'vâng/có'; có âm mũi nhẹ."],
        pronunciation_focus_en: ["ਹਾਂ means yes; keep the nasal vowel light."],
      },
      {
        pa: "ਨਹੀਂ, ਇਹ ਠੀਕ ਨਹੀਂ ਹੈ।",
        romanization: "nahin, ih thik nahin hai",
        vi: "Không, cái này không đúng/không ổn.",
        en: "No, this is not okay.",
        pronunciation_focus: ["ਨਹੀਂ đặt trước ਹੈ trong phủ định cơ bản."],
        pronunciation_focus_en: ["ਨਹੀਂ comes before ਹੈ in this basic negative pattern."],
      },
      {
        pa: "ਕੀ ਤੁਸੀਂ ਤਿਆਰ ਹੋ?",
        romanization: "ki tusi tiar ho?",
        vi: "Bạn sẵn sàng chưa/có sẵn sàng không?",
        en: "Are you ready?",
        pronunciation_focus: ["ਕੀ đầu câu có thể đánh dấu câu hỏi yes/no."],
        pronunciation_focus_en: ["ਕੀ at the start can mark a yes/no question."],
      },
      {
        pa: "ਮੈਂ ਤਿਆਰ ਨਹੀਂ ਹਾਂ।",
        romanization: "main tiar nahin han",
        vi: "Tôi chưa/không sẵn sàng.",
        en: "I am not ready.",
        pronunciation_focus: ["Với ਮੈਂ, vẫn kết thúc bằng ਹਾਂ: ਨਹੀਂ ਹਾਂ."],
        pronunciation_focus_en: ["With ਮੈਂ, keep ਹਾਂ: ਨਹੀਂ ਹਾਂ."],
      },
    ],
    l1_notes: [
      {
        audience: "both",
        mistake: "Answering only with English/Vietnamese-style 'yes' and no Punjabi verb when clarity is needed.",
        fix_vi: "Có thể nói ਹਾਂ/ਨਹੀਂ, nhưng luyện thêm câu đầy đủ: ਹਾਂ, ਮੈਂ ਤਿਆਰ ਹਾਂ.",
        fix_en: "ਹਾਂ/ਨਹੀਂ is fine, but practice a full answer too: ਹਾਂ, ਮੈਂ ਤਿਆਰ ਹਾਂ.",
      },
      {
        audience: "en",
        mistake: "Placing ਨਹੀਂ after ਹੈ: ਇਹ ਠੀਕ ਹੈ ਨਹੀਂ.",
        fix_vi: "Mẫu phủ định cơ bản: ਇਹ ਠੀਕ ਨਹੀਂ ਹੈ.",
        fix_en: "Basic negative order: ਇਹ ਠੀਕ ਨਹੀਂ ਹੈ.",
      },
    ],
    vocabulary: [
      { cell_id: "65fef4d7-f0de-4d91-a42c-23a11e5e177c", word: "ਹਾਂ", romanization: "han", vi: "vâng/có", en: "yes", pos: "particle" },
      { cell_id: "5101cba4-201f-445d-bea5-981ad9df4edd", word: "ਨਹੀਂ", romanization: "nahin", vi: "không", en: "no/not", pos: "negative" },
      { cell_id: "992e0638-6300-4837-94af-7354dcb134f1", word: "ਤਿਆਰ", romanization: "tiar", vi: "sẵn sàng", en: "ready", pos: "adjective" },
      { cell_id: "735c5f8d-b24a-48c4-8ee7-c39c4d38e89a", word: "ਠੀਕ", romanization: "thik", vi: "đúng/ổn", en: "okay/correct", pos: "adjective" },
      { cell_id: "d6f2777a-8332-470b-add9-61e8878012d7", word: "ਕੀ", romanization: "ki", vi: "có phải không", en: "yes/no marker", pos: "particle" },
    ],
    dialogue: [
      { cell_id: "b7df0985-959b-4506-a9f2-537fba3bac65", speaker: "A", pa: "ਕੀ ਤੁਸੀਂ ਤਿਆਰ ਹੋ?", romanization: "ki tusi tiar ho?", vi: "Bạn sẵn sàng chưa?", en: "Are you ready?" },
      { cell_id: "dc636014-98bf-48cf-b238-48209c16e148", speaker: "B", pa: "ਹਾਂ, ਮੈਂ ਤਿਆਰ ਹਾਂ।", romanization: "han, main tiar han.", vi: "Vâng, tôi sẵn sàng.", en: "Yes, I am ready." },
      { cell_id: "4459e7ac-7c2f-4400-8f31-73f36d18422e", speaker: "A", pa: "ਠੀਕ ਹੈ।", romanization: "thik hai.", vi: "Được rồi.", en: "Okay." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền phủ định.",
        instruction_en: "Fill in the negative.",
        items: [{ prompt: "ਮੈਂ ਤਿਆਰ ___ ਹਾਂ।", answer: "ਨਹੀਂ" }],
      },
    ],
  },
  {
    id: "punjabi_a1_thanks_apology",
    level: "A1",
    category: "thanks_apology",
    title_vi: "Cảm ơn và xin lỗi",
    title_en: "Thanks and apologies",
    sentences: [
      {
        pa: "ਧੰਨਵਾਦ।",
        romanization: "dhanvad",
        vi: "Cảm ơn.",
        en: "Thank you.",
        pronunciation_focus: ["ਧ có hơi và hữu thanh; người Việt đừng đọc thành 'đ' thuần."],
        pronunciation_focus_en: ["ਧ is voiced and aspirated; make a soft breathy dh."],
      },
      {
        pa: "ਬਹੁਤ ਧੰਨਵਾਦ।",
        romanization: "bahut dhanvad",
        vi: "Cảm ơn rất nhiều.",
        en: "Thank you very much.",
        pronunciation_focus: ["ਬਹੁਤ nhấn nhẹ, đừng kéo dài quá mức."],
        pronunciation_focus_en: ["Keep ਬਹੁਤ light; do not over-stress it."],
      },
      {
        pa: "ਮਾਫ ਕਰਨਾ।",
        romanization: "maf karna",
        vi: "Xin lỗi / xin phép.",
        en: "Sorry / excuse me.",
        pronunciation_focus: ["ਕਰਨਾ ở đây làm cụm xin lỗi lịch sự, không cần dịch từng chữ."],
        pronunciation_focus_en: ["Treat ਮਾਫ ਕਰਨਾ as one apology/excuse-me phrase."],
      },
      {
        pa: "ਕੋਈ ਗੱਲ ਨਹੀਂ।",
        romanization: "koi gall nahin",
        vi: "Không sao đâu.",
        en: "No problem.",
        pronunciation_focus: ["ਗੱਲ có phụ âm l đôi; giữ ngắn và chắc."],
        pronunciation_focus_en: ["ਗੱਲ has a doubled l; keep it short and firm."],
      },
    ],
    l1_notes: [
      {
        audience: "vi",
        mistake: "Dùng cùng một câu cho 'xin lỗi' và 'cho tôi hỏi' nhưng quá ngắn.",
        fix_vi: "ਮਾਫ ਕਰਨਾ dùng được cho cả xin lỗi và mở lời lịch sự.",
        fix_en: "ਮਾਫ ਕਰਨਾ works for both sorry and excuse me.",
      },
      {
        audience: "en",
        mistake: "Translating 'no problem' word by word.",
        fix_vi: "Học cả cụm: ਕੋਈ ਗੱਲ ਨਹੀਂ.",
        fix_en: "Memorize the whole phrase: ਕੋਈ ਗੱਲ ਨਹੀਂ.",
      },
    ],
    vocabulary: [
      { cell_id: "3e7f885f-2122-4da7-892c-df125f1b9c2d", word: "ਧੰਨਵਾਦ", romanization: "dhanvad", vi: "cảm ơn", en: "thank you", pos: "phrase" },
      { cell_id: "d3e42ca8-ff86-4844-8b7d-115e472df578", word: "ਮਾਫ ਕਰਨਾ", romanization: "maf karna", vi: "xin lỗi/xin phép", en: "sorry/excuse me", pos: "phrase" },
      { cell_id: "d74ba1b2-8af9-4f26-8fd4-96b5e9778dd1", word: "ਕੋਈ", romanization: "koi", vi: "nào, bất kỳ", en: "any", pos: "determiner" },
      { cell_id: "4a71df24-40b2-421c-afd3-4ee9b10300c0", word: "ਗੱਲ", romanization: "gall", vi: "chuyện/vấn đề", en: "matter/talk", pos: "noun" },
      { cell_id: "06c52399-631f-457a-8e16-52bd1471322d", word: "ਬਹੁਤ", romanization: "bahut", vi: "rất/nhiều", en: "very/much", pos: "adverb" },
    ],
    dialogue: [
      { cell_id: "e371cb59-61b3-4e7b-89f9-684a6100764d", speaker: "A", pa: "ਮਾਫ ਕਰਨਾ।", romanization: "maf karna.", vi: "Xin lỗi / cho tôi hỏi.", en: "Excuse me." },
      { cell_id: "13ac02ea-ec73-4b25-8ce7-3ad28fd44c70", speaker: "B", pa: "ਹਾਂ ਜੀ?", romanization: "han ji?", vi: "Vâng ạ?", en: "Yes?" },
      { cell_id: "e5b22d23-f0bd-496e-acbd-53742bddbd86", speaker: "A", pa: "ਧੰਨਵਾਦ।", romanization: "dhanvad.", vi: "Cảm ơn.", en: "Thank you." },
      { cell_id: "f06b92bc-66c7-4fc3-8265-e3f318646bac", speaker: "B", pa: "ਕੋਈ ਗੱਲ ਨਹੀਂ।", romanization: "koi gall nahin.", vi: "Không sao.", en: "No problem." },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang Punjabi.",
        instruction_en: "Translate into Punjabi.",
        items: [{ vi: "Không sao đâu.", en: "No problem.", answer: "ਕੋਈ ਗੱਲ ਨਹੀਂ।" }],
      },
    ],
  },
  {
    id: "punjabi_a1_polite_basics",
    level: "A1",
    category: "polite_basics",
    title_vi: "Lịch sự cơ bản với ਜੀ",
    title_en: "Polite basics with ਜੀ",
    sentences: [
      {
        pa: "ਹਾਂ ਜੀ।",
        romanization: "han ji",
        vi: "Vâng ạ.",
        en: "Yes, respectfully.",
        pronunciation_focus: ["ਜੀ là dấu hiệu lịch sự rất phổ biến; nói nhẹ ở cuối."],
        pronunciation_focus_en: ["ਜੀ is a common respect marker; keep it light at the end."],
      },
      {
        pa: "ਨਹੀਂ ਜੀ।",
        romanization: "nahin ji",
        vi: "Không ạ.",
        en: "No, respectfully.",
        pronunciation_focus: ["ਨਹੀਂ ਜੀ mềm hơn chỉ nói ਨਹੀਂ."],
        pronunciation_focus_en: ["ਨਹੀਂ ਜੀ sounds softer than just ਨਹੀਂ."],
      },
      {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।",
        romanization: "kirpa karke hauli bolo",
        vi: "Làm ơn nói chậm thôi.",
        en: "Please speak slowly.",
        pronunciation_focus: ["ਹੌਲੀ = chậm; ਬੋਲੋ là dạng yêu cầu lịch sự/cơ bản."],
        pronunciation_focus_en: ["ਹੌਲੀ means slowly; ਬੋਲੋ is a useful polite/basic command."],
      },
      {
        pa: "ਮਦਦ ਕਰੋ ਜੀ।",
        romanization: "madad karo ji",
        vi: "Làm ơn giúp tôi.",
        en: "Please help.",
        pronunciation_focus: ["ਕਰੋ ਜੀ biến mệnh lệnh thành lời nhờ lịch sự."],
        pronunciation_focus_en: ["ਕਰੋ ਜੀ turns the command into a polite request."],
      },
    ],
    l1_notes: [
      {
        audience: "both",
        mistake: "Overusing direct commands without ਜੀ.",
        fix_vi: "Thêm ਜੀ sau câu ngắn để mềm hơn: ਮਦਦ ਕਰੋ ਜੀ.",
        fix_en: "Add ਜੀ to soften short requests: ਮਦਦ ਕਰੋ ਜੀ.",
      },
      {
        audience: "vi",
        mistake: "Dịch 'ạ' thành một từ cố định trong mọi câu.",
        fix_vi: "ਜੀ gần vai trò lịch sự như 'ạ' trong vài ngữ cảnh, nhưng không thay thế 1-1.",
        fix_en: "ਜੀ can feel like Vietnamese 'ạ' in some contexts, but it is not a one-to-one equivalent.",
      },
    ],
    vocabulary: [
      { cell_id: "0e17b005-3bcd-430d-b216-0dd8a071d9c2", word: "ਜੀ", romanization: "ji", vi: "ạ/thưa (lịch sự)", en: "respect marker", pos: "particle" },
      { cell_id: "d4de1777-de2e-4b53-9d50-141e5e1ba8d8", word: "ਕਿਰਪਾ ਕਰਕੇ", romanization: "kirpa karke", vi: "làm ơn", en: "please", pos: "phrase" },
      { cell_id: "26caf0f2-8312-455d-b602-6b69132005b6", word: "ਹੌਲੀ", romanization: "hauli", vi: "chậm", en: "slowly", pos: "adverb" },
      { cell_id: "a861e7b8-01f6-4659-99a4-be12dcd1e93d", word: "ਬੋਲੋ", romanization: "bolo", vi: "hãy nói", en: "speak", pos: "verb" },
      { cell_id: "f7dfbb0b-3b66-4c78-8627-14faabd85636", word: "ਮਦਦ", romanization: "madad", vi: "sự giúp đỡ", en: "help", pos: "noun" },
    ],
    dialogue: [
      { cell_id: "61745ec1-bc1b-465b-baca-140b3a3fa71f", speaker: "A", pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।", romanization: "kirpa karke hauli bolo.", vi: "Làm ơn nói chậm thôi.", en: "Please speak slowly." },
      { cell_id: "e22d6290-0f57-48b4-b150-3d3cceddb646", speaker: "B", pa: "ਹਾਂ ਜੀ।", romanization: "han ji.", vi: "Vâng ạ.", en: "Yes, respectfully." },
      { cell_id: "16b9c349-8909-407e-82f8-e7c6aef8a056", speaker: "A", pa: "ਧੰਨਵਾਦ ਜੀ।", romanization: "dhanvad ji.", vi: "Cảm ơn ạ.", en: "Thank you." },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch lời nhờ lịch sự.",
        instruction_en: "Translate the polite request.",
        items: [{ vi: "Làm ơn nói chậm.", en: "Please speak slowly.", answer: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।" }],
      },
    ],
  },
];

export default lessons;
