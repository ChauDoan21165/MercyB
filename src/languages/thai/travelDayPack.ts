// src/languages/thai/travelDayPack.ts
//
// Thai TRAVEL-DAY PACK — one compact reference for a whole day on the
// ground: airport, immigration, taxi, hotel, food, shopping, transit,
// money, emergencies, directions, SIM/phone, and small talk (Wave 4).
//
// PURE DATA. Each item is a self-contained card built for both a
// Vietnamese-speaking learner (primary) and an English-speaking learner
// (secondary). Every item carries:
//   • scenario_vi / scenario_en — when you'd use it
//   • phrase     (th + rtgs + vi + en) — the line to say
//   • backup     (backup_th + backup_rtgs + backup_vi + backup_en) — plan B
//   • show_card_th — a full Thai line to SHOW on-screen to a local
//   • mistake_vi / mistake_en — the common mistake to avoid
//
// SCOPE: language support ONLY — no legal or medical advice. Emergency
// items just route you to the right help (191 police, 1669 medical,
// 199 fire, 1155 tourist police).
//
// Items are assembled from compact source tuples by the pure `build()`
// transform (NOT a runtime engine), keeping the file readable while still
// emitting fully-shaped objects.
//
// Native review DEFERRED: romanization/tone marks are a readable
// approximation, not a linguist-verified transcription. Not native-reviewed.

// ── Types ────────────────────────────────────────────────────────────────

export type ThaiTravelCategory =
  | "airport"
  | "immigration"
  | "taxi"
  | "hotel"
  | "food"
  | "shopping"
  | "transport"
  | "money"
  | "emergency"
  | "directions"
  | "sim_phone"
  | "small_talk";

export type ThaiTravelItem = {
  /** Stable unique id, e.g. "thai-travel-001". */
  id: string;
  category: ThaiTravelCategory;
  /** When to use this — Vietnamese. */
  scenario_vi: string;
  /** When to use this — English. */
  scenario_en: string;
  /** Main phrase — Thai script. */
  th: string;
  /** Main phrase — romanization. */
  rtgs: string;
  /** Main phrase — Vietnamese meaning. */
  vi: string;
  /** Main phrase — English meaning. */
  en: string;
  /** Backup phrase — Thai script. */
  backup_th: string;
  /** Backup phrase — romanization. */
  backup_rtgs: string;
  /** Backup phrase — Vietnamese meaning. */
  backup_vi: string;
  /** Backup phrase — English meaning. */
  backup_en: string;
  /** Full Thai line to SHOW to a local. */
  show_card_th: string;
  /** Common mistake to avoid — Vietnamese. */
  mistake_vi: string;
  /** Common mistake to avoid — English. */
  mistake_en: string;
};

// ── Source tuple + builder (pure data transform) ─────────────────────────

/**
 * [scenario_vi, scenario_en, th, rtgs, vi, en,
 *  backup_th, backup_rtgs, backup_vi, backup_en,
 *  show_card_th, mistake_vi, mistake_en]
 */
type Entry = readonly [
  string, string,
  string, string, string, string,
  string, string, string, string,
  string,
  string, string,
];

let ITEM_SEQ = 0;

function build(category: ThaiTravelCategory, entries: readonly Entry[]): ThaiTravelItem[] {
  return entries.map((e) => {
    ITEM_SEQ += 1;
    return {
      id: `thai-travel-${String(ITEM_SEQ).padStart(3, "0")}`,
      category,
      scenario_vi: e[0],
      scenario_en: e[1],
      th: e[2],
      rtgs: e[3],
      vi: e[4],
      en: e[5],
      backup_th: e[6],
      backup_rtgs: e[7],
      backup_vi: e[8],
      backup_en: e[9],
      show_card_th: e[10],
      mistake_vi: e[11],
      mistake_en: e[12],
    };
  });
}

// ── Source data ──────────────────────────────────────────────────────────

const AIRPORT: Entry[] = [
  [
    "Tìm quầy check-in", "Finding your check-in counter",
    "เคาน์เตอร์เช็คอินอยู่ที่ไหนครับ/คะ", "khao-tə̂ə chék-in yùu thîi-nǎi khráp/khá", "Quầy check-in ở đâu?", "Where is the check-in counter?",
    "สายการบิน ... เช็คอินที่ไหน", "sǎai-gaan-bin ... chék-in thîi-nǎi", "Hãng ... check-in ở đâu?", "Where does airline ... check in?",
    "ผม/ฉันหาเคาน์เตอร์เช็คอินสายการบิน ... ช่วยชี้ทางหน่อยครับ/ค่ะ",
    "Đừng bỏ ครับ/ค่ะ cuối câu — nghe cộc lốc.", "Don't drop the polite ครับ/ค่ะ — it sounds blunt.",
  ],
  [
    "Tìm cửa lên máy bay", "Finding the boarding gate",
    "ประตูขึ้นเครื่องอยู่ที่ไหนครับ/คะ", "prà-tuu khʉ̂n khrʉ̂ang yùu thîi-nǎi khráp/khá", "Cổng lên máy bay ở đâu?", "Where is the boarding gate?",
    "เกตหมายเลข ... ไปทางไหน", "gèet mǎai-lêek ... pai thaang-nǎi", "Cổng số ... đi hướng nào?", "Which way to gate number ...?",
    "ผม/ฉันต้องไปขึ้นเครื่องที่เกต ... ช่วยบอกทางหน่อยครับ/ค่ะ",
    "Người Thái hiểu cả 'ประตู' lẫn từ mượn 'เกต'.", "Thais use both ประตู and the loanword 'gate'.",
  ],
  [
    "Tìm băng chuyền hành lý", "Finding baggage claim",
    "สายพานรับกระเป๋าอยู่ที่ไหนครับ/คะ", "sǎai-phaan ráp grà-pǎo yùu thîi-nǎi khráp/khá", "Băng chuyền hành lý ở đâu?", "Where is the baggage claim?",
    "กระเป๋าของผม/ฉันยังไม่มา", "grà-pǎo khǎwng phǒm/chǎn yang mâi maa", "Hành lý của tôi chưa ra.", "My luggage hasn't come out yet.",
    "เที่ยวบิน ... กระเป๋ายังไม่ออกที่สายพาน ช่วยตรวจสอบให้หน่อยครับ/ค่ะ",
    "Đừng nhầm กระเป๋า (vali) với กระเป๋าเงิน (ví).", "กระเป๋า is bag/luggage; add เงิน for wallet.",
  ],
  [
    "Báo thất lạc hành lý", "Reporting lost luggage",
    "กระเป๋าของผม/ฉันหาย ขอแจ้งหน่อยครับ/ค่ะ", "grà-pǎo khǎwng phǒm/chǎn hǎai khǎw jâeng nòi khráp/khâ", "Hành lý của tôi bị mất, tôi muốn báo.", "My bag is missing — I'd like to report it.",
    "นี่คือใบรับกระเป๋า", "nîi khʉʉ bai ráp grà-pǎo", "Đây là phiếu hành lý.", "Here is my baggage tag.",
    "เที่ยวบิน ... กระเป๋าไม่มาที่สายพาน ขอแจ้งกระเป๋าหายและกรอกเอกสารครับ/ค่ะ",
    "Giữ cuống vé hành lý — nhân viên cần số tag.", "Keep your baggage tag — staff need the tag number.",
  ],
  [
    "Hỏi wifi sân bay", "Asking about airport wifi",
    "ที่นี่มีไวไฟฟรีไหมครับ/คะ", "thîi-nîi mii wai-fai free mǎi khráp/khá", "Ở đây có wifi miễn phí không?", "Is there free wifi here?",
    "ขอรหัสไวไฟหน่อยครับ/ค่ะ", "khǎw rá-hàt wai-fai nòi khráp/khâ", "Cho xin mật khẩu wifi.", "Can I have the wifi password?",
    "ขอข้อมูลไวไฟสนามบินและทางไปจุดรับแท็กซี่ครับ/ค่ะ",
    "'ฟรี' và 'ไวไฟ' là từ mượn — đọc như tiếng Anh được.", "'ฟรี' (free) and 'ไวไฟ' (wifi) are loanwords.",
  ],
  [
    "Tìm nhà vệ sinh sân bay", "Finding the airport toilet",
    "ห้องน้ำอยู่ที่ไหนครับ/คะ", "hâwng-náam yùu thîi-nǎi khráp/khá", "Nhà vệ sinh ở đâu?", "Where is the toilet?",
    "ที่ใกล้ที่สุดอยู่ตรงไหน", "thîi glâi thîi-sùt yùu trong-nǎi", "Cái gần nhất ở chỗ nào?", "Where is the nearest one?",
    "ขอโทษครับ/ค่ะ ห้องน้ำที่ใกล้ที่สุดอยู่ทางไหน",
    "ห้องน้ำ nghĩa đen 'phòng nước' = toilet.", "ห้องน้ำ literally 'water room' = toilet.",
  ],
];

const IMMIGRATION: Entry[] = [
  [
    "Khai mục đích nhập cảnh", "Stating your purpose of visit",
    "ผม/ฉันมาเที่ยวครับ/ค่ะ", "phǒm/chǎn maa thîao khráp/khâ", "Tôi đến du lịch.", "I'm here as a tourist.",
    "ผม/ฉันมาทำงาน", "phǒm/chǎn maa tham-ngaan", "Tôi đến làm việc.", "I'm here for work.",
    "ผม/ฉันมาเที่ยวประเทศไทย จะอยู่ ... วันครับ/ค่ะ",
    "Du lịch nói 'มาเที่ยว'; nói 'làm việc' khi không có work permit dễ rắc rối.", "Say มาเที่ยว for tourism; don't claim work without a permit.",
  ],
  [
    "Nói thời gian lưu trú", "Stating how long you'll stay",
    "ผม/ฉันจะอยู่ ... วัน", "phǒm/chǎn jà yùu ... wan", "Tôi sẽ ở ... ngày.", "I'll stay ... days.",
    "ผม/ฉันจะกลับวันที่ ...", "phǒm/chǎn jà glàp wan-thîi ...", "Tôi về ngày ...", "I'll leave on ...",
    "ผม/ฉันจะอยู่ ... วัน แล้วบินกลับ นี่ตั๋วขากลับครับ/ค่ะ",
    "'จะ' đứng trước động từ để chỉ tương lai.", "จะ marks the future and goes before the verb.",
  ],
  [
    "Nói nơi lưu trú", "Stating where you're staying",
    "ผม/ฉันพักที่โรงแรม ...", "phǒm/chǎn phák thîi rohng-raem ...", "Tôi ở khách sạn ...", "I'm staying at ... hotel.",
    "นี่คือที่อยู่ที่พัก", "nîi khʉʉ thîi-yùu thîi-phák", "Đây là địa chỉ chỗ ở.", "Here's my accommodation address.",
    "ผม/ฉันพักที่ ... นี่คือที่อยู่และใบจองโรงแรมครับ/ค่ะ",
    "Chuẩn bị sẵn địa chỉ in ra (Thái/English).", "Have your address ready in Thai/English.",
  ],
  [
    "Xuất trình vé khứ hồi", "Showing your return ticket",
    "นี่ตั๋วเครื่องบินขากลับครับ/ค่ะ", "nîi tǔa khrʉ̂ang-bin khǎa-glàp khráp/khâ", "Đây là vé máy bay khứ hồi.", "Here's my return ticket.",
    "ผม/ฉันมีตั๋วไป ... ต่อ", "phǒm/chǎn mii tǔa pai ... tàw", "Tôi có vé bay tiếp đi ...", "I have an onward ticket to ...",
    "นี่ตั๋วขากลับและกำหนดการเดินทางของผม/ฉันครับ/ค่ะ",
    "'ขากลับ' = chiều về; 'ขาไป' = chiều đi.", "ขากลับ = return leg; ขาไป = outbound leg.",
  ],
  [
    "Qua hải quan", "Going through customs",
    "ผม/ฉันไม่มีของต้องสำแดง", "phǒm/chǎn mâi mii khǎwng tâwng sǎm-daeng", "Tôi không có gì phải khai báo.", "I have nothing to declare.",
    "มีแค่ของใช้ส่วนตัว", "mii khâe khǎwng-chái sùan-tua", "Chỉ có đồ dùng cá nhân.", "Just personal belongings.",
    "ผม/ฉันมีแค่ของใช้ส่วนตัว ไม่มีของต้องเสียภาษีครับ/ค่ะ",
    "Đừng mang quá định mức rượu/thuốc lá miễn thuế.", "Don't exceed duty-free alcohol/tobacco limits.",
  ],
  [
    "Trả lời về visa", "Answering about your visa",
    "วีซ่าของผม/ฉันอยู่ที่นี่ครับ/ค่ะ", "wii-sâa khǎwng phǒm/chǎn yùu thîi-nîi khráp/khâ", "Visa của tôi ở đây.", "My visa is right here.",
    "ผม/ฉันได้รับยกเว้นวีซ่า", "phǒm/chǎn dâai-ráp yók-wén wii-sâa", "Tôi được miễn visa.", "I'm visa-exempt.",
    "นี่หนังสือเดินทางและวีซ่า/สิทธิ์ยกเว้นวีซ่าของผม/ฉันครับ/ค่ะ",
    "Người Việt thường được miễn visa du lịch ngắn ngày — kiểm tra trước.", "Vietnamese often get visa-exempt short stays — check first.",
  ],
];

const TAXI: Entry[] = [
  [
    "Đưa địa chỉ cho tài xế", "Giving the driver an address",
    "ไปที่อยู่นี้ครับ/ค่ะ", "pai thîi-yùu níi khráp/khâ", "Đi tới địa chỉ này.", "To this address, please.",
    "ตามแผนที่ในมือถือ", "taam phǎen-thîi nai mʉʉ-thʉ̌ʉ", "Theo bản đồ trên điện thoại.", "Follow the map on my phone.",
    "กรุณาพาไปที่อยู่นี้ (แสดงบนจอ) และเปิดมิเตอร์ด้วยครับ/ค่ะ",
    "Luôn xin 'เปิดมิเตอร์'; tránh giá khoán.", "Always ask for the meter; avoid flat fares.",
  ],
  [
    "Yêu cầu chạy đồng hồ", "Asking for the meter",
    "เปิดมิเตอร์ด้วยครับ/ค่ะ", "pə̀ət mí-tə̂ə dûay khráp/khâ", "Bật đồng hồ giúp tôi.", "Use the meter, please.",
    "ขอแบบมิเตอร์ ไม่เหมา", "khǎw bàep mí-tə̂ə, mâi mǎo", "Tính theo đồng hồ, không khoán.", "Meter, not a flat rate.",
    "กรุณาเปิดมิเตอร์ ผม/ฉันไม่เอาแบบเหมาราคาครับ/ค่ะ",
    "'เหมา' = giá khoán; nói 'ไม่เหมา' để từ chối.", "เหมา = flat rate; say ไม่เหมา to refuse it.",
  ],
  [
    "Hỏi mất bao lâu", "Asking how long it takes",
    "ใช้เวลานานไหมครับ/คะ", "chái wee-laa naan mǎi khráp/khá", "Mất bao lâu?", "Does it take long?",
    "ถึงกี่โมงครับ/คะ", "thʉ̌ng gìi moong khráp/khá", "Tới lúc mấy giờ?", "What time will we arrive?",
    "ไป ... ใช้เวลาประมาณเท่าไหร่ครับ/คะ",
    "'นาน' = lâu (thời gian), khác 'ไกล' = xa (khoảng cách).", "นาน = a long time; ไกล = far in distance.",
  ],
  [
    "Yêu cầu dừng xe", "Asking the driver to stop",
    "จอดตรงนี้ครับ/ค่ะ", "jàwt trong-níi khráp/khâ", "Dừng ở đây.", "Stop here, please.",
    "เลยไปอีกนิด", "ləəi pai ìik nít", "Đi quá lên chút nữa.", "A little further, please.",
    "จอดตรงนี้ได้เลยครับ/ค่ะ ขอบคุณ",
    "Taxi dùng 'จอด' (đỗ/tấp vào), không phải 'หยุด'.", "Use จอด (pull over) for taxis, not หยุด.",
  ],
  [
    "Hỏi giá đi sân bay", "Asking the fare to the airport",
    "ไปสนามบินเท่าไหร่ครับ/คะ", "pai sà-nǎam-bin thâo-rài khráp/khá", "Đi sân bay bao nhiêu?", "How much to the airport?",
    "มีค่าทางด่วนไหม", "mii khâa thaang-dùan mǎi", "Có phí cao tốc không?", "Is there a tollway fee?",
    "ไปสนามบินสุวรรณภูมิ คิดมิเตอร์บวกค่าทางด่วนใช่ไหมครับ/คะ",
    "Phí cao tốc 'ทางด่วน' khách thường trả thêm — bình thường.", "Tollway fees are normally paid by the passenger.",
  ],
  [
    "Xin hóa đơn", "Asking for a receipt",
    "ขอใบเสร็จด้วยครับ/ค่ะ", "khǎw bai-sèt dûay khráp/khâ", "Cho xin hóa đơn.", "A receipt, please.",
    "ขอบิลค่าโดยสาร", "khǎw bin khâa-dooi-sǎan", "Cho xin biên lai tiền xe.", "Can I get a fare receipt?",
    "ขอใบเสร็จค่าแท็กซี่ด้วยครับ/ค่ะ",
    "'ใบเสร็จ' = hóa đơn/biên lai.", "ใบเสร็จ = receipt.",
  ],
];

const HOTEL: Entry[] = [
  [
    "Nhận phòng theo đặt trước", "Checking in with a booking",
    "ผม/ฉันจองห้องไว้ในชื่อ ...", "phǒm/chǎn jawng hâwng wái nai chʉ̂ʉ ...", "Tôi đặt phòng tên ...", "I have a booking under the name ...",
    "นี่คือใบยืนยันการจอง", "nîi khʉʉ bai yʉʉn-yan gaan-jawng", "Đây là xác nhận đặt phòng.", "Here's my booking confirmation.",
    "ผม/ฉันจองห้องไว้ในชื่อ ... ขอเช็คอินครับ/ค่ะ",
    "'จอง' (đặt trước) khác 'ซื้อ' (mua).", "จอง = reserve, not ซื้อ (buy).",
  ],
  [
    "Hỏi giờ trả phòng", "Asking about checkout time",
    "เช็คเอาท์กี่โมงครับ/คะ", "chék-áo gìi moong khráp/khá", "Mấy giờ trả phòng?", "What time is checkout?",
    "ขอเช็คเอาท์สายได้ไหม", "khǎw chék-áo sǎai dâi mǎi", "Trả phòng muộn được không?", "Can I check out late?",
    "เช็คเอาท์กี่โมง และฝากกระเป๋าหลังเช็คเอาท์ได้ไหมครับ/คะ",
    "'สาย' = muộn/trễ (về giờ giấc).", "สาย = late (for time).",
  ],
  [
    "Báo sự cố trong phòng", "Reporting a room problem",
    "แอร์ในห้องเสียครับ/ค่ะ", "ae nai hâwng sǐa khráp/khâ", "Điều hòa trong phòng hỏng.", "The air-con in the room is broken.",
    "ขอเปลี่ยนห้องได้ไหม", "khǎw plìan hâwng dâi mǎi", "Đổi phòng được không?", "Can I change rooms?",
    "แอร์และน้ำอุ่นในห้องเสีย ขอช่างมาซ่อมหรือเปลี่ยนห้องครับ/ค่ะ",
    "'เสีย' dùng cho mọi thiết bị hỏng.", "เสีย = broken, for any device.",
  ],
  [
    "Ở thêm một đêm", "Asking to stay an extra night",
    "ขอพักเพิ่มอีกหนึ่งคืน", "khǎw phák phə̂əm ìik nʉ̀ng khʉʉn", "Tôi muốn ở thêm một đêm.", "I'd like one more night.",
    "ห้องว่างไหมพรุ่งนี้", "hâwng wâang mǎi phrûng-níi", "Mai còn phòng trống không?", "Any rooms free tomorrow?",
    "ขอต่อห้องอีกหนึ่งคืน คิดราคาเท่าไหร่ครับ/คะ",
    "Đếm đêm bằng 'คืน'.", "Count nights with คืน (khʉʉn).",
  ],
  [
    "Hỏi mật khẩu wifi", "Asking for the wifi password",
    "ขอรหัสไวไฟหน่อยครับ/ค่ะ", "khǎw rá-hàt wai-fai nòi khráp/khâ", "Cho xin mật khẩu wifi.", "Can I have the wifi password?",
    "เน็ตใช้ไม่ได้", "nét chái mâi dâi", "Mạng không vào được.", "The internet isn't working.",
    "ขอรหัสไวไฟ และช่วยเช็คเน็ตในห้องให้หน่อยครับ/ค่ะ",
    "'รหัส' = mật khẩu/mã.", "รหัส = password/code.",
  ],
  [
    "Nhờ gọi taxi", "Asking them to call a taxi",
    "ช่วยเรียกแท็กซี่ให้หน่อยครับ/ค่ะ", "chûay rîak tháek-sîi hâi nòi khráp/khâ", "Gọi taxi giúp tôi.", "Please call me a taxi.",
    "พรุ่งนี้เช้า ... โมง", "phrûng-níi cháo ... moong", "Sáng mai lúc ... giờ.", "Tomorrow morning at ... o'clock.",
    "ช่วยเรียกแท็กซี่ไปสนามบินพรุ่งนี้ตอน ... โมงครับ/ค่ะ",
    "Giờ buổi sáng dùng 'โมงเช้า'.", "Morning hours use โมงเช้า.",
  ],
];

const FOOD: Entry[] = [
  [
    "Xin thực đơn / gợi ý", "Asking for the menu / a recommendation",
    "ขอเมนูหน่อยครับ/ค่ะ", "khǎw mee-nuu nòi khráp/khâ", "Cho xem thực đơn.", "Menu, please.",
    "มีอะไรแนะนำไหม", "mii à-rai náe-nam mǎi", "Có món gì nên thử không?", "Any recommendations?",
    "ขอเมนู และช่วยแนะนำเมนูไม่เผ็ดให้หน่อยครับ/ค่ะ",
    "Đừng quên nói độ cay; đồ Thái mặc định cay.", "Always state spice; Thai food defaults to spicy.",
  ],
  [
    "Yêu cầu không cay", "Asking for not spicy",
    "ไม่เผ็ดนะครับ/คะ", "mâi phèt ná khráp/khá", "Không cay nhé.", "Not spicy, please.",
    "เผ็ดน้อยได้ไหม", "phèt nói dâi mǎi", "Cay ít được không?", "A little spicy is okay?",
    "กรุณาทำไม่เผ็ด ผม/ฉันกินเผ็ดไม่ได้ครับ/ค่ะ",
    "'เผ็ด' = cay (ớt), khác 'ร้อน' = nóng (nhiệt độ).", "เผ็ด = chili-spicy; ร้อน = hot temperature.",
  ],
  [
    "Báo dị ứng", "Flagging an allergy",
    "ผม/ฉันแพ้ ...", "phǒm/chǎn pháe ...", "Tôi dị ứng ...", "I'm allergic to ...",
    "ห้ามใส่ถั่ว/กุ้ง", "hâam sài thùa/gûng", "Đừng cho đậu phộng/tôm.", "No peanuts/shrimp.",
    "ผม/ฉันแพ้อาหารทะเลและถั่ว ห้ามใส่เด็ดขาดครับ/ค่ะ",
    "'ห้ามใส่' mạnh và rõ hơn 'ไม่เอา'.", "ห้ามใส่ (don't add) is firmer than ไม่เอา.",
  ],
  [
    "Gọi món chay", "Ordering vegetarian",
    "ผม/ฉันกินมังสวิรัติ", "phǒm/chǎn gin mang-sà-wí-rát", "Tôi ăn chay.", "I'm vegetarian.",
    "ผม/ฉันกินเจ", "phǒm/chǎn gin jay", "Tôi ăn chay trường (không trứng/hành).", "I eat 'jay' (stricter vegan).",
    "ผม/ฉันกินมังสวิรัติ ไม่กินเนื้อสัตว์ทุกชนิดครับ/ค่ะ",
    "'เจ' nghiêm hơn 'มังสวิรัติ' (không trứng, hành, tỏi).", "เจ is stricter than มังสวิรัติ (no egg/onion/garlic).",
  ],
  [
    "Tính tiền", "Asking for the bill",
    "เก็บเงินด้วยครับ/ค่ะ", "gèp ngən dûay khráp/khâ", "Tính tiền.", "The bill, please.",
    "คิดเงินด้วย", "khít ngən dûay", "Tính tiền giúp.", "Check, please.",
    "เก็บเงินด้วยครับ/ค่ะ รับบัตรไหม",
    "'เก็บเงิน' và 'คิดเงิน' đều = tính tiền.", "Both เก็บเงิน and คิดเงิน mean 'the bill'.",
  ],
  [
    "Gọi mang về", "Ordering takeaway",
    "ขอใส่กล่องกลับบ้านครับ/ค่ะ", "khǎw sài glàwng glàp bâan khráp/khâ", "Cho mang về.", "To take away, please.",
    "ห่อกลับได้ไหม", "hàw glàp dâi mǎi", "Gói mang về được không?", "Can I get it to go?",
    "ขออาหารใส่กล่องกลับบ้านครับ/ค่ะ",
    "'ใส่กล่อง/ห่อกลับ' = mang về.", "ใส่กล่อง / ห่อกลับ = takeaway.",
  ],
];

const SHOPPING: Entry[] = [
  [
    "Hỏi giá", "Asking the price",
    "อันนี้เท่าไหร่ครับ/คะ", "an-níi thâo-rài khráp/khá", "Cái này bao nhiêu?", "How much is this?",
    "ราคาเท่าไหร่", "raa-khaa thâo-rài", "Giá bao nhiêu?", "What's the price?",
    "อันนี้ราคาเท่าไหร่ครับ/คะ",
    "Dùng lượng từ 'อัน' cho vật nhỏ.", "อัน is the generic classifier for small items.",
  ],
  [
    "Trả giá", "Bargaining",
    "แพงไป ลดได้ไหมครับ/คะ", "phaeng pai, lót dâi mǎi khráp/khá", "Đắt quá, giảm được không?", "Too expensive — can you discount?",
    "ลดหน่อยได้ไหม", "lót nòi dâi mǎi", "Bớt chút được không?", "Can you lower it a bit?",
    "แพงไปครับ/ค่ะ ลดได้ไหม ผม/ฉันซื้อหลายชิ้น",
    "Trả giá ở chợ thì OK, trong mall thì không.", "Bargain at markets, not in malls.",
  ],
  [
    "Xin cỡ / màu khác", "Asking for another size / colour",
    "มีไซส์อื่นไหมครับ/คะ", "mii sai ʉ̀ʉn mǎi khráp/khá", "Có cỡ khác không?", "Do you have another size?",
    "มีสีอื่นไหม", "mii sǐi ʉ̀ʉn mǎi", "Có màu khác không?", "Another colour?",
    "ขอลองไซส์ใหญ่กว่านี้หรือสีอื่นได้ไหมครับ/คะ",
    "'ไซส์' là từ mượn 'size'.", "ไซส์ is the loanword 'size'.",
  ],
  [
    "Chỉ xem thôi", "Just browsing",
    "ขอดูก่อนนะครับ/คะ", "khǎw duu gàwn ná khráp/khá", "Cho xem trước đã.", "Just looking, thanks.",
    "ยังไม่เอาตอนนี้", "yang mâi ao tawn-níi", "Chưa lấy bây giờ.", "Not right now, thanks.",
    "ขอดูก่อน ถ้าสนใจจะเรียกนะครับ/คะ",
    "'ดูก่อน' là cách lịch sự để từ chối nhẹ.", "ดูก่อน politely means 'just browsing'.",
  ],
  [
    "Hỏi cách thanh toán", "Asking how to pay",
    "รับบัตรไหมครับ/คะ", "ráp bàt mǎi khráp/khá", "Có nhận thẻ không?", "Do you take cards?",
    "จ่ายพร้อมเพย์ได้ไหม", "jàai phrɔ́ɔm-pee dâi mǎi", "Trả bằng PromptPay được không?", "Can I pay by PromptPay?",
    "รับบัตรเครดิตหรือพร้อมเพย์ไหมครับ/คะ",
    "Nhiều nơi chỉ tiền mặt; PromptPay (QR) phổ biến.", "Many places are cash-only; PromptPay (QR) is common.",
  ],
  [
    "Xin túi", "Asking for a bag",
    "ขอถุงด้วยครับ/ค่ะ", "khǎw thǔng dûay khráp/khâ", "Cho xin túi.", "A bag, please.",
    "ไม่เอาถุง", "mâi ao thǔng", "Không cần túi.", "No bag needed.",
    "ขอถุงหนึ่งใบครับ/ค่ะ",
    "Thái thường tính phí túi nilon; mang túi riêng.", "Plastic bags often cost extra — bring your own.",
  ],
];

const TRANSPORT: Entry[] = [
  [
    "Mua vé / nạp thẻ", "Buying a ticket / topping up a card",
    "ขอตั๋วไป ... หนึ่งใบครับ/ค่ะ", "khǎw tǔa pai ... nʉ̀ng bai khráp/khâ", "Cho một vé đi ...", "One ticket to ..., please.",
    "เติมเงินในบัตรหน่อย", "təəm ngən nai bàt nòi", "Nạp tiền vào thẻ.", "Top up my card, please.",
    "ขอตั๋วหรือเติมเงินไปสถานี ... ครับ/ค่ะ",
    "Lượng từ vé là 'ใบ'.", "The classifier for tickets is ใบ.",
  ],
  [
    "Hỏi tuyến nào", "Asking which line",
    "ไป ... นั่งสายไหนครับ/คะ", "pai ... nâng sǎai-nǎi khráp/khá", "Đi ... đi tuyến nào?", "Which line goes to ...?",
    "ต้องเปลี่ยนสายไหม", "tâwng plìan sǎai mǎi", "Có phải đổi tuyến không?", "Do I need to change lines?",
    "ผม/ฉันจะไป ... ต้องนั่งสายอะไรและเปลี่ยนที่ไหนครับ/คะ",
    "'สาย' = tuyến (line).", "สาย = route/line.",
  ],
  [
    "Hỏi cửa ra", "Asking which exit",
    "ออกทางออกไหนครับ/คะ", "àwk thaang-àwk nǎi khráp/khá", "Ra cửa nào?", "Which exit do I take?",
    "ทางออกที่ใกล้ ...", "thaang-àwk thîi glâi ...", "Cửa gần ... nhất.", "The exit nearest to ...",
    "ไป ... ต้องออกทางออกหมายเลขอะไรครับ/คะ",
    "BTS có nhiều cửa ra đánh số.", "BTS exits are numbered — note the number.",
  ],
  [
    "Hỏi xuống ga nào", "Asking where to get off",
    "ลงสถานีไหนครับ/คะ", "long sà-thǎa-nii nǎi khráp/khá", "Xuống ga nào?", "Which station do I get off at?",
    "ช่วยบอกผม/ฉันด้วยเมื่อถึง", "chûay bàwk phǒm/chǎn dûay mʉ̂a thʉ̌ng", "Báo tôi khi tới nơi.", "Please tell me when we arrive.",
    "ผม/ฉันจะไป ... ช่วยบอกว่าต้องลงสถานีไหนครับ/คะ",
    "'ลง' = xuống xe/tàu.", "ลง = to get off.",
  ],
  [
    "Hỏi chuyến cuối", "Asking about the last train",
    "รถไฟเที่ยวสุดท้ายกี่โมงครับ/คะ", "rót-fai thîao sùt-tháai gìi moong khráp/khá", "Chuyến tàu cuối mấy giờ?", "What time is the last train?",
    "ปิดกี่โมง", "pìt gìi moong", "Mấy giờ đóng cửa?", "What time does it close?",
    "รถไฟฟ้าเที่ยวสุดท้ายออกกี่โมงครับ/คะ",
    "BTS/MRT đóng khoảng nửa đêm.", "BTS/MRT close around midnight.",
  ],
  [
    "Hỏi tuyến xe buýt", "Asking the bus number",
    "รถเมล์สายไหนไป ... ครับ/คะ", "rót-mee sǎai-nǎi pai ... khráp/khá", "Xe buýt tuyến nào đi ...?", "Which bus goes to ...?",
    "รถเมล์นี้ไป ... ไหม", "rót-mee níi pai ... mǎi", "Xe này có đi ... không?", "Does this bus go to ...?",
    "รถเมล์สายไหนไป ... และต้องลงป้ายไหนครับ/คะ",
    "Hỏi tài xế xác nhận trước khi lên.", "Confirm with the driver before boarding.",
  ],
];

const MONEY: Entry[] = [
  [
    "Tìm máy ATM", "Finding an ATM",
    "ตู้เอทีเอ็มอยู่ที่ไหนครับ/คะ", "tûu ee-thii-em yùu thîi-nǎi khráp/khá", "Máy ATM ở đâu?", "Where is an ATM?",
    "แถวนี้มีตู้กดเงินไหม", "thǎeo-níi mii tûu gòt ngən mǎi", "Quanh đây có ATM không?", "Any ATM nearby?",
    "แถวนี้ตู้เอทีเอ็มที่ใกล้ที่สุดอยู่ตรงไหนครับ/คะ",
    "ATM Thái thu phí ~220฿ cho thẻ ngoại.", "Thai ATMs charge ~220฿ for foreign cards.",
  ],
  [
    "Đổi tiền", "Exchanging money",
    "ขอแลกเงินครับ/ค่ะ", "khǎw lâek ngən khráp/khâ", "Tôi muốn đổi tiền.", "I'd like to exchange money.",
    "เรทเท่าไหร่", "rèet thâo-rài", "Tỉ giá bao nhiêu?", "What's the rate?",
    "ขอแลกเงินเป็นเงินบาท เรทเท่าไหร่ครับ/คะ",
    "So sánh tỉ giá; quầy 'SuperRich' thường tốt hơn.", "Compare rates; 'SuperRich' booths are often better.",
  ],
  [
    "Đổi tiền lẻ", "Getting smaller notes",
    "ขอแลกแบงก์ย่อยครับ/ค่ะ", "khǎw lâek báeng yâwi khráp/khâ", "Đổi tiền lẻ giúp.", "Can I get smaller notes?",
    "มีเศษเหรียญไหม", "mii sèet rǐan mǎi", "Có tiền xu không?", "Any coins?",
    "ขอแลกแบงก์ใหญ่เป็นแบงก์ย่อยหน่อยครับ/ค่ะ",
    "Taxi/quầy nhỏ khó thối tiền 1000฿.", "Small vendors can't break 1000฿ notes.",
  ],
  [
    "Thẻ không dùng được", "Card not working",
    "บัตรใช้ไม่ได้ครับ/ค่ะ", "bàt chái mâi dâi khráp/khâ", "Thẻ không dùng được.", "My card isn't working.",
    "ลองเครื่องอื่นได้ไหม", "lawng khrʉ̂ang ʉ̀ʉn dâi mǎi", "Thử máy khác được không?", "Can I try another machine?",
    "บัตรของผม/ฉันใช้ที่ตู้นี้ไม่ได้ มีตู้อื่นไหมครับ/คะ",
    "Báo ngân hàng trước khi đi để khỏi bị khóa thẻ.", "Tell your bank you're travelling so the card isn't blocked.",
  ],
  [
    "Xin biên lai", "Asking for a receipt",
    "ขอใบเสร็จครับ/ค่ะ", "khǎw bai-sèt khráp/khâ", "Cho xin biên lai.", "A receipt, please.",
    "คิดค่าธรรมเนียมเท่าไหร่", "khít khâa-tham-niam thâo-rài", "Phí dịch vụ bao nhiêu?", "How much is the fee?",
    "ขอใบเสร็จและรายละเอียดค่าธรรมเนียมครับ/ค่ะ",
    "'ค่าธรรมเนียม' = phí.", "ค่าธรรมเนียม = fee.",
  ],
  [
    "Hỏi đủ tiền / tiền thối", "Checking amount / change",
    "เงินนี้พอไหมครับ/คะ", "ngən níi phaw mǎi khráp/khá", "Số tiền này đủ chưa?", "Is this enough?",
    "ทอนเท่าไหร่", "thawn thâo-rài", "Thối lại bao nhiêu?", "How much change?",
    "เงินนี้พอไหม และทอนเท่าไหร่ครับ/คะ",
    "'ทอน' = thối/trả lại tiền thừa.", "ทอน = change (money returned).",
  ],
];

const EMERGENCY: Entry[] = [
  [
    "Kêu cứu", "Calling for help",
    "ช่วยด้วย", "chûay dûay", "Cứu với!", "Help!",
    "ใครก็ได้ช่วยที", "khrai gâw-dâi chûay thii", "Ai đó giúp với!", "Somebody help!",
    "ช่วยด้วย! ผม/ฉันต้องการความช่วยเหลือด่วน",
    "Khi khẩn cấp, hét to; không cần particle.", "In a real emergency, skip the particle and shout.",
  ],
  [
    "Gọi cấp cứu", "Calling an ambulance",
    "โทรเรียกรถพยาบาล 1669", "toh rîak rót phá-yaa-baan nʉ̀ng-hòk-hòk-gâo", "Gọi xe cấp cứu 1669.", "Call an ambulance — 1669.",
    "มีคนเจ็บหนัก", "mii khon jèp nàk", "Có người bị thương nặng.", "Someone is badly hurt.",
    "ช่วยโทร 1669 เรียกรถพยาบาล มีคนบาดเจ็บ",
    "1669 là y tế; 191 là cảnh sát.", "1669 = medical; 191 = police.",
  ],
  [
    "Gọi cảnh sát", "Calling the police",
    "เรียกตำรวจ 191", "rîak tam-rùat nʉ̀ng-gâo-èt", "Gọi cảnh sát 191.", "Call the police — 191.",
    "ผม/ฉันโดนขโมย", "phǒm/chǎn dohn khà-mooi", "Tôi bị trộm.", "I've been robbed.",
    "กรุณาโทร 191 เรียกตำรวจ ผม/ฉันโดนขโมย",
    "Cảnh sát du lịch 1155 nói tiếng Anh.", "Tourist police 1155 speak English.",
  ],
  [
    "Bị lạc", "Being lost",
    "ผม/ฉันหลงทาง", "phǒm/chǎn lǒng thaang", "Tôi bị lạc.", "I'm lost.",
    "ช่วยบอกทางหน่อย", "chûay bàwk thaang nòi", "Chỉ đường giúp.", "Can you help with directions?",
    "ผม/ฉันหลงทาง กำลังจะไป ... ช่วยชี้ทางหน่อยครับ/ค่ะ",
    "'หลงทาง' = lạc đường.", "หลงทาง = lost (the way).",
  ],
  [
    "Bị ốm", "Feeling sick",
    "ผม/ฉันไม่สบาย", "phǒm/chǎn mâi sà-baai", "Tôi không khỏe.", "I feel unwell.",
    "ปวดมากตรงนี้", "pùat mâak trong-níi", "Đau nhiều chỗ này.", "It hurts a lot here.",
    "ผม/ฉันไม่สบาย ปวดมาก ช่วยพาไปหาหมอครับ/ค่ะ",
    "Chỉ tay vào chỗ đau là rõ nhất.", "Pointing to the pain is the clearest.",
  ],
  [
    "Liên hệ đại sứ quán", "Contacting the embassy",
    "ผม/ฉันต้องติดต่อสถานทูตเวียดนาม", "phǒm/chǎn tâwng tìt-tàw sà-thǎan-thûut wîat-naam", "Tôi cần liên hệ ĐSQ Việt Nam.", "I need to contact the Vietnamese embassy.",
    "ผม/ฉันเป็นคนเวียดนาม", "phǒm/chǎn pen khon wîat-naam", "Tôi là người Việt.", "I'm Vietnamese.",
    "ผม/ฉันเป็นคนเวียดนาม ต้องติดต่อสถานทูต ช่วยโทรให้หน่อยครับ/ค่ะ",
    "Lưu số ĐSQ Việt Nam tại Bangkok từ trước.", "Save the Vietnamese embassy (Bangkok) number in advance.",
  ],
];

const DIRECTIONS: Entry[] = [
  [
    "Hỏi chỗ nào", "Asking where something is",
    "... อยู่ที่ไหนครับ/คะ", "... yùu thîi-nǎi khráp/khá", "... ở đâu?", "Where is ...?",
    "ไปทางไหน", "pai thaang-nǎi", "Đi hướng nào?", "Which way?",
    "ผม/ฉันจะไป ... อยู่ทางไหนครับ/คะ",
    "Mẫu câu hỏi vị trí: [địa điểm] + อยู่ที่ไหน.", "Pattern: [place] + อยู่ที่ไหน.",
  ],
  [
    "Hỏi có xa không", "Asking if it's far",
    "ไกลไหมครับ/คะ", "glai mǎi khráp/khá", "Có xa không?", "Is it far?",
    "เดินไหวไหม", "dəən wǎi mǎi", "Đi bộ nổi không?", "Can I walk there?",
    "... ไกลไหม เดินไปได้หรือต้องนั่งรถครับ/คะ",
    "'ไกล' (xa) vs 'ใกล้' (gần) chỉ khác thanh — sai thanh là sai nghĩa.", "ไกล (far) vs ใกล้ (near) differ only by tone.",
  ],
  [
    "Đi thẳng / rẽ", "Straight / turning",
    "ตรงไปแล้วเลี้ยวซ้าย", "trong pai láeo líao sáai", "Đi thẳng rồi rẽ trái.", "Go straight then turn left.",
    "เลี้ยวขวา", "líao khwǎa", "Rẽ phải.", "Turn right.",
    "ช่วยบอกว่าตรงไป เลี้ยวซ้ายหรือขวาครับ/คะ",
    "ซ้าย = trái, ขวา = phải.", "ซ้าย = left, ขวา = right.",
  ],
  [
    "Hỏi quanh đây", "Asking about nearby places",
    "แถวนี้มี ... ไหมครับ/คะ", "thǎeo-níi mii ... mǎi khráp/khá", "Quanh đây có ... không?", "Is there a ... near here?",
    "ที่ใกล้ที่สุดอยู่ไหน", "thîi glâi thîi-sùt yùu nǎi", "Cái gần nhất ở đâu?", "Where's the nearest one?",
    "แถวนี้มีร้านสะดวกซื้อหรือห้องน้ำไหมครับ/คะ",
    "'แถวนี้' = quanh đây.", "แถวนี้ = around here.",
  ],
  [
    "Nhờ chỉ trên bản đồ", "Asking to be shown on a map",
    "ชี้บนแผนที่ได้ไหมครับ/คะ", "chíi bon phǎen-thîi dâi mǎi khráp/khá", "Chỉ trên bản đồ được không?", "Can you show me on the map?",
    "เขียนให้หน่อยได้ไหม", "khǐan hâi nòi dâi mǎi", "Viết ra giúp được không?", "Can you write it down?",
    "ช่วยชี้บนแผนที่ในมือถือว่าผม/ฉันอยู่ตรงไหนครับ/คะ",
    "Mở Google Maps rồi nhờ họ chỉ.", "Open Google Maps and ask them to point.",
  ],
  [
    "Xác nhận đúng đường", "Confirming the right way",
    "ทางนี้ไป ... ใช่ไหมครับ/คะ", "thaang-níi pai ... châi mǎi khráp/khá", "Đường này đi ... đúng không?", "Is this the way to ...?",
    "ผม/ฉันเดินถูกทางไหม", "phǒm/chǎn dəən thùuk thaang mǎi", "Tôi đi đúng đường không?", "Am I going the right way?",
    "ทางนี้ไป ... ถูกไหมครับ/คะ",
    "'...ใช่ไหม' = ...phải không (xác nhận).", "...ใช่ไหม = confirming '...right?'.",
  ],
];

const SIM_PHONE: Entry[] = [
  [
    "Mua SIM", "Buying a SIM",
    "ขอซื้อซิมการ์ดครับ/ค่ะ", "khǎw sʉ́ʉ sim-gáat khráp/khâ", "Tôi muốn mua SIM.", "I'd like a SIM card.",
    "มีซิมนักท่องเที่ยวไหม", "mii sim nák-thâwng-thîao mǎi", "Có SIM du lịch không?", "Do you have a tourist SIM?",
    "ขอซิมการ์ดแบบมีเน็ต นี่หนังสือเดินทางของผม/ฉันครับ/ค่ะ",
    "Cần hộ chiếu để đăng ký SIM.", "You need a passport to register a SIM.",
  ],
  [
    "Hỏi gói data", "Asking about data packages",
    "มีแพ็กเกจเน็ตไหมครับ/คะ", "mii pháek-kèet nét mǎi khráp/khá", "Có gói data không?", "Do you have data packages?",
    "เน็ตไม่อั้นมีไหม", "nét mâi ân mii mǎi", "Có gói không giới hạn không?", "Any unlimited data?",
    "ขอแพ็กเกจเน็ตใช้ได้ ... วัน ราคาเท่าไหร่ครับ/คะ",
    "'ไม่อั้น' = không giới hạn.", "ไม่อั้น = unlimited.",
  ],
  [
    "Hỏi dùng mấy ngày", "Asking how long it lasts",
    "ใช้ได้กี่วันครับ/คะ", "chái dâi gìi wan khráp/khá", "Dùng được mấy ngày?", "How many days does it last?",
    "หมดอายุเมื่อไหร่", "mòt aa-yú mʉ̂a-rài", "Hết hạn khi nào?", "When does it expire?",
    "แพ็กเกจนี้ใช้ได้กี่วันและต่ออายุยังไงครับ/คะ",
    "Hỏi rõ số ngày trước khi trả tiền.", "Confirm the validity period before paying.",
  ],
  [
    "Nhờ lắp SIM", "Asking them to install the SIM",
    "ช่วยใส่ซิมให้หน่อยครับ/ค่ะ", "chûay sài sim hâi nòi khráp/khâ", "Lắp SIM giúp tôi.", "Can you install the SIM for me?",
    "ช่วยเปิดเน็ตให้ด้วย", "chûay pə̀ət nét hâi dûay", "Bật mạng giúp.", "Please turn on the data.",
    "ช่วยใส่ซิมและตั้งค่าเน็ตให้ใช้งานได้ด้วยครับ/ค่ะ",
    "Giữ lại SIM cũ và khay nhỏ.", "Keep your original SIM and the tray.",
  ],
  [
    "Nạp tiền", "Topping up",
    "เติมเงินได้ที่ไหนครับ/คะ", "təəm ngən dâi thîi-nǎi khráp/khá", "Nạp tiền ở đâu?", "Where can I top up?",
    "เติมเน็ตเพิ่มได้ไหม", "təəm nét phə̂əm dâi mǎi", "Mua thêm data được không?", "Can I add more data?",
    "ขอเติมเงินหรือเติมเน็ตเบอร์นี้หน่อยครับ/ค่ะ",
    "'เติมเงิน' = nạp tiền.", "เติมเงิน = top up.",
  ],
  [
    "Mạng không chạy", "Internet not working",
    "เน็ตใช้ไม่ได้ครับ/ค่ะ", "nét chái mâi dâi khráp/khâ", "Mạng không vào được.", "The internet isn't working.",
    "สัญญาณไม่มี", "sǎn-yaan mâi mii", "Không có sóng.", "There's no signal.",
    "เน็ตของผม/ฉันใช้ไม่ได้ ช่วยตรวจสอบให้หน่อยครับ/ค่ะ",
    "Thử bật/tắt chế độ máy bay trước.", "Try toggling airplane mode first.",
  ],
];

const SMALL_TALK: Entry[] = [
  [
    "Chào và cảm ơn", "Greeting and thanking",
    "สวัสดีครับ/ค่ะ", "sà-wàt-dii khráp/khâ", "Xin chào.", "Hello.",
    "ขอบคุณครับ/ค่ะ", "khàwp-khun khráp/khâ", "Cảm ơn.", "Thank you.",
    "สวัสดีครับ/ค่ะ ขอบคุณสำหรับความช่วยเหลือ",
    "Particle theo giới tính NGƯỜI NÓI, không phải người nghe.", "The particle matches YOUR gender, not the listener's.",
  ],
  [
    "Nói đến từ đâu", "Saying where you're from",
    "ผม/ฉันมาจากเวียดนาม", "phǒm/chǎn maa jàak wîat-naam", "Tôi đến từ Việt Nam.", "I'm from Vietnam.",
    "คุณมาจากไหน", "khun maa jàak nǎi", "Bạn từ đâu tới?", "Where are you from?",
    "ผม/ฉันเป็นคนเวียดนาม มาเที่ยวเมืองไทย",
    "'มาจาก' = đến từ.", "มาจาก = come from.",
  ],
  [
    "Giới thiệu tên", "Introducing your name",
    "ผม/ฉันชื่อ ...", "phǒm/chǎn chʉ̂ʉ ...", "Tôi tên ...", "My name is ...",
    "คุณชื่ออะไร", "khun chʉ̂ʉ à-rai", "Bạn tên gì?", "What's your name?",
    "ผม/ฉันชื่อ ... ยินดีที่ได้รู้จักครับ/ค่ะ",
    "'ชื่อ' = tên.", "ชื่อ = name.",
  ],
  [
    "Nói biết ít tiếng Thái", "Saying you speak a little Thai",
    "ผม/ฉันพูดไทยได้นิดหน่อย", "phǒm/chǎn phûut thai dâi nít-nòi", "Tôi nói tiếng Thái chút ít.", "I speak a little Thai.",
    "พูดช้าๆ ได้ไหม", "phûut cháa-cháa dâi mǎi", "Nói chậm được không?", "Can you speak slowly?",
    "ผม/ฉันพูดไทยได้นิดหน่อย กรุณาพูดช้าๆ ครับ/ค่ะ",
    "'นิดหน่อย' = một chút.", "นิดหน่อย = a little.",
  ],
  [
    "Đồng ý / không sao", "Agreeing / it's fine",
    "ได้ครับ/ค่ะ", "dâi khráp/khâ", "Được.", "Okay / sure.",
    "ไม่เป็นไร", "mâi pen rai", "Không sao.", "It's fine / no problem.",
    "ได้ครับ/ค่ะ ไม่เป็นไร ขอบคุณ",
    "'ได้' = được/đồng ý.", "ได้ = can / okay.",
  ],
  [
    "Tạm biệt", "Saying goodbye",
    "ลาก่อนนะครับ/คะ", "laa-gàwn ná khráp/khá", "Tạm biệt nhé.", "Goodbye.",
    "แล้วเจอกันใหม่", "láeo jəə gan mài", "Hẹn gặp lại.", "See you again.",
    "ขอบคุณมากครับ/ค่ะ ลาก่อน",
    "'ลาก่อน' hơi trang trọng; bạn bè dùng 'บาย'.", "ลาก่อน is a bit formal; friends just say 'bye'.",
  ],
];

// ── Assembled pack ───────────────────────────────────────────────────────

export const thaiTravelDayPack: ThaiTravelItem[] = [
  ...build("airport", AIRPORT),
  ...build("immigration", IMMIGRATION),
  ...build("taxi", TAXI),
  ...build("hotel", HOTEL),
  ...build("food", FOOD),
  ...build("shopping", SHOPPING),
  ...build("transport", TRANSPORT),
  ...build("money", MONEY),
  ...build("emergency", EMERGENCY),
  ...build("directions", DIRECTIONS),
  ...build("sim_phone", SIM_PHONE),
  ...build("small_talk", SMALL_TALK),
];

/** Categories covered by the pack (for filtered travel-day screens). */
export const THAI_TRAVEL_CATEGORIES: ThaiTravelCategory[] = [
  "airport",
  "immigration",
  "taxi",
  "hotel",
  "food",
  "shopping",
  "transport",
  "money",
  "emergency",
  "directions",
  "sim_phone",
  "small_talk",
];

export default thaiTravelDayPack;
