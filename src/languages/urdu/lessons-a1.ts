// Urdu A1 starter lessons for Vietnamese and English learners.
// Urdu target text is authored in Urdu script first. Romanization is a learner
// aid only and must not replace native-script answers.

export type UrduCategoryId =
  | "script_orientation"
  | "greetings_politeness"
  | "introductions_identity"
  | "classroom_survival"
  | "numbers_time_prices";

export type UrduCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type UrduSentence = {
  ur: string;
  romanization: string;
  en: string;
  vi: string;
  pronunciation_focus?: string[];
  pronunciation_focus_en?: string[];
  note_vi?: string;
  note_en?: string;
};

export type UrduVocabEntry = {
  cell_id?: string;
  ur: string;
  romanization: string;
  en: string;
  vi: string;
  pos?: string;
};

export type UrduDialogueLine = {
  cell_id?: string;
  speaker: string;
  ur: string;
  romanization: string;
  en: string;
  vi: string;
  register?: "neutral" | "polite" | "formal";
};

export type UrduExercise =
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
      pairs: Array<{ ur: string; meaning_vi: string; meaning_en?: string }>;
    }
  | {
      type: "translation";
      vi: string;
      en: string;
      ur: string;
      romanization?: string;
      accepted_answers?: string[];
    };

export type UrduLesson = {
  id: string;
  level: UrduCefrLevel;
  category: UrduCategoryId;
  title_vi: string;
  title_en: string;
  intro_vi: string;
  intro_en: string;
  vocabulary: UrduVocabEntry[];
  sentences: UrduSentence[];
  dialogue?: UrduDialogueLine[];
  exercises?: UrduExercise[];
  cultural_notes_vi?: string;
  cultural_notes_en?: string;
  tip_advice_vi?: string;
  tip_advice_en?: string;
  register_notes_vi?: string;
  register_notes_en?: string;
};

export const lessons: UrduLesson[] = [
  {
    id: "urdu_a1_script_direction_letters",
    level: "A1",
    category: "script_orientation",
    title_vi: "Hướng đọc và chữ Urdu đầu tiên",
    title_en: "Reading direction and first Urdu letters",
    intro_vi:
      "Urdu viết từ phải sang trái. Bài này giúp nhận diện hình chữ trong vài từ rất ngắn trước khi học bảng chữ cái đầy đủ.",
    intro_en:
      "Urdu is written from right to left. This lesson builds recognition of a few short word shapes before the full alphabet.",
    vocabulary: [
      { cell_id: "466aa3a2-f26f-49a0-8376-bc864a17055a", ur: "ا", romanization: "alif", en: "alif", vi: "chữ alif", pos: "letter" },
      { cell_id: "153be2ac-64e1-48e0-9a72-7de355eff44c", ur: "ب", romanization: "be", en: "be", vi: "chữ be", pos: "letter" },
      { cell_id: "44fc2782-72f4-4021-865f-c416ce637a12", ur: "م", romanization: "miim", en: "miim", vi: "chữ miim", pos: "letter" },
      { cell_id: "a98e6129-2501-45d7-8c5f-fab91c8d28d3", ur: "ن", romanization: "nuun", en: "nuun", vi: "chữ nuun", pos: "letter" },
      { cell_id: "d334e2ef-956d-46f0-8ad5-8c6f51d4792c", ur: "سلام", romanization: "salaam", en: "peace / hello", vi: "bình an / xin chào", pos: "noun" },
      { cell_id: "73dabe53-fa5f-43a2-8694-b3352366f40d", ur: "نام", romanization: "naam", en: "name", vi: "tên", pos: "noun" },
    ],
    sentences: [
      {
        ur: "سلام",
        romanization: "salaam",
        en: "Peace / hello.",
        vi: "Bình an / xin chào.",
        pronunciation_focus: [
          "Đọc từ phải sang trái: س rồi ل rồi ا rồi م.",
          "aa trong romanization là nguyên âm dài, không phải dấu tiếng Việt.",
        ],
        pronunciation_focus_en: [
          "Read the word right to left: س then ل then ا then م.",
          "aa marks a long vowel, not English stress.",
        ],
      },
      {
        ur: "میرا نام",
        romanization: "mera naam",
        en: "my name",
        vi: "tên của tôi",
        note_vi:
          "Urdu nối chữ trong từ, nên hình chữ thay đổi theo vị trí.",
        note_en:
          "Urdu letters connect inside words, so a letter shape changes by position.",
      },
      {
        ur: "اردو",
        romanization: "urdu",
        en: "Urdu",
        vi: "tiếng Urdu",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối chữ/từ Urdu với nghĩa.",
        instruction_en: "Match the Urdu item with its meaning.",
        pairs: [
          { ur: "سلام", meaning_vi: "xin chào / bình an", meaning_en: "peace / hello" },
          { ur: "نام", meaning_vi: "tên", meaning_en: "name" },
          { ur: "ا", meaning_vi: "chữ alif", meaning_en: "letter alif" },
        ],
      },
      {
        type: "fill-blank",
        question: "Complete the word: سلا_",
        answer: "م",
        accepted_answers: ["م"],
        hint_vi: "Từ đầy đủ là سلام.",
        hint_en: "The full word is سلام.",
      },
    ],
    cultural_notes_vi:
      "Urdu dùng chữ Perso-Arabic và thường được in theo phong cách Nastaliq, nhưng giai đoạn đầu chỉ cần đọc được chữ rõ ràng.",
    cultural_notes_en:
      "Urdu uses a Perso-Arabic script and is often printed in a Nastaliq style, but the first goal is clear recognition.",
    tip_advice_vi:
      "Đừng đọc từng ký tự theo thói quen trái sang phải. Hãy nhìn cả cụm từ từ bên phải trước.",
    tip_advice_en:
      "Do not scan letter by letter from the left. Look at the whole word from the right edge first.",
  },
  {
    id: "urdu_a1_greetings_politeness",
    level: "A1",
    category: "greetings_politeness",
    title_vi: "Chào hỏi lịch sự với آپ",
    title_en: "Polite greetings with aap",
    intro_vi:
      "Bài này dùng آپ làm đại từ mặc định để giữ lịch sự trong chào hỏi. Không dùng تم làm mặc định ở giai đoạn đầu.",
    intro_en:
      "This lesson uses آپ as the default polite pronoun for greetings. It does not make تم the beginner default.",
    vocabulary: [
      { cell_id: "2beee3d8-9e8a-49bd-9a16-a5b9c35b981f", ur: "السلام علیکم", romanization: "as-salaam alaikum", en: "hello / peace be upon you", vi: "xin chào trang trọng", pos: "greeting" },
      { cell_id: "86169753-3408-431b-8b79-f199d7eb91b3", ur: "وعلیکم السلام", romanization: "wa-alaikum as-salaam", en: "reply to the greeting", vi: "lời đáp chào", pos: "reply" },
      { cell_id: "6aee500b-cac7-46e0-980d-a62b5b158db1", ur: "آپ", romanization: "aap", en: "you, polite", vi: "bạn/quý vị lịch sự", pos: "pronoun" },
      { cell_id: "b636fb29-38e4-432f-8595-520edb2fab4c", ur: "کیسے", romanization: "kaise", en: "how", vi: "như thế nào", pos: "question word" },
      { cell_id: "0c5f35b2-3546-4be1-9ab7-533bf3333758", ur: "ٹھیک", romanization: "theek", en: "fine / okay", vi: "ổn", pos: "adjective" },
    ],
    sentences: [
      {
        ur: "السلام علیکم۔",
        romanization: "as-salaam alaikum.",
        en: "Hello.",
        vi: "Xin chào.",
        pronunciation_focus: [
          "ع trong علیکم là âm cổ họng nhẹ; người mới chỉ cần nhận diện trước.",
          "Dấu chấm Urdu là ۔, không phải dấu Latin.",
        ],
        pronunciation_focus_en: [
          "The ع in علیکم is a throat consonant; beginners only need to recognize it first.",
          "Urdu full stop is ۔, not the Latin period.",
        ],
      },
      {
        ur: "آپ کیسے ہیں؟",
        romanization: "aap kaise hain?",
        en: "How are you?",
        vi: "Bạn khỏe không?",
      },
      {
        ur: "میں ٹھیک ہوں۔",
        romanization: "main theek hoon.",
        en: "I am fine.",
        vi: "Tôi ổn.",
        note_vi: "ٹھ là âm bật hơi quặt lưỡi; đừng đọc như t thường.",
        note_en: "ٹھ is an aspirated retroflex sound; it is not a plain English t.",
      },
    ],
    dialogue: [
      {
        cell_id: "6f45f4d1-de00-43c8-9104-03e92c0a1306",
        speaker: "Sara",
        ur: "السلام علیکم۔",
        romanization: "as-salaam alaikum.",
        en: "Hello.",
        vi: "Xin chào.",
        register: "polite",
      },
      {
        cell_id: "97f539aa-5a36-425b-9670-0e8e703847b1",
        speaker: "Ali",
        ur: "وعلیکم السلام۔ آپ کیسے ہیں؟",
        romanization: "wa-alaikum as-salaam. aap kaise hain?",
        en: "Hello. How are you?",
        vi: "Chào lại. Bạn khỏe không?",
        register: "polite",
      },
      {
        cell_id: "47db532d-d429-49cc-9f47-32a09728a088",
        speaker: "Sara",
        ur: "میں ٹھیک ہوں، شکریہ۔",
        romanization: "main theek hoon, shukriya.",
        en: "I am fine, thank you.",
        vi: "Tôi ổn, cảm ơn.",
        register: "polite",
      },
    ],
    exercises: [
      {
        type: "translation",
        vi: "Bạn khỏe không?",
        en: "How are you?",
        ur: "آپ کیسے ہیں؟",
        romanization: "aap kaise hain?",
      },
      {
        type: "fill-blank",
        question: "میں ____ ہوں۔",
        answer: "ٹھیک",
        accepted_answers: ["ٹھیک"],
        hint_vi: "Từ này nghĩa là ổn.",
        hint_en: "This word means fine or okay.",
      },
    ],
    cultural_notes_vi:
      "آپ là lựa chọn an toàn khi nói với người mới gặp, người lớn tuổi, nhân viên cơ quan hoặc giáo viên.",
    cultural_notes_en:
      "آپ is the safe choice with new people, older people, staff, and teachers.",
    tip_advice_vi:
      "Hãy học cả cặp chào và đáp. Chỉ biết السلام علیکم mà không biết وعلیکم السلام sẽ làm hội thoại bị khựng.",
    tip_advice_en:
      "Learn the greeting and reply as a pair. Knowing only السلام علیکم makes the exchange incomplete.",
    register_notes_vi:
      "Bài này cố ý tránh đại từ thân mật để giữ chuẩn lịch sự cho người mới học.",
    register_notes_en:
      "This lesson intentionally avoids casual pronouns so beginners start with a respectful default.",
  },
  {
    id: "urdu_a1_introductions_identity",
    level: "A1",
    category: "introductions_identity",
    title_vi: "Giới thiệu tên, nơi đến và ngôn ngữ",
    title_en: "Introducing name, origin, and language",
    intro_vi:
      "Bài này luyện các câu giới thiệu cơ bản: tên, nơi đến và việc đang học Urdu.",
    intro_en:
      "This lesson practices basic self-introduction: name, origin, and learning Urdu.",
    vocabulary: [
      { cell_id: "c08e95fb-ecdc-4daf-9b8f-0fbdaa55b255", ur: "میرا", romanization: "mera", en: "my, masculine/default", vi: "của tôi", pos: "possessive" },
      { cell_id: "8bcc1f82-9fa2-40f1-bd84-b25b72b5e0de", ur: "نام", romanization: "naam", en: "name", vi: "tên", pos: "noun" },
      { cell_id: "c97d577f-bdf3-4029-99a5-ffcd1be664b9", ur: "ویت نام", romanization: "vietnam", en: "Vietnam", vi: "Việt Nam", pos: "place" },
      { cell_id: "8276e036-124b-4fab-90e0-41904b540c65", ur: "سے", romanization: "se", en: "from", vi: "từ", pos: "postposition" },
      { cell_id: "947ff6cc-7f66-4886-ac3a-6a104532d7b1", ur: "سیکھ رہا ہوں", romanization: "seekh raha hoon", en: "I am learning, male speaker", vi: "tôi đang học, người nói nam", pos: "phrase" },
      { cell_id: "c4e0f4b8-0c67-40a6-bbb7-9459f13ec6bc", ur: "سیکھ رہی ہوں", romanization: "seekh rahi hoon", en: "I am learning, female speaker", vi: "tôi đang học, người nói nữ", pos: "phrase" },
    ],
    sentences: [
      {
        ur: "میرا نام لن ہے۔",
        romanization: "mera naam Lin hai.",
        en: "My name is Lin.",
        vi: "Tên tôi là Lin.",
      },
      {
        ur: "میں ویت نام سے ہوں۔",
        romanization: "main Vietnam se hoon.",
        en: "I am from Vietnam.",
        vi: "Tôi đến từ Việt Nam.",
        note_vi: "سے đứng sau danh từ, khác tiếng Việt/Anh đặt giới từ trước danh từ.",
        note_en: "سے comes after the noun, unlike English prepositions before nouns.",
      },
      {
        ur: "میں اردو سیکھ رہی ہوں۔",
        romanization: "main urdu seekh rahi hoon.",
        en: "I am learning Urdu, female speaker.",
        vi: "Tôi đang học Urdu, người nói nữ.",
      },
    ],
    exercises: [
      {
        type: "translation",
        vi: "Tên tôi là An.",
        en: "My name is An.",
        ur: "میرا نام ان ہے۔",
        romanization: "mera naam An hai.",
      },
      {
        type: "matching",
        instruction_vi: "Nối cụm Urdu với chức năng.",
        instruction_en: "Match the Urdu phrase with its function.",
        pairs: [
          { ur: "میرا نام", meaning_vi: "mở đầu câu nói tên", meaning_en: "starts a name sentence" },
          { ur: "سے", meaning_vi: "từ / đến từ", meaning_en: "from" },
          { ur: "اردو", meaning_vi: "tiếng Urdu", meaning_en: "Urdu language" },
        ],
      },
    ],
    cultural_notes_vi:
      "Trong giới thiệu lịch sự, câu ngắn và rõ đủ tốt. Người mới học không cần dùng công thức quá trang trọng.",
    cultural_notes_en:
      "For polite introductions, short and clear sentences are enough. Beginners do not need very formal formulas.",
    tip_advice_vi:
      "Tập thay tên và nơi đến trước, sau đó mới thêm nghề nghiệp hoặc lý do học.",
    tip_advice_en:
      "Practice swapping name and origin first, then add job or reason for learning.",
  },
  {
    id: "urdu_a1_classroom_survival",
    level: "A1",
    category: "classroom_survival",
    title_vi: "Câu sinh tồn trong lớp học",
    title_en: "Classroom survival phrases",
    intro_vi:
      "Bài này dạy cách xin nhắc lại, xin nói chậm, hỏi nghĩa và xin viết ra một từ bằng giọng lịch sự.",
    intro_en:
      "This lesson teaches how to ask for repetition, slower speech, meaning, and written form politely.",
    vocabulary: [
      { cell_id: "a435f9b1-e713-46b7-9b33-5d1249ee35cc", ur: "براہ کرم", romanization: "baraah-e karam", en: "please", vi: "làm ơn / xin vui lòng", pos: "polite phrase" },
      { cell_id: "09655611-58f5-446b-8d3d-6bed9b87d00a", ur: "آہستہ", romanization: "aahista", en: "slowly", vi: "chậm", pos: "adverb" },
      { cell_id: "a8ac7901-e0f9-46b4-87ae-777a60ad8af8", ur: "بولیے", romanization: "boliye", en: "please speak", vi: "xin hãy nói", pos: "polite imperative" },
      { cell_id: "ae10b432-0faa-49e8-bef1-7ab21ea886d9", ur: "دوبارہ", romanization: "dobara", en: "again", vi: "lại / lần nữa", pos: "adverb" },
      { cell_id: "7c4a53dd-6891-40a5-b808-6c500c29bf45", ur: "مطلب", romanization: "matlab", en: "meaning", vi: "nghĩa", pos: "noun" },
      { cell_id: "daa4f53c-6a3c-4aef-9b69-9369b546ebbd", ur: "لکھ دیجیے", romanization: "likh dijiye", en: "please write it", vi: "xin hãy viết ra", pos: "polite imperative" },
    ],
    sentences: [
      {
        ur: "براہ کرم آہستہ بولیے۔",
        romanization: "baraah-e karam aahista boliye.",
        en: "Please speak slowly.",
        vi: "Xin hãy nói chậm.",
      },
      {
        ur: "دوبارہ کہیے۔",
        romanization: "dobara kahiye.",
        en: "Please say it again.",
        vi: "Xin hãy nói lại.",
      },
      {
        ur: "اس کا کیا مطلب ہے؟",
        romanization: "is ka kya matlab hai?",
        en: "What does this mean?",
        vi: "Cái này nghĩa là gì?",
      },
      {
        ur: "براہ کرم یہ لفظ لکھ دیجیے۔",
        romanization: "baraah-e karam yeh lafz likh dijiye.",
        en: "Please write this word.",
        vi: "Xin hãy viết từ này ra.",
      },
    ],
    dialogue: [
      {
        cell_id: "2bc229f6-fa85-4edb-a404-6807923f90ed",
        speaker: "Student",
        ur: "براہ کرم آہستہ بولیے۔",
        romanization: "baraah-e karam aahista boliye.",
        en: "Please speak slowly.",
        vi: "Xin hãy nói chậm.",
        register: "polite",
      },
      {
        cell_id: "b690a479-755f-4b0f-ba0e-d62b69a92ba3",
        speaker: "Teacher",
        ur: "جی، میں دوبارہ کہتا ہوں۔",
        romanization: "ji, main dobara kehta hoon.",
        en: "Yes, I will say it again.",
        vi: "Vâng, tôi sẽ nói lại.",
        register: "polite",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "براہ کرم ____ بولیے۔",
        answer: "آہستہ",
        accepted_answers: ["آہستہ"],
        hint_vi: "Từ cần điền nghĩa là chậm.",
        hint_en: "The missing word means slowly.",
      },
      {
        type: "translation",
        vi: "Cái này nghĩa là gì?",
        en: "What does this mean?",
        ur: "اس کا کیا مطلب ہے؟",
        romanization: "is ka kya matlab hai?",
      },
    ],
    cultural_notes_vi:
      "Các đuôi lịch sự như -یے giúp câu yêu cầu nghe mềm hơn. Đây là lựa chọn an toàn trong lớp học.",
    cultural_notes_en:
      "Polite endings like -یے soften requests. They are a safe classroom choice.",
    tip_advice_vi:
      "Học thuộc các câu này như công cụ lớp học; đừng chờ đến khi hiểu hết ngữ pháp mới dùng.",
    tip_advice_en:
      "Memorize these as classroom tools. Do not wait until every grammar detail is clear.",
    register_notes_vi: "براہ کرم trang trọng hơn please kiểu thân mật.",
    register_notes_en: "براہ کرم is more formal than a casual please.",
  },
  {
    id: "urdu_a1_numbers_time_prices",
    level: "A1",
    category: "numbers_time_prices",
    title_vi: "Số, giờ và giá tiền",
    title_en: "Numbers, time, and prices",
    intro_vi:
      "Bài này dùng số trong tình huống giá tiền và giờ. Hiển thị giữ số Urdu/Latin như tác giả viết; so khớp câu trả lời có thể gộp các dạng số sau này.",
    intro_en:
      "This lesson uses numbers for prices and time. Display keeps the authored digit style; answer matching can fold digit variants later.",
    vocabulary: [
      { cell_id: "cf214cb0-11bd-417a-96f5-3f67a2a961fd", ur: "ایک", romanization: "ek", en: "one", vi: "một", pos: "number" },
      { cell_id: "41648b75-5ebd-4438-a627-85e6b3ccede1", ur: "دو", romanization: "do", en: "two", vi: "hai", pos: "number" },
      { cell_id: "dee9f7f9-843d-4f38-89b3-ee754b1de411", ur: "تین", romanization: "tiin", en: "three", vi: "ba", pos: "number" },
      { cell_id: "95daee3a-75c0-495f-89a9-45db6e60202f", ur: "کتنے", romanization: "kitne", en: "how many / how much", vi: "bao nhiêu", pos: "question word" },
      { cell_id: "28dc30a5-09f8-4bda-a790-0430cfd28f10", ur: "قیمت", romanization: "qiimat", en: "price", vi: "giá", pos: "noun" },
      { cell_id: "7c18e763-cbea-42c8-969e-bc24a8efa8c8", ur: "بجے", romanization: "baje", en: "o'clock", vi: "giờ", pos: "time word" },
    ],
    sentences: [
      {
        ur: "یہ کتنے کا ہے؟",
        romanization: "yeh kitne ka hai?",
        en: "How much is this?",
        vi: "Cái này bao nhiêu tiền?",
      },
      {
        ur: "قیمت ۳۰۰ روپے ہے۔",
        romanization: "qiimat 300 rupaye hai.",
        en: "The price is 300 rupees.",
        vi: "Giá là 300 rupee.",
        note_vi: "۳۰۰ là dạng chữ số Urdu/Persian cho 300.",
        note_en: "۳۰۰ is the Urdu/Persian digit form for 300.",
      },
      {
        ur: "کلاس دو بجے ہے۔",
        romanization: "kilaas do baje hai.",
        en: "The class is at two o'clock.",
        vi: "Lớp học lúc hai giờ.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối số Urdu với nghĩa.",
        instruction_en: "Match the Urdu number with its meaning.",
        pairs: [
          { ur: "ایک", meaning_vi: "một", meaning_en: "one" },
          { ur: "دو", meaning_vi: "hai", meaning_en: "two" },
          { ur: "تین", meaning_vi: "ba", meaning_en: "three" },
        ],
      },
      {
        type: "translation",
        vi: "Lớp học lúc hai giờ.",
        en: "The class is at two o'clock.",
        ur: "کلاس دو بجے ہے۔",
        romanization: "kilaas do baje hai.",
      },
    ],
    cultural_notes_vi:
      "Người học có thể gặp cả số Urdu/Persian và số Latin trong đời sống. Đừng coi một kiểu số là lỗi khi chỉ đang đọc hiểu.",
    cultural_notes_en:
      "Learners may see both Urdu/Persian digits and Latin digits in daily life. Do not treat one style as wrong when the goal is reading.",
    tip_advice_vi:
      "Tập đọc số trong cụm ngắn như ۳۰۰ روپے thay vì học bảng số rời rạc quá lâu.",
    tip_advice_en:
      "Practice numbers in chunks such as ۳۰۰ روپے instead of staying too long with isolated number lists.",
  },
];

export const urduA1Lessons = lessons;
export default lessons;
