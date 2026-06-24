// src/languages/punjabi/scenarioRecallDeckA2.ts
//
// Punjabi A2 scenario recall deck for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred.

export type PunjabiScenarioRecallA2Scenario =
  | "appointments"
  | "shopping"
  | "transport"
  | "housing"
  | "school"
  | "childcare"
  | "workplace_small_talk"
  | "polite_problem_descriptions"
  | "repair_phrases";

export type PunjabiScenarioRecallA2Mode =
  | "recall"
  | "review"
  | "routing"
  | "integration_readiness";

export type PunjabiScenarioRecallA2Response = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
  explanation_vi: string;
  explanation_en: string;
};

export type PunjabiScenarioRecallA2Trap = {
  trap_vi: string;
  trap_en: string;
  better_pa: string;
  better_romanization: string;
};

export type PunjabiScenarioRecallA2Card = {
  id: string;
  scenario: PunjabiScenarioRecallA2Scenario;
  mode: PunjabiScenarioRecallA2Mode;
  title_vi: string;
  title_en: string;
  cue_vi: string;
  cue_en: string;
  expected: PunjabiScenarioRecallA2Response;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  traps: PunjabiScenarioRecallA2Trap[];
  route_if_easy_vi: string;
  route_if_easy_en: string;
  route_if_hard_vi: string;
  route_if_hard_en: string;
};

const scriptAwarenessVi = "Gurmukhi là chữ chính trong deck nhớ lại tình huống; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn = "Gurmukhi is the main script in this scenario recall deck; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const scenarioRecallDeckA2: PunjabiScenarioRecallA2Card[] = [
  {
    id: "pa_a2_recall_appointment_confirm",
    scenario: "appointments",
    mode: "recall",
    title_vi: "Nhớ lại: xác nhận lịch hẹn",
    title_en: "Recall: confirm an appointment",
    cue_vi: "Bạn cần nói: Lịch hẹn của tôi lúc hai giờ.",
    cue_en: "You need to say: My appointment is at two.",
    expected: { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਦੋ ਵਜੇ ਹੈ।", romanization: "meri appointment do vaje hai.", vi: "Lịch hẹn của tôi lúc hai giờ.", en: "My appointment is at two.", explanation_vi: "ਦੋ ਵਜੇ = lúc hai giờ; ਮੇਰੀ agrees với ਅਪਾਇੰਟਮੈਂਟ.", explanation_en: "ਦੋ ਵਜੇ = at two; ਮੇਰੀ agrees with ਅਪਾਇੰਟਮੈਂਟ." },
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "ਅਪਾਇੰਟਮੈਂਟ là loanword thường gặp ở clinic Canada.",
    canada_practical_en: "ਅਪਾਇੰਟਮੈਂਟ is a common loanword in Canadian clinics.",
    traps: [{ trap_vi: "Đừng nói chỉ ਦੋ cho giờ hẹn.", trap_en: "Do not say only ਦੋ for appointment time.", better_pa: "ਦੋ ਵਜੇ", better_romanization: "do vaje" }],
    route_if_easy_vi: "Tăng độ khó: đổi lịch qua điện thoại.",
    route_if_easy_en: "Increase difficulty: reschedule by phone.",
    route_if_hard_vi: "Ôn giờ với ਵਜੇ và ngày với ਨੂੰ.",
    route_if_hard_en: "Review clock time with ਵਜੇ and days with ਨੂੰ.",
  },
  {
    id: "pa_a2_recall_appointment_move",
    scenario: "appointments",
    mode: "routing",
    title_vi: "Routing: đổi lịch",
    title_en: "Routing: reschedule",
    cue_vi: "Bạn muốn hỏi: Thứ Sáu lúc ba giờ có giờ trống không?",
    cue_en: "You want to ask: Is a time available Friday at three?",
    expected: { pa: "ਕੀ ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ?", romanization: "ki shukkarvaar tinn vaje sama mil sakda hai?", vi: "Thứ Sáu lúc ba giờ có giờ trống không?", en: "Is a time available Friday at three?", explanation_vi: "ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ? là cách hỏi lịch sự về availability.", explanation_en: "ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ? politely asks about availability." },
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được với dentist, family doctor, settlement appointment.",
    canada_practical_en: "Useful for dentist, family doctor, and settlement appointments.",
    traps: [{ trap_vi: "Khi đổi lịch, nói rõ ngày và giờ mới.", trap_en: "When rescheduling, state the new day and time clearly.", better_pa: "ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ", better_romanization: "shukkarvaar tinn vaje" }],
    route_if_easy_vi: "Thêm lý do đổi lịch bằng một câu đơn giản.",
    route_if_easy_en: "Add a simple reason for rescheduling.",
    route_if_hard_vi: "Ôn polite question ਕੀ... ਸਕਦਾ ਹੈ?",
    route_if_hard_en: "Review the polite question ਕੀ... ਸਕਦਾ ਹੈ?",
  },
  {
    id: "pa_a2_recall_shopping_need",
    scenario: "shopping",
    mode: "recall",
    title_vi: "Nhớ lại: cần mua đồ",
    title_en: "Recall: need to buy something",
    cue_vi: "Ở hiệu thuốc, nói: Tôi cần thuốc ho.",
    cue_en: "At a pharmacy, say: I need cough medicine.",
    expected: { pa: "ਮੈਨੂੰ ਖਾਂਸੀ ਦੀ ਦਵਾਈ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu khansi di davai chahidi hai.", vi: "Tôi cần thuốc ho.", en: "I need cough medicine.", explanation_vi: "ਚਾਹੀਦੀ agrees với ਦਵਾਈ giống cái.", explanation_en: "ਚਾਹੀਦੀ agrees with feminine ਦਵਾਈ." },
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "ਫਾਰਮੇਸੀ và ਰਸੀਦ thường xuất hiện trong Punjabi Canada.",
    canada_practical_en: "ਫਾਰਮੇਸੀ and ਰਸੀਦ often appear in Canadian Punjabi.",
    traps: [{ trap_vi: "ਚਾਹੀਦਾ agrees với vật cần, không với người nói.", trap_en: "ਚਾਹੀਦਾ agrees with the needed item, not the speaker.", better_pa: "ਦਵਾਈ ਚਾਹੀਦੀ ਹੈ।", better_romanization: "davai chahidi hai." }],
    route_if_easy_vi: "Thêm câu hỏi giá.",
    route_if_easy_en: "Add a price question.",
    route_if_hard_vi: "Ôn ਚਾਹੀਦਾ/ਚਾਹੀਦੀ/ਚਾਹੀਦੇ.",
    route_if_hard_en: "Review ਚਾਹੀਦਾ/ਚਾਹੀਦੀ/ਚਾਹੀਦੇ.",
  },
  {
    id: "pa_a2_recall_transport_route",
    scenario: "transport",
    mode: "review",
    title_vi: "Ôn: hỏi tuyến",
    title_en: "Review: ask route",
    cue_vi: "Bạn đang ở trạm. Hỏi: Xe buýt này đi đâu?",
    cue_en: "You are at a stop. Ask: Where does this bus go?",
    expected: { pa: "ਇਹ ਬੱਸ ਕਿੱਥੇ ਜਾਂਦੀ ਹੈ?", romanization: "eh bass kitthe jandi hai?", vi: "Xe buýt này đi đâu?", en: "Where does this bus go?", explanation_vi: "ਜਾਂਦੀ agrees với ਬੱਸ trong mẫu này.", explanation_en: "ਜਾਂਦੀ agrees with ਬੱਸ in this pattern." },
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Có thể thay bằng TTC, SkyTrain, Surrey Central.",
    canada_practical_en: "You can swap in TTC, SkyTrain, Surrey Central.",
    traps: [{ trap_vi: "Đừng dùng ਜਾਂਦਾ với ਬੱਸ trong mẫu này.", trap_en: "Do not use ਜਾਂਦਾ with ਬੱਸ in this pattern.", better_pa: "ਬੱਸ ਜਾਂਦੀ ਹੈ।", better_romanization: "bass jandi hai." }],
    route_if_easy_vi: "Hỏi tiếp điểm xuống.",
    route_if_easy_en: "Ask next where to get off.",
    route_if_hard_vi: "Ôn ਕਿੱਥੇ và agreement với ਬੱਸ.",
    route_if_hard_en: "Review ਕਿੱਥੇ and agreement with ਬੱਸ.",
  },
  {
    id: "pa_a2_recall_transport_late",
    scenario: "transport",
    mode: "integration_readiness",
    title_vi: "Readiness: báo trễ",
    title_en: "Readiness: report delay",
    cue_vi: "Nhắn: Tôi sẽ đến muộn mười phút. (nam)",
    cue_en: "Text: I will be ten minutes late. (male speaker)",
    expected: { pa: "ਮੈਂ ਦਸ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵਾਂਗਾ।", romanization: "main das mint der naal aavanga.", vi: "Tôi sẽ đến muộn mười phút.", en: "I will be ten minutes late.", explanation_vi: "ਦੇਰ ਨਾਲ = muộn; ਆਵਾਂਗਾ cho nam.", explanation_en: "ਦੇਰ ਨਾਲ = late; ਆਵਾਂਗਾ for a male speaker." },
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Báo trễ bằng số phút cụ thể là thực tế trong workplace/appointment.",
    canada_practical_en: "Giving exact delay minutes is practical for work/appointments.",
    traps: [{ trap_vi: "Người nói nữ dùng ਆਵਾਂਗੀ.", trap_en: "A female speaker uses ਆਵਾਂਗੀ.", better_pa: "ਮੈਂ ਦੇਰ ਨਾਲ ਆਵਾਂਗੀ।", better_romanization: "main der naal aavangi." }],
    route_if_easy_vi: "Thêm lý do: bus trễ.",
    route_if_easy_en: "Add a reason: the bus is late.",
    route_if_hard_vi: "Ôn future endings -ਗਾ/-ਗੀ.",
    route_if_hard_en: "Review future endings -ਗਾ/-ਗੀ.",
  },
  {
    id: "pa_a2_recall_housing_heater",
    scenario: "housing",
    mode: "recall",
    title_vi: "Nhớ lại: heater hỏng",
    title_en: "Recall: heater issue",
    cue_vi: "Nói lịch sự: Xin lỗi, máy sưởi không hoạt động.",
    cue_en: "Say politely: Sorry, the heater is not working.",
    expected: { pa: "ਮਾਫ਼ ਕਰਨਾ, ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "maaf karna, heater kamm nahi kar riha.", vi: "Xin lỗi, máy sưởi không hoạt động.", en: "Sorry, the heater is not working.", explanation_vi: "ਮਾਫ਼ ਕਰਨਾ làm câu mềm; ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ mô tả thiết bị lỗi.", explanation_en: "ਮਾਫ਼ ਕਰਨਾ softens the sentence; ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ describes a device not working." },
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Heater là loanword thường dùng trong tin nhắn landlord.",
    canada_practical_en: "Heater is a common loanword in landlord messages.",
    traps: [{ trap_vi: "Đừng mở đầu bằng mệnh lệnh mạnh.", trap_en: "Do not open with a strong command.", better_pa: "ਮਾਫ਼ ਕਰਨਾ, ਇੱਕ ਸਮੱਸਿਆ ਹੈ।", better_romanization: "maaf karna, ikk samassia hai." }],
    route_if_easy_vi: "Thêm thời gian bắt đầu: từ sáng nay.",
    route_if_easy_en: "Add when it started: since this morning.",
    route_if_hard_vi: "Ôn polite problem openers.",
    route_if_hard_en: "Review polite problem openers.",
  },
  {
    id: "pa_a2_recall_housing_leak",
    scenario: "housing",
    mode: "review",
    title_vi: "Ôn: rò nước",
    title_en: "Review: water leak",
    cue_vi: "Nói: Nước đang rò trong bếp.",
    cue_en: "Say: Water is leaking in the kitchen.",
    expected: { pa: "ਰਸੋਈ ਵਿੱਚ ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "rasoi vich paani leak ho riha hai.", vi: "Nước đang rò trong bếp.", en: "Water is leaking in the kitchen.", explanation_vi: "ਰਸੋਈ ਵਿੱਚ = trong bếp; ਹੋ ਰਿਹਾ ਹੈ diễn tả đang xảy ra.", explanation_en: "ਰਸੋਈ ਵਿੱਚ = in the kitchen; ਹੋ ਰਿਹਾ ਹੈ marks ongoing action." },
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Leak/maintenance messages rất thực tế trong apartment Canada.",
    canada_practical_en: "Leak/maintenance messages are practical in Canadian apartments.",
    traps: [{ trap_vi: "Đừng bỏ ਵਿੱਚ vì nó giữ vị trí vấn đề.", trap_en: "Do not omit ਵਿੱਚ because it marks the problem location.", better_pa: "ਰਸੋਈ ਵਿੱਚ", better_romanization: "rasoi vich" }],
    route_if_easy_vi: "Thêm request: Bạn có thể đến xem không?",
    route_if_easy_en: "Add a request: Can you come and look?",
    route_if_hard_vi: "Ôn location + problem pattern.",
    route_if_hard_en: "Review location + problem pattern.",
  },
  {
    id: "pa_a2_recall_school_homework",
    scenario: "school",
    mode: "recall",
    title_vi: "Nhớ lại: hỏi bài tập",
    title_en: "Recall: ask homework",
    cue_vi: "Hỏi: Khi nào phải nộp bài tập?",
    cue_en: "Ask: When is the homework due?",
    expected: { pa: "ਹੋਮਵਰਕ ਕਦੋਂ ਦੇਣਾ ਹੈ?", romanization: "homework kadon dena hai?", vi: "Khi nào phải nộp bài tập?", en: "When is the homework due?", explanation_vi: "ਦੇਣਾ ở đây nghĩa là nộp.", explanation_en: "ਦੇਣਾ here means submit." },
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được với school office hoặc adult class.",
    canada_practical_en: "Useful with school offices or adult classes.",
    traps: [{ trap_vi: "Đừng dịch ਦੇਣਾ quá cứng là 'cho' trong ngữ cảnh này.", trap_en: "Do not translate ਦੇਣਾ too rigidly as 'give' here.", better_pa: "ਹੋਮਵਰਕ ਦੇਣਾ", better_romanization: "homework dena" }],
    route_if_easy_vi: "Hỏi tiếp lớp ở phòng nào.",
    route_if_easy_en: "Ask next which room the class is in.",
    route_if_hard_vi: "Ôn question words ਕਦੋਂ/ਕਿੱਥੇ/ਕਿਹੜਾ.",
    route_if_hard_en: "Review question words ਕਦੋਂ/ਕਿੱਥੇ/ਕਿਹੜਾ.",
  },
  {
    id: "pa_a2_recall_school_absence",
    scenario: "school",
    mode: "routing",
    title_vi: "Routing: báo vắng học",
    title_en: "Routing: report absence",
    cue_vi: "Nói: Con tôi hôm nay không thể đến trường.",
    cue_en: "Say: My child cannot come to school today.",
    expected: { pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "mera bachcha ajj school nahi aa sakda.", vi: "Con tôi hôm nay không thể đến trường.", en: "My child cannot come to school today.", explanation_vi: "ਸਕਦਾ agrees với ਬੱਚਾ; ਮੇਰਾ agrees với ਬੱਚਾ.", explanation_en: "ਸਕਦਾ agrees with ਬੱਚਾ; ਮੇਰਾ agrees with ਬੱਚਾ." },
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "School absence messages nên có ngày và lý do ngắn.",
    canada_practical_en: "School absence messages should include date and a short reason.",
    traps: [{ trap_vi: "ਮੇਰਾ/ਮੇਰੀ agrees với danh từ sau, không với người nói.", trap_en: "ਮੇਰਾ/ਮੇਰੀ agrees with the following noun, not the speaker.", better_pa: "ਮੇਰਾ ਬੱਚਾ", better_romanization: "mera bachcha" }],
    route_if_easy_vi: "Thêm lý do: bị sốt.",
    route_if_easy_en: "Add a reason: has a fever.",
    route_if_hard_vi: "Ôn ਸਕਦਾ/ਸਕਦੀ and possessives.",
    route_if_hard_en: "Review ਸਕਦਾ/ਸਕਦੀ and possessives.",
  },
  {
    id: "pa_a2_recall_childcare_pickup",
    scenario: "childcare",
    mode: "integration_readiness",
    title_vi: "Readiness: đón trẻ",
    title_en: "Readiness: child pickup",
    cue_vi: "Nói: Tôi sẽ đến đón trẻ lúc năm giờ. (nữ)",
    cue_en: "Say: I will pick up the child at five. (female speaker)",
    expected: { pa: "ਮੈਂ ਬੱਚੇ ਨੂੰ ਪੰਜ ਵਜੇ ਲੈਣ ਆਵਾਂਗੀ।", romanization: "main bachche nu panj vaje lain aavangi.", vi: "Tôi sẽ đến đón trẻ lúc năm giờ.", en: "I will come to pick up the child at five.", explanation_vi: "ਬੱਚੇ ਨੂੰ đánh dấu trẻ được đón; ਆਵਾਂਗੀ cho nữ.", explanation_en: "ਬੱਚੇ ਨੂੰ marks the child being picked up; ਆਵਾਂਗੀ for a female speaker." },
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Daycare/pickup là tình huống rất thực tế ở Canada.",
    canada_practical_en: "Daycare/pickup is a practical Canadian context.",
    traps: [{ trap_vi: "Người nói nam dùng ਆਵਾਂਗਾ.", trap_en: "A male speaker uses ਆਵਾਂਗਾ.", better_pa: "ਮੈਂ ਲੈਣ ਆਵਾਂਗਾ।", better_romanization: "main lain aavanga." }],
    route_if_easy_vi: "Hỏi thêm bé đã ăn chưa.",
    route_if_easy_en: "Ask whether the child ate.",
    route_if_hard_vi: "Ôn ਲੈਣ ਆਉਣਾ and future endings.",
    route_if_hard_en: "Review ਲੈਣ ਆਉਣਾ and future endings.",
  },
  {
    id: "pa_a2_recall_work_smalltalk",
    scenario: "workplace_small_talk",
    mode: "review",
    title_vi: "Ôn: small talk",
    title_en: "Review: small talk",
    cue_vi: "Hỏi lịch sự với đồng nghiệp: Cuối tuần của bạn thế nào?",
    cue_en: "Ask a coworker politely: How was your weekend?",
    expected: { pa: "ਤੁਹਾਡਾ ਵੀਕਐਂਡ ਕਿਵੇਂ ਸੀ?", romanization: "tuhada weekend kiven si?", vi: "Cuối tuần của bạn thế nào?", en: "How was your weekend?", explanation_vi: "ਤੁਹਾਡਾ lịch sự hơn ਤੇਰਾ.", explanation_en: "ਤੁਹਾਡਾ is more polite than ਤੇਰਾ." },
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Weekend/weather small talk an toàn trong workplace Canada.",
    canada_practical_en: "Weekend/weather small talk is safe in Canadian workplaces.",
    traps: [{ trap_vi: "ਤੂੰ/ਤੇਰਾ có thể quá thân mật ở workplace.", trap_en: "ਤੂੰ/ਤੇਰਾ can be too intimate at work.", better_pa: "ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", better_romanization: "tuhada din kiven hai?" }],
    route_if_easy_vi: "Hỏi tiếp công việc đang thế nào.",
    route_if_easy_en: "Ask next how work is going.",
    route_if_hard_vi: "Ôn polite pronouns ਤੁਸੀਂ/ਤੁਹਾਡਾ.",
    route_if_hard_en: "Review polite pronouns ਤੁਸੀਂ/ਤੁਹਾਡਾ.",
  },
  {
    id: "pa_a2_recall_polite_problem",
    scenario: "polite_problem_descriptions",
    mode: "recall",
    title_vi: "Nhớ lại: mô tả vấn đề",
    title_en: "Recall: describe a problem",
    cue_vi: "Nói lịch sự: Xin lỗi, tôi có một vấn đề nhỏ.",
    cue_en: "Say politely: Sorry, I have a small problem.",
    expected: { pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਇੱਕ ਛੋਟੀ ਸਮੱਸਿਆ ਹੈ।", romanization: "maaf karna, mainu ikk chhoti samassia hai.", vi: "Xin lỗi, tôi có một vấn đề nhỏ.", en: "Sorry, I have a small problem.", explanation_vi: "ਮਾਫ਼ ਕਰਨਾ và ਛੋਟੀ làm câu mềm hơn.", explanation_en: "ਮਾਫ਼ ਕਰਨਾ and ਛੋਟੀ soften the sentence." },
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được ở service counter, clinic, school office.",
    canada_practical_en: "Useful at service counters, clinics, and school offices.",
    traps: [{ trap_vi: "Đừng bắt đầu bằng mệnh lệnh khi cần giúp.", trap_en: "Do not start with a command when asking for help.", better_pa: "ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?", better_romanization: "ki tusi madad kar sakde ho?" }],
    route_if_easy_vi: "Thêm câu xin giúp.",
    route_if_easy_en: "Add a request for help.",
    route_if_hard_vi: "Ôn ਮੈਨੂੰ ... ਹੈ pattern.",
    route_if_hard_en: "Review the ਮੈਨੂੰ ... ਹੈ pattern.",
  },
  {
    id: "pa_a2_recall_repair_repeat",
    scenario: "repair_phrases",
    mode: "recall",
    title_vi: "Nhớ lại: xin nhắc lại",
    title_en: "Recall: ask for repetition",
    cue_vi: "Nói lịch sự: Xin lỗi, bạn có thể nói lại không?",
    cue_en: "Say politely: Sorry, can you say that again?",
    expected: { pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusi dubara keh sakde ho?", vi: "Xin lỗi, bạn có thể nói lại không?", en: "Sorry, can you say that again?", explanation_vi: "ਤੁਸੀਂ + ਸਕਦੇ ਹੋ tạo câu hỏi lịch sự.", explanation_en: "ਤੁਸੀਂ + ਸਕਦੇ ਹੋ creates a polite question." },
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    traps: [{ trap_vi: "Đừng chỉ nói ਕੀ? với người lạ.", trap_en: "Do not only say ਕੀ? to a stranger.", better_pa: "ਮਾਫ਼ ਕਰਨਾ, ਦੁਬਾਰਾ ਕਹੋ ਜੀ।", better_romanization: "maaf karna, dubara kaho ji." }],
    route_if_easy_vi: "Thêm câu: Tôi đang học Punjabi.",
    route_if_easy_en: "Add: I am learning Punjabi.",
    route_if_hard_vi: "Ôn repair phrase set.",
    route_if_hard_en: "Review the repair phrase set.",
  },
  {
    id: "pa_a2_recall_repair_slow",
    scenario: "repair_phrases",
    mode: "integration_readiness",
    title_vi: "Readiness: xin nói chậm",
    title_en: "Readiness: ask slower",
    cue_vi: "Xin người kia nói chậm hơn một chút.",
    cue_en: "Ask the other person to speak a little slower.",
    expected: { pa: "ਕਿਰਪਾ ਕਰਕੇ ਥੋੜ੍ਹਾ ਹੌਲੀ ਬੋਲੋ।", romanization: "kirpa karke thoda hauli bolo.", vi: "Làm ơn nói chậm hơn một chút.", en: "Please speak a little slower.", explanation_vi: "ਕਿਰਪਾ ਕਰਕੇ làm câu lịch sự; ਹੌਲੀ = chậm.", explanation_en: "ਕਿਰਪਾ ਕਰਕੇ makes it polite; ਹੌਲੀ = slowly." },
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    traps: [{ trap_vi: "Khi chưa hiểu, dùng repair phrase thay vì đoán.", trap_en: "When you do not understand, use a repair phrase instead of guessing.", better_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ।", better_romanization: "mainu samajh nahi aai." }],
    route_if_easy_vi: "Hỏi tiếp nghĩa của một từ.",
    route_if_easy_en: "Ask next what a word means.",
    route_if_hard_vi: "Ôn ਕਿਰਪਾ ਕਰਕੇ and ਹੌਲੀ.",
    route_if_hard_en: "Review ਕਿਰਪਾ ਕਰਕੇ and ਹੌਲੀ.",
  },
];
