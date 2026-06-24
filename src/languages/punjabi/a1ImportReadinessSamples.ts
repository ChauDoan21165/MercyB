// Punjabi A1 import-readiness samples for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization supports recall. Native review is deferred.

export type PunjabiA1ImportReadinessDomain =
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

export type PunjabiA1ImportReadinessStyle =
  | "import_readiness"
  | "final_regression"
  | "pre_integration"
  | "checkpoint"
  | "qa"
  | "selector";

export type PunjabiA1ImportReadinessSample = {
  id: string;
  domain: PunjabiA1ImportReadinessDomain;
  style: PunjabiA1ImportReadinessStyle;
  prompt_vi: string;
  prompt_en: string;
  cue_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  expected_pa: string;
  import_hint_vi: string;
  import_hint_en: string;
  why_import_vi: string;
  why_import_en: string;
  trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: boolean;
  review_links: string[];
};

export const importReadinessScriptAwareness =
  "Gurmukhi is the primary script for this Punjabi A1 import-readiness set. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1ImportReadinessSamples: PunjabiA1ImportReadinessSample[] = [
  {
    id: "pa_a1_import_greeting_001",
    domain: "greetings",
    style: "import_readiness",
    prompt_vi: "Xác nhận câu chào sẵn sàng để nhập vào app.",
    prompt_en: "Confirm the greeting is ready for app import.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    romanization: "sat sri akal",
    meaning_vi: "Xin chào.",
    meaning_en: "Hello.",
    expected_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    import_hint_vi: "Giữ Gurmukhi là trường chính.",
    import_hint_en: "Keep Gurmukhi as the primary field.",
    why_import_vi: "Câu chào là mẫu đầu tiên nhiều màn hình A1 dùng lại.",
    why_import_en: "The greeting is the first pattern many A1 screens reuse.",
    trap: { audience: "vi", vi: "Đừng thêm dấu hoặc âm cuối theo tiếng Việt.", en: "Do not add Vietnamese-style marks or final sounds." },
    canada_practical: true,
    review_links: ["pa_a1_merge_greeting_001", "pa_a1_regression_greeting_001"],
  },
  {
    id: "pa_a1_import_identity_001",
    domain: "identity",
    style: "qa",
    prompt_vi: "Kiểm tra mẫu tên trước khi import.",
    prompt_en: "Check the name frame before import.",
    cue_pa: "ਮੇਰਾ ਨਾਮ ਆਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    romanization: "mera nam An hai. tuhada nam ki hai?",
    meaning_vi: "Tên tôi là An. Tên bạn là gì?",
    meaning_en: "My name is An. What is your name?",
    expected_pa: "ਮੇਰਾ ਨਾਮ ਆਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    import_hint_vi: "Một mẫu vừa giới thiệu vừa hỏi lại.",
    import_hint_en: "One sample introduces and asks back.",
    why_import_vi: "Danh tính nối lời chào với tương tác thật.",
    why_import_en: "Identity connects greetings to real interaction.",
    trap: { audience: "both", vi: "Đừng bỏ ਹੈ ở cuối câu giới thiệu.", en: "Do not drop ਹੈ from the introduction." },
    review_links: ["pa_a1_merge_identity_001", "pa_a1_regression_identity_001"],
  },
  {
    id: "pa_a1_import_family_001",
    domain: "family",
    style: "checkpoint",
    prompt_vi: "Kiểm tra gia đình với sở hữu đơn giản.",
    prompt_en: "Check family with simple possession.",
    cue_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ ਹੈ।",
    romanization: "ih meri man hai. mere kol ikk bhra hai.",
    meaning_vi: "Đây là mẹ tôi. Tôi có một anh/em trai.",
    meaning_en: "This is my mother. I have one brother.",
    expected_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ ਹੈ।",
    import_hint_vi: "Giữ cả ਮੇਰੀ ਮਾਂ và ਮੇਰੇ ਕੋਲ.",
    import_hint_en: "Keep both ਮੇਰੀ ਮਾਂ and ਮੇਰੇ ਕੋਲ.",
    why_import_vi: "Mẫu này kiểm tra sở hữu trước khi dữ liệu được dùng lại.",
    why_import_en: "This checks possession before the data is reused.",
    trap: { audience: "en", vi: "Đừng xem ਮੇਰਾ và ਮੇਰੀ là cùng một dạng cố định.", en: "Do not treat ਮੇਰਾ and ਮੇਰੀ as one fixed form." },
    canada_practical: true,
    review_links: ["pa_a1_merge_family_001", "pa_a1_regression_family_001"],
  },
  {
    id: "pa_a1_import_numbers_001",
    domain: "numbers",
    style: "final_regression",
    prompt_vi: "Kiểm tra số lượng trong ngữ cảnh vé.",
    prompt_en: "Check quantity in a ticket context.",
    cue_pa: "ਦੋ ਟਿਕਟਾਂ।",
    romanization: "do tiktan",
    meaning_vi: "Hai vé.",
    meaning_en: "Two tickets.",
    expected_pa: "ਦੋ ਟਿਕਟਾਂ।",
    import_hint_vi: "Số phải đọc được riêng và trong cụm.",
    import_hint_en: "The number must work alone and in the phrase.",
    why_import_vi: "Số thường được dùng lại trong giá và dịch vụ.",
    why_import_en: "Numbers are reused in prices and services.",
    trap: { audience: "both", vi: "Đừng chỉ lưu số qua romanization.", en: "Do not store the number only through romanization." },
    canada_practical: true,
    review_links: ["pa_a1_merge_numbers_001", "pa_a1_regression_numbers_001"],
  },
  {
    id: "pa_a1_import_prices_001",
    domain: "prices",
    style: "selector",
    prompt_vi: "Kiểm tra cụm giá ngắn.",
    prompt_en: "Check the short price phrase.",
    cue_pa: "ਪੰਜ ਡਾਲਰ।",
    romanization: "panj dollar",
    meaning_vi: "Năm đô la.",
    meaning_en: "Five dollars.",
    expected_pa: "ਪੰਜ ਡਾਲਰ।",
    import_hint_vi: "Giữ số và đơn vị tiền cạnh nhau.",
    import_hint_en: "Keep the number and currency unit together.",
    why_import_vi: "Giá cần sẵn sàng cho ví dụ Canada-practical.",
    why_import_en: "Prices need to be ready for Canada-practical examples.",
    trap: { audience: "en", vi: "Đừng đổi trật tự theo câu tiếng Anh đầy đủ.", en: "Do not reorder it like a full English sentence." },
    canada_practical: true,
    review_links: ["pa_a1_merge_prices_001", "pa_a1_regression_prices_001"],
  },
  {
    id: "pa_a1_import_food_001",
    domain: "food",
    style: "pre_integration",
    prompt_vi: "Kiểm tra nhu cầu cơ bản về nước.",
    prompt_en: "Check the basic need for water.",
    cue_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mainu pani chahida hai",
    meaning_vi: "Tôi cần nước.",
    meaning_en: "I need water.",
    expected_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    import_hint_vi: "Mẫu nhu cầu giữ ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ.",
    import_hint_en: "The need frame keeps ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ.",
    why_import_vi: "Câu nhu cầu phải hoạt động trước khi đưa vào luồng học.",
    why_import_en: "The need line must work before it enters the learning flow.",
    trap: { audience: "vi", vi: "Đừng bỏ ਮੈਨੂੰ vì tiếng Việt có thể lược chủ ngữ.", en: "Do not drop ਮੈਨੂੰ because Vietnamese can omit subjects." },
    canada_practical: true,
    review_links: ["pa_a1_merge_food_001", "pa_a1_regression_food_001"],
  },
  {
    id: "pa_a1_import_directions_001",
    domain: "directions",
    style: "qa",
    prompt_vi: "Kiểm tra câu hỏi bến xe buýt.",
    prompt_en: "Check the bus stop question.",
    cue_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    romanization: "bas adda kithe hai?",
    meaning_vi: "Bến xe buýt ở đâu?",
    meaning_en: "Where is the bus stop?",
    expected_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    import_hint_vi: "Câu vị trí dùng ਕਿੱਥੇ ਹੈ.",
    import_hint_en: "The location question uses ਕਿੱਥੇ ਹੈ.",
    why_import_vi: "Chỉ đường là tình huống thực tế cần test trước import.",
    why_import_en: "Directions are a practical situation to test before import.",
    trap: { audience: "en", vi: "Đừng đặt từ hỏi lên đầu theo tiếng Anh.", en: "Do not move the question word to the front like English." },
    canada_practical: true,
    review_links: ["pa_a1_merge_directions_001", "pa_a1_regression_directions_001"],
  },
  {
    id: "pa_a1_import_help_001",
    domain: "help",
    style: "checkpoint",
    prompt_vi: "Kiểm tra câu xin giúp ngắn.",
    prompt_en: "Check the short help request.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    romanization: "kirpa karke madad karo",
    meaning_vi: "Làm ơn giúp tôi.",
    meaning_en: "Please help me.",
    expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    import_hint_vi: "Giữ câu này đủ ngắn để dùng khi kẹt.",
    import_hint_en: "Keep this short enough to use when stuck.",
    why_import_vi: "Câu xin giúp là mẫu an toàn trong nhiều bài.",
    why_import_en: "The help request is a safety pattern across lessons.",
    trap: { audience: "both", vi: "Đừng thay bằng ghi chú tiếng Anh trong dữ liệu.", en: "Do not replace it with an English note in the data." },
    canada_practical: true,
    review_links: ["pa_a1_merge_help_001", "pa_a1_regression_help_001"],
  },
  {
    id: "pa_a1_import_repetition_001",
    domain: "repetition",
    style: "import_readiness",
    prompt_vi: "Kiểm tra câu yêu cầu nói lại.",
    prompt_en: "Check the request for repetition.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    romanization: "kirpa karke dubara kaho",
    meaning_vi: "Làm ơn nói lại.",
    meaning_en: "Please say that again.",
    expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    import_hint_vi: "Dùng khi người học không nghe rõ số, giá, hoặc đường đi.",
    import_hint_en: "Use when the learner misses a number, price, or direction.",
    why_import_vi: "Câu lặp lại giúp dữ liệu tạo thành bộ kết nối.",
    why_import_en: "The repetition line helps the data form a connected set.",
    trap: { audience: "vi", vi: "Đừng để người học im lặng khi thiếu thông tin.", en: "Do not leave the learner silent when information is missing." },
    canada_practical: true,
    review_links: ["pa_a1_merge_repetition_001", "pa_a1_regression_repetition_001"],
  },
  {
    id: "pa_a1_import_politeness_001",
    domain: "politeness",
    style: "final_regression",
    prompt_vi: "Kiểm tra lời cảm ơn.",
    prompt_en: "Check the thanks line.",
    cue_pa: "ਧੰਨਵਾਦ।",
    romanization: "dhanvad",
    meaning_vi: "Cảm ơn.",
    meaning_en: "Thank you.",
    expected_pa: "ਧੰਨਵਾਦ।",
    import_hint_vi: "Dùng sau khi được giúp hoặc nhận thông tin.",
    import_hint_en: "Use after getting help or information.",
    why_import_vi: "Lịch sự là tín hiệu nhỏ nhưng cần nhất quán.",
    why_import_en: "Politeness is a small signal that must stay consistent.",
    trap: { audience: "both", vi: "Đừng bỏ câu này khỏi luồng dịch vụ.", en: "Do not remove this from service flows." },
    canada_practical: true,
    review_links: ["pa_a1_merge_politeness_001", "pa_a1_regression_politeness_001"],
  },
  {
    id: "pa_a1_import_gurmukhi_001",
    domain: "gurmukhi_recognition",
    style: "selector",
    prompt_vi: "Kiểm tra nhận diện chữ Gurmukhi.",
    prompt_en: "Check Gurmukhi recognition.",
    cue_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    romanization: "pani, madad, bas, form",
    meaning_vi: "nước, giúp đỡ, xe buýt, mẫu đơn",
    meaning_en: "water, help, bus, form",
    expected_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    import_hint_vi: "Trường chữ gốc phải đứng trước romanization.",
    import_hint_en: "The original-script field must come before romanization.",
    why_import_vi: "Import cần xác nhận dữ liệu không chỉ là chữ Latin.",
    why_import_en: "Import needs confirmation that the data is not only Latin text.",
    trap: { audience: "both", vi: "Romanization là cầu nối, không thay thế Gurmukhi.", en: "Romanization is a bridge, not a replacement for Gurmukhi." },
    canada_practical: true,
    review_links: ["pa_a1_merge_gurmukhi_001", "pa_a1_regression_gurmukhi_001"],
  },
  {
    id: "pa_a1_import_romanization_001",
    domain: "romanization_bridge",
    style: "pre_integration",
    prompt_vi: "Dùng romanization để quay lại chữ Gurmukhi.",
    prompt_en: "Use romanization to return to Gurmukhi.",
    cue_pa: "ਧੰਨਵਾਦ",
    romanization: "dhanvad",
    meaning_vi: "Cảm ơn.",
    meaning_en: "Thank you.",
    expected_pa: "ਧੰਨਵਾਦ",
    import_hint_vi: "Romanization giúp nhớ âm, nhưng đáp án vẫn là Gurmukhi.",
    import_hint_en: "Romanization supports sound recall, but the answer stays Gurmukhi.",
    why_import_vi: "Cầu nối romanization cần rõ trước khi nhập dữ liệu.",
    why_import_en: "The romanization bridge needs to be clear before data import.",
    trap: { audience: "both", vi: "Đừng để romanization thành nội dung chính.", en: "Do not let romanization become the main content." },
    review_links: ["pa_a1_merge_gurmukhi_001", "pa_a1_regression_gurmukhi_001"],
  },
  {
    id: "pa_a1_import_canada_service_001",
    domain: "canada_service",
    style: "import_readiness",
    prompt_vi: "Kiểm tra câu ở quầy dịch vụ Canada.",
    prompt_en: "Check the Canada service counter line.",
    cue_pa: "ਮੇਰੇ ਕੋਲ ਪਛਾਣ ਹੈ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mere kol pachhan hai. mainu form chahida hai.",
    meaning_vi: "Tôi có giấy tờ tùy thân. Tôi cần mẫu đơn.",
    meaning_en: "I have ID. I need a form.",
    expected_pa: "ਮੇਰੇ ਕੋਲ ਪਛਾਣ ਹੈ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    import_hint_vi: "Nối 'tôi có' và 'tôi cần' trong cùng một ngữ cảnh.",
    import_hint_en: "Connect 'I have' and 'I need' in one context.",
    why_import_vi: "Ví dụ thực tế cần đủ ngắn để nhập và tái sử dụng.",
    why_import_en: "The practical example must stay short enough to import and reuse.",
    trap: { audience: "both", vi: "Đừng biến thành bài pháp lý hoặc giấy tờ nâng cao.", en: "Do not turn this into a legal or advanced document lesson." },
    canada_practical: true,
    review_links: ["pa_a1_merge_canada_service_001", "pa_a1_regression_canada_service_001"],
  },
];

export default punjabiA1ImportReadinessSamples;
