// src/languages/thai/listeningScripts.ts
//
// Thai listening-script practice data for Vietnamese + English learners.
// TEXT ONLY — no audio, no TTS, no Azure, no pronunciation scoring. The app
// renders these scripts as reading-for-listening practice; any audio is out of
// scope for this module.
//
// Self-contained: types are defined inline (the thai/ package has no shared
// listening module yet). When one is added, swap to type-only imports.
//
// Conventions
//   - Thai script is always primary.
//   - Romanization (`rtgs`, light Royal-Thai style) is REQUIRED on script lines
//     and key vocab for lower levels (A1, A2, B1) and OPTIONAL for B2–C2, where
//     learners are expected to read script directly. Key vocab keeps rtgs at
//     all levels as a learner aid.
//   - vi = Vietnamese, en = English. Both always present.
//   - Every script carries: listening goal (vi+en), key vocab, comprehension
//     questions, and an answer key (vi+en) for self-check.
//
// NOTE: not natively reviewed yet (native review deferred).

export type ThaiCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ThaiListeningTopic =
  | "slow_speech"
  | "market"
  | "taxi"
  | "phone"
  | "workplace"
  | "announcement"
  | "interview"
  | "lecture_news";

/** Levels for which romanization is mandatory on every line / vocab item. */
export const LOWER_LEVELS: ThaiCefrLevel[] = ["A1", "A2", "B1"];

export type ScriptLine = {
  /** Speaker label (omit for single-voice monologue / narration). */
  speaker?: string;
  /** Thai script (primary). */
  th: string;
  /** Romanization — required for LOWER_LEVELS, optional otherwise. */
  rtgs?: string;
  en: string;
  vi: string;
};

export type VocabItem = {
  cell_id?: string;
  th: string;
  rtgs?: string;
  en: string;
  vi: string;
};

export type ComprehensionQuestion = {
  /** Question, English. */
  q_en: string;
  /** Question, Vietnamese. */
  q_vi: string;
  /** Answer key, English. */
  answer_en: string;
  /** Answer key, Vietnamese. */
  answer_vi: string;
};

export type ThaiListeningScript = {
  id: string;
  level: ThaiCefrLevel;
  topic: ThaiListeningTopic;
  title_en: string;
  title_vi: string;
  /** What the learner should focus on catching — English. */
  goal_en: string;
  /** What the learner should focus on catching — Vietnamese. */
  goal_vi: string;
  script: ScriptLine[];
  key_vocab: VocabItem[];
  questions: ComprehensionQuestion[];
};

export const thaiListeningScripts: ThaiListeningScript[] = [
  // ── A1 ────────────────────────────────────────────────────────────────────
  {
    id: "th-listen-a1-01-greeting-slow",
    level: "A1",
    topic: "slow_speech",
    title_en: "Slow greeting and name",
    title_vi: "Chào hỏi và tên (nói chậm)",
    goal_en: "Catch the greeting and the speaker's name.",
    goal_vi: "Nghe ra lời chào và tên người nói.",
    script: [
      {
        speaker: "A",
        th: "สวัสดีครับ",
        rtgs: "sawatdi khrap",
        en: "Hello.",
        vi: "Xin chào.",
      },
      {
        speaker: "A",
        th: "ผมชื่อสมชายครับ",
        rtgs: "phom chue somchai khrap",
        en: "My name is Somchai.",
        vi: "Tôi tên Somchai.",
      },
      {
        speaker: "B",
        th: "สวัสดีค่ะ ดิฉันชื่อมาลีค่ะ",
        rtgs: "sawatdi kha, dichan chue mali kha",
        en: "Hello, my name is Malee.",
        vi: "Xin chào, tôi tên Malee.",
      },
    ],
    key_vocab: [
      { th: "สวัสดี", rtgs: "sawatdi", en: "hello", vi: "xin chào" },
      { th: "ชื่อ", rtgs: "chue", en: "name / to be named", vi: "tên / tên là" },
    ],
    questions: [
      {
        q_en: "What is the man's name?",
        q_vi: "Người đàn ông tên gì?",
        answer_en: "Somchai.",
        answer_vi: "Somchai.",
      },
      {
        q_en: "What is the woman's name?",
        q_vi: "Người phụ nữ tên gì?",
        answer_en: "Malee.",
        answer_vi: "Malee.",
      },
    ],
  },
  {
    id: "th-listen-a1-02-numbers-market",
    level: "A1",
    topic: "market",
    title_en: "How much? (one item)",
    title_vi: "Bao nhiêu tiền? (một món)",
    goal_en: "Catch the price number and the currency word บาท.",
    goal_vi: "Nghe ra con số giá và từ tiền tệ บาท.",
    script: [
      {
        speaker: "Customer",
        th: "อันนี้เท่าไหร่คะ",
        rtgs: "an ni thao rai kha",
        en: "How much is this?",
        vi: "Cái này bao nhiêu vậy?",
      },
      {
        speaker: "Seller",
        th: "ยี่สิบบาทครับ",
        rtgs: "yi sip bat khrap",
        en: "Twenty baht.",
        vi: "Hai mươi baht.",
      },
      {
        speaker: "Customer",
        th: "ขอสองอันค่ะ",
        rtgs: "khɔ sɔng an kha",
        en: "I'd like two, please.",
        vi: "Cho tôi hai cái ạ.",
      },
    ],
    key_vocab: [
      { th: "เท่าไหร่", rtgs: "thao rai", en: "how much", vi: "bao nhiêu" },
      { th: "บาท", rtgs: "bat", en: "baht (currency)", vi: "baht (tiền Thái)" },
      { th: "สอง", rtgs: "sɔng", en: "two", vi: "hai" },
    ],
    questions: [
      {
        q_en: "What is the price of one item?",
        q_vi: "Giá một món là bao nhiêu?",
        answer_en: "20 baht.",
        answer_vi: "20 baht.",
      },
      {
        q_en: "How many does the customer buy?",
        q_vi: "Khách mua mấy cái?",
        answer_en: "Two.",
        answer_vi: "Hai cái.",
      },
    ],
  },
  {
    id: "th-listen-a1-03-taxi-destination",
    level: "A1",
    topic: "taxi",
    title_en: "Taxi: simple destination",
    title_vi: "Taxi: điểm đến đơn giản",
    goal_en: "Catch where the passenger wants to go.",
    goal_vi: "Nghe ra hành khách muốn đi đâu.",
    script: [
      {
        speaker: "Passenger",
        th: "ไปสนามบินครับ",
        rtgs: "pai sanambin khrap",
        en: "To the airport, please.",
        vi: "Đi sân bay nhé.",
      },
      {
        speaker: "Driver",
        th: "ได้ครับ",
        rtgs: "dai khrap",
        en: "Okay.",
        vi: "Được ạ.",
      },
      {
        speaker: "Passenger",
        th: "ใช้เวลานานไหมครับ",
        rtgs: "chai welaa nan mai khrap",
        en: "Does it take long?",
        vi: "Có lâu không ạ?",
      },
    ],
    key_vocab: [
      { th: "ไป", rtgs: "pai", en: "to go", vi: "đi" },
      { th: "สนามบิน", rtgs: "sanambin", en: "airport", vi: "sân bay" },
      { th: "นาน", rtgs: "nan", en: "(a) long time", vi: "lâu" },
    ],
    questions: [
      {
        q_en: "Where does the passenger want to go?",
        q_vi: "Hành khách muốn đi đâu?",
        answer_en: "The airport.",
        answer_vi: "Sân bay.",
      },
    ],
  },
  {
    id: "th-listen-a1-04-phone-simple",
    level: "A1",
    topic: "phone",
    title_en: "Phone: is X there?",
    title_vi: "Điện thoại: có X ở đó không?",
    goal_en: "Catch who the caller is asking for.",
    goal_vi: "Nghe ra người gọi muốn gặp ai.",
    script: [
      {
        speaker: "Caller",
        th: "ฮัลโหล สมชายอยู่ไหมครับ",
        rtgs: "hanlo, somchai yu mai khrap",
        en: "Hello, is Somchai there?",
        vi: "A lô, có Somchai ở đó không?",
      },
      {
        speaker: "B",
        th: "รอสักครู่นะคะ",
        rtgs: "rɔ sak khru na kha",
        en: "Please wait a moment.",
        vi: "Đợi một lát nhé.",
      },
    ],
    key_vocab: [
      { th: "อยู่ไหม", rtgs: "yu mai", en: "is (someone) there?", vi: "có ở đó không?" },
      { th: "รอสักครู่", rtgs: "rɔ sak khru", en: "wait a moment", vi: "đợi một lát" },
    ],
    questions: [
      {
        q_en: "Who is the caller asking for?",
        q_vi: "Người gọi muốn gặp ai?",
        answer_en: "Somchai.",
        answer_vi: "Somchai.",
      },
    ],
  },
  {
    id: "th-listen-a1-05-announcement-simple",
    level: "A1",
    topic: "announcement",
    title_en: "Shop closing announcement",
    title_vi: "Thông báo cửa hàng đóng cửa",
    goal_en: "Catch the closing time.",
    goal_vi: "Nghe ra giờ đóng cửa.",
    script: [
      {
        th: "ร้านจะปิดในสิบนาทีนะคะ",
        rtgs: "ran ja pit nai sip nathi na kha",
        en: "The shop will close in ten minutes.",
        vi: "Cửa hàng sẽ đóng cửa trong mười phút nữa.",
      },
      {
        th: "ขอบคุณค่ะ",
        rtgs: "khɔp khun kha",
        en: "Thank you.",
        vi: "Cảm ơn.",
      },
    ],
    key_vocab: [
      { th: "ปิด", rtgs: "pit", en: "to close", vi: "đóng cửa" },
      { th: "นาที", rtgs: "nathi", en: "minute", vi: "phút" },
    ],
    questions: [
      {
        q_en: "In how many minutes will the shop close?",
        q_vi: "Cửa hàng đóng cửa sau bao nhiêu phút?",
        answer_en: "Ten minutes.",
        answer_vi: "Mười phút.",
      },
    ],
  },

  // ── A2 ────────────────────────────────────────────────────────────────────
  {
    id: "th-listen-a2-01-market-bargain",
    level: "A2",
    topic: "market",
    title_en: "Bargaining at the market",
    title_vi: "Mặc cả ở chợ",
    goal_en: "Catch the first price, the offer, and the agreed price.",
    goal_vi: "Nghe ra giá đầu, giá trả, và giá chốt.",
    script: [
      {
        speaker: "Customer",
        th: "เสื้อตัวนี้เท่าไหร่คะ",
        rtgs: "suea tua ni thao rai kha",
        en: "How much is this shirt?",
        vi: "Cái áo này bao nhiêu vậy?",
      },
      {
        speaker: "Seller",
        th: "สามร้อยบาทครับ",
        rtgs: "sam rɔi bat khrap",
        en: "Three hundred baht.",
        vi: "Ba trăm baht.",
      },
      {
        speaker: "Customer",
        th: "ลดหน่อยได้ไหมคะ สองร้อยห้าสิบได้ไหม",
        rtgs: "lot nɔi dai mai kha, sɔng rɔi ha sip dai mai",
        en: "Can you lower it a bit? How about 250?",
        vi: "Bớt chút được không? 250 được không?",
      },
      {
        speaker: "Seller",
        th: "สองร้อยแปดสิบครับ ตกลงไหม",
        rtgs: "sɔng rɔi paet sip khrap, toklong mai",
        en: "280, agreed?",
        vi: "280 nhé, đồng ý không?",
      },
    ],
    key_vocab: [
      { th: "ลด", rtgs: "lot", en: "to reduce / discount", vi: "giảm / bớt" },
      { th: "ตกลง", rtgs: "toklong", en: "to agree / deal", vi: "đồng ý / chốt" },
    ],
    questions: [
      {
        q_en: "What was the starting price?",
        q_vi: "Giá ban đầu là bao nhiêu?",
        answer_en: "300 baht.",
        answer_vi: "300 baht.",
      },
      {
        q_en: "What price did the seller propose at the end?",
        q_vi: "Cuối cùng người bán đề nghị giá nào?",
        answer_en: "280 baht.",
        answer_vi: "280 baht.",
      },
    ],
  },
  {
    id: "th-listen-a2-02-taxi-meter",
    level: "A2",
    topic: "taxi",
    title_en: "Taxi: meter and route",
    title_vi: "Taxi: đồng hồ và lộ trình",
    goal_en: "Catch whether the meter is used and the requested route.",
    goal_vi: "Nghe ra có dùng đồng hồ không và lộ trình yêu cầu.",
    script: [
      {
        speaker: "Passenger",
        th: "ไปสยามครับ เปิดมิเตอร์ด้วยนะครับ",
        rtgs: "pai sayam khrap, poet mitoe duai na khrap",
        en: "To Siam, please — and use the meter.",
        vi: "Đi Siam nhé — bật đồng hồ giúp tôi.",
      },
      {
        speaker: "Driver",
        th: "ได้ครับ รถติดนิดหน่อยนะครับ",
        rtgs: "dai khrap, rot tit nit nɔi na khrap",
        en: "Okay, there's a bit of traffic.",
        vi: "Được, hơi kẹt xe một chút nhé.",
      },
      {
        speaker: "Passenger",
        th: "ไม่เป็นไรครับ ไม่รีบ",
        rtgs: "mai pen rai khrap, mai rip",
        en: "No problem, I'm not in a hurry.",
        vi: "Không sao, tôi không vội.",
      },
    ],
    key_vocab: [
      { th: "เปิดมิเตอร์", rtgs: "poet mitoe", en: "turn on the meter", vi: "bật đồng hồ" },
      { th: "รถติด", rtgs: "rot tit", en: "traffic jam", vi: "kẹt xe" },
      { th: "ไม่รีบ", rtgs: "mai rip", en: "not in a hurry", vi: "không vội" },
    ],
    questions: [
      {
        q_en: "Does the passenger want the meter on?",
        q_vi: "Hành khách có muốn bật đồng hồ không?",
        answer_en: "Yes.",
        answer_vi: "Có.",
      },
      {
        q_en: "Is the passenger in a hurry?",
        q_vi: "Hành khách có vội không?",
        answer_en: "No.",
        answer_vi: "Không.",
      },
    ],
  },
  {
    id: "th-listen-a2-03-phone-message",
    level: "A2",
    topic: "phone",
    title_en: "Phone: leaving a message",
    title_vi: "Điện thoại: để lại lời nhắn",
    goal_en: "Catch who called and what to call back about.",
    goal_vi: "Nghe ra ai gọi và gọi lại về việc gì.",
    script: [
      {
        speaker: "Caller",
        th: "สมชายไม่อยู่เหรอครับ",
        rtgs: "somchai mai yu roe khrap",
        en: "Somchai isn't in?",
        vi: "Somchai không có ở đó à?",
      },
      {
        speaker: "B",
        th: "ไม่อยู่ค่ะ ฝากข้อความไหมคะ",
        rtgs: "mai yu kha, fak khɔ khwam mai kha",
        en: "He's out. Would you like to leave a message?",
        vi: "Anh ấy ra ngoài rồi. Anh để lại lời nhắn không?",
      },
      {
        speaker: "Caller",
        th: "ช่วยบอกให้โทรกลับเรื่องประชุมพรุ่งนี้นะครับ",
        rtgs: "chuai bɔk hai tho klap rueang prachum phrung ni na khrap",
        en: "Please tell him to call back about tomorrow's meeting.",
        vi: "Nhờ nhắn anh ấy gọi lại về cuộc họp ngày mai.",
      },
    ],
    key_vocab: [
      { th: "ฝากข้อความ", rtgs: "fak khɔ khwam", en: "leave a message", vi: "để lại lời nhắn" },
      { th: "โทรกลับ", rtgs: "tho klap", en: "call back", vi: "gọi lại" },
      { th: "ประชุม", rtgs: "prachum", en: "meeting", vi: "cuộc họp" },
    ],
    questions: [
      {
        q_en: "What should Somchai call back about?",
        q_vi: "Somchai cần gọi lại về việc gì?",
        answer_en: "Tomorrow's meeting.",
        answer_vi: "Cuộc họp ngày mai.",
      },
    ],
  },
  {
    id: "th-listen-a2-04-workplace-late",
    level: "A2",
    topic: "workplace",
    title_en: "Calling in late to work",
    title_vi: "Gọi báo đi làm muộn",
    goal_en: "Catch the reason and the new arrival time.",
    goal_vi: "Nghe ra lý do và giờ đến mới.",
    script: [
      {
        speaker: "Staff",
        th: "พี่ครับ วันนี้ผมจะไปสายนิดหน่อย",
        rtgs: "phi khrap, wan ni phom ja pai sai nit nɔi",
        en: "Sir, I'll be a bit late today.",
        vi: "Anh ơi, hôm nay em sẽ đến hơi muộn.",
      },
      {
        speaker: "Boss",
        th: "เป็นอะไรหรือเปล่า",
        rtgs: "pen arai rue plao",
        en: "Is something wrong?",
        vi: "Có chuyện gì không?",
      },
      {
        speaker: "Staff",
        th: "รถเสียครับ น่าจะถึงประมาณสิบโมง",
        rtgs: "rot sia khrap, na ja thueng praman sip mong",
        en: "My car broke down; I should arrive around 10 a.m.",
        vi: "Xe em hỏng; chắc khoảng 10 giờ em tới.",
      },
    ],
    key_vocab: [
      { th: "ไปสาย", rtgs: "pai sai", en: "arrive late", vi: "đến muộn" },
      { th: "รถเสีย", rtgs: "rot sia", en: "car broke down", vi: "xe hỏng" },
      { th: "ประมาณ", rtgs: "praman", en: "approximately", vi: "khoảng" },
    ],
    questions: [
      {
        q_en: "Why is the staff member late?",
        q_vi: "Tại sao nhân viên đến muộn?",
        answer_en: "Their car broke down.",
        answer_vi: "Vì xe bị hỏng.",
      },
      {
        q_en: "When will they arrive?",
        q_vi: "Khi nào họ tới?",
        answer_en: "Around 10 a.m.",
        answer_vi: "Khoảng 10 giờ sáng.",
      },
    ],
  },
  {
    id: "th-listen-a2-05-station-announcement",
    level: "A2",
    topic: "announcement",
    title_en: "Train platform announcement",
    title_vi: "Thông báo sân ga",
    goal_en: "Catch the destination and the platform number.",
    goal_vi: "Nghe ra điểm đến và số sân ga.",
    script: [
      {
        th: "รถไฟไปเชียงใหม่ จะออกในอีกห้านาที",
        rtgs: "rotfai pai chiangmai ja ɔk nai ik ha nathi",
        en: "The train to Chiang Mai will depart in five minutes.",
        vi: "Tàu đi Chiang Mai sẽ khởi hành sau năm phút nữa.",
      },
      {
        th: "กรุณาไปที่ชานชาลาที่สาม",
        rtgs: "karuna pai thi chan chala thi sam",
        en: "Please go to platform three.",
        vi: "Vui lòng đến sân ga số ba.",
      },
    ],
    key_vocab: [
      { th: "รถไฟ", rtgs: "rotfai", en: "train", vi: "tàu hỏa" },
      { th: "ออก", rtgs: "ɔk", en: "to depart", vi: "khởi hành" },
      { th: "ชานชาลา", rtgs: "chan chala", en: "platform", vi: "sân ga" },
    ],
    questions: [
      {
        q_en: "Where is the train going?",
        q_vi: "Tàu đi đâu?",
        answer_en: "Chiang Mai.",
        answer_vi: "Chiang Mai.",
      },
      {
        q_en: "Which platform?",
        q_vi: "Sân ga số mấy?",
        answer_en: "Platform three.",
        answer_vi: "Sân ga số ba.",
      },
    ],
  },

  // ── B1 ────────────────────────────────────────────────────────────────────
  {
    id: "th-listen-b1-01-phone-reschedule",
    level: "B1",
    topic: "phone",
    title_en: "Rescheduling an appointment by phone",
    title_vi: "Dời lịch hẹn qua điện thoại",
    goal_en: "Catch the reason for rescheduling and the new day/time.",
    goal_vi: "Nghe ra lý do dời lịch và ngày/giờ mới.",
    script: [
      {
        speaker: "A",
        th: "ขอโทษนะครับ ผมขอเลื่อนนัดวันพุธได้ไหมครับ",
        rtgs: "khɔthot na khrap, phom khɔ luean nat wan phut dai mai khrap",
        en: "Sorry, may I postpone Wednesday's appointment?",
        vi: "Xin lỗi, tôi xin dời lịch hẹn thứ Tư được không?",
      },
      {
        speaker: "B",
        th: "ได้ค่ะ ติดอะไรหรือเปล่าคะ",
        rtgs: "dai kha, tit arai rue plao kha",
        en: "Sure, is something coming up?",
        vi: "Được, anh có vướng việc gì không?",
      },
      {
        speaker: "A",
        th: "ผมต้องไปต่างจังหวัดพอดี ขอเป็นวันศุกร์บ่ายสองได้ไหมครับ",
        rtgs: "phom tɔng pai tang changwat phɔdi, khɔ pen wan suk bai sɔng dai mai khrap",
        en: "I have to travel upcountry. Could we make it Friday at 2 p.m.?",
        vi: "Tôi phải đi tỉnh. Đổi sang thứ Sáu 2 giờ chiều được không?",
      },
      {
        speaker: "B",
        th: "ได้ค่ะ บันทึกเป็นวันศุกร์บ่ายสองนะคะ",
        rtgs: "dai kha, banthuek pen wan suk bai sɔng na kha",
        en: "Okay, I'll note it as Friday 2 p.m.",
        vi: "Được, tôi ghi là thứ Sáu 2 giờ chiều nhé.",
      },
    ],
    key_vocab: [
      { th: "เลื่อนนัด", rtgs: "luean nat", en: "postpone an appointment", vi: "dời lịch hẹn" },
      { th: "ต่างจังหวัด", rtgs: "tang changwat", en: "upcountry / the provinces", vi: "ở tỉnh" },
      { th: "บันทึก", rtgs: "banthuek", en: "to note / record", vi: "ghi lại" },
    ],
    questions: [
      {
        q_en: "Why does the caller reschedule?",
        q_vi: "Tại sao người gọi dời lịch?",
        answer_en: "He has to travel to the provinces.",
        answer_vi: "Vì anh ấy phải đi tỉnh.",
      },
      {
        q_en: "What is the new appointment time?",
        q_vi: "Lịch hẹn mới là khi nào?",
        answer_en: "Friday at 2 p.m.",
        answer_vi: "Thứ Sáu lúc 2 giờ chiều.",
      },
    ],
  },
  {
    id: "th-listen-b1-02-workplace-task",
    level: "B1",
    topic: "workplace",
    title_en: "Assigning a task with a deadline",
    title_vi: "Giao việc kèm hạn chót",
    goal_en: "Catch the task and the deadline.",
    goal_vi: "Nghe ra nhiệm vụ và hạn chót.",
    script: [
      {
        speaker: "Manager",
        th: "ช่วยทำรายงานยอดขายเดือนนี้ให้หน่อยนะ",
        rtgs: "chuai tham raingan yɔt khai duean ni hai nɔi na",
        en: "Please prepare this month's sales report.",
        vi: "Làm giúp báo cáo doanh số tháng này nhé.",
      },
      {
        speaker: "Staff",
        th: "ได้ครับ ต้องส่งเมื่อไหร่ครับ",
        rtgs: "dai khrap, tɔng song muea rai khrap",
        en: "Sure, when is it due?",
        vi: "Được ạ, khi nào phải nộp?",
      },
      {
        speaker: "Manager",
        th: "ภายในวันศุกร์นี้ ก่อนเที่ยงนะ",
        rtgs: "phai nai wan suk ni, kɔn thiang na",
        en: "By this Friday, before noon.",
        vi: "Trước thứ Sáu này, trước trưa nhé.",
      },
    ],
    key_vocab: [
      { th: "รายงานยอดขาย", rtgs: "raingan yɔt khai", en: "sales report", vi: "báo cáo doanh số" },
      { th: "ส่ง", rtgs: "song", en: "to submit / send", vi: "nộp / gửi" },
      { th: "ก่อนเที่ยง", rtgs: "kɔn thiang", en: "before noon", vi: "trước trưa" },
    ],
    questions: [
      {
        q_en: "What is the task?",
        q_vi: "Nhiệm vụ là gì?",
        answer_en: "Prepare this month's sales report.",
        answer_vi: "Làm báo cáo doanh số tháng này.",
      },
      {
        q_en: "What is the deadline?",
        q_vi: "Hạn chót là khi nào?",
        answer_en: "This Friday, before noon.",
        answer_vi: "Thứ Sáu này, trước trưa.",
      },
    ],
  },
  {
    id: "th-listen-b1-03-market-complaint",
    level: "B1",
    topic: "market",
    title_en: "Returning a faulty item",
    title_vi: "Trả lại món hàng bị lỗi",
    goal_en: "Catch the problem and what the customer wants.",
    goal_vi: "Nghe ra vấn đề và khách muốn gì.",
    script: [
      {
        speaker: "Customer",
        th: "พอดีของที่ซื้อไปเมื่อวานมันเสียค่ะ",
        rtgs: "phɔdi khɔng thi sue pai muea wan man sia kha",
        en: "The item I bought yesterday is faulty.",
        vi: "Món tôi mua hôm qua bị hỏng ạ.",
      },
      {
        speaker: "Seller",
        th: "มีใบเสร็จไหมครับ",
        rtgs: "mi bai set mai khrap",
        en: "Do you have the receipt?",
        vi: "Chị có hóa đơn không?",
      },
      {
        speaker: "Customer",
        th: "มีค่ะ ขอเปลี่ยนชิ้นใหม่ได้ไหมคะ",
        rtgs: "mi kha, khɔ plian chin mai dai mai kha",
        en: "Yes. Can I exchange it for a new one?",
        vi: "Có ạ. Cho tôi đổi cái mới được không?",
      },
      {
        speaker: "Seller",
        th: "ได้ครับ เดี๋ยวเปลี่ยนให้",
        rtgs: "dai khrap, diao plian hai",
        en: "Sure, I'll change it for you.",
        vi: "Được, để tôi đổi cho.",
      },
    ],
    key_vocab: [
      { th: "เสีย", rtgs: "sia", en: "faulty / broken", vi: "hỏng" },
      { th: "ใบเสร็จ", rtgs: "bai set", en: "receipt", vi: "hóa đơn" },
      { th: "เปลี่ยน", rtgs: "plian", en: "to exchange", vi: "đổi" },
    ],
    questions: [
      {
        q_en: "What is wrong with the item?",
        q_vi: "Món hàng bị gì?",
        answer_en: "It is faulty/broken.",
        answer_vi: "Bị hỏng.",
      },
      {
        q_en: "What does the customer want?",
        q_vi: "Khách muốn gì?",
        answer_en: "To exchange it for a new one.",
        answer_vi: "Đổi lấy cái mới.",
      },
    ],
  },
  {
    id: "th-listen-b1-04-announcement-event",
    level: "B1",
    topic: "announcement",
    title_en: "Office event announcement",
    title_vi: "Thông báo sự kiện văn phòng",
    goal_en: "Catch the event, the date, and who should attend.",
    goal_vi: "Nghe ra sự kiện, ngày, và ai cần tham dự.",
    script: [
      {
        th: "เรียนพนักงานทุกท่าน บริษัทจะจัดอบรมความปลอดภัยในวันศุกร์นี้",
        rtgs: "rian phanak ngan thuk than, bɔrisat ja jat oprom khwam plɔt phai nai wan suk ni",
        en: "Dear all staff, the company will hold a safety training this Friday.",
        vi: "Kính gửi toàn thể nhân viên, công ty sẽ tổ chức tập huấn an toàn vào thứ Sáu này.",
      },
      {
        th: "ขอให้พนักงานใหม่ทุกคนเข้าร่วมที่ห้องประชุมใหญ่ เวลาบ่ายโมง",
        rtgs: "khɔ hai phanak ngan mai thuk khon khao ruam thi hɔng prachum yai, welaa bai mong",
        en: "All new staff are asked to attend in the main meeting room at 1 p.m.",
        vi: "Đề nghị tất cả nhân viên mới tham dự tại phòng họp lớn lúc 1 giờ chiều.",
      },
    ],
    key_vocab: [
      { th: "อบรม", rtgs: "oprom", en: "training", vi: "tập huấn" },
      { th: "ความปลอดภัย", rtgs: "khwam plɔt phai", en: "safety", vi: "an toàn" },
      { th: "เข้าร่วม", rtgs: "khao ruam", en: "to attend / join", vi: "tham dự" },
    ],
    questions: [
      {
        q_en: "What is the event?",
        q_vi: "Sự kiện là gì?",
        answer_en: "A safety training.",
        answer_vi: "Buổi tập huấn an toàn.",
      },
      {
        q_en: "Who must attend, and at what time?",
        q_vi: "Ai phải tham dự, lúc mấy giờ?",
        answer_en: "All new staff, at 1 p.m.",
        answer_vi: "Tất cả nhân viên mới, lúc 1 giờ chiều.",
      },
    ],
  },
  {
    id: "th-listen-b1-05-interview-intro",
    level: "B1",
    topic: "interview",
    title_en: "Job interview: background question",
    title_vi: "Phỏng vấn: câu hỏi về kinh nghiệm",
    goal_en: "Catch the candidate's experience and current job.",
    goal_vi: "Nghe ra kinh nghiệm và công việc hiện tại của ứng viên.",
    script: [
      {
        speaker: "Interviewer",
        th: "ช่วยเล่าประสบการณ์ทำงานหน่อยได้ไหมครับ",
        rtgs: "chuai lao prasopkan tham ngan nɔi dai mai khrap",
        en: "Could you tell me about your work experience?",
        vi: "Bạn kể về kinh nghiệm làm việc được không?",
      },
      {
        speaker: "Candidate",
        th: "ผมทำงานด้านการตลาดมาสามปีค่ะ ตอนนี้ทำที่บริษัทเล็กๆ",
        rtgs: "phom tham ngan dan kan talat ma sam pi kha, tɔn ni tham thi bɔrisat lek lek",
        en: "I've worked in marketing for three years; now I'm at a small company.",
        vi: "Tôi làm marketing được ba năm rồi; hiện đang làm ở một công ty nhỏ.",
      },
      {
        speaker: "Candidate",
        th: "ผมอยากหาความท้าทายใหม่ๆ ค่ะ",
        rtgs: "phom yak ha khwam tha thai mai mai kha",
        en: "I'm looking for new challenges.",
        vi: "Tôi muốn tìm thử thách mới.",
      },
    ],
    key_vocab: [
      { th: "ประสบการณ์", rtgs: "prasopkan", en: "experience", vi: "kinh nghiệm" },
      { th: "การตลาด", rtgs: "kan talat", en: "marketing", vi: "marketing / tiếp thị" },
      { th: "ความท้าทาย", rtgs: "khwam tha thai", en: "challenge", vi: "thử thách" },
    ],
    questions: [
      {
        q_en: "How long has the candidate worked in marketing?",
        q_vi: "Ứng viên làm marketing bao lâu?",
        answer_en: "Three years.",
        answer_vi: "Ba năm.",
      },
      {
        q_en: "Why are they looking for a new job?",
        q_vi: "Vì sao họ tìm việc mới?",
        answer_en: "They want new challenges.",
        answer_vi: "Họ muốn thử thách mới.",
      },
    ],
  },

  // ── B2 ────────────────────────────────────────────────────────────────────
  {
    id: "th-listen-b2-01-workplace-meeting",
    level: "B2",
    topic: "workplace",
    title_en: "Team meeting: project delay",
    title_vi: "Họp nhóm: dự án bị trễ",
    goal_en: "Catch the cause of the delay and the proposed solution.",
    goal_vi: "Nghe ra nguyên nhân trễ và giải pháp đề xuất.",
    script: [
      {
        speaker: "Lead",
        th: "โปรเจกต์ของเราล่าช้ากว่ากำหนดประมาณหนึ่งสัปดาห์",
        rtgs: "projek khɔng rao la cha kwa kamnot praman nueng sapda",
        en: "Our project is running about a week behind schedule.",
        vi: "Dự án của chúng ta đang trễ tiến độ khoảng một tuần.",
      },
      {
        speaker: "Member",
        th: "สาเหตุหลักคือทีมออกแบบยังส่งงานไม่ครบ",
        rtgs: "saheet lak khue thim ɔk baep yang song ngan mai khrop",
        en: "The main cause is that the design team hasn't delivered everything.",
        vi: "Nguyên nhân chính là nhóm thiết kế chưa giao đủ phần việc.",
      },
      {
        speaker: "Lead",
        th: "งั้นเราขอเพิ่มคนชั่วคราว แล้วเลื่อนเส้นตายออกไปสองวัน",
        rtgs: "ngan rao khɔ phoem khon chua khrao, laeo luean sen tai ɔk pai sɔng wan",
        en: "Then let's add temporary staff and push the deadline back two days.",
        vi: "Vậy ta thêm người tạm thời rồi dời hạn chót thêm hai ngày.",
      },
    ],
    key_vocab: [
      { th: "ล่าช้า", en: "delayed", vi: "trễ / chậm" },
      { th: "สาเหตุ", en: "cause", vi: "nguyên nhân" },
      { th: "เส้นตาย", en: "deadline", vi: "hạn chót" },
    ],
    questions: [
      {
        q_en: "What is the main cause of the delay?",
        q_vi: "Nguyên nhân chính gây trễ là gì?",
        answer_en: "The design team hasn't delivered everything.",
        answer_vi: "Nhóm thiết kế chưa giao đủ việc.",
      },
      {
        q_en: "What two actions does the lead propose?",
        q_vi: "Trưởng nhóm đề xuất hai hành động nào?",
        answer_en: "Add temporary staff and push the deadline back two days.",
        answer_vi: "Thêm người tạm thời và dời hạn chót thêm hai ngày.",
      },
    ],
  },
  {
    id: "th-listen-b2-02-phone-complaint",
    level: "B2",
    topic: "phone",
    title_en: "Phone: service complaint and resolution",
    title_vi: "Điện thoại: phàn nàn dịch vụ và cách xử lý",
    goal_en: "Catch the complaint and the compensation offered.",
    goal_vi: "Nghe ra lời phàn nàn và mức đền bù được đề nghị.",
    script: [
      {
        speaker: "Customer",
        th: "อินเทอร์เน็ตที่บ้านใช้ไม่ได้มาสามวันแล้วครับ",
        rtgs: "internet thi ban chai mai dai ma sam wan laeo khrap",
        en: "My home internet hasn't worked for three days.",
        vi: "Internet ở nhà tôi không dùng được ba ngày rồi.",
      },
      {
        speaker: "Agent",
        th: "ต้องขออภัยอย่างยิ่งค่ะ ทางเราจะส่งช่างไปพรุ่งนี้เช้า",
        rtgs: "tɔng khɔ aphai yang ying kha, thang rao ja song chang pai phrung ni chao",
        en: "We sincerely apologize; we'll send a technician tomorrow morning.",
        vi: "Chúng tôi thành thật xin lỗi; chúng tôi sẽ cử kỹ thuật viên đến sáng mai.",
      },
      {
        speaker: "Agent",
        th: "และจะลดค่าบริการเดือนนี้ให้ห้าสิบเปอร์เซ็นต์ค่ะ",
        rtgs: "lae ja lot kha bɔrikan duean ni hai ha sip percent kha",
        en: "And we'll reduce this month's bill by 50%.",
        vi: "Và chúng tôi sẽ giảm 50% phí dịch vụ tháng này.",
      },
    ],
    key_vocab: [
      { th: "ใช้ไม่ได้", en: "doesn't work / unusable", vi: "không dùng được" },
      { th: "ขออภัย", en: "to apologize (formal)", vi: "xin lỗi (trang trọng)" },
      { th: "ค่าบริการ", en: "service fee", vi: "phí dịch vụ" },
    ],
    questions: [
      {
        q_en: "What is the customer's complaint?",
        q_vi: "Khách phàn nàn điều gì?",
        answer_en: "Home internet hasn't worked for three days.",
        answer_vi: "Internet nhà không dùng được ba ngày.",
      },
      {
        q_en: "What compensation is offered?",
        q_vi: "Mức đền bù là gì?",
        answer_en: "A technician tomorrow morning and a 50% discount this month.",
        answer_vi: "Cử kỹ thuật viên sáng mai và giảm 50% phí tháng này.",
      },
    ],
  },
  {
    id: "th-listen-b2-03-interview-strength",
    level: "B2",
    topic: "interview",
    title_en: "Interview: strengths and weaknesses",
    title_vi: "Phỏng vấn: điểm mạnh và điểm yếu",
    goal_en: "Catch the stated strength and the weakness being managed.",
    goal_vi: "Nghe ra điểm mạnh và điểm yếu đang được khắc phục.",
    script: [
      {
        speaker: "Interviewer",
        th: "คุณคิดว่าจุดแข็งและจุดอ่อนของตัวเองคืออะไร",
        rtgs: "khun khit wa jut khaeng lae jut ɔn khɔng tua eng khue arai",
        en: "What do you think your strengths and weaknesses are?",
        vi: "Bạn nghĩ điểm mạnh và điểm yếu của mình là gì?",
      },
      {
        speaker: "Candidate",
        th: "จุดแข็งคือผมทำงานเป็นระบบและจัดลำดับความสำคัญได้ดี",
        rtgs: "jut khaeng khue phom tham ngan pen rabop lae jat lamdap khwam samkhan dai di",
        en: "My strength is that I work systematically and prioritize well.",
        vi: "Điểm mạnh của tôi là làm việc có hệ thống và biết sắp xếp ưu tiên.",
      },
      {
        speaker: "Candidate",
        th: "ส่วนจุดอ่อนคือบางครั้งผมละเอียดเกินไป แต่กำลังฝึกให้ยืดหยุ่นมากขึ้น",
        rtgs: "suan jut ɔn khue bang khrang phom la iat koen pai, tae kamlang fuek hai yuet yun mak khuen",
        en: "As for weaknesses, I'm sometimes too detail-oriented, but I'm learning to be more flexible.",
        vi: "Còn điểm yếu là đôi khi tôi quá tỉ mỉ, nhưng đang tập linh hoạt hơn.",
      },
    ],
    key_vocab: [
      { th: "จุดแข็ง", en: "strength", vi: "điểm mạnh" },
      { th: "จุดอ่อน", en: "weakness", vi: "điểm yếu" },
      { th: "จัดลำดับความสำคัญ", en: "to prioritize", vi: "sắp xếp ưu tiên" },
    ],
    questions: [
      {
        q_en: "What is the candidate's stated strength?",
        q_vi: "Điểm mạnh ứng viên nêu là gì?",
        answer_en: "Working systematically and prioritizing well.",
        answer_vi: "Làm việc có hệ thống và biết sắp xếp ưu tiên.",
      },
      {
        q_en: "How are they managing their weakness?",
        q_vi: "Họ khắc phục điểm yếu thế nào?",
        answer_en: "By learning to be more flexible.",
        answer_vi: "Bằng cách tập linh hoạt hơn.",
      },
    ],
  },
  {
    id: "th-listen-b2-04-news-weather",
    level: "B2",
    topic: "lecture_news",
    title_en: "News brief: weather warning",
    title_vi: "Bản tin: cảnh báo thời tiết",
    goal_en: "Catch the affected area and the recommended action.",
    goal_vi: "Nghe ra khu vực bị ảnh hưởng và khuyến cáo.",
    script: [
      {
        th: "กรมอุตุนิยมวิทยาเตือนว่าจะมีฝนตกหนักทางภาคใต้ในช่วงสุดสัปดาห์นี้",
        rtgs: "krom utuniyom witthaya tuean wa ja mi fon tok nak thang phak tai nai chuang sut sapda ni",
        en: "The Meteorological Department warns of heavy rain in the South this weekend.",
        vi: "Cục Khí tượng cảnh báo mưa lớn ở miền Nam vào cuối tuần này.",
      },
      {
        th: "ขอให้ประชาชนหลีกเลี่ยงพื้นที่เสี่ยงน้ำท่วมและติดตามข่าวอย่างใกล้ชิด",
        rtgs: "khɔ hai prachachon lik liang phuenthi siang nam thuam lae tit tam khao yang klai chit",
        en: "Citizens are asked to avoid flood-risk areas and follow the news closely.",
        vi: "Đề nghị người dân tránh các khu vực có nguy cơ ngập và theo dõi tin tức sát sao.",
      },
    ],
    key_vocab: [
      { th: "เตือน", en: "to warn", vi: "cảnh báo" },
      { th: "ภาคใต้", en: "the South (region)", vi: "miền Nam" },
      { th: "น้ำท่วม", en: "flood", vi: "lũ lụt / ngập" },
    ],
    questions: [
      {
        q_en: "Which region is affected?",
        q_vi: "Khu vực nào bị ảnh hưởng?",
        answer_en: "The South.",
        answer_vi: "Miền Nam.",
      },
      {
        q_en: "What are citizens advised to do?",
        q_vi: "Người dân được khuyên làm gì?",
        answer_en: "Avoid flood-risk areas and follow the news closely.",
        answer_vi: "Tránh khu vực nguy cơ ngập và theo dõi tin tức sát sao.",
      },
    ],
  },
  {
    id: "th-listen-b2-05-announcement-flight",
    level: "B2",
    topic: "announcement",
    title_en: "Airport: flight delay announcement",
    title_vi: "Sân bay: thông báo hoãn chuyến",
    goal_en: "Catch the flight, the reason, and the new boarding time.",
    goal_vi: "Nghe ra chuyến bay, lý do, và giờ lên máy bay mới.",
    script: [
      {
        th: "เรียนผู้โดยสารเที่ยวบินทีจี 211 ไปโตเกียว",
        rtgs: "rian phu doisan thiao bin thi ji sɔng nueng nueng pai tokiao",
        en: "Attention passengers of flight TG 211 to Tokyo.",
        vi: "Kính thông báo hành khách chuyến TG 211 đi Tokyo.",
      },
      {
        th: "เที่ยวบินล่าช้าเนื่องจากสภาพอากาศ กำหนดขึ้นเครื่องใหม่เวลาสองทุ่ม",
        rtgs: "thiao bin la cha nueang jak saphap akat, kamnot khuen khrueang mai welaa sɔng thum",
        en: "The flight is delayed due to weather; new boarding time is 8 p.m.",
        vi: "Chuyến bay bị hoãn do thời tiết; giờ lên máy bay mới là 8 giờ tối.",
      },
    ],
    key_vocab: [
      { th: "เที่ยวบิน", en: "flight", vi: "chuyến bay" },
      { th: "ล่าช้า", en: "delayed", vi: "bị hoãn" },
      { th: "ขึ้นเครื่อง", en: "to board (a plane)", vi: "lên máy bay" },
    ],
    questions: [
      {
        q_en: "Why is the flight delayed?",
        q_vi: "Vì sao chuyến bay bị hoãn?",
        answer_en: "Due to weather.",
        answer_vi: "Do thời tiết.",
      },
      {
        q_en: "What is the new boarding time?",
        q_vi: "Giờ lên máy bay mới là khi nào?",
        answer_en: "8 p.m.",
        answer_vi: "8 giờ tối.",
      },
    ],
  },

  // ── C1 ────────────────────────────────────────────────────────────────────
  {
    id: "th-listen-c1-01-lecture-economy",
    level: "C1",
    topic: "lecture_news",
    title_en: "Lecture: tourism and the local economy",
    title_vi: "Bài giảng: du lịch và kinh tế địa phương",
    goal_en: "Catch the speaker's main argument and one supporting point.",
    goal_vi: "Nghe ra luận điểm chính và một ý hỗ trợ.",
    script: [
      {
        speaker: "Lecturer",
        th: "การท่องเที่ยวสร้างรายได้มหาศาล แต่ก็ทำให้เศรษฐกิจท้องถิ่นพึ่งพาภาคเดียวมากเกินไป",
        en: "Tourism generates enormous income, but it also makes the local economy overly dependent on a single sector.",
        vi: "Du lịch tạo ra nguồn thu khổng lồ, nhưng cũng khiến kinh tế địa phương phụ thuộc quá mức vào một ngành.",
      },
      {
        speaker: "Lecturer",
        th: "เมื่อเกิดวิกฤต เช่น โรคระบาด รายได้จึงหายไปเกือบทั้งหมดอย่างรวดเร็ว",
        en: "When a crisis such as a pandemic occurs, income disappears almost entirely and very quickly.",
        vi: "Khi xảy ra khủng hoảng như dịch bệnh, nguồn thu gần như biến mất hoàn toàn và rất nhanh.",
      },
      {
        speaker: "Lecturer",
        th: "ดังนั้น ผมจึงเสนอให้กระจายแหล่งรายได้ไปสู่ภาคเกษตรและงานฝีมือด้วย",
        en: "Therefore, I propose diversifying income sources into agriculture and crafts as well.",
        vi: "Vì vậy, tôi đề xuất đa dạng hóa nguồn thu sang cả nông nghiệp và thủ công.",
      },
    ],
    key_vocab: [
      { th: "พึ่งพา", en: "to depend on", vi: "phụ thuộc" },
      { th: "วิกฤต", en: "crisis", vi: "khủng hoảng" },
      { th: "กระจาย", en: "to diversify / distribute", vi: "đa dạng hóa / phân tán" },
    ],
    questions: [
      {
        q_en: "What is the lecturer's main argument?",
        q_vi: "Luận điểm chính của giảng viên là gì?",
        answer_en: "Tourism income is large but makes the local economy too dependent on one sector.",
        answer_vi: "Thu nhập từ du lịch lớn nhưng khiến kinh tế địa phương phụ thuộc quá mức vào một ngành.",
      },
      {
        q_en: "What does the lecturer propose?",
        q_vi: "Giảng viên đề xuất gì?",
        answer_en: "Diversifying income into agriculture and crafts.",
        answer_vi: "Đa dạng hóa nguồn thu sang nông nghiệp và thủ công.",
      },
    ],
  },
  {
    id: "th-listen-c1-02-interview-expert",
    level: "C1",
    topic: "interview",
    title_en: "Expert interview: remote work trends",
    title_vi: "Phỏng vấn chuyên gia: xu hướng làm việc từ xa",
    goal_en: "Catch the expert's claim and the caveat they add.",
    goal_vi: "Nghe ra nhận định của chuyên gia và điểm dè dặt họ thêm vào.",
    script: [
      {
        speaker: "Host",
        th: "การทำงานทางไกลจะอยู่กับเราถาวรไหมครับ",
        en: "Is remote work here to stay permanently?",
        vi: "Làm việc từ xa sẽ tồn tại lâu dài chứ?",
      },
      {
        speaker: "Expert",
        th: "ผมเชื่อว่ารูปแบบผสมจะกลายเป็นมาตรฐานใหม่ มากกว่าการทำงานทางไกลเต็มรูปแบบ",
        en: "I believe a hybrid model will become the new standard, rather than fully remote work.",
        vi: "Tôi tin mô hình kết hợp sẽ thành chuẩn mực mới, hơn là làm từ xa hoàn toàn.",
      },
      {
        speaker: "Expert",
        th: "อย่างไรก็ตาม มันขึ้นอยู่กับประเภทงานและวัฒนธรรมองค์กรเป็นสำคัญ",
        en: "However, it depends largely on the type of work and the organizational culture.",
        vi: "Tuy nhiên, điều đó phụ thuộc chủ yếu vào loại công việc và văn hóa tổ chức.",
      },
    ],
    key_vocab: [
      { th: "ทางไกล", en: "remote / long-distance", vi: "từ xa" },
      { th: "รูปแบบผสม", en: "hybrid model", vi: "mô hình kết hợp" },
      { th: "ขึ้นอยู่กับ", en: "depends on", vi: "phụ thuộc vào" },
    ],
    questions: [
      {
        q_en: "What does the expert predict will be the new standard?",
        q_vi: "Chuyên gia dự đoán điều gì sẽ thành chuẩn mực mới?",
        answer_en: "A hybrid work model.",
        answer_vi: "Mô hình làm việc kết hợp.",
      },
      {
        q_en: "What caveat does the expert add?",
        q_vi: "Chuyên gia thêm điểm dè dặt nào?",
        answer_en: "It depends on the type of work and organizational culture.",
        answer_vi: "Phụ thuộc vào loại công việc và văn hóa tổ chức.",
      },
    ],
  },
  {
    id: "th-listen-c1-03-news-policy",
    level: "C1",
    topic: "lecture_news",
    title_en: "News analysis: new education policy",
    title_vi: "Phân tích tin: chính sách giáo dục mới",
    goal_en: "Catch the policy change and the analyst's concern.",
    goal_vi: "Nghe ra thay đổi chính sách và mối lo của nhà phân tích.",
    script: [
      {
        th: "รัฐบาลประกาศปรับหลักสูตรให้เน้นทักษะดิจิทัลตั้งแต่ระดับประถม",
        en: "The government announced a curriculum reform emphasizing digital skills from primary level.",
        vi: "Chính phủ công bố cải cách chương trình, chú trọng kỹ năng số ngay từ cấp tiểu học.",
      },
      {
        th: "นักวิเคราะห์ชี้ว่านโยบายนี้ดี แต่ความเหลื่อมล้ำด้านอุปกรณ์อาจทำให้ผลลัพธ์ต่างกันมาก",
        en: "Analysts note the policy is sound, but inequality in access to devices may cause widely differing outcomes.",
        vi: "Các nhà phân tích cho rằng chính sách tốt, nhưng bất bình đẳng về thiết bị có thể khiến kết quả chênh lệch lớn.",
      },
    ],
    key_vocab: [
      { th: "หลักสูตร", en: "curriculum", vi: "chương trình học" },
      { th: "ทักษะดิจิทัล", en: "digital skills", vi: "kỹ năng số" },
      { th: "ความเหลื่อมล้ำ", en: "inequality", vi: "bất bình đẳng" },
    ],
    questions: [
      {
        q_en: "What does the new policy emphasize?",
        q_vi: "Chính sách mới chú trọng điều gì?",
        answer_en: "Digital skills from primary level.",
        answer_vi: "Kỹ năng số từ cấp tiểu học.",
      },
      {
        q_en: "What concern do analysts raise?",
        q_vi: "Nhà phân tích nêu lo ngại gì?",
        answer_en: "Inequality in device access may cause very different outcomes.",
        answer_vi: "Bất bình đẳng về thiết bị có thể khiến kết quả chênh lệch lớn.",
      },
    ],
  },
  {
    id: "th-listen-c1-04-workplace-negotiation",
    level: "C1",
    topic: "workplace",
    title_en: "Negotiation: budget reallocation",
    title_vi: "Đàm phán: phân bổ lại ngân sách",
    goal_en: "Catch each side's position and the compromise reached.",
    goal_vi: "Nghe ra lập trường mỗi bên và thỏa hiệp đạt được.",
    script: [
      {
        speaker: "Dept A",
        th: "ทีมเราต้องการงบเพิ่มเพื่อจ้างนักพัฒนาอีกสองคน",
        en: "Our team needs more budget to hire two more developers.",
        vi: "Nhóm chúng tôi cần thêm ngân sách để thuê hai lập trình viên nữa.",
      },
      {
        speaker: "Dept B",
        th: "แต่ถ้าโอนงบมาทางคุณ โครงการการตลาดของเราจะสะดุด",
        en: "But if the budget moves to you, our marketing project will stall.",
        vi: "Nhưng nếu chuyển ngân sách sang bên anh, dự án marketing của chúng tôi sẽ đình trệ.",
      },
      {
        speaker: "Director",
        th: "งั้นเราแบ่งครึ่ง จ้างนักพัฒนาหนึ่งคนตอนนี้ ที่เหลือทบทวนไตรมาสหน้า",
        en: "Then let's split it: hire one developer now and review the rest next quarter.",
        vi: "Vậy chia đôi: thuê một lập trình viên ngay, phần còn lại xem xét quý sau.",
      },
    ],
    key_vocab: [
      { th: "งบ", en: "budget", vi: "ngân sách" },
      { th: "โอน", en: "to transfer", vi: "chuyển" },
      { th: "ทบทวน", en: "to review / reconsider", vi: "xem xét lại" },
    ],
    questions: [
      {
        q_en: "What does Department A want?",
        q_vi: "Phòng A muốn gì?",
        answer_en: "More budget to hire two developers.",
        answer_vi: "Thêm ngân sách để thuê hai lập trình viên.",
      },
      {
        q_en: "What compromise does the director reach?",
        q_vi: "Giám đốc đạt thỏa hiệp nào?",
        answer_en: "Hire one developer now; review the rest next quarter.",
        answer_vi: "Thuê một lập trình viên ngay; phần còn lại xem xét quý sau.",
      },
    ],
  },

  // ── C2 ────────────────────────────────────────────────────────────────────
  {
    id: "th-listen-c2-01-lecture-language",
    level: "C2",
    topic: "lecture_news",
    title_en: "Academic lecture: language and identity",
    title_vi: "Bài giảng học thuật: ngôn ngữ và bản sắc",
    goal_en: "Catch the central thesis and the rhetorical move the speaker uses to qualify it.",
    goal_vi: "Nghe ra luận đề trung tâm và cách diễn giả dùng tu từ để giới hạn nó.",
    script: [
      {
        speaker: "Lecturer",
        th: "ภาษามิได้เป็นเพียงเครื่องมือสื่อสาร หากแต่เป็นพื้นที่ที่อัตลักษณ์ถูกต่อรองและสถาปนาขึ้นใหม่อยู่เสมอ",
        en: "Language is not merely a tool of communication; rather, it is a space where identity is constantly negotiated and reconstituted.",
        vi: "Ngôn ngữ không chỉ là công cụ giao tiếp; đúng hơn, nó là không gian nơi bản sắc liên tục được thương lượng và tái tạo.",
      },
      {
        speaker: "Lecturer",
        th: "อย่างไรก็ดี เราพึงระวังมิให้สรุปแบบเหมารวมว่าทุกชุมชนภาษาประสบสภาวะเช่นนี้ในระดับเดียวกัน",
        en: "Nevertheless, we should be wary of the sweeping generalization that every speech community experiences this to the same degree.",
        vi: "Tuy vậy, ta cần thận trọng tránh khái quát hóa rằng mọi cộng đồng ngôn ngữ đều trải qua điều này ở cùng một mức độ.",
      },
      {
        speaker: "Lecturer",
        th: "ประเด็นจึงมิใช่ว่าภาษากำหนดตัวตน แต่อยู่ที่ว่าเงื่อนไขทางสังคมใดทำให้บางอัตลักษณ์เด่นชัดกว่าอัตลักษณ์อื่น",
        en: "The question, then, is not whether language determines selfhood, but which social conditions make certain identities more salient than others.",
        vi: "Vấn đề do đó không phải ngôn ngữ quyết định bản ngã, mà là điều kiện xã hội nào khiến một số bản sắc nổi bật hơn các bản sắc khác.",
      },
    ],
    key_vocab: [
      { th: "อัตลักษณ์", en: "identity", vi: "bản sắc" },
      { th: "ต่อรอง", en: "to negotiate", vi: "thương lượng" },
      { th: "เหมารวม", en: "to over-generalize / lump together", vi: "khái quát hóa / vơ đũa cả nắm" },
    ],
    questions: [
      {
        q_en: "What is the central thesis?",
        q_vi: "Luận đề trung tâm là gì?",
        answer_en: "Language is a space where identity is continually negotiated, not just a communication tool.",
        answer_vi: "Ngôn ngữ là không gian nơi bản sắc liên tục được thương lượng, không chỉ là công cụ giao tiếp.",
      },
      {
        q_en: "How does the speaker qualify the thesis?",
        q_vi: "Diễn giả giới hạn luận đề thế nào?",
        answer_en: "By warning against assuming all speech communities experience this equally, and reframing it as a question of social conditions.",
        answer_vi: "Bằng cách cảnh báo đừng cho rằng mọi cộng đồng ngôn ngữ trải nghiệm điều này như nhau, và chuyển thành câu hỏi về điều kiện xã hội.",
      },
    ],
  },
  {
    id: "th-listen-c2-02-news-debate",
    level: "C2",
    topic: "lecture_news",
    title_en: "Panel debate: AI regulation",
    title_vi: "Tọa đàm: quản lý AI",
    goal_en: "Catch the two opposing positions and the moderator's synthesis.",
    goal_vi: "Nghe ra hai lập trường đối lập và phần tổng hợp của người điều phối.",
    script: [
      {
        speaker: "Panelist 1",
        th: "การกำกับดูแลที่เข้มงวดเกินไปจะบั่นทอนนวัตกรรมและผลักผู้ประกอบการไปต่างประเทศ",
        en: "Overly strict regulation will stifle innovation and push entrepreneurs abroad.",
        vi: "Quản lý quá nghiêm ngặt sẽ bóp nghẹt đổi mới và đẩy doanh nghiệp ra nước ngoài.",
      },
      {
        speaker: "Panelist 2",
        th: "ในทางกลับกัน การปล่อยให้ตลาดกำกับตัวเองได้พิสูจน์แล้วว่านำไปสู่การละเมิดสิทธิ์อย่างกว้างขวาง",
        en: "Conversely, letting the market self-regulate has proven to lead to widespread abuses of rights.",
        vi: "Ngược lại, để thị trường tự điều tiết đã được chứng minh dẫn đến vi phạm quyền trên diện rộng.",
      },
      {
        speaker: "Moderator",
        th: "ดูเหมือนทั้งสองฝ่ายเห็นพ้องในหลักการ ต่างกันเพียงระดับและจังหวะเวลาของการบังคับใช้เท่านั้น",
        en: "It seems both sides agree in principle, differing only on the degree and timing of enforcement.",
        vi: "Có vẻ cả hai bên đồng ý về nguyên tắc, chỉ khác nhau ở mức độ và thời điểm thực thi.",
      },
    ],
    key_vocab: [
      { th: "กำกับดูแล", en: "to regulate / oversee", vi: "quản lý / giám sát" },
      { th: "บั่นทอน", en: "to undermine / stifle", vi: "bóp nghẹt / làm suy yếu" },
      { th: "บังคับใช้", en: "to enforce", vi: "thực thi" },
    ],
    questions: [
      {
        q_en: "What are the two opposing positions?",
        q_vi: "Hai lập trường đối lập là gì?",
        answer_en: "Strict regulation stifles innovation vs. self-regulation leads to rights abuses.",
        answer_vi: "Quản lý nghiêm ngặt bóp nghẹt đổi mới >< tự điều tiết dẫn đến vi phạm quyền.",
      },
      {
        q_en: "How does the moderator synthesize them?",
        q_vi: "Người điều phối tổng hợp thế nào?",
        answer_en: "Both agree in principle; they differ only on the degree and timing of enforcement.",
        answer_vi: "Cả hai đồng ý về nguyên tắc; chỉ khác về mức độ và thời điểm thực thi.",
      },
    ],
  },
  {
    id: "th-listen-c2-03-interview-author",
    level: "C2",
    topic: "interview",
    title_en: "Author interview: implied meaning",
    title_vi: "Phỏng vấn tác giả: hàm ý",
    goal_en: "Catch what the author implies but does not state outright.",
    goal_vi: "Nghe ra điều tác giả ngụ ý nhưng không nói thẳng.",
    script: [
      {
        speaker: "Host",
        th: "หนังสือเล่มนี้มองโลกในแง่ร้ายไหมครับ",
        en: "Is this book pessimistic about the world?",
        vi: "Cuốn sách này có bi quan về thế giới không?",
      },
      {
        speaker: "Author",
        th: "ผมคงไม่ใช้คำว่าแง่ร้าย ผมเพียงปฏิเสธที่จะปลอบประโลมผู้อ่านด้วยคำตอบสำเร็จรูป",
        en: "I wouldn't use the word pessimistic; I simply refuse to comfort the reader with ready-made answers.",
        vi: "Tôi sẽ không dùng từ bi quan; tôi chỉ từ chối an ủi độc giả bằng những câu trả lời có sẵn.",
      },
      {
        speaker: "Author",
        th: "ถ้าผู้อ่านปิดเล่มแล้วรู้สึกอึดอัด นั่นอาจเป็นสัญญาณว่าเขาเริ่มตั้งคำถามที่ถูกต้องแล้วก็ได้",
        en: "If readers close the book feeling uneasy, that may be a sign they have begun asking the right questions.",
        vi: "Nếu độc giả gấp sách lại với cảm giác bất an, đó có thể là dấu hiệu họ đã bắt đầu đặt đúng câu hỏi.",
      },
    ],
    key_vocab: [
      { th: "แง่ร้าย", en: "pessimistic", vi: "bi quan" },
      { th: "ปลอบประโลม", en: "to comfort / console", vi: "an ủi / xoa dịu" },
      { th: "อึดอัด", en: "uneasy / uncomfortable", vi: "bất an / khó chịu" },
    ],
    questions: [
      {
        q_en: "Does the author accept the label 'pessimistic'?",
        q_vi: "Tác giả có chấp nhận nhãn 'bi quan' không?",
        answer_en: "No; he reframes it as refusing to give easy, comforting answers.",
        answer_vi: "Không; ông diễn giải lại là từ chối đưa ra câu trả lời dễ dãi, an ủi.",
      },
      {
        q_en: "What does the author imply discomfort in the reader means?",
        q_vi: "Tác giả ngụ ý cảm giác bất an của độc giả nghĩa là gì?",
        answer_en: "That they have started asking the right questions.",
        answer_vi: "Rằng họ đã bắt đầu đặt đúng câu hỏi.",
      },
    ],
  },
  {
    id: "th-listen-c2-04-lecture-history",
    level: "C2",
    topic: "lecture_news",
    title_en: "Lecture: historiography and bias",
    title_vi: "Bài giảng: sử học và thiên kiến",
    goal_en: "Catch the methodological point and the example used to illustrate it.",
    goal_vi: "Nghe ra luận điểm phương pháp luận và ví dụ minh họa.",
    script: [
      {
        speaker: "Lecturer",
        th: "ทุกบันทึกทางประวัติศาสตร์ล้วนถูกเขียนจากจุดยืนใดจุดยืนหนึ่ง การอ้างความเป็นกลางอย่างสมบูรณ์จึงน่าสงสัยเสมอ",
        en: "Every historical record is written from some standpoint; claims of complete neutrality are therefore always suspect.",
        vi: "Mọi ghi chép lịch sử đều được viết từ một lập trường nào đó; vì vậy tuyên bố hoàn toàn trung lập luôn đáng ngờ.",
      },
      {
        speaker: "Lecturer",
        th: "ยกตัวอย่างเช่น พงศาวดารราชสำนักมักบันทึกชัยชนะของกษัตริย์ แต่แทบไม่กล่าวถึงต้นทุนที่ราษฎรต้องแบกรับ",
        en: "For instance, royal chronicles often record a king's victories but scarcely mention the costs borne by common people.",
        vi: "Ví dụ, biên niên sử triều đình thường ghi chiến thắng của vua nhưng hầu như không nhắc đến cái giá dân thường gánh chịu.",
      },
      {
        speaker: "Lecturer",
        th: "หน้าที่ของนักประวัติศาสตร์จึงมิใช่การลบอคติให้หมดสิ้น แต่คือการทำให้อคตินั้นปรากฏชัดและตรวจสอบได้",
        en: "The historian's task, then, is not to eliminate bias entirely, but to make that bias visible and accountable.",
        vi: "Nhiệm vụ của sử gia do đó không phải xóa sạch thiên kiến, mà là làm cho thiên kiến đó hiện rõ và có thể kiểm chứng.",
      },
    ],
    key_vocab: [
      { th: "จุดยืน", en: "standpoint / position", vi: "lập trường" },
      { th: "ความเป็นกลาง", en: "neutrality", vi: "tính trung lập" },
      { th: "อคติ", en: "bias / prejudice", vi: "thiên kiến / định kiến" },
    ],
    questions: [
      {
        q_en: "What is the lecturer's methodological point?",
        q_vi: "Luận điểm phương pháp luận của giảng viên là gì?",
        answer_en: "All records carry a standpoint; the historian's job is to make bias visible, not erase it.",
        answer_vi: "Mọi ghi chép đều mang lập trường; việc của sử gia là làm thiên kiến hiện rõ, không phải xóa nó.",
      },
      {
        q_en: "What example illustrates the point?",
        q_vi: "Ví dụ nào minh họa luận điểm?",
        answer_en: "Royal chronicles record kings' victories but ignore the costs to common people.",
        answer_vi: "Biên niên sử triều đình ghi chiến thắng của vua nhưng bỏ qua cái giá của dân thường.",
      },
    ],
  },

  // ── Additional scripts (mixed levels) ──────────────────────────────────────
  {
    id: "th-listen-a1-06-order-food-slow",
    level: "A1",
    topic: "slow_speech",
    title_en: "Ordering food (slow)",
    title_vi: "Gọi món ăn (nói chậm)",
    goal_en: "Catch the dish ordered and the drink.",
    goal_vi: "Nghe ra món ăn và đồ uống được gọi.",
    script: [
      {
        speaker: "Customer",
        th: "ขอข้าวผัดหนึ่งจานครับ",
        rtgs: "khɔ khao phat nueng jan khrap",
        en: "One fried rice, please.",
        vi: "Cho một đĩa cơm rang ạ.",
      },
      {
        speaker: "Waiter",
        th: "รับน้ำอะไรดีคะ",
        rtgs: "rap nam arai di kha",
        en: "What would you like to drink?",
        vi: "Anh uống gì ạ?",
      },
      {
        speaker: "Customer",
        th: "ขอน้ำเปล่าครับ",
        rtgs: "khɔ nam plao khrap",
        en: "Plain water, please.",
        vi: "Cho nước lọc ạ.",
      },
    ],
    key_vocab: [
      { th: "ข้าวผัด", rtgs: "khao phat", en: "fried rice", vi: "cơm rang" },
      { th: "น้ำเปล่า", rtgs: "nam plao", en: "plain water", vi: "nước lọc" },
    ],
    questions: [
      {
        q_en: "What dish does the customer order?",
        q_vi: "Khách gọi món gì?",
        answer_en: "Fried rice.",
        answer_vi: "Cơm rang.",
      },
      {
        q_en: "What do they drink?",
        q_vi: "Họ uống gì?",
        answer_en: "Plain water.",
        answer_vi: "Nước lọc.",
      },
    ],
  },
  {
    id: "th-listen-b1-06-taxi-negotiate",
    level: "B1",
    topic: "taxi",
    title_en: "Taxi: fixed fare negotiation",
    title_vi: "Taxi: thương lượng giá khoán",
    goal_en: "Catch the driver's first fare and the agreed fare.",
    goal_vi: "Nghe ra giá tài xế đưa đầu tiên và giá chốt.",
    script: [
      {
        speaker: "Passenger",
        th: "ไปตลาดนัดเท่าไหร่ครับ ไม่เปิดมิเตอร์เหรอ",
        rtgs: "pai talat nat thao rai khrap, mai poet mitoe roe",
        en: "How much to the market? You won't use the meter?",
        vi: "Đi chợ phiên bao nhiêu? Không bật đồng hồ à?",
      },
      {
        speaker: "Driver",
        th: "เหมาสองร้อยครับ ตอนนี้รถติด",
        rtgs: "mao sɔng rɔi khrap, tɔn ni rot tit",
        en: "A flat 200; it's congested now.",
        vi: "Khoán 200; giờ đang kẹt xe.",
      },
      {
        speaker: "Passenger",
        th: "แพงไปครับ ร้อยห้าสิบได้ไหม",
        rtgs: "phaeng pai khrap, rɔi ha sip dai mai",
        en: "Too expensive; how about 150?",
        vi: "Đắt quá; 150 được không?",
      },
      {
        speaker: "Driver",
        th: "เอาร้อยแปดสิบก็แล้วกันครับ",
        rtgs: "ao rɔi paet sip kɔ laeo kan khrap",
        en: "Let's make it 180 then.",
        vi: "Thôi 180 vậy.",
      },
    ],
    key_vocab: [
      { th: "เหมา", rtgs: "mao", en: "flat/fixed fare", vi: "giá khoán" },
      { th: "แพงไป", rtgs: "phaeng pai", en: "too expensive", vi: "đắt quá" },
      { th: "ก็แล้วกัน", rtgs: "kɔ laeo kan", en: "then let's settle on", vi: "vậy thì chốt" },
    ],
    questions: [
      {
        q_en: "What flat fare did the driver first ask?",
        q_vi: "Tài xế đưa giá khoán đầu tiên là bao nhiêu?",
        answer_en: "200 baht.",
        answer_vi: "200 baht.",
      },
      {
        q_en: "What fare did they agree on?",
        q_vi: "Họ chốt giá nào?",
        answer_en: "180 baht.",
        answer_vi: "180 baht.",
      },
    ],
  },
  {
    id: "th-listen-b2-06-news-health",
    level: "B2",
    topic: "lecture_news",
    title_en: "News brief: public health campaign",
    title_vi: "Bản tin: chiến dịch y tế công cộng",
    goal_en: "Catch the campaign's target group and its main advice.",
    goal_vi: "Nghe ra nhóm đối tượng của chiến dịch và lời khuyên chính.",
    script: [
      {
        th: "กระทรวงสาธารณสุขเปิดตัวแคมเปญส่งเสริมการออกกำลังกายในกลุ่มวัยทำงาน",
        rtgs: "krasuang satharanasuk poet tua campaign song soem kan ɔk kamlang kai nai klum wai tham ngan",
        en: "The Ministry of Public Health launched a campaign promoting exercise among working-age people.",
        vi: "Bộ Y tế ra mắt chiến dịch khuyến khích tập thể dục trong nhóm người trong độ tuổi lao động.",
      },
      {
        th: "แนะนำให้ออกกำลังกายอย่างน้อยสัปดาห์ละหนึ่งร้อยห้าสิบนาที",
        rtgs: "nae nam hai ɔk kamlang kai yang nɔi sapda la nueng rɔi ha sip nathi",
        en: "It recommends exercising at least 150 minutes per week.",
        vi: "Khuyến nghị tập thể dục ít nhất 150 phút mỗi tuần.",
      },
    ],
    key_vocab: [
      { th: "สาธารณสุข", en: "public health", vi: "y tế công cộng" },
      { th: "วัยทำงาน", en: "working age", vi: "độ tuổi lao động" },
      { th: "ออกกำลังกาย", en: "to exercise", vi: "tập thể dục" },
    ],
    questions: [
      {
        q_en: "Who is the campaign aimed at?",
        q_vi: "Chiến dịch nhắm tới ai?",
        answer_en: "Working-age people.",
        answer_vi: "Người trong độ tuổi lao động.",
      },
      {
        q_en: "How much weekly exercise is recommended?",
        q_vi: "Khuyến nghị tập bao nhiêu mỗi tuần?",
        answer_en: "At least 150 minutes per week.",
        answer_vi: "Ít nhất 150 phút mỗi tuần.",
      },
    ],
  },
  {
    id: "th-listen-c1-05-interview-startup",
    level: "C1",
    topic: "interview",
    title_en: "Interview: a founder's biggest mistake",
    title_vi: "Phỏng vấn: sai lầm lớn nhất của nhà sáng lập",
    goal_en: "Catch the mistake described and the lesson drawn.",
    goal_vi: "Nghe ra sai lầm được kể và bài học rút ra.",
    script: [
      {
        speaker: "Host",
        th: "อะไรคือบทเรียนที่แพงที่สุดในการทำธุรกิจของคุณครับ",
        en: "What was the most expensive lesson in running your business?",
        vi: "Bài học đắt giá nhất khi làm kinh doanh của bạn là gì?",
      },
      {
        speaker: "Founder",
        th: "เราขยายทีมเร็วเกินไปก่อนที่รายได้จะมั่นคง สุดท้ายต้องปลดพนักงานจำนวนมาก",
        en: "We scaled the team too fast before revenue was stable, and ended up laying off many staff.",
        vi: "Chúng tôi mở rộng đội ngũ quá nhanh trước khi doanh thu ổn định, cuối cùng phải sa thải nhiều người.",
      },
      {
        speaker: "Founder",
        th: "บทเรียนคือจงโตตามกระแสเงินสดจริง ไม่ใช่ตามความคาดหวัง",
        en: "The lesson is to grow according to real cash flow, not expectations.",
        vi: "Bài học là hãy phát triển theo dòng tiền thực, không theo kỳ vọng.",
      },
    ],
    key_vocab: [
      { th: "ขยายทีม", en: "to scale/expand the team", vi: "mở rộng đội ngũ" },
      { th: "ปลดพนักงาน", en: "to lay off staff", vi: "sa thải nhân viên" },
      { th: "กระแสเงินสด", en: "cash flow", vi: "dòng tiền" },
    ],
    questions: [
      {
        q_en: "What mistake did the founder make?",
        q_vi: "Nhà sáng lập đã mắc sai lầm gì?",
        answer_en: "Scaling the team too fast before revenue was stable.",
        answer_vi: "Mở rộng đội ngũ quá nhanh trước khi doanh thu ổn định.",
      },
      {
        q_en: "What lesson did they draw?",
        q_vi: "Họ rút ra bài học gì?",
        answer_en: "Grow according to real cash flow, not expectations.",
        answer_vi: "Phát triển theo dòng tiền thực, không theo kỳ vọng.",
      },
    ],
  },
];

export default thaiListeningScripts;
