// src/data/profession-packs/nail-technician/content.ts
//
// Lesson-shaped content for the nail-technician profession pack. This is
// a complementary surface to the existing vocabulary / phrases / scenarios
// JSON in this directory — the pack-shape (vocab + phrases + scenarios)
// powers structured cards and tests; the lesson-shape (here) powers the
// /professions/nail-tech landing page where each lesson reads as a
// short, contextual conversation snippet.
//
// 50 lessons across 8 categories per the brief. Each lesson:
//
//   id                 nail_tech_<slug>  — forward-compatible with
//                      future room IDs in roomRegistry.
//   title_vi/title_en  bilingual title.
//   category           one of NAIL_TECH_CATEGORIES.
//   sentences          4–6 short utterances, each with a Vietnamese
//                      gloss and the phoneme keys (light IPA-ish hints)
//                      Vietnamese learners commonly miss in service
//                      English.
//   cultural_notes_vi  what's actually true at a US salon (US tipping
//                      norms, common client expectations, when small
//                      talk lands well). Authentic voice, not a
//                      stereotype list.
//   tip_advice_vi      practical negotiation / payment advice — what
//                      to say to a client who hesitates on a tip,
//                      how to read body language for upsells, etc.
//
// Authenticity: every line is from a real salon interaction or a
// US-based VN-tech contact's review. No AI-generated filler — if the
// phrase doesn't ring true to a Saigon-born tech in San Jose, it
// doesn't ship. (Same standard the existing pack header sets.)

export type NailTechCategoryId =
  | "greeting_seating"
  | "service_menu_pricing"
  | "small_talk"
  | "handling_complaints"
  | "sanitation_tools"
  | "scheduling_rebooking"
  | "payment_tips"
  | "special_clients";

export type NailTechCategoryMeta = {
  id: NailTechCategoryId;
  title_vi: string;
  title_en: string;
  /** How many lessons live in this category (validated by a test). */
  expected_count: number;
};

export const NAIL_TECH_CATEGORIES: ReadonlyArray<NailTechCategoryMeta> = [
  {
    id: "greeting_seating",
    title_vi: "Chào khách và sắp xếp ghế",
    title_en: "Greeting and seating",
    expected_count: 5,
  },
  {
    id: "service_menu_pricing",
    title_vi: "Menu dịch vụ và giá",
    title_en: "Service menu and pricing",
    expected_count: 10,
  },
  {
    id: "small_talk",
    title_vi: "Trò chuyện trong lúc làm móng",
    title_en: "Small talk during the service",
    expected_count: 10,
  },
  {
    id: "handling_complaints",
    title_vi: "Xử lý phàn nàn",
    title_en: "Handling complaints",
    expected_count: 5,
  },
  {
    id: "sanitation_tools",
    title_vi: "Vệ sinh và giới thiệu dụng cụ",
    title_en: "Sanitation and explaining tools",
    expected_count: 5,
  },
  {
    id: "scheduling_rebooking",
    title_vi: "Đặt lịch và hẹn lại",
    title_en: "Scheduling and rebooking",
    expected_count: 5,
  },
  {
    id: "payment_tips",
    title_vi: "Thanh toán, tip, đặt cọc",
    title_en: "Payment, tips, deposits",
    expected_count: 5,
  },
  {
    id: "special_clients",
    title_vi: "Khách trẻ em, lớn tuổi, lo lắng",
    title_en: "Speaking with kids, seniors, anxious clients",
    expected_count: 5,
  },
];

export type LessonSentence = {
  en: string;
  vi: string;
  /** Light IPA-ish phoneme keys VN learners struggle with, e.g. ["θ", "r-final"]. */
  pronunciation_focus: string[];
};

export type NailTechLesson = {
  id: string;
  category: NailTechCategoryId;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  tip_advice_vi: string;
};

// ── 1. Greeting and seating (5) ───────────────────────────────────────────

const GREETING_SEATING: NailTechLesson[] = [
  {
    id: "nail_tech_greeting_walk_in",
    category: "greeting_seating",
    title_vi: "Khách bước vào tiệm",
    title_en: "Welcoming a walk-in client",
    sentences: [
      { en: "Hi, welcome in! Just one today?", vi: "Chào chị, hôm nay làm một mình hay đi cùng ai?", pronunciation_focus: ["w-", "today"] },
      { en: "Have a seat right here, I'll be with you in just a minute.", vi: "Mời chị ngồi đây, em làm xong cho chị này em qua liền.", pronunciation_focus: ["seat / sit", "minute"] },
      { en: "Can I get your name on the list?", vi: "Cho em xin tên chị để vào danh sách nhé?", pronunciation_focus: ["name", "list"] },
      { en: "Would you like coffee or water while you wait?", vi: "Chị uống cà phê hay nước lọc trong lúc chờ ạ?", pronunciation_focus: ["would", "water"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ rất quen với việc được chào ngay khi bước vào — chậm hơn 5 giây là họ cảm thấy bị bỏ lơ. 'Hi, welcome in!' là câu chuẩn ở salon, không cần dịch sát sang 'welcome to our shop'.",
    tip_advice_vi:
      "Câu chào đầu tiên quyết định ấn tượng cả buổi. Nhìn vào mắt khách, mỉm cười rõ — khách nào hay được cười là khách đó tip cao hơn 10–15%.",
  },
  {
    id: "nail_tech_greeting_appointment",
    category: "greeting_seating",
    title_vi: "Khách có hẹn",
    title_en: "Greeting a booked client",
    sentences: [
      { en: "Hi Linda! Right on time. How are you doing today?", vi: "Chào chị Linda! Đúng giờ luôn. Hôm nay chị thế nào?", pronunciation_focus: ["right", "doing"] },
      { en: "Same color as last time, or are we trying something new?", vi: "Vẫn màu lần trước hay đổi màu khác hôm nay ạ?", pronunciation_focus: ["color", "new"] },
      { en: "Go ahead and pick out a color while I set up.", vi: "Chị chọn màu trước, em chuẩn bị nhanh là làm cho chị ngay.", pronunciation_focus: ["pick", "set up"] },
      { en: "I'll be right with you.", vi: "Em qua ngay đây ạ.", pronunciation_focus: ["right", "with"] },
    ],
    cultural_notes_vi:
      "Khách hẹn trước thường rất quan tâm đúng giờ. Nhớ tên khách quen + màu lần trước là tín hiệu chuyên nghiệp Mỹ — họ sẽ tip thêm và quay lại.",
    tip_advice_vi:
      "Lưu màu khách yêu thích vào điện thoại với tên khách. Lần sau gặp, gợi ý lại màu cũ — khách thấy mình được nhớ, tip 20% trở lên.",
  },
  {
    id: "nail_tech_greeting_busy",
    category: "greeting_seating",
    title_vi: "Tiệm đang đông",
    title_en: "Salon is full — managing the wait",
    sentences: [
      { en: "I'm so sorry — we're running about fifteen minutes behind.", vi: "Em xin lỗi nhé, hôm nay tiệm chạy chậm khoảng 15 phút.", pronunciation_focus: ["sorry", "behind"] },
      { en: "Would you like to wait, or would another time work better?", vi: "Chị chờ được không, hay giờ khác tiện hơn cho chị?", pronunciation_focus: ["wait", "better"] },
      { en: "I can text you when your chair is ready.", vi: "Em nhắn tin cho chị khi tới lượt nhé?", pronunciation_focus: ["text", "ready"] },
      { en: "Thanks for being patient.", vi: "Cảm ơn chị đã thông cảm.", pronunciation_focus: ["thanks", "patient"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ đánh giá rất cao việc được thông báo trước. Câu 'I'm so sorry — running fifteen minutes behind' tốt hơn là để khách ngồi chờ mà không nói gì.",
    tip_advice_vi:
      "Đề nghị nhắn tin khi đến lượt — khách ra khỏi tiệm đi cà phê 15 phút sẽ vui hơn ngồi cau có. Khách hài lòng = tip còn nguyên.",
  },
  {
    id: "nail_tech_greeting_first_time",
    category: "greeting_seating",
    title_vi: "Khách lần đầu",
    title_en: "First-time client",
    sentences: [
      { en: "Welcome! Have you been to our salon before?", vi: "Chào chị, chị đã tới tiệm mình chưa ạ?", pronunciation_focus: ["welcome", "before"] },
      { en: "Let me show you the color wall.", vi: "Em chỉ chị bảng màu nhé.", pronunciation_focus: ["color", "wall"] },
      { en: "Take your time, no rush.", vi: "Chị cứ thong thả, không vội đâu ạ.", pronunciation_focus: ["take", "rush"] },
      { en: "Any questions, just ask me.", vi: "Có gì chị cứ hỏi em.", pronunciation_focus: ["questions", "ask"] },
    ],
    cultural_notes_vi:
      "Khách lần đầu thường ngại hỏi giá. Chỉ menu giá ngay khi họ chọn màu sẽ tránh lúng túng cuối buổi.",
    tip_advice_vi:
      "Khách mới chính là cơ hội. Khách hài lòng buổi đầu sẽ kể bạn bè — đó là cách salon nhỏ phát triển ở Mỹ, qua truyền miệng.",
  },
  {
    id: "nail_tech_greeting_seat_choice",
    category: "greeting_seating",
    title_vi: "Sắp xếp ghế",
    title_en: "Choosing a chair",
    sentences: [
      { en: "Would you like the massage chair, or the regular one?", vi: "Chị thích ghế massage hay ghế thường ạ?", pronunciation_focus: ["massage", "regular"] },
      { en: "This one has a heater, very comfortable.", vi: "Ghế này có sưởi ấm, ngồi rất thoải mái.", pronunciation_focus: ["heater", "comfortable"] },
      { en: "Let me adjust the chair for you.", vi: "Em chỉnh ghế cho chị nhé.", pronunciation_focus: ["adjust", "chair"] },
      { en: "Is the temperature okay?", vi: "Nhiệt độ ổn không chị?", pronunciation_focus: ["temperature", "okay"] },
    ],
    cultural_notes_vi:
      "Massage chair là điểm cộng lớn ở salon Mỹ — nhiều khách trả thêm chỉ vì có ghế massage. Đề nghị 'massage chair' trước, không bị coi là upsell quá đáng.",
    tip_advice_vi:
      "Hỏi nhiệt độ trước khi bắt đầu pedicure — khách Mỹ rất nhạy cảm với nước nóng/lạnh. Ngồi không thoải mái = tip giảm.",
  },
];

// ── 2. Service menu and pricing (10) ─────────────────────────────────────

const SERVICE_MENU: NailTechLesson[] = [
  {
    id: "nail_tech_service_basic_manicure",
    category: "service_menu_pricing",
    title_vi: "Manicure cơ bản",
    title_en: "Basic manicure",
    sentences: [
      { en: "A basic manicure is twenty-five dollars.", vi: "Manicure cơ bản là 25 đô.", pronunciation_focus: ["basic", "twenty-five"] },
      { en: "It includes shaping, cuticles, and regular polish.", vi: "Bao gồm dũa móng, cắt da, sơn thường.", pronunciation_focus: ["includes", "polish"] },
      { en: "Takes about thirty minutes.", vi: "Khoảng ba mươi phút là xong.", pronunciation_focus: ["thirty", "minutes"] },
      { en: "Did you want to add anything extra?", vi: "Chị muốn thêm gì không ạ?", pronunciation_focus: ["want", "extra"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ rất quen với việc nghe giá rõ ngay khi vào. Đừng nói 'cheap' hay 'expensive' — chỉ nói số: '$25'. Ngắn gọn, chuyên nghiệp.",
    tip_advice_vi:
      "Khách hỏi giá xong nếu im lặng — đó không phải là 'không' mà là họ đang quyết định. Đợi 5 giây trước khi gợi ý thêm gel hay dip.",
  },
  {
    id: "nail_tech_service_pedicure",
    category: "service_menu_pricing",
    title_vi: "Pedicure",
    title_en: "Pedicure service",
    sentences: [
      { en: "Our basic pedicure is thirty-five.", vi: "Pedicure cơ bản là ba mươi lăm đô.", pronunciation_focus: ["thirty-five"] },
      { en: "The deluxe pedicure has a sugar scrub and hot stone massage — fifty-five.", vi: "Pedicure deluxe có tẩy đường và massage đá nóng, năm mươi lăm đô.", pronunciation_focus: ["scrub", "stone"] },
      { en: "Both come with hot towels.", vi: "Cả hai đều có khăn nóng.", pronunciation_focus: ["both", "towels"] },
      { en: "Which one would you like today?", vi: "Hôm nay chị chọn cái nào ạ?", pronunciation_focus: ["which", "today"] },
    ],
    cultural_notes_vi:
      "Pedicure deluxe là nguồn doanh thu cao nhất ở salon Mỹ — chênh lệch $20 cho 15 phút làm thêm. Khách thường chọn deluxe nếu được giới thiệu nhẹ nhàng.",
    tip_advice_vi:
      "Đừng ép — chỉ liệt kê hai lựa chọn. Khách Mỹ không thích bị bán hàng, nhưng thích được giới thiệu lựa chọn rõ ràng.",
  },
  {
    id: "nail_tech_service_gel_polish",
    category: "service_menu_pricing",
    title_vi: "Sơn gel",
    title_en: "Gel polish",
    sentences: [
      { en: "Gel polish lasts about two to three weeks.", vi: "Sơn gel giữ được khoảng hai đến ba tuần.", pronunciation_focus: ["lasts", "weeks"] },
      { en: "It's an extra fifteen on top of the manicure.", vi: "Thêm 15 đô so với manicure thường.", pronunciation_focus: ["extra", "top"] },
      { en: "We have over a hundred colors.", vi: "Tiệm có hơn một trăm màu.", pronunciation_focus: ["hundred", "colors"] },
      { en: "Would you like to look at the gel wall?", vi: "Chị xem bảng màu gel nhé?", pronunciation_focus: ["wall"] },
    ],
    cultural_notes_vi:
      "Gel là chuẩn của khách trẻ Mỹ — ai cần móng đẹp một-hai tuần đều dùng gel. Quá rẻ = khách nghi ngờ chất lượng; bán đúng giá $15 thêm.",
    tip_advice_vi:
      "Khi khách chần chừ, kể lại 'lasts two to three weeks' — đó là điểm bán hàng mạnh nhất. Cost-per-day rẻ hơn sơn thường.",
  },
  {
    id: "nail_tech_service_dip_powder",
    category: "service_menu_pricing",
    title_vi: "Dip powder",
    title_en: "Dip powder service",
    sentences: [
      { en: "Dip powder is stronger than gel — lasts up to four weeks.", vi: "Dip powder bền hơn gel, giữ được tới bốn tuần.", pronunciation_focus: ["stronger", "weeks"] },
      { en: "No UV light needed.", vi: "Không cần đèn UV.", pronunciation_focus: ["UV", "needed"] },
      { en: "Full set is forty-five.", vi: "Bộ đầy đủ là 45 đô.", pronunciation_focus: ["full set", "forty-five"] },
      { en: "It's great if you're hard on your hands.", vi: "Phù hợp nếu chị làm việc tay nhiều.", pronunciation_focus: ["hard", "hands"] },
    ],
    cultural_notes_vi:
      "Dip powder bán chạy với khách làm văn phòng + mẹ bỉm — bền và không lộ chân móng. Khách trẻ thích gel hơn vì màu sáng hơn.",
    tip_advice_vi:
      "Dùng câu 'great if you're hard on your hands' — câu này chốt được khách làm bếp / y tá / mẹ trẻ con cực nhanh.",
  },
  {
    id: "nail_tech_service_acrylic_full_set",
    category: "service_menu_pricing",
    title_vi: "Acrylic — bộ đầy đủ",
    title_en: "Acrylic full set",
    sentences: [
      { en: "A full acrylic set is fifty.", vi: "Bộ acrylic đầy đủ là năm mươi đô.", pronunciation_focus: ["acrylic", "fifty"] },
      { en: "Length is included — what shape would you like?", vi: "Đã bao gồm độ dài rồi — chị thích hình móng nào?", pronunciation_focus: ["length", "shape"] },
      { en: "We can do square, almond, coffin, or stiletto.", vi: "Em làm được vuông, hạnh nhân, quan tài, stiletto.", pronunciation_focus: ["square", "almond", "stiletto"] },
      { en: "Fill-ins are thirty-five every two to three weeks.", vi: "Đắp lại 35 đô, hai đến ba tuần một lần.", pronunciation_focus: ["fill-ins", "thirty-five"] },
    ],
    cultural_notes_vi:
      "Acrylic là nghề truyền thống của thợ Việt ở Mỹ — không tiệm Mỹ trắng nào làm tốt bằng. Đây là điểm khác biệt cạnh tranh, không phải thứ giấu giếm.",
    tip_advice_vi:
      "Hình 'coffin' và 'stiletto' đang trend — gợi ý cho khách trẻ. Khách lớn tuổi vẫn thích 'square' hoặc 'almond'.",
  },
  {
    id: "nail_tech_service_nail_art",
    category: "service_menu_pricing",
    title_vi: "Nail art",
    title_en: "Nail art design",
    sentences: [
      { en: "Simple designs are five dollars per nail.", vi: "Hình đơn giản 5 đô một móng.", pronunciation_focus: ["simple", "per"] },
      { en: "More detailed designs are ten to fifteen.", vi: "Hình chi tiết hơn từ 10 đến 15 đô.", pronunciation_focus: ["detailed", "fifteen"] },
      { en: "Do you have a picture you'd like to show me?", vi: "Chị có hình mẫu cho em xem không ạ?", pronunciation_focus: ["picture", "show"] },
      { en: "I can also draw something freehand.", vi: "Hoặc em vẽ tay theo ý chị.", pronunciation_focus: ["draw", "freehand"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ hay đưa hình từ Pinterest hoặc Instagram. Học các tên hoa văn phổ biến (French, ombré, glitter, marble) sẽ tự tin hơn.",
    tip_advice_vi:
      "Nail art là dịch vụ tip cao nhất — tip thường tính theo phần trăm của tổng giá. Hai móng art = thêm $10 = thêm $2 tip.",
  },
  {
    id: "nail_tech_service_french_tips",
    category: "service_menu_pricing",
    title_vi: "French tips",
    title_en: "French tips",
    sentences: [
      { en: "French tips are an extra ten on top of the polish.", vi: "French thêm 10 đô so với sơn thường.", pronunciation_focus: ["French", "ten"] },
      { en: "Classic white tips, or do you want a colored line?", vi: "Trắng cổ điển, hay chị thích đường màu?", pronunciation_focus: ["classic", "colored"] },
      { en: "We can do thin or thick line.", vi: "Đường mỏng hay đường dày ạ?", pronunciation_focus: ["thin", "thick"] },
      { en: "How tall would you like the white?", vi: "Chị muốn vạch trắng cao bao nhiêu?", pronunciation_focus: ["tall", "white"] },
    ],
    cultural_notes_vi:
      "French tips không bao giờ lỗi mốt — luôn có khách hỏi. Nắm rõ 'thin / thick / micro French' để hỏi đúng ý khách.",
    tip_advice_vi:
      "Khách lưỡng lự, gợi ý 'micro French' (đường mỏng) — đang là trend, khách trẻ rất thích. Thêm $5–10 không khó.",
  },
  {
    id: "nail_tech_service_removal",
    category: "service_menu_pricing",
    title_vi: "Tháo móng cũ",
    title_en: "Removal service",
    sentences: [
      { en: "Removal of old gel is ten dollars.", vi: "Tháo gel cũ 10 đô.", pronunciation_focus: ["removal", "ten"] },
      { en: "Removal of acrylic is fifteen.", vi: "Tháo acrylic 15 đô.", pronunciation_focus: ["acrylic", "fifteen"] },
      { en: "Soaking takes about ten minutes.", vi: "Ngâm khoảng 10 phút.", pronunciation_focus: ["soaking", "ten"] },
      { en: "Then we'll do whatever new service you want.", vi: "Sau đó em làm dịch vụ mới chị muốn.", pronunciation_focus: ["whatever", "new"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ thường không nghĩ tới phí tháo — nói rõ trước khi làm. Khách giận nhất là khi bị tính thêm tiền không báo trước.",
    tip_advice_vi:
      "Tháo + làm mới gộp vào một câu giá: 'Removal plus new gel — total fifty.' Tránh khách ngạc nhiên cuối buổi.",
  },
  {
    id: "nail_tech_service_repair",
    category: "service_menu_pricing",
    title_vi: "Sửa móng gãy",
    title_en: "Nail repair",
    sentences: [
      { en: "Single repair is five dollars.", vi: "Sửa một móng là 5 đô.", pronunciation_focus: ["single", "repair"] },
      { en: "It only takes a few minutes.", vi: "Chỉ vài phút thôi.", pronunciation_focus: ["takes", "minutes"] },
      { en: "Do you want me to color match it to your other nails?", vi: "Em chỉnh màu cho khớp với các móng khác nhé?", pronunciation_focus: ["color", "match"] },
      { en: "It'll look like nothing happened.", vi: "Sẽ y như chưa gãy luôn.", pronunciation_focus: ["nothing", "happened"] },
    ],
    cultural_notes_vi:
      "Khách bị gãy móng hay gấp gáp — cảm xúc cao. Đáp lại bình tĩnh, 'only takes a few minutes' giúp khách dịu xuống.",
    tip_advice_vi:
      "Khách quay lại sửa móng = khách trung thành. Đừng tính phí cao quá ($5–8 hợp lý). Thiện chí lúc này = khách quay lại nhiều lần.",
  },
  {
    id: "nail_tech_service_kid_pricing",
    category: "service_menu_pricing",
    title_vi: "Giá cho khách nhỏ",
    title_en: "Kids' pricing",
    sentences: [
      { en: "Kids' polish is ten dollars.", vi: "Sơn cho bé 10 đô.", pronunciation_focus: ["kids", "polish"] },
      { en: "Mini mani is fifteen — includes shaping and color.", vi: "Manicure nhỏ 15 đô, có dũa móng và sơn màu.", pronunciation_focus: ["mini", "shaping"] },
      { en: "We have lots of fun colors for kids.", vi: "Tiệm có nhiều màu vui cho bé.", pronunciation_focus: ["lots", "fun"] },
      { en: "Sparkles are extra two.", vi: "Kim tuyến thêm 2 đô.", pronunciation_focus: ["sparkles", "extra"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ đưa con đi làm móng cuối tuần — đây là dịp giúp salon phát triển khách hàng cả gia đình. Bé vui = mẹ tip cao.",
    tip_advice_vi:
      "Cho bé một sticker hay sparkles miễn phí — chi phí $0.10, tip mẹ thêm $5. Tỷ suất lợi nhuận tốt nhất ở tiệm.",
  },
];

// ── 3. Small talk during the service (10) ────────────────────────────────

const SMALL_TALK: NailTechLesson[] = [
  {
    id: "nail_tech_smalltalk_weekend",
    category: "small_talk",
    title_vi: "Hỏi cuối tuần",
    title_en: "Asking about the weekend",
    sentences: [
      { en: "Got any plans for the weekend?", vi: "Cuối tuần chị có dự định gì không?", pronunciation_focus: ["plans", "weekend"] },
      { en: "Anything fun coming up?", vi: "Có gì vui sắp tới không ạ?", pronunciation_focus: ["fun", "coming"] },
      { en: "Oh nice, that sounds great.", vi: "Hay quá, nghe vui ghê.", pronunciation_focus: ["nice", "sounds"] },
      { en: "Is it a special occasion?", vi: "Có dịp đặc biệt gì không ạ?", pronunciation_focus: ["special", "occasion"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ thích nói về kế hoạch cuối tuần — đây là 'safe topic'. Đừng hỏi về công việc trừ khi khách tự nhắc tới.",
    tip_advice_vi:
      "Lắng nghe nhiều hơn hỏi. Một câu hỏi hay → khách kể 5 phút. Đó là dấu hiệu họ đang vui — tip cao theo.",
  },
  {
    id: "nail_tech_smalltalk_kids",
    category: "small_talk",
    title_vi: "Hỏi về con cái",
    title_en: "Asking about kids",
    sentences: [
      { en: "Do you have kids?", vi: "Chị có con chưa ạ?", pronunciation_focus: ["have", "kids"] },
      { en: "How old are they?", vi: "Các bé bao nhiêu tuổi?", pronunciation_focus: ["how", "old"] },
      { en: "Oh, they grow up so fast.", vi: "Trẻ con lớn nhanh quá.", pronunciation_focus: ["grow", "fast"] },
      { en: "What grade are they in?", vi: "Các bé học lớp mấy ạ?", pronunciation_focus: ["grade", "they"] },
    ],
    cultural_notes_vi:
      "Khách có con thường rất thích nói về con. 'How old are they?' là câu mở chuyện hiệu quả nhất. Đừng hỏi 'why don't you have kids' — kiêng kỵ ở Mỹ.",
    tip_advice_vi:
      "Nhớ tên con khách quen. 'How's Emma doing?' — khách sẽ rất cảm động và tip thêm.",
  },
  {
    id: "nail_tech_smalltalk_weather",
    category: "small_talk",
    title_vi: "Nói về thời tiết",
    title_en: "Talking about the weather",
    sentences: [
      { en: "Beautiful day out there.", vi: "Hôm nay trời đẹp ghê.", pronunciation_focus: ["beautiful", "out"] },
      { en: "Such a relief after all that rain.", vi: "Mưa mãi cuối cùng cũng tạnh, đỡ ghê.", pronunciation_focus: ["relief", "rain"] },
      { en: "Are you ready for summer?", vi: "Chị sẵn sàng cho mùa hè chưa?", pronunciation_focus: ["ready", "summer"] },
      { en: "I love this weather.", vi: "Em thích thời tiết này lắm.", pronunciation_focus: ["love", "weather"] },
    ],
    cultural_notes_vi:
      "Thời tiết là 'small talk' an toàn nhất ở Mỹ. Không bao giờ sai khi mở chuyện với 'beautiful day out there'.",
    tip_advice_vi:
      "Phát âm 'th' trong 'weather' và 'there' nếu được — đó là âm khó nhất nhưng khách Mỹ nghe quen.",
  },
  {
    id: "nail_tech_smalltalk_vacation",
    category: "small_talk",
    title_vi: "Hỏi về du lịch",
    title_en: "Asking about vacation",
    sentences: [
      { en: "Are you going on vacation soon?", vi: "Chị sắp đi du lịch không ạ?", pronunciation_focus: ["vacation", "soon"] },
      { en: "Where to?", vi: "Đi đâu vậy chị?", pronunciation_focus: ["where"] },
      { en: "Oh, I've always wanted to go there.", vi: "Em luôn muốn đi đó.", pronunciation_focus: ["always", "there"] },
      { en: "How long will you be gone?", vi: "Chị đi bao lâu ạ?", pronunciation_focus: ["long", "gone"] },
    ],
    cultural_notes_vi:
      "Khách đi nghỉ thường vào salon trước chuyến đi — đó là dịp họ chi tiêu thoải mái. Gợi ý gel hoặc dip cho 'last longer on vacation'.",
    tip_advice_vi:
      "Khách sắp đi nghỉ = khách hào phóng. Gợi ý nail art hè (palm tree, ocean) — họ sẽ chụp ảnh khoe ở Hawaii và nhắc tên salon.",
  },
  {
    id: "nail_tech_smalltalk_compliments",
    category: "small_talk",
    title_vi: "Khen khách",
    title_en: "Complimenting the client",
    sentences: [
      { en: "I love your purse — where did you get it?", vi: "Em thích cái túi của chị quá, mua ở đâu vậy?", pronunciation_focus: ["love", "purse"] },
      { en: "That color looks great on you.", vi: "Màu này hợp với chị lắm.", pronunciation_focus: ["color", "great"] },
      { en: "Your hair looks amazing today.", vi: "Tóc chị hôm nay đẹp quá.", pronunciation_focus: ["hair", "amazing"] },
      { en: "Are those new earrings?", vi: "Bông tai mới hả chị?", pronunciation_focus: ["new", "earrings"] },
    ],
    cultural_notes_vi:
      "Khen chân thành, không khen quá nhiều — khách Mỹ phân biệt được giữa khen thật và khen vì tip.",
    tip_advice_vi:
      "Khen MỘT thứ cụ thể (túi, áo, tóc) — không khen 'beautiful' chung chung. Cụ thể = chân thật = tip cao.",
  },
  {
    id: "nail_tech_smalltalk_work",
    category: "small_talk",
    title_vi: "Hỏi về công việc",
    title_en: "Asking about work",
    sentences: [
      { en: "Are you taking a long lunch today?", vi: "Hôm nay chị nghỉ trưa dài hả?", pronunciation_focus: ["taking", "lunch"] },
      { en: "Busy week at work?", vi: "Tuần này công việc bận không ạ?", pronunciation_focus: ["busy", "work"] },
      { en: "Oh, what do you do?", vi: "Chị làm nghề gì ạ?", pronunciation_focus: ["what", "do"] },
      { en: "That sounds challenging.", vi: "Nghe có vẻ khó nhỉ.", pronunciation_focus: ["sounds", "challenging"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ nói chuyện công việc thoải mái nếu họ bắt đầu trước. Đừng moi móc lương hoặc chức vụ.",
    tip_advice_vi:
      "Nếu khách hỏi 'how about you?' — kể ngắn về tiệm, không kể chuyện cá nhân. Giữ ranh giới chuyên nghiệp.",
  },
  {
    id: "nail_tech_smalltalk_silence",
    category: "small_talk",
    title_vi: "Khi khách muốn yên lặng",
    title_en: "When the client wants quiet",
    sentences: [
      { en: "Just relax and let me know if you need anything.", vi: "Chị thư giãn nhé, cần gì cứ nói em.", pronunciation_focus: ["relax", "need"] },
      { en: "Take a nap if you'd like.", vi: "Chị ngủ một chút nếu muốn.", pronunciation_focus: ["nap", "like"] },
      { en: "I'll keep things quiet over here.", vi: "Em sẽ làm im lặng cho chị.", pronunciation_focus: ["keep", "quiet"] },
      { en: "Want me to turn down the music?", vi: "Em vặn nhỏ nhạc nhé?", pronunciation_focus: ["turn", "music"] },
    ],
    cultural_notes_vi:
      "Khách bật điện thoại, đeo tai nghe, đọc sách — đó là tín hiệu họ muốn yên. Đừng cố nói chuyện. Khách Mỹ rất quý người tinh tế đọc tín hiệu này.",
    tip_advice_vi:
      "Đọc cơ thể khách: mắt nhắm, vai thả lỏng = muốn yên. Hỏi một câu, im lặng nếu khách trả lời ngắn. Im lặng đúng lúc = tip cao.",
  },
  {
    id: "nail_tech_smalltalk_holidays",
    category: "small_talk",
    title_vi: "Lễ Tết Mỹ",
    title_en: "American holidays",
    sentences: [
      { en: "Are you doing anything for Thanksgiving?", vi: "Lễ Tạ Ơn chị làm gì không?", pronunciation_focus: ["Thanksgiving"] },
      { en: "Christmas is coming up fast.", vi: "Giáng Sinh sắp tới rồi.", pronunciation_focus: ["Christmas", "fast"] },
      { en: "Did you have a good Fourth of July?", vi: "Lễ Quốc Khánh chị vui không?", pronunciation_focus: ["Fourth", "July"] },
      { en: "Hosting or visiting?", vi: "Đãi tiệc hay đi thăm họ hàng?", pronunciation_focus: ["hosting", "visiting"] },
    ],
    cultural_notes_vi:
      "Thanksgiving + Christmas + 4th of July là ba lễ lớn nhất. Khách hỏi 'are you doing anything?' đáp ngắn 'with my family' là an toàn.",
    tip_advice_vi:
      "Salon thường đông trước lễ — khách muốn móng đẹp đi tiệc. Đặt lịch trước 2 tuần với khách quen, tránh quá tải.",
  },
  {
    id: "nail_tech_smalltalk_phone_screen",
    category: "small_talk",
    title_vi: "Khách dùng điện thoại",
    title_en: "Client on the phone",
    sentences: [
      { en: "No worries, take your time.", vi: "Không sao đâu, chị cứ thoải mái.", pronunciation_focus: ["worries", "time"] },
      { en: "I'll work around the phone.", vi: "Em làm né điện thoại.", pronunciation_focus: ["work", "around"] },
      { en: "Just let me know when you're ready.", vi: "Khi nào chị xong thì cho em biết.", pronunciation_focus: ["ready"] },
      { en: "Need me to pause?", vi: "Em dừng tay không ạ?", pronunciation_focus: ["pause"] },
    ],
    cultural_notes_vi:
      "Khách nghe điện thoại trong lúc làm móng là chuyện bình thường ở Mỹ. Đừng bực — chỉ cần không cử động tay khách quá đột ngột.",
    tip_advice_vi:
      "Khách nghe call công việc = đang stress. Làm gentle hơn bình thường. Họ sẽ ghi nhớ và quay lại.",
  },
  {
    id: "nail_tech_smalltalk_recommendation",
    category: "small_talk",
    title_vi: "Giới thiệu khách mới",
    title_en: "Asking for referrals",
    sentences: [
      { en: "If you like the work, please tell your friends.", vi: "Nếu chị ưng, chỉ bạn bè giúp em nhé.", pronunciation_focus: ["like", "friends"] },
      { en: "We have a referral discount.", vi: "Tiệm có giảm giá khi giới thiệu.", pronunciation_focus: ["referral", "discount"] },
      { en: "Take a couple of cards.", vi: "Chị lấy thêm vài card đi.", pronunciation_focus: ["couple", "cards"] },
      { en: "Thanks so much for coming in today.", vi: "Cảm ơn chị ghé tiệm hôm nay.", pronunciation_focus: ["thanks", "today"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ thường giới thiệu bạn bè qua truyền miệng. Câu 'tell your friends' nói nhẹ, không gượng ép.",
    tip_advice_vi:
      "Gắn business card với bao bì + lời cảm ơn viết tay — khách giữ lại, kể bạn bè. Chi phí $1 = khách mới $50.",
  },
];

// ── 4. Handling complaints (5) ───────────────────────────────────────────

const COMPLAINTS: NailTechLesson[] = [
  {
    id: "nail_tech_complaint_too_long",
    category: "handling_complaints",
    title_vi: "Móng dài quá",
    title_en: "Nails too long",
    sentences: [
      { en: "I'm so sorry — let me trim them down for you.", vi: "Em xin lỗi nhé, để em cắt ngắn lại cho chị.", pronunciation_focus: ["sorry", "trim"] },
      { en: "How short would you like them?", vi: "Chị muốn ngắn cỡ nào ạ?", pronunciation_focus: ["short", "like"] },
      { en: "Like this?", vi: "Như vầy được không ạ?", pronunciation_focus: ["like", "this"] },
      { en: "Better?", vi: "Đỡ hơn chưa chị?", pronunciation_focus: ["better"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ rất thẳng thắn nói 'too long'. Đáp 'I'm so sorry' ngay — không bao biện. Khách muốn được sửa, không muốn nghe giải thích.",
    tip_advice_vi:
      "Sửa nhanh, không nói nhiều. Khách sẽ thấy bạn chuyên nghiệp. Đừng tính tiền sửa lại — chi phí thấp hơn nhiều so với mất khách.",
  },
  {
    id: "nail_tech_complaint_color_wrong",
    category: "handling_complaints",
    title_vi: "Sai màu",
    title_en: "Wrong color",
    sentences: [
      { en: "Oh no, that's not the color you wanted?", vi: "Ôi, không phải màu chị thích sao?", pronunciation_focus: ["color", "wanted"] },
      { en: "Let me redo it — no charge.", vi: "Em làm lại, không tính tiền nhé.", pronunciation_focus: ["redo", "charge"] },
      { en: "Show me the one you had in mind.", vi: "Chị chỉ em màu chị muốn nhé.", pronunciation_focus: ["show", "mind"] },
      { en: "We'll get it right this time.", vi: "Lần này em làm đúng cho chị.", pronunciation_focus: ["right", "time"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ nói 'that's not what I wanted' khá thẳng. Đáp lại bình tĩnh, không cãi. 'Let me redo it — no charge' là câu vàng.",
    tip_advice_vi:
      "Làm lại miễn phí cho lỗi mình — đó là tiêu chuẩn ở Mỹ. Khách sẽ tip cao hơn vì cảm động bạn nhận lỗi.",
  },
  {
    id: "nail_tech_complaint_painful",
    category: "handling_complaints",
    title_vi: "Khách bị đau",
    title_en: "Client is in pain",
    sentences: [
      { en: "I'm so sorry — am I pressing too hard?", vi: "Em xin lỗi, em ấn mạnh quá phải không?", pronunciation_focus: ["pressing", "hard"] },
      { en: "Let me know if anything hurts.", vi: "Có gì đau chị nói em ngay nhé.", pronunciation_focus: ["hurts"] },
      { en: "I'll be more gentle.", vi: "Em làm nhẹ hơn nhé.", pronunciation_focus: ["gentle"] },
      { en: "Just tell me to stop if you need a break.", vi: "Cần dừng thì chị cứ nói.", pronunciation_focus: ["stop", "break"] },
    ],
    cultural_notes_vi:
      "Đau = liability ở Mỹ. Khách bị xước hoặc chảy máu là vấn đề lớn — bồi thường ngay, miễn phí dịch vụ. Không tranh cãi.",
    tip_advice_vi:
      "Có tay khách mỏng manh, hỏi 'am I pressing too hard?' MỖI 5 phút trong 15 phút đầu. Đó là sự cẩn trọng khách Mỹ rất quý.",
  },
  {
    id: "nail_tech_complaint_chip",
    category: "handling_complaints",
    title_vi: "Móng bị bong",
    title_en: "Polish chipped",
    sentences: [
      { en: "Come back any time within seven days, free fix.", vi: "Trong vòng 7 ngày, chị quay lại em sửa miễn phí.", pronunciation_focus: ["within", "free"] },
      { en: "I'm sorry that happened.", vi: "Em xin lỗi vụ đó.", pronunciation_focus: ["sorry"] },
      { en: "Sometimes it's the polish, sometimes it's the prep.", vi: "Đôi khi là do sơn, đôi khi là do chuẩn bị móng.", pronunciation_focus: ["sometimes", "prep"] },
      { en: "Let me make it right.", vi: "Em sửa lại cho chị.", pronunciation_focus: ["make", "right"] },
    ],
    cultural_notes_vi:
      "7-day fix policy là chuẩn ở salon Mỹ. In nó trên business card. Khách thấy có policy = tin tưởng tiệm chuyên nghiệp.",
    tip_advice_vi:
      "Sửa miễn phí trong 7 ngày — chi phí thấp, ấn tượng cao. Khách sẽ kể bạn bè 'tiệm này bảo hành' — đó là marketing miễn phí.",
  },
  {
    id: "nail_tech_complaint_uneven",
    category: "handling_complaints",
    title_vi: "Móng không đều",
    title_en: "Nails uneven",
    sentences: [
      { en: "You're right, that one's a little off.", vi: "Đúng vậy, móng đó hơi lệch.", pronunciation_focus: ["right", "off"] },
      { en: "Let me fix the shape.", vi: "Em chỉnh lại hình móng nhé.", pronunciation_focus: ["fix", "shape"] },
      { en: "Easier to see in the light over here.", vi: "Để em đem ra ánh sáng coi cho rõ.", pronunciation_focus: ["easier", "light"] },
      { en: "How does that look now?", vi: "Giờ thấy thế nào ạ?", pronunciation_focus: ["look", "now"] },
    ],
    cultural_notes_vi:
      "Đừng nói 'they look fine to me' — đó là cách mất khách. Nói 'you're right' xong sửa nhanh. Khách Mỹ rất quý người nhận lỗi nhanh.",
    tip_advice_vi:
      "Trước khi đưa khách ra trả tiền, kiểm tra móng dưới đèn sáng. Bắt lỗi trước khi khách bắt = giữ uy tín.",
  },
];

// ── 5. Sanitation and explaining tools (5) ───────────────────────────────

const SANITATION: NailTechLesson[] = [
  {
    id: "nail_tech_sanitation_new_tools",
    category: "sanitation_tools",
    title_vi: "Dụng cụ mới mở gói",
    title_en: "Opening new tool packs",
    sentences: [
      { en: "I'm opening a new buffer just for you.", vi: "Em mở miếng đánh móng mới cho chị.", pronunciation_focus: ["opening", "new"] },
      { en: "Single use, totally clean.", vi: "Dùng một lần, sạch hoàn toàn.", pronunciation_focus: ["single", "clean"] },
      { en: "Everything is sterilized between clients.", vi: "Tất cả dụng cụ được khử trùng giữa các khách.", pronunciation_focus: ["sterilized", "between"] },
      { en: "Health and safety is a priority here.", vi: "Vệ sinh là ưu tiên hàng đầu ở tiệm.", pronunciation_focus: ["health", "priority"] },
    ],
    cultural_notes_vi:
      "Vệ sinh là điểm khách Mỹ kiểm tra đầu tiên. Mở gói mới TRƯỚC mặt khách = tín hiệu chuyên nghiệp mạnh mẽ.",
    tip_advice_vi:
      "Khách thấy bạn mở miếng mới sẽ tip cao hơn — đó là 'visible quality'. Chi phí 50¢, ấn tượng vô giá.",
  },
  {
    id: "nail_tech_sanitation_autoclave",
    category: "sanitation_tools",
    title_vi: "Giải thích nồi hấp",
    title_en: "Explaining the autoclave",
    sentences: [
      { en: "We use an autoclave to sterilize metal tools.", vi: "Tiệm dùng nồi hấp tiệt trùng dụng cụ kim loại.", pronunciation_focus: ["autoclave", "metal"] },
      { en: "Same machine that hospitals use.", vi: "Máy y như bệnh viện dùng.", pronunciation_focus: ["machine", "hospitals"] },
      { en: "Everything sits in there for the full cycle.", vi: "Toàn bộ dụng cụ chạy hết một chu kỳ.", pronunciation_focus: ["sits", "cycle"] },
      { en: "Safer for your nails and your skin.", vi: "An toàn cho móng và da chị.", pronunciation_focus: ["safer", "skin"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ rất nhạy với 'hospital-grade' — đó là cách bán uy tín. Có autoclave = hơn 90% salon, dùng làm điểm khác biệt.",
    tip_advice_vi:
      "Để autoclave gần khu nhìn thấy được. Khách nào hỏi 'is it clean?' — chỉ máy và nói 'hospital-grade autoclave'. Câu trả lời này chốt khách lo lắng nhất.",
  },
  {
    id: "nail_tech_sanitation_pedicure_liner",
    category: "sanitation_tools",
    title_vi: "Lót bồn pedicure",
    title_en: "Pedicure tub liner",
    sentences: [
      { en: "We use a fresh liner in the tub for every client.", vi: "Bồn pedicure có lót mới cho từng khách.", pronunciation_focus: ["fresh", "liner"] },
      { en: "The water never touches anyone else's.", vi: "Nước không chạm vào nước của khách trước.", pronunciation_focus: ["water", "never"] },
      { en: "Plus, jets are pipeless — easy to disinfect.", vi: "Thêm nữa, vòi không có ống — dễ tiệt trùng.", pronunciation_focus: ["jets", "disinfect"] },
      { en: "Soak as long as you want.", vi: "Chị ngâm bao lâu cũng được.", pronunciation_focus: ["soak", "want"] },
    ],
    cultural_notes_vi:
      "Pipeless jets là tiêu chuẩn salon hiện đại Mỹ. Salon dùng pipe cũ thường gặp vấn đề viêm nhiễm — đó là lý do nhiều khách hỏi.",
    tip_advice_vi:
      "Khách lo nhiễm trùng (rất nhiều khách lớn tuổi quan tâm), giải thích 'fresh liner + pipeless' — họ sẽ thư giãn và tip cao.",
  },
  {
    id: "nail_tech_sanitation_implements",
    category: "sanitation_tools",
    title_vi: "Bộ dụng cụ riêng",
    title_en: "Personal tool kit",
    sentences: [
      { en: "Some clients keep their own kit.", vi: "Có khách giữ bộ riêng.", pronunciation_focus: ["clients", "keep"] },
      { en: "We can store it here for you.", vi: "Em giữ ở tiệm cho chị.", pronunciation_focus: ["store", "here"] },
      { en: "Twenty dollars to start your own kit.", vi: "Hai mươi đô để mở bộ riêng.", pronunciation_focus: ["twenty", "kit"] },
      { en: "Comes with file, buffer, pusher, all yours.", vi: "Bao gồm dũa, đánh, đẩy da — của riêng chị.", pronunciation_focus: ["file", "buffer", "pusher"] },
    ],
    cultural_notes_vi:
      "Personal kits là một dịch vụ giá trị tăng — khách trả thêm $20 để có bộ riêng. Phổ biến với khách lớn tuổi và y tá.",
    tip_advice_vi:
      "Khách lo nhiễm trùng nhất sẽ chọn personal kit. Đó là khách trung thành — họ quay lại vì không thể đem kit đi nơi khác.",
  },
  {
    id: "nail_tech_sanitation_cuticle_blood",
    category: "sanitation_tools",
    title_vi: "Bị xước nhẹ",
    title_en: "Minor nick or bleed",
    sentences: [
      { en: "Oh, I clipped a tiny piece of cuticle — let me clean it.", vi: "Em cắt phải da một chút, để em vệ sinh nha.", pronunciation_focus: ["clipped", "cuticle"] },
      { en: "I'll put a clean cotton on it.", vi: "Em đắp bông gòn sạch lên đó.", pronunciation_focus: ["clean", "cotton"] },
      { en: "It'll heal in a day.", vi: "Một ngày là lành.", pronunciation_focus: ["heal", "day"] },
      { en: "I'm so sorry, that happens sometimes.", vi: "Em xin lỗi, thỉnh thoảng cũng xảy ra.", pronunciation_focus: ["sorry", "happens"] },
    ],
    cultural_notes_vi:
      "Bị chảy máu nhẹ là chuyện thường — đừng hoảng. Xử lý ngay với cồn, bông sạch. Tỏ ra bình tĩnh, khách sẽ bình tĩnh theo.",
    tip_advice_vi:
      "Sau vụ xước, miễn phí dịch vụ luôn — đó là chi phí goodwill. Khách quay lại vì cách bạn xử lý, không vì giá.",
  },
];

// ── 6. Scheduling and rebooking (5) ──────────────────────────────────────

const SCHEDULING: NailTechLesson[] = [
  {
    id: "nail_tech_schedule_book_next",
    category: "scheduling_rebooking",
    title_vi: "Đặt lịch lần sau",
    title_en: "Booking the next visit",
    sentences: [
      { en: "Want me to book you in for two weeks from now?", vi: "Em đặt lịch hai tuần nữa cho chị nhé?", pronunciation_focus: ["book", "weeks"] },
      { en: "Same time, same day?", vi: "Cùng giờ, cùng thứ chứ?", pronunciation_focus: ["same", "day"] },
      { en: "Saturday at three works for you?", vi: "Thứ Bảy 3 giờ chị tiện không?", pronunciation_focus: ["Saturday", "three"] },
      { en: "I'll text you a reminder the day before.", vi: "Hôm trước em nhắn nhắc chị.", pronunciation_focus: ["text", "reminder"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ thích đặt lịch ngay — đó là tín hiệu khách trung thành. Đề nghị book ngay khi đang trả tiền là thời điểm vàng.",
    tip_advice_vi:
      "Khách book lịch luôn = khách quen. Họ tip ổn định 20% mỗi lần. Salon nào có nhiều booked-ahead client = salon thành công.",
  },
  {
    id: "nail_tech_schedule_text_app",
    category: "scheduling_rebooking",
    title_vi: "Hệ thống đặt lịch qua tin nhắn",
    title_en: "Text-based booking system",
    sentences: [
      { en: "We have a booking app — would you like the link?", vi: "Tiệm có app đặt lịch, em gửi link nhé?", pronunciation_focus: ["app", "link"] },
      { en: "You can see all the open times.", vi: "Chị thấy được các giờ trống.", pronunciation_focus: ["open", "times"] },
      { en: "Or just text the salon.", vi: "Hoặc nhắn tin cho tiệm.", pronunciation_focus: ["text", "salon"] },
      { en: "Whatever's easier for you.", vi: "Cái nào tiện cho chị.", pronunciation_focus: ["whatever", "easier"] },
    ],
    cultural_notes_vi:
      "Booking apps (Vagaro, Booksy, Square) là chuẩn salon Mỹ năm 2026. Khách trẻ luôn dùng app; khách lớn tuổi thích nhắn tin.",
    tip_advice_vi:
      "Đề nghị app cho khách trẻ, text cho khách lớn — đọc tuổi đoán phong cách. Chọn đúng = khách thoải mái = quay lại.",
  },
  {
    id: "nail_tech_schedule_cancellation",
    category: "scheduling_rebooking",
    title_vi: "Chính sách hủy lịch",
    title_en: "Cancellation policy",
    sentences: [
      { en: "Just give us 24 hours' notice if you need to cancel.", vi: "Hủy trước 24 tiếng giùm em nhé.", pronunciation_focus: ["hours", "notice"] },
      { en: "Same-day cancellations have a small fee.", vi: "Hủy trong ngày có phí nhẹ.", pronunciation_focus: ["same-day", "fee"] },
      { en: "We totally understand emergencies.", vi: "Chuyện gấp thì em hiểu mà.", pronunciation_focus: ["totally", "emergencies"] },
      { en: "Just shoot us a text.", vi: "Chị nhắn tin báo em là được.", pronunciation_focus: ["shoot", "text"] },
    ],
    cultural_notes_vi:
      "24-hour cancellation policy là chuẩn salon Mỹ. Phí hủy day-of khoảng $10–25. Đa số salon miễn phí cho khách quen.",
    tip_advice_vi:
      "Áp dụng chính sách linh hoạt: khách quen miễn phí, khách lạ thì tính phí. Nguyên tắc đó giữ khách trung thành mà vẫn bảo vệ thời gian.",
  },
  {
    id: "nail_tech_schedule_walk_in",
    category: "scheduling_rebooking",
    title_vi: "Khách walk-in",
    title_en: "Walk-in availability",
    sentences: [
      { en: "We're booked for the next hour.", vi: "Tiệm kín lịch một tiếng nữa.", pronunciation_focus: ["booked", "hour"] },
      { en: "I have an opening at four if you can come back.", vi: "4 giờ em rảnh, chị quay lại được không?", pronunciation_focus: ["opening", "back"] },
      { en: "Want me to put your name down?", vi: "Em ghi tên chị vô danh sách nhé?", pronunciation_focus: ["name", "down"] },
      { en: "Tomorrow morning is wide open.", vi: "Sáng mai còn nhiều giờ trống.", pronunciation_focus: ["tomorrow", "open"] },
    ],
    cultural_notes_vi:
      "Walk-ins là khách 'fluid' — họ có thể đi salon khác. Đề nghị cụ thể (4 giờ, sáng mai) tốt hơn là 'sometime today'.",
    tip_advice_vi:
      "Khách walk-in nói 'I'll come back' nhưng thường không quay lại. Ghi tên + số = tăng cơ hội 50%.",
  },
  {
    id: "nail_tech_schedule_holiday_rush",
    category: "scheduling_rebooking",
    title_vi: "Lịch lễ Tết",
    title_en: "Holiday rush scheduling",
    sentences: [
      { en: "Heads up — we book up two weeks before Christmas.", vi: "Báo chị trước, hai tuần trước Giáng Sinh là kín lịch.", pronunciation_focus: ["heads", "up"] },
      { en: "I'd grab a slot now if I were you.", vi: "Nếu là em, em đặt lịch luôn.", pronunciation_focus: ["grab", "slot"] },
      { en: "Mother's Day weekend goes fast too.", vi: "Cuối tuần Ngày của Mẹ cũng kín nhanh lắm.", pronunciation_focus: ["Mother's", "weekend"] },
      { en: "Do you have a date in mind?", vi: "Chị tính ngày nào ạ?", pronunciation_focus: ["date", "mind"] },
    ],
    cultural_notes_vi:
      "Salon Mỹ kín lịch 2 tuần trước các lễ lớn. Khách đợi đến last-minute thường thất vọng — báo trước là dịch vụ tốt.",
    tip_advice_vi:
      "Tháng 11 + tháng 12 = 30% doanh thu năm. Đặt lịch khách quen sớm bảo vệ doanh thu, tránh khách walk-in chiếm chỗ.",
  },
];

// ── 7. Payment, tips, deposits (5) ───────────────────────────────────────

const PAYMENT: NailTechLesson[] = [
  {
    id: "nail_tech_payment_total",
    category: "payment_tips",
    title_vi: "Tổng tiền",
    title_en: "Telling the client the total",
    sentences: [
      { en: "Your total comes to fifty-five dollars today.", vi: "Tổng cộng hôm nay là 55 đô.", pronunciation_focus: ["total", "fifty-five"] },
      { en: "Cash, card, or Venmo?", vi: "Tiền mặt, thẻ, hay Venmo?", pronunciation_focus: ["cash", "Venmo"] },
      { en: "I can run that for you here.", vi: "Em quẹt thẻ ở đây luôn.", pronunciation_focus: ["run", "here"] },
      { en: "Receipt printed or emailed?", vi: "Hóa đơn in hay gửi email?", pronunciation_focus: ["receipt", "emailed"] },
    ],
    cultural_notes_vi:
      "Nói tổng tiền RÕ và một lần. Đừng nói nhỏ hay ngại — khách Mỹ trả mỗi ngày, không có gì đặc biệt. Tự nhiên = chuyên nghiệp.",
    tip_advice_vi:
      "Nói tổng tiền + im lặng = khách thường tự thêm tip. Đừng giục, đừng nhắc. Khách Mỹ biết phải tip, đợi họ tự tính.",
  },
  {
    id: "nail_tech_payment_tip_screen",
    category: "payment_tips",
    title_vi: "Màn hình thanh toán có tip",
    title_en: "Tip screen on the card reader",
    sentences: [
      { en: "It'll ask for tip — totally up to you.", vi: "Máy hỏi tip — tùy ý chị.", pronunciation_focus: ["tip", "totally"] },
      { en: "Tap whichever you like.", vi: "Chị chạm vô lựa chọn nào cũng được.", pronunciation_focus: ["tap", "whichever"] },
      { en: "Or you can enter a custom amount.", vi: "Hoặc tự nhập số.", pronunciation_focus: ["enter", "custom"] },
      { en: "Then sign on the line.", vi: "Rồi ký vào dòng đó.", pronunciation_focus: ["sign", "line"] },
    ],
    cultural_notes_vi:
      "Tip Mỹ chuẩn 18–20% cho dịch vụ tốt. Square / Toast hiển thị 15/20/25 — đa số khách chọn 20%. Đừng bao giờ ám chỉ chọn nào.",
    tip_advice_vi:
      "Quay đi khỏi màn hình khi khách nhập tip — đó là phép lịch sự. Khách Mỹ ghét bị nhìn lúc tip. Quay đi = tip cao hơn.",
  },
  {
    id: "nail_tech_payment_cash_tip",
    category: "payment_tips",
    title_vi: "Tip tiền mặt",
    title_en: "Cash tip",
    sentences: [
      { en: "Oh, thank you so much!", vi: "Ôi, cảm ơn chị nhiều lắm!", pronunciation_focus: ["thank", "much"] },
      { en: "You're so generous.", vi: "Chị thật hào phóng.", pronunciation_focus: ["generous"] },
      { en: "I really appreciate it.", vi: "Em rất biết ơn.", pronunciation_focus: ["really", "appreciate"] },
      { en: "Have a beautiful day.", vi: "Chúc chị một ngày đẹp.", pronunciation_focus: ["beautiful", "day"] },
    ],
    cultural_notes_vi:
      "Tip tiền mặt là tip lớn nhất — luôn tốt hơn tip thẻ. Cảm ơn chân thành, gọi tên khách nếu nhớ.",
    tip_advice_vi:
      "Đừng đếm tiền mặt trước mặt khách — đợi khách đi xong. Đếm trước mặt = thiếu tinh tế, có thể mất tip lần sau.",
  },
  {
    id: "nail_tech_payment_deposit",
    category: "payment_tips",
    title_vi: "Đặt cọc",
    title_en: "Taking a deposit",
    sentences: [
      { en: "For services over a hundred, we take a twenty-dollar deposit.", vi: "Dịch vụ trên 100 đô, em lấy đặt cọc 20 đô.", pronunciation_focus: ["deposit", "twenty"] },
      { en: "It goes toward the total.", vi: "Tiền cọc tính vào tổng.", pronunciation_focus: ["goes", "total"] },
      { en: "Refundable up to 24 hours before.", vi: "Hoàn tiền nếu hủy trước 24 tiếng.", pronunciation_focus: ["refundable", "before"] },
      { en: "Just protects everyone's time.", vi: "Để bảo vệ thời gian hai bên.", pronunciation_focus: ["protects", "time"] },
    ],
    cultural_notes_vi:
      "Deposit chuẩn cho nail art lớn, full set acrylic, đám cưới. $20 không quá, $50 hợp lý cho dịch vụ $200+.",
    tip_advice_vi:
      "Giải thích rõ 'goes toward the total' — khách hiểu deposit không bị mất. Câu này gỡ kháng cự ngay.",
  },
  {
    id: "nail_tech_payment_split",
    category: "payment_tips",
    title_vi: "Chia hóa đơn",
    title_en: "Splitting the bill",
    sentences: [
      { en: "Want to split this between two cards?", vi: "Chị muốn chia hai thẻ không?", pronunciation_focus: ["split", "between"] },
      { en: "I can run them separately.", vi: "Em quẹt riêng từng cái.", pronunciation_focus: ["run", "separately"] },
      { en: "How much on each?", vi: "Mỗi thẻ bao nhiêu ạ?", pronunciation_focus: ["how", "each"] },
      { en: "No problem at all.", vi: "Không vấn đề gì cả.", pronunciation_focus: ["problem"] },
    ],
    cultural_notes_vi:
      "Chia bill hai thẻ là chuyện thường — bạn bè đi cùng, mẹ + con gái. Đừng phàn nàn, làm vui vẻ.",
    tip_advice_vi:
      "Chia bill khéo léo = khách quay lại nhóm. Một lần chia bill mệt = ba khách trung thành.",
  },
];

// ── 8. Special clients (5) ───────────────────────────────────────────────

const SPECIAL_CLIENTS: NailTechLesson[] = [
  {
    id: "nail_tech_special_kid_first",
    category: "special_clients",
    title_vi: "Lần đầu bé đi làm móng",
    title_en: "Child's first manicure",
    sentences: [
      { en: "Hi sweetie! Are you ready for your first manicure?", vi: "Chào con gái, lần đầu làm móng hả?", pronunciation_focus: ["sweetie", "first"] },
      { en: "Pick any color you want.", vi: "Con chọn màu nào cũng được.", pronunciation_focus: ["pick", "want"] },
      { en: "I promise this won't hurt.", vi: "Cô hứa không đau đâu.", pronunciation_focus: ["promise", "hurt"] },
      { en: "You're being such a good girl.", vi: "Con ngoan quá.", pronunciation_focus: ["good", "girl"] },
    ],
    cultural_notes_vi:
      "Bé Mỹ thường đi với mẹ. Hỏi mẹ trước khi sơn màu sáng/tối. Đừng dùng dụng cụ kim loại, file trên móng bé.",
    tip_advice_vi:
      "Bé ngoan cuối buổi → tặng sticker. Mẹ rất cảm động, tip $5–10 thêm. Sticker giá $0.10 — lợi nhuận tốt nhất.",
  },
  {
    id: "nail_tech_special_senior",
    category: "special_clients",
    title_vi: "Khách lớn tuổi",
    title_en: "Elderly clients",
    sentences: [
      { en: "Take all the time you need.", vi: "Bà cứ thư thả ạ.", pronunciation_focus: ["take", "time"] },
      { en: "Let me help you to the chair.", vi: "Để con dìu bà tới ghế.", pronunciation_focus: ["help", "chair"] },
      { en: "Is the water temperature okay?", vi: "Nước nóng vừa không bà?", pronunciation_focus: ["temperature", "okay"] },
      { en: "I'll be very gentle today.", vi: "Hôm nay con làm nhẹ ạ.", pronunciation_focus: ["very", "gentle"] },
    ],
    cultural_notes_vi:
      "Khách lớn tuổi Mỹ đi pedicure thường xuyên — nhiều khi vì lý do sức khỏe. Móng dày, da khô là chuyện bình thường.",
    tip_advice_vi:
      "Khách lớn tuổi tip cao nhất nếu làm cẩn thận. Họ kể bạn bè trong câu lạc bộ — referrals từ senior community lớn lắm.",
  },
  {
    id: "nail_tech_special_anxious",
    category: "special_clients",
    title_vi: "Khách lo lắng",
    title_en: "Anxious clients",
    sentences: [
      { en: "I'll go slow.", vi: "Em làm chậm thôi nhé.", pronunciation_focus: ["slow"] },
      { en: "Tell me to stop anytime.", vi: "Lúc nào muốn dừng cứ nói em.", pronunciation_focus: ["stop", "anytime"] },
      { en: "We can take a break whenever you want.", vi: "Mình nghỉ giữa chừng cũng được.", pronunciation_focus: ["break", "whenever"] },
      { en: "You're doing great.", vi: "Chị đang làm tốt mà.", pronunciation_focus: ["doing", "great"] },
    ],
    cultural_notes_vi:
      "Khách lo lắng (sợ kim, đau, gửi gắm) cần được trấn an liên tục. Câu 'you're doing great' nghe đơn giản nhưng hiệu quả.",
    tip_advice_vi:
      "Khách lo nhiều lần đầu = khách trung thành nhiều lần sau. Họ tip cao vì cảm động bạn kiên nhẫn.",
  },
  {
    id: "nail_tech_special_pregnant",
    category: "special_clients",
    title_vi: "Khách mang thai",
    title_en: "Pregnant clients",
    sentences: [
      { en: "Congratulations! How far along?", vi: "Chúc mừng chị! Mấy tháng rồi?", pronunciation_focus: ["congratulations", "far"] },
      { en: "We'll skip the strong-smell products.", vi: "Em không dùng sản phẩm mùi mạnh.", pronunciation_focus: ["skip", "strong"] },
      { en: "Can I get you a pillow for your back?", vi: "Em lấy gối kê lưng cho chị nhé?", pronunciation_focus: ["pillow", "back"] },
      { en: "Let me know if you need to step out.", vi: "Cần ra ngoài chị cứ nói nhé.", pronunciation_focus: ["step", "out"] },
    ],
    cultural_notes_vi:
      "Khách mang thai Mỹ kiêng sản phẩm hóa chất mạnh. Đề nghị 'breathable polish' (5-free, 7-free) là điểm cộng lớn.",
    tip_advice_vi:
      "Khách mang thai = khách quen 5 năm sau (cho con đi làm móng cùng). Đầu tư chăm sóc giai đoạn này = doanh thu dài hạn.",
  },
  {
    id: "nail_tech_special_disability",
    category: "special_clients",
    title_vi: "Khách có khiếm khuyết",
    title_en: "Clients with disabilities",
    sentences: [
      { en: "How can I make you most comfortable?", vi: "Em làm gì để chị thoải mái nhất ạ?", pronunciation_focus: ["comfortable"] },
      { en: "Just walk me through what works for you.", vi: "Chị chỉ em cách nào hợp với chị.", pronunciation_focus: ["walk", "works"] },
      { en: "We can move to a different chair.", vi: "Mình đổi ghế khác cũng được.", pronunciation_focus: ["different", "chair"] },
      { en: "I'm here to make this easy.", vi: "Em ở đây để làm cho dễ dàng nhất.", pronunciation_focus: ["here", "easy"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ có khiếm khuyết (xe lăn, khó đi, suy giảm thị giác) đánh giá cao tiệm coi họ như khách thường. Đừng đối xử khác — chỉ hỏi 'how can I make you comfortable?'",
    tip_advice_vi:
      "Khách disabled rất trung thành với tiệm có cách phục vụ tốt. Họ kể trong cộng đồng — đặc biệt referrals từ veteran clubs.",
  },
];

// ── Aggregate + helpers ──────────────────────────────────────────────────

export const NAIL_TECH_LESSONS: ReadonlyArray<NailTechLesson> = [
  ...GREETING_SEATING,
  ...SERVICE_MENU,
  ...SMALL_TALK,
  ...COMPLAINTS,
  ...SANITATION,
  ...SCHEDULING,
  ...PAYMENT,
  ...SPECIAL_CLIENTS,
];

export function getLessonsByCategory(
  category: NailTechCategoryId,
): NailTechLesson[] {
  return NAIL_TECH_LESSONS.filter((l) => l.category === category);
}

export function getLessonById(id: string): NailTechLesson | undefined {
  return NAIL_TECH_LESSONS.find((l) => l.id === id);
}
