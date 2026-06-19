// src/languages/thai/workplace.ts
//
// Thai workplace / professional phrase bank for Vietnamese-speaking and
// English-speaking learners (CEFR A2–C2). Self-contained like the other Thai
// modules: inline types, exported array, no shared ./lessons dependency.
//
// Each item is a ready-to-use workplace line: Thai script, romanization (where
// it helps), Vietnamese + English glosses, a register tag, and a POLITE-vs-
// CASUAL note — the thing that trips up learners most at work, where pronoun
// and particle choice signal hierarchy. Many items include the other-register
// variant in `alt_th` so the contrast is concrete.
//
// Romanization tone letters: (M)/(L)/(F)/(H)/(R); "ph/th/kh" aspirated;
// "dt/bp" unaspirated ต/ป.
//
// Native review: DEFERRED. Hand-derived for pedagogy; not validated by a
// native Thai reviewer.

export type ThaiCefrLevel = "A2" | "B1" | "B2" | "C1" | "C2";

export type ThaiWorkplaceTopic =
  | "first_day"
  | "schedule"
  | "task_clarification"
  | "safety"
  | "apology"
  | "delay"
  | "handoff"
  | "supervisor"
  | "customer"
  | "disagreement"
  | "meeting"
  | "formal_email"
  | "negotiation";

export type ThaiRegister = "casual" | "polite" | "formal";

export type ThaiWorkplaceItem = {
  id: string;
  level: ThaiCefrLevel;
  topic: ThaiWorkplaceTopic;
  /** The Thai line. */
  th: string;
  /** Romanization with tone letters, where useful. */
  romanization?: string;
  vi: string;
  en: string;
  /** Register of `th`. */
  register: ThaiRegister;
  /** Optional other-register variant, so polite↔casual is concrete. */
  alt_th?: string;
  /** Polite-vs-casual usage note (VI). */
  note_vi: string;
  /** Polite-vs-casual usage note (EN). */
  note_en: string;
  native_review?: "deferred";
};

export const workplaceItems: ThaiWorkplaceItem[] = [
  // ── First day ──────────────────────────────────────────────────────────────
  {
    id: "thai_wp_firstday_intro",
    level: "A2",
    topic: "first_day",
    th: "สวัสดีครับ ผมชื่อนัม เป็นพนักงานใหม่ ฝากตัวด้วยนะครับ",
    romanization: "sà-wàt-dii kráp, phǒm chʉ̂ʉ Nam, bpen phá-nák-ngaan mài, fàak dtua dûai ná kráp",
    vi: "Chào mọi người, em tên Nam, nhân viên mới, mong mọi người giúp đỡ ạ.",
    en: "Hello, I'm Nam, the new employee — I look forward to working with you.",
    register: "polite",
    note_vi: "ฝากตัวด้วย là câu chào ra mắt rất Thái, gần như bắt buộc ngày đầu. Với bạn đồng trang lứa có thể bỏ ครับ thành thân mật.",
    note_en: "ฝากตัวด้วย ('please look after me') is the expected first-day greeting. Among same-level peers you can drop ครับ to sound casual.",
  },
  {
    id: "thai_wp_firstday_ask_help",
    level: "A2",
    topic: "first_day",
    th: "ถ้าผมทำอะไรผิด รบกวนบอกได้เลยนะครับ",
    romanization: "thâa phǒm tham à-rai phìt, róp-guan bɔ̀ɔk dâai looei ná kráp",
    vi: "Nếu em làm gì sai, mọi người cứ chỉ bảo nhé ạ.",
    en: "If I do anything wrong, please just tell me.",
    register: "polite",
    alt_th: "ถ้าผิดตรงไหนบอกได้เลยนะ",
    note_vi: "Bản polite giữ รบกวน + ครับ với người trên; bản casual (alt) bỏ đi khi nói với bạn cùng cấp.",
    note_en: "The polite form keeps รบกวน + ครับ for seniors; the casual alt drops them with same-level peers.",
  },
  {
    id: "thai_wp_firstday_where_is",
    level: "A2",
    topic: "first_day",
    th: "ขอโทษครับ ห้องน้ำอยู่ทางไหนครับ",
    romanization: "khɔ̌ɔ-thôot kráp, hɔ̂ng-náam yùu thaang nǎi kráp",
    vi: "Xin lỗi, nhà vệ sinh ở hướng nào ạ?",
    en: "Excuse me, which way is the restroom?",
    register: "polite",
    note_vi: "Mở bằng ขอโทษ khi hỏi người lạ trong công ty. Thân mật có thể chỉ 'ห้องน้ำไปทางไหน'.",
    note_en: "Open with ขอโทษ when asking a stranger at work. Casually you could just say 'ห้องน้ำไปทางไหน'.",
  },

  // ── Schedule ───────────────────────────────────────────────────────────────
  {
    id: "thai_wp_schedule_shift_time",
    level: "A2",
    topic: "schedule",
    th: "พรุ่งนี้ผมเข้ากะเช้า เริ่มแปดโมงครับ",
    romanization: "phrûng-níi phǒm khâo gà cháao, rə̂əm bpɛ̀ɛt moong kráp",
    vi: "Mai em vào ca sáng, bắt đầu 8 giờ ạ.",
    en: "Tomorrow I'm on the morning shift, starting at 8.",
    register: "polite",
    note_vi: "เข้ากะ = vào ca. Giờ đời thường dùng โมง (แปดโมง = 8 sáng). Casual bỏ ครับ với đồng nghiệp.",
    note_en: "เข้ากะ = work a shift. Everyday clock uses โมง (แปดโมง = 8 am). Casual drops ครับ with coworkers.",
  },
  {
    id: "thai_wp_schedule_swap",
    level: "B1",
    topic: "schedule",
    th: "รบกวนสลับกะกับผมวันเสาร์ได้ไหมครับ เดี๋ยวผมเข้าแทนวันอาทิตย์ให้",
    romanization: "róp-guan sà-làp gà gàp phǒm wan sǎo dâai mǎi kráp, dǐao phǒm khâo thɛɛn wan aa-thít hâi",
    vi: "Phiền đổi ca với em thứ Bảy được không, em trực bù cho anh Chủ nhật.",
    en: "Could you swap shifts with me on Saturday? I'll cover your Sunday.",
    register: "polite",
    note_vi: "Đề nghị có-đi-có-lại được đánh giá cao. Với bạn thân: 'สลับกะกันวันเสาร์ได้ปะ'.",
    note_en: "A reciprocal offer is valued. With a close friend: 'สลับกะกันวันเสาร์ได้ปะ' (very casual).",
  },
  {
    id: "thai_wp_schedule_overtime",
    level: "B1",
    topic: "schedule",
    th: "คืนนี้มีโอทีไหมครับ ถ้ามีผมยินดีอยู่ต่อ",
    romanization: "khʉʉn-níi mii oo-thii mǎi kráp, thâa mii phǒm yin-dii yùu dtɔ̀ɔ",
    vi: "Tối nay có tăng ca không ạ? Nếu có em sẵn lòng ở lại.",
    en: "Is there overtime tonight? If so, I'm happy to stay on.",
    register: "polite",
    note_vi: "โอที (OT) là từ vay quen dùng. ยินดี thể hiện thái độ tích cực với cấp trên.",
    note_en: "โอที (OT) is a common loanword. ยินดี signals a positive attitude to a superior.",
  },

  // ── Task clarification ─────────────────────────────────────────────────────
  {
    id: "thai_wp_task_confirm",
    level: "B1",
    topic: "task_clarification",
    th: "ขอเช็คให้แน่ใจนะครับ พี่ต้องการให้ผมส่งภายในวันนี้ใช่ไหมครับ",
    romanization: "khɔ̌ɔ chék hâi nɛ̂ɛ-jai ná kráp, phîi dtɔ̂ng-gaan hâi phǒm sòng phaai-nai wan-níi châi mǎi kráp",
    vi: "Cho em xác nhận lại nhé, anh muốn em gửi trong hôm nay đúng không ạ?",
    en: "Let me confirm — you want me to submit this by today, right?",
    register: "polite",
    note_vi: "Gọi cấp trên bằng พี่ an toàn hơn คุณ. Xác nhận lại tránh hiểu nhầm, được coi là chuyên nghiệp.",
    note_en: "Calling a senior พี่ is safer than คุณ. Confirming back avoids misunderstanding and reads as professional.",
  },
  {
    id: "thai_wp_task_priority",
    level: "B2",
    topic: "task_clarification",
    th: "ตอนนี้ผมมีสองงานพร้อมกัน รบกวนพี่ช่วยจัดลำดับความสำคัญให้หน่อยได้ไหมครับ",
    vi: "Hiện em có hai việc cùng lúc, phiền anh sắp xếp ưu tiên giúp em được không ạ?",
    en: "I have two tasks at once right now — could you help me prioritize them?",
    register: "polite",
    note_vi: "Hỏi ưu tiên thay vì tự quyết là cách khôn ngoan với sếp Thái. Casual với đồng nghiệp: 'อันไหนก่อนดี'.",
    note_en: "Asking for priority rather than deciding alone is savvy with a Thai boss. Casual peer form: 'อันไหนก่อนดี'.",
    native_review: "deferred",
  },
  {
    id: "thai_wp_task_format",
    level: "B1",
    topic: "task_clarification",
    th: "ไฟล์นี้ต้องการเป็น Excel หรือ PDF ดีครับ",
    romanization: "fai níi dtɔ̂ng-gaan bpen Excel rʉ̌ʉ PDF dii kráp",
    vi: "File này anh muốn Excel hay PDF ạ?",
    en: "Do you want this file as Excel or PDF?",
    register: "polite",
    note_vi: "Câu hỏi A หรือ B rất hữu dụng. Bỏ ครับ + thêm 'อ่ะ' thành cực kỳ thân mật.",
    note_en: "An 'A or B' question is handy. Drop ครับ + add 'อ่ะ' for a very casual tone.",
  },

  // ── Safety ─────────────────────────────────────────────────────────────────
  {
    id: "thai_wp_safety_warning",
    level: "A2",
    topic: "safety",
    th: "ระวังนะครับ พื้นเปียก เดินช้าๆ",
    romanization: "rá-wang ná kráp, phʉ́ʉn bpìak, dəən cháa-cháa",
    vi: "Cẩn thận nhé, sàn ướt, đi chậm thôi.",
    en: "Careful — the floor is wet, walk slowly.",
    register: "polite",
    note_vi: "ระวัง là cảnh báo nhanh, dùng được với mọi cấp. Cấp bách thì bỏ particle cho gọn.",
    note_en: "ระวัง is a quick warning, usable across ranks. In an emergency, drop the particle for brevity.",
  },
  {
    id: "thai_wp_safety_report_hazard",
    level: "B2",
    topic: "safety",
    th: "ขอแจ้งว่าเครื่องจักรตัวที่สามมีเสียงผิดปกติ ควรหยุดใช้และให้ช่างตรวจก่อนครับ",
    vi: "Em xin báo máy số ba có tiếng bất thường, nên dừng dùng và cho thợ kiểm tra trước ạ.",
    en: "I'd like to report that machine 3 makes an abnormal noise; we should stop using it and have a technician check first.",
    register: "formal",
    note_vi: "Báo an toàn dùng đăng ký trang trọng (ขอแจ้งว่า). Đừng giảm nhẹ rủi ro an toàn để 'lịch sự'.",
    note_en: "Safety reports use a formal register (ขอแจ้งว่า). Never downplay a safety risk for the sake of politeness.",
    native_review: "deferred",
  },
  {
    id: "thai_wp_safety_ppe",
    level: "B1",
    topic: "safety",
    th: "อย่าลืมใส่หมวกกันน็อกและถุงมือก่อนเข้าพื้นที่นะครับ",
    romanization: "yàa lʉʉm sài mùak-gan-nók lɛ́ thǔng-mʉʉ gɔ̀ɔn khâo phʉ́ʉn-thîi ná kráp",
    vi: "Đừng quên đội mũ bảo hộ và đeo găng trước khi vào khu vực nhé.",
    en: "Don't forget your helmet and gloves before entering the area.",
    register: "polite",
    note_vi: "อย่าลืม nhắc nhở nhẹ nhàng. Với cấp dưới thân quen vẫn nên giữ ná để không ra lệnh cứng.",
    note_en: "อย่าลืม is a gentle reminder. Even with familiar juniors, keep ná so it isn't a hard order.",
  },

  // ── Apology ────────────────────────────────────────────────────────────────
  {
    id: "thai_wp_apology_mistake",
    level: "B1",
    topic: "apology",
    th: "ต้องขอโทษด้วยครับ เป็นความผิดของผมเอง เดี๋ยวผมแก้ให้เลย",
    romanization: "dtɔ̂ng khɔ̌ɔ-thôot dûai kráp, bpen khwaam-phìt khɔ̌ɔng phǒm eeng, dǐao phǒm gɛ̂ɛ hâi looei",
    vi: "Em xin lỗi, là lỗi của chính em, để em sửa ngay.",
    en: "I'm sorry, it was my own fault — I'll fix it right away.",
    register: "polite",
    note_vi: "Nhận lỗi + sửa ngay. Đừng đổ lỗi đồng nghiệp (mất mặt cả nhóm). Formal hơn: ต้องขออภัย.",
    note_en: "Own it + fix it. Don't blame colleagues (whole-team face loss). More formal: ต้องขออภัย.",
  },
  {
    id: "thai_wp_apology_to_customer",
    level: "B2",
    topic: "apology",
    th: "ต้องขออภัยในความไม่สะดวกด้วยนะคะ ทางเราจะรีบดำเนินการแก้ไขให้เร็วที่สุดค่ะ",
    vi: "Thành thật xin lỗi vì sự bất tiện ạ, bên em sẽ khẩn trương xử lý sớm nhất ạ.",
    en: "We sincerely apologize for the inconvenience; we'll resolve it as quickly as possible.",
    register: "formal",
    note_vi: "Với khách dùng ขออภัย + ทางเรา (bên chúng tôi). ค่ะ/คะ cho nữ; nam dùng ครับ.",
    note_en: "With customers use ขออภัย + ทางเรา ('our side'). ค่ะ/คะ for women; men use ครับ.",
    native_review: "deferred",
  },

  // ── Delay ──────────────────────────────────────────────────────────────────
  {
    id: "thai_wp_delay_running_late",
    level: "A2",
    topic: "delay",
    th: "ผมอาจจะไปสายสักสิบนาทีครับ รถติดมาก",
    romanization: "phǒm àat-jà bpai sǎai sàk sìp naa-thii kráp, rót-dtìt mâak",
    vi: "Em có thể tới trễ khoảng 10 phút ạ, kẹt xe quá.",
    en: "I might be about 10 minutes late, traffic is heavy.",
    register: "polite",
    note_vi: "Báo trễ kèm thời gian cụ thể (สักสิบนาที). Casual với bạn: 'ขอสายแป๊บนะ'.",
    note_en: "Flag lateness with a concrete time (about 10 min). Casual with a friend: 'ขอสายแป๊บนะ'.",
  },
  {
    id: "thai_wp_delay_deadline_slip",
    level: "B2",
    topic: "delay",
    th: "ผมเกรงว่างานอาจไม่ทันกำหนดเดิม ขอเลื่อนเป็นพรุ่งนี้เช้าได้ไหมครับ งานจะเรียบร้อยกว่า",
    vi: "Em e công việc không kịp hạn cũ, cho em dời sang sáng mai được không ạ? Việc sẽ chỉn chu hơn.",
    en: "I'm afraid the work may miss the original deadline; could I push it to tomorrow morning? It'll be more polished.",
    register: "polite",
    note_vi: "เกรงว่า báo tin xấu lịch sự, kèm đề xuất + lợi ích. Đừng chỉ báo trễ rồi im.",
    note_en: "เกรงว่า softens bad news; pair it with a proposal + benefit. Don't just announce the slip and go silent.",
    native_review: "deferred",
  },
  {
    id: "thai_wp_delay_update",
    level: "B1",
    topic: "delay",
    th: "อัปเดตนิดนึงครับ งานเสร็จไป 70% แล้ว เหลือแค่ตรวจทานอีกรอบ",
    romanization: "àp-dèet nít-nʉng kráp, ngaan sèt bpai jèt-sìp bpəə-sen lɛ́ɛw, lʉ̌a khɛ̂ɛ dtrùat-thaan ìik rɔ̂ɔp",
    vi: "Cập nhật chút ạ, việc xong 70% rồi, chỉ còn rà soát lần nữa.",
    en: "Quick update — the work is 70% done, just one more review left.",
    register: "polite",
    note_vi: "Chủ động cập nhật tiến độ trấn an sếp. Định lượng (70%) đáng tin hơn 'gần xong'.",
    note_en: "A proactive progress update reassures the boss. A number (70%) beats 'almost done'.",
  },

  // ── Handoff ────────────────────────────────────────────────────────────────
  {
    id: "thai_wp_handoff_summary",
    level: "B1",
    topic: "handoff",
    th: "ส่งงานต่อนะครับ ที่ทำเสร็จแล้วคือออเดอร์เช้า ที่ค้างคือออเดอร์ #45 รอของ",
    romanization: "sòng ngaan dtɔ̀ɔ ná kráp, thîi tham sèt lɛ́ɛw khʉʉ ɔɔ-dəə cháao, thîi kháang khʉʉ ɔɔ-dəə #45 rɔɔ khɔ̌ɔng",
    vi: "Bàn giao nhé, việc xong là đơn buổi sáng, việc dở là đơn #45 đang chờ hàng.",
    en: "Handing over — done: the morning orders; pending: order #45 awaiting stock.",
    register: "polite",
    note_vi: "Phân rõ เสร็จแล้ว/ค้าง. Bàn giao rõ ràng tránh đổ lỗi qua lại sau ca.",
    note_en: "Separate done/pending clearly. A clean handoff prevents post-shift blame.",
  },
  {
    id: "thai_wp_handoff_contact",
    level: "B1",
    topic: "handoff",
    th: "ถ้ามีปัญหาเรื่องนี้ ติดต่อคุณเอได้เลยนะครับ เบอร์อยู่ในกลุ่ม",
    romanization: "thâa mii bpan-hǎa rʉ̂ang níi, dtìt-dtɔ̀ɔ khun A dâai looei ná kráp, bəə yùu nai glùm",
    vi: "Nếu có vấn đề việc này, cứ liên hệ anh A nhé, số trong nhóm.",
    en: "If there's any issue with this, just contact Khun A — the number's in the group chat.",
    register: "polite",
    note_vi: "Chỉ rõ người liên hệ khi bàn giao. คุณ + tên là cách gọi đồng nghiệp lịch sự chuẩn.",
    note_en: "Name the contact person at handoff. คุณ + name is the standard polite way to refer to a coworker.",
  },

  // ── Supervisor ─────────────────────────────────────────────────────────────
  {
    id: "thai_wp_supervisor_report_done",
    level: "B1",
    topic: "supervisor",
    th: "พี่ครับ งานที่มอบหมายเสร็จเรียบร้อยแล้ว ส่งเข้าอีเมลพี่แล้วนะครับ",
    romanization: "phîi kráp, ngaan thîi mɔ̂ɔp-mǎai sèt rîap-rɔ́ɔi lɛ́ɛw, sòng khâo ii-meew phîi lɛ́ɛw ná kráp",
    vi: "Anh ơi, việc anh giao xong hết rồi, em gửi vào email anh rồi ạ.",
    en: "Phi, the assigned task is complete — I've sent it to your email.",
    register: "polite",
    note_vi: "Báo hoàn thành chủ động. พี่ với sếp lớn tuổi; với sếp ngang tuổi dùng คุณ + tên.",
    note_en: "Proactively report completion. พี่ for an older boss; for a same-age boss use คุณ + name.",
  },
  {
    id: "thai_wp_supervisor_ask_feedback",
    level: "B2",
    topic: "supervisor",
    th: "ไม่ทราบว่าพี่พอจะมีเวลาช่วยดูงานผมและให้คำแนะนำสักหน่อยได้ไหมครับ",
    vi: "Không biết anh có chút thời gian xem việc của em và góp ý được không ạ?",
    en: "I wonder if you might have a moment to look at my work and give some feedback?",
    register: "formal",
    note_vi: "ไม่ทราบว่า…ได้ไหม là cách nhờ rất lịch sự, không áp lực sếp. Casual: 'พี่ว่างช่วยดูหน่อยได้ปะ'.",
    note_en: "ไม่ทราบว่า…ได้ไหม is a low-pressure, very polite request. Casual: 'พี่ว่างช่วยดูหน่อยได้ปะ'.",
    native_review: "deferred",
  },
  {
    id: "thai_wp_supervisor_decline_extra",
    level: "B2",
    topic: "supervisor",
    th: "ผมอยากช่วยจริงๆ ครับ แต่ตอนนี้มีงานเร่งอยู่ ถ้าเป็นช่วงบ่ายผมรับได้แน่นอนครับ",
    vi: "Em rất muốn giúp ạ, nhưng giờ đang có việc gấp; nếu là buổi chiều em nhận chắc chắn ạ.",
    en: "I'd really like to help, but I have urgent work now; in the afternoon I can definitely take it.",
    register: "polite",
    note_vi: "Từ chối mềm = thiện chí + lý do + phương án thay thế. Đừng nói 'ไม่ว่าง' trống không với sếp.",
    note_en: "Soft refusal = willingness + reason + alternative. Don't say a bare 'ไม่ว่าง' (busy) to a boss.",
    native_review: "deferred",
  },

  // ── Customer ───────────────────────────────────────────────────────────────
  {
    id: "thai_wp_customer_greeting",
    level: "A2",
    topic: "customer",
    th: "สวัสดีค่ะ ยินดีต้อนรับค่ะ มีอะไรให้ช่วยไหมคะ",
    romanization: "sà-wàt-dii kâ, yin-dii dtɔ̂ɔn-ráp kâ, mii à-rai hâi chûai mǎi ká",
    vi: "Xin chào, hân hạnh đón tiếp ạ, em giúp gì được ạ?",
    en: "Hello, welcome — how can I help you?",
    register: "formal",
    note_vi: "Với khách luôn dùng particle đầy đủ. Câu hỏi dùng คะ (lên giọng), câu kể dùng ค่ะ.",
    note_en: "With customers always use full particles. Questions take คะ (rising), statements ค่ะ.",
  },
  {
    id: "thai_wp_customer_out_of_stock",
    level: "B1",
    topic: "customer",
    th: "ขออภัยด้วยนะคะ ตอนนี้สินค้าหมด แต่จะเข้าใหม่สัปดาห์หน้า รับเป็นแบบอื่นก่อนไหมคะ",
    vi: "Xin lỗi ạ, hiện hết hàng nhưng tuần sau có lại; anh/chị lấy mẫu khác trước không ạ?",
    en: "I'm sorry, it's out of stock now but restocks next week — would you like a different option for now?",
    register: "formal",
    note_vi: "Xin lỗi + giải pháp thay thế. Không bao giờ nói cụt 'หมด' rồi thôi với khách.",
    note_en: "Apology + an alternative. Never just say 'หมด' (out) and stop, with a customer.",
  },
  {
    id: "thai_wp_customer_thanks",
    level: "A2",
    topic: "customer",
    th: "ขอบคุณที่ใช้บริการนะคะ แล้วพบกันใหม่ค่ะ",
    romanization: "khɔ̀ɔp-khun thîi chái bɔɔ-rí-gaan ná ká, lɛ́ɛw phóp gan mài kâ",
    vi: "Cảm ơn đã sử dụng dịch vụ ạ, hẹn gặp lại ạ.",
    en: "Thank you for your patronage — see you again.",
    register: "formal",
    note_vi: "Câu chốt chuẩn ngành dịch vụ. Giữ ค่ะ/ครับ kể cả khi khách không đáp.",
    note_en: "A standard service closer. Keep ค่ะ/ครับ even if the customer doesn't reply.",
  },

  // ── Disagreement ───────────────────────────────────────────────────────────
  {
    id: "thai_wp_disagree_soft",
    level: "B2",
    topic: "disagreement",
    th: "ผมเข้าใจมุมมองของพี่นะครับ แต่ขอเห็นต่างนิดหนึ่ง ผมว่าวิธีนี้อาจเสี่ยงกว่า",
    vi: "Em hiểu góc nhìn của anh ạ, nhưng cho em khác ý một chút, em thấy cách này có thể rủi ro hơn.",
    en: "I understand your view, but allow me to differ slightly — I think this way may be riskier.",
    register: "polite",
    note_vi: "Công thức: công nhận → đệm นิดหนึ่ง → nêu lý do. Không bao giờ nói 'พี่ผิด' với cấp trên.",
    note_en: "Formula: acknowledge → cushion with นิดหนึ่ง → give a reason. Never say 'you're wrong' to a senior.",
    native_review: "deferred",
  },
  {
    id: "thai_wp_disagree_alternative",
    level: "B2",
    topic: "disagreement",
    th: "ถ้าเป็นไปได้ ลองพิจารณาอีกทางเลือกหนึ่งดีไหมครับ น่าจะประหยัดเวลากว่า",
    vi: "Nếu được, ta cân nhắc thêm một phương án nữa nhé ạ, chắc tiết kiệm thời gian hơn.",
    en: "If possible, shall we consider another option? It would probably save more time.",
    register: "polite",
    note_vi: "Đề xuất thay vì phủ định. ดีไหม mời cùng quyết, giữ thể diện cho người kia.",
    note_en: "Propose rather than negate. ดีไหม invites joint decision and saves the other's face.",
    native_review: "deferred",
  },

  // ── Meeting ────────────────────────────────────────────────────────────────
  {
    id: "thai_wp_meeting_open",
    level: "B1",
    topic: "meeting",
    th: "เริ่มประชุมเลยนะครับ วันนี้มีสามเรื่องหลักที่ต้องคุยกัน",
    romanization: "rə̂əm bprà-chum looei ná kráp, wan-níi mii sǎam rʉ̂ang làk thîi dtɔ̂ng khui gan",
    vi: "Bắt đầu họp nhé, hôm nay có ba việc chính cần bàn.",
    en: "Let's start the meeting — today we have three main items to discuss.",
    register: "polite",
    note_vi: "Nêu số mục đầu họp giúp dẫn dắt. Đăng ký trang trọng hơn: 'ขอเริ่มการประชุม'.",
    note_en: "Stating the item count up front structures the meeting. More formal: 'ขอเริ่มการประชุม'.",
  },
  {
    id: "thai_wp_meeting_ask_turn",
    level: "B2",
    topic: "meeting",
    th: "ขออนุญาตเสริมนิดหนึ่งครับ ในประเด็นนี้ผมมีข้อมูลเพิ่มเติม",
    vi: "Cho em bổ sung chút ạ, ở điểm này em có thêm thông tin.",
    en: "May I add something — on this point I have some extra information.",
    register: "formal",
    note_vi: "ขออนุญาตเสริม là cách xin lượt nói lịch sự trong họp. Casual: 'ขอเสริมนิดนึง'.",
    note_en: "ขออนุญาตเสริม politely claims a turn in a meeting. Casual: 'ขอเสริมนิดนึง'.",
    native_review: "deferred",
  },
  {
    id: "thai_wp_meeting_wrap",
    level: "B2",
    topic: "meeting",
    th: "สรุปนะครับ เราตกลงกันว่าจะเริ่มสัปดาห์หน้า โดยมีคุณเอเป็นผู้รับผิดชอบ",
    vi: "Tóm lại nhé, ta thống nhất bắt đầu tuần sau, do anh A phụ trách.",
    en: "To summarize — we've agreed to start next week, with Khun A as the owner.",
    register: "polite",
    note_vi: "Chốt họp: nhắc quyết định + người phụ trách. Tránh kết thúc mơ hồ không ai chịu trách nhiệm.",
    note_en: "Close a meeting by restating the decision + owner. Avoid a vague end with no accountable person.",
    native_review: "deferred",
  },

  // ── Formal email / message ─────────────────────────────────────────────────
  {
    id: "thai_wp_email_open",
    level: "B2",
    topic: "formal_email",
    th: "เรียน คุณสมชาย ตามที่ได้คุยกันไว้ ผมขอส่งรายละเอียดเพิ่มเติมตามไฟล์แนบครับ",
    vi: "Kính gửi anh Somchai, theo như đã trao đổi, em xin gửi chi tiết bổ sung theo file đính kèm ạ.",
    en: "Dear Khun Somchai, as discussed, I'm sending further details in the attached file.",
    register: "formal",
    note_vi: "Email mở bằng เรียน + tên. ตามที่ได้คุยกันไว้ nối ngữ cảnh trang trọng.",
    note_en: "Emails open with เรียน + name. ตามที่ได้คุยกันไว้ ('as discussed') links context formally.",
    native_review: "deferred",
  },
  {
    id: "thai_wp_email_close",
    level: "B2",
    topic: "formal_email",
    th: "หากมีข้อสงสัยประการใด สามารถสอบถามได้ตลอดครับ ขอบคุณครับ",
    vi: "Nếu có thắc mắc gì, anh cứ hỏi bất cứ lúc nào ạ. Cảm ơn anh.",
    en: "If you have any questions, please feel free to ask anytime. Thank you.",
    register: "formal",
    note_vi: "Câu đóng email chuẩn. หากมีข้อสงสัยประการใด là cụm trang trọng cho 'nếu có thắc mắc'.",
    note_en: "A standard email sign-off. หากมีข้อสงสัยประการใด is the formal 'if you have any questions'.",
    native_review: "deferred",
  },
  {
    id: "thai_wp_email_request_meeting",
    level: "C1",
    topic: "formal_email",
    th: "ผมใคร่ขอนัดประชุมเพื่อหารือรายละเอียดโครงการ ไม่ทราบว่าพี่สะดวกวันพุธช่วงบ่ายหรือไม่ครับ",
    vi: "Em xin được hẹn họp để bàn chi tiết dự án, không biết anh có tiện chiều thứ Tư không ạ?",
    en: "I would like to request a meeting to discuss the project details; would Wednesday afternoon suit you?",
    register: "formal",
    note_vi: "ใคร่ขอ là đăng ký rất trang trọng (văn viết). Trong nói chuyện thường dùng อยากขอ.",
    note_en: "ใคร่ขอ is a very formal (written) register. In speech use อยากขอ instead.",
    native_review: "deferred",
  },

  // ── Negotiation ────────────────────────────────────────────────────────────
  {
    id: "thai_wp_negotiation_salary",
    level: "C1",
    topic: "negotiation",
    th: "จากผลงานและความรับผิดชอบที่เพิ่มขึ้น ผมจึงอยากปรึกษาเรื่องการปรับเงินเดือนครับ",
    vi: "Từ kết quả công việc và trách nhiệm tăng thêm, em muốn trao đổi về việc điều chỉnh lương ạ.",
    en: "Given my results and increased responsibilities, I'd like to discuss a salary adjustment.",
    register: "formal",
    note_vi: "Mở bằng căn cứ (ผลงาน) trước khi nêu yêu cầu. ปรึกษา nghe nhẹ hơn เรียกร้อง.",
    note_en: "Lead with justification (results) before the ask. ปรึกษา ('consult') is softer than 'demand'.",
    native_review: "deferred",
  },
  {
    id: "thai_wp_negotiation_deadline",
    level: "B2",
    topic: "negotiation",
    th: "ถ้าเลื่อนกำหนดส่งได้สักสองวัน งานจะออกมาดีกว่านี้มากครับ แล้วแต่พี่สะดวกครับ",
    vi: "Nếu dời hạn nộp được khoảng hai ngày, việc sẽ tốt hơn nhiều ạ, tùy anh tiện ạ.",
    en: "If we could push the deadline by two days, the work would come out much better — whichever suits you.",
    register: "polite",
    note_vi: "Gắn yêu cầu với lợi ích công việc + kết bằng แล้วแต่พี่ để trao quyền cho sếp.",
    note_en: "Tie the ask to the work's benefit + close with แล้วแต่พี่ to hand the decision to the boss.",
    native_review: "deferred",
  },
  {
    id: "thai_wp_negotiation_scope",
    level: "C1",
    topic: "negotiation",
    th: "ขอบเขตงานเพิ่มขึ้นพอสมควร ผมขอเสนอให้แบ่งเป็นสองเฟสเพื่อให้คุณภาพคงที่ครับ",
    vi: "Phạm vi công việc tăng khá nhiều, em xin đề xuất chia làm hai giai đoạn để giữ chất lượng ổn định ạ.",
    en: "The scope has grown considerably; I propose splitting it into two phases to keep quality consistent.",
    register: "formal",
    note_vi: "Thương lượng phạm vi: nêu thực tế → đề xuất giải pháp. ขอเสนอ trang trọng và xây dựng.",
    note_en: "Scope negotiation: state the reality → propose a solution. ขอเสนอ is formal and constructive.",
    native_review: "deferred",
  },
  {
    id: "thai_wp_negotiation_casual_peer",
    level: "B1",
    topic: "negotiation",
    th: "ช่วยกันคนละครึ่งดีไหม เดี๋ยวเราทำส่วนหน้า เธอทำส่วนหลัง",
    romanization: "chûai gan khon-lá khrʉ̂ng dii mǎi, dǐao rao tham sùan nâa, thəə tham sùan lǎng",
    vi: "Chia nhau mỗi người một nửa nhé, mình làm phần đầu, bạn làm phần sau.",
    en: "Let's split it in half — I'll do the front part, you do the back.",
    register: "casual",
    note_vi: "Đây là bản CASUAL giữa đồng nghiệp ngang hàng: เธอ/เรา + bỏ particle. Với sếp phải nâng lên polite.",
    note_en: "This is the CASUAL peer version: เธอ/เรา + no particles. With a boss you must raise it to polite.",
  },

  // ── Extra items (thinner topics) ───────────────────────────────────────────
  {
    id: "thai_wp_apology_interrupt",
    level: "B1",
    topic: "apology",
    th: "ขอโทษที่ขัดจังหวะนะครับ พอดีมีเรื่องด่วนนิดหนึ่ง",
    romanization: "khɔ̌ɔ-thôot thîi khàt-jang-wà ná kráp, phɔɔ-dii mii rʉ̂ang dùan nít-nʉ̀ng",
    vi: "Xin lỗi vì cắt ngang ạ, em có chút việc gấp.",
    en: "Sorry to interrupt — there's something a bit urgent.",
    register: "polite",
    note_vi: "ขอโทษที่ขัดจังหวะ là phép lịch sự trước khi xen vào. Casual với bạn: 'ขอแทรกแป๊บ'.",
    note_en: "ขอโทษที่ขัดจังหวะ is the polite pre-interruption. Casual with a peer: 'ขอแทรกแป๊บ'.",
  },
  {
    id: "thai_wp_handoff_pending_priority",
    level: "B2",
    topic: "handoff",
    th: "ฝากดูออเดอร์ #45 เป็นพิเศษนะครับ ลูกค้าตามมาแล้วสองรอบ ถือว่าด่วน",
    vi: "Nhờ để ý đặc biệt đơn #45 nhé ạ, khách đã hỏi hai lần rồi, coi như gấp.",
    en: "Please keep a special eye on order #45 — the customer has followed up twice, treat it as urgent.",
    register: "polite",
    note_vi: "Bàn giao nên đánh dấu mức ưu tiên, không chỉ liệt kê. ฝาก = 'nhờ trông giúp'.",
    note_en: "A handoff should flag priority, not just list. ฝาก = 'entrust someone to watch over'.",
    native_review: "deferred",
  },
  {
    id: "thai_wp_disagree_data",
    level: "C1",
    topic: "disagreement",
    th: "ผมขอเสนอข้อมูลอีกชุดหนึ่งประกอบการพิจารณานะครับ ตัวเลขล่าสุดดูจะชี้ไปอีกทาง",
    vi: "Em xin đưa thêm một bộ dữ liệu để cân nhắc ạ, số liệu mới nhất có vẻ chỉ theo hướng khác.",
    en: "Let me offer another dataset for consideration; the latest figures seem to point a different way.",
    register: "formal",
    note_vi: "Phản biện bằng DỮ LIỆU thay vì ý kiến giữ thể diện và thuyết phục hơn với cấp trên.",
    note_en: "Countering with DATA rather than opinion saves face and is more persuasive with a senior.",
    native_review: "deferred",
  },
  {
    id: "thai_wp_customer_escalate",
    level: "B2",
    topic: "customer",
    th: "เรื่องนี้ขออนุญาตส่งต่อให้หัวหน้าดูแลนะคะ เพื่อให้ได้รับการแก้ไขที่ดีที่สุดค่ะ",
    vi: "Việc này cho em chuyển lên cấp trên xử lý ạ, để được giải quyết tốt nhất ạ.",
    en: "Allow me to escalate this to my supervisor so it gets the best resolution.",
    register: "formal",
    note_vi: "Chuyển cấp (escalate) đóng khung như lợi ích cho khách, không phải đùn đẩy. Giữ particle đầy đủ.",
    note_en: "Frame escalation as a benefit to the customer, not buck-passing. Keep full particles.",
    native_review: "deferred",
  },
];

export default workplaceItems;
