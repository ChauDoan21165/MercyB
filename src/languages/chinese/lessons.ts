// src/languages/chinese/lessons.ts
//
// Five starter lessons for Vietnamese learners of Mandarin Chinese.
// Covers: pinyin system, tones, greetings, numbers, basic radicals.
// Lesson shape mirrors the hospitality profession-pack pattern with
// bilingual sentences and practical teaching notes in Vietnamese.
//
// Content is hand-crafted from HSK prep materials and classroom
// experience with Vietnamese learners of Chinese.

export type ChineseLessonSentence = {
  chinese: string;
  pinyin: string;
  en: string;
  vi: string;
  note_vi?: string;
};

export type ChineseLesson = {
  id: string;
  title_vi: string;
  title_en: string;
  intro_vi: string;
  sentences: ChineseLessonSentence[];
  grammar_notes_vi: string[];
  practice_tip_vi: string;
};

const CHINESE_LESSONS: ChineseLesson[] = [
  // ================================================================
  // Lesson 1 — Pinyin
  // ================================================================
  {
    id: "zh-pinyin",
    title_vi: "Bảng Pinyin — học phát âm chuẩn từ đầu",
    title_en: "Pinyin — mastering pronunciation from the start",
    intro_vi:
      "Pinyin là hệ thống phiên âm tiếng Trung bằng chữ Latin. Học pinyin ĐÚNG từ đầu là điều kiện tiên quyết — nếu phát âm sai từ đầu, sửa lại mất thời gian gấp 3. Người Việt có lợi thế: nhiều âm pinyin gần giống tiếng Việt. Nhưng cũng có nhiều 'bẫy' — những âm tưởng giống mà thực ra khác.",
    sentences: [
      {
        chinese: "b",
        pinyin: "b [p]",
        en: "unaspirated p — like 'p' in 'spy'",
        vi: "Âm 'p' không bật hơi — giống 'p' tiếng Việt hơn là 'b'",
        note_vi: "Để tay trước miệng — KHÔNG được có luồng hơi bật ra. Khác hẳn 'b' tiếng Anh.",
      },
      {
        chinese: "p",
        pinyin: "p [pʰ]",
        en: "aspirated p — like 'p' in 'pie'",
        vi: "Âm 'p' bật hơi mạnh — giống 'p' + 'h'",
        note_vi: "Để tay trước miệng — PHẢI có luồng hơi mạnh. Người Việt hay nhầm pinyin 'b' và 'p'.",
      },
      {
        chinese: "d",
        pinyin: "d [t]",
        en: "unaspirated t — like 't' in 'stop'",
        vi: "Âm 't' không bật hơi — gần 't' tiếng Việt",
        note_vi: "Giống 't' tiếng Việt, không phải 'đ'. Đầu lưỡi chạm chân răng trên.",
      },
      {
        chinese: "t",
        pinyin: "t [tʰ]",
        en: "aspirated t — like 't' in 'top'",
        vi: "Âm 't' bật hơi mạnh",
        note_vi: "Luồng hơi mạnh hơn 'th' tiếng Việt nhiều. Cảm giác như 'tờ-hờ' nối nhanh.",
      },
      {
        chinese: "g",
        pinyin: "g [k]",
        en: "unaspirated k — like 'k' in 'sky'",
        vi: "Âm 'k' không bật hơi — gần 'c/k' tiếng Việt",
        note_vi: "Giống 'c' tiếng Việt. Không rung dây thanh như 'g' tiếng Anh.",
      },
      {
        chinese: "k",
        pinyin: "k [kʰ]",
        en: "aspirated k — like 'k' in 'key'",
        vi: "Âm 'k' bật hơi mạnh",
        note_vi: "Bật hơi mạnh, khác 'kh' tiếng Việt — 'kh' Việt phát từ họng sâu hơn.",
      },
      {
        chinese: "zh",
        pinyin: "zh [ʈʂ]",
        en: "retroflex — tongue curled back",
        vi: "Âm cong lưỡi — đầu lưỡi chạm vòm trên",
        note_vi: "Đây là âm KHÔNG có trong tiếng Việt. Cong lưỡi lên, chạm vòm trên, không bật hơi.",
      },
      {
        chinese: "ch",
        pinyin: "ch [ʈʂʰ]",
        en: "retroflex aspirated",
        vi: "Âm cong lưỡi bật hơi",
        note_vi: "Giống 'zh' nhưng bật hơi mạnh. VN hay đọc thành 'tr' — sai vì 'tr' không cong lưỡi đủ.",
      },
      {
        chinese: "sh",
        pinyin: "sh [ʂ]",
        en: "retroflex fricative",
        vi: "Âm cong lưỡi xì",
        note_vi: "Cong lưỡi lên, để khe hẹp, đẩy hơi qua. Không phải 's' — sai hoàn toàn.",
      },
      {
        chinese: "r",
        pinyin: "r [ɻ]",
        en: "retroflex r — buzzy sound",
        vi: "Âm 'r' cong lưỡi — gần 'r' tiếng Anh Mỹ",
        note_vi: "Không phải 'r' tiếng Việt (rung lưỡi) hay 'z' tiếng Việt. Cong lưỡi, để hơi qua khe hẹp.",
      },
      {
        chinese: "j",
        pinyin: "j [tɕ]",
        en: "palatal — tongue against palate",
        vi: "Âm mặt lưỡi chạm vòm miệng",
        note_vi: "Mặt lưỡi (không phải đầu lưỡi) chạm vòm miệng cứng. Gần 'ch' nhưng mềm hơn.",
      },
      {
        chinese: "q",
        pinyin: "q [tɕʰ]",
        en: "palatal aspirated",
        vi: "Âm mặt lưỡi bật hơi",
        note_vi: "Giống 'j' nhưng bật hơi mạnh. VN hay đọc thành 'ch' bình thường — thiếu mặt lưỡi.",
      },
      {
        chinese: "x",
        pinyin: "x [ɕ]",
        en: "palatal fricative",
        vi: "Âm xì mặt lưỡi",
        note_vi: "Gần 'x' tiếng Việt nhưng mặt lưỡi nâng cao hơn. Đầu lưỡi để sau răng dưới.",
      },
      {
        chinese: "z",
        pinyin: "z [ts]",
        en: "unaspirated ts",
        vi: "Âm 'ch' không bật hơi",
        note_vi: "Đầu lưỡi sau răng trên, không bật hơi. Gần 'ch' tiếng Việt nhưng vị trí lưỡi khác.",
      },
      {
        chinese: "c",
        pinyin: "c [tsʰ]",
        en: "aspirated ts",
        vi: "Âm 'ch' bật hơi mạnh",
        note_vi: "Giống 'z' nhưng bật hơi. Giống 'x' tiếng Việt? Không — 'x' Việt là âm xì, 'c' là tắc + xì.",
      },
    ],
    grammar_notes_vi: [
      "Quy tắc quan trọng nhất: bật hơi vs không bật hơi. Đây là ranh giới giữa phát âm chuẩn và sai hoàn toàn.",
      "Các cặp dễ nhầm cho người Việt: b/p, d/t, g/k, j/q, z/c, zh/ch.",
      "Sh/zh/ch/r là 4 âm cong lưỡi (retroflex) — không có âm tương đương trong tiếng Việt, phải tập riêng.",
      "J/q/x là 3 âm mặt lưỡi (palatal) — chỉ đứng trước i hoặc ü, không bao giờ đứng trước a/o/e.",
    ],
    practice_tip_vi:
      "Tập từng cặp b-p, d-t, g-k trước gương + tay trước miệng để kiểm tra hơi. Sau đó tập 4 âm cong lưỡi (zh-ch-sh-r) với đầu lưỡi cong lên chạm vòm — dùng que/đũa đè lưỡi nếu cần.",
  },

  // ================================================================
  // Lesson 2 — Tones
  // ================================================================
  {
    id: "zh-tones",
    title_vi: "4 thanh điệu — linh hồn của tiếng Trung",
    title_en: "The 4 tones — the soul of Chinese",
    intro_vi:
      "Tiếng Trung có 4 thanh chính + 1 thanh nhẹ. Sai thanh = sai nghĩa hoàn toàn. Ví dụ: mā (mẹ) vs mǎ (ngựa) vs mà (mắng). Người Việt có lợi thế vì tiếng Việt cũng có thanh điệu, nhưng KHÔNG GIỐNG — thanh tiếng Trung khác biệt về cao độ và đường nét.",
    sentences: [
      {
        chinese: "妈 (mẹ)",
        pinyin: "mā",
        en: "mother — 1st tone (high, level)",
        vi: "mẹ — thanh 1 (cao, ngang)",
        note_vi: "Giống thanh ngang tiếng Việt nhưng CAO hơn. Giữ cao đều, không tụt xuống.",
      },
      {
        chinese: "麻 (gai)",
        pinyin: "má",
        en: "hemp — 2nd tone (rising)",
        vi: "cây gai — thanh 2 (lên)",
        note_vi: "Giống dấu sắc nhưng lên từ giữa lên cao — không lên từ thấp như sắc Việt.",
      },
      {
        chinese: "马 (ngựa)",
        pinyin: "mǎ",
        en: "horse — 3rd tone (low-dipping)",
        vi: "ngựa — thanh 3 (thấp-xuống-lên)",
        note_vi: "Khó nhất! Hạ giọng thấp rồi lên nhẹ. Giống dấu hỏi Việt nhưng thấp hơn và dài hơn.",
      },
      {
        chinese: "骂 (mắng)",
        pinyin: "mà",
        en: "to scold — 4th tone (falling)",
        vi: "mắng — thanh 4 (xuống)",
        note_vi: "Giống dấu nặng nhưng rơi mạnh, ngắn, dứt khoát — như ra lệnh.",
      },
      {
        chinese: "吗 (không?)",
        pinyin: "ma",
        en: "question particle — neutral tone",
        vi: "từ hỏi — thanh nhẹ",
        note_vi: "Không có thanh — đọc nhẹ, ngắn, không nhấn. Giống âm lướt trong tiếng Việt.",
      },
      {
        chinese: "你好",
        pinyin: "ní hǎo",
        en: "Hello — tone sandhi: 3+3 → 2+3",
        vi: "Xin chào — biến thanh: 3+3 → 2+3",
        note_vi: "Khi hai thanh 3 đứng liền, thanh 3 đầu biến thành thanh 2. Đây là quy tắc BẮT BUỘC.",
      },
      {
        chinese: "一个",
        pinyin: "yí gè",
        en: "one (of something) — 一 tone change",
        vi: "một cái — 一 biến thanh",
        note_vi: "一 (yī) trước thanh 4 → đọc yí (thanh 2). Trước 1/2/3 → đọc yì (thanh 4).",
      },
      {
        chinese: "不贵",
        pinyin: "bú guì",
        en: "not expensive — 不 tone change",
        vi: "không đắt — 不 biến thanh",
        note_vi: "不 (bù) trước thanh 4 → đọc bú (thanh 2). Trước 1/2/3 giữ nguyên bù.",
      },
      {
        chinese: "老师好",
        pinyin: "lǎoshī hǎo",
        en: "Hello teacher",
        vi: "Chào thầy/cô",
        note_vi: "lǎo (3) + shī (1) + hǎo (3). Ba thanh khác nhau liên tiếp — tập nói chậm từng chữ.",
      },
      {
        chinese: "我去学校",
        pinyin: "wǒ qù xuéxiào",
        en: "I go to school",
        vi: "Tôi đi học",
        note_vi: "wǒ (3) + qù (4) + xué (2) + xiào (4). 4 thanh trong 4 chữ — luyện phối hợp.",
      },
    ],
    grammar_notes_vi: [
      "Thanh 1 (¯): cao 5/5, ngang, đều — giống máy bay bay thẳng ở độ cao 35,000 ft.",
      "Thanh 2 (´): từ 3/5 lên 5/5 — giống giọng hỏi 'Hả?' trong tiếng Việt nhưng dài hơn.",
      "Thanh 3 (ˇ): từ 2/5 xuống 1/5 rồi lên 4/5 — VN hay chỉ xuống mà quên lên, hoặc lên quá sớm.",
      "Thanh 4 (`): từ 5/5 xuống 1/5 mạnh và ngắn — như quát 'Không!'.",
      "Thanh nhẹ: không có ký hiệu — ngắn, nhẹ, cao độ phụ thuộc thanh trước đó.",
      "Biến thanh (tone sandhi) là QUY TẮC, không phải ngoại lệ. Ai không biến thanh là nói sai.",
    ],
    practice_tip_vi:
      "Tập 4 thanh với âm 'ma': mā-má-mǎ-mà. Làm chậm, dùng tay vẽ đường thanh trong không khí. Sau đó ghép cặp: 1-1, 1-2, 1-3, 1-4... rồi 2-1, 2-2... Mỗi ngày 5 phút trong 2 tuần.",
  },

  // ================================================================
  // Lesson 3 — Greetings
  // ================================================================
  {
    id: "zh-greetings",
    title_vi: "Chào hỏi tiếng Trung — từ 'ni hao' đến hội thoại thật",
    title_en: "Chinese greetings — beyond 'ni hao'",
    intro_vi:
      "Người Trung Quốc không chào hỏi giống Tây — 'nǐ hǎo' ít được dùng giữa bạn bè thân. Người ta hỏi 'ăn chưa?' (吃了吗), 'đi đâu đấy?' (去哪儿), hay đơn giản gọi tên. Bài này dạy cách chào hỏi thực tế trong đời sống Trung Quốc.",
    sentences: [
      {
        chinese: "你好！",
        pinyin: "Nǐ hǎo!",
        en: "Hello! (standard)",
        vi: "Xin chào! (chuẩn)",
        note_vi: "Dùng với người lạ, môi trường công sở, lần đầu gặp. Ít dùng giữa bạn thân.",
      },
      {
        chinese: "您好！",
        pinyin: "Nín hǎo!",
        en: "Hello! (respectful)",
        vi: "Chào ngài/chị ạ! (kính ngữ)",
        note_vi: "Dùng với người lớn tuổi, sếp, khách hàng. 您 (nín) là dạng kính ngữ của 你.",
      },
      {
        chinese: "大家好！",
        pinyin: "Dàjiā hǎo!",
        en: "Hello everyone!",
        vi: "Chào mọi người!",
        note_vi: "Dùng khi bước vào phòng đông người, bắt đầu bài thuyết trình.",
      },
      {
        chinese: "早上好！",
        pinyin: "Zǎoshang hǎo!",
        en: "Good morning!",
        vi: "Chào buổi sáng!",
        note_vi: "早上 (zǎoshang) = buổi sáng sớm. Có thể nói gọn: 早！(Zǎo!)",
      },
      {
        chinese: "晚上好！",
        pinyin: "Wǎnshang hǎo!",
        en: "Good evening!",
        vi: "Chào buổi tối!",
        note_vi: "晚上 (wǎnshang) = buổi tối. Không có 'good afternoon' riêng — dùng 下午好 (xiàwǔ hǎo).",
      },
      {
        chinese: "你叫什么名字？",
        pinyin: "Nǐ jiào shénme míngzi?",
        en: "What's your name?",
        vi: "Bạn tên là gì?",
        note_vi: "叫 (jiào) = gọi là. 什么 (shénme) = cái gì. Câu này dịch sát là 'Bạn gọi là tên gì?'",
      },
      {
        chinese: "我叫...",
        pinyin: "Wǒ jiào...",
        en: "My name is...",
        vi: "Tôi tên là...",
      },
      {
        chinese: "你是哪国人？",
        pinyin: "Nǐ shì nǎ guó rén?",
        en: "What country are you from?",
        vi: "Bạn là người nước nào?",
        note_vi: "哪 (nǎ) = nào. 国 (guó) = nước/quốc gia. Trả lời: 我是越南人 (Wǒ shì Yuènán rén).",
      },
      {
        chinese: "认识你很高兴！",
        pinyin: "Rènshi nǐ hěn gāoxìng!",
        en: "Nice to meet you!",
        vi: "Rất vui được quen bạn!",
        note_vi: "认识 (rènshi) = quen biết. 高兴 (gāoxìng) = vui. Có thể nói gọn: 很高兴认识你！",
      },
      {
        chinese: "你吃了吗？",
        pinyin: "Nǐ chī le ma?",
        en: "Have you eaten? (casual greeting)",
        vi: "Ăn cơm chưa? (chào hỏi thân mật)",
        note_vi: "Đây là câu chào phổ biến NHẤT ở Trung Quốc giữa người quen. Không phải câu hỏi thật, chỉ là 'hello'.",
      },
      {
        chinese: "你去哪儿？",
        pinyin: "Nǐ qù nǎr?",
        en: "Where are you going? (casual greeting)",
        vi: "Đi đâu đấy? (chào hỏi thân mật)",
        note_vi: "Cũng là kiểu chào, không cần trả lời chi tiết. Trả lời: 出去一下 (ra ngoài một lát).",
      },
      {
        chinese: "再见！",
        pinyin: "Zàijiàn!",
        en: "Goodbye!",
        vi: "Tạm biệt!",
      },
      {
        chinese: "慢走！",
        pinyin: "Màn zǒu!",
        en: "Take care! (lit. 'walk slowly')",
        vi: "Đi cẩn thận nhé!",
        note_vi: "Câu tiễn khách/chủ nhà nói với khách ra về. Rất phổ biến, thể hiện sự quan tâm.",
      },
      {
        chinese: "明天见！",
        pinyin: "Míngtiān jiàn!",
        en: "See you tomorrow!",
        vi: "Ngày mai gặp lại!",
      },
    ],
    grammar_notes_vi: [
      "Người Trung Quốc phân biệt rõ ngữ cảnh trang trọng (您/nín) và thân mật (你/nǐ). Dùng sai gây khó chịu.",
      "Chào hỏi kiểu Trung Quốc thường là hỏi về hành động đang/sắp làm (ăn cơm chưa, đi đâu đấy) — không phải hỏi để lấy thông tin.",
      "Câu kết thúc với 吗 (ma) là câu hỏi yes/no. Thêm 吗 vào cuối câu trần thuật là được.",
      "Trật tự câu cơ bản: Chủ ngữ + Động từ + Tân ngữ. Giống tiếng Việt — may mắn cho người Việt.",
    ],
    practice_tip_vi:
      "Tập 4 tình huống: (1) gặp người lạ, (2) gặp sếp/người lớn tuổi, (3) gặp bạn thân, (4) tạm biệt. Tự nói cả hai vai. Ghi âm, nghe lại, so với giọng chuẩn trên YouTube/HelloChinese.",
  },

  // ================================================================
  // Lesson 4 — Numbers
  // ================================================================
  {
    id: "zh-numbers",
    title_vi: "Số đếm và đếm đồ vật",
    title_en: "Numbers and measure words",
    intro_vi:
      "Số đếm tiếng Trung khá đơn giản — dùng hệ thập phân, ghép logic. Nhưng có hai khó: (1) measure words (量词 — phải có giữa số và danh từ) và (2) biến thanh của 一 (yī) và 不 (bù). Bài này dạy số đếm 1-9999 và các measure word cơ bản.",
    sentences: [
      {
        chinese: "一二三四五六七八九十",
        pinyin: "yī èr sān sì wǔ liù qī bā jiǔ shí",
        en: "1 2 3 4 5 6 7 8 9 10",
        vi: "một hai ba bốn năm sáu bảy tám chín mười",
        note_vi: "Học thuộc 1-10 như 'bài hát' trước khi học bất cứ thứ gì khác về số.",
      },
      {
        chinese: "十一",
        pinyin: "shíyī",
        en: "eleven (10 + 1)",
        vi: "mười một",
        note_vi: "Logic: 10 + 1. 12 = 十二 (shí'èr), 13 = 十三 (shísān), v.v.",
      },
      {
        chinese: "二十",
        pinyin: "èrshí",
        en: "twenty (2 × 10)",
        vi: "hai mươi",
        note_vi: "Logic: 2 × 10. 30 = 三十 (sānshí), 99 = 九十九 (jiǔshíjiǔ).",
      },
      {
        chinese: "一百",
        pinyin: "yībǎi",
        en: "one hundred",
        vi: "một trăm",
        note_vi: "百 (bǎi) = trăm. 250 = 二百五十 (èrbǎi wǔshí).",
      },
      {
        chinese: "一千",
        pinyin: "yīqiān",
        en: "one thousand",
        vi: "một nghìn",
        note_vi: "千 (qiān) = nghìn. Đếm đến 9999: 九千九百九十九 (jiǔqiān jiǔbǎi jiǔshíjiǔ).",
      },
      {
        chinese: "一个苹果",
        pinyin: "yí gè píngguǒ",
        en: "one apple",
        vi: "một quả táo",
        note_vi: "个 (gè) là measure word phổ biến nhất. Dùng cho người và hầu hết đồ vật.",
      },
      {
        chinese: "两本书",
        pinyin: "liǎng běn shū",
        en: "two books",
        vi: "hai quyển sách",
        note_vi: "本 (běn) = measure word cho sách/vở. 两 (liǎng) là 'hai' khi đếm đồ vật, không dùng 二 (èr).",
      },
      {
        chinese: "三杯水",
        pinyin: "sān bēi shuǐ",
        en: "three cups of water",
        vi: "ba cốc nước",
        note_vi: "杯 (bēi) = cốc/ly. Pattern: SỐ + MEASURE WORD + DANH TỪ.",
      },
      {
        chinese: "多少钱？",
        pinyin: "Duōshao qián?",
        en: "How much money?",
        vi: "Bao nhiêu tiền?",
        note_vi: "多少 (duōshao) = bao nhiêu. 钱 (qián) = tiền.",
      },
      {
        chinese: "十块钱",
        pinyin: "shí kuài qián",
        en: "ten yuan / ten bucks",
        vi: "mười tệ",
        note_vi: "块 (kuài) = measure word cho tiền (khẩu ngữ). Trang trọng: 元 (yuán).",
      },
      {
        chinese: "五个人",
        pinyin: "wǔ gè rén",
        en: "five people",
        vi: "năm người",
        note_vi: "Dùng 个 cho người trong hầu hết trường hợp. Trang trọng: 位 (wèi).",
      },
      {
        chinese: "你家有几口人？",
        pinyin: "Nǐ jiā yǒu jǐ kǒu rén?",
        en: "How many people in your family?",
        vi: "Nhà bạn có mấy người?",
        note_vi: "口 (kǒu) = measure word cho thành viên gia đình. 几 (jǐ) = mấy (dưới 10).",
      },
    ],
    grammar_notes_vi: [
      "SỐ + MEASURE WORD + DANH TỪ là cấu trúc bắt buộc. Không bao giờ nói 'một sách' (一本书, không phải 一书).",
      "Hai = 二 (èr) khi đếm số, nhưng = 两 (liǎng) khi đếm đồ vật + measure word. Đây là lỗi phổ biến nhất.",
      "100, 1,000, 10,000: tiếng Trung cần số 1 đứng trước (一百, không nói 百). Nhưng 10 = 十, không phải 一十.",
      "Tiền tệ: 块 (kuài) khẩu ngữ, 元 (yuán) văn bản. 毛 (máo) = hào, 分 (fēn) = xu.",
      "Số điện thoại: 一 đọc là yāo (không phải yī) để tránh nhầm với 七 (qī).",
    ],
    practice_tip_vi:
      "Đọc to số từ 1-99 mỗi ngày. Sau đó đọc số nhà, số điện thoại, giá tiền. Đến siêu thị Trung Quốc/Đài Loan: đọc giá từng món bằng tiếng Trung.",
  },

  // ================================================================
  // Lesson 5 — Basic radicals
  // ================================================================
  {
    id: "zh-radicals",
    title_vi: "Bộ thủ cơ bản — chìa khóa đọc chữ Hán",
    title_en: "Basic radicals — the key to reading characters",
    intro_vi:
      "Người Việt học chữ Hán có lợi thế cực lớn: 60% từ Hán-Việt trùng nghĩa với tiếng Trung! Học bộ thủ (部首) giúp bạn đoán nghĩa và tra từ điển. Có 214 bộ thủ, nhưng 20 bộ phổ biến nhất chiếm ~80% chữ bạn gặp. Bài này dạy 12 bộ thủ cơ bản nhất.",
    sentences: [
      {
        chinese: "人 (亻)",
        pinyin: "rén",
        en: "person radical — 'người'",
        vi: "Bộ nhân/nhân đứng — người",
        note_vi: "Khi làm bộ thủ bên trái: 亻. Các chữ: 你 (bạn), 他 (anh ấy), 们 (số nhiều), 休 (nghỉ ngơi).",
      },
      {
        chinese: "水 (氵)",
        pinyin: "shuǐ",
        en: "water radical — 'nước'",
        vi: "Bộ thủy/chấm thủy — nước",
        note_vi: "Khi làm bộ thủ bên trái: 氵 (ba chấm). Các chữ: 河 (sông), 海 (biển), 洗 (rửa), 酒 (rượu).",
      },
      {
        chinese: "火 (灬)",
        pinyin: "huǒ",
        en: "fire radical — 'lửa'",
        vi: "Bộ hỏa — lửa",
        note_vi: "Khi ở dưới: 灬 (bốn chấm). Các chữ: 烧 (đốt/nấu), 热 (nóng), 炒 (xào), 灯 (đèn).",
      },
      {
        chinese: "木",
        pinyin: "mù",
        en: "tree/wood radical — 'cây/gỗ'",
        vi: "Bộ mộc — cây/gỗ",
        note_vi: "Các chữ: 林 (rừng — 2 cây), 森 (rừng rậm — 3 cây), 桌 (bàn), 椅 (ghế), 休 (người + cây = nghỉ).",
      },
      {
        chinese: "口",
        pinyin: "kǒu",
        en: "mouth radical — 'miệng'",
        vi: "Bộ khẩu — miệng",
        note_vi: "Liên quan đến miệng, lời nói, hoặc vật có miệng. Các chữ: 吃 (ăn), 喝 (uống), 叫 (gọi), 问 (hỏi).",
      },
      {
        chinese: "心 (忄)",
        pinyin: "xīn",
        en: "heart radical — 'tim/tâm'",
        vi: "Bộ tâm — tim/tâm trí",
        note_vi: "Khi ở bên trái: 忄. Các chữ: 想 (nghĩ), 爱 (yêu), 忘 (quên), 忙 (bận). Liên quan đến cảm xúc/suy nghĩ.",
      },
      {
        chinese: "手 (扌)",
        pinyin: "shǒu",
        en: "hand radical — 'tay'",
        vi: "Bộ thủ — tay",
        note_vi: "Khi ở bên trái: 扌. Các chữ: 打 (đánh), 把 (cầm/nắm), 推 (đẩy), 拉 (kéo). Liên quan đến hành động tay.",
      },
      {
        chinese: "言 (讠)",
        pinyin: "yán",
        en: "speech radical — 'lời nói'",
        vi: "Bộ ngôn — lời nói",
        note_vi: "Rút gọn: 讠. Các chữ: 说 (nói), 话 (lời), 读 (đọc), 请 (mời). Liên quan đến ngôn ngữ.",
      },
      {
        chinese: "女",
        pinyin: "nǚ",
        en: "woman radical — 'nữ'",
        vi: "Bộ nữ — phụ nữ",
        note_vi: "Các chữ: 她 (cô ấy), 妈 (mẹ), 姐 (chị), 好 (tốt = nữ + tử/nam).",
      },
      {
        chinese: "日",
        pinyin: "rì",
        en: "sun/day radical — 'mặt trời/ngày'",
        vi: "Bộ nhật — mặt trời/ngày",
        note_vi: "Các chữ: 明 (sáng = nhật + nguyệt), 时 (thời gian), 早 (sớm), 晚 (tối).",
      },
      {
        chinese: "食 (饣)",
        pinyin: "shí",
        en: "food/eat radical — 'ăn/thực phẩm'",
        vi: "Bộ thực — ăn/thức ăn",
        note_vi: "Rút gọn: 饣. Các chữ: 饭 (cơm), 馆 (quán), 饿 (đói), 饱 (no).",
      },
      {
        chinese: "门",
        pinyin: "mén",
        en: "gate/door radical — 'cửa'",
        vi: "Bộ môn — cửa",
        note_vi: "Các chữ: 问 (hỏi = môn + khẩu), 间 (khoảng/giữa), 开 (mở = môn có nét ngang mở ra).",
      },
      {
        chinese: "休 = 人 + 木",
        pinyin: "xiū = rén + mù",
        en: "rest = person + tree",
        vi: "nghỉ ngơi = người + cây",
        note_vi: "Người (亻) dựa vào cây (木) = nghỉ ngơi. Đây là cách nhớ chữ Hán: ghép câu chuyện.",
      },
      {
        chinese: "好 = 女 + 子",
        pinyin: "hǎo = nǚ + zǐ",
        en: "good = woman + child",
        vi: "tốt/đẹp = nữ + tử",
        note_vi: "Phụ nữ (女) có con (子) là điều tốt đẹp. Chữ Hán kể chuyện văn hóa.",
      },
      {
        chinese: "安 = 宀 + 女",
        pinyin: "ān = mián + nǚ",
        en: "peace = roof + woman",
        vi: "an toàn/bình yên = mái nhà + phụ nữ",
        note_vi: "Phụ nữ dưới mái nhà = bình yên. 宀 (mián) là bộ 'mái nhà'.",
      },
    ],
    grammar_notes_vi: [
      "Bộ thủ thường gợi ý NGHĨA (không phải âm đọc) của chữ. Ví dụ: chữ có 氵 thường liên quan đến nước.",
      "Bộ thủ có vị trí cố định trong chữ: bên trái (亻, 氵, 扌, 讠, 忄), bên phải (刂), bên trên (⺮), bên dưới (灬).",
      "Nhiều bộ thủ có dạng rút gọn khi đứng bên trái: 人→亻, 水→氵, 手→扌, 心→忄, 言→讠.",
      "Người Việt có lợi thế Hán-Việt: 'thủy' = nước → chữ có 氵 thường là Hán-Việt 'thủy'.",
      "Học bộ thủ trước khi học chữ Hán = học bảng chữ cái trước khi học đánh vần.",
    ],
    practice_tip_vi:
      "Mỗi ngày học 2-3 bộ thủ. Viết bộ thủ ra giấy, ghi 3 chữ ví dụ. Khi gặp chữ mới, thử đoán nghĩa từ bộ thủ trước khi tra từ điển. Dùng app Pleco hoặc Hanzii để xem phân tích bộ thủ từng chữ.",
  },

  // ================================================================
  // Lesson 6 — Measure words deep dive
  // ================================================================
  {
    id: "zh-measure-words",
    title_vi: "Lượng từ — chìa khóa nói tiếng Trung tự nhiên",
    title_en: "Measure words — the key to natural Chinese",
    intro_vi:
      "Tiếng Trung BẮT BUỘC dùng lượng từ (量词) giữa số và danh từ. Không thể nói 'một sách' (一书), phải nói 'một quyển sách' (一本书). Có ~150 lượng từ, nhưng 10 lượng từ trong bài này chiếm ~90% tình huống thực tế.",
    sentences: [
      {
        chinese: "一本书",
        pinyin: "yī běn shū",
        en: "one book",
        vi: "một quyển sách",
        note_vi: "本 (běn) cho sách, vở, tạp chí — vật đóng thành tập.",
      },
      {
        chinese: "一支笔",
        pinyin: "yī zhī bǐ",
        en: "one pen",
        vi: "một cây bút",
        note_vi: "支 (zhī) cho vật dài, cứng: bút, súng, thuốc lá.",
      },
      {
        chinese: "一张纸",
        pinyin: "yī zhāng zhǐ",
        en: "one piece of paper",
        vi: "một tờ giấy",
        note_vi: "张 (zhāng) cho vật phẳng, mở ra: giấy, bàn, vé, ảnh.",
      },
      {
        chinese: "一件衣服",
        pinyin: "yī jiàn yīfu",
        en: "one piece of clothing",
        vi: "một cái áo / một món quần áo",
        note_vi: "件 (jiàn) cho quần áo, sự việc, hành lý.",
      },
      {
        chinese: "一条鱼",
        pinyin: "yī tiáo yú",
        en: "one fish",
        vi: "một con cá",
        note_vi: "条 (tiáo) cho vật dài, mềm: cá, rắn, đường, sông, quần.",
      },
      {
        chinese: "一双鞋",
        pinyin: "yī shuāng xié",
        en: "one pair of shoes",
        vi: "một đôi giày",
        note_vi: "双 (shuāng) cho đồ đi cặp: giày, tất, đũa, mắt.",
      },
      {
        chinese: "一辆车",
        pinyin: "yī liàng chē",
        en: "one car / vehicle",
        vi: "một chiếc xe",
        note_vi: "辆 (liàng) cho xe cộ.",
      },
      {
        chinese: "一杯水",
        pinyin: "yī bēi shuǐ",
        en: "one cup of water",
        vi: "một cốc nước",
        note_vi: "杯 (bēi) cho đồ uống trong cốc/ly.",
      },
      {
        chinese: "一碗饭",
        pinyin: "yī wǎn fàn",
        en: "one bowl of rice",
        vi: "một bát cơm",
        note_vi: "碗 (wǎn) cho thức ăn trong bát.",
      },
      {
        chinese: "一只猫",
        pinyin: "yī zhī māo",
        en: "one cat",
        vi: "một con mèo",
        note_vi: "只 (zhī) cho động vật (trừ cá/rắn), và một số đồ vật (mắt, tay).",
      },
    ],
    grammar_notes_vi: [
      "Cấu trúc: SỐ + LƯỢNG TỪ + DANH TỪ. Tuyệt đối không bỏ lượng từ.",
      "个 (gè) là lượng từ 'vạn năng' — dùng được khi không biết lượng từ đúng.",
      "两 (liǎng) thay 二 (èr) trước lượng từ: 两个人 (2 người), KHÔNG phải 二个人.",
      "Một số danh từ TỰ LÀM lượng từ: 年 (nián — năm), 天 (tiān — ngày), 分钟 (fēnzhōng — phút).",
    ],
    practice_tip_vi:
      "Đếm đồ vật trong phòng bằng tiếng Trung với lượng từ đúng. Dùng app Pleco để tra lượng từ của từng danh từ. Làm 5 phút/ngày trong 1 tuần.",
  },

  // ================================================================
  // Lesson 7 — Tones review
  // ================================================================
  {
    id: "zh-tones-review",
    title_vi: "Ôn tập thanh điệu — ghép cặp và tốc độ",
    title_en: "Tones review — pair practice and speed",
    intro_vi:
      "Sai thanh là sai nghĩa — đây là chân lý của tiếng Trung. Sau khi học 4 thanh riêng lẻ, bạn cần tập GHÉP CẶP thanh (tone pairs) — 16 tổ hợp thanh. Đây là cách người Trung Quốc thực sự phát âm: không phải từng thanh riêng, mà là dòng chảy thanh điệu.",
    sentences: [
      {
        chinese: "飞机 (1+1)",
        pinyin: "fēijī",
        en: "airplane (high-level + high-level)",
        vi: "máy bay",
        note_vi: "Cả hai thanh 1 — giữ đều, không tụt.",
      },
      {
        chinese: "中国 (1+2)",
        pinyin: "Zhōngguó",
        en: "China (high-level + rising)",
        vi: "Trung Quốc",
        note_vi: "Tập: cao đều rồi lên.",
      },
      {
        chinese: "宾馆 (1+3)",
        pinyin: "bīnguǎn",
        en: "hotel (high-level + low-dipping)",
        vi: "khách sạn",
        note_vi: "Tập: cao đều rồi hạ thấp lên.",
      },
      {
        chinese: "生日 (1+4)",
        pinyin: "shēngrì",
        en: "birthday (high-level + falling)",
        vi: "sinh nhật",
        note_vi: "Tập: cao đều rồi rơi mạnh.",
      },
      {
        chinese: "明天 (2+1)",
        pinyin: "míngtiān",
        en: "tomorrow (rising + high-level)",
        vi: "ngày mai",
        note_vi: "Tập: lên rồi giữ cao.",
      },
      {
        chinese: "学习 (2+2)",
        pinyin: "xuéxí",
        en: "to study (rising + rising)",
        vi: "học tập",
        note_vi: "Hai thanh 2 liền — lên rồi lên nữa.",
      },
      {
        chinese: "啤酒 (2+3)",
        pinyin: "píjiǔ",
        en: "beer (rising + low-dipping)",
        vi: "bia",
        note_vi: "Tập: lên rồi hạ thấp lên.",
      },
      {
        chinese: "还是 (2+4)",
        pinyin: "háishì",
        en: "or / still (rising + falling)",
        vi: "hay là / vẫn",
        note_vi: "Tập: lên rồi rơi mạnh.",
      },
      {
        chinese: "老师 (3+1)",
        pinyin: "lǎoshī",
        en: "teacher (low-dipping + high-level)",
        vi: "thầy giáo / cô giáo",
        note_vi: "Thanh 3 thứ nhất chỉ xuống, KHÔNG lên lại (half third tone).",
      },
      {
        chinese: "可能 (3+2)",
        pinyin: "kěnéng",
        en: "maybe (low-dipping + rising)",
        vi: "có thể",
      },
      {
        chinese: "你好 (3+3)",
        pinyin: "ní hǎo",
        en: "hello (3+3 → 2+3)",
        vi: "xin chào",
        note_vi: "3+3 biến thành 2+3. Thanh 3 đầu thành thanh 2.",
      },
      {
        chinese: "请问 (3+4)",
        pinyin: "qǐngwèn",
        en: "may I ask (low-dipping + falling)",
        vi: "xin hỏi",
      },
    ],
    grammar_notes_vi: [
      "Half third tone: khi thanh 3 đứng trước 1/2/4, nó chỉ XUỐNG mà không lên lại.",
      "Tone sandhi: 3+3 → 2+3, 一 biến thanh (yí trước 4, yì trước 1/2/3), 不 biến thanh (bú trước 4).",
      "Tập tone pairs quan trọng hơn tập từng thanh riêng lẻ — người Trung Quốc nói theo dòng thanh.",
    ],
    practice_tip_vi:
      "Dùng app Pinyin Trainer hoặc HelloChinese tập 20 tone pairs. Mỗi ngày tập 4 cặp mới + ôn 4 cặp cũ. Sau 5 ngày bạn nói được cả 16 tổ hợp.",
  },

  // ================================================================
  // Lesson 8 — Shopping and bargaining
  // ================================================================
  {
    id: "zh-shopping",
    title_vi: "Mua sắm và mặc cả",
    title_en: "Shopping and bargaining",
    intro_vi:
      "Mua sắm ở Trung Quốc là kỹ năng sinh tồn — từ siêu thị đến chợ đêm. Mặc cả (讨价还价) là một nghệ thuật và được MONG ĐỢI ở chợ, cửa hàng nhỏ. Bài này dạy từ vựng mua sắm và chiến thuật mặc cả lịch sự.",
    sentences: [
      {
        chinese: "这个多少钱？",
        pinyin: "Zhège duōshao qián?",
        en: "How much is this?",
        vi: "Cái này bao nhiêu tiền?",
      },
      {
        chinese: "太贵了！",
        pinyin: "Tài guì le!",
        en: "Too expensive!",
        vi: "Đắt quá!",
        note_vi: "Đây là câu MỞ ĐẦU cho mặc cả. Nói với giọng thân thiện, không gay gắt.",
      },
      {
        chinese: "便宜一点儿吧",
        pinyin: "Piányi yīdiǎnr ba",
        en: "A little cheaper, please.",
        vi: "Rẻ hơn một chút đi ạ.",
        note_vi: "一点儿 (yīdiǎnr) = một chút. 吧 (ba) làm mềm câu đề nghị.",
      },
      {
        chinese: "可以便宜一点吗？",
        pinyin: "Kěyǐ piányi yīdiǎn ma?",
        en: "Can it be a little cheaper?",
        vi: "Có thể rẻ hơn chút không?",
        note_vi: "Cách hỏi lịch sự. Dùng ở cửa hàng nhỏ, không dùng ở siêu thị.",
      },
      {
        chinese: "我要这个",
        pinyin: "Wǒ yào zhège",
        en: "I'll take this.",
        vi: "Tôi lấy cái này.",
      },
      {
        chinese: "可以试一下吗？",
        pinyin: "Kěyǐ shì yīxià ma?",
        en: "Can I try it?",
        vi: "Có thể thử một chút không?",
      },
      {
        chinese: "有没有大一点的？",
        pinyin: "Yǒu méiyǒu dà yīdiǎn de?",
        en: "Do you have a bigger one?",
        vi: "Có cái to hơn không?",
      },
      {
        chinese: "我可以用信用卡吗？",
        pinyin: "Wǒ kěyǐ yòng xìnyòngkǎ ma?",
        en: "Can I use a credit card?",
        vi: "Tôi có thể dùng thẻ tín dụng không?",
        note_vi: "Nhiều cửa hàng nhỏ ở Trung Quốc chỉ nhận WeChat Pay hoặc Alipay. Tiền mặt vẫn phổ biến.",
      },
      {
        chinese: "可以微信支付吗？",
        pinyin: "Kěyǐ Wēixìn zhīfù ma?",
        en: "Can I pay with WeChat?",
        vi: "Có thể trả bằng WeChat không?",
        note_vi: "WeChat Pay là phương thức thanh toán SỐ 1 ở Trung Quốc.",
      },
    ],
    grammar_notes_vi: [
      "可以...吗？ (kěyǐ...ma) = có thể...không? Mẫu câu xin phép lịch sự.",
      "有没有...？ (yǒu méiyǒu...) = có...không? Dùng để hỏi sự tồn tại.",
      "吧 (ba) cuối câu = đề nghị nhẹ nhàng. Rất phổ biến trong mặc cả.",
      "Mặc cả ở chợ: bắt đầu trả 50% giá được đưa ra, thương lượng đến 70-80%.",
    ],
    practice_tip_vi:
      "Xem video 'bargaining in China' trên YouTube. Tập nói theo các mẫu câu mặc cả. Nhớ: cười khi mặc cả — không cười nghĩa là bạn đang tức giận.",
  },

  // ================================================================
  // Lesson 9 — Directions
  // ================================================================
  {
    id: "zh-directions",
    title_vi: "Hỏi đường và vị trí",
    title_en: "Directions and locations",
    intro_vi:
      "Hỏi đường ở Trung Quốc: người Trung Quốc thường chỉ đường bằng hướng (đông/tây/nam/bắc) và landmarks. Biết nói 'bên trái', 'bên phải', 'đối diện', 'rẽ' là kỹ năng sống còn. Bài này dạy từ vựng vị trí và mẫu câu chỉ đường cơ bản.",
    sentences: [
      {
        chinese: "请问，地铁站在哪里？",
        pinyin: "Qǐngwèn, dìtiězhàn zài nǎlǐ?",
        en: "Excuse me, where is the subway station?",
        vi: "Xin hỏi, ga tàu điện ngầm ở đâu?",
      },
      {
        chinese: "一直往前走",
        pinyin: "Yīzhí wǎng qián zǒu",
        en: "Go straight ahead.",
        vi: "Đi thẳng về phía trước.",
        note_vi: "一直 (yīzhí) = thẳng/liên tục. 往 (wǎng) = về phía.",
      },
      {
        chinese: "往左拐",
        pinyin: "Wǎng zuǒ guǎi",
        en: "Turn left.",
        vi: "Rẽ trái.",
      },
      {
        chinese: "往右拐",
        pinyin: "Wǎng yòu guǎi",
        en: "Turn right.",
        vi: "Rẽ phải.",
      },
      {
        chinese: "在对面",
        pinyin: "Zài duìmiàn",
        en: "It's across the street / opposite.",
        vi: "Ở đối diện.",
      },
      {
        chinese: "在左边",
        pinyin: "Zài zuǒbiān",
        en: "It's on the left.",
        vi: "Ở bên trái.",
      },
      {
        chinese: "在右边",
        pinyin: "Zài yòubiān",
        en: "It's on the right.",
        vi: "Ở bên phải.",
      },
      {
        chinese: "在...旁边",
        pinyin: "Zài...pángbiān",
        en: "It's next to...",
        vi: "Ở bên cạnh...",
        note_vi: "Gắn landmark vào: 在银行旁边 (bên cạnh ngân hàng).",
      },
      {
        chinese: "远不远？",
        pinyin: "Yuǎn bù yuǎn?",
        en: "Is it far?",
        vi: "Có xa không?",
      },
      {
        chinese: "走路要多久？",
        pinyin: "Zǒulù yào duōjiǔ?",
        en: "How long does it take to walk?",
        vi: "Đi bộ mất bao lâu?",
      },
    ],
    grammar_notes_vi: [
      "在 (zài) = ở (vị trí). 在 + địa điểm. Thường đứng trước động từ hoặc cuối câu.",
      "往 (wǎng) = về phía. 往 + hướng + động từ: 往前走, 往左拐.",
      "离 (lí) = cách. A 离 B 很远/很近 (A cách B xa/gần).",
      "Người Trung Quốc dùng hướng đông/tây/nam/bắc (东南西北) để chỉ đường — học 4 hướng này.",
    ],
    practice_tip_vi:
      "Mở Baidu Maps (bản đồ Trung Quốc). Tập mô tả đường từ một địa điểm đến địa điểm khác bằng tiếng Trung. Dùng từ vị trí đã học.",
  },

  // ================================================================
  // Lesson 10 — Family
  // ================================================================
  {
    id: "zh-family",
    title_vi: "Gia đình và cách xưng hô",
    title_en: "Family and kinship terms",
    intro_vi:
      "Tiếng Trung có hệ thống xưng hô gia đình PHỨC TẠP — phân biệt bên nội/bên ngoại, tuổi tác, thứ bậc. Người Việt có lợi thế vì tiếng Việt cũng phân biệt tương tự. Bài này dạy 15 từ xưng hô gia đình cơ bản.",
    sentences: [
      {
        chinese: "爸爸 / 妈妈",
        pinyin: "bàba / māma",
        en: "dad / mom",
        vi: "bố / mẹ",
        note_vi: "Trang trọng: 父亲 (fùqīn) / 母亲 (mǔqīn).",
      },
      {
        chinese: "哥哥 / 弟弟",
        pinyin: "gēge / dìdi",
        en: "older brother / younger brother",
        vi: "anh trai / em trai",
        note_vi: "Tiếng Trung PHÂN BIỆT tuổi — không có từ chung 'anh em trai'.",
      },
      {
        chinese: "姐姐 / 妹妹",
        pinyin: "jiějie / mèimei",
        en: "older sister / younger sister",
        vi: "chị gái / em gái",
      },
      {
        chinese: "爷爷 / 奶奶",
        pinyin: "yéye / nǎinai",
        en: "grandpa / grandma (paternal)",
        vi: "ông nội / bà nội",
        note_vi: "BÊN NỘI. Ông bà bên NGOẠI: 外公 (wàigōng) / 外婆 (wàipó).",
      },
      {
        chinese: "老公 / 老婆",
        pinyin: "lǎogōng / lǎopó",
        en: "husband / wife (casual)",
        vi: "chồng / vợ (thân mật)",
        note_vi: "Trang trọng: 先生 (xiānsheng) / 太太 (tàitai).",
      },
      {
        chinese: "儿子 / 女儿",
        pinyin: "érzi / nǚ'ér",
        en: "son / daughter",
        vi: "con trai / con gái",
      },
      {
        chinese: "你家有几口人？",
        pinyin: "Nǐ jiā yǒu jǐ kǒu rén?",
        en: "How many people in your family?",
        vi: "Nhà bạn có mấy người?",
      },
      {
        chinese: "我家有四口人",
        pinyin: "Wǒ jiā yǒu sì kǒu rén",
        en: "There are 4 people in my family.",
        vi: "Nhà tôi có 4 người.",
        note_vi: "口 (kǒu) là lượng từ cho thành viên gia đình.",
      },
    ],
    grammar_notes_vi: [
      "Từ gia đình thường lặp âm tiết: 爸爸, 妈妈, 哥哥, 姐姐, 弟弟, 妹妹.",
      "Phân biệt bên nội/bên ngoại: 爷爷/奶奶 (nội) vs 外公/外婆 (ngoại).",
      "叔叔 (shūshu) = chú (em trai bố), 舅舅 (jiùjiu) = cậu (em trai mẹ). Khác nhau!",
      "Cách hỏi tuổi trẻ em: 你几岁了？(Nǐ jǐ suì le?). Người lớn: 你多大了？(Nǐ duō dà le?).",
    ],
    practice_tip_vi:
      "Vẽ cây gia đình (family tree) bằng tiếng Trung. Ghi tên và cách gọi từng người. Tập giới thiệu gia đình: 我家有...口人，爸爸、妈妈...",
  },

  // ================================================================
  // Lesson 11 — Time and dates
  // ================================================================
  {
    id: "zh-time",
    title_vi: "Giờ giấc và ngày tháng",
    title_en: "Telling time and dates",
    intro_vi:
      "Nói giờ và ngày tháng tiếng Trung khá logic — dùng số + đơn vị. Nhưng thứ trong tuần, tháng, và cách nói 'kém/rưỡi' có quy tắc riêng. Bài này dạy tất cả các mẫu câu thời gian cần thiết.",
    sentences: [
      {
        chinese: "现在几点？",
        pinyin: "Xiànzài jǐ diǎn?",
        en: "What time is it now?",
        vi: "Bây giờ mấy giờ?",
      },
      {
        chinese: "三点",
        pinyin: "sān diǎn",
        en: "3 o'clock.",
        vi: "3 giờ.",
        note_vi: "点 (diǎn) = giờ. Luôn dùng số + 点.",
      },
      {
        chinese: "三点半",
        pinyin: "sān diǎn bàn",
        en: "3:30.",
        vi: "3 giờ rưỡi.",
        note_vi: "半 (bàn) = rưỡi.",
      },
      {
        chinese: "三点一刻",
        pinyin: "sān diǎn yī kè",
        en: "3:15.",
        vi: "3 giờ 15 phút.",
        note_vi: "刻 (kè) = 15 phút. 三点一刻 = 3:15. 三点三刻 = 3:45.",
      },
      {
        chinese: "差十分四点",
        pinyin: "chà shí fēn sì diǎn",
        en: "10 minutes to 4.",
        vi: "4 giờ kém 10.",
        note_vi: "差 (chà) = thiếu/kém.",
      },
      {
        chinese: "今天星期几？",
        pinyin: "Jīntiān xīngqī jǐ?",
        en: "What day is today?",
        vi: "Hôm nay thứ mấy?",
      },
      {
        chinese: "星期一",
        pinyin: "xīngqīyī",
        en: "Monday",
        vi: "thứ hai",
        note_vi: "Thứ = 星期 (xīngqī) + số. Thứ hai = 星期一 (1). Chủ nhật = 星期天/星期日.",
      },
      {
        chinese: "今天是几月几号？",
        pinyin: "Jīntiān shì jǐ yuè jǐ hào?",
        en: "What's the date today?",
        vi: "Hôm nay ngày bao nhiêu, tháng mấy?",
      },
      {
        chinese: "四月一号",
        pinyin: "sì yuè yī hào",
        en: "April 1st.",
        vi: "ngày 1 tháng 4.",
        note_vi: "月 (yuè) = tháng. 号 (hào) = ngày (khẩu ngữ). 日 (rì) = ngày (văn viết).",
      },
    ],
    grammar_notes_vi: [
      "Thứ trong tuần: 星期一 (thứ 2), 星期二 (3), ... 星期六 (7), 星期天/日 (chủ nhật).",
      "Tháng: số + 月. 一月 (tháng 1)...十二月 (tháng 12). Đơn giản.",
      "Ngày: số + 号 (khẩu ngữ) hoặc 日 (văn viết, trang trọng).",
      "Sáng/trưa/tối: 上午 (shàngwǔ — sáng), 中午 (zhōngwǔ — trưa), 下午 (xiàwǔ — chiều), 晚上 (wǎnshang — tối).",
    ],
    practice_tip_vi:
      "Hỏi và trả lời 5 câu hỏi mỗi ngày: hôm nay thứ mấy, ngày mấy, bây giờ mấy giờ, sinh nhật bạn khi nào, bạn đi làm lúc mấy giờ.",
  },

  // ================================================================
  // Lesson 12 — Ordering food
  // ================================================================
  {
    id: "zh-food",
    title_vi: "Gọi món — từ trà sữa đến lẩu",
    title_en: "Ordering food — from milk tea to hotpot",
    intro_vi:
      "Ẩm thực là LINH HỒN của văn hóa Trung Quốc. Biết gọi món bằng tiếng Trung không chỉ là kỹ năng sinh tồn mà còn là cách kết nối văn hóa. Từ quán trà sữa đến nhà hàng lẩu, bài này dạy bạn tự tin đặt món.",
    sentences: [
      {
        chinese: "菜单，谢谢",
        pinyin: "Càidān, xièxie",
        en: "Menu, please.",
        vi: "Cho tôi thực đơn ạ.",
      },
      {
        chinese: "有什么推荐的？",
        pinyin: "Yǒu shénme tuījiàn de?",
        en: "What do you recommend?",
        vi: "Có món gì đề xuất không?",
      },
      {
        chinese: "我要这个",
        pinyin: "Wǒ yào zhège",
        en: "I want this one.",
        vi: "Tôi muốn món này.",
        note_vi: "Chỉ vào menu khi nói — hoàn toàn bình thường.",
      },
      {
        chinese: "不要辣",
        pinyin: "Bùyào là",
        en: "Not spicy.",
        vi: "Không cay.",
        note_vi: "辣 (là) = cay. Câu QUAN TRỌNG nếu bạn không ăn được cay!",
      },
      {
        chinese: "少放盐",
        pinyin: "Shǎo fàng yán",
        en: "Less salt, please.",
        vi: "Cho ít muối thôi ạ.",
      },
      {
        chinese: "来一碗米饭",
        pinyin: "Lái yī wǎn mǐfàn",
        en: "One bowl of rice, please.",
        vi: "Cho một bát cơm ạ.",
        note_vi: "来 (lái) = đem đến. Dùng nhiều hơn 要 trong nhà hàng.",
      },
      {
        chinese: "买单！",
        pinyin: "Mǎidān!",
        en: "Check, please!",
        vi: "Tính tiền!",
        note_vi: "Ở Trung Quốc, bạn PHẢI gọi to '买单！' — nhân viên không tự mang hóa đơn.",
      },
      {
        chinese: "打包",
        pinyin: "dǎbāo",
        en: "Take away / doggy bag.",
        vi: "Gói mang về.",
        note_vi: "Mang thức ăn thừa về là BÌNH THƯỜNG ở Trung Quốc.",
      },
      {
        chinese: "很好吃！",
        pinyin: "Hěn hǎochī!",
        en: "Very delicious!",
        vi: "Rất ngon!",
        note_vi: "Khen đầu bếp — câu này làm người Trung Quốc RẤT vui.",
      },
    ],
    grammar_notes_vi: [
      "来 (lái) = đem đến. Dùng phổ biến trong nhà hàng: 来两瓶啤酒 (đem 2 chai bia).",
      "买单 (mǎidān) = thanh toán. Ở Trung Quốc phải CHỦ ĐỘNG gọi tính tiền.",
      "打包 (dǎbāo) = gói mang về. Ở Trung Quốc không có stigma về việc mang đồ ăn thừa về.",
      "Không có tip ở Trung Quốc (trừ nhà hàng cao cấp quốc tế).",
    ],
    practice_tip_vi:
      "Lần tới đi nhà hàng Trung Quốc ở Việt Nam, gọi món bằng tiếng Trung. Hoặc tập với video 'ordering food in Chinese' trên YouTube.",
  },

  // ================================================================
  // Lesson 13 — Transport
  // ================================================================
  {
    id: "zh-transport",
    title_vi: "Giao thông — tàu cao tốc và taxi",
    title_en: "Transport — high-speed rail and taxis",
    intro_vi:
      "Trung Quốc có mạng lưới tàu cao tốc LỚN NHẤT thế giới và hệ thống giao thông công cộng hiện đại. Biết mua vé tàu, bắt taxi, và dùng tàu điện ngầm sẽ giúp bạn du lịch Trung Quốc dễ dàng.",
    sentences: [
      {
        chinese: "我要买去北京的票",
        pinyin: "Wǒ yào mǎi qù Běijīng de piào",
        en: "I want to buy a ticket to Beijing.",
        vi: "Tôi muốn mua vé đi Bắc Kinh.",
      },
      {
        chinese: "一张高铁票",
        pinyin: "yī zhāng gāotiě piào",
        en: "One high-speed rail ticket.",
        vi: "Một vé tàu cao tốc.",
        note_vi: "高铁 (gāotiě) = tàu cao tốc. Có thể đạt 350km/h.",
      },
      {
        chinese: "地铁站在哪里？",
        pinyin: "Dìtiězhàn zài nǎlǐ?",
        en: "Where is the subway station?",
        vi: "Ga tàu điện ngầm ở đâu?",
      },
      {
        chinese: "去机场要多久？",
        pinyin: "Qù jīchǎng yào duōjiǔ?",
        en: "How long to the airport?",
        vi: "Đi sân bay mất bao lâu?",
      },
      {
        chinese: "师傅，去火车站",
        pinyin: "Shīfu, qù huǒchēzhàn",
        en: "Driver, to the train station.",
        vi: "Bác tài, đi ga tàu hỏa ạ.",
        note_vi: "师傅 (shīfu) = cách gọi tài xế taxi lịch sự.",
      },
      {
        chinese: "请打表",
        pinyin: "Qǐng dǎ biǎo",
        en: "Please use the meter.",
        vi: "Xin bật đồng hồ ạ.",
        note_vi: "Ở một số thành phố, tài xế có thể 'quên' bật meter. Luôn nói câu này.",
      },
      {
        chinese: "在这里停",
        pinyin: "Zài zhèlǐ tíng",
        en: "Stop here.",
        vi: "Dừng ở đây ạ.",
      },
      {
        chinese: "可以用微信支付吗？",
        pinyin: "Kěyǐ yòng Wēixìn zhīfù ma?",
        en: "Can I pay with WeChat?",
        vi: "Có thể trả bằng WeChat không?",
      },
    ],
    grammar_notes_vi: [
      "票 (piào) = vé. 火车票 (vé tàu), 机票 (vé máy bay), 电影票 (vé xem phim).",
      "师傅 (shīfu) = cách gọi chung cho tài xế, thợ sửa, đầu bếp — người có tay nghề.",
      "请 (qǐng) đầu câu = xin hãy. Biến câu mệnh lệnh thành lịch sự.",
      "用 (yòng) = dùng. 可以用...吗？= có thể dùng...không?",
    ],
    practice_tip_vi:
      "Tải app 12306 (app đặt vé tàu Trung Quốc). Tập tra cứu lộ trình tàu cao tốc từ Bắc Kinh đến Thượng Hải bằng tiếng Trung.",
  },

  // ================================================================
  // Lesson 14 — Question words
  // ================================================================
  {
    id: "zh-question-words",
    title_vi: "Từ hỏi — ai, cái gì, ở đâu, khi nào",
    title_en: "Question words — who, what, where, when",
    intro_vi:
      "Đặt câu hỏi trong tiếng Trung khá đơn giản: thay từ cần hỏi bằng từ hỏi tương ứng, giữ nguyên trật tự câu. KHÔNG cần đảo trợ động từ như tiếng Anh. Bài này dạy 10 từ hỏi chính và cách dùng.",
    sentences: [
      {
        chinese: "这是什么？",
        pinyin: "Zhè shì shénme?",
        en: "What is this?",
        vi: "Đây là cái gì?",
      },
      {
        chinese: "你是谁？",
        pinyin: "Nǐ shì shéi?",
        en: "Who are you?",
        vi: "Bạn là ai?",
        note_vi: "谁 đọc là shéi (phổ biến) hoặc shuí (trang trọng).",
      },
      {
        chinese: "他在哪里？",
        pinyin: "Tā zài nǎlǐ?",
        en: "Where is he?",
        vi: "Anh ấy ở đâu?",
        note_vi: "哪里 (nǎlǐ) = ở đâu. 哪儿 (nǎr) = cùng nghĩa, khẩu ngữ miền Bắc.",
      },
      {
        chinese: "你什么时候来？",
        pinyin: "Nǐ shénme shíhou lái?",
        en: "When are you coming?",
        vi: "Khi nào bạn đến?",
        note_vi: "什么时候 (shénme shíhou) = khi nào. Lit: 'cái gì thời điểm'.",
      },
      {
        chinese: "怎么走？",
        pinyin: "Zěnme zǒu?",
        en: "How do I get there?",
        vi: "Đi thế nào?",
        note_vi: "怎么 (zěnme) = như thế nào / làm sao.",
      },
      {
        chinese: "为什么？",
        pinyin: "Wèishénme?",
        en: "Why?",
        vi: "Tại sao?",
        note_vi: "Lit: 'vì cái gì'. Trả lời: 因为... (yīnwèi... — bởi vì...).",
      },
      {
        chinese: "哪个是你的？",
        pinyin: "Nǎge shì nǐ de?",
        en: "Which one is yours?",
        vi: "Cái nào là của bạn?",
        note_vi: "哪 (nǎ) = nào. 哪个 (nǎge) = cái nào.",
      },
      {
        chinese: "几个？",
        pinyin: "Jǐ ge?",
        en: "How many? (under 10)",
        vi: "Mấy cái?",
        note_vi: "几 (jǐ) = mấy. Dùng cho số lượng dưới ~10. Nhiều hơn dùng 多少 (duōshao).",
      },
      {
        chinese: "多少钱？",
        pinyin: "Duōshao qián?",
        en: "How much money?",
        vi: "Bao nhiêu tiền?",
      },
    ],
    grammar_notes_vi: [
      "Trật tự câu hỏi = trật tự câu trần thuật. Chỉ thay từ cần hỏi bằng từ hỏi. Không đảo!",
      "什么 (shénme) có thể đứng trước danh từ: 什么颜色 (màu gì), 什么菜 (món gì).",
      "几 vs 多少: 几 cho số nhỏ (<10), 多少 cho số lớn hoặc không giới hạn.",
      "吗 (ma) ở cuối câu trần thuật tạo câu hỏi yes/no. Không dùng chung với từ hỏi khác.",
    ],
    practice_tip_vi:
      "Đặt 10 câu hỏi về cuộc sống hằng ngày của bạn bằng 10 từ hỏi khác nhau. Mỗi ngày tự hỏi tự trả lời 5 câu.",
  },

  // ================================================================
  // Lesson 15 — Describing things
  // ================================================================
  {
    id: "zh-describing",
    title_vi: "Miêu tả — tính từ và so sánh",
    title_en: "Describing things — adjectives and comparisons",
    intro_vi:
      "Tính từ tiếng Trung vừa là tính từ vừa là động từ — bạn không cần 'là' (是) khi dùng tính từ. Muốn nói 'cái này đẹp' chỉ cần '这个漂亮', không phải '这个是漂亮'. Bài này dạy cách miêu tả và so sánh.",
    sentences: [
      {
        chinese: "这个很大",
        pinyin: "Zhège hěn dà",
        en: "This is big.",
        vi: "Cái này to.",
        note_vi: "很 (hěn) trong câu này KHÔNG có nghĩa 'rất' — nó chỉ là từ nối bắt buộc.",
      },
      {
        chinese: "这个比那个大",
        pinyin: "Zhège bǐ nàge dà",
        en: "This is bigger than that.",
        vi: "Cái này to hơn cái kia.",
        note_vi: "比 (bǐ) = so với. A 比 B + tính từ = A hơn B.",
      },
      {
        chinese: "这个最好",
        pinyin: "Zhège zuì hǎo",
        en: "This is the best.",
        vi: "Cái này tốt nhất.",
        note_vi: "最 (zuì) = nhất. A 最 + tính từ = A nhất.",
      },
      {
        chinese: "一样大",
        pinyin: "yīyàng dà",
        en: "same size / equally big",
        vi: "to bằng nhau",
        note_vi: "一样 (yīyàng) = giống nhau. A 跟 B 一样 + tính từ = A bằng B.",
      },
      {
        chinese: "红色的好看",
        pinyin: "hóngsè de hǎokàn",
        en: "The red one looks good.",
        vi: "Cái màu đỏ nhìn đẹp.",
        note_vi: "Màu sắc + 的 tạo thành cụm danh từ: 红色的 = cái màu đỏ.",
      },
      {
        chinese: "这个太重了",
        pinyin: "Zhège tài zhòng le",
        en: "This is too heavy.",
        vi: "Cái này nặng quá.",
        note_vi: "太...了 = quá... 太好了！(Tuyệt quá!).",
      },
      {
        chinese: "你比我高",
        pinyin: "Nǐ bǐ wǒ gāo",
        en: "You are taller than me.",
        vi: "Bạn cao hơn tôi.",
      },
    ],
    grammar_notes_vi: [
      "Tính từ KHÔNG cần 是. 这个很大 ✓, 这个是很大 ✗.",
      "很 (hěn) trước tính từ thường KHÔNG có nghĩa nhấn mạnh — nó là từ nối ngữ pháp.",
      "So sánh hơn: A 比 B + tính từ. So sánh nhất: A 最 + tính từ.",
      "太...了 (tài...le) = quá... (cảm thán, đôi khi tiêu cực).",
    ],
    practice_tip_vi:
      "Miêu tả 5 đồ vật trong phòng bằng tiếng Trung. So sánh chúng với nhau: cái này to hơn cái kia, cái này đẹp nhất, cái kia nặng quá.",
  },

  // ================================================================
  // Lesson 16 — Body and health
  // ================================================================
  {
    id: "zh-body-health",
    title_vi: "Cơ thể và sức khỏe",
    title_en: "Body and health",
    intro_vi:
      "Biết nói về cơ thể và sức khỏe là quan trọng — đặc biệt khi bạn cần đi khám bệnh ở Trung Quốc. Bài này dạy từ vựng bộ phận cơ thể và cách mô tả triệu chứng cơ bản.",
    sentences: [
      {
        chinese: "我头疼",
        pinyin: "Wǒ tóu téng",
        en: "I have a headache.",
        vi: "Tôi đau đầu.",
        note_vi: "疼 (téng) = đau. [Bộ phận] + 疼 = đau [bộ phận đó].",
      },
      {
        chinese: "我肚子疼",
        pinyin: "Wǒ dùzi téng",
        en: "I have a stomachache.",
        vi: "Tôi đau bụng.",
      },
      {
        chinese: "我不舒服",
        pinyin: "Wǒ bù shūfu",
        en: "I don't feel well.",
        vi: "Tôi không khỏe.",
        note_vi: "舒服 (shūfu) = thoải mái / khỏe.",
      },
      {
        chinese: "我感冒了",
        pinyin: "Wǒ gǎnmào le",
        en: "I have a cold.",
        vi: "Tôi bị cảm rồi.",
        note_vi: "了 (le) ở đây chỉ sự thay đổi trạng thái: 'đã bị cảm'.",
      },
      {
        chinese: "医院在哪里？",
        pinyin: "Yīyuàn zài nǎlǐ?",
        en: "Where is the hospital?",
        vi: "Bệnh viện ở đâu?",
      },
      {
        chinese: "眼睛、鼻子、嘴巴、耳朵",
        pinyin: "yǎnjīng, bízi, zuǐba, ěrduo",
        en: "eyes, nose, mouth, ears",
        vi: "mắt, mũi, miệng, tai",
      },
      {
        chinese: "手、脚",
        pinyin: "shǒu, jiǎo",
        en: "hand, foot",
        vi: "tay, chân",
      },
    ],
    grammar_notes_vi: [
      "疼 (téng) = đau. Gắn sau bộ phận cơ thể: 头疼, 牙疼 (đau răng), 背疼 (đau lưng).",
      "了 (le) sau tính từ/động từ có thể chỉ sự thay đổi: 我病了 (tôi bị ốm rồi).",
      "看医生 (kàn yīshēng) = đi khám bác sĩ. 看 có nghĩa 'thăm/khám'.",
    ],
    practice_tip_vi:
      "Học thuộc 10 bộ phận cơ thể. Tập nói: nếu đau ở đâu thì nói thế nào. Ví dụ: 我嗓子疼 (tôi đau họng).",
  },

  // ================================================================
  // Lesson 17 — Weather and seasons
  // ================================================================
  {
    id: "zh-weather",
    title_vi: "Thời tiết và 4 mùa",
    title_en: "Weather and seasons",
    intro_vi:
      "Thời tiết là chủ đề 'small talk' an toàn ở Trung Quốc. Bắc Kinh có 4 mùa rõ rệt, Thượng Hải ẩm ướt, Quảng Châu nóng quanh năm. Học nói về thời tiết giúp bạn dễ dàng bắt chuyện.",
    sentences: [
      {
        chinese: "今天天气怎么样？",
        pinyin: "Jīntiān tiānqì zěnmeyàng?",
        en: "How's the weather today?",
        vi: "Hôm nay thời tiết thế nào?",
      },
      {
        chinese: "今天很热",
        pinyin: "Jīntiān hěn rè",
        en: "It's hot today.",
        vi: "Hôm nay nóng.",
      },
      {
        chinese: "今天很冷",
        pinyin: "Jīntiān hěn lěng",
        en: "It's cold today.",
        vi: "Hôm nay lạnh.",
      },
      {
        chinese: "下雨了",
        pinyin: "Xià yǔ le",
        en: "It's raining.",
        vi: "Trời mưa rồi.",
        note_vi: "下雨 (xià yǔ) = mưa rơi. Lit: 'rơi mưa'.",
      },
      {
        chinese: "春天、夏天、秋天、冬天",
        pinyin: "chūntiān, xiàtiān, qiūtiān, dōngtiān",
        en: "spring, summer, autumn, winter",
        vi: "xuân, hè, thu, đông",
      },
      {
        chinese: "明天会很冷，多穿衣服",
        pinyin: "Míngtiān huì hěn lěng, duō chuān yīfu",
        en: "It'll be cold tomorrow, wear more clothes.",
        vi: "Ngày mai sẽ lạnh, mặc nhiều áo vào.",
        note_vi: "会 (huì) = sẽ. Dùng cho dự báo.",
      },
      {
        chinese: "刮风了",
        pinyin: "Guā fēng le",
        en: "It's windy.",
        vi: "Trời nổi gió rồi.",
      },
    ],
    grammar_notes_vi: [
      "下雨 (mưa), 下雪 (tuyết rơi), 刮风 (gió thổi) — các hiện tượng thời tiết có động từ riêng.",
      "会 (huì) = sẽ (dự đoán). 明天会下雨 (ngày mai sẽ mưa).",
      "了 (le) cuối câu thời tiết = sự thay đổi: 下雨了 (trời mưa rồi — vừa mới bắt đầu).",
    ],
    practice_tip_vi:
      "Kiểm tra thời tiết Bắc Kinh mỗi sáng và nói bằng tiếng Trung: hôm nay nóng/lạnh/mưa/gió. Làm trong 2 tuần.",
  },

  // ================================================================
  // Lesson 18 — Work and professions
  // ================================================================
  {
    id: "zh-work",
    title_vi: "Công việc và nghề nghiệp",
    title_en: "Work and professions",
    intro_vi:
      "Khi gặp người Trung Quốc, câu hỏi 'bạn làm nghề gì?' (你做什么工作？) rất phổ biến. Biết tên các nghề nghiệp và cách nói về công việc giúp bạn giao tiếp xã hội và chuyên nghiệp.",
    sentences: [
      {
        chinese: "你做什么工作？",
        pinyin: "Nǐ zuò shénme gōngzuò?",
        en: "What do you do for work?",
        vi: "Bạn làm nghề gì?",
      },
      {
        chinese: "我是老师",
        pinyin: "Wǒ shì lǎoshī",
        en: "I'm a teacher.",
        vi: "Tôi là giáo viên.",
      },
      {
        chinese: "我是学生",
        pinyin: "Wǒ shì xuésheng",
        en: "I'm a student.",
        vi: "Tôi là học sinh / sinh viên.",
      },
      {
        chinese: "医生、护士、工程师、厨师",
        pinyin: "yīshēng, hùshi, gōngchéngshī, chúshī",
        en: "doctor, nurse, engineer, chef",
        vi: "bác sĩ, y tá, kỹ sư, đầu bếp",
      },
      {
        chinese: "你在哪里工作？",
        pinyin: "Nǐ zài nǎlǐ gōngzuò?",
        en: "Where do you work?",
        vi: "Bạn làm việc ở đâu?",
      },
      {
        chinese: "我很忙",
        pinyin: "Wǒ hěn máng",
        en: "I'm very busy.",
        vi: "Tôi rất bận.",
      },
      {
        chinese: "工作很累",
        pinyin: "Gōngzuò hěn lèi",
        en: "Work is tiring.",
        vi: "Công việc mệt.",
      },
      {
        chinese: "加班",
        pinyin: "jiābān",
        en: "to work overtime",
        vi: "tăng ca / làm thêm giờ",
        note_vi: "Văn hóa '996' (9h sáng → 9h tối, 6 ngày/tuần) là chủ đề nóng ở Trung Quốc.",
      },
    ],
    grammar_notes_vi: [
      "Nghề nghiệp: 是 + nghề. 我是医生 (tôi là bác sĩ).",
      "做 (zuò) = làm. 做什么工作？= làm công việc gì?",
      "师 (shī) = bậc thầy/chuyên gia. Xuất hiện trong nhiều nghề: 老师, 工程师, 厨师.",
    ],
    practice_tip_vi:
      "Học tên 10 nghề nghiệp phổ biến. Tập giới thiệu: 我是...，我在...工作。Hỏi 3 người bạn nghề nghiệp của họ.",
  },

  // ================================================================
  // Lesson 19 — Hobbies
  // ================================================================
  {
    id: "zh-hobbies",
    title_vi: "Sở thích — bạn thích làm gì?",
    title_en: "Hobbies — what do you like to do?",
    intro_vi:
      "Nói về sở thích là cách tốt nhất để kết bạn ở Trung Quốc. Người Trung Quốc thích hỏi về sở thích — từ đọc sách, xem phim đến chơi thể thao. Học nói về những gì bạn THÍCH và KHÔNG THÍCH.",
    sentences: [
      {
        chinese: "你有什么爱好？",
        pinyin: "Nǐ yǒu shénme àihào?",
        en: "What are your hobbies?",
        vi: "Bạn có sở thích gì?",
      },
      {
        chinese: "我喜欢看书",
        pinyin: "Wǒ xǐhuan kàn shū",
        en: "I like reading.",
        vi: "Tôi thích đọc sách.",
        note_vi: "喜欢 (xǐhuan) + động từ = thích làm gì.",
      },
      {
        chinese: "我喜欢听音乐",
        pinyin: "Wǒ xǐhuan tīng yīnyuè",
        en: "I like listening to music.",
        vi: "Tôi thích nghe nhạc.",
      },
      {
        chinese: "我喜欢看电影",
        pinyin: "Wǒ xǐhuan kàn diànyǐng",
        en: "I like watching movies.",
        vi: "Tôi thích xem phim.",
      },
      {
        chinese: "我不喜欢运动",
        pinyin: "Wǒ bù xǐhuan yùndòng",
        en: "I don't like sports.",
        vi: "Tôi không thích thể thao.",
      },
      {
        chinese: "我喜欢打篮球",
        pinyin: "Wǒ xǐhuan dǎ lánqiú",
        en: "I like playing basketball.",
        vi: "Tôi thích chơi bóng rổ.",
        note_vi: "打 (dǎ) = chơi (thể thao dùng tay). 踢 (tī) = đá (bóng đá).",
      },
      {
        chinese: "周末你喜欢做什么？",
        pinyin: "Zhōumò nǐ xǐhuan zuò shénme?",
        en: "What do you like to do on weekends?",
        vi: "Cuối tuần bạn thích làm gì?",
      },
    ],
    grammar_notes_vi: [
      "喜欢 (xǐhuan) + danh từ/động từ = thích cái gì / thích làm gì.",
      "Phủ định: 不喜欢. Không dùng 不有 mà dùng 没有.",
      "打球 (dǎ qiú) = chơi bóng. 打 cho thể thao dùng tay, 踢 cho thể thao dùng chân.",
      "会 (huì) = biết (kỹ năng). 我会游泳 (tôi biết bơi).",
    ],
    practice_tip_vi:
      "Viết 5 câu về sở thích của bạn. Sau đó viết 3 câu về những gì bạn KHÔNG thích. Tập nói với giọng tự nhiên.",
  },

  // ================================================================
  // Lesson 20 — Phone and digital life
  // ================================================================
  {
    id: "zh-phone",
    title_vi: "Điện thoại và cuộc sống số",
    title_en: "Phone and digital life",
    intro_vi:
      "Trung Quốc là xã hội 'mobile-first' — mọi thứ từ đặt đồ ăn đến thanh toán đều qua điện thoại. WeChat không chỉ là app nhắn tin mà là HỆ ĐIỀU HÀNH của cuộc sống. Bài này dạy từ vựng công nghệ và giao tiếp qua điện thoại.",
    sentences: [
      {
        chinese: "你的手机号是多少？",
        pinyin: "Nǐ de shǒujī hào shì duōshao?",
        en: "What's your phone number?",
        vi: "Số điện thoại của bạn là bao nhiêu?",
        note_vi: "手机 (shǒujī) = điện thoại di động. Lit: 'máy cầm tay'.",
      },
      {
        chinese: "加个微信吧",
        pinyin: "Jiā ge Wēixìn ba",
        en: "Let's add each other on WeChat.",
        vi: "Thêm WeChat đi.",
        note_vi: "Đây là câu NGƯỜI TRUNG QUỐC NÓI NHIỀU NHẤT khi gặp người mới.",
      },
      {
        chinese: "扫一扫",
        pinyin: "sǎo yī sǎo",
        en: "Scan (the QR code).",
        vi: "Quét (mã QR).",
        note_vi: "Cách thêm bạn WeChat: quét mã QR của nhau.",
      },
      {
        chinese: "你微信号是多少？",
        pinyin: "Nǐ Wēixìn hào shì duōshao?",
        en: "What's your WeChat ID?",
        vi: "WeChat ID của bạn là gì?",
      },
      {
        chinese: "可以加你的微信吗？",
        pinyin: "Kěyǐ jiā nǐ de Wēixìn ma?",
        en: "Can I add you on WeChat?",
        vi: "Có thể thêm WeChat của bạn không?",
      },
      {
        chinese: "我发短信给你",
        pinyin: "Wǒ fā duǎnxìn gěi nǐ",
        en: "I'll send you a text.",
        vi: "Tôi nhắn tin cho bạn.",
      },
      {
        chinese: "上网、Wi-Fi密码",
        pinyin: "shàngwǎng, Wi-Fi mìmǎ",
        en: "go online, Wi-Fi password",
        vi: "lên mạng, mật khẩu Wi-Fi",
        note_vi: "Wi-Fi密码是多少？(Mật khẩu Wi-Fi là gì?) — câu QUAN TRỌNG ở quán cà phê.",
      },
      {
        chinese: "充电器、电池",
        pinyin: "chōngdiànqì, diànchí",
        en: "charger, battery",
        vi: "sạc, pin",
        note_vi: "我手机没电了 (Điện thoại tôi hết pin rồi).",
      },
    ],
    grammar_notes_vi: [
      "加 (jiā) = thêm. 加微信 = thêm WeChat. Đây là động từ thiết yếu trong xã hội Trung Quốc.",
      "发 (fā) = gửi. 发短信 (gửi tin nhắn), 发邮件 (gửi email), 发红包 (gửi lì xì WeChat).",
      "吧 (ba) cuối câu = đề nghị nhẹ nhàng. 加个微信吧 (thêm WeChat đi).",
    ],
    practice_tip_vi:
      "Nếu có bạn Trung Quốc, thực hành thêm WeChat và nhắn tin bằng tiếng Trung. Nếu không, tập với app HelloTalk.",
  },
];

export default CHINESE_LESSONS;
