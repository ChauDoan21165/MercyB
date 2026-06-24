// Punjabi A1 ship-candidate samples for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization supports recall. Native review is deferred.

export type PunjabiA1ShipCandidateDomain =
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
  | "canada_service_counter";

export type PunjabiA1ShipCandidateStyle =
  | "ship_candidate"
  | "go_no_go"
  | "release_candidate"
  | "closure_validation"
  | "pre_integration"
  | "readiness_check"
  | "qa"
  | "selector";

export type PunjabiA1ShipCandidateSample = {
  id: string;
  domain: PunjabiA1ShipCandidateDomain;
  style: PunjabiA1ShipCandidateStyle;
  prompt_vi: string;
  prompt_en: string;
  cue_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  expected_pa: string;
  ship_candidate_check_vi: string;
  ship_candidate_check_en: string;
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

export const shipCandidateScriptAwareness =
  "Gurmukhi is the primary script for this Punjabi A1 ship-candidate set. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1ShipCandidateSamples: PunjabiA1ShipCandidateSample[] = [
  {
    id: "pa_a1_ship_candidate_greeting_001",
    domain: "greetings",
    style: "ship_candidate",
    prompt_vi: "Xác nhận câu chào ổn định cho bản ship candidate.",
    prompt_en: "Confirm the greeting is stable for the ship candidate.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    romanization: "sat sri akal",
    meaning_vi: "Xin chào.",
    meaning_en: "Hello.",
    expected_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    ship_candidate_check_vi: "Câu chào phải mở được luồng A1.",
    ship_candidate_check_en: "The greeting must open the A1 flow.",
    readiness_vi: "Sẵn sàng nếu người học nhận ra Gurmukhi trước romanization.",
    readiness_en: "Ready if the learner recognizes Gurmukhi before romanization.",
    trap: { audience: "vi", vi: "Đừng thêm âm cuối kiểu tiếng Việt.", en: "Do not add a Vietnamese-style final sound." },
    canada_practical: true,
    review_links: ["pa_a1_closure_greeting_001", "pa_a1_validation_greeting_001"],
  },
  {
    id: "pa_a1_ship_candidate_identity_001",
    domain: "identity",
    style: "qa",
    prompt_vi: "Xác nhận giới thiệu tên và hỏi lại tên.",
    prompt_en: "Confirm name introduction and asking back.",
    cue_pa: "ਮੇਰਾ ਨਾਮ ਆਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    romanization: "mera nam An hai. tuhada nam ki hai?",
    meaning_vi: "Tên tôi là An. Tên bạn là gì?",
    meaning_en: "My name is An. What is your name?",
    expected_pa: "ਮੇਰਾ ਨਾਮ ਆਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    ship_candidate_check_vi: "Khung tên phải nối được sau câu chào.",
    ship_candidate_check_en: "The name frame must connect after the greeting.",
    readiness_vi: "Sẵn sàng nếu giữ được ਮੇਰਾ ਨਾਮ ... ਹੈ.",
    readiness_en: "Ready if ਮੇਰਾ ਨਾਮ ... ਹੈ stays intact.",
    trap: { audience: "both", vi: "Đừng bỏ ਹੈ ở câu giới thiệu.", en: "Do not drop ਹੈ in the introduction." },
    review_links: ["pa_a1_closure_identity_001", "pa_a1_validation_identity_001"],
  },
  {
    id: "pa_a1_ship_candidate_family_001",
    domain: "family",
    style: "readiness_check",
    prompt_vi: "Xác nhận mẫu gia đình và sở hữu cơ bản.",
    prompt_en: "Confirm the basic family and possession pattern.",
    cue_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ ਹੈ।",
    romanization: "ih meri man hai. mere kol ikk bhra hai.",
    meaning_vi: "Đây là mẹ tôi. Tôi có một anh/em trai.",
    meaning_en: "This is my mother. I have one brother.",
    expected_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ ਹੈ।",
    ship_candidate_check_vi: "Mẫu này kiểm tra người thân và 'tôi có'.",
    ship_candidate_check_en: "This checks family members and 'I have'.",
    readiness_vi: "Sẵn sàng nếu phân biệt ਮੇਰੀ và ਮੇਰੇ ਕੋਲ.",
    readiness_en: "Ready if ਮੇਰੀ and ਮੇਰੇ ਕੋਲ are distinguished.",
    trap: { audience: "en", vi: "Đừng dùng một dạng ਮੇਰਾ cho mọi danh từ.", en: "Do not use one fixed ਮੇਰਾ form for every noun." },
    canada_practical: true,
    review_links: ["pa_a1_validation_family_001", "pa_a1_cross_family_001"],
  },
  {
    id: "pa_a1_ship_candidate_numbers_001",
    domain: "numbers",
    style: "go_no_go",
    prompt_vi: "Xác nhận số lượng trong vé.",
    prompt_en: "Confirm the ticket quantity.",
    cue_pa: "ਦੋ ਟਿਕਟਾਂ।",
    romanization: "do tiktan",
    meaning_vi: "Hai vé.",
    meaning_en: "Two tickets.",
    expected_pa: "ਦੋ ਟਿਕਟਾਂ।",
    ship_candidate_check_vi: "Số phải chạy được trước khi nối sang giá.",
    ship_candidate_check_en: "The number must work before linking to a price.",
    readiness_vi: "Sẵn sàng nếu đọc được ਦੋ trong chữ Gurmukhi.",
    readiness_en: "Ready if ਦੋ is readable in Gurmukhi.",
    trap: { audience: "both", vi: "Đừng chỉ học số qua chữ Latin.", en: "Do not learn the number only through Latin letters." },
    canada_practical: true,
    review_links: ["pa_a1_closure_numbers_prices_001", "pa_a1_validation_numbers_001"],
  },
  {
    id: "pa_a1_ship_candidate_prices_001",
    domain: "prices",
    style: "selector",
    prompt_vi: "Xác nhận cụm giá ngắn.",
    prompt_en: "Confirm the short price phrase.",
    cue_pa: "ਪੰਜ ਡਾਲਰ।",
    romanization: "panj dollar",
    meaning_vi: "Năm đô la.",
    meaning_en: "Five dollars.",
    expected_pa: "ਪੰਜ ਡਾਲਰ।",
    ship_candidate_check_vi: "Giá phải giữ số và đơn vị tiền rõ ràng.",
    ship_candidate_check_en: "The price must keep number and currency clear.",
    readiness_vi: "Sẵn sàng nếu dùng được trong ngữ cảnh Canada.",
    readiness_en: "Ready if usable in a Canada context.",
    trap: { audience: "en", vi: "Đừng đảo trật tự theo tiếng Anh.", en: "Do not reorder it like English." },
    canada_practical: true,
    review_links: ["pa_a1_closure_numbers_prices_002", "pa_a1_validation_prices_001"],
  },
  {
    id: "pa_a1_ship_candidate_food_001",
    domain: "food",
    style: "pre_integration",
    prompt_vi: "Xác nhận câu nhu cầu cơ bản.",
    prompt_en: "Confirm the basic need line.",
    cue_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mainu pani chahida hai",
    meaning_vi: "Tôi cần nước.",
    meaning_en: "I need water.",
    expected_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    ship_candidate_check_vi: "Mẫu nhu cầu phải giữ ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ.",
    ship_candidate_check_en: "The need frame must keep ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ.",
    readiness_vi: "Sẵn sàng nếu dùng được trước khi xin giúp.",
    readiness_en: "Ready if usable before asking for help.",
    trap: { audience: "vi", vi: "Đừng bỏ ਮੈਨੂੰ vì tiếng Việt có thể lược chủ ngữ.", en: "Do not drop ਮੈਨੂੰ because Vietnamese can omit subjects." },
    canada_practical: true,
    review_links: ["pa_a1_validation_food_001", "pa_a1_cross_food_001"],
  },
  {
    id: "pa_a1_ship_candidate_directions_001",
    domain: "directions",
    style: "qa",
    prompt_vi: "Xác nhận câu hỏi bến xe buýt.",
    prompt_en: "Confirm the bus stop question.",
    cue_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    romanization: "bas adda kithe hai?",
    meaning_vi: "Bến xe buýt ở đâu?",
    meaning_en: "Where is the bus stop?",
    expected_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    ship_candidate_check_vi: "Câu hỏi vị trí phải giữ ਕਿੱਥੇ ਹੈ.",
    ship_candidate_check_en: "The location question must keep ਕਿੱਥੇ ਹੈ.",
    readiness_vi: "Sẵn sàng nếu dùng được khi đi lại ở Canada.",
    readiness_en: "Ready if usable when getting around in Canada.",
    trap: { audience: "en", vi: "Đừng đặt từ hỏi lên đầu theo tiếng Anh.", en: "Do not move the question word to the front like English." },
    canada_practical: true,
    review_links: ["pa_a1_validation_directions_001", "pa_a1_cross_directions_001"],
  },
  {
    id: "pa_a1_ship_candidate_help_001",
    domain: "help",
    style: "release_candidate",
    prompt_vi: "Xác nhận câu xin giúp.",
    prompt_en: "Confirm the help request.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    romanization: "kirpa karke madad karo",
    meaning_vi: "Làm ơn giúp tôi.",
    meaning_en: "Please help me.",
    expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    ship_candidate_check_vi: "Câu xin giúp là câu cứu nguy của bản A1.",
    ship_candidate_check_en: "The help request is the rescue line for A1.",
    readiness_vi: "Sẵn sàng nếu dùng được khi bị kẹt.",
    readiness_en: "Ready if usable when stuck.",
    trap: { audience: "both", vi: "Đừng thay bằng ghi chú tiếng Anh.", en: "Do not replace it with an English note." },
    canada_practical: true,
    review_links: ["pa_a1_closure_help_001", "pa_a1_validation_help_001"],
  },
  {
    id: "pa_a1_ship_candidate_repetition_001",
    domain: "repetition",
    style: "ship_candidate",
    prompt_vi: "Xác nhận câu xin nói lại lịch sự.",
    prompt_en: "Confirm the polite repetition request.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    romanization: "kirpa karke dubara kaho",
    meaning_vi: "Làm ơn nói lại.",
    meaning_en: "Please say that again.",
    expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    ship_candidate_check_vi: "Câu này xử lý khi thiếu số, giá, hoặc hướng dẫn.",
    ship_candidate_check_en: "This handles missed numbers, prices, or directions.",
    readiness_vi: "Sẵn sàng nếu người học dùng thay vì im lặng.",
    readiness_en: "Ready if the learner uses it instead of staying silent.",
    trap: { audience: "vi", vi: "Đừng im lặng khi không nghe rõ.", en: "Do not stay silent when you miss something." },
    canada_practical: true,
    review_links: ["pa_a1_closure_repetition_001", "pa_a1_validation_repetition_001"],
  },
  {
    id: "pa_a1_ship_candidate_politeness_001",
    domain: "politeness",
    style: "closure_validation",
    prompt_vi: "Xác nhận lời cảm ơn cuối lượt.",
    prompt_en: "Confirm thanks at the end of the turn.",
    cue_pa: "ਧੰਨਵਾਦ।",
    romanization: "dhanvad",
    meaning_vi: "Cảm ơn.",
    meaning_en: "Thank you.",
    expected_pa: "ਧੰਨਵਾਦ।",
    ship_candidate_check_vi: "Lời cảm ơn đóng luồng dịch vụ một cách lịch sự.",
    ship_candidate_check_en: "Thanks close the service flow politely.",
    readiness_vi: "Sẵn sàng nếu dùng sau khi được giúp.",
    readiness_en: "Ready if used after receiving help.",
    trap: { audience: "both", vi: "Đừng bỏ lịch sự ở lượt cuối.", en: "Do not drop politeness in the final turn." },
    canada_practical: true,
    review_links: ["pa_a1_closure_polite_repetition_002", "pa_a1_validation_politeness_001"],
  },
  {
    id: "pa_a1_ship_candidate_gurmukhi_001",
    domain: "gurmukhi_recognition",
    style: "selector",
    prompt_vi: "Xác nhận nhận diện nhóm chữ Gurmukhi.",
    prompt_en: "Confirm recognition of the Gurmukhi word group.",
    cue_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    romanization: "pani, madad, bas, form",
    meaning_vi: "nước, giúp đỡ, xe buýt, mẫu đơn",
    meaning_en: "water, help, bus, form",
    expected_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    ship_candidate_check_vi: "Chữ gốc phải là nội dung chính.",
    ship_candidate_check_en: "The original script must be the main content.",
    readiness_vi: "Sẵn sàng nếu romanization chỉ hỗ trợ.",
    readiness_en: "Ready if romanization only supports it.",
    trap: { audience: "both", vi: "Romanization là cầu nối, không thay thế Gurmukhi.", en: "Romanization is a bridge, not a replacement for Gurmukhi." },
    canada_practical: true,
    review_links: ["pa_a1_closure_gurmukhi_001", "pa_a1_validation_gurmukhi_001"],
  },
  {
    id: "pa_a1_ship_candidate_romanization_001",
    domain: "romanization_bridge",
    style: "pre_integration",
    prompt_vi: "Xác nhận romanization quay lại được Gurmukhi.",
    prompt_en: "Confirm romanization can return to Gurmukhi.",
    cue_pa: "ਮਦਦ",
    romanization: "madad",
    meaning_vi: "giúp đỡ",
    meaning_en: "help",
    expected_pa: "ਮਦਦ",
    ship_candidate_check_vi: "Romanization hỗ trợ âm, nhưng đáp án vẫn là Gurmukhi.",
    ship_candidate_check_en: "Romanization supports sound, but the answer stays Gurmukhi.",
    readiness_vi: "Sẵn sàng nếu không biến chữ Latin thành mục tiêu chính.",
    readiness_en: "Ready if Latin text does not become the main target.",
    trap: { audience: "both", vi: "Đừng để romanization thay thế chữ Gurmukhi.", en: "Do not let romanization replace Gurmukhi." },
    review_links: ["pa_a1_closure_romanization_001", "pa_a1_validation_romanization_001"],
  },
  {
    id: "pa_a1_ship_candidate_canada_counter_001",
    domain: "canada_service_counter",
    style: "ship_candidate",
    prompt_vi: "Xác nhận câu quầy dịch vụ Canada.",
    prompt_en: "Confirm the Canada service-counter line.",
    cue_pa: "ਮੇਰੇ ਕੋਲ ਪਛਾਣ ਹੈ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mere kol pachhan hai. mainu form chahida hai.",
    meaning_vi: "Tôi có giấy tờ tùy thân. Tôi cần mẫu đơn.",
    meaning_en: "I have ID. I need a form.",
    expected_pa: "ਮੇਰੇ ਕੋਲ ਪਛਾਣ ਹੈ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    ship_candidate_check_vi: "Mẫu này nối 'tôi có' với 'tôi cần' ở mức A1.",
    ship_candidate_check_en: "This connects 'I have' with 'I need' at A1 level.",
    readiness_vi: "Sẵn sàng nếu vẫn là thực hành dịch vụ cơ bản.",
    readiness_en: "Ready if it remains basic service practice.",
    trap: { audience: "both", vi: "Đừng biến thành bài giấy tờ nâng cao.", en: "Do not turn this into an advanced document lesson." },
    canada_practical: true,
    review_links: ["pa_a1_closure_canada_counter_001", "pa_a1_validation_canada_service_001"],
  },
];

export default punjabiA1ShipCandidateSamples;
