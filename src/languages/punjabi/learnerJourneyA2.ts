// src/languages/punjabi/learnerJourneyA2.ts
//
// Punjabi A2 learner journey for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred.

export type PunjabiLearnerJourneyA2Stage =
  | "daily_routines"
  | "appointments"
  | "transport"
  | "housing"
  | "school"
  | "childcare"
  | "workplace_small_talk"
  | "repair_phrases"
  | "polite_problem_descriptions";

export type PunjabiLearnerJourneyA2Mode =
  | "learn"
  | "practice"
  | "handoff"
  | "readiness";

export type PunjabiLearnerJourneyA2CanDo = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
  explanation_vi: string;
  explanation_en: string;
};

export type PunjabiLearnerJourneyA2Trap = {
  trap_vi: string;
  trap_en: string;
  better_pa: string;
  better_romanization: string;
};

export type PunjabiLearnerJourneyA2Step = {
  id: string;
  stage: PunjabiLearnerJourneyA2Stage;
  mode: PunjabiLearnerJourneyA2Mode;
  title_vi: string;
  title_en: string;
  learner_goal_vi: string;
  learner_goal_en: string;
  handoff_vi: string;
  handoff_en: string;
  readiness_check_vi: string;
  readiness_check_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  can_do: PunjabiLearnerJourneyA2CanDo[];
  traps: PunjabiLearnerJourneyA2Trap[];
  next_if_ready_vi: string;
  next_if_ready_en: string;
  review_if_stuck_vi: string;
  review_if_stuck_en: string;
};

const scriptAwarenessVi = "Gurmukhi là chữ chính trong learner journey; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn = "Gurmukhi is the main script in this learner journey; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const learnerJourneyA2: PunjabiLearnerJourneyA2Step[] = [
  {
    id: "pa_a2_journey_daily_routines",
    stage: "daily_routines",
    mode: "learn",
    title_vi: "Bắt đầu bằng sinh hoạt hằng ngày",
    title_en: "Start with daily routines",
    learner_goal_vi: "Nói được việc thường làm buổi sáng/tối và một việc đã làm hôm qua.",
    learner_goal_en: "Say what you usually do in the morning/evening and one thing you did yesterday.",
    handoff_vi: "Sau bước này, người học có thể chuyển sang nói lịch hẹn và giờ giấc.",
    handoff_en: "After this step, the learner can move to appointments and time.",
    readiness_check_vi: "Có thể tự đổi ਜਾਂਦਾ/ਜਾਂਦੀ theo người nói.",
    readiness_check_en: "Can switch ਜਾਂਦਾ/ਜਾਂਦੀ by speaker.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    can_do: [
      { pa: "ਮੈਂ ਸਵੇਰੇ ਕੰਮ ਤੇ ਜਾਂਦੀ ਹਾਂ।", romanization: "main savere kamm te jandi haan.", vi: "Tôi đi làm buổi sáng. (nữ)", en: "I go to work in the morning. (female speaker)", explanation_vi: "ਜਾਂਦੀ agrees với người nói nữ.", explanation_en: "ਜਾਂਦੀ agrees with a female speaker." },
      { pa: "ਕੱਲ੍ਹ ਮੈਂ ਕੰਮ ਕੀਤਾ।", romanization: "kal main kamm kita.", vi: "Hôm qua tôi đã làm việc.", en: "Yesterday I worked.", explanation_vi: "ਕੀਤਾ là quá khứ của ਕਰਨਾ.", explanation_en: "ਕੀਤਾ is the past of ਕਰਨਾ." },
    ],
    traps: [
      { trap_vi: "Đừng dùng dạng nam cho mọi người nói.", trap_en: "Do not use the masculine form for every speaker.", better_pa: "ਮੈਂ ਜਾਂਦੀ ਹਾਂ।", better_romanization: "main jandi haan." },
    ],
    next_if_ready_vi: "Đi tiếp appointments: dùng ਵਜੇ và ਨੂੰ.",
    next_if_ready_en: "Move to appointments: use ਵਜੇ and ਨੂੰ.",
    review_if_stuck_vi: "Ôn habitual -ਦਾ/-ਦੀ và động từ ở cuối câu.",
    review_if_stuck_en: "Review habitual -ਦਾ/-ਦੀ and verb-final order.",
  },
  {
    id: "pa_a2_journey_appointments",
    stage: "appointments",
    mode: "practice",
    title_vi: "Lịch hẹn và giờ",
    title_en: "Appointments and time",
    learner_goal_vi: "Xác nhận giờ hẹn và xin đổi lịch đơn giản.",
    learner_goal_en: "Confirm appointment times and ask for a simple reschedule.",
    handoff_vi: "Sau bước này, người học sẵn sàng đọc reminder ngắn hoặc gọi đổi lịch.",
    handoff_en: "After this step, the learner is ready to read short reminders or call to reschedule.",
    readiness_check_vi: "Có thể nói ngày + giờ + câu hỏi lịch sự.",
    readiness_check_en: "Can say day + time + polite question.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Clinic, dentist, family doctor thường dùng ਅਪਾਇੰਟਮੈਂਟ.",
    canada_practical_en: "Clinic, dentist, and family doctor contexts often use ਅਪਾਇੰਟਮੈਂਟ.",
    can_do: [
      { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਦੋ ਵਜੇ ਹੈ।", romanization: "meri appointment do vaje hai.", vi: "Lịch hẹn của tôi lúc hai giờ.", en: "My appointment is at two.", explanation_vi: "ਦੋ ਵਜੇ = lúc hai giờ.", explanation_en: "ਦੋ ਵਜੇ = at two." },
      { pa: "ਕੀ ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ?", romanization: "ki shukkarvaar tinn vaje sama mil sakda hai?", vi: "Thứ Sáu lúc ba giờ có giờ trống không?", en: "Is a time available Friday at three?", explanation_vi: "ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ? hỏi availability lịch sự.", explanation_en: "ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ? politely asks availability." },
    ],
    traps: [
      { trap_vi: "Đừng nói chỉ ਦੋ cho giờ; cần ਵਜੇ.", trap_en: "Do not say only ਦੋ for time; add ਵਜੇ.", better_pa: "ਦੋ ਵਜੇ", better_romanization: "do vaje" },
    ],
    next_if_ready_vi: "Đi tiếp transport: hỏi tuyến và điểm xuống.",
    next_if_ready_en: "Move to transport: ask route and where to get off.",
    review_if_stuck_vi: "Ôn ਵਜੇ, ਨੂੰ, ਸਕਦਾ/ਸਕਦੀ.",
    review_if_stuck_en: "Review ਵਜੇ, ਨੂੰ, ਸਕਦਾ/ਸਕਦੀ.",
  },
  {
    id: "pa_a2_journey_transport",
    stage: "transport",
    mode: "practice",
    title_vi: "Đi lại và báo trễ",
    title_en: "Transport and delays",
    learner_goal_vi: "Hỏi tuyến, điểm xuống, và báo đến muộn.",
    learner_goal_en: "Ask routes, where to get off, and report being late.",
    handoff_vi: "Sau bước này, người học có thể xử lý tình huống bus/train cơ bản.",
    handoff_en: "After this step, the learner can handle basic bus/train situations.",
    readiness_check_vi: "Có thể dùng ਕਿੱਥੇ, ਉਤਰਨਾ, ਦੇਰ ਨਾਲ.",
    readiness_check_en: "Can use ਕਿੱਥੇ, ਉਤਰਨਾ, ਦੇਰ ਨਾਲ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Có thể thay địa danh bằng TTC, SkyTrain, GO Train, Main Street.",
    canada_practical_en: "Place names can be swapped with TTC, SkyTrain, GO Train, Main Street.",
    can_do: [
      { pa: "ਇਹ ਬੱਸ ਕਿੱਥੇ ਜਾਂਦੀ ਹੈ?", romanization: "eh bass kitthe jandi hai?", vi: "Xe buýt này đi đâu?", en: "Where does this bus go?", explanation_vi: "ਜਾਂਦੀ agrees với ਬੱਸ.", explanation_en: "ਜਾਂਦੀ agrees with ਬੱਸ." },
      { pa: "ਮੈਂ ਦਸ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵਾਂਗਾ।", romanization: "main das mint der naal aavanga.", vi: "Tôi sẽ đến muộn mười phút. (nam)", en: "I will be ten minutes late. (male speaker)", explanation_vi: "ਦੇਰ ਨਾਲ = muộn; ਆਵਾਂਗਾ cho nam.", explanation_en: "ਦੇਰ ਨਾਲ = late; ਆਵਾਂਗਾ for male speaker." },
    ],
    traps: [
      { trap_vi: "Trong mẫu này, đừng dùng ਜਾਂਦਾ với ਬੱਸ.", trap_en: "In this pattern, do not use ਜਾਂਦਾ with ਬੱਸ.", better_pa: "ਬੱਸ ਜਾਂਦੀ ਹੈ।", better_romanization: "bass jandi hai." },
    ],
    next_if_ready_vi: "Đi tiếp housing: báo vấn đề nhà ở.",
    next_if_ready_en: "Move to housing: report household issues.",
    review_if_stuck_vi: "Ôn bus/train agreement và future endings.",
    review_if_stuck_en: "Review bus/train agreement and future endings.",
  },
  {
    id: "pa_a2_journey_housing",
    stage: "housing",
    mode: "handoff",
    title_vi: "Nhà ở và sửa chữa",
    title_en: "Housing and repairs",
    learner_goal_vi: "Mô tả vấn đề trong nhà bằng câu trung tính, lịch sự.",
    learner_goal_en: "Describe a household problem in a neutral, polite way.",
    handoff_vi: "Sau bước này, người học có thể gửi tin nhắn landlord đơn giản.",
    handoff_en: "After this step, the learner can send a simple landlord message.",
    readiness_check_vi: "Có thể nêu vị trí + vấn đề + request lịch sự.",
    readiness_check_en: "Can state location + problem + polite request.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Heater, leak, landlord, basement là loanwords thường gặp.",
    canada_practical_en: "Heater, leak, landlord, basement are common loanwords.",
    can_do: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "maaf karna, heater kamm nahi kar riha.", vi: "Xin lỗi, máy sưởi không hoạt động.", en: "Sorry, the heater is not working.", explanation_vi: "ਮਾਫ਼ ਕਰਨਾ làm câu mềm.", explanation_en: "ਮਾਫ਼ ਕਰਨਾ softens the sentence." },
      { pa: "ਰਸੋਈ ਵਿੱਚ ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "rasoi vich paani leak ho riha hai.", vi: "Nước đang rò trong bếp.", en: "Water is leaking in the kitchen.", explanation_vi: "ਵਿੱਚ đánh dấu vị trí.", explanation_en: "ਵਿੱਚ marks location." },
    ],
    traps: [
      { trap_vi: "Đừng bắt đầu bằng mệnh lệnh mạnh khi báo lỗi.", trap_en: "Do not start with a strong command when reporting a problem.", better_pa: "ਮਾਫ਼ ਕਰਨਾ, ਇੱਕ ਸਮੱਸਿਆ ਹੈ।", better_romanization: "maaf karna, ikk samassia hai." },
    ],
    next_if_ready_vi: "Đi tiếp school/childcare: báo vắng và đón trẻ.",
    next_if_ready_en: "Move to school/childcare: absence and pickup.",
    review_if_stuck_vi: "Ôn ਵਿੱਚ, ਨਹੀਂ ਆ ਰਿਹਾ, ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ.",
    review_if_stuck_en: "Review ਵਿੱਚ, ਨਹੀਂ ਆ ਰਿਹਾ, ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ.",
  },
  {
    id: "pa_a2_journey_school",
    stage: "school",
    mode: "learn",
    title_vi: "Trường học",
    title_en: "School",
    learner_goal_vi: "Hỏi bài tập, phòng học, và báo con vắng học.",
    learner_goal_en: "Ask about homework, classroom location, and report child absence.",
    handoff_vi: "Sau bước này, người học có thể nhắn school office ngắn.",
    handoff_en: "After this step, the learner can send a short school-office message.",
    readiness_check_vi: "Có thể dùng ਕਦੋਂ, ਕਿਹੜੇ ਕਮਰੇ ਵਿੱਚ, ਨਹੀਂ ਆ ਸਕਦਾ.",
    readiness_check_en: "Can use ਕਦੋਂ, ਕਿਹੜੇ ਕਮਰੇ ਵਿੱਚ, ਨਹੀਂ ਆ ਸਕਦਾ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được với school office, adult class, parent-teacher note.",
    canada_practical_en: "Useful with school offices, adult classes, and parent-teacher notes.",
    can_do: [
      { pa: "ਹੋਮਵਰਕ ਕਦੋਂ ਦੇਣਾ ਹੈ?", romanization: "homework kadon dena hai?", vi: "Khi nào phải nộp bài tập?", en: "When is the homework due?", explanation_vi: "ਦੇਣਾ ở đây là nộp.", explanation_en: "ਦੇਣਾ here means submit." },
      { pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "mera bachcha ajj school nahi aa sakda.", vi: "Con tôi hôm nay không thể đến trường.", en: "My child cannot come to school today.", explanation_vi: "ਸਕਦਾ agrees với ਬੱਚਾ.", explanation_en: "ਸਕਦਾ agrees with ਬੱਚਾ." },
    ],
    traps: [
      { trap_vi: "ਮੇਰਾ/ਮੇਰੀ agrees với danh từ sau.", trap_en: "ਮੇਰਾ/ਮੇਰੀ agrees with the following noun.", better_pa: "ਮੇਰੀ ਕਲਾਸ", better_romanization: "meri class" },
    ],
    next_if_ready_vi: "Đi tiếp childcare: pickup và sức khỏe cơ bản.",
    next_if_ready_en: "Move to childcare: pickup and basic health.",
    review_if_stuck_vi: "Ôn possessives and question words.",
    review_if_stuck_en: "Review possessives and question words.",
  },
  {
    id: "pa_a2_journey_childcare",
    stage: "childcare",
    mode: "practice",
    title_vi: "Childcare và đón trẻ",
    title_en: "Childcare and pickup",
    learner_goal_vi: "Nói giờ đón, hỏi trẻ đã ăn chưa, và báo sức khỏe cơ bản.",
    learner_goal_en: "Say pickup time, ask whether the child ate, and report basic health.",
    handoff_vi: "Sau bước này, người học có thể xử lý pickup/drop-off cơ bản.",
    handoff_en: "After this step, the learner can handle basic pickup/drop-off.",
    readiness_check_vi: "Có thể dùng ਲੈਣ ਆਉਣਾ và ਉਸਨੂੰ ... ਹੈ.",
    readiness_check_en: "Can use ਲੈਣ ਆਉਣਾ and ਉਸਨੂੰ ... ਹੈ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Daycare, pickup, lunch box thường được mượn âm trong Punjabi Canada.",
    canada_practical_en: "Daycare, pickup, lunch box are often borrowed in Canadian Punjabi.",
    can_do: [
      { pa: "ਮੈਂ ਬੱਚੇ ਨੂੰ ਪੰਜ ਵਜੇ ਲੈਣ ਆਵਾਂਗੀ।", romanization: "main bachche nu panj vaje lain aavangi.", vi: "Tôi sẽ đến đón trẻ lúc năm giờ. (nữ)", en: "I will come to pick up the child at five. (female speaker)", explanation_vi: "ਬੱਚੇ ਨੂੰ đánh dấu trẻ được đón.", explanation_en: "ਬੱਚੇ ਨੂੰ marks the child being picked up." },
      { pa: "ਉਸਨੂੰ ਥੋੜ੍ਹਾ ਬੁਖਾਰ ਹੈ।", romanization: "usnu thoda bukhar hai.", vi: "Bé hơi sốt.", en: "The child has a slight fever.", explanation_vi: "Sức khỏe dùng ਉਸਨੂੰ.", explanation_en: "Health conditions use ਉਸਨੂੰ." },
    ],
    traps: [
      { trap_vi: "Không nói ਉਹ ਬੁਖਾਰ ਹੈ.", trap_en: "Do not say ਉਹ ਬੁਖਾਰ ਹੈ.", better_pa: "ਉਸਨੂੰ ਬੁਖਾਰ ਹੈ।", better_romanization: "usnu bukhar hai." },
    ],
    next_if_ready_vi: "Đi tiếp workplace small talk.",
    next_if_ready_en: "Move to workplace small talk.",
    review_if_stuck_vi: "Ôn ਨੂੰ and health condition pattern.",
    review_if_stuck_en: "Review ਨੂੰ and the health condition pattern.",
  },
  {
    id: "pa_a2_journey_workplace_small_talk",
    stage: "workplace_small_talk",
    mode: "handoff",
    title_vi: "Small talk nơi làm việc",
    title_en: "Workplace small talk",
    learner_goal_vi: "Mở đầu nhẹ nhàng với đồng nghiệp bằng chủ đề an toàn.",
    learner_goal_en: "Open gently with coworkers using safe topics.",
    handoff_vi: "Sau bước này, người học có thể chuyển sang check-in công việc B1.",
    handoff_en: "After this step, the learner can move toward B1 work check-ins.",
    readiness_check_vi: "Có thể dùng ਤੁਹਾਡਾ/ਤੁਸੀਂ thay vì ਤੇਰਾ/ਤੂੰ khi cần lịch sự.",
    readiness_check_en: "Can use ਤੁਹਾਡਾ/ਤੁਸੀਂ instead of ਤੇਰਾ/ਤੂੰ when politeness is needed.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Weekend/weather small talk là lựa chọn an toàn trong workplace Canada.",
    canada_practical_en: "Weekend/weather small talk is safe in Canadian workplaces.",
    can_do: [
      { pa: "ਤੁਹਾਡਾ ਵੀਕਐਂਡ ਕਿਵੇਂ ਸੀ?", romanization: "tuhada weekend kiven si?", vi: "Cuối tuần của bạn thế nào?", en: "How was your weekend?", explanation_vi: "ਤੁਹਾਡਾ lịch sự hơn ਤੇਰਾ.", explanation_en: "ਤੁਹਾਡਾ is more polite than ਤੇਰਾ." },
      { pa: "ਕੰਮ ਕਿਵੇਂ ਚੱਲ ਰਿਹਾ ਹੈ?", romanization: "kamm kiven chall riha hai?", vi: "Công việc đang thế nào?", en: "How is work going?", explanation_vi: "ਚੱਲ ਰਿਹਾ = đang diễn tiến.", explanation_en: "ਚੱਲ ਰਿਹਾ = going/progressing." },
    ],
    traps: [
      { trap_vi: "ਤੂੰ/ਤੇਰਾ có thể quá thân mật ở workplace.", trap_en: "ਤੂੰ/ਤੇਰਾ can be too intimate at work.", better_pa: "ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", better_romanization: "tuhada din kiven hai." },
    ],
    next_if_ready_vi: "Đi tiếp repair phrases.",
    next_if_ready_en: "Move to repair phrases.",
    review_if_stuck_vi: "Ôn polite pronouns and safe topics.",
    review_if_stuck_en: "Review polite pronouns and safe topics.",
  },
  {
    id: "pa_a2_journey_repair_phrases",
    stage: "repair_phrases",
    mode: "readiness",
    title_vi: "Repair phrases",
    title_en: "Repair phrases",
    learner_goal_vi: "Xin nhắc lại, xin nói chậm, hỏi nghĩa, và xác nhận chi tiết.",
    learner_goal_en: "Ask for repetition, slower speech, meaning, and detail confirmation.",
    handoff_vi: "Sau bước này, người học ít bị kẹt khi hội thoại thật.",
    handoff_en: "After this step, the learner is less likely to freeze in real conversation.",
    readiness_check_vi: "Có thể dùng repair phrase thay vì đoán.",
    readiness_check_en: "Can use a repair phrase instead of guessing.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    can_do: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusi dubara keh sakde ho?", vi: "Xin lỗi, bạn có thể nói lại không?", en: "Sorry, can you say that again?", explanation_vi: "ਤੁਸੀਂ + ਸਕਦੇ ਹੋ lịch sự.", explanation_en: "ਤੁਸੀਂ + ਸਕਦੇ ਹੋ is polite." },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਥੋੜ੍ਹਾ ਹੌਲੀ ਬੋਲੋ।", romanization: "kirpa karke thoda hauli bolo.", vi: "Làm ơn nói chậm hơn một chút.", en: "Please speak a little slower.", explanation_vi: "ਹੌਲੀ = chậm.", explanation_en: "ਹੌਲੀ = slowly." },
    ],
    traps: [
      { trap_vi: "Đừng chỉ nói ਕੀ? với người lạ.", trap_en: "Do not only say ਕੀ? to a stranger.", better_pa: "ਮਾਫ਼ ਕਰਨਾ, ਦੁਬਾਰਾ ਕਹੋ ਜੀ।", better_romanization: "maaf karna, dubara kaho ji." },
    ],
    next_if_ready_vi: "Đi tiếp polite problem descriptions.",
    next_if_ready_en: "Move to polite problem descriptions.",
    review_if_stuck_vi: "Ôn ਦੁਬਾਰਾ, ਹੌਲੀ, ਮਤਲਬ.",
    review_if_stuck_en: "Review ਦੁਬਾਰਾ, ਹੌਲੀ, ਮਤਲਬ.",
  },
  {
    id: "pa_a2_journey_polite_problem",
    stage: "polite_problem_descriptions",
    mode: "readiness",
    title_vi: "Mô tả vấn đề lịch sự",
    title_en: "Polite problem descriptions",
    learner_goal_vi: "Báo vấn đề và xin giúp mà không thô.",
    learner_goal_en: "Report a problem and ask for help without sounding abrupt.",
    handoff_vi: "Đây là bước handoff cuối của A2: người học sẵn sàng vào B1 practical conversations.",
    handoff_en: "This is the final A2 handoff: the learner is ready for B1 practical conversations.",
    readiness_check_vi: "Có thể mở đầu bằng ਮਾਫ਼ ਕਰਨਾ và dùng ਕੀ ਤੁਸੀਂ... ਸਕਦੇ ਹੋ?",
    readiness_check_en: "Can open with ਮਾਫ਼ ਕਰਨਾ and use ਕੀ ਤੁਸੀਂ... ਸਕਦੇ ਹੋ?",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được ở service counter, clinic, school office, landlord message.",
    canada_practical_en: "Useful at service counters, clinics, school offices, and in landlord messages.",
    can_do: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਇੱਕ ਛੋਟੀ ਸਮੱਸਿਆ ਹੈ।", romanization: "maaf karna, mainu ikk chhoti samassia hai.", vi: "Xin lỗi, tôi có một vấn đề nhỏ.", en: "Sorry, I have a small problem.", explanation_vi: "ਛੋਟੀ làm câu mềm hơn.", explanation_en: "ਛੋਟੀ softens the sentence." },
      { pa: "ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusi madad kar sakde ho?", vi: "Bạn có thể giúp không?", en: "Can you help?", explanation_vi: "Câu hỏi lịch sự thay cho mệnh lệnh.", explanation_en: "A polite question instead of a command." },
    ],
    traps: [
      { trap_vi: "Đừng dùng mệnh lệnh ngắn với người lạ nếu có thể hỏi lịch sự.", trap_en: "Do not use a short command with strangers when a polite question works.", better_pa: "ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?", better_romanization: "ki tusi madad kar sakde ho?" },
    ],
    next_if_ready_vi: "Handoff sang B1: nối lý do, giải thích chi tiết, và follow-up.",
    next_if_ready_en: "Handoff to B1: connect reasons, explain details, and follow up.",
    review_if_stuck_vi: "Ôn ਮੈਨੂੰ ... ਹੈ and polite request frames.",
    review_if_stuck_en: "Review ਮੈਨੂੰ ... ਹੈ and polite request frames.",
  },
];
