// Punjabi Canada forms and service desk pack for Vietnamese-speaking and
// English-speaking learners.
//
// This is content readiness data only. It is not A11 integration.
// Gurmukhi is primary. Romanization is a bridge only. Shahmukhi is awareness
// only, not a full course. Native review is deferred.

export type PunjabiCanadaFormsServiceDeskDomain =
  | "id"
  | "address"
  | "phone"
  | "appointment"
  | "missing_paper"
  | "interpreter_request"
  | "service_number"
  | "waiting"
  | "correction_request"
  | "polite_follow_up"
  | "review_remediation";

export type PunjabiCanadaFormsServiceDeskStage =
  | "first_contact"
  | "clarify"
  | "repair"
  | "follow_up"
  | "readiness";

export type PunjabiCanadaFormsServiceDeskItem = {
  id: string;
  domain: PunjabiCanadaFormsServiceDeskDomain;
  stage: PunjabiCanadaFormsServiceDeskStage;
  phrase_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  canada_context_vi: string;
  canada_context_en: string;
  desk_action_vi: string;
  desk_action_en: string;
  boundary_vi: string;
  boundary_en: string;
  support_pa: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiCanadaFormsServiceDeskScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  serviceBoundary: string;
};

export const PUNJABI_CANADA_FORMS_SERVICE_DESK_SCOPE: PunjabiCanadaFormsServiceDeskScope = {
  name: "Punjabi Canada Forms and Service Desk Pack",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  serviceBoundary:
    "Canada service-desk and form communication for ID, address, phone, appointments, missing papers, interpreter requests, service numbers, waiting, corrections, and polite follow-up; not legal advice and not a substitute for official instructions.",
};

export const PUNJABI_CANADA_FORMS_SERVICE_DESK_DOMAINS: PunjabiCanadaFormsServiceDeskDomain[] = [
  "id",
  "address",
  "phone",
  "appointment",
  "missing_paper",
  "interpreter_request",
  "service_number",
  "waiting",
  "correction_request",
  "polite_follow_up",
  "review_remediation",
];

export const PUNJABI_CANADA_FORMS_SERVICE_DESK_PACK: PunjabiCanadaFormsServiceDeskItem[] = [
  {
    id: "pa-ca-forms-desk-id-001",
    domain: "id",
    stage: "first_contact",
    phrase_pa: "ਮੇਰੇ ਕੋਲ ਇਹ ਪਛਾਣ ਪੱਤਰ ਹੈ। ਕੀ ਇਹ ਕਾਫ਼ੀ ਹੈ?",
    romanization: "mere kol ih pachhan pattar hai. ki ih kafi hai?",
    meaning_vi: "Tôi có giấy tờ tùy thân này. Nó có đủ không?",
    meaning_en: "I have this ID document. Is it enough?",
    canada_context_vi:
      "Ở Canada, dùng tại service desk, clinic, bank desk, library, school office, hoặc newcomer service khi họ yêu cầu ID.",
    canada_context_en:
      "In Canada, use at a service desk, clinic, bank desk, library, school office, or newcomer service when ID is requested.",
    desk_action_vi: "Đưa ID đang có, hỏi giấy nào được chấp nhận, và xin danh sách viết ra.",
    desk_action_en: "Show the ID you have, ask which documents are accepted, and request the list in writing.",
    boundary_vi: "Câu này chỉ hỏi yêu cầu giấy tờ; không phải tư vấn pháp lý hoặc immigration.",
    boundary_en: "This only asks document requirements; it is not legal or immigration advice.",
    support_pa: ["ਕੀ ਤੁਹਾਨੂੰ ਹੋਰ ਪਛਾਣ ਚਾਹੀਦੀ ਹੈ?", "ਕਿਰਪਾ ਕਰਕੇ ਸੂਚੀ ਲਿਖ ਦਿਓ।"],
    learner_trap_vi: "Đừng nói có ID nếu bạn chưa biết loại ID họ cần.",
    learner_trap_en: "Do not say you have ID before you know which ID type they need.",
  },
  {
    id: "pa-ca-forms-desk-address-002",
    domain: "address",
    stage: "clarify",
    phrase_pa: "ਮੇਰਾ ਪਤਾ ਇਹ ਹੈ। ਕੀ ਮੈਨੂੰ ਪਤੇ ਦਾ ਸਬੂਤ ਚਾਹੀਦਾ ਹੈ?",
    romanization: "mera pata ih hai. ki mainu pate da sabut chahida hai?",
    meaning_vi: "Địa chỉ của tôi là đây. Tôi có cần proof of address không?",
    meaning_en: "This is my address. Do I need proof of address?",
    canada_context_vi:
      "Dùng khi form hỏi current address, mailing address, postal code, lease, utility bill, hoặc bank statement.",
    canada_context_en:
      "Use when a form asks for current address, mailing address, postal code, lease, utility bill, or bank statement.",
    desk_action_vi: "Xác nhận street number, unit, city, province, postal code, và loại proof được chấp nhận.",
    desk_action_en: "Confirm street number, unit, city, province, postal code, and accepted proof type.",
    boundary_vi: "Không tự chỉnh giấy tờ chính thức nếu address không khớp; xin hướng dẫn từ desk.",
    boundary_en: "Do not alter official documents if the address does not match; ask the desk for instructions.",
    support_pa: ["ਯੂਨਿਟ ਨੰਬਰ ਇਹ ਹੈ।", "ਮੇਲਿੰਗ ਪਤਾ ਵੱਖਰਾ ਹੈ।"],
    learner_trap_vi: "Đừng bỏ unit hoặc basement suite number khi điền form Canada.",
    learner_trap_en: "Do not skip the unit or basement suite number on Canadian forms.",
  },
  {
    id: "pa-ca-forms-desk-phone-003",
    domain: "phone",
    stage: "clarify",
    phrase_pa: "ਮੇਰਾ ਫੋਨ ਨੰਬਰ ਇਹ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਨੰਬਰ ਦੁਬਾਰਾ ਪੜ੍ਹੋ।",
    romanization: "mera phone number ih hai. kirpa karke number dubara parho.",
    meaning_vi: "Số điện thoại của tôi là đây. Làm ơn đọc lại số.",
    meaning_en: "This is my phone number. Please read the number back.",
    canada_context_vi:
      "Dùng khi đăng ký appointment, callback, pharmacy pickup, school contact, hoặc service desk queue.",
    canada_context_en:
      "Use when registering for an appointment, callback, pharmacy pickup, school contact, or service desk queue.",
    desk_action_vi: "Đọc chậm từng nhóm số và xác nhận voicemail hoặc text có dùng được không.",
    desk_action_en: "Read digits slowly in groups and confirm whether voicemail or text is okay.",
    boundary_vi: "Không chia sẻ mã xác minh hoặc thông tin nhạy cảm chỉ vì ai đó gọi lại.",
    boundary_en: "Do not share verification codes or sensitive information just because someone calls back.",
    support_pa: ["ਕੀ ਤੁਸੀਂ ਮੈਨੂੰ ਟੈਕਸਟ ਕਰ ਸਕਦੇ ਹੋ?", "ਵੌਇਸਮੇਲ ਠੀਕ ਹੈ।"],
    learner_trap_vi: "Đừng đọc số quá nhanh; sai một digit có thể mất appointment.",
    learner_trap_en: "Do not read the number too fast; one wrong digit can lose an appointment.",
  },
  {
    id: "pa-ca-forms-desk-appointment-004",
    domain: "appointment",
    stage: "first_contact",
    phrase_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਦੋਂ ਹੈ? ਕਿਰਪਾ ਕਰਕੇ ਤਾਰੀਖ ਅਤੇ ਸਮਾਂ ਲਿਖ ਦਿਓ।",
    romanization: "meri appointment kadon hai? kirpa karke tarikh ate sama likh dio.",
    meaning_vi: "Lịch hẹn của tôi khi nào? Làm ơn viết ngày và giờ ra.",
    meaning_en: "When is my appointment? Please write down the date and time.",
    canada_context_vi:
      "Ở Canada, dùng tại clinic, settlement office, school office, public service counter, hoặc bank appointment.",
    canada_context_en:
      "In Canada, use at a clinic, settlement office, school office, public service counter, or bank appointment.",
    desk_action_vi: "Xác nhận timezone nếu cần, địa điểm, giấy tờ phải mang, và cách đổi lịch.",
    desk_action_en: "Confirm timezone if needed, location, documents to bring, and how to reschedule.",
    boundary_vi: "Câu này hỗ trợ logistics; không quyết định eligibility hoặc kết quả hồ sơ.",
    boundary_en: "This supports logistics; it does not decide eligibility or case outcome.",
    support_pa: ["ਮੈਨੂੰ ਕਿੱਥੇ ਜਾਣਾ ਹੈ?", "ਜੇ ਮੈਂ ਦੇਰ ਨਾਲ ਆਵਾਂ ਤਾਂ ਕੀ ਕਰਨਾ ਹੈ?"],
    learner_trap_vi: "Đừng chỉ ghi giờ; cần ngày, địa điểm, và giấy tờ cần mang.",
    learner_trap_en: "Do not only write the time; get the date, place, and documents to bring.",
  },
  {
    id: "pa-ca-forms-desk-missing-paper-005",
    domain: "missing_paper",
    stage: "repair",
    phrase_pa: "ਮੇਰੇ ਕੋਲ ਇੱਕ ਕਾਗਜ਼ ਨਹੀਂ ਹੈ। ਮੈਂ ਕੀ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
    romanization: "mere kol ikk kagaz nahi hai. main ki kar sakda/sakdi han?",
    meaning_vi: "Tôi thiếu một giấy tờ. Tôi có thể làm gì?",
    meaning_en: "I am missing one paper. What can I do?",
    canada_context_vi:
      "Dùng khi thiếu proof of address, ID copy, consent form, immunization paper, bank letter, hoặc application page.",
    canada_context_en:
      "Use when missing proof of address, an ID copy, consent form, immunization paper, bank letter, or application page.",
    desk_action_vi: "Hỏi có thể nộp sau, upload, photo, photocopy, hoặc reschedule không.",
    desk_action_en: "Ask whether you can submit later, upload, photograph, photocopy, or reschedule.",
    boundary_vi: "Không giả mạo hoặc tự sửa giấy tờ; hỏi quy trình chính thức.",
    boundary_en: "Do not fake or alter documents; ask for the official process.",
    support_pa: ["ਕੀ ਮੈਂ ਇਹ ਬਾਅਦ ਵਿੱਚ ਦੇ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?", "ਕਿਰਪਾ ਕਰਕੇ ਵਿਕਲਪ ਲਿਖ ਦਿਓ।"],
    learner_trap_vi: "Đừng rời desk nếu chưa biết thiếu giấy nào và deadline nào.",
    learner_trap_en: "Do not leave the desk before knowing which paper is missing and the deadline.",
  },
  {
    id: "pa-ca-forms-desk-interpreter-006",
    domain: "interpreter_request",
    stage: "repair",
    phrase_pa: "ਮੈਨੂੰ ਪੰਜਾਬੀ ਦੁਭਾਸ਼ੀਆ ਚਾਹੀਦਾ ਹੈ। ਫਾਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ।",
    romanization: "mainu Punjabi dubhashia chahida hai. form mahatvapuran hai.",
    meaning_vi: "Tôi cần thông dịch viên tiếng Punjabi. Mẫu đơn này quan trọng.",
    meaning_en: "I need a Punjabi interpreter. The form is important.",
    canada_context_vi:
      "Dùng tại public office, clinic, school office, housing service, hoặc settlement service khi form có rủi ro.",
    canada_context_en:
      "Use at a public office, clinic, school office, housing service, or settlement service when a form carries risk.",
    desk_action_vi: "Hỏi interpreter có sẵn không, cần đặt appointment không, và có thể nhận bản viết không.",
    desk_action_en: "Ask whether an interpreter is available, whether you need an appointment, and whether written information is possible.",
    boundary_vi: "Interpreter request không thay thế lời giải thích chính thức từ agency hoặc professional.",
    boundary_en: "An interpreter request does not replace official explanations from an agency or professional.",
    support_pa: ["ਕੀ ਦੁਭਾਸ਼ੀਆ ਹੁਣ ਮਿਲ ਸਕਦਾ ਹੈ?", "ਕੀ ਮੈਨੂੰ ਨਵੀਂ ਅਪਾਇੰਟਮੈਂਟ ਲੈਣੀ ਪਵੇਗੀ?"],
    learner_trap_vi: "Đừng ký form quan trọng chỉ vì muốn kết thúc nhanh.",
    learner_trap_en: "Do not sign an important form just to finish quickly.",
  },
  {
    id: "pa-ca-forms-desk-service-number-007",
    domain: "service_number",
    stage: "clarify",
    phrase_pa: "ਮੇਰਾ ਸਰਵਿਸ ਨੰਬਰ ਕੀ ਹੈ? ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।",
    romanization: "mera service number ki hai? kirpa karke ih likh dio.",
    meaning_vi: "Số hồ sơ/dịch vụ của tôi là gì? Làm ơn viết nó ra.",
    meaning_en: "What is my service number? Please write it down.",
    canada_context_vi:
      "Ở Canada, dùng khi nhận ticket number, case number, reference number, client ID, hoặc file number.",
    canada_context_en:
      "In Canada, use when receiving a ticket number, case number, reference number, client ID, or file number.",
    desk_action_vi: "Ghi số, tên agency, ngày, và cách dùng số đó khi follow-up.",
    desk_action_en: "Record the number, agency name, date, and how to use it for follow-up.",
    boundary_vi: "Service number là để tra cứu; không nói lên hồ sơ đã được chấp thuận.",
    boundary_en: "A service number is for lookup; it does not mean an application is approved.",
    support_pa: ["ਕੀ ਇਹ ਰੈਫਰੈਂਸ ਨੰਬਰ ਹੈ?", "ਇਸ ਨੰਬਰ ਨਾਲ ਮੈਂ ਕਦੋਂ ਪੁੱਛ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?"],
    learner_trap_vi: "Đừng trộn service number với phone number hoặc appointment time.",
    learner_trap_en: "Do not confuse a service number with a phone number or appointment time.",
  },
  {
    id: "pa-ca-forms-desk-waiting-008",
    domain: "waiting",
    stage: "follow_up",
    phrase_pa: "ਮੈਨੂੰ ਕਿੰਨਾ ਇੰਤਜ਼ਾਰ ਕਰਨਾ ਪਵੇਗਾ? ਕੀ ਮੇਰਾ ਨਾਮ ਬੁਲਾਇਆ ਜਾਵੇਗਾ?",
    romanization: "mainu kinna intzar karna pavega? ki mera nam bulaia javega?",
    meaning_vi: "Tôi phải chờ bao lâu? Tên tôi sẽ được gọi không?",
    meaning_en: "How long do I need to wait? Will my name be called?",
    canada_context_vi:
      "Dùng ở waiting room, public office queue, lab, clinic, pharmacy, bank desk, hoặc newcomer service.",
    canada_context_en:
      "Use in a waiting room, public office queue, lab, clinic, pharmacy, bank desk, or newcomer service.",
    desk_action_vi: "Xác nhận queue system: ticket, text message, name call, screen number, hoặc return time.",
    desk_action_en: "Confirm the queue system: ticket, text message, name call, screen number, or return time.",
    boundary_vi: "Câu này không yêu cầu ưu tiên; nó chỉ hỏi quy trình chờ.",
    boundary_en: "This does not demand priority; it only asks about the waiting process.",
    support_pa: ["ਕੀ ਮੈਨੂੰ ਇੱਥੇ ਰਹਿਣਾ ਹੈ?", "ਜੇ ਮੈਂ ਬਾਹਰ ਜਾਵਾਂ ਤਾਂ ਕੀ ਹੋਵੇਗਾ?"],
    learner_trap_vi: "Đừng ra ngoài nếu bạn chưa biết họ gọi bằng tên, số, hay text.",
    learner_trap_en: "Do not step outside before knowing whether they call by name, number, or text.",
  },
  {
    id: "pa-ca-forms-desk-correction-009",
    domain: "correction_request",
    stage: "repair",
    phrase_pa: "ਇਸ ਫਾਰਮ ਵਿੱਚ ਗਲਤੀ ਹੈ। ਕੀ ਮੈਂ ਇਸ ਨੂੰ ਠੀਕ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
    romanization: "is form vich galti hai. ki main is nu thik kar sakda/sakdi han?",
    meaning_vi: "Có lỗi trong form này. Tôi có thể sửa nó không?",
    meaning_en: "There is a mistake on this form. Can I correct it?",
    canada_context_vi:
      "Dùng khi tên, ngày sinh, address, phone, appointment date, hoặc document number bị sai.",
    canada_context_en:
      "Use when a name, date of birth, address, phone, appointment date, or document number is wrong.",
    desk_action_vi: "Chỉ ra dòng sai, hỏi cách sửa chính thức, và xin staff initial nếu họ yêu cầu.",
    desk_action_en: "Point to the wrong line, ask the official correction method, and ask for staff initials if required.",
    boundary_vi: "Không tự xóa hoặc sửa form chính thức nếu desk yêu cầu quy trình khác.",
    boundary_en: "Do not erase or alter an official form if the desk requires another process.",
    support_pa: ["ਇੱਥੇ ਗਲਤ ਲਿਖਿਆ ਹੈ।", "ਸਹੀ ਜਾਣਕਾਰੀ ਇਹ ਹੈ।"],
    learner_trap_vi: "Đừng che lỗi bằng cách viết đè lên nếu form có quy định sửa lỗi.",
    learner_trap_en: "Do not cover an error by writing over it if the form has correction rules.",
  },
  {
    id: "pa-ca-forms-desk-follow-up-010",
    domain: "polite_follow_up",
    stage: "follow_up",
    phrase_pa: "ਮੈਂ ਨਿਮਰਤਾ ਨਾਲ ਪੁੱਛਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ: ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?",
    romanization: "main nimrata nal puchhna chahunda/chahundi han: agla kadam ki hai?",
    meaning_vi: "Tôi muốn hỏi lịch sự: bước tiếp theo là gì?",
    meaning_en: "I would like to ask politely: what is the next step?",
    canada_context_vi:
      "Dùng sau khi nộp form, chờ callback, gửi email, hoặc quay lại service desk với reference number.",
    canada_context_en:
      "Use after submitting a form, waiting for a callback, sending email, or returning to a service desk with a reference number.",
    desk_action_vi: "Đưa service number, ngày đã nộp, và hỏi timeframe hoặc kênh follow-up.",
    desk_action_en: "Give the service number, submission date, and ask about timeframe or follow-up channel.",
    boundary_vi: "Câu này không gây áp lực kết quả; nó hỏi quy trình và thời gian dự kiến.",
    boundary_en: "This does not pressure for an outcome; it asks for process and expected timing.",
    support_pa: ["ਮੇਰਾ ਰੈਫਰੈਂਸ ਨੰਬਰ ਇਹ ਹੈ।", "ਮੈਂ ਕਦੋਂ ਦੁਬਾਰਾ ਪੁੱਛ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?"],
    learner_trap_vi: "Đừng follow-up mà không có reference number hoặc ngày nộp nếu bạn có chúng.",
    learner_trap_en: "Do not follow up without the reference number or submission date if you have them.",
  },
  {
    id: "pa-ca-forms-desk-review-011",
    domain: "review_remediation",
    stage: "readiness",
    phrase_pa: "ਮੈਂ ਚੈੱਕ ਕਰਨਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ: ਪਛਾਣ, ਪਤਾ, ਫੋਨ, ਅਤੇ ਅਗਲਾ ਕਦਮ ਠੀਕ ਹਨ?",
    romanization:
      "main check karna chahunda/chahundi han: pachhan, pata, phone, ate agla kadam thik han?",
    meaning_vi:
      "Tôi muốn kiểm tra lại: ID, địa chỉ, điện thoại, và bước tiếp theo đã đúng chưa?",
    meaning_en: "I want to check: are the ID, address, phone, and next step correct?",
    canada_context_vi:
      "Dùng như câu final-quality trước khi rời desk ở clinic, public office, bank, school, housing, hoặc settlement service.",
    canada_context_en:
      "Use as a final-quality line before leaving a clinic, public office, bank, school, housing, or settlement service desk.",
    desk_action_vi: "Review bốn điểm: giấy tờ, contact, deadline/appointment, và người hoặc kênh follow-up.",
    desk_action_en: "Review four points: documents, contact, deadline/appointment, and follow-up person or channel.",
    boundary_vi: "Đây là kiểm tra giao tiếp và readiness, không xác nhận quyền lợi hoặc kết quả pháp lý.",
    boundary_en: "This is communication and readiness checking, not confirmation of entitlement or legal outcome.",
    support_pa: ["ਕੀ ਸਭ ਕੁਝ ਪੂਰਾ ਹੈ?", "ਕੀ ਮੈਨੂੰ ਹੋਰ ਕੁਝ ਲਿਆਉਣਾ ਹੈ?"],
    learner_trap_vi: "Đừng rời khỏi quầy chỉ với cảm giác 'chắc là xong' nếu chưa biết bước tiếp theo.",
    learner_trap_en: "Do not leave the desk with only a sense that it is probably done if the next step is unclear.",
  },
];

export default PUNJABI_CANADA_FORMS_SERVICE_DESK_PACK;
