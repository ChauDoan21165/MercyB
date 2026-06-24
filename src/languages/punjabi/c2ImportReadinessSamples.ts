// Punjabi C2 import-readiness samples for Vietnamese- and English-speaking learners.
// Gurmukhi is primary; romanization is a reading aid.
//
// Scope/status: study-support import-readiness samples only, not certification,
// official placement, legal/HR/medical/safety advice, or native-reviewed
// authority. Native review is deferred. Shahmukhi is mentioned only for script
// awareness, not as a full course.

export type PunjabiC2ImportReadinessFocus =
  | "nuanced_disagreement"
  | "diplomacy"
  | "mediation"
  | "deescalation"
  | "audience_adaptation"
  | "sensitive_topic_framing"
  | "public_communication_calibration"
  | "register_safety";

export type PunjabiC2ImportReadinessStyle =
  | "import_readiness"
  | "final_regression"
  | "pre_integration"
  | "readiness";

export type PunjabiC2ImportReadinessPhrase = {
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiC2ImportReadinessCheck = {
  check_vi: string;
  check_en: string;
  signal_vi: string;
  signal_en: string;
};

export type PunjabiC2ImportReadinessTrap = {
  trap_vi: string;
  trap_en: string;
  repair_vi: string;
  repair_en: string;
};

export type PunjabiC2ImportReadinessSample = {
  id: string;
  focus: PunjabiC2ImportReadinessFocus;
  style: PunjabiC2ImportReadinessStyle;
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
  readiness_phrases: PunjabiC2ImportReadinessPhrase[];
  checks: PunjabiC2ImportReadinessCheck[];
  learner_trap?: PunjabiC2ImportReadinessTrap;
  canada_practical?: boolean;
};

export const C2_IMPORT_READINESS_SAMPLES_DISCLAIMER = {
  vi: "Bộ mẫu import-readiness Punjabi C2 này chỉ hỗ trợ học tập, không phải chứng nhận hay xếp lớp chính thức. Gurmukhi là chính; phiên âm chỉ giúp đọc. Thẩm định bản xứ được hoãn lại. Shahmukhi chỉ được nhắc để nhận biết hệ chữ.",
  en: "This C2 Punjabi import-readiness sample pack supports study only, not certification or official placement. Gurmukhi is primary; romanization only supports reading. Native review is deferred. Shahmukhi is noted only for script awareness.",
} as const;

export const c2ImportReadinessSamples: PunjabiC2ImportReadinessSample[] = [
  {
    id: "pa_c2_import_nuanced_disagreement",
    focus: "nuanced_disagreement",
    style: "import_readiness",
    title_vi: "Sẵn sàng import: phản biện có điều kiện",
    title_en: "Import-ready conditional disagreement",
    scenario_vi: "Bạn muốn giữ một ví dụ nhưng cần đánh dấu phần chưa đủ chắc trước khi import.",
    scenario_en: "You want to keep an example but mark the part that is not yet strong enough before import.",
    readiness_goal_vi: "Công nhận giá trị, rồi yêu cầu kiểm tra điều kiện còn thiếu.",
    readiness_goal_en: "Acknowledge value, then ask to check the missing condition.",
    sample_gurmukhi:
      "ਇਹ ਮਿਸਾਲ ਲਾਭਦਾਇਕ ਹੈ, ਪਰ import ਤੋਂ ਪਹਿਲਾਂ ਸੰਦਰਭ ਨੂੰ ਹੋਰ ਸਾਫ਼ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ।",
    sample_romanization:
      "ih misaal labhdaik hai, par import ton pehlaan sandarbh nu hor saaf karna chahida hai.",
    sample_vi:
      "Ví dụ này hữu ích, nhưng trước khi import nên làm rõ thêm ngữ cảnh.",
    sample_en:
      "This example is useful, but before import the context should be made clearer.",
    readiness_phrases: [
      {
        gurmukhi: "ਇਹ ਮਿਸਾਲ ਲਾਭਦਾਇਕ ਹੈ",
        romanization: "ih misaal labhdaik hai",
        vi: "Ví dụ này hữu ích.",
        en: "This example is useful.",
      },
      {
        gurmukhi: "ਸੰਦਰਭ ਨੂੰ ਹੋਰ ਸਾਫ਼ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ",
        romanization: "sandarbh nu hor saaf karna chahida hai",
        vi: "Nên làm rõ thêm ngữ cảnh.",
        en: "The context should be made clearer.",
      },
    ],
    checks: [
      {
        check_vi: "Có giữ giá trị của ví dụ trước khi yêu cầu sửa không?",
        check_en: "Does it preserve the example's value before asking for revision?",
        signal_vi: "Có ਲਾਭਦਾਇਕ trước khi nói ਹੋਰ ਸਾਫ਼.",
        signal_en: "Uses useful before asking for more clarity.",
      },
    ],
    learner_trap: {
      trap_vi: "Xóa ví dụ ngay khi thấy thiếu ngữ cảnh.",
      trap_en: "Deleting the example as soon as context is missing.",
      repair_vi: "Giữ phần dùng được và chỉ rõ điều kiện cần làm rõ.",
      repair_en: "Keep the usable part and name the condition to clarify.",
    },
  },
  {
    id: "pa_c2_import_diplomacy_canada",
    focus: "diplomacy",
    style: "pre_integration",
    title_vi: "Ngoại giao khi hoãn import",
    title_en: "Diplomacy when delaying import",
    scenario_vi: "Một nhóm cộng đồng ở Canada gửi nội dung tốt nhưng cần kiểm tra thêm trước khi nhập.",
    scenario_en: "A community group in Canada sends useful content that needs another check before import.",
    readiness_goal_vi: "Cảm ơn, nêu lý do hoãn ngắn gọn, và giữ lời mời hợp tác.",
    readiness_goal_en: "Thank them, state the brief reason for delay, and keep collaboration open.",
    sample_gurmukhi:
      "ਸਮੱਗਰੀ ਭੇਜਣ ਲਈ ਧੰਨਵਾਦ। ਅਸੀਂ ਇਸ ਨੂੰ import ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਇੱਕ ਛੋਟੀ ਜਾਂਚ ਕਰਾਂਗੇ, ਫਿਰ ਤੁਹਾਨੂੰ ਦੱਸਾਂਗੇ।",
    sample_romanization:
      "samagri bhejan lai dhanvaad. asin is nu import karan ton pehlaan ikk chhoti jaanch karange, fir tuhanu dassange.",
    sample_vi:
      "Cảm ơn đã gửi nội dung. Chúng tôi sẽ kiểm tra ngắn trước khi import, rồi sẽ báo lại.",
    sample_en:
      "Thank you for sending the content. We will do a brief check before importing it, then let you know.",
    readiness_phrases: [
      {
        gurmukhi: "ਸਮੱਗਰੀ ਭੇਜਣ ਲਈ ਧੰਨਵਾਦ",
        romanization: "samagri bhejan lai dhanvaad",
        vi: "Cảm ơn đã gửi nội dung.",
        en: "Thank you for sending the content.",
      },
      {
        gurmukhi: "ਇੱਕ ਛੋਟੀ ਜਾਂਚ ਕਰਾਂਗੇ",
        romanization: "ikk chhoti jaanch karange",
        vi: "Chúng tôi sẽ kiểm tra ngắn.",
        en: "We will do a brief check.",
      },
    ],
    checks: [
      {
        check_vi: "Có hoãn mà không làm người gửi mất thiện chí không?",
        check_en: "Does it delay without losing goodwill?",
        signal_vi: "Có ਧੰਨਵਾਦ và ਫਿਰ ਤੁਹਾਨੂੰ ਦੱਸਾਂਗੇ.",
        signal_en: "Includes thanks and then we will let you know.",
      },
    ],
    learner_trap: {
      trap_vi: "Nói 'chưa dùng được' nghe như bác bỏ toàn bộ đóng góp.",
      trap_en: "Saying 'not usable yet' sounds like rejecting the whole contribution.",
      repair_vi: "Cảm ơn trước, rồi nói kiểm tra ngắn trước khi nhập.",
      repair_en: "Thank them first, then say a brief check is needed before import.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_import_mediation",
    focus: "mediation",
    style: "import_readiness",
    title_vi: "Trung gian giữa hai nguồn nội dung",
    title_en: "Mediation between two content sources",
    scenario_vi: "Hai nguồn đưa cách diễn đạt khác nhau và bạn cần chọn cách nhập dữ liệu công bằng.",
    scenario_en: "Two sources provide different wording and you need a fair import decision.",
    readiness_goal_vi: "Đặt hai lựa chọn song song và dựa vào tiêu chí học tập.",
    readiness_goal_en: "Place both options in parallel and rely on learning criteria.",
    sample_gurmukhi:
      "ਇੱਕ ਰੂਪ ਬੋਲਚਾਲ ਦੇ ਨੇੜੇ ਹੈ, ਦੂਜਾ ਰੂਪ ਲਿਖਤੀ ਅੰਦਾਜ਼ ਦੇ। import ਲਈ ਸਿੱਖਣ ਵਾਲੇ ਮਕਸਦ ਨੂੰ ਮਾਪਦੰਡ ਬਣਾਈਏ।",
    sample_romanization:
      "ikk roop bolchaal de nere hai, duja roop likhti andaaz de. import lai sikhan wale maqsad nu mapdand banaie.",
    sample_vi:
      "Một dạng gần với khẩu ngữ, dạng kia gần với văn viết. Khi import, hãy lấy mục tiêu học làm tiêu chí.",
    sample_en:
      "One form is closer to speech, the other to written style. For import, let's use the learning goal as the criterion.",
    readiness_phrases: [
      {
        gurmukhi: "ਇੱਕ ਰੂਪ",
        romanization: "ikk roop",
        vi: "Một dạng.",
        en: "One form.",
      },
      {
        gurmukhi: "ਸਿੱਖਣ ਵਾਲੇ ਮਕਸਦ ਨੂੰ ਮਾਪਦੰਡ ਬਣਾਈਏ",
        romanization: "sikhan wale maqsad nu mapdand banaie",
        vi: "Hãy lấy mục tiêu học làm tiêu chí.",
        en: "Let's use the learning goal as the criterion.",
      },
    ],
    checks: [
      {
        check_vi: "Có tránh chọn phe nguồn nào đúng tuyệt đối không?",
        check_en: "Does it avoid declaring one source absolutely right?",
        signal_vi: "Có ਇੱਕ ਰੂਪ, ਦੂਜਾ ਰੂਪ, và ਮਾਪਦੰਡ.",
        signal_en: "Uses one form, the other form, and criterion.",
      },
    ],
    learner_trap: {
      trap_vi: "Gọi một nguồn là sai khi chỉ khác register.",
      trap_en: "Calling one source wrong when the difference is register.",
      repair_vi: "Nêu khác biệt register và chọn theo mục tiêu học.",
      repair_en: "Name the register difference and choose by learning goal.",
    },
  },
  {
    id: "pa_c2_import_deescalation",
    focus: "deescalation",
    style: "readiness",
    title_vi: "Hạ nhiệt khi import bị tranh luận",
    title_en: "De-escalate a disputed import",
    scenario_vi: "Người đóng góp bất đồng về việc ví dụ nào nên vào bộ học.",
    scenario_en: "Contributors disagree about which example should enter the learning set.",
    readiness_goal_vi: "Đưa cuộc trao đổi về tiêu chí kiểm tra thay vì cảm xúc.",
    readiness_goal_en: "Bring the exchange back to review criteria instead of emotion.",
    sample_gurmukhi:
      "ਆਓ ਪਹਿਲਾਂ ਮਾਪਦੰਡ ਵੇਖੀਏ: ਸੰਦਰਭ ਸਾਫ਼ ਹੈ, register ਠੀਕ ਹੈ, ਅਤੇ ਸਿੱਖਣ ਵਾਲੇ ਲਈ ਲਾਭਦਾਇਕ ਹੈ ਜਾਂ ਨਹੀਂ।",
    sample_romanization:
      "aao pehlaan mapdand vekhie: sandarbh saaf hai, register theek hai, ate sikhan wale lai labhdaik hai jaan nahin.",
    sample_vi:
      "Ta hãy xem tiêu chí trước: ngữ cảnh rõ không, register đúng không, và có hữu ích cho người học không.",
    sample_en:
      "Let's look at the criteria first: whether the context is clear, the register is appropriate, and it is useful for learners.",
    readiness_phrases: [
      {
        gurmukhi: "ਮਾਪਦੰਡ ਵੇਖੀਏ",
        romanization: "mapdand vekhie",
        vi: "Hãy xem tiêu chí.",
        en: "Let's look at the criteria.",
      },
      {
        gurmukhi: "ਸਿੱਖਣ ਵਾਲੇ ਲਈ ਲਾਭਦਾਇਕ",
        romanization: "sikhan wale lai labhdaik",
        vi: "Hữu ích cho người học.",
        en: "Useful for learners.",
      },
    ],
    checks: [
      {
        check_vi: "Có đưa tranh luận về tiêu chí rõ ràng không?",
        check_en: "Does it return the dispute to clear criteria?",
        signal_vi: "Có ਸੰਦਰਭ, register, và ਸਿੱਖਣ ਵਾਲੇ.",
        signal_en: "Names context, register, and learner usefulness.",
      },
    ],
    learner_trap: {
      trap_vi: "Đáp lại bằng cảm xúc làm cuộc thảo luận nóng thêm.",
      trap_en: "Responding emotionally makes the discussion hotter.",
      repair_vi: "Nêu tiêu chí cụ thể và hỏi từng tiêu chí.",
      repair_en: "Name concrete criteria and check them one by one.",
    },
  },
  {
    id: "pa_c2_import_audience_adaptation_canada",
    focus: "audience_adaptation",
    style: "final_regression",
    title_vi: "Điều chỉnh trước khi nhập cho người học song ngữ",
    title_en: "Adapt before import for bilingual learners",
    scenario_vi: "Một câu phù hợp với người bản ngữ nhưng khó cho người học Việt và Anh ở Canada.",
    scenario_en: "A sentence works for native speakers but is hard for Vietnamese- and English-speaking learners in Canada.",
    readiness_goal_vi: "Giữ Gurmukhi chính, thêm phiên âm và giải thích ngắn.",
    readiness_goal_en: "Keep Gurmukhi primary, with romanization and a short explanation.",
    sample_gurmukhi:
      "ਵਾਕ ਨੂੰ Gurmukhi ਵਿੱਚ ਰੱਖੀਏ, ਪਰ romanization ਅਤੇ ਛੋਟੀ ਵਿਆਖਿਆ ਵੀ ਦੇਈਏ ਤਾਂ ਕਿ ਸਿੱਖਣ ਵਾਲੇ ਸਮਝ ਸਕਣ।",
    sample_romanization:
      "vaak nu Gurmukhi vich rakhie, par romanization ate chhoti viakhia vi deie tan ki sikhan wale samajh sakan.",
    sample_vi:
      "Hãy giữ câu bằng Gurmukhi, nhưng thêm phiên âm và giải thích ngắn để người học hiểu được.",
    sample_en:
      "Keep the sentence in Gurmukhi, but also provide romanization and a short explanation so learners can understand.",
    readiness_phrases: [
      {
        gurmukhi: "Gurmukhi ਵਿੱਚ ਰੱਖੀਏ",
        romanization: "Gurmukhi vich rakhie",
        vi: "Hãy giữ bằng Gurmukhi.",
        en: "Keep it in Gurmukhi.",
      },
      {
        gurmukhi: "ਛੋਟੀ ਵਿਆਖਿਆ ਵੀ ਦੇਈਏ",
        romanization: "chhoti viakhia vi deie",
        vi: "Cũng hãy thêm giải thích ngắn.",
        en: "Also provide a short explanation.",
      },
    ],
    checks: [
      {
        check_vi: "Có hỗ trợ người học mà không thay Gurmukhi thành phụ không?",
        check_en: "Does it support learners without making Gurmukhi secondary?",
        signal_vi: "Có Gurmukhi ਵਿੱਚ ਰੱਖੀਏ và romanization.",
        signal_en: "Keeps Gurmukhi while adding romanization.",
      },
    ],
    learner_trap: {
      trap_vi: "Dựa hoàn toàn vào phiên âm khiến người học bỏ qua chữ Gurmukhi.",
      trap_en: "Relying only on romanization makes learners bypass Gurmukhi.",
      repair_vi: "Đặt Gurmukhi chính, phiên âm là hỗ trợ đọc.",
      repair_en: "Make Gurmukhi primary and romanization a reading aid.",
    },
    canada_practical: true,
  },
  {
    id: "pa_c2_import_sensitive_topic",
    focus: "sensitive_topic_framing",
    style: "pre_integration",
    title_vi: "Đóng khung nội dung nhạy cảm trước import",
    title_en: "Frame sensitive content before import",
    scenario_vi: "Ví dụ chạm vào chính trị, tôn giáo, danh tính cá nhân, hoặc tiền bạc.",
    scenario_en: "An example touches politics, religion, personal identity, or money.",
    readiness_goal_vi: "Giữ mục tiêu ngôn ngữ, bỏ tranh luận lập trường.",
    readiness_goal_en: "Keep the language goal and remove position-taking debate.",
    sample_gurmukhi:
      "ਇਹ ਵਿਸ਼ਾ ਸੰਵੇਦਨਸ਼ੀਲ ਹੈ, ਇਸ ਲਈ import ਵਿੱਚ ਸਿਰਫ਼ ਭਾਸ਼ਾਈ ਮਕਸਦ ਰੱਖੀਏ, ਰਾਏ ਦੀ ਚਰਚਾ ਨਹੀਂ।",
    sample_romanization:
      "ih visha sanvedansheel hai, is lai import vich sirf bhashai maqsad rakhie, rae di charcha nahin.",
    sample_vi:
      "Chủ đề này nhạy cảm, vì vậy khi import chỉ giữ mục tiêu ngôn ngữ, không đưa tranh luận quan điểm.",
    sample_en:
      "This topic is sensitive, so in the import keep only the language goal, not debate over opinions.",
    readiness_phrases: [
      {
        gurmukhi: "ਸੰਵੇਦਨਸ਼ੀਲ ਹੈ",
        romanization: "sanvedansheel hai",
        vi: "Là nhạy cảm.",
        en: "Is sensitive.",
      },
      {
        gurmukhi: "ਸਿਰਫ਼ ਭਾਸ਼ਾਈ ਮਕਸਦ",
        romanization: "sirf bhashai maqsad",
        vi: "Chỉ mục tiêu ngôn ngữ.",
        en: "Only the language goal.",
      },
    ],
    checks: [
      {
        check_vi: "Có giữ mục tiêu học thay vì tranh luận lập trường không?",
        check_en: "Does it keep the learning goal instead of debating positions?",
        signal_vi: "Có ਸਿਰਫ਼ ਭਾਸ਼ਾਈ ਮਕਸਦ và ਚਰਚਾ ਨਹੀਂ.",
        signal_en: "Uses only the language goal and no debate.",
      },
    ],
    learner_trap: {
      trap_vi: "Giải thích quan điểm xã hội trong bài học ngôn ngữ.",
      trap_en: "Explaining social positions inside a language lesson.",
      repair_vi: "Chỉ giữ cấu trúc ngôn ngữ và ranh giới an toàn.",
      repair_en: "Keep only the language structure and the safety boundary.",
    },
  },
  {
    id: "pa_c2_import_public_communication",
    focus: "public_communication_calibration",
    style: "import_readiness",
    title_vi: "Hiệu chỉnh thông báo trước import",
    title_en: "Calibrate a notice before import",
    scenario_vi: "Một mẫu thông báo công khai có vẻ hứa quá chắc khi thông tin chưa xác nhận.",
    scenario_en: "A public notice sample overpromises while information is not confirmed.",
    readiness_goal_vi: "Dùng trạng thái hiện tại, điều kiện xác nhận, và bước tiếp theo.",
    readiness_goal_en: "Use current status, confirmation condition, and next step.",
    sample_gurmukhi:
      "ਇਸ ਵੇਲੇ ਜਾਣਕਾਰੀ ਦੀ ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ। ਪੁਸ਼ਟੀ ਹੋਣ ਤੇ ਅਗਲਾ ਕਦਮ ਸਾਂਝਾ ਕੀਤਾ ਜਾਵੇਗਾ।",
    sample_romanization:
      "is vele jaankari di jaanch ho rahi hai. pushti hon te agla kadam sanjha kita jaavega.",
    sample_vi:
      "Hiện tại thông tin đang được kiểm tra. Khi được xác nhận, bước tiếp theo sẽ được chia sẻ.",
    sample_en:
      "The information is currently being checked. Once confirmed, the next step will be shared.",
    readiness_phrases: [
      {
        gurmukhi: "ਜਾਣਕਾਰੀ ਦੀ ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ",
        romanization: "jaankari di jaanch ho rahi hai",
        vi: "Thông tin đang được kiểm tra.",
        en: "The information is being checked.",
      },
      {
        gurmukhi: "ਪੁਸ਼ਟੀ ਹੋਣ ਤੇ",
        romanization: "pushti hon te",
        vi: "Khi được xác nhận.",
        en: "Once confirmed.",
      },
    ],
    checks: [
      {
        check_vi: "Có tránh hứa quá chắc trước khi xác nhận không?",
        check_en: "Does it avoid overpromising before confirmation?",
        signal_vi: "Có ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ và ਪੁਸ਼ਟੀ ਹੋਣ ਤੇ.",
        signal_en: "Uses being checked and once confirmed.",
      },
    ],
    learner_trap: {
      trap_vi: "Dùng tương lai chắc chắn khi chưa có dữ liệu.",
      trap_en: "Using a definite future when the data is not confirmed.",
      repair_vi: "Đặt điều kiện xác nhận trước bước tiếp theo.",
      repair_en: "Put the confirmation condition before the next step.",
    },
  },
  {
    id: "pa_c2_import_register_safety",
    focus: "register_safety",
    style: "readiness",
    title_vi: "An toàn register trước khi import",
    title_en: "Register safety before import",
    scenario_vi: "Một câu thân mật cần sửa để dùng được trong email chuyên nghiệp.",
    scenario_en: "A casual sentence needs to be adjusted for a professional email.",
    readiness_goal_vi: "Giữ rõ ý, thêm lịch sự vừa đủ, và tránh quá trang trọng.",
    readiness_goal_en: "Keep the meaning clear, add enough politeness, and avoid over-formality.",
    sample_gurmukhi:
      "ਕਿਰਪਾ ਕਰਕੇ ਜਦੋਂ ਸੁਵਿਧਾ ਹੋਵੇ, ਇਹ ਜਾਣਕਾਰੀ ਸਾਂਝੀ ਕਰ ਦਿਓ। ਤੁਹਾਡੇ ਸਮੇਂ ਲਈ ਧੰਨਵਾਦ।",
    sample_romanization:
      "kirpa karke jadon suvidha hove, ih jaankari sanjhi kar deo. tuhade same lai dhanvaad.",
    sample_vi:
      "Khi thuận tiện, xin vui lòng chia sẻ thông tin này. Cảm ơn thời gian của anh/chị.",
    sample_en:
      "When convenient, please share this information. Thank you for your time.",
    readiness_phrases: [
      {
        gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ",
        romanization: "kirpa karke",
        vi: "Xin vui lòng.",
        en: "Please.",
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
        check_vi: "Có lịch sự vừa đủ cho bối cảnh chuyên nghiệp không?",
        check_en: "Is it polite enough for a professional context?",
        signal_vi: "Có ਕਿਰਪਾ ਕਰਕੇ và ਧੰਨਵਾਦ.",
        signal_en: "Includes please and thanks.",
      },
    ],
    learner_trap: {
      trap_vi: "Dùng giọng nhắn tin thân mật trong email công việc.",
      trap_en: "Using casual text-message tone in a work email.",
      repair_vi: "Thêm please, cảm ơn, và yêu cầu cụ thể.",
      repair_en: "Add please, thanks, and a concrete request.",
    },
    canada_practical: true,
  },
];

export const c2ImportReadinessSamplesByFocus = (
  focus: PunjabiC2ImportReadinessFocus,
): PunjabiC2ImportReadinessSample[] => c2ImportReadinessSamples.filter((item) => item.focus === focus);
