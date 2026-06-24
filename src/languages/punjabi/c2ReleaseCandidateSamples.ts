// Punjabi C2 release-candidate samples for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support release-candidate samples only, not certification,
// official placement, legal/HR/medical/safety advice, or native-reviewed
// authority. Native review is deferred. Shahmukhi is mentioned only for script
// awareness, not as a full course.

export type PunjabiC2ReleaseCandidateFocus =
  | "nuanced_disagreement"
  | "diplomacy"
  | "mediation"
  | "deescalation"
  | "audience_adaptation"
  | "sensitive_topic_framing"
  | "public_communication_calibration"
  | "register_safety";

export type PunjabiC2ReleaseCandidateContext = "public" | "professional" | "community";
export type PunjabiC2ReleaseCandidateStyle =
  | "release_candidate"
  | "closure_validation"
  | "pre_integration"
  | "readiness";

export type PunjabiC2ReleaseCandidatePhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2ReleaseCandidateCheck = {
  check_vi: string;
  check_en: string;
  signal_vi: string;
  signal_en: string;
};

export type PunjabiC2ReleaseCandidateTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2ReleaseCandidateSample = {
  id: string;
  focus: PunjabiC2ReleaseCandidateFocus;
  context: PunjabiC2ReleaseCandidateContext;
  style: PunjabiC2ReleaseCandidateStyle;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  readiness_goal_vi: string;
  readiness_goal_en: string;
  sample_gurmukhi: string;
  sample_romanization: string;
  sample_vi: string;
  sample_en: string;
  release_phrases: PunjabiC2ReleaseCandidatePhrase[];
  checks: PunjabiC2ReleaseCandidateCheck[];
  learner_trap?: PunjabiC2ReleaseCandidateTrap;
  canada_practical?: boolean;
};

export const C2_RELEASE_CANDIDATE_SAMPLES_DISCLAIMER = {
  vi: "Bộ release-candidate Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi release-candidate sample pack supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const c2ReleaseCandidateSamples: PunjabiC2ReleaseCandidateSample[] = [
  {
    id: "pa_c2_rc_nuanced_disagreement_professional",
    focus: "nuanced_disagreement",
    context: "professional",
    style: "release_candidate",
    title_vi: "Ứng viên phát hành: bất đồng tinh tế",
    title_en: "Release candidate: nuanced disagreement",
    scenario_vi: "Bạn cần phản biện một đề xuất trong cuộc họp chuyên nghiệp mà vẫn giữ hợp tác.",
    scenario_en: "You need to challenge a proposal in a professional meeting while preserving cooperation.",
    readiness_goal_vi: "Công nhận mục tiêu, kiểm tra cơ sở, rồi chốt bước sau.",
    readiness_goal_en: "Validate the goal, check the basis, then close with a next step.",
    sample_gurmukhi:
      "ਮਕਸਦ ਠੀਕ ਲੱਗਦਾ ਹੈ, ਪਰ ਫੈਸਲੇ ਤੋਂ ਪਹਿਲਾਂ ਆਧਾਰ ਨੂੰ ਇੱਕ ਵਾਰੀ ਹੋਰ ਵੇਖੀਏ।",
    sample_romanization:
      "maqsad theek lagda hai, par faisle ton pehlaan aadhaar nu ikk vari hor vekhie.",
    sample_vi:
      "Mục tiêu có vẻ đúng, nhưng trước khi quyết định ta hãy xem lại cơ sở một lần nữa.",
    sample_en:
      "The goal seems sound, but before deciding let's review the basis once more.",
    release_phrases: [
      {
        gurmukhi: "ਮਕਸਦ ਠੀਕ ਲੱਗਦਾ ਹੈ",
        romanization: "maqsad theek lagda hai",
        vi: "Mục tiêu có vẻ đúng.",
        en: "The goal seems sound.",
      },
      {
        gurmukhi: "ਫੈਸਲੇ ਤੋਂ ਪਹਿਲਾਂ",
        romanization: "faisle ton pehlaan",
        vi: "Trước khi quyết định.",
        en: "Before deciding.",
      },
    ],
    checks: [
      {
        check_vi: "Có phản biện mà vẫn giữ công nhận không?",
        check_en: "Does it challenge while preserving validation?",
        signal_vi: "Có ਮਕਸਦ ਠੀਕ then ਆਧਾਰ ਨੂੰ ਵੇਖੀਏ.",
        signal_en: "Uses goal seems sound, then review the basis.",
      },
    ],
    learner_trap: {
      trap_vi: "Mở bằng phủ định trực diện làm câu quá gắt.",
      trap_en: "Opening with direct negation makes the sentence too sharp.",
      repair_vi: "Công nhận mục tiêu rồi kiểm tra cơ sở.",
      repair_en: "Validate the goal, then check the basis.",
    },
  },
  {
    id: "pa_c2_rc_diplomacy_community_canada",
    focus: "diplomacy",
    context: "community",
    style: "closure_validation",
    title_vi: "Ứng viên phát hành: từ chối ngoại giao",
    title_en: "Release candidate: diplomatic decline",
    scenario_vi: "Bạn không thể tham gia hoạt động cộng đồng ở Canada nhưng muốn giữ liên hệ.",
    scenario_en: "You cannot join a Canadian community activity but want to stay connected.",
    readiness_goal_vi: "Cảm ơn, từ chối mềm, và giữ lời mở dịp sau.",
    readiness_goal_en: "Thank them, decline softly, and keep a later opening.",
    sample_gurmukhi:
      "ਸੱਦੇ ਲਈ ਧੰਨਵਾਦ। ਇਸ ਵਾਰ ਆਉਣਾ ਸੰਭਵ ਨਹੀਂ, ਪਰ ਅਗਲੇ ਮੌਕੇ ਲਈ ਮੈਨੂੰ ਜ਼ਰੂਰ ਦੱਸੋ।",
    sample_romanization:
      "sadde lai dhanvaad. is vaar auna sambhav nahin, par agle mauke lai mainu zaroor dasso.",
    sample_vi:
      "Cảm ơn lời mời. Lần này tôi không thể đến, nhưng dịp sau xin hãy báo cho tôi.",
    sample_en:
      "Thank you for the invitation. I cannot come this time, but please let me know for the next opportunity.",
    release_phrases: [
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
        check_en: "Does it close with goodwill?",
        signal_vi: "Có ਧੰਨਵਾਦ and ਅਗਲੇ ਮੌਕੇ.",
        signal_en: "Includes thanks and next opportunity.",
      },
    ],
    learner_trap: {
      trap_vi: "Từ chối quá ngắn nghe như cắt liên hệ.",
      trap_en: "A too-short decline can sound like cutting contact.",
      repair_vi: "Thêm cảm ơn và lời mở lần sau.",
      repair_en: "Add thanks and a next-time opening.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_rc_mediation_public",
    focus: "mediation",
    context: "public",
    style: "release_candidate",
    title_vi: "Ứng viên phát hành: trung gian công khai",
    title_en: "Release candidate: public mediation",
    scenario_vi: "Hai nhóm có ưu tiên khác nhau và cần một câu chốt không thiên vị.",
    scenario_en: "Two groups have different priorities and need a neutral closing line.",
    readiness_goal_vi: "Giữ hai phía cân bằng và chọn bước sau theo tiêu chí chung.",
    readiness_goal_en: "Keep both sides balanced and choose the next step by shared criteria.",
    sample_gurmukhi:
      "ਦੋਵੇਂ ਚਿੰਤਾਵਾਂ ਵਾਜਬ ਹਨ; ਆਓ ਸਾਂਝੇ ਮਾਪਦੰਡ ਦੇ ਆਧਾਰ ਤੇ ਅਗਲਾ ਕਦਮ ਚੁਣੀਏ।",
    sample_romanization:
      "dovein chintavan vajab han; aao sanjhe mapdand de aadhaar te agla kadam chunie.",
    sample_vi:
      "Cả hai mối quan tâm đều hợp lý; hãy chọn bước tiếp theo dựa trên tiêu chí chung.",
    sample_en:
      "Both concerns are reasonable; let's choose the next step based on shared criteria.",
    release_phrases: [
      {
        gurmukhi: "ਦੋਵੇਂ ਚਿੰਤਾਵਾਂ ਵਾਜਬ ਹਨ",
        romanization: "dovein chintavan vajab han",
        vi: "Cả hai mối quan tâm đều hợp lý.",
        en: "Both concerns are reasonable.",
      },
      {
        gurmukhi: "ਸਾਂਝੇ ਮਾਪਦੰਡ",
        romanization: "sanjhe mapdand",
        vi: "Tiêu chí chung.",
        en: "Shared criteria.",
      },
    ],
    checks: [
      {
        check_vi: "Có tránh chọn phe không?",
        check_en: "Does it avoid taking sides?",
        signal_vi: "Có ਦੋਵੇਂ and ਸਾਂਝੇ ਮਾਪਦੰਡ.",
        signal_en: "Uses both and shared criteria.",
      },
    ],
    learner_trap: {
      trap_vi: "Chốt ai đúng ai sai làm mất trung lập.",
      trap_en: "Closing with who is right or wrong loses neutrality.",
      repair_vi: "Chốt bằng tiêu chí chung.",
      repair_en: "Close with shared criteria.",
    },
  },
  {
    id: "pa_c2_rc_deescalation_professional",
    focus: "deescalation",
    context: "professional",
    style: "readiness",
    title_vi: "Ứng viên phát hành: hạ nhiệt cuộc họp",
    title_en: "Release candidate: meeting de-escalation",
    scenario_vi: "Cuộc họp căng cần được đưa về quyết định rõ ràng.",
    scenario_en: "A tense meeting needs to return to a clear decision.",
    readiness_goal_vi: "Ghi nhận đã nghe, viết quyết định, và thống nhất bước sau.",
    readiness_goal_en: "Acknowledge listening, write the decision, and agree on the next step.",
    sample_gurmukhi:
      "ਸਭ ਦੀ ਗੱਲ ਸੁਣ ਲਈ ਹੈ; ਹੁਣ ਫੈਸਲਾ ਸਾਫ਼ ਲਿਖੀਏ ਅਤੇ ਅਗਲੇ ਕਦਮ ਤੇ ਸਹਿਮਤ ਹੋਈਏ।",
    sample_romanization:
      "sabh di gall sun lai hai; hun faisla saaf likhie ate agle kadam te sahimat hoie.",
    sample_vi:
      "Ta đã nghe ý kiến của mọi người; bây giờ hãy viết rõ quyết định và thống nhất bước tiếp theo.",
    sample_en:
      "Everyone's point has been heard; now let's write the decision clearly and agree on the next step.",
    release_phrases: [
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
        check_vi: "Có hạ nhiệt bằng quy trình không?",
        check_en: "Does it de-escalate through process?",
        signal_vi: "Có ਸੁਣ ਲਈ ਹੈ, ਫੈਸਲਾ, and ਅਗਲੇ ਕਦਮ.",
        signal_en: "Includes heard, decision, and next step.",
      },
    ],
    learner_trap: {
      trap_vi: "Nhắc lại lỗi cá nhân ở cuối làm căng lại.",
      trap_en: "Repeating personal fault at the end can reignite tension.",
      repair_vi: "Chốt bằng quyết định và bước tiếp theo.",
      repair_en: "Close with the decision and next step.",
    },
  },
  {
    id: "pa_c2_rc_audience_adaptation_canada",
    focus: "audience_adaptation",
    context: "community",
    style: "pre_integration",
    title_vi: "Ứng viên phát hành: điều chỉnh cho nhóm đa thế hệ",
    title_en: "Release candidate: adaptation for a multi-generational group",
    scenario_vi: "Bạn cần thông báo cho phụ huynh, tình nguyện viên, và người học ở Canada.",
    scenario_en: "You need to notify parents, volunteers, and learners in Canada.",
    readiness_goal_vi: "Giữ ý chính, đơn giản hóa, và kết thúc bằng hành động rõ.",
    readiness_goal_en: "Keep the core point, simplify, and end with a clear action.",
    sample_gurmukhi:
      "ਸਧਾਰਨ ਤਰੀਕੇ ਨਾਲ ਕਹੀਏ ਤਾਂ ਸੂਚਨਾ ਪਹਿਲਾਂ ਮਿਲੇਗੀ, ਇਸ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਤਿਆਰੀ ਪੂਰੀ ਰੱਖੋ।",
    sample_romanization:
      "sadharan tarike naal kahiye tan soochna pehlaan milegi, is lai kirpa karke tiari poori rakho.",
    sample_vi:
      "Nói đơn giản là thông báo sẽ đến trước, vì vậy xin hãy chuẩn bị đầy đủ.",
    sample_en:
      "Put simply, notice will come in advance, so please keep your preparation ready.",
    release_phrases: [
      {
        gurmukhi: "ਸਧਾਰਨ ਤਰੀਕੇ ਨਾਲ",
        romanization: "sadharan tarike naal",
        vi: "Theo cách đơn giản hơn.",
        en: "In a simpler way.",
      },
      {
        gurmukhi: "ਤਿਆਰੀ ਪੂਰੀ ਰੱਖੋ",
        romanization: "tiari poori rakho",
        vi: "Hãy chuẩn bị đầy đủ.",
        en: "Keep your preparation ready.",
      },
    ],
    checks: [
      {
        check_vi: "Có đơn giản hóa mà không hạ thấp người nghe không?",
        check_en: "Does it simplify without talking down to the audience?",
        signal_vi: "Có ਸਧਾਰਨ ਤਰੀਕੇ ਨਾਲ and ਕਿਰਪਾ ਕਰਕੇ.",
        signal_en: "Uses simpler way and please.",
      },
    ],
    learner_trap: {
      trap_vi: "Dùng thuật ngữ nội bộ khiến nhóm đa thế hệ khó theo.",
      trap_en: "Internal jargon makes the message hard for a multi-generational group.",
      repair_vi: "Giữ ý chính và dùng hành động rõ.",
      repair_en: "Keep the main point and use a clear action.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_rc_sensitive_topic_public",
    focus: "sensitive_topic_framing",
    context: "public",
    style: "closure_validation",
    title_vi: "Ứng viên phát hành: chủ đề nhạy cảm",
    title_en: "Release candidate: sensitive topic framing",
    scenario_vi: "Trao đổi công khai chạm vào chính trị, tôn giáo, tiền bạc, hoặc danh tính cá nhân.",
    scenario_en: "A public exchange touches politics, religion, money, or personal identity.",
    readiness_goal_vi: "Đặt ranh giới ngắn và quay lại phần liên quan nhiệm vụ.",
    readiness_goal_en: "Set a short boundary and return to the task-relevant part.",
    sample_gurmukhi:
      "ਇਹ ਵਿਸ਼ਾ ਸੰਵੇਦਨਸ਼ੀਲ ਹੋ ਸਕਦਾ ਹੈ, ਇਸ ਲਈ ਗੱਲ ਨੂੰ ਕੰਮ ਨਾਲ ਜੁੜੇ ਹਿੱਸੇ ਤੱਕ ਰੱਖੀਏ।",
    sample_romanization:
      "ih visha sanvedansheel ho sakda hai, is lai gall nu kamm naal jurre hisse takk rakhie.",
    sample_vi:
      "Chủ đề này có thể nhạy cảm, vì vậy hãy giữ cuộc trao đổi trong phần liên quan đến công việc.",
    sample_en:
      "This topic may be sensitive, so let's keep the exchange to the work-related part.",
    release_phrases: [
      {
        gurmukhi: "ਸੰਵੇਦਨਸ਼ੀਲ ਹੋ ਸਕਦਾ ਹੈ",
        romanization: "sanvedansheel ho sakda hai",
        vi: "Có thể nhạy cảm.",
        en: "May be sensitive.",
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
        check_vi: "Có tránh tranh luận lập trường không?",
        check_en: "Does it avoid debating positions?",
        signal_vi: "Có ਸੰਵੇਦਨਸ਼ੀਲ and ਕੰਮ ਨਾਲ ਜੁੜੇ.",
        signal_en: "Uses sensitive and work-related.",
      },
    ],
    learner_trap: {
      trap_vi: "Kết thúc bằng quan điểm cá nhân làm mất an toàn register.",
      trap_en: "Ending with a personal stance weakens register safety.",
      repair_vi: "Đặt ranh giới và quay về nhiệm vụ.",
      repair_en: "Set a boundary and return to the task.",
    },
  },
  {
    id: "pa_c2_rc_public_communication",
    focus: "public_communication_calibration",
    context: "public",
    style: "release_candidate",
    title_vi: "Ứng viên phát hành: thông báo công khai",
    title_en: "Release candidate: public communication",
    scenario_vi: "Thông tin chưa xác nhận cuối cùng nhưng cần thông báo rõ ràng.",
    scenario_en: "Information is not final, but the public notice needs clarity.",
    readiness_goal_vi: "Nêu trạng thái, điều kiện xác nhận, và tránh suy đoán.",
    readiness_goal_en: "State status, confirmation condition, and avoid speculation.",
    sample_gurmukhi:
      "ਸਮੀਖਿਆ ਜਾਰੀ ਹੈ। ਪੁਸ਼ਟੀ ਹੋਣ ਤੇ ਅਗਲਾ ਕਦਮ ਸਾਂਝਾ ਕਰਾਂਗੇ; ਇਸ ਤੋਂ ਪਹਿਲਾਂ ਅਟਕਲਾਂ ਤੋਂ ਬਚੀਏ।",
    sample_romanization:
      "samikhia jaari hai. pushti hon te agla kadam sanjha karange; is ton pehlaan atklan ton bachie.",
    sample_vi:
      "Việc rà soát đang tiếp tục. Khi được xác nhận, chúng tôi sẽ chia sẻ bước tiếp theo; trước đó hãy tránh suy đoán.",
    sample_en:
      "The review is ongoing. Once confirmed, we will share the next step; until then, let's avoid speculation.",
    release_phrases: [
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
        check_vi: "Có tránh hứa quá mức không?",
        check_en: "Does it avoid overpromising?",
        signal_vi: "Có ਜਾਰੀ ਹੈ, ਪੁਸ਼ਟੀ ਹੋਣ ਤੇ, and ਬਚੀਏ.",
        signal_en: "Includes ongoing, once confirmed, and avoid.",
      },
    ],
    learner_trap: {
      trap_vi: "Hứa kết quả chắc khi chưa có xác nhận.",
      trap_en: "Promising a certain result before confirmation.",
      repair_vi: "Dùng trạng thái hiện tại và điều kiện xác nhận.",
      repair_en: "Use current status and a confirmation condition.",
    },
  },
  {
    id: "pa_c2_rc_register_safety_professional_canada",
    focus: "register_safety",
    context: "professional",
    style: "readiness",
    title_vi: "Ứng viên phát hành: an toàn register email",
    title_en: "Release candidate: email register safety",
    scenario_vi: "Bạn cần email chuyên nghiệp dùng được ở Canada mà vẫn rõ yêu cầu.",
    scenario_en: "You need a professional email usable in Canada while keeping the request clear.",
    readiness_goal_vi: "Dùng lịch sự vừa đủ, nêu bước tiếp theo, và cảm ơn ngắn.",
    readiness_goal_en: "Use enough politeness, name the next step, and give brief thanks.",
    sample_gurmukhi:
      "ਕਿਰਪਾ ਕਰਕੇ ਜਦੋਂ ਸੁਵਿਧਾ ਹੋਵੇ, ਅਗਲਾ ਕਦਮ ਦੱਸ ਦਿਓ। ਤੁਹਾਡੇ ਸਮੇਂ ਲਈ ਧੰਨਵਾਦ।",
    sample_romanization:
      "kirpa karke jadon suvidha hove, agla kadam dass deo. tuhade same lai dhanvaad.",
    sample_vi:
      "Khi thuận tiện, xin vui lòng cho biết bước tiếp theo. Cảm ơn thời gian của anh/chị.",
    sample_en:
      "When convenient, please let me know the next step. Thank you for your time.",
    release_phrases: [
      {
        gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ",
        romanization: "kirpa karke",
        vi: "Xin vui lòng.",
        en: "Please.",
      },
      {
        gurmukhi: "ਅਗਲਾ ਕਦਮ",
        romanization: "agla kadam",
        vi: "Bước tiếp theo.",
        en: "Next step.",
      },
    ],
    checks: [
      {
        check_vi: "Có lịch sự và rõ hành động không?",
        check_en: "Is it polite and action-clear?",
        signal_vi: "Có ਕਿਰਪਾ ਕਰਕੇ, ਅਗਲਾ ਕਦਮ, and ਧੰਨਵਾਦ.",
        signal_en: "Includes please, next step, and thanks.",
      },
    ],
    learner_trap: {
      trap_vi: "Thêm quá nhiều công thức lịch sự làm yêu cầu bị mờ.",
      trap_en: "Too many polite formulas can blur the request.",
      repair_vi: "Giữ please, yêu cầu cụ thể, và cảm ơn ngắn.",
      repair_en: "Keep please, a concrete request, and brief thanks.",
    },
    canada_practical: true,
  },
];

export const c2ReleaseCandidateSamplesByFocus = (
  focus: PunjabiC2ReleaseCandidateFocus,
): PunjabiC2ReleaseCandidateSample[] => c2ReleaseCandidateSamples.filter((item) => item.focus === focus);

export const c2ReleaseCandidateSamplesByContext = (
  context: PunjabiC2ReleaseCandidateContext,
): PunjabiC2ReleaseCandidateSample[] => c2ReleaseCandidateSamples.filter((item) => item.context === context);
