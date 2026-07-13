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
      { cell_id: "a1080056-25e9-4b2b-9184-0547d39a65e4", ur: "صبح", romanization: "subah", en: "morning", vi: "buổi sáng", pos: "noun" },
      { cell_id: "cfa4eb58-f191-418b-bb12-7bc6f233b432", ur: "دوپہر", romanization: "dopahar", en: "afternoon", vi: "buổi trưa/chiều", pos: "noun" },
      { cell_id: "e8d9e4e7-bf9f-428e-ab69-824b52210e14", ur: "شام", romanization: "shaam", en: "evening", vi: "buổi tối", pos: "noun" },
      { cell_id: "75182f3e-0b28-4057-9871-9184483fcf80", ur: "پھر", romanization: "phir", en: "then", vi: "sau đó", pos: "connector" },
      { cell_id: "773cf27a-0e2f-41d4-914f-6a73f1f41960", ur: "کام", romanization: "kaam", en: "work", vi: "công việc", pos: "noun" },
      { cell_id: "4167e68f-36bb-46c0-80d2-62e45a7ca18d", ur: "پڑھتا ہوں", romanization: "parhta hoon", en: "I study/read, male speaker", vi: "tôi học/đọc, người nói nam", pos: "verb phrase" },
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
      { cell_id: "b739f804-0ba9-42d5-8eae-ce5f219dd44f", ur: "والد", romanization: "walid", en: "father", vi: "cha", pos: "noun" },
      { cell_id: "f891decf-a516-4833-9d42-e00c7d0dae4f", ur: "والدہ", romanization: "walida", en: "mother", vi: "mẹ", pos: "noun" },
      { cell_id: "507c899b-c414-492c-84d1-a56a9e71542c", ur: "بھائی", romanization: "bhai", en: "brother", vi: "anh/em trai", pos: "noun" },
      { cell_id: "77bebddd-93db-4f57-9f94-71e0edcf207a", ur: "بہن", romanization: "behen", en: "sister", vi: "chị/em gái", pos: "noun" },
      { cell_id: "f4fdfbeb-fd0d-4c65-b5b4-71820d3f32af", ur: "گھر", romanization: "ghar", en: "home/house", vi: "nhà", pos: "noun" },
      { cell_id: "9f3dffda-5f89-4348-9668-0deb80d6e0c1", ur: "کے پاس", romanization: "ke paas", en: "to have / near", vi: "có / ở gần", pos: "postposition phrase" },
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
        cell_id: "6e20f136-a1db-40db-8fdc-8c153606968b",
        speaker: "A",
        ur: "آپ کا گھر کہاں ہے؟",
        romanization: "aap ka ghar kahan hai?",
        en: "Where is your home?",
        vi: "Nhà bạn ở đâu?",
        register: "polite",
      },
      {
        cell_id: "e715f866-59ed-4e27-81e0-6f94a5823d80",
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
      { cell_id: "b1c79701-51c2-421a-a5a8-15d64b09806c", ur: "چائے", romanization: "chai", en: "tea", vi: "trà", pos: "noun" },
      { cell_id: "5c18fb41-ac28-4797-9825-54037b98c4fe", ur: "روٹی", romanization: "roti", en: "bread / flatbread", vi: "bánh mì dẹt", pos: "noun" },
      { cell_id: "9ef1248a-e4c5-4fbb-b94d-ab50dd9f0767", ur: "تازہ", romanization: "taaza", en: "fresh", vi: "tươi", pos: "adjective" },
      { cell_id: "3d84c99d-347e-4a6c-ad5d-c6a9efddc16e", ur: "چاہیے", romanization: "chahiye", en: "is needed / would like", vi: "cần / muốn", pos: "verb-like expression" },
      { cell_id: "5ab60c0e-a941-466d-aa3f-eeee1974f60f", ur: "کپ", romanization: "cup", en: "cup", vi: "cốc/tách", pos: "measure" },
      { cell_id: "49ae8480-5337-4340-8516-751d2ef76bb8", ur: "روپے", romanization: "rupaye", en: "rupees", vi: "rupee", pos: "currency" },
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
        cell_id: "344febd4-f197-4345-9972-d5f7962aaa4e",
        speaker: "Customer",
        ur: "مجھے دو روٹیاں چاہیے۔",
        romanization: "mujhe do rotiyan chahiye.",
        en: "I would like two flatbreads.",
        vi: "Tôi muốn hai bánh roti.",
        register: "polite",
      },
      {
        cell_id: "97b349b1-7772-4674-a7b5-08e3396bdb5c",
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
      { cell_id: "1934cb9e-f0b0-403e-bad2-d922d08c9ee7", ur: "بس", romanization: "bus", en: "bus", vi: "xe buýt", pos: "noun" },
      { cell_id: "5b71f3e5-ecca-42f3-8807-b978d262be25", ur: "رکشہ", romanization: "riksha", en: "rickshaw", vi: "xe kéo/xe tuk-tuk", pos: "noun" },
      { cell_id: "9417a9d0-884a-4243-8713-65078d72b851", ur: "دائیں", romanization: "dain", en: "right", vi: "bên phải", pos: "direction" },
      { cell_id: "688643b0-f08c-4e9b-8cff-4a45b833dee4", ur: "بائیں", romanization: "bain", en: "left", vi: "bên trái", pos: "direction" },
      { cell_id: "3e5eb743-8ae1-472b-aac8-e28817445772", ur: "سیدھا", romanization: "seedha", en: "straight", vi: "thẳng", pos: "direction" },
      { cell_id: "0adbf47a-0895-45d7-8d7e-00177dbc5be8", ur: "اسٹیشن", romanization: "station", en: "station", vi: "nhà ga/trạm", pos: "noun" },
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
      { cell_id: "f2e65c53-ad3d-43b2-9094-48ff2c75eb59", ur: "وقت", romanization: "waqt", en: "time / appointment slot", vi: "thời gian / lịch hẹn", pos: "noun" },
      { cell_id: "40a3cbc0-d8a3-4e88-b742-61e4a0e169ea", ur: "لینا", romanization: "lena", en: "to take", vi: "lấy", pos: "verb" },
      { cell_id: "33f336be-1520-4187-bb65-5866fb703f81", ur: "بخار", romanization: "bukhar", en: "fever", vi: "sốt", pos: "noun" },
      { cell_id: "3779f402-531e-42a6-aff3-a6eb82551d15", ur: "درد", romanization: "dard", en: "pain", vi: "đau", pos: "noun" },
      { cell_id: "84453e6f-3368-4f0e-935f-afec031865b1", ur: "کل", romanization: "kal", en: "tomorrow / yesterday by context", vi: "ngày mai / hôm qua theo ngữ cảnh", pos: "time word" },
      { cell_id: "277113c2-0da5-46c7-ae3d-1b755667dd3c", ur: "آ سکتا ہوں", romanization: "aa sakta hoon", en: "I can come, male speaker", vi: "tôi có thể đến, người nói nam", pos: "modal phrase" },
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
        cell_id: "91c05fe7-05e1-4190-9c4d-33dd98f6e7e9",
        speaker: "Patient",
        ur: "مجھے وقت لینا ہے۔",
        romanization: "mujhe waqt lena hai.",
        en: "I need to make an appointment.",
        vi: "Tôi cần đặt lịch hẹn.",
        register: "polite",
      },
      {
        cell_id: "f9a6e469-4613-4702-9385-1cdeb628f97c",
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
      { cell_id: "227b609f-c77f-4cff-b2a8-26456a534bd4", ur: "فارم", romanization: "form", en: "form", vi: "mẫu đơn", pos: "noun" },
      { cell_id: "70c98e6e-7a16-4c80-bd6f-08957f87a447", ur: "جمع کرنا", romanization: "jama karna", en: "to submit", vi: "nộp", pos: "verb phrase" },
      { cell_id: "ac1b9424-f1a4-474c-943a-f4b53bec1cbb", ur: "کرایہ", romanization: "kiraya", en: "rent / fare", vi: "tiền thuê / cước", pos: "noun" },
      { cell_id: "d0b6670f-9e99-46fe-b2b4-f1a285087a18", ur: "شناختی کارڈ", romanization: "shinakhti card", en: "identity card", vi: "thẻ căn cước", pos: "noun" },
      { cell_id: "ff016ebf-c060-444c-a38c-3aa5e1bb4455", ur: "رسید", romanization: "raseed", en: "receipt", vi: "biên nhận", pos: "noun" },
      { cell_id: "8c0af1c6-a82a-4fd4-be6d-7851cad55797", ur: "دفتر", romanization: "daftar", en: "office", vi: "văn phòng", pos: "noun" },
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
        cell_id: "ba08d9f5-5774-42bd-9829-698badd68733",
        speaker: "Visitor",
        ur: "فارم کہاں جمع کرنا ہے؟",
        romanization: "form kahan jama karna hai?",
        en: "Where should I submit the form?",
        vi: "Tôi nên nộp mẫu đơn ở đâu?",
        register: "polite",
      },
      {
        cell_id: "0f676f26-8d50-4ecc-9b77-cac84d0829e4",
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
