// src/languages/punjabi/finalReviewDeckA2.ts
//
// Punjabi A2 final review deck for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred.

export type PunjabiFinalReviewA2Topic =
  | "daily_life"
  | "appointments"
  | "transport"
  | "housing"
  | "school"
  | "childcare"
  | "workplace_small_talk"
  | "polite_problem_descriptions"
  | "interaction_repair";

export type PunjabiFinalReviewA2CardType =
  | "checkpoint"
  | "qa"
  | "choose_form"
  | "reading"
  | "roleplay";

export type PunjabiFinalReviewA2Model = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiFinalReviewA2Card = {
  id: string;
  topic: PunjabiFinalReviewA2Topic;
  type: PunjabiFinalReviewA2CardType;
  title_vi: string;
  title_en: string;
  prompt_vi: string;
  prompt_en: string;
  answer: PunjabiFinalReviewA2Model;
  explanation_vi: string;
  explanation_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  common_trap_vi: string;
  common_trap_en: string;
  follow_up_vi: string;
  follow_up_en: string;
};

const scriptAwarenessVi = "Gurmukhi là chữ chính trong deck ôn tập; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn = "Gurmukhi is the main script in this review deck; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const finalReviewDeckA2: PunjabiFinalReviewA2Card[] = [
  {
    id: "pa_a2_final_daily_habit",
    topic: "daily_life",
    type: "checkpoint",
    title_vi: "Thói quen buổi sáng",
    title_en: "Morning habit",
    prompt_vi: "Nói: Tôi uống trà buổi sáng. (nữ)",
    prompt_en: "Say: I drink tea in the morning. (female speaker)",
    answer: { pa: "ਮੈਂ ਸਵੇਰੇ ਚਾਹ ਪੀਂਦੀ ਹਾਂ।", romanization: "main savere chah peendi haan.", vi: "Tôi uống trà buổi sáng.", en: "I drink tea in the morning." },
    explanation_vi: "Thói quen dùng -ਦਾ/-ਦੀ. Người nói nữ dùng ਪੀਂਦੀ.",
    explanation_en: "Habits use -ਦਾ/-ਦੀ. A female speaker uses ਪੀਂਦੀ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    common_trap_vi: "Đừng dùng ਪੀਂਦਾ cho mọi người nói.",
    common_trap_en: "Do not use ਪੀਂਦਾ for every speaker.",
    follow_up_vi: "Đổi thành người nói nam và thay trà bằng nước.",
    follow_up_en: "Change to a male speaker and replace tea with water.",
  },
  {
    id: "pa_a2_final_daily_past",
    topic: "daily_life",
    type: "qa",
    title_vi: "Việc đã làm hôm qua",
    title_en: "Yesterday's action",
    prompt_vi: "Trả lời: Bạn đã làm gì hôm qua? Nói 'Tôi đã làm việc'.",
    prompt_en: "Answer: What did you do yesterday? Say 'I worked'.",
    answer: { pa: "ਕੱਲ੍ਹ ਮੈਂ ਕੰਮ ਕੀਤਾ।", romanization: "kal main kamm kita.", vi: "Hôm qua tôi đã làm việc.", en: "Yesterday I worked." },
    explanation_vi: "ਕੀਤਾ là dạng quá khứ của ਕਰਨਾ trong cụm ਕੰਮ ਕਰਨਾ.",
    explanation_en: "ਕੀਤਾ is the past form of ਕਰਨਾ in ਕੰਮ ਕਰਨਾ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    common_trap_vi: "ਕੱਲ੍ਹ cần ngữ cảnh; với ਕੀਤਾ là quá khứ.",
    common_trap_en: "ਕੱਲ੍ਹ needs context; with ਕੀਤਾ it is past.",
    follow_up_vi: "Thay ਕੰਮ bằng ਨਾਸ਼ਤਾ để nói đã ăn sáng.",
    follow_up_en: "Replace ਕੰਮ with ਨਾਸ਼ਤਾ to say you had breakfast.",
  },
  {
    id: "pa_a2_final_appointment_time",
    topic: "appointments",
    type: "checkpoint",
    title_vi: "Xác nhận giờ hẹn",
    title_en: "Confirm appointment time",
    prompt_vi: "Nói: Lịch hẹn của tôi lúc hai giờ.",
    prompt_en: "Say: My appointment is at two.",
    answer: { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਦੋ ਵਜੇ ਹੈ।", romanization: "meri appointment do vaje hai.", vi: "Lịch hẹn của tôi lúc hai giờ.", en: "My appointment is at two." },
    explanation_vi: "Dùng ਵਜੇ cho giờ đồng hồ; ਮੇਰੀ agrees với ਅਪਾਇੰਟਮੈਂਟ.",
    explanation_en: "Use ਵਜੇ for clock time; ਮੇਰੀ agrees with ਅਪਾਇੰਟਮੈਂਟ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "ਅਪਾਇੰਟਮੈਂਟ là loanword rất thường gặp ở clinic Canada.",
    canada_practical_en: "ਅਪਾਇੰਟਮੈਂਟ is a common loanword in Canadian clinics.",
    common_trap_vi: "Không nói chỉ ਦੋ; cần ਦੋ ਵਜੇ.",
    common_trap_en: "Do not say only ਦੋ; use ਦੋ ਵਜੇ.",
    follow_up_vi: "Đổi giờ thành mười giờ sáng.",
    follow_up_en: "Change the time to ten in the morning.",
  },
  {
    id: "pa_a2_final_appointment_reschedule",
    topic: "appointments",
    type: "roleplay",
    title_vi: "Xin đổi lịch",
    title_en: "Ask to reschedule",
    prompt_vi: "Bạn muốn đổi lịch sang thứ Sáu lúc ba giờ.",
    prompt_en: "You want to move an appointment to Friday at three.",
    answer: { pa: "ਕੀ ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ?", romanization: "ki shukkarvaar tinn vaje sama mil sakda hai?", vi: "Thứ Sáu lúc ba giờ có giờ trống không?", en: "Is a time available Friday at three?" },
    explanation_vi: "ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ? là cách hỏi lịch sự về giờ trống.",
    explanation_en: "ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ? politely asks whether a time is available.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được ở dentist, clinic, settlement appointment.",
    canada_practical_en: "Useful for dentist, clinic, and settlement appointments.",
    common_trap_vi: "Đừng bỏ ngày mới khi đổi lịch.",
    common_trap_en: "Do not omit the new day when rescheduling.",
    follow_up_vi: "Thêm lý do đơn giản: Tôi đang làm việc.",
    follow_up_en: "Add a simple reason: I am working.",
  },
  {
    id: "pa_a2_final_transport_route",
    topic: "transport",
    type: "qa",
    title_vi: "Hỏi tuyến xe",
    title_en: "Ask a bus route",
    prompt_vi: "Hỏi: Xe buýt này đi đâu?",
    prompt_en: "Ask: Where does this bus go?",
    answer: { pa: "ਇਹ ਬੱਸ ਕਿੱਥੇ ਜਾਂਦੀ ਹੈ?", romanization: "eh bass kitthe jandi hai?", vi: "Xe buýt này đi đâu?", en: "Where does this bus go?" },
    explanation_vi: "ਬੱਸ thường dùng ਜਾਂਦੀ trong mẫu này.",
    explanation_en: "ਬੱਸ often takes ਜਾਂਦੀ in this pattern.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Có thể thay bằng route names như TTC, SkyTrain, Surrey Central.",
    canada_practical_en: "You can swap in route names like TTC, SkyTrain, Surrey Central.",
    common_trap_vi: "Đừng dùng ਜਾਂਦਾ với ਬੱਸ ở mẫu này.",
    common_trap_en: "Do not use ਜਾਂਦਾ with ਬੱਸ in this pattern.",
    follow_up_vi: "Hỏi tiếp: Tôi phải xuống ở đâu?",
    follow_up_en: "Follow up: Where should I get off?",
  },
  {
    id: "pa_a2_final_transport_delay",
    topic: "transport",
    type: "checkpoint",
    title_vi: "Báo đến muộn",
    title_en: "Report being late",
    prompt_vi: "Nói: Tôi sẽ đến muộn mười phút. (nam)",
    prompt_en: "Say: I will be ten minutes late. (male speaker)",
    answer: { pa: "ਮੈਂ ਦਸ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵਾਂਗਾ।", romanization: "main das mint der naal aavanga.", vi: "Tôi sẽ đến muộn mười phút.", en: "I will be ten minutes late." },
    explanation_vi: "ਦੇਰ ਨਾਲ = muộn; ਆਵਾਂਗਾ cho người nói nam.",
    explanation_en: "ਦੇਰ ਨਾਲ = late; ਆਵਾਂਗਾ for a male speaker.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Tin nhắn trễ cụ thể bằng số phút rất thực tế ở Canada.",
    canada_practical_en: "A delay message with exact minutes is practical in Canada.",
    common_trap_vi: "Người nói nữ dùng ਆਵਾਂਗੀ.",
    common_trap_en: "A female speaker uses ਆਵਾਂਗੀ.",
    follow_up_vi: "Đổi thành năm phút và người nói nữ.",
    follow_up_en: "Change to five minutes and a female speaker.",
  },
  {
    id: "pa_a2_final_housing_heater",
    topic: "housing",
    type: "checkpoint",
    title_vi: "Báo heater hỏng",
    title_en: "Report heater issue",
    prompt_vi: "Nói lịch sự: Xin lỗi, máy sưởi không hoạt động.",
    prompt_en: "Say politely: Sorry, the heater is not working.",
    answer: { pa: "ਮਾਫ਼ ਕਰਨਾ, ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "maaf karna, heater kamm nahi kar riha.", vi: "Xin lỗi, máy sưởi không hoạt động.", en: "Sorry, the heater is not working." },
    explanation_vi: "ਮਾਫ਼ ਕਰਨਾ làm câu mềm; ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ mô tả thiết bị lỗi.",
    explanation_en: "ਮਾਫ਼ ਕਰਨਾ softens the sentence; ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ describes a device not working.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Heater là loanword thường dùng trong tin nhắn landlord.",
    canada_practical_en: "Heater is a common loanword in landlord messages.",
    common_trap_vi: "Đừng mở bằng mệnh lệnh mạnh như 'đến ngay'.",
    common_trap_en: "Do not open with a strong command like 'come now'.",
    follow_up_vi: "Thêm thời gian: từ sáng nay.",
    follow_up_en: "Add timing: since this morning.",
  },
  {
    id: "pa_a2_final_housing_leak_reading",
    topic: "housing",
    type: "reading",
    title_vi: "Đọc tin nhắn sửa nhà",
    title_en: "Read a repair message",
    prompt_vi: "Đọc: ਰਸੋਈ ਵਿੱਚ ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ। Vấn đề ở đâu?",
    prompt_en: "Read: ਰਸੋਈ ਵਿੱਚ ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ। Where is the problem?",
    answer: { pa: "ਰਸੋਈ ਵਿੱਚ", romanization: "rasoi vich", vi: "Trong bếp.", en: "In the kitchen." },
    explanation_vi: "ਵਿੱਚ đánh dấu vị trí; ਰਸੋਈ = bếp.",
    explanation_en: "ਵਿੱਚ marks location; ਰਸੋਈ = kitchen.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Leak messages rất thường gặp với apartment/condo maintenance.",
    canada_practical_en: "Leak messages are common with apartment/condo maintenance.",
    common_trap_vi: "Đừng bỏ qua postposition ਵਿੱਚ.",
    common_trap_en: "Do not skip the postposition ਵਿੱਚ.",
    follow_up_vi: "Viết câu xin người quản lý đến xem.",
    follow_up_en: "Write a sentence asking the manager to come and look.",
  },
  {
    id: "pa_a2_final_school_homework",
    topic: "school",
    type: "qa",
    title_vi: "Hỏi hạn bài tập",
    title_en: "Ask homework due date",
    prompt_vi: "Hỏi: Khi nào phải nộp bài tập?",
    prompt_en: "Ask: When is the homework due?",
    answer: { pa: "ਹੋਮਵਰਕ ਕਦੋਂ ਦੇਣਾ ਹੈ?", romanization: "homework kadon dena hai?", vi: "Khi nào phải nộp bài tập?", en: "When is the homework due?" },
    explanation_vi: "ਦੇਣਾ ở đây nghĩa là nộp/đưa bài.",
    explanation_en: "ਦੇਣਾ here means submit/give in.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được với school office, adult class, parent-teacher messages.",
    canada_practical_en: "Useful with school offices, adult classes, and parent-teacher messages.",
    common_trap_vi: "Không dịch ਦੇਣਾ quá cứng là 'cho' trong ngữ cảnh này.",
    common_trap_en: "Do not translate ਦੇਣਾ too rigidly as 'give' here.",
    follow_up_vi: "Hỏi tiếp: Lớp ở phòng nào?",
    follow_up_en: "Follow up: Which room is the class in?",
  },
  {
    id: "pa_a2_final_school_absence",
    topic: "school",
    type: "checkpoint",
    title_vi: "Báo con vắng học",
    title_en: "Report child absence",
    prompt_vi: "Nói: Con tôi hôm nay không thể đến trường.",
    prompt_en: "Say: My child cannot come to school today.",
    answer: { pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "mera bachcha ajj school nahi aa sakda.", vi: "Con tôi hôm nay không thể đến trường.", en: "My child cannot come to school today." },
    explanation_vi: "ਸਕਦਾ agrees với ਬੱਚਾ; ਅੱਜ đặt trước nơi/động từ.",
    explanation_en: "ਸਕਦਾ agrees with ਬੱਚਾ; ਅੱਜ comes before the place/verb.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Tin nhắn vắng học nên thêm ngày và lý do ngắn.",
    canada_practical_en: "Absence messages should include date and a short reason.",
    common_trap_vi: "ਮੇਰਾ agrees với ਬੱਚਾ, không với người nói.",
    common_trap_en: "ਮੇਰਾ agrees with ਬੱਚਾ, not the speaker.",
    follow_up_vi: "Thêm lý do: bị sốt.",
    follow_up_en: "Add a reason: has a fever.",
  },
  {
    id: "pa_a2_final_childcare_pickup",
    topic: "childcare",
    type: "checkpoint",
    title_vi: "Giờ đón trẻ",
    title_en: "Child pickup time",
    prompt_vi: "Nói: Tôi sẽ đến đón trẻ lúc năm giờ. (nữ)",
    prompt_en: "Say: I will pick up the child at five. (female speaker)",
    answer: { pa: "ਮੈਂ ਬੱਚੇ ਨੂੰ ਪੰਜ ਵਜੇ ਲੈਣ ਆਵਾਂਗੀ।", romanization: "main bachche nu panj vaje lain aavangi.", vi: "Tôi sẽ đến đón trẻ lúc năm giờ.", en: "I will come to pick up the child at five." },
    explanation_vi: "ਬੱਚੇ ਨੂੰ đánh dấu trẻ được đón; ਆਵਾਂਗੀ cho người nói nữ.",
    explanation_en: "ਬੱਚੇ ਨੂੰ marks the child being picked up; ਆਵਾਂਗੀ for a female speaker.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Pickup/daycare có thể xuất hiện như loanwords trong Punjabi Canada.",
    canada_practical_en: "Pickup/daycare may appear as loanwords in Canadian Punjabi.",
    common_trap_vi: "Người nói nam dùng ਆਵਾਂਗਾ.",
    common_trap_en: "A male speaker uses ਆਵਾਂਗਾ.",
    follow_up_vi: "Hỏi: Bé đã ăn chưa?",
    follow_up_en: "Ask: Did the child eat?",
  },
  {
    id: "pa_a2_final_childcare_health",
    topic: "childcare",
    type: "choose_form",
    title_vi: "Sức khỏe của trẻ",
    title_en: "Child health",
    prompt_vi: "Chọn đúng: ਉਹ ਬੁਖਾਰ ਹੈ / ਉਸਨੂੰ ਬੁਖਾਰ ਹੈ",
    prompt_en: "Choose correctly: ਉਹ ਬੁਖਾਰ ਹੈ / ਉਸਨੂੰ ਬੁਖਾਰ ਹੈ",
    answer: { pa: "ਉਸਨੂੰ ਬੁਖਾਰ ਹੈ।", romanization: "usnu bukhar hai.", vi: "Bé bị sốt.", en: "The child has a fever." },
    explanation_vi: "Tình trạng sức khỏe dùng ਉਸਨੂੰ ... ਹੈ.",
    explanation_en: "Health conditions use ਉਸਨੂੰ ... ਹੈ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    common_trap_vi: "Không nói ਉਹ ਬੁਖਾਰ ਹੈ.",
    common_trap_en: "Do not say ਉਹ ਬੁਖਾਰ ਹੈ.",
    follow_up_vi: "Đổi thành 'hơi sốt' với ਥੋੜ੍ਹਾ.",
    follow_up_en: "Change to 'slight fever' with ਥੋੜ੍ਹਾ.",
  },
  {
    id: "pa_a2_final_work_small_talk",
    topic: "workplace_small_talk",
    type: "choose_form",
    title_vi: "Small talk lịch sự",
    title_en: "Polite small talk",
    prompt_vi: "Chọn lịch sự hơn với đồng nghiệp chưa thân: ਤੇਰਾ ਵੀਕਐਂਡ / ਤੁਹਾਡਾ ਵੀਕਐਂਡ",
    prompt_en: "Choose the more polite option with a coworker you do not know well: ਤੇਰਾ ਵੀਕਐਂਡ / ਤੁਹਾਡਾ ਵੀਕਐਂਡ",
    answer: { pa: "ਤੁਹਾਡਾ ਵੀਕਐਂਡ ਕਿਵੇਂ ਸੀ?", romanization: "tuhada weekend kiven si?", vi: "Cuối tuần của bạn thế nào?", en: "How was your weekend?" },
    explanation_vi: "ਤੁਹਾਡਾ lịch sự hơn ਤੇਰਾ.",
    explanation_en: "ਤੁਹਾਡਾ is more polite than ਤੇਰਾ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Weekend/weather small talk là an toàn trong workplace Canada.",
    canada_practical_en: "Weekend/weather small talk is safe in Canadian workplaces.",
    common_trap_vi: "ਤੂੰ/ਤੇਰਾ có thể quá thân mật.",
    common_trap_en: "ਤੂੰ/ਤੇਰਾ can be too intimate.",
    follow_up_vi: "Hỏi thêm: Công việc đang thế nào?",
    follow_up_en: "Ask next: How is work going?",
  },
  {
    id: "pa_a2_final_polite_problem",
    topic: "polite_problem_descriptions",
    type: "checkpoint",
    title_vi: "Nói vấn đề lịch sự",
    title_en: "Polite problem phrase",
    prompt_vi: "Làm câu mềm hơn: ਮੈਨੂੰ ਸਮੱਸਿਆ ਹੈ।",
    prompt_en: "Make this softer: ਮੈਨੂੰ ਸਮੱਸਿਆ ਹੈ।",
    answer: { pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਇੱਕ ਛੋਟੀ ਸਮੱਸਿਆ ਹੈ।", romanization: "maaf karna, mainu ikk chhoti samassia hai.", vi: "Xin lỗi, tôi có một vấn đề nhỏ.", en: "Sorry, I have a small problem." },
    explanation_vi: "ਮਾਫ਼ ਕਰਨਾ và ਛੋਟੀ làm câu nhẹ hơn.",
    explanation_en: "ਮਾਫ਼ ਕਰਨਾ and ਛੋਟੀ soften the sentence.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được ở clinic, school office, service counter, landlord message.",
    canada_practical_en: "Useful at clinics, school offices, service counters, and in landlord messages.",
    common_trap_vi: "Đừng bắt đầu bằng mệnh lệnh khi cần giúp.",
    common_trap_en: "Do not start with a command when asking for help.",
    follow_up_vi: "Thêm câu: Bạn có thể giúp không?",
    follow_up_en: "Add: Can you help?",
  },
  {
    id: "pa_a2_final_repair_repeat",
    topic: "interaction_repair",
    type: "qa",
    title_vi: "Xin nhắc lại",
    title_en: "Ask for repetition",
    prompt_vi: "Nói lịch sự: Bạn có thể nói lại không?",
    prompt_en: "Say politely: Can you say that again?",
    answer: { pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusi dubara keh sakde ho?", vi: "Xin lỗi, bạn có thể nói lại không?", en: "Sorry, can you say that again?" },
    explanation_vi: "ਤੁਸੀਂ và ਸਕਦੇ ਹੋ tạo câu hỏi lịch sự.",
    explanation_en: "ਤੁਸੀਂ and ਸਕਦੇ ਹੋ create a polite question.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    common_trap_vi: "Đừng chỉ nói ਕੀ? với người lạ.",
    common_trap_en: "Do not only say ਕੀ? to a stranger.",
    follow_up_vi: "Thêm: Tôi đang học Punjabi.",
    follow_up_en: "Add: I am learning Punjabi.",
  },
  {
    id: "pa_a2_final_repair_slow_meaning",
    topic: "interaction_repair",
    type: "qa",
    title_vi: "Nói chậm và hỏi nghĩa",
    title_en: "Slow down and ask meaning",
    prompt_vi: "Bạn không hiểu một từ. Hỏi nghĩa của nó.",
    prompt_en: "You do not understand a word. Ask what it means.",
    answer: { pa: "ਇਸਦਾ ਕੀ ਮਤਲਬ ਹੈ?", romanization: "isda ki matlab hai?", vi: "Cái này nghĩa là gì?", en: "What does this mean?" },
    explanation_vi: "ਮਤਲਬ = nghĩa/ý. Đây là repair phrase rất hữu ích.",
    explanation_en: "ਮਤਲਬ = meaning/point. This is a very useful repair phrase.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    common_trap_vi: "Khi chưa hiểu, hỏi lại thay vì đoán.",
    common_trap_en: "When you do not understand, ask instead of guessing.",
    follow_up_vi: "Xin người kia nói chậm hơn.",
    follow_up_en: "Ask the person to speak more slowly.",
  },
];
