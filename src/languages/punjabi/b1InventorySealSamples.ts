// src/languages/punjabi/b1InventorySealSamples.ts
//
// Punjabi B1 inventory seal samples for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary; romanization is a support bridge. Shahmukhi is
// mentioned only for awareness, not taught as a full course.
//
// Native review is deferred; this module makes no native-review claim.

export type PunjabiB1InventorySealFocus =
  | "explain_situation"
  | "retell_event"
  | "clarify_next_steps"
  | "service_recovery"
  | "issue_resolution"
  | "follow_up_message"
  | "workplace_housing_school_community"
  | "register_safe_repair"
  | "inventory_seal_signoff";

export type PunjabiInventorySealLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiInventorySealTrap = {
  trap_en: string;
  trap_vi: string;
  better: PunjabiInventorySealLine;
};

export type PunjabiInventorySealQA = {
  prompt_en: string;
  prompt_vi: string;
  modelAnswer: PunjabiInventorySealLine;
  followUpQuestion: PunjabiInventorySealLine;
};

export type PunjabiB1InventorySealCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1InventorySealFocus;
  title_en: string;
  title_vi: string;
  inventorySealPurpose_en: string;
  inventorySealPurpose_vi: string;
  canadaContext: string;
  checkpointCriteria_en: string[];
  checkpointCriteria_vi: string[];
  usefulLanguage: PunjabiInventorySealLine[];
  qa: PunjabiInventorySealQA;
  commonTraps: PunjabiInventorySealTrap[];
  inventorySealNote_en: string;
  inventorySealNote_vi: string;
};

export type PunjabiB1InventorySealScope = {
  level: "B1";
  note_en: string;
  note_vi: string;
  awareness_en: string;
  awareness_vi: string;
};

export const punjabiB1InventorySealScope: PunjabiB1InventorySealScope = {
  level: "B1",
  note_en:
    "Native review is deferred. This inventory seal keeps stable independent communication samples for later A11 use after catalog, bundle, and pre-integration checks.",
  note_vi:
    "Việc native review được hoãn lại. Kho lưu giữ này giữ các mẫu giao tiếp độc lập ổn định để dùng cho A11 sau này.",
  awareness_en:
    "Shahmukhi is awareness only here, not a full course or a conversion unit.",
  awareness_vi:
    "Shahmukhi ở đây chỉ để nhận biết, không phải một khóa đầy đủ hay một đơn vị chuyển đổi.",
};

export const punjabiB1InventorySealSamples: PunjabiB1InventorySealCard[] = [
  {
    id: "pa-b1-inventory-seal-01-explain-situation",
    level: "B1",
    focus: "explain_situation",
    title_en: "Explain a situation clearly",
    title_vi: "Giải thích tình huống rõ ràng",
    inventorySealPurpose_en: "Keep a stable sample for explaining an access problem, delay, or disruption without overexplaining.",
    inventorySealPurpose_vi: "Giữ mẫu ổn định để giải thích vấn đề truy cập, sự chậm trễ hoặc gián đoạn mà không giải thích dài dòng.",
    canadaContext: "Useful at a community centre desk, transit counter, or building office in Canada.",
    checkpointCriteria_en: ["State the problem.", "Add the practical impact.", "Ask for the next step politely."],
    checkpointCriteria_vi: ["Nêu vấn đề.", "Thêm tác động thực tế.", "Hỏi bước tiếp theo lịch sự."],
    usefulLanguage: [
      { pa: "ਮੇਰਾ ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।", romanization: "mera card kam nahin kar riha.", en: "My card is not working.", vi: "Thẻ của tôi không hoạt động." },
      { pa: "ਇਸ ਕਰਕੇ ਮੈਂ ਅੰਦਰ ਨਹੀਂ ਜਾ ਸਕਦਾ।", romanization: "is karke main andar nahin ja sakda.", en: "Because of this I cannot go inside.", vi: "Vì vậy tôi không thể vào trong." },
      { pa: "ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਦੱਸੋ ਜੀ।", romanization: "mainu agla kadam dasso ji.", en: "Please tell me the next step.", vi: "Vui lòng cho tôi biết bước tiếp theo." },
    ],
    qa: {
      prompt_en: "Your access card does not open the door at the community centre. Explain the situation and ask what to do.",
      prompt_vi: "Thẻ ra vào của bạn không mở được cửa ở trung tâm cộng đồng. Hãy giải thích tình huống và hỏi nên làm gì.",
      modelAnswer: {
        pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਮੇਰਾ ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ। ਇਸ ਕਰਕੇ ਮੈਂ ਅੰਦਰ ਨਹੀਂ ਜਾ ਸਕਦਾ। ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਦੱਸੋ ਜੀ।",
        romanization: "sat sri akal ji, mera card kam nahin kar riha. is karke main andar nahin ja sakda. mainu agla kadam dasso ji.",
        en: "Hello, my card is not working. Because of this I cannot go inside. Please tell me the next step.",
        vi: "Xin chào, thẻ của tôi không hoạt động. Vì vậy tôi không thể vào trong. Vui lòng cho tôi biết bước tiếp theo.",
      },
      followUpQuestion: {
        pa: "ਕੀ ਨਵਾਂ ਕਾਰਡ ਮਿਲ ਸਕਦਾ ਹੈ?",
        romanization: "ki nava card mil sakda hai?",
        en: "Can I get a new card?",
        vi: "Tôi có thể nhận thẻ mới không?",
      },
    },
    commonTraps: [
      {
        trap_en: "Only saying 'card problem' without the result.",
        trap_vi: "Chỉ nói 'vấn đề thẻ' mà không nói kết quả.",
        better: {
          pa: "ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰਦਾ, ਇਸ ਲਈ ਦਰਵਾਜ਼ਾ ਨਹੀਂ ਖੁੱਲਦਾ।",
          romanization: "card kam nahin karda, is lai darvaza nahin khulda.",
          en: "The card does not work, so the door does not open.",
          vi: "Thẻ không hoạt động, nên cửa không mở.",
        },
      },
    ],
    inventorySealNote_en: "Recorded as an inventory-seal-ready situation-explanation pattern for later review and reuse.",
    inventorySealNote_vi: "Được lưu như mẫu giải thích tình huống đơn giản để xem lại và dùng lại sau.",
  },
  {
    id: "pa-b1-inventory-seal-02-retell-event",
    level: "B1",
    focus: "retell_event",
    title_en: "Retell an event in order",
    title_vi: "Kể lại sự việc theo thứ tự",
    inventorySealPurpose_en: "Keep a short, stable sequence sample for late arrivals, transit delays, and schedule changes.",
    inventorySealPurpose_vi: "Giữ mẫu trình tự ngắn, ổn định cho việc đến muộn, trễ xe và thay đổi lịch.",
    canadaContext: "Useful for appointment offices, transit desks, school messages, and workplace updates in Canada.",
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
      followUpQuestion: {
        pa: "ਕੀ ਮੈਂ ਹੁਣ ਵੀ ਅੰਦਰ ਆ ਸਕਦਾ ਹਾਂ?",
        romanization: "ki main hun vi andar aa sakda han?",
        en: "Can I still come in now?",
        vi: "Bây giờ tôi vẫn có thể vào không?",
      },
    },
    commonTraps: [
      {
        trap_en: "Jumping between events without sequence words.",
        trap_vi: "Nhảy giữa các sự việc mà không dùng từ nối trình tự.",
        better: {
          pa: "ਪਹਿਲਾਂ..., ਫਿਰ..., ਇਸ ਕਰਕੇ...",
          romanization: "pahilan..., phir..., is karke...",
          en: "First..., then..., because of this...",
          vi: "Trước tiên..., sau đó..., vì vậy...",
        },
      },
    ],
    inventorySealNote_en: "Recorded as an inventory-seal-ready sequence model for messages, appointments, and quick follow-ups.",
    inventorySealNote_vi: "Được lưu như mẫu trình tự cho tin nhắn, cuộc hẹn và theo dõi nhanh.",
  },
  {
    id: "pa-b1-inventory-seal-03-clarify-next-steps",
    level: "B1",
    focus: "clarify_next_steps",
    title_en: "Clarify next steps",
    title_vi: "Làm rõ bước tiếp theo",
    inventorySealPurpose_en: "Keep a polite clarification sample for forms, deadlines, email follow-up, and written confirmation.",
    inventorySealPurpose_vi: "Giữ mẫu làm rõ lịch sự cho biểu mẫu, hạn chót, theo dõi email và xác nhận bằng văn bản.",
    canadaContext: "Useful for school offices, settlement agencies, clinics, and public counters in Canada.",
    checkpointCriteria_en: ["Ask them to repeat slowly.", "Confirm document, date, or place.", "Ask for text or email confirmation."],
    checkpointCriteria_vi: ["Xin họ nhắc lại chậm.", "Xác nhận giấy tờ, ngày hoặc địa điểm.", "Xin xác nhận qua tin nhắn hoặc email."],
    usefulLanguage: [
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਦੁਬਾਰਾ ਕਹੋ।", romanization: "kirpa karke hauli dubara kaho.", en: "Please say it again slowly.", vi: "Vui lòng nói lại chậm hơn." },
      { pa: "ਕੀ ਮਿਤੀ ਸੋਮਵਾਰ ਹੈ?", romanization: "ki miti somvaar hai?", en: "Is the date Monday?", vi: "Ngày đó là thứ Hai phải không?" },
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
      followUpQuestion: {
        pa: "ਕਿਹੜਾ ਦਸਤਾਵੇਜ਼ ਲਿਆਉਣਾ ਹੈ?",
        romanization: "kihra dastavez liauna hai?",
        en: "Which document should I bring?",
        vi: "Tôi nên mang giấy tờ nào?",
      },
    },
    commonTraps: [
      {
        trap_en: "Agreeing before checking the date or document.",
        trap_vi: "Đồng ý trước khi kiểm tra ngày hoặc giấy tờ.",
        better: {
          pa: "ਮਿਤੀ ਅਤੇ ਦਸਤਾਵੇਜ਼ ਫਿਰ ਦੱਸੋ ਜੀ।",
          romanization: "miti ate dastavez phir dasso ji.",
          en: "Please tell me the date and document again.",
          vi: "Vui lòng cho tôi biết lại ngày và giấy tờ.",
        },
      },
    ],
    inventorySealNote_en: "Recorded for safe clarification and written follow-up practice.",
    inventorySealNote_vi: "Được lưu để luyện làm rõ an toàn và theo dõi bằng văn bản.",
  },
  {
    id: "pa-b1-inventory-seal-04-service-recovery",
    level: "B1",
    focus: "service_recovery",
    title_en: "Recover after a service mistake",
    title_vi: "Khắc phục sau lỗi dịch vụ",
    inventorySealPurpose_en: "Keep a repair sample for wrong charges, missing bookings, or service errors that need correction.",
    inventorySealPurpose_vi: "Giữ mẫu sửa chữa cho phí sai, đặt chỗ bị thiếu hoặc lỗi dịch vụ cần được điều chỉnh.",
    canadaContext: "Useful for bank calls, transit refunds, library accounts, and customer-service follow-up in Canada.",
    checkpointCriteria_en: ["Describe the error.", "Ask what correction is possible.", "Ask for a reference number or timeline."],
    checkpointCriteria_vi: ["Mô tả lỗi.", "Hỏi có thể sửa gì.", "Hỏi số tham chiếu hoặc thời gian xử lý."],
    usefulLanguage: [
      { pa: "ਮੇਰੇ ਖਾਤੇ ਵਿੱਚ ਗਲਤ ਚਾਰਜ ਲੱਗਿਆ ਹੈ।", romanization: "mere khate vich galat charge laggia hai.", en: "A wrong charge was added to my account.", vi: "Tài khoản của tôi bị tính khoản phí sai." },
      { pa: "ਕੀ ਇਹ ਠੀਕ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?", romanization: "ki eh theek kita ja sakda hai?", en: "Can this be corrected?", vi: "Điều này có thể được sửa không?" },
      { pa: "ਮੈਨੂੰ ਰੈਫਰੈਂਸ ਨੰਬਰ ਦਿਓ ਜੀ।", romanization: "mainu reference number dio ji.", en: "Please give me a reference number.", vi: "Vui lòng cho tôi số tham chiếu." },
    ],
    qa: {
      prompt_en: "You notice an incorrect bank fee and want a correction timeline.",
      prompt_vi: "Bạn thấy một khoản phí ngân hàng sai và muốn biết thời gian sửa.",
      modelAnswer: {
        pa: "ਮਾਫ਼ ਕਰਨਾ ਜੀ, ਮੇਰੇ ਖਾਤੇ ਵਿੱਚ ਗਲਤ ਚਾਰਜ ਲੱਗਿਆ ਹੈ। ਕੀ ਇਹ ਠੀਕ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ? ਜੇ ਹਾਂ, ਮੈਨੂੰ ਰੈਫਰੈਂਸ ਨੰਬਰ ਦਿਓ ਜੀ।",
        romanization: "maaf karna ji, mere khate vich galat charge laggia hai. ki eh theek kita ja sakda hai? je han, mainu reference number dio ji.",
        en: "Sorry, a wrong charge was added to my account. Can this be corrected? If yes, please give me a reference number.",
        vi: "Xin lỗi, tài khoản của tôi bị tính khoản phí sai. Điều này có thể được sửa không? Nếu có, vui lòng cho tôi số tham chiếu.",
      },
      followUpQuestion: {
        pa: "ਠੀਕ ਹੋਣ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?",
        romanization: "theek hon vich kinna sama laggega?",
        en: "How long will it take to be corrected?",
        vi: "Sẽ mất bao lâu để sửa?",
      },
    },
    commonTraps: [
      {
        trap_en: "Sounding like you only want to complain, not resolve the error.",
        trap_vi: "Nghe như chỉ muốn than phiền chứ không muốn giải quyết lỗi.",
        better: {
          pa: "ਮੈਂ ਇਹ ਠੀਕ ਕਰਵਾਉਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
          romanization: "main eh theek karvauna chahunda han.",
          en: "I want to get this corrected.",
          vi: "Tôi muốn việc này được sửa.",
        },
      },
    ],
    inventorySealNote_en: "Recorded as a service-recovery script for correction, timing, and reference tracking.",
    inventorySealNote_vi: "Được lưu như kịch bản khắc phục dịch vụ cho sửa lỗi, thời gian xử lý và theo dõi tham chiếu.",
  },
  {
    id: "pa-b1-inventory-seal-05-issue-resolution",
    level: "B1",
    focus: "issue_resolution",
    title_en: "Resolve a practical issue",
    title_vi: "Giải quyết một vấn đề thực tế",
    inventorySealPurpose_en: "Keep a repair-and-resolution sample for housing, delivery, and workplace issues that need a concrete fix.",
    inventorySealPurpose_vi: "Giữ mẫu sửa chữa và giải quyết cho vấn đề nhà ở, giao hàng và công việc cần giải pháp cụ thể.",
    canadaContext: "Useful for landlord, delivery, warehouse, and workplace conversations in Canada.",
    checkpointCriteria_en: ["Name where the problem is.", "State what has already happened.", "Ask for the repair or replacement step."],
    checkpointCriteria_vi: ["Nêu chỗ có vấn đề.", "Nói điều gì đã xảy ra.", "Hỏi bước sửa hoặc thay thế."],
    usefulLanguage: [
      { pa: "ਸਿੰਕ ਹੇਠਾਂ ਪਾਣੀ ਲੀਕ ਹੋ ਰਿਹਾ ਹੈ।", romanization: "sink hethan paani leak ho riha hai.", en: "Water is leaking under the sink.", vi: "Nước đang rò dưới bồn rửa." },
      { pa: "ਪੈਕਜ ਟੁੱਟਿਆ ਹੋਇਆ ਆਇਆ ਸੀ।", romanization: "package tuttia hoya aaya si.", en: "The package arrived damaged.", vi: "Kiện hàng đến trong tình trạng bị hư." },
      { pa: "ਮੈਨੂੰ ਬਦਲੀ ਚਾਹੀਦੀ ਹੈ ਜੀ।", romanization: "mainu badli chahidi hai ji.", en: "I need a replacement, please.", vi: "Tôi cần một món thay thế, vui lòng." },
    ],
    qa: {
      prompt_en: "A package arrived damaged and you want the next step.",
      prompt_vi: "Một kiện hàng đến bị hư và bạn muốn biết bước tiếp theo.",
      modelAnswer: {
        pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਪੈਕਜ ਟੁੱਟਿਆ ਹੋਇਆ ਆਇਆ ਸੀ। ਮੈਨੂੰ ਬਦਲੀ ਚਾਹੀਦੀ ਹੈ ਜੀ। ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ।",
        romanization: "sat sri akal ji, package tuttia hoya aaya si. mainu badli chahidi hai ji. kirpa karke agla kadam dasso.",
        en: "Hello, the package arrived damaged. I need a replacement, please. Please tell me the next step.",
        vi: "Xin chào, kiện hàng đến bị hư. Tôi cần một món thay thế, vui lòng. Vui lòng cho tôi biết bước tiếp theo.",
      },
      followUpQuestion: {
        pa: "ਕੀ ਮੈਂ ਫੋਟੋ ਭੇਜਾਂ?",
        romanization: "ki main photo bhejan?",
        en: "Should I send a photo?",
        vi: "Tôi có nên gửi ảnh không?",
      },
    },
    commonTraps: [
      {
        trap_en: "Stopping after naming the problem.",
        trap_vi: "Dừng lại sau khi nêu vấn đề.",
        better: {
          pa: "ਪੈਕਜ ਟੁੱਟਿਆ ਹੈ, ਇਸ ਲਈ ਬਦਲੀ ਚਾਹੀਦੀ ਹੈ।",
          romanization: "package tuttia hai, is lai badli chahidi hai.",
          en: "The package is damaged, so I need a replacement.",
          vi: "Kiện hàng bị hư, nên tôi cần một món thay thế.",
        },
      },
    ],
    inventorySealNote_en: "Recorded for practical fix language across housing, delivery, and workplace settings.",
    inventorySealNote_vi: "Được lưu cho ngôn ngữ sửa lỗi thực tế ở bối cảnh nhà ở, giao hàng và công việc.",
  },
  {
    id: "pa-b1-inventory-seal-06-follow-up-message",
    level: "B1",
    focus: "follow_up_message",
    title_en: "Send a follow-up message",
    title_vi: "Gửi tin nhắn theo dõi",
    inventorySealPurpose_en: "Keep a clean follow-up sample for email, text, and short written summaries after a conversation.",
    inventorySealPurpose_vi: "Giữ mẫu theo dõi gọn cho email, tin nhắn và tóm tắt ngắn sau cuộc trò chuyện.",
    canadaContext: "Useful after talking to a school office, landlord, employer, or service desk in Canada.",
    checkpointCriteria_en: ["Summarize the issue.", "Repeat the agreed next step.", "Ask for written confirmation."],
    checkpointCriteria_vi: ["Tóm tắt vấn đề.", "Nhắc lại bước tiếp theo đã thống nhất.", "Xin xác nhận bằng văn bản."],
    usefulLanguage: [
      { pa: "ਅੱਜ ਗੱਲ ਕਰਨ ਲਈ ਧੰਨਵਾਦ।", romanization: "ajj gall karan lai dhanvaad.", en: "Thank you for speaking today.", vi: "Cảm ơn bạn đã trao đổi hôm nay." },
      { pa: "ਅਸੀਂ ਇਹ ਕਰਨਾ ਤੈਅ ਕੀਤਾ।", romanization: "asin eh karna tay kita.", en: "We agreed to do this.", vi: "Chúng ta đã thống nhất sẽ làm việc này." },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਲਿਖਤੀ ਪੁਸ਼ਟੀ ਭੇਜੋ।", romanization: "kirpa karke likhti pushti bhejo.", en: "Please send written confirmation.", vi: "Vui lòng gửi xác nhận bằng văn bản." },
    ],
    qa: {
      prompt_en: "Write a short follow-up after a housing repair call.",
      prompt_vi: "Viết một tin theo dõi ngắn sau cuộc gọi sửa nhà.",
      modelAnswer: {
        pa: "ਅੱਜ ਗੱਲ ਕਰਨ ਲਈ ਧੰਨਵਾਦ। ਅਸੀਂ ਕੱਲ੍ਹ ਮੁਰੰਮਤ ਕਰਨਾ ਤੈਅ ਕੀਤਾ। ਕਿਰਪਾ ਕਰਕੇ ਲਿਖਤੀ ਪੁਸ਼ਟੀ ਭੇਜੋ।",
        romanization: "ajj gall karan lai dhanvaad. asin kallh murammat karna tay kita. kirpa karke likhti pushti bhejo.",
        en: "Thank you for speaking today. We agreed to do the repair tomorrow. Please send written confirmation.",
        vi: "Cảm ơn vì đã nói chuyện hôm nay. Chúng ta đã thống nhất sửa vào ngày mai. Vui lòng gửi xác nhận bằng văn bản.",
      },
      followUpQuestion: {
        pa: "ਕੀ ਤੁਸੀਂ ਸਮਾਂ ਵੀ ਲਿਖੋਗੇ?",
        romanization: "ki tusin sama vi likhoge?",
        en: "Will you write the time too?",
        vi: "Bạn có ghi cả giờ không?",
      },
    },
    commonTraps: [
      {
        trap_en: "Sending a vague message with no agreed step.",
        trap_vi: "Gửi tin mơ hồ mà không có bước đã thống nhất.",
        better: {
          pa: "ਅਸੀਂ ਕੱਲ੍ਹ ਮੁਰੰਮਤ ਕਰਨਾ ਤੈਅ ਕੀਤਾ ਹੈ।",
          romanization: "asin kallh murammat karna tay kita hai.",
          en: "We agreed to do the repair tomorrow.",
          vi: "Chúng ta đã thống nhất sửa vào ngày mai.",
        },
      },
    ],
    inventorySealNote_en: "Recorded as a concise follow-up template for written records and reminders.",
    inventorySealNote_vi: "Được lưu như mẫu theo dõi ngắn gọn cho hồ sơ viết và lời nhắc.",
  },
  {
    id: "pa-b1-inventory-seal-07-workplace-housing-school-community",
    level: "B1",
    focus: "workplace_housing_school_community",
    title_en: "Move between workplace, housing, school, and community tasks",
    title_vi: "Chuyển giữa nhiệm vụ nơi làm việc, nhà ở, trường học và cộng đồng",
    inventorySealPurpose_en: "Keep one flexible sample for cross-setting coordination when the same issue follows you across places.",
    inventorySealPurpose_vi: "Giữ một mẫu linh hoạt cho phối hợp nhiều bối cảnh khi cùng một vấn đề đi theo bạn qua nhiều nơi.",
    canadaContext: "Useful for Canadian newcomers who need one polite pattern for employers, schools, landlords, and community staff.",
    checkpointCriteria_en: ["Name the setting.", "State the issue briefly.", "Ask for the next practical action."],
    checkpointCriteria_vi: ["Nêu bối cảnh.", "Nói ngắn gọn vấn đề.", "Hỏi hành động thực tế tiếp theo."],
    usefulLanguage: [
      { pa: "ਕੰਮ ਤੇ ਮੈਨੂੰ ਹੋਰ ਸਮਾਂ ਚਾਹੀਦਾ ਹੈ।", romanization: "kamm te mainu hor sama chahida hai.", en: "At work I need more time.", vi: "Ở chỗ làm tôi cần thêm thời gian." },
      { pa: "ਘਰ ਵਿੱਚ ਲੀਕ ਦੀ ਮੁਰੰਮਤ ਚਾਹੀਦੀ ਹੈ।", romanization: "ghar vich leak di murammat chahidi hai.", en: "At home I need the leak repaired.", vi: "Ở nhà tôi cần sửa chỗ rò." },
      { pa: "ਸਕੂਲ ਤੋਂ ਫਾਰਮ ਕਦੋਂ ਮਿਲੇਗਾ?", romanization: "school ton form kadon milega?", en: "When will the form come from the school?", vi: "Khi nào tôi sẽ nhận được mẫu từ trường?" },
    ],
    qa: {
      prompt_en: "You need one short message that works for a landlord, school office, or supervisor.",
      prompt_vi: "Bạn cần một tin nhắn ngắn có thể dùng cho chủ nhà, văn phòng trường hoặc quản lý.",
      modelAnswer: {
        pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਮੈਨੂੰ ਅਗਲਾ ਕਦਮ ਦੱਸੋ। ਮੈਂ ਕੰਮ, ਘਰ, ਜਾਂ ਸਕੂਲ ਵਾਲੀ ਗੱਲ ਅਨੁਸਾਰ ਅਪਡੇਟ ਦੇ ਸਕਦਾ ਹਾਂ।",
        romanization: "sat sri akal ji, mainu agla kadam dasso. main kamm, ghar, jaan school wali gall anusaar update de sakda han.",
        en: "Hello, please tell me the next step. I can give an update depending on whether this is work, home, or school related.",
        vi: "Xin chào, vui lòng cho tôi biết bước tiếp theo. Tôi có thể cập nhật tùy theo việc này là ở công việc, nhà ở hay trường học.",
      },
      followUpQuestion: {
        pa: "ਕੀ ਤੁਸੀਂ ਇਸਨੂੰ ਲਿਖਤੀ ਰੂਪ ਵਿੱਚ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin isnu likhti roop vich bhej sakde ho?",
        en: "Can you send it in writing?",
        vi: "Bạn có thể gửi bằng văn bản không?",
      },
    },
    commonTraps: [
      {
        trap_en: "Using one setting's details in the wrong place.",
        trap_vi: "Dùng chi tiết của bối cảnh này sang bối cảnh khác không phù hợp.",
        better: {
          pa: "ਹਰ ਥਾਂ ਲਈ ਗੱਲ ਵੱਖਰੀ ਰੱਖੋ ਜੀ।",
          romanization: "har tha lai gall vakhri rakho ji.",
          en: "Keep the message separate for each place.",
          vi: "Hãy tách thông điệp theo từng nơi.",
        },
      },
    ],
    inventorySealNote_en: "Recorded as a cross-setting coordination pattern for Canadian daily life.",
    inventorySealNote_vi: "Được lưu như mẫu phối hợp nhiều bối cảnh cho đời sống hằng ngày ở Canada.",
  },
  {
    id: "pa-b1-inventory-seal-08-register-safe-repair",
    level: "B1",
    focus: "register_safe_repair",
    title_en: "Repair a too-direct message",
    title_vi: "Sửa một câu quá trực diện",
    inventorySealPurpose_en: "Keep a register-safe repair sample so a blunt line can be turned into a polite request.",
    inventorySealPurpose_vi: "Giữ mẫu sửa mức độ lịch sự để một câu quá thẳng có thể đổi thành yêu cầu lịch sự.",
    canadaContext: "Useful when speaking to a receptionist, teacher, landlord, or supervisor in Canada.",
    checkpointCriteria_en: ["Replace blunt wording.", "Keep the request concrete.", "Stay polite without becoming vague."],
    checkpointCriteria_vi: ["Thay cách nói quá thẳng.", "Giữ yêu cầu cụ thể.", "Lịch sự nhưng không mơ hồ."],
    usefulLanguage: [
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਸਮਝਾ ਦਿਓ।", romanization: "kirpa karke eh samjha dio.", en: "Please explain this.", vi: "Vui lòng giải thích điều này." },
      { pa: "ਮੈਂ ਥੋੜ੍ਹੀ ਸਪਸ਼ਟੀਕਰਨ ਚਾਹੁੰਦਾ ਹਾਂ।", romanization: "main thodi spashtikaran chahunda han.", en: "I want a little clarification.", vi: "Tôi muốn làm rõ thêm một chút." },
      { pa: "ਕੀ ਤੁਸੀਂ ਇਹ ਆਹਿਸਤਾ ਕਹਿ ਸਕਦੇ ਹੋ?", romanization: "ki tusin eh ahista keh sakde ho?", en: "Can you say this more gently/slowly?", vi: "Bạn có thể nói điều này chậm và nhẹ nhàng hơn không?" },
    ],
    qa: {
      prompt_en: "Repair a blunt sentence into a polite request for a teacher.",
      prompt_vi: "Sửa một câu quá thẳng thành yêu cầu lịch sự với giáo viên.",
      modelAnswer: {
        pa: "ਮੈਨੂੰ ਇਹ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਸਮਝਾ ਦਿਓ।",
        romanization: "mainu eh samajh nahin aaya. kirpa karke eh samjha dio.",
        en: "I did not understand this. Please explain it.",
        vi: "Tôi chưa hiểu điều này. Vui lòng giải thích giúp tôi.",
      },
      followUpQuestion: {
        pa: "ਕੀ ਤੁਸੀਂ ਇੱਕ ਉਦਾਹਰਨ ਦੇ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin ikk udaharan de sakde ho?",
        en: "Can you give one example?",
        vi: "Bạn có thể cho một ví dụ không?",
      },
    },
    commonTraps: [
      {
        trap_en: "Keeping the sentence polite but too empty to act on.",
        trap_vi: "Giữ câu lịch sự nhưng quá chung chung nên không thể làm gì.",
        better: {
          pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਸਮਝਾ ਦਿਓ ਅਤੇ ਇੱਕ ਉਦਾਹਰਨ ਵੀ ਦਿਓ।",
          romanization: "kirpa karke eh samjha dio ate ikk udaharan vi dio.",
          en: "Please explain this and give one example.",
          vi: "Vui lòng giải thích điều này và cho một ví dụ.",
        },
      },
    ],
    inventorySealNote_en: "Recorded for register repair, where a direct line becomes a usable polite request.",
    inventorySealNote_vi: "Được lưu cho sửa mức độ lịch sự, nơi một câu trực diện trở thành yêu cầu lịch sự có thể dùng được.",
  },
  {
    id: "pa-b1-inventory-seal-09-inventory-seal-signoff",
    level: "B1",
    focus: "inventory_seal_signoff",
    title_en: "Close and seal the inventory sample",
    title_vi: "Kết và đóng gói mẫu lưu trữ",
    inventorySealPurpose_en: "Keep a pre-A11 inventory-seal signoff sample that mentions catalog, bundle, pre-integration sealing, handoff, and stable reuse.",
    inventorySealPurpose_vi: "Giữ mẫu signoff kiểm kê trước A11 có nhắc đến danh mục, bộ gói, đóng gói trước tích hợp, bàn giao và dùng lại ổn định.",
    canadaContext: "Useful when preparing a final note for a team lead, teacher, landlord, or coordinator in Canada.",
    checkpointCriteria_en: ["Say the sample is ready.", "Name the inventory seal or handoff step.", "Ask for the final confirmation."],
    checkpointCriteria_vi: ["Nói mẫu đã sẵn sàng.", "Nêu bước kiểm kê/đóng gói hoặc bàn giao.", "Xin xác nhận cuối cùng."],
    usefulLanguage: [
      { pa: "ਇਹ ਨਮੂਨਾ ਇਨਵੈਂਟਰੀ ਸੀਲ ਲਈ ਤਿਆਰ ਹੈ।", romanization: "eh namuna inventory seal lai tayar hai.", en: "This sample is ready for the inventory seal.", vi: "Mẫu này đã sẵn sàng cho phần kiểm kê đóng gói." },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਸਾਈਨ-ਆਫ਼ ਕਰੋ ਜੀ।", romanization: "kirpa karke sign-off karo ji.", en: "Please sign off on it.", vi: "Vui lòng xác nhận hoàn tất." },
      { pa: "ਸ਼ਾਹਮੁਖੀ ਸਿਰਫ਼ ਅਵੈਰਨੈੱਸ ਲਈ ਹੈ।", romanization: "shahmukhi sirf awareness lai hai.", en: "Shahmukhi is for awareness only.", vi: "Shahmukhi chỉ để nhận biết." },
    ],
    qa: {
      prompt_en: "Close the sample with a final handoff note.",
      prompt_vi: "Kết mẫu bằng một ghi chú bàn giao cuối cùng.",
      modelAnswer: {
        pa: "ਇਹ ਨਮੂਨਾ ਇਨਵੈਂਟਰੀ ਸੀਲ ਲਈ ਤਿਆਰ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਸਾਈਨ-ਆਫ਼ ਕਰੋ ਜੀ ਅਤੇ ਅਗਲਾ ਪੜਾਅ ਸ਼ੁਰੂ ਕਰੋ।",
        romanization: "eh namuna inventory seal lai tayar hai. kirpa karke sign-off karo ji ate agla parra shuru karo.",
        en: "This sample is ready for the inventory seal. Please sign off and start the next stage.",
        vi: "Mẫu này đã sẵn sàng cho phần kiểm kê đóng gói. Vui lòng xác nhận hoàn tất và bắt đầu giai đoạn tiếp theo.",
      },
      followUpQuestion: {
        pa: "ਕੀ ਮੈਂ ਇਹ ਬੰਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
        romanization: "ki main eh band kar sakda han?",
        en: "Can I close this out?",
        vi: "Tôi có thể đóng mục này không?",
      },
    },
    commonTraps: [
      {
        trap_en: "Treating the inventory seal note like a live operational instruction.",
        trap_vi: "Xem ghi chú kiểm kê đóng gói như hướng dẫn vận hành trực tiếp.",
        better: {
          pa: "ਇਹ ਇਨਵੈਂਟਰੀ ਸੀਲ ਨੋਟ ਹੈ, ਲਾਈਵ ਹਦਾਇਤ ਨਹੀਂ।",
          romanization: "eh inventory seal note hai, live hadait nahin.",
          en: "This is an inventory seal note, not a live instruction.",
          vi: "Đây là ghi chú kiểm kê đóng gói, không phải hướng dẫn trực tiếp.",
        },
      },
    ],
    inventorySealNote_en: "Recorded as the pre-A11 handoff and seal point for this compact B1 inventory seal pack.",
    inventorySealNote_vi: "Được lưu như điểm bàn giao và đóng gói trước A11 cho bộ B1 ngắn gọn này.",
  },
];
