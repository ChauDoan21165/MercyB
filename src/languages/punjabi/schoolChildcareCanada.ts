// Punjabi Canada school and childcare pack for Vietnamese-speaking and
// English-speaking learners.
//
// Gurmukhi is primary. Romanization is a bridge only. Shahmukhi is awareness
// only, not a full course. Native review is deferred.

export type PunjabiSchoolChildcareCanadaTopic =
  | "absence_notice"
  | "pickup_change"
  | "forms_support"
  | "teacher_meeting"
  | "lunch_note"
  | "allergy_note"
  | "school_bus"
  | "homework_help"
  | "daycare_communication"
  | "interpreter_request";

export type PunjabiSchoolChildcareCanadaItem = {
  id: string;
  topic: PunjabiSchoolChildcareCanadaTopic;
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

export type PunjabiSchoolChildcareCanadaScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  boundary: string;
};

export const PUNJABI_SCHOOL_CHILDCARE_CANADA_SCOPE: PunjabiSchoolChildcareCanadaScope = {
  name: "Punjabi Canada School and Childcare Pack",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundary:
    "Language support for Canadian school and childcare communication about absence, pickup, forms, teacher meetings, lunch and allergy notes, bus questions, homework, daycare updates, and interpreter requests; not legal or medical advice.",
};

export const PUNJABI_SCHOOL_CHILDCARE_CANADA_TOPICS: PunjabiSchoolChildcareCanadaTopic[] = [
  "absence_notice",
  "pickup_change",
  "forms_support",
  "teacher_meeting",
  "lunch_note",
  "allergy_note",
  "school_bus",
  "homework_help",
  "daycare_communication",
  "interpreter_request",
];

export const PUNJABI_SCHOOL_CHILDCARE_CANADA: PunjabiSchoolChildcareCanadaItem[] = [
  {
    id: "pa-ca-school-childcare-absence-001",
    topic: "absence_notice",
    situation_vi: "Con bạn nghỉ học hoặc nghỉ daycare và bạn cần báo lý do ngắn gọn.",
    situation_en: "Your child is absent from school or daycare and you need to give a short reason.",
    phrase_pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ। ਉਹ ਬਿਮਾਰ ਹੈ।",
    romanization: "mera bacha ajj gairhazir hai. oh bimar hai.",
    meaning_vi: "Hôm nay con tôi vắng mặt. Bé bị bệnh.",
    meaning_en: "My child is absent today. They are sick.",
    use_vi: "Dùng khi gọi điện, nhắn app trường, hoặc nói với văn phòng.",
    use_en: "Use when calling, messaging through a school app, or speaking with the office.",
    canada_example_vi: "Ở Canada, school office hoặc daycare thường cần báo absence vào buổi sáng.",
    canada_example_en: "In Canada, a school office or daycare often needs absence notice in the morning.",
    support_pa: ["ਉਹ ਕੱਲ੍ਹ ਵਾਪਸ ਆਵੇਗਾ/ਆਵੇਗੀ।", "ਕਿਰਪਾ ਕਰਕੇ ਅਧਿਆਪਕ ਨੂੰ ਦੱਸ ਦਿਓ।"],
    learner_trap_vi: "ਗੈਰਹਾਜ਼ਰ là vắng mặt; nói ngày cụ thể để tránh nhầm hôm nay/ngày mai.",
    learner_trap_en: "ਗੈਰਹਾਜ਼ਰ means absent; say the exact day to avoid today/tomorrow confusion.",
  },
  {
    id: "pa-ca-school-childcare-pickup-002",
    topic: "pickup_change",
    situation_vi: "Bạn cần báo thay đổi người đón hoặc giờ đón.",
    situation_en: "You need to report a change in pickup person or pickup time.",
    phrase_pa: "ਅੱਜ ਮੇਰੇ ਬੱਚੇ ਨੂੰ ਹੋਰ ਵਿਅਕਤੀ ਲੈਣ ਆਵੇਗਾ/ਆਵੇਗੀ।",
    romanization: "ajj mere bache nu hor vyakti lain aavega/aavegi.",
    meaning_vi: "Hôm nay một người khác sẽ đến đón con tôi.",
    meaning_en: "Today another person will pick up my child.",
    use_vi: "Dùng để báo trước cho school office, teacher, hoặc daycare staff.",
    use_en: "Use to notify the school office, teacher, or daycare staff in advance.",
    canada_example_vi: "Ở Canada, nơi học có thể cần tên người đón và ID khi pickup.",
    canada_example_en: "In Canada, the school or centre may need the pickup person's name and ID.",
    support_pa: ["ਉਸਦਾ ਨਾਮ ਇਹ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਇਸਨੂੰ ਨੋਟ ਕਰ ਲਵੋ।"],
    learner_trap_vi: "ਲੈਣ ਆਉਣਾ là đến đón; đừng thay đổi pickup mà không báo trước.",
    learner_trap_en: "ਲੈਣ ਆਉਣਾ means to pick up; do not change pickup without notice.",
  },
  {
    id: "pa-ca-school-childcare-forms-003",
    topic: "forms_support",
    situation_vi: "Trường hoặc daycare gửi form và bạn chưa hiểu phần phải điền.",
    situation_en: "The school or daycare sends a form and you do not understand the section to fill out.",
    phrase_pa: "ਮੈਨੂੰ ਇਸ ਫਾਰਮ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਇਹ ਹਿੱਸਾ ਸਮਝ ਨਹੀਂ ਆਇਆ।",
    romanization: "mainu is form vich madad chahidi hai. ih hissa samajh nahin aaya.",
    meaning_vi: "Tôi cần giúp với mẫu đơn này. Tôi chưa hiểu phần này.",
    meaning_en: "I need help with this form. I did not understand this section.",
    use_vi: "Chỉ vào đúng phần trên form thay vì hỏi quá chung.",
    use_en: "Point to the exact section on the form instead of asking too generally.",
    canada_example_vi: "Dùng cho permission form, emergency contact, field trip, hoặc registration form ở Canada.",
    canada_example_en: "Use for a permission form, emergency contact, field trip, or registration form in Canada.",
    support_pa: ["ਕੀ ਇਹ ਲਾਜ਼ਮੀ ਹੈ?", "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਸੌਖੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸਮਝਾਓ।"],
    learner_trap_vi: "ਲਾਜ਼ਮੀ là bắt buộc; đừng ký nếu phần bắt buộc còn chưa rõ.",
    learner_trap_en: "ਲਾਜ਼ਮੀ means required; do not sign if a required section is unclear.",
  },
  {
    id: "pa-ca-school-childcare-meeting-004",
    topic: "teacher_meeting",
    situation_vi: "Bạn muốn đặt lịch nói chuyện với giáo viên về việc học hoặc hành vi của con.",
    situation_en: "You want to book a time to speak with the teacher about learning or behaviour.",
    phrase_pa: "ਕੀ ਮੈਂ ਅਧਿਆਪਕ ਨਾਲ ਮੀਟਿੰਗ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
    romanization: "ki main adhiapak nal meeting kar sakda/sakdi haan?",
    meaning_vi: "Tôi có thể gặp giáo viên để trao đổi không?",
    meaning_en: "Can I have a meeting with the teacher?",
    use_vi: "Dùng khi muốn có cuộc hẹn thay vì nói vội ở cửa lớp.",
    use_en: "Use when you want an appointment instead of a rushed doorway conversation.",
    canada_example_vi: "Ở Canada, parent-teacher meeting có thể qua trực tiếp, phone, hoặc video.",
    canada_example_en: "In Canada, a parent-teacher meeting may be in person, by phone, or by video.",
    support_pa: ["ਮੈਨੂੰ ਆਪਣੇ ਬੱਚੇ ਦੀ ਪੜ੍ਹਾਈ ਬਾਰੇ ਗੱਲ ਕਰਨੀ ਹੈ।", "ਕਿਹੜਾ ਸਮਾਂ ਠੀਕ ਹੈ?"],
    learner_trap_vi: "ਅਧਿਆਪਕ là giáo viên; nói mục tiêu ngắn trước khi giải thích chi tiết.",
    learner_trap_en: "ਅਧਿਆਪਕ means teacher; state the goal briefly before detailed explanation.",
  },
  {
    id: "pa-ca-school-childcare-lunch-005",
    topic: "lunch_note",
    situation_vi: "Bạn cần gửi ghi chú về đồ ăn trưa hoặc xin nhắc con ăn lunch.",
    situation_en: "You need to send a note about lunch or ask staff to remind your child to eat.",
    phrase_pa: "ਮੇਰੇ ਬੱਚੇ ਕੋਲ ਅੱਜ ਦੁਪਹਿਰ ਦਾ ਖਾਣਾ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਉਸਨੂੰ ਯਾਦ ਦਿਵਾਓ।",
    romanization: "mere bache kol ajj dupahir da khana hai. kirpa karke usnu yaad divao.",
    meaning_vi: "Hôm nay con tôi có bữa trưa. Làm ơn nhắc bé.",
    meaning_en: "My child has lunch today. Please remind them.",
    use_vi: "Dùng trong note cho teacher, lunch supervisor, hoặc daycare staff.",
    use_en: "Use in a note to a teacher, lunch supervisor, or daycare staff.",
    canada_example_vi: "Hữu ích khi trường Canada yêu cầu packed lunch, snack, hoặc lunch program.",
    canada_example_en: "Useful when a Canadian school uses packed lunch, snacks, or a lunch program.",
    support_pa: ["ਇਹ ਉਸਦਾ ਸਨੈਕ ਹੈ।", "ਉਸਨੂੰ ਪਾਣੀ ਪੀਣ ਲਈ ਕਹੋ।"],
    learner_trap_vi: "ਖਾਣਾ là đồ ăn/bữa ăn; ghi rõ lunch hay snack để khỏi nhầm.",
    learner_trap_en: "ਖਾਣਾ means food or meal; specify lunch or snack to avoid confusion.",
  },
  {
    id: "pa-ca-school-childcare-allergy-006",
    topic: "allergy_note",
    situation_vi: "Bạn cần báo dị ứng cho trường hoặc daycare bằng câu rõ nhưng không đưa lời khuyên y tế.",
    situation_en: "You need to report an allergy to school or daycare clearly without giving medical advice.",
    phrase_pa: "ਮੇਰੇ ਬੱਚੇ ਨੂੰ ਮੂੰਗਫਲੀ ਤੋਂ ਐਲਰਜੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਨੋਟ ਕਰ ਲਵੋ।",
    romanization: "mere bache nu mungfali ton allergy hai. kirpa karke ih note kar lavo.",
    meaning_vi: "Con tôi dị ứng với đậu phộng. Làm ơn ghi chú lại.",
    meaning_en: "My child is allergic to peanuts. Please note this.",
    use_vi: "Thay tên dị ứng cho đúng với con bạn và xin ghi nhận bằng văn bản.",
    use_en: "Replace the allergy name with your child's actual allergy and ask for it to be recorded.",
    canada_example_vi: "Ở Canada, school và daycare có thể có allergy form hoặc food-safety policy.",
    canada_example_en: "In Canada, schools and daycares may have an allergy form or food-safety policy.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਅਧਿਆਪਕ ਨੂੰ ਦੱਸੋ।", "ਕੀ ਕੋਈ ਫਾਰਮ ਭਰਨਾ ਹੈ?"],
    learner_trap_vi: "ਐਲਰਜੀ là dị ứng; câu này chỉ báo thông tin, không phải hướng dẫn y tế.",
    learner_trap_en: "ਐਲਰਜੀ means allergy; this reports information and is not medical advice.",
  },
  {
    id: "pa-ca-school-childcare-bus-007",
    topic: "school_bus",
    situation_vi: "Bạn cần hỏi bus trường, điểm đón, giờ đón, hoặc con bị lỡ bus.",
    situation_en: "You need to ask about the school bus, stop, pickup time, or a missed bus.",
    phrase_pa: "ਸਕੂਲ ਬੱਸ ਕਿੱਥੇ ਰੁਕਦੀ ਹੈ ਅਤੇ ਕਦੋਂ ਆਉਂਦੀ ਹੈ?",
    romanization: "school bus kithe rukdi hai ate kadon aundi hai?",
    meaning_vi: "Xe bus trường dừng ở đâu và đến lúc nào?",
    meaning_en: "Where does the school bus stop and when does it come?",
    use_vi: "Dùng với school office, bus coordinator, hoặc childcare staff.",
    use_en: "Use with the school office, bus coordinator, or childcare staff.",
    canada_example_vi: "Ở Canada, bus có thể có route number, stop location, và pickup window.",
    canada_example_en: "In Canada, a bus may have a route number, stop location, and pickup window.",
    support_pa: ["ਮੇਰਾ ਬੱਚਾ ਬੱਸ ਮਿਸ ਕਰ ਗਿਆ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਰੂਟ ਨੰਬਰ ਲਿਖ ਦਿਓ।"],
    learner_trap_vi: "ਕਿੱਥੇ và ਕਦੋਂ là ở đâu và khi nào; hỏi cả hai để tránh nhầm điểm đón.",
    learner_trap_en: "ਕਿੱਥੇ and ਕਦੋਂ mean where and when; ask both to avoid stop confusion.",
  },
  {
    id: "pa-ca-school-childcare-homework-008",
    topic: "homework_help",
    situation_vi: "Bạn hoặc con chưa hiểu bài tập về nhà và cần hỏi rõ bước tiếp theo.",
    situation_en: "You or your child do not understand the homework and need to ask for the next step.",
    phrase_pa: "ਸਾਨੂੰ ਹੋਮਵਰਕ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕੀ ਤੁਸੀਂ ਉਦਾਹਰਨ ਦੇ ਸਕਦੇ ਹੋ?",
    romanization: "sanu homework samajh nahin aaya. ki tusin udaharan de sakde ho?",
    meaning_vi: "Chúng tôi chưa hiểu bài tập. Bạn có thể cho ví dụ không?",
    meaning_en: "We did not understand the homework. Can you give an example?",
    use_vi: "Dùng trong email, app trường, hoặc khi nói với teacher.",
    use_en: "Use in email, a school app, or when speaking with the teacher.",
    canada_example_vi: "Hữu ích khi bài tập dùng Google Classroom, agenda, hoặc worksheet ở Canada.",
    canada_example_en: "Useful when homework is in Google Classroom, an agenda, or a worksheet in Canada.",
    support_pa: ["ਕਿਹੜਾ ਪੰਨਾ ਕਰਨਾ ਹੈ?", "ਕਦੋਂ ਜਮ੍ਹਾਂ ਕਰਨਾ ਹੈ?"],
    learner_trap_vi: "ਉਦਾਹਰਨ là ví dụ; xin ví dụ cụ thể thay vì nói con không biết gì.",
    learner_trap_en: "ਉਦਾਹਰਨ means example; ask for a specific example instead of saying the child knows nothing.",
  },
  {
    id: "pa-ca-school-childcare-daycare-009",
    topic: "daycare_communication",
    situation_vi: "Bạn cần trao đổi nhanh với daycare về ngủ, ăn, đồ thay, hoặc lịch hôm nay.",
    situation_en: "You need a quick daycare update about sleep, food, extra clothes, or today's schedule.",
    phrase_pa: "ਅੱਜ ਮੇਰੇ ਬੱਚੇ ਦਾ ਦਿਨ ਕਿਵੇਂ ਸੀ?",
    romanization: "ajj mere bache da din kiven si?",
    meaning_vi: "Hôm nay ngày của con tôi thế nào?",
    meaning_en: "How was my child's day today?",
    use_vi: "Dùng khi pickup ở daycare để hỏi cập nhật ngắn.",
    use_en: "Use at daycare pickup to ask for a short update.",
    canada_example_vi: "Ở Canada, daycare staff có thể nói về nap, snack, diaper, bathroom, hoặc behaviour.",
    canada_example_en: "In Canada, daycare staff may mention nap, snack, diaper, bathroom, or behaviour.",
    support_pa: ["ਕੀ ਉਸਨੇ ਖਾਣਾ ਖਾਧਾ?", "ਕੀ ਮੈਨੂੰ ਕੱਲ੍ਹ ਕੁਝ ਲਿਆਉਣਾ ਹੈ?"],
    learner_trap_vi: "ਕਿਵੇਂ ਸੀ là thế nào; nếu cần chi tiết, hỏi thêm về ăn/ngủ/đồ cần mang.",
    learner_trap_en: "ਕਿਵੇਂ ਸੀ means how was it; ask follow-ups about food, sleep, or items to bring.",
  },
  {
    id: "pa-ca-school-childcare-interpreter-010",
    topic: "interpreter_request",
    situation_vi: "Cuộc họp hoặc form quan trọng và bạn cần thông dịch viên.",
    situation_en: "A meeting or form is important and you need an interpreter.",
    phrase_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਆ ਚਾਹੀਦਾ ਹੈ। ਕੀ ਪੰਜਾਬੀ ਦੁਭਾਸ਼ੀਆ ਮਿਲ ਸਕਦਾ ਹੈ?",
    romanization: "mainu dubhashia chahida hai. ki Punjabi dubhashia mil sakda hai?",
    meaning_vi: "Tôi cần thông dịch viên. Có thể có thông dịch viên Punjabi không?",
    meaning_en: "I need an interpreter. Is a Punjabi interpreter available?",
    use_vi: "Dùng trước cuộc họp giáo viên, registration, hoặc daycare meeting quan trọng.",
    use_en: "Use before an important teacher meeting, registration, or daycare meeting.",
    canada_example_vi: "Một số school board hoặc childcare service ở Canada có thể sắp xếp interpreter.",
    canada_example_en: "Some Canadian school boards or childcare services may arrange an interpreter.",
    support_pa: ["ਮੈਨੂੰ ਪੂਰੀ ਗੱਲ ਸਮਝਣੀ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਦੱਸ ਦਿਓ।"],
    learner_trap_vi: "ਦੁਭਾਸ਼ੀਆ là thông dịch viên; yêu cầu này chỉ hỗ trợ ngôn ngữ, không phải tư vấn pháp lý.",
    learner_trap_en: "ਦੁਭਾਸ਼ੀਆ means interpreter; this is language support, not legal advice.",
  },
];

export default PUNJABI_SCHOOL_CHILDCARE_CANADA;
