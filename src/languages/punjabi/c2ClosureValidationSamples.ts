// Punjabi C2 closure-validation samples for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support closure-validation samples only, not certification,
// official placement, legal/HR/medical/safety advice, or native-reviewed
// authority. Native review is deferred. Shahmukhi is mentioned only for script
// awareness, not as a full course.

export type PunjabiC2ClosureValidationFocus =
  | "nuanced_disagreement"
  | "diplomacy"
  | "mediation"
  | "deescalation"
  | "audience_adaptation"
  | "sensitive_topic_framing"
  | "public_communication_calibration"
  | "register_safety";

export type PunjabiC2ClosureValidationStage = "opening" | "bridge" | "closure";
export type PunjabiC2ClosureValidationStyle =
  | "closure_validation"
  | "final_cross_check"
  | "pre_integration"
  | "readiness";

export type PunjabiC2ClosureValidationPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2ClosureValidationCheck = {
  check_vi: string;
  check_en: string;
  signal_vi: string;
  signal_en: string;
};

export type PunjabiC2ClosureValidationTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2ClosureValidationSample = {
  id: string;
  focus: PunjabiC2ClosureValidationFocus;
  stage: PunjabiC2ClosureValidationStage;
  style: PunjabiC2ClosureValidationStyle;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  closure_goal_vi: string;
  closure_goal_en: string;
  sample_gurmukhi: string;
  sample_romanization: string;
  sample_vi: string;
  sample_en: string;
  closure_phrases: PunjabiC2ClosureValidationPhrase[];
  checks: PunjabiC2ClosureValidationCheck[];
  learner_trap?: PunjabiC2ClosureValidationTrap;
  canada_practical?: boolean;
};

export const C2_CLOSURE_VALIDATION_SAMPLES_DISCLAIMER = {
  vi: "Bộ closure-validation Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi closure-validation sample pack supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const c2ClosureValidationSamples: PunjabiC2ClosureValidationSample[] = [
  {
    id: "pa_c2_closure_nuanced_disagreement",
    focus: "nuanced_disagreement",
    stage: "opening",
    style: "closure_validation",
    title_vi: "Khép bất đồng bằng bước kiểm tra",
    title_en: "Close disagreement with a review step",
    scenario_vi: "Bạn phản biện một kết luận và cần khép lại bằng hành động tiếp theo.",
    scenario_en: "You challenge a conclusion and need to close with a next action.",
    closure_goal_vi: "Công nhận điểm chính, rồi chốt bằng việc xem lại cơ sở.",
    closure_goal_en: "Acknowledge the main point, then close by reviewing the basis.",
    sample_gurmukhi:
      "ਮੁੱਖ ਗੱਲ ਸਮਝ ਆਉਂਦੀ ਹੈ; ਚਲੋ ਫੈਸਲੇ ਤੋਂ ਪਹਿਲਾਂ ਆਧਾਰ ਨੂੰ ਇੱਕ ਵਾਰੀ ਹੋਰ ਮਿਲਾ ਲਈਏ।",
    sample_romanization:
      "mukh gall samajh aundi hai; chalo faisle ton pehlaan aadhaar nu ikk vari hor mila laie.",
    sample_vi:
      "Tôi hiểu ý chính; trước khi quyết định, ta hãy đối chiếu lại cơ sở thêm một lần nữa.",
    sample_en:
      "I understand the main point; before deciding, let's cross-check the basis once more.",
    closure_phrases: [
      {
        gurmukhi: "ਮੁੱਖ ਗੱਲ ਸਮਝ ਆਉਂਦੀ ਹੈ",
        romanization: "mukh gall samajh aundi hai",
        vi: "Tôi hiểu ý chính.",
        en: "I understand the main point.",
      },
      {
        gurmukhi: "ਆਧਾਰ ਨੂੰ ਇੱਕ ਵਾਰੀ ਹੋਰ ਮਿਲਾ ਲਈਏ",
        romanization: "aadhaar nu ikk vari hor mila laie",
        vi: "Hãy đối chiếu lại cơ sở thêm một lần nữa.",
        en: "Let's cross-check the basis once more.",
      },
    ],
    checks: [
      {
        check_vi: "Có khép bằng bước kiểm tra thay vì phủ định không?",
        check_en: "Does it close with a review step instead of rejection?",
        signal_vi: "Có ਸਮਝ ਆਉਂਦੀ ਹੈ rồi ਮਿਲਾ ਲਈਏ.",
        signal_en: "Uses understand, then let's cross-check.",
      },
    ],
    learner_trap: {
      trap_vi: "Kết thúc bằng 'không đồng ý' làm đứt mạch hợp tác.",
      trap_en: "Ending with 'I disagree' breaks the collaborative flow.",
      repair_vi: "Khép bằng bước kiểm tra chung.",
      repair_en: "Close with a shared review step.",
    },
  },
  {
    id: "pa_c2_closure_diplomacy_canada",
    focus: "diplomacy",
    stage: "closure",
    style: "final_cross_check",
    title_vi: "Khép từ chối ngoại giao trong cộng đồng Canada",
    title_en: "Close a diplomatic decline in a Canadian community setting",
    scenario_vi: "Bạn không thể tham gia một sự kiện cộng đồng ở Canada nhưng muốn giữ lời mời sau.",
    scenario_en: "You cannot join a Canadian community event but want to keep a future invitation open.",
    closure_goal_vi: "Cảm ơn, từ chối mềm, và khép bằng lời mở dịp sau.",
    closure_goal_en: "Thank them, decline softly, and close with a future opening.",
    sample_gurmukhi:
      "ਸੱਦੇ ਲਈ ਧੰਨਵਾਦ। ਇਸ ਵਾਰ ਆਉਣਾ ਸੰਭਵ ਨਹੀਂ, ਪਰ ਅਗਲੇ ਮੌਕੇ ਲਈ ਮੈਨੂੰ ਜ਼ਰੂਰ ਦੱਸਣਾ।",
    sample_romanization:
      "sadde lai dhanvaad. is vaar auna sambhav nahin, par agle mauke lai mainu zaroor dassna.",
    sample_vi:
      "Cảm ơn lời mời. Lần này tôi không thể đến, nhưng dịp sau xin hãy báo cho tôi.",
    sample_en:
      "Thank you for the invitation. I cannot come this time, but please let me know for the next opportunity.",
    closure_phrases: [
      {
        gurmukhi: "ਸੱਦੇ ਲਈ ਧੰਨਵਾਦ",
        romanization: "sadde lai dhanvaad",
        vi: "Cảm ơn lời mời.",
        en: "Thank you for the invitation.",
      },
      {
        gurmukhi: "ਅਗਲੇ ਮੌਕੇ ਲਈ",
        romanization: "agle mauke lai",
        vi: "Cho dịp sau.",
        en: "For the next opportunity.",
      },
    ],
    checks: [
      {
        check_vi: "Có kết thúc bằng thiện chí không?",
        check_en: "Does it end with goodwill?",
        signal_vi: "Có ਧੰਨਵਾਦ and ਅਗਲੇ ਮੌਕੇ.",
        signal_en: "Includes thanks and next opportunity.",
      },
    ],
    learner_trap: {
      trap_vi: "Từ chối xong im lặng khiến quan hệ bị lạnh.",
      trap_en: "Declining and stopping there can cool the relationship.",
      repair_vi: "Khép bằng lời mời giữ liên hệ.",
      repair_en: "Close with an invitation to stay connected.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_closure_mediation",
    focus: "mediation",
    stage: "closure",
    style: "closure_validation",
    title_vi: "Khép trung gian bằng tiêu chí chung",
    title_en: "Close mediation with shared criteria",
    scenario_vi: "Hai phía đã được tóm tắt và cần một câu kết không thiên vị.",
    scenario_en: "Two sides have been summarized and need a neutral closing sentence.",
    closure_goal_vi: "Giữ hai phía song song và kết thúc bằng quyết định theo tiêu chí.",
    closure_goal_en: "Keep both sides parallel and end with a criteria-based decision.",
    sample_gurmukhi:
      "ਦੋਵੇਂ ਚਿੰਤਾਵਾਂ ਵਾਜਬ ਹਨ; ਹੁਣ ਸਾਂਝੇ ਮਾਪਦੰਡ ਦੇ ਆਧਾਰ ਤੇ ਅਗਲਾ ਕਦਮ ਚੁਣੀਏ।",
    sample_romanization:
      "dovein chintavan vajab han; hun sanjhe mapdand de aadhaar te agla kadam chunie.",
    sample_vi:
      "Cả hai mối quan tâm đều hợp lý; bây giờ hãy chọn bước tiếp theo dựa trên tiêu chí chung.",
    sample_en:
      "Both concerns are reasonable; now let's choose the next step based on shared criteria.",
    closure_phrases: [
      {
        gurmukhi: "ਦੋਵੇਂ ਚਿੰਤਾਵਾਂ ਵਾਜਬ ਹਨ",
        romanization: "dovein chintavan vajab han",
        vi: "Cả hai mối quan tâm đều hợp lý.",
        en: "Both concerns are reasonable.",
      },
      {
        gurmukhi: "ਸਾਂਝੇ ਮਾਪਦੰਡ ਦੇ ਆਧਾਰ ਤੇ",
        romanization: "sanjhe mapdand de aadhaar te",
        vi: "Dựa trên tiêu chí chung.",
        en: "Based on shared criteria.",
      },
    ],
    checks: [
      {
        check_vi: "Có kết thúc không thiên vị không?",
        check_en: "Does it close without taking sides?",
        signal_vi: "Có ਦੋਵੇਂ and ਸਾਂਝੇ ਮਾਪਦੰਡ.",
        signal_en: "Uses both and shared criteria.",
      },
    ],
    learner_trap: {
      trap_vi: "Kết luận ai đúng ai sai làm mất vai trò trung gian.",
      trap_en: "Concluding who is right or wrong loses the mediator role.",
      repair_vi: "Khép bằng tiêu chí chung và bước tiếp theo.",
      repair_en: "Close with shared criteria and the next step.",
    },
  },
  {
    id: "pa_c2_closure_deescalation",
    focus: "deescalation",
    stage: "closure",
    style: "readiness",
    title_vi: "Khép cuộc họp căng bằng quyết định rõ",
    title_en: "Close a tense meeting with a clear decision",
    scenario_vi: "Cuộc họp đã hạ nhiệt và cần một câu chốt không làm căng lại.",
    scenario_en: "A meeting has cooled down and needs a closing line that does not reignite tension.",
    closure_goal_vi: "Ghi nhận đã nghe, chốt quyết định, và đặt bước tiếp theo.",
    closure_goal_en: "Acknowledge listening, record the decision, and set the next step.",
    sample_gurmukhi:
      "ਸਭ ਦੀ ਗੱਲ ਸੁਣ ਲਈ ਹੈ; ਹੁਣ ਇਹ ਫੈਸਲਾ ਲਿਖ ਲਈਏ ਅਤੇ ਅਗਲੇ ਕਦਮ ਤੇ ਸਹਿਮਤ ਹੋਈਏ।",
    sample_romanization:
      "sabh di gall sun lai hai; hun ih faisla likh laie ate agle kadam te sahimat hoie.",
    sample_vi:
      "Ta đã nghe ý kiến của mọi người; bây giờ hãy ghi quyết định này và thống nhất bước tiếp theo.",
    sample_en:
      "We have heard everyone's point; now let's write down this decision and agree on the next step.",
    closure_phrases: [
      {
        gurmukhi: "ਸਭ ਦੀ ਗੱਲ ਸੁਣ ਲਈ ਹੈ",
        romanization: "sabh di gall sun lai hai",
        vi: "Đã nghe ý kiến của mọi người.",
        en: "Everyone's point has been heard.",
      },
      {
        gurmukhi: "ਅਗਲੇ ਕਦਮ ਤੇ ਸਹਿਮਤ ਹੋਈਏ",
        romanization: "agle kadam te sahimat hoie",
        vi: "Hãy thống nhất bước tiếp theo.",
        en: "Let's agree on the next step.",
      },
    ],
    checks: [
      {
        check_vi: "Có chốt bằng quy trình và bước sau không?",
        check_en: "Does it close with process and a next step?",
        signal_vi: "Có ਸੁਣ ਲਈ ਹੈ, ਫੈਸਲਾ, and ਅਗਲੇ ਕਦਮ.",
        signal_en: "Includes heard, decision, and next step.",
      },
    ],
    learner_trap: {
      trap_vi: "Khơi lại lỗi của ai đó ở cuối cuộc họp.",
      trap_en: "Reopening someone's fault at the end of the meeting.",
      repair_vi: "Chốt bằng điều đã nghe và bước tiếp theo.",
      repair_en: "Close with what was heard and the next step.",
    },
  },
  {
    id: "pa_c2_closure_audience_adaptation_canada",
    focus: "audience_adaptation",
    stage: "bridge",
    style: "pre_integration",
    title_vi: "Khép giải thích cho nhóm đa thế hệ",
    title_en: "Close an explanation for a multi-generational group",
    scenario_vi: "Bạn cần chốt lại một thông báo cho phụ huynh, tình nguyện viên, và người học ở Canada.",
    scenario_en: "You need to close an announcement for parents, volunteers, and learners in Canada.",
    closure_goal_vi: "Giữ ý chính, đơn giản hóa, và kết thúc bằng hành động rõ.",
    closure_goal_en: "Keep the main point, simplify, and end with a clear action.",
    sample_gurmukhi:
      "ਸਧਾਰਨ ਤਰੀਕੇ ਨਾਲ ਕਹੀਏ ਤਾਂ ਸੂਚਨਾ ਪਹਿਲਾਂ ਮਿਲੇਗੀ, ਇਸ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਤਿਆਰੀ ਪੂਰੀ ਰੱਖੋ।",
    sample_romanization:
      "sadharan tarike naal kahiye tan soochna pehlaan milegi, is lai kirpa karke apni tiari poori rakho.",
    sample_vi:
      "Nói đơn giản là thông báo sẽ đến trước, vì vậy xin hãy chuẩn bị đầy đủ.",
    sample_en:
      "Put simply, notice will come in advance, so please keep your preparation ready.",
    closure_phrases: [
      {
        gurmukhi: "ਸਧਾਰਨ ਤਰੀਕੇ ਨਾਲ",
        romanization: "sadharan tarike naal",
        vi: "Theo cách đơn giản hơn.",
        en: "In a simpler way.",
      },
      {
        gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ",
        romanization: "kirpa karke",
        vi: "Xin vui lòng.",
        en: "Please.",
      },
    ],
    checks: [
      {
        check_vi: "Có chốt rõ mà không hạ thấp người nghe không?",
        check_en: "Does it close clearly without talking down to the audience?",
        signal_vi: "Có ਸਧਾਰਨ ਤਰੀਕੇ ਨਾਲ and ਕਿਰਪਾ ਕਰਕੇ.",
        signal_en: "Uses simpler way and please.",
      },
    ],
    learner_trap: {
      trap_vi: "Giải thích quá dài ở phần kết khiến thông điệp bị loãng.",
      trap_en: "Over-explaining at the close dilutes the message.",
      repair_vi: "Chốt bằng ý chính và hành động cụ thể.",
      repair_en: "Close with the main point and a concrete action.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_closure_sensitive_topic",
    focus: "sensitive_topic_framing",
    stage: "closure",
    style: "final_cross_check",
    title_vi: "Khép chủ đề nhạy cảm an toàn",
    title_en: "Close a sensitive topic safely",
    scenario_vi: "Cuộc trao đổi đã chạm vào chính trị, tôn giáo, danh tính cá nhân, hoặc tiền bạc.",
    scenario_en: "The exchange has touched politics, religion, personal identity, or money.",
    closure_goal_vi: "Đặt ranh giới ngắn, không tranh luận lập trường, và quay về nhiệm vụ.",
    closure_goal_en: "Set a short boundary, avoid position debate, and return to the task.",
    sample_gurmukhi:
      "ਇਹ ਵਿਸ਼ਾ ਸੰਵੇਦਨਸ਼ੀਲ ਹੈ; ਇਸ ਲਈ ਇੱਥੇ ਗੱਲ ਨੂੰ ਕੰਮ ਨਾਲ ਜੁੜੇ ਹਿੱਸੇ ਤੇ ਹੀ ਖਤਮ ਕਰੀਏ।",
    sample_romanization:
      "ih visha sanvedansheel hai; is lai ithe gall nu kamm naal jurre hisse te hi khatam karie.",
    sample_vi:
      "Chủ đề này nhạy cảm; vì vậy ở đây ta hãy kết thúc ở phần liên quan đến công việc.",
    sample_en:
      "This topic is sensitive; so here let's close the discussion at the work-related part.",
    closure_phrases: [
      {
        gurmukhi: "ਇਹ ਵਿਸ਼ਾ ਸੰਵੇਦਨਸ਼ੀਲ ਹੈ",
        romanization: "ih visha sanvedansheel hai",
        vi: "Chủ đề này nhạy cảm.",
        en: "This topic is sensitive.",
      },
      {
        gurmukhi: "ਕੰਮ ਨਾਲ ਜੁੜੇ ਹਿੱਸੇ",
        romanization: "kamm naal jurre hisse",
        vi: "Phần liên quan đến công việc.",
        en: "The work-related part.",
      },
    ],
    checks: [
      {
        check_vi: "Có khép chủ đề mà không đưa quan điểm riêng không?",
        check_en: "Does it close the topic without adding a personal stance?",
        signal_vi: "Có ਸੰਵੇਦਨਸ਼ੀਲ and ਕੰਮ ਨਾਲ ਜੁੜੇ.",
        signal_en: "Uses sensitive and work-related.",
      },
    ],
    learner_trap: {
      trap_vi: "Kết thúc bằng quan điểm cá nhân làm mất an toàn register.",
      trap_en: "Ending with a personal stance weakens register safety.",
      repair_vi: "Khép bằng ranh giới ngắn và nhiệm vụ liên quan.",
      repair_en: "Close with a short boundary and the relevant task.",
    },
  },
  {
    id: "pa_c2_closure_public_communication",
    focus: "public_communication_calibration",
    stage: "closure",
    style: "closure_validation",
    title_vi: "Khép thông báo công khai chưa xác nhận",
    title_en: "Close an unconfirmed public notice",
    scenario_vi: "Thông tin chưa chắc, nhưng thông báo cần có câu kết rõ.",
    scenario_en: "Information is not final, but the notice needs a clear closing line.",
    closure_goal_vi: "Nêu trạng thái, điều kiện xác nhận, và lời hứa bước tiếp theo không quá mức.",
    closure_goal_en: "State status, confirmation condition, and a bounded next-step promise.",
    sample_gurmukhi:
      "ਸਮੀਖਿਆ ਜਾਰੀ ਹੈ। ਪੁਸ਼ਟੀ ਹੋਣ ਤੇ ਅਗਲਾ ਕਦਮ ਸਾਂਝਾ ਕਰਾਂਗੇ, ਇਸ ਤੋਂ ਪਹਿਲਾਂ ਅਟਕਲਾਂ ਤੋਂ ਬਚੀਏ।",
    sample_romanization:
      "samikhia jaari hai. pushti hon te agla kadam sanjha karange, is ton pehlaan atklan ton bachie.",
    sample_vi:
      "Việc rà soát đang tiếp tục. Khi được xác nhận, chúng tôi sẽ chia sẻ bước tiếp theo; trước đó hãy tránh suy đoán.",
    sample_en:
      "The review is ongoing. Once confirmed, we will share the next step; until then, let's avoid speculation.",
    closure_phrases: [
      {
        gurmukhi: "ਸਮੀਖਿਆ ਜਾਰੀ ਹੈ",
        romanization: "samikhia jaari hai",
        vi: "Việc rà soát đang tiếp tục.",
        en: "The review is ongoing.",
      },
      {
        gurmukhi: "ਅਟਕਲਾਂ ਤੋਂ ਬਚੀਏ",
        romanization: "atklan ton bachie",
        vi: "Hãy tránh suy đoán.",
        en: "Let's avoid speculation.",
      },
    ],
    checks: [
      {
        check_vi: "Có tránh hứa quá mức ở câu kết không?",
        check_en: "Does the closing avoid overpromising?",
        signal_vi: "Có ਜਾਰੀ ਹੈ, ਪੁਸ਼ਟੀ ਹੋਣ ਤੇ, and ਬਚੀਏ.",
        signal_en: "Includes ongoing, once confirmed, and avoid.",
      },
    ],
    learner_trap: {
      trap_vi: "Khép bằng cam kết chắc khi chưa xác nhận.",
      trap_en: "Closing with certainty before confirmation.",
      repair_vi: "Khép bằng trạng thái hiện tại và điều kiện xác nhận.",
      repair_en: "Close with current status and confirmation condition.",
    },
  },
  {
    id: "pa_c2_closure_register_safety_canada",
    focus: "register_safety",
    stage: "closure",
    style: "readiness",
    title_vi: "Khép email chuyên nghiệp vừa đủ lịch sự",
    title_en: "Close a professional email with enough politeness",
    scenario_vi: "Bạn cần kết thúc email công việc dùng được ở Canada mà không quá xa cách.",
    scenario_en: "You need to close a professional email usable in Canada without sounding distant.",
    closure_goal_vi: "Nhắc bước tiếp theo, cảm ơn ngắn, và giữ register an toàn.",
    closure_goal_en: "Name the next step, give brief thanks, and keep register safe.",
    sample_gurmukhi:
      "ਕਿਰਪਾ ਕਰਕੇ ਜਦੋਂ ਸੁਵਿਧਾ ਹੋਵੇ, ਅਗਲਾ ਕਦਮ ਦੱਸ ਦਿਓ। ਤੁਹਾਡੇ ਸਮੇਂ ਲਈ ਧੰਨਵਾਦ।",
    sample_romanization:
      "kirpa karke jadon suvidha hove, agla kadam dass deo. tuhade same lai dhanvaad.",
    sample_vi:
      "Khi thuận tiện, xin vui lòng cho biết bước tiếp theo. Cảm ơn thời gian của anh/chị.",
    sample_en:
      "When convenient, please let me know the next step. Thank you for your time.",
    closure_phrases: [
      {
        gurmukhi: "ਅਗਲਾ ਕਦਮ",
        romanization: "agla kadam",
        vi: "Bước tiếp theo.",
        en: "Next step.",
      },
      {
        gurmukhi: "ਤੁਹਾਡੇ ਸਮੇਂ ਲਈ ਧੰਨਵਾਦ",
        romanization: "tuhade same lai dhanvaad",
        vi: "Cảm ơn thời gian của anh/chị.",
        en: "Thank you for your time.",
      },
    ],
    checks: [
      {
        check_vi: "Có kết thúc lịch sự nhưng vẫn rõ yêu cầu không?",
        check_en: "Does it close politely while keeping the request clear?",
        signal_vi: "Có ਕਿਰਪਾ ਕਰਕੇ, ਅਗਲਾ ਕਦਮ, and ਧੰਨਵਾਦ.",
        signal_en: "Includes please, next step, and thanks.",
      },
    ],
    learner_trap: {
      trap_vi: "Kết thúc bằng câu quá thân mật cho email công việc.",
      trap_en: "Closing with a line too casual for work email.",
      repair_vi: "Dùng please, bước tiếp theo, và lời cảm ơn ngắn.",
      repair_en: "Use please, the next step, and brief thanks.",
    },
    canada_practical: true,
  },
];

export const c2ClosureValidationSamplesByFocus = (
  focus: PunjabiC2ClosureValidationFocus,
): PunjabiC2ClosureValidationSample[] => c2ClosureValidationSamples.filter((item) => item.focus === focus);

export const c2ClosureValidationSamplesByStage = (
  stage: PunjabiC2ClosureValidationStage,
): PunjabiC2ClosureValidationSample[] => c2ClosureValidationSamples.filter((item) => item.stage === stage);
