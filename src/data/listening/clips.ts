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

// ─────────────────────────────────────────────────────────────────────
// CATEGORY: customer-service — 5 clips
// ─────────────────────────────────────────────────────────────────────

CLIPS.push({
  id: "cs-cancel-subscription",
  category: "customer-service",
  title_en: "Canceling a streaming subscription",
  title_vi: "Hủy đăng ký dịch vụ streaming",
  description_vi:
    "Khách gọi hủy gói streaming. Nhân viên cố giữ chân bằng ưu đãi. Học cách lịch sự nhưng kiên quyết: 'I'd rather just cancel'.",
  duration_seconds: 70,
  accent: "us",
  difficulty: "intermediate",
  transcript: [
    {
      speaker: "Agent",
      text_en:
        "Thanks for calling. I see you'd like to cancel your subscription. May I ask why?",
      text_vi:
        "Cảm ơn anh chị đã gọi. Tôi thấy anh chị muốn hủy gói đăng ký. Tôi có thể hỏi lý do không ạ?",
    },
    {
      speaker: "Customer",
      text_en:
        "I'm just not using it enough to justify the cost.",
      text_vi:
        "Tôi không xem đủ nhiều để xứng với cái giá.",
    },
    {
      speaker: "Agent",
      text_en:
        "I understand. We have a special — three months at half price if you stay. Would that interest you?",
      text_vi:
        "Tôi hiểu. Hiện chúng tôi có ưu đãi — 3 tháng giá nửa nếu anh chị giữ gói. Anh chị có quan tâm không?",
    },
    {
      speaker: "Customer",
      text_en:
        "I appreciate it, but I'd rather just cancel. Could you confirm the date my service ends?",
      text_vi:
        "Cảm ơn nhưng tôi vẫn muốn hủy. Anh xác nhận giúp ngày dịch vụ kết thúc ạ?",
    },
  ],
  vocabulary_keys: ["justify the cost", "stay", "I'd rather"],
  comprehension_questions: [
    {
      question_vi: "Lý do khách hủy là gì?",
      options: [
        "Chất lượng kém",
        "Không xem đủ để bù chi phí",
        "Chuyển sang đối thủ",
      ],
      correct_index: 1,
      explanation_vi:
        "'I'm just not using it enough to justify the cost' — không xem đủ để xứng với chi phí.",
    },
    {
      question_vi: "Khách phản ứng với ưu đãi giữ chân thế nào?",
      options: [
        "Đồng ý ngay",
        "Lịch sự từ chối, vẫn muốn hủy",
        "Yêu cầu giảm giá thêm",
      ],
      correct_index: 1,
      explanation_vi:
        "'I appreciate it, but I'd rather just cancel' — câu chuẩn để từ chối lịch sự nhưng kiên quyết.",
    },
  ],
});

CLIPS.push({
  id: "cs-return-item",
  category: "customer-service",
  title_en: "Returning an online order",
  title_vi: "Trả lại đơn hàng online",
  description_vi:
    "Khách trả áo size sai. Học từ vựng 'return label', 'refund', 'within 30 days'.",
  duration_seconds: 50,
  accent: "us",
  difficulty: "beginner",
  transcript: [
    {
      speaker: "Customer",
      text_en:
        "Hi, I'd like to return a sweater. The size is wrong.",
      text_vi:
        "Chào, tôi muốn trả một cái áo len. Bị sai size.",
    },
    {
      speaker: "Agent",
      text_en:
        "No problem. Do you have your order number?",
      text_vi:
        "Không sao ạ. Anh chị có mã đơn hàng không?",
    },
    {
      speaker: "Customer",
      text_en:
        "Yes — it's 8-8-2-1-7-5-9.",
      text_vi:
        "Có ạ — 8-8-2-1-7-5-9.",
    },
    {
      speaker: "Agent",
      text_en:
        "Found it. I'll email you a return label. Once we receive the package, you'll get a refund within five business days.",
      text_vi:
        "Đã tìm thấy. Tôi sẽ gửi email phiếu trả hàng. Khi chúng tôi nhận được gói, anh chị sẽ được hoàn tiền trong 5 ngày làm việc.",
    },
  ],
  vocabulary_keys: ["return label", "refund", "business days"],
  comprehension_questions: [
    {
      question_vi: "Khách trả hàng vì sao?",
      options: ["Hỏng", "Sai size", "Không thích màu"],
      correct_index: 1,
      explanation_vi:
        "'The size is wrong' — sai size.",
    },
    {
      question_vi: "Khách nhận lại tiền bao lâu?",
      options: ["Ngay lập tức", "5 ngày làm việc", "30 ngày"],
      correct_index: 1,
      explanation_vi:
        "'Within five business days' — trong 5 ngày làm việc, kể từ khi shop nhận được gói.",
    },
  ],
});

CLIPS.push({
  id: "cs-billing-dispute",
  category: "customer-service",
  title_en: "Disputing a charge on a credit card",
  title_vi: "Tranh chấp phí trên thẻ tín dụng",
  description_vi:
    "Khách phát hiện 1 khoản phí lạ trên sao kê và gọi ngân hàng tranh chấp. Học 'unauthorized', 'dispute', 'provisional credit'. Nâng cao.",
  duration_seconds: 85,
  accent: "us",
  difficulty: "advanced",
  transcript: [
    {
      speaker: "Customer",
      text_en:
        "I'm calling to dispute a charge on my statement. There's a $340 charge from a merchant I don't recognize.",
      text_vi:
        "Tôi gọi để tranh chấp một khoản phí trên sao kê. Có một khoản 340 đô từ một bên tôi không nhận ra.",
    },
    {
      speaker: "Agent",
      text_en:
        "I'm sorry to hear that. Let me pull up the transaction. Can you confirm the date and the merchant name on the statement?",
      text_vi:
        "Tôi rất tiếc khi nghe điều đó. Để tôi tra giao dịch. Anh chị xác nhận giúp ngày và tên đơn vị bán trên sao kê?",
    },
    {
      speaker: "Customer",
      text_en:
        "March 14th. The merchant shows up as 'GLOBAL-FX-TX9921'. I've never used that name. I'm pretty sure it's unauthorized.",
      text_vi:
        "Ngày 14 tháng 3. Tên đơn vị là 'GLOBAL-FX-TX9921'. Tôi chưa bao giờ dùng cái đó. Khá chắc là giao dịch trái phép.",
    },
    {
      speaker: "Agent",
      text_en:
        "Understood. I'm opening a dispute now. We'll issue a provisional credit within 48 hours and investigate. The investigation can take up to ten business days.",
      text_vi:
        "Vâng. Tôi mở tranh chấp ngay. Chúng tôi sẽ tạm hoàn tiền trong 48 giờ và điều tra. Quá trình điều tra có thể mất tới 10 ngày làm việc.",
    },
  ],
  vocabulary_keys: ["dispute", "unauthorized", "provisional credit"],
  comprehension_questions: [
    {
      question_vi: "Khoản phí gây tranh chấp bao nhiêu?",
      options: ["$34", "$340", "$3,400"],
      correct_index: 1,
      explanation_vi:
        "'$340 charge' — 340 đô.",
    },
    {
      question_vi: "Ngân hàng xử lý ra sao trước khi điều tra xong?",
      options: [
        "Yêu cầu khách trả ngay",
        "Tạm hoàn tiền (provisional credit) trong 48 giờ",
        "Khóa thẻ ngay lập tức",
      ],
      correct_index: 1,
      explanation_vi:
        "'Provisional credit' — tiền tạm thời được hoàn vào tài khoản trong khi điều tra. Nếu kết quả tranh chấp thua, ngân hàng sẽ thu lại.",
    },
  ],
});

CLIPS.push({
  id: "cs-internet-outage",
  category: "customer-service",
  title_en: "Reporting an internet outage",
  title_vi: "Báo mất mạng internet",
  description_vi:
    "Khách báo mất mạng cả khu phố. Tổng đài Anh-Anh xác nhận sự cố mạng và ETA. Học 'unplug', 'outage map', 'engineer'.",
  duration_seconds: 60,
  accent: "uk",
  difficulty: "intermediate",
  transcript: [
    {
      speaker: "Agent",
      text_en:
        "Hi, you've reached BT Broadband. How can I help?",
      text_vi:
        "Chào, đây là BT Broadband. Tôi giúp gì được ạ?",
    },
    {
      speaker: "Customer",
      text_en:
        "My internet's been down for two hours. I've tried unplugging the router but no joy.",
      text_vi:
        "Mạng nhà tôi mất hai tiếng rồi. Tôi đã thử rút router ra cắm lại nhưng vẫn không được.",
    },
    {
      speaker: "Agent",
      text_en:
        "Let me check the outage map. Yes, there's a confirmed outage in your area. An engineer is on site, and we expect service back within ninety minutes.",
      text_vi:
        "Để tôi kiểm tra bản đồ sự cố. Vâng, có sự cố mạng đã xác nhận ở khu vực anh chị. Kỹ thuật viên đang có mặt, dự kiến mạng sẽ trở lại trong 90 phút.",
    },
    {
      speaker: "Customer",
      text_en:
        "Brilliant, thanks. Will I get any compensation for the downtime?",
      text_vi:
        "Tuyệt, cảm ơn. Tôi có được bồi thường cho thời gian mất mạng không?",
    },
  ],
  vocabulary_keys: ["outage", "unplugging", "engineer"],
  comprehension_questions: [
    {
      question_vi: "Khách đã thử cách gì trước khi gọi?",
      options: [
        "Đổi mật khẩu wifi",
        "Rút router cắm lại",
        "Thay nhà mạng",
      ],
      correct_index: 1,
      explanation_vi:
        "'Unplugging the router' — rút router cắm lại, bước xử lý cơ bản.",
    },
    {
      question_vi: "Dự kiến bao lâu nữa có mạng?",
      options: ["30 phút", "90 phút", "2 ngày"],
      correct_index: 1,
      explanation_vi:
        "'Within ninety minutes' — trong 90 phút.",
    },
  ],
});

CLIPS.push({
  id: "cs-lost-package",
  category: "customer-service",
  title_en: "Tracking a lost package",
  title_vi: "Tìm gói hàng bị thất lạc",
  description_vi:
    "Khách báo gói hàng đã được giao nhưng không có ở cửa. Nhân viên gợi ý kiểm tra hàng xóm và mở claim. Tình huống thực tế phổ biến.",
  duration_seconds: 65,
  accent: "us",
  difficulty: "advanced",
  transcript: [
    {
      speaker: "Agent",
      text_en:
        "Thanks for calling FedEx. I see your tracking shows delivered yesterday at 3 PM, signature required.",
      text_vi:
        "Cảm ơn đã gọi FedEx. Tôi thấy tracking báo đã giao hôm qua 3 giờ chiều, yêu cầu ký nhận.",
    },
    {
      speaker: "Customer",
      text_en:
        "Right, but no one was home and there's nothing on the porch. Plus I never signed for it.",
      text_vi:
        "Vâng nhưng cả nhà không ai có nhà và không thấy gói nào ngoài cửa. Hơn nữa tôi chưa hề ký nhận.",
    },
    {
      speaker: "Agent",
      text_en:
        "That's concerning. Sometimes drivers leave packages with neighbors or behind a planter. Have you checked with the people next door?",
      text_vi:
        "Việc này đáng lo. Đôi khi tài xế gửi gói cho hàng xóm hoặc giấu sau chậu cây. Anh chị đã hỏi nhà bên cạnh chưa?",
    },
    {
      speaker: "Customer",
      text_en:
        "I asked both neighbors. Nothing.",
      text_vi:
        "Tôi đã hỏi cả hai nhà hàng xóm. Không có.",
    },
    {
      speaker: "Agent",
      text_en:
        "In that case, I'm filing a missing package claim now. The investigation takes 5–7 business days, and you'll get a refund or replacement once we close it.",
      text_vi:
        "Vậy tôi mở claim mất gói luôn. Điều tra mất 5–7 ngày làm việc, sau đó anh chị sẽ được hoàn tiền hoặc gửi lại hàng.",
    },
  ],
  vocabulary_keys: ["porch", "behind a planter", "claim"],
  comprehension_questions: [
    {
      question_vi: "Vấn đề chính là gì?",
      options: [
        "Gói hàng đến muộn",
        "Tracking báo đã giao nhưng khách không nhận, không ký",
        "Gói vỡ",
      ],
      correct_index: 1,
      explanation_vi:
        "Tracking báo 'delivered' và 'signature required' nhưng khách 'never signed' và không thấy gói — dấu hiệu của giao thiếu hoặc sai địa chỉ.",
    },
    {
      question_vi: "Bước tiếp theo của FedEx là gì?",
      options: [
        "Yêu cầu khách chờ thêm",
        "Mở claim, điều tra 5-7 ngày, hoàn tiền hoặc gửi lại",
        "Khóa tài khoản",
      ],
      correct_index: 1,
      explanation_vi:
        "'Filing a missing package claim' — mở claim. 'Refund or replacement' — hoàn tiền hoặc gửi lại.",
    },
  ],
});

// ─────────────────────────────────────────────────────────────────────
// CATEGORY: job-interview — 4 clips
// ─────────────────────────────────────────────────────────────────────

CLIPS.push({
  id: "interview-tech",
  category: "job-interview",
  title_en: "Tech interview — culture-fit round",
  title_vi: "Phỏng vấn IT — vòng văn hóa công ty",
  description_vi:
    "Phỏng vấn vòng cuối cho vị trí kỹ sư phần mềm. Câu hỏi 'tell me about a conflict' — câu kinh điển. Học cách trả lời theo STAR.",
  duration_seconds: 90,
  accent: "us",
  difficulty: "advanced",
  transcript: [
    {
      speaker: "Interviewer",
      text_en:
        "Tell me about a time you had a disagreement with a teammate. How did you handle it?",
      text_vi:
        "Kể tôi nghe về một lần bạn bất đồng với đồng nghiệp. Bạn xử lý ra sao?",
    },
    {
      speaker: "Candidate",
      text_en:
        "Sure. On my last project, my colleague and I disagreed on whether to refactor a legacy module before adding new features. I wanted to refactor first; she wanted to ship features fast and refactor later.",
      text_vi:
        "Vâng. Ở dự án trước, tôi và đồng nghiệp bất đồng về việc có nên tái cấu trúc module cũ trước khi thêm chức năng mới hay không. Tôi muốn tái cấu trúc trước; cô ấy muốn ship chức năng nhanh, tái cấu trúc sau.",
    },
    {
      speaker: "Interviewer",
      text_en: "And what did you do?",
      text_vi: "Và bạn đã làm gì?",
    },
    {
      speaker: "Candidate",
      text_en:
        "We sat down and looked at the data. The legacy module had three open bugs that would block the new features. So I made the case that the refactor would actually save us a week of debugging. She agreed, and we shipped on time.",
      text_vi:
        "Chúng tôi ngồi lại và xem dữ liệu. Module cũ có 3 bug đang mở sẽ chặn việc thêm chức năng mới. Tôi đưa lý lẽ rằng tái cấu trúc sẽ tiết kiệm cả tuần debug. Cô ấy đồng ý, và chúng tôi giao đúng hạn.",
    },
  ],
  vocabulary_keys: ["disagreement", "make the case", "shipped on time"],
  comprehension_questions: [
    {
      question_vi: "Bất đồng giữa hai đồng nghiệp về điều gì?",
      options: [
        "Lương thưởng",
        "Tái cấu trúc trước hay ship chức năng trước",
        "Lựa chọn ngôn ngữ lập trình",
      ],
      correct_index: 1,
      explanation_vi:
        "Ứng viên kể bất đồng cụ thể: refactor first vs ship features first.",
    },
    {
      question_vi: "Cách họ giải quyết là gì?",
      options: [
        "Đưa cho sếp quyết định",
        "Cùng xem dữ liệu, ứng viên thuyết phục bằng số bug đang mở",
        "Bỏ phiếu cả team",
      ],
      correct_index: 1,
      explanation_vi:
        "'Looked at the data' và 'three open bugs that would block the new features' — dữ liệu cụ thể, không cảm tính. Đó là cách trả lời câu hỏi conflict được đánh giá cao trong tech interview.",
    },
  ],
});

CLIPS.push({
  id: "interview-healthcare",
  category: "job-interview",
  title_en: "Nursing interview — patient safety",
  title_vi: "Phỏng vấn điều dưỡng — an toàn bệnh nhân",
  description_vi:
    "Ứng viên y tá kể về lần can thiệp khi thấy đồng nghiệp sắp cho liều thuốc sai. Giọng Canada. Tình huống cao cấp.",
  duration_seconds: 85,
  accent: "ca",
  difficulty: "advanced",
  transcript: [
    {
      speaker: "Interviewer",
      text_en:
        "Walk me through a moment you had to speak up about patient safety.",
      text_vi:
        "Hãy kể tôi nghe lần bạn phải lên tiếng về an toàn bệnh nhân.",
    },
    {
      speaker: "Candidate",
      text_en:
        "About a year ago, I noticed a colleague was about to administer a medication that conflicted with one already on the patient's chart. I flagged it before she gave the dose.",
      text_vi:
        "Khoảng một năm trước, tôi để ý đồng nghiệp sắp cho một loại thuốc chống chỉ định với thuốc đã có trong hồ sơ. Tôi báo trước khi cô ấy tiêm liều đó.",
    },
    {
      speaker: "Interviewer",
      text_en:
        "How did the colleague react?",
      text_vi:
        "Đồng nghiệp phản ứng thế nào?",
    },
    {
      speaker: "Candidate",
      text_en:
        "She was grateful — she'd been at the end of a twelve-hour shift and had missed the chart update. We reported the near-miss together. Our unit revised the handoff protocol after that.",
      text_vi:
        "Cô ấy cảm kích — cuối ca trực 12 tiếng và đã bỏ sót cập nhật hồ sơ. Chúng tôi cùng báo cáo sự cố suýt xảy ra. Khoa sửa lại quy trình bàn giao ca sau vụ đó.",
    },
  ],
  vocabulary_keys: ["administer", "flagged", "near-miss"],
  comprehension_questions: [
    {
      question_vi: "Ứng viên đã làm gì khi thấy nguy cơ?",
      options: [
        "Im lặng vì sợ phật lòng",
        "Báo trước khi đồng nghiệp tiêm thuốc",
        "Báo cấp trên qua email",
      ],
      correct_index: 1,
      explanation_vi:
        "'I flagged it before she gave the dose' — báo NGAY tại thời điểm, không đợi sau.",
    },
    {
      question_vi: "Kết quả cho hệ thống là gì?",
      options: [
        "Đồng nghiệp bị phạt",
        "Khoa sửa lại quy trình bàn giao ca",
        "Không có thay đổi",
      ],
      correct_index: 1,
      explanation_vi:
        "'Our unit revised the handoff protocol' — quy trình được sửa, hệ thống học từ near-miss. Câu trả lời mạnh: vừa cá nhân hành động, vừa cải thiện quy trình.",
    },
  ],
});

CLIPS.push({
  id: "interview-hospitality",
  category: "job-interview",
  title_en: "Hotel interview — handling complaints",
  title_vi: "Phỏng vấn khách sạn — xử lý phàn nàn",
  description_vi:
    "Ứng viên lễ tân kể về một khách giận dữ và cách xoa dịu. Giọng Anh-Anh. Trung cấp.",
  duration_seconds: 75,
  accent: "uk",
  difficulty: "intermediate",
  transcript: [
    {
      speaker: "Interviewer",
      text_en:
        "How would you handle a guest who's furious about their room?",
      text_vi:
        "Bạn sẽ xử lý thế nào nếu khách rất tức giận về phòng?",
    },
    {
      speaker: "Candidate",
      text_en:
        "First, I'd let them vent. People want to feel heard before they want a solution. Then I'd apologise sincerely — not generic, specific to their problem.",
      text_vi:
        "Đầu tiên, tôi sẽ để họ trút giận. Mọi người muốn được lắng nghe trước khi cần giải pháp. Sau đó, tôi sẽ xin lỗi chân thành — không chung chung, mà cụ thể vào vấn đề của họ.",
    },
    {
      speaker: "Interviewer",
      text_en:
        "And then?",
      text_vi:
        "Sau đó?",
    },
    {
      speaker: "Candidate",
      text_en:
        "I'd offer something tangible — an upgrade if available, a complimentary drink, or points on their loyalty account. The fix needs to feel real, not just words.",
      text_vi:
        "Tôi sẽ đưa giải pháp cụ thể — nâng hạng phòng nếu còn, đồ uống miễn phí, hoặc điểm thưởng. Sự đền bù phải cảm thấy thực, không chỉ bằng lời.",
    },
  ],
  vocabulary_keys: ["vent", "sincerely", "tangible"],
  comprehension_questions: [
    {
      question_vi: "Bước đầu tiên ứng viên đề xuất là gì?",
      options: [
        "Đưa giải pháp ngay",
        "Để khách trút giận, lắng nghe",
        "Gọi quản lý",
      ],
      correct_index: 1,
      explanation_vi:
        "'Let them vent' — để khách trút giận trước. 'Want to feel heard before they want a solution' là nguyên tắc service recovery quan trọng.",
    },
    {
      question_vi: "Vì sao ứng viên nhấn mạnh giải pháp 'tangible'?",
      options: [
        "Khách thích đồ ăn",
        "Sự đền bù phải cảm thấy thực, không chỉ bằng lời",
        "Khách sạn quy định",
      ],
      correct_index: 1,
      explanation_vi:
        "'Tangible' nghĩa là cụ thể, sờ chạm được. 'The fix needs to feel real, not just words' — giải pháp phải có giá trị thật.",
    },
  ],
});

CLIPS.push({
  id: "interview-retail",
  category: "job-interview",
  title_en: "Retail interview — handling rush hours",
  title_vi: "Phỏng vấn bán lẻ — xử lý giờ cao điểm",
  description_vi:
    "Ứng viên bán lẻ trả lời về kinh nghiệm xử lý đông khách dịp Black Friday. Trung cấp, từ vựng đời thường.",
  duration_seconds: 55,
  accent: "us",
  difficulty: "intermediate",
  transcript: [
    {
      speaker: "Interviewer",
      text_en:
        "What was your busiest shift, and how did you handle it?",
      text_vi:
        "Ca làm bận nhất của bạn là khi nào, và bạn xử lý ra sao?",
    },
    {
      speaker: "Candidate",
      text_en:
        "Black Friday last year. The store was packed before we even opened. I focused on keeping the line moving — quick scan, clear bag, polite goodbye.",
      text_vi:
        "Black Friday năm ngoái. Cửa hàng đầy người trước cả khi mở cửa. Tôi tập trung giữ hàng đợi tiến nhanh — quẹt mã nhanh, gói gọn, chào lịch sự.",
    },
    {
      speaker: "Interviewer",
      text_en:
        "Did anything go wrong?",
      text_vi:
        "Có sự cố nào không?",
    },
    {
      speaker: "Candidate",
      text_en:
        "A card reader broke around noon. I called my manager, kept calm, and shifted customers to the other registers while it got fixed. We got back up in twenty minutes.",
      text_vi:
        "Một máy quẹt thẻ hỏng khoảng giữa trưa. Tôi gọi quản lý, giữ bình tĩnh, và hướng khách sang các quầy khác trong lúc sửa. Khoảng 20 phút sau hoạt động lại.",
    },
  ],
  vocabulary_keys: ["packed", "kept calm", "shifted"],
  comprehension_questions: [
    {
      question_vi: "Ngày bận nhất là gì?",
      options: ["Ngày khai trương", "Black Friday", "Giáng sinh"],
      correct_index: 1,
      explanation_vi:
        "'Black Friday last year' — Black Friday năm ngoái, ngày mua sắm lớn nhất ở Mỹ.",
    },
    {
      question_vi: "Khi máy quẹt thẻ hỏng, ứng viên làm gì?",
      options: [
        "Cho khách về",
        "Gọi quản lý, giữ bình tĩnh, hướng khách sang quầy khác",
        "Tự sửa máy",
      ],
      correct_index: 1,
      explanation_vi:
        "Ba bước: gọi sếp + giữ bình tĩnh + chuyển khách. Cách trả lời nói lên kỹ năng xử lý áp lực.",
    },
  ],
});

// ─────────────────────────────────────────────────────────────────────
// CATEGORY: casual — 5 clips
// ─────────────────────────────────────────────────────────────────────

CLIPS.push({
  id: "casual-meet-neighbor",
  category: "casual",
  title_en: "Saying hi to a new neighbor",
  title_vi: "Chào hỏi hàng xóm mới",
  description_vi:
    "Mới chuyển đến, gặp hàng xóm cùng tầng và làm quen. Học 'just moved in', 'around the corner', 'let me know'.",
  duration_seconds: 35,
  accent: "us",
  difficulty: "beginner",
  transcript: [
    {
      speaker: "Neighbor",
      text_en:
        "Hi! You must be the new tenant. I'm Sarah, in 4B.",
      text_vi:
        "Chào! Chắc bạn là người vừa chuyển đến phải không. Tôi là Sarah, phòng 4B.",
    },
    {
      speaker: "You",
      text_en:
        "Hey, nice to meet you. I'm Linh, just moved in last week.",
      text_vi:
        "Chào, rất vui được gặp. Tôi là Linh, vừa chuyển đến tuần trước.",
    },
    {
      speaker: "Neighbor",
      text_en:
        "Welcome! There's a great coffee shop just around the corner. Let me know if you need any tips.",
      text_vi:
        "Chào mừng! Có một quán cà phê rất ngon ngay góc phố. Cứ hỏi tôi nếu cần mẹo gì nhé.",
    },
  ],
  vocabulary_keys: ["just moved in", "around the corner", "let me know"],
  comprehension_questions: [
    {
      question_vi: "Hàng xóm gợi ý gì?",
      options: [
        "Quán cà phê gần đây",
        "Phòng tập gym",
        "Siêu thị giảm giá",
      ],
      correct_index: 0,
      explanation_vi:
        "'A great coffee shop just around the corner' — quán cà phê ngon ở góc phố.",
    },
    {
      question_vi: "Linh chuyển đến khi nào?",
      options: ["Hôm nay", "Tuần trước", "Tháng trước"],
      correct_index: 1,
      explanation_vi:
        "'Just moved in last week' — vừa chuyển vào tuần trước.",
    },
  ],
});

CLIPS.push({
  id: "casual-small-talk-weather",
  category: "casual",
  title_en: "Small talk in the elevator",
  title_vi: "Tán gẫu trong thang máy",
  description_vi:
    "Hai người cùng tầng tán chuyện về thời tiết. Giọng Úc. Beginner. Câu nói siêu đơn giản nhưng phổ biến cực kỳ.",
  duration_seconds: 30,
  accent: "au",
  difficulty: "beginner",
  transcript: [
    {
      speaker: "Stranger",
      text_en:
        "Bit cold out there today, isn't it?",
      text_vi:
        "Hôm nay ngoài kia hơi lạnh nhỉ?",
    },
    {
      speaker: "You",
      text_en:
        "Yeah, freezing. I had to wear two jumpers.",
      text_vi:
        "Ờ, lạnh cóng. Tôi phải mặc hai cái áo len.",
    },
    {
      speaker: "Stranger",
      text_en:
        "Supposed to warm up by Friday, though.",
      text_vi:
        "Mà nghe nói thứ Sáu sẽ ấm lên đó.",
    },
    {
      speaker: "You",
      text_en:
        "Fingers crossed.",
      text_vi:
        "Mong là vậy.",
    },
  ],
  vocabulary_keys: ["freezing", "jumpers", "fingers crossed"],
  comprehension_questions: [
    {
      question_vi: "Người Úc gọi 'jumper' nghĩa là gì?",
      options: ["Quần đùi", "Áo len", "Giày"],
      correct_index: 1,
      explanation_vi:
        "'Jumper' trong tiếng Anh-Úc và Anh-Anh là áo len. Người Mỹ gọi là 'sweater'. Đây là một trong những từ khác nhau giữa Mỹ và Úc/Anh.",
    },
    {
      question_vi: "'Fingers crossed' nghĩa là gì?",
      options: ["Bắt tay", "Mong điều gì đó xảy ra", "Tạm biệt"],
      correct_index: 1,
      explanation_vi:
        "'Fingers crossed' — bắt chéo ngón tay, ý là mong/cầu cho điều tốt xảy ra. Idiom phổ biến.",
    },
  ],
});

CLIPS.push({
  id: "casual-weekend-plans",
  category: "casual",
  title_en: "Making weekend plans with a friend",
  title_vi: "Hẹn cuối tuần với bạn",
  description_vi:
    "Hai người bạn bàn kế hoạch cuối tuần. Idiom: 'play it by ear', 'I'm down', 'crash early'. Nâng cao.",
  duration_seconds: 50,
  accent: "us",
  difficulty: "advanced",
  transcript: [
    {
      speaker: "Friend",
      text_en:
        "Got any plans this weekend?",
      text_vi:
        "Cuối tuần có kế hoạch gì không?",
    },
    {
      speaker: "You",
      text_en:
        "Nothing solid. Maybe hike Saturday morning, then play it by ear.",
      text_vi:
        "Chưa chắc chắn gì. Có thể đi hike sáng thứ Bảy, rồi tùy tình hình.",
    },
    {
      speaker: "Friend",
      text_en:
        "I'm down for hiking. There's also a thing at Mike's place Saturday night if you're up for it.",
      text_vi:
        "Tôi sẵn sàng đi hike. Tối thứ Bảy còn có buổi tụ tập ở nhà Mike nếu bạn muốn.",
    },
    {
      speaker: "You",
      text_en:
        "I'll probably swing by for a bit. I've got an early thing Sunday so I might crash early.",
      text_vi:
        "Tôi chắc sẽ ghé một lát. Sáng Chủ nhật có việc sớm nên có thể về sớm đi ngủ.",
    },
  ],
  vocabulary_keys: ["play it by ear", "I'm down", "crash early"],
  comprehension_questions: [
    {
      question_vi: "'Play it by ear' nghĩa là gì?",
      options: [
        "Nghe nhạc",
        "Tùy tình hình, không lên kế hoạch chi tiết",
        "Chơi nhạc cụ",
      ],
      correct_index: 1,
      explanation_vi:
        "Idiom 'play it by ear' nghĩa là tùy cơ ứng biến, không cố định trước. Ban đầu là từ ngữ cảnh chơi nhạc theo trí nhớ.",
    },
    {
      question_vi: "'I'm down' trong câu này nghĩa là gì?",
      options: [
        "Tôi đang buồn",
        "Tôi sẵn sàng / đồng ý",
        "Tôi đang bị bệnh",
      ],
      correct_index: 1,
      explanation_vi:
        "Slang Mỹ: 'I'm down (for X)' = tôi sẵn sàng cho X, đồng ý làm X. Không phải 'down' nghĩa buồn.",
    },
  ],
});

CLIPS.push({
  id: "casual-ask-directions",
  category: "casual",
  title_en: "Asking for directions on the street",
  title_vi: "Hỏi đường",
  description_vi:
    "Du khách hỏi đường đến ga tàu. Giọng Anh-Anh. Học 'two streets down', 'on your left', 'mind the gap' (joke).",
  duration_seconds: 40,
  accent: "uk",
  difficulty: "beginner",
  transcript: [
    {
      speaker: "Tourist",
      text_en:
        "Excuse me, do you know how to get to King's Cross station?",
      text_vi:
        "Xin lỗi, bạn biết đường đến ga King's Cross không?",
    },
    {
      speaker: "Local",
      text_en:
        "Yeah, easy. Go two streets down, then turn right at the pub. The station's on your left, you can't miss it.",
      text_vi:
        "Có, dễ thôi. Đi thẳng hai con phố, rồi rẽ phải ở quán pub. Ga ở bên trái, không thể nhầm được.",
    },
    {
      speaker: "Tourist",
      text_en:
        "Thanks so much. About how long does it take?",
      text_vi:
        "Cảm ơn nhiều. Đi mất bao lâu vậy?",
    },
    {
      speaker: "Local",
      text_en:
        "Five-minute walk. And mind the gap when you board.",
      text_vi:
        "Đi bộ 5 phút. Và nhớ chú ý khoảng hở khi lên tàu nhé.",
    },
  ],
  vocabulary_keys: ["two streets down", "on your left", "mind the gap"],
  comprehension_questions: [
    {
      question_vi: "Đi đến ga mất bao lâu?",
      options: ["2 phút", "5 phút", "15 phút"],
      correct_index: 1,
      explanation_vi:
        "'Five-minute walk' — đi bộ 5 phút.",
    },
    {
      question_vi: "'Mind the gap' là gì?",
      options: [
        "Cẩn thận xe",
        "Chú ý khoảng hở giữa tàu và sân ga",
        "Đừng nói chuyện",
      ],
      correct_index: 1,
      explanation_vi:
        "Câu cảnh báo nổi tiếng ở London Underground: 'Mind the gap' — chú ý khoảng hở giữa tàu và sân ga để không bị lọt chân.",
    },
  ],
});

CLIPS.push({
  id: "casual-intro-at-party",
  category: "casual",
  title_en: "Introducing yourself at a party",
  title_vi: "Tự giới thiệu ở buổi tiệc",
  description_vi:
    "Buổi tiệc nhà bạn của bạn. Hai người không quen nhau bắt chuyện. Giọng Canada. Trung cấp.",
  duration_seconds: 55,
  accent: "ca",
  difficulty: "intermediate",
  transcript: [
    {
      speaker: "Stranger",
      text_en:
        "Hey, I don't think we've met. I'm Daniel — I work with the host.",
      text_vi:
        "Chào, hình như mình chưa gặp nhau. Tôi là Daniel — làm cùng chỗ với chủ nhà.",
    },
    {
      speaker: "You",
      text_en:
        "Oh hi, I'm Linh. I went to college with Jen.",
      text_vi:
        "Chào, tôi là Linh. Tôi học đại học cùng Jen.",
    },
    {
      speaker: "Stranger",
      text_en:
        "Cool, what brings you to Toronto?",
      text_vi:
        "Hay quá, lý do gì đưa bạn đến Toronto?",
    },
    {
      speaker: "You",
      text_en:
        "Just moved here for a job in product design. Three months in, still figuring out where the good restaurants are.",
      text_vi:
        "Vừa chuyển đến vì công việc thiết kế sản phẩm. Mới được ba tháng, vẫn đang tìm xem nhà hàng nào ngon.",
    },
  ],
  vocabulary_keys: ["the host", "what brings you", "figuring out"],
  comprehension_questions: [
    {
      question_vi: "Daniel quen biết với chủ nhà thế nào?",
      options: [
        "Anh em họ",
        "Đồng nghiệp",
        "Bạn cũ thời cấp 3",
      ],
      correct_index: 1,
      explanation_vi:
        "'I work with the host' — đồng nghiệp với chủ nhà.",
    },
    {
      question_vi: "Linh chuyển đến Toronto để làm gì?",
      options: [
        "Du lịch",
        "Làm thiết kế sản phẩm",
        "Học lên cao học",
      ],
      correct_index: 1,
      explanation_vi:
        "'Moved here for a job in product design' — chuyển đến vì công việc thiết kế sản phẩm.",
    },
  ],
});

// ─────────────────────────────────────────────────────────────────────
// CATEGORY: shopping — 4 clips
// ─────────────────────────────────────────────────────────────────────

CLIPS.push({
  id: "shopping-ask-sizes",
  category: "shopping",
  title_en: "Asking for a different size",
  title_vi: "Hỏi xin size khác",
  description_vi:
    "Khách thử áo, size không vừa, hỏi nhân viên đem size khác. Học cách nói size US và 'fitting room'.",
  duration_seconds: 40,
  accent: "us",
  difficulty: "beginner",
  transcript: [
    {
      speaker: "Customer",
      text_en:
        "Excuse me, do you have this in a medium? The small is a little tight.",
      text_vi:
        "Xin lỗi, bạn có cái này size M không? Size S hơi chật.",
    },
    {
      speaker: "Associate",
      text_en:
        "Let me check the back. Can I get you the medium and the large just in case?",
      text_vi:
        "Để tôi vào kho xem. Tôi đem cả M và L luôn cho chắc nhé?",
    },
    {
      speaker: "Customer",
      text_en:
        "That would be great, thanks. I will be in the fitting room.",
      text_vi:
        "Vậy thì hay quá, cảm ơn. Tôi sẽ ở trong phòng thử đồ.",
    },
  ],
  vocabulary_keys: ["medium", "tight", "fitting room"],
  comprehension_questions: [
    {
      question_vi: "Khách phàn nàn gì về size S?",
      options: ["Quá rộng", "Hơi chật", "Sai màu"],
      correct_index: 1,
      explanation_vi: "'A little tight' — hơi chật.",
    },
    {
      question_vi: "Nhân viên định mang ra mấy size?",
      options: ["Chỉ M", "Cả M và L", "Cả S, M, L"],
      correct_index: 1,
      explanation_vi:
        "'The medium and the large just in case' — cả M và L cho chắc.",
    },
  ],
});

CLIPS.push({
  id: "shopping-return-policy",
  category: "shopping",
  title_en: "Asking about the return policy",
  title_vi: "Hỏi chính sách trả hàng",
  description_vi:
    "Khách hỏi cửa hàng có cho trả hàng không, có cần hóa đơn không. Học gift receipt, store credit, within 30 days.",
  duration_seconds: 55,
  accent: "us",
  difficulty: "intermediate",
  transcript: [
    {
      speaker: "Customer",
      text_en: "What is the return policy if it does not fit her?",
      text_vi: "Chính sách trả hàng thế nào nếu cô ấy không vừa?",
    },
    {
      speaker: "Cashier",
      text_en:
        "You can return within thirty days with the receipt for a full refund. Without the receipt, it is store credit only.",
      text_vi:
        "Bạn có thể trả trong 30 ngày kèm hóa đơn để hoàn tiền đầy đủ. Không có hóa đơn thì chỉ đổi sang store credit.",
    },
    {
      speaker: "Customer",
      text_en:
        "Could I get a gift receipt for her? She will not need to see the price.",
      text_vi:
        "Cho tôi xin gift receipt được không? Cô ấy sẽ không thấy giá.",
    },
    {
      speaker: "Cashier",
      text_en: "Of course. I will print one with no price on it.",
      text_vi: "Vâng. Tôi sẽ in một cái không có giá.",
    },
  ],
  vocabulary_keys: ["return policy", "gift receipt", "store credit"],
  comprehension_questions: [
    {
      question_vi: "Không có hóa đơn thì sao?",
      options: [
        "Không trả được",
        "Chỉ đổi store credit",
        "Hoàn tiền mặt giảm 50%",
      ],
      correct_index: 1,
      explanation_vi:
        "'Without the receipt, it is store credit only' — không có hóa đơn thì chỉ được store credit.",
    },
    {
      question_vi: "Gift receipt khác hóa đơn thường ở điểm gì?",
      options: [
        "Không in giá",
        "Hết hạn nhanh hơn",
        "Chỉ dùng vào dịp Giáng sinh",
      ],
      correct_index: 0,
      explanation_vi:
        "Gift receipt là phiên bản đặc biệt không in giá, để người nhận quà có thể đổi/trả nhưng không biết giá.",
    },
  ],
});

CLIPS.push({
  id: "shopping-find-items",
  category: "shopping",
  title_en: "Asking where to find an item",
  title_vi: "Hỏi nơi tìm món hàng",
  description_vi:
    "Khách hỏi nhân viên Aussie nơi để mì spaghetti. Học aisle, past the deli, no worries.",
  duration_seconds: 45,
  accent: "au",
  difficulty: "intermediate",
  transcript: [
    {
      speaker: "Customer",
      text_en: "Hi, do you know where the spaghetti is?",
      text_vi: "Chào, bạn biết mì spaghetti ở đâu không?",
    },
    {
      speaker: "Staff",
      text_en:
        "Yeah, aisle four. Past the deli, on the right-hand side, second shelf down.",
      text_vi:
        "Có. Lối số 4. Đi qua quầy đồ nguội, bên phải, kệ thứ hai từ trên xuống.",
    },
    {
      speaker: "Customer",
      text_en: "Got it, thanks. Is there a wholemeal version?",
      text_vi: "Hiểu rồi, cảm ơn. Có loại nguyên cám không?",
    },
    {
      speaker: "Staff",
      text_en:
        "Should be on the same shelf, blue packet. No worries if not, give us a shout.",
      text_vi:
        "Chắc cùng kệ đó, gói màu xanh dương. Không thấy thì gọi mình nhé.",
    },
  ],
  vocabulary_keys: ["aisle", "past the deli", "no worries"],
  comprehension_questions: [
    {
      question_vi: "Mì spaghetti ở đâu?",
      options: [
        "Lối 1 cạnh quầy thịt",
        "Lối 4, sau quầy đồ nguội, bên phải",
        "Lối 7 trong tủ đông",
      ],
      correct_index: 1,
      explanation_vi:
        "'Aisle four. Past the deli, on the right-hand side' — lối 4, qua quầy deli, bên phải.",
    },
    {
      question_vi: "'No worries' nghĩa là gì?",
      options: ["Khẩn cấp", "Không sao / không vấn đề", "Im lặng"],
      correct_index: 1,
      explanation_vi:
        "'No worries' rất phổ biến ở Úc, nghĩa là 'không sao, đừng lo'. Tương đương 'no problem'.",
    },
  ],
});

CLIPS.push({
  id: "shopping-checkout",
  category: "shopping",
  title_en: "Checking out with a discount code",
  title_vi: "Thanh toán với mã giảm giá",
  description_vi:
    "Khách quên mã giảm giá email, hỏi nhân viên có thể tra cứu được không. Tình huống nâng cao: apply, lookup, price-match.",
  duration_seconds: 60,
  accent: "us",
  difficulty: "advanced",
  transcript: [
    {
      speaker: "Cashier",
      text_en:
        "Your total comes to one hundred and forty-seven thirty-eight.",
      text_vi: "Tổng của bạn là 147.38 đô.",
    },
    {
      speaker: "Customer",
      text_en:
        "I had a fifteen percent off email, but I cannot find it. Can you look it up by my account?",
      text_vi:
        "Tôi có một email giảm 15% nhưng tìm không ra. Anh tra theo tài khoản giúp được không?",
    },
    {
      speaker: "Cashier",
      text_en:
        "Yeah, I can pull it up. Can I get the email on your loyalty account?",
      text_vi:
        "Vâng, tôi tra được. Cho tôi email gắn với tài khoản loyalty?",
    },
    {
      speaker: "Customer",
      text_en: "linh dot tran at gmail dot com.",
      text_vi: "linh chấm tran a còng gmail chấm com.",
    },
    {
      speaker: "Cashier",
      text_en:
        "Got it. Code applied. New total is one hundred and twenty-five eighteen. Also, this jacket is on sale tomorrow — do you want me to do a price-match adjustment now?",
      text_vi:
        "Được rồi. Đã áp mã. Tổng mới là 125.18 đô. Áo khoác này ngày mai bán giảm giá — anh có muốn tôi áp luôn giá đó cho anh không?",
    },
  ],
  vocabulary_keys: ["apply", "look it up", "price-match"],
  comprehension_questions: [
    {
      question_vi: "Sau khi áp mã, tổng tiền giảm bao nhiêu?",
      options: [
        "Còn 147.38 — không đổi",
        "Còn 125.18 — giảm 22.20",
        "Còn 100.00",
      ],
      correct_index: 1,
      explanation_vi:
        "Trước: 147.38. Sau khi áp 15%: 125.18. Giảm khoảng 22.20.",
    },
    {
      question_vi: "Nhân viên đề xuất gì thêm?",
      options: [
        "Mua thêm 1 áo nữa",
        "Áp giá khuyến mãi của ngày mai (price-match)",
        "Đăng ký thẻ tín dụng cửa hàng",
      ],
      correct_index: 1,
      explanation_vi:
        "Price-match adjustment: nhiều cửa hàng Mỹ cho phép khách mua hôm nay với giá khuyến mãi sẽ có trong vài ngày tới.",
    },
  ],
});

// ─────────────────────────────────────────────────────────────────────
// CATEGORY: transportation — 3 clips
// ─────────────────────────────────────────────────────────────────────

CLIPS.push({
  id: "transport-uber-pickup",
  category: "transportation",
  title_en: "Confirming an Uber pickup",
  title_vi: "Xác nhận điểm đón Uber",
  description_vi:
    "Tài xế gọi xác nhận khách đứng đúng chỗ vì sân bay đông người. Học pulling up, curbside, flag me down.",
  duration_seconds: 45,
  accent: "us",
  difficulty: "intermediate",
  transcript: [
    {
      speaker: "Driver",
      text_en:
        "Hey, this is your Uber driver. I am pulling up to terminal two now. Where exactly are you standing?",
      text_vi:
        "Chào, tôi là tài Uber của bạn. Đang vào terminal 2. Bạn đang đứng chính xác ở đâu?",
    },
    {
      speaker: "Passenger",
      text_en:
        "I am at the curbside, between door three and door four. White suitcase, blue jacket.",
      text_vi:
        "Tôi ở lề đường, giữa cửa số 3 và 4. Vali trắng, áo khoác xanh dương.",
    },
    {
      speaker: "Driver",
      text_en:
        "Got it. I am in a silver Toyota Camry, license plate eight bravo charlie one two three. Just flag me down when you see me.",
      text_vi:
        "Hiểu rồi. Toyota Camry màu bạc, biển 8BC123. Cứ vẫy tay khi thấy tôi nhé.",
    },
  ],
  vocabulary_keys: ["pulling up", "curbside", "flag me down"],
  comprehension_questions: [
    {
      question_vi: "Khách đang đứng ở đâu?",
      options: ["Cửa số 1", "Lề đường giữa cửa 3 và 4", "Bãi đậu xe"],
      correct_index: 1,
      explanation_vi:
        "'Curbside, between door three and door four' — lề đường (curbside) giữa cửa 3 và 4.",
    },
    {
      question_vi: "'Flag me down' nghĩa là gì?",
      options: [
        "Hạ cờ",
        "Vẫy tay ra hiệu để tài xế thấy",
        "Đặt xe khác",
      ],
      correct_index: 1,
      explanation_vi:
        "'Flag down' — vẫy tay để xe thấy mình. Idiom phổ biến với taxi và rideshare.",
    },
  ],
});

CLIPS.push({
  id: "transport-driver-help",
  category: "transportation",
  title_en: "Asking the driver to turn around",
  title_vi: "Nhờ tài xế quay lại",
  description_vi:
    "Khách quên ví trên xe và gọi lại tài xế. Giọng Canada. Tình huống nâng cao, học turn around, pull over, minor detour.",
  duration_seconds: 50,
  accent: "ca",
  difficulty: "advanced",
  transcript: [
    {
      speaker: "Passenger",
      text_en:
        "Hey, I think I left my wallet in your back seat. Any chance you could turn around?",
      text_vi:
        "Chào, hình như tôi để quên ví ở ghế sau. Anh có thể quay lại được không?",
    },
    {
      speaker: "Driver",
      text_en:
        "Hold on, let me pull over and check. Yeah, I got a black wallet here on the floor. Can you wait fifteen minutes? I am happy to do a minor detour.",
      text_vi:
        "Đợi tôi tấp vào lề kiểm tra đã. Có một cái ví đen dưới sàn. Bạn đợi 15 phút được không? Tôi sẵn sàng đi vòng lại.",
    },
    {
      speaker: "Passenger",
      text_en:
        "Yes, that works. Please bring it to the lobby of the Hilton Bayshore. I will pay for the extra time on the app.",
      text_vi:
        "Vâng, được. Anh đem đến sảnh khách sạn Hilton Bayshore giùm. Tôi sẽ trả thêm phí qua app.",
    },
  ],
  vocabulary_keys: ["turn around", "pull over", "minor detour"],
  comprehension_questions: [
    {
      question_vi: "Khách để quên gì?",
      options: ["Điện thoại", "Ví", "Hộ chiếu"],
      correct_index: 1,
      explanation_vi:
        "'I think I left my wallet' — quên ví. Tài xế xác nhận tìm thấy 'a black wallet'.",
    },
    {
      question_vi: "Khách trả thêm tiền cho việc tài xế quay lại bằng cách nào?",
      options: [
        "Trả tiền mặt",
        "Qua app Uber/Lyft với tip thêm",
        "Không trả gì",
      ],
      correct_index: 1,
      explanation_vi:
        "'I will pay for the extra time on the app' — trả qua app, là cách chuẩn để bù tiền cho tài xế trong rideshare.",
    },
  ],
});

CLIPS.push({
  id: "transport-airport-checkin",
  category: "transportation",
  title_en: "Airport check-in with extra baggage",
  title_vi: "Check-in sân bay với hành lý dư",
  description_vi:
    "Khách check-in chuyến bay quốc tế, vali quá ký phải đóng phí. Giọng Anh-Anh. Nâng cao, học overweight, rebalance, carry-on.",
  duration_seconds: 70,
  accent: "uk",
  difficulty: "advanced",
  transcript: [
    {
      speaker: "Agent",
      text_en: "Good morning. Passport and booking reference, please?",
      text_vi: "Chào buổi sáng. Cho tôi xin hộ chiếu và mã đặt vé.",
    },
    {
      speaker: "Passenger",
      text_en:
        "Here you are. Two checked bags, both under fifty pounds I hope.",
      text_vi:
        "Đây ạ. Hai vali ký gửi, hy vọng dưới 50 pound (23kg) cả hai.",
    },
    {
      speaker: "Agent",
      text_en:
        "First one is fine — twenty-two kilos. The second one is overweight — twenty-eight. There is a fee of one hundred pounds for that, or you can rebalance them.",
      text_vi:
        "Cái đầu ổn — 22kg. Cái thứ hai quá ký — 28kg. Phí 100 bảng cho vali đó, hoặc bạn có thể chia lại đồ cho cân.",
    },
    {
      speaker: "Passenger",
      text_en:
        "Let me move some things to my carry-on. Can I do that here?",
      text_vi:
        "Để tôi chuyển bớt đồ sang vali xách tay. Tôi làm ngay đây được chứ?",
    },
    {
      speaker: "Agent",
      text_en:
        "Of course. Step to the side. When you are ready I will reweigh. Your gate is twenty-three, boarding starts at nine forty.",
      text_vi:
        "Vâng. Bạn đứng sang một bên. Khi nào sẵn sàng tôi cân lại. Cửa lên máy bay là cửa 23, bắt đầu cho lên lúc 9 giờ 40.",
    },
  ],
  vocabulary_keys: ["overweight", "rebalance", "carry-on"],
  comprehension_questions: [
    {
      question_vi: "Vali nào bị quá ký?",
      options: ["Vali thứ nhất, 22kg", "Vali thứ hai, 28kg", "Cả hai"],
      correct_index: 1,
      explanation_vi:
        "Vali 1: 22kg (ổn). Vali 2: 28kg (quá ký). Giới hạn ký gửi quốc tế thường là 23kg.",
    },
    {
      question_vi: "Khách chọn cách xử lý nào?",
      options: [
        "Trả 100 bảng phí quá ký",
        "Chuyển đồ sang vali xách tay (carry-on) để cân lại",
        "Bỏ bớt đồ ở sân bay",
      ],
      correct_index: 1,
      explanation_vi:
        "'Move some things to my carry-on' — chuyển sang vali xách tay. Cách phổ biến để tránh phí quá ký.",
    },
  ],
});

// ─────────────────────────────────────────────────────────────────────
// Selectors and lookup helpers — exported names are stable.
// ─────────────────────────────────────────────────────────────────────

export const LISTENING_CLIPS: ListeningClip[] = CLIPS;

export const LISTENING_BY_CATEGORY: Record<ListeningCategory, ListeningClip[]> = {
  restaurant:         LISTENING_CLIPS.filter((c) => c.category === "restaurant"),
  doctor:             LISTENING_CLIPS.filter((c) => c.category === "doctor"),
  "customer-service": LISTENING_CLIPS.filter((c) => c.category === "customer-service"),
  "job-interview":    LISTENING_CLIPS.filter((c) => c.category === "job-interview"),
  casual:             LISTENING_CLIPS.filter((c) => c.category === "casual"),
  shopping:           LISTENING_CLIPS.filter((c) => c.category === "shopping"),
  transportation:     LISTENING_CLIPS.filter((c) => c.category === "transportation"),
};

export function getListeningClipById(id: string): ListeningClip | undefined {
  return LISTENING_CLIPS.find((c) => c.id === id);
}

/** Suggest the next clip in the same category that the user has not completed. */
export function suggestNextInCategory(
  category: ListeningCategory,
  completedIds: ReadonlySet<string>,
): ListeningClip | undefined {
  const pool = LISTENING_BY_CATEGORY[category] ?? [];
  return pool.find((c) => !completedIds.has(c.id));
}
