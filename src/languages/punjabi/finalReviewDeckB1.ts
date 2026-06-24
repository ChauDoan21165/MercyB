// src/languages/punjabi/finalReviewDeckB1.ts
//
// Punjabi B1 final review deck for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary; romanization is a support bridge. Shahmukhi is
// mentioned only for awareness, not taught as a full course.
//
// Native review is deferred; this module makes no native-review claim.

export type PunjabiB1FinalReviewFocus =
  | "explain_situation"
  | "retell_event"
  | "clarify_next_steps"
  | "service_conversation"
  | "workplace_issue"
  | "school_community_task"
  | "health_service_communication"
  | "register_transfer_review";

export type PunjabiFinalReviewLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiFinalReviewTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiFinalReviewLine;
};

export type PunjabiFinalReviewQA = {
  prompt_en: string;
  prompt_vi: string;
  modelAnswer: PunjabiFinalReviewLine;
  followUpQuestion: PunjabiFinalReviewLine;
};

export type PunjabiB1FinalReviewCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1FinalReviewFocus;
  title_en: string;
  title_vi: string;
  reviewGoal_en: string;
  reviewGoal_vi: string;
  canadaContext: string;
  checkpointCriteria_en: string[];
  checkpointCriteria_vi: string[];
  usefulLanguage: PunjabiFinalReviewLine[];
  qa: PunjabiFinalReviewQA;
  commonTraps: PunjabiFinalReviewTrap[];
  finalRoute_en: string;
  finalRoute_vi: string;
};

export const punjabiB1FinalReviewDeck: PunjabiB1FinalReviewCard[] = [
  {
    id: "pa-b1-final-01-explain-situation",
    level: "B1",
    focus: "explain_situation",
    title_en: "Explain a situation clearly",
    title_vi: "Giải thích tình huống rõ ràng",
    reviewGoal_en: "Review how to explain a practical issue with cause, impact, and next step.",
    reviewGoal_vi: "Ôn cách giải thích vấn đề thực tế với nguyên nhân, ảnh hưởng và bước tiếp theo.",
    canadaContext: "Useful at building offices, libraries, community centres, and service counters in Canada.",
    checkpointCriteria_en: ["State the issue.", "Add cause or impact.", "Ask for the next step politely."],
    checkpointCriteria_vi: ["Nêu vấn đề.", "Thêm nguyên nhân hoặc ảnh hưởng.", "Hỏi bước tiếp theo lịch sự."],
    usefulLanguage: [
      { pa: "ਮੇਰਾ ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "mera card kam nahin kar riha.", en: "My card is not working.", vi: "Thẻ của tôi không hoạt động." },
      { pa: "ਇਸ ਕਰਕੇ ਮੈਂ ਅੰਦਰ ਨਹੀਂ ਜਾ ਸਕਦਾ।", romanization: "is karke main andar nahin ja sakda.", en: "Because of this I cannot go inside.", vi: "Vì vậy tôi không thể vào trong." },
      { pa: "ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਦੱਸੋ ਜੀ।", romanization: "mainu agla kadam dasso ji.", en: "Please tell me the next step.", vi: "Vui lòng cho tôi biết bước tiếp theo." },
    ],
    qa: {
      prompt_en: "Your access card does not open the community centre door. Explain the situation and ask what to do.",
      prompt_vi: "Thẻ ra vào của bạn không mở được cửa trung tâm cộng đồng. Hãy giải thích tình huống và hỏi nên làm gì.",
      modelAnswer: {
        pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਮੇਰਾ ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ। ਇਸ ਕਰਕੇ ਮੈਂ ਅੰਦਰ ਨਹੀਂ ਜਾ ਸਕਦਾ। ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਦੱਸੋ ਜੀ।",
        romanization: "sat sri akal ji, mera card kam nahin kar riha. is karke main andar nahin ja sakda. mainu agla kadam dasso ji.",
        en: "Hello, my card is not working. Because of this I cannot go inside. Please tell me the next step.",
        vi: "Xin chào, thẻ của tôi không hoạt động. Vì vậy tôi không thể vào trong. Vui lòng cho tôi biết bước tiếp theo.",
      },
      followUpQuestion: { pa: "ਕੀ ਨਵਾਂ ਕਾਰਡ ਮਿਲ ਸਕਦਾ ਹੈ?", romanization: "ki nava card mil sakda hai?", en: "Can I get a new card?", vi: "Tôi có thể nhận thẻ mới không?" },
    },
    commonTraps: [
      {
        trap_en: "Only saying 'card problem' without explaining the result.",
        trap_vi: "Chỉ nói 'vấn đề thẻ' mà không giải thích kết quả.",
        better: { pa: "ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰਦਾ, ਇਸ ਲਈ ਦਰਵਾਜ਼ਾ ਨਹੀਂ ਖੁੱਲਦਾ।", romanization: "card kam nahin karda, is lai darvaza nahin khulda.", en: "The card does not work, so the door does not open.", vi: "Thẻ không hoạt động, nên cửa không mở." },
      },
    ],
    finalRoute_en: "If clear, route to B2 practical problem resolution; otherwise review B1 situation cards.",
    finalRoute_vi: "Nếu rõ, chuyển sang giải quyết vấn đề thực tế B2; nếu chưa, ôn thẻ tình huống B1.",
  },
  {
    id: "pa-b1-final-02-retell-event",
    level: "B1",
    focus: "retell_event",
    title_en: "Retell an event in order",
    title_vi: "Kể lại sự việc theo thứ tự",
    reviewGoal_en: "Review sequence markers, cause, result, and a short conclusion.",
    reviewGoal_vi: "Ôn từ nối trình tự, nguyên nhân, kết quả và kết luận ngắn.",
    canadaContext: "Useful for transit delays, workplace updates, school messages, and appointment explanations.",
    checkpointCriteria_en: ["Use time order.", "Explain why it happened.", "Say the result or next action."],
    checkpointCriteria_vi: ["Dùng thứ tự thời gian.", "Giải thích vì sao xảy ra.", "Nói kết quả hoặc hành động tiếp theo."],
    usefulLanguage: [
      { pa: "ਪਹਿਲਾਂ ਮੈਨੂੰ ਸੁਨੇਹਾ ਮਿਲਿਆ।", romanization: "pahilan mainu suneha milia.", en: "First I received a message.", vi: "Trước tiên tôi nhận được tin nhắn." },
      { pa: "ਫਿਰ ਸਮਾਂ ਬਦਲ ਗਿਆ।", romanization: "phir sama badal gia.", en: "Then the time changed.", vi: "Sau đó giờ đã thay đổi." },
      { pa: "ਇਸ ਕਰਕੇ ਮੈਂ ਦੇਰ ਨਾਲ ਆਇਆ।", romanization: "is karke main der naal aaya.", en: "Because of this I came late.", vi: "Vì vậy tôi đến muộn." },
    ],
    qa: {
      prompt_en: "Retell why you came late after an appointment time changed.",
      prompt_vi: "Kể lại vì sao bạn đến muộn sau khi giờ hẹn thay đổi.",
      modelAnswer: {
        pa: "ਪਹਿਲਾਂ ਮੈਨੂੰ ਸੁਨੇਹਾ ਮਿਲਿਆ ਕਿ ਸਮਾਂ ਬਦਲ ਗਿਆ ਹੈ। ਫਿਰ ਮੈਂ ਬੱਸ ਲਈ, ਪਰ ਟ੍ਰੈਫਿਕ ਬਹੁਤ ਸੀ। ਇਸ ਕਰਕੇ ਮੈਂ ਦੇਰ ਨਾਲ ਆਇਆ।",
        romanization: "pahilan mainu suneha milia ki sama badal gia hai. phir main bus lai, par traffic bahut si. is karke main der naal aaya.",
        en: "First I received a message that the time had changed. Then I took the bus, but there was a lot of traffic. Because of this I came late.",
        vi: "Trước tiên tôi nhận được tin nhắn rằng giờ đã thay đổi. Sau đó tôi đi xe buýt, nhưng giao thông rất đông. Vì vậy tôi đến muộn.",
      },
      followUpQuestion: { pa: "ਕੀ ਮੈਂ ਹੁਣ ਵੀ ਅੰਦਰ ਆ ਸਕਦਾ ਹਾਂ?", romanization: "ki main hun vi andar aa sakda han?", en: "Can I still come in now?", vi: "Bây giờ tôi vẫn có thể vào không?" },
    },
    commonTraps: [
      {
        trap_en: "Jumping between events without sequence words.",
        trap_vi: "Nhảy giữa các sự việc mà không dùng từ nối trình tự.",
        better: { pa: "ਪਹਿਲਾਂ..., ਫਿਰ..., ਇਸ ਕਰਕੇ...", romanization: "pahilan..., phir..., is karke...", en: "First..., then..., because of this...", vi: "Trước tiên..., sau đó..., vì vậy..." },
      },
    ],
    finalRoute_en: "If the sequence is stable, route to longer B2 narratives.",
    finalRoute_vi: "Nếu trình tự ổn, chuyển sang bài kể dài hơn ở B2.",
  },
  {
    id: "pa-b1-final-03-clarify-next-steps",
    level: "B1",
    focus: "clarify_next_steps",
    title_en: "Clarify next steps",
    title_vi: "Làm rõ bước tiếp theo",
    reviewGoal_en: "Review how to ask for repetition, confirm details, and request written follow-up.",
    reviewGoal_vi: "Ôn cách xin nhắc lại, xác nhận chi tiết và yêu cầu theo dõi bằng văn bản.",
    canadaContext: "Useful for clinics, school offices, settlement agencies, and public counters. Language support only, not legal or medical advice. Chỉ hỗ trợ ngôn ngữ, không phải tư vấn pháp lý hoặc y tế.",
    checkpointCriteria_en: ["Ask them to repeat slowly.", "Confirm document, date, or place.", "Ask for text or email confirmation."],
    checkpointCriteria_vi: ["Xin họ nhắc lại chậm.", "Xác nhận giấy tờ, ngày hoặc địa điểm.", "Xin xác nhận bằng tin nhắn hoặc email."],
    usefulLanguage: [
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਬਾਰਾ ਕਹੋ।", romanization: "kirpa karke hauli dubara kaho.", en: "Please say it again slowly.", vi: "Vui lòng nói lại chậm hơn." },
      { pa: "ਕੀ ਮੈਂ ਜਾਣਕਾਰੀ ਦੁਹਰਾ ਸਕਦਾ ਹਾਂ?", romanization: "ki main jankari duhra sakda han?", en: "Can I repeat the information?", vi: "Tôi có thể lặp lại thông tin không?" },
      { pa: "ਕੀ ਤੁਸੀਂ ਈਮੇਲ ਵਿੱਚ ਪੁਸ਼ਟੀ ਭੇਜ ਸਕਦੇ ਹੋ?", romanization: "ki tusin email vich pushti bhej sakde ho?", en: "Can you send confirmation by email?", vi: "Bạn có thể gửi xác nhận qua email không?" },
    ],
    qa: {
      prompt_en: "An office gives you a document deadline quickly. Clarify the date and ask for confirmation.",
      prompt_vi: "Một văn phòng nói nhanh hạn nộp giấy tờ. Hãy làm rõ ngày và xin xác nhận.",
      modelAnswer: {
        pa: "ਮਾਫ਼ ਕਰਨਾ ਜੀ, ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਬਾਰਾ ਕਹੋ। ਕੀ ਮਿਤੀ ਸੋਮਵਾਰ ਹੈ? ਕੀ ਤੁਸੀਂ ਈਮੇਲ ਵਿੱਚ ਪੁਸ਼ਟੀ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization: "maaf karna ji, kirpa karke hauli dubara kaho. ki miti somvaar hai? ki tusin email vich pushti bhej sakde ho?",
        en: "Sorry, please say it again slowly. Is the date Monday? Can you send confirmation by email?",
        vi: "Xin lỗi, vui lòng nói lại chậm hơn. Ngày đó là thứ Hai phải không? Bạn có thể gửi xác nhận qua email không?",
      },
      followUpQuestion: { pa: "ਕਿਹੜਾ ਦਸਤਾਵੇਜ਼ ਲਿਆਉਣਾ ਹੈ?", romanization: "kihra dastavez liauna hai?", en: "Which document should I bring?", vi: "Tôi nên mang giấy tờ nào?" },
    },
    commonTraps: [
      {
        trap_en: "Saying yes before checking the date or document.",
        trap_vi: "Nói đồng ý trước khi kiểm tra ngày hoặc giấy tờ.",
        better: { pa: "ਮਿਤੀ ਅਤੇ ਦਸਤਾਵੇਜ਼ ਫਿਰ ਦੱਸੋ ਜੀ।", romanization: "miti ate dastavez phir dasso ji.", en: "Please tell me the date and document again.", vi: "Vui lòng cho tôi biết lại ngày và giấy tờ." },
      },
    ],
    finalRoute_en: "If clear, route to phone and service checkpoints; otherwise repeat clarification drills.",
    finalRoute_vi: "Nếu rõ, chuyển sang điểm kiểm tra gọi điện và dịch vụ; nếu chưa, lặp lại bài làm rõ.",
  },
  {
    id: "pa-b1-final-04-service-conversation",
    level: "B1",
    focus: "service_conversation",
    title_en: "Handle service conversations",
    title_vi: "Xử lý hội thoại dịch vụ",
    reviewGoal_en: "Review polite opening, factual issue description, options, and correction timing.",
    reviewGoal_vi: "Ôn mở đầu lịch sự, mô tả vấn đề theo sự việc, lựa chọn và thời gian sửa.",
    canadaContext: "Useful for phone, bank, transit, utility, library, and customer-service conversations.",
    checkpointCriteria_en: ["Open politely.", "Ask what the problem or fee is.", "Confirm what happens next."],
    checkpointCriteria_vi: ["Mở đầu lịch sự.", "Hỏi vấn đề hoặc khoản phí là gì.", "Xác nhận chuyện gì xảy ra tiếp theo."],
    usefulLanguage: [
      { pa: "ਮੇਰੇ ਖਾਤੇ ਵਿੱਚ ਇਹ ਚਾਰਜ ਕੀ ਹੈ?", romanization: "mere khate vich eh charge ki hai?", en: "What is this charge on my account?", vi: "Khoản tính phí này trong tài khoản của tôi là gì?" },
      { pa: "ਕੀ ਇਹ ਗਲਤੀ ਹੋ ਸਕਦੀ ਹੈ?", romanization: "ki eh galti ho sakdi hai?", en: "Could this be a mistake?", vi: "Đây có thể là lỗi không?" },
      { pa: "ਠੀਕ ਹੋਣ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?", romanization: "theek hon vich kinna sama laggega?", en: "How long will it take to be corrected?", vi: "Sẽ mất bao lâu để sửa?" },
    ],
    qa: {
      prompt_en: "Ask about an unexpected account charge and confirm correction timing.",
      prompt_vi: "Hỏi về một khoản tính phí bất ngờ trong tài khoản và xác nhận thời gian sửa.",
      modelAnswer: {
        pa: "ਮਾਫ਼ ਕਰਨਾ ਜੀ, ਮੇਰੇ ਖਾਤੇ ਵਿੱਚ ਇਹ ਚਾਰਜ ਕੀ ਹੈ? ਕੀ ਇਹ ਗਲਤੀ ਹੋ ਸਕਦੀ ਹੈ? ਜੇ ਇਹ ਗਲਤੀ ਹੈ, ਠੀਕ ਹੋਣ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?",
        romanization: "maaf karna ji, mere khate vich eh charge ki hai? ki eh galti ho sakdi hai? je eh galti hai, theek hon vich kinna sama laggega?",
        en: "Excuse me, what is this charge on my account? Could this be a mistake? If it is a mistake, how long will it take to be corrected?",
        vi: "Xin lỗi, khoản tính phí này trong tài khoản của tôi là gì? Đây có thể là lỗi không? Nếu là lỗi, sẽ mất bao lâu để sửa?",
      },
      followUpQuestion: { pa: "ਕੀ ਮੈਨੂੰ ਕੋਈ ਰੈਫਰੈਂਸ ਨੰਬਰ ਮਿਲ ਸਕਦਾ ਹੈ?", romanization: "ki mainu koi reference number mil sakda hai?", en: "Can I get a reference number?", vi: "Tôi có thể nhận số tham chiếu không?" },
    },
    commonTraps: [
      {
        trap_en: "Blaming the staff instead of asking for an explanation.",
        trap_vi: "Đổ lỗi cho nhân viên thay vì hỏi giải thích.",
        better: { pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਚਾਰਜ ਸਮਝਾ ਦਿਓ।", romanization: "kirpa karke eh charge samjha dio.", en: "Please explain this charge.", vi: "Vui lòng giải thích khoản tính phí này." },
      },
    ],
    finalRoute_en: "If factual and polite, route to B2 complaint handling.",
    finalRoute_vi: "Nếu nói theo sự việc và lịch sự, chuyển sang xử lý khiếu nại B2.",
  },
  {
    id: "pa-b1-final-05-workplace-issue",
    level: "B1",
    focus: "workplace_issue",
    title_en: "Report workplace issues",
    title_vi: "Báo cáo vấn đề nơi làm việc",
    reviewGoal_en: "Review how to report blockers, status, and realistic next steps.",
    reviewGoal_vi: "Ôn cách báo cáo trở ngại, tình trạng và bước tiếp theo thực tế.",
    canadaContext: "Useful in offices, retail, warehouses, restaurants, and community-service jobs.",
    checkpointCriteria_en: ["Name the blocker.", "Say what is possible now.", "Offer timing or ask priority."],
    checkpointCriteria_vi: ["Nêu trở ngại.", "Nói hiện giờ có thể làm gì.", "Đưa thời gian hoặc hỏi ưu tiên."],
    usefulLanguage: [
      { pa: "ਸਪਲਾਈ ਅਜੇ ਨਹੀਂ ਆਈ।", romanization: "supply aje nahin aai.", en: "The supply has not arrived yet.", vi: "Hàng/đồ cung ứng vẫn chưa đến." },
      { pa: "ਮੈਂ ਹੋਰ ਕੰਮ ਪਹਿਲਾਂ ਕਰ ਸਕਦਾ ਹਾਂ।", romanization: "main hor kam pahilan kar sakda han.", en: "I can do other work first.", vi: "Tôi có thể làm việc khác trước." },
      { pa: "ਤੁਸੀਂ ਕਿਹੜਾ ਕੰਮ ਪਹਿਲਾਂ ਚਾਹੁੰਦੇ ਹੋ?", romanization: "tusin kihra kam pahilan chahunde ho?", en: "Which task do you want first?", vi: "Bạn muốn việc nào trước?" },
    ],
    qa: {
      prompt_en: "Tell your supervisor supplies are missing and ask which task to do first.",
      prompt_vi: "Nói với quản lý rằng thiếu đồ cung ứng và hỏi nên làm việc nào trước.",
      modelAnswer: {
        pa: "ਸਪਲਾਈ ਅਜੇ ਨਹੀਂ ਆਈ, ਇਸ ਲਈ ਇਹ ਕੰਮ ਪੂਰਾ ਨਹੀਂ ਹੋ ਸਕਦਾ। ਮੈਂ ਹੋਰ ਕੰਮ ਪਹਿਲਾਂ ਕਰ ਸਕਦਾ ਹਾਂ। ਤੁਸੀਂ ਕਿਹੜਾ ਕੰਮ ਪਹਿਲਾਂ ਚਾਹੁੰਦੇ ਹੋ?",
        romanization: "supply aje nahin aai, is lai eh kam pura nahin ho sakda. main hor kam pahilan kar sakda han. tusin kihra kam pahilan chahunde ho?",
        en: "The supply has not arrived yet, so this work cannot be completed. I can do other work first. Which task do you want first?",
        vi: "Đồ cung ứng vẫn chưa đến, nên việc này chưa thể hoàn thành. Tôi có thể làm việc khác trước. Bạn muốn việc nào trước?",
      },
      followUpQuestion: { pa: "ਕੀ ਮੈਂ ਤੁਹਾਨੂੰ ਅਪਡੇਟ ਭੇਜਾਂ?", romanization: "ki main tuhanu update bhejan?", en: "Should I send you an update?", vi: "Tôi có nên gửi cập nhật cho bạn không?" },
    },
    commonTraps: [
      {
        trap_en: "Only saying 'not possible' without giving an option.",
        trap_vi: "Chỉ nói 'không thể' mà không đưa lựa chọn.",
        better: { pa: "ਇਹ ਅਜੇ ਨਹੀਂ ਹੋ ਸਕਦਾ, ਪਰ ਮੈਂ ਦੂਜਾ ਕੰਮ ਕਰ ਸਕਦਾ ਹਾਂ।", romanization: "eh aje nahin ho sakda, par main duja kam kar sakda han.", en: "This cannot be done yet, but I can do another task.", vi: "Việc này chưa làm được, nhưng tôi có thể làm việc khác." },
      },
    ],
    finalRoute_en: "If the update is clear, route to B2 workplace status reports.",
    finalRoute_vi: "Nếu cập nhật rõ, chuyển sang báo cáo tình trạng công việc B2.",
  },
  {
    id: "pa-b1-final-06-school-community-task",
    level: "B1",
    focus: "school_community_task",
    title_en: "Handle school and community tasks",
    title_vi: "Xử lý nhiệm vụ trường học và cộng đồng",
    reviewGoal_en: "Review how to ask eligibility, schedule, cost, forms, and next steps.",
    reviewGoal_vi: "Ôn cách hỏi điều kiện tham gia, lịch, phí, mẫu đơn và bước tiếp theo.",
    canadaContext: "Useful at school offices, libraries, community centres, newcomer programs, and childcare desks.",
    checkpointCriteria_en: ["Ask who can join.", "Ask schedule or cost.", "Ask registration next step."],
    checkpointCriteria_vi: ["Hỏi ai có thể tham gia.", "Hỏi lịch hoặc phí.", "Hỏi bước đăng ký tiếp theo."],
    usefulLanguage: [
      { pa: "ਕੀ ਮੇਰਾ ਬੱਚਾ ਇਸ ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋ ਸਕਦਾ ਹੈ?", romanization: "ki mera bacha is program vich shamil ho sakda hai?", en: "Can my child join this program?", vi: "Con tôi có thể tham gia chương trình này không?" },
      { pa: "ਸਮਾਂ ਅਤੇ ਫੀਸ ਕੀ ਹੈ?", romanization: "sama ate fees ki hai?", en: "What are the time and fee?", vi: "Thời gian và phí là gì?" },
      { pa: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਕਿਵੇਂ ਕਰਨੀ ਹੈ?", romanization: "registration kiven karni hai?", en: "How do I register?", vi: "Tôi đăng ký bằng cách nào?" },
    ],
    qa: {
      prompt_en: "Ask about joining an after-school or community program.",
      prompt_vi: "Hỏi về việc tham gia chương trình sau giờ học hoặc chương trình cộng đồng.",
      modelAnswer: {
        pa: "ਕੀ ਮੇਰਾ ਬੱਚਾ ਇਸ ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋ ਸਕਦਾ ਹੈ? ਸਮਾਂ ਅਤੇ ਫੀਸ ਕੀ ਹੈ? ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਕਿਵੇਂ ਕਰਨੀ ਹੈ?",
        romanization: "ki mera bacha is program vich shamil ho sakda hai? sama ate fees ki hai? registration kiven karni hai?",
        en: "Can my child join this program? What are the time and fee? How do I register?",
        vi: "Con tôi có thể tham gia chương trình này không? Thời gian và phí là gì? Tôi đăng ký bằng cách nào?",
      },
      followUpQuestion: { pa: "ਕੀ ਫਾਰਮ ਆਨਲਾਈਨ ਹੈ?", romanization: "ki form online hai?", en: "Is the form online?", vi: "Mẫu đơn có trực tuyến không?" },
    },
    commonTraps: [
      {
        trap_en: "Asking only about the program but not registration.",
        trap_vi: "Chỉ hỏi về chương trình mà không hỏi đăng ký.",
        better: { pa: "ਰਜਿਸਟਰ ਕਰਨ ਲਈ ਕੀ ਚਾਹੀਦਾ ਹੈ?", romanization: "register karan lai ki chahida hai?", en: "What is needed to register?", vi: "Cần gì để đăng ký?" },
      },
    ],
    finalRoute_en: "If complete, route to B2 community participation tasks.",
    finalRoute_vi: "Nếu đầy đủ, chuyển sang nhiệm vụ tham gia cộng đồng B2.",
  },
  {
    id: "pa-b1-final-07-health-service-communication",
    level: "B1",
    focus: "health_service_communication",
    title_en: "Communicate health or service needs without advice claims",
    title_vi: "Trao đổi nhu cầu y tế hoặc dịch vụ mà không đưa ra tư vấn",
    reviewGoal_en: "Review symptom or service descriptions as language support only, not medical, legal, or service advice.",
    reviewGoal_vi: "Ôn mô tả triệu chứng hoặc dịch vụ chỉ như hỗ trợ ngôn ngữ, không phải tư vấn y tế, pháp lý hoặc dịch vụ.",
    canadaContext: "Useful for clinic desks, pharmacies, public counters, and appointment calls as language practice only.",
    checkpointCriteria_en: ["Describe symptom or need.", "State duration or urgency level in plain words.", "Ask for appointment or next step without giving advice."],
    checkpointCriteria_vi: ["Mô tả triệu chứng hoặc nhu cầu.", "Nêu thời gian kéo dài hoặc mức khẩn bằng từ đơn giản.", "Xin lịch hẹn hoặc bước tiếp theo mà không đưa lời khuyên."],
    usefulLanguage: [
      { pa: "ਮੈਨੂੰ ਦੋ ਦਿਨ ਤੋਂ ਖੰਘ ਹੈ।", romanization: "mainu do din ton khangh hai.", en: "I have had a cough for two days.", vi: "Tôi bị ho hai ngày rồi." },
      { pa: "ਮੈਂ ਅਪਾਇੰਟਮੈਂਟ ਲੈਣੀ ਚਾਹੁੰਦਾ ਹਾਂ।", romanization: "main appointment laini chahunda han.", en: "I want to make an appointment.", vi: "Tôi muốn đặt lịch hẹn." },
      { pa: "ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਦੱਸੋ ਜੀ।", romanization: "mainu agla kadam dasso ji.", en: "Please tell me the next step.", vi: "Vui lòng cho tôi biết bước tiếp theo." },
    ],
    qa: {
      prompt_en: "Tell a clinic desk about a cough and ask for an appointment. This is language practice only.",
      prompt_vi: "Nói với quầy phòng khám về ho và xin lịch hẹn. Đây chỉ là luyện ngôn ngữ.",
      modelAnswer: {
        pa: "ਮੈਨੂੰ ਦੋ ਦਿਨ ਤੋਂ ਖੰਘ ਹੈ। ਮੈਂ ਅਪਾਇੰਟਮੈਂਟ ਲੈਣੀ ਚਾਹੁੰਦਾ ਹਾਂ। ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਦੱਸੋ ਜੀ।",
        romanization: "mainu do din ton khangh hai. main appointment laini chahunda han. mainu agla kadam dasso ji.",
        en: "I have had a cough for two days. I want to make an appointment. Please tell me the next step.",
        vi: "Tôi bị ho hai ngày rồi. Tôi muốn đặt lịch hẹn. Vui lòng cho tôi biết bước tiếp theo.",
      },
      followUpQuestion: { pa: "ਕੀ ਕੋਈ ਫਾਰਮ ਭਰਨਾ ਹੈ?", romanization: "ki koi form bharna hai?", en: "Is there a form to fill out?", vi: "Có mẫu đơn nào cần điền không?" },
    },
    commonTraps: [
      {
        trap_en: "Giving medical advice or asking the language deck to decide what treatment is needed.",
        trap_vi: "Đưa lời khuyên y tế hoặc yêu cầu bộ thẻ ngôn ngữ quyết định cần điều trị gì.",
        better: { pa: "ਮੈਂ ਅਪਾਇੰਟਮੈਂਟ ਲੈਣੀ ਚਾਹੁੰਦਾ ਹਾਂ।", romanization: "main appointment laini chahunda han.", en: "I want to make an appointment.", vi: "Tôi muốn đặt lịch hẹn." },
      },
    ],
    finalRoute_en: "If language is clear, route to healthcare communication practice with safety limits.",
    finalRoute_vi: "Nếu ngôn ngữ rõ, chuyển sang luyện giao tiếp y tế có giới hạn an toàn.",
  },
  {
    id: "pa-b1-final-08-register-transfer-review",
    level: "B1",
    focus: "register_transfer_review",
    title_en: "Review register and transfer mistakes",
    title_vi: "Ôn mức lịch sự và lỗi chuyển di",
    reviewGoal_en: "Review common Vietnamese/English transfer mistakes and polite Punjabi requests.",
    reviewGoal_vi: "Ôn lỗi chuyển di thường gặp từ tiếng Việt/tiếng Anh và yêu cầu lịch sự trong Punjabi.",
    canadaContext: "Useful with supervisors, teachers, neighbours, staff, elders, and service workers.",
    checkpointCriteria_en: ["Use ਤੁਸੀਂ with unfamiliar adults.", "Soften requests with ਜੀ or ਕਿਰਪਾ ਕਰਕੇ.", "Keep Shahmukhi as awareness only, not a full course."],
    checkpointCriteria_vi: ["Dùng ਤੁਸੀਂ với người lớn chưa thân.", "Làm mềm yêu cầu bằng ਜੀ hoặc ਕਿਰਪਾ ਕਰਕੇ.", "Giữ Shahmukhi ở mức nhận biết, không phải khóa học đầy đủ."],
    usefulLanguage: [
      { pa: "ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ ਜੀ?", romanization: "ki tusin madad kar sakde ho ji?", en: "Could you help, please?", vi: "Bạn có thể vui lòng giúp không?" },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਦੁਬਾਰਾ ਸਮਝਾਓ।", romanization: "kirpa karke eh dubara samjhao.", en: "Please explain this again.", vi: "Vui lòng giải thích lại điều này." },
      { pa: "ਸ਼ਾਹਮੁਖੀ ਸਿਰਫ਼ ਜਾਣ-ਪਛਾਣ ਲਈ ਹੈ।", romanization: "Shahmukhi sirf jaan-pachhan lai hai.", en: "Shahmukhi is only for awareness.", vi: "Shahmukhi chỉ để nhận biết." },
    ],
    qa: {
      prompt_en: "Make a polite request to a staff member and mention script awareness correctly.",
      prompt_vi: "Đưa ra yêu cầu lịch sự với nhân viên và nhắc nhận biết chữ viết đúng cách.",
      modelAnswer: {
        pa: "ਮਾਫ਼ ਕਰਨਾ ਜੀ, ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ? ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਦੁਬਾਰਾ ਸਮਝਾਓ। ਸ਼ਾਹਮੁਖੀ ਸਿਰਫ਼ ਜਾਣ-ਪਛਾਣ ਲਈ ਹੈ।",
        romanization: "maaf karna ji, ki tusin madad kar sakde ho? kirpa karke eh dubara samjhao. Shahmukhi sirf jaan-pachhan lai hai.",
        en: "Excuse me, could you help? Please explain this again. Shahmukhi is only for awareness.",
        vi: "Xin lỗi, bạn có thể giúp không? Vui lòng giải thích lại điều này. Shahmukhi chỉ để nhận biết.",
      },
      followUpQuestion: { pa: "ਕੀ ਮੈਂ ਇੱਕ ਉਦਾਹਰਨ ਦੇ ਸਕਦਾ ਹਾਂ?", romanization: "ki main ikk udaharan de sakda han?", en: "Can I give an example?", vi: "Tôi có thể đưa một ví dụ không?" },
    },
    commonTraps: [
      {
        trap_en: "Using informal ਤੂੰ or direct command forms with staff.",
        trap_vi: "Dùng ਤੂੰ thân mật hoặc dạng mệnh lệnh trực tiếp với nhân viên.",
        better: { pa: "ਕੀ ਤੁਸੀਂ ਇਹ ਦੱਸ ਸਕਦੇ ਹੋ ਜੀ?", romanization: "ki tusin eh dass sakde ho ji?", en: "Could you tell me this, please?", vi: "Bạn có thể vui lòng cho tôi biết điều này không?" },
      },
    ],
    finalRoute_en: "If register is controlled, route to B2 professional and community interactions. Native review is deferred.",
    finalRoute_vi: "Nếu kiểm soát được mức lịch sự, chuyển sang tương tác chuyên nghiệp và cộng đồng B2. Phần người bản ngữ xem lại được để sau.",
  },
];
