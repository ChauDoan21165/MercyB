// Punjabi A1 final handoff set for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization supports recall. Native review is deferred.

export type PunjabiA1FinalHandoffDomain =
  | "greetings"
  | "identity"
  | "family"
  | "numbers"
  | "food"
  | "directions"
  | "help"
  | "politeness"
  | "retention"
  | "checkpoints"
  | "service_counter_basics"
  | "gurmukhi_recognition";

export type PunjabiA1FinalHandoffStyle =
  | "handoff"
  | "pre_integration"
  | "final_readiness"
  | "selector"
  | "quality_gate"
  | "checkpoint";

export type PunjabiA1FinalHandoffItem = {
  id: string;
  domain: PunjabiA1FinalHandoffDomain;
  style: PunjabiA1FinalHandoffStyle;
  prompt_vi: string;
  prompt_en: string;
  cue_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  selector_pa: string;
  selector_hint_vi: string;
  selector_hint_en: string;
  why_handoff_vi: string;
  why_handoff_en: string;
  trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: boolean;
  review_links: string[];
};

export const finalHandoffScriptAwareness =
  "Gurmukhi is the primary script for this Punjabi A1 final handoff set. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1FinalHandoffSet: PunjabiA1FinalHandoffItem[] = [
  {
    id: "pa_a1_handoff_greeting_001",
    domain: "greetings",
    style: "handoff",
    prompt_vi: "Chọn câu chào mở đầu an toàn cho handoff.",
    prompt_en: "Select the safest opening greeting for the handoff.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    romanization: "sat sri akal",
    meaning_vi: "Xin chào.",
    meaning_en: "Hello.",
    selector_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
    selector_hint_vi: "Bắt đầu bằng chào hỏi trước.",
    selector_hint_en: "Start with a greeting first.",
    why_handoff_vi: "Chào đúng là điểm vào ổn định nhất cho gói cuối.",
    why_handoff_en: "Greeting correctly is the most stable entry point for the final pack.",
    trap: { audience: "vi", vi: "Đừng chuyển sang mẫu phức tạp ngay từ đầu.", en: "Do not jump to a complex pattern at the start." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_greeting_001", "pa_a1_consistency_greeting_001"],
  },
  {
    id: "pa_a1_handoff_identity_001",
    domain: "identity",
    style: "pre_integration",
    prompt_vi: "Chọn câu giới thiệu tên và hỏi lại tên.",
    prompt_en: "Select the name-introduction line and ask back the name question.",
    cue_pa: "ਮੇਰਾ ਨਾਮ ਆਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    romanization: "mera nam An hai. tuhada nam ki hai?",
    meaning_vi: "Tên tôi là An. Tên bạn là gì?",
    meaning_en: "My name is An. What is your name?",
    selector_pa: "ਮੇਰਾ ਨਾਮ ... / ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ",
    selector_hint_vi: "Giữ khung ngắn, rõ, lặp lại được.",
    selector_hint_en: "Keep the frame short, clear, and repeatable.",
    why_handoff_vi: "Tên là bài kiểm tra đầu vào tốt cho mọi handoff.",
    why_handoff_en: "Names are a strong entry check for any handoff.",
    trap: { audience: "both", vi: "Đừng đổi vị trí ਕੀ.", en: "Do not move ਕੀ." },
    review_links: ["pa_a1_checkpoint_identity_001", "pa_a1_consistency_identity_001"],
  },
  {
    id: "pa_a1_handoff_family_001",
    domain: "family",
    style: "checkpoint",
    prompt_vi: "Chọn câu có mẹ và sở hữu rõ ràng.",
    prompt_en: "Select the line with mother and a clear possession frame.",
    cue_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ ਹੈ।",
    romanization: "ih meri man hai. mere kol ikk bhra hai.",
    meaning_vi: "Đây là mẹ tôi. Tôi có một anh/em trai.",
    meaning_en: "This is my mother. I have one brother.",
    selector_pa: "ਮੇਰੀ ਮਾਂ / ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ",
    selector_hint_vi: "Gia đình cần cả người thân và mẫu 'tôi có'.",
    selector_hint_en: "Family needs both a person and the 'I have' frame.",
    why_handoff_vi: "Gia đình kiểm tra xem người học giữ được khung câu hay không.",
    why_handoff_en: "Family checks whether the learner can hold the sentence frame.",
    trap: { audience: "en", vi: "Do not translate ਮੇਰਾ/ਮੇਰੀ as one fixed English word.", en: "Do not translate ਮੇਰਾ/ਮੇਰੀ as one fixed English word." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_family_001", "pa_a1_consistency_family_001"],
  },
  {
    id: "pa_a1_handoff_numbers_001",
    domain: "numbers",
    style: "quality_gate",
    prompt_vi: "Chọn số và giá đúng cho vé.",
    prompt_en: "Select the correct numbers and price for tickets.",
    cue_pa: "ਦੋ ਟਿਕਟਾਂ। ਪੰਜ ਡਾਲਰ।",
    romanization: "do tiktan. panj dollar.",
    meaning_vi: "Hai vé. Năm đô la.",
    meaning_en: "Two tickets. Five dollars.",
    selector_pa: "ਦੋ / ਪੰਜ / ਡਾਲਰ",
    selector_hint_vi: "Đọc Gurmukhi trước, rồi mới nhớ nghĩa.",
    selector_hint_en: "Read the Gurmukhi first, then recall the meaning.",
    why_handoff_vi: "Số và giá là cổng kiểm tra rất rõ trước khi sang gói tiếp theo.",
    why_handoff_en: "Numbers and prices are very clear gates before the next pack.",
    trap: { audience: "both", vi: "Đừng chỉ nhìn chữ Latin.", en: "Do not rely only on Latin letters." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_numbers_001", "pa_a1_consistency_numbers_001"],
  },
  {
    id: "pa_a1_handoff_food_001",
    domain: "food",
    style: "selector",
    prompt_vi: "Chọn câu nhu cầu cơ bản về nước.",
    prompt_en: "Select the basic need line for water.",
    cue_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mainu pani chahida hai",
    meaning_vi: "Tôi cần nước.",
    meaning_en: "I need water.",
    selector_pa: "ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ",
    selector_hint_vi: "Giữ mẫu nhu cầu cố định.",
    selector_hint_en: "Keep the need frame fixed.",
    why_handoff_vi: "Nhu cầu cơ bản phải sẵn sàng trước khi handoff.",
    why_handoff_en: "Basic needs must be ready before the handoff.",
    trap: { audience: "vi", vi: "Đừng bỏ ਮੈਨੂੰ khi nói nhu cầu.", en: "Do not drop ਮੈਨੂੰ when stating a need." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_food_001", "pa_a1_consistency_food_001"],
  },
  {
    id: "pa_a1_handoff_directions_001",
    domain: "directions",
    style: "final_readiness",
    prompt_vi: "Chọn câu hỏi chỉ đường ở Canada.",
    prompt_en: "Select the direction question for Canada.",
    cue_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    romanization: "bas adda kithe hai?",
    meaning_vi: "Bến xe buýt ở đâu?",
    meaning_en: "Where is the bus stop?",
    selector_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ",
    selector_hint_vi: "Câu vị trí dùng ਕਿੱਥੇ ਹੈ.",
    selector_hint_en: "Location questions use ਕਿੱਥੇ ਹੈ.",
    why_handoff_vi: "Chỉ đường phải chạy ổn ở mức cuối trước khi sang A2.",
    why_handoff_en: "Directions must run cleanly at the end before moving to A2.",
    trap: { audience: "en", vi: "Đừng đảo trật tự theo tiếng Anh.", en: "Do not reorder it like English." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_directions_001", "pa_a1_consistency_directions_001"],
  },
  {
    id: "pa_a1_handoff_help_001",
    domain: "help",
    style: "handoff",
    prompt_vi: "Chọn câu xin giúp an toàn nhất.",
    prompt_en: "Select the safest help request.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    romanization: "kirpa karke madad karo",
    meaning_vi: "Làm ơn giúp tôi.",
    meaning_en: "Please help me.",
    selector_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ",
    selector_hint_vi: "Dùng khi giao tiếp bị kẹt.",
    selector_hint_en: "Use it when the interaction gets stuck.",
    why_handoff_vi: "Đây là câu cứu nguy cần có trong gói cuối.",
    why_handoff_en: "This is the rescue line every final pack needs.",
    trap: { audience: "both", vi: "Đừng dựa vào tiếng Anh để giữ cuộc thoại.", en: "Do not rely on English to keep the interaction going." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_help_001", "pa_a1_consistency_help_001"],
  },
  {
    id: "pa_a1_handoff_politeness_001",
    domain: "politeness",
    style: "quality_gate",
    prompt_vi: "Chọn lời cảm ơn ngắn để tiếp tục.",
    prompt_en: "Select the short thanks line to continue.",
    cue_pa: "ਧੰਨਵਾਦ।",
    romanization: "dhanvad",
    meaning_vi: "Cảm ơn.",
    meaning_en: "Thank you.",
    selector_pa: "ਧੰਨਵਾਦ",
    selector_hint_vi: "Nói ngay sau khi được giúp.",
    selector_hint_en: "Say it right after help is given.",
    why_handoff_vi: "Lịch sự ổn định giúp gói cuối nghe tự nhiên hơn.",
    why_handoff_en: "Stable politeness makes the final pack sound more natural.",
    trap: { audience: "both", vi: "Đừng quên nói cảm ơn.", en: "Do not forget to say thanks." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_politeness_001", "pa_a1_consistency_politeness_001"],
  },
  {
    id: "pa_a1_handoff_retention_001",
    domain: "retention",
    style: "checkpoint",
    prompt_vi: "Chọn câu ôn để giữ nhịp.",
    prompt_en: "Select the review line that keeps the pace.",
    cue_pa: "ਮਾਫ਼ ਕਰਨਾ।",
    romanization: "maf karna",
    meaning_vi: "Xin lỗi.",
    meaning_en: "Sorry / excuse me.",
    selector_pa: "ਮਾਫ਼ ਕਰਨਾ / ਦੁਬਾਰਾ ਕਹੋ",
    selector_hint_vi: "Dùng để mở lại cuộc thoại khi lỡ nhịp.",
    selector_hint_en: "Use it to reopen the conversation when you lose the thread.",
    why_handoff_vi: "Câu đệm giúp người học không bị vỡ nhịp khi sang giai đoạn tiếp theo.",
    why_handoff_en: "Buffer phrases help the learner avoid losing rhythm before the next stage.",
    trap: { audience: "vi", vi: "Đừng biến nó thành câu dài.", en: "Do not turn it into a long sentence." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_repeat_001", "pa_a1_consistency_repeat_001"],
  },
  {
    id: "pa_a1_handoff_checkpoints_001",
    domain: "checkpoints",
    style: "pre_integration",
    prompt_vi: "Chọn gói kiểm tra cuối cùng trước khi tích hợp.",
    prompt_en: "Select the final checkpoint package before integration.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ। ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    romanization: "sat sri akal. mainu form chahida hai. bas adda kithe hai?",
    meaning_vi: "Xin chào. Tôi cần mẫu đơn. Bến xe buýt ở đâu?",
    meaning_en: "Hello. I need a form. Where is the bus stop?",
    selector_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ + ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ + ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ",
    selector_hint_vi: "Ghép chào hỏi, nhu cầu, và chỉ đường.",
    selector_hint_en: "Combine greeting, need, and directions.",
    why_handoff_vi: "Đây là bộ kiểm tra xem các câu nền đã khớp nhau chưa.",
    why_handoff_en: "This package checks whether the base lines fit together.",
    trap: { audience: "en", vi: "Đừng chỉ dùng một mảnh câu.", en: "Do not use only one fragment." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_service_001", "pa_a1_consistency_service_001"],
  },
  {
    id: "pa_a1_handoff_service_001",
    domain: "service_counter_basics",
    style: "final_readiness",
    prompt_vi: "Chọn câu cho quầy dịch vụ ở Canada.",
    prompt_en: "Select the line for a Canadian service counter.",
    cue_pa: "ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਪਛਾਣ ਹੈ?",
    romanization: "ki tuhade kol pachhan hai?",
    meaning_vi: "Bạn có giấy tờ tùy thân không?",
    meaning_en: "Do you have identification?",
    selector_pa: "ਕੀ ... ਪਛਾਣ ... ਹੈ?",
    selector_hint_vi: "Câu hỏi có/không mở bằng ਕੀ.",
    selector_hint_en: "A yes/no question starts with ਕੀ.",
    why_handoff_vi: "Đây là kiểu câu thực tế cần dùng trong Canada.",
    why_handoff_en: "This is the practical question type needed in Canada.",
    trap: { audience: "vi", vi: "Đừng nhầm với câu hỏi 'cái gì'.", en: "Do not confuse it with a 'what' question." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_help_001", "pa_a1_consistency_service_001"],
  },
  {
    id: "pa_a1_handoff_gurmukhi_001",
    domain: "gurmukhi_recognition",
    style: "selector",
    prompt_vi: "Chọn tập từ Gurmukhi để đưa vào tích hợp.",
    prompt_en: "Select the Gurmukhi word set for integration.",
    cue_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    romanization: "pani, madad, bas, form",
    meaning_vi: "nước, giúp đỡ, xe buýt, mẫu đơn",
    meaning_en: "water, help, bus, form",
    selector_pa: "ਪਾਣੀ / ਮਦਦ / ਬੱਸ / ਫਾਰਮ",
    selector_hint_vi: "Script trước, romanization sau.",
    selector_hint_en: "Script first, romanization second.",
    why_handoff_vi: "Tập chữ này đủ nhỏ để dùng trên nhiều màn hình.",
    why_handoff_en: "This small word set can be used across many screens.",
    trap: { audience: "both", vi: "Romanization không thay cho chữ gốc.", en: "Romanization does not replace the original script." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_gurmukhi_001", "pa_a1_consistency_gurmukhi_001"],
  },
];

export default punjabiA1FinalHandoffSet;
