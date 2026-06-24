// src/languages/punjabi/exitTicketsA2.ts
//
// Punjabi A2 exit tickets for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred.

export type PunjabiExitTicketA2Scenario =
  | "daily_routine"
  | "appointments"
  | "transport"
  | "housing"
  | "school"
  | "childcare"
  | "workplace_small_talk"
  | "polite_problem_explanation"
  | "short_message_comprehension"
  | "interaction_repair";

export type PunjabiExitTicketA2Style =
  | "exit_ticket"
  | "final_proof"
  | "final_qa";

export type PunjabiExitTicketA2Target = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiExitTicketA2Trap = {
  trap_vi: string;
  trap_en: string;
  fix_pa: string;
  fix_romanization: string;
};

export type PunjabiExitTicketA2 = {
  id: string;
  scenario: PunjabiExitTicketA2Scenario;
  style: PunjabiExitTicketA2Style;
  title_vi: string;
  title_en: string;
  prompt_vi: string;
  prompt_en: string;
  expected: PunjabiExitTicketA2Target;
  accept_also?: PunjabiExitTicketA2Target[];
  proof_check_vi: string;
  proof_check_en: string;
  explanation_vi: string;
  explanation_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  traps: PunjabiExitTicketA2Trap[];
  pass_signal_vi: string;
  pass_signal_en: string;
};

const scriptAwarenessVi = "Gurmukhi là chữ chính trong exit tickets; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn = "Gurmukhi is the main script in these exit tickets; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const exitTicketsA2: PunjabiExitTicketA2[] = [
  {
    id: "pa_a2_exit_daily_routine",
    scenario: "daily_routine",
    style: "exit_ticket",
    title_vi: "Exit ticket: thói quen buổi sáng",
    title_en: "Exit ticket: morning routine",
    prompt_vi: "Viết một câu: Tôi đi học lúc tám giờ. (nữ)",
    prompt_en: "Write one sentence: I go to school at eight. (female speaker)",
    expected: { pa: "ਮੈਂ ਅੱਠ ਵਜੇ ਸਕੂਲ ਜਾਂਦੀ ਹਾਂ।", romanization: "main ath vaje school jandi haan.", vi: "Tôi đi học lúc tám giờ.", en: "I go to school at eight." },
    proof_check_vi: "Có giờ với ਵਜੇ và habitual feminine ਜਾਂਦੀ ਹਾਂ.",
    proof_check_en: "Includes clock time with ਵਜੇ and feminine habitual ਜਾਂਦੀ ਹਾਂ.",
    explanation_vi: "ਜਾਂਦੀ agrees với người nói nữ; động từ đứng cuối câu.",
    explanation_en: "ਜਾਂਦੀ agrees with a female speaker; the verb stays at the end.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    traps: [{ trap_vi: "Người nói nữ không dùng ਜਾਂਦਾ.", trap_en: "A female speaker does not use ਜਾਂਦਾ.", fix_pa: "ਮੈਂ ਜਾਂਦੀ ਹਾਂ।", fix_romanization: "main jandi haan." }],
    pass_signal_vi: "Câu đạt nếu có ਅੱਠ ਵਜੇ, ਸਕੂਲ, ਜਾਂਦੀ ਹਾਂ.",
    pass_signal_en: "Passes if it has ਅੱਠ ਵਜੇ, ਸਕੂਲ, ਜਾਂਦੀ ਹਾਂ.",
  },
  {
    id: "pa_a2_exit_appointments",
    scenario: "appointments",
    style: "final_qa",
    title_vi: "Final QA: đổi lịch hẹn",
    title_en: "Final QA: rescheduling an appointment",
    prompt_vi: "Hỏi lịch sự: Tôi có thể đổi lịch hẹn sang thứ Sáu lúc ba giờ không?",
    prompt_en: "Ask politely: Can I move the appointment to Friday at three?",
    expected: { pa: "ਕੀ ਮੈਂ ਅਪਾਇੰਟਮੈਂਟ ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ ਕਰ ਸਕਦਾ ਹਾਂ?", romanization: "ki main appointment shukkarvaar tinn vaje kar sakda haan?", vi: "Tôi có thể đổi lịch hẹn sang thứ Sáu lúc ba giờ không? (nam)", en: "Can I make the appointment Friday at three? (male speaker)" },
    accept_also: [{ pa: "ਕੀ ਮੈਂ ਅਪਾਇੰਟਮੈਂਟ ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ ਕਰ ਸਕਦੀ ਹਾਂ?", romanization: "ki main appointment shukkarvaar tinn vaje kar sakdi haan?", vi: "Tôi có thể đổi lịch hẹn sang thứ Sáu lúc ba giờ không? (nữ)", en: "Can I make the appointment Friday at three? (female speaker)" }],
    proof_check_vi: "Có question frame ਕੀ ਮੈਂ, ngày, giờ, và ਸਕਦਾ/ਸਕਦੀ ਹਾਂ.",
    proof_check_en: "Includes ਕੀ ਮੈਂ question frame, day, time, and ਸਕਦਾ/ਸਕਦੀ ਹਾਂ.",
    explanation_vi: "ਸਕਦਾ/ਸਕਦੀ đổi theo người nói; ਤਿੰਨ ਵਜੇ giữ marker giờ.",
    explanation_en: "ਸਕਦਾ/ਸਕਦੀ changes with speaker gender; ਤਿੰਨ ਵਜੇ keeps the clock-time marker.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Hữu ích khi gọi clinic, dentist, settlement office, hoặc school office tại Canada.",
    canada_practical_en: "Useful when calling a clinic, dentist, settlement office, or school office in Canada.",
    traps: [{ trap_vi: "Đừng bỏ ngày/giờ mới khi xin đổi lịch.", trap_en: "Do not omit the new day/time when rescheduling.", fix_pa: "ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ", fix_romanization: "shukkarvaar tinn vaje" }],
    pass_signal_vi: "Câu đạt nếu người học nêu rõ appointment + ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ.",
    pass_signal_en: "Passes if the learner clearly states appointment + ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ.",
  },
  {
    id: "pa_a2_exit_transport",
    scenario: "transport",
    style: "exit_ticket",
    title_vi: "Exit ticket: hỏi tuyến xe",
    title_en: "Exit ticket: asking a route",
    prompt_vi: "Hỏi: Xe buýt này có đi tới thư viện không?",
    prompt_en: "Ask: Does this bus go to the library?",
    expected: { pa: "ਕੀ ਇਹ ਬੱਸ ਲਾਇਬ੍ਰੇਰੀ ਤੱਕ ਜਾਂਦੀ ਹੈ?", romanization: "ki eh bass library takk jandi hai?", vi: "Xe buýt này có đi tới thư viện không?", en: "Does this bus go to the library?" },
    proof_check_vi: "Có ਕੀ, ਇਹ ਬੱਸ, ਤੱਕ, và ਜਾਂਦੀ ਹੈ.",
    proof_check_en: "Includes ਕੀ, ਇਹ ਬੱਸ, ਤੱਕ, and ਜਾਂਦੀ ਹੈ.",
    explanation_vi: "ਬੱਸ thường dùng feminine agreement ਜਾਂਦੀ trong mẫu này.",
    explanation_en: "ਬੱਸ usually takes feminine agreement ਜਾਂਦੀ in this pattern.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được với bus, SkyTrain, TTC, GO Train, stop/platform.",
    canada_practical_en: "Usable with buses, SkyTrain, TTC, GO Train, stops/platforms.",
    traps: [{ trap_vi: "Đừng dùng ਜਾਂਦਾ với ਬੱਸ trong mẫu kiểm tra này.", trap_en: "Do not use ਜਾਂਦਾ with ਬੱਸ in this check.", fix_pa: "ਬੱਸ ਜਾਂਦੀ ਹੈ।", fix_romanization: "bass jandi hai." }],
    pass_signal_vi: "Câu đạt nếu hỏi được tuyến và đích đến.",
    pass_signal_en: "Passes if it asks the route and destination.",
  },
  {
    id: "pa_a2_exit_housing",
    scenario: "housing",
    style: "final_proof",
    title_vi: "Final proof: báo heater",
    title_en: "Final proof: reporting a heater",
    prompt_vi: "Viết tin nhắn ngắn: Xin lỗi, máy sưởi không hoạt động từ sáng. Bạn có thể xem hôm nay không?",
    prompt_en: "Write a short message: Sorry, the heater has not worked since morning. Can you check today?",
    expected: { pa: "ਮਾਫ਼ ਕਰਨਾ, ਹੀਟਰ ਸਵੇਰੇ ਤੋਂ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ। ਕੀ ਤੁਸੀਂ ਅੱਜ ਦੇਖ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, heater savere ton kamm nahi kar riha. ki tusi ajj dekh sakde ho?", vi: "Xin lỗi, máy sưởi không hoạt động từ sáng. Bạn có thể xem hôm nay không?", en: "Sorry, the heater has not worked since morning. Can you check today?" },
    proof_check_vi: "Có opener lịch sự, vấn đề, time marker ਤੋਂ, và request ਸਕਦੇ ਹੋ.",
    proof_check_en: "Includes polite opener, problem, time marker ਤੋਂ, and request ਸਕਦੇ ਹੋ.",
    explanation_vi: "ਮਾਫ਼ ਕਰਨਾ làm câu mềm; ਸਵੇਰੇ ਤੋਂ nói 'từ sáng'.",
    explanation_en: "ਮਾਫ਼ ਕਰਨਾ softens the message; ਸਵੇਰੇ ਤੋਂ means 'since morning'.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Thực tế khi nhắn landlord/building manager về sưởi trong mùa lạnh Canada.",
    canada_practical_en: "Practical when messaging a landlord/building manager about heat in Canadian cold seasons.",
    traps: [{ trap_vi: "Không chỉ nói 'heater problem' mà thiếu thời điểm hoặc yêu cầu.", trap_en: "Do not only say 'heater problem' without timing or request.", fix_pa: "ਕੀ ਤੁਸੀਂ ਅੱਜ ਦੇਖ ਸਕਦੇ ਹੋ?", fix_romanization: "ki tusi ajj dekh sakde ho?" }],
    pass_signal_vi: "Câu đạt nếu người nhận hiểu vấn đề và hành động cần làm.",
    pass_signal_en: "Passes if the recipient understands the problem and needed action.",
  },
  {
    id: "pa_a2_exit_school",
    scenario: "school",
    style: "final_qa",
    title_vi: "Final QA: báo vắng học",
    title_en: "Final QA: school absence",
    prompt_vi: "Nói: Con tôi hôm nay không thể đến trường vì bị sốt.",
    prompt_en: "Say: My child cannot come to school today because they have a fever.",
    expected: { pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ ਕਿਉਂਕਿ ਉਸ ਨੂੰ ਬੁਖਾਰ ਹੈ।", romanization: "mera bachcha ajj school nahi aa sakda kyonki us nu bukhar hai.", vi: "Con tôi hôm nay không thể đến trường vì em ấy bị sốt.", en: "My child cannot come to school today because they have a fever." },
    proof_check_vi: "Có ਮੇਰਾ ਬੱਚਾ, ਅੱਜ, ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ, và reason ਬੁਖਾਰ.",
    proof_check_en: "Includes ਮੇਰਾ ਬੱਚਾ, ਅੱਜ, ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ, and fever reason.",
    explanation_vi: "ਮੇਰਾ agrees với ਬੱਚਾ; ਕਿਉਂਕਿ nối lý do.",
    explanation_en: "ਮੇਰਾ agrees with ਬੱਚਾ; ਕਿਉਂਕਿ connects the reason.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được khi gọi school office hoặc nhắn giáo viên tại Canada.",
    canada_practical_en: "Usable when calling a Canadian school office or messaging a teacher.",
    traps: [{ trap_vi: "ਮੇਰਾ/ਮੇਰੀ phải theo danh từ sau, không theo người nói.", trap_en: "ਮੇਰਾ/ਮੇਰੀ follows the noun, not the speaker.", fix_pa: "ਮੇਰਾ ਬੱਚਾ", fix_romanization: "mera bachcha" }],
    pass_signal_vi: "Câu đạt nếu có absence + lý do đơn giản.",
    pass_signal_en: "Passes if it has absence + a simple reason.",
  },
  {
    id: "pa_a2_exit_childcare",
    scenario: "childcare",
    style: "exit_ticket",
    title_vi: "Exit ticket: đổi người đón trẻ",
    title_en: "Exit ticket: alternate child pickup",
    prompt_vi: "Nói: Hôm nay chồng tôi sẽ đến đón trẻ lúc năm giờ.",
    prompt_en: "Say: Today my husband will come to pick up the child at five.",
    expected: { pa: "ਅੱਜ ਮੇਰਾ ਪਤੀ ਬੱਚੇ ਨੂੰ ਪੰਜ ਵਜੇ ਲੈਣ ਆਵੇਗਾ।", romanization: "ajj mera pati bachche nu panj vaje lain aavega.", vi: "Hôm nay chồng tôi sẽ đến đón trẻ lúc năm giờ.", en: "Today my husband will come to pick up the child at five." },
    proof_check_vi: "Có ਅੱਜ, ਮੇਰਾ ਪਤੀ, ਬੱਚੇ ਨੂੰ, ਪੰਜ ਵਜੇ, ਲੈਣ ਆਵੇਗਾ.",
    proof_check_en: "Includes ਅੱਜ, ਮੇਰਾ ਪਤੀ, ਬੱਚੇ ਨੂੰ, ਪੰਜ ਵਜੇ, ਲੈਣ ਆਵੇਗਾ.",
    explanation_vi: "ਲੈਣ ਆਉਣਾ = đến đón; ਆਵੇਗਾ agrees với ਪਤੀ.",
    explanation_en: "ਲੈਣ ਆਉਣਾ = come to pick up; ਆਵੇਗਾ agrees with ਪਤੀ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Phù hợp daycare/after-school pickup khi người đón thay nằm trong pickup list.",
    canada_practical_en: "Fits daycare/after-school pickup when the alternate person is on the pickup list.",
    traps: [{ trap_vi: "Đừng bỏ giờ đón trong tin nhắn childcare.", trap_en: "Do not omit the pickup time in a childcare message.", fix_pa: "ਪੰਜ ਵਜੇ ਲੈਣ ਆਵੇਗਾ", fix_romanization: "panj vaje lain aavega" }],
    pass_signal_vi: "Câu đạt nếu staff biết ai đón và mấy giờ.",
    pass_signal_en: "Passes if staff know who is picking up and when.",
  },
  {
    id: "pa_a2_exit_workplace_small_talk",
    scenario: "workplace_small_talk",
    style: "exit_ticket",
    title_vi: "Exit ticket: small talk nơi làm",
    title_en: "Exit ticket: workplace small talk",
    prompt_vi: "Hỏi lịch sự: Cuối tuần của bạn thế nào? Rồi nói: Của tôi tốt, cảm ơn.",
    prompt_en: "Ask politely: How was your weekend? Then say: Mine was good, thank you.",
    expected: { pa: "ਤੁਹਾਡਾ ਵੀਕਐਂਡ ਕਿਵੇਂ ਸੀ? ਮੇਰਾ ਚੰਗਾ ਸੀ, ਧੰਨਵਾਦ।", romanization: "tuhada weekend kiven si? mera changa si, dhanvaad.", vi: "Cuối tuần của bạn thế nào? Của tôi tốt, cảm ơn.", en: "How was your weekend? Mine was good, thank you." },
    proof_check_vi: "Có polite possessive ਤੁਹਾਡਾ và câu trả lời ngắn.",
    proof_check_en: "Includes polite possessive ਤੁਹਾਡਾ and a brief answer.",
    explanation_vi: "ਤੁਹਾਡਾ lịch sự hơn ਤੇਰਾ trong workplace với người chưa thân.",
    explanation_en: "ਤੁਹਾਡਾ is more polite than ਤੇਰਾ in a workplace with someone not close.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Weekend/weather small talk thường an toàn ở nhiều workplace Canada.",
    canada_practical_en: "Weekend/weather small talk is often safe in many Canadian workplaces.",
    traps: [{ trap_vi: "ਤੂੰ/ਤੇਰਾ có thể quá thân mật với đồng nghiệp mới.", trap_en: "ਤੂੰ/ਤੇਰਾ can be too familiar with a new coworker.", fix_pa: "ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", fix_romanization: "tuhada din kiven hai?" }],
    pass_signal_vi: "Câu đạt nếu mở nhẹ, lịch sự, và không quá riêng tư.",
    pass_signal_en: "Passes if it opens lightly, politely, and not too personally.",
  },
  {
    id: "pa_a2_exit_polite_problem",
    scenario: "polite_problem_explanation",
    style: "final_proof",
    title_vi: "Final proof: vấn đề với form",
    title_en: "Final proof: problem with a form",
    prompt_vi: "Nói lịch sự: Tôi có một vấn đề nhỏ. Tôi không hiểu câu hỏi này. Bạn có thể giúp không?",
    prompt_en: "Say politely: I have a small problem. I do not understand this question. Can you help?",
    expected: { pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਇੱਕ ਛੋਟੀ ਸਮੱਸਿਆ ਹੈ। ਮੈਨੂੰ ਇਹ ਸਵਾਲ ਸਮਝ ਨਹੀਂ ਆ ਰਿਹਾ। ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, mainu ikk chhoti samassia hai. mainu eh sawaal samajh nahi aa riha. ki tusi madad kar sakde ho?", vi: "Xin lỗi, tôi có một vấn đề nhỏ. Tôi không hiểu câu hỏi này. Bạn có thể giúp không?", en: "Sorry, I have a small problem. I do not understand this question. Can you help?" },
    proof_check_vi: "Có opener, vấn đề cụ thể, và yêu cầu giúp đỡ.",
    proof_check_en: "Includes opener, specific problem, and help request.",
    explanation_vi: "ਮੈਨੂੰ ... ਹੈ nói 'tôi có'; ਸਮਝ ਨਹੀਂ ਆ ਰਿਹਾ nói 'không hiểu'.",
    explanation_en: "ਮੈਨੂੰ ... ਹੈ means 'I have'; ਸਮਝ ਨਹੀਂ ਆ ਰਿਹਾ means 'do not understand'.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Hữu ích ở clinic, library, school office, settlement office, hoặc service counter.",
    canada_practical_en: "Useful at a clinic, library, school office, settlement office, or service counter.",
    traps: [{ trap_vi: "Không chỉ nói 'problem' mà không nói cần giúp gì.", trap_en: "Do not only say 'problem' without saying what help is needed.", fix_pa: "ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?", fix_romanization: "ki tusi madad kar sakde ho?" }],
    pass_signal_vi: "Câu đạt nếu người nghe biết vấn đề và yêu cầu.",
    pass_signal_en: "Passes if the listener knows the problem and the request.",
  },
  {
    id: "pa_a2_exit_short_message_comprehension",
    scenario: "short_message_comprehension",
    style: "final_qa",
    title_vi: "Final QA: hiểu tin nhắn ngắn",
    title_en: "Final QA: short-message comprehension",
    prompt_vi: "Đọc tin nhắn và trả lời: 'ਕਲਾਸ ਅੱਜ ਦੋ ਵਜੇ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਕਿਤਾਬ ਲਿਆਓ।' Khi nào có lớp và cần mang gì?",
    prompt_en: "Read the message and answer: 'ਕਲਾਸ ਅੱਜ ਦੋ ਵਜੇ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਕਿਤਾਬ ਲਿਆਓ।' When is class and what should you bring?",
    expected: { pa: "ਕਲਾਸ ਅੱਜ ਦੋ ਵਜੇ ਹੈ। ਮੈਨੂੰ ਕਿਤਾਬ ਲਿਆਉਣੀ ਹੈ।", romanization: "class ajj do vaje hai. mainu kitaab liauni hai.", vi: "Lớp học hôm nay lúc hai giờ. Tôi cần mang sách.", en: "Class is today at two. I need to bring a book." },
    proof_check_vi: "Có thông tin giờ và vật cần mang.",
    proof_check_en: "Includes the time and the item to bring.",
    explanation_vi: "ਅੱਜ ਦੋ ਵਜੇ trả lời thời gian; ਕਿਤਾਬ là đồ cần mang.",
    explanation_en: "ਅੱਜ ਦੋ ਵਜੇ answers the time; ਕਿਤਾਬ is the item to bring.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được với school, library class, settlement class, hoặc workplace training notice.",
    canada_practical_en: "Usable with school, library class, settlement class, or workplace training notices.",
    traps: [{ trap_vi: "Đừng trả lời chỉ 'today' mà thiếu giờ.", trap_en: "Do not answer only 'today' without the time.", fix_pa: "ਅੱਜ ਦੋ ਵਜੇ", fix_romanization: "ajj do vaje" }],
    pass_signal_vi: "Câu đạt nếu người học lấy đúng ਦੋ ਵਜੇ và ਕਿਤਾਬ.",
    pass_signal_en: "Passes if the learner extracts ਦੋ ਵਜੇ and ਕਿਤਾਬ.",
  },
  {
    id: "pa_a2_exit_interaction_repair",
    scenario: "interaction_repair",
    style: "final_qa",
    title_vi: "Final QA: sửa tương tác",
    title_en: "Final QA: interaction repair",
    prompt_vi: "Nói: Xin lỗi, bạn có thể nói lại chậm hơn không?",
    prompt_en: "Say: Sorry, can you say that again more slowly?",
    expected: { pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਹੌਲੀ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusi hauli dubara kahi sakde ho?", vi: "Xin lỗi, bạn có thể nói lại chậm hơn không?", en: "Sorry, can you say that again more slowly?" },
    accept_also: [{ pa: "ਮਾਫ਼ ਕਰਨਾ, ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਬਾਰਾ ਕਹੋ।", romanization: "maaf karna, kirpa karke hauli dubara kaho.", vi: "Xin lỗi, xin hãy nói lại chậm hơn.", en: "Sorry, please say that again more slowly." }],
    proof_check_vi: "Có ਮਾਫ਼ ਕਰਨਾ, ਦੁਬਾਰਾ, ਹੌਲੀ, và request lịch sự.",
    proof_check_en: "Includes ਮਾਫ਼ ਕਰਨਾ, ਦੁਬਾਰਾ, ਹੌਲੀ, and a polite request.",
    explanation_vi: "Dùng repair phrase thay vì đoán khi thông tin quan trọng chưa rõ.",
    explanation_en: "Use a repair phrase instead of guessing when important information is unclear.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    traps: [{ trap_vi: "Đừng chỉ nói 'what?' trong môi trường lịch sự.", trap_en: "Do not just say 'what?' in a polite setting.", fix_pa: "ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", fix_romanization: "ki tusi dubara kahi sakde ho?" }],
    pass_signal_vi: "Câu đạt nếu xin lặp lại và xin nói chậm.",
    pass_signal_en: "Passes if it asks for repetition and slower speech.",
  },
];
