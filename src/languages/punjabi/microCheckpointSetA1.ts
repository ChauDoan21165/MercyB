// Punjabi A1 micro checkpoint set for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization supports recall. Native review is deferred.

export type PunjabiMicroCheckpointDomain =
  | "greetings"
  | "identity"
  | "family"
  | "numbers"
  | "prices"
  | "food"
  | "directions"
  | "help"
  | "repetition"
  | "politeness"
  | "gurmukhi_recognition"
  | "canada_service";

export type PunjabiMicroCheckpointStyle =
  | "micro_checkpoint"
  | "final_stability"
  | "boundary_check"
  | "checklist"
  | "regression"
  | "export_readiness";

export type PunjabiMicroCheckpointA1 = {
  id: string;
  domain: PunjabiMicroCheckpointDomain;
  style: PunjabiMicroCheckpointStyle;
  prompt_vi: string;
  prompt_en: string;
  cue_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  expected_pa: string;
  expected_hint_vi: string;
  expected_hint_en: string;
  why_checkpoint_vi: string;
  why_checkpoint_en: string;
  trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: boolean;
  review_links: string[];
};

export const microCheckpointSetScriptAwareness =
  "Gurmukhi is the primary script for this Punjabi A1 micro checkpoint set. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1MicroCheckpointSet: PunjabiMicroCheckpointA1[] = [
  {
    id: "pa_a1_checkpoint_greeting_001",
    domain: "greetings",
    style: "micro_checkpoint",
    prompt_vi: "Nhớ lời chào mở đầu.",
    prompt_en: "Recall the opening greeting.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    romanization: "sat sri akal",
    meaning_vi: "Xin chào.",
    meaning_en: "Hello.",
    expected_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    expected_hint_vi: "Dùng khi bắt đầu nói.",
    expected_hint_en: "Use it when starting to speak.",
    why_checkpoint_vi: "Đây là điểm vào đơn giản nhất cho A1.",
    why_checkpoint_en: "This is the simplest entry point for A1.",
    trap: { audience: "vi", vi: "Đừng nối thêm âm đuôi.", en: "Do not add an extra ending sound." },
    canada_practical: true,
    review_links: ["pa_a1_review_greeting_001", "pa_a1_guard_greeting_001"],
  },
  {
    id: "pa_a1_checkpoint_identity_001",
    domain: "identity",
    style: "boundary_check",
    prompt_vi: "Nhớ câu tên tôi là ... và hỏi lại tên.",
    prompt_en: "Recall the 'my name is ...' line and ask back the name question.",
    cue_pa: "ਮੇਰਾ ਨਾਮ ਆਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    romanization: "mera nam An hai. tuhada nam ki hai?",
    meaning_vi: "Tên tôi là An. Tên bạn là gì?",
    meaning_en: "My name is An. What is your name?",
    expected_pa: "ਮੇਰਾ ਨਾਮ ਆਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    expected_hint_vi: "Giữ câu hỏi với ਕੀ ở đầu.",
    expected_hint_en: "Keep ਕੀ at the front of the question.",
    why_checkpoint_vi: "Đây là biên giới cơ bản giữa chào hỏi và tự giới thiệu.",
    why_checkpoint_en: "This marks the basic boundary between greeting and self-introduction.",
    trap: { audience: "both", vi: "Đừng theo trật tự tiếng Anh.", en: "Do not follow English word order." },
    review_links: ["pa_a1_review_identity_001", "pa_a1_guard_service_001"],
  },
  {
    id: "pa_a1_checkpoint_family_001",
    domain: "family",
    style: "micro_checkpoint",
    prompt_vi: "Nhớ một câu về mẹ và một câu sở hữu.",
    prompt_en: "Recall one line about mother and one possession line.",
    cue_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ ਹੈ।",
    romanization: "ih meri man hai. mere kol ikk bhra hai.",
    meaning_vi: "Đây là mẹ tôi. Tôi có một anh/em trai.",
    meaning_en: "This is my mother. I have one brother.",
    expected_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ ਹੈ।",
    expected_hint_vi: "Dùng ਮੇਰੀ cho người nữ.",
    expected_hint_en: "Use ਮੇਰੀ for the female person.",
    why_checkpoint_vi: "Gia đình là kiểm tra ngắn cho sở hữu và giới thiệu.",
    why_checkpoint_en: "Family is a short check for possession and reference.",
    trap: { audience: "vi", vi: "Đừng bỏ ਕੋਲ.", en: "Do not drop ਕੋਲ." },
    canada_practical: true,
    review_links: ["pa_a1_review_family_001", "pa_a1_guard_help_001"],
  },
  {
    id: "pa_a1_checkpoint_numbers_001",
    domain: "numbers",
    style: "checklist",
    prompt_vi: "Nhận ra số trong câu ngắn.",
    prompt_en: "Recognize numbers in a short sentence.",
    cue_pa: "ਦੋ ਟਿਕਟਾਂ। ਪੰਜ ਡਾਲਰ।",
    romanization: "do tiktan. panj dollar.",
    meaning_vi: "Hai vé. Năm đô la.",
    meaning_en: "Two tickets. Five dollars.",
    expected_pa: "ਦੋ ਟਿਕਟਾਂ। ਪੰਜ ਡਾਲਰ।",
    expected_hint_vi: "Nhận ra ਦੋ và ਪੰਜ trước.",
    expected_hint_en: "Recognize ਦੋ and ਪੰਜ first.",
    why_checkpoint_vi: "Một checklist tốt cần nhận số nhanh.",
    why_checkpoint_en: "A good checklist needs fast number recognition.",
    trap: { audience: "both", vi: "Đừng chỉ đọc chữ Latin.", en: "Do not read only Latin letters." },
    canada_practical: true,
    review_links: ["pa_a1_review_numbers_001", "pa_a1_guard_price_001"],
  },
  {
    id: "pa_a1_checkpoint_prices_001",
    domain: "prices",
    style: "final_stability",
    prompt_vi: "Hỏi giá một cách ngắn gọn.",
    prompt_en: "Ask the price in a short way.",
    cue_pa: "ਇਹ ਕਿੰਨਾ ਹੈ?",
    romanization: "ih kinna hai?",
    meaning_vi: "Cái này bao nhiêu?",
    meaning_en: "How much is this?",
    expected_pa: "ਇਹ ਕਿੰਨਾ ਹੈ?",
    expected_hint_vi: "Dùng khi xem giá.",
    expected_hint_en: "Use it when checking a price.",
    why_checkpoint_vi: "Giá là điểm ổn định cần kiểm tra ở mọi lần ôn.",
    why_checkpoint_en: "Price questions are stable checkpoints to review every time.",
    trap: { audience: "en", vi: "Đừng dịch ngược theo tiếng Anh.", en: "Do not reverse it by English order." },
    canada_practical: true,
    review_links: ["pa_a1_review_numbers_001", "pa_a1_guard_price_001"],
  },
  {
    id: "pa_a1_checkpoint_food_001",
    domain: "food",
    style: "micro_checkpoint",
    prompt_vi: "Nhớ câu cần nước.",
    prompt_en: "Recall the line for needing water.",
    cue_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mainu pani chahida hai",
    meaning_vi: "Tôi cần nước.",
    meaning_en: "I need water.",
    expected_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    expected_hint_vi: "Giữ ਮੈਨੂੰ.",
    expected_hint_en: "Keep ਮੈਨੂੰ.",
    why_checkpoint_vi: "Nhu cầu cơ bản là ngưỡng tối thiểu của A1.",
    why_checkpoint_en: "Basic needs are the minimum threshold of A1.",
    trap: { audience: "vi", vi: "Đừng chỉ nói 'nước'.", en: "Do not say only 'water'." },
    canada_practical: true,
    review_links: ["pa_a1_review_food_001", "pa_a1_guard_final_001"],
  },
  {
    id: "pa_a1_checkpoint_directions_001",
    domain: "directions",
    style: "boundary_check",
    prompt_vi: "Nhớ hỏi bến xe buýt ở đâu.",
    prompt_en: "Recall how to ask where the bus stop is.",
    cue_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    romanization: "bas adda kithe hai?",
    meaning_vi: "Bến xe buýt ở đâu?",
    meaning_en: "Where is the bus stop?",
    expected_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    expected_hint_vi: "Câu hỏi vị trí dùng ਕਿੱਥੇ ਹੈ.",
    expected_hint_en: "A location question uses ਕਿੱਥੇ ਹੈ.",
    why_checkpoint_vi: "Biên giới cho chỉ đường phải rõ để tránh lúng túng.",
    why_checkpoint_en: "Direction boundaries need clarity to avoid confusion.",
    trap: { audience: "both", vi: "Đừng đảo kiểu tiếng Anh.", en: "Do not invert it like English." },
    canada_practical: true,
    review_links: ["pa_a1_review_directions_001", "pa_a1_guard_location_001"],
  },
  {
    id: "pa_a1_checkpoint_help_001",
    domain: "help",
    style: "final_stability",
    prompt_vi: "Nhớ câu xin giúp.",
    prompt_en: "Recall the help request.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    romanization: "kirpa karke madad karo",
    meaning_vi: "Làm ơn giúp tôi.",
    meaning_en: "Please help me.",
    expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    expected_hint_vi: "Giữ cụm lịch sự ở đầu.",
    expected_hint_en: "Keep the polite phrase at the front.",
    why_checkpoint_vi: "Khi kẹt, đây là câu ổn định cần bật ra ngay.",
    why_checkpoint_en: "When stuck, this is the stable line to produce immediately.",
    trap: { audience: "both", vi: "Đừng dựa vào tiếng Anh.", en: "Do not rely on English only." },
    canada_practical: true,
    review_links: ["pa_a1_review_help_001", "pa_a1_guard_help_001"],
  },
  {
    id: "pa_a1_checkpoint_repeat_001",
    domain: "repetition",
    style: "regression",
    prompt_vi: "Xin nói lại một cách lịch sự.",
    prompt_en: "Politely ask the person to repeat.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    romanization: "kirpa karke dubara kaho",
    meaning_vi: "Làm ơn nói lại.",
    meaning_en: "Please say that again.",
    expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    expected_hint_vi: "Giữ ਦੁਬਾਰਾ kaho.",
    expected_hint_en: "Keep ਦੁਬਾਰਾ kaho.",
    why_checkpoint_vi: "Nếu mất một câu, đây là lưới an toàn của người học.",
    why_checkpoint_en: "If one line is missed, this is the learner's safety net.",
    trap: { audience: "vi", vi: "Đừng im lặng khi không nghe rõ.", en: "Do not stay silent when you miss it." },
    canada_practical: true,
    review_links: ["pa_a1_review_polite_001", "pa_a1_guard_repeat_001"],
  },
  {
    id: "pa_a1_checkpoint_politeness_001",
    domain: "politeness",
    style: "checklist",
    prompt_vi: "Nhớ một lời cảm ơn ngắn.",
    prompt_en: "Recall one short thanks.",
    cue_pa: "ਧੰਨਵਾਦ।",
    romanization: "dhanvad",
    meaning_vi: "Cảm ơn.",
    meaning_en: "Thank you.",
    expected_pa: "ਧੰਨਵਾਦ।",
    expected_hint_vi: "Dùng sau khi được giúp.",
    expected_hint_en: "Use it after being helped.",
    why_checkpoint_vi: "Một checklist lịch sự phải có lời cảm ơn.",
    why_checkpoint_en: "A politeness checklist must include thanks.",
    trap: { audience: "both", vi: "Đừng quên nói cảm ơn.", en: "Do not forget to say thanks." },
    canada_practical: true,
    review_links: ["pa_a1_review_polite_001", "pa_a1_guard_thanks_001"],
  },
  {
    id: "pa_a1_checkpoint_gurmukhi_001",
    domain: "gurmukhi_recognition",
    style: "export_readiness",
    prompt_vi: "Nhận ra vài từ sinh tồn bằng Gurmukhi.",
    prompt_en: "Recognize a few survival words in Gurmukhi.",
    cue_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    romanization: "pani, madad, bas, form",
    meaning_vi: "nước, giúp đỡ, xe buýt, mẫu đơn",
    meaning_en: "water, help, bus, form",
    expected_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    expected_hint_vi: "Đọc chữ viết trước romanization.",
    expected_hint_en: "Read the script before romanization.",
    why_checkpoint_vi: "Xuất khẩu học liệu cần chứng minh được năng lực đọc chữ.",
    why_checkpoint_en: "Exported learning materials need proof of script reading.",
    trap: { audience: "both", vi: "Romanization chỉ là hỗ trợ.", en: "Romanization is support only." },
    canada_practical: true,
    review_links: ["pa_a1_review_gurmukhi_001", "pa_a1_guard_gurmukhi_001"],
  },
  {
    id: "pa_a1_checkpoint_service_001",
    domain: "canada_service",
    style: "final_stability",
    prompt_vi: "Nhớ câu chào + nhu cầu ở quầy dịch vụ.",
    prompt_en: "Recall greeting plus a need at a service counter.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "sat sri akal. mainu form chahida hai.",
    meaning_vi: "Xin chào. Tôi cần mẫu đơn.",
    meaning_en: "Hello. I need a form.",
    expected_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    expected_hint_vi: "Kết hợp chào hỏi với nhu cầu.",
    expected_hint_en: "Combine the greeting with the need.",
    why_checkpoint_vi: "Đây là câu lõi cho Canada khi người học đi học hoặc đi làm.",
    why_checkpoint_en: "This is a core Canada line for school or work situations.",
    trap: { audience: "en", vi: "Đừng dịch từng chữ.", en: "Do not translate word-for-word." },
    canada_practical: true,
    review_links: ["pa_a1_review_canada_001", "pa_a1_guard_service_001"],
  },
];

export default punjabiA1MicroCheckpointSet;
