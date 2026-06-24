// Punjabi C2 rhetorical moves for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support material, not native-reviewed authority. Native
// review is deferred. Shahmukhi is mentioned only for script awareness, not as
// a full course.

export type PunjabiRhetoricalMoveFocus =
  | "framing"
  | "concession"
  | "reframing"
  | "softening"
  | "careful_intensifying"
  | "audience_awareness"
  | "community_speech"
  | "persuasive_respectful_sequence";

export type PunjabiRhetoricalMoveContext =
  | "academic"
  | "workplace"
  | "community"
  | "public_notice"
  | "canada_service"
  | "family_public"
  | "formal_public";

export type PunjabiRhetoricalMovePhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiRhetoricalMoveTrap = {
  trap_vi: string;
  trap_en: string;
  better_vi: string;
  better_en: string;
};

export type PunjabiRhetoricalMoveEntry = {
  id: string;
  focus: PunjabiRhetoricalMoveFocus;
  context: PunjabiRhetoricalMoveContext;
  title_vi: string;
  title_en: string;
  purpose_vi: string;
  purpose_en: string;
  rhetorical_pattern_vi: string;
  rhetorical_pattern_en: string;
  phrases: PunjabiRhetoricalMovePhrase[];
  example_gurmukhi: string;
  example_romanization: string;
  example_vi: string;
  example_en: string;
  learner_trap?: PunjabiRhetoricalMoveTrap;
  canada_practical?: boolean;
};

export const RHETORICAL_MOVES_C2_DISCLAIMER = {
  vi: "Bộ động tác tu từ Punjabi C2 này chỉ hỗ trợ học tập. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ, không phải khóa học đầy đủ.",
  en: "This C2 Punjabi rhetorical moves pack is for study support only. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness, not taught as a full course.",
} as const;

export const rhetoricalMovesC2Entries: PunjabiRhetoricalMoveEntry[] = [
  {
    id: "pa_c2_move_frame_question",
    focus: "framing",
    context: "academic",
    title_vi: "Đóng khung vấn đề bằng câu hỏi đúng",
    title_en: "Frame the issue with the right question",
    purpose_vi: "Chuyển tranh luận khỏi câu hỏi có/không sang tiêu chí đánh giá.",
    purpose_en: "Move a debate away from yes/no toward evaluation criteria.",
    rhetorical_pattern_vi: "Không phải X hay không; mà là X theo cách nào, với điều kiện nào.",
    rhetorical_pattern_en: "Not whether X; rather how X, and under what conditions.",
    phrases: [
      {
        gurmukhi: "ਸਵਾਲ ਇਹ ਨਹੀਂ ਕਿ",
        romanization: "savaal ih nahin ki",
        vi: "Câu hỏi không phải là...",
        en: "The question is not whether...",
      },
      {
        gurmukhi: "ਸਵਾਲ ਇਹ ਹੈ ਕਿ",
        romanization: "savaal ih hai ki",
        vi: "Câu hỏi là...",
        en: "The question is...",
      },
    ],
    example_gurmukhi: "ਸਵਾਲ ਇਹ ਨਹੀਂ ਕਿ ਬਦਲਾਅ ਲੋੜੀਂਦਾ ਹੈ ਜਾਂ ਨਹੀਂ; ਸਵਾਲ ਇਹ ਹੈ ਕਿ ਬਦਲਾਅ ਕਿਵੇਂ ਅਤੇ ਕਿਸ ਦੀ ਭਾਗੀਦਾਰੀ ਨਾਲ ਹੋਵੇ।",
    example_romanization: "savaal ih nahin ki badlaa lorinda hai ja nahin; savaal ih hai ki badlaa kiven ate kis di bhaagidaari naal hove.",
    example_vi: "Câu hỏi không phải là có cần thay đổi hay không; câu hỏi là thay đổi thế nào và với sự tham gia của ai.",
    example_en: "The question is not whether change is needed; the question is how change happens and with whose participation.",
    learner_trap: {
      trap_vi: "Chỉ nói 'tôi đồng ý/không đồng ý' nên lập luận bị phẳng.",
      trap_en: "Only saying 'I agree/disagree', which makes the argument flat.",
      better_vi: "Đổi khung bằng ਸਵਾਲ ਇਹ ਨਹੀਂ...ਸਵਾਲ ਇਹ ਹੈ...",
      better_en: "Reframe with ਸਵਾਲ ਇਹ ਨਹੀਂ...ਸਵਾਲ ਇਹ ਹੈ...",
    },
  },
  {
    id: "pa_c2_move_concede_then_limit",
    focus: "concession",
    context: "workplace",
    title_vi: "Nhượng bộ rồi giới hạn",
    title_en: "Concede, then limit",
    purpose_vi: "Công nhận điểm đúng nhưng không chấp nhận toàn bộ kết luận.",
    purpose_en: "Acknowledge a valid point without accepting the whole conclusion.",
    rhetorical_pattern_vi: "Đúng là A; tuy vậy A không đủ để kết luận B.",
    rhetorical_pattern_en: "A is true; however A is not enough to conclude B.",
    phrases: [
      {
        gurmukhi: "ਇਹ ਗੱਲ ਸਹੀ ਹੈ ਕਿ",
        romanization: "ih gall sahi hai ki",
        vi: "Điều này đúng là...",
        en: "It is true that...",
      },
      {
        gurmukhi: "ਪਰ ਇਸ ਨਾਲ ਪੂਰਾ ਨਤੀਜਾ ਨਹੀਂ ਨਿਕਲਦਾ",
        romanization: "par is naal pura natija nahin nikalda",
        vi: "Nhưng từ đó chưa ra toàn bộ kết luận.",
        en: "But the full conclusion does not follow from this.",
      },
    ],
    example_gurmukhi: "ਇਹ ਗੱਲ ਸਹੀ ਹੈ ਕਿ ਖ਼ਰਚ ਵਧਿਆ ਹੈ, ਪਰ ਇਸ ਨਾਲ ਪੂਰਾ ਨਤੀਜਾ ਨਹੀਂ ਨਿਕਲਦਾ ਕਿ ਯੋਜਨਾ ਛੱਡ ਦੇਈਏ।",
    example_romanization: "ih gall sahi hai ki kharch vadhia hai, par is naal pura natija nahin nikalda ki yojna chhadd deie.",
    example_vi: "Đúng là chi phí đã tăng, nhưng từ đó chưa thể kết luận rằng ta nên bỏ kế hoạch.",
    example_en: "It is true that costs have increased, but it does not fully follow that we should abandon the plan.",
    learner_trap: {
      trap_vi: "Nhượng bộ xong mất luôn lập trường.",
      trap_en: "Conceding and then losing your own position.",
      better_vi: "Sau concession, thêm giới hạn logic bằng ਪਰ.",
      better_en: "After the concession, add a logical limit with ਪਰ.",
    },
  },
  {
    id: "pa_c2_move_reframe_from_blame",
    focus: "reframing",
    context: "workplace",
    title_vi: "Đổi khung từ lỗi cá nhân sang quy trình",
    title_en: "Reframe from personal blame to process",
    purpose_vi: "Giảm đối đầu và giữ trọng tâm sửa lỗi.",
    purpose_en: "Reduce confrontation and keep focus on repair.",
    rhetorical_pattern_vi: "Không gọi người sai; gọi quy trình cần xem lại.",
    rhetorical_pattern_en: "Do not call the person wrong; say the process needs review.",
    phrases: [
      {
        gurmukhi: "ਮੁੱਦਾ ਵਿਅਕਤੀ ਦਾ ਨਹੀਂ",
        romanization: "mudda viakti da nahin",
        vi: "Vấn đề không phải ở cá nhân.",
        en: "The issue is not the individual.",
      },
      {
        gurmukhi: "ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਮੁੜ ਵੇਖਣ ਦੀ ਲੋੜ ਹੈ",
        romanization: "prakiria nu mur vekhan di lor hai",
        vi: "Quy trình cần được xem lại.",
        en: "The process needs to be reviewed.",
      },
    ],
    example_gurmukhi: "ਮੁੱਦਾ ਵਿਅਕਤੀ ਦਾ ਨਹੀਂ; ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਮੁੜ ਵੇਖਣ ਦੀ ਲੋੜ ਹੈ ਤਾਂ ਜੋ ਗਲਤੀ ਦੁਬਾਰਾ ਨਾ ਹੋਵੇ।",
    example_romanization: "mudda viakti da nahin; prakiria nu mur vekhan di lor hai taan jo galti dubara na hove.",
    example_vi: "Vấn đề không phải ở cá nhân; quy trình cần được xem lại để lỗi không lặp lại.",
    example_en: "The issue is not the individual; the process needs review so the error does not happen again.",
    learner_trap: {
      trap_vi: "Dịch 'you made a mistake' quá trực tiếp.",
      trap_en: "Translating 'you made a mistake' too directly.",
      better_vi: "Đổi trọng tâm sang ਪ੍ਰਕਿਰਿਆ nếu mục tiêu là cải thiện hệ thống.",
      better_en: "Shift to ਪ੍ਰਕਿਰਿਆ if the goal is system improvement.",
    },
  },
  {
    id: "pa_c2_move_soften_request",
    focus: "softening",
    context: "canada_service",
    title_vi: "Làm mềm yêu cầu trong bối cảnh dịch vụ Canada",
    title_en: "Soften a request in a Canada service context",
    purpose_vi: "Xin hỗ trợ rõ ràng nhưng để người nghe có không gian xử lý.",
    purpose_en: "Ask clearly for help while giving the listener room to respond.",
    rhetorical_pattern_vi: "Xin lỗi mở lời + nếu có thể + yêu cầu cụ thể.",
    rhetorical_pattern_en: "Excuse me opener + if possible + specific request.",
    phrases: [
      {
        gurmukhi: "ਮਾਫ਼ ਕਰਨਾ ਜੀ",
        romanization: "maaf karna ji",
        vi: "Xin lỗi / làm phiền ạ.",
        en: "Excuse me.",
      },
      {
        gurmukhi: "ਜੇ ਸੰਭਵ ਹੋਵੇ",
        romanization: "je sambhav hove",
        vi: "Nếu có thể.",
        en: "If possible.",
      },
    ],
    example_gurmukhi: "ਮਾਫ਼ ਕਰਨਾ ਜੀ, ਜੇ ਸੰਭਵ ਹੋਵੇ ਤਾਂ ਕੀ ਤੁਸੀਂ ਕੈਨੇਡਾ ਵਾਲੇ ਫਾਰਮ ਦੀ ਆਖ਼ਰੀ ਮਿਤੀ ਦੱਸ ਸਕਦੇ ਹੋ?",
    example_romanization: "maaf karna ji, je sambhav hove taan ki tusin Canada wale form di aakhri miti dass sakde ho?",
    example_vi: "Xin lỗi ạ, nếu có thể, anh/chị cho biết hạn cuối của mẫu đơn ở Canada được không?",
    example_en: "Excuse me, if possible, could you tell me the deadline for the Canada form?",
    canada_practical: true,
  },
  {
    id: "pa_c2_move_intensify_carefully",
    focus: "careful_intensifying",
    context: "public_notice",
    title_vi: "Nhấn mạnh cẩn thận",
    title_en: "Intensify carefully",
    purpose_vi: "Nói việc quan trọng mà không tạo hoảng hoặc trách móc.",
    purpose_en: "Say something is important without creating panic or blame.",
    rhetorical_pattern_vi: "Mức độ quan trọng + lý do + hành động cụ thể.",
    rhetorical_pattern_en: "Importance level + reason + concrete action.",
    phrases: [
      {
        gurmukhi: "ਇਹ ਗੱਲ ਖ਼ਾਸ ਧਿਆਨ ਦੀ ਹੈ",
        romanization: "ih gall khaas dhiaan di hai",
        vi: "Điều này cần chú ý đặc biệt.",
        en: "This needs special attention.",
      },
      {
        gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਪੁਸ਼ਟੀ ਕਰ ਦਿਓ",
        romanization: "kirpa karke pushti kar dio",
        vi: "Vui lòng xác nhận.",
        en: "Please confirm.",
      },
    ],
    example_gurmukhi: "ਇਹ ਗੱਲ ਖ਼ਾਸ ਧਿਆਨ ਦੀ ਹੈ ਕਿਉਂਕਿ ਸਥਾਨ ਬਦਲਿਆ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਹਾਜ਼ਰੀ ਦੀ ਪੁਸ਼ਟੀ ਕਰ ਦਿਓ।",
    example_romanization: "ih gall khaas dhiaan di hai kyonki sathaan badlia hai. kirpa karke apni haazri di pushti kar dio.",
    example_vi: "Điều này cần chú ý đặc biệt vì địa điểm đã đổi. Vui lòng xác nhận sự tham dự.",
    example_en: "This needs special attention because the location changed. Please confirm your attendance.",
    learner_trap: {
      trap_vi: "Dùng ਬਹੁਤ ਜ਼ਰੂਰੀ nhiều lần khiến thông báo nghe căng.",
      trap_en: "Repeating ਬਹੁਤ ਜ਼ਰੂਰੀ makes the notice sound tense.",
      better_vi: "Nhấn bằng lý do và hành động cụ thể.",
      better_en: "Intensify through the reason and concrete action.",
    },
  },
  {
    id: "pa_c2_move_audience_awareness",
    focus: "audience_awareness",
    context: "community",
    title_vi: "Điều chỉnh theo người nghe",
    title_en: "Adjust for the audience",
    purpose_vi: "Nói cùng một nội dung nhưng chọn mức trang trọng phù hợp.",
    purpose_en: "Say the same content while choosing the right formality level.",
    rhetorical_pattern_vi: "Với nhóm rộng: rõ hơn, ít thành ngữ hơn, nhiều bối cảnh hơn.",
    rhetorical_pattern_en: "For a broad group: clearer, fewer idioms, more context.",
    phrases: [
      {
        gurmukhi: "ਸਭ ਦੀ ਸਹੂਲਤ ਲਈ",
        romanization: "sabh di sahulat lai",
        vi: "Để thuận tiện cho mọi người.",
        en: "For everyone's convenience.",
      },
      {
        gurmukhi: "ਸੌਖੇ ਸ਼ਬਦਾਂ ਵਿੱਚ",
        romanization: "saukhe shabdan vich",
        vi: "Nói bằng lời đơn giản.",
        en: "In simple words.",
      },
    ],
    example_gurmukhi: "ਸਭ ਦੀ ਸਹੂਲਤ ਲਈ, ਸੌਖੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਕਹੀਏ ਤਾਂ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪਹਿਲਾਂ ਕਰਨੀ ਪਵੇਗੀ।",
    example_romanization: "sabh di sahulat lai, saukhe shabdan vich kahiye taan registration pehlan karni pavegi.",
    example_vi: "Để thuận tiện cho mọi người, nói đơn giản là cần đăng ký trước.",
    example_en: "For everyone's convenience, in simple words, registration must be done beforehand.",
  },
  {
    id: "pa_c2_move_community_closing",
    focus: "community_speech",
    context: "community",
    title_vi: "Kết lời cộng đồng bằng hướng chung",
    title_en: "Close community speech with shared direction",
    purpose_vi: "Kết thúc phát biểu bằng cảm giác đoàn kết và bước tiếp theo.",
    purpose_en: "End a speech with unity and the next step.",
    rhetorical_pattern_vi: "Cảm ơn + giá trị chung + bước tiếp theo.",
    rhetorical_pattern_en: "Thanks + shared value + next step.",
    phrases: [
      {
        gurmukhi: "ਸਭ ਦੇ ਸਹਿਯੋਗ ਲਈ ਧੰਨਵਾਦ",
        romanization: "sabh de sahiyog lai dhannvaad",
        vi: "Cảm ơn sự hợp tác của mọi người.",
        en: "Thank you for everyone's cooperation.",
      },
      {
        gurmukhi: "ਅਗਲਾ ਕਦਮ ਸਾਂਝੇ ਤੌਰ ਤੇ ਚੁੱਕੀਏ",
        romanization: "agla kadam sanjhe taur te chukie",
        vi: "Ta hãy cùng thực hiện bước tiếp theo.",
        en: "Let's take the next step together.",
      },
    ],
    example_gurmukhi: "ਸਭ ਦੇ ਸਹਿਯੋਗ ਲਈ ਧੰਨਵਾਦ। ਹੁਣ ਅਗਲਾ ਕਦਮ ਸਾਂਝੇ ਤੌਰ ਤੇ ਚੁੱਕੀਏ।",
    example_romanization: "sabh de sahiyog lai dhannvaad. hun agla kadam sanjhe taur te chukie.",
    example_vi: "Cảm ơn sự hợp tác của mọi người. Bây giờ ta hãy cùng thực hiện bước tiếp theo.",
    example_en: "Thank you for everyone's cooperation. Now let's take the next step together.",
  },
  {
    id: "pa_c2_move_persuasive_sequence",
    focus: "persuasive_respectful_sequence",
    context: "formal_public",
    title_vi: "Chuỗi thuyết phục tôn trọng",
    title_en: "Respectful persuasive sequencing",
    purpose_vi: "Thuyết phục bằng trật tự: vấn đề, tác động, lựa chọn, lời mời phản hồi.",
    purpose_en: "Persuade through sequence: issue, impact, option, invitation for feedback.",
    rhetorical_pattern_vi: "ਮੁੱਦਾ → ਪ੍ਰਭਾਵ → ਵਿਕਲਪ → ਰਾਏ.",
    rhetorical_pattern_en: "Issue -> impact -> option -> feedback.",
    phrases: [
      {
        gurmukhi: "ਮੁੱਦਾ ਇਹ ਹੈ ਕਿ",
        romanization: "mudda ih hai ki",
        vi: "Vấn đề là...",
        en: "The issue is that...",
      },
      {
        gurmukhi: "ਤੁਹਾਡੀ ਰਾਏ ਸੁਣਨੀ ਚਾਹਾਂਗੇ",
        romanization: "tuhadi rai sunni chahange",
        vi: "Chúng tôi muốn nghe ý kiến của anh/chị.",
        en: "We would like to hear your view.",
      },
    ],
    example_gurmukhi: "ਮੁੱਦਾ ਇਹ ਹੈ ਕਿ ਜਾਣਕਾਰੀ ਦੇਰ ਨਾਲ ਪਹੁੰਚਦੀ ਹੈ, ਜਿਸ ਨਾਲ ਯੋਜਨਾ ਪ੍ਰਭਾਵਿਤ ਹੁੰਦੀ ਹੈ। ਇੱਕ ਵਿਕਲਪ ਹਫ਼ਤਾਵਾਰੀ ਅੱਪਡੇਟ ਹੈ; ਇਸ ਬਾਰੇ ਤੁਹਾਡੀ ਰਾਏ ਸੁਣਨੀ ਚਾਹਾਂਗੇ।",
    example_romanization: "mudda ih hai ki jaankaari der naal pahunchdi hai, jis naal yojna prabhavit hundi hai. ikk vikalp haftavari update hai; is bare tuhadi rai sunni chahange.",
    example_vi: "Vấn đề là thông tin đến muộn, làm ảnh hưởng kế hoạch. Một lựa chọn là cập nhật hằng tuần; chúng tôi muốn nghe ý kiến của anh/chị về việc này.",
    example_en: "The issue is that information arrives late, which affects planning. One option is a weekly update; we would like to hear your view on this.",
    learner_trap: {
      trap_vi: "Đề xuất giải pháp trước khi người nghe hiểu vấn đề.",
      trap_en: "Offering the solution before the listener understands the problem.",
      better_vi: "Đi theo chuỗi vấn đề -> tác động -> lựa chọn -> phản hồi.",
      better_en: "Follow issue -> impact -> option -> feedback.",
    },
  },
  {
    id: "pa_c2_move_canada_clarify_docs",
    focus: "persuasive_respectful_sequence",
    context: "canada_service",
    title_vi: "Làm rõ giấy tờ ở Canada",
    title_en: "Clarifying documents in Canada",
    purpose_vi: "Hỏi lại yêu cầu giấy tờ mà không nghe như tranh cãi.",
    purpose_en: "Clarify document requirements without sounding argumentative.",
    rhetorical_pattern_vi: "Công nhận hướng dẫn + hỏi điểm chưa rõ + xin xác nhận.",
    rhetorical_pattern_en: "Acknowledge instruction + ask unclear point + request confirmation.",
    phrases: [
      {
        gurmukhi: "ਤੁਹਾਡੀ ਹਦਾਇਤ ਸਮਝ ਆ ਗਈ",
        romanization: "tuhadi hadaayat samajh aa gayi",
        vi: "Tôi đã hiểu hướng dẫn của anh/chị.",
        en: "I understood your instruction.",
      },
      {
        gurmukhi: "ਸਿਰਫ਼ ਇਹ ਪੁਸ਼ਟੀ ਕਰਨੀ ਸੀ",
        romanization: "sirf ih pushti karni si",
        vi: "Tôi chỉ muốn xác nhận điều này.",
        en: "I only wanted to confirm this.",
      },
    ],
    example_gurmukhi: "ਤੁਹਾਡੀ ਹਦਾਇਤ ਸਮਝ ਆ ਗਈ। ਸਿਰਫ਼ ਇਹ ਪੁਸ਼ਟੀ ਕਰਨੀ ਸੀ ਕਿ ਕੈਨੇਡਾ ਵਾਲੇ ਦਸਤਾਵੇਜ਼ ਦੀ ਕਾਪੀ ਚੱਲੇਗੀ ਜਾਂ ਅਸਲ ਚਾਹੀਦਾ ਹੈ।",
    example_romanization: "tuhadi hadaayat samajh aa gayi. sirf ih pushti karni si ki Canada wale dastavez di copy challegi ja asal chahida hai.",
    example_vi: "Tôi đã hiểu hướng dẫn. Tôi chỉ muốn xác nhận là bản sao giấy tờ ở Canada có được không hay cần bản gốc.",
    example_en: "I understood the instruction. I only wanted to confirm whether a copy of the Canada document is acceptable or the original is required.",
    canada_practical: true,
  },
  {
    id: "pa_c2_move_script_scope",
    focus: "audience_awareness",
    context: "academic",
    title_vi: "Nêu phạm vi hệ chữ cho người học",
    title_en: "State script scope for learners",
    purpose_vi: "Tránh gây hiểu lầm rằng phần học này dạy mọi hệ chữ Punjabi.",
    purpose_en: "Avoid implying this section teaches every Punjabi script.",
    rhetorical_pattern_vi: "Nêu trọng tâm + nhắc nhận biết + giới hạn phạm vi.",
    rhetorical_pattern_en: "State focus + note awareness + limit scope.",
    phrases: [
      {
        gurmukhi: "ਗੁਰਮੁਖੀ ਇੱਥੇ ਮੁੱਖ ਲਿਪੀ ਹੈ",
        romanization: "Gurmukhi ithe mukh lipi hai",
        vi: "Gurmukhi là hệ chữ chính ở đây.",
        en: "Gurmukhi is the main script here.",
      },
      {
        gurmukhi: "ਸ਼ਾਹਮੁਖੀ ਦਾ ਜ਼ਿਕਰ ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਲਈ ਹੈ",
        romanization: "Shahmukhi da zikar sirf jaankaari lai hai",
        vi: "Shahmukhi chỉ được nhắc để nhận biết.",
        en: "Shahmukhi is mentioned only for awareness.",
      },
    ],
    example_gurmukhi: "ਗੁਰਮੁਖੀ ਇੱਥੇ ਮੁੱਖ ਲਿਪੀ ਹੈ; ਸ਼ਾਹਮੁਖੀ ਦਾ ਜ਼ਿਕਰ ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਲਈ ਹੈ, ਪੂਰੇ ਕੋਰਸ ਵਾਂਗ ਨਹੀਂ।",
    example_romanization: "Gurmukhi ithe mukh lipi hai; Shahmukhi da zikar sirf jaankaari lai hai, pure course vaang nahin.",
    example_vi: "Gurmukhi là hệ chữ chính ở đây; Shahmukhi chỉ được nhắc để nhận biết, không phải như một khóa đầy đủ.",
    example_en: "Gurmukhi is the main script here; Shahmukhi is mentioned only for awareness, not as a full course.",
  },
];

export const rhetoricalMovesC2ByFocus = (
  focus: PunjabiRhetoricalMoveFocus,
): PunjabiRhetoricalMoveEntry[] => rhetoricalMovesC2Entries.filter((entry) => entry.focus === focus);
