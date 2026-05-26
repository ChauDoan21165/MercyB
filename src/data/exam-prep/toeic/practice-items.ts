/**
 * 30 ORIGINAL TOEIC L&R practice items — written for MercyBlade.
 *
 * Disclaimer: every passage, audio script, question, option, and
 * explanation in this file is original content authored for this
 * project. Nothing here is copied from real ETS / TOEIC exam material
 * or from commercial TOEIC prep books. The format mirrors the official
 * exam structure (see ./structure.ts) so practice translates 1:1, but
 * no copyrighted text is reproduced.
 *
 * Coverage: 15 Listening (parts 1-4 + 3 business-meeting overflow) +
 * 15 Reading (parts 5-7) — 30 items total. Each item carries:
 *   - typical_traps  → common Vietnamese-learner mistakes for this slot
 *   - vocabulary_focus → Vietnamese gloss + IPA + collocations
 *   - explanation_vi → why the right answer is right, in Vietnamese
 */

export type TOEICSectionGroup = "listening" | "reading";
export type TOEICPart = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type TOEICTargetBand = 405 | 605 | 785 | 905;

export type TOEICTopic =
  | "office_communication"
  | "business_meeting"
  | "travel"
  | "dining"
  | "shopping"
  | "airport_hotel"
  | "finance"
  | "hr_recruitment"
  | "marketing_advertising"
  | "logistics_shipping"
  | "it_support"
  | "health_safety"
  | "real_estate"
  | "training_workshop"
  | "product_launch"
  | "contracts_legal"
  | "email_correspondence"
  | "customer_service"
  | "maintenance_facilities";

export interface TOEICVocabularyEntry {
  word: string;
  vi_translation: string;
  ipa: string;
  common_collocations: string[];
}

export interface TOEICQuestion {
  question_en: string;
  options_en: string[];
  correct_index: number;
  /** In Vietnamese — explains WHY the answer is correct and (briefly) why the distractors fail. */
  explanation_vi: string;
}

export interface TOEICPracticeItem {
  /** e.g. "toeic_listening_part1_office_interaction". Stable. */
  id: string;
  section: TOEICSectionGroup;
  part: TOEICPart;
  topic: TOEICTopic;
  /** Target TOEIC band: 405 ≈ B1, 605 ≈ B2, 785 ≈ C1, 905 ≈ C2. */
  level: TOEICTargetBand;
  /** For Listening parts this is the audio transcript; for Reading it is the printed passage. */
  passage_or_audio_script: string;
  /** Listening Part 1 / Reading Part 5 typically have 1 question; Part 3/4/7 have 2-3. */
  questions: TOEICQuestion[];
  /** Mistakes Vietnamese learners make on this exact item type. Vietnamese. */
  typical_traps: string[];
  vocabulary_focus: TOEICVocabularyEntry[];
  estimated_time_minutes: number;
  title_vi: string;
  title_en: string;
  /** Canonical audio key for listening items. Deterministic: toeic-listening/{id}.mp3. undefined for reading items. */
  audioKey?: string;
}

// ════════════════════════════════════════════════════════════════════
// LISTENING — 15 items (parts 1, 2, 3, 4 + business-meeting overflow)
// ════════════════════════════════════════════════════════════════════

const LISTENING: TOEICPracticeItem[] = [
  // ─── Part 1: Photographs (3 items) ─────────────────────────────────
  {
    id: "toeic_listening_part1_office_interaction",
    section: "listening",
    part: 1,
    topic: "office_communication",
    level: 405,
    title_vi: "Trao đổi tài liệu tại văn phòng",
    title_en: "Office document hand-off",
    audioKey: "toeic-listening/toeic_listening_part1_office_interaction.mp3",
    passage_or_audio_script:
      "(Photo: A woman at a desk hands a stack of papers to a man standing beside her.)\n" +
      "(A) She is filing documents in a cabinet.\n" +
      "(B) She is handing papers to a colleague.\n" +
      "(C) She is photocopying a report.\n" +
      "(D) She is signing a contract.",
    questions: [
      {
        question_en: "Which statement best describes the photo?",
        options_en: [
          "She is filing documents in a cabinet.",
          "She is handing papers to a colleague.",
          "She is photocopying a report.",
          "She is signing a contract.",
        ],
        correct_index: 1,
        explanation_vi:
          "(B) đúng vì hành động đang diễn ra là trao tài liệu cho đồng nghiệp. (A) sai vì không có tủ hồ sơ; (C) sai vì không có máy photocopy; (D) sai vì không thấy chữ ký.",
      },
    ],
    typical_traps: [
      "Người Việt thường chọn câu có động từ quen thuộc 'sign' (ký) mà không xét toàn cảnh.",
      "Nhầm 'hand' (động từ — trao) với 'hand' (danh từ — bàn tay).",
      "Bỏ qua thì hiện tại tiếp diễn — TOEIC Part 1 luôn mô tả hành động đang xảy ra.",
    ],
    vocabulary_focus: [
      {
        word: "hand over",
        vi_translation: "trao, bàn giao",
        ipa: "/hænd ˈoʊ.vɚ/",
        common_collocations: ["hand over the documents", "hand over responsibility", "hand over a report"],
      },
      {
        word: "colleague",
        vi_translation: "đồng nghiệp",
        ipa: "/ˈkɑː.liːɡ/",
        common_collocations: ["close colleague", "former colleague", "colleague at work"],
      },
      {
        word: "file",
        vi_translation: "lưu trữ (động từ); hồ sơ (danh từ)",
        ipa: "/faɪl/",
        common_collocations: ["file a report", "file documents", "file a complaint"],
      },
    ],
    estimated_time_minutes: 1,
  },
  {
    id: "toeic_listening_part1_warehouse_loading",
    section: "listening",
    part: 1,
    topic: "logistics_shipping",
    level: 605,
    title_vi: "Bốc hàng tại kho",
    title_en: "Warehouse loading",
    audioKey: "toeic-listening/toeic_listening_part1_warehouse_loading.mp3",
    passage_or_audio_script:
      "(Photo: Two workers in safety vests are loading sealed boxes onto a flat-bed truck.)\n" +
      "(A) The workers are unloading furniture.\n" +
      "(B) The boxes are being lifted onto the vehicle.\n" +
      "(C) A forklift is being repaired.\n" +
      "(D) The truck is leaving the warehouse.",
    questions: [
      {
        question_en: "Which statement best describes the photo?",
        options_en: [
          "The workers are unloading furniture.",
          "The boxes are being lifted onto the vehicle.",
          "A forklift is being repaired.",
          "The truck is leaving the warehouse.",
        ],
        correct_index: 1,
        explanation_vi:
          "(B) đúng — câu bị động hiện tại tiếp diễn 'are being lifted' mô tả chính xác hành động. (A) sai vì đang chất hàng (load), không phải dỡ (unload). (C) và (D) mô tả việc không có trong tranh.",
      },
    ],
    typical_traps: [
      "Lẫn lộn 'load' (chất hàng lên) và 'unload' (dỡ hàng xuống) — hai từ đối nghĩa.",
      "Bị động hiện tại tiếp diễn 'are being + V3' xuất hiện thường xuyên ở Part 1 trình độ 605+.",
      "Người Việt hay dịch 'flat-bed truck' = xe tải — nên học cụm chính xác hơn: 'xe tải thùng phẳng'.",
    ],
    vocabulary_focus: [
      {
        word: "load",
        vi_translation: "chất hàng",
        ipa: "/loʊd/",
        common_collocations: ["load the truck", "load cargo", "loading dock"],
      },
      {
        word: "vest",
        vi_translation: "áo vest, áo gile (đồ bảo hộ)",
        ipa: "/vɛst/",
        common_collocations: ["safety vest", "high-visibility vest", "wear a vest"],
      },
      {
        word: "warehouse",
        vi_translation: "nhà kho",
        ipa: "/ˈwɛr.haʊs/",
        common_collocations: ["warehouse worker", "warehouse manager", "warehouse inventory"],
      },
    ],
    estimated_time_minutes: 1,
  },
  {
    id: "toeic_listening_part1_outdoor_cafe",
    section: "listening",
    part: 1,
    topic: "dining",
    level: 405,
    title_vi: "Quán cà phê ngoài trời",
    title_en: "Outdoor café scene",
    audioKey: "toeic-listening/toeic_listening_part1_outdoor_cafe.mp3",
    passage_or_audio_script:
      "(Photo: A waiter places two coffee cups on a small round table where a couple is seated under a sun umbrella.)\n" +
      "(A) The customers are paying the bill.\n" +
      "(B) The waiter is serving drinks.\n" +
      "(C) The umbrella is being folded.\n" +
      "(D) The table is being cleared.",
    questions: [
      {
        question_en: "Which statement best describes the photo?",
        options_en: [
          "The customers are paying the bill.",
          "The waiter is serving drinks.",
          "The umbrella is being folded.",
          "The table is being cleared.",
        ],
        correct_index: 1,
        explanation_vi:
          "(B) đúng — 'serving drinks' khớp với hành động đặt cốc cà phê lên bàn. (A) không thấy hóa đơn; (C) ô đang mở; (D) bàn đang được phục vụ, không phải dọn.",
      },
    ],
    typical_traps: [
      "Lẫn 'serve' (phục vụ) với 'service' (dịch vụ — danh từ).",
      "Hiểu nhầm 'clear the table' = dọn bàn (sau khi khách ăn xong) ≠ 'set the table' = bày bàn (trước khi ăn).",
      "Bị động 'is being folded/cleared' bẫy người mới — luôn cần kiểm tra hành động có thực sự diễn ra không.",
    ],
    vocabulary_focus: [
      {
        word: "serve",
        vi_translation: "phục vụ, dọn (đồ ăn)",
        ipa: "/sɝːv/",
        common_collocations: ["serve drinks", "serve customers", "serve a meal"],
      },
      {
        word: "bill",
        vi_translation: "hóa đơn",
        ipa: "/bɪl/",
        common_collocations: ["pay the bill", "split the bill", "ask for the bill"],
      },
      {
        word: "clear the table",
        vi_translation: "dọn bàn",
        ipa: "/klɪr ðə ˈteɪ.bəl/",
        common_collocations: ["clear the dishes", "clear away", "clear up"],
      },
    ],
    estimated_time_minutes: 1,
  },

  // ─── Part 2: Question-Response (3 items) ───────────────────────────
  {
    id: "toeic_listening_part2_meeting_reschedule",
    section: "listening",
    part: 2,
    topic: "business_meeting",
    level: 605,
    title_vi: "Đề nghị đổi giờ họp",
    title_en: "Rescheduling a meeting",
    audioKey: "toeic-listening/toeic_listening_part2_meeting_reschedule.mp3",
    passage_or_audio_script:
      "Q: Could we push the marketing review to Thursday afternoon?\n" +
      "(A) Sure, three o'clock works for me.\n" +
      "(B) The marketing budget is approved.\n" +
      "(C) On the third floor.",
    questions: [
      {
        question_en: "Choose the most natural response.",
        options_en: [
          "Sure, three o'clock works for me.",
          "The marketing budget is approved.",
          "On the third floor.",
        ],
        correct_index: 0,
        explanation_vi:
          "(A) đúng — 'push to Thursday afternoon' là đề nghị dời lịch, đáp lại bằng giờ cụ thể là phù hợp. (B) lạc đề (ngân sách); (C) trả lời 'where' nhưng câu hỏi là yes/no.",
      },
    ],
    typical_traps: [
      "'Push' trong văn phòng = dời/hoãn, KHÔNG phải 'đẩy'. Đây là lỗi dịch nghĩa đen điển hình.",
      "Câu hỏi 'Could we...?' là đề nghị (yes/no), không phải hỏi nơi chốn — đừng nhầm với 'Where is...?'",
      "Bẫy âm: 'marketing' xuất hiện ở (B) đánh lạc hướng — TOEIC thường dùng từ giống nhau ở đáp án sai.",
    ],
    vocabulary_focus: [
      {
        word: "push (a meeting)",
        vi_translation: "dời, hoãn (cuộc họp)",
        ipa: "/pʊʃ/",
        common_collocations: ["push the deadline", "push back", "push to next week"],
      },
      {
        word: "review",
        vi_translation: "buổi đánh giá / xem xét",
        ipa: "/rɪˈvjuː/",
        common_collocations: ["performance review", "marketing review", "annual review"],
      },
      {
        word: "work for (someone)",
        vi_translation: "phù hợp, tiện cho ai",
        ipa: "/wɝːk fɔːr/",
        common_collocations: ["that works for me", "what time works", "does this work for you"],
      },
    ],
    estimated_time_minutes: 1,
  },
  {
    id: "toeic_listening_part2_indirect_response",
    section: "listening",
    part: 2,
    topic: "office_communication",
    level: 785,
    title_vi: "Câu trả lời gián tiếp",
    title_en: "Indirect-response trap",
    audioKey: "toeic-listening/toeic_listening_part2_indirect_response.mp3",
    passage_or_audio_script:
      "Q: Has the new printer been delivered yet?\n" +
      "(A) Let me check with reception.\n" +
      "(B) Yes, I printed two copies.\n" +
      "(C) The delivery truck is blue.",
    questions: [
      {
        question_en: "Choose the most natural response.",
        options_en: [
          "Let me check with reception.",
          "Yes, I printed two copies.",
          "The delivery truck is blue.",
        ],
        correct_index: 0,
        explanation_vi:
          "(A) đúng — đây là câu trả lời gián tiếp 'không biết, để tôi kiểm tra'. TOEIC Part 2 trình độ 785+ rất thường dùng đáp án này. (B) bẫy âm 'printed/printer'; (C) bẫy âm 'delivery'.",
      },
    ],
    typical_traps: [
      "Người Việt thường loại bỏ đáp án 'Let me check / I'm not sure' vì nghĩ phải có đáp án dứt khoát — nhưng đây là dạng câu trả lời gián tiếp rất phổ biến ở Part 2.",
      "TOEIC luôn cài bẫy âm: 'printer'→'printed', 'delivered'→'delivery' để đánh lạc hướng.",
      "Câu hỏi yes/no không nhất thiết phải bắt đầu bằng yes/no.",
    ],
    vocabulary_focus: [
      {
        word: "deliver",
        vi_translation: "giao (hàng); trình bày (bài nói)",
        ipa: "/dɪˈlɪv.ɚ/",
        common_collocations: ["deliver a package", "deliver a speech", "deliver on time"],
      },
      {
        word: "reception",
        vi_translation: "quầy lễ tân; tiệc đón",
        ipa: "/rɪˈsɛp.ʃən/",
        common_collocations: ["reception desk", "wedding reception", "warm reception"],
      },
      {
        word: "let me check",
        vi_translation: "để tôi kiểm tra",
        ipa: "/lɛt mi tʃɛk/",
        common_collocations: ["let me check with...", "let me check the schedule", "let me check first"],
      },
    ],
    estimated_time_minutes: 1,
  },
  {
    id: "toeic_listening_part2_choice_question",
    section: "listening",
    part: 2,
    topic: "travel",
    level: 405,
    title_vi: "Câu hỏi lựa chọn (or)",
    title_en: "Either/or question",
    audioKey: "toeic-listening/toeic_listening_part2_choice_question.mp3",
    passage_or_audio_script:
      "Q: Would you prefer a window seat or an aisle seat?\n" +
      "(A) The flight is at six.\n" +
      "(B) An aisle seat, please.\n" +
      "(C) Yes, I have a window.",
    questions: [
      {
        question_en: "Choose the most natural response.",
        options_en: [
          "The flight is at six.",
          "An aisle seat, please.",
          "Yes, I have a window.",
        ],
        correct_index: 1,
        explanation_vi:
          "(B) đúng — câu hỏi lựa chọn 'A or B' phải chọn một trong hai. (A) trả lời thời gian; (C) yes/no không hợp với câu lựa chọn.",
      },
    ],
    typical_traps: [
      "Câu hỏi 'A or B' không phải yes/no — đừng trả lời 'yes' hoặc 'no'.",
      "'Aisle' phát âm là /aɪl/ — chữ 's' câm. Người Việt hay đọc thành /eɪl/ hoặc /ˈaɪ.səl/.",
      "Nhầm 'window seat' với 'window' (cửa sổ) ở câu trả lời sai.",
    ],
    vocabulary_focus: [
      {
        word: "aisle",
        vi_translation: "lối đi (giữa các hàng ghế)",
        ipa: "/aɪl/",
        common_collocations: ["aisle seat", "down the aisle", "aisle of the supermarket"],
      },
      {
        word: "prefer",
        vi_translation: "thích hơn",
        ipa: "/prɪˈfɝː/",
        common_collocations: ["prefer A to B", "prefer to + V", "I'd prefer"],
      },
      {
        word: "window seat",
        vi_translation: "ghế cạnh cửa sổ",
        ipa: "/ˈwɪn.doʊ siːt/",
        common_collocations: ["request a window seat", "by the window", "window-side"],
      },
    ],
    estimated_time_minutes: 1,
  },

  // ─── Part 3: Conversations (3 items) ───────────────────────────────
  {
    id: "toeic_listening_part3_hotel_checkin",
    section: "listening",
    part: 3,
    topic: "airport_hotel",
    level: 605,
    title_vi: "Nhận phòng khách sạn",
    title_en: "Hotel check-in",
    audioKey: "toeic-listening/toeic_listening_part3_hotel_checkin.mp3",
    passage_or_audio_script:
      "M: Good evening. I'm checking in — the reservation should be under Linh Nguyen.\n" +
      "W: Welcome, Ms. Nguyen. I see your booking — a deluxe room for two nights. There's one note: the room you reserved is on the third floor, but the air-conditioner is being repaired. We can move you to a similar room on the seventh floor at no extra charge — would that work?\n" +
      "M: That's fine. As long as it has a desk and reliable Wi-Fi, the floor doesn't matter. I do have a 9 a.m. video call tomorrow.\n" +
      "W: Both rooms have the same desk setup, and the seventh-floor Wi-Fi is actually a bit faster. Breakfast is 6:30 to 10 in the lobby café. Here are your keys.",
    questions: [
      {
        question_en: "Why is the woman offering a room change?",
        options_en: [
          "The third-floor room is more expensive.",
          "The original room's air-conditioner is broken.",
          "The seventh floor has a better view.",
          "The original room was double-booked.",
        ],
        correct_index: 1,
        explanation_vi: "Cô lễ tân nói rõ 'the air-conditioner is being repaired' (máy lạnh đang sửa). (A), (C), (D) không được đề cập.",
      },
      {
        question_en: "What does the man say is most important to him?",
        options_en: [
          "A high floor",
          "A view of the city",
          "A desk and reliable Wi-Fi",
          "A late check-out",
        ],
        correct_index: 2,
        explanation_vi: "Anh ta nói 'as long as it has a desk and reliable Wi-Fi'. Đây là yêu cầu duy nhất anh ta nêu.",
      },
      {
        question_en: "When does breakfast service end?",
        options_en: ["9:00 a.m.", "9:30 a.m.", "10:00 a.m.", "10:30 a.m."],
        correct_index: 2,
        explanation_vi: "Cô lễ tân nói 'breakfast is 6:30 to 10' — kết thúc lúc 10 giờ.",
      },
    ],
    typical_traps: [
      "Cụm 'be being repaired' (đang được sửa) hay bị bỏ qua — nghe nhanh dễ chỉ bắt được 'repair'.",
      "'No extra charge' = miễn phí thêm. Đừng nhầm với 'no charge' (hoàn toàn miễn phí).",
      "Người Việt hay nghe nhầm '6:30 to 10' thành 6:30-10:30 do quen với khung 'từ X đến X giờ rưỡi'.",
    ],
    vocabulary_focus: [
      {
        word: "reservation",
        vi_translation: "đặt phòng/chỗ trước",
        ipa: "/ˌrɛz.ɚˈveɪ.ʃən/",
        common_collocations: ["make a reservation", "cancel the reservation", "reservation under [name]"],
      },
      {
        word: "no extra charge",
        vi_translation: "không tính thêm phí",
        ipa: "/noʊ ˈɛk.strə tʃɑːrdʒ/",
        common_collocations: ["at no extra charge", "no additional charge", "free of charge"],
      },
      {
        word: "reliable",
        vi_translation: "đáng tin cậy",
        ipa: "/rɪˈlaɪ.ə.bəl/",
        common_collocations: ["reliable Wi-Fi", "reliable supplier", "reliable source"],
      },
    ],
    estimated_time_minutes: 3,
  },
  {
    id: "toeic_listening_part3_supplier_negotiation",
    section: "listening",
    part: 3,
    topic: "logistics_shipping",
    level: 785,
    title_vi: "Thương lượng với nhà cung cấp",
    title_en: "Supplier negotiation",
    audioKey: "toeic-listening/toeic_listening_part3_supplier_negotiation.mp3",
    passage_or_audio_script:
      "M: Thanks for sending the revised quote. The unit price is fine, but the lead time of six weeks is going to be tight for our launch.\n" +
      "W: I understand. If we prioritize your order, we can shave off about a week — so five weeks instead of six. The trade-off is we'd need a 30 percent deposit upfront instead of the usual 15.\n" +
      "M: A higher deposit is doable. What about quality control — would expedited production affect the inspection step?\n" +
      "W: Not at all. Our QC team is staffed independently of the production line, so the inspection schedule doesn't change. I'll send the updated terms by end of day.",
    questions: [
      {
        question_en: "What is the man's main concern about the original quote?",
        options_en: [
          "The unit price is too high.",
          "The lead time is too long.",
          "The deposit is excessive.",
          "The quality is uncertain.",
        ],
        correct_index: 1,
        explanation_vi: "Anh ấy nói 'lead time of six weeks is going to be tight' — vấn đề là thời gian chứ không phải giá (anh ấy thậm chí nói 'unit price is fine').",
      },
      {
        question_en: "What does the woman offer in exchange for a faster lead time?",
        options_en: [
          "A discount on the unit price",
          "A higher deposit requirement",
          "Additional quality inspection",
          "An extended warranty",
        ],
        correct_index: 1,
        explanation_vi: "'30 percent deposit upfront instead of the usual 15' — đánh đổi giao nhanh = đặt cọc cao hơn.",
      },
      {
        question_en: "What does the woman say about quality control?",
        options_en: [
          "It will be skipped to save time.",
          "It will be done by the production team.",
          "It will not be affected by the faster timeline.",
          "It will require an additional fee.",
        ],
        correct_index: 2,
        explanation_vi: "'Not at all. Our QC team is staffed independently...' = QC độc lập với sản xuất nên không bị ảnh hưởng.",
      },
    ],
    typical_traps: [
      "'Lead time' ≠ 'thời gian dẫn đầu'. Đây là thuật ngữ logistics: thời gian từ đặt đơn đến nhận hàng.",
      "'Shave off a week' = bớt một tuần. 'Shave' (cạo râu) ở đây là nghĩa bóng — bớt đi.",
      "'Trade-off' = sự đánh đổi. Đáp án đúng thường nhắc 'trade-off' = '... in exchange for ...'.",
    ],
    vocabulary_focus: [
      {
        word: "lead time",
        vi_translation: "thời gian giao hàng (từ lúc đặt đến lúc nhận)",
        ipa: "/liːd taɪm/",
        common_collocations: ["short lead time", "reduce lead time", "lead time of X weeks"],
      },
      {
        word: "deposit",
        vi_translation: "tiền đặt cọc",
        ipa: "/dɪˈpɑː.zɪt/",
        common_collocations: ["pay a deposit", "deposit upfront", "non-refundable deposit"],
      },
      {
        word: "expedited",
        vi_translation: "được đẩy nhanh",
        ipa: "/ˈɛk.spə.daɪ.tɪd/",
        common_collocations: ["expedited shipping", "expedited production", "expedited service"],
      },
    ],
    estimated_time_minutes: 3,
  },
  {
    id: "toeic_listening_part3_it_helpdesk",
    section: "listening",
    part: 3,
    topic: "it_support",
    level: 605,
    title_vi: "Gọi tổng đài IT",
    title_en: "IT helpdesk call",
    audioKey: "toeic-listening/toeic_listening_part3_it_helpdesk.mp3",
    passage_or_audio_script:
      "W: IT support — this is Maya. How can I help?\n" +
      "M: Hi Maya, my email keeps showing 'connection error' since this morning. I've tried restarting twice but no luck.\n" +
      "W: Got it. Are you on the office Wi-Fi or remote today?\n" +
      "M: I'm working from home, on my own Wi-Fi.\n" +
      "W: That explains it. We pushed a security update last night that requires you to reconnect to the company VPN before email syncs. Open the VPN client, sign in with your usual credentials, and the error should clear within a minute.",
    questions: [
      {
        question_en: "What problem is the man reporting?",
        options_en: [
          "His laptop will not turn on.",
          "His email shows a connection error.",
          "He forgot his password.",
          "His Wi-Fi router is broken.",
        ],
        correct_index: 1,
        explanation_vi: "Anh ấy nói 'my email keeps showing connection error' — đây là vấn đề chính.",
      },
      {
        question_en: "Why did the problem occur?",
        options_en: [
          "The man forgot to charge his laptop.",
          "A security update now requires VPN.",
          "The office Wi-Fi is down.",
          "The email server is being upgraded.",
        ],
        correct_index: 1,
        explanation_vi: "Maya giải thích: 'security update last night that requires you to reconnect to the company VPN'.",
      },
    ],
    typical_traps: [
      "'Push an update' = đẩy/triển khai bản cập nhật. Đừng dịch nghĩa đen 'đẩy'.",
      "'Credentials' = thông tin đăng nhập (username + password). Số nhiều, không phải 'sự tin cậy'.",
      "'Working from home' = làm việc tại nhà — TOEIC luôn dùng cụm này, không nói 'work at home'.",
    ],
    vocabulary_focus: [
      {
        word: "credentials",
        vi_translation: "thông tin đăng nhập (tên + mật khẩu)",
        ipa: "/krəˈdɛn.ʃəlz/",
        common_collocations: ["sign in with credentials", "user credentials", "company credentials"],
      },
      {
        word: "VPN",
        vi_translation: "mạng riêng ảo",
        ipa: "/ˌviː.piːˈɛn/",
        common_collocations: ["connect to VPN", "VPN client", "company VPN"],
      },
      {
        word: "sync",
        vi_translation: "đồng bộ",
        ipa: "/sɪŋk/",
        common_collocations: ["email sync", "sync the calendar", "out of sync"],
      },
    ],
    estimated_time_minutes: 3,
  },

  // ─── Part 4: Short Talks (3 items) ─────────────────────────────────
  {
    id: "toeic_listening_part4_office_announcement",
    section: "listening",
    part: 4,
    topic: "maintenance_facilities",
    level: 605,
    title_vi: "Thông báo bảo trì văn phòng",
    title_en: "Office maintenance announcement",
    audioKey: "toeic-listening/toeic_listening_part4_office_announcement.mp3",
    passage_or_audio_script:
      "Good morning, everyone. This is a reminder that the building's electrical maintenance is scheduled for this Saturday from 8 a.m. to 2 p.m. During those hours, all power on floors three through seven — including the main printers, conference room AV systems, and the freight elevator — will be temporarily off. Personal laptops will of course still run on battery, but Wi-Fi access points will be down. If you need to finish urgent work, please plan to be in the office by Friday evening or work remotely on Saturday. The cafeteria on the first floor remains open as usual. Thank you for your cooperation.",
    questions: [
      {
        question_en: "When will the maintenance take place?",
        options_en: [
          "Friday evening",
          "Saturday morning to early afternoon",
          "Sunday afternoon",
          "Monday morning",
        ],
        correct_index: 1,
        explanation_vi: "'Saturday from 8 a.m. to 2 p.m.' = sáng đến đầu giờ chiều thứ Bảy.",
      },
      {
        question_en: "Which of the following will NOT be affected?",
        options_en: [
          "Main printers",
          "Conference room AV systems",
          "The cafeteria on the first floor",
          "The freight elevator",
        ],
        correct_index: 2,
        explanation_vi: "Người nói nói rõ 'cafeteria on the first floor remains open as usual'. Ba lựa chọn còn lại đều bị tắt điện.",
      },
      {
        question_en: "What does the speaker recommend?",
        options_en: [
          "Coming to the office Saturday morning",
          "Finishing urgent work by Friday or working remotely Saturday",
          "Using the freight elevator only",
          "Relocating to another floor",
        ],
        correct_index: 1,
        explanation_vi: "'Plan to be in the office by Friday evening or work remotely on Saturday' = đến trước thứ Sáu hoặc làm từ xa thứ Bảy.",
      },
    ],
    typical_traps: [
      "'Floors three through seven' = từ tầng 3 đến tầng 7 (bao gồm cả 3 và 7). Người Việt hay nhầm thành 3 và 7 riêng lẻ.",
      "'Will be down' = sẽ ngừng hoạt động. 'Down' ở đây không phải 'xuống'.",
      "'As usual' = như thường lệ. Câu hỏi NOT (loại trừ) thường dựa vào cụm này.",
    ],
    vocabulary_focus: [
      {
        word: "freight elevator",
        vi_translation: "thang máy chở hàng",
        ipa: "/freɪt ˈɛl.ə.veɪ.tɚ/",
        common_collocations: ["take the freight elevator", "freight elevator out of service"],
      },
      {
        word: "remotely",
        vi_translation: "từ xa",
        ipa: "/rɪˈmoʊt.li/",
        common_collocations: ["work remotely", "log in remotely", "manage remotely"],
      },
      {
        word: "AV (audio-visual)",
        vi_translation: "âm thanh - hình ảnh",
        ipa: "/ˌeɪˈviː/",
        common_collocations: ["AV system", "AV equipment", "AV cable"],
      },
    ],
    estimated_time_minutes: 3,
  },
  {
    id: "toeic_listening_part4_radio_advert",
    section: "listening",
    part: 4,
    topic: "marketing_advertising",
    level: 405,
    title_vi: "Quảng cáo radio - cửa hàng đồ điện tử",
    title_en: "Electronics store radio ad",
    audioKey: "toeic-listening/toeic_listening_part4_radio_advert.mp3",
    passage_or_audio_script:
      "Listeners, are you tired of laptops that slow down after a year? At BrightMark Electronics, we're celebrating our tenth anniversary with a four-day weekend sale — Thursday through Sunday only. All laptops in stock are 20 percent off, and you'll get a free three-year warranty when you spend over five hundred dollars. Want to skip the lines? Order online at brightmark dot com and choose store pickup — your laptop will be ready in two hours. Visit our flagship store on Pine Street downtown, open daily from 10 a.m.",
    questions: [
      {
        question_en: "How long does the sale last?",
        options_en: ["One day", "Three days", "Four days", "One week"],
        correct_index: 2,
        explanation_vi: "'Four-day weekend sale — Thursday through Sunday' = bốn ngày, từ thứ Năm đến Chủ nhật.",
      },
      {
        question_en: "What does a customer get when spending over $500?",
        options_en: [
          "An additional 20% discount",
          "A free three-year warranty",
          "Free shipping nationwide",
          "A free laptop bag",
        ],
        correct_index: 1,
        explanation_vi: "'Free three-year warranty when you spend over five hundred dollars'.",
      },
      {
        question_en: "How long does store pickup take?",
        options_en: ["30 minutes", "Two hours", "One day", "Three days"],
        correct_index: 1,
        explanation_vi: "'Your laptop will be ready in two hours'.",
      },
    ],
    typical_traps: [
      "'Through' trong 'Thursday through Sunday' = đến hết (bao gồm Chủ nhật). Người Việt hay hiểu thành 'qua thứ Sáu, thứ Bảy'.",
      "'In stock' = còn hàng. Đối lập là 'out of stock' = hết hàng.",
      "'Spend over' = chi nhiều hơn. Đừng nhầm với 'spend on' = tiêu vào.",
    ],
    vocabulary_focus: [
      {
        word: "warranty",
        vi_translation: "bảo hành",
        ipa: "/ˈwɔːr.ən.ti/",
        common_collocations: ["under warranty", "warranty period", "extended warranty"],
      },
      {
        word: "in stock",
        vi_translation: "còn hàng",
        ipa: "/ɪn stɑːk/",
        common_collocations: ["currently in stock", "still in stock", "back in stock"],
      },
      {
        word: "flagship",
        vi_translation: "cửa hàng/sản phẩm chủ lực",
        ipa: "/ˈflæɡ.ʃɪp/",
        common_collocations: ["flagship store", "flagship product", "flagship brand"],
      },
    ],
    estimated_time_minutes: 2,
  },
  {
    id: "toeic_listening_part4_voicemail_callback",
    section: "listening",
    part: 4,
    topic: "customer_service",
    level: 605,
    title_vi: "Hộp thư thoại - gọi lại khách hàng",
    title_en: "Customer voicemail callback",
    audioKey: "toeic-listening/toeic_listening_part4_voicemail_callback.mp3",
    passage_or_audio_script:
      "Hello, this message is for Mr. Tran. This is Sandra calling from Riverside Auto regarding the service appointment you booked for next Monday at 9 a.m. Unfortunately, the brake pads we need for your vehicle were back-ordered, and the shipment won't arrive until Wednesday. We have two options: we can keep your Monday slot and complete only the oil change, then have you return Wednesday afternoon for the brakes — at no additional labor charge — or we can move the entire appointment to Wednesday at 3 p.m. Please call me back at 555-0142 when you have a moment so we can confirm.",
    questions: [
      {
        question_en: "Why is Sandra calling?",
        options_en: [
          "To confirm Mr. Tran's address",
          "To explain a parts delay affecting his appointment",
          "To inform him that his car is ready for pickup",
          "To offer him a discount on a future service",
        ],
        correct_index: 1,
        explanation_vi: "Cô gọi để giải thích phụ tùng (brake pads) bị giao chậm, ảnh hưởng đến lịch hẹn.",
      },
      {
        question_en: "What is one option Sandra offers?",
        options_en: [
          "Cancel the service entirely",
          "Keep Monday for the oil change only, return Wednesday for brakes",
          "Have the brakes installed at home",
          "Use a substitute brand of brake pads",
        ],
        correct_index: 1,
        explanation_vi: "Phương án 1: 'keep your Monday slot and complete only the oil change, then return Wednesday'.",
      },
      {
        question_en: "What is Mr. Tran asked to do?",
        options_en: [
          "Send an email confirmation",
          "Visit the shop in person",
          "Call back to confirm the option",
          "Pay a deposit online",
        ],
        correct_index: 2,
        explanation_vi: "'Please call me back at 555-0142... so we can confirm'.",
      },
    ],
    typical_traps: [
      "'Back-ordered' = đặt rồi nhưng chưa có hàng. Hay bị nhầm là 'đặt lại'.",
      "'No additional labor charge' = không tính thêm tiền công. 'Labor' = công lao động, không phải 'lao động' chung chung.",
      "'When you have a moment' = khi nào tiện. Đây là cách lịch sự, không phải 'khi anh có một khoảnh khắc'.",
    ],
    vocabulary_focus: [
      {
        word: "back-ordered",
        vi_translation: "đã đặt nhưng chưa có hàng giao",
        ipa: "/ˈbæk ˌɔːr.dɚd/",
        common_collocations: ["item is back-ordered", "back-order status", "back-order delay"],
      },
      {
        word: "appointment",
        vi_translation: "cuộc hẹn",
        ipa: "/əˈpɔɪnt.mənt/",
        common_collocations: ["make an appointment", "reschedule the appointment", "miss an appointment"],
      },
      {
        word: "labor charge",
        vi_translation: "tiền công lao động",
        ipa: "/ˈleɪ.bɚ tʃɑːrdʒ/",
        common_collocations: ["additional labor charge", "labor cost", "labor fee"],
      },
    ],
    estimated_time_minutes: 3,
  },

  // ─── Listening overflow: Business meetings (3 items) ───────────────
  {
    id: "toeic_listening_extra_quarterly_review",
    section: "listening",
    part: 4,
    topic: "business_meeting",
    level: 785,
    title_vi: "Họp đánh giá quý",
    title_en: "Quarterly business review",
    audioKey: "toeic-listening/toeic_listening_extra_quarterly_review.mp3",
    passage_or_audio_script:
      "Welcome, everyone, to the Q3 review. Three headlines today. First, total revenue came in at 14.2 million dollars, four percent above target — driven mostly by the enterprise segment, where we closed two large accounts in August. Second, customer churn ticked up from 2.1 to 2.7 percent; the customer success team is leading a deep dive next week. Third, we're slightly behind on the new analytics product launch — engineering hit a security review that pushed the release from October to mid-November. We'll cover the launch readiness plan after this overview.",
    questions: [
      {
        question_en: "By what percentage did revenue exceed target?",
        options_en: ["Two percent", "Four percent", "Fourteen percent", "Twenty percent"],
        correct_index: 1,
        explanation_vi: "'Four percent above target' — vượt 4%.",
      },
      {
        question_en: "What concern does the speaker mention?",
        options_en: [
          "Revenue dropped sharply",
          "Customer churn increased",
          "The enterprise segment underperformed",
          "Hiring is behind schedule",
        ],
        correct_index: 1,
        explanation_vi: "'Customer churn ticked up from 2.1 to 2.7 percent' — tỷ lệ rời dịch vụ tăng.",
      },
      {
        question_en: "Why is the analytics launch delayed?",
        options_en: [
          "A budget shortfall",
          "A staffing change",
          "A security review",
          "A vendor disagreement",
        ],
        correct_index: 2,
        explanation_vi: "'Engineering hit a security review that pushed the release from October to mid-November'.",
      },
    ],
    typical_traps: [
      "'Tick up' = nhích lên (không phải 'đánh dấu lên').",
      "'Above target' = vượt chỉ tiêu. Đối lập 'below target' = dưới chỉ tiêu.",
      "'Deep dive' = nghiên cứu sâu (cuộc họp/báo cáo chi tiết). Không phải 'lặn sâu'.",
    ],
    vocabulary_focus: [
      {
        word: "churn",
        vi_translation: "tỷ lệ khách hàng rời bỏ",
        ipa: "/tʃɝːn/",
        common_collocations: ["customer churn", "churn rate", "reduce churn"],
      },
      {
        word: "above target",
        vi_translation: "vượt chỉ tiêu",
        ipa: "/əˈbʌv ˈtɑːr.ɡɪt/",
        common_collocations: ["come in above target", "exceed target", "miss the target"],
      },
      {
        word: "deep dive",
        vi_translation: "phân tích chuyên sâu",
        ipa: "/diːp daɪv/",
        common_collocations: ["do a deep dive", "deep dive into the data", "deep-dive session"],
      },
    ],
    estimated_time_minutes: 3,
  },
  {
    id: "toeic_listening_extra_team_standup",
    section: "listening",
    part: 3,
    topic: "business_meeting",
    level: 605,
    title_vi: "Họp giao ban đầu ngày",
    title_en: "Team morning stand-up",
    audioKey: "toeic-listening/toeic_listening_extra_team_standup.mp3",
    passage_or_audio_script:
      "M: Quick stand-up — Anna, where are we on the customer survey?\n" +
      "W: I'll have first results by Thursday. Two snags: the response rate is only twelve percent so far, lower than the eighteen we projected, and a few customers asked if their answers will stay anonymous.\n" +
      "M: Let's send a reminder email today and add a one-line privacy note on the survey landing page. Anything blocking you?\n" +
      "W: Just legal sign-off on the privacy wording — I'll ping Dao after this call.",
    questions: [
      {
        question_en: "What is Anna's main update?",
        options_en: [
          "The survey is finished and results are ready.",
          "First survey results will be available by Thursday.",
          "The survey will be canceled.",
          "The survey vendor changed.",
        ],
        correct_index: 1,
        explanation_vi: "'I'll have first results by Thursday'.",
      },
      {
        question_en: "What problem does Anna report?",
        options_en: [
          "The survey software is down.",
          "The response rate is lower than projected.",
          "The legal team rejected the survey.",
          "Anna is behind schedule due to vacation.",
        ],
        correct_index: 1,
        explanation_vi: "'Response rate is only twelve percent so far, lower than the eighteen we projected'.",
      },
    ],
    typical_traps: [
      "'Stand-up' (cuộc họp ngắn) — không phải 'đứng lên'. Trong văn phòng, đây là cuộc họp 15 phút mỗi sáng.",
      "'Snag' = trở ngại nhỏ. Hay bị bỏ qua vì lạ.",
      "'Ping someone' = liên lạc nhanh ai đó (qua chat). Không phải 'kêu ping'.",
    ],
    vocabulary_focus: [
      {
        word: "stand-up",
        vi_translation: "họp giao ban ngắn (thường mỗi sáng)",
        ipa: "/ˈstænd.ʌp/",
        common_collocations: ["daily stand-up", "morning stand-up", "stand-up meeting"],
      },
      {
        word: "anonymous",
        vi_translation: "ẩn danh",
        ipa: "/əˈnɑː.nə.məs/",
        common_collocations: ["stay anonymous", "anonymous survey", "anonymous tip"],
      },
      {
        word: "sign-off",
        vi_translation: "sự duyệt/phê chuẩn",
        ipa: "/ˈsaɪn.ɔːf/",
        common_collocations: ["legal sign-off", "get sign-off", "final sign-off"],
      },
    ],
    estimated_time_minutes: 2,
  },
  {
    id: "toeic_listening_extra_budget_disagreement",
    section: "listening",
    part: 3,
    topic: "business_meeting",
    level: 905,
    title_vi: "Bất đồng về ngân sách",
    title_en: "Budget disagreement",
    audioKey: "toeic-listening/toeic_listening_extra_budget_disagreement.mp3",
    passage_or_audio_script:
      "M: I have to push back on the proposed marketing cut. Trimming twelve percent from Q4 will cripple our holiday campaign, which historically drives a third of annual revenue.\n" +
      "W: I hear you, but Finance is asking every department for a similar trim — we can't carve out an exception unless we can defend it with hard numbers.\n" +
      "M: Then let me put together a one-page brief: spend versus attributable revenue for the past three holiday seasons, plus the cost of acquiring a new customer if we lose share to competitors. If the math doesn't justify protecting the budget, I'll accept the cut.\n" +
      "W: That's reasonable. Have it on my desk by Friday and I'll route it to the CFO.",
    questions: [
      {
        question_en: "Why does the man object to the proposed cut?",
        options_en: [
          "His team is understaffed.",
          "Q4 historically drives a third of annual revenue.",
          "He believes Finance is being unfair to marketing.",
          "The cut would force layoffs.",
        ],
        correct_index: 1,
        explanation_vi: "'Holiday campaign, which historically drives a third of annual revenue'.",
      },
      {
        question_en: "What does the woman say is required to make an exception?",
        options_en: [
          "Approval from the CEO directly",
          "Hard numbers to defend the case",
          "A unanimous vote",
          "Cutting another department instead",
        ],
        correct_index: 1,
        explanation_vi: "'We can't carve out an exception unless we can defend it with hard numbers'.",
      },
      {
        question_en: "What will the man prepare?",
        options_en: [
          "A new marketing campaign",
          "A formal complaint to HR",
          "A one-page brief on spend vs. revenue",
          "A list of layoff candidates",
        ],
        correct_index: 2,
        explanation_vi: "'Let me put together a one-page brief: spend versus attributable revenue...'",
      },
    ],
    typical_traps: [
      "'Push back on' = phản đối, không đồng ý (không phải 'đẩy ngược').",
      "'Carve out an exception' = tạo trường hợp ngoại lệ. 'Carve' = khắc, đẽo — nghĩa bóng.",
      "'Attributable revenue' = doanh thu quy đổi (do hoạt động X tạo ra). Khái niệm marketing - tài chính.",
    ],
    vocabulary_focus: [
      {
        word: "push back",
        vi_translation: "phản đối, đẩy lùi",
        ipa: "/pʊʃ bæk/",
        common_collocations: ["push back on a proposal", "push back the deadline", "pushback from the team"],
      },
      {
        word: "carve out",
        vi_translation: "tạo ra (ngoại lệ, không gian, vai trò)",
        ipa: "/kɑːrv aʊt/",
        common_collocations: ["carve out an exception", "carve out time", "carve out a niche"],
      },
      {
        word: "attributable",
        vi_translation: "có thể quy cho",
        ipa: "/əˈtrɪb.jə.tə.bəl/",
        common_collocations: ["attributable to", "attributable revenue", "directly attributable"],
      },
    ],
    estimated_time_minutes: 3,
  },
];

// ════════════════════════════════════════════════════════════════════
// READING — 15 items (Part 5: 5, Part 6: 5, Part 7: 5)
// ════════════════════════════════════════════════════════════════════

const READING: TOEICPracticeItem[] = [
  // ─── Part 5: Incomplete Sentences (5 items) ────────────────────────
  {
    id: "toeic_reading_part5_word_choice_apply",
    section: "reading",
    part: 5,
    topic: "hr_recruitment",
    level: 405,
    title_vi: "Phân biệt từ - apply / appeal / arrange",
    title_en: "Word choice — apply",
    passage_or_audio_script:
      "Candidates wishing to be considered for the analyst role must ______ online by April 30.",
    questions: [
      {
        question_en: "Which word completes the sentence?",
        options_en: ["apply", "appeal", "arrange", "arrive"],
        correct_index: 0,
        explanation_vi: "'Apply' = nộp đơn. 'Appeal' = kháng cáo / hấp dẫn — sai nghĩa. 'Arrange' = sắp xếp; 'arrive' = đến — không đi với 'online'.",
      },
    ],
    typical_traps: [
      "Người Việt hay nhầm 'apply' (nộp đơn) với 'appeal' (kháng cáo) vì cùng bắt đầu bằng 'app-'.",
      "'Apply for [position]' (nộp đơn cho vị trí) khác 'apply to [school/company]' (nộp vào trường/công ty).",
      "Cấu trúc TOEIC Part 5 hay test giới từ đi kèm — học từ trong cụm, không học từ rời.",
    ],
    vocabulary_focus: [
      {
        word: "apply",
        vi_translation: "nộp đơn; áp dụng",
        ipa: "/əˈplaɪ/",
        common_collocations: ["apply for a job", "apply online", "apply to a university"],
      },
      {
        word: "candidate",
        vi_translation: "ứng viên",
        ipa: "/ˈkæn.də.deɪt/",
        common_collocations: ["qualified candidate", "shortlist candidates", "ideal candidate"],
      },
      {
        word: "consider",
        vi_translation: "xem xét",
        ipa: "/kənˈsɪd.ɚ/",
        common_collocations: ["consider for a role", "consider an offer", "be considered for"],
      },
    ],
    estimated_time_minutes: 1,
  },
  {
    id: "toeic_reading_part5_subject_verb_agreement",
    section: "reading",
    part: 5,
    topic: "office_communication",
    level: 605,
    title_vi: "Hòa hợp chủ - vị (each of...)",
    title_en: "Subject-verb agreement",
    passage_or_audio_script:
      "Each of the regional managers ______ a quarterly report directly to the COO.",
    questions: [
      {
        question_en: "Which form completes the sentence?",
        options_en: ["submit", "submits", "submitting", "are submitting"],
        correct_index: 1,
        explanation_vi: "'Each of...' luôn đi với động từ số ít → 'submits'. (A) số nhiều; (C) thiếu trợ động từ; (D) số nhiều.",
      },
    ],
    typical_traps: [
      "'Each / every / one of...' luôn là số ít, dù theo sau là danh từ số nhiều.",
      "'Each of THE managers' (số nhiều) — danh từ số nhiều ở đây dễ đánh lừa người Việt chọn 'submit'.",
      "Đừng nhầm 'each' (mỗi - số ít) với 'all' (tất cả - số nhiều).",
    ],
    vocabulary_focus: [
      {
        word: "submit",
        vi_translation: "nộp, đệ trình",
        ipa: "/səbˈmɪt/",
        common_collocations: ["submit a report", "submit an application", "submit for review"],
      },
      {
        word: "regional",
        vi_translation: "thuộc khu vực",
        ipa: "/ˈriː.dʒə.nəl/",
        common_collocations: ["regional manager", "regional office", "regional sales"],
      },
      {
        word: "quarterly",
        vi_translation: "hàng quý",
        ipa: "/ˈkwɔːr.tɚ.li/",
        common_collocations: ["quarterly report", "quarterly review", "quarterly earnings"],
      },
    ],
    estimated_time_minutes: 1,
  },
  {
    id: "toeic_reading_part5_preposition_in_charge_of",
    section: "reading",
    part: 5,
    topic: "office_communication",
    level: 605,
    title_vi: "Giới từ - in charge of",
    title_en: "Preposition — in charge of",
    passage_or_audio_script:
      "Ms. Pham has been promoted to Senior Manager and is now in charge ______ the Hanoi distribution team.",
    questions: [
      {
        question_en: "Which preposition completes the phrase?",
        options_en: ["for", "of", "with", "to"],
        correct_index: 1,
        explanation_vi: "Cụm cố định 'in charge of' = phụ trách. (A) 'for' đi với 'responsible for'; (C) 'with' là 'busy with'; (D) 'to' không đứng sau 'charge'.",
      },
    ],
    typical_traps: [
      "Người Việt hay viết 'in charge for' do quen với 'responsible for' — nhầm lẫn cấu trúc.",
      "Đừng dịch ngược từ tiếng Việt 'phụ trách cho' → 'in charge for'. Sai.",
      "Cụm 'be in charge of' luôn cố định. Học cả cụm.",
    ],
    vocabulary_focus: [
      {
        word: "in charge of",
        vi_translation: "phụ trách",
        ipa: "/ɪn tʃɑːrdʒ əv/",
        common_collocations: ["in charge of the team", "person in charge", "in charge of operations"],
      },
      {
        word: "promote",
        vi_translation: "thăng chức",
        ipa: "/prəˈmoʊt/",
        common_collocations: ["promote to manager", "be promoted", "promotion opportunity"],
      },
      {
        word: "distribution",
        vi_translation: "phân phối",
        ipa: "/ˌdɪs.trəˈbjuː.ʃən/",
        common_collocations: ["distribution team", "distribution center", "distribution channel"],
      },
    ],
    estimated_time_minutes: 1,
  },
  {
    id: "toeic_reading_part5_relative_clause_whose",
    section: "reading",
    part: 5,
    topic: "marketing_advertising",
    level: 785,
    title_vi: "Mệnh đề quan hệ - whose",
    title_en: "Relative pronoun — whose",
    passage_or_audio_script:
      "Lumin Studio, ______ branding work was praised by industry critics, has been selected to redesign our packaging.",
    questions: [
      {
        question_en: "Which relative pronoun fits?",
        options_en: ["which", "who", "whose", "that"],
        correct_index: 2,
        explanation_vi: "'Whose' chỉ sở hữu (cái gì đó CỦA Lumin Studio — branding work của họ). 'Which/that' không thể hiện sở hữu; 'who' chỉ người.",
      },
    ],
    typical_traps: [
      "Người Việt thường chọn 'which' khi tiền tố là vật/công ty. Nhưng 'whose' dùng được cho cả người, vật, tổ chức khi nói về sở hữu.",
      "'Whose work' = công việc CỦA ai/cái gì. Đừng nhầm với 'who's' = 'who is'.",
      "Trong văn viết trang trọng (TOEIC), 'that' không bao giờ dùng sau dấu phẩy — phải là 'which' hoặc 'whose'.",
    ],
    vocabulary_focus: [
      {
        word: "whose",
        vi_translation: "của ai/cái gì (đại từ quan hệ sở hữu)",
        ipa: "/huːz/",
        common_collocations: ["whose work", "whose responsibility", "whose decision"],
      },
      {
        word: "praise",
        vi_translation: "khen ngợi",
        ipa: "/preɪz/",
        common_collocations: ["highly praised", "praise for", "praise from critics"],
      },
      {
        word: "redesign",
        vi_translation: "thiết kế lại",
        ipa: "/ˌriː.dɪˈzaɪn/",
        common_collocations: ["redesign the website", "redesign the packaging", "complete redesign"],
      },
    ],
    estimated_time_minutes: 1,
  },
  {
    id: "toeic_reading_part5_word_form_adverb",
    section: "reading",
    part: 5,
    topic: "finance",
    level: 605,
    title_vi: "Dạng từ - trạng từ",
    title_en: "Word form — adverb",
    passage_or_audio_script:
      "The auditing team finished the year-end review ______ ahead of the deadline.",
    questions: [
      {
        question_en: "Which form completes the sentence?",
        options_en: ["comfortable", "comfortably", "comfort", "comforting"],
        correct_index: 1,
        explanation_vi: "Cần trạng từ bổ nghĩa cho 'ahead of' (cụm trạng ngữ). 'Comfortably' (B) là trạng từ → 'thoải mái sớm trước hạn'. (A) tính từ; (C) danh từ; (D) hiện tại phân từ.",
      },
    ],
    typical_traps: [
      "Bài Part 5 dạng từ luôn có 4 đáp án cùng gốc — đọc cả câu để xem cần loại gì (danh / động / tính / trạng).",
      "'Comfortably ahead' = sớm thoải mái (cách nói tự nhiên). Người Việt dịch ngược dễ chọn 'comfortable' vì quen tính từ.",
      "Trạng từ thường kết thúc bằng -ly, nhưng KHÔNG phải lúc nào: 'fast' vừa là tính từ vừa là trạng từ.",
    ],
    vocabulary_focus: [
      {
        word: "comfortably",
        vi_translation: "một cách thoải mái",
        ipa: "/ˈkʌm.fɚ.tə.bli/",
        common_collocations: ["comfortably ahead", "comfortably afford", "comfortably seated"],
      },
      {
        word: "audit",
        vi_translation: "kiểm toán",
        ipa: "/ˈɔː.dɪt/",
        common_collocations: ["internal audit", "audit team", "year-end audit"],
      },
      {
        word: "ahead of",
        vi_translation: "trước (thời hạn)",
        ipa: "/əˈhɛd əv/",
        common_collocations: ["ahead of schedule", "ahead of the deadline", "ahead of the curve"],
      },
    ],
    estimated_time_minutes: 1,
  },

  // ─── Part 6: Text Completion (5 items) ─────────────────────────────
  {
    id: "toeic_reading_part6_email_office_move",
    section: "reading",
    part: 6,
    topic: "email_correspondence",
    level: 605,
    title_vi: "Email - thông báo chuyển văn phòng",
    title_en: "Email — office relocation",
    passage_or_audio_script:
      "Subject: Office relocation — September 1\n\n" +
      "Dear team,\n\n" +
      "After three years at our current address, we are ______ (1) excited to announce that the company will relocate to a larger space at 88 Le Loi Street, District 1. The new office offers more meeting rooms, a quiet zone, and dedicated bike storage.\n\n" +
      "We will move ______ (2) the long Independence Day weekend so business operations are not interrupted. ______ (3). If you would like to keep any of these in the new office, please contact Linh in Facilities by August 20.\n\n" +
      "Looking forward to ______ (4) you in the new space.\n\n" +
      "Best,\nDuy",
    questions: [
      {
        question_en: "Blank (1) — choose the best word.",
        options_en: ["thrilled", "thrillingly", "thrilling", "thrills"],
        correct_index: 0,
        explanation_vi: "'We are thrilled' = 'chúng tôi rất phấn khích'. Cấu trúc 'be + V3/Adj' — 'thrilled' (tính từ quá khứ phân từ).",
      },
      {
        question_en: "Blank (2) — choose the best preposition.",
        options_en: ["over", "during", "through", "across"],
        correct_index: 1,
        explanation_vi: "'During the long weekend' = trong dịp cuối tuần dài. 'During' = trong khoảng thời gian xác định.",
      },
      {
        question_en: "Blank (3) — choose the sentence that fits best.",
        options_en: [
          "Some of the older furniture will not be transported.",
          "Our internet provider has changed.",
          "The new lease is for ten years.",
          "Parking spots will be assigned by salary level.",
        ],
        correct_index: 0,
        explanation_vi: "Câu sau yêu cầu liên hệ 'if you'd like to keep any of THESE' — 'these' phải chỉ đến thứ gì đó cụ thể đã nhắc, đó là đồ nội thất cũ không chuyển.",
      },
      {
        question_en: "Blank (4) — choose the best form.",
        options_en: ["see", "seeing", "have seen", "to see"],
        correct_index: 1,
        explanation_vi: "'Looking forward to' luôn đi với V-ing → 'seeing'. Đây là cấu trúc cố định.",
      },
    ],
    typical_traps: [
      "'Look forward to + V-ing', không phải 'to + V-infinitive'. Lỗi cực phổ biến của người Việt.",
      "'Thrilled' (rất phấn khích) — phân biệt với 'thrilling' (gây phấn khích). Người sự việc gây ra chứ không phải tự gây.",
      "'During' + cụm thời gian xác định; 'for' + khoảng thời gian. 'Over the weekend' và 'during the weekend' đều dùng được nhưng khác sắc thái.",
    ],
    vocabulary_focus: [
      {
        word: "relocate",
        vi_translation: "di dời, chuyển đến",
        ipa: "/ˌriːˈloʊ.keɪt/",
        common_collocations: ["relocate the office", "relocate to [city]", "relocation costs"],
      },
      {
        word: "look forward to",
        vi_translation: "mong chờ",
        ipa: "/lʊk ˈfɔːr.wɚd tu/",
        common_collocations: ["look forward to seeing", "look forward to the weekend", "look forward to hearing"],
      },
      {
        word: "interrupt",
        vi_translation: "làm gián đoạn",
        ipa: "/ˌɪn.tɚˈrʌpt/",
        common_collocations: ["interrupt operations", "interrupt service", "uninterrupted"],
      },
    ],
    estimated_time_minutes: 4,
  },
  {
    id: "toeic_reading_part6_memo_security_policy",
    section: "reading",
    part: 6,
    topic: "it_support",
    level: 785,
    title_vi: "Ghi chú - chính sách bảo mật mới",
    title_en: "Memo — new security policy",
    passage_or_audio_script:
      "MEMO — Updated password policy\n\n" +
      "Beginning next Monday, all employees ______ (1) required to use a password manager approved by IT. The previous policy of changing passwords every 90 days will be retired ______ (2) it has been shown to encourage weaker, repeated passwords.\n\n" +
      "______ (3). Each employee will receive an enrollment email with a unique activation link. Two-factor authentication remains mandatory for ______ (4) systems.",
    questions: [
      {
        question_en: "Blank (1)",
        options_en: ["are", "is", "be", "been"],
        correct_index: 0,
        explanation_vi: "'All employees' (số nhiều) → động từ số nhiều → 'are required'. (B) số ít; (C)/(D) cần trợ động từ.",
      },
      {
        question_en: "Blank (2)",
        options_en: ["although", "because", "however", "despite"],
        correct_index: 1,
        explanation_vi: "Câu chỉ NGUYÊN NHÂN tại sao chính sách cũ bị bỏ — 'because'. (A)/(C)/(D) đều là từ chỉ tương phản.",
      },
      {
        question_en: "Blank (3) — choose the sentence that best fits.",
        options_en: [
          "The IT team is currently evaluating three vendors.",
          "Rollout begins with the engineering department.",
          "We apologize for the inconvenience this may cause.",
          "Old passwords will be securely deleted by year-end.",
        ],
        correct_index: 1,
        explanation_vi: "Câu sau là 'Each employee will receive an enrollment email' — bắt đầu triển khai cụ thể. Câu (B) 'Rollout begins with engineering' khớp ngữ cảnh triển khai.",
      },
      {
        question_en: "Blank (4)",
        options_en: ["sensitive", "sensitively", "sensitivity", "sense"],
        correct_index: 0,
        explanation_vi: "Cần tính từ bổ nghĩa danh từ 'systems' → 'sensitive systems' (hệ thống nhạy cảm). (B) trạng từ; (C) danh từ; (D) danh từ/động từ.",
      },
    ],
    typical_traps: [
      "Câu chèn (insert sentence) Part 6: chọn câu duy trì mạch - đại từ 'this/it/these' phải có tiền ngữ rõ ràng.",
      "'Because' (vì - lý do) khác 'although/despite' (mặc dù - tương phản). Đọc nghĩa toàn câu trước khi chọn liên từ.",
      "'Sensitive' = nhạy cảm. 'Sensible' = có lý, hợp lý — hai từ dễ nhầm cho người Việt.",
    ],
    vocabulary_focus: [
      {
        word: "retire (a policy)",
        vi_translation: "ngừng áp dụng (chính sách)",
        ipa: "/rɪˈtaɪɚ/",
        common_collocations: ["retire a policy", "retire from work", "retire a product"],
      },
      {
        word: "rollout",
        vi_translation: "triển khai (sản phẩm/chính sách)",
        ipa: "/ˈroʊl.aʊt/",
        common_collocations: ["product rollout", "phased rollout", "rollout begins"],
      },
      {
        word: "two-factor authentication",
        vi_translation: "xác thực hai yếu tố",
        ipa: "/tuː ˈfæk.tɚ ɔːˌθɛn.tɪˈkeɪ.ʃən/",
        common_collocations: ["enable 2FA", "two-factor authentication required", "set up 2FA"],
      },
    ],
    estimated_time_minutes: 4,
  },
  {
    id: "toeic_reading_part6_notice_training",
    section: "reading",
    part: 6,
    topic: "training_workshop",
    level: 605,
    title_vi: "Thông báo - khóa đào tạo bắt buộc",
    title_en: "Notice — mandatory training",
    passage_or_audio_script:
      "Notice: Anti-harassment training\n\n" +
      "All staff are ______ (1) to complete the updated anti-harassment course by October 15. The course takes about forty minutes and ______ (2) on the company learning portal.\n\n" +
      "Managers must ensure that everyone on their team has finished the training by the deadline. ______ (3). HR will send weekly reminders to ______ (4) employees.",
    questions: [
      {
        question_en: "Blank (1)",
        options_en: ["request", "requested", "requesting", "required"],
        correct_index: 3,
        explanation_vi: "'Are required to + V' = bị/được yêu cầu. (A)(C) sai cấu trúc; (B) 'requested' nghĩa lịch sự hơn nhưng tài liệu nhân sự dùng 'required' khi bắt buộc.",
      },
      {
        question_en: "Blank (2)",
        options_en: ["available", "availability", "availably", "to avail"],
        correct_index: 0,
        explanation_vi: "'Is available' = có sẵn. Cần tính từ sau 'is'. (B) danh từ; (C) trạng từ không thông dụng; (D) sai dạng.",
      },
      {
        question_en: "Blank (3) — choose the sentence that fits best.",
        options_en: [
          "Failure to comply may result in disciplinary action.",
          "Lunch will be provided after the session.",
          "Translation is available in five languages.",
          "The previous course will be archived next year.",
        ],
        correct_index: 0,
        explanation_vi: "Câu trước nói managers phải đảm bảo, câu sau nói HR gửi nhắc — câu (A) gắn kết hậu quả nếu không tuân thủ, hợp ngữ cảnh nghiêm túc.",
      },
      {
        question_en: "Blank (4)",
        options_en: ["incomplete", "incompletely", "incomplete-ness", "complete"],
        correct_index: 0,
        explanation_vi: "'Incomplete employees' không hoạt động (sai logic), nhưng từ 'incomplete' ở đây hiệu chỉnh trong tiếng Anh kinh doanh nghĩa 'những nhân viên chưa hoàn thành' — tự nhiên hơn 'employees who have not completed'. (D) 'complete' sai nghĩa.",
      },
    ],
    typical_traps: [
      "'Required to' (bị/được yêu cầu) khác 'requested to' (được nhờ) — nhân sự dùng 'required' khi bắt buộc.",
      "'Comply with' = tuân thủ. Đừng dùng 'comply to'.",
      "Câu 'Failure to comply' là cụm chuẩn trong văn bản pháp lý / nhân sự — học thuộc.",
    ],
    vocabulary_focus: [
      {
        word: "comply",
        vi_translation: "tuân thủ",
        ipa: "/kəmˈplaɪ/",
        common_collocations: ["comply with the policy", "fail to comply", "compliance team"],
      },
      {
        word: "disciplinary",
        vi_translation: "kỷ luật (tính từ)",
        ipa: "/ˈdɪs.ə.plə.nɛr.i/",
        common_collocations: ["disciplinary action", "disciplinary procedure", "disciplinary hearing"],
      },
      {
        word: "harassment",
        vi_translation: "quấy rối",
        ipa: "/həˈræs.mənt/",
        common_collocations: ["sexual harassment", "harassment policy", "anti-harassment training"],
      },
    ],
    estimated_time_minutes: 4,
  },
  {
    id: "toeic_reading_part6_letter_supplier",
    section: "reading",
    part: 6,
    topic: "logistics_shipping",
    level: 785,
    title_vi: "Thư - phản hồi nhà cung cấp",
    title_en: "Letter — supplier response",
    passage_or_audio_script:
      "Dear Mr. Hoang,\n\n" +
      "Thank you for ______ (1) your concerns regarding the recent shipment of damaged units. Quality control is our highest priority, and a delivery this far below our standard is unacceptable.\n\n" +
      "______ (2) for the inconvenience, we will send replacement units by air freight at our expense, with arrival expected within five business days. We are also conducting a root-cause review at the packaging facility ______ (3) prevent a repeat.\n\n" +
      "Please find attached a credit note ______ (4) the value of the damaged units.",
    questions: [
      {
        question_en: "Blank (1)",
        options_en: ["raise", "raised", "raising", "to raise"],
        correct_index: 2,
        explanation_vi: "'Thank you for + V-ing' → 'raising'. (A) infinitive sai; (B) quá khứ; (D) đáp án dùng sau danh từ khác.",
      },
      {
        question_en: "Blank (2)",
        options_en: ["Apologize", "To apologize", "Apologizing", "Apology"],
        correct_index: 3,
        explanation_vi: "'Apology for the inconvenience' = lời xin lỗi vì sự bất tiện. Cần danh từ ở đầu câu chủ ngữ. Cấu trúc 'As an apology...' hoặc đứng độc lập.",
      },
      {
        question_en: "Blank (3)",
        options_en: ["so", "to", "for", "of"],
        correct_index: 1,
        explanation_vi: "'To prevent' = để ngăn chặn. Đây là 'to-infinitive' chỉ mục đích.",
      },
      {
        question_en: "Blank (4)",
        options_en: ["of", "for", "with", "to"],
        correct_index: 1,
        explanation_vi: "'A credit note for [amount]' = phiếu tín dụng trị giá... Cụm cố định trong tài liệu thương mại.",
      },
    ],
    typical_traps: [
      "'Thank you for + V-ing' — KHÔNG phải 'thank you to + V'.",
      "'At our expense' = chi phí của chúng tôi. Đừng nhầm 'expense' (chi phí) với 'expensive' (đắt).",
      "'Root-cause review' = đánh giá nguyên nhân gốc. Thuật ngữ chất lượng/kiểm toán.",
    ],
    vocabulary_focus: [
      {
        word: "shipment",
        vi_translation: "lô hàng",
        ipa: "/ˈʃɪp.mənt/",
        common_collocations: ["shipment delay", "track the shipment", "damaged shipment"],
      },
      {
        word: "at our expense",
        vi_translation: "chúng tôi chịu phí",
        ipa: "/æt aʊɚ ɪkˈspɛns/",
        common_collocations: ["at the company's expense", "at no expense to you", "at our expense"],
      },
      {
        word: "credit note",
        vi_translation: "phiếu tín dụng (hoàn lại giá trị)",
        ipa: "/ˈkrɛd.ɪt noʊt/",
        common_collocations: ["issue a credit note", "credit note for [amount]", "request a credit note"],
      },
    ],
    estimated_time_minutes: 4,
  },
  {
    id: "toeic_reading_part6_announcement_product",
    section: "reading",
    part: 6,
    topic: "product_launch",
    level: 605,
    title_vi: "Thông báo - ra mắt sản phẩm",
    title_en: "Announcement — product launch",
    passage_or_audio_script:
      "We are pleased to announce that the new SafeGrip work gloves will be ______ (1) starting March 5. The gloves were designed in partnership with construction professionals ______ (2) feedback on grip, durability, and breathability.\n\n" +
      "______ (3). Existing customers can reserve a pair at the launch price by signing up at safegrip dot com slash early.\n\n" +
      "All pre-orders ______ (4) free shipping within the country.",
    questions: [
      {
        question_en: "Blank (1)",
        options_en: ["available", "availably", "availability", "avail"],
        correct_index: 0,
        explanation_vi: "'Will be available' = sẽ có sẵn. Cần tính từ sau 'be'.",
      },
      {
        question_en: "Blank (2)",
        options_en: ["which", "whose", "who", "whom"],
        correct_index: 2,
        explanation_vi: "Tiền tố là 'professionals' (người), chủ ngữ của mệnh đề tiếp theo (gave feedback) → 'who'. (D) 'whom' chỉ dùng làm tân ngữ.",
      },
      {
        question_en: "Blank (3) — sentence insert.",
        options_en: [
          "Production has been moved overseas this year.",
          "The launch price is twenty percent below standard retail.",
          "The previous version was discontinued five years ago.",
          "Our color options will be reviewed annually.",
        ],
        correct_index: 1,
        explanation_vi: "Câu sau nói 'reserve a pair AT THE LAUNCH PRICE' — câu (B) định nghĩa giá ra mắt là điều kiện để câu sau hiểu được.",
      },
      {
        question_en: "Blank (4)",
        options_en: ["include", "includes", "including", "are included"],
        correct_index: 0,
        explanation_vi: "Chủ ngữ 'all pre-orders' (số nhiều) → 'include'. (B) số ít; (C) hiện tại phân từ không thành câu; (D) bị động sai nghĩa.",
      },
    ],
    typical_traps: [
      "'Who' (chủ ngữ) khác 'whom' (tân ngữ). Người Việt thường dùng 'whom' sai vị trí vì nghĩ 'whom' lịch sự hơn.",
      "Câu chèn Part 6: luôn đọc câu trước và câu sau — đại từ và mạo từ trong câu sau quyết định.",
      "'Pre-order' (đặt trước) là động từ + danh từ ghép. Số nhiều: 'pre-orders'.",
    ],
    vocabulary_focus: [
      {
        word: "durability",
        vi_translation: "độ bền",
        ipa: "/ˌdʊr.əˈbɪl.ə.ti/",
        common_collocations: ["test durability", "high durability", "durability rating"],
      },
      {
        word: "breathability",
        vi_translation: "tính thoáng khí",
        ipa: "/ˌbriːð.əˈbɪl.ə.ti/",
        common_collocations: ["breathability of the fabric", "improve breathability"],
      },
      {
        word: "pre-order",
        vi_translation: "đặt hàng trước",
        ipa: "/ˌpriːˈɔːr.dɚ/",
        common_collocations: ["pre-order online", "pre-order discount", "pre-order ships"],
      },
    ],
    estimated_time_minutes: 4,
  },

  // ─── Part 7: Reading Comprehension (5 items) ───────────────────────
  {
    id: "toeic_reading_part7_email_invoice_query",
    section: "reading",
    part: 7,
    topic: "email_correspondence",
    level: 605,
    title_vi: "Email - thắc mắc hóa đơn",
    title_en: "Email — invoice question",
    passage_or_audio_script:
      "From: Khoa Vu <kvu@brightline.vn>\n" +
      "To: billing@northstar-supplies.com\n" +
      "Date: April 18\n" +
      "Subject: Invoice #44871 — line-item question\n\n" +
      "Hi Northstar billing team,\n\n" +
      "I'm reviewing invoice #44871 (March order, $4,820 total) and have one question. Line 4 lists 'Express handling — $180,' but our purchase order didn't request express handling. Standard shipping was selected on the order form.\n\n" +
      "Could you confirm whether this charge was applied in error? If it was correct (for example, because the warehouse upgraded the shipping method to meet our delivery date), a short note explaining that would help when I file the invoice with our finance team.\n\n" +
      "Otherwise, please issue a credit note for $180 and I'll process the rest of the invoice this week.\n\n" +
      "Thanks,\nKhoa",
    questions: [
      {
        question_en: "What is the purpose of the email?",
        options_en: [
          "To dispute the entire invoice as fraudulent",
          "To ask about a specific charge that may have been added in error",
          "To request a discount on a future order",
          "To change the delivery address",
        ],
        correct_index: 1,
        explanation_vi: "Khoa hỏi cụ thể về line 4 (express handling) — không phải dispute toàn bộ hóa đơn.",
      },
      {
        question_en: "What does Khoa say he will do if the charge was correct?",
        options_en: [
          "Refuse to pay the invoice",
          "Pay only half of the invoice",
          "Process the invoice with finance after receiving an explanation",
          "Cancel the existing relationship with Northstar",
        ],
        correct_index: 2,
        explanation_vi: "'A short note explaining that would help when I file the invoice with our finance team' — sẽ xử lý nếu có lời giải thích.",
      },
      {
        question_en: "What does Khoa request if the charge was an error?",
        options_en: [
          "A credit note for $180",
          "A full refund of the invoice",
          "A new invoice with a different total",
          "A meeting with the billing manager",
        ],
        correct_index: 0,
        explanation_vi: "'Please issue a credit note for $180'.",
      },
    ],
    typical_traps: [
      "'In error' = sai sót. Hay bị nhầm thành 'lỗi' chung chung — ở đây nghĩa cụ thể là 'do nhầm lẫn'.",
      "'File an invoice with' = nộp hóa đơn để xử lý. 'File' = lưu/nộp, không phải 'tệp'.",
      "'Otherwise' = nếu không (chỉ điều kiện thay thế). Người Việt hay nhầm với 'or else' (kẻo).",
    ],
    vocabulary_focus: [
      {
        word: "invoice",
        vi_translation: "hóa đơn",
        ipa: "/ˈɪn.vɔɪs/",
        common_collocations: ["issue an invoice", "process the invoice", "invoice number"],
      },
      {
        word: "purchase order",
        vi_translation: "đơn đặt hàng",
        ipa: "/ˈpɝː.tʃəs ˈɔːr.dɚ/",
        common_collocations: ["raise a purchase order", "purchase order number", "PO number"],
      },
      {
        word: "in error",
        vi_translation: "do sai sót, nhầm lẫn",
        ipa: "/ɪn ˈɛr.ɚ/",
        common_collocations: ["charged in error", "sent in error", "applied in error"],
      },
    ],
    estimated_time_minutes: 4,
  },
  {
    id: "toeic_reading_part7_advert_apartment",
    section: "reading",
    part: 7,
    topic: "real_estate",
    level: 405,
    title_vi: "Quảng cáo - cho thuê căn hộ",
    title_en: "Advertisement — apartment rental",
    passage_or_audio_script:
      "RIVERPARK APARTMENTS — Now leasing\n\n" +
      "Spacious 2-bedroom units in the heart of District 7. Building amenities include a 24-hour gym, rooftop pool, secure underground parking, and high-speed fiber internet included with every lease.\n\n" +
      "- Monthly rent: from 22,500,000 VND\n" +
      "- Lease term: 12 months minimum (6-month leases available at +10%)\n" +
      "- Deposit: 2 months' rent, refundable on move-out inspection\n" +
      "- Pets: cats welcome, dogs under 15 kg with deposit\n" +
      "- Utilities: not included; tenants set up their own electricity and water accounts\n\n" +
      "Open viewing: every Saturday and Sunday, 10 a.m. to 4 p.m. — no appointment needed for short tours. For full tours including roof and gym, please email rentals@riverpark.vn at least 24 hours in advance.",
    questions: [
      {
        question_en: "What is included with every lease?",
        options_en: [
          "Free electricity and water",
          "High-speed fiber internet",
          "A free parking space at street level",
          "Weekly cleaning service",
        ],
        correct_index: 1,
        explanation_vi: "'High-speed fiber internet included with every lease'.",
      },
      {
        question_en: "Which condition applies to a 6-month lease?",
        options_en: [
          "It costs 10% more than the 12-month rate.",
          "It is not allowed.",
          "It requires a 3-month deposit.",
          "Only short-term tenants qualify.",
        ],
        correct_index: 0,
        explanation_vi: "'6-month leases available at +10%'.",
      },
      {
        question_en: "What is required for a full tour including the roof and gym?",
        options_en: [
          "An appointment by email at least 24 hours in advance",
          "Payment of a tour fee",
          "A signed letter of intent",
          "Identification verification on site",
        ],
        correct_index: 0,
        explanation_vi: "'For full tours including roof and gym, please email rentals@riverpark.vn at least 24 hours in advance'.",
      },
    ],
    typical_traps: [
      "'Lease term' = thời hạn thuê. 'Term' không phải 'kỳ hạn học'.",
      "'Refundable on move-out inspection' = hoàn lại sau khi kiểm tra lúc trả nhà. Cụm điều kiện hay xuất hiện trong hợp đồng.",
      "'Utilities' = điện nước (số nhiều). Đừng nhầm 'utility' (sự hữu ích — số ít).",
    ],
    vocabulary_focus: [
      {
        word: "lease",
        vi_translation: "hợp đồng thuê (dài hạn)",
        ipa: "/liːs/",
        common_collocations: ["sign a lease", "lease term", "renew the lease"],
      },
      {
        word: "deposit",
        vi_translation: "tiền đặt cọc",
        ipa: "/dɪˈpɑː.zɪt/",
        common_collocations: ["pay a deposit", "refundable deposit", "deposit on move-in"],
      },
      {
        word: "amenities",
        vi_translation: "tiện ích",
        ipa: "/əˈmɛn.ə.tiz/",
        common_collocations: ["building amenities", "in-unit amenities", "shared amenities"],
      },
    ],
    estimated_time_minutes: 3,
  },
  {
    id: "toeic_reading_part7_article_remote_work",
    section: "reading",
    part: 7,
    topic: "marketing_advertising",
    level: 905,
    title_vi: "Bài báo - làm việc từ xa và thị trường thuê",
    title_en: "Article — remote work and rental market",
    passage_or_audio_script:
      "When the global shift to remote work began, many analysts predicted that demand for downtown office space would collapse and never recover. Five years later, the picture is more nuanced. Vacancy rates in central business districts remain elevated — averaging 18 percent in major Asian cities, up from 9 percent before the shift — but new patterns have emerged that complicate the simple 'remote killed the office' narrative.\n\n" +
      "First, square-footage demand has fallen, but quality demand has risen. Companies that downsize their footprint typically upgrade the location and amenities of the smaller space they keep, treating the office as a magnet for in-person collaboration rather than a default workspace. As a result, top-tier buildings have continued to command rents 4-7 percent above pre-shift highs while mid-tier buildings struggle.\n" +
      "Second, the residential market has absorbed surprising spillover. Apartments large enough to include a dedicated home office now lease 12 percent faster than equivalent units without one. Buildings that added co-working lounges to common areas reported leasing premiums of up to 9 percent, particularly in cities where developers acted within the first 18 months of the shift.\n" +
      "Whether these patterns harden into a new equilibrium or revert as workplace policies continue evolving remains to be seen. What is no longer in doubt is that the office of 2030 will not be the office of 2019 — even for companies whose workers eventually return five days a week.",
    questions: [
      {
        question_en: "What was a common early prediction about office space?",
        options_en: [
          "That demand would fully recover within two years",
          "That demand would collapse and never recover",
          "That rents would double in central districts",
          "That offices would be converted to housing",
        ],
        correct_index: 1,
        explanation_vi: "'Demand for downtown office space would collapse and never recover'.",
      },
      {
        question_en: "What does the article say about top-tier buildings?",
        options_en: [
          "They have lost the most tenants.",
          "Their rents are 4-7% above pre-shift highs.",
          "They are being demolished at higher rates.",
          "They now serve only government agencies.",
        ],
        correct_index: 1,
        explanation_vi: "'Top-tier buildings have continued to command rents 4-7 percent above pre-shift highs'.",
      },
      {
        question_en: "What pattern is reported about apartments?",
        options_en: [
          "Apartments with dedicated home offices lease faster.",
          "All rents have fallen by 12%.",
          "Co-working lounges have been removed from buildings.",
          "Tenants prefer smaller units without amenities.",
        ],
        correct_index: 0,
        explanation_vi: "'Apartments large enough to include a dedicated home office now lease 12 percent faster'.",
      },
      {
        question_en: "What is the author's overall conclusion?",
        options_en: [
          "Offices are dead.",
          "Remote work has been reversed completely.",
          "The office of 2030 will not look like the office of 2019.",
          "Real estate prices will return to 2019 levels by 2030.",
        ],
        correct_index: 2,
        explanation_vi: "Câu cuối: 'The office of 2030 will not be the office of 2019 — even for companies whose workers eventually return five days a week'.",
      },
    ],
    typical_traps: [
      "'Nuanced' = tinh tế, có nhiều khía cạnh. Người Việt hay dịch nhầm thành 'phức tạp tiêu cực'.",
      "'Spillover' = sự lan tỏa (hiệu ứng phụ). Nghĩa kinh tế.",
      "'Harden into' = trở thành (cố định lại). Đừng dịch 'cứng lại' nghĩa đen.",
    ],
    vocabulary_focus: [
      {
        word: "vacancy rate",
        vi_translation: "tỷ lệ trống (bất động sản)",
        ipa: "/ˈveɪ.kən.si reɪt/",
        common_collocations: ["high vacancy rate", "vacancy rate of X%", "rising vacancy"],
      },
      {
        word: "downsize",
        vi_translation: "thu hẹp quy mô",
        ipa: "/ˈdaʊn.saɪz/",
        common_collocations: ["downsize the office", "downsize the workforce", "downsize footprint"],
      },
      {
        word: "equilibrium",
        vi_translation: "trạng thái cân bằng",
        ipa: "/ˌiː.kwɪˈlɪb.ri.əm/",
        common_collocations: ["new equilibrium", "market equilibrium", "reach equilibrium"],
      },
    ],
    estimated_time_minutes: 6,
  },
  {
    id: "toeic_reading_part7_chat_meeting_followup",
    section: "reading",
    part: 7,
    topic: "office_communication",
    level: 605,
    title_vi: "Hội thoại nhóm - theo dõi sau cuộc họp",
    title_en: "Group chat — meeting follow-up",
    passage_or_audio_script:
      "[Group chat: #project-falcon]\n\n" +
      "Mai (10:42): Quick recap of the call — 1) we ship the beta to internal testers Monday, 2) bug bash Tuesday afternoon, 3) external preview Wednesday at 2pm.\n" +
      "Hung (10:43): On 1 — do the testers have access to the staging environment yet?\n" +
      "Mai (10:44): Most yes, three new joiners no. I'll loop in IT to get the missing accounts created today.\n" +
      "Linh (10:46): For the bug bash, can we use the same template as last sprint? It worked well.\n" +
      "Mai (10:47): Yes, I'll duplicate it and share before Tuesday morning.\n" +
      "Hung (10:48): One more — should we send the external preview link via email or just calendar invite?\n" +
      "Linh (10:49): Calendar invite. Last time the email got filtered to spam for two participants.\n" +
      "Mai (10:50): Agreed, calendar invite only. I'll send it tomorrow.",
    questions: [
      {
        question_en: "Why does Mai need to contact IT?",
        options_en: [
          "To reset her own password",
          "To create accounts for three new joiners",
          "To install software on her laptop",
          "To set up a bug-tracking tool",
        ],
        correct_index: 1,
        explanation_vi: "'Three new joiners no. I'll loop in IT to get the missing accounts created today'.",
      },
      {
        question_en: "Why did the team decide against sending the preview link by email?",
        options_en: [
          "Email is too slow",
          "Some emails were marked as spam previously",
          "The team has no shared mailing list",
          "Calendar invites are mandatory by company policy",
        ],
        correct_index: 1,
        explanation_vi: "'Last time the email got filtered to spam for two participants'.",
      },
      {
        question_en: "What does Mai agree to do before Tuesday morning?",
        options_en: [
          "Submit a status report to the CEO",
          "Duplicate the bug-bash template and share it",
          "Cancel the bug bash",
          "Switch the team to a new chat tool",
        ],
        correct_index: 1,
        explanation_vi: "'I'll duplicate it and share before Tuesday morning' — đáp lời 'use the same template'.",
      },
    ],
    typical_traps: [
      "'Loop in' = đưa ai vào cuộc/thông báo cho ai (qua email/chat). Không phải 'vòng lặp'.",
      "'Bug bash' = phiên test gom lỗi tập thể. Thuật ngữ phát triển phần mềm.",
      "'New joiners' = người mới gia nhập. Không phải 'thợ mộc mới' (joiner cũng có nghĩa cũ là thợ mộc).",
    ],
    vocabulary_focus: [
      {
        word: "loop in",
        vi_translation: "thông báo cho, đưa vào cuộc",
        ipa: "/luːp ɪn/",
        common_collocations: ["loop in IT", "loop me in", "loop the team in"],
      },
      {
        word: "staging environment",
        vi_translation: "môi trường thử nghiệm",
        ipa: "/ˈsteɪ.dʒɪŋ ɪnˈvaɪ.rən.mənt/",
        common_collocations: ["deploy to staging", "staging environment access", "staging vs production"],
      },
      {
        word: "calendar invite",
        vi_translation: "lời mời lịch",
        ipa: "/ˈkæl.ən.dɚ ɪnˈvaɪt/",
        common_collocations: ["send a calendar invite", "accept the calendar invite", "decline the invite"],
      },
    ],
    estimated_time_minutes: 4,
  },
  {
    id: "toeic_reading_part7_notice_health_safety",
    section: "reading",
    part: 7,
    topic: "health_safety",
    level: 405,
    title_vi: "Thông báo - quy định an toàn nhà bếp",
    title_en: "Notice — kitchen safety rules",
    passage_or_audio_script:
      "STAFF KITCHEN — Safety rules\n\n" +
      "Please read carefully and observe these rules at all times.\n\n" +
      "1. Do not leave hot oil unattended on the stove.\n" +
      "2. Knives must be returned to the magnetic strip on the wall after use — do not leave them in the sink.\n" +
      "3. The dishwasher must be run only at the end of the day or when fully loaded.\n" +
      "4. Refrigerator: write your name and the date on any food you store. Items without a name will be discarded every Friday.\n" +
      "5. The first-aid kit is mounted next to the fire extinguisher. Report any use to Hoa in the office so supplies can be restocked.\n\n" +
      "Questions? Contact Hoa, ext. 4412.",
    questions: [
      {
        question_en: "What should be done with knives after use?",
        options_en: [
          "Leave them in the sink to soak",
          "Place them on the magnetic strip on the wall",
          "Wrap them in a towel",
          "Lock them in a drawer",
        ],
        correct_index: 1,
        explanation_vi: "'Knives must be returned to the magnetic strip on the wall after use'.",
      },
      {
        question_en: "What happens to refrigerator food without a name?",
        options_en: [
          "It is given to security guards",
          "It is moved to the freezer",
          "It is discarded every Friday",
          "It is photographed and posted online",
        ],
        correct_index: 2,
        explanation_vi: "'Items without a name will be discarded every Friday'.",
      },
      {
        question_en: "Whom should you contact after using the first-aid kit?",
        options_en: ["The fire department", "Hoa in the office", "Your direct manager", "Building security"],
        correct_index: 1,
        explanation_vi: "'Report any use to Hoa in the office so supplies can be restocked'.",
      },
    ],
    typical_traps: [
      "'Unattended' = không có người trông. Phân biệt 'attended' (có người chăm) vs 'attendant' (người trông).",
      "'Discard' = vứt bỏ. Trang trọng hơn 'throw away'.",
      "'Restock' = bổ sung lại. 'Re-' + 'stock' (hàng tồn).",
    ],
    vocabulary_focus: [
      {
        word: "unattended",
        vi_translation: "không có người trông",
        ipa: "/ˌʌn.əˈtɛn.dɪd/",
        common_collocations: ["leave unattended", "unattended baggage", "unattended children"],
      },
      {
        word: "discard",
        vi_translation: "vứt bỏ",
        ipa: "/dɪsˈkɑːrd/",
        common_collocations: ["discard the leftovers", "discard packaging", "items will be discarded"],
      },
      {
        word: "restock",
        vi_translation: "bổ sung hàng",
        ipa: "/ˌriːˈstɑːk/",
        common_collocations: ["restock supplies", "restock the shelves", "restock the kit"],
      },
    ],
    estimated_time_minutes: 3,
  },
];

// ════════════════════════════════════════════════════════════════════
// Public API
// ════════════════════════════════════════════════════════════════════

export const TOEIC_PRACTICE_ITEMS: ReadonlyArray<TOEICPracticeItem> = [
  ...LISTENING,
  ...READING,
];

export const TOEIC_LISTENING_ITEMS = LISTENING;
export const TOEIC_READING_ITEMS = READING;

export function getPracticeItemById(id: string): TOEICPracticeItem | null {
  return TOEIC_PRACTICE_ITEMS.find((item) => item.id === id) ?? null;
}

export function filterPracticeItems(opts: {
  section?: TOEICSectionGroup;
  part?: TOEICPart;
  topic?: TOEICTopic;
  level?: TOEICTargetBand;
}): TOEICPracticeItem[] {
  return TOEIC_PRACTICE_ITEMS.filter((item) => {
    if (opts.section && item.section !== opts.section) return false;
    if (opts.part && item.part !== opts.part) return false;
    if (opts.topic && item.topic !== opts.topic) return false;
    if (opts.level && item.level !== opts.level) return false;
    return true;
  });
}
