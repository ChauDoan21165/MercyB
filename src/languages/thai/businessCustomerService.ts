// src/languages/thai/businessCustomerService.ts
//
// Thai business & customer-service phrase bank for Vietnamese-speaking and
// English-speaking learners. Self-contained: inline types, exported array, no
// shared ./lessons dependency.
//
// Each item is a ready-to-use line for handling customers, suppliers, refunds,
// invoices, and negotiations: Thai script, romanization (where it helps),
// Vietnamese + English glosses, and a FORMAL/CASUAL caution — service Thai
// leans formal (full particles, ทางเรา, เรียน), and dropping that register
// reads as rude to a customer.
//
// "…" marks a slot for the learner's own content.
//
// Romanization tone letters: (M)/(L)/(F)/(H)/(R); "ph/th/kh" aspirated;
// "dt/bp" unaspirated ต/ป.
//
// Native review: DEFERRED. Hand-derived for pedagogy; not validated by a
// native Thai reviewer.

export type ThaiCsTopic =
  | "customer_complaint"
  | "refund"
  | "discount"
  | "schedule_change"
  | "delivery_issue"
  | "supplier"
  | "invoice"
  | "polite_refusal"
  | "escalation"
  | "negotiation"
  | "follow_up";

export type ThaiCsRegister = "casual" | "polite" | "formal";

export type ThaiCsItem = {
  id: string;
  topic: ThaiCsTopic;
  th: string;
  romanization?: string;
  vi: string;
  en: string;
  /** Formal/casual caution (VI). */
  note_vi: string;
  /** Formal/casual caution (EN). */
  note_en: string;
  register: ThaiCsRegister;
  native_review?: "deferred";
};

export const customerServiceItems: ThaiCsItem[] = [
  // ── Customer complaint (handling) ──────────────────────────────────────────
  {
    id: "thai_cs_complaint_apologize_listen",
    topic: "customer_complaint",
    th: "ต้องขออภัยด้วยนะคะ รบกวนเล่ารายละเอียดให้ฟังหน่อยได้ไหมคะ",
    romanization: "dtɔ̂ng khɔ̌ɔ-à-phai dûai ná ká, róp-guan lâo raai-lá-ìat hâi fang nɔ̀i dâai mǎi ká",
    vi: "Thành thật xin lỗi ạ, phiền anh/chị kể chi tiết giúp em được không ạ?",
    en: "I'm so sorry; could you tell me the details, please?",
    note_vi: "Với khách: xin lỗi trước, lắng nghe sau. Luôn dùng particle đầy đủ. Nữ: ค่ะ/คะ, nam: ครับ.",
    note_en: "With customers: apologize first, listen second. Always full particles. Women ค่ะ/คะ, men ครับ.",
    register: "formal",
  },
  {
    id: "thai_cs_complaint_understand_feeling",
    topic: "customer_complaint",
    th: "เข้าใจความรู้สึกของลูกค้าเลยค่ะ เดี๋ยวเราจะรีบดูแลให้นะคะ",
    vi: "Em hiểu cảm giác của anh/chị ạ, để bên em xử lý ngay ạ.",
    en: "I completely understand how you feel; we'll take care of it right away.",
    note_vi: "Đồng cảm + cam kết hành động. ทางเรา/เรา = 'bên chúng tôi'. Tránh đổ lỗi khách.",
    note_en: "Empathy + a commitment to act. ทางเรา/เรา = 'our side'. Never blame the customer.",
    register: "formal",
  },
  {
    id: "thai_cs_complaint_take_responsibility",
    topic: "customer_complaint",
    th: "เรื่องนี้เป็นความผิดพลาดของทางเราเอง ต้องขออภัยจริงๆ ค่ะ",
    vi: "Việc này là sai sót của bên em, thành thật xin lỗi ạ.",
    en: "This was our own mistake; we sincerely apologize.",
    note_vi: "Nhận lỗi tổ chức (ทางเรา) thay vì cá nhân nhân viên. Giữ thể diện cho cả hai.",
    note_en: "Own it as the organization (ทางเรา), not a single staffer. Saves face for both sides.",
    register: "formal",
    native_review: "deferred",
  },
  {
    id: "thai_cs_complaint_ask_what_resolution",
    topic: "customer_complaint",
    th: "ไม่ทราบว่าลูกค้าต้องการให้เราแก้ไขแบบไหนดีคะ",
    vi: "Không biết anh/chị muốn bên em khắc phục theo cách nào ạ?",
    en: "How would you like us to resolve this?",
    note_vi: "Hỏi mong muốn của khách thể hiện cầu thị. ไม่ทราบว่า rất lịch sự.",
    note_en: "Asking what the customer wants shows willingness. ไม่ทราบว่า is very polite.",
    register: "formal",
  },
  {
    id: "thai_cs_complaint_casual_peer_vendor",
    topic: "customer_complaint",
    th: "อันนี้มีปัญหานิดนึงอ่ะ ช่วยดูให้หน่อยได้ปะ",
    romanization: "an níi mii bpan-hǎa nít-nʉng à, chûai duu hâi nɔ̀i dâai bpà",
    vi: "Cái này có chút vấn đề nè, xem giúp được hông?",
    en: "There's a small issue with this — can you take a look?",
    note_vi: "Bản CASUAL chỉ dùng với đối tác quen ngang hàng. KHÔNG dùng với khách hàng.",
    note_en: "CASUAL form, only with a familiar peer vendor. NOT for customers.",
    register: "casual",
  },

  // ── Refund ─────────────────────────────────────────────────────────────────
  {
    id: "thai_cs_refund_offer",
    topic: "refund",
    th: "ทางเรายินดีคืนเงินเต็มจำนวนให้ค่ะ ขออภัยในความไม่สะดวกด้วยนะคะ",
    vi: "Bên em sẵn lòng hoàn toàn bộ tiền ạ, xin lỗi vì sự bất tiện ạ.",
    en: "We're happy to give you a full refund; sorry for the inconvenience.",
    note_vi: "ยินดีคืนเงิน nghe chủ động, thiện chí. เต็มจำนวน = toàn bộ. Trang trọng với khách.",
    note_en: "ยินดีคืนเงิน sounds proactive and willing. เต็มจำนวน = full amount. Formal with customers.",
    register: "formal",
  },
  {
    id: "thai_cs_refund_process_time",
    topic: "refund",
    th: "เงินจะคืนเข้าบัญชีภายใน 3–5 วันทำการนะคะ",
    romanization: "ngən jà khʉʉn khâo ban-chii phaai-nai sǎam thʉ̌ng hâa wan tham-gaan ná ká",
    vi: "Tiền sẽ hoàn về tài khoản trong 3–5 ngày làm việc ạ.",
    en: "The money will be refunded to your account within 3–5 business days.",
    note_vi: "Nêu rõ thời gian hoàn để tránh khách hỏi lại. วันทำการ = ngày làm việc.",
    note_en: "State the refund timeline to pre-empt follow-ups. วันทำการ = business days.",
    register: "formal",
  },
  {
    id: "thai_cs_refund_request_as_customer",
    topic: "refund",
    th: "ผมขอคืนเงินเต็มจำนวนครับ ไม่ทราบว่าต้องดำเนินการอย่างไรต่อครับ",
    vi: "Tôi xin hoàn toàn bộ tiền ạ, không biết cần làm thủ tục gì tiếp ạ?",
    en: "I'd like a full refund; what are the next steps?",
    note_vi: "Khi BẠN là khách: yêu cầu cụ thể + hỏi thủ tục. ดำเนินการ trang trọng.",
    note_en: "When YOU are the customer: specific ask + procedural question. ดำเนินการ is formal.",
    register: "polite",
  },
  {
    id: "thai_cs_refund_partial",
    topic: "refund",
    th: "กรณีนี้เราขอเสนอคืนเงินบางส่วนหรือเปลี่ยนสินค้าใหม่ ลูกค้าสะดวกแบบไหนคะ",
    vi: "Trường hợp này bên em xin đề xuất hoàn một phần hoặc đổi sản phẩm mới, anh/chị tiện cách nào ạ?",
    en: "In this case we can offer a partial refund or a replacement — which suits you?",
    note_vi: "Đưa hai phương án để khách chọn, giữ quyền cho khách. Trang trọng.",
    note_en: "Offer two options so the customer chooses; keeps control with them. Formal.",
    register: "formal",
    native_review: "deferred",
  },

  // ── Discount ───────────────────────────────────────────────────────────────
  {
    id: "thai_cs_discount_offer_goodwill",
    topic: "discount",
    th: "เพื่อเป็นการขอโทษ ทางเราขอมอบส่วนลด 15% สำหรับครั้งถัดไปค่ะ",
    vi: "Để xin lỗi, bên em xin tặng giảm 15% cho lần sau ạ.",
    en: "By way of apology, we'd like to offer 15% off your next purchase.",
    note_vi: "Giảm giá như cách bù đắp (เพื่อเป็นการขอโทษ). Cụ thể % và phạm vi.",
    note_en: "A discount as compensation (เพื่อเป็นการขอโทษ). State the % and scope.",
    register: "formal",
  },
  {
    id: "thai_cs_discount_ask_as_customer",
    topic: "discount",
    th: "ถ้าซื้อจำนวนมาก พอจะมีส่วนลดให้บ้างไหมครับ",
    romanization: "thâa sʉ́ʉ jam-nuan mâak, phɔɔ jà mii sùan-lót hâi bâang mǎi kráp",
    vi: "Nếu mua số lượng lớn, có giảm giá chút nào không ạ?",
    en: "If I buy in bulk, is there any discount available?",
    note_vi: "Hỏi giảm giá lịch sự (พอจะ…บ้างไหม) nghe nhẹ, không ép. Polite.",
    note_en: "A soft discount request (พอจะ…บ้างไหม) doesn't pressure. Polite.",
    register: "polite",
  },
  {
    id: "thai_cs_discount_cannot_but_alt",
    topic: "discount",
    th: "ราคานี้ลดเพิ่มไม่ได้แล้วค่ะ แต่แถมของสมนาคุณให้ได้นะคะ",
    vi: "Giá này không giảm thêm được ạ, nhưng em tặng kèm quà được ạ.",
    en: "I can't lower this price further, but I can add a free gift.",
    note_vi: "Từ chối giảm + đề xuất thay thế (แถม). Đừng nói 'ไม่ได้' trống không.",
    note_en: "Refuse the cut + offer an alternative (a freebie). Don't leave a bare 'ไม่ได้'.",
    register: "polite",
  },
  {
    id: "thai_cs_discount_promo_inform",
    topic: "discount",
    th: "ช่วงนี้มีโปรโมชั่นซื้อสองแถมหนึ่งพอดีเลยค่ะ",
    romanization: "chûang níi mii bproo-moo-chân sʉ́ʉ sɔ̌ɔng thɛ̌ɛm nʉ̀ng phɔɔ-dii looei kâ",
    vi: "Đợt này đang có khuyến mãi mua hai tặng một luôn ạ.",
    en: "We currently have a buy-two-get-one-free promotion.",
    note_vi: "Thông báo KM chủ động. โปรโมชั่น là từ vay quen. Trang trọng vừa.",
    note_en: "Proactively flag a promo. โปรโมชั่น is a common loanword. Mid-formal.",
    register: "polite",
  },

  // ── Schedule change ────────────────────────────────────────────────────────
  {
    id: "thai_cs_schedule_request_move",
    topic: "schedule_change",
    th: "รบกวนขอเลื่อนนัดส่งมอบงานจากวันศุกร์เป็นวันจันทร์ได้ไหมคะ",
    vi: "Phiền cho dời lịch bàn giao từ thứ Sáu sang thứ Hai được không ạ?",
    en: "Could we move the delivery appointment from Friday to Monday?",
    note_vi: "เลื่อน…จาก X เป็น Y. รบกวน mở yêu cầu lịch sự với đối tác.",
    note_en: "เลื่อน…จาก X เป็น Y. รบกวน opens a polite request to a partner.",
    register: "formal",
  },
  {
    id: "thai_cs_schedule_confirm_new",
    topic: "schedule_change",
    th: "ยืนยันนัดใหม่เป็นวันจันทร์ เวลา 10 โมงเช้านะคะ",
    romanization: "yʉʉn-yan nát mài bpen wan jan, wee-laa sìp moong cháao ná ká",
    vi: "Xác nhận lịch mới là thứ Hai, 10 giờ sáng ạ.",
    en: "Confirming the new appointment for Monday at 10 am.",
    note_vi: "Xác nhận lại lịch mới rõ ngày + giờ, tránh hiểu nhầm. Trang trọng.",
    note_en: "Reconfirm the new slot with day + time to avoid confusion. Formal.",
    register: "formal",
  },
  {
    id: "thai_cs_schedule_apologize_change",
    topic: "schedule_change",
    th: "ขออภัยที่ต้องเปลี่ยนกำหนดกะทันหันนะคะ เนื่องจากมีเหตุสุดวิสัย",
    vi: "Xin lỗi vì phải đổi lịch gấp ạ, do có việc bất khả kháng.",
    en: "Sorry for the last-minute change; it's due to unforeseen circumstances.",
    note_vi: "เหตุสุดวิสัย = bất khả kháng (trang trọng). Xin lỗi + lý do ngắn.",
    note_en: "เหตุสุดวิสัย = force majeure / unforeseen (formal). Apology + a short reason.",
    register: "formal",
  },

  // ── Delivery issue ─────────────────────────────────────────────────────────
  {
    id: "thai_cs_delivery_delay_inform",
    topic: "delivery_issue",
    th: "ต้องขออภัยค่ะ พัสดุล่าช้ากว่ากำหนด คาดว่าจะถึงภายในพรุ่งนี้ค่ะ",
    vi: "Xin lỗi ạ, bưu kiện bị trễ so với hẹn, dự kiến đến trong ngày mai ạ.",
    en: "I'm sorry, the parcel is delayed; it's expected to arrive by tomorrow.",
    note_vi: "Báo trễ + ETA mới. คาดว่า = dự kiến. Trang trọng với khách.",
    note_en: "Flag the delay + a new ETA. คาดว่า = expected. Formal with customers.",
    register: "formal",
  },
  {
    id: "thai_cs_delivery_wrong_item",
    topic: "delivery_issue",
    th: "ทางเราจะจัดส่งสินค้าที่ถูกต้องให้ใหม่ทันที และรับของที่ผิดคืนโดยไม่มีค่าใช้จ่ายค่ะ",
    vi: "Bên em sẽ gửi lại đúng hàng ngay và thu hồi hàng sai miễn phí ạ.",
    en: "We'll ship the correct item immediately and collect the wrong one free of charge.",
    note_vi: "Giải pháp trọn gói + miễn phí cho khách. โดยไม่มีค่าใช้จ่าย = không tính phí.",
    note_en: "A complete fix + free of charge for the customer. โดยไม่มีค่าใช้จ่าย = at no cost.",
    register: "formal",
    native_review: "deferred",
  },
  {
    id: "thai_cs_delivery_track_request",
    topic: "delivery_issue",
    th: "รบกวนขอเลขพัสดุเพื่อตรวจสอบสถานะหน่อยได้ไหมคะ",
    romanization: "róp-guan khɔ̌ɔ lêek phát-sà-dù phʉ̂a dtrùat-sɔ̀ɔp sà-thǎa-ná nɔ̀i dâai mǎi ká",
    vi: "Phiền cho em xin mã vận đơn để kiểm tra trạng thái được không ạ?",
    en: "Could I have the tracking number to check the status?",
    note_vi: "Xin thông tin để xử lý. เลขพัสดุ = mã vận đơn. Trang trọng.",
    note_en: "Request info to act on it. เลขพัสดุ = tracking number. Formal.",
    register: "formal",
  },
  {
    id: "thai_cs_delivery_damaged",
    topic: "delivery_issue",
    th: "สินค้าที่ได้รับมีความเสียหายระหว่างขนส่ง รบกวนช่วยดำเนินการเคลมให้ด้วยค่ะ",
    vi: "Hàng nhận bị hư hại trong quá trình vận chuyển, phiền hỗ trợ làm thủ tục bồi thường ạ.",
    en: "The item arrived damaged in transit; please help process a claim.",
    note_vi: "เคลม (claim) là từ vay quen. Khi BẠN là khách báo hư hại. Polite-formal.",
    note_en: "เคลม (claim) is a common loanword. For when YOU report damage as the customer. Polite-formal.",
    register: "polite",
  },

  // ── Supplier ───────────────────────────────────────────────────────────────
  {
    id: "thai_cs_supplier_request_quote",
    topic: "supplier",
    th: "รบกวนขอใบเสนอราคาสำหรับสินค้ารายการนี้ จำนวน 500 ชิ้นด้วยครับ",
    vi: "Phiền gửi báo giá cho mặt hàng này, số lượng 500 cái ạ.",
    en: "Could you send a quotation for this item, 500 units, please?",
    note_vi: "ใบเสนอราคา = báo giá. Nêu rõ số lượng + lượng từ ชิ้น. Trang trọng B2B.",
    note_en: "ใบเสนอราคา = quotation. State the quantity + classifier ชิ้น. Formal B2B.",
    register: "formal",
  },
  {
    id: "thai_cs_supplier_lead_time",
    topic: "supplier",
    th: "ไม่ทราบว่าระยะเวลาในการผลิตและจัดส่งใช้เวลาประมาณกี่วันครับ",
    vi: "Không biết thời gian sản xuất và giao hàng mất khoảng bao nhiêu ngày ạ?",
    en: "May I ask roughly how many days production and delivery take?",
    note_vi: "Hỏi lead time trước khi chốt. ไม่ทราบว่า + ประมาณ nghe lịch sự, không gắt.",
    note_en: "Ask the lead time before committing. ไม่ทราบว่า + ประมาณ keeps it polite.",
    register: "formal",
  },
  {
    id: "thai_cs_supplier_payment_terms",
    topic: "supplier",
    th: "ขอสอบถามเงื่อนไขการชำระเงิน ทางเราขอเครดิต 30 วันได้ไหมครับ",
    vi: "Em xin hỏi điều khoản thanh toán, bên em xin công nợ 30 ngày được không ạ?",
    en: "May I ask about payment terms — could we have 30-day credit?",
    note_vi: "เงื่อนไขการชำระเงิน = điều khoản thanh toán. เครดิต 30 วัน = công nợ 30 ngày.",
    note_en: "เงื่อนไขการชำระเงิน = payment terms. เครดิต 30 วัน = 30-day credit.",
    register: "formal",
    native_review: "deferred",
  },
  {
    id: "thai_cs_supplier_chase_casual",
    topic: "supplier",
    th: "พี่ครับ ของล็อตที่แล้วเป็นไงบ้าง ใกล้ได้รึยังครับ",
    romanization: "phîi kráp, khɔ̌ɔng lɔ́t thîi lɛ́ɛw bpen ngai bâang, glâi dâai rʉ́-yang kráp",
    vi: "Anh ơi, lô hàng vừa rồi sao rồi, sắp xong chưa ạ?",
    en: "Phi, how's the last batch coming along — nearly ready?",
    note_vi: "Bản thân mật với nhà cung cấp quen lâu năm. Vẫn giữ ครับ. Không dùng với đối tác mới.",
    note_en: "Casual-ish with a long-known supplier. Still keeps ครับ. Not for a new partner.",
    register: "polite",
  },

  // ── Invoice ────────────────────────────────────────────────────────────────
  {
    id: "thai_cs_invoice_send",
    topic: "invoice",
    th: "ขอส่งใบแจ้งหนี้สำหรับเดือนนี้ตามไฟล์แนบ ยอดรวม 25,000 บาทค่ะ",
    vi: "Em xin gửi hóa đơn tháng này theo file đính kèm, tổng cộng 25.000 baht ạ.",
    en: "Please find this month's invoice attached; the total is 25,000 baht.",
    note_vi: "ใบแจ้งหนี้ = hóa đơn yêu cầu thanh toán (khác ใบเสร็จ = biên nhận). Nêu tổng + บาท.",
    note_en: "ใบแจ้งหนี้ = invoice (vs ใบเสร็จ = receipt). State the total + บาท.",
    register: "formal",
  },
  {
    id: "thai_cs_invoice_payment_reminder",
    topic: "invoice",
    th: "รบกวนแจ้งเตือนนะคะ ใบแจ้งหนี้เลขที่ 102 ครบกำหนดชำระวันที่ 30 นี้ค่ะ",
    vi: "Em xin nhắc nhẹ ạ, hóa đơn số 102 đến hạn thanh toán ngày 30 này ạ.",
    en: "A gentle reminder: invoice #102 is due for payment on the 30th.",
    note_vi: "Nhắc nợ lịch sự (แจ้งเตือน + รบกวน). Nêu số hóa đơn + hạn. Không gắt.",
    note_en: "A polite payment reminder (แจ้งเตือน + รบกวน). Cite the invoice # + due date. Not pushy.",
    register: "formal",
  },
  {
    id: "thai_cs_invoice_dispute",
    topic: "invoice",
    th: "ในใบแจ้งหนี้มียอดที่ไม่ตรงกับที่ตกลงไว้ รบกวนช่วยตรวจสอบและแก้ไขให้ด้วยครับ",
    vi: "Trong hóa đơn có khoản không khớp với thỏa thuận, phiền kiểm tra và sửa giúp ạ.",
    en: "The invoice has an amount that doesn't match what we agreed; please check and correct it.",
    note_vi: "Khiếu nại hóa đơn: nêu sự việc khách quan + nhờ kiểm tra. Không buộc tội.",
    note_en: "Invoice dispute: state the fact + ask them to check. No accusation.",
    register: "formal",
  },

  // ── Polite refusal ─────────────────────────────────────────────────────────
  {
    id: "thai_cs_refusal_cannot_this_time",
    topic: "polite_refusal",
    th: "ต้องขออภัยด้วยนะคะ ครั้งนี้เราคงรับไม่ได้ แต่ไว้โอกาสหน้าแน่นอนค่ะ",
    vi: "Xin lỗi ạ, lần này bên em chưa nhận được, nhưng dịp sau chắc chắn ạ.",
    en: "I'm sorry, we can't take this on this time, but definitely next time.",
    note_vi: "Từ chối mềm: xin lỗi + để ngỏ tương lai. Đừng nói 'ไม่' trống không với đối tác.",
    note_en: "Soft refusal: apologize + leave the door open. Don't give a bare 'ไม่' to a partner.",
    register: "formal",
  },
  {
    id: "thai_cs_refusal_out_of_scope",
    topic: "polite_refusal",
    th: "ส่วนนี้อยู่นอกเหนือบริการของเราค่ะ แต่ขอแนะนำผู้ให้บริการที่เชี่ยวชาญให้นะคะ",
    vi: "Phần này nằm ngoài dịch vụ của bên em ạ, nhưng em xin giới thiệu đơn vị chuyên hơn ạ.",
    en: "This is outside our services, but let me recommend a specialist provider.",
    note_vi: "Từ chối + hướng giải pháp khác (giới thiệu). Giữ thiện chí, chuyên nghiệp.",
    note_en: "Refuse + redirect (a referral). Keeps goodwill and professionalism.",
    register: "formal",
    native_review: "deferred",
  },
  {
    id: "thai_cs_refusal_price_too_low",
    topic: "polite_refusal",
    th: "ราคานี้ต่ำกว่าต้นทุนของเราค่ะ คงต้องขอปฏิเสธ แต่ยินดีหาทางออกร่วมกันนะคะ",
    vi: "Giá này thấp hơn giá vốn của bên em ạ, đành phải từ chối, nhưng sẵn lòng cùng tìm hướng ạ.",
    en: "This price is below our cost; I'll have to decline, but I'm happy to find a way together.",
    note_vi: "Từ chối có lý do (ต่ำกว่าต้นทุน) + mời thương lượng tiếp. ปฏิเสธ trang trọng.",
    note_en: "Refuse with a reason (below cost) + invite further negotiation. ปฏิเสธ is formal.",
    register: "formal",
  },

  // ── Escalation ─────────────────────────────────────────────────────────────
  {
    id: "thai_cs_escalation_to_supervisor",
    topic: "escalation",
    th: "เรื่องนี้ขออนุญาตส่งต่อให้หัวหน้าดูแลนะคะ เพื่อให้ได้รับการแก้ไขที่ดีที่สุดค่ะ",
    vi: "Việc này cho em chuyển lên cấp trên xử lý ạ, để được giải quyết tốt nhất ạ.",
    en: "Allow me to escalate this to my supervisor for the best resolution.",
    note_vi: "Chuyển cấp như lợi ích cho khách, không đùn đẩy. Trang trọng.",
    note_en: "Frame escalation as a customer benefit, not buck-passing. Formal.",
    register: "formal",
  },
  {
    id: "thai_cs_escalation_callback_promise",
    topic: "escalation",
    th: "เดี๋ยวทีมที่เกี่ยวข้องจะติดต่อกลับภายใน 24 ชั่วโมงนะคะ",
    romanization: "dǐao thiim thîi gìao-khɔ̂ɔng jà dtìt-dtɔ̀ɔ glàp phaai-nai yîi-sìp-sìi chûa-moong ná ká",
    vi: "Đội phụ trách sẽ liên hệ lại trong vòng 24 giờ ạ.",
    en: "The relevant team will get back to you within 24 hours.",
    note_vi: "Cam kết thời gian phản hồi cụ thể trấn an khách. ภายใน = trong vòng.",
    note_en: "A concrete callback-time commitment reassures the customer. ภายใน = within.",
    register: "formal",
  },
  {
    id: "thai_cs_escalation_as_customer",
    topic: "escalation",
    th: "ถ้าเรื่องยังไม่ได้รับการแก้ไข ผมขอคุยกับผู้จัดการได้ไหมครับ",
    romanization: "thâa rʉ̂ang yang mâi dâai-ráp gaan gɛ̂ɛ-khǎi, phǒm khɔ̌ɔ khui gàp phûu-jàt-gaan dâai mǎi kráp",
    vi: "Nếu việc vẫn chưa được giải quyết, tôi xin gặp quản lý được không ạ?",
    en: "If this still isn't resolved, may I speak with the manager?",
    note_vi: "Khi BẠN là khách yêu cầu lên cấp — vẫn giữ ครับ + ขอ…ได้ไหม để không gắt.",
    note_en: "When YOU as a customer ask to escalate — keep ครับ + ขอ…ได้ไหม so it isn't aggressive.",
    register: "polite",
  },

  // ── Negotiation ────────────────────────────────────────────────────────────
  {
    id: "thai_cs_negotiation_meet_middle",
    topic: "negotiation",
    th: "ถ้าเราเจอกันครึ่งทางที่ราคานี้ ผมว่าน่าจะโอเคทั้งสองฝ่ายครับ",
    romanization: "thâa rao jəə gan khrʉ̂ng-thaang thîi raa-khaa níi, phǒm wâa nâa-jà oo-khee tháng sɔ̌ɔng fàai kráp",
    vi: "Nếu ta gặp nhau ở mức giá này, tôi nghĩ cả hai bên đều ổn ạ.",
    en: "If we meet halfway at this price, I think it works for both sides.",
    note_vi: "เจอกันครึ่งทาง = gặp nhau ở giữa. Nhấn lợi ích đôi bên. Polite.",
    note_en: "เจอกันครึ่งทาง = meet halfway. Stresses mutual benefit. Polite.",
    register: "polite",
  },
  {
    id: "thai_cs_negotiation_bulk_condition",
    topic: "negotiation",
    th: "ถ้าสั่งเกิน 1,000 ชิ้น ทางเราลดให้อีก 5% ได้ครับ",
    vi: "Nếu đặt trên 1.000 cái, bên em giảm thêm 5% được ạ.",
    en: "For orders over 1,000 units, we can take another 5% off.",
    note_vi: "Nhượng bộ có điều kiện (ถ้า…ได้). Trao đổi giá trị, không cho không.",
    note_en: "A conditional concession (if…then). Trade value, don't just give it away.",
    register: "formal",
  },
  {
    id: "thai_cs_negotiation_value_not_price",
    topic: "negotiation",
    th: "ราคาอาจสูงกว่าเล็กน้อย แต่เรารับประกันคุณภาพและบริการหลังการขายครับ",
    vi: "Giá có thể cao hơn chút, nhưng bên em bảo đảm chất lượng và dịch vụ hậu mãi ạ.",
    en: "The price is slightly higher, but we guarantee quality and after-sales service.",
    note_vi: "Bảo vệ giá bằng giá trị (รับประกัน). Thừa nhận điểm yếu rồi xoay sang mạnh.",
    note_en: "Defend price with value (guarantee). Concede the weakness then pivot to strength.",
    register: "formal",
    native_review: "deferred",
  },

  // ── Follow-up message ──────────────────────────────────────────────────────
  {
    id: "thai_cs_followup_after_meeting",
    topic: "follow_up",
    th: "ขอบคุณสำหรับการพูดคุยวันนี้นะคะ ตามที่คุยกันไว้ ขอส่งรายละเอียดเพิ่มเติมตามไฟล์แนบค่ะ",
    vi: "Cảm ơn anh/chị đã trao đổi hôm nay ạ; theo như đã bàn, em xin gửi chi tiết bổ sung theo file ạ.",
    en: "Thank you for today's discussion; as agreed, here are further details in the attached file.",
    note_vi: "Email theo sau cuộc họp: cảm ơn + ตามที่คุยกันไว้ + đính kèm. Trang trọng.",
    note_en: "Post-meeting email: thanks + 'as discussed' + attachment. Formal.",
    register: "formal",
  },
  {
    id: "thai_cs_followup_gentle_nudge",
    topic: "follow_up",
    th: "รบกวนติดตามเรื่องที่เคยแจ้งไว้นะคะ ไม่ทราบว่าพอจะมีความคืบหน้าอย่างไรบ้างคะ",
    vi: "Em xin theo dõi việc đã trao đổi ạ, không biết có tiến triển gì chưa ạ?",
    en: "Just following up on what I mentioned earlier; is there any update?",
    note_vi: "Nhắc nhẹ không thúc ép. รบกวนติดตาม + ไม่ทราบว่า giữ lịch sự. Formal.",
    note_en: "A gentle nudge without pressure. รบกวนติดตาม + ไม่ทราบว่า keeps it polite. Formal.",
    register: "formal",
  },
  {
    id: "thai_cs_followup_thanks_close",
    topic: "follow_up",
    th: "ขอบคุณที่ไว้วางใจใช้บริการของเรานะคะ หากต้องการความช่วยเหลือเพิ่มเติม ยินดีเสมอค่ะ",
    vi: "Cảm ơn anh/chị đã tin dùng dịch vụ của bên em ạ; nếu cần hỗ trợ thêm, em luôn sẵn lòng ạ.",
    en: "Thank you for trusting our service; if you need any more help, we're always glad to assist.",
    note_vi: "Đóng follow-up giữ quan hệ (ไว้วางใจ + ยินดีเสมอ). Trang trọng, ấm áp.",
    note_en: "Close a follow-up to keep the relationship (trust + always glad). Formal, warm.",
    register: "formal",
  },
  {
    id: "thai_cs_followup_casual_internal",
    topic: "follow_up",
    th: "อันที่คุยไว้เป็นไงบ้าง มีอะไรให้ช่วยเพิ่มบอกได้นะ",
    romanization: "an thîi khui wái bpen ngai bâang, mii à-rai hâi chûai phə̂əm bɔ̀ɔk dâai ná",
    vi: "Cái đã bàn sao rồi, cần giúp gì thêm cứ nói nha.",
    en: "How's the thing we discussed going? Let me know if you need anything else.",
    note_vi: "Bản thân mật cho đồng nghiệp NỘI BỘ. Không dùng với khách hàng bên ngoài.",
    note_en: "Casual form for INTERNAL colleagues. Not for external customers.",
    register: "casual",
  },

  // ── Extra items (round out each topic) ─────────────────────────────────────
  {
    id: "thai_cs_complaint_thank_for_feedback",
    topic: "customer_complaint",
    th: "ขอบคุณที่แจ้งให้เราทราบนะคะ ความคิดเห็นของลูกค้ามีค่ากับเรามากค่ะ",
    vi: "Cảm ơn anh/chị đã phản ánh ạ, ý kiến của anh/chị rất quý với bên em ạ.",
    en: "Thank you for letting us know; your feedback is very valuable to us.",
    note_vi: "Cảm ơn phản ánh biến phàn nàn thành thiện chí. Trang trọng với khách.",
    note_en: "Thanking for feedback turns a complaint into goodwill. Formal with customers.",
    register: "formal",
  },
  {
    id: "thai_cs_refund_confirm_done",
    topic: "refund",
    th: "ดำเนินการคืนเงินเรียบร้อยแล้วนะคะ รบกวนตรวจสอบยอดในบัญชีอีกครั้งค่ะ",
    vi: "Em đã hoàn tiền xong rồi ạ, phiền anh/chị kiểm tra lại số dư tài khoản ạ.",
    en: "The refund has been processed; please check your account balance.",
    note_vi: "Xác nhận đã hoàn + mời kiểm tra, khép vòng. Trang trọng.",
    note_en: "Confirm completion + invite a check, closing the loop. Formal.",
    register: "formal",
  },
  {
    id: "thai_cs_discount_loyalty",
    topic: "discount",
    th: "สำหรับลูกค้าประจำ ทางเรามีราคาพิเศษให้เป็นกรณีพิเศษค่ะ",
    romanization: "sǎm-ràp lûuk-kháa bprà-jam, thaang rao mii raa-khaa phí-sèet hâi bpen gà-rá-nii phí-sèet kâ",
    vi: "Với khách quen, bên em có giá đặc biệt riêng ạ.",
    en: "For regular customers, we have a special price as a one-off.",
    note_vi: "ลูกค้าประจำ = khách quen. Ưu đãi giữ chân khách trung thành. Trang trọng.",
    note_en: "ลูกค้าประจำ = regular customer. A loyalty perk to retain them. Formal.",
    register: "formal",
  },
  {
    id: "thai_cs_schedule_propose_slots",
    topic: "schedule_change",
    th: "รบกวนเลือกเวลาที่สะดวกระหว่างวันอังคารบ่าย หรือวันพุธเช้านะคะ",
    vi: "Phiền anh/chị chọn giờ tiện giữa chiều thứ Ba hoặc sáng thứ Tư ạ.",
    en: "Please pick whichever suits you: Tuesday afternoon or Wednesday morning.",
    note_vi: "Đưa hai khung giờ cụ thể để chốt nhanh, giảm qua lại. Trang trọng.",
    note_en: "Offer two concrete slots to settle fast, fewer back-and-forths. Formal.",
    register: "formal",
  },
  {
    id: "thai_cs_delivery_confirm_received",
    topic: "delivery_issue",
    th: "รบกวนยืนยันด้วยนะคะว่าได้รับสินค้าครบถ้วนและอยู่ในสภาพดีค่ะ",
    vi: "Phiền xác nhận giúp em là đã nhận đủ hàng và còn nguyên vẹn ạ.",
    en: "Please confirm that you received the goods in full and in good condition.",
    note_vi: "Xin xác nhận giao nhận để tránh tranh chấp sau. ครบถ้วน = đầy đủ.",
    note_en: "Request delivery confirmation to avoid later disputes. ครบถ้วน = complete/in full.",
    register: "formal",
  },
  {
    id: "thai_cs_supplier_negotiate_moq",
    topic: "supplier",
    th: "ขั้นต่ำในการสั่งซื้อสูงไปนิดครับ พอจะปรับลดขั้นต่ำลงได้บ้างไหมครับ",
    vi: "Số lượng đặt tối thiểu hơi cao ạ, có thể giảm mức tối thiểu chút nào không ạ?",
    en: "The minimum order quantity is a bit high; could it be lowered somewhat?",
    note_vi: "Thương lượng MOQ (ขั้นต่ำ) lịch sự. พอจะ…ได้บ้างไหม nghe nhẹ nhàng.",
    note_en: "Politely negotiate the MOQ (ขั้นต่ำ). พอจะ…ได้บ้างไหม sounds gentle.",
    register: "polite",
  },
  {
    id: "thai_cs_invoice_request_copy",
    topic: "invoice",
    th: "รบกวนขอสำเนาใบเสร็จรับเงินสำหรับการชำระครั้งล่าสุดด้วยค่ะ",
    vi: "Phiền cho em xin bản sao biên nhận của lần thanh toán gần nhất ạ.",
    en: "Could I get a copy of the receipt for the most recent payment?",
    note_vi: "ใบเสร็จรับเงิน = biên nhận đã thanh toán (khác ใบแจ้งหนี้). สำเนา = bản sao.",
    note_en: "ใบเสร็จรับเงิน = paid receipt (vs ใบแจ้งหนี้ = invoice). สำเนา = copy.",
    register: "formal",
  },
  {
    id: "thai_cs_refusal_no_stock_period",
    topic: "polite_refusal",
    th: "ช่วงนี้คิวงานเต็มจริงๆ ค่ะ คงรับเพิ่มไม่ไหว ต้องขออภัยด้วยนะคะ",
    vi: "Đợt này lịch kín thật sự ạ, không nhận thêm nổi, thành thật xin lỗi ạ.",
    en: "Our schedule is genuinely full right now; we can't take more on — I'm sorry.",
    note_vi: "Từ chối vì hết công suất, có lý do thật. คิวงานเต็ม = lịch kín. Trang trọng.",
    note_en: "Refuse due to capacity, with a real reason. คิวงานเต็ม = fully booked. Formal.",
    register: "formal",
  },
  {
    id: "thai_cs_escalation_acknowledge_wait",
    topic: "escalation",
    th: "ขออภัยที่ทำให้รอนะคะ เรื่องของลูกค้าอยู่ระหว่างการตรวจสอบอย่างเร่งด่วนค่ะ",
    vi: "Xin lỗi đã để anh/chị chờ ạ, việc của anh/chị đang được kiểm tra khẩn ạ.",
    en: "Sorry to keep you waiting; your case is being reviewed urgently.",
    note_vi: "Trấn an khi khách chờ lâu. อยู่ระหว่างการตรวจสอบ = đang được xử lý. Trang trọng.",
    note_en: "Reassure a waiting customer. อยู่ระหว่างการตรวจสอบ = under review. Formal.",
    register: "formal",
  },
  {
    id: "thai_cs_negotiation_trial_order",
    topic: "negotiation",
    th: "ลองเริ่มจากออเดอร์ทดลองก่อนดีไหมครับ ถ้าพอใจค่อยขยายความร่วมมือกัน",
    vi: "Hay bắt đầu từ đơn dùng thử trước ạ, nếu hài lòng thì mở rộng hợp tác sau.",
    en: "Shall we start with a trial order? If you're satisfied, we can expand the partnership.",
    note_vi: "Đề xuất đơn thử để giảm rủi ro, mở đường dài hạn. ดีไหม mời cùng quyết.",
    note_en: "Propose a trial order to lower risk and open a long-term path. ดีไหม invites joint decision.",
    register: "polite",
  },
  {
    id: "thai_cs_followup_satisfaction_check",
    topic: "follow_up",
    th: "ไม่ทราบว่าหลังการแก้ไข ลูกค้าพอใจกับบริการของเราหรือยังคะ",
    vi: "Không biết sau khi khắc phục, anh/chị đã hài lòng với dịch vụ bên em chưa ạ?",
    en: "After the fix, may I ask whether you're satisfied with our service now?",
    note_vi: "Theo dõi mức hài lòng sau xử lý, thể hiện trách nhiệm tới cùng. Trang trọng.",
    note_en: "Check satisfaction after resolving, showing end-to-end care. Formal.",
    register: "formal",
  },
  {
    id: "thai_cs_complaint_offer_immediate_fix",
    topic: "customer_complaint",
    th: "เดี๋ยวเราแก้ไขให้ทันทีเลยนะคะ ลูกค้ารอสักครู่นะคะ",
    romanization: "dǐao rao gɛ̂ɛ-khǎi hâi than-thii looei ná ká, lûuk-kháa rɔɔ sàk-khrûu ná ká",
    vi: "Để bên em sửa ngay ạ, anh/chị chờ chút ạ.",
    en: "We'll fix it right away; please wait just a moment.",
    note_vi: "Hành động ngay trấn an khách. สักครู่ trang trọng hơn แป๊บ. Giữ particle.",
    note_en: "Acting immediately reassures the customer. สักครู่ is more formal than แป๊บ. Keep particles.",
    register: "formal",
  },
  {
    id: "thai_cs_refund_voucher_alt",
    topic: "refund",
    th: "หากลูกค้าสะดวก เราขอเสนอเป็นเครดิตร้านแทนการคืนเงินได้ไหมคะ มูลค่าเท่ากันค่ะ",
    vi: "Nếu anh/chị tiện, bên em xin đề xuất tín dụng cửa hàng thay vì hoàn tiền được không ạ, giá trị bằng nhau ạ.",
    en: "If you're open to it, may we offer store credit instead of a refund? Same value.",
    note_vi: "Đề xuất phương án thay (เครดิตร้าน) nhưng để khách quyết. Trang trọng.",
    note_en: "Offer an alternative (store credit) but let the customer decide. Formal.",
    register: "formal",
    native_review: "deferred",
  },
  {
    id: "thai_cs_discount_negotiate_decline_soft",
    topic: "discount",
    th: "ขอเก็บราคานี้ไว้นะคะ แต่จัดส่งฟรีให้เลยค่ะ ถือว่าช่วยกัน",
    romanization: "khɔ̌ɔ gèp raa-khaa níi wái ná ká, dtɛ̀ɛ jàt-sòng frii hâi looei kâ, thʉ̌ʉ wâa chûai gan",
    vi: "Cho em giữ giá này ạ, nhưng em miễn phí giao hàng luôn ạ, coi như hỗ trợ nhau.",
    en: "I'll keep this price, but I'll throw in free delivery — call it meeting you partway.",
    note_vi: "Giữ giá + bù bằng giá trị khác (ฟรีค่าส่ง). Không 'ไม่ได้' trống.",
    note_en: "Hold the price + compensate with other value (free delivery). No bare 'no'.",
    register: "polite",
  },
  {
    id: "thai_cs_supplier_confirm_po",
    topic: "supplier",
    th: "ยืนยันคำสั่งซื้อตามรายละเอียดที่แนบนะครับ รบกวนตอบกลับเพื่อยืนยันด้วยครับ",
    vi: "Xác nhận đơn đặt hàng theo chi tiết đính kèm ạ, phiền phản hồi để xác nhận ạ.",
    en: "Confirming the purchase order per the attached details; please reply to confirm.",
    note_vi: "คำสั่งซื้อ = đơn đặt hàng (PO). Yêu cầu xác nhận hai chiều. Trang trọng B2B.",
    note_en: "คำสั่งซื้อ = purchase order. Ask for two-way confirmation. Formal B2B.",
    register: "formal",
  },
  {
    id: "thai_cs_followup_quote_reminder",
    topic: "follow_up",
    th: "รบกวนติดตามใบเสนอราคาที่ส่งไปเมื่อสัปดาห์ก่อนนะคะ ไม่ทราบว่าพิจารณาเป็นอย่างไรบ้างคะ",
    vi: "Em xin theo dõi báo giá đã gửi tuần trước ạ, không biết anh/chị cân nhắc thế nào ạ?",
    en: "Following up on the quotation I sent last week; how are you finding it?",
    note_vi: "Nhắc báo giá lịch sự, không thúc ép. รบกวนติดตาม + ไม่ทราบว่า. Trang trọng.",
    note_en: "Politely chase a quotation without pressure. รบกวนติดตาม + ไม่ทราบว่า. Formal.",
    register: "formal",
  },
];

export default customerServiceItems;
