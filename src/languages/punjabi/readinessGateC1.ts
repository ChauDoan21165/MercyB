// Punjabi C1 readiness gate for Vietnamese-speaking and English-speaking learners.
//
// Gurmukhi is primary. Romanization is a learner aid, not a pronunciation
// standard. Shahmukhi is mentioned only for script awareness, not taught as a
// separate course here. Native review is deferred.
//
// Text data only: no audio, pronunciation scoring, Azure, auth, billing, RLS,
// Supabase, CI config, or unrelated integrations.

export type PunjabiC1ReadinessArea =
  | "formal_writing"
  | "source_summary"
  | "cautious_argument"
  | "presentation_language"
  | "academic_register"
  | "public_service_text"
  | "professional_text";

export type PunjabiC1ReadinessRoute = "ready_c1" | "review_targeted" | "repeat_foundation";

export type PunjabiReadinessPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiReadinessGateItem = {
  id: string;
  level: "C1";
  area: PunjabiC1ReadinessArea;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  readiness_goal_vi: string;
  readiness_goal_en: string;
  checkpoint_prompt: PunjabiReadinessPhrase;
  passing_response_features_vi: readonly string[];
  passing_response_features_en: readonly string[];
  routing: {
    ready_c1_vi: string;
    ready_c1_en: string;
    review_targeted_vi: string;
    review_targeted_en: string;
    repeat_foundation_vi: string;
    repeat_foundation_en: string;
  };
  sample_ready_response: PunjabiReadinessPhrase;
  canada_example: PunjabiReadinessPhrase & {
    context_vi: string;
    context_en: string;
  };
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const readinessGateScriptAwareness = {
  vi: "Khóa này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết truyền thống chữ viết Punjabi khác, không phải một khóa học đầy đủ.",
  en: "This course uses Gurmukhi as the primary script. Shahmukhi is mentioned only for awareness of another Punjabi writing tradition, not as a full course.",
} as const;

export const readinessGateC1: PunjabiReadinessGateItem[] = [
  {
    id: "pa_c1_gate_formal_writing_request",
    level: "C1",
    area: "formal_writing",
    title_pa: "ਰਸਮੀ ਲਿਖਤ ਦੀ ਤਿਆਰੀ",
    title_rom: "rasmi likhat di tiari",
    title_vi: "Sẵn sàng viết trang trọng",
    title_en: "Formal writing readiness",
    readiness_goal_vi: "Kiểm tra khả năng viết email/thư có mục đích rõ, bằng chứng, và yêu cầu cụ thể.",
    readiness_goal_en: "Check ability to write an email or letter with clear purpose, evidence, and specific request.",
    checkpoint_prompt: {
      pa: "ਤੁਹਾਨੂੰ ਸੇਵਾ ਵਿੱਚ ਦੇਰੀ ਬਾਰੇ ਰਸਮੀ ਈਮੇਲ ਲਿਖਣੀ ਹੈ।",
      rom: "tuhanu seva vich deri bare rasmi email likhni hai.",
      vi: "Bạn cần viết email trang trọng về việc dịch vụ bị chậm.",
      en: "You need to write a formal email about a delayed service.",
    },
    passing_response_features_vi: [
      "Có lời chào và mục đích rõ.",
      "Nêu vấn đề, evidence, tác động, và requested action.",
      "Giọng lịch sự nhưng chắc chắn.",
    ],
    passing_response_features_en: [
      "Has greeting and clear purpose.",
      "States problem, evidence, impact, and requested action.",
      "Uses a polite but firm tone.",
    ],
    routing: {
      ready_c1_vi: "Sẵn sàng nếu email có cấu trúc và request cụ thể.",
      ready_c1_en: "Ready if the email is structured and has a specific request.",
      review_targeted_vi: "Ôn formal frames nếu có nội dung nhưng giọng quá trực tiếp.",
      review_targeted_en: "Review formal frames if content is present but tone is too direct.",
      repeat_foundation_vi: "Ôn lại A2-B1 nếu câu cơ bản và thứ tự ý chưa rõ.",
      repeat_foundation_en: "Repeat A2-B1 if basic sentences and idea order are unclear.",
    },
    sample_ready_response: {
      pa: "ਮੈਂ ਇਸ ਦੇਰੀ ਬਾਰੇ ਆਪਣੀ ਚਿੰਤਾ ਦਰਜ ਕਰਵਾਉਣਾ ਚਾਹੁੰਦੀ ਹਾਂ ਅਤੇ ਬੇਨਤੀ ਕਰਦੀ ਹਾਂ ਕਿ ਮਾਮਲੇ ਦੀ ਸਮੀਖਿਆ ਕਰਕੇ ਨਵੀਂ ਮਿਤੀ ਦੱਸੀ ਜਾਵੇ।",
      rom: "main is deri bare apni chinta darj karvauna chahundi han ate benati kardi han ki mamle di samikhia karke navi miti dassi jave.",
      vi: "Tôi muốn ghi nhận quan ngại về sự chậm trễ này và đề nghị xem xét vấn đề rồi thông báo ngày mới.",
      en: "I would like to register my concern about this delay and request that the matter be reviewed with a new date provided.",
    },
    canada_example: {
      context_vi: "Email về dịch vụ hành chính tại Canada.",
      context_en: "Email about an administrative service in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਮੇਰੀ ਅਰਜ਼ੀ ਦੀ ਪ੍ਰਕਿਰਿਆ ਤਿੰਨ ਹਫ਼ਤਿਆਂ ਤੋਂ ਲੰਬਿਤ ਹੈ, ਇਸ ਲਈ ਮੈਂ ਸਥਿਤੀ ਬਾਰੇ ਸਪਸ਼ਟੀਕਰਨ ਦੀ ਬੇਨਤੀ ਕਰਦੀ ਹਾਂ।",
      rom: "Canada vich meri arzi di prakiria tinn haftian ton lambit hai, is lai main sthiti bare spashtikaran di benati kardi han.",
      vi: "Tại Canada, hồ sơ của tôi đã chờ xử lý ba tuần, vì vậy tôi xin được làm rõ tình trạng.",
      en: "In Canada, my application process has been pending for three weeks, so I request clarification about the status.",
    },
    learner_traps_vi: [
      "Đừng viết như tin nhắn thân mật.",
      "Không chỉ phàn nàn; cần action cụ thể.",
    ],
    learner_traps_en: [
      "Do not write like an informal message.",
      "Do not only complain; include a specific action.",
    ],
  },
  {
    id: "pa_c1_gate_source_summary_neutral",
    level: "C1",
    area: "source_summary",
    title_pa: "ਸਰੋਤ ਦਾ ਨਿਰਪੱਖ ਸਾਰ",
    title_rom: "sarot da nirpakh saar",
    title_vi: "Sẵn sàng tóm tắt nguồn trung lập",
    title_en: "Neutral source-summary readiness",
    readiness_goal_vi: "Kiểm tra khả năng tóm tắt claim, evidence, và implication mà không thêm opinion.",
    readiness_goal_en: "Check ability to summarize claim, evidence, and implication without adding opinion.",
    checkpoint_prompt: {
      pa: "ਛੋਟੇ ਸਰੋਤ ਨੂੰ ਪੜ੍ਹ ਕੇ ਤਿੰਨ ਵਾਕਾਂ ਦਾ ਨਿਰਪੱਖ ਸਾਰ ਲਿਖੋ।",
      rom: "chhote sarot nu parh ke tinn vakan da nirpakh saar likho.",
      vi: "Đọc nguồn ngắn và viết summary trung lập ba câu.",
      en: "Read a short source and write a neutral three-sentence summary.",
    },
    passing_response_features_vi: [
      "Claim chính đứng trước chi tiết.",
      "Evidence được nêu ngắn gọn.",
      "Không thêm đánh giá cá nhân.",
    ],
    passing_response_features_en: [
      "Main claim comes before details.",
      "Evidence is stated briefly.",
      "No personal evaluation is added.",
    ],
    routing: {
      ready_c1_vi: "Sẵn sàng nếu summary trung lập và nén thông tin tốt.",
      ready_c1_en: "Ready if the summary is neutral and well compressed.",
      review_targeted_vi: "Ôn source-summary nếu summary lẫn opinion.",
      review_targeted_en: "Review source-summary if the summary mixes in opinion.",
      repeat_foundation_vi: "Ôn đọc hiểu nếu claim chính bị hiểu sai.",
      repeat_foundation_en: "Repeat reading basics if the main claim is misunderstood.",
    },
    sample_ready_response: {
      pa: "ਸਰੋਤ ਦਾ ਮੁੱਖ ਦਾਅਵਾ ਇਹ ਹੈ ਕਿ ਲਚਕਦਾਰ ਸਮਾਂ ਸਿੱਖਣ ਵਿੱਚ ਭਾਗੀਦਾਰੀ ਵਧਾ ਸਕਦਾ ਹੈ। ਲੇਖਕ ਇਸ ਨੂੰ ਵਿਦਿਆਰਥੀ ਸਰਵੇਖਣ ਨਾਲ ਸਮਰਥਨ ਦਿੰਦਾ ਹੈ। ਸੰਖੇਪ ਵਿੱਚ, ਸਰੋਤ ਇੱਕ ਸਾਵਧਾਨ ਪਰ ਸਕਾਰਾਤਮਕ ਸੰਬੰਧ ਸੁਝਾਉਂਦਾ ਹੈ।",
      rom: "sarot da mukh daava ih hai ki lachkdaar sama sikhan vich bhagidari vadha sakda hai. lekhak is nu vidyarthi sarvekhan nal samarthan dinda hai. sankhep vich, sarot ikk savdhan par sakaratmak sambandh sujhaounda hai.",
      vi: "Luận điểm chính của nguồn là thời gian linh hoạt có thể tăng sự tham gia học tập. Tác giả hỗ trợ bằng khảo sát sinh viên. Tóm lại, nguồn gợi ý một quan hệ thận trọng nhưng tích cực.",
      en: "The source's main claim is that flexible timing may increase learning participation. The writer supports this with a student survey. In summary, the source suggests a cautious but positive relationship.",
    },
    canada_example: {
      context_vi: "Tóm tắt nguồn về dịch vụ sinh viên tại Canada.",
      context_en: "Summarizing a source about student services in Canada.",
      pa: "ਸਰੋਤ ਸੁਝਾਉਂਦਾ ਹੈ ਕਿ ਕੈਨੇਡਾ ਵਿੱਚ ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਕੇਂਦਰ ਖੋਜ-ਲੇਖ ਦੀ ਯੋਜਨਾ ਬਣਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦੇ ਹਨ।",
      rom: "sarot sujhaounda hai ki Canada vich vidyarthi sahaita kendar khoj-lekh di yojna banaun vich madad kar sakde han.",
      vi: "Nguồn gợi ý rằng tại Canada, trung tâm hỗ trợ sinh viên có thể giúp lập kế hoạch bài nghiên cứu.",
      en: "The source suggests that in Canada, student support centres may help with research-paper planning.",
    },
    learner_traps_vi: [
      "Đừng dịch từng câu nếu mất cấu trúc summary.",
      "Không thêm 'tôi nghĩ' vào summary trung lập.",
    ],
    learner_traps_en: [
      "Do not translate sentence by sentence if summary structure is lost.",
      "Do not add 'I think' to a neutral summary.",
    ],
  },
  {
    id: "pa_c1_gate_cautious_argument_policy",
    level: "C1",
    area: "cautious_argument",
    title_pa: "ਸਾਵਧਾਨ ਦਲੀਲ ਦੀ ਤਿਆਰੀ",
    title_rom: "savdhan daleel di tiari",
    title_vi: "Sẵn sàng lập luận thận trọng",
    title_en: "Cautious argument readiness",
    readiness_goal_vi: "Kiểm tra khả năng dùng thesis, evidence, limitation, và hedge hợp lý.",
    readiness_goal_en: "Check ability to use thesis, evidence, limitation, and appropriate hedging.",
    checkpoint_prompt: {
      pa: "ਕਿਸੇ ਜਨਤਕ ਨੀਤੀ ਬਾਰੇ ਸਾਵਧਾਨ ਦਲੀਲ ਲਿਖੋ।",
      rom: "kise jantak niti bare savdhan daleel likho.",
      vi: "Viết lập luận thận trọng về một chính sách công.",
      en: "Write a cautious argument about a public policy.",
    },
    passing_response_features_vi: [
      "Thesis rõ nhưng không tuyệt đối.",
      "Evidence được giải thích.",
      "Có limitation hoặc counterargument.",
    ],
    passing_response_features_en: [
      "Clear but not absolute thesis.",
      "Evidence is explained.",
      "Includes limitation or counterargument.",
    ],
    routing: {
      ready_c1_vi: "Sẵn sàng nếu claim chính xác và có hedge phù hợp.",
      ready_c1_en: "Ready if the claim is precise and appropriately hedged.",
      review_targeted_vi: "Ôn cautious claims nếu dùng always/never quá nhiều.",
      review_targeted_en: "Review cautious claims if always/never is overused.",
      repeat_foundation_vi: "Ôn tổ chức đoạn nếu thesis và evidence không liên quan.",
      repeat_foundation_en: "Repeat paragraph organization if thesis and evidence are not connected.",
    },
    sample_ready_response: {
      pa: "ਉਪਲਬਧ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਤੇ, ਇਹ ਨੀਤੀ ਕੁਝ ਪਰਿਵਾਰਾਂ ਲਈ ਪਹੁੰਚ ਸੁਧਾਰ ਸਕਦੀ ਹੈ, ਪਰ ਇਸ ਦਾ ਪ੍ਰਭਾਵ ਇਲਾਕੇ ਅਤੇ ਸੇਵਾ ਦੀ ਗੁਣਵੱਤਾ ਤੇ ਨਿਰਭਰ ਕਰੇਗਾ।",
      rom: "uplabdh jankari de adhar te, ih niti kujh parivaran lai pahunch sudhar sakdi hai, par is da prabhav ilake ate seva di gunvatta te nirbhar karega.",
      vi: "Dựa trên thông tin hiện có, chính sách này có thể cải thiện khả năng tiếp cận cho một số gia đình, nhưng tác động sẽ phụ thuộc vào khu vực và chất lượng dịch vụ.",
      en: "Based on the available information, this policy may improve access for some families, but its impact will depend on area and service quality.",
    },
    canada_example: {
      context_vi: "Lập luận về dịch vụ trực tuyến tại Canada.",
      context_en: "Argument about online services in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਆਨਲਾਈਨ ਸੇਵਾਵਾਂ ਕੁਝ ਵਸਨੀਕਾਂ ਲਈ ਪਹੁੰਚ ਵਧਾ ਸਕਦੀਆਂ ਹਨ, ਪਰ ਪਿੰਡਾਂ ਵਿੱਚ ਇੰਟਰਨੈੱਟ ਪਹੁੰਚ ਇੱਕ ਮਹੱਤਵਪੂਰਨ ਸੀਮਾ ਰਹਿੰਦੀ ਹੈ।",
      rom: "Canada vich online sevavan kujh vasnikan lai pahunch vadha sakdian han, par pindan vich internet pahunch ikk mahatvapuran sima rahindi hai.",
      vi: "Tại Canada, dịch vụ trực tuyến có thể tăng khả năng tiếp cận cho một số cư dân, nhưng internet ở vùng nông thôn vẫn là một giới hạn quan trọng.",
      en: "In Canada, online services may increase access for some residents, but rural internet access remains an important limitation.",
    },
    learner_traps_vi: [
      "Đừng viết claim tuyệt đối khi evidence chỉ là gợi ý.",
      "Limitation không làm bài yếu nếu bạn điều chỉnh claim đúng.",
    ],
    learner_traps_en: [
      "Do not write an absolute claim when the evidence only suggests.",
      "A limitation does not weaken the text if the claim is adjusted accurately.",
    ],
  },
  {
    id: "pa_c1_gate_presentation_response",
    level: "C1",
    area: "presentation_language",
    title_pa: "ਪ੍ਰਸਤੁਤੀ ਭਾਸ਼ਾ ਦੀ ਤਿਆਰੀ",
    title_rom: "prastuti bhasha di tiari",
    title_vi: "Sẵn sàng ngôn ngữ thuyết trình",
    title_en: "Presentation-language readiness",
    readiness_goal_vi: "Kiểm tra khả năng giới thiệu point, chuyển ý, và trả lời câu hỏi khó.",
    readiness_goal_en: "Check ability to introduce points, transition, and answer difficult questions.",
    checkpoint_prompt: {
      pa: "ਦੋ ਮਿੰਟ ਦੀ ਪ੍ਰਸਤੁਤੀ ਦੇ ਅੰਤ ਤੇ ਇੱਕ ਔਖੇ ਸਵਾਲ ਦਾ ਜਵਾਬ ਦਿਓ।",
      rom: "do mint di prastuti de ant te ikk aukhe saval da jawab dio.",
      vi: "Trả lời một câu hỏi khó ở cuối bài thuyết trình hai phút.",
      en: "Answer a difficult question at the end of a two-minute presentation.",
    },
    passing_response_features_vi: [
      "Thừa nhận câu hỏi.",
      "Nếu thiếu số liệu, nói limitation rõ.",
      "Đưa bước tiếp theo hoặc câu trả lời có nguyên tắc.",
    ],
    passing_response_features_en: [
      "Acknowledges the question.",
      "If data is missing, states the limitation clearly.",
      "Gives a next step or principled answer.",
    ],
    routing: {
      ready_c1_vi: "Sẵn sàng nếu câu trả lời bình tĩnh và có cấu trúc.",
      ready_c1_en: "Ready if the answer is calm and structured.",
      review_targeted_vi: "Ôn presentation frames nếu câu trả lời lan man.",
      review_targeted_en: "Review presentation frames if the answer wanders.",
      repeat_foundation_vi: "Ôn fluency cơ bản nếu không thể tạo câu nối.",
      repeat_foundation_en: "Repeat basic fluency if transitions cannot be formed.",
    },
    sample_ready_response: {
      pa: "ਇਹ ਬਹੁਤ ਮਹੱਤਵਪੂਰਨ ਸਵਾਲ ਹੈ। ਇਸ ਵੇਲੇ ਪੂਰੇ ਖਰਚੇ ਬਾਰੇ ਅੰਕੜੇ ਸੀਮਿਤ ਹਨ, ਇਸ ਲਈ ਅਗਲਾ ਕਦਮ ਪਾਇਲਟ ਪ੍ਰੋਗਰਾਮ ਦੀ ਵਿਸਥਾਰ ਨਾਲ ਸਮੀਖਿਆ ਹੋਵੇਗੀ।",
      rom: "ih bahut mahatvapuran saval hai. is vele pure kharche bare ankde simit han, is lai agla kadam pilot program di visthar nal samikhia hovegi.",
      vi: "Đây là câu hỏi rất quan trọng. Hiện số liệu về toàn bộ chi phí còn hạn chế, vì vậy bước tiếp theo sẽ là xem xét chi tiết chương trình thí điểm.",
      en: "This is a very important question. At this stage, data about the full cost is limited, so the next step will be a detailed review of the pilot program.",
    },
    canada_example: {
      context_vi: "Trả lời sau presentation về dự án cộng đồng tại Canada.",
      context_en: "Post-presentation answer about a community project in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਇਸ ਪ੍ਰਸਤਾਵ ਲਈ ਪੂਰਾ ਖਰਚਾ ਅਜੇ ਸਪਸ਼ਟ ਨਹੀਂ, ਪਰ ਪਹਿਲਾ ਕਦਮ ਸਥਾਨਕ ਪਾਇਲਟ ਪ੍ਰੋਗਰਾਮ ਦੀ ਸਮੀਖਿਆ ਹੋਵੇਗੀ।",
      rom: "Canada vich is prastav lai pura kharcha aje sapashat nahi, par pahila kadam sthanak pilot program di samikhia hovegi.",
      vi: "Tại Canada, toàn bộ chi phí cho đề xuất này chưa rõ, nhưng bước đầu sẽ là xem xét chương trình thí điểm địa phương.",
      en: "In Canada, the full cost of this proposal is not yet clear, but the first step will be a review of a local pilot program.",
    },
    learner_traps_vi: [
      "Đừng lặp lại slide thay vì trả lời câu hỏi.",
      "Không giả vờ biết số liệu nếu prompt không cung cấp.",
    ],
    learner_traps_en: [
      "Do not repeat the slide instead of answering the question.",
      "Do not pretend to know figures the prompt does not provide.",
    ],
  },
  {
    id: "pa_c1_gate_academic_register",
    level: "C1",
    area: "academic_register",
    title_pa: "ਅਕਾਦਮਿਕ ਲਹਿਜ਼ੇ ਦੀ ਤਿਆਰੀ",
    title_rom: "academic lehje di tiari",
    title_vi: "Sẵn sàng register học thuật",
    title_en: "Academic register readiness",
    readiness_goal_vi: "Kiểm tra khả năng dùng giọng trung lập, logical connectors, và thuật ngữ vừa đủ.",
    readiness_goal_en: "Check ability to use neutral tone, logical connectors, and suitable terminology.",
    checkpoint_prompt: {
      pa: "ਇੱਕ ਅਕਾਦਮਿਕ ਪੈਰਾ ਲਿਖੋ ਜੋ ਦੋ ਸਰੋਤਾਂ ਨੂੰ ਜੋੜਦਾ ਹੈ।",
      rom: "ikk academic para likho jo do sarotan nu jorda hai.",
      vi: "Viết một đoạn học thuật nối hai nguồn.",
      en: "Write an academic paragraph that connects two sources.",
    },
    passing_response_features_vi: [
      "Giọng không cảm tính.",
      "Có connectors như however/therefore equivalents.",
      "So sánh evidence thay vì chỉ nêu topic.",
    ],
    passing_response_features_en: [
      "Tone is not emotional.",
      "Uses connectors equivalent to however/therefore.",
      "Compares evidence rather than only topic.",
    ],
    routing: {
      ready_c1_vi: "Sẵn sàng nếu đoạn có synthesis và register ổn định.",
      ready_c1_en: "Ready if the paragraph has synthesis and stable register.",
      review_targeted_vi: "Ôn academic transitions nếu đoạn thiếu liên kết logic.",
      review_targeted_en: "Review academic transitions if logical links are missing.",
      repeat_foundation_vi: "Ôn cấu trúc câu nếu câu dài gây mơ hồ.",
      repeat_foundation_en: "Repeat sentence structure if long sentences become unclear.",
    },
    sample_ready_response: {
      pa: "ਦੋਵੇਂ ਸਰੋਤ ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਨੂੰ ਮਹੱਤਵਪੂਰਨ ਮੰਨਦੇ ਹਨ, ਪਰ ਪਹਿਲਾ ਸਰੋਤ ਲਿਖਣ ਕੇਂਦਰ ਤੇ ਜ਼ੋਰ ਦਿੰਦਾ ਹੈ, ਜਦਕਿ ਦੂਜਾ ਮਾਰਗਦਰਸ਼ਨ ਸੇਵਾਵਾਂ ਨੂੰ ਕੇਂਦਰੀ ਮੰਨਦਾ ਹੈ।",
      rom: "dovein sarot vidyarthi sahaita nu mahatvapuran mannde han, par pahila sarot likhan kendar te zor dinda hai, jadki duja margdarshan sevavan nu kendari mannda hai.",
      vi: "Cả hai nguồn đều xem hỗ trợ sinh viên là quan trọng, nhưng nguồn thứ nhất nhấn mạnh trung tâm viết, trong khi nguồn thứ hai xem dịch vụ cố vấn là trung tâm.",
      en: "Both sources treat student support as important, but the first emphasizes writing centres, whereas the second treats advising services as central.",
    },
    canada_example: {
      context_vi: "Synthesis học thuật về hỗ trợ sinh viên tại Canada.",
      context_en: "Academic synthesis about student support in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਬਾਰੇ ਦੋਵੇਂ ਸਰੋਤ ਚਿੰਤਤ ਹਨ, ਪਰ ਉਹ ਵੱਖ-ਵੱਖ ਸੇਵਾਵਾਂ ਨੂੰ ਮੁੱਖ ਮੰਨਦੇ ਹਨ।",
      rom: "Canada vich vidyarthi sahaita bare dovein sarot chintat han, par oh vakh-vakh sevavan nu mukh mannde han.",
      vi: "Tại Canada, cả hai nguồn đều quan tâm đến hỗ trợ sinh viên, nhưng chúng xem các dịch vụ khác nhau là chính.",
      en: "In Canada, both sources are concerned with student support, but they treat different services as central.",
    },
    learner_traps_vi: [
      "Đừng dùng register quá thân mật trong bài học thuật.",
      "Không chỉ đặt hai summary cạnh nhau; cần synthesis.",
    ],
    learner_traps_en: [
      "Do not use overly casual register in academic writing.",
      "Do not simply place two summaries side by side; synthesis is needed.",
    ],
  },
  {
    id: "pa_c1_gate_public_service_notice",
    level: "C1",
    area: "public_service_text",
    title_pa: "ਜਨਤਕ ਸੇਵਾ ਪਾਠ ਦੀ ਤਿਆਰੀ",
    title_rom: "jantak seva path di tiari",
    title_vi: "Sẵn sàng xử lý văn bản dịch vụ công",
    title_en: "Public-service text readiness",
    readiness_goal_vi: "Kiểm tra khả năng đọc notice, tóm tắt ý chính, và hỏi clarification lịch sự.",
    readiness_goal_en: "Check ability to read a notice, summarize the main point, and ask polite clarification.",
    checkpoint_prompt: {
      pa: "ਨੋਟਿਸ ਪੜ੍ਹ ਕੇ ਸਪਸ਼ਟੀਕਰਨ ਲਈ ਰਸਮੀ ਜਵਾਬ ਲਿਖੋ।",
      rom: "notice parh ke spashtikaran lai rasmi jawab likho.",
      vi: "Đọc thông báo và viết phản hồi trang trọng để xin làm rõ.",
      en: "Read the notice and write a formal response asking for clarification.",
    },
    passing_response_features_vi: [
      "Hiểu đúng nội dung notice.",
      "Nêu câu hỏi cụ thể.",
      "Không claim quyền lợi ngoài prompt.",
    ],
    passing_response_features_en: [
      "Understands the notice accurately.",
      "Asks a specific question.",
      "Does not claim rights outside the prompt.",
    ],
    routing: {
      ready_c1_vi: "Sẵn sàng nếu phản hồi chính xác, lịch sự, và thực tế.",
      ready_c1_en: "Ready if the response is accurate, polite, and practical.",
      review_targeted_vi: "Ôn public-service frames nếu request chưa rõ.",
      review_targeted_en: "Review public-service frames if the request is unclear.",
      repeat_foundation_vi: "Ôn đọc notice nếu hiểu sai ngày hoặc điều kiện.",
      repeat_foundation_en: "Repeat notice reading if dates or conditions are misunderstood.",
    },
    sample_ready_response: {
      pa: "ਨੋਟਿਸ ਦੇ ਅਨੁਸਾਰ, ਅਗਲੇ ਮਹੀਨੇ ਤੋਂ ਨਵੀਂ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪ੍ਰਕਿਰਿਆ ਲਾਗੂ ਹੋਵੇਗੀ। ਕਿਰਪਾ ਕਰਕੇ ਸਪਸ਼ਟ ਕਰੋ ਕਿ ਪੁਰਾਣੇ ਭਾਗੀਦਾਰਾਂ ਨੂੰ ਮੁੜ ਅਰਜ਼ੀ ਦੇਣੀ ਪਵੇਗੀ ਜਾਂ ਨਹੀਂ।",
      rom: "notice de anusaar, agle mahine ton navi registration prakiria lagu hovegi. kirpa karke sapashat karo ki purane bhagidaran nu mur arzi deni pavegi ja nahi.",
      vi: "Theo thông báo, từ tháng tới quy trình đăng ký mới sẽ áp dụng. Xin vui lòng làm rõ liệu người tham gia cũ có phải nộp đơn lại hay không.",
      en: "According to the notice, a new registration process will apply from next month. Please clarify whether previous participants must apply again.",
    },
    canada_example: {
      context_vi: "Phản hồi thông báo trung tâm cộng đồng tại Canada.",
      context_en: "Responding to a community-centre notice in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਕਮਿਊਨਿਟੀ ਕੇਂਦਰ ਦੀਆਂ ਕਲਾਸਾਂ ਲਈ ਨਵੀਂ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪ੍ਰਕਿਰਿਆ ਬਾਰੇ ਕਿਰਪਾ ਕਰਕੇ ਹੋਰ ਜਾਣਕਾਰੀ ਦਿਓ।",
      rom: "Canada vich community kendar dian classan lai navi registration prakiria bare kirpa karke hor jankari dio.",
      vi: "Xin vui lòng cung cấp thêm thông tin về quy trình đăng ký mới cho các lớp tại trung tâm cộng đồng ở Canada.",
      en: "Please provide more information about the new registration process for community-centre classes in Canada.",
    },
    learner_traps_vi: [
      "Đừng bỏ qua nội dung chính của notice trước khi hỏi.",
      "Không chuyển thành complaint nếu mục tiêu là clarification.",
    ],
    learner_traps_en: [
      "Do not skip the main content of the notice before asking.",
      "Do not turn it into a complaint if the goal is clarification.",
    ],
  },
  {
    id: "pa_c1_gate_professional_text_memo",
    level: "C1",
    area: "professional_text",
    title_pa: "ਪੇਸ਼ਾਵਰ ਪਾਠ ਦੀ ਤਿਆਰੀ",
    title_rom: "peshavar path di tiari",
    title_vi: "Sẵn sàng xử lý văn bản chuyên nghiệp",
    title_en: "Professional text readiness",
    readiness_goal_vi: "Kiểm tra khả năng viết memo/update ngắn có summary, risk, recommendation.",
    readiness_goal_en: "Check ability to write a short memo or update with summary, risk, and recommendation.",
    checkpoint_prompt: {
      pa: "ਟੀਮ ਨੂੰ ਇੱਕ ਛੋਟਾ ਪੇਸ਼ਾਵਰ ਅਪਡੇਟ ਲਿਖੋ।",
      rom: "team nu ikk chhota peshavar update likho.",
      vi: "Viết một update chuyên nghiệp ngắn cho nhóm.",
      en: "Write a short professional update to the team.",
    },
    passing_response_features_vi: [
      "Mở đầu nêu tình trạng hiện tại.",
      "Nêu risk hoặc limitation.",
      "Kết thúc bằng recommendation hoặc next step.",
    ],
    passing_response_features_en: [
      "Opening states current status.",
      "States risk or limitation.",
      "Ends with recommendation or next step.",
    ],
    routing: {
      ready_c1_vi: "Sẵn sàng nếu update ngắn, rõ, và có next step.",
      ready_c1_en: "Ready if the update is concise, clear, and has a next step.",
      review_targeted_vi: "Ôn professional tone nếu câu quá vòng vo hoặc quá thân mật.",
      review_targeted_en: "Review professional tone if sentences are too indirect or too casual.",
      repeat_foundation_vi: "Ôn cấu trúc đoạn nếu người đọc không thấy action.",
      repeat_foundation_en: "Repeat paragraph structure if the reader cannot identify the action.",
    },
    sample_ready_response: {
      pa: "ਮੌਜੂਦਾ ਸਥਿਤੀ ਇਹ ਹੈ ਕਿ ਰਿਪੋਰਟ ਦਾ ਪਹਿਲਾ ਮਸੌਦਾ ਤਿਆਰ ਹੈ, ਪਰ ਅੰਕੜਿਆਂ ਦੀ ਜਾਂਚ ਬਾਕੀ ਹੈ। ਮੇਰੀ ਸਿਫ਼ਾਰਸ਼ ਹੈ ਕਿ ਅਸੀਂ ਭੇਜਣ ਤੋਂ ਪਹਿਲਾਂ ਇੱਕ ਹੋਰ ਸਮੀਖਿਆ ਕਰੀਏ।",
      rom: "maujuda sthiti ih hai ki report da pahila masoda tiar hai, par ankrian di janch baki hai. meri sifarash hai ki asin bhejan ton pahilan ikk hor samikhia kariye.",
      vi: "Tình trạng hiện tại là bản nháp đầu của báo cáo đã sẵn sàng, nhưng việc kiểm tra số liệu vẫn còn. Khuyến nghị của tôi là chúng ta xem xét thêm một lần trước khi gửi.",
      en: "The current status is that the first report draft is ready, but data checking remains. My recommendation is that we do one more review before sending it.",
    },
    canada_example: {
      context_vi: "Update chuyên nghiệp trong nhóm dự án tại Canada.",
      context_en: "Professional update in a project team in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸਾਡੇ ਪ੍ਰੋਜੈਕਟ ਲਈ ਪਹਿਲਾ ਮਸੌਦਾ ਤਿਆਰ ਹੈ, ਪਰ ਜਨਤਕ ਸੇਵਾ ਸੰਬੰਧੀ ਅੰਕੜਿਆਂ ਦੀ ਜਾਂਚ ਹਾਲੇ ਬਾਕੀ ਹੈ।",
      rom: "Canada vich sade project lai pahila masoda tiar hai, par jantak seva sambandhi ankrian di janch hale baki hai.",
      vi: "Tại Canada, bản nháp đầu cho dự án của chúng ta đã sẵn sàng, nhưng việc kiểm tra số liệu về dịch vụ công vẫn còn.",
      en: "In Canada, the first draft for our project is ready, but checking the public-service data still remains.",
    },
    learner_traps_vi: [
      "Đừng viết memo như bài essay dài.",
      "Recommendation phải là hành động, không chỉ cảm giác chung.",
    ],
    learner_traps_en: [
      "Do not write a memo like a long essay.",
      "The recommendation should be an action, not only a general feeling.",
    ],
  },
];
