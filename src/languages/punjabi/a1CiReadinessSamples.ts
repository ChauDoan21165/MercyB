// Punjabi A1 CI-readiness samples for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization supports recognition. Native review is deferred.

export type PunjabiA1CiReadinessDomain =
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

export type PunjabiA1CiReadinessStyle =
  | "ci_readiness"
  | "mr_readiness"
  | "final_freeze"
  | "pre_integration"
  | "qa"
  | "readiness_check";

export type PunjabiA1CiReadinessSample = {
  id: string;
  domain: PunjabiA1CiReadinessDomain;
  style: PunjabiA1CiReadinessStyle;
  prompt_vi: string;
  prompt_en: string;
  cue_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  expected_pa: string;
  ci_readiness_check_vi: string;
  ci_readiness_check_en: string;
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

export const ciReadinessScriptAwareness =
  "Gurmukhi is the primary script for this Punjabi A1 CI-readiness set. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1CiReadinessSamples: PunjabiA1CiReadinessSample[] = [
  {
    id: "pa_a1_ci_readiness_greeting_001",
    domain: "greetings",
    style: "ci_readiness",
    prompt_vi: "Đóng băng câu chào mở đầu ở mức A1.",
    prompt_en: "Freeze the opening A1 greeting.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    romanization: "sat sri akal",
    meaning_vi: "Xin chào.",
    meaning_en: "Hello.",
    expected_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    ci_readiness_check_vi: "Câu chào phải giữ Gurmukhi làm nội dung chính.",
    ci_readiness_check_en: "The greeting must keep Gurmukhi as the primary content.",
    readiness_vi: "Sẵn sàng đóng băng nếu người học có thể chào trước khi dùng romanization.",
    readiness_en: "Ready to freeze if the learner can greet before relying on romanization.",
    trap: { audience: "vi", vi: "Đừng thêm âm cuối theo thói quen tiếng Việt.", en: "Do not add a Vietnamese-style final sound." },
    canada_practical: true,
    review_links: ["pa_a1_owner_acceptance_greeting_001", "pa_a1_validation_greeting_001"],
  },
  {
    id: "pa_a1_ci_readiness_identity_001",
    domain: "identity",
    style: "mr_readiness",
    prompt_vi: "Đóng băng mẫu giới thiệu tên và hỏi tên.",
    prompt_en: "Freeze the name introduction and name question.",
    cue_pa: "ਮੇਰਾ ਨਾਮ ਲਿਨ੍ਹ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    romanization: "mera nam Linh hai. tuhada nam ki hai?",
    meaning_vi: "Tên tôi là Linh. Tên bạn là gì?",
    meaning_en: "My name is Linh. What is your name?",
    expected_pa: "ਮੇਰਾ ਨਾਮ ਲਿਨ੍ਹ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    ci_readiness_check_vi: "Mẫu ਮੇਰਾ ਨਾਮ ... ਹੈ phải còn nguyên trước khi hỏi lại.",
    ci_readiness_check_en: "The ਮੇਰਾ ਨਾਮ ... ਹੈ frame must stay intact before asking back.",
    readiness_vi: "Sẵn sàng đóng băng nếu không bỏ ਹੈ.",
    readiness_en: "Ready to freeze if ਹੈ is not dropped.",
    trap: { audience: "both", vi: "Đừng dịch từng chữ từ tiếng Anh hoặc tiếng Việt.", en: "Do not translate word by word from English or Vietnamese." },
    canada_practical: true,
    review_links: ["pa_a1_owner_acceptance_identity_001", "pa_a1_validation_identity_001"],
  },
  {
    id: "pa_a1_ci_readiness_family_001",
    domain: "family",
    style: "final_freeze",
    prompt_vi: "Đóng băng mẫu nói về gia đình đơn giản.",
    prompt_en: "Freeze a simple family statement.",
    cue_pa: "ਇਹ ਮੇਰੇ ਪਿਤਾ ਜੀ ਹਨ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭੈਣ ਹੈ।",
    romanization: "ih mere pita ji han. mere kol ikk bhain hai.",
    meaning_vi: "Đây là cha tôi. Tôi có một chị/em gái.",
    meaning_en: "This is my father. I have one sister.",
    expected_pa: "ਇਹ ਮੇਰੇ ਪਿਤਾ ਜੀ ਹਨ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭੈਣ ਹੈ।",
    ci_readiness_check_vi: "Mẫu gia đình phải kiểm tra cả giới thiệu người thân và 'tôi có'.",
    ci_readiness_check_en: "The family sample must check both introducing a relative and 'I have'.",
    readiness_vi: "Sẵn sàng đóng băng nếu phân biệt ਮੇਰੇ và ਮੇਰੇ ਕੋਲ.",
    readiness_en: "Ready to freeze if ਮੇਰੇ and ਮੇਰੇ ਕੋਲ are distinguished.",
    trap: { audience: "en", vi: "Đừng dùng một dạng possessive cho mọi danh từ.", en: "Do not use one possessive form for every noun." },
    review_links: ["pa_a1_owner_acceptance_family_001", "pa_a1_validation_family_001"],
  },
  {
    id: "pa_a1_ci_readiness_numbers_001",
    domain: "numbers",
    style: "readiness_check",
    prompt_vi: "Đóng băng số lượng trong tình huống vé.",
    prompt_en: "Freeze quantity in a ticket situation.",
    cue_pa: "ਤਿੰਨ ਟਿਕਟਾਂ।",
    romanization: "tinn tiktan",
    meaning_vi: "Ba vé.",
    meaning_en: "Three tickets.",
    expected_pa: "ਤਿੰਨ ਟਿਕਟਾਂ।",
    ci_readiness_check_vi: "Số phải đọc được bằng Gurmukhi trước khi nối với giá.",
    ci_readiness_check_en: "The number must be readable in Gurmukhi before linking to prices.",
    readiness_vi: "Sẵn sàng đóng băng nếu nhận ra ਤਿੰਨ không cần chữ Latin trước.",
    readiness_en: "Ready to freeze if ਤਿੰਨ is recognized without Latin text first.",
    trap: { audience: "both", vi: "Đừng chỉ học số qua romanization.", en: "Do not learn numbers only through romanization." },
    canada_practical: true,
    review_links: ["pa_a1_owner_acceptance_numbers_001", "pa_a1_validation_numbers_001"],
  },
  {
    id: "pa_a1_ci_readiness_prices_001",
    domain: "prices",
    style: "qa",
    prompt_vi: "Đóng băng câu hỏi giá ngắn.",
    prompt_en: "Freeze a short price question.",
    cue_pa: "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?",
    romanization: "ih kinne da hai?",
    meaning_vi: "Cái này giá bao nhiêu?",
    meaning_en: "How much is this?",
    expected_pa: "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?",
    ci_readiness_check_vi: "Câu giá phải dùng được ở quầy hoặc cửa hàng Canada.",
    ci_readiness_check_en: "The price question must work at a Canada counter or shop.",
    readiness_vi: "Sẵn sàng đóng băng nếu không đổi thành trật tự tiếng Anh.",
    readiness_en: "Ready to freeze if it is not reordered like English.",
    trap: { audience: "en", vi: "Đừng đưa từ hỏi lên đầu như 'how much'.", en: "Do not move the question phrase to the front like 'how much'." },
    canada_practical: true,
    review_links: ["pa_a1_owner_acceptance_prices_001", "pa_a1_validation_prices_001"],
  },
  {
    id: "pa_a1_ci_readiness_food_001",
    domain: "food",
    style: "pre_integration",
    prompt_vi: "Đóng băng câu nhu cầu đồ ăn/uống cơ bản.",
    prompt_en: "Freeze the basic food or drink need line.",
    cue_pa: "ਮੈਨੂੰ ਚਾਹ ਚਾਹੀਦੀ ਹੈ।",
    romanization: "mainu cha chahidi hai",
    meaning_vi: "Tôi cần trà.",
    meaning_en: "I need tea.",
    expected_pa: "ਮੈਨੂੰ ਚਾਹ ਚਾਹੀਦੀ ਹੈ।",
    ci_readiness_check_vi: "Mẫu nhu cầu phải rõ chủ thể và vật cần.",
    ci_readiness_check_en: "The need frame must clearly show who needs what.",
    readiness_vi: "Sẵn sàng đóng băng nếu giữ ਮੈਨੂੰ ... ਚਾਹੀਦੀ ਹੈ.",
    readiness_en: "Ready to freeze if ਮੈਨੂੰ ... ਚਾਹੀਦੀ ਹੈ is kept.",
    trap: { audience: "vi", vi: "Đừng bỏ ਮੈਨੂੰ vì tiếng Việt có thể lược chủ ngữ.", en: "Do not drop ਮੈਨੂੰ because Vietnamese can omit subjects." },
    canada_practical: true,
    review_links: ["pa_a1_owner_acceptance_food_001", "pa_a1_validation_food_001"],
  },
  {
    id: "pa_a1_ci_readiness_directions_001",
    domain: "directions",
    style: "mr_readiness",
    prompt_vi: "Đóng băng câu hỏi đường đến trạm xe buýt.",
    prompt_en: "Freeze the question for a bus stop direction.",
    cue_pa: "ਬੱਸ ਸਟਾਪ ਕਿੱਥੇ ਹੈ?",
    romanization: "bas stap kithe hai?",
    meaning_vi: "Trạm xe buýt ở đâu?",
    meaning_en: "Where is the bus stop?",
    expected_pa: "ਬੱਸ ਸਟਾਪ ਕਿੱਥੇ ਹੈ?",
    ci_readiness_check_vi: "Câu hỏi vị trí phải giữ ਕਿੱਥੇ ਹੈ ở cuối.",
    ci_readiness_check_en: "The location question must keep ਕਿੱਥੇ ਹੈ at the end.",
    readiness_vi: "Sẵn sàng đóng băng nếu dùng được trong đi lại ở Canada.",
    readiness_en: "Ready to freeze if usable for getting around in Canada.",
    trap: { audience: "en", vi: "Đừng đặt 'where' ở đầu câu theo tiếng Anh.", en: "Do not place 'where' at the start in English order." },
    canada_practical: true,
    review_links: ["pa_a1_owner_acceptance_directions_001", "pa_a1_validation_directions_001"],
  },
  {
    id: "pa_a1_ci_readiness_help_001",
    domain: "help",
    style: "ci_readiness",
    prompt_vi: "Đóng băng câu xin giúp khi bị kẹt.",
    prompt_en: "Freeze the help request for getting stuck.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    romanization: "kirpa karke madad karo",
    meaning_vi: "Làm ơn giúp tôi.",
    meaning_en: "Please help me.",
    expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    ci_readiness_check_vi: "Đây là câu cứu nguy A1 và phải luôn có trong bản đóng băng cuối.",
    ci_readiness_check_en: "This is the A1 rescue line and must remain in the final freeze.",
    readiness_vi: "Sẵn sàng đóng băng nếu người học dùng thay vì chuyển sang tiếng Anh.",
    readiness_en: "Ready to freeze if the learner uses it instead of switching to English.",
    trap: { audience: "both", vi: "Đừng thay câu Punjabi bằng ghi chú tiếng Anh.", en: "Do not replace the Punjabi line with an English note." },
    canada_practical: true,
    review_links: ["pa_a1_owner_acceptance_help_001", "pa_a1_validation_help_001"],
  },
  {
    id: "pa_a1_ci_readiness_repetition_001",
    domain: "repetition",
    style: "mr_readiness",
    prompt_vi: "Đóng băng câu xin nhắc lại lịch sự.",
    prompt_en: "Freeze the polite request to repeat.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    romanization: "kirpa karke dubara kaho",
    meaning_vi: "Làm ơn nói lại.",
    meaning_en: "Please say that again.",
    expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    ci_readiness_check_vi: "Câu này phải hỗ trợ khi nghe thiếu số, giá hoặc hướng dẫn.",
    ci_readiness_check_en: "This must support missed numbers, prices, or directions.",
    readiness_vi: "Sẵn sàng đóng băng nếu dùng được trước khi bỏ cuộc.",
    readiness_en: "Ready to freeze if usable before giving up.",
    trap: { audience: "vi", vi: "Đừng im lặng khi không nghe rõ.", en: "Do not stay silent when you miss something." },
    canada_practical: true,
    review_links: ["pa_a1_owner_acceptance_repetition_001", "pa_a1_validation_repetition_001"],
  },
  {
    id: "pa_a1_ci_readiness_politeness_001",
    domain: "politeness",
    style: "readiness_check",
    prompt_vi: "Đóng băng lượt lịch sự cuối cùng.",
    prompt_en: "Freeze the final polite turn.",
    cue_pa: "ਧੰਨਵਾਦ ਜੀ।",
    romanization: "dhanvad ji",
    meaning_vi: "Cảm ơn ạ.",
    meaning_en: "Thank you politely.",
    expected_pa: "ਧੰਨਵਾਦ ਜੀ।",
    ci_readiness_check_vi: "Lịch sự phải còn trong luồng dịch vụ ngắn.",
    ci_readiness_check_en: "Politeness must remain in the short service flow.",
    readiness_vi: "Sẵn sàng đóng băng nếu người học biết đóng lượt bằng cảm ơn.",
    readiness_en: "Ready to freeze if the learner can close the turn with thanks.",
    trap: { audience: "both", vi: "Đừng bỏ ਜੀ khi muốn lịch sự hơn.", en: "Do not drop ਜੀ when a more polite tone is intended." },
    canada_practical: true,
    review_links: ["pa_a1_owner_acceptance_politeness_001", "pa_a1_validation_politeness_001"],
  },
  {
    id: "pa_a1_ci_readiness_gurmukhi_001",
    domain: "gurmukhi_recognition",
    style: "qa",
    prompt_vi: "Đóng băng nhận diện cụm chữ Gurmukhi cơ bản.",
    prompt_en: "Freeze recognition of a basic Gurmukhi word set.",
    cue_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ, ਪਛਾਣ",
    romanization: "pani, madad, bas, form, pachhan",
    meaning_vi: "nước, giúp đỡ, xe buýt, mẫu đơn, giấy tờ tùy thân",
    meaning_en: "water, help, bus, form, ID",
    expected_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ, ਪਛਾਣ",
    ci_readiness_check_vi: "Nhóm chữ phải kiểm tra Gurmukhi trước romanization.",
    ci_readiness_check_en: "The word set must check Gurmukhi before romanization.",
    readiness_vi: "Sẵn sàng đóng băng nếu romanization chỉ là cầu nối.",
    readiness_en: "Ready to freeze if romanization is only a bridge.",
    trap: { audience: "both", vi: "Romanization không thay thế chữ Gurmukhi.", en: "Romanization does not replace Gurmukhi." },
    canada_practical: true,
    review_links: ["pa_a1_owner_acceptance_gurmukhi_001", "pa_a1_validation_gurmukhi_001"],
  },
  {
    id: "pa_a1_ci_readiness_romanization_001",
    domain: "romanization_bridge",
    style: "pre_integration",
    prompt_vi: "Đóng băng cầu nối romanization quay lại Gurmukhi.",
    prompt_en: "Freeze the romanization bridge back to Gurmukhi.",
    cue_pa: "ਦੁਬਾਰਾ",
    romanization: "dubara",
    meaning_vi: "lại, một lần nữa",
    meaning_en: "again",
    expected_pa: "ਦੁਬਾਰਾ",
    ci_readiness_check_vi: "Romanization hỗ trợ đọc âm, nhưng đáp án đóng băng là Gurmukhi.",
    ci_readiness_check_en: "Romanization supports sound, but the frozen answer is Gurmukhi.",
    readiness_vi: "Sẵn sàng đóng băng nếu không biến Latin thành mục tiêu.",
    readiness_en: "Ready to freeze if Latin text does not become the target.",
    trap: { audience: "both", vi: "Đừng học dubara mà không nhận ra ਦੁਬਾਰਾ.", en: "Do not learn dubara without recognizing ਦੁਬਾਰਾ." },
    review_links: ["pa_a1_owner_acceptance_romanization_001", "pa_a1_validation_romanization_001"],
  },
  {
    id: "pa_a1_ci_readiness_canada_counter_001",
    domain: "canada_service_counter",
    style: "ci_readiness",
    prompt_vi: "Đóng băng câu quầy dịch vụ Canada với giấy tờ và mẫu đơn.",
    prompt_en: "Freeze a Canada service-counter line with ID and a form.",
    cue_pa: "ਮੇਰੇ ਕੋਲ ਪਛਾਣ ਹੈ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mere kol pachhan hai. mainu form chahida hai.",
    meaning_vi: "Tôi có giấy tờ tùy thân. Tôi cần mẫu đơn.",
    meaning_en: "I have ID. I need a form.",
    expected_pa: "ਮੇਰੇ ਕੋਲ ਪਛਾਣ ਹੈ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    ci_readiness_check_vi: "Câu này phải giữ mức A1, không biến thành bài giấy tờ nâng cao.",
    ci_readiness_check_en: "This must stay A1 and not become an advanced document lesson.",
    readiness_vi: "Sẵn sàng đóng băng nếu dùng được ở quầy dịch vụ cơ bản tại Canada.",
    readiness_en: "Ready to freeze if usable at a basic service counter in Canada.",
    trap: { audience: "both", vi: "Đừng thêm thuật ngữ hành chính ngoài A1.", en: "Do not add administrative terms beyond A1." },
    canada_practical: true,
    review_links: ["pa_a1_owner_acceptance_canada_counter_001", "pa_a1_validation_canada_service_001"],
  },
];

export default punjabiA1CiReadinessSamples;
