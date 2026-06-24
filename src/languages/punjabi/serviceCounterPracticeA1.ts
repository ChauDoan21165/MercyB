// Punjabi A1 service-counter practice for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization is practical learner support. Native review is deferred.

export type PunjabiServiceCounterSetting =
  | "general_counter"
  | "store"
  | "transit"
  | "clinic"
  | "school"
  | "public_counter";

export type PunjabiServiceCounterSkill =
  | "greeting"
  | "price"
  | "location"
  | "help"
  | "repetition"
  | "need"
  | "appointment"
  | "identification";

export type PunjabiServiceCounterPracticeType =
  | "phrase_recall"
  | "choice"
  | "mini_roleplay"
  | "navigation"
  | "remediation"
  | "readiness_check";

export type PunjabiServiceCounterPracticeA1 = {
  id: string;
  setting: PunjabiServiceCounterSetting;
  skill: PunjabiServiceCounterSkill;
  practice_type: PunjabiServiceCounterPracticeType;
  scenario_vi: string;
  scenario_en: string;
  prompt_vi: string;
  prompt_en: string;
  cue_pa?: string;
  options_pa?: string[];
  answer_pa: string | string[];
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  explanation_vi: string;
  explanation_en: string;
  remediation_vi: string;
  remediation_en: string;
  readiness_signal_vi: string;
  readiness_signal_en: string;
  review_targets: string[];
  learner_trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: boolean;
};

export const serviceCounterScriptAwareness =
  "Gurmukhi is primary for this Punjabi A1 service-counter practice. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1ServiceCounterPractice: PunjabiServiceCounterPracticeA1[] = [
  {
    id: "pa_a1_counter_greeting_001",
    setting: "general_counter",
    skill: "greeting",
    practice_type: "phrase_recall",
    scenario_vi: "Bạn đến quầy dịch vụ và mở lời lịch sự.",
    scenario_en: "You arrive at a service counter and open politely.",
    prompt_vi: "Nhớ lại lời chào phù hợp.",
    prompt_en: "Recall an appropriate greeting.",
    answer_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    romanization: "sat sri akal",
    meaning_vi: "Xin chào.",
    meaning_en: "Hello.",
    explanation_vi: "Dùng lời chào trước khi hỏi giúp tương tác nhẹ nhàng hơn.",
    explanation_en: "Using a greeting before asking makes the interaction smoother.",
    remediation_vi: "Ôn lại thẻ chào hỏi nếu chỉ nhớ chữ Latin.",
    remediation_en: "Review greeting cards if you only remember Latin letters.",
    readiness_signal_vi: "Bạn nhìn Gurmukhi và nói được lời chào.",
    readiness_signal_en: "You see the Gurmukhi and can say the greeting.",
    review_targets: ["pa_a1_final_greetings_001", "pa_a1_recall_greetings_001"],
    learner_trap: { audience: "vi", vi: "Không thêm nguyên âm sau âm cuối của ਸਤ.", en: "Vietnamese speakers should avoid adding a vowel after final ਤ." },
    canada_practical: true,
  },
  {
    id: "pa_a1_counter_price_001",
    setting: "store",
    skill: "price",
    practice_type: "choice",
    scenario_vi: "Bạn muốn hỏi giá một món đồ ở cửa hàng.",
    scenario_en: "You want to ask the price of an item at a store.",
    prompt_vi: "Chọn câu 'Cái này bao nhiêu tiền?'",
    prompt_en: "Choose 'How much is this?'",
    options_pa: ["ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?", "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?", "ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਪਛਾਣ ਹੈ?"],
    answer_pa: "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?",
    romanization: "ih kinne da hai?",
    meaning_vi: "Cái này bao nhiêu tiền?",
    meaning_en: "How much is this?",
    explanation_vi: "ਕਿੰਨੇ ਦਾ là tín hiệu câu hỏi giá.",
    explanation_en: "ਕਿੰਨੇ ਦਾ signals a price question.",
    remediation_vi: "Ôn phân biệt giá với địa điểm và giấy tờ tùy thân.",
    remediation_en: "Review price versus location and ID questions.",
    readiness_signal_vi: "Bạn không nhầm ਕਿੰਨੇ ਦਾ với ਕਿੱਥੇ.",
    readiness_signal_en: "You do not confuse ਕਿੰਨੇ ਦਾ with ਕਿੱਥੇ.",
    review_targets: ["pa_a1_final_prices_001", "pa_a1_cando_prices_001"],
    learner_trap: { audience: "en", vi: "Không sao chép trật tự tiếng Anh từng chữ.", en: "Do not copy English word order word-for-word." },
    canada_practical: true,
  },
  {
    id: "pa_a1_counter_price_002",
    setting: "store",
    skill: "price",
    practice_type: "readiness_check",
    scenario_vi: "Nhân viên nói giá rất ngắn.",
    scenario_en: "The staff member says a very short price.",
    prompt_vi: "Nhận ra nghĩa của cụm giá.",
    prompt_en: "Recognize the meaning of the price phrase.",
    cue_pa: "ਪੰਜ ਡਾਲਰ।",
    answer_pa: "ਪੰਜ ਡਾਲਰ।",
    romanization: "panj dollar",
    meaning_vi: "Năm đô la.",
    meaning_en: "Five dollars.",
    explanation_vi: "Giá A1 thường ghép số nhỏ với ਡਾਲਰ.",
    explanation_en: "A1 prices often combine a small number with ਡਾਲਰ.",
    remediation_vi: "Quay lại số 1-5 nếu chưa nhận ra ਪੰਜ.",
    remediation_en: "Go back to numbers 1-5 if ਪੰਜ is not clear.",
    readiness_signal_vi: "Bạn hiểu được giá ngắn bằng Gurmukhi.",
    readiness_signal_en: "You understand a short Gurmukhi price.",
    review_targets: ["pa_a1_recall_numbers_002", "pa_a1_journey_numbers_001"],
    canada_practical: true,
  },
  {
    id: "pa_a1_counter_location_001",
    setting: "transit",
    skill: "location",
    practice_type: "navigation",
    scenario_vi: "Bạn ở khu trung chuyển và cần tìm bến xe buýt.",
    scenario_en: "You are near transit and need to find the bus stop.",
    prompt_vi: "Hỏi bến xe buýt ở đâu.",
    prompt_en: "Ask where the bus stop is.",
    answer_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    romanization: "bas adda kithe hai?",
    meaning_vi: "Bến xe buýt ở đâu?",
    meaning_en: "Where is the bus stop?",
    explanation_vi: "ਕਿੱਥੇ đứng trước ਹੈ trong câu hỏi địa điểm.",
    explanation_en: "ਕਿੱਥੇ comes before ਹੈ in a location question.",
    remediation_vi: "Ôn mẫu địa điểm và thay ਬੱਸ ਅੱਡਾ bằng ਕਲਿਨਿਕ.",
    remediation_en: "Review the location frame and replace ਬੱਸ ਅੱਡਾ with ਕਲਿਨਿਕ.",
    readiness_signal_vi: "Bạn đặt địa điểm trước ਕਿੱਥੇ ਹੈ.",
    readiness_signal_en: "You place the place before ਕਿੱਥੇ ਹੈ.",
    review_targets: ["pa_a1_final_directions_001", "pa_a1_recall_directions_001"],
    learner_trap: { audience: "en", vi: "Không đảo như 'where is' tiếng Anh.", en: "Do not invert like English 'where is'." },
    canada_practical: true,
  },
  {
    id: "pa_a1_counter_location_002",
    setting: "clinic",
    skill: "location",
    practice_type: "mini_roleplay",
    scenario_vi: "Trong tòa nhà y tế, bạn cần hỏi phòng khám ở đâu.",
    scenario_en: "Inside a medical building, you need to ask where the clinic is.",
    prompt_vi: "Hỏi phòng khám ở đâu.",
    prompt_en: "Ask where the clinic is.",
    answer_pa: "ਕਲਿਨਿਕ ਕਿੱਥੇ ਹੈ?",
    romanization: "clinic kithe hai?",
    meaning_vi: "Phòng khám ở đâu?",
    meaning_en: "Where is the clinic?",
    explanation_vi: "Thay địa điểm vào cùng khung ਕਿੱਥੇ ਹੈ.",
    explanation_en: "Substitute the place into the same ਕਿੱਥੇ ਹੈ frame.",
    remediation_vi: "Ôn từ ਕਲਿਨਿਕ và mẫu hỏi địa điểm.",
    remediation_en: "Review ਕਲਿਨਿਕ and the location question frame.",
    readiness_signal_vi: "Bạn có thể đổi địa điểm mà giữ đúng khung.",
    readiness_signal_en: "You can swap the place while keeping the frame correct.",
    review_targets: ["pa_a1_journey_directions_001", "pa_a1_cando_directions_001"],
    canada_practical: true,
  },
  {
    id: "pa_a1_counter_help_001",
    setting: "public_counter",
    skill: "help",
    practice_type: "phrase_recall",
    scenario_vi: "Bạn cần nhờ giúp ở quầy công cộng.",
    scenario_en: "You need help at a public counter.",
    prompt_vi: "Nói câu xin giúp đỡ lịch sự.",
    prompt_en: "Say a polite help request.",
    answer_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    romanization: "kirpa karke madad karo",
    meaning_vi: "Làm ơn giúp tôi.",
    meaning_en: "Please help.",
    explanation_vi: "ਕਿਰਪਾ ਕਰਕੇ làm câu yêu cầu lịch sự hơn.",
    explanation_en: "ਕਿਰਪਾ ਕਰਕੇ makes the request more polite.",
    remediation_vi: "Ôn cụm polite requests trước khi luyện roleplay.",
    remediation_en: "Review polite request phrases before roleplay.",
    readiness_signal_vi: "Bạn nhờ giúp mà không quá cụt.",
    readiness_signal_en: "You ask for help without sounding too abrupt.",
    review_targets: ["pa_a1_final_help_001", "pa_a1_journey_help_001"],
    learner_trap: { audience: "both", vi: "Không chỉ nói mệnh lệnh khi cần lịch sự.", en: "Do not use only a command when politeness is needed." },
    canada_practical: true,
  },
  {
    id: "pa_a1_counter_repetition_001",
    setting: "general_counter",
    skill: "repetition",
    practice_type: "phrase_recall",
    scenario_vi: "Nhân viên nói quá nhanh.",
    scenario_en: "The staff member speaks too quickly.",
    prompt_vi: "Yêu cầu họ lặp lại.",
    prompt_en: "Ask them to repeat.",
    answer_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    romanization: "kirpa karke dubara kaho",
    meaning_vi: "Làm ơn nói lại.",
    meaning_en: "Please say that again.",
    explanation_vi: "ਦੁਬਾਰਾ ਕਹੋ là yêu cầu lặp lại; thêm ਕਿਰਪਾ ਕਰਕੇ để lịch sự.",
    explanation_en: "ਦੁਬਾਰਾ ਕਹੋ asks for repetition; ਕਿਰਪਾ ਕਰਕੇ adds politeness.",
    remediation_vi: "Ôn lại cụm ਕਿਰਪਾ ਕਰਕੇ nếu câu nghe quá trực tiếp.",
    remediation_en: "Review ਕਿਰਪਾ ਕਰਕੇ if the request sounds too direct.",
    readiness_signal_vi: "Bạn biết cách giảm tốc cuộc hội thoại.",
    readiness_signal_en: "You know how to slow the interaction down.",
    review_targets: ["pa_a1_journey_polite_001", "pa_a1_recall_help_002"],
    learner_trap: { audience: "vi", vi: "Đừng im lặng khi không nghe kịp; dùng câu lặp lại.", en: "Do not stay silent when you miss something; use the repetition phrase." },
    canada_practical: true,
  },
  {
    id: "pa_a1_counter_repetition_002",
    setting: "general_counter",
    skill: "repetition",
    practice_type: "remediation",
    scenario_vi: "Bạn không hiểu câu trả lời tại quầy.",
    scenario_en: "You do not understand the answer at the counter.",
    prompt_vi: "Nói bạn không hiểu.",
    prompt_en: "Say you do not understand.",
    answer_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਉਂਦੀ।",
    romanization: "mainu samajh nahin aundi",
    meaning_vi: "Tôi không hiểu.",
    meaning_en: "I do not understand.",
    explanation_vi: "ਨਹੀਂ tạo phủ định trong câu này.",
    explanation_en: "ਨਹੀਂ marks negation in this sentence.",
    remediation_vi: "Ôn phủ định ਨਹੀਂ và câu hỏi xin lặp lại.",
    remediation_en: "Review ਨਹੀਂ negation and the repetition request.",
    readiness_signal_vi: "Bạn có thể báo vấn đề thay vì đoán.",
    readiness_signal_en: "You can signal the problem instead of guessing.",
    review_targets: ["pa_a1_final_help_002", "pa_a1_cando_help_002"],
    learner_trap: { audience: "vi", vi: "Đừng bỏ ਨਹੀਂ khi dịch 'không'.", en: "Do not omit ਨਹੀਂ when translating 'not'." },
    canada_practical: true,
  },
  {
    id: "pa_a1_counter_school_001",
    setting: "school",
    skill: "need",
    practice_type: "mini_roleplay",
    scenario_vi: "Ở văn phòng trường tại Canada, bạn cần mẫu đơn.",
    scenario_en: "At a school office in Canada, you need a form.",
    prompt_vi: "Nói bạn cần mẫu đơn.",
    prompt_en: "Say you need a form.",
    answer_pa: "ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mainu form chahida hai",
    meaning_vi: "Tôi cần mẫu đơn.",
    meaning_en: "I need a form.",
    explanation_vi: "Dùng cùng khung nhu cầu với ਪਾਣੀ, thay danh từ bằng ਫਾਰਮ.",
    explanation_en: "Use the same need frame as ਪਾਣੀ, replacing the noun with ਫਾਰਮ.",
    remediation_vi: "Ôn khung ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ.",
    remediation_en: "Review the frame ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ.",
    readiness_signal_vi: "Bạn dùng được khung nhu cầu ở văn phòng trường.",
    readiness_signal_en: "You can use the need frame at a school office.",
    review_targets: ["pa_a1_final_services_001", "pa_a1_journey_services_001"],
    canada_practical: true,
  },
  {
    id: "pa_a1_counter_clinic_001",
    setting: "clinic",
    skill: "appointment",
    practice_type: "mini_roleplay",
    scenario_vi: "Ở phòng khám, bạn cần hỏi lịch hẹn.",
    scenario_en: "At a clinic, you need to ask about your appointment.",
    prompt_vi: "Hỏi lịch hẹn của bạn là khi nào.",
    prompt_en: "Ask when your appointment is.",
    answer_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਦੋਂ ਹੈ?",
    romanization: "meri appointment kadon hai?",
    meaning_vi: "Lịch hẹn của tôi là khi nào?",
    meaning_en: "When is my appointment?",
    explanation_vi: "ਕਦੋਂ hỏi 'khi nào'; ਅਪਾਇੰਟਮੈਂਟ là lịch hẹn.",
    explanation_en: "ਕਦੋਂ asks 'when'; ਅਪਾਇੰਟਮੈਂਟ means appointment.",
    remediation_vi: "Ôn ਕਦੋਂ và từ dịch vụ ਅਪਾਇੰਟਮੈਂਟ.",
    remediation_en: "Review ਕਦੋਂ and service word ਅਪਾਇੰਟਮੈਂਟ.",
    readiness_signal_vi: "Bạn hỏi được thông tin lịch hẹn ngắn.",
    readiness_signal_en: "You can ask brief appointment information.",
    review_targets: ["pa_a1_final_services_002", "pa_a1_cando_services_001"],
    canada_practical: true,
  },
  {
    id: "pa_a1_counter_public_001",
    setting: "public_counter",
    skill: "identification",
    practice_type: "choice",
    scenario_vi: "Nhân viên hỏi về giấy tờ tùy thân.",
    scenario_en: "A staff member asks about identification.",
    prompt_vi: "Chọn câu hỏi về ID.",
    prompt_en: "Choose the ID question.",
    options_pa: ["ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਪਛਾਣ ਹੈ?", "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?", "ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?"],
    answer_pa: "ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਪਛਾਣ ਹੈ?",
    romanization: "ki tuhade kol pachhan hai?",
    meaning_vi: "Bạn có giấy tờ tùy thân không?",
    meaning_en: "Do you have ID?",
    explanation_vi: "ਪਛਾਣ nghĩa là giấy tờ tùy thân/ID trong bối cảnh dịch vụ.",
    explanation_en: "ਪਛਾਣ means identification/ID in service contexts.",
    remediation_vi: "Ôn ਕੋਲ cho mẫu 'có' và từ ਪਛਾਣ.",
    remediation_en: "Review ਕੋਲ for the 'have' pattern and ਪਛਾਣ.",
    readiness_signal_vi: "Bạn phân biệt câu ID với câu giá và chào hỏi.",
    readiness_signal_en: "You distinguish the ID question from price and greeting lines.",
    review_targets: ["pa_a1_final_services_003", "pa_a1_journey_services_002"],
    learner_trap: { audience: "en", vi: "Punjabi dùng ਕੋਲ cho 'have' trong mẫu này.", en: "Punjabi uses ਕੋਲ for 'have' in this pattern." },
    canada_practical: true,
  },
  {
    id: "pa_a1_counter_store_001",
    setting: "store",
    skill: "need",
    practice_type: "readiness_check",
    scenario_vi: "Ở cửa hàng, bạn muốn một túi.",
    scenario_en: "At a store, you want a bag.",
    prompt_vi: "Nói bạn cần một túi.",
    prompt_en: "Say you need a bag.",
    answer_pa: "ਮੈਨੂੰ ਇੱਕ ਬੈਗ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mainu ikk bag chahida hai",
    meaning_vi: "Tôi cần một túi.",
    meaning_en: "I need a bag.",
    explanation_vi: "ਇੱਕ thêm số lượng vào khung nhu cầu.",
    explanation_en: "ਇੱਕ adds quantity to the need frame.",
    remediation_vi: "Ôn số ਇੱਕ và khung ਚਾਹੀਦਾ ਹੈ.",
    remediation_en: "Review number ਇੱਕ and the ਚਾਹੀਦਾ ਹੈ frame.",
    readiness_signal_vi: "Bạn kết hợp số nhỏ với câu nhu cầu.",
    readiness_signal_en: "You combine a small number with a need sentence.",
    review_targets: ["pa_a1_journey_numbers_001", "pa_a1_cando_needs_001"],
    learner_trap: { audience: "both", vi: "Đừng bỏ số nếu số lượng quan trọng.", en: "Do not omit the number when quantity matters." },
    canada_practical: true,
  },
  {
    id: "pa_a1_counter_gurmukhi_001",
    setting: "public_counter",
    skill: "identification",
    practice_type: "navigation",
    scenario_vi: "Bạn nhìn bảng ở quầy và cần nhận ra các từ dịch vụ.",
    scenario_en: "You look at a counter sign and need to recognize service words.",
    prompt_vi: "Nhớ nghĩa của ba từ Gurmukhi.",
    prompt_en: "Recall the meanings of three Gurmukhi words.",
    answer_pa: ["ਫਾਰਮ", "ਪਛਾਣ", "ਅਪਾਇੰਟਮੈਂਟ"],
    romanization: "form, pachhan, appointment",
    meaning_vi: "mẫu đơn, giấy tờ tùy thân, lịch hẹn",
    meaning_en: "form, identification, appointment",
    explanation_vi: "Các từ này xuất hiện nhiều ở trường, phòng khám và quầy công cộng.",
    explanation_en: "These words commonly appear at schools, clinics, and public counters.",
    remediation_vi: "Che romanization và đọc Gurmukhi trước.",
    remediation_en: "Cover the romanization and read Gurmukhi first.",
    readiness_signal_vi: "Bạn nhận ra từ dịch vụ trước khi roleplay.",
    readiness_signal_en: "You recognize service words before roleplay.",
    review_targets: ["pa_a1_final_gurmukhi_002", "pa_a1_recall_gurmukhi_002"],
    learner_trap: { audience: "both", vi: "Không chỉ học nghĩa tiếng Anh; cần nhìn chữ Gurmukhi.", en: "Do not learn only English meanings; look at the Gurmukhi." },
    canada_practical: true,
  },
];

export default punjabiA1ServiceCounterPractice;
