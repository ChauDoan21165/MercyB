// src/languages/thai/collocations.ts
//
// Thai high-frequency collocation bank (A9, Wave 6) for Vietnamese- and
// English-speaking learners.
//
// A collocation = a natural word pairing (verb+noun, fixed phrase, idiom)
// that learners should store as one chunk. Each entry carries:
//   th       — the phrase in Thai script
//   rom      — plain romanization reading aid (no tone encoded)
//   vi       — natural Vietnamese meaning
//   en       — natural English meaning
//   literal  — (optional) word-by-word gloss, shown where it helps decode
//              an idiom (e.g. ทำใจ literally "do heart")
//   topic    — grouping (make/do, take/give, …)
//   level    — rough CEFR-ish band
//
// Scope guardrails:
//   • No audio, no TTS, no mic, no Azure, no pronunciation scoring.
//   • Romanization is a reading/search aid only; tone is not encoded.
//   • Companion data: ./vocabulary.ts, ./topicVocabulary.ts.
//   • Native review is DEFERRED.

export type ThaiCollocationLevel = "A1" | "A2" | "B1" | "B2";

export type ThaiCollocationTopic =
  | "make-do"
  | "take-give"
  | "have-be"
  | "feelings"
  | "work"
  | "food"
  | "travel"
  | "health"
  | "study"
  | "money";

export type ThaiCollocation = {
  th: string;
  rom: string;
  vi: string;
  en: string;
  literal?: string;
  topic: ThaiCollocationTopic;
  level: ThaiCollocationLevel;
};

// Compact constructor (literal optional, last).
const c = (
  th: string,
  rom: string,
  vi: string,
  en: string,
  topic: ThaiCollocationTopic,
  level: ThaiCollocationLevel,
  literal?: string,
): ThaiCollocation => (literal ? { th, rom, vi, en, literal, topic, level } : { th, rom, vi, en, topic, level });

export const THAI_COLLOCATIONS: ReadonlyArray<ThaiCollocation> = [
  // ── make / do (ทำ) ────────────────────────────────────────────────────
  c("ทำอาหาร", "tham ahan", "nấu ăn", "to cook", "make-do", "A1", "do + food"),
  c("ทำงาน", "tham ngan", "làm việc", "to work", "make-do", "A1", "do + work"),
  c("ทำการบ้าน", "tham kan ban", "làm bài tập về nhà", "to do homework", "make-do", "A1"),
  c("ทำความสะอาด", "tham khwam saat", "dọn dẹp", "to clean", "make-do", "A2"),
  c("ทำผิด", "tham phit", "làm sai / phạm lỗi", "to make a mistake", "make-do", "A2"),
  c("ทำถูก", "tham thuk", "làm đúng", "to do (it) right", "make-do", "A2"),
  c("ทำดี", "tham di", "làm việc tốt", "to do good", "make-do", "A2"),
  c("ทำบุญ", "tham bun", "làm phước / công đức", "to make merit", "make-do", "A2", "do + merit"),
  c("ทำใจ", "tham chai", "chấp nhận / buông bỏ", "to come to terms with", "make-do", "B1", "do + heart"),
  c("ทำเป็น", "tham pen", "giả vờ / biết làm", "to pretend / know how to", "make-do", "B1", "do + be"),
  c("ทำตาม", "tham tam", "làm theo", "to follow / comply", "make-do", "A2"),
  c("ทำธุรกิจ", "tham thurakit", "kinh doanh", "to do business", "make-do", "B1"),
  c("ทำกับข้าว", "tham kap khao", "nấu cơm / làm món ăn", "to cook a meal", "make-do", "A2"),
  c("ทำขนม", "tham khanom", "làm bánh", "to make sweets", "make-do", "A2"),
  c("ทำเล็บ", "tham lep", "làm móng", "to do one's nails", "make-do", "A2"),
  c("ทำผม", "tham phom", "làm tóc", "to do one's hair", "make-do", "A2"),
  c("ทำสวน", "tham suan", "làm vườn", "to garden", "make-do", "A2"),
  c("ทำนา", "tham na", "làm ruộng", "to farm rice", "make-do", "A2"),
  c("ทำร้าย", "tham rai", "làm hại / đánh", "to harm", "make-do", "B1"),
  c("ทำหาย", "tham hai", "làm mất", "to lose (something)", "make-do", "A2"),
  c("ทำพัง", "tham phang", "làm hỏng", "to break (something)", "make-do", "A2"),
  c("ทำเสร็จ", "tham set", "làm xong", "to finish", "make-do", "A2"),
  c("ทำต่อ", "tham to", "làm tiếp", "to continue doing", "make-do", "A2"),
  c("ทำซ้ำ", "tham sam", "làm lại / lặp lại", "to redo", "make-do", "B1"),
  c("ทำโทษ", "tham thot", "phạt", "to punish", "make-do", "B1"),
  c("ทำหน้าที่", "tham nathi", "làm nhiệm vụ", "to do one's duty", "make-do", "B1"),

  // ── take / give (เอา / ให้) ───────────────────────────────────────────
  c("เอาไป", "ao pai", "mang đi / lấy đi", "to take away", "take-give", "A1", "take + go"),
  c("เอามา", "ao ma", "mang đến / lấy lại", "to bring", "take-give", "A1", "take + come"),
  c("เอาออก", "ao ok", "lấy ra / bỏ ra", "to take out / remove", "take-give", "A2"),
  c("เอาคืน", "ao khuen", "lấy lại", "to take back", "take-give", "A2"),
  c("เอาไว้", "ao wai", "giữ lại / để dành", "to keep", "take-give", "A2"),
  c("เอาด้วย", "ao duai", "lấy luôn / tham gia", "to take too / join in", "take-give", "A2"),
  c("ให้เงิน", "hai ngoen", "cho tiền", "to give money", "take-give", "A1", "give + money"),
  c("ให้ของขวัญ", "hai khong khwan", "tặng quà", "to give a gift", "take-give", "A2"),
  c("ให้ยืม", "hai yuem", "cho mượn", "to lend", "take-give", "A2", "give + borrow"),
  c("ให้พร", "hai phon", "chúc phúc", "to give a blessing", "take-give", "B1"),
  c("ให้อภัย", "hai aphai", "tha thứ", "to forgive", "take-give", "B1"),
  c("ให้กำลังใจ", "hai kamlang chai", "động viên", "to encourage", "take-give", "B1", "give + heart-strength"),
  c("ให้คำแนะนำ", "hai kham naenam", "cho lời khuyên", "to give advice", "take-give", "B1"),
  c("ให้โอกาส", "hai okat", "cho cơ hội", "to give a chance", "take-give", "A2"),
  c("ให้เกียรติ", "hai kiat", "tôn trọng", "to show respect", "take-give", "B1", "give + honor"),
  c("ส่งให้", "song hai", "đưa cho / gửi cho", "to hand / send to", "take-give", "A2"),
  c("แบ่งให้", "baeng hai", "chia cho", "to share with", "take-give", "A2"),
  c("ขอยืม", "kho yuem", "mượn", "to borrow", "take-give", "A1"),
  c("รับของ", "rap khong", "nhận đồ", "to receive things", "take-give", "A1"),
  c("รับเงิน", "rap ngoen", "nhận tiền", "to receive money", "take-give", "A1"),
  c("หยิบ", "yip", "cầm / nhặt lên", "to pick up", "take-give", "A1"),
  c("ส่งมอบ", "song mop", "bàn giao", "to hand over", "take-give", "B1"),
  c("มอบให้", "mop hai", "trao cho", "to award / present to", "take-give", "B1"),
  c("แจกของ", "chaek khong", "phát đồ", "to distribute things", "take-give", "A2"),
  c("รับฝาก", "rap fak", "nhận giữ giùm", "to keep for someone", "take-give", "B1"),
  c("เอาเปรียบ", "ao priap", "lợi dụng / chèn ép", "to take advantage of", "take-give", "B1", "take + advantage"),

  // ── have / be (มี / เป็น / อยู่) ──────────────────────────────────────
  c("มีเงิน", "mi ngoen", "có tiền", "to have money", "have-be", "A1"),
  c("มีเวลา", "mi wela", "có thời gian", "to have time", "have-be", "A1"),
  c("มีความสุข", "mi khwam suk", "hạnh phúc", "to be happy", "have-be", "A2", "have + happiness"),
  c("มีปัญหา", "mi panha", "có vấn đề", "to have a problem", "have-be", "A2"),
  c("มีแฟน", "mi faen", "có người yêu", "to have a partner", "have-be", "A1"),
  c("มีลูก", "mi luk", "có con", "to have children", "have-be", "A1"),
  c("มีชื่อเสียง", "mi chue siang", "nổi tiếng", "to be famous", "have-be", "B1", "have + name-sound"),
  c("มีน้ำใจ", "mi nam chai", "tốt bụng / hào phóng", "to be kind-hearted", "have-be", "B1", "have + water-heart"),
  c("มีเหตุผล", "mi het phon", "có lý / hợp lý", "to be reasonable", "have-be", "B1"),
  c("มีประโยชน์", "mi prayot", "có ích", "to be useful", "have-be", "A2"),
  c("เป็นไข้", "pen khai", "bị sốt", "to be feverish", "have-be", "A2", "be + fever"),
  c("เป็นหวัด", "pen wat", "bị cảm", "to have a cold", "have-be", "A2", "be + cold (illness)"),
  c("เป็นห่วง", "pen huang", "lo lắng (cho ai)", "to be worried about", "have-be", "A2", "be + concern"),
  c("เป็นเพื่อน", "pen phuean", "làm bạn", "to be friends", "have-be", "A1"),
  c("เป็นไปได้", "pen pai dai", "có thể", "to be possible", "have-be", "A2"),
  c("เป็นไปไม่ได้", "pen pai mai dai", "không thể", "to be impossible", "have-be", "A2"),
  c("เป็นความจริง", "pen khwam ching", "là sự thật", "to be true", "have-be", "B1"),
  c("เป็นระเบียบ", "pen rabiap", "ngăn nắp", "to be orderly", "have-be", "B1"),
  c("อยู่บ้าน", "yu ban", "ở nhà", "to be / stay at home", "have-be", "A1"),
  c("อยู่คนเดียว", "yu khon diao", "ở một mình", "to be alone", "have-be", "A2"),
  c("อยู่ด้วยกัน", "yu duai kan", "ở cùng nhau", "to be together", "have-be", "A2"),
  c("อยู่เฉยๆ", "yu choei choei", "ngồi yên / không làm gì", "to stay still / idle", "have-be", "A2"),
  c("ยังอยู่", "yang yu", "vẫn còn", "to still be around", "have-be", "A2"),
  c("ไม่มีอะไร", "mai mi arai", "không có gì", "to have nothing / never mind", "have-be", "A1"),
  c("มีแรง", "mi raeng", "có sức", "to have energy", "have-be", "A2"),
  c("เป็นโรค", "pen rok", "mắc bệnh", "to have a disease", "have-be", "B1"),

  // ── feelings (ใจ / รู้สึก) ────────────────────────────────────────────
  c("ดีใจ", "di chai", "vui mừng", "to be glad", "feelings", "A1", "good + heart"),
  c("เสียใจ", "sia chai", "buồn", "to be sad", "feelings", "A1", "lose + heart"),
  c("ตั้งใจ", "tang chai", "chú tâm / quyết tâm", "to be attentive / intend", "feelings", "A2", "set + heart"),
  c("ตกใจ", "tok chai", "giật mình", "to be startled", "feelings", "A2", "fall + heart"),
  c("สนใจ", "son chai", "quan tâm / thích thú", "to be interested", "feelings", "A2", "thread + heart"),
  c("พอใจ", "pho chai", "hài lòng", "to be satisfied", "feelings", "A2", "enough + heart"),
  c("ภูมิใจ", "phum chai", "tự hào", "to be proud", "feelings", "B1"),
  c("เสียดาย", "sia dai", "tiếc", "to feel regret", "feelings", "A2", "lose + pity"),
  c("น้อยใจ", "noi chai", "tủi thân", "to feel slighted", "feelings", "B1", "little + heart"),
  c("เกรงใจ", "kreng chai", "ngại làm phiền", "to feel considerate / reluctant", "feelings", "B1", "fear + heart"),
  c("ใจร้อน", "chai ron", "nóng tính", "to be impatient", "feelings", "A2", "heart + hot"),
  c("ใจเย็น", "chai yen", "bình tĩnh", "to be calm", "feelings", "A2", "heart + cool"),
  c("ใจดี", "chai di", "tốt bụng", "to be kind", "feelings", "A1", "heart + good"),
  c("หนักใจ", "nak chai", "nặng lòng / lo", "to feel troubled", "feelings", "B1", "heavy + heart"),
  c("สบายใจ", "sabai chai", "an tâm / thoải mái", "to feel at ease", "feelings", "A2", "comfortable + heart"),
  c("กลุ้มใจ", "klum chai", "phiền muộn", "to be distressed", "feelings", "B1"),
  c("ดีใจด้วย", "di chai duai", "chúc mừng", "congratulations", "feelings", "A2", "glad + with (you)"),
  c("เสียใจด้วย", "sia chai duai", "chia buồn", "(my) condolences", "feelings", "A2", "sad + with (you)"),
  c("รู้สึกดี", "rusuek di", "cảm thấy ổn", "to feel good", "feelings", "A2"),
  c("รู้สึกผิด", "rusuek phit", "cảm thấy có lỗi", "to feel guilty", "feelings", "B1"),
  c("อกหัก", "ok hak", "thất tình", "to be heartbroken", "feelings", "B1", "chest + broken"),
  c("หัวเสีย", "hua sia", "bực mình", "to be annoyed", "feelings", "B1", "head + spoiled"),
  c("ปวดใจ", "puat chai", "đau lòng", "to be heartsick", "feelings", "B1", "ache + heart"),
  c("ดีใจมาก", "di chai mak", "rất vui", "to be very happy", "feelings", "A1"),
  c("เบื่อหน่าย", "buea nai", "chán nản", "to be fed up", "feelings", "B1"),
  c("ใจหาย", "chai hai", "hụt hẫng / thót tim", "to be startled / dismayed", "feelings", "B1", "heart + lost"),

  // ── work ──────────────────────────────────────────────────────────────
  c("หางาน", "ha ngan", "tìm việc", "to look for a job", "work", "A2"),
  c("สมัครงาน", "samak ngan", "nộp đơn xin việc", "to apply for a job", "work", "B1"),
  c("เข้าทำงาน", "khao tham ngan", "vào làm", "to start a job", "work", "A2"),
  c("ลาออก", "la ok", "nghỉ việc", "to resign", "work", "B1"),
  c("ลาป่วย", "la puai", "nghỉ ốm", "to take sick leave", "work", "A2"),
  c("ลาพักร้อน", "la phak ron", "nghỉ phép năm", "to take annual leave", "work", "B1"),
  c("เข้าประชุม", "khao prachum", "dự họp", "to attend a meeting", "work", "A2"),
  c("ทำโอที", "tham oti", "làm tăng ca", "to do overtime", "work", "A2"),
  c("ส่งงาน", "song ngan", "nộp bài / giao việc", "to submit work", "work", "A2"),
  c("รับงาน", "rap ngan", "nhận việc", "to take on work", "work", "A2"),
  c("ตอกบัตร", "tok bat", "chấm công", "to clock in", "work", "B1", "punch + card"),
  c("ขึ้นเงินเดือน", "khuen ngoen duean", "tăng lương", "to get a raise", "work", "B1", "rise + monthly-salary"),
  c("เลื่อนตำแหน่ง", "luean tamnaeng", "thăng chức", "to get promoted", "work", "B1"),
  c("ทำตามกำหนด", "tham tam kamnot", "làm đúng hạn", "to meet a deadline", "work", "B1"),
  c("เซ็นสัญญา", "sen sanya", "ký hợp đồng", "to sign a contract", "work", "B1"),
  c("ติดต่องาน", "titto ngan", "liên hệ công việc", "to make work contact", "work", "B1"),
  c("นัดประชุม", "nat prachum", "hẹn họp", "to schedule a meeting", "work", "A2"),
  c("รับโทรศัพท์", "rap thorasap", "nghe điện thoại", "to answer the phone", "work", "A1"),
  c("ส่งอีเมล", "song imel", "gửi email", "to send an email", "work", "A2"),
  c("เข้ากะ", "khao ka", "vào ca", "to start a shift", "work", "A2"),
  c("ออกกะ", "ok ka", "tan ca", "to end a shift", "work", "A2"),
  c("ทำงานเป็นทีม", "tham ngan pen thim", "làm việc nhóm", "to work as a team", "work", "A2"),
  c("แก้ปัญหา", "kae panha", "giải quyết vấn đề", "to solve a problem", "work", "A2"),
  c("วางแผน", "wang phaen", "lập kế hoạch", "to make a plan", "work", "A2"),
  c("ตัดสินใจ", "tat sin chai", "quyết định", "to make a decision", "work", "A2", "cut-judge + heart"),
  c("รายงาน", "raingan", "báo cáo", "to report", "work", "A2"),

  // ── food ────────────────────────────────────────────────────────────
  c("สั่งอาหาร", "sang ahan", "gọi món", "to order food", "food", "A1"),
  c("กินข้าว", "kin khao", "ăn cơm", "to eat (a meal)", "food", "A1", "eat + rice"),
  c("ชิมอาหาร", "chim ahan", "nếm thử", "to taste food", "food", "A2"),
  c("อิ่มแล้ว", "im laeo", "no rồi", "to be full already", "food", "A1"),
  c("หิวข้าว", "hiu khao", "đói bụng", "to be hungry", "food", "A1", "hungry + rice"),
  c("จองโต๊ะ", "chong to", "đặt bàn", "to book a table", "food", "A2"),
  c("เก็บโต๊ะ", "kep to", "dọn bàn", "to clear the table", "food", "A2"),
  c("จ่ายค่าอาหาร", "chai kha ahan", "trả tiền ăn", "to pay for the meal", "food", "A2"),
  c("แบ่งกันกิน", "baeng kan kin", "chia nhau ăn", "to share food", "food", "A2"),
  c("สั่งกลับบ้าน", "sang klap ban", "mua mang về", "to order takeaway", "food", "A2", "order + return home"),
  c("เผ็ดมาก", "phet mak", "rất cay", "to be very spicy", "food", "A1"),
  c("อร่อยมาก", "aroi mak", "rất ngon", "to be very delicious", "food", "A1"),
  c("ใส่พริก", "sai phrik", "thêm ớt", "to add chili", "food", "A1"),
  c("ไม่ใส่ผงชูรส", "mai sai phong chu rot", "không bột ngọt", "no MSG", "food", "B1"),
  c("ดื่มน้ำ", "duem nam", "uống nước", "to drink water", "food", "A1"),
  c("ชงกาแฟ", "chong kafae", "pha cà phê", "to make coffee", "food", "A2"),
  c("ปอกผลไม้", "pok phonlamai", "gọt trái cây", "to peel fruit", "food", "A2"),
  c("หั่นผัก", "han phak", "cắt rau", "to chop vegetables", "food", "A2"),
  c("ต้มน้ำ", "tom nam", "đun nước", "to boil water", "food", "A1"),
  c("ทอดไข่", "thot khai", "chiên trứng", "to fry an egg", "food", "A1"),
  c("ย่างเนื้อ", "yang nuea", "nướng thịt", "to grill meat", "food", "A2"),
  c("นึ่งปลา", "nueng pla", "hấp cá", "to steam fish", "food", "A2"),
  c("เติมข้าว", "toem khao", "thêm cơm", "to refill rice", "food", "A2"),
  c("ลดหวาน", "lot wan", "giảm ngọt", "to reduce sweetness", "food", "A2"),
  c("ฝากท้อง", "fak thong", "ăn nhờ / ăn quán quen", "to rely on for meals", "food", "B1", "entrust + stomach"),
  c("กินเจ", "kin che", "ăn chay", "to eat vegetarian", "food", "A2", "eat + 'jè' (vegetarian)"),

  // ── travel ──────────────────────────────────────────────────────────
  c("จองตั๋ว", "chong tua", "đặt vé", "to book a ticket", "travel", "A1"),
  c("จองโรงแรม", "chong rongraem", "đặt khách sạn", "to book a hotel", "travel", "A2"),
  c("เก็บกระเป๋า", "kep krapao", "soạn hành lý", "to pack a bag", "travel", "A2"),
  c("ขึ้นรถ", "khuen rot", "lên xe", "to get on a vehicle", "travel", "A1"),
  c("ลงรถ", "long rot", "xuống xe", "to get off", "travel", "A1"),
  c("ขึ้นเครื่อง", "khuen khrueang", "lên máy bay", "to board a plane", "travel", "A2"),
  c("ต่อเครื่อง", "to khrueang", "nối chuyến", "to transfer flights", "travel", "B1"),
  c("เช็คอินสนามบิน", "chek in sanambin", "làm thủ tục sân bay", "to check in at the airport", "travel", "A2"),
  c("ผ่านด่าน", "phan dan", "qua cửa khẩu", "to pass through a checkpoint", "travel", "B1"),
  c("แลกเงิน", "laek ngoen", "đổi tiền", "to exchange money", "travel", "A2"),
  c("เที่ยว", "thiao", "đi chơi / du lịch", "to travel / sightsee", "travel", "A1"),
  c("เดินทาง", "doenthang", "đi / lên đường", "to travel / journey", "travel", "A1"),
  c("หลงทาง", "long thang", "lạc đường", "to get lost", "travel", "A2", "lost + way"),
  c("ถามทาง", "tham thang", "hỏi đường", "to ask for directions", "travel", "A1", "ask + way"),
  c("ดูแผนที่", "du phaen thi", "xem bản đồ", "to look at a map", "travel", "A1"),
  c("จองทัวร์", "chong thua", "đặt tour", "to book a tour", "travel", "A2"),
  c("เช่ารถ", "chao rot", "thuê xe", "to rent a car", "travel", "A2"),
  c("ขับรถเที่ยว", "khap rot thiao", "lái xe đi chơi", "to go on a road trip", "travel", "A2"),
  c("พักโรงแรม", "phak rongraem", "ở khách sạn", "to stay at a hotel", "travel", "A2"),
  c("ถ่ายรูป", "thai rup", "chụp ảnh", "to take photos", "travel", "A1"),
  c("ซื้อของฝาก", "sue khong fak", "mua quà", "to buy souvenirs", "travel", "A2"),
  c("ทำพาสปอร์ต", "tham phatsapot", "làm hộ chiếu", "to get a passport", "travel", "A2"),
  c("ขอวีซ่า", "kho wisa", "xin visa", "to apply for a visa", "travel", "A2"),
  c("เลทไฟลต์", "let flai", "trễ chuyến bay", "to have a delayed flight", "travel", "B1"),
  c("จองที่นั่ง", "chong thi nang", "đặt chỗ", "to reserve a seat", "travel", "A2"),
  c("เที่ยวต่างประเทศ", "thiao tang prathet", "du lịch nước ngoài", "to travel abroad", "travel", "A2"),

  // ── health ──────────────────────────────────────────────────────────
  c("ไปหาหมอ", "pai ha mo", "đi khám bác sĩ", "to see a doctor", "health", "A1", "go + find + doctor"),
  c("กินยา", "kin ya", "uống thuốc", "to take medicine", "health", "A1", "eat + medicine"),
  c("นอนพัก", "non phak", "nằm nghỉ", "to rest in bed", "health", "A1"),
  c("ออกกำลังกาย", "ok kamlang kai", "tập thể dục", "to exercise", "health", "A2"),
  c("ตรวจสุขภาพ", "truat sukkhaphap", "khám sức khỏe", "to get a check-up", "health", "B1"),
  c("ติดเชื้อ", "tit chuea", "nhiễm trùng / lây bệnh", "to get infected", "health", "B1"),
  c("ฉีดวัคซีน", "chit waksin", "tiêm vắc xin", "to get vaccinated", "health", "A2"),
  c("วัดไข้", "wat khai", "đo nhiệt độ", "to take one's temperature", "health", "A2", "measure + fever"),
  c("วัดความดัน", "wat khwam dan", "đo huyết áp", "to measure blood pressure", "health", "B1"),
  c("ปวดเมื่อย", "puat mueai", "nhức mỏi", "to feel achy", "health", "A2"),
  c("เป็นลม", "pen lom", "ngất xỉu", "to faint", "health", "A2", "be + wind"),
  c("หายป่วย", "hai puai", "khỏi bệnh", "to recover", "health", "A2"),
  c("พักฟื้น", "phak fuen", "dưỡng bệnh", "to convalesce", "health", "B1"),
  c("รักษาตัว", "raksa tua", "chữa trị / giữ sức", "to take care of oneself", "health", "B1", "treat + body"),
  c("นัดหมอ", "nat mo", "hẹn bác sĩ", "to make a doctor's appointment", "health", "A2"),
  c("เข้าโรงพยาบาล", "khao rongphayaban", "nhập viện", "to be hospitalized", "health", "A2"),
  c("ผ่าตัด", "pha tat", "phẫu thuật", "to have surgery", "health", "B1"),
  c("เจาะเลือด", "cho lueat", "lấy máu", "to draw blood", "health", "B1"),
  c("แพ้ยา", "phae ya", "dị ứng thuốc", "to be allergic to medicine", "health", "B1"),
  c("ลดน้ำหนัก", "lot nam nak", "giảm cân", "to lose weight", "health", "A2"),
  c("ดูแลสุขภาพ", "dulae sukkhaphap", "chăm sóc sức khỏe", "to look after one's health", "health", "A2"),
  c("นอนหลับ", "non lap", "ngủ", "to sleep", "health", "A1"),
  c("นอนไม่หลับ", "non mai lap", "mất ngủ", "to be unable to sleep", "health", "A2"),
  c("ดื่มน้ำเยอะๆ", "duem nam yoe yoe", "uống nhiều nước", "to drink lots of water", "health", "A2"),
  c("ล้างมือ", "lang mue", "rửa tay", "to wash one's hands", "health", "A1"),
  c("ใส่หน้ากาก", "sai na kak", "đeo khẩu trang", "to wear a mask", "health", "A2"),

  // ── study ───────────────────────────────────────────────────────────
  c("เรียนหนังสือ", "rian nangsue", "học hành", "to study", "study", "A1", "study + book"),
  c("อ่านหนังสือ", "an nangsue", "đọc sách / ôn bài", "to read / revise", "study", "A1"),
  c("เข้าเรียน", "khao rian", "vào học / đến lớp", "to attend class", "study", "A1"),
  c("ขาดเรียน", "khat rian", "nghỉ học", "to miss class", "study", "A2"),
  c("จดโน้ต", "chot not", "ghi chú", "to take notes", "study", "A2"),
  c("ตั้งใจเรียน", "tang chai rian", "chăm học", "to study attentively", "study", "A2"),
  c("สอบผ่าน", "sop phan", "thi đậu", "to pass an exam", "study", "A2"),
  c("สอบตก", "sop tok", "thi rớt", "to fail an exam", "study", "A2"),
  c("ติวหนังสือ", "tio nangsue", "học thêm / ôn luyện", "to cram / tutor", "study", "B1"),
  c("ทบทวน", "thopthuan", "ôn tập", "to review", "study", "A2"),
  c("จำได้", "cham dai", "nhớ được", "to remember", "study", "A1"),
  c("ลืม", "luem", "quên", "to forget", "study", "A1"),
  c("ถามคำถาม", "tham kham tham", "đặt câu hỏi", "to ask a question", "study", "A1"),
  c("ตอบคำถาม", "top kham tham", "trả lời câu hỏi", "to answer a question", "study", "A1"),
  c("ทำแบบฝึกหัด", "tham baep fuk hat", "làm bài tập", "to do exercises", "study", "A2"),
  c("เรียนพิเศษ", "rian phiset", "học thêm", "to take extra classes", "study", "A2"),
  c("สมัครเรียน", "samak rian", "đăng ký học", "to enroll", "study", "A2"),
  c("จบการศึกษา", "chop kan sueksa", "tốt nghiệp", "to graduate", "study", "B1"),
  c("ได้เกรด", "dai kret", "đạt điểm", "to get a grade", "study", "A2"),
  c("ฝึกพูด", "fuk phut", "luyện nói", "to practice speaking", "study", "A2"),
  c("ฝึกเขียน", "fuk khian", "luyện viết", "to practice writing", "study", "A2"),
  c("ท่องศัพท์", "thong sap", "học từ vựng", "to memorize vocabulary", "study", "A2"),
  c("เข้าใจบทเรียน", "khao chai bot rian", "hiểu bài", "to understand the lesson", "study", "A2"),
  c("ตั้งใจฟัง", "tang chai fang", "chú ý nghe", "to listen attentively", "study", "A2"),
  c("ส่งการบ้าน", "song kan ban", "nộp bài tập", "to submit homework", "study", "A1"),
  c("เรียนออนไลน์", "rian onlai", "học trực tuyến", "to study online", "study", "A2"),

  // ── money ───────────────────────────────────────────────────────────
  c("หาเงิน", "ha ngoen", "kiếm tiền", "to earn money", "money", "A1", "find + money"),
  c("เก็บเงิน", "kep ngoen", "tiết kiệm tiền", "to save up", "money", "A1", "collect + money"),
  c("ใช้เงิน", "chai ngoen", "tiêu tiền", "to spend money", "money", "A1"),
  c("จ่ายเงิน", "chai ngoen", "trả tiền", "to pay", "money", "A1"),
  c("ยืมเงิน", "yuem ngoen", "mượn tiền", "to borrow money", "money", "A1"),
  c("คืนเงิน", "khuen ngoen", "trả lại / hoàn tiền", "to refund", "money", "A2"),
  c("ฝากเงิน", "fak ngoen", "gửi tiền", "to deposit money", "money", "A2", "entrust + money"),
  c("ถอนเงิน", "thon ngoen", "rút tiền", "to withdraw money", "money", "A2"),
  c("โอนเงิน", "on ngoen", "chuyển tiền", "to transfer money", "money", "A2"),
  c("เป็นหนี้", "pen ni", "mắc nợ", "to be in debt", "money", "B1", "be + debt"),
  c("ใช้หนี้", "chai ni", "trả nợ", "to pay off debt", "money", "B1"),
  c("ลงทุน", "long thun", "đầu tư", "to invest", "money", "B1", "put-down + capital"),
  c("ขาดเงิน", "khat ngoen", "thiếu tiền", "to be short of money", "money", "A2"),
  c("ประหยัดเงิน", "prayat ngoen", "tiết kiệm", "to economize", "money", "A2"),
  c("เสียเงิน", "sia ngoen", "tốn tiền", "to spend / waste money", "money", "A1", "lose + money"),
  c("ได้เงิน", "dai ngoen", "được / kiếm được tiền", "to get money", "money", "A1"),
  c("เสียค่าปรับ", "sia kha prap", "bị phạt tiền", "to pay a fine", "money", "B1"),
  c("จ่ายบิล", "chai bin", "thanh toán hóa đơn", "to pay a bill", "money", "A2"),
  c("ผ่อนชำระ", "phon chamra", "trả góp", "to pay in instalments", "money", "B1"),
  c("ต่อราคา", "to rakha", "mặc cả", "to bargain", "money", "A2", "extend + price"),
  c("คิดเงิน", "khit ngoen", "tính tiền", "to total the bill", "money", "A2"),
  c("ทอนเงิน", "thon ngoen", "thối tiền", "to give change", "money", "A2"),
  c("เปิดบัญชี", "poet banchi", "mở tài khoản", "to open an account", "money", "A2"),
  c("ตั้งงบ", "tang ngop", "lập ngân sách", "to set a budget", "money", "B1"),
  c("หักเงิน", "hak ngoen", "trừ tiền", "to deduct money", "money", "B1"),
  c("เก็บค่าเช่า", "kep kha chao", "thu tiền thuê", "to collect rent", "money", "B1"),
  c("รูดบัตร", "rut bat", "quẹt thẻ", "to swipe a card", "money", "A2", "swipe + card"),
];

export default THAI_COLLOCATIONS;
