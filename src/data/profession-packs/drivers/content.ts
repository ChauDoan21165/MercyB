// src/data/profession-packs/drivers/content.ts
//
// Lesson-shaped content for the drivers profession pack — Uber/Lyft,
// food delivery (DoorDash, Uber Eats, Instacart), and long-haul
// trucking. ~50k Vietnamese-Americans in driving roles. English is
// critical for safety (police interactions, emergency reporting),
// rating economics (4.8+ is the line for staying eligible for surge),
// and DOT compliance for trucking.
//
// 50 lessons across 8 categories per the brief. Each lesson:
//
//   id                 driver_<slug> — forward-compatible with future
//                      room IDs in roomRegistry.
//   title_vi/title_en  bilingual title.
//   category           one of DRIVER_CATEGORIES.
//   sentences          4–6 short utterances, each with a Vietnamese
//                      gloss and pronunciation focus on what trips
//                      Vietnamese drivers up — number/address
//                      precision, brand-name pronunciation, critical
//                      safety vocabulary.
//   cultural_notes_vi  what's actually true on the US road —
//                      Uber/Lyft rating math, DOT regulations basics
//                      (HOS, ELD), tipping norms (driver doesn't ask),
//                      police interaction protocol.
//   tip_advice_vi      practical advice — confirm-before-you-drive,
//                      smile-in-voice, never engage politics, dispatch
//                      communication for long-haul.
//
// Authenticity: phrasing reflects what's actually said in US rideshare
// and trucking. Numbers like "4.8 rating" and "11-hour HOS limit" are
// real industry constraints — not made up.

export type DriverCategoryId =
  | "pickup_confirmation"
  | "in_trip_conversation"
  | "navigation_issues"
  | "customer_disputes"
  | "safety_emergency"
  | "trucking_specific"
  | "multi_passenger"
  | "tips_ratings_brand";

export type DriverCategoryMeta = {
  id: DriverCategoryId;
  title_vi: string;
  title_en: string;
  expected_count: number;
};

export const DRIVER_CATEGORIES: ReadonlyArray<DriverCategoryMeta> = [
  {
    id: "pickup_confirmation",
    title_vi: "Xác nhận đón khách",
    title_en: "Pickup confirmation",
    expected_count: 10,
  },
  {
    id: "in_trip_conversation",
    title_vi: "Giao tiếp trong chuyến đi",
    title_en: "In-trip conversation",
    expected_count: 5,
  },
  {
    id: "navigation_issues",
    title_vi: "Trục trặc đường đi",
    title_en: "Navigation issues",
    expected_count: 5,
  },
  {
    id: "customer_disputes",
    title_vi: "Tranh chấp với khách",
    title_en: "Customer disputes",
    expected_count: 5,
  },
  {
    id: "safety_emergency",
    title_vi: "An toàn và khẩn cấp",
    title_en: "Safety and emergencies",
    expected_count: 5,
  },
  {
    id: "trucking_specific",
    title_vi: "Lái xe tải đường dài",
    title_en: "Trucking-specific",
    expected_count: 10,
  },
  {
    id: "multi_passenger",
    title_vi: "Chuyến đi nhiều khách",
    title_en: "Multi-passenger / pool rides",
    expected_count: 5,
  },
  {
    id: "tips_ratings_brand",
    title_vi: "Tip, rating, và phong cách phục vụ",
    title_en: "Tips, ratings, and brand voice",
    expected_count: 5,
  },
];

export type LessonSentence = {
  en: string;
  vi: string;
  /** Light IPA-ish phoneme keys VN drivers struggle with on the road. */
  pronunciation_focus: string[];
};

export type DriverLesson = {
  id: string;
  category: DriverCategoryId;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  tip_advice_vi: string;
};

// ── 1. Pickup confirmation (10) ──────────────────────────────────────────

const PICKUP: DriverLesson[] = [
  {
    id: "driver_pickup_name_check",
    category: "pickup_confirmation",
    title_vi: "Hỏi xác nhận tên khách",
    title_en: "Verifying the rider's name",
    sentences: [
      { en: "Hi, are you Sarah?", vi: "Chào, có phải chị Sarah không ạ?", pronunciation_focus: ["Sarah", "are you"] },
      { en: "Just confirming — I'm picking up Sarah for Uber, going to LAX.", vi: "Em xác nhận — em đón chị Sarah cho Uber, đi LAX ạ.", pronunciation_focus: ["confirming", "LAX"] },
      { en: "Great, hop in whenever you're ready.", vi: "Ổn rồi, chị lên xe khi nào sẵn sàng ạ.", pronunciation_focus: ["hop in", "ready"] },
      { en: "Trunk's open if you have luggage.", vi: "Cốp xe mở nếu chị có hành lý ạ.", pronunciation_focus: ["trunk", "luggage"] },
    ],
    cultural_notes_vi:
      "Uber/Lyft yêu cầu tài xế xác nhận tên TRƯỚC khi cho khách lên xe. KHÔNG hỏi 'Are you my Uber?' — câu đó để khách hỏi mình. Tài xế phải gọi tên — nếu sai người, app báo no-show và khách bị phạt.",
    tip_advice_vi:
      "Đọc tên khách 2-3 lần trước khi đến nơi để phát âm chuẩn. Khách Mỹ rất quan tâm tên mình được đọc đúng. Sai tên = giảm rating ngay lần đầu. Tên Nam Á / Châu Phi cần luyện riêng — đừng đoán.",
  },
  {
    id: "driver_pickup_destination_confirm",
    category: "pickup_confirmation",
    title_vi: "Xác nhận điểm đến",
    title_en: "Confirming the destination",
    sentences: [
      { en: "Just to confirm — heading to 553 Main Street?", vi: "Xác nhận lại — mình đi 553 Main Street ạ?", pronunciation_focus: ["five-five-three", "Main"] },
      { en: "Five-five-three Main, near the bank?", vi: "5-5-3 Main, gần ngân hàng ạ?", pronunciation_focus: ["five-five-three"] },
      { en: "Got it — that's about 12 minutes with traffic.", vi: "Em rõ — khoảng 12 phút có kẹt xe ạ.", pronunciation_focus: ["twelve", "traffic"] },
      { en: "Any preferred route?", vi: "Chị có muốn đi đường nào cụ thể không ạ?", pronunciation_focus: ["preferred", "route"] },
    ],
    cultural_notes_vi:
      "Đọc địa chỉ TỪNG SỐ một: '5-5-3' không phải '553'. Khách Mỹ nghe rõ hơn cách này, đặc biệt khi qua điện thoại hoặc trong xe ồn. Số đôi/số ba nói liền dễ nhầm.",
    tip_advice_vi:
      "Quy tắc: 'three digits one at a time' — '5-5-3 Main Street'. Số trên 1000 thì chia: '4-2-1-2' = 4212. ĐỪNG đọc 'forty-two-twelve' — khách hay nhầm. Sai địa chỉ = sai chỗ đến = phàn nàn.",
  },
  {
    id: "driver_pickup_special_instructions",
    category: "pickup_confirmation",
    title_vi: "Hướng dẫn đặc biệt từ khách",
    title_en: "Following special instructions",
    sentences: [
      { en: "I see you have a note — call when I arrive?", vi: "Em thấy ghi chú — gọi khi em đến ạ?", pronunciation_focus: ["note", "arrive"] },
      { en: "I'm outside the lobby, white Toyota, plate ABC-1234.", vi: "Em đang ngoài sảnh, Toyota trắng, biển ABC-1234 ạ.", pronunciation_focus: ["lobby", "plate"] },
      { en: "Take your time, no rush.", vi: "Chị cứ thư thả, không vội ạ.", pronunciation_focus: ["take", "rush"] },
      { en: "I'll be here.", vi: "Em đợi ngay đây ạ.", pronunciation_focus: ["I'll", "here"] },
    ],
    cultural_notes_vi:
      "Đọc note của khách trong app trước khi đến — họ ghi đó vì có lý do (con nhỏ, người già, đồ nhiều). Bỏ qua note = bị 1 sao. Đọc note = +rating + tip.",
    tip_advice_vi:
      "Khi đến nơi, gọi/nhắn theo đúng note. Đậu đúng chỗ khách yêu cầu. Mô tả xe (màu, biển) qua text — khách nhận diện nhanh hơn. Đậu 30 giây không thấy khách = nhắn lại; 2 phút = bấm 'arrived' để bắt đầu đếm phí chờ.",
  },
  {
    id: "driver_pickup_wrong_address",
    category: "pickup_confirmation",
    title_vi: "Khi địa chỉ trong app sai",
    title_en: "When the app address is wrong",
    sentences: [
      { en: "I think the app is showing the wrong address — I'm at the back entrance.", vi: "Em nghĩ app hiện sai địa chỉ — em đang ở cổng sau ạ.", pronunciation_focus: ["wrong", "entrance"] },
      { en: "Can you tell me which side of the building you're on?", vi: "Chị cho em biết mặt nào của tòa nhà ạ?", pronunciation_focus: ["which", "side"] },
      { en: "I'll come around — give me one minute.", vi: "Em vòng lại — cho em 1 phút ạ.", pronunciation_focus: ["come around", "minute"] },
      { en: "Looking for the white Toyota, right?", vi: "Chị tìm Toyota trắng đúng không ạ?", pronunciation_focus: ["looking", "right"] },
    ],
    cultural_notes_vi:
      "GPS sai địa chỉ là chuyện thường — đặc biệt ở apartment complex và bệnh viện. KHÔNG đổ lỗi cho khách 'You're at the wrong place'. Tự xác nhận và đi vòng — lỗi GPS không phải lỗi khách.",
    tip_advice_vi:
      "Apartment complex thường có nhiều cổng — hỏi 'which side' / 'which entrance' / 'which gate'. Bệnh viện có ER, main, parking — hỏi cụ thể. Sai chỗ một lần = trễ + rating xuống.",
  },
  {
    id: "driver_pickup_no_show",
    category: "pickup_confirmation",
    title_vi: "Khách không xuất hiện",
    title_en: "Customer no-show",
    sentences: [
      { en: "I've been here for two minutes — are you on your way?", vi: "Em đợi 2 phút rồi — chị đang xuống không ạ?", pronunciation_focus: ["two minutes", "way"] },
      { en: "Just letting you know — the wait timer started.", vi: "Em báo trước — đồng hồ phí chờ đã chạy ạ.", pronunciation_focus: ["timer", "started"] },
      { en: "I'll wait another three minutes, then I'll have to go.", vi: "Em đợi thêm 3 phút, sau đó em phải đi ạ.", pronunciation_focus: ["three", "have to"] },
      { en: "No problem — I'll cancel and you'll get the no-show fee.", vi: "Không sao — em hủy, chị bị phí no-show ạ.", pronunciation_focus: ["cancel", "no-show"] },
    ],
    cultural_notes_vi:
      "Sau 2 phút Uber tính phí chờ ($0.30-$0.45/phút). Sau 5 phút bạn được phép hủy với phí no-show ($5-10). Đợi quá 5 phút không hủy = mất tiền. Đa số tài xế mới sợ hủy — sai. App được thiết kế để bạn hủy đúng thời điểm.",
    tip_advice_vi:
      "Nhắn khách lúc đến: 'I'm here, white Toyota out front.' Đợi 2 phút bấm 'arrived'. Nhắn lần 2 ở phút 3. Hủy ở phút 5 với lý do 'rider no-show'. Quy trình này ghi nhận với app, được trả phí và rating không bị ảnh hưởng.",
  },
  {
    id: "driver_pickup_food_delivery",
    category: "pickup_confirmation",
    title_vi: "Giao đồ ăn — đến nhà hàng",
    title_en: "Food delivery: arriving at restaurant",
    sentences: [
      { en: "Hi, picking up an order for Doan?", vi: "Chào, em lấy đơn cho khách Doan ạ?", pronunciation_focus: ["picking up", "order"] },
      { en: "DoorDash order, ready for pickup.", vi: "Đơn DoorDash, đến lấy ạ.", pronunciation_focus: ["DoorDash"] },
      { en: "Thanks — have a good one.", vi: "Cảm ơn — chị một ngày tốt lành ạ.", pronunciation_focus: ["good one"] },
      { en: "Could I get a bag and a receipt for delivery?", vi: "Cho em xin túi và hóa đơn để giao ạ?", pronunciation_focus: ["bag", "receipt"] },
    ],
    cultural_notes_vi:
      "Restaurant staff bận — nói ngắn. 'Picking up for [name]' đủ. Nhân viên đưa order, tài xế kiểm tra. ĐỪNG mở bao bì kiểm tra món — đó là việc của nhà hàng. Hư món sau, khách phàn nàn nhà hàng, không phải tài xế.",
    tip_advice_vi:
      "Luôn xác nhận tên khách + số đơn TRƯỚC khi rời. Cầm nhầm đơn của khách khác = phải đem trả + giao lại = mất 30 phút + rating xuống. Túi đồ uống đặt riêng để không đổ (khách nhạy cảm với bừa bộn).",
  },
  {
    id: "driver_pickup_grocery_inventory",
    category: "pickup_confirmation",
    title_vi: "Đi chợ thay khách (Instacart)",
    title_en: "Instacart: in-store substitution",
    sentences: [
      { en: "Hi! Quick question — they don't have the brand you wanted. Is the store brand okay?", vi: "Chào! Hỏi nhanh — họ hết hãng chị muốn. Hãng tự cửa hàng có được không ạ?", pronunciation_focus: ["brand", "okay"] },
      { en: "Or would you prefer no replacement on this one?", vi: "Hay chị muốn không thay thế món này ạ?", pronunciation_focus: ["replacement", "this one"] },
      { en: "Same price, just a different label.", vi: "Cùng giá, chỉ khác nhãn ạ.", pronunciation_focus: ["price", "label"] },
      { en: "Let me know in the next minute if possible.", vi: "Chị cho em biết trong 1 phút nếu được ạ.", pronunciation_focus: ["minute", "possible"] },
    ],
    cultural_notes_vi:
      "Instacart cho phép replace món hết hàng. Quy tắc: chat khách trước khi quyết. Replace bừa = phàn nàn. Hỏi 'Is X okay?' trước = chuyên nghiệp = tip cao.",
    tip_advice_vi:
      "Chụp ảnh kệ trống làm bằng chứng. Replacement giá khác 30%+ phải hỏi. Khách không trả lời trong 2 phút → chọn replacement gần nhất + chụp ảnh. App ghi nhận nỗ lực, khách không phàn nàn được.",
  },
  {
    id: "driver_pickup_apartment_gate",
    category: "pickup_confirmation",
    title_vi: "Vào chung cư có cổng",
    title_en: "Gated apartment access",
    sentences: [
      { en: "Hi, I'm a delivery driver — there's a gate code in the order, but it's not working.", vi: "Chào, em là tài xế giao hàng — có mã cổng trong đơn nhưng không vào được ạ.", pronunciation_focus: ["gate code", "working"] },
      { en: "Can someone buzz me in to drop off the food?", vi: "Có ai mở cổng cho em vào giao đồ được không ạ?", pronunciation_focus: ["buzz", "drop off"] },
      { en: "I'm in a white Toyota at the visitor gate.", vi: "Em ở Toyota trắng, cổng khách ạ.", pronunciation_focus: ["visitor", "gate"] },
      { en: "Sorry to bother you.", vi: "Xin lỗi đã làm phiền ạ.", pronunciation_focus: ["sorry", "bother"] },
    ],
    cultural_notes_vi:
      "Apartment / condo gates là khó khăn lớn cho delivery. Gate code hết hạn / nhập sai. Gọi office hoặc nhắn khách. ĐỪNG đậu trước cổng quá 3 phút — bảo vệ sẽ đến hỏi. Nói rõ 'delivery driver' = thân thiện hơn 'driver'.",
    tip_advice_vi:
      "Ghi note trong app cho khách quen có cổng khó: 'gate code XXXX' hoặc 'call apt 312'. Lần sau giao nhanh hơn. Đầu tư 2 phút ghi note tiết kiệm 5 phút mỗi lần sau.",
  },
  {
    id: "driver_pickup_drop_off_contactless",
    category: "pickup_confirmation",
    title_vi: "Giao không tiếp xúc",
    title_en: "Contactless drop-off",
    sentences: [
      { en: "I'm leaving the order at the door — knocking now.", vi: "Em đặt đơn trước cửa — em gõ cửa ạ.", pronunciation_focus: ["leaving", "knocking"] },
      { en: "Bag is on the doormat, drinks on the side.", vi: "Túi đặt thảm cửa, đồ uống bên cạnh ạ.", pronunciation_focus: ["doormat", "side"] },
      { en: "Picture sent to the app.", vi: "Em gửi ảnh trong app ạ.", pronunciation_focus: ["picture"] },
      { en: "Enjoy your meal!", vi: "Chúc chị ngon miệng ạ!", pronunciation_focus: ["enjoy", "meal"] },
    ],
    cultural_notes_vi:
      "Contactless = mặc định cho food delivery. Chụp ảnh BẮT BUỘC trên DoorDash, Uber Eats. Không chụp = khách 'never received' = mất tiền + rating xuống. Đặt đồ ngay trước cửa, không trước cầu thang xa xôi.",
    tip_advice_vi:
      "Ảnh phải show: (1) đơn rõ ràng, (2) số nhà nhìn được, (3) cửa khách. Ánh sáng yếu → bật flash. Mưa → đặt vào chỗ khô có mái. 'Enjoy your meal' nhắn cuối = tip nhỉnh hơn.",
  },
  {
    id: "driver_pickup_alcohol_id",
    category: "pickup_confirmation",
    title_vi: "Giao đồ có cồn — kiểm tra ID",
    title_en: "Alcohol delivery: ID check",
    sentences: [
      { en: "I have an alcohol delivery — I'll need to see a valid ID.", vi: "Em giao đồ có cồn — em cần xem giấy tờ tùy thân ạ.", pronunciation_focus: ["alcohol", "valid"] },
      { en: "Driver's license or state ID, please.", vi: "Bằng lái hoặc state ID ạ.", pronunciation_focus: ["driver's license", "state ID"] },
      { en: "Has to be 21 or older.", vi: "Phải từ 21 tuổi trở lên ạ.", pronunciation_focus: ["twenty-one"] },
      { en: "I'm sorry, I can't leave this if you can't show ID — store policy.", vi: "Em xin lỗi, không show được ID em không giao được — chính sách cửa hàng ạ.", pronunciation_focus: ["sorry", "policy"] },
    ],
    cultural_notes_vi:
      "Alcohol delivery có quy định nghiêm: phải kiểm tra ID, scan ID trong app, người trên 21. Vi phạm = tài xế bị phạt + tài khoản bị khóa. KHÔNG giao cho ai không show ID — kể cả khách quen.",
    tip_advice_vi:
      "Học cụm 'I'm sorry, I can't leave this' lịch sự. Đừng cảm thấy ngại — đây là quy định bảo vệ tài xế. Nếu khách không có ID, app cho phép trả lại đồ về cửa hàng và bạn vẫn được trả phí.",
  },
];

// ── 2. In-trip conversation (5) ──────────────────────────────────────────

const IN_TRIP: DriverLesson[] = [
  {
    id: "driver_intrip_small_talk",
    category: "in_trip_conversation",
    title_vi: "Trò chuyện nhẹ trong xe",
    title_en: "Light small talk",
    sentences: [
      { en: "Long day or just getting started?", vi: "Một ngày dài hay vừa bắt đầu ạ?", pronunciation_focus: ["long", "started"] },
      { en: "How's traffic been on your end?", vi: "Đường bên chị thế nào ạ?", pronunciation_focus: ["traffic", "end"] },
      { en: "Pretty quiet today.", vi: "Hôm nay khá vắng ạ.", pronunciation_focus: ["pretty", "quiet"] },
      { en: "Hope you have a good night.", vi: "Chúc chị buổi tối tốt lành ạ.", pronunciation_focus: ["good night"] },
    ],
    cultural_notes_vi:
      "Small talk Mỹ = 1-2 câu mở, sau đó im lặng nếu khách không đáp lại. Đừng ép trò chuyện. Khách đeo headphone / nhắn tin = tín hiệu muốn yên tĩnh. Tôn trọng = +rating.",
    tip_advice_vi:
      "Đọc khách trong 30 giây đầu: nói nhiều = thích trò chuyện; trả lời ngắn = muốn yên tĩnh; không trả lời = quiet ride. Match năng lượng khách. Quá hoạt ngôn với khách quiet = -rating.",
  },
  {
    id: "driver_intrip_route_preference",
    category: "in_trip_conversation",
    title_vi: "Hỏi sở thích đường đi",
    title_en: "Asking about route preference",
    sentences: [
      { en: "GPS wants the highway — does that work for you?", vi: "GPS chỉ đi cao tốc — chị thấy ổn không ạ?", pronunciation_focus: ["highway", "work"] },
      { en: "Or would you prefer surface streets?", vi: "Hay chị thích đi đường thường ạ?", pronunciation_focus: ["surface streets"] },
      { en: "Highway might be faster but it's about a dollar more in tolls.", vi: "Cao tốc nhanh hơn nhưng tốn thêm khoảng 1 đô phí cầu đường ạ.", pronunciation_focus: ["faster", "tolls"] },
      { en: "Whatever you prefer.", vi: "Tùy chị ạ.", pronunciation_focus: ["whatever"] },
    ],
    cultural_notes_vi:
      "Highway có toll → khách tự trả qua app (Uber tính tự động). Hỏi route preference = chuyên nghiệp. Khách sửa GPS giữa chuyến → làm theo, đừng bướng. Khách biết đường vùng họ hơn GPS.",
    tip_advice_vi:
      "Cụm 'whatever you prefer' rất quan trọng — cho khách quyền chọn. Nếu khách không quan tâm, theo GPS. Nếu khách bảo 'take 405' nhưng đang đỏ rực, nói 'I'd suggest 110 — saves about 10 minutes' — chuyên nghiệp.",
  },
  {
    id: "driver_intrip_temperature_music",
    category: "in_trip_conversation",
    title_vi: "Điều chỉnh nhiệt độ và nhạc",
    title_en: "Temperature and music",
    sentences: [
      { en: "Is the temperature okay back there?", vi: "Nhiệt độ phía sau ổn không ạ?", pronunciation_focus: ["temperature", "back"] },
      { en: "Want me to turn the music down or change the station?", vi: "Em vặn nhỏ nhạc hay đổi đài ạ?", pronunciation_focus: ["music", "station"] },
      { en: "Feel free to play your own — Bluetooth's available.", vi: "Chị bật nhạc mình cũng được — có Bluetooth ạ.", pronunciation_focus: ["Bluetooth", "available"] },
      { en: "Just let me know.", vi: "Chị cứ nói em ạ.", pronunciation_focus: ["let me know"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ ngại nói 'tôi lạnh' / 'nhạc to' — họ chịu đựng rồi cho 4 sao. Hỏi trước = họ thoải mái nói = ride tốt = 5 sao. Cho khách connect Bluetooth = +1 sao gần như chắc chắn.",
    tip_advice_vi:
      "Mặc định: AC vừa phải (72°F / 22°C), nhạc nhỏ. Mở cửa sổ chỉ khi khách đề nghị. Mùi xe quan trọng — không hút thuốc, không ăn trong xe, dùng air freshener nhẹ. Mùi mạnh = -1 sao.",
  },
  {
    id: "driver_intrip_avoid_topics",
    category: "in_trip_conversation",
    title_vi: "Tránh chủ đề nhạy cảm",
    title_en: "Steering away from politics/religion",
    sentences: [
      { en: "Yeah, it's been a wild news cycle — anyway, how was your weekend?", vi: "Vâng, tin tức dạo này náo nhiệt — chị cuối tuần thế nào ạ?", pronunciation_focus: ["wild", "weekend"] },
      { en: "I try to stay out of politics — keeps me sane.", vi: "Em tránh nói chính trị — cho đầu óc nhẹ nhàng ạ.", pronunciation_focus: ["politics", "sane"] },
      { en: "Different topic — got any plans tonight?", vi: "Đổi chủ đề — chị có kế hoạch tối nay không ạ?", pronunciation_focus: ["plans", "tonight"] },
      { en: "Sports any better — who's your team?", vi: "Thể thao tốt hơn — chị cổ vũ đội nào ạ?", pronunciation_focus: ["sports", "team"] },
    ],
    cultural_notes_vi:
      "TUYỆT ĐỐI tránh: chính trị, tôn giáo, chủng tộc, lương. Khách đề cập → chuyển chủ đề khéo. Đồng tình = mất khách phía bên kia. Phản đối = cuộc cãi vã + 1 sao + complaint. Trung lập + chuyển chủ đề là tốt nhất.",
    tip_advice_vi:
      "Cụm 'different topic' / 'I try to stay out of politics' chuẩn. Học thuộc 3-4 chủ đề an toàn để chuyển: weather, sports, food, weekend plans. KHÔNG dùng 'I agree' hoặc 'I disagree' với chủ đề chính trị — không có lựa chọn nào tốt.",
  },
  {
    id: "driver_intrip_silence_request",
    category: "in_trip_conversation",
    title_vi: "Khách muốn yên tĩnh",
    title_en: "Quiet ride request",
    sentences: [
      { en: "Quiet ride — got it.", vi: "Chuyến yên tĩnh — em rõ ạ.", pronunciation_focus: ["quiet ride"] },
      { en: "I'll keep the music low.", vi: "Em vặn nhạc nhỏ ạ.", pronunciation_focus: ["keep", "low"] },
      { en: "Let me know if you need anything.", vi: "Cần gì chị cứ nói em ạ.", pronunciation_focus: ["let me know"] },
      { en: "Have a good rest.", vi: "Chúc chị nghỉ ngơi tốt ạ.", pronunciation_focus: ["good rest"] },
    ],
    cultural_notes_vi:
      "Uber Comfort/Black tier có 'quiet preference' — khách bật trong app. KHÔNG cố trò chuyện khi đã chọn quiet. Vi phạm preference = -1 sao. Câu chào ngắn đầu/cuối là OK; giữa chuyến im lặng.",
    tip_advice_vi:
      "Khách quiet thường tip cao hơn nếu mình tôn trọng preference. 'Have a good rest' cuối chuyến đủ — không cần nhiều hơn. Trong xe: tắt thông báo điện thoại, không gọi điện riêng.",
  },
];

// ── 3. Navigation issues (5) ─────────────────────────────────────────────

const NAVIGATION: DriverLesson[] = [
  {
    id: "driver_nav_gps_reroute",
    category: "navigation_issues",
    title_vi: "GPS đổi đường",
    title_en: "GPS reroute mid-trip",
    sentences: [
      { en: "GPS just rerouted us — looks like there's an accident ahead.", vi: "GPS vừa đổi đường — phía trước có tai nạn ạ.", pronunciation_focus: ["rerouted", "accident"] },
      { en: "We'll go through the side streets — adds about 5 minutes.", vi: "Mình đi đường nhánh — thêm khoảng 5 phút ạ.", pronunciation_focus: ["side streets", "five minutes"] },
      { en: "Still on track for your appointment.", vi: "Vẫn kịp giờ hẹn của chị ạ.", pronunciation_focus: ["on track", "appointment"] },
      { en: "Let me know if you'd rather stick with the original route.", vi: "Chị muốn theo đường cũ thì nói em ạ.", pronunciation_focus: ["stick with", "original"] },
    ],
    cultural_notes_vi:
      "Báo khách KHI reroute = chuyên nghiệp. Khách thấy tài xế đi 'lạ' mà không nói = nghi ngờ extra fare. Báo trước = trust. Câu 'still on track for your appointment' trấn an khách đang vội.",
    tip_advice_vi:
      "Luôn theo GPS app (Uber/Lyft Navigation) — không phải Google Maps cá nhân. Lý do: app tính route khớp với fare. Tự ý đi đường ngắn = fare giảm = mất tiền. Đi đường dài = khách nghi tăng fare = complaint.",
  },
  {
    id: "driver_nav_traffic_delay",
    category: "navigation_issues",
    title_vi: "Báo trễ vì kẹt xe",
    title_en: "Traffic delay update",
    sentences: [
      { en: "Heads up — traffic just got heavy. ETA bumped to 4:25 instead of 4:15.", vi: "Lưu ý — đường vừa kẹt lại. ETA 4:25 thay vì 4:15 ạ.", pronunciation_focus: ["heads up", "bumped"] },
      { en: "About a 10-minute delay.", vi: "Trễ khoảng 10 phút ạ.", pronunciation_focus: ["delay"] },
      { en: "Want me to look at alternate routes?", vi: "Em xem đường khác cho chị nhé?", pronunciation_focus: ["alternate"] },
      { en: "Sorry about that.", vi: "Em xin lỗi vì việc này ạ.", pronunciation_focus: ["sorry"] },
    ],
    cultural_notes_vi:
      "Khách đi đến hẹn quan trọng (sân bay, phỏng vấn) sẽ stress. Update sớm = khách có thời gian gọi điện báo. Im lặng = khách tự nhận ra trễ → giận. Câu 'sorry about that' không nhận lỗi cá nhân — chỉ thể hiện thấu cảm.",
    tip_advice_vi:
      "Khách đi sân bay nên hỏi ngay đầu chuyến: 'What time's your flight?'. Biết deadline = tính dự phòng. Trễ flight = phàn nàn lớn = bị refund chuyến + rating xuống. Báo sớm = khách đổi flight nếu cần.",
  },
  {
    id: "driver_nav_road_closed",
    category: "navigation_issues",
    title_vi: "Đường bị đóng",
    title_en: "Road closure",
    sentences: [
      { en: "Looks like the road ahead is closed — construction.", vi: "Đường phía trước đóng — đang sửa ạ.", pronunciation_focus: ["closed", "construction"] },
      { en: "I'm taking a different route — about 8 minutes longer.", vi: "Em đi đường khác — thêm 8 phút ạ.", pronunciation_focus: ["different route", "longer"] },
      { en: "GPS didn't catch this one in time.", vi: "GPS chưa cập nhật kịp ạ.", pronunciation_focus: ["didn't catch"] },
      { en: "Sorry about the detour.", vi: "Xin lỗi vì đi vòng ạ.", pronunciation_focus: ["detour"] },
    ],
    cultural_notes_vi:
      "Đường đóng đột ngột (construction, parade, accident) là lỗi không phải tài xế. Giải thích bình tĩnh, đề xuất giải pháp = chuyên nghiệp. Đổ lỗi cho thành phố / GPS = ngầm khó chịu.",
    tip_advice_vi:
      "Học cụm 'detour' (đi vòng) — chuẩn từ vựng giao thông. Khi đi vòng, nói rõ 'about X minutes longer' — số liệu cụ thể trấn an khách. Vague time ('a little longer') = lo lắng tăng.",
  },
  {
    id: "driver_nav_passenger_directions",
    category: "navigation_issues",
    title_vi: "Khách chỉ đường khác GPS",
    title_en: "Passenger overriding GPS",
    sentences: [
      { en: "You know the area better — I'll follow your lead.", vi: "Chị biết khu này hơn — em theo chỉ dẫn của chị ạ.", pronunciation_focus: ["follow", "lead"] },
      { en: "Got it — left at the next light?", vi: "Em rõ — rẽ trái ở đèn tiếp ạ?", pronunciation_focus: ["next light"] },
      { en: "Just confirming — destination is still 553 Main?", vi: "Xác nhận lại — vẫn đến 553 Main ạ?", pronunciation_focus: ["confirming", "Main"] },
      { en: "Thanks for the directions.", vi: "Cảm ơn chị đã chỉ đường ạ.", pronunciation_focus: ["directions"] },
    ],
    cultural_notes_vi:
      "Khách Mỹ rành khu vực sống — họ chỉ đường vì biết shortcut hoặc tránh khu nguy hiểm. Theo họ + cảm ơn = +rating. Bướng theo GPS = -rating. Lưu ý: nếu họ chỉ đi đường lạ ngoài route, vẫn xác nhận destination để không bị 'fare bait'.",
    tip_advice_vi:
      "Câu 'You know the area better' xoa dịu — khách thấy tài xế tôn trọng địa phương. Sau chuyến, ghi chú vùng đó shortcut nào tốt. Lần sau khách khác sẽ thấy bạn rành đường = tip cao hơn.",
  },
  {
    id: "driver_nav_unknown_destination",
    category: "navigation_issues",
    title_vi: "Tới nơi không thấy địa chỉ",
    title_en: "At destination but address unclear",
    sentences: [
      { en: "GPS says we're here — does this look right to you?", vi: "GPS báo đến rồi — chị thấy đúng không ạ?", pronunciation_focus: ["here", "right"] },
      { en: "I see 551 and 555 — which house is yours?", vi: "Em thấy 551 và 555 — nhà chị số nào ạ?", pronunciation_focus: ["which", "yours"] },
      { en: "Want me to pull up here, or further down?", vi: "Em đậu đây hay đi thêm ạ?", pronunciation_focus: ["pull up", "further"] },
      { en: "Take a second to grab everything.", vi: "Chị cứ thư thả lấy đồ ạ.", pronunciation_focus: ["take a second", "grab"] },
    ],
    cultural_notes_vi:
      "GPS thường drop khách 1-2 nhà sai. Hỏi rõ + đậu đúng nhà = chuyên nghiệp. Đậu ngay tại GPS pin → khách phải đi bộ với hành lý nặng = rating xuống.",
    tip_advice_vi:
      "Câu 'pull up here or further down' rất hữu ích — nhiều khách thích đậu xa lề (kín đáo) hoặc gần lề (tiện dỡ đồ). Cho lựa chọn = tôn trọng. 'Take a second to grab everything' cuối chuyến = không vội đuổi khách.",
  },
];

// ── 4. Customer disputes (5) ─────────────────────────────────────────────

const DISPUTES: DriverLesson[] = [
  {
    id: "driver_dispute_wrong_pickup",
    category: "customer_disputes",
    title_vi: "Khách lên nhầm xe",
    title_en: "Wrong rider getting in",
    sentences: [
      { en: "I'm sorry — I'm here for Sarah, not you.", vi: "Em xin lỗi — em đón chị Sarah, không phải chị ạ.", pronunciation_focus: ["sorry", "Sarah"] },
      { en: "Could you double-check your driver's name in the app?", vi: "Chị xem lại tên tài xế trong app giúp em ạ?", pronunciation_focus: ["double-check"] },
      { en: "Probably another driver around the corner.", vi: "Có thể tài xế khác ngay góc đường ạ.", pronunciation_focus: ["probably", "corner"] },
      { en: "No worries — easy mistake.", vi: "Không sao đâu ạ.", pronunciation_focus: ["worries"] },
    ],
    cultural_notes_vi:
      "Khách lên nhầm xe rất phổ biến (đặc biệt sân bay). KHÔNG để khách lạ trong xe — vi phạm app + bảo hiểm. Lịch sự nhưng dứt khoát: 'I'm sorry, I'm here for [name]'. Đừng cảm thấy có lỗi — bảo vệ khách thật của mình.",
    tip_advice_vi:
      "Cụm 'easy mistake' giúp khách không xấu hổ. Mỹ rất ngại bị 'called out' công khai. Câu lịch sự = khách rời êm + tip lần sau có thể cao hơn nếu họ là khách của bạn lần khác.",
  },
  {
    id: "driver_dispute_destination_change",
    category: "customer_disputes",
    title_vi: "Khách đổi điểm đến giữa chuyến",
    title_en: "Mid-trip destination change",
    sentences: [
      { en: "No problem — could you update the destination in the app?", vi: "Không sao — chị cập nhật điểm đến trong app giúp em ạ?", pronunciation_focus: ["update", "destination"] },
      { en: "It just keeps the fare accurate for both of us.", vi: "Để fare đúng cho cả hai mình ạ.", pronunciation_focus: ["fare", "accurate"] },
      { en: "Once you tap 'add stop' or change drop-off, I'll see it.", vi: "Chị bấm 'add stop' hoặc đổi drop-off, em thấy ngay ạ.", pronunciation_focus: ["add stop", "drop-off"] },
      { en: "Take your time.", vi: "Chị cứ thư thả ạ.", pronunciation_focus: ["take your time"] },
    ],
    cultural_notes_vi:
      "Khách đổi destination giữa chuyến — phổ biến. PHẢI yêu cầu update trong app, không thỏa thuận miệng. Đi điểm khác mà không update = fare gốc → bạn lái xa hơn không được trả thêm. App update = fare auto-adjust.",
    tip_advice_vi:
      "Câu 'keeps the fare accurate for both of us' khôn — không nói 'I want more money'. Khách hiểu app fair cho cả hai. ĐỪNG nói 'I won't drive unless you update' — quá đối đầu, dù đúng nguyên tắc.",
  },
  {
    id: "driver_dispute_billing_complaint",
    category: "customer_disputes",
    title_vi: "Khách phàn nàn về phí",
    title_en: "Customer complaining about fare",
    sentences: [
      { en: "I understand — fares can vary based on traffic and demand.", vi: "Em hiểu — fare thay đổi theo kẹt xe và nhu cầu ạ.", pronunciation_focus: ["fares", "demand"] },
      { en: "I don't set the price — Uber calculates it after the ride.", vi: "Em không đặt giá — Uber tính sau chuyến ạ.", pronunciation_focus: ["set", "calculates"] },
      { en: "If you think there's an error, you can dispute it in the app — under 'Help' on this trip.", vi: "Nếu chị nghĩ có lỗi, chị dispute trong app — mục 'Help' trong chuyến ạ.", pronunciation_focus: ["error", "dispute"] },
      { en: "They usually respond within 24 hours.", vi: "Họ thường trả lời trong 24 giờ ạ.", pronunciation_focus: ["respond", "hours"] },
    ],
    cultural_notes_vi:
      "Tài xế KHÔNG set giá — đừng nhận trách nhiệm fare cao. Hướng khách đến app dispute = quy trình chuẩn. Cãi nhau với khách về fare = -1 sao + có thể bị deactivate. App handle dispute fair cho cả hai bên.",
    tip_advice_vi:
      "Câu 'I don't set the price' cứu cánh khi khách giận. Hướng đến process: 'Help' → 'this trip' → 'Review fare'. Khách dispute = Uber tự xử lý — tài xế không bị tính lỗi nếu không vi phạm quy định.",
  },
  {
    id: "driver_dispute_no_show_billed",
    category: "customer_disputes",
    title_vi: "Khách phàn nàn bị tính phí no-show",
    title_en: "Customer disputing a no-show fee",
    sentences: [
      { en: "I waited 6 minutes at the address in the app.", vi: "Em đợi 6 phút tại địa chỉ trong app ạ.", pronunciation_focus: ["waited", "address"] },
      { en: "I sent a text and tried calling.", vi: "Em đã nhắn tin và gọi ạ.", pronunciation_focus: ["text", "calling"] },
      { en: "If you think there's an error, dispute it in the app.", vi: "Nếu chị thấy có lỗi, chị dispute trong app ạ.", pronunciation_focus: ["error", "dispute"] },
      { en: "Sorry we missed each other.", vi: "Tiếc là mình không gặp được ạ.", pronunciation_focus: ["missed"] },
    ],
    cultural_notes_vi:
      "Khách thường gọi sau khi bị tính phí no-show, đòi tài xế hủy phí. KHÔNG hủy phí — bạn đã làm đúng quy trình. Khách dispute trong app — Uber sẽ xem log GPS + tin nhắn của bạn. Quy trình bảo vệ tài xế.",
    tip_advice_vi:
      "Mỗi lần đến: nhắn 'I'm here' + gọi 1 lần khoảng phút 3. Lưu screenshot 5 phút đợi qua app. Nếu Uber hỏi sau, có bằng chứng. Documenting = trust với app = bảo vệ income.",
  },
  {
    id: "driver_dispute_drunk_passenger",
    category: "customer_disputes",
    title_vi: "Khách say xỉn",
    title_en: "Intoxicated passenger",
    sentences: [
      { en: "I'm going to ask you to keep food and drinks closed in the car.", vi: "Em xin chị giữ đồ ăn/uống đóng kín trong xe ạ.", pronunciation_focus: ["keep", "closed"] },
      { en: "If you feel sick, just let me know — I can pull over.", vi: "Nếu chị thấy không khỏe, nói em — em tấp vào lề ạ.", pronunciation_focus: ["sick", "pull over"] },
      { en: "Window's available if you need air.", vi: "Cửa sổ mở được nếu chị cần không khí ạ.", pronunciation_focus: ["window", "air"] },
      { en: "We're about 10 minutes out.", vi: "Còn khoảng 10 phút nữa ạ.", pronunciation_focus: ["minutes", "out"] },
    ],
    cultural_notes_vi:
      "Khách say là rủi ro lớn nhất — nôn trong xe = $150 cleaning fee + xe nghỉ hoạt động vài ngày. KHÔNG từ chối khách say (vi phạm policy), nhưng phòng ngừa: cửa sổ, túi nôn nếu có, tấp vào lề kịp thời.",
    tip_advice_vi:
      "Tài xế đêm khuya nên có: vài túi giấy (nôn), khăn ướt, ghế nylon (dễ lau). Đầu tư $20 = bảo vệ $500+ doanh thu khi rủi ro xảy ra. Tin tốt: app trả $150 cleaning fee cho bạn nếu có ảnh + báo cáo.",
  },
];

// ── 5. Safety / emergency (5) ────────────────────────────────────────────

const SAFETY: DriverLesson[] = [
  {
    id: "driver_safety_911_call",
    category: "safety_emergency",
    title_vi: "Gọi 911 khi sự cố",
    title_en: "Calling 911 in an emergency",
    sentences: [
      { en: "911, what's your emergency?", vi: "(911 hỏi:) 911, sự cố gì ạ?", pronunciation_focus: ["nine-one-one"] },
      { en: "I'm a rideshare driver — I just witnessed a car accident at Main and 5th.", vi: "Em là tài xế rideshare — em vừa thấy tai nạn ở Main và đường 5 ạ.", pronunciation_focus: ["witnessed", "accident"] },
      { en: "Two cars, possible injuries — one driver isn't moving.", vi: "Hai xe, có thể có người bị thương — một tài xế không cử động ạ.", pronunciation_focus: ["injuries", "moving"] },
      { en: "I'm staying on scene until help arrives.", vi: "Em ở hiện trường đến khi cứu hộ đến ạ.", pronunciation_focus: ["staying", "arrives"] },
    ],
    cultural_notes_vi:
      "911 là số khẩn cấp duy nhất ở Mỹ. Operator hỏi 3 thứ: (1) tình huống, (2) địa chỉ, (3) ai bị thương. Trả lời ngắn gọn, rõ ràng. ĐỪNG cúp máy đầu tiên — operator có thể cần info thêm.",
    tip_advice_vi:
      "Học thuộc cách đọc địa chỉ giao lộ: 'Main and 5th' = giao Main Street và 5th Street. Ngắn hơn 'the corner of Main Street and 5th Street'. Nhanh = cứu hộ đến nhanh. Trong stress, câu ngắn hiệu quả nhất.",
  },
  {
    id: "driver_safety_traffic_stop",
    category: "safety_emergency",
    title_vi: "Bị cảnh sát chặn",
    title_en: "Pulled over by police",
    sentences: [
      { en: "Officer, I'm pulling over — putting my hands on the wheel.", vi: "Sĩ quan, em tấp vào lề — em đặt tay trên vô-lăng ạ.", pronunciation_focus: ["officer", "wheel"] },
      { en: "License and registration are in the glovebox — I'm reaching slowly.", vi: "Bằng lái và registration trong hộc xe — em lấy từ từ ạ.", pronunciation_focus: ["registration", "slowly"] },
      { en: "I'm an Uber driver — I have a passenger in the back.", vi: "Em là tài xế Uber — em có khách phía sau ạ.", pronunciation_focus: ["driver", "passenger"] },
      { en: "Yes, sir / Yes, ma'am.", vi: "Vâng ạ / Vâng thưa cô ạ.", pronunciation_focus: ["sir", "ma'am"] },
    ],
    cultural_notes_vi:
      "Cảnh sát Mỹ — quy tắc sống còn: (1) tay trên vô-lăng và NHÌN THẤY, (2) báo trước khi với tay lấy giấy tờ, (3) giọng bình tĩnh, (4) 'sir' / 'ma'am'. KHÔNG xuống xe trừ khi được yêu cầu. KHÔNG tranh cãi — cãi tại lề đường = tệ hơn; cãi tại tòa = đúng cách.",
    tip_advice_vi:
      "Để registration và bảo hiểm ở chỗ DỄ với, không cần cúi sâu. Phát âm 'license and registration' chuẩn /ˈlaɪ.səns ən ˌrɛdʒ.əˈstreɪ.ʃən/. Câu 'I'm reaching slowly' rất quan trọng — báo trước cử động bất ngờ.",
  },
  {
    id: "driver_safety_minor_collision",
    category: "safety_emergency",
    title_vi: "Va chạm nhẹ",
    title_en: "Minor collision",
    sentences: [
      { en: "Hi, are you okay? I'm checking on my passenger.", vi: "Chào, anh/chị có sao không? Em đang kiểm tra khách ạ.", pronunciation_focus: ["okay", "checking"] },
      { en: "Let's exchange insurance and registration.", vi: "Mình trao đổi bảo hiểm và registration ạ.", pronunciation_focus: ["exchange", "insurance"] },
      { en: "I'm taking pictures of both vehicles for the report.", vi: "Em chụp ảnh cả hai xe để báo cáo ạ.", pronunciation_focus: ["pictures", "report"] },
      { en: "I'll need to call this in to Uber as well.", vi: "Em phải báo với Uber nữa ạ.", pronunciation_focus: ["call this in"] },
    ],
    cultural_notes_vi:
      "Va chạm — quy trình: (1) check người trước, (2) gọi 911 nếu thương tích, (3) trao đổi info, (4) chụp ảnh, (5) báo Uber/Lyft trong app. KHÔNG nhận lỗi tại hiện trường — kể cả nếu bạn thấy mình sai. Bảo hiểm xử lý lỗi sau.",
    tip_advice_vi:
      "App có nút 'I was in an accident' — bấm ngay sau khi an toàn. Uber gửi info cho bảo hiểm ride-share của họ. KHÔNG dùng bảo hiểm cá nhân (rẻ hơn nhiều, không cover commercial). Sai loại bảo hiểm = personal policy bị hủy.",
  },
  {
    id: "driver_safety_aggressive_passenger",
    category: "safety_emergency",
    title_vi: "Khách hung hăng",
    title_en: "Aggressive passenger",
    sentences: [
      { en: "I'm going to pull over — I don't feel safe continuing.", vi: "Em tấp vào lề — em không thấy an toàn tiếp tục ạ.", pronunciation_focus: ["pull over", "safe"] },
      { en: "Please step out of the vehicle.", vi: "Anh/chị xuống xe giúp em ạ.", pronunciation_focus: ["step out"] },
      { en: "I'm calling Uber's safety line right now.", vi: "Em đang gọi đường dây an toàn Uber ạ.", pronunciation_focus: ["safety line"] },
      { en: "Once you're out, I'm leaving.", vi: "Anh/chị xuống xong, em đi ạ.", pronunciation_focus: ["once", "leaving"] },
    ],
    cultural_notes_vi:
      "Bạn được phép kết thúc chuyến nếu cảm thấy không an toàn — đó là quyền tài xế. Tấp vào nơi đông (gas station, parking lot có camera) — không vùng vắng. Uber có 24/7 safety line. Báo ngay sau = bảo vệ income.",
    tip_advice_vi:
      "Có dashcam (có ghi tiếng) là đầu tư đáng nhất — $50-150. Trong tranh chấp, dashcam = bằng chứng. Nhiều tài xế bị deactivate vì khách lừa Uber → dashcam khôi phục lại tài khoản. Bật ghi luôn.",
  },
  {
    id: "driver_safety_medical_emergency",
    category: "safety_emergency",
    title_vi: "Khẩn cấp y tế",
    title_en: "Medical emergency in the vehicle",
    sentences: [
      { en: "Hold on — I'm pulling over and calling 911.", vi: "Chị giữ — em tấp vào lề và gọi 911 ạ.", pronunciation_focus: ["hold on", "pulling over"] },
      { en: "Stay with me — help is coming.", vi: "Chị tỉnh táo nhé — cứu hộ đang đến ạ.", pronunciation_focus: ["stay with", "coming"] },
      { en: "(To 911:) Medical emergency — passenger having chest pain — Main and 5th.", vi: "(Gọi 911:) Khẩn cấp y tế — khách đau ngực — Main và đường 5 ạ.", pronunciation_focus: ["chest pain", "Main"] },
      { en: "I'll stay with the passenger until you arrive.", vi: "Em ở với khách đến khi cứu hộ đến ạ.", pronunciation_focus: ["stay", "arrive"] },
    ],
    cultural_notes_vi:
      "Khách lên cơn đột quỵ / đau tim / co giật trong xe — ưu tiên: tấp vào lề + gọi 911 NGAY. KHÔNG tự lái đến bệnh viện (chậm hơn, không có y tá ban đầu). Operator 911 hướng dẫn first aid qua điện thoại.",
    tip_advice_vi:
      "Học 3 cụm khẩn cấp: 'chest pain' (đau ngực), 'difficulty breathing' (khó thở), 'unconscious / not responding' (bất tỉnh). Operator hỏi triệu chứng — cụm chuẩn = giúp họ gửi đúng đội cấp cứu nhanh.",
  },
];

// ── 6. Trucking-specific (10) ────────────────────────────────────────────

const TRUCKING: DriverLesson[] = [
  {
    id: "driver_trucking_dispatch_checkin",
    category: "trucking_specific",
    title_vi: "Báo cáo với dispatch",
    title_en: "Dispatch check-in",
    sentences: [
      { en: "Driver 4471 — I'm loaded and rolling out from the Dallas yard.", vi: "Tài xế 4471 — đã chất hàng và rời kho Dallas ạ.", pronunciation_focus: ["four-four-seven-one", "rolling out"] },
      { en: "ETA Phoenix Saturday 8 AM.", vi: "ETA Phoenix thứ Bảy 8 giờ sáng ạ.", pronunciation_focus: ["ETA", "Saturday"] },
      { en: "Eleven hours of drive time available today.", vi: "Còn 11 giờ lái xe hôm nay ạ.", pronunciation_focus: ["eleven hours", "drive time"] },
      { en: "I'll check in at the next stop.", vi: "Em báo lại ở điểm dừng tiếp ạ.", pronunciation_focus: ["check in", "next stop"] },
    ],
    cultural_notes_vi:
      "Dispatch là người liên lạc chính của trucker. Format check-in: driver number + status + ETA + drive time remaining. Ngắn gọn — dispatch nói chuyện với 50 tài xế. Báo cáo ngắn = chuyên nghiệp.",
    tip_advice_vi:
      "DOT HOS rule: 11 giờ lái + 14 giờ on-duty + 10 giờ off. Báo dispatch hours còn lại để họ plan loads. Nói sai hours = họ assign loads bạn không đủ giờ chạy = phạt + load không xong.",
  },
  {
    id: "driver_trucking_weigh_station",
    category: "trucking_specific",
    title_vi: "Trạm cân (weigh station)",
    title_en: "Weigh station",
    sentences: [
      { en: "Pulling into the weigh station — green light to bypass or red to scale?", vi: "Vào trạm cân — đèn xanh đi tiếp hay đèn đỏ vào cân ạ?", pronunciation_focus: ["weigh station", "bypass"] },
      { en: "Red light — heading to the scale.", vi: "Đèn đỏ — vào cân ạ.", pronunciation_focus: ["red light", "scale"] },
      { en: "All my paperwork is ready — bill of lading, registration, medical card.", vi: "Giấy tờ em sẵn sàng — bill of lading, registration, medical card ạ.", pronunciation_focus: ["bill of lading", "medical card"] },
      { en: "Yes sir, all good — heading out.", vi: "Vâng sĩ quan, mọi thứ ổn — em đi ạ.", pronunciation_focus: ["all good", "heading out"] },
    ],
    cultural_notes_vi:
      "Weigh station check (1) cân tải, (2) HOS log, (3) DOT inspection. Green light bypass — tiếp tục. Red light — vào cân. Lờ đèn đỏ = phạt nặng. Tài xế VN mới hay nhầm — thấy đỏ tưởng dừng đèn giao thông.",
    tip_advice_vi:
      "Học bộ giấy tờ chuẩn: BOL (bill of lading - giấy tờ hàng), CDL (commercial driver's license), medical card, DOT physical, registration, insurance. Để hết trong folder dễ với — DOT inspector kiểm tra nhanh = pass nhanh.",
  },
  {
    id: "driver_trucking_dot_inspection",
    category: "trucking_specific",
    title_vi: "DOT inspection",
    title_en: "DOT inspection",
    sentences: [
      { en: "Good morning, officer — here's my CDL and medical card.", vi: "Chào sĩ quan — đây là CDL và medical card ạ.", pronunciation_focus: ["officer", "CDL"] },
      { en: "Last pre-trip inspection was 6 AM today.", vi: "Pre-trip inspection cuối là 6 giờ sáng nay ạ.", pronunciation_focus: ["pre-trip", "inspection"] },
      { en: "ELD log is up to date.", vi: "ELD log đã cập nhật ạ.", pronunciation_focus: ["ELD log"] },
      { en: "Anything specific you'd like me to demonstrate?", vi: "Có gì cụ thể anh muốn em demo không ạ?", pronunciation_focus: ["specific", "demonstrate"] },
    ],
    cultural_notes_vi:
      "DOT inspection = Level 1-3 tùy trạm. Level 1 (đầy đủ) = 30 phút. Officer kiểm tra: CDL, medical, ELD, brakes, tires, lights. Trả lời rõ + giấy tờ sẵn = pass nhanh. Lúng túng = họ check kỹ hơn.",
    tip_advice_vi:
      "Pre-trip inspection MỖI ngày trước khi lái — 15 phút. Ghi vào DVIR (Driver Vehicle Inspection Report). Officer hỏi 'when's your last inspection?' = phải có thời gian cụ thể. Không có = vi phạm + ghi điểm.",
  },
  {
    id: "driver_trucking_load_pickup",
    category: "trucking_specific",
    title_vi: "Lấy hàng tại shipper",
    title_en: "Picking up a load at the shipper",
    sentences: [
      { en: "Hi, here for load number 88-4471 — bill of lading?", vi: "Chào, em đến lấy load 88-4471 — bill of lading ạ?", pronunciation_focus: ["eight-eight-four-four-seven-one", "bill of lading"] },
      { en: "What dock should I back into?", vi: "Em lùi vào dock nào ạ?", pronunciation_focus: ["dock", "back into"] },
      { en: "I'll check the seal once they're done loading.", vi: "Em kiểm tra seal sau khi họ chất xong ạ.", pronunciation_focus: ["seal", "loading"] },
      { en: "Total weight is 42,500 — that matches my BOL.", vi: "Tổng cân là 42,500 — khớp với BOL em ạ.", pronunciation_focus: ["weight", "BOL"] },
    ],
    cultural_notes_vi:
      "Shipper = nơi lấy hàng. Quy trình: check in office → get dock assignment → back in → wait → check seal + BOL → leave. Đợi 2-4 giờ là bình thường. Quá 2 giờ = detention pay (tiền bồi thường).",
    tip_advice_vi:
      "Đọc số load TỪNG SỐ một: '8-8-4-4-7-1', không '88,471'. Shipper xác nhận nhanh hơn. BOL phải khớp 100% — sai 1 con số = chuyến hàng không hợp pháp. Chụp ảnh BOL + seal trước khi rời.",
  },
  {
    id: "driver_trucking_load_delivery",
    category: "trucking_specific",
    title_vi: "Giao hàng tại receiver",
    title_en: "Delivering at the receiver",
    sentences: [
      { en: "I have a delivery — load 88-4471, scheduled for 2 PM.", vi: "Em giao hàng — load 88-4471, hẹn 2 giờ chiều ạ.", pronunciation_focus: ["delivery", "scheduled"] },
      { en: "Trailer seal is intact — number 9924.", vi: "Seal trailer còn nguyên — số 9924 ạ.", pronunciation_focus: ["seal", "intact"] },
      { en: "Need a signature on the BOL when unloading is done.", vi: "Em cần chữ ký BOL khi dỡ hàng xong ạ.", pronunciation_focus: ["signature", "unloading"] },
      { en: "Any damage notes I should be aware of?", vi: "Có ghi chú hư hỏng nào em nên biết không ạ?", pronunciation_focus: ["damage", "notes"] },
    ],
    cultural_notes_vi:
      "Receiver = nơi giao hàng. Seal phải còn nguyên — vỡ seal = nghi ngờ hàng bị tampered. Báo seal number trước khi mở. Receiver kiểm tra hàng và ký BOL xác nhận. Không có chữ ký = không được trả tiền.",
    tip_advice_vi:
      "Chụp ảnh seal số nguyên TRƯỚC khi mở. Chụp ảnh hàng dỡ ra. Nếu hàng damaged, ghi rõ vào BOL — 'damaged on arrival, photo attached'. Receiver hay đổ lỗi tài xế — bằng chứng bảo vệ bạn.",
  },
  {
    id: "driver_trucking_HOS_violation",
    category: "trucking_specific",
    title_vi: "Hết giờ HOS — phải dừng",
    title_en: "Out of HOS hours — mandatory stop",
    sentences: [
      { en: "Dispatch, I'm out of drive time at the next exit.", vi: "Dispatch ơi, em hết drive time ở exit tiếp ạ.", pronunciation_focus: ["out", "drive time"] },
      { en: "Need to take my 10-hour reset before continuing.", vi: "Em phải reset 10 giờ trước khi đi tiếp ạ.", pronunciation_focus: ["ten-hour", "reset"] },
      { en: "I'll resume tomorrow morning at 6 AM.", vi: "Em chạy lại sáng mai 6 giờ ạ.", pronunciation_focus: ["resume", "morning"] },
      { en: "Truck stop is the Pilot at exit 142.", vi: "Truck stop là Pilot ở exit 142 ạ.", pronunciation_focus: ["truck stop", "exit"] },
    ],
    cultural_notes_vi:
      "DOT HOS không phải gợi ý — là LUẬT. ELD ghi tự động. Vượt 11 giờ = phạt + ghi điểm CDL. 10-hour reset bắt buộc. Dispatch ép bạn chạy quá HOS = báo DOT = công ty bị phạt nặng.",
    tip_advice_vi:
      "Plan reset stop trước 1 giờ — không đợi ELD báo cảnh báo. Truck stop chính: Pilot, Flying J, Loves, TA Petro. Đến muộn = không có chỗ park = phải đi tiếp = vi phạm HOS. Reservation app: TruckPark, Trucker Path.",
  },
  {
    id: "driver_trucking_breakdown",
    category: "trucking_specific",
    title_vi: "Xe hỏng giữa đường",
    title_en: "Breakdown on the road",
    sentences: [
      { en: "Dispatch, I'm broken down at mile marker 287 on I-40.", vi: "Dispatch, em bị hỏng xe ở mile marker 287 trên I-40 ạ.", pronunciation_focus: ["broken down", "mile marker"] },
      { en: "Engine warning light came on — I pulled to the shoulder safely.", vi: "Đèn cảnh báo động cơ — em tấp vào lề an toàn ạ.", pronunciation_focus: ["warning light", "shoulder"] },
      { en: "Triangles are out, hazards on.", vi: "Em đặt biển báo, đèn hazard bật ạ.", pronunciation_focus: ["triangles", "hazards"] },
      { en: "Roadside assistance is on the way — ETA 90 minutes.", vi: "Roadside assistance đang đến — ETA 90 phút ạ.", pronunciation_focus: ["roadside", "ETA"] },
    ],
    cultural_notes_vi:
      "Hỏng xe trucker phải: (1) tấp lề, (2) đặt 3 biển báo phản quang (DOT yêu cầu), (3) bật hazard, (4) gọi dispatch + roadside. KHÔNG ra khỏi cabin nếu không an toàn. Highway shoulder = vùng nguy hiểm — xe khác lao vào lề là chuyện thường.",
    tip_advice_vi:
      "Mile marker (cột mốc dặm) là cách định vị nhanh nhất. Học cụm 'I-40' = Interstate 40, 'I-95' = Interstate 95. Roadside hỏi mile marker là biết exact location. Không biết mile marker = họ tốn 30 phút tìm bạn.",
  },
  {
    id: "driver_trucking_customs_border",
    category: "trucking_specific",
    title_vi: "Qua biên giới (customs)",
    title_en: "Cross-border customs",
    sentences: [
      { en: "Good morning, officer — here are my passport, CDL, and FAST card.", vi: "Chào sĩ quan — đây là hộ chiếu, CDL, và FAST card ạ.", pronunciation_focus: ["passport", "FAST card"] },
      { en: "Load is 22 pallets of auto parts, going to Toronto.", vi: "Hàng là 22 pallet phụ tùng ô tô, đi Toronto ạ.", pronunciation_focus: ["pallets", "auto parts"] },
      { en: "Manifest is in the e-Manifest system.", vi: "Manifest đã trong hệ thống e-Manifest ạ.", pronunciation_focus: ["manifest", "system"] },
      { en: "Nothing personal to declare.", vi: "Em không có hàng cá nhân khai báo ạ.", pronunciation_focus: ["personal", "declare"] },
    ],
    cultural_notes_vi:
      "Cross-border (US/Canada/Mexico) — giấy tờ phức tạp. FAST = Free and Secure Trade card (cho tài xế đăng ký trước, qua nhanh). Không có FAST = đứng dòng dài 2-4 giờ. ACE/ACI manifest phải submit trước khi đến biên giới.",
    tip_advice_vi:
      "Học từ vựng: 'manifest', 'pallet', 'declare', 'pre-clear', 'in-bond'. Officer biên giới hỏi đơn giản — tài xế phải trả lời chính xác + ngắn gọn. Lúng túng = bị secondary inspection (chậm 2-4 giờ).",
  },
  {
    id: "driver_trucking_log_correction",
    category: "trucking_specific",
    title_vi: "Sửa ELD log",
    title_en: "ELD log correction",
    sentences: [
      { en: "I need to add an annotation — I forgot to switch from on-duty to driving at 2 PM.", vi: "Em cần thêm ghi chú — em quên chuyển on-duty sang driving lúc 2 giờ ạ.", pronunciation_focus: ["annotation", "on-duty"] },
      { en: "It was about 15 minutes of fueling.", vi: "Khoảng 15 phút đổ dầu ạ.", pronunciation_focus: ["fifteen", "fueling"] },
      { en: "Submitting the correction now.", vi: "Em submit sửa ngay ạ.", pronunciation_focus: ["submitting", "correction"] },
      { en: "Sorry for the late note.", vi: "Xin lỗi vì ghi chú muộn ạ.", pronunciation_focus: ["sorry", "late"] },
    ],
    cultural_notes_vi:
      "ELD (Electronic Logging Device) ghi tự động status. Sửa được trong 24 giờ với annotation (ghi chú lý do). Sửa sai = falsifying logs = phạt nặng + có thể mất CDL. Annotation phải truthful.",
    tip_advice_vi:
      "Học 4 trạng thái: 'driving', 'on-duty not driving', 'off-duty', 'sleeper berth'. Chuyển status ngay khi thay đổi (đỗ xe = on-duty, ăn = off-duty). Không chuyển = vi phạm + DOT phát hiện qua data analytics.",
  },
  {
    id: "driver_trucking_customer_facility",
    category: "trucking_specific",
    title_vi: "Vào kho khách hàng",
    title_en: "At customer facility",
    sentences: [
      { en: "Hi, I'm here for the 10 AM appointment — load 88-4471.", vi: "Chào, em đến cho hẹn 10 giờ — load 88-4471 ạ.", pronunciation_focus: ["appointment", "load"] },
      { en: "What's the dock assignment?", vi: "Dock được assign là số mấy ạ?", pronunciation_focus: ["dock", "assignment"] },
      { en: "Need to know where the driver bathroom is.", vi: "Cho em biết phòng vệ sinh tài xế ở đâu ạ?", pronunciation_focus: ["bathroom"] },
      { en: "How long do you think unloading will take?", vi: "Dỡ hàng mất khoảng bao lâu ạ?", pronunciation_focus: ["how long", "unloading"] },
    ],
    cultural_notes_vi:
      "Customer facility = kho khách. Mỗi nơi có rule khác: số dock, lobby check-in, bathroom location, no-driver-policy. Hỏi là chuẩn. Chờ trong cabin > đứng ngẫu nhiên (an toàn + lịch sự).",
    tip_advice_vi:
      "Quy tắc 2 giờ free wait time. Trên 2 giờ → detention pay $50-100/giờ. Document timestamp đến → rời. Nhiều tài xế VN không biết detention pay → mất tiền. Hỏi office: 'how should I bill detention if needed?' lịch sự + nhắc nhở quyền của mình.",
  },
];

// ── 7. Multi-passenger (5) ───────────────────────────────────────────────

const MULTI_PASSENGER: DriverLesson[] = [
  {
    id: "driver_multi_pool_pickup_order",
    category: "multi_passenger",
    title_vi: "Đón theo thứ tự pool",
    title_en: "Pool pickup order",
    sentences: [
      { en: "Hi everyone — Sarah is first, then we're picking up Michael at the next stop.", vi: "Chào cả nhà — chị Sarah trước, sau đó đón anh Michael ở điểm tiếp ạ.", pronunciation_focus: ["first", "next stop"] },
      { en: "Drop-offs in the order Uber assigned.", vi: "Drop-off theo thứ tự Uber sắp ạ.", pronunciation_focus: ["drop-offs", "order"] },
      { en: "Should be 25 minutes total.", vi: "Tổng khoảng 25 phút ạ.", pronunciation_focus: ["twenty-five"] },
      { en: "Music low so everyone's comfortable.", vi: "Em vặn nhạc nhỏ cho mọi người thoải mái ạ.", pronunciation_focus: ["music", "comfortable"] },
    ],
    cultural_notes_vi:
      "Pool ride = nhiều khách chia chuyến giá rẻ. Khách đôi khi hỏi 'sao đón người khác' — vì họ chọn pool (rẻ hơn). Giải thích bình tĩnh. Nhiều khách mới không hiểu pool — tài xế dạy luôn.",
    tip_advice_vi:
      "Pool rating khó hơn solo — 4 khách = 4 cơ hội bị 1 sao. Quản lý nhiệt độ, nhạc, quyền chọn. Nói tên + chào riêng từng khách. Đối xử công bằng = nhiều rating 5 sao.",
  },
  {
    id: "driver_multi_group_coordination",
    category: "multi_passenger",
    title_vi: "Nhóm khách đi cùng",
    title_en: "Coordinating a group",
    sentences: [
      { en: "Looks like 4 of you — does everyone fit?", vi: "Hình như có 4 anh chị — đủ chỗ không ạ?", pronunciation_focus: ["four", "fit"] },
      { en: "Two in the back, one shotgun, one middle?", vi: "Hai phía sau, một ghế trước, một ghế giữa ạ?", pronunciation_focus: ["shotgun", "middle"] },
      { en: "Seat belts on, please.", vi: "Mọi người thắt dây an toàn nhé ạ.", pronunciation_focus: ["seat belts"] },
      { en: "All set — heading out.", vi: "Sẵn sàng — em đi ạ.", pronunciation_focus: ["all set", "heading out"] },
    ],
    cultural_notes_vi:
      "Sedan tối đa 4 hành khách + tài xế (Uber X / Lyft). Quá tải = vi phạm bảo hiểm + có thể mất tài khoản. Kiên quyết: 'I can only take 4 — one needs another ride'. KHÔNG nhân nhượng vì pressure.",
    tip_advice_vi:
      "'Shotgun' (ghế trước) là tiếng lóng Mỹ — quan trọng hiểu vì khách dùng tự nhiên. Khách lớn ngồi shotgun, trẻ ngồi sau. Trẻ nhỏ < 4 tuổi cần car seat (luật bang) — nhiều tài xế bị phạt vì không yêu cầu.",
  },
  {
    id: "driver_multi_separate_dropoffs",
    category: "multi_passenger",
    title_vi: "Drop-off ở nhiều nơi",
    title_en: "Multiple drop-offs",
    sentences: [
      { en: "Sarah, you're first — 553 Main, right?", vi: "Sarah, chị xuống trước — 553 Main đúng không ạ?", pronunciation_focus: ["first", "Main"] },
      { en: "Michael, you're next at the airport.", vi: "Michael, anh tiếp theo ở sân bay ạ.", pronunciation_focus: ["next", "airport"] },
      { en: "Sarah, take care — Michael, ETA 18 minutes.", vi: "Sarah giữ gìn — Michael ETA 18 phút ạ.", pronunciation_focus: ["take care", "eighteen"] },
      { en: "Hands free if you need to text or call.", vi: "Hands-free nếu chị anh cần nhắn/gọi ạ.", pronunciation_focus: ["hands free"] },
    ],
    cultural_notes_vi:
      "Đa drop-off — phải nói rõ thứ tự để mỗi khách biết khi nào xuống. Im lặng = khách lo bị quên. Hỏi destination từng người + nói số phút còn lại = chuyên nghiệp.",
    tip_advice_vi:
      "Khi drop-off khách 1, nhanh: 'Take care, have a good one'. KHÔNG kéo dài — khách 2 còn đợi. Khách 2 có thể vội hơn. Quản lý thời gian giữa các khách = senior driver skill.",
  },
  {
    id: "driver_multi_special_needs",
    category: "multi_passenger",
    title_vi: "Khách có nhu cầu đặc biệt",
    title_en: "Riders with special needs",
    sentences: [
      { en: "Need help with the wheelchair?", vi: "Em giúp xe lăn được không ạ?", pronunciation_focus: ["wheelchair"] },
      { en: "Take your time — no rush.", vi: "Chị cứ thư thả — không vội ạ.", pronunciation_focus: ["take", "rush"] },
      { en: "Service animal is welcome.", vi: "Chó dịch vụ được đón ạ.", pronunciation_focus: ["service animal"] },
      { en: "Let me know if you need to stop along the way.", vi: "Cần dừng giữa đường chị nói em ạ.", pronunciation_focus: ["stop", "along"] },
    ],
    cultural_notes_vi:
      "Service animals (chó dịch vụ) BẮT BUỘC được đón theo luật ADA — KHÔNG được từ chối. Từ chối = bị deactivate vĩnh viễn + có thể bị kiện. Service animal khác pet — service animal được training, có vest.",
    tip_advice_vi:
      "ADA là luật liên bang — service animal welcome dù bạn dị ứng hay không. Nếu thật sự dị ứng nặng, mang khẩu trang. Tài xế VN nhiều người không biết luật ADA — học để bảo vệ tài khoản.",
  },
  {
    id: "driver_multi_unaccompanied_minor",
    category: "multi_passenger",
    title_vi: "Khách trẻ dưới tuổi",
    title_en: "Unaccompanied minor (policy)",
    sentences: [
      { en: "I'm sorry — Uber requires riders to be 18 or older without an adult.", vi: "Em xin lỗi — Uber yêu cầu khách đủ 18 tuổi nếu đi một mình ạ.", pronunciation_focus: ["sorry", "eighteen"] },
      { en: "I'll need to cancel and ask the parent to book Uber Teens.", vi: "Em phải hủy và phụ huynh đặt Uber Teens ạ.", pronunciation_focus: ["cancel", "Teens"] },
      { en: "Sorry for the inconvenience.", vi: "Xin lỗi vì bất tiện ạ.", pronunciation_focus: ["inconvenience"] },
      { en: "Stay safe.", vi: "Chúc cháu an toàn ạ.", pronunciation_focus: ["stay safe"] },
    ],
    cultural_notes_vi:
      "Luật Uber: rider phải 18+ trừ khi có Uber Teens (account riêng cho 13-17 tuổi với phụ huynh consent). Đón minor không có teens account = vi phạm + bị deactivate. Lịch sự nhưng dứt khoát.",
    tip_advice_vi:
      "Hỏi tuổi nếu nghi ngờ — 'How old are you?' bình thường ở Mỹ. Phụ huynh hay đặt Uber cho con và bảo 'don't ask, just go'. Đừng nghe — tài xế chịu hậu quả nếu có chuyện. Hủy + giải thích lịch sự.",
  },
];

// ── 8. Tips, ratings, brand voice (5) ────────────────────────────────────

const TIPS_RATINGS: DriverLesson[] = [
  {
    id: "driver_tips_dont_ask",
    category: "tips_ratings_brand",
    title_vi: "Không xin tip trực tiếp",
    title_en: "Never asking for tips",
    sentences: [
      { en: "Hope you have a great rest of your day.", vi: "Chúc chị một ngày tốt lành ạ.", pronunciation_focus: ["great", "day"] },
      { en: "Drive safe out there.", vi: "Chị đi đường cẩn thận ạ.", pronunciation_focus: ["drive safe"] },
      { en: "Thanks for riding with me.", vi: "Cảm ơn chị đã đi cùng em ạ.", pronunciation_focus: ["thanks", "riding"] },
      { en: "Take care.", vi: "Tạm biệt ạ.", pronunciation_focus: ["take care"] },
    ],
    cultural_notes_vi:
      "TUYỆT ĐỐI không hỏi tip. Vi phạm policy Uber — bị deactivate. Tip ở Mỹ là khách tự initiate. Câu 'have a great day' / 'drive safe' = chân thành, không vòi tip = +tip nhỉnh hơn.",
    tip_advice_vi:
      "Quy tắc 'service first, tip second': cung cấp service xuất sắc, khách tự tip. Hỏi = thấy thiếu chuyên nghiệp = tip giảm. Câu cảm ơn ở cuối + giọng ấm = khách nhớ tip trong app sau.",
  },
  {
    id: "driver_tips_acknowledge_tip",
    category: "tips_ratings_brand",
    title_vi: "Khi khách tip cao",
    title_en: "Acknowledging a generous tip",
    sentences: [
      { en: "Thank you so much — that's incredibly generous.", vi: "Cảm ơn chị nhiều — chị thật rộng rãi ạ.", pronunciation_focus: ["incredibly", "generous"] },
      { en: "Really appreciate it.", vi: "Em rất cảm kích ạ.", pronunciation_focus: ["really", "appreciate"] },
      { en: "Drive safely tonight.", vi: "Chị đi đường an toàn tối nay ạ.", pronunciation_focus: ["drive safely"] },
      { en: "Have a wonderful evening.", vi: "Chúc chị buổi tối tuyệt vời ạ.", pronunciation_focus: ["wonderful", "evening"] },
    ],
    cultural_notes_vi:
      "Khách tip $5+ — cảm ơn chân thành. Cảm ơn ngắn = thiếu chú ý. Cảm ơn dài quá = ngại. Sweet spot: 1-2 câu chân thành. Khách tip cao thường rate 5 sao và book lại nếu thấy bạn.",
    tip_advice_vi:
      "'Drive safely tonight' / 'have a wonderful evening' tốt hơn 'thanks bye'. Tin nhắn + lời tạm biệt ấm khiến khách nhớ. Lần sau cùng app → recognize bạn → giữ tip cao.",
  },
  {
    id: "driver_tips_five_star_service",
    category: "tips_ratings_brand",
    title_vi: "5 yếu tố tạo 5-sao",
    title_en: "Five-star service essentials",
    sentences: [
      { en: "Welcome — I'm Tuan. Heading to LAX, right?", vi: "Chào — em là Tuấn. Đi LAX đúng không ạ?", pronunciation_focus: ["welcome", "LAX"] },
      { en: "Water bottle in the cup holder if you'd like.", vi: "Chai nước trong ly đỡ nếu chị thích ạ.", pronunciation_focus: ["water bottle", "cup holder"] },
      { en: "Phone charger available — let me know.", vi: "Sạc điện thoại có sẵn — chị nói em nhé ạ.", pronunciation_focus: ["charger", "available"] },
      { en: "Smooth ride for you. Thanks for choosing Uber.", vi: "Chuyến đi êm cho chị. Cảm ơn đã chọn Uber ạ.", pronunciation_focus: ["smooth", "choosing"] },
    ],
    cultural_notes_vi:
      "5 yếu tố 5-sao: (1) chào tên, (2) xe sạch + thơm, (3) lái êm (không phanh gấp), (4) ấm áp không gắt, (5) chai nước / sạc / kẹo. Đầu tư $20/tháng = ratings cao = surge pricing eligible.",
    tip_advice_vi:
      "Rating math Uber: 4.6 = warning, 4.5 = deactivation possible, 4.8+ = priority for surge / Uber Comfort. Mỗi 1 sao kéo trung bình xuống nhiều — phải có 20 chuyến 5-sao để phục hồi 1 chuyến 1-sao.",
  },
  {
    id: "driver_tips_handle_low_rating_threat",
    category: "tips_ratings_brand",
    title_vi: "Khi khách dọa 1 sao",
    title_en: "When a rider threatens to 1-star",
    sentences: [
      { en: "I hear you — what could I do better?", vi: "Em nghe — em làm sao cho tốt hơn ạ?", pronunciation_focus: ["hear", "better"] },
      { en: "Genuinely want to make this right.", vi: "Em thật sự muốn sửa cho đúng ạ.", pronunciation_focus: ["genuinely", "right"] },
      { en: "If there's something specific, I'll address it.", vi: "Có gì cụ thể em sẽ xử lý ạ.", pronunciation_focus: ["specific", "address"] },
      { en: "I appreciate the feedback.", vi: "Em cảm ơn feedback ạ.", pronunciation_focus: ["appreciate", "feedback"] },
    ],
    cultural_notes_vi:
      "Khách dọa 1-sao → KHÔNG cãi. Hỏi 'what could I do better?' = giảm tension. Đa số khách dọa nhưng cuối cùng cho 4-5 sao nếu thấy tài xế thực sự lắng nghe. Cãi = chắc chắn 1 sao + complaint.",
    tip_advice_vi:
      "Sau khi khách xuống, gọi Uber support qua app báo 'rider threatened me' nếu có tin nhắn / dashcam. Uber có thể bảo vệ ratings của bạn. Đừng để 1 sao không công bằng kéo trung bình xuống.",
  },
  {
    id: "driver_tips_brand_voice_uber",
    category: "tips_ratings_brand",
    title_vi: "Giọng phục vụ chuyên nghiệp",
    title_en: "Professional brand voice",
    sentences: [
      { en: "Welcome aboard — comfortable back there?", vi: "Hoan nghênh lên xe — phía sau thoải mái không ạ?", pronunciation_focus: ["welcome aboard", "comfortable"] },
      { en: "Heading out — settle in.", vi: "Em đi — chị ngồi thoải mái ạ.", pronunciation_focus: ["heading out", "settle"] },
      { en: "Hope the rest of your day goes well.", vi: "Chúc chị phần còn lại của ngày tốt lành ạ.", pronunciation_focus: ["hope", "rest"] },
      { en: "Thanks again for choosing us — drive safe.", vi: "Cảm ơn chị đã chọn — chị đi đường an toàn ạ.", pronunciation_focus: ["choosing", "drive safe"] },
    ],
    cultural_notes_vi:
      "Brand voice 'tài xế chuyên nghiệp' = ấm áp + ngắn gọn + tích cực. KHÔNG quá nồng (như waiter), KHÔNG quá lạnh (như taxi đường phố). 'Welcome aboard' nghe ấm hơn 'get in'. 'Settle in' nghe hơn 'sit down'.",
    tip_advice_vi:
      "Tape 1-2 chuyến của mình (audio only, có thông báo khách trước) → nghe lại. Phát hiện thói quen xấu: 'um', 'yeah', câu cộc. Sửa = brand voice tăng. Nhiều tài xế tự nhận xét xong cải thiện ratings 0.3-0.5 trong 2 tháng.",
  },
];

// ── Aggregate + helpers ──────────────────────────────────────────────────

export const DRIVER_LESSONS: ReadonlyArray<DriverLesson> = [
  ...PICKUP,
  ...IN_TRIP,
  ...NAVIGATION,
  ...DISPUTES,
  ...SAFETY,
  ...TRUCKING,
  ...MULTI_PASSENGER,
  ...TIPS_RATINGS,
];

export function getLessonsByCategory(
  category: DriverCategoryId,
): DriverLesson[] {
  return DRIVER_LESSONS.filter((l) => l.category === category);
}

export function getLessonById(id: string): DriverLesson | undefined {
  return DRIVER_LESSONS.find((l) => l.id === id);
}

/** Pack-level metadata, mirroring the other profession packs. */
export const DRIVER_PACK = Object.freeze({
  slug: "drivers",
  title_vi: "Tiếng Anh dành cho tài xế",
  title_en: "English for drivers",
  intro_vi:
    "Tiếng Anh thực tế cho tài xế Uber/Lyft, giao đồ ăn (DoorDash, Uber Eats, Instacart), và tài xế xe tải đường dài. Made by người Việt — học cách giao tiếp với khách Mỹ, xử lý sự cố trên đường, qua trạm cân, và giữ rating 4.8+. 50 bài tập trung vào những tình huống thật trên đường.",
});

export default DRIVER_PACK;
