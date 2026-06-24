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
  word: string;
  romanization: string;
  vi: string;
  en: string;
  pos: string;
};

export type PunjabiDialogueLine = {
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
      { word: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", romanization: "sat sri akal", vi: "xin chào", en: "hello", pos: "phrase" },
      { word: "ਕਿਵੇਂ", romanization: "kive", vi: "như thế nào", en: "how", pos: "adverb" },
      { word: "ਠੀਕ", romanization: "thik", vi: "ổn, khỏe", en: "fine, okay", pos: "adjective" },
      { word: "ਫਿਰ", romanization: "phir", vi: "lại, sau đó", en: "again, then", pos: "adverb" },
      { word: "ਮਿਲਾਂਗੇ", romanization: "milange", vi: "sẽ gặp", en: "will meet", pos: "verb" },
    ],
    dialogue: [
      { speaker: "A", pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?", romanization: "sat sri akal. tusi kive ho?", vi: "Xin chào. Bạn khỏe không?", en: "Hello. How are you?" },
      { speaker: "B", pa: "ਮੈਂ ਠੀਕ ਹਾਂ। ਧੰਨਵਾਦ।", romanization: "main thik han. dhanvad.", vi: "Tôi khỏe. Cảm ơn.", en: "I am fine. Thank you." },
      { speaker: "A", pa: "ਫਿਰ ਮਿਲਾਂਗੇ।", romanization: "phir milange.", vi: "Hẹn gặp lại.", en: "See you again." },
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
      { word: "ਨਾਮ", romanization: "nam", vi: "tên", en: "name", pos: "noun" },
      { word: "ਮੇਰਾ", romanization: "mera", vi: "của tôi", en: "my", pos: "possessive" },
      { word: "ਤੁਹਾਡਾ", romanization: "tuhada", vi: "của bạn", en: "your", pos: "possessive" },
      { word: "ਕੀ", romanization: "ki", vi: "gì", en: "what", pos: "question word" },
      { word: "ਤੋਂ", romanization: "ton", vi: "từ", en: "from", pos: "postposition" },
    ],
    dialogue: [
      { speaker: "A", pa: "ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?", romanization: "tuhada nam ki hai?", vi: "Tên bạn là gì?", en: "What is your name?" },
      { speaker: "B", pa: "ਮੇਰਾ ਨਾਮ ਲਾਨ ਹੈ।", romanization: "mera nam Lan hai.", vi: "Tên tôi là Lan.", en: "My name is Lan." },
      { speaker: "A", pa: "ਤੁਹਾਨੂੰ ਮਿਲ ਕੇ ਖੁਸ਼ੀ ਹੋਈ।", romanization: "tuhanu mil ke khushi hoi.", vi: "Rất vui được gặp bạn.", en: "Nice to meet you." },
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
      { word: "ਮੈਂ", romanization: "main", vi: "tôi", en: "I", pos: "pronoun" },
      { word: "ਤੁਸੀਂ", romanization: "tusi", vi: "bạn/anh chị", en: "you", pos: "pronoun" },
      { word: "ਉਹ", romanization: "oh", vi: "anh ấy/cô ấy/đó", en: "he/she/that", pos: "pronoun" },
      { word: "ਅਸੀਂ", romanization: "asi", vi: "chúng tôi", en: "we", pos: "pronoun" },
      { word: "ਵਿੱਚ", romanization: "vich", vi: "trong", en: "in", pos: "postposition" },
    ],
    dialogue: [
      { speaker: "A", pa: "ਤੁਸੀਂ ਵਿਦਿਆਰਥੀ ਹੋ?", romanization: "tusi vidiarthi ho?", vi: "Bạn là sinh viên à?", en: "Are you a student?" },
      { speaker: "B", pa: "ਹਾਂ, ਮੈਂ ਵਿਦਿਆਰਥੀ ਹਾਂ।", romanization: "han, main vidiarthi han.", vi: "Vâng, tôi là sinh viên.", en: "Yes, I am a student." },
      { speaker: "A", pa: "ਉਹ ਅਧਿਆਪਕ ਹੈ।", romanization: "oh adhiapak hai.", vi: "Cô ấy/anh ấy là giáo viên.", en: "He/she is a teacher." },
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
      { word: "ਮਾਂ", romanization: "ma", vi: "mẹ", en: "mother", pos: "noun" },
      { word: "ਪਿਤਾ ਜੀ", romanization: "pita ji", vi: "bố/cha", en: "father", pos: "noun" },
      { word: "ਭਰਾ", romanization: "bhra", vi: "anh/em trai", en: "brother", pos: "noun" },
      { word: "ਭੈਣ", romanization: "bhain", vi: "chị/em gái", en: "sister", pos: "noun" },
      { word: "ਪਰਿਵਾਰ", romanization: "parivar", vi: "gia đình", en: "family", pos: "noun" },
    ],
    dialogue: [
      { speaker: "A", pa: "ਇਹ ਕੌਣ ਹੈ?", romanization: "ih kaun hai?", vi: "Đây là ai?", en: "Who is this?" },
      { speaker: "B", pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ।", romanization: "ih meri ma hai.", vi: "Đây là mẹ tôi.", en: "This is my mother." },
      { speaker: "A", pa: "ਤੁਹਾਡਾ ਪਰਿਵਾਰ ਵੱਡਾ ਹੈ?", romanization: "tuhada parivar vadda hai?", vi: "Gia đình bạn lớn không?", en: "Is your family big?" },
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
      { word: "ਸਿਫਰ", romanization: "sifar", vi: "số không", en: "zero", pos: "number" },
      { word: "ਇੱਕ", romanization: "ik", vi: "một", en: "one", pos: "number" },
      { word: "ਦੋ", romanization: "do", vi: "hai", en: "two", pos: "number" },
      { word: "ਤਿੰਨ", romanization: "tinn", vi: "ba", en: "three", pos: "number" },
      { word: "ਦਸ", romanization: "das", vi: "mười", en: "ten", pos: "number" },
    ],
    dialogue: [
      { speaker: "A", pa: "ਕਿੰਨੇ ਟਿਕਟ?", romanization: "kinne tiket?", vi: "Bao nhiêu vé?", en: "How many tickets?" },
      { speaker: "B", pa: "ਦੋ ਟਿਕਟਾਂ।", romanization: "do tiktan.", vi: "Hai vé.", en: "Two tickets." },
      { speaker: "A", pa: "ਠੀਕ ਹੈ।", romanization: "thik hai.", vi: "Được rồi.", en: "Okay." },
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
      { word: "ਪਾਣੀ", romanization: "pani", vi: "nước", en: "water", pos: "noun" },
      { word: "ਚਾਹ", romanization: "chah", vi: "trà", en: "tea", pos: "noun" },
      { word: "ਖਾਣਾ", romanization: "khana", vi: "đồ ăn", en: "food", pos: "noun" },
      { word: "ਚੰਗਾ", romanization: "changa", vi: "tốt, ngon", en: "good", pos: "adjective" },
      { word: "ਘੱਟ", romanization: "ghatt", vi: "ít hơn", en: "less", pos: "adjective/adverb" },
    ],
    dialogue: [
      { speaker: "A", pa: "ਤੁਹਾਨੂੰ ਕੀ ਚਾਹੀਦਾ ਹੈ?", romanization: "tuhanu ki chahida hai?", vi: "Bạn cần gì?", en: "What would you like?" },
      { speaker: "B", pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।", romanization: "mainu pani chahida hai.", vi: "Tôi cần nước.", en: "I would like water." },
      { speaker: "B", pa: "ਮਸਾਲਾ ਘੱਟ ਕਰੋ ਜੀ।", romanization: "masala ghatt karo ji.", vi: "Ít cay/gia vị giúp tôi ạ.", en: "Please make it less spicy." },
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
      { word: "ਕਿੰਨੇ ਦਾ", romanization: "kinne da", vi: "giá bao nhiêu", en: "how much", pos: "price phrase" },
      { word: "ਮਹਿੰਗਾ", romanization: "mahinga", vi: "đắt", en: "expensive", pos: "adjective" },
      { word: "ਸਸਤਾ", romanization: "sasta", vi: "rẻ", en: "cheap", pos: "adjective" },
      { word: "ਬਹੁਤ", romanization: "bahut", vi: "rất", en: "very", pos: "adverb" },
      { word: "ਇਹ", romanization: "ih", vi: "cái này", en: "this", pos: "pronoun" },
    ],
    dialogue: [
      { speaker: "A", pa: "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?", romanization: "ih kinne da hai?", vi: "Cái này giá bao nhiêu?", en: "How much is this?" },
      { speaker: "B", pa: "ਇਹ ਦਸ ਰੁਪਏ ਦਾ ਹੈ।", romanization: "ih das rupaye da hai.", vi: "Cái này giá mười rupee.", en: "This is ten rupees." },
      { speaker: "A", pa: "ਠੀਕ ਹੈ, ਮੈਨੂੰ ਇਹ ਚਾਹੀਦਾ ਹੈ।", romanization: "thik hai, mainu ih chahida hai.", vi: "Được, tôi muốn cái này.", en: "Okay, I want this." },
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
      { word: "ਬੱਸ", romanization: "bas", vi: "xe buýt", en: "bus", pos: "noun" },
      { word: "ਟੈਕਸੀ", romanization: "taiksi", vi: "taxi", en: "taxi", pos: "noun" },
      { word: "ਸਟੇਸ਼ਨ", romanization: "station", vi: "nhà ga", en: "station", pos: "noun" },
      { word: "ਨੇੜੇ", romanization: "nere", vi: "gần", en: "near", pos: "location word" },
      { word: "ਹਵਾਈ ਅੱਡਾ", romanization: "havai adda", vi: "sân bay", en: "airport", pos: "noun" },
    ],
    dialogue: [
      { speaker: "A", pa: "ਬੱਸ ਕਿੱਥੇ ਹੈ?", romanization: "bas kithe hai?", vi: "Xe buýt ở đâu?", en: "Where is the bus?" },
      { speaker: "B", pa: "ਸਟੇਸ਼ਨ ਨੇੜੇ ਹੈ।", romanization: "station nere hai.", vi: "Ở gần nhà ga.", en: "It is near the station." },
      { speaker: "A", pa: "ਧੰਨਵਾਦ।", romanization: "dhanvad.", vi: "Cảm ơn.", en: "Thank you." },
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
      { word: "ਕੀ", romanization: "ki", vi: "gì", en: "what", pos: "question word" },
      { word: "ਕੌਣ", romanization: "kaun", vi: "ai", en: "who", pos: "question word" },
      { word: "ਕਿੱਥੇ", romanization: "kithe", vi: "ở đâu", en: "where", pos: "question word" },
      { word: "ਕਦੋਂ", romanization: "kadon", vi: "khi nào", en: "when", pos: "question word" },
      { word: "ਰਹਿੰਦੇ", romanization: "rahinde", vi: "sống/ở", en: "live", pos: "verb" },
    ],
    dialogue: [
      { speaker: "A", pa: "ਤੁਸੀਂ ਕਿੱਥੇ ਰਹਿੰਦੇ ਹੋ?", romanization: "tusi kithe rahinde ho?", vi: "Bạn sống ở đâu?", en: "Where do you live?" },
      { speaker: "B", pa: "ਮੈਂ ਹੋ ਚੀ ਮਿੰਹ ਸ਼ਹਿਰ ਵਿੱਚ ਰਹਿੰਦਾ ਹਾਂ।", romanization: "main Ho Chi Minh shahir vich rahinda han.", vi: "Tôi sống ở Thành phố Hồ Chí Minh.", en: "I live in Ho Chi Minh City." },
      { speaker: "A", pa: "ਉਹ ਕੌਣ ਹੈ?", romanization: "oh kaun hai?", vi: "Người đó là ai?", en: "Who is that?" },
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
      { word: "ਹਾਂ", romanization: "han", vi: "vâng/có", en: "yes", pos: "particle" },
      { word: "ਨਹੀਂ", romanization: "nahin", vi: "không", en: "no/not", pos: "negative" },
      { word: "ਤਿਆਰ", romanization: "tiar", vi: "sẵn sàng", en: "ready", pos: "adjective" },
      { word: "ਠੀਕ", romanization: "thik", vi: "đúng/ổn", en: "okay/correct", pos: "adjective" },
      { word: "ਕੀ", romanization: "ki", vi: "có phải không", en: "yes/no marker", pos: "particle" },
    ],
    dialogue: [
      { speaker: "A", pa: "ਕੀ ਤੁਸੀਂ ਤਿਆਰ ਹੋ?", romanization: "ki tusi tiar ho?", vi: "Bạn sẵn sàng chưa?", en: "Are you ready?" },
      { speaker: "B", pa: "ਹਾਂ, ਮੈਂ ਤਿਆਰ ਹਾਂ।", romanization: "han, main tiar han.", vi: "Vâng, tôi sẵn sàng.", en: "Yes, I am ready." },
      { speaker: "A", pa: "ਠੀਕ ਹੈ।", romanization: "thik hai.", vi: "Được rồi.", en: "Okay." },
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
      { word: "ਧੰਨਵਾਦ", romanization: "dhanvad", vi: "cảm ơn", en: "thank you", pos: "phrase" },
      { word: "ਮਾਫ ਕਰਨਾ", romanization: "maf karna", vi: "xin lỗi/xin phép", en: "sorry/excuse me", pos: "phrase" },
      { word: "ਕੋਈ", romanization: "koi", vi: "nào, bất kỳ", en: "any", pos: "determiner" },
      { word: "ਗੱਲ", romanization: "gall", vi: "chuyện/vấn đề", en: "matter/talk", pos: "noun" },
      { word: "ਬਹੁਤ", romanization: "bahut", vi: "rất/nhiều", en: "very/much", pos: "adverb" },
    ],
    dialogue: [
      { speaker: "A", pa: "ਮਾਫ ਕਰਨਾ।", romanization: "maf karna.", vi: "Xin lỗi / cho tôi hỏi.", en: "Excuse me." },
      { speaker: "B", pa: "ਹਾਂ ਜੀ?", romanization: "han ji?", vi: "Vâng ạ?", en: "Yes?" },
      { speaker: "A", pa: "ਧੰਨਵਾਦ।", romanization: "dhanvad.", vi: "Cảm ơn.", en: "Thank you." },
      { speaker: "B", pa: "ਕੋਈ ਗੱਲ ਨਹੀਂ।", romanization: "koi gall nahin.", vi: "Không sao.", en: "No problem." },
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
      { word: "ਜੀ", romanization: "ji", vi: "ạ/thưa (lịch sự)", en: "respect marker", pos: "particle" },
      { word: "ਕਿਰਪਾ ਕਰਕੇ", romanization: "kirpa karke", vi: "làm ơn", en: "please", pos: "phrase" },
      { word: "ਹੌਲੀ", romanization: "hauli", vi: "chậm", en: "slowly", pos: "adverb" },
      { word: "ਬੋਲੋ", romanization: "bolo", vi: "hãy nói", en: "speak", pos: "verb" },
      { word: "ਮਦਦ", romanization: "madad", vi: "sự giúp đỡ", en: "help", pos: "noun" },
    ],
    dialogue: [
      { speaker: "A", pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।", romanization: "kirpa karke hauli bolo.", vi: "Làm ơn nói chậm thôi.", en: "Please speak slowly." },
      { speaker: "B", pa: "ਹਾਂ ਜੀ।", romanization: "han ji.", vi: "Vâng ạ.", en: "Yes, respectfully." },
      { speaker: "A", pa: "ਧੰਨਵਾਦ ਜੀ।", romanization: "dhanvad ji.", vi: "Cảm ơn ạ.", en: "Thank you." },
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
