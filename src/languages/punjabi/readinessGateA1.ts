// Punjabi A1 readiness gate for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization is practical learner support. Native review is deferred.

export type PunjabiReadinessSkill =
  | "greet"
  | "introduce_self"
  | "gurmukhi_recognition"
  | "simple_needs"
  | "prices"
  | "directions"
  | "canada_service_counter";

export type PunjabiReadinessTaskType =
  | "checkpoint_choice"
  | "produce_phrase"
  | "recognition"
  | "route_next"
  | "mini_scenario";

export type PunjabiReadinessGateItem = {
  id: string;
  skill: PunjabiReadinessSkill;
  task_type: PunjabiReadinessTaskType;
  can_do_vi: string;
  can_do_en: string;
  prompt_vi: string;
  prompt_en: string;
  cue_pa?: string;
  romanization?: string;
  options?: string[];
  expected_answer_pa: string | string[];
  expected_answer_vi: string;
  expected_answer_en: string;
  pass_criteria_vi: string;
  pass_criteria_en: string;
  route_if_missed: {
    vi: string;
    en: string;
    review_ids: string[];
  };
  learner_trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: boolean;
};

export const readinessGateScriptAwareness =
  "Gurmukhi is primary for this Punjabi A1 readiness gate. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1ReadinessGate: PunjabiReadinessGateItem[] = [
  {
    id: "pa_a1_ready_greet_001",
    skill: "greet",
    task_type: "produce_phrase",
    can_do_vi: "Tôi có thể chào lịch sự.",
    can_do_en: "I can greet politely.",
    prompt_vi: "Nói 'Xin chào' bằng Punjabi.",
    prompt_en: "Say 'Hello' in Punjabi.",
    romanization: "sat sri akal",
    expected_answer_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    expected_answer_vi: "Xin chào.",
    expected_answer_en: "Hello.",
    pass_criteria_vi: "Dùng đúng cụm ਸਤ ਸ੍ਰੀ ਅਕਾਲ bằng Gurmukhi.",
    pass_criteria_en: "Uses the correct Gurmukhi phrase ਸਤ ਸ੍ਰੀ ਅਕਾਲ.",
    route_if_missed: {
      vi: "Ôn micro-lesson chào hỏi và review loop greeting.",
      en: "Review the greeting micro-lesson and greeting review loop.",
      review_ids: ["pa_a1_micro_greetings_001", "pa_a1_review_greetings_001"],
    },
    learner_trap: { audience: "vi", vi: "Không thêm nguyên âm sau ਸਤ.", en: "Vietnamese speakers should not add a vowel after final ਤ." },
  },
  {
    id: "pa_a1_ready_greet_002",
    skill: "greet",
    task_type: "checkpoint_choice",
    can_do_vi: "Tôi có thể hỏi thăm đơn giản.",
    can_do_en: "I can ask a simple check-in question.",
    prompt_vi: "Chọn câu 'Bạn khỏe không?'",
    prompt_en: "Choose 'How are you?'",
    options: ["ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?", "ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?", "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?"],
    expected_answer_pa: "ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?",
    expected_answer_vi: "Bạn khỏe không?",
    expected_answer_en: "How are you?",
    pass_criteria_vi: "Chọn đúng câu có ਕਿਵੇਂ ਹੋ.",
    pass_criteria_en: "Selects the phrase with ਕਿਵੇਂ ਹੋ.",
    route_if_missed: {
      vi: "Ôn chào hỏi và phân biệt câu hỏi tên/câu hỏi địa điểm.",
      en: "Review greetings and distinguish name/location questions.",
      review_ids: ["pa_a1_dialogue_greeting_001", "pa_a1_review_greetings_002"],
    },
    learner_trap: { audience: "en", vi: "Dùng ਤੁਸੀਂ với người mới gặp.", en: "Use polite ਤੁਸੀਂ with new adults." },
  },
  {
    id: "pa_a1_ready_identity_001",
    skill: "introduce_self",
    task_type: "produce_phrase",
    can_do_vi: "Tôi có thể giới thiệu tên.",
    can_do_en: "I can introduce my name.",
    prompt_vi: "Nói 'Tên tôi là Lan.'",
    prompt_en: "Say 'My name is Lan.'",
    romanization: "mera nam Lan hai",
    expected_answer_pa: "ਮੇਰਾ ਨਾਮ ਲਾਨ ਹੈ।",
    expected_answer_vi: "Tên tôi là Lan.",
    expected_answer_en: "My name is Lan.",
    pass_criteria_vi: "Có ਮੇਰਾ ਨਾਮ và kết thúc bằng ਹੈ.",
    pass_criteria_en: "Includes ਮੇਰਾ ਨਾਮ and ends with ਹੈ.",
    route_if_missed: {
      vi: "Ôn mẫu giới thiệu tên trong capstone và mini-dialogue.",
      en: "Review the name-introduction capstone and mini-dialogue.",
      review_ids: ["pa_a1_capstone_identity_001", "pa_a1_dialogue_name_001"],
    },
    learner_trap: { audience: "vi", vi: "Đừng bỏ ਹੈ ở cuối.", en: "Vietnamese speakers may drop ਹੈ; keep it." },
  },
  {
    id: "pa_a1_ready_identity_002",
    skill: "introduce_self",
    task_type: "checkpoint_choice",
    can_do_vi: "Tôi có thể hỏi tên người khác.",
    can_do_en: "I can ask someone else's name.",
    prompt_vi: "Chọn câu hỏi tên.",
    prompt_en: "Choose the name question.",
    options: ["ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?", "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?", "ਹੁਣ ਕਿੰਨੇ ਵਜੇ ਹਨ?"],
    expected_answer_pa: "ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    expected_answer_vi: "Tên bạn là gì?",
    expected_answer_en: "What is your name?",
    pass_criteria_vi: "Chọn câu có ਨਾਮ ਕੀ ਹੈ.",
    pass_criteria_en: "Selects the question with ਨਾਮ ਕੀ ਹੈ.",
    route_if_missed: {
      vi: "Ôn câu hỏi tên và vị trí của ਕੀ.",
      en: "Review the name question and placement of ਕੀ.",
      review_ids: ["pa_a1_capstone_identity_002", "pa_a1_review_identity_002"],
    },
    learner_trap: { audience: "both", vi: "Không đặt ਕੀ ở cuối câu.", en: "Do not place ਕੀ at the end here." },
  },
  {
    id: "pa_a1_ready_gurmukhi_001",
    skill: "gurmukhi_recognition",
    task_type: "recognition",
    can_do_vi: "Tôi có thể nhận diện từ sinh tồn bằng Gurmukhi.",
    can_do_en: "I can recognize survival words in Gurmukhi.",
    prompt_vi: "Từ nào nghĩa là 'nước'?",
    prompt_en: "Which word means 'water'?",
    options: ["ਪਾਣੀ", "ਫਾਰਮ", "ਮਦਦ"],
    expected_answer_pa: "ਪਾਣੀ",
    expected_answer_vi: "nước",
    expected_answer_en: "water",
    pass_criteria_vi: "Chọn ਪਾਣੀ mà không cần nhìn romanization.",
    pass_criteria_en: "Selects ਪਾਣੀ without relying on romanization.",
    route_if_missed: {
      vi: "Ôn nhận diện Gurmukhi cho từ sinh tồn.",
      en: "Review Gurmukhi recognition for survival words.",
      review_ids: ["pa_a1_review_gurmukhi_001", "pa_a1_capstone_gurmukhi_001"],
    },
    learner_trap: { audience: "both", vi: "A1 không chỉ là nhớ chữ Latin.", en: "A1 is not just remembering Latin letters." },
  },
  {
    id: "pa_a1_ready_gurmukhi_002",
    skill: "gurmukhi_recognition",
    task_type: "recognition",
    can_do_vi: "Tôi có thể nhận diện các số nhỏ.",
    can_do_en: "I can recognize small numbers.",
    prompt_vi: "Chọn số 'hai'.",
    prompt_en: "Choose the number 'two'.",
    options: ["ਇੱਕ", "ਦੋ", "ਪੰਜ"],
    expected_answer_pa: "ਦੋ",
    expected_answer_vi: "hai",
    expected_answer_en: "two",
    pass_criteria_vi: "Chọn ਦੋ nhanh và chính xác.",
    pass_criteria_en: "Selects ਦੋ quickly and accurately.",
    route_if_missed: {
      vi: "Ôn số 1-5 bằng Gurmukhi.",
      en: "Review numbers 1-5 in Gurmukhi.",
      review_ids: ["pa_a1_micro_numbers_001", "pa_a1_review_numbers_001"],
    },
    learner_trap: { audience: "both", vi: "Đừng học số chỉ bằng romanization.", en: "Do not study numbers only through romanization." },
  },
  {
    id: "pa_a1_ready_needs_001",
    skill: "simple_needs",
    task_type: "produce_phrase",
    can_do_vi: "Tôi có thể nói nhu cầu cơ bản.",
    can_do_en: "I can state a basic need.",
    prompt_vi: "Nói 'Tôi cần nước.'",
    prompt_en: "Say 'I need water.'",
    romanization: "mainu pani chahida hai",
    expected_answer_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    expected_answer_vi: "Tôi cần nước.",
    expected_answer_en: "I need water.",
    pass_criteria_vi: "Dùng khung ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ.",
    pass_criteria_en: "Uses the frame ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ.",
    route_if_missed: {
      vi: "Ôn mẫu nhu cầu trong food/needs.",
      en: "Review the food/needs pattern.",
      review_ids: ["pa_a1_micro_food_001", "pa_a1_capstone_food_001"],
    },
    learner_trap: { audience: "vi", vi: "Không bỏ ਮੈਨੂੰ.", en: "Do not drop ਮੈਨੂੰ." },
  },
  {
    id: "pa_a1_ready_needs_002",
    skill: "simple_needs",
    task_type: "mini_scenario",
    can_do_vi: "Tôi có thể yêu cầu mẫu đơn.",
    can_do_en: "I can ask for a form.",
    prompt_vi: "Ở văn phòng trường, nói 'Tôi cần mẫu đơn.'",
    prompt_en: "At a school office, say 'I need a form.'",
    romanization: "mainu form chahida hai",
    expected_answer_pa: "ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    expected_answer_vi: "Tôi cần mẫu đơn.",
    expected_answer_en: "I need a form.",
    pass_criteria_vi: "Dùng ਫਾਰਮ trong khung nhu cầu.",
    pass_criteria_en: "Uses ਫਾਰਮ in the need frame.",
    route_if_missed: {
      vi: "Ôn school office mini-dialogue và Gurmukhi recognition.",
      en: "Review the school-office mini-dialogue and Gurmukhi recognition.",
      review_ids: ["pa_a1_dialogue_school_001", "pa_a1_capstone_gurmukhi_002"],
    },
    canada_practical: true,
  },
  {
    id: "pa_a1_ready_prices_001",
    skill: "prices",
    task_type: "checkpoint_choice",
    can_do_vi: "Tôi có thể hỏi giá.",
    can_do_en: "I can ask a price.",
    prompt_vi: "Chọn câu 'Cái này bao nhiêu tiền?'",
    prompt_en: "Choose 'How much is this?'",
    options: ["ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?", "ਹੁਣ ਕਿੰਨੇ ਵਜੇ ਹਨ?", "ਸਟੇਸ਼ਨ ਕਿੱਥੇ ਹੈ?"],
    expected_answer_pa: "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?",
    expected_answer_vi: "Cái này bao nhiêu tiền?",
    expected_answer_en: "How much is this?",
    pass_criteria_vi: "Phân biệt giá với giờ và địa điểm.",
    pass_criteria_en: "Distinguishes price from time and location.",
    route_if_missed: {
      vi: "Ôn price dialogue và capstone price.",
      en: "Review the price dialogue and capstone price item.",
      review_ids: ["pa_a1_dialogue_price_001", "pa_a1_review_greetings_002"],
    },
    canada_practical: true,
    learner_trap: { audience: "both", vi: "ਕਿੰਨੇ ਦਾ là giá; ਕਿੰਨੇ ਵਜੇ là giờ.", en: "ਕਿੰਨੇ ਦਾ asks price; ਕਿੰਨੇ ਵਜੇ asks time." },
  },
  {
    id: "pa_a1_ready_prices_002",
    skill: "prices",
    task_type: "recognition",
    can_do_vi: "Tôi có thể hiểu giá đơn giản.",
    can_do_en: "I can understand a simple price.",
    prompt_vi: "Cụm nào nghĩa là 'năm đô la'?",
    prompt_en: "Which phrase means 'five dollars'?",
    options: ["ਪੰਜ ਡਾਲਰ", "ਦੋ ਟਿਕਟਾਂ", "ਇੱਕ ਫਾਰਮ"],
    expected_answer_pa: "ਪੰਜ ਡਾਲਰ",
    expected_answer_vi: "năm đô la",
    expected_answer_en: "five dollars",
    pass_criteria_vi: "Chọn đúng số + đơn vị tiền.",
    pass_criteria_en: "Selects the correct number + currency unit.",
    route_if_missed: {
      vi: "Ôn số nhỏ và price script.",
      en: "Review small numbers and the price script.",
      review_ids: ["pa_a1_listen_text_prices_001", "pa_a1_review_numbers_001"],
    },
    canada_practical: true,
  },
  {
    id: "pa_a1_ready_directions_001",
    skill: "directions",
    task_type: "produce_phrase",
    can_do_vi: "Tôi có thể hỏi địa điểm.",
    can_do_en: "I can ask for a location.",
    prompt_vi: "Hỏi 'Bến xe ở đâu?'",
    prompt_en: "Ask 'Where is the bus stop?'",
    romanization: "bas adda kithe hai?",
    expected_answer_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    expected_answer_vi: "Bến xe ở đâu?",
    expected_answer_en: "Where is the bus stop?",
    pass_criteria_vi: "Dùng ਕਿੱਥੇ ਹੈ sau địa điểm.",
    pass_criteria_en: "Uses ਕਿੱਥੇ ਹੈ after the place.",
    route_if_missed: {
      vi: "Ôn directions dialogue và reorder practice.",
      en: "Review the directions dialogue and reorder practice.",
      review_ids: ["pa_a1_dialogue_directions_001", "pa_a1_guided_reorder_001"],
    },
    canada_practical: true,
    learner_trap: { audience: "en", vi: "Không đảo như tiếng Anh 'where is'.", en: "Do not invert like English 'where is'." },
  },
  {
    id: "pa_a1_ready_directions_002",
    skill: "directions",
    task_type: "checkpoint_choice",
    can_do_vi: "Tôi có thể hỏi phòng khám ở đâu.",
    can_do_en: "I can ask where the clinic is.",
    prompt_vi: "Chọn câu hỏi đúng.",
    prompt_en: "Choose the correct question.",
    options: ["ਕਲਿਨਿਕ ਕਿੱਥੇ ਹੈ?", "ਕਲਿਨਿਕ ਕਿੰਨੇ ਦਾ ਹੈ?", "ਕਲਿਨਿਕ ਨਾਮ ਕੀ ਹੈ?"],
    expected_answer_pa: "ਕਲਿਨਿਕ ਕਿੱਥੇ ਹੈ?",
    expected_answer_vi: "Phòng khám ở đâu?",
    expected_answer_en: "Where is the clinic?",
    pass_criteria_vi: "Chọn câu có ਕਿੱਥੇ ਹੈ.",
    pass_criteria_en: "Selects the phrase with ਕਿੱਥੇ ਹੈ.",
    route_if_missed: {
      vi: "Ôn câu hỏi địa điểm trong capstone.",
      en: "Review location questions in the capstone.",
      review_ids: ["pa_a1_capstone_directions_002", "pa_a1_review_directions_002"],
    },
    canada_practical: true,
  },
  {
    id: "pa_a1_ready_service_001",
    skill: "canada_service_counter",
    task_type: "mini_scenario",
    can_do_vi: "Tôi có thể hỏi giờ hẹn ở dịch vụ Canada.",
    can_do_en: "I can ask appointment time in a Canadian service setting.",
    prompt_vi: "Ở phòng khám, hỏi lịch hẹn của tôi lúc mấy giờ.",
    prompt_en: "At a clinic, ask what time my appointment is.",
    romanization: "mera appointment kinne vaje hai?",
    expected_answer_pa: "ਮੇਰਾ ਅਪਾਇੰਟਮੈਂਟ ਕਿੰਨੇ ਵਜੇ ਹੈ?",
    expected_answer_vi: "Lịch hẹn của tôi lúc mấy giờ?",
    expected_answer_en: "What time is my appointment?",
    pass_criteria_vi: "Dùng ਅਪਾਇੰਟਮੈਂਟ và ਕਿੰਨੇ ਵਜੇ.",
    pass_criteria_en: "Uses ਅਪਾਇੰਟਮੈਂਟ and ਕਿੰਨੇ ਵਜੇ.",
    route_if_missed: {
      vi: "Ôn clinic reception script và Canada capstone.",
      en: "Review the clinic reception script and Canada capstone.",
      review_ids: ["pa_a1_listen_text_clinic_001", "pa_a1_capstone_canada_001"],
    },
    canada_practical: true,
  },
  {
    id: "pa_a1_ready_service_002",
    skill: "canada_service_counter",
    task_type: "mini_scenario",
    can_do_vi: "Tôi có thể hỏi có cần giấy tờ tùy thân không.",
    can_do_en: "I can ask whether ID is needed.",
    prompt_vi: "Ở quầy dịch vụ, hỏi có cần giấy tờ tùy thân không.",
    prompt_en: "At a service counter, ask whether ID is needed.",
    romanization: "ki mainu pachhan pattar chahida hai?",
    expected_answer_pa: "ਕੀ ਮੈਨੂੰ ਪਛਾਣ ਪੱਤਰ ਚਾਹੀਦਾ ਹੈ?",
    expected_answer_vi: "Tôi có cần giấy tờ tùy thân không?",
    expected_answer_en: "Do I need ID?",
    pass_criteria_vi: "Dùng ਕੀ và ਪਛਾਣ ਪੱਤਰ trong câu hỏi.",
    pass_criteria_en: "Uses ਕੀ and ਪਛਾਣ ਪੱਤਰ in the question.",
    route_if_missed: {
      vi: "Ôn service counter script và ID capstone.",
      en: "Review the service-counter script and ID capstone.",
      review_ids: ["pa_a1_listen_text_service_001", "pa_a1_capstone_canada_002"],
    },
    canada_practical: true,
    learner_trap: { audience: "en", vi: "Không thêm do/does khi đã dùng ਕੀ.", en: "Do not add do/does when using ਕੀ." },
  },
  {
    id: "pa_a1_ready_route_001",
    skill: "canada_service_counter",
    task_type: "route_next",
    can_do_vi: "Tôi biết học tiếp gì nếu chưa sẵn sàng.",
    can_do_en: "I know what to review next if I am not ready.",
    prompt_vi: "Nếu bạn sai cả giá và địa điểm, nên ôn nhóm nào trước?",
    prompt_en: "If you miss both price and location, which review should come first?",
    options: ["price + directions review", "family only", "advanced grammar"],
    expected_answer_pa: "ਕੀਮਤ + ਦਿਸ਼ਾਵਾਂ review",
    expected_answer_vi: "Ôn hỏi giá và hỏi đường trước.",
    expected_answer_en: "Review price and directions first.",
    pass_criteria_vi: "Chọn lộ trình ôn đúng cho lỗi A1.",
    pass_criteria_en: "Chooses the correct review route for A1 misses.",
    route_if_missed: {
      vi: "Quay lại guided practice cho price và directions.",
      en: "Return to guided practice for price and directions.",
      review_ids: ["pa_a1_guided_choose_003", "pa_a1_guided_reorder_001"],
    },
    canada_practical: true,
  },
];

export default punjabiA1ReadinessGate;
