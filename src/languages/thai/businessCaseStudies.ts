// src/languages/thai/businessCaseStudies.ts
//
// Thai business case-study practice for Vietnamese-speaking and English-speaking
// learners. Self-contained: inline types, exported array, no shared ./lessons
// dependency.
//
// Each case study is a compact role-play: a SITUATION, the learner's TASK, a few
// USEFUL PHRASES (Thai + romanization where it helps), a MODEL ANSWER, a
// REGISTER CAUTION (formal vs casual — the thing that sinks learners in Thai
// business settings), and one COMMON MISTAKE a Vietnamese speaker makes.
// Topics: complaint, delay, negotiation, supplier, customer service, schedule
// change, invoice, refund, escalation.
//
// "…" marks a slot for the learner's own content. Romanization tone letters:
// (M)/(L)/(F)/(H)/(R); "ph/th/kh" aspirated; "dt/bp" unaspirated ต/ป.
//
// Native review: DEFERRED. Hand-derived for pedagogy; not validated by a native
// Thai reviewer.

export type ThaiCaseTopic =
  | "complaint"
  | "delay"
  | "negotiation"
  | "supplier"
  | "customer_service"
  | "schedule_change"
  | "invoice"
  | "refund"
  | "escalation";

export type ThaiCasePhrase = {
  th: string;
  romanization?: string;
  vi: string;
  en: string;
};

export type ThaiCaseStudy = {
  id: string;
  topic: ThaiCaseTopic;
  /** The scenario (VI). */
  situation_vi: string;
  /** The scenario (EN). */
  situation_en: string;
  /** What the learner must produce (VI). */
  task_vi: string;
  /** What the learner must produce (EN). */
  task_en: string;
  /** A handful of building-block phrases. */
  useful_phrases: ThaiCasePhrase[];
  /** A model response in Thai. */
  model_th: string;
  /** Romanization of the model, where useful. */
  model_romanization?: string;
  model_vi: string;
  model_en: string;
  /** Formal-vs-casual caution (VI). */
  register_caution_vi: string;
  /** Formal-vs-casual caution (EN). */
  register_caution_en: string;
  /** One common Vietnamese-learner mistake (VI). */
  common_mistake_vi: string;
  /** Common-mistake companion (EN). */
  common_mistake_en: string;
  native_review?: "deferred";
};

export const caseStudies: ThaiCaseStudy[] = [
  // ── Complaint ──────────────────────────────────────────────────────────────
  {
    id: "thai_case_complaint_cold_food",
    topic: "complaint",
    situation_vi: "Bạn là khách ở nhà hàng. Món ăn mang ra bị nguội và sai so với gọi.",
    situation_en: "You're a diner. The dish arrives cold and isn't what you ordered.",
    task_vi: "Phàn nàn lịch sự và đề nghị xử lý.",
    task_en: "Complain politely and ask for a fix.",
    useful_phrases: [
      { th: "ขอโทษนะครับ น่าจะมีอะไรผิดพลาด", romanization: "khɔ̌ɔ-thôot ná kráp, nâa-jà mii à-rai phìt-phlâat", vi: "Xin lỗi, có lẽ có nhầm lẫn.", en: "Excuse me, there might be a mistake." },
      { th: "รบกวนเปลี่ยนให้หน่อยได้ไหมครับ", romanization: "róp-guan bplìan hâi nɔ̀i dâai mǎi kráp", vi: "Phiền đổi giúp được không?", en: "Could you swap it, please?" },
    ],
    model_th: "ขอโทษนะครับ จานนี้เย็นแล้วก็ไม่ใช่ที่ผมสั่ง รบกวนช่วยเปลี่ยนให้ใหม่หน่อยได้ไหมครับ",
    model_romanization: "khɔ̌ɔ-thôot ná kráp, jaan níi yen lɛ́ɛw gɔ̂ɔ mâi châi thîi phǒm sàng, róp-guan chûai bplìan hâi mài nɔ̀i dâai mǎi kráp",
    model_vi: "Xin lỗi, món này nguội rồi và không phải món tôi gọi, phiền đổi lại giúp tôi được không?",
    model_en: "Excuse me, this dish is cold and isn't what I ordered; could you replace it, please?",
    register_caution_vi: "Giữ ครับ/ค่ะ + รบกวน. Nêu sự việc (จานเย็น) chứ không trách người (คุณช้า).",
    register_caution_en: "Keep ครับ/ค่ะ + รบกวน. State the fact (the dish is cold), don't blame the person ('you're slow').",
    common_mistake_vi: "Người Việt khi bực nói thẳng 'sao kỳ vậy' — trong tiếng Thái làm cả hai mất mặt; nêu sự việc thôi.",
    common_mistake_en: "Venting directly makes both sides lose face in Thai; stick to the facts.",
  },
  {
    id: "thai_case_complaint_noisy_room",
    topic: "complaint",
    situation_vi: "Bạn ở khách sạn, phòng bên cạnh ồn lúc khuya.",
    situation_en: "You're at a hotel; the next room is noisy late at night.",
    task_vi: "Nhắn lễ tân phàn nàn và xin hỗ trợ.",
    task_en: "Message the front desk to complain and ask for help.",
    useful_phrases: [
      { th: "ห้องข้างๆ เสียงดังมากครับ", romanization: "hɔ̂ng khâang-khâang sǐang dang mâak kráp", vi: "Phòng bên rất ồn.", en: "The next room is very loud." },
      { th: "รบกวนช่วยประสานให้หน่อยได้ไหมครับ", romanization: "róp-guan chûai bprà-sǎan hâi nɔ̀i dâai mǎi kráp", vi: "Phiền hỗ trợ điều phối giúp được không?", en: "Could you help coordinate, please?" },
    ],
    model_th: "สวัสดีครับ ห้องข้างๆ เสียงดังมากตั้งแต่เที่ยงคืน ผมต้องตื่นเช้า รบกวนช่วยประสานให้เบาลงหน่อยได้ไหมครับ",
    model_vi: "Chào bạn, phòng bên rất ồn từ nửa đêm; tôi phải dậy sớm, phiền hỗ trợ nhắc nhỏ tiếng giúp được không?",
    model_en: "Hello, the next room has been very loud since midnight; I have an early start — could you help get it quieted down?",
    register_caution_vi: "Đóng khung quanh nhu cầu của mình (ต้องตื่นเช้า) để xin, giữ lịch sự với nhân viên.",
    register_caution_en: "Frame it around your own need (early start) to ask, staying polite with staff.",
    common_mistake_vi: "Yêu cầu nhân viên 'đi mắng phòng kia' — thay vào đó nhờ họ 'ประสาน' (điều phối) trung lập.",
    common_mistake_en: "Demanding staff 'go scold them' — instead ask them to 'coordinate' neutrally.",
  },
  {
    id: "thai_case_complaint_formal_letter",
    topic: "complaint",
    situation_vi: "Thang máy chung cư hỏng hơn hai tuần. Bạn viết thư cho ban quản lý.",
    situation_en: "The condo lift has been broken for over two weeks. You write to management.",
    task_vi: "Viết thư khiếu nại trang trọng, nêu tác động và xin thời hạn.",
    task_en: "Write a formal complaint stating the impact and requesting a deadline.",
    useful_phrases: [
      { th: "ดิฉันขอแจ้งว่า…", romanization: "dì-chǎn khɔ̌ɔ jɛ̂ɛng wâa…", vi: "Tôi xin báo rằng…", en: "I wish to report that…" },
      { th: "ขอความกรุณาเร่งดำเนินการ", romanization: "khɔ̌ɔ khwaam-gà-rú-naa rêng dam-nəən-gaan", vi: "Kính mong khẩn trương xử lý.", en: "Please kindly expedite action." },
    ],
    model_th: "เรียน ฝ่ายบริหารอาคาร ดิฉันขอแจ้งว่าลิฟต์ฝั่งตะวันออกเสียมากว่าสองสัปดาห์ ส่งผลกระทบต่อผู้สูงอายุ จึงขอความกรุณาเร่งดำเนินการซ่อมและแจ้งกำหนดแล้วเสร็จด้วยค่ะ",
    model_vi: "Kính gửi Ban quản lý, tôi xin báo thang máy phía đông hỏng hơn hai tuần, ảnh hưởng người cao tuổi; kính mong khẩn trương sửa và thông báo thời hạn hoàn thành ạ.",
    model_en: "Dear Management, the east lift has been out of service for over two weeks, affecting elderly residents; please expedite the repair and advise a completion date.",
    register_caution_vi: "Thư chính thức dùng đăng ký cao: เรียน / ขอความกรุณา / ดำเนินการ. Bỏ văn nói.",
    register_caution_en: "A formal letter uses a high register: เรียน / ขอความกรุณา / ดำเนินการ. Drop colloquialisms.",
    common_mistake_vi: "Dùng รู้/บอก/ทำ thân mật trong thư trang trọng thay ทราบ/แจ้ง/ดำเนินการ.",
    common_mistake_en: "Using casual รู้/บอก/ทำ in a formal letter instead of ทราบ/แจ้ง/ดำเนินการ.",
    native_review: "deferred",
  },

  // ── Delay ──────────────────────────────────────────────────────────────────
  {
    id: "thai_case_delay_project_slip",
    topic: "delay",
    situation_vi: "Dự án sẽ trễ hạn 2 ngày vì khối lượng tăng. Bạn báo sếp.",
    situation_en: "The project will slip 2 days due to increased scope. You inform your boss.",
    task_vi: "Báo trễ kèm đề xuất và lợi ích.",
    task_en: "Report the slip with a proposal and a benefit.",
    useful_phrases: [
      { th: "ผมเกรงว่าจะไม่ทันกำหนดเดิม", romanization: "phǒm greeng wâa jà mâi than gam-nòt dəəm", vi: "Tôi e không kịp hạn cũ.", en: "I'm afraid I won't meet the original deadline." },
      { th: "ถ้าเลื่อนได้สักสองวัน งานจะดีกว่านี้", romanization: "thâa lʉ̂an dâai sàk sɔ̌ɔng wan, ngaan jà dii gwàa níi", vi: "Nếu dời hai ngày, việc sẽ tốt hơn.", en: "Two more days would make the work better." },
    ],
    model_th: "พี่ครับ ด้วยปริมาณงานที่เพิ่มขึ้น ผมเกรงว่าจะไม่ทันกำหนดเดิม ถ้าเลื่อนได้สักสองวันงานจะเรียบร้อยกว่ามากครับ แล้วแต่พี่สะดวกครับ",
    model_vi: "Anh ơi, với khối lượng tăng thêm, em e không kịp hạn cũ; nếu dời được hai ngày việc sẽ chỉn chu hơn nhiều ạ, tùy anh tiện ạ.",
    model_en: "Phi, with the increased workload I'm afraid I'll miss the original deadline; two more days would make it much more polished — whichever suits you.",
    register_caution_vi: "Với sếp dùng พี่ + ครับ + เกรงว่า. Kết bằng แล้วแต่พี่ để trao quyền.",
    register_caution_en: "With a boss use พี่ + ครับ + เกรงว่า. Close with แล้วแต่พี่ to hand over the decision.",
    common_mistake_vi: "Báo trễ mà không kèm giải pháp — nghe như than. Luôn kèm đề xuất.",
    common_mistake_en: "Reporting a slip with no solution sounds like complaining. Always attach a proposal.",
  },
  {
    id: "thai_case_delay_shipment_customer",
    topic: "delay",
    situation_vi: "Đơn hàng của khách bị giao trễ. Bạn là nhân viên CSKH.",
    situation_en: "A customer's order is delayed. You're customer service.",
    task_vi: "Xin lỗi khách và đưa ETA mới.",
    task_en: "Apologize to the customer and give a new ETA.",
    useful_phrases: [
      { th: "ต้องขออภัยในความล่าช้า", romanization: "dtɔ̂ng khɔ̌ɔ-à-phai nai khwaam lâa-cháa", vi: "Xin lỗi vì sự chậm trễ.", en: "I apologize for the delay." },
      { th: "คาดว่าจะถึงภายในพรุ่งนี้", romanization: "khâat wâa jà thʉ̌ng phaai-nai phrûng-níi", vi: "Dự kiến đến trong ngày mai.", en: "It's expected to arrive by tomorrow." },
    ],
    model_th: "ต้องขออภัยในความล่าช้าด้วยนะคะ พัสดุของลูกค้าคาดว่าจะถึงภายในพรุ่งนี้ และทางเราขอมอบส่วนลดค่าจัดส่งครั้งหน้าให้ค่ะ",
    model_vi: "Thành thật xin lỗi vì chậm trễ ạ; bưu kiện dự kiến đến trong ngày mai, và bên em xin tặng giảm phí giao hàng lần sau ạ.",
    model_en: "I'm sorry for the delay; your parcel is expected by tomorrow, and we'd like to offer a discount on your next shipping.",
    register_caution_vi: "Với khách giữ ค่ะ/ครับ đầy đủ + ทางเรา. Xin lỗi + ETA + bù đắp.",
    register_caution_en: "With customers keep full ค่ะ/ครับ + ทางเรา. Apology + ETA + a small make-good.",
    common_mistake_vi: "Chỉ xin lỗi mà không cho ETA mới — khách sẽ hỏi lại; luôn nêu mốc thời gian.",
    common_mistake_en: "Apologizing with no new ETA invites a follow-up; always give a timeframe.",
  },
  {
    id: "thai_case_delay_running_late_meeting",
    topic: "delay",
    situation_vi: "Bạn sẽ tới họp muộn 10 phút vì kẹt xe.",
    situation_en: "You'll be 10 minutes late to a meeting due to traffic.",
    task_vi: "Nhắn nhóm báo trễ ngắn gọn.",
    task_en: "Message the group with a short heads-up.",
    useful_phrases: [
      { th: "ขอสายประมาณสิบนาทีนะครับ", romanization: "khɔ̌ɔ sǎai bprà-maan sìp naa-thii ná kráp", vi: "Cho mình trễ khoảng 10 phút nhé.", en: "I'll be about 10 minutes late." },
      { th: "เริ่มก่อนได้เลยครับ", romanization: "rə̂əm gɔ̀ɔn dâai looei kráp", vi: "Mọi người bắt đầu trước nhé.", en: "Please start without me." },
    ],
    model_th: "ขอโทษครับ รถติดมาก ขอสายประมาณสิบนาที เริ่มประชุมก่อนได้เลยนะครับ",
    model_romanization: "khɔ̌ɔ-thôot kráp, rót-dtìt mâak, khɔ̌ɔ sǎai bprà-maan sìp naa-thii, rə̂əm bprà-chum gɔ̀ɔn dâai looei ná kráp",
    model_vi: "Xin lỗi, kẹt xe quá, cho mình trễ khoảng 10 phút; mọi người bắt đầu họp trước nhé.",
    model_en: "Sorry, heavy traffic — I'll be ~10 minutes late; please start the meeting without me.",
    register_caution_vi: "Nội bộ đồng nghiệp: ครับ là đủ. Mời bắt đầu trước cho lịch sự.",
    register_caution_en: "Internal peers: ครับ is enough. Inviting them to start is courteous.",
    common_mistake_vi: "Báo trễ không nêu số phút cụ thể; 'แป๊บนึง' mơ hồ gây khó cho người chờ.",
    common_mistake_en: "Not stating the minutes; a vague 'a sec' is unhelpful to those waiting.",
  },

  // ── Negotiation ────────────────────────────────────────────────────────────
  {
    id: "thai_case_negotiation_bulk_price",
    topic: "negotiation",
    situation_vi: "Bạn mua sỉ và muốn giá tốt hơn từ nhà cung cấp.",
    situation_en: "You're buying in bulk and want a better price from a supplier.",
    task_vi: "Thương lượng giá gắn với số lượng.",
    task_en: "Negotiate price tied to volume.",
    useful_phrases: [
      { th: "ถ้าสั่งจำนวนมาก ลดได้บ้างไหมครับ", romanization: "thâa sàng jam-nuan mâak, lót dâai bâang mǎi kráp", vi: "Nếu đặt nhiều, giảm được không?", en: "Any discount for a large order?" },
      { th: "เจอกันครึ่งทางได้ไหมครับ", romanization: "jəə gan khrʉ̂ng-thaang dâai mǎi kráp", vi: "Gặp nhau ở giữa được không?", en: "Can we meet halfway?" },
    ],
    model_th: "ถ้าผมสั่งเกินหนึ่งพันชิ้น พอจะปรับราคาลงอีกหน่อยได้ไหมครับ ถ้าเจอกันครึ่งทางผมว่าน่าจะดีทั้งสองฝ่ายครับ",
    model_vi: "Nếu tôi đặt trên 1.000 cái, có thể giảm giá thêm chút không ạ? Nếu gặp nhau ở giữa thì tôi nghĩ tốt cho cả hai ạ.",
    model_en: "If I order over 1,000 units, could you bring the price down a bit more? Meeting halfway would work for both of us.",
    register_caution_vi: "B2B vẫn giữ ครับ/ค่ะ. พอจะ…ได้ไหม nghe mềm, không ép.",
    register_caution_en: "B2B still keeps ครับ/ค่ะ. พอจะ…ได้ไหม sounds soft, not pushy.",
    common_mistake_vi: "Đòi giảm trống không ('ลดหน่อย') không gắn điều kiện — nêu số lượng để có đòn bẩy.",
    common_mistake_en: "Demanding a cut with no condition; tie it to volume for leverage.",
  },
  {
    id: "thai_case_negotiation_salary",
    topic: "negotiation",
    situation_vi: "Bạn muốn đề nghị tăng lương dựa trên kết quả công việc.",
    situation_en: "You want to request a raise based on your results.",
    task_vi: "Mở thương lượng lương lịch sự, nêu căn cứ trước.",
    task_en: "Open a salary talk politely, leading with justification.",
    useful_phrases: [
      { th: "ผมอยากปรึกษาเรื่องการปรับเงินเดือน", romanization: "phǒm yàak bprʉ̀k-sǎa rʉ̂ang gaan bpràp ngən-dʉan", vi: "Tôi muốn trao đổi về điều chỉnh lương.", en: "I'd like to discuss a salary adjustment." },
      { th: "จากผลงานที่ผ่านมา", romanization: "jàak phǒn-ngaan thîi phàan maa", vi: "Từ kết quả thời gian qua.", en: "Based on my recent results." },
    ],
    model_th: "จากผลงานและความรับผิดชอบที่เพิ่มขึ้นในปีที่ผ่านมา ผมจึงอยากขอปรึกษาเรื่องการปรับเงินเดือนกับพี่ครับ",
    model_vi: "Từ kết quả và trách nhiệm tăng thêm trong năm qua, em muốn xin trao đổi với anh về điều chỉnh lương ạ.",
    model_en: "Given my results and added responsibilities over the past year, I'd like to discuss a salary adjustment with you.",
    register_caution_vi: "ปรึกษา nghe nhẹ hơn เรียกร้อง (đòi hỏi). Trang trọng với cấp trên.",
    register_caution_en: "ปรึกษา ('consult') is softer than 'demand'. Formal with a superior.",
    common_mistake_vi: "Nêu yêu cầu lương trước khi đưa căn cứ — đảo lại: căn cứ trước, đề nghị sau.",
    common_mistake_en: "Stating the ask before the justification; flip it — reasons first, request second.",
    native_review: "deferred",
  },
  {
    id: "thai_case_negotiation_scope_split",
    topic: "negotiation",
    situation_vi: "Khách thêm yêu cầu khiến phạm vi tăng. Bạn muốn chia giai đoạn.",
    situation_en: "The client adds requests, growing the scope. You want to phase it.",
    task_vi: "Đề xuất chia hai giai đoạn để giữ chất lượng.",
    task_en: "Propose splitting into two phases to protect quality.",
    useful_phrases: [
      { th: "ขอบเขตงานเพิ่มขึ้นพอสมควร", romanization: "khɔ̀ɔp-kèet ngaan phə̂əm khʉ̂n phɔɔ-sǒm-khuan", vi: "Phạm vi tăng khá nhiều.", en: "The scope has grown considerably." },
      { th: "ขอเสนอให้แบ่งเป็นสองเฟส", romanization: "khɔ̌ɔ sà-nə̌ə hâi bɛ̀ng bpen sɔ̌ɔng féet", vi: "Xin đề xuất chia hai giai đoạn.", en: "I propose splitting into two phases." },
    ],
    model_th: "เนื่องจากขอบเขตงานเพิ่มขึ้นพอสมควร ผมขอเสนอให้แบ่งเป็นสองเฟส เพื่อให้คุณภาพงานคงที่และส่งได้ตรงเวลาครับ",
    model_vi: "Do phạm vi tăng khá nhiều, em xin đề xuất chia hai giai đoạn để giữ chất lượng ổn định và giao đúng hạn ạ.",
    model_en: "As the scope has grown considerably, I propose two phases to keep quality consistent and deliver on time.",
    register_caution_vi: "ขอเสนอ trang trọng, xây dựng. Nêu thực tế → đề xuất, không phàn nàn.",
    register_caution_en: "ขอเสนอ is formal and constructive. State the reality → propose, don't complain.",
    common_mistake_vi: "Im lặng nhận thêm việc rồi trễ — nêu phạm vi sớm và đề xuất giải pháp.",
    common_mistake_en: "Silently absorbing scope then slipping; raise it early with a solution.",
    native_review: "deferred",
  },

  // ── Supplier ───────────────────────────────────────────────────────────────
  {
    id: "thai_case_supplier_request_quote",
    topic: "supplier",
    situation_vi: "Bạn cần báo giá cho 500 sản phẩm từ nhà cung cấp mới.",
    situation_en: "You need a quote for 500 units from a new supplier.",
    task_vi: "Viết email xin báo giá, nêu số lượng và mốc thời gian.",
    task_en: "Email a quote request with quantity and timeline.",
    useful_phrases: [
      { th: "รบกวนขอใบเสนอราคา", romanization: "róp-guan khɔ̌ɔ bai-sà-nə̌ə-raa-khaa", vi: "Phiền gửi báo giá.", en: "Please send a quotation." },
      { th: "ใช้เวลาผลิตกี่วันครับ", romanization: "chái wee-laa phà-lìt gìi wan kráp", vi: "Sản xuất mất bao nhiêu ngày?", en: "How many days for production?" },
    ],
    model_th: "เรียนทีมขาย รบกวนขอใบเสนอราคาสินค้ารายการนี้ จำนวน 500 ชิ้น พร้อมระยะเวลาผลิตและจัดส่งด้วยครับ ขอบคุณครับ",
    model_vi: "Kính gửi đội bán hàng, phiền gửi báo giá mặt hàng này, số lượng 500 cái, kèm thời gian sản xuất và giao hàng ạ. Cảm ơn ạ.",
    model_en: "Dear Sales Team, please send a quotation for this item, 500 units, with production and delivery times. Thank you.",
    register_caution_vi: "B2B email: เรียน + ครับ. Nêu lượng từ ชิ้น + số rõ ràng.",
    register_caution_en: "B2B email: เรียน + ครับ. Include the classifier ชิ้น + a clear number.",
    common_mistake_vi: "Quên lượng từ sau số (500 ชิ้น), hoặc xin báo giá mà không nói số lượng.",
    common_mistake_en: "Dropping the classifier after the number, or requesting a quote with no quantity.",
  },
  {
    id: "thai_case_supplier_chase_order",
    topic: "supplier",
    situation_vi: "Lô hàng từ nhà cung cấp quen sắp tới hạn, bạn hỏi tiến độ.",
    situation_en: "A batch from a familiar supplier is nearly due; you check progress.",
    task_vi: "Nhắn hỏi tiến độ một cách thân thiện nhưng vẫn lịch sự.",
    task_en: "Message to check progress, friendly but still polite.",
    useful_phrases: [
      { th: "ของล็อตนี้คืบหน้าเป็นไงบ้างครับ", romanization: "khɔ̌ɔng lɔ́t níi khʉ̂ʉp-nâa bpen ngai bâang kráp", vi: "Lô này tiến độ sao rồi?", en: "How's this batch coming along?" },
      { th: "ใกล้ได้รึยังครับ", romanization: "glâi dâai rʉ́-yang kráp", vi: "Sắp xong chưa?", en: "Nearly ready?" },
    ],
    model_th: "พี่ครับ ของล็อตนี้คืบหน้าเป็นไงบ้างครับ ใกล้ได้รึยัง ถ้ามีอะไรติดขัดบอกได้เลยนะครับ",
    model_vi: "Anh ơi, lô này tiến độ sao rồi ạ, sắp xong chưa? Nếu có gì vướng cứ báo em nhé.",
    model_en: "Phi, how's this batch progressing — nearly ready? If anything's stuck, just let me know.",
    register_caution_vi: "Với đối tác quen có thể thân mật hơn nhưng VẪN giữ ครับ. Đối tác mới phải trang trọng.",
    register_caution_en: "With a familiar partner you can be warmer but STILL keep ครับ. A new partner needs formal.",
    common_mistake_vi: "Bỏ hết particle vì 'quen rồi' — vẫn nghe cộc trong ngữ cảnh công việc.",
    common_mistake_en: "Dropping all particles because you're 'familiar' still reads blunt at work.",
  },
  {
    id: "thai_case_supplier_negotiate_moq",
    topic: "supplier",
    situation_vi: "Số lượng đặt tối thiểu (MOQ) của nhà cung cấp quá cao cho bạn.",
    situation_en: "The supplier's minimum order quantity is too high for you.",
    task_vi: "Thương lượng giảm MOQ một cách lịch sự.",
    task_en: "Negotiate a lower MOQ politely.",
    useful_phrases: [
      { th: "ขั้นต่ำสูงไปนิดครับ", romanization: "khân-dtàm sǔung bpai nít kráp", vi: "Mức tối thiểu hơi cao.", en: "The minimum is a bit high." },
      { th: "พอจะปรับลดได้บ้างไหมครับ", romanization: "phɔɔ jà bpràp lót dâai bâang mǎi kráp", vi: "Có thể giảm chút nào không?", en: "Could it be lowered a little?" },
    ],
    model_th: "ขั้นต่ำในการสั่งซื้อสูงไปนิดสำหรับเราครับ ถ้าเริ่มจากจำนวนน้อยกว่านี้ก่อนได้ พอจะปรับขั้นต่ำลงได้บ้างไหมครับ",
    model_vi: "Mức đặt tối thiểu hơi cao với bên em ạ; nếu bắt đầu từ số lượng ít hơn trước được, có thể giảm mức tối thiểu chút nào không ạ?",
    model_en: "The MOQ is a bit high for us; if we could start smaller, would you be able to lower the minimum somewhat?",
    register_caution_vi: "Lịch sự + có lý do (bắt đầu nhỏ). พอจะ…ได้บ้างไหม mềm mại.",
    register_caution_en: "Polite + a reason (start small). พอจะ…ได้บ้างไหม keeps it gentle.",
    common_mistake_vi: "Từ chối thẳng MOQ rồi bỏ đi — đề nghị phương án đơn thử trước.",
    common_mistake_en: "Flatly rejecting the MOQ and walking; propose a trial order first.",
  },

  // ── Customer service ───────────────────────────────────────────────────────
  {
    id: "thai_case_cs_out_of_stock",
    topic: "customer_service",
    situation_vi: "Khách muốn mua món đã hết hàng. Bạn là nhân viên.",
    situation_en: "A customer wants an out-of-stock item. You're the staff.",
    task_vi: "Xin lỗi và đề xuất phương án thay thế.",
    task_en: "Apologize and offer an alternative.",
    useful_phrases: [
      { th: "ตอนนี้สินค้าหมดค่ะ", romanization: "dtɔɔn-níi sǐn-kháa mòt kâ", vi: "Hiện hết hàng ạ.", en: "It's out of stock now." },
      { th: "รับเป็นแบบอื่นก่อนไหมคะ", romanization: "ráp bpen bɛ̀ɛp ʉ̀ʉn gɔ̀ɔn mǎi ká", vi: "Lấy mẫu khác trước không ạ?", en: "Would you like a different option?" },
    ],
    model_th: "ขออภัยด้วยนะคะ ตอนนี้สินค้าหมด แต่จะเข้าใหม่สัปดาห์หน้า ระหว่างนี้รับเป็นรุ่นใกล้เคียงก่อนไหมคะ",
    model_vi: "Xin lỗi ạ, hiện hết hàng nhưng tuần sau có lại; trong lúc đó anh/chị lấy mẫu tương tự trước không ạ?",
    model_en: "I'm sorry, it's out of stock but restocks next week; in the meantime would you like a similar model?",
    register_caution_vi: "Với khách luôn particle đầy đủ. Câu hỏi dùng คะ, câu kể dùng ค่ะ.",
    register_caution_en: "With customers always full particles. Questions take คะ, statements ค่ะ.",
    common_mistake_vi: "Nói cụt 'หมด' rồi dừng — luôn kèm phương án/thời điểm có lại.",
    common_mistake_en: "Saying a bare 'out' and stopping; always add an alternative or restock date.",
  },
  {
    id: "thai_case_cs_angry_customer",
    topic: "customer_service",
    situation_vi: "Khách tức giận vì dịch vụ kém. Bạn cần xoa dịu.",
    situation_en: "A customer is angry about poor service. You need to de-escalate.",
    task_vi: "Đồng cảm, xin lỗi, cam kết xử lý.",
    task_en: "Empathize, apologize, commit to fixing it.",
    useful_phrases: [
      { th: "เข้าใจความรู้สึกของลูกค้าค่ะ", romanization: "khâo-jai khwaam-rúu-sʉ̀k khɔ̌ɔng lûuk-kháa kâ", vi: "Em hiểu cảm giác của anh/chị ạ.", en: "I understand how you feel." },
      { th: "เดี๋ยวเราจะรีบแก้ไขให้ค่ะ", romanization: "dǐao rao jà rîip gɛ̂ɛ-khǎi hâi kâ", vi: "Bên em sẽ xử lý ngay ạ.", en: "We'll fix it right away." },
    ],
    model_th: "ต้องขออภัยจริงๆ ค่ะ เข้าใจความรู้สึกของลูกค้าเลย เดี๋ยวเราจะรีบดูแลและแก้ไขให้เร็วที่สุดนะคะ",
    model_vi: "Thành thật xin lỗi ạ, em hiểu cảm giác của anh/chị; bên em sẽ khẩn trương xử lý sớm nhất ạ.",
    model_en: "I'm truly sorry; I understand how you feel — we'll take care of it as fast as possible.",
    register_caution_vi: "Giữ ใจเย็น (bình tĩnh) và particle. Cao giọng = bạn thua dù đúng.",
    register_caution_en: "Stay 'cool-hearted' and keep particles. Raising your voice means you lose, even if right.",
    common_mistake_vi: "Đáp lại sự tức giận bằng phòng thủ/đôi co — đồng cảm trước đã.",
    common_mistake_en: "Meeting anger with defensiveness; empathize first.",
  },
  {
    id: "thai_case_cs_thanks_loyalty",
    topic: "customer_service",
    situation_vi: "Khách quen vừa mua xong. Bạn muốn cảm ơn và giữ chân.",
    situation_en: "A regular customer just bought something. You want to thank and retain them.",
    task_vi: "Cảm ơn và mời quay lại ấm áp.",
    task_en: "Thank them and warmly invite them back.",
    useful_phrases: [
      { th: "ขอบคุณที่อุดหนุนนะคะ", romanization: "khɔ̀ɔp-khun thîi ùt-nǔn ná ká", vi: "Cảm ơn đã ủng hộ ạ.", en: "Thank you for your support." },
      { th: "แล้วพบกันใหม่ค่ะ", romanization: "lɛ́ɛw phóp gan mài kâ", vi: "Hẹn gặp lại ạ.", en: "See you again." },
    ],
    model_th: "ขอบคุณที่อุดหนุนเป็นประจำนะคะ ครั้งหน้ามีโปรโมชั่นพิเศษสำหรับลูกค้าประจำ แล้วพบกันใหม่ค่ะ",
    model_vi: "Cảm ơn anh/chị đã thường xuyên ủng hộ ạ; lần sau có ưu đãi riêng cho khách quen, hẹn gặp lại ạ.",
    model_en: "Thank you for being a regular; next time there's a special promo for loyal customers — see you again.",
    register_caution_vi: "Dịch vụ giữ ค่ะ/ครับ ngay cả khi khách không đáp. Ấm áp, không sáo rỗng.",
    register_caution_en: "Service keeps ค่ะ/ครับ even if the customer doesn't reply. Warm, not robotic.",
    common_mistake_vi: "Cảm ơn máy móc, quên mời quay lại — bỏ lỡ cơ hội giữ chân.",
    common_mistake_en: "A robotic thanks with no invitation back misses the retention moment.",
  },

  // ── Schedule change ────────────────────────────────────────────────────────
  {
    id: "thai_case_schedule_move_delivery",
    topic: "schedule_change",
    situation_vi: "Bạn cần dời lịch bàn giao từ thứ Sáu sang thứ Hai với đối tác.",
    situation_en: "You need to move a delivery from Friday to Monday with a partner.",
    task_vi: "Xin dời lịch và đề xuất khung giờ mới.",
    task_en: "Request the move and propose a new slot.",
    useful_phrases: [
      { th: "รบกวนขอเลื่อนนัด", romanization: "róp-guan khɔ̌ɔ lʉ̂an nát", vi: "Phiền cho dời hẹn.", en: "Could we reschedule." },
      { th: "จากวันศุกร์เป็นวันจันทร์", romanization: "jàak wan sùk bpen wan jan", vi: "Từ thứ Sáu sang thứ Hai.", en: "From Friday to Monday." },
    ],
    model_th: "รบกวนขอเลื่อนนัดส่งมอบจากวันศุกร์เป็นวันจันทร์ เวลา 10 โมงเช้าได้ไหมคะ ขออภัยในความไม่สะดวกด้วยค่ะ",
    model_vi: "Phiền cho dời lịch bàn giao từ thứ Sáu sang thứ Hai, 10 giờ sáng được không ạ? Xin lỗi vì sự bất tiện ạ.",
    model_en: "Could we move the handover from Friday to Monday at 10 am? Sorry for the inconvenience.",
    register_caution_vi: "เลื่อน…จาก X เป็น Y + đề xuất giờ cụ thể. Trang trọng với đối tác.",
    register_caution_en: "เลื่อน…จาก X เป็น Y + propose a concrete time. Formal with a partner.",
    common_mistake_vi: "Dùng ย้าย (dời chỗ) thay เลื่อน (dời thời gian).",
    common_mistake_en: "Using ย้าย (move location) instead of เลื่อน (move in time).",
  },
  {
    id: "thai_case_schedule_propose_slots",
    topic: "schedule_change",
    situation_vi: "Bạn cần đặt lại lịch họp và muốn chốt nhanh.",
    situation_en: "You need to reset a meeting and want to settle it fast.",
    task_vi: "Đưa hai khung giờ để đối phương chọn.",
    task_en: "Offer two slots for them to choose.",
    useful_phrases: [
      { th: "เลือกเวลาที่สะดวกได้เลยนะคะ", romanization: "lʉ̂ak wee-laa thîi sà-dùak dâai looei ná ká", vi: "Cứ chọn giờ tiện nhé ạ.", en: "Please pick whichever suits you." },
      { th: "อังคารบ่าย หรือพุธเช้า", romanization: "ang-khaan bàai rʉ̌ʉ phút cháao", vi: "Chiều thứ Ba hoặc sáng thứ Tư.", en: "Tuesday afternoon or Wednesday morning." },
    ],
    model_th: "รบกวนเลือกเวลาที่สะดวกระหว่างวันอังคารบ่าย หรือวันพุธเช้านะคะ แล้วดิฉันจะยืนยันให้อีกครั้งค่ะ",
    model_vi: "Phiền chọn giờ tiện giữa chiều thứ Ba hoặc sáng thứ Tư ạ, rồi em sẽ xác nhận lại ạ.",
    model_en: "Please pick whichever suits you — Tuesday afternoon or Wednesday morning — and I'll reconfirm.",
    register_caution_vi: "Đưa lựa chọn cụ thể giảm qua lại. Hứa xác nhận lại để chốt chắc.",
    register_caution_en: "Concrete options reduce back-and-forth. Promise to reconfirm to lock it in.",
    common_mistake_vi: "Hỏi mở 'khi nào tiện' — chuỗi tin nhắn kéo dài; đưa lựa chọn cụ thể.",
    common_mistake_en: "Asking an open 'when are you free' drags on; offer concrete choices.",
  },

  // ── Invoice ────────────────────────────────────────────────────────────────
  {
    id: "thai_case_invoice_payment_reminder",
    topic: "invoice",
    situation_vi: "Hóa đơn #102 sắp đến hạn. Bạn nhắc khách thanh toán.",
    situation_en: "Invoice #102 is nearly due. You remind the client to pay.",
    task_vi: "Nhắc thanh toán lịch sự, nêu số hóa đơn và hạn.",
    task_en: "Send a polite payment reminder with the invoice number and due date.",
    useful_phrases: [
      { th: "รบกวนแจ้งเตือนนะคะ", romanization: "róp-guan jɛ̂ɛng-dtʉan ná ká", vi: "Em xin nhắc nhẹ ạ.", en: "Just a gentle reminder." },
      { th: "ครบกำหนดชำระวันที่ 30", romanization: "khróp gam-nòt cham-rá wan-thîi sǎam-sìp", vi: "Đến hạn thanh toán ngày 30.", en: "Due for payment on the 30th." },
    ],
    model_th: "เรียนคุณลูกค้า รบกวนแจ้งเตือนนะคะ ใบแจ้งหนี้เลขที่ 102 ครบกำหนดชำระวันที่ 30 นี้ หากชำระแล้วขออภัยที่รบกวนค่ะ",
    model_vi: "Kính gửi quý khách, em xin nhắc nhẹ ạ, hóa đơn số 102 đến hạn thanh toán ngày 30 này; nếu đã thanh toán xin lỗi đã làm phiền ạ.",
    model_en: "Dear Customer, a gentle reminder: invoice #102 is due on the 30th; if you've already paid, apologies for the nudge.",
    register_caution_vi: "Nhắc nợ giữ lịch sự (รบกวน + แจ้งเตือน). Câu 'nếu đã thanh toán xin lỗi' giảm áp lực.",
    register_caution_en: "Keep payment reminders polite (รบกวน + แจ้งเตือน). The 'if already paid, sorry' line lowers pressure.",
    common_mistake_vi: "Nhắc nợ gay gắt làm hỏng quan hệ; giữ giọng nhẹ, nêu số hóa đơn cụ thể.",
    common_mistake_en: "A harsh dunning note damages the relationship; stay gentle, cite the specific invoice.",
  },
  {
    id: "thai_case_invoice_dispute",
    topic: "invoice",
    situation_vi: "Hóa đơn có khoản không khớp thỏa thuận. Bạn khiếu nại.",
    situation_en: "The invoice has an amount not matching the agreement. You dispute it.",
    task_vi: "Nêu sai lệch khách quan và nhờ kiểm tra.",
    task_en: "State the discrepancy objectively and ask for a check.",
    useful_phrases: [
      { th: "มียอดที่ไม่ตรงกับที่ตกลงไว้", romanization: "mii yɔ̂ɔt thîi mâi dtrong gàp thîi dtòk-long wái", vi: "Có khoản không khớp thỏa thuận.", en: "An amount doesn't match what we agreed." },
      { th: "รบกวนตรวจสอบและแก้ไข", romanization: "róp-guan dtrùat-sɔ̀ɔp lɛ́ gɛ̂ɛ-khǎi", vi: "Phiền kiểm tra và sửa.", en: "Please check and correct it." },
    ],
    model_th: "ในใบแจ้งหนี้มียอดรายการที่สามที่ไม่ตรงกับที่ตกลงกันไว้ รบกวนช่วยตรวจสอบและออกใบใหม่ให้ด้วยครับ ขอบคุณครับ",
    model_vi: "Trong hóa đơn có khoản ở mục thứ ba không khớp với thỏa thuận; phiền kiểm tra và xuất lại hóa đơn mới giúp ạ. Cảm ơn ạ.",
    model_en: "On the invoice, the third line item doesn't match what we agreed; please check and reissue it. Thank you.",
    register_caution_vi: "Khiếu nại hóa đơn nêu mục cụ thể, không buộc tội. Trang trọng B2B.",
    register_caution_en: "An invoice dispute names the specific line, no accusation. Formal B2B.",
    common_mistake_vi: "Nói chung 'tính sai' không chỉ mục nào — nêu mục/khoản cụ thể.",
    common_mistake_en: "Saying 'it's wrong' without pointing to the line; cite the specific item.",
  },

  // ── Refund ─────────────────────────────────────────────────────────────────
  {
    id: "thai_case_refund_faulty_product",
    topic: "refund",
    situation_vi: "Bạn là khách, sản phẩm lỗi ngay khi mở hộp, muốn hoàn tiền.",
    situation_en: "You're the customer; the product was faulty out of the box and you want a refund.",
    task_vi: "Yêu cầu hoàn tiền, viện bằng chứng và chính sách.",
    task_en: "Request a refund, citing evidence and policy.",
    useful_phrases: [
      { th: "สินค้าชำรุดตั้งแต่เปิดกล่อง", romanization: "sǐn-kháa cham-rút dtâng-dtɛ̀ɛ bpəət glɔ̀ng", vi: "Hàng lỗi ngay khi mở hộp.", en: "Faulty right out of the box." },
      { th: "ขอคืนเงินเต็มจำนวน", romanization: "khɔ̌ɔ khʉʉn-ngən dtem jam-nuan", vi: "Xin hoàn toàn bộ tiền.", en: "I request a full refund." },
    ],
    model_th: "สินค้าที่ได้รับชำรุดตั้งแต่เปิดกล่อง ผมมีใบเสร็จและรูปถ่ายเป็นหลักฐาน ตามนโยบายรับประกัน ผมขอคืนเงินเต็มจำนวน ไม่ทราบว่าต้องดำเนินการอย่างไรต่อครับ",
    model_vi: "Hàng nhận bị lỗi ngay khi mở hộp; tôi có hóa đơn và ảnh làm bằng chứng. Theo chính sách bảo hành, tôi xin hoàn toàn bộ tiền; không biết cần làm thủ tục gì tiếp ạ?",
    model_en: "The item was faulty out of the box; I have the receipt and photos as evidence. Per the warranty policy, I request a full refund. What are the next steps?",
    register_caution_vi: "Khách khiếu nại trang trọng: ทราบ thay รู้, ดำเนินการ thay ทำ. Bình tĩnh + giấy tờ.",
    register_caution_en: "Formal complaint register: ทราบ over รู้, ดำเนินการ over ทำ. Calm + documents.",
    common_mistake_vi: "Yêu cầu mơ hồ 'giúp tôi' — nêu rõ 'คืนเงินเต็มจำนวน' và đưa bằng chứng.",
    common_mistake_en: "A vague 'help me'; be explicit ('full refund') and present evidence.",
    native_review: "deferred",
  },
  {
    id: "thai_case_refund_offer_alternative",
    topic: "refund",
    situation_vi: "Bạn là nhân viên, muốn đề xuất tín dụng cửa hàng thay vì hoàn tiền.",
    situation_en: "You're staff and want to offer store credit instead of a cash refund.",
    task_vi: "Đề xuất phương án thay nhưng để khách quyết.",
    task_en: "Offer an alternative but let the customer decide.",
    useful_phrases: [
      { th: "ยินดีคืนเงินให้ค่ะ", romanization: "yin-dii khʉʉn-ngən hâi kâ", vi: "Sẵn lòng hoàn tiền ạ.", en: "We're happy to refund you." },
      { th: "หรือรับเป็นเครดิตร้าน", romanization: "rʉ̌ʉ ráp bpen khree-dìt ráan", vi: "Hoặc nhận tín dụng cửa hàng.", en: "Or take store credit." },
    ],
    model_th: "ทางเรายินดีคืนเงินเต็มจำนวนค่ะ หรือหากลูกค้าสะดวก รับเป็นเครดิตร้านมูลค่าเท่ากันก็ได้ ลูกค้าสะดวกแบบไหนคะ",
    model_vi: "Bên em sẵn lòng hoàn toàn bộ ạ, hoặc nếu anh/chị tiện thì nhận tín dụng cửa hàng giá trị tương đương cũng được; anh/chị tiện cách nào ạ?",
    model_en: "We're happy to give a full refund, or if you prefer, store credit of equal value — which works for you?",
    register_caution_vi: "Đưa lựa chọn, không ép. Trang trọng với khách, particle đầy đủ.",
    register_caution_en: "Offer a choice, no pressure. Formal with customers, full particles.",
    common_mistake_vi: "Ép tín dụng thay vì hoàn tiền — luôn để khách chọn, mặc định tôn trọng quyền hoàn tiền.",
    common_mistake_en: "Pushing credit over cash; always let the customer choose, default to respecting the refund right.",
  },

  // ── Escalation ─────────────────────────────────────────────────────────────
  {
    id: "thai_case_escalation_to_manager",
    topic: "escalation",
    situation_vi: "Vấn đề khách vượt thẩm quyền bạn. Bạn chuyển lên quản lý.",
    situation_en: "The customer's issue is beyond your authority. You escalate to a manager.",
    task_vi: "Chuyển cấp như một lợi ích cho khách, kèm cam kết thời gian.",
    task_en: "Escalate as a benefit to the customer, with a time commitment.",
    useful_phrases: [
      { th: "ขออนุญาตส่งต่อให้หัวหน้า", romanization: "khɔ̌ɔ à-nú-yâat sòng-dtɔ̀ɔ hâi hǔa-nâa", vi: "Cho em chuyển lên cấp trên.", en: "Allow me to escalate to my supervisor." },
      { th: "ติดต่อกลับภายใน 24 ชั่วโมง", romanization: "dtìt-dtɔ̀ɔ glàp phaai-nai yîi-sìp-sìi chûa-moong", vi: "Liên hệ lại trong 24 giờ.", en: "Get back to you within 24 hours." },
    ],
    model_th: "เรื่องนี้ขออนุญาตส่งต่อให้หัวหน้าดูแลนะคะ เพื่อให้ได้รับการแก้ไขที่ดีที่สุด ทีมจะติดต่อกลับภายใน 24 ชั่วโมงค่ะ",
    model_vi: "Việc này cho em chuyển lên cấp trên xử lý ạ, để được giải quyết tốt nhất; đội phụ trách sẽ liên hệ lại trong 24 giờ ạ.",
    model_en: "Allow me to escalate this to my supervisor for the best resolution; the team will get back to you within 24 hours.",
    register_caution_vi: "Đóng khung escalate như lợi ích, không đùn đẩy. Cam kết thời gian cụ thể.",
    register_caution_en: "Frame escalation as a benefit, not buck-passing. Commit to a concrete time.",
    common_mistake_vi: "Chuyển cấp kiểu 'không phải việc tôi' — nghe đùn đẩy; nhấn 'để xử lý tốt nhất'.",
    common_mistake_en: "Escalating as 'not my job' sounds like buck-passing; stress 'for the best resolution'.",
  },
  {
    id: "thai_case_escalation_customer_demands",
    topic: "escalation",
    situation_vi: "Bạn là khách, vấn đề chưa được giải quyết, muốn gặp quản lý.",
    situation_en: "You're the customer; the issue isn't resolved and you ask for a manager.",
    task_vi: "Yêu cầu lên cấp nhưng vẫn lịch sự, không gắt.",
    task_en: "Ask to escalate while staying polite, not aggressive.",
    useful_phrases: [
      { th: "เรื่องยังไม่ได้รับการแก้ไข", romanization: "rʉ̂ang yang mâi dâai-ráp gaan gɛ̂ɛ-khǎi", vi: "Việc chưa được giải quyết.", en: "The matter isn't resolved." },
      { th: "ขอคุยกับผู้จัดการได้ไหมครับ", romanization: "khɔ̌ɔ khui gàp phûu-jàt-gaan dâai mǎi kráp", vi: "Tôi xin gặp quản lý được không?", en: "May I speak with the manager?" },
    ],
    model_th: "เรื่องนี้ยังไม่ได้รับการแก้ไขมาหลายวันแล้ว ไม่ทราบว่าผมขอคุยกับผู้จัดการได้ไหมครับ จะได้หาทางออกร่วมกัน",
    model_vi: "Việc này vẫn chưa được giải quyết mấy ngày rồi; không biết tôi xin gặp quản lý được không ạ, để cùng tìm hướng giải quyết.",
    model_en: "This still hasn't been resolved after several days; may I speak with the manager so we can find a way forward?",
    register_caution_vi: "Dù bức xúc vẫn giữ ครับ + ขอ…ได้ไหม. Cao giọng khiến bạn bất lợi.",
    register_caution_en: "Even when frustrated, keep ครับ + ขอ…ได้ไหม. Raising your voice works against you.",
    common_mistake_vi: "Đe dọa hay quát — trong văn hóa Thái làm mất thiện cảm; giữ điềm tĩnh.",
    common_mistake_en: "Threatening or shouting loses sympathy in Thai culture; stay composed.",
  },
];

export default caseStudies;
