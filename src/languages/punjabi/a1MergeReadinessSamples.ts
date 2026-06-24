// Punjabi A1 merge-readiness samples for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization supports recall. Native review is deferred.

export type PunjabiA1MergeReadinessDomain =
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

export type PunjabiA1MergeReadinessStyle =
  | "merge_readiness"
  | "final_regression"
  | "pre_integration"
  | "checkpoint"
  | "qa"
  | "selector";

export type PunjabiA1MergeReadinessSample = {
  id: string;
  domain: PunjabiA1MergeReadinessDomain;
  style: PunjabiA1MergeReadinessStyle;
  prompt_vi: string;
  prompt_en: string;
  cue_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  expected_pa: string;
  merge_hint_vi: string;
  merge_hint_en: string;
  why_merge_vi: string;
  why_merge_en: string;
  trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: boolean;
  review_links: string[];
};

export const mergeReadinessScriptAwareness =
  "Gurmukhi is the primary script for this Punjabi A1 merge-readiness set. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1MergeReadinessSamples: PunjabiA1MergeReadinessSample[] = [
  {
    id: "pa_a1_merge_greeting_001",
    domain: "greetings",
    style: "merge_readiness",
    prompt_vi: "Kiểm tra câu chào mở đầu trước khi merge.",
    prompt_en: "Check the opening greeting before merge.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    romanization: "sat sri akal",
    meaning_vi: "Xin chào.",
    meaning_en: "Hello.",
    expected_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    merge_hint_vi: "Giữ câu chào nguyên vẹn và ngắn.",
    merge_hint_en: "Keep the greeting intact and short.",
    why_merge_vi: "Câu chào là điểm vào chung cho nhiều bài A1.",
    why_merge_en: "The greeting is the shared entry point for many A1 lessons.",
    trap: { audience: "vi", vi: "Đừng thêm âm cuối kiểu tiếng Việt.", en: "Do not add a Vietnamese-style final sound." },
    canada_practical: true,
    review_links: ["pa_a1_regression_greeting_001", "pa_a1_handoff_greeting_001"],
  },
  {
    id: "pa_a1_merge_identity_001",
    domain: "identity",
    style: "qa",
    prompt_vi: "Xác nhận mẫu giới thiệu tên và hỏi lại tên.",
    prompt_en: "Confirm the name-introduction and name-question frame.",
    cue_pa: "ਮੇਰਾ ਨਾਮ ਆਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    romanization: "mera nam An hai. tuhada nam ki hai?",
    meaning_vi: "Tên tôi là An. Tên bạn là gì?",
    meaning_en: "My name is An. What is your name?",
    expected_pa: "ਮੇਰਾ ਨਾਮ ਆਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    merge_hint_vi: "Giữ ਮੇਰਾ ਨਾਮ ... ਹੈ và ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ.",
    merge_hint_en: "Keep ਮੇਰਾ ਨਾਮ ... ਹੈ and ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ.",
    why_merge_vi: "Tên nối phần chào với hội thoại dịch vụ.",
    why_merge_en: "Names connect greetings with service interactions.",
    trap: { audience: "both", vi: "Đừng bỏ ਹੈ ở câu giới thiệu.", en: "Do not drop ਹੈ in the introduction." },
    review_links: ["pa_a1_regression_identity_001", "pa_a1_handoff_identity_001"],
  },
  {
    id: "pa_a1_merge_family_001",
    domain: "family",
    style: "checkpoint",
    prompt_vi: "Kiểm tra mẫu gia đình và sở hữu đơn giản.",
    prompt_en: "Check the family and simple possession frame.",
    cue_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ ਹੈ।",
    romanization: "ih meri man hai. mere kol ikk bhra hai.",
    meaning_vi: "Đây là mẹ tôi. Tôi có một anh/em trai.",
    meaning_en: "This is my mother. I have one brother.",
    expected_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ ਹੈ।",
    merge_hint_vi: "ਮੇਰੀ đi với ਮਾਂ; ਮੇਰੇ ਕੋਲ dùng cho 'tôi có'.",
    merge_hint_en: "ਮੇਰੀ goes with ਮਾਂ; ਮੇਰੇ ਕੋਲ carries 'I have'.",
    why_merge_vi: "Gia đình kiểm tra chuyển đổi giữa nhận diện người và sở hữu.",
    why_merge_en: "Family checks movement between identifying a person and possession.",
    trap: { audience: "en", vi: "Đừng dùng một dạng ਮੇਰਾ cho mọi danh từ.", en: "Do not use one fixed ਮੇਰਾ form for every noun." },
    canada_practical: true,
    review_links: ["pa_a1_regression_family_001", "pa_a1_handoff_family_001"],
  },
  {
    id: "pa_a1_merge_numbers_001",
    domain: "numbers",
    style: "final_regression",
    prompt_vi: "Kiểm tra số lượng vé.",
    prompt_en: "Check the ticket quantity.",
    cue_pa: "ਦੋ ਟਿਕਟਾਂ।",
    romanization: "do tiktan",
    meaning_vi: "Hai vé.",
    meaning_en: "Two tickets.",
    expected_pa: "ਦੋ ਟਿਕਟਾਂ।",
    merge_hint_vi: "Đọc số trước danh từ.",
    merge_hint_en: "Read the number before the noun.",
    why_merge_vi: "Số là tín hiệu dễ vỡ khi nối với giá và dịch vụ.",
    why_merge_en: "Numbers are easy to break when linked with price and service lines.",
    trap: { audience: "both", vi: "Đừng chỉ học số bằng chữ Latin.", en: "Do not learn numbers only in Latin letters." },
    canada_practical: true,
    review_links: ["pa_a1_regression_numbers_001", "pa_a1_handoff_numbers_001"],
  },
  {
    id: "pa_a1_merge_prices_001",
    domain: "prices",
    style: "selector",
    prompt_vi: "Chọn cụm giá đủ rõ cho quầy dịch vụ.",
    prompt_en: "Select the clear price phrase for a service counter.",
    cue_pa: "ਪੰਜ ਡਾਲਰ।",
    romanization: "panj dollar",
    meaning_vi: "Năm đô la.",
    meaning_en: "Five dollars.",
    expected_pa: "ਪੰਜ ਡਾਲਰ।",
    merge_hint_vi: "Giữ số và đơn vị tiền trong cùng một cụm.",
    merge_hint_en: "Keep the number and currency unit in one phrase.",
    why_merge_vi: "Giá cần khớp với ngữ cảnh Canada-practical.",
    why_merge_en: "Prices need to align with Canada-practical contexts.",
    trap: { audience: "en", vi: "Đừng đảo trật tự theo tiếng Anh.", en: "Do not reorder it around English word order." },
    canada_practical: true,
    review_links: ["pa_a1_regression_prices_001", "pa_a1_handoff_numbers_001"],
  },
  {
    id: "pa_a1_merge_food_001",
    domain: "food",
    style: "pre_integration",
    prompt_vi: "Kiểm tra câu nhu cầu cơ bản về nước.",
    prompt_en: "Check the basic need line for water.",
    cue_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mainu pani chahida hai",
    meaning_vi: "Tôi cần nước.",
    meaning_en: "I need water.",
    expected_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    merge_hint_vi: "Giữ ਮੈਨੂੰ ở đầu và ਚਾਹੀਦਾ ਹੈ ở cuối.",
    merge_hint_en: "Keep ਮੈਨੂੰ at the start and ਚਾਹੀਦਾ ਹੈ at the end.",
    why_merge_vi: "Nhu cầu cơ bản phải nối được với xin giúp và lịch sự.",
    why_merge_en: "Basic needs must connect with help and politeness lines.",
    trap: { audience: "vi", vi: "Đừng bỏ chủ thể gián tiếp ਮੈਨੂੰ.", en: "Do not drop the indirect subject ਮੈਨੂੰ." },
    canada_practical: true,
    review_links: ["pa_a1_regression_food_001", "pa_a1_handoff_food_001"],
  },
  {
    id: "pa_a1_merge_directions_001",
    domain: "directions",
    style: "qa",
    prompt_vi: "Hỏi bến xe buýt ở đâu.",
    prompt_en: "Ask where the bus stop is.",
    cue_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    romanization: "bas adda kithe hai?",
    meaning_vi: "Bến xe buýt ở đâu?",
    meaning_en: "Where is the bus stop?",
    expected_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    merge_hint_vi: "Câu hỏi vị trí giữ ਕਿੱਥੇ ਹੈ ở cuối.",
    merge_hint_en: "The location question keeps ਕਿੱਥੇ ਹੈ at the end.",
    why_merge_vi: "Chỉ đường là cầu nối giữa nội dung lớp học và đời sống.",
    why_merge_en: "Directions bridge classroom content and daily life.",
    trap: { audience: "en", vi: "Đừng đặt ਕਿੱਥੇ ở đầu theo tiếng Anh.", en: "Do not place ਕਿੱਥੇ first just because English does." },
    canada_practical: true,
    review_links: ["pa_a1_regression_directions_001", "pa_a1_handoff_directions_001"],
  },
  {
    id: "pa_a1_merge_help_001",
    domain: "help",
    style: "checkpoint",
    prompt_vi: "Dùng câu xin giúp khi bị kẹt.",
    prompt_en: "Use the help request when stuck.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    romanization: "kirpa karke madad karo",
    meaning_vi: "Làm ơn giúp tôi.",
    meaning_en: "Please help me.",
    expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    merge_hint_vi: "Giữ câu cứu nguy ngắn để dễ nhớ.",
    merge_hint_en: "Keep the rescue line short so it is easy to recall.",
    why_merge_vi: "Câu xin giúp bảo vệ toàn bộ luồng hội thoại.",
    why_merge_en: "The help request protects the whole conversation flow.",
    trap: { audience: "both", vi: "Đừng chuyển ngay sang tiếng Anh nếu có thể dùng câu này.", en: "Do not switch straight to English if this line works." },
    canada_practical: true,
    review_links: ["pa_a1_regression_help_001", "pa_a1_handoff_help_001"],
  },
  {
    id: "pa_a1_merge_repetition_001",
    domain: "repetition",
    style: "merge_readiness",
    prompt_vi: "Xin người kia nói lại.",
    prompt_en: "Ask the other person to repeat.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    romanization: "kirpa karke dubara kaho",
    meaning_vi: "Làm ơn nói lại.",
    meaning_en: "Please say that again.",
    expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    merge_hint_vi: "Dùng sau khi nghe không rõ số, giá, hoặc chỉ đường.",
    merge_hint_en: "Use after missing a number, price, or direction.",
    why_merge_vi: "Câu lặp lại làm các mục không đứng riêng lẻ.",
    why_merge_en: "The repetition line keeps the items from being isolated.",
    trap: { audience: "vi", vi: "Đừng im lặng khi không nghe rõ.", en: "Do not stay silent when you miss something." },
    canada_practical: true,
    review_links: ["pa_a1_regression_repetition_001", "pa_a1_handoff_retention_001"],
  },
  {
    id: "pa_a1_merge_politeness_001",
    domain: "politeness",
    style: "final_regression",
    prompt_vi: "Kết thúc tương tác bằng lời cảm ơn.",
    prompt_en: "Close the interaction with thanks.",
    cue_pa: "ਧੰਨਵਾਦ।",
    romanization: "dhanvad",
    meaning_vi: "Cảm ơn.",
    meaning_en: "Thank you.",
    expected_pa: "ਧੰਨਵਾਦ।",
    merge_hint_vi: "Dùng ngay sau khi nhận thông tin hoặc trợ giúp.",
    merge_hint_en: "Use right after receiving information or help.",
    why_merge_vi: "Lịch sự giúp các mẫu dịch vụ nghe tự nhiên hơn.",
    why_merge_en: "Politeness makes service patterns sound more natural.",
    trap: { audience: "both", vi: "Đừng bỏ lời cảm ơn ở cuối lượt.", en: "Do not skip thanks at the end of the turn." },
    canada_practical: true,
    review_links: ["pa_a1_regression_politeness_001", "pa_a1_handoff_politeness_001"],
  },
  {
    id: "pa_a1_merge_gurmukhi_001",
    domain: "gurmukhi_recognition",
    style: "selector",
    prompt_vi: "Nhận diện nhóm chữ Gurmukhi dùng nhiều.",
    prompt_en: "Recognize the high-use Gurmukhi word group.",
    cue_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    romanization: "pani, madad, bas, form",
    meaning_vi: "nước, giúp đỡ, xe buýt, mẫu đơn",
    meaning_en: "water, help, bus, form",
    expected_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    merge_hint_vi: "Đọc chữ Gurmukhi trước romanization.",
    merge_hint_en: "Read the Gurmukhi before the romanization.",
    why_merge_vi: "Nhận diện chữ giúp dữ liệu sẵn sàng cho nhập vào app.",
    why_merge_en: "Script recognition helps the data stay ready for app import.",
    trap: { audience: "both", vi: "Romanization chỉ là cầu nối, không phải mục tiêu chính.", en: "Romanization is a bridge, not the main target." },
    canada_practical: true,
    review_links: ["pa_a1_regression_gurmukhi_001", "pa_a1_handoff_gurmukhi_001"],
  },
  {
    id: "pa_a1_merge_canada_service_001",
    domain: "canada_service",
    style: "pre_integration",
    prompt_vi: "Chuẩn bị câu ở quầy dịch vụ Canada.",
    prompt_en: "Prepare a line for a Canada service counter.",
    cue_pa: "ਮੇਰੇ ਕੋਲ ਪਛਾਣ ਹੈ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mere kol pachhan hai. mainu form chahida hai.",
    meaning_vi: "Tôi có giấy tờ tùy thân. Tôi cần mẫu đơn.",
    meaning_en: "I have ID. I need a form.",
    expected_pa: "ਮੇਰੇ ਕੋਲ ਪਛਾਣ ਹੈ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    merge_hint_vi: "Nối 'tôi có' với 'tôi cần' trong cùng bối cảnh.",
    merge_hint_en: "Connect 'I have' with 'I need' in the same context.",
    why_merge_vi: "Đây là kiểm tra trước merge cho tình huống dịch vụ thực tế.",
    why_merge_en: "This is a pre-merge check for practical service situations.",
    trap: { audience: "both", vi: "Đừng biến câu này thành bài nâng cao về giấy tờ.", en: "Do not turn this into an advanced document lesson." },
    canada_practical: true,
    review_links: ["pa_a1_regression_canada_service_001", "pa_a1_handoff_service_001"],
  },
];

export default punjabiA1MergeReadinessSamples;
