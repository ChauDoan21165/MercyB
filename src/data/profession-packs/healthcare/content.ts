// src/data/profession-packs/healthcare/content.ts
//
// Lesson-shaped content for the healthcare-worker profession pack.
// Mirrors the nail-tech / restaurant / customer-service pack shapes
// shipped earlier this week.
//
// SCOPE LIMIT — read this before changing anything in this file:
//
// This pack teaches *communication English* for Vietnamese workers in
// US healthcare settings (CNAs, home health aides, dental assistants,
// medical interpreters, front-desk staff). It is NOT medical training,
// it does NOT certify anyone for clinical practice, and it MUST NOT
// contain:
//   - actual drug names paired with actual dosages
//   - treatment recommendations of any kind
//   - workarounds for HIPAA, scope-of-practice rules, or licensure
//   - anything a reader could mistake for clinical advice
//
// Sentences are EXAMPLES of correct phrasing for situations that come
// up at work. Cultural notes describe US workplace norms (HIPAA,
// disclosure expectations, end-of-life conversations across cultures).
// Tip advice is about communication choices and when to escalate to a
// licensed clinician — never about clinical decisions themselves.
//
// 50 lessons across 8 categories. Each lesson:
//
//   id                 healthcare_<slug> — forward-compatible with
//                      future room IDs in roomRegistry.
//   title_vi/title_en  bilingual title.
//   category           one of HEALTHCARE_CATEGORIES.
//   sentences          4–6 short utterances; each carries a Vietnamese
//                      gloss + pronunciation_focus keys for VN-typical
//                      misses on medical English (Latin/Greek roots,
//                      drug-name shapes, anatomical terms, /θ/, /r/).
//   cultural_notes_vi  what's actually true in US healthcare (HIPAA,
//                      modesty norms, family decision-making, pain
//                      scales).
//   tip_advice_vi      practical workplace advice — repeat-back habits,
//                      when to escalate, common errors that trigger
//                      incident reports.

export type HealthcareCategoryId =
  | "intake_vitals"
  | "pain_assessment"
  | "medication_communication"
  | "procedure_communication"
  | "elder_dementia_care"
  | "emergency_communication"
  | "cultural_sensitivity"
  | "charting_documentation";

export type HealthcareCategoryMeta = {
  id: HealthcareCategoryId;
  title_vi: string;
  title_en: string;
  expected_count: number;
};

export const HEALTHCARE_CATEGORIES: ReadonlyArray<HealthcareCategoryMeta> = [
  {
    id: "intake_vitals",
    title_vi: "Tiếp nhận và đo dấu hiệu sinh tồn",
    title_en: "Patient intake and vital signs",
    expected_count: 5,
  },
  {
    id: "pain_assessment",
    title_vi: "Đánh giá đau",
    title_en: "Pain assessment",
    expected_count: 5,
  },
  {
    id: "medication_communication",
    title_vi: "Trao đổi về thuốc",
    title_en: "Medication communication",
    expected_count: 10,
  },
  {
    id: "procedure_communication",
    title_vi: "Giao tiếp trước/sau thủ thuật",
    title_en: "Pre / post-procedure communication",
    expected_count: 5,
  },
  {
    id: "elder_dementia_care",
    title_vi: "Chăm sóc người lớn tuổi và sa sút trí tuệ",
    title_en: "Daily care for elderly / dementia patients",
    expected_count: 10,
  },
  {
    id: "emergency_communication",
    title_vi: "Giao tiếp khẩn cấp",
    title_en: "Emergency communication",
    expected_count: 5,
  },
  {
    id: "cultural_sensitivity",
    title_vi: "Nhạy cảm văn hoá",
    title_en: "Cultural sensitivity",
    expected_count: 5,
  },
  {
    id: "charting_documentation",
    title_vi: "Ghi chú và hồ sơ",
    title_en: "Charting and documentation",
    expected_count: 5,
  },
];

export type LessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
};

export type HealthcareLesson = {
  id: string;
  category: HealthcareCategoryId;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  tip_advice_vi: string;
};

// ── 1. Patient intake and vital signs (5) ─────────────────────────────────

const INTAKE_VITALS: HealthcareLesson[] = [
  {
    id: "healthcare_intake_what_brings_you_in",
    category: "intake_vitals",
    title_vi: "Hỏi lý do đến khám",
    title_en: "Asking why the patient came in",
    sentences: [
      { en: "What brings you in today?", vi: "Hôm nay anh/chị đến vì lý do gì ạ?", pronunciation_focus: ["brings", "today"] },
      { en: "Can you tell me a little about what you're feeling?", vi: "Anh/chị kể một chút về cảm giác hiện tại nhé?", pronunciation_focus: ["tell", "feeling"] },
      { en: "When did this start?", vi: "Triệu chứng bắt đầu khi nào ạ?", pronunciation_focus: ["when", "start"] },
      { en: "Is this the first time, or has it happened before?", vi: "Đây là lần đầu hay đã xảy ra trước đây ạ?", pronunciation_focus: ["first", "before"] },
    ],
    cultural_notes_vi:
      "Câu 'What brings you in today?' là câu mở chuẩn ở phòng khám Mỹ — không phải dịch sát từ tiếng Việt. Người Mỹ thường trả lời thẳng vào triệu chứng. Bệnh nhân Việt lớn tuổi đôi khi kể câu chuyện dài; lắng nghe trước, ghi chú sau.",
    tip_advice_vi:
      "Ghi chính xác từ ngữ bệnh nhân dùng — không tự diễn giải. 'Stomach hurts' và 'belly hurts' là khác nhau khi vào hồ sơ. Nếu không chắc, hỏi lại: 'When you say tired, do you mean sleepy or weak?'",
  },
  {
    id: "healthcare_intake_history",
    category: "intake_vitals",
    title_vi: "Hỏi tiền sử",
    title_en: "Asking about medical history",
    sentences: [
      { en: "Do you have any chronic conditions we should know about?", vi: "Anh/chị có bệnh mãn tính nào không ạ?", pronunciation_focus: ["chronic", "conditions"] },
      { en: "Any surgeries in the past?", vi: "Có phẫu thuật nào trong quá khứ không ạ?", pronunciation_focus: ["surgeries", "past"] },
      { en: "Are you currently seeing any other doctors?", vi: "Anh/chị có đang khám bác sĩ nào khác không ạ?", pronunciation_focus: ["currently", "other"] },
      { en: "Any history in your family — heart, diabetes, cancer?", vi: "Tiền sử gia đình — tim, tiểu đường, ung thư?", pronunciation_focus: ["history", "diabetes"] },
    ],
    cultural_notes_vi:
      "Bệnh nhân Mỹ quen kể tiền sử gia đình rõ ràng. Nhiều bệnh nhân Việt không biết tiền sử gia đình rõ — đó không phải dấu hiệu bất hợp tác. Nói nhẹ: 'No worries if you don't remember everything — just what you know.'",
    tip_advice_vi:
      "Đừng đoán chữ viết tay của bệnh nhân về tên thuốc cũ — yêu cầu xem chai thuốc hoặc app điện thoại. Tự đoán = sai trong hồ sơ = nguy hiểm cho bệnh nhân.",
  },
  {
    id: "healthcare_intake_announce_vitals",
    category: "intake_vitals",
    title_vi: "Thông báo dấu hiệu sinh tồn",
    title_en: "Announcing vital signs",
    sentences: [
      { en: "I'm going to take your blood pressure now.", vi: "Em đo huyết áp cho anh/chị nhé.", pronunciation_focus: ["blood pressure", "now"] },
      { en: "This will feel a little tight — that's normal.", vi: "Sẽ cảm thấy hơi siết — bình thường thôi ạ.", pronunciation_focus: ["tight", "normal"] },
      { en: "I'll check your temperature and oxygen too.", vi: "Em đo nhiệt độ và nồng độ oxy luôn.", pronunciation_focus: ["temperature", "oxygen"] },
      { en: "Just relax your arm.", vi: "Anh/chị thả lỏng tay nhé.", pronunciation_focus: ["relax", "arm"] },
    ],
    cultural_notes_vi:
      "Tiêu chuẩn Mỹ là báo TRƯỚC mọi động chạm. 'I'm going to take your blood pressure' là phép lịch sự + bảo vệ pháp lý (không bị tố 'unwanted touch'). Đừng bao giờ chạm bệnh nhân trước khi báo.",
    tip_advice_vi:
      "Báo từng bước = bệnh nhân yên tâm = vital signs chính xác hơn (huyết áp đo lúc lo lắng cao giả). Nếu cuff máy bóp đau, thả ngay rồi báo lại — đừng cố tiếp tục.",
  },
  {
    id: "healthcare_intake_weight_height",
    category: "intake_vitals",
    title_vi: "Cân và đo chiều cao",
    title_en: "Weight and height",
    sentences: [
      { en: "Could you step on the scale for me, please?", vi: "Anh/chị bước lên cân giúp em ạ?", pronunciation_focus: ["step", "scale"] },
      { en: "Shoes off, but you can keep your socks on.", vi: "Bỏ giày, vẫn để vớ được ạ.", pronunciation_focus: ["shoes", "socks"] },
      { en: "Stand up straight against the height bar.", vi: "Đứng thẳng dựa thước đo chiều cao.", pronunciation_focus: ["straight", "height"] },
      { en: "I'll write the numbers down.", vi: "Em ghi số xuống đây.", pronunciation_focus: ["write", "numbers"] },
    ],
    cultural_notes_vi:
      "Một số bệnh nhân Mỹ nhạy cảm về cân nặng — đừng đọc to số cân ra. Ghi xuống lặng lẽ. Bệnh nhân Việt nhiều khi không biết cân Mỹ (pounds) — chuyển sang kg trong đầu nếu họ hỏi.",
    tip_advice_vi:
      "Nếu bệnh nhân từ chối cân (rất phổ biến với người ăn kiêng hoặc trầm cảm), không ép. Ghi 'declined' trong hồ sơ — đó là quyền của bệnh nhân và phải tôn trọng.",
  },
  {
    id: "healthcare_intake_recheck",
    category: "intake_vitals",
    title_vi: "Đo lại khi số cao",
    title_en: "Rechecking elevated readings",
    sentences: [
      { en: "Your number was a little high — let me check it again in a few minutes.", vi: "Số hơi cao — em sẽ đo lại sau vài phút.", pronunciation_focus: ["little", "again"] },
      { en: "Sometimes the first reading is off if you've been moving.", vi: "Lần đầu đôi khi sai nếu mới đi lại.", pronunciation_focus: ["first", "moving"] },
      { en: "Take a few deep breaths.", vi: "Anh/chị hít thở sâu vài cái.", pronunciation_focus: ["deep", "breaths"] },
      { en: "I'll let the doctor know either way.", vi: "Em sẽ báo bác sĩ dù sao đi nữa.", pronunciation_focus: ["either", "way"] },
    ],
    cultural_notes_vi:
      "Tiêu chuẩn Mỹ: vital signs cao bất thường phải đo lại trước khi ghi vào hồ sơ. Đừng quy chụp 'white coat hypertension' — nói 'a little high, let me recheck' và tự thực hiện. Đừng làm bệnh nhân hoảng.",
    tip_advice_vi:
      "Nếu lần đo lại vẫn cao, BÁO RN/MD ngay — đừng đợi cuối ca. Đó là điểm escalation rõ ràng: bạn đo, RN/MD quyết định. Vai trò mỗi người trong scope of practice không lẫn lộn.",
  },
];

// ── 2. Pain assessment (5) ───────────────────────────────────────────────

const PAIN_ASSESSMENT: HealthcareLesson[] = [
  {
    id: "healthcare_pain_scale",
    category: "pain_assessment",
    title_vi: "Thang điểm đau 0-10",
    title_en: "0-to-10 pain scale",
    sentences: [
      { en: "On a scale of zero to ten, how would you rate your pain right now?", vi: "Theo thang 0 đến 10, anh/chị đánh giá cơn đau hiện tại ở mức nào?", pronunciation_focus: ["scale", "rate"] },
      { en: "Zero is no pain, ten is the worst pain you can imagine.", vi: "0 là không đau, 10 là đau nhất có thể tưởng tượng.", pronunciation_focus: ["worst", "imagine"] },
      { en: "It's okay to take a moment.", vi: "Anh/chị cứ suy nghĩ một chút.", pronunciation_focus: ["okay", "moment"] },
      { en: "How would you compare it to other pain you've had?", vi: "So với cơn đau trước đây thì sao ạ?", pronunciation_focus: ["compare", "had"] },
    ],
    cultural_notes_vi:
      "Bệnh nhân Việt thường khai báo đau thấp hơn thực tế (văn hoá 'chịu đựng'). Câu 'compare to other pain' giúp lấy số chính xác hơn. Bệnh nhân Mỹ trẻ đôi khi nói 'eleven out of ten' — bình thường, ghi đúng.",
    tip_advice_vi:
      "Đừng tự diễn giải số đau ('she's exaggerating' / 'he's tough'). Ghi chính xác con số bệnh nhân đưa ra. Diễn giải = sai sót lâm sàng + có thể bị kiện. Quan sát + báo cáo, không phán xét.",
  },
  {
    id: "healthcare_pain_descriptors",
    category: "pain_assessment",
    title_vi: "Mô tả tính chất đau",
    title_en: "Describing the pain quality",
    sentences: [
      { en: "Is the pain sharp, dull, throbbing, or burning?", vi: "Đau nhói, âm ỉ, theo nhịp, hay rát ạ?", pronunciation_focus: ["sharp", "throbbing"] },
      { en: "Does it stay in one spot, or does it move?", vi: "Đau tại chỗ hay lan ra ạ?", pronunciation_focus: ["spot", "move"] },
      { en: "Does anything make it better or worse?", vi: "Có gì làm đỡ hay nặng hơn không?", pronunciation_focus: ["better", "worse"] },
      { en: "Is it constant, or does it come and go?", vi: "Đau liên tục hay từng cơn ạ?", pronunciation_focus: ["constant", "come"] },
    ],
    cultural_notes_vi:
      "Tiếng Anh có nhiều mô tả đau: sharp / dull / throbbing / burning / aching / cramping / shooting. Bệnh nhân Việt thường dịch sang 'đau' chung chung. Lặp lại bằng cụm Anh-Việt: 'sharp like a knife' (đau như dao đâm) để tìm từ đúng.",
    tip_advice_vi:
      "Ghi y nguyên từ bệnh nhân dùng — 'patient describes pain as throbbing' chứ không phải 'patient has throbbing pain'. Khác biệt nhỏ nhưng quan trọng trong hồ sơ.",
  },
  {
    id: "healthcare_pain_location",
    category: "pain_assessment",
    title_vi: "Vị trí đau",
    title_en: "Locating the pain",
    sentences: [
      { en: "Can you point to where it hurts?", vi: "Anh/chị chỉ chỗ đau giúp em được không?", pronunciation_focus: ["point", "hurts"] },
      { en: "Just one spot, or in more than one place?", vi: "Chỉ một chỗ hay nhiều chỗ?", pronunciation_focus: ["spot", "place"] },
      { en: "Does it travel down your arm or leg?", vi: "Đau có lan xuống tay hay chân không?", pronunciation_focus: ["travel", "leg"] },
      { en: "Show me with one finger if you can.", vi: "Chỉ một ngón tay nếu được ạ.", pronunciation_focus: ["show", "finger"] },
    ],
    cultural_notes_vi:
      "Yêu cầu bệnh nhân chỉ vị trí — đừng đoán. Đau lan xuống tay trái + ngực = dấu hiệu cần báo MD ngay. Bệnh nhân lớn tuổi đôi khi chỉ vùng rộng — hỏi 'one finger' giúp khoanh chính xác.",
    tip_advice_vi:
      "Nếu bệnh nhân chỉ ngực + đau lan tay trái + đổ mồ hôi, BÁO MD NGAY — không đợi đo xong vital signs. Một số dấu hiệu là 'red flag' phải thoát khỏi quy trình thường để escalate.",
  },
  {
    id: "healthcare_pain_kid",
    category: "pain_assessment",
    title_vi: "Đánh giá đau ở trẻ em",
    title_en: "Pediatric pain assessment",
    sentences: [
      { en: "Which face shows how you're feeling right now?", vi: "Mặt nào giống cảm giác của con nhất ạ?", pronunciation_focus: ["which", "feeling"] },
      { en: "Smile face is no hurt, crying face is the biggest hurt.", vi: "Mặt cười là không đau, mặt khóc là đau nhất.", pronunciation_focus: ["smile", "biggest"] },
      { en: "It's okay to point.", vi: "Con cứ chỉ vào nhé.", pronunciation_focus: ["okay", "point"] },
      { en: "You're being so brave.", vi: "Con dũng cảm lắm.", pronunciation_focus: ["being", "brave"] },
    ],
    cultural_notes_vi:
      "Wong-Baker FACES Pain Scale là chuẩn cho trẻ 3+ tuổi ở Mỹ. Trẻ em nhỏ hơn dùng FLACC scale (quan sát mặt, chân, hoạt động, khóc, dỗ). Đừng bao giờ ép trẻ chọn — đợi nhẹ nhàng.",
    tip_advice_vi:
      "Đừng nói 'don't cry' hay 'big girls don't cry' — câu này cấm tuyệt đối. Trẻ em phải được phép biểu hiện. Câu 'you're being so brave' tích cực mà không phủ nhận cảm xúc.",
  },
  {
    id: "healthcare_pain_dementia",
    category: "pain_assessment",
    title_vi: "Đánh giá đau ở bệnh nhân sa sút trí tuệ",
    title_en: "Pain assessment with dementia patients",
    sentences: [
      { en: "I notice you're holding your side — are you sore there?", vi: "Em thấy bác đang giữ bên hông — có đau không ạ?", pronunciation_focus: ["holding", "sore"] },
      { en: "Show me where it hurts with your hand.", vi: "Bác chỉ tay vào chỗ đau giúp con.", pronunciation_focus: ["show", "hand"] },
      { en: "I'm here. Take your time.", vi: "Con ở đây. Bác cứ thong thả.", pronunciation_focus: ["here", "take"] },
      { en: "Squeeze my hand if it hurts when I touch.", vi: "Khi con chạm thấy đau, bác bóp tay con.", pronunciation_focus: ["squeeze", "touch"] },
    ],
    cultural_notes_vi:
      "Bệnh nhân sa sút trí tuệ không trả lời thang đau bình thường — quan sát non-verbal: nhăn mặt, giữ vùng đau, không ăn, kêu rên, giận dữ thay đổi. PAINAD scale là công cụ chính. Tone giọng nhẹ, chậm.",
    tip_advice_vi:
      "Đau không được chăm sóc ở bệnh nhân dementia là vấn đề lớn ở Mỹ — họ không kêu được. Quan sát thay đổi hành vi và BÁO RN. Ghi 'patient grimacing when repositioned' — quan sát cụ thể.",
  },
];

// ── 3. Medication communication (10) ──────────────────────────────────────

const MEDICATION: HealthcareLesson[] = [
  {
    id: "healthcare_med_list_current",
    category: "medication_communication",
    title_vi: "Hỏi thuốc đang dùng",
    title_en: "Asking about current medications",
    sentences: [
      { en: "What medications are you currently taking?", vi: "Anh/chị đang dùng thuốc gì ạ?", pronunciation_focus: ["medications", "currently"] },
      { en: "Including over-the-counter and supplements?", vi: "Cả thuốc không kê toa và thực phẩm bổ sung?", pronunciation_focus: ["over-the-counter", "supplements"] },
      { en: "Do you have your bottles or a list?", vi: "Anh/chị có chai thuốc hay danh sách không ạ?", pronunciation_focus: ["bottles", "list"] },
      { en: "Take your time — I'll write them down.", vi: "Anh/chị thong thả, em ghi xuống.", pronunciation_focus: ["take", "down"] },
    ],
    cultural_notes_vi:
      "'Medication reconciliation' là yêu cầu pháp lý ở mỗi lần khám tại Mỹ — phải hỏi mỗi lần, kể cả với bệnh nhân quen. Bệnh nhân Việt hay quên kể supplements (thảo dược, vitamin) — phải hỏi cụ thể.",
    tip_advice_vi:
      "Yêu cầu xem CHAI thuốc thay vì nghe đọc tên — bệnh nhân hay nhầm. Chụp ảnh nếu được phép. 'Tylenol' và 'Tramadol' nghe gần giống nhưng KHÁC hoàn toàn — luôn xác minh.",
  },
  {
    id: "healthcare_med_repeat_back",
    category: "medication_communication",
    title_vi: "Lặp lại tên thuốc",
    title_en: "Repeating medication names back",
    sentences: [
      { en: "Let me repeat that back — you take Lisinopril every morning?", vi: "Em nhắc lại — anh/chị uống Lisinopril mỗi sáng?", pronunciation_focus: ["repeat", "morning"] },
      { en: "Can you spell that for me?", vi: "Anh/chị đánh vần giúp em được không?", pronunciation_focus: ["spell"] },
      { en: "I want to make sure I have it right.", vi: "Em muốn chắc chắn ghi đúng.", pronunciation_focus: ["sure", "right"] },
      { en: "Does it sound like the one on your bottle?", vi: "Có giống tên trên chai không ạ?", pronunciation_focus: ["sound", "bottle"] },
    ],
    cultural_notes_vi:
      "'Read-back' và 'repeat-back' là tiêu chuẩn an toàn của The Joint Commission ở mọi bệnh viện Mỹ. Lặp lại tên thuốc + dosage TỪNG CHỮ MỘT là kỹ năng cứu mạng. Đừng ngại làm chậm — chậm + đúng thắng nhanh + sai.",
    tip_advice_vi:
      "Nếu không nghe rõ tên thuốc, KHÔNG đoán — yêu cầu bệnh nhân đánh vần hoặc đưa chai. Sai một chữ cái = thuốc khác = nguy hiểm chết người. 'Hydroxyzine' vs 'Hydralazine' khác nhau hoàn toàn.",
  },
  {
    id: "healthcare_med_allergy",
    category: "medication_communication",
    title_vi: "Hỏi dị ứng thuốc",
    title_en: "Asking about drug allergies",
    sentences: [
      { en: "Do you have any drug allergies?", vi: "Anh/chị có dị ứng thuốc không ạ?", pronunciation_focus: ["drug", "allergies"] },
      { en: "What happens when you take it?", vi: "Khi dùng thì xảy ra gì ạ?", pronunciation_focus: ["happens", "take"] },
      { en: "Is it a true allergy or a side effect?", vi: "Là dị ứng thật hay tác dụng phụ ạ?", pronunciation_focus: ["true", "side"] },
      { en: "I'll mark this clearly in your chart.", vi: "Em đánh dấu rõ trong hồ sơ.", pronunciation_focus: ["mark", "chart"] },
    ],
    cultural_notes_vi:
      "Phân biệt 'allergy' (dị ứng) vs 'side effect' (tác dụng phụ) là kỹ năng quan trọng. Bệnh nhân hay nhầm 'dạ dày khó chịu' = 'allergy'. Hỏi rõ: rash, swelling, breathing problem = allergy. Nausea = thường là side effect.",
    tip_advice_vi:
      "Dị ứng thuốc trong hồ sơ là cảnh báo cứu mạng — bệnh viện check trước mỗi đơn thuốc. Ghi sai = bệnh nhân không dùng được thuốc cần thiết HOẶC dùng thuốc gây phản ứng nặng. Verify, verify, verify.",
  },
  {
    id: "healthcare_med_when_to_take",
    category: "medication_communication",
    title_vi: "Hướng dẫn thời gian uống thuốc",
    title_en: "Communicating when to take medications",
    sentences: [
      { en: "The doctor wants you to take this with food.", vi: "Bác sĩ dặn uống cùng đồ ăn.", pronunciation_focus: ["wants", "food"] },
      { en: "Once a day in the morning.", vi: "Một lần mỗi ngày, vào buổi sáng.", pronunciation_focus: ["once", "morning"] },
      { en: "If you forget a dose, just skip it — don't double up.", vi: "Quên một lần thì bỏ qua, không uống bù gấp đôi.", pronunciation_focus: ["forget", "double"] },
      { en: "Any questions, the doctor or pharmacist can explain.", vi: "Câu hỏi gì thì bác sĩ hoặc dược sĩ giải thích.", pronunciation_focus: ["questions", "pharmacist"] },
    ],
    cultural_notes_vi:
      "Truyền đạt instructions của BS/dược sĩ — KHÔNG tự đưa ra hướng dẫn dùng thuốc. Đó là vai trò của RN/MD/Pharmacist. Câu 'the doctor wants you to' đặt trách nhiệm đúng người. Bệnh nhân hỏi 'why' → chuyển hỏi BS.",
    tip_advice_vi:
      "Không bao giờ đưa hướng dẫn liều lượng tự đoán. Nếu không chắc, nói 'let me check with the nurse'. Scope of practice rõ ràng — overstep = vi phạm pháp lý + có thể mất việc.",
  },
  {
    id: "healthcare_med_side_effect_acknowledge",
    category: "medication_communication",
    title_vi: "Ghi nhận tác dụng phụ",
    title_en: "Acknowledging a reported side effect",
    sentences: [
      { en: "Thanks for telling me — I'll let the doctor know right away.", vi: "Cảm ơn anh/chị nói — em báo bác sĩ ngay.", pronunciation_focus: ["telling", "right"] },
      { en: "When did it start?", vi: "Bắt đầu khi nào ạ?", pronunciation_focus: ["when", "start"] },
      { en: "Is it bothering you a lot?", vi: "Có làm phiền nhiều không ạ?", pronunciation_focus: ["bothering", "lot"] },
      { en: "Don't stop the medication on your own — wait to talk to the doctor.", vi: "Anh/chị đừng tự ngưng thuốc — đợi nói chuyện với bác sĩ.", pronunciation_focus: ["stop", "wait"] },
    ],
    cultural_notes_vi:
      "Bệnh nhân Mỹ thường tự ngưng thuốc khi gặp side effect — đó là vấn đề an toàn lớn. Nói rõ 'don't stop on your own — talk to the doctor first' là điều CDC khuyến cáo. Ngưng đột ngột một số thuốc gây nguy hiểm.",
    tip_advice_vi:
      "Khi bệnh nhân báo side effect mới, BÁO RN/MD trước cuối ca — đặc biệt phát ban, khó thở, sưng. Đừng đợi 'next visit'. Ghi rõ thời gian, triệu chứng, thuốc nghi ngờ.",
  },
  {
    id: "healthcare_med_brand_vs_generic",
    category: "medication_communication",
    title_vi: "Tên thương hiệu vs tên generic",
    title_en: "Brand vs generic names",
    sentences: [
      { en: "Tylenol and acetaminophen are the same thing — just different names.", vi: "Tylenol và acetaminophen là cùng một thuốc — chỉ khác tên.", pronunciation_focus: ["Tylenol", "acetaminophen"] },
      { en: "Generic is the chemical name; brand is the company's name.", vi: "Generic là tên hoá học; brand là tên công ty.", pronunciation_focus: ["generic", "company"] },
      { en: "Pharmacy may switch to generic to save you money.", vi: "Nhà thuốc có thể đổi sang generic để tiết kiệm tiền.", pronunciation_focus: ["pharmacy", "money"] },
      { en: "Same medicine, lower cost.", vi: "Cùng thuốc, giá thấp hơn.", pronunciation_focus: ["same", "cost"] },
    ],
    cultural_notes_vi:
      "Bệnh nhân Mỹ rất quen với generic substitution — luật California và nhiều bang yêu cầu. Bệnh nhân Việt lớn tuổi hay lo 'hàng giả' khi thấy tên khác. Giải thích nhẹ: same active ingredient, different label.",
    tip_advice_vi:
      "Học cặp tên brand-generic phổ biến: Tylenol/acetaminophen, Advil/ibuprofen, Lipitor/atorvastatin. Khi bệnh nhân hỏi 'is this the same?' — đáp được tự tin. Không chắc → hỏi pharmacist.",
  },
  {
    id: "healthcare_med_pharmacy_pickup",
    category: "medication_communication",
    title_vi: "Hướng dẫn đến nhà thuốc",
    title_en: "Directing to the pharmacy",
    sentences: [
      { en: "We've sent the prescription to your usual pharmacy.", vi: "Bệnh viện đã gửi đơn đến nhà thuốc anh/chị thường ghé.", pronunciation_focus: ["sent", "usual"] },
      { en: "It should be ready in about an hour.", vi: "Khoảng một tiếng nữa sẵn sàng.", pronunciation_focus: ["ready", "hour"] },
      { en: "Bring your insurance card.", vi: "Anh/chị mang theo thẻ bảo hiểm.", pronunciation_focus: ["insurance", "card"] },
      { en: "If it's not ready, call us back.", vi: "Nếu chưa sẵn, anh/chị gọi lại em ạ.", pronunciation_focus: ["ready", "back"] },
    ],
    cultural_notes_vi:
      "E-prescriptions là tiêu chuẩn ở Mỹ — đơn thuốc gửi điện tử. Bệnh nhân Việt lớn tuổi đôi khi muốn cầm giấy — giải thích 'pharmacy already has it' để tránh hoảng. Insurance card là thẻ bảo hiểm y tế.",
    tip_advice_vi:
      "Nếu bệnh nhân không có insurance, KHÔNG khuyên 'skip the medication' — chuyển tới social worker hoặc patient assistance program. Mỗi bệnh viện có phòng giúp đỡ chi phí.",
  },
  {
    id: "healthcare_med_swallowing",
    category: "medication_communication",
    title_vi: "Bệnh nhân khó nuốt",
    title_en: "Patient has trouble swallowing pills",
    sentences: [
      { en: "Some patients have trouble swallowing pills — is that you?", vi: "Có bệnh nhân khó nuốt viên — anh/chị có vậy không?", pronunciation_focus: ["trouble", "swallowing"] },
      { en: "I'll let the doctor know — there may be a liquid form.", vi: "Em báo bác sĩ — có thể có dạng nước.", pronunciation_focus: ["doctor", "liquid"] },
      { en: "Don't crush a pill on your own — some can't be crushed.", vi: "Đừng tự nghiền viên — có loại không nghiền được.", pronunciation_focus: ["crush", "own"] },
      { en: "We can help you find a way that works.", vi: "Mình tìm cách phù hợp được ạ.", pronunciation_focus: ["help", "way"] },
    ],
    cultural_notes_vi:
      "Khó nuốt thuốc rất phổ biến với người lớn tuổi và bệnh nhân hậu đột quỵ. KHÔNG bao giờ tự nghiền viên — nhiều thuốc 'extended release' nghiền vào sẽ release toàn bộ liều cùng lúc = nguy hiểm. Pharmacist quyết định.",
    tip_advice_vi:
      "Nếu bệnh nhân tâm sự 'I crush my pills', báo MD/Pharmacist NGAY — có thể đang dùng sai cách. Ghi chú trong hồ sơ. Đây là điểm escalation, không bỏ qua.",
  },
  {
    id: "healthcare_med_double_check",
    category: "medication_communication",
    title_vi: "Xác minh trước khi đưa thuốc",
    title_en: "Verifying before giving medication",
    sentences: [
      { en: "Can you tell me your full name and date of birth?", vi: "Anh/chị cho em xin họ tên đầy đủ và ngày sinh?", pronunciation_focus: ["full", "birth"] },
      { en: "I'm checking your wristband.", vi: "Em kiểm tra vòng tay.", pronunciation_focus: ["checking", "wristband"] },
      { en: "Two patient identifiers — that's our safety check.", vi: "Hai dấu hiệu nhận dạng — quy trình an toàn.", pronunciation_focus: ["two", "safety"] },
      { en: "This is the medication you and the doctor talked about.", vi: "Đây là thuốc anh/chị và bác sĩ đã trao đổi.", pronunciation_focus: ["medication", "talked"] },
    ],
    cultural_notes_vi:
      "Two-patient-identifier rule là tiêu chuẩn The Joint Commission ở mọi bệnh viện Mỹ. PHẢI hỏi tên + DOB trước khi đưa thuốc, KHÔNG ngoại lệ. Bệnh nhân quen có thể bực — giải thích nhẹ 'safety check' và tiếp tục.",
    tip_advice_vi:
      "Nếu bệnh nhân nói 'you know me' — vẫn hỏi. Một sai sót thuốc do bỏ qua identifier = nguy hiểm chết người + vi phạm pháp lý. Quy trình bảo vệ cả bạn và bệnh nhân.",
  },
  {
    id: "healthcare_med_refill_question",
    category: "medication_communication",
    title_vi: "Câu hỏi về thuốc bổ sung",
    title_en: "Refill questions",
    sentences: [
      { en: "Refill requests go through the doctor's office.", vi: "Yêu cầu refill qua văn phòng bác sĩ.", pronunciation_focus: ["refill", "office"] },
      { en: "Call at least three days before you run out.", vi: "Gọi trước khi hết ít nhất ba ngày.", pronunciation_focus: ["three", "out"] },
      { en: "Or your pharmacy can request it for you.", vi: "Hoặc nhà thuốc có thể yêu cầu giúp.", pronunciation_focus: ["pharmacy", "request"] },
      { en: "I can write that down for you.", vi: "Em ghi xuống cho anh/chị.", pronunciation_focus: ["write", "down"] },
    ],
    cultural_notes_vi:
      "Refill timing là vấn đề lớn — thuốc tim mạch / tiểu đường ngưng đột ngột nguy hiểm. Bệnh nhân Mỹ quen gọi nhà thuốc trước, nhà thuốc fax đến BS. Bệnh nhân Việt đôi khi đợi đến giọt cuối — giải thích 'three days ahead'. Bệnh nhân không có refill (đơn hết, BS đi nghỉ) là tình huống thường — chuyển tới on-call provider hoặc nurse line, KHÔNG tự đưa ra giải pháp.",
    tip_advice_vi:
      "Nếu bệnh nhân nói 'I haven't taken my medicine in a week' (đặc biệt blood pressure, blood thinner, insulin) — báo RN/MD NGAY. Một số thuốc ngưng = đột quỵ, hôn mê. Đây là điểm escalation rõ ràng.",
  },
];

// ── 4. Pre/post-procedure communication (5) ──────────────────────────────

const PROCEDURE: HealthcareLesson[] = [
  {
    id: "healthcare_proc_explain",
    category: "procedure_communication",
    title_vi: "Giải thích thủ thuật",
    title_en: "Explaining a procedure",
    sentences: [
      { en: "The doctor will explain the procedure in detail.", vi: "Bác sĩ sẽ giải thích chi tiết thủ thuật.", pronunciation_focus: ["procedure", "detail"] },
      { en: "I'll get you ready for it.", vi: "Em chuẩn bị anh/chị cho thủ thuật.", pronunciation_focus: ["get", "ready"] },
      { en: "Any questions, save them for the doctor.", vi: "Câu hỏi gì để hỏi bác sĩ.", pronunciation_focus: ["questions", "save"] },
      { en: "I'll be right here with you.", vi: "Em ở đây với anh/chị.", pronunciation_focus: ["right", "here"] },
    ],
    cultural_notes_vi:
      "Giải thích chi tiết thủ thuật là vai trò của BS — informed consent là pháp lý. Bạn chuẩn bị bệnh nhân, không giải thích procedure. Câu 'doctor will explain' đặt vai trò đúng. Nếu bệnh nhân vẫn hỏi, gọi RN/MD.",
    tip_advice_vi:
      "Đừng nói 'don't worry, it's easy' — nếu có biến chứng, câu này phản pháo bạn. Nói 'doctor will explain everything, including risks' — chính xác và an toàn pháp lý.",
  },
  {
    id: "healthcare_proc_consent",
    category: "procedure_communication",
    title_vi: "Đồng ý có thông tin",
    title_en: "Confirming informed consent",
    sentences: [
      { en: "Did the doctor go over the consent form with you?", vi: "Bác sĩ đã giải thích giấy đồng ý chưa ạ?", pronunciation_focus: ["consent", "form"] },
      { en: "Do you have questions before signing?", vi: "Anh/chị có câu hỏi gì trước khi ký không?", pronunciation_focus: ["questions", "signing"] },
      { en: "I can call the doctor back if anything's unclear.", vi: "Em gọi lại bác sĩ nếu có gì chưa rõ.", pronunciation_focus: ["call", "unclear"] },
      { en: "Take all the time you need.", vi: "Anh/chị thong thả ạ.", pronunciation_focus: ["take", "need"] },
    ],
    cultural_notes_vi:
      "Informed consent là pháp lý nghiêm ngặt ở Mỹ. Nếu bệnh nhân không hiểu / không chắc, KHÔNG ký, KHÔNG ép. Gọi BS giải thích lại. Bệnh nhân Việt đôi khi ký vì 'lễ phép' không hiểu — phải xác nhận hiểu thật sự.",
    tip_advice_vi:
      "Nếu bệnh nhân không hiểu tiếng Anh đủ, YÊU CẦU medical interpreter — đó là quyền pháp lý theo Title VI Civil Rights Act. KHÔNG dùng người nhà làm interpreter cho informed consent — vi phạm bệnh viện.",
  },
  {
    id: "healthcare_proc_npo",
    category: "procedure_communication",
    title_vi: "Hướng dẫn nhịn ăn",
    title_en: "NPO instructions",
    sentences: [
      { en: "Nothing to eat or drink after midnight.", vi: "Không ăn uống sau nửa đêm.", pronunciation_focus: ["eat", "midnight"] },
      { en: "Even water — that includes water.", vi: "Kể cả nước — bao gồm cả nước.", pronunciation_focus: ["even", "water"] },
      { en: "Take your morning medications with a sip if the doctor said okay.", vi: "Uống thuốc sáng với một ngụm nhỏ nếu bác sĩ cho phép.", pronunciation_focus: ["morning", "sip"] },
      { en: "If you eat by mistake, call us — we may have to reschedule.", vi: "Lỡ ăn thì gọi em — có thể phải dời lịch.", pronunciation_focus: ["mistake", "reschedule"] },
    ],
    cultural_notes_vi:
      "NPO (nothing per oral) là quy tắc an toàn an thần. Bệnh nhân ăn rồi = phải dời lịch để tránh aspiration trong gây mê. Nói RÕ 'including water' — bệnh nhân hay tưởng nước được phép.",
    tip_advice_vi:
      "Nếu bệnh nhân vô tình ăn / uống, BÁO TEAM NGAY. Đừng giấu vì sợ dời lịch. Aspiration trong gây mê có thể chết người. Báo trung thực = bảo vệ bệnh nhân + bảo vệ bạn pháp lý.",
  },
  {
    id: "healthcare_proc_recovery",
    category: "procedure_communication",
    title_vi: "Hướng dẫn hồi phục",
    title_en: "Recovery instructions",
    sentences: [
      { en: "The discharge papers explain what to expect at home.", vi: "Giấy xuất viện giải thích những gì sẽ xảy ra tại nhà.", pronunciation_focus: ["discharge", "expect"] },
      { en: "Watch for any signs the doctor wrote down.", vi: "Để ý dấu hiệu bác sĩ ghi.", pronunciation_focus: ["watch", "signs"] },
      { en: "Call the office if you have questions later.", vi: "Gọi văn phòng bác sĩ nếu có câu hỏi sau.", pronunciation_focus: ["call", "later"] },
      { en: "Have someone drive you home — no driving today.", vi: "Có người chở về — không tự lái hôm nay.", pronunciation_focus: ["drive", "today"] },
    ],
    cultural_notes_vi:
      "Discharge papers là tài liệu pháp lý — bệnh nhân ký xác nhận hiểu. Đọc to những điểm quan trọng (warning signs, follow-up). 'No driving' sau gây mê là quy tắc cứng — không lái tới 24h, không quyết định pháp lý quan trọng.",
    tip_advice_vi:
      "Nếu bệnh nhân định tự lái về sau gây mê, BÁO RN NGAY. Một số bệnh viện không cho xuất viện nếu không có người đón. Đừng để bệnh nhân ra cửa rồi mới phát hiện.",
  },
  {
    id: "healthcare_proc_follow_up",
    category: "procedure_communication",
    title_vi: "Hẹn tái khám",
    title_en: "Scheduling the follow-up",
    sentences: [
      { en: "The doctor wants to see you back in two weeks.", vi: "Bác sĩ muốn tái khám sau hai tuần.", pronunciation_focus: ["wants", "weeks"] },
      { en: "Front desk will help you schedule.", vi: "Lễ tân sẽ giúp đặt lịch.", pronunciation_focus: ["front", "schedule"] },
      { en: "Bring this paper with you.", vi: "Anh/chị mang giấy này theo.", pronunciation_focus: ["bring", "paper"] },
      { en: "If anything changes before then, call right away.", vi: "Có gì thay đổi trước đó thì gọi ngay.", pronunciation_focus: ["changes", "right"] },
    ],
    cultural_notes_vi:
      "Follow-up appointments là tiêu chuẩn — bệnh nhân Việt đôi khi không tới vì 'thấy đỡ rồi'. Giải thích nhẹ: bác sĩ cần check tiến triển, không phải lãng phí. Đặt lịch NGAY tại văn phòng — tỷ lệ tới cao hơn.",
    tip_advice_vi:
      "Cho bệnh nhân biết 'red flag' — triệu chứng buộc gọi sớm trước follow-up. Rõ ràng và cụ thể: sốt, chảy máu, đau tăng. Tránh chung chung 'if you don't feel well'.",
  },
];

// ── 5. Elder / dementia care (10) ────────────────────────────────────────

const ELDER_CARE: HealthcareLesson[] = [
  {
    id: "healthcare_elder_introduce",
    category: "elder_dementia_care",
    title_vi: "Giới thiệu bản thân với bệnh nhân lớn tuổi",
    title_en: "Introducing yourself to an elderly patient",
    sentences: [
      { en: "Good morning, Mr. Davis. I'm Linh, your aide today.", vi: "Chào buổi sáng ông Davis. Con là Linh, người chăm hôm nay.", pronunciation_focus: ["morning", "aide"] },
      { en: "Is it okay if I call you Mr. Davis, or do you prefer something else?", vi: "Con gọi ông Davis được không, hay ông thích cách khác ạ?", pronunciation_focus: ["okay", "prefer"] },
      { en: "I'll be helping you with breakfast and getting dressed.", vi: "Con giúp ông ăn sáng và mặc đồ.", pronunciation_focus: ["helping", "dressed"] },
      { en: "Just let me know what you need.", vi: "Cần gì ông cứ nói con.", pronunciation_focus: ["let", "need"] },
    ],
    cultural_notes_vi:
      "Người Mỹ lớn tuổi quen với 'Mr./Mrs. + last name' — không gọi first name trừ khi mời. Một số người tự thân thiện 'just call me Bob'. Lắng nghe cách họ thích. Đừng tự gọi tên thân — đó là thiếu lễ độ.",
    tip_advice_vi:
      "Tự giới thiệu MỖI ca, ngay cả với bệnh nhân quen — bệnh nhân dementia không nhớ. Bệnh nhân Mỹ lớn tuổi đánh giá rất cao sự lễ độ — tip thầm trong tâm hồn họ là 'this person respects me'.",
  },
  {
    id: "healthcare_elder_bathing",
    category: "elder_dementia_care",
    title_vi: "Hỗ trợ tắm rửa",
    title_en: "Assisting with bathing",
    sentences: [
      { en: "Time for your bath — okay if I help?", vi: "Tới giờ tắm — con giúp được không ạ?", pronunciation_focus: ["bath", "help"] },
      { en: "I'll keep you covered as much as possible.", vi: "Con che kín nhất có thể.", pronunciation_focus: ["keep", "covered"] },
      { en: "Tell me if the water's too hot or cold.", vi: "Nước nóng hay lạnh quá ông nói con nhé.", pronunciation_focus: ["water", "hot"] },
      { en: "Let me know if you need a break.", vi: "Cần nghỉ thì ông nói con.", pronunciation_focus: ["break"] },
    ],
    cultural_notes_vi:
      "Modesty (sự kín đáo) là vấn đề lớn ở bệnh nhân Mỹ lớn tuổi, đặc biệt phụ nữ và bệnh nhân tôn giáo. Luôn xin phép, luôn che. Bệnh nhân Việt cũng thường ngại — văn hoá tương đồng. Nhanh, chuyên nghiệp, kín đáo.",
    tip_advice_vi:
      "Nếu bệnh nhân từ chối tắm, KHÔNG ép — báo RN. Có thể là dấu hiệu trầm cảm, đau, hay thay đổi nhận thức. Document refusal trung thực; never force.",
  },
  {
    id: "healthcare_elder_meal",
    category: "elder_dementia_care",
    title_vi: "Hỗ trợ ăn uống",
    title_en: "Assisting with meals",
    sentences: [
      { en: "Here's your breakfast — eggs and toast today.", vi: "Bữa sáng đây — trứng và bánh mì nướng hôm nay.", pronunciation_focus: ["breakfast", "toast"] },
      { en: "Do you want me to cut it for you?", vi: "Con cắt nhỏ giúp ông nhé?", pronunciation_focus: ["cut", "you"] },
      { en: "Take small bites — no rush.", vi: "Ăn từng miếng nhỏ — không vội.", pronunciation_focus: ["small", "rush"] },
      { en: "Want some water with that?", vi: "Uống chút nước nhé?", pronunciation_focus: ["water", "with"] },
    ],
    cultural_notes_vi:
      "Bệnh nhân lớn tuổi ăn chậm — tốc độ là nguy cơ aspiration. KHÔNG bao giờ ép tốc độ. Cắt nhỏ là phép tôn trọng, không phải hạ thấp. Bệnh nhân khó nuốt = báo RN, có thể cần thay đổi diet.",
    tip_advice_vi:
      "Aspiration (hít thức ăn vào phổi) là nguyên nhân chết hàng đầu ở viện dưỡng lão. Quan sát ho lúc nuốt, giọng 'wet' sau ăn — báo RN ngay. Đừng cho ăn khi bệnh nhân buồn ngủ.",
  },
  {
    id: "healthcare_elder_mobility",
    category: "elder_dementia_care",
    title_vi: "Hỗ trợ di chuyển",
    title_en: "Mobility assistance",
    sentences: [
      { en: "Let's stand up slowly — give it a moment.", vi: "Mình đứng từ từ — đợi một chút.", pronunciation_focus: ["slowly", "moment"] },
      { en: "Hold onto my arm.", vi: "Bám vào tay con.", pronunciation_focus: ["hold", "arm"] },
      { en: "Step at your own pace.", vi: "Bước theo nhịp của ông.", pronunciation_focus: ["step", "pace"] },
      { en: "We'll stop if you feel dizzy.", vi: "Chóng mặt thì mình dừng.", pronunciation_focus: ["stop", "dizzy"] },
    ],
    cultural_notes_vi:
      "Té ngã là nguyên nhân thương tích #1 ở viện dưỡng lão Mỹ. Đứng từ từ tránh orthostatic hypotension (huyết áp tụt khi đứng). Bệnh nhân hồi sức gãy hông có tỷ lệ tử vong 1 năm tới 30% — phòng ngừa té là cứu mạng.",
    tip_advice_vi:
      "Dùng gait belt khi di chuyển bệnh nhân yếu — đó là quy chuẩn an toàn cho cả hai. Đừng bao giờ kéo bệnh nhân bằng cánh tay (rotator cuff injury phổ biến). Nếu cảm thấy không an toàn, gọi thêm người.",
  },
  {
    id: "healthcare_elder_dementia_redirect",
    category: "elder_dementia_care",
    title_vi: "Hướng dẫn chuyển hướng (dementia)",
    title_en: "Redirecting a dementia patient",
    sentences: [
      { en: "I see you're worried — let's sit and have some tea.", vi: "Con thấy bà lo — mình ngồi uống trà nhé.", pronunciation_focus: ["worried", "tea"] },
      { en: "Tell me about your family — do you have grandchildren?", vi: "Bà kể về gia đình — có cháu chưa ạ?", pronunciation_focus: ["family", "grandchildren"] },
      { en: "That's such a nice memory.", vi: "Đó là kỷ niệm hay.", pronunciation_focus: ["nice", "memory"] },
      { en: "I'm right here with you.", vi: "Con ở đây với bà.", pronunciation_focus: ["right", "here"] },
    ],
    cultural_notes_vi:
      "Validation therapy: KHÔNG sửa bệnh nhân dementia ('your husband died ten years ago'). Đi theo dòng cảm xúc của họ ('tell me about him'). Sửa = gây trauma mới mỗi lần. Redirect nhẹ nhàng tới chủ đề an toàn.",
    tip_advice_vi:
      "Khi bệnh nhân dementia kích động (sundowning vào chiều), môi trường yên + giọng nhẹ + chuyển hướng. KHÔNG bao giờ tranh luận về thực tại. 'Tea, music, walk' là ba công cụ chuyển hướng hiệu quả nhất.",
  },
  {
    id: "healthcare_elder_dignity",
    category: "elder_dementia_care",
    title_vi: "Bảo vệ phẩm giá",
    title_en: "Protecting dignity",
    sentences: [
      { en: "Let me close the door for some privacy.", vi: "Con đóng cửa cho riêng tư.", pronunciation_focus: ["close", "privacy"] },
      { en: "Would you like to put on your own shirt, or do you want help?", vi: "Bà tự mặc áo hay cần con giúp ạ?", pronunciation_focus: ["own", "help"] },
      { en: "You can choose what you wear today.", vi: "Bà chọn đồ hôm nay.", pronunciation_focus: ["choose", "wear"] },
      { en: "I'll wait while you finish.", vi: "Con đợi ngoài khi bà xong.", pronunciation_focus: ["wait", "finish"] },
    ],
    cultural_notes_vi:
      "Phẩm giá ('dignity') là khái niệm trung tâm của viện dưỡng lão Mỹ (CMS quality measures). Cho bệnh nhân lựa chọn — kể cả nhỏ — bảo vệ ý chí cá nhân. Bệnh nhân không có quyền lựa chọn = chất lượng sống giảm.",
    tip_advice_vi:
      "Đóng cửa, kéo rèm, gọi tên đúng cách. Không bao giờ thay đồ bệnh nhân ở phòng chung. Không bao giờ nói về cơ thể bệnh nhân với người khác trước mặt họ ('she's incontinent today'). Đó là vi phạm dignity.",
  },
  {
    id: "healthcare_elder_toilet",
    category: "elder_dementia_care",
    title_vi: "Hỗ trợ vệ sinh",
    title_en: "Toileting assistance",
    sentences: [
      { en: "Need to use the bathroom?", vi: "Bà cần đi vệ sinh không ạ?", pronunciation_focus: ["bathroom"] },
      { en: "I'll wait right outside the door.", vi: "Con đợi ngay ngoài cửa.", pronunciation_focus: ["wait", "outside"] },
      { en: "Pull the cord if you need me.", vi: "Kéo dây nếu cần con.", pronunciation_focus: ["pull", "cord"] },
      { en: "No rush at all.", vi: "Không vội đâu ạ.", pronunciation_focus: ["rush"] },
    ],
    cultural_notes_vi:
      "Toileting là tình huống nhạy cảm phẩm giá nhất. 'No rush' giảm áp lực, nhưng quy tắc an toàn 5 phút phải có mặt — bệnh nhân té trong toilet phổ biến. Cord là sợi dây gọi (call cord) treo trong phòng tắm.",
    tip_advice_vi:
      "Quan sát chu kỳ tự đi vệ sinh để phòng accidents (toilet schedule). Bệnh nhân incontinent = báo RN, có thể UTI hoặc thay đổi y lệnh. Đừng đợi 'one time' — pattern là quan trọng.",
  },
  {
    id: "healthcare_elder_visitor",
    category: "elder_dementia_care",
    title_vi: "Khách thăm bệnh",
    title_en: "Greeting visitors",
    sentences: [
      { en: "Hi, are you here to see Mrs. Tran?", vi: "Chào, anh/chị đến thăm bà Trần ạ?", pronunciation_focus: ["here", "see"] },
      { en: "She's resting right now — give me a minute to check.", vi: "Bà đang nghỉ — để con kiểm tra.", pronunciation_focus: ["resting", "check"] },
      { en: "She's been having a good day.", vi: "Hôm nay bà khoẻ ạ.", pronunciation_focus: ["good", "day"] },
      { en: "Stay as long as you'd like.", vi: "Anh/chị thăm bao lâu cũng được.", pronunciation_focus: ["stay", "like"] },
    ],
    cultural_notes_vi:
      "HIPAA: KHÔNG xác nhận bệnh nhân ở viện dưỡng lão với người lạ qua điện thoại. Trực tiếp đến, được phép xác nhận. Đừng kể tình trạng y tế chi tiết — chỉ 'good day / quiet day' chung. Để bệnh nhân tự kể.",
    tip_advice_vi:
      "Nếu khách lạ tới mà bệnh nhân không nhận ra (dementia), KIỂM TRA visitor list. Một số bệnh nhân có 'do not visit' list pháp lý. Báo charge nurse nếu không chắc — không phải quyết định một mình.",
  },
  {
    id: "healthcare_elder_complaint",
    category: "elder_dementia_care",
    title_vi: "Khi bệnh nhân phàn nàn",
    title_en: "When the patient complains",
    sentences: [
      { en: "I hear you — that's frustrating.", vi: "Con hiểu — chuyện đó khó chịu thật.", pronunciation_focus: ["hear", "frustrating"] },
      { en: "Tell me more about what happened.", vi: "Bà kể con thêm chuyện đó.", pronunciation_focus: ["tell", "happened"] },
      { en: "I'll let the nurse know right away.", vi: "Con báo y tá ngay.", pronunciation_focus: ["nurse", "right"] },
      { en: "Thanks for telling me.", vi: "Cảm ơn bà đã nói con.", pronunciation_focus: ["thanks", "telling"] },
    ],
    cultural_notes_vi:
      "Lắng nghe trước, hành động sau. KHÔNG bao biện ('the staff is busy'). KHÔNG nói 'are you sure that happened?' — bệnh nhân dementia đôi khi nhầm, nhưng cảm xúc là thật. Validate cảm xúc, escalate sự việc.",
    tip_advice_vi:
      "Phàn nàn về abuse / neglect = báo charge nurse + ghi rõ. Mandatory reporting laws bảo vệ bạn pháp lý nếu báo trung thực. KHÔNG điều tra một mình. Báo cáo + ghi chép = bảo vệ bệnh nhân và bản thân.",
  },
  {
    id: "healthcare_elder_end_of_shift",
    category: "elder_dementia_care",
    title_vi: "Cuối ca chuyển giao",
    title_en: "End-of-shift handoff",
    sentences: [
      { en: "Mrs. Tran ate seventy-five percent of breakfast.", vi: "Bà Trần ăn 75% bữa sáng.", pronunciation_focus: ["seventy-five", "percent"] },
      { en: "Vital signs are in the chart, all within normal range.", vi: "Dấu hiệu sinh tồn trong hồ sơ, tất cả trong mức bình thường.", pronunciation_focus: ["chart", "range"] },
      { en: "She mentioned mild back pain — I told the RN.", vi: "Bà có nói đau lưng nhẹ — con đã báo y tá.", pronunciation_focus: ["mild", "RN"] },
      { en: "Daughter is visiting at three.", vi: "Con gái thăm lúc ba giờ.", pronunciation_focus: ["daughter", "three"] },
    ],
    cultural_notes_vi:
      "Handoff (chuyển ca) là điểm rủi ro cao nhất ở bệnh viện Mỹ — sai sót truyền thông gây 80% sentinel events. Chuẩn SBAR: Situation, Background, Assessment, Recommendation. Cụ thể, ngắn gọn, không phán xét.",
    tip_advice_vi:
      "Báo CHÍNH XÁC số (75% breakfast, 200ml urine) thay vì 'ate okay'. Số cụ thể giúp ca sau theo dõi xu hướng. Mơ hồ = thông tin mất. Ghi cũng phải cụ thể như báo miệng.",
  },
];

// ── 6. Emergency communication (5) ───────────────────────────────────────

const EMERGENCY: HealthcareLesson[] = [
  {
    id: "healthcare_emergency_call_911",
    category: "emergency_communication",
    title_vi: "Gọi 911",
    title_en: "Calling 911",
    sentences: [
      { en: "I'm calling 911 — this is an emergency.", vi: "Con gọi 911 — đây là khẩn cấp.", pronunciation_focus: ["calling", "emergency"] },
      { en: "We have a patient down at 1234 Main Street.", vi: "Có bệnh nhân ngã tại 1234 Main Street.", pronunciation_focus: ["patient", "Street"] },
      { en: "Patient is conscious but having chest pain.", vi: "Bệnh nhân tỉnh nhưng đau ngực.", pronunciation_focus: ["conscious", "chest"] },
      { en: "I'm staying on the line.", vi: "Con giữ máy.", pronunciation_focus: ["staying", "line"] },
    ],
    cultural_notes_vi:
      "Khi gọi 911: NÓI ĐỊA CHỈ ĐẦY ĐỦ TRƯỚC TIÊN. Nếu mất kết nối, cấp cứu vẫn đến. Nói rõ, chậm — operator viết. KHÔNG cúp máy cho tới khi operator nói được. Theo lệnh CPR/first aid của họ nếu cần.",
    tip_advice_vi:
      "Mỗi viện dưỡng lão / phòng khám có quy trình code (Code Blue, Code Red). Học quy trình NGÀY ĐẦU làm việc. Đừng đợi đến khi cần — biết trước cứu mạng. 911 là backup, code nội bộ là first response.",
  },
  {
    id: "healthcare_emergency_rapid_response",
    category: "emergency_communication",
    title_vi: "Gọi đội phản ứng nhanh",
    title_en: "Calling rapid response",
    sentences: [
      { en: "Patient's vitals are dropping — calling rapid response.", vi: "Vital signs bệnh nhân tụt — con gọi rapid response.", pronunciation_focus: ["vitals", "rapid"] },
      { en: "Room 412, Mrs. Davis, sudden change in level of consciousness.", vi: "Phòng 412, bà Davis, thay đổi đột ngột mức tỉnh táo.", pronunciation_focus: ["sudden", "consciousness"] },
      { en: "Stay calm — help is on the way.", vi: "Giữ bình tĩnh — đội đang tới.", pronunciation_focus: ["calm", "way"] },
      { en: "I'm staying with the patient.", vi: "Con ở với bệnh nhân.", pronunciation_focus: ["staying", "patient"] },
    ],
    cultural_notes_vi:
      "Rapid Response Team (RRT) là đội ICU phản ứng nhanh khi bệnh nhân xấu đột ngột. Gọi sớm tốt hơn muộn — không sợ 'overreacting'. SBAR ngắn gọn khi gọi: Situation, Background, Assessment, Recommendation.",
    tip_advice_vi:
      "Khi gọi RRT, ở LẠI VỚI BỆNH NHÂN — không bỏ đi tìm dụng cụ. Một người gọi, người khác lấy đồ, ai đó ở với bệnh nhân. Nếu một mình, đặt loa, tay vẫn theo dõi vital. Bệnh nhân không bao giờ một mình lúc nguy.",
  },
  {
    id: "healthcare_emergency_family_notify",
    category: "emergency_communication",
    title_vi: "Báo gia đình",
    title_en: "Notifying family",
    sentences: [
      { en: "This is Linh from the hospital — Mr. Davis's wife?", vi: "Đây là Linh từ bệnh viện — vợ ông Davis ạ?", pronunciation_focus: ["from", "wife"] },
      { en: "Your husband took a turn — the doctor would like you to come in.", vi: "Chồng bà đang xấu — bác sĩ muốn bà tới.", pronunciation_focus: ["turn", "come"] },
      { en: "Are you safe to drive, or should we call someone?", vi: "Bà tự lái được hay cần gọi ai chở?", pronunciation_focus: ["safe", "drive"] },
      { en: "Doctor will explain everything when you get here.", vi: "Bác sĩ sẽ giải thích khi bà tới.", pronunciation_focus: ["explain", "here"] },
    ],
    cultural_notes_vi:
      "Báo gia đình là vai trò của BS hoặc RN, không phải CNA. Nếu bạn được giao nhiệm vụ, KHÔNG báo qua điện thoại tin xấu nhất ('he died') — yêu cầu họ đến bệnh viện. Báo bằng cụm 'took a turn' hoặc 'condition worsened'.",
    tip_advice_vi:
      "Hỏi 'are you safe to drive?' là kỹ năng cứu mạng — gia đình hoảng có thể tai nạn trên đường. Đề nghị họ gọi taxi/Uber hoặc người khác chở. Nhiều bệnh viện trả tiền chuyến đi cấp cứu này.",
  },
  {
    id: "healthcare_emergency_patient_unresponsive",
    category: "emergency_communication",
    title_vi: "Bệnh nhân không phản ứng",
    title_en: "Patient is unresponsive",
    sentences: [
      { en: "Mrs. Davis, can you hear me?", vi: "Bà Davis, có nghe con không?", pronunciation_focus: ["hear"] },
      { en: "Squeeze my hand if you can hear.", vi: "Bóp tay con nếu nghe.", pronunciation_focus: ["squeeze", "hand"] },
      { en: "No response — calling for help now.", vi: "Không phản ứng — con gọi cấp cứu ngay.", pronunciation_focus: ["response", "help"] },
      { en: "Code Blue, room 412!", vi: "Code Blue, phòng 412!", pronunciation_focus: ["Code", "Blue"] },
    ],
    cultural_notes_vi:
      "Code Blue = ngưng tim/ngưng thở ở Mỹ (mọi bệnh viện). Hét rõ tên phòng. Trong khi đợi, bắt đầu CPR nếu trained và certified. Nếu không trained, ở lại và quan sát đường thở. Đừng ra khỏi phòng.",
    tip_advice_vi:
      "BLS/CPR certification là yêu cầu cho mọi CNA Mỹ — gia hạn mỗi 2 năm. Nếu lapse, BÁO supervisor — bạn không được tham gia code. Đừng giả vờ certified — nguy hiểm cho bệnh nhân và pháp lý cho bạn.",
  },
  {
    id: "healthcare_emergency_advance_directive",
    category: "emergency_communication",
    title_vi: "Di chúc y tế (advance directive)",
    title_en: "Advance directive (DNR)",
    sentences: [
      { en: "Mrs. Davis has a DNR — do not resuscitate — on file.", vi: "Bà Davis có DNR — không hồi sinh — trong hồ sơ.", pronunciation_focus: ["DNR", "resuscitate"] },
      { en: "We're keeping her comfortable.", vi: "Mình giữ bà thoải mái.", pronunciation_focus: ["keeping", "comfortable"] },
      { en: "Family is on their way.", vi: "Gia đình đang tới.", pronunciation_focus: ["family", "way"] },
      { en: "Chaplain has been called if you'd like.", vi: "Đã gọi chaplain nếu bà muốn.", pronunciation_focus: ["chaplain", "called"] },
    ],
    cultural_notes_vi:
      "DNR (do not resuscitate) là di chúc y tế bệnh nhân ký trước. KHÔNG vi phạm DNR — vi phạm có thể bị kiện và mất license. Comfort care có nghĩa pain management + dignity. Chaplain (cha tuyên uý) tư vấn tinh thần, không tôn giáo cụ thể.",
    tip_advice_vi:
      "Đọc CHART trước mỗi ca — biết bệnh nhân nào DNR, full code. Sai = vi phạm pháp lý. Nếu không chắc, hỏi RN. Một số bệnh viện có wrist band đặc biệt cho DNR — nhận biết nhanh trong khẩn cấp.",
  },
];

// ── 7. Cultural sensitivity (5) ──────────────────────────────────────────

const CULTURAL: HealthcareLesson[] = [
  {
    id: "healthcare_cultural_family_decisions",
    category: "cultural_sensitivity",
    title_vi: "Quyết định trong gia đình",
    title_en: "Family-based medical decisions",
    sentences: [
      { en: "Some families decide things together — we respect that.", vi: "Có gia đình quyết định cùng nhau — mình tôn trọng.", pronunciation_focus: ["families", "respect"] },
      { en: "Would you like family present when the doctor talks to you?", vi: "Anh/chị muốn gia đình có mặt khi bác sĩ trao đổi không?", pronunciation_focus: ["family", "present"] },
      { en: "We can wait until they arrive.", vi: "Mình đợi gia đình tới.", pronunciation_focus: ["wait", "arrive"] },
      { en: "It's your choice who's involved.", vi: "Anh/chị chọn ai tham gia.", pronunciation_focus: ["choice", "involved"] },
    ],
    cultural_notes_vi:
      "Văn hoá Việt + nhiều văn hoá Á-Mỹ La-Tinh: quyết định y tế là gia đình, không cá nhân. Văn hoá Mỹ chuẩn: quyết định cá nhân (autonomy). Bệnh viện Mỹ phải tôn trọng cả hai — bệnh nhân chọn ai liên quan.",
    tip_advice_vi:
      "Đừng nói 'in America we make our own decisions' — đó là văn hoá phán xét. Theo lựa chọn bệnh nhân. Nếu bệnh nhân muốn gia đình quyết, hỗ trợ. Đó là cultural humility — kỹ năng cốt lõi healthcare worker.",
  },
  {
    id: "healthcare_cultural_modesty",
    category: "cultural_sensitivity",
    title_vi: "Sự kín đáo",
    title_en: "Modesty considerations",
    sentences: [
      { en: "Would you prefer a female aide?", vi: "Anh/chị có thích nhân viên nữ không?", pronunciation_focus: ["prefer", "female"] },
      { en: "I can step out while you change.", vi: "Em ra ngoài khi anh/chị thay đồ.", pronunciation_focus: ["step", "change"] },
      { en: "I'll keep your gown closed as much as possible.", vi: "Em giữ áo bệnh viện kín nhất có thể.", pronunciation_focus: ["gown", "closed"] },
      { en: "Pull the curtain when you're ready.", vi: "Kéo rèm khi sẵn sàng.", pronunciation_focus: ["pull", "curtain"] },
    ],
    cultural_notes_vi:
      "Modesty cao ở bệnh nhân Hồi giáo, Việt, Hindu, Do Thái Orthodox — và cả nhiều bệnh nhân Mỹ Tin Lành lớn tuổi. Hỏi trước, không đoán. Một số yêu cầu nhân viên cùng giới — bệnh viện phải đáp ứng nếu có thể.",
    tip_advice_vi:
      "Nếu bệnh nhân yêu cầu cùng giới và không có ai sẵn, BÁO charge nurse — họ điều phối. Đừng tự quyết 'I'll just do it'. Tôn trọng yêu cầu = chăm sóc văn hoá tốt + tránh khiếu nại sau này.",
  },
  {
    id: "healthcare_cultural_religion",
    category: "cultural_sensitivity",
    title_vi: "Tôn giáo và y tế",
    title_en: "Religious considerations",
    sentences: [
      { en: "Are there any religious or dietary needs we should know about?", vi: "Có yêu cầu tôn giáo hay ăn uống nào không ạ?", pronunciation_focus: ["religious", "dietary"] },
      { en: "We can call a chaplain — non-denominational, just whoever you'd like.", vi: "Có thể gọi chaplain — không thuộc tôn giáo cụ thể, ai anh/chị muốn.", pronunciation_focus: ["chaplain", "denominational"] },
      { en: "Kosher and halal meals are available.", vi: "Có bữa ăn kosher và halal.", pronunciation_focus: ["Kosher", "halal"] },
      { en: "Just let me know if you need privacy to pray.", vi: "Anh/chị cần riêng tư cầu nguyện thì nói em.", pronunciation_focus: ["privacy", "pray"] },
    ],
    cultural_notes_vi:
      "Tôn giáo ảnh hưởng nhiều mặt y tế: cấm máu (Jehovah's Witnesses), ăn (Hồi giáo halal, Do Thái kosher), thời gian cầu nguyện, khám ngày Sabbath. Tôn trọng = không phán xét. Bệnh viện Mỹ thường có chaplain đa tôn giáo.",
    tip_advice_vi:
      "Đừng giả định: bệnh nhân Việt không nhất thiết Phật giáo, có thể Công giáo, Tin Lành. Hỏi 'any religious needs?' thay vì 'are you Buddhist?'. Tôn trọng cá nhân thay vì stereotype.",
  },
  {
    id: "healthcare_cultural_pain_expression",
    category: "cultural_sensitivity",
    title_vi: "Cách diễn đạt đau khác nhau",
    title_en: "Cultural differences in pain expression",
    sentences: [
      { en: "It's okay to say it really hurts.", vi: "Anh/chị cứ nói rất đau cũng không sao.", pronunciation_focus: ["okay", "really"] },
      { en: "We can do something to help — please tell me your real number.", vi: "Mình có cách giúp — anh/chị nói số thật.", pronunciation_focus: ["something", "real"] },
      { en: "Some people don't like to complain — but we need to know.", vi: "Có người không muốn phàn nàn — nhưng mình cần biết.", pronunciation_focus: ["complain", "know"] },
      { en: "There's no judgment.", vi: "Không ai phán xét.", pronunciation_focus: ["judgment"] },
    ],
    cultural_notes_vi:
      "Văn hoá Việt + Á-Đông: 'chịu đựng đau' là đức hạnh. Văn hoá Latino: biểu lộ đau lớn. Văn hoá Bắc Âu: kín đáo. Cùng cường độ đau, biểu hiện khác nhau. Đừng đánh giá theo tiếng kêu.",
    tip_advice_vi:
      "Nếu bệnh nhân nói '3' nhưng nhăn mặt, mồ hôi — báo RN. Quan sát non-verbal cũng quan trọng như số. Ghi cả hai: 'patient rates pain 3/10, observed grimacing during repositioning'. Khách quan, không diễn giải.",
  },
  {
    id: "healthcare_cultural_end_of_life",
    category: "cultural_sensitivity",
    title_vi: "Trao đổi cuối đời",
    title_en: "End-of-life conversations",
    sentences: [
      { en: "Some families prefer not to talk about death directly.", vi: "Có gia đình không muốn nói thẳng về cái chết.", pronunciation_focus: ["death", "directly"] },
      { en: "We follow the family's lead.", vi: "Mình theo gia đình.", pronunciation_focus: ["follow", "lead"] },
      { en: "The doctor can frame it however you'd like.", vi: "Bác sĩ trao đổi theo cách gia đình muốn.", pronunciation_focus: ["frame", "however"] },
      { en: "Just let us know what feels right.", vi: "Cho em biết cảm thấy thế nào phù hợp.", pronunciation_focus: ["right", "feels"] },
    ],
    cultural_notes_vi:
      "Văn hoá Mỹ: bệnh nhân được nói tất cả tiên lượng (full disclosure). Văn hoá Việt + nhiều Á-Đông: gia đình quyết bệnh nhân biết bao nhiêu, thường che giấu để 'giữ tinh thần'. Bệnh viện Mỹ phải dung hoà — bệnh nhân có quyền biết NẾU muốn.",
    tip_advice_vi:
      "Đừng tự nói tiên lượng với bệnh nhân — đó là vai trò BS. Nếu gia đình yêu cầu giấu chẩn đoán, BÁO MD/RN. Họ có quy trình ('don't tell mom') — không phải bạn quyết. Tôn trọng cả autonomy + family.",
  },
];

// ── 8. Charting and documentation (5) ────────────────────────────────────

const CHARTING: HealthcareLesson[] = [
  {
    id: "healthcare_chart_objective_subjective",
    category: "charting_documentation",
    title_vi: "Khách quan vs chủ quan",
    title_en: "Objective vs subjective notes",
    sentences: [
      { en: "Patient stated, 'My back hurts.'", vi: "Bệnh nhân nói: 'Lưng tôi đau.'", pronunciation_focus: ["stated", "hurts"] },
      { en: "Observed grimacing when repositioning.", vi: "Quan sát thấy nhăn mặt khi xoay người.", pronunciation_focus: ["observed", "repositioning"] },
      { en: "Refused PRN medication.", vi: "Từ chối thuốc PRN.", pronunciation_focus: ["refused", "PRN"] },
      { en: "RN notified.", vi: "Đã báo RN.", pronunciation_focus: ["notified"] },
    ],
    cultural_notes_vi:
      "Subjective = bệnh nhân nói (trong quotation marks). Objective = bạn quan sát. KHÔNG phán xét: 'patient is grumpy' SAI; 'patient declined breakfast and stated I'm not hungry' ĐÚNG. Chart là tài liệu pháp lý.",
    tip_advice_vi:
      "Quy tắc vàng: nếu không ghi, không xảy ra. Ghi mọi tình huống quan trọng. Khi báo RN, ghi luôn: 'reported to RN at 1430'. Nếu không có timestamp, ghi mơ hồ — pháp lý không bảo vệ bạn.",
  },
  {
    id: "healthcare_chart_avoid_diagnosis",
    category: "charting_documentation",
    title_vi: "Không tự chẩn đoán",
    title_en: "Avoiding diagnostic language",
    sentences: [
      { en: "Patient appears anxious.", vi: "Bệnh nhân có vẻ lo lắng.", pronunciation_focus: ["appears", "anxious"] },
      { en: "Skin reddened around incision.", vi: "Da đỏ quanh vết mổ.", pronunciation_focus: ["reddened", "incision"] },
      { en: "Reported difficulty breathing.", vi: "Báo cáo khó thở.", pronunciation_focus: ["reported", "breathing"] },
      { en: "RN assessed and notified MD.", vi: "RN đánh giá và báo MD.", pronunciation_focus: ["assessed", "notified"] },
    ],
    cultural_notes_vi:
      "Quy tắc scope of practice: CNA quan sát, RN đánh giá, MD chẩn đoán. Đừng viết 'patient has infection' — viết 'redness around incision, RN notified'. Diagnosing = vi phạm scope = pháp lý có vấn đề.",
    tip_advice_vi:
      "Đừng viết 'I think' / 'maybe' — không chắc thì không ghi suy đoán. 'Patient appears restless' OK; 'patient is dehydrated' SAI (đó là diagnosis). Stick to facts, leave conclusions to RN/MD.",
  },
  {
    id: "healthcare_chart_error_correction",
    category: "charting_documentation",
    title_vi: "Sửa lỗi trong hồ sơ",
    title_en: "Correcting documentation errors",
    sentences: [
      { en: "I made an error in the chart — I need to add a correction note.", vi: "Em ghi nhầm — em viết note sửa.", pronunciation_focus: ["error", "correction"] },
      { en: "Single line through the wrong entry, initial, date.", vi: "Một đường gạch ngang lỗi, ký tên tắt, ghi ngày.", pronunciation_focus: ["line", "initial"] },
      { en: "Add the correct information below.", vi: "Thêm thông tin đúng bên dưới.", pronunciation_focus: ["correct", "below"] },
      { en: "Never erase or use white-out.", vi: "Không bao giờ tẩy hay dùng white-out.", pronunciation_focus: ["never", "erase"] },
    ],
    cultural_notes_vi:
      "Quy tắc: KHÔNG xoá / không tẩy / không dùng white-out trong hồ sơ giấy. Một đường gạch (vẫn đọc được), initial, date, viết đúng cạnh. Trong EMR điện tử, có chức năng 'correct entry' — học cách dùng từ ngày đầu.",
    tip_advice_vi:
      "Sai sót xảy ra — báo cáo trung thực bảo vệ bạn pháp lý. Che giấu / sửa bí mật = vi phạm pháp lý nghiêm trọng. 'Late entry' (ghi sau giờ) là OK nếu đánh dấu rõ thời gian gốc và thời gian ghi.",
  },
  {
    id: "healthcare_chart_intake_output",
    category: "charting_documentation",
    title_vi: "Ghi I&O (intake & output)",
    title_en: "Recording intake and output",
    sentences: [
      { en: "Intake: 240 milliliters of water at lunch.", vi: "Vào: 240 ml nước bữa trưa.", pronunciation_focus: ["intake", "milliliters"] },
      { en: "Output: 200 milliliters of urine, clear, yellow.", vi: "Ra: 200 ml nước tiểu, trong, vàng.", pronunciation_focus: ["output", "urine"] },
      { en: "I'll mark refusal of breakfast.", vi: "Em đánh dấu từ chối bữa sáng.", pronunciation_focus: ["mark", "refusal"] },
      { en: "Two hours since last bathroom.", vi: "Hai tiếng kể từ lần đi vệ sinh trước.", pronunciation_focus: ["hours", "bathroom"] },
    ],
    cultural_notes_vi:
      "I&O quan trọng cho bệnh nhân tim, thận, post-surgery. Ghi mililit (ml) chính xác — đoán không chấp nhận. Nếu không cân được output (incontinent), ghi 'incontinent x 2' với mức ướt: small/moderate/large. Quan sát màu, mùi.",
    tip_advice_vi:
      "Nếu output thấp đột ngột (< 30 ml/giờ qua catheter), BÁO RN — có thể là dấu hiệu shock. I&O không chỉ là số — là cửa sổ vào tình trạng bệnh nhân. Quan sát + báo cáo, không bỏ qua.",
  },
  {
    id: "healthcare_chart_eob_handoff",
    category: "charting_documentation",
    title_vi: "Báo cáo cuối ca",
    title_en: "End-of-shift report",
    sentences: [
      { en: "Mrs. Tran, room 412 — vital signs stable, ate 75 percent of breakfast.", vi: "Bà Trần, phòng 412 — vital signs ổn, ăn 75% bữa sáng.", pronunciation_focus: ["stable", "percent"] },
      { en: "Reported mild back pain at 1100 — RN notified, comfort measures in place.", vi: "Báo đau lưng nhẹ lúc 11 giờ — RN biết, đã làm comfort measures.", pronunciation_focus: ["mild", "comfort"] },
      { en: "Daughter visiting at 1500.", vi: "Con gái thăm 3 giờ chiều.", pronunciation_focus: ["daughter", "visiting"] },
      { en: "No falls, no skin issues, slept well.", vi: "Không té, không vấn đề da, ngủ tốt.", pronunciation_focus: ["falls", "skin"] },
    ],
    cultural_notes_vi:
      "End-of-shift report (handoff) là điểm rủi ro cao — sai sót truyền thông gây 80% sentinel events ở Mỹ. SBAR format hoặc bedside report (tại giường bệnh nhân, có family) đang là tiêu chuẩn. Cụ thể, chính xác, không phán xét.",
    tip_advice_vi:
      "Học SBAR thuộc lòng: Situation (tình huống hiện tại), Background (bối cảnh), Assessment (đánh giá / quan sát), Recommendation (gợi ý cho ca sau). Ngắn gọn, đầy đủ, có hành động cụ thể. Đó là kỹ năng truyền thông y tế cốt lõi.",
  },
];

// ── Aggregate + helpers ──────────────────────────────────────────────────

export const HEALTHCARE_LESSONS: ReadonlyArray<HealthcareLesson> = [
  ...INTAKE_VITALS,
  ...PAIN_ASSESSMENT,
  ...MEDICATION,
  ...PROCEDURE,
  ...ELDER_CARE,
  ...EMERGENCY,
  ...CULTURAL,
  ...CHARTING,
];

export function getHealthcareLessonsByCategory(
  category: HealthcareCategoryId,
): HealthcareLesson[] {
  return HEALTHCARE_LESSONS.filter((l) => l.category === category);
}

export function getHealthcareLessonById(id: string): HealthcareLesson | undefined {
  return HEALTHCARE_LESSONS.find((l) => l.id === id);
}
