// src/data/exam-prep/ielts/listening-items.ts
//
// IELTS Listening practice content pack — 30 items across all 4 sections.
//
// Distribution (mirrors the actual exam shape, weighted toward the
// sections Vietnamese candidates lose marks on most):
//   Section 1 (8) — social-context conversations (booking, registration)
//   Section 2 (8) — social-context monologues (tour, announcement)
//   Section 3 (8) — academic discussion, 2–4 speakers
//   Section 4 (6) — academic monologue, single lecturer
//
// All scripts, questions, explanations, and Vietnamese-speaker
// strategies in this file are **original** — written for MercyBlade
// based on the public IELTS test specification. None of this content
// is reproduced from any commercial prep book. Verbatim re-use
// requires attribution.
//
// Format faithful points (per ielts.org public spec):
//   - Section 1 form/note completion + multiple choice mix
//   - Section 2 has a small map/plan-labelling block
//   - Section 3 multiple choice + matching emphasis
//   - Section 4 note completion / sentence completion emphasis
//   - Numbers, dates, names: exam-typical paraphrase + correction
//     ("twenty fifteen" / self-correction "actually, no, it's …")

export type IELTSListeningSection = 1 | 2 | 3 | 4;
export type IELTSListeningContext = "social" | "academic";
export type IELTSListeningQuestionType =
  | "multiple_choice"
  | "matching"
  | "form_completion"
  | "note_completion"
  | "plan_labelling"
  | "short_answer";
export type IELTSListeningBand = 5.5 | 6.5 | 7.5 | 8.5;
export type IELTSListeningVocabBand = 5 | 6 | 7 | 8 | 9;

export interface IELTSListeningQuestion {
  /** Stable number within the item (1-based). */
  number: number;
  type: IELTSListeningQuestionType;
  question_text: string;
  /** Options for MCQ / matching; undefined for completion / short-answer. */
  options?: string[];
  /** Canonical answer. Strings for completion (case-insensitive in scoring). */
  correct_answer: string;
  explanation_vi: string;
}

export interface IELTSListeningVocab {
  word: string;
  ipa: string;
  vi_translation: string;
  band_level: IELTSListeningVocabBand;
  /** A short note on how the word is used in the script's context. */
  context_use: string;
}

export interface IELTSListeningItem {
  id: string;
  section: IELTSListeningSection;
  context: IELTSListeningContext;
  topic_title_vi: string;
  topic_title_en: string;
  /** Full script. Multi-speaker scripts use "SPEAKER: " line prefixes. */
  audio_script: string;
  questions: IELTSListeningQuestion[];
  vocabulary_focus: IELTSListeningVocab[];
  /** 5+ strategies tailored for Vietnamese listeners. */
  vietnamese_speaker_strategies: string[];
  /** 3+ specific traps VN candidates fall into on this item type. */
  common_mistakes_vi: string[];
  estimated_time_minutes: number;
  difficulty_band: IELTSListeningBand;
}

// ─────────────────────────────────────────────────────────────────────
// Re-used Vietnamese-speaker strategy snippets (avoid copy-paste drift).
// Each item picks ~5 from this pool plus item-specific ones.
// ─────────────────────────────────────────────────────────────────────

const STRAT_DISTRACTOR =
  "Thí sinh thường nghe đáp án đầu tiên rồi chốt — nhưng IELTS thường có 'self-correction': speaker nói 'actually, no, it's …' ngay sau. Luôn nghe hết câu trước khi viết.";
const STRAT_PARAPHRASE =
  "Câu hỏi và audio HIẾM KHI dùng cùng từ. 'approximately' trong câu hỏi → 'around / about / roughly' trong audio. Học các cặp paraphrase phổ biến.";
const STRAT_NUMBERS =
  "Số năm: '2015' đọc là 'twenty-fifteen' (chuẩn IELTS) HOẶC 'two thousand fifteen'. Tập nghe cả hai. Số có '0' (zero) thường đọc là 'oh' trong số điện thoại.";
const STRAT_SPELLING =
  "Form completion chấm rất chặt chính tả. Tên riêng (đường, người) thường được spelt out — nghe và chép từng chữ cái. 'Double-N', 'silent K' là các tín hiệu cần chú ý.";
const STRAT_ACCENT =
  "Bài thi có cả accent UK, AU, US, NZ, IE. Người Việt thường chỉ luyện UK/US — Australian /aɪ/ đọc gần /ɔɪ/ ('today' nghe gần 'todoy'). Nghe BBC + ABC News mỗi ngày để quen tai.";
const STRAT_ANTICIPATE =
  "Trước khi audio chạy, đọc trước câu hỏi: gạch dưới keywords và đoán dạng từ cần điền (số / tên người / địa danh). Anticipation là kỹ năng band 7+.";
const STRAT_NEGATIVES =
  "Cẩn thận với phủ định: 'isn't / wasn't / can't' phát âm rất nhanh trong English nói. Một âm 'n't' bị bỏ là cả nghĩa câu lật ngược.";

// ─────────────────────────────────────────────────────────────────────
// Section 1 — social-context conversations (8 items)
// ─────────────────────────────────────────────────────────────────────

const ALL_ITEMS: IELTSListeningItem[] = [
  {
    id: "ielts_listening_section1_hotel_booking",
    section: 1,
    context: "social",
    topic_title_vi: "Đặt phòng khách sạn",
    topic_title_en: "Hotel booking enquiry",
    audio_script: `RECEPTIONIST: Good morning, Cedar Park Hotel. How can I help you?
CALLER: Hello, I'd like to make a booking for the weekend of the fourteenth of June.
RECEPTIONIST: Certainly. How many nights, please?
CALLER: Two nights — checking in Friday afternoon and out on Sunday morning.
RECEPTIONIST: And what type of room would you like? We have a standard double, a deluxe twin, and a family suite.
CALLER: I think the deluxe twin, please. Two of us travelling.
RECEPTIONIST: Lovely. May I take your name?
CALLER: Yes, it's Tran. T-R-A-N.
RECEPTIONIST: And a first name?
CALLER: Linh. L-I-N-H.
RECEPTIONIST: Thank you. The deluxe twin is one hundred and forty pounds per night, breakfast included. Actually — sorry, let me correct that. From June onwards it's gone up to one hundred and fifty-five.
CALLER: Right, fine. Is parking included?
RECEPTIONIST: Parking is an extra ten pounds per night, payable at the desk on arrival. We also offer a packed lunch service for guests planning a day out — that's nine pounds per person.
CALLER: I might take that on Saturday. Could you note that down?
RECEPTIONIST: Of course. Anything else I should know? Dietary requirements?
CALLER: Yes — one of us is vegetarian.
RECEPTIONIST: Noted. Could I have a phone number for the booking?
CALLER: Yes, oh-seven-double-three, four-one-six, oh-eight-two.
RECEPTIONIST: Lovely. I'll send a confirmation email. What's your address?
CALLER: It's hello at linhtran dot co dot uk.
RECEPTIONIST: Thank you, Ms Tran. Your booking reference is BX-four-nine-two.`,
    questions: [
      {
        number: 1,
        type: "form_completion",
        question_text: "Surname: ____________",
        correct_answer: "Tran",
        explanation_vi:
          "Speaker spells the surname rõ ràng ('T-R-A-N'). Form completion chấm khắt khe — viết đúng chính tả từng chữ.",
      },
      {
        number: 2,
        type: "form_completion",
        question_text: "Number of nights: ____________",
        correct_answer: "2",
        explanation_vi:
          "'Two nights' — viết bằng số hoặc bằng chữ đều được, miễn nhất quán theo chỉ dẫn đề bài.",
      },
      {
        number: 3,
        type: "form_completion",
        question_text: "Price per night (after correction): £____________",
        correct_answer: "155",
        explanation_vi:
          "Đây là bẫy 'self-correction' kinh điển. Đáp án đầu là '140', sau đó speaker tự sửa thành '155'. Đáp án đúng là 155.",
      },
      {
        number: 4,
        type: "multiple_choice",
        question_text: "Which extra service does the caller request?",
        options: [
          "A) parking",
          "B) packed lunch on Saturday",
          "C) airport pickup",
          "D) early check-in",
        ],
        correct_answer: "B",
        explanation_vi:
          "Caller chỉ đồng ý 'packed lunch on Saturday'. Parking là chi phí extra nhưng caller không request thêm.",
      },
      {
        number: 5,
        type: "form_completion",
        question_text: "Phone number: ____________",
        correct_answer: "0733416082",
        explanation_vi:
          "'oh-seven-double-three' = 0733. 'Double' nghĩa là gấp đôi. Người Việt thường chép '07333' do nghe 'double three' = '333'.",
      },
    ],
    vocabulary_focus: [
      {
        word: "deluxe",
        ipa: "/dɪˈlʌks/",
        vi_translation: "hạng sang",
        band_level: 6,
        context_use: "Mô tả phòng cao cấp hơn standard. Stress vào âm thứ hai.",
      },
      {
        word: "dietary requirements",
        ipa: "/ˈdaɪ.ə.tər.i rɪˈkwaɪər.mənts/",
        vi_translation: "yêu cầu ăn uống",
        band_level: 7,
        context_use: "Cụm chuẩn dùng ở khách sạn / nhà hàng để hỏi ăn chay, dị ứng.",
      },
      {
        word: "checking in / out",
        ipa: "/ˈtʃɛk.ɪŋ ɪn/",
        vi_translation: "nhận / trả phòng",
        band_level: 5,
        context_use: "Cụm phrasal verb cố định ở khách sạn.",
      },
      {
        word: "packed lunch",
        ipa: "/pækt lʌntʃ/",
        vi_translation: "bữa trưa mang đi",
        band_level: 6,
        context_use: "Bữa trưa đã đóng gói sẵn để mang theo. Khác 'lunch box'.",
      },
    ],
    vietnamese_speaker_strategies: [
      STRAT_DISTRACTOR,
      STRAT_NUMBERS,
      STRAT_SPELLING,
      "Số tiền có thể nói '£140' = 'one hundred and forty pounds'. 'Pounds' luôn ở cuối, không có 's' nếu là £1.",
      "'Double-three' = 33, 'triple-five' = 555. Đây là quy ước tiếng Anh-Anh đặc biệt — Mỹ thường nói từng số.",
    ],
    common_mistakes_vi: [
      "Chốt giá £140 (đáp án đầu) thay vì £155 (sau self-correction).",
      "Viết phone là '0733341608' do hiểu 'double three' = '333' chứ không phải '33'.",
      "Bỏ qua chi tiết 'vegetarian' khi câu hỏi có hỏi về dietary requirements.",
    ],
    estimated_time_minutes: 8,
    difficulty_band: 5.5,
  },
  {
    id: "ielts_listening_section1_library_registration",
    section: 1,
    context: "social",
    topic_title_vi: "Đăng ký thẻ thư viện",
    topic_title_en: "Library registration",
    audio_script: `LIBRARIAN: Hi, are you here to register for a library card?
STUDENT: Yes, I just moved into the area last week.
LIBRARIAN: Welcome. I'll just need a few details. Your full name, please?
STUDENT: It's Maria Chen. M-A-R-I-A, then C-H-E-N.
LIBRARIAN: Date of birth?
STUDENT: The third of August, nineteen ninety-eight.
LIBRARIAN: And your current address?
STUDENT: Forty-two Greenfield Avenue. That's G-R-E-E-N-F-I-E-L-D.
LIBRARIAN: Postcode?
STUDENT: SW seven, three PE.
LIBRARIAN: Lovely. Now, we have three types of membership. Standard is free and lets you borrow up to six items at a time. The plus card is twelve pounds a year — eight items, plus access to e-books. And the premium card is twenty-five pounds, with twelve items and access to the language-learning platform.
STUDENT: Hmm. I'm doing a course in Spanish, so I think the premium one would be good.
LIBRARIAN: Excellent choice. The most popular section after fiction is actually the audiobook section — we get new titles every Wednesday. Loan period is three weeks for books, two weeks for DVDs, and one week for audiobooks.
STUDENT: One week is short.
LIBRARIAN: It is — but you can renew online up to two times if no-one else has reserved the item.
STUDENT: Got it. Can I bring food in?
LIBRARIAN: Drinks in a closed bottle are fine. No food in the main reading area, but there's a café on the second floor.`,
    questions: [
      {
        number: 1,
        type: "form_completion",
        question_text: "Date of birth: ____________ August ____________",
        correct_answer: "3, 1998",
        explanation_vi:
          "'The third of August, nineteen ninety-eight' = 3 August 1998. 'Nineteen ninety-eight' = 1998 (cách đọc UK).",
      },
      {
        number: 2,
        type: "form_completion",
        question_text: "Address: 42 ____________ Avenue",
        correct_answer: "Greenfield",
        explanation_vi:
          "Speaker spells 'G-R-E-E-N-F-I-E-L-D'. Người Việt thường viết sai 'Greenfeild' do thói quen 'i trước e'.",
      },
      {
        number: 3,
        type: "multiple_choice",
        question_text: "Which membership does the student choose?",
        options: [
          "A) Standard",
          "B) Plus",
          "C) Premium",
          "D) Student concession",
        ],
        correct_answer: "C",
        explanation_vi:
          "Student chọn premium vì đang học tiếng Tây Ban Nha và premium có 'language-learning platform'.",
      },
      {
        number: 4,
        type: "note_completion",
        question_text: "Loan period — audiobooks: ____________ week(s)",
        correct_answer: "1",
        explanation_vi:
          "'One week for audiobooks'. Lưu ý cả ba thời hạn (books 3, DVDs 2, audiobooks 1) — câu hỏi chỉ một mục để gây nhầm.",
      },
      {
        number: 5,
        type: "short_answer",
        question_text: "Where is the café located?",
        correct_answer: "second floor",
        explanation_vi:
          "'There's a café on the second floor'. Câu hỏi short-answer thường giới hạn 2 từ — viết 'second floor' đủ.",
      },
    ],
    vocabulary_focus: [
      {
        word: "loan period",
        ipa: "/loʊn ˈpɪər.i.əd/",
        vi_translation: "thời hạn mượn",
        band_level: 6,
        context_use: "Cụm cố định ở thư viện — thời gian được giữ sách trước khi phải trả.",
      },
      {
        word: "membership",
        ipa: "/ˈmɛm.bə.ʃɪp/",
        vi_translation: "tư cách thành viên",
        band_level: 5,
        context_use: "Stress vào âm đầu. Đừng nhầm với 'member' (người).",
      },
      {
        word: "renew",
        ipa: "/rɪˈnjuː/",
        vi_translation: "gia hạn",
        band_level: 6,
        context_use: "Động từ — gia hạn thời hạn mượn / hợp đồng / hộ chiếu.",
      },
      {
        word: "reserved",
        ipa: "/rɪˈzɜːvd/",
        vi_translation: "đã được đặt trước",
        band_level: 6,
        context_use: "'If no one has reserved it' = nếu chưa có ai đặt trước.",
      },
    ],
    vietnamese_speaker_strategies: [
      STRAT_SPELLING,
      STRAT_PARAPHRASE,
      "'Nineteen ninety-eight' = 1998. 'Two thousand and one' = 2001. Năm sau 2000 thường đọc 'two thousand and X'.",
      "Postcode UK: 'SW7 3PE' — chữ + số + chữ. Tập nghe và viết đúng định dạng.",
      "'Up to' (tối đa) khác 'at least' (ít nhất). VN thường lẫn — học cặp đối lập này.",
    ],
    common_mistakes_vi: [
      "Viết tên sai chính tả vì nghe lướt phần spelling.",
      "Chốt 'Plus' membership vì giá rẻ hơn, không nghe đến lý do student chọn 'Premium'.",
      "Nghe 'one week' rồi viết 'a week' — câu trả lời cần SỐ, không phải mạo từ.",
    ],
    estimated_time_minutes: 8,
    difficulty_band: 5.5,
  },
  {
    id: "ielts_listening_section1_apartment_rental",
    section: 1,
    context: "social",
    topic_title_vi: "Hỏi thuê căn hộ",
    topic_title_en: "Apartment rental enquiry",
    audio_script: `AGENT: Pinetree Lettings, this is David speaking.
CALLER: Hi, I'm calling about the flat advertised on Carlton Road — one bedroom, I think.
AGENT: That's right. It's available from the first of October.
CALLER: Could you tell me the rent?
AGENT: It's eight hundred and ninety pounds a month. That includes water but not electricity or council tax.
CALLER: And the deposit?
AGENT: Six weeks' rent — that comes to one thousand, two hundred and thirty pounds. Refundable when you move out, assuming no damage.
CALLER: Is the flat furnished?
AGENT: Partially. It has a sofa, dining table, and a bed, but no wardrobe or kitchenware.
CALLER: How long is the minimum tenancy?
AGENT: Twelve months. We can sometimes do six, but rent is slightly higher in that case — usually about fifty pounds more per month.
CALLER: Can I view it this weekend?
AGENT: Saturday is fully booked — sorry. We have slots on Sunday at eleven and at two-thirty.
CALLER: Two-thirty works. My name is Jakub Nowak. That's J-A-K-U-B, surname N-O-W-A-K.`,
    questions: [
      { number: 1, type: "form_completion", question_text: "Monthly rent: £____________", correct_answer: "890", explanation_vi: "'Eight hundred and ninety pounds a month'." },
      { number: 2, type: "form_completion", question_text: "Deposit: £____________", correct_answer: "1230", explanation_vi: "'One thousand, two hundred and thirty pounds' = 1230." },
      { number: 3, type: "multiple_choice", question_text: "The flat is:", options: ["A) fully furnished", "B) partially furnished", "C) unfurnished", "D) furnished with kitchenware only"], correct_answer: "B", explanation_vi: "'Partially' = một phần — có sofa, bàn ăn, giường nhưng không có tủ và đồ bếp." },
      { number: 4, type: "form_completion", question_text: "Minimum tenancy (months): ____________", correct_answer: "12", explanation_vi: "'Twelve months' là tối thiểu chuẩn." },
      { number: 5, type: "form_completion", question_text: "Viewing time on Sunday: ____________", correct_answer: "2:30", explanation_vi: "Caller chọn slot 2:30 chứ không phải 11:00." },
    ],
    vocabulary_focus: [
      { word: "tenancy", ipa: "/ˈtɛn.ən.si/", vi_translation: "thời hạn thuê nhà", band_level: 7, context_use: "Cụm pháp lý — thời gian hợp đồng thuê." },
      { word: "deposit", ipa: "/dɪˈpɒz.ɪt/", vi_translation: "tiền đặt cọc", band_level: 6, context_use: "Tiền hoàn lại nếu không hư hại." },
      { word: "furnished", ipa: "/ˈfɜː.nɪʃt/", vi_translation: "có sẵn nội thất", band_level: 6, context_use: "Trái nghĩa 'unfurnished'. 'Partially furnished' = một phần." },
      { word: "council tax", ipa: "/ˈkaʊn.səl tæks/", vi_translation: "thuế hội đồng địa phương (UK)", band_level: 7, context_use: "Thuế hộ gia đình ở UK." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_NUMBERS,
      STRAT_DISTRACTOR,
      "'Six weeks' rent' phải tính ra số cụ thể nếu form yêu cầu £. Đáp án là 1230, không phải '6 weeks'.",
      "Cách đọc số lớn: 'one thousand, two hundred and thirty' = 1,230.",
      "Tên ngoại quốc thường được spelt out — chuẩn bị tâm lý nghe spelling chậm, chính xác.",
    ],
    common_mistakes_vi: [
      "Viết deposit là '6 weeks' rent' thay vì số £1230.",
      "Quên 'water included but not electricity'.",
      "Chốt slot 11:00 vì là slot đầu tiên đề cập.",
    ],
    estimated_time_minutes: 8,
    difficulty_band: 6.5,
  },
  {
    id: "ielts_listening_section1_course_enrollment",
    section: 1,
    context: "social",
    topic_title_vi: "Đăng ký khoá học buổi tối",
    topic_title_en: "Evening course enrollment",
    audio_script: `OFFICER: Adult Learning Centre, good afternoon.
CALLER: Hi — I'd like some information about your evening photography course.
OFFICER: Sure. We run two levels — beginner on Tuesdays and intermediate on Thursdays. Both seven to nine pm.
CALLER: I've done a one-day workshop before, so I'm probably between levels.
OFFICER: I'd suggest beginner — it covers manual mode properly, which most one-day courses skip.
CALLER: Okay, beginner then. How long is the course?
OFFICER: Eight weeks. Starts on the twentieth of January.
CALLER: And the cost?
OFFICER: One hundred and ninety pounds for the eight weeks. Equipment is provided, but you can bring your own camera if you prefer.
CALLER: Do I need to buy a textbook?
OFFICER: No textbook, but we recommend a notebook and a memory card — at least sixteen gigabytes.
CALLER: Where is the course held?
OFFICER: Room twelve in the Bryant Building. That's on Newhall Street, opposite the cinema.
CALLER: Got it. How do I sign up?
OFFICER: Online at our website, or you can fill in a form here. The online discount is ten percent if you book before December the fifteenth.`,
    questions: [
      { number: 1, type: "note_completion", question_text: "Course level recommended: ____________", correct_answer: "beginner", explanation_vi: "Officer suggest 'beginner' vì cover manual mode properly." },
      { number: 2, type: "note_completion", question_text: "Course duration: ____________ weeks", correct_answer: "8", explanation_vi: "'Eight weeks'." },
      { number: 3, type: "form_completion", question_text: "Cost: £____________", correct_answer: "190", explanation_vi: "'One hundred and ninety pounds'." },
      { number: 4, type: "note_completion", question_text: "Memory card: at least ____________ GB", correct_answer: "16", explanation_vi: "'At least sixteen gigabytes'." },
      { number: 5, type: "short_answer", question_text: "Last day for online discount?", correct_answer: "December 15", explanation_vi: "'Before December the fifteenth' = 15 tháng 12." },
    ],
    vocabulary_focus: [
      { word: "intermediate", ipa: "/ˌɪn.təˈmiː.di.ət/", vi_translation: "trung cấp", band_level: 6, context_use: "Cấp giữa beginner và advanced." },
      { word: "manual mode", ipa: "/ˈmæn.ju.əl moʊd/", vi_translation: "chế độ thủ công (máy ảnh)", band_level: 7, context_use: "Thuật ngữ kỹ thuật — chỉnh tay thay vì auto." },
      { word: "textbook", ipa: "/ˈtɛkst.bʊk/", vi_translation: "sách giáo khoa", band_level: 5, context_use: "Đừng nhầm với 'notebook' (sổ ghi)." },
      { word: "discount", ipa: "/ˈdɪs.kaʊnt/", vi_translation: "giảm giá", band_level: 5, context_use: "Stress vào âm đầu." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_DISTRACTOR,
      STRAT_ANTICIPATE,
      "Số nguyên có 's' khi là số nhiều: 'eight weeks', 'ten percent'.",
      "Ngày tháng UK: 'December the fifteenth' = December 15 / 15 December.",
      "'At least' (tối thiểu) khác 'at most' (tối đa).",
    ],
    common_mistakes_vi: [
      "Chốt 'intermediate' vì caller nói 'between levels'.",
      "Viết duration là '8 weeks' khi yêu cầu chỉ con số.",
      "Bỏ qua deadline cho online discount.",
    ],
    estimated_time_minutes: 8,
    difficulty_band: 6.5,
  },
  {
    id: "ielts_listening_section1_insurance_claim",
    section: 1,
    context: "social",
    topic_title_vi: "Báo tổn thất bảo hiểm",
    topic_title_en: "Insurance claim",
    audio_script: `AGENT: Brightside Insurance, claims line. Could I take your policy number?
CLIENT: Yes — it's BX-zero-four-nine-two-one-six.
AGENT: Thank you. And what's happened?
CLIENT: My laptop was stolen from a café yesterday afternoon.
AGENT: I'm sorry to hear that. Where exactly?
CLIENT: A café called The Daily Grind on Walton Street.
AGENT: Have you reported it to the police?
CLIENT: Yes, this morning. They gave me a crime reference number.
AGENT: Could I take that?
CLIENT: Sure — RX-three-three-one, eight-zero-seven, four.
AGENT: Thank you. What was the value of the laptop?
CLIENT: I bought it for nine hundred and fifty pounds last September. I have the receipt.
AGENT: Excellent. Was there anything else stolen?
CLIENT: A pair of headphones — fairly inexpensive, about forty pounds, but I'd like to claim for them too.
AGENT: That's fine. Now — your policy has an excess of seventy-five pounds. That's the amount you contribute before we cover the rest.`,
    questions: [
      { number: 1, type: "form_completion", question_text: "Policy number: ____________", correct_answer: "BX049216", explanation_vi: "'BX-zero-four-nine-two-one-six'." },
      { number: 2, type: "short_answer", question_text: "Where was the laptop stolen?", correct_answer: "café", explanation_vi: "Câu hỏi 'where', đáp án ngắn 1-2 từ. 'A café' đủ." },
      { number: 3, type: "form_completion", question_text: "Crime reference: RX-____________-807-4", correct_answer: "331", explanation_vi: "'RX-three-three-one' = 331." },
      { number: 4, type: "form_completion", question_text: "Laptop value: £____________", correct_answer: "950", explanation_vi: "'Nine hundred and fifty pounds'." },
      { number: 5, type: "form_completion", question_text: "Excess: £____________", correct_answer: "75", explanation_vi: "'Excess of seventy-five pounds' = số tiền khách trả trước." },
    ],
    vocabulary_focus: [
      { word: "policy number", ipa: "/ˈpɒl.ə.si ˈnʌm.bə/", vi_translation: "mã hợp đồng bảo hiểm", band_level: 6, context_use: "Cụm cố định." },
      { word: "excess", ipa: "/ɪkˈsɛs/", vi_translation: "khoản miễn thường", band_level: 7, context_use: "Phần khách phải tự trả trước khi bảo hiểm cover." },
      { word: "claim form", ipa: "/kleɪm fɔːm/", vi_translation: "đơn yêu cầu bồi thường", band_level: 6, context_use: "Form chính thức điền chi tiết tổn thất." },
      { word: "proof of purchase", ipa: "/pruːf əv ˈpɜː.tʃəs/", vi_translation: "bằng chứng mua hàng", band_level: 7, context_use: "Receipt hoặc card statement đều được." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_SPELLING,
      STRAT_NUMBERS,
      "'Zero' / 'oh' / 'nought' đều có thể là số 0.",
      "Cụm bảo hiểm là từ vựng band 7+: 'policy', 'excess', 'claim', 'cover', 'liability'.",
      "Số tiền lớn: 'nine fifty' hoặc 'nine hundred and fifty' — cả hai đều = 950.",
    ],
    common_mistakes_vi: [
      "Viết tên cụ thể 'The Daily Grind' (không cần) thay vì 'café'.",
      "Nhầm '331' với '3-3-1' khi viết.",
      "Bỏ qua chi tiết 'excess £75'.",
    ],
    estimated_time_minutes: 8,
    difficulty_band: 6.5,
  },
  {
    id: "ielts_listening_section1_sports_membership",
    section: 1,
    context: "social",
    topic_title_vi: "Đăng ký thẻ thành viên trung tâm thể thao",
    topic_title_en: "Sports centre membership",
    audio_script: `STAFF: Welcome to Riverside Sports Centre.
CALLER: Hi, I'd like to know about membership options.
STAFF: We have three. Pay-as-you-go is six pounds per visit. Off-peak monthly is thirty-five pounds — that gives unlimited access between ten am and four pm on weekdays. Full membership is fifty-eight pounds a month, anytime access including weekends.
CALLER: I work nine to five so off-peak doesn't suit me.
STAFF: In that case, full membership. Do you have any concessions — student, senior, NHS?
CALLER: I'm a student, yes.
STAFF: Great — student rate is forty-six pounds.
CALLER: That's better. What's included?
STAFF: All gym facilities, swimming pool, sauna, and one free fitness assessment a year. Group classes are an extra two pounds each, or you can add the unlimited classes upgrade for ten pounds a month.
CALLER: I'd like to try a yoga class first before adding the upgrade.
STAFF: Sensible. We have yoga on Tuesday evenings at six-thirty.
CALLER: Perfect. One last question — is there a joining fee?
STAFF: Normally twenty-five pounds, but we waive it for students.`,
    questions: [
      { number: 1, type: "multiple_choice", question_text: "Why doesn't off-peak suit the caller?", options: ["A) too expensive", "B) work hours conflict", "C) doesn't include weekends", "D) no swimming"], correct_answer: "B", explanation_vi: "'I work nine to five' = 9am–5pm — trùng giờ off-peak." },
      { number: 2, type: "form_completion", question_text: "Student rate: £____________ per month", correct_answer: "46", explanation_vi: "'Forty-six pounds'." },
      { number: 3, type: "note_completion", question_text: "Free fitness assessment: ____________ per year", correct_answer: "1", explanation_vi: "'One free fitness assessment a year'." },
      { number: 4, type: "form_completion", question_text: "Yoga day/time: ____________ at ____________", correct_answer: "Tuesday 6:30", explanation_vi: "'Tuesday evenings at six-thirty'." },
      { number: 5, type: "multiple_choice", question_text: "The joining fee is:", options: ["A) £25", "B) £25 with student discount", "C) waived for students", "D) £10"], correct_answer: "C", explanation_vi: "'Waive' = miễn." },
    ],
    vocabulary_focus: [
      { word: "off-peak", ipa: "/ˌɒfˈpiːk/", vi_translation: "ngoài giờ cao điểm", band_level: 6, context_use: "Cụm tính từ — giờ thấp điểm." },
      { word: "concession", ipa: "/kənˈsɛʃ.ən/", vi_translation: "ưu đãi giảm giá", band_level: 7, context_use: "Cho student, senior, etc." },
      { word: "waive", ipa: "/weɪv/", vi_translation: "miễn (phí)", band_level: 7, context_use: "'Waive the fee' = miễn phí." },
      { word: "fitness assessment", ipa: "/ˈfɪt.nəs əˈsɛs.mənt/", vi_translation: "đánh giá thể chất", band_level: 7, context_use: "Buổi đo các chỉ số thể chất ban đầu." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_PARAPHRASE,
      STRAT_DISTRACTOR,
      "'Pay-as-you-go' = trả tiền theo lần dùng.",
      "'Waive' và 'wave' homophones — phân biệt theo nghĩa câu.",
      "'A year' = mỗi năm. 'Per annum' (formal) cùng nghĩa nhưng hiếm trong Section 1.",
    ],
    common_mistakes_vi: [
      "Chốt full price £58 thay vì student rate £46.",
      "Viết yoga time là '6:30 pm' nếu form chỉ yêu cầu giờ.",
      "Bỏ qua phần joining fee waived.",
    ],
    estimated_time_minutes: 8,
    difficulty_band: 6.5,
  },
  {
    id: "ielts_listening_section1_lost_property",
    section: 1,
    context: "social",
    topic_title_vi: "Báo mất đồ trên tàu",
    topic_title_en: "Lost property on a train",
    audio_script: `STAFF: Lost property office, how can I help?
PASSENGER: Hi, I left my bag on the train this morning.
STAFF: Which service?
PASSENGER: The eight-fifteen from Reading to London Paddington.
STAFF: Could you describe the bag?
PASSENGER: It's a medium-sized backpack, dark grey, with a small red logo on the front.
STAFF: Brand?
PASSENGER: Northland.
STAFF: And what was inside?
PASSENGER: A laptop — silver MacBook — a notebook, a pair of headphones, and my passport.
STAFF: Your passport! In which case, please report it to the police as well.
PASSENGER: I'll do that next.
STAFF: Anything else of value?
PASSENGER: There's a small camera, a Canon — the model is G-seven-X, mark three.
STAFF: Got it. Can I take your name and contact number?
PASSENGER: Yes, my name is Sandeep Patel — that's S-A-N-D-E-E-P. And my mobile is oh-seven-nine-eight-five, six-four-two, oh-three-one.
STAFF: We'll search any items handed in over the past twenty-four hours and call you. There's a small storage fee of three pounds if a bag is recovered after twenty-four hours.`,
    questions: [
      { number: 1, type: "form_completion", question_text: "Train time: ____________", correct_answer: "8:15", explanation_vi: "'Eight-fifteen from Reading'." },
      { number: 2, type: "note_completion", question_text: "Bag colour: ____________", correct_answer: "dark grey", explanation_vi: "'Dark grey' (UK) or 'dark gray' (US)." },
      { number: 3, type: "note_completion", question_text: "Camera model: G-7-X, mark ____________", correct_answer: "3", explanation_vi: "'Mark three'." },
      { number: 4, type: "form_completion", question_text: "Passenger phone: ____________", correct_answer: "07985642031", explanation_vi: "'oh-seven-nine-eight-five, six-four-two, oh-three-one' = 07985 642 031." },
      { number: 5, type: "form_completion", question_text: "Storage fee after 24h: £____________", correct_answer: "3", explanation_vi: "'Small storage fee of three pounds'." },
    ],
    vocabulary_focus: [
      { word: "lost property", ipa: "/lɒst ˈprɒp.ə.ti/", vi_translation: "đồ thất lạc", band_level: 6, context_use: "Cụm UK chuẩn — văn phòng giữ đồ thất lạc." },
      { word: "non-emergency line", ipa: "/nɒn.ɪˈmɜː.dʒən.si laɪn/", vi_translation: "đường dây không khẩn cấp", band_level: 7, context_use: "UK 101 — báo cảnh sát chuyện không khẩn cấp." },
      { word: "recover", ipa: "/rɪˈkʌv.ə/", vi_translation: "tìm lại được", band_level: 6, context_use: "'If a bag is recovered' = nếu túi được tìm thấy." },
      { word: "handed in", ipa: "/ˈhæn.dɪd ɪn/", vi_translation: "nộp lại", band_level: 6, context_use: "Phrasal — đồ được người khác nộp lại." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_NUMBERS,
      STRAT_SPELLING,
      "Tên ngoại quốc thường được spell — nghe và chép cẩn thận.",
      "Cách đọc model code: 'G-seven-X, mark three' = G7X mark III.",
      "'Oh' thay 'zero' trong số điện thoại UK.",
    ],
    common_mistakes_vi: [
      "Nhầm 'eight-fifteen' với '8:50' — nghe kỹ ending.",
      "Viết phone thiếu số do không bắt được nhịp 'oh-seven-nine-eight-five'.",
      "Quên 'mark three' của camera model.",
    ],
    estimated_time_minutes: 8,
    difficulty_band: 6.5,
  },
  {
    id: "ielts_listening_section1_job_phone_screen",
    section: 1,
    context: "social",
    topic_title_vi: "Phỏng vấn điện thoại sơ tuyển việc làm",
    topic_title_en: "Job phone screen",
    audio_script: `RECRUITER: Hi, this is Hannah from BluePeak Recruiting. Is now still a good time?
APPLICANT: Yes, perfect.
RECRUITER: Great. Could you confirm your full name and the role you applied for?
APPLICANT: Yes, my name is Mai Nguyen, and I applied for the customer-success associate role.
RECRUITER: Thank you. How did you hear about us?
APPLICANT: Through LinkedIn — actually, no, sorry, it was a referral from a friend, Daniel Carter.
RECRUITER: Lovely. The role is full-time, thirty-seven and a half hours a week. Salary is twenty-eight thousand pounds plus a five-percent annual bonus. Are those terms acceptable?
APPLICANT: Yes — my expectation was around twenty-seven, so that's fine.
RECRUITER: When could you start?
APPLICANT: I have one month's notice with my current employer, so likely the first of November.
RECRUITER: Perfect. Last question — would you be willing to travel up to two days a month for client meetings, mostly within the UK?
APPLICANT: Yes, that's not a problem.
RECRUITER: I'll arrange the next-stage interview. You'll get an email by Friday with three time slots.`,
    questions: [
      { number: 1, type: "note_completion", question_text: "Role: ____________ associate", correct_answer: "customer-success", explanation_vi: "'Customer-success associate role'." },
      { number: 2, type: "multiple_choice", question_text: "How did the applicant hear about the company?", options: ["A) LinkedIn", "B) referral", "C) jobs board", "D) university careers fair"], correct_answer: "B", explanation_vi: "Self-correction: 'actually, no, sorry, it was a referral'." },
      { number: 3, type: "form_completion", question_text: "Salary: £____________", correct_answer: "28000", explanation_vi: "'Twenty-eight thousand pounds'." },
      { number: 4, type: "note_completion", question_text: "Notice period: ____________ month", correct_answer: "1", explanation_vi: "'One month's notice'." },
      { number: 5, type: "note_completion", question_text: "Travel days per month: ____________", correct_answer: "2", explanation_vi: "'Up to two days a month'." },
    ],
    vocabulary_focus: [
      { word: "referral", ipa: "/rɪˈfɜː.rəl/", vi_translation: "giới thiệu (qua người quen)", band_level: 7, context_use: "Cụm tuyển dụng — được giới thiệu bởi nhân viên hiện tại." },
      { word: "notice period", ipa: "/ˈnoʊ.tɪs ˈpɪər.i.əd/", vi_translation: "thời gian báo trước nghỉ việc", band_level: 7, context_use: "Thời gian phải làm tiếp trước khi nghỉ." },
      { word: "annual bonus", ipa: "/ˈæn.ju.əl ˈboʊ.nəs/", vi_translation: "thưởng hàng năm", band_level: 6, context_use: "'Plus a five-percent annual bonus'." },
      { word: "associate", ipa: "/əˈsoʊ.ʃi.ət/", vi_translation: "chuyên viên", band_level: 7, context_use: "Vị trí cấp dưới senior, trên junior." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_DISTRACTOR,
      STRAT_NUMBERS,
      "'Twenty-eight thousand' = 28,000. 'Twenty-eight hundred' = 2,800. Khác nhau hoàn toàn — nghe kỹ.",
      "'One month' = số ít, không có 's'. Khác 'two months' = số nhiều có 's'.",
      "Job vocabulary band 7+: 'notice period', 'salary expectation', 'pro-rata', 'on-call'.",
    ],
    common_mistakes_vi: [
      "Chốt 'LinkedIn' (đáp án đầu) thay vì 'referral' (sau self-correction).",
      "Viết salary '28' khi yêu cầu đầy đủ £28,000.",
      "Bỏ qua 'up to' khi hỏi về travel days — viết 2 thay vì 'up to 2'.",
    ],
    estimated_time_minutes: 8,
    difficulty_band: 6.5,
  },

  // ─────────────────────────────────────────────────────────────────
  // Section 2 — social-context monologues (8 items)
  // ─────────────────────────────────────────────────────────────────
  {
    id: "ielts_listening_section2_museum_tour",
    section: 2,
    context: "social",
    topic_title_vi: "Hướng dẫn tham quan bảo tàng",
    topic_title_en: "Museum tour introduction",
    audio_script: `Welcome to the Eastfield Maritime Museum. My name is Owen, and I'll be your guide for the next hour or so. Before we start, a few practical notes.

First, the museum is arranged across three floors. The ground floor focuses on early shipbuilding — the period from the seventeenth to the early nineteenth century. The first floor covers the steam age, and the second floor is dedicated to twentieth-century naval history.

Photography is permitted everywhere except in the Treasures Gallery, on the second floor — that's clearly marked. The café is on the ground floor, just past the entrance hall, and the toilets are next to it.

A quick reminder: the audio guide is available in eight languages and costs three pounds — fifty pence less than last year, you'll be glad to hear. You can pick one up at the front desk.

We'll start with the ground floor and work our way up. The tour is roughly ninety minutes; if you'd prefer to break off at any point, please feel free.

One more thing — the temporary exhibition this month is about lighthouse keepers. It's included in your ticket and runs until the end of June. I recommend it.`,
    questions: [
      { number: 1, type: "matching", question_text: "Match each floor with its theme. (Ground / First / Second)", options: ["A) Twentieth-century naval history", "B) Early shipbuilding", "C) Steam age", "D) Modern submarines"], correct_answer: "Ground=B, First=C, Second=A", explanation_vi: "Speaker mô tả rõ từng floor. Matching cần đối chiếu chính xác." },
      { number: 2, type: "multiple_choice", question_text: "Photography is NOT allowed in:", options: ["A) the café", "B) the Treasures Gallery", "C) the entrance hall", "D) any indoor area"], correct_answer: "B", explanation_vi: "'Permitted everywhere except in the Treasures Gallery'." },
      { number: 3, type: "form_completion", question_text: "Audio guide cost: £____________", correct_answer: "3", explanation_vi: "'Three pounds — fifty pence less than last year'." },
      { number: 4, type: "note_completion", question_text: "Tour duration: approximately ____________ minutes", correct_answer: "90", explanation_vi: "'Roughly ninety minutes'." },
      { number: 5, type: "short_answer", question_text: "Subject of temporary exhibition?", correct_answer: "lighthouse keepers", explanation_vi: "'About lighthouse keepers'. Đáp án đầy đủ 2 từ." },
    ],
    vocabulary_focus: [
      { word: "shipbuilding", ipa: "/ˈʃɪpˌbɪl.dɪŋ/", vi_translation: "đóng tàu", band_level: 6, context_use: "Cụm danh từ ghép — ngành nghề lịch sử." },
      { word: "permitted", ipa: "/pəˈmɪt.ɪd/", vi_translation: "được phép", band_level: 6, context_use: "Tính từ — formal hơn 'allowed'." },
      { word: "exhibition", ipa: "/ˌɛk.sɪˈbɪʃ.ən/", vi_translation: "triển lãm", band_level: 5, context_use: "Stress vào âm thứ ba." },
      { word: "naval", ipa: "/ˈneɪ.vəl/", vi_translation: "(thuộc về) hải quân", band_level: 7, context_use: "'Naval history' = lịch sử hải quân. Không nhầm với 'navel' (rốn)." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_PARAPHRASE,
      STRAT_ANTICIPATE,
      "Matching question yêu cầu đối chiếu — đọc trước cả ba lựa chọn để theo kịp speaker.",
      "Số tiền: 'three pounds' = £3. 'Fifty pence' = 50p. Cái 50p chỉ là so sánh với năm trước — không phải đáp án.",
      "Cụm thời gian: 'roughly / approximately / around / about' = khoảng. Học cụm tương đương để nhận paraphrase.",
    ],
    common_mistakes_vi: [
      "Lẫn lộn floor và theme khi matching — cần chuẩn bị bảng nhanh trước khi nghe.",
      "Chốt giá £2.50 do nghe 'fifty pence less than last year' và tính sai.",
      "Viết 'about ninety' thay vì số '90'.",
    ],
    estimated_time_minutes: 8,
    difficulty_band: 6.5,
  },
  {
    id: "ielts_listening_section2_park_orientation",
    section: 2,
    context: "social",
    topic_title_vi: "Giới thiệu công viên quốc gia",
    topic_title_en: "National park orientation",
    audio_script: `Welcome to Highmoor National Park visitor centre. Three quick safety points.

First, weather changes fast — bring a waterproof, even if it's sunny when you start. Second, if you're using the southern trail, note the river crossing has been damaged by recent storms. Use the temporary footbridge two hundred metres east instead.

Three trails are open today. The Lakeside Loop is two kilometres, easy, suitable for families with young children. The Ridge Walk is six kilometres, moderate, with views of the western valley. The Summit Trail is twelve kilometres, strenuous, and not recommended in poor visibility — currently it's closed due to mist on the upper section.

Wildlife reminder: red deer are present, particularly at dusk. Please keep at least fifty metres' distance and never feed them. Dogs must be on leads in all areas.

Last train back to the village station leaves at six-fifteen pm. Don't miss it — the next isn't until tomorrow morning.`,
    questions: [
      { number: 1, type: "multiple_choice", question_text: "Which trail is currently closed?", options: ["A) Lakeside Loop", "B) Ridge Walk", "C) Summit Trail", "D) all open"], correct_answer: "C", explanation_vi: "'Currently it's closed due to mist'." },
      { number: 2, type: "note_completion", question_text: "Use temporary footbridge ____________ metres east of damaged crossing", correct_answer: "200", explanation_vi: "'Two hundred metres east'." },
      { number: 3, type: "form_completion", question_text: "Lakeside Loop length: ____________ km", correct_answer: "2", explanation_vi: "'Two kilometres, easy'." },
      { number: 4, type: "note_completion", question_text: "Min distance from red deer: ____________ metres", correct_answer: "50", explanation_vi: "'At least fifty metres' distance'." },
      { number: 5, type: "form_completion", question_text: "Last train: ____________ pm", correct_answer: "6:15", explanation_vi: "'Six-fifteen pm'." },
    ],
    vocabulary_focus: [
      { word: "strenuous", ipa: "/ˈstrɛn.ju.əs/", vi_translation: "đòi hỏi nhiều sức", band_level: 7, context_use: "Tính từ mô tả mức độ vất vả của trail." },
      { word: "visibility", ipa: "/ˌvɪz.əˈbɪl.ə.ti/", vi_translation: "tầm nhìn (thời tiết)", band_level: 6, context_use: "'Poor visibility' = tầm nhìn kém." },
      { word: "leads", ipa: "/liːdz/", vi_translation: "dây dắt (chó)", band_level: 6, context_use: "UK: dây dắt chó. US: 'leashes'." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_DISTRACTOR,
      STRAT_NUMBERS,
      "'Strenuous' / 'moderate' / 'easy' — tính từ mô tả mức độ. Học cả ba để chọn đúng MCQ.",
      "Cụm thời gian last train: 'six-fifteen' = 6:15, không phải 'fifteen-six'.",
    ],
    common_mistakes_vi: [
      "Chốt 'Lakeside Loop' vì là trail đầu tiên đề cập, bỏ qua 'Summit Trail closed'.",
      "Nhầm 'two hundred' (200) với 'twenty' (20).",
      "Bỏ qua chi tiết dogs must be on leads.",
    ],
    estimated_time_minutes: 8,
    difficulty_band: 6.5,
  },
  {
    id: "ielts_listening_section2_employee_orientation",
    section: 2,
    context: "social",
    topic_title_vi: "Buổi định hướng nhân viên mới",
    topic_title_en: "New employee orientation",
    audio_script: `Welcome, everyone, to your first day at Crestline Logistics. I'm Sarah from HR.

A few orientation points. Working hours are nine to five thirty, with an hour for lunch — flexible between twelve and two. The office building has four floors. Reception and the canteen are on the ground floor. Operations are on the first floor. Your team — finance — is on the second. The fourth floor is reserved for senior leadership and meeting rooms.

Your access cards are now activated and will let you into floors one and two only. If you need to access another floor, ask any senior team member to swipe you in.

Probation period is three months. During that time, you'll have a one-to-one with your line manager every Friday. After probation, those drop to monthly.

Pay day is the twenty-fifth of each month, except in December — that's brought forward to the twentieth so people get paid before Christmas.

Annual leave entitlement is twenty-five days, plus public holidays, accrued from your start date.`,
    questions: [
      { number: 1, type: "matching", question_text: "Match floor to department. (Ground / First / Second)", options: ["A) Operations", "B) Reception + canteen", "C) Finance", "D) Senior leadership"], correct_answer: "Ground=B, First=A, Second=C", explanation_vi: "Speaker liệt kê thứ tự — chú ý theo dõi." },
      { number: 2, type: "note_completion", question_text: "Probation period: ____________ months", correct_answer: "3", explanation_vi: "'Three months'." },
      { number: 3, type: "note_completion", question_text: "December pay day: ____________", correct_answer: "20th / 20", explanation_vi: "'Brought forward to the twentieth' = 20." },
      { number: 4, type: "form_completion", question_text: "Annual leave: ____________ days", correct_answer: "25", explanation_vi: "'Twenty-five days, plus public holidays'." },
      { number: 5, type: "multiple_choice", question_text: "1-to-1 with line manager during probation:", options: ["A) daily", "B) weekly", "C) fortnightly", "D) monthly"], correct_answer: "B", explanation_vi: "'Every Friday' = weekly. Monthly chỉ áp dụng SAU probation." },
    ],
    vocabulary_focus: [
      { word: "probation", ipa: "/prəˈbeɪ.ʃən/", vi_translation: "thời gian thử việc", band_level: 7, context_use: "Workplace term — thường 3 tháng." },
      { word: "one-to-one", ipa: "/ˌwʌn.təˈwʌn/", vi_translation: "buổi làm việc 1-1", band_level: 7, context_use: "UK office speak. Mỹ: 'one-on-one'." },
      { word: "accrued", ipa: "/əˈkruːd/", vi_translation: "tích luỹ", band_level: 8, context_use: "'Accrued from your start date' = tính từ ngày bắt đầu." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_DISTRACTOR,
      STRAT_PARAPHRASE,
      "Matching: chuẩn bị bảng floor x department TRƯỚC khi nghe.",
      "'Brought forward' = đẩy sớm hơn. 'Pushed back' = trễ hơn. Cặp đối lập band 7.",
    ],
    common_mistakes_vi: [
      "Chốt monthly cho 1-to-1 vì nghe 'monthly' phía sau (sau probation).",
      "Viết December pay là 25 thay vì 20 (đặc biệt cho December).",
      "Bỏ 'plus public holidays' — không cần ghi vào answer cho 25 days.",
    ],
    estimated_time_minutes: 8,
    difficulty_band: 7.5,
  },
  {
    id: "ielts_listening_section2_festival_announcement",
    section: 2,
    context: "social",
    topic_title_vi: "Thông báo lễ hội cộng đồng",
    topic_title_en: "Community festival announcement",
    audio_script: `Hello everyone, and thank you for joining us for the eighteenth Greenmount Community Festival.

This year's festival runs across three days, the seventh, eighth, and ninth of July. Most events are free, with a small charge for the food market on Saturday — three pounds entry, children under twelve free.

The opening parade leaves the town square at ten am sharp on Friday. Floats this year include a giant origami swan from the local arts club, a steel-band float from the school music programme, and a vintage tractor display.

Saturday's main event is the live-music stage at Holborn Park. Six bands across the day, starting at one pm. Headline act is at eight thirty in the evening — that's a band you may know, The Riverbirds.

Sunday is family day. Activities include face painting, a bouncy castle — actually, sorry, no bouncy castle this year due to safety regulations — instead we have a climbing wall.

Parking is free at the leisure centre on all three days, but expect a fifteen-minute walk to the town square.`,
    questions: [
      { number: 1, type: "form_completion", question_text: "Saturday food market entry: £____________", correct_answer: "3", explanation_vi: "'Three pounds entry, children under twelve free'." },
      { number: 2, type: "note_completion", question_text: "Parade departs town square at ____________ am", correct_answer: "10", explanation_vi: "'Ten am sharp on Friday'." },
      { number: 3, type: "note_completion", question_text: "Saturday headline act: ____________ pm", correct_answer: "8:30", explanation_vi: "'Eight thirty in the evening'." },
      { number: 4, type: "multiple_choice", question_text: "Sunday family-day attraction:", options: ["A) bouncy castle", "B) climbing wall", "C) face painting only", "D) magic show"], correct_answer: "B", explanation_vi: "Self-correction: 'no bouncy castle this year ... instead we have a climbing wall'." },
      { number: 5, type: "note_completion", question_text: "Walk from leisure-centre parking: ____________ minutes", correct_answer: "15", explanation_vi: "'A fifteen-minute walk'." },
    ],
    vocabulary_focus: [
      { word: "parade", ipa: "/pəˈreɪd/", vi_translation: "diễu hành", band_level: 6, context_use: "Stress vào âm thứ hai." },
      { word: "headline act", ipa: "/ˈhɛd.laɪn ækt/", vi_translation: "tiết mục chính", band_level: 7, context_use: "Tiết mục lớn nhất, biểu diễn cuối." },
      { word: "vintage", ipa: "/ˈvɪn.tɪdʒ/", vi_translation: "cổ điển, xưa", band_level: 7, context_use: "Mô tả đồ vật cũ có giá trị, không phải hỏng." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_DISTRACTOR,
      STRAT_NUMBERS,
      "Self-correction phổ biến trong Section 2: 'actually, sorry...' báo hiệu đáp án thật theo sau.",
      "Cụm 'sharp' theo sau giờ = đúng giờ ('ten am sharp' = 10:00 chính xác).",
    ],
    common_mistakes_vi: [
      "Chốt 'bouncy castle' vì là attraction được đề cập đầu tiên.",
      "Nhầm '8:30 am' và '8:30 pm' nếu không nghe rõ 'in the evening'.",
      "Viết walk là '15 minutes' khi yêu cầu chỉ số.",
    ],
    estimated_time_minutes: 8,
    difficulty_band: 6.5,
  },
  {
    id: "ielts_listening_section2_volunteer_program",
    section: 2,
    context: "social",
    topic_title_vi: "Giới thiệu chương trình tình nguyện",
    topic_title_en: "Volunteer programme brief",
    audio_script: `Welcome to the Riverbank Conservation volunteer briefing. I'm Marcus, the volunteer coordinator.

The programme runs every Saturday from April through October. We meet at the boathouse at eight thirty am. Sessions are roughly three hours, finishing by midday — you're welcome to stay for our shared lunch afterwards if you bring something to contribute.

Required clothing: closed-toe shoes — boots are best — long trousers, and a hat in summer months. We provide gloves, high-vis jackets, and tools. Please don't bring valuables; there's nowhere secure to leave them.

This year's three priority projects are riverbank planting, invasive-species removal, and bird-box installation. Each volunteer chooses a project at the start of the season and stays with it. Switching is allowed but only at the halfway point in July.

We ask for a minimum commitment of four sessions across the season. You'll receive a certificate after eight sessions, which several volunteers have used in university applications.

Insurance is included while you're on site. Please complete the safety form before your first session — it takes about ten minutes.`,
    questions: [
      { number: 1, type: "form_completion", question_text: "Meeting time: ____________ am", correct_answer: "8:30", explanation_vi: "'Eight thirty am'." },
      { number: 2, type: "matching", question_text: "Volunteers must bring: clothing items", options: ["A) closed-toe shoes / boots", "B) gloves", "C) hat (summer)", "D) long trousers", "E) high-vis jacket"], correct_answer: "A, C, D (gloves and high-vis are provided)", explanation_vi: "Speaker phân biệt 'we provide' (B+E) với required cho volunteer (A, C, D)." },
      { number: 3, type: "short_answer", question_text: "When can volunteers switch projects?", correct_answer: "halfway / July", explanation_vi: "'Halfway point in July'." },
      { number: 4, type: "note_completion", question_text: "Min commitment: ____________ sessions", correct_answer: "4", explanation_vi: "'Four sessions across the season'." },
      { number: 5, type: "note_completion", question_text: "Certificate after ____________ sessions", correct_answer: "8", explanation_vi: "'After eight sessions'." },
    ],
    vocabulary_focus: [
      { word: "invasive species", ipa: "/ɪnˈveɪ.sɪv ˈspiː.ʃiːz/", vi_translation: "loài xâm hại", band_level: 8, context_use: "Cụm sinh thái — loài ngoại lai làm hại bản địa." },
      { word: "high-vis jacket", ipa: "/haɪ vɪz ˈdʒæk.ɪt/", vi_translation: "áo phản quang", band_level: 6, context_use: "UK term — cụm tắt 'high-visibility'." },
      { word: "commitment", ipa: "/kəˈmɪt.mənt/", vi_translation: "cam kết", band_level: 6, context_use: "'Minimum commitment of four sessions'." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_PARAPHRASE,
      STRAT_DISTRACTOR,
      "Cẩn thận khi speaker phân biệt 'we provide' và 'you bring' — câu hỏi dễ trộn.",
      "Số ít / số nhiều: 'four sessions' (s) khác '4 session' (sai).",
    ],
    common_mistakes_vi: [
      "Liệt kê 'gloves' vào câu trả lời 'volunteers must bring' (sai — gloves provided).",
      "Quên cụm 'in summer' cho hat — chỉ cần khi mùa hè.",
      "Chốt 'in April' vì là tháng đầu, bỏ qua chi tiết switching at halfway/July.",
    ],
    estimated_time_minutes: 8,
    difficulty_band: 7.5,
  },
  {
    id: "ielts_listening_section2_train_announcement",
    section: 2,
    context: "social",
    topic_title_vi: "Thông báo ga tàu",
    topic_title_en: "Train station announcement",
    audio_script: `Attention please. The fourteen-twenty service to Birmingham New Street has been cancelled due to a signalling fault. Customers travelling to Birmingham, please use the fourteen forty-five service from platform six instead. That's a slightly slower service, calling additionally at Coventry and Rugby.

The fifteen-oh-five service to Manchester Piccadilly is delayed by approximately forty minutes due to a fallen tree on the line near Stafford. We apologise for the disruption. The estimated departure is now fifteen forty-five from platform two.

Customers with onward connections beyond Manchester should approach the help desk in the main concourse for advice. Compensation forms are available at the desk and can also be downloaded from our website.

The buffet on platform one is open until ten pm tonight, with extended hours due to the disruption. Hot drinks and snacks are at standard prices; sandwiches will be discounted by twenty percent from now until the end of service.

Please keep an eye on the information screens, where the latest updates are shown.`,
    questions: [
      { number: 1, type: "form_completion", question_text: "Birmingham replacement service: ____________ from platform ____________", correct_answer: "14:45, 6", explanation_vi: "'Fourteen forty-five service from platform six'." },
      { number: 2, type: "matching", question_text: "Reason for each disruption (Birmingham / Manchester)", options: ["A) signalling fault", "B) fallen tree", "C) staff shortage", "D) weather"], correct_answer: "Birmingham=A, Manchester=B", explanation_vi: "Speaker nêu rõ từng lý do." },
      { number: 3, type: "note_completion", question_text: "Manchester delay: ~____________ minutes", correct_answer: "40", explanation_vi: "'Approximately forty minutes'." },
      { number: 4, type: "note_completion", question_text: "Buffet open until: ____________ pm", correct_answer: "10", explanation_vi: "'Open until ten pm tonight'." },
      { number: 5, type: "note_completion", question_text: "Sandwich discount: ____________%", correct_answer: "20", explanation_vi: "'Discounted by twenty percent'." },
    ],
    vocabulary_focus: [
      { word: "signalling fault", ipa: "/ˈsɪg.nəl.ɪŋ fɔːlt/", vi_translation: "lỗi tín hiệu (đường ray)", band_level: 8, context_use: "Cụm chuyên ngành tàu UK." },
      { word: "concourse", ipa: "/ˈkɒŋ.kɔːs/", vi_translation: "sảnh chính (ga, sân bay)", band_level: 7, context_use: "'In the main concourse'." },
      { word: "compensation", ipa: "/ˌkɒm.pənˈseɪ.ʃən/", vi_translation: "đền bù", band_level: 7, context_use: "'Compensation forms' = đơn xin đền bù khi tàu trễ/huỷ." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_NUMBERS,
      STRAT_PARAPHRASE,
      "Thông báo tàu UK dùng 24-hour clock: 'fourteen-twenty' = 14:20 = 2:20 pm.",
      "'Approximately' / 'roughly' / 'around' tất cả = khoảng. Đáp án vẫn là số chính xác (40 phút).",
    ],
    common_mistakes_vi: [
      "Nhầm 'fourteen forty-five' với 'fourteen forty' (14:40).",
      "Viết 'platform 2' thay vì '6' (lẫn các platform).",
      "Bỏ qua chi tiết 20% discount vì sandwich không phải mục chính.",
    ],
    estimated_time_minutes: 8,
    difficulty_band: 7.5,
  },
  {
    id: "ielts_listening_section2_restaurant_tour",
    section: 2,
    context: "social",
    topic_title_vi: "Giới thiệu nhà hàng cho khách doanh nghiệp",
    topic_title_en: "Restaurant tour for corporate guests",
    audio_script: `Welcome to The Old Mill. As the duty manager, I'd like to give you a quick tour before your group sits down.

We're in the original mill building, dating from eighteen thirty-two. The downstairs dining room — where you'll be eating — was the grain store. Notice the original wooden beams in the ceiling.

Upstairs we have a private function room that seats up to forty. We mention this in case you'd like to book it for a future event — there's a fixed hire fee of two hundred and twenty-five pounds, which includes table linen and basic decoration.

The terrace at the back overlooks the river and is open from May to September, weather permitting. Bookings can request the terrace specifically; we hold half the tables outside on warm evenings.

The kitchen is open from twelve until ten. Last orders for hot food are at nine forty-five. We have a separate vegan menu and a gluten-free menu — please mention any allergies when ordering.

Tonight's special is pan-fried sea bass — that's twenty-two pounds, including a glass of house white wine.`,
    questions: [
      { number: 1, type: "note_completion", question_text: "Original building date: ____________", correct_answer: "1832", explanation_vi: "'Eighteen thirty-two' = 1832." },
      { number: 2, type: "form_completion", question_text: "Function room hire fee: £____________", correct_answer: "225", explanation_vi: "'Two hundred and twenty-five pounds'." },
      { number: 3, type: "form_completion", question_text: "Last orders for hot food: ____________ pm", correct_answer: "9:45", explanation_vi: "'Nine forty-five'." },
      { number: 4, type: "matching", question_text: "Match menu type to availability", options: ["A) gluten-free", "B) vegan", "C) keto"], correct_answer: "Both A and B available; C not mentioned", explanation_vi: "Speaker only mentions vegan + gluten-free." },
      { number: 5, type: "form_completion", question_text: "Tonight's special: £____________", correct_answer: "22", explanation_vi: "'Twenty-two pounds, including a glass of house white wine'." },
    ],
    vocabulary_focus: [
      { word: "duty manager", ipa: "/ˈdjuː.ti ˈmæn.ɪ.dʒə/", vi_translation: "quản lý ca trực", band_level: 7, context_use: "Hospitality term — quản lý đang trực ca." },
      { word: "weather permitting", ipa: "/ˈwɛð.ə pəˈmɪt.ɪŋ/", vi_translation: "nếu thời tiết cho phép", band_level: 7, context_use: "Cụm cố định — phụ thuộc vào thời tiết." },
      { word: "table linen", ipa: "/ˈteɪ.bəl ˈlɪn.ɪn/", vi_translation: "khăn trải bàn", band_level: 8, context_use: "Cụm formal — khăn trải bàn đẹp dùng cho function." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_NUMBERS,
      STRAT_PARAPHRASE,
      "Cách đọc năm: 'eighteen thirty-two' = 1832 (UK). 'Two thousand and twenty-three' = 2023.",
      "Cụm 'permitting' / 'permitted' phân biệt: 'weather permitting' = nếu thời tiết cho phép; 'permitted' = được phép.",
    ],
    common_mistakes_vi: [
      "Viết năm là '1830' do nghe lướt 'thirty-two'.",
      "Chốt £25 cho hire fee thay vì £225 (lẫn 'twenty-five' cuối).",
      "Liệt kê 'keto' (không có) trong menu types.",
    ],
    estimated_time_minutes: 8,
    difficulty_band: 7.5,
  },
  {
    id: "ielts_listening_section2_charity_intro",
    section: 2,
    context: "social",
    topic_title_vi: "Giới thiệu sự kiện gây quỹ từ thiện",
    topic_title_en: "Charity event introduction",
    audio_script: `Good evening, everyone, and thank you for coming to the annual Brookhaven Children's Charity gala. I'm Elena, the events director.

This year is our twentieth anniversary. Since two thousand and four, the charity has supported children with chronic illness, focusing primarily on funding home-based care that keeps families together.

Our target tonight is sixty thousand pounds. Last year we raised fifty-two; this year we're hoping the silent auction and the raffle, combined, will push us over.

Quick programme overview. The starter is being served now. Speeches will follow at seven thirty — short ones, I promise. The auction opens at eight, with bidding closing at nine. Live music from a local jazz quartet runs from nine fifteen until eleven.

A note on the auction: bids are placed using your table number plus a bidding letter — A for table one, B for table two, and so on. Please confirm your table number with your host.

Finally — donations beyond your ticket can be gift-aided if you're a UK taxpayer, which lets us claim an extra twenty-five percent from the government at no cost to you.`,
    questions: [
      { number: 1, type: "note_completion", question_text: "Charity founded: ____________", correct_answer: "2004", explanation_vi: "'Since two thousand and four'." },
      { number: 2, type: "form_completion", question_text: "This year's target: £____________", correct_answer: "60000", explanation_vi: "'Sixty thousand pounds'." },
      { number: 3, type: "form_completion", question_text: "Speeches start at: ____________ pm", correct_answer: "7:30", explanation_vi: "'Speeches will follow at seven thirty'." },
      { number: 4, type: "note_completion", question_text: "Auction closes at: ____________ pm", correct_answer: "9", explanation_vi: "'Bidding closing at nine'." },
      { number: 5, type: "note_completion", question_text: "Gift Aid bonus: ____________%", correct_answer: "25", explanation_vi: "'An extra twenty-five percent from the government'." },
    ],
    vocabulary_focus: [
      { word: "raffle", ipa: "/ˈræf.əl/", vi_translation: "xổ số từ thiện", band_level: 7, context_use: "Bốc thăm trúng thưởng để gây quỹ." },
      { word: "silent auction", ipa: "/ˈsaɪ.lənt ˈɔːk.ʃən/", vi_translation: "đấu giá im lặng (viết bid)", band_level: 8, context_use: "Đấu giá viết bid trên giấy thay vì hô." },
      { word: "gift-aided", ipa: "/gɪft ˈeɪ.dɪd/", vi_translation: "được miễn thuế (UK donation)", band_level: 9, context_use: "UK-specific — chỉ người đóng thuế UK." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_NUMBERS,
      STRAT_PARAPHRASE,
      "'Two thousand and four' = 2004 (cách UK). 'Twenty-oh-four' cũng được nghe.",
      "Số tiền lớn: 'sixty thousand' = 60,000. Đừng nhầm với 'sixty hundred' (= 6,000) — không tự nhiên trong tiếng Anh.",
    ],
    common_mistakes_vi: [
      "Viết founded year là '2014' do nghe lướt.",
      "Chốt £52,000 (last year) thay vì £60,000 (target).",
      "Bỏ qua chi tiết 'twenty-five percent' Gift Aid bonus.",
    ],
    estimated_time_minutes: 8,
    difficulty_band: 7.5,
  },

  // ─────────────────────────────────────────────────────────────────
  // Section 3 — academic discussions, 2–4 speakers (8 items)
  // ─────────────────────────────────────────────────────────────────
  {
    id: "ielts_listening_section3_dissertation_consult",
    section: 3,
    context: "academic",
    topic_title_vi: "Tham vấn giáo viên về luận văn",
    topic_title_en: "Tutorial on dissertation focus",
    audio_script: `TUTOR: So, Mai, you're considering two directions for your dissertation. Let's talk through them.
STUDENT: Yes — option one is urban-cycling adoption in Southeast Asia, option two is shared mobility schemes more broadly.
TUTOR: My instinct is the cycling focus. It's more specific and the data set is cleaner. The broader shared-mobility topic is interesting but it's been studied a lot.
STUDENT: That was my worry — finding original contribution.
TUTOR: Right. Within urban cycling, you could narrow further. What about comparing two cities that introduced bike-sharing schemes in similar years but had different uptake?
STUDENT: Hanoi and Bangkok would work — both started programmes around twenty-twenty.
TUTOR: Excellent. Methodology — quantitative analysis of ridership data, plus a small set of stakeholder interviews?
STUDENT: I was thinking interviews only. But quantitative would strengthen it.
TUTOR: Mixed methods is harder but more credible. Aim for fifteen thousand words. Submit your literature-review chapter by the end of February — that's six weeks from now.
STUDENT: One more question — secondary data. Where can I get ridership numbers?
TUTOR: The municipal transport authorities both publish annual reports. I'll send you the links.`,
    questions: [
      { number: 1, type: "multiple_choice", question_text: "Tutor recommends focus on:", options: ["A) shared mobility broadly", "B) urban cycling adoption", "C) ridership economics", "D) bike maintenance"], correct_answer: "B", explanation_vi: "'My instinct is the cycling focus'." },
      { number: 2, type: "matching", question_text: "Cities for comparison:", options: ["A) Hanoi", "B) Bangkok", "C) Jakarta", "D) Manila"], correct_answer: "A and B", explanation_vi: "'Hanoi and Bangkok would work'." },
      { number: 3, type: "multiple_choice", question_text: "Final methodology agreed:", options: ["A) interviews only", "B) quantitative only", "C) mixed methods", "D) case study"], correct_answer: "C", explanation_vi: "Student initially thought interviews only, then accepted mixed." },
      { number: 4, type: "form_completion", question_text: "Word count target: ____________ words", correct_answer: "15000", explanation_vi: "'Fifteen thousand words'." },
      { number: 5, type: "note_completion", question_text: "Lit-review deadline: end of ____________", correct_answer: "February", explanation_vi: "'End of February — that's six weeks from now'." },
    ],
    vocabulary_focus: [
      { word: "uptake", ipa: "/ˈʌp.teɪk/", vi_translation: "tỉ lệ áp dụng", band_level: 7, context_use: "Học thuật — mức độ chấp nhận của một chương trình." },
      { word: "stakeholder", ipa: "/ˈsteɪkˌhoʊl.də/", vi_translation: "bên liên quan", band_level: 7, context_use: "Người có lợi ích trong dự án." },
      { word: "mixed methods", ipa: "/mɪkst ˈmɛθ.ədz/", vi_translation: "phương pháp kết hợp định tính + định lượng", band_level: 8, context_use: "Methodology học thuật chuẩn." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_DISTRACTOR,
      STRAT_PARAPHRASE,
      "Section 3 multi-speaker: phân biệt opinion của tutor và student. Đáp án thường là CONSENSUS cuối, không phải gợi ý đầu.",
      "Học thuật vocabulary band 7+: 'methodology', 'literature review', 'stakeholder', 'longitudinal'.",
    ],
    common_mistakes_vi: [
      "Chốt 'interviews only' (gợi ý đầu của student) thay vì 'mixed methods' (consensus cuối).",
      "Viết 15,000 thành '15 thousand' khi yêu cầu số.",
      "Lẫn deadline: 'end of February' khác '6 weeks from now' (dù cùng đáp án).",
    ],
    estimated_time_minutes: 8,
    difficulty_band: 7.5,
  },
  {
    id: "ielts_listening_section3_group_project",
    section: 3,
    context: "academic",
    topic_title_vi: "Họp nhóm dự án lớp",
    topic_title_en: "Group project meeting",
    audio_script: `LEAD: So we have three weeks. Let's split the workload. Linh, the literature review?
LINH: Yeah, I can take that. I've already got most of the sources.
LEAD: Great. James, the data analysis section?
JAMES: I'd prefer the survey design — I've done that before. Could someone else do the analysis?
LEAD: Sara, would you be okay with analysis?
SARA: Yes, I can. But I'll need help with the statistical software — I haven't used SPSS in two years.
LEAD: I can help with SPSS. Right — I'll take the introduction and conclusion.
JAMES: What about the presentation slides?
LEAD: Let's do that together in the final week, after the writing's done.
SARA: We should also decide on a meeting cadence.
LEAD: Twice a week? Tuesday and Friday afternoons?
LINH: Friday after my four-pm class — could we do five thirty?
LEAD: Yes, five thirty Friday and four pm Tuesday. Agreed?
ALL: Agreed.
LEAD: One more thing — Professor Hartley wants progress emails every Monday. I'll send those, copying everyone.`,
    questions: [
      { number: 1, type: "matching", question_text: "Match person to task: Linh / James / Sara / Lead", options: ["A) data analysis", "B) survey design", "C) literature review", "D) intro + conclusion"], correct_answer: "Linh=C, James=B, Sara=A, Lead=D", explanation_vi: "Speakers swap tasks during discussion — track final assignment carefully." },
      { number: 2, type: "short_answer", question_text: "Software Sara needs help with?", correct_answer: "SPSS", explanation_vi: "'I'll need help with the statistical software — I haven't used SPSS'." },
      { number: 3, type: "note_completion", question_text: "Tuesday meeting: ____________ pm", correct_answer: "4", explanation_vi: "'Four pm Tuesday'." },
      { number: 4, type: "note_completion", question_text: "Friday meeting: ____________ pm", correct_answer: "5:30", explanation_vi: "'Five thirty Friday'." },
      { number: 5, type: "multiple_choice", question_text: "Who sends progress emails?", options: ["A) Linh", "B) Sara", "C) James", "D) Lead"], correct_answer: "D", explanation_vi: "'I'll send those, copying everyone'." },
    ],
    vocabulary_focus: [
      { word: "workload", ipa: "/ˈwɜːk.loʊd/", vi_translation: "khối lượng công việc", band_level: 6, context_use: "'Split the workload' = chia việc." },
      { word: "cadence", ipa: "/ˈkeɪ.dəns/", vi_translation: "nhịp độ", band_level: 8, context_use: "'Meeting cadence' = tần suất họp." },
      { word: "copying", ipa: "/ˈkɒp.i.ɪŋ/", vi_translation: "gửi cc trong email", band_level: 6, context_use: "Email term — copying everyone = cc cho mọi người." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_DISTRACTOR,
      STRAT_PARAPHRASE,
      "Multi-speaker matching: chú ý tới swap giữa các thành viên. Final assignment, không phải first suggestion.",
      "Email vocabulary: 'cc' đọc là 'copying'. Học cụm chính thức.",
    ],
    common_mistakes_vi: [
      "Gán James cho data analysis (gợi ý đầu) thay vì survey design (sau khi swap).",
      "Bỏ qua chi tiết Sara cần SPSS help.",
      "Nhầm Tuesday và Friday timings.",
    ],
    estimated_time_minutes: 8,
    difficulty_band: 7.5,
  },
  {
    id: "ielts_listening_section3_field_trip_planning",
    section: 3,
    context: "academic",
    topic_title_vi: "Lên kế hoạch chuyến đi thực địa",
    topic_title_en: "Field trip planning",
    audio_script: `TUTOR: Right — three options for the geology field trip in March. Let's discuss each.
STUDENT_A: Option one is the Lake District — accessible, well-documented, but heavily visited.
STUDENT_B: Option two — the Welsh coast. More dramatic geology, but a longer journey.
STUDENT_A: And option three is Northern Ireland — exceptional volcanic features but flights are needed.
TUTOR: From a teaching standpoint, Welsh coast gives the broadest range. The volcanic features in Northern Ireland are dramatic but cover only one topic area.
STUDENT_B: Cost is the issue with Northern Ireland — flights are about a hundred and twenty pounds each.
STUDENT_A: Versus a coach to Wales at maybe thirty.
TUTOR: Quite a difference. Let's agree on the Welsh coast.
STUDENT_B: Duration?
TUTOR: Four days, including travel. Departing Monday morning, returning Thursday evening.
STUDENT_A: Accommodation?
TUTOR: There's a youth hostel near Pembroke that the department has used before. Twenty-eight pounds per person per night, including breakfast.
STUDENT_B: Equipment?
TUTOR: Bring waterproofs, walking boots, and a notebook. We'll provide rock hammers, sample bags, and the geology hand lenses.
STUDENT_A: One last thing — assessment?
TUTOR: A field report due two weeks after we return.`,
    questions: [
      { number: 1, type: "multiple_choice", question_text: "Destination chosen:", options: ["A) Lake District", "B) Welsh coast", "C) Northern Ireland", "D) Scottish Highlands"], correct_answer: "B", explanation_vi: "'Let's agree on the Welsh coast'." },
      { number: 2, type: "form_completion", question_text: "Northern Ireland flight cost: £____________", correct_answer: "120", explanation_vi: "'About a hundred and twenty pounds each'." },
      { number: 3, type: "note_completion", question_text: "Trip duration: ____________ days", correct_answer: "4", explanation_vi: "'Four days, including travel'." },
      { number: 4, type: "form_completion", question_text: "Hostel cost: £____________ per person per night", correct_answer: "28", explanation_vi: "'Twenty-eight pounds per person per night'." },
      { number: 5, type: "matching", question_text: "Bring vs Provided. (rock hammers / waterproofs / sample bags / notebook)", options: ["A) Bring", "B) Provided"], correct_answer: "rock hammers=B, waterproofs=A, sample bags=B, notebook=A", explanation_vi: "Tutor liệt kê rõ what to bring vs what's provided." },
    ],
    vocabulary_focus: [
      { word: "field trip", ipa: "/fiːld trɪp/", vi_translation: "chuyến đi thực địa", band_level: 6, context_use: "Học thuật — chuyến đi học ngoài trời." },
      { word: "accommodation", ipa: "/əˌkɒm.əˈdeɪ.ʃən/", vi_translation: "chỗ ở", band_level: 6, context_use: "UK spelling. Mỹ: 'accommodations'." },
      { word: "youth hostel", ipa: "/juːθ ˈhɒs.təl/", vi_translation: "nhà nghỉ giá rẻ", band_level: 6, context_use: "Lưu trú giá rẻ phổ biến cho sinh viên." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_DISTRACTOR,
      STRAT_PARAPHRASE,
      "Section 3 hay có 3-option discussion với consensus cuối. Đừng chốt option 1 đầu tiên.",
      "'Provide' (cung cấp) khác 'bring' (mang theo) — phân biệt khi matching.",
    ],
    common_mistakes_vi: [
      "Chốt 'Northern Ireland' vì 'exceptional volcanic features' nghe ấn tượng.",
      "Nhầm '£120' với '£12' nếu không bắt được 'a hundred and twenty'.",
      "Liệt kê notebook vào 'provided' — sai (notebook là bring).",
    ],
    estimated_time_minutes: 8,
    difficulty_band: 7.5,
  },
  {
    id: "ielts_listening_section3_lab_partner",
    section: 3,
    context: "academic",
    topic_title_vi: "Trao đổi với bạn cùng lab",
    topic_title_en: "Lab partner discussion",
    audio_script: `STUDENT_A: We need to write up the results from yesterday's experiment. Where do we start?
STUDENT_B: I'd suggest the methods section first — it's the easiest because we just describe what we did.
STUDENT_A: Agreed. But should we include the failed first attempt?
STUDENT_B: Definitely. Tutors expect to see honest reporting of failures — it's how scientific writing works.
STUDENT_A: Good point. Now — the data. The temperature reading at twenty minutes seems off.
STUDENT_B: I noticed that too. Could be instrument drift. We should flag it but not exclude it.
STUDENT_A: Should we re-run the experiment?
STUDENT_B: We don't have time. Two days till submission.
STUDENT_A: Right. So we discuss the anomaly in the limitations section.
STUDENT_B: Exactly. Now the conclusions — I think the data supports our hypothesis, with caveats.
STUDENT_A: Caveats around the anomalous reading?
STUDENT_B: Yes, plus the small sample size. Five trials isn't a lot.
STUDENT_A: Should we recommend follow-up work?
STUDENT_B: Yes — that's expected. Recommend a larger sample, ideally fifty trials, with calibrated equipment.
STUDENT_A: I'll draft methods and results tonight. You take discussion and conclusion?
STUDENT_B: Deal. Send by tomorrow lunchtime so we can merge.`,
    questions: [
      { number: 1, type: "multiple_choice", question_text: "Should the failed first attempt be included?", options: ["A) no — confusing", "B) yes — honest reporting", "C) yes — but in appendix only", "D) optional"], correct_answer: "B", explanation_vi: "'Tutors expect to see honest reporting of failures'." },
      { number: 2, type: "short_answer", question_text: "Likely cause of anomalous temperature reading?", correct_answer: "instrument drift", explanation_vi: "'Could be instrument drift'." },
      { number: 3, type: "note_completion", question_text: "Anomaly should be discussed in: ____________ section", correct_answer: "limitations", explanation_vi: "'Discuss the anomaly in the limitations section'." },
      { number: 4, type: "note_completion", question_text: "Recommended follow-up sample size: ____________ trials", correct_answer: "50", explanation_vi: "'Ideally fifty trials'." },
      { number: 5, type: "matching", question_text: "Who drafts what? Student A / Student B", options: ["A) methods + results", "B) discussion + conclusion"], correct_answer: "A=A, B=B", explanation_vi: "'I'll draft methods and results tonight. You take discussion and conclusion'." },
    ],
    vocabulary_focus: [
      { word: "anomaly", ipa: "/əˈnɒm.ə.li/", vi_translation: "sai lệch bất thường", band_level: 8, context_use: "'Anomalous reading' = số đo bất thường." },
      { word: "limitations", ipa: "/ˌlɪm.ɪˈteɪ.ʃənz/", vi_translation: "hạn chế (của nghiên cứu)", band_level: 7, context_use: "Section trong report nêu các yếu tố hạn chế." },
      { word: "calibrated", ipa: "/ˈkæl.ɪ.breɪ.tɪd/", vi_translation: "đã hiệu chuẩn", band_level: 8, context_use: "Equipment đã được đo chuẩn lại." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_PARAPHRASE,
      STRAT_DISTRACTOR,
      "Section 3 thường test inference: 'Why include failures?' đáp án ở câu giải thích, không nguyên văn từ học sinh.",
      "Lab vocabulary band 8+: 'instrument drift', 'anomalous', 'calibrated', 'replication'.",
    ],
    common_mistakes_vi: [
      "Chốt 'no — confusing' vì học sinh A ban đầu hỏi nghi ngờ.",
      "Nhầm 'fifty trials' với 'five trials' (current sample) — đáp án là follow-up.",
      "Lẫn ai làm methods (Student A) vs discussion (Student B).",
    ],
    estimated_time_minutes: 8,
    difficulty_band: 7.5,
  },
  {
    id: "ielts_listening_section3_tutorial_review",
    section: 3,
    context: "academic",
    topic_title_vi: "Buổi tutorial xem lại bài luận",
    topic_title_en: "Tutorial review session",
    audio_script: `TUTOR: Your essay had strong points. Let's go through them, then the weaknesses.
STUDENT: Sure.
TUTOR: Strengths first. Your introduction is clear — it states the question and your position. Your topic sentences in body paragraphs two and three are sharp.
STUDENT: Thank you.
TUTOR: Now weaknesses. Three things. First, body paragraph one has too many examples and too little analysis. You list three case studies but don't draw a comparative conclusion.
STUDENT: Right — I rushed that one.
TUTOR: Second, your conclusion just summarises. A strong conclusion adds an insight or implication, not just a recap.
STUDENT: I'll work on that.
TUTOR: Third, citations. You reference Smith twenty-twenty in two places but they're missing from your bibliography. That's a serious error — could be flagged as plagiarism in a final submission.
STUDENT: I'll fix that immediately.
TUTOR: Overall I'd give this a sixty-eight percent — high upper-second. With those three fixes, it's solidly seventy-plus.
STUDENT: That's encouraging. Could I resubmit?
TUTOR: For practice, yes. For grading, no — the deadline has passed. But a resubmission would help your final-paper writing.`,
    questions: [
      { number: 1, type: "multiple_choice", question_text: "Strongest part of essay:", options: ["A) introduction", "B) conclusion", "C) bibliography", "D) examples"], correct_answer: "A", explanation_vi: "'Your introduction is clear'. Conclusion + body paragraph 1 đều có vấn đề." },
      { number: 2, type: "matching", question_text: "Match weakness to paragraph: body 1 / conclusion / citations", options: ["A) too many examples, no analysis", "B) just summarises", "C) missing from bibliography"], correct_answer: "body 1=A, conclusion=B, citations=C", explanation_vi: "Tutor liệt kê rõ từng weakness gắn với từng phần." },
      { number: 3, type: "form_completion", question_text: "Current grade: ____________%", correct_answer: "68", explanation_vi: "'Sixty-eight percent — high upper-second'." },
      { number: 4, type: "note_completion", question_text: "Potential grade with fixes: ____________%+", correct_answer: "70", explanation_vi: "'Solidly seventy-plus'." },
      { number: 5, type: "multiple_choice", question_text: "Can student resubmit for grading?", options: ["A) yes, anytime", "B) yes, before exam", "C) no, only for practice", "D) no, never"], correct_answer: "C", explanation_vi: "'For practice, yes. For grading, no'." },
    ],
    vocabulary_focus: [
      { word: "topic sentence", ipa: "/ˈtɒp.ɪk ˈsɛn.təns/", vi_translation: "câu chủ đề", band_level: 7, context_use: "Câu đầu đoạn nêu controlling idea." },
      { word: "upper-second", ipa: "/ˈʌp.ə ˈsɛk.ənd/", vi_translation: "loại 2 trên (UK degree)", band_level: 8, context_use: "60-69% trong UK university grading." },
      { word: "bibliography", ipa: "/ˌbɪb.liˈɒg.rə.fi/", vi_translation: "danh mục tài liệu tham khảo", band_level: 7, context_use: "Phần cuối bài liệt kê sources." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_PARAPHRASE,
      STRAT_DISTRACTOR,
      "UK grading: 70%+ = first, 60-69% = upper-second (2:1), 50-59% = lower-second (2:2).",
      "'For X, yes. For Y, no.' — distinction phổ biến trong Section 3. Đáp án ở details.",
    ],
    common_mistakes_vi: [
      "Chốt grade '68' vì nghe đầu — đáp án câu hỏi sau là '70+'.",
      "Lẫn body 1 và body 2/3 weaknesses (body 2/3 là strong).",
      "Chốt 'yes, anytime' vì phần 'For practice, yes' — bỏ qua 'For grading, no'.",
    ],
    estimated_time_minutes: 8,
    difficulty_band: 7.5,
  },
  {
    id: "ielts_listening_section3_poster_prep",
    section: 3,
    context: "academic",
    topic_title_vi: "Chuẩn bị poster trình bày",
    topic_title_en: "Poster presentation preparation",
    audio_script: `STUDENT_A: We have ten days. Have you decided on the visual layout?
STUDENT_B: I was thinking three columns — left for context and method, middle for results, right for conclusion.
STUDENT_A: Standard, but works. What size?
STUDENT_B: A0 — the conference requires it.
STUDENT_A: Right. Charts — how many?
STUDENT_B: I'd say two main charts and one map. Three is plenty for a poster — more becomes cluttered.
STUDENT_A: I agree. The bar chart we made looks fine, but the scatter plot is too busy. Maybe simplify it?
STUDENT_B: Yes, drop the regression lines. Just the data points.
STUDENT_A: For colour scheme — red, white, blue?
STUDENT_B: Too patriotic. How about navy, white, and one accent — orange or teal?
STUDENT_A: Teal. Easier on the eye.
STUDENT_B: Agreed. Now — printing. The campus print shop charges fifteen pounds for A0 single-sided.
STUDENT_A: There's a discount if we book four days ahead.
STUDENT_B: How much?
STUDENT_A: Two pounds.
STUDENT_B: Worth it. Let's aim to finish by next Wednesday so we can book.
STUDENT_A: One last thing — who presents which section?
STUDENT_B: I'll do method and results — it's my analysis. You take context and conclusion.`,
    questions: [
      { number: 1, type: "multiple_choice", question_text: "Poster size required:", options: ["A) A1", "B) A2", "C) A0", "D) A3"], correct_answer: "C", explanation_vi: "'A0 — the conference requires it'." },
      { number: 2, type: "note_completion", question_text: "Charts to include: ____________ charts + ____________ map", correct_answer: "2, 1", explanation_vi: "'Two main charts and one map'." },
      { number: 3, type: "note_completion", question_text: "Accent colour chosen: ____________", correct_answer: "teal", explanation_vi: "'Teal. Easier on the eye'." },
      { number: 4, type: "form_completion", question_text: "Print cost with early-booking discount: £____________", correct_answer: "13", explanation_vi: "£15 - £2 discount = £13. Tính nhẩm cần thiết." },
      { number: 5, type: "matching", question_text: "Presentation sections: Student A / Student B", options: ["A) method + results", "B) context + conclusion"], correct_answer: "A=B (context+conclusion), B=A (method+results)", explanation_vi: "'I'll do method and results... You take context and conclusion'." },
    ],
    vocabulary_focus: [
      { word: "scatter plot", ipa: "/ˈskæt.ə plɒt/", vi_translation: "biểu đồ phân tán", band_level: 8, context_use: "Loại chart cho data analysis." },
      { word: "regression line", ipa: "/rɪˈgrɛʃ.ən laɪn/", vi_translation: "đường hồi quy", band_level: 9, context_use: "Statistical line of best fit." },
      { word: "cluttered", ipa: "/ˈklʌt.əd/", vi_translation: "rối, quá nhiều thứ", band_level: 7, context_use: "Visual design term — quá nhiều element." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_NUMBERS,
      STRAT_DISTRACTOR,
      "Tính nhẩm trong listening: £15 - £2 = £13. Đề thường yêu cầu kết quả cuối, không số gốc.",
      "Cụm so sánh: 'easier on the eye' = dễ nhìn hơn. Idiom band 7+.",
    ],
    common_mistakes_vi: [
      "Viết £15 (giá gốc) thay vì £13 (sau discount).",
      "Chốt 'three columns' (visual layout — không phải câu hỏi này).",
      "Lẫn ai trình bày section nào.",
    ],
    estimated_time_minutes: 8,
    difficulty_band: 7.5,
  },
  {
    id: "ielts_listening_section3_reading_list",
    section: 3,
    context: "academic",
    topic_title_vi: "Bàn về danh sách tài liệu đọc",
    topic_title_en: "Reading list discussion",
    audio_script: `TUTOR: Six weeks until the exam. Let's prioritise the reading list.
STUDENT: There are forty items. I won't get through all of them.
TUTOR: Nobody does. Strategy: read three or four core texts deeply, skim ten or fifteen others, ignore the rest.
STUDENT: Which are the core ones?
TUTOR: Definitely Marsden two thousand and six on framework theory, Patel two thousand and fifteen on the empirical case studies, and Lin twenty-twenty on the recent debate.
STUDENT: Three texts.
TUTOR: Add a fourth — Goldberg twenty-twenty-one. It's a review article, useful for connecting the others.
STUDENT: Got it. What about journals?
TUTOR: For skimming — focus on the abstracts and conclusions only. The Journal of Comparative Studies has the most relevant articles.
STUDENT: How long do I spend per core text?
TUTOR: Six to eight hours. Not in one sitting — break it across three sessions, with note-taking in the second.
STUDENT: Notes — should I summarise or quote directly?
TUTOR: Both. Summary for the argument, exact quotes for two or three key sentences you might want to cite.
STUDENT: Practice questions?
TUTOR: I'll send a list — past-paper questions from the last five years. Twenty questions in total. Aim to answer eight in writing under timed conditions.`,
    questions: [
      { number: 1, type: "note_completion", question_text: "Total reading-list items: ____________", correct_answer: "40", explanation_vi: "'There are forty items'." },
      { number: 2, type: "matching", question_text: "Match author to topic: Marsden / Patel / Lin / Goldberg", options: ["A) framework theory", "B) empirical case studies", "C) recent debate", "D) review article"], correct_answer: "Marsden=A, Patel=B, Lin=C, Goldberg=D", explanation_vi: "Tutor liệt kê rõ từng author + topic." },
      { number: 3, type: "note_completion", question_text: "Hours per core text: ____________ to ____________", correct_answer: "6, 8", explanation_vi: "'Six to eight hours'." },
      { number: 4, type: "form_completion", question_text: "Past-paper questions total: ____________", correct_answer: "20", explanation_vi: "'Twenty questions in total'." },
      { number: 5, type: "note_completion", question_text: "Questions to answer in writing: ____________", correct_answer: "8", explanation_vi: "'Aim to answer eight in writing under timed conditions'." },
    ],
    vocabulary_focus: [
      { word: "skim", ipa: "/skɪm/", vi_translation: "đọc lướt", band_level: 7, context_use: "Reading strategy — đọc nhanh nắm ý chính." },
      { word: "empirical", ipa: "/ɪmˈpɪr.ɪ.kəl/", vi_translation: "(thuộc về) thực nghiệm", band_level: 8, context_use: "Học thuật — based on observation/experiment." },
      { word: "review article", ipa: "/rɪˈvjuː ˈɑː.tɪ.kəl/", vi_translation: "bài tổng quan", band_level: 7, context_use: "Bài summary nhiều nghiên cứu khác." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_PARAPHRASE,
      STRAT_DISTRACTOR,
      "Năm publication: 'two thousand and six' = 2006, 'twenty-twenty' = 2020, 'twenty-twenty-one' = 2021.",
      "Cách đọc range: 'six to eight' = 6–8. Cả hai số đều là đáp án.",
    ],
    common_mistakes_vi: [
      "Chỉ liệt kê 3 core texts, bỏ Goldberg (added later).",
      "Viết '6-8 hours' thay vì hai số riêng '6' và '8'.",
      "Lẫn '20 questions total' với '8 to answer'.",
    ],
    estimated_time_minutes: 8,
    difficulty_band: 7.5,
  },
  {
    id: "ielts_listening_section3_course_feedback",
    section: 3,
    context: "academic",
    topic_title_vi: "Buổi feedback cuối kỳ",
    topic_title_en: "End-of-course feedback session",
    audio_script: `TUTOR: Thanks for joining the feedback session. I'll ask three questions, you answer freely.
STUDENT_A: Sure.
TUTOR: First — what worked well in this course?
STUDENT_A: The case-study format was good. Concrete examples, not just theory.
STUDENT_B: Agreed. And the weekly quizzes — short, low-stakes, helped me stay on track.
TUTOR: Good. Second question — what didn't work?
STUDENT_A: The reading load was uneven. Some weeks had two papers, others had six. Hard to plan.
STUDENT_B: I'd add — the group project was too long. Three months felt unnecessary; six weeks would have been enough.
TUTOR: Useful — I'll consider both. Third question — what one change would you recommend?
STUDENT_A: Spread the reading load evenly. Three to four papers per week, consistent.
STUDENT_B: For me — more guest speakers from industry. We had two, both excellent. Could have had four or five.
TUTOR: Thank you. Last thing — are you considering further study in this area?
STUDENT_A: Possibly a master's. Not sure yet.
STUDENT_B: I'm applying for a PhD this autumn. The course confirmed the direction.`,
    questions: [
      { number: 1, type: "matching", question_text: "What worked: case-study format / weekly quizzes / guest speakers", options: ["A) Student A mentioned", "B) Student B mentioned", "C) both mentioned"], correct_answer: "case-study=A, quizzes=B, guest speakers=B", explanation_vi: "Track who mentioned what." },
      { number: 2, type: "multiple_choice", question_text: "Student B's biggest complaint:", options: ["A) too much reading", "B) group project too long", "C) lectures unclear", "D) no industry input"], correct_answer: "B", explanation_vi: "'The group project was too long'." },
      { number: 3, type: "note_completion", question_text: "Suggested project length: ____________ weeks", correct_answer: "6", explanation_vi: "'Six weeks would have been enough'." },
      { number: 4, type: "note_completion", question_text: "Recommended papers per week: ____________ to ____________", correct_answer: "3, 4", explanation_vi: "'Three to four papers per week'." },
      { number: 5, type: "multiple_choice", question_text: "Student B's plan after course:", options: ["A) gap year", "B) master's degree", "C) PhD application", "D) job market"], correct_answer: "C", explanation_vi: "'I'm applying for a PhD this autumn'." },
    ],
    vocabulary_focus: [
      { word: "low-stakes", ipa: "/loʊ steɪks/", vi_translation: "rủi ro thấp (đánh giá nhẹ)", band_level: 8, context_use: "Education — bài kiểm tra không đè áp lực." },
      { word: "uneven", ipa: "/ʌnˈiː.vən/", vi_translation: "không đều", band_level: 6, context_use: "'The reading load was uneven'." },
      { word: "PhD", ipa: "/ˌpiː.eɪtʃˈdiː/", vi_translation: "tiến sĩ", band_level: 6, context_use: "Đọc đầy đủ từng chữ cái." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_PARAPHRASE,
      STRAT_DISTRACTOR,
      "Section 3 đa-người: track WHO nói gì. Câu hỏi thường ai nêu opinion nào.",
      "Plan post-course: 'master's' khác 'PhD' khác 'gap year'. Đừng nhầm.",
    ],
    common_mistakes_vi: [
      "Gộp opinion của hai students thay vì phân biệt.",
      "Chốt 'master's' cho Student B (đó là Student A).",
      "Viết 'three to four' thay vì 2 số riêng.",
    ],
    estimated_time_minutes: 8,
    difficulty_band: 8.5,
  },

  // ─────────────────────────────────────────────────────────────────
  // Section 4 — academic monologues, single lecturer (6 items)
  // ─────────────────────────────────────────────────────────────────
  {
    id: "ielts_listening_section4_urban_planning",
    section: 4,
    context: "academic",
    topic_title_vi: "Bài giảng quy hoạch đô thị",
    topic_title_en: "Lecture: urban planning principles",
    audio_script: `Today's lecture introduces three principles of contemporary urban planning that have shifted thinking since the year two thousand.

The first principle is mixed-use development. Older planning separated residential, commercial, and industrial zones — the so-called single-use zoning model that dominated post-war planning in many countries. Mixed-use brings these together. A typical mixed-use block has shops on the ground floor, offices on the next two, and apartments above. The advantage is shorter trips and more vibrant streets, particularly outside business hours.

The second principle is transit-oriented development, often abbreviated TOD. The idea is simple: build dense housing within a four-hundred-metre walking radius of public-transport stops. Research from the European Environment Agency shows that residents within this radius use private cars about thirty percent less than residents in equivalent suburbs.

The third principle is what's now called the fifteen-minute city. Coined by Carlos Moreno in twenty-sixteen, it argues that essential services — work, school, healthcare, shopping, leisure — should all be reachable within a fifteen-minute walk or cycle. Paris has been the most prominent test case, with mixed early results.

Critics raise three objections. First, retrofitting older suburbs is expensive. Second, dense mixed-use can drive up land values, displacing existing residents. Third, walkability assumes a level of physical mobility not all residents have.`,
    questions: [
      { number: 1, type: "matching", question_text: "Match principle to feature: mixed-use / TOD / 15-min city", options: ["A) ground-floor shops, offices above, apartments top", "B) housing within 400m of transit", "C) services in 15-min walk/cycle"], correct_answer: "mixed-use=A, TOD=B, 15-min=C", explanation_vi: "Lecturer định nghĩa rõ từng nguyên tắc." },
      { number: 2, type: "form_completion", question_text: "TOD walking radius: ____________ metres", correct_answer: "400", explanation_vi: "'Four-hundred-metre walking radius'." },
      { number: 3, type: "form_completion", question_text: "Car use reduction (TOD residents): ____________%", correct_answer: "30", explanation_vi: "'Private cars about thirty percent less'." },
      { number: 4, type: "note_completion", question_text: "15-min city coined by Carlos ____________", correct_answer: "Moreno", explanation_vi: "'Coined by Carlos Moreno in twenty-sixteen'." },
      { number: 5, type: "matching", question_text: "Critics' objections: cost / land values / mobility", options: ["A) retrofitting suburbs is expensive", "B) drives up land values, displaces residents", "C) assumes physical mobility"], correct_answer: "All three = A, B, C respectively", explanation_vi: "Lecturer liệt kê 3 objections rõ ràng." },
    ],
    vocabulary_focus: [
      { word: "mixed-use", ipa: "/mɪkst juːs/", vi_translation: "đa chức năng", band_level: 8, context_use: "Urban planning term." },
      { word: "transit-oriented", ipa: "/ˈtræn.zɪt ˈɔː.ri.ən.tɪd/", vi_translation: "định hướng giao thông công cộng", band_level: 9, context_use: "TOD = chuẩn quy hoạch hiện đại." },
      { word: "retrofitting", ipa: "/ˈrɛt.roʊˌfɪt.ɪŋ/", vi_translation: "cải tạo (cũ thành mới)", band_level: 9, context_use: "Sửa nhà/khu cũ theo chuẩn mới." },
      { word: "displacing", ipa: "/dɪsˈpleɪ.sɪŋ/", vi_translation: "đẩy đi, di dời", band_level: 8, context_use: "'Displacing existing residents' = đẩy dân cũ đi." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_PARAPHRASE,
      STRAT_NUMBERS,
      STRAT_ANTICIPATE,
      "Section 4 thường có 'three principles / four reasons / five steps' — đếm và chuẩn bị bảng nhanh.",
      "Năm publication: 'twenty-sixteen' = 2016. Đa số Section 4 lectures dùng cách đọc này.",
    ],
    common_mistakes_vi: [
      "Viết '400m' thay vì chỉ số '400'.",
      "Nhầm percent: 'thirty percent' = 30%, không '30 percent of cars' (nhầm cấu trúc).",
      "Bỏ qua chi tiết 'Carlos Moreno' khi không quen tên người.",
    ],
    estimated_time_minutes: 10,
    difficulty_band: 7.5,
  },
  {
    id: "ielts_listening_section4_ocean_currents",
    section: 4,
    context: "academic",
    topic_title_vi: "Bài giảng dòng hải lưu",
    topic_title_en: "Lecture: ocean currents",
    audio_script: `Today we examine how ocean currents shape global climate. There are two main types: surface currents and deep currents.

Surface currents are driven primarily by wind. They affect roughly the top four hundred metres of the ocean. The Gulf Stream is the textbook example — flowing from the Caribbean across the Atlantic toward Europe. Without it, average winter temperatures in northwestern Europe would be approximately five degrees Celsius lower.

Deep currents are driven by density differences caused by temperature and salinity — what's called thermohaline circulation. Cold, salty water sinks; warm, fresh water rises. This conveyor belt circulates global ocean water on a roughly thousand-year cycle. A complete circuit takes around one thousand and forty years on average.

Why does this matter today? Climate change is altering both. Melting Arctic ice adds fresh water to the North Atlantic, reducing salinity and slowing the deep-current sinking process. Recent measurements show the Atlantic Meridional Overturning Circulation — known by the acronym AMOC — has weakened by about fifteen percent since the mid-twentieth century.

Three potential consequences if the AMOC continues to weaken: cooler winters in Europe — paradoxically, despite warming overall; more intense hurricanes in the Atlantic; and disrupted monsoons across South Asia and West Africa.

Mitigation focuses on slowing freshwater input — primarily through global emissions reduction.`,
    questions: [
      { number: 1, type: "matching", question_text: "Driver of each current type: surface / deep", options: ["A) wind", "B) density (temperature + salinity)", "C) tides", "D) earthquakes"], correct_answer: "surface=A, deep=B", explanation_vi: "'Surface currents are driven primarily by wind. Deep currents are driven by density differences'." },
      { number: 2, type: "note_completion", question_text: "Surface currents affect top ____________ m", correct_answer: "400", explanation_vi: "'Top four hundred metres of the ocean'." },
      { number: 3, type: "form_completion", question_text: "AMOC weakening since mid-20th century: ____________%", correct_answer: "15", explanation_vi: "'Weakened by about fifteen percent'." },
      { number: 4, type: "note_completion", question_text: "Thermohaline circuit duration: ~____________ years", correct_answer: "1040", explanation_vi: "'Around one thousand and forty years on average'." },
      { number: 5, type: "matching", question_text: "Consequences of AMOC weakening:", options: ["A) cooler European winters", "B) hotter Mediterranean summers", "C) intense Atlantic hurricanes", "D) disrupted Asian monsoons"], correct_answer: "A, C, D (not B)", explanation_vi: "Lecturer liệt kê 3 consequences." },
    ],
    vocabulary_focus: [
      { word: "salinity", ipa: "/səˈlɪn.ə.ti/", vi_translation: "độ mặn", band_level: 8, context_use: "Oceanography — concentration of salt." },
      { word: "thermohaline", ipa: "/ˌθɜː.moʊˈheɪ.laɪn/", vi_translation: "(thuộc) nhiệt-mặn", band_level: 9, context_use: "Khoa học biển — kết hợp 'thermo' (nhiệt) + 'haline' (muối)." },
      { word: "AMOC (acronym)", ipa: "/ˈeɪ.mɒk/", vi_translation: "Vòng hoàn lưu Đại Tây Dương", band_level: 9, context_use: "Acronym đọc là 'A-M-O-C' hoặc 'ay-mock'." },
      { word: "monsoon", ipa: "/mɒnˈsuːn/", vi_translation: "gió mùa", band_level: 7, context_use: "Stress vào âm thứ hai." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_PARAPHRASE,
      STRAT_NUMBERS,
      STRAT_ANTICIPATE,
      "Acronym Section 4 đọc nhanh — 'AMOC' nghe được cả cách spell và cách đọc 'ay-mock'. Quen với cả hai.",
      "Số đo science: '15%' = 'fifteen percent'. '5 degrees Celsius' = 'five degrees Celsius'. Đơn vị thường được nói rõ.",
    ],
    common_mistakes_vi: [
      "Lẫn surface (400m) với deep (đáp án không có ở câu này).",
      "Viết 1040 thành '1,040' với dấu phẩy nếu form không có comma.",
      "Bỏ qua 'mid-twentieth century' — không phải 'twentieth century' chung chung.",
    ],
    estimated_time_minutes: 10,
    difficulty_band: 8.5,
  },
  {
    id: "ielts_listening_section4_history_writing",
    section: 4,
    context: "academic",
    topic_title_vi: "Bài giảng lịch sử chữ viết",
    topic_title_en: "Lecture: history of writing",
    audio_script: `Writing systems emerged independently in at least four locations: Mesopotamia, Egypt, China, and Mesoamerica. Today's lecture focuses on the first three.

Mesopotamian cuneiform is the oldest, dating to around three thousand two hundred BC. It originated as accounting marks on clay tablets — early scribes pressed wedge-shaped impressions into wet clay. By two thousand BC, cuneiform was being used for literature, including the Epic of Gilgamesh, the oldest surviving long-form literary work.

Egyptian hieroglyphs appear at roughly the same period — around three thousand one hundred BC. Hieroglyphs were carved or painted on stone and papyrus. They served religious, royal, and administrative purposes. Decipherment came only in eighteen twenty-two, by Jean-François Champollion, working from the Rosetta Stone.

Chinese characters emerged later — the oldest oracle-bone inscriptions date to around twelve hundred BC during the late Shang dynasty. Unlike the other systems, Chinese writing has remained continuously in use, though significantly reformed in the twentieth century with the introduction of simplified characters in nineteen fifty-six.

Three things distinguish writing from other communication systems. First, writing is durable across time. Second, it's transmissible across distance. Third, it allows complex thought structures to be reviewed and revised.

Modern parallels: digital text is even more durable in some ways, but introduces fragility through format obsolescence — early word-processor files from the nineteen-eighties are now nearly unreadable.`,
    questions: [
      { number: 1, type: "matching", question_text: "Match writing system to date: cuneiform / hieroglyphs / Chinese", options: ["A) ~3200 BC", "B) ~3100 BC", "C) ~1200 BC"], correct_answer: "cuneiform=A, hieroglyphs=B, Chinese=C", explanation_vi: "Lecturer cite từng date." },
      { number: 2, type: "short_answer", question_text: "First long-form literary work?", correct_answer: "Epic of Gilgamesh", explanation_vi: "'Including the Epic of Gilgamesh, the oldest surviving long-form literary work'." },
      { number: 3, type: "note_completion", question_text: "Hieroglyphs deciphered in: ____________", correct_answer: "1822", explanation_vi: "'Decipherment came only in eighteen twenty-two'." },
      { number: 4, type: "note_completion", question_text: "Simplified Chinese characters introduced: ____________", correct_answer: "1956", explanation_vi: "'Simplified characters in nineteen fifty-six'." },
      { number: 5, type: "matching", question_text: "Three properties of writing:", options: ["A) durable across time", "B) transmissible across distance", "C) allows revision of complex thought", "D) faster than speech"], correct_answer: "A, B, C (not D)", explanation_vi: "Lecturer liệt kê 3 properties — D không được nêu." },
    ],
    vocabulary_focus: [
      { word: "cuneiform", ipa: "/ˈkjuː.nɪ.fɔːm/", vi_translation: "chữ hình nêm", band_level: 9, context_use: "Mesopotamian writing — wedge marks on clay." },
      { word: "decipherment", ipa: "/dɪˈsaɪ.fə.mənt/", vi_translation: "việc giải mã (chữ cổ)", band_level: 9, context_use: "Khoa học cổ ngữ — quá trình đọc được chữ cổ." },
      { word: "obsolescence", ipa: "/ˌɒb.səˈlɛs.əns/", vi_translation: "sự lỗi thời", band_level: 9, context_use: "'Format obsolescence' = file cũ không đọc được nữa." },
      { word: "transmissible", ipa: "/trænzˈmɪs.ə.bəl/", vi_translation: "có thể truyền đi", band_level: 8, context_use: "Tính từ — có khả năng truyền đạt." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_NUMBERS,
      STRAT_PARAPHRASE,
      "Năm BC: 'three thousand two hundred BC' = 3200 BC. 'BC' luôn sau số.",
      "Tên người ngoại quốc khó: Champollion / Gilgamesh / Shang dynasty — quen tên qua history podcasts.",
      "Đầu thế kỷ trong tiếng Anh: 'eighteen twenty-two' = 1822. 'Nineteen fifty-six' = 1956.",
    ],
    common_mistakes_vi: [
      "Viết '3200' thay vì 'BC 3200' nếu form yêu cầu cả BC.",
      "Nhầm '1822' (decipherment) với '1828' (không có).",
      "Liệt kê 'faster than speech' (sai — D không được nêu) trong properties.",
    ],
    estimated_time_minutes: 10,
    difficulty_band: 8.5,
  },
  {
    id: "ielts_listening_section4_consumer_psychology",
    section: 4,
    context: "academic",
    topic_title_vi: "Bài giảng tâm lý học người tiêu dùng",
    topic_title_en: "Lecture: consumer psychology",
    audio_script: `Today we examine three biases that shape consumer decisions, all well-documented in behavioural economics literature.

The first is the anchoring effect. When shoppers see a high reference price first — say a watch listed at twelve hundred dollars — subsequent prices feel cheaper relative to that anchor. A discounted price of nine hundred feels like a bargain, even if the watch is independently overpriced. Studies by Kahneman and Tversky in the nineteen-seventies established the effect; replications since have been consistent.

The second is loss aversion. Losses feel roughly twice as painful as equivalent gains feel pleasant. A consumer who would not pay forty dollars for a product will often pay forty dollars to avoid losing the same product once they own it. Subscription services exploit this — once a free trial is active, cancelling feels like a loss.

The third is the decoy effect. Adding a deliberately inferior third option pushes consumers toward the moderately priced second option. A coffee shop offering small at three dollars and large at five may sell mostly small. Adding a medium at four dollars eighty shifts purchases toward large — the small still anchors at three, but large now looks like a small premium over medium.

These biases are stable across cultures. Vietnamese consumers, in pilot studies from twenty-eighteen, showed comparable anchoring to American respondents — though loss aversion appeared slightly stronger.

Implications: pricing matters less than price framing. The same number can feel expensive or cheap depending on what surrounds it.`,
    questions: [
      { number: 1, type: "matching", question_text: "Bias to definition: anchoring / loss aversion / decoy", options: ["A) high reference price makes others feel cheaper", "B) losses feel ~2x more painful than equivalent gains", "C) inferior third option pushes toward middle"], correct_answer: "anchoring=A, loss aversion=B, decoy=C", explanation_vi: "Lecturer định nghĩa rõ từng bias." },
      { number: 2, type: "short_answer", question_text: "Authors who established anchoring effect?", correct_answer: "Kahneman and Tversky", explanation_vi: "'Studies by Kahneman and Tversky in the nineteen-seventies'." },
      { number: 3, type: "note_completion", question_text: "Loss vs gain pain ratio: ~____________", correct_answer: "2 / 2x / twice", explanation_vi: "'Roughly twice as painful'." },
      { number: 4, type: "form_completion", question_text: "Coffee decoy: small £3, medium £____________, large £5", correct_answer: "4.80", explanation_vi: "'Adding a medium at four dollars eighty'. Đáp án 4.80 hoặc 4.8." },
      { number: 5, type: "multiple_choice", question_text: "Vietnamese consumers (2018 study) showed:", options: ["A) weaker anchoring", "B) comparable anchoring", "C) no anchoring", "D) stronger anchoring"], correct_answer: "B", explanation_vi: "'Comparable anchoring to American respondents'." },
    ],
    vocabulary_focus: [
      { word: "anchoring effect", ipa: "/ˈæŋ.kə.rɪŋ ɪˈfɛkt/", vi_translation: "hiệu ứng neo giá", band_level: 9, context_use: "Behavioural econ term — first price seen anchors perception." },
      { word: "loss aversion", ipa: "/lɒs əˈvɜː.ʒən/", vi_translation: "sợ mất hơn thích được", band_level: 9, context_use: "Phenomenon — losses feel worse than gains." },
      { word: "decoy", ipa: "/ˈdiː.kɔɪ/", vi_translation: "mồi, vật đánh lạc hướng", band_level: 8, context_use: "'Decoy effect' = lựa chọn mồi để làm option khác hấp dẫn hơn." },
      { word: "framing", ipa: "/ˈfreɪ.mɪŋ/", vi_translation: "đóng khung, cách trình bày", band_level: 7, context_use: "'Price framing' = cách trình bày giá." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_NUMBERS,
      STRAT_PARAPHRASE,
      "Tên researcher: Kahneman / Tversky — học trước qua podcast về behavioural econ.",
      "Số tiền lẻ: 'four dollars eighty' = $4.80. Đừng viết '480'.",
      "Cụm so sánh: 'comparable to' = tương đương với. 'Stronger / weaker' = mạnh / yếu hơn.",
    ],
    common_mistakes_vi: [
      "Viết loss aversion là '2x' khi đáp án là 'twice' (cần chữ).",
      "Nhầm coffee decoy — chốt $5 (large) thay vì $4.80 (medium).",
      "Chốt 'stronger' cho VN consumers (sai — comparable, loss aversion stronger là detail riêng).",
    ],
    estimated_time_minutes: 10,
    difficulty_band: 8.5,
  },
  {
    id: "ielts_listening_section4_renewable_energy",
    section: 4,
    context: "academic",
    topic_title_vi: "Bài giảng năng lượng tái tạo",
    topic_title_en: "Lecture: renewable energy adoption",
    audio_script: `Today we look at the global transition to renewable energy and three structural barriers that have slowed it.

First, the cost gap. Renewable generation has fallen dramatically — solar photovoltaic prices declined by approximately ninety percent between two thousand and ten and twenty-twenty. However, the comparison should not be solely on generation cost. Storage and grid integration add costs that make full system costs roughly thirty to forty percent higher than generation alone.

Second, intermittency. Solar generates only when the sun shines; wind only when the wind blows. Grid stability requires either storage — batteries, pumped hydro — or backup capacity from gas or hydro plants. Battery prices have also fallen — a lithium-ion pack cost around twelve hundred dollars per kilowatt-hour in two thousand and ten; the figure was below one hundred and fifty dollars by twenty-twenty-three.

Third, grid topology. Existing grids were built around centralised, predictable thermal plants. Distributed solar from millions of rooftops requires substantial upgrades to transmission and distribution. The estimated investment for an average European country runs to between thirty and fifty billion euros over fifteen years.

Three policy levers consistently accelerate adoption: carbon pricing, feed-in tariffs, and net-metering. Countries combining all three — Germany, Denmark, parts of Australia — show the fastest deployment curves.

Vietnam's solar growth between twenty-eighteen and twenty-twenty was among the world's fastest. Capacity rose from below one gigawatt to over seventeen gigawatts in three years.`,
    questions: [
      { number: 1, type: "form_completion", question_text: "Solar PV price decline (2010-2020): ~____________%", correct_answer: "90", explanation_vi: "'Approximately ninety percent'." },
      { number: 2, type: "form_completion", question_text: "Battery cost in 2010: $____________ per kWh", correct_answer: "1200", explanation_vi: "'Around twelve hundred dollars per kilowatt-hour in two thousand and ten'." },
      { number: 3, type: "form_completion", question_text: "Battery cost by 2023: < $____________ per kWh", correct_answer: "150", explanation_vi: "'Below one hundred and fifty dollars by twenty-twenty-three'." },
      { number: 4, type: "matching", question_text: "Three policy levers:", options: ["A) carbon pricing", "B) feed-in tariffs", "C) net-metering", "D) carbon trading"], correct_answer: "A, B, C (not D)", explanation_vi: "Lecturer nêu 3 levers — carbon trading không phải." },
      { number: 5, type: "form_completion", question_text: "Vietnam solar capacity by 2020: > ____________ GW", correct_answer: "17", explanation_vi: "'Over seventeen gigawatts in three years'." },
    ],
    vocabulary_focus: [
      { word: "intermittency", ipa: "/ˌɪn.təˈmɪt.ən.si/", vi_translation: "tính gián đoạn (năng lượng)", band_level: 9, context_use: "Renewable energy term — không liên tục." },
      { word: "feed-in tariff", ipa: "/fiːd ɪn ˈtær.ɪf/", vi_translation: "giá mua điện từ hộ gia đình", band_level: 9, context_use: "Policy lever — chính phủ mua điện mặt trời từ dân." },
      { word: "topology", ipa: "/təˈpɒl.ə.dʒi/", vi_translation: "cấu trúc lưới", band_level: 9, context_use: "'Grid topology' = cấu hình mạng lưới điện." },
      { word: "deployment", ipa: "/dɪˈplɔɪ.mənt/", vi_translation: "triển khai", band_level: 7, context_use: "'Deployment curves' = đường cong tốc độ triển khai." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_NUMBERS,
      STRAT_PARAPHRASE,
      "Số lớn: 'twelve hundred' = 1,200. 'Seventeen gigawatts' = 17 GW. Đơn vị thường được nói rõ.",
      "Năm gần đây: 'twenty-eighteen' = 2018, 'twenty-twenty' = 2020, 'twenty-twenty-three' = 2023.",
      "VN context trong Section 4 academic — chú ý số liệu Vietnam được cite.",
    ],
    common_mistakes_vi: [
      "Viết '$1200' thay vì '1200' nếu form đã có $.",
      "Bỏ qua '< $150' — viết chỉ '150'.",
      "Liệt kê 'carbon trading' (sai) trong policy levers.",
    ],
    estimated_time_minutes: 10,
    difficulty_band: 8.5,
  },
  {
    id: "ielts_listening_section4_linguistics_loanwords",
    section: 4,
    context: "academic",
    topic_title_vi: "Bài giảng từ vay mượn trong ngôn ngữ",
    topic_title_en: "Lecture: loanwords in linguistics",
    audio_script: `Loanwords — words borrowed from one language into another — are universal. No language has zero loanwords. Today we examine three patterns of loanword adoption, with examples from English and Vietnamese.

The first pattern is direct borrowing. The borrowing language adopts the foreign word with minimal change, usually because no native equivalent exists. English took 'sushi' from Japanese in the late nineteenth century without modification. Vietnamese has taken 'café' from French — written 'cà phê' but pronounced almost identically.

The second is calque, also called loan translation. Instead of borrowing the word's sound, speakers translate the components. English 'flea market' is a calque of French 'marché aux puces' — literally 'market of fleas'. Vietnamese 'tủ lạnh' — literally 'cold cupboard' — is a calque from French 'armoire frigorifique'.

The third is semantic shift. The loanword takes on a new meaning in the borrowing language. Japanese borrowed 'service' from English but uses it primarily to mean 'free of charge' — a meaning English doesn't have. Vietnamese 'sô cô la' from French 'chocolat' is now stable, but the older pronunciation 'sô-cô-lát' has shifted.

Why borrow? Three motivations: necessity — naming a new technology or concept; prestige — borrowed terms can sound modern or sophisticated; and identity — using foreign loans signals cultural alignment.

Estimates vary, but English has roughly seventy percent loanword content from over three hundred languages. Vietnamese vocabulary is approximately sixty percent Sino-Vietnamese, twenty-five percent native, and the remaining fifteen percent from French and other sources.`,
    questions: [
      { number: 1, type: "matching", question_text: "Pattern to definition: direct / calque / semantic shift", options: ["A) translate the components", "B) adopt foreign word minimally changed", "C) loanword takes new meaning"], correct_answer: "direct=B, calque=A, semantic shift=C", explanation_vi: "Lecturer định nghĩa rõ." },
      { number: 2, type: "short_answer", question_text: "Vietnamese calque example?", correct_answer: "tủ lạnh", explanation_vi: "'Vietnamese tủ lạnh — literally cold cupboard — is a calque'." },
      { number: 3, type: "matching", question_text: "Three motivations:", options: ["A) necessity", "B) prestige", "C) identity", "D) brevity"], correct_answer: "A, B, C (not D)", explanation_vi: "Lecturer liệt kê 3 motivations — D không được nêu." },
      { number: 4, type: "form_completion", question_text: "English loanword content: ~____________%", correct_answer: "70", explanation_vi: "'Roughly seventy percent loanword content'." },
      { number: 5, type: "form_completion", question_text: "Vietnamese — Sino-Vietnamese share: ~____________%", correct_answer: "60", explanation_vi: "'Approximately sixty percent Sino-Vietnamese'." },
    ],
    vocabulary_focus: [
      { word: "calque", ipa: "/kælk/", vi_translation: "từ vay dịch nghĩa", band_level: 9, context_use: "Linguistics term — borrow by translating components." },
      { word: "semantic shift", ipa: "/sɪˈmæn.tɪk ʃɪft/", vi_translation: "chuyển nghĩa", band_level: 9, context_use: "Word changes meaning over time / between languages." },
      { word: "Sino-Vietnamese", ipa: "/ˈsaɪ.noʊ vi.ɛt.nəˈmiːz/", vi_translation: "Hán-Việt", band_level: 8, context_use: "Cụm chuẩn — từ Hán gốc dùng trong tiếng Việt." },
      { word: "prestige", ipa: "/prɛsˈtiːʒ/", vi_translation: "uy tín, danh giá", band_level: 7, context_use: "Stress vào âm thứ hai." },
    ],
    vietnamese_speaker_strategies: [
      STRAT_PARAPHRASE,
      STRAT_NUMBERS,
      "Section 4 lectures về linguistics thường có VN-specific examples — học trước các examples chuẩn.",
      "Cách đọc tỉ lệ: 'sixty percent' = 60%. 'Three quarters' = 75%. Hiếm gặp 'three quarters' trong Section 4.",
      "Bra wars về tỷ lệ phần trăm có thể có nhiều con số — track từng con số riêng.",
    ],
    common_mistakes_vi: [
      "Viết Vietnamese calque example là 'cà phê' (sai — đó là direct borrowing).",
      "Chốt 'brevity' (sai) trong motivations.",
      "Lẫn '60%' Sino-Vietnamese với '70%' English loanword content.",
    ],
    estimated_time_minutes: 10,
    difficulty_band: 8.5,
  },
];

// ─────────────────────────────────────────────────────────────────────
// Selectors + lookup helpers
// ─────────────────────────────────────────────────────────────────────

export const IELTS_LISTENING_ITEMS: IELTSListeningItem[] = ALL_ITEMS;

export const IELTS_LISTENING_BY_SECTION: Record<
  IELTSListeningSection,
  IELTSListeningItem[]
> = {
  1: IELTS_LISTENING_ITEMS.filter((i) => i.section === 1),
  2: IELTS_LISTENING_ITEMS.filter((i) => i.section === 2),
  3: IELTS_LISTENING_ITEMS.filter((i) => i.section === 3),
  4: IELTS_LISTENING_ITEMS.filter((i) => i.section === 4),
};

export function getIELTSListeningItemById(
  id: string,
): IELTSListeningItem | undefined {
  return IELTS_LISTENING_ITEMS.find((i) => i.id === id);
}

/**
 * IELTS Listening raw-score → band conversion (40-question paper).
 * Source: public IELTS band-conversion guidance from idp.com /
 * ielts.org. The mapping below uses the conservative midpoints used
 * across recent academic test reports.
 */
export function listeningRawToBand(raw: number): number {
  if (!Number.isFinite(raw)) return 0;
  const r = Math.max(0, Math.min(40, Math.round(raw)));
  if (r >= 39) return 9.0;
  if (r >= 37) return 8.5;
  if (r >= 35) return 8.0;
  if (r >= 32) return 7.5;
  if (r >= 30) return 7.0;
  if (r >= 26) return 6.5;
  if (r >= 23) return 6.0;
  if (r >= 18) return 5.5;
  if (r >= 16) return 5.0;
  if (r >= 13) return 4.5;
  if (r >= 11) return 4.0;
  if (r >= 8) return 3.5;
  if (r >= 6) return 3.0;
  if (r >= 4) return 2.5;
  return 0;
}
