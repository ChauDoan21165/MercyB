// Punjabi Canada healthcare pack for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary. Shahmukhi is awareness only, not a full course.
// Native review is deferred. Language support only; not medical advice.

export type PunjabiHealthcareCanadaTopic =
  | "clinic_check_in"
  | "symptoms"
  | "appointment"
  | "pharmacy"
  | "interpreter_request"
  | "allergy"
  | "medication_question"
  | "follow_up"
  | "emergency_boundary";

export type PunjabiHealthcareCanadaItem = {
  id: string;
  topic: PunjabiHealthcareCanadaTopic;
  phrase_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  use_vi: string;
  use_en: string;
  canada_example_vi: string;
  canada_example_en: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export const PUNJABI_HEALTHCARE_CANADA_SCOPE = {
  name: "Punjabi Healthcare Canada Pack",
  scriptPolicy:
    "Gurmukhi is primary. Romanization is a learner bridge. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundary:
    "Language support for Canadian clinic, pharmacy, appointment, interpreter, follow-up, allergy, symptom, and emergency-boundary situations; not medical advice.",
} as const;

export const PUNJABI_HEALTHCARE_CANADA_TOPICS: PunjabiHealthcareCanadaTopic[] = [
  "clinic_check_in",
  "symptoms",
  "appointment",
  "pharmacy",
  "interpreter_request",
  "allergy",
  "medication_question",
  "follow_up",
  "emergency_boundary",
];

export const PUNJABI_HEALTHCARE_CANADA: PunjabiHealthcareCanadaItem[] = [
  {
    id: "pa-ca-health-clinic-check-in-001",
    topic: "clinic_check_in",
    phrase_pa: "ਮੇਰੀ ਅੱਜ ਅਪਾਇੰਟਮੈਂਟ ਹੈ।",
    romanization: "meri ajj appointment hai.",
    meaning_vi: "Hôm nay tôi có lịch hẹn.",
    meaning_en: "I have an appointment today.",
    use_vi: "Dùng ở quầy check-in phòng khám khi đưa tên hoặc thẻ y tế.",
    use_en: "Use at clinic check-in when giving your name or health card.",
    canada_example_vi: "Ở Canada, bạn có thể cần nói câu này trước khi nhân viên hỏi health card.",
    canada_example_en: "In Canada, use this before staff ask for your health card.",
    learner_trap_vi: "Đừng nói quá dài nếu quầy đang đông; mở bằng câu ngắn trước.",
    learner_trap_en: "Do not start too long at a busy desk; lead with the short line.",
  },
  {
    id: "pa-ca-health-clinic-check-in-002",
    topic: "clinic_check_in",
    phrase_pa: "ਮੈਂ ਪਹਿਲੀ ਵਾਰ ਆਇਆ/ਆਈ ਹਾਂ।",
    romanization: "main pehli vaar aaya/aai haan.",
    meaning_vi: "Đây là lần đầu tôi đến.",
    meaning_en: "This is my first visit.",
    use_vi: "Nói khi phòng khám cần tạo hồ sơ mới.",
    use_en: "Use when the clinic needs to create a new file.",
    canada_example_vi: "Hữu ích ở walk-in clinic hoặc family doctor office tại Canada.",
    canada_example_en: "Useful at a walk-in clinic or family doctor office in Canada.",
  },
  {
    id: "pa-ca-health-symptoms-003",
    topic: "symptoms",
    phrase_pa: "ਮੈਨੂੰ ਇੱਥੇ ਦਰਦ ਹੈ।",
    romanization: "mainu itthe dard hai.",
    meaning_vi: "Tôi đau ở đây.",
    meaning_en: "I have pain here.",
    use_vi: "Chỉ vào vị trí đau khi vốn từ còn ít.",
    use_en: "Point to the painful area when vocabulary is limited.",
    canada_example_vi: "Dùng với y tá triage hoặc bác sĩ, không tự chẩn đoán.",
    canada_example_en: "Use with triage staff or a doctor without self-diagnosing.",
    learner_trap_vi: "dard là đau; đừng dùng câu này để nêu tên bệnh nếu chưa chắc.",
    learner_trap_en: "dard means pain; do not use this as a diagnosis.",
  },
  {
    id: "pa-ca-health-symptoms-004",
    topic: "symptoms",
    phrase_pa: "ਮੈਨੂੰ ਬੁਖ਼ਾਰ ਅਤੇ ਖੰਘ ਹੈ।",
    romanization: "mainu bukhar ate khangh hai.",
    meaning_vi: "Tôi bị sốt và ho.",
    meaning_en: "I have a fever and a cough.",
    use_vi: "Nêu triệu chứng cơ bản khi đặt lịch hoặc check-in.",
    use_en: "State basic symptoms when booking or checking in.",
    canada_example_vi: "Một số clinic Canada có thể hỏi triệu chứng hô hấp trước khi vào.",
    canada_example_en: "Some Canadian clinics may ask about respiratory symptoms before entry.",
  },
  {
    id: "pa-ca-health-appointment-005",
    topic: "appointment",
    phrase_pa: "ਕੀ ਮੈਨੂੰ ਅਪਾਇੰਟਮੈਂਟ ਮਿਲ ਸਕਦੀ ਹੈ?",
    romanization: "ki mainu appointment mil sakdi hai?",
    meaning_vi: "Tôi có thể đặt lịch hẹn không?",
    meaning_en: "Can I get an appointment?",
    use_vi: "Dùng khi gọi hoặc hỏi quầy tiếp tân.",
    use_en: "Use when calling or asking reception.",
    canada_example_vi: "Dùng cho family clinic, walk-in clinic, hoặc community health centre.",
    canada_example_en: "Use for a family clinic, walk-in clinic, or community health centre.",
  },
  {
    id: "pa-ca-health-appointment-006",
    topic: "appointment",
    phrase_pa: "ਕੀ ਤੁਸੀਂ ਸਮਾਂ ਲਿਖ ਸਕਦੇ ਹੋ?",
    romanization: "ki tusin sama likh sakde ho?",
    meaning_vi: "Bạn có thể viết giờ hẹn ra không?",
    meaning_en: "Can you write down the time?",
    use_vi: "Xin ghi giờ hẹn để tránh nghe nhầm.",
    use_en: "Ask for the time in writing to avoid mishearing.",
    canada_example_vi: "Hữu ích khi nhận lịch qua điện thoại ở Canada.",
    canada_example_en: "Useful when receiving appointment details by phone in Canada.",
    learner_trap_vi: "Đừng dựa vào trí nhớ nếu số và giờ nghe chưa chắc.",
    learner_trap_en: "Do not rely on memory if numbers and times are unclear.",
  },
  {
    id: "pa-ca-health-pharmacy-007",
    topic: "pharmacy",
    phrase_pa: "ਮੈਨੂੰ ਇਹ ਦਵਾਈ ਲੈਣੀ ਹੈ।",
    romanization: "mainu ih davai laini hai.",
    meaning_vi: "Tôi cần lấy thuốc này.",
    meaning_en: "I need to pick up this medicine.",
    use_vi: "Dùng ở nhà thuốc khi đưa toa hoặc tên thuốc.",
    use_en: "Use at a pharmacy when showing a prescription or medicine name.",
    canada_example_vi: "Ở Canada, pharmacist có thể hỏi thêm về dị ứng hoặc thuốc hiện tại.",
    canada_example_en: "In Canada, the pharmacist may ask about allergies or current medicine.",
  },
  {
    id: "pa-ca-health-pharmacy-008",
    topic: "pharmacy",
    phrase_pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਹੌਲੀ ਹੌਲੀ ਸਮਝਾਓ।",
    romanization: "kirpa karke ih hauli hauli samjhao.",
    meaning_vi: "Làm ơn giải thích chậm hơn.",
    meaning_en: "Please explain this slowly.",
    use_vi: "Dùng khi hướng dẫn ở nhà thuốc quá nhanh.",
    use_en: "Use when pharmacy instructions are too fast.",
    canada_example_vi: "Câu này xin hỗ trợ giao tiếp, không tự thay đổi liều thuốc.",
    canada_example_en: "This asks for communication support and does not change dosage.",
  },
  {
    id: "pa-ca-health-interpreter-009",
    topic: "interpreter_request",
    phrase_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਆ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mainu dubhashia chahida hai.",
    meaning_vi: "Tôi cần thông dịch viên.",
    meaning_en: "I need an interpreter.",
    use_vi: "Dùng khi vấn đề y tế phức tạp hoặc bạn chưa hiểu.",
    use_en: "Use when the health issue is complex or you do not understand.",
    canada_example_vi: "Một số dịch vụ y tế Canada có thể sắp xếp interpreter qua điện thoại.",
    canada_example_en: "Some Canadian health services can arrange a phone interpreter.",
  },
  {
    id: "pa-ca-health-interpreter-010",
    topic: "interpreter_request",
    phrase_pa: "ਕੀ ਕੋਈ ਪੰਜਾਬੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਦੁਭਾਸ਼ੀਆ ਹੈ?",
    romanization: "ki koi Punjabi jaan Angrezi dubhashia hai?",
    meaning_vi: "Có thông dịch viên Punjabi hoặc tiếng Anh không?",
    meaning_en: "Is there a Punjabi or English interpreter?",
    use_vi: "Hỏi lựa chọn thông dịch khi cần xác nhận chính xác.",
    use_en: "Ask about interpreting options when exact confirmation matters.",
    canada_example_vi: "Dùng ở hospital desk, clinic, hoặc public health line.",
    canada_example_en: "Use at a hospital desk, clinic, or public health line.",
  },
  {
    id: "pa-ca-health-allergy-011",
    topic: "allergy",
    phrase_pa: "ਮੈਨੂੰ ਇਸ ਦਵਾਈ ਤੋਂ ਐਲਰਜੀ ਹੈ।",
    romanization: "mainu is davai ton allergy hai.",
    meaning_vi: "Tôi dị ứng với thuốc này.",
    meaning_en: "I am allergic to this medicine.",
    use_vi: "Nói trước khi nhận thuốc hoặc khám.",
    use_en: "Say this before receiving medicine or care.",
    canada_example_vi: "Hữu ích ở clinic, hospital, dental office, hoặc pharmacy.",
    canada_example_en: "Useful at a clinic, hospital, dental office, or pharmacy.",
    learner_trap_vi: "Nếu không chắc tên thuốc, hãy đưa ảnh hoặc nhãn thuốc.",
    learner_trap_en: "If unsure of the medicine name, show a photo or label.",
  },
  {
    id: "pa-ca-health-allergy-012",
    topic: "allergy",
    phrase_pa: "ਕੀ ਇਸ ਵਿੱਚ ਪੈਨਿਸਿਲਿਨ ਹੈ?",
    romanization: "ki is vich penicillin hai?",
    meaning_vi: "Trong này có penicillin không?",
    meaning_en: "Does this contain penicillin?",
    use_vi: "Hỏi về thành phần khi có dị ứng đã biết.",
    use_en: "Ask about ingredients when you have a known allergy.",
    canada_example_vi: "Dùng ở nhà thuốc Canada trước khi đồng ý nhận thuốc.",
    canada_example_en: "Use at a Canadian pharmacy before accepting medicine.",
  },
  {
    id: "pa-ca-health-medication-question-013",
    topic: "medication_question",
    phrase_pa: "ਮੈਨੂੰ ਇਹ ਕਦੋਂ ਲੈਣੀ ਹੈ?",
    romanization: "mainu ih kadon laini hai?",
    meaning_vi: "Tôi nên dùng thuốc này khi nào?",
    meaning_en: "When should I take this?",
    use_vi: "Xin nhắc lại lịch dùng thuốc bằng ngôn ngữ đơn giản.",
    use_en: "Ask for the medicine schedule in simple language.",
    canada_example_vi: "Câu hỏi này hỗ trợ hiểu hướng dẫn; không tự quyết định liều.",
    canada_example_en: "This supports understanding instructions; it is not self-dosing advice.",
  },
  {
    id: "pa-ca-health-medication-question-014",
    topic: "medication_question",
    phrase_pa: "ਕੀ ਇਸ ਨਾਲ ਕੋਈ ਸਾਈਡ ਇਫੈਕਟ ਹੈ?",
    romanization: "ki is naal koi side effect hai?",
    meaning_vi: "Thuốc này có tác dụng phụ nào không?",
    meaning_en: "Does this have any side effects?",
    use_vi: "Hỏi pharmacist hoặc clinician để nghe giải thích rõ hơn.",
    use_en: "Ask a pharmacist or clinician for a clearer explanation.",
    canada_example_vi: "Dùng ở nhà thuốc Canada khi nhận thuốc mới.",
    canada_example_en: "Use at a Canadian pharmacy when receiving a new medicine.",
  },
  {
    id: "pa-ca-health-follow-up-015",
    topic: "follow_up",
    phrase_pa: "ਕੀ ਮੈਨੂੰ ਮੁੜ ਆਉਣਾ ਚਾਹੀਦਾ ਹੈ?",
    romanization: "ki mainu mur auna chahida hai?",
    meaning_vi: "Tôi có cần quay lại không?",
    meaning_en: "Should I come back?",
    use_vi: "Hỏi bước tiếp theo sau buổi khám.",
    use_en: "Ask about the next step after the visit.",
    canada_example_vi: "Dùng trước khi rời clinic để biết follow-up.",
    canada_example_en: "Use before leaving the clinic to understand follow-up.",
  },
  {
    id: "pa-ca-health-follow-up-016",
    topic: "follow_up",
    phrase_pa: "ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਲਿਖ ਦਿਓ।",
    romanization: "kirpa karke agla kadam likh dio.",
    meaning_vi: "Làm ơn viết bước tiếp theo ra.",
    meaning_en: "Please write down the next step.",
    use_vi: "Xin ghi lại để tránh quên sau cuộc hẹn.",
    use_en: "Ask for written next steps to avoid forgetting after the visit.",
    canada_example_vi: "Hữu ích nếu bạn cần đem thông tin về cho gia đình hoặc caregiver.",
    canada_example_en: "Useful if you need to bring the information to family or a caregiver.",
  },
  {
    id: "pa-ca-health-emergency-boundary-017",
    topic: "emergency_boundary",
    phrase_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ 911 ਨੂੰ ਕਾਲ ਕਰੋ।",
    romanization: "ih emergency hai. kirpa karke 911 nu call karo.",
    meaning_vi: "Đây là trường hợp khẩn cấp. Làm ơn gọi 911.",
    meaning_en: "This is an emergency. Please call 911.",
    use_vi: "Dùng khi có nguy hiểm ngay, đau ngực nặng, khó thở, hoặc chấn thương nghiêm trọng.",
    use_en: "Use for immediate danger, severe chest pain, breathing trouble, or serious injury.",
    canada_example_vi: "Ở Canada, 911 là số khẩn cấp; pack này không thay thế cấp cứu.",
    canada_example_en: "In Canada, 911 is the emergency number; this pack does not replace emergency care.",
  },
  {
    id: "pa-ca-health-emergency-boundary-018",
    topic: "emergency_boundary",
    phrase_pa: "ਮੈਂ ਡਾਕਟਰ ਨਹੀਂ ਹਾਂ; ਮੈਨੂੰ ਤੁਰੰਤ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    romanization: "main doctor nahin haan; mainu turant madad chahidi hai.",
    meaning_vi: "Tôi không phải bác sĩ; tôi cần giúp ngay.",
    meaning_en: "I am not a doctor; I need urgent help.",
    use_vi: "Nêu rõ bạn cần hỗ trợ khẩn cấp thay vì tự xử lý.",
    use_en: "Make clear that you need urgent help instead of self-managing.",
    canada_example_vi: "Dùng với người xung quanh, security, hoặc quầy tiếp tân trong tình huống khẩn.",
    canada_example_en: "Use with bystanders, security, or reception in an urgent situation.",
  },
];

export const punjabiHealthcareCanada = PUNJABI_HEALTHCARE_CANADA;

export const punjabiHealthcareCanadaByTopic = (topic: PunjabiHealthcareCanadaTopic) =>
  PUNJABI_HEALTHCARE_CANADA.filter((entry) => entry.topic === topic);

export default punjabiHealthcareCanada;
