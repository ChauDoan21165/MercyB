// Punjabi A1 final-validation set for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization supports recall. Native review is deferred.

export type PunjabiA1FinalValidationDomain =
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

export type PunjabiA1FinalValidationStyle =
  | "final_validation"
  | "cross_check"
  | "pre_integration"
  | "connected_set"
  | "qa"
  | "selector";

export type PunjabiA1FinalValidationSample = {
  id: string;
  domain: PunjabiA1FinalValidationDomain;
  style: PunjabiA1FinalValidationStyle;
  prompt_vi: string;
  prompt_en: string;
  cue_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  expected_pa: string;
  validation_note_vi: string;
  validation_note_en: string;
  readiness_vi: string;
  readiness_en: string;
  trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: boolean;
  review_links: string[];
};

export const finalValidationScriptAwareness =
  "Gurmukhi is the primary script for this Punjabi A1 final-validation set. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1FinalValidationSet: PunjabiA1FinalValidationSample[] = [
  {
    id: "pa_a1_validation_greeting_001",
    domain: "greetings",
    style: "final_validation",
    prompt_vi: "Xác nhận câu chào mở đầu cho bộ cuối.",
    prompt_en: "Validate the opening greeting for the final set.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    romanization: "sat sri akal",
    meaning_vi: "Xin chào.",
    meaning_en: "Hello.",
    expected_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    validation_note_vi: "Câu chào phải ổn định trước khi hỏi tên.",
    validation_note_en: "The greeting must be stable before asking names.",
    readiness_vi: "Sẵn sàng nếu người học nhận ra chữ Gurmukhi và nghĩa.",
    readiness_en: "Ready if the learner recognizes the Gurmukhi and meaning.",
    trap: { audience: "vi", vi: "Đừng thêm âm cuối theo tiếng Việt.", en: "Do not add a Vietnamese-style final sound." },
    canada_practical: true,
    review_links: ["pa_a1_cross_greeting_001", "pa_a1_import_greeting_001"],
  },
  {
    id: "pa_a1_validation_identity_001",
    domain: "identity",
    style: "qa",
    prompt_vi: "Xác nhận giới thiệu tên và hỏi lại tên.",
    prompt_en: "Validate name introduction and asking back.",
    cue_pa: "ਮੇਰਾ ਨਾਮ ਆਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    romanization: "mera nam An hai. tuhada nam ki hai?",
    meaning_vi: "Tên tôi là An. Tên bạn là gì?",
    meaning_en: "My name is An. What is your name?",
    expected_pa: "ਮੇਰਾ ਨਾਮ ਆਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    validation_note_vi: "Khung tên nối câu chào với hội thoại.",
    validation_note_en: "The name frame connects greeting to conversation.",
    readiness_vi: "Sẵn sàng nếu giữ được ਮੇਰਾ ਨਾਮ ... ਹੈ.",
    readiness_en: "Ready if ਮੇਰਾ ਨਾਮ ... ਹੈ stays intact.",
    trap: { audience: "both", vi: "Đừng bỏ ਹੈ trong câu giới thiệu.", en: "Do not drop ਹੈ in the introduction." },
    review_links: ["pa_a1_cross_identity_001", "pa_a1_import_identity_001"],
  },
  {
    id: "pa_a1_validation_family_001",
    domain: "family",
    style: "connected_set",
    prompt_vi: "Xác nhận mẫu gia đình và sở hữu.",
    prompt_en: "Validate the family and possession pattern.",
    cue_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ ਹੈ।",
    romanization: "ih meri man hai. mere kol ikk bhra hai.",
    meaning_vi: "Đây là mẹ tôi. Tôi có một anh/em trai.",
    meaning_en: "This is my mother. I have one brother.",
    expected_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ ਹੈ।",
    validation_note_vi: "Mẫu này kiểm tra cả nhận diện người và 'tôi có'.",
    validation_note_en: "This checks both identifying a person and 'I have'.",
    readiness_vi: "Sẵn sàng nếu phân biệt ਮੇਰੀ và ਮੇਰੇ ਕੋਲ.",
    readiness_en: "Ready if ਮੇਰੀ and ਮੇਰੇ ਕੋਲ are distinguished.",
    trap: { audience: "en", vi: "Đừng dùng một dạng ਮੇਰਾ cho mọi danh từ.", en: "Do not use one fixed ਮੇਰਾ form for every noun." },
    canada_practical: true,
    review_links: ["pa_a1_cross_family_001", "pa_a1_import_family_001"],
  },
  {
    id: "pa_a1_validation_numbers_001",
    domain: "numbers",
    style: "cross_check",
    prompt_vi: "Xác nhận số trong ngữ cảnh vé.",
    prompt_en: "Validate the number in a ticket context.",
    cue_pa: "ਦੋ ਟਿਕਟਾਂ।",
    romanization: "do tiktan",
    meaning_vi: "Hai vé.",
    meaning_en: "Two tickets.",
    expected_pa: "ਦੋ ਟਿਕਟਾਂ।",
    validation_note_vi: "Số phải nối được sang giá.",
    validation_note_en: "The number must connect into a price.",
    readiness_vi: "Sẵn sàng nếu đọc được ਦੋ bằng Gurmukhi.",
    readiness_en: "Ready if ਦੋ is readable in Gurmukhi.",
    trap: { audience: "both", vi: "Đừng chỉ học số qua chữ Latin.", en: "Do not learn the number only through Latin letters." },
    canada_practical: true,
    review_links: ["pa_a1_cross_numbers_001", "pa_a1_import_numbers_001"],
  },
  {
    id: "pa_a1_validation_prices_001",
    domain: "prices",
    style: "selector",
    prompt_vi: "Xác nhận cụm giá ngắn.",
    prompt_en: "Validate the short price phrase.",
    cue_pa: "ਪੰਜ ਡਾਲਰ।",
    romanization: "panj dollar",
    meaning_vi: "Năm đô la.",
    meaning_en: "Five dollars.",
    expected_pa: "ਪੰਜ ਡਾਲਰ।",
    validation_note_vi: "Giá giữ số và đơn vị tiền trong cùng cụm.",
    validation_note_en: "The price keeps the number and currency in one phrase.",
    readiness_vi: "Sẵn sàng nếu người học hiểu đây là giá Canada-practical.",
    readiness_en: "Ready if the learner understands this as a Canada-practical price.",
    trap: { audience: "en", vi: "Đừng đảo trật tự theo tiếng Anh.", en: "Do not reorder it around English word order." },
    canada_practical: true,
    review_links: ["pa_a1_cross_prices_001", "pa_a1_import_prices_001"],
  },
  {
    id: "pa_a1_validation_food_001",
    domain: "food",
    style: "pre_integration",
    prompt_vi: "Xác nhận câu nhu cầu cơ bản.",
    prompt_en: "Validate the basic need line.",
    cue_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mainu pani chahida hai",
    meaning_vi: "Tôi cần nước.",
    meaning_en: "I need water.",
    expected_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    validation_note_vi: "Nhu cầu cơ bản nối sang xin giúp.",
    validation_note_en: "A basic need connects into asking for help.",
    readiness_vi: "Sẵn sàng nếu giữ ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ.",
    readiness_en: "Ready if ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ stays intact.",
    trap: { audience: "vi", vi: "Đừng bỏ ਮੈਨੂੰ vì tiếng Việt có thể lược chủ ngữ.", en: "Do not drop ਮੈਨੂੰ because Vietnamese can omit subjects." },
    canada_practical: true,
    review_links: ["pa_a1_cross_food_001", "pa_a1_import_food_001"],
  },
  {
    id: "pa_a1_validation_directions_001",
    domain: "directions",
    style: "qa",
    prompt_vi: "Xác nhận câu hỏi bến xe buýt.",
    prompt_en: "Validate the bus stop question.",
    cue_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    romanization: "bas adda kithe hai?",
    meaning_vi: "Bến xe buýt ở đâu?",
    meaning_en: "Where is the bus stop?",
    expected_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    validation_note_vi: "Câu hỏi vị trí phải giữ ਕਿੱਥੇ ਹੈ.",
    validation_note_en: "The location question must keep ਕਿੱਥੇ ਹੈ.",
    readiness_vi: "Sẵn sàng nếu dùng được khi cần đi lại ở Canada.",
    readiness_en: "Ready if usable for getting around in Canada.",
    trap: { audience: "en", vi: "Đừng đặt từ hỏi lên đầu theo tiếng Anh.", en: "Do not move the question word to the front like English." },
    canada_practical: true,
    review_links: ["pa_a1_cross_directions_001", "pa_a1_import_directions_001"],
  },
  {
    id: "pa_a1_validation_help_001",
    domain: "help",
    style: "cross_check",
    prompt_vi: "Xác nhận câu xin giúp.",
    prompt_en: "Validate the help request.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    romanization: "kirpa karke madad karo",
    meaning_vi: "Làm ơn giúp tôi.",
    meaning_en: "Please help me.",
    expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    validation_note_vi: "Câu này giữ luồng hội thoại khi người học bị kẹt.",
    validation_note_en: "This keeps the conversation going when the learner is stuck.",
    readiness_vi: "Sẵn sàng nếu dùng được sau nhu cầu hoặc chỉ đường.",
    readiness_en: "Ready if it works after a need or direction question.",
    trap: { audience: "both", vi: "Đừng thay bằng ghi chú tiếng Anh.", en: "Do not replace it with an English note." },
    canada_practical: true,
    review_links: ["pa_a1_cross_help_001", "pa_a1_import_help_001"],
  },
  {
    id: "pa_a1_validation_repetition_001",
    domain: "repetition",
    style: "final_validation",
    prompt_vi: "Xác nhận câu xin nói lại.",
    prompt_en: "Validate the repetition request.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    romanization: "kirpa karke dubara kaho",
    meaning_vi: "Làm ơn nói lại.",
    meaning_en: "Please say that again.",
    expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    validation_note_vi: "Câu này xử lý khi thiếu số, giá, hoặc hướng đi.",
    validation_note_en: "This handles missed numbers, prices, or directions.",
    readiness_vi: "Sẵn sàng nếu người học biết dùng thay vì im lặng.",
    readiness_en: "Ready if the learner can use it instead of staying silent.",
    trap: { audience: "vi", vi: "Đừng im lặng khi không nghe rõ.", en: "Do not stay silent when you miss something." },
    canada_practical: true,
    review_links: ["pa_a1_cross_repetition_001", "pa_a1_import_repetition_001"],
  },
  {
    id: "pa_a1_validation_politeness_001",
    domain: "politeness",
    style: "cross_check",
    prompt_vi: "Xác nhận lời cảm ơn cuối lượt.",
    prompt_en: "Validate thanks at the end of the turn.",
    cue_pa: "ਧੰਨਵਾਦ।",
    romanization: "dhanvad",
    meaning_vi: "Cảm ơn.",
    meaning_en: "Thank you.",
    expected_pa: "ਧੰਨਵਾਦ।",
    validation_note_vi: "Lời cảm ơn đóng chuỗi dịch vụ tự nhiên.",
    validation_note_en: "Thanks close the service sequence naturally.",
    readiness_vi: "Sẵn sàng nếu dùng sau khi được giúp.",
    readiness_en: "Ready if used after receiving help.",
    trap: { audience: "both", vi: "Đừng bỏ lịch sự khỏi lượt cuối.", en: "Do not remove politeness from the final turn." },
    canada_practical: true,
    review_links: ["pa_a1_cross_politeness_001", "pa_a1_import_politeness_001"],
  },
  {
    id: "pa_a1_validation_gurmukhi_001",
    domain: "gurmukhi_recognition",
    style: "selector",
    prompt_vi: "Xác nhận nhận diện nhóm chữ Gurmukhi.",
    prompt_en: "Validate recognition of the Gurmukhi word group.",
    cue_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    romanization: "pani, madad, bas, form",
    meaning_vi: "nước, giúp đỡ, xe buýt, mẫu đơn",
    meaning_en: "water, help, bus, form",
    expected_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    validation_note_vi: "Chữ gốc phải là trường chính.",
    validation_note_en: "The original script must be the primary field.",
    readiness_vi: "Sẵn sàng nếu romanization chỉ hỗ trợ, không thay thế.",
    readiness_en: "Ready if romanization supports but does not replace it.",
    trap: { audience: "both", vi: "Romanization là cầu nối, không thay thế Gurmukhi.", en: "Romanization is a bridge, not a replacement for Gurmukhi." },
    canada_practical: true,
    review_links: ["pa_a1_cross_gurmukhi_001", "pa_a1_import_gurmukhi_001"],
  },
  {
    id: "pa_a1_validation_romanization_001",
    domain: "romanization_bridge",
    style: "pre_integration",
    prompt_vi: "Xác nhận romanization quay lại được Gurmukhi.",
    prompt_en: "Validate that romanization returns to Gurmukhi.",
    cue_pa: "ਮਦਦ",
    romanization: "madad",
    meaning_vi: "giúp đỡ",
    meaning_en: "help",
    expected_pa: "ਮਦਦ",
    validation_note_vi: "Romanization giúp nhớ âm nhưng đáp án vẫn là Gurmukhi.",
    validation_note_en: "Romanization helps sound recall, but the answer stays Gurmukhi.",
    readiness_vi: "Sẵn sàng nếu người học không dùng Latin làm nội dung chính.",
    readiness_en: "Ready if the learner does not make Latin text the main content.",
    trap: { audience: "both", vi: "Đừng để romanization thành mục tiêu chính.", en: "Do not make romanization the main target." },
    review_links: ["pa_a1_cross_romanization_001", "pa_a1_import_romanization_001"],
  },
  {
    id: "pa_a1_validation_canada_service_001",
    domain: "canada_service",
    style: "connected_set",
    prompt_vi: "Xác nhận câu dịch vụ Canada kết nối nhận diện và nhu cầu.",
    prompt_en: "Validate the Canada service line connecting identity and need.",
    cue_pa: "ਮੇਰੇ ਕੋਲ ਪਛਾਣ ਹੈ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mere kol pachhan hai. mainu form chahida hai.",
    meaning_vi: "Tôi có giấy tờ tùy thân. Tôi cần mẫu đơn.",
    meaning_en: "I have ID. I need a form.",
    expected_pa: "ਮੇਰੇ ਕੋਲ ਪਛਾਣ ਹੈ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    validation_note_vi: "Mẫu này nối 'tôi có' với 'tôi cần'.",
    validation_note_en: "This connects 'I have' with 'I need'.",
    readiness_vi: "Sẵn sàng nếu vẫn là A1, không thành bài giấy tờ nâng cao.",
    readiness_en: "Ready if it stays A1 and does not become an advanced document lesson.",
    trap: { audience: "both", vi: "Đừng biến thành bài pháp lý hoặc giấy tờ nâng cao.", en: "Do not turn this into a legal or advanced document lesson." },
    canada_practical: true,
    review_links: ["pa_a1_cross_canada_service_001", "pa_a1_import_canada_service_001"],
  },
];

export default punjabiA1FinalValidationSet;
