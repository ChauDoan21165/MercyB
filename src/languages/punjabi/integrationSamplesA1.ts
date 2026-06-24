// Punjabi A1 integration samples for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization is practical learner support. Native review is deferred.

export type PunjabiIntegrationSampleDomain =
  | "greetings"
  | "identity"
  | "family"
  | "numbers"
  | "food"
  | "directions"
  | "help_request"
  | "polite_service_counter"
  | "gurmukhi_recognition"
  | "canada_survival";

export type PunjabiIntegrationSampleKind =
  | "integration_sample"
  | "final_evidence"
  | "final_qa";

export type PunjabiIntegrationSampleA1 = {
  id: string;
  domain: PunjabiIntegrationSampleDomain;
  kind: PunjabiIntegrationSampleKind;
  integration_slot: string;
  prompt_vi: string;
  prompt_en: string;
  sample_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  explanation_vi: string;
  explanation_en: string;
  evidence_vi: string;
  evidence_en: string;
  suggested_sources: string[];
  learner_trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: boolean;
};

export const integrationSamplesScriptAwareness =
  "Gurmukhi is primary for these Punjabi A1 integration samples. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1IntegrationSamples: PunjabiIntegrationSampleA1[] = [
  {
    id: "pa_a1_integration_greetings_001",
    domain: "greetings",
    kind: "integration_sample",
    integration_slot: "a1_opening_greeting",
    prompt_vi: "Mẫu mở đầu cho hội thoại A1.",
    prompt_en: "Opening sample for an A1 conversation.",
    sample_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?",
    romanization: "sat sri akal. tusin kiven ho?",
    meaning_vi: "Xin chào. Bạn khỏe không?",
    meaning_en: "Hello. How are you?",
    explanation_vi: "Ghép lời chào với câu hỏi thăm ngắn.",
    explanation_en: "Combines a greeting with a short check-in.",
    evidence_vi: "Đại diện cho chào hỏi và câu hỏi thăm A1.",
    evidence_en: "Represents A1 greeting and check-in.",
    suggested_sources: ["pa_a1_smoke_greeting_001", "pa_a1_golden_greetings_002"],
    learner_trap: { audience: "vi", vi: "Không thêm nguyên âm sau âm cuối của ਸਤ.", en: "Do not add a vowel after final ਤ." },
    canada_practical: true,
  },
  {
    id: "pa_a1_integration_identity_001",
    domain: "identity",
    kind: "final_qa",
    integration_slot: "a1_identity_exchange",
    prompt_vi: "Mẫu giới thiệu và hỏi tên.",
    prompt_en: "Sample for introducing and asking a name.",
    sample_pa: "ਮੇਰਾ ਨਾਮ ਲਾਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    romanization: "mera nam Lan hai. tuhada nam ki hai?",
    meaning_vi: "Tên tôi là Lan. Tên bạn là gì?",
    meaning_en: "My name is Lan. What is your name?",
    explanation_vi: "Hai câu này kiểm tra cả giới thiệu tên và hỏi tên.",
    explanation_en: "These two lines check both name introduction and name question.",
    evidence_vi: "Giữ ਹੈ và đặt ਕੀ đúng vị trí.",
    evidence_en: "Keeps ਹੈ and places ਕੀ correctly.",
    suggested_sources: ["pa_a1_smoke_identity_001", "pa_a1_golden_identity_002"],
    learner_trap: { audience: "both", vi: "Không đặt ਕੀ ở cuối câu hỏi tên.", en: "Do not place ਕੀ at the end of the name question." },
  },
  {
    id: "pa_a1_integration_family_001",
    domain: "family",
    kind: "integration_sample",
    integration_slot: "a1_family_intro",
    prompt_vi: "Mẫu nói về gia đình gần.",
    prompt_en: "Sample for close-family talk.",
    sample_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭੈਣ ਹੈ।",
    romanization: "ih meri man hai. mere kol ikk bhain hai.",
    meaning_vi: "Đây là mẹ tôi. Tôi có một chị/em gái.",
    meaning_en: "This is my mother. I have one sister.",
    explanation_vi: "Mẫu này tích hợp ਮੇਰੀ và ਮੇਰੇ ਕੋਲ.",
    explanation_en: "This sample integrates ਮੇਰੀ and ਮੇਰੇ ਕੋਲ.",
    evidence_vi: "Phân biệt sở hữu tính từ với mẫu 'có'.",
    evidence_en: "Distinguishes possessive adjective from the 'have' frame.",
    suggested_sources: ["pa_a1_smoke_family_001", "pa_a1_golden_family_002"],
    learner_trap: { audience: "en", vi: "Tiếng Anh có một 'my'; Punjabi đổi ਮੇਰਾ/ਮੇਰੀ.", en: "English has one 'my'; Punjabi changes ਮੇਰਾ/ਮੇਰੀ." },
  },
  {
    id: "pa_a1_integration_numbers_001",
    domain: "numbers",
    kind: "final_evidence",
    integration_slot: "a1_numbers_prices",
    prompt_vi: "Mẫu kiểm tra số trong vé và giá.",
    prompt_en: "Sample checking numbers in tickets and prices.",
    sample_pa: "ਦੋ ਟਿਕਟਾਂ। ਪੰਜ ਡਾਲਰ।",
    romanization: "do tiktan. panj dollar.",
    meaning_vi: "Hai vé. Năm đô la.",
    meaning_en: "Two tickets. Five dollars.",
    explanation_vi: "Số nhỏ xuất hiện trong tình huống mua vé và trả tiền.",
    explanation_en: "Small numbers appear in ticket and payment situations.",
    evidence_vi: "Nhận ra ਦੋ và ਪੰਜ bằng Gurmukhi.",
    evidence_en: "Recognizes ਦੋ and ਪੰਜ in Gurmukhi.",
    suggested_sources: ["pa_a1_smoke_numbers_001", "pa_a1_recognition_numbers_001"],
    learner_trap: { audience: "both", vi: "Đừng học số chỉ bằng chữ Latin.", en: "Do not learn numbers only through Latin letters." },
    canada_practical: true,
  },
  {
    id: "pa_a1_integration_food_001",
    domain: "food",
    kind: "integration_sample",
    integration_slot: "a1_food_need_question",
    prompt_vi: "Mẫu nhu cầu và câu hỏi đồ ăn.",
    prompt_en: "Sample for need and food question.",
    sample_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ। ਕੀ ਇਹ ਸ਼ਾਕਾਹਾਰੀ ਹੈ?",
    romanization: "mainu pani chahida hai. ki ih shakahari hai?",
    meaning_vi: "Tôi cần nước. Món này có phải chay không?",
    meaning_en: "I need water. Is this vegetarian?",
    explanation_vi: "Kết hợp khung nhu cầu với câu hỏi yes/no bằng ਕੀ.",
    explanation_en: "Combines the need frame with a yes/no question using ਕੀ.",
    evidence_vi: "Dùng ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ và nhận ra ਕੀ.",
    evidence_en: "Uses ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ and recognizes ਕੀ.",
    suggested_sources: ["pa_a1_smoke_food_001", "pa_a1_golden_food_002"],
    learner_trap: { audience: "vi", vi: "Giữ ਮੈਨੂੰ khi nói nhu cầu.", en: "Keep ਮੈਨੂੰ when stating a need." },
    canada_practical: true,
  },
  {
    id: "pa_a1_integration_directions_001",
    domain: "directions",
    kind: "final_qa",
    integration_slot: "a1_transit_direction",
    prompt_vi: "Mẫu hỏi đường và nhận chỉ dẫn.",
    prompt_en: "Sample for asking and receiving directions.",
    sample_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ? ਸੱਜੇ ਜਾਓ।",
    romanization: "bas adda kithe hai? sajje jao.",
    meaning_vi: "Bến xe buýt ở đâu? Đi bên phải.",
    meaning_en: "Where is the bus stop? Go right.",
    explanation_vi: "Mẫu này kiểm tra câu hỏi địa điểm và chỉ dẫn ngắn.",
    explanation_en: "This sample checks a location question and short direction.",
    evidence_vi: "Đặt ਕਿੱਥੇ trước ਹੈ và phân biệt ਸੱਜੇ.",
    evidence_en: "Places ਕਿੱਥੇ before ਹੈ and identifies ਸੱਜੇ.",
    suggested_sources: ["pa_a1_smoke_directions_001", "pa_a1_golden_directions_002"],
    learner_trap: { audience: "en", vi: "Không đảo như 'where is' tiếng Anh.", en: "Do not invert like English 'where is'." },
    canada_practical: true,
  },
  {
    id: "pa_a1_integration_help_001",
    domain: "help_request",
    kind: "final_evidence",
    integration_slot: "a1_help_repair",
    prompt_vi: "Mẫu xin giúp và báo không hiểu.",
    prompt_en: "Sample for asking help and saying you do not understand.",
    sample_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ। ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਉਂਦੀ।",
    romanization: "kirpa karke madad karo. mainu samajh nahin aundi.",
    meaning_vi: "Làm ơn giúp tôi. Tôi không hiểu.",
    meaning_en: "Please help. I do not understand.",
    explanation_vi: "Kết hợp lịch sự với câu sửa lỗi giao tiếp.",
    explanation_en: "Combines politeness with a communication repair phrase.",
    evidence_vi: "Nhận ra ਮਦਦ và không bỏ nghĩa phủ định ਨਹੀਂ.",
    evidence_en: "Recognizes ਮਦਦ and does not miss negative ਨਹੀਂ.",
    suggested_sources: ["pa_a1_smoke_help_001", "pa_a1_golden_help_002"],
    learner_trap: { audience: "vi", vi: "Đừng bỏ ਨਹੀਂ khi dịch 'không'.", en: "Do not omit ਨਹੀਂ when translating 'not'." },
    canada_practical: true,
  },
  {
    id: "pa_a1_integration_polite_counter_001",
    domain: "polite_service_counter",
    kind: "integration_sample",
    integration_slot: "a1_counter_repetition",
    prompt_vi: "Mẫu lịch sự ở quầy khi nghe không kịp.",
    prompt_en: "Polite counter sample when you miss what was said.",
    sample_pa: "ਮਾਫ਼ ਕਰਨਾ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    romanization: "maf karna. kirpa karke dubara kaho.",
    meaning_vi: "Xin lỗi/cho tôi hỏi. Làm ơn nói lại.",
    meaning_en: "Excuse me. Please say that again.",
    explanation_vi: "Dùng để mở lời và yêu cầu lặp lại lịch sự.",
    explanation_en: "Use this to open politely and ask for repetition.",
    evidence_vi: "Nhận ra ਮਾਫ਼ ਕਰਨਾ và ਦੁਬਾਰਾ ਕਹੋ.",
    evidence_en: "Recognizes ਮਾਫ਼ ਕਰਨਾ and ਦੁਬਾਰਾ ਕਹੋ.",
    suggested_sources: ["pa_a1_smoke_polite_001", "pa_a1_smoke_service_003"],
    learner_trap: { audience: "both", vi: "Đừng im lặng khi không nghe kịp.", en: "Do not stay silent when you miss something." },
    canada_practical: true,
  },
  {
    id: "pa_a1_integration_gurmukhi_001",
    domain: "gurmukhi_recognition",
    kind: "final_evidence",
    integration_slot: "a1_script_survival_words",
    prompt_vi: "Mẫu nhận diện chữ Gurmukhi cơ bản.",
    prompt_en: "Sample for recognizing basic Gurmukhi words.",
    sample_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    romanization: "pani, madad, bas, form",
    meaning_vi: "nước, giúp đỡ, xe buýt, mẫu đơn",
    meaning_en: "water, help, bus, form",
    explanation_vi: "Các từ này nối script với nhu cầu sinh tồn và dịch vụ.",
    explanation_en: "These words connect script to survival and service needs.",
    evidence_vi: "Đọc Gurmukhi trước khi nhìn romanization.",
    evidence_en: "Reads Gurmukhi before looking at romanization.",
    suggested_sources: ["pa_a1_smoke_gurmukhi_001", "pa_a1_recognition_gurmukhi_002"],
    learner_trap: { audience: "both", vi: "Không tự kiểm tra chỉ bằng chữ Latin.", en: "Do not self-check only with Latin letters." },
    canada_practical: true,
  },
  {
    id: "pa_a1_integration_canada_001",
    domain: "canada_survival",
    kind: "integration_sample",
    integration_slot: "a1_school_office",
    prompt_vi: "Mẫu dùng ở văn phòng trường tại Canada.",
    prompt_en: "Sample for a school office in Canada.",
    sample_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "sat sri akal. mainu form chahida hai.",
    meaning_vi: "Xin chào. Tôi cần mẫu đơn.",
    meaning_en: "Hello. I need a form.",
    explanation_vi: "Ghép chào hỏi với nhu cầu dịch vụ đơn giản.",
    explanation_en: "Combines greeting with a simple service need.",
    evidence_vi: "Dùng được ở quầy trường hoặc dịch vụ cộng đồng.",
    evidence_en: "Usable at a school or community service counter.",
    suggested_sources: ["pa_a1_smoke_service_001", "pa_a1_counter_school_001"],
    canada_practical: true,
  },
  {
    id: "pa_a1_integration_canada_002",
    domain: "canada_survival",
    kind: "final_qa",
    integration_slot: "a1_clinic_id",
    prompt_vi: "Mẫu phòng khám/giấy tờ tùy thân.",
    prompt_en: "Clinic/identification sample.",
    sample_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਦੋਂ ਹੈ? ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਪਛਾਣ ਹੈ?",
    romanization: "meri appointment kadon hai? ki tuhade kol pachhan hai?",
    meaning_vi: "Lịch hẹn của tôi là khi nào? Bạn có giấy tờ tùy thân không?",
    meaning_en: "When is my appointment? Do you have ID?",
    explanation_vi: "Tích hợp lịch hẹn, khi nào, và giấy tờ tùy thân.",
    explanation_en: "Integrates appointment, when, and identification.",
    evidence_vi: "Nhận ra ਅਪਾਇੰਟਮੈਂਟ, ਕਦੋਂ, ਪਛਾਣ và ਕੋਲ.",
    evidence_en: "Recognizes ਅਪਾਇੰਟਮੈਂਟ, ਕਦੋਂ, ਪਛਾਣ, and ਕੋਲ.",
    suggested_sources: ["pa_a1_golden_service_002", "pa_a1_smoke_service_002"],
    learner_trap: { audience: "en", vi: "Punjabi dùng ਕੋਲ cho 'have' trong mẫu này.", en: "Punjabi uses ਕੋਲ for 'have' in this pattern." },
    canada_practical: true,
  },
  {
    id: "pa_a1_integration_canada_003",
    domain: "canada_survival",
    kind: "final_evidence",
    integration_slot: "a1_store_counter",
    prompt_vi: "Mẫu nhanh ở cửa hàng.",
    prompt_en: "Quick store-counter sample.",
    sample_pa: "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ? ਮੈਨੂੰ ਇੱਕ ਬੈਗ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "ih kinne da hai? mainu ikk bag chahida hai.",
    meaning_vi: "Cái này bao nhiêu tiền? Tôi cần một túi.",
    meaning_en: "How much is this? I need one bag.",
    explanation_vi: "Ghép câu hỏi giá với nhu cầu có số lượng.",
    explanation_en: "Combines a price question with a quantified need.",
    evidence_vi: "Phân biệt ਕਿੰਨੇ ਦਾ, ਇੱਕ, ਅਤੇ ਚਾਹੀਦਾ ਹੈ.",
    evidence_en: "Distinguishes ਕਿੰਨੇ ਦਾ, ਇੱਕ, and ਚਾਹੀਦਾ ਹੈ.",
    suggested_sources: ["pa_a1_counter_price_001", "pa_a1_counter_store_001"],
    learner_trap: { audience: "both", vi: "Đừng bỏ số nếu số lượng quan trọng.", en: "Do not omit the number when quantity matters." },
    canada_practical: true,
  },
];

export default punjabiA1IntegrationSamples;
