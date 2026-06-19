// src/languages/thai/publicServices.ts
//
// Thai public-services & bureaucracy language support for Vietnamese + English
// learners. Compact, app-ready phrase items for getting through forms, offices,
// queues, banks, phone shops, and immigration.
//
// LANGUAGE SUPPORT ONLY — these are phrases and usage notes, NOT legal advice.
// For legal questions, users should consult a qualified professional.
//
// Self-contained: types defined inline (the thai/ package has no shared
// public-services module yet). Swap to type-only imports when one exists.
//
// Conventions
//   - Thai script primary; `rtgs` light Royal-Thai-style romanization.
//   - en/vi = the meaning; note_en/note_vi = when & how to use it.
//
// NOTE: not natively reviewed yet (native review deferred).

export type ThaiPublicServiceTopic =
  | "forms"
  | "appointment"
  | "queue"
  | "id_passport"
  | "immigration_office"
  | "bank"
  | "phone_plan"
  | "address"
  | "document_copies"
  | "interpreter"
  | "clarification";

export type ThaiPublicServiceItem = {
  id: string;
  topic: ThaiPublicServiceTopic;
  /** Thai phrase (primary). */
  th: string;
  /** Romanization. */
  rtgs: string;
  /** English meaning. */
  en: string;
  /** Vietnamese meaning. */
  vi: string;
  /** When / how to use it, English. */
  note_en: string;
  /** When / how to use it, Vietnamese. */
  note_vi: string;
};

export const thaiPublicServices: ThaiPublicServiceItem[] = [
  // ── forms ──────────────────────────────────────────────────────────────────
  {
    id: "ps-forms-01",
    topic: "forms",
    th: "ต้องกรอกแบบฟอร์มไหนครับ",
    rtgs: "tɔng krɔk baep fɔm nai khrap",
    en: "Which form do I need to fill in?",
    vi: "Tôi cần điền vào mẫu nào ạ?",
    note_en: "Ask this at a counter when unsure which document to start with. กรอก = fill in.",
    note_vi: "Hỏi câu này ở quầy khi chưa rõ bắt đầu giấy tờ nào. กรอก = điền.",
  },
  {
    id: "ps-forms-02",
    topic: "forms",
    th: "ตรงนี้กรอกอะไรครับ",
    rtgs: "trong ni krɔk arai khrap",
    en: "What do I write here?",
    vi: "Chỗ này điền gì ạ?",
    note_en: "Point at the field as you ask. Useful when a form is only in Thai.",
    note_vi: "Chỉ vào ô khi hỏi. Hữu ích khi mẫu chỉ có tiếng Thái.",
  },
  {
    id: "ps-forms-03",
    topic: "forms",
    th: "ช่องนี้จำเป็นต้องกรอกไหมครับ",
    rtgs: "chɔng ni jampen tɔng krɔk mai khrap",
    en: "Is this field required?",
    vi: "Ô này có bắt buộc điền không ạ?",
    note_en: "ช่อง = box/field; จำเป็น = necessary. Helps you skip optional fields.",
    note_vi: "ช่อง = ô; จำเป็น = bắt buộc. Giúp bỏ qua ô không bắt buộc.",
  },
  {
    id: "ps-forms-04",
    topic: "forms",
    th: "กรอกเป็นภาษาอังกฤษได้ไหมครับ",
    rtgs: "krɔk pen phasa angkrit dai mai khrap",
    en: "Can I fill it in in English?",
    vi: "Tôi điền bằng tiếng Anh được không ạ?",
    note_en: "Many official forms accept English for names/addresses; always worth asking.",
    note_vi: "Nhiều mẫu chính thức chấp nhận tiếng Anh cho tên/địa chỉ; nên hỏi.",
  },
  {
    id: "ps-forms-05",
    topic: "forms",
    th: "กรอกผิด ขอแบบฟอร์มใหม่ได้ไหมครับ",
    rtgs: "krɔk phit, khɔ baep fɔm mai dai mai khrap",
    en: "I filled it in wrong — may I have a new form?",
    vi: "Tôi điền sai — cho tôi mẫu mới được không ạ?",
    note_en: "Better than crossing out on official forms, which some offices reject.",
    note_vi: "Tốt hơn là gạch xóa trên mẫu chính thức, vốn bị một số nơi từ chối.",
  },

  // ── appointment ────────────────────────────────────────────────────────────
  {
    id: "ps-appt-01",
    topic: "appointment",
    th: "ผมขอนัดหมายได้ไหมครับ",
    rtgs: "phom khɔ nat mai dai mai khrap",
    en: "May I make an appointment?",
    vi: "Tôi xin đặt lịch hẹn được không ạ?",
    note_en: "นัดหมาย = appointment. Use at clinics, banks, government offices.",
    note_vi: "นัดหมาย = lịch hẹn. Dùng ở phòng khám, ngân hàng, cơ quan nhà nước.",
  },
  {
    id: "ps-appt-02",
    topic: "appointment",
    th: "มีคิวว่างวันไหนบ้างครับ",
    rtgs: "mi khiu wang wan nai bang khrap",
    en: "Which days have open slots?",
    vi: "Có ngày nào còn lịch trống ạ?",
    note_en: "คิว here means an available time slot, not a physical line.",
    note_vi: "คิว ở đây nghĩa là khung giờ còn trống, không phải hàng người.",
  },
  {
    id: "ps-appt-03",
    topic: "appointment",
    th: "ผมจองคิวออนไลน์ไว้แล้วครับ",
    rtgs: "phom jɔng khiu online wai laeo khrap",
    en: "I've already booked online.",
    vi: "Tôi đã đặt lịch trực tuyến rồi ạ.",
    note_en: "Show the confirmation/QR. Many Thai offices use online booking now.",
    note_vi: "Đưa xác nhận/QR. Nhiều cơ quan Thái nay dùng đặt lịch trực tuyến.",
  },
  {
    id: "ps-appt-04",
    topic: "appointment",
    th: "ขอเลื่อนนัดได้ไหมครับ",
    rtgs: "khɔ luean nat dai mai khrap",
    en: "May I reschedule the appointment?",
    vi: "Tôi xin dời lịch hẹn được không ạ?",
    note_en: "เลื่อนนัด = postpone an appointment. Add the new day if you have one.",
    note_vi: "เลื่อนนัด = dời lịch hẹn. Thêm ngày mới nếu bạn đã có.",
  },
  {
    id: "ps-appt-05",
    topic: "appointment",
    th: "นัดของผมกี่โมงครับ",
    rtgs: "nat khɔng phom ki mong khrap",
    en: "What time is my appointment?",
    vi: "Lịch hẹn của tôi mấy giờ ạ?",
    note_en: "Confirm the time at the desk if you're unsure; arrive early.",
    note_vi: "Xác nhận giờ ở quầy nếu chưa chắc; nên đến sớm.",
  },

  // ── queue ──────────────────────────────────────────────────────────────────
  {
    id: "ps-queue-01",
    topic: "queue",
    th: "รับบัตรคิวตรงไหนครับ",
    rtgs: "rap bat khiu trong nai khrap",
    en: "Where do I get a queue ticket?",
    vi: "Lấy vé số thứ tự ở đâu ạ?",
    note_en: "บัตรคิว = queue ticket. Most offices use a take-a-number system.",
    note_vi: "บัตรคิว = vé thứ tự. Đa số cơ quan dùng hệ thống bốc số.",
  },
  {
    id: "ps-queue-02",
    topic: "queue",
    th: "ตอนนี้ถึงคิวเลขอะไรแล้วครับ",
    rtgs: "tɔn ni thueng khiu lek arai laeo khrap",
    en: "Which number is being served now?",
    vi: "Bây giờ tới số mấy rồi ạ?",
    note_en: "Useful when the display is only in Thai numerals (๑ ๒ ๓ …).",
    note_vi: "Hữu ích khi bảng chỉ hiển thị chữ số Thái (๑ ๒ ๓ …).",
  },
  {
    id: "ps-queue-03",
    topic: "queue",
    th: "ผมต่อแถวตรงนี้ถูกไหมครับ",
    rtgs: "phom tɔ thaeo trong ni thuk mai khrap",
    en: "Am I queuing in the right line here?",
    vi: "Tôi xếp hàng ở đây đúng chưa ạ?",
    note_en: "ต่อแถว = join the line. Polite way to check before waiting a long time.",
    note_vi: "ต่อแถว = xếp hàng. Cách lịch sự để kiểm tra trước khi đợi lâu.",
  },
  {
    id: "ps-queue-04",
    topic: "queue",
    th: "ต้องรอนานไหมครับ",
    rtgs: "tɔng rɔ nan mai khrap",
    en: "Will the wait be long?",
    vi: "Phải đợi lâu không ạ?",
    note_en: "A neutral way to gauge waiting time without sounding impatient.",
    note_vi: "Cách trung tính để ước lượng thời gian đợi mà không tỏ ra sốt ruột.",
  },
  {
    id: "ps-queue-05",
    topic: "queue",
    th: "ขอโทษครับ คิวนี้ของผมพอดี",
    rtgs: "khɔthot khrap, khiu ni khɔng phom phɔdi",
    en: "Excuse me, this is actually my turn.",
    vi: "Xin lỗi, số này đúng là của tôi ạ.",
    note_en: "Say it gently with ขอโทษ + พอดี to claim your turn without confrontation.",
    note_vi: "Nói nhẹ với ขอโทษ + พอดี để nhận lượt mà không gây căng thẳng.",
  },

  // ── id / passport ──────────────────────────────────────────────────────────
  {
    id: "ps-id-01",
    topic: "id_passport",
    th: "ต้องใช้พาสปอร์ตตัวจริงไหมครับ",
    rtgs: "tɔng chai passport tua jing mai khrap",
    en: "Do you need the original passport?",
    vi: "Có cần hộ chiếu bản gốc không ạ?",
    note_en: "ตัวจริง = the original. Some services accept a copy (สำเนา) only.",
    note_vi: "ตัวจริง = bản gốc. Một số dịch vụ chỉ cần bản sao (สำเนา).",
  },
  {
    id: "ps-id-02",
    topic: "id_passport",
    th: "นี่หนังสือเดินทางของผมครับ",
    rtgs: "ni nangsue doen thang khɔng phom khrap",
    en: "Here is my passport.",
    vi: "Đây là hộ chiếu của tôi ạ.",
    note_en: "หนังสือเดินทาง is the formal word for passport (พาสปอร์ต is also used).",
    note_vi: "หนังสือเดินทาง là từ trang trọng cho hộ chiếu (พาสปอร์ต cũng dùng).",
  },
  {
    id: "ps-id-03",
    topic: "id_passport",
    th: "ผมไม่มีบัตรประชาชนไทย มีแต่พาสปอร์ตครับ",
    rtgs: "phom mai mi bat prachachon thai, mi tae passport khrap",
    en: "I don't have a Thai ID card, only a passport.",
    vi: "Tôi không có thẻ căn cước Thái, chỉ có hộ chiếu ạ.",
    note_en: "บัตรประชาชน = Thai national ID. Clarifies your status as a foreigner.",
    note_vi: "บัตรประชาชน = thẻ căn cước Thái. Làm rõ bạn là người nước ngoài.",
  },
  {
    id: "ps-id-04",
    topic: "id_passport",
    th: "ขอถ่ายสำเนาหน้าพาสปอร์ตได้ที่ไหนครับ",
    rtgs: "khɔ thai samnao na passport dai thi nai khrap",
    en: "Where can I photocopy my passport page?",
    vi: "Tôi photo trang hộ chiếu ở đâu được ạ?",
    note_en: "Offices often have a copy shop nearby; staff can point you there.",
    note_vi: "Cơ quan thường có tiệm photo gần đó; nhân viên có thể chỉ chỗ.",
  },
  {
    id: "ps-id-05",
    topic: "id_passport",
    th: "พาสปอร์ตผมหมดอายุปีหน้าครับ",
    rtgs: "passport phom mot ayu pi na khrap",
    en: "My passport expires next year.",
    vi: "Hộ chiếu của tôi hết hạn vào năm sau ạ.",
    note_en: "หมดอายุ = expire. Relevant for visa and bank applications.",
    note_vi: "หมดอายุ = hết hạn. Liên quan khi xin visa và mở tài khoản ngân hàng.",
  },

  // ── immigration office ─────────────────────────────────────────────────────
  {
    id: "ps-imm-01",
    topic: "immigration_office",
    th: "ผมมาต่อวีซ่าครับ",
    rtgs: "phom ma tɔ wisa khrap",
    en: "I'm here to extend my visa.",
    vi: "Tôi đến gia hạn visa ạ.",
    note_en: "ต่อวีซ่า = extend a visa. State your purpose first at the counter.",
    note_vi: "ต่อวีซ่า = gia hạn visa. Nêu mục đích trước ở quầy.",
  },
  {
    id: "ps-imm-02",
    topic: "immigration_office",
    th: "ผมต้องรายงานตัว 90 วันครับ",
    rtgs: "phom tɔng raingan tua kao sip wan khrap",
    en: "I need to do my 90-day report.",
    vi: "Tôi cần báo cáo 90 ngày ạ.",
    note_en: "รายงานตัว 90 วัน is the routine address report for long-stay foreigners.",
    note_vi: "รายงานตัว 90 วัน là thủ tục báo cáo địa chỉ định kỳ cho người ở dài hạn.",
  },
  {
    id: "ps-imm-03",
    topic: "immigration_office",
    th: "ผมต้องเตรียมเอกสารอะไรบ้างครับ",
    rtgs: "phom tɔng triam ekkasan arai bang khrap",
    en: "What documents do I need to prepare?",
    vi: "Tôi cần chuẩn bị giấy tờ gì ạ?",
    note_en: "Requirements vary by office; always confirm the current checklist.",
    note_vi: "Yêu cầu khác nhau theo văn phòng; luôn xác nhận danh mục hiện hành.",
  },
  {
    id: "ps-imm-04",
    topic: "immigration_office",
    th: "แบบฟอร์ม ตม. ใช้ใบไหนครับ",
    rtgs: "baep fɔm tɔ mɔ chai bai nai khrap",
    en: "Which immigration form do I use?",
    vi: "Mẫu xuất nhập cảnh dùng tờ nào ạ?",
    note_en: "ตม. (tɔ-mɔ) is the common abbreviation for Immigration; forms are numbered.",
    note_vi: "ตม. (tɔ-mɔ) là viết tắt của Xuất nhập cảnh; các mẫu được đánh số.",
  },
  {
    id: "ps-imm-05",
    topic: "immigration_office",
    th: "ผมยื่นเรื่องวันนี้ รับเล่มได้เมื่อไหร่ครับ",
    rtgs: "phom yuen rueang wan ni, rap lem dai muea rai khrap",
    en: "If I submit today, when can I collect my passport?",
    vi: "Nếu nộp hôm nay, khi nào lấy lại hộ chiếu ạ?",
    note_en: "ยื่นเรื่อง = submit an application; รับเล่ม = collect the passport book.",
    note_vi: "ยื่นเรื่อง = nộp hồ sơ; รับเล่ม = lấy lại cuốn hộ chiếu.",
  },

  // ── bank ───────────────────────────────────────────────────────────────────
  {
    id: "ps-bank-01",
    topic: "bank",
    th: "ผมอยากเปิดบัญชีออมทรัพย์ครับ",
    rtgs: "phom yak poet banchi ɔmsap khrap",
    en: "I'd like to open a savings account.",
    vi: "Tôi muốn mở tài khoản tiết kiệm ạ.",
    note_en: "บัญชีออมทรัพย์ = savings account. Foreigners usually need extra documents.",
    note_vi: "บัญชีออมทรัพย์ = tài khoản tiết kiệm. Người nước ngoài thường cần thêm giấy tờ.",
  },
  {
    id: "ps-bank-02",
    topic: "bank",
    th: "บัตรเอทีเอ็มหายครับ ขออายัดบัตร",
    rtgs: "bat ATM hai khrap, khɔ ayat bat",
    en: "My ATM card is lost — please block it.",
    vi: "Tôi mất thẻ ATM — xin khóa thẻ ạ.",
    note_en: "อายัดบัตร = block/freeze the card. Act fast and bring your passport.",
    note_vi: "อายัดบัตร = khóa thẻ. Hành động nhanh và mang hộ chiếu.",
  },
  {
    id: "ps-bank-03",
    topic: "bank",
    th: "ผมขอโอนเงินไปต่างประเทศครับ",
    rtgs: "phom khɔ on ngoen pai tang prathet khrap",
    en: "I'd like to transfer money abroad.",
    vi: "Tôi muốn chuyển tiền ra nước ngoài ạ.",
    note_en: "โอนเงินไปต่างประเทศ = international transfer; expect to show ID and purpose.",
    note_vi: "โอนเงินไปต่างประเทศ = chuyển tiền quốc tế; cần xuất trình giấy tờ và mục đích.",
  },
  {
    id: "ps-bank-04",
    topic: "bank",
    th: "ยอดเงินในบัญชีเหลือเท่าไหร่ครับ",
    rtgs: "yɔt ngoen nai banchi luea thao rai khrap",
    en: "What's my account balance?",
    vi: "Số dư tài khoản của tôi còn bao nhiêu ạ?",
    note_en: "ยอดเงิน = balance. You may need to verify identity to ask at the counter.",
    note_vi: "ยอดเงิน = số dư. Có thể phải xác minh danh tính khi hỏi ở quầy.",
  },
  {
    id: "ps-bank-05",
    topic: "bank",
    th: "ขอสมุดบัญชีเล่มใหม่ได้ไหมครับ",
    rtgs: "khɔ samut banchi lem mai dai mai khrap",
    en: "Can I get a new bankbook?",
    vi: "Cho tôi sổ tài khoản mới được không ạ?",
    note_en: "สมุดบัญชี = passbook/bankbook, still widely used in Thai banking.",
    note_vi: "สมุดบัญชี = sổ tài khoản, vẫn dùng rộng rãi trong ngân hàng Thái.",
  },

  // ── phone plan ─────────────────────────────────────────────────────────────
  {
    id: "ps-phone-01",
    topic: "phone_plan",
    th: "ผมอยากซื้อซิมเติมเงินครับ",
    rtgs: "phom yak sue sim toem ngoen khrap",
    en: "I'd like to buy a prepaid SIM.",
    vi: "Tôi muốn mua SIM trả trước ạ.",
    note_en: "ซิมเติมเงิน = prepaid SIM; bring your passport for registration.",
    note_vi: "ซิมเติมเงิน = SIM trả trước; mang hộ chiếu để đăng ký.",
  },
  {
    id: "ps-phone-02",
    topic: "phone_plan",
    th: "มีแพ็กเกจเน็ตรายเดือนไหมครับ",
    rtgs: "mi package net rai duean mai khrap",
    en: "Do you have monthly data packages?",
    vi: "Có gói dữ liệu theo tháng không ạ?",
    note_en: "แพ็กเกจ = package; รายเดือน = monthly. Ask staff to compare options.",
    note_vi: "แพ็กเกจ = gói; รายเดือน = theo tháng. Nhờ nhân viên so sánh các lựa chọn.",
  },
  {
    id: "ps-phone-03",
    topic: "phone_plan",
    th: "เติมเงินยังไงครับ",
    rtgs: "toem ngoen yang ngai khrap",
    en: "How do I top up?",
    vi: "Nạp tiền thế nào ạ?",
    note_en: "เติมเงิน = top up. Possible at shops, 7-Eleven, apps, and ATMs.",
    note_vi: "เติมเงิน = nạp tiền. Có thể nạp ở cửa hàng, 7-Eleven, app, và ATM.",
  },
  {
    id: "ps-phone-04",
    topic: "phone_plan",
    th: "ผมอยากย้ายค่ายแต่เก็บเบอร์เดิมครับ",
    rtgs: "phom yak yai khai tae kep boe doem khrap",
    en: "I want to switch carriers but keep my number.",
    vi: "Tôi muốn chuyển nhà mạng nhưng giữ số cũ ạ.",
    note_en: "ย้ายค่าย = port to another carrier; เก็บเบอร์เดิม = keep the same number.",
    note_vi: "ย้ายค่าย = chuyển nhà mạng; เก็บเบอร์เดิม = giữ số cũ.",
  },
  {
    id: "ps-phone-05",
    topic: "phone_plan",
    th: "ยกเลิกแพ็กเกจนี้ได้ไหมครับ",
    rtgs: "yokloek package ni dai mai khrap",
    en: "Can I cancel this package?",
    vi: "Tôi hủy gói này được không ạ?",
    note_en: "ยกเลิก = cancel. Ask about any remaining contract or fee first.",
    note_vi: "ยกเลิก = hủy. Hỏi về hợp đồng hoặc phí còn lại trước.",
  },

  // ── address ────────────────────────────────────────────────────────────────
  {
    id: "ps-addr-01",
    topic: "address",
    th: "ที่อยู่ของผมเขียนยังไงครับ",
    rtgs: "thi yu khɔng phom khian yang ngai khrap",
    en: "How do I write my address?",
    vi: "Địa chỉ của tôi viết thế nào ạ?",
    note_en: "Thai addresses run small-to-large (room, building, soi, road, district).",
    note_vi: "Địa chỉ Thái viết từ nhỏ đến lớn (phòng, tòa nhà, ngõ, đường, quận).",
  },
  {
    id: "ps-addr-02",
    topic: "address",
    th: "ผมอยู่ซอยนี้ครับ",
    rtgs: "phom yu sɔi ni khrap",
    en: "I live on this soi (lane).",
    vi: "Tôi ở trong con ngõ (soi) này ạ.",
    note_en: "ซอย (soi) = a side lane off a main road; central to Thai addresses.",
    note_vi: "ซอย (soi) = ngõ nhánh từ đường chính; rất quan trọng trong địa chỉ Thái.",
  },
  {
    id: "ps-addr-03",
    topic: "address",
    th: "รหัสไปรษณีย์ของที่นี่คืออะไรครับ",
    rtgs: "rahat praisani khɔng thi ni khue arai khrap",
    en: "What's the postal code here?",
    vi: "Mã bưu điện ở đây là gì ạ?",
    note_en: "รหัสไปรษณีย์ = postal code; often needed on forms and deliveries.",
    note_vi: "รหัสไปรษณีย์ = mã bưu điện; thường cần trên mẫu đơn và khi giao hàng.",
  },
  {
    id: "ps-addr-04",
    topic: "address",
    th: "ผมเพิ่งย้ายที่อยู่ครับ",
    rtgs: "phom phoeng yai thi yu khrap",
    en: "I just changed my address.",
    vi: "Tôi vừa đổi địa chỉ ạ.",
    note_en: "Mention this when updating records at banks or immigration.",
    note_vi: "Nói điều này khi cập nhật hồ sơ ở ngân hàng hoặc xuất nhập cảnh.",
  },
  {
    id: "ps-addr-05",
    topic: "address",
    th: "ขอใบรับรองที่อยู่ได้ที่ไหนครับ",
    rtgs: "khɔ bai rap rɔng thi yu dai thi nai khrap",
    en: "Where can I get a proof-of-address certificate?",
    vi: "Tôi xin giấy chứng nhận nơi ở ở đâu ạ?",
    note_en: "ใบรับรองที่อยู่ may come from immigration or your embassy; just ask which.",
    note_vi: "ใบรับรองที่อยู่ có thể do xuất nhập cảnh hoặc đại sứ quán cấp; cứ hỏi nơi nào.",
  },

  // ── document copies ────────────────────────────────────────────────────────
  {
    id: "ps-copy-01",
    topic: "document_copies",
    th: "ต้องถ่ายสำเนากี่ชุดครับ",
    rtgs: "tɔng thai samnao ki chut khrap",
    en: "How many copies do I need?",
    vi: "Tôi cần photo bao nhiêu bộ ạ?",
    note_en: "สำเนา = copy; ชุด = set. Offices often want 1–2 sets — confirm.",
    note_vi: "สำเนา = bản sao; ชุด = bộ. Cơ quan thường cần 1–2 bộ — hãy xác nhận.",
  },
  {
    id: "ps-copy-02",
    topic: "document_copies",
    th: "ต้องเซ็นรับรองสำเนาไหมครับ",
    rtgs: "tɔng sen rap rɔng samnao mai khrap",
    en: "Do I need to sign to certify the copy?",
    vi: "Tôi có cần ký xác nhận bản sao không ạ?",
    note_en: "Thai forms often need a signature + 'สำเนาถูกต้อง' on each copy.",
    note_vi: "Mẫu Thái thường cần chữ ký + 'สำเนาถูกต้อง' trên mỗi bản sao.",
  },
  {
    id: "ps-copy-03",
    topic: "document_copies",
    th: "เซ็นตรงไหนครับ",
    rtgs: "sen trong nai khrap",
    en: "Where do I sign?",
    vi: "Tôi ký ở đâu ạ?",
    note_en: "Simple and essential at any counter; point to confirm the spot.",
    note_vi: "Đơn giản và thiết yếu ở mọi quầy; chỉ tay để xác nhận chỗ ký.",
  },
  {
    id: "ps-copy-04",
    topic: "document_copies",
    th: "เอกสารตัวจริงเอาคืนได้ไหมครับ",
    rtgs: "ekkasan tua jing ao khuen dai mai khrap",
    en: "Can I get the originals back?",
    vi: "Tôi lấy lại bản gốc được không ạ?",
    note_en: "Confirm whether they keep originals or just copies before handing over.",
    note_vi: "Xác nhận họ giữ bản gốc hay chỉ bản sao trước khi giao.",
  },
  {
    id: "ps-copy-05",
    topic: "document_copies",
    th: "มีที่ถ่ายเอกสารใกล้ๆ ไหมครับ",
    rtgs: "mi thi thai ekkasan klai klai mai khrap",
    en: "Is there a photocopy place nearby?",
    vi: "Có chỗ photo gần đây không ạ?",
    note_en: "Copy shops cluster near government offices; staff can usually point one out.",
    note_vi: "Tiệm photo thường ở gần cơ quan nhà nước; nhân viên có thể chỉ chỗ.",
  },

  // ── interpreter ────────────────────────────────────────────────────────────
  {
    id: "ps-interp-01",
    topic: "interpreter",
    th: "มีล่ามไหมครับ",
    rtgs: "mi lam mai khrap",
    en: "Is there an interpreter?",
    vi: "Có thông dịch viên không ạ?",
    note_en: "ล่าม = interpreter. Helpful at hospitals, police, immigration.",
    note_vi: "ล่าม = thông dịch viên. Hữu ích ở bệnh viện, công an, xuất nhập cảnh.",
  },
  {
    id: "ps-interp-02",
    topic: "interpreter",
    th: "ผมพูดไทยได้นิดหน่อยครับ",
    rtgs: "phom phut thai dai nit nɔi khrap",
    en: "I speak only a little Thai.",
    vi: "Tôi chỉ nói được một chút tiếng Thái ạ.",
    note_en: "Sets expectations politely so staff slow down and simplify.",
    note_vi: "Đặt kỳ vọng lịch sự để nhân viên nói chậm và đơn giản hơn.",
  },
  {
    id: "ps-interp-03",
    topic: "interpreter",
    th: "พูดภาษาอังกฤษได้ไหมครับ",
    rtgs: "phut phasa angkrit dai mai khrap",
    en: "Do you speak English?",
    vi: "Bạn nói được tiếng Anh không ạ?",
    note_en: "Ask early; many younger staff and private services have some English.",
    note_vi: "Hỏi sớm; nhiều nhân viên trẻ và dịch vụ tư có chút tiếng Anh.",
  },
  {
    id: "ps-interp-04",
    topic: "interpreter",
    th: "ผมขอโทรหาเพื่อนช่วยแปลได้ไหมครับ",
    rtgs: "phom khɔ tho ha phuean chuai plae dai mai khrap",
    en: "May I call a friend to help translate?",
    vi: "Tôi gọi bạn để dịch giúp được không ạ?",
    note_en: "Polite fallback when no interpreter is available; แปล = translate.",
    note_vi: "Phương án lịch sự khi không có thông dịch; แปล = dịch.",
  },
  {
    id: "ps-interp-05",
    topic: "interpreter",
    th: "ขอเขียนเป็นภาษาอังกฤษให้ดูได้ไหมครับ",
    rtgs: "khɔ khian pen phasa angkrit hai du dai mai khrap",
    en: "Could you write it in English for me?",
    vi: "Bạn viết bằng tiếng Anh cho tôi xem được không ạ?",
    note_en: "Asking for writing helps when spoken Thai is hard to catch.",
    note_vi: "Xin viết ra giúp ích khi nghe tiếng Thái khó bắt.",
  },

  // ── clarification ──────────────────────────────────────────────────────────
  {
    id: "ps-clar-01",
    topic: "clarification",
    th: "ขอโทษครับ พูดอีกครั้งได้ไหมครับ",
    rtgs: "khɔthot khrap, phut ik khrang dai mai khrap",
    en: "Sorry, could you say that again?",
    vi: "Xin lỗi, nói lại được không ạ?",
    note_en: "The all-purpose polite 'please repeat'. Always open with ขอโทษ.",
    note_vi: "Câu 'nhắc lại giúp' lịch sự đa dụng. Luôn mở đầu bằng ขอโทษ.",
  },
  {
    id: "ps-clar-02",
    topic: "clarification",
    th: "พูดช้าๆ ได้ไหมครับ",
    rtgs: "phut cha cha dai mai khrap",
    en: "Could you speak slowly?",
    vi: "Nói chậm được không ạ?",
    note_en: "ช้าๆ = slowly. Pair with a smile; staff usually oblige.",
    note_vi: "ช้าๆ = chậm. Kèm nụ cười; nhân viên thường sẵn lòng.",
  },
  {
    id: "ps-clar-03",
    topic: "clarification",
    th: "หมายความว่าอะไรครับ",
    rtgs: "mai khwam wa arai khrap",
    en: "What does that mean?",
    vi: "Cái đó nghĩa là gì ạ?",
    note_en: "Ask when a Thai term on a form or sign is unclear.",
    note_vi: "Hỏi khi một thuật ngữ Thái trên mẫu đơn hoặc biển báo chưa rõ.",
  },
  {
    id: "ps-clar-04",
    topic: "clarification",
    th: "สรุปว่าผมต้องทำอะไรครับ",
    rtgs: "sarup wa phom tɔng tham arai khrap",
    en: "So, what do I need to do?",
    vi: "Tóm lại tôi cần làm gì ạ?",
    note_en: "Great closing question to confirm the next step before leaving the counter.",
    note_vi: "Câu hỏi chốt tốt để xác nhận bước tiếp theo trước khi rời quầy.",
  },
  {
    id: "ps-clar-05",
    topic: "clarification",
    th: "ผมเข้าใจถูกไหมครับว่า...",
    rtgs: "phom khao chai thuk mai khrap wa ...",
    en: "Am I right in understanding that…?",
    vi: "Tôi hiểu đúng không ạ rằng…?",
    note_en: "Use to repeat back instructions in your own words and confirm.",
    note_vi: "Dùng để nhắc lại hướng dẫn bằng lời của bạn và xác nhận.",
  },
  {
    id: "ps-clar-06",
    topic: "clarification",
    th: "ช่วยสะกดให้หน่อยได้ไหมครับ",
    rtgs: "chuai sakot hai nɔi dai mai khrap",
    en: "Could you spell that for me?",
    vi: "Đánh vần giúp tôi được không ạ?",
    note_en: "สะกด = spell. Useful for names, codes, and reference numbers.",
    note_vi: "สะกด = đánh vần. Hữu ích cho tên, mã số, và số tham chiếu.",
  },
];

export default thaiPublicServices;
