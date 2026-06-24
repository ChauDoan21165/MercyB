// src/languages/punjabi/canDoStatementsA2.ts
//
// Punjabi A2 can-do statements for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred.

export type PunjabiCanDoA2Domain =
  | "daily_routines"
  | "appointments"
  | "transport"
  | "housing"
  | "school"
  | "childcare"
  | "workplace_small_talk"
  | "polite_problem_descriptions"
  | "basic_interaction_repair";

export type PunjabiCanDoA2CheckpointType =
  | "say_it"
  | "choose_form"
  | "read_it"
  | "repair_it"
  | "roleplay";

export type PunjabiCanDoA2Model = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
  note_vi: string;
  note_en: string;
};

export type PunjabiCanDoA2Checkpoint = {
  type: PunjabiCanDoA2CheckpointType;
  prompt_vi: string;
  prompt_en: string;
  expected_pa: string;
  expected_romanization: string;
  expected_vi: string;
  expected_en: string;
};

export type PunjabiCanDoA2Trap = {
  trap_vi: string;
  trap_en: string;
  better_pa: string;
  better_romanization: string;
};

export type PunjabiCanDoA2Statement = {
  id: string;
  domain: PunjabiCanDoA2Domain;
  can_do_vi: string;
  can_do_en: string;
  learner_evidence_vi: string;
  learner_evidence_en: string;
  readiness_route_vi: string;
  readiness_route_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  models: PunjabiCanDoA2Model[];
  checkpoints: PunjabiCanDoA2Checkpoint[];
  traps: PunjabiCanDoA2Trap[];
};

const scriptAwarenessVi = "Gurmukhi là chữ chính trong can-do A2; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn = "Gurmukhi is the main script in this A2 can-do set; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const canDoStatementsA2: PunjabiCanDoA2Statement[] = [
  {
    id: "pa_a2_cando_daily_routines",
    domain: "daily_routines",
    can_do_vi: "Tôi có thể nói thói quen hằng ngày và một việc đã làm hôm qua.",
    can_do_en: "I can talk about daily routines and one thing I did yesterday.",
    learner_evidence_vi: "Người học đặt động từ cuối câu và chọn -ਦਾ/-ਦੀ theo người nói.",
    learner_evidence_en: "The learner keeps the verb at the end and chooses -ਦਾ/-ਦੀ by speaker.",
    readiness_route_vi: "Nếu ổn, chuyển sang B1 kể ngày bận rộn với lý do.",
    readiness_route_en: "If ready, move to B1 describing a busy day with reasons.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    models: [
      { pa: "ਮੈਂ ਸਵੇਰੇ ਕੰਮ ਤੇ ਜਾਂਦੀ ਹਾਂ।", romanization: "main savere kamm te jandi haan.", vi: "Tôi đi làm buổi sáng. (nữ)", en: "I go to work in the morning. (female speaker)", note_vi: "ਜਾਂਦੀ agrees với người nói nữ.", note_en: "ਜਾਂਦੀ agrees with a female speaker." },
      { pa: "ਕੱਲ੍ਹ ਮੈਂ ਕੰਮ ਕੀਤਾ।", romanization: "kal main kamm kita.", vi: "Hôm qua tôi đã làm việc.", en: "Yesterday I worked.", note_vi: "ਕੀਤਾ là quá khứ của ਕਰਨਾ.", note_en: "ਕੀਤਾ is the past of ਕਰਨਾ." },
    ],
    checkpoints: [
      { type: "say_it", prompt_vi: "Nói: Tôi uống trà buổi sáng. (nam)", prompt_en: "Say: I drink tea in the morning. (male speaker)", expected_pa: "ਮੈਂ ਸਵੇਰੇ ਚਾਹ ਪੀਂਦਾ ਹਾਂ।", expected_romanization: "main savere chah peenda haan.", expected_vi: "Tôi uống trà buổi sáng.", expected_en: "I drink tea in the morning." },
      { type: "choose_form", prompt_vi: "Người nói nữ chọn: ਜਾਂਦਾ / ਜਾਂਦੀ", prompt_en: "Female speaker chooses: ਜਾਂਦਾ / ਜਾਂਦੀ", expected_pa: "ਜਾਂਦੀ", expected_romanization: "jandi", expected_vi: "Dùng ਜਾਂਦੀ.", expected_en: "Use ਜਾਂਦੀ." },
    ],
    traps: [
      { trap_vi: "Đừng dùng masculine habitual cho mọi người.", trap_en: "Do not use masculine habitual for everyone.", better_pa: "ਮੈਂ ਪੀਂਦੀ ਹਾਂ।", better_romanization: "main peendi haan." },
    ],
  },
  {
    id: "pa_a2_cando_appointments",
    domain: "appointments",
    can_do_vi: "Tôi có thể xác nhận lịch hẹn và xin đổi giờ.",
    can_do_en: "I can confirm an appointment and ask to change the time.",
    learner_evidence_vi: "Người học dùng ਵਜੇ cho giờ, ਨੂੰ cho ngày, và câu hỏi lịch sự.",
    learner_evidence_en: "The learner uses ਵਜੇ for time, ਨੂੰ for days, and polite questions.",
    readiness_route_vi: "Nếu ổn, chuyển sang B1 gọi điện giải thích lý do đổi lịch.",
    readiness_route_en: "If ready, move to B1 phone calls explaining why you need to reschedule.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Clinic/dentist/family doctor contexts in Canada often use ਅਪਾਇੰਟਮੈਂਟ.",
    canada_practical_en: "Clinic, dentist, and family doctor contexts in Canada often use ਅਪਾਇੰਟਮੈਂਟ.",
    models: [
      { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਦੋ ਵਜੇ ਹੈ।", romanization: "meri appointment do vaje hai.", vi: "Lịch hẹn của tôi lúc hai giờ.", en: "My appointment is at two.", note_vi: "ਦੋ ਵਜੇ = lúc hai giờ.", note_en: "ਦੋ ਵਜੇ = at two." },
      { pa: "ਕੀ ਮੈਂ ਸਮਾਂ ਬਦਲ ਸਕਦੀ ਹਾਂ?", romanization: "ki main sama badal sakdi haan?", vi: "Tôi có thể đổi giờ không? (nữ)", en: "Can I change the time? (female speaker)", note_vi: "ਸਕਦੀ cho người nói nữ.", note_en: "ਸਕਦੀ for a female speaker." },
    ],
    checkpoints: [
      { type: "say_it", prompt_vi: "Nói: Lịch hẹn của tôi vào thứ Sáu.", prompt_en: "Say: My appointment is on Friday.", expected_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ ਹੈ।", expected_romanization: "meri appointment shukkarvaar nu hai.", expected_vi: "Lịch hẹn của tôi vào thứ Sáu.", expected_en: "My appointment is on Friday." },
      { type: "roleplay", prompt_vi: "Xin đổi lịch sang thứ Hai lúc mười giờ.", prompt_en: "Ask to move an appointment to Monday at ten.", expected_pa: "ਕੀ ਸੋਮਵਾਰ ਦਸ ਵਜੇ ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ?", expected_romanization: "ki somvaar das vaje sama mil sakda hai?", expected_vi: "Thứ Hai lúc mười giờ có giờ trống không?", expected_en: "Is a time available Monday at ten?" },
    ],
    traps: [
      { trap_vi: "Đừng nói chỉ ਦੋ cho giờ hẹn; cần ਵਜੇ.", trap_en: "Do not say only ਦੋ for appointment time; use ਵਜੇ.", better_pa: "ਦੋ ਵਜੇ", better_romanization: "do vaje" },
    ],
  },
  {
    id: "pa_a2_cando_transport",
    domain: "transport",
    can_do_vi: "Tôi có thể hỏi tuyến, điểm xuống, và báo đến muộn.",
    can_do_en: "I can ask about routes, where to get off, and say I will be late.",
    learner_evidence_vi: "Người học dùng ਕਿੱਥੇ, ਉਤਰਨਾ, ਦੇਰ ਨਾਲ và agreement với ਬੱਸ/ਟ੍ਰੇਨ.",
    learner_evidence_en: "The learner uses ਕਿੱਥੇ, ਉਤਰਨਾ, ਦੇਰ ਨਾਲ and agreement with ਬੱਸ/ਟ੍ਰੇਨ.",
    readiness_route_vi: "Nếu ổn, chuyển sang B1 đổi tuyến và mô tả trễ phức tạp hơn.",
    readiness_route_en: "If ready, move to B1 transfers and more detailed delay explanations.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được với TTC, SkyTrain, GO Train, bus stop, platform.",
    canada_practical_en: "Works with TTC, SkyTrain, GO Train, bus stops, and platforms.",
    models: [
      { pa: "ਇਹ ਬੱਸ ਕਿੱਥੇ ਜਾਂਦੀ ਹੈ?", romanization: "eh bass kitthe jandi hai?", vi: "Xe buýt này đi đâu?", en: "Where does this bus go?", note_vi: "ਜਾਂਦੀ agrees với ਬੱਸ.", note_en: "ਜਾਂਦੀ agrees with ਬੱਸ." },
      { pa: "ਮੈਨੂੰ ਕਿੱਥੇ ਉਤਰਨਾ ਹੈ?", romanization: "mainu kitthe utarna hai?", vi: "Tôi phải xuống ở đâu?", en: "Where should I get off?", note_vi: "ਉਤਰਨਾ = xuống xe/tàu.", note_en: "ਉਤਰਨਾ = get off." },
    ],
    checkpoints: [
      { type: "say_it", prompt_vi: "Nói: Xe buýt đang đến muộn.", prompt_en: "Say: The bus is coming late.", expected_pa: "ਬੱਸ ਦੇਰ ਨਾਲ ਆ ਰਹੀ ਹੈ।", expected_romanization: "bass der naal aa rahi hai.", expected_vi: "Xe buýt đang đến muộn.", expected_en: "The bus is coming late." },
      { type: "choose_form", prompt_vi: "Chọn với ਬੱਸ: ਜਾਂਦਾ / ਜਾਂਦੀ", prompt_en: "Choose with ਬੱਸ: ਜਾਂਦਾ / ਜਾਂਦੀ", expected_pa: "ਜਾਂਦੀ", expected_romanization: "jandi", expected_vi: "Dùng ਜਾਂਦੀ.", expected_en: "Use ਜਾਂਦੀ." },
    ],
    traps: [
      { trap_vi: "Trong mẫu này, đừng dùng ਜਾਂਦਾ với ਬੱਸ.", trap_en: "In this pattern, do not use ਜਾਂਦਾ with ਬੱਸ.", better_pa: "ਬੱਸ ਜਾਂਦੀ ਹੈ।", better_romanization: "bass jandi hai." },
    ],
  },
  {
    id: "pa_a2_cando_housing",
    domain: "housing",
    can_do_vi: "Tôi có thể báo vấn đề nhà ở một cách lịch sự.",
    can_do_en: "I can report a housing problem politely.",
    learner_evidence_vi: "Người học nêu vị trí bằng ਵਿੱਚ và mô tả lỗi bằng ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ / ਲੀਕ ਹੋ ਰਿਹਾ.",
    learner_evidence_en: "The learner marks location with ਵਿੱਚ and describes issues with ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ / ਲੀਕ ਹੋ ਰਿਹਾ.",
    readiness_route_vi: "Nếu ổn, chuyển sang B1 nói vấn đề bắt đầu khi nào và cần follow-up gì.",
    readiness_route_en: "If ready, move to B1 saying when the problem started and what follow-up is needed.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Heater, leak, basement, landlord là loanwords thường gặp trong Punjabi Canada.",
    canada_practical_en: "Heater, leak, basement, and landlord are common loanwords in Canadian Punjabi.",
    models: [
      { pa: "ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "heater kamm nahi kar riha.", vi: "Máy sưởi không hoạt động.", en: "The heater is not working.", note_vi: "ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ dùng cho thiết bị.", note_en: "ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ is used for devices." },
      { pa: "ਰਸੋਈ ਵਿੱਚ ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "rasoi vich paani leak ho riha hai.", vi: "Nước đang rò trong bếp.", en: "Water is leaking in the kitchen.", note_vi: "ਰਸੋਈ ਵਿੱਚ = trong bếp.", note_en: "ਰਸੋਈ ਵਿੱਚ = in the kitchen." },
    ],
    checkpoints: [
      { type: "say_it", prompt_vi: "Nói: Trong phòng tắm không có nước.", prompt_en: "Say: Water is not coming in the bathroom.", expected_pa: "ਬਾਥਰੂਮ ਵਿੱਚ ਪਾਣੀ ਨਹੀਂ ਆ ਰਿਹਾ।", expected_romanization: "bathroom vich paani nahi aa riha.", expected_vi: "Trong phòng tắm không có nước.", expected_en: "Water is not coming in the bathroom." },
      { type: "repair_it", prompt_vi: "Mở đầu lịch sự trước khi báo lỗi heater.", prompt_en: "Add a polite opening before reporting a heater issue.", expected_pa: "ਮਾਫ਼ ਕਰਨਾ, ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", expected_romanization: "maaf karna, heater kamm nahi kar riha.", expected_vi: "Xin lỗi, máy sưởi không hoạt động.", expected_en: "Sorry, the heater is not working." },
    ],
    traps: [
      { trap_vi: "Đừng mở đầu bằng mệnh lệnh mạnh với landlord/manager.", trap_en: "Do not open with a strong command to a landlord/manager.", better_pa: "ਮਾਫ਼ ਕਰਨਾ, ਇੱਕ ਸਮੱਸਿਆ ਹੈ।", better_romanization: "maaf karna, ikk samassia hai." },
    ],
  },
  {
    id: "pa_a2_cando_school",
    domain: "school",
    can_do_vi: "Tôi có thể hỏi bài tập, phòng học, và báo vắng ở trường.",
    can_do_en: "I can ask about homework, classroom location, and report school absence.",
    learner_evidence_vi: "Người học dùng ਕਦੋਂ, ਕਿਹੜੇ ਕਮਰੇ ਵਿੱਚ, và ਮੇਰਾ/ਮੇਰੀ đúng với danh từ.",
    learner_evidence_en: "The learner uses ਕਦੋਂ, ਕਿਹੜੇ ਕਮਰੇ ਵਿੱਚ, and correct ਮੇਰਾ/ਮੇਰੀ with nouns.",
    readiness_route_vi: "Nếu ổn, chuyển sang B1 trao đổi với giáo viên bằng câu dài hơn.",
    readiness_route_en: "If ready, move to B1 teacher exchanges with longer sentences.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được với school office, adult ESL class, parent-teacher note.",
    canada_practical_en: "Useful for school offices, adult ESL classes, and parent-teacher notes.",
    models: [
      { pa: "ਹੋਮਵਰਕ ਕਦੋਂ ਦੇਣਾ ਹੈ?", romanization: "homework kadon dena hai?", vi: "Khi nào phải nộp bài tập?", en: "When is the homework due?", note_vi: "ਦੇਣਾ ở đây là nộp.", note_en: "ਦੇਣਾ here means submit." },
      { pa: "ਕਲਾਸ ਕਿਹੜੇ ਕਮਰੇ ਵਿੱਚ ਹੈ?", romanization: "class kihre kamre vich hai?", vi: "Lớp ở phòng nào?", en: "Which room is the class in?", note_vi: "ਕਿਹੜੇ ਕਮਰੇ ਵਿੱਚ = trong phòng nào.", note_en: "ਕਿਹੜੇ ਕਮਰੇ ਵਿੱਚ = in which room." },
    ],
    checkpoints: [
      { type: "say_it", prompt_vi: "Nói: Con tôi hôm nay không thể đến trường.", prompt_en: "Say: My child cannot come to school today.", expected_pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ।", expected_romanization: "mera bachcha ajj school nahi aa sakda.", expected_vi: "Con tôi hôm nay không thể đến trường.", expected_en: "My child cannot come to school today." },
      { type: "choose_form", prompt_vi: "Chọn: ਮੇਰਾ ਕਲਾਸ / ਮੇਰੀ ਕਲਾਸ", prompt_en: "Choose: ਮੇਰਾ ਕਲਾਸ / ਮੇਰੀ ਕਲਾਸ", expected_pa: "ਮੇਰੀ ਕਲਾਸ", expected_romanization: "meri class", expected_vi: "Dùng ਮੇਰੀ ਕਲਾਸ.", expected_en: "Use ਮੇਰੀ ਕਲਾਸ." },
    ],
    traps: [
      { trap_vi: "Sở hữu agrees với danh từ: ਮੇਰਾ ਬੱਚਾ, ਮੇਰੀ ਕਲਾਸ.", trap_en: "Possessive agrees with the noun: ਮੇਰਾ ਬੱਚਾ, ਮੇਰੀ ਕਲਾਸ.", better_pa: "ਮੇਰੀ ਕਲਾਸ ਨੌਂ ਵਜੇ ਹੈ।", better_romanization: "meri class naun vaje hai." },
    ],
  },
  {
    id: "pa_a2_cando_childcare",
    domain: "childcare",
    can_do_vi: "Tôi có thể nói giờ đón trẻ và hỏi tình trạng cơ bản.",
    can_do_en: "I can state pickup time and ask about basic child status.",
    learner_evidence_vi: "Người học dùng ਬੱਚੇ ਨੂੰ, ਲੈਣ ਆਉਣਾ, và ਉਸਨੂੰ ... ਹੈ cho sức khỏe.",
    learner_evidence_en: "The learner uses ਬੱਚੇ ਨੂੰ, ਲੈਣ ਆਉਣਾ, and ਉਸਨੂੰ ... ਹੈ for health.",
    readiness_route_vi: "Nếu ổn, chuyển sang B1 trao đổi chi tiết với daycare.",
    readiness_route_en: "If ready, move to B1 detailed daycare exchanges.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Daycare, pickup, lunch box thường được mượn âm trong Punjabi Canada.",
    canada_practical_en: "Daycare, pickup, and lunch box are often borrowed in Canadian Punjabi.",
    models: [
      { pa: "ਮੈਂ ਬੱਚੇ ਨੂੰ ਪੰਜ ਵਜੇ ਲੈਣ ਆਵਾਂਗੀ।", romanization: "main bachche nu panj vaje lain aavangi.", vi: "Tôi sẽ đến đón trẻ lúc năm giờ. (nữ)", en: "I will come to pick up the child at five. (female speaker)", note_vi: "ਲੈਣ ਆਵਾਂਗੀ = sẽ đến đón, người nói nữ.", note_en: "ਲੈਣ ਆਵਾਂਗੀ = will come to pick up, female speaker." },
      { pa: "ਉਸਨੂੰ ਥੋੜ੍ਹਾ ਬੁਖਾਰ ਹੈ।", romanization: "usnu thoda bukhar hai.", vi: "Bé hơi sốt.", en: "The child has a slight fever.", note_vi: "Sức khỏe dùng ਉਸਨੂੰ.", note_en: "Health conditions use ਉਸਨੂੰ." },
    ],
    checkpoints: [
      { type: "say_it", prompt_vi: "Nói: Bé đã ăn chưa?", prompt_en: "Say: Did the child eat?", expected_pa: "ਬੱਚੇ ਨੇ ਖਾਣਾ ਖਾਧਾ?", expected_romanization: "bachche ne khana khadha?", expected_vi: "Bé đã ăn chưa?", expected_en: "Did the child eat?" },
      { type: "repair_it", prompt_vi: "Sửa: ਉਹ ਬੁਖਾਰ ਹੈ।", prompt_en: "Fix: ਉਹ ਬੁਖਾਰ ਹੈ।", expected_pa: "ਉਸਨੂੰ ਬੁਖਾਰ ਹੈ।", expected_romanization: "usnu bukhar hai.", expected_vi: "Bé bị sốt.", expected_en: "The child has a fever." },
    ],
    traps: [
      { trap_vi: "Không nói ਉਹ ਬੁਖਾਰ ਹੈ cho tình trạng sức khỏe.", trap_en: "Do not say ਉਹ ਬੁਖਾਰ ਹੈ for a health condition.", better_pa: "ਉਸਨੂੰ ਬੁਖਾਰ ਹੈ।", better_romanization: "usnu bukhar hai." },
    ],
  },
  {
    id: "pa_a2_cando_workplace_small_talk",
    domain: "workplace_small_talk",
    can_do_vi: "Tôi có thể small talk lịch sự ở nơi làm việc.",
    can_do_en: "I can make polite workplace small talk.",
    learner_evidence_vi: "Người học dùng ਤੁਹਾਡਾ/ਤੁਸੀਂ và chủ đề an toàn như weather/weekend/work.",
    learner_evidence_en: "The learner uses ਤੁਹਾਡਾ/ਤੁਸੀਂ and safe topics such as weather/weekend/work.",
    readiness_route_vi: "Nếu ổn, chuyển sang B1 góp ý và cập nhật công việc.",
    readiness_route_en: "If ready, move to B1 feedback and work updates.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Weekend/weather small talk là lựa chọn an toàn trong workplace Canada.",
    canada_practical_en: "Weekend/weather small talk is a safe choice in Canadian workplaces.",
    models: [
      { pa: "ਤੁਹਾਡਾ ਵੀਕਐਂਡ ਕਿਵੇਂ ਸੀ?", romanization: "tuhada weekend kiven si?", vi: "Cuối tuần của bạn thế nào?", en: "How was your weekend?", note_vi: "ਤੁਹਾਡਾ lịch sự hơn ਤੇਰਾ.", note_en: "ਤੁਹਾਡਾ is more polite than ਤੇਰਾ." },
      { pa: "ਕੰਮ ਕਿਵੇਂ ਚੱਲ ਰਿਹਾ ਹੈ?", romanization: "kamm kiven chall riha hai?", vi: "Công việc đang thế nào?", en: "How is work going?", note_vi: "Câu hỏi nhẹ, phù hợp đồng nghiệp.", note_en: "A light coworker-friendly question." },
    ],
    checkpoints: [
      { type: "choose_form", prompt_vi: "Chọn lịch sự hơn: ਤੇਰਾ / ਤੁਹਾਡਾ", prompt_en: "Choose the more polite option: ਤੇਰਾ / ਤੁਹਾਡਾ", expected_pa: "ਤੁਹਾਡਾ", expected_romanization: "tuhada", expected_vi: "Dùng ਤੁਹਾਡਾ.", expected_en: "Use ਤੁਹਾਡਾ." },
      { type: "say_it", prompt_vi: "Nói: Hôm nay thời tiết đẹp.", prompt_en: "Say: The weather is nice today.", expected_pa: "ਅੱਜ ਮੌਸਮ ਚੰਗਾ ਹੈ।", expected_romanization: "ajj mausam changa hai.", expected_vi: "Hôm nay thời tiết đẹp.", expected_en: "The weather is nice today." },
    ],
    traps: [
      { trap_vi: "ਤੂੰ/ਤੇਰਾ có thể quá thân mật trong workplace.", trap_en: "ਤੂੰ/ਤੇਰਾ can be too intimate at work.", better_pa: "ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", better_romanization: "tuhada din kiven hai?" },
    ],
  },
  {
    id: "pa_a2_cando_polite_problem",
    domain: "polite_problem_descriptions",
    can_do_vi: "Tôi có thể mô tả vấn đề lịch sự và xin giúp.",
    can_do_en: "I can describe a problem politely and ask for help.",
    learner_evidence_vi: "Người học dùng ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ..., và ਕੀ ਤੁਸੀਂ... ਸਕਦੇ ਹੋ?",
    learner_evidence_en: "The learner uses ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ..., and ਕੀ ਤੁਸੀਂ... ਸਕਦੇ ਹੋ?",
    readiness_route_vi: "Nếu ổn, chuyển sang B1 mô tả hậu quả và đề nghị giải pháp.",
    readiness_route_en: "If ready, move to B1 describing impact and proposing solutions.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng ở quầy dịch vụ, school office, clinic, landlord message.",
    canada_practical_en: "Useful at service counters, school offices, clinics, and in landlord messages.",
    models: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਇੱਕ ਛੋਟੀ ਸਮੱਸਿਆ ਹੈ।", romanization: "maaf karna, mainu ikk chhoti samassia hai.", vi: "Xin lỗi, tôi có một vấn đề nhỏ.", en: "Sorry, I have a small problem.", note_vi: "Cách mở đầu mềm.", note_en: "A soft opener." },
      { pa: "ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusi madad kar sakde ho?", vi: "Bạn có thể giúp không?", en: "Can you help?", note_vi: "ਤੁਸੀਂ + ਸਕਦੇ ਹੋ lịch sự.", note_en: "ਤੁਸੀਂ + ਸਕਦੇ ਹੋ is polite." },
    ],
    checkpoints: [
      { type: "repair_it", prompt_vi: "Làm lịch sự hơn: ਮਦਦ ਕਰੋ.", prompt_en: "Make this more polite: ਮਦਦ ਕਰੋ.", expected_pa: "ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?", expected_romanization: "ki tusi madad kar sakde ho?", expected_vi: "Bạn có thể giúp không?", expected_en: "Can you help?" },
      { type: "say_it", prompt_vi: "Nói: Tôi không hiểu hướng dẫn này.", prompt_en: "Say: I did not understand this instruction.", expected_pa: "ਮੈਨੂੰ ਇਹ ਹਦਾਇਤ ਸਮਝ ਨਹੀਂ ਆਈ।", expected_romanization: "mainu eh hidayat samajh nahi aai.", expected_vi: "Tôi chưa hiểu hướng dẫn này.", expected_en: "I did not understand this instruction." },
    ],
    traps: [
      { trap_vi: "Đừng dùng mệnh lệnh ngắn với người lạ nếu có thể hỏi lịch sự.", trap_en: "Do not use a short command with strangers when a polite question works.", better_pa: "ਕੀ ਤੁਸੀਂ ਦੇਖ ਸਕਦੇ ਹੋ?", better_romanization: "ki tusi dekh sakde ho?" },
    ],
  },
  {
    id: "pa_a2_cando_interaction_repair",
    domain: "basic_interaction_repair",
    can_do_vi: "Tôi có thể xin nhắc lại, xin nói chậm, hỏi nghĩa, và xác nhận chi tiết.",
    can_do_en: "I can ask for repetition, slower speech, meaning, and detail confirmation.",
    learner_evidence_vi: "Người học không im lặng khi chưa hiểu; dùng repair phrase ngắn và lịch sự.",
    learner_evidence_en: "The learner does not go silent when confused; they use short polite repair phrases.",
    readiness_route_vi: "Nếu ổn, chuyển sang B1 xử lý hiểu một phần và diễn giải lại.",
    readiness_route_en: "If ready, move to B1 handling partial understanding and paraphrasing.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    models: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਦੁਬਾਰਾ ਕਹੋ ਜੀ।", romanization: "maaf karna, dubara kaho ji.", vi: "Xin lỗi, vui lòng nói lại.", en: "Sorry, please say that again.", note_vi: "ਜੀ làm câu mềm hơn.", note_en: "ਜੀ softens the phrase." },
      { pa: "ਇਸਦਾ ਕੀ ਮਤਲਬ ਹੈ?", romanization: "isda ki matlab hai?", vi: "Cái này nghĩa là gì?", en: "What does this mean?", note_vi: "ਮਤਲਬ = nghĩa/ý.", note_en: "ਮਤਲਬ = meaning/point." },
    ],
    checkpoints: [
      { type: "repair_it", prompt_vi: "Xin người kia nói chậm hơn.", prompt_en: "Ask the other person to speak slower.", expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਥੋੜ੍ਹਾ ਹੌਲੀ ਬੋਲੋ।", expected_romanization: "kirpa karke thoda hauli bolo.", expected_vi: "Làm ơn nói chậm hơn một chút.", expected_en: "Please speak a little slower." },
      { type: "read_it", prompt_vi: "Đọc và hiểu: ਦੋ ਵਜੇ ਤੱਕ. Nghĩa là gì?", prompt_en: "Read and understand: ਦੋ ਵਜੇ ਤੱਕ. What does it mean?", expected_pa: "ਦੋ ਵਜੇ ਤੱਕ", expected_romanization: "do vaje takk", expected_vi: "Đến hai giờ.", expected_en: "Until two." },
    ],
    traps: [
      { trap_vi: "Đừng chỉ nói ਕੀ? với người lạ.", trap_en: "Do not only say ਕੀ? to a stranger.", better_pa: "ਮਾਫ਼ ਕਰਨਾ, ਦੁਬਾਰਾ ਕਹੋ ਜੀ।", better_romanization: "maaf karna, dubara kaho ji." },
    ],
  },
];
