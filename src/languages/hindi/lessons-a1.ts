// Hindi A1 starter lessons for Vietnamese and English learners.
//
// W2 A5 scope: local lesson data only. Hindi is Devanagari-first and LTR.
// Romanization is a learner aid, not a replacement for native script.

export type HindiCategoryId =
  | "script_orientation"
  | "greetings"
  | "introductions"
  | "numbers_time"
  | "food_shopping";

export type HindiCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type HindiSentence = {
  hi: string;
  romanization: string;
  en: string;
  vi: string;
  pronunciation_focus?: string[];
  pronunciation_focus_en?: string[];
  note_vi?: string;
  note_en?: string;
};

export type HindiVocabEntry = {
  cell_id?: string;
  hi: string;
  romanization: string;
  en: string;
  vi: string;
  pos?: string;
};

export type HindiDialogueLine = {
  cell_id?: string;
  speaker: string;
  hi: string;
  romanization: string;
  en: string;
  vi: string;
};

export type HindiExercise =
  | {
      type: "fill-blank";
      question: string;
      answer: string;
      accepted_answers?: string[];
      hint_vi?: string;
      hint_en?: string;
    }
  | {
      type: "matching";
      instruction_vi: string;
      instruction_en: string;
      pairs: Array<{ hi: string; meaning_vi: string; meaning_en?: string }>;
    }
  | {
      type: "translation";
      vi: string;
      en: string;
      hi: string;
      romanization?: string;
      accepted_answers?: string[];
    };

export type HindiLesson = {
  id: string;
  level: HindiCefrLevel;
  category: HindiCategoryId;
  title_vi: string;
  title_en: string;
  intro_vi: string;
  intro_en: string;
  vocabulary: HindiVocabEntry[];
  sentences: HindiSentence[];
  dialogue?: HindiDialogueLine[];
  exercises?: HindiExercise[];
  cultural_notes_vi?: string;
  cultural_notes_en?: string;
  tip_advice_vi?: string;
  tip_advice_en?: string;
  register_notes_vi?: string;
  register_notes_en?: string;
};

export const lessons: HindiLesson[] = [
  {
    id: "hindi_a1_script_orientation",
    level: "A1",
    category: "script_orientation",
    title_vi: "Chữ Devanagari và hướng đọc",
    title_en: "Devanagari script and reading direction",
    intro_vi:
      "Tiếng Hindi viết bằng chữ Devanagari từ trái sang phải. Bài này chỉ giúp nhận diện vài chữ đầu tiên trong từ quen thuộc.",
    intro_en:
      "Hindi is written in Devanagari from left to right. This lesson only asks you to recognize a few first letters inside familiar words.",
    vocabulary: [
      { cell_id: "7f5fb000-110d-4f60-bac6-00e158ce9ffd", hi: "न", romanization: "na", vi: "chữ na", en: "letter na", pos: "letter" },
      { cell_id: "af46bab3-00e1-420d-a0eb-e3d9752d65e8", hi: "म", romanization: "ma", vi: "chữ ma", en: "letter ma", pos: "letter" },
      { cell_id: "37cee61d-6104-466f-b5a6-8c132dc61d15", hi: "स", romanization: "sa", vi: "chữ sa", en: "letter sa", pos: "letter" },
      { cell_id: "28c4d021-db93-4633-b240-60d4a64c1716", hi: "ते", romanization: "te", vi: "âm te", en: "te sound", pos: "syllable" },
      { cell_id: "e5e09f94-7c7b-4ae0-a0a5-5cd8de1e56ea", hi: "नमस्ते", romanization: "namaste", vi: "xin chào", en: "hello", pos: "greeting" },
    ],
    sentences: [
      {
        hi: "नमस्ते।",
        romanization: "namaste.",
        vi: "Xin chào.",
        en: "Hello.",
        pronunciation_focus: [
          "Dấu । gọi là danda, dùng như dấu chấm trong nhiều câu Hindi.",
          "Romanization chỉ là trợ giúp; chữ mục tiêu là नमस्ते.",
        ],
        pronunciation_focus_en: [
          "The । mark is a danda, often used like a full stop in Hindi sentences.",
          "Romanization is only support; the target script is नमस्ते.",
        ],
      },
      {
        hi: "यह न है।",
        romanization: "yah na hai.",
        vi: "Đây là chữ na.",
        en: "This is na.",
        pronunciation_focus: [
          "है là động từ 'là/có' ở hiện tại, thường đứng cuối câu.",
          "Trật tự cơ bản là chủ ngữ - bổ ngữ - động từ.",
        ],
        pronunciation_focus_en: [
          "है is the present copula, usually at the end.",
          "The basic order is subject - complement - verb.",
        ],
      },
      {
        hi: "यह म है।",
        romanization: "yah ma hai.",
        vi: "Đây là chữ ma.",
        en: "This is ma.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối chữ Hindi với cách đọc.",
        instruction_en: "Match each Hindi letter with its reading.",
        pairs: [
          { hi: "न", meaning_vi: "na", meaning_en: "na" },
          { hi: "म", meaning_vi: "ma", meaning_en: "ma" },
          { hi: "स", meaning_vi: "sa", meaning_en: "sa" },
        ],
      },
      {
        type: "fill-blank",
        question: "नमस्__",
        answer: "ते",
        hint_vi: "Hoàn thành từ नमस्ते.",
        hint_en: "Complete the word नमस्ते.",
      },
    ],
    cultural_notes_vi:
      "Devanagari không phải bảng chữ cái Latin đổi font. Dấu nguyên âm có thể đứng quanh phụ âm, nên người học nên nhìn cả cụm âm.",
    cultural_notes_en:
      "Devanagari is not the Latin alphabet in another font. Vowel signs can sit around consonants, so learners should read syllable clusters.",
    tip_advice_vi:
      "Đừng học Hindi chỉ bằng romanization. Hãy luôn nhìn chữ Devanagari trước, rồi dùng romanization để kiểm tra.",
    tip_advice_en:
      "Do not learn Hindi only through romanization. Look at Devanagari first, then use romanization as a check.",
  },
  {
    id: "hindi_a1_greetings_polite",
    level: "A1",
    category: "greetings",
    title_vi: "Chào hỏi và lịch sự cơ bản",
    title_en: "Greetings and basic politeness",
    intro_vi:
      "Học các câu chào hỏi an toàn cho người mới: namaste, cảm ơn, xin lỗi, và cách hỏi thăm đơn giản.",
    intro_en:
      "Learn safe beginner greetings: namaste, thank you, sorry, and a simple how-are-you exchange.",
    vocabulary: [
      { cell_id: "4a1e86df-07df-41ca-a943-cc883cc7abe0", hi: "नमस्ते", romanization: "namaste", vi: "xin chào", en: "hello", pos: "greeting" },
      { cell_id: "8946cafd-3f88-4fac-8e9e-9a6c5ad0ed99", hi: "धन्यवाद", romanization: "dhanyavaad", vi: "cảm ơn", en: "thank you", pos: "phrase" },
      { cell_id: "7bdfaff8-a0ed-4d68-8129-8a543dc664d6", hi: "माफ़ कीजिए", romanization: "maaf kijiye", vi: "xin lỗi / làm ơn thứ lỗi", en: "sorry / excuse me", pos: "phrase" },
      { cell_id: "20cb1ca5-6234-441a-9c8d-dfa67edc2bf2", hi: "कृपया", romanization: "kripaya", vi: "làm ơn", en: "please", pos: "phrase" },
      { cell_id: "95ad0521-d37e-452d-b167-5bdb2ac3f051", hi: "ठीक", romanization: "theek", vi: "ổn", en: "fine / okay", pos: "adj." },
    ],
    sentences: [
      {
        hi: "नमस्ते, आप कैसे हैं?",
        romanization: "namaste, aap kaise hain?",
        vi: "Xin chào, bạn khỏe không? (lịch sự)",
        en: "Hello, how are you? (polite)",
        pronunciation_focus: [
          "आप là đại từ lịch sự; nên dùng với người mới gặp.",
          "हैं đi với आप; đừng đổi thành है trong câu này.",
        ],
        pronunciation_focus_en: [
          "आप is the polite pronoun; use it with people you do not know well.",
          "हैं goes with आप; do not change it to है here.",
        ],
      },
      {
        hi: "मैं ठीक हूँ।",
        romanization: "main theek hoon.",
        vi: "Tôi khỏe / tôi ổn.",
        en: "I am fine.",
        pronunciation_focus: [
          "मैं có âm mũi; romanization main chỉ là gần đúng.",
          "हूँ dùng với मैं.",
        ],
        pronunciation_focus_en: [
          "मैं is nasalized; main is only an approximation.",
          "हूँ goes with मैं.",
        ],
      },
      {
        hi: "धन्यवाद।",
        romanization: "dhanyavaad.",
        vi: "Cảm ơn.",
        en: "Thank you.",
      },
      {
        hi: "माफ़ कीजिए।",
        romanization: "maaf kijiye.",
        vi: "Xin lỗi / xin phép.",
        en: "Sorry / excuse me.",
      },
    ],
    dialogue: [
      {
        cell_id: "9db38c7a-e5d8-4e81-bc99-5cac996b1bb7",
        speaker: "A",
        hi: "नमस्ते, आप कैसे हैं?",
        romanization: "namaste, aap kaise hain?",
        vi: "Xin chào, bạn khỏe không?",
        en: "Hello, how are you?",
      },
      {
        cell_id: "7cfec155-4dad-4063-84f0-4d6cad10a929",
        speaker: "B",
        hi: "मैं ठीक हूँ, धन्यवाद।",
        romanization: "main theek hoon, dhanyavaad.",
        vi: "Tôi khỏe, cảm ơn.",
        en: "I am fine, thank you.",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "मैं ठीक __।",
        answer: "हूँ",
        accepted_answers: ["हूं"],
        hint_vi: "Dùng dạng đi với मैं.",
        hint_en: "Use the form that goes with मैं.",
      },
      {
        type: "translation",
        vi: "Xin chào, bạn khỏe không?",
        en: "Hello, how are you?",
        hi: "नमस्ते, आप कैसे हैं?",
        romanization: "namaste, aap kaise hain?",
      },
    ],
    cultural_notes_vi:
      "आप là lựa chọn lịch sự an toàn. तुम thân mật hơn và không nên dùng với người lạ trong bài đầu.",
    cultural_notes_en:
      "आप is the safe polite choice. तुम is more familiar and should not be used with strangers in the first lessons.",
    tip_advice_vi:
      "Hãy học cả cặp câu hỏi - đáp: आप कैसे हैं? / मैं ठीक हूँ।",
    tip_advice_en:
      "Learn the exchange as a pair: आप कैसे हैं? / मैं ठीक हूँ।",
  },
  {
    id: "hindi_a1_introductions_identity",
    level: "A1",
    category: "introductions",
    title_vi: "Giới thiệu tên và quê quán",
    title_en: "Introducing name and origin",
    intro_vi:
      "Dùng câu rất ngắn để nói tên, quốc gia, và ngôn ngữ. Trọng tâm là trật tự câu Hindi và dạng lịch sự.",
    intro_en:
      "Use very short sentences to say your name, country, and language. The focus is Hindi word order and polite forms.",
    vocabulary: [
      { cell_id: "10bffca5-757c-4263-a244-f8f7d2c90d9c", hi: "नाम", romanization: "naam", vi: "tên", en: "name", pos: "n.m." },
      { cell_id: "ed63a1fb-f96d-4d94-ac7e-a5e51b73f460", hi: "मेरा", romanization: "mera", vi: "của tôi (giống đực)", en: "my (masc.)", pos: "possessive" },
      { cell_id: "2e0199ff-1ea5-4d52-b268-c4bbb2175171", hi: "मैं", romanization: "main", vi: "tôi", en: "I", pos: "pronoun" },
      { cell_id: "a303c490-8bc5-40be-b320-092eb0dfcd33", hi: "वियतनाम", romanization: "Vietnam", vi: "Việt Nam", en: "Vietnam", pos: "place" },
      { cell_id: "d73199b1-a0b8-44ba-95ff-a3d4d5bcb5fe", hi: "से", romanization: "se", vi: "từ / đến từ", en: "from / by", pos: "postposition" },
    ],
    sentences: [
      {
        hi: "मेरा नाम लान है।",
        romanization: "mera naam Lan hai.",
        vi: "Tên tôi là Lan.",
        en: "My name is Lan.",
        pronunciation_focus: [
          "नाम là danh từ giống đực, nên dùng मेरा.",
          "Động từ है đứng cuối câu.",
        ],
        pronunciation_focus_en: [
          "नाम is masculine, so use मेरा.",
          "The verb है stands at the end.",
        ],
      },
      {
        hi: "मैं वियतनाम से हूँ।",
        romanization: "main Vietnam se hoon.",
        vi: "Tôi đến từ Việt Nam.",
        en: "I am from Vietnam.",
        pronunciation_focus: [
          "से đứng sau danh từ, không đứng trước như 'from' trong tiếng Anh.",
          "Người Việt dễ đặt từ chỉ quan hệ trước danh từ; Hindi dùng hậu từ.",
        ],
        pronunciation_focus_en: [
          "से comes after the noun, unlike English 'from'.",
          "Hindi uses postpositions, not prepositions.",
        ],
      },
      {
        hi: "मैं हिंदी सीख रहा हूँ।",
        romanization: "main Hindi seekh raha hoon.",
        vi: "Tôi đang học tiếng Hindi. (người nói nam)",
        en: "I am learning Hindi. (male speaker)",
        note_vi: "Người nói nữ dùng सीख रही हूँ.",
        note_en: "A female speaker says सीख रही हूँ.",
      },
    ],
    dialogue: [
      {
        cell_id: "b26126b9-c791-4926-b73c-aea260f6dc26",
        speaker: "A",
        hi: "आपका नाम क्या है?",
        romanization: "aapka naam kya hai?",
        vi: "Tên bạn là gì?",
        en: "What is your name?",
      },
      {
        cell_id: "55a5591d-b647-46b8-bc7e-72ee81b2e2cf",
        speaker: "B",
        hi: "मेरा नाम लान है।",
        romanization: "mera naam Lan hai.",
        vi: "Tên tôi là Lan.",
        en: "My name is Lan.",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "मेरा नाम लान __।",
        answer: "है",
        hint_vi: "Động từ 'là' ở hiện tại.",
        hint_en: "The present copula.",
      },
      {
        type: "translation",
        vi: "Tôi đến từ Việt Nam.",
        en: "I am from Vietnam.",
        hi: "मैं वियतनाम से हूँ।",
        romanization: "main Vietnam se hoon.",
      },
    ],
    cultural_notes_vi:
      "Tên riêng nước ngoài thường giữ nguyên cách viết Latin trong đời thực, nhưng bài học vẫn ưu tiên nhận diện cấu trúc Hindi.",
    cultural_notes_en:
      "Foreign names often remain in Latin script in real contexts, but the lesson still prioritizes Hindi sentence structure.",
    tip_advice_vi:
      "Ghi nhớ khung: मेरा नाम ___ है। và मैं ___ से हूँ।",
    tip_advice_en:
      "Memorize the frames: मेरा नाम ___ है। and मैं ___ से हूँ।",
  },
  {
    id: "hindi_a1_numbers_prices",
    level: "A1",
    category: "numbers_time",
    title_vi: "Số 0-10 và hỏi giá",
    title_en: "Numbers 0-10 and asking prices",
    intro_vi:
      "Bài này giới thiệu số cơ bản và câu hỏi giá. Devanagari digits được nhận diện nhưng chữ số Latin vẫn có thể xuất hiện trong đời thực.",
    intro_en:
      "This lesson introduces basic numbers and asking prices. Devanagari digits are recognized, but Latin digits can still appear in real life.",
    vocabulary: [
      { cell_id: "880155a5-8b45-4c3e-a5b7-defb32b4fc89", hi: "०", romanization: "shunya", vi: "số 0", en: "zero", pos: "digit" },
      { cell_id: "5d46bd8d-8e30-4ce0-a034-ce7fd16ae02c", hi: "१", romanization: "ek", vi: "số 1", en: "one", pos: "digit" },
      { cell_id: "32b67576-e0d5-4402-a42b-be4eed0a5c3d", hi: "२", romanization: "do", vi: "số 2", en: "two", pos: "digit" },
      { cell_id: "06671d8f-facb-4379-81af-6abb6ba55f18", hi: "तीन", romanization: "teen", vi: "ba", en: "three", pos: "number" },
      { cell_id: "a4704da0-b100-4e0a-adf1-9ce11e6def2a", hi: "दस", romanization: "das", vi: "mười", en: "ten", pos: "number" },
      { cell_id: "68c9afd7-2c3c-4b10-bd60-b96e1eba68ff", hi: "कितना", romanization: "kitna", vi: "bao nhiêu", en: "how much", pos: "question" },
    ],
    sentences: [
      {
        hi: "यह कितना है?",
        romanization: "yah kitna hai?",
        vi: "Cái này bao nhiêu tiền?",
        en: "How much is this?",
        pronunciation_focus: [
          "कितना dùng cho danh từ giống đực/số ít trong khung cơ bản này.",
          "है vẫn đứng cuối câu hỏi.",
        ],
        pronunciation_focus_en: [
          "कितना is used for masculine/singular in this starter frame.",
          "है still stands at the end of the question.",
        ],
      },
      {
        hi: "यह दस रुपये है।",
        romanization: "yah das rupaye hai.",
        vi: "Cái này là mười rupee.",
        en: "This is ten rupees.",
      },
      {
        hi: "मेरे पास पाँच रुपये हैं।",
        romanization: "mere paas paanch rupaye hain.",
        vi: "Tôi có năm rupee.",
        en: "I have five rupees.",
        note_vi: "Hindi dùng मेरे पास... cho nghĩa 'tôi có...'",
        note_en: "Hindi uses मेरे पास... for 'I have...'",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối số với nghĩa.",
        instruction_en: "Match each number with its meaning.",
        pairs: [
          { hi: "१", meaning_vi: "một", meaning_en: "one" },
          { hi: "२", meaning_vi: "hai", meaning_en: "two" },
          { hi: "दस", meaning_vi: "mười", meaning_en: "ten" },
        ],
      },
      {
        type: "translation",
        vi: "Cái này bao nhiêu tiền?",
        en: "How much is this?",
        hi: "यह कितना है?",
        romanization: "yah kitna hai?",
      },
    ],
    cultural_notes_vi:
      "Ở Ấn Độ, bảng hiệu có thể dùng chữ số Latin, Devanagari, hoặc cả hai. Bài học nhận diện cả hai nhưng không thay thế chữ Hindi.",
    cultural_notes_en:
      "Signs in India may use Latin digits, Devanagari digits, or both. This lesson recognizes both but does not replace Hindi script.",
    tip_advice_vi:
      "Học giá theo cả cụm: यह कितना है? / यह दस रुपये है।",
    tip_advice_en:
      "Learn prices as an exchange: यह कितना है? / यह दस रुपये है।",
  },
  {
    id: "hindi_a1_food_requests",
    level: "A1",
    category: "food_shopping",
    title_vi: "Gọi món rất đơn giản",
    title_en: "Very simple food requests",
    intro_vi:
      "Học cách gọi nước, trà, cơm và nói 'tôi muốn...' bằng câu lịch sự cơ bản.",
    intro_en:
      "Learn how to ask for water, tea, rice, and say 'I want...' with a basic polite sentence.",
    vocabulary: [
      { cell_id: "c87ca5ab-5345-4580-a4c9-2acb01308d22", hi: "पानी", romanization: "paani", vi: "nước", en: "water", pos: "n.m." },
      { cell_id: "558c6c29-90b0-4674-9f4a-d19a2c2f43c6", hi: "चाय", romanization: "chai", vi: "trà", en: "tea", pos: "n.f." },
      { cell_id: "63668c0e-1af1-4ed0-9899-d9b52cbdcbab", hi: "चावल", romanization: "chaaval", vi: "cơm/gạo", en: "rice", pos: "n.m." },
      { cell_id: "617b4128-025a-4f62-b0a7-573b8c3eaf15", hi: "रोटी", romanization: "roti", vi: "bánh mì dẹt roti", en: "roti / flatbread", pos: "n.f." },
      { cell_id: "c54b91d9-71db-4112-8056-d359245c154f", hi: "चाहिए", romanization: "chahiye", vi: "muốn/cần", en: "want/need", pos: "modal" },
    ],
    sentences: [
      {
        hi: "मुझे पानी चाहिए।",
        romanization: "mujhe paani chahiye.",
        vi: "Tôi muốn nước.",
        en: "I want water.",
        pronunciation_focus: [
          "मुझे ... चाहिए là khung lịch sự để yêu cầu.",
          "पानी có nguyên âm dài aa và ii.",
        ],
        pronunciation_focus_en: [
          "मुझे ... चाहिए is a polite frame for requesting.",
          "पानी has long aa and ii vowels.",
        ],
      },
      {
        hi: "मुझे चाय चाहिए।",
        romanization: "mujhe chai chahiye.",
        vi: "Tôi muốn trà.",
        en: "I want tea.",
      },
      {
        hi: "कृपया रोटी दीजिए।",
        romanization: "kripaya roti dijiye.",
        vi: "Làm ơn cho tôi roti.",
        en: "Please give me roti.",
        pronunciation_focus: [
          "दीजिए là dạng yêu cầu lịch sự.",
          "Roti là món ăn cụ thể; không dịch máy thành 'bread' trong mọi ngữ cảnh.",
        ],
        pronunciation_focus_en: [
          "दीजिए is a polite request form.",
          "Roti is a specific food; do not flatten it to 'bread' in every context.",
        ],
      },
    ],
    dialogue: [
      {
        cell_id: "902ece50-832c-4b9f-ad49-b91b5ff1cda4",
        speaker: "Customer",
        hi: "मुझे पानी चाहिए।",
        romanization: "mujhe paani chahiye.",
        vi: "Tôi muốn nước.",
        en: "I want water.",
      },
      {
        cell_id: "69c7c4cc-acc9-418c-8fc1-3e1249fd5c78",
        speaker: "Server",
        hi: "जी, अभी।",
        romanization: "ji, abhi.",
        vi: "Vâng, ngay bây giờ.",
        en: "Yes, right away.",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "मुझे पानी ___।",
        answer: "चाहिए",
        hint_vi: "Từ dùng cho 'muốn/cần'.",
        hint_en: "The word used for 'want/need'.",
      },
      {
        type: "translation",
        vi: "Làm ơn cho tôi trà.",
        en: "Please give me tea.",
        hi: "कृपया चाय दीजिए।",
        romanization: "kripaya chai dijiye.",
      },
    ],
    cultural_notes_vi:
      "जी có thể làm câu nghe lịch sự hơn. Người mới học nên dùng câu ngắn và rõ thay vì cố nói quá phức tạp.",
    cultural_notes_en:
      "जी can make speech sound more polite. Beginners should use short, clear sentences rather than overcomplicated phrasing.",
    tip_advice_vi:
      "Hai khung cần nhớ: मुझे ___ चाहिए। và कृपया ___ दीजिए।",
    tip_advice_en:
      "Remember two frames: मुझे ___ चाहिए। and कृपया ___ दीजिए।",
  },
];

export default lessons;
