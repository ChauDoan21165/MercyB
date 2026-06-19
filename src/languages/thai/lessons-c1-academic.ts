// Thai C1 — Academic / Professional lesson batch (Vietnamese-first, English companion).
//
// A6 track: compact CEFR C1 lessons for formal/academic/professional Thai.
// Self-contained on purpose — the Thai language folder does not yet ship a
// shared lesson type or an `index.ts` registry, so the structural type is
// declared inline here and can be lifted out unchanged later. This file does
// NOT touch foundation/index/normalize or any other Thai level.
//
// Each lesson carries:
//   - Thai script (`th`) — the primary form.
//   - Romanization (`rom`) — a reading aid (RTGS-style, with rough tone hints
//     where useful). Not a phonetic standard; meant to unblock a Vietnamese
//     learner, not to replace listening.
//   - Vietnamese (`vi`) and English (`en`) glosses for every sentence and note.
//
// Native review is DEFERRED — these lessons have not been checked by a native
// Thai speaker. Treat romanization and register notes as a learner draft.

export type ThaiCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ThaiC1Category =
  | "presentation"
  | "report"
  | "academic_reading"
  | "professional_writing"
  | "structured_argument"
  | "meeting"
  | "evidence_contrast";

export type ThaiSentence = {
  th: string;
  rom: string;
  vi: string;
  en: string;
};

export type ThaiVocab = {
  word: string;
  rom: string;
  vi: string;
  en: string;
  pos: string;
};

export type ThaiC1Lesson = {
  id: string;
  level: ThaiCefrLevel;
  category: ThaiC1Category;
  title_th: string;
  title_vi: string;
  title_en: string;
  sentences: ThaiSentence[];
  vocabulary: ThaiVocab[];
  notes_vi: string;
  notes_en: string;
  tip_vi: string;
  tip_en: string;
};

export const lessons: ThaiC1Lesson[] = [
  // ── 1. Formal presentation openings ──────────────────────────────────
  {
    id: "th_c1_presentation_opening",
    level: "C1",
    category: "presentation",
    title_th: "การเปิดการนำเสนออย่างเป็นทางการ",
    title_vi: "Mở đầu bài thuyết trình trang trọng",
    title_en: "Opening a formal presentation",
    sentences: [
      {
        th: "เรียนท่านผู้มีเกียรติทุกท่าน ผมขอเริ่มการนำเสนอในวันนี้",
        rom: "rian thân phûu-mii-kìat thúk thân, phǒm khǒo rôem kaan-námsànǒe nai wan-níi",
        vi: "Kính thưa quý vị, tôi xin bắt đầu bài thuyết trình hôm nay.",
        en: "Distinguished guests, allow me to begin today's presentation.",
      },
      {
        th: "หัวข้อที่จะนำเสนอในวันนี้คือผลกระทบของเทคโนโลยีต่อการศึกษา",
        rom: "hǔa-khôo thîi jà námsànǒe nai wan-níi khuue phǒn-krà-thóp khǒong théknoloyii tòo kaan-sùeksǎa",
        vi: "Chủ đề trình bày hôm nay là tác động của công nghệ đối với giáo dục.",
        en: "Today's topic is the impact of technology on education.",
      },
      {
        th: "การนำเสนอนี้แบ่งออกเป็นสามส่วนหลัก",
        rom: "kaan-námsànǒe níi bàeng òok pen sǎam sùan làk",
        vi: "Bài trình bày này được chia thành ba phần chính.",
        en: "This presentation is divided into three main parts.",
      },
      {
        th: "หากท่านมีคำถาม กรุณาสอบถามได้ในช่วงท้ายของการนำเสนอ",
        rom: "hàak thân mii kham-thǎam, ka-rú-naa sòop-thǎam dâi nai chûang-tháai khǒong kaan-námsànǒe",
        vi: "Nếu quý vị có câu hỏi, xin vui lòng đặt câu hỏi vào phần cuối.",
        en: "If you have questions, please ask them at the end of the presentation.",
      },
    ],
    vocabulary: [
      { word: "เรียน", rom: "rian", vi: "kính thưa (mở đầu trang trọng)", en: "formal salutation 'to/dear'", pos: "v." },
      { word: "ผู้มีเกียรติ", rom: "phûu-mii-kìat", vi: "quý vị / khách quý", en: "honored guests", pos: "n." },
      { word: "นำเสนอ", rom: "námsànǒe", vi: "trình bày, thuyết trình", en: "to present", pos: "v." },
      { word: "หัวข้อ", rom: "hǔa-khôo", vi: "chủ đề, đề mục", en: "topic / heading", pos: "n." },
      { word: "แบ่งออกเป็น", rom: "bàeng òok pen", vi: "chia thành", en: "to be divided into", pos: "v." },
    ],
    notes_vi:
      "Trong tiếng Thái trang trọng, người nói mở đầu bằng เรียน + đối tượng (ท่านผู้มีเกียรติ) thay vì chào suồng sã. Đại từ ngôi thứ nhất đổi theo giới: ผม (nam) / ดิฉัน (nữ). Tránh dùng ฉัน hay เรา trong bối cảnh học thuật.",
    notes_en:
      "Formal Thai opens with เรียน + an audience term (ท่านผู้มีเกียรติ) rather than a casual greeting. The first-person pronoun is gendered: ผม (male) / ดิฉัน (female). Avoid ฉัน or เรา in academic settings.",
    tip_vi:
      "Khung mở đầu 3 bước: (1) chào trang trọng → (2) nêu หัวข้อ (chủ đề) → (3) nêu cấu trúc (แบ่งออกเป็น...ส่วน). Báo trước phần hỏi đáp ở cuối để giữ thế chủ động.",
    tip_en:
      "Three-step opener: (1) formal greeting → (2) state the หัวข้อ (topic) → (3) preview the structure (แบ่งออกเป็น…ส่วน). Signpost Q&A at the end to keep control of the floor.",
  },

  // ── 2. Report summary language ───────────────────────────────────────
  {
    id: "th_c1_report_summary",
    level: "C1",
    category: "report",
    title_th: "ภาษาสำหรับสรุปรายงาน",
    title_vi: "Ngôn ngữ tóm tắt báo cáo",
    title_en: "Language for summarizing a report",
    sentences: [
      {
        th: "รายงานฉบับนี้สรุปผลการดำเนินงานในไตรมาสที่ผ่านมา",
        rom: "raai-ngaan chà-bàp níi sà-rùp phǒn kaan-dam-noen-ngaan nai trai-mâat thîi phàan-maa",
        vi: "Báo cáo này tóm tắt kết quả hoạt động trong quý vừa qua.",
        en: "This report summarizes the performance of the past quarter.",
      },
      {
        th: "โดยสรุปแล้ว ยอดขายเพิ่มขึ้นร้อยละสิบห้าเมื่อเทียบกับปีก่อน",
        rom: "dooi sà-rùp láeo, yôot-khǎai phôem-khûen rói-lá sìp-hâa mûea-thîap kàp pii-kòon",
        vi: "Tóm lại, doanh số tăng 15 phần trăm so với năm trước.",
        en: "In summary, sales rose by fifteen percent compared with the previous year.",
      },
      {
        th: "ข้อมูลแสดงให้เห็นว่าแนวโน้มโดยรวมยังคงเป็นบวก",
        rom: "khôo-muun sà-daeng hâi hěn wâa naeo-nóom dooi-ruam yang-khong pen bùak",
        vi: "Dữ liệu cho thấy xu hướng chung vẫn còn tích cực.",
        en: "The data shows that the overall trend remains positive.",
      },
      {
        th: "รายละเอียดเพิ่มเติมปรากฏอยู่ในภาคผนวกท้ายเล่ม",
        rom: "raai-lá-ìat phôem-toem prà-kòt yùu nai phâak-phà-nùak tháai lêm",
        vi: "Chi tiết bổ sung được trình bày trong phụ lục cuối tài liệu.",
        en: "Further details appear in the appendix at the end of the document.",
      },
    ],
    vocabulary: [
      { word: "ฉบับ", rom: "chà-bàp", vi: "bản (loại từ cho văn bản)", en: "classifier for documents", pos: "clf." },
      { word: "ไตรมาส", rom: "trai-mâat", vi: "quý (3 tháng)", en: "quarter (of a year)", pos: "n." },
      { word: "ร้อยละ", rom: "rói-lá", vi: "phần trăm", en: "percent", pos: "n." },
      { word: "แนวโน้ม", rom: "naeo-nóom", vi: "xu hướng", en: "trend", pos: "n." },
      { word: "ภาคผนวก", rom: "phâak-phà-nùak", vi: "phụ lục", en: "appendix", pos: "n." },
    ],
    notes_vi:
      "Văn báo cáo Thái dùng từ Hán-Khmer trang trọng: ดำเนินงาน (vận hành/hoạt động) thay cho ทำงาน, ปรากฏ (xuất hiện) thay cho มี. ร้อยละ đứng TRƯỚC con số (ร้อยละ ๑๕), khác với เปอร์เซ็นต์ đứng sau.",
    notes_en:
      "Thai report prose uses formal Sanskrit/Khmer-derived words: ดำเนินงาน (operate) over ทำงาน, ปรากฏ (appear) over มี. Note ร้อยละ precedes the number (ร้อยละ 15), unlike เปอร์เซ็นต์ which follows it.",
    tip_vi:
      "Mở câu tóm tắt bằng โดยสรุปแล้ว (tóm lại) hoặc กล่าวโดยสรุป. Khi nêu số liệu, ghép động từ định hướng: เพิ่มขึ้น (tăng) / ลดลง (giảm) + เมื่อเทียบกับ (so với) để câu mang tính phân tích.",
    tip_en:
      "Begin a summary clause with โดยสรุปแล้ว (in summary) or กล่าวโดยสรุป. With figures, pair a directional verb เพิ่มขึ้น (rise) / ลดลง (fall) + เมื่อเทียบกับ (compared with) to keep the tone analytical.",
  },

  // ── 3. Academic reading frames (citing & paraphrasing) ───────────────
  {
    id: "th_c1_academic_reading_frames",
    level: "C1",
    category: "academic_reading",
    title_th: "กรอบภาษาในการอ่านเชิงวิชาการ",
    title_vi: "Khung ngôn ngữ đọc học thuật (trích dẫn, diễn giải)",
    title_en: "Academic reading frames (citing, paraphrasing)",
    sentences: [
      {
        th: "จากการศึกษาของคณะผู้วิจัย พบว่าปัจจัยด้านสิ่งแวดล้อมมีบทบาทสำคัญ",
        rom: "jàak kaan-sùeksǎa khǒong khá-ná phûu-wí-jai, phóp wâa pàt-jai dâan sìng-wâet-lóom mii bòt-bàat sǎm-khan",
        vi: "Theo nghiên cứu của nhóm tác giả, người ta thấy rằng yếu tố môi trường đóng vai trò quan trọng.",
        en: "According to the research team's study, environmental factors were found to play a key role.",
      },
      {
        th: "ผู้เขียนโต้แย้งว่าข้อสรุปก่อนหน้านี้ยังขาดหลักฐานสนับสนุน",
        rom: "phûu-khǐan tôo-yáeng wâa khôo-sà-rùp kòon-nâa-níi yang khàat làk-thǎan sà-nàp-sà-nǔn",
        vi: "Tác giả lập luận rằng các kết luận trước đó còn thiếu bằng chứng hỗ trợ.",
        en: "The author argues that the earlier conclusions still lack supporting evidence.",
      },
      {
        th: "กล่าวอีกนัยหนึ่ง ความสัมพันธ์นี้อาจไม่ได้เป็นเหตุเป็นผลโดยตรง",
        rom: "klàao ìik nai nùeng, khwaam-sǎm-phan níi àat mâi dâi pen hèet pen phǒn dooi-trong",
        vi: "Nói cách khác, mối quan hệ này có thể không mang tính nhân quả trực tiếp.",
        en: "In other words, this relationship may not be directly causal.",
      },
      {
        th: "บทความนี้มุ่งวิเคราะห์ประเด็นความเหลื่อมล้ำทางการศึกษา",
        rom: "bòt-khwaam níi mûng wí-khrór prà-den khwaam-lùeam-lám thaang kaan-sùeksǎa",
        vi: "Bài viết này nhằm phân tích vấn đề bất bình đẳng trong giáo dục.",
        en: "This article aims to analyze the issue of educational inequality.",
      },
    ],
    vocabulary: [
      { word: "ผู้วิจัย", rom: "phûu-wí-jai", vi: "nhà nghiên cứu", en: "researcher", pos: "n." },
      { word: "โต้แย้ง", rom: "tôo-yáeng", vi: "lập luận phản bác", en: "to argue / dispute", pos: "v." },
      { word: "หลักฐาน", rom: "làk-thǎan", vi: "bằng chứng", en: "evidence", pos: "n." },
      { word: "กล่าวอีกนัยหนึ่ง", rom: "klàao ìik nai nùeng", vi: "nói cách khác", en: "in other words", pos: "phr." },
      { word: "วิเคราะห์", rom: "wí-khrór", vi: "phân tích", en: "to analyze", pos: "v." },
    ],
    notes_vi:
      "Khi trích dẫn, tiếng Thái học thuật dùng จากการศึกษาของ... พบว่า... (theo nghiên cứu của..., thấy rằng...). Động từ tư duy đặc trưng: โต้แย้ง (phản biện), ชี้ให้เห็น (chỉ ra), เสนอ (đề xuất). มุ่ง + động từ = 'nhằm/hướng tới'.",
    notes_en:
      "When citing, academic Thai uses จากการศึกษาของ… พบว่า… (per the study by…, it was found that…). Signature reporting verbs: โต้แย้ง (argue), ชี้ให้เห็น (point out), เสนอ (propose). มุ่ง + verb = 'aims to'.",
    tip_vi:
      "Để diễn giải thay vì chép nguyên văn, mở bằng กล่าวอีกนัยหนึ่ง (nói cách khác) hoặc สรุปได้ว่า (có thể tóm rằng). Phân biệt เหตุเป็นผล (nhân quả) với ความสัมพันธ์ (tương quan) — lỗi học thuật phổ biến.",
    tip_en:
      "To paraphrase rather than quote, open with กล่าวอีกนัยหนึ่ง (in other words) or สรุปได้ว่า (it can be summed up that). Distinguish เหตุเป็นผล (causation) from ความสัมพันธ์ (correlation) — a common academic slip.",
  },

  // ── 4. Polite professional email ─────────────────────────────────────
  {
    id: "th_c1_professional_email",
    level: "C1",
    category: "professional_writing",
    title_th: "การเขียนอีเมลอย่างมืออาชีพ",
    title_vi: "Viết email chuyên nghiệp, lịch sự",
    title_en: "Writing a polite professional email",
    sentences: [
      {
        th: "เรียน คุณสมชาย ที่นับถือ",
        rom: "rian khun sǒm-chaai thîi náp-thǔue",
        vi: "Kính gửi ông Somchai kính mến,",
        en: "Dear Mr. Somchai,",
      },
      {
        th: "ดิฉันเขียนมาเพื่อสอบถามเกี่ยวกับความคืบหน้าของโครงการ",
        rom: "dì-chǎn khǐan maa phûea sòop-thǎam kìao-kàp khwaam-khûep-nâa khǒong khrôong-kaan",
        vi: "Tôi viết thư để hỏi về tiến độ của dự án.",
        en: "I am writing to inquire about the progress of the project.",
      },
      {
        th: "รบกวนขอความอนุเคราะห์ข้อมูลเพิ่มเติมภายในสัปดาห์นี้",
        rom: "róp-kuan khǒo khwaam-à-nú-khrór khôo-muun phôem-toem phaai-nai sàp-daa níi",
        vi: "Rất mong được nhờ ông/bà hỗ trợ thêm thông tin trong tuần này.",
        en: "I would be grateful for your kind assistance with further details within this week.",
      },
      {
        th: "จึงเรียนมาเพื่อโปรดพิจารณา ขอแสดงความนับถือ",
        rom: "jueng rian maa phûea pròot phí-jaa-rá-naa, khǒo sà-daeng khwaam náp-thǔue",
        vi: "Kính trình để quý vị xem xét. Trân trọng.",
        en: "Submitted for your kind consideration. Yours sincerely.",
      },
    ],
    vocabulary: [
      { word: "ที่นับถือ", rom: "thîi náp-thǔue", vi: "kính mến (sau tên)", en: "respected (after a name)", pos: "phr." },
      { word: "สอบถาม", rom: "sòop-thǎam", vi: "hỏi, tra hỏi (lịch sự)", en: "to inquire", pos: "v." },
      { word: "รบกวน", rom: "róp-kuan", vi: "làm phiền (mở lời nhờ vả)", en: "to trouble (softener for a request)", pos: "v." },
      { word: "ความอนุเคราะห์", rom: "khwaam-à-nú-khrór", vi: "sự hỗ trợ, giúp đỡ (trang trọng)", en: "kind assistance", pos: "n." },
      { word: "ขอแสดงความนับถือ", rom: "khǒo sà-daeng khwaam náp-thǔue", vi: "trân trọng (kết thư)", en: "yours sincerely", pos: "phr." },
    ],
    notes_vi:
      "Email công sở Thái có khung cố định: เรียน...ที่นับถือ (mở) → จึงเรียนมาเพื่อ... → ขอแสดงความนับถือ (đóng). รบกวน và ขอความอนุเคราะห์ là 'từ giảm nhẹ' bắt buộc khi nhờ vả; bỏ chúng đi nghe ra lệnh.",
    notes_en:
      "A Thai work email has a fixed frame: เรียน…ที่นับถือ (open) → จึงเรียนมาเพื่อ… → ขอแสดงความนับถือ (close). รบกวน and ขอความอนุเคราะห์ are obligatory softeners for a request; dropping them sounds like an order.",
    tip_vi:
      "Mức lịch sự tăng dần khi nhờ việc: ช่วย... (nhờ, thân) < รบกวน... (lịch sự) < ขอความอนุเคราะห์... (rất trang trọng). Chọn theo khoảng cách quyền lực với người nhận.",
    tip_en:
      "Politeness scales with the favor: ช่วย… (casual) < รบกวน… (polite) < ขอความอนุเคราะห์… (very formal). Pick by the power distance to the recipient.",
  },

  // ── 5. Structured argument (thesis, concession, conclusion) ──────────
  {
    id: "th_c1_structured_argument",
    level: "C1",
    category: "structured_argument",
    title_th: "การสร้างข้อโต้แย้งอย่างมีโครงสร้าง",
    title_vi: "Xây dựng lập luận có cấu trúc",
    title_en: "Building a structured argument",
    sentences: [
      {
        th: "ประเด็นนี้ไม่อาจมองอย่างง่ายดายว่าเป็นเรื่องถูกหรือผิด",
        rom: "prà-den níi mâi àat moong yàang ngâai-daai wâa pen rûeang thùuk rǔue phìt",
        vi: "Vấn đề này không thể nhìn một cách đơn giản là đúng hay sai.",
        en: "This issue cannot be viewed simply as a matter of right or wrong.",
      },
      {
        th: "แม้ว่าเทคโนโลยีจะอำนวยความสะดวก แต่ก็ก่อให้เกิดความเสี่ยงเช่นกัน",
        rom: "máe-wâa théknoloyii jà am-nuai khwaam-sà-dùak, tàe kôo kòo-hâi-kòet khwaam-sìang chên-kan",
        vi: "Mặc dù công nghệ mang lại tiện lợi, nhưng nó cũng tạo ra rủi ro.",
        en: "Although technology brings convenience, it also gives rise to risks.",
      },
      {
        th: "ด้วยเหตุนี้ จึงควรพิจารณาทั้งข้อดีและข้อจำกัดอย่างรอบด้าน",
        rom: "dûai hèet níi, jueng khuan phí-jaa-rá-naa tháng khôo-dii láe khôo-jam-kàt yàang rôop-dâan",
        vi: "Vì lẽ đó, cần cân nhắc cả ưu điểm lẫn hạn chế một cách toàn diện.",
        en: "For this reason, both the merits and the limitations should be weighed comprehensively.",
      },
      {
        th: "โดยสรุป แนวทางที่สมดุลย่อมเหมาะสมกว่าการเลือกข้างใดข้างหนึ่ง",
        rom: "dooi sà-rùp, naeo-thaang thîi sà-mà-dun yôom mòo-sǒm kwàa kaan-lûeak khâang dai khâang nùeng",
        vi: "Tóm lại, một hướng đi cân bằng sẽ phù hợp hơn việc chọn hẳn một phía.",
        en: "In sum, a balanced approach is more appropriate than choosing one side outright.",
      },
    ],
    vocabulary: [
      { word: "แม้ว่า...แต่", rom: "máe-wâa…tàe", vi: "mặc dù... nhưng", en: "although… (still)", pos: "conj." },
      { word: "ก่อให้เกิด", rom: "kòo-hâi-kòet", vi: "gây ra, làm phát sinh", en: "to give rise to", pos: "v." },
      { word: "ด้วยเหตุนี้", rom: "dûai hèet níi", vi: "vì lẽ đó", en: "for this reason", pos: "conj." },
      { word: "ข้อจำกัด", rom: "khôo-jam-kàt", vi: "hạn chế, giới hạn", en: "limitation", pos: "n." },
      { word: "สมดุล", rom: "sà-mà-dun", vi: "cân bằng", en: "balanced", pos: "adj." },
    ],
    notes_vi:
      "Lập luận C1 cần bước NHƯỢNG BỘ: แม้ว่า...แต่... (mặc dù...nhưng...) cho thấy bạn thấy cả hai phía. Tiếng Thái lưu ý แต่ thường đi với ก็ (...แต่ก็...) trong câu nhượng bộ — bỏ ก็ nghe cụt.",
    notes_en:
      "A C1 argument needs the CONCESSION move: แม้ว่า…แต่… (although…still…) shows you see both sides. Note that แต่ usually pairs with ก็ (…แต่ก็…) in a concessive clause — dropping ก็ sounds abrupt.",
    tip_vi:
      "Khung 4 câu: (1) đặt vấn đề là phức tạp → (2) nhượng bộ với แม้ว่า...แต่ → (3) chuyển kết quả với ด้วยเหตุนี้ → (4) kết bằng โดยสรุป + lập trường có sắc thái (สมดุล).",
    tip_en:
      "Four-sentence frame: (1) frame the issue as complex → (2) concede with แม้ว่า…แต่ → (3) pivot to consequence with ด้วยเหตุนี้ → (4) close with โดยสรุป + a nuanced stance (สมดุล).",
  },

  // ── 6. Meeting language ──────────────────────────────────────────────
  {
    id: "th_c1_meeting_language",
    level: "C1",
    category: "meeting",
    title_th: "ภาษาในการประชุม",
    title_vi: "Ngôn ngữ trong cuộc họp",
    title_en: "Language for meetings",
    sentences: [
      {
        th: "ขออนุญาตเริ่มการประชุม วันนี้เรามีวาระสำคัญสามเรื่อง",
        rom: "khǒo à-nú-yâat rôem kaan-prà-chum, wan-níi rao mii waa-rá sǎm-khan sǎam rûeang",
        vi: "Xin phép bắt đầu cuộc họp, hôm nay chúng ta có ba nội dung quan trọng.",
        en: "Allow me to open the meeting; today we have three important agenda items.",
      },
      {
        th: "วาระแรกคือการทบทวนผลการดำเนินงานของเดือนที่ผ่านมา",
        rom: "waa-rá râek khuue kaan-tóp-thuan phǒn kaan-dam-noen-ngaan khǒong duean thîi phàan-maa",
        vi: "Nội dung đầu tiên là rà soát kết quả công việc của tháng trước.",
        en: "The first agenda item is to review last month's performance.",
      },
      {
        th: "ขอเชิญคุณวิไลแสดงความคิดเห็นในประเด็นนี้",
        rom: "khǒo chəən khun wí-lai sà-daeng khwaam-khít-hěn nai prà-den níi",
        vi: "Xin mời chị Wilai cho ý kiến về vấn đề này.",
        en: "May I invite Khun Wilai to share her view on this point.",
      },
      {
        th: "เราจะสรุปมติและมอบหมายงานในช่วงท้ายของการประชุม",
        rom: "rao jà sà-rùp má-tì láe môop-mǎai ngaan nai chûang-tháai khǒong kaan-prà-chum",
        vi: "Chúng ta sẽ chốt quyết nghị và phân công công việc ở cuối buổi họp.",
        en: "We will sum up the resolutions and assign tasks at the end of the meeting.",
      },
    ],
    vocabulary: [
      { word: "ขออนุญาต", rom: "khǒo à-nú-yâat", vi: "xin phép", en: "may I / with your permission", pos: "phr." },
      { word: "วาระ", rom: "waa-rá", vi: "nội dung họp, chương trình nghị sự", en: "agenda item", pos: "n." },
      { word: "ทบทวน", rom: "tóp-thuan", vi: "rà soát, xem lại", en: "to review", pos: "v." },
      { word: "มติ", rom: "má-tì", vi: "quyết nghị, nghị quyết", en: "resolution / decision", pos: "n." },
      { word: "มอบหมาย", rom: "môop-mǎai", vi: "phân công, giao việc", en: "to assign", pos: "v." },
    ],
    notes_vi:
      "Chủ trì họp dùng ขออนุญาต (xin phép) trước hành động để giữ phép tắc tập thể. Mời người khác phát biểu dùng ขอเชิญ + tên + แสดงความคิดเห็น — trang trọng hơn nhiều so với พูด.",
    notes_en:
      "A chair uses ขออนุญาต (may I) before an action to preserve group politeness. To invite a contribution, use ขอเชิญ + name + แสดงความคิดเห็น — far more formal than just พูด (speak).",
    tip_vi:
      "Gọi người trong họp bằng คุณ + tên riêng (คุณวิไล), không gọi họ. Chuyển nội dung: วาระแรก... → วาระต่อไป... → วาระสุดท้าย... để cuộc họp mạch lạc.",
    tip_en:
      "Address people with คุณ + first name (คุณวิไล), never the surname. Signpost items: วาระแรก… → วาระต่อไป… → วาระสุดท้าย… to keep the meeting on track.",
  },

  // ── 7. Presenting evidence & data ────────────────────────────────────
  {
    id: "th_c1_presenting_evidence",
    level: "C1",
    category: "evidence_contrast",
    title_th: "การนำเสนอหลักฐานและข้อมูล",
    title_vi: "Trình bày bằng chứng và dữ liệu",
    title_en: "Presenting evidence and data",
    sentences: [
      {
        th: "ตามข้อมูลที่ปรากฏในแผนภูมิ จำนวนผู้ใช้เพิ่มขึ้นอย่างต่อเนื่อง",
        rom: "taam khôo-muun thîi prà-kòt nai phǎen-phuum, jam-nuan phûu-chái phôem-khûen yàang tòo-nûeang",
        vi: "Theo dữ liệu thể hiện trong biểu đồ, số người dùng tăng liên tục.",
        en: "According to the data shown in the chart, the number of users rose steadily.",
      },
      {
        th: "ตัวเลขนี้สะท้อนให้เห็นถึงความต้องการของตลาดที่แท้จริง",
        rom: "tua-lêek níi sà-thóon hâi hěn thǔeng khwaam-tông-kaan khǒong tà-làat thîi tháe-jing",
        vi: "Con số này phản ánh nhu cầu thực sự của thị trường.",
        en: "This figure reflects the market's genuine demand.",
      },
      {
        th: "หลักฐานเชิงประจักษ์สนับสนุนข้อสรุปดังกล่าวอย่างหนักแน่น",
        rom: "làk-thǎan choeng prà-jàk sà-nàp-sà-nǔn khôo-sà-rùp dang-klàao yàang nàk-nâen",
        vi: "Bằng chứng thực nghiệm hỗ trợ mạnh mẽ cho kết luận nói trên.",
        en: "Empirical evidence strongly supports the aforementioned conclusion.",
      },
      {
        th: "อย่างไรก็ดี ข้อมูลชุดนี้ยังมีข้อจำกัดด้านขนาดของกลุ่มตัวอย่าง",
        rom: "yàang-rai kôo-dii, khôo-muun chút níi yang mii khôo-jam-kàt dâan khà-nàat khǒong klùm-tua-yàang",
        vi: "Tuy nhiên, bộ dữ liệu này vẫn có hạn chế về cỡ mẫu.",
        en: "Nevertheless, this dataset still has limitations regarding sample size.",
      },
    ],
    vocabulary: [
      { word: "แผนภูมิ", rom: "phǎen-phuum", vi: "biểu đồ", en: "chart / diagram", pos: "n." },
      { word: "สะท้อน", rom: "sà-thóon", vi: "phản ánh", en: "to reflect", pos: "v." },
      { word: "เชิงประจักษ์", rom: "choeng prà-jàk", vi: "thực nghiệm, dựa trên quan sát", en: "empirical", pos: "adj." },
      { word: "ดังกล่าว", rom: "dang-klàao", vi: "nói trên, đã nêu", en: "aforementioned", pos: "det." },
      { word: "กลุ่มตัวอย่าง", rom: "klùm-tua-yàang", vi: "mẫu (nghiên cứu)", en: "sample (group)", pos: "n." },
    ],
    notes_vi:
      "Dẫn dữ liệu mở bằng ตามข้อมูลที่... (theo dữ liệu...). ดังกล่าว là từ chỉ định trang trọng thay cho นี้/นั้น khi nhắc lại điều đã nêu. Cặp đôi học thuật: หลักฐานเชิงประจักษ์ (bằng chứng thực nghiệm).",
    notes_en:
      "Introduce data with ตามข้อมูลที่… (according to the data…). ดังกล่าว is a formal demonstrative replacing นี้/นั้น when referring back. Academic collocation: หลักฐานเชิงประจักษ์ (empirical evidence).",
    tip_vi:
      "Người trình bày C1 luôn nêu giới hạn của dữ liệu: mở bằng อย่างไรก็ดี / อย่างไรก็ตาม (tuy nhiên) rồi chỉ ra ข้อจำกัด (hạn chế). Thừa nhận giới hạn làm lập luận đáng tin hơn, không yếu đi.",
    tip_en:
      "A C1 presenter always names the data's limits: open with อย่างไรก็ดี / อย่างไรก็ตาม (however) then state the ข้อจำกัด (limitation). Conceding limits makes the argument more credible, not weaker.",
  },

  // ── 8. Contrast & comparison ─────────────────────────────────────────
  {
    id: "th_c1_contrast_comparison",
    level: "C1",
    category: "evidence_contrast",
    title_th: "การเปรียบเทียบและการแสดงความต่าง",
    title_vi: "So sánh và nêu sự khác biệt",
    title_en: "Contrast and comparison",
    sentences: [
      {
        th: "เมื่อเปรียบเทียบกับปีที่แล้ว ต้นทุนการผลิตลดลงอย่างมีนัยสำคัญ",
        rom: "mûea-prìap-thîap kàp pii thîi-láeo, tôn-thun kaan-phà-lìt lót-long yàang mii-nai-sǎm-khan",
        vi: "So với năm ngoái, chi phí sản xuất giảm một cách đáng kể.",
        en: "Compared with last year, production costs fell significantly.",
      },
      {
        th: "ในทางตรงกันข้าม รายจ่ายด้านการตลาดกลับเพิ่มสูงขึ้น",
        rom: "nai thaang trong-kan-khâam, raai-jàai dâan kaan-tà-làat klàp phôem sǔung-khûen",
        vi: "Ngược lại, chi phí marketing lại tăng cao hơn.",
        en: "On the contrary, marketing expenditure rose higher.",
      },
      {
        th: "ทั้งสองแนวทางต่างมีข้อดีและข้อเสียที่แตกต่างกัน",
        rom: "tháng-sǒng naeo-thaang tàang mii khôo-dii láe khôo-sǐa thîi tàek-tàang kan",
        vi: "Cả hai hướng đi đều có ưu và nhược điểm khác nhau.",
        en: "Both approaches have their own distinct advantages and disadvantages.",
      },
      {
        th: "ผลลัพธ์ที่ได้แตกต่างจากสมมติฐานเดิมอย่างเห็นได้ชัด",
        rom: "phǒn-láp thîi dâi tàek-tàang jàak sǒm-mút-tì-thǎan doem yàang hěn-dâi-chát",
        vi: "Kết quả thu được khác biệt rõ rệt so với giả thuyết ban đầu.",
        en: "The result obtained differs markedly from the original hypothesis.",
      },
    ],
    vocabulary: [
      { word: "เปรียบเทียบ", rom: "prìap-thîap", vi: "so sánh", en: "to compare", pos: "v." },
      { word: "อย่างมีนัยสำคัญ", rom: "yàang mii-nai-sǎm-khan", vi: "một cách đáng kể (có ý nghĩa thống kê)", en: "significantly", pos: "adv." },
      { word: "ในทางตรงกันข้าม", rom: "nai thaang trong-kan-khâam", vi: "ngược lại", en: "on the contrary", pos: "phr." },
      { word: "แตกต่าง", rom: "tàek-tàang", vi: "khác biệt", en: "to differ", pos: "v." },
      { word: "สมมติฐาน", rom: "sǒm-mút-tì-thǎan", vi: "giả thuyết", en: "hypothesis", pos: "n." },
    ],
    notes_vi:
      "อย่างมีนัยสำคัญ là cụm trang trọng = 'đáng kể/có ý nghĩa', dùng nhiều trong báo cáo và nghiên cứu. Phân biệt với เยอะ/มาก (nhiều, đời thường). ในทางตรงกันข้าม mở câu đối lập toàn phần.",
    notes_en:
      "อย่างมีนัยสำคัญ is a formal phrase = 'significantly', common in reports and research. Contrast it with เยอะ/มาก (a lot, casual). ในทางตรงกันข้าม opens a full contrast.",
    tip_vi:
      "Bậc tương phản: ในทางตรงกันข้าม (đối lập mạnh) > แต่ (nhưng) > ในขณะที่ (trong khi). So sánh số liệu luôn neo bằng เมื่อเปรียบเทียบกับ + mốc (ปีที่แล้ว / ไตรมาสก่อน).",
    tip_en:
      "Contrast strength: ในทางตรงกันข้าม (strong opposition) > แต่ (but) > ในขณะที่ (whereas). Anchor numeric comparisons with เมื่อเปรียบเทียบกับ + a baseline (ปีที่แล้ว / last quarter).",
  },

  // ── 9. Polite disagreement ───────────────────────────────────────────
  {
    id: "th_c1_polite_disagreement",
    level: "C1",
    category: "meeting",
    title_th: "การแสดงความเห็นต่างอย่างสุภาพ",
    title_vi: "Bày tỏ bất đồng một cách lịch sự",
    title_en: "Disagreeing politely",
    sentences: [
      {
        th: "ผมเข้าใจมุมมองของคุณ แต่ขออนุญาตเห็นต่างในบางประเด็น",
        rom: "phǒm khâo-jai mum-moong khǒong khun, tàe khǒo à-nú-yâat hěn-tàang nai baang prà-den",
        vi: "Tôi hiểu quan điểm của anh, nhưng xin phép có ý kiến khác ở một số điểm.",
        en: "I understand your perspective, but allow me to differ on some points.",
      },
      {
        th: "อาจมีอีกแง่มุมหนึ่งที่เราควรนำมาพิจารณาร่วมด้วย",
        rom: "àat mii ìik ngâe-mum nùeng thîi rao khuan nam-maa phí-jaa-rá-naa rûam dûai",
        vi: "Có thể còn một góc nhìn khác mà chúng ta nên cùng cân nhắc.",
        en: "There may be another angle that we should also take into consideration.",
      },
      {
        th: "ดิฉันไม่แน่ใจว่าจะเห็นด้วยกับข้อสรุปนี้ทั้งหมด",
        rom: "dì-chǎn mâi nâe-jai wâa jà hěn-dûai kàp khôo-sà-rùp níi tháng-mòt",
        vi: "Tôi không chắc mình hoàn toàn đồng ý với kết luận này.",
        en: "I'm not sure I fully agree with this conclusion.",
      },
      {
        th: "ทั้งนี้ ผมเชื่อว่าเราสามารถหาจุดร่วมกันได้",
        rom: "tháng-níi, phǒm chûea wâa rao sǎa-mâat hǎa jùt rûam kan dâi",
        vi: "Dù vậy, tôi tin rằng chúng ta có thể tìm được điểm chung.",
        en: "That said, I believe we can find common ground.",
      },
    ],
    vocabulary: [
      { word: "มุมมอง", rom: "mum-moong", vi: "quan điểm, góc nhìn", en: "perspective", pos: "n." },
      { word: "เห็นต่าง", rom: "hěn-tàang", vi: "có ý kiến khác, bất đồng", en: "to disagree / hold a different view", pos: "v." },
      { word: "แง่มุม", rom: "ngâe-mum", vi: "góc độ, khía cạnh", en: "angle / aspect", pos: "n." },
      { word: "พิจารณา", rom: "phí-jaa-rá-naa", vi: "cân nhắc, xem xét", en: "to consider", pos: "v." },
      { word: "จุดร่วม", rom: "jùt rûam", vi: "điểm chung", en: "common ground", pos: "n." },
    ],
    notes_vi:
      "Văn hóa Thái coi trọng giữ thể diện (เกรงใจ). Bất đồng phải 'gói' trong sự đồng tình trước: เข้าใจ...แต่ขออนุญาตเห็นต่าง. Tránh phủ định thẳng ไม่เห็นด้วย không có đệm — dễ làm mất mặt.",
    notes_en:
      "Thai culture prizes face-saving (เกรงใจ). Disagreement must be wrapped in prior agreement: เข้าใจ…แต่ขออนุญาตเห็นต่าง. Avoid a bare ไม่เห็นด้วย (I disagree) — it risks causing loss of face.",
    tip_vi:
      "Công thức 3 nhịp: (1) công nhận (เข้าใจมุมมองของคุณ) → (2) nêu khác biệt nhẹ (ขออนุญาตเห็นต่าง / ไม่แน่ใจว่า...) → (3) hướng tới hợp tác (หาจุดร่วม). ขออนุญาต làm câu phản đối mềm hẳn.",
    tip_en:
      "Three-beat formula: (1) acknowledge (เข้าใจมุมมองของคุณ) → (2) soft-flag the difference (ขออนุญาตเห็นต่าง / ไม่แน่ใจว่า…) → (3) reach for cooperation (หาจุดร่วม). ขออนุญาต softens the pushback markedly.",
  },

  // ── 10. Recommendations & proposals ──────────────────────────────────
  {
    id: "th_c1_recommendations",
    level: "C1",
    category: "professional_writing",
    title_th: "การเสนอแนะและข้อเสนอ",
    title_vi: "Khuyến nghị và đề xuất",
    title_en: "Recommendations and proposals",
    sentences: [
      {
        th: "ข้าพเจ้าขอเสนอแนะให้ทบทวนนโยบายการจัดซื้อใหม่ทั้งหมด",
        rom: "khâa-phá-jâo khǒo sà-nǒe-náe hâi tóp-thuan ná-yoo-baai kaan-jàt-súue mài tháng-mòt",
        vi: "Tôi xin khuyến nghị rà soát lại toàn bộ chính sách mua sắm.",
        en: "I would recommend reviewing the entire procurement policy anew.",
      },
      {
        th: "แนวทางที่เหมาะสมที่สุดคือการดำเนินการอย่างค่อยเป็นค่อยไป",
        rom: "naeo-thaang thîi mòo-sǒm thîi-sùt khuue kaan-dam-noen-kaan yàang khôi-pen-khôi-pai",
        vi: "Hướng đi phù hợp nhất là triển khai một cách từng bước.",
        en: "The most suitable approach is to proceed gradually.",
      },
      {
        th: "หากดำเนินการตามข้อเสนอนี้ จะช่วยลดต้นทุนในระยะยาว",
        rom: "hàak dam-noen-kaan taam khôo-sà-nǒe níi, jà chûai lót tôn-thun nai rá-yá-yaao",
        vi: "Nếu triển khai theo đề xuất này, sẽ giúp giảm chi phí về dài hạn.",
        en: "If this proposal is implemented, it will help reduce costs in the long run.",
      },
      {
        th: "จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติตามที่เห็นสมควร",
        rom: "jueng rian maa phûea pròot phí-jaa-rá-naa à-nú-mát taam thîi hěn sǒm-khuan",
        vi: "Kính trình để quý vị xem xét phê duyệt nếu thấy hợp lý.",
        en: "Submitted for your consideration and approval as deemed appropriate.",
      },
    ],
    vocabulary: [
      { word: "ข้าพเจ้า", rom: "khâa-phá-jâo", vi: "tôi (trang trọng, văn bản)", en: "I (very formal, written)", pos: "pron." },
      { word: "เสนอแนะ", rom: "sà-nǒe-náe", vi: "khuyến nghị, đề xuất", en: "to recommend", pos: "v." },
      { word: "ค่อยเป็นค่อยไป", rom: "khôi-pen-khôi-pai", vi: "từng bước, dần dần", en: "gradually / step by step", pos: "adv." },
      { word: "อนุมัติ", rom: "à-nú-mát", vi: "phê duyệt", en: "to approve", pos: "v." },
      { word: "ตามที่เห็นสมควร", rom: "taam thîi hěn sǒm-khuan", vi: "tùy theo xét thấy hợp lý", en: "as deemed appropriate", pos: "phr." },
    ],
    notes_vi:
      "ข้าพเจ้า là đại từ 'tôi' trang trọng nhất, chỉ dùng trong văn bản chính thức (tờ trình, đơn). เสนอแนะ + ให้ + động từ = 'khuyến nghị làm gì'. Câu kết tờ trình cố định: จึงเรียนมาเพื่อโปรดพิจารณา.",
    notes_en:
      "ข้าพเจ้า is the most formal 'I', used only in official documents (memos, applications). เสนอแนะ + ให้ + verb = 'recommend doing'. The fixed closing for a memo: จึงเรียนมาเพื่อโปรดพิจารณา.",
    tip_vi:
      "Cấu trúc đề xuất: nêu khuyến nghị (เสนอแนะ) → lý do/lợi ích có điều kiện (หาก...จะช่วย...) → câu kết xin duyệt. Dùng หาก (nếu, trang trọng) thay ถ้า (đời thường) trong văn bản.",
    tip_en:
      "Proposal structure: state the recommendation (เสนอแนะ) → conditional benefit (หาก…จะช่วย…) → closing request for approval. Use หาก (formal 'if') over ถ้า (casual) in writing.",
  },

  // ── 11. Cause, effect & consequence ──────────────────────────────────
  {
    id: "th_c1_cause_effect",
    level: "C1",
    category: "structured_argument",
    title_th: "เหตุ ผล และผลกระทบ",
    title_vi: "Nguyên nhân, kết quả và tác động",
    title_en: "Cause, effect, and consequence",
    sentences: [
      {
        th: "ปัญหาดังกล่าวอันเป็นผลมาจากการขาดการวางแผนที่รัดกุม",
        rom: "pan-hǎa dang-klàao an-pen-phǒn maa jàak kaan-khàat kaan-waang-phǎen thîi rát-kum",
        vi: "Vấn đề nói trên là hệ quả của việc thiếu kế hoạch chặt chẽ.",
        en: "The said problem results from a lack of rigorous planning.",
      },
      {
        th: "การเปลี่ยนแปลงนโยบายส่งผลให้ต้นทุนการดำเนินงานสูงขึ้น",
        rom: "kaan-plìan-plaeng ná-yoo-baai sòng-phǒn hâi tôn-thun kaan-dam-noen-ngaan sǔung-khûen",
        vi: "Việc thay đổi chính sách dẫn đến chi phí vận hành tăng lên.",
        en: "The policy change resulted in higher operating costs.",
      },
      {
        th: "ปัจจัยหลักที่ทำให้เกิดความล่าช้าคือกระบวนการอนุมัติที่ซับซ้อน",
        rom: "pàt-jai làk thîi tham-hâi-kòet khwaam-lâa-cháa khuue krà-buan-kaan à-nú-mát thîi sáp-sóon",
        vi: "Yếu tố chính gây ra sự chậm trễ là quy trình phê duyệt phức tạp.",
        en: "The main factor causing the delay is the complex approval process.",
      },
      {
        th: "หากปราศจากการแก้ไข ย่อมส่งผลกระทบต่อความน่าเชื่อถือขององค์กร",
        rom: "hàak pràat-sà-jàak kaan-kâe-khǎi, yôom sòng-phǒn-krà-thóp tòo khwaam-nâa-chûea-thǔue khǒong ong-kon",
        vi: "Nếu không khắc phục, tất yếu sẽ ảnh hưởng đến uy tín của tổ chức.",
        en: "Without correction, it will inevitably affect the organization's credibility.",
      },
    ],
    vocabulary: [
      { word: "อันเป็นผลมาจาก", rom: "an-pen-phǒn maa jàak", vi: "là hệ quả từ", en: "as a result of", pos: "phr." },
      { word: "ส่งผลให้", rom: "sòng-phǒn hâi", vi: "dẫn đến, làm cho", en: "to result in", pos: "v." },
      { word: "ปัจจัย", rom: "pàt-jai", vi: "yếu tố", en: "factor", pos: "n." },
      { word: "ปราศจาก", rom: "pràat-sà-jàak", vi: "thiếu vắng, không có", en: "without / devoid of", pos: "prep." },
      { word: "ย่อม", rom: "yôom", vi: "tất yếu, ắt hẳn", en: "inevitably / would naturally", pos: "adv." },
    ],
    notes_vi:
      "Chuỗi nhân quả trang trọng: อันเป็นผลมาจาก (hệ quả từ — nhìn về nguyên nhân) ↔ ส่งผลให้ (dẫn đến — nhìn về kết quả). ย่อม đứng trước động từ diễn đạt tính tất yếu logic, mang sắc thái văn viết.",
    notes_en:
      "Formal causal chain: อันเป็นผลมาจาก (results from — looks back to the cause) ↔ ส่งผลให้ (results in — looks forward to the effect). ย่อม before a verb conveys logical inevitability, a written-register touch.",
    tip_vi:
      "Câu điều kiện-hậu quả mạnh: หาก + (không hành động) + ย่อม + ผลกระทบ. Ví dụ: หากปราศจากการแก้ไข ย่อมส่งผลกระทบต่อ... — công thức cảnh báo rủi ro trong báo cáo.",
    tip_en:
      "Strong conditional-consequence pattern: หาก + (inaction) + ย่อม + impact. E.g. หากปราศจากการแก้ไข ย่อมส่งผลกระทบต่อ… — the standard risk-warning formula in reports.",
  },

  // ── 12. Conclusions & next steps ─────────────────────────────────────
  {
    id: "th_c1_conclusions_next_steps",
    level: "C1",
    category: "presentation",
    title_th: "การสรุปและขั้นตอนต่อไป",
    title_vi: "Kết luận và các bước tiếp theo",
    title_en: "Conclusions and next steps",
    sentences: [
      {
        th: "โดยสรุป ประเด็นสำคัญที่ได้นำเสนอไปมีดังต่อไปนี้",
        rom: "dooi sà-rùp, prà-den sǎm-khan thîi dâi námsànǒe pai mii dang-tòo-pai-níi",
        vi: "Tóm lại, các điểm quan trọng đã trình bày như sau.",
        en: "In conclusion, the key points presented are as follows.",
      },
      {
        th: "ขั้นตอนต่อไปคือการจัดทำแผนปฏิบัติการอย่างเป็นรูปธรรม",
        rom: "khân-toon tòo-pai khuue kaan-jàt-tham phǎen-pà-tì-bàt-kaan yàang pen rûup-pà-tham",
        vi: "Bước tiếp theo là lập kế hoạch hành động một cách cụ thể.",
        en: "The next step is to draw up a concrete action plan.",
      },
      {
        th: "เราจะติดตามผลและรายงานความคืบหน้าเป็นระยะ",
        rom: "rao jà tìt-taam phǒn láe raai-ngaan khwaam-khûep-nâa pen rá-yá",
        vi: "Chúng tôi sẽ theo dõi kết quả và báo cáo tiến độ theo từng giai đoạn.",
        en: "We will follow up on the results and report progress periodically.",
      },
      {
        th: "ขอขอบคุณทุกท่านสำหรับความร่วมมือและการรับฟังอย่างตั้งใจ",
        rom: "khǒo khòop-khun thúk thân sǎm-ràp khwaam-rûam-muue láe kaan-ráp-fang yàang tâng-jai",
        vi: "Xin cảm ơn quý vị đã hợp tác và lắng nghe chăm chú.",
        en: "Thank you all for your cooperation and your attentive listening.",
      },
    ],
    vocabulary: [
      { word: "ดังต่อไปนี้", rom: "dang-tòo-pai-níi", vi: "như sau", en: "as follows", pos: "phr." },
      { word: "ขั้นตอน", rom: "khân-toon", vi: "bước, công đoạn", en: "step / stage", pos: "n." },
      { word: "เป็นรูปธรรม", rom: "pen rûup-pà-tham", vi: "cụ thể, hữu hình", en: "concrete / tangible", pos: "adj." },
      { word: "ติดตามผล", rom: "tìt-taam phǒn", vi: "theo dõi kết quả, follow-up", en: "to follow up", pos: "v." },
      { word: "ความคืบหน้า", rom: "khwaam-khûep-nâa", vi: "tiến độ", en: "progress", pos: "n." },
    ],
    notes_vi:
      "Kết bài C1 không 'lặp lại' mà 'tổng hợp + chỉ đường': โดยสรุป → ขั้นตอนต่อไป → cảm ơn. ดังต่อไปนี้ báo hiệu một danh sách sắp liệt kê. เป็นรูปธรรม (cụ thể) đối lập với เป็นนามธรรม (trừu tượng).",
    notes_en:
      "A C1 closing doesn't merely repeat — it synthesizes and points forward: โดยสรุป → ขั้นตอนต่อไป → thanks. ดังต่อไปนี้ signals a list to come. เป็นรูปธรรม (concrete) contrasts with เป็นนามธรรม (abstract).",
    tip_vi:
      "Đóng bài 3 phần: (1) tóm tắt điểm chính (โดยสรุป...ดังต่อไปนี้) → (2) nêu hành động tiếp theo (ขั้นตอนต่อไป) → (3) cảm ơn trang trọng (ขอขอบคุณ...สำหรับความร่วมมือ). Đừng kết bằng câu xin lỗi thừa.",
    tip_en:
      "Close in three parts: (1) recap the key points (โดยสรุป…ดังต่อไปนี้) → (2) state the next action (ขั้นตอนต่อไป) → (3) thank formally (ขอขอบคุณ…สำหรับความร่วมมือ). Don't end on a needless apology.",
  },
];

export default lessons;
