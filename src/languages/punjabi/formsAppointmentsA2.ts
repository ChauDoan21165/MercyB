// src/languages/punjabi/formsAppointmentsA2.ts
//
// Punjabi A2 forms and appointments pack for Vietnamese-speaking and
// English-speaking learners. Gurmukhi is primary. Romanization is a practical
// reading aid, not a phonetic standard. Shahmukhi is mentioned only for
// awareness; this is not a Shahmukhi course. Native review is deferred.

export type PunjabiFormsAppointmentsA2Topic =
  | "name"
  | "address"
  | "date_time"
  | "rescheduling"
  | "missing_document"
  | "interpreter_request"
  | "clinic_appointment"
  | "school_appointment"
  | "public_service_appointment"
  | "polite_confirmation";

export type PunjabiFormsAppointmentsA2Mode =
  | "final_quality"
  | "review"
  | "remediation"
  | "readiness";

export type PunjabiFormsAppointmentsA2Phrase = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
  note_vi: string;
  note_en: string;
};

export type PunjabiFormsAppointmentsA2Trap = {
  trap_vi: string;
  trap_en: string;
  better_pa: string;
  better_romanization: string;
};

export type PunjabiFormsAppointmentsA2Item = {
  id: string;
  topic: PunjabiFormsAppointmentsA2Topic;
  mode: PunjabiFormsAppointmentsA2Mode;
  title_vi: string;
  title_en: string;
  learner_task_vi: string;
  learner_task_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  phrases: PunjabiFormsAppointmentsA2Phrase[];
  traps: PunjabiFormsAppointmentsA2Trap[];
  checkpoint: {
    prompt_vi: string;
    prompt_en: string;
    answer_pa: string;
    answer_romanization: string;
    answer_vi: string;
    answer_en: string;
  };
  remediation_vi: string;
  remediation_en: string;
};

const scriptAwarenessVi = "Gurmukhi là chữ chính trong pack forms/appointments; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn = "Gurmukhi is the main script in this forms/appointments pack; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const formsAppointmentsA2: PunjabiFormsAppointmentsA2Item[] = [
  {
    id: "pa_a2_forms_name",
    topic: "name",
    mode: "review",
    title_vi: "Tên trên mẫu đơn",
    title_en: "Name on a form",
    learner_task_vi: "Nói và xác nhận tên của bạn trong bối cảnh điền form.",
    learner_task_en: "State and confirm your name in a form-filling context.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Useful for clinic, school office, library card, and Service Canada style counters.",
    canada_practical_en: "Useful for clinic, school office, library card, and Service Canada style counters.",
    phrases: [
      { pa: "ਮੇਰਾ ਨਾਮ ਅਮਨ ਹੈ।", romanization: "mera naam aman hai.", vi: "Tên tôi là Aman.", en: "My name is Aman.", note_vi: "ਮੇਰਾ agrees với ਨਾਮ.", note_en: "ਮੇਰਾ agrees with ਨਾਮ." },
      { pa: "ਕੀ ਤੁਸੀਂ ਨਾਮ ਦੁਬਾਰਾ ਲਿਖ ਸਕਦੇ ਹੋ?", romanization: "ki tusi naam dubara likh sakde ho?", vi: "Bạn có thể viết lại tên không?", en: "Can you write the name again?", note_vi: "ਤੁਸੀਂ + ਸਕਦੇ ਹੋ giữ lịch sự.", note_en: "ਤੁਸੀਂ + ਸਕਦੇ ਹੋ keeps it polite." },
      { pa: "ਨਾਮ ਸਹੀ ਹੈ।", romanization: "naam sahi hai.", vi: "Tên đúng rồi.", en: "The name is correct.", note_vi: "ਸਹੀ = đúng/correct.", note_en: "ਸਹੀ = correct." },
    ],
    traps: [
      { trap_vi: "Đừng dùng ਮੇਰੀ ਨਾਮ; ਨਾਮ thường masculine nên ਮੇਰਾ.", trap_en: "Do not use ਮੇਰੀ ਨਾਮ; ਨਾਮ is usually masculine, so ਮੇਰਾ.", better_pa: "ਮੇਰਾ ਨਾਮ", better_romanization: "mera naam" },
    ],
    checkpoint: { prompt_vi: "Nói: Tên đúng rồi.", prompt_en: "Say: The name is correct.", answer_pa: "ਨਾਮ ਸਹੀ ਹੈ।", answer_romanization: "naam sahi hai.", answer_vi: "Tên đúng rồi.", answer_en: "The name is correct." },
    remediation_vi: "Nếu sai possessive, ôn ਮੇਰਾ/ਮੇਰੀ theo danh từ sau.",
    remediation_en: "If possessive is wrong, review ਮੇਰਾ/ਮੇਰੀ by the following noun.",
  },
  {
    id: "pa_a2_forms_address",
    topic: "address",
    mode: "final_quality",
    title_vi: "Địa chỉ",
    title_en: "Address",
    learner_task_vi: "Nói địa chỉ, xác nhận unit/apartment number, và xin nhắc lại.",
    learner_task_en: "State an address, confirm unit/apartment number, and ask for repetition.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Unit, apartment, postal code, proof of address are frequent Canada tasks.",
    canada_practical_en: "Unit, apartment, postal code, proof of address are frequent Canada tasks.",
    phrases: [
      { pa: "ਮੇਰਾ ਪਤਾ 25 ਮੇਨ ਸਟਰੀਟ ਹੈ।", romanization: "mera pata 25 main street hai.", vi: "Địa chỉ của tôi là 25 Main Street.", en: "My address is 25 Main Street.", note_vi: "ਪਤਾ = địa chỉ.", note_en: "ਪਤਾ = address." },
      { pa: "ਅਪਾਰਟਮੈਂਟ ਨੰਬਰ ਪੰਜ ਹੈ।", romanization: "apartment number panj hai.", vi: "Số căn hộ là năm.", en: "The apartment number is five.", note_vi: "ਨੰਬਰ thường dùng như loanword.", note_en: "ਨੰਬਰ is commonly used as a loanword." },
      { pa: "ਕੀ ਤੁਸੀਂ ਪਤਾ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "ki tusi pata dubara keh sakde ho?", vi: "Bạn có thể nói lại địa chỉ không?", en: "Can you say the address again?", note_vi: "Repair phrase cho địa chỉ.", note_en: "Repair phrase for addresses." },
    ],
    traps: [
      { trap_vi: "ਪਤਾ cũng có thể nghĩa 'biết' trong ਮੈਨੂੰ ਪਤਾ ਹੈ; trong form là địa chỉ.", trap_en: "ਪਤਾ can mean 'know' in ਮੈਨੂੰ ਪਤਾ ਹੈ; on a form it means address.", better_pa: "ਮੇਰਾ ਪਤਾ", better_romanization: "mera pata" },
    ],
    checkpoint: { prompt_vi: "Hỏi: Bạn có thể nói lại địa chỉ không?", prompt_en: "Ask: Can you say the address again?", answer_pa: "ਕੀ ਤੁਸੀਂ ਪਤਾ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", answer_romanization: "ki tusi pata dubara keh sakde ho?", answer_vi: "Bạn có thể nói lại địa chỉ không?", answer_en: "Can you say the address again?" },
    remediation_vi: "Nếu nhầm số nhà/unit, xác nhận từng phần: street, unit, postal code.",
    remediation_en: "If house/unit number is confused, confirm each part: street, unit, postal code.",
  },
  {
    id: "pa_a2_forms_date_time",
    topic: "date_time",
    mode: "readiness",
    title_vi: "Ngày và giờ",
    title_en: "Date and time",
    learner_task_vi: "Đọc và nói ngày/giờ hẹn.",
    learner_task_en: "Read and say appointment dates/times.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Critical for appointments, shifts, school meetings, and public-service bookings.",
    canada_practical_en: "Critical for appointments, shifts, school meetings, and public-service bookings.",
    phrases: [
      { pa: "ਅਪਾਇੰਟਮੈਂਟ ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ ਹੈ।", romanization: "appointment shukkarvaar nu hai.", vi: "Lịch hẹn vào thứ Sáu.", en: "The appointment is on Friday.", note_vi: "ਨੂੰ đánh dấu ngày.", note_en: "ਨੂੰ marks the day." },
      { pa: "ਸਮਾਂ ਦੋ ਵਜੇ ਹੈ।", romanization: "sama do vaje hai.", vi: "Giờ là hai giờ.", en: "The time is two.", note_vi: "ਵਜੇ cần cho giờ đồng hồ.", note_en: "ਵਜੇ is needed for clock time." },
      { pa: "ਸੋਮਵਾਰ ਸਵੇਰੇ ਦਸ ਵਜੇ।", romanization: "somvaar savere das vaje.", vi: "Thứ Hai lúc mười giờ sáng.", en: "Monday at ten in the morning.", note_vi: "ਸਵੇਰੇ làm rõ buổi sáng.", note_en: "ਸਵੇਰੇ clarifies morning." },
    ],
    traps: [
      { trap_vi: "Đừng nói chỉ ਦੋ cho 'at two'; nói ਦੋ ਵਜੇ.", trap_en: "Do not say only ਦੋ for 'at two'; say ਦੋ ਵਜੇ.", better_pa: "ਦੋ ਵਜੇ", better_romanization: "do vaje" },
    ],
    checkpoint: { prompt_vi: "Nói: Lịch hẹn vào thứ Sáu lúc ba giờ.", prompt_en: "Say: The appointment is Friday at three.", answer_pa: "ਅਪਾਇੰਟਮੈਂਟ ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ ਹੈ।", answer_romanization: "appointment shukkarvaar tinn vaje hai.", answer_vi: "Lịch hẹn vào thứ Sáu lúc ba giờ.", answer_en: "The appointment is Friday at three." },
    remediation_vi: "Nếu thiếu ਵਜੇ, ôn clock-time pattern.",
    remediation_en: "If ਵਜੇ is missing, review the clock-time pattern.",
  },
  {
    id: "pa_a2_forms_rescheduling",
    topic: "rescheduling",
    mode: "review",
    title_vi: "Đổi lịch",
    title_en: "Rescheduling",
    learner_task_vi: "Xin đổi giờ/ngày hẹn một cách lịch sự.",
    learner_task_en: "Ask to change an appointment time/day politely.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Useful for clinic, dentist, settlement, and school appointments.",
    canada_practical_en: "Useful for clinic, dentist, settlement, and school appointments.",
    phrases: [
      { pa: "ਮੈਨੂੰ ਸਮਾਂ ਬਦਲਣਾ ਹੈ।", romanization: "mainu sama badalna hai.", vi: "Tôi cần đổi giờ.", en: "I need to change the time.", note_vi: "ਬਦਲਣਾ = đổi/thay đổi.", note_en: "ਬਦਲਣਾ = change." },
      { pa: "ਕੀ ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ?", romanization: "ki shukkarvaar nu sama mil sakda hai?", vi: "Thứ Sáu có giờ trống không?", en: "Is a time available on Friday?", note_vi: "ਮਿਲ ਸਕਦਾ ਹੈ hỏi availability.", note_en: "ਮਿਲ ਸਕਦਾ ਹੈ asks availability." },
      { pa: "ਮੈਂ ਅੱਜ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "main ajj nahi aa sakda.", vi: "Hôm nay tôi không thể đến. (nam)", en: "I cannot come today. (male speaker)", note_vi: "ਸਕਦਾ đổi thành ਸਕਦੀ với nữ.", note_en: "ਸਕਦਾ changes to ਸਕਦੀ for female speaker." },
    ],
    traps: [
      { trap_vi: "Khi đổi lịch, nói rõ ngày/giờ mới.", trap_en: "When rescheduling, state the new day/time clearly.", better_pa: "ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ?", better_romanization: "shukkarvaar nu sama mil sakda hai?" },
    ],
    checkpoint: { prompt_vi: "Hỏi: Thứ Sáu có giờ trống không?", prompt_en: "Ask: Is a time available on Friday?", answer_pa: "ਕੀ ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ?", answer_romanization: "ki shukkarvaar nu sama mil sakda hai?", answer_vi: "Thứ Sáu có giờ trống không?", answer_en: "Is a time available on Friday?" },
    remediation_vi: "Nếu câu quá trực tiếp, thêm ਕੀ và ਸਕਦਾ ਹੈ.",
    remediation_en: "If the sentence is too direct, add ਕੀ and ਸਕਦਾ ਹੈ.",
  },
  {
    id: "pa_a2_forms_missing_document",
    topic: "missing_document",
    mode: "remediation",
    title_vi: "Thiếu giấy tờ",
    title_en: "Missing document",
    learner_task_vi: "Nói bạn thiếu giấy tờ và hỏi có thể nộp sau không.",
    learner_task_en: "Say you are missing a document and ask whether you can submit it later.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Common with health card, proof of address, school forms, and public-service counters.",
    canada_practical_en: "Common with health card, proof of address, school forms, and public-service counters.",
    phrases: [
      { pa: "ਮੇਰੇ ਕੋਲ ਇਹ ਦਸਤਾਵੇਜ਼ ਨਹੀਂ ਹੈ।", romanization: "mere kol eh dastavez nahi hai.", vi: "Tôi không có giấy tờ này.", en: "I do not have this document.", note_vi: "Possession uses ਮੇਰੇ ਕੋਲ.", note_en: "Possession uses ਮੇਰੇ ਕੋਲ." },
      { pa: "ਕੀ ਮੈਂ ਇਹ ਬਾਅਦ ਵਿੱਚ ਲਿਆ ਸਕਦਾ ਹਾਂ?", romanization: "ki main eh baad vich lia sakda haan?", vi: "Tôi có thể mang cái này sau không? (nam)", en: "Can I bring this later? (male speaker)", note_vi: "Người nói nữ dùng ਸਕਦੀ.", note_en: "Female speaker uses ਸਕਦੀ." },
      { pa: "ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?", romanization: "mainu kihre dastavez chahide han?", vi: "Tôi cần những giấy tờ nào?", en: "Which documents do I need?", note_vi: "ਦਸਤਾਵੇਜ਼ plural → ਚਾਹੀਦੇ ਹਨ.", note_en: "ਦਸਤਾਵੇਜ਼ plural → ਚਾਹੀਦੇ ਹਨ." },
    ],
    traps: [
      { trap_vi: "Không nói ਮੈਂ ਦਸਤਾਵੇਜ਼ ਹੈ; possession dùng ਕੋਲ.", trap_en: "Do not say ਮੈਂ ਦਸਤਾਵੇਜ਼ ਹੈ; possession uses ਕੋਲ.", better_pa: "ਮੇਰੇ ਕੋਲ ਦਸਤਾਵੇਜ਼ ਹੈ।", better_romanization: "mere kol dastavez hai." },
    ],
    checkpoint: { prompt_vi: "Nói: Tôi không có giấy tờ này.", prompt_en: "Say: I do not have this document.", answer_pa: "ਮੇਰੇ ਕੋਲ ਇਹ ਦਸਤਾਵੇਜ਼ ਨਹੀਂ ਹੈ।", answer_romanization: "mere kol eh dastavez nahi hai.", answer_vi: "Tôi không có giấy tờ này.", answer_en: "I do not have this document." },
    remediation_vi: "Nếu dùng ਮੈਂ ... ਹੈ, ôn possession with ਕੋਲ.",
    remediation_en: "If using ਮੈਂ ... ਹੈ, review possession with ਕੋਲ.",
  },
  {
    id: "pa_a2_forms_interpreter_request",
    topic: "interpreter_request",
    mode: "readiness",
    title_vi: "Xin thông dịch viên",
    title_en: "Interpreter request",
    learner_task_vi: "Xin hỗ trợ thông dịch khi ở clinic/school/public service.",
    learner_task_en: "Ask for interpretation support at a clinic, school, or public service.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Interpreter/language support requests are practical in Canada services.",
    canada_practical_en: "Interpreter/language support requests are practical in Canadian services.",
    phrases: [
      { pa: "ਕੀ ਪੰਜਾਬੀ ਇੰਟਰਪ੍ਰੇਟਰ ਮਿਲ ਸਕਦਾ ਹੈ?", romanization: "ki punjabi interpreter mil sakda hai?", vi: "Có thể có thông dịch viên Punjabi không?", en: "Is a Punjabi interpreter available?", note_vi: "ਮਿਲ ਸਕਦਾ ਹੈ hỏi availability.", note_en: "ਮਿਲ ਸਕਦਾ ਹੈ asks availability." },
      { pa: "ਮੈਨੂੰ ਅੰਗਰੇਜ਼ੀ ਪੂਰੀ ਸਮਝ ਨਹੀਂ ਆਉਂਦੀ।", romanization: "mainu angrezi poori samajh nahi aundi.", vi: "Tôi không hiểu tiếng Anh hoàn toàn.", en: "I do not fully understand English.", note_vi: "ਮੈਨੂੰ ... ਸਮਝ ਨਹੀਂ ਆਉਂਦੀ = tôi không hiểu.", note_en: "ਮੈਨੂੰ ... ਸਮਝ ਨਹੀਂ ਆਉਂਦੀ = I do not understand." },
      { pa: "ਕੀ ਕੋਈ ਭਾਸ਼ਾ ਮਦਦ ਹੈ?", romanization: "ki koi bhasha madad hai?", vi: "Có hỗ trợ ngôn ngữ nào không?", en: "Is there any language help?", note_vi: "Câu đơn giản khi không biết từ interpreter.", note_en: "Simple fallback if you do not know interpreter." },
    ],
    traps: [
      { trap_vi: "Đừng claim hiểu nếu không hiểu; dùng repair/request phrase.", trap_en: "Do not claim understanding if you do not understand; use a repair/request phrase.", better_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ।", better_romanization: "mainu samajh nahi aai." },
    ],
    checkpoint: { prompt_vi: "Hỏi: Có thông dịch viên Punjabi không?", prompt_en: "Ask: Is a Punjabi interpreter available?", answer_pa: "ਕੀ ਪੰਜਾਬੀ ਇੰਟਰਪ੍ਰੇਟਰ ਮਿਲ ਸਕਦਾ ਹੈ?", answer_romanization: "ki punjabi interpreter mil sakda hai?", answer_vi: "Có thể có thông dịch viên Punjabi không?", answer_en: "Is a Punjabi interpreter available?" },
    remediation_vi: "Nếu không nhớ ਇੰਟਰਪ੍ਰੇਟਰ, dùng ਭਾਸ਼ਾ ਮਦਦ.",
    remediation_en: "If you do not remember ਇੰਟਰਪ੍ਰੇਟਰ, use ਭਾਸ਼ਾ ਮਦਦ.",
  },
  {
    id: "pa_a2_forms_clinic",
    topic: "clinic_appointment",
    mode: "final_quality",
    title_vi: "Lịch hẹn clinic",
    title_en: "Clinic appointment",
    learner_task_vi: "Đặt/xác nhận lịch hẹn clinic và hỏi cần mang gì.",
    learner_task_en: "Book/confirm a clinic appointment and ask what to bring.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Health card and family doctor language is common in Canada.",
    canada_practical_en: "Health card and family doctor language is common in Canada.",
    phrases: [
      { pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਨਾਲ ਅਪਾਇੰਟਮੈਂਟ ਲੈਣੀ ਹੈ।", romanization: "mainu daktar naal appointment laini hai.", vi: "Tôi cần đặt lịch với bác sĩ.", en: "I need to book an appointment with the doctor.", note_vi: "ਲੈਣੀ agrees với ਅਪਾਇੰਟਮੈਂਟ.", note_en: "ਲੈਣੀ agrees with ਅਪਾਇੰਟਮੈਂਟ." },
      { pa: "ਕੀ ਹੈਲਥ ਕਾਰਡ ਲਿਆਉਣਾ ਹੈ?", romanization: "ki health card liauna hai?", vi: "Có cần mang thẻ y tế không?", en: "Do I need to bring the health card?", note_vi: "ਲਿਆਉਣਾ = mang đến.", note_en: "ਲਿਆਉਣਾ = bring." },
      { pa: "ਮੈਨੂੰ ਸਿਰ ਦਰਦ ਹੈ।", romanization: "mainu sir dard hai.", vi: "Tôi đau đầu.", en: "I have a headache.", note_vi: "Triệu chứng dùng ਮੈਨੂੰ ... ਹੈ.", note_en: "Symptoms use ਮੈਨੂੰ ... ਹੈ." },
    ],
    traps: [
      { trap_vi: "Không nói ਮੈਂ ਸਿਰ ਦਰਦ ਹਾਂ.", trap_en: "Do not say ਮੈਂ ਸਿਰ ਦਰਦ ਹਾਂ.", better_pa: "ਮੈਨੂੰ ਸਿਰ ਦਰਦ ਹੈ।", better_romanization: "mainu sir dard hai." },
    ],
    checkpoint: { prompt_vi: "Nói: Tôi cần đặt lịch với bác sĩ.", prompt_en: "Say: I need to book an appointment with the doctor.", answer_pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਨਾਲ ਅਪਾਇੰਟਮੈਂਟ ਲੈਣੀ ਹੈ।", answer_romanization: "mainu daktar naal appointment laini hai.", answer_vi: "Tôi cần đặt lịch với bác sĩ.", answer_en: "I need to book an appointment with the doctor." },
    remediation_vi: "Nếu symptom pattern sai, ôn ਮੈਨੂੰ ... ਹੈ.",
    remediation_en: "If symptom pattern is wrong, review ਮੈਨੂੰ ... ਹੈ.",
  },
  {
    id: "pa_a2_forms_school",
    topic: "school_appointment",
    mode: "review",
    title_vi: "Hẹn với văn phòng trường",
    title_en: "School appointment",
    learner_task_vi: "Hỏi hẹn với giáo viên/văn phòng trường và báo vắng.",
    learner_task_en: "Ask for a teacher/school-office appointment and report absence.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Useful for school office, parent-teacher meetings, daycare handoff.",
    canada_practical_en: "Useful for school offices, parent-teacher meetings, daycare handoff.",
    phrases: [
      { pa: "ਕੀ ਅਧਿਆਪਕ ਨਾਲ ਮਿਲਣ ਦਾ ਸਮਾਂ ਹੈ?", romanization: "ki adhiapak naal milan da sama hai?", vi: "Có giờ gặp giáo viên không?", en: "Is there a time to meet the teacher?", note_vi: "ਨਾਲ = với; ਮਿਲਣ ਦਾ ਸਮਾਂ = giờ gặp.", note_en: "ਨਾਲ = with; ਮਿਲਣ ਦਾ ਸਮਾਂ = time to meet." },
      { pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "mera bachcha ajj school nahi aa sakda.", vi: "Con tôi hôm nay không thể đến trường.", en: "My child cannot come to school today.", note_vi: "ਸਕਦਾ agrees với ਬੱਚਾ.", note_en: "ਸਕਦਾ agrees with ਬੱਚਾ." },
      { pa: "ਕਲਾਸ ਕਿਹੜੇ ਕਮਰੇ ਵਿੱਚ ਹੈ?", romanization: "class kihre kamre vich hai?", vi: "Lớp ở phòng nào?", en: "Which room is the class in?", note_vi: "ਕਿਹੜੇ ਕਮਰੇ ਵਿੱਚ = ở phòng nào.", note_en: "ਕਿਹੜੇ ਕਮਰੇ ਵਿੱਚ = in which room." },
    ],
    traps: [
      { trap_vi: "ਮੇਰਾ/ਮੇਰੀ agrees với danh từ sau: ਮੇਰਾ ਬੱਚਾ, ਮੇਰੀ ਕਲਾਸ.", trap_en: "ਮੇਰਾ/ਮੇਰੀ agrees with the following noun: ਮੇਰਾ ਬੱਚਾ, ਮੇਰੀ ਕਲਾਸ.", better_pa: "ਮੇਰੀ ਕਲਾਸ", better_romanization: "meri class" },
    ],
    checkpoint: { prompt_vi: "Nói: Con tôi hôm nay không thể đến trường.", prompt_en: "Say: My child cannot come to school today.", answer_pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ।", answer_romanization: "mera bachcha ajj school nahi aa sakda.", answer_vi: "Con tôi hôm nay không thể đến trường.", answer_en: "My child cannot come to school today." },
    remediation_vi: "Nếu possessive sai, ôn gender of ਬੱਚਾ/ਕਲਾਸ.",
    remediation_en: "If possessive is wrong, review gender of ਬੱਚਾ/ਕਲਾਸ.",
  },
  {
    id: "pa_a2_forms_public_service",
    topic: "public_service_appointment",
    mode: "readiness",
    title_vi: "Hẹn dịch vụ công",
    title_en: "Public-service appointment",
    learner_task_vi: "Hỏi form, giấy tờ cần mang, và bước tiếp theo.",
    learner_task_en: "Ask about forms, required documents, and the next step.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Works at Service Canada, library, community centre, settlement office.",
    canada_practical_en: "Works at Service Canada, libraries, community centres, settlement offices.",
    phrases: [
      { pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨਾ ਹੈ।", romanization: "mainu eh form bharna hai.", vi: "Tôi cần điền mẫu này.", en: "I need to fill out this form.", note_vi: "ਫਾਰਮ ਭਰਨਾ = điền form.", note_en: "ਫਾਰਮ ਭਰਨਾ = fill out a form." },
      { pa: "ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?", romanization: "kihre dastavez chahide han?", vi: "Cần những giấy tờ nào?", en: "Which documents are needed?", note_vi: "Plural ਦਸਤਾਵੇਜ਼ → ਚਾਹੀਦੇ ਹਨ.", note_en: "Plural ਦਸਤਾਵੇਜ਼ → ਚਾਹੀਦੇ ਹਨ." },
      { pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", romanization: "agla kadam ki hai?", vi: "Bước tiếp theo là gì?", en: "What is the next step?", note_vi: "Useful routing/checkpoint phrase.", note_en: "Useful routing/checkpoint phrase." },
    ],
    traps: [
      { trap_vi: "ਚਾਹੀਦਾ with singular, ਚਾਹੀਦੇ ਹਨ with plural.", trap_en: "ਚਾਹੀਦਾ with singular, ਚਾਹੀਦੇ ਹਨ with plural.", better_pa: "ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ।", better_romanization: "dastavez chahide han." },
    ],
    checkpoint: { prompt_vi: "Hỏi: Bước tiếp theo là gì?", prompt_en: "Ask: What is the next step?", answer_pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", answer_romanization: "agla kadam ki hai?", answer_vi: "Bước tiếp theo là gì?", answer_en: "What is the next step?" },
    remediation_vi: "Nếu plural agreement sai, ôn ਚਾਹੀਦਾ/ਚਾਹੀਦੇ ਹਨ.",
    remediation_en: "If plural agreement is wrong, review ਚਾਹੀਦਾ/ਚਾਹੀਦੇ ਹਨ.",
  },
  {
    id: "pa_a2_forms_confirmation",
    topic: "polite_confirmation",
    mode: "final_quality",
    title_vi: "Xác nhận lịch sự",
    title_en: "Polite confirmation",
    learner_task_vi: "Xác nhận rằng bạn hiểu, tên/địa chỉ đúng, hoặc bạn sẽ đến.",
    learner_task_en: "Confirm that you understand, that a name/address is correct, or that you will come.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    phrases: [
      { pa: "ਠੀਕ ਹੈ, ਮੈਨੂੰ ਸਮਝ ਆ ਗਈ।", romanization: "theek hai, mainu samajh aa gai.", vi: "Được, tôi hiểu rồi.", en: "Okay, I understand now.", note_vi: "ਸਮਝ ਆ ਗਈ = đã hiểu.", note_en: "ਸਮਝ ਆ ਗਈ = understood." },
      { pa: "ਹਾਂ ਜੀ, ਪਤਾ ਸਹੀ ਹੈ।", romanization: "haan ji, pata sahi hai.", vi: "Vâng, địa chỉ đúng.", en: "Yes, the address is correct.", note_vi: "ਜੀ làm câu lịch sự hơn.", note_en: "ਜੀ makes it more polite." },
      { pa: "ਮੈਂ ਕੱਲ੍ਹ ਸਵੇਰੇ ਦਸ ਵਜੇ ਆਵਾਂਗੀ।", romanization: "main kal savere das vaje aavangi.", vi: "Tôi sẽ đến sáng mai lúc mười giờ. (nữ)", en: "I will come tomorrow morning at ten. (female speaker)", note_vi: "ਆਵਾਂਗੀ cho người nói nữ.", note_en: "ਆਵਾਂਗੀ for a female speaker." },
    ],
    traps: [
      { trap_vi: "ਕੱਲ੍ਹ cần ngữ cảnh; với future verb là ngày mai.", trap_en: "ਕੱਲ੍ਹ needs context; with a future verb it means tomorrow.", better_pa: "ਕੱਲ੍ਹ ਸਵੇਰੇ ਆਵਾਂਗੀ", better_romanization: "kal savere aavangi" },
    ],
    checkpoint: { prompt_vi: "Nói: Được, tôi hiểu rồi.", prompt_en: "Say: Okay, I understand now.", answer_pa: "ਠੀਕ ਹੈ, ਮੈਨੂੰ ਸਮਝ ਆ ਗਈ।", answer_romanization: "theek hai, mainu samajh aa gai.", answer_vi: "Được, tôi hiểu rồi.", answer_en: "Okay, I understand now." },
    remediation_vi: "Nếu dùng direct 'yes' quá cụt, thêm ਜੀ hoặc full confirmation.",
    remediation_en: "If a direct 'yes' feels too abrupt, add ਜੀ or a full confirmation.",
  },
];
