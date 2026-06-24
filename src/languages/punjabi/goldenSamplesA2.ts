// src/languages/punjabi/goldenSamplesA2.ts
//
// Punjabi A2 golden samples for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred.

export type PunjabiGoldenSampleA2Scenario =
  | "daily_routine"
  | "appointment"
  | "housing"
  | "transport"
  | "school"
  | "childcare"
  | "workplace_small_talk"
  | "polite_problem_explanation"
  | "interaction_repair";

export type PunjabiGoldenSampleA2Mode =
  | "golden_sample"
  | "final_qa"
  | "integration_readiness";

export type PunjabiGoldenSampleA2Line = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiGoldenSampleA2Trap = {
  trap_vi: string;
  trap_en: string;
  better_pa: string;
  better_romanization: string;
};

export type PunjabiGoldenSampleA2 = {
  id: string;
  scenario: PunjabiGoldenSampleA2Scenario;
  mode: PunjabiGoldenSampleA2Mode;
  title_vi: string;
  title_en: string;
  task_vi: string;
  task_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  sample: PunjabiGoldenSampleA2Line[];
  final_qa: {
    q_vi: string;
    q_en: string;
    answer_pa: string;
    answer_romanization: string;
    answer_vi: string;
    answer_en: string;
  }[];
  why_it_works_vi: string;
  why_it_works_en: string;
  traps: PunjabiGoldenSampleA2Trap[];
  readiness_next_vi: string;
  readiness_next_en: string;
};

const scriptAwarenessVi = "Gurmukhi là chữ chính trong golden samples; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn = "Gurmukhi is the main script in these golden samples; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const goldenSamplesA2: PunjabiGoldenSampleA2[] = [
  {
    id: "pa_a2_golden_daily_routine",
    scenario: "daily_routine",
    mode: "golden_sample",
    title_vi: "Golden sample: sinh hoạt hằng ngày",
    title_en: "Golden sample: daily routine",
    task_vi: "Nói ngắn về buổi sáng và một việc đã làm hôm qua.",
    task_en: "Briefly talk about the morning and one thing done yesterday.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    sample: [
      { pa: "ਮੈਂ ਸਵੇਰੇ ਸੱਤ ਵਜੇ ਉੱਠਦੀ ਹਾਂ।", romanization: "main savere satt vaje utthdi haan.", vi: "Tôi thức dậy lúc bảy giờ sáng. (nữ)", en: "I wake up at seven in the morning. (female speaker)" },
      { pa: "ਫਿਰ ਮੈਂ ਚਾਹ ਪੀਂਦੀ ਹਾਂ ਅਤੇ ਕੰਮ ਤੇ ਜਾਂਦੀ ਹਾਂ।", romanization: "phir main chah peendi haan ate kamm te jandi haan.", vi: "Rồi tôi uống trà và đi làm.", en: "Then I drink tea and go to work." },
      { pa: "ਕੱਲ੍ਹ ਮੈਂ ਘਰ ਵਿੱਚ ਖਾਣਾ ਬਣਾਇਆ।", romanization: "kal main ghar vich khana banaia.", vi: "Hôm qua tôi nấu ăn ở nhà.", en: "Yesterday I cooked food at home." },
    ],
    final_qa: [
      { q_vi: "Người nói thức dậy lúc mấy giờ?", q_en: "What time does the speaker wake up?", answer_pa: "ਸੱਤ ਵਜੇ", answer_romanization: "satt vaje", answer_vi: "Bảy giờ.", answer_en: "At seven." },
      { q_vi: "Hôm qua người nói làm gì?", q_en: "What did the speaker do yesterday?", answer_pa: "ਖਾਣਾ ਬਣਾਇਆ", answer_romanization: "khana banaia", answer_vi: "Nấu ăn.", answer_en: "Cooked food." },
    ],
    why_it_works_vi: "Mẫu giữ động từ cuối câu, dùng -ਦੀ cho người nói nữ, và dùng ਕੱਲ੍ਹ + quá khứ rõ ràng.",
    why_it_works_en: "The sample keeps verbs final, uses -ਦੀ for a female speaker, and uses ਕੱਲ੍ਹ + clear past action.",
    traps: [
      { trap_vi: "Người nói nam cần ਉੱਠਦਾ/ਪੀਂਦਾ/ਜਾਂਦਾ.", trap_en: "A male speaker needs ਉੱਠਦਾ/ਪੀਂਦਾ/ਜਾਂਦਾ.", better_pa: "ਮੈਂ ਸਵੇਰੇ ਉੱਠਦਾ ਹਾਂ।", better_romanization: "main savere utthda haan." },
    ],
    readiness_next_vi: "Sẵn sàng nếu có thể đổi người nói nam/nữ và đổi giờ.",
    readiness_next_en: "Ready if the learner can switch speaker gender and change the time.",
  },
  {
    id: "pa_a2_golden_appointment",
    scenario: "appointment",
    mode: "final_qa",
    title_vi: "Golden sample: lịch hẹn",
    title_en: "Golden sample: appointment",
    task_vi: "Xác nhận lịch hẹn và xin đổi sang giờ khác.",
    task_en: "Confirm an appointment and ask to move it to another time.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Clinic/dentist contexts in Canada commonly use ਅਪਾਇੰਟਮੈਂਟ and ਹੈਲਥ ਕਾਰਡ.",
    canada_practical_en: "Clinic/dentist contexts in Canada commonly use ਅਪਾਇੰਟਮੈਂਟ and ਹੈਲਥ ਕਾਰਡ.",
    sample: [
      { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਸੋਮਵਾਰ ਦੋ ਵਜੇ ਹੈ।", romanization: "meri appointment somvaar do vaje hai.", vi: "Lịch hẹn của tôi là thứ Hai lúc hai giờ.", en: "My appointment is Monday at two." },
      { pa: "ਕੀ ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ?", romanization: "ki shukkarvaar tinn vaje sama mil sakda hai?", vi: "Thứ Sáu lúc ba giờ có giờ trống không?", en: "Is a time available Friday at three?" },
      { pa: "ਮੈਂ ਹੈਲਥ ਕਾਰਡ ਨਾਲ ਲਿਆਵਾਂਗਾ।", romanization: "main health card naal liaavanga.", vi: "Tôi sẽ mang thẻ y tế. (nam)", en: "I will bring the health card. (male speaker)" },
    ],
    final_qa: [
      { q_vi: "Lịch hẹn ban đầu khi nào?", q_en: "When is the original appointment?", answer_pa: "ਸੋਮਵਾਰ ਦੋ ਵਜੇ", answer_romanization: "somvaar do vaje", answer_vi: "Thứ Hai lúc hai giờ.", answer_en: "Monday at two." },
      { q_vi: "Người nói muốn đổi sang khi nào?", q_en: "When does the speaker want to move it to?", answer_pa: "ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ", answer_romanization: "shukkarvaar tinn vaje", answer_vi: "Thứ Sáu lúc ba giờ.", answer_en: "Friday at three." },
    ],
    why_it_works_vi: "Mẫu có ngày, giờ với ਵਜੇ, câu hỏi lịch sự, và xác nhận giấy tờ cần mang.",
    why_it_works_en: "The sample has day, clock time with ਵਜੇ, a polite question, and confirmation of the document to bring.",
    traps: [
      { trap_vi: "Không bỏ ngày/giờ mới khi xin đổi lịch.", trap_en: "Do not omit the new day/time when rescheduling.", better_pa: "ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ", better_romanization: "shukkarvaar tinn vaje" },
    ],
    readiness_next_vi: "Sẵn sàng nếu có thể đổi clinic thành school/public-service appointment.",
    readiness_next_en: "Ready if the learner can switch clinic to school/public-service appointment.",
  },
  {
    id: "pa_a2_golden_housing",
    scenario: "housing",
    mode: "golden_sample",
    title_vi: "Golden sample: báo sửa nhà",
    title_en: "Golden sample: housing repair",
    task_vi: "Báo vấn đề nhà ở và xin người quản lý đến xem.",
    task_en: "Report a housing issue and ask the manager to come look.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Heater, leak, landlord/building manager messages are practical in Canada.",
    canada_practical_en: "Heater, leak, landlord/building manager messages are practical in Canada.",
    sample: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਰਸੋਈ ਵਿੱਚ ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "maaf karna, rasoi vich paani leak ho riha hai.", vi: "Xin lỗi, nước đang rò trong bếp.", en: "Sorry, water is leaking in the kitchen." },
      { pa: "ਹੀਟਰ ਵੀ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "heater vi kamm nahi kar riha.", vi: "Máy sưởi cũng không hoạt động.", en: "The heater is also not working." },
      { pa: "ਕੀ ਤੁਸੀਂ ਅੱਜ ਆ ਕੇ ਦੇਖ ਸਕਦੇ ਹੋ?", romanization: "ki tusi ajj aa ke dekh sakde ho?", vi: "Bạn có thể đến xem hôm nay không?", en: "Can you come and look today?" },
    ],
    final_qa: [
      { q_vi: "Vấn đề ở đâu?", q_en: "Where is the problem?", answer_pa: "ਰਸੋਈ ਵਿੱਚ", answer_romanization: "rasoi vich", answer_vi: "Trong bếp.", answer_en: "In the kitchen." },
      { q_vi: "Người nói yêu cầu gì?", q_en: "What does the speaker request?", answer_pa: "ਅੱਜ ਆ ਕੇ ਦੇਖ ਸਕਦੇ ਹੋ?", answer_romanization: "ajj aa ke dekh sakde ho?", answer_vi: "Đến xem hôm nay.", answer_en: "Come and look today." },
    ],
    why_it_works_vi: "Mẫu mở bằng ਮਾਫ਼ ਕਰਨਾ, nêu vị trí, nêu vấn đề, rồi hỏi lịch sự.",
    why_it_works_en: "The sample opens with ਮਾਫ਼ ਕਰਨਾ, gives location, states the problem, then asks politely.",
    traps: [
      { trap_vi: "Đừng mở bằng mệnh lệnh mạnh với landlord.", trap_en: "Do not open with a strong command to a landlord.", better_pa: "ਮਾਫ਼ ਕਰਨਾ, ਇੱਕ ਸਮੱਸਿਆ ਹੈ।", better_romanization: "maaf karna, ikk samassia hai." },
    ],
    readiness_next_vi: "Sẵn sàng nếu có thể thêm thời gian bắt đầu: ਅੱਜ ਸਵੇਰੇ ਤੋਂ.",
    readiness_next_en: "Ready if the learner can add start time: ਅੱਜ ਸਵੇਰੇ ਤੋਂ.",
  },
  {
    id: "pa_a2_golden_transport",
    scenario: "transport",
    mode: "integration_readiness",
    title_vi: "Golden sample: đi lại",
    title_en: "Golden sample: transport",
    task_vi: "Hỏi tuyến, hỏi điểm xuống, và báo trễ.",
    task_en: "Ask route, ask where to get off, and report delay.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Usable with TTC, SkyTrain, GO Train, bus stop, platform.",
    canada_practical_en: "Usable with TTC, SkyTrain, GO Train, bus stop, platform.",
    sample: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਇਹ ਬੱਸ ਕਿੱਥੇ ਜਾਂਦੀ ਹੈ?", romanization: "maaf karna, eh bass kitthe jandi hai?", vi: "Xin lỗi, xe buýt này đi đâu?", en: "Excuse me, where does this bus go?" },
      { pa: "ਮੈਨੂੰ ਕਿੱਥੇ ਉਤਰਨਾ ਹੈ?", romanization: "mainu kitthe utarna hai?", vi: "Tôi phải xuống ở đâu?", en: "Where should I get off?" },
      { pa: "ਮੈਂ ਦਸ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵਾਂਗਾ।", romanization: "main das mint der naal aavanga.", vi: "Tôi sẽ đến muộn mười phút. (nam)", en: "I will be ten minutes late. (male speaker)" },
    ],
    final_qa: [
      { q_vi: "Người nói hỏi gì về xe buýt?", q_en: "What does the speaker ask about the bus?", answer_pa: "ਇਹ ਬੱਸ ਕਿੱਥੇ ਜਾਂਦੀ ਹੈ?", answer_romanization: "eh bass kitthe jandi hai?", answer_vi: "Xe buýt này đi đâu?", answer_en: "Where does this bus go?" },
      { q_vi: "Người nói sẽ trễ bao lâu?", q_en: "How late will the speaker be?", answer_pa: "ਦਸ ਮਿੰਟ", answer_romanization: "das mint", answer_vi: "Mười phút.", answer_en: "Ten minutes." },
    ],
    why_it_works_vi: "Mẫu dùng repair opener, question word ਕਿੱਥੇ, và delay phrase ਦੇਰ ਨਾਲ.",
    why_it_works_en: "The sample uses a repair opener, question word ਕਿੱਥੇ, and delay phrase ਦੇਰ ਨਾਲ.",
    traps: [
      { trap_vi: "ਬੱਸ dùng ਜਾਂਦੀ trong mẫu này.", trap_en: "ਬੱਸ takes ਜਾਂਦੀ in this pattern.", better_pa: "ਬੱਸ ਜਾਂਦੀ ਹੈ।", better_romanization: "bass jandi hai." },
    ],
    readiness_next_vi: "Sẵn sàng nếu có thể đổi bus thành train/platform.",
    readiness_next_en: "Ready if the learner can switch bus to train/platform.",
  },
  {
    id: "pa_a2_golden_school",
    scenario: "school",
    mode: "final_qa",
    title_vi: "Golden sample: trường học",
    title_en: "Golden sample: school",
    task_vi: "Báo con vắng học và hỏi bài tập.",
    task_en: "Report a child absence and ask about homework.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Useful for school office, adult class, and parent-teacher messages.",
    canada_practical_en: "Useful for school office, adult class, and parent-teacher messages.",
    sample: [
      { pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "sat sri akal, mera bachcha ajj school nahi aa sakda.", vi: "Xin chào, con tôi hôm nay không thể đến trường.", en: "Hello, my child cannot come to school today." },
      { pa: "ਉਸਨੂੰ ਥੋੜ੍ਹਾ ਬੁਖਾਰ ਹੈ।", romanization: "usnu thoda bukhar hai.", vi: "Bé hơi sốt.", en: "The child has a slight fever." },
      { pa: "ਹੋਮਵਰਕ ਕਦੋਂ ਦੇਣਾ ਹੈ?", romanization: "homework kadon dena hai?", vi: "Khi nào phải nộp bài tập?", en: "When is the homework due?" },
    ],
    final_qa: [
      { q_vi: "Vì sao trẻ không đến trường?", q_en: "Why is the child not coming to school?", answer_pa: "ਉਸਨੂੰ ਥੋੜ੍ਹਾ ਬੁਖਾਰ ਹੈ।", answer_romanization: "usnu thoda bukhar hai.", answer_vi: "Bé hơi sốt.", answer_en: "The child has a slight fever." },
      { q_vi: "Người nói hỏi gì?", q_en: "What does the speaker ask?", answer_pa: "ਹੋਮਵਰਕ ਕਦੋਂ ਦੇਣਾ ਹੈ?", answer_romanization: "homework kadon dena hai?", answer_vi: "Khi nào nộp bài tập.", answer_en: "When homework is due." },
    ],
    why_it_works_vi: "Mẫu có greeting, thông tin vắng học, lý do sức khỏe, và câu hỏi bài tập.",
    why_it_works_en: "The sample has greeting, absence information, health reason, and a homework question.",
    traps: [
      { trap_vi: "Sức khỏe dùng ਉਸਨੂੰ ... ਹੈ, không ਉਹ ... ਹੈ.", trap_en: "Health uses ਉਸਨੂੰ ... ਹੈ, not ਉਹ ... ਹੈ.", better_pa: "ਉਸਨੂੰ ਬੁਖਾਰ ਹੈ।", better_romanization: "usnu bukhar hai." },
    ],
    readiness_next_vi: "Sẵn sàng nếu có thể thêm ngày quay lại trường.",
    readiness_next_en: "Ready if the learner can add the return-to-school day.",
  },
  {
    id: "pa_a2_golden_childcare",
    scenario: "childcare",
    mode: "golden_sample",
    title_vi: "Golden sample: childcare",
    title_en: "Golden sample: childcare",
    task_vi: "Nói giờ đón và hỏi tình trạng của trẻ.",
    task_en: "State pickup time and ask about the child's status.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Daycare/pickup/lunch box are common Canadian Punjabi loan contexts.",
    canada_practical_en: "Daycare/pickup/lunch box are common Canadian Punjabi loan contexts.",
    sample: [
      { pa: "ਮੈਂ ਬੱਚੇ ਨੂੰ ਪੰਜ ਵਜੇ ਲੈਣ ਆਵਾਂਗੀ।", romanization: "main bachche nu panj vaje lain aavangi.", vi: "Tôi sẽ đến đón trẻ lúc năm giờ. (nữ)", en: "I will come to pick up the child at five. (female speaker)" },
      { pa: "ਬੱਚੇ ਨੇ ਖਾਣਾ ਖਾਧਾ?", romanization: "bachche ne khana khadha?", vi: "Bé đã ăn chưa?", en: "Did the child eat?" },
      { pa: "ਕੀ ਉਸਨੂੰ ਬੁਖਾਰ ਹੈ?", romanization: "ki usnu bukhar hai?", vi: "Bé có sốt không?", en: "Does the child have a fever?" },
    ],
    final_qa: [
      { q_vi: "Người nói sẽ đón lúc mấy giờ?", q_en: "What time will the speaker pick up?", answer_pa: "ਪੰਜ ਵਜੇ", answer_romanization: "panj vaje", answer_vi: "Năm giờ.", answer_en: "At five." },
      { q_vi: "Người nói hỏi gì về sức khỏe?", q_en: "What health question does the speaker ask?", answer_pa: "ਕੀ ਉਸਨੂੰ ਬੁਖਾਰ ਹੈ?", answer_romanization: "ki usnu bukhar hai?", answer_vi: "Bé có sốt không?", answer_en: "Does the child have a fever?" },
    ],
    why_it_works_vi: "Mẫu dùng ਲੈਣ ਆਉਣਾ, past transitive question, và health condition pattern.",
    why_it_works_en: "The sample uses ਲੈਣ ਆਉਣਾ, a past transitive question, and health condition pattern.",
    traps: [
      { trap_vi: "Người nói nam dùng ਆਵਾਂਗਾ.", trap_en: "A male speaker uses ਆਵਾਂਗਾ.", better_pa: "ਮੈਂ ਲੈਣ ਆਵਾਂਗਾ।", better_romanization: "main lain aavanga." },
    ],
    readiness_next_vi: "Sẵn sàng nếu có thể đổi pickup time và hỏi ngủ/ăn.",
    readiness_next_en: "Ready if the learner can change pickup time and ask about sleep/food.",
  },
  {
    id: "pa_a2_golden_workplace",
    scenario: "workplace_small_talk",
    mode: "golden_sample",
    title_vi: "Golden sample: small talk nơi làm việc",
    title_en: "Golden sample: workplace small talk",
    task_vi: "Mở đầu nhẹ nhàng với đồng nghiệp và hỏi công việc.",
    task_en: "Open gently with a coworker and ask about work.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Weekend/weather small talk is safe in many Canadian workplaces.",
    canada_practical_en: "Weekend/weather small talk is safe in many Canadian workplaces.",
    sample: [
      { pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਤੁਹਾਡਾ ਵੀਕਐਂਡ ਕਿਵੇਂ ਸੀ?", romanization: "sat sri akal, tuhada weekend kiven si?", vi: "Xin chào, cuối tuần của bạn thế nào?", en: "Hello, how was your weekend?" },
      { pa: "ਅੱਜ ਮੌਸਮ ਚੰਗਾ ਹੈ।", romanization: "ajj mausam changa hai.", vi: "Hôm nay thời tiết đẹp.", en: "The weather is nice today." },
      { pa: "ਕੰਮ ਕਿਵੇਂ ਚੱਲ ਰਿਹਾ ਹੈ?", romanization: "kamm kiven chall riha hai?", vi: "Công việc đang thế nào?", en: "How is work going?" },
    ],
    final_qa: [
      { q_vi: "Câu nào hỏi weekend?", q_en: "Which line asks about the weekend?", answer_pa: "ਤੁਹਾਡਾ ਵੀਕਐਂਡ ਕਿਵੇਂ ਸੀ?", answer_romanization: "tuhada weekend kiven si?", answer_vi: "Cuối tuần của bạn thế nào?", answer_en: "How was your weekend?" },
      { q_vi: "Câu nào hỏi công việc?", q_en: "Which line asks about work?", answer_pa: "ਕੰਮ ਕਿਵੇਂ ਚੱਲ ਰਿਹਾ ਹੈ?", answer_romanization: "kamm kiven chall riha hai?", answer_vi: "Công việc đang thế nào?", answer_en: "How is work going?" },
    ],
    why_it_works_vi: "Mẫu dùng ਤੁਹਾਡਾ lịch sự và chủ đề an toàn: weekend, weather, work.",
    why_it_works_en: "The sample uses polite ਤੁਹਾਡਾ and safe topics: weekend, weather, work.",
    traps: [
      { trap_vi: "ਤੂੰ/ਤੇਰਾ có thể quá thân mật ở workplace.", trap_en: "ਤੂੰ/ਤੇਰਾ can be too intimate at work.", better_pa: "ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", better_romanization: "tuhada din kiven hai?" },
    ],
    readiness_next_vi: "Sẵn sàng nếu có thể chuyển sang work check-in.",
    readiness_next_en: "Ready if the learner can move into a work check-in.",
  },
  {
    id: "pa_a2_golden_polite_problem",
    scenario: "polite_problem_explanation",
    mode: "integration_readiness",
    title_vi: "Golden sample: giải thích vấn đề lịch sự",
    title_en: "Golden sample: polite problem explanation",
    task_vi: "Nói bạn có vấn đề, giải thích ngắn, và xin giúp.",
    task_en: "Say you have a problem, explain briefly, and ask for help.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Usable at service counters, clinics, school offices, and landlord messages.",
    canada_practical_en: "Usable at service counters, clinics, school offices, and landlord messages.",
    sample: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਇੱਕ ਛੋਟੀ ਸਮੱਸਿਆ ਹੈ।", romanization: "maaf karna, mainu ikk chhoti samassia hai.", vi: "Xin lỗi, tôi có một vấn đề nhỏ.", en: "Sorry, I have a small problem." },
      { pa: "ਮੈਨੂੰ ਇਹ ਹਦਾਇਤ ਸਮਝ ਨਹੀਂ ਆਈ।", romanization: "mainu eh hidayat samajh nahi aai.", vi: "Tôi chưa hiểu hướng dẫn này.", en: "I did not understand this instruction." },
      { pa: "ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusi madad kar sakde ho?", vi: "Bạn có thể giúp không?", en: "Can you help?" },
    ],
    final_qa: [
      { q_vi: "Người nói có vấn đề gì?", q_en: "What problem does the speaker have?", answer_pa: "ਹਦਾਇਤ ਸਮਝ ਨਹੀਂ ਆਈ", answer_romanization: "hidayat samajh nahi aai", answer_vi: "Chưa hiểu hướng dẫn.", answer_en: "Did not understand the instruction." },
      { q_vi: "Người nói xin gì?", q_en: "What does the speaker ask for?", answer_pa: "ਮਦਦ", answer_romanization: "madad", answer_vi: "Sự giúp đỡ.", answer_en: "Help." },
    ],
    why_it_works_vi: "Mẫu có opener lịch sự, mô tả vấn đề cụ thể, và request bằng ਸਕਦੇ ਹੋ.",
    why_it_works_en: "The sample has a polite opener, specific problem description, and request with ਸਕਦੇ ਹੋ.",
    traps: [
      { trap_vi: "Đừng chỉ nói 'ਮਦਦ ਕਰੋ' với người lạ.", trap_en: "Do not only say 'ਮਦਦ ਕਰੋ' to a stranger.", better_pa: "ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?", better_romanization: "ki tusi madad kar sakde ho?" },
    ],
    readiness_next_vi: "Sẵn sàng nếu có thể thêm chi tiết bối cảnh.",
    readiness_next_en: "Ready if the learner can add context detail.",
  },
  {
    id: "pa_a2_golden_repair",
    scenario: "interaction_repair",
    mode: "final_qa",
    title_vi: "Golden sample: repair hội thoại",
    title_en: "Golden sample: interaction repair",
    task_vi: "Khi không hiểu, xin nhắc lại, nói chậm, và hỏi nghĩa.",
    task_en: "When you do not understand, ask for repetition, slower speech, and meaning.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    sample: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusi dubara keh sakde ho?", vi: "Xin lỗi, bạn có thể nói lại không?", en: "Sorry, can you say that again?" },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਥੋੜ੍ਹਾ ਹੌਲੀ ਬੋਲੋ।", romanization: "kirpa karke thoda hauli bolo.", vi: "Làm ơn nói chậm hơn một chút.", en: "Please speak a little slower." },
      { pa: "ਇਸਦਾ ਕੀ ਮਤਲਬ ਹੈ?", romanization: "isda ki matlab hai?", vi: "Cái này nghĩa là gì?", en: "What does this mean?" },
    ],
    final_qa: [
      { q_vi: "Câu nào xin nhắc lại?", q_en: "Which line asks for repetition?", answer_pa: "ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", answer_romanization: "ki tusi dubara keh sakde ho?", answer_vi: "Bạn có thể nói lại không?", answer_en: "Can you say that again?" },
      { q_vi: "Câu nào hỏi nghĩa?", q_en: "Which line asks meaning?", answer_pa: "ਇਸਦਾ ਕੀ ਮਤਲਬ ਹੈ?", answer_romanization: "isda ki matlab hai?", answer_vi: "Cái này nghĩa là gì?", answer_en: "What does this mean?" },
    ],
    why_it_works_vi: "Mẫu dùng repair phrase thay vì đoán hoặc im lặng; tất cả đều lịch sự ở A2.",
    why_it_works_en: "The sample uses repair phrases instead of guessing or freezing; all are polite at A2.",
    traps: [
      { trap_vi: "Đừng chỉ nói ਕੀ? với người lạ.", trap_en: "Do not only say ਕੀ? to a stranger.", better_pa: "ਮਾਫ਼ ਕਰਨਾ, ਦੁਬਾਰਾ ਕਹੋ ਜੀ।", better_romanization: "maaf karna, dubara kaho ji." },
    ],
    readiness_next_vi: "Sẵn sàng nếu dùng được ít nhất hai repair phrases trong roleplay.",
    readiness_next_en: "Ready if the learner can use at least two repair phrases in roleplay.",
  },
];
