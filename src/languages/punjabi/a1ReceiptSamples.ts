// Punjabi A1 receipt samples for Vietnamese-speaking and English-speaking
// learners.
// Gurmukhi is primary; romanization supports recognition. Shahmukhi is
// awareness only, not a full course. Native review is deferred.

export type PunjabiA1ReceiptDomain =
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
  | "canada_service_counter";

export type PunjabiA1ReceiptStyle =
  | "pre_a11_receipt"
  | "ledger_entry"
  | "archive_copy"
  | "pre_merge"
  | "pre_integration"
  | "qa"
  | "readiness_check";

export type PunjabiA1ReceiptSample = {
  id: string;
  domain: PunjabiA1ReceiptDomain;
  style: PunjabiA1ReceiptStyle;
  prompt_vi: string;
  prompt_en: string;
  cue_pa: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  receipt_check_vi: string;
  receipt_check_en: string;
  preservation_vi: string;
  preservation_en: string;
  trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: string;
  review_links: string[];
};

export const receiptScriptAwareness =
  "Gurmukhi is the primary script for this Punjabi A1 receipt set. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1ReceiptSamples: PunjabiA1ReceiptSample[] = [
  {
    id: "pa_a1_receipt_greeting_001",
    domain: "greetings",
    style: "pre_a11_receipt",
    prompt_vi: "Lưu mẫu câu chào gốc cho receipt.",
    prompt_en: "Archive the core greeting sample.",
    cue_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    romanization: "sat sri akal",
    meaning_vi: "Xin chào.",
    meaning_en: "Hello.",
    receipt_check_vi: "Mẫu chào phải giữ Gurmukhi làm nội dung chính.",
    receipt_check_en: "The greeting sample must keep Gurmukhi as the primary content.",
    preservation_vi: "Giữ câu chào đơn giản để dùng lại trong A11 sau này.",
    preservation_en: "Keep the greeting simple so it can be reused in later A11.",
    trap: { audience: "vi", vi: "Đừng thêm âm cuối kiểu tiếng Việt.", en: "Do not add a Vietnamese-style final sound." },
    canada_practical: "Use at a Canadian service desk, store, or school office.",
    review_links: ["pa_a1_receipt_identity_001", "pa_a1_receipt_help_001"],
  },
  {
    id: "pa_a1_receipt_identity_001",
    domain: "identity",
    style: "ledger_entry",
    prompt_vi: "Ghi lại mẫu giới thiệu tên và hỏi tên.",
    prompt_en: "Ledger the name introduction and name question.",
    cue_pa: "ਮੇਰਾ ਨਾਮ ਲਿਨ੍ਹ ਹੈ। ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?",
    romanization: "mera nam Linh hai. tuhada nam ki hai?",
    meaning_vi: "Tên tôi là Linh. Tên bạn là gì?",
    meaning_en: "My name is Linh. What is your name?",
    receipt_check_vi: "Mẫu ਮੇਰਾ ਨਾਮ ... ਹੈ phải còn nguyên trước khi hỏi lại.",
    receipt_check_en: "The ਮੇਰਾ ਨਾਮ ... ਹੈ frame must stay intact before asking back.",
    preservation_vi: "Lưu bản này để học giới thiệu bản thân ở mức A1.",
    preservation_en: "Archive this for A1 self-introduction practice.",
    trap: { audience: "both", vi: "Đừng dịch từng chữ theo trật tự English.", en: "Do not translate word by word in English order." },
    canada_practical: "Useful when introducing yourself at a Canadian clinic or class.",
    review_links: ["pa_a1_receipt_greeting_001", "pa_a1_receipt_family_001"],
  },
  {
    id: "pa_a1_receipt_family_001",
    domain: "family",
    style: "archive_copy",
    prompt_vi: "Lưu mẫu nói về gia đình đơn giản.",
    prompt_en: "Archive a simple family sample.",
    cue_pa: "ਇਹ ਮੇਰੇ ਪਿਤਾ ਜੀ ਹਨ। ਮੇਰੇ ਕੋਲ ਇੱਕ ਭੈਣ ਹੈ।",
    romanization: "ih mere pita ji han. mere kol ikk bhain hai.",
    meaning_vi: "Đây là cha tôi. Tôi có một chị/em gái.",
    meaning_en: "This is my father. I have one sister.",
    receipt_check_vi: "Mẫu phải kiểm cả giới thiệu người thân và câu 'tôi có'.",
    receipt_check_en: "The sample must check both introducing a relative and an 'I have' line.",
    preservation_vi: "Giữ mẫu này để nối sang bài gia đình ở cấp cao hơn.",
    preservation_en: "Keep this sample for later family-topic expansion.",
    trap: { audience: "en", vi: "Đừng dùng một dạng sở hữu cho mọi danh từ.", en: "Do not use one possessive form for every noun." },
    review_links: ["pa_a1_receipt_identity_001", "pa_a1_receipt_numbers_001"],
  },
  {
    id: "pa_a1_receipt_numbers_001",
    domain: "numbers",
    style: "readiness_check",
    prompt_vi: "Kiểm tra số lượng trong câu vé.",
    prompt_en: "Read the quantity in the ticket line.",
    cue_pa: "ਤਿੰਨ ਟਿਕਟਾਂ।",
    romanization: "tinn tiktan",
    meaning_vi: "Ba vé.",
    meaning_en: "Three tickets.",
    receipt_check_vi: "Số phải đọc được bằng Gurmukhi trước khi nối với giá.",
    receipt_check_en: "The number must be readable in Gurmukhi before linking to prices.",
    preservation_vi: "Lưu số cơ bản để dùng lại trên hóa đơn và vé.",
    preservation_en: "Archive core numbers for reuse on receipts and tickets.",
    trap: { audience: "both", vi: "Đừng học số chỉ qua romanization.", en: "Do not learn numbers only through romanization." },
    canada_practical: "At a Canadian ticket booth or transit counter, this helps confirm quantity.",
    review_links: ["pa_a1_receipt_prices_001", "pa_a1_receipt_directions_001"],
  },
  {
    id: "pa_a1_receipt_prices_001",
    domain: "prices",
    style: "qa",
    prompt_vi: "Lưu câu hỏi giá ngắn cho quầy.",
    prompt_en: "Archive the short price question for a counter.",
    cue_pa: "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?",
    romanization: "ih kinne da hai?",
    meaning_vi: "Cái này giá bao nhiêu?",
    meaning_en: "How much is this?",
    receipt_check_vi: "Câu giá phải dùng được ở quầy hoặc cửa hàng Canada.",
    receipt_check_en: "The price question must work at a Canadian counter or shop.",
    preservation_vi: "Giữ mẫu này để hỏi giá mà không cần câu dài.",
    preservation_en: "Keep this sample for asking price without a long sentence.",
    trap: { audience: "en", vi: "Đừng đổi trật tự câu sang kiểu English.", en: "Do not reorder it into English sentence order." },
    canada_practical: "Useful at a cashier, market stall, or transit kiosk in Canada.",
    review_links: ["pa_a1_receipt_numbers_001", "pa_a1_receipt_food_001"],
  },
  {
    id: "pa_a1_receipt_food_001",
    domain: "food",
    style: "pre_integration",
    prompt_vi: "Lưu câu nhu cầu đồ ăn/uống cơ bản.",
    prompt_en: "Archive the basic food or drink need line.",
    cue_pa: "ਮੈਨੂੰ ਚਾਹ ਚਾਹੀਦੀ ਹੈ।",
    romanization: "mainu cha chahidi hai",
    meaning_vi: "Tôi cần trà.",
    meaning_en: "I need tea.",
    receipt_check_vi: "Mẫu nhu cầu phải rõ chủ thể và vật cần.",
    receipt_check_en: "The need frame must clearly show who needs what.",
    preservation_vi: "Giữ khung 'mənu ... ਚਾਹੀਦੀ ਹੈ' cho các nhu cầu khác.",
    preservation_en: "Keep the 'mainu ... chahidi hai' frame for other needs.",
    trap: { audience: "vi", vi: "Đừng bỏ chủ ngữ khi lưu mẫu.", en: "Do not drop the subject when archiving the sample." },
    canada_practical: "Useful at a café, school lunch counter, or break room in Canada.",
    review_links: ["pa_a1_receipt_help_001", "pa_a1_receipt_politeness_001"],
  },
  {
    id: "pa_a1_receipt_directions_001",
    domain: "directions",
    style: "pre_merge",
    prompt_vi: "Ghi lại câu hỏi đường tới trạm xe buýt.",
    prompt_en: "Record the question for the bus stop direction.",
    cue_pa: "ਬੱਸ ਸਟਾਪ ਕਿੱਥੇ ਹੈ?",
    romanization: "bas stap kithe hai?",
    meaning_vi: "Trạm xe buýt ở đâu?",
    meaning_en: "Where is the bus stop?",
    receipt_check_vi: "Câu hỏi vị trí phải giữ ਕਿੱਥੇ ਹੈ ở cuối.",
    receipt_check_en: "The location question must keep ਕਿੱਥੇ ਹੈ at the end.",
    preservation_vi: "Dùng lại câu này cho chỉ đường ở Canada.",
    preservation_en: "Reuse this line for directions in Canada.",
    trap: { audience: "en", vi: "Đừng đặt 'where' ở đầu câu theo tiếng Anh.", en: "Do not move 'where' to the front like English." },
    canada_practical: "Ask at a Canadian bus stop, station, or campus information desk.",
    review_links: ["pa_a1_receipt_numbers_001", "pa_a1_receipt_help_001"],
  },
  {
    id: "pa_a1_receipt_help_001",
    domain: "help",
    style: "pre_a11_receipt",
    prompt_vi: "Đóng gói câu xin giúp khi bị kẹt.",
    prompt_en: "Package the help request for a stuck moment.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    romanization: "kirpa karke madad karo",
    meaning_vi: "Làm ơn giúp tôi.",
    meaning_en: "Please help me.",
    receipt_check_vi: "Đây là câu cứu nguy A1 và phải luôn có trong bản lưu.",
    receipt_check_en: "This is the A1 rescue line and should always remain in the archive.",
    preservation_vi: "Giữ nguyên để dùng trước khi chuyển sang tiếng Anh.",
    preservation_en: "Keep it intact for use before switching to English.",
    trap: { audience: "both", vi: "Đừng thay câu Punjabi bằng ghi chú tiếng Anh.", en: "Do not replace the Punjabi line with an English note." },
    canada_practical: "Use at a Canadian service counter, clinic desk, or transit station.",
    review_links: ["pa_a1_receipt_repetition_001", "pa_a1_receipt_politeness_001"],
  },
  {
    id: "pa_a1_receipt_repetition_001",
    domain: "repetition",
    style: "pre_integration",
    prompt_vi: "Lưu câu xin nhắc lại lịch sự.",
    prompt_en: "Archive the polite request to repeat.",
    cue_pa: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕਹੋ।",
    romanization: "kirpa karke dubara kaho",
    meaning_vi: "Làm ơn nói lại.",
    meaning_en: "Please say that again.",
    receipt_check_vi: "Câu này hỗ trợ khi nghe thiếu số, giá hoặc hướng dẫn.",
    receipt_check_en: "This supports missed numbers, prices, or directions.",
    preservation_vi: "Lưu câu này để dùng trước khi bỏ cuộc.",
    preservation_en: "Archive this so it can be used before giving up.",
    trap: { audience: "vi", vi: "Đừng im lặng khi không nghe rõ.", en: "Do not stay silent when you miss something." },
    canada_practical: "Handy at Canadian service desks, bus stops, and clinic reception.",
    review_links: ["pa_a1_receipt_prices_001", "pa_a1_receipt_directions_001"],
  },
  {
    id: "pa_a1_receipt_politeness_001",
    domain: "politeness",
    style: "qa",
    prompt_vi: "Lưu lượt lịch sự cuối cùng.",
    prompt_en: "Archive the final polite turn.",
    cue_pa: "ਧੰਨਵਾਦ ਜੀ।",
    romanization: "dhanvad ji",
    meaning_vi: "Cảm ơn ạ.",
    meaning_en: "Thank you politely.",
    receipt_check_vi: "Lịch sự phải còn trong luồng dịch vụ ngắn.",
    receipt_check_en: "Politeness should remain in the short service flow.",
    preservation_vi: "Giữ câu này để kết thúc tương tác lịch sự.",
    preservation_en: "Keep this for closing an interaction politely.",
    trap: { audience: "both", vi: "Đừng bỏ ਜੀ nếu muốn giữ sắc thái lịch sự.", en: "Do not drop ਜੀ if you want to keep the polite tone." },
    canada_practical: "Useful after talking to a Canadian cashier, receptionist, or staff member.",
    review_links: ["pa_a1_receipt_help_001", "pa_a1_receipt_gurmukhi_001"],
  },
  {
    id: "pa_a1_receipt_gurmukhi_001",
    domain: "gurmukhi_recognition",
    style: "readiness_check",
    prompt_vi: "Nhận diện chữ Gurmukhi cơ bản trong bộ lưu.",
    prompt_en: "Recognize basic Gurmukhi in the archive set.",
    cue_pa: "ਗੁਰਮੁਖੀ ਲਿਪੀ",
    romanization: "Gurmukhi lipi",
    meaning_vi: "chữ Gurmukhi",
    meaning_en: "Gurmukhi script",
    receipt_check_vi: "Bộ lưu phải giữ Gurmukhi làm chữ chính, không thay bằng Latin.",
    receipt_check_en: "The archive must keep Gurmukhi as the primary script, not replace it with Latin.",
    preservation_vi: "Giữ các chữ dễ nhớ để làm nền cho A1.",
    preservation_en: "Keep the basic letters as the A1 foundation.",
    trap: { audience: "both", vi: "Romanization chỉ là cầu nối.", en: "Romanization is only a bridge." },
    review_links: ["pa_a1_receipt_romanization_001", "pa_a1_receipt_identity_001"],
  },
  {
    id: "pa_a1_receipt_romanization_001",
    domain: "romanization_bridge",
    style: "ledger_entry",
    prompt_vi: "Ghi sổ cầu nối romanization nhưng chốt bằng Gurmukhi.",
    prompt_en: "Ledger the romanization bridge, but finalize with Gurmukhi.",
    cue_pa: "ਫਲ",
    romanization: "phal/fal",
    meaning_vi: "trái cây / quả",
    meaning_en: "fruit",
    receipt_check_vi: "Nếu thấy phal hoặc fal, phải chốt bằng ਫਲ.",
    receipt_check_en: "If you see phal or fal, you must finalize with ਫਲ.",
    preservation_vi: "Lưu romanization để tìm kiếm, không phải để thay thế chữ chính.",
    preservation_en: "Archive romanization for search, not as a replacement for the main script.",
    trap: { audience: "both", vi: "Phal/fal là cầu nối, không phải đáp án cuối.", en: "Phal/fal is a bridge, not the final answer." },
    review_links: ["pa_a1_receipt_gurmukhi_001", "pa_a1_receipt_directions_001"],
  },
  {
    id: "pa_a1_receipt_service_counter_001",
    domain: "canada_service_counter",
    style: "archive_copy",
    prompt_vi: "Lưu mẫu câu ở quầy dịch vụ Canada.",
    prompt_en: "Archive a Canadian service-counter sample.",
    cue_pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    romanization: "mainu ih form bharan vich madad chahidi hai.",
    meaning_vi: "Tôi cần giúp điền mẫu đơn này.",
    meaning_en: "I need help filling out this form.",
    receipt_check_vi: "Mẫu quầy phải dùng được ở trường, clinic, library hoặc public office.",
    receipt_check_en: "The counter sample must work at school, clinic, library, or a public office.",
    preservation_vi: "Giữ mẫu này cho các quầy dịch vụ Canada trước A11.",
    preservation_en: "Keep this sample for Canadian service desks before A11.",
    trap: { audience: "vi", vi: "Đừng chỉ đưa giấy mà không nói yêu cầu.", en: "Do not only hand over paper without stating the request." },
    canada_practical: "Useful at a Canadian school office, clinic desk, library, or city service counter.",
    review_links: ["pa_a1_receipt_help_001", "pa_a1_receipt_politeness_001"],
  },
];

export const punjabiA1ReceiptSamplesAlias = punjabiA1ReceiptSamples;

export default punjabiA1ReceiptSamplesAlias;
