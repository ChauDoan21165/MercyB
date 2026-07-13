// src/languages/thai/vocabulary.ts
//
// Curated core Thai vocabulary (~190 entries) for Vietnamese- and
// English-speaking learners.
//
// Each entry carries:
//   th       — Thai script (the word as actually written)
//   rom      — loose RTGS-style romanization (reading aid, NOT phonemic)
//   vi       — Vietnamese gloss
//   en       — English gloss
//   category — topic group (greetings, numbers, food, …)
//   level    — rough CEFR-ish band (A1 = most basic … B1 = useful extras)
//
// Scope guardrails (A9, Wave 1):
//   • No audio, no TTS, no pronunciation scoring, no phoneme engine.
//   • Romanization is a written reading aid only. Thai tone is NOT encoded
//     in `rom`; see ./toneBasics.ts for how tone actually works.
//   • Native review is DEFERRED — these glosses are AI-curated from common
//     reference vocabulary and have not been checked by a native speaker.

export type ThaiLevel = "A1" | "A2" | "B1";

export type ThaiVocabCategory =
  | "greetings"
  | "pronouns"
  | "numbers"
  | "time"
  | "family"
  | "food"
  | "verbs"
  | "adjectives"
  | "questions"
  | "places"
  | "colors"
  | "body"
  | "money"
  | "function";

export type ThaiVocabEntry = {
  cell_id?: string;
  th: string;
  rom: string;
  vi: string;
  en: string;
  category: ThaiVocabCategory;
  level: ThaiLevel;
};

export const THAI_VOCABULARY: ReadonlyArray<ThaiVocabEntry> = [
  // ── Greetings & politeness ────────────────────────────────────────────
  { th: "สวัสดี", rom: "sawatdi", vi: "xin chào", en: "hello", category: "greetings", level: "A1" },
  { th: "ครับ", rom: "khrap", vi: "(tiểu từ lịch sự, nam dùng)", en: "polite particle (male speaker)", category: "greetings", level: "A1" },
  { th: "ค่ะ", rom: "kha", vi: "(tiểu từ lịch sự, nữ dùng)", en: "polite particle (female speaker)", category: "greetings", level: "A1" },
  { th: "ขอบคุณ", rom: "khopkhun", vi: "cảm ơn", en: "thank you", category: "greetings", level: "A1" },
  { th: "ขอโทษ", rom: "khothot", vi: "xin lỗi / cho hỏi", en: "sorry / excuse me", category: "greetings", level: "A1" },
  { th: "ไม่เป็นไร", rom: "mai pen rai", vi: "không sao / không có gì", en: "no problem / you're welcome", category: "greetings", level: "A1" },
  { th: "ลาก่อน", rom: "la kon", vi: "tạm biệt", en: "goodbye", category: "greetings", level: "A1" },
  { th: "ยินดี", rom: "yindi", vi: "vui / hân hạnh", en: "glad / pleased", category: "greetings", level: "A2" },
  { th: "สบายดีไหม", rom: "sabai di mai", vi: "khỏe không?", en: "how are you?", category: "greetings", level: "A1" },
  { th: "สบายดี", rom: "sabai di", vi: "khỏe", en: "I'm fine", category: "greetings", level: "A1" },

  // ── Pronouns & demonstratives ─────────────────────────────────────────
  { th: "ผม", rom: "phom", vi: "tôi (nam nói)", en: "I (male speaker)", category: "pronouns", level: "A1" },
  { th: "ฉัน", rom: "chan", vi: "tôi (nữ / thân mật)", en: "I (female / informal)", category: "pronouns", level: "A1" },
  { th: "คุณ", rom: "khun", vi: "bạn / ông / bà (lịch sự)", en: "you (polite)", category: "pronouns", level: "A1" },
  { th: "เขา", rom: "khao", vi: "anh ấy / cô ấy", en: "he / she", category: "pronouns", level: "A1" },
  { th: "เรา", rom: "rao", vi: "chúng ta / tôi", en: "we / I (casual)", category: "pronouns", level: "A1" },
  { th: "พวกเขา", rom: "phuak khao", vi: "họ", en: "they", category: "pronouns", level: "A2" },
  { th: "มัน", rom: "man", vi: "nó", en: "it", category: "pronouns", level: "A2" },
  { th: "นี่", rom: "ni", vi: "này / cái này", en: "this", category: "pronouns", level: "A1" },
  { th: "นั่น", rom: "nan", vi: "đó / cái đó", en: "that", category: "pronouns", level: "A1" },

  // ── Numbers ───────────────────────────────────────────────────────────
  { th: "ศูนย์", rom: "sun", vi: "không (0)", en: "zero", category: "numbers", level: "A1" },
  { th: "หนึ่ง", rom: "nueng", vi: "một", en: "one", category: "numbers", level: "A1" },
  { th: "สอง", rom: "song", vi: "hai", en: "two", category: "numbers", level: "A1" },
  { th: "สาม", rom: "sam", vi: "ba", en: "three", category: "numbers", level: "A1" },
  { th: "สี่", rom: "si", vi: "bốn", en: "four", category: "numbers", level: "A1" },
  { th: "ห้า", rom: "ha", vi: "năm", en: "five", category: "numbers", level: "A1" },
  { th: "หก", rom: "hok", vi: "sáu", en: "six", category: "numbers", level: "A1" },
  { th: "เจ็ด", rom: "chet", vi: "bảy", en: "seven", category: "numbers", level: "A1" },
  { th: "แปด", rom: "paet", vi: "tám", en: "eight", category: "numbers", level: "A1" },
  { th: "เก้า", rom: "kao", vi: "chín", en: "nine", category: "numbers", level: "A1" },
  { th: "สิบ", rom: "sip", vi: "mười", en: "ten", category: "numbers", level: "A1" },
  { th: "สิบเอ็ด", rom: "sip et", vi: "mười một", en: "eleven", category: "numbers", level: "A2" },
  { th: "ยี่สิบ", rom: "yi sip", vi: "hai mươi", en: "twenty", category: "numbers", level: "A2" },
  { th: "ร้อย", rom: "roi", vi: "trăm", en: "hundred", category: "numbers", level: "A2" },
  { th: "พัน", rom: "phan", vi: "nghìn", en: "thousand", category: "numbers", level: "A2" },

  // ── Time, days & calendar ─────────────────────────────────────────────
  { th: "วัน", rom: "wan", vi: "ngày", en: "day", category: "time", level: "A1" },
  { th: "วันนี้", rom: "wan ni", vi: "hôm nay", en: "today", category: "time", level: "A1" },
  { th: "พรุ่งนี้", rom: "phrung ni", vi: "ngày mai", en: "tomorrow", category: "time", level: "A1" },
  { th: "เมื่อวาน", rom: "muea wan", vi: "hôm qua", en: "yesterday", category: "time", level: "A1" },
  { th: "เช้า", rom: "chao", vi: "buổi sáng", en: "morning", category: "time", level: "A1" },
  { th: "บ่าย", rom: "bai", vi: "buổi chiều", en: "afternoon", category: "time", level: "A1" },
  { th: "เย็น", rom: "yen", vi: "chiều tối", en: "evening", category: "time", level: "A1" },
  { th: "กลางคืน", rom: "klang khuen", vi: "ban đêm", en: "night", category: "time", level: "A2" },
  { th: "ชั่วโมง", rom: "chua mong", vi: "giờ (đồng hồ)", en: "hour", category: "time", level: "A2" },
  { th: "นาที", rom: "nathi", vi: "phút", en: "minute", category: "time", level: "A2" },
  { th: "สัปดาห์", rom: "sapda", vi: "tuần", en: "week", category: "time", level: "A2" },
  { th: "เดือน", rom: "duean", vi: "tháng", en: "month", category: "time", level: "A2" },
  { th: "ปี", rom: "pi", vi: "năm (12 tháng)", en: "year", category: "time", level: "A1" },
  { th: "วันจันทร์", rom: "wan chan", vi: "thứ Hai", en: "Monday", category: "time", level: "A2" },
  { th: "วันอังคาร", rom: "wan angkhan", vi: "thứ Ba", en: "Tuesday", category: "time", level: "A2" },
  { th: "วันพุธ", rom: "wan phut", vi: "thứ Tư", en: "Wednesday", category: "time", level: "A2" },
  { th: "วันพฤหัสบดี", rom: "wan pharuehat", vi: "thứ Năm", en: "Thursday", category: "time", level: "B1" },
  { th: "วันศุกร์", rom: "wan suk", vi: "thứ Sáu", en: "Friday", category: "time", level: "A2" },
  { th: "วันเสาร์", rom: "wan sao", vi: "thứ Bảy", en: "Saturday", category: "time", level: "A2" },
  { th: "วันอาทิตย์", rom: "wan athit", vi: "Chủ Nhật", en: "Sunday", category: "time", level: "A2" },

  // ── Family & people ───────────────────────────────────────────────────
  { th: "ครอบครัว", rom: "khropkhrua", vi: "gia đình", en: "family", category: "family", level: "A2" },
  { th: "พ่อ", rom: "pho", vi: "bố / ba", en: "father", category: "family", level: "A1" },
  { th: "แม่", rom: "mae", vi: "mẹ", en: "mother", category: "family", level: "A1" },
  { th: "ลูก", rom: "luk", vi: "con (cái)", en: "child", category: "family", level: "A1" },
  { th: "พี่", rom: "phi", vi: "anh / chị (lớn hơn)", en: "older sibling", category: "family", level: "A1" },
  { th: "น้อง", rom: "nong", vi: "em (nhỏ hơn)", en: "younger sibling", category: "family", level: "A1" },
  { th: "ลูกชาย", rom: "luk chai", vi: "con trai", en: "son", category: "family", level: "A2" },
  { th: "ลูกสาว", rom: "luk sao", vi: "con gái", en: "daughter", category: "family", level: "A2" },
  { th: "สามี", rom: "sami", vi: "chồng", en: "husband", category: "family", level: "A2" },
  { th: "ภรรยา", rom: "phanraya", vi: "vợ", en: "wife", category: "family", level: "A2" },
  { th: "เพื่อน", rom: "phuean", vi: "bạn (bè)", en: "friend", category: "family", level: "A1" },
  { th: "ปู่", rom: "pu", vi: "ông nội", en: "grandfather (paternal)", category: "family", level: "B1" },
  { th: "ย่า", rom: "ya", vi: "bà nội", en: "grandmother (paternal)", category: "family", level: "B1" },

  // ── Food & drink ──────────────────────────────────────────────────────
  { th: "อาหาร", rom: "ahan", vi: "thức ăn / món ăn", en: "food", category: "food", level: "A1" },
  { th: "ข้าว", rom: "khao", vi: "cơm / gạo", en: "rice", category: "food", level: "A1" },
  { th: "น้ำ", rom: "nam", vi: "nước", en: "water", category: "food", level: "A1" },
  { th: "กาแฟ", rom: "kafae", vi: "cà phê", en: "coffee", category: "food", level: "A1" },
  { th: "ชา", rom: "cha", vi: "trà", en: "tea", category: "food", level: "A1" },
  { th: "นม", rom: "nom", vi: "sữa", en: "milk", category: "food", level: "A1" },
  { th: "ไข่", rom: "khai", vi: "trứng", en: "egg", category: "food", level: "A1" },
  { th: "ปลา", rom: "pla", vi: "cá", en: "fish", category: "food", level: "A1" },
  { th: "ไก่", rom: "kai", vi: "gà", en: "chicken", category: "food", level: "A1" },
  { th: "หมู", rom: "mu", vi: "thịt heo", en: "pork", category: "food", level: "A1" },
  { th: "เนื้อ", rom: "nuea", vi: "thịt bò", en: "beef", category: "food", level: "A2" },
  { th: "ผัก", rom: "phak", vi: "rau", en: "vegetable", category: "food", level: "A1" },
  { th: "ผลไม้", rom: "phonlamai", vi: "trái cây", en: "fruit", category: "food", level: "A2" },
  { th: "เผ็ด", rom: "phet", vi: "cay", en: "spicy", category: "food", level: "A1" },
  { th: "อร่อย", rom: "aroi", vi: "ngon", en: "delicious", category: "food", level: "A1" },
  { th: "หิว", rom: "hiu", vi: "đói", en: "hungry", category: "food", level: "A1" },
  { th: "กิน", rom: "kin", vi: "ăn", en: "to eat", category: "food", level: "A1" },
  { th: "ดื่ม", rom: "duem", vi: "uống", en: "to drink", category: "food", level: "A1" },
  { th: "เบียร์", rom: "bia", vi: "bia", en: "beer", category: "food", level: "A2" },
  { th: "ก๋วยเตี๋ยว", rom: "kuaitiao", vi: "phở / mì nước", en: "noodle soup", category: "food", level: "A2" },
  { th: "ต้มยำ", rom: "tom yam", vi: "canh tom yum", en: "tom yum soup", category: "food", level: "B1" },

  // ── Common verbs ──────────────────────────────────────────────────────
  { th: "เป็น", rom: "pen", vi: "là (thì, làm)", en: "to be", category: "verbs", level: "A1" },
  { th: "มี", rom: "mi", vi: "có", en: "to have", category: "verbs", level: "A1" },
  { th: "ไป", rom: "pai", vi: "đi", en: "to go", category: "verbs", level: "A1" },
  { th: "มา", rom: "ma", vi: "đến / tới", en: "to come", category: "verbs", level: "A1" },
  { th: "ทำ", rom: "tham", vi: "làm", en: "to do / make", category: "verbs", level: "A1" },
  { th: "พูด", rom: "phut", vi: "nói", en: "to speak", category: "verbs", level: "A1" },
  { th: "รู้", rom: "ru", vi: "biết", en: "to know", category: "verbs", level: "A1" },
  { th: "คิด", rom: "khit", vi: "nghĩ", en: "to think", category: "verbs", level: "A2" },
  { th: "ชอบ", rom: "chop", vi: "thích", en: "to like", category: "verbs", level: "A1" },
  { th: "รัก", rom: "rak", vi: "yêu", en: "to love", category: "verbs", level: "A1" },
  { th: "ต้องการ", rom: "tongkan", vi: "cần", en: "to need", category: "verbs", level: "A2" },
  { th: "เอา", rom: "ao", vi: "lấy / muốn", en: "to take / want", category: "verbs", level: "A1" },
  { th: "ดู", rom: "du", vi: "xem / nhìn", en: "to watch / look", category: "verbs", level: "A1" },
  { th: "ฟัง", rom: "fang", vi: "nghe", en: "to listen", category: "verbs", level: "A1" },
  { th: "อ่าน", rom: "an", vi: "đọc", en: "to read", category: "verbs", level: "A1" },
  { th: "เขียน", rom: "khian", vi: "viết", en: "to write", category: "verbs", level: "A2" },
  { th: "ซื้อ", rom: "sue", vi: "mua", en: "to buy", category: "verbs", level: "A1" },
  { th: "ขาย", rom: "khai", vi: "bán", en: "to sell", category: "verbs", level: "A2" },
  { th: "นอน", rom: "non", vi: "ngủ / nằm", en: "to sleep", category: "verbs", level: "A1" },
  { th: "ตื่น", rom: "tuen", vi: "thức dậy", en: "to wake up", category: "verbs", level: "A2" },
  { th: "เดิน", rom: "doen", vi: "đi bộ", en: "to walk", category: "verbs", level: "A1" },
  { th: "วิ่ง", rom: "wing", vi: "chạy", en: "to run", category: "verbs", level: "A2" },
  { th: "ให้", rom: "hai", vi: "cho / đưa", en: "to give", category: "verbs", level: "A1" },
  { th: "ได้", rom: "dai", vi: "được / có thể", en: "can / to get", category: "verbs", level: "A1" },
  { th: "อยาก", rom: "yak", vi: "muốn", en: "to want to", category: "verbs", level: "A1" },
  { th: "เข้าใจ", rom: "khao chai", vi: "hiểu", en: "to understand", category: "verbs", level: "A1" },
  { th: "ทำงาน", rom: "tham ngan", vi: "làm việc", en: "to work", category: "verbs", level: "A2" },
  { th: "เรียน", rom: "rian", vi: "học", en: "to study", category: "verbs", level: "A1" },

  // ── Adjectives & descriptions ─────────────────────────────────────────
  { th: "ดี", rom: "di", vi: "tốt", en: "good", category: "adjectives", level: "A1" },
  { th: "สวย", rom: "suai", vi: "đẹp", en: "beautiful", category: "adjectives", level: "A1" },
  { th: "ใหญ่", rom: "yai", vi: "to / lớn", en: "big", category: "adjectives", level: "A1" },
  { th: "เล็ก", rom: "lek", vi: "nhỏ", en: "small", category: "adjectives", level: "A1" },
  { th: "ร้อน", rom: "ron", vi: "nóng", en: "hot", category: "adjectives", level: "A1" },
  { th: "หนาว", rom: "nao", vi: "lạnh (thời tiết)", en: "cold (weather)", category: "adjectives", level: "A1" },
  { th: "ใหม่", rom: "mai", vi: "mới", en: "new", category: "adjectives", level: "A1" },
  { th: "เก่า", rom: "kao", vi: "cũ", en: "old (things)", category: "adjectives", level: "A1" },
  { th: "มาก", rom: "mak", vi: "nhiều / rất", en: "much / very", category: "adjectives", level: "A1" },
  { th: "น้อย", rom: "noi", vi: "ít", en: "few / little", category: "adjectives", level: "A2" },
  { th: "เร็ว", rom: "reo", vi: "nhanh", en: "fast", category: "adjectives", level: "A2" },
  { th: "ช้า", rom: "cha", vi: "chậm", en: "slow", category: "adjectives", level: "A2" },
  { th: "แพง", rom: "phaeng", vi: "đắt", en: "expensive", category: "adjectives", level: "A1" },
  { th: "ถูก", rom: "thuk", vi: "rẻ / đúng", en: "cheap / correct", category: "adjectives", level: "A1" },
  { th: "ง่าย", rom: "ngai", vi: "dễ", en: "easy", category: "adjectives", level: "A2" },
  { th: "ยาก", rom: "yak", vi: "khó", en: "difficult", category: "adjectives", level: "A2" },
  { th: "สูง", rom: "sung", vi: "cao", en: "tall / high", category: "adjectives", level: "A2" },
  { th: "เตี้ย", rom: "tia", vi: "thấp (người)", en: "short (height)", category: "adjectives", level: "B1" },
  { th: "ไกล", rom: "klai", vi: "xa", en: "far", category: "adjectives", level: "A2" },
  { th: "ใกล้", rom: "klai", vi: "gần", en: "near", category: "adjectives", level: "A2" },

  // ── Question words ────────────────────────────────────────────────────
  { th: "อะไร", rom: "arai", vi: "cái gì", en: "what", category: "questions", level: "A1" },
  { th: "ใคร", rom: "khrai", vi: "ai", en: "who", category: "questions", level: "A1" },
  { th: "ที่ไหน", rom: "thinai", vi: "ở đâu", en: "where", category: "questions", level: "A1" },
  { th: "เมื่อไหร่", rom: "muearai", vi: "khi nào", en: "when", category: "questions", level: "A2" },
  { th: "ทำไม", rom: "thammai", vi: "tại sao", en: "why", category: "questions", level: "A1" },
  { th: "อย่างไร", rom: "yangrai", vi: "như thế nào", en: "how", category: "questions", level: "A2" },
  { th: "เท่าไหร่", rom: "thaorai", vi: "bao nhiêu (tiền)", en: "how much", category: "questions", level: "A1" },
  { th: "กี่", rom: "ki", vi: "mấy / bao nhiêu (số)", en: "how many", category: "questions", level: "A2" },

  // ── Places & travel ───────────────────────────────────────────────────
  { th: "บ้าน", rom: "ban", vi: "nhà", en: "house / home", category: "places", level: "A1" },
  { th: "โรงเรียน", rom: "rongrian", vi: "trường học", en: "school", category: "places", level: "A1" },
  { th: "โรงพยาบาล", rom: "rongphayaban", vi: "bệnh viện", en: "hospital", category: "places", level: "A2" },
  { th: "ตลาด", rom: "talat", vi: "chợ", en: "market", category: "places", level: "A1" },
  { th: "ร้านอาหาร", rom: "ran ahan", vi: "nhà hàng / quán ăn", en: "restaurant", category: "places", level: "A2" },
  { th: "โรงแรม", rom: "rongraem", vi: "khách sạn", en: "hotel", category: "places", level: "A1" },
  { th: "สนามบิน", rom: "sanambin", vi: "sân bay", en: "airport", category: "places", level: "A2" },
  { th: "สถานี", rom: "sathani", vi: "nhà ga / trạm", en: "station", category: "places", level: "A2" },
  { th: "ห้องน้ำ", rom: "hong nam", vi: "nhà vệ sinh", en: "toilet", category: "places", level: "A1" },
  { th: "ธนาคาร", rom: "thanakhan", vi: "ngân hàng", en: "bank", category: "places", level: "A2" },
  { th: "ร้าน", rom: "ran", vi: "cửa hàng / quán", en: "shop", category: "places", level: "A1" },
  { th: "เมือง", rom: "mueang", vi: "thành phố", en: "city / town", category: "places", level: "A2" },
  { th: "ถนน", rom: "thanon", vi: "đường", en: "road / street", category: "places", level: "A2" },
  { th: "รถ", rom: "rot", vi: "xe", en: "car / vehicle", category: "places", level: "A1" },
  { th: "รถไฟ", rom: "rot fai", vi: "tàu hỏa", en: "train", category: "places", level: "A2" },
  { th: "เครื่องบิน", rom: "khrueang bin", vi: "máy bay", en: "airplane", category: "places", level: "A2" },
  { th: "แท็กซี่", rom: "thaeksi", vi: "taxi", en: "taxi", category: "places", level: "A1" },

  // ── Colors ────────────────────────────────────────────────────────────
  { th: "สี", rom: "si", vi: "màu", en: "color", category: "colors", level: "A1" },
  { th: "แดง", rom: "daeng", vi: "đỏ", en: "red", category: "colors", level: "A1" },
  { th: "เขียว", rom: "khiao", vi: "xanh lá", en: "green", category: "colors", level: "A1" },
  { th: "น้ำเงิน", rom: "nam ngoen", vi: "xanh dương", en: "blue", category: "colors", level: "A2" },
  { th: "เหลือง", rom: "lueang", vi: "vàng", en: "yellow", category: "colors", level: "A1" },
  { th: "ดำ", rom: "dam", vi: "đen", en: "black", category: "colors", level: "A1" },
  { th: "ขาว", rom: "khao", vi: "trắng", en: "white", category: "colors", level: "A1" },

  // ── Body ──────────────────────────────────────────────────────────────
  { th: "หัว", rom: "hua", vi: "đầu", en: "head", category: "body", level: "A1" },
  { th: "ตา", rom: "ta", vi: "mắt", en: "eye", category: "body", level: "A1" },
  { th: "หู", rom: "hu", vi: "tai", en: "ear", category: "body", level: "A1" },
  { th: "จมูก", rom: "chamuk", vi: "mũi", en: "nose", category: "body", level: "A2" },
  { th: "ปาก", rom: "pak", vi: "miệng", en: "mouth", category: "body", level: "A1" },
  { th: "มือ", rom: "mue", vi: "tay", en: "hand", category: "body", level: "A1" },
  { th: "เท้า", rom: "thao", vi: "chân (bàn chân)", en: "foot", category: "body", level: "A1" },
  { th: "ท้อง", rom: "thong", vi: "bụng", en: "stomach", category: "body", level: "A2" },

  // ── Money & shopping ──────────────────────────────────────────────────
  { th: "เงิน", rom: "ngoen", vi: "tiền", en: "money", category: "money", level: "A1" },
  { th: "บาท", rom: "bat", vi: "baht (tiền Thái)", en: "baht (Thai currency)", category: "money", level: "A1" },
  { th: "ราคา", rom: "rakha", vi: "giá", en: "price", category: "money", level: "A2" },

  // ── Function words & glue ─────────────────────────────────────────────
  { th: "ใช่", rom: "chai", vi: "đúng / phải", en: "yes (that's right)", category: "function", level: "A1" },
  { th: "ไม่", rom: "mai", vi: "không (phủ định)", en: "no / not", category: "function", level: "A1" },
  { th: "ไม่ใช่", rom: "mai chai", vi: "không phải", en: "no, it isn't", category: "function", level: "A1" },
  { th: "นิดหน่อย", rom: "nit noi", vi: "một chút", en: "a little", category: "function", level: "A2" },
  { th: "ทั้งหมด", rom: "thang mot", vi: "tất cả", en: "all", category: "function", level: "A2" },
  { th: "และ", rom: "lae", vi: "và", en: "and", category: "function", level: "A1" },
  { th: "หรือ", rom: "rue", vi: "hoặc / hay", en: "or", category: "function", level: "A1" },
  { th: "แต่", rom: "tae", vi: "nhưng", en: "but", category: "function", level: "A1" },
  { th: "เพราะ", rom: "phro", vi: "bởi vì", en: "because", category: "function", level: "A2" },
  { th: "ถ้า", rom: "tha", vi: "nếu", en: "if", category: "function", level: "A2" },
  { th: "กับ", rom: "kap", vi: "với / và", en: "with", category: "function", level: "A1" },
  { th: "ที่", rom: "thi", vi: "ở / tại / cái mà", en: "at / that", category: "function", level: "A1" },
  { th: "ใน", rom: "nai", vi: "trong", en: "in", category: "function", level: "A1" },
  { th: "บน", rom: "bon", vi: "trên", en: "on", category: "function", level: "A1" },
  { th: "ใต้", rom: "tai", vi: "dưới", en: "under", category: "function", level: "A2" },
  { th: "มาก ๆ", rom: "mak mak", vi: "rất nhiều", en: "a lot", category: "function", level: "A2" },
  { th: "ก็", rom: "ko", vi: "thì / cũng", en: "then / also", category: "function", level: "B1" },
  { th: "แล้ว", rom: "laeo", vi: "rồi (đã xong)", en: "already", category: "function", level: "A2" },
];

export default THAI_VOCABULARY;
