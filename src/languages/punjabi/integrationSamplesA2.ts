// src/languages/punjabi/integrationSamplesA2.ts
//
// Punjabi A2 integration samples for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred.

export type PunjabiIntegrationSampleA2Scenario =
  | "daily_routine"
  | "appointment"
  | "transport"
  | "housing"
  | "school"
  | "childcare"
  | "workplace_small_talk"
  | "polite_problem_explanation"
  | "interaction_repair";

export type PunjabiIntegrationSampleA2Style =
  | "integration_sample"
  | "final_evidence"
  | "final_qa";

export type PunjabiIntegrationSampleA2Line = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiIntegrationSampleA2Trap = {
  trap_vi: string;
  trap_en: string;
  fix_pa: string;
  fix_romanization: string;
};

export type PunjabiIntegrationSampleA2 = {
  id: string;
  scenario: PunjabiIntegrationSampleA2Scenario;
  style: PunjabiIntegrationSampleA2Style;
  title_vi: string;
  title_en: string;
  learner_task_vi: string;
  learner_task_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  input_context_vi: string;
  input_context_en: string;
  sample_lines: PunjabiIntegrationSampleA2Line[];
  final_evidence: {
    cue_vi: string;
    cue_en: string;
    expected_pa: string;
    expected_romanization: string;
    expected_vi: string;
    expected_en: string;
  }[];
  integration_note_vi: string;
  integration_note_en: string;
  traps: PunjabiIntegrationSampleA2Trap[];
};

const scriptAwarenessVi = "Gurmukhi là chữ chính trong integration samples; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn = "Gurmukhi is the main script in these integration samples; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const integrationSamplesA2: PunjabiIntegrationSampleA2[] = [
  {
    id: "pa_a2_integration_daily_routine",
    scenario: "daily_routine",
    style: "integration_sample",
    title_vi: "Integration sample: thói quen và thời gian",
    title_en: "Integration sample: routine and time",
    learner_task_vi: "Ghép giờ, thói quen hằng ngày, và một việc tối qua.",
    learner_task_en: "Combine time, daily routine, and one action last night.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    input_context_vi: "Bạn đang nói chuyện với bạn học về một ngày bình thường.",
    input_context_en: "You are talking with a classmate about a normal day.",
    sample_lines: [
      { pa: "ਮੈਂ ਸਵੇਰੇ ਛੇ ਵਜੇ ਉੱਠਦਾ ਹਾਂ।", romanization: "main savere chhe vaje utthda haan.", vi: "Tôi thức dậy lúc sáu giờ sáng. (nam)", en: "I wake up at six in the morning. (male speaker)" },
      { pa: "ਫਿਰ ਮੈਂ ਬੱਸ ਨਾਲ ਕੰਮ ਤੇ ਜਾਂਦਾ ਹਾਂ।", romanization: "phir main bass naal kamm te janda haan.", vi: "Rồi tôi đi làm bằng xe buýt.", en: "Then I go to work by bus." },
      { pa: "ਕੱਲ੍ਹ ਰਾਤ ਮੈਂ ਘਰ ਵਿੱਚ ਪੜ੍ਹਿਆ।", romanization: "kal raat main ghar vich parhia.", vi: "Tối qua tôi học ở nhà.", en: "Last night I studied at home." },
    ],
    final_evidence: [
      { cue_vi: "Giờ thức dậy?", cue_en: "Wake-up time?", expected_pa: "ਛੇ ਵਜੇ", expected_romanization: "chhe vaje", expected_vi: "Sáu giờ.", expected_en: "Six o'clock." },
      { cue_vi: "Việc tối qua?", cue_en: "Last night's action?", expected_pa: "ਘਰ ਵਿੱਚ ਪੜ੍ਹਿਆ", expected_romanization: "ghar vich parhia", expected_vi: "Học ở nhà.", expected_en: "Studied at home." },
    ],
    integration_note_vi: "Mẫu tích hợp habitual -ਦਾ, phương tiện ਨਾਲ, và quá khứ đơn với ਕੱਲ੍ਹ ਰਾਤ.",
    integration_note_en: "The sample integrates habitual -ਦਾ, transport with ਨਾਲ, and simple past with ਕੱਲ੍ਹ ਰਾਤ.",
    traps: [
      { trap_vi: "Người nói nữ cần ਉੱਠਦੀ/ਜਾਂਦੀ.", trap_en: "A female speaker needs ਉੱਠਦੀ/ਜਾਂਦੀ.", fix_pa: "ਮੈਂ ਸਵੇਰੇ ਉੱਠਦੀ ਹਾਂ।", fix_romanization: "main savere utthdi haan." },
    ],
  },
  {
    id: "pa_a2_integration_appointment",
    scenario: "appointment",
    style: "final_qa",
    title_vi: "Final QA: xác nhận lịch hẹn",
    title_en: "Final QA: confirming an appointment",
    learner_task_vi: "Xác nhận lịch hẹn, hỏi đổi giờ, và nhắc giấy tờ.",
    learner_task_en: "Confirm an appointment, ask to change time, and mention a document.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được ở clinic, dentist, settlement office, hoặc school office tại Canada.",
    canada_practical_en: "Usable at a clinic, dentist, settlement office, or school office in Canada.",
    input_context_vi: "Bạn gọi điện để xác nhận một lịch hẹn lúc mười giờ.",
    input_context_en: "You are calling to confirm a ten o'clock appointment.",
    sample_lines: [
      { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਮੰਗਲਵਾਰ ਦਸ ਵਜੇ ਹੈ।", romanization: "meri appointment mangalvaar das vaje hai.", vi: "Lịch hẹn của tôi là thứ Ba lúc mười giờ.", en: "My appointment is Tuesday at ten." },
      { pa: "ਕੀ ਮੈਂ ਇਸ ਨੂੰ ਗਿਆਰਾਂ ਵਜੇ ਕਰ ਸਕਦਾ ਹਾਂ?", romanization: "ki main is nu giaraan vaje kar sakda haan?", vi: "Tôi có thể đổi nó sang mười một giờ không? (nam)", en: "Can I make it eleven o'clock? (male speaker)" },
      { pa: "ਮੈਂ ਹੈਲਥ ਕਾਰਡ ਨਾਲ ਲਿਆਵਾਂਗਾ।", romanization: "main health card naal liaavanga.", vi: "Tôi sẽ mang thẻ y tế. (nam)", en: "I will bring the health card. (male speaker)" },
    ],
    final_evidence: [
      { cue_vi: "Lịch hẹn ban đầu?", cue_en: "Original appointment?", expected_pa: "ਮੰਗਲਵਾਰ ਦਸ ਵਜੇ", expected_romanization: "mangalvaar das vaje", expected_vi: "Thứ Ba lúc mười giờ.", expected_en: "Tuesday at ten." },
      { cue_vi: "Giờ muốn đổi?", cue_en: "Requested new time?", expected_pa: "ਗਿਆਰਾਂ ਵਜੇ", expected_romanization: "giaraan vaje", expected_vi: "Mười một giờ.", expected_en: "Eleven o'clock." },
    ],
    integration_note_vi: "Mẫu kết nối possessive ਮੇਰੀ, ngày/giờ với ਵਜੇ, modal ਸਕਦਾ, và giấy tờ Canada.",
    integration_note_en: "The sample connects possessive ਮੇਰੀ, day/time with ਵਜੇ, modal ਸਕਦਾ, and a Canadian document.",
    traps: [
      { trap_vi: "Không bỏ ਵਜੇ sau giờ.", trap_en: "Do not omit ਵਜੇ after clock time.", fix_pa: "ਦਸ ਵਜੇ", fix_romanization: "das vaje" },
    ],
  },
  {
    id: "pa_a2_integration_transport",
    scenario: "transport",
    style: "integration_sample",
    title_vi: "Integration sample: tuyến và trễ",
    title_en: "Integration sample: route and delay",
    learner_task_vi: "Hỏi tuyến, hỏi điểm xuống, rồi báo trễ.",
    learner_task_en: "Ask the route, ask where to get off, then report being late.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Thực tế với bus, SkyTrain, TTC, GO Train, stop, platform.",
    canada_practical_en: "Practical with buses, SkyTrain, TTC, GO Train, stops, and platforms.",
    input_context_vi: "Bạn không chắc xe buýt này có đến đúng nơi không.",
    input_context_en: "You are not sure whether this bus goes to the right place.",
    sample_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਇਹ ਬੱਸ ਸੈਂਟਰ ਤੱਕ ਜਾਂਦੀ ਹੈ?", romanization: "maaf karna, eh bass center takk jandi hai?", vi: "Xin lỗi, xe buýt này đi tới trung tâm không?", en: "Excuse me, does this bus go to the centre?" },
      { pa: "ਮੈਨੂੰ ਕਿੱਥੇ ਉਤਰਨਾ ਹੈ?", romanization: "mainu kitthe utarna hai?", vi: "Tôi phải xuống ở đâu?", en: "Where should I get off?" },
      { pa: "ਮੈਂ ਪੰਦਰਾਂ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵਾਂਗੀ।", romanization: "main pandraan mint der naal aavangi.", vi: "Tôi sẽ đến muộn mười lăm phút. (nữ)", en: "I will be fifteen minutes late. (female speaker)" },
    ],
    final_evidence: [
      { cue_vi: "Câu hỏi tuyến?", cue_en: "Route question?", expected_pa: "ਇਹ ਬੱਸ ਸੈਂਟਰ ਤੱਕ ਜਾਂਦੀ ਹੈ?", expected_romanization: "eh bass center takk jandi hai?", expected_vi: "Xe buýt này đi tới trung tâm không?", expected_en: "Does this bus go to the centre?" },
      { cue_vi: "Mức trễ?", cue_en: "Delay length?", expected_pa: "ਪੰਦਰਾਂ ਮਿੰਟ", expected_romanization: "pandraan mint", expected_vi: "Mười lăm phút.", expected_en: "Fifteen minutes." },
    ],
    integration_note_vi: "Mẫu tích hợp opener lịch sự, ਤੱਕ, ਕਿੱਥੇ, và future delay phrase.",
    integration_note_en: "The sample integrates a polite opener, ਤੱਕ, ਕਿੱਥੇ, and a future delay phrase.",
    traps: [
      { trap_vi: "ਬੱਸ thường đi với ਜਾਂਦੀ trong mẫu này.", trap_en: "ਬੱਸ usually takes ਜਾਂਦੀ in this pattern.", fix_pa: "ਬੱਸ ਜਾਂਦੀ ਹੈ।", fix_romanization: "bass jandi hai." },
    ],
  },
  {
    id: "pa_a2_integration_housing",
    scenario: "housing",
    style: "final_evidence",
    title_vi: "Final evidence: báo sửa nhà",
    title_en: "Final evidence: housing repair report",
    learner_task_vi: "Nêu vấn đề nhà ở, vị trí, thời điểm, và yêu cầu xem xét.",
    learner_task_en: "State a housing problem, location, timing, and request a check.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Hữu ích khi nhắn landlord/building manager về heater, leak, hoặc laundry.",
    canada_practical_en: "Useful when messaging a landlord/building manager about a heater, leak, or laundry.",
    input_context_vi: "Máy sưởi trong căn hộ không hoạt động từ sáng.",
    input_context_en: "The heater in the apartment has not worked since morning.",
    sample_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੇਰੇ ਅਪਾਰਟਮੈਂਟ ਵਿੱਚ ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "maaf karna, mere apartment vich heater kamm nahi kar riha.", vi: "Xin lỗi, máy sưởi trong căn hộ của tôi không hoạt động.", en: "Sorry, the heater in my apartment is not working." },
      { pa: "ਇਹ ਸਵੇਰੇ ਤੋਂ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "eh savere ton ho riha hai.", vi: "Việc này đang xảy ra từ sáng.", en: "This has been happening since morning." },
      { pa: "ਕੀ ਤੁਸੀਂ ਅੱਜ ਦੇਖ ਸਕਦੇ ਹੋ?", romanization: "ki tusi ajj dekh sakde ho?", vi: "Bạn có thể xem hôm nay không?", en: "Can you check today?" },
    ],
    final_evidence: [
      { cue_vi: "Vấn đề?", cue_en: "Problem?", expected_pa: "ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ", expected_romanization: "heater kamm nahi kar riha", expected_vi: "Máy sưởi không hoạt động.", expected_en: "The heater is not working." },
      { cue_vi: "Từ khi nào?", cue_en: "Since when?", expected_pa: "ਸਵੇਰੇ ਤੋਂ", expected_romanization: "savere ton", expected_vi: "Từ sáng.", expected_en: "Since morning." },
    ],
    integration_note_vi: "Mẫu tích hợp location ਵਿੱਚ, time marker ਤੋਂ, và request lịch sự ਸਕਦੇ ਹੋ.",
    integration_note_en: "The sample integrates location with ਵਿੱਚ, time marker ਤੋਂ, and polite request ਸਕਦੇ ਹੋ.",
    traps: [
      { trap_vi: "Không mở bằng câu ra lệnh mạnh khi báo vấn đề nhà ở.", trap_en: "Do not open with a strong command when reporting housing issues.", fix_pa: "ਮਾਫ਼ ਕਰਨਾ, ਇੱਕ ਸਮੱਸਿਆ ਹੈ।", fix_romanization: "maaf karna, ikk samassia hai." },
    ],
  },
  {
    id: "pa_a2_integration_school",
    scenario: "school",
    style: "final_qa",
    title_vi: "Final QA: báo vắng học",
    title_en: "Final QA: school absence",
    learner_task_vi: "Báo con vắng học, nêu lý do đơn giản, và hỏi bài tập.",
    learner_task_en: "Report a child's absence, give a simple reason, and ask about homework.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được khi gọi school office hoặc nhắn giáo viên tại Canada.",
    canada_practical_en: "Usable when calling a school office or messaging a teacher in Canada.",
    input_context_vi: "Con bạn bị sốt và không thể đi học hôm nay.",
    input_context_en: "Your child has a fever and cannot attend school today.",
    sample_lines: [
      { pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "mera bachcha ajj school nahi aa sakda.", vi: "Con tôi hôm nay không thể đến trường.", en: "My child cannot come to school today." },
      { pa: "ਉਸ ਨੂੰ ਬੁਖਾਰ ਹੈ।", romanization: "us nu bukhar hai.", vi: "Em ấy bị sốt.", en: "He/she has a fever." },
      { pa: "ਕੀ ਹੋਮਵਰਕ ਈਮੇਲ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki homework email kar sakde ho?", vi: "Bạn có thể gửi bài tập qua email không?", en: "Can you email the homework?" },
    ],
    final_evidence: [
      { cue_vi: "Lý do vắng?", cue_en: "Reason for absence?", expected_pa: "ਬੁਖਾਰ ਹੈ", expected_romanization: "bukhar hai", expected_vi: "Bị sốt.", expected_en: "Has a fever." },
      { cue_vi: "Yêu cầu?", cue_en: "Request?", expected_pa: "ਹੋਮਵਰਕ ਈਮੇਲ ਕਰ ਸਕਦੇ ਹੋ?", expected_romanization: "homework email kar sakde ho?", expected_vi: "Gửi bài tập qua email.", expected_en: "Email the homework." },
    ],
    integration_note_vi: "Mẫu nối school absence, health basics, ਅਤੇ polite school request.",
    integration_note_en: "The sample connects school absence, health basics, and a polite school request.",
    traps: [
      { trap_vi: "ਮੇਰਾ/ਮੇਰੀ phải agree với danh từ sau.", trap_en: "ਮੇਰਾ/ਮੇਰੀ must agree with the following noun.", fix_pa: "ਮੇਰਾ ਬੱਚਾ", fix_romanization: "mera bachcha" },
    ],
  },
  {
    id: "pa_a2_integration_childcare",
    scenario: "childcare",
    style: "integration_sample",
    title_vi: "Integration sample: đón trẻ",
    title_en: "Integration sample: child pickup",
    learner_task_vi: "Báo giờ đón, người đón thay, và xin nhắc giáo viên.",
    learner_task_en: "State pickup time, alternate pickup person, and ask staff to tell the teacher.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Phù hợp daycare/after-school care khi có pickup list.",
    canada_practical_en: "Fits daycare/after-school care when there is a pickup list.",
    input_context_vi: "Bạn sẽ đến muộn và chồng/vợ sẽ đón trẻ.",
    input_context_en: "You will be late and your spouse will pick up the child.",
    sample_lines: [
      { pa: "ਮੈਂ ਅੱਜ ਪੰਜ ਵਜੇ ਨਹੀਂ ਆ ਸਕਦੀ।", romanization: "main ajj panj vaje nahi aa sakdi.", vi: "Hôm nay tôi không thể đến lúc năm giờ. (nữ)", en: "I cannot come at five today. (female speaker)" },
      { pa: "ਮੇਰਾ ਪਤੀ ਬੱਚੇ ਨੂੰ ਲੈਣ ਆਵੇਗਾ।", romanization: "mera pati bachche nu lain aavega.", vi: "Chồng tôi sẽ đến đón trẻ.", en: "My husband will come to pick up the child." },
      { pa: "ਕੀ ਤੁਸੀਂ ਅਧਿਆਪਕ ਨੂੰ ਦੱਸ ਸਕਦੇ ਹੋ?", romanization: "ki tusi adhiaapak nu dass sakde ho?", vi: "Bạn có thể báo với giáo viên không?", en: "Can you tell the teacher?" },
    ],
    final_evidence: [
      { cue_vi: "Ai đón trẻ?", cue_en: "Who picks up the child?", expected_pa: "ਮੇਰਾ ਪਤੀ", expected_romanization: "mera pati", expected_vi: "Chồng tôi.", expected_en: "My husband." },
      { cue_vi: "Cụm đón trẻ?", cue_en: "Pickup phrase?", expected_pa: "ਬੱਚੇ ਨੂੰ ਲੈਣ ਆਵੇਗਾ", expected_romanization: "bachche nu lain aavega", expected_vi: "Sẽ đến đón trẻ.", expected_en: "Will come to pick up the child." },
    ],
    integration_note_vi: "Mẫu tích hợp time, inability, future pickup, và indirect request.",
    integration_note_en: "The sample integrates time, inability, future pickup, and an indirect request.",
    traps: [
      { trap_vi: "Người nói nữ dùng ਸਕਦੀ; người nói nam dùng ਸਕਦਾ.", trap_en: "A female speaker uses ਸਕਦੀ; a male speaker uses ਸਕਦਾ.", fix_pa: "ਮੈਂ ਨਹੀਂ ਆ ਸਕਦੀ।", fix_romanization: "main nahi aa sakdi." },
    ],
  },
  {
    id: "pa_a2_integration_workplace_small_talk",
    scenario: "workplace_small_talk",
    style: "integration_sample",
    title_vi: "Integration sample: small talk nơi làm",
    title_en: "Integration sample: workplace small talk",
    learner_task_vi: "Mở small talk lịch sự, trả lời ngắn, và chuyển sang công việc.",
    learner_task_en: "Open polite small talk, answer briefly, and move to work.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Weather/weekend small talk thường an toàn trong workplace Canada.",
    canada_practical_en: "Weather/weekend small talk is often safe in Canadian workplaces.",
    input_context_vi: "Bạn gặp đồng nghiệp đầu ca.",
    input_context_en: "You meet a coworker at the start of a shift.",
    sample_lines: [
      { pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਤੁਹਾਡਾ ਵੀਕਐਂਡ ਕਿਵੇਂ ਸੀ?", romanization: "sat sri akal, tuhada weekend kiven si?", vi: "Xin chào, cuối tuần của bạn thế nào?", en: "Hello, how was your weekend?" },
      { pa: "ਮੇਰਾ ਵੀਕਐਂਡ ਚੰਗਾ ਸੀ, ਧੰਨਵਾਦ।", romanization: "mera weekend changa si, dhanvaad.", vi: "Cuối tuần của tôi tốt, cảm ơn.", en: "My weekend was good, thank you." },
      { pa: "ਹੁਣ ਅਸੀਂ ਕੰਮ ਸ਼ੁਰੂ ਕਰੀਏ?", romanization: "hun asin kamm shuru kariye?", vi: "Bây giờ chúng ta bắt đầu làm việc nhé?", en: "Shall we start work now?" },
    ],
    final_evidence: [
      { cue_vi: "Polite possessive?", cue_en: "Polite possessive?", expected_pa: "ਤੁਹਾਡਾ", expected_romanization: "tuhada", expected_vi: "Của bạn, lịch sự.", expected_en: "Your, polite." },
      { cue_vi: "Chuyển sang công việc?", cue_en: "Move to work?", expected_pa: "ਕੰਮ ਸ਼ੁਰੂ ਕਰੀਏ?", expected_romanization: "kamm shuru kariye?", expected_vi: "Bắt đầu làm việc nhé?", expected_en: "Shall we start work?" },
    ],
    integration_note_vi: "Mẫu nối greeting, polite pronoun, brief answer, và transition phrase.",
    integration_note_en: "The sample connects greeting, polite pronoun, brief answer, and a transition phrase.",
    traps: [
      { trap_vi: "ਤੂੰ/ਤੇਰਾ có thể quá thân mật với đồng nghiệp mới.", trap_en: "ਤੂੰ/ਤੇਰਾ can be too familiar with a new coworker.", fix_pa: "ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", fix_romanization: "tuhada din kiven hai?" },
    ],
  },
  {
    id: "pa_a2_integration_polite_problem",
    scenario: "polite_problem_explanation",
    style: "final_evidence",
    title_vi: "Final evidence: giải thích vấn đề lịch sự",
    title_en: "Final evidence: polite problem explanation",
    learner_task_vi: "Mở lịch sự, nêu vấn đề nhỏ, và yêu cầu giúp đỡ cụ thể.",
    learner_task_en: "Open politely, state a small problem, and ask for specific help.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Hữu ích ở front desk, clinic, library, school office, hoặc service counter.",
    canada_practical_en: "Useful at a front desk, clinic, library, school office, or service counter.",
    input_context_vi: "Bạn điền form nhưng không hiểu một câu hỏi.",
    input_context_en: "You are filling a form but do not understand one question.",
    sample_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਇੱਕ ਛੋਟੀ ਸਮੱਸਿਆ ਹੈ।", romanization: "maaf karna, mainu ikk chhoti samassia hai.", vi: "Xin lỗi, tôi có một vấn đề nhỏ.", en: "Sorry, I have a small problem." },
      { pa: "ਮੈਨੂੰ ਇਹ ਸਵਾਲ ਸਮਝ ਨਹੀਂ ਆ ਰਿਹਾ।", romanization: "mainu eh sawaal samajh nahi aa riha.", vi: "Tôi không hiểu câu hỏi này.", en: "I do not understand this question." },
      { pa: "ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusi madad kar sakde ho?", vi: "Bạn có thể giúp không?", en: "Can you help?" },
    ],
    final_evidence: [
      { cue_vi: "Vấn đề là gì?", cue_en: "What is the problem?", expected_pa: "ਸਵਾਲ ਸਮਝ ਨਹੀਂ ਆ ਰਿਹਾ", expected_romanization: "sawaal samajh nahi aa riha", expected_vi: "Không hiểu câu hỏi.", expected_en: "Does not understand the question." },
      { cue_vi: "Yêu cầu giúp?", cue_en: "Help request?", expected_pa: "ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?", expected_romanization: "madad kar sakde ho?", expected_vi: "Bạn có thể giúp không?", expected_en: "Can you help?" },
    ],
    integration_note_vi: "Mẫu tích hợp ਮੈਨੂੰ ... ਹੈ, comprehension problem, ਅਤੇ polite modal request.",
    integration_note_en: "The sample integrates ਮੈਨੂੰ ... ਹੈ, a comprehension problem, and a polite modal request.",
    traps: [
      { trap_vi: "Đừng chỉ nói 'problem' mà không nói cần giúp gì.", trap_en: "Do not only say 'problem' without saying what help is needed.", fix_pa: "ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?", fix_romanization: "ki tusi madad kar sakde ho?" },
    ],
  },
  {
    id: "pa_a2_integration_repair",
    scenario: "interaction_repair",
    style: "final_qa",
    title_vi: "Final QA: sửa tương tác",
    title_en: "Final QA: interaction repair",
    learner_task_vi: "Xin nhắc lại, xin nói chậm, và xác nhận ý hiểu.",
    learner_task_en: "Ask for repetition, ask for slower speech, and confirm understanding.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    input_context_vi: "Bạn không nghe rõ ở quầy dịch vụ.",
    input_context_en: "You did not hear clearly at a service counter.",
    sample_lines: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusi dubara kahi sakde ho?", vi: "Xin lỗi, bạn có thể nói lại không?", en: "Sorry, can you say that again?" },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।", romanization: "kirpa karke hauli bolo.", vi: "Xin hãy nói chậm.", en: "Please speak slowly." },
      { pa: "ਕੀ ਇਸ ਦਾ ਮਤਲਬ ਇਹ ਹੈ ਕਿ ਮੈਨੂੰ ਕੱਲ੍ਹ ਆਉਣਾ ਹੈ?", romanization: "ki is da matlab eh hai ki mainu kal auna hai?", vi: "Có phải ý là tôi phải đến ngày mai không?", en: "Does this mean that I need to come tomorrow?" },
    ],
    final_evidence: [
      { cue_vi: "Xin nhắc lại?", cue_en: "Ask for repetition?", expected_pa: "ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", expected_romanization: "dubara kahi sakde ho?", expected_vi: "Bạn có thể nói lại không?", expected_en: "Can you say that again?" },
      { cue_vi: "Xác nhận ý hiểu?", cue_en: "Confirm understanding?", expected_pa: "ਇਸ ਦਾ ਮਤਲਬ ਇਹ ਹੈ ਕਿ", expected_romanization: "is da matlab eh hai ki", expected_vi: "Có phải ý là...", expected_en: "Does this mean that..." },
    ],
    integration_note_vi: "Mẫu tích hợp repair phrase, polite imperative, và confirmation frame.",
    integration_note_en: "The sample integrates a repair phrase, polite imperative, and a confirmation frame.",
    traps: [
      { trap_vi: "Đừng đoán im lặng khi không hiểu thông tin quan trọng.", trap_en: "Do not silently guess when important information is unclear.", fix_pa: "ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", fix_romanization: "ki tusi dubara kahi sakde ho?" },
    ],
  },
];
