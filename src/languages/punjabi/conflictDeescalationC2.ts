// Punjabi C2 conflict de-escalation language for Vietnamese- and
// English-speaking learners. Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support language practice, not conflict-resolution,
// legal, HR, medical, safety, or native-reviewed advice. Native review is
// deferred. Shahmukhi is mentioned only for script awareness, not as a full
// course.

export type PunjabiConflictDeescalationFocus =
  | "calm_disagreement"
  | "acknowledge_emotion"
  | "reframe_issue"
  | "propose_pause"
  | "repair_relationship"
  | "workplace_sensitivity"
  | "community_sensitivity"
  | "public_service_sensitivity";

export type PunjabiConflictContext =
  | "workplace"
  | "community"
  | "family"
  | "public_service"
  | "education"
  | "canada_service";

export type PunjabiConflictPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiConflictTrap = {
  trap_vi: string;
  trap_en: string;
  safer_vi: string;
  safer_en: string;
};

export type PunjabiConflictDeescalationEntry = {
  id: string;
  focus: PunjabiConflictDeescalationFocus;
  context: PunjabiConflictContext;
  title_vi: string;
  title_en: string;
  situation_vi: string;
  situation_en: string;
  language_strategy_vi: string;
  language_strategy_en: string;
  phrases: PunjabiConflictPhrase[];
  model_gurmukhi: string;
  model_romanization: string;
  model_vi: string;
  model_en: string;
  learner_trap?: PunjabiConflictTrap;
  canada_practical?: boolean;
};

export const CONFLICT_DEESCALATION_C2_DISCLAIMER = {
  vi: "Gói ngôn ngữ hạ nhiệt xung đột Punjabi C2 này chỉ hỗ trợ học tập, không phải tư vấn pháp lý, nhân sự, y tế, an toàn, hay hòa giải. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi conflict de-escalation pack is for study-support language practice only, not legal, HR, medical, safety, or mediation advice. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const conflictDeescalationC2Entries: PunjabiConflictDeescalationEntry[] = [
  {
    id: "pa_c2_conflict_calm_disagreement",
    focus: "calm_disagreement",
    context: "workplace",
    title_vi: "Bất đồng bình tĩnh",
    title_en: "Calm disagreement",
    situation_vi: "Cuộc họp bắt đầu căng vì hai ý kiến trái nhau.",
    situation_en: "A meeting becomes tense because two views conflict.",
    language_strategy_vi: "Công nhận mục tiêu chung rồi nêu khác biệt như một điểm cần xem xét.",
    language_strategy_en: "Acknowledge the shared goal, then present the difference as a point to consider.",
    phrases: [
      {
        gurmukhi: "ਮਕਸਦ ਸਾਡਾ ਇੱਕੋ ਹੈ",
        romanization: "maqsad sada ikko hai",
        vi: "Mục tiêu của chúng ta là cùng một hướng.",
        en: "Our goal is the same.",
      },
      {
        gurmukhi: "ਮੇਰਾ ਇੱਕ ਵੱਖਰਾ ਨਜ਼ਰੀਆ ਹੈ",
        romanization: "mera ikk vakhra nazaria hai",
        vi: "Tôi có một góc nhìn khác.",
        en: "I have a different perspective.",
      },
    ],
    model_gurmukhi: "ਮਕਸਦ ਸਾਡਾ ਇੱਕੋ ਹੈ। ਮੇਰਾ ਇੱਕ ਵੱਖਰਾ ਨਜ਼ਰੀਆ ਹੈ, ਜਿਸ ਨੂੰ ਅਸੀਂ ਸ਼ਾਂਤੀ ਨਾਲ ਵੇਖ ਸਕਦੇ ਹਾਂ।",
    model_romanization: "maqsad sada ikko hai. mera ikk vakhra nazaria hai, jis nu asin shaanti naal vekh sakde haan.",
    model_vi: "Mục tiêu của chúng ta là cùng một hướng. Tôi có một góc nhìn khác mà chúng ta có thể xem xét bình tĩnh.",
    model_en: "Our goal is the same. I have a different perspective that we can look at calmly.",
    learner_trap: {
      trap_vi: "Mở đầu bằng 'anh/chị sai' làm căng thẳng tăng.",
      trap_en: "Opening with 'you are wrong' raises tension.",
      safer_vi: "Bắt đầu từ mục tiêu chung rồi mới nêu khác biệt.",
      safer_en: "Start from the shared goal before naming the difference.",
    },
  },
  {
    id: "pa_c2_conflict_acknowledge_emotion",
    focus: "acknowledge_emotion",
    context: "community",
    title_vi: "Công nhận cảm xúc mà không chẩn đoán",
    title_en: "Acknowledge emotion without diagnosing",
    situation_vi: "Người khác nghe có vẻ bực hoặc thất vọng trong thảo luận cộng đồng.",
    situation_en: "Someone sounds upset or disappointed in a community discussion.",
    language_strategy_vi: "Nói mình nhận thấy chủ đề quan trọng, không gán nhãn tâm lý.",
    language_strategy_en: "Say you can see the topic matters, without labeling anyone psychologically.",
    phrases: [
      {
        gurmukhi: "ਮੈਨੂੰ ਲੱਗਦਾ ਹੈ ਇਹ ਗੱਲ ਤੁਹਾਡੇ ਲਈ ਮਹੱਤਵਪੂਰਨ ਹੈ",
        romanization: "mainu laggda hai ih gall tuhade lai mahatvapuran hai",
        vi: "Tôi thấy việc này quan trọng với anh/chị.",
        en: "It seems this matter is important to you.",
      },
      {
        gurmukhi: "ਆਓ ਗੱਲ ਨੂੰ ਧਿਆਨ ਨਾਲ ਸੁਣੀਏ",
        romanization: "aao gall nu dhiaan naal sunie",
        vi: "Ta hãy lắng nghe việc này cẩn thận.",
        en: "Let's listen to this carefully.",
      },
    ],
    model_gurmukhi: "ਮੈਨੂੰ ਲੱਗਦਾ ਹੈ ਇਹ ਗੱਲ ਤੁਹਾਡੇ ਲਈ ਮਹੱਤਵਪੂਰਨ ਹੈ। ਆਓ ਗੱਲ ਨੂੰ ਧਿਆਨ ਨਾਲ ਸੁਣੀਏ।",
    model_romanization: "mainu laggda hai ih gall tuhade lai mahatvapuran hai. aao gall nu dhiaan naal sunie.",
    model_vi: "Tôi thấy việc này quan trọng với anh/chị. Ta hãy lắng nghe việc này cẩn thận.",
    model_en: "It seems this matter is important to you. Let's listen to it carefully.",
    learner_trap: {
      trap_vi: "Nói 'đừng nóng' hoặc đoán cảm xúc của người khác.",
      trap_en: "Saying 'do not be angry' or diagnosing the other person's feelings.",
      safer_vi: "Công nhận tầm quan trọng của vấn đề thay vì phán xét cảm xúc.",
      safer_en: "Acknowledge the importance of the issue instead of judging emotion.",
    },
  },
  {
    id: "pa_c2_conflict_reframe_issue",
    focus: "reframe_issue",
    context: "workplace",
    title_vi: "Đổi khung từ lỗi sang quy trình",
    title_en: "Reframe from fault to process",
    situation_vi: "Một lỗi xảy ra và nhóm bắt đầu đổ lỗi.",
    situation_en: "An error happened and the group starts assigning blame.",
    language_strategy_vi: "Chuyển từ ai sai sang quy trình nào cần làm rõ.",
    language_strategy_en: "Move from who is wrong to which process needs clarification.",
    phrases: [
      {
        gurmukhi: "ਆਓ ਇਸ ਨੂੰ ਵਿਅਕਤੀ ਦੀ ਗਲਤੀ ਨਾ ਬਣਾਈਏ",
        romanization: "aao is nu viakti di galti na banaie",
        vi: "Ta đừng biến việc này thành lỗi cá nhân.",
        en: "Let's not make this an individual fault.",
      },
      {
        gurmukhi: "ਪ੍ਰਕਿਰਿਆ ਕਿੱਥੇ ਸਪਸ਼ਟ ਨਹੀਂ ਸੀ?",
        romanization: "prakiria kithe spasht nahin si?",
        vi: "Quy trình chưa rõ ở đâu?",
        en: "Where was the process unclear?",
      },
    ],
    model_gurmukhi: "ਆਓ ਇਸ ਨੂੰ ਵਿਅਕਤੀ ਦੀ ਗਲਤੀ ਨਾ ਬਣਾਈਏ। ਪ੍ਰਕਿਰਿਆ ਕਿੱਥੇ ਸਪਸ਼ਟ ਨਹੀਂ ਸੀ, ਇਹ ਵੇਖੀਏ।",
    model_romanization: "aao is nu viakti di galti na banaie. prakiria kithe spasht nahin si, ih vekhie.",
    model_vi: "Ta đừng biến việc này thành lỗi cá nhân. Hãy xem quy trình chưa rõ ở đâu.",
    model_en: "Let's not make this an individual fault. Let's see where the process was unclear.",
    learner_trap: {
      trap_vi: "Hỏi 'ai làm?' quá sớm.",
      trap_en: "Asking 'who did it?' too early.",
      safer_vi: "Hỏi quy trình, thông tin, hoặc bước kiểm tra trước.",
      safer_en: "Ask about process, information, or checks first.",
    },
  },
  {
    id: "pa_c2_conflict_propose_pause",
    focus: "propose_pause",
    context: "community",
    title_vi: "Đề xuất tạm dừng",
    title_en: "Propose a pause",
    situation_vi: "Cuộc trao đổi đang đi quá nhanh và dễ leo thang.",
    situation_en: "The exchange is moving too fast and may escalate.",
    language_strategy_vi: "Đề xuất tạm dừng ngắn như một cách suy nghĩ rõ hơn, không phải né tránh.",
    language_strategy_en: "Propose a short pause as a way to think clearly, not to avoid the issue.",
    phrases: [
      {
        gurmukhi: "ਕੀ ਅਸੀਂ ਦੋ ਮਿੰਟ ਰੁਕ ਸਕਦੇ ਹਾਂ?",
        romanization: "ki asin do mint ruk sakde haan?",
        vi: "Chúng ta có thể dừng hai phút không?",
        en: "Can we pause for two minutes?",
      },
      {
        gurmukhi: "ਫਿਰ ਗੱਲ ਨੂੰ ਸਾਫ਼ ਤਰੀਕੇ ਨਾਲ ਅੱਗੇ ਵਧਾਈਏ",
        romanization: "fir gall nu saaf tarike naal agge vadhaie",
        vi: "Rồi tiếp tục câu chuyện một cách rõ ràng hơn.",
        en: "Then let's continue the discussion more clearly.",
      },
    ],
    model_gurmukhi: "ਕੀ ਅਸੀਂ ਦੋ ਮਿੰਟ ਰੁਕ ਸਕਦੇ ਹਾਂ? ਫਿਰ ਗੱਲ ਨੂੰ ਸਾਫ਼ ਤਰੀਕੇ ਨਾਲ ਅੱਗੇ ਵਧਾਈਏ।",
    model_romanization: "ki asin do mint ruk sakde haan? fir gall nu saaf tarike naal agge vadhaie.",
    model_vi: "Chúng ta có thể dừng hai phút không? Rồi hãy tiếp tục câu chuyện một cách rõ ràng hơn.",
    model_en: "Can we pause for two minutes? Then let's continue the discussion more clearly.",
  },
  {
    id: "pa_c2_conflict_repair_relationship",
    focus: "repair_relationship",
    context: "family",
    title_vi: "Sửa quan hệ sau hiểu lầm",
    title_en: "Repair relationship after misunderstanding",
    situation_vi: "Một câu nói của bạn bị hiểu là lạnh hoặc chỉ trích.",
    situation_en: "Something you said was taken as cold or critical.",
    language_strategy_vi: "Nhận phần diễn đạt chưa khéo và nhắc lại thiện chí.",
    language_strategy_en: "Own the wording issue and restate goodwill.",
    phrases: [
      {
        gurmukhi: "ਸ਼ਾਇਦ ਮੇਰੀ ਗੱਲ ਠੀਕ ਤਰ੍ਹਾਂ ਨਹੀਂ ਨਿਕਲੀ",
        romanization: "shayad meri gall theek tarah nahin nikli",
        vi: "Có lẽ lời tôi chưa được diễn đạt đúng.",
        en: "Perhaps my words did not come out well.",
      },
      {
        gurmukhi: "ਮੇਰਾ ਮਤਲਬ ਰਿਸ਼ਤਾ ਖ਼ਰਾਬ ਕਰਨਾ ਨਹੀਂ ਸੀ",
        romanization: "mera matlab rishta kharaab karna nahin si",
        vi: "Ý tôi không phải làm hỏng quan hệ.",
        en: "I did not mean to harm the relationship.",
      },
    ],
    model_gurmukhi: "ਸ਼ਾਇਦ ਮੇਰੀ ਗੱਲ ਠੀਕ ਤਰ੍ਹਾਂ ਨਹੀਂ ਨਿਕਲੀ। ਮੇਰਾ ਮਤਲਬ ਰਿਸ਼ਤਾ ਖ਼ਰਾਬ ਕਰਨਾ ਨਹੀਂ ਸੀ।",
    model_romanization: "shayad meri gall theek tarah nahin nikli. mera matlab rishta kharaab karna nahin si.",
    model_vi: "Có lẽ lời tôi chưa được diễn đạt đúng. Ý tôi không phải làm hỏng quan hệ.",
    model_en: "Perhaps my words did not come out well. I did not mean to harm the relationship.",
    learner_trap: {
      trap_vi: "Nói 'anh/chị hiểu sai' làm người nghe chịu lỗi.",
      trap_en: "Saying 'you misunderstood' puts the fault on the listener.",
      safer_vi: "Nhận trách nhiệm về cách diễn đạt của mình.",
      safer_en: "Take responsibility for your wording.",
    },
  },
  {
    id: "pa_c2_conflict_workplace_sensitivity",
    focus: "workplace_sensitivity",
    context: "workplace",
    title_vi: "Nhạy cảm nơi làm việc mà không đưa lời khuyên",
    title_en: "Workplace sensitivity without advice claims",
    situation_vi: "Một chủ đề nhạy cảm về phân công hoặc khối lượng việc xuất hiện.",
    situation_en: "A sensitive topic about task assignment or workload comes up.",
    language_strategy_vi: "Nói về quan sát và quy trình thảo luận, không khuyên xử lý nhân sự.",
    language_strategy_en: "Talk about observations and discussion process, not HR advice.",
    phrases: [
      {
        gurmukhi: "ਇਹ ਗੱਲ ਸੰਵੇਦਨਸ਼ੀਲ ਹੈ",
        romanization: "ih gall sanvedansheel hai",
        vi: "Việc này nhạy cảm.",
        en: "This matter is sensitive.",
      },
      {
        gurmukhi: "ਆਓ ਇਸ ਨੂੰ ਧਿਆਨ ਨਾਲ ਅਤੇ ਆਦਰ ਨਾਲ ਚਰਚਾ ਕਰੀਏ",
        romanization: "aao is nu dhiaan naal ate aadar naal charcha kariye",
        vi: "Ta hãy thảo luận việc này cẩn thận và tôn trọng.",
        en: "Let's discuss it carefully and respectfully.",
      },
    ],
    model_gurmukhi: "ਇਹ ਗੱਲ ਸੰਵੇਦਨਸ਼ੀਲ ਹੈ, ਇਸ ਲਈ ਆਓ ਇਸ ਨੂੰ ਧਿਆਨ ਨਾਲ ਅਤੇ ਆਦਰ ਨਾਲ ਚਰਚਾ ਕਰੀਏ।",
    model_romanization: "ih gall sanvedansheel hai, is lai aao is nu dhiaan naal ate aadar naal charcha kariye.",
    model_vi: "Việc này nhạy cảm, vì vậy ta hãy thảo luận cẩn thận và tôn trọng.",
    model_en: "This matter is sensitive, so let's discuss it carefully and respectfully.",
  },
  {
    id: "pa_c2_conflict_community_sensitivity",
    focus: "community_sensitivity",
    context: "community",
    title_vi: "Nhạy cảm cộng đồng: tránh đại diện hóa",
    title_en: "Community sensitivity: avoid over-representing",
    situation_vi: "Một người nói như thể cả cộng đồng đều nghĩ giống nhau.",
    situation_en: "Someone speaks as if the whole community thinks the same way.",
    language_strategy_vi: "Mở không gian cho nhiều tiếng nói mà không phủ nhận ai.",
    language_strategy_en: "Open space for multiple voices without dismissing anyone.",
    phrases: [
      {
        gurmukhi: "ਵੱਖ-ਵੱਖ ਅਨੁਭਵ ਹੋ ਸਕਦੇ ਹਨ",
        romanization: "vakh-vakh anubhav ho sakde han",
        vi: "Có thể có nhiều trải nghiệm khác nhau.",
        en: "There may be different experiences.",
      },
      {
        gurmukhi: "ਆਓ ਹੋਰ ਲੋਕਾਂ ਦੀ ਗੱਲ ਵੀ ਸੁਣੀਏ",
        romanization: "aao hor lokan di gall vi sunie",
        vi: "Ta hãy nghe thêm ý kiến của người khác.",
        en: "Let's also hear from other people.",
      },
    ],
    model_gurmukhi: "ਵੱਖ-ਵੱਖ ਅਨੁਭਵ ਹੋ ਸਕਦੇ ਹਨ। ਆਓ ਹੋਰ ਲੋਕਾਂ ਦੀ ਗੱਲ ਵੀ ਸੁਣੀਏ।",
    model_romanization: "vakh-vakh anubhav ho sakde han. aao hor lokan di gall vi sunie.",
    model_vi: "Có thể có nhiều trải nghiệm khác nhau. Ta hãy nghe thêm ý kiến của người khác.",
    model_en: "There may be different experiences. Let's also hear from other people.",
    learner_trap: {
      trap_vi: "Nói 'người Punjabi luôn...' tạo định kiến.",
      trap_en: "Saying 'Punjabi people always...' creates a stereotype.",
      safer_vi: "Nói về trải nghiệm cụ thể hoặc mời thêm tiếng nói.",
      safer_en: "Refer to specific experiences or invite more voices.",
    },
  },
  {
    id: "pa_c2_conflict_public_service_canada",
    focus: "public_service_sensitivity",
    context: "canada_service",
    title_vi: "Giữ bình tĩnh khi giấy tờ ở Canada bị sai",
    title_en: "Stay calm when Canadian paperwork is wrong",
    situation_vi: "Thông tin trong mẫu đơn hoặc lịch hẹn ở Canada bị nhầm.",
    situation_en: "Information in a Canadian form or appointment is incorrect.",
    language_strategy_vi: "Nêu lỗi như điểm cần kiểm tra, rồi xin bước tiếp theo.",
    language_strategy_en: "Present the error as a point to check, then ask for the next step.",
    phrases: [
      {
        gurmukhi: "ਇੱਥੇ ਇੱਕ ਗੱਲ ਮਿਲਦੀ ਨਹੀਂ ਲੱਗ ਰਹੀ",
        romanization: "ithe ikk gall mildi nahin lagg rahi",
        vi: "Ở đây có một điểm có vẻ không khớp.",
        en: "One point here does not seem to match.",
      },
      {
        gurmukhi: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੋਵੇਗਾ?",
        romanization: "agla kadam ki hovega?",
        vi: "Bước tiếp theo sẽ là gì?",
        en: "What would the next step be?",
      },
    ],
    model_gurmukhi: "ਇੱਥੇ ਇੱਕ ਗੱਲ ਮਿਲਦੀ ਨਹੀਂ ਲੱਗ ਰਹੀ। ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ, ਅਗਲਾ ਕਦਮ ਕੀ ਹੋਵੇਗਾ?",
    model_romanization: "ithe ikk gall mildi nahin lagg rahi. kirpa karke dasso, agla kadam ki hovega?",
    model_vi: "Ở đây có một điểm có vẻ không khớp. Xin vui lòng cho biết bước tiếp theo sẽ là gì.",
    model_en: "One point here does not seem to match. Please let me know what the next step would be.",
    canada_practical: true,
  },
  {
    id: "pa_c2_conflict_school_canada_pause",
    focus: "propose_pause",
    context: "canada_service",
    title_vi: "Xin tạm dừng để kiểm tra thông tin trường học",
    title_en: "Ask for a pause to check school information",
    situation_vi: "Trong cuộc trao đổi với trường ở Canada, bạn cần kiểm tra lại giấy tờ hoặc lịch.",
    situation_en: "In an exchange with a Canadian school, you need to check documents or schedule details.",
    language_strategy_vi: "Xin thời gian kiểm tra rồi hứa quay lại với thông tin cụ thể.",
    language_strategy_en: "Ask for time to check, then say you will return with specific information.",
    phrases: [
      {
        gurmukhi: "ਕੀ ਮੈਂ ਇਹ ਜਾਣਕਾਰੀ ਚੈਕ ਕਰਕੇ ਵਾਪਸ ਦੱਸ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
        romanization: "ki main ih jaankaari check karke wapas dass sakda/sakdi haan?",
        vi: "Tôi có thể kiểm tra thông tin này rồi báo lại không?",
        en: "May I check this information and get back to you?",
      },
      {
        gurmukhi: "ਤਾਂ ਜੋ ਸਹੀ ਜਵਾਬ ਦੇ ਸਕਾਂ/ਸਕਾਂ",
        romanization: "taan jo sahi javaab de sakaan",
        vi: "Để tôi có thể trả lời đúng.",
        en: "So I can give the correct answer.",
      },
    ],
    model_gurmukhi: "ਕੀ ਮੈਂ ਇਹ ਜਾਣਕਾਰੀ ਚੈਕ ਕਰਕੇ ਵਾਪਸ ਦੱਸ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ, ਤਾਂ ਜੋ ਸਹੀ ਜਵਾਬ ਦੇ ਸਕਾਂ?",
    model_romanization: "ki main ih jaankaari check karke wapas dass sakda/sakdi haan, taan jo sahi javaab de sakaan?",
    model_vi: "Tôi có thể kiểm tra thông tin này rồi báo lại để trả lời đúng không?",
    model_en: "May I check this information and get back to you so I can give the correct answer?",
    canada_practical: true,
  },
  {
    id: "pa_c2_conflict_script_awareness",
    focus: "public_service_sensitivity",
    context: "education",
    title_vi: "Nói về phạm vi hệ chữ không gây tranh luận",
    title_en: "State script scope without creating debate",
    situation_vi: "Người học hỏi vì sao tài liệu dùng Gurmukhi, không dạy đầy đủ Shahmukhi.",
    situation_en: "A learner asks why the material uses Gurmukhi and does not fully teach Shahmukhi.",
    language_strategy_vi: "Nêu phạm vi học hiện tại và công nhận Shahmukhi ở mức nhận biết.",
    language_strategy_en: "State the current learning scope and acknowledge Shahmukhi at awareness level.",
    phrases: [
      {
        gurmukhi: "ਇਸ ਪਾਠ ਵਿੱਚ ਗੁਰਮੁਖੀ ਮੁੱਖ ਹੈ",
        romanization: "is paath vich Gurmukhi mukh hai",
        vi: "Trong bài này Gurmukhi là chính.",
        en: "In this lesson, Gurmukhi is primary.",
      },
      {
        gurmukhi: "ਸ਼ਾਹਮੁਖੀ ਬਾਰੇ ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਲਈ ਜ਼ਿਕਰ ਹੈ",
        romanization: "Shahmukhi bare sirf jaankaari lai zikar hai",
        vi: "Shahmukhi chỉ được nhắc để nhận biết.",
        en: "Shahmukhi is mentioned only for awareness.",
      },
    ],
    model_gurmukhi: "ਇਸ ਪਾਠ ਵਿੱਚ ਗੁਰਮੁਖੀ ਮੁੱਖ ਹੈ; ਸ਼ਾਹਮੁਖੀ ਬਾਰੇ ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਲਈ ਜ਼ਿਕਰ ਹੈ, ਪੂਰੇ ਕੋਰਸ ਵਾਂਗ ਨਹੀਂ।",
    model_romanization: "is paath vich Gurmukhi mukh hai; Shahmukhi bare sirf jaankaari lai zikar hai, pure course vaang nahin.",
    model_vi: "Trong bài này Gurmukhi là chính; Shahmukhi chỉ được nhắc để nhận biết, không phải như một khóa đầy đủ.",
    model_en: "In this lesson, Gurmukhi is primary; Shahmukhi is mentioned only for awareness, not as a full course.",
  },
];

export const conflictDeescalationC2ByFocus = (
  focus: PunjabiConflictDeescalationFocus,
): PunjabiConflictDeescalationEntry[] =>
  conflictDeescalationC2Entries.filter((entry) => entry.focus === focus);
