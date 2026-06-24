// Punjabi A1 retention review for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization is support. Native review is deferred.

export type PunjabiRetentionReviewDomain =
  | "greetings"
  | "identity"
  | "family"
  | "numbers_prices"
  | "food"
  | "directions"
  | "help_repair"
  | "polite_service"
  | "gurmukhi_recognition"
  | "canada_survival";

export type PunjabiRetentionReviewStyle =
  | "retention_review"
  | "final_hardening"
  | "export_readiness"
  | "regression_check"
  | "final_qa";

export type PunjabiRetentionReviewItemA1 = {
  id: string;
  domain: PunjabiRetentionReviewDomain;
  style: PunjabiRetentionReviewStyle;
  prompt_vi: string;
  prompt_en: string;
  cue_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  expected_pa: string;
  expected_hint_vi: string;
  expected_hint_en: string;
  why_review_vi: string;
  why_review_en: string;
  review_trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: boolean;
  review_links: string[];
};

export const retentionReviewScriptAwareness =
  "Gurmukhi is the primary script for this Punjabi A1 retention review. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1RetentionReview: PunjabiRetentionReviewItemA1[] = [
  {
    id: "pa_a1_review_greeting_001",
    domain: "greetings",
    style: "retention_review",
    prompt_vi: "Nhớ nhanh một câu chào.",
    prompt_en: "Quickly recall one greeting.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    romanization: "sat sri akal",
    meaning_vi: "Xin chào.",
    meaning_en: "Hello.",
    expected_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    expected_hint_vi: "Dùng khi mở đầu lịch sự.",
    expected_hint_en: "Use it to begin politely.",
    why_review_vi: "Gọi lại câu chào là bước khởi động cho mọi tương tác A1.",
    why_review_en: "Recalling the greeting is the warm-up for every A1 interaction.",
    review_trap: { audience: "vi", vi: "Đừng thêm âm đuôi không cần thiết.", en: "Do not add an unnecessary ending sound." },
    canada_practical: true,
    review_links: ["pa_a1_booster_greeting_001", "pa_a1_exit_greetings_001"],
  },
  {
    id: "pa_a1_review_identity_001",
    domain: "identity",
    style: "final_qa",
    prompt_vi: "Nhớ câu tên tôi là ... và hỏi tên người khác.",
    prompt_en: "Recall the 'my name is ...' line and ask someone else's name.",
    cue_pa: "ਮੇਰਾ ਨਾਮ ਆਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    romanization: "mera nam An hai. tuhada nam ki hai?",
    meaning_vi: "Tên tôi là An. Tên bạn là gì?",
    meaning_en: "My name is An. What is your name?",
    expected_pa: "ਮੇਰਾ ਨਾਮ ਆਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    expected_hint_vi: "Giữ câu hỏi với ਕੀ ở đầu.",
    expected_hint_en: "Keep ਕੀ at the start of the question.",
    why_review_vi: "Giới thiệu bản thân và hỏi lại là phần cốt lõi của A1.",
    why_review_en: "Self-introduction and asking back are core A1 moves.",
    review_trap: { audience: "both", vi: "Không sắp chữ như tiếng Anh.", en: "Do not reorder it like English." },
    review_links: ["pa_a1_booster_identity_001", "pa_a1_proof_intro_001"],
  },
  {
    id: "pa_a1_review_family_001",
    domain: "family",
    style: "retention_review",
    prompt_vi: "Nhớ một câu về mẹ và một câu có 'tôi có'.",
    prompt_en: "Recall one line about mother and one with 'I have'.",
    cue_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ ਹੈ।",
    romanization: "ih meri man hai. mere kol ikk bhra hai.",
    meaning_vi: "Đây là mẹ tôi. Tôi có một anh/em trai.",
    meaning_en: "This is my mother. I have one brother.",
    expected_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ ਹੈ।",
    expected_hint_vi: "Giữ ਮੇਰੀ cho người nữ và ਮੇਰੇ ਕੋਲ cho sở hữu.",
    expected_hint_en: "Use ਮੇਰੀ for the female person and ਮੇਰੇ ਕੋਲ for possession.",
    why_review_vi: "Gia đình kiểm tra sở hữu và giới thiệu người cùng lúc.",
    why_review_en: "Family checks possession and person-reference together.",
    review_trap: { audience: "vi", vi: "Đừng bỏ ਕੋਲ trong mẫu 'tôi có'.", en: "Do not drop ਕੋਲ in the 'I have' frame." },
    canada_practical: true,
    review_links: ["pa_a1_booster_family_001", "pa_a1_exit_family_001"],
  },
  {
    id: "pa_a1_review_numbers_001",
    domain: "numbers_prices",
    style: "export_readiness",
    prompt_vi: "Nhận ra số và giá trong một câu ngắn.",
    prompt_en: "Recognize numbers and prices in one short line.",
    cue_pa: "ਦੋ ਟਿਕਟਾਂ। ਪੰਜ ਡਾਲਰ।",
    romanization: "do tiktan. panj dollar.",
    meaning_vi: "Hai vé. Năm đô la.",
    meaning_en: "Two tickets. Five dollars.",
    expected_pa: "ਦੋ ਟਿਕਟਾਂ। ਪੰਜ ਡਾਲਰ।",
    expected_hint_vi: "Đọc bằng Gurmukhi trước rồi mới nhìn romanization.",
    expected_hint_en: "Read the Gurmukhi first, then look at romanization.",
    why_review_vi: "Đây là dữ liệu xuất khẩu tốt cho tình huống thực tế như quầy vé và cửa hàng.",
    why_review_en: "This is export-ready language for real situations like ticket counters and shops.",
    review_trap: { audience: "both", vi: "Đừng chỉ nhớ bằng chữ Latin.", en: "Do not memorize only in Latin letters." },
    canada_practical: true,
    review_links: ["pa_a1_booster_numbers_001", "pa_a1_exit_numbers_001"],
  },
  {
    id: "pa_a1_review_food_001",
    domain: "food",
    style: "final_hardening",
    prompt_vi: "Nhớ cách nói bạn cần nước.",
    prompt_en: "Recall how to say you need water.",
    cue_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mainu pani chahida hai",
    meaning_vi: "Tôi cần nước.",
    meaning_en: "I need water.",
    expected_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    expected_hint_vi: "Giữ ਮੈਨੂੰ trong câu nhu cầu.",
    expected_hint_en: "Keep ਮੈਨੂੰ in the need sentence.",
    why_review_vi: "Câu nhu cầu là mẫu sống còn trong A1.",
    why_review_en: "Need statements are survival language in A1.",
    review_trap: { audience: "vi", vi: "Đừng bỏ khung câu và chỉ nói 'nước'.", en: "Do not drop the frame and say only 'water'." },
    canada_practical: true,
    review_links: ["pa_a1_booster_food_001", "pa_a1_exit_food_001"],
  },
  {
    id: "pa_a1_review_directions_001",
    domain: "directions",
    style: "regression_check",
    prompt_vi: "Nhớ hỏi bến xe buýt ở đâu.",
    prompt_en: "Recall how to ask where the bus stop is.",
    cue_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    romanization: "bas adda kithe hai?",
    meaning_vi: "Bến xe buýt ở đâu?",
    meaning_en: "Where is the bus stop?",
    expected_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    expected_hint_vi: "Câu hỏi vị trí dùng ਕਿੱਥੇ ਹੈ.",
    expected_hint_en: "A location question uses ਕਿੱਥੇ ਹੈ.",
    why_review_vi: "Hỏi đường là thứ rất dễ bị quên nếu không ôn lại.",
    why_review_en: "Directions are easy to lose without review.",
    review_trap: { audience: "en", vi: "Đừng đảo theo mẫu tiếng Anh.", en: "Do not invert it the English way." },
    canada_practical: true,
    review_links: ["pa_a1_booster_directions_001", "pa_a1_exit_directions_001"],
  },
  {
    id: "pa_a1_review_help_001",
    domain: "help_repair",
    style: "final_qa",
    prompt_vi: "Nhớ câu xin giúp và câu 'tôi không hiểu'.",
    prompt_en: "Recall the help request and 'I do not understand' line.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ। ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਉਂਦੀ।",
    romanization: "kirpa karke madad karo. mainu samajh nahin aundi.",
    meaning_vi: "Làm ơn giúp tôi. Tôi không hiểu.",
    meaning_en: "Please help me. I do not understand.",
    expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ। ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਉਂਦੀ।",
    expected_hint_vi: "Giữ phủ định ਨਾਲ ਨਹੀਂ.",
    expected_hint_en: "Keep the negation with ਨਹੀਂ.",
    why_review_vi: "Khả năng tự sửa lỗi giao tiếp là một phần quan trọng của A1.",
    why_review_en: "Repairing a communication issue is an important A1 ability.",
    review_trap: { audience: "vi", vi: "Đừng bỏ không/ਨਹੀਂ trong câu phủ định.", en: "Do not drop the negation from the negative sentence." },
    canada_practical: true,
    review_links: ["pa_a1_booster_help_001", "pa_a1_exit_help_001"],
  },
  {
    id: "pa_a1_review_polite_001",
    domain: "polite_service",
    style: "retention_review",
    prompt_vi: "Nhớ cách xin nói lại lịch sự.",
    prompt_en: "Recall how to politely ask for repetition.",
    cue_pa: "ਮਾਫ਼ ਕਰਨਾ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    romanization: "maf karna. kirpa karke dubara kaho.",
    meaning_vi: "Xin lỗi/cho tôi hỏi. Làm ơn nói lại.",
    meaning_en: "Excuse me. Please say that again.",
    expected_pa: "ਮਾਫ਼ ਕਰਨਾ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    expected_hint_vi: "Câu ngắn, rõ, lịch sự.",
    expected_hint_en: "Short, clear, polite clauses.",
    why_review_vi: "Cụm này giữ cho cuộc trò chuyện không bị đứt mạch.",
    why_review_en: "This keeps the interaction from breaking down.",
    review_trap: { audience: "both", vi: "Đừng im lặng khi bạn lỡ nghe.", en: "Do not stay silent when you miss something." },
    canada_practical: true,
    review_links: ["pa_a1_booster_politeness_001", "pa_a1_exit_polite_001"],
  },
  {
    id: "pa_a1_review_gurmukhi_001",
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
    why_review_vi: "Nhận diện chữ là bằng chứng xuất khẩu quan trọng cho A1.",
    why_review_en: "Script recognition is important export evidence for A1.",
    review_trap: { audience: "both", vi: "Romanization chỉ là hỗ trợ.", en: "Romanization is only support." },
    canada_practical: true,
    review_links: ["pa_a1_booster_gurmukhi_001", "pa_a1_exit_gurmukhi_001"],
  },
  {
    id: "pa_a1_review_canada_001",
    domain: "canada_survival",
    style: "final_hardening",
    prompt_vi: "Nhớ câu cần mẫu đơn ở quầy dịch vụ.",
    prompt_en: "Recall the line for needing a form at a service counter.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "sat sri akal. mainu form chahida hai.",
    meaning_vi: "Xin chào. Tôi cần mẫu đơn.",
    meaning_en: "Hello. I need a form.",
    expected_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    expected_hint_vi: "Kết hợp chào hỏi và nhu cầu dịch vụ.",
    expected_hint_en: "Combine greeting and service need.",
    why_review_vi: "Đây là mẫu rất thực tế cho trường, bệnh viện, và dịch vụ công ở Canada.",
    why_review_en: "This is highly practical for schools, clinics, and public services in Canada.",
    review_trap: { audience: "en", vi: "Đừng dịch từng chữ; dùng cả khung câu.", en: "Do not translate word for word; use the full frame." },
    canada_practical: true,
    review_links: ["pa_a1_booster_canada_001", "pa_a1_proof_form_001"],
  },
  {
    id: "pa_a1_review_final_002",
    domain: "canada_survival",
    style: "final_qa",
    prompt_vi: "Nhớ câu hỏi về giấy tờ tùy thân.",
    prompt_en: "Recall the identification question.",
    cue_pa: "ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਪਛਾਣ ਹੈ?",
    romanization: "ki tuhade kol pachhan hai?",
    meaning_vi: "Bạn có giấy tờ tùy thân không?",
    meaning_en: "Do you have identification?",
    expected_pa: "ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਪਛਾਣ ਹੈ?",
    expected_hint_vi: "Câu hỏi có/không mở bằng ਕੀ.",
    expected_hint_en: "A yes/no question starts with ਕੀ.",
    why_review_vi: "Bản ôn này cho thấy người học hiểu câu hỏi dịch vụ quan trọng.",
    why_review_en: "This review shows the learner understands important service questions.",
    review_trap: { audience: "vi", vi: "Đừng nhầm với câu hỏi 'cái gì'.", en: "Do not confuse it with a 'what' question." },
    canada_practical: true,
    review_links: ["pa_a1_booster_final_qa_001", "pa_a1_proof_id_001"],
  },
];

export default punjabiA1RetentionReview;
