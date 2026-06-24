// Punjabi A1 closure-validation samples for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization supports recall. Native review is deferred.

export type PunjabiA1ClosureValidationDomain =
  | "greeting"
  | "identity"
  | "numbers_prices"
  | "help"
  | "polite_repetition"
  | "gurmukhi_recognition"
  | "romanization_bridge"
  | "canada_service_counter";

export type PunjabiA1ClosureValidationStyle =
  | "closure_validation"
  | "final_cross_check"
  | "pre_integration"
  | "survival_flow"
  | "qa"
  | "selector";

export type PunjabiA1ClosureValidationSample = {
  id: string;
  domain: PunjabiA1ClosureValidationDomain;
  style: PunjabiA1ClosureValidationStyle;
  prompt_vi: string;
  prompt_en: string;
  cue_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  expected_pa: string;
  closure_check_vi: string;
  closure_check_en: string;
  survival_use_vi: string;
  survival_use_en: string;
  trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: boolean;
  review_links: string[];
};

export const closureValidationScriptAwareness =
  "Gurmukhi is the primary script for this Punjabi A1 closure-validation set. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1ClosureValidationSamples: PunjabiA1ClosureValidationSample[] = [
  {
    id: "pa_a1_closure_greeting_001",
    domain: "greeting",
    style: "closure_validation",
    prompt_vi: "Bắt đầu luồng sống còn bằng câu chào an toàn.",
    prompt_en: "Start the survival flow with a safe greeting.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    romanization: "sat sri akal",
    meaning_vi: "Xin chào.",
    meaning_en: "Hello.",
    expected_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    closure_check_vi: "Câu chào mở được mọi chuỗi kiểm tra A1.",
    closure_check_en: "The greeting opens every A1 check sequence.",
    survival_use_vi: "Dùng trước khi hỏi tên hoặc xin giúp.",
    survival_use_en: "Use before asking a name or requesting help.",
    trap: { audience: "vi", vi: "Đừng thêm âm cuối kiểu tiếng Việt.", en: "Do not add a Vietnamese-style final sound." },
    canada_practical: true,
    review_links: ["pa_a1_validation_greeting_001", "pa_a1_cross_greeting_001"],
  },
  {
    id: "pa_a1_closure_identity_001",
    domain: "identity",
    style: "qa",
    prompt_vi: "Sau khi chào, nói tên và hỏi lại tên.",
    prompt_en: "After greeting, say your name and ask back.",
    cue_pa: "ਮੇਰਾ ਨਾਮ ਆਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    romanization: "mera nam An hai. tuhada nam ki hai?",
    meaning_vi: "Tên tôi là An. Tên bạn là gì?",
    meaning_en: "My name is An. What is your name?",
    expected_pa: "ਮੇਰਾ ਨਾਮ ਆਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    closure_check_vi: "Khung tên xác nhận người học giữ được câu cơ bản.",
    closure_check_en: "The name frame confirms the learner can hold a basic sentence.",
    survival_use_vi: "Dùng ở lớp học, quầy dịch vụ, hoặc khi gặp người mới.",
    survival_use_en: "Use in class, at a service counter, or when meeting someone.",
    trap: { audience: "both", vi: "Đừng bỏ ਹੈ ở câu giới thiệu.", en: "Do not drop ਹੈ in the introduction." },
    review_links: ["pa_a1_validation_identity_001", "pa_a1_cross_identity_001"],
  },
  {
    id: "pa_a1_closure_numbers_prices_001",
    domain: "numbers_prices",
    style: "final_cross_check",
    prompt_vi: "Kiểm tra số lượng và giá trong một lượt ngắn.",
    prompt_en: "Check quantity and price in one short turn.",
    cue_pa: "ਦੋ ਟਿਕਟਾਂ। ਪੰਜ ਡਾਲਰ।",
    romanization: "do tiktan. panj dollar.",
    meaning_vi: "Hai vé. Năm đô la.",
    meaning_en: "Two tickets. Five dollars.",
    expected_pa: "ਦੋ ਟਿਕਟਾਂ। ਪੰਜ ਡਾਲਰ।",
    closure_check_vi: "Số và giá phải chạy cùng nhau, không tách rời.",
    closure_check_en: "Numbers and prices must work together, not separately.",
    survival_use_vi: "Dùng khi mua vé hoặc xác nhận chi phí cơ bản.",
    survival_use_en: "Use when buying tickets or confirming a basic cost.",
    trap: { audience: "both", vi: "Đừng chỉ học số bằng chữ Latin.", en: "Do not learn numbers only through Latin letters." },
    canada_practical: true,
    review_links: ["pa_a1_validation_numbers_001", "pa_a1_validation_prices_001"],
  },
  {
    id: "pa_a1_closure_numbers_prices_002",
    domain: "numbers_prices",
    style: "selector",
    prompt_vi: "Chọn cụm giá đúng cho quầy dịch vụ.",
    prompt_en: "Select the correct price phrase for a service counter.",
    cue_pa: "ਪੰਜ ਡਾਲਰ।",
    romanization: "panj dollar",
    meaning_vi: "Năm đô la.",
    meaning_en: "Five dollars.",
    expected_pa: "ਪੰਜ ਡਾਲਰ।",
    closure_check_vi: "Giá cần giữ đơn vị tiền rõ ràng.",
    closure_check_en: "The price needs to keep the currency unit clear.",
    survival_use_vi: "Dùng khi xác nhận tiền ở Canada.",
    survival_use_en: "Use when confirming money in Canada.",
    trap: { audience: "en", vi: "Đừng đảo trật tự theo tiếng Anh.", en: "Do not reorder it like English." },
    canada_practical: true,
    review_links: ["pa_a1_cross_prices_001", "pa_a1_import_prices_001"],
  },
  {
    id: "pa_a1_closure_help_001",
    domain: "help",
    style: "survival_flow",
    prompt_vi: "Khi bị kẹt, xin giúp bằng câu ngắn.",
    prompt_en: "When stuck, ask for help with a short line.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    romanization: "kirpa karke madad karo",
    meaning_vi: "Làm ơn giúp tôi.",
    meaning_en: "Please help me.",
    expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    closure_check_vi: "Câu xin giúp là điểm cứu nguy của luồng sống còn.",
    closure_check_en: "The help request is the rescue point in the survival flow.",
    survival_use_vi: "Dùng ở quầy, trên xe buýt, hoặc trong lớp.",
    survival_use_en: "Use at a counter, on a bus, or in class.",
    trap: { audience: "both", vi: "Đừng thay bằng ghi chú tiếng Anh.", en: "Do not replace it with an English note." },
    canada_practical: true,
    review_links: ["pa_a1_validation_help_001", "pa_a1_cross_help_001"],
  },
  {
    id: "pa_a1_closure_repetition_001",
    domain: "polite_repetition",
    style: "closure_validation",
    prompt_vi: "Xin nói lại khi không nghe rõ.",
    prompt_en: "Ask for repetition when you miss something.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    romanization: "kirpa karke dubara kaho",
    meaning_vi: "Làm ơn nói lại.",
    meaning_en: "Please say that again.",
    expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    closure_check_vi: "Câu này xử lý khi thiếu số, giá, hoặc hướng dẫn.",
    closure_check_en: "This handles missed numbers, prices, or instructions.",
    survival_use_vi: "Dùng thay vì im lặng khi không hiểu.",
    survival_use_en: "Use instead of staying silent when you do not understand.",
    trap: { audience: "vi", vi: "Đừng im lặng khi không nghe rõ.", en: "Do not stay silent when you miss something." },
    canada_practical: true,
    review_links: ["pa_a1_validation_repetition_001", "pa_a1_cross_repetition_001"],
  },
  {
    id: "pa_a1_closure_polite_repetition_002",
    domain: "polite_repetition",
    style: "final_cross_check",
    prompt_vi: "Kết thúc lượt được giúp bằng cảm ơn.",
    prompt_en: "Close the helped turn with thanks.",
    cue_pa: "ਧੰਨਵਾਦ।",
    romanization: "dhanvad",
    meaning_vi: "Cảm ơn.",
    meaning_en: "Thank you.",
    expected_pa: "ਧੰਨਵਾਦ।",
    closure_check_vi: "Lời cảm ơn đóng luồng sống còn lịch sự.",
    closure_check_en: "Thanks close the survival flow politely.",
    survival_use_vi: "Dùng sau khi được nhắc lại hoặc được giúp.",
    survival_use_en: "Use after repetition or help.",
    trap: { audience: "both", vi: "Đừng bỏ lịch sự ở lượt cuối.", en: "Do not drop politeness in the final turn." },
    canada_practical: true,
    review_links: ["pa_a1_validation_politeness_001", "pa_a1_cross_politeness_001"],
  },
  {
    id: "pa_a1_closure_gurmukhi_001",
    domain: "gurmukhi_recognition",
    style: "selector",
    prompt_vi: "Nhận diện các từ Gurmukhi sống còn.",
    prompt_en: "Recognize survival Gurmukhi words.",
    cue_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    romanization: "pani, madad, bas, form",
    meaning_vi: "nước, giúp đỡ, xe buýt, mẫu đơn",
    meaning_en: "water, help, bus, form",
    expected_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    closure_check_vi: "Chữ gốc phải đọc được trước romanization.",
    closure_check_en: "The original script must be readable before romanization.",
    survival_use_vi: "Dùng để nhận ra biển, mẫu đơn, và từ trong bài.",
    survival_use_en: "Use to recognize signs, forms, and lesson words.",
    trap: { audience: "both", vi: "Romanization chỉ là cầu nối.", en: "Romanization is only a bridge." },
    canada_practical: true,
    review_links: ["pa_a1_validation_gurmukhi_001", "pa_a1_cross_gurmukhi_001"],
  },
  {
    id: "pa_a1_closure_romanization_001",
    domain: "romanization_bridge",
    style: "pre_integration",
    prompt_vi: "Dùng romanization để quay lại Gurmukhi.",
    prompt_en: "Use romanization to return to Gurmukhi.",
    cue_pa: "ਮਦਦ",
    romanization: "madad",
    meaning_vi: "giúp đỡ",
    meaning_en: "help",
    expected_pa: "ਮਦਦ",
    closure_check_vi: "Romanization hỗ trợ âm, nhưng đáp án vẫn là Gurmukhi.",
    closure_check_en: "Romanization supports sound, but the answer stays Gurmukhi.",
    survival_use_vi: "Dùng khi người học cần cầu nối nhanh từ âm sang chữ.",
    survival_use_en: "Use when the learner needs a quick bridge from sound to script.",
    trap: { audience: "both", vi: "Đừng để romanization thay thế chữ Gurmukhi.", en: "Do not let romanization replace Gurmukhi." },
    review_links: ["pa_a1_validation_romanization_001", "pa_a1_cross_romanization_001"],
  },
  {
    id: "pa_a1_closure_canada_counter_001",
    domain: "canada_service_counter",
    style: "survival_flow",
    prompt_vi: "Dùng câu ở quầy dịch vụ Canada.",
    prompt_en: "Use the line at a Canada service counter.",
    cue_pa: "ਮੇਰੇ ਕੋਲ ਪਛਾਣ ਹੈ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mere kol pachhan hai. mainu form chahida hai.",
    meaning_vi: "Tôi có giấy tờ tùy thân. Tôi cần mẫu đơn.",
    meaning_en: "I have ID. I need a form.",
    expected_pa: "ਮੇਰੇ ਕੋਲ ਪਛਾਣ ਹੈ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    closure_check_vi: "Mẫu này nối 'tôi có' với 'tôi cần' ở mức A1.",
    closure_check_en: "This connects 'I have' with 'I need' at A1 level.",
    survival_use_vi: "Dùng ở quầy khi cần mẫu đơn hoặc xác nhận giấy tờ.",
    survival_use_en: "Use at a counter when needing a form or confirming ID.",
    trap: { audience: "both", vi: "Đừng biến thành bài giấy tờ nâng cao.", en: "Do not turn this into an advanced document lesson." },
    canada_practical: true,
    review_links: ["pa_a1_validation_canada_service_001", "pa_a1_cross_canada_service_001"],
  },
  {
    id: "pa_a1_closure_canada_counter_002",
    domain: "canada_service_counter",
    style: "closure_validation",
    prompt_vi: "Kết hợp quầy dịch vụ với xin giúp và cảm ơn.",
    prompt_en: "Combine the service counter with help and thanks.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ। ਧੰਨਵਾਦ।",
    romanization: "kirpa karke madad karo. dhanvad.",
    meaning_vi: "Làm ơn giúp tôi. Cảm ơn.",
    meaning_en: "Please help me. Thank you.",
    expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ। ਧੰਨਵਾਦ।",
    closure_check_vi: "Câu này xác nhận luồng xin giúp rồi đóng lượt.",
    closure_check_en: "This confirms the flow of asking for help and closing the turn.",
    survival_use_vi: "Dùng khi cần hỗ trợ nhanh ở Canada.",
    survival_use_en: "Use when quick support is needed in Canada.",
    trap: { audience: "both", vi: "Đừng quên lời cảm ơn sau khi được giúp.", en: "Do not forget thanks after receiving help." },
    canada_practical: true,
    review_links: ["pa_a1_closure_help_001", "pa_a1_closure_polite_repetition_002"],
  },
];

export default punjabiA1ClosureValidationSamples;
