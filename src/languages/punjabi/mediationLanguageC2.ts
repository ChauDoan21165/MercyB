// Punjabi C2 mediation language for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support mediation language practice, not legal, HR,
// medical, safety, conflict-resolution, certification, official placement, or
// native-reviewed authority. Native review is deferred. Shahmukhi is mentioned
// only for script awareness, not as a full course.

export type PunjabiC2MediationFocus =
  | "summarize_both_sides"
  | "reduce_tension"
  | "reframe_blame"
  | "shared_goal"
  | "invite_compromise"
  | "preserve_respect"
  | "workplace_conflict"
  | "community_conflict"
  | "public_service_conflict";

export type PunjabiC2MediationMode = "final_quality" | "review" | "remediation" | "readiness";

export type PunjabiC2MediationPhrase = {
  cell_id?: string;
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2MediationCheckpoint = {
  check_vi: string;
  check_en: string;
  ready_signal_vi: string;
  ready_signal_en: string;
};

export type PunjabiC2MediationTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2MediationRemediation = {
  if_missing_vi: string;
  if_missing_en: string;
  next_review_vi: string;
  next_review_en: string;
};

export type PunjabiC2MediationEntry = {
  id: string;
  focus: PunjabiC2MediationFocus;
  mode: PunjabiC2MediationMode;
  title_vi: string;
  title_en: string;
  conflict_context_vi: string;
  conflict_context_en: string;
  mediation_goal_vi: string;
  mediation_goal_en: string;
  phrases: PunjabiC2MediationPhrase[];
  model_gurmukhi: string;
  model_romanization: string;
  model_vi: string;
  model_en: string;
  checkpoints: PunjabiC2MediationCheckpoint[];
  remediation: PunjabiC2MediationRemediation;
  learner_trap?: PunjabiC2MediationTrap;
  canada_practical?: boolean;
};

export const C2_MEDIATION_LANGUAGE_DISCLAIMER = {
  vi: "Gói ngôn ngữ hòa giải Punjabi C2 này chỉ hỗ trợ học tập, không phải tư vấn pháp lý, nhân sự, y tế, an toàn, chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi mediation language pack supports study only, not legal, HR, medical, safety advice, certification, or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const mediationLanguageC2: PunjabiC2MediationEntry[] = [
  {
    id: "pa_c2_mediation_summarize_both_sides",
    focus: "summarize_both_sides",
    mode: "review",
    title_vi: "Tóm tắt hai phía công bằng",
    title_en: "Summarize both sides fairly",
    conflict_context_vi: "Hai người trình bày khác nhau về cùng một việc.",
    conflict_context_en: "Two people describe the same issue differently.",
    mediation_goal_vi: "Nêu mỗi phía muốn gì mà không chọn phe.",
    mediation_goal_en: "State what each side wants without taking sides.",
    phrases: [
      {
        cell_id: "f2a5bf26-2d73-4d9a-a026-9e8422461c56",
        gurmukhi: "ਇੱਕ ਪਾਸੇ ਇਹ ਗੱਲ ਹੈ",
        romanization: "ikk pase ih gall hai",
        vi: "Một phía là việc này.",
        en: "On one side, this is the issue.",
      },
      {
        cell_id: "6a8b115c-7c38-4b83-b7b9-fddca8d9d053",
        gurmukhi: "ਦੂਜੇ ਪਾਸੇ ਇਹ ਚਿੰਤਾ ਹੈ",
        romanization: "duje pase ih chinta hai",
        vi: "Phía kia có lo ngại này.",
        en: "On the other side, this is the concern.",
      },
    ],
    model_gurmukhi:
      "ਇੱਕ ਪਾਸੇ ਸਮੇਂ ਦੀ ਚਿੰਤਾ ਹੈ, ਅਤੇ ਦੂਜੇ ਪਾਸੇ ਕੰਮ ਦੀ ਗੁਣਵੱਤਾ ਦੀ ਚਿੰਤਾ ਹੈ। ਆਓ ਦੋਵੇਂ ਗੱਲਾਂ ਨੂੰ ਸਾਫ਼ ਕਰੀਏ।",
    model_romanization:
      "ikk pase same di chinta hai, ate duje pase kamm di gunvatta di chinta hai. aao dovein gallan nu saaf karie.",
    model_vi:
      "Một phía lo về thời gian, phía kia lo về chất lượng công việc. Ta hãy làm rõ cả hai việc.",
    model_en:
      "One side is concerned about time, and the other side is concerned about work quality. Let's clarify both points.",
    checkpoints: [
      {
        check_vi: "Có nêu cả hai phía không?",
        check_en: "Does it name both sides?",
        ready_signal_vi: "Có ਇੱਕ ਪਾਸੇ và ਦੂਜੇ ਪਾਸੇ.",
        ready_signal_en: "Includes ਇੱਕ ਪਾਸੇ and ਦੂਜੇ ਪਾਸੇ.",
      },
    ],
    remediation: {
      if_missing_vi: "Nếu câu chỉ tóm tắt một bên.",
      if_missing_en: "If the sentence summarizes only one side.",
      next_review_vi: "Ôn lại cấu trúc một phía/phía kia.",
      next_review_en: "Review the one-side/other-side structure.",
    },
    learner_trap: {
      trap_vi: "Dùng từ cho thấy mình đã chọn phe.",
      trap_en: "Using wording that shows you have taken a side.",
      repair_vi: "Tóm tắt nhu cầu hoặc lo ngại của mỗi phía.",
      repair_en: "Summarize each side's need or concern.",
    },
  },
  {
    id: "pa_c2_mediation_reduce_tension",
    focus: "reduce_tension",
    mode: "remediation",
    title_vi: "Giảm căng bằng quy trình",
    title_en: "Reduce tension through process",
    conflict_context_vi: "Hai người nói cùng lúc và giọng đang tăng.",
    conflict_context_en: "Two people speak at once and the tone is rising.",
    mediation_goal_vi: "Đề xuất nghe từng lượt thay vì ra lệnh cảm xúc.",
    mediation_goal_en: "Suggest turn-taking instead of commanding emotion.",
    phrases: [
      {
        cell_id: "a60a5a17-c843-4493-be5f-c47645e72651",
        gurmukhi: "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ",
        romanization: "aao ikk-ikk gall sunie",
        vi: "Ta hãy nghe từng ý một.",
        en: "Let's hear one point at a time.",
      },
      {
        cell_id: "720e5a34-17e0-40e0-ab5d-9251da4712b4",
        gurmukhi: "ਫਿਰ ਗੱਲ ਨੂੰ ਅੱਗੇ ਵਧਾਈਏ",
        romanization: "fir gall nu agge vadhaie",
        vi: "Rồi tiếp tục câu chuyện.",
        en: "Then let's move the conversation forward.",
      },
    ],
    model_gurmukhi:
      "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ। ਫਿਰ ਗੱਲ ਨੂੰ ਸਾਫ਼ ਤਰੀਕੇ ਨਾਲ ਅੱਗੇ ਵਧਾਈਏ।",
    model_romanization:
      "aao ikk-ikk gall sunie. fir gall nu saaf tarike naal agge vadhaie.",
    model_vi:
      "Ta hãy nghe từng ý một. Rồi hãy tiếp tục câu chuyện một cách rõ ràng.",
    model_en:
      "Let's hear one point at a time. Then let's move the conversation forward clearly.",
    checkpoints: [
      {
        check_vi: "Có điều phối lượt nói không?",
        check_en: "Does it coordinate speaking turns?",
        ready_signal_vi: "Có ਇੱਕ-ਇੱਕ hoặc ਬਾਰੀ-ਬਾਰੀ.",
        ready_signal_en: "Includes ਇੱਕ-ਇੱਕ or ਬਾਰੀ-ਬਾਰੀ.",
      },
    ],
    remediation: {
      if_missing_vi: "Nếu câu nói 'bình tĩnh đi'.",
      if_missing_en: "If the sentence says 'calm down'.",
      next_review_vi: "Chuyển thành quy trình nghe từng lượt.",
      next_review_en: "Change it into a turn-taking process.",
    },
    learner_trap: {
      trap_vi: "Ra lệnh cảm xúc có thể làm căng hơn.",
      trap_en: "Commanding emotion can increase tension.",
      repair_vi: "Đề xuất cách tiếp tục cuộc nói chuyện.",
      repair_en: "Suggest how to continue the conversation.",
    },
  },
  {
    id: "pa_c2_mediation_reframe_blame",
    focus: "reframe_blame",
    mode: "review",
    title_vi: "Đổi khung từ lỗi cá nhân sang quy trình",
    title_en: "Reframe blame into process",
    conflict_context_vi: "Nhóm bắt đầu hỏi ai làm sai.",
    conflict_context_en: "The group starts asking who did it wrong.",
    mediation_goal_vi: "Chuyển từ cá nhân sang thông tin, quy trình, và bước kiểm tra.",
    mediation_goal_en: "Move from individuals to information, process, and review steps.",
    phrases: [
      {
        cell_id: "b3ec363e-34f9-443c-b595-58b2e53fdaac",
        gurmukhi: "ਆਓ ਇਸ ਨੂੰ ਵਿਅਕਤੀ ਦੀ ਗਲਤੀ ਨਾ ਬਣਾਈਏ",
        romanization: "aao is nu viakti di galti na banaie",
        vi: "Ta đừng biến việc này thành lỗi cá nhân.",
        en: "Let's not make this an individual fault.",
      },
      {
        cell_id: "bfc9cd60-3822-478b-becd-0f480eb933aa",
        gurmukhi: "ਪ੍ਰਕਿਰਿਆ ਕਿੱਥੇ ਅਸਪਸ਼ਟ ਸੀ?",
        romanization: "prakiria kithe aspasht si?",
        vi: "Quy trình chưa rõ ở đâu?",
        en: "Where was the process unclear?",
      },
    ],
    model_gurmukhi:
      "ਆਓ ਇਸ ਨੂੰ ਵਿਅਕਤੀ ਦੀ ਗਲਤੀ ਨਾ ਬਣਾਈਏ। ਪਹਿਲਾਂ ਵੇਖੀਏ ਕਿ ਪ੍ਰਕਿਰਿਆ ਕਿੱਥੇ ਅਸਪਸ਼ਟ ਸੀ।",
    model_romanization:
      "aao is nu viakti di galti na banaie. pehlan vekhie ki prakiria kithe aspasht si.",
    model_vi:
      "Ta đừng biến việc này thành lỗi cá nhân. Trước hết hãy xem quy trình chưa rõ ở đâu.",
    model_en:
      "Let's not make this an individual fault. First let's see where the process was unclear.",
    checkpoints: [
      {
        check_vi: "Có chuyển sang quy trình không?",
        check_en: "Does it shift to process?",
        ready_signal_vi: "Có ਵਿਅਕਤੀ ਦੀ ਗਲਤੀ ਨਾ và ਪ੍ਰਕਿਰਿਆ.",
        ready_signal_en: "Includes ਵਿਅਕਤੀ ਦੀ ਗਲਤੀ ਨਾ and ਪ੍ਰਕਿਰਿਆ.",
      },
    ],
    remediation: {
      if_missing_vi: "Nếu câu hỏi đầu tiên là 'ai sai?'.",
      if_missing_en: "If the first question is 'who was wrong?'.",
      next_review_vi: "Ôn lại ngôn ngữ quy trình và thông tin trước khi truy lỗi.",
      next_review_en: "Review process and information language before fault-finding.",
    },
    learner_trap: {
      trap_vi: "Hỏi người chịu lỗi quá sớm.",
      trap_en: "Asking for the person at fault too early.",
      repair_vi: "Hỏi quy trình hoặc thông tin còn thiếu.",
      repair_en: "Ask about process or missing information.",
    },
  },
  {
    id: "pa_c2_mediation_shared_goal",
    focus: "shared_goal",
    mode: "readiness",
    title_vi: "Đưa về mục tiêu chung",
    title_en: "Return to the shared goal",
    conflict_context_vi: "Cuộc trao đổi đang tập trung vào thắng thua.",
    conflict_context_en: "The exchange is becoming focused on winning and losing.",
    mediation_goal_vi: "Nhắc mục tiêu chung trước khi đề xuất bước tiếp theo.",
    mediation_goal_en: "Remind everyone of the shared goal before proposing the next step.",
    phrases: [
      {
        cell_id: "eef9d7d2-71d9-435d-81cd-370e43a2fdcb",
        gurmukhi: "ਮਕਸਦ ਸਾਡਾ ਇੱਕੋ ਹੈ",
        romanization: "maqsad sada ikko hai",
        vi: "Mục tiêu của chúng ta là cùng một hướng.",
        en: "Our goal is the same.",
      },
      {
        cell_id: "20b2828b-ad92-48ec-abaa-020ef12850c7",
        gurmukhi: "ਹੱਲ ਲੱਭਣ ਲਈ",
        romanization: "hall labhan lai",
        vi: "Để tìm giải pháp.",
        en: "To find a solution.",
      },
    ],
    model_gurmukhi:
      "ਮਕਸਦ ਸਾਡਾ ਇੱਕੋ ਹੈ: ਹੱਲ ਲੱਭਣਾ। ਇਸ ਲਈ ਆਓ ਅਗਲਾ ਕਦਮ ਮਿਲ ਕੇ ਤੈਅ ਕਰੀਏ।",
    model_romanization:
      "maqsad sada ikko hai: hall labhna. is lai aao agla kadam mil ke tai karie.",
    model_vi:
      "Mục tiêu của chúng ta là cùng một hướng: tìm giải pháp. Vì vậy hãy cùng quyết định bước tiếp theo.",
    model_en:
      "Our goal is the same: finding a solution. So let's decide the next step together.",
    checkpoints: [
      {
        check_vi: "Có mục tiêu chung trước bước tiếp theo không?",
        check_en: "Is the shared goal before the next step?",
        ready_signal_vi: "Có ਮਕਸਦ and ਹੱਲ.",
        ready_signal_en: "Includes ਮਕਸਦ and ਹੱਲ.",
      },
    ],
    remediation: {
      if_missing_vi: "Nếu câu chỉ tập trung thắng/thua.",
      if_missing_en: "If the sentence focuses only on winning/losing.",
      next_review_vi: "Thêm mục tiêu chung và bước tiếp theo.",
      next_review_en: "Add a shared goal and next step.",
    },
  },
  {
    id: "pa_c2_mediation_invite_compromise",
    focus: "invite_compromise",
    mode: "final_quality",
    title_vi: "Mời thỏa hiệp có điều kiện",
    title_en: "Invite conditional compromise",
    conflict_context_vi: "Hai bên có yêu cầu khác nhau nhưng cùng muốn tiếp tục.",
    conflict_context_en: "Both sides have different requests but want to continue.",
    mediation_goal_vi: "Đề xuất lựa chọn giữa hai cực, có điều kiện rõ.",
    mediation_goal_en: "Propose a middle option with a clear condition.",
    phrases: [
      {
        cell_id: "5347450e-164d-4640-87f5-2b22ae6fb012",
        gurmukhi: "ਕੀ ਵਿਚਕਾਰਲਾ ਰਾਹ ਹੋ ਸਕਦਾ ਹੈ?",
        romanization: "ki vichkarla raah ho sakda hai?",
        vi: "Có thể có cách ở giữa không?",
        en: "Could there be a middle path?",
      },
      {
        cell_id: "f4c90b92-844e-4f85-b0db-acdb7dead9f6",
        gurmukhi: "ਜੇ ਦੋਵੇਂ ਪਾਸੇ ਸਹਿਮਤ ਹੋਣ",
        romanization: "je dovein pase sahimat hon",
        vi: "Nếu cả hai phía đồng ý.",
        en: "If both sides agree.",
      },
    ],
    model_gurmukhi:
      "ਕੀ ਵਿਚਕਾਰਲਾ ਰਾਹ ਹੋ ਸਕਦਾ ਹੈ? ਜੇ ਦੋਵੇਂ ਪਾਸੇ ਸਹਿਮਤ ਹੋਣ, ਅਸੀਂ ਪਹਿਲਾਂ ਛੋਟਾ ਪੜਾਅ ਅਜ਼ਮਾ ਸਕਦੇ ਹਾਂ।",
    model_romanization:
      "ki vichkarla raah ho sakda hai? je dovein pase sahimat hon, asin pehlan chhota paraa azma sakde haan.",
    model_vi:
      "Có thể có cách ở giữa không? Nếu cả hai phía đồng ý, trước hết chúng ta có thể thử một giai đoạn nhỏ.",
    model_en:
      "Could there be a middle path? If both sides agree, we could first try a small phase.",
    checkpoints: [
      {
        check_vi: "Có mời thỏa hiệp mà không ép không?",
        check_en: "Does it invite compromise without pressure?",
        ready_signal_vi: "Có ਵਿਚਕਾਰਲਾ ਰਾਹ và ਜੇ.",
        ready_signal_en: "Includes ਵਿਚਕਾਰਲਾ ਰਾਹ and ਜੇ.",
      },
    ],
    remediation: {
      if_missing_vi: "Nếu câu ép một phía nhượng bộ.",
      if_missing_en: "If the sentence pressures one side to concede.",
      next_review_vi: "Chuyển thành đề nghị có điều kiện cho cả hai phía.",
      next_review_en: "Turn it into a conditional proposal for both sides.",
    },
    learner_trap: {
      trap_vi: "Gọi thỏa hiệp là 'bên kia phải nhường'.",
      trap_en: "Framing compromise as 'the other side must give in'.",
      repair_vi: "Dùng ਵਿਚਕਾਰਲਾ ਰਾਹ và điều kiện cả hai đồng ý.",
      repair_en: "Use ਵਿਚਕਾਰਲਾ ਰਾਹ and the condition that both sides agree.",
    },
  },
  {
    id: "pa_c2_mediation_preserve_respect",
    focus: "preserve_respect",
    mode: "review",
    title_vi: "Giữ thể diện và sự tôn trọng",
    title_en: "Preserve respect and face",
    conflict_context_vi: "Một người cảm thấy ý của mình bị bỏ qua.",
    conflict_context_en: "Someone feels their point has been ignored.",
    mediation_goal_vi: "Công nhận ý của người đó trước khi chuyển sang giải pháp.",
    mediation_goal_en: "Acknowledge the point before moving to a solution.",
    phrases: [
      {
        cell_id: "719dc692-5a2a-4b6f-8799-8fb8aa831767",
        gurmukhi: "ਤੁਹਾਡੀ ਗੱਲ ਦੀ ਕਦਰ ਹੈ",
        romanization: "tuhadi gall di kadar hai",
        vi: "Tôi trân trọng ý của anh/chị.",
        en: "I value your point.",
      },
      {
        cell_id: "6bafbc68-edc2-41a6-a23e-93be194de4ac",
        gurmukhi: "ਇਸ ਨੂੰ ਹੱਲ ਨਾਲ ਜੋੜੀਏ",
        romanization: "is nu hall naal jorie",
        vi: "Ta nối việc này với giải pháp.",
        en: "Let's connect this to the solution.",
      },
    ],
    model_gurmukhi:
      "ਤੁਹਾਡੀ ਗੱਲ ਦੀ ਕਦਰ ਹੈ। ਆਓ ਇਸ ਨੂੰ ਹੱਲ ਨਾਲ ਜੋੜੀਏ ਤਾਂ ਜੋ ਗੱਲ ਅੱਗੇ ਵਧੇ।",
    model_romanization:
      "tuhadi gall di kadar hai. aao is nu hall naal jorie taan jo gall agge vadhe.",
    model_vi:
      "Tôi trân trọng ý của anh/chị. Ta hãy nối việc này với giải pháp để câu chuyện tiến lên.",
    model_en:
      "I value your point. Let's connect this to the solution so the conversation can move forward.",
    checkpoints: [
      {
        check_vi: "Có công nhận trước khi chuyển hướng không?",
        check_en: "Does it acknowledge before redirecting?",
        ready_signal_vi: "Có ਕਦਰ before ਹੱਲ.",
        ready_signal_en: "Includes ਕਦਰ before ਹੱਲ.",
      },
    ],
    remediation: {
      if_missing_vi: "Nếu câu bỏ qua cảm giác bị nghe thiếu.",
      if_missing_en: "If the sentence ignores the feeling of not being heard.",
      next_review_vi: "Thêm công nhận ý trước khi đề xuất giải pháp.",
      next_review_en: "Add acknowledgement before proposing a solution.",
    },
    learner_trap: {
      trap_vi: "Nói 'chuyện đó không quan trọng' làm mất tôn trọng.",
      trap_en: "Saying 'that does not matter' removes respect.",
      repair_vi: "Nói ਕਦਰ rồi chuyển sang ਹੱਲ.",
      repair_en: "Say ਕਦਰ, then move to ਹੱਲ.",
    },
  },
  {
    id: "pa_c2_mediation_workplace_conflict",
    focus: "workplace_conflict",
    mode: "readiness",
    title_vi: "Hòa giải xung đột nơi làm việc",
    title_en: "Mediate workplace conflict",
    conflict_context_vi: "Hai đồng nghiệp bất đồng về trách nhiệm sau lỗi quy trình.",
    conflict_context_en: "Two coworkers disagree about responsibility after a process error.",
    mediation_goal_vi: "Giữ trách nhiệm, tránh đổ lỗi cá nhân, và đề xuất xem lại quy trình.",
    mediation_goal_en: "Keep accountability, avoid personal blame, and propose reviewing the process.",
    phrases: [
      {
        cell_id: "f6a5811e-0404-4a60-acd3-49cdc7082054",
        gurmukhi: "ਜ਼ਿੰਮੇਵਾਰੀ ਸਪਸ਼ਟ ਕਰਨੀ ਜ਼ਰੂਰੀ ਹੈ",
        romanization: "zimmedari spasht karni zaruri hai",
        vi: "Cần làm rõ trách nhiệm.",
        en: "It is important to clarify responsibility.",
      },
      {
        cell_id: "3eb138fe-f138-40fb-b199-93af860c44c2",
        gurmukhi: "ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਮੁੜ ਵੇਖੀਏ",
        romanization: "prakiria nu mur vekhie",
        vi: "Hãy xem lại quy trình.",
        en: "Let's review the process.",
      },
    ],
    model_gurmukhi:
      "ਜ਼ਿੰਮੇਵਾਰੀ ਸਪਸ਼ਟ ਕਰਨੀ ਜ਼ਰੂਰੀ ਹੈ, ਪਰ ਆਓ ਪਹਿਲਾਂ ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਮੁੜ ਵੇਖੀਏ ਅਤੇ ਅਗਲਾ ਕਦਮ ਲਿਖੀਏ।",
    model_romanization:
      "zimmedari spasht karni zaruri hai, par aao pehlan prakiria nu mur vekhie ate agla kadam likhie.",
    model_vi:
      "Cần làm rõ trách nhiệm, nhưng trước hết hãy xem lại quy trình và viết bước tiếp theo.",
    model_en:
      "It is important to clarify responsibility, but first let's review the process and write the next step.",
    checkpoints: [
      {
        check_vi: "Có cân bằng trách nhiệm và quy trình không?",
        check_en: "Does it balance accountability and process?",
        ready_signal_vi: "Có ਜ਼ਿੰਮੇਵਾਰੀ and ਪ੍ਰਕਿਰਿਆ.",
        ready_signal_en: "Includes ਜ਼ਿੰਮੇਵਾਰੀ and ਪ੍ਰਕਿਰਿਆ.",
      },
    ],
    remediation: {
      if_missing_vi: "Nếu câu chỉ truy lỗi cá nhân.",
      if_missing_en: "If the sentence only assigns personal blame.",
      next_review_vi: "Ôn lại trách nhiệm + quy trình + bước tiếp theo.",
      next_review_en: "Review accountability + process + next step.",
    },
    learner_trap: {
      trap_vi: "Tránh chữ trách nhiệm hoàn toàn nên câu quá mơ hồ.",
      trap_en: "Avoiding accountability entirely makes the sentence vague.",
      repair_vi: "Nói trách nhiệm cần rõ, rồi chuyển sang quy trình.",
      repair_en: "Say accountability needs clarity, then shift to process.",
    },
  },
  {
    id: "pa_c2_mediation_community_conflict_canada",
    focus: "community_conflict",
    mode: "final_quality",
    title_vi: "Hòa giải xung đột cộng đồng ở Canada",
    title_en: "Mediate community conflict in Canada",
    conflict_context_vi: "Nhóm tình nguyện ở Canada bất đồng về ngày và vai trò sự kiện.",
    conflict_context_en: "A volunteer group in Canada disagrees about event dates and roles.",
    mediation_goal_vi: "Tóm tắt đồng thuận, tránh định kiến vai trò, và mời chọn theo khả năng.",
    mediation_goal_en: "Summarize agreement, avoid role stereotypes, and invite choices by capacity.",
    phrases: [
      {
        cell_id: "6a503a83-bdb8-413e-8206-4c049c450548",
        gurmukhi: "ਹੁਣ ਤੱਕ ਸਹਿਮਤੀ ਇਹ ਹੈ",
        romanization: "hun takk sahimati ih hai",
        vi: "Đến giờ, điểm đồng thuận là...",
        en: "So far, the agreement is...",
      },
      {
        cell_id: "02cfa990-ae1a-4af5-a5de-cc8dbd394c09",
        gurmukhi: "ਰੁਚੀ ਅਤੇ ਸਮੇਂ ਦੇ ਅਨੁਸਾਰ",
        romanization: "ruchi ate same de anusaar",
        vi: "Theo sở thích và thời gian.",
        en: "According to interest and availability.",
      },
    ],
    model_gurmukhi:
      "ਹੁਣ ਤੱਕ ਸਹਿਮਤੀ ਇਹ ਹੈ ਕਿ ਸਮਾਗਮ ਹਫ਼ਤੇ ਦੇ ਅੰਤ ਹੋਵੇ। ਕੰਮ ਰੁਚੀ ਅਤੇ ਸਮੇਂ ਦੇ ਅਨੁਸਾਰ ਵੰਡ ਲਈਏ।",
    model_romanization:
      "hun takk sahimati ih hai ki samagam hafte de ant hove. kamm ruchi ate same de anusaar vand laie.",
    model_vi:
      "Đến giờ, điểm đồng thuận là sự kiện vào cuối tuần. Ta hãy chia việc theo sở thích và thời gian.",
    model_en:
      "So far, the agreement is that the event should be on the weekend. Let's divide the work by interest and availability.",
    checkpoints: [
      {
        check_vi: "Có đồng thuận và tiêu chí trung tính không?",
        check_en: "Does it include agreement and neutral criteria?",
        ready_signal_vi: "Có ਸਹਿਮਤੀ and ਰੁਚੀ.",
        ready_signal_en: "Includes ਸਹਿਮਤੀ and ਰੁਚੀ.",
      },
    ],
    remediation: {
      if_missing_vi: "Nếu câu gán việc theo tuổi, giới, hoặc gia đình.",
      if_missing_en: "If the sentence assigns roles by age, gender, or family.",
      next_review_vi: "Ôn lại tiêu chí sở thích, thời gian, và sự thoải mái.",
      next_review_en: "Review interest, availability, and comfort criteria.",
    },
    learner_trap: {
      trap_vi: "Dùng định kiến vai trò để giải quyết nhanh.",
      trap_en: "Using role stereotypes to settle things quickly.",
      repair_vi: "Mời chọn theo khả năng và thời gian.",
      repair_en: "Invite choices by capacity and availability.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_mediation_public_service_conflict_canada",
    focus: "public_service_conflict",
    mode: "readiness",
    title_vi: "Hòa giải căng thẳng tại dịch vụ công",
    title_en: "Mediate tension at a public service desk",
    conflict_context_vi: "Ở Canada, người học thiếu giấy tờ và cuộc trao đổi với nhân viên trở nên căng.",
    conflict_context_en: "In Canada, the learner lacks a document and the exchange with staff becomes tense.",
    mediation_goal_vi: "Thừa nhận quy định, nêu giấy tờ đang có, và hỏi bước tiếp theo.",
    mediation_goal_en: "Acknowledge the rule, state available documents, and ask for the next step.",
    phrases: [
      {
        cell_id: "9654eb06-3fec-4d94-862a-a6c3d4e319c1",
        gurmukhi: "ਮੈਨੂੰ ਨਿਯਮ ਦੀ ਸਮਝ ਹੈ",
        romanization: "mainu niyam di samajh hai",
        vi: "Tôi hiểu quy định.",
        en: "I understand the rule.",
      },
      {
        cell_id: "92cb8d2d-adea-4ac8-b208-c97f1aabd1b2",
        gurmukhi: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
        romanization: "agla kadam ki ho sakda hai?",
        vi: "Bước tiếp theo có thể là gì?",
        en: "What could the next step be?",
      },
    ],
    model_gurmukhi:
      "ਮੈਨੂੰ ਨਿਯਮ ਦੀ ਸਮਝ ਹੈ। ਇਸ ਵੇਲੇ ਮੇਰੇ ਕੋਲ ਕਾਪੀ ਹੈ; ਅਗਲਾ ਕਦਮ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
    model_romanization:
      "mainu niyam di samajh hai. is vele mere kol copy hai; agla kadam ki ho sakda hai?",
    model_vi:
      "Tôi hiểu quy định. Hiện tôi có bản sao; bước tiếp theo có thể là gì?",
    model_en:
      "I understand the rule. Right now I have a copy; what could the next step be?",
    checkpoints: [
      {
        check_vi: "Có hạ căng bằng quy định + bước tiếp theo không?",
        check_en: "Does it reduce tension through rule + next step?",
        ready_signal_vi: "Có ਨਿਯਮ ਦੀ ਸਮਝ and ਅਗਲਾ ਕਦਮ.",
        ready_signal_en: "Includes ਨਿਯਮ ਦੀ ਸਮਝ and ਅਗਲਾ ਕਦਮ.",
      },
    ],
    remediation: {
      if_missing_vi: "Nếu câu nghe như chống lại quy định.",
      if_missing_en: "If the sentence sounds like arguing against the rule.",
      next_review_vi: "Bắt đầu bằng hiểu quy định, sau đó hỏi bước tiếp theo.",
      next_review_en: "Start with understanding the rule, then ask for the next step.",
    },
    learner_trap: {
      trap_vi: "Chỉ nói 'tôi không có giấy đó' rồi dừng.",
      trap_en: "Only saying 'I do not have that document' and stopping.",
      repair_vi: "Nêu cái đang có rồi hỏi bước tiếp theo.",
      repair_en: "State what you have, then ask for the next step.",
    },
    canada_practical: true,
  },
];

export const mediationLanguageC2ByFocus = (
  focus: PunjabiC2MediationFocus,
): PunjabiC2MediationEntry[] =>
  mediationLanguageC2.filter((entry) => entry.focus === focus);
