// src/languages/punjabi/capstoneTasksB1.ts
//
// Punjabi B1 capstone/checkpoint tasks for Vietnamese-speaking and English-
// speaking learners. Gurmukhi is primary; romanization is a support bridge.
// Shahmukhi is mentioned only for awareness, not taught as a full course.
//
// Native review is deferred; this module makes no native-review claim.

export type PunjabiB1CapstoneFocus =
  | "explain_problem"
  | "retell_event"
  | "ask_clarification"
  | "service_conversation"
  | "workplace_issue"
  | "school_community_task"
  | "health_service_communication";

export type PunjabiCapstoneLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiCapstoneTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiCapstoneLine;
};

export type PunjabiB1CapstoneTask = {
  id: string;
  level: "B1";
  focus: PunjabiB1CapstoneFocus;
  title_en: string;
  title_vi: string;
  checkpointSkill_en: string;
  checkpointSkill_vi: string;
  scenario_en: string;
  scenario_vi: string;
  learnerGoal_en: string;
  learnerGoal_vi: string;
  canadaContext: string;
  successCriteria_en: string[];
  successCriteria_vi: string[];
  usefulLanguage: PunjabiCapstoneLine[];
  modelAnswer: PunjabiCapstoneLine;
  selfCheckPrompt_en: string;
  selfCheckPrompt_vi: string;
  commonTraps: PunjabiCapstoneTrap[];
};

export const punjabiB1CapstoneTasks: PunjabiB1CapstoneTask[] = [
  {
    id: "pa-b1-capstone-01-housing-problem",
    level: "B1",
    focus: "explain_problem",
    title_en: "Explain a housing repair problem",
    title_vi: "Giải thích vấn đề sửa chữa nhà ở",
    checkpointSkill_en: "Explain a practical problem with location, impact, and requested next step.",
    checkpointSkill_vi: "Giải thích vấn đề thực tế với vị trí, ảnh hưởng và bước tiếp theo mong muốn.",
    scenario_en: "Water is leaking under the sink in your rental unit.",
    scenario_vi: "Nước rò dưới bồn rửa trong nhà thuê của bạn.",
    learnerGoal_en: "Tell the building manager what is wrong and ask for repair timing.",
    learnerGoal_vi: "Nói với quản lý tòa nhà vấn đề là gì và hỏi thời gian sửa.",
    canadaContext: "Useful for tenant-landlord or building-maintenance conversations in Canada.",
    successCriteria_en: ["State the problem clearly.", "Say where it is.", "Ask for a repair time."],
    successCriteria_vi: ["Nêu vấn đề rõ ràng.", "Nói vị trí ở đâu.", "Hỏi thời gian sửa."],
    usefulLanguage: [
      { pa: "ਸਿੰਕ ਹੇਠਾਂ ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "sink hethan paani leak ho riha hai.", en: "Water is leaking under the sink.", vi: "Nước đang rò dưới bồn rửa." },
      { pa: "ਫਰਸ਼ ਗਿੱਲਾ ਹੋ ਗਿਆ ਹੈ।", romanization: "farsh gilla ho gia hai.", en: "The floor has become wet.", vi: "Sàn đã bị ướt." },
      { pa: "ਮੁਰੰਮਤ ਕਦੋਂ ਹੋਵੇਗੀ?", romanization: "murammat kadon hovegi?", en: "When will the repair happen?", vi: "Khi nào sẽ sửa?" },
    ],
    modelAnswer: {
      pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਸਿੰਕ ਹੇਠਾਂ ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ ਅਤੇ ਫਰਸ਼ ਗਿੱਲਾ ਹੋ ਗਿਆ ਹੈ। ਮੁਰੰਮਤ ਕਦੋਂ ਹੋਵੇਗੀ?",
      romanization: "sat sri akal ji, sink hethan paani leak ho riha hai ate farsh gilla ho gia hai. murammat kadon hovegi?",
      en: "Hello, water is leaking under the sink and the floor has become wet. When will the repair happen?",
      vi: "Xin chào, nước đang rò dưới bồn rửa và sàn đã bị ướt. Khi nào sẽ sửa?",
    },
    selfCheckPrompt_en: "Did you include problem, location, and a repair question?",
    selfCheckPrompt_vi: "Bạn đã nêu vấn đề, vị trí và câu hỏi về sửa chữa chưa?",
    commonTraps: [
      {
        trap_en: "Saying 'there is water' without giving location or impact.",
        trap_vi: "Nói 'có nước' mà không nêu vị trí hoặc ảnh hưởng.",
        better: { pa: "ਲੀਕ ਸਿੰਕ ਹੇਠਾਂ ਹੈ ਅਤੇ ਫਰਸ਼ ਗਿੱਲਾ ਹੈ।", romanization: "leak sink hethan hai ate farsh gilla hai.", en: "The leak is under the sink and the floor is wet.", vi: "Chỗ rò ở dưới bồn rửa và sàn bị ướt." },
      },
    ],
  },
  {
    id: "pa-b1-capstone-02-retell-service-visit",
    level: "B1",
    focus: "retell_event",
    title_en: "Retell a public-service visit",
    title_vi: "Kể lại một lần đến cơ quan dịch vụ công",
    checkpointSkill_en: "Retell events in order using sequence markers and a result.",
    checkpointSkill_vi: "Kể lại sự việc theo thứ tự bằng từ nối trình tự và kết quả.",
    scenario_en: "You went to a service counter but one document was missing.",
    scenario_vi: "Bạn đến quầy dịch vụ nhưng thiếu một giấy tờ.",
    learnerGoal_en: "Tell a friend what happened and what you must do next. Language support only, not legal advice.",
    learnerGoal_vi: "Kể với bạn chuyện xảy ra và bạn phải làm gì tiếp. Chỉ hỗ trợ ngôn ngữ, không phải tư vấn pháp lý.",
    canadaContext: "Useful after municipal, settlement, or Service Canada-style counter visits.",
    successCriteria_en: ["Use at least three sequence markers.", "Mention the missing document.", "Say the next action."],
    successCriteria_vi: ["Dùng ít nhất ba từ nối trình tự.", "Nhắc giấy tờ còn thiếu.", "Nói hành động tiếp theo."],
    usefulLanguage: [
      { pa: "ਪਹਿਲਾਂ ਮੈਂ ਟੋਕਨ ਲਿਆ।", romanization: "pahilan main token lia.", en: "First I took a token.", vi: "Trước tiên tôi lấy số thứ tự." },
      { pa: "ਫਿਰ ਅਧਿਕਾਰੀ ਨੇ ਪਤੇ ਦਾ ਸਬੂਤ ਮੰਗਿਆ।", romanization: "phir adhikari ne pate da saboot mangia.", en: "Then the officer asked for proof of address.", vi: "Sau đó nhân viên yêu cầu chứng minh địa chỉ." },
      { pa: "ਹੁਣ ਮੈਨੂੰ ਕੱਲ੍ਹ ਵਾਪਸ ਜਾਣਾ ਹੈ।", romanization: "hun mainu kallh wapas jana hai.", en: "Now I have to go back tomorrow.", vi: "Bây giờ tôi phải quay lại ngày mai." },
    ],
    modelAnswer: {
      pa: "ਪਹਿਲਾਂ ਮੈਂ ਟੋਕਨ ਲਿਆ। ਫਿਰ ਅਧਿਕਾਰੀ ਨੇ ਪਤੇ ਦਾ ਸਬੂਤ ਮੰਗਿਆ। ਮੇਰੇ ਕੋਲ ਉਹ ਨਹੀਂ ਸੀ, ਇਸ ਲਈ ਹੁਣ ਮੈਨੂੰ ਕੱਲ੍ਹ ਵਾਪਸ ਜਾਣਾ ਹੈ।",
      romanization: "pahilan main token lia. phir adhikari ne pate da saboot mangia. mere kol oh nahin si, is lai hun mainu kallh wapas jana hai.",
      en: "First I took a token. Then the officer asked for proof of address. I did not have it, so now I have to go back tomorrow.",
      vi: "Trước tiên tôi lấy số. Sau đó nhân viên yêu cầu chứng minh địa chỉ. Tôi không có giấy đó, nên bây giờ phải quay lại ngày mai.",
    },
    selfCheckPrompt_en: "Did your story answer: first, then, problem, next step?",
    selfCheckPrompt_vi: "Câu chuyện của bạn có trả lời: trước tiên, sau đó, vấn đề, bước tiếp theo không?",
    commonTraps: [
      {
        trap_en: "Using ਕੱਲ੍ਹ without enough context; it can mean yesterday or tomorrow.",
        trap_vi: "Dùng ਕੱਲ੍ਹ thiếu ngữ cảnh; nó có thể nghĩa là hôm qua hoặc ngày mai.",
        better: { pa: "ਕੱਲ੍ਹ ਸਵੇਰੇ ਵਾਪਸ ਜਾਣਾ ਹੈ।", romanization: "kallh savere wapas jana hai.", en: "I have to go back tomorrow morning.", vi: "Tôi phải quay lại sáng mai." },
      },
    ],
  },
  {
    id: "pa-b1-capstone-03-phone-clarification",
    level: "B1",
    focus: "ask_clarification",
    title_en: "Clarify phone information",
    title_vi: "Làm rõ thông tin qua điện thoại",
    checkpointSkill_en: "Ask for repetition, confirm numbers, and request written follow-up.",
    checkpointSkill_vi: "Xin nhắc lại, xác nhận số và yêu cầu theo dõi bằng văn bản.",
    scenario_en: "A clinic or office gives you an appointment time by phone.",
    scenario_vi: "Phòng khám hoặc văn phòng cho bạn giờ hẹn qua điện thoại.",
    learnerGoal_en: "Clarify the date, time, place, and whether you will receive a text or email.",
    learnerGoal_vi: "Làm rõ ngày, giờ, địa điểm và liệu bạn sẽ nhận tin nhắn hoặc email.",
    canadaContext: "Useful for clinic, school, community agency, and workplace calls.",
    successCriteria_en: ["Ask them to repeat slowly.", "Repeat the details back.", "Ask for text or email confirmation."],
    successCriteria_vi: ["Xin họ nhắc lại chậm.", "Lặp lại chi tiết.", "Xin xác nhận qua tin nhắn hoặc email."],
    usefulLanguage: [
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਬਾਰਾ ਕਹੋ।", romanization: "kirpa karke hauli dubara kaho.", en: "Please say it again slowly.", vi: "Vui lòng nói lại chậm hơn." },
      { pa: "ਕੀ ਮੈਂ ਦੁਹਰਾ ਸਕਦਾ ਹਾਂ?", romanization: "ki main duhra sakda han?", en: "Can I repeat it?", vi: "Tôi có thể lặp lại không?" },
      { pa: "ਕੀ ਤੁਸੀਂ ਪੁਸ਼ਟੀ ਈਮੇਲ ਵਿੱਚ ਭੇਜ ਸਕਦੇ ਹੋ?", romanization: "ki tusin pushti email vich bhej sakde ho?", en: "Can you send confirmation by email?", vi: "Bạn có thể gửi xác nhận qua email không?" },
    ],
    modelAnswer: {
      pa: "ਮਾਫ਼ ਕਰਨਾ, ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਬਾਰਾ ਕਹੋ। ਕੀ ਮੈਂ ਦੁਹਰਾ ਸਕਦਾ ਹਾਂ? ਅਪਾਇੰਟਮੈਂਟ ਮੰਗਲਵਾਰ ਦਸ ਵਜੇ, ਕਮਰਾ ਪੰਜ ਵਿੱਚ ਹੈ? ਕੀ ਤੁਸੀਂ ਪੁਸ਼ਟੀ ਈਮੇਲ ਵਿੱਚ ਭੇਜ ਸਕਦੇ ਹੋ?",
      romanization: "maaf karna, kirpa karke hauli dubara kaho. ki main duhra sakda han? appointment mangalvaar dass vaje, kamra panj vich hai? ki tusin pushti email vich bhej sakde ho?",
      en: "Sorry, please say it again slowly. Can I repeat it? The appointment is Tuesday at ten, in room five? Can you send confirmation by email?",
      vi: "Xin lỗi, vui lòng nói lại chậm hơn. Tôi lặp lại được không? Lịch hẹn là thứ Ba lúc mười giờ, phòng năm phải không? Bạn có thể gửi xác nhận qua email không?",
    },
    selfCheckPrompt_en: "Did you confirm both time and place?",
    selfCheckPrompt_vi: "Bạn đã xác nhận cả giờ và địa điểm chưa?",
    commonTraps: [
      {
        trap_en: "Pretending to understand numbers instead of confirming them.",
        trap_vi: "Giả vờ hiểu số thay vì xác nhận lại.",
        better: { pa: "ਨੰਬਰ ਹੌਲੀ ਕਹੋ ਜੀ।", romanization: "number hauli kaho ji.", en: "Please say the number slowly.", vi: "Vui lòng đọc số chậm hơn." },
      },
    ],
  },
  {
    id: "pa-b1-capstone-04-service-conversation",
    level: "B1",
    focus: "service_conversation",
    title_en: "Handle an incorrect service bill",
    title_vi: "Xử lý hóa đơn dịch vụ sai",
    checkpointSkill_en: "Open politely, explain the issue, ask options, and confirm correction timing.",
    checkpointSkill_vi: "Mở đầu lịch sự, giải thích vấn đề, hỏi lựa chọn và xác nhận thời gian sửa.",
    scenario_en: "You see an unexpected fee on a phone, bank, or utility bill.",
    scenario_vi: "Bạn thấy một khoản phí bất ngờ trên hóa đơn điện thoại, ngân hàng hoặc tiện ích.",
    learnerGoal_en: "Ask what the fee is for and request a corrected bill if it is a mistake.",
    learnerGoal_vi: "Hỏi khoản phí dùng cho gì và yêu cầu hóa đơn đã sửa nếu đó là lỗi.",
    canadaContext: "Useful for customer service counters and phone support in Canada.",
    successCriteria_en: ["Use a polite opening.", "Ask what the fee is for.", "Ask when the corrected bill will arrive."],
    successCriteria_vi: ["Mở đầu lịch sự.", "Hỏi phí dùng cho gì.", "Hỏi khi nào có hóa đơn sửa."],
    usefulLanguage: [
      { pa: "ਮੇਰੇ ਬਿੱਲ ਵਿੱਚ ਇਹ ਫੀਸ ਸਮਝ ਨਹੀਂ ਆ ਰਹੀ।", romanization: "mere bill vich eh fees samajh nahin aa rahi.", en: "I do not understand this fee on my bill.", vi: "Tôi không hiểu khoản phí này trên hóa đơn." },
      { pa: "ਇਹ ਫੀਸ ਕਿਸ ਲਈ ਹੈ?", romanization: "eh fees kis lai hai?", en: "What is this fee for?", vi: "Khoản phí này dùng cho gì?" },
      { pa: "ਠੀਕ ਕੀਤਾ ਬਿੱਲ ਕਦੋਂ ਮਿਲੇਗਾ?", romanization: "theek kita bill kadon milega?", en: "When will I receive the corrected bill?", vi: "Khi nào tôi sẽ nhận hóa đơn đã sửa?" },
    ],
    modelAnswer: {
      pa: "ਮਾਫ਼ ਕਰਨਾ ਜੀ, ਮੇਰੇ ਬਿੱਲ ਵਿੱਚ ਇਹ ਫੀਸ ਸਮਝ ਨਹੀਂ ਆ ਰਹੀ। ਇਹ ਫੀਸ ਕਿਸ ਲਈ ਹੈ? ਜੇ ਇਹ ਗਲਤੀ ਹੈ, ਠੀਕ ਕੀਤਾ ਬਿੱਲ ਕਦੋਂ ਮਿਲੇਗਾ?",
      romanization: "maaf karna ji, mere bill vich eh fees samajh nahin aa rahi. eh fees kis lai hai? je eh galti hai, theek kita bill kadon milega?",
      en: "Excuse me, I do not understand this fee on my bill. What is this fee for? If this is a mistake, when will I receive the corrected bill?",
      vi: "Xin lỗi, tôi không hiểu khoản phí này trên hóa đơn. Khoản phí này dùng cho gì? Nếu đây là lỗi, khi nào tôi nhận hóa đơn đã sửa?",
    },
    selfCheckPrompt_en: "Did you stay factual instead of blaming the staff?",
    selfCheckPrompt_vi: "Bạn đã giữ tính sự việc thay vì đổ lỗi cho nhân viên chưa?",
    commonTraps: [
      {
        trap_en: "Starting with anger before asking for an explanation.",
        trap_vi: "Bắt đầu bằng giận dữ trước khi hỏi giải thích.",
        better: { pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਫੀਸ ਸਮਝਾ ਦਿਓ।", romanization: "kirpa karke eh fees samjha dio.", en: "Please explain this fee.", vi: "Vui lòng giải thích khoản phí này." },
      },
    ],
  },
  {
    id: "pa-b1-capstone-05-workplace-issue",
    level: "B1",
    focus: "workplace_issue",
    title_en: "Explain a workplace delay",
    title_vi: "Giải thích chậm trễ ở nơi làm việc",
    checkpointSkill_en: "Explain cause, current status, proposed solution, and deadline.",
    checkpointSkill_vi: "Giải thích nguyên nhân, tình trạng hiện tại, giải pháp đề xuất và hạn chót.",
    scenario_en: "You cannot finish a report because one file has not arrived.",
    scenario_vi: "Bạn không thể hoàn thành báo cáo vì một tệp chưa đến.",
    learnerGoal_en: "Tell your supervisor the blocker and propose a realistic next step.",
    learnerGoal_vi: "Nói với quản lý trở ngại và đề xuất bước tiếp theo thực tế.",
    canadaContext: "Useful for office, retail, warehouse, and community-service jobs.",
    successCriteria_en: ["Name the blocker.", "Say what you can send now.", "Give a clear time for the full result."],
    successCriteria_vi: ["Nêu trở ngại.", "Nói bạn có thể gửi gì bây giờ.", "Đưa thời gian rõ cho kết quả đầy đủ."],
    usefulLanguage: [
      { pa: "ਇੱਕ ਫ਼ਾਈਲ ਅਜੇ ਨਹੀਂ ਮਿਲੀ।", romanization: "ikk file aje nahin mili.", en: "One file has not arrived yet.", vi: "Một tệp vẫn chưa có." },
      { pa: "ਮੈਂ ਅੱਜ ਸੰਖੇਪ ਭੇਜ ਸਕਦਾ ਹਾਂ।", romanization: "main ajj sankhep bhej sakda han.", en: "I can send the summary today.", vi: "Tôi có thể gửi bản tóm tắt hôm nay." },
      { pa: "ਪੂਰੀ ਰਿਪੋਰਟ ਕੱਲ੍ਹ ਸਵੇਰੇ ਭੇਜਾਂਗਾ।", romanization: "puri report kallh savere bhejanga.", en: "I will send the full report tomorrow morning.", vi: "Tôi sẽ gửi báo cáo đầy đủ sáng mai." },
    ],
    modelAnswer: {
      pa: "ਇੱਕ ਫ਼ਾਈਲ ਅਜੇ ਨਹੀਂ ਮਿਲੀ, ਇਸ ਕਰਕੇ ਰਿਪੋਰਟ ਪੂਰੀ ਨਹੀਂ ਹੋ ਸਕਦੀ। ਮੈਂ ਅੱਜ ਸੰਖੇਪ ਭੇਜ ਸਕਦਾ ਹਾਂ ਅਤੇ ਪੂਰੀ ਰਿਪੋਰਟ ਕੱਲ੍ਹ ਸਵੇਰੇ ਭੇਜਾਂਗਾ।",
      romanization: "ikk file aje nahin mili, is karke report puri nahin ho sakdi. main ajj sankhep bhej sakda han ate puri report kallh savere bhejanga.",
      en: "One file has not arrived yet, so the report cannot be completed. I can send the summary today and the full report tomorrow morning.",
      vi: "Một tệp vẫn chưa có, nên báo cáo chưa thể hoàn thành. Tôi có thể gửi bản tóm tắt hôm nay và báo cáo đầy đủ sáng mai.",
    },
    selfCheckPrompt_en: "Did you offer a solution, not only an apology?",
    selfCheckPrompt_vi: "Bạn đã đưa giải pháp, không chỉ xin lỗi, chưa?",
    commonTraps: [
      {
        trap_en: "Only apologizing without a plan.",
        trap_vi: "Chỉ xin lỗi mà không có kế hoạch.",
        better: { pa: "ਮੈਂ ਕੱਲ੍ਹ ਸਵੇਰੇ ਅੱਠ ਵਜੇ ਤੱਕ ਭੇਜਾਂਗਾ।", romanization: "main kallh savere atth vaje takk bhejanga.", en: "I will send it by eight tomorrow morning.", vi: "Tôi sẽ gửi trước tám giờ sáng mai." },
      },
    ],
  },
  {
    id: "pa-b1-capstone-06-school-community",
    level: "B1",
    focus: "school_community_task",
    title_en: "Ask about a school/community program",
    title_vi: "Hỏi về chương trình trường học/cộng đồng",
    checkpointSkill_en: "Ask eligibility, schedule, cost, registration, and next steps.",
    checkpointSkill_vi: "Hỏi điều kiện tham gia, lịch, phí, đăng ký và bước tiếp theo.",
    scenario_en: "You want your child to join an after-school or community-centre program.",
    scenario_vi: "Bạn muốn con tham gia chương trình sau giờ học hoặc trung tâm cộng đồng.",
    learnerGoal_en: "Ask staff whether the child can join and how to register.",
    learnerGoal_vi: "Hỏi nhân viên con có thể tham gia không và đăng ký thế nào.",
    canadaContext: "Useful at school offices, parent centres, libraries, and recreation centres.",
    successCriteria_en: ["Ask if the learner/child can join.", "Ask schedule and fee.", "Ask registration method."],
    successCriteria_vi: ["Hỏi có thể tham gia không.", "Hỏi lịch và phí.", "Hỏi cách đăng ký."],
    usefulLanguage: [
      { pa: "ਕੀ ਮੇਰਾ ਬੱਚਾ ਇਸ ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋ ਸਕਦਾ ਹੈ?", romanization: "ki mera bacha is program vich shamil ho sakda hai?", en: "Can my child join this program?", vi: "Con tôi có thể tham gia chương trình này không?" },
      { pa: "ਸਮਾਂ ਅਤੇ ਫੀਸ ਕੀ ਹੈ?", romanization: "sama ate fees ki hai?", en: "What are the time and fee?", vi: "Thời gian và phí là gì?" },
      { pa: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਕਿਵੇਂ ਕਰਨੀ ਹੈ?", romanization: "registration kiven karni hai?", en: "How do I register?", vi: "Tôi đăng ký bằng cách nào?" },
    ],
    modelAnswer: {
      pa: "ਕੀ ਮੇਰਾ ਬੱਚਾ ਇਸ ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋ ਸਕਦਾ ਹੈ? ਸਮਾਂ ਅਤੇ ਫੀਸ ਕੀ ਹੈ, ਅਤੇ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਕਿਵੇਂ ਕਰਨੀ ਹੈ?",
      romanization: "ki mera bacha is program vich shamil ho sakda hai? sama ate fees ki hai, ate registration kiven karni hai?",
      en: "Can my child join this program? What are the time and fee, and how do I register?",
      vi: "Con tôi có thể tham gia chương trình này không? Thời gian và phí là gì, và tôi đăng ký bằng cách nào?",
    },
    selfCheckPrompt_en: "Did you ask both program details and registration steps?",
    selfCheckPrompt_vi: "Bạn đã hỏi cả chi tiết chương trình và bước đăng ký chưa?",
    commonTraps: [
      {
        trap_en: "Forgetting to ask about fees or waitlists.",
        trap_vi: "Quên hỏi phí hoặc danh sách chờ.",
        better: { pa: "ਕੀ ਕੋਈ ਫੀਸ ਜਾਂ ਉਡੀਕ-ਸੂਚੀ ਹੈ?", romanization: "ki koi fees jaan udeek-suchi hai?", en: "Is there a fee or a waitlist?", vi: "Có phí hoặc danh sách chờ không?" },
      },
    ],
  },
  {
    id: "pa-b1-capstone-07-health-service",
    level: "B1",
    focus: "health_service_communication",
    title_en: "Explain symptoms and ask next steps",
    title_vi: "Giải thích triệu chứng và hỏi bước tiếp theo",
    checkpointSkill_en: "Explain symptom duration and ask what service step to take. Language support only, not medical advice.",
    checkpointSkill_vi: "Giải thích thời gian triệu chứng và hỏi bước dịch vụ tiếp theo. Chỉ hỗ trợ ngôn ngữ, không phải tư vấn y tế.",
    scenario_en: "You call or visit a clinic/pharmacy because symptoms are continuing.",
    scenario_vi: "Bạn gọi hoặc đến phòng khám/nhà thuốc vì triệu chứng vẫn tiếp tục.",
    learnerGoal_en: "Say symptom, duration, severity, and ask what service step is available.",
    learnerGoal_vi: "Nói triệu chứng, thời gian, mức độ và hỏi bước dịch vụ nào có sẵn.",
    canadaContext: "Useful for pharmacy, walk-in clinic, family doctor, or public-health conversations.",
    successCriteria_en: ["Say what symptom you have.", "Say how long it has lasted.", "Ask for next service step without making a medical claim."],
    successCriteria_vi: ["Nói triệu chứng bạn có.", "Nói kéo dài bao lâu.", "Hỏi bước dịch vụ tiếp theo mà không đưa ra kết luận y tế."],
    usefulLanguage: [
      { pa: "ਮੈਨੂੰ ਤਿੰਨ ਦਿਨਾਂ ਤੋਂ ਖੰਘ ਹੈ।", romanization: "mainu tinn dinan ton khangh hai.", en: "I have had a cough for three days.", vi: "Tôi bị ho ba ngày nay." },
      { pa: "ਰਾਤ ਨੂੰ ਜ਼ਿਆਦਾ ਤਕਲੀਫ਼ ਹੁੰਦੀ ਹੈ।", romanization: "raat nu zyada takleef hundi hai.", en: "It is worse at night.", vi: "Ban đêm khó chịu hơn." },
      { pa: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?", romanization: "agla kadam ki ho sakda hai?", en: "What could the next step be?", vi: "Bước tiếp theo có thể là gì?" },
    ],
    modelAnswer: {
      pa: "ਮੈਨੂੰ ਤਿੰਨ ਦਿਨਾਂ ਤੋਂ ਖੰਘ ਹੈ ਅਤੇ ਰਾਤ ਨੂੰ ਜ਼ਿਆਦਾ ਤਕਲੀਫ਼ ਹੁੰਦੀ ਹੈ। ਅਗਲਾ ਕਦਮ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
      romanization: "mainu tinn dinan ton khangh hai ate raat nu zyada takleef hundi hai. agla kadam ki ho sakda hai?",
      en: "I have had a cough for three days and it is worse at night. What could the next step be?",
      vi: "Tôi bị ho ba ngày nay và ban đêm khó chịu hơn. Bước tiếp theo có thể là gì?",
    },
    selfCheckPrompt_en: "Did you avoid giving yourself a diagnosis?",
    selfCheckPrompt_vi: "Bạn đã tránh tự chẩn đoán chưa?",
    commonTraps: [
      {
        trap_en: "Making medical conclusions instead of describing symptoms.",
        trap_vi: "Đưa kết luận y tế thay vì mô tả triệu chứng.",
        better: { pa: "ਮੈਨੂੰ ਛਾਤੀ ਵਿੱਚ ਦਰਦ ਮਹਿਸੂਸ ਹੁੰਦਾ ਹੈ।", romanization: "mainu chhati vich dard mehsoos hunda hai.", en: "I feel pain in my chest.", vi: "Tôi cảm thấy đau ở ngực." },
      },
    ],
  },
  {
    id: "pa-b1-capstone-08-integrated-community-checkpoint",
    level: "B1",
    focus: "school_community_task",
    title_en: "Integrated community checkpoint",
    title_vi: "Bài kiểm tra tổng hợp về cộng đồng",
    checkpointSkill_en: "Combine problem explanation, clarification, and next-step questions in one community task.",
    checkpointSkill_vi: "Kết hợp giải thích vấn đề, làm rõ và hỏi bước tiếp theo trong một nhiệm vụ cộng đồng.",
    scenario_en: "You ask a community centre for help registering for a class, but the form is confusing.",
    scenario_vi: "Bạn nhờ trung tâm cộng đồng giúp đăng ký lớp, nhưng mẫu đơn khó hiểu.",
    learnerGoal_en: "Explain the need, ask clarification, and confirm the next step.",
    learnerGoal_vi: "Giải thích nhu cầu, hỏi làm rõ và xác nhận bước tiếp theo.",
    canadaContext: "Useful as a B1 checkpoint for libraries, newcomer centres, and community programs.",
    successCriteria_en: ["Explain what you need.", "Ask for simpler explanation.", "Ask the next step and contact method."],
    successCriteria_vi: ["Giải thích bạn cần gì.", "Xin giải thích đơn giản hơn.", "Hỏi bước tiếp theo và cách liên hệ."],
    usefulLanguage: [
      { pa: "ਮੈਨੂੰ ਕਲਾਸ ਲਈ ਰਜਿਸਟਰ ਕਰਨਾ ਹੈ।", romanization: "mainu class lai register karna hai.", en: "I need to register for the class.", vi: "Tôi cần đăng ký lớp." },
      { pa: "ਇਹ ਸਵਾਲ ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।", romanization: "eh sawal mainu samajh nahin aaya.", en: "I did not understand this question.", vi: "Tôi chưa hiểu câu hỏi này." },
      { pa: "ਤੁਸੀਂ ਮੈਨੂੰ ਕਿਵੇਂ ਸੰਪਰਕ ਕਰੋਗੇ?", romanization: "tusin mainu kiven sampark karoge?", en: "How will you contact me?", vi: "Bạn sẽ liên hệ với tôi bằng cách nào?" },
    ],
    modelAnswer: {
      pa: "ਮੈਨੂੰ ਕਲਾਸ ਲਈ ਰਜਿਸਟਰ ਕਰਨਾ ਹੈ, ਪਰ ਇਹ ਸਵਾਲ ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕੀ ਤੁਸੀਂ ਸੌਖੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਸਮਝਾ ਸਕਦੇ ਹੋ? ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ, ਅਤੇ ਤੁਸੀਂ ਮੈਨੂੰ ਕਿਵੇਂ ਸੰਪਰਕ ਕਰੋਗੇ?",
      romanization: "mainu class lai register karna hai, par eh sawal mainu samajh nahin aaya. ki tusin saukhe shabdan vich samjha sakde ho? agla kadam ki hai, ate tusin mainu kiven sampark karoge?",
      en: "I need to register for the class, but I did not understand this question. Can you explain it in simpler words? What is the next step, and how will you contact me?",
      vi: "Tôi cần đăng ký lớp, nhưng chưa hiểu câu hỏi này. Bạn có thể giải thích bằng từ đơn giản hơn không? Bước tiếp theo là gì, và bạn sẽ liên hệ với tôi bằng cách nào?",
    },
    selfCheckPrompt_en: "Did your answer combine need, clarification, and next step?",
    selfCheckPrompt_vi: "Câu trả lời của bạn có kết hợp nhu cầu, làm rõ và bước tiếp theo không?",
    commonTraps: [
      {
        trap_en: "Asking for help without saying what you are trying to do.",
        trap_vi: "Nhờ giúp mà không nói bạn đang muốn làm gì.",
        better: { pa: "ਮੈਂ ਕਲਾਸ ਲਈ ਫਾਰਮ ਭਰ ਰਿਹਾ ਹਾਂ।", romanization: "main class lai form bhar riha han.", en: "I am filling out the form for the class.", vi: "Tôi đang điền mẫu cho lớp học." },
      },
    ],
  },
];
