// Punjabi A1 consistency review for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization supports recall. Native review is deferred.

export type PunjabiConsistencyReviewDomain =
  | "greetings"
  | "identity"
  | "family"
  | "numbers"
  | "food"
  | "directions"
  | "help"
  | "repetition"
  | "politeness"
  | "gurmukhi_recognition"
  | "romanization_bridge"
  | "canada_service";

export type PunjabiConsistencyReviewStyle =
  | "consistency_review"
  | "final_guardrail"
  | "integration_readiness"
  | "regression"
  | "checklist";

export type PunjabiConsistencyReviewItemA1 = {
  id: string;
  domain: PunjabiConsistencyReviewDomain;
  style: PunjabiConsistencyReviewStyle;
  prompt_vi: string;
  prompt_en: string;
  cue_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  expected_pa: string;
  expected_hint_vi: string;
  expected_hint_en: string;
  why_consistency_vi: string;
  why_consistency_en: string;
  trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: boolean;
  review_links: string[];
};

export const consistencyReviewScriptAwareness =
  "Gurmukhi is the primary script for this Punjabi A1 consistency review. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1ConsistencyReview: PunjabiConsistencyReviewItemA1[] = [
  {
    id: "pa_a1_consistency_greeting_001",
    domain: "greetings",
    style: "consistency_review",
    prompt_vi: "Giữ câu chào nhất quán qua mọi bài.",
    prompt_en: "Keep the greeting consistent across lessons.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    romanization: "sat sri akal",
    meaning_vi: "Xin chào.",
    meaning_en: "Hello.",
    expected_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    expected_hint_vi: "Mở lời bằng câu chào chuẩn.",
    expected_hint_en: "Open with the standard greeting.",
    why_consistency_vi: "Chào hỏi là lớp nền để các câu khác không bị lệch.",
    why_consistency_en: "Greeting is the base layer that keeps other lines aligned.",
    trap: { audience: "vi", vi: "Đừng đổi sang câu chào khác giữa các bài.", en: "Do not switch to another greeting midstream." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_greeting_001", "pa_a1_guard_greeting_001"],
  },
  {
    id: "pa_a1_consistency_identity_001",
    domain: "identity",
    style: "final_guardrail",
    prompt_vi: "Giữ mẫu tên tôi là ... và hỏi tên.",
    prompt_en: "Keep the 'my name is ...' frame and the name question.",
    cue_pa: "ਮੇਰਾ ਨਾਮ ਆਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    romanization: "mera nam An hai. tuhada nam ki hai?",
    meaning_vi: "Tên tôi là An. Tên bạn là gì?",
    meaning_en: "My name is An. What is your name?",
    expected_pa: "ਮੇਰਾ ਨਾਮ ਆਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    expected_hint_vi: "Giữ ਕੀ ở đầu câu hỏi.",
    expected_hint_en: "Keep ਕੀ at the front of the question.",
    why_consistency_vi: "Khung tự giới thiệu phải khớp với các bài trước và bài sau.",
    why_consistency_en: "Self-introduction must match earlier and later lessons.",
    trap: { audience: "both", vi: "Đừng đảo trật tự như tiếng Anh.", en: "Do not invert the order like English." },
    review_links: ["pa_a1_checkpoint_identity_001", "pa_a1_guard_service_001"],
  },
  {
    id: "pa_a1_consistency_family_001",
    domain: "family",
    style: "consistency_review",
    prompt_vi: "Giữ đúng mẫu gia đình và sở hữu.",
    prompt_en: "Keep the family and possession pattern consistent.",
    cue_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ ਹੈ।",
    romanization: "ih meri man hai. mere kol ikk bhra hai.",
    meaning_vi: "Đây là mẹ tôi. Tôi có một anh/em trai.",
    meaning_en: "This is my mother. I have one brother.",
    expected_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ ਹੈ।",
    expected_hint_vi: "Dùng ਮੇਰੀ cho mẹ, ਮੇਰੇ ਕੋਲ cho 'tôi có'.",
    expected_hint_en: "Use ਮੇਰੀ for mother and ਮੇਰੇ ਕੋਲ for 'I have'.",
    why_consistency_vi: "Gia đình là chỗ dễ nhầm nếu không giữ cùng khung.",
    why_consistency_en: "Family is easy to confuse unless the same frame is preserved.",
    trap: { audience: "vi", vi: "Đừng bỏ ਕੋਲ.", en: "Do not drop ਕੋਲ." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_family_001", "pa_a1_guard_help_001"],
  },
  {
    id: "pa_a1_consistency_numbers_001",
    domain: "numbers",
    style: "integration_readiness",
    prompt_vi: "Giữ số và giá rõ ràng.",
    prompt_en: "Keep numbers and prices clear.",
    cue_pa: "ਦੋ ਟਿਕਟਾਂ। ਪੰਜ ਡਾਲਰ।",
    romanization: "do tiktan. panj dollar.",
    meaning_vi: "Hai vé. Năm đô la.",
    meaning_en: "Two tickets. Five dollars.",
    expected_pa: "ਦੋ ਟਿਕਟਾਂ। ਪੰਜ ਡਾਲਰ।",
    expected_hint_vi: "Nhìn Gurmukhi trước rồi mới nhớ nghĩa.",
    expected_hint_en: "Look at the Gurmukhi first, then recall the meaning.",
    why_consistency_vi: "Số và giá là phần tích hợp giữa bài học và đời sống.",
    why_consistency_en: "Numbers and prices are the bridge between lessons and daily life.",
    trap: { audience: "both", vi: "Đừng chỉ dựa vào chữ Latin.", en: "Do not rely only on Latin letters." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_numbers_001", "pa_a1_guard_price_001"],
  },
  {
    id: "pa_a1_consistency_food_001",
    domain: "food",
    style: "checklist",
    prompt_vi: "Giữ khung nhu cầu cơ bản về nước.",
    prompt_en: "Keep the basic need frame for water.",
    cue_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mainu pani chahida hai",
    meaning_vi: "Tôi cần nước.",
    meaning_en: "I need water.",
    expected_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    expected_hint_vi: "Cần cả ਮੈਨੂੰ lẫn ਚਾਹੀਦਾ ਹੈ.",
    expected_hint_en: "You need both ਮੈਨੂੰ and ਚਾਹੀਦਾ ਹੈ.",
    why_consistency_vi: "Câu nhu cầu phải ổn định để người học dùng tự động.",
    why_consistency_en: "Need statements must stay stable enough to become automatic.",
    trap: { audience: "vi", vi: "Đừng chỉ nói danh từ một mình.", en: "Do not say only the noun by itself." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_food_001", "pa_a1_guard_final_001"],
  },
  {
    id: "pa_a1_consistency_directions_001",
    domain: "directions",
    style: "final_guardrail",
    prompt_vi: "Giữ câu hỏi đường đi không bị đảo trật tự.",
    prompt_en: "Keep the direction question from flipping word order.",
    cue_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    romanization: "bas adda kithe hai?",
    meaning_vi: "Bến xe buýt ở đâu?",
    meaning_en: "Where is the bus stop?",
    expected_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    expected_hint_vi: "Vị trí dùng ਕਿੱਥੇ ਹੈ.",
    expected_hint_en: "Location uses ਕਿੱਥੇ ਹੈ.",
    why_consistency_vi: "Chỉ đường là chỗ cần guardrail để tránh kéo theo mẫu tiếng Anh.",
    why_consistency_en: "Directions need guardrails so English order does not leak in.",
    trap: { audience: "en", vi: "Đừng chuyển sang cấu trúc tiếng Anh.", en: "Do not switch to English structure." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_directions_001", "pa_a1_guard_location_001"],
  },
  {
    id: "pa_a1_consistency_help_001",
    domain: "help",
    style: "regression",
    prompt_vi: "Giữ câu xin giúp ngắn và lịch sự.",
    prompt_en: "Keep the help request short and polite.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    romanization: "kirpa karke madad karo",
    meaning_vi: "Làm ơn giúp tôi.",
    meaning_en: "Please help me.",
    expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    expected_hint_vi: "Mở đầu bằng cụm lịch sự.",
    expected_hint_en: "Begin with the polite phrase.",
    why_consistency_vi: "Nếu không nhất quán, người học sẽ mất câu cứu nguy quan trọng nhất.",
    why_consistency_en: "Without consistency, the learner loses the most important rescue line.",
    trap: { audience: "both", vi: "Đừng dựa vào tiếng Anh khi bí.", en: "Do not fall back to English when stuck." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_help_001", "pa_a1_guard_help_001"],
  },
  {
    id: "pa_a1_consistency_repeat_001",
    domain: "repetition",
    style: "checklist",
    prompt_vi: "Giữ yêu cầu nói lại đúng mẫu.",
    prompt_en: "Keep the repetition request in the right frame.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    romanization: "kirpa karke dubara kaho",
    meaning_vi: "Làm ơn nói lại.",
    meaning_en: "Please say that again.",
    expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    expected_hint_vi: "Giữ ਦੁਬਾਰਾ kaho.",
    expected_hint_en: "Keep ਦੁਬਾਰਾ kaho.",
    why_consistency_vi: "Câu lặp lại phải giống nhau để thành phản xạ.",
    why_consistency_en: "The repeat request must stay fixed so it becomes a reflex.",
    trap: { audience: "vi", vi: "Đừng ngại yêu cầu nói lại.", en: "Do not hesitate to ask for repetition." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_repeat_001", "pa_a1_guard_repeat_001"],
  },
  {
    id: "pa_a1_consistency_politeness_001",
    domain: "politeness",
    style: "integration_readiness",
    prompt_vi: "Giữ lời cảm ơn ngắn và tự động.",
    prompt_en: "Keep the thanks short and automatic.",
    cue_pa: "ਧੰਨਵਾਦ।",
    romanization: "dhanvad",
    meaning_vi: "Cảm ơn.",
    meaning_en: "Thank you.",
    expected_pa: "ਧੰਨਵਾਦ।",
    expected_hint_vi: "Nói ngay sau khi được giúp.",
    expected_hint_en: "Say it right after being helped.",
    why_consistency_vi: "Lịch sự ổn định giúp toàn bộ bộ học liệu nghe tự nhiên hơn.",
    why_consistency_en: "Stable politeness makes the whole set feel more natural.",
    trap: { audience: "both", vi: "Đừng quên lời cảm ơn.", en: "Do not omit the thanks." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_politeness_001", "pa_a1_guard_thanks_001"],
  },
  {
    id: "pa_a1_consistency_gurmukhi_001",
    domain: "gurmukhi_recognition",
    style: "final_guardrail",
    prompt_vi: "Giữ ưu tiên đọc Gurmukhi.",
    prompt_en: "Keep Gurmukhi as the reading priority.",
    cue_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    romanization: "pani, madad, bas, form",
    meaning_vi: "nước, giúp đỡ, xe buýt, mẫu đơn",
    meaning_en: "water, help, bus, form",
    expected_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    expected_hint_vi: "Romanization chỉ là nhịp cầu.",
    expected_hint_en: "Romanization is only a bridge.",
    why_consistency_vi: "Nếu ưu tiên Latin, người học sẽ mất khả năng tự đọc.",
    why_consistency_en: "If Latin takes priority, the learner loses self-reading ability.",
    trap: { audience: "both", vi: "Romanization không phải đáp án cuối.", en: "Romanization is not the final answer." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_gurmukhi_001", "pa_a1_guard_gurmukhi_001"],
  },
  {
    id: "pa_a1_consistency_romanization_001",
    domain: "romanization_bridge",
    style: "integration_readiness",
    prompt_vi: "Chỉ dùng romanization như cây cầu.",
    prompt_en: "Use romanization only as a bridge.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ / sat sri akal",
    romanization: "sat sri akal",
    meaning_vi: "Xin chào / cầu nối âm đọc.",
    meaning_en: "Hello / pronunciation bridge.",
    expected_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
    expected_hint_vi: "Đọc Gurmukhi trước, Romanization sau.",
    expected_hint_en: "Read Gurmukhi first, romanization second.",
    why_consistency_vi: "Cầu nối phải hỗ trợ, không được thay thế chữ gốc.",
    why_consistency_en: "The bridge must support the original script, not replace it.",
    trap: { audience: "both", vi: "Đừng để romanization thành ngôn ngữ chính.", en: "Do not let romanization become the main language." },
    review_links: ["pa_a1_checkpoint_gurmukhi_001", "pa_a1_review_gurmukhi_001"],
  },
  {
    id: "pa_a1_consistency_service_001",
    domain: "canada_service",
    style: "final_guardrail",
    prompt_vi: "Giữ câu quầy dịch vụ ổn định cho Canada.",
    prompt_en: "Keep the service-counter line stable for Canada.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "sat sri akal. mainu form chahida hai.",
    meaning_vi: "Xin chào. Tôi cần mẫu đơn.",
    meaning_en: "Hello. I need a form.",
    expected_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    expected_hint_vi: "Gộp chào hỏi và nhu cầu.",
    expected_hint_en: "Combine greeting and need.",
    why_consistency_vi: "Mẫu này giúp người học không bị lệch giữa các bài và thực tế.",
    why_consistency_en: "This keeps the learner aligned between lessons and real life.",
    trap: { audience: "en", vi: "Đừng dịch từng chữ.", en: "Do not translate word-for-word." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_service_001", "pa_a1_guard_service_001"],
  },
];

export default punjabiA1ConsistencyReview;
