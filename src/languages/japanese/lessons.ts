// src/languages/japanese/lessons.ts
//
// Five starter lessons for Vietnamese learners of Japanese.
// Each lesson covers one foundational topic: hiragana, greetings,
// numbers, particles, basic verbs. Lesson shape mirrors the
// hospitality profession-pack pattern: bilingual title, sentences
// with Vietnamese gloss, and practical teaching notes in Vietnamese.
//
// Content is hand-crafted from real Japanese textbooks and classroom
// practice with VN learners.

export type JapaneseLessonSentence = {
  japanese: string;
  romaji: string;
  en: string;
  vi: string;
  note_vi?: string;
};

export type JapaneseLesson = {
  id: string;
  title_vi: string;
  title_en: string;
  intro_vi: string;
  sentences: JapaneseLessonSentence[];
  grammar_notes_vi: string[];
  practice_tip_vi: string;
};

const JAPANESE_LESSONS: JapaneseLesson[] = [
  // ================================================================
  // Lesson 1 — Hiragana
  // ================================================================
  {
    id: "jp-hiragana",
    title_vi: "Bảng chữ Hiragana — nền tảng tiếng Nhật",
    title_en: "Hiragana — the foundation of Japanese",
    intro_vi:
      "Hiragana là bảng chữ cái đầu tiên người Việt học tiếng Nhật cần nắm. 46 ký tự, mỗi ký tự là một âm tiết. Học hiragana xong là bạn đọc được ~70% văn bản tiếng Nhật cơ bản. Bài này tập trung vào 5 nguyên âm (a-i-u-e-o) và 10 phụ âm đầu tiên.",
    sentences: [
      {
        japanese: "あ",
        romaji: "a",
        en: "a (as in 'father')",
        vi: "a (như 'ba')",
        note_vi: "Nguyên âm đầu tiên. Miệng mở rộng, lưỡi thấp.",
      },
      {
        japanese: "い",
        romaji: "i",
        en: "i (as in 'see')",
        vi: "i (như 'đi')",
        note_vi: "Giống 'i' tiếng Việt. Không kéo dài.",
      },
      {
        japanese: "う",
        romaji: "u",
        en: "u (as in 'food' but shorter)",
        vi: "u (như 'tủ' nhưng môi không chu ra nhiều)",
        note_vi: "Âm 'u' Nhật môi hơi tròn nhẹ — không chu ra như tiếng Việt.",
      },
      {
        japanese: "え",
        romaji: "e",
        en: "e (as in 'bet')",
        vi: "e (như 'mẹ')",
        note_vi: "Giống 'ê' tiếng Việt hơn là 'e'. Đừng đọc thành 'ê dài'.",
      },
      {
        japanese: "お",
        romaji: "o",
        en: "o (as in 'go')",
        vi: "o (như 'cô')",
        note_vi: "Môi tròn vừa phải. Không đọc thành 'ô' dài.",
      },
      {
        japanese: "か",
        romaji: "ka",
        en: "ka",
        vi: "ka (như 'ca' hát)",
        note_vi: "Âm /k/ nhẹ, không bật hơi như tiếng Việt. Nghe gần 'ga' hơn 'ca'.",
      },
      {
        japanese: "き",
        romaji: "ki",
        en: "ki",
        vi: "ki (như 'kí')",
        note_vi: "Âm /k/ trước /i/ nghe hơi khác — gần 'ky' nhẹ.",
      },
      {
        japanese: "く",
        romaji: "ku",
        en: "ku",
        vi: "ku (như 'cú')",
        note_vi: "Âm 'u' ở đây gần như biến mất trong hội thoại nhanh.",
      },
      {
        japanese: "け",
        romaji: "ke",
        en: "ke",
        vi: "ke (như 'kê')",
      },
      {
        japanese: "こ",
        romaji: "ko",
        en: "ko",
        vi: "ko (như 'cô')",
      },
      {
        japanese: "さ",
        romaji: "sa",
        en: "sa",
        vi: "sa (như 'xa')",
        note_vi: "Không phải 'sờ' nặng. Nhẹ, đầu lưỡi chạm răng trên.",
      },
      {
        japanese: "し",
        romaji: "shi",
        en: "shi (like 'she')",
        vi: "shi (gần 'si' nhưng nghe như 'shi' trong 'she')",
        note_vi: "Đây là âm khó — VN hay đọc nhầm thành 'si'. Thực ra gần 'shi' tiếng Anh.",
      },
      {
        japanese: "す",
        romaji: "su",
        en: "su",
        vi: "su (như 'xu')",
        note_vi: "Âm 'u' gần biến mất cuối từ — 'desu' đọc là 'des'.",
      },
      {
        japanese: "せ",
        romaji: "se",
        en: "se",
        vi: "se (như 'xê')",
      },
      {
        japanese: "そ",
        romaji: "so",
        en: "so",
        vi: "so (như 'xô')",
      },
    ],
    grammar_notes_vi: [
      "Mỗi ký tự hiragana là MỘT âm tiết — không có phụ âm đứng riêng (trừ ん /n/).",
      "Thứ tự nét (kakijun) quan trọng — viết sai thứ tự thì chữ nhìn không đẹp.",
      "Học theo hàng ngang (a-ka-sa-ta-na...) hiệu quả hơn học theo cột dọc.",
      "Dùng app viết tay (Kanji Study, Ringotan) 10 phút/ngày để nhớ mặt chữ.",
    ],
    practice_tip_vi:
      "Viết mỗi chữ 10 lần ra giấy kẻ ô vuông, vừa viết vừa đọc to. Sau 3 ngày bạn nhớ cả bảng. Không cần học hết một lần — 5 chữ/ngày là đủ.",
  },

  // ================================================================
  // Lesson 2 — Greetings
  // ================================================================
  {
    id: "jp-greetings",
    title_vi: "Chào hỏi cơ bản — ai cũng cần",
    title_en: "Basic greetings everyone needs",
    intro_vi:
      "Tiếng Nhật có chào hỏi theo thời gian trong ngày và theo ngữ cảnh (trang trọng vs thân mật). Bài này dạy 12 câu chào phổ biến nhất — đủ để bạn không bị 'đứng hình' khi gặp người Nhật lần đầu.",
    sentences: [
      {
        japanese: "おはようございます",
        romaji: "ohayō gozaimasu",
        en: "Good morning (polite)",
        vi: "Chào buổi sáng (lịch sự)",
        note_vi: "Dùng trước ~10h sáng. Với bạn bè có thể nói gọn 'ohayō'.",
      },
      {
        japanese: "こんにちは",
        romaji: "konnichiwa",
        en: "Hello / Good afternoon",
        vi: "Xin chào (ban ngày)",
        note_vi: "Dùng từ ~10h đến tối. Chữ は đọc là 'wa' trong câu này — đây là trợ từ cổ.",
      },
      {
        japanese: "こんばんは",
        romaji: "konbanwa",
        en: "Good evening",
        vi: "Chào buổi tối",
        note_vi: "Tương tự konnichiwa — は đọc là 'wa'.",
      },
      {
        japanese: "おやすみなさい",
        romaji: "oyasuminasai",
        en: "Good night (polite)",
        vi: "Chúc ngủ ngon (lịch sự)",
        note_vi: "Với bạn bè / người thân: 'oyasumi'.",
      },
      {
        japanese: "ありがとうございます",
        romaji: "arigatō gozaimasu",
        en: "Thank you (polite)",
        vi: "Cảm ơn (lịch sự)",
        note_vi: "Cảm ơn suồng sã: 'arigatō'. Cảm ơn quá khứ: 'arigatō gozaimashita'.",
      },
      {
        japanese: "すみません",
        romaji: "sumimasen",
        en: "Excuse me / I'm sorry",
        vi: "Xin lỗi / Xin làm phiền",
        note_vi: "Dùng ĐA NĂNG: gọi phục vụ, xin lỗi nhẹ, cảm ơn khi ai giúp mình.",
      },
      {
        japanese: "ごめんなさい",
        romaji: "gomennasai",
        en: "I'm sorry (apology)",
        vi: "Xin lỗi (nhận lỗi)",
        note_vi: "Khác sumimasen — gomennasai là xin lỗi vì lỗi của mình.",
      },
      {
        japanese: "はい",
        romaji: "hai",
        en: "Yes",
        vi: "Vâng / Dạ",
        note_vi: "Người Nhật nói 'hai' rất nhiều — không nhất thiết là đồng ý, mà là 'tôi đang nghe'.",
      },
      {
        japanese: "いいえ",
        romaji: "iie",
        en: "No",
        vi: "Không",
        note_vi: "Người Nhật ít nói 'iie' trực tiếp — thường né bằng 'chotto...'.",
      },
      {
        japanese: "はじめまして",
        romaji: "hajimemashite",
        en: "Nice to meet you (first time)",
        vi: "Rất vui được gặp (lần đầu)",
        note_vi: "Chỉ dùng khi gặp LẦN ĐẦU. Sau đó dùng ohayō/konnichiwa.",
      },
      {
        japanese: "よろしくお願いします",
        romaji: "yoroshiku onegai shimasu",
        en: "Please treat me well / I'm in your care",
        vi: "Mong được giúp đỡ / Rất mong được hợp tác",
        note_vi: "Câu 'quốc dân' — không dịch sát được. Dùng sau hajimemashite và trong vô số ngữ cảnh.",
      },
      {
        japanese: "さようなら",
        romaji: "sayōnara",
        en: "Goodbye (formal / long-term)",
        vi: "Tạm biệt (trang trọng / lâu dài)",
        note_vi: "Người Nhật ít dùng hằng ngày — nghe như 'chia tay lâu'. Hằng ngày dùng 'ja mata' hoặc 'baibai'.",
      },
    ],
    grammar_notes_vi: [
      "ございます (gozaimasu) là đuôi lịch sự — thêm vào sau tính từ, cảm ơn, chào buổi sáng.",
      "は đọc là 'wa' khi nó là trợ từ (konnichiwa, konbanwa) — nhầm lẫn phổ biến của người mới học.",
      "Cúi đầu (ojigi) đi kèm chào — góc 15° cho chào thường, 30° cho cảm ơn/xin lỗi, 45° cho trang trọng.",
    ],
    practice_tip_vi:
      "Tập 4 câu theo thời gian trong ngày trước gương: ohayō gozaimasu (sáng) → konnichiwa (trưa/chiều) → konbanwa (tối) → oyasuminasai (đi ngủ). Làm 3 lần/ngày trong 1 tuần là thành phản xạ.",
  },

  // ================================================================
  // Lesson 3 — Numbers
  // ================================================================
  {
    id: "jp-numbers",
    title_vi: "Số đếm và cách đếm đồ vật",
    title_en: "Numbers and counting things",
    intro_vi:
      "Tiếng Nhật có hai hệ số: Native Japanese (hitotsu, futatsu...) và Sino-Japanese (ichi, ni, san...). Lại còn có 'counter words' (trợ từ đếm) — mỗi loại đồ vật có một cách đếm riêng. Bài này tập trung số Sino-Japanese (dùng nhiều nhất) và 3 loại counter phổ biến.",
    sentences: [
      {
        japanese: "一",
        romaji: "ichi",
        en: "one",
        vi: "một",
      },
      {
        japanese: "二",
        romaji: "ni",
        en: "two",
        vi: "hai",
        note_vi: "Phân biệt với に (trợ từ chỉ nơi chốn).",
      },
      {
        japanese: "三",
        romaji: "san",
        en: "three",
        vi: "ba",
        note_vi: "Phân biệt với -san (cách gọi người: Tanaka-san).",
      },
      {
        japanese: "四",
        romaji: "yon / shi",
        en: "four",
        vi: "bốn",
        note_vi: "Dùng 'yon' trong hội thoại hằng ngày vì 'shi' đồng âm với chữ 'chết' (死).",
      },
      {
        japanese: "五",
        romaji: "go",
        en: "five",
        vi: "năm",
      },
      {
        japanese: "六",
        romaji: "roku",
        en: "six",
        vi: "sáu",
      },
      {
        japanese: "七",
        romaji: "nana / shichi",
        en: "seven",
        vi: "bảy",
        note_vi: "Dùng 'nana' phổ biến hơn. Shichi dễ nhầm với ichi.",
      },
      {
        japanese: "八",
        romaji: "hachi",
        en: "eight",
        vi: "tám",
      },
      {
        japanese: "九",
        romaji: "kyū / ku",
        en: "nine",
        vi: "chín",
        note_vi: "Dùng 'kyū'. 'ku' đồng âm với chữ 'khổ' (苦).",
      },
      {
        japanese: "十",
        romaji: "jū",
        en: "ten",
        vi: "mười",
      },
      {
        japanese: "百",
        romaji: "hyaku",
        en: "hundred",
        vi: "trăm",
        note_vi: "300 = sanbyaku (không phải san-hyaku). 600 = roppyaku. 800 = happyaku.",
      },
      {
        japanese: "千",
        romaji: "sen",
        en: "thousand",
        vi: "nghìn",
        note_vi: "3000 = sanzen (không phải san-sen). 8000 = hassen.",
      },
      {
        japanese: "万",
        romaji: "man",
        en: "ten thousand",
        vi: "vạn / mười nghìn",
        note_vi: "Nhật đếm theo 万 (4 số 0), không theo nghìn (3 số 0). 100,000 = jū-man (10 vạn).",
      },
      {
        japanese: "いくらですか",
        romaji: "ikura desu ka",
        en: "How much is it?",
        vi: "Cái này bao nhiêu tiền?",
        note_vi: "Câu hỏi giá tiền phổ biến nhất.",
      },
      {
        japanese: "一つ",
        romaji: "hitotsu",
        en: "one (thing)",
        vi: "một cái",
        note_vi: "Counter chung cho đồ vật: hitotsu, futatsu, mittsu, yottsu, itsutsu...",
      },
    ],
    grammar_notes_vi: [
      "Hệ đếm Nhật theo 万 (man = 10,000) — khác cách đếm nghìn của Việt Nam. 1,000,000 = hyaku-man (100 vạn).",
      "Số 4 và 9 có cách đọc 'tử tế' — tránh âm đồng với 'chết' (shi) và 'khổ' (ku).",
      "Counter words BẮT BUỘC — không thể nói 'ni hon' (2 chai) mà phải nói 'ni-hon' với counter 本.",
      "Ngày trong tháng: tsuitachi (ngày 1), futsuka (ngày 2)... đây là hệ native Japanese.",
    ],
    practice_tip_vi:
      "Học thuộc 1→10 Sino-Japanese như đọc bảng cửu chương. Sau đó tập đếm ngược 10→1. Cuối cùng tập đọc số tiền: ¥350 = sanbyaku gojū en. ¥1,500 = sen gohyaku en.",
  },

  // ================================================================
  // Lesson 4 — Particles (trợ từ)
  // ================================================================
  {
    id: "jp-particles",
    title_vi: "Trợ từ — xương sống của câu tiếng Nhật",
    title_en: "Particles — the backbone of Japanese sentences",
    intro_vi:
      "Trợ từ (joshi) là từ nhỏ đứng sau danh từ để chỉ vai trò trong câu: chủ ngữ, tân ngữ, nơi chốn, phương hướng... Tiếng Việt không có khái niệm này nên người Việt hay quên hoặc dùng sai. 6 trợ từ trong bài này chiếm ~80% trợ từ bạn gặp hằng ngày.",
    sentences: [
      {
        japanese: "私はベトナム人です",
        romaji: "watashi wa betonamujin desu",
        en: "I am Vietnamese.",
        vi: "Tôi là người Việt Nam.",
        note_vi: "は (viết là 'ha' nhưng đọc 'wa') — trợ từ chủ đề. Đánh dấu 'đây là cái tôi đang nói đến'.",
      },
      {
        japanese: "水を飲みます",
        romaji: "mizu o nomimasu",
        en: "I drink water.",
        vi: "Tôi uống nước.",
        note_vi: "を (wo/o) — trợ từ tân ngữ trực tiếp. Đánh dấu thứ bị tác động bởi động từ.",
      },
      {
        japanese: "学校に行きます",
        romaji: "gakkō ni ikimasu",
        en: "I go to school.",
        vi: "Tôi đến trường.",
        note_vi: "に (ni) — trợ từ chỉ đích đến hoặc thời điểm.",
      },
      {
        japanese: "駅で会いましょう",
        romaji: "eki de aimashō",
        en: "Let's meet at the station.",
        vi: "Gặp nhau ở ga nhé.",
        note_vi: "で (de) — trợ từ chỉ nơi hành động xảy ra. Phân biệt: ni = đích đến, de = nơi làm gì.",
      },
      {
        japanese: "学校へ行きます",
        romaji: "gakkō e ikimasu",
        en: "I go to school. (direction emphasis)",
        vi: "Tôi đi về phía trường.",
        note_vi: "へ (viết 'he' đọc 'e') — trợ từ chỉ hướng. Tương tự 'ni' nhưng nhấn hướng đi.",
      },
      {
        japanese: "日本語と英語を話します",
        romaji: "nihongo to eigo o hanashimasu",
        en: "I speak Japanese and English.",
        vi: "Tôi nói tiếng Nhật và tiếng Anh.",
        note_vi: "と (to) — trợ từ liệt kê 'và'. Chỉ dùng cho danh từ.",
      },
      {
        japanese: "これ は 何 です か",
        romaji: "kore wa nan desu ka",
        en: "What is this?",
        vi: "Đây là cái gì?",
        note_vi: "か (ka) — trợ từ cuối câu tạo câu hỏi. Tiếng Nhật không cần dấu hỏi (?).",
      },
      {
        japanese: "コーヒー も ください",
        romaji: "kōhī mo kudasai",
        en: "Coffee too, please.",
        vi: "Cho tôi cà phê nữa ạ.",
        note_vi: "も (mo) — trợ từ 'cũng'. Thay thế は/を khi muốn nói 'cũng'.",
      },
      {
        japanese: "友達 の 本",
        romaji: "tomodachi no hon",
        en: "friend's book",
        vi: "sách của bạn",
        note_vi: "の (no) — trợ từ sở hữu 'của'. Cực kỳ phổ biến.",
      },
      {
        japanese: "ペン が あります",
        romaji: "pen ga arimasu",
        en: "There is a pen.",
        vi: "Có cây bút.",
        note_vi: "が (ga) — trợ từ chủ ngữ. Phân biệt với は (wa): ga nhấn chủ ngữ, wa nhấn chủ đề.",
      },
      {
        japanese: "七時 に 起きます",
        romaji: "shichiji ni okimasu",
        en: "I wake up at 7 o'clock.",
        vi: "Tôi thức dậy lúc 7 giờ.",
        note_vi: "に chỉ thời điểm cụ thể. Không dùng に với từ chỉ thời gian tương đối (mai, hôm qua...).",
      },
      {
        japanese: "バス で 行きます",
        romaji: "basu de ikimasu",
        en: "I go by bus.",
        vi: "Tôi đi bằng xe buýt.",
        note_vi: "で còn chỉ phương tiện. 'Bằng X' = X + de.",
      },
    ],
    grammar_notes_vi: [
      "Trợ từ đứng SAU danh từ nó bổ nghĩa — ngược với giới từ tiếng Việt (đứng trước).",
      "Câu tiếng Nhật SOV (chủ-tân-động): 'Tôi sushi ăn' chứ không phải 'Tôi ăn sushi'.",
      "は vs が là cặp khó nhất cho người Việt. Quy tắc đơn giản: は = 'nói về...', が = 'ai/cái gì làm...'.",
      "Có thể bỏ chủ ngữ nếu ngữ cảnh rõ — 'nomimasu' (uống) đã là một câu hoàn chỉnh.",
    ],
    practice_tip_vi:
      "Tập đặt câu với mỗi trợ từ, dùng vocab đã học. Mẫu: [N] は [N] です。 [N] を [V]。 [N] に [V]。 Viết 3 câu mỗi trợ từ, đọc to.",
  },

  // ================================================================
  // Lesson 5 — Basic verbs (masu-form)
  // ================================================================
  {
    id: "jp-basic-verbs",
    title_vi: "Động từ cơ bản — dạng masu",
    title_en: "Basic verbs — masu form",
    intro_vi:
      "Động từ tiếng Nhật có nhiều dạng chia, nhưng dạng masu (lịch sự) là quan trọng nhất cho người mới học — dùng được trong mọi tình huống lịch sự hằng ngày. Có 3 nhóm động từ: nhóm 1 (u-verbs), nhóm 2 (ru-verbs), nhóm 3 (bất quy tắc — chỉ có 2 từ). Bài này dạy cách chia masu và dùng trong câu đơn giản.",
    sentences: [
      {
        japanese: "食べます",
        romaji: "tabemasu",
        en: "I eat / I will eat.",
        vi: "Tôi ăn / Tôi sẽ ăn.",
        note_vi: "Nhóm 2: 食べる (taberu) → bỏ る + ます = 食べます.",
      },
      {
        japanese: "飲みます",
        romaji: "nomimasu",
        en: "I drink / I will drink.",
        vi: "Tôi uống / Tôi sẽ uống.",
        note_vi: "Nhóm 1: 飲む (nomu) → mu → mi + masu = 飲みます.",
      },
      {
        japanese: "行きます",
        romaji: "ikimasu",
        en: "I go / I will go.",
        vi: "Tôi đi / Tôi sẽ đi.",
        note_vi: "Nhóm 1: 行く (iku) → ku → ki + masu = 行きます.",
      },
      {
        japanese: "来ます",
        romaji: "kimasu",
        en: "I come / I will come.",
        vi: "Tôi đến / Tôi sẽ đến.",
        note_vi: "Nhóm 3 (bất quy tắc): 来る (kuru) → 来ます (kimasu). Đây là 1 trong 2 động từ bất quy tắc.",
      },
      {
        japanese: "します",
        romaji: "shimasu",
        en: "I do / I will do.",
        vi: "Tôi làm / Tôi sẽ làm.",
        note_vi: "Nhóm 3 (bất quy tắc): する (suru) → します (shimasu). Cực kỳ phổ biến.",
      },
      {
        japanese: "見ます",
        romaji: "mimasu",
        en: "I see / I watch / I will see.",
        vi: "Tôi xem / Tôi sẽ xem.",
        note_vi: "Nhóm 2: 見る (miru) → 見ます.",
      },
      {
        japanese: "聞きます",
        romaji: "kikimasu",
        en: "I listen / I ask / I will listen.",
        vi: "Tôi nghe / Tôi hỏi / Tôi sẽ nghe.",
        note_vi: "Nhóm 1: 聞く (kiku) → 聞きます.",
      },
      {
        japanese: "話します",
        romaji: "hanashimasu",
        en: "I speak / I will speak.",
        vi: "Tôi nói / Tôi sẽ nói.",
        note_vi: "Nhóm 1: 話す (hanasu) → su → shi + masu = 話します.",
      },
      {
        japanese: "読みます",
        romaji: "yomimasu",
        en: "I read / I will read.",
        vi: "Tôi đọc / Tôi sẽ đọc.",
        note_vi: "Nhóm 1: 読む (yomu) → mu → mi + masu = 読みます.",
      },
      {
        japanese: "書きます",
        romaji: "kakimasu",
        en: "I write / I will write.",
        vi: "Tôi viết / Tôi sẽ viết.",
        note_vi: "Nhóm 1: 書く (kaku) → 書きます.",
      },
      {
        japanese: "買います",
        romaji: "kaimasu",
        en: "I buy / I will buy.",
        vi: "Tôi mua / Tôi sẽ mua.",
        note_vi: "Nhóm 1: 買う (kau) → u → i + masu = 買います.",
      },
      {
        japanese: "何を食べますか",
        romaji: "nani o tabemasu ka",
        en: "What will you eat?",
        vi: "Bạn ăn gì?",
        note_vi: "Câu hỏi với masu: cứ thêm か cuối câu.",
      },
      {
        japanese: "食べません",
        romaji: "tabemasen",
        en: "I don't eat / I won't eat.",
        vi: "Tôi không ăn.",
        note_vi: "Phủ định: masu → masen.",
      },
      {
        japanese: "食べました",
        romaji: "tabemashita",
        en: "I ate.",
        vi: "Tôi đã ăn.",
        note_vi: "Quá khứ: masu → mashita.",
      },
      {
        japanese: "食べませんでした",
        romaji: "tabemasen deshita",
        en: "I didn't eat.",
        vi: "Tôi đã không ăn.",
        note_vi: "Quá khứ phủ định: masen + deshita.",
      },
    ],
    grammar_notes_vi: [
      "Masu-form dùng cho hiện tại và tương lai (tiếng Nhật không phân biệt thì hiện tại/tương lai ở dạng này).",
      "Nhóm 1 (u-verbs): đổi âm cuối sang hàng i rồi thêm masu. ku→ki, mu→mi, su→shi, u→i, ru→ri...",
      "Nhóm 2 (ru-verbs): bỏ ru, thêm masu. Dễ nhất.",
      "Nhóm 3: CHỈ có kuru (đến) và suru (làm) — học thuộc hai từ này là xong nhóm 3.",
      "Masu-form có 4 biến thể chính: masu (khẳng định), masen (phủ định), mashita (quá khứ), masen deshita (quá khứ phủ định).",
    ],
    practice_tip_vi:
      "Lấy 5 động từ trong vocabulary, chia 4 dạng: masu / masen / mashita / masen deshita. Viết ra giấy, đọc to từng dạng. Làm với 5 động từ mới mỗi ngày cho đến khi thuộc hết 50 từ đã học.",
  },

  // ================================================================
  // Lesson 6 — Katakana
  // ================================================================
  {
    id: "jp-katakana",
    title_vi: "Katakana — đọc từ mượn tiếng nước ngoài",
    title_en: "Katakana — reading loan words",
    intro_vi:
      "Katakana là bảng chữ cái thứ hai của tiếng Nhật, chủ yếu dùng để viết từ mượn nước ngoài (gairaigo). Với người Việt, katakana đặc biệt quan trọng vì có thể kết nối từ tiếng Anh sang katakana để đoán nghĩa. Cùng 46 ký tự như hiragana nhưng nét góc cạnh hơn.",
    sentences: [
      {
        japanese: "コーヒー",
        romaji: "kōhī",
        en: "coffee",
        vi: "cà phê",
        note_vi: "Dấu ー kéo dài nguyên âm. 'Kōhī' — đọc kéo dài 'kō' và 'hī'.",
      },
      {
        japanese: "パン",
        romaji: "pan",
        en: "bread",
        vi: "bánh mì",
        note_vi: "Mượn từ tiếng Bồ Đào Nha 'pão'. Không phải từ tiếng Anh.",
      },
      {
        japanese: "テレビ",
        romaji: "terebi",
        en: "television / TV",
        vi: "tivi",
      },
      {
        japanese: "コンピューター",
        romaji: "konpyūtā",
        en: "computer",
        vi: "máy tính",
        note_vi: "Từ 'computer' rút gọn. Đọc: kom-pyuu-taa.",
      },
      {
        japanese: "アルバイト",
        romaji: "arubaito",
        en: "part-time job",
        vi: "việc làm thêm",
        note_vi: "Mượn từ tiếng Đức 'Arbeit'. Thường rút gọn là バイト (baito).",
      },
      {
        japanese: "エアコン",
        romaji: "eakon",
        en: "air conditioner",
        vi: "máy lạnh",
        note_vi: "Viết tắt từ 'air conditioner'. Người Nhật hay rút gọn từ mượn.",
      },
      {
        japanese: "タクシー",
        romaji: "takushī",
        en: "taxi",
        vi: "taxi",
      },
      {
        japanese: "ホテル",
        romaji: "hoteru",
        en: "hotel",
        vi: "khách sạn",
      },
      {
        japanese: "メニュー",
        romaji: "menyū",
        en: "menu",
        vi: "thực đơn",
      },
      {
        japanese: "インターネット",
        romaji: "intānetto",
        en: "internet",
        vi: "mạng / internet",
      },
    ],
    grammar_notes_vi: [
      "Katakana có cùng âm đọc với hiragana — chỉ khác hình dáng chữ. Học katakana SAU khi thuộc hiragana.",
      "Dấu ー (bōsen) dùng ĐẶC BIỆT trong katakana để kéo dài nguyên âm. Không có trong hiragana.",
      "Từ mượn thường được rút gọn: personal computer → パソコン (pasokon), smartphone → スマホ (sumaho).",
    ],
    practice_tip_vi:
      "Tìm menu nhà hàng Nhật trên mạng — đọc phần katakana trước. Hầu hết món Tây trong menu Nhật viết bằng katakana. Đoán món từ âm đọc.",
  },

  // ================================================================
  // Lesson 7 — Kanji introduction
  // ================================================================
  {
    id: "jp-kanji-intro",
    title_vi: "Nhập môn Kanji — 20 chữ đầu tiên",
    title_en: "Kanji introduction — your first 20 characters",
    intro_vi:
      "Người Việt có lợi thế CỰC LỚN khi học kanji vì 60% từ Hán-Việt trùng nghĩa. Kanji không đáng sợ — học 20 chữ này là bạn đọc được biển hiệu, menu và tin nhắn cơ bản. Mỗi kanji có ít nhất 2 cách đọc: on'yomi (âm Hán-Nhật) và kun'yomi (âm thuần Nhật).",
    sentences: [
      {
        japanese: "日",
        romaji: "nichi / hi",
        en: "sun / day / Japan",
        vi: "mặt trời / ngày / Nhật",
        note_vi: "日本 (nihon) = Nhật Bản. 日曜日 (nichiyōbi) = chủ nhật.",
      },
      {
        japanese: "月",
        romaji: "getsu / tsuki",
        en: "moon / month",
        vi: "mặt trăng / tháng",
        note_vi: "月曜日 (getsuyōbi) = thứ hai. 一月 (ichigatsu) = tháng 1.",
      },
      {
        japanese: "火",
        romaji: "ka / hi",
        en: "fire",
        vi: "lửa",
        note_vi: "火曜日 (kayōbi) = thứ ba. 火事 (kaji) = hỏa hoạn.",
      },
      {
        japanese: "水",
        romaji: "sui / mizu",
        en: "water",
        vi: "nước",
        note_vi: "水曜日 (suiyōbi) = thứ tư. 水泳 (suiei) = bơi lội.",
      },
      {
        japanese: "木",
        romaji: "moku / ki",
        en: "tree / wood",
        vi: "cây / gỗ",
        note_vi: "木曜日 (mokuyōbi) = thứ năm. 木村 (kimura) = tên họ.",
      },
      {
        japanese: "金",
        romaji: "kin / kane",
        en: "gold / money / Friday",
        vi: "vàng / tiền / thứ sáu",
        note_vi: "金曜日 (kin'yōbi) = thứ sáu. お金 (okane) = tiền.",
      },
      {
        japanese: "土",
        romaji: "do / tsuchi",
        en: "earth / soil / Saturday",
        vi: "đất / thứ bảy",
        note_vi: "土曜日 (doyōbi) = thứ bảy. 土地 (tochi) = đất đai.",
      },
      {
        japanese: "山",
        romaji: "san / yama",
        en: "mountain",
        vi: "núi",
        note_vi: "富士山 (fujisan) = núi Phú Sĩ. 山口 (yamaguchi) = tên họ.",
      },
      {
        japanese: "川",
        romaji: "sen / kawa",
        en: "river",
        vi: "sông",
        note_vi: "Hình dáng chữ 川 giống dòng sông chảy.",
      },
      {
        japanese: "田",
        romaji: "den / ta",
        en: "rice field",
        vi: "ruộng lúa",
        note_vi: "Hình dáng 田 giống thửa ruộng chia ô. 田中 (tanaka) = tên họ phổ biến.",
      },
      {
        japanese: "入",
        romaji: "nyū / iri / hai(ru)",
        en: "enter / insert",
        vi: "vào",
        note_vi: "入口 (iriguchi) = lối vào. 入学 (nyūgaku) = nhập học.",
      },
      {
        japanese: "出",
        romaji: "shutsu / de(ru)",
        en: "exit / go out",
        vi: "ra / xuất",
        note_vi: "出口 (deguchi) = lối ra. 出発 (shuppatsu) = khởi hành.",
      },
    ],
    grammar_notes_vi: [
      "On'yomi (âm Hán): dùng khi kanji ghép với kanji khác. Ví dụ: 日本 (ni + hon) — cả hai đọc on'yomi.",
      "Kun'yomi (âm Nhật): dùng khi kanji đứng một mình hoặc với hiragana. Ví dụ: 出る (deru) — đọc kun'yomi.",
      "Bộ thủ (部首) gợi ý nghĩa. Mỗi kanji có MỘT bộ thủ chính. Học bộ thủ trước khi học kanji giúp nhớ nhanh gấp đôi.",
      "80 kanji đầu tiên (cấp N5) đủ để đọc hiểu biển báo, menu, email cơ bản. 20 kanji/bài × 4 bài = N5.",
    ],
    practice_tip_vi:
      "Mỗi ngày học 3 kanji mới. Viết ra giấy kẻ ô, ghi âm Hán-Việt bên cạnh (người Việt nhớ nghĩa qua Hán-Việt cực nhanh). Dùng app Anki hoặc WaniKani để ôn tập spaced repetition.",
  },

  // ================================================================
  // Lesson 8 — Polite vs casual speech
  // ================================================================
  {
    id: "jp-polite-casual",
    title_vi: "Lịch sự (desu/masu) và thân mật (casual)",
    title_en: "Polite vs casual speech",
    intro_vi:
      "Tiếng Nhật có hai mức nói chính: lịch sự (desu/masu-form) và thân mật (casual/dictionary form). Người mới học nên dùng lịch sự trong 90% tình huống. Nhưng bạn CẦN hiểu casual form vì người Nhật nói với nhau bằng casual — nếu không hiểu, bạn sẽ 'đứng hình' khi nghe hội thoại thật.",
    sentences: [
      {
        japanese: "私は学生です → 私は学生だ",
        romaji: "watashi wa gakusei desu → watashi wa gakusei da",
        en: "I am a student. (polite → casual)",
        vi: "Tôi là học sinh. (lịch sự → thân mật)",
        note_vi: "Desu → da. Đây là quy tắc cơ bản nhất.",
      },
      {
        japanese: "食べます → 食べる",
        romaji: "tabemasu → taberu",
        en: "I eat. (polite → casual)",
        vi: "Tôi ăn.",
        note_vi: "Masu-form → dictionary form. Động từ casual = dạng từ điển.",
      },
      {
        japanese: "食べません → 食べない",
        romaji: "tabemasen → tabenai",
        en: "I don't eat. (polite → casual)",
        vi: "Tôi không ăn.",
        note_vi: "Phủ định casual: nhóm 1 đổi âm cuối sang hàng a + nai. Nhóm 2: bỏ ru + nai.",
      },
      {
        japanese: "食べました → 食べた",
        romaji: "tabemashita → tabeta",
        en: "I ate. (polite → casual)",
        vi: "Tôi đã ăn.",
        note_vi: "Quá khứ casual = te-form rút gọn: ăn → ta.",
      },
      {
        japanese: "いいです → いい",
        romaji: "ii desu → ii",
        en: "It's good. (polite → casual)",
        vi: "Được / Tốt.",
        note_vi: "Tính từ đuôi い: chỉ cần BỎ desu. Đừng thêm 'da'.",
      },
      {
        japanese: "元気？",
        romaji: "genki?",
        en: "How are you? (casual)",
        vi: "Khỏe không?",
        note_vi: "Casual thường bỏ trợ từ: 元気ですか？→ 元気？",
      },
      {
        japanese: "何してるの？",
        romaji: "nani shiteru no?",
        en: "What are you doing? (casual)",
        vi: "Đang làm gì đấy?",
        note_vi: "している→してる (rút gọn). の cuối câu làm mềm câu hỏi.",
      },
      {
        japanese: "行く？",
        romaji: "iku?",
        en: "Wanna go? (casual)",
        vi: "Đi không?",
        note_vi: "Casual cực ngắn — lên giọng cuối là câu hỏi.",
      },
    ],
    grammar_notes_vi: [
      "Khi nào dùng lịch sự: người lạ, đồng nghiệp, người lớn tuổi, môi trường công sở.",
      "Khi nào dùng casual: bạn thân, gia đình, người nhỏ tuổi hơn, anime/manga (nhân vật dùng casual).",
      "Casual form không có nghĩa là 'thô lỗ' — đó là cách nói tự nhiên giữa người thân.",
      "Người nước ngoài dùng casual SAI ĐỐI TƯỢNG là lỗi phổ biến và nghiêm trọng. Luôn dùng lịch sự khi không chắc.",
    ],
    practice_tip_vi:
      "Xem 1 tập anime Nhật với phụ đề tiếng Nhật. Để ý khi nào nhân vật dùng desu/masu, khi nào dùng casual. Ghi lại 5 câu casual và dịch ra lịch sự.",
  },

  // ================================================================
  // Lesson 9 — Counter words
  // ================================================================
  {
    id: "jp-counter-words",
    title_vi: "Trợ từ đếm — つ/人/本/枚/匹",
    title_en: "Counter words — tsu/nin/hon/mai/hiki",
    intro_vi:
      "Tiếng Nhật có đếm đồ vật bằng 'counter words' (trợ từ đếm). KHÔNG thể nói 'ni ringo' (2 táo) mà phải nói 'ringo o futatsu' hoặc 'ni-ko no ringo'. Có ~100 counter words, nhưng 5 counter trong bài này chiếm ~70% tình huống thực tế.",
    sentences: [
      {
        japanese: "一つ、二つ、三つ",
        romaji: "hitotsu, futatsu, mittsu",
        en: "1 thing, 2 things, 3 things (general counter)",
        vi: "một cái, hai cái, ba cái (counter chung)",
        note_vi: "つ (tsu) là counter CHUNG cho đồ vật khi không biết counter riêng.",
      },
      {
        japanese: "一人、二人、三人",
        romaji: "hitori, futari, sannin",
        en: "1 person, 2 people, 3 people",
        vi: "một người, hai người, ba người",
        note_vi: "人 đọc là 'ri' cho 1 và 2, 'nin' từ 3 trở lên. BẤT QUY TẮC quan trọng.",
      },
      {
        japanese: "一本、二本、三本",
        romaji: "ippon, nihon, sanbon",
        en: "1, 2, 3 long things (bottles, pens, trees)",
        vi: "một chai, hai chai, ba chai (vật dài)",
        note_vi: "本: 1=iPPon, 2=niHon, 3=sanBon, 6=roPPon, 8=haPPon. Biến âm PHỨC TẠP.",
      },
      {
        japanese: "一枚、二枚、三枚",
        romaji: "ichimai, nimai, sanmai",
        en: "1, 2, 3 flat things (paper, tickets, shirts)",
        vi: "một tờ, hai tờ, ba tờ (vật phẳng)",
        note_vi: "枚 (mai) cho giấy, vé, áo sơ mi, đĩa CD. Không biến âm.",
      },
      {
        japanese: "一匹、二匹、三匹",
        romaji: "ippiki, nihiki, sanbiki",
        en: "1, 2, 3 small animals",
        vi: "một con, hai con, ba con (thú nhỏ)",
        note_vi: "匹 (hiki→piki→biki) cho chó, mèo, cá. 1=iPPiki, 3=sanBiki, 6=roPPiki.",
      },
      {
        japanese: "コーヒーを二つください",
        romaji: "kōhī o futatsu kudasai",
        en: "Two coffees, please.",
        vi: "Cho tôi hai cà phê ạ.",
        note_vi: "Dùng つ khi không biết counter riêng — người Nhật vẫn hiểu.",
      },
      {
        japanese: "ビールを三本ください",
        romaji: "bīru o sanbon kudasai",
        en: "Three bottles of beer, please.",
        vi: "Cho tôi ba chai bia ạ.",
        note_vi: "本 (hon/bon/pon) cho chai/lon. Đây là cách nói TỰ NHIÊN ở izakaya.",
      },
    ],
    grammar_notes_vi: [
      "Cấu trúc: SỐ + COUNTER + の + DANH TỪ, hoặc DANH TỪ + を + SỐ + COUNTER.",
      "Các counter dùng hệ Native Japanese (hitotsu, futatsu...) cho 1-10, Sino-Japanese cho >10.",
      "Biến âm (rendaku): /h/ → /b/ hoặc /p/ sau ん hoặc っ. Đây là quy tắc ngữ âm, không phải ngoại lệ.",
      "Khi KHÔNG BIẾT counter: dùng つ hoặc số Sino + 個 (ko). Người Nhật vẫn hiểu và đánh giá cao nỗ lực.",
    ],
    practice_tip_vi:
      "Đếm đồ vật trong phòng bằng tiếng Nhật: đếm sách (冊), bút (本), giấy (枚), người (人). Làm mỗi ngày 3 phút trong 1 tuần.",
  },

  // ================================================================
  // Lesson 10 — Adjectives
  // ================================================================
  {
    id: "jp-adjectives",
    title_vi: "Tính từ — đuôi い và đuôi な",
    title_en: "Adjectives — i-adjectives and na-adjectives",
    intro_vi:
      "Tiếng Nhật có 2 loại tính từ: i-adjectives (kết thúc bằng い) và na-adjectives (cần な khi đứng trước danh từ). Quy tắc chia thì/phủ định KHÁC NHAU giữa hai loại. Đây là một trong những điểm ngữ pháp quan trọng nhất cho người mới học — sai loại tính từ là sai cấu trúc câu.",
    sentences: [
      {
        japanese: "大きい猫",
        romaji: "ōkii neko",
        en: "a big cat",
        vi: "con mèo to",
        note_vi: "I-adjective đứng trực tiếp trước danh từ — không cần な.",
      },
      {
        japanese: "きれいな花",
        romaji: "kirei na hana",
        en: "a beautiful flower",
        vi: "bông hoa đẹp",
        note_vi: "Na-adjective cần な khi bổ nghĩa danh từ. Kirei KẾT THÚC bằng い nhưng LÀ na-adjective.",
      },
      {
        japanese: "この猫は大きいです",
        romaji: "kono neko wa ōkii desu",
        en: "This cat is big.",
        vi: "Con mèo này to.",
        note_vi: "I-adj làm vị ngữ: giữ nguyên + desu (lịch sự).",
      },
      {
        japanese: "この花はきれいです",
        romaji: "kono hana wa kirei desu",
        en: "This flower is beautiful.",
        vi: "Bông hoa này đẹp.",
        note_vi: "Na-adj làm vị ngữ: bỏ な + desu.",
      },
      {
        japanese: "大きくないです",
        romaji: "ōkikunai desu",
        en: "It's not big.",
        vi: "Không to.",
        note_vi: "I-adj phủ định: bỏ い cuối + くない. Đây là quy tắc CỐT LÕI.",
      },
      {
        japanese: "きれいじゃないです",
        romaji: "kirei janai desu",
        en: "It's not beautiful.",
        vi: "Không đẹp.",
        note_vi: "Na-adj phủ định: + じゃない (janai) hoặc ではない (dewa nai).",
      },
      {
        japanese: "大きかったです",
        romaji: "ōkikatta desu",
        en: "It was big.",
        vi: "Nó đã to.",
        note_vi: "I-adj quá khứ: bỏ い + かった. ōkii → ōkikatta.",
      },
      {
        japanese: "きれいでした",
        romaji: "kirei deshita",
        en: "It was beautiful.",
        vi: "Nó đã đẹp.",
        note_vi: "Na-adj quá khứ: desu → deshita. Đơn giản hơn i-adj!",
      },
    ],
    grammar_notes_vi: [
      "BẪY: きれい (kirei) và きらい (kirai) kết thúc bằng い nhưng LÀ NA-ADJECTIVE. Đây là ngoại lệ quan trọng.",
      "I-adjective: luôn kết thúc bằng い (trừ ngoại lệ trên). Chia phủ định = bỏ い + くない.",
      "Na-adjective: thường là từ Hán-Nhật (2 kanji) hoặc từ mượn. Dễ nhận biết hơn i-adj.",
      "Cả hai loại: khi đứng CUỐI CÂU làm vị ngữ, thêm です cho lịch sự.",
    ],
    practice_tip_vi:
      "Lấy 5 tính từ trong vocabulary. Chia 4 dạng: khẳng định / phủ định / quá khứ / quá khứ phủ định. Viết ra giấy. Làm với cả i-adj và na-adj.",
  },

  // ================================================================
  // Lesson 11 — Time and dates
  // ================================================================
  {
    id: "jp-telling-time",
    title_vi: "Giờ giấc và ngày tháng",
    title_en: "Telling time and dates",
    intro_vi:
      "Giờ và ngày tháng trong tiếng Nhật dùng hệ Sino-Japanese nhưng có vài điểm bất quy tắc. Biết nói giờ và ngày là kỹ năng sinh tồn: đặt lịch, tàu xe, hẹn gặp. Bài này dạy cách nói giờ, phút, ngày trong tuần, tháng và ngày trong tháng.",
    sentences: [
      {
        japanese: "今何時ですか",
        romaji: "ima nanji desu ka",
        en: "What time is it now?",
        vi: "Bây giờ là mấy giờ?",
      },
      {
        japanese: "三時です",
        romaji: "sanji desu",
        en: "It's 3 o'clock.",
        vi: "3 giờ.",
        note_vi: "Giờ đọc 'ji'. 4 giờ = 四時 (yoji, KHÔNG phải shiji hay yonji).",
      },
      {
        japanese: "三時半です",
        romaji: "sanji han desu",
        en: "It's 3:30.",
        vi: "3 giờ rưỡi.",
        note_vi: "半 (han) = rưỡi. Đơn giản!",
      },
      {
        japanese: "三時十分です",
        romaji: "sanji juppun desu",
        en: "It's 3:10.",
        vi: "3 giờ 10 phút.",
        note_vi: "Phút đọc 'fun/pun'. 1ppun, 3pun, 6ppun, 8ppun — biến âm.",
      },
      {
        japanese: "今日は何曜日ですか",
        romaji: "kyō wa nan'yōbi desu ka",
        en: "What day of the week is it today?",
        vi: "Hôm nay là thứ mấy?",
      },
      {
        japanese: "月曜日です",
        romaji: "getsuyōbi desu",
        en: "It's Monday.",
        vi: "Thứ hai.",
        note_vi: "Các thứ: 日月火水木金土 + 曜日. Dùng kanji đầu để viết tắt.",
      },
      {
        japanese: "今日は何日ですか",
        romaji: "kyō wa nannichi desu ka",
        en: "What's the date today?",
        vi: "Hôm nay ngày mấy?",
      },
      {
        japanese: "四月一日です",
        romaji: "shigatsu tsuitachi desu",
        en: "It's April 1st.",
        vi: "Ngày 1 tháng 4.",
        note_vi: "Tsuitachi = ngày 1 (BẤT QUY TẮC). Các ngày 1-10, 14, 20, 24 cũng bất quy tắc.",
      },
    ],
    grammar_notes_vi: [
      "Giờ bất quy tắc: 4時 = yoji (không phải yonji/shi), 7時 = shichiji (thường), 9時 = kuji.",
      "Phút biến âm: 1分 = ippun, 3分 = sanpun, 6分 = roppun, 8分 = happun, 10分 = juppun.",
      "Ngày trong tháng: 1-10, 14, 20, 24 dùng Native Japanese. Còn lại Sino-Japanese + nichi.",
      "Thứ trong tuần dùng Hán-Nhật, dễ nhớ: 日月火水木金土 = mặt trời, trăng, lửa, nước, cây, vàng, đất.",
    ],
    practice_tip_vi:
      "Mỗi ngày nói to: hôm nay là thứ mấy, ngày mấy, bây giờ là mấy giờ — bằng tiếng Nhật. Làm 3 lần/ngày. Sau 1 tuần bạn sẽ phản xạ tự nhiên.",
  },

  // ================================================================
  // Lesson 12 — Question words
  // ================================================================
  {
    id: "jp-asking-questions",
    title_vi: "Từ hỏi và cách đặt câu hỏi",
    title_en: "Question words and patterns",
    intro_vi:
      "Tiếng Nhật tạo câu hỏi bằng 2 cách: (1) thêm か cuối câu cho câu hỏi yes/no, (2) dùng từ hỏi (疑問詞) + か. Bài này dạy 10 từ hỏi phổ biến nhất và cách dùng chúng trong câu.",
    sentences: [
      {
        japanese: "これは何ですか",
        romaji: "kore wa nan desu ka",
        en: "What is this?",
        vi: "Đây là cái gì?",
        note_vi: "何 đọc là 'nan' trước desu, 'nani' trước ga/o.",
      },
      {
        japanese: "トイレはどこですか",
        romaji: "toire wa doko desu ka",
        en: "Where is the restroom?",
        vi: "Nhà vệ sinh ở đâu?",
      },
      {
        japanese: "誰ですか",
        romaji: "dare desu ka",
        en: "Who is it?",
        vi: "Ai đấy?",
        note_vi: "Lịch sự hơn: どなたですか (donata desu ka).",
      },
      {
        japanese: "いつ行きますか",
        romaji: "itsu ikimasu ka",
        en: "When are you going?",
        vi: "Khi nào bạn đi?",
        note_vi: "Từ hỏi thời gian không cần trợ từ sau nó.",
      },
      {
        japanese: "なぜ / どうして",
        romaji: "naze / dōshite",
        en: "Why?",
        vi: "Tại sao?",
        note_vi: "Dōshite thông dụng hơn trong hội thoại hằng ngày.",
      },
      {
        japanese: "いくらですか",
        romaji: "ikura desu ka",
        en: "How much is it?",
        vi: "Bao nhiêu tiền?",
      },
      {
        japanese: "どうやって行きますか",
        romaji: "dōyatte ikimasu ka",
        en: "How do I get there?",
        vi: "Đi bằng cách nào?",
      },
      {
        japanese: "どちらがいいですか",
        romaji: "dochira ga ii desu ka",
        en: "Which one is better?",
        vi: "Cái nào tốt hơn?",
        note_vi: "どっち (docchi) = casual. どちら (dochira) = lịch sự hơn.",
      },
    ],
    grammar_notes_vi: [
      "Từ hỏi + か = câu hỏi. Nhưng từ hỏi làm CHỦ NGỮ thì dùng が, không dùng は.",
      "Câu hỏi yes/no: chỉ cần thêm か cuối câu. 食べます → 食べますか。",
      "Trong casual: bỏ か, lên giọng cuối câu. 食べる → 食べる？",
      "Không dùng dấu hỏi '?' trong văn bản trang trọng — か đã đủ là dấu hỏi.",
    ],
    practice_tip_vi:
      "Dùng 8 từ hỏi đặt 8 câu về cuộc sống của bạn. Ví dụ: 毎朝何時に起きますか (Sáng nào bạn thức dậy lúc mấy giờ?). Tự hỏi tự trả lời.",
  },

  // ================================================================
  // Lesson 13 — Directions
  // ================================================================
  {
    id: "jp-directions",
    title_vi: "Hỏi đường và chỉ đường",
    title_en: "Asking and giving directions",
    intro_vi:
      "Mất đường ở Nhật là chuyện bình thường — đường Nhật không có tên như Việt Nam, dùng hệ thống 'khu phố + số nhà'. Học cách hỏi và hiểu câu trả lời chỉ đường là kỹ năng sinh tồn. Bài này dạy từ vựng vị trí và mẫu câu hỏi/chỉ đường.",
    sentences: [
      {
        japanese: "すみません、駅はどこですか",
        romaji: "sumimasen, eki wa doko desu ka",
        en: "Excuse me, where is the station?",
        vi: "Xin lỗi, ga tàu ở đâu ạ?",
      },
      {
        japanese: "まっすぐ行ってください",
        romaji: "massugu itte kudasai",
        en: "Please go straight.",
        vi: "Xin đi thẳng.",
        note_vi: "まっすぐ (massugu) = thẳng.",
      },
      {
        japanese: "右に曲がってください",
        romaji: "migi ni magatte kudasai",
        en: "Please turn right.",
        vi: "Xin rẽ phải.",
      },
      {
        japanese: "左に曲がってください",
        romaji: "hidari ni magatte kudasai",
        en: "Please turn left.",
        vi: "Xin rẽ trái.",
      },
      {
        japanese: "信号を渡ってください",
        romaji: "shingō o watatte kudasai",
        en: "Please cross at the traffic light.",
        vi: "Xin băng qua đèn giao thông.",
      },
      {
        japanese: "角を曲がってください",
        romaji: "kado o magatte kudasai",
        en: "Please turn at the corner.",
        vi: "Xin rẽ ở góc đường.",
        note_vi: "角 (kado) = góc. Rất phổ biến trong chỉ đường.",
      },
      {
        japanese: "駅の前にあります",
        romaji: "eki no mae ni arimasu",
        en: "It's in front of the station.",
        vi: "Nó ở trước ga.",
      },
      {
        japanese: "コンビニの隣です",
        romaji: "konbini no tonari desu",
        en: "It's next to the convenience store.",
        vi: "Nó bên cạnh cửa hàng tiện lợi.",
      },
    ],
    grammar_notes_vi: [
      "Vị trí: 前 (mae — trước), 後ろ (ushiro — sau), 隣 (tonari — bên cạnh), 近く (chikaku — gần).",
      "Te-form + ください = câu yêu cầu lịch sự. 曲がる→曲がって + ください = hãy rẽ.",
      "Người Nhật hay chỉ đường bằng landmarks (cửa hàng, ga tàu, đèn giao thông) thay vì địa chỉ.",
      "Nếu không hiểu câu trả lời: もう一度お願いします (mō ichido onegai shimasu — xin nói lại lần nữa).",
    ],
    practice_tip_vi:
      "Mở Google Maps chế độ xem đường phố Tokyo. Tập chỉ đường từ ga tàu đến một địa điểm bằng tiếng Nhật. Dùng các từ vị trí đã học.",
  },

  // ================================================================
  // Lesson 14 — Shopping
  // ================================================================
  {
    id: "jp-shopping",
    title_vi: "Mua sắm và gọi món",
    title_en: "Shopping and ordering",
    intro_vi:
      "Mua sắm ở Nhật là trải nghiệm văn hóa — nhân viên nói kính ngữ, quy trình thanh toán có nghi thức riêng. Học các mẫu câu này để mua đồ ở combini, cửa hàng quần áo, nhà hàng mà không bị 'đơ'.",
    sentences: [
      {
        japanese: "これ、いくらですか",
        romaji: "kore, ikura desu ka",
        en: "How much is this?",
        vi: "Cái này bao nhiêu tiền?",
      },
      {
        japanese: "これ、ください",
        romaji: "kore, kudasai",
        en: "I'll take this, please.",
        vi: "Cho tôi cái này ạ.",
      },
      {
        japanese: "これ、お願いします",
        romaji: "kore, onegai shimasu",
        en: "This one, please. (polite)",
        vi: "Cái này ạ. (lịch sự)",
        note_vi: "Dùng trong nhà hàng khi chỉ món trên menu.",
      },
      {
        japanese: "ちょっと見ているだけです",
        romaji: "chotto miteiru dake desu",
        en: "I'm just looking.",
        vi: "Tôi chỉ đang xem thôi ạ.",
        note_vi: "Câu 'cứu tinh' khi nhân viên đến hỏi mà bạn chưa muốn mua.",
      },
      {
        japanese: "カードでいいですか",
        romaji: "kādo de ii desu ka",
        en: "Can I pay by card?",
        vi: "Trả bằng thẻ được không ạ?",
      },
      {
        japanese: "袋をください",
        romaji: "fukuro o kudasai",
        en: "A bag, please.",
        vi: "Cho tôi cái túi ạ.",
        note_vi: "Ở Nhật, túi nilon thường TÍNH TIỀN riêng (3-5 yên).",
      },
      {
        japanese: "サイズはLです",
        romaji: "saizu wa L desu",
        en: "Size L, please.",
        vi: "Cỡ L ạ.",
        note_vi: "Cỡ Nhật nhỏ hơn Việt Nam 1-2 size. Luôn thử trước khi mua.",
      },
      {
        japanese: "レシートをください",
        romaji: "reshīto o kudasai",
        en: "Receipt, please.",
        vi: "Cho tôi hóa đơn ạ.",
      },
    ],
    grammar_notes_vi: [
      "ください (kudasai) = xin hãy cho tôi. Dùng cho đồ vật bạn muốn nhận.",
      "お願いします (onegai shimasu) = xin nhờ. Dùng khi yêu cầu dịch vụ, đặt món.",
      "Nhân viên Nhật sẽ nói kính ngữ: いらっしゃいませ (irasshaimase — kính chào quý khách).",
      "Tiền mặt vẫn phổ biến ở Nhật. Luôn có sẵn tiền mặt phòng khi cửa hàng không nhận thẻ.",
    ],
    practice_tip_vi:
      "Tập mua đồ ở combini Nhật (nếu đang ở Nhật). Nếu ở Việt Nam, tập với video YouTube 'convenience store in Japan'. Chỉ cần 3 câu: kore kudasai, fukuro o kudasai, kādo de ii desu ka.",
  },

  // ================================================================
  // Lesson 15 — Transport
  // ================================================================
  {
    id: "jp-transport",
    title_vi: "Tàu xe — sinh tồn ở Nhật",
    title_en: "Taking trains and buses",
    intro_vi:
      "Hệ thống tàu điện Nhật là một trong những mạng lưới phức tạp nhất thế giới — nhưng cực kỳ logic khi bạn hiểu. Học từ vựng tàu xe và cách hỏi/mua vé để không bị lạc ở Shinjuku hay Osaka.",
    sentences: [
      {
        japanese: "切符を買いたいです",
        romaji: "kippu o kaitai desu",
        en: "I want to buy a ticket.",
        vi: "Tôi muốn mua vé.",
      },
      {
        japanese: "東京行きの切符をください",
        romaji: "tōkyō yuki no kippu o kudasai",
        en: "A ticket to Tokyo, please.",
        vi: "Cho tôi một vé đi Tokyo ạ.",
        note_vi: "〜行き (yuki) = đi đến ~. Gắn vào sau tên địa điểm.",
      },
      {
        japanese: "この電車は新宿に行きますか",
        romaji: "kono densha wa shinjuku ni ikimasu ka",
        en: "Does this train go to Shinjuku?",
        vi: "Tàu này có đi Shinjuku không ạ?",
      },
      {
        japanese: "次の駅はどこですか",
        romaji: "tsugi no eki wa doko desu ka",
        en: "What's the next station?",
        vi: "Ga tiếp theo là ga nào ạ?",
      },
      {
        japanese: "乗り換えはどこですか",
        romaji: "norikae wa doko desu ka",
        en: "Where do I transfer?",
        vi: "Chỗ chuyển tàu ở đâu ạ?",
        note_vi: "乗り換え (norikae) = chuyển tàu/xe.",
      },
      {
        japanese: "Suicaをください",
        romaji: "suika o kudasai",
        en: "A Suica card, please.",
        vi: "Cho tôi thẻ Suica ạ.",
        note_vi: "Suica/Pasmo là thẻ IC dùng cho tất cả tàu xe Nhật. KHÔNG cần mua vé lẻ.",
      },
      {
        japanese: "バスはどこから出ますか",
        romaji: "basu wa doko kara demasu ka",
        en: "Where does the bus depart from?",
        vi: "Xe buýt khởi hành từ đâu ạ?",
      },
      {
        japanese: "終電は何時ですか",
        romaji: "shūden wa nanji desu ka",
        en: "What time is the last train?",
        vi: "Chuyến tàu cuối lúc mấy giờ?",
        note_vi: "終電 (shūden) = chuyến tàu cuối. Câu QUAN TRỌNG — tàu Nhật ngừng chạy ~12-1h sáng.",
      },
    ],
    grammar_notes_vi: [
      "〜行き (yuki) = đi đến. 東京行き = đi Tokyo. Rất phổ biến trên bảng tàu.",
      "切符 (kippu) = vé giấy. Nhưng hầu hết người Nhật dùng thẻ IC (Suica/Pasmo/ICOCA).",
      "Tàu Nhật có 4 loại: 各駅停車 (địa phương), 快速 (nhanh), 急行 (tốc hành), 特急 (đặc biệt).",
      "ĐÚNG GIỜ là nguyên tắc ở Nhật. Tàu trễ 1 phút là có thông báo xin lỗi.",
    ],
    practice_tip_vi:
      "Tải app Japan Travel by Navitime. Tập tra cứu lộ trình từ điểm A đến B ở Tokyo bằng tiếng Nhật. Học đọc tên ga bằng kanji.",
  },

  // ================================================================
  // Lesson 16 — Te-form
  // ================================================================
  {
    id: "jp-te-form",
    title_vi: "Te-form — dạng động từ quan trọng nhất",
    title_en: "Te-form — the most important verb form",
    intro_vi:
      "Te-form (て形) là dạng động từ QUAN TRỌNG NHẤT trong tiếng Nhật. Nó được dùng để: nối câu, yêu cầu lịch sự, diễn tả hành động đang diễn ra, xin phép, và cấm đoán. Nếu bạn chỉ học MỘT dạng chia động từ nâng cao, hãy học te-form.",
    sentences: [
      {
        japanese: "食べてください",
        romaji: "tabete kudasai",
        en: "Please eat.",
        vi: "Xin hãy ăn.",
        note_vi: "Te-form + kudasai = yêu cầu lịch sự.",
      },
      {
        japanese: "食べています",
        romaji: "tabete imasu",
        en: "I am eating. (in progress)",
        vi: "Tôi đang ăn.",
        note_vi: "Te-form + iru = hành động đang diễn ra.",
      },
      {
        japanese: "食べてもいいですか",
        romaji: "tabete mo ii desu ka",
        en: "May I eat?",
        vi: "Tôi ăn được không ạ?",
        note_vi: "Te-form + mo ii = xin phép.",
      },
      {
        japanese: "食べてはいけません",
        romaji: "tabete wa ikemasen",
        en: "You must not eat.",
        vi: "Không được ăn.",
        note_vi: "Te-form + wa ikenai = cấm.",
      },
      {
        japanese: "起きて、顔を洗って、朝ごはんを食べます",
        romaji: "okite, kao o aratte, asagohan o tabemasu",
        en: "I wake up, wash my face, and eat breakfast.",
        vi: "Tôi thức dậy, rửa mặt, và ăn sáng.",
        note_vi: "Te-form dùng để nối chuỗi hành động. Chỉ động từ cuối chia thì.",
      },
      {
        japanese: "ちょっと待ってください",
        romaji: "chotto matte kudasai",
        en: "Please wait a moment.",
        vi: "Xin đợi một chút.",
      },
      {
        japanese: "ドアを開けてください",
        romaji: "doa o akete kudasai",
        en: "Please open the door.",
        vi: "Xin mở cửa.",
      },
    ],
    grammar_notes_vi: [
      "Quy tắc chia te-form NHÓM 1: うつる → って, むぶぬ → んで, く → いて, ぐ → いで, す → して.",
      "Nhóm 2: bỏ る + て. Đơn giản.",
      "Nhóm 3: する → して, 来る → 来て (kite).",
      "Te-form + いる diễn tả trạng thái tiếp diễn HOẶC trạng thái kết quả (vd: 結婚しています = đã kết hôn).",
    ],
    practice_tip_vi:
      "Viết ra 10 động từ trong vocabulary, chia te-form. Sau đó ghép mỗi te-form với 5 mẫu câu: ください, いる, もいい, はいけない, から (vì). Đọc to từng câu.",
  },

  // ================================================================
  // Lesson 17 — Connecting sentences
  // ================================================================
  {
    id: "jp-conjunctions",
    title_vi: "Nối câu — và, nhưng, vì, sau khi",
    title_en: "Connecting sentences",
    intro_vi:
      "Mới học thường nói từng câu rời rạc. Nối câu giúp bạn nói trôi chảy và tự nhiên hơn. Tiếng Nhật nối câu bằng te-form (cho chuỗi hành động), trợ từ nối (が、けど、から、ので), và cấu trúc thời gian (前に、後で).",
    sentences: [
      {
        japanese: "日本語は難しいですが、面白いです",
        romaji: "nihongo wa muzukashii desu ga, omoshiroi desu",
        en: "Japanese is difficult, but interesting.",
        vi: "Tiếng Nhật khó nhưng thú vị.",
        note_vi: "が (ga) = nhưng. Đứng giữa hai mệnh đề. Lịch sự hơn けど.",
      },
      {
        japanese: "日本語は難しいけど、面白い",
        romaji: "nihongo wa muzukashii kedo, omoshiroi",
        en: "Japanese is hard but interesting. (casual)",
        vi: "Tiếng Nhật khó nhưng hay.",
        note_vi: "けど (kedo) = nhưng (khẩu ngữ). Nhẹ hơn が.",
      },
      {
        japanese: "お腹がすいたから、何か食べましょう",
        romaji: "onaka ga suita kara, nanika tabemashō",
        en: "I'm hungry, so let's eat something.",
        vi: "Đói bụng rồi, nên ăn gì đi.",
        note_vi: "から (kara) = vì. Nguyên nhân TRƯỚC から, kết quả SAU.",
      },
      {
        japanese: "食べる前に手を洗ってください",
        romaji: "taberu mae ni te o aratte kudasai",
        en: "Please wash your hands before eating.",
        vi: "Rửa tay trước khi ăn.",
        note_vi: "Dict form + 前に = trước khi. Luôn là dictionary form, không chia thì.",
      },
      {
        japanese: "食べた後で勉強します",
        romaji: "tabeta ato de benkyō shimasu",
        en: "I'll study after eating.",
        vi: "Ăn xong rồi học.",
        note_vi: "Quá khứ casual + 後で = sau khi.",
      },
      {
        japanese: "日本に行った時、寿司を食べました",
        romaji: "nihon ni itta toki, sushi o tabemashita",
        en: "When I went to Japan, I ate sushi.",
        vi: "Khi tôi đi Nhật, tôi đã ăn sushi.",
        note_vi: "Dict form/quá khứ + 時 = khi. Thì trước 時 quyết định trật tự thời gian.",
      },
      {
        japanese: "それから",
        romaji: "sorekara",
        en: "And then / After that",
        vi: "Rồi sau đó",
      },
      {
        japanese: "それに",
        romaji: "soreni",
        en: "On top of that / Moreover",
        vi: "Thêm vào đó",
      },
    ],
    grammar_notes_vi: [
      "が vs けど: が = văn viết/lịch sự, けど = khẩu ngữ. Đều có nghĩa 'nhưng'.",
      "から vs ので: から = lý do chủ quan, ので = lý do khách quan/lịch sự hơn.",
      "Trước 前に (mae ni) LUÔN là dictionary form, không chia thì.",
      "Trước 後で (ato de) LUÔN là quá khứ casual (ta-form).",
    ],
    practice_tip_vi:
      "Viết 5 câu về ngày hôm qua của bạn, dùng các từ nối đã học. Mỗi câu phải có ít nhất 2 mệnh đề được nối với nhau.",
  },

  // ================================================================
  // Lesson 18 — Weather and small talk
  // ================================================================
  {
    id: "jp-weather",
    title_vi: "Thời tiết và chuyện phiếm",
    title_en: "Weather and small talk",
    intro_vi:
      "Thời tiết là chủ đề 'small talk' số 1 ở Nhật — an toàn, phổ biến, không gây tranh cãi. Học cách mô tả thời tiết và bình luận về các mùa giúp bạn dễ dàng bắt chuyện với đồng nghiệp và hàng xóm Nhật.",
    sentences: [
      {
        japanese: "今日はいい天気ですね",
        romaji: "kyō wa ii tenki desu ne",
        en: "Nice weather today, isn't it?",
        vi: "Hôm nay thời tiết đẹp nhỉ.",
        note_vi: "ね (ne) = nhỉ/nhé — tìm sự đồng tình. Dùng CỰC NHIỀU trong hội thoại.",
      },
      {
        japanese: "暑いですね",
        romaji: "atsui desu ne",
        en: "It's hot, isn't it?",
        vi: "Nóng quá nhỉ.",
      },
      {
        japanese: "寒いですね",
        romaji: "samui desu ne",
        en: "It's cold, isn't it?",
        vi: "Lạnh quá nhỉ.",
      },
      {
        japanese: "雨が降っています",
        romaji: "ame ga futte imasu",
        en: "It's raining.",
        vi: "Trời đang mưa.",
        note_vi: "降る (furu) = rơi (mưa/tuyết). 雨 (ame) + が + 降っています.",
      },
      {
        japanese: "桜がきれいですね",
        romaji: "sakura ga kirei desu ne",
        en: "The cherry blossoms are beautiful, aren't they?",
        vi: "Hoa anh đào đẹp quá nhỉ.",
        note_vi: "Mùa hoa anh đào (tháng 3-4) là thời gian small talk NHIỀU NHẤT trong năm.",
      },
      {
        japanese: "日本の夏は蒸し暑いです",
        romaji: "nihon no natsu wa mushiatsui desu",
        en: "Japanese summers are humid and hot.",
        vi: "Mùa hè Nhật nóng ẩm.",
        note_vi: "蒸し暑い (mushiatsui) = nóng ẩm. Đây là từ CHUẨN để mô tả mùa hè Nhật.",
      },
      {
        japanese: "台風が来ます",
        romaji: "taifū ga kimasu",
        en: "A typhoon is coming.",
        vi: "Bão sắp đến.",
        note_vi: "台風 (taifū) = bão. Nhật có mùa bão tháng 8-10.",
      },
    ],
    grammar_notes_vi: [
      "ね (ne) là trợ từ cuối câu quan trọng NHẤT trong hội thoại Nhật. Dùng để tìm sự đồng tình hoặc làm mềm câu nói.",
      "Động từ thời tiết: 降る (furu — mưa/tuyết rơi), 吹く (fuku — gió thổi), 晴れる (hareru — nắng).",
      "Bốn mùa Nhật rất rõ rệt và là một phần quan trọng trong văn hóa. Mỗi mùa có từ vựng riêng.",
    ],
    practice_tip_vi:
      "Mỗi sáng kiểm tra thời tiết Nhật (tenki.jp) và tập nói thời tiết hôm nay bằng tiếng Nhật. Đăng lên group học tiếng Nhật để có người sửa.",
  },

  // ================================================================
  // Lesson 19 — Family
  // ================================================================
  {
    id: "jp-family",
    title_vi: "Gia đình — hai bộ từ 'nhà mình' và 'nhà người'",
    title_en: "Family terms — my family vs others' family",
    intro_vi:
      "Tiếng Nhật có HAI BỘ từ vựng cho cùng một thành viên gia đình: một bộ khi nói về gia đình MÌNH (khiêm nhường), một bộ khi nói về gia đình NGƯỜI KHÁC (tôn kính). Dùng sai bộ là lỗi văn hóa nghiêm trọng.",
    sentences: [
      {
        japanese: "私の母です → お母さん",
        romaji: "watashi no haha desu → okāsan",
        en: "my mother → (your/his) mother",
        vi: "mẹ tôi → mẹ (của bạn/anh ấy)",
        note_vi: "Nói về mẹ MÌNH dùng 母 (haha). Nói về mẹ NGƯỜI KHÁC dùng お母さん (okāsan).",
      },
      {
        japanese: "私の父です → お父さん",
        romaji: "watashi no chichi desu → otōsan",
        en: "my father → (your/his) father",
        vi: "bố tôi → bố (của bạn/anh ấy)",
        note_vi: "父 (chichi) = bố mình. お父さん (otōsan) = bố người khác.",
      },
      {
        japanese: "兄 → お兄さん",
        romaji: "ani → onīsan",
        en: "my older brother → (your) older brother",
        vi: "anh trai tôi → anh trai (của bạn)",
      },
      {
        japanese: "姉 → お姉さん",
        romaji: "ane → onēsan",
        en: "my older sister → (your) older sister",
        vi: "chị gái tôi → chị gái (của bạn)",
      },
      {
        japanese: "弟 → 弟さん",
        romaji: "otōto → otōtosan",
        en: "my younger brother → (your) younger brother",
        vi: "em trai tôi → em trai (của bạn)",
      },
      {
        japanese: "妹 → 妹さん",
        romaji: "imōto → imōtosan",
        en: "my younger sister → (your) younger sister",
        vi: "em gái tôi → em gái (của bạn)",
      },
      {
        japanese: "家族は何人ですか",
        romaji: "kazoku wa nannin desu ka",
        en: "How many people in your family?",
        vi: "Gia đình bạn có mấy người?",
      },
      {
        japanese: "四人家族です",
        romaji: "yonin kazoku desu",
        en: "We're a family of four.",
        vi: "Gia đình tôi có 4 người.",
      },
    ],
    grammar_notes_vi: [
      "Quy tắc: nói về gia đình MÌNH với người ngoài = dùng từ khiêm nhường (chichi, haha, ani, ane...).",
      "GỌI trực tiếp người trong gia đình MÌNH: có thể dùng お母さん, お父さん.",
      "Nói về gia đình NGƯỜI KHÁC = LUÔN dùng từ tôn kính (okāsan, otōsan, onīsan...).",
      "Vợ/chồng: 妻 (tsuma — vợ mình), 奥さん (okusan — vợ người khác), 主人 (shujin — chồng mình), ご主人 (goshujin — chồng người khác).",
    ],
    practice_tip_vi:
      "Vẽ sơ đồ gia đình bạn và gia đình một người bạn. Ghi tên từng người bằng cả hai cách: từ khiêm nhường và từ tôn kính.",
  },

  // ================================================================
  // Lesson 20 — At a restaurant
  // ================================================================
  {
    id: "jp-restaurant",
    title_vi: "Đi ăn nhà hàng — từ lúc vào đến lúc ra",
    title_en: "At a restaurant — from entering to leaving",
    intro_vi:
      "Đi ăn ở Nhật có quy trình riêng: được dẫn vào chỗ, khăn ướt (oshibori), gọi món, và KHÔNG có tiền tip. Học toàn bộ flow từ lúc bước vào đến lúc tính tiền để tự tin ăn uống ở bất kỳ nhà hàng Nhật nào.",
    sentences: [
      {
        japanese: "いらっしゃいませ！何名様ですか",
        romaji: "irasshaimase! nanmeisama desu ka",
        en: "Welcome! How many people?",
        vi: "Kính chào quý khách! Bao nhiêu người ạ?",
        note_vi: "Nhân viên nói — bạn chỉ cần HIỂU, không cần nói câu này.",
      },
      {
        japanese: "二人です",
        romaji: "futari desu",
        en: "Two people.",
        vi: "Hai người ạ.",
      },
      {
        japanese: "メニューをください",
        romaji: "menyū o kudasai",
        en: "Menu, please.",
        vi: "Cho tôi thực đơn ạ.",
      },
      {
        japanese: "おすすめは何ですか",
        romaji: "osusume wa nan desu ka",
        en: "What do you recommend?",
        vi: "Món nào được đề xuất ạ?",
        note_vi: "おすすめ (osusume) = đề xuất. Câu hỏi RẤT hữu ích ở nhà hàng Nhật.",
      },
      {
        japanese: "これをお願いします",
        romaji: "kore o onegai shimasu",
        en: "I'll have this, please.",
        vi: "Cho tôi món này ạ.",
        note_vi: "Chỉ vào menu khi nói — hoàn toàn bình thường ở Nhật.",
      },
      {
        japanese: "すみません、注文いいですか",
        romaji: "sumimasen, chūmon ii desu ka",
        en: "Excuse me, can I order?",
        vi: "Xin lỗi, tôi gọi món được chưa ạ?",
        note_vi: "Ở nhiều nhà hàng Nhật, bạn phải GỌI nhân viên — họ không tự đến.",
      },
      {
        japanese: "いただきます",
        romaji: "itadakimasu",
        en: "Thank you for the meal. (before eating)",
        vi: "Xin cảm ơn bữa ăn. (trước khi ăn)",
        note_vi: "Nói trước khi ăn — thể hiện lòng biết ơn. Không nói bị coi là bất lịch sự.",
      },
      {
        japanese: "ごちそうさまでした",
        romaji: "gochisōsama deshita",
        en: "Thank you for the meal. (after eating)",
        vi: "Cảm ơn bữa ăn ngon. (sau khi ăn)",
        note_vi: "Nói sau khi ăn xong. Có thể nói với đầu bếp ở quầy sushi.",
      },
      {
        japanese: "お会計をお願いします",
        romaji: "okaikei o onegai shimasu",
        en: "Check, please.",
        vi: "Tính tiền ạ.",
        note_vi: "お会計 (okaikei) = tiền/thanh toán.",
      },
      {
        japanese: "別々でお願いします",
        romaji: "betsubetsu de onegai shimasu",
        en: "Separate checks, please.",
        vi: "Tính tiền riêng ạ.",
        note_vi: "Ở Nhật, tính tiền riêng (warikan) rất phổ biến khi đi ăn nhóm.",
      },
    ],
    grammar_notes_vi: [
      "Không có TIỀN TIP ở Nhật. Tip có thể bị coi là xúc phạm.",
      "いただきます và ごちそうさま là BẮT BUỘC văn hóa — không phải tùy chọn.",
      "Ở nhiều nhà hàng, bạn thanh toán ở quầy thu ngân, không phải ở bàn.",
      "Nhà hàng Nhật thường có nước miễn phí (お冷 — ohiya) hoặc trà miễn phí.",
    ],
    practice_tip_vi:
      "Xem video 'Japanese restaurant conversation' trên YouTube. Tập nói theo toàn bộ flow: vào → gọi món → ăn (いただきます) → tính tiền → ra về (ごちそうさま). Làm 3 lần.",
  },
];

export default JAPANESE_LESSONS;
