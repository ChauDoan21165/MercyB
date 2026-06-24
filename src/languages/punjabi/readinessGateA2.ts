// src/languages/punjabi/readinessGateA2.ts
//
// Punjabi A2 readiness gate for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred.

export type PunjabiReadinessGateA2Domain =
  | "daily_tasks"
  | "appointments"
  | "housing"
  | "school_childcare"
  | "public_service"
  | "transport"
  | "polite_problem_description"
  | "gurmukhi_phrase_reading"
  | "repair_strategies";

export type PunjabiReadinessGateA2TaskType =
  | "checkpoint"
  | "reading"
  | "routing"
  | "roleplay"
  | "repair";

export type PunjabiReadinessGateA2Prompt = {
  type: PunjabiReadinessGateA2TaskType;
  prompt_vi: string;
  prompt_en: string;
  expected_pa: string;
  expected_romanization: string;
  expected_vi: string;
  expected_en: string;
  pass_hint_vi: string;
  pass_hint_en: string;
};

export type PunjabiReadinessGateA2Trap = {
  trap_vi: string;
  trap_en: string;
  better_pa: string;
  better_romanization: string;
};

export type PunjabiReadinessGateA2Item = {
  id: string;
  domain: PunjabiReadinessGateA2Domain;
  title_vi: string;
  title_en: string;
  can_do_vi: string;
  can_do_en: string;
  route_if_ready_vi: string;
  route_if_ready_en: string;
  route_if_not_ready_vi: string;
  route_if_not_ready_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  prompts: PunjabiReadinessGateA2Prompt[];
  traps: PunjabiReadinessGateA2Trap[];
};

const scriptAwarenessVi = "Gurmukhi là chữ chính trong readiness gate; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn = "Gurmukhi is the main script in this readiness gate; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const readinessGateA2: PunjabiReadinessGateA2Item[] = [
  {
    id: "pa_a2_gate_daily_tasks",
    domain: "daily_tasks",
    title_vi: "Sẵn sàng: việc hằng ngày",
    title_en: "Ready: daily tasks",
    can_do_vi: "Bạn có thể nói việc thường làm và việc đã làm hôm qua.",
    can_do_en: "You can talk about usual actions and what you did yesterday.",
    route_if_ready_vi: "Chuyển sang B1 routine + lý do/chi tiết.",
    route_if_ready_en: "Move to B1 routines with reasons and details.",
    route_if_not_ready_vi: "Ôn A2 daily actions và habitual -ਦਾ/-ਦੀ/-ਦੇ.",
    route_if_not_ready_en: "Review A2 daily actions and habitual -ਦਾ/-ਦੀ/-ਦੇ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    prompts: [
      { type: "checkpoint", prompt_vi: "Nói: Tôi đi làm buổi sáng. (nữ)", prompt_en: "Say: I go to work in the morning. (female speaker)", expected_pa: "ਮੈਂ ਸਵੇਰੇ ਕੰਮ ਤੇ ਜਾਂਦੀ ਹਾਂ।", expected_romanization: "main savere kamm te jandi haan.", expected_vi: "Tôi đi làm buổi sáng.", expected_en: "I go to work in the morning.", pass_hint_vi: "Động từ cuối câu và ਜਾਂਦੀ cho người nói nữ.", pass_hint_en: "Verb at the end and ਜਾਂਦੀ for a female speaker." },
      { type: "checkpoint", prompt_vi: "Nói: Hôm qua tôi làm việc.", prompt_en: "Say: Yesterday I worked.", expected_pa: "ਕੱਲ੍ਹ ਮੈਂ ਕੰਮ ਕੀਤਾ।", expected_romanization: "kal main kamm kita.", expected_vi: "Hôm qua tôi đã làm việc.", expected_en: "Yesterday I worked.", pass_hint_vi: "ਕੀਤਾ là quá khứ của ਕਰਨਾ.", pass_hint_en: "ਕੀਤਾ is the past of ਕਰਨਾ." },
    ],
    traps: [
      { trap_vi: "Đừng dùng dạng nam cho mọi người nói.", trap_en: "Do not use the masculine form for every speaker.", better_pa: "ਮੈਂ ਜਾਂਦੀ ਹਾਂ।", better_romanization: "main jandi haan." },
    ],
  },
  {
    id: "pa_a2_gate_appointments",
    domain: "appointments",
    title_vi: "Sẵn sàng: lịch hẹn",
    title_en: "Ready: appointments",
    can_do_vi: "Bạn có thể xác nhận giờ hẹn và xin đổi lịch.",
    can_do_en: "You can confirm appointment times and ask to reschedule.",
    route_if_ready_vi: "Chuyển sang B1 phone calls và giải thích lý do đổi lịch.",
    route_if_ready_en: "Move to B1 phone calls and explaining rescheduling reasons.",
    route_if_not_ready_vi: "Ôn ਵਜੇ, ਨੂੰ, ਅਪਾਇੰਟਮੈਂਟ, ਸਕਦਾ/ਸਕਦੀ.",
    route_if_not_ready_en: "Review ਵਜੇ, ਨੂੰ, ਅਪਾਇੰਟਮੈਂਟ, ਸਕਦਾ/ਸਕਦੀ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được trong clinic, dentist, family doctor ở Canada.",
    canada_practical_en: "Useful in Canadian clinic, dentist, and family doctor contexts.",
    prompts: [
      { type: "roleplay", prompt_vi: "Bạn muốn đổi lịch sang thứ Sáu lúc ba giờ.", prompt_en: "You want to move an appointment to Friday at three.", expected_pa: "ਕੀ ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ?", expected_romanization: "ki shukkarvaar tinn vaje sama mil sakda hai?", expected_vi: "Thứ Sáu lúc ba giờ có giờ trống không?", expected_en: "Is a time available Friday at three?", pass_hint_vi: "Có ngày + giờ + câu hỏi lịch sự.", pass_hint_en: "Includes day + time + polite question." },
      { type: "checkpoint", prompt_vi: "Nói: Lịch hẹn của tôi lúc hai giờ.", prompt_en: "Say: My appointment is at two.", expected_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਦੋ ਵਜੇ ਹੈ।", expected_romanization: "meri appointment do vaje hai.", expected_vi: "Lịch hẹn của tôi lúc hai giờ.", expected_en: "My appointment is at two.", pass_hint_vi: "Dùng ਦੋ ਵਜੇ, không chỉ ਦੋ.", pass_hint_en: "Use ਦੋ ਵਜੇ, not only ਦੋ." },
    ],
    traps: [
      { trap_vi: "ਸਕਦਾ/ਸਕਦੀ đổi theo người nói.", trap_en: "ਸਕਦਾ/ਸਕਦੀ changes with the speaker.", better_pa: "ਕੀ ਮੈਂ ਸਮਾਂ ਬਦਲ ਸਕਦੀ ਹਾਂ?", better_romanization: "ki main sama badal sakdi haan?" },
    ],
  },
  {
    id: "pa_a2_gate_housing",
    domain: "housing",
    title_vi: "Sẵn sàng: nhà ở",
    title_en: "Ready: housing",
    can_do_vi: "Bạn có thể báo vấn đề nhà ở một cách lịch sự.",
    can_do_en: "You can report a housing problem politely.",
    route_if_ready_vi: "Chuyển sang B1 mô tả nguyên nhân, thời gian, và follow-up.",
    route_if_ready_en: "Move to B1 describing causes, timing, and follow-up.",
    route_if_not_ready_vi: "Ôn ਵਿੱਚ, ਨਹੀਂ ਆ ਰਿਹਾ, ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ.",
    route_if_not_ready_en: "Review ਵਿੱਚ, ਨਹੀਂ ਆ ਰਿਹਾ, ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Heater, leak, landlord là loanwords thực tế trong Punjabi Canada.",
    canada_practical_en: "Heater, leak, and landlord are practical loanwords in Canadian Punjabi.",
    prompts: [
      { type: "checkpoint", prompt_vi: "Nói: Máy sưởi không hoạt động.", prompt_en: "Say: The heater is not working.", expected_pa: "ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", expected_romanization: "heater kamm nahi kar riha.", expected_vi: "Máy sưởi không hoạt động.", expected_en: "The heater is not working.", pass_hint_vi: "ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ mô tả thiết bị lỗi.", pass_hint_en: "ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ describes a device not working." },
      { type: "repair", prompt_vi: "Làm câu mềm hơn khi nhắn landlord.", prompt_en: "Make the sentence softer for texting a landlord.", expected_pa: "ਮਾਫ਼ ਕਰਨਾ, ਰਸੋਈ ਵਿੱਚ ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ।", expected_romanization: "maaf karna, rasoi vich paani leak ho riha hai.", expected_vi: "Xin lỗi, nước đang rò trong bếp.", expected_en: "Sorry, water is leaking in the kitchen.", pass_hint_vi: "Có ਮਾਫ਼ ਕਰਨਾ + vị trí + vấn đề.", pass_hint_en: "Has ਮਾਫ਼ ਕਰਨਾ + location + problem." },
    ],
    traps: [
      { trap_vi: "Đừng mở đầu bằng mệnh lệnh mạnh khi báo lỗi.", trap_en: "Do not open with a strong command when reporting a problem.", better_pa: "ਮਾਫ਼ ਕਰਨਾ, ਇੱਕ ਸਮੱਸਿਆ ਹੈ।", better_romanization: "maaf karna, ikk samassia hai." },
    ],
  },
  {
    id: "pa_a2_gate_school_childcare",
    domain: "school_childcare",
    title_vi: "Sẵn sàng: trường và childcare",
    title_en: "Ready: school and childcare",
    can_do_vi: "Bạn có thể báo vắng, hỏi bài tập, và nói giờ đón trẻ.",
    can_do_en: "You can report absence, ask about homework, and state pickup time.",
    route_if_ready_vi: "Chuyển sang B1 trao đổi với giáo viên/childcare staff.",
    route_if_ready_en: "Move to B1 exchanges with teachers/childcare staff.",
    route_if_not_ready_vi: "Ôn ਬੱਚਾ, ਹੋਮਵਰਕ, ਲੈਣ ਆਉਣਾ, ਉਸਨੂੰ ... ਹੈ.",
    route_if_not_ready_en: "Review ਬੱਚਾ, ਹੋਮਵਰਕ, ਲੈਣ ਆਉਣਾ, ਉਸਨੂੰ ... ਹੈ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Daycare pickup và school office messages rất thường gặp ở Canada.",
    canada_practical_en: "Daycare pickup and school office messages are common in Canada.",
    prompts: [
      { type: "checkpoint", prompt_vi: "Nói: Con tôi hôm nay không thể đến trường.", prompt_en: "Say: My child cannot come to school today.", expected_pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ।", expected_romanization: "mera bachcha ajj school nahi aa sakda.", expected_vi: "Con tôi hôm nay không thể đến trường.", expected_en: "My child cannot come to school today.", pass_hint_vi: "ਸਕਦਾ agrees với ਬੱਚਾ.", pass_hint_en: "ਸਕਦਾ agrees with ਬੱਚਾ." },
      { type: "checkpoint", prompt_vi: "Nói: Tôi sẽ đến đón trẻ lúc năm giờ. (nữ)", prompt_en: "Say: I will pick up the child at five. (female speaker)", expected_pa: "ਮੈਂ ਬੱਚੇ ਨੂੰ ਪੰਜ ਵਜੇ ਲੈਣ ਆਵਾਂਗੀ।", expected_romanization: "main bachche nu panj vaje lain aavangi.", expected_vi: "Tôi sẽ đến đón trẻ lúc năm giờ.", expected_en: "I will come to pick up the child at five.", pass_hint_vi: "ਲੈਣ ਆਵਾਂਗੀ cho người nói nữ.", pass_hint_en: "ਲੈਣ ਆਵਾਂਗੀ for a female speaker." },
    ],
    traps: [
      { trap_vi: "Sức khỏe dùng ਉਸਨੂੰ ਬੁਖਾਰ ਹੈ, không ਉਹ ਬੁਖਾਰ ਹੈ.", trap_en: "Health uses ਉਸਨੂੰ ਬੁਖਾਰ ਹੈ, not ਉਹ ਬੁਖਾਰ ਹੈ.", better_pa: "ਉਸਨੂੰ ਬੁਖਾਰ ਹੈ।", better_romanization: "usnu bukhar hai." },
    ],
  },
  {
    id: "pa_a2_gate_public_service",
    domain: "public_service",
    title_vi: "Sẵn sàng: quầy dịch vụ công",
    title_en: "Ready: public-service counter",
    can_do_vi: "Bạn có thể hỏi giấy tờ cần mang và bước tiếp theo.",
    can_do_en: "You can ask which documents are needed and what the next step is.",
    route_if_ready_vi: "Chuyển sang B1 giải thích hồ sơ và vấn đề giấy tờ.",
    route_if_ready_en: "Move to B1 explaining applications and document issues.",
    route_if_not_ready_vi: "Ôn ਫਾਰਮ, ਦਸਤਾਵੇਜ਼, ਚਾਹੀਦੇ ਹਨ, ਅਗਲਾ ਕਦਮ.",
    route_if_not_ready_en: "Review ਫਾਰਮ, ਦਸਤਾਵੇਜ਼, ਚਾਹੀਦੇ ਹਨ, ਅਗਲਾ ਕਦਮ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được ở Service Canada, library, community centre, settlement office.",
    canada_practical_en: "Works at Service Canada, libraries, community centres, and settlement offices.",
    prompts: [
      { type: "checkpoint", prompt_vi: "Nói: Cần những giấy tờ nào?", prompt_en: "Say: Which documents are needed?", expected_pa: "ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?", expected_romanization: "kihre dastavez chahide han?", expected_vi: "Cần những giấy tờ nào?", expected_en: "Which documents are needed?", pass_hint_vi: "ਦਸਤਾਵੇਜ਼ số nhiều, nên ਚਾਹੀਦੇ ਹਨ.", pass_hint_en: "ਦਸਤਾਵੇਜ਼ is plural, so ਚਾਹੀਦੇ ਹਨ." },
      { type: "routing", prompt_vi: "Sau khi nộp form, hỏi bước tiếp theo.", prompt_en: "After submitting a form, ask the next step.", expected_pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", expected_romanization: "agla kadam ki hai?", expected_vi: "Bước tiếp theo là gì?", expected_en: "What is the next step?", pass_hint_vi: "Câu ngắn, rõ, phù hợp A2.", pass_hint_en: "Short, clear, A2-appropriate." },
    ],
    traps: [
      { trap_vi: "ਚਾਹੀਦਾ với số ít; ਚਾਹੀਦੇ ਹਨ với số nhiều.", trap_en: "ਚਾਹੀਦਾ for singular; ਚਾਹੀਦੇ ਹਨ for plural.", better_pa: "ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ।", better_romanization: "dastavez chahide han." },
    ],
  },
  {
    id: "pa_a2_gate_transport",
    domain: "transport",
    title_vi: "Sẵn sàng: giao thông",
    title_en: "Ready: transport",
    can_do_vi: "Bạn có thể hỏi tuyến, điểm xuống, và báo trễ.",
    can_do_en: "You can ask routes, where to get off, and report a delay.",
    route_if_ready_vi: "Chuyển sang B1 xử lý đổi tuyến và thông báo trễ dài hơn.",
    route_if_ready_en: "Move to B1 handling transfers and longer delay messages.",
    route_if_not_ready_vi: "Ôn ਕਿੱਥੇ, ਉਤਰਨਾ, ਦੇਰ ਨਾਲ, ਬੱਸ/ਟ੍ਰੇਨ agreement.",
    route_if_not_ready_en: "Review ਕਿੱਥੇ, ਉਤਰਨਾ, ਦੇਰ ਨਾਲ, bus/train agreement.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được với TTC, SkyTrain, GO Train, bus stop, platform.",
    canada_practical_en: "Works with TTC, SkyTrain, GO Train, bus stops, and platforms.",
    prompts: [
      { type: "checkpoint", prompt_vi: "Nói: Xe buýt này đi đâu?", prompt_en: "Say: Where does this bus go?", expected_pa: "ਇਹ ਬੱਸ ਕਿੱਥੇ ਜਾਂਦੀ ਹੈ?", expected_romanization: "eh bass kitthe jandi hai?", expected_vi: "Xe buýt này đi đâu?", expected_en: "Where does this bus go?", pass_hint_vi: "ਜਾਂਦੀ agrees với ਬੱਸ.", pass_hint_en: "ਜਾਂਦੀ agrees with ਬੱਸ." },
      { type: "checkpoint", prompt_vi: "Nói: Tôi sẽ đến muộn mười phút. (nam)", prompt_en: "Say: I will be ten minutes late. (male speaker)", expected_pa: "ਮੈਂ ਦਸ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵਾਂਗਾ।", expected_romanization: "main das mint der naal aavanga.", expected_vi: "Tôi sẽ đến muộn mười phút.", expected_en: "I will be ten minutes late.", pass_hint_vi: "ਦੇਰ ਨਾਲ = muộn; ਆਵਾਂਗਾ cho nam.", pass_hint_en: "ਦੇਰ ਨਾਲ = late; ਆਵਾਂਗਾ for male speaker." },
    ],
    traps: [
      { trap_vi: "Đừng dùng ਜਾਂਦਾ với ਬੱਸ trong mẫu này.", trap_en: "Do not use ਜਾਂਦਾ with ਬੱਸ in this pattern.", better_pa: "ਬੱਸ ਜਾਂਦੀ ਹੈ।", better_romanization: "bass jandi hai." },
    ],
  },
  {
    id: "pa_a2_gate_polite_problem",
    domain: "polite_problem_description",
    title_vi: "Sẵn sàng: mô tả vấn đề lịch sự",
    title_en: "Ready: polite problem description",
    can_do_vi: "Bạn có thể báo vấn đề, xin giúp, và không nghe rõ thì hỏi lại.",
    can_do_en: "You can report a problem, ask for help, and ask again when you did not hear.",
    route_if_ready_vi: "Chuyển sang B1 giải thích chi tiết, hậu quả, và yêu cầu follow-up.",
    route_if_ready_en: "Move to B1 explaining details, impact, and follow-up requests.",
    route_if_not_ready_vi: "Ôn ਮਾਫ਼ ਕਰਨਾ, ਮਦਦ, ਦੁਬਾਰਾ, ਸਕਦੇ ਹੋ.",
    route_if_not_ready_en: "Review ਮਾਫ਼ ਕਰਨਾ, ਮਦਦ, ਦੁਬਾਰਾ, ਸਕਦੇ ਹੋ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng ở clinic, school office, service counter, landlord text.",
    canada_practical_en: "Useful at clinics, school offices, service counters, and in landlord texts.",
    prompts: [
      { type: "repair", prompt_vi: "Nói lịch sự: Bạn có thể nói lại không?", prompt_en: "Say politely: Can you say that again?", expected_pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", expected_romanization: "maaf karna, ki tusi dubara keh sakde ho?", expected_vi: "Xin lỗi, bạn có thể nói lại không?", expected_en: "Sorry, can you say that again?", pass_hint_vi: "Có ਮਾਫ਼ ਕਰਨਾ và ਤੁਸੀਂ.", pass_hint_en: "Has ਮਾਫ਼ ਕਰਨਾ and ਤੁਸੀਂ." },
      { type: "checkpoint", prompt_vi: "Nói: Tôi có một vấn đề nhỏ.", prompt_en: "Say: I have a small problem.", expected_pa: "ਮੈਨੂੰ ਇੱਕ ਛੋਟੀ ਸਮੱਸਿਆ ਹੈ।", expected_romanization: "mainu ikk chhoti samassia hai.", expected_vi: "Tôi có một vấn đề nhỏ.", expected_en: "I have a small problem.", pass_hint_vi: "Dùng ਮੈਨੂੰ ... ਹੈ.", pass_hint_en: "Use ਮੈਨੂੰ ... ਹੈ." },
    ],
    traps: [
      { trap_vi: "Đừng chỉ nói ਕੀ? với người lạ.", trap_en: "Do not only say ਕੀ? to a stranger.", better_pa: "ਮਾਫ਼ ਕਰਨਾ, ਦੁਬਾਰਾ ਕਹੋ ਜੀ।", better_romanization: "maaf karna, dubara kaho ji." },
    ],
  },
  {
    id: "pa_a2_gate_gurmukhi_reading",
    domain: "gurmukhi_phrase_reading",
    title_vi: "Sẵn sàng: đọc cụm Gurmukhi",
    title_en: "Ready: reading Gurmukhi phrases",
    can_do_vi: "Bạn có thể đọc thông báo ngắn và lấy thông tin chính.",
    can_do_en: "You can read short notices and extract key information.",
    route_if_ready_vi: "Chuyển sang B1 đoạn đọc dài hơn và ít romanization hơn.",
    route_if_ready_en: "Move to B1 longer readings with less romanization.",
    route_if_not_ready_vi: "Ôn reading bridge A2: notices, signs, appointment reminders.",
    route_if_not_ready_en: "Review A2 reading bridge: notices, signs, appointment reminders.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Các sign kiểu service counter, laundry, fire alarm test rất thực tế ở Canada.",
    canada_practical_en: "Service counter, laundry, and fire alarm test signs are practical in Canada.",
    prompts: [
      { type: "reading", prompt_vi: "Đọc: ਸੇਵਾ ਕਾਊਂਟਰ ਦੋ ਵਜੇ ਤੱਕ ਬੰਦ ਹੈ। Quầy đóng đến mấy giờ?", prompt_en: "Read: ਸੇਵਾ ਕਾਊਂਟਰ ਦੋ ਵਜੇ ਤੱਕ ਬੰਦ ਹੈ। Closed until what time?", expected_pa: "ਦੋ ਵਜੇ ਤੱਕ", expected_romanization: "do vaje takk", expected_vi: "Đến hai giờ.", expected_en: "Until two.", pass_hint_vi: "Nhận ra ਤੱਕ = đến/tới.", pass_hint_en: "Recognize ਤੱਕ = until." },
      { type: "reading", prompt_vi: "Đọc: ਕਿਰਪਾ ਕਰਕੇ ਹੈਲਥ ਕਾਰਡ ਨਾਲ ਲਿਆਓ। Cần mang gì?", prompt_en: "Read: ਕਿਰਪਾ ਕਰਕੇ ਹੈਲਥ ਕਾਰਡ ਨਾਲ ਲਿਆਓ। What should be brought?", expected_pa: "ਹੈਲਥ ਕਾਰਡ", expected_romanization: "health card", expected_vi: "Thẻ y tế.", expected_en: "Health card.", pass_hint_vi: "Tìm danh từ sau ਕਿਰਪਾ ਕਰਕੇ.", pass_hint_en: "Find the noun after ਕਿਰਪਾ ਕਰਕੇ." },
    ],
    traps: [
      { trap_vi: "Đừng bỏ qua postposition như ਤੱਕ, ਨਾਲ vì chúng giữ thông tin chính.", trap_en: "Do not skip postpositions like ਤੱਕ, ਨਾਲ because they carry key information.", better_pa: "ਦੋ ਵਜੇ ਤੱਕ", better_romanization: "do vaje takk" },
    ],
  },
  {
    id: "pa_a2_gate_repair_strategies",
    domain: "repair_strategies",
    title_vi: "Sẵn sàng: chiến lược sửa giao tiếp",
    title_en: "Ready: repair strategies",
    can_do_vi: "Bạn có thể xin nói chậm, nhắc lại, hỏi nghĩa, và xác nhận chi tiết.",
    can_do_en: "You can ask someone to slow down, repeat, explain meaning, and confirm details.",
    route_if_ready_vi: "Chuyển sang B1 thảo luận khi hiểu một phần và cần làm rõ.",
    route_if_ready_en: "Move to B1 discussions when you partially understand and need clarification.",
    route_if_not_ready_vi: "Ôn interaction repair A2.",
    route_if_not_ready_en: "Review A2 interaction repair.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    prompts: [
      { type: "repair", prompt_vi: "Xin người kia nói chậm hơn.", prompt_en: "Ask the other person to speak slower.", expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਥੋੜ੍ਹਾ ਹੌਲੀ ਬੋਲੋ।", expected_romanization: "kirpa karke thoda hauli bolo.", expected_vi: "Làm ơn nói chậm hơn một chút.", expected_en: "Please speak a little slower.", pass_hint_vi: "Có ਕਿਰਪਾ ਕਰਕੇ và ਹੌਲੀ.", pass_hint_en: "Has ਕਿਰਪਾ ਕਰਕੇ and ਹੌਲੀ." },
      { type: "repair", prompt_vi: "Hỏi nghĩa của từ này.", prompt_en: "Ask what this word means.", expected_pa: "ਇਸਦਾ ਕੀ ਮਤਲਬ ਹੈ?", expected_romanization: "isda ki matlab hai?", expected_vi: "Cái này nghĩa là gì?", expected_en: "What does this mean?", pass_hint_vi: "ਮਤਲਬ = nghĩa/ý.", pass_hint_en: "ਮਤਲਬ = meaning/point." },
    ],
    traps: [
      { trap_vi: "Khi chưa hiểu, dùng repair phrase thay vì đoán.", trap_en: "When you do not understand, use a repair phrase instead of guessing.", better_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ।", better_romanization: "mainu samajh nahi aai." },
    ],
  },
];
