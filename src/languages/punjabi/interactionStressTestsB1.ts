export type PunjabiB1InteractionStressFocus =
  | "unclear_service_answer"
  | "workplace_misunderstanding"
  | "housing_delay"
  | "school_community_follow_up"
  | "clinic_service_problem"
  | "polite_complaint"
  | "register_repair";

export type PunjabiInteractionStressLine = {
  pa: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiInteractionStressTrap = {
  trap_en: string;
  trap_vi: string;
  fix: PunjabiInteractionStressLine;
};

export type PunjabiInteractionStressPack = {
  stressPrompt_en: string;
  stressPrompt_vi: string;
  sampleResponse: PunjabiInteractionStressLine;
  riskSignals_en: string[];
  riskSignals_vi: string[];
};

export type PunjabiB1InteractionStressTest = {
  id: string;
  level: "B1";
  focus: PunjabiB1InteractionStressFocus;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  stressPack: PunjabiInteractionStressPack;
  commonTraps: PunjabiInteractionStressTrap[];
  finalRisk_en: string;
  finalRisk_vi: string;
  finalQa_en: string;
  finalQa_vi: string;
};

export const punjabiB1InteractionStressTests: PunjabiB1InteractionStressTest[] = [
  {
    id: "b1-stress-unclear-service-answer",
    level: "B1",
    focus: "unclear_service_answer",
    title_en: "Clarify an unclear service answer",
    title_vi: "Làm rõ câu trả lời dịch vụ không rõ",
    scenario_en:
      "A service desk gives you a vague answer and you need to ask for a clearer next step.",
    scenario_vi:
      "Quầy dịch vụ đưa cho bạn câu trả lời mơ hồ và bạn cần hỏi bước tiếp theo rõ hơn.",
    canadaContext:
      "Useful for Canadian phone, internet, and front-desk service conversations.",
    stressPack: {
      stressPrompt_en: "Ask what the next step is when the answer is too vague.",
      stressPrompt_vi:
        "Hỏi bước tiếp theo là gì khi câu trả lời quá mơ hồ.",
      sampleResponse: {
        pa: "ਮੈਨੂੰ ਅਜੇ ਵੀ ਸਪਸ਼ਟ ਨਹੀਂ ਹੈ। ਅਗਲਾ ਕਦਮ ਕੀ ਹੈ?",
        romanization: "mainu aje vi spasht nahin hai. agla kadam ki hai?",
        en: "It is still not clear to me. What is the next step?",
        vi: "Tôi vẫn chưa rõ. Bước tiếp theo là gì?",
      },
      riskSignals_en: [
        "Vague answer remains unresolved",
        "Learner asks for a clear next step",
        "Tone stays polite",
      ],
      riskSignals_vi: [
        "Câu trả lời mơ hồ chưa được xử lý",
        "Người học hỏi bước tiếp theo rõ",
        "Giữ giọng lịch sự",
      ],
    },
    commonTraps: [
      {
        trap_en: "Accepting the vague answer without asking again.",
        trap_vi: "Chấp nhận câu trả lời mơ hồ mà không hỏi lại.",
        fix: {
          pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਕ ਵਾਰ ਹੋਰ ਸਪਸ਼ਟ ਦੱਸੋ।",
          romanization: "kirpa karke ik var hor spasht dasso.",
          en: "Please explain it clearly one more time.",
          vi: "Vui lòng giải thích rõ thêm một lần nữa.",
        },
      },
    ],
    finalRisk_en:
      "Language practice only, not medical advice. Final-risk review should confirm the response asks for clarity, not advice.",
    finalRisk_vi:
      "Đánh giá rủi ro cuối cần xác nhận câu trả lời hỏi làm rõ, không phải tư vấn.",
    finalQa_en:
      "Final-QA checks service clarity, polite follow-up, and Gurmukhi-first writing.",
    finalQa_vi:
      "Kiểm tra cuối xác minh độ rõ dịch vụ, hỏi lại lịch sự và chữ Gurmukhi là chính.",
  },
  {
    id: "b1-stress-workplace-misunderstanding",
    level: "B1",
    focus: "workplace_misunderstanding",
    title_en: "Fix a workplace misunderstanding",
    title_vi: "Sửa một hiểu lầm ở nơi làm việc",
    scenario_en:
      "A coworker misunderstood your task and you need to restate it without sounding rude.",
    scenario_vi:
      "Đồng nghiệp hiểu sai việc của bạn và bạn cần nói lại mà không nghe thô lỗ.",
    canadaContext:
      "Useful for Canadian retail, warehouse, office, and food-service shifts.",
    stressPack: {
      stressPrompt_en:
        "Restate the task clearly and keep the tone neutral.",
      stressPrompt_vi:
        "Nói lại nhiệm vụ cho rõ và giữ giọng trung lập.",
      sampleResponse: {
        pa: "ਮੈਂ ਇਹ ਨਹੀਂ ਕਿਹਾ ਸੀ। ਮੇਰਾ ਮਤਲਬ ਇਹ ਕੰਮ ਹੈ, ਇਹ ਨਹੀਂ।",
        romanization: "main ih nahin keha si. mera matlab ih kamm hai, ih nahin.",
        en: "That is not what I said. I meant this task, not that one.",
        vi: "Tôi không nói vậy. Ý tôi là việc này, không phải việc kia.",
      },
      riskSignals_en: [
        "Misunderstanding is corrected",
        "Tone stays neutral",
        "Task is restated",
      ],
      riskSignals_vi: [
        "Hiểu lầm được sửa",
        "Giọng vẫn trung lập",
        "Nhiệm vụ được nói lại",
      ],
    },
    commonTraps: [
      {
        trap_en: "Using blame language instead of a clear correction.",
        trap_vi: "Dùng lời đổ lỗi thay vì sửa lại rõ ràng.",
        fix: {
          pa: "ਮੈਨੂੰ ਲਗਦਾ ਹੈ ਕਿ ਅਸੀਂ ਗਲਤ ਸਮਝੇ ਹਾਂ।",
          romanization: "mainu lagda hai ki asin galat samjhe han.",
          en: "I think we misunderstood each other.",
          vi: "Tôi nghĩ chúng ta đã hiểu lầm nhau.",
        },
      },
    ],
    finalRisk_en:
      "Final-risk review should confirm the message is corrective, not confrontational.",
    finalRisk_vi:
      "Đánh giá rủi ro cuối cần xác nhận lời nói mang tính sửa lại, không đối đầu.",
    finalQa_en:
      "Final-QA checks neutral workplace language and a clear task correction.",
    finalQa_vi:
      "Kiểm tra cuối xác minh ngôn ngữ trung lập nơi làm việc và sửa nhiệm vụ rõ.",
  },
  {
    id: "b1-stress-housing-delay",
    level: "B1",
    focus: "housing_delay",
    title_en: "Follow up on a housing delay",
    title_vi: "Theo dõi một việc nhà ở bị chậm",
    scenario_en:
      "A repair was promised but is still delayed, and you need to ask for an update.",
    scenario_vi:
      "Việc sửa chữa đã được hứa nhưng vẫn bị chậm, và bạn cần hỏi cập nhật.",
    canadaContext:
      "Useful for Canadian tenant and building-management conversations about repairs.",
    stressPack: {
      stressPrompt_en:
        "Ask for an update and mention the earlier promise.",
      stressPrompt_vi:
        "Hỏi cập nhật và nhắc lời hứa trước đó.",
      sampleResponse: {
        pa: "ਤੁਸੀਂ ਕਿਹਾ ਸੀ ਕਿ ਇਹ ਅੱਜ ਹੋਵੇਗਾ, ਪਰ ਹਾਲੇ ਨਹੀਂ ਹੋਇਆ। ਕੀ ਅਪਡੇਟ ਹੈ?",
        romanization: "tusin keha si ki ih ajj hovega, par hale nahin hoya. ki update hai?",
        en: "You said this would happen today, but it has not yet happened. What is the update?",
        vi: "Bạn đã nói việc này sẽ diễn ra hôm nay, nhưng vẫn chưa xảy ra. Có cập nhật gì không?",
      },
      riskSignals_en: [
        "Earlier promise is named",
        "Delay is clear",
        "Request is direct but polite",
      ],
      riskSignals_vi: [
        "Nhắc lời hứa trước",
        "Nêu sự chậm trễ rõ",
        "Yêu cầu trực tiếp nhưng lịch sự",
      ],
    },
    commonTraps: [
      {
        trap_en: "Only saying it is late without mentioning the earlier promise.",
        trap_vi: "Chỉ nói chậm mà không nhắc lời hứa trước.",
        fix: {
          pa: "ਤੁਸੀਂ ਪਹਿਲਾਂ ਇੱਕ ਸਮਾਂ ਦਿੱਤਾ ਸੀ।",
          romanization: "tusin pahilan ikk sama ditta si.",
          en: "You gave a time earlier.",
          vi: "Bạn đã đưa một thời gian trước đó.",
        },
      },
    ],
    finalRisk_en:
      "language practice only, not legal or financial advice. Final-risk review should confirm the follow-up is factual and not aggressive.",
    finalRisk_vi:
      "Đánh giá rủi ro cuối cần xác nhận lời theo dõi là факт và không gây hấn.",
    finalQa_en:
      "Final-QA checks housing detail, timing, and a clear update request.",
    finalQa_vi:
      "Kiểm tra cuối xác minh chi tiết nhà ở, thời điểm và yêu cầu cập nhật rõ.",
  },
  {
    id: "b1-stress-school-followup",
    level: "B1",
    focus: "school_community_follow_up",
    title_en: "Follow up with a school or community program",
    title_vi: "Theo dõi với trường hoặc chương trình cộng đồng",
    scenario_en:
      "A school or community program has not replied, and you need a respectful follow-up.",
    scenario_vi:
      "Trường hoặc chương trình cộng đồng chưa trả lời, và bạn cần theo dõi lịch sự.",
    canadaContext:
      "Useful for Canadian schools, daycare, library programs, and community classes.",
    stressPack: {
      stressPrompt_en:
        "Write a short follow-up asking for the status.",
      stressPrompt_vi:
        "Viết tin theo dõi ngắn để hỏi tình trạng.",
      sampleResponse: {
        pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ, ਮੈਂ ਆਪਣੀ ਅਰਜ਼ੀ ਬਾਰੇ ਪੁੱਛਣਾ ਚਾਹੁੰਦਾ ਹਾਂ। ਕੀ ਕੋਈ ਅਪਡੇਟ ਹੈ?",
        romanization: "sat sri akal ji, main apni arzi bare puchhna chahunda han. ki koi update hai?",
        en: "Hello, I want to ask about my application. Is there any update?",
        vi: "Xin chào ạ, tôi muốn hỏi về đơn của mình. Có cập nhật gì không?",
      },
      riskSignals_en: [
        "Mentions the original request",
        "Keeps the tone respectful",
        "Asks for status",
      ],
      riskSignals_vi: [
        "Nhắc yêu cầu ban đầu",
        "Giữ giọng tôn trọng",
        "Hỏi tình trạng",
      ],
    },
    commonTraps: [
      {
        trap_en: "Sending a follow-up that only says answer me.",
        trap_vi: "Gửi tin theo dõi chỉ nói trả lời tôi.",
        fix: {
          pa: "ਮੈਂ ਆਪਣੀ ਅਰਜ਼ੀ ਬਾਰੇ ਪੁੱਛ ਰਿਹਾ ਹਾਂ।",
          romanization: "main apni arzi bare puchh riha han.",
          en: "I am asking about my application.",
          vi: "Tôi đang hỏi về đơn của mình.",
        },
      },
    ],
    finalRisk_en:
      "Final-risk review should confirm the follow-up is respectful and specific.",
    finalRisk_vi:
      "Đánh giá rủi ro cuối cần xác nhận tin theo dõi lịch sự và cụ thể.",
    finalQa_en:
      "Final-QA checks school/community context, status request, and polite register.",
    finalQa_vi:
      "Kiểm tra cuối xác minh ngữ cảnh trường/cộng đồng, yêu cầu tình trạng và mức lịch sự.",
  },
  {
    id: "b1-stress-clinic-service-problem",
    level: "B1",
    focus: "clinic_service_problem",
    title_en: "Handle a clinic service problem",
    title_vi: "Xử lý vấn đề dịch vụ ở phòng khám",
    scenario_en:
      "A clinic or service desk gives the wrong information and you need to clarify it.",
    scenario_vi:
      "Phòng khám hoặc quầy dịch vụ đưa thông tin sai và bạn cần làm rõ.",
    canadaContext:
      "Useful for Canadian clinics, pharmacies, and health-service counters; language practice only, not medical advice.",
    stressPack: {
      stressPrompt_en:
        "Clarify the wrong information and ask what should happen next.",
      stressPrompt_vi:
        "Làm rõ thông tin sai và hỏi điều gì nên xảy ra tiếp theo.",
      sampleResponse: {
        pa: "ਇਹ ਜਾਣਕਾਰੀ ਮੇਰੇ ਲਈ ਠੀਕ ਨਹੀਂ ਲੱਗਦੀ। ਕੀ ਤੁਸੀਂ ਮੁੜ ਚੈੱਕ ਕਰ ਸਕਦੇ ਹੋ?",
        romanization: "ih jankari mere lai thik nahin lagdi. ki tusin mudh check kar sakde ho?",
        en: "This information does not seem correct to me. Can you check it again?",
        vi: "Thông tin này với tôi có vẻ không đúng. Bạn có thể kiểm tra lại không?",
      },
      riskSignals_en: [
        "Incorrect information is named",
        "Tone stays calm",
        "A recheck is requested",
      ],
      riskSignals_vi: [
        "Nêu thông tin sai",
        "Giữ giọng bình tĩnh",
        "Yêu cầu kiểm tra lại",
      ],
    },
    commonTraps: [
      {
        trap_en: "Turning the clarification into medical advice.",
        trap_vi: "Biến việc làm rõ thành tư vấn y tế.",
        fix: {
          pa: "ਮੈਂ ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਚੈੱਕ ਕਰਵਾਉਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।",
          romanization: "main sirf jankari check karvauna chahunda han.",
          en: "I only want the information checked.",
          vi: "Tôi chỉ muốn kiểm tra lại thông tin.",
        },
      },
    ],
    finalRisk_en:
      "Final-risk review should confirm the answer stays inside language support only.",
    finalRisk_vi:
      "Đánh giá rủi ro cuối cần xác nhận câu trả lời chỉ ở phạm vi hỗ trợ ngôn ngữ.",
    finalQa_en:
      "Final-QA checks clinic/service clarity, calm tone, and support-only wording.",
    finalQa_vi:
      "Kiểm tra cuối xác minh độ rõ ở phòng khám/dịch vụ, giọng bình tĩnh và lời chỉ hỗ trợ.",
  },
  {
    id: "b1-stress-polite-complaint",
    level: "B1",
    focus: "polite_complaint",
    title_en: "Make a polite complaint",
    title_vi: "Đưa ra phàn nàn lịch sự",
    scenario_en:
      "You need to complain about a repeated billing problem without sounding aggressive.",
    scenario_vi:
      "Bạn cần phàn nàn về vấn đề tính phí lặp lại mà không nghe gay gắt.",
    canadaContext:
      "Useful for Canadian billing, phone, internet, and utility service situations.",
    stressPack: {
      stressPrompt_en:
        "State the complaint, the repetition, and the correction request.",
      stressPrompt_vi:
        "Nêu phàn nàn, việc lặp lại và yêu cầu sửa.",
      sampleResponse: {
        pa: "ਇਹ ਸਮੱਸਿਆ ਦੁਬਾਰਾ ਆ ਗਈ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਇਸਨੂੰ ਠੀਕ ਕਰੋ।",
        romanization: "ih samasya dubara aa gai hai. kirpa karke isnu thik karo.",
        en: "This problem has happened again. Please fix it.",
        vi: "Vấn đề này lại xảy ra rồi. Vui lòng sửa nó.",
      },
      riskSignals_en: [
        "Repetition is explicit",
        "Request is polite",
        "Correction is clear",
      ],
      riskSignals_vi: [
        "Nêu rõ sự lặp lại",
        "Yêu cầu lịch sự",
        "Yêu cầu sửa rõ",
      ],
    },
    commonTraps: [
      {
        trap_en: "Using angry language that weakens the message.",
        trap_vi: "Dùng ngôn ngữ giận dữ làm yếu đi thông điệp.",
        fix: {
          pa: "ਮੈਂ ਇਸਦਾ ਸ਼ਾਂਤ ਹੱਲ ਚਾਹੁੰਦਾ ਹਾਂ।",
          romanization: "main isda shant hall chahunda han.",
          en: "I want a calm solution for this.",
          vi: "Tôi muốn một giải pháp bình tĩnh cho việc này.",
        },
      },
    ],
    finalRisk_en:
      "Final-risk review should confirm the complaint is firm but polite.",
    finalRisk_vi:
      "Đánh giá rủi ro cuối cần xác nhận phàn nàn chắc chắn nhưng lịch sự.",
    finalQa_en:
      "Final-QA checks complaint clarity, repeated-problem language, and polite repair request.",
    finalQa_vi:
      "Kiểm tra cuối xác minh độ rõ của phàn nàn, ngôn ngữ vấn đề lặp lại và yêu cầu sửa lịch sự.",
  },
  {
    id: "b1-stress-register-repair",
    level: "B1",
    focus: "register_repair",
    title_en: "Repair a too-direct request",
    title_vi: "Sửa một yêu cầu quá trực tiếp",
    scenario_en:
      "Your request sounds too direct, so you need to rewrite it in a more polite register.",
    scenario_vi:
      "Yêu cầu của bạn nghe quá trực tiếp, nên bạn cần viết lại theo mức lịch sự hơn.",
    canadaContext:
      "Useful for Canadian libraries, offices, and service counters; Shahmukhi is awareness only, not a full course.",
    stressPack: {
      stressPrompt_en:
        "Rewrite the request so it sounds polite at a front desk.",
      stressPrompt_vi:
        "Viết lại yêu cầu để nghe lịch sự ở quầy dịch vụ.",
      sampleResponse: {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੀ ਮਦਦ ਕਰ ਦਿਓ ਜੀ।",
        romanization: "kirpa karke meri madad kar dio ji.",
        en: "Please help me.",
        vi: "Vui lòng giúp tôi ạ.",
      },
      riskSignals_en: [
        "Direct command is softened",
        "Polite register is clear",
        "Useful for front-desk speech",
      ],
      riskSignals_vi: [
        "Mệnh lệnh trực tiếp được làm mềm",
        "Mức lịch sự rõ",
        "Phù hợp lời nói ở quầy",
      ],
    },
    commonTraps: [
      {
        trap_en: "Keeping the command form instead of softening it.",
        trap_vi: "Giữ dạng mệnh lệnh thay vì làm mềm nó.",
        fix: {
          pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਕਰ ਦਿਓ ਜੀ।",
          romanization: "kirpa karke ih kar dio ji.",
          en: "Please do this for me.",
          vi: "Vui lòng làm điều này giúp tôi ạ.",
        },
      },
    ],
    finalRisk_en:
      "Final-risk review should confirm the repair lowers pressure and keeps respect.",
    finalRisk_vi:
      "Đánh giá rủi ro cuối cần xác nhận bản sửa làm mềm áp lực và giữ sự tôn trọng.",
    finalQa_en:
      "Final-QA checks register repair, polite phrasing, Gurmukhi-first output, and Native review is deferred.",
    finalQa_vi:
      "Kiểm tra cuối xác minh sửa mức lịch sự, cách nói nhã nhặn và đầu ra Gurmukhi là chính.",
  },
];
