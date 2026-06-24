// Punjabi A1 retention boosters for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization supports recall. Native review is deferred.

export type PunjabiRetentionBoosterDomain =
  | "greetings"
  | "identity"
  | "family"
  | "numbers"
  | "food"
  | "directions"
  | "help"
  | "politeness"
  | "gurmukhi_recognition"
  | "canada_service";

export type PunjabiRetentionBoosterStyle =
  | "retention_booster"
  | "stress_test"
  | "final_risk"
  | "final_qa";

export type PunjabiRetentionBoosterA1 = {
  id: string;
  domain: PunjabiRetentionBoosterDomain;
  style: PunjabiRetentionBoosterStyle;
  prompt_vi: string;
  prompt_en: string;
  cue_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  answer_pa: string;
  answer_hint_vi: string;
  answer_hint_en: string;
  why_it_matters_vi: string;
  why_it_matters_en: string;
  trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: boolean;
  review_links: string[];
};

export const retentionBoostersScriptAwareness =
  "Gurmukhi is the primary script for these Punjabi A1 retention boosters. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1RetentionBoosters: PunjabiRetentionBoosterA1[] = [
  {
    id: "pa_a1_booster_greeting_001",
    domain: "greetings",
    style: "retention_booster",
    prompt_vi: "Nhớ nhanh một câu chào lịch sự.",
    prompt_en: "Recall one polite greeting quickly.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    romanization: "sat sri akal",
    meaning_vi: "Xin chào.",
    meaning_en: "Hello.",
    answer_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    answer_hint_vi: "Dùng khi mở lời.",
    answer_hint_en: "Use it to open an interaction.",
    why_it_matters_vi: "Chào đúng là cách giữ cuộc nói chuyện chạy trơn ở A1.",
    why_it_matters_en: "Greeting correctly keeps the A1 interaction moving.",
    trap: { audience: "vi", vi: "Đừng kéo dài âm cuối của ਸਤ.", en: "Do not add a long extra ending sound." },
    canada_practical: true,
    review_links: ["pa_a1_exit_greetings_001", "pa_a1_proof_greeting_001"],
  },
  {
    id: "pa_a1_booster_identity_001",
    domain: "identity",
    style: "final_qa",
    prompt_vi: "Nhớ câu 'Tên tôi là ...' và câu hỏi tên.",
    prompt_en: "Recall the 'My name is ...' line and the name question.",
    cue_pa: "ਮੇਰਾ ਨਾਮ ਆਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    romanization: "mera nam An hai. tuhada nam ki hai?",
    meaning_vi: "Tên tôi là An. Tên bạn là gì?",
    meaning_en: "My name is An. What is your name?",
    answer_pa: "ਮੇਰਾ ਨਾਮ ਆਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    answer_hint_vi: "Giữ câu hỏi với ਕੀ.",
    answer_hint_en: "Keep the question with ਕੀ.",
    why_it_matters_vi: "Giới thiệu bản thân là nền tảng cho mọi buổi học và dịch vụ.",
    why_it_matters_en: "Self-introduction underpins every class and service interaction.",
    trap: { audience: "both", vi: "Không chuyển câu hỏi như tiếng Anh.", en: "Do not reorder the question like English." },
    review_links: ["pa_a1_exit_identity_001", "pa_a1_proof_intro_001"],
  },
  {
    id: "pa_a1_booster_family_001",
    domain: "family",
    style: "retention_booster",
    prompt_vi: "Nhớ một câu về mẹ và một câu có 'tôi có'.",
    prompt_en: "Recall one line about mother and one with 'I have'.",
    cue_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ ਹੈ।",
    romanization: "ih meri man hai. mere kol ikk bhra hai.",
    meaning_vi: "Đây là mẹ tôi. Tôi có một anh/em trai.",
    meaning_en: "This is my mother. I have one brother.",
    answer_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ ਹੈ।",
    answer_hint_vi: "Dùng ਮੇਰੀ cho người nữ, ਮੇਰੇ ਕੋਲ cho 'tôi có'.",
    answer_hint_en: "Use ਮੇਰੀ for a female person and ਮੇਰੇ ਕੋਲ for 'I have'.",
    why_it_matters_vi: "Gia đình giúp luyện cả giới thiệu người và sở hữu.",
    why_it_matters_en: "Family gives practice for both introducing people and possession.",
    trap: { audience: "vi", vi: "Đừng bỏ ਕੋਲ trong mẫu 'tôi có'.", en: "Do not drop ਕੋਲ in the 'I have' frame." },
    review_links: ["pa_a1_exit_family_001", "pa_a1_proof_intro_001"],
  },
  {
    id: "pa_a1_booster_numbers_001",
    domain: "numbers",
    style: "stress_test",
    prompt_vi: "Nhận ra số và giá trong thực tế.",
    prompt_en: "Recognize numbers and prices in real life.",
    cue_pa: "ਦੋ ਟਿਕਟਾਂ। ਪੰਜ ਡਾਲਰ।",
    romanization: "do tiktan. panj dollar.",
    meaning_vi: "Hai vé. Năm đô la.",
    meaning_en: "Two tickets. Five dollars.",
    answer_pa: "ਦੋ ਟਿਕਟਾਂ। ਪੰਜ ਡਾਲਰ।",
    answer_hint_vi: "Đọc bằng Gurmukhi trước.",
    answer_hint_en: "Read it in Gurmukhi first.",
    why_it_matters_vi: "Số và giá xuất hiện liên tục trong vé, quán ăn, và cửa hàng.",
    why_it_matters_en: "Numbers and prices appear constantly in tickets, restaurants, and shops.",
    trap: { audience: "both", vi: "Đừng chỉ nhớ bằng chữ Latin.", en: "Do not memorize only in Latin letters." },
    canada_practical: true,
    review_links: ["pa_a1_exit_numbers_001", "pa_a1_proof_numbers_price_001"],
  },
  {
    id: "pa_a1_booster_food_001",
    domain: "food",
    style: "retention_booster",
    prompt_vi: "Nhớ cách nói bạn cần nước.",
    prompt_en: "Recall how to say you need water.",
    cue_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mainu pani chahida hai",
    meaning_vi: "Tôi cần nước.",
    meaning_en: "I need water.",
    answer_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    answer_hint_vi: "Giữ ਮੈਨੂੰ ở đầu khung nhu cầu.",
    answer_hint_en: "Keep ਮੈਨੂੰ at the start of the need frame.",
    why_it_matters_vi: "Nhu cầu cơ bản là phần sống còn ở A1.",
    why_it_matters_en: "Basic needs are survival language at A1.",
    trap: { audience: "vi", vi: "Đừng bỏ ਮੈਨੂੰ khi dịch sang Punjabi.", en: "Do not omit ਮੈਨੂੰ when translating into Punjabi." },
    canada_practical: true,
    review_links: ["pa_a1_exit_food_001", "pa_a1_proof_form_001"],
  },
  {
    id: "pa_a1_booster_directions_001",
    domain: "directions",
    style: "final_risk",
    prompt_vi: "Nhớ hỏi bến xe buýt ở đâu.",
    prompt_en: "Recall how to ask where the bus stop is.",
    cue_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    romanization: "bas adda kithe hai?",
    meaning_vi: "Bến xe buýt ở đâu?",
    meaning_en: "Where is the bus stop?",
    answer_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    answer_hint_vi: "Câu hỏi vị trí dùng ਕਿੱਥੇ ਹੈ.",
    answer_hint_en: "A location question uses ਕਿੱਥੇ ਹੈ.",
    why_it_matters_vi: "Chỉ đường là phần thiết yếu khi đi học hoặc đi làm.",
    why_it_matters_en: "Directions matter when going to class or work.",
    trap: { audience: "en", vi: "Đừng thêm trật tự câu hỏi tiếng Anh.", en: "Do not copy English question order." },
    canada_practical: true,
    review_links: ["pa_a1_exit_directions_001", "pa_a1_proof_form_001"],
  },
  {
    id: "pa_a1_booster_help_001",
    domain: "help",
    style: "final_qa",
    prompt_vi: "Nhớ câu xin giúp và câu 'tôi không hiểu'.",
    prompt_en: "Recall the help request and 'I do not understand' line.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ। ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਉਂਦੀ।",
    romanization: "kirpa karke madad karo. mainu samajh nahin aundi.",
    meaning_vi: "Làm ơn giúp tôi. Tôi không hiểu.",
    meaning_en: "Please help me. I do not understand.",
    answer_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ। ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਉਂਦੀ।",
    answer_hint_vi: "Giữ ਨਹੀਂ trong câu phủ định.",
    answer_hint_en: "Keep ਨਹੀਂ in the negative sentence.",
    why_it_matters_vi: "Tự sửa tình huống giao tiếp là mục tiêu trọng tâm của A1.",
    why_it_matters_en: "Repairing a conversation is a core A1 skill.",
    trap: { audience: "vi", vi: "Đừng bỏ phủ định khi nói 'không hiểu'.", en: "Do not drop the negation in 'do not understand'." },
    canada_practical: true,
    review_links: ["pa_a1_exit_help_001", "pa_a1_proof_help_001"],
  },
  {
    id: "pa_a1_booster_politeness_001",
    domain: "politeness",
    style: "retention_booster",
    prompt_vi: "Nhớ cách xin nói lại lịch sự.",
    prompt_en: "Recall how to politely ask for repetition.",
    cue_pa: "ਮਾਫ਼ ਕਰਨਾ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    romanization: "maf karna. kirpa karke dubara kaho.",
    meaning_vi: "Xin lỗi/cho tôi hỏi. Làm ơn nói lại.",
    meaning_en: "Excuse me. Please say that again.",
    answer_pa: "ਮਾਫ਼ ਕਰਨਾ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    answer_hint_vi: "Hai mệnh đề ngắn, rõ, lịch sự.",
    answer_hint_en: "Two short, clear, polite clauses.",
    why_it_matters_vi: "Lịch sự giúp người học an toàn hơn trong cửa hàng và dịch vụ.",
    why_it_matters_en: "Politeness helps the learner feel safer in shops and services.",
    trap: { audience: "both", vi: "Không im lặng khi bạn bị lỡ lời.", en: "Do not stay silent when you miss something." },
    canada_practical: true,
    review_links: ["pa_a1_exit_polite_001", "pa_a1_proof_service_repeat_001"],
  },
  {
    id: "pa_a1_booster_gurmukhi_001",
    domain: "gurmukhi_recognition",
    style: "stress_test",
    prompt_vi: "Nhớ đọc chữ Gurmukhi trước khi nhìn romanization.",
    prompt_en: "Recall to read Gurmukhi before looking at romanization.",
    cue_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    romanization: "pani, madad, bas, form",
    meaning_vi: "nước, giúp đỡ, xe buýt, mẫu đơn",
    meaning_en: "water, help, bus, form",
    answer_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    answer_hint_vi: "Chú ý chữ viết, không chỉ âm Latin.",
    answer_hint_en: "Pay attention to script, not only Latin sounds.",
    why_it_matters_vi: "Nhận diện chữ viết giúp người học tự lập nhanh hơn.",
    why_it_matters_en: "Script recognition helps the learner become independent faster.",
    trap: { audience: "both", vi: "Romanization chỉ là hỗ trợ.", en: "Romanization is only support." },
    canada_practical: true,
    review_links: ["pa_a1_exit_gurmukhi_001", "pa_a1_proof_gurmukhi_words_001"],
  },
  {
    id: "pa_a1_booster_canada_001",
    domain: "canada_service",
    style: "final_risk",
    prompt_vi: "Nhớ câu cần mẫu đơn ở quầy dịch vụ.",
    prompt_en: "Recall the line for needing a form at a service counter.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "sat sri akal. mainu form chahida hai.",
    meaning_vi: "Xin chào. Tôi cần mẫu đơn.",
    meaning_en: "Hello. I need a form.",
    answer_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    answer_hint_vi: "Kết hợp chào hỏi với nhu cầu dịch vụ.",
    answer_hint_en: "Combine a greeting with a service need.",
    why_it_matters_vi: "Đây là mẫu rất thực tế cho Canada: trường học, bệnh viện, chính quyền.",
    why_it_matters_en: "This is highly practical in Canada: school, clinic, and government settings.",
    trap: { audience: "en", vi: "Đừng dịch từng chữ; dùng cả khung câu.", en: "Do not translate word for word; use the full frame." },
    canada_practical: true,
    review_links: ["pa_a1_exit_canada_001", "pa_a1_proof_form_001"],
  },
  {
    id: "pa_a1_booster_final_qa_001",
    domain: "canada_service",
    style: "final_qa",
    prompt_vi: "Nhớ câu hỏi về giấy tờ tùy thân.",
    prompt_en: "Recall the identification question.",
    cue_pa: "ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਪਛਾਣ ਹੈ?",
    romanization: "ki tuhade kol pachhan hai?",
    meaning_vi: "Bạn có giấy tờ tùy thân không?",
    meaning_en: "Do you have identification?",
    answer_pa: "ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਪਛਾਣ ਹੈ?",
    answer_hint_vi: "Câu hỏi có/không mở bằng ਕੀ.",
    answer_hint_en: "A yes/no question starts with ਕੀ.",
    why_it_matters_vi: "Điểm này giúp người học hiểu được các câu hỏi dịch vụ quan trọng.",
    why_it_matters_en: "This helps the learner understand important service questions.",
    trap: { audience: "vi", vi: "Đừng nhầm với câu hỏi 'cái gì'.", en: "Do not confuse it with a 'what' question." },
    canada_practical: true,
    review_links: ["pa_a1_exit_canada_002", "pa_a1_proof_id_001"],
  },
];

export default punjabiA1RetentionBoosters;
