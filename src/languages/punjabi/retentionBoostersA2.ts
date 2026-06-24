// src/languages/punjabi/retentionBoostersA2.ts
//
// Punjabi A2 retention boosters for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred.

export type PunjabiRetentionBoosterA2Scenario =
  | "daily_routine"
  | "appointments"
  | "transport"
  | "housing"
  | "school"
  | "childcare"
  | "workplace_small_talk"
  | "short_messages"
  | "polite_repair_phrases"
  | "service_counter_follow_up";

export type PunjabiRetentionBoosterA2Style =
  | "retention_booster"
  | "stress_test"
  | "final_risk"
  | "final_qa";

export type PunjabiRetentionBoosterA2Line = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiRetentionBoosterA2Trap = {
  trap_vi: string;
  trap_en: string;
  fix_pa: string;
  fix_romanization: string;
};

export type PunjabiRetentionBoosterA2Item = {
  id: string;
  scenario: PunjabiRetentionBoosterA2Scenario;
  style: PunjabiRetentionBoosterA2Style;
  title_vi: string;
  title_en: string;
  retrieval_practice_vi: string;
  retrieval_practice_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  clue_lines: PunjabiRetentionBoosterA2Line[];
  final_qa: {
    q_vi: string;
    q_en: string;
    answer_pa: string;
    answer_romanization: string;
    answer_vi: string;
    answer_en: string;
  }[];
  explanation_vi: string;
  explanation_en: string;
  traps: PunjabiRetentionBoosterA2Trap[];
  pass_signal_vi: string;
  pass_signal_en: string;
  owner_check_vi: string;
  owner_check_en: string;
};

const scriptAwarenessVi = "Gurmukhi là chữ chính trong retention boosters; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn = "Gurmukhi is the main script in these retention boosters; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const retentionBoostersA2: PunjabiRetentionBoosterA2Item[] = [
  {
    id: "pa_a2_retain_daily_routine",
    scenario: "daily_routine",
    style: "retention_booster",
    title_vi: "Retention booster: thói quen hằng ngày",
    title_en: "Retention booster: daily routine",
    retrieval_practice_vi: "Gọi lại một câu về thói quen sáng và một câu quá khứ ngắn.",
    retrieval_practice_en: "Recall one morning routine sentence and one short past sentence.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    clue_lines: [
      { pa: "ਮੈਂ ਸਵੇਰੇ ਸੱਤ ਵਜੇ ਉੱਠਦੀ ਹਾਂ।", romanization: "main savere satt vaje utthdi haan.", vi: "Tôi thức dậy lúc bảy giờ sáng. (nữ)", en: "I wake up at seven in the morning. (female speaker)" },
      { pa: "ਫਿਰ ਮੈਂ ਕੰਮ ਤੇ ਜਾਂਦੀ ਹਾਂ।", romanization: "phir main kamm te jandi haan.", vi: "Rồi tôi đi làm.", en: "Then I go to work." },
      { pa: "ਕੱਲ੍ਹ ਮੈਂ ਘਰ ਵਿੱਚ ਖਾਣਾ ਬਣਾਇਆ।", romanization: "kal main ghar vich khana banaia.", vi: "Hôm qua tôi nấu ăn ở nhà.", en: "Yesterday I cooked food at home." },
    ],
    final_qa: [
      { q_vi: "Giờ thức dậy?", q_en: "Wake-up time?", answer_pa: "ਸੱਤ ਵਜੇ", answer_romanization: "satt vaje", answer_vi: "Bảy giờ.", answer_en: "At seven." },
      { q_vi: "Việc hôm qua?", q_en: "Yesterday's action?", answer_pa: "ਖਾਣਾ ਬਣਾਇਆ", answer_romanization: "khana banaia", answer_vi: "Nấu ăn.", answer_en: "Cooked food." },
    ],
    explanation_vi: "Mẫu này giữ nhịp habitual + past action để người học nhớ lại nhanh.",
    explanation_en: "This pattern keeps habitual + past action so the learner can retrieve it quickly.",
    traps: [{ trap_vi: "Người nói nữ không dùng ਜਾਂਦਾ/ਉੱਠਦਾ.", trap_en: "A female speaker does not use ਜਾਂਦਾ/ਉੱਠਦਾ.", fix_pa: "ਮੈਂ ਜਾਂਦੀ ਹਾਂ।", fix_romanization: "main jandi haan." }],
    pass_signal_vi: "Có giờ, habitual, và một past-action line rõ.",
    pass_signal_en: "Has time, habitual, and one clear past-action line.",
    owner_check_vi: "Người học nhắc đúng nữ tính -ਦੀ và đặt động từ cuối câu.",
    owner_check_en: "The learner uses the correct feminine -ਦੀ and keeps the verb final.",
  },
  {
    id: "pa_a2_retain_appointments",
    scenario: "appointments",
    style: "stress_test",
    title_vi: "Stress test: lịch hẹn",
    title_en: "Stress test: appointments",
    retrieval_practice_vi: "Nhắc lại lịch cũ, lịch mới, và đồ cần mang.",
    retrieval_practice_en: "Recall the old time, the new time, and the item to bring.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Thực tế cho clinic, dentist, school office, hoặc settlement office ở Canada.",
    canada_practical_en: "Practical for clinics, dentists, school offices, or settlement offices in Canada.",
    clue_lines: [
      { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਬੁੱਧਵਾਰ ਦੋ ਵਜੇ ਹੈ।", romanization: "meri appointment budhvaar do vaje hai.", vi: "Lịch hẹn của tôi là thứ Tư lúc hai giờ.", en: "My appointment is Wednesday at two." },
      { pa: "ਕੀ ਮੈਂ ਇਸ ਨੂੰ ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ ਕਰ ਸਕਦੀ ਹਾਂ?", romanization: "ki main is nu shukkarvaar tinn vaje kar sakdi haan?", vi: "Tôi có thể đổi nó sang thứ Sáu lúc ba giờ không? (nữ)", en: "Can I make it Friday at three? (female speaker)" },
      { pa: "ਮੈਂ ਹੈਲਥ ਕਾਰਡ ਨਾਲ ਲਿਆਵਾਂਗੀ।", romanization: "main health card naal liaavangi.", vi: "Tôi sẽ mang thẻ y tế. (nữ)", en: "I will bring the health card. (female speaker)" },
    ],
    final_qa: [
      { q_vi: "Lịch cũ khi nào?", q_en: "Old appointment time?", answer_pa: "ਬੁੱਧਵਾਰ ਦੋ ਵਜੇ", answer_romanization: "budhvaar do vaje", answer_vi: "Thứ Tư lúc hai giờ.", answer_en: "Wednesday at two." },
      { q_vi: "Lịch mới khi nào?", q_en: "New appointment time?", answer_pa: "ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ", answer_romanization: "shukkarvaar tinn vaje", answer_vi: "Thứ Sáu lúc ba giờ.", answer_en: "Friday at three." },
    ],
    explanation_vi: "Người học phải giữ được day + time + document để chứng minh nhớ lịch hẹn.",
    explanation_en: "The learner must retain day + time + document to prove appointment recall.",
    traps: [{ trap_vi: "Đừng bỏ marker giờ ਵਜੇ.", trap_en: "Do not drop the clock marker ਵਜੇ.", fix_pa: "ਤਿੰਨ ਵਜੇ", fix_romanization: "tinn vaje" }],
    pass_signal_vi: "Có lịch cũ, lịch mới, và giấy tờ.",
    pass_signal_en: "Includes old time, new time, and the document.",
    owner_check_vi: "Người học có thể đổi người nói nam/nữ mà vẫn giữ cấu trúc.",
    owner_check_en: "The learner can switch speaker gender while keeping the structure.",
  },
  {
    id: "pa_a2_retain_transport",
    scenario: "transport",
    style: "final_qa",
    title_vi: "Final QA: đi lại",
    title_en: "Final QA: transport",
    retrieval_practice_vi: "Hỏi tuyến xe, hỏi xuống ở đâu, và báo trễ bằng một câu.",
    retrieval_practice_en: "Ask the route, ask where to get off, and report being late in one sentence.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được với bus, SkyTrain, TTC, GO Train, stop, và platform.",
    canada_practical_en: "Usable with buses, SkyTrain, TTC, GO Train, stops, and platforms.",
    clue_lines: [
      { pa: "ਕੀ ਇਹ ਬੱਸ ਲਾਇਬ੍ਰੇਰੀ ਤੱਕ ਜਾਂਦੀ ਹੈ?", romanization: "ki eh bass library takk jandi hai?", vi: "Xe buýt này có đi tới thư viện không?", en: "Does this bus go to the library?" },
      { pa: "ਮੈਨੂੰ ਕਿੱਥੇ ਉਤਰਨਾ ਹੈ?", romanization: "mainu kitthe utarna hai?", vi: "Tôi phải xuống ở đâu?", en: "Where should I get off?" },
      { pa: "ਮੈਂ ਦਸ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵਾਂਗਾ।", romanization: "main das mint der naal aavanga.", vi: "Tôi sẽ đến muộn mười phút. (nam)", en: "I will be ten minutes late. (male speaker)" },
    ],
    final_qa: [
      { q_vi: "Đích đến?", q_en: "Destination?", answer_pa: "ਲਾਇਬ੍ਰੇਰੀ", answer_romanization: "library", answer_vi: "Thư viện.", answer_en: "Library." },
      { q_vi: "Trễ bao lâu?", q_en: "How late?", answer_pa: "ਦਸ ਮਿੰਟ", answer_romanization: "das mint", answer_vi: "Mười phút.", answer_en: "Ten minutes." },
    ],
    explanation_vi: "Mẫu này kiểm tra xem learner còn giữ được route question, stop question, và delay phrase không.",
    explanation_en: "This checks whether the learner still retains the route question, stop question, and delay phrase.",
    traps: [{ trap_vi: "ਬੱਸ thường đi với ਜਾਂਦੀ.", trap_en: "ਬੱਸ usually takes ਜਾਂਦੀ.", fix_pa: "ਬੱਸ ਜਾਂਦੀ ਹੈ।", fix_romanization: "bass jandi hai." }],
    pass_signal_vi: "Có route, stop, và delay.",
    pass_signal_en: "Has route, stop, and delay.",
    owner_check_vi: "Người học nhận ra ਕਿੱਥੇ và ਤੱਕ ngay không cần gợi ý.",
    owner_check_en: "The learner recognizes ਕਿੱਥੇ and ਤੱਕ without prompting.",
  },
  {
    id: "pa_a2_retain_housing",
    scenario: "housing",
    style: "retention_booster",
    title_vi: "Retention booster: nhà ở",
    title_en: "Retention booster: housing",
    retrieval_practice_vi: "Nhắc lại vấn đề, thời điểm, và yêu cầu xem.",
    retrieval_practice_en: "Recall the problem, timing, and request for a check.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Hữu ích khi nhắn landlord/building manager về heater, leak, hoặc laundry.",
    canada_practical_en: "Useful when messaging a landlord/building manager about a heater, leak, or laundry.",
    clue_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "maaf karna, heater kamm nahi kar riha.", vi: "Xin lỗi, máy sưởi không hoạt động.", en: "Sorry, the heater is not working." },
      { pa: "ਇਹ ਸਵੇਰੇ ਤੋਂ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "eh savere ton ho riha hai.", vi: "Việc này đang xảy ra từ sáng.", en: "This has been happening since morning." },
      { pa: "ਕੀ ਤੁਸੀਂ ਅੱਜ ਦੇਖ ਸਕਦੇ ਹੋ?", romanization: "ki tusi ajj dekh sakde ho?", vi: "Bạn có thể xem hôm nay không?", en: "Can you check today?" },
    ],
    final_qa: [
      { q_vi: "Vấn đề?", q_en: "Problem?", answer_pa: "ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ", answer_romanization: "heater kamm nahi kar riha", answer_vi: "Máy sưởi không hoạt động.", answer_en: "The heater is not working." },
      { q_vi: "Từ khi nào?", q_en: "Since when?", answer_pa: "ਸਵੇਰੇ ਤੋਂ", answer_romanization: "savere ton", answer_vi: "Từ sáng.", answer_en: "Since morning." },
    ],
    explanation_vi: "Người học cần nhớ opener lịch sự, problem, time marker, và request.",
    explanation_en: "The learner must remember the polite opener, problem, time marker, and request.",
    traps: [{ trap_vi: "Không chỉ nói 'problem' mà thiếu timing.", trap_en: "Do not say only 'problem' without timing.", fix_pa: "ਸਵੇਰੇ ਤੋਂ", fix_romanization: "savere ton" }],
    pass_signal_vi: "Có opener, vấn đề, thời điểm, và request.",
    pass_signal_en: "Has opener, problem, timing, and request.",
    owner_check_vi: "Người học không rơi mất sਵੇਰੇ ਤੋਂ khi nói nhanh.",
    owner_check_en: "The learner does not drop ਸਵੇਰੇ ਤੋਂ when speaking quickly.",
  },
  {
    id: "pa_a2_retain_school",
    scenario: "school",
    style: "final_risk",
    title_vi: "Final risk: báo vắng học",
    title_en: "Final risk: school absence",
    retrieval_practice_vi: "Nói câu vắng học, lý do sức khỏe, và xin homework.",
    retrieval_practice_en: "Say the absence sentence, a health reason, and ask for homework.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được khi gọi school office hoặc nhắn giáo viên tại Canada.",
    canada_practical_en: "Usable when calling a Canadian school office or messaging a teacher.",
    clue_lines: [
      { pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "mera bachcha ajj school nahi aa sakda.", vi: "Con tôi hôm nay không thể đến trường.", en: "My child cannot come to school today." },
      { pa: "ਉਸ ਨੂੰ ਬੁਖਾਰ ਹੈ।", romanization: "us nu bukhar hai.", vi: "Em ấy bị sốt.", en: "He/she has a fever." },
      { pa: "ਕੀ ਤੁਸੀਂ ਹੋਮਵਰਕ ਈਮੇਲ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusi homework email kar sakde ho?", vi: "Bạn có thể gửi bài tập qua email không?", en: "Can you email the homework?" },
    ],
    final_qa: [
      { q_vi: "Lý do?", q_en: "Reason?", answer_pa: "ਬੁਖਾਰ ਹੈ", answer_romanization: "bukhar hai", answer_vi: "Bị sốt.", answer_en: "Has a fever." },
      { q_vi: "Yêu cầu?", q_en: "Request?", answer_pa: "ਹੋਮਵਰਕ ਈਮੇਲ", answer_romanization: "homework email", answer_vi: "Gửi bài tập qua email.", answer_en: "Email the homework." },
    ],
    explanation_vi: "Mẫu này là điểm rủi ro vì learner phải giữ nguyên lý do và yêu cầu khi nhắn vội.",
    explanation_en: "This is a risk point because the learner must preserve the reason and request when sending a quick message.",
    traps: [{ trap_vi: "ਮੇਰਾ/ਮੇਰੀ theo danh từ sau, không theo phụ huynh.", trap_en: "ਮੇਰਾ/ਮੇਰੀ follows the noun, not the parent.", fix_pa: "ਮੇਰਾ ਬੱਚਾ", fix_romanization: "mera bachcha" }],
    pass_signal_vi: "Câu đạt nếu school biết ai vắng, lý do, và cần làm gì.",
    pass_signal_en: "Passes if the school knows who is absent, why, and what to do.",
    owner_check_vi: "Người học nêu đúng absence + fever + homework.",
    owner_check_en: "The learner states absence + fever + homework correctly.",
  },
  {
    id: "pa_a2_retain_childcare",
    scenario: "childcare",
    style: "stress_test",
    title_vi: "Stress test: childcare",
    title_en: "Stress test: childcare",
    retrieval_practice_vi: "Nhớ giờ đón, người đón thay, và danh sách đón.",
    retrieval_practice_en: "Remember pickup time, alternate pickup person, and pickup list.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Phù hợp daycare/after-school care khi có pickup list.",
    canada_practical_en: "Fits daycare/after-school care when there is a pickup list.",
    clue_lines: [
      { pa: "ਮੈਂ ਅੱਜ ਪੰਜ ਵਜੇ ਨਹੀਂ ਆ ਸਕਦੀ।", romanization: "main ajj panj vaje nahi aa sakdi.", vi: "Hôm nay tôi không thể đến lúc năm giờ. (nữ)", en: "I cannot come at five today. (female speaker)" },
      { pa: "ਮੇਰੀ ਭੈਣ ਬੱਚੇ ਨੂੰ ਲੈਣ ਆਵੇਗੀ।", romanization: "meri bhain bachche nu lain aavegi.", vi: "Chị/em gái tôi sẽ đến đón trẻ.", en: "My sister will come to pick up the child." },
      { pa: "ਉਹ pickup list ਵਿੱਚ ਹੈ।", romanization: "oh pickup list vich hai.", vi: "Cô ấy có trong danh sách đón.", en: "She is on the pickup list." },
    ],
    final_qa: [
      { q_vi: "Ai đón?", q_en: "Who picks up?", answer_pa: "ਮੇਰੀ ਭੈਣ", answer_romanization: "meri bhain", answer_vi: "Chị/em gái tôi.", answer_en: "My sister." },
      { q_vi: "Có trong danh sách?", q_en: "On the list?", answer_pa: "pickup list ਵਿੱਚ ਹੈ", answer_romanization: "pickup list vich hai", answer_vi: "Có trong danh sách đón.", answer_en: "On the pickup list." },
    ],
    explanation_vi: "Mẫu buộc learner nhớ đúng time, person, và safety/authorization point.",
    explanation_en: "This forces the learner to remember the time, person, and safety/authorization point.",
    traps: [{ trap_vi: "Không bỏ giờ đón trong tin nhắn childcare.", trap_en: "Do not omit the pickup time in a childcare message.", fix_pa: "ਪੰਜ ਵਜੇ ਲੈਣ ਆਵੇਗੀ", fix_romanization: "panj vaje lain aavegi" }],
    pass_signal_vi: "Câu đạt nếu staff biết ai đón và lúc nào.",
    pass_signal_en: "Passes if staff know who is picking up and when.",
    owner_check_vi: "Người học không nhầm ਆਵੇਗੀ với ਆਵੇਗਾ theo giới tính.",
    owner_check_en: "The learner does not confuse ਆਵੇਗੀ and ਆਵੇਗਾ by gender.",
  },
  {
    id: "pa_a2_retain_workplace_small_talk",
    scenario: "workplace_small_talk",
    style: "final_qa",
    title_vi: "Final QA: small talk nơi làm",
    title_en: "Final QA: workplace small talk",
    retrieval_practice_vi: "Mở small talk, trả lời ngắn, rồi quay lại công việc.",
    retrieval_practice_en: "Open small talk, answer briefly, then return to work.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Weekend/weather small talk thường an toàn ở nhiều workplace Canada.",
    canada_practical_en: "Weekend/weather small talk is often safe in many Canadian workplaces.",
    clue_lines: [
      { pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", romanization: "sat sri akal, tuhada din kiven hai?", vi: "Xin chào, ngày của bạn thế nào?", en: "Hello, how is your day?" },
      { pa: "ਮੇਰਾ ਦਿਨ ਚੰਗਾ ਹੈ, ਧੰਨਵਾਦ।", romanization: "mera din changa hai, dhanvaad.", vi: "Ngày của tôi tốt, cảm ơn.", en: "My day is good, thank you." },
      { pa: "ਹੁਣ ਅਸੀਂ ਕੰਮ ਸ਼ੁਰੂ ਕਰੀਏ?", romanization: "hun asin kamm shuru kariye?", vi: "Bây giờ chúng ta bắt đầu làm việc nhé?", en: "Shall we start work now?" },
    ],
    final_qa: [
      { q_vi: "Từ lịch sự?", q_en: "Polite word?", answer_pa: "ਤੁਹਾਡਾ", answer_romanization: "tuhada", answer_vi: "Của bạn, lịch sự.", answer_en: "Your, polite." },
      { q_vi: "Chuyển sang công việc?", q_en: "Move to work?", answer_pa: "ਕੰਮ ਸ਼ੁਰੂ ਕਰੀਏ?", answer_romanization: "kamm shuru kariye?", answer_vi: "Bắt đầu làm việc nhé?", answer_en: "Shall we start work?" },
    ],
    explanation_vi: "Mẫu này kiểm tra người học vẫn giữ được polite pronoun và transition back to work.",
    explanation_en: "This checks whether the learner still retains the polite pronoun and the transition back to work.",
    traps: [{ trap_vi: "ਤੂੰ/ਤੇਰਾ có thể quá thân mật.", trap_en: "ਤੂੰ/ਤੇਰਾ can be too familiar.", fix_pa: "ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", fix_romanization: "tuhada din kiven hai?" }],
    pass_signal_vi: "Có greeting, polite possessive, và chuyển chủ đề.",
    pass_signal_en: "Has greeting, polite possessive, and topic shift.",
    owner_check_vi: "Người học không sa vào small talk dài.",
    owner_check_en: "The learner does not drift into long small talk.",
  },
  {
    id: "pa_a2_retain_short_messages",
    scenario: "short_messages",
    style: "retention_booster",
    title_vi: "Retention booster: tin nhắn ngắn",
    title_en: "Retention booster: short messages",
    retrieval_practice_vi: "Đọc tin nhắn và kéo ra giờ, nơi, và đồ cần mang.",
    retrieval_practice_en: "Read a message and pull out time, place, and item to bring.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được với school notice, library class, settlement class, hoặc training note.",
    canada_practical_en: "Usable with school notices, library classes, settlement classes, or training notes.",
    clue_lines: [
      { pa: "ਕਲਾਸ ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ ਲਾਇਬ੍ਰੇਰੀ ਵਿੱਚ ਹੈ।", romanization: "class kal tinn vaje library vich hai.", vi: "Lớp học ngày mai lúc ba giờ ở thư viện.", en: "Class is tomorrow at three in the library." },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਨੋਟਬੁੱਕ ਲਿਆਓ।", romanization: "kirpa karke notebook liaao.", vi: "Xin hãy mang vở.", en: "Please bring a notebook." },
      { pa: "ਮੈਨੂੰ ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ ਲਾਇਬ੍ਰੇਰੀ ਜਾਣਾ ਹੈ।", romanization: "mainu kal tinn vaje library jaana hai.", vi: "Tôi cần đi thư viện ngày mai lúc ba giờ.", en: "I need to go to the library tomorrow at three." },
    ],
    final_qa: [
      { q_vi: "Khi nào có lớp?", q_en: "When is class?", answer_pa: "ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ", answer_romanization: "kal tinn vaje", answer_vi: "Ngày mai lúc ba giờ.", answer_en: "Tomorrow at three." },
      { q_vi: "Cần mang gì?", q_en: "What should be brought?", answer_pa: "ਨੋਟਬੁੱਕ", answer_romanization: "notebook", answer_vi: "Vở.", answer_en: "Notebook." },
    ],
    explanation_vi: "Mẫu này là điểm giữ kiến thức, yêu cầu lấy đúng detail trong một tin nhắn ngắn.",
    explanation_en: "This is a retention point requiring the learner to extract the right details from a short message.",
    traps: [{ trap_vi: "Đừng trả lời chỉ 'library' mà thiếu ngày/giờ.", trap_en: "Do not answer only 'library' without day/time.", fix_pa: "ਕੱਲ੍ਹ ਤਿੰਨ ਵਜੇ", fix_romanization: "kal tinn vaje" }],
    pass_signal_vi: "Có thời gian, nơi, và vật cần mang.",
    pass_signal_en: "Has the time, place, and item to bring.",
    owner_check_vi: "Người học tóm được message mà không cần dịch từng từ.",
    owner_check_en: "The learner can summarize the message without translating every word.",
  },
  {
    id: "pa_a2_retain_polite_repair_phrases",
    scenario: "polite_repair_phrases",
    style: "final_risk",
    title_vi: "Final risk: repair phrases lịch sự",
    title_en: "Final risk: polite repair phrases",
    retrieval_practice_vi: "Xin nhắc lại, xin nói chậm, và xác nhận ý hiểu.",
    retrieval_practice_en: "Ask for repetition, ask for slower speech, and confirm understanding.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    clue_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusi dubara kahi sakde ho?", vi: "Xin lỗi, bạn có thể nói lại không?", en: "Sorry, can you say that again?" },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।", romanization: "kirpa karke hauli bolo.", vi: "Xin hãy nói chậm.", en: "Please speak slowly." },
      { pa: "ਕੀ ਇਸ ਦਾ ਮਤਲਬ ਇਹ ਹੈ ਕਿ ਮੈਨੂੰ ਕੱਲ੍ਹ ਆਉਣਾ ਹੈ?", romanization: "ki is da matlab eh hai ki mainu kal auna hai?", vi: "Có phải ý là tôi phải đến ngày mai không?", en: "Does this mean that I need to come tomorrow?" },
    ],
    final_qa: [
      { q_vi: "Xin nhắc lại?", q_en: "Ask for repetition?", answer_pa: "ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", answer_romanization: "dubara kahi sakde ho?", answer_vi: "Bạn có thể nói lại không?", answer_en: "Can you say that again?" },
      { q_vi: "Xác nhận ý hiểu?", q_en: "Confirm understanding?", answer_pa: "ਇਸ ਦਾ ਮਤਲਬ ਇਹ ਹੈ ਕਿ", answer_romanization: "is da matlab eh hai ki", answer_vi: "Có phải ý là...", answer_en: "Does this mean that..." },
    ],
    explanation_vi: "Đây là điểm rủi ro vì learner phải giữ được polite repair phrases khi căng thẳng.",
    explanation_en: "This is a risk point because the learner must keep polite repair phrases under pressure.",
    traps: [{ trap_vi: "Đừng chỉ nói 'what?' trong môi trường lịch sự.", trap_en: "Do not just say 'what?' in a polite setting.", fix_pa: "ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", fix_romanization: "ki tusi dubara kahi sakde ho?" }],
    pass_signal_vi: "Có repetition request và confirmation phrase.",
    pass_signal_en: "Has a repetition request and a confirmation phrase.",
    owner_check_vi: "Người học giữ bình tĩnh và dùng repair thay vì đoán.",
    owner_check_en: "The learner stays calm and uses repair instead of guessing.",
  },
  {
    id: "pa_a2_retain_service_counter_follow_up",
    scenario: "service_counter_follow_up",
    style: "final_qa",
    title_vi: "Final QA: follow-up ở quầy dịch vụ",
    title_en: "Final QA: service-counter follow-up",
    retrieval_practice_vi: "Hỏi lại giấy tờ, thời gian xử lý, và bước tiếp theo.",
    retrieval_practice_en: "Ask again about documents, processing time, and the next step.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được ở service counter, front desk, library desk, hoặc school office.",
    canada_practical_en: "Usable at a service counter, front desk, library desk, or school office.",
    clue_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਮੇਰਾ ਨਾਮ ਦੁਬਾਰਾ ਦੇਖ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusi mera naam dubara dekh sakde ho?", vi: "Xin lỗi, bạn có thể kiểm tra lại tên của tôi không?", en: "Sorry, can you check my name again?" },
      { pa: "ਕੀ ਇਹ ਅੱਜ ਤਿਆਰ ਹੋ ਜਾਵੇਗਾ?", romanization: "ki eh ajj taiyar ho jaavega?", vi: "Việc này hôm nay có xong không?", en: "Will this be ready today?" },
      { pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", romanization: "agla kadam ki hai?", vi: "Bước tiếp theo là gì?", en: "What is the next step?" },
    ],
    final_qa: [
      { q_vi: "Cần kiểm tra gì lại?", q_en: "What should be checked again?", answer_pa: "ਮੇਰਾ ਨਾਮ", answer_romanization: "mera naam", answer_vi: "Tên của tôi.", answer_en: "My name." },
      { q_vi: "Bước tiếp theo?", q_en: "Next step?", answer_pa: "ਅਗਲਾ ਕਦਮ", answer_romanization: "agla kadam", answer_vi: "Bước tiếp theo.", answer_en: "The next step." },
    ],
    explanation_vi: "Mẫu này kiểm tra follow-up ở quầy dịch vụ, nơi người học thường phải hỏi lại thông tin một cách lịch sự.",
    explanation_en: "This checks service-counter follow-up, where the learner often has to ask again politely.",
    traps: [{ trap_vi: "Đừng bỏ tên hoặc bước tiếp theo khi hỏi lại.", trap_en: "Do not omit the name or next step when following up.", fix_pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", fix_romanization: "agla kadam ki hai?" }],
    pass_signal_vi: "Có tên, thời gian xử lý, và bước tiếp theo.",
    pass_signal_en: "Has the name, processing time, and next step.",
    owner_check_vi: "Người học có thể theo dõi thông tin mà không bị mất mảnh quan trọng.",
    owner_check_en: "The learner can track the information without losing the key parts.",
  },
];
