// Punjabi A1 integration dry run set for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization supports recall. Native review is deferred.

export type PunjabiA1IntegrationDryRunDomain =
  | "greetings"
  | "identity"
  | "family"
  | "numbers"
  | "food"
  | "directions"
  | "help"
  | "politeness"
  | "retention"
  | "checkpoints"
  | "service_counter_basics"
  | "gurmukhi_recognition";

export type PunjabiA1IntegrationDryRunStyle =
  | "dry_run"
  | "pre_integration"
  | "final_readiness"
  | "selector"
  | "quality_gate";

export type PunjabiA1IntegrationDryRunItem = {
  id: string;
  domain: PunjabiA1IntegrationDryRunDomain;
  style: PunjabiA1IntegrationDryRunStyle;
  prompt_vi: string;
  prompt_en: string;
  cue_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  selector_pa: string;
  selector_hint_vi: string;
  selector_hint_en: string;
  why_dry_run_vi: string;
  why_dry_run_en: string;
  trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: boolean;
  review_links: string[];
};

export const integrationDryRunScriptAwareness =
  "Gurmukhi is the primary script for this Punjabi A1 integration dry run set. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1IntegrationDryRunSet: PunjabiA1IntegrationDryRunItem[] = [
  {
    id: "pa_a1_dryrun_greeting_001",
    domain: "greetings",
    style: "dry_run",
    prompt_vi: "Chọn câu chào mở đầu an toàn nhất.",
    prompt_en: "Select the safest opening greeting.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    romanization: "sat sri akal",
    meaning_vi: "Xin chào.",
    meaning_en: "Hello.",
    selector_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
    selector_hint_vi: "Bắt đầu bằng chào hỏi trước.",
    selector_hint_en: "Start with a greeting first.",
    why_dry_run_vi: "Đây là điểm xuất phát ổn định cho mọi tích hợp A1.",
    why_dry_run_en: "This is a stable starting point for every A1 integration.",
    trap: { audience: "vi", vi: "Đừng đổi sang câu khác giữa chừng.", en: "Do not switch to another greeting midstream." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_greeting_001", "pa_a1_selector_lesson_001"],
  },
  {
    id: "pa_a1_dryrun_identity_001",
    domain: "identity",
    style: "pre_integration",
    prompt_vi: "Chọn câu tên tôi là ... và hỏi lại tên.",
    prompt_en: "Select the 'my name is ...' line and ask back the name question.",
    cue_pa: "ਮੇਰਾ ਨਾਮ ਆਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    romanization: "mera nam An hai. tuhada nam ki hai?",
    meaning_vi: "Tên tôi là An. Tên bạn là gì?",
    meaning_en: "My name is An. What is your name?",
    selector_pa: "ਮੇਰਾ ਨਾਮ ... / ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ",
    selector_hint_vi: "Giữ khung ngắn, rõ, lặp lại được.",
    selector_hint_en: "Keep the frame short, clear, and repeatable.",
    why_dry_run_vi: "Tên là đường vào chuẩn cho hội thoại đầu tiên.",
    why_dry_run_en: "Names are the standard entry into a first conversation.",
    trap: { audience: "both", vi: "Đừng đổi vị trí ਕੀ.", en: "Do not move ਕੀ." },
    review_links: ["pa_a1_checkpoint_identity_001", "pa_a1_selector_micro_001"],
  },
  {
    id: "pa_a1_dryrun_family_001",
    domain: "family",
    style: "final_readiness",
    prompt_vi: "Chọn câu gia đình có cả mẹ và sở hữu.",
    prompt_en: "Select the family line with mother and possession.",
    cue_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ ਹੈ।",
    romanization: "ih meri man hai. mere kol ikk bhra hai.",
    meaning_vi: "Đây là mẹ tôi. Tôi có một anh/em trai.",
    meaning_en: "This is my mother. I have one brother.",
    selector_pa: "ਮੇਰੀ ਮਾਂ / ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ",
    selector_hint_vi: "Cần cả người thân lẫn mẫu sở hữu.",
    selector_hint_en: "You need both a person and a possession frame.",
    why_dry_run_vi: "Gia đình giúp test xem người học giữ được khung câu hay không.",
    why_dry_run_en: "Family checks whether the learner can keep the sentence frame.",
    trap: { audience: "vi", vi: "Đừng bỏ ਕੋਲ.", en: "Do not drop ਕੋਲ." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_family_001", "pa_a1_selector_family_001"],
  },
  {
    id: "pa_a1_dryrun_numbers_001",
    domain: "numbers",
    style: "quality_gate",
    prompt_vi: "Chọn số và giá đúng cho vé.",
    prompt_en: "Select the correct numbers and price for tickets.",
    cue_pa: "ਦੋ ਟਿਕਟਾਂ। ਪੰਜ ਡਾਲਰ।",
    romanization: "do tiktan. panj dollar.",
    meaning_vi: "Hai vé. Năm đô la.",
    meaning_en: "Two tickets. Five dollars.",
    selector_pa: "ਦੋ / ਪੰਜ / ਡਾਲਰ",
    selector_hint_vi: "Đọc Gurmukhi trước, rồi mới nhớ nghĩa.",
    selector_hint_en: "Read the Gurmukhi first, then recall the meaning.",
    why_dry_run_vi: "Số và giá là cổng kiểm tra chất lượng rất rõ.",
    why_dry_run_en: "Numbers and prices are very clear quality gates.",
    trap: { audience: "both", vi: "Đừng chỉ nhìn chữ Latin.", en: "Do not look only at Latin letters." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_numbers_001", "pa_a1_selector_numbers_001"],
  },
  {
    id: "pa_a1_dryrun_food_001",
    domain: "food",
    style: "pre_integration",
    prompt_vi: "Chọn câu nhu cầu cơ bản về nước.",
    prompt_en: "Select the basic need line for water.",
    cue_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mainu pani chahida hai",
    meaning_vi: "Tôi cần nước.",
    meaning_en: "I need water.",
    selector_pa: "ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ",
    selector_hint_vi: "Giữ mẫu nhu cầu cố định.",
    selector_hint_en: "Keep the need frame fixed.",
    why_dry_run_vi: "Nhu cầu cơ bản phải sẵn sàng trước khi tích hợp.",
    why_dry_run_en: "Basic needs must be ready before integration.",
    trap: { audience: "vi", vi: "Đừng chỉ nói danh từ một mình.", en: "Do not say only the noun." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_food_001", "pa_a1_selector_service_001"],
  },
  {
    id: "pa_a1_dryrun_directions_001",
    domain: "directions",
    style: "final_readiness",
    prompt_vi: "Chọn câu hỏi chỉ đường ở Canada.",
    prompt_en: "Select the direction question for Canada.",
    cue_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    romanization: "bas adda kithe hai?",
    meaning_vi: "Bến xe buýt ở đâu?",
    meaning_en: "Where is the bus stop?",
    selector_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ",
    selector_hint_vi: "Câu vị trí dùng ਕਿੱਥੇ ਹੈ.",
    selector_hint_en: "Location questions use ਕਿੱਥੇ ਹੈ.",
    why_dry_run_vi: "Chỉ đường là tình huống phải chạy ổn khi triển khai.",
    why_dry_run_en: "Directions must work cleanly at launch.",
    trap: { audience: "en", vi: "Đừng đảo trật tự theo tiếng Anh.", en: "Do not reorder it like English." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_directions_001", "pa_a1_selector_service_001"],
  },
  {
    id: "pa_a1_dryrun_help_001",
    domain: "help",
    style: "selector",
    prompt_vi: "Chọn câu xin giúp an toàn nhất.",
    prompt_en: "Select the safest help request.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    romanization: "kirpa karke madad karo",
    meaning_vi: "Làm ơn giúp tôi.",
    meaning_en: "Please help me.",
    selector_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ",
    selector_hint_vi: "Dùng khi bị kẹt trong giao tiếp.",
    selector_hint_en: "Use it when the interaction gets stuck.",
    why_dry_run_vi: "Đây là câu cứu nguy cần có trong mọi gói tích hợp.",
    why_dry_run_en: "This is the rescue line every integration pack needs.",
    trap: { audience: "both", vi: "Đừng dựa vào tiếng Anh.", en: "Do not rely on English." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_help_001", "pa_a1_selector_politeness_001"],
  },
  {
    id: "pa_a1_dryrun_politeness_001",
    domain: "politeness",
    style: "quality_gate",
    prompt_vi: "Chọn lời cảm ơn ngắn để đi tiếp.",
    prompt_en: "Select the short thanks line to move on.",
    cue_pa: "ਧੰਨਵਾਦ।",
    romanization: "dhanvad",
    meaning_vi: "Cảm ơn.",
    meaning_en: "Thank you.",
    selector_pa: "ਧੰਨਵਾਦ",
    selector_hint_vi: "Nói ngay sau khi được giúp.",
    selector_hint_en: "Say it right after help is given.",
    why_dry_run_vi: "Lịch sự ổn định giúp gói tích hợp nghe tự nhiên hơn.",
    why_dry_run_en: "Stable politeness makes the integration pack sound more natural.",
    trap: { audience: "both", vi: "Đừng quên nói cảm ơn.", en: "Do not forget to say thanks." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_politeness_001", "pa_a1_selector_review_001"],
  },
  {
    id: "pa_a1_dryrun_retention_001",
    domain: "retention",
    style: "selector",
    prompt_vi: "Chọn câu ôn để giữ nhịp.",
    prompt_en: "Select the review line that keeps the pace.",
    cue_pa: "ਮਾਫ਼ ਕਰਨਾ।",
    romanization: "maf karna",
    meaning_vi: "Xin lỗi.",
    meaning_en: "Sorry / excuse me.",
    selector_pa: "ਮਾਫ਼ ਕਰਨਾ",
    selector_hint_vi: "Dùng để mở lại cuộc thoại.",
    selector_hint_en: "Use it to reopen the conversation.",
    why_dry_run_vi: "Câu đệm giúp người học không bị vỡ nhịp khi triển khai.",
    why_dry_run_en: "This buffer line helps the learner avoid losing rhythm on launch.",
    trap: { audience: "vi", vi: "Đừng biến nó thành câu dài.", en: "Do not turn it into a long sentence." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_repeat_001", "pa_a1_selector_review_001"],
  },
  {
    id: "pa_a1_dryrun_checkpoints_001",
    domain: "checkpoints",
    style: "pre_integration",
    prompt_vi: "Chọn gói kiểm tra cuối cùng trước khi tích hợp.",
    prompt_en: "Select the final checkpoint package before integration.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ। ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    romanization: "sat sri akal. mainu form chahida hai. bas adda kithe hai?",
    meaning_vi: "Xin chào. Tôi cần mẫu đơn. Bến xe buýt ở đâu?",
    meaning_en: "Hello. I need a form. Where is the bus stop?",
    selector_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ + ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ + ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ",
    selector_hint_vi: "Ghép chào hỏi, nhu cầu, và chỉ đường.",
    selector_hint_en: "Combine greeting, need, and directions.",
    why_dry_run_vi: "Đây là bộ kiểm tra xem các câu nền đã khớp nhau chưa.",
    why_dry_run_en: "This package checks whether the base lines fit together.",
    trap: { audience: "en", vi: "Đừng chỉ dùng một mảnh câu.", en: "Do not use only one fragment." },
    canada_practical: true,
    review_links: ["pa_a1_consistency_service_001", "pa_a1_selector_service_001"],
  },
  {
    id: "pa_a1_dryrun_gurmukhi_001",
    domain: "gurmukhi_recognition",
    style: "final_readiness",
    prompt_vi: "Chọn tập từ Gurmukhi cho giai đoạn dry run.",
    prompt_en: "Select the Gurmukhi word set for the dry run stage.",
    cue_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    romanization: "pani, madad, bas, form",
    meaning_vi: "nước, giúp đỡ, xe buýt, mẫu đơn",
    meaning_en: "water, help, bus, form",
    selector_pa: "ਪਾਣੀ / ਮਦਦ / ਬੱਸ / ਫਾਰਮ",
    selector_hint_vi: "Luôn đọc chữ gốc trước.",
    selector_hint_en: "Always read the base script first.",
    why_dry_run_vi: "Nhận diện chữ là điều kiện để tích hợp chạy được thật.",
    why_dry_run_en: "Script recognition is required for the integration to run for real.",
    trap: { audience: "both", vi: "Romanization chỉ là cầu nối.", en: "Romanization is only a bridge." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_gurmukhi_001", "pa_a1_selector_gurmukhi_001"],
  },
  {
    id: "pa_a1_dryrun_service_001",
    domain: "service_counter_basics",
    style: "final_readiness",
    prompt_vi: "Chọn câu quầy dịch vụ đã sẵn sàng cho Canada.",
    prompt_en: "Select the service-counter line ready for Canada.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "sat sri akal. mainu form chahida hai.",
    meaning_vi: "Xin chào. Tôi cần mẫu đơn.",
    meaning_en: "Hello. I need a form.",
    selector_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ + ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ",
    selector_hint_vi: "Kết hợp chào hỏi với nhu cầu.",
    selector_hint_en: "Combine greeting with the need.",
    why_dry_run_vi: "Đây là câu nền thực dụng nhất cho bối cảnh Canada.",
    why_dry_run_en: "This is the most practical base line for Canada contexts.",
    trap: { audience: "en", vi: "Đừng dịch từng chữ.", en: "Do not translate word-for-word." },
    canada_practical: true,
    review_links: ["pa_a1_selector_service_001", "pa_a1_consistency_service_001"],
  },
];

export default punjabiA1IntegrationDryRunSet;
