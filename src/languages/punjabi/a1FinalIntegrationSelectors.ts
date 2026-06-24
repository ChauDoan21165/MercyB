// Punjabi A1 final integration selectors for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization supports recall. Native review is deferred.

export type PunjabiA1FinalIntegrationDomain =
  | "lesson_selection"
  | "micro_checkpoint_selection"
  | "politeness_guard_selection"
  | "retention_review_selection"
  | "service_counter_selection"
  | "gurmukhi_recognition_selection"
  | "canada_survival_selection";

export type PunjabiA1FinalIntegrationStyle =
  | "selector"
  | "pre_integration"
  | "final_readiness"
  | "handoff"
  | "quality_gate"
  | "regression";

export type PunjabiA1FinalIntegrationSelector = {
  id: string;
  domain: PunjabiA1FinalIntegrationDomain;
  style: PunjabiA1FinalIntegrationStyle;
  prompt_vi: string;
  prompt_en: string;
  cue_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  selector_pa: string;
  selector_hint_vi: string;
  selector_hint_en: string;
  why_selected_vi: string;
  why_selected_en: string;
  trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: boolean;
  review_links: string[];
};

export const finalIntegrationSelectorsScriptAwareness =
  "Gurmukhi is the primary script for these Punjabi A1 final integration selectors. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1FinalIntegrationSelectors: PunjabiA1FinalIntegrationSelector[] = [
  {
    id: "pa_a1_selector_lesson_001",
    domain: "lesson_selection",
    style: "selector",
    prompt_vi: "Chọn một bài học mở đầu phù hợp.",
    prompt_en: "Select one suitable opening lesson.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    romanization: "sat sri akal",
    meaning_vi: "Xin chào.",
    meaning_en: "Hello.",
    selector_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
    selector_hint_vi: "Bắt đầu bằng chào hỏi.",
    selector_hint_en: "Start with a greeting.",
    why_selected_vi: "Mọi lộ trình A1 đều nên có điểm vào chào hỏi trước.",
    why_selected_en: "Every A1 path should begin with a greeting entry point.",
    trap: { audience: "vi", vi: "Đừng khởi đầu bằng mẫu khó.", en: "Do not start with a hard pattern." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_greeting_001", "pa_a1_consistency_greeting_001"],
  },
  {
    id: "pa_a1_selector_micro_001",
    domain: "micro_checkpoint_selection",
    style: "pre_integration",
    prompt_vi: "Chọn một micro checkpoint về tên và giới thiệu.",
    prompt_en: "Select one micro checkpoint for names and introduction.",
    cue_pa: "ਮੇਰਾ ਨਾਮ ਆਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    romanization: "mera nam An hai. tuhada nam ki hai?",
    meaning_vi: "Tên tôi là An. Tên bạn là gì?",
    meaning_en: "My name is An. What is your name?",
    selector_pa: "ਮੇਰਾ ਨਾਮ ... / ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ",
    selector_hint_vi: "Giữ khung đơn giản và lặp lại.",
    selector_hint_en: "Keep the frame simple and repeatable.",
    why_selected_vi: "Tên là thử nghiệm nhanh cho khả năng vào hội thoại.",
    why_selected_en: "Names are a quick test for entering conversation.",
    trap: { audience: "both", vi: "Đừng đổi vị trí ਕੀ.", en: "Do not move ਕੀ." },
    review_links: ["pa_a1_checkpoint_identity_001", "pa_a1_consistency_identity_001"],
  },
  {
    id: "pa_a1_selector_family_001",
    domain: "lesson_selection",
    style: "selector",
    prompt_vi: "Chọn câu gia đình để giữ đủ ngữ cảnh A1.",
    prompt_en: "Select the family line that keeps A1 context complete.",
    cue_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ ਹੈ।",
    romanization: "ih meri man hai. mere kol ikk bhra hai.",
    meaning_vi: "Đây là mẹ tôi. Tôi có một anh/em trai.",
    meaning_en: "This is my mother. I have one brother.",
    selector_pa: "ਮੇਰੀ ਮਾਂ / ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ",
    selector_hint_vi: "Gia đình phải có cả người thân và sở hữu.",
    selector_hint_en: "Family needs both a person and possession.",
    why_selected_vi: "Bổ sung gia đình để bộ chọn không chỉ xoay quanh chào hỏi và dịch vụ.",
    why_selected_en: "This adds family so the selector set is not only greetings and service.",
    trap: { audience: "vi", vi: "Đừng bỏ ਕੋਲ.", en: "Do not drop ਕੋਲ." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_family_001", "pa_a1_consistency_family_001"],
  },
  {
    id: "pa_a1_selector_politeness_001",
    domain: "politeness_guard_selection",
    style: "final_readiness",
    prompt_vi: "Chọn cụm lịch sự để xin giúp.",
    prompt_en: "Select the polite phrase to ask for help.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    romanization: "kirpa karke madad karo",
    meaning_vi: "Làm ơn giúp tôi.",
    meaning_en: "Please help me.",
    selector_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ",
    selector_hint_vi: "Ưu tiên một câu cứu nguy thật ngắn.",
    selector_hint_en: "Prefer one very short rescue line.",
    why_selected_vi: "Bộ lọc này xác nhận người học có câu cứu nguy an toàn.",
    why_selected_en: "This filter confirms the learner has a safe rescue line.",
    trap: { audience: "both", vi: "Đừng dùng câu dài khi bí.", en: "Do not use a long sentence when stuck." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_help_001", "pa_a1_consistency_help_001"],
  },
  {
    id: "pa_a1_selector_repetition_001",
    domain: "retention_review_selection",
    style: "quality_gate",
    prompt_vi: "Chọn cụm nói lại khi không nghe rõ.",
    prompt_en: "Select the repeat phrase when you do not hear clearly.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    romanization: "kirpa karke dubara kaho",
    meaning_vi: "Làm ơn nói lại.",
    meaning_en: "Please say that again.",
    selector_pa: "ਦੁਬਾਰਾ ਕਹੋ",
    selector_hint_vi: "Từ khóa là ਦੁਬਾਰਾ.",
    selector_hint_en: "The keyword is ਦੁਬਾਰਾ.",
    why_selected_vi: "Người học cần giữ được câu lặp lại để không rớt nhịp.",
    why_selected_en: "The learner must keep the repeat request to avoid losing the thread.",
    trap: { audience: "vi", vi: "Đừng ngại xin nhắc lại.", en: "Do not hesitate to ask again." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_repeat_001", "pa_a1_consistency_repeat_001"],
  },
  {
    id: "pa_a1_selector_service_001",
    domain: "service_counter_selection",
    style: "handoff",
    prompt_vi: "Chọn câu cho quầy dịch vụ ở Canada.",
    prompt_en: "Select the line for a Canadian service counter.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ। ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ। ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    romanization: "sat sri akal. mainu form chahida hai. mainu pani chahida hai. bas adda kithe hai?",
    meaning_vi: "Xin chào. Tôi cần mẫu đơn. Tôi cần nước. Bến xe buýt ở đâu?",
    meaning_en: "Hello. I need a form. I need water. Where is the bus stop?",
    selector_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ + ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ + ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ + ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ",
    selector_hint_vi: "Kết hợp chào hỏi với nhu cầu.",
    selector_hint_en: "Combine greeting with need.",
    why_selected_vi: "Đây là mẫu handoff thực tế giữa lớp học và quầy dịch vụ, kèm nhu cầu nước.",
    why_selected_en: "This is a realistic handoff from class practice to a service counter, with a water need included.",
    trap: { audience: "en", vi: "Đừng dịch từng chữ.", en: "Do not translate word-for-word." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_service_001", "pa_a1_consistency_service_001"],
  },
  {
    id: "pa_a1_selector_gurmukhi_001",
    domain: "gurmukhi_recognition_selection",
    style: "pre_integration",
    prompt_vi: "Chọn tập từ Gurmukhi để đưa vào tích hợp.",
    prompt_en: "Select the Gurmukhi word set for integration.",
    cue_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    romanization: "pani, madad, bas, form",
    meaning_vi: "nước, giúp đỡ, xe buýt, mẫu đơn",
    meaning_en: "water, help, bus, form",
    selector_pa: "ਪਾਣੀ / ਮਦਦ / ਬੱਸ / ਫਾਰਮ",
    selector_hint_vi: "Script first, romanization second.",
    selector_hint_en: "Script first, romanization second.",
    why_selected_vi: "Tập chữ này đủ nhỏ để nhúng vào nhiều màn hình.",
    why_selected_en: "This small word set can be embedded across screens.",
    trap: { audience: "both", vi: "Romanization không thay cho chữ gốc.", en: "Romanization does not replace the original script." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_gurmukhi_001", "pa_a1_consistency_gurmukhi_001"],
  },
  {
    id: "pa_a1_selector_numbers_001",
    domain: "canada_survival_selection",
    style: "final_readiness",
    prompt_vi: "Chọn số và giá đã sẵn sàng tích hợp.",
    prompt_en: "Select numbers and prices ready for integration.",
    cue_pa: "ਦੋ ਟਿਕਟਾਂ। ਪੰਜ ਡਾਲਰ।",
    romanization: "do tiktan. panj dollar.",
    meaning_vi: "Hai vé. Năm đô la.",
    meaning_en: "Two tickets. Five dollars.",
    selector_pa: "ਦੋ / ਪੰਜ / ਡਾਲਰ",
    selector_hint_vi: "Giữ trong ngữ cảnh quầy vé hoặc cửa hàng.",
    selector_hint_en: "Keep it in a ticket-counter or shop context.",
    why_selected_vi: "Số và giá là tín hiệu rõ nhất cho các bài tích hợp sớm.",
    why_selected_en: "Numbers and prices are the clearest signals for early integration.",
    trap: { audience: "both", vi: "Đừng chỉ dựa vào chữ Latin.", en: "Do not rely only on Latin letters." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_numbers_001", "pa_a1_consistency_numbers_001"],
  },
  {
    id: "pa_a1_selector_review_001",
    domain: "retention_review_selection",
    style: "regression",
    prompt_vi: "Chọn câu ôn tập giữ nhịp cho người học.",
    prompt_en: "Select the review line that keeps the learner moving.",
    cue_pa: "ਮਾਫ਼ ਕਰਨਾ।",
    romanization: "maf karna",
    meaning_vi: "Xin lỗi.",
    meaning_en: "Sorry / excuse me.",
    selector_pa: "ਮਾਫ਼ ਕਰਨਾ",
    selector_hint_vi: "Dùng để mở lại cuộc thoại.",
    selector_hint_en: "Use it to reopen the conversation.",
    why_selected_vi: "Câu này làm đệm an toàn trong tích hợp nhiều màn hình.",
    why_selected_en: "This is a safe buffer phrase in multi-screen integration.",
    trap: { audience: "vi", vi: "Đừng biến nó thành câu dài.", en: "Do not turn it into a long sentence." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_politeness_001", "pa_a1_consistency_politeness_001"],
  },
  {
    id: "pa_a1_selector_final_001",
    domain: "canada_survival_selection",
    style: "final_readiness",
    prompt_vi: "Chọn câu mẫu sẵn sàng cho quầy dịch vụ.",
    prompt_en: "Select the sample line that is ready for a service counter.",
    cue_pa: "ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਪਛਾਣ ਹੈ?",
    romanization: "ki tuhade kol pachhan hai?",
    meaning_vi: "Bạn có giấy tờ tùy thân không?",
    meaning_en: "Do you have identification?",
    selector_pa: "ਕੀ ... ਪਛਾਣ ... ਹੈ?",
    selector_hint_vi: "Câu hỏi có/không mở bằng ਕੀ.",
    selector_hint_en: "A yes/no question starts with ਕੀ.",
    why_selected_vi: "Đây là kiểu câu thực tế cần dùng trong Canada.",
    why_selected_en: "This is the practical question type needed in Canada.",
    trap: { audience: "vi", vi: "Đừng nhầm với câu hỏi 'cái gì'.", en: "Do not confuse it with a 'what' question." },
    canada_practical: true,
    review_links: ["pa_a1_checkpoint_help_001", "pa_a1_consistency_service_001"],
  },
];

export default punjabiA1FinalIntegrationSelectors;
