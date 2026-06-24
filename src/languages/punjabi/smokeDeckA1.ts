// Punjabi A1 smoke deck for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization is practical learner support. Native review is deferred.

export type PunjabiSmokeDeckDomain =
  | "greeting"
  | "identity"
  | "family"
  | "numbers"
  | "food"
  | "directions"
  | "help_request"
  | "polite_phrase"
  | "gurmukhi_recognition"
  | "canada_service";

export type PunjabiSmokeDeckTaskType =
  | "smoke_check"
  | "final_qa"
  | "recognition"
  | "integration_readiness";

export type PunjabiSmokeDeckItemA1 = {
  id: string;
  domain: PunjabiSmokeDeckDomain;
  task_type: PunjabiSmokeDeckTaskType;
  prompt_vi: string;
  prompt_en: string;
  expected_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  explanation_vi: string;
  explanation_en: string;
  pass_signal_vi: string;
  pass_signal_en: string;
  review_if_missed: string[];
  learner_trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: boolean;
};

export const smokeDeckScriptAwareness =
  "Gurmukhi is primary for this Punjabi A1 smoke deck. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1SmokeDeck: PunjabiSmokeDeckItemA1[] = [
  {
    id: "pa_a1_smoke_greeting_001",
    domain: "greeting",
    task_type: "smoke_check",
    prompt_vi: "Chọn hoặc nói lời chào lịch sự.",
    prompt_en: "Choose or say a polite greeting.",
    expected_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    romanization: "sat sri akal",
    meaning_vi: "Xin chào.",
    meaning_en: "Hello.",
    explanation_vi: "Đây là lời chào đại diện cho A1.",
    explanation_en: "This is the representative A1 greeting.",
    pass_signal_vi: "Nhận ra cụm này là chào hỏi.",
    pass_signal_en: "Recognizes this as a greeting.",
    review_if_missed: ["pa_a1_golden_greetings_001", "pa_a1_recognition_polite_001"],
    learner_trap: { audience: "vi", vi: "Không thêm nguyên âm sau âm cuối của ਸਤ.", en: "Do not add a vowel after final ਤ." },
    canada_practical: true,
  },
  {
    id: "pa_a1_smoke_identity_001",
    domain: "identity",
    task_type: "final_qa",
    prompt_vi: "Nói 'Tên tôi là Lan.'",
    prompt_en: "Say 'My name is Lan.'",
    expected_pa: "ਮੇਰਾ ਨਾਮ ਲਾਨ ਹੈ।",
    romanization: "mera nam Lan hai",
    meaning_vi: "Tên tôi là Lan.",
    meaning_en: "My name is Lan.",
    explanation_vi: "ਮੇਰਾ ਨਾਮ ... ਹੈ là mẫu giới thiệu tên.",
    explanation_en: "ਮੇਰਾ ਨਾਮ ... ਹੈ is the name-introduction frame.",
    pass_signal_vi: "Giữ ਹੈ ở cuối câu.",
    pass_signal_en: "Keeps ਹੈ at the end.",
    review_if_missed: ["pa_a1_golden_identity_001", "pa_a1_journey_identity_001"],
    learner_trap: { audience: "vi", vi: "Tiếng Việt có thể bỏ 'là', nhưng Punjabi cần ਹੈ.", en: "Vietnamese may omit 'be', but Punjabi needs ਹੈ here." },
  },
  {
    id: "pa_a1_smoke_family_001",
    domain: "family",
    task_type: "smoke_check",
    prompt_vi: "Nói 'Đây là mẹ tôi.'",
    prompt_en: "Say 'This is my mother.'",
    expected_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ।",
    romanization: "ih meri man hai",
    meaning_vi: "Đây là mẹ tôi.",
    meaning_en: "This is my mother.",
    explanation_vi: "ਮੇਰੀ đi với ਮਾਂ trong mẫu này.",
    explanation_en: "ਮੇਰੀ pairs with ਮਾਂ in this pattern.",
    pass_signal_vi: "Phân biệt ਮੇਰੀ với ਮੇਰਾ.",
    pass_signal_en: "Distinguishes ਮੇਰੀ from ਮੇਰਾ.",
    review_if_missed: ["pa_a1_golden_family_001", "pa_a1_final_family_001"],
    learner_trap: { audience: "en", vi: "Tiếng Anh có một 'my'; Punjabi đổi theo danh từ.", en: "English has one 'my'; Punjabi changes by noun." },
  },
  {
    id: "pa_a1_smoke_numbers_001",
    domain: "numbers",
    task_type: "recognition",
    prompt_vi: "Nhận ra cụm 'hai vé'.",
    prompt_en: "Recognize 'two tickets'.",
    expected_pa: "ਦੋ ਟਿਕਟਾਂ",
    romanization: "do tiktan",
    meaning_vi: "hai vé",
    meaning_en: "two tickets",
    explanation_vi: "ਦੋ là hai; ਟਿਕਟਾਂ là vé.",
    explanation_en: "ਦੋ means two; ਟਿਕਟਾਂ means tickets.",
    pass_signal_vi: "Không nhầm với giá.",
    pass_signal_en: "Does not confuse this with a price.",
    review_if_missed: ["pa_a1_golden_numbers_001", "pa_a1_recognition_numbers_002"],
    canada_practical: true,
  },
  {
    id: "pa_a1_smoke_food_001",
    domain: "food",
    task_type: "final_qa",
    prompt_vi: "Nói 'Tôi cần nước.'",
    prompt_en: "Say 'I need water.'",
    expected_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mainu pani chahida hai",
    meaning_vi: "Tôi cần nước.",
    meaning_en: "I need water.",
    explanation_vi: "ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ là khung nhu cầu.",
    explanation_en: "ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ is the need frame.",
    pass_signal_vi: "Dùng ਮੈਨੂੰ và ਚਾਹੀਦਾ ਹੈ.",
    pass_signal_en: "Uses ਮੈਨੂੰ and ਚਾਹੀਦਾ ਹੈ.",
    review_if_missed: ["pa_a1_golden_food_001", "pa_a1_cando_needs_001"],
    learner_trap: { audience: "vi", vi: "Đừng bỏ ਮੈਨੂੰ khi nói nhu cầu.", en: "Do not drop ਮੈਨੂੰ when stating a need." },
  },
  {
    id: "pa_a1_smoke_directions_001",
    domain: "directions",
    task_type: "smoke_check",
    prompt_vi: "Hỏi bến xe buýt ở đâu.",
    prompt_en: "Ask where the bus stop is.",
    expected_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    romanization: "bas adda kithe hai?",
    meaning_vi: "Bến xe buýt ở đâu?",
    meaning_en: "Where is the bus stop?",
    explanation_vi: "ਕਿੱਥੇ ਹੈ là khung hỏi địa điểm.",
    explanation_en: "ਕਿੱਥੇ ਹੈ is the location-question frame.",
    pass_signal_vi: "Đặt ਕਿੱਥੇ trước ਹੈ.",
    pass_signal_en: "Places ਕਿੱਥੇ before ਹੈ.",
    review_if_missed: ["pa_a1_golden_directions_001", "pa_a1_counter_location_001"],
    learner_trap: { audience: "en", vi: "Không đảo như 'where is' tiếng Anh.", en: "Do not invert like English 'where is'." },
    canada_practical: true,
  },
  {
    id: "pa_a1_smoke_help_001",
    domain: "help_request",
    task_type: "final_qa",
    prompt_vi: "Xin giúp đỡ lịch sự.",
    prompt_en: "Ask for help politely.",
    expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    romanization: "kirpa karke madad karo",
    meaning_vi: "Làm ơn giúp tôi.",
    meaning_en: "Please help.",
    explanation_vi: "ਕਿਰਪਾ ਕਰਕੇ làm câu lịch sự.",
    explanation_en: "ਕਿਰਪਾ ਕਰਕੇ makes the request polite.",
    pass_signal_vi: "Nhận ra ਮਦਦ trong câu giúp đỡ.",
    pass_signal_en: "Recognizes ਮਦਦ in a help request.",
    review_if_missed: ["pa_a1_golden_help_001", "pa_a1_counter_help_001"],
    learner_trap: { audience: "both", vi: "Đừng dùng giọng mệnh lệnh khi nhờ người lạ.", en: "Avoid a command-like tone with strangers." },
    canada_practical: true,
  },
  {
    id: "pa_a1_smoke_polite_001",
    domain: "polite_phrase",
    task_type: "recognition",
    prompt_vi: "Nhận ra cụm 'xin lỗi/cho tôi hỏi'.",
    prompt_en: "Recognize 'excuse me'.",
    expected_pa: "ਮਾਫ਼ ਕਰਨਾ।",
    romanization: "maf karna",
    meaning_vi: "Xin lỗi/cho tôi hỏi.",
    meaning_en: "Excuse me.",
    explanation_vi: "Dùng để mở lời trước khi hỏi.",
    explanation_en: "Use this to open before asking.",
    pass_signal_vi: "Phân biệt với ਧੰਨਵਾਦ.",
    pass_signal_en: "Distinguishes it from ਧੰਨਵਾਦ.",
    review_if_missed: ["pa_a1_golden_canada_002", "pa_a1_journey_polite_001"],
    canada_practical: true,
  },
  {
    id: "pa_a1_smoke_gurmukhi_001",
    domain: "gurmukhi_recognition",
    task_type: "recognition",
    prompt_vi: "Nhận ra ba từ Gurmukhi cơ bản.",
    prompt_en: "Recognize three basic Gurmukhi words.",
    expected_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ",
    romanization: "pani, madad, bas",
    meaning_vi: "nước, giúp đỡ, xe buýt",
    meaning_en: "water, help, bus",
    explanation_vi: "Smoke check cần nhìn Gurmukhi trước romanization.",
    explanation_en: "The smoke check should read Gurmukhi before romanization.",
    pass_signal_vi: "Nối từng từ với nghĩa.",
    pass_signal_en: "Maps each word to meaning.",
    review_if_missed: ["pa_a1_golden_gurmukhi_001", "pa_a1_recognition_gurmukhi_001"],
    learner_trap: { audience: "both", vi: "Không tự kiểm tra chỉ bằng chữ Latin.", en: "Do not self-check only with Latin letters." },
    canada_practical: true,
  },
  {
    id: "pa_a1_smoke_service_001",
    domain: "canada_service",
    task_type: "integration_readiness",
    prompt_vi: "Ở văn phòng trường, nói bạn cần mẫu đơn.",
    prompt_en: "At a school office, say you need a form.",
    expected_pa: "ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mainu form chahida hai",
    meaning_vi: "Tôi cần mẫu đơn.",
    meaning_en: "I need a form.",
    explanation_vi: "ਫਾਰਮ dùng trong bối cảnh dịch vụ Canada.",
    explanation_en: "ਫਾਰਮ is useful in Canada service contexts.",
    pass_signal_vi: "Dùng đúng khung nhu cầu với ਫਾਰਮ.",
    pass_signal_en: "Uses the need frame with ਫਾਰਮ.",
    review_if_missed: ["pa_a1_golden_service_001", "pa_a1_counter_school_001"],
    canada_practical: true,
  },
  {
    id: "pa_a1_smoke_service_002",
    domain: "canada_service",
    task_type: "integration_readiness",
    prompt_vi: "Nhận ra câu hỏi về giấy tờ tùy thân.",
    prompt_en: "Recognize the identification question.",
    expected_pa: "ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਪਛਾਣ ਹੈ?",
    romanization: "ki tuhade kol pachhan hai?",
    meaning_vi: "Bạn có giấy tờ tùy thân không?",
    meaning_en: "Do you have ID?",
    explanation_vi: "ਪਛਾਣ nghĩa là giấy tờ tùy thân/ID.",
    explanation_en: "ਪਛਾਣ means identification/ID.",
    pass_signal_vi: "Phân biệt ID với giá và chào hỏi.",
    pass_signal_en: "Distinguishes ID from price and greeting.",
    review_if_missed: ["pa_a1_golden_canada_001", "pa_a1_recognition_service_003"],
    learner_trap: { audience: "en", vi: "Punjabi dùng ਕੋਲ cho 'have' trong mẫu này.", en: "Punjabi uses ਕੋਲ for 'have' in this pattern." },
    canada_practical: true,
  },
  {
    id: "pa_a1_smoke_service_003",
    domain: "canada_service",
    task_type: "smoke_check",
    prompt_vi: "Yêu cầu nhân viên nói lại.",
    prompt_en: "Ask a staff member to repeat.",
    expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    romanization: "kirpa karke dubara kaho",
    meaning_vi: "Làm ơn nói lại.",
    meaning_en: "Please say that again.",
    explanation_vi: "ਦੁਬਾਰਾ ਕਹੋ giúp sửa tình huống nghe không kịp.",
    explanation_en: "ਦੁਬਾਰਾ ਕਹੋ repairs a missed utterance.",
    pass_signal_vi: "Dùng câu này thay vì im lặng.",
    pass_signal_en: "Uses this phrase instead of staying silent.",
    review_if_missed: ["pa_a1_golden_canada_002", "pa_a1_recognition_service_005"],
    learner_trap: { audience: "vi", vi: "Đừng im lặng khi không nghe kịp.", en: "Do not stay silent when you miss something." },
    canada_practical: true,
  },
];

export default punjabiA1SmokeDeck;
