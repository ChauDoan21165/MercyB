// src/data/profession-packs/customer-service/content.ts
//
// Lesson-shaped content for the customer-service profession pack.
// Third VN-diaspora work vertical after nail-tech (PR #169) and the
// in-flight restaurant pack — call centers, retail support, banking
// front-line, telecom support, e-commerce CS. ~50k Vietnamese-Americans
// in customer-facing roles.
//
// 50 lessons across 8 categories per the brief. Each lesson:
//
//   id                 customer_service_<slug> — forward-compatible
//                      with future room IDs in roomRegistry.
//   title_vi/title_en  bilingual title.
//   category           one of CUSTOMER_SERVICE_CATEGORIES.
//   sentences          4–6 short utterances, each with a Vietnamese
//                      gloss and the phoneme keys (light IPA-ish hints)
//                      Vietnamese learners commonly miss in CS English.
//   cultural_notes_vi  what's actually true on a US support desk —
//                      first-call resolution as a metric, AHT pressure,
//                      empathy phrases as policy not preference, the
//                      US norm that direct anger from customers is not
//                      personal attack.
//   tip_advice_vi      practical advice — when to escalate, reading
//                      a customer in 30 seconds, tone-matching without
//                      anger-matching.
//
// Authenticity: every line is voice that matches a real US call-center
// floor. Empathy phrases like "I completely understand your
// frustration" are written verbatim because that exact wording is what
// QA scoring rubrics reward — softening to "I get it" loses points.

export type CustomerServiceCategoryId =
  | "opening_verification"
  | "active_listening"
  | "de_escalation"
  | "policy_no_kindly"
  | "hold_transfer"
  | "confirm_followup"
  | "closing_satisfaction"
  | "specific_complaints";

export type CustomerServiceCategoryMeta = {
  id: CustomerServiceCategoryId;
  title_vi: string;
  title_en: string;
  expected_count: number;
};

export const CUSTOMER_SERVICE_CATEGORIES: ReadonlyArray<CustomerServiceCategoryMeta> = [
  {
    id: "opening_verification",
    title_vi: "Mở cuộc gọi và xác minh danh tính",
    title_en: "Opening calls and identity verification",
    expected_count: 5,
  },
  {
    id: "active_listening",
    title_vi: "Câu lắng nghe chủ động",
    title_en: "Active listening phrases",
    expected_count: 5,
  },
  {
    id: "de_escalation",
    title_vi: "Hạ nhiệt khách giận",
    title_en: "De-escalating angry customers",
    expected_count: 10,
  },
  {
    id: "policy_no_kindly",
    title_vi: "Giải thích chính sách / từ chối khéo",
    title_en: "Explaining policies / saying no kindly",
    expected_count: 10,
  },
  {
    id: "hold_transfer",
    title_vi: "Giữ máy và chuyển cuộc gọi",
    title_en: "Putting on hold and transferring",
    expected_count: 5,
  },
  {
    id: "confirm_followup",
    title_vi: "Xác nhận thao tác và follow-up",
    title_en: "Confirming actions and follow-ups",
    expected_count: 5,
  },
  {
    id: "closing_satisfaction",
    title_vi: "Kết thúc cuộc gọi và đảm bảo hài lòng",
    title_en: "Closing calls and ensuring satisfaction",
    expected_count: 5,
  },
  {
    id: "specific_complaints",
    title_vi: "Xử lý các loại phàn nàn cụ thể",
    title_en: "Handling specific complaint types",
    expected_count: 5,
  },
];

export type LessonSentence = {
  en: string;
  vi: string;
  /** Light IPA-ish phoneme keys VN learners struggle with on the phone, e.g. ["θ", "v/w", "r-final"]. */
  pronunciation_focus: string[];
};

export type CustomerServiceLesson = {
  id: string;
  category: CustomerServiceCategoryId;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  tip_advice_vi: string;
};

// ── 1. Opening calls and identity verification (5) ───────────────────────

const OPENING: CustomerServiceLesson[] = [
  {
    id: "customer_service_opening_standard_greeting",
    category: "opening_verification",
    title_vi: "Câu chào chuẩn đầu cuộc gọi",
    title_en: "Standard call opener",
    sentences: [
      { en: "Thank you for calling Brightline Wireless, this is Linh — how can I help you today?", vi: "Cảm ơn anh/chị đã gọi Brightline Wireless, em là Linh — em có thể giúp gì cho anh/chị hôm nay ạ?", pronunciation_focus: ["θ in 'thank'", "calling", "today"] },
      { en: "May I have your full name, please?", vi: "Cho em xin tên đầy đủ của anh/chị ạ?", pronunciation_focus: ["may", "full"] },
      { en: "And could you spell that for me?", vi: "Anh/chị đánh vần giúp em được không ạ?", pronunciation_focus: ["spell", "for"] },
      { en: "Thank you, give me just one moment to pull up your account.", vi: "Cảm ơn anh/chị, em mở tài khoản trong vài giây ạ.", pronunciation_focus: ["pull up", "account"] },
    ],
    cultural_notes_vi:
      "Câu mở chuẩn ở Mỹ luôn theo công thức: cảm ơn + tên công ty + tên agent + 'how can I help'. Khách Mỹ rất quen — bỏ một phần là cảm thấy lạ. Nhiều call center có QA chấm điểm theo đúng câu này.",
    tip_advice_vi:
      "Học đúng câu chào của công ty mình từ ngày đầu. QA nghe lại random calls và trừ điểm nếu thiếu. Điểm thấp = giảm shift, không lên lương.",
  },
  {
    id: "customer_service_opening_account_lookup",
    category: "opening_verification",
    title_vi: "Lấy số tài khoản",
    title_en: "Asking for the account number",
    sentences: [
      { en: "Could I get your account number to start?", vi: "Cho em xin số tài khoản trước ạ?", pronunciation_focus: ["account", "number"] },
      { en: "It's the ten-digit number on your bill.", vi: "Là số 10 chữ số trên hóa đơn ạ.", pronunciation_focus: ["ten-digit", "bill"] },
      { en: "Or I can look you up by phone number — whichever is easier.", vi: "Hoặc em tra theo số điện thoại — cách nào tiện cho anh/chị.", pronunciation_focus: ["whichever", "easier"] },
      { en: "Take your time.", vi: "Anh/chị cứ thư thả ạ.", pronunciation_focus: ["take", "time"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ thường không thuộc số tài khoản — đề nghị tra theo số điện thoại là chuẩn. Đừng thúc giục. 'Take your time' nghe lịch sự, làm khách bình tĩnh.",
    tip_advice_vi:
      "Hai phương án (account number HOẶC phone) tăng tốc xác minh. Đợi 1 phương án mà khách không có = mất 30 giây AHT (average handle time).",
  },
  {
    id: "customer_service_opening_identity_verification",
    category: "opening_verification",
    title_vi: "Xác minh danh tính",
    title_en: "Identity verification",
    sentences: [
      { en: "For verification, can you confirm the last four of the social on file?", vi: "Để xác minh, anh/chị xác nhận 4 số cuối SSN trong hồ sơ ạ?", pronunciation_focus: ["verification", "social"] },
      { en: "And the billing zip code, please.", vi: "Và mã zip địa chỉ thanh toán ạ.", pronunciation_focus: ["billing", "zip"] },
      { en: "Perfect — I have you verified.", vi: "Hoàn hảo — em đã xác minh xong ạ.", pronunciation_focus: ["perfect", "verified"] },
      { en: "How can I help you today?", vi: "Em giúp gì cho anh/chị hôm nay ạ?", pronunciation_focus: ["how", "today"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ rất quen với xác minh — đừng xin lỗi vì hỏi. 'For verification' là từ khóa kích hoạt sự hợp tác. Nếu không xác minh được, không được tiết lộ thông tin (compliance — bị fired nếu vi phạm).",
    tip_advice_vi:
      "Ba điều cần biết: (1) verification phải làm trước khi đọc/sửa thông tin; (2) khách verify sai 3 lần phải khóa account; (3) không bao giờ đọc lại số SSN/CC qua điện thoại — chỉ confirm yes/no.",
  },
  {
    id: "customer_service_opening_call_back_caller",
    category: "opening_verification",
    title_vi: "Khách gọi lại tiếp tục cuộc gọi cũ",
    title_en: "Customer calling back about an open ticket",
    sentences: [
      { en: "Do you have a reference or ticket number from your last call?", vi: "Anh/chị có số ticket lần trước không ạ?", pronunciation_focus: ["reference", "ticket"] },
      { en: "No problem if not — I can find it.", vi: "Không có cũng được, em tra cho ạ.", pronunciation_focus: ["problem", "find"] },
      { en: "I see notes from August twelfth — let me read through them quickly.", vi: "Em thấy ghi chú ngày 12 tháng 8 — em đọc qua nhanh ạ.", pronunciation_focus: ["notes", "through"] },
      { en: "Thanks for your patience while I get up to speed.", vi: "Cảm ơn anh/chị đã chờ em đọc qua ạ.", pronunciation_focus: ["patience", "speed"] },
    ],
    cultural_notes_vi:
      "Khách gọi lại thường bực vì phải kể lại. Đọc notes nhanh và nói 'I see what happened' trước khi hỏi gì giảm 50% bực bội ngay.",
    tip_advice_vi:
      "Đừng bao giờ hỏi 'Can you tell me what happened?' khi notes có sẵn. Câu đó là dấu hiệu điển hình của agent yếu — khách nghe xong sẽ đòi gặp supervisor.",
  },
  {
    id: "customer_service_opening_authorized_user",
    category: "opening_verification",
    title_vi: "Người không phải chủ tài khoản",
    title_en: "Caller is not the account holder",
    sentences: [
      { en: "I see — you're calling on behalf of your husband?", vi: "Em hiểu — anh/chị gọi giúp chồng/vợ ạ?", pronunciation_focus: ["behalf", "husband"] },
      { en: "Are you listed as an authorized user on the account?", vi: "Anh/chị có tên trong danh sách 'authorized user' không ạ?", pronunciation_focus: ["authorized", "user"] },
      { en: "Unfortunately, I can't share account details without that authorization.", vi: "Rất tiếc, em không được chia sẻ thông tin nếu chưa có ủy quyền ạ.", pronunciation_focus: ["unfortunately", "share"] },
      { en: "What I can do is have him add you in two minutes when he's available.", vi: "Em đề xuất là chồng/vợ thêm anh/chị làm authorized user — khoảng 2 phút.", pronunciation_focus: ["what", "available"] },
    ],
    cultural_notes_vi:
      "Vợ/chồng/con không tự động được truy cập tài khoản nhau ở Mỹ — privacy laws khác Việt Nam. Đừng nương tay vì 'họ là người nhà'. Hậu quả: agent bị sa thải ngay.",
    tip_advice_vi:
      "Câu 'What I can do is...' là vũ khí mạnh nhất. Thay vì 'I can't' (gắt) → đề xuất giải pháp ngay. Khách hài lòng dù bị từ chối.",
  },
];

// ── 2. Active listening phrases (5) ──────────────────────────────────────

const ACTIVE_LISTENING: CustomerServiceLesson[] = [
  {
    id: "customer_service_listening_make_sure",
    category: "active_listening",
    title_vi: "Xác nhận lại để chắc",
    title_en: "Confirming what you heard",
    sentences: [
      { en: "Let me make sure I understand correctly.", vi: "Cho em chắc lại em hiểu đúng ạ.", pronunciation_focus: ["make sure", "correctly"] },
      { en: "You're saying the charge appeared on March third — is that right?", vi: "Anh/chị nói khoản phí xuất hiện ngày 3 tháng 3 — đúng không ạ?", pronunciation_focus: ["charge", "third"] },
      { en: "And the amount was $47.99?", vi: "Và số tiền là 47.99 đô ạ?", pronunciation_focus: ["forty-seven", "ninety-nine"] },
      { en: "Got it — let me look into that.", vi: "Em hiểu rồi — em tra ngay ạ.", pronunciation_focus: ["got it", "into"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ muốn được nghe TRƯỚC khi giải pháp đến. Câu 'let me make sure I understand' chứng minh bạn lắng nghe — không phải làm lề lối. Bỏ bước này = khách cảm thấy bị xua đuổi.",
    tip_advice_vi:
      "Repeat-back ngày tháng và số tiền cụ thể. Khách nghe đúng = tin tưởng tăng. Đặc biệt với khách lớn tuổi — họ kiểm tra agent có nghe đúng không.",
  },
  {
    id: "customer_service_listening_repeat_back",
    category: "active_listening",
    title_vi: "Lặp lại tóm tắt vấn đề",
    title_en: "Summarizing the issue",
    sentences: [
      { en: "I want to repeat back what I'm hearing to make sure we're on the same page.", vi: "Em xin tóm tắt lại để chắc cả hai cùng hiểu ạ.", pronunciation_focus: ["repeat back", "page"] },
      { en: "You ordered the laptop on the fifth, it arrived on the ninth, but the screen had a crack.", vi: "Anh/chị đặt laptop ngày 5, hàng đến ngày 9 nhưng màn hình bị nứt ạ.", pronunciation_focus: ["ordered", "crack"] },
      { en: "You called yesterday and were told a replacement would ship today.", vi: "Hôm qua anh/chị gọi và được báo hàng thay sẽ gửi hôm nay.", pronunciation_focus: ["yesterday", "replacement"] },
      { en: "But the tracking still shows 'label created.'", vi: "Nhưng tracking vẫn hiện 'label created' ạ.", pronunciation_focus: ["tracking", "shows"] },
    ],
    cultural_notes_vi:
      "Tóm tắt 30 giây trước khi giải quyết = QA scorecard 'demonstrates active listening' = +điểm. Đây là kỹ năng phân biệt junior vs senior agent.",
    tip_advice_vi:
      "Tóm tắt theo dòng thời gian: ngày X → việc Y → ngày Z → việc W. Cấu trúc này giúp khách thấy bạn nắm rõ. Tóm tắt rời rạc = khách nghi ngờ agent đang đoán.",
  },
  {
    id: "customer_service_listening_open_question",
    category: "active_listening",
    title_vi: "Câu hỏi mở để khách kể tiếp",
    title_en: "Open-ended follow-up question",
    sentences: [
      { en: "Tell me more about what happened.", vi: "Anh/chị kể thêm cho em nghe ạ.", pronunciation_focus: ["more", "what"] },
      { en: "And then what did the previous agent say?", vi: "Sau đó agent trước nói gì ạ?", pronunciation_focus: ["previous", "say"] },
      { en: "Walk me through what you tried so far.", vi: "Anh/chị nói qua những gì đã thử rồi ạ.", pronunciation_focus: ["walk", "tried"] },
      { en: "I'm listening — take your time.", vi: "Em đang nghe — anh/chị cứ từ từ ạ.", pronunciation_focus: ["listening", "take"] },
    ],
    cultural_notes_vi:
      "Câu hỏi mở (open-ended) khác câu hỏi đóng (yes/no). Mỹ chuộng open-ended trong CS — khách kể nhiều hơn, agent nắm bối cảnh tốt hơn, giải pháp đúng ngay lần đầu.",
    tip_advice_vi:
      "Mỗi cuộc gọi nên có 1-2 câu hỏi mở. Đặc biệt với vấn đề kỹ thuật — câu 'walk me through what you tried' giúp loại đoán bừa và đi thẳng vào nguyên nhân.",
  },
  {
    id: "customer_service_listening_acknowledge",
    category: "active_listening",
    title_vi: "Công nhận cảm xúc",
    title_en: "Acknowledging the feeling",
    sentences: [
      { en: "I can hear that this has been really frustrating.", vi: "Em hiểu chuyện này khiến anh/chị rất bực ạ.", pronunciation_focus: ["hear", "frustrating"] },
      { en: "That's a long time to wait.", vi: "Chờ lâu như vậy đúng là mệt ạ.", pronunciation_focus: ["long", "wait"] },
      { en: "I'd be upset too if that happened to me.", vi: "Em mà gặp chuyện này em cũng sẽ khó chịu ạ.", pronunciation_focus: ["upset", "happened"] },
      { en: "Thank you for staying on the line with me.", vi: "Cảm ơn anh/chị đã giữ máy với em ạ.", pronunciation_focus: ["staying", "line"] },
    ],
    cultural_notes_vi:
      "Acknowledge cảm xúc TRƯỚC giải pháp = chuẩn QA. Khách Mỹ (đặc biệt thế hệ X và Y) coi việc cảm xúc được công nhận quan trọng ngang việc được giải quyết. Bỏ bước này = khách đòi gặp manager.",
    tip_advice_vi:
      "'I can hear...' / 'That's a long time...' là câu cứu mạng. Học thuộc 3 câu — dùng khi cảm xúc khách nóng. Không phải nói máy móc — nói có ngữ điệu (xuống giọng cuối câu, chậm hơn).",
  },
  {
    id: "customer_service_listening_no_assumption",
    category: "active_listening",
    title_vi: "Hỏi để không đoán bừa",
    title_en: "Asking instead of assuming",
    sentences: [
      { en: "Just so I don't assume — has the device been turned off and back on?", vi: "Em hỏi cho chắc — anh/chị đã tắt máy và bật lại chưa ạ?", pronunciation_focus: ["assume", "turned"] },
      { en: "And which browser are you using — Chrome, Safari, or something else?", vi: "Anh/chị dùng trình duyệt nào — Chrome, Safari hay khác ạ?", pronunciation_focus: ["browser", "Safari"] },
      { en: "Are you connected to Wi-Fi or cellular data?", vi: "Anh/chị đang dùng Wi-Fi hay 4G/5G ạ?", pronunciation_focus: ["connected", "cellular"] },
      { en: "Just trying to narrow it down.", vi: "Em hỏi để khoanh vùng vấn đề ạ.", pronunciation_focus: ["narrow", "down"] },
    ],
    cultural_notes_vi:
      "Đừng đoán bừa rồi giải pháp sai. Khách Mỹ đặc biệt dị ứng với việc bị 'talked down to' — agent giả định khách không biết. Câu 'just so I don't assume' = khiêm tốn, lịch sự.",
    tip_advice_vi:
      "Hỏi 2-3 câu trước khi đề xuất giải pháp. Một giải pháp đúng > ba giải pháp đoán. AHT có thể tăng 20 giây nhưng first-call resolution +10% — metric tốt hơn.",
  },
];

// ── 3. De-escalating angry customers (10) ────────────────────────────────

const DE_ESCALATION: CustomerServiceLesson[] = [
  {
    id: "customer_service_deesc_understand_frustration",
    category: "de_escalation",
    title_vi: "Hiểu cảm xúc bực bội",
    title_en: "Understanding frustration",
    sentences: [
      { en: "I completely understand your frustration.", vi: "Em hoàn toàn hiểu sự bực bội của anh/chị ạ.", pronunciation_focus: ["completely", "frustration"] },
      { en: "This shouldn't have happened to you.", vi: "Chuyện này không nên xảy ra với anh/chị ạ.", pronunciation_focus: ["shouldn't", "happened"] },
      { en: "Let me see what I can do right now.", vi: "Để em xem em làm được gì ngay bây giờ ạ.", pronunciation_focus: ["right now"] },
      { en: "Stay with me — I'm going to help you.", vi: "Anh/chị giữ máy giúp em — em sẽ giúp ạ.", pronunciation_focus: ["stay", "help"] },
    ],
    cultural_notes_vi:
      "Câu 'I completely understand your frustration' là câu chuẩn QA. Tone phải xuống chứ không hồ hởi. Câu này không phải lời an ủi — là yêu cầu công ty trong nhiều rubric chấm điểm.",
    tip_advice_vi:
      "'Completely' phát âm /kəmˈpliːt.li/ — nhấn 'pliːt'. Người Việt hay nói /'kɒmplitli/ nghe rời rạc. Nhịp điệu chuẩn: 'I COM-PLETE-ly UN-der-stand your frus-TRA-tion'.",
  },
  {
    id: "customer_service_deesc_apology_real",
    category: "de_escalation",
    title_vi: "Lời xin lỗi chân thành",
    title_en: "Genuine apology",
    sentences: [
      { en: "I'm so sorry this happened.", vi: "Em rất xin lỗi vì chuyện này ạ.", pronunciation_focus: ["sorry", "happened"] },
      { en: "I want to make this right for you.", vi: "Em muốn giải quyết đúng cho anh/chị ạ.", pronunciation_focus: ["want", "right"] },
      { en: "On behalf of Brightline, I apologize.", vi: "Thay mặt Brightline, em xin lỗi ạ.", pronunciation_focus: ["behalf", "apologize"] },
      { en: "Your time is valuable, and we let you down.", vi: "Thời gian anh/chị quý giá, công ty đã làm anh/chị thất vọng ạ.", pronunciation_focus: ["valuable", "down"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ phân biệt 'sorry' (lịch sự) và 'I'm sorry' + tone xuống (thật lòng). 'I'm so sorry this happened' không phải nhận lỗi cá nhân — là công nhận tình huống. An toàn pháp lý.",
    tip_advice_vi:
      "Đừng nói 'I'm sorry, but...' — chữ 'but' xóa lời xin lỗi. Thay bằng 'I'm sorry. Here's what we can do.' (chấm câu, không 'but').",
  },
  {
    id: "customer_service_deesc_lower_voice",
    category: "de_escalation",
    title_vi: "Hạ giọng để hạ nhiệt khách",
    title_en: "Lowering voice to lower heat",
    sentences: [
      { en: "Let's slow down for a second.", vi: "Mình chậm lại một chút ạ.", pronunciation_focus: ["slow", "second"] },
      { en: "I hear you — and I'm here to help.", vi: "Em nghe anh/chị — em ở đây để giúp ạ.", pronunciation_focus: ["hear", "here"] },
      { en: "Let me focus on getting this fixed for you.", vi: "Em tập trung giải quyết cho anh/chị ạ.", pronunciation_focus: ["focus", "fixed"] },
      { en: "What matters most to you right now?", vi: "Điều quan trọng nhất với anh/chị bây giờ là gì ạ?", pronunciation_focus: ["matters", "right"] },
    ],
    cultural_notes_vi:
      "Tone-matching ngược: khách lớn giọng → mình HẠ giọng. KHÔNG matching anger — đó là sai lầm điển hình của agent mới. Hạ giọng làm khách tự động hạ giọng theo (mirroring).",
    tip_advice_vi:
      "Khi khách quát: hít sâu 1 giây, hạ giọng xuống 30%, nói chậm hơn 20%. Sau 20 giây khách sẽ hạ theo. Đây là kỹ thuật trong sách 'Verbal Judo' — chuẩn của ngành.",
  },
  {
    id: "customer_service_deesc_avoid_defending",
    category: "de_escalation",
    title_vi: "Đừng bào chữa cho công ty",
    title_en: "Don't defend the company",
    sentences: [
      { en: "You're right to be upset.", vi: "Anh/chị bực là đúng ạ.", pronunciation_focus: ["right", "upset"] },
      { en: "I'm not going to make excuses for what happened.", vi: "Em không bào chữa cho chuyện đã xảy ra ạ.", pronunciation_focus: ["excuses", "happened"] },
      { en: "Let's focus on fixing it.", vi: "Mình tập trung sửa thôi ạ.", pronunciation_focus: ["focus", "fixing"] },
      { en: "Here's what I can do today.", vi: "Đây là điều em làm được hôm nay ạ.", pronunciation_focus: ["here's", "today"] },
    ],
    cultural_notes_vi:
      "Đừng nói 'Our policy is...' khi khách đang bực — câu đó như đổ thêm dầu. Trước hết: thừa nhận khách đúng. Sau đó: chuyển sang giải pháp.",
    tip_advice_vi:
      "Quy tắc 3 chữ 'You're right' khi khách giận về vấn đề có thật. Hai chữ này gỡ 70% căng thẳng. Đừng giải thích lý do — khách không quan tâm.",
  },
  {
    id: "customer_service_deesc_validate_emotion",
    category: "de_escalation",
    title_vi: "Công nhận cảm xúc cụ thể",
    title_en: "Validating the specific emotion",
    sentences: [
      { en: "That sounds really stressful.", vi: "Nghe rất căng thẳng ạ.", pronunciation_focus: ["sounds", "stressful"] },
      { en: "Anyone in your position would feel the same way.", vi: "Ai trong tình huống anh/chị cũng cảm thấy vậy thôi ạ.", pronunciation_focus: ["anyone", "position"] },
      { en: "It's okay to be frustrated about this.", vi: "Anh/chị bực là hợp lý ạ.", pronunciation_focus: ["okay", "frustrated"] },
      { en: "Let me see how I can take some of that off your plate.", vi: "Để em xem em gỡ bớt cho anh/chị ạ.", pronunciation_focus: ["take", "plate"] },
    ],
    cultural_notes_vi:
      "Tâm lý Mỹ: cảm xúc cần được 'validated' (công nhận hợp lý) trước khi rút lui. Câu 'anyone in your position would feel the same' là kỹ thuật chuẩn — cho khách biết phản ứng của họ là bình thường.",
    tip_advice_vi:
      "'Take it off your plate' là idiom Mỹ rất hay — nghĩa 'gỡ gánh nặng'. Học thuộc và dùng khi khách stress. Nghe ấm áp hơn 'I'll handle it'.",
  },
  {
    id: "customer_service_deesc_reframe_complaint",
    category: "de_escalation",
    title_vi: "Đổi khung lời phàn nàn",
    title_en: "Reframing a complaint",
    sentences: [
      { en: "What I'm hearing is that you need this resolved by Friday.", vi: "Em hiểu là anh/chị cần xong trước thứ Sáu ạ.", pronunciation_focus: ["hearing", "Friday"] },
      { en: "Is that the most important thing for you?", vi: "Đây là điều quan trọng nhất với anh/chị phải không ạ?", pronunciation_focus: ["most", "important"] },
      { en: "Then let's work backwards from that deadline.", vi: "Vậy mình tính ngược từ thời hạn đó ạ.", pronunciation_focus: ["work", "deadline"] },
      { en: "Here are our options.", vi: "Đây là các phương án ạ.", pronunciation_focus: ["here", "options"] },
    ],
    cultural_notes_vi:
      "Reframe = đổi cuộc đối thoại từ 'phàn nàn về quá khứ' sang 'kế hoạch cho tương lai'. Kỹ thuật chuẩn của senior agent. Khách bực sẽ chuyển sang đối thoại giải pháp.",
    tip_advice_vi:
      "Câu 'What I'm hearing is...' chuyển khách từ chế độ phàn nàn sang chế độ phối hợp. Sau câu này, đa số khách hạ giọng và bắt đầu hợp tác.",
  },
  {
    id: "customer_service_deesc_supervisor_request",
    category: "de_escalation",
    title_vi: "Khách đòi gặp supervisor",
    title_en: "Customer asks for a supervisor",
    sentences: [
      { en: "I understand — and I'd like to help if you'll give me a chance.", vi: "Em hiểu — nếu anh/chị cho em cơ hội, em sẽ cố gắng giúp ạ.", pronunciation_focus: ["chance"] },
      { en: "If I can't resolve this in the next two minutes, I'll transfer you myself.", vi: "Nếu em không giải quyết được trong 2 phút, em sẽ chuyển supervisor cho ạ.", pronunciation_focus: ["resolve", "transfer"] },
      { en: "Fair?", vi: "Anh/chị đồng ý không ạ?", pronunciation_focus: ["fair"] },
      { en: "Either way, I'll make sure you're taken care of.", vi: "Dù sao em cũng sẽ đảm bảo anh/chị được chăm sóc ạ.", pronunciation_focus: ["either", "care"] },
    ],
    cultural_notes_vi:
      "Khi khách đòi supervisor: KHÔNG chuyển ngay. Đề nghị '2 phút' = nhiều khách đồng ý. First-call resolution = không chuyển = điểm cao. Chuyển ngay = QA giảm điểm 'tries to retain ownership'.",
    tip_advice_vi:
      "Câu 'Fair?' (Có công bằng không?) là câu thần. Khách Mỹ thấy mình được tôn trọng → thường nói 'okay'. Đừng dịch là 'công bằng' — nó là 'fair' = ổn không.",
  },
  {
    id: "customer_service_deesc_silent_listening",
    category: "de_escalation",
    title_vi: "Im lặng để khách xả",
    title_en: "Silent listening (let them vent)",
    sentences: [
      { en: "Mm-hmm.", vi: "Vâng ạ.", pronunciation_focus: ["mm-hmm"] },
      { en: "Go ahead — I'm listening.", vi: "Anh/chị cứ nói — em đang nghe ạ.", pronunciation_focus: ["ahead", "listening"] },
      { en: "Take a breath whenever you need.", vi: "Anh/chị cứ thở sâu khi cần ạ.", pronunciation_focus: ["breath", "need"] },
      { en: "I'm not going anywhere.", vi: "Em vẫn ở đây ạ.", pronunciation_focus: ["going", "anywhere"] },
    ],
    cultural_notes_vi:
      "Khách giận cần 30-60 giây 'venting' (xả). Cắt ngang sớm = khách càng giận. Câu 'mm-hmm' nhỏ giọng cho thấy bạn đang nghe — không phải bỏ ngỏ.",
    tip_advice_vi:
      "Đếm 'mm-hmm' mỗi 5-7 giây. Im lặng tuyệt đối = khách nghĩ rớt máy. Mm-hmm + thở = khách biết bạn vẫn ở đó nghe.",
  },
  {
    id: "customer_service_deesc_personal_attack",
    category: "de_escalation",
    title_vi: "Khách công kích cá nhân",
    title_en: "When the customer gets personal",
    sentences: [
      { en: "I want to help you, and I'll keep helping you.", vi: "Em muốn giúp, và em vẫn sẽ giúp ạ.", pronunciation_focus: ["help", "keep"] },
      { en: "I do ask that we keep the conversation respectful.", vi: "Em xin mình giữ cuộc trò chuyện tôn trọng ạ.", pronunciation_focus: ["ask", "respectful"] },
      { en: "Let's get back to solving this.", vi: "Mình quay lại giải quyết vấn đề ạ.", pronunciation_focus: ["back", "solving"] },
      { en: "I appreciate you working with me.", vi: "Em cảm ơn anh/chị phối hợp với em ạ.", pronunciation_focus: ["appreciate", "working"] },
    ],
    cultural_notes_vi:
      "Khi khách chửi/công kích cá nhân: KHÔNG nhân nhượng nhưng KHÔNG đáp trả. Câu 'I do ask that we keep the conversation respectful' chuẩn rubric. Lặp lại 1 lần. Lần 2 → cảnh báo treo cuộc gọi. Lần 3 → ngắt máy theo policy.",
    tip_advice_vi:
      "Người Việt hay nghĩ phải ráng chịu đựng — sai. Hầu hết công ty Mỹ có policy bảo vệ agent: sau 2 cảnh báo, agent được phép ngắt máy mà KHÔNG bị phạt. Quan trọng: tài liệu hóa trong notes.",
  },
  {
    id: "customer_service_deesc_close_strong",
    category: "de_escalation",
    title_vi: "Kết thúc cuộc gọi khó",
    title_en: "Closing a difficult call",
    sentences: [
      { en: "I know this wasn't easy — thank you for working through it with me.", vi: "Em biết chuyện này không dễ — cảm ơn anh/chị đã phối hợp ạ.", pronunciation_focus: ["wasn't", "through"] },
      { en: "Here's what we agreed on, just to recap.", vi: "Tóm lại những gì hai bên thống nhất ạ.", pronunciation_focus: ["agreed", "recap"] },
      { en: "You'll get a confirmation email within an hour.", vi: "Anh/chị sẽ nhận email xác nhận trong 1 tiếng ạ.", pronunciation_focus: ["confirmation", "hour"] },
      { en: "If anything else comes up, please call us back — and ask for me by name.", vi: "Có gì anh/chị gọi lại — và xin gặp em theo tên ạ.", pronunciation_focus: ["comes", "name"] },
    ],
    cultural_notes_vi:
      "Câu 'ask for me by name' là dấu hiệu agent confident. Khách cảm thấy được chăm sóc cá nhân. QA cho điểm cao 'creates personal connection'.",
    tip_advice_vi:
      "Recap cuối cùng = bảo vệ agent nếu sau này có dispute. Nói rõ: 'You'll get X by Y, reference number Z.' Khách quên = agent có notes làm bằng chứng.",
  },
];

// ── 4. Explaining policies / saying no kindly (10) ───────────────────────

const POLICY_NO: CustomerServiceLesson[] = [
  {
    id: "customer_service_policy_what_i_can_do",
    category: "policy_no_kindly",
    title_vi: "Thay 'I can't' bằng 'What I can do'",
    title_en: "Replacing 'I can't' with 'What I can do'",
    sentences: [
      { en: "What I can do is offer a one-time courtesy credit of $20.", vi: "Em có thể tặng credit ngoại lệ 20 đô lần này ạ.", pronunciation_focus: ["what", "courtesy"] },
      { en: "I can't waive the fee, but I can apply a credit for the same amount.", vi: "Em không miễn phí được, nhưng em cộng credit cùng số tiền ạ.", pronunciation_focus: ["waive", "credit"] },
      { en: "Would that work for you?", vi: "Vậy được không ạ?", pronunciation_focus: ["work"] },
      { en: "I want to find a way to help.", vi: "Em muốn tìm cách giúp ạ.", pronunciation_focus: ["find", "help"] },
    ],
    cultural_notes_vi:
      "'I can't' đầu câu = khách phản kháng ngay. 'What I can do is...' đảo ngược 100%. Đây là kỹ thuật chuẩn của ngành — học từ ngày đầu.",
    tip_advice_vi:
      "Mỗi khi định nói 'I can't / I'm not able to' → DỪNG. Đặt câu lại: 'What I can do is...'. Tập đến mức bản năng. Đây là lằn ranh giữa agent điểm 7 và điểm 9.",
  },
  {
    id: "customer_service_policy_per_our_policy",
    category: "policy_no_kindly",
    title_vi: "Giải thích 'theo chính sách'",
    title_en: "Explaining 'per our policy'",
    sentences: [
      { en: "Per our policy, returns must be made within 30 days of purchase.", vi: "Theo chính sách, hàng hoàn phải trong vòng 30 ngày từ khi mua ạ.", pronunciation_focus: ["per", "policy"] },
      { en: "I know that's not what you wanted to hear.", vi: "Em biết đây không phải điều anh/chị muốn nghe ạ.", pronunciation_focus: ["wanted", "hear"] },
      { en: "Let me see if there's any flexibility on this.", vi: "Để em xem có linh động được không ạ.", pronunciation_focus: ["flexibility"] },
      { en: "Give me a moment to check with my supervisor.", vi: "Cho em 1 phút hỏi supervisor ạ.", pronunciation_focus: ["moment", "supervisor"] },
    ],
    cultural_notes_vi:
      "'Per our policy' nên dùng KHI khách yêu cầu cái không thể được. Đừng bắt đầu cuộc gọi bằng câu này. Sau câu policy, luôn thêm 'I know that's not what you wanted' = công nhận thất vọng của khách.",
    tip_advice_vi:
      "Câu 'Let me see if there's any flexibility' không hứa được — chỉ thể hiện thiện chí. Khách thường hài lòng dù cuối cùng không có gì 'flexibility'. Cố gắng = công nhận.",
  },
  {
    id: "customer_service_policy_offer_alternative",
    category: "policy_no_kindly",
    title_vi: "Đề xuất phương án thay thế",
    title_en: "Offering an alternative",
    sentences: [
      { en: "I can't process a full refund, but I can offer a 50% credit.", vi: "Em không hoàn 100%, nhưng em đề xuất credit 50% ạ.", pronunciation_focus: ["process", "refund"] },
      { en: "Or, if you prefer, I can swap it for a different model.", vi: "Hoặc nếu anh/chị muốn, em đổi sang mẫu khác ạ.", pronunciation_focus: ["prefer", "swap"] },
      { en: "Both options are on the table.", vi: "Cả hai phương án đều có sẵn ạ.", pronunciation_focus: ["both", "table"] },
      { en: "Which one sounds better to you?", vi: "Anh/chị thấy phương án nào hợp hơn ạ?", pronunciation_focus: ["sounds", "better"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ thích chọn (choice). Không phương án = bị từ chối. Hai phương án dù cả hai không lý tưởng vẫn cho khách quyền kiểm soát = hài lòng cao hơn.",
    tip_advice_vi:
      "Quy tắc '2 phương án': bao giờ cũng đưa 2, không phải 1 hay 3. 1 = ép buộc. 3 = paralysis. 2 = vừa phải, khách quyết nhanh.",
  },
  {
    id: "customer_service_policy_explain_why",
    category: "policy_no_kindly",
    title_vi: "Giải thích lý do chính sách",
    title_en: "Explaining the reason behind a policy",
    sentences: [
      { en: "The reason for the 30-day window is that we partner with vendors who honor returns within that period.", vi: "Lý do thời hạn 30 ngày là vì nhà cung cấp chỉ chấp nhận hoàn trong thời gian đó ạ.", pronunciation_focus: ["reason", "period"] },
      { en: "I wish I could change it, but it's tied to our supplier agreements.", vi: "Em mong sửa được, nhưng liên quan đến hợp đồng nhà cung cấp ạ.", pronunciation_focus: ["wish", "tied"] },
      { en: "I'd love to make an exception, but my system doesn't allow it after the cutoff.", vi: "Em muốn ngoại lệ lắm, nhưng hệ thống không cho phép sau hạn ạ.", pronunciation_focus: ["exception", "cutoff"] },
      { en: "What I can do is...", vi: "Điều em có thể làm là...", pronunciation_focus: ["what"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ thường nguôi giận khi hiểu LÝ DO. 'It's tied to supplier agreements' khách hiểu — không phải tùy tiện công ty làm khó. Đừng đổ lỗi 'company says so'.",
    tip_advice_vi:
      "Học 3-5 lý do thật cho 3-5 chính sách hay từ chối nhất. Nói tự nhiên, không kịch bản. Khách phân biệt được nói thật vs đọc kịch bản.",
  },
  {
    id: "customer_service_policy_courtesy_credit",
    category: "policy_no_kindly",
    title_vi: "Tặng credit ngoại lệ",
    title_en: "Offering a courtesy credit",
    sentences: [
      { en: "As a one-time gesture, I'd like to credit your account $30.", vi: "Như sự cảm thông lần này, em cộng credit 30 đô ạ.", pronunciation_focus: ["gesture", "credit"] },
      { en: "This is outside our standard policy.", vi: "Đây ngoài chính sách chuẩn ạ.", pronunciation_focus: ["outside", "policy"] },
      { en: "I'm happy to do it because you've been a customer for three years.", vi: "Em sẵn lòng vì anh/chị là khách 3 năm rồi ạ.", pronunciation_focus: ["happy", "years"] },
      { en: "You should see it on your next bill.", vi: "Anh/chị sẽ thấy trên hóa đơn sau ạ.", pronunciation_focus: ["see", "bill"] },
    ],
    cultural_notes_vi:
      "'One-time gesture' (lần này thôi) là từ khóa quan trọng — khách không kỳ vọng lần sau cũng có. Nói rõ là agent đang làm điều đặc biệt = khách trân trọng.",
    tip_advice_vi:
      "Mỗi agent có ngân sách credit hàng tháng (thường $200-500). Dùng đúng chỗ = khách trung thành. Dùng bừa = hết sớm tháng, khách sau bị từ chối thẳng.",
  },
  {
    id: "customer_service_policy_supervisor_no",
    category: "policy_no_kindly",
    title_vi: "Supervisor cũng không thể",
    title_en: "Even the supervisor can't help",
    sentences: [
      { en: "I checked with my supervisor — unfortunately, this is a hard cap.", vi: "Em hỏi supervisor — đây là giới hạn cứng ạ.", pronunciation_focus: ["checked", "cap"] },
      { en: "It's not something we can override at this level.", vi: "Cấp này không qua được ạ.", pronunciation_focus: ["override", "level"] },
      { en: "I know that's frustrating to hear.", vi: "Em biết nghe vậy bực ạ.", pronunciation_focus: ["frustrating", "hear"] },
      { en: "What I can do is escalate it to corporate review — that takes 5-7 business days.", vi: "Em có thể chuyển lên cấp công ty xét — mất 5-7 ngày làm việc ạ.", pronunciation_focus: ["escalate", "review"] },
    ],
    cultural_notes_vi:
      "Đôi khi không có 'flexibility'. Câu 'hard cap' (giới hạn cứng) là từ Mỹ rất rõ — không thể qua. Ngay sau đó, đề xuất escalation = thiện chí mà không hứa hươu vượn.",
    tip_advice_vi:
      "Khi đã hỏi supervisor và bị từ chối, ĐỪNG hỏi lần thứ hai. Khách Mỹ chấp nhận 'no' nếu nghe có nỗ lực. Hỏi 2 lần = supervisor stress + agent mất uy tín.",
  },
  {
    id: "customer_service_policy_unfortunately_what",
    category: "policy_no_kindly",
    title_vi: "Cấu trúc 'Unfortunately... what I can do'",
    title_en: "'Unfortunately... what I can do' formula",
    sentences: [
      { en: "Unfortunately, the warranty has expired.", vi: "Rất tiếc, bảo hành đã hết ạ.", pronunciation_focus: ["unfortunately", "expired"] },
      { en: "What I can do is offer 25% off a replacement.", vi: "Điều em có thể là giảm 25% nếu mua mới ạ.", pronunciation_focus: ["what", "replacement"] },
      { en: "Or I can connect you with our trade-in program.", vi: "Hoặc em chuyển sang chương trình đổi máy cũ ạ.", pronunciation_focus: ["connect", "trade-in"] },
      { en: "Which sounds better?", vi: "Cách nào tiện hơn ạ?", pronunciation_focus: ["which", "better"] },
    ],
    cultural_notes_vi:
      "'Unfortunately' = lá chắn nhẹ nhàng. Sau đó 'what I can do' = cánh cửa mở. Cấu trúc này là xương sống của 80% cuộc gọi từ chối khéo.",
    tip_advice_vi:
      "Tập 'Unfortunately + what I can do' đến mức nói được trong giấc ngủ. Đây là câu cứu mạng khi khách đòi điều không được. Ngữ điệu: 'unfortunately' xuống, 'what I can do' lên.",
  },
  {
    id: "customer_service_policy_no_with_empathy",
    category: "policy_no_kindly",
    title_vi: "Từ chối có đồng cảm",
    title_en: "Saying no with empathy",
    sentences: [
      { en: "I really wish I could approve this for you.", vi: "Em rất mong duyệt được cho anh/chị ạ.", pronunciation_focus: ["wish", "approve"] },
      { en: "If it were up to me, I would.", vi: "Nếu là em quyết, em sẽ làm ạ.", pronunciation_focus: ["were", "would"] },
      { en: "But this is a system rule that even managers can't override.", vi: "Nhưng đây là quy tắc hệ thống, manager cũng không qua ạ.", pronunciation_focus: ["system", "override"] },
      { en: "I'm sorry to disappoint you on this.", vi: "Em xin lỗi vì không làm anh/chị thất vọng ạ.", pronunciation_focus: ["sorry", "disappoint"] },
    ],
    cultural_notes_vi:
      "'If it were up to me' = giả định cách (subjunctive). Câu này chân thành hóa từ chối. Người Việt hay sai 'if it WAS up to me' — chuẩn là 'WERE' (formal English).",
    tip_advice_vi:
      "Phát âm 'were' /wɝː/ có 'r' nặng — luyện. Người Việt thường bỏ 'r' thành /wəː/ nghe lạ. Câu 'if it were up to me' phải nói trôi chảy không vấp.",
  },
  {
    id: "customer_service_policy_redirect_resource",
    category: "policy_no_kindly",
    title_vi: "Hướng đến nguồn khác",
    title_en: "Redirecting to another resource",
    sentences: [
      { en: "We don't handle that here, but I know who can.", vi: "Bộ phận này không xử lý vấn đề đó, nhưng em biết ai làm được ạ.", pronunciation_focus: ["handle", "who"] },
      { en: "Let me give you the direct number for billing.", vi: "Em đưa số trực tiếp của bộ phận hóa đơn ạ.", pronunciation_focus: ["direct", "billing"] },
      { en: "Or I can transfer you right now if you have time.", vi: "Hoặc em chuyển ngay nếu anh/chị có thời gian ạ.", pronunciation_focus: ["transfer", "right"] },
      { en: "What works better?", vi: "Cách nào tiện hơn ạ?", pronunciation_focus: ["what", "better"] },
    ],
    cultural_notes_vi:
      "Đừng nói 'that's not my department' rồi cúp máy — khách rất ghét. Phải đưa số trực tiếp HOẶC chuyển. Cho khách quyền chọn = hài lòng cao hơn dù bị chuyển.",
    tip_advice_vi:
      "'I know who can' (em biết ai làm được) = câu vàng. Thay vì cảm giác bị đẩy đi, khách cảm thấy được hướng dẫn. Học thuộc khi gặp vấn đề ngoài phạm vi.",
  },
  {
    id: "customer_service_policy_documenting_no",
    category: "policy_no_kindly",
    title_vi: "Ghi chú lại lý do từ chối",
    title_en: "Documenting the refusal",
    sentences: [
      { en: "I'm noting in your account that we discussed this today.", vi: "Em ghi chú trong tài khoản là hôm nay mình đã trao đổi ạ.", pronunciation_focus: ["noting", "discussed"] },
      { en: "If you call back, the next agent will see exactly what we covered.", vi: "Nếu gọi lại, agent sau sẽ thấy đúng những gì đã trao đổi ạ.", pronunciation_focus: ["next", "exactly"] },
      { en: "Including the reason this couldn't be approved.", vi: "Kể cả lý do không duyệt được ạ.", pronunciation_focus: ["including", "approved"] },
      { en: "Your reference number is BL-44871.", vi: "Số tham chiếu là BL-44871 ạ.", pronunciation_focus: ["reference", "number"] },
    ],
    cultural_notes_vi:
      "Ghi notes BẢO VỆ agent. Khách gọi lại tìm agent dễ hơn, lần sau bị từ chối thì notes có sẵn. Khách Mỹ tôn trọng việc 'I'm documenting this' — chuyên nghiệp.",
    tip_advice_vi:
      "Notes phải viết bằng tiếng Anh chuẩn, đầy đủ chủ ngữ. KHÔNG viết tắt kiểu Việt. QA đọc notes — viết tệ = điểm thấp. Mẫu: 'Customer requested X. Per policy Y, declined. Offered alternative Z. Customer acknowledged.'",
  },
];

// ── 5. Putting customer on hold / transferring (5) ───────────────────────

const HOLD_TRANSFER: CustomerServiceLesson[] = [
  {
    id: "customer_service_hold_short_hold",
    category: "hold_transfer",
    title_vi: "Giữ máy ngắn",
    title_en: "Short hold",
    sentences: [
      { en: "Mind if I put you on hold for two minutes while I check this?", vi: "Cho em giữ máy 2 phút để kiểm tra ạ?", pronunciation_focus: ["mind", "hold"] },
      { en: "I'll be as quick as I can.", vi: "Em làm nhanh nhất có thể ạ.", pronunciation_focus: ["quick"] },
      { en: "Thanks for your patience.", vi: "Cảm ơn anh/chị đã chờ ạ.", pronunciation_focus: ["thanks", "patience"] },
      { en: "I'm back — thanks for holding.", vi: "Em quay lại rồi — cảm ơn anh/chị đã giữ máy ạ.", pronunciation_focus: ["back", "holding"] },
    ],
    cultural_notes_vi:
      "Phải HỎI trước khi cho hold — không tự ý bấm. Câu 'Mind if I...' lịch sự nhất. 'Hold on a sec' nghe rất bất lịch sự, đừng dùng với khách Mỹ trừ khi rất thân.",
    tip_advice_vi:
      "Cam kết thời gian (2 phút) phải đúng. Hold quá 2 phút phải quay lại check-in: 'Sorry, just a couple more minutes — still working on it.' Không check-in = khách cúp máy.",
  },
  {
    id: "customer_service_hold_long_hold",
    category: "hold_transfer",
    title_vi: "Giữ máy lâu",
    title_en: "Longer hold",
    sentences: [
      { en: "This is going to take about five minutes — would you like me to call you back instead?", vi: "Việc này cần khoảng 5 phút — anh/chị muốn em gọi lại không ạ?", pronunciation_focus: ["take", "back"] },
      { en: "Or you can stay on the line, your choice.", vi: "Hoặc anh/chị giữ máy — tùy anh/chị ạ.", pronunciation_focus: ["stay", "line"] },
      { en: "Either way works for me.", vi: "Cách nào cũng được với em ạ.", pronunciation_focus: ["either", "works"] },
      { en: "I'll make sure not to lose you.", vi: "Em sẽ không để mất kết nối ạ.", pronunciation_focus: ["sure", "lose"] },
    ],
    cultural_notes_vi:
      "Hold quá 3 phút phải đề xuất callback. Khách Mỹ ghét đợi lâu trên đường dây — họ thường có call waiting với việc khác. Callback option = chuyên nghiệp.",
    tip_advice_vi:
      "Trước callback, xin số điện thoại tốt nhất + thời gian khách rảnh. Quên gọi lại = mất khách + bad review. Hệ thống nhắc lịch — agent giỏi không bao giờ quên callback đã hứa.",
  },
  {
    id: "customer_service_hold_warm_transfer",
    category: "hold_transfer",
    title_vi: "Chuyển có nói trước",
    title_en: "Warm transfer",
    sentences: [
      { en: "I'm going to transfer you to a billing specialist who can help with this.", vi: "Em chuyển sang chuyên viên bộ phận hóa đơn — họ giải quyết được ạ.", pronunciation_focus: ["transfer", "specialist"] },
      { en: "Before I transfer, let me brief them so you don't have to repeat yourself.", vi: "Trước khi chuyển, em báo cho họ để anh/chị không phải kể lại ạ.", pronunciation_focus: ["brief", "repeat"] },
      { en: "Stay on the line — I'll introduce you.", vi: "Anh/chị giữ máy — em giới thiệu ạ.", pronunciation_focus: ["stay", "introduce"] },
      { en: "Hi Mark, I have Mr. Tran on the line — he needs help with...", vi: "Mark ơi, anh Trần đang trên máy — anh ấy cần giúp về...", pronunciation_focus: ["have", "needs"] },
    ],
    cultural_notes_vi:
      "Warm transfer (có brief) > cold transfer (chuyển thẳng). Khách Mỹ rất ghét phải kể lại từ đầu. QA chấm warm transfer cao hơn cold transfer 2 điểm.",
    tip_advice_vi:
      "Brief 30 giây cho agent kế: tên khách + vấn đề + những gì đã thử. Không cần kể chi tiết — đủ để agent kế bắt nhịp. Đây là dấu hiệu agent senior.",
  },
  {
    id: "customer_service_hold_apologize_long_hold",
    category: "hold_transfer",
    title_vi: "Xin lỗi vì giữ máy lâu",
    title_en: "Apologizing for a long hold",
    sentences: [
      { en: "I'm so sorry for the long hold.", vi: "Em rất xin lỗi vì giữ máy lâu ạ.", pronunciation_focus: ["sorry", "long"] },
      { en: "Thank you for being patient with me.", vi: "Cảm ơn anh/chị đã kiên nhẫn với em ạ.", pronunciation_focus: ["patient", "with"] },
      { en: "Here's what I found.", vi: "Đây là kết quả em tìm được ạ.", pronunciation_focus: ["here's", "found"] },
      { en: "Let me give you a quick summary.", vi: "Em tóm tắt nhanh ạ.", pronunciation_focus: ["quick", "summary"] },
    ],
    cultural_notes_vi:
      "Khách giữ máy lâu = mất kiên nhẫn dần. Khi quay lại, lời xin lỗi NGAY lập tức + cảm ơn = reset cảm xúc. Đừng quay lại với 'Okay so...' — nghe vô cảm.",
    tip_advice_vi:
      "Khi quay lại sau hold lâu, NÓI ngay (không im 5 giây xem có ai nghe). Im lặng = khách nghĩ rớt máy. Câu mở đầu phải là âm thanh ấm: 'Hi, I'm back!'",
  },
  {
    id: "customer_service_hold_cold_transfer_avoid",
    category: "hold_transfer",
    title_vi: "Tránh chuyển nguội",
    title_en: "Avoiding a cold transfer",
    sentences: [
      { en: "Let me try to handle this first before transferring.", vi: "Em thử giải quyết trước khi chuyển ạ.", pronunciation_focus: ["handle", "first"] },
      { en: "Transferring should be a last resort.", vi: "Chuyển cuộc gọi là phương án cuối ạ.", pronunciation_focus: ["transferring", "resort"] },
      { en: "Walk me through what's happening one more time.", vi: "Anh/chị kể lại cho em một lần nữa nhé.", pronunciation_focus: ["walk", "one"] },
      { en: "I think I can help you here.", vi: "Em nghĩ em giúp được ngay ạ.", pronunciation_focus: ["think", "here"] },
    ],
    cultural_notes_vi:
      "Chuyển nguội (không brief) = -1 điểm QA. Chuyển không cần thiết = -2 điểm. First-call resolution là metric quan trọng nhất ngành. Cố gắng giải quyết tại chỗ.",
    tip_advice_vi:
      "Trước khi chuyển, hỏi mình: '5 phút nữa em có thể tự xử không?'. Nếu có → cố gắng. Chuyển bừa = supervisor sẽ hỏi tại sao. Lặp lại 3 lần trong tuần = bị mời họp.",
  },
];

// ── 6. Confirming actions and follow-ups (5) ─────────────────────────────

const CONFIRM_FOLLOWUP: CustomerServiceLesson[] = [
  {
    id: "customer_service_confirm_action_recap",
    category: "confirm_followup",
    title_vi: "Xác nhận thao tác đã làm",
    title_en: "Confirming what was done",
    sentences: [
      { en: "To confirm, I've credited $35 to your account effective today.", vi: "Em xác nhận: đã cộng credit 35 đô vào tài khoản từ hôm nay ạ.", pronunciation_focus: ["confirm", "effective"] },
      { en: "I've also waived the late fee on last month's bill.", vi: "Em cũng miễn phí trễ hạn của tháng trước rồi ạ.", pronunciation_focus: ["waived", "late"] },
      { en: "And I've updated your address to 123 Main Street.", vi: "Và đã cập nhật địa chỉ thành 123 Main Street ạ.", pronunciation_focus: ["updated", "address"] },
      { en: "Anything I'm missing?", vi: "Em còn sót gì không ạ?", pronunciation_focus: ["missing"] },
    ],
    cultural_notes_vi:
      "Recap chi tiết = bảo vệ cả khách và agent. Khách nghe lại được sửa nhầm. Agent có notes để sau này tham chiếu. QA chấm 'recap before close' là mục riêng.",
    tip_advice_vi:
      "Liệt kê dạng số: '1, 2, 3'. Khách Mỹ rất quen format danh sách. Đừng nói 'I did a bunch of things' — phải cụ thể từng cái.",
  },
  {
    id: "customer_service_confirm_email_followup",
    category: "confirm_followup",
    title_vi: "Email xác nhận",
    title_en: "Email confirmation",
    sentences: [
      { en: "You'll receive a confirmation email at the address on file within 10 minutes.", vi: "Anh/chị sẽ nhận email xác nhận trong 10 phút ạ.", pronunciation_focus: ["receive", "address"] },
      { en: "If you don't see it, please check your spam folder.", vi: "Không thấy thì kiểm tra hộp spam ạ.", pronunciation_focus: ["spam", "folder"] },
      { en: "It will include the reference number and a summary of what we discussed.", vi: "Email có số tham chiếu và tóm tắt cuộc trao đổi ạ.", pronunciation_focus: ["include", "discussed"] },
      { en: "Let me read the email address back to you to make sure it's correct.", vi: "Em đọc lại email để chắc đúng ạ.", pronunciation_focus: ["read", "correct"] },
    ],
    cultural_notes_vi:
      "Đọc lại email/số điện thoại = chuẩn QA. Khách thường đọc nhanh, sai chính tả là chuyện thường. Đừng giả định mình nghe đúng — luôn đọc lại để confirm.",
    tip_advice_vi:
      "Khi đọc email, dùng NATO phonetic cho ký tự khó: 'M as in Mike, B as in Boy'. Người Việt dễ nhầm 'M' và 'N' qua điện thoại — NATO chuẩn không thể nhầm.",
  },
  {
    id: "customer_service_confirm_reference_number",
    category: "confirm_followup",
    title_vi: "Cung cấp số tham chiếu",
    title_en: "Providing the reference number",
    sentences: [
      { en: "Your reference number is BL dash four-four-eight-seven-one.", vi: "Số tham chiếu là BL-44871 ạ.", pronunciation_focus: ["reference", "four"] },
      { en: "Let me spell it: B as in Boy, L as in Lima.", vi: "Em đánh vần: B như Boy, L như Lima ạ.", pronunciation_focus: ["spell", "Lima"] },
      { en: "Write it down somewhere safe.", vi: "Anh/chị ghi vào chỗ an toàn ạ.", pronunciation_focus: ["write", "safe"] },
      { en: "Reading it back to me would be great.", vi: "Anh/chị đọc lại cho em được không ạ.", pronunciation_focus: ["reading", "back"] },
    ],
    cultural_notes_vi:
      "Đọc số chậm: '4-4-8-7-1' (từng số), KHÔNG '44, 871'. Khách Mỹ ghi từng số. Đọc nhóm = sai. NATO phonetic 'B as in Boy' tránh nhầm B/D/P qua điện thoại.",
    tip_advice_vi:
      "Học NATO phonetic chuẩn: A-Alpha, B-Bravo (hoặc Boy), C-Charlie, D-Delta, E-Echo, F-Foxtrot, G-Golf, H-Hotel, I-India, J-Juliet, K-Kilo, L-Lima, M-Mike, N-November, O-Oscar, P-Papa, Q-Quebec, R-Romeo, S-Sierra, T-Tango, U-Uniform, V-Victor, W-Whiskey, X-X-ray, Y-Yankee, Z-Zulu. Học 5 chữ thường nhầm trước.",
  },
  {
    id: "customer_service_confirm_followup_time",
    category: "confirm_followup",
    title_vi: "Hẹn thời gian theo dõi",
    title_en: "Setting a follow-up window",
    sentences: [
      { en: "Allow 5-7 business days for the credit to post.", vi: "Cho 5-7 ngày làm việc để credit cập nhật ạ.", pronunciation_focus: ["allow", "business"] },
      { en: "If you don't see it by then, please call us back.", vi: "Sau đó không thấy thì gọi lại ạ.", pronunciation_focus: ["see", "back"] },
      { en: "And reference this case number — that saves time.", vi: "Và nhắc số case này — tiết kiệm thời gian ạ.", pronunciation_focus: ["reference", "saves"] },
      { en: "Sound good?", vi: "Anh/chị đồng ý không ạ?", pronunciation_focus: ["sound"] },
    ],
    cultural_notes_vi:
      "'Business days' (ngày làm việc) khác 'days' (ngày thường). Khách Mỹ phân biệt rõ — agent phải dùng đúng. Cuối tuần KHÔNG tính. Holiday cũng không tính.",
    tip_advice_vi:
      "Đặt thời hạn LÂU HƠN thực tế (5-7 days) → cập nhật trong 3 ngày = khách bất ngờ vui. Hứa 3 days mà 5 days mới có = bad review. Quy tắc 'under-promise, over-deliver'.",
  },
  {
    id: "customer_service_confirm_satisfaction_check",
    category: "confirm_followup",
    title_vi: "Kiểm tra sự hài lòng",
    title_en: "Checking satisfaction",
    sentences: [
      { en: "Does that fully address what you called about today?", vi: "Vậy có giải quyết đúng việc anh/chị gọi không ạ?", pronunciation_focus: ["fully", "address"] },
      { en: "Anything still unresolved?", vi: "Còn điều gì chưa xong không ạ?", pronunciation_focus: ["unresolved"] },
      { en: "I want to make sure you're walking away satisfied.", vi: "Em muốn chắc anh/chị hài lòng khi kết thúc ạ.", pronunciation_focus: ["walking", "satisfied"] },
      { en: "Take a moment if you're thinking.", vi: "Anh/chị cứ suy nghĩ thoải mái ạ.", pronunciation_focus: ["take", "thinking"] },
    ],
    cultural_notes_vi:
      "Câu 'walking away satisfied' = câu chuẩn QA, ghi nhớ. Khách Mỹ thường cảm động khi agent hỏi rõ — họ nhớ và tip điểm cao trong survey.",
    tip_advice_vi:
      "Đợi 2-3 giây sau khi hỏi — khách suy nghĩ. Vội kết thúc = khách quên vấn đề khác → gọi lại = AHT tăng. Một lần kỹ tốt hơn ba lần qua loa.",
  },
];

// ── 7. Closing calls / ensuring satisfaction (5) ─────────────────────────

const CLOSING: CustomerServiceLesson[] = [
  {
    id: "customer_service_closing_anything_else",
    category: "closing_satisfaction",
    title_vi: "Hỏi còn gì giúp được không",
    title_en: "Asking 'anything else'",
    sentences: [
      { en: "Is there anything else I can help you with today?", vi: "Em còn giúp gì khác cho anh/chị hôm nay không ạ?", pronunciation_focus: ["anything", "today"] },
      { en: "Big or small — happy to help.", vi: "Chuyện lớn nhỏ gì em cũng vui giúp ạ.", pronunciation_focus: ["big", "small"] },
      { en: "While I have you on the line.", vi: "Trong khi anh/chị còn trên máy ạ.", pronunciation_focus: ["have", "line"] },
      { en: "No? Then we're all set.", vi: "Không ạ? Vậy mình xong rồi ạ.", pronunciation_focus: ["all set"] },
    ],
    cultural_notes_vi:
      "'Anything else?' là câu chuẩn QA — bỏ là -1 điểm. 'While I have you on the line' khôn khéo — gợi nhớ khách những việc họ định hỏi nhưng quên.",
    tip_advice_vi:
      "Đôi khi khách quên việc khác — câu này cứu họ khỏi gọi lại. Một cuộc gọi giải 2 việc = AHT cao hơn nhưng first-call resolution +1 = QA cao hơn.",
  },
  {
    id: "customer_service_closing_thanks_patience",
    category: "closing_satisfaction",
    title_vi: "Cảm ơn vì sự kiên nhẫn",
    title_en: "Thanking for patience",
    sentences: [
      { en: "Thank you for your patience today.", vi: "Cảm ơn anh/chị đã kiên nhẫn hôm nay ạ.", pronunciation_focus: ["patience"] },
      { en: "I appreciate you taking the time to call.", vi: "Em cảm ơn anh/chị đã dành thời gian gọi ạ.", pronunciation_focus: ["appreciate", "taking"] },
      { en: "And thank you for choosing Brightline.", vi: "Cảm ơn anh/chị đã chọn Brightline ạ.", pronunciation_focus: ["thank", "choosing"] },
      { en: "Have a wonderful rest of your day.", vi: "Chúc anh/chị một ngày tuyệt vời ạ.", pronunciation_focus: ["wonderful", "rest"] },
    ],
    cultural_notes_vi:
      "Câu 'Have a wonderful rest of your day' chuẩn Mỹ — không phải 'Have a nice day' (nghe cũ). 'Thank you for choosing X' nhắc khách lý do trung thành — khôn khéo.",
    tip_advice_vi:
      "Phát âm 'patience' /ˈpeɪ.ʃəns/ — nhấn 'PAY'. Người Việt hay nói /pə'tiɛns/ — nghe lạ. Luyện cho đến khi tự nhiên.",
  },
  {
    id: "customer_service_closing_survey_request",
    category: "closing_satisfaction",
    title_vi: "Đề nghị làm survey",
    title_en: "Asking for the survey",
    sentences: [
      { en: "You may receive a short survey after this call.", vi: "Anh/chị có thể nhận khảo sát ngắn sau cuộc gọi ạ.", pronunciation_focus: ["receive", "survey"] },
      { en: "If I've helped you today, I'd appreciate your honest feedback.", vi: "Nếu em đã giúp được hôm nay, em rất mong feedback thật lòng ạ.", pronunciation_focus: ["helped", "honest"] },
      { en: "It only takes a minute.", vi: "Chỉ mất 1 phút thôi ạ.", pronunciation_focus: ["only", "takes"] },
      { en: "Either way, thank you for the call.", vi: "Dù thế nào, cảm ơn anh/chị đã gọi ạ.", pronunciation_focus: ["either", "way"] },
    ],
    cultural_notes_vi:
      "Survey score (CSAT/NPS) ảnh hưởng trực tiếp đến lương thưởng agent. Đa số công ty: survey 9-10 = bonus, 6-8 = bình thường, <6 = bị review. Đề nghị survey ĐỂ KHÁCH TỰ NGUYỆN — không ép.",
    tip_advice_vi:
      "Đừng nói 'please give me a 10' — vi phạm policy. Câu chuẩn: 'If I've helped you today, I'd appreciate your honest feedback'. Nhấn 'helped' và 'honest' — khách hiểu ngầm.",
  },
  {
    id: "customer_service_closing_personal_touch",
    category: "closing_satisfaction",
    title_vi: "Lời chào ấm áp cá nhân",
    title_en: "Warm personal close",
    sentences: [
      { en: "It was really nice talking with you, Mr. Tran.", vi: "Em rất vui được nói chuyện với anh Trần ạ.", pronunciation_focus: ["really", "talking"] },
      { en: "Take care of yourself.", vi: "Anh/chị giữ gìn sức khỏe ạ.", pronunciation_focus: ["take", "yourself"] },
      { en: "Stay warm out there — heard it's cold today.", vi: "Giữ ấm nhé — em nghe nói hôm nay lạnh ạ.", pronunciation_focus: ["warm", "cold"] },
      { en: "Take care.", vi: "Tạm biệt ạ.", pronunciation_focus: ["take care"] },
    ],
    cultural_notes_vi:
      "Personal touch (gọi tên, nói thời tiết) = QA cao. Khách cảm thấy được nhớ. 'Take care' phổ biến nhất ở Mỹ — KHÔNG dịch là 'cẩn thận', nó là 'tạm biệt thân mật'.",
    tip_advice_vi:
      "Học 3-5 câu kết thân: 'Stay warm', 'Stay cool' (hè), 'Drive safe' (sau khi sửa xe), 'Enjoy your weekend' (thứ Sáu). Đa dạng = không nhàm = QA điểm cao.",
  },
  {
    id: "customer_service_closing_call_back_invite",
    category: "closing_satisfaction",
    title_vi: "Mời gọi lại nếu cần",
    title_en: "Inviting a callback",
    sentences: [
      { en: "If anything comes up later, please don't hesitate to call.", vi: "Có gì sau này, anh/chị cứ gọi lại đừng ngại ạ.", pronunciation_focus: ["anything", "hesitate"] },
      { en: "We're here 24/7.", vi: "Bên em phục vụ 24/7 ạ.", pronunciation_focus: ["here"] },
      { en: "And ask for me by name — Linh.", vi: "Và xin gặp em theo tên — Linh ạ.", pronunciation_focus: ["ask", "name"] },
      { en: "Bye for now.", vi: "Tạm biệt ạ.", pronunciation_focus: ["bye"] },
    ],
    cultural_notes_vi:
      "'Don't hesitate' nghe trang trọng và ấm áp. 'Ask for me by name' xây dựng customer loyalty — khách quen agent → tăng retention. Đây là dấu hiệu agent senior.",
    tip_advice_vi:
      "'Bye for now' tốt hơn 'Bye' (cộc) hoặc 'Goodbye' (trang trọng quá). 'Bye for now' = thân mật vừa phải, gợi ý còn gặp lại.",
  },
];

// ── 8. Specific complaint types (5) ──────────────────────────────────────

const SPECIFIC_COMPLAINTS: CustomerServiceLesson[] = [
  {
    id: "customer_service_complaint_billing_dispute",
    category: "specific_complaints",
    title_vi: "Tranh chấp hóa đơn",
    title_en: "Billing dispute",
    sentences: [
      { en: "I see a charge for $89.99 on March third — that's the one you're disputing?", vi: "Em thấy khoản 89.99 đô ngày 3 tháng 3 — đây là khoản tranh chấp ạ?", pronunciation_focus: ["charge", "disputing"] },
      { en: "Walk me through what you remember signing up for.", vi: "Anh/chị nhớ đã đăng ký gì ạ?", pronunciation_focus: ["walk", "signing"] },
      { en: "Let me pull the original order so we can compare.", vi: "Em mở đơn gốc để so sánh ạ.", pronunciation_focus: ["original", "compare"] },
      { en: "If this was billed in error, I'll refund it on this call.", vi: "Nếu thật sự bị tính nhầm, em hoàn tiền ngay trong cuộc gọi ạ.", pronunciation_focus: ["billed", "refund"] },
    ],
    cultural_notes_vi:
      "Billing dispute là một trong loại phàn nàn nóng nhất. Đừng phòng thủ — kiểm tra cụ thể, công nhận sai nếu sai. Khách Mỹ tôn trọng agent công nhận lỗi công ty.",
    tip_advice_vi:
      "Quy trình chuẩn: (1) xác nhận khoản phí cụ thể; (2) hỏi khách nhớ gì; (3) so sánh với hệ thống; (4) hành động. Mỗi bước rõ ràng = khách bình tĩnh.",
  },
  {
    id: "customer_service_complaint_missing_item",
    category: "specific_complaints",
    title_vi: "Hàng giao thiếu",
    title_en: "Missing item from order",
    sentences: [
      { en: "I'm so sorry about the missing item.", vi: "Em rất xin lỗi vì thiếu hàng ạ.", pronunciation_focus: ["sorry", "missing"] },
      { en: "Can you tell me what was missing — and was anything else damaged?", vi: "Cho em xin tên món thiếu — và có gì hỏng không ạ?", pronunciation_focus: ["missing", "damaged"] },
      { en: "I'll ship a replacement today, free of charge.", vi: "Em gửi hàng thay miễn phí hôm nay ạ.", pronunciation_focus: ["replacement", "charge"] },
      { en: "You should receive it within 3 business days.", vi: "Anh/chị nhận trong 3 ngày làm việc ạ.", pronunciation_focus: ["receive", "business"] },
    ],
    cultural_notes_vi:
      "Hàng thiếu/hỏng KHÔNG yêu cầu trả lại trước khi gửi thay (đa số công ty Mỹ). Gửi ngay = customer experience tốt. Hỏi đủ trước khi gửi = không lặp lại sai sót.",
    tip_advice_vi:
      "Hỏi 'was anything else damaged?' = phòng ngừa cuộc gọi thứ hai. Khách thường có vấn đề khác mà chưa kịp nói. Một cuộc gọi giải tất cả = first-call resolution +1.",
  },
  {
    id: "customer_service_complaint_technical_issue",
    category: "specific_complaints",
    title_vi: "Sự cố kỹ thuật",
    title_en: "Technical issue",
    sentences: [
      { en: "Let me run a few quick tests on your line.", vi: "Em chạy vài kiểm tra nhanh trên đường truyền ạ.", pronunciation_focus: ["run", "line"] },
      { en: "While that's running, can you tell me when this started?", vi: "Trong lúc đó, anh/chị cho em biết bắt đầu khi nào ạ?", pronunciation_focus: ["while", "started"] },
      { en: "I'm seeing a signal issue on our end — that's the cause.", vi: "Em thấy lỗi tín hiệu phía bên em — đó là nguyên nhân ạ.", pronunciation_focus: ["seeing", "cause"] },
      { en: "I can either send a technician or push a remote fix — your preference?", vi: "Em gửi kỹ thuật viên hoặc sửa từ xa — anh/chị chọn ạ?", pronunciation_focus: ["technician", "remote"] },
    ],
    cultural_notes_vi:
      "Khách technical thường thông minh và bực — họ đã thử mọi thứ trước khi gọi. ĐỪNG hỏi 'have you turned it off and on?' nếu họ đã nói rõ thử rồi. Lặp lại = họ giận hơn.",
    tip_advice_vi:
      "Câu 'I'm seeing X on our end' công nhận lỗi từ phía công ty = khách bình tĩnh ngay. Đừng đẩy lỗi cho khách. Nếu thật sự lỗi khách, dùng 'It looks like the issue is...' nhẹ nhàng hơn.",
  },
  {
    id: "customer_service_complaint_refund_request",
    category: "specific_complaints",
    title_vi: "Yêu cầu hoàn tiền",
    title_en: "Refund request",
    sentences: [
      { en: "I can process a full refund of $129.99 to the card you used.", vi: "Em có thể hoàn 129.99 đô về thẻ ban đầu ạ.", pronunciation_focus: ["process", "card"] },
      { en: "It will appear on your statement within 5-7 business days.", vi: "Sẽ hiện trên sao kê trong 5-7 ngày làm việc ạ.", pronunciation_focus: ["appear", "statement"] },
      { en: "Do you want to return the item, or keep it?", vi: "Anh/chị muốn trả hàng hay giữ lại ạ?", pronunciation_focus: ["return", "keep"] },
      { en: "Either way, the refund goes through today.", vi: "Cách nào cũng được, em hoàn tiền hôm nay ạ.", pronunciation_focus: ["either", "today"] },
    ],
    cultural_notes_vi:
      "Hoàn tiền nhanh = khách trung thành. 'Keep the item' (giữ lại đồ) là chính sách phổ biến cho hàng giá thấp/hỏng — gửi trả tốn phí công ty hơn giá hàng. Hỏi → khách bất ngờ vui.",
    tip_advice_vi:
      "Refund processing time phải nói rõ '5-7 business days'. Khách Mỹ kiểm tra credit card statement thường xuyên — không thấy đúng ngày = gọi lại. Thông tin đầy đủ ngay = ít callback hơn.",
  },
  {
    id: "customer_service_complaint_account_locked",
    category: "specific_complaints",
    title_vi: "Tài khoản bị khóa",
    title_en: "Account access issue",
    sentences: [
      { en: "I see your account is locked from too many login attempts.", vi: "Em thấy tài khoản bị khóa do đăng nhập sai nhiều lần ạ.", pronunciation_focus: ["locked", "attempts"] },
      { en: "Once I verify you, I can unlock it right now.", vi: "Sau khi xác minh, em mở khóa ngay ạ.", pronunciation_focus: ["verify", "unlock"] },
      { en: "I'll also send you a password reset link.", vi: "Em gửi link đặt lại mật khẩu ạ.", pronunciation_focus: ["password", "reset"] },
      { en: "Try logging in again in 2 minutes.", vi: "Anh/chị thử đăng nhập lại sau 2 phút ạ.", pronunciation_focus: ["logging", "minutes"] },
    ],
    cultural_notes_vi:
      "Account lock thường vì khách quên mật khẩu → bực. Verify TRƯỚC, unlock sau — KHÔNG được unlock nếu chưa verify (compliance — bị fired nếu vi phạm). Đừng vì khách bực mà skip bước.",
    tip_advice_vi:
      "Sau khi unlock, BẮT BUỘC gửi password reset link — phòng ngừa cuộc gọi thứ hai. Khách quên mật khẩu cũ vẫn không vào được dù unlock. Một bước thừa cứu cuộc gọi.",
  },
];

// ── Aggregate + helpers ──────────────────────────────────────────────────

export const CUSTOMER_SERVICE_LESSONS: ReadonlyArray<CustomerServiceLesson> = [
  ...OPENING,
  ...ACTIVE_LISTENING,
  ...DE_ESCALATION,
  ...POLICY_NO,
  ...HOLD_TRANSFER,
  ...CONFIRM_FOLLOWUP,
  ...CLOSING,
  ...SPECIFIC_COMPLAINTS,
];

export function getLessonsByCategory(
  category: CustomerServiceCategoryId,
): CustomerServiceLesson[] {
  return CUSTOMER_SERVICE_LESSONS.filter((l) => l.category === category);
}

export function getLessonById(id: string): CustomerServiceLesson | undefined {
  return CUSTOMER_SERVICE_LESSONS.find((l) => l.id === id);
}

/** Pack-level metadata, mirroring the nail-tech default export shape. */
export const CUSTOMER_SERVICE_PACK = Object.freeze({
  slug: "customer-service",
  title_vi: "Tiếng Anh dành cho Customer Service",
  title_en: "English for customer service workers",
  intro_vi:
    "Tiếng Anh cho call center, retail support, banking front-line, telecom support, e-commerce CS. Made by người Việt — học cách handle khách Mỹ chuyên nghiệp. 50 bài tập trung vào hạ nhiệt khách giận, từ chối khéo, chuyển cuộc gọi, và những bẫy phát âm trên điện thoại.",
});

export default CUSTOMER_SERVICE_PACK;
