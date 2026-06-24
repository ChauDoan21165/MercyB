// src/languages/punjabi/capstoneReviewA2.ts
//
// Punjabi A2 capstone review for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred.

export type PunjabiCapstoneA2Skill =
  | "daily_actions"
  | "past_future_basics"
  | "appointments"
  | "errands"
  | "housing"
  | "school"
  | "childcare"
  | "transport"
  | "workplace_small_talk"
  | "polite_problem_descriptions";

export type PunjabiCapstoneA2CheckpointType =
  | "translate"
  | "choose_form"
  | "repair"
  | "reading_check"
  | "roleplay_prompt";

export type PunjabiCapstoneA2Example = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
  explanation_vi: string;
  explanation_en: string;
};

export type PunjabiCapstoneA2Checkpoint = {
  type: PunjabiCapstoneA2CheckpointType;
  prompt_vi: string;
  prompt_en: string;
  answer_pa: string;
  answer_romanization: string;
  answer_vi: string;
  answer_en: string;
};

export type PunjabiCapstoneA2Trap = {
  trap_vi: string;
  trap_en: string;
  better_pa: string;
  better_romanization: string;
};

export type PunjabiCapstoneA2Section = {
  id: string;
  skill: PunjabiCapstoneA2Skill;
  title_vi: string;
  title_en: string;
  goal_vi: string;
  goal_en: string;
  review_note_vi: string;
  review_note_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  examples: PunjabiCapstoneA2Example[];
  traps: PunjabiCapstoneA2Trap[];
  checkpoints: PunjabiCapstoneA2Checkpoint[];
};

const scriptAwarenessVi = "Gurmukhi là chữ chính trong phần ôn tập; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn = "Gurmukhi is the main script in this review; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const capstoneReviewA2: PunjabiCapstoneA2Section[] = [
  {
    id: "pa_a2_capstone_daily_actions",
    skill: "daily_actions",
    title_vi: "Sinh hoạt hằng ngày",
    title_en: "Daily actions",
    goal_vi: "Nói thói quen sáng/tối với động từ ở cuối câu.",
    goal_en: "Talk about morning/evening habits with the verb at the end.",
    review_note_vi: "Thói quen dùng gốc động từ + ਦਾ/ਦੀ/ਦੇ + ਹਾਂ/ਹੈ/ਹਨ. Người nói nữ thường dùng -ਦੀ cho bản thân.",
    review_note_en: "Habits use verb stem + ਦਾ/ਦੀ/ਦੇ + ਹਾਂ/ਹੈ/ਹਨ. A female speaker usually uses -ਦੀ for herself.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    examples: [
      { pa: "ਮੈਂ ਸਵੇਰੇ ਚਾਹ ਪੀਂਦੀ ਹਾਂ।", romanization: "main savere chah peendi haan.", vi: "Tôi uống trà buổi sáng. (nữ)", en: "I drink tea in the morning. (female speaker)", explanation_vi: "ਪੀਂਦੀ agrees với người nói nữ.", explanation_en: "ਪੀਂਦੀ agrees with a female speaker." },
      { pa: "ਅਸੀਂ ਰਾਤ ਨੂੰ ਖਾਣਾ ਖਾਂਦੇ ਹਾਂ।", romanization: "asin raat nu khana khande haan.", vi: "Chúng tôi ăn tối vào buổi tối.", en: "We eat at night.", explanation_vi: "ਖਾਂਦੇ dùng với ਅਸੀਂ.", explanation_en: "ਖਾਂਦੇ is used with ਅਸੀਂ." },
    ],
    traps: [
      { trap_vi: "Đừng dùng dạng nam cho mọi người nói.", trap_en: "Do not use the masculine form for every speaker.", better_pa: "ਮੈਂ ਕੰਮ ਤੇ ਜਾਂਦੀ ਹਾਂ।", better_romanization: "main kamm te jandi haan." },
    ],
    checkpoints: [
      { type: "translate", prompt_vi: "Nói: Tôi đi làm buổi sáng. (nam)", prompt_en: "Say: I go to work in the morning. (male speaker)", answer_pa: "ਮੈਂ ਸਵੇਰੇ ਕੰਮ ਤੇ ਜਾਂਦਾ ਹਾਂ।", answer_romanization: "main savere kamm te janda haan.", answer_vi: "Tôi đi làm buổi sáng.", answer_en: "I go to work in the morning." },
      { type: "choose_form", prompt_vi: "Chọn cho người nói nữ: ਜਾਂਦਾ / ਜਾਂਦੀ", prompt_en: "Choose for a female speaker: ਜਾਂਦਾ / ਜਾਂਦੀ", answer_pa: "ਜਾਂਦੀ", answer_romanization: "jandi", answer_vi: "Dùng ਜਾਂਦੀ.", answer_en: "Use ਜਾਂਦੀ." },
    ],
  },
  {
    id: "pa_a2_capstone_past_future",
    skill: "past_future_basics",
    title_vi: "Quá khứ và tương lai cơ bản",
    title_en: "Past and future basics",
    goal_vi: "Kể việc đã làm và nói kế hoạch gần.",
    goal_en: "Report completed actions and talk about near-future plans.",
    review_note_vi: "Quá khứ cần chú ý agreement; tương lai dùng -ਗਾ/-ਗੀ/-ਗੇ theo người nói/chủ ngữ.",
    review_note_en: "Past forms need agreement attention; future uses -ਗਾ/-ਗੀ/-ਗੇ according to speaker/subject.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    examples: [
      { pa: "ਕੱਲ੍ਹ ਮੈਂ ਕੰਮ ਕੀਤਾ।", romanization: "kal main kamm kita.", vi: "Hôm qua tôi đã làm việc.", en: "Yesterday I worked.", explanation_vi: "ਕੀਤਾ là quá khứ của ਕਰਨਾ.", explanation_en: "ਕੀਤਾ is the past of ਕਰਨਾ." },
      { pa: "ਮੈਂ ਕੱਲ੍ਹ ਆਵਾਂਗੀ।", romanization: "main kal aavangi.", vi: "Ngày mai tôi sẽ đến. (nữ)", en: "I will come tomorrow. (female speaker)", explanation_vi: "ਆਵਾਂਗੀ cho người nói nữ.", explanation_en: "ਆਵਾਂਗੀ is for a female speaker." },
    ],
    traps: [
      { trap_vi: "ਕੱਲ੍ਹ có thể là hôm qua hoặc ngày mai; ngữ cảnh động từ quyết định.", trap_en: "ਕੱਲ੍ਹ can mean yesterday or tomorrow; the verb context decides.", better_pa: "ਮੈਂ ਕੱਲ੍ਹ ਆਵਾਂਗਾ।", better_romanization: "main kal aavanga." },
    ],
    checkpoints: [
      { type: "translate", prompt_vi: "Nói: Tôi sẽ gọi buổi tối. (nam)", prompt_en: "Say: I will call in the evening. (male speaker)", answer_pa: "ਮੈਂ ਸ਼ਾਮ ਨੂੰ ਫ਼ੋਨ ਕਰਾਂਗਾ।", answer_romanization: "main shaam nu phone karanga.", answer_vi: "Tôi sẽ gọi buổi tối.", answer_en: "I will call in the evening." },
      { type: "repair", prompt_vi: "Sửa cho người nói nữ: ਮੈਂ ਆਵਾਂਗਾ।", prompt_en: "Fix for a female speaker: ਮੈਂ ਆਵਾਂਗਾ।", answer_pa: "ਮੈਂ ਆਵਾਂਗੀ।", answer_romanization: "main aavangi.", answer_vi: "Tôi sẽ đến. (nữ)", answer_en: "I will come. (female speaker)" },
    ],
  },
  {
    id: "pa_a2_capstone_appointments",
    skill: "appointments",
    title_vi: "Lịch hẹn",
    title_en: "Appointments",
    goal_vi: "Xác nhận giờ hẹn và xin đổi lịch.",
    goal_en: "Confirm appointment times and ask to reschedule.",
    review_note_vi: "Dùng ਸਮਾਂ, ਅਪਾਇੰਟਮੈਂਟ, ਵਜੇ, ਅਤੇ ਨੂੰ cho ngày. Câu hỏi lịch sự dùng ਸਕਦਾ/ਸਕਦੀ/ਸਕਦੇ.",
    review_note_en: "Use ਸਮਾਂ, ਅਪਾਇੰਟਮੈਂਟ, ਵਜੇ, and ਨੂੰ for days. Polite questions use ਸਕਦਾ/ਸਕਦੀ/ਸਕਦੇ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Clinic, dentist, family doctor thường dùng loanword ਅਪਾਇੰਟਮੈਂਟ.",
    canada_practical_en: "Clinic, dentist, and family doctor contexts often use the loanword ਅਪਾਇੰਟਮੈਂਟ.",
    examples: [
      { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਦੋ ਵਜੇ ਹੈ।", romanization: "meri appointment do vaje hai.", vi: "Lịch hẹn của tôi lúc hai giờ.", en: "My appointment is at two.", explanation_vi: "ਮੇਰੀ agrees với ਅਪਾਇੰਟਮੈਂਟ.", explanation_en: "ਮੇਰੀ agrees with ਅਪਾਇੰਟਮੈਂਟ." },
      { pa: "ਕੀ ਮੈਂ ਸਮਾਂ ਬਦਲ ਸਕਦੀ ਹਾਂ?", romanization: "ki main sama badal sakdi haan?", vi: "Tôi có thể đổi giờ không? (nữ)", en: "Can I change the time? (female speaker)", explanation_vi: "ਸਕਦੀ cho người nói nữ.", explanation_en: "ਸਕਦੀ for a female speaker." },
    ],
    traps: [
      { trap_vi: "Đừng nói chỉ ਦੋ cho giờ hẹn; thêm ਵਜੇ.", trap_en: "Do not say only ਦੋ for appointment time; add ਵਜੇ.", better_pa: "ਦੋ ਵਜੇ", better_romanization: "do vaje" },
    ],
    checkpoints: [
      { type: "translate", prompt_vi: "Nói: Lịch hẹn của tôi là thứ Sáu.", prompt_en: "Say: My appointment is on Friday.", answer_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ ਹੈ।", answer_romanization: "meri appointment shukkarvaar nu hai.", answer_vi: "Lịch hẹn của tôi vào thứ Sáu.", answer_en: "My appointment is on Friday." },
      { type: "roleplay_prompt", prompt_vi: "Bạn muốn đổi lịch sang thứ Hai lúc mười giờ.", prompt_en: "You want to move the appointment to Monday at ten.", answer_pa: "ਕੀ ਸੋਮਵਾਰ ਦਸ ਵਜੇ ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ?", answer_romanization: "ki somvaar das vaje sama mil sakda hai?", answer_vi: "Thứ Hai lúc mười giờ có giờ trống không?", answer_en: "Is a time available Monday at ten?" },
    ],
  },
  {
    id: "pa_a2_capstone_errands",
    skill: "errands",
    title_vi: "Việc vặt và mua đồ",
    title_en: "Errands and shopping",
    goal_vi: "Nói cần gì, hỏi giá, và giữ câu lịch sự.",
    goal_en: "Say what you need, ask price, and keep the exchange polite.",
    review_note_vi: "ਮੈਨੂੰ ... ਚਾਹੀਦਾ/ਚਾਹੀਦੀ/ਚਾਹੀਦੇ ਹਨ agrees với vật cần, không với người nói.",
    review_note_en: "ਮੈਨੂੰ ... ਚਾਹੀਦਾ/ਚਾਹੀਦੀ/ਚਾਹੀਦੇ ਹਨ agrees with the needed item, not the speaker.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Pharmacy/grocery contexts may mix words like ਰਸੀਦ, ਬੈਗ, ਡੈਬਿਟ.",
    canada_practical_en: "Pharmacy/grocery contexts may mix words like ਰਸੀਦ, ਬੈਗ, ਡੈਬਿਟ.",
    examples: [
      { pa: "ਮੈਨੂੰ ਰਸੀਦ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu raseed chahidi hai.", vi: "Tôi cần hóa đơn.", en: "I need a receipt.", explanation_vi: "ਚਾਹੀਦੀ agrees với ਰਸੀਦ giống cái.", explanation_en: "ਚਾਹੀਦੀ agrees with feminine ਰਸੀਦ." },
      { pa: "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?", romanization: "eh kinne da hai?", vi: "Cái này bao nhiêu tiền?", en: "How much is this?", explanation_vi: "Câu giá đơn giản A2.", explanation_en: "A simple A2 price question." },
    ],
    traps: [
      { trap_vi: "ਚਾਹੀਦਾ không đổi theo người nói.", trap_en: "ਚਾਹੀਦਾ does not change by speaker.", better_pa: "ਮੈਨੂੰ ਦਵਾਈ ਚਾਹੀਦੀ ਹੈ।", better_romanization: "mainu davai chahidi hai." },
    ],
    checkpoints: [
      { type: "choose_form", prompt_vi: "Chọn: ਦੋ ਬੈਗ ਚਾਹੀਦਾ / ਚਾਹੀਦੇ ਹਨ", prompt_en: "Choose: ਦੋ ਬੈਗ ਚਾਹੀਦਾ / ਚਾਹੀਦੇ ਹਨ", answer_pa: "ਦੋ ਬੈਗ ਚਾਹੀਦੇ ਹਨ।", answer_romanization: "do bag chahide han.", answer_vi: "Hai túi cần dạng số nhiều.", answer_en: "Two bags need the plural form." },
      { type: "translate", prompt_vi: "Nói: Tôi cần thuốc ho.", prompt_en: "Say: I need cough medicine.", answer_pa: "ਮੈਨੂੰ ਖਾਂਸੀ ਦੀ ਦਵਾਈ ਚਾਹੀਦੀ ਹੈ।", answer_romanization: "mainu khansi di davai chahidi hai.", answer_vi: "Tôi cần thuốc ho.", answer_en: "I need cough medicine." },
    ],
  },
  {
    id: "pa_a2_capstone_housing",
    skill: "housing",
    title_vi: "Nhà ở và sửa chữa",
    title_en: "Housing and repairs",
    goal_vi: "Báo vấn đề trong nhà bằng câu trung tính, lịch sự.",
    goal_en: "Report a household issue in a neutral, polite way.",
    review_note_vi: "Dùng ਵਿੱਚ cho vị trí và ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ / ਲੀਕ ਹੋ ਰਿਹਾ để mô tả vấn đề.",
    review_note_en: "Use ਵਿੱਚ for location and ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ / ਲੀਕ ਹੋ ਰਿਹਾ to describe problems.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Heater, leak, basement, landlord là từ mượn dễ gặp trong Punjabi Canada.",
    canada_practical_en: "Heater, leak, basement, and landlord are common loanwords in Canadian Punjabi.",
    examples: [
      { pa: "ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "heater kamm nahi kar riha.", vi: "Máy sưởi không hoạt động.", en: "The heater is not working.", explanation_vi: "ਕੰਮ ਕਰਨਾ = hoạt động.", explanation_en: "ਕੰਮ ਕਰਨਾ = work/function." },
      { pa: "ਰਸੋਈ ਵਿੱਚ ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "rasoi vich paani leak ho riha hai.", vi: "Nước đang rò trong bếp.", en: "Water is leaking in the kitchen.", explanation_vi: "ਵਿੱਚ đánh dấu vị trí.", explanation_en: "ਵਿੱਚ marks location." },
    ],
    traps: [
      { trap_vi: "Mở đầu bằng ਮਾਫ਼ ਕਰਨਾ giúp câu báo lỗi mềm hơn.", trap_en: "Starting with ਮਾਫ਼ ਕਰਨਾ softens a repair report.", better_pa: "ਮਾਫ਼ ਕਰਨਾ, ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", better_romanization: "maaf karna, heater kamm nahi kar riha." },
    ],
    checkpoints: [
      { type: "translate", prompt_vi: "Nói: Trong phòng tắm không có nước.", prompt_en: "Say: Water is not coming in the bathroom.", answer_pa: "ਬਾਥਰੂਮ ਵਿੱਚ ਪਾਣੀ ਨਹੀਂ ਆ ਰਿਹਾ।", answer_romanization: "bathroom vich paani nahi aa riha.", answer_vi: "Trong phòng tắm không có nước.", answer_en: "Water is not coming in the bathroom." },
      { type: "repair", prompt_vi: "Làm câu mềm hơn: ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", prompt_en: "Make this softer: ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", answer_pa: "ਮਾਫ਼ ਕਰਨਾ, ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", answer_romanization: "maaf karna, heater kamm nahi kar riha.", answer_vi: "Xin lỗi, máy sưởi không hoạt động.", answer_en: "Sorry, the heater is not working." },
    ],
  },
  {
    id: "pa_a2_capstone_school",
    skill: "school",
    title_vi: "Trường học",
    title_en: "School",
    goal_vi: "Hỏi hạn bài, báo vắng, xác nhận phòng học.",
    goal_en: "Ask deadlines, report absence, and confirm classrooms.",
    review_note_vi: "ਕਦੋਂ, ਕਿਹੜੇ, ਕਿੱਥੇ giúp hỏi thông tin. ਮੇਰਾ/ਮੇਰੀ agrees với danh từ sau.",
    review_note_en: "ਕਦੋਂ, ਕਿਹੜੇ, ਕਿੱਥੇ ask information. ਮੇਰਾ/ਮੇਰੀ agrees with the following noun.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được với school office, adult class, parent-teacher note.",
    canada_practical_en: "Useful with school offices, adult classes, and parent-teacher notes.",
    examples: [
      { pa: "ਹੋਮਵਰਕ ਕਦੋਂ ਦੇਣਾ ਹੈ?", romanization: "homework kadon dena hai?", vi: "Khi nào phải nộp bài tập?", en: "When is the homework due?", explanation_vi: "ਦੇਣਾ ở đây là nộp.", explanation_en: "ਦੇਣਾ here means submit." },
      { pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "mera bachcha ajj school nahi aa sakda.", vi: "Con tôi hôm nay không thể đến trường.", en: "My child cannot come to school today.", explanation_vi: "ਸਕਦਾ agrees với ਬੱਚਾ.", explanation_en: "ਸਕਦਾ agrees with ਬੱਚਾ." },
    ],
    traps: [
      { trap_vi: "ਮੇਰੀ ਕਲਾਸ nhưng ਮੇਰਾ ਬੱਚਾ: sở hữu agrees với danh từ.", trap_en: "ਮੇਰੀ ਕਲਾਸ but ਮੇਰਾ ਬੱਚਾ: possessive agrees with the noun.", better_pa: "ਮੇਰੀ ਕਲਾਸ ਨੌਂ ਵਜੇ ਹੈ।", better_romanization: "meri class naun vaje hai." },
    ],
    checkpoints: [
      { type: "reading_check", prompt_vi: "Trong 'ਕਲਾਸ ਕਿਹੜੇ ਕਮਰੇ ਵਿੱਚ ਹੈ?' người viết hỏi gì?", prompt_en: "In 'ਕਲਾਸ ਕਿਹੜੇ ਕਮਰੇ ਵਿੱਚ ਹੈ?' what is being asked?", answer_pa: "ਕਲਾਸ ਕਿਹੜੇ ਕਮਰੇ ਵਿੱਚ ਹੈ?", answer_romanization: "class kihre kamre vich hai?", answer_vi: "Lớp ở phòng nào.", answer_en: "Which room the class is in." },
      { type: "translate", prompt_vi: "Nói: Lớp của tôi lúc chín giờ.", prompt_en: "Say: My class is at nine.", answer_pa: "ਮੇਰੀ ਕਲਾਸ ਨੌਂ ਵਜੇ ਹੈ।", answer_romanization: "meri class naun vaje hai.", answer_vi: "Lớp của tôi lúc chín giờ.", answer_en: "My class is at nine." },
    ],
  },
  {
    id: "pa_a2_capstone_childcare",
    skill: "childcare",
    title_vi: "Childcare và đón trẻ",
    title_en: "Childcare and pickup",
    goal_vi: "Nói giờ đón, hỏi trẻ đã ăn chưa, và báo sức khỏe cơ bản.",
    goal_en: "Say pickup time, ask whether the child ate, and report basic health.",
    review_note_vi: "ਲੈਣ ਆਉਣਾ = đến đón. Tình trạng sức khỏe dùng ਉਸਨੂੰ ... ਹੈ.",
    review_note_en: "ਲੈਣ ਆਉਣਾ = come to pick up. Health conditions use ਉਸਨੂੰ ... ਹੈ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Daycare/pickup/lunch box thường được mượn âm trong Punjabi Canada.",
    canada_practical_en: "Daycare/pickup/lunch box are often borrowed in Canadian Punjabi.",
    examples: [
      { pa: "ਮੈਂ ਬੱਚੇ ਨੂੰ ਤਿੰਨ ਵਜੇ ਲੈਣ ਆਵਾਂਗੀ।", romanization: "main bachche nu tinn vaje lain aavangi.", vi: "Tôi sẽ đến đón trẻ lúc ba giờ. (nữ)", en: "I will come to pick up the child at three. (female speaker)", explanation_vi: "ਬੱਚੇ ਨੂੰ là người được đón.", explanation_en: "ਬੱਚੇ ਨੂੰ marks the child being picked up." },
      { pa: "ਉਸਨੂੰ ਥੋੜ੍ਹਾ ਬੁਖਾਰ ਹੈ।", romanization: "usnu thoda bukhar hai.", vi: "Bé hơi sốt.", en: "The child has a slight fever.", explanation_vi: "Sức khỏe dùng ਉਸਨੂੰ, không ਉਹ.", explanation_en: "Health uses ਉਸਨੂੰ, not ਉਹ." },
    ],
    traps: [
      { trap_vi: "Không nói ਉਹ ਬੁਖਾਰ ਹੈ.", trap_en: "Do not say ਉਹ ਬੁਖਾਰ ਹੈ.", better_pa: "ਉਸਨੂੰ ਬੁਖਾਰ ਹੈ।", better_romanization: "usnu bukhar hai." },
    ],
    checkpoints: [
      { type: "translate", prompt_vi: "Nói: Tôi sẽ đến đón lúc năm giờ. (nam)", prompt_en: "Say: I will come to pick up at five. (male speaker)", answer_pa: "ਮੈਂ ਪੰਜ ਵਜੇ ਲੈਣ ਆਵਾਂਗਾ।", answer_romanization: "main panj vaje lain aavanga.", answer_vi: "Tôi sẽ đến đón lúc năm giờ.", answer_en: "I will come to pick up at five." },
      { type: "choose_form", prompt_vi: "Chọn đúng: ਉਹ ਬੁਖਾਰ ਹੈ / ਉਸਨੂੰ ਬੁਖਾਰ ਹੈ", prompt_en: "Choose correctly: ਉਹ ਬੁਖਾਰ ਹੈ / ਉਸਨੂੰ ਬੁਖਾਰ ਹੈ", answer_pa: "ਉਸਨੂੰ ਬੁਖਾਰ ਹੈ।", answer_romanization: "usnu bukhar hai.", answer_vi: "Dùng ਉਸਨੂੰ cho tình trạng sức khỏe.", answer_en: "Use ਉਸਨੂੰ for health conditions." },
    ],
  },
  {
    id: "pa_a2_capstone_transport",
    skill: "transport",
    title_vi: "Giao thông và trễ chuyến",
    title_en: "Transport and delays",
    goal_vi: "Hỏi tuyến, điểm xuống, và báo đến muộn.",
    goal_en: "Ask routes, where to get off, and say you will be late.",
    review_note_vi: "ਬੱਸ/ਟ੍ਰੇਨ thường dùng agreement giống cái trong các mẫu này: ਜਾਂਦੀ, ਆ ਰਹੀ, ਆਵੇਗੀ.",
    review_note_en: "ਬੱਸ/ਟ੍ਰੇਨ often take feminine agreement in these patterns: ਜਾਂਦੀ, ਆ ਰਹੀ, ਆਵੇਗੀ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Có thể dùng với TTC, SkyTrain, GO Train, bus stop.",
    canada_practical_en: "Can be used with TTC, SkyTrain, GO Train, and bus stops.",
    examples: [
      { pa: "ਇਹ ਬੱਸ ਕਿੱਥੇ ਜਾਂਦੀ ਹੈ?", romanization: "eh bass kitthe jandi hai?", vi: "Xe buýt này đi đâu?", en: "Where does this bus go?", explanation_vi: "ਜਾਂਦੀ agrees với ਬੱਸ.", explanation_en: "ਜਾਂਦੀ agrees with ਬੱਸ." },
      { pa: "ਮੈਂ ਦਸ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵਾਂਗਾ।", romanization: "main das mint der naal aavanga.", vi: "Tôi sẽ đến muộn mười phút. (nam)", en: "I will be ten minutes late. (male speaker)", explanation_vi: "ਦੇਰ ਨਾਲ = muộn.", explanation_en: "ਦੇਰ ਨਾਲ = late." },
    ],
    traps: [
      { trap_vi: "Đừng dùng ਜਾਂਦਾ với ਬੱਸ nếu giữ agreement giống cái.", trap_en: "Do not use ਜਾਂਦਾ with ਬੱਸ when keeping feminine agreement.", better_pa: "ਬੱਸ ਜਾਂਦੀ ਹੈ।", better_romanization: "bass jandi hai." },
    ],
    checkpoints: [
      { type: "translate", prompt_vi: "Nói: Xe buýt đang đến muộn.", prompt_en: "Say: The bus is coming late.", answer_pa: "ਬੱਸ ਦੇਰ ਨਾਲ ਆ ਰਹੀ ਹੈ।", answer_romanization: "bass der naal aa rahi hai.", answer_vi: "Xe buýt đang đến muộn.", answer_en: "The bus is coming late." },
      { type: "translate", prompt_vi: "Nói: Tôi phải xuống ở đâu?", prompt_en: "Say: Where should I get off?", answer_pa: "ਮੈਨੂੰ ਕਿੱਥੇ ਉਤਰਨਾ ਹੈ?", answer_romanization: "mainu kitthe utarna hai?", answer_vi: "Tôi phải xuống ở đâu?", answer_en: "Where should I get off?" },
    ],
  },
  {
    id: "pa_a2_capstone_workplace_small_talk",
    skill: "workplace_small_talk",
    title_vi: "Small talk nơi làm việc",
    title_en: "Workplace small talk",
    goal_vi: "Mở đầu nhẹ nhàng và hỏi về công việc không quá thân mật.",
    goal_en: "Open gently and ask about work without being too intimate.",
    review_note_vi: "Với đồng nghiệp chưa thân, dùng ਤੁਹਾਡਾ/ਤੁਸੀਂ thay vì ਤੇਰਾ/ਤੂੰ.",
    review_note_en: "With coworkers you do not know well, use ਤੁਹਾਡਾ/ਤੁਸੀਂ instead of ਤੇਰਾ/ਤੂੰ.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Weather/weekend small talk là lựa chọn an toàn trong workplace Canada.",
    canada_practical_en: "Weather/weekend small talk is a safe choice in Canadian workplaces.",
    examples: [
      { pa: "ਤੁਹਾਡਾ ਵੀਕਐਂਡ ਕਿਵੇਂ ਸੀ?", romanization: "tuhada weekend kiven si?", vi: "Cuối tuần của bạn thế nào?", en: "How was your weekend?", explanation_vi: "ਤੁਹਾਡਾ lịch sự hơn ਤੇਰਾ.", explanation_en: "ਤੁਹਾਡਾ is more polite than ਤੇਰਾ." },
      { pa: "ਕੰਮ ਕਿਵੇਂ ਚੱਲ ਰਿਹਾ ਹੈ?", romanization: "kamm kiven chall riha hai?", vi: "Công việc đang thế nào?", en: "How is work going?", explanation_vi: "ਚੱਲ ਰਿਹਾ = đang diễn tiến.", explanation_en: "ਚੱਲ ਰਿਹਾ = going/progressing." },
    ],
    traps: [
      { trap_vi: "ਤੂੰ/ਤੇਰਾ có thể quá thân mật ở workplace.", trap_en: "ਤੂੰ/ਤੇਰਾ can be too intimate at work.", better_pa: "ਤੁਹਾਡਾ ਦਿਨ ਕਿਵੇਂ ਹੈ?", better_romanization: "tuhada din kiven hai?" },
    ],
    checkpoints: [
      { type: "choose_form", prompt_vi: "Chọn lịch sự hơn: ਤੇਰਾ ਵੀਕਐਂਡ / ਤੁਹਾਡਾ ਵੀਕਐਂਡ", prompt_en: "Choose the more polite option: ਤੇਰਾ ਵੀਕਐਂਡ / ਤੁਹਾਡਾ ਵੀਕਐਂਡ", answer_pa: "ਤੁਹਾਡਾ ਵੀਕਐਂਡ", answer_romanization: "tuhada weekend", answer_vi: "Dùng ਤੁਹਾਡਾ với đồng nghiệp chưa thân.", answer_en: "Use ਤੁਹਾਡਾ with coworkers you do not know well." },
      { type: "translate", prompt_vi: "Nói: Hôm nay thời tiết đẹp.", prompt_en: "Say: The weather is nice today.", answer_pa: "ਅੱਜ ਮੌਸਮ ਚੰਗਾ ਹੈ।", answer_romanization: "ajj mausam changa hai.", answer_vi: "Hôm nay thời tiết đẹp.", answer_en: "The weather is nice today." },
    ],
  },
  {
    id: "pa_a2_capstone_polite_problem",
    skill: "polite_problem_descriptions",
    title_vi: "Mô tả vấn đề lịch sự",
    title_en: "Polite problem descriptions",
    goal_vi: "Báo vấn đề, xin giúp, và yêu cầu nhắc lại mà không thô.",
    goal_en: "Report a problem, ask for help, and request repetition without sounding abrupt.",
    review_note_vi: "Dùng ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ..., ਕੀ ਤੁਸੀਂ... ਸਕਦੇ ਹੋ? để giữ giọng lịch sự.",
    review_note_en: "Use ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ..., ਕੀ ਤੁਸੀਂ... ਸਕਦੇ ਹੋ? to keep the tone polite.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Rất hữu ích ở quầy dịch vụ, clinic, school office, landlord message.",
    canada_practical_en: "Useful at service counters, clinics, school offices, and in landlord messages.",
    examples: [
      { pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਇੱਕ ਸਮੱਸਿਆ ਹੈ।", romanization: "maaf karna, mainu ikk samassia hai.", vi: "Xin lỗi, tôi có một vấn đề.", en: "Sorry, I have a problem.", explanation_vi: "Cách mở đầu mềm.", explanation_en: "A soft opener." },
      { pa: "ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "ki tusi dubara keh sakde ho?", vi: "Bạn có thể nói lại không?", en: "Can you say that again?", explanation_vi: "ਤੁਸੀਂ + ਸਕਦੇ ਹੋ lịch sự.", explanation_en: "ਤੁਸੀਂ + ਸਕਦੇ ਹੋ is polite." },
    ],
    traps: [
      { trap_vi: "Đừng chỉ nói ਕੀ? khi không nghe rõ người lạ.", trap_en: "Do not just say ਕੀ? when you did not hear a stranger.", better_pa: "ਮਾਫ਼ ਕਰਨਾ, ਦੁਬਾਰਾ ਕਹੋ ਜੀ।", better_romanization: "maaf karna, dubara kaho ji." },
    ],
    checkpoints: [
      { type: "repair", prompt_vi: "Làm lịch sự hơn: ਦੁਬਾਰਾ ਕਹੋ.", prompt_en: "Make this more polite: ਦੁਬਾਰਾ ਕਹੋ.", answer_pa: "ਮਾਫ਼ ਕਰਨਾ, ਦੁਬਾਰਾ ਕਹੋ ਜੀ।", answer_romanization: "maaf karna, dubara kaho ji.", answer_vi: "Xin lỗi, vui lòng nói lại.", answer_en: "Sorry, please say it again." },
      { type: "roleplay_prompt", prompt_vi: "Ở quầy dịch vụ, bạn không hiểu hướng dẫn.", prompt_en: "At a service counter, you do not understand the instruction.", answer_pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਇਹ ਹਦਾਇਤ ਸਮਝ ਨਹੀਂ ਆਈ।", answer_romanization: "maaf karna, mainu eh hidayat samajh nahi aai.", answer_vi: "Xin lỗi, tôi chưa hiểu hướng dẫn này.", answer_en: "Sorry, I did not understand this instruction." },
    ],
  },
];
