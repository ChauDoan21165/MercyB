// Urdu A2 elementary lessons for Vietnamese and English learners.
// Local lesson arrays only. Urdu script remains the canonical target text.

export type UrduCategoryId =
  | "daily_routine"
  | "family_home"
  | "food_shopping"
  | "transport_directions"
  | "appointments_health"
  | "housing_public_services";

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
  ur: string;
  romanization: string;
  en: string;
  vi: string;
  pos?: string;
};

export type UrduDialogueLine = {
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
    id: "urdu_a2_daily_routine",
    level: "A2",
    category: "daily_routine",
    title_vi: "Sinh hoạt hằng ngày",
    title_en: "Daily routine",
    intro_vi:
      "Bài này luyện thói quen hằng ngày với hiện tại thói quen và các từ nối thời gian đơn giản.",
    intro_en:
      "This lesson practices daily habits with present habitual forms and simple sequencing words.",
    vocabulary: [
      { ur: "صبح", romanization: "subah", en: "morning", vi: "buổi sáng", pos: "noun" },
      { ur: "دوپہر", romanization: "dopahar", en: "afternoon", vi: "buổi trưa/chiều", pos: "noun" },
      { ur: "شام", romanization: "shaam", en: "evening", vi: "buổi tối", pos: "noun" },
      { ur: "پھر", romanization: "phir", en: "then", vi: "sau đó", pos: "connector" },
      { ur: "کام", romanization: "kaam", en: "work", vi: "công việc", pos: "noun" },
      { ur: "پڑھتا ہوں", romanization: "parhta hoon", en: "I study/read, male speaker", vi: "tôi học/đọc, người nói nam", pos: "verb phrase" },
    ],
    sentences: [
      {
        ur: "میں صبح چائے پیتا ہوں۔",
        romanization: "main subah chai peeta hoon.",
        en: "I drink tea in the morning, male speaker.",
        vi: "Tôi uống trà vào buổi sáng, người nói nam.",
        note_vi: "پیتا đổi thành پیتی nếu người nói là nữ.",
        note_en: "پیتا changes to پیتی for a female speaker.",
      },
      {
        ur: "پھر میں کام پر جاتا ہوں۔",
        romanization: "phir main kaam par jaata hoon.",
        en: "Then I go to work, male speaker.",
        vi: "Sau đó tôi đi làm, người nói nam.",
      },
      {
        ur: "شام کو میں اردو پڑھتی ہوں۔",
        romanization: "shaam ko main urdu parhti hoon.",
        en: "In the evening I study Urdu, female speaker.",
        vi: "Buổi tối tôi học Urdu, người nói nữ.",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "میں صبح چائے ____ ہوں۔",
        answer: "پیتا",
        accepted_answers: ["پیتا", "پیتی"],
        hint_vi: "Chọn dạng theo giới của người nói.",
        hint_en: "Choose the form according to the speaker's gender.",
      },
      {
        type: "translation",
        vi: "Sau đó tôi đi làm.",
        en: "Then I go to work.",
        ur: "پھر میں کام پر جاتا ہوں۔",
        romanization: "phir main kaam par jaata hoon.",
      },
    ],
    cultural_notes_vi:
      "Urdu thường dùng từ nối ngắn như پھر để kể sinh hoạt theo trình tự rõ ràng.",
    cultural_notes_en:
      "Urdu often uses short connectors like پھر to narrate routines clearly.",
    tip_advice_vi:
      "Học các cặp nam/nữ như جاتا/جاتی và پیتا/پیتی bằng câu hoàn chỉnh.",
    tip_advice_en:
      "Learn gendered pairs such as جاتا/جاتی and پیتا/پیتی inside full sentences.",
  },
  {
    id: "urdu_a2_family_home",
    level: "A2",
    category: "family_home",
    title_vi: "Gia đình và nhà ở",
    title_en: "Family and home",
    intro_vi:
      "Bài này luyện từ gia đình, sở hữu và giới thiệu nhà bằng câu ngắn lịch sự.",
    intro_en:
      "This lesson practices family words, possession, and describing home in short polite sentences.",
    vocabulary: [
      { ur: "والد", romanization: "walid", en: "father", vi: "cha", pos: "noun" },
      { ur: "والدہ", romanization: "walida", en: "mother", vi: "mẹ", pos: "noun" },
      { ur: "بھائی", romanization: "bhai", en: "brother", vi: "anh/em trai", pos: "noun" },
      { ur: "بہن", romanization: "behen", en: "sister", vi: "chị/em gái", pos: "noun" },
      { ur: "گھر", romanization: "ghar", en: "home/house", vi: "nhà", pos: "noun" },
      { ur: "کے پاس", romanization: "ke paas", en: "to have / near", vi: "có / ở gần", pos: "postposition phrase" },
    ],
    sentences: [
      {
        ur: "میرے والد ڈاکٹر ہیں۔",
        romanization: "mere walid doctor hain.",
        en: "My father is a doctor.",
        vi: "Cha tôi là bác sĩ.",
      },
      {
        ur: "میری بہن طالبہ ہے۔",
        romanization: "meri behen taliba hai.",
        en: "My sister is a student.",
        vi: "Chị/em gái tôi là học sinh/sinh viên.",
        note_vi: "میرے/میری đổi theo danh từ sở hữu, không giống tiếng Việt.",
        note_en: "میرے/میری changes with the possessed noun, unlike English my.",
      },
      {
        ur: "ہمارا گھر بازار کے پاس ہے۔",
        romanization: "hamara ghar bazaar ke paas hai.",
        en: "Our home is near the market.",
        vi: "Nhà chúng tôi ở gần chợ.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        ur: "آپ کا گھر کہاں ہے؟",
        romanization: "aap ka ghar kahan hai?",
        en: "Where is your home?",
        vi: "Nhà bạn ở đâu?",
        register: "polite",
      },
      {
        speaker: "B",
        ur: "ہمارا گھر بازار کے پاس ہے۔",
        romanization: "hamara ghar bazaar ke paas hai.",
        en: "Our home is near the market.",
        vi: "Nhà chúng tôi ở gần chợ.",
        register: "neutral",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ gia đình với nghĩa.",
        instruction_en: "Match the family word with its meaning.",
        pairs: [
          { ur: "والد", meaning_vi: "cha", meaning_en: "father" },
          { ur: "والدہ", meaning_vi: "mẹ", meaning_en: "mother" },
          { ur: "بہن", meaning_vi: "chị/em gái", meaning_en: "sister" },
        ],
      },
      {
        type: "translation",
        vi: "Nhà chúng tôi ở gần chợ.",
        en: "Our home is near the market.",
        ur: "ہمارا گھر بازار کے پاس ہے۔",
        romanization: "hamara ghar bazaar ke paas hai.",
      },
    ],
    cultural_notes_vi:
      "Trong bối cảnh lịch sự, từ والد/والدہ trang trọng hơn ابو/امی. Người mới học nên nhận biết cả hai về sau.",
    cultural_notes_en:
      "In polite contexts, والد/والدہ are more formal than ابو/امی. Beginners should learn to recognize both later.",
    tip_advice_vi:
      "Đừng dịch 'có' từng chữ; Urdu thường dùng کے پاس cho sở hữu trong nhiều câu cơ bản.",
    tip_advice_en:
      "Do not translate have word-for-word; Urdu often uses کے پاس for possession in basic sentences.",
  },
  {
    id: "urdu_a2_food_shopping",
    level: "A2",
    category: "food_shopping",
    title_vi: "Đồ ăn, mua sắm và hỏi giá",
    title_en: "Food, shopping, and asking prices",
    intro_vi:
      "Bài này luyện gọi món, hỏi giá và yêu cầu số lượng bằng giọng lịch sự hằng ngày.",
    intro_en:
      "This lesson practices ordering, asking prices, and requesting quantities in everyday polite Urdu.",
    vocabulary: [
      { ur: "چائے", romanization: "chai", en: "tea", vi: "trà", pos: "noun" },
      { ur: "روٹی", romanization: "roti", en: "bread / flatbread", vi: "bánh mì dẹt", pos: "noun" },
      { ur: "تازہ", romanization: "taaza", en: "fresh", vi: "tươi", pos: "adjective" },
      { ur: "چاہیے", romanization: "chahiye", en: "is needed / would like", vi: "cần / muốn", pos: "verb-like expression" },
      { ur: "کپ", romanization: "cup", en: "cup", vi: "cốc/tách", pos: "measure" },
      { ur: "روپے", romanization: "rupaye", en: "rupees", vi: "rupee", pos: "currency" },
    ],
    sentences: [
      {
        ur: "مجھے ایک کپ چائے چاہیے۔",
        romanization: "mujhe ek cup chai chahiye.",
        en: "I would like one cup of tea.",
        vi: "Tôi muốn một tách trà.",
      },
      {
        ur: "یہ روٹی تازہ ہے؟",
        romanization: "yeh roti taaza hai?",
        en: "Is this bread fresh?",
        vi: "Bánh này có tươi không?",
      },
      {
        ur: "یہ کتنے روپے کا ہے؟",
        romanization: "yeh kitne rupaye ka hai?",
        en: "How many rupees is this?",
        vi: "Cái này bao nhiêu rupee?",
      },
    ],
    dialogue: [
      {
        speaker: "Customer",
        ur: "مجھے دو روٹیاں چاہیے۔",
        romanization: "mujhe do rotiyan chahiye.",
        en: "I would like two flatbreads.",
        vi: "Tôi muốn hai bánh roti.",
        register: "polite",
      },
      {
        speaker: "Seller",
        ur: "جی، اور کچھ؟",
        romanization: "ji, aur kuch?",
        en: "Yes, anything else?",
        vi: "Vâng, còn gì nữa không?",
        register: "polite",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "مجھے ایک کپ چائے ____۔",
        answer: "چاہیے",
        accepted_answers: ["چاہیے"],
        hint_vi: "Cụm này diễn đạt 'muốn/cần'.",
        hint_en: "This expression means would like or need.",
      },
      {
        type: "translation",
        vi: "Cái này bao nhiêu rupee?",
        en: "How many rupees is this?",
        ur: "یہ کتنے روپے کا ہے؟",
        romanization: "yeh kitne rupaye ka hai?",
      },
    ],
    cultural_notes_vi:
      "جی là một hạt lịch sự rất hữu ích trong dịch vụ và mua bán.",
    cultural_notes_en:
      "جی is a useful politeness particle in service and shopping interactions.",
    tip_advice_vi:
      "Học cụm مجھے... چاہیے như một khung câu hoàn chỉnh trước khi phân tích từng từ.",
    tip_advice_en:
      "Learn مجھے... چاہیے as a complete sentence frame before analyzing every word.",
  },
  {
    id: "urdu_a2_transport_directions",
    level: "A2",
    category: "transport_directions",
    title_vi: "Đi lại và hỏi đường",
    title_en: "Transport and directions",
    intro_vi:
      "Bài này luyện hỏi xe buýt, rẽ phải/trái và đi thẳng. Hướng vật lý không phụ thuộc vào hướng chữ viết.",
    intro_en:
      "This lesson practices asking for buses, turning right/left, and going straight. Physical direction is separate from writing direction.",
    vocabulary: [
      { ur: "بس", romanization: "bus", en: "bus", vi: "xe buýt", pos: "noun" },
      { ur: "رکشہ", romanization: "riksha", en: "rickshaw", vi: "xe kéo/xe tuk-tuk", pos: "noun" },
      { ur: "دائیں", romanization: "dain", en: "right", vi: "bên phải", pos: "direction" },
      { ur: "بائیں", romanization: "bain", en: "left", vi: "bên trái", pos: "direction" },
      { ur: "سیدھا", romanization: "seedha", en: "straight", vi: "thẳng", pos: "direction" },
      { ur: "اسٹیشن", romanization: "station", en: "station", vi: "nhà ga/trạm", pos: "noun" },
    ],
    sentences: [
      {
        ur: "بس کہاں سے ملے گی؟",
        romanization: "bus kahan se milegi?",
        en: "Where can I get the bus?",
        vi: "Tôi có thể bắt xe buýt ở đâu?",
      },
      {
        ur: "دائیں مڑیں۔",
        romanization: "dain murain.",
        en: "Turn right.",
        vi: "Rẽ phải.",
      },
      {
        ur: "پھر سیدھا جائیں۔",
        romanization: "phir seedha jain.",
        en: "Then go straight.",
        vi: "Sau đó đi thẳng.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ chỉ hướng với nghĩa.",
        instruction_en: "Match the direction word with its meaning.",
        pairs: [
          { ur: "دائیں", meaning_vi: "phải", meaning_en: "right" },
          { ur: "بائیں", meaning_vi: "trái", meaning_en: "left" },
          { ur: "سیدھا", meaning_vi: "thẳng", meaning_en: "straight" },
        ],
      },
      {
        type: "translation",
        vi: "Tôi có thể bắt xe buýt ở đâu?",
        en: "Where can I get the bus?",
        ur: "بس کہاں سے ملے گی؟",
        romanization: "bus kahan se milegi?",
      },
    ],
    cultural_notes_vi:
      "Từ chỉ hướng như دائیں và بائیں nói về không gian thực, không nói về hướng đọc chữ Urdu.",
    cultural_notes_en:
      "Direction words like دائیں and بائیں describe real space, not Urdu reading direction.",
    tip_advice_vi:
      "Khi luyện hỏi đường, kết hợp cử chỉ và câu ngắn để tránh quá tải ngữ pháp.",
    tip_advice_en:
      "When practicing directions, combine gestures with short sentences to reduce grammar load.",
  },
  {
    id: "urdu_a2_appointments_health_basics",
    level: "A2",
    category: "appointments_health",
    title_vi: "Đặt lịch hẹn và triệu chứng cơ bản",
    title_en: "Appointments and basic symptoms",
    intro_vi:
      "Bài này luyện đặt lịch hẹn và nói triệu chứng đơn giản. Đây là thực hành ngôn ngữ, không phải lời khuyên y tế.",
    intro_en:
      "This lesson practices making appointments and naming simple symptoms. It is language practice, not medical advice.",
    vocabulary: [
      { ur: "وقت", romanization: "waqt", en: "time / appointment slot", vi: "thời gian / lịch hẹn", pos: "noun" },
      { ur: "لینا", romanization: "lena", en: "to take", vi: "lấy", pos: "verb" },
      { ur: "بخار", romanization: "bukhar", en: "fever", vi: "sốt", pos: "noun" },
      { ur: "درد", romanization: "dard", en: "pain", vi: "đau", pos: "noun" },
      { ur: "کل", romanization: "kal", en: "tomorrow / yesterday by context", vi: "ngày mai / hôm qua theo ngữ cảnh", pos: "time word" },
      { ur: "آ سکتا ہوں", romanization: "aa sakta hoon", en: "I can come, male speaker", vi: "tôi có thể đến, người nói nam", pos: "modal phrase" },
    ],
    sentences: [
      {
        ur: "مجھے وقت لینا ہے۔",
        romanization: "mujhe waqt lena hai.",
        en: "I need to make an appointment.",
        vi: "Tôi cần đặt lịch hẹn.",
      },
      {
        ur: "مجھے بخار ہے۔",
        romanization: "mujhe bukhar hai.",
        en: "I have a fever.",
        vi: "Tôi bị sốt.",
      },
      {
        ur: "کیا میں کل آ سکتی ہوں؟",
        romanization: "kya main kal aa sakti hoon?",
        en: "Can I come tomorrow, female speaker?",
        vi: "Ngày mai tôi có thể đến không, người nói nữ?",
      },
    ],
    dialogue: [
      {
        speaker: "Patient",
        ur: "مجھے وقت لینا ہے۔",
        romanization: "mujhe waqt lena hai.",
        en: "I need to make an appointment.",
        vi: "Tôi cần đặt lịch hẹn.",
        register: "polite",
      },
      {
        speaker: "Reception",
        ur: "آپ کل آ سکتے ہیں؟",
        romanization: "aap kal aa sakte hain?",
        en: "Can you come tomorrow?",
        vi: "Bạn có thể đến ngày mai không?",
        register: "polite",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "مجھے ____ ہے۔",
        answer: "بخار",
        accepted_answers: ["بخار", "درد"],
        hint_vi: "Điền một triệu chứng đơn giản.",
        hint_en: "Fill in a simple symptom.",
      },
      {
        type: "translation",
        vi: "Tôi cần đặt lịch hẹn.",
        en: "I need to make an appointment.",
        ur: "مجھے وقت لینا ہے۔",
        romanization: "mujhe waqt lena hai.",
      },
    ],
    cultural_notes_vi:
      "Trong bối cảnh dịch vụ, dùng آپ và câu ngắn rõ ràng thường lịch sự hơn cố nói quá phức tạp.",
    cultural_notes_en:
      "In service contexts, using آپ and clear short sentences is often more polite than overcomplicated speech.",
    tip_advice_vi:
      "کل có thể là hôm qua hoặc ngày mai; ngữ cảnh và thì sẽ làm rõ. Ở A2, học trong câu cụ thể.",
    tip_advice_en:
      "کل can mean yesterday or tomorrow; context and tense clarify it. At A2, learn it inside full sentences.",
  },
  {
    id: "urdu_a2_housing_public_services",
    level: "A2",
    category: "housing_public_services",
    title_vi: "Nhà ở, giấy tờ và dịch vụ công",
    title_en: "Housing, documents, and public services",
    intro_vi:
      "Bài này luyện hỏi nơi nộp giấy tờ, tiền thuê và biên nhận bằng Urdu đơn giản, không đi vào nội dung pháp lý.",
    intro_en:
      "This lesson practices asking where to submit documents, rent, and receipts in simple Urdu, without legal content.",
    vocabulary: [
      { ur: "فارم", romanization: "form", en: "form", vi: "mẫu đơn", pos: "noun" },
      { ur: "جمع کرنا", romanization: "jama karna", en: "to submit", vi: "nộp", pos: "verb phrase" },
      { ur: "کرایہ", romanization: "kiraya", en: "rent / fare", vi: "tiền thuê / cước", pos: "noun" },
      { ur: "شناختی کارڈ", romanization: "shinakhti card", en: "identity card", vi: "thẻ căn cước", pos: "noun" },
      { ur: "رسید", romanization: "raseed", en: "receipt", vi: "biên nhận", pos: "noun" },
      { ur: "دفتر", romanization: "daftar", en: "office", vi: "văn phòng", pos: "noun" },
    ],
    sentences: [
      {
        ur: "فارم کہاں جمع کرنا ہے؟",
        romanization: "form kahan jama karna hai?",
        en: "Where should the form be submitted?",
        vi: "Nộp mẫu đơn ở đâu?",
      },
      {
        ur: "کرایہ کب دینا ہے؟",
        romanization: "kiraya kab dena hai?",
        en: "When should the rent be paid?",
        vi: "Khi nào phải trả tiền thuê?",
      },
      {
        ur: "مجھے رسید چاہیے۔",
        romanization: "mujhe raseed chahiye.",
        en: "I need a receipt.",
        vi: "Tôi cần biên nhận.",
      },
    ],
    dialogue: [
      {
        speaker: "Visitor",
        ur: "فارم کہاں جمع کرنا ہے؟",
        romanization: "form kahan jama karna hai?",
        en: "Where should I submit the form?",
        vi: "Tôi nên nộp mẫu đơn ở đâu?",
        register: "polite",
      },
      {
        speaker: "Clerk",
        ur: "براہ کرم دفتر نمبر دو میں جمع کریں۔",
        romanization: "baraah-e karam daftar number do mein jama karen.",
        en: "Please submit it in office number two.",
        vi: "Xin vui lòng nộp ở văn phòng số hai.",
        register: "formal",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ dịch vụ với nghĩa.",
        instruction_en: "Match the service word with its meaning.",
        pairs: [
          { ur: "فارم", meaning_vi: "mẫu đơn", meaning_en: "form" },
          { ur: "رسید", meaning_vi: "biên nhận", meaning_en: "receipt" },
          { ur: "دفتر", meaning_vi: "văn phòng", meaning_en: "office" },
        ],
      },
      {
        type: "translation",
        vi: "Tôi cần biên nhận.",
        en: "I need a receipt.",
        ur: "مجھے رسید چاہیے۔",
        romanization: "mujhe raseed chahiye.",
      },
    ],
    cultural_notes_vi:
      "Bài này chỉ cung cấp ngôn ngữ giao tiếp ở quầy dịch vụ. Không giải thích thủ tục pháp lý hay hành chính cụ thể.",
    cultural_notes_en:
      "This lesson only provides service-counter language. It does not explain specific legal or administrative procedures.",
    tip_advice_vi:
      "Cụm براہ کرم... کریں là khung lịch sự hữu ích trong văn phòng và dịch vụ công.",
    tip_advice_en:
      "The frame براہ کرم... کریں is useful polite language in offices and public-service settings.",
    register_notes_vi:
      "جمع کریں lịch sự/trang trọng hơn mệnh lệnh ngắn.",
    register_notes_en:
      "جمع کریں is more polite/formal than a bare command.",
  },
];

export const urduA2Lessons = lessons;
export default lessons;
