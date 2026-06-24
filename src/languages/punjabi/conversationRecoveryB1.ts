export type PunjabiB1ConversationRecoveryFocus =
  | "recover_after_misunderstanding"
  | "ask_for_clarification"
  | "restate_issue"
  | "repair_tone"
  | "continue_service_conversation"
  | "continue_workplace_conversation"
  | "continue_housing_conversation"
  | "continue_school_community_conversation"
  | "register_mistake_repair";

export type PunjabiConversationRecoveryLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiConversationRecoveryTrap = {
  trap_en: string;
  trap_vi: string;
  repair: PunjabiConversationRecoveryLine;
};

export type PunjabiConversationRecoveryPack = {
  finalHardeningPrompt_en: string;
  finalHardeningPrompt_vi: string;
  recoveryLine: PunjabiConversationRecoveryLine;
  recoverySignals_en: string[];
  recoverySignals_vi: string[];
};

export type PunjabiB1ConversationRecoveryCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1ConversationRecoveryFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  recoveryPack: PunjabiConversationRecoveryPack;
  commonTraps: PunjabiConversationRecoveryTrap[];
  exportReadiness_en: string;
  exportReadiness_vi: string;
  finalQa_en: string;
  finalQa_vi: string;
};

export const punjabiB1ConversationRecovery: PunjabiB1ConversationRecoveryCard[] = [
  {
    id: "b1-recovery-service-clarify",
    level: "B1",
    focus: "ask_for_clarification",
    title_en: "Recover after a service misunderstanding",
    title_vi: "Phục hồi sau một hiểu lầm ở dịch vụ",
    scenario_en:
      "A front desk answer was confusing and you need to ask again without sounding rude.",
    scenario_vi:
      "Câu trả lời ở quầy dịch vụ gây khó hiểu và bạn cần hỏi lại mà không nghe thô lỗ.",
    canadaContext:
      "Useful for Canadian service counters, libraries, and phone support calls.",
    recoveryPack: {
      finalHardeningPrompt_en:
        "Ask for a clearer explanation and keep the conversation moving.",
      finalHardeningPrompt_vi:
        "Hỏi giải thích rõ hơn và giữ cuộc hội thoại tiếp tục.",
      recoveryLine: {
        pa: "ਮੈਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸਮਝ ਨਹੀਂ ਆਈ। ਕੀ ਤੁਸੀਂ ਹੋਰ ਸਪਸ਼ਟ ਦੱਸ ਸਕਦੇ ਹੋ?",
        romanization:
          "mainu poori tarah samajh nahin aai. ki tusin hor spasht dass sakde ho?",
        en: "I did not fully understand. Can you explain more clearly?",
        vi: "Tôi chưa hiểu hoàn toàn. Bạn có thể giải thích rõ hơn không?",
      },
      recoverySignals_en: [
        "Acknowledges confusion",
        "Requests clarity",
        "Keeps a calm tone",
      ],
      recoverySignals_vi: [
        "Thừa nhận chưa hiểu",
        "Yêu cầu rõ hơn",
        "Giữ giọng bình tĩnh",
      ],
    },
    commonTraps: [
      {
        trap_en: "Pretending to understand and moving on too fast.",
        trap_vi: "Giả vờ hiểu rồi đi tiếp quá nhanh.",
        repair: {
          pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਕ ਵਾਰ ਫਿਰ ਸਮਝਾ ਦਿਓ।",
          romanization: "kirpa karke ik var phir samjha dio.",
          en: "Please explain it once more.",
          vi: "Vui lòng giải thích lại một lần nữa.",
        },
      },
    ],
    exportReadiness_en:
      "Language practice only, not medical advice. Final-hardening is ready for export if the learner can recover politely and keep the turn open.",
    exportReadiness_vi:
      "Sẵn sàng xuất nếu người học có thể phục hồi lịch sự và giữ lượt nói mở.",
    finalQa_en:
      "Final-QA checks clarity recovery, polite repair, and Gurmukhi-first output.",
    finalQa_vi:
      "Kiểm tra cuối xác minh phục hồi độ rõ, sửa lịch sự và đầu ra Gurmukhi là chính.",
  },
  {
    id: "b1-recovery-workplace-restatement",
    level: "B1",
    focus: "restate_issue",
    title_en: "Restate a workplace issue",
    title_vi: "Nói lại vấn đề ở nơi làm việc",
    scenario_en:
      "A coworker misunderstood your task and you need to restate the issue clearly.",
    scenario_vi:
      "Đồng nghiệp hiểu sai nhiệm vụ của bạn và bạn cần nói lại vấn đề cho rõ.",
    canadaContext:
      "Useful for Canadian retail, warehouse, office, and food-service shifts.",
    recoveryPack: {
      finalHardeningPrompt_en:
        "Restate the task and keep the tone neutral, not blaming.",
      finalHardeningPrompt_vi:
        "Nói lại nhiệm vụ và giữ giọng trung lập, không đổ lỗi.",
      recoveryLine: {
        pa: "ਮੇਰਾ ਮਤਲਬ ਇਹ ਕੰਮ ਸੀ, ਉਹ ਨਹੀਂ।",
        romanization: "mera matlab ih kamm si, oh nahin.",
        en: "I meant this task, not that one.",
        vi: "Ý tôi là việc này, không phải việc kia.",
      },
      recoverySignals_en: [
        "Corrects the misunderstanding",
        "Names the intended task",
        "Stays neutral",
      ],
      recoverySignals_vi: [
        "Sửa hiểu lầm",
        "Nêu nhiệm vụ dự định",
        "Giữ trung lập",
      ],
    },
    commonTraps: [
      {
        trap_en: "Using blame language instead of a clear correction.",
        trap_vi: "Dùng lời đổ lỗi thay vì sửa lại rõ ràng.",
        repair: {
          pa: "ਅਸੀਂ ਸ਼ਾਇਦ ਗਲਤ ਸਮਝੇ ਹਾਂ।",
          romanization: "asin shayad galat samjhe han.",
          en: "We may have misunderstood each other.",
          vi: "Có lẽ chúng ta đã hiểu lầm nhau.",
        },
      },
    ],
    exportReadiness_en:
      "language practice only, not legal or financial advice. Final-hardening is ready when the correction is brief, factual, and low-friction.",
    exportReadiness_vi:
      "Sẵn sàng xuất khi lời sửa ngắn, mang tính факт và ít va chạm.",
    finalQa_en:
      "Final-QA checks task restatement, neutral tone, and practical workplace flow.",
    finalQa_vi:
      "Kiểm tra cuối xác minh nói lại nhiệm vụ, giọng trung lập và luồng công việc thực tế.",
  },
  {
    id: "b1-recovery-housing-repair",
    level: "B1",
    focus: "continue_housing_conversation",
    title_en: "Continue a housing repair conversation",
    title_vi: "Tiếp tục cuộc trò chuyện sửa chữa nhà ở",
    scenario_en:
      "A repair was delayed and you need to follow up without sounding harsh.",
    scenario_vi:
      "Việc sửa chữa bị chậm và bạn cần theo dõi mà không nghe gắt.",
    canadaContext:
      "Useful for Canadian tenant and building-management conversations.",
    recoveryPack: {
      finalHardeningPrompt_en:
        "Ask for the update and keep the repair conversation open.",
      finalHardeningPrompt_vi:
        "Hỏi cập nhật và giữ cuộc trò chuyện sửa chữa tiếp tục.",
      recoveryLine: {
        pa: "ਮੈਨੂੰ ਹਾਲੇ ਅਪਡੇਟ ਨਹੀਂ ਮਿਲੀ। ਕੀ ਤੁਸੀਂ ਮੈਨੂੰ ਦੱਸ ਸਕਦੇ ਹੋ ਕਿ ਇਹ ਕਦੋਂ ਹੋਵੇਗਾ?",
        romanization:
          "mainu hale update nahin mili. ki tusin mainu dass sakde ho ki ih kadon hovega?",
        en: "I have not received an update yet. Can you tell me when it will happen?",
        vi: "Tôi هنوز chưa nhận được cập nhật. Bạn có thể cho tôi biết khi nào việc này sẽ diễn ra không?",
      },
      recoverySignals_en: [
        "Names the missing update",
        "Refers to the original repair",
        "Asks for timing",
      ],
      recoverySignals_vi: [
        "Nêu việc thiếu cập nhật",
        "Nhắc sửa chữa ban đầu",
        "Hỏi thời gian",
      ],
    },
    commonTraps: [
      {
        trap_en: "Threatening before asking for the status.",
        trap_vi: "Dọa trước khi hỏi tình trạng.",
        repair: {
          pa: "ਮੈਂ ਸਿਰਫ਼ ਅਪਡੇਟ ਚਾਹੁੰਦਾ ਹਾਂ।",
          romanization: "main sirf update chahunda han.",
          en: "I only want an update.",
          vi: "Tôi chỉ muốn một bản cập nhật.",
        },
      },
    ],
    exportReadiness_en:
      "Final-hardening should confirm the recovery remains factual and calm.",
    exportReadiness_vi:
      "Hoàn thiện cuối cần xác nhận cách phục hồi vẫn фактичес and bình tĩnh.",
    finalQa_en:
      "Final-QA checks housing clarity, timing, and respectful follow-up wording.",
    finalQa_vi:
      "Kiểm tra cuối xác minh độ rõ về nhà ở, thời gian và lời theo dõi tôn trọng.",
  },
  {
    id: "b1-recovery-service-repair-tone",
    level: "B1",
    focus: "repair_tone",
    title_en: "Repair a rough tone in service talk",
    title_vi: "Sửa giọng gắt trong hội thoại dịch vụ",
    scenario_en:
      "Your first message sounded sharp, so you need to soften it and continue the service conversation.",
    scenario_vi:
      "Tin nhắn đầu của bạn nghe gắt, nên bạn cần làm mềm nó và tiếp tục hội thoại dịch vụ.",
    canadaContext:
      "Useful for Canadian service counters, phone support calls, and billing conversations.",
    recoveryPack: {
      finalHardeningPrompt_en:
        "Rewrite the message so it sounds calm and polite.",
      finalHardeningPrompt_vi:
        "Viết lại tin nhắn để nghe bình tĩnh và lịch sự.",
      recoveryLine: {
        pa: "ਮਾਫ ਕਰਨਾ ਜੀ, ਮੈਂ ਸ਼ਾਂਤੀ ਨਾਲ ਸਮਝਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
        romanization:
          "maf karna ji, main shanti nal samajhna chahunda han.",
        en: "Sorry, I want to understand this calmly.",
        vi: "Xin lỗi ạ, tôi muốn hiểu việc này một cách bình tĩnh.",
      },
      recoverySignals_en: [
        "Tone is softened",
        "Respect is restored",
        "Conversation can continue",
      ],
      recoverySignals_vi: [
        "Giọng được làm mềm",
        "Sự tôn trọng được khôi phục",
        "Cuộc trò chuyện có thể tiếp tục",
      ],
    },
    commonTraps: [
      {
        trap_en: "Keeping the sharp wording after noticing the problem.",
        trap_vi: "Giữ cách nói gắt sau khi đã thấy vấn đề.",
        repair: {
          pa: "ਕਿਰਪਾ ਕਰਕੇ ਸ਼ਾਂਤੀ ਨਾਲ ਇਹ ਸਮਝਾ ਦਿਓ।",
          romanization: "kirpa karke shanti nal ih samjha dio.",
          en: "Please explain this calmly.",
          vi: "Vui lòng giải thích điều này một cách bình tĩnh.",
        },
      },
    ],
    exportReadiness_en:
      "Final-hardening is ready when the tone is softened and the request is still clear.",
    exportReadiness_vi:
      "Hoàn thiện cuối sẵn sàng khi giọng nói được làm mềm mà yêu cầu vẫn rõ.",
    finalQa_en:
      "Final-QA checks tone repair, calm service wording, and Gurmukhi-first output.",
    finalQa_vi:
      "Kiểm tra cuối xác minh sửa giọng, cách nói dịch vụ bình tĩnh và đầu ra Gurmukhi là chính.",
  },
  {
    id: "b1-recovery-workplace-continue",
    level: "B1",
    focus: "continue_workplace_conversation",
    title_en: "Continue a workplace conversation",
    title_vi: "Tiếp tục cuộc trò chuyện nơi làm việc",
    scenario_en:
      "A task explanation was interrupted and you need to continue it clearly at work.",
    scenario_vi:
      "Phần giải thích nhiệm vụ bị ngắt và bạn cần tiếp tục rõ ràng ở nơi làm việc.",
    canadaContext:
      "Useful for Canadian retail, warehouse, office, and food-service shifts.",
    recoveryPack: {
      finalHardeningPrompt_en:
        "Continue the task explanation without sounding frustrated.",
      finalHardeningPrompt_vi:
        "Tiếp tục giải thích nhiệm vụ mà không nghe bực bội.",
      recoveryLine: {
        pa: "ਮੈਂ ਗੱਲ ਪੂਰੀ ਕਰ ਦਿਆਂ? ਹੁਣ ਅਗਲਾ ਹਿੱਸਾ ਇਹ ਹੈ।",
        romanization: "main gall poori kar dian? hun agla hissa ih hai.",
        en: "Can I finish? The next part is this.",
        vi: "Tôi có thể nói xong không? Phần tiếp theo là thế này.",
      },
      recoverySignals_en: [
        "Asks to finish speaking",
        "Resumes the task explanation",
        "Stays calm",
      ],
      recoverySignals_vi: [
        "Xin hoàn tất lượt nói",
        "Tiếp tục giải thích nhiệm vụ",
        "Giữ bình tĩnh",
      ],
    },
    commonTraps: [
      {
        trap_en: "Restarting the whole explanation and losing the thread.",
        trap_vi: "Bắt đầu lại toàn bộ giải thích và mất mạch.",
        repair: {
          pa: "ਹੁਣ ਮੈਂ ਜਿੱਥੇ ਰੁਕਿਆ ਸੀ, ਉੱਥੋਂ ਜਾਰੀ ਕਰਦਾ ਹਾਂ।",
          romanization: "hun main jithe rukia si, uthon jari karda han.",
          en: "I will continue from where I stopped.",
          vi: "Tôi sẽ tiếp tục từ chỗ đã dừng.",
        },
      },
    ],
    exportReadiness_en:
      "Final-hardening should confirm the recovery preserves the thread and the task order.",
    exportReadiness_vi:
      "Hoàn thiện cuối cần xác nhận phần phục hồi giữ mạch và thứ tự nhiệm vụ.",
    finalQa_en:
      "Final-QA checks workplace continuation, turn-taking, and clear task flow.",
    finalQa_vi:
      "Kiểm tra cuối xác minh tiếp tục nơi làm việc, lượt nói và luồng nhiệm vụ rõ.",
  },
  {
    id: "b1-recovery-service-reopen",
    level: "B1",
    focus: "continue_service_conversation",
    title_en: "Continue a service conversation",
    title_vi: "Tiếp tục cuộc trò chuyện dịch vụ",
    scenario_en:
      "A billing or account answer was incomplete and you need to keep the service conversation going.",
    scenario_vi:
      "Câu trả lời về hóa đơn hoặc tài khoản chưa đầy đủ và bạn cần tiếp tục cuộc trò chuyện dịch vụ.",
    canadaContext:
      "Useful for Canadian phone, internet, billing, and support desks.",
    recoveryPack: {
      finalHardeningPrompt_en:
        "Ask the service desk to continue the account explanation.",
      finalHardeningPrompt_vi:
        "Yêu cầu quầy dịch vụ tiếp tục giải thích tài khoản.",
      recoveryLine: {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਜਾਰੀ ਰੱਖੋ, ਮੈਨੂੰ ਇਹ ਹਿੱਸਾ ਵੀ ਸਮਝਣਾ ਹੈ।",
        romanization:
          "kirpa karke jari rakho, mainu ih hissa vi samajhna hai.",
        en: "Please continue, I need to understand this part too.",
        vi: "Vui lòng tiếp tục, tôi cũng cần hiểu phần này.",
      },
      recoverySignals_en: [
        "Keeps the service interaction open",
        "Asks for the missing part",
        "Stays polite",
      ],
      recoverySignals_vi: [
        "Giữ tương tác dịch vụ mở",
        "Hỏi phần còn thiếu",
        "Giữ lịch sự",
      ],
    },
    commonTraps: [
      {
        trap_en: "Ending the conversation before the account issue is clear.",
        trap_vi: "Kết thúc cuộc trò chuyện trước khi vấn đề tài khoản rõ.",
        repair: {
          pa: "ਮੇਰੀ ਅਕਾਊਂਟ ਜਾਣਕਾਰੀ ਹਾਲੇ ਅਧੂਰੀ ਹੈ।",
          romanization: "meri account jankari hale adhuri hai.",
          en: "My account information is still incomplete.",
          vi: "Thông tin tài khoản của tôi vẫn chưa đầy đủ.",
        },
      },
    ],
    exportReadiness_en:
      "Final-hardening is ready when the learner keeps the service thread open and clear.",
    exportReadiness_vi:
      "Sẵn sàng cuối khi người học giữ mạch dịch vụ mở và rõ.",
    finalQa_en:
      "Final-QA checks service continuation, missing detail, and polite reopening of the turn.",
    finalQa_vi:
      "Kiểm tra cuối xác minh tiếp tục dịch vụ, chi tiết còn thiếu và mở lại lượt nói lịch sự.",
  },
  {
    id: "b1-recovery-school-community-followup",
    level: "B1",
    focus: "continue_school_community_conversation",
    title_en: "Continue a school or community conversation",
    title_vi: "Tiếp tục cuộc trò chuyện trường hoặc cộng đồng",
    scenario_en:
      "A school or community program reply was incomplete and you need to ask again politely.",
    scenario_vi:
      "Phản hồi từ trường hoặc chương trình cộng đồng chưa đầy đủ và bạn cần hỏi lại lịch sự.",
    canadaContext:
      "Useful for Canadian schools, daycare, libraries, and community classes.",
    recoveryPack: {
      finalHardeningPrompt_en:
        "Ask for the missing detail and keep the message respectful.",
      finalHardeningPrompt_vi:
        "Hỏi chi tiết còn thiếu và giữ thông điệp tôn trọng.",
      recoveryLine: {
        pa: "ਮੈਨੂੰ ਇਕ ਹੋਰ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ। ਕੀ ਤੁਸੀਂ ਇਹ ਮੁੜ ਸਮਝਾ ਸਕਦੇ ਹੋ?",
        romanization:
          "mainu ik hor jankari chahidi hai. ki tusin ih mudh samjha sakde ho?",
        en: "I need one more piece of information. Can you explain this again?",
        vi: "Tôi cần thêm một thông tin nữa. Bạn có thể giải thích lại không?",
      },
      recoverySignals_en: [
        "Asks for a missing detail",
        "Invites a repeat explanation",
        "Keeps a respectful tone",
      ],
      recoverySignals_vi: [
        "Hỏi chi tiết còn thiếu",
        "Mời giải thích lại",
        "Giữ giọng tôn trọng",
      ],
    },
    commonTraps: [
      {
        trap_en: "Sending a follow-up that only says answer me.",
        trap_vi: "Gửi theo dõi chỉ nói trả lời tôi.",
        repair: {
          pa: "ਮੈਂ ਸਿਰਫ਼ ਇਕ ਛੋਟੀ ਜਿਹੀ ਸਪਸ਼ਟਤਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
          romanization: "main sirf ik chhoti jehi spashtata chahunda han.",
          en: "I only want a small clarification.",
          vi: "Tôi chỉ cần một chút làm rõ.",
        },
      },
    ],
    exportReadiness_en:
      "Final-hardening is ready when the follow-up is short, specific, and polite.",
    exportReadiness_vi:
      "Sẵn sàng xuất khi theo dõi ngắn, cụ thể và lịch sự.",
    finalQa_en:
      "Final-QA checks school/community continuation, missing detail, and polite repetition.",
    finalQa_vi:
      "Kiểm tra cuối xác minh tiếp tục trường/cộng đồng, chi tiết còn thiếu và lặp lại lịch sự.",
  },
  {
    id: "b1-recovery-misunderstanding-recover",
    level: "B1",
    focus: "recover_after_misunderstanding",
    title_en: "Recover after a misunderstanding",
    title_vi: "Phục hồi sau một hiểu lầm",
    scenario_en:
      "The listener misunderstood you and you need to restart the exchange without losing the topic.",
    scenario_vi:
      "Người nghe hiểu sai bạn và bạn cần khởi động lại cuộc trao đổi mà không mất chủ đề.",
    canadaContext:
      "Useful for Canadian service, workplace, housing, and school conversations.",
    recoveryPack: {
      finalHardeningPrompt_en:
        "Recover the exchange and bring the listener back to the main topic.",
      finalHardeningPrompt_vi:
        "Phục hồi cuộc trao đổi và kéo người nghe về chủ đề chính.",
      recoveryLine: {
        pa: "ਸ਼ਾਇਦ ਮੈਂ ਸਾਫ਼ ਨਹੀਂ ਬੋਲਿਆ। ਮੈਂ ਫਿਰ ਤੋਂ ਸਮਝਾਉਂਦਾ ਹਾਂ।",
        romanization: "shayad main saf nahin bolia. main phir ton samjhaunga.",
        en: "Maybe I was not clear. I will explain again.",
        vi: "Có lẽ tôi chưa nói rõ. Tôi sẽ giải thích lại.",
      },
      recoverySignals_en: [
        "Acknowledges the misunderstanding",
        "Takes responsibility for clarity",
        "Restarts the topic calmly",
      ],
      recoverySignals_vi: [
        "Thừa nhận hiểu lầm",
        "Nhận trách nhiệm về độ rõ",
        "Khởi động lại chủ đề bình tĩnh",
      ],
    },
    commonTraps: [
      {
        trap_en: "Arguing about who misunderstood instead of restarting the topic.",
        trap_vi: "Cãi về ai hiểu sai thay vì khởi động lại chủ đề.",
        repair: {
          pa: "ਆਓ ਮੁੜ ਤੋਂ ਸ਼ੁਰੂ ਕਰੀਏ।",
          romanization: "ao mudh ton shuru kariye.",
          en: "Let's start again.",
          vi: "Hãy bắt đầu lại.",
        },
      },
    ],
    exportReadiness_en:
      "Final-hardening is ready when the exchange is reset cleanly and the topic remains intact.",
    exportReadiness_vi:
      "Hoàn thiện cuối sẵn sàng khi cuộc trao đổi được đặt lại gọn và chủ đề vẫn nguyên.",
    finalQa_en:
      "Final-QA checks misunderstanding recovery, topic continuity, and polite restart language.",
    finalQa_vi:
      "Kiểm tra cuối xác minh phục hồi hiểu lầm, giữ chủ đề liên tục và ngôn ngữ khởi động lại lịch sự.",
  },
  {
    id: "b1-recovery-tone-repair",
    level: "B1",
    focus: "repair_tone",
    title_en: "Repair a harsh tone",
    title_vi: "Sửa giọng gay gắt",
    scenario_en:
      "Your first sentence sounded too harsh and you need to soften it before continuing.",
    scenario_vi:
      "Câu đầu của bạn nghe quá gay gắt và bạn cần làm mềm nó trước khi tiếp tục.",
    canadaContext:
      "Useful for Canadian libraries, offices, and service counters.",
    recoveryPack: {
      finalHardeningPrompt_en:
        "Rewrite the sentence so the tone becomes calm and respectful.",
      finalHardeningPrompt_vi:
        "Viết lại câu để giọng trở nên bình tĩnh và tôn trọng.",
      recoveryLine: {
        pa: "ਮਾਫ ਕਰਨਾ ਜੀ, ਮੈਂ ਸ਼ਾਂਤੀ ਨਾਲ ਗੱਲ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
        romanization:
          "maf karna ji, main shanti nal gall karna chahunda han.",
        en: "Sorry, I want to speak calmly.",
        vi: "Xin lỗi ạ, tôi muốn nói chuyện bình tĩnh.",
      },
      recoverySignals_en: [
        "Softens the tone",
        "Keeps respect visible",
        "Moves the conversation forward",
      ],
      recoverySignals_vi: [
        "Làm mềm giọng",
        "Giữ sự tôn trọng",
        "Đưa cuộc trò chuyện đi tiếp",
      ],
    },
    commonTraps: [
      {
        trap_en: "Keeping the sharp wording after noticing the problem.",
        trap_vi: "Giữ cách nói gắt sau khi nhận ra vấn đề.",
        repair: {
          pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਸ਼ਾਂਤ ਤਰੀਕੇ ਨਾਲ ਦੱਸੋ।",
          romanization: "kirpa karke mainu shant tarike nal dasso.",
          en: "Please tell me calmly.",
          vi: "Vui lòng nói cho tôi một cách bình tĩnh.",
        },
      },
    ],
    exportReadiness_en:
      "Final-hardening is ready when the tone is visibly softened and still useful.",
    exportReadiness_vi:
      "Hoàn thiện cuối sẵn sàng khi giọng đã được làm mềm mà vẫn hữu ích.",
    finalQa_en:
      "Final-QA checks tone repair, respectful wording, and Gurmukhi-first output.",
    finalQa_vi:
      "Kiểm tra cuối xác minh sửa giọng, cách nói tôn trọng và đầu ra Gurmukhi là chính.",
  },
  {
    id: "b1-recovery-register-mistake",
    level: "B1",
    focus: "register_mistake_repair",
    title_en: "Repair a register mistake",
    title_vi: "Sửa lỗi mức lịch sự",
    scenario_en:
      "Your first sentence sounded too direct, and you need to soften it for a front desk.",
    scenario_vi:
      "Câu đầu tiên của bạn nghe quá trực tiếp và bạn cần làm mềm nó ở quầy dịch vụ.",
    canadaContext:
      "Useful for Canadian libraries, offices, and service counters; Shahmukhi is awareness only, not a full course.",
    recoveryPack: {
      finalHardeningPrompt_en:
        "Rewrite the request with polite register and continue the interaction.",
      finalHardeningPrompt_vi:
        "Viết lại yêu cầu bằng mức lịch sự và tiếp tục tương tác.",
      recoveryLine: {
        pa: "ਮਾਫ ਕਰਨਾ ਜੀ, ਕੀ ਤੁਸੀਂ ਮੇਰੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?",
        romanization: "maf karna ji, ki tusin meri madad kar sakde ho?",
        en: "Sorry, can you help me?",
        vi: "Xin lỗi ạ, bạn có thể giúp tôi không?",
      },
      recoverySignals_en: [
        "Softens the first attempt",
        "Uses polite register",
        "Keeps the conversation open",
      ],
      recoverySignals_vi: [
        "Làm mềm câu ban đầu",
        "Dùng mức lịch sự",
        "Giữ cuộc trò chuyện mở",
      ],
    },
    commonTraps: [
      {
        trap_en: "Keeping the command form instead of softening it.",
        trap_vi: "Giữ dạng mệnh lệnh thay vì làm mềm nó.",
        repair: {
          pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੀ ਮਦਦ ਕਰ ਦਿਓ ਜੀ।",
          romanization: "kirpa karke meri madad kar dio ji.",
          en: "Please help me.",
          vi: "Vui lòng giúp tôi ạ.",
        },
      },
    ],
    exportReadiness_en:
      "Final-hardening should confirm the register is repaired and the tone is respectful.",
    exportReadiness_vi:
      "Hoàn thiện cuối cần xác nhận mức lịch sự đã được sửa và giọng tôn trọng.",
    finalQa_en:
      "Final-QA checks register repair, direct-to-polite conversion, Gurmukhi-first output, and Native review is deferred.",
    finalQa_vi:
      "Kiểm tra cuối xác minh sửa mức lịch sự, chuyển từ trực tiếp sang nhã nhặn và đầu ra Gurmukhi là chính.",
  },
];
