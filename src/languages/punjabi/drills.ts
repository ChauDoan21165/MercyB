// Punjabi A1-A2 drill bank. Gurmukhi is primary, with practical romanization,
// Vietnamese explanations, and English explanations. Native review is deferred.

export type PunjabiDrillType = "translation_awareness" | "substitution" | "transformation" | "micro_dialogue";
export type PunjabiDrillTopic =
  | "greetings"
  | "numbers"
  | "family"
  | "food"
  | "shopping"
  | "directions"
  | "time"
  | "simple_verbs";

export type PunjabiDrill = {
  id: string;
  level: "A1" | "A2";
  type: PunjabiDrillType;
  topic: PunjabiDrillTopic;
  title_vi: string;
  title_en: string;
  prompt_pa: string;
  romanization?: string;
  task_vi: string;
  task_en: string;
  model_answer: string;
  explanation_vi: string;
  explanation_en: string;
  common_mistake: {
    audience: "vi" | "en" | "both";
    note_vi: string;
    note_en: string;
  };
};

export const punjabiDrills: PunjabiDrill[] = [
  {
    id: "pa_drill_greeting_001",
    level: "A1",
    type: "micro_dialogue",
    topic: "greetings",
    title_vi: "Chào và đáp lại",
    title_en: "Greet and answer",
    prompt_pa: "A: ਸਤ ਸ੍ਰੀ ਅਕਾਲ। B: ___",
    romanization: "A: sat sri akal. B: ___",
    task_vi: "Điền một câu đáp lịch sự.",
    task_en: "Fill in a respectful reply.",
    model_answer: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ।",
    explanation_vi: "Thêm ਜੀ làm câu đáp mềm và lịch sự hơn.",
    explanation_en: "Adding ਜੀ makes the reply softer and more respectful.",
    common_mistake: {
      audience: "both",
      note_vi: "Không cần dịch 'hello' thành nhiều từ khác nhau ở A1; dùng cụm cố định trước.",
      note_en: "At A1, use the fixed greeting before trying many alternatives.",
    },
  },
  {
    id: "pa_drill_numbers_001",
    level: "A1",
    type: "translation_awareness",
    topic: "numbers",
    title_vi: "Số và chữ số",
    title_en: "Numbers and digits",
    prompt_pa: "ਦੋ ਚਾਹਾਂ",
    romanization: "do chahan",
    task_vi: "Nêu nghĩa và chú ý số đứng trước danh từ.",
    task_en: "Give the meaning and notice the number before the noun.",
    model_answer: "hai trà / two teas",
    explanation_vi: "ਦੋ đứng trước ਚਾਹਾਂ giống 'hai trà', nhưng danh từ có thể đổi dạng theo số.",
    explanation_en: "ਦੋ comes before ਚਾਹਾਂ like 'two teas', and the noun may show plural form.",
    common_mistake: {
      audience: "vi",
      note_vi: "Tiếng Việt không đổi danh từ số nhiều; Punjabi có thể đổi dạng.",
      note_en: "Vietnamese speakers should watch for Punjabi plural noun forms.",
    },
  },
  {
    id: "pa_drill_family_001",
    level: "A1",
    type: "substitution",
    topic: "family",
    title_vi: "Thay thành viên gia đình",
    title_en: "Substitute family members",
    prompt_pa: "ਇਹ ਮੇਰਾ ਭਰਾ ਹੈ।",
    romanization: "ih mera bhara hai",
    task_vi: "Thay 'anh/em trai' bằng 'mẹ'.",
    task_en: "Replace 'brother' with 'mother'.",
    model_answer: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ।",
    explanation_vi: "Đổi ਮੇਰਾ thành ਮੇਰੀ với ਮਾਂ.",
    explanation_en: "Change ਮੇਰਾ to ਮੇਰੀ with ਮਾਂ.",
    common_mistake: {
      audience: "en",
      note_vi: "Người nói tiếng Anh dễ giữ nguyên 'my' một dạng.",
      note_en: "English speakers often keep one 'my' form; Punjabi changes it here.",
    },
  },
  {
    id: "pa_drill_food_001",
    level: "A1",
    type: "substitution",
    topic: "food",
    title_vi: "Tôi muốn...",
    title_en: "I want...",
    prompt_pa: "ਮੈਨੂੰ ਚਾਹ ਚਾਹੀਦੀ ਹੈ।",
    romanization: "mainu chah chahidi hai",
    task_vi: "Thay 'trà' bằng 'nước'.",
    task_en: "Replace 'tea' with 'water'.",
    model_answer: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    explanation_vi: "ਚਾਹੀਦੀ/ਚਾਹੀਦਾ có thể đổi theo danh từ; ở A1 hãy học theo cụm mẫu.",
    explanation_en: "ਚਾਹੀਦੀ/ਚਾਹੀਦਾ can change with the noun; at A1, learn model chunks.",
    common_mistake: {
      audience: "both",
      note_vi: "Đừng dịch từng chữ 'I want' bằng một động từ tiếng Anh duy nhất.",
      note_en: "Do not force a single English 'want' verb onto every Punjabi sentence.",
    },
  },
  {
    id: "pa_drill_shopping_001",
    level: "A1",
    type: "micro_dialogue",
    topic: "shopping",
    title_vi: "Hỏi giá",
    title_en: "Ask the price",
    prompt_pa: "A: ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ? B: ___",
    romanization: "ih kinne da hai?",
    task_vi: "Đáp: 'Nó 50 rupee.'",
    task_en: "Answer: 'It is 50 rupees.'",
    model_answer: "ਇਹ ਪੰਜਾਹ ਰੁਪਏ ਦਾ ਹੈ।",
    explanation_vi: "ਦਾ ਹੈ giữ trong mẫu giá.",
    explanation_en: "ਦਾ ਹੈ remains in this price pattern.",
    common_mistake: {
      audience: "vi",
      note_vi: "Không bỏ ਦਾ vì tiếng Việt chỉ cần '50 rupee'.",
      note_en: "Vietnamese speakers may omit ਦਾ; keep the Punjabi price frame.",
    },
  },
  {
    id: "pa_drill_directions_001",
    level: "A2",
    type: "transformation",
    topic: "directions",
    title_vi: "Từ câu trần thuật sang câu hỏi",
    title_en: "Statement to question",
    prompt_pa: "ਬੱਸ ਅੱਡਾ ਇੱਥੇ ਹੈ।",
    romanization: "bas adda ithe hai",
    task_vi: "Đổi thành: Bến xe ở đâu?",
    task_en: "Change to: Where is the bus stand?",
    model_answer: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    explanation_vi: "Thay ਇੱਥੇ bằng ਕਿੱਥੇ để hỏi vị trí.",
    explanation_en: "Replace ਇੱਥੇ with ਕਿੱਥੇ to ask location.",
    common_mistake: {
      audience: "en",
      note_vi: "Không đảo trợ động từ như tiếng Anh.",
      note_en: "Do not use English-style auxiliary inversion.",
    },
  },
  {
    id: "pa_drill_time_001",
    level: "A2",
    type: "translation_awareness",
    topic: "time",
    title_vi: "Hỏi giờ",
    title_en: "Ask the time",
    prompt_pa: "ਹੁਣ ਕਿੰਨੇ ਵਜੇ ਹਨ?",
    romanization: "hun kinne vaje han?",
    task_vi: "Dịch và ghi chú vai trò của ਹੁਣ.",
    task_en: "Translate and note the role of ਹੁਣ.",
    model_answer: "Bây giờ mấy giờ? / What time is it now?",
    explanation_vi: "ਹੁਣ nghĩa là 'bây giờ/now' và thường đứng đầu câu.",
    explanation_en: "ਹੁਣ means 'now' and often appears at the start.",
    common_mistake: {
      audience: "both",
      note_vi: "Đừng nhầm ਕਿੰਨੇ ਵਜੇ với hỏi giá vì có ਕਿੰਨੇ.",
      note_en: "Do not confuse ਕਿੰਨੇ ਵਜੇ with a price question just because it has ਕਿੰਨੇ.",
    },
  },
  {
    id: "pa_drill_verbs_001",
    level: "A2",
    type: "transformation",
    topic: "simple_verbs",
    title_vi: "Phủ định động từ đơn giản",
    title_en: "Negate a simple verb",
    prompt_pa: "ਮੈਂ ਪੰਜਾਬੀ ਸਿੱਖਦਾ ਹਾਂ।",
    romanization: "main panjabi sikhda han",
    task_vi: "Đổi thành câu phủ định.",
    task_en: "Change into a negative sentence.",
    model_answer: "ਮੈਂ ਪੰਜਾਬੀ ਨਹੀਂ ਸਿੱਖਦਾ।",
    explanation_vi: "ਨਹੀਂ đứng trước động từ chính; trong mẫu này thường bỏ ਹਾਂ.",
    explanation_en: "ਨਹੀਂ comes before the main verb; in this pattern ਹਾਂ is commonly dropped.",
    common_mistake: {
      audience: "vi",
      note_vi: "Tiếng Việt đặt 'không' trước động từ; giống ý tưởng, nhưng đừng giữ ਹਾਂ máy móc.",
      note_en: "Vietnamese 'không' is also before the verb, but do not mechanically keep ਹਾਂ.",
    },
  },
];

export default punjabiDrills;
