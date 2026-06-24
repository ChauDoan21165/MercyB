// Punjabi A1 politeness guards for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization supports recall. Native review is deferred.

export type PunjabiPolitenessGuardDomain =
  | "greeting"
  | "help"
  | "price"
  | "location"
  | "apology"
  | "thanks"
  | "repeat_request"
  | "service_counter";

export type PunjabiPolitenessGuardStyle =
  | "politeness_guard"
  | "final_safety"
  | "quality_check"
  | "export_readiness"
  | "regression_guard";

export type PunjabiPolitenessGuardA1 = {
  id: string;
  domain: PunjabiPolitenessGuardDomain;
  style: PunjabiPolitenessGuardStyle;
  prompt_vi: string;
  prompt_en: string;
  cue_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  answer_pa: string;
  answer_hint_vi: string;
  answer_hint_en: string;
  why_it_works_vi: string;
  why_it_works_en: string;
  trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: boolean;
  review_links: string[];
};

export const politenessGuardsScriptAwareness =
  "Gurmukhi is the primary script for these Punjabi A1 politeness guards. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1PolitenessGuards: PunjabiPolitenessGuardA1[] = [
  {
    id: "pa_a1_guard_greeting_001",
    domain: "greeting",
    style: "politeness_guard",
    prompt_vi: "Nhớ một lời chào mở đầu lịch sự.",
    prompt_en: "Recall one polite opening greeting.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    romanization: "sat sri akal",
    meaning_vi: "Xin chào.",
    meaning_en: "Hello.",
    answer_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    answer_hint_vi: "Dùng khi bắt đầu nói chuyện.",
    answer_hint_en: "Use it to begin an interaction.",
    why_it_works_vi: "Một lời chào đúng giúp câu chuyện đi vào quỹ đạo lịch sự.",
    why_it_works_en: "A correct greeting puts the interaction on a polite track.",
    trap: { audience: "vi", vi: "Đừng kéo dài âm cuối của ਸਤ.", en: "Do not add an extra ending sound to ਸਤ." },
    canada_practical: true,
    review_links: ["pa_a1_review_greeting_001", "pa_a1_booster_greeting_001"],
  },
  {
    id: "pa_a1_guard_help_001",
    domain: "help",
    style: "final_safety",
    prompt_vi: "Nhớ cách xin giúp một cách an toàn.",
    prompt_en: "Recall a safe way to ask for help.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    romanization: "kirpa karke madad karo",
    meaning_vi: "Làm ơn giúp tôi.",
    meaning_en: "Please help me.",
    answer_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    answer_hint_vi: "Giữ cụm lịch sự ở đầu câu.",
    answer_hint_en: "Keep the polite phrase at the start.",
    why_it_works_vi: "Đây là câu cứu nguy khi người học bị kẹt.",
    why_it_works_en: "This is the rescue line when the learner gets stuck.",
    trap: { audience: "both", vi: "Đừng chỉ nói 'help' bằng tiếng Anh.", en: "Do not rely on English 'help' alone." },
    canada_practical: true,
    review_links: ["pa_a1_review_help_001", "pa_a1_booster_help_001"],
  },
  {
    id: "pa_a1_guard_price_001",
    domain: "price",
    style: "quality_check",
    prompt_vi: "Hỏi giá một cách ngắn gọn.",
    prompt_en: "Ask the price in a short way.",
    cue_pa: "ਇਹ ਕਿੰਨਾ ਹੈ?",
    romanization: "ih kinna hai?",
    meaning_vi: "Cái này bao nhiêu?",
    meaning_en: "How much is this?",
    answer_pa: "ਇਹ ਕਿੰਨਾ ਹੈ?",
    answer_hint_vi: "Dùng khi xem giá ở cửa hàng hoặc quầy dịch vụ.",
    answer_hint_en: "Use it when checking prices in a shop or at service counters.",
    why_it_works_vi: "Hỏi giá ngắn gọn là kỹ năng sống còn ở A1.",
    why_it_works_en: "A short price question is survival language at A1.",
    trap: { audience: "en", vi: "Đừng theo mẫu 'how much this is' của tiếng Anh.", en: "Do not copy the English word order." },
    canada_practical: true,
    review_links: ["pa_a1_review_numbers_001", "pa_a1_booster_numbers_001"],
  },
  {
    id: "pa_a1_guard_location_001",
    domain: "location",
    style: "export_readiness",
    prompt_vi: "Hỏi địa điểm một cách lịch sự.",
    prompt_en: "Ask for a location politely.",
    cue_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    romanization: "bas adda kithe hai?",
    meaning_vi: "Bến xe buýt ở đâu?",
    meaning_en: "Where is the bus stop?",
    answer_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    answer_hint_vi: "Câu hỏi vị trí dùng ਕਿੱਥੇ ਹੈ.",
    answer_hint_en: "A location question uses ਕਿੱਥੇ ਹੈ.",
    why_it_works_vi: "Câu này sẵn sàng cho thực tế xuất khẩu sang bài kiểm tra dịch vụ.",
    why_it_works_en: "This sentence is ready for real-world service checks.",
    trap: { audience: "both", vi: "Không đảo theo kiểu tiếng Anh.", en: "Do not invert it like English." },
    canada_practical: true,
    review_links: ["pa_a1_review_directions_001", "pa_a1_booster_directions_001"],
  },
  {
    id: "pa_a1_guard_apology_001",
    domain: "apology",
    style: "regression_guard",
    prompt_vi: "Nhớ một lời xin lỗi ngắn.",
    prompt_en: "Recall one short apology.",
    cue_pa: "ਮਾਫ਼ ਕਰਨਾ।",
    romanization: "maf karna",
    meaning_vi: "Xin lỗi.",
    meaning_en: "Sorry / excuse me.",
    answer_pa: "ਮਾਫ਼ ਕਰਨਾ।",
    answer_hint_vi: "Dùng khi bạn chen ngang hoặc cần mở lời.",
    answer_hint_en: "Use it when you interrupt or need to open politely.",
    why_it_works_vi: "Lời xin lỗi ngắn giúp cuộc trò chuyện không bị căng.",
    why_it_works_en: "A short apology keeps the interaction calm.",
    trap: { audience: "vi", vi: "Đừng biến nó thành câu dài.", en: "Do not turn it into a long sentence." },
    canada_practical: true,
    review_links: ["pa_a1_review_polite_001", "pa_a1_booster_politeness_001"],
  },
  {
    id: "pa_a1_guard_thanks_001",
    domain: "thanks",
    style: "final_safety",
    prompt_vi: "Nhớ một lời cảm ơn ngắn.",
    prompt_en: "Recall one short thanks.",
    cue_pa: "ਧੰਨਵਾਦ।",
    romanization: "dhanvad",
    meaning_vi: "Cảm ơn.",
    meaning_en: "Thank you.",
    answer_pa: "ਧੰਨਵਾਦ।",
    answer_hint_vi: "Dùng sau khi được giúp.",
    answer_hint_en: "Use it after receiving help.",
    why_it_works_vi: "Cảm ơn là lớp bảo vệ xã giao cơ bản.",
    why_it_works_en: "Thanks is a basic social safety layer.",
    trap: { audience: "both", vi: "Đừng quên nó sau khi được giúp.", en: "Do not forget it after being helped." },
    canada_practical: true,
    review_links: ["pa_a1_review_polite_001", "pa_a1_booster_politeness_001"],
  },
  {
    id: "pa_a1_guard_repeat_001",
    domain: "repeat_request",
    style: "quality_check",
    prompt_vi: "Xin người ta nói lại một cách lịch sự.",
    prompt_en: "Politely ask the person to repeat.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    romanization: "kirpa karke dubara kaho",
    meaning_vi: "Làm ơn nói lại.",
    meaning_en: "Please say that again.",
    answer_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    answer_hint_vi: "Giữ cụm ਦੁਬਾਰਾ kaho.",
    answer_hint_en: "Keep the phrase ਦੁਬਾਰਾ kaho.",
    why_it_works_vi: "Nếu không nghe rõ, câu này cứu cuộc hội thoại.",
    why_it_works_en: "If you did not hear clearly, this saves the conversation.",
    trap: { audience: "vi", vi: "Đừng im lặng khi nghe không kịp.", en: "Do not stay silent when you miss it." },
    canada_practical: true,
    review_links: ["pa_a1_review_polite_001", "pa_a1_booster_politeness_001"],
  },
  {
    id: "pa_a1_guard_service_001",
    domain: "service_counter",
    style: "export_readiness",
    prompt_vi: "Nhớ câu chào + nhu cầu đơn giản ở quầy dịch vụ.",
    prompt_en: "Recall greeting plus a simple need at a service counter.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "sat sri akal. mainu form chahida hai.",
    meaning_vi: "Xin chào. Tôi cần mẫu đơn.",
    meaning_en: "Hello. I need a form.",
    answer_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    answer_hint_vi: "Kết hợp chào hỏi với nhu cầu dịch vụ.",
    answer_hint_en: "Combine greeting with the service need.",
    why_it_works_vi: "Đây là mẫu rất thực tế cho quầy trường, phòng khám, và cơ quan ở Canada.",
    why_it_works_en: "This is practical for school, clinic, and office counters in Canada.",
    trap: { audience: "en", vi: "Đừng dịch từng chữ; giữ nguyên khung câu.", en: "Do not translate word-for-word; keep the sentence frame." },
    canada_practical: true,
    review_links: ["pa_a1_review_canada_001", "pa_a1_booster_canada_001"],
  },
  {
    id: "pa_a1_guard_gurmukhi_001",
    domain: "greeting",
    style: "regression_guard",
    prompt_vi: "Nhận ra từ sinh tồn bằng Gurmukhi.",
    prompt_en: "Recognize survival words in Gurmukhi.",
    cue_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    romanization: "pani, madad, bas, form",
    meaning_vi: "nước, giúp đỡ, xe buýt, mẫu đơn",
    meaning_en: "water, help, bus, form",
    answer_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    answer_hint_vi: "Nhìn chữ Gurmukhi trước romanization.",
    answer_hint_en: "Look at Gurmukhi before romanization.",
    why_it_works_vi: "Giảm lệ thuộc vào chữ Latin và tăng khả năng tự đọc.",
    why_it_works_en: "This reduces reliance on Latin letters and increases self-reading ability.",
    trap: { audience: "both", vi: "Romanization là hỗ trợ, không phải đáp án chính.", en: "Romanization is support, not the main answer." },
    canada_practical: true,
    review_links: ["pa_a1_review_gurmukhi_001", "pa_a1_booster_gurmukhi_001"],
  },
  {
    id: "pa_a1_guard_final_001",
    domain: "service_counter",
    style: "final_safety",
    prompt_vi: "Nhớ câu 'Tôi cần mẫu đơn' để không bị kẹt.",
    prompt_en: "Recall 'I need a form' so you do not get stuck.",
    cue_pa: "ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mainu form chahida hai",
    meaning_vi: "Tôi cần mẫu đơn.",
    meaning_en: "I need a form.",
    answer_pa: "ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    answer_hint_vi: "Giữ ਮੈਨੂੰ và ਚਾਹੀਦਾ ਹੈ.",
    answer_hint_en: "Keep ਮੈਨੂੰ and ਚਾਹੀਦਾ ਹੈ.",
    why_it_works_vi: "Mẫu này là câu an toàn cuối cùng cho quầy dịch vụ.",
    why_it_works_en: "This is the final safe line for service counters.",
    trap: { audience: "vi", vi: "Đừng chỉ nói 'form' một mình.", en: "Do not say only 'form' by itself." },
    canada_practical: true,
    review_links: ["pa_a1_review_canada_001", "pa_a1_booster_canada_001"],
  },
];

export default punjabiA1PolitenessGuards;
