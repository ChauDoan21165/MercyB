// Punjabi C2 integration samples for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support integration samples, not certification, official
// placement, legal/HR/medical/safety advice, or native-reviewed authority.
// Native review is deferred. Shahmukhi is mentioned only for script awareness,
// not as a full course.

export type PunjabiC2IntegrationFocus =
  | "nuanced_disagreement"
  | "negotiation"
  | "diplomacy"
  | "mediation"
  | "deescalation"
  | "sensitive_topic_framing"
  | "advanced_register"
  | "community_discourse"
  | "professional_discourse"
  | "public_discourse";

export type PunjabiC2IntegrationStyle =
  | "integration_sample"
  | "final_evidence"
  | "final_qa";

export type PunjabiC2IntegrationPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2IntegrationEvidence = {
  evidence_vi: string;
  evidence_en: string;
  signal_gurmukhi: string;
  signal_romanization: string;
};

export type PunjabiC2IntegrationTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2IntegrationSample = {
  id: string;
  focus: PunjabiC2IntegrationFocus;
  style: PunjabiC2IntegrationStyle;
  title_vi: string;
  title_en: string;
  context_vi: string;
  context_en: string;
  learner_task_vi: string;
  learner_task_en: string;
  sample_gurmukhi: string;
  sample_romanization: string;
  sample_vi: string;
  sample_en: string;
  reusable_phrases: PunjabiC2IntegrationPhrase[];
  evidence: PunjabiC2IntegrationEvidence[];
  learner_trap?: PunjabiC2IntegrationTrap;
  canada_practical?: boolean;
};

export const C2_INTEGRATION_SAMPLES_DISCLAIMER = {
  vi: "Các mẫu tích hợp Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "These C2 Punjabi integration samples support study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const integrationSamplesC2: PunjabiC2IntegrationSample[] = [
  {
    id: "pa_c2_integration_nuanced_disagreement_evidence",
    focus: "nuanced_disagreement",
    style: "integration_sample",
    title_vi: "Bất đồng tinh tế dựa trên bằng chứng",
    title_en: "Evidence-based nuanced disagreement",
    context_vi: "Bạn đồng ý với mục tiêu chung nhưng thấy kết luận còn vội.",
    context_en: "You agree with the shared goal but think the conclusion is premature.",
    learner_task_vi: "Công nhận mục tiêu, giới hạn phản biện vào dữ liệu, và mời làm rõ.",
    learner_task_en: "Validate the goal, limit the challenge to data, and invite clarification.",
    sample_gurmukhi:
      "ਮਕਸਦ ਨਾਲ ਮੈਂ ਸਹਿਮਤ ਹਾਂ। ਮੇਰੀ ਚਿੰਤਾ ਸਿਰਫ਼ ਇਹ ਹੈ ਕਿ ਅੰਕੜੇ ਅਜੇ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸਪਸ਼ਟ ਨਹੀਂ ਹਨ, ਇਸ ਲਈ ਨਤੀਜੇ ਨੂੰ ਥੋੜ੍ਹਾ ਹੋਰ ਜਾਂਚੀਏ।",
    sample_romanization:
      "maqsad naal main sahimat haan. meri chinta sirf ih hai ki ankare aje puri tarah spasht nahin han, is lai natije nu thora hor jaanchie.",
    sample_vi:
      "Tôi đồng ý với mục tiêu. Điều tôi lo chỉ là số liệu chưa hoàn toàn rõ, vì vậy ta nên kiểm tra kết luận thêm một chút.",
    sample_en:
      "I agree with the goal. My only concern is that the numbers are not fully clear yet, so we should examine the conclusion a little more.",
    reusable_phrases: [
      {
        gurmukhi: "ਮਕਸਦ ਨਾਲ ਮੈਂ ਸਹਿਮਤ ਹਾਂ",
        romanization: "maqsad naal main sahimat haan",
        vi: "Tôi đồng ý với mục tiêu.",
        en: "I agree with the goal.",
      },
      {
        gurmukhi: "ਨਤੀਜੇ ਨੂੰ ਥੋੜ੍ਹਾ ਹੋਰ ਜਾਂਚੀਏ",
        romanization: "natije nu thora hor jaanchie",
        vi: "Ta hãy kiểm tra kết luận thêm một chút.",
        en: "Let's examine the conclusion a little more.",
      },
    ],
    evidence: [
      {
        evidence_vi: "Có công nhận trước khi phản biện.",
        evidence_en: "Validation comes before challenge.",
        signal_gurmukhi: "ਮਕਸਦ ਨਾਲ ਮੈਂ ਸਹਿਮਤ ਹਾਂ",
        signal_romanization: "maqsad naal main sahimat haan",
      },
    ],
    learner_trap: {
      trap_vi: "Mở đầu bằng 'kết luận này sai' làm mất sắc thái.",
      trap_en: "Opening with 'this conclusion is wrong' loses nuance.",
      repair_vi: "Nêu mục tiêu chung rồi chuyển sang ਅੰਕੜੇ hoặc ਸਬੂਤ.",
      repair_en: "Name the shared goal, then move to ਅੰਕੜੇ or ਸਬੂਤ.",
    },
  },
  {
    id: "pa_c2_integration_negotiation_service_canada",
    focus: "negotiation",
    style: "final_evidence",
    title_vi: "Đàm phán lựa chọn dịch vụ công Canada",
    title_en: "Negotiate options in a Canadian public-service setting",
    context_vi: "Bạn thiếu bản gốc nhưng có bản sao và email xác nhận.",
    context_en: "You lack the original but have a copy and confirmation email.",
    learner_task_vi: "Tôn trọng quy định, nêu cái đang có, hỏi bước tiếp theo.",
    learner_task_en: "Respect the rule, state what you have, and ask for the next step.",
    sample_gurmukhi:
      "ਮੈਨੂੰ ਨਿਯਮ ਦੀ ਸਮਝ ਹੈ। ਇਸ ਵੇਲੇ ਮੇਰੇ ਕੋਲ ਕਾਪੀ ਅਤੇ ਪੁਸ਼ਟੀ ਵਾਲਾ ਈਮੇਲ ਹੈ; ਕੀ ਤੁਸੀਂ ਦੱਸ ਸਕਦੇ ਹੋ ਕਿ ਅਗਲਾ ਕਦਮ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
    sample_romanization:
      "mainu niyam di samajh hai. is vele mere kol copy ate pushti wala email hai; ki tusin dass sakde ho ki agla kadam ki ho sakda hai?",
    sample_vi:
      "Tôi hiểu quy định. Hiện tôi có bản sao và email xác nhận; anh/chị có thể cho biết bước tiếp theo có thể là gì không?",
    sample_en:
      "I understand the rule. Right now I have a copy and a confirmation email; could you tell me what the next step could be?",
    reusable_phrases: [
      {
        gurmukhi: "ਮੈਨੂੰ ਨਿਯਮ ਦੀ ਸਮਝ ਹੈ",
        romanization: "mainu niyam di samajh hai",
        vi: "Tôi hiểu quy định.",
        en: "I understand the rule.",
      },
      {
        gurmukhi: "ਅਗਲਾ ਕਦਮ ਕੀ ਹੋ ਸਕਦਾ ਹੈ?",
        romanization: "agla kadam ki ho sakda hai?",
        vi: "Bước tiếp theo có thể là gì?",
        en: "What could the next step be?",
      },
    ],
    evidence: [
      {
        evidence_vi: "Không đòi ngoại lệ; hỏi lựa chọn tiếp theo.",
        evidence_en: "Does not demand an exception; asks for the next option.",
        signal_gurmukhi: "ਅਗਲਾ ਕਦਮ",
        signal_romanization: "agla kadam",
      },
    ],
    learner_trap: {
      trap_vi: "Nói 'anh/chị phải chấp nhận' nghe ép buộc.",
      trap_en: "Saying 'you must accept this' sounds coercive.",
      repair_vi: "Dùng ਨਿਯਮ ਦੀ ਸਮਝ rồi hỏi ਅਗਲਾ ਕਦਮ.",
      repair_en: "Use ਨਿਯਮ ਦੀ ਸਮਝ, then ask about ਅਗਲਾ ਕਦਮ.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_integration_diplomacy_refusal",
    focus: "diplomacy",
    style: "final_qa",
    title_vi: "Từ chối ngoại giao và giữ quan hệ",
    title_en: "Diplomatic refusal while preserving goodwill",
    context_vi: "Bạn không thể nhận lời mời nhưng muốn để mở cơ hội sau.",
    context_en: "You cannot accept an invitation but want to leave a future opening.",
    learner_task_vi: "Cảm ơn, đặt giới hạn hiện tại, và mở thiện chí.",
    learner_task_en: "Thank, set the present limit, and leave goodwill open.",
    sample_gurmukhi:
      "ਤੁਹਾਡੇ ਸੱਦੇ ਲਈ ਧੰਨਵਾਦ। ਇਸ ਵੇਲੇ ਮੇਰੇ ਲਈ ਸ਼ਾਮਲ ਹੋਣਾ ਸੰਭਵ ਨਹੀਂ ਹੋਵੇਗਾ, ਪਰ ਅਗਲੇ ਮੌਕੇ ਲਈ ਮੈਨੂੰ ਖੁਸ਼ੀ ਰਹੇਗੀ।",
    sample_romanization:
      "tuhade sadde lai dhanvaad. is vele mere lai shamil hona sambhav nahin hovega, par agle mauke lai mainu khushi rahegi.",
    sample_vi:
      "Cảm ơn lời mời của anh/chị. Hiện tại tôi không thể tham gia, nhưng tôi sẽ rất vui cho dịp sau.",
    sample_en:
      "Thank you for the invitation. At the moment I will not be able to join, but I would be happy for a future opportunity.",
    reusable_phrases: [
      {
        gurmukhi: "ਤੁਹਾਡੇ ਸੱਦੇ ਲਈ ਧੰਨਵਾਦ",
        romanization: "tuhade sadde lai dhanvaad",
        vi: "Cảm ơn lời mời của anh/chị.",
        en: "Thank you for the invitation.",
      },
      {
        gurmukhi: "ਅਗਲੇ ਮੌਕੇ ਲਈ",
        romanization: "agle mauke lai",
        vi: "Cho dịp sau.",
        en: "For a future opportunity.",
      },
    ],
    evidence: [
      {
        evidence_vi: "Từ chối được làm mềm bằng cảm ơn và dịp sau.",
        evidence_en: "The refusal is softened by thanks and a future opening.",
        signal_gurmukhi: "ਧੰਨਵਾਦ",
        signal_romanization: "dhanvaad",
      },
    ],
    learner_trap: {
      trap_vi: "Dịch 'I refuse' quá trực tiếp.",
      trap_en: "Translating 'I refuse' too directly.",
      repair_vi: "Dùng ਇਸ ਵੇਲੇ ਸੰਭਵ ਨਹੀਂ and ਅਗਲਾ ਮੌਕਾ.",
      repair_en: "Use ਇਸ ਵੇਲੇ ਸੰਭਵ ਨਹੀਂ and ਅਗਲਾ ਮੌਕਾ.",
    },
  },
  {
    id: "pa_c2_integration_mediation_two_sides",
    focus: "mediation",
    style: "integration_sample",
    title_vi: "Hòa giải bằng tóm tắt hai phía",
    title_en: "Mediate by summarizing both sides",
    context_vi: "Hai bên bất đồng về thời hạn và chất lượng công việc.",
    context_en: "Two sides disagree about timeline and work quality.",
    learner_task_vi: "Tóm tắt song song hai lo ngại và đưa về tiêu chí chung.",
    learner_task_en: "Summarize both concerns in parallel and return to shared criteria.",
    sample_gurmukhi:
      "ਇੱਕ ਪਾਸੇ ਸਮੇਂ ਦੀ ਚਿੰਤਾ ਹੈ, ਅਤੇ ਦੂਜੇ ਪਾਸੇ ਗੁਣਵੱਤਾ ਦੀ ਚਿੰਤਾ ਹੈ। ਆਓ ਦੋਵੇਂ ਗੱਲਾਂ ਨੂੰ ਇੱਕੋ ਮਾਪਦੰਡ ਨਾਲ ਵੇਖੀਏ।",
    sample_romanization:
      "ikk pase same di chinta hai, ate duje pase gunvatta di chinta hai. aao dovein gallan nu ikko mapdand naal vekhie.",
    sample_vi:
      "Một phía lo về thời gian, và phía kia lo về chất lượng. Ta hãy xem cả hai việc theo cùng một tiêu chí.",
    sample_en:
      "One side is concerned about time, and the other side is concerned about quality. Let's view both points through the same criteria.",
    reusable_phrases: [
      {
        gurmukhi: "ਇੱਕ ਪਾਸੇ",
        romanization: "ikk pase",
        vi: "Một phía.",
        en: "On one side.",
      },
      {
        gurmukhi: "ਦੂਜੇ ਪਾਸੇ",
        romanization: "duje pase",
        vi: "Phía kia.",
        en: "On the other side.",
      },
    ],
    evidence: [
      {
        evidence_vi: "Hai phía được nêu cân bằng, không chọn phe.",
        evidence_en: "Both sides are stated evenly without taking sides.",
        signal_gurmukhi: "ਇੱਕ ਪਾਸੇ ... ਦੂਜੇ ਪਾਸੇ",
        signal_romanization: "ikk pase ... duje pase",
      },
    ],
    learner_trap: {
      trap_vi: "Biến tóm tắt thành phán quyết ai đúng.",
      trap_en: "Turning the summary into a verdict about who is right.",
      repair_vi: "Dùng cấu trúc song song và ਮਾਪਦੰਡ.",
      repair_en: "Use parallel structure and ਮਾਪਦੰਡ.",
    },
  },
  {
    id: "pa_c2_integration_deescalation_community_meeting",
    focus: "deescalation",
    style: "final_evidence",
    title_vi: "Hạ nhiệt họp cộng đồng",
    title_en: "De-escalate a community meeting",
    context_vi: "Trong cuộc họp cộng đồng, mọi người nói chồng lên nhau.",
    context_en: "In a community meeting, people are speaking over each other.",
    learner_task_vi: "Đề xuất quy trình nghe từng lượt và nhắc mục tiêu chung.",
    learner_task_en: "Suggest turn-taking and remind everyone of the shared goal.",
    sample_gurmukhi:
      "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ। ਸਾਡਾ ਮਕਸਦ ਹੱਲ ਲੱਭਣਾ ਹੈ, ਇਸ ਲਈ ਪਹਿਲਾਂ ਹਰ ਨੁਕਤਾ ਬਾਰੀ ਨਾਲ ਸੁਣੀਏ।",
    sample_romanization:
      "aao ikk-ikk gall sunie. sada maqsad hall labhna hai, is lai pehlan har nukta baari naal sunie.",
    sample_vi:
      "Ta hãy nghe từng ý một. Mục tiêu của chúng ta là tìm giải pháp, vì vậy trước hết hãy nghe từng điểm lần lượt.",
    sample_en:
      "Let's hear one point at a time. Our goal is to find a solution, so first let's hear each point in turn.",
    reusable_phrases: [
      {
        gurmukhi: "ਆਓ ਇੱਕ-ਇੱਕ ਗੱਲ ਸੁਣੀਏ",
        romanization: "aao ikk-ikk gall sunie",
        vi: "Ta hãy nghe từng ý một.",
        en: "Let's hear one point at a time.",
      },
      {
        gurmukhi: "ਸਾਡਾ ਮਕਸਦ ਹੱਲ ਲੱਭਣਾ ਹੈ",
        romanization: "sada maqsad hall labhna hai",
        vi: "Mục tiêu của chúng ta là tìm giải pháp.",
        en: "Our goal is to find a solution.",
      },
    ],
    evidence: [
      {
        evidence_vi: "Hạ nhiệt bằng quy trình, không bằng mệnh lệnh.",
        evidence_en: "De-escalates through process, not command.",
        signal_gurmukhi: "ਬਾਰੀ ਨਾਲ",
        signal_romanization: "baari naal",
      },
    ],
    learner_trap: {
      trap_vi: "Nói 'bình tĩnh đi' có thể làm căng hơn.",
      trap_en: "Saying 'calm down' can intensify tension.",
      repair_vi: "Đề xuất ਬਾਰੀ ਨਾਲ and mục tiêu chung.",
      repair_en: "Suggest ਬਾਰੀ ਨਾਲ and the shared goal.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_integration_sensitive_topic_framing",
    focus: "sensitive_topic_framing",
    style: "final_qa",
    title_vi: "Nêu chủ đề nhạy cảm không gán định kiến",
    title_en: "Frame a sensitive topic without stereotyping",
    context_vi: "Nhóm cần chia việc cho sự kiện mà không gán vai theo tuổi, giới, hoặc gia đình.",
    context_en: "A group needs to divide event work without assigning roles by age, gender, or family.",
    learner_task_vi: "Dựa vào sở thích, thời gian, và mức thoải mái.",
    learner_task_en: "Use interest, availability, and comfort level as criteria.",
    sample_gurmukhi:
      "ਅਸੀਂ ਕੰਮ ਉਮਰ ਜਾਂ ਪਰਿਵਾਰ ਦੇ ਆਧਾਰ ਤੇ ਨਹੀਂ, ਸਗੋਂ ਰੁਚੀ, ਸਮੇਂ ਅਤੇ ਸੁਵਿਧਾ ਦੇ ਅਨੁਸਾਰ ਵੰਡ ਸਕਦੇ ਹਾਂ।",
    sample_romanization:
      "asin kamm umar jaan parivaar de adhar te nahin, sagon ruchi, same ate suvidha de anusaar vand sakde haan.",
    sample_vi:
      "Chúng ta có thể chia việc không dựa trên tuổi hay gia đình, mà theo sở thích, thời gian và mức thuận tiện.",
    sample_en:
      "We can divide the work not by age or family, but according to interest, availability, and comfort.",
    reusable_phrases: [
      {
        gurmukhi: "ਰੁਚੀ, ਸਮੇਂ ਅਤੇ ਸੁਵਿਧਾ ਦੇ ਅਨੁਸਾਰ",
        romanization: "ruchi, same ate suvidha de anusaar",
        vi: "Theo sở thích, thời gian và mức thuận tiện.",
        en: "According to interest, availability, and comfort.",
      },
      {
        gurmukhi: "ਆਧਾਰ ਤੇ ਨਹੀਂ",
        romanization: "adhar te nahin",
        vi: "Không dựa trên.",
        en: "Not based on.",
      },
    ],
    evidence: [
      {
        evidence_vi: "Tiêu chí trung tính thay cho nhãn xã hội.",
        evidence_en: "Neutral criteria replace social labels.",
        signal_gurmukhi: "ਰੁਚੀ, ਸਮੇਂ ਅਤੇ ਸੁਵਿਧਾ",
        signal_romanization: "ruchi, same ate suvidha",
      },
    ],
    learner_trap: {
      trap_vi: "Dùng định kiến để phân công cho nhanh.",
      trap_en: "Using stereotypes to assign tasks quickly.",
      repair_vi: "Chuyển sang tiêu chí tự nguyện và thuận tiện.",
      repair_en: "Shift to voluntary and comfort-based criteria.",
    },
  },
  {
    id: "pa_c2_integration_advanced_register_professional",
    focus: "advanced_register",
    style: "integration_sample",
    title_vi: "Điều chỉnh đăng ký chuyên nghiệp",
    title_en: "Adjust professional register",
    context_vi: "Bạn cần sửa lịch giao việc mà không đổ lỗi cho đồng nghiệp.",
    context_en: "You need to adjust a work timeline without blaming a colleague.",
    learner_task_vi: "Giữ trang trọng, nêu ràng buộc, và đề xuất phương án.",
    learner_task_en: "Keep a formal tone, name the constraint, and propose an option.",
    sample_gurmukhi:
      "ਮੌਜੂਦਾ ਸਮੇਂ ਦੀ ਪਾਬੰਦੀ ਨੂੰ ਦੇਖਦੇ ਹੋਏ, ਮੇਰਾ ਸੁਝਾਅ ਹੈ ਕਿ ਅਸੀਂ ਪਹਿਲਾਂ ਜ਼ਰੂਰੀ ਹਿੱਸਾ ਪੂਰਾ ਕਰੀਏ ਅਤੇ ਬਾਕੀ ਹਿੱਸੇ ਲਈ ਨਵੀਂ ਮਿਆਦ ਤੈਅ ਕਰੀਏ।",
    sample_romanization:
      "maujuda same di pabandi nu dekhde hoe, mera sujhaa hai ki asin pehlan zaruri hissa pura karie ate baaki hisse lai navi miyaad tai karie.",
    sample_vi:
      "Xét ràng buộc thời gian hiện tại, đề xuất của tôi là trước hết hoàn thành phần cần thiết và đặt thời hạn mới cho phần còn lại.",
    sample_en:
      "Given the current time constraint, my suggestion is that we complete the essential part first and set a new deadline for the remaining part.",
    reusable_phrases: [
      {
        gurmukhi: "ਮੇਰਾ ਸੁਝਾਅ ਹੈ",
        romanization: "mera sujhaa hai",
        vi: "Đề xuất của tôi là.",
        en: "My suggestion is.",
      },
      {
        gurmukhi: "ਨਵੀਂ ਮਿਆਦ ਤੈਅ ਕਰੀਏ",
        romanization: "navi miyaad tai karie",
        vi: "Ta đặt thời hạn mới.",
        en: "Let's set a new deadline.",
      },
    ],
    evidence: [
      {
        evidence_vi: "Giọng chuyên nghiệp tập trung vào ràng buộc và phương án.",
        evidence_en: "Professional tone focuses on constraint and option.",
        signal_gurmukhi: "ਮੌਜੂਦਾ ਸਮੇਂ ਦੀ ਪਾਬੰਦੀ",
        signal_romanization: "maujuda same di pabandi",
      },
    ],
    learner_trap: {
      trap_vi: "Đổ lỗi trực tiếp cho người làm chậm.",
      trap_en: "Directly blaming the person who is delayed.",
      repair_vi: "Nêu ਪਾਬੰਦੀ and ਸੁਝਾਅ thay vì tên người.",
      repair_en: "Name ਪਾਬੰਦੀ and ਸੁਝਾਅ instead of the person.",
    },
  },
  {
    id: "pa_c2_integration_community_professional_public",
    focus: "community_discourse",
    style: "final_evidence",
    title_vi: "Cân bằng diễn ngôn cộng đồng, nghề nghiệp, công khai",
    title_en: "Balance community, professional, and public discourse",
    context_vi: "Bạn chuẩn bị thông báo cho nhóm cộng đồng có đối tác chuyên môn và công chúng.",
    context_en: "You are preparing a notice for a community group with professional partners and the public.",
    learner_task_vi: "Kết hợp ấm áp cộng đồng, rõ ràng chuyên nghiệp, và minh bạch công khai.",
    learner_task_en: "Combine community warmth, professional clarity, and public transparency.",
    sample_gurmukhi:
      "ਸਾਡੀ ਕਮਿਊਨਿਟੀ ਦੇ ਸਹਿਯੋਗ ਲਈ ਧੰਨਵਾਦ। ਪੇਸ਼ੇਵਰ ਟੀਮ ਨੇ ਸਮੇਂ ਅਤੇ ਸੁਰੱਖਿਆ ਦੇ ਕਾਰਨ ਇਹ ਤਬਦੀਲੀ ਸੁਝਾਈ ਹੈ, ਅਤੇ ਜਨਤਕ ਜਾਣਕਾਰੀ ਲਈ ਨਵਾਂ ਕਾਰਜਕ੍ਰਮ ਹੇਠਾਂ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
    sample_romanization:
      "sadi community de sahiyog lai dhanvaad. peshevar team ne same ate surakhia de karan ih tabdili sujhai hai, ate janatak jaankari lai nava karajkram hethan ditta giya hai.",
    sample_vi:
      "Cảm ơn sự hợp tác của cộng đồng chúng ta. Nhóm chuyên môn đã đề xuất thay đổi này vì thời gian và an toàn, và lịch mới được đưa bên dưới để thông tin công khai.",
    sample_en:
      "Thank you for our community's cooperation. The professional team suggested this change for time and safety reasons, and the new schedule is provided below for public information.",
    reusable_phrases: [
      {
        gurmukhi: "ਕਮਿਊਨਿਟੀ ਦੇ ਸਹਿਯੋਗ ਲਈ ਧੰਨਵਾਦ",
        romanization: "community de sahiyog lai dhanvaad",
        vi: "Cảm ơn sự hợp tác của cộng đồng.",
        en: "Thank you for the community's cooperation.",
      },
      {
        gurmukhi: "ਜਨਤਕ ਜਾਣਕਾਰੀ ਲਈ",
        romanization: "janatak jaankari lai",
        vi: "Để thông tin công khai.",
        en: "For public information.",
      },
    ],
    evidence: [
      {
        evidence_vi: "Có tín hiệu cộng đồng, chuyên nghiệp, và công khai.",
        evidence_en: "Includes community, professional, and public signals.",
        signal_gurmukhi: "ਕਮਿਊਨਿਟੀ ... ਪੇਸ਼ੇਵਰ ... ਜਨਤਕ",
        signal_romanization: "community ... peshevar ... janatak",
      },
    ],
    learner_trap: {
      trap_vi: "Thông báo quá thân mật hoặc quá hành chính một chiều.",
      trap_en: "The notice is either too casual or too bureaucratic.",
      repair_vi: "Kết hợp ਧੰਨਵਾਦ, ਕਾਰਨ, and ਜਨਤਕ ਜਾਣਕਾਰੀ.",
      repair_en: "Combine ਧੰਨਵਾਦ, ਕਾਰਨ, and ਜਨਤਕ ਜਾਣਕਾਰੀ.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_integration_professional_repair",
    focus: "professional_discourse",
    style: "final_qa",
    title_vi: "Sửa hiểu nhầm trong môi trường chuyên nghiệp",
    title_en: "Repair a misunderstanding in a professional setting",
    context_vi: "Email của bạn bị hiểu là chỉ trích, nhưng ý định là làm rõ phạm vi.",
    context_en: "Your email was read as criticism, but your intent was to clarify scope.",
    learner_task_vi: "Thừa nhận tác động, làm rõ ý định, và đề xuất bước sửa.",
    learner_task_en: "Acknowledge impact, clarify intent, and propose a repair step.",
    sample_gurmukhi:
      "ਜੇ ਮੇਰਾ ਪਿਛਲਾ ਸੁਨੇਹਾ ਆਲੋਚਨਾ ਵਾਂਗ ਲੱਗਿਆ ਹੋਵੇ ਤਾਂ ਮੈਂ ਸਪਸ਼ਟ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ ਕਿ ਮੇਰਾ ਮਕਸਦ ਸਿਰਫ਼ ਕੰਮ ਦੀ ਹੱਦ ਸਾਫ਼ ਕਰਨਾ ਸੀ। ਆਓ ਇਸ ਨੂੰ ਨਵੇਂ ਨੋਟ ਵਿੱਚ ਹੋਰ ਸਪਸ਼ਟ ਕਰੀਏ।",
    sample_romanization:
      "je mera pichhla suneha alochna vaang laggia hove taan main spasht karna chaunda haan ki mera maqsad sirf kamm di hadd saaf karna si. aao is nu nave note vich hor spasht karie.",
    sample_vi:
      "Nếu tin nhắn trước của tôi nghe như lời phê bình, tôi muốn làm rõ rằng mục đích của tôi chỉ là làm rõ phạm vi công việc. Ta hãy làm nó rõ hơn trong ghi chú mới.",
    sample_en:
      "If my previous message sounded like criticism, I want to clarify that my purpose was only to define the work scope. Let's make it clearer in a new note.",
    reusable_phrases: [
      {
        gurmukhi: "ਜੇ ਮੇਰਾ ਪਿਛਲਾ ਸੁਨੇਹਾ",
        romanization: "je mera pichhla suneha",
        vi: "Nếu tin nhắn trước của tôi.",
        en: "If my previous message.",
      },
      {
        gurmukhi: "ਮੇਰਾ ਮਕਸਦ ਸਿਰਫ਼",
        romanization: "mera maqsad sirf",
        vi: "Mục đích của tôi chỉ là.",
        en: "My purpose was only.",
      },
    ],
    evidence: [
      {
        evidence_vi: "Có thừa nhận tác động trước khi làm rõ ý định.",
        evidence_en: "Acknowledges impact before clarifying intent.",
        signal_gurmukhi: "ਜੇ ... ਲੱਗਿਆ ਹੋਵੇ",
        signal_romanization: "je ... laggia hove",
      },
    ],
    learner_trap: {
      trap_vi: "Chỉ nói 'bạn hiểu sai' làm tăng phòng vệ.",
      trap_en: "Only saying 'you misunderstood' increases defensiveness.",
      repair_vi: "Thừa nhận cách câu có thể được nghe rồi làm rõ ਮਕਸਦ.",
      repair_en: "Acknowledge how it may have sounded, then clarify ਮਕਸਦ.",
    },
  },
  {
    id: "pa_c2_integration_public_notice",
    focus: "public_discourse",
    style: "integration_sample",
    title_vi: "Thông báo công khai có kiểm soát",
    title_en: "Controlled public notice",
    context_vi: "Một sự kiện đổi địa điểm vì thời tiết; cần thông báo rõ mà không gây hoang mang.",
    context_en: "An event changes venue because of weather; the notice must be clear without causing alarm.",
    learner_task_vi: "Nêu thay đổi, lý do ngắn, việc người đọc cần làm.",
    learner_task_en: "State the change, brief reason, and reader action.",
    sample_gurmukhi:
      "ਮੌਸਮ ਦੇ ਕਾਰਨ ਅੱਜ ਦਾ ਪ੍ਰੋਗਰਾਮ ਨਵੇਂ ਹਾਲ ਵਿੱਚ ਹੋਵੇਗਾ। ਕਿਰਪਾ ਕਰਕੇ ਸਿੱਧੇ ਮੁੱਖ ਦਰਵਾਜ਼ੇ ਤੋਂ ਅੰਦਰ ਆਓ; ਸਮਾਂ ਪਹਿਲਾਂ ਵਾਂਗ ਹੀ ਰਹੇਗਾ।",
    sample_romanization:
      "mausam de karan ajj da program nave hall vich hovega. kirpa karke siddhe mukh darwaze ton andar aao; sama pehlan vaang hi rahega.",
    sample_vi:
      "Do thời tiết, chương trình hôm nay sẽ diễn ra ở hội trường mới. Vui lòng đi thẳng vào từ cửa chính; thời gian vẫn như cũ.",
    sample_en:
      "Because of the weather, today's program will be in the new hall. Please enter directly through the main door; the time will remain the same.",
    reusable_phrases: [
      {
        gurmukhi: "ਮੌਸਮ ਦੇ ਕਾਰਨ",
        romanization: "mausam de karan",
        vi: "Do thời tiết.",
        en: "Because of the weather.",
      },
      {
        gurmukhi: "ਸਮਾਂ ਪਹਿਲਾਂ ਵਾਂਗ ਹੀ ਰਹੇਗਾ",
        romanization: "sama pehlan vaang hi rahega",
        vi: "Thời gian vẫn như cũ.",
        en: "The time will remain the same.",
      },
    ],
    evidence: [
      {
        evidence_vi: "Thông báo có thay đổi, lý do, và hành động cụ thể.",
        evidence_en: "The notice has the change, reason, and concrete action.",
        signal_gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ",
        signal_romanization: "kirpa karke",
      },
    ],
    learner_trap: {
      trap_vi: "Nêu lý do dài nhưng thiếu hành động cần làm.",
      trap_en: "Giving a long reason but no reader action.",
      repair_vi: "Thêm ਕਿਰਪਾ ਕਰਕੇ plus hướng đi rõ.",
      repair_en: "Add ਕਿਰਪਾ ਕਰਕੇ plus clear direction.",
    },
    canada_practical: true,
  },
];

export const integrationSamplesC2ByFocus = (
  focus: PunjabiC2IntegrationFocus,
): PunjabiC2IntegrationSample[] =>
  integrationSamplesC2.filter((sample) => sample.focus === focus);
