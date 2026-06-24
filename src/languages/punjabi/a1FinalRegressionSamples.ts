// Punjabi A1 final regression samples for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization supports recall. Native review is deferred.

export type PunjabiA1FinalRegressionDomain =
  | "greetings"
  | "identity"
  | "family"
  | "numbers"
  | "prices"
  | "food"
  | "directions"
  | "help"
  | "repetition"
  | "politeness"
  | "gurmukhi_recognition"
  | "romanization_bridge"
  | "canada_service";

export type PunjabiA1FinalRegressionStyle =
  | "final_regression"
  | "sanity"
  | "pre_integration"
  | "checkpoint"
  | "qa"
  | "selector";

export type PunjabiA1FinalRegressionSample = {
  id: string;
  domain: PunjabiA1FinalRegressionDomain;
  style: PunjabiA1FinalRegressionStyle;
  prompt_vi: string;
  prompt_en: string;
  cue_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  answer_pa: string;
  answer_hint_vi: string;
  answer_hint_en: string;
  why_regression_vi: string;
  why_regression_en: string;
  trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: boolean;
  review_links: string[];
};

export const finalRegressionScriptAwareness =
  "Gurmukhi is the primary script for this Punjabi A1 final regression set. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1FinalRegressionSamples: PunjabiA1FinalRegressionSample[] = [
  {
    id: "pa_a1_regression_greeting_001",
    domain: "greetings",
    style: "final_regression",
    prompt_vi: "Chọn câu chào an toàn nhất.",
    prompt_en: "Select the safest greeting.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    romanization: "sat sri akal",
    meaning_vi: "Xin chào.",
    meaning_en: "Hello.",
    answer_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    answer_hint_vi: "Bắt đầu bằng lời chào chuẩn.",
    answer_hint_en: "Open with the standard greeting.",
    why_regression_vi: "Lời chào phải ổn định trong mọi bản cuối.",
    why_regression_en: "The greeting must be stable in every final build.",
    trap: { audience: "vi", vi: "Đừng thêm đuôi âm kiểu tiếng Việt.", en: "Do not add a Vietnamese-style ending sound." },
    canada_practical: true,
    review_links: ["pa_a1_handoff_greeting_001", "pa_a1_consistency_greeting_001"],
  },
  {
    id: "pa_a1_regression_identity_001",
    domain: "identity",
    style: "qa",
    prompt_vi: "Nhớ câu giới thiệu tên.",
    prompt_en: "Recall the self-introduction line.",
    cue_pa: "ਮੇਰਾ ਨਾਮ ਆਨ ਹੈ।",
    romanization: "mera nam An hai",
    meaning_vi: "Tên tôi là An.",
    meaning_en: "My name is An.",
    answer_pa: "ਮੇਰਾ ਨਾਮ ਆਨ ਹੈ।",
    answer_hint_vi: "Giữ ਮੇਰਾ ਨਾਮ ... ਹੈ.",
    answer_hint_en: "Keep the ਮੇਰਾ ਨਾਮ ... ਹੈ frame.",
    why_regression_vi: "Tên là bài kiểm tra cơ bản trước khi sang nội dung mới.",
    why_regression_en: "Names are a basic check before moving to new material.",
    trap: { audience: "both", vi: "Đừng bỏ ਹੈ ở cuối.", en: "Do not drop ਹੈ at the end." },
    review_links: ["pa_a1_handoff_identity_001", "pa_a1_consistency_identity_001"],
  },
  {
    id: "pa_a1_regression_family_001",
    domain: "family",
    style: "checkpoint",
    prompt_vi: "Nói: Đây là mẹ tôi.",
    prompt_en: "Say: This is my mother.",
    cue_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ।",
    romanization: "ih meri man hai",
    meaning_vi: "Đây là mẹ tôi.",
    meaning_en: "This is my mother.",
    answer_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ।",
    answer_hint_vi: "ਮੇਰੀ đi với ਮਾਂ.",
    answer_hint_en: "ਮੇਰੀ goes with ਮਾਂ.",
    why_regression_vi: "Gia đình kiểm tra khung sở hữu đơn giản.",
    why_regression_en: "Family checks a simple possession frame.",
    trap: { audience: "vi", vi: "Đừng đổi thành ਮੇਰਾ ਮਾਂ.", en: "Do not change it to ਮੇਰਾ ਮਾਂ." },
    canada_practical: true,
    review_links: ["pa_a1_handoff_family_001", "pa_a1_consistency_family_001"],
  },
  {
    id: "pa_a1_regression_numbers_001",
    domain: "numbers",
    style: "sanity",
    prompt_vi: "Nhớ số và giá trong vé.",
    prompt_en: "Recall the numbers and price in tickets.",
    cue_pa: "ਦੋ ਟਿਕਟਾਂ। ਪੰਜ ਡਾਲਰ।",
    romanization: "do tiktan. panj dollar.",
    meaning_vi: "Hai vé. Năm đô la.",
    meaning_en: "Two tickets. Five dollars.",
    answer_pa: "ਦੋ ਟਿਕਟਾਂ। ਪੰਜ ਡਾਲਰ।",
    answer_hint_vi: "Đọc số trước, rồi giá.",
    answer_hint_en: "Read the number first, then the price.",
    why_regression_vi: "Số và giá là một sanity check rất rõ.",
    why_regression_en: "Numbers and prices are a very clear sanity check.",
    trap: { audience: "both", vi: "Đừng học chỉ bằng chữ Latin.", en: "Do not learn only through Latin letters." },
    canada_practical: true,
    review_links: ["pa_a1_handoff_numbers_001", "pa_a1_consistency_numbers_001"],
  },
  {
    id: "pa_a1_regression_prices_001",
    domain: "prices",
    style: "selector",
    prompt_vi: "Chọn cụm giá đúng.",
    prompt_en: "Choose the correct price phrase.",
    cue_pa: "ਪੰਜ ਡਾਲਰ।",
    romanization: "panj dollar",
    meaning_vi: "Năm đô la.",
    meaning_en: "Five dollars.",
    answer_pa: "ਪੰਜ ਡਾਲਰ।",
    answer_hint_vi: "Giữ đơn vị tiền rõ ràng.",
    answer_hint_en: "Keep the currency unit clear.",
    why_regression_vi: "Giá tiền thường lẫn với số đếm nếu không kiểm tra lại.",
    why_regression_en: "Prices often blur with counting unless they are checked again.",
    trap: { audience: "en", vi: "Đừng đổi trật tự như tiếng Anh.", en: "Do not reorder it like English." },
    canada_practical: true,
    review_links: ["pa_a1_handoff_numbers_001", "pa_a1_consistency_numbers_001"],
  },
  {
    id: "pa_a1_regression_food_001",
    domain: "food",
    style: "pre_integration",
    prompt_vi: "Nói bạn cần nước.",
    prompt_en: "Say that you need water.",
    cue_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mainu pani chahida hai",
    meaning_vi: "Tôi cần nước.",
    meaning_en: "I need water.",
    answer_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    answer_hint_vi: "Giữ ਮੈਨੂੰ ở đầu câu.",
    answer_hint_en: "Keep ਮੈਨੂੰ at the start of the sentence.",
    why_regression_vi: "Nhu cầu cơ bản phải chạy được trong mọi bản cuối.",
    why_regression_en: "Basic needs must work in every final version.",
    trap: { audience: "vi", vi: "Đừng bỏ ਮੈਨੂੰ khi nói nhu cầu.", en: "Do not drop ਮੈਨੂੰ when stating a need." },
    canada_practical: true,
    review_links: ["pa_a1_handoff_food_001", "pa_a1_consistency_food_001"],
  },
  {
    id: "pa_a1_regression_directions_001",
    domain: "directions",
    style: "qa",
    prompt_vi: "Hỏi bến xe buýt ở đâu.",
    prompt_en: "Ask where the bus stop is.",
    cue_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    romanization: "bas adda kithe hai?",
    meaning_vi: "Bến xe buýt ở đâu?",
    meaning_en: "Where is the bus stop?",
    answer_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    answer_hint_vi: "Câu vị trí dùng ਕਿੱਥੇ ਹੈ.",
    answer_hint_en: "A location question uses ਕਿੱਥੇ ਹੈ.",
    why_regression_vi: "Chỉ đường là phần phải giữ nguyên cấu trúc.",
    why_regression_en: "Directions are a section where the structure must stay fixed.",
    trap: { audience: "en", vi: "Đừng đảo trật tự như tiếng Anh.", en: "Do not flip the order like English." },
    canada_practical: true,
    review_links: ["pa_a1_handoff_directions_001", "pa_a1_consistency_directions_001"],
  },
  {
    id: "pa_a1_regression_help_001",
    domain: "help",
    style: "checkpoint",
    prompt_vi: "Xin giúp đỡ lịch sự.",
    prompt_en: "Ask for help politely.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    romanization: "kirpa karke madad karo",
    meaning_vi: "Làm ơn giúp tôi.",
    meaning_en: "Please help me.",
    answer_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    answer_hint_vi: "Câu cứu nguy phải ngắn.",
    answer_hint_en: "The rescue line should stay short.",
    why_regression_vi: "Nếu câu xin giúp không ổn, cả cuộc thoại có thể gãy.",
    why_regression_en: "If the help request is unstable, the whole conversation can break.",
    trap: { audience: "both", vi: "Đừng dựa vào tiếng Anh để thoát tình huống.", en: "Do not rely on English to escape the situation." },
    canada_practical: true,
    review_links: ["pa_a1_handoff_help_001", "pa_a1_consistency_help_001"],
  },
  {
    id: "pa_a1_regression_repetition_001",
    domain: "repetition",
    style: "final_regression",
    prompt_vi: "Nói lại một cách lịch sự.",
    prompt_en: "Ask politely for repetition.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    romanization: "kirpa karke dubara kaho",
    meaning_vi: "Làm ơn nói lại.",
    meaning_en: "Please say that again.",
    answer_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    answer_hint_vi: "Giữ ਦੁਬਾਰਾ và ਕਹੋ.",
    answer_hint_en: "Keep ਦੁਬਾਰਾ and ਕਹੋ.",
    why_regression_vi: "Câu lặp lại là một trong những câu cần giữ nhất quán nhất.",
    why_regression_en: "The repeat request is one of the most important consistency lines.",
    trap: { audience: "vi", vi: "Đừng im lặng khi không nghe rõ.", en: "Do not stay silent when you miss something." },
    canada_practical: true,
    review_links: ["pa_a1_handoff_retention_001", "pa_a1_consistency_repeat_001"],
  },
  {
    id: "pa_a1_regression_politeness_001",
    domain: "politeness",
    style: "sanity",
    prompt_vi: "Nói cảm ơn ngắn gọn.",
    prompt_en: "Say thanks briefly.",
    cue_pa: "ਧੰਨਵਾਦ।",
    romanization: "dhanvad",
    meaning_vi: "Cảm ơn.",
    meaning_en: "Thank you.",
    answer_pa: "ਧੰਨਵਾਦ।",
    answer_hint_vi: "Dùng ngay sau khi được giúp.",
    answer_hint_en: "Use it right after being helped.",
    why_regression_vi: "Lời cảm ơn là sanity check cho sự tự nhiên của cuộc thoại.",
    why_regression_en: "Thanks are a sanity check for how natural the conversation feels.",
    trap: { audience: "both", vi: "Đừng quên nói cảm ơn.", en: "Do not forget to say thanks." },
    canada_practical: true,
    review_links: ["pa_a1_handoff_politeness_001", "pa_a1_consistency_politeness_001"],
  },
  {
    id: "pa_a1_regression_gurmukhi_001",
    domain: "gurmukhi_recognition",
    style: "selector",
    prompt_vi: "Chọn tập chữ Gurmukhi đúng.",
    prompt_en: "Choose the correct Gurmukhi word set.",
    cue_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    romanization: "pani, madad, bas, form",
    meaning_vi: "nước, giúp đỡ, xe buýt, mẫu đơn",
    meaning_en: "water, help, bus, form",
    answer_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    answer_hint_vi: "Đọc chữ gốc trước romanization.",
    answer_hint_en: "Read the original script before romanization.",
    why_regression_vi: "Nhận diện chữ là nền cho tự học về sau.",
    why_regression_en: "Script recognition is the base for later self-study.",
    trap: { audience: "both", vi: "Romanization chỉ là cầu nối.", en: "Romanization is only a bridge." },
    canada_practical: true,
    review_links: ["pa_a1_handoff_gurmukhi_001", "pa_a1_consistency_gurmukhi_001"],
  },
  {
    id: "pa_a1_regression_bridge_001",
    domain: "romanization_bridge",
    style: "pre_integration",
    prompt_vi: "Nhớ rằng romanization chỉ là cầu nối.",
    prompt_en: "Remember that romanization is only a bridge.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    romanization: "sat sri akal",
    meaning_vi: "Xin chào.",
    meaning_en: "Hello.",
    answer_pa: "Romanization chỉ hỗ trợ, không thay chữ Gurmukhi.",
    answer_hint_vi: "Luôn quay lại chữ gốc.",
    answer_hint_en: "Always return to the original script.",
    why_regression_vi: "Người học cần rời cầu nối và đọc chữ gốc ổn định.",
    why_regression_en: "The learner should move beyond the bridge and read the original script steadily.",
    trap: { audience: "both", vi: "Đừng học chỉ bằng chữ Latin.", en: "Do not learn only through Latin letters." },
    review_links: ["pa_a1_handoff_gurmukhi_001", "pa_a1_consistency_numbers_001"],
  },
  {
    id: "pa_a1_regression_service_001",
    domain: "canada_service",
    style: "final_regression",
    prompt_vi: "Chọn câu cho quầy dịch vụ ở Canada.",
    prompt_en: "Select the line for a Canadian service counter.",
    cue_pa: "ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਪਛਾਣ ਹੈ?",
    romanization: "ki tuhade kol pachhan hai?",
    meaning_vi: "Bạn có giấy tờ tùy thân không?",
    meaning_en: "Do you have identification?",
    answer_pa: "ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਪਛਾਣ ਹੈ?",
    answer_hint_vi: "Câu hỏi có/không mở bằng ਕੀ.",
    answer_hint_en: "A yes/no question starts with ਕੀ.",
    why_regression_vi: "Mẫu dịch vụ Canada phải rõ, ngắn, và dễ tái sử dụng.",
    why_regression_en: "Canadian service patterns should be clear, short, and reusable.",
    trap: { audience: "vi", vi: "Đừng nhầm với câu hỏi 'cái gì'.", en: "Do not confuse it with a 'what' question." },
    canada_practical: true,
    review_links: ["pa_a1_handoff_service_001", "pa_a1_consistency_service_001"],
  },
];

export default punjabiA1FinalRegressionSamples;
