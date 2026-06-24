// src/languages/punjabi/roleplayExpansionsA2.ts
//
// Punjabi A2 roleplay expansions for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred.

export type PunjabiRoleplayExpansionA2Scenario =
  | "appointments"
  | "shopping_returns"
  | "transport_delay"
  | "housing_repair"
  | "school_office"
  | "childcare"
  | "workplace_check_in"
  | "public_service_counter";

export type PunjabiRoleplayTurn = {
  speaker: "A" | "B";
  pa: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiRoleplayTrap = {
  trap_vi: string;
  trap_en: string;
  better_pa: string;
  better_romanization: string;
};

export type PunjabiRoleplayExpansionA2 = {
  id: string;
  scenario: PunjabiRoleplayExpansionA2Scenario;
  title_vi: string;
  title_en: string;
  learner_goal_vi: string;
  learner_goal_en: string;
  role_a_vi: string;
  role_a_en: string;
  role_b_vi: string;
  role_b_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  useful_phrases: PunjabiRoleplayTurn[];
  model_dialogue: PunjabiRoleplayTurn[];
  traps: PunjabiRoleplayTrap[];
  variation_prompt_vi: string;
  variation_prompt_en: string;
};

const scriptAwarenessVi = "Gurmukhi là chữ chính trong roleplay; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn = "Gurmukhi is the main roleplay script; Shahmukhi is mentioned only for awareness, not as a separate course.";

export const roleplayExpansionsA2: PunjabiRoleplayExpansionA2[] = [
  {
    id: "pa_a2_roleplay_clinic_reschedule",
    scenario: "appointments",
    title_vi: "Đổi lịch hẹn phòng khám",
    title_en: "Rescheduling a clinic appointment",
    learner_goal_vi: "Xác nhận lịch hẹn và xin đổi sang ngày khác.",
    learner_goal_en: "Confirm an appointment and ask to move it to another day.",
    role_a_vi: "Bạn là bệnh nhân.",
    role_a_en: "You are the patient.",
    role_b_vi: "Bạn là nhân viên phòng khám.",
    role_b_en: "You are the clinic staff member.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "ਅਪਾਇੰਟਮੈਂਟ, ਕਲਿਨਿਕ, ਹੈਲਥ ਕਾਰਡ là từ mượn thường gặp trong bối cảnh Canada.",
    canada_practical_en: "ਅਪਾਇੰਟਮੈਂਟ, ਕਲਿਨਿਕ, and ਹੈਲਥ ਕਾਰਡ are common loanwords in Canadian contexts.",
    useful_phrases: [
      { speaker: "A", pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕਿਹੜੇ ਦਿਨ ਹੈ?", romanization: "meri appointment kihre din hai?", vi: "Lịch hẹn của tôi vào ngày nào?", en: "What day is my appointment?" },
      { speaker: "A", pa: "ਕੀ ਮੈਂ ਸਮਾਂ ਬਦਲ ਸਕਦਾ ਹਾਂ?", romanization: "ki main sama badal sakda haan?", vi: "Tôi có thể đổi giờ không? (nam)", en: "Can I change the time? (male speaker)" },
      { speaker: "B", pa: "ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ।", romanization: "shukkarvaar nu sama mil sakda hai.", vi: "Thứ Sáu có giờ trống.", en: "A time is available on Friday." },
    ],
    model_dialogue: [
      { speaker: "A", pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਕੱਲ੍ਹ ਹੈ?", romanization: "maaf karna, meri appointment kal hai?", vi: "Xin lỗi, lịch hẹn của tôi là ngày mai phải không?", en: "Sorry, is my appointment tomorrow?" },
      { speaker: "B", pa: "ਹਾਂ ਜੀ, ਦੋ ਵਜੇ ਹੈ।", romanization: "haan ji, do vaje hai.", vi: "Vâng, lúc hai giờ.", en: "Yes, at two." },
      { speaker: "A", pa: "ਕੀ ਮੈਂ ਇਸਨੂੰ ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ ਬਦਲ ਸਕਦੀ ਹਾਂ?", romanization: "ki main isnu shukkarvaar nu badal sakdi haan?", vi: "Tôi có thể đổi sang thứ Sáu không? (nữ)", en: "Can I change it to Friday? (female speaker)" },
      { speaker: "B", pa: "ਹਾਂ, ਸ਼ੁੱਕਰਵਾਰ ਤਿੰਨ ਵਜੇ ਠੀਕ ਹੈ।", romanization: "haan, shukkarvaar tinn vaje theek hai.", vi: "Được, thứ Sáu lúc ba giờ được.", en: "Yes, Friday at three is fine." },
    ],
    traps: [
      { trap_vi: "ਸਕਦਾ/ਸਕਦੀ đổi theo người nói.", trap_en: "ਸਕਦਾ/ਸਕਦੀ changes with the speaker.", better_pa: "ਕੀ ਮੈਂ ਬਦਲ ਸਕਦੀ ਹਾਂ?", better_romanization: "ki main badal sakdi haan?" },
    ],
    variation_prompt_vi: "Đổi tình huống: lịch hẹn nha sĩ lúc mười giờ, bạn muốn chuyển sang thứ Hai.",
    variation_prompt_en: "Variation: dentist appointment at ten; you want to move it to Monday.",
  },
  {
    id: "pa_a2_roleplay_return_item",
    scenario: "shopping_returns",
    title_vi: "Đổi trả hàng",
    title_en: "Returning an item",
    learner_goal_vi: "Nói món hàng bị lỗi và hỏi có thể đổi/trả không.",
    learner_goal_en: "Say an item has a problem and ask whether you can return or exchange it.",
    role_a_vi: "Bạn là khách hàng.",
    role_a_en: "You are the customer.",
    role_b_vi: "Bạn là nhân viên cửa hàng.",
    role_b_en: "You are the store employee.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "ਰਸੀਦ, ਰਿਫੰਡ, ਐਕਸਚੇਂਜ là các từ mượn dễ gặp ở cửa hàng Canada.",
    canada_practical_en: "ਰਸੀਦ, ਰਿਫੰਡ, and ਐਕਸਚੇਂਜ are common loanwords in Canadian stores.",
    useful_phrases: [
      { speaker: "A", pa: "ਇਸ ਵਿੱਚ ਸਮੱਸਿਆ ਹੈ।", romanization: "is vich samassia hai.", vi: "Cái này có vấn đề.", en: "There is a problem with this." },
      { speaker: "A", pa: "ਮੇਰੇ ਕੋਲ ਰਸੀਦ ਹੈ।", romanization: "mere kol raseed hai.", vi: "Tôi có hóa đơn.", en: "I have the receipt." },
      { speaker: "B", pa: "ਕੀ ਤੁਸੀਂ ਐਕਸਚੇਂਜ ਚਾਹੁੰਦੇ ਹੋ?", romanization: "ki tusi exchange chaunde ho?", vi: "Bạn muốn đổi hàng không?", en: "Do you want an exchange?" },
    ],
    model_dialogue: [
      { speaker: "A", pa: "ਮਾਫ਼ ਕਰਨਾ, ਇਹ ਫ਼ੋਨ ਚਾਰਜ ਨਹੀਂ ਹੁੰਦਾ।", romanization: "maaf karna, eh phone charge nahi hunda.", vi: "Xin lỗi, điện thoại này không sạc được.", en: "Sorry, this phone does not charge." },
      { speaker: "B", pa: "ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਰਸੀਦ ਹੈ?", romanization: "ki tuhade kol raseed hai?", vi: "Bạn có hóa đơn không?", en: "Do you have the receipt?" },
      { speaker: "A", pa: "ਹਾਂ ਜੀ, ਮੇਰੇ ਕੋਲ ਰਸੀਦ ਹੈ।", romanization: "haan ji, mere kol raseed hai.", vi: "Vâng, tôi có hóa đơn.", en: "Yes, I have the receipt." },
      { speaker: "B", pa: "ਅਸੀਂ ਐਕਸਚੇਂਜ ਕਰ ਸਕਦੇ ਹਾਂ।", romanization: "asin exchange kar sakde haan.", vi: "Chúng tôi có thể đổi hàng.", en: "We can do an exchange." },
    ],
    traps: [
      { trap_vi: "Đừng bắt đầu bằng câu buộc tội; mô tả vấn đề trước.", trap_en: "Do not start with an accusation; describe the problem first.", better_pa: "ਇਸ ਵਿੱਚ ਸਮੱਸਿਆ ਹੈ।", better_romanization: "is vich samassia hai." },
    ],
    variation_prompt_vi: "Đổi món hàng thành áo khoác và nói size không đúng.",
    variation_prompt_en: "Change the item to a jacket and say the size is wrong.",
  },
  {
    id: "pa_a2_roleplay_bus_delay",
    scenario: "transport_delay",
    title_vi: "Xe buýt/tàu bị trễ",
    title_en: "Bus or train delay",
    learner_goal_vi: "Hỏi tuyến, xác nhận trạm, và báo mình sẽ đến muộn.",
    learner_goal_en: "Ask about the route, confirm the stop, and say you will be late.",
    role_a_vi: "Bạn là hành khách.",
    role_a_en: "You are the passenger.",
    role_b_vi: "Bạn là nhân viên hoặc người đi đường.",
    role_b_en: "You are staff or another passenger.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Có thể thay địa danh bằng TTC, SkyTrain, Surrey Central, Main Street.",
    canada_practical_en: "You can swap in TTC, SkyTrain, Surrey Central, or Main Street.",
    useful_phrases: [
      { speaker: "A", pa: "ਇਹ ਬੱਸ ਕਿੱਥੇ ਜਾਂਦੀ ਹੈ?", romanization: "eh bass kitthe jandi hai?", vi: "Xe buýt này đi đâu?", en: "Where does this bus go?" },
      { speaker: "A", pa: "ਮੈਨੂੰ ਕਿੱਥੇ ਉਤਰਨਾ ਹੈ?", romanization: "mainu kitthe utarna hai?", vi: "Tôi phải xuống ở đâu?", en: "Where should I get off?" },
      { speaker: "A", pa: "ਮੈਂ ਦਸ ਮਿੰਟ ਦੇਰ ਨਾਲ ਆਵਾਂਗਾ।", romanization: "main das mint der naal aavanga.", vi: "Tôi sẽ đến muộn mười phút. (nam)", en: "I will be ten minutes late. (male speaker)" },
    ],
    model_dialogue: [
      { speaker: "A", pa: "ਮਾਫ਼ ਕਰਨਾ, ਇਹ ਬੱਸ ਸਰੀ ਸੈਂਟਰ ਜਾਂਦੀ ਹੈ?", romanization: "maaf karna, eh bass surrey centre jandi hai?", vi: "Xin lỗi, xe buýt này đi Surrey Centre không?", en: "Excuse me, does this bus go to Surrey Centre?" },
      { speaker: "B", pa: "ਹਾਂ, ਪਰ ਬੱਸ ਦੇਰ ਨਾਲ ਆ ਰਹੀ ਹੈ।", romanization: "haan, par bass der naal aa rahi hai.", vi: "Có, nhưng xe buýt đang đến muộn.", en: "Yes, but the bus is coming late." },
      { speaker: "A", pa: "ਮੈਨੂੰ ਕਿੱਥੇ ਉਤਰਨਾ ਹੈ?", romanization: "mainu kitthe utarna hai?", vi: "Tôi phải xuống ở đâu?", en: "Where should I get off?" },
      { speaker: "B", pa: "ਆਖਰੀ ਸਟਾਪ ਤੇ ਉਤਰੋ।", romanization: "aakhri stop te utro.", vi: "Xuống ở trạm cuối.", en: "Get off at the last stop." },
    ],
    traps: [
      { trap_vi: "ਬੱਸ thường dùng ਜਾਂਦੀ/ਆ ਰਹੀ trong mẫu này.", trap_en: "ਬੱਸ often takes ਜਾਂਦੀ/ਆ ਰਹੀ in this pattern.", better_pa: "ਬੱਸ ਕਿੱਥੇ ਜਾਂਦੀ ਹੈ?", better_romanization: "bass kitthe jandi hai?" },
    ],
    variation_prompt_vi: "Thay bus bằng train và hỏi platform đúng.",
    variation_prompt_en: "Change bus to train and ask for the correct platform.",
  },
  {
    id: "pa_a2_roleplay_housing_repair",
    scenario: "housing_repair",
    title_vi: "Báo sửa nhà",
    title_en: "Reporting a housing repair",
    learner_goal_vi: "Mô tả vấn đề trong nhà và xin người quản lý đến xem.",
    learner_goal_en: "Describe a household problem and ask the manager to look at it.",
    role_a_vi: "Bạn là người thuê.",
    role_a_en: "You are the tenant.",
    role_b_vi: "Bạn là chủ nhà/quản lý.",
    role_b_en: "You are the landlord/manager.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Heater, leak, basement có thể xuất hiện như từ mượn trong Punjabi Canada.",
    canada_practical_en: "Heater, leak, and basement may appear as loanwords in Canadian Punjabi.",
    useful_phrases: [
      { speaker: "A", pa: "ਹੀਟਰ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "heater kamm nahi kar riha.", vi: "Máy sưởi không hoạt động.", en: "The heater is not working." },
      { speaker: "A", pa: "ਰਸੋਈ ਵਿੱਚ ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "rasoi vich paani leak ho riha hai.", vi: "Nước đang rò trong bếp.", en: "Water is leaking in the kitchen." },
      { speaker: "A", pa: "ਕੀ ਤੁਸੀਂ ਆ ਕੇ ਦੇਖ ਸਕਦੇ ਹੋ?", romanization: "ki tusi aa ke dekh sakde ho?", vi: "Bạn có thể đến xem không?", en: "Can you come and look?" },
    ],
    model_dialogue: [
      { speaker: "A", pa: "ਮਾਫ਼ ਕਰਨਾ, ਬਾਥਰੂਮ ਵਿੱਚ ਪਾਣੀ ਨਹੀਂ ਆ ਰਿਹਾ।", romanization: "maaf karna, bathroom vich paani nahi aa riha.", vi: "Xin lỗi, trong phòng tắm không có nước.", en: "Sorry, water is not coming in the bathroom." },
      { speaker: "B", pa: "ਇਹ ਕਦੋਂ ਤੋਂ ਹੋ ਰਿਹਾ ਹੈ?", romanization: "eh kadon ton ho riha hai?", vi: "Việc này xảy ra từ khi nào?", en: "Since when has this been happening?" },
      { speaker: "A", pa: "ਅੱਜ ਸਵੇਰੇ ਤੋਂ।", romanization: "ajj savere ton.", vi: "Từ sáng nay.", en: "Since this morning." },
      { speaker: "B", pa: "ਮੈਂ ਸ਼ਾਮ ਨੂੰ ਦੇਖਾਂਗਾ।", romanization: "main shaam nu dekhanga.", vi: "Tôi sẽ xem buổi tối. (nam)", en: "I will look in the evening. (male speaker)" },
    ],
    traps: [
      { trap_vi: "Mở bằng ਮਾਫ਼ ਕਰਨਾ giúp báo lỗi mềm hơn.", trap_en: "Opening with ਮਾਫ਼ ਕਰਨਾ makes a repair report softer.", better_pa: "ਮਾਫ਼ ਕਰਨਾ, ਇੱਕ ਸਮੱਸਿਆ ਹੈ।", better_romanization: "maaf karna, ikk samassia hai." },
    ],
    variation_prompt_vi: "Đổi vấn đề thành máy sưởi không hoạt động từ hôm qua.",
    variation_prompt_en: "Change the problem to the heater not working since yesterday.",
  },
  {
    id: "pa_a2_roleplay_school_office",
    scenario: "school_office",
    title_vi: "Văn phòng trường",
    title_en: "School office",
    learner_goal_vi: "Báo vắng, hỏi hạn bài tập, hoặc xác nhận phòng học.",
    learner_goal_en: "Report absence, ask homework due date, or confirm classroom.",
    role_a_vi: "Bạn là phụ huynh/học viên.",
    role_a_en: "You are a parent/student.",
    role_b_vi: "Bạn là nhân viên văn phòng trường.",
    role_b_en: "You are school office staff.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được với school office, adult ESL class, parent-teacher message.",
    canada_practical_en: "Works with school offices, adult ESL classes, and parent-teacher messages.",
    useful_phrases: [
      { speaker: "A", pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਸਕੂਲ ਨਹੀਂ ਆ ਸਕਦਾ।", romanization: "mera bachcha ajj school nahi aa sakda.", vi: "Con tôi hôm nay không thể đến trường.", en: "My child cannot come to school today." },
      { speaker: "A", pa: "ਹੋਮਵਰਕ ਕਦੋਂ ਦੇਣਾ ਹੈ?", romanization: "homework kadon dena hai?", vi: "Khi nào phải nộp bài tập?", en: "When is the homework due?" },
      { speaker: "A", pa: "ਕਲਾਸ ਕਿਹੜੇ ਕਮਰੇ ਵਿੱਚ ਹੈ?", romanization: "class kihre kamre vich hai?", vi: "Lớp ở phòng nào?", en: "Which room is the class in?" },
    ],
    model_dialogue: [
      { speaker: "A", pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਬਿਮਾਰ ਹੈ।", romanization: "maaf karna, mera bachcha ajj bimaar hai.", vi: "Xin lỗi, con tôi hôm nay bị ốm.", en: "Sorry, my child is sick today." },
      { speaker: "B", pa: "ਠੀਕ ਹੈ, ਨਾਮ ਕੀ ਹੈ?", romanization: "theek hai, naam ki hai?", vi: "Được, tên là gì?", en: "Okay, what is the name?" },
      { speaker: "A", pa: "ਨਾਮ ਅਮਨ ਹੈ।", romanization: "naam aman hai.", vi: "Tên là Aman.", en: "The name is Aman." },
      { speaker: "B", pa: "ਧੰਨਵਾਦ, ਅਸੀਂ ਨੋਟ ਕਰ ਲਿਆ।", romanization: "dhannvaad, asin note kar lia.", vi: "Cảm ơn, chúng tôi đã ghi chú.", en: "Thank you, we have noted it." },
    ],
    traps: [
      { trap_vi: "ਮੇਰਾ/ਮੇਰੀ agrees với danh từ sau: ਮੇਰਾ ਬੱਚਾ, ਮੇਰੀ ਕਲਾਸ.", trap_en: "ਮੇਰਾ/ਮੇਰੀ agrees with the following noun: ਮੇਰਾ ਬੱਚਾ, ਮੇਰੀ ਕਲਾਸ.", better_pa: "ਮੇਰੀ ਕਲਾਸ ਨੌਂ ਵਜੇ ਹੈ।", better_romanization: "meri class naun vaje hai." },
    ],
    variation_prompt_vi: "Đổi thành hỏi phòng học và xác nhận room number.",
    variation_prompt_en: "Change it to asking for the classroom and confirming the room number.",
  },
  {
    id: "pa_a2_roleplay_childcare_pickup",
    scenario: "childcare",
    title_vi: "Đón trẻ ở daycare",
    title_en: "Daycare pickup",
    learner_goal_vi: "Nói giờ đón, hỏi trẻ đã ăn chưa, và báo tình trạng sức khỏe.",
    learner_goal_en: "Say pickup time, ask whether the child ate, and report a health condition.",
    role_a_vi: "Bạn là phụ huynh.",
    role_a_en: "You are the parent.",
    role_b_vi: "Bạn là nhân viên childcare.",
    role_b_en: "You are childcare staff.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Daycare, pickup, lunch box thường được mượn âm trong Punjabi đời thường ở Canada.",
    canada_practical_en: "Daycare, pickup, and lunch box are often borrowed in everyday Canadian Punjabi.",
    useful_phrases: [
      { speaker: "A", pa: "ਮੈਂ ਬੱਚੇ ਨੂੰ ਤਿੰਨ ਵਜੇ ਲੈਣ ਆਵਾਂਗੀ।", romanization: "main bachche nu tinn vaje lain aavangi.", vi: "Tôi sẽ đến đón trẻ lúc ba giờ. (nữ)", en: "I will come to pick up the child at three. (female speaker)" },
      { speaker: "A", pa: "ਬੱਚੇ ਨੇ ਖਾਣਾ ਖਾਧਾ?", romanization: "bachche ne khana khadha?", vi: "Bé đã ăn chưa?", en: "Did the child eat?" },
      { speaker: "B", pa: "ਉਸਨੂੰ ਥੋੜ੍ਹਾ ਬੁਖਾਰ ਹੈ।", romanization: "usnu thoda bukhar hai.", vi: "Bé hơi sốt.", en: "The child has a slight fever." },
    ],
    model_dialogue: [
      { speaker: "A", pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਮੈਂ ਅਮਨ ਨੂੰ ਲੈਣ ਆਈ ਹਾਂ।", romanization: "sat sri akal, main aman nu lain aai haan.", vi: "Xin chào, tôi đến đón Aman. (nữ)", en: "Hello, I came to pick up Aman. (female speaker)" },
      { speaker: "B", pa: "ਹਾਂ ਜੀ, ਉਸਨੇ ਖਾਣਾ ਖਾ ਲਿਆ ਹੈ।", romanization: "haan ji, usne khana kha lia hai.", vi: "Vâng, bé đã ăn rồi.", en: "Yes, the child has eaten." },
      { speaker: "A", pa: "ਕੀ ਉਸਨੂੰ ਬੁਖਾਰ ਹੈ?", romanization: "ki usnu bukhar hai?", vi: "Bé có sốt không?", en: "Does the child have a fever?" },
      { speaker: "B", pa: "ਨਹੀਂ, ਹੁਣ ਠੀਕ ਹੈ।", romanization: "nahi, hun theek hai.", vi: "Không, bây giờ ổn rồi.", en: "No, now the child is fine." },
    ],
    traps: [
      { trap_vi: "Tình trạng sức khỏe dùng ਉਸਨੂੰ ... ਹੈ, không ਉਹ ... ਹੈ.", trap_en: "Health conditions use ਉਸਨੂੰ ... ਹੈ, not ਉਹ ... ਹੈ.", better_pa: "ਉਸਨੂੰ ਬੁਖਾਰ ਹੈ।", better_romanization: "usnu bukhar hai." },
    ],
    variation_prompt_vi: "Đổi giờ đón sang năm giờ và hỏi bé đã ngủ chưa.",
    variation_prompt_en: "Change pickup to five and ask whether the child slept.",
  },
  {
    id: "pa_a2_roleplay_work_checkin",
    scenario: "workplace_check_in",
    title_vi: "Check-in ở nơi làm việc",
    title_en: "Workplace check-in",
    learner_goal_vi: "Hỏi nhiệm vụ, báo tiến độ, và xin giải thích lại.",
    learner_goal_en: "Ask about a task, report progress, and ask for clarification.",
    role_a_vi: "Bạn là nhân viên.",
    role_a_en: "You are the employee.",
    role_b_vi: "Bạn là đồng nghiệp/quản lý.",
    role_b_en: "You are the coworker/manager.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được trong retail, warehouse, office, training shift.",
    canada_practical_en: "Works in retail, warehouse, office, and training shifts.",
    useful_phrases: [
      { speaker: "A", pa: "ਅੱਜ ਮੇਰਾ ਕੰਮ ਕੀ ਹੈ?", romanization: "ajj mera kamm ki hai?", vi: "Hôm nay việc của tôi là gì?", en: "What is my work today?" },
      { speaker: "A", pa: "ਮੈਂ ਰਿਪੋਰਟ ਪੂਰੀ ਕਰ ਲਈ ਹੈ।", romanization: "main report poori kar lai hai.", vi: "Tôi đã hoàn thành báo cáo.", en: "I have finished the report." },
      { speaker: "A", pa: "ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਸਮਝਾ ਸਕਦੇ ਹੋ?", romanization: "ki tusi dubara samjha sakde ho?", vi: "Bạn có thể giải thích lại không?", en: "Can you explain again?" },
    ],
    model_dialogue: [
      { speaker: "A", pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਅੱਜ ਮੇਰਾ ਕੰਮ ਕੀ ਹੈ?", romanization: "sat sri akal, ajj mera kamm ki hai?", vi: "Xin chào, hôm nay việc của tôi là gì?", en: "Hello, what is my work today?" },
      { speaker: "B", pa: "ਪਹਿਲਾਂ ਇਹ ਰਿਪੋਰਟ ਪੂਰੀ ਕਰੋ।", romanization: "pehlan eh report poori karo.", vi: "Trước tiên hoàn thành báo cáo này.", en: "First, finish this report." },
      { speaker: "A", pa: "ਮਾਫ਼ ਕਰਨਾ, ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਸਮਝਾ ਸਕਦੇ ਹੋ?", romanization: "maaf karna, ki tusi dubara samjha sakde ho?", vi: "Xin lỗi, bạn có thể giải thích lại không?", en: "Sorry, can you explain again?" },
      { speaker: "B", pa: "ਹਾਂ, ਮੈਂ ਹੌਲੀ ਸਮਝਾਉਂਦਾ ਹਾਂ।", romanization: "haan, main hauli samjhaunda haan.", vi: "Được, tôi sẽ giải thích chậm.", en: "Yes, I will explain slowly." },
    ],
    traps: [
      { trap_vi: "Ở workplace, dùng ਤੁਸੀਂ thay vì ਤੂੰ khi chưa thân.", trap_en: "At work, use ਤੁਸੀਂ instead of ਤੂੰ when not close.", better_pa: "ਕੀ ਤੁਸੀਂ ਦੱਸ ਸਕਦੇ ਹੋ?", better_romanization: "ki tusi dass sakde ho?" },
    ],
    variation_prompt_vi: "Đổi nhiệm vụ thành kiểm tra email và báo đã xong.",
    variation_prompt_en: "Change the task to checking email and report that it is done.",
  },
  {
    id: "pa_a2_roleplay_public_counter",
    scenario: "public_service_counter",
    title_vi: "Quầy dịch vụ công",
    title_en: "Public-service counter",
    learner_goal_vi: "Hỏi mẫu đơn, giấy tờ cần thiết, và xác nhận bước tiếp theo.",
    learner_goal_en: "Ask about a form, required documents, and the next step.",
    role_a_vi: "Bạn là người đến làm thủ tục.",
    role_a_en: "You are the applicant/client.",
    role_b_vi: "Bạn là nhân viên quầy.",
    role_b_en: "You are the counter staff member.",
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: "Dùng được ở Service Canada, thư viện, community centre, settlement office.",
    canada_practical_en: "Works at Service Canada, libraries, community centres, and settlement offices.",
    useful_phrases: [
      { speaker: "A", pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨਾ ਹੈ।", romanization: "mainu eh form bharna hai.", vi: "Tôi cần điền mẫu này.", en: "I need to fill out this form." },
      { speaker: "A", pa: "ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?", romanization: "kihre dastavez chahide han?", vi: "Cần những giấy tờ nào?", en: "Which documents are needed?" },
      { speaker: "A", pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", romanization: "agla kadam ki hai?", vi: "Bước tiếp theo là gì?", en: "What is the next step?" },
    ],
    model_dialogue: [
      { speaker: "A", pa: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨਾ ਹੈ।", romanization: "maaf karna, mainu eh form bharna hai.", vi: "Xin lỗi, tôi cần điền mẫu này.", en: "Excuse me, I need to fill out this form." },
      { speaker: "B", pa: "ਤੁਹਾਨੂੰ ਆਈਡੀ ਅਤੇ ਪਤਾ ਚਾਹੀਦਾ ਹੈ।", romanization: "tuhanu ID ate pata chahida hai.", vi: "Bạn cần ID và địa chỉ.", en: "You need ID and an address." },
      { speaker: "A", pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?", romanization: "agla kadam ki hai?", vi: "Bước tiếp theo là gì?", en: "What is the next step?" },
      { speaker: "B", pa: "ਫਾਰਮ ਇੱਥੇ ਜਮ੍ਹਾਂ ਕਰੋ।", romanization: "form itthe jamma karo.", vi: "Nộp mẫu ở đây.", en: "Submit the form here." },
    ],
    traps: [
      { trap_vi: "ਦਸਤਾਵੇਜ਼ số nhiều; ਚਾਹੀਦੇ ਹਨ phù hợp hơn ਚਾਹੀਦਾ ਹੈ.", trap_en: "ਦਸਤਾਵੇਜ਼ is plural; ਚਾਹੀਦੇ ਹਨ fits better than ਚਾਹੀਦਾ ਹੈ.", better_pa: "ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ।", better_romanization: "dastavez chahide han." },
    ],
    variation_prompt_vi: "Đổi sang hỏi thẻ thư viện và giấy tờ cần mang.",
    variation_prompt_en: "Change it to asking about a library card and required documents.",
  },
];
