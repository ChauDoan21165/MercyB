// src/languages/punjabi/dailyLifeA2.ts
//
// Punjabi A2 daily-life pack for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical learner aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred.

export type PunjabiDailyLifeA2Topic =
  | "errands"
  | "home"
  | "meals"
  | "weather"
  | "appointments"
  | "simple_problems"
  | "schedule_changes"
  | "transport"
  | "school_family_routines";

export type PunjabiDailyLifeA2Line = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
  note_vi: string;
  note_en: string;
};

export type PunjabiDailyLifeA2Trap = {
  issue_vi: string;
  issue_en: string;
  better_pa: string;
  better_romanization: string;
};

export type PunjabiDailyLifeA2Item = {
  id: string;
  topic: PunjabiDailyLifeA2Topic;
  title_vi: string;
  title_en: string;
  use_case_vi: string;
  use_case_en: string;
  grammar_focus_vi: string;
  grammar_focus_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  lines: PunjabiDailyLifeA2Line[];
  traps: PunjabiDailyLifeA2Trap[];
  mini_task: {
    prompt_vi: string;
    prompt_en: string;
    model_pa: string;
    model_romanization: string;
  };
};

export const dailyLifeA2: PunjabiDailyLifeA2Item[] = [
  {
    id: "pa_a2_daily_errands_pharmacy",
    topic: "errands",
    title_vi: "Việc vặt: đi hiệu thuốc",
    title_en: "Errands: going to the pharmacy",
    use_case_vi: "Hỏi mua một món đơn giản và xác nhận giá.",
    use_case_en: "Ask for a simple item and confirm the price.",
    grammar_focus_vi: "ਮੈਨੂੰ ... ਚਾਹੀਦਾ/ਚਾਹੀਦੀ ਹੈ diễn tả 'tôi cần'. Đuôi agrees với vật cần.",
    grammar_focus_en: "ਮੈਨੂੰ ... ਚਾਹੀਦਾ/ਚਾਹੀਦੀ ਹੈ means 'I need'. The ending agrees with the needed item.",
    script_awareness_vi: "Gurmukhi là chữ chính trong bài; Shahmukhi chỉ được nhắc để nhận biết.",
    script_awareness_en: "Gurmukhi is the main script here; Shahmukhi is mentioned only for awareness.",
    canada_practical_vi: "Ở Canada, pharmacy có thể được nói là ਫਾਰਮੇਸੀ trong Punjabi đời thường.",
    canada_practical_en: "In Canada, pharmacy may appear as ਫਾਰਮੇਸੀ in everyday Punjabi.",
    lines: [
      { pa: "ਮੈਨੂੰ ਖਾਂਸੀ ਦੀ ਦਵਾਈ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu khansi di davai chahidi hai.", vi: "Tôi cần thuốc ho.", en: "I need cough medicine.", note_vi: "ਚਾਹੀਦੀ agrees với ਦਵਾਈ giống cái.", note_en: "ਚਾਹੀਦੀ agrees with feminine ਦਵਾਈ." },
      { pa: "ਇਹ ਕਿੰਨੇ ਦੀ ਹੈ?", romanization: "eh kinne di hai?", vi: "Cái này bao nhiêu tiền?", en: "How much is this?", note_vi: "ਦੀ dùng khi vật được hiểu là giống cái.", note_en: "ਦੀ is used when the item is understood as feminine." },
      { pa: "ਕੀ ਰਸੀਦ ਮਿਲ ਸਕਦੀ ਹੈ?", romanization: "ki raseed mil sakdi hai?", vi: "Có thể lấy hóa đơn không?", en: "Can I get a receipt?", note_vi: "ਮਿਲ ਸਕਦੀ ਹੈ là cách hỏi lịch sự.", note_en: "ਮਿਲ ਸਕਦੀ ਹੈ is a polite availability request." },
    ],
    traps: [
      { issue_vi: "Không dùng một dạng ਚਾਹੀਦਾ cho mọi danh từ.", issue_en: "Do not use one form of ਚਾਹੀਦਾ for every noun.", better_pa: "ਮੈਨੂੰ ਦਵਾਈ ਚਾਹੀਦੀ ਹੈ।", better_romanization: "mainu davai chahidi hai." },
    ],
    mini_task: { prompt_vi: "Nói: Tôi cần một hóa đơn.", prompt_en: "Say: I need a receipt.", model_pa: "ਮੈਨੂੰ ਰਸੀਦ ਚਾਹੀਦੀ ਹੈ।", model_romanization: "mainu raseed chahidi hai." },
  },
  {
    id: "pa_a2_daily_home_repair",
    topic: "home",
    title_vi: "Ở nhà: báo lỗi sửa chữa",
    title_en: "At home: reporting a repair",
    use_case_vi: "Mô tả vấn đề trong nhà với chủ nhà hoặc quản lý.",
    use_case_en: "Describe a household problem to a landlord or manager.",
    grammar_focus_vi: "ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ dùng cho máy móc/thiết bị không hoạt động.",
    grammar_focus_en: "ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ is used for machines/devices that are not working.",
    script_awareness_vi: "Ví dụ dùng Gurmukhi; Shahmukhi không được dạy thành khóa riêng.",
    script_awareness_en: "Examples use Gurmukhi; Shahmukhi is not taught as a separate course.",
    canada_practical_vi: "Heater, landlord, lease thường xuất hiện như từ mượn trong cộng đồng song ngữ.",
    canada_practical_en: "Heater, landlord, and lease often appear as loanwords in bilingual communities.",
    lines: [
      { pa: "ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "heater kamm nahi kar riha.", vi: "Máy sưởi không hoạt động.", en: "The heater is not working.", note_vi: "Câu trung tính, không đổ lỗi.", note_en: "A neutral sentence without blame." },
      { pa: "ਰਸੋਈ ਵਿੱਚ ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "rasoi vich paani leak ho riha hai.", vi: "Nước đang rò trong bếp.", en: "Water is leaking in the kitchen.", note_vi: "ਵਿੱਚ đánh dấu vị trí.", note_en: "ਵਿੱਚ marks location." },
      { pa: "ਕੀ ਤੁਸੀਂ ਅੱਜ ਦੇਖ ਸਕਦੇ ਹੋ?", romanization: "ki tusi ajj dekh sakde ho?", vi: "Hôm nay anh/chị có thể xem giúp không?", en: "Can you look at it today?", note_vi: "ਤੁਸੀਂ + ਸਕਦੇ ਹੋ tạo yêu cầu lịch sự.", note_en: "ਤੁਸੀਂ + ਸਕਦੇ ਹੋ makes a polite request." },
    ],
    traps: [
      { issue_vi: "Đừng mở đầu bằng mệnh lệnh mạnh với người lạ.", issue_en: "Do not open with a strong command to a stranger.", better_pa: "ਮਾਫ਼ ਕਰਨਾ, ਇੱਕ ਸਮੱਸਿਆ ਹੈ।", better_romanization: "maaf karna, ikk samassia hai." },
    ],
    mini_task: { prompt_vi: "Nói: Nước không đến trong phòng tắm.", prompt_en: "Say: Water is not coming in the bathroom.", model_pa: "ਬਾਥਰੂਮ ਵਿੱਚ ਪਾਣੀ ਨਹੀਂ ਆ ਰਿਹਾ।", model_romanization: "bathroom vich paani nahi aa riha." },
  },
  {
    id: "pa_a2_daily_meals_order",
    topic: "meals",
    title_vi: "Bữa ăn: gọi món đơn giản",
    title_en: "Meals: ordering simply",
    use_case_vi: "Gọi món, nói sở thích, và hỏi món có cay không.",
    use_case_en: "Order food, state preferences, and ask whether it is spicy.",
    grammar_focus_vi: "ਮੈਨੂੰ ... ਪਸੰਦ ਹੈ nói sở thích. ਘੱਟ/ਜ਼ਿਆਦਾ đứng trước tính từ hoặc danh từ mức độ.",
    grammar_focus_en: "ਮੈਨੂੰ ... ਪਸੰਦ ਹੈ expresses preference. ਘੱਟ/ਜ਼ਿਆਦਾ mark degree.",
    script_awareness_vi: "Gurmukhi là chữ làm việc; Shahmukhi chỉ là awareness.",
    script_awareness_en: "Gurmukhi is the working script; Shahmukhi is awareness only.",
    canada_practical_vi: "Ở nhà hàng Canada, mild/spicy có thể được hỏi xen kẽ với Punjabi.",
    canada_practical_en: "In Canadian restaurants, mild/spicy may be mixed with Punjabi.",
    lines: [
      { pa: "ਮੈਨੂੰ ਘੱਟ ਮਿਰਚ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu ghatt mirch chahidi hai.", vi: "Tôi muốn ít cay.", en: "I want less chili.", note_vi: "ਮਿਰਚ giống cái nên ਚਾਹੀਦੀ.", note_en: "ਮਿਰਚ is feminine, so ਚਾਹੀਦੀ." },
      { pa: "ਕੀ ਇਹ ਸ਼ਾਕਾਹਾਰੀ ਹੈ?", romanization: "ki eh shakahari hai?", vi: "Món này có chay không?", en: "Is this vegetarian?", note_vi: "ਕੀ mở câu hỏi có/không.", note_en: "ਕੀ opens a yes/no question." },
      { pa: "ਮੈਨੂੰ ਦਾਲ ਪਸੰਦ ਹੈ।", romanization: "mainu daal pasand hai.", vi: "Tôi thích dal.", en: "I like dal.", note_vi: "Sở thích dùng ਮੈਨੂੰ, không phải ਮੈਂ trong mẫu này.", note_en: "Preferences use ਮੈਨੂੰ, not ਮੈਂ, in this pattern." },
    ],
    traps: [
      { issue_vi: "Không nói ਮੈਂ ਦਾਲ ਪਸੰਦ ਹਾਂ.", issue_en: "Do not say ਮੈਂ ਦਾਲ ਪਸੰਦ ਹਾਂ.", better_pa: "ਮੈਨੂੰ ਦਾਲ ਪਸੰਦ ਹੈ।", better_romanization: "mainu daal pasand hai." },
    ],
    mini_task: { prompt_vi: "Nói: Tôi muốn ít cay.", prompt_en: "Say: I want less chili.", model_pa: "ਮੈਨੂੰ ਘੱਟ ਮਿਰਚ ਚਾਹੀਦੀ ਹੈ।", model_romanization: "mainu ghatt mirch chahidi hai." },
  },
  {
    id: "pa_a2_daily_weather_plan",
    topic: "weather",
    title_vi: "Thời tiết và kế hoạch",
    title_en: "Weather and plans",
    use_case_vi: "Nói thời tiết ảnh hưởng đến việc đi lại/kế hoạch.",
    use_case_en: "Say how weather affects travel or plans.",
    grammar_focus_vi: "ਜੇ ... ਤਾਂ ... tạo câu điều kiện 'nếu... thì...'.",
    grammar_focus_en: "ਜੇ ... ਤਾਂ ... creates an if/then condition.",
    script_awareness_vi: "Bài đọc viết bằng Gurmukhi; Shahmukhi chỉ là awareness.",
    script_awareness_en: "The reading is in Gurmukhi; Shahmukhi is awareness only.",
    canada_practical_vi: "Snow/freezing rain có thể được nói bằng từ mượn trong Punjabi Canada.",
    canada_practical_en: "Snow/freezing rain may appear as loanwords in Canadian Punjabi.",
    lines: [
      { pa: "ਅੱਜ ਬਹੁਤ ਠੰਢ ਹੈ।", romanization: "ajj bahut thandh hai.", vi: "Hôm nay rất lạnh.", en: "It is very cold today.", note_vi: "ਠੰਢ là danh từ 'cái lạnh'.", note_en: "ਠੰਢ is the noun 'cold'." },
      { pa: "ਜੇ ਬਰਫ਼ ਪਈ, ਤਾਂ ਮੈਂ ਦੇਰ ਨਾਲ ਆਵਾਂਗਾ।", romanization: "je baraf pai, tan main der naal aavanga.", vi: "Nếu tuyết rơi, tôi sẽ đến muộn. (nam)", en: "If it snows, I will come late. (male speaker)", note_vi: "ਆਵਾਂਗਾ đổi theo người nói.", note_en: "ਆਵਾਂਗਾ changes with the speaker." },
      { pa: "ਛਤਰੀ ਲੈ ਆਓ।", romanization: "chhatri lai aao.", vi: "Hãy mang ô theo.", en: "Bring an umbrella.", note_vi: "Mệnh lệnh -ਓ lịch sự hơn thân mật.", note_en: "The -ਓ command is more polite than the intimate form." },
    ],
    traps: [
      { issue_vi: "Người nói nữ cần ਆਵਾਂਗੀ, không ਆਵਾਂਗਾ.", issue_en: "A female speaker needs ਆਵਾਂਗੀ, not ਆਵਾਂਗਾ.", better_pa: "ਮੈਂ ਦੇਰ ਨਾਲ ਆਵਾਂਗੀ।", better_romanization: "main der naal aavangi." },
    ],
    mini_task: { prompt_vi: "Nói: Hôm nay trời mưa.", prompt_en: "Say: It is raining today.", model_pa: "ਅੱਜ ਬਾਰਿਸ਼ ਹੋ ਰਹੀ ਹੈ।", model_romanization: "ajj barish ho rahi hai." },
  },
  {
    id: "pa_a2_daily_appointment_change",
    topic: "appointments",
    title_vi: "Đổi lịch hẹn",
    title_en: "Changing an appointment",
    use_case_vi: "Gọi để đổi giờ hẹn một cách lịch sự.",
    use_case_en: "Call to change an appointment politely.",
    grammar_focus_vi: "ਬਦਲਣੀ ਹੈ dùng với ਅਪਾਇੰਟਮੈਂਟ vì từ này thường được xử lý như giống cái.",
    grammar_focus_en: "ਬਦਲਣੀ ਹੈ is used with ਅਪਾਇੰਟਮੈਂਟ because it is often treated as feminine.",
    script_awareness_vi: "Gurmukhi chính; Shahmukhi chỉ là nhận biết.",
    script_awareness_en: "Gurmukhi is primary; Shahmukhi is only awareness.",
    canada_practical_vi: "ਅਪਾਇੰਟਮੈਂਟ, ਕਲਿਨਿਕ, ਫੈਮਲੀ ਡਾਕਟਰ là từ mượn dễ gặp ở Canada.",
    canada_practical_en: "ਅਪਾਇੰਟਮੈਂਟ, ਕਲਿਨਿਕ, and ਫੈਮਲੀ ਡਾਕਟਰ are common loanwords in Canada.",
    lines: [
      { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕੱਲ੍ਹ ਹੈ।", romanization: "meri appointment kal hai.", vi: "Lịch hẹn của tôi là ngày mai.", en: "My appointment is tomorrow.", note_vi: "ਮੇਰੀ agrees với ਅਪਾਇੰਟਮੈਂਟ.", note_en: "ਮੇਰੀ agrees with ਅਪਾਇੰਟਮੈਂਟ." },
      { pa: "ਮੈਂ ਸਮਾਂ ਬਦਲਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।", romanization: "main sama badalna chaunda haan.", vi: "Tôi muốn đổi giờ. (nam)", en: "I want to change the time. (male speaker)", note_vi: "ਚਾਹੁੰਦਾ đổi thành ਚਾਹੁੰਦੀ với người nói nữ.", note_en: "ਚਾਹੁੰਦਾ changes to ਚਾਹੁੰਦੀ for a female speaker." },
      { pa: "ਕੀ ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ?", romanization: "ki shukkarvaar nu sama mil sakda hai?", vi: "Thứ Sáu có giờ trống không?", en: "Is a time available on Friday?", note_vi: "ਨੂੰ đánh dấu ngày.", note_en: "ਨੂੰ marks the day." },
    ],
    traps: [
      { issue_vi: "Đừng quên đổi ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ theo người nói.", issue_en: "Do not forget to change ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ by speaker.", better_pa: "ਮੈਂ ਸਮਾਂ ਬਦਲਣਾ ਚਾਹੁੰਦੀ ਹਾਂ।", better_romanization: "main sama badalna chaundi haan." },
    ],
    mini_task: { prompt_vi: "Nói: Tôi muốn đổi lịch hẹn. (nữ)", prompt_en: "Say: I want to change the appointment. (female speaker)", model_pa: "ਮੈਂ ਅਪਾਇੰਟਮੈਂਟ ਬਦਲਣੀ ਚਾਹੁੰਦੀ ਹਾਂ।", model_romanization: "main appointment badalni chaundi haan." },
  },
  {
    id: "pa_a2_daily_simple_problem",
    topic: "simple_problems",
    title_vi: "Vấn đề đơn giản",
    title_en: "Simple problems",
    use_case_vi: "Báo mất đồ, hỏng đồ, hoặc không hiểu.",
    use_case_en: "Report something lost, broken, or unclear.",
    grammar_focus_vi: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ = tôi không hiểu. ਮੇਰਾ/ਮੇਰੀ agrees với vật bị mất/hỏng.",
    grammar_focus_en: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ = I did not understand. ਮੇਰਾ/ਮੇਰੀ agrees with the lost/broken item.",
    script_awareness_vi: "Chữ chính là Gurmukhi; Shahmukhi chỉ là awareness.",
    script_awareness_en: "The main script is Gurmukhi; Shahmukhi is awareness only.",
    lines: [
      { pa: "ਮੇਰੀ ਚਾਬੀ ਗੁੰਮ ਗਈ ਹੈ।", romanization: "meri chabi gumm gai hai.", vi: "Chìa khóa của tôi bị mất.", en: "My key is lost.", note_vi: "ਚਾਬੀ giống cái: ਮੇਰੀ, ਗਈ.", note_en: "ਚਾਬੀ is feminine: ਮੇਰੀ, ਗਈ." },
      { pa: "ਮੇਰਾ ਫ਼ੋਨ ਟੁੱਟ ਗਿਆ ਹੈ।", romanization: "mera phone tutt gia hai.", vi: "Điện thoại của tôi bị vỡ/hỏng.", en: "My phone has broken.", note_vi: "ਫ਼ੋਨ thường xử lý như giống đực: ਮੇਰਾ, ਗਿਆ.", note_en: "ਫ਼ੋਨ is often treated as masculine: ਮੇਰਾ, ਗਿਆ." },
      { pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ।", romanization: "mainu samajh nahi aai.", vi: "Tôi không hiểu.", en: "I did not understand.", note_vi: "Cụm rất hữu ích khi cần nhắc lại.", note_en: "Very useful when you need repetition." },
    ],
    traps: [
      { issue_vi: "Không nói ਮੈਂ ਸਮਝ ਨਹੀਂ ਹਾਂ.", issue_en: "Do not say ਮੈਂ ਸਮਝ ਨਹੀਂ ਹਾਂ.", better_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ।", better_romanization: "mainu samajh nahi aai." },
    ],
    canada_practical_vi: "Với giấy tờ ở Canada, có thể thay ਚਾਬੀ bằng ਕਾਰਡ, ਆਈਡੀ, ਹੈਲਥ ਕਾਰਡ.",
    canada_practical_en: "For Canadian documents, replace ਚਾਬੀ with ਕਾਰਡ, ਆਈਡੀ, or ਹੈਲਥ ਕਾਰਡ.",
    mini_task: { prompt_vi: "Nói: Thẻ của tôi bị mất.", prompt_en: "Say: My card is lost.", model_pa: "ਮੇਰਾ ਕਾਰਡ ਗੁੰਮ ਗਿਆ ਹੈ।", model_romanization: "mera card gumm gia hai." },
  },
  {
    id: "pa_a2_daily_schedule_change",
    topic: "schedule_changes",
    title_vi: "Thay đổi lịch",
    title_en: "Schedule changes",
    use_case_vi: "Báo đến muộn, đổi ngày, hoặc hủy kế hoạch.",
    use_case_en: "Say you will be late, change the day, or cancel a plan.",
    grammar_focus_vi: "ਦੇਰ ਨਾਲ = muộn; ਰੱਦ ਕਰਨਾ = hủy; ਅੱਗੇ ਕਰਨਾ = dời lên/sang sau tùy ngữ cảnh cần rõ ngày mới.",
    grammar_focus_en: "ਦੇਰ ਨਾਲ = late; ਰੱਦ ਕਰਨਾ = cancel; ਅੱਗੇ ਕਰਨਾ can be ambiguous, so state the new day clearly.",
    script_awareness_vi: "Gurmukhi dùng cho tất cả mẫu; Shahmukhi chỉ là awareness.",
    script_awareness_en: "Gurmukhi is used for all models; Shahmukhi is awareness only.",
    lines: [
      { pa: "ਮੈਂ ਦਸ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵਾਂਗਾ।", romanization: "main das mint der naal aavanga.", vi: "Tôi sẽ đến muộn mười phút. (nam)", en: "I will be ten minutes late. (male speaker)", note_vi: "ਆਵਾਂਗਾ đổi theo người nói.", note_en: "ਆਵਾਂਗਾ changes with the speaker." },
      { pa: "ਕੀ ਅਸੀਂ ਮੀਟਿੰਗ ਕੱਲ੍ਹ ਕਰ ਸਕਦੇ ਹਾਂ?", romanization: "ki asin meeting kal kar sakde haan?", vi: "Chúng ta có thể họp ngày mai không?", en: "Can we do the meeting tomorrow?", note_vi: "ਕਰ ਸਕਦੇ ਹਾਂ = chúng ta có thể làm.", note_en: "ਕਰ ਸਕਦੇ ਹਾਂ = we can do." },
      { pa: "ਮੈਨੂੰ ਅੱਜ ਦਾ ਪਲਾਨ ਰੱਦ ਕਰਨਾ ਪਵੇਗਾ।", romanization: "mainu ajj da plan radd karna pavega.", vi: "Tôi sẽ phải hủy kế hoạch hôm nay.", en: "I will have to cancel today's plan.", note_vi: "ਪਵੇਗਾ diễn tả 'sẽ phải'.", note_en: "ਪਵੇਗਾ expresses 'will have to'." },
    ],
    traps: [
      { issue_vi: "Khi dời lịch, nói rõ ngày/giờ mới để tránh mơ hồ.", issue_en: "When rescheduling, state the new day/time to avoid ambiguity.", better_pa: "ਮੀਟਿੰਗ ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ ਕਰੀਏ।", better_romanization: "meeting shukkarvaar nu kariye." },
    ],
    canada_practical_vi: "Khi nhắn lịch ở Canada, thêm số phút cụ thể thường được đánh giá là lịch sự.",
    canada_practical_en: "In Canadian scheduling messages, giving the exact number of minutes is usually courteous.",
    mini_task: { prompt_vi: "Nói: Tôi sẽ đến muộn năm phút. (nữ)", prompt_en: "Say: I will be five minutes late. (female speaker)", model_pa: "ਮੈਂ ਪੰਜ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵਾਂਗੀ।", model_romanization: "main panj mint der naal aavangi." },
  },
  {
    id: "pa_a2_daily_transport_delay",
    topic: "transport",
    title_vi: "Giao thông bị trễ",
    title_en: "Transport delay",
    use_case_vi: "Nói xe buýt/tàu trễ và hỏi tuyến.",
    use_case_en: "Say the bus/train is late and ask about a route.",
    grammar_focus_vi: "ਬੱਸ/ਟ੍ਰੇਨ thường giống cái trong các mẫu này: ਆ ਰਹੀ ਹੈ, ਆਵੇਗੀ.",
    grammar_focus_en: "ਬੱਸ/ਟ੍ਰੇਨ are often feminine in these patterns: ਆ ਰਹੀ ਹੈ, ਆਵੇਗੀ.",
    script_awareness_vi: "Gurmukhi là chữ học chính; Shahmukhi chỉ là awareness.",
    script_awareness_en: "Gurmukhi is the learning script; Shahmukhi is awareness only.",
    canada_practical_vi: "Tên tuyến như TTC, SkyTrain, GO Train có thể xuất hiện xen trong câu Punjabi.",
    canada_practical_en: "Route names like TTC, SkyTrain, and GO Train may be mixed into Punjabi sentences.",
    lines: [
      { pa: "ਬੱਸ ਦੇਰ ਨਾਲ ਆ ਰਹੀ ਹੈ।", romanization: "bass der naal aa rahi hai.", vi: "Xe buýt đang đến muộn.", en: "The bus is coming late.", note_vi: "ਆ ਰਹੀ agrees với ਬੱਸ.", note_en: "ਆ ਰਹੀ agrees with ਬੱਸ." },
      { pa: "ਇਹ ਟ੍ਰੇਨ ਕਿੱਥੇ ਜਾਂਦੀ ਹੈ?", romanization: "eh train kitthe jandi hai?", vi: "Tàu này đi đâu?", en: "Where does this train go?", note_vi: "ਕਿੱਥੇ đứng trước động từ.", note_en: "ਕਿੱਥੇ comes before the verb." },
      { pa: "ਅਗਲਾ ਸਟਾਪ ਕਿਹੜਾ ਹੈ?", romanization: "agla stop kihra hai?", vi: "Trạm tiếp theo là trạm nào?", en: "What is the next stop?", note_vi: "ਕਿਹੜਾ hỏi 'cái nào'.", note_en: "ਕਿਹੜਾ asks 'which one'." },
    ],
    traps: [
      { issue_vi: "Đừng dùng ਆ ਰਿਹਾ với ਬੱਸ nếu đang giữ agreement giống cái.", issue_en: "Do not use ਆ ਰਿਹਾ with ਬੱਸ if maintaining feminine agreement.", better_pa: "ਬੱਸ ਆ ਰਹੀ ਹੈ।", better_romanization: "bass aa rahi hai." },
    ],
    mini_task: { prompt_vi: "Nói: Tàu sẽ đến lúc sáu giờ.", prompt_en: "Say: The train will come at six.", model_pa: "ਟ੍ਰੇਨ ਛੇ ਵਜੇ ਆਵੇਗੀ।", model_romanization: "train chhe vaje aavegi." },
  },
  {
    id: "pa_a2_daily_school_family",
    topic: "school_family_routines",
    title_vi: "Lịch gia đình và trường học",
    title_en: "School and family routines",
    use_case_vi: "Nói giờ đưa đón, bài tập, và sinh hoạt gia đình.",
    use_case_en: "Talk about pickup time, homework, and family routines.",
    grammar_focus_vi: "ਲੈਣ ਜਾਣਾ/ਲੈਣ ਆਉਣਾ = đi/đến đón. ਹੋਮਵਰਕ ਦੇਣਾ = nộp bài.",
    grammar_focus_en: "ਲੈਣ ਜਾਣਾ/ਲੈਣ ਆਉਣਾ = go/come to pick up. ਹੋਮਵਰਕ ਦੇਣਾ = submit homework.",
    script_awareness_vi: "Gurmukhi là phần chính; Shahmukhi chỉ là awareness.",
    script_awareness_en: "Gurmukhi is the main part; Shahmukhi is awareness only.",
    canada_practical_vi: "Ở Canada, daycare, pickup, lunch box có thể được mượn âm trong Punjabi nói hằng ngày.",
    canada_practical_en: "In Canada, daycare, pickup, and lunch box may be borrowed in everyday spoken Punjabi.",
    lines: [
      { pa: "ਮੈਂ ਬੱਚੇ ਨੂੰ ਤਿੰਨ ਵਜੇ ਲੈਣ ਆਵਾਂਗੀ।", romanization: "main bachche nu tinn vaje lain aavangi.", vi: "Tôi sẽ đến đón con lúc ba giờ. (nữ)", en: "I will come to pick up the child at three. (female speaker)", note_vi: "ਬੱਚੇ ਨੂੰ đánh dấu người được đón.", note_en: "ਬੱਚੇ ਨੂੰ marks the child being picked up." },
      { pa: "ਹੋਮਵਰਕ ਕੱਲ੍ਹ ਦੇਣਾ ਹੈ।", romanization: "homework kal dena hai.", vi: "Bài tập phải nộp ngày mai.", en: "The homework is due tomorrow.", note_vi: "ਦੇਣਾ ở đây là nộp.", note_en: "ਦੇਣਾ here means submit." },
      { pa: "ਅਸੀਂ ਰਾਤ ਨੂੰ ਇਕੱਠੇ ਖਾਣਾ ਖਾਂਦੇ ਹਾਂ।", romanization: "asin raat nu ikatthe khana khande haan.", vi: "Chúng tôi ăn tối cùng nhau.", en: "We eat together at night.", note_vi: "ਖਾਂਦੇ agrees với ਅਸੀਂ.", note_en: "ਖਾਂਦੇ agrees with ਅਸੀਂ." },
    ],
    traps: [
      { issue_vi: "Không dùng ਮੇਰਾ với ਕਲਾਸ nếu danh từ được xử lý như giống cái.", issue_en: "Do not use ਮੇਰਾ with ਕਲਾਸ when it is treated as feminine.", better_pa: "ਮੇਰੀ ਕਲਾਸ ਨੌਂ ਵਜੇ ਹੈ।", better_romanization: "meri class naun vaje hai." },
    ],
    mini_task: { prompt_vi: "Nói: Tôi sẽ đi đón con lúc bốn giờ. (nam)", prompt_en: "Say: I will go pick up the child at four. (male speaker)", model_pa: "ਮੈਂ ਬੱਚੇ ਨੂੰ ਚਾਰ ਵਜੇ ਲੈਣ ਜਾਵਾਂਗਾ।", model_romanization: "main bachche nu chaar vaje lain javanga." },
  },
];
