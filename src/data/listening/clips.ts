// src/data/listening/clips.ts
//
// Real-world listening library — 30 clips across 7 categories.
//
// Goal: practice the conversations VN diaspora actually have in the
// US/UK/AU/CA — not exam-style dialogue. Each clip is 30–90 seconds
// of authentic spoken English with a bilingual transcript, three
// vocabulary keys, and two comprehension questions.
//
// All transcripts, questions, and vocabulary glosses are **original**
// — written for MercyBlade by a Vietnamese-English bilingual editor
// with the brief: "what would a learner ordering coffee in Seattle
// or returning a package in Manchester actually hear?". No content
// is copied from any commercial source.
//
// Difficulty distribution (per the brief): 8 beginner, 12 intermediate,
// 10 advanced. Accent distribution: 18 US, 6 UK, 3 AU, 3 CA.
//
// audio_url is intentionally absent from this seed — the TTS job
// populates the column in the listening_clips table after generation.
// The UI shows a "Audio đang được chuẩn bị" notice when null.

export type ListeningCategory =
  | "restaurant"
  | "doctor"
  | "customer-service"
  | "job-interview"
  | "casual"
  | "shopping"
  | "transportation";

export type ListeningAccent = "us" | "uk" | "au" | "ca";

export type ListeningDifficulty = "beginner" | "intermediate" | "advanced";

export interface ListeningTranscriptTurn {
  /** Free-form speaker label, e.g. "Customer", "Barista", "Dr. Nguyen". */
  speaker: string;
  text_en: string;
  text_vi: string;
}

export interface ListeningQuestion {
  question_vi: string;
  /** Exactly 3 options, all in Vietnamese for the comprehension layer. */
  options: [string, string, string];
  /** 0-based index into `options`. */
  correct_index: 0 | 1 | 2;
  explanation_vi: string;
}

export interface ListeningClip {
  id: string;
  category: ListeningCategory;
  title_en: string;
  title_vi: string;
  description_vi: string;
  duration_seconds: number;
  accent: ListeningAccent;
  difficulty: ListeningDifficulty;
  /** 2–4 turns of dialogue. */
  transcript: ListeningTranscriptTurn[];
  /** Three lowercase keywords/phrases that must appear in transcript text_en. */
  vocabulary_keys: string[];
  /** Exactly two comprehension questions per the brief. */
  comprehension_questions: [ListeningQuestion, ListeningQuestion];
}

const CLIPS: ListeningClip[] = [];

// ─────────────────────────────────────────────────────────────────────
// CATEGORY: restaurant — 5 clips
// ─────────────────────────────────────────────────────────────────────

CLIPS.push({
  id: "restaurant-order-coffee",
  category: "restaurant",
  title_en: "Ordering coffee at a café",
  title_vi: "Gọi cà phê ở quán",
  description_vi:
    "Khách Việt gọi cà phê tại một quán ở Seattle. Học cách gọi đúng size, hỏi về sữa, và phản hồi câu 'For here or to go?'.",
  duration_seconds: 35,
  accent: "us",
  difficulty: "beginner",
  transcript: [
    {
      speaker: "Barista",
      text_en: "Hi there, what can I get started for you?",
      text_vi: "Chào bạn, bạn dùng gì ạ?",
    },
    {
      speaker: "Customer",
      text_en: "Hi, can I get a medium oat milk latte, please?",
      text_vi: "Chào, cho tôi một ly latte size vừa, dùng sữa yến mạch nhé.",
    },
    {
      speaker: "Barista",
      text_en: "Sure thing. For here or to go?",
      text_vi: "Vâng. Bạn uống tại chỗ hay mang đi?",
    },
    {
      speaker: "Customer",
      text_en: "To go, please. And can I get an extra shot?",
      text_vi: "Mang đi nhé. Cho tôi thêm một shot espresso luôn.",
    },
  ],
  vocabulary_keys: ["medium", "oat milk", "to go"],
  comprehension_questions: [
    {
      question_vi: "Khách gọi loại sữa nào?",
      options: ["Sữa bò", "Sữa yến mạch", "Sữa đậu nành"],
      correct_index: 1,
      explanation_vi:
        "Khách nói 'oat milk latte' — yến mạch (oat) là loại sữa thực vật phổ biến ở Mỹ.",
    },
    {
      question_vi: "Khách uống tại quán hay mang đi?",
      options: ["Tại quán", "Mang đi", "Không nói rõ"],
      correct_index: 1,
      explanation_vi:
        "Khách trả lời 'To go, please' — mang đi. 'For here' nghĩa là tại quán.",
    },
  ],
});

CLIPS.push({
  id: "restaurant-complain-about-food",
  category: "restaurant",
  title_en: "Sending a dish back",
  title_vi: "Phàn nàn về món ăn",
  description_vi:
    "Khách lịch sự yêu cầu đổi món vì thịt bò chưa chín tới mức yêu cầu. Học cách phàn nàn không gay gắt và nhận lời xin lỗi.",
  duration_seconds: 60,
  accent: "us",
  difficulty: "intermediate",
  transcript: [
    {
      speaker: "Server",
      text_en: "How is everything tasting tonight?",
      text_vi: "Mọi thứ ổn không ạ, anh chị?",
    },
    {
      speaker: "Customer",
      text_en:
        "Actually, I asked for medium-rare but this steak is well-done. Could I get a new one?",
      text_vi:
        "Thực ra tôi yêu cầu medium-rare nhưng miếng steak này chín kỹ quá rồi. Cho tôi đổi miếng khác được không?",
    },
    {
      speaker: "Server",
      text_en:
        "Oh, I'm so sorry about that. Let me grab the manager and we'll fire a new one right away. It'll be on the house.",
      text_vi:
        "Ôi, tôi xin lỗi anh. Để tôi gọi quản lý ra và chúng tôi sẽ làm lại ngay lập tức. Miếng này nhà hàng mời.",
    },
    {
      speaker: "Customer",
      text_en: "Thanks, I appreciate that.",
      text_vi: "Cảm ơn, tôi cảm kích lắm.",
    },
  ],
  vocabulary_keys: ["medium-rare", "fire a new one", "on the house"],
  comprehension_questions: [
    {
      question_vi: "Vấn đề với miếng steak là gì?",
      options: [
        "Quá chín so với yêu cầu",
        "Quá lạnh",
        "Quá mặn",
      ],
      correct_index: 0,
      explanation_vi:
        "Khách yêu cầu medium-rare (tái) nhưng nhận miếng well-done (chín kỹ).",
    },
    {
      question_vi: "Nhà hàng xử lý thế nào?",
      options: [
        "Tính phí cả hai miếng",
        "Làm lại miếng mới và miễn phí miếng đó",
        "Chỉ xin lỗi mà không đổi",
      ],
      correct_index: 1,
      explanation_vi:
        "'On the house' nghĩa là nhà hàng mời — không tính tiền. Họ cũng làm miếng mới.",
    },
  ],
});

CLIPS.push({
  id: "restaurant-ask-for-check",
  category: "restaurant",
  title_en: "Asking for the check",
  title_vi: "Xin tính tiền",
  description_vi:
    "Cuối bữa ăn, khách xin hóa đơn và hỏi cách chia bill cho hai thẻ. Học từ vựng 'check', 'split', 'separate cards'.",
  duration_seconds: 30,
  accent: "us",
  difficulty: "beginner",
  transcript: [
    {
      speaker: "Customer",
      text_en: "Excuse me, could we get the check, please?",
      text_vi: "Xin lỗi, cho tôi xin hóa đơn nhé?",
    },
    {
      speaker: "Server",
      text_en: "Of course. Will that be one check or two?",
      text_vi: "Vâng. Anh chị tính chung một hóa đơn hay tách ra?",
    },
    {
      speaker: "Customer",
      text_en: "Two, please. And we'll be paying with separate cards.",
      text_vi: "Tách ra nhé. Và mỗi người dùng một thẻ riêng.",
    },
  ],
  vocabulary_keys: ["check", "split", "separate cards"],
  comprehension_questions: [
    {
      question_vi: "Khách yêu cầu chia hóa đơn thế nào?",
      options: ["Một hóa đơn chung", "Hai hóa đơn riêng", "Trả tiền mặt"],
      correct_index: 1,
      explanation_vi:
        "Khách trả lời 'Two, please' — tách thành hai hóa đơn riêng.",
    },
    {
      question_vi: "Khách trả bằng phương thức nào?",
      options: [
        "Hai thẻ riêng",
        "Một thẻ chung",
        "Tiền mặt",
      ],
      correct_index: 0,
      explanation_vi:
        "'Separate cards' — mỗi người dùng một thẻ riêng để thanh toán.",
    },
  ],
});

CLIPS.push({
  id: "restaurant-make-reservation",
  category: "restaurant",
  title_en: "Booking a table by phone",
  title_vi: "Đặt bàn qua điện thoại",
  description_vi:
    "Khách gọi điện đặt bàn cho 4 người tối thứ Bảy. Giọng Anh-Anh, học cách dùng 'fancy', 'window seat', 'absolutely'.",
  duration_seconds: 50,
  accent: "uk",
  difficulty: "intermediate",
  transcript: [
    {
      speaker: "Host",
      text_en:
        "Good afternoon, The Olive Branch, how may I help you?",
      text_vi:
        "Chào buổi chiều, nhà hàng The Olive Branch nghe ạ?",
    },
    {
      speaker: "Customer",
      text_en:
        "Hi, I'd like to book a table for four for Saturday at seven, if possible.",
      text_vi:
        "Chào, tôi muốn đặt một bàn cho 4 người vào tối thứ Bảy lúc 7 giờ, nếu được.",
    },
    {
      speaker: "Host",
      text_en:
        "Saturday at seven, table for four — let me have a look. Yes, we have one window seat available. Would that work?",
      text_vi:
        "Thứ Bảy 7 giờ, bàn 4 người — để tôi kiểm tra nhé. Vâng, chúng tôi còn một bàn cạnh cửa sổ. Bàn đó được không?",
    },
    {
      speaker: "Customer",
      text_en:
        "Absolutely, that sounds lovely. The name is Tran, T-R-A-N.",
      text_vi:
        "Tuyệt vời ạ. Tên tôi là Trần, đánh vần T-R-A-N.",
    },
  ],
  vocabulary_keys: ["book a table", "window seat", "absolutely"],
  comprehension_questions: [
    {
      question_vi: "Khách đặt bàn cho mấy người?",
      options: ["2 người", "4 người", "7 người"],
      correct_index: 1,
      explanation_vi:
        "'Table for four' — bàn cho 4 người. '7' là giờ, không phải số người.",
    },
    {
      question_vi: "Loại bàn nào còn trống?",
      options: [
        "Bàn cạnh cửa sổ",
        "Bàn ngoài hiên",
        "Phòng riêng",
      ],
      correct_index: 0,
      explanation_vi:
        "Host đề xuất 'window seat' — bàn cạnh cửa sổ.",
    },
  ],
});

CLIPS.push({
  id: "restaurant-allergies-disclosure",
  category: "restaurant",
  title_en: "Disclosing a peanut allergy",
  title_vi: "Báo dị ứng đậu phộng",
  description_vi:
    "Khách báo bị dị ứng nặng với đậu phộng. Server giải thích quy trình xử lý ở bếp và hỏi về EpiPen. Tình huống nghiêm trọng, từ vựng y tế cao cấp.",
  duration_seconds: 70,
  accent: "us",
  difficulty: "advanced",
  transcript: [
    {
      speaker: "Customer",
      text_en:
        "Before we order, I want to mention that I have a severe peanut allergy. Anaphylactic.",
      text_vi:
        "Trước khi gọi, tôi muốn báo là tôi bị dị ứng đậu phộng rất nặng — có thể sốc phản vệ.",
    },
    {
      speaker: "Server",
      text_en:
        "Thank you for letting me know. We take that very seriously. I'll flag your ticket for the kitchen, and they'll prep your dishes on a separate station.",
      text_vi:
        "Cảm ơn anh đã báo. Chúng tôi rất nghiêm túc với việc này. Tôi sẽ đánh dấu phiếu order, và bếp sẽ chuẩn bị món ở khu riêng.",
    },
    {
      speaker: "Customer",
      text_en:
        "Could you also confirm that the desserts don't have any peanut traces? I have my EpiPen with me, but I'd rather not need it.",
      text_vi:
        "Anh xác nhận giúp món tráng miệng không dính chút đậu phộng nào nhé? Tôi có mang EpiPen, nhưng tôi không muốn phải dùng đến.",
    },
    {
      speaker: "Server",
      text_en:
        "Of course. I'll get the chef to walk through the dessert menu with you personally.",
      text_vi:
        "Vâng. Tôi sẽ nhờ bếp trưởng ra trao đổi trực tiếp với anh về menu tráng miệng.",
    },
  ],
  vocabulary_keys: ["severe", "anaphylactic", "EpiPen"],
  comprehension_questions: [
    {
      question_vi: "Mức độ dị ứng của khách là gì?",
      options: [
        "Nhẹ, chỉ ngứa",
        "Có thể gây sốc phản vệ",
        "Khách không chắc",
      ],
      correct_index: 1,
      explanation_vi:
        "'Anaphylactic' nghĩa là sốc phản vệ — phản ứng dị ứng nguy hiểm tính mạng. Khách cũng dùng từ 'severe' (nặng).",
    },
    {
      question_vi: "Bếp xử lý thế nào để tránh nhiễm chéo?",
      options: [
        "Bỏ đi tất cả món có đậu phộng",
        "Chuẩn bị món tại khu riêng và đánh dấu phiếu",
        "Chỉ phục vụ món tráng miệng",
      ],
      correct_index: 1,
      explanation_vi:
        "Server nói 'separate station' (khu riêng) và 'flag your ticket' (đánh dấu phiếu) — quy trình chuẩn để tránh nhiễm chéo (cross-contamination).",
    },
  ],
});

// ─────────────────────────────────────────────────────────────────────
// CATEGORY: doctor — 4 clips
// ─────────────────────────────────────────────────────────────────────

CLIPS.push({
  id: "doctor-schedule-appointment",
  category: "doctor",
  title_en: "Calling to schedule a check-up",
  title_vi: "Đặt lịch khám tổng quát",
  description_vi:
    "Bệnh nhân gọi phòng khám đặt lịch khám tổng quát. Học cách đọc ngày, hỏi 'first available', xác nhận bảo hiểm.",
  duration_seconds: 45,
  accent: "us",
  difficulty: "beginner",
  transcript: [
    {
      speaker: "Receptionist",
      text_en: "Westside Clinic, this is Maria. How can I help you?",
      text_vi: "Phòng khám Westside, tôi là Maria. Tôi có thể giúp gì ạ?",
    },
    {
      speaker: "Patient",
      text_en:
        "Hi, I'd like to schedule an annual physical with Dr. Patel.",
      text_vi:
        "Chào, tôi muốn đặt lịch khám tổng quát hàng năm với bác sĩ Patel.",
    },
    {
      speaker: "Receptionist",
      text_en:
        "Sure. The first available is next Thursday at 9:30 AM. Does that work?",
      text_vi:
        "Vâng. Lịch sớm nhất là thứ Năm tuần sau lúc 9 giờ 30 sáng. Anh chị thấy ổn không?",
    },
    {
      speaker: "Patient",
      text_en:
        "That works. And do you still take Blue Cross insurance?",
      text_vi:
        "Được ạ. Phòng khám vẫn nhận bảo hiểm Blue Cross không?",
    },
  ],
  vocabulary_keys: ["annual physical", "first available", "insurance"],
  comprehension_questions: [
    {
      question_vi: "Bệnh nhân muốn đặt loại khám gì?",
      options: [
        "Khám cấp cứu",
        "Khám tổng quát hàng năm",
        "Khám răng",
      ],
      correct_index: 1,
      explanation_vi:
        "'Annual physical' nghĩa là khám tổng quát hàng năm — kiểm tra sức khỏe định kỳ.",
    },
    {
      question_vi: "Lịch hẹn được đặt vào khi nào?",
      options: [
        "Hôm nay 9 giờ sáng",
        "Thứ Năm tuần sau, 9:30 sáng",
        "Thứ Sáu tuần này",
      ],
      correct_index: 1,
      explanation_vi:
        "Lễ tân nói 'next Thursday at 9:30 AM' — thứ Năm tuần sau, 9:30 sáng.",
    },
  ],
});

CLIPS.push({
  id: "doctor-describe-symptoms",
  category: "doctor",
  title_en: "Describing flu-like symptoms",
  title_vi: "Mô tả triệu chứng cúm",
  description_vi:
    "Bệnh nhân kể bác sĩ về sốt, đau đầu, ho khan kéo dài 3 ngày. Giọng Anh-Anh. Học cách nói 'bring on', 'shake it off', 'GP'.",
  duration_seconds: 65,
  accent: "uk",
  difficulty: "intermediate",
  transcript: [
    {
      speaker: "GP",
      text_en: "So what brings you in today?",
      text_vi: "Hôm nay anh chị đến vì lý do gì ạ?",
    },
    {
      speaker: "Patient",
      text_en:
        "I've had a fever and a really bad headache for three days now. And a dry cough that just won't shake off.",
      text_vi:
        "Tôi sốt và đau đầu nặng đã ba ngày rồi. Còn ho khan mãi không khỏi nữa.",
    },
    {
      speaker: "GP",
      text_en:
        "Right. Any aches in your muscles or joints? And how high has the fever gone?",
      text_vi:
        "Vâng. Có đau cơ hay đau khớp không? Sốt cao nhất bao nhiêu độ?",
    },
    {
      speaker: "Patient",
      text_en:
        "Body aches, yes. The fever peaked at 39 degrees last night. I've been taking paracetamol but it's not really cutting it.",
      text_vi:
        "Có đau mỏi cơ thể. Sốt cao nhất đêm qua là 39 độ. Tôi có uống paracetamol nhưng không hiệu quả mấy.",
    },
  ],
  vocabulary_keys: ["dry cough", "shake off", "cutting it"],
  comprehension_questions: [
    {
      question_vi: "Bệnh nhân bị triệu chứng từ bao lâu?",
      options: ["Một ngày", "Ba ngày", "Một tuần"],
      correct_index: 1,
      explanation_vi:
        "'For three days now' — đã ba ngày.",
    },
    {
      question_vi: "Sốt cao nhất bao nhiêu?",
      options: ["38 độ", "39 độ", "40 độ"],
      correct_index: 1,
      explanation_vi:
        "'Peaked at 39 degrees' — đỉnh sốt là 39 độ. 'Peak' (đỉnh) là từ phổ biến trong y khoa.",
    },
  ],
});

CLIPS.push({
  id: "doctor-refill-prescription",
  category: "doctor",
  title_en: "Refilling a prescription",
  title_vi: "Lấy lại đơn thuốc",
  description_vi:
    "Bệnh nhân gọi xin lấy thêm đơn thuốc huyết áp. Lễ tân hỏi tên thuốc, liều, và pharmacy ở đâu. Học 'refill', 'pharmacy', 'on file'.",
  duration_seconds: 50,
  accent: "us",
  difficulty: "intermediate",
  transcript: [
    {
      speaker: "Patient",
      text_en:
        "Hi, I need a refill on my lisinopril. I'm running out.",
      text_vi:
        "Chào, tôi cần xin lại đơn lisinopril. Sắp hết thuốc rồi.",
    },
    {
      speaker: "Receptionist",
      text_en:
        "Sure. Can you confirm your date of birth and the pharmacy you'd like it sent to?",
      text_vi:
        "Vâng. Anh chị xác nhận giúp ngày sinh và muốn gửi đơn đến nhà thuốc nào?",
    },
    {
      speaker: "Patient",
      text_en:
        "March 8th, 1985. And the CVS on Roosevelt — same as last time.",
      text_vi:
        "Ngày 8 tháng 3 năm 1985. Và nhà thuốc CVS trên đường Roosevelt — như lần trước.",
    },
    {
      speaker: "Receptionist",
      text_en:
        "Got it. We have that pharmacy on file. The doctor needs to approve, and you should get a notification within 24 hours.",
      text_vi:
        "Được ạ. Phòng khám đã lưu nhà thuốc đó. Bác sĩ duyệt đơn xong, anh chị sẽ nhận thông báo trong 24 giờ.",
    },
  ],
  vocabulary_keys: ["refill", "running out", "on file"],
  comprehension_questions: [
    {
      question_vi: "Bệnh nhân xin loại thuốc gì?",
      options: ["Thuốc kháng sinh", "Thuốc huyết áp lisinopril", "Thuốc giảm đau"],
      correct_index: 1,
      explanation_vi:
        "Lisinopril là thuốc điều trị huyết áp cao, một trong những thuốc kê đơn phổ biến nhất ở Mỹ.",
    },
    {
      question_vi: "Bệnh nhân sẽ nhận đơn ở đâu?",
      options: [
        "Phòng khám",
        "CVS trên đường Roosevelt",
        "Walgreens trung tâm",
      ],
      correct_index: 1,
      explanation_vi:
        "'CVS on Roosevelt — same as last time' — nhà thuốc CVS trên đường Roosevelt, đã lưu trong hồ sơ ('on file').",
    },
  ],
});

CLIPS.push({
  id: "doctor-emergency-room-intake",
  category: "doctor",
  title_en: "ER intake after a fall",
  title_vi: "Nhập viện cấp cứu sau khi ngã",
  description_vi:
    "Bệnh nhân đến phòng cấp cứu sau cú ngã từ thang. Y tá hỏi về cơn đau, vị trí, có mất ý thức không. Giọng Úc, từ vựng y tế nâng cao.",
  duration_seconds: 80,
  accent: "au",
  difficulty: "advanced",
  transcript: [
    {
      speaker: "Triage Nurse",
      text_en:
        "G'day. What brings you in tonight?",
      text_vi:
        "Chào anh chị. Hôm nay đến vì việc gì ạ?",
    },
    {
      speaker: "Patient",
      text_en:
        "I fell off a ladder about an hour ago. My right wrist is killing me, and my head's a bit fuzzy.",
      text_vi:
        "Tôi ngã từ thang khoảng một tiếng trước. Cổ tay phải đau dữ lắm, và đầu hơi lâng lâng.",
    },
    {
      speaker: "Triage Nurse",
      text_en:
        "Right. Did you lose consciousness at any point, even briefly?",
      text_vi:
        "Vâng. Anh có mất ý thức lúc nào không, dù chỉ trong giây lát?",
    },
    {
      speaker: "Patient",
      text_en:
        "I think so — maybe ten seconds. My wife said I was out for a moment before I sat up.",
      text_vi:
        "Hình như có — chắc khoảng 10 giây. Vợ tôi nói tôi bất tỉnh một lúc trước khi ngồi dậy.",
    },
    {
      speaker: "Triage Nurse",
      text_en:
        "Okay, that's important. Pain on a scale of one to ten?",
      text_vi:
        "Vâng, điểm này quan trọng. Cơn đau anh đánh giá mấy điểm trên thang 10?",
    },
    {
      speaker: "Patient",
      text_en:
        "The wrist is a solid eight. Headache about a five, but it's getting worse.",
      text_vi:
        "Cổ tay khoảng 8 điểm. Đầu đau khoảng 5, nhưng đang nặng dần.",
    },
  ],
  vocabulary_keys: ["killing me", "lose consciousness", "scale of one to ten"],
  comprehension_questions: [
    {
      question_vi: "Bệnh nhân bị ngã từ đâu?",
      options: ["Cầu thang", "Thang", "Xe đạp"],
      correct_index: 1,
      explanation_vi:
        "'I fell off a ladder' — ngã từ thang (ladder). 'Cầu thang' là 'staircase'.",
    },
    {
      question_vi: "Có mất ý thức không?",
      options: [
        "Không hề",
        "Có, khoảng 10 giây",
        "Có, hơn 1 phút",
      ],
      correct_index: 1,
      explanation_vi:
        "Bệnh nhân nói 'maybe ten seconds' và 'I was out for a moment'. Mất ý thức dù ngắn cũng quan trọng — y tá ghi nhận để theo dõi chấn thương đầu.",
    },
  ],
});
