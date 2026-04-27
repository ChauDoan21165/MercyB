// src/data/profession-packs/restaurant/content.ts
//
// Lesson-shaped content for the restaurant-worker profession pack.
// Mirrors the nail-technician pack shape introduced in PR #169 so the
// page UI + tests stay consistent across verticals.
//
// 50 lessons across 8 categories. Each lesson:
//
//   id                 restaurant_<slug>  — forward-compatible with
//                      future room IDs in roomRegistry.
//   title_vi/title_en  bilingual title.
//   category           one of RESTAURANT_CATEGORIES.
//   sentences          4–6 short utterances, each with a Vietnamese
//                      gloss and pronunciation_focus keys for the
//                      VN-typical phoneme misses in service English
//                      (/θ/, /r/, /æ/, /v/-vs-/w/, final consonants).
//   cultural_notes_vi  what's actually true at a US restaurant (US
//                      tipping norms, allergy disclosure rules,
//                      common American food quirks).
//   tip_advice_vi      practical advice for VN workers — when to
//                      upsell, reading customer cues, common mistakes.
//
// Hand-crafted; the lessons are written from US restaurant floor
// experience. No AI-generated filler — if the line doesn't ring true
// in a Garden Grove pho shop or a Boston steakhouse where Vietnamese
// staff work the floor, it doesn't ship. Same standard the nail
// pack header sets.

export type RestaurantCategoryId =
  | "greeting_seating"
  | "drink_orders"
  | "menu_explanation"
  | "special_requests"
  | "handling_complaints"
  | "vn_food_to_americans"
  | "payment_tipping"
  | "end_of_meal";

export type RestaurantCategoryMeta = {
  id: RestaurantCategoryId;
  title_vi: string;
  title_en: string;
  expected_count: number;
};

export const RESTAURANT_CATEGORIES: ReadonlyArray<RestaurantCategoryMeta> = [
  {
    id: "greeting_seating",
    title_vi: "Chào và xếp chỗ khách",
    title_en: "Greeting and seating customers",
    expected_count: 5,
  },
  {
    id: "drink_orders",
    title_vi: "Nhận order nước uống",
    title_en: "Taking drink orders",
    expected_count: 5,
  },
  {
    id: "menu_explanation",
    title_vi: "Giải thích menu",
    title_en: "Explaining the menu",
    expected_count: 10,
  },
  {
    id: "special_requests",
    title_vi: "Yêu cầu đặc biệt và dị ứng",
    title_en: "Special requests + dietary restrictions",
    expected_count: 10,
  },
  {
    id: "handling_complaints",
    title_vi: "Xử lý phàn nàn",
    title_en: "Handling complaints",
    expected_count: 5,
  },
  {
    id: "vn_food_to_americans",
    title_vi: "Giới thiệu món Việt cho khách Mỹ",
    title_en: "Explaining Vietnamese food to non-Vietnamese guests",
    expected_count: 5,
  },
  {
    id: "payment_tipping",
    title_vi: "Thanh toán và tip",
    title_en: "Payment, tipping, gift cards",
    expected_count: 5,
  },
  {
    id: "end_of_meal",
    title_vi: "Cuối bữa ăn",
    title_en: "End-of-meal interactions",
    expected_count: 5,
  },
];

export type LessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
};

export type RestaurantLesson = {
  id: string;
  category: RestaurantCategoryId;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  tip_advice_vi: string;
};

// ── 1. Greeting and seating (5) ───────────────────────────────────────────

const GREETING_SEATING: RestaurantLesson[] = [
  {
    id: "restaurant_greeting_walk_in",
    category: "greeting_seating",
    title_vi: "Khách bước vào nhà hàng",
    title_en: "Welcoming a walk-in guest",
    sentences: [
      { en: "Hi, welcome in! How many in your party tonight?", vi: "Chào quý khách, tối nay đoàn mình có mấy người ạ?", pronunciation_focus: ["welcome", "party", "θ in tonight"] },
      { en: "Just two? Right this way.", vi: "Hai người thôi ạ? Mời quý khách đi lối này.", pronunciation_focus: ["right", "this"] },
      { en: "Would you prefer a booth or a table?", vi: "Quý khách thích ngồi booth hay bàn thường?", pronunciation_focus: ["prefer", "booth"] },
      { en: "Take your time getting settled.", vi: "Quý khách cứ thong thả ngồi.", pronunciation_focus: ["take", "settled"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ rất quen với việc được chào trong vòng 30 giây. 'How many in your party?' là câu chuẩn — đừng dịch thành 'how many people'. 'Right this way' nghe chuyên nghiệp hơn 'follow me'.",
    tip_advice_vi:
      "Đếm số người TRƯỚC khi dẫn khách — sai số ghế là sai cả buổi. Hỏi booth/bàn là phép lịch sự cơ bản; khách lớn tuổi thường thích booth hơn vì dễ ngồi.",
  },
  {
    id: "restaurant_greeting_reservation",
    category: "greeting_seating",
    title_vi: "Khách có đặt bàn",
    title_en: "Guest with a reservation",
    sentences: [
      { en: "Do you have a reservation under a name?", vi: "Quý khách có đặt bàn dưới tên gì ạ?", pronunciation_focus: ["reservation", "under"] },
      { en: "Found it — table for four at seven o'clock.", vi: "Em thấy rồi — bàn bốn người lúc 7 giờ.", pronunciation_focus: ["four", "seven"] },
      { en: "Your table is ready. Right this way.", vi: "Bàn quý khách đã sẵn, mời đi lối này.", pronunciation_focus: ["ready", "right"] },
      { en: "Your server tonight will be Maria.", vi: "Nhân viên phục vụ tối nay là Maria.", pronunciation_focus: ["server", "tonight"] },
    ],
    cultural_notes_vi:
      "Tên đặt bàn ở Mỹ thường là họ (last name) — Smith, Johnson, Tran. Khi không tìm thấy, hỏi 'first name' không phải 'full name'. Thông báo tên server giúp khách biết hỏi ai.",
    tip_advice_vi:
      "Khách đặt bàn = khách có kế hoạch — họ thường dùng dịch vụ trọn gói (drinks + appetizer + dessert). Dẫn vào bàn nhanh, nói tên server rõ — đó là tín hiệu chuyên nghiệp.",
  },
  {
    id: "restaurant_greeting_wait",
    category: "greeting_seating",
    title_vi: "Có khách phải chờ",
    title_en: "Guest has to wait",
    sentences: [
      { en: "Wait time tonight is about twenty minutes.", vi: "Tối nay thời gian chờ khoảng hai mươi phút.", pronunciation_focus: ["wait", "twenty"] },
      { en: "Can I get your name and phone number?", vi: "Em xin tên và số điện thoại quý khách nhé?", pronunciation_focus: ["name", "phone"] },
      { en: "We'll text you when your table is ready.", vi: "Bàn sẵn em nhắn tin cho quý khách.", pronunciation_focus: ["text", "ready"] },
      { en: "Feel free to wait at the bar in the meantime.", vi: "Quý khách có thể chờ ở quầy bar trong lúc đó.", pronunciation_focus: ["bar", "meantime"] },
    ],
    cultural_notes_vi:
      "Báo thời gian chờ rõ ràng là chuẩn ở Mỹ. Đừng nói 'maybe' — nói số phút cụ thể. Nhiều khách sẽ chờ ở quầy bar, đó là doanh thu thêm cho nhà hàng.",
    tip_advice_vi:
      "Khi báo wait time, cộng thêm 5 phút — khách thấy bàn sẵn sớm hơn dự kiến sẽ vui và tip cao. Báo thiếu rồi để khách chờ thêm = mất khách.",
  },
  {
    id: "restaurant_greeting_outdoor",
    category: "greeting_seating",
    title_vi: "Hỏi ngồi trong hay ngoài",
    title_en: "Indoor or patio seating",
    sentences: [
      { en: "Would you like to sit inside or out on the patio?", vi: "Quý khách muốn ngồi trong nhà hay ngoài sân?", pronunciation_focus: ["inside", "patio"] },
      { en: "The patio has heaters tonight.", vi: "Sân ngoài có máy sưởi tối nay.", pronunciation_focus: ["heaters", "tonight"] },
      { en: "It's pretty breezy out there — fair warning.", vi: "Ngoài đó hơi gió, em báo trước.", pronunciation_focus: ["breezy", "warning"] },
      { en: "Right by the window okay?", vi: "Cạnh cửa sổ được không ạ?", pronunciation_focus: ["right", "window"] },
    ],
    cultural_notes_vi:
      "Patio (sân ngoài) là điểm cộng lớn ở Mỹ — đặc biệt California, Florida. Cảnh báo gió/lạnh trước khi khách ngồi giúp họ chuẩn bị áo khoác.",
    tip_advice_vi:
      "Khách thích ngồi cửa sổ hay patio thường ở lại lâu hơn = order nhiều món hơn = tip cao hơn. Nếu được ưu tiên, dẫn họ vào những bàn này.",
  },
  {
    id: "restaurant_greeting_kid_high_chair",
    category: "greeting_seating",
    title_vi: "Khách có em bé",
    title_en: "Guests with children",
    sentences: [
      { en: "Do you need a high chair or a booster?", vi: "Bé cần ghế cao hay ghế kê?", pronunciation_focus: ["high chair", "booster"] },
      { en: "I'll grab some crayons for the little one.", vi: "Em lấy bút màu cho bé nhé.", pronunciation_focus: ["grab", "little"] },
      { en: "Kids' menu coming right up.", vi: "Em đem menu trẻ em ngay.", pronunciation_focus: ["kids", "right"] },
      { en: "Whenever you're ready to order, just wave.", vi: "Khi nào sẵn sàng order quý khách vẫy tay là được.", pronunciation_focus: ["whenever", "wave"] },
    ],
    cultural_notes_vi:
      "Gia đình có con là khách lớn nhất ở Mỹ. Crayons (bút màu) + kids' menu + high chair là tiêu chuẩn nhà hàng family-friendly. Bé vui = mẹ vui = tip cao.",
    tip_advice_vi:
      "Đem nước cho bé NGAY — đó là cử chỉ ghi điểm với cha mẹ. Hỏi 'milk or water?' và đừng đem cup có ống hút glass nếu bé dưới 5 tuổi.",
  },
];

// ── 2. Drink orders (5) ───────────────────────────────────────────────────

const DRINK_ORDERS: RestaurantLesson[] = [
  {
    id: "restaurant_drinks_water_choice",
    category: "drink_orders",
    title_vi: "Hỏi loại nước uống",
    title_en: "Asking about water preference",
    sentences: [
      { en: "Still, sparkling, or just tap water?", vi: "Quý khách dùng nước thường, có ga, hay nước máy?", pronunciation_focus: ["still", "sparkling", "tap"] },
      { en: "Tap water is on the house.", vi: "Nước máy miễn phí.", pronunciation_focus: ["tap", "house"] },
      { en: "We have Pellegrino and Perrier for sparkling.", vi: "Có Pellegrino và Perrier cho nước có ga.", pronunciation_focus: ["Pellegrino", "Perrier"] },
      { en: "Ice or no ice?", vi: "Có đá hay không đá ạ?", pronunciation_focus: ["ice", "no"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ luôn có ice trong nước trừ khi yêu cầu khác. 'On the house' = miễn phí. Nước có ga (Pellegrino/Perrier) tính tiền $5–8 — nhiều khách Mỹ sẵn sàng chi.",
    tip_advice_vi:
      "Đề nghị 'sparkling' trước — nếu khách chọn, đó là $5–8 thêm vào bill. Nhưng đừng ép. Khách trả lời 'tap is fine' chấp nhận ngay, không hỏi lại.",
  },
  {
    id: "restaurant_drinks_iced_tea",
    category: "drink_orders",
    title_vi: "Trà đá kiểu Mỹ",
    title_en: "American iced tea",
    sentences: [
      { en: "Would you like sweet or unsweetened iced tea?", vi: "Trà đá có đường hay không đường ạ?", pronunciation_focus: ["sweet", "iced", "θ in unsweetened"] },
      { en: "Free refills on tea, soda, and coffee.", vi: "Trà, soda, cà phê được rót thêm miễn phí.", pronunciation_focus: ["refills", "soda"] },
      { en: "Lemon on the side?", vi: "Em đem lát chanh kèm nhé?", pronunciation_focus: ["lemon", "side"] },
      { en: "I'll bring a sugar caddy too.", vi: "Em đem hộp đường luôn.", pronunciation_focus: ["sugar", "caddy"] },
    ],
    cultural_notes_vi:
      "Trà đá Mỹ KHÔNG ngọt sẵn (trừ Southern sweet tea). 'Sweet tea' là đặc trưng miền Nam (Texas, Georgia). Refill miễn phí là chuẩn — đừng bao giờ tính tiền refill nước/trà/soda.",
    tip_advice_vi:
      "Khách Mỹ uống nhiều trà đá hơn người Việt. Refill nhanh = khách hài lòng. Đừng đợi khách hỏi — chủ động refill khi ly chỉ còn 1/3.",
  },
  {
    id: "restaurant_drinks_alcohol_id",
    category: "drink_orders",
    title_vi: "Yêu cầu ID khi gọi rượu",
    title_en: "Asking for ID when ordering alcohol",
    sentences: [
      { en: "I'll need to see ID for that, please.", vi: "Em xin xem CMND để gọi rượu ạ.", pronunciation_focus: ["need", "ID"] },
      { en: "Looks like a great year — happy birthday late!", vi: "Năm sinh đẹp — chúc mừng sinh nhật muộn!", pronunciation_focus: ["great", "year"] },
      { en: "Sorry, our policy is to card everyone under forty.", vi: "Xin lỗi, quán quy định kiểm tra ID mọi khách dưới 40 tuổi.", pronunciation_focus: ["policy", "card"] },
      { en: "Would you like to start with a cocktail or beer?", vi: "Quý khách bắt đầu với cocktail hay bia?", pronunciation_focus: ["start", "cocktail"] },
    ],
    cultural_notes_vi:
      "Luật Mỹ: nhà hàng phải kiểm ID nếu khách trông dưới 40 tuổi — không kiểm là phạt nhà hàng tới $5,000 + nguy cơ mất giấy phép rượu. Đây không phải tùy ý — phải hỏi.",
    tip_advice_vi:
      "Hỏi ID nhẹ nhàng — đừng gây khó chịu. 'Looks like a great year' là cách lịch sự để xoá xấu hổ. Khách lớn tuổi đôi khi vui khi bị kiểm vì cảm thấy trẻ.",
  },
  {
    id: "restaurant_drinks_specials",
    category: "drink_orders",
    title_vi: "Giới thiệu drink special",
    title_en: "Recommending the drink special",
    sentences: [
      { en: "Tonight's cocktail special is a watermelon mojito — twelve dollars.", vi: "Cocktail đặc biệt tối nay là mojito dưa hấu, 12 đô.", pronunciation_focus: ["watermelon", "mojito"] },
      { en: "Happy hour ends at six — half-off draft beers.", vi: "Happy hour tới 6 giờ — bia tươi giảm nửa giá.", pronunciation_focus: ["happy", "draft"] },
      { en: "We have a great Sauvignon Blanc by the glass.", vi: "Quán có Sauvignon Blanc rất ngon, gọi theo ly.", pronunciation_focus: ["Sauvignon", "glass"] },
      { en: "Anything I can start you off with?", vi: "Quý khách dùng gì để bắt đầu ạ?", pronunciation_focus: ["start", "off"] },
    ],
    cultural_notes_vi:
      "Drink specials là cách nhà hàng tăng doanh thu mà không đổi menu. Happy hour ở Mỹ thường 4–6 giờ chiều, đôi khi tới 7 giờ. 'By the glass' = gọi từng ly thay vì cả chai.",
    tip_advice_vi:
      "Cocktail special có biên lợi nhuận cao — nhà hàng thường khuyến khích nhân viên upsell. Câu 'tonight's special' hiệu quả hơn 'we have a special'. Tự tin = khách tin.",
  },
  {
    id: "restaurant_drinks_no_alcohol",
    category: "drink_orders",
    title_vi: "Khách không uống rượu",
    title_en: "Guest doesn't drink alcohol",
    sentences: [
      { en: "We have mocktails too — same flavors, no alcohol.", vi: "Quán có mocktail luôn, cùng vị nhưng không cồn.", pronunciation_focus: ["mocktails", "alcohol"] },
      { en: "How about a fresh-squeezed lemonade?", vi: "Hay là nước chanh tươi ép?", pronunciation_focus: ["fresh", "lemonade"] },
      { en: "We have kombucha on tap if you'd like.", vi: "Có kombucha tươi nếu quý khách thích.", pronunciation_focus: ["kombucha", "tap"] },
      { en: "Or a coffee or hot tea?", vi: "Hoặc cà phê, trà nóng?", pronunciation_focus: ["coffee", "tea"] },
    ],
    cultural_notes_vi:
      "Khách không uống rượu (lý do tôn giáo, lái xe, mang thai) ngày càng nhiều ở Mỹ. Mocktails là xu hướng lớn. Đừng bao giờ ép khách uống rượu — đó là phép lịch sự cơ bản.",
    tip_advice_vi:
      "Mocktails có giá tương đương cocktails ($10–14) — cùng tip percentage. Đừng giảm hứng vì khách không uống rượu; họ thường tip cao vì đánh giá phục vụ chu đáo.",
  },
];

// ── 3. Menu explanation (10) ──────────────────────────────────────────────

const MENU_EXPLANATION: RestaurantLesson[] = [
  {
    id: "restaurant_menu_describe_pho",
    category: "menu_explanation",
    title_vi: "Mô tả phở cho khách Mỹ",
    title_en: "Describing pho",
    sentences: [
      { en: "Pho is a Vietnamese noodle soup with rice noodles and herbs.", vi: "Phở là súp mì Việt Nam với bánh phở và rau thơm.", pronunciation_focus: ["noodle", "herbs"] },
      { en: "The broth simmers for twelve hours.", vi: "Nước dùng nấu mười hai tiếng.", pronunciation_focus: ["broth", "θ in twelve"] },
      { en: "You can choose beef, chicken, or vegetarian.", vi: "Quý khách chọn bò, gà, hay chay.", pronunciation_focus: ["beef", "vegetarian"] },
      { en: "Most people add lime, basil, and bean sprouts.", vi: "Đa số khách thêm chanh, húng, giá.", pronunciation_focus: ["basil", "sprouts"] },
    ],
    cultural_notes_vi:
      "Phát âm 'pho' đúng cho khách Mỹ là 'fuh' (vần với 'duh'), KHÔNG phải 'foh'. Nếu khách phát âm sai, đừng sửa — họ học dần. Mô tả là 'noodle soup', không phải 'beef soup' (gà chay cũng có).",
    tip_advice_vi:
      "Khách Mỹ lần đầu ăn phở có thể lo lắng. Nói rõ 'twelve hours broth' để họ biết đây là món chăm chút. Câu này dễ chốt được khách thêm appetizer.",
  },
  {
    id: "restaurant_menu_describe_banh_mi",
    category: "menu_explanation",
    title_vi: "Mô tả bánh mì",
    title_en: "Describing banh mi",
    sentences: [
      { en: "Banh mi is a Vietnamese sandwich on a French baguette.", vi: "Bánh mì là sandwich Việt trên ổ baguette Pháp.", pronunciation_focus: ["sandwich", "baguette"] },
      { en: "It comes with pâté, pickled veggies, cilantro, and your choice of meat.", vi: "Có pa-tê, đồ chua, ngò, và thịt theo lựa chọn.", pronunciation_focus: ["pâté", "cilantro"] },
      { en: "Pork, chicken, tofu, or grilled lemongrass beef.", vi: "Heo, gà, đậu hũ, hoặc bò xả nướng.", pronunciation_focus: ["pork", "lemongrass"] },
      { en: "It's about ten dollars and very filling.", vi: "Khoảng 10 đô và rất no.", pronunciation_focus: ["ten", "filling"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ phát âm 'banh mi' thành 'ban-mee' — chấp nhận được. 'French baguette' là điểm bán hàng vì người Mỹ biết baguette. Cilantro là từ Mỹ cho ngò; coriander cũng dùng nhưng ít hơn.",
    tip_advice_vi:
      "Khách Mỹ không quen với pâté — có người sợ. Đề nghị 'we can make it without pâté if you like' để giảm rào cản. Khách thích thử = quay lại lần sau.",
  },
  {
    id: "restaurant_menu_recommend_dish",
    category: "menu_explanation",
    title_vi: "Gợi ý món yêu thích",
    title_en: "Recommending a favorite",
    sentences: [
      { en: "If it's your first time, I'd recommend the lemongrass chicken.", vi: "Lần đầu thì em gợi ý gà xả ớt.", pronunciation_focus: ["recommend", "lemongrass"] },
      { en: "It's our most popular dish.", vi: "Đó là món bán chạy nhất.", pronunciation_focus: ["popular", "dish"] },
      { en: "Not too spicy, lots of flavor.", vi: "Không quá cay, nhiều hương vị.", pronunciation_focus: ["spicy", "flavor"] },
      { en: "Comes with rice and a side of greens.", vi: "Đi kèm cơm và rau xào.", pronunciation_focus: ["rice", "greens"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ đánh giá cao gợi ý chân thành. 'Most popular' là cụm bán hàng mạnh — họ tin con số. Nói 'I'd recommend' (kèm 'd') nghe chuyên nghiệp hơn 'I recommend'.",
    tip_advice_vi:
      "Có một món 'safe-bet' luôn sẵn để gợi ý cho khách lần đầu. Khách thích món bạn gợi ý = tip cao. Đừng đổi gợi ý mỗi tuần — nhất quán giúp khách tin.",
  },
  {
    id: "restaurant_menu_specials",
    category: "menu_explanation",
    title_vi: "Thực đơn đặc biệt hôm nay",
    title_en: "Today's specials",
    sentences: [
      { en: "Tonight's specials are pan-seared salmon and a short rib pho.", vi: "Đặc biệt tối nay có cá hồi áp chảo và phở sườn bò.", pronunciation_focus: ["pan-seared", "salmon"] },
      { en: "Salmon is twenty-six, the pho is eighteen.", vi: "Cá hồi 26 đô, phở 18 đô.", pronunciation_focus: ["twenty-six", "eighteen"] },
      { en: "Both are limited tonight — first come, first served.", vi: "Cả hai có hạn — ai đến trước được trước.", pronunciation_focus: ["both", "limited"] },
      { en: "Want me to put one aside for you?", vi: "Em giữ một phần cho quý khách nhé?", pronunciation_focus: ["aside", "you"] },
    ],
    cultural_notes_vi:
      "Specials là cách nhà hàng dọn nguyên liệu sắp hết hạn — bếp nấu sáng tạo, lợi nhuận cao. Khách Mỹ thích 'limited tonight' vì cảm giác đặc biệt.",
    tip_advice_vi:
      "Học specials thuộc lòng mỗi đầu shift — quên specials = lỡ doanh thu. 'Want me to put one aside?' câu chốt 30% upsell. Specials có biên 60–70%, doanh thu nhanh nhất nhà hàng.",
  },
  {
    id: "restaurant_menu_modifications",
    category: "menu_explanation",
    title_vi: "Đổi thành phần món",
    title_en: "Modifying the dish",
    sentences: [
      { en: "Yes, we can swap the rice for noodles, no problem.", vi: "Vâng, em đổi cơm thành bún được ạ.", pronunciation_focus: ["swap", "noodles"] },
      { en: "Want me to leave off the cilantro?", vi: "Em không bỏ ngò nhé?", pronunciation_focus: ["leave", "cilantro"] },
      { en: "Sauce on the side is fine.", vi: "Sốt để riêng được ạ.", pronunciation_focus: ["sauce", "side"] },
      { en: "There's a small upcharge for shrimp instead of chicken.", vi: "Đổi gà thành tôm thì thêm tiền chút ạ.", pronunciation_focus: ["upcharge", "shrimp"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ rất quen với việc 'modify' món — đổi sốt, thay rau, không này không kia. Đáp 'no problem' là chuẩn. 'Sauce on the side' phổ biến với khách kiêng cử.",
    tip_advice_vi:
      "Ghi rõ modification trong order — bếp sai = mất tip cả bàn. Đừng ngại nói 'small upcharge' khi đổi nguyên liệu đắt — khách Mỹ chấp nhận, miễn là báo trước.",
  },
  {
    id: "restaurant_menu_appetizer_suggest",
    category: "menu_explanation",
    title_vi: "Gợi ý món khai vị",
    title_en: "Suggesting appetizers",
    sentences: [
      { en: "Want to start with summer rolls or spring rolls?", vi: "Bắt đầu với gỏi cuốn hay chả giò không ạ?", pronunciation_focus: ["summer", "spring"] },
      { en: "Summer rolls are fresh, spring rolls are crispy and fried.", vi: "Gỏi cuốn là cuốn tươi, chả giò chiên giòn.", pronunciation_focus: ["fresh", "crispy"] },
      { en: "Eight dollars for an order of two.", vi: "Tám đô cho một phần hai cuốn.", pronunciation_focus: ["eight", "order"] },
      { en: "They come with peanut sauce.", vi: "Đi kèm nước chấm đậu phộng.", pronunciation_focus: ["peanut", "sauce"] },
    ],
    cultural_notes_vi:
      "'Summer rolls' (gỏi cuốn) vs 'spring rolls' (chả giò) — khác nhau quan trọng ở Mỹ. Nhiều khách nhầm. Giải thích rõ tránh khách nhận sai món rồi than phiền.",
    tip_advice_vi:
      "Appetizer là điểm bắt đầu upsell — khách order thêm app = bill tăng 20%. Gợi ý kèm drink để khách thấy combo trọn vẹn: 'try the summer rolls with the cocktail special.'",
  },
  {
    id: "restaurant_menu_sides",
    category: "menu_explanation",
    title_vi: "Món phụ",
    title_en: "Side dishes",
    sentences: [
      { en: "Sides are five dollars each.", vi: "Món phụ năm đô mỗi món.", pronunciation_focus: ["sides", "five"] },
      { en: "We have garlic noodles, jasmine rice, or sautéed greens.", vi: "Có mì xào tỏi, cơm thơm, hay rau xào.", pronunciation_focus: ["garlic", "jasmine"] },
      { en: "Garlic noodles are the most popular.", vi: "Mì xào tỏi bán chạy nhất.", pronunciation_focus: ["popular"] },
      { en: "Two sides for nine — small savings.", vi: "Hai món phụ chín đô — đỡ chút tiền.", pronunciation_focus: ["nine", "savings"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ thích 'side' (món phụ) hơn người Việt — đó là cách họ chia bữa. Chia sẻ side là phong cách Mỹ-gốc-Á phổ biến: ai cũng gắp một chút.",
    tip_advice_vi:
      "Combo deal 'two for nine' chốt được khách lưỡng lự. $0.50 giảm trên giấy nhưng khách cảm thấy thắng deal — họ tip thêm vì hài lòng.",
  },
  {
    id: "restaurant_menu_explain_spice",
    category: "menu_explanation",
    title_vi: "Mức cay",
    title_en: "Spice level",
    sentences: [
      { en: "How spicy do you like it — mild, medium, or hot?", vi: "Quý khách thích cay nhẹ, vừa, hay đậm?", pronunciation_focus: ["spicy", "medium"] },
      { en: "Our 'medium' is medium for Vietnamese — a little hotter than American medium.", vi: "Mức 'vừa' của quán là vừa kiểu Việt — hơi cay hơn vừa kiểu Mỹ.", pronunciation_focus: ["medium", "hotter"] },
      { en: "Want a dish of chilies on the side instead?", vi: "Hay đem ớt riêng để quý khách tự thêm?", pronunciation_focus: ["chilies", "side"] },
      { en: "Sriracha is on every table.", vi: "Tương ớt Sriracha có sẵn trên bàn.", pronunciation_focus: ["Sriracha", "table"] },
    ],
    cultural_notes_vi:
      "Cảnh báo trước về mức cay là cứu sinh ở Mỹ. 'Medium' kiểu Việt thường cay hơn 'spicy' kiểu Mỹ. Sriracha cực phổ biến — nếu thiếu chai trên bàn = mất điểm.",
    tip_advice_vi:
      "Hỏi mức cay TRƯỚC khi ghi món, không phải sau. Khách trả phần ăn vì quá cay = mất tip + có thể được review xấu. Đem ớt riêng cho khách thử = giải pháp an toàn.",
  },
  {
    id: "restaurant_menu_for_table_share",
    category: "menu_explanation",
    title_vi: "Món chia bàn",
    title_en: "Family-style sharing",
    sentences: [
      { en: "These dishes are great for sharing.", vi: "Các món này phù hợp chia bàn.", pronunciation_focus: ["great", "sharing"] },
      { en: "I'd recommend three or four dishes for the four of you.", vi: "Em gợi ý ba bốn món cho bốn người.", pronunciation_focus: ["recommend", "four"] },
      { en: "Plus a couple of sides.", vi: "Thêm một hai món phụ nữa.", pronunciation_focus: ["couple", "sides"] },
      { en: "I can bring extra plates.", vi: "Em đem thêm đĩa nhé.", pronunciation_focus: ["extra", "plates"] },
    ],
    cultural_notes_vi:
      "'Family-style sharing' đang là xu hướng nhà hàng Á-Mỹ. Bàn 4 người order 4 món chính + 2 sides là chuẩn. Đây là cách nâng bill bàn lên 20–30%.",
    tip_advice_vi:
      "Nói rõ con số ('three or four dishes for the four of you') — khách đỡ ngần ngại hơn 'how many do you want?'. Chuyên gia gợi ý = khách tin.",
  },
  {
    id: "restaurant_menu_dessert",
    category: "menu_explanation",
    title_vi: "Thực đơn tráng miệng",
    title_en: "Dessert menu",
    sentences: [
      { en: "Save room for dessert?", vi: "Còn bụng cho tráng miệng không ạ?", pronunciation_focus: ["save", "dessert"] },
      { en: "We have flan, mango sticky rice, and fried banana with ice cream.", vi: "Có flan, xôi xoài, chuối chiên với kem.", pronunciation_focus: ["flan", "sticky"] },
      { en: "Flan is house-made every morning.", vi: "Flan tự làm mỗi sáng.", pronunciation_focus: ["house-made", "morning"] },
      { en: "Want me to drop a dessert menu?", vi: "Em đem menu tráng miệng nhé?", pronunciation_focus: ["drop", "dessert"] },
    ],
    cultural_notes_vi:
      "'Save room for dessert?' là cụm bán hàng kinh điển ở Mỹ. Đem menu tráng miệng = 40% khách order. Mỗi dessert $7–10 = tip thêm $1–2 mỗi bàn.",
    tip_advice_vi:
      "Đem menu tráng miệng dù khách chưa hỏi. Đừng đợi khách yêu cầu — chủ động là cách tăng bill. 'House-made' là từ ma thuật — khách Mỹ trả thêm cho 'house-made'.",
  },
];

// ── 4. Special requests + dietary restrictions (10) ──────────────────────

const SPECIAL_REQUESTS: RestaurantLesson[] = [
  {
    id: "restaurant_diet_allergy",
    category: "special_requests",
    title_vi: "Khách bị dị ứng",
    title_en: "Guest has an allergy",
    sentences: [
      { en: "What kind of allergy? I'll let the kitchen know.", vi: "Quý khách dị ứng gì để em báo bếp ạ?", pronunciation_focus: ["allergy", "kitchen"] },
      { en: "I'll double-check with the chef before bringing it out.", vi: "Em xác nhận với bếp trước khi đem ra.", pronunciation_focus: ["double-check", "before"] },
      { en: "We have a separate prep area for allergy orders.", vi: "Quán có khu chế biến riêng cho khách dị ứng.", pronunciation_focus: ["separate", "prep"] },
      { en: "Thanks for letting me know — better safe than sorry.", vi: "Cảm ơn đã báo trước — an toàn hơn ạ.", pronunciation_focus: ["thanks", "safer"] },
    ],
    cultural_notes_vi:
      "Luật Mỹ: nhân viên PHẢI chuyển thông tin dị ứng tới bếp. Bỏ qua = nhà hàng bị kiện nếu khách phản ứng. Đừng bao giờ đoán — luôn confirm.",
    tip_advice_vi:
      "Dị ứng nghiêm trọng (peanut, shellfish) có thể chết người. Lặp lại với khách: 'allergic to peanuts, correct?' để chắc chắn. Sai = mất tip + nguy cơ pháp lý cho nhà hàng.",
  },
  {
    id: "restaurant_diet_gluten_free",
    category: "special_requests",
    title_vi: "Khách kiêng gluten",
    title_en: "Gluten-free request",
    sentences: [
      { en: "Most of our rice noodles are gluten-free.", vi: "Đa số bánh phở của quán không có gluten.", pronunciation_focus: ["rice", "gluten-free"] },
      { en: "But the soy sauce isn't — I can swap for tamari.", vi: "Nhưng nước tương có gluten — em đổi tamari được ạ.", pronunciation_focus: ["soy", "tamari"] },
      { en: "We mark gluten-free items with a 'GF' on the menu.", vi: "Trên menu có dấu 'GF' chỉ món không gluten.", pronunciation_focus: ["mark", "GF"] },
      { en: "Is it a sensitivity or celiac?", vi: "Quý khách nhạy cảm nhẹ hay bị celiac ạ?", pronunciation_focus: ["sensitivity", "celiac"] },
    ],
    cultural_notes_vi:
      "Celiac (bệnh tự miễn) khác với 'gluten-sensitive' (nhạy cảm). Celiac = phải tuyệt đối tránh gluten. Sensitivity = có thể chấp nhận chút ít. Hỏi rõ giúp bếp xử lý đúng mức.",
    tip_advice_vi:
      "Gluten-free là yêu cầu phổ biến nhất ở Mỹ năm 2026. Học rõ món nào GF, món nào có thể GF được. Khách GF tip cao vì cảm động khi được phục vụ kỹ.",
  },
  {
    id: "restaurant_diet_vegan",
    category: "special_requests",
    title_vi: "Khách ăn chay",
    title_en: "Vegan/vegetarian request",
    sentences: [
      { en: "Vegan or vegetarian?", vi: "Ăn chay thuần hay chay có sữa trứng ạ?", pronunciation_focus: ["vegan", "vegetarian"] },
      { en: "Most pho broths have meat — but we have a vegetable pho.", vi: "Phở quán dùng nước hầm thịt, nhưng có phở chay riêng.", pronunciation_focus: ["pho", "vegetable"] },
      { en: "Tofu in place of any meat dish.", vi: "Đậu hũ thay thịt được hết.", pronunciation_focus: ["tofu", "meat"] },
      { en: "Watch out for fish sauce — I'll swap it for soy.", vi: "Để ý nước mắm nhé — em thay nước tương.", pronunciation_focus: ["watch", "fish"] },
    ],
    cultural_notes_vi:
      "Phân biệt vegan / vegetarian / pescatarian là kỹ năng quan trọng. Vegan = không động vật, kể cả sữa trứng mật. Cá KHÔNG vegan (pescatarian là vegetarian + cá). Fish sauce gây khó cho khách vegan — luôn cảnh báo.",
    tip_advice_vi:
      "Khách vegan thường tip cao vì hiếm nhà hàng phục vụ tốt. Học 1-2 món vegan thuộc lòng để gợi ý ngay. Khách hài lòng = quay lại hàng tháng.",
  },
  {
    id: "restaurant_diet_no_msg",
    category: "special_requests",
    title_vi: "Không bột ngọt",
    title_en: "No MSG request",
    sentences: [
      { en: "We don't add MSG to anything.", vi: "Quán không dùng bột ngọt.", pronunciation_focus: ["MSG", "anything"] },
      { en: "But some store-bought sauces may contain it naturally.", vi: "Tuy nhiên có sốt mua sẵn có chứa tự nhiên.", pronunciation_focus: ["store-bought", "naturally"] },
      { en: "I'll let the kitchen know.", vi: "Em báo bếp.", pronunciation_focus: ["kitchen", "know"] },
      { en: "Anything else I should mention to the chef?", vi: "Còn gì cần em báo bếp không ạ?", pronunciation_focus: ["else", "chef"] },
    ],
    cultural_notes_vi:
      "'No MSG' phổ biến với khách lớn tuổi và khách Mỹ trắng. Khoa học hiện đại nói MSG không có hại — nhưng đừng tranh luận với khách. Luật: 'we don't add MSG' đúng nếu nhà hàng không dùng MSG nguyên chất.",
    tip_advice_vi:
      "'No MSG' là yêu cầu cảm xúc, không phải khoa học. Đừng giải thích — chỉ confirm 'we don't add MSG'. Khách hài lòng vì được lắng nghe = tip cao.",
  },
  {
    id: "restaurant_diet_steak_temp",
    category: "special_requests",
    title_vi: "Mức chín thịt bò",
    title_en: "Steak temperature",
    sentences: [
      { en: "How would you like that cooked — rare, medium, or well done?", vi: "Quý khách muốn nấu mức nào — tái, vừa, hay chín kỹ?", pronunciation_focus: ["rare", "medium", "well done"] },
      { en: "Medium-rare is pink in the middle, warm.", vi: "Medium-rare là hồng giữa, ấm.", pronunciation_focus: ["medium-rare", "middle"] },
      { en: "We can also do medium-well.", vi: "Em làm medium-well được luôn.", pronunciation_focus: ["medium-well"] },
      { en: "I'll let the kitchen know.", vi: "Em báo bếp.", pronunciation_focus: ["kitchen", "know"] },
    ],
    cultural_notes_vi:
      "Steak temp là kỹ năng cốt lõi ở nhà hàng Mỹ: rare/medium-rare/medium/medium-well/well-done. Nhầm = đổi món = mất doanh thu. Khách Việt thường thích 'well-done', khách Mỹ thích 'medium-rare'.",
    tip_advice_vi:
      "Lặp lại temp khi ghi: 'medium-rare, got it.' Khách Mỹ ghét nhân viên không hiểu temp — đó là rào cản tip lớn nhất với staff Việt mới sang.",
  },
  {
    id: "restaurant_diet_on_the_side",
    category: "special_requests",
    title_vi: "Sốt để riêng",
    title_en: "Dressing on the side",
    sentences: [
      { en: "Dressing on the side, no problem.", vi: "Sốt để riêng, không vấn đề.", pronunciation_focus: ["dressing", "side"] },
      { en: "Want me to bring extra napkins?", vi: "Em đem thêm khăn nhé?", pronunciation_focus: ["extra", "napkins"] },
      { en: "Salad dressing in a small cup.", vi: "Sốt salad trong ly nhỏ.", pronunciation_focus: ["salad", "small"] },
      { en: "Ranch okay, or do you prefer something else?", vi: "Sốt ranch được không, hay quý khách thích khác?", pronunciation_focus: ["ranch", "else"] },
    ],
    cultural_notes_vi:
      "'On the side' = đem riêng, để khách tự thêm. Phổ biến với khách kiêng calo, ăn kiêng, hay muốn kiểm soát mặn. Ranch là sốt salad phổ biến nhất Mỹ.",
    tip_advice_vi:
      "Khi khách yêu cầu 'on the side', đó là tín hiệu họ chú ý sức khỏe — gợi ý 'we have a light option'. Khách ăn kiêng tip ổn định 18–20% nếu được phục vụ tinh tế.",
  },
  {
    id: "restaurant_diet_kid_friendly",
    category: "special_requests",
    title_vi: "Đồ ăn cho bé",
    title_en: "Kid-friendly options",
    sentences: [
      { en: "Kids' menu has nuggets, mac and cheese, or grilled chicken.", vi: "Menu trẻ em có gà nuggets, mì phô mai, hoặc gà nướng.", pronunciation_focus: ["nuggets", "cheese"] },
      { en: "All seven dollars and come with apple slices or fries.", vi: "Tất cả bảy đô, kèm táo lát hoặc khoai chiên.", pronunciation_focus: ["seven", "fries"] },
      { en: "Want me to make the chicken plain?", vi: "Em làm gà không gia vị nhé?", pronunciation_focus: ["plain", "chicken"] },
      { en: "We can split it onto two plates if they're sharing.", vi: "Em chia hai đĩa nếu các bé chia nhau.", pronunciation_focus: ["split", "sharing"] },
    ],
    cultural_notes_vi:
      "Bé Mỹ ăn kén — nuggets, mac & cheese, fries là 'safe foods'. 'Plain' (không gia vị) là yêu cầu phổ biến cho bé. Apple slices là lựa chọn lành mạnh thay fries — cha mẹ thích.",
    tip_advice_vi:
      "Phục vụ bé ngon = cha mẹ vui = tip cao + quay lại. Đem nước cho bé NGAY (cup có nắp + ống hút). Bé khóc = bữa ăn tệ = tip giảm.",
  },
  {
    id: "restaurant_diet_to_go_box",
    category: "special_requests",
    title_vi: "Hộp mang về",
    title_en: "To-go box",
    sentences: [
      { en: "Want me to box that up for you?", vi: "Em gói mang về nhé?", pronunciation_focus: ["box", "up"] },
      { en: "I'll bring some sauce on the side.", vi: "Em đem thêm sốt riêng.", pronunciation_focus: ["sauce", "side"] },
      { en: "I can put the rice and the soup in separate containers.", vi: "Em để cơm và súp trong hộp riêng.", pronunciation_focus: ["rice", "containers"] },
      { en: "Anything else for the road?", vi: "Cần gì thêm cho đường về không ạ?", pronunciation_focus: ["else", "road"] },
    ],
    cultural_notes_vi:
      "'Box up' = gói mang về (leftover). Người Mỹ rất quen — không hổ khi yêu cầu. Súp/sốt phải đem trong hộp riêng — không thấm vào cơm. Đem thêm fork/spoon là tinh tế.",
    tip_advice_vi:
      "Đề nghị box up trước khi khách hỏi. Cử chỉ chu đáo này tăng tip đáng kể vì khách cảm thấy được chăm sóc. Tốn $0.20 hộp = tip thêm $2–3.",
  },
  {
    id: "restaurant_diet_pregnant",
    category: "special_requests",
    title_vi: "Khách mang thai",
    title_en: "Pregnant guest",
    sentences: [
      { en: "Congratulations! Anything I should know about food preferences?", vi: "Chúc mừng! Có gì về món ăn em cần biết không?", pronunciation_focus: ["congratulations"] },
      { en: "We have decaf coffee and herbal teas.", vi: "Có cà phê khử caffeine và trà thảo mộc.", pronunciation_focus: ["decaf", "herbal"] },
      { en: "Any raw fish dishes I should leave off?", vi: "Em loại bỏ món cá sống không ạ?", pronunciation_focus: ["raw", "leave"] },
      { en: "Just say the word and I'll watch out for you.", vi: "Quý khách nói là em để ý ạ.", pronunciation_focus: ["watch", "word"] },
    ],
    cultural_notes_vi:
      "Khách mang thai Mỹ kiêng raw fish, soft cheese, deli meat, alcohol, cao caffeine. Hỏi 'congratulations' tự nhiên + đề nghị giúp loại bỏ rủi ro = ấn tượng chuyên nghiệp.",
    tip_advice_vi:
      "Khách mang thai = khách trung thành 5–10 năm sau (đem cả gia đình). Đầu tư phục vụ ân cần lúc này = doanh thu dài hạn. Tip cao đặc biệt vì cảm động sự tinh tế.",
  },
  {
    id: "restaurant_diet_diabetic",
    category: "special_requests",
    title_vi: "Khách tiểu đường",
    title_en: "Diabetic-friendly request",
    sentences: [
      { en: "Lower-carb options — we can swap rice for greens.", vi: "Ít tinh bột — em đổi cơm thành rau.", pronunciation_focus: ["lower-carb", "swap"] },
      { en: "I'll ask the chef to skip the sugar in the marinade.", vi: "Em báo bếp bỏ đường trong nước ướp.", pronunciation_focus: ["skip", "marinade"] },
      { en: "Diet soda and unsweetened tea are zero-calorie.", vi: "Soda diet và trà không đường, zero calo.", pronunciation_focus: ["diet", "calorie"] },
      { en: "Take your time, no rush.", vi: "Quý khách thong thả ạ.", pronunciation_focus: ["take", "rush"] },
    ],
    cultural_notes_vi:
      "Tiểu đường ngày càng phổ biến ở Mỹ — đặc biệt khách lớn tuổi và Việt Nam. 'Lower-carb' và 'no sugar' là yêu cầu hợp lý. Đáp lại bình thường, không hỏi tại sao.",
    tip_advice_vi:
      "Đừng nói 'are you on a diet?' — đó là câu thô. Chỉ phục vụ theo yêu cầu, không hỏi lý do. Khách trân trọng sự tế nhị = tip thêm.",
  },
];

// ── 5. Handling complaints (5) ───────────────────────────────────────────

const COMPLAINTS: RestaurantLesson[] = [
  {
    id: "restaurant_complaint_wrong_order",
    category: "handling_complaints",
    title_vi: "Order sai món",
    title_en: "Wrong order",
    sentences: [
      { en: "I'm so sorry — let me get the right one out right away.", vi: "Em xin lỗi — em đem món đúng ra ngay ạ.", pronunciation_focus: ["sorry", "right"] },
      { en: "Want to keep this in case you'd like a bite?", vi: "Quý khách giữ lại nếu muốn nếm thử không?", pronunciation_focus: ["keep", "bite"] },
      { en: "I'll get the kitchen to fast-track it.", vi: "Em báo bếp làm nhanh.", pronunciation_focus: ["fast-track", "kitchen"] },
      { en: "Drinks on me while you wait.", vi: "Em mời nước trong lúc chờ.", pronunciation_focus: ["drinks", "wait"] },
    ],
    cultural_notes_vi:
      "Đáp 'I'm so sorry' NGAY, không bao biện. Khách Mỹ ghét nghe 'the kitchen made a mistake' — đó là lỗi của nhân viên. Đem món đúng + tặng nước = sửa sai chuẩn.",
    tip_advice_vi:
      "Lỗi sai món thường mất 5% tip. Tặng drink miễn phí ($3 cost) = thường lấy lại tip hoặc thêm. Đầu tư nhỏ, lấy lại lớn.",
  },
  {
    id: "restaurant_complaint_cold_food",
    category: "handling_complaints",
    title_vi: "Đồ ăn nguội",
    title_en: "Food is cold",
    sentences: [
      { en: "I'm sorry it came out cold — let me reheat it.", vi: "Em xin lỗi món nguội — em hâm lại.", pronunciation_focus: ["cold", "reheat"] },
      { en: "Or I can have the chef remake it fresh.", vi: "Hoặc em báo bếp làm món mới.", pronunciation_focus: ["chef", "fresh"] },
      { en: "Won't be on the bill.", vi: "Sẽ không tính tiền.", pronunciation_focus: ["won't", "bill"] },
      { en: "Sorry about that.", vi: "Em xin lỗi vụ đó.", pronunciation_focus: ["sorry"] },
    ],
    cultural_notes_vi:
      "Đồ ăn nguội = lỗi nhà hàng. Đáp lại lập tức, đem món mới (không reheat món cũ). Bồi thường hợp lý là miễn phí phần đó. Khách thấy được tôn trọng = tip giữ nguyên.",
    tip_advice_vi:
      "Đừng để khách phải hỏi lần hai. Một câu 'sorry about that' chân thành đỡ được 80% bực bội. Đề nghị remake miễn phí thay vì reheat — chất lượng cao hơn.",
  },
  {
    id: "restaurant_complaint_hair_in_food",
    category: "handling_complaints",
    title_vi: "Có tóc trong đồ ăn",
    title_en: "Hair in the food",
    sentences: [
      { en: "Oh no, I'm so sorry. That's totally not okay.", vi: "Ôi, em xin lỗi. Đó là không chấp nhận được.", pronunciation_focus: ["totally", "okay"] },
      { en: "Let me get you a fresh plate immediately.", vi: "Em đem đĩa mới ngay.", pronunciation_focus: ["fresh", "plate"] },
      { en: "Of course it's on the house.", vi: "Tất nhiên là quán đãi.", pronunciation_focus: ["house"] },
      { en: "Manager will swing by to apologize too.", vi: "Quản lý sẽ ghé xin lỗi luôn.", pronunciation_focus: ["manager", "swing"] },
    ],
    cultural_notes_vi:
      "Tóc trong đồ ăn = vấn đề nghiêm trọng. Phản ứng đúng: xin lỗi + món mới + miễn phí + báo manager. Sai lầm: cãi 'maybe it's yours' — đó là cách mất khách vĩnh viễn.",
    tip_advice_vi:
      "Manager phải xuất hiện. Nếu không, khách viết review 1 sao — mất doanh thu nhiều hơn $20 mất tip. Báo manager ngay = bảo vệ uy tín nhà hàng.",
  },
  {
    id: "restaurant_complaint_long_wait",
    category: "handling_complaints",
    title_vi: "Chờ quá lâu",
    title_en: "Long wait time",
    sentences: [
      { en: "I'm checking with the kitchen now — won't be much longer.", vi: "Em hỏi bếp ngay — không lâu nữa đâu ạ.", pronunciation_focus: ["checking", "longer"] },
      { en: "Sorry for the wait — Friday rush.", vi: "Xin lỗi đã chờ — tối thứ Sáu đông.", pronunciation_focus: ["wait", "Friday"] },
      { en: "Your patience means a lot.", vi: "Em rất biết ơn quý khách kiên nhẫn.", pronunciation_focus: ["patience", "means"] },
      { en: "Let me bring some bread to tide you over.", vi: "Em đem chút bánh mì cho đỡ đói.", pronunciation_focus: ["bread", "tide"] },
    ],
    cultural_notes_vi:
      "Chờ lâu là vấn đề thường nhất ở nhà hàng Mỹ. Cập nhật khách MỖI 5 phút khi quá hẹn — yên lặng tệ hơn lâu. Bánh mì miễn phí là 'goodwill' rẻ.",
    tip_advice_vi:
      "Đem 'bread to tide you over' (bánh mì miễn phí) chỉ tốn $0.50 nhưng cứu được tip $5–10. Đầu tư khôn ngoan nhất ở Mỹ.",
  },
  {
    id: "restaurant_complaint_unwell",
    category: "handling_complaints",
    title_vi: "Khách mệt sau bữa ăn",
    title_en: "Guest feels unwell",
    sentences: [
      { en: "Are you feeling okay? Can I get you some water or ginger ale?", vi: "Quý khách có sao không? Em đem nước hay ginger ale ạ?", pronunciation_focus: ["okay", "ginger"] },
      { en: "Take all the time you need.", vi: "Quý khách cứ thong thả nghỉ.", pronunciation_focus: ["take", "need"] },
      { en: "Let me know if you'd like to step outside for air.", vi: "Quý khách muốn ra ngoài hít thở thì báo em.", pronunciation_focus: ["step", "outside"] },
      { en: "Want me to box up the rest?", vi: "Em gói phần còn lại nhé?", pronunciation_focus: ["box", "rest"] },
    ],
    cultural_notes_vi:
      "Khách mệt giữa bữa = tình huống nhạy cảm. Ginger ale (soda gừng) là drink truyền thống cho buồn nôn ở Mỹ. Đừng ép khách ăn — phục vụ chu đáo.",
    tip_advice_vi:
      "Khách mệt vì lý do ngoài food (PMS, hangover, lo lắng) — đừng cảm thấy tội lỗi. Phục vụ ân cần = tip ổn định. Khách hỏi mua lại lần sau khi nhớ sự tinh tế.",
  },
];

// ── 6. Vietnamese food to non-Vietnamese guests (5) ──────────────────────

const VN_FOOD: RestaurantLesson[] = [
  {
    id: "restaurant_vn_intro_pho",
    category: "vn_food_to_americans",
    title_vi: "Giới thiệu phở",
    title_en: "Introducing pho",
    sentences: [
      { en: "Pho is Vietnam's most famous dish — basically a soup hug.", vi: "Phở là món nổi nhất của Việt Nam — như một cái ôm bằng súp.", pronunciation_focus: ["famous", "hug"] },
      { en: "Beef broth simmered overnight, rice noodles, fresh herbs.", vi: "Nước hầm bò qua đêm, bánh phở, rau thơm tươi.", pronunciation_focus: ["broth", "overnight"] },
      { en: "We say it 'fuh,' rhymes with 'duh.'", vi: "Đọc là 'fuh,' vần với 'duh.'", pronunciation_focus: ["rhymes", "duh"] },
      { en: "Comfort food at its finest.", vi: "Comfort food đỉnh nhất.", pronunciation_focus: ["comfort", "finest"] },
    ],
    cultural_notes_vi:
      "'Soup hug' là metaphor khách Mỹ hiểu ngay (giống 'comfort food'). Dạy phát âm 'fuh' nhẹ nhàng — nhiều khách lặp lại. Đừng sửa nếu khách phát âm sai — học dần.",
    tip_advice_vi:
      "Mỗi lần giới thiệu phở thành công = một khách quay lại + một bạn bè. Truyền cảm hứng tốt hơn liệt kê thành phần. 'Comfort food at its finest' chốt khách lưỡng lự.",
  },
  {
    id: "restaurant_vn_intro_banh_mi",
    category: "vn_food_to_americans",
    title_vi: "Giới thiệu bánh mì",
    title_en: "Introducing banh mi",
    sentences: [
      { en: "Banh mi is a Vietnamese sandwich — a French baguette with Asian ingredients.", vi: "Bánh mì là sandwich Việt — baguette Pháp với nhân kiểu Á.", pronunciation_focus: ["sandwich", "baguette"] },
      { en: "It's where Saigon meets Paris.", vi: "Nơi Sài Gòn gặp Paris.", pronunciation_focus: ["Saigon", "Paris"] },
      { en: "Crispy bread, savory meat, pickled veggies, fresh cilantro.", vi: "Bánh giòn, thịt mặn, đồ chua, ngò tươi.", pronunciation_focus: ["crispy", "savory"] },
      { en: "Best ten-dollar lunch in town.", vi: "Bữa trưa 10 đô ngon nhất khu này.", pronunciation_focus: ["ten-dollar", "town"] },
    ],
    cultural_notes_vi:
      "'Where Saigon meets Paris' — câu này tạo cảm hứng. Khách Mỹ thích lịch sử món ăn. Lưu ý: 'savory' (mặn-ngọt) là từ ma thuật cho khách Mỹ — họ đánh giá cao 'savory umami'.",
    tip_advice_vi:
      "Đề nghị bánh mì cho khách lần đầu — rẻ, ăn dễ, không cần đũa. Nếu họ thích, lần sau gọi pho. Đường vào ẩm thực Việt qua bánh mì là cửa rộng nhất.",
  },
  {
    id: "restaurant_vn_intro_spice_level",
    category: "vn_food_to_americans",
    title_vi: "Giải thích mức cay",
    title_en: "Explaining spice levels",
    sentences: [
      { en: "Vietnamese 'medium' is a little hotter than American medium.", vi: "Mức 'vừa' kiểu Việt cay hơn 'vừa' kiểu Mỹ một chút.", pronunciation_focus: ["medium", "American"] },
      { en: "Start mild if you're new to it.", vi: "Lần đầu nên bắt đầu nhẹ.", pronunciation_focus: ["start", "mild"] },
      { en: "You can add chilies on the side.", vi: "Quý khách tự thêm ớt riêng.", pronunciation_focus: ["chilies", "side"] },
      { en: "Sriracha makes everything better.", vi: "Sriracha thêm vào ngon hơn.", pronunciation_focus: ["Sriracha", "better"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ tự hào ăn cay nhưng nhiều người không thực tế. 'Start mild' lịch sự, không xúc phạm. Sriracha là 'gateway sauce' tới ẩm thực Á — phần lớn khách Mỹ biết.",
    tip_advice_vi:
      "Đừng khiêu khích khách 'try the hottest!' — họ bỏ phần ăn nếu quá cay. Bắt đầu mild, đem ớt riêng, để khách tự tăng. An toàn = tip giữ nguyên.",
  },
  {
    id: "restaurant_vn_intro_fish_sauce",
    category: "vn_food_to_americans",
    title_vi: "Giải thích nước mắm",
    title_en: "Explaining fish sauce",
    sentences: [
      { en: "Fish sauce is the Vietnamese soy sauce — funky but addictive.", vi: "Nước mắm là nước tương Việt — mùi đặc trưng nhưng gây nghiện.", pronunciation_focus: ["fish", "addictive"] },
      { en: "Smells stronger than it tastes.", vi: "Mùi mạnh hơn vị.", pronunciation_focus: ["smells", "tastes"] },
      { en: "Once you try it, you can't go back.", vi: "Thử rồi là không quay lại được.", pronunciation_focus: ["once", "back"] },
      { en: "Want me to bring a small dish to dip?", vi: "Em đem chén nhỏ chấm thử nhé?", pronunciation_focus: ["bring", "dip"] },
    ],
    cultural_notes_vi:
      "Nước mắm là rào cản tâm lý lớn cho khách Mỹ — mùi đặc trưng. 'Funky but addictive' là từ tích cực, không xúc phạm. 'Smells stronger than it tastes' giải tỏa lo lắng.",
    tip_advice_vi:
      "Đem chén nhỏ thử — KHÔNG đổ trực tiếp lên món lần đầu. Khách thử thấy ngon = đặt món có nước mắm lần sau. Khách bị 'shock' = không quay lại.",
  },
  {
    id: "restaurant_vn_intro_table_service",
    category: "vn_food_to_americans",
    title_vi: "Cách ăn món Việt",
    title_en: "How to eat Vietnamese food",
    sentences: [
      { en: "We share dishes family-style.", vi: "Mọi người chia bàn nhau.", pronunciation_focus: ["share", "family-style"] },
      { en: "Order three or four mains, then split.", vi: "Order ba bốn món rồi chia nhau.", pronunciation_focus: ["order", "split"] },
      { en: "Chopsticks or fork — whatever you prefer.", vi: "Đũa hoặc nĩa, tuỳ ý.", pronunciation_focus: ["chopsticks", "fork"] },
      { en: "I'll bring extra plates.", vi: "Em đem thêm đĩa.", pronunciation_focus: ["extra", "plates"] },
    ],
    cultural_notes_vi:
      "Family-style là khái niệm Mỹ thân quen với Á-Mỹ. Đừng giả định khách dùng đũa — luôn hỏi. Đem nĩa nếu khách lưỡng lự. Câu 'whatever you prefer' rất quan trọng.",
    tip_advice_vi:
      "Family-style nâng bill bàn 30%. Câu 'order three or four mains' định hướng cụ thể giúp khách thoải mái order nhiều. Họ cảm ơn vì lời khuyên = tip cao.",
  },
];

// ── 7. Payment + tipping (5) ─────────────────────────────────────────────

const PAYMENT: RestaurantLesson[] = [
  {
    id: "restaurant_payment_check",
    category: "payment_tipping",
    title_vi: "Đem hóa đơn",
    title_en: "Bringing the check",
    sentences: [
      { en: "I'll drop the check whenever you're ready.", vi: "Em đem hóa đơn khi nào quý khách sẵn sàng.", pronunciation_focus: ["drop", "ready"] },
      { en: "All on one or split it up?", vi: "Cùng một hóa đơn hay chia ra ạ?", pronunciation_focus: ["all", "split"] },
      { en: "I can split four ways evenly.", vi: "Em chia bốn phần đều được.", pronunciation_focus: ["split", "evenly"] },
      { en: "No rush — take your time.", vi: "Không vội — quý khách thong thả.", pronunciation_focus: ["rush", "take"] },
    ],
    cultural_notes_vi:
      "'Drop the check' là cụm chuẩn ở nhà hàng Mỹ. Đừng đem hóa đơn TRƯỚC khi khách yêu cầu — đó là tín hiệu 'đi đi'. Đợi khách hỏi hoặc nhìn quanh tìm.",
    tip_advice_vi:
      "Tiền ing là 18–22% standard ở Mỹ. Splitting bill 4 cách đều = mỗi người tip riêng = tip TỔNG CAO HƠN nếu có người tip 25% (kéo trung bình lên).",
  },
  {
    id: "restaurant_payment_tip_screen",
    category: "payment_tipping",
    title_vi: "Màn hình tip thẻ",
    title_en: "Tip screen on card reader",
    sentences: [
      { en: "It'll show some suggested tip percentages.", vi: "Máy hiện vài mức tip gợi ý.", pronunciation_focus: ["suggested", "percentages"] },
      { en: "Or you can enter a custom amount.", vi: "Hoặc tự nhập số.", pronunciation_focus: ["custom", "amount"] },
      { en: "Just tap which one you'd like.", vi: "Chạm cái quý khách thích.", pronunciation_focus: ["tap", "like"] },
      { en: "Then sign on the screen.", vi: "Rồi ký trên màn hình.", pronunciation_focus: ["sign", "screen"] },
    ],
    cultural_notes_vi:
      "Máy thẻ Mỹ chuẩn (Square, Toast) hiện 18%/20%/22% hoặc 15%/18%/20%. Nhân viên KHÔNG được hướng dẫn khách chọn mức nào — đó là phép lịch sự + có thể vi phạm chính sách.",
    tip_advice_vi:
      "Quay đi khỏi màn hình khi khách nhập tip — đó là 'tip privacy'. Nhìn vào màn hình = áp lực = tip thấp hơn. Bước đi 2 mét, đếm tới 30 = tip cao hơn 5–10%.",
  },
  {
    id: "restaurant_payment_cash_tip",
    category: "payment_tipping",
    title_vi: "Tip tiền mặt",
    title_en: "Cash tip",
    sentences: [
      { en: "Thank you so much! Have a great rest of your night.", vi: "Cảm ơn quý khách rất nhiều! Chúc tối còn lại vui vẻ.", pronunciation_focus: ["thank", "rest"] },
      { en: "You're so generous.", vi: "Quý khách thật hào phóng.", pronunciation_focus: ["generous"] },
      { en: "Hope to see you again soon.", vi: "Mong gặp lại sớm.", pronunciation_focus: ["hope", "soon"] },
      { en: "Get home safe.", vi: "Về nhà an toàn ạ.", pronunciation_focus: ["get", "safe"] },
    ],
    cultural_notes_vi:
      "Tip tiền mặt là tip lớn — vì khách thường để ý về tax (chính phủ thấy tip thẻ, không thấy tip mặt). Cảm ơn chân thành, không đếm trước mặt.",
    tip_advice_vi:
      "ĐẾM tiền mặt SAU khi khách đi. Đếm trước mặt = thiếu tinh tế = tip lần sau giảm. Cảm ơn nhẹ nhàng, gọi tên khách nếu nhớ — họ về nhà cảm thấy được trân trọng.",
  },
  {
    id: "restaurant_payment_split_check",
    category: "payment_tipping",
    title_vi: "Chia hóa đơn",
    title_en: "Splitting checks",
    sentences: [
      { en: "Sure, I can split four ways.", vi: "Vâng, em chia bốn phần ạ.", pronunciation_focus: ["sure", "split"] },
      { en: "Want it evenly, or itemized by who ordered what?", vi: "Chia đều hay theo món ai gọi ạ?", pronunciation_focus: ["evenly", "itemized"] },
      { en: "I'll bring four separate checks.", vi: "Em đem bốn hóa đơn riêng.", pronunciation_focus: ["four", "separate"] },
      { en: "Give me a sec to print them.", vi: "Cho em chút em in ra.", pronunciation_focus: ["sec", "print"] },
    ],
    cultural_notes_vi:
      "Chia bill là thông lệ Mỹ — đừng phàn nàn dù phức tạp. 'Itemized' (theo món) khó hơn 'evenly' (chia đều) — cảnh báo khách: itemized mất 5–10 phút thêm.",
    tip_advice_vi:
      "Chia bill khéo léo = nhóm khách quay lại lần sau. Mỗi người trả riêng → mỗi người tip riêng → tip TỔNG cao hơn 'one bill' (vì người tip cao kéo trung bình).",
  },
  {
    id: "restaurant_payment_gift_card",
    category: "payment_tipping",
    title_vi: "Bán gift card",
    title_en: "Selling gift cards",
    sentences: [
      { en: "We sell gift cards if you're looking for a present.", vi: "Quán bán gift card nếu quý khách cần quà.", pronunciation_focus: ["gift", "present"] },
      { en: "Available in any amount.", vi: "Số tiền tuỳ ý.", pronunciation_focus: ["available", "amount"] },
      { en: "Buy a fifty, get a five back.", vi: "Mua 50 đô, tặng lại 5 đô.", pronunciation_focus: ["fifty", "five"] },
      { en: "They never expire.", vi: "Không có hạn sử dụng.", pronunciation_focus: ["never", "expire"] },
    ],
    cultural_notes_vi:
      "Gift cards bán mạnh trước Christmas + Mother's Day. 'Buy fifty, get five' tăng doanh thu Q4 đáng kể. 'Never expire' là điểm bán hàng (luật Mỹ thường yêu cầu).",
    tip_advice_vi:
      "Gift card mua $100 = $0 chi phí cho nhà hàng (chỉ là IOU). Khi khách dùng, biên lợi nhuận cao. Khuyến khích nhân viên bán gift card = thưởng theo quý.",
  },
];

// ── 8. End-of-meal interactions (5) ──────────────────────────────────────

const END_OF_MEAL: RestaurantLesson[] = [
  {
    id: "restaurant_end_how_was_it",
    category: "end_of_meal",
    title_vi: "Hỏi về bữa ăn",
    title_en: "Asking how the meal was",
    sentences: [
      { en: "How was everything tonight?", vi: "Tối nay mọi thứ thế nào ạ?", pronunciation_focus: ["everything", "tonight"] },
      { en: "Glad you enjoyed it!", vi: "Vui vì quý khách thích!", pronunciation_focus: ["glad", "enjoyed"] },
      { en: "Anything we could do better?", vi: "Có gì chúng tôi cải thiện được không?", pronunciation_focus: ["anything", "better"] },
      { en: "Thanks for coming in.", vi: "Cảm ơn quý khách ghé.", pronunciation_focus: ["thanks", "coming"] },
    ],
    cultural_notes_vi:
      "Hỏi 'how was everything?' là chuẩn cuối bữa. Đừng hỏi giữa bữa nếu khách đang ăn. Câu trả lời 'good' / 'great' là dấu hiệu hài lòng — đừng đào sâu thêm.",
    tip_advice_vi:
      "Câu hỏi này tạo cơ hội khách phản hồi tích cực → tăng tip 2–3%. Khách phàn nàn lúc này = cơ hội sửa trước khi họ viết Yelp review.",
  },
  {
    id: "restaurant_end_dessert_offer",
    category: "end_of_meal",
    title_vi: "Đề nghị tráng miệng",
    title_en: "Offering dessert",
    sentences: [
      { en: "Save room for dessert?", vi: "Còn bụng cho tráng miệng không ạ?", pronunciation_focus: ["save", "dessert"] },
      { en: "Coffee or tea to go with?", vi: "Cà phê hay trà kèm không?", pronunciation_focus: ["coffee", "tea"] },
      { en: "We have flan and mango sticky rice tonight.", vi: "Tối nay có flan và xôi xoài.", pronunciation_focus: ["flan", "sticky"] },
      { en: "Easy to share.", vi: "Dễ chia bàn.", pronunciation_focus: ["easy", "share"] },
    ],
    cultural_notes_vi:
      "'Save room for dessert?' kinh điển — 40% khách order. Đề nghị 'coffee or tea' kèm dessert tăng cơ hội. 'Easy to share' giúp khách lưỡng lự (không muốn ăn nhiều).",
    tip_advice_vi:
      "Đem menu dessert dù khách chưa hỏi. Mỗi dessert $7–10 = $1.50 tip. Một bàn 4 người + 2 dessert = $20 doanh thu thêm + $4 tip thêm cho 2 phút công.",
  },
  {
    id: "restaurant_end_box_leftover",
    category: "end_of_meal",
    title_vi: "Hộp đồ thừa",
    title_en: "Boxing leftovers",
    sentences: [
      { en: "Want me to box that up?", vi: "Em gói lại nhé?", pronunciation_focus: ["box", "up"] },
      { en: "I'll bring some sauce on the side.", vi: "Em đem thêm sốt riêng.", pronunciation_focus: ["sauce", "side"] },
      { en: "Two separate boxes okay?", vi: "Hai hộp riêng nhé?", pronunciation_focus: ["two", "separate"] },
      { en: "Bag for the road?", vi: "Túi mang về nhé?", pronunciation_focus: ["bag", "road"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ thường mang về đồ thừa — không hổ. Đem hộp + túi NGAY khi đề nghị. Sốt phải riêng. Đa số nhà hàng tính $0 cho hộp; vài nơi tính $0.50.",
    tip_advice_vi:
      "Đề nghị box up TRƯỚC khi khách hỏi. Cử chỉ chu đáo này tăng tip $1–2 mỗi bàn. Tốn $0.30 hộp = lợi $1–2 tip = tỷ suất tốt.",
  },
  {
    id: "restaurant_end_recommendation",
    category: "end_of_meal",
    title_vi: "Đề nghị giới thiệu bạn bè",
    title_en: "Asking for recommendations",
    sentences: [
      { en: "If you enjoyed it, please tell your friends.", vi: "Nếu quý khách thích, kể bạn bè giúp em nhé.", pronunciation_focus: ["enjoyed", "friends"] },
      { en: "We're on Yelp and Google.", vi: "Quán có trên Yelp và Google.", pronunciation_focus: ["Yelp", "Google"] },
      { en: "A quick review means a lot.", vi: "Một review ngắn rất ý nghĩa.", pronunciation_focus: ["quick", "means"] },
      { en: "Hope to see you again.", vi: "Mong gặp lại quý khách.", pronunciation_focus: ["hope", "again"] },
    ],
    cultural_notes_vi:
      "Yelp + Google reviews là sống còn của nhà hàng Mỹ. Một review 5 sao = $1,000–5,000 doanh thu. Đề nghị nhẹ nhàng, không ép. Khách hài lòng tự nguyện.",
    tip_advice_vi:
      "Card kèm bill có QR code Yelp/Google. Khách quét → review trong xe → review tích cực. Đầu tư $0 = doanh thu hàng ngàn đô. Marketing miễn phí tốt nhất.",
  },
  {
    id: "restaurant_end_goodbye",
    category: "end_of_meal",
    title_vi: "Chào tạm biệt",
    title_en: "Saying goodbye",
    sentences: [
      { en: "Thanks so much for coming in tonight.", vi: "Cảm ơn quý khách tối nay đã ghé.", pronunciation_focus: ["thanks", "coming"] },
      { en: "Drive safe!", vi: "Lái xe cẩn thận!", pronunciation_focus: ["drive", "safe"] },
      { en: "Have a wonderful evening.", vi: "Chúc buổi tối tốt lành.", pronunciation_focus: ["wonderful", "evening"] },
      { en: "Hope to see you again soon.", vi: "Mong gặp lại sớm.", pronunciation_focus: ["hope", "soon"] },
    ],
    cultural_notes_vi:
      "Câu chào cuối bữa quan trọng như câu chào đầu. 'Drive safe' là cụm chuẩn ở Mỹ — không lạ. 'Have a wonderful evening' lịch sự, không quá thân.",
    tip_advice_vi:
      "Câu chào cuối bữa quyết định khách có quay lại. Gọi tên khách nếu nhớ ('thank you, Linda') = ấn tượng mạnh. Tip cuối bữa lớn nếu cảm xúc khách tốt.",
  },
];

// ── Aggregate + helpers ──────────────────────────────────────────────────

export const RESTAURANT_LESSONS: ReadonlyArray<RestaurantLesson> = [
  ...GREETING_SEATING,
  ...DRINK_ORDERS,
  ...MENU_EXPLANATION,
  ...SPECIAL_REQUESTS,
  ...COMPLAINTS,
  ...VN_FOOD,
  ...PAYMENT,
  ...END_OF_MEAL,
];

export function getRestaurantLessonsByCategory(
  category: RestaurantCategoryId,
): RestaurantLesson[] {
  return RESTAURANT_LESSONS.filter((l) => l.category === category);
}

export function getRestaurantLessonById(id: string): RestaurantLesson | undefined {
  return RESTAURANT_LESSONS.find((l) => l.id === id);
}
