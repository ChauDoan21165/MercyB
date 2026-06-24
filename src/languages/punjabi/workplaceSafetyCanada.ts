// Punjabi Canada workplace safety pack for Vietnamese-speaking and
// English-speaking learners.
//
// Gurmukhi is primary. Romanization is a bridge only. Shahmukhi is awareness
// only, not a full course. Native review is deferred.

export type PunjabiWorkplaceSafetyCanadaTopic =
  | "report_injury"
  | "unsafe_condition"
  | "ppe_request"
  | "task_clarification"
  | "emergency_boundary"
  | "supervisor_conversation"
  | "incident_form_support"
  | "first_aid_request"
  | "training_question"
  | "shift_followup";

export type PunjabiWorkplaceSafetyCanadaItem = {
  id: string;
  topic: PunjabiWorkplaceSafetyCanadaTopic;
  situation_vi: string;
  situation_en: string;
  phrase_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  use_vi: string;
  use_en: string;
  canada_example_vi: string;
  canada_example_en: string;
  support_pa: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiWorkplaceSafetyCanadaScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  boundary: string;
};

export const PUNJABI_WORKPLACE_SAFETY_CANADA_SCOPE: PunjabiWorkplaceSafetyCanadaScope = {
  name: "Punjabi Canada Workplace Safety Pack",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundary:
    "Language support for Canadian workplace safety conversations, injury reports, unsafe conditions, PPE requests, task clarification, emergency boundaries, supervisor check-ins, and incident-form support; not legal advice.",
};

export const PUNJABI_WORKPLACE_SAFETY_CANADA_TOPICS: PunjabiWorkplaceSafetyCanadaTopic[] = [
  "report_injury",
  "unsafe_condition",
  "ppe_request",
  "task_clarification",
  "emergency_boundary",
  "supervisor_conversation",
  "incident_form_support",
  "first_aid_request",
  "training_question",
  "shift_followup",
];

export const PUNJABI_WORKPLACE_SAFETY_CANADA: PunjabiWorkplaceSafetyCanadaItem[] = [
  {
    id: "pa-ca-work-safety-injury-001",
    topic: "report_injury",
    situation_vi: "Bạn bị đau hoặc bị thương ở ca làm và cần báo ngay cho người phụ trách.",
    situation_en: "You are hurt during a shift and need to report it to the person in charge.",
    phrase_pa: "ਮੈਨੂੰ ਕੰਮ ਤੇ ਚੋਟ ਲੱਗੀ ਹੈ। ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    romanization: "mainu kam te chot laggi hai. mainu madad chahidi hai.",
    meaning_vi: "Tôi bị thương ở nơi làm việc. Tôi cần giúp đỡ.",
    meaning_en: "I was injured at work. I need help.",
    use_vi: "Dùng ngay khi có chấn thương, trước khi giải thích dài.",
    use_en: "Use immediately when there is an injury, before long explanation.",
    canada_example_vi: "Ở Canada, nói câu này với supervisor, lead hand, hoặc first-aid attendant tại nơi làm.",
    canada_example_en: "In Canada, say this to a supervisor, lead hand, or first-aid attendant at work.",
    support_pa: ["ਮੇਰੇ ਹੱਥ ਵਿੱਚ ਦਰਦ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਸੁਪਰਵਾਈਜ਼ਰ ਨੂੰ ਬੁਲਾਓ।"],
    learner_trap_vi: "ਚੋਟ là chấn thương; đừng im lặng vì sợ làm phiền nếu đang đau.",
    learner_trap_en: "ਚੋਟ means injury; do not stay quiet because you worry about bothering someone.",
  },
  {
    id: "pa-ca-work-safety-unsafe-002",
    topic: "unsafe_condition",
    situation_vi: "Bạn thấy sàn trơn, dây điện, máy móc, hoặc khu vực có nguy hiểm.",
    situation_en: "You see a slippery floor, cord, machine, or area that may be dangerous.",
    phrase_pa: "ਇੱਥੇ ਸੁਰੱਖਿਆ ਦੀ ਸਮੱਸਿਆ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਵੇਖੋ।",
    romanization: "itthe surakhia di samasya hai. kirpa karke ih vekho.",
    meaning_vi: "Ở đây có vấn đề an toàn. Làm ơn xem chỗ này.",
    meaning_en: "There is a safety problem here. Please look at this.",
    use_vi: "Chỉ vào nguy cơ cụ thể để người khác hiểu nhanh.",
    use_en: "Point to the specific hazard so the other person understands quickly.",
    canada_example_vi: "Dùng trong kho, nhà hàng, xưởng, cửa hàng, hoặc công trường ở Canada.",
    canada_example_en: "Use in a warehouse, restaurant, shop, store, or jobsite in Canada.",
    support_pa: ["ਫਰਸ਼ ਗਿੱਲਾ ਹੈ।", "ਇਹ ਮਸ਼ੀਨ ਠੀਕ ਨਹੀਂ ਲੱਗਦੀ।"],
    learner_trap_vi: "ਸੁਰੱਖਿਆ là an toàn; đừng nói quá chung nếu có thể chỉ đúng nguy cơ.",
    learner_trap_en: "ਸੁਰੱਖਿਆ means safety; do not stay too general if you can point to the hazard.",
  },
  {
    id: "pa-ca-work-safety-ppe-003",
    topic: "ppe_request",
    situation_vi: "Bạn cần găng tay, kính bảo hộ, giày, mask, hoặc thiết bị bảo hộ trước khi làm việc.",
    situation_en: "You need gloves, safety glasses, shoes, a mask, or protective equipment before working.",
    phrase_pa: "ਮੈਨੂੰ ਸੁਰੱਖਿਆ ਵਾਲਾ ਸਾਮਾਨ ਚਾਹੀਦਾ ਹੈ। ਕੀ ਮੈਨੂੰ ਦਸਤਾਨੇ ਮਿਲ ਸਕਦੇ ਹਨ?",
    romanization: "mainu surakhia vala saman chahida hai. ki mainu dastane mil sakde han?",
    meaning_vi: "Tôi cần đồ bảo hộ. Tôi có thể lấy găng tay không?",
    meaning_en: "I need protective equipment. Can I get gloves?",
    use_vi: "Dùng trước khi bắt đầu nhiệm vụ nếu bạn chưa có PPE phù hợp.",
    use_en: "Use before starting a task if you do not have the right PPE.",
    canada_example_vi: "Ở Canada, PPE có thể là gloves, safety glasses, vest, boots, mask, hoặc hearing protection.",
    canada_example_en: "In Canada, PPE may include gloves, safety glasses, a vest, boots, a mask, or hearing protection.",
    support_pa: ["ਕੀ ਮੈਨੂੰ ਐਨਕ ਚਾਹੀਦੀ ਹੈ?", "ਇਸ ਕੰਮ ਲਈ ਕੀ ਪਹਿਨਣਾ ਹੈ?"],
    learner_trap_vi: "ਦਸਤਾਨੇ là găng tay; thay từ này bằng thiết bị bạn thật sự cần.",
    learner_trap_en: "ਦਸਤਾਨੇ means gloves; replace it with the equipment you actually need.",
  },
  {
    id: "pa-ca-work-safety-task-004",
    topic: "task_clarification",
    situation_vi: "Bạn chưa hiểu nhiệm vụ hoặc cách dùng dụng cụ an toàn.",
    situation_en: "You do not understand the task or how to use the tool safely.",
    phrase_pa: "ਮੈਨੂੰ ਇਹ ਕੰਮ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਦਿਖਾਓ।",
    romanization: "mainu ih kam samajh nahin aaya. kirpa karke hauli hauli dikhao.",
    meaning_vi: "Tôi chưa hiểu việc này. Làm ơn chỉ chậm hơn.",
    meaning_en: "I did not understand this task. Please show me slowly.",
    use_vi: "Dùng trước khi tự làm nếu hướng dẫn quá nhanh.",
    use_en: "Use before doing the task alone if instructions were too fast.",
    canada_example_vi: "Hữu ích trong ca đầu, khi đổi station, hoặc khi dùng máy mới ở Canada.",
    canada_example_en: "Useful on a first shift, when changing stations, or when using a new machine in Canada.",
    support_pa: ["ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਦਿਖਾ ਸਕਦੇ ਹੋ?", "ਮੈਂ ਪਹਿਲਾਂ ਵੇਖਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।"],
    learner_trap_vi: "ਸਮਝ ਨਹੀਂ ਆਇਆ là chưa hiểu; câu này tốt hơn là giả vờ đã hiểu.",
    learner_trap_en: "ਸਮਝ ਨਹੀਂ ਆਇਆ means did not understand; this is better than pretending you understood.",
  },
  {
    id: "pa-ca-work-safety-emergency-005",
    topic: "emergency_boundary",
    situation_vi: "Có nguy hiểm ngay lập tức và bạn cần dừng việc hoặc gọi hỗ trợ khẩn cấp.",
    situation_en: "There is immediate danger and you need to stop work or call emergency help.",
    phrase_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਕੰਮ ਰੋਕੋ ਅਤੇ 911 ਤੇ ਕਾਲ ਕਰੋ।",
    romanization: "ih emergency hai. kam roko ate nau-ikk-ikk te call karo.",
    meaning_vi: "Đây là khẩn cấp. Dừng việc và gọi 911.",
    meaning_en: "This is an emergency. Stop work and call 911.",
    use_vi: "Dùng khi có nguy cơ nghiêm trọng, cháy, ngất, chấn thương nặng, hoặc đe dọa ngay.",
    use_en: "Use for serious danger, fire, collapse, major injury, or immediate threat.",
    canada_example_vi: "Ở Canada, dùng 911 cho tình huống khẩn cấp thật sự cần phản ứng ngay.",
    canada_example_en: "In Canada, use 911 for a true emergency that needs immediate response.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਸਭ ਨੂੰ ਦੂਰ ਰੱਖੋ।", "ਮੈਨੂੰ ਤੁਰੰਤ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।"],
    learner_trap_vi: "Đừng dùng câu này cho vấn đề nhỏ; dùng khi thật sự khẩn cấp.",
    learner_trap_en: "Do not use this for a small issue; use it when it is truly urgent.",
  },
  {
    id: "pa-ca-work-safety-supervisor-006",
    topic: "supervisor_conversation",
    situation_vi: "Bạn cần nói với supervisor về an toàn mà vẫn giữ câu ngắn, rõ, lịch sự.",
    situation_en: "You need to speak with a supervisor about safety while staying short, clear, and polite.",
    phrase_pa: "ਕੀ ਮੈਂ ਸੁਪਰਵਾਈਜ਼ਰ ਨਾਲ ਸੁਰੱਖਿਆ ਬਾਰੇ ਗੱਲ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
    romanization: "ki main supervisor nal surakhia bare gall kar sakda/sakdi haan?",
    meaning_vi: "Tôi có thể nói chuyện với supervisor về an toàn không?",
    meaning_en: "Can I speak with the supervisor about safety?",
    use_vi: "Dùng khi bạn cần người có trách nhiệm nghe vấn đề.",
    use_en: "Use when you need the responsible person to hear the issue.",
    canada_example_vi: "Dùng tại nơi làm ở Canada khi coworker không thể giải quyết nguy cơ.",
    canada_example_en: "Use at a Canadian workplace when a coworker cannot resolve the hazard.",
    support_pa: ["ਇਹ ਕੰਮ ਮੈਨੂੰ ਸੁਰੱਖਿਅਤ ਨਹੀਂ ਲੱਗਦਾ।", "ਮੈਨੂੰ ਹੋਰ ਹਦਾਇਤ ਚਾਹੀਦੀ ਹੈ।"],
    learner_trap_vi: "ਗੱਲ ਕਰਨੀ là nói chuyện; giữ trọng tâm vào vấn đề an toàn cụ thể.",
    learner_trap_en: "ਗੱਲ ਕਰਨੀ means to speak; keep the focus on the specific safety issue.",
  },
  {
    id: "pa-ca-work-safety-form-007",
    topic: "incident_form_support",
    situation_vi: "Sau sự cố, bạn được đưa incident form nhưng chưa hiểu phần cần điền.",
    situation_en: "After an incident, you receive an incident form but do not understand the section to fill out.",
    phrase_pa: "ਮੈਨੂੰ ਇਸ ਘਟਨਾ ਫਾਰਮ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਇਹ ਹਿੱਸਾ ਸਮਝ ਨਹੀਂ ਆਇਆ।",
    romanization: "mainu is ghatna form vich madad chahidi hai. ih hissa samajh nahin aaya.",
    meaning_vi: "Tôi cần giúp với mẫu báo cáo sự cố này. Tôi chưa hiểu phần này.",
    meaning_en: "I need help with this incident form. I did not understand this section.",
    use_vi: "Chỉ vào phần chưa rõ và xin giải thích bằng ngôn ngữ đơn giản.",
    use_en: "Point to the unclear section and ask for simple explanation.",
    canada_example_vi: "Ở Canada, dùng khi workplace yêu cầu ghi thời gian, nơi xảy ra, người chứng kiến, hoặc mô tả ngắn.",
    canada_example_en: "In Canada, use when a workplace asks for time, location, witnesses, or a short description.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਸੌਖੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸਮਝਾਓ।", "ਕੀ ਮੈਂ ਇਹ ਲਿਖ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?"],
    learner_trap_vi: "ਘਟਨਾ là sự cố; câu này xin hỗ trợ form, không phải tư vấn pháp lý.",
    learner_trap_en: "ਘਟਨਾ means incident; this asks for form support, not legal advice.",
  },
  {
    id: "pa-ca-work-safety-first-aid-008",
    topic: "first_aid_request",
    situation_vi: "Bạn hoặc đồng nghiệp cần sơ cứu tại nơi làm.",
    situation_en: "You or a coworker needs first aid at work.",
    phrase_pa: "ਕੀ ਇੱਥੇ ਫਸਟ ਏਡ ਵਾਲਾ ਵਿਅਕਤੀ ਹੈ?",
    romanization: "ki itthe first aid vala vyakti hai?",
    meaning_vi: "Ở đây có người phụ trách sơ cứu không?",
    meaning_en: "Is there a first-aid person here?",
    use_vi: "Dùng khi cần người đã được phân công hỗ trợ sơ cứu.",
    use_en: "Use when you need the person assigned to help with first aid.",
    canada_example_vi: "Nhiều workplace ở Canada có first-aid kit, first-aid attendant, hoặc quy trình báo supervisor.",
    canada_example_en: "Many Canadian workplaces have a first-aid kit, first-aid attendant, or supervisor reporting process.",
    support_pa: ["ਮੇਰੇ ਸਿਰ ਨੂੰ ਚੱਕਰ ਆ ਰਹੇ ਹਨ।", "ਕਿਰਪਾ ਕਰਕੇ ਕਿਸੇ ਨੂੰ ਬੁਲਾਓ।"],
    learner_trap_vi: "Nếu tình huống nặng, đừng chỉ hỏi first aid; dùng câu emergency và gọi 911.",
    learner_trap_en: "If the situation is severe, do not only ask for first aid; use the emergency line and call 911.",
  },
  {
    id: "pa-ca-work-safety-training-009",
    topic: "training_question",
    situation_vi: "Bạn chưa được training cho máy, hóa chất, ca nâng hàng, hoặc quy trình mới.",
    situation_en: "You have not been trained for a machine, chemical, lifting task, or new procedure.",
    phrase_pa: "ਮੈਨੂੰ ਇਸ ਕੰਮ ਦੀ ਟ੍ਰੇਨਿੰਗ ਨਹੀਂ ਮਿਲੀ। ਕੀ ਮੈਨੂੰ ਪਹਿਲਾਂ ਟ੍ਰੇਨਿੰਗ ਮਿਲ ਸਕਦੀ ਹੈ?",
    romanization: "mainu is kam di training nahin mili. ki mainu pehlan training mil sakdi hai?",
    meaning_vi: "Tôi chưa được đào tạo cho việc này. Tôi có thể được training trước không?",
    meaning_en: "I have not been trained for this task. Can I get training first?",
    use_vi: "Dùng khi nhiệm vụ mới có rủi ro và bạn chưa biết quy trình.",
    use_en: "Use when a new task has risk and you do not know the procedure.",
    canada_example_vi: "Hữu ích ở warehouse, kitchen, cleaning, construction, hoặc manufacturing job ở Canada.",
    canada_example_en: "Useful in a warehouse, kitchen, cleaning, construction, or manufacturing job in Canada.",
    support_pa: ["ਮੈਨੂੰ ਹਦਾਇਤ ਚਾਹੀਦੀ ਹੈ।", "ਕੀ ਤੁਸੀਂ ਸੁਰੱਖਿਅਤ ਤਰੀਕਾ ਦਿਖਾ ਸਕਦੇ ਹੋ?"],
    learner_trap_vi: "ਟ੍ਰੇਨਿੰਗ là training; nói rõ bạn chưa được training thay vì đoán cách làm.",
    learner_trap_en: "ਟ੍ਰੇਨਿੰਗ means training; say clearly that you have not been trained instead of guessing.",
  },
  {
    id: "pa-ca-work-safety-followup-010",
    topic: "shift_followup",
    situation_vi: "Cuối ca, bạn cần xác nhận bước tiếp theo sau sự cố hoặc vấn đề an toàn.",
    situation_en: "At the end of a shift, you need to confirm the next step after an incident or safety issue.",
    phrase_pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ? ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।",
    romanization: "agla kadam ki hai? kirpa karke ih likh dio.",
    meaning_vi: "Bước tiếp theo là gì? Làm ơn viết ra.",
    meaning_en: "What is the next step? Please write it down.",
    use_vi: "Dùng để xác nhận ai sẽ follow up, khi nào, và bằng cách nào.",
    use_en: "Use to confirm who will follow up, when, and how.",
    canada_example_vi: "Ở Canada, dùng sau khi báo injury, hazard, missing PPE, hoặc incident form.",
    canada_example_en: "In Canada, use after reporting an injury, hazard, missing PPE, or incident form.",
    support_pa: ["ਮੈਨੂੰ ਕਿਸ ਨਾਲ ਸੰਪਰਕ ਕਰਨਾ ਹੈ?", "ਕੀ ਮੈਨੂੰ ਕੱਲ੍ਹ ਵਾਪਸ ਆਉਣਾ ਹੈ?"],
    learner_trap_vi: "ਅਗਲਾ ਕਦਮ là bước tiếp theo; đừng rời ca nếu bạn chưa rõ follow-up.",
    learner_trap_en: "ਅਗਲਾ ਕਦਮ means next step; do not leave the shift if follow-up is unclear.",
  },
];

export default PUNJABI_WORKPLACE_SAFETY_CANADA;
