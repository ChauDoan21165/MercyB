// Punjabi A1-A2 quiz bank for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization is learner support. Native review is deferred.

export type PunjabiQuizType = "multiple_choice" | "fill_blank" | "matching" | "reorder";
export type PunjabiQuizTopic =
  | "greetings"
  | "numbers"
  | "family"
  | "food"
  | "shopping"
  | "directions"
  | "time"
  | "simple_verbs";

export type PunjabiQuizItem = {
  id: string;
  level: "A1" | "A2";
  type: PunjabiQuizType;
  topic: PunjabiQuizTopic;
  prompt_pa: string;
  prompt_romanization?: string;
  prompt_vi: string;
  prompt_en: string;
  options?: string[];
  answer: string | string[];
  explanation_vi: string;
  explanation_en: string;
  common_mistake: {
    audience: "vi" | "en" | "both";
    note_vi: string;
    note_en: string;
  };
};

export const punjabiQuizzes: PunjabiQuizItem[] = [
  {
    id: "pa_quiz_greeting_001",
    level: "A1",
    type: "multiple_choice",
    topic: "greetings",
    prompt_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਦਾ ਅਰਥ ਕੀ ਹੈ?",
    prompt_romanization: "sat sri akal da arth ki hai?",
    prompt_vi: "Cụm này nghĩa là gì?",
    prompt_en: "What does this greeting mean?",
    options: ["Xin chào / Hello", "Tạm biệt / Goodbye", "Xin lỗi / Sorry", "Bao nhiêu / How much"],
    answer: "Xin chào / Hello",
    explanation_vi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ là lời chào lịch sự phổ biến trong Punjabi.",
    explanation_en: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ is a common respectful Punjabi greeting.",
    common_mistake: {
      audience: "vi",
      note_vi: "Không thêm nguyên âm sau phụ âm cuối trong ਸਤ.",
      note_en: "Vietnamese speakers may add a final vowel after ਸਤ; stop on the final t.",
    },
  },
  {
    id: "pa_quiz_numbers_001",
    level: "A1",
    type: "matching",
    topic: "numbers",
    prompt_pa: "ਅੰਕਾਂ ਨੂੰ ਅਰਥ ਨਾਲ ਮਿਲਾਓ।",
    prompt_romanization: "ankan nu arth nal milao",
    prompt_vi: "Nối số Punjabi với nghĩa.",
    prompt_en: "Match Punjabi numbers with meanings.",
    options: ["ਇੱਕ = 1", "ਦੋ = 2", "ਤਿੰਨ = 3", "ਚਾਰ = 4"],
    answer: ["ਇੱਕ = 1", "ਦੋ = 2", "ਤਿੰਨ = 3", "ਚਾਰ = 4"],
    explanation_vi: "Các số A1 này nên học như cụm nhìn nhanh bằng Gurmukhi.",
    explanation_en: "These A1 numbers should be recognized quickly in Gurmukhi.",
    common_mistake: {
      audience: "both",
      note_vi: "Đừng học chỉ bằng romanization; cần nhận diện chữ Gurmukhi.",
      note_en: "Do not study only romanization; recognize the Gurmukhi forms.",
    },
  },
  {
    id: "pa_quiz_family_001",
    level: "A1",
    type: "fill_blank",
    topic: "family",
    prompt_pa: "ਇਹ ਮੇਰੀ ___ ਹੈ।",
    prompt_romanization: "ih meri ___ hai",
    prompt_vi: "Điền 'mẹ'.",
    prompt_en: "Fill in 'mother'.",
    answer: "ਮਾਂ",
    explanation_vi: "ਮਾਂ là 'mẹ'; ਮੇਰੀ phù hợp với danh từ giống cái trong mẫu này.",
    explanation_en: "ਮਾਂ means mother; ਮੇਰੀ fits the feminine noun in this pattern.",
    common_mistake: {
      audience: "en",
      note_vi: "Người nói tiếng Anh dễ dùng một dạng 'my' cho mọi danh từ.",
      note_en: "English speakers may expect one form of 'my'; Punjabi possessives can agree.",
    },
  },
  {
    id: "pa_quiz_food_001",
    level: "A1",
    type: "multiple_choice",
    topic: "food",
    prompt_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    prompt_romanization: "mainu pani chahida hai",
    prompt_vi: "Câu này nghĩa là gì?",
    prompt_en: "What does this sentence mean?",
    options: ["Tôi cần nước / I need water", "Tôi bán nước / I sell water", "Nước ở đâu? / Where is water?", "Tôi không uống nước / I do not drink water"],
    answer: "Tôi cần nước / I need water",
    explanation_vi: "ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ diễn đạt 'tôi cần/muốn ...' ở mức A1-A2.",
    explanation_en: "ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ expresses 'I need/want ...' at A1-A2.",
    common_mistake: {
      audience: "vi",
      note_vi: "Không dịch từng chữ theo thứ tự tiếng Việt 'tôi cần nước' rồi bỏ ਮੈਨੂੰ.",
      note_en: "Vietnamese speakers should keep the Punjabi frame ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ.",
    },
  },
  {
    id: "pa_quiz_shopping_001",
    level: "A1",
    type: "fill_blank",
    topic: "shopping",
    prompt_pa: "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?",
    prompt_romanization: "ih kinne da hai?",
    prompt_vi: "Câu này dùng để hỏi gì?",
    prompt_en: "What does this ask?",
    options: ["giá", "tên", "giờ", "đường"],
    answer: "giá",
    explanation_vi: "ਕਿੰਨੇ ਦਾ ਹੈ? là mẫu hỏi giá: 'bao nhiêu tiền?'",
    explanation_en: "ਕਿੰਨੇ ਦਾ ਹੈ? asks price: 'how much is it?'",
    common_mistake: {
      audience: "both",
      note_vi: "Đừng dùng ਸਸਤਾ 'rẻ' như câu hỏi giá.",
      note_en: "Do not use ਸਸਤਾ 'cheap' as the price question.",
    },
  },
  {
    id: "pa_quiz_directions_001",
    level: "A2",
    type: "reorder",
    topic: "directions",
    prompt_pa: "ਸਹੀ ਕ੍ਰਮ ਬਣਾਓ: ਸਟੇਸ਼ਨ / ਕਿੱਥੇ / ਹੈ",
    prompt_romanization: "sahi kram banao: station / kithe / hai",
    prompt_vi: "Sắp xếp thành câu: Nhà ga ở đâu?",
    prompt_en: "Reorder into: Where is the station?",
    answer: "ਸਟੇਸ਼ਨ ਕਿੱਥੇ ਹੈ?",
    explanation_vi: "ਕਿੱਥੇ thường đứng trước ਹੈ trong câu hỏi vị trí cơ bản.",
    explanation_en: "ਕਿੱਥੇ usually comes before ਹੈ in a basic location question.",
    common_mistake: {
      audience: "en",
      note_vi: "Không đặt 'is' ngay sau từ hỏi theo trật tự tiếng Anh.",
      note_en: "Do not copy English 'where is'; Punjabi keeps ਹੈ at the end here.",
    },
  },
  {
    id: "pa_quiz_time_001",
    level: "A2",
    type: "multiple_choice",
    topic: "time",
    prompt_pa: "ਹੁਣ ਕਿੰਨੇ ਵਜੇ ਹਨ?",
    prompt_romanization: "hun kinne vaje han?",
    prompt_vi: "Chọn nghĩa đúng.",
    prompt_en: "Choose the correct meaning.",
    options: ["Bây giờ mấy giờ? / What time is it now?", "Bạn đi đâu? / Where are you going?", "Giá bao nhiêu? / How much is it?", "Ai ở nhà? / Who is at home?"],
    answer: "Bây giờ mấy giờ? / What time is it now?",
    explanation_vi: "ਕਿੰਨੇ ਵਜੇ là cụm hỏi giờ.",
    explanation_en: "ਕਿੰਨੇ ਵਜੇ is the time-question phrase.",
    common_mistake: {
      audience: "both",
      note_vi: "ਕਿੰਨੇ có thể xuất hiện trong giá và giờ; nhìn danh từ đi kèm.",
      note_en: "ਕਿੰਨੇ appears in price and time questions; use the following noun for context.",
    },
  },
  {
    id: "pa_quiz_verbs_001",
    level: "A2",
    type: "reorder",
    topic: "simple_verbs",
    prompt_pa: "ਸਹੀ ਕ੍ਰਮ ਬਣਾਓ: ਮੈਂ / ਪੰਜਾਬੀ / ਸਿੱਖਦਾ / ਹਾਂ",
    prompt_romanization: "main / panjabi / sikhda / han",
    prompt_vi: "Sắp xếp thành: Tôi học Punjabi.",
    prompt_en: "Reorder into: I learn Punjabi.",
    answer: "ਮੈਂ ਪੰਜਾਬੀ ਸਿੱਖਦਾ ਹਾਂ।",
    explanation_vi: "Động từ chính ਸਿੱਖਦਾ đi trước ਹਾਂ trong hiện tại đơn.",
    explanation_en: "The main verb ਸਿੱਖਦਾ comes before ਹਾਂ in this present pattern.",
    common_mistake: {
      audience: "vi",
      note_vi: "Tiếng Việt không chia động từ theo người/giới; Punjabi có dạng như ਸਿੱਖਦਾ/ਸਿੱਖਦੀ.",
      note_en: "Vietnamese speakers should notice Punjabi verb agreement forms such as ਸਿੱਖਦਾ/ਸਿੱਖਦੀ.",
    },
  },
];

export default punjabiQuizzes;
