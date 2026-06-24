// Punjabi C2 negotiation and diplomacy pack for Vietnamese- and
// English-speaking learners. Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support material, not native-reviewed authority. Native
// review is deferred. Shahmukhi is mentioned only for script awareness, not as
// a full course.

export type PunjabiNegotiationDiplomacyFocus =
  | "soften_demands"
  | "preserve_respect"
  | "reframe_disagreement"
  | "propose_compromise"
  | "repair_tension"
  | "sensitive_workplace"
  | "sensitive_community"
  | "public_service_topics";

export type PunjabiNegotiationSetting =
  | "workplace"
  | "community"
  | "public_service"
  | "education"
  | "family"
  | "canada_service";

export type PunjabiNegotiationPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiNegotiationTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiNegotiationDiplomacyEntry = {
  id: string;
  focus: PunjabiNegotiationDiplomacyFocus;
  setting: PunjabiNegotiationSetting;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  diplomacy_strategy_vi: string;
  diplomacy_strategy_en: string;
  phrases: PunjabiNegotiationPhrase[];
  model_gurmukhi: string;
  model_romanization: string;
  model_vi: string;
  model_en: string;
  learner_trap?: PunjabiNegotiationTrap;
  canada_practical?: boolean;
};

export const NEGOTIATION_DIPLOMACY_C2_DISCLAIMER = {
  vi: "Gói đàm phán và ngoại giao Punjabi C2 này chỉ hỗ trợ học tập. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ, không phải khóa học đầy đủ.",
  en: "This C2 Punjabi negotiation and diplomacy pack is for study support only. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness, not taught as a full course.",
} as const;

export const negotiationDiplomacyC2Entries: PunjabiNegotiationDiplomacyEntry[] = [
  {
    id: "pa_c2_neg_soften_deadline_request",
    focus: "soften_demands",
    setting: "workplace",
    title_vi: "Làm mềm yêu cầu về hạn chót",
    title_en: "Soften a deadline demand",
    scenario_vi: "Bạn cần yêu cầu gửi tài liệu hôm nay nhưng không muốn nghe như ra lệnh.",
    scenario_en: "You need to ask for a document today without sounding like you are ordering.",
    diplomacy_strategy_vi: "Đưa lý do chung, dùng nếu có thể, rồi nêu hạn rõ.",
    diplomacy_strategy_en: "Give a shared reason, use if possible, then state the deadline clearly.",
    phrases: [
      {
        gurmukhi: "ਰਿਪੋਰਟ ਪੂਰੀ ਕਰਨ ਲਈ",
        romanization: "report puri karan lai",
        vi: "Để hoàn tất báo cáo.",
        en: "To complete the report.",
      },
      {
        gurmukhi: "ਹੋ ਸਕੇ ਤਾਂ ਅੱਜ ਭੇਜ ਦਿਓ",
        romanization: "ho sake taan ajj bhej dio",
        vi: "Nếu được thì gửi hôm nay giúp tôi.",
        en: "If possible, please send it today.",
      },
    ],
    model_gurmukhi: "ਰਿਪੋਰਟ ਪੂਰੀ ਕਰਨ ਲਈ, ਹੋ ਸਕੇ ਤਾਂ ਅੱਜ ਫ਼ਾਈਲ ਭੇਜ ਦਿਓ ਜੀ।",
    model_romanization: "report puri karan lai, ho sake taan ajj file bhej dio ji.",
    model_vi: "Để hoàn tất báo cáo, nếu được thì hôm nay gửi tệp giúp tôi nhé.",
    model_en: "To complete the report, if possible, please send the file today.",
    learner_trap: {
      trap_vi: "Dịch 'send it today' thành mệnh lệnh ngắn.",
      trap_en: "Translating 'send it today' as a bare command.",
      repair_vi: "Thêm lý do chung và ਹੋ ਸਕੇ ਤਾਂ.",
      repair_en: "Add a shared reason and ਹੋ ਸਕੇ ਤਾਂ.",
    },
  },
  {
    id: "pa_c2_neg_preserve_respect_budget",
    focus: "preserve_respect",
    setting: "community",
    title_vi: "Giữ tôn trọng khi bàn ngân sách",
    title_en: "Preserve respect when discussing budget",
    scenario_vi: "Bạn nghi ngại chi phí trong kế hoạch cộng đồng nhưng muốn tránh làm người đề xuất mất mặt.",
    scenario_en: "You are concerned about cost in a community plan but want to avoid embarrassing the proposer.",
    diplomacy_strategy_vi: "Công nhận công sức trước, rồi nêu câu hỏi về nguồn lực.",
    diplomacy_strategy_en: "Acknowledge the effort first, then raise the resource question.",
    phrases: [
      {
        gurmukhi: "ਤੁਹਾਡੀ ਮਿਹਨਤ ਸਾਫ਼ ਦਿਖਦੀ ਹੈ",
        romanization: "tuhadi mehnat saaf dikhdi hai",
        vi: "Công sức của anh/chị rất rõ.",
        en: "Your effort is clearly visible.",
      },
      {
        gurmukhi: "ਸਰੋਤਾਂ ਬਾਰੇ ਇੱਕ ਸਵਾਲ ਹੈ",
        romanization: "sarotan bare ikk savaal hai",
        vi: "Tôi có một câu hỏi về nguồn lực.",
        en: "I have one question about resources.",
      },
    ],
    model_gurmukhi: "ਤੁਹਾਡੀ ਮਿਹਨਤ ਸਾਫ਼ ਦਿਖਦੀ ਹੈ। ਸਿਰਫ਼ ਸਰੋਤਾਂ ਬਾਰੇ ਇੱਕ ਸਵਾਲ ਹੈ ਕਿ ਇਹ ਖ਼ਰਚ ਕਿਵੇਂ ਪੂਰਾ ਹੋਵੇਗਾ।",
    model_romanization: "tuhadi mehnat saaf dikhdi hai. sirf sarotan bare ikk savaal hai ki ih kharch kiven pura hovega.",
    model_vi: "Công sức của anh/chị rất rõ. Tôi chỉ có một câu hỏi về nguồn lực: chi phí này sẽ được đáp ứng thế nào?",
    model_en: "Your effort is clear. I only have one resource question: how will this cost be covered?",
    learner_trap: {
      trap_vi: "Mở đầu bằng 'đắt quá' làm cuộc bàn luận dễ phòng thủ.",
      trap_en: "Opening with 'too expensive' can make the discussion defensive.",
      repair_vi: "Công nhận công sức rồi hỏi cơ chế nguồn lực.",
      repair_en: "Acknowledge effort, then ask about the resource mechanism.",
    },
  },
  {
    id: "pa_c2_neg_reframe_disagreement_priority",
    focus: "reframe_disagreement",
    setting: "workplace",
    title_vi: "Đổi khung bất đồng thành ưu tiên",
    title_en: "Reframe disagreement as priorities",
    scenario_vi: "Hai bên không đồng ý về hướng làm việc.",
    scenario_en: "Two sides disagree about the work direction.",
    diplomacy_strategy_vi: "Không nói ai sai; nói hai ưu tiên đang cạnh tranh.",
    diplomacy_strategy_en: "Do not say who is wrong; name two competing priorities.",
    phrases: [
      {
        gurmukhi: "ਲੱਗਦਾ ਹੈ ਸਾਡੀਆਂ ਤਰਜੀਹਾਂ ਵੱਖਰੀਆਂ ਹਨ",
        romanization: "laggda hai sadian tarjihan vakhrian han",
        vi: "Có vẻ ưu tiên của chúng ta khác nhau.",
        en: "It seems our priorities differ.",
      },
      {
        gurmukhi: "ਆਓ ਸਾਂਝੀ ਤਰਜੀਹ ਲੱਭੀਏ",
        romanization: "aao sanjhi tarjih labhie",
        vi: "Ta hãy tìm ưu tiên chung.",
        en: "Let's find a shared priority.",
      },
    ],
    model_gurmukhi: "ਲੱਗਦਾ ਹੈ ਸਾਡੀਆਂ ਤਰਜੀਹਾਂ ਵੱਖਰੀਆਂ ਹਨ। ਆਓ ਪਹਿਲਾਂ ਸਾਂਝੀ ਤਰਜੀਹ ਲੱਭੀਏ।",
    model_romanization: "laggda hai sadian tarjihan vakhrian han. aao pehlan sanjhi tarjih labhie.",
    model_vi: "Có vẻ ưu tiên của chúng ta khác nhau. Trước hết ta hãy tìm ưu tiên chung.",
    model_en: "It seems our priorities differ. Let's first find a shared priority.",
    learner_trap: {
      trap_vi: "Biến bất đồng về hướng làm thành đánh giá năng lực.",
      trap_en: "Turning disagreement over direction into a judgment of competence.",
      repair_vi: "Đặt lại thành khác biệt về ਤਰਜੀਹਾਂ.",
      repair_en: "Reframe it as a difference in ਤਰਜੀਹਾਂ.",
    },
  },
  {
    id: "pa_c2_neg_compromise_schedule",
    focus: "propose_compromise",
    setting: "education",
    title_vi: "Đề xuất thỏa hiệp về lịch",
    title_en: "Propose a scheduling compromise",
    scenario_vi: "Một lịch học hoặc họp không phù hợp với mọi người.",
    scenario_en: "A class or meeting time does not work for everyone.",
    diplomacy_strategy_vi: "Đề xuất lựa chọn trung gian và xin phản hồi.",
    diplomacy_strategy_en: "Offer a middle option and invite feedback.",
    phrases: [
      {
        gurmukhi: "ਇੱਕ ਵਿਚਕਾਰਲਾ ਹੱਲ ਇਹ ਹੋ ਸਕਦਾ ਹੈ",
        romanization: "ikk vichkarla hall ih ho sakda hai",
        vi: "Một giải pháp trung gian có thể là...",
        en: "One middle-ground solution could be...",
      },
      {
        gurmukhi: "ਤੁਹਾਡੀ ਰਾਏ ਕੀ ਹੈ?",
        romanization: "tuhadi rai ki hai?",
        vi: "Ý kiến của anh/chị thế nào?",
        en: "What is your view?",
      },
    ],
    model_gurmukhi: "ਇੱਕ ਵਿਚਕਾਰਲਾ ਹੱਲ ਇਹ ਹੋ ਸਕਦਾ ਹੈ ਕਿ ਕਲਾਸ ਸ਼ਾਮ 6 ਵਜੇ ਸ਼ੁਰੂ ਹੋਵੇ। ਇਸ ਬਾਰੇ ਤੁਹਾਡੀ ਰਾਏ ਕੀ ਹੈ?",
    model_romanization: "ikk vichkarla hall ih ho sakda hai ki class shaam 6 vaje shuru hove. is bare tuhadi rai ki hai?",
    model_vi: "Một giải pháp trung gian có thể là lớp bắt đầu lúc 6 giờ tối. Anh/chị nghĩ sao về việc này?",
    model_en: "One middle-ground solution could be that class starts at 6 p.m. What is your view on this?",
  },
  {
    id: "pa_c2_neg_repair_tension",
    focus: "repair_tension",
    setting: "community",
    title_vi: "Sửa căng thẳng sau câu nói mạnh",
    title_en: "Repair tension after a strong statement",
    scenario_vi: "Bạn hoặc người khác đã nói hơi mạnh trong cuộc họp.",
    scenario_en: "You or someone else spoke a bit strongly in a meeting.",
    diplomacy_strategy_vi: "Tách ý chính khỏi giọng căng, rồi quay lại mục tiêu chung.",
    diplomacy_strategy_en: "Separate the core point from the tense tone, then return to the shared goal.",
    phrases: [
      {
        gurmukhi: "ਸ਼ਾਇਦ ਲਹਿਜ਼ਾ ਥੋੜ੍ਹਾ ਸਖ਼ਤ ਹੋ ਗਿਆ",
        romanization: "shayad lahija thorrha sakht ho gia",
        vi: "Có lẽ giọng điệu hơi cứng.",
        en: "Perhaps the tone became a little strong.",
      },
      {
        gurmukhi: "ਮਕਸਦ ਹੱਲ ਲੱਭਣਾ ਹੈ",
        romanization: "maqsad hall labhna hai",
        vi: "Mục tiêu là tìm giải pháp.",
        en: "The goal is to find a solution.",
      },
    ],
    model_gurmukhi: "ਸ਼ਾਇਦ ਲਹਿਜ਼ਾ ਥੋੜ੍ਹਾ ਸਖ਼ਤ ਹੋ ਗਿਆ, ਪਰ ਮਕਸਦ ਹੱਲ ਲੱਭਣਾ ਹੈ। ਆਓ ਮੁੱਦੇ ਵੱਲ ਵਾਪਸ ਆਈਏ।",
    model_romanization: "shayad lahija thorrha sakht ho gia, par maqsad hall labhna hai. aao mudde vall wapas aie.",
    model_vi: "Có lẽ giọng điệu hơi cứng, nhưng mục tiêu là tìm giải pháp. Ta hãy quay lại vấn đề chính.",
    model_en: "Perhaps the tone became a little strong, but the goal is to find a solution. Let's return to the issue.",
    learner_trap: {
      trap_vi: "Nói 'đừng nóng' có thể làm người nghe phòng thủ.",
      trap_en: "Saying 'do not get angry' can make the listener defensive.",
      repair_vi: "Nói về ਲਹਿਜ਼ਾ và mục tiêu chung.",
      repair_en: "Name the tone and shared purpose instead.",
    },
  },
  {
    id: "pa_c2_neg_sensitive_workplace_load",
    focus: "sensitive_workplace",
    setting: "workplace",
    title_vi: "Bàn khối lượng công việc nhạy cảm",
    title_en: "Discuss sensitive workload issues",
    scenario_vi: "Bạn cần nói rằng nhóm đang quá tải mà không đổ lỗi cá nhân.",
    scenario_en: "You need to say the team is overloaded without blaming individuals.",
    diplomacy_strategy_vi: "Nói bằng dữ kiện và ảnh hưởng, tránh gán lỗi.",
    diplomacy_strategy_en: "Use facts and impact, avoid assigning blame.",
    phrases: [
      {
        gurmukhi: "ਕੰਮ ਦਾ ਬੋਝ ਵੱਧ ਰਿਹਾ ਹੈ",
        romanization: "kamm da bojh vadh riha hai",
        vi: "Khối lượng công việc đang tăng.",
        en: "The workload is increasing.",
      },
      {
        gurmukhi: "ਗੁਣਵੱਤਾ ਪ੍ਰਭਾਵਿਤ ਹੋ ਸਕਦੀ ਹੈ",
        romanization: "gunvatta prabhavit ho sakdi hai",
        vi: "Chất lượng có thể bị ảnh hưởng.",
        en: "Quality may be affected.",
      },
    ],
    model_gurmukhi: "ਕੰਮ ਦਾ ਬੋਝ ਵੱਧ ਰਿਹਾ ਹੈ, ਅਤੇ ਜੇ ਇਹੋ ਜਿਹਾ ਚੱਲਿਆ ਤਾਂ ਗੁਣਵੱਤਾ ਪ੍ਰਭਾਵਿਤ ਹੋ ਸਕਦੀ ਹੈ।",
    model_romanization: "kamm da bojh vadh riha hai, ate je iho jiha challia taan gunvatta prabhavit ho sakdi hai.",
    model_vi: "Khối lượng công việc đang tăng, và nếu tiếp tục như vậy thì chất lượng có thể bị ảnh hưởng.",
    model_en: "The workload is increasing, and if this continues, quality may be affected.",
    learner_trap: {
      trap_vi: "Nói 'mọi người làm chậm' khiến thành vấn đề cá nhân.",
      trap_en: "Saying 'everyone is slow' makes it personal.",
      repair_vi: "Nói khối lượng, thời gian, và ảnh hưởng.",
      repair_en: "Talk about workload, time, and impact.",
    },
  },
  {
    id: "pa_c2_neg_sensitive_community_roles",
    focus: "sensitive_community",
    setting: "community",
    title_vi: "Bàn vai trò cộng đồng một cách tế nhị",
    title_en: "Discuss community roles tactfully",
    scenario_vi: "Cần phân chia trách nhiệm mà không giả định tuổi, giới, hoặc gia đình.",
    scenario_en: "Responsibilities need to be divided without assuming age, gender, or family roles.",
    diplomacy_strategy_vi: "Hỏi khả năng và sở thích thay vì gán vai.",
    diplomacy_strategy_en: "Ask about capacity and preference instead of assigning roles.",
    phrases: [
      {
        gurmukhi: "ਕੌਣ ਇਸ ਕੰਮ ਲਈ ਸੁਵਿਧਾ ਮਹਿਸੂਸ ਕਰਦਾ ਹੈ?",
        romanization: "kaun is kamm lai suvidha mahisus karda hai?",
        vi: "Ai cảm thấy tiện/thoải mái với việc này?",
        en: "Who feels comfortable with this task?",
      },
      {
        gurmukhi: "ਅਸੀਂ ਰੁਚੀ ਅਤੇ ਸਮੇਂ ਦੇ ਅਨੁਸਾਰ ਵੰਡ ਕਰ ਸਕਦੇ ਹਾਂ",
        romanization: "asin ruchi ate same de anusaar vand kar sakde haan",
        vi: "Chúng ta có thể phân chia theo sở thích và thời gian.",
        en: "We can divide it by interest and availability.",
      },
    ],
    model_gurmukhi: "ਅਸੀਂ ਰੁਚੀ ਅਤੇ ਸਮੇਂ ਦੇ ਅਨੁਸਾਰ ਵੰਡ ਕਰ ਸਕਦੇ ਹਾਂ। ਕੌਣ ਇਸ ਕੰਮ ਲਈ ਸੁਵਿਧਾ ਮਹਿਸੂਸ ਕਰਦਾ ਹੈ?",
    model_romanization: "asin ruchi ate same de anusaar vand kar sakde haan. kaun is kamm lai suvidha mahisus karda hai?",
    model_vi: "Chúng ta có thể phân chia theo sở thích và thời gian. Ai cảm thấy tiện với việc này?",
    model_en: "We can divide the work by interest and availability. Who feels comfortable with this task?",
  },
  {
    id: "pa_c2_neg_public_service_canada_documents",
    focus: "public_service_topics",
    setting: "canada_service",
    title_vi: "Thương lượng giấy tờ trong dịch vụ công Canada",
    title_en: "Negotiating documents in Canadian public service",
    scenario_vi: "Bạn thiếu một giấy tờ và cần hỏi lựa chọn thay thế.",
    scenario_en: "You are missing one document and need to ask about alternatives.",
    diplomacy_strategy_vi: "Thừa nhận yêu cầu, trình bày tình hình, hỏi lựa chọn thay thế.",
    diplomacy_strategy_en: "Acknowledge the requirement, state the situation, ask about alternatives.",
    phrases: [
      {
        gurmukhi: "ਮੈਨੂੰ ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼ ਦੀ ਸਮਝ ਹੈ",
        romanization: "mainu lorinde dastavez di samajh hai",
        vi: "Tôi hiểu giấy tờ cần thiết.",
        en: "I understand the required document.",
      },
      {
        gurmukhi: "ਕੀ ਕੋਈ ਹੋਰ ਵਿਕਲਪ ਹੋ ਸਕਦਾ ਹੈ?",
        romanization: "ki koi hor vikalp ho sakda hai?",
        vi: "Có lựa chọn thay thế nào không?",
        en: "Could there be another option?",
      },
    ],
    model_gurmukhi: "ਮੈਨੂੰ ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼ ਦੀ ਸਮਝ ਹੈ, ਪਰ ਇਸ ਵੇਲੇ ਮੇਰੇ ਕੋਲ ਕਾਪੀ ਹੀ ਹੈ। ਕੀ ਕੋਈ ਹੋਰ ਵਿਕਲਪ ਹੋ ਸਕਦਾ ਹੈ?",
    model_romanization: "mainu lorinde dastavez di samajh hai, par is vele mere kol copy hi hai. ki koi hor vikalp ho sakda hai?",
    model_vi: "Tôi hiểu giấy tờ cần thiết, nhưng hiện tại tôi chỉ có bản sao. Có lựa chọn thay thế nào không?",
    model_en: "I understand the required document, but right now I only have a copy. Could there be another option?",
    canada_practical: true,
    learner_trap: {
      trap_vi: "Nói 'tôi không có' rồi dừng lại, khiến cuộc trao đổi bế tắc.",
      trap_en: "Saying 'I do not have it' and stopping, which blocks the exchange.",
      repair_vi: "Thêm câu hỏi về ਵਿਕਲਪ.",
      repair_en: "Add a question about ਵਿਕਲਪ.",
    },
  },
  {
    id: "pa_c2_neg_school_canada_accommodation",
    focus: "propose_compromise",
    setting: "canada_service",
    title_vi: "Đề xuất điều chỉnh trong trường học Canada",
    title_en: "Propose an accommodation in a Canadian school",
    scenario_vi: "Bạn cần xin điều chỉnh lịch hoặc hình thức nộp bài.",
    scenario_en: "You need to ask for a schedule or submission adjustment.",
    diplomacy_strategy_vi: "Nêu nhu cầu thực tế, đề xuất phương án cụ thể, cho quyền quyết định.",
    diplomacy_strategy_en: "State the practical need, propose a concrete option, leave decision space.",
    phrases: [
      {
        gurmukhi: "ਮੇਰੀ ਸਥਿਤੀ ਇਹ ਹੈ ਕਿ",
        romanization: "meri sthiti ih hai ki",
        vi: "Tình huống của tôi là...",
        en: "My situation is that...",
      },
      {
        gurmukhi: "ਜੇ ਇਹ ਸੰਭਵ ਹੋਵੇ",
        romanization: "je ih sambhav hove",
        vi: "Nếu điều này có thể.",
        en: "If this is possible.",
      },
    ],
    model_gurmukhi: "ਮੇਰੀ ਸਥਿਤੀ ਇਹ ਹੈ ਕਿ ਮੈਨੂੰ ਇੱਕ ਦਿਨ ਹੋਰ ਚਾਹੀਦਾ ਹੈ। ਜੇ ਇਹ ਸੰਭਵ ਹੋਵੇ ਤਾਂ ਮੈਂ ਕੰਮ ਕੱਲ੍ਹ ਸ਼ਾਮ ਤੱਕ ਭੇਜ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।",
    model_romanization: "meri sthiti ih hai ki mainu ikk din hor chahida hai. je ih sambhav hove taan main kamm kallh shaam takk bhej sakda/sakdi haan.",
    model_vi: "Tình huống của tôi là tôi cần thêm một ngày. Nếu có thể, tôi có thể gửi bài trước tối mai.",
    model_en: "My situation is that I need one more day. If possible, I can send the work by tomorrow evening.",
    canada_practical: true,
  },
  {
    id: "pa_c2_neg_script_scope",
    focus: "public_service_topics",
    setting: "education",
    title_vi: "Ngoại giao khi nói phạm vi hệ chữ",
    title_en: "Diplomacy when stating script scope",
    scenario_vi: "Bạn cần nói rõ tài liệu dùng Gurmukhi mà không hạ thấp Shahmukhi.",
    scenario_en: "You need to state that the material uses Gurmukhi without devaluing Shahmukhi.",
    diplomacy_strategy_vi: "Nêu phạm vi học, không so sánh đúng/sai.",
    diplomacy_strategy_en: "State learning scope without comparing right/wrong.",
    phrases: [
      {
        gurmukhi: "ਇਸ ਸਮੱਗਰੀ ਵਿੱਚ ਗੁਰਮੁਖੀ ਮੁੱਖ ਹੈ",
        romanization: "is samagri vich Gurmukhi mukh hai",
        vi: "Trong tài liệu này Gurmukhi là chính.",
        en: "In this material, Gurmukhi is primary.",
      },
      {
        gurmukhi: "ਸ਼ਾਹਮੁਖੀ ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਲਈ ਜ਼ਿਕਰ ਹੈ",
        romanization: "Shahmukhi sirf jaankaari lai zikar hai",
        vi: "Shahmukhi chỉ được nhắc để nhận biết.",
        en: "Shahmukhi is mentioned only for awareness.",
      },
    ],
    model_gurmukhi: "ਇਸ ਸਮੱਗਰੀ ਵਿੱਚ ਗੁਰਮੁਖੀ ਮੁੱਖ ਹੈ; ਸ਼ਾਹਮੁਖੀ ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਲਈ ਜ਼ਿਕਰ ਹੈ, ਪੂਰੇ ਕੋਰਸ ਵਾਂਗ ਨਹੀਂ।",
    model_romanization: "is samagri vich Gurmukhi mukh hai; Shahmukhi sirf jaankaari lai zikar hai, pure course vaang nahin.",
    model_vi: "Trong tài liệu này Gurmukhi là chính; Shahmukhi chỉ được nhắc để nhận biết, không phải như một khóa đầy đủ.",
    model_en: "In this material, Gurmukhi is primary; Shahmukhi is mentioned only for awareness, not as a full course.",
  },
];

export const negotiationDiplomacyC2ByFocus = (
  focus: PunjabiNegotiationDiplomacyFocus,
): PunjabiNegotiationDiplomacyEntry[] =>
  negotiationDiplomacyC2Entries.filter((entry) => entry.focus === focus);
