// src/data/profession-packs/hospitality/content.ts
//
// Lesson-shaped content for the hospitality profession pack — sixth
// VN-diaspora vertical after nail-tech / restaurant / customer-service /
// healthcare / tech-worker. Same content shape so the page UI + tests
// stay consistent across verticals.
//
// 50 lessons across 8 categories. Each lesson:
//
//   id                 hospitality_<slug> — forward-compatible with
//                      future room IDs in roomRegistry.
//   title_vi/title_en  bilingual title.
//   category           one of HOSPITALITY_CATEGORIES.
//   sentences          4–6 short utterances. Each carries a Vietnamese
//                      gloss + pronunciation_focus keys for VN-typical
//                      hospitality-English misses (brand names,
//                      "concierge", "amenities", final /s/ in plurals,
//                      number/date precision).
//   cultural_notes_vi  what's actually true at a US hotel — tipping
//                      norms (housekeeping, bellhop, concierge), brand
//                      voice variation (Marriott vs Four Seasons),
//                      privacy norms (never confirm guest presence).
//   tip_advice_vi      practical floor advice — empathy first, name use,
//                      brand-script vs improvisation balance, repeat-
//                      guest preferences.
//
// Hand-crafted from front-desk / housekeeping / concierge experience.
// No AI-generated filler. Same authenticity bar as the previous packs.

export type HospitalityCategoryId =
  | "check_in_out"
  | "concierge"
  | "housekeeping"
  | "complaint_handling"
  | "banquet_event"
  | "phone_etiquette"
  | "multi_language"
  | "cultural_awareness";

export type HospitalityCategoryMeta = {
  id: HospitalityCategoryId;
  title_vi: string;
  title_en: string;
  expected_count: number;
};

export const HOSPITALITY_CATEGORIES: ReadonlyArray<HospitalityCategoryMeta> = [
  {
    id: "check_in_out",
    title_vi: "Nhận và trả phòng",
    title_en: "Check-in and check-out",
    expected_count: 10,
  },
  {
    id: "concierge",
    title_vi: "Yêu cầu concierge",
    title_en: "Concierge requests",
    expected_count: 5,
  },
  {
    id: "housekeeping",
    title_vi: "Giao tiếp dọn phòng",
    title_en: "Housekeeping interactions",
    expected_count: 5,
  },
  {
    id: "complaint_handling",
    title_vi: "Xử lý phàn nàn",
    title_en: "Complaint handling",
    expected_count: 10,
  },
  {
    id: "banquet_event",
    title_vi: "Phục vụ tiệc và sự kiện",
    title_en: "Banquet and event service",
    expected_count: 5,
  },
  {
    id: "phone_etiquette",
    title_vi: "Lễ phép qua điện thoại",
    title_en: "Front-of-house phone etiquette",
    expected_count: 5,
  },
  {
    id: "multi_language",
    title_vi: "Khách không nói tiếng Anh",
    title_en: "Multi-language guest service",
    expected_count: 5,
  },
  {
    id: "cultural_awareness",
    title_vi: "Hiểu biết văn hoá",
    title_en: "Cultural awareness",
    expected_count: 5,
  },
];

export type LessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
};

export type HospitalityLesson = {
  id: string;
  category: HospitalityCategoryId;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  tip_advice_vi: string;
};

// ── 1. Check-in / check-out (10) ──────────────────────────────────────────

const CHECK_IN_OUT: HospitalityLesson[] = [
  {
    id: "hospitality_checkin_greeting",
    category: "check_in_out",
    title_vi: "Chào khách đến nhận phòng",
    title_en: "Greeting an arriving guest",
    sentences: [
      { en: "Welcome to the Marriott. Are you checking in?", vi: "Chào quý khách đến Marriott. Quý khách check-in ạ?", pronunciation_focus: ["Marriott", "checking"] },
      { en: "May I have the name on the reservation?", vi: "Cho em xin tên trên đơn đặt phòng ạ?", pronunciation_focus: ["may", "reservation"] },
      { en: "And a photo ID and credit card, please.", vi: "Và CMND có ảnh cùng thẻ tín dụng ạ.", pronunciation_focus: ["photo", "credit"] },
      { en: "I see you here, Mr. Nguyen — let me get you settled.", vi: "Em thấy ông Nguyễn rồi — để em làm thủ tục.", pronunciation_focus: ["settled"] },
    ],
    cultural_notes_vi:
      "Câu chào đầu là khoảnh khắc 'first impression' — khách Mỹ đánh giá toàn bộ stay trong 30 giây đầu. Dùng tên brand ('Welcome to the Marriott') chuyên nghiệp hơn 'welcome to our hotel'. Mỗi brand có script riêng — học script của tiệm.",
    tip_advice_vi:
      "Mỉm cười trước khi nói câu đầu — khách cảm nhận thái độ qua giọng. Photo ID là pháp lý ở Mỹ (anti-fraud + counter-terrorism), không phải tuỳ ý. Khách hỏi 'why' — đáp 'standard hotel policy' không cần giải thích thêm.",
  },
  {
    id: "hospitality_checkin_room_assignment",
    category: "check_in_out",
    title_vi: "Phân phòng",
    title_en: "Room assignment",
    sentences: [
      { en: "You're in room 412 — fourth floor, on the courtyard side.", vi: "Phòng 412 — tầng 4, phía sân trong.", pronunciation_focus: ["fourth", "courtyard"] },
      { en: "Two queen beds, as you requested.", vi: "Hai giường queen như quý khách yêu cầu.", pronunciation_focus: ["queen", "requested"] },
      { en: "Elevators are to your right past the lobby.", vi: "Thang máy bên phải, đi qua sảnh.", pronunciation_focus: ["right", "lobby"] },
      { en: "Wi-Fi password is on the back of the key card.", vi: "Mật khẩu Wi-Fi mặt sau thẻ phòng.", pronunciation_focus: ["password", "back"] },
    ],
    cultural_notes_vi:
      "Số phòng đọc rõ từng chữ — '412' không phải 'four hundred twelve' (gây hiểu nhầm). Tầng đếm theo Mỹ: 1st floor = lobby, 2nd = floor above. Khách Á-Đông quen 'ground floor + 1st' kiểu Anh — nhầm tầng phổ biến.",
    tip_advice_vi:
      "Khách đặt 'high floor' / 'quiet room' / 'far from elevator' — ghi vào hồ sơ cho lần sau. Khách quay lại = recognized = tip cao. Hệ thống PMS (Marriott Bonvoy, Hilton Honors) có note field — dùng đi.",
  },
  {
    id: "hospitality_checkin_loyalty",
    category: "check_in_out",
    title_vi: "Khách thành viên loyalty",
    title_en: "Loyalty program guest",
    sentences: [
      { en: "I see you're a Bonvoy Platinum member — welcome back.", vi: "Em thấy quý khách là Bonvoy Platinum — mời quay lại ạ.", pronunciation_focus: ["Bonvoy", "Platinum"] },
      { en: "We've upgraded you to a suite on the twelfth floor.", vi: "Em nâng cấp lên suite tầng 12.", pronunciation_focus: ["upgraded", "suite"] },
      { en: "Your bonus points are already in your account.", vi: "Điểm thưởng đã vào tài khoản.", pronunciation_focus: ["bonus", "account"] },
      { en: "Continental breakfast is on us.", vi: "Bữa sáng continental tiệm tặng.", pronunciation_focus: ["continental", "us"] },
    ],
    cultural_notes_vi:
      "Loyalty status là TÍN HIỆU lớn — khách Platinum/Diamond thường ở khách sạn 100+ đêm/năm = doanh thu cao. Brand chuẩn upgrade khi available, free breakfast, late checkout. KHÔNG hứa upgrade nếu phòng hết — giải thích nhẹ 'we're fully committed tonight, but I've added a credit'.",
    tip_advice_vi:
      "Nhắc tên đúng và status đúng — 'Platinum' khác 'Gold'. Sai là xúc phạm. PMS hiển thị status — đọc trước khi gọi. Khách Platinum book trên app sẽ thấy upgrade trước check-in; nếu không upgrade tự động, em giải thích lý do.",
  },
  {
    id: "hospitality_checkin_early",
    category: "check_in_out",
    title_vi: "Nhận phòng sớm",
    title_en: "Early check-in",
    sentences: [
      { en: "Standard check-in is at three — let me see if your room's ready.", vi: "Check-in chuẩn lúc 3 giờ — để em xem phòng đã sẵn chưa.", pronunciation_focus: ["standard", "ready"] },
      { en: "It's not quite ready yet, but I can hold your bags.", vi: "Phòng chưa sẵn, em giữ hành lý giúp ạ.", pronunciation_focus: ["quite", "bags"] },
      { en: "I'll text you the moment it's ready.", vi: "Sẵn em nhắn tin ngay.", pronunciation_focus: ["text", "moment"] },
      { en: "Feel free to use the lobby or the pool while you wait.", vi: "Quý khách dùng sảnh hoặc hồ bơi trong lúc đợi.", pronunciation_focus: ["feel free", "pool"] },
    ],
    cultural_notes_vi:
      "3pm check-in / 11am checkout là chuẩn US (đôi khi 4pm / noon). Khách Á thường tới sớm, kỳ vọng vào ngay — văn hoá khác. Đáp 'standard check-in is three' nhẹ nhàng + đề nghị giữ bags + dùng amenities. Đa số khách hài lòng.",
    tip_advice_vi:
      "Đề nghị giải pháp THAY VÌ chỉ từ chối. 'Hold your bags + use the pool' tốt hơn 'sorry, three o'clock'. Khách Mỹ đánh giá cao 'solution mindset'. Tip housekeeping $5 để dọn phòng đó trước nếu khách rất muốn.",
  },
  {
    id: "hospitality_checkin_late_arrival",
    category: "check_in_out",
    title_vi: "Khách đến muộn",
    title_en: "Late-night arrival",
    sentences: [
      { en: "Welcome — long flight?", vi: "Mời ạ — chuyến bay dài không?", pronunciation_focus: ["welcome", "flight"] },
      { en: "I'll get you checked in quickly so you can rest.", vi: "Em làm nhanh để quý khách nghỉ.", pronunciation_focus: ["quickly", "rest"] },
      { en: "The kitchen closed at ten, but room service has a late menu.", vi: "Bếp đóng lúc 10 giờ, nhưng room service có menu đêm.", pronunciation_focus: ["closed", "menu"] },
      { en: "Anything I can have sent up?", vi: "Cần gì em gửi lên phòng?", pronunciation_focus: ["sent", "up"] },
    ],
    cultural_notes_vi:
      "Khách đến đêm thường mệt + đói. Empathy ('long flight?') quan trọng hơn quy trình. Late menu (room service đêm) là điểm cộng lớn — giới thiệu chủ động. Một số tiệm có cookies + nước ấm tặng khách late check-in.",
    tip_advice_vi:
      "Tốc độ là tip — khách mệt KHÔNG muốn nghe 'welcome to our hotel' đầy đủ. Ngắn, ấm, giải pháp. 'Long flight + I'll be quick + late menu' tổng cộng < 30 giây. Khách nhớ ơn cả stay.",
  },
  {
    id: "hospitality_checkin_credit_hold",
    category: "check_in_out",
    title_vi: "Giữ thẻ tín dụng",
    title_en: "Credit card hold",
    sentences: [
      { en: "We'll place a hold of one fifty per night for incidentals.", vi: "Em giữ 150 mỗi đêm cho phụ phí phát sinh.", pronunciation_focus: ["hold", "incidentals"] },
      { en: "It's not a charge — it'll release after checkout.", vi: "Không phải tính tiền — sẽ trả lại sau checkout.", pronunciation_focus: ["release", "checkout"] },
      { en: "Some banks take a few days to free it up.", vi: "Có ngân hàng mất vài ngày mới giải ngân.", pronunciation_focus: ["banks", "free"] },
      { en: "Any questions, the manager can pull the records.", vi: "Câu hỏi, quản lý kéo hồ sơ ra được.", pronunciation_focus: ["questions", "records"] },
    ],
    cultural_notes_vi:
      "'Hold' ($50–200/đêm) là chuẩn US — không phải scam. Khách Mỹ quen, khách quốc tế đôi khi hoảng. Giải thích RÕ 'not a charge, releases after checkout'. Một số bank giữ tới 7 ngày — báo trước tránh khiếu nại.",
    tip_advice_vi:
      "Khách lo về 'hold' — đề nghị in receipt cho hold + email confirmation. Documentation nhỏ này giải quyết 90% lo lắng. Nếu khách vẫn không yên, gọi manager — đừng tự đảm bảo điều gì ngoài chính sách tiệm.",
  },
  {
    id: "hospitality_checkin_walk_in",
    category: "check_in_out",
    title_vi: "Khách walk-in không đặt trước",
    title_en: "Walk-in guest, no reservation",
    sentences: [
      { en: "Let me check what we have available tonight.", vi: "Để em kiểm tra phòng còn tối nay.", pronunciation_focus: ["check", "available"] },
      { en: "We have a king room for two-eighty plus tax.", vi: "Còn phòng king 280 cộng thuế.", pronunciation_focus: ["king", "tax"] },
      { en: "Or a double queen for three-twenty.", vi: "Hoặc double queen 320.", pronunciation_focus: ["double", "queen"] },
      { en: "Either one, breakfast can be added for fifteen.", vi: "Cả hai, thêm bữa sáng 15.", pronunciation_focus: ["breakfast", "fifteen"] },
    ],
    cultural_notes_vi:
      "Walk-in = giá cao hơn online (yield management). Khách biết — không cần xin lỗi. 'Plus tax' là chuẩn US, đa số khách quen, vẫn nói rõ. Một số khách muốn 'AAA discount' / 'AARP discount' — kiểm tra membership card.",
    tip_advice_vi:
      "Walk-in chốt được = doanh thu lập tức cho tiệm. Đề nghị giá đầu tiên là rate cao nhất, dần xuống nếu khách lưỡng lự. KHÔNG hứa giá thấp hơn brand standard — vi phạm rate parity. Manager mới có quyền discount lớn.",
  },
  {
    id: "hospitality_checkout_express",
    category: "check_in_out",
    title_vi: "Trả phòng nhanh",
    title_en: "Express checkout",
    sentences: [
      { en: "Express checkout — bill goes to the email on file.", vi: "Checkout nhanh — hóa đơn gửi email đăng ký.", pronunciation_focus: ["express", "email"] },
      { en: "Just leave the key in the room.", vi: "Để chìa khoá lại trong phòng.", pronunciation_focus: ["leave", "key"] },
      { en: "Any incidentals will post overnight.", vi: "Phụ phí sẽ vào hệ thống qua đêm.", pronunciation_focus: ["incidentals", "overnight"] },
      { en: "Have a great trip home.", vi: "Chúc quý khách đi đường tốt lành.", pronunciation_focus: ["trip", "home"] },
    ],
    cultural_notes_vi:
      "Express checkout = không cần ghé desk. Phổ biến với khách business. Hóa đơn gửi email — đôi khi vào spam, dặn khách kiểm tra. Folio (hóa đơn chi tiết) khác receipt — folio có thể dùng expense report.",
    tip_advice_vi:
      "Lỗi sai bill phổ biến nhất ở checkout: phụ phí restaurant chưa post, parking valet chưa charge. Express check tự động post overnight — nếu khách phát hiện sai 1 tuần sau, gọi GM. Đừng tranh cãi qua email.",
  },
  {
    id: "hospitality_checkout_dispute",
    category: "check_in_out",
    title_vi: "Khách thắc mắc hoá đơn",
    title_en: "Bill dispute at checkout",
    sentences: [
      { en: "Let me pull up your folio so we can look at this together.", vi: "Em mở folio để mình cùng xem.", pronunciation_focus: ["folio", "together"] },
      { en: "I see the charge — that's from the minibar on Tuesday.", vi: "Em thấy phụ phí — minibar ngày thứ Ba.", pronunciation_focus: ["minibar", "Tuesday"] },
      { en: "If you didn't take it, I'll remove it right now.", vi: "Nếu quý khách không lấy, em xoá ngay.", pronunciation_focus: ["didn't", "remove"] },
      { en: "Sorry for the confusion.", vi: "Em xin lỗi vì sự nhầm lẫn.", pronunciation_focus: ["sorry", "confusion"] },
    ],
    cultural_notes_vi:
      "Minibar charges là nguồn dispute hàng đầu. Sensor minibar đôi khi sai (khách di chuyển chai mà không uống). Khách đúng = xoá ngay, không tranh cãi. Khách sai (uống mà không nhận) = hiếm khi phát hiện được — vẫn xoá để giữ relationship.",
    tip_advice_vi:
      "Quy tắc 'remove first, ask manager later' cho dispute < $50. Mất $30 = giữ khách trung thành = lợi $1000 stay tương lai. Manager backs you up nếu giải thích lý do. Tranh cãi vì $30 = mất tiệm.",
  },
  {
    id: "hospitality_checkout_late",
    category: "check_in_out",
    title_vi: "Trả phòng muộn",
    title_en: "Late checkout",
    sentences: [
      { en: "Standard checkout is eleven, but I can extend to one for free.", vi: "Checkout chuẩn 11 giờ, em gia hạn tới 1 giờ miễn phí.", pronunciation_focus: ["standard", "extend"] },
      { en: "After that, half-day rate applies.", vi: "Sau đó tính nửa ngày phòng.", pronunciation_focus: ["half-day", "applies"] },
      { en: "Or if you'd like, I can hold your bags downstairs.", vi: "Hoặc em giữ hành lý ở dưới.", pronunciation_focus: ["hold", "downstairs"] },
      { en: "Lobby has Wi-Fi if you need to work.", vi: "Sảnh có Wi-Fi nếu quý khách cần làm việc.", pronunciation_focus: ["lobby", "Wi-Fi"] },
    ],
    cultural_notes_vi:
      "Late checkout 1pm thường free cho loyalty. 2pm = half-day rate. Sau 4pm = full night. Bag storage là phép lịch sự, đa số khách Mỹ tip $1–2/bag cho bell desk. Khách quốc tế đôi khi quên tip — không nhắc.",
    tip_advice_vi:
      "Hệ thống PMS hiển thị occupancy — nếu tiệm vắng, gia hạn 2pm dễ dàng. Tiệm đầy = giữ checkout 11. KHÔNG hứa rồi rút lại — đó là cách mất khách. Kiểm tra trước khi nói 'yes'.",
  },
];

// ── 2. Concierge requests (5) ────────────────────────────────────────────

const CONCIERGE: HospitalityLesson[] = [
  {
    id: "hospitality_concierge_restaurant",
    category: "concierge",
    title_vi: "Gợi ý nhà hàng",
    title_en: "Restaurant recommendation",
    sentences: [
      { en: "What kind of food are you in the mood for?", vi: "Quý khách thích món gì tối nay ạ?", pronunciation_focus: ["mood", "for"] },
      { en: "There's a great Italian place two blocks over.", vi: "Có nhà hàng Ý ngon cách hai dãy nhà.", pronunciation_focus: ["Italian", "blocks"] },
      { en: "I can call ahead — they save tables for our guests.", vi: "Em gọi trước — họ giữ bàn cho khách tiệm.", pronunciation_focus: ["call ahead", "save"] },
      { en: "Want me to write down the address?", vi: "Em ghi địa chỉ cho quý khách nhé?", pronunciation_focus: ["write", "address"] },
    ],
    cultural_notes_vi:
      "Concierge có 'partner network' — nhà hàng / spa / tour operator gửi commission khi concierge gợi ý. Đề nghị nhà hàng partner trước, nhưng phải GỢI ÝTHẬT — khách kiểm tra trên Yelp. Recommend bad food = mất uy tín.",
    tip_advice_vi:
      "Concierge tip $5–20 cho special service (book reservation khó, sự kiện sold-out). Khách Mỹ tip cuối stay, một số tip ngay. Khách Á đôi khi quên — không nhắc. Service chuyên nghiệp = tip tự đến.",
  },
  {
    id: "hospitality_concierge_transportation",
    category: "concierge",
    title_vi: "Phương tiện đi lại",
    title_en: "Transportation",
    sentences: [
      { en: "Uber is fastest — about ten dollars to downtown.", vi: "Uber nhanh nhất — khoảng 10 đô tới trung tâm.", pronunciation_focus: ["Uber", "downtown"] },
      { en: "We have a hotel shuttle, runs every twenty minutes.", vi: "Tiệm có xe đưa, 20 phút/chuyến.", pronunciation_focus: ["shuttle", "twenty"] },
      { en: "Light rail station is at the corner.", vi: "Trạm tàu điện ở góc đường.", pronunciation_focus: ["light rail", "corner"] },
      { en: "Let me grab you a map.", vi: "Em lấy bản đồ cho quý khách.", pronunciation_focus: ["grab", "map"] },
    ],
    cultural_notes_vi:
      "Uber/Lyft là chuẩn US 2026 — taxi gần như mất ở thành phố lớn. Khách quốc tế đôi khi không có US phone number cho Uber app — đề nghị desk gọi Uber thay. Hotel shuttle thường free trong 5-mile radius, tip driver $2–5.",
    tip_advice_vi:
      "Học routes phổ biến: airport, downtown, mall, sự kiện sport. Khách hỏi nhanh — đáp nhanh. KHÔNG đoán giá Uber — peak hour gấp đôi. App của khách hiện giá thực tế.",
  },
  {
    id: "hospitality_concierge_attractions",
    category: "concierge",
    title_vi: "Điểm tham quan",
    title_en: "Local attractions",
    sentences: [
      { en: "Have you been to the museum yet?", vi: "Quý khách đã đi bảo tàng chưa?", pronunciation_focus: ["museum", "yet"] },
      { en: "Free admission on Sundays — my favorite tip.", vi: "Vé miễn phí chủ nhật — mẹo em thích.", pronunciation_focus: ["admission", "Sundays"] },
      { en: "If you have kids, the aquarium is half off after three.", vi: "Có trẻ con thì thuỷ cung giảm nửa giá sau 3 giờ.", pronunciation_focus: ["aquarium", "half"] },
      { en: "Want me to print directions?", vi: "Em in chỉ đường nhé?", pronunciation_focus: ["print", "directions"] },
    ],
    cultural_notes_vi:
      "Khách đến vacation thường lưỡng lự — gợi ý cụ thể với 'insider tip' (free admission day, half-off after 3) làm họ cảm thấy được chăm sóc. Học mùa attractions: aquarium đông cuối tuần, museum vắng sáng thứ Ba, etc.",
    tip_advice_vi:
      "Thẻ giảm giá in sẵn ở quầy concierge — đưa cho khách ($5–20 off attractions). Tiệm partnership = win-win. Khách dùng = vui = review tốt = repeat business cho tiệm.",
  },
  {
    id: "hospitality_concierge_special_request",
    category: "concierge",
    title_vi: "Yêu cầu đặc biệt",
    title_en: "Special request",
    sentences: [
      { en: "Anniversary tonight? Let me see what I can arrange.", vi: "Kỷ niệm tối nay ạ? Để em xem em sắp xếp được gì.", pronunciation_focus: ["anniversary", "arrange"] },
      { en: "Champagne and chocolate-covered strawberries — sixty-five.", vi: "Champagne và dâu phủ socola — 65 đô.", pronunciation_focus: ["Champagne", "strawberries"] },
      { en: "Or I can call a flower shop.", vi: "Hoặc em gọi cửa hàng hoa.", pronunciation_focus: ["flower", "shop"] },
      { en: "Want me to set up dinner reservations too?", vi: "Em đặt bàn ăn tối luôn nhé?", pronunciation_focus: ["dinner", "reservations"] },
    ],
    cultural_notes_vi:
      "Anniversary, birthday, proposal — đây là khoảnh khắc khách nhớ MÃI MÃI. Concierge xuất sắc = khách quay lại 10 năm. Champagne package thường có biên 80% — bán dễ + lợi nhuận cao + memorable.",
    tip_advice_vi:
      "Cho khách 'options at price points' — $25 / $65 / $150. Khách chọn theo budget. KHÔNG đoán họ 'rẻ' — khách sang đôi khi chọn $25; khách bình dân đôi khi chọn $150. Tôn trọng = không phán xét.",
  },
  {
    id: "hospitality_concierge_lost_item",
    category: "concierge",
    title_vi: "Đồ thất lạc",
    title_en: "Lost item",
    sentences: [
      { en: "Let me check with housekeeping right away.", vi: "Em hỏi housekeeping ngay.", pronunciation_focus: ["check", "right"] },
      { en: "Can you describe it for me?", vi: "Quý khách mô tả giúp ạ?", pronunciation_focus: ["describe"] },
      { en: "What room were you in?", vi: "Quý khách ở phòng nào?", pronunciation_focus: ["what", "room"] },
      { en: "I'll call you back within an hour.", vi: "Em gọi lại trong vòng một tiếng.", pronunciation_focus: ["call back", "hour"] },
    ],
    cultural_notes_vi:
      "Lost & Found là vấn đề pháp lý — mỗi tiệm có log + retention period (thường 90 ngày). Đồ giá trị (jewelry, electronics, passport) → security ngay. Quần áo → housekeeping. Khách kiện tiệm vì 'lost item' = phổ biến — document mọi thứ.",
    tip_advice_vi:
      "Cam kết callback trong 1 tiếng — và GIỮ lời. Khách Mỹ không kỳ vọng tìm thấy ngay; họ kỳ vọng được callback. Không tìm thấy = call lại nói 'still looking, will check the truck'. Imitate effort, không bỏ qua.",
  },
];

// ── 3. Housekeeping interactions (5) ────────────────────────────────────

const HOUSEKEEPING: HospitalityLesson[] = [
  {
    id: "hospitality_housekeeping_dnd",
    category: "housekeeping",
    title_vi: "Biển 'Do Not Disturb'",
    title_en: "Do Not Disturb sign",
    sentences: [
      { en: "I see the do-not-disturb sign — I'll come back later.", vi: "Em thấy biển không quấy rầy — em quay lại sau.", pronunciation_focus: ["disturb", "later"] },
      { en: "Sorry to bother you.", vi: "Em xin lỗi đã làm phiền.", pronunciation_focus: ["sorry", "bother"] },
      { en: "Knock-knock — housekeeping.", vi: "Cốc cốc — housekeeping ạ.", pronunciation_focus: ["knock"] },
      { en: "When would be a better time for service?", vi: "Khi nào quý khách tiện cho em dọn?", pronunciation_focus: ["better", "time"] },
    ],
    cultural_notes_vi:
      "DND sign là quy tắc cứng — KHÔNG bao giờ vào, ngay cả 'just a quick check'. Vi phạm = khách kiện = mất việc. Chính sách brand: nếu DND quá 24h, security check (welfare check) — không phải housekeeping vào.",
    tip_advice_vi:
      "Knock-knock-pause-knock-knock = chuẩn US. Đừng knock liên tục. Đợi 10 giây trước khi knock lần 2. Khách đang shower / nap — họ cần thời gian. Vào không báo = trauma cho khách + lawsuit cho tiệm.",
  },
  {
    id: "hospitality_housekeeping_in_room",
    category: "housekeeping",
    title_vi: "Khách trong phòng",
    title_en: "Guest is in the room",
    sentences: [
      { en: "Sorry, I can come back — when works for you?", vi: "Em xin lỗi, em quay lại sau — quý khách tiện khi nào?", pronunciation_focus: ["come back", "works"] },
      { en: "Just towels, or full service?", vi: "Chỉ khăn hay dọn đầy đủ ạ?", pronunciation_focus: ["towels", "service"] },
      { en: "I'll be quick — just changing the linens.", vi: "Em làm nhanh — chỉ thay ga.", pronunciation_focus: ["quick", "linens"] },
      { en: "Anything else you need while I'm here?", vi: "Cần gì khác trong lúc em ở đây không ạ?", pronunciation_focus: ["else", "here"] },
    ],
    cultural_notes_vi:
      "Khách trong phòng là tình huống khó — nhiều khách Mỹ thoải mái, một số ngại. Hỏi 'when works for you?' tôn trọng schedule khách. KHÔNG vào phòng tắm khi khách trong phòng. Đừng làm ầm — vacuum / TV của khách vẫn hoạt động.",
    tip_advice_vi:
      "Hỏi 'just towels or full service?' tiết kiệm thời gian + tip cao. Một số khách chỉ cần towels = 5 phút thay vì 30 phút. Họ tip cao hơn vì respect time. Hệ thống PMS có 'guest preferences' — note xuống cho lần sau.",
  },
  {
    id: "hospitality_housekeeping_damage",
    category: "housekeeping",
    title_vi: "Báo cáo hư hại",
    title_en: "Reporting damage",
    sentences: [
      { en: "I noticed a stain on the carpet — I'm reporting it to maintenance.", vi: "Em thấy vết bẩn trên thảm — em báo bảo trì.", pronunciation_focus: ["stain", "maintenance"] },
      { en: "Not your fault — these things happen.", vi: "Không phải lỗi quý khách — chuyện này hay xảy ra.", pronunciation_focus: ["fault", "happen"] },
      { en: "I'll let the front desk know.", vi: "Em báo lễ tân.", pronunciation_focus: ["front", "desk"] },
      { en: "Anything else needs attention?", vi: "Còn gì cần chú ý không ạ?", pronunciation_focus: ["else", "attention"] },
    ],
    cultural_notes_vi:
      "Document mọi damage — TV broken, stain, missing item — VÀO HỆ THỐNG PMS với photo. Nếu khách gây ra, không tính tiền tại chỗ — front desk xử lý sau. Báo cáo trung thực bảo vệ bạn nếu khách kiện 'I didn't do that'.",
    tip_advice_vi:
      "Câu 'not your fault — these things happen' giảm khách lo lắng. Khách lo bị tính tiền sẽ giấu damage = vấn đề lớn hơn lúc dọn sau. Hợp tác = tiệm hài lòng. Bullshit phán xét = mất khách trung thành.",
  },
  {
    id: "hospitality_housekeeping_request",
    category: "housekeeping",
    title_vi: "Khách yêu cầu thêm đồ",
    title_en: "Guest requests extra items",
    sentences: [
      { en: "Extra pillows? I'll bring two right up.", vi: "Thêm gối ạ? Em đem 2 cái lên ngay.", pronunciation_focus: ["pillows", "right up"] },
      { en: "Anything else — towels, blankets?", vi: "Còn gì khác — khăn, chăn?", pronunciation_focus: ["else", "towels"] },
      { en: "I'll be back in five minutes.", vi: "Em quay lại sau 5 phút.", pronunciation_focus: ["five", "minutes"] },
      { en: "Just leave the door open or I'll knock.", vi: "Cứ mở cửa hoặc em gõ cửa.", pronunciation_focus: ["door", "knock"] },
    ],
    cultural_notes_vi:
      "Extra requests (pillow, towel, hair dryer) = tip cao. Khách Mỹ tip $2–5 housekeeping cho special request. Tốc độ đáp ứng quan trọng — '5 phút' phải là 5 phút thật, không 15 phút. Khách kiểm chứng.",
    tip_advice_vi:
      "Đem MORE THAN khách yêu cầu — yêu cầu 1 gối, đem 2. Yêu cầu khăn, đem khăn + soap. Câu 'anything else?' chốt được tip. Người Mỹ đánh giá rất cao 'going the extra mile' — đó là USP của hospitality.",
  },
  {
    id: "hospitality_housekeeping_lost_found",
    category: "housekeeping",
    title_vi: "Trả lại đồ thất lạc",
    title_en: "Returning a lost item",
    sentences: [
      { en: "I found this in your room when I was cleaning.", vi: "Em tìm thấy cái này trong phòng khi dọn.", pronunciation_focus: ["found", "cleaning"] },
      { en: "Wanted to make sure you got it before you left.", vi: "Muốn chắc chắn quý khách nhận trước khi rời.", pronunciation_focus: ["sure", "left"] },
      { en: "Front desk has it logged in lost and found.", vi: "Lễ tân đã ghi vào lost and found.", pronunciation_focus: ["logged", "found"] },
      { en: "Have a great day.", vi: "Chúc quý khách ngày tốt.", pronunciation_focus: ["great", "day"] },
    ],
    cultural_notes_vi:
      "Trả lại đồ thất lạc TẠI CHỖ thay vì tự giữ = chuẩn vàng + bảo vệ pháp lý. Document mọi thứ — đồ giá trị > $50, security log. Trustworthy housekeeping = tiệm thuê lâu dài + tip cao + reference tốt khi đổi việc.",
    tip_advice_vi:
      "Khi tìm thấy đồ giá trị (jewelry, cash > $20), KHÔNG động vào — báo supervisor + chụp ảnh. Hai người chứng kiến trước khi đem xuống lost & found. Văn hoá tiệm 'tin tưởng' bắt đầu từ những lần này.",
  },
];

// ── 4. Complaint handling (10) ──────────────────────────────────────────

const COMPLAINT: HospitalityLesson[] = [
  {
    id: "hospitality_complaint_noise",
    category: "complaint_handling",
    title_vi: "Phòng ồn",
    title_en: "Noise complaint",
    sentences: [
      { en: "I'm so sorry — let me call security to handle that.", vi: "Em xin lỗi — em gọi an ninh xử lý ngay.", pronunciation_focus: ["sorry", "security"] },
      { en: "Would you like to move to a different room?", vi: "Quý khách muốn đổi phòng khác không?", pronunciation_focus: ["move", "different"] },
      { en: "I'll have a quiet floor available in twenty minutes.", vi: "Em có phòng tầng yên sau 20 phút.", pronunciation_focus: ["quiet", "twenty"] },
      { en: "I'll send up some compensation for the trouble.", vi: "Em gửi compensation lên phòng vì làm phiền.", pronunciation_focus: ["compensation", "trouble"] },
    ],
    cultural_notes_vi:
      "Tiếng ồn (party, TV ầm, hành lang) là phàn nàn #1 ở khách sạn. Empathy → action → compensation = công thức chuẩn. KHÔNG đứng về phía khách ồn. KHÔNG yêu cầu khách phàn nàn 'làm chứng'. Security xử lý — đó là vai trò của họ.",
    tip_advice_vi:
      "Compensation tiêu chuẩn: $20–50 credit, free breakfast, đôi khi free night. Front desk có quyền $50; manager $200; GM unlimited. Đừng hứa quá quyền — 'let me check with manager' là phép lịch sự.",
  },
  {
    id: "hospitality_complaint_room_dirty",
    category: "complaint_handling",
    title_vi: "Phòng chưa dọn sạch",
    title_en: "Room not properly cleaned",
    sentences: [
      { en: "That's totally unacceptable — let me get someone up there now.", vi: "Hoàn toàn không chấp nhận được — em cử người lên ngay.", pronunciation_focus: ["unacceptable", "someone"] },
      { en: "Or would you prefer a different room?", vi: "Hoặc quý khách muốn đổi phòng khác?", pronunciation_focus: ["prefer", "different"] },
      { en: "I'm so sorry this happened.", vi: "Em xin lỗi chuyện này xảy ra.", pronunciation_focus: ["sorry", "happened"] },
      { en: "I'll comp tonight's stay.", vi: "Em comp đêm nay.", pronunciation_focus: ["comp", "stay"] },
    ],
    cultural_notes_vi:
      "Phòng dirty = lỗi nghiêm trọng. Đổi phòng + comp đêm là chuẩn. KHÔNG bao biện 'busy weekend' — khách trả tiền cho phòng sạch, không cho excuses. Document để follow up với housekeeping team — không trừng phạt cá nhân, học hệ thống.",
    tip_advice_vi:
      "'Comp tonight' = mất doanh thu một đêm. Đổi lại = giữ khách trung thành = stay tương lai. Khách review bad cleaning trên TripAdvisor = mất 100 lần stay potential. Comp đúng = bảo vệ revenue dài hạn.",
  },
  {
    id: "hospitality_complaint_billing",
    category: "complaint_handling",
    title_vi: "Phàn nàn về hoá đơn",
    title_en: "Billing complaint",
    sentences: [
      { en: "Let me look at this with you — show me which charge.", vi: "Em xem cùng quý khách — chỉ em phụ phí nào.", pronunciation_focus: ["look", "charge"] },
      { en: "You're right — that shouldn't have been billed.", vi: "Quý khách đúng — không nên tính phí này.", pronunciation_focus: ["right", "billed"] },
      { en: "I'm crediting that back right now.", vi: "Em hoàn lại ngay.", pronunciation_focus: ["crediting", "back"] },
      { en: "You'll see it on your statement in three to five days.", vi: "Quý khách thấy trên statement sau 3-5 ngày.", pronunciation_focus: ["statement", "five"] },
    ],
    cultural_notes_vi:
      "Billing dispute = giữ bình tĩnh + xem xét cùng. KHÔNG cãi bệnh nhân. 'You're right' là từ ma thuật — credit lại ngay. Bank credit-back cần 3–5 business days, không phải instant. Báo timeframe rõ tránh lo lắng.",
    tip_advice_vi:
      "Front desk thường có thẩm quyền credit < $100 trực tiếp. Lớn hơn → manager. Document EVERY credit — manager check sổ cuối ca. Credit 'âm thầm' không document = bị nghi ngờ + có thể mất việc.",
  },
  {
    id: "hospitality_complaint_amenity_broken",
    category: "complaint_handling",
    title_vi: "Tiện nghi hỏng",
    title_en: "Broken amenity",
    sentences: [
      { en: "Sorry the AC isn't working — maintenance is on the way.", vi: "Xin lỗi máy lạnh không chạy — bảo trì đang lên.", pronunciation_focus: ["AC", "maintenance"] },
      { en: "If they can't fix it tonight, I'll move you.", vi: "Nếu không sửa được tối nay, em đổi phòng.", pronunciation_focus: ["fix", "move"] },
      { en: "Anything I can bring up while you wait?", vi: "Em đem gì lên trong lúc đợi không ạ?", pronunciation_focus: ["bring", "wait"] },
      { en: "I'll add a credit for the inconvenience.", vi: "Em thêm credit vì bất tiện.", pronunciation_focus: ["credit", "inconvenience"] },
    ],
    cultural_notes_vi:
      "Amenity hỏng (AC, TV, shower, refrigerator) = phải fix trong 30 phút HOẶC đổi phòng. Nhiệt độ cao + AC hỏng = nguy cơ y tế cho khách lớn tuổi. Không đợi đến sáng. Đem fan / nước đá trong lúc chờ.",
    tip_advice_vi:
      "Đem solution thay vì excuse: 'AC broken + here's a fan + I'll move you in 30 min if not fixed'. Khách sẵn sàng đợi nếu thấy bạn đang làm gì đó. Đợi mơ hồ = khách viết 1 sao Yelp.",
  },
  {
    id: "hospitality_complaint_service_failure",
    category: "complaint_handling",
    title_vi: "Lỗi dịch vụ",
    title_en: "Service failure",
    sentences: [
      { en: "I dropped the ball on that — I'm sorry.", vi: "Em làm sai — em xin lỗi.", pronunciation_focus: ["dropped", "ball"] },
      { en: "Let me make it right.", vi: "Để em sửa lại.", pronunciation_focus: ["make", "right"] },
      { en: "What would feel fair to you?", vi: "Quý khách thấy gì là công bằng?", pronunciation_focus: ["fair", "you"] },
      { en: "I'll personally make sure it doesn't happen again.", vi: "Em sẽ tự mình đảm bảo không lặp lại.", pronunciation_focus: ["personally", "again"] },
    ],
    cultural_notes_vi:
      "Tự nhận lỗi = chuyên nghiệp ở US, không phải yếu kém. 'I dropped the ball' là idiom được tôn trọng. Khách thường xin nhỏ hơn bạn nghĩ — hỏi 'what would feel fair' tốt hơn đoán. Đừng over-comp khi không cần.",
    tip_advice_vi:
      "Lỗi mình + xin lỗi chân thành + sửa = tip cao + khách quay lại. Lỗi mình + bao biện = khách kể trên review + mất 50 future stays. Nuốt ego, sửa nhanh, học bài.",
  },
  {
    id: "hospitality_complaint_escalate",
    category: "complaint_handling",
    title_vi: "Chuyển lên quản lý",
    title_en: "Escalating to a manager",
    sentences: [
      { en: "Let me get my manager — she'll have more options.", vi: "Để em gọi quản lý — có nhiều phương án hơn.", pronunciation_focus: ["manager", "options"] },
      { en: "Her name is Sarah, she'll be right with you.", vi: "Tên cô Sarah, sẽ ra ngay.", pronunciation_focus: ["right", "with"] },
      { en: "I'm sorry I couldn't fix this myself.", vi: "Em xin lỗi không tự xử lý được.", pronunciation_focus: ["fix", "myself"] },
      { en: "Want some water while you wait?", vi: "Quý khách uống nước trong lúc đợi nhé?", pronunciation_focus: ["water", "wait"] },
    ],
    cultural_notes_vi:
      "Escalation là OK — manager có thẩm quyền lớn hơn. KHÔNG xấu hổ khi gọi manager. Khách Mỹ tôn trọng nhân viên biết giới hạn của mình. Báo trước tên manager + 'right with you' giảm anxiety.",
    tip_advice_vi:
      "Khi escalate, BRIEF manager trước — đừng để họ bị 'cold' khi gặp khách. 'Mr. X is upset because room AC broken twice this week, asking for refund' giúp manager vào cuộc nhanh + đúng. Tip-tier manager support.",
  },
  {
    id: "hospitality_complaint_third_party",
    category: "complaint_handling",
    title_vi: "Đặt phòng qua bên thứ ba",
    title_en: "Third-party booking complaint",
    sentences: [
      { en: "Since you booked through Expedia, the refund goes through them.", vi: "Vì đặt qua Expedia, refund qua Expedia.", pronunciation_focus: ["booked", "Expedia"] },
      { en: "I can document our side and they'll process it faster.", vi: "Em document phía tiệm để họ xử lý nhanh hơn.", pronunciation_focus: ["document", "faster"] },
      { en: "Their phone number is on the booking confirmation.", vi: "Số họ trên xác nhận đặt phòng.", pronunciation_focus: ["phone", "confirmation"] },
      { en: "I'm sorry it has to go that route.", vi: "Em xin lỗi phải đi đường vòng.", pronunciation_focus: ["sorry", "route"] },
    ],
    cultural_notes_vi:
      "OTA bookings (Expedia, Booking.com, Hotels.com) = refund qua OTA, KHÔNG qua tiệm. Đó là quy tắc hợp đồng — vi phạm = tiệm bị OTA penalty. Giải thích NHẸ NHÀNG, không phán xét khách 'should have booked direct'.",
    tip_advice_vi:
      "Khách book OTA giận tiệm vì refund chậm — đó không phải lỗi tiệm. Document từ phía tiệm + đưa số OTA = giúp khách. Một số tiệm 'best rate guarantee' — chuyển khách book direct lần sau.",
  },
  {
    id: "hospitality_complaint_loyalty_status",
    category: "complaint_handling",
    title_vi: "Khách loyalty không được upgrade",
    title_en: "Loyalty member not upgraded",
    sentences: [
      { en: "I see your Platinum status — let me see what we have.", vi: "Em thấy status Platinum — để em xem.", pronunciation_focus: ["Platinum", "status"] },
      { en: "We're sold out tonight, but I can offer breakfast and a credit.", vi: "Tối nay full, nhưng em tặng bữa sáng + credit.", pronunciation_focus: ["sold", "credit"] },
      { en: "Tomorrow, I'll move you to a suite.", vi: "Mai em chuyển sang suite.", pronunciation_focus: ["tomorrow", "suite"] },
      { en: "Sorry I can't do better tonight.", vi: "Em xin lỗi tối nay không hơn được.", pronunciation_focus: ["sorry", "better"] },
    ],
    cultural_notes_vi:
      "Loyalty members rất nhạy cảm về 'broken promise'. Brand hứa upgrade subject to availability — không phải guaranteed. Giải thích RÕ + offer alternative = giảm bực bội. KHÔNG nói 'sold out' không kèm giải pháp.",
    tip_advice_vi:
      "Brand chuẩn cho 'no upgrade': bonus points + breakfast + credit. Tổng giá trị $30–50, mất ít nhưng giữ loyalty. Khách hủy status = mất $5,000–10,000 lifetime value. Toán dễ.",
  },
  {
    id: "hospitality_complaint_pet",
    category: "complaint_handling",
    title_vi: "Khiếu nại về thú cưng",
    title_en: "Pet-related complaint",
    sentences: [
      { en: "I understand — let me look into the situation.", vi: "Em hiểu — để em xem xét.", pronunciation_focus: ["understand", "situation"] },
      { en: "Was it noise, smell, or something specific?", vi: "Là tiếng ồn, mùi, hay vấn đề cụ thể nào?", pronunciation_focus: ["noise", "specific"] },
      { en: "Service animals are allowed by law.", vi: "Service animal được pháp luật cho phép.", pronunciation_focus: ["service", "law"] },
      { en: "But I can move you further away if you'd like.", vi: "Nhưng em chuyển quý khách xa hơn nếu muốn.", pronunciation_focus: ["further", "away"] },
    ],
    cultural_notes_vi:
      "Service animals (chó dẫn đường, hỗ trợ tâm lý) được PHÁP LUẬT bảo vệ ở Mỹ (ADA). KHÔNG yêu cầu chứng chỉ. Khách phàn nàn về service animal = chỉ có thể đổi phòng cho người phàn nàn, KHÔNG đuổi khách có service animal. Vi phạm = lawsuit.",
    tip_advice_vi:
      "Phân biệt service animal vs pet vs emotional support animal — quy tắc khác nhau. ADA chỉ áp dụng service animal. Pet thường tính fee. ESA mỗi tiệm tự policy. Học rõ — mơ hồ = trouble pháp lý.",
  },
  {
    id: "hospitality_complaint_review_threat",
    category: "complaint_handling",
    title_vi: "Khách đe doạ viết review",
    title_en: "Guest threatens a bad review",
    sentences: [
      { en: "I take that seriously — let's see if we can fix this.", vi: "Em xem nghiêm túc — mình thử sửa.", pronunciation_focus: ["seriously", "fix"] },
      { en: "What would make this right for you?", vi: "Gì sẽ làm quý khách thấy ổn?", pronunciation_focus: ["right", "you"] },
      { en: "I want you to leave happy.", vi: "Em muốn quý khách rời tiệm vui.", pronunciation_focus: ["leave", "happy"] },
      { en: "Let me get the manager so we can do more.", vi: "Em gọi quản lý để làm thêm được.", pronunciation_focus: ["manager", "more"] },
    ],
    cultural_notes_vi:
      "Đe doạ review xấu = leverage tactic, đôi khi hiệu quả. KHÔNG nhượng bộ vô lý — khách lạm dụng. NHƯNG cũng không cãi 'go ahead, leave the review'. Đề nghị manager — họ có thẩm quyền + thấy được toàn cảnh.",
    tip_advice_vi:
      "Câu 'I take that seriously' đặt bạn ngang hàng với khách — không van xin, không từ chối. Khách thật sự bực sẽ nhận solution. Khách lạm dụng sẽ tiếp tục threaten — đó là dấu hiệu manager phải vào cuộc.",
  },
];

// ── 5. Banquet / event service (5) ──────────────────────────────────────

const BANQUET: HospitalityLesson[] = [
  {
    id: "hospitality_banquet_setup",
    category: "banquet_event",
    title_vi: "Setup phòng tiệc",
    title_en: "Setting up the banquet room",
    sentences: [
      { en: "Setup is on track for the six o'clock event.", vi: "Setup đúng tiến độ cho sự kiện 6 giờ.", pronunciation_focus: ["setup", "track"] },
      { en: "Twelve rounds of eight, head table for ten.", vi: "12 bàn tròn 8 người, bàn chính 10 người.", pronunciation_focus: ["rounds", "head"] },
      { en: "AV is tested — mic, projector, screen.", vi: "AV đã test — mic, projector, màn hình.", pronunciation_focus: ["AV", "tested"] },
      { en: "Linens delivered — ivory and gold per the BEO.", vi: "Linens giao rồi — ngà và vàng theo BEO.", pronunciation_focus: ["ivory", "BEO"] },
    ],
    cultural_notes_vi:
      "BEO (Banquet Event Order) là 'kinh thánh' của phục vụ tiệc — mọi chi tiết. Sai BEO = client khiếu nại + mất doanh thu. 'Rounds of 8' = bàn tròn 8 người (chuẩn). Head table thường 10. Kiểm tra setup 1 giờ TRƯỚC giờ event để có thời gian sửa.",
    tip_advice_vi:
      "Đọc BEO 3 lần: ngày trước, sáng cùng ngày, 2 giờ trước event. Bridezilla / corporate planner sẽ kiểm tra mỗi chi tiết — sai 1 = mất tip + mất referral. Document mọi thay đổi cuối phút bằng email.",
  },
  {
    id: "hospitality_banquet_dietary",
    category: "banquet_event",
    title_vi: "Yêu cầu ăn kiêng",
    title_en: "Dietary requirements",
    sentences: [
      { en: "We have three vegetarian, two gluten-free, one nut allergy.", vi: "Có 3 chay, 2 không gluten, 1 dị ứng đậu phộng.", pronunciation_focus: ["vegetarian", "allergy"] },
      { en: "Allergy meals come out first, on a separate tray.", vi: "Bữa dị ứng ra trước, khay riêng.", pronunciation_focus: ["allergy", "separate"] },
      { en: "Servers know which guest gets which.", vi: "Server biết khách nào ăn món nào.", pronunciation_focus: ["servers", "which"] },
      { en: "Gluten-free is at table six, seat three.", vi: "Không gluten tại bàn 6, ghế 3.", pronunciation_focus: ["gluten-free", "table"] },
    ],
    cultural_notes_vi:
      "Allergy = pháp lý nghiêm trọng. Mix thức ăn dị ứng với thường = hospitalization + lawsuit. Tray riêng + server biết ghế = chuẩn US. Bridge / event planner chịu trách nhiệm cập nhật allergy info — nhưng tiệm verify trước event.",
    tip_advice_vi:
      "Học seat numbers thuộc lòng cho allergy guests. Tag plate physically (different garnish) — visual cue tránh sai. Briefing servers 30 phút trước event — không bỏ qua bước này.",
  },
  {
    id: "hospitality_banquet_timeline",
    category: "banquet_event",
    title_vi: "Thông báo timeline",
    title_en: "Communicating the timeline",
    sentences: [
      { en: "Cocktail hour ends in fifteen minutes.", vi: "Cocktail hour còn 15 phút.", pronunciation_focus: ["cocktail", "fifteen"] },
      { en: "First course goes out at six-thirty.", vi: "Món đầu lúc 6 giờ 30.", pronunciation_focus: ["first", "thirty"] },
      { en: "Toasts after the entrée, around eight.", vi: "Toast sau món chính, khoảng 8 giờ.", pronunciation_focus: ["toasts", "eight"] },
      { en: "Cake cutting at nine, dancing after.", vi: "Cắt bánh 9 giờ, nhảy sau đó.", pronunciation_focus: ["cake", "cutting"] },
    ],
    cultural_notes_vi:
      "Banquet timeline = tướng quân điều quân. Late 5 phút = domino effect. Communicate updates to bartenders, kitchen, DJ liên tục. Một số phần linh hoạt (toasts), một số rigid (kitchen plating). Học sự khác biệt.",
    tip_advice_vi:
      "Headset communication is gold ở banquet lớn. Server captain dùng headset radio liên tục với kitchen. Walkie-talkie tốt hơn smartphone — không sợ pin hết. Tips for headset: brief, clear, professional voice — không gossip.",
  },
  {
    id: "hospitality_banquet_problem",
    category: "banquet_event",
    title_vi: "Sự cố tại tiệc",
    title_en: "Resolving an event problem",
    sentences: [
      { en: "The DJ's late — we have music from the speakers for backup.", vi: "DJ trễ — em có nhạc từ loa backup.", pronunciation_focus: ["DJ", "backup"] },
      { en: "Don't worry, the timeline's still on.", vi: "Đừng lo, timeline vẫn đúng.", pronunciation_focus: ["worry", "timeline"] },
      { en: "I'm calling the manager so we have backup support.", vi: "Em gọi quản lý có thêm hỗ trợ.", pronunciation_focus: ["calling", "support"] },
      { en: "Whatever happens, I'm on it.", vi: "Có gì em xử lý.", pronunciation_focus: ["whatever", "on it"] },
    ],
    cultural_notes_vi:
      "Sự cố ở banquet = nervous bride/groom. Câu 'I'm on it' (em đang xử lý) trấn an — chuyên nghiệp tiền tỉ. KHÔNG hứa 'everything will be perfect' — không thể. Hứa 'I'll handle it' — đúng quyền + xác định trách nhiệm.",
    tip_advice_vi:
      "Backup plan cho mọi crisis: DJ late = aux speakers, cake delivery missing = dessert plates from kitchen, bartender sick = manager covers bar. Documented backup plans là dấu hiệu banquet team chuyên nghiệp.",
  },
  {
    id: "hospitality_banquet_post_event",
    category: "banquet_event",
    title_vi: "Sau sự kiện",
    title_en: "Post-event wrap",
    sentences: [
      { en: "Thanks so much — that was a beautiful event.", vi: "Cảm ơn nhiều — sự kiện đẹp lắm.", pronunciation_focus: ["beautiful", "event"] },
      { en: "We'll send the final invoice tomorrow.", vi: "Mai em gửi hoá đơn cuối.", pronunciation_focus: ["final", "invoice"] },
      { en: "Anything left behind, we'll hold for a week.", vi: "Đồ bỏ quên em giữ 1 tuần.", pronunciation_focus: ["behind", "week"] },
      { en: "We'd love to host your next one.", vi: "Mong được host sự kiện tiếp theo.", pronunciation_focus: ["love", "next"] },
    ],
    cultural_notes_vi:
      "Sau event chuyên nghiệp = referrals. Bride/groom hài lòng kể bạn bè 5–10 năm. Câu 'we'd love to host your next' là soft pitch cho repeat business — birthday, baby shower, anniversary. Banquet tiền lớn, repeat tiền lớn hơn.",
    tip_advice_vi:
      "Send 'thank you note' viết tay 1–2 ngày sau event = ấn tượng vĩnh viễn. Chi phí 50¢ (cards + stamp), giá trị $5,000+ referrals. Đa số tiệm bỏ qua step này — cạnh tranh dễ.",
  },
];

// ── 6. Phone etiquette (5) ──────────────────────────────────────────────

const PHONE: HospitalityLesson[] = [
  {
    id: "hospitality_phone_answer",
    category: "phone_etiquette",
    title_vi: "Trả lời điện thoại",
    title_en: "Answering the phone",
    sentences: [
      { en: "Good evening, Marriott Downtown — this is Linh, how may I help?", vi: "Chào buổi tối, Marriott Downtown — em Linh, em giúp gì ạ?", pronunciation_focus: ["evening", "Marriott"] },
      { en: "How can I direct your call?", vi: "Em chuyển cuộc gọi đến đâu ạ?", pronunciation_focus: ["direct", "call"] },
      { en: "May I have your name?", vi: "Cho em xin tên ạ?", pronunciation_focus: ["may", "name"] },
      { en: "One moment please.", vi: "Một lát ạ.", pronunciation_focus: ["one", "moment"] },
    ],
    cultural_notes_vi:
      "Brand script chuẩn: 'Greeting + brand name + your name + offer to help'. KHÔNG nói 'hello' chung chung — nghe thiếu chuyên nghiệp. Nói rõ tên brand + tên cá nhân. Khách Mỹ đánh giá brand voice từ giây đầu.",
    tip_advice_vi:
      "Smile khi nói điện thoại — khách nghe được qua giọng. Kiểm tra brand standard mỗi shift — quy định đôi khi đổi (corporate update). Sai script = supervisor cảnh báo + có thể bị khách hàng feedback.",
  },
  {
    id: "hospitality_phone_reservation",
    category: "phone_etiquette",
    title_vi: "Đặt phòng qua điện thoại",
    title_en: "Phone reservation",
    sentences: [
      { en: "Of course — what dates were you thinking?", vi: "Tất nhiên — quý khách dự tính ngày nào?", pronunciation_focus: ["dates", "thinking"] },
      { en: "Let me check availability.", vi: "Để em kiểm tra phòng.", pronunciation_focus: ["check", "availability"] },
      { en: "We have rooms from two-eighty per night.", vi: "Phòng từ 280 mỗi đêm.", pronunciation_focus: ["two-eighty", "night"] },
      { en: "I'll send confirmation to your email.", vi: "Em gửi xác nhận qua email.", pronunciation_focus: ["confirmation", "email"] },
    ],
    cultural_notes_vi:
      "Phone reservations = revenue đường ngắn. Khách gọi trực tiếp = không qua OTA = lợi nhuận cao. Đề nghị 'best available rate' + 'direct booking benefits' (free Wi-Fi, free breakfast, late checkout). Khách book direct trung thành hơn.",
    tip_advice_vi:
      "Note phone calls vào reservation — phone reservation thường có 'hold' đặc biệt (no credit card needed). Nếu khách không show, gọi confirm 24h trước. Phone-only deals = công cụ retention mạnh.",
  },
  {
    id: "hospitality_phone_transfer",
    category: "phone_etiquette",
    title_vi: "Chuyển cuộc gọi",
    title_en: "Transferring a call",
    sentences: [
      { en: "Let me transfer you to housekeeping — one moment.", vi: "Em chuyển sang housekeeping — một lát ạ.", pronunciation_focus: ["transfer", "housekeeping"] },
      { en: "If we get disconnected, dial extension six-five-four.", vi: "Mất kết nối, quay số 654.", pronunciation_focus: ["disconnected", "extension"] },
      { en: "I'll let them know you're calling.", vi: "Em báo họ quý khách đang gọi.", pronunciation_focus: ["let", "calling"] },
      { en: "Hold please.", vi: "Đợi máy ạ.", pronunciation_focus: ["hold", "please"] },
    ],
    cultural_notes_vi:
      "Transfer protocol chuẩn: brief receiving party trước, give caller name + issue. KHÔNG 'cold transfer' (chuyển không báo trước) — khách phải kể lại = bực bội. Đưa extension number cứu trường hợp mất kết nối.",
    tip_advice_vi:
      "Học extension toàn tiệm thuộc lòng — front desk = 0, housekeeping = X, restaurant = Y. Khi khách hỏi extension, đáp ngay không tra cứu. Tốc độ = chuyên nghiệp.",
  },
  {
    id: "hospitality_phone_message",
    category: "phone_etiquette",
    title_vi: "Nhận lời nhắn",
    title_en: "Taking a message",
    sentences: [
      { en: "He's not available right now — would you like to leave a message?", vi: "Ông ấy không có ở đây — quý khách để lại lời nhắn không ạ?", pronunciation_focus: ["available", "message"] },
      { en: "May I have your name and number?", vi: "Cho em xin tên và số điện thoại ạ?", pronunciation_focus: ["name", "number"] },
      { en: "Let me read that back: Sarah Johnson, 555-0142.", vi: "Em đọc lại: Sarah Johnson, 555-0142.", pronunciation_focus: ["read", "back"] },
      { en: "I'll make sure he gets it.", vi: "Em đảm bảo ông nhận.", pronunciation_focus: ["sure", "gets"] },
    ],
    cultural_notes_vi:
      "Read-back tên + số là chuẩn — 1 chữ sai = không gọi lại được. Một số khách nói nhanh — yêu cầu spell tên. 'Did you say Cindy or Sandy?' không xấu hổ — chính xác hơn.",
    tip_advice_vi:
      "Note thời gian + người gọi: 'Sarah Johnson called at 2:15pm, callback at 555-0142'. Khách Mỹ check messages thường — incomplete message = khách gọi lại complain. Tốt hơn 30 giây extra ghi đầy đủ.",
  },
  {
    id: "hospitality_phone_privacy",
    category: "phone_etiquette",
    title_vi: "Bảo vệ riêng tư khách",
    title_en: "Protecting guest privacy",
    sentences: [
      { en: "I can't confirm whether a guest is staying with us.", vi: "Em không xác nhận khách có ở tiệm hay không.", pronunciation_focus: ["confirm", "staying"] },
      { en: "If you give me their name, I can connect you to the room.", vi: "Quý khách cho tên, em chuyển đến phòng.", pronunciation_focus: ["give", "connect"] },
      { en: "Privacy policy — I'm sure you understand.", vi: "Chính sách riêng tư — quý khách hiểu ạ.", pronunciation_focus: ["privacy", "understand"] },
      { en: "Want to leave a message instead?", vi: "Quý khách để lại lời nhắn được không?", pronunciation_focus: ["leave", "message"] },
    ],
    cultural_notes_vi:
      "Privacy là PHÁP LÝ — không bao giờ xác nhận khách có ở tiệm. Stalker, ex-partners, paparazzi — họ gọi tiệm. Một câu 'yes she's here' = khách bị tấn công + tiệm bị kiện. Không có ngoại lệ — kể cả 'family' nói.",
    tip_advice_vi:
      "Quy trình chuẩn: 'I can connect you if you have the name' — KHÔNG xác nhận. PMS có 'do not disturb' / 'no calls' flag — khách trả tiền cho privacy. Vi phạm = mất việc + có thể bị kiện cá nhân.",
  },
];

// ── 7. Multi-language guest service (5) ─────────────────────────────────

const MULTI_LANG: HospitalityLesson[] = [
  {
    id: "hospitality_multi_slow_clear",
    category: "multi_language",
    title_vi: "Nói chậm và rõ",
    title_en: "Slowing down and speaking clearly",
    sentences: [
      { en: "Let me say that again, more slowly.", vi: "Em nói lại, chậm hơn.", pronunciation_focus: ["say", "slowly"] },
      { en: "Please feel free to ask me to repeat.", vi: "Quý khách cứ yêu cầu em nhắc lại.", pronunciation_focus: ["repeat"] },
      { en: "Want me to write it down?", vi: "Em ghi xuống nhé?", pronunciation_focus: ["write", "down"] },
      { en: "Take your time.", vi: "Quý khách thong thả.", pronunciation_focus: ["take", "time"] },
    ],
    cultural_notes_vi:
      "Khách quốc tế có ESL = dành thời gian thêm. Slow speech ≠ shouting — đừng to giọng. Visual aids (map, brochure, written numbers) = giúp nhiều. Translation app trên phone là OK — không 'unprofessional'.",
    tip_advice_vi:
      "Khách bối rối = không giận khách, giận sự bất tiện. Câu 'no rush, let me try again' tích cực. Patience là hospitality skill cốt lõi — khách quốc tế nhớ ơn người kiên nhẫn, ghé lại nhiều lần.",
  },
  {
    id: "hospitality_multi_translation_app",
    category: "multi_language",
    title_vi: "Dùng ứng dụng dịch",
    title_en: "Using a translation app",
    sentences: [
      { en: "Want me to use a translation app?", vi: "Em dùng app dịch nhé?", pronunciation_focus: ["translation", "app"] },
      { en: "Type or speak in your language — it's okay.", vi: "Quý khách gõ hoặc nói tiếng của mình — không sao ạ.", pronunciation_focus: ["type", "language"] },
      { en: "Google Translate — let's see.", vi: "Google Translate — để xem.", pronunciation_focus: ["Google", "see"] },
      { en: "Got it.", vi: "Em hiểu rồi.", pronunciation_focus: ["got", "it"] },
    ],
    cultural_notes_vi:
      "Google Translate / DeepL không hoàn hảo nhưng đủ cho transactions cơ bản. Khách quốc tế cảm động khi staff cố gắng. KHÔNG dùng cho legal documents (consent, contracts) — phải có interpreter chuyên nghiệp.",
    tip_advice_vi:
      "Tải app dịch xuống điện thoại trước shift — Wi-Fi sảnh đôi khi yếu. Các ngôn ngữ phổ biến: Spanish, Mandarin, Japanese, Korean, Vietnamese, German, French. Học 'hello + thank you' bằng các ngôn ngữ này = ấn tượng mạnh.",
  },
  {
    id: "hospitality_multi_interpreter",
    category: "multi_language",
    title_vi: "Yêu cầu thông dịch viên",
    title_en: "Requesting an interpreter",
    sentences: [
      { en: "Let me get someone who speaks Spanish.", vi: "Em gọi người biết tiếng Tây Ban Nha.", pronunciation_focus: ["someone", "Spanish"] },
      { en: "One moment — Maria from housekeeping speaks fluent Spanish.", vi: "Một lát — Maria housekeeping nói tiếng TBN giỏi.", pronunciation_focus: ["fluent", "Spanish"] },
      { en: "Or we can call a phone interpreter.", vi: "Hoặc gọi thông dịch qua điện thoại.", pronunciation_focus: ["phone", "interpreter"] },
      { en: "Service is free for guests.", vi: "Dịch vụ miễn phí cho khách.", pronunciation_focus: ["service", "free"] },
    ],
    cultural_notes_vi:
      "Phone interpreters (LanguageLine, Cyracom) là dịch vụ chuẩn ở US hospitality — 200+ ngôn ngữ, 24/7. Không tính khách. Chuyên nghiệp + accurate hơn staff dịch nghiệp dư. Quan trọng cho complaints, medical, legal.",
    tip_advice_vi:
      "Học cách kích hoạt phone interpreter — mỗi tiệm có code riêng. Trong khẩn cấp y tế, interpreter cứu mạng. Đừng dựa staff bilingual cho mọi thứ — họ có việc khác. Chỉ cho transactions ngắn.",
  },
  {
    id: "hospitality_multi_signage",
    category: "multi_language",
    title_vi: "Biển chỉ dẫn đa ngôn ngữ",
    title_en: "Multilingual signage",
    sentences: [
      { en: "Maps are in English, Spanish, Mandarin.", vi: "Bản đồ có tiếng Anh, TBN, Trung.", pronunciation_focus: ["maps", "Mandarin"] },
      { en: "Need one in your language?", vi: "Cần bản tiếng của quý khách không?", pronunciation_focus: ["need", "language"] },
      { en: "I'll print one out for you.", vi: "Em in cho quý khách.", pronunciation_focus: ["print", "out"] },
      { en: "Restaurant menu has pictures too.", vi: "Menu nhà hàng có hình.", pronunciation_focus: ["menu", "pictures"] },
    ],
    cultural_notes_vi:
      "Khách sạn US ngày càng đa ngôn ngữ — đặc biệt Las Vegas, Orlando, Miami. Maps + emergency info + key amenities thường có 5+ ngôn ngữ. Đề nghị chủ động = hospitality vượt mong đợi.",
    tip_advice_vi:
      "Pictures + numbers vượt rào ngôn ngữ. 'Restaurant 6th floor' + map = khách hiểu. Reroute conversation visual khi ngôn ngữ kẹt — tốt hơn cố gắng giải thích bằng broken English.",
  },
  {
    id: "hospitality_multi_apologize",
    category: "multi_language",
    title_vi: "Xin lỗi không nói được tiếng đó",
    title_en: "Apologizing for not speaking the language",
    sentences: [
      { en: "Sorry, I don't speak Korean — but I can find someone who does.", vi: "Em xin lỗi không nói tiếng Hàn — nhưng em tìm người biết.", pronunciation_focus: ["Korean", "find"] },
      { en: "Or want me to use a translator?", vi: "Hoặc em dùng translator nhé?", pronunciation_focus: ["want", "translator"] },
      { en: "Let me grab someone — one minute.", vi: "Em đi gọi người — một phút.", pronunciation_focus: ["grab", "minute"] },
      { en: "Sorry for the wait.", vi: "Em xin lỗi đã đợi.", pronunciation_focus: ["sorry", "wait"] },
    ],
    cultural_notes_vi:
      "Xin lỗi chân thành KHÔNG xấu hổ — chỉ chuyên nghiệp. Khách quốc tế hiểu — họ đã đến US, biết English-first. Câu 'I can find someone' tích cực. KHÔNG 'I'm just a clerk' — đặt vấn đề lên người khác.",
    tip_advice_vi:
      "Note staff list theo language: 'Maria-Spanish, Kim-Korean, Linh-Vietnamese'. Front desk có quick-reference card. Đừng đoán — sai nationality (thinking Chinese is Korean) gây xúc phạm. Hỏi trước.",
  },
];

// ── 8. Cultural awareness (5) ───────────────────────────────────────────

const CULTURAL: HospitalityLesson[] = [
  {
    id: "hospitality_cultural_tipping",
    category: "cultural_awareness",
    title_vi: "Chuẩn tip ở khách sạn",
    title_en: "Hospitality tipping norms",
    sentences: [
      { en: "Housekeeping appreciation is usually two to five dollars per night.", vi: "Tip housekeeping thường 2-5 đô mỗi đêm.", pronunciation_focus: ["appreciation", "night"] },
      { en: "Bellhop is one to two dollars per bag.", vi: "Bellhop 1-2 đô mỗi túi.", pronunciation_focus: ["bellhop", "bag"] },
      { en: "Concierge for special services, anywhere from five to twenty.", vi: "Concierge cho dịch vụ đặc biệt, 5-20 đô.", pronunciation_focus: ["concierge", "twenty"] },
      { en: "Cash is appreciated but not required.", vi: "Tiền mặt cảm ơn nhưng không bắt buộc.", pronunciation_focus: ["cash", "required"] },
    ],
    cultural_notes_vi:
      "Khách quốc tế đôi khi không biết tipping norms. Khách Á-Đông quen 'service charge included' (như Nhật, Hàn). KHÔNG hỏi tip trực tiếp — đó là rude. Nếu khách hỏi 'do I tip?', nói chuẩn rate + 'completely up to you'.",
    tip_advice_vi:
      "Một số tiệm hiển thị tipping guidelines trên TV in-room hoặc folder welcome. Đó là cách báo khéo. Khách Mỹ biết, khách quốc tế cảm ơn vì được hướng dẫn. Tipping = lương lớn cho front-line staff.",
  },
  {
    id: "hospitality_cultural_religion",
    category: "cultural_awareness",
    title_vi: "Yêu cầu tôn giáo",
    title_en: "Religious accommodation",
    sentences: [
      { en: "Need a prayer mat or compass?", vi: "Cần thảm cầu nguyện hay la bàn không?", pronunciation_focus: ["prayer", "compass"] },
      { en: "Halal options are at the Italian restaurant.", vi: "Đồ halal tại nhà hàng Ý.", pronunciation_focus: ["halal", "Italian"] },
      { en: "Kosher kitchen on the second floor.", vi: "Bếp kosher tầng 2.", pronunciation_focus: ["Kosher", "second"] },
      { en: "Quiet room for meditation — third floor.", vi: "Phòng yên tĩnh thiền — tầng 3.", pronunciation_focus: ["meditation", "third"] },
    ],
    cultural_notes_vi:
      "Khách Hồi giáo cần Qibla direction (compass), prayer mat, halal food. Khách Do Thái Orthodox cần kosher, quiet on Sabbath. Khách Phật giáo / Hindu đôi khi thiền sáng. Tiệm prepared = lợi thế cạnh tranh + tip cao.",
    tip_advice_vi:
      "Brand luxury (Four Seasons, Ritz) đào tạo religious accommodation kỹ. Tiệm chain mid-level học ít hơn — học chủ động = nổi bật. Khách Hồi giáo Saudi trả tiền lớn cho tiệm hiểu nhu cầu họ.",
  },
  {
    id: "hospitality_cultural_modesty",
    category: "cultural_awareness",
    title_vi: "Sự kín đáo",
    title_en: "Modesty considerations",
    sentences: [
      { en: "Pool has separate hours for women if you'd like.", vi: "Hồ bơi có giờ riêng cho nữ nếu quý khách muốn.", pronunciation_focus: ["pool", "separate"] },
      { en: "Spa has female-only treatment rooms.", vi: "Spa có phòng riêng cho nữ.", pronunciation_focus: ["spa", "treatment"] },
      { en: "Men's gym is on the third floor, women's on the fourth.", vi: "Gym nam tầng 3, nữ tầng 4.", pronunciation_focus: ["men's", "fourth"] },
      { en: "Just let me know if anything else.", vi: "Cần gì khác quý khách báo em.", pronunciation_focus: ["else"] },
    ],
    cultural_notes_vi:
      "Modesty cao ở khách Hồi giáo, Hindu Orthodox, Do Thái Orthodox. Một số tiệm có 'ladies-only' floor / hours = competitive advantage. Đề nghị tự nguyện, không giả định. KHÔNG hỏi 'are you Muslim?' — chỉ offer accommodations.",
    tip_advice_vi:
      "Một số khách nữ thích female bellhop / housekeeping. Nếu yêu cầu, tôn trọng — đó là religious right. Manager điều phối staff. Khách trả tiền lớn cho tiệm tôn trọng modesty của họ.",
  },
  {
    id: "hospitality_cultural_dietary",
    category: "cultural_awareness",
    title_vi: "Ăn kiêng tôn giáo / văn hoá",
    title_en: "Religious / cultural dietary",
    sentences: [
      { en: "Restaurant has vegetarian, vegan, halal, kosher options.", vi: "Nhà hàng có chay, vegan, halal, kosher.", pronunciation_focus: ["vegetarian", "kosher"] },
      { en: "Want me to flag your dietary preference?", vi: "Em đánh dấu dietary preference cho quý khách nhé?", pronunciation_focus: ["flag", "dietary"] },
      { en: "Chef will know across all venues.", vi: "Bếp trưởng biết hết các nơi.", pronunciation_focus: ["chef", "venues"] },
      { en: "Let me know special requirements.", vi: "Quý khách báo em yêu cầu đặc biệt.", pronunciation_focus: ["special", "requirements"] },
    ],
    cultural_notes_vi:
      "Halal vs kosher khác nhau — đừng nhầm. Vegetarian không phải vegan. Hindu Orthodox không ăn thịt bò. Buddhist đôi khi ăn chay vào ngày lễ. Học rõ phân biệt — nhầm = xúc phạm tôn giáo + lawsuit potential.",
    tip_advice_vi:
      "PMS có 'guest preference' field — note dietary cho future stays. Khách Hồi giáo Saudi quay lại tiệm 5 năm sau, expect halal options ready. Documentation = loyalty.",
  },
  {
    id: "hospitality_cultural_holidays",
    category: "cultural_awareness",
    title_vi: "Lễ Tết các nước",
    title_en: "Cultural holidays",
    sentences: [
      { en: "Happy Diwali — we have a special menu tonight.", vi: "Chúc Diwali — tối nay có menu đặc biệt.", pronunciation_focus: ["Diwali", "special"] },
      { en: "Lunar New Year decorations are in the lobby.", vi: "Trang trí Tết âm ở sảnh.", pronunciation_focus: ["Lunar", "decorations"] },
      { en: "Iftar is served from 7:30.", vi: "Iftar phục vụ từ 7:30.", pronunciation_focus: ["Iftar", "served"] },
      { en: "Anything we can do to make it special?", vi: "Mình làm gì cho quý khách đặc biệt hơn?", pronunciation_focus: ["special"] },
    ],
    cultural_notes_vi:
      "Diwali (Hindu, T11), Lunar New Year (Á-Đông, T1-2), Ramadan/Iftar (Hồi giáo), Hanukkah (Do Thái, T12) — học bốn lễ chính. Wishes đúng = ấn tượng mạnh + tip cao. KHÔNG nói 'Happy Holidays' chung — cụ thể theo lễ khách kỷ niệm.",
    tip_advice_vi:
      "Calendar lễ tết trên front desk — kiểm tra trước check-in khách quốc tế. Chuẩn bị nhỏ (chocolate, card, lời chúc) chi phí < $5 nhưng tạo memory cả đời. Khách kể bạn bè — viral marketing tự nhiên.",
  },
];

// ── Aggregate + helpers ──────────────────────────────────────────────────

export const HOSPITALITY_LESSONS: ReadonlyArray<HospitalityLesson> = [
  ...CHECK_IN_OUT,
  ...CONCIERGE,
  ...HOUSEKEEPING,
  ...COMPLAINT,
  ...BANQUET,
  ...PHONE,
  ...MULTI_LANG,
  ...CULTURAL,
];

export function getHospitalityLessonsByCategory(
  category: HospitalityCategoryId,
): HospitalityLesson[] {
  return HOSPITALITY_LESSONS.filter((l) => l.category === category);
}

export function getHospitalityLessonById(id: string): HospitalityLesson | undefined {
  return HOSPITALITY_LESSONS.find((l) => l.id === id);
}
