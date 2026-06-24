// Punjabi A1 cross-check samples for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization supports recall. Native review is deferred.

export type PunjabiA1CrossCheckDomain =
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
  | "romanization_bridge"
  | "canada_service";

export type PunjabiA1CrossCheckStyle =
  | "cross_check"
  | "verification"
  | "pre_integration"
  | "connected_set"
  | "qa"
  | "selector";

export type PunjabiA1CrossCheckSample = {
  id: string;
  domain: PunjabiA1CrossCheckDomain;
  style: PunjabiA1CrossCheckStyle;
  prompt_vi: string;
  prompt_en: string;
  cue_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  expected_pa: string;
  cross_check_vi: string;
  cross_check_en: string;
  why_connected_vi: string;
  why_connected_en: string;
  trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: boolean;
  review_links: string[];
};

export const crossCheckScriptAwareness =
  "Gurmukhi is the primary script for this Punjabi A1 cross-check set. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1CrossCheckSamples: PunjabiA1CrossCheckSample[] = [
  {
    id: "pa_a1_cross_greeting_001",
    domain: "greetings",
    style: "cross_check",
    prompt_vi: "Mở chuỗi kiểm tra bằng câu chào ổn định.",
    prompt_en: "Open the check sequence with a stable greeting.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    romanization: "sat sri akal",
    meaning_vi: "Xin chào.",
    meaning_en: "Hello.",
    expected_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    cross_check_vi: "Câu này phải nối được sang hỏi tên.",
    cross_check_en: "This line must connect into asking names.",
    why_connected_vi: "Chào hỏi là điểm bắt đầu của bộ mẫu, không phải câu rời.",
    why_connected_en: "Greeting is the start of the sample set, not an isolated line.",
    trap: { audience: "vi", vi: "Đừng thêm âm cuối kiểu tiếng Việt.", en: "Do not add a Vietnamese-style final sound." },
    canada_practical: true,
    review_links: ["pa_a1_import_greeting_001", "pa_a1_merge_greeting_001"],
  },
  {
    id: "pa_a1_cross_identity_001",
    domain: "identity",
    style: "qa",
    prompt_vi: "Sau khi chào, giới thiệu tên và hỏi lại.",
    prompt_en: "After greeting, introduce your name and ask back.",
    cue_pa: "ਮੇਰਾ ਨਾਮ ਆਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    romanization: "mera nam An hai. tuhada nam ki hai?",
    meaning_vi: "Tên tôi là An. Tên bạn là gì?",
    meaning_en: "My name is An. What is your name?",
    expected_pa: "ਮੇਰਾ ਨਾਮ ਆਨ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    cross_check_vi: "Kiểm tra câu chào chuyển sang nhận diện người.",
    cross_check_en: "Check that greeting flows into identifying people.",
    why_connected_vi: "Tên giúp mở các mẫu gia đình và dịch vụ.",
    why_connected_en: "Names open the family and service patterns.",
    trap: { audience: "both", vi: "Đừng bỏ ਹੈ ở câu giới thiệu.", en: "Do not drop ਹੈ in the introduction." },
    review_links: ["pa_a1_import_identity_001", "pa_a1_merge_identity_001"],
  },
  {
    id: "pa_a1_cross_family_001",
    domain: "family",
    style: "connected_set",
    prompt_vi: "Nối giới thiệu người với mẫu gia đình.",
    prompt_en: "Connect identifying a person with the family pattern.",
    cue_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ ਹੈ।",
    romanization: "ih meri man hai. mere kol ikk bhra hai.",
    meaning_vi: "Đây là mẹ tôi. Tôi có một anh/em trai.",
    meaning_en: "This is my mother. I have one brother.",
    expected_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭਰਾ ਹੈ।",
    cross_check_vi: "Kiểm tra ਮੇਰੀ cho ਮਾਂ và ਮੇਰੇ ਕੋਲ cho 'tôi có'.",
    cross_check_en: "Check ਮੇਰੀ with ਮਾਂ and ਮੇਰੇ ਕੋਲ for 'I have'.",
    why_connected_vi: "Gia đình kiểm tra sở hữu trước khi sang số lượng.",
    why_connected_en: "Family checks possession before moving into quantity.",
    trap: { audience: "en", vi: "Đừng dùng một dạng ਮੇਰਾ cho mọi danh từ.", en: "Do not use one fixed ਮੇਰਾ form for every noun." },
    canada_practical: true,
    review_links: ["pa_a1_import_family_001", "pa_a1_merge_family_001"],
  },
  {
    id: "pa_a1_cross_numbers_001",
    domain: "numbers",
    style: "verification",
    prompt_vi: "Kiểm tra số trước khi nối sang giá.",
    prompt_en: "Check the number before linking it to a price.",
    cue_pa: "ਦੋ ਟਿਕਟਾਂ।",
    romanization: "do tiktan",
    meaning_vi: "Hai vé.",
    meaning_en: "Two tickets.",
    expected_pa: "ਦੋ ਟਿਕਟਾਂ।",
    cross_check_vi: "Số lượng phải đọc được trong ngữ cảnh vé.",
    cross_check_en: "The quantity must read correctly in a ticket context.",
    why_connected_vi: "Số là nền cho giá và quầy dịch vụ.",
    why_connected_en: "Numbers support prices and service counters.",
    trap: { audience: "both", vi: "Đừng chỉ học số bằng chữ Latin.", en: "Do not learn numbers only through Latin letters." },
    canada_practical: true,
    review_links: ["pa_a1_import_numbers_001", "pa_a1_merge_numbers_001"],
  },
  {
    id: "pa_a1_cross_prices_001",
    domain: "prices",
    style: "selector",
    prompt_vi: "Nối số với giá ngắn.",
    prompt_en: "Connect the number with a short price phrase.",
    cue_pa: "ਪੰਜ ਡਾਲਰ।",
    romanization: "panj dollar",
    meaning_vi: "Năm đô la.",
    meaning_en: "Five dollars.",
    expected_pa: "ਪੰਜ ਡਾਲਰ।",
    cross_check_vi: "Giá phải giữ số và đơn vị tiền rõ ràng.",
    cross_check_en: "The price must keep the number and currency unit clear.",
    why_connected_vi: "Giá đưa số vào tình huống Canada-practical.",
    why_connected_en: "Prices put numbers into Canada-practical situations.",
    trap: { audience: "en", vi: "Đừng đảo trật tự theo câu tiếng Anh.", en: "Do not reorder it like an English sentence." },
    canada_practical: true,
    review_links: ["pa_a1_import_prices_001", "pa_a1_merge_prices_001"],
  },
  {
    id: "pa_a1_cross_food_001",
    domain: "food",
    style: "pre_integration",
    prompt_vi: "Kiểm tra câu nhu cầu sau giá và số.",
    prompt_en: "Check the need line after prices and numbers.",
    cue_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mainu pani chahida hai",
    meaning_vi: "Tôi cần nước.",
    meaning_en: "I need water.",
    expected_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।",
    cross_check_vi: "Mẫu ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ phải giữ nguyên.",
    cross_check_en: "The ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ frame must stay intact.",
    why_connected_vi: "Nhu cầu cơ bản nối sang xin giúp.",
    why_connected_en: "Basic needs connect into help requests.",
    trap: { audience: "vi", vi: "Đừng bỏ ਮੈਨੂੰ vì tiếng Việt có thể lược chủ ngữ.", en: "Do not drop ਮੈਨੂੰ because Vietnamese can omit subjects." },
    canada_practical: true,
    review_links: ["pa_a1_import_food_001", "pa_a1_merge_food_001"],
  },
  {
    id: "pa_a1_cross_directions_001",
    domain: "directions",
    style: "qa",
    prompt_vi: "Kiểm tra câu hỏi đường đi trong cùng bộ mẫu.",
    prompt_en: "Check the direction question inside the same sample set.",
    cue_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    romanization: "bas adda kithe hai?",
    meaning_vi: "Bến xe buýt ở đâu?",
    meaning_en: "Where is the bus stop?",
    expected_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?",
    cross_check_vi: "ਕਿੱਥੇ ਹੈ phải nằm trong câu hỏi vị trí.",
    cross_check_en: "ਕਿੱਥੇ ਹੈ must stay in the location question.",
    why_connected_vi: "Chỉ đường nối các mẫu lớp học với đời sống Canada.",
    why_connected_en: "Directions connect classroom patterns to daily life in Canada.",
    trap: { audience: "en", vi: "Đừng đặt từ hỏi lên đầu theo tiếng Anh.", en: "Do not move the question word to the front like English." },
    canada_practical: true,
    review_links: ["pa_a1_import_directions_001", "pa_a1_merge_directions_001"],
  },
  {
    id: "pa_a1_cross_help_001",
    domain: "help",
    style: "verification",
    prompt_vi: "Khi không xử lý được, xin giúp bằng câu ngắn.",
    prompt_en: "When stuck, ask for help with a short line.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    romanization: "kirpa karke madad karo",
    meaning_vi: "Làm ơn giúp tôi.",
    meaning_en: "Please help me.",
    expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    cross_check_vi: "Câu này phải dùng được sau nhu cầu hoặc chỉ đường.",
    cross_check_en: "This line must work after a need or direction question.",
    why_connected_vi: "Xin giúp giữ chuỗi hội thoại không bị đứt.",
    why_connected_en: "Asking for help keeps the conversation from breaking.",
    trap: { audience: "both", vi: "Đừng thay bằng ghi chú tiếng Anh.", en: "Do not replace it with an English note." },
    canada_practical: true,
    review_links: ["pa_a1_import_help_001", "pa_a1_merge_help_001"],
  },
  {
    id: "pa_a1_cross_repetition_001",
    domain: "repetition",
    style: "cross_check",
    prompt_vi: "Nếu nghe thiếu số, giá, hoặc hướng đi, xin nói lại.",
    prompt_en: "If you miss a number, price, or direction, ask for repetition.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    romanization: "kirpa karke dubara kaho",
    meaning_vi: "Làm ơn nói lại.",
    meaning_en: "Please say that again.",
    expected_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    cross_check_vi: "Câu lặp lại phải nối được với mọi tình huống trước đó.",
    cross_check_en: "The repetition line must connect to every earlier situation.",
    why_connected_vi: "Nó biến bộ mẫu thành một chuỗi xử lý lỗi.",
    why_connected_en: "It turns the set into an error-recovery sequence.",
    trap: { audience: "vi", vi: "Đừng im lặng khi không nghe rõ.", en: "Do not stay silent when you miss something." },
    canada_practical: true,
    review_links: ["pa_a1_import_repetition_001", "pa_a1_merge_repetition_001"],
  },
  {
    id: "pa_a1_cross_politeness_001",
    domain: "politeness",
    style: "verification",
    prompt_vi: "Sau khi được giúp, cảm ơn ngắn gọn.",
    prompt_en: "After receiving help, say thanks briefly.",
    cue_pa: "ਧੰਨਵਾਦ।",
    romanization: "dhanvad",
    meaning_vi: "Cảm ơn.",
    meaning_en: "Thank you.",
    expected_pa: "ਧੰਨਵਾਦ।",
    cross_check_vi: "Lời cảm ơn đóng chuỗi dịch vụ một cách tự nhiên.",
    cross_check_en: "Thanks close the service sequence naturally.",
    why_connected_vi: "Lịch sự xác nhận bộ mẫu có mở và kết.",
    why_connected_en: "Politeness confirms the set has an opening and a close.",
    trap: { audience: "both", vi: "Đừng bỏ lời cảm ơn khỏi lượt cuối.", en: "Do not remove thanks from the final turn." },
    canada_practical: true,
    review_links: ["pa_a1_import_politeness_001", "pa_a1_merge_politeness_001"],
  },
  {
    id: "pa_a1_cross_gurmukhi_001",
    domain: "gurmukhi_recognition",
    style: "selector",
    prompt_vi: "Nhận diện các từ Gurmukhi xuất hiện trong nhiều tình huống.",
    prompt_en: "Recognize Gurmukhi words that recur across situations.",
    cue_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    romanization: "pani, madad, bas, form",
    meaning_vi: "nước, giúp đỡ, xe buýt, mẫu đơn",
    meaning_en: "water, help, bus, form",
    expected_pa: "ਪਾਣੀ, ਮਦਦ, ਬੱਸ, ਫਾਰਮ",
    cross_check_vi: "Đọc chữ gốc trước rồi mới dùng romanization.",
    cross_check_en: "Read the original script first, then use romanization.",
    why_connected_vi: "Nhận diện chữ giúp các dòng không phụ thuộc Latin.",
    why_connected_en: "Script recognition keeps the lines from depending on Latin text.",
    trap: { audience: "both", vi: "Romanization là cầu nối, không thay thế Gurmukhi.", en: "Romanization is a bridge, not a replacement for Gurmukhi." },
    canada_practical: true,
    review_links: ["pa_a1_import_gurmukhi_001", "pa_a1_merge_gurmukhi_001"],
  },
  {
    id: "pa_a1_cross_romanization_001",
    domain: "romanization_bridge",
    style: "pre_integration",
    prompt_vi: "Dùng romanization để kiểm tra lại chữ Gurmukhi.",
    prompt_en: "Use romanization to cross-check the Gurmukhi.",
    cue_pa: "ਮਦਦ",
    romanization: "madad",
    meaning_vi: "giúp đỡ",
    meaning_en: "help",
    expected_pa: "ਮਦਦ",
    cross_check_vi: "Romanization hỗ trợ âm, nhưng đáp án vẫn là Gurmukhi.",
    cross_check_en: "Romanization supports sound, but the answer remains Gurmukhi.",
    why_connected_vi: "Cầu nối romanization giúp kiểm tra import và nhận diện chữ.",
    why_connected_en: "The romanization bridge checks import and script recognition together.",
    trap: { audience: "both", vi: "Đừng để romanization thành nội dung chính.", en: "Do not let romanization become the main content." },
    review_links: ["pa_a1_import_romanization_001", "pa_a1_import_gurmukhi_001"],
  },
  {
    id: "pa_a1_cross_canada_service_001",
    domain: "canada_service",
    style: "connected_set",
    prompt_vi: "Kết nối nhận diện, nhu cầu và quầy dịch vụ Canada.",
    prompt_en: "Connect identity, need, and a Canada service counter.",
    cue_pa: "ਮੇਰੇ ਕੋਲ ਪਛਾਣ ਹੈ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mere kol pachhan hai. mainu form chahida hai.",
    meaning_vi: "Tôi có giấy tờ tùy thân. Tôi cần mẫu đơn.",
    meaning_en: "I have ID. I need a form.",
    expected_pa: "ਮੇਰੇ ਕੋਲ ਪਛਾਣ ਹੈ। ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    cross_check_vi: "Nối ਮੇਰੇ ਕੋਲ với ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ trong cùng tình huống.",
    cross_check_en: "Connect ਮੇਰੇ ਕੋਲ with ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ in one situation.",
    why_connected_vi: "Đây là mẫu xác nhận cả bộ chạy như một chuỗi thực tế.",
    why_connected_en: "This confirms the set works as one practical sequence.",
    trap: { audience: "both", vi: "Đừng biến thành bài pháp lý hoặc giấy tờ nâng cao.", en: "Do not turn this into a legal or advanced document lesson." },
    canada_practical: true,
    review_links: ["pa_a1_import_canada_service_001", "pa_a1_merge_canada_service_001"],
  },
];

export default punjabiA1CrossCheckSamples;
