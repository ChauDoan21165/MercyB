// src/languages/indonesian/extra/news-media.ts
//
// Indonesian news & media pack for Vietnamese learners.
// Covers: reading the news and naming outlets (berita, koran, TV, Kompas,
// Detik, headlines), digital/social media (online, viral, trending, hoaks),
// and discussing current events with opinions and hedged language. No filler.
//
// Shape mirrors the named template src/languages/portuguese/lessons-a1.ts and the
// sibling extra packs so the page UI stays consistent across language verticals.
// The types are defined inline because the Indonesian pack has no sibling
// lessons.ts registry yet (A7 owns it) — this file is self-contained on purpose.
// Types are NOT exported and the lesson array uses a unique name so a future
// barrel `export *` cannot collide with the sibling extra packs.
//
// Field convention (inherited from the Portuguese pack): a sentence's `en` slot
// holds the TARGET-LANGUAGE text (here: Indonesian), `vi` holds the Vietnamese
// gloss. `pronunciation_focus` carries Vietnamese-facing pronunciation/grammar
// notes (incl. the common Vietnamese-speaker mistake = L1 note);
// `pronunciation_focus_en` is the English-speaker companion, same length + order.
//
// Indonesian uses the Latin alphabet — no special script rendering needed.

type LessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

type DialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields (fill_blank, matching, translation) vary.
type Exercise = Record<string, unknown>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: VocabEntry[];
  dialogue?: DialogueLine[];
  exercises?: Exercise[];
};

export const newsMediaLessons: IndonesianLesson[] = [
  {
    id: "indonesian_media_reading_news",
    level: "A1",
    category: "news-media",
    title_vi: "Đọc tin tức — báo, ti vi và tựa đề",
    title_en: "Reading the news — papers, TV and headlines",
    sentences: [
      {
        en: "Saya membaca berita setiap pagi.",
        vi: "Tôi đọc tin tức mỗi sáng.",
        pronunciation_focus: [
          "membaca → mem-BA-cha, 'đọc' (gốc baca, 'c' đọc như 'ch')",
          "berita → be-RI-ta, 'tin tức'",
          "setiap pagi → 'mỗi sáng' (setiap = mỗi, pagi = sáng)",
        ],
        pronunciation_focus_en: [
          "membaca → 'mem-BA-cha' — to read (root 'baca', 'c' = 'ch')",
          "berita → 'be-REE-ta' — news",
          "setiap pagi → 'every morning' (setiap = every, pagi = morning)",
        ],
      },
      {
        en: "Berita ini ada di koran dan di televisi.",
        vi: "Tin này có trên báo và trên ti vi.",
        pronunciation_focus: [
          "koran → KO-ran, 'báo (in)'",
          "televisi → te-le-VI-si, 'ti vi/truyền hình' (TV đọc 'te-ve')",
          "di → 'trên/ở' (giới từ chỉ vị trí tĩnh)",
        ],
        pronunciation_focus_en: [
          "koran → 'KOH-ran' — newspaper",
          "televisi → 'te-le-VEE-see' — television (TV said 'te-ve')",
          "di → 'in/on/at' (static-location preposition)",
        ],
      },
      {
        en: "Apa judul berita hari ini?",
        vi: "Tựa đề tin hôm nay là gì?",
        pronunciation_focus: [
          "apa → A-pa, 'gì/cái gì' (mở đầu câu hỏi)",
          "judul → JU-dul, 'tựa đề/tiêu đề'",
          "hari ini → 'hôm nay' (hari = ngày, ini = này)",
        ],
        pronunciation_focus_en: [
          "apa → 'A-pa' — what (opens a question)",
          "judul → 'JOO-dool' — title / headline",
          "hari ini → 'today' (hari = day, ini = this)",
        ],
      },
      {
        en: "Wartawan itu menulis tentang banjir di Jakarta.",
        vi: "Phóng viên đó viết về trận lụt ở Jakarta.",
        pronunciation_focus: [
          "wartawan → war-ta-WAN, 'nhà báo/phóng viên'",
          "menulis → me-NU-lis, 'viết' (gốc tulis)",
          "tentang → ten-TANG, 'về (chủ đề)'",
        ],
        pronunciation_focus_en: [
          "wartawan → 'war-ta-WAN' — journalist / reporter",
          "menulis → 'me-NOO-lees' — to write (root 'tulis')",
          "tentang → 'ten-TANG' — about / concerning",
        ],
      },
      {
        en: "Saya suka membaca rubrik olahraga.",
        vi: "Tôi thích đọc mục thể thao.",
        pronunciation_focus: [
          "suka → SU-ka, 'thích'",
          "rubrik → RU-brik, 'chuyên mục/mục báo'",
          "olahraga → o-lah-RA-ga, 'thể thao'",
        ],
        pronunciation_focus_en: [
          "suka → 'SOO-ka' — to like",
          "rubrik → 'ROO-breek' — column / section",
          "olahraga → 'o-lah-RA-ga' — sport(s)",
        ],
      },
    ],
    cultural_notes_vi:
      "Báo in (koran) lớn của Indonesia: KOMPAS (uy tín, nghiêm túc), Media Indonesia, Republika, Jawa Pos. Truyền hình tin tức: TVOne, Metro TV, Kompas TV. Hầu hết người Indonesia nay đọc tin trên điện thoại; trang tin online lớn nhất là DETIK.com, Kompas.com, CNN Indonesia, Tribunnews. 'Wartawan' (nhà báo) viết 'berita' (tin), tập hợp theo 'rubrik' (chuyên mục): politik, ekonomi, olahraga, hiburan (giải trí), internasional. Cách đọc ngày tháng trên báo: 'hari ini' (hôm nay), 'kemarin' (hôm qua), 'besok' (ngày mai).",
    cultural_notes_en:
      "Indonesia's major print papers: KOMPAS (prestigious, serious), Media Indonesia, Republika, Jawa Pos. News TV: TVOne, Metro TV, Kompas TV. Most Indonesians now read news on their phones; the biggest news portals are DETIK.com, Kompas.com, CNN Indonesia, Tribunnews. A 'wartawan' (journalist) writes 'berita' (news), organized by 'rubrik' (section): politik, ekonomi, olahraga, hiburan (entertainment), internasional. Time words on the news: 'hari ini' (today), 'kemarin' (yesterday), 'besok' (tomorrow).",
    tip_advice_vi:
      "Mẹo cho người Việt: nhiều từ truyền thông là từ mượn dễ nhận — televisi (TV), radio, koran (gốc Hà Lan 'krant'), redaksi (ban biên tập). Động từ chủ động dùng tiền tố me-: membaca (đọc), menulis (viết), menonton (xem) — gốc là baca, tulis, tonton. 'Tentang' = 'về (chủ đề)', dùng khi nói nội dung tin ('berita tentang banjir' = tin về lũ lụt). Giới từ 'di' (ở/trên) chỉ vị trí, khác 'ke' (đến) — 'di koran' = trên báo. Hỏi nội dung: 'Beritanya tentang apa?' (Tin nói về gì?).",
    tip_advice_en:
      "Tip for Vietnamese speakers: many media words are recognizable loanwords — televisi (TV), radio, koran (from Dutch 'krant'), redaksi (editorial desk). Active verbs take the 'me-' prefix: membaca (read), menulis (write), menonton (watch) — from roots baca, tulis, tonton. 'Tentang' = 'about', used for what the news covers ('berita tentang banjir' = news about flooding). The preposition 'di' (in/on/at) marks location, unlike 'ke' (to) — 'di koran' = in the newspaper. Ask the topic: 'Beritanya tentang apa?' (What's the news about?).",
    vocabulary: [
      { cell_id: "0a4e26b4-59ff-4488-a7f6-9a89d7375b67", word: "berita", en: "news", vi: "tin tức", pos: "noun", pronunciation_vi: "be-RI-ta", pronunciation_en: "be-REE-ta" },
      { cell_id: "229b55f3-c283-424e-8cf8-31fa42dca92f", word: "koran", en: "newspaper", vi: "báo (in)", pos: "noun", pronunciation_vi: "KO-ran", pronunciation_en: "KOH-ran" },
      { cell_id: "27eb54ea-84d4-44d8-94ac-1fde7af74245", word: "televisi", en: "television", vi: "ti vi / truyền hình", pos: "noun", pronunciation_vi: "te-le-VI-si", pronunciation_en: "te-le-VEE-see" },
      { cell_id: "91574ad7-26d5-4d90-9991-bd1706379a87", word: "wartawan", en: "journalist / reporter", vi: "nhà báo / phóng viên", pos: "noun", pronunciation_vi: "war-ta-WAN", pronunciation_en: "war-ta-WAN" },
      { cell_id: "cda547e7-e572-4692-a4a2-218f993c72fd", word: "judul", en: "title / headline", vi: "tựa đề / tiêu đề", pos: "noun", pronunciation_vi: "JU-dul", pronunciation_en: "JOO-dool" },
      { cell_id: "25b08e8a-38bc-4d6c-a3d1-a73fe81f793e", word: "membaca", en: "to read", vi: "đọc", pos: "verb", pronunciation_vi: "mem-BA-cha", pronunciation_en: "mem-BA-cha" },
      { cell_id: "271c887e-8011-4920-8e1e-d58751366a56", word: "menulis", en: "to write", vi: "viết", pos: "verb", pronunciation_vi: "me-NU-lis", pronunciation_en: "me-NOO-lees" },
      { cell_id: "bd335099-d75f-4637-a50d-de9ccde7d19c", word: "rubrik", en: "column / section", vi: "chuyên mục", pos: "noun", pronunciation_vi: "RU-brik", pronunciation_en: "ROO-breek" },
      { cell_id: "ed1bc95b-4d56-42c0-8270-0e6cc62e1294", word: "tentang", en: "about / concerning", vi: "về (chủ đề)", pos: "prep.", pronunciation_vi: "ten-TANG", pronunciation_en: "ten-TANG" },
    ],
    dialogue: [
      { cell_id: "890ff847-cd37-4109-96f1-5814ff75b508", speaker: "Rudi", text: "Selamat pagi. Sudah baca berita hari ini?", vi: "Chào buổi sáng. Đọc tin hôm nay chưa?", en: "Good morning. Have you read today's news?" },
      { cell_id: "b9777078-d7bf-41de-a7de-e5d57b2ebc9a", speaker: "Sinta", text: "Belum. Apa judul beritanya?", vi: "Chưa. Tựa đề tin là gì?", en: "Not yet. What's the headline?" },
      { cell_id: "98138e45-782e-4cf0-8bc3-ced4bce8ec90", speaker: "Rudi", text: "Tentang banjir di Jakarta. Ada di Kompas dan di televisi.", vi: "Về trận lụt ở Jakarta. Có trên Kompas và trên ti vi.", en: "About the flooding in Jakarta. It's in Kompas and on TV." },
      { cell_id: "1a3bca0a-905a-4b82-af39-6ed1bfbdf0d1", speaker: "Sinta", text: "Wah, serius. Saya biasanya cuma baca rubrik olahraga.", vi: "Ồ, nghiêm trọng đấy. Tôi thường chỉ đọc mục thể thao.", en: "Wow, serious. I usually only read the sports section." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về tin tức còn thiếu:",
        instruction_en: "Fill in the missing news word:",
        items: [
          { prompt: "Saya ___ berita setiap pagi. (đọc)", answer: "membaca", options: ["membaca", "menulis", "menonton"] },
          { prompt: "Apa ___ berita hari ini? (tựa đề)", answer: "judul", options: ["judul", "jadwal", "jalan"] },
          { prompt: "Wartawan itu menulis ___ banjir. (về)", answer: "tentang", options: ["tentang", "tetapi", "tentu"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "berita", answer: "tin tức" },
          { prompt: "koran", answer: "báo (in)" },
          { prompt: "wartawan", answer: "nhà báo" },
          { prompt: "rubrik", answer: "chuyên mục" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi đọc tin tức mỗi sáng.", answer: "Saya membaca berita setiap pagi." },
          { prompt: "Tựa đề tin hôm nay là gì?", answer: "Apa judul berita hari ini?" },
          { prompt: "Tôi thích đọc mục thể thao.", answer: "Saya suka membaca rubrik olahraga." },
        ],
      },
    ],
  },
  {
    id: "indonesian_media_online_viral",
    level: "A2",
    category: "news-media",
    title_vi: "Tin online — viral, trending và tin giả (hoaks)",
    title_en: "Online news — viral, trending and hoaxes",
    sentences: [
      {
        en: "Berita itu sedang viral di media sosial.",
        vi: "Tin đó đang viral trên mạng xã hội.",
        pronunciation_focus: [
          "sedang → se-DANG, 'đang' (dấu hiệu thì tiếp diễn)",
          "viral → VI-ral, 'lan truyền nhanh' (mượn tiếng Anh)",
          "media sosial → 'mạng xã hội' (medsos là dạng rút gọn)",
        ],
        pronunciation_focus_en: [
          "sedang → 'se-DANG' — currently / -ing (progressive marker)",
          "viral → 'VEE-ral' — viral (loanword)",
          "media sosial → 'social media' (shortened to 'medsos')",
        ],
      },
      {
        en: "Topik ini sedang trending di Twitter.",
        vi: "Chủ đề này đang trending trên Twitter.",
        pronunciation_focus: [
          "topik → TO-pik, 'chủ đề'",
          "trending → đọc như tiếng Anh, rất hay dùng",
          "di Twitter → 'trên Twitter' (di = trên)",
        ],
        pronunciation_focus_en: [
          "topik → 'TOH-peek' — topic",
          "trending → said as in English; very common",
          "di Twitter → 'on Twitter' (di = on)",
        ],
      },
      {
        en: "Hati-hati, banyak hoaks beredar belakangan ini.",
        vi: "Cẩn thận, nhiều tin giả lan truyền dạo gần đây.",
        pronunciation_focus: [
          "hati-hati → 'cẩn thận' (từ láy, gốc hati = tim/lòng)",
          "hoaks → HO-aks, 'tin giả/tin vịt' (mượn 'hoax')",
          "beredar → be-re-DAR, 'lan truyền/lưu hành'",
        ],
        pronunciation_focus_en: [
          "hati-hati → 'be careful' (reduplication, root 'hati' = heart)",
          "hoaks → 'HOH-aks' — hoax / fake news",
          "beredar → 'be-re-DAR' — to circulate / spread",
        ],
      },
      {
        en: "Sebaiknya kita cek dulu sumbernya sebelum membagikan.",
        vi: "Tốt nhất ta nên kiểm tra nguồn trước khi chia sẻ.",
        pronunciation_focus: [
          "sebaiknya → se-BAIK-nya, 'tốt nhất nên' (lời khuyên)",
          "sumber → SUM-ber, 'nguồn (tin)'",
          "membagikan → mem-ba-GI-kan, 'chia sẻ/phát' (gốc bagi)",
        ],
        pronunciation_focus_en: [
          "sebaiknya → 'se-BAIK-nya' — it's best to / should (advice)",
          "sumber → 'SOOM-ber' — source",
          "membagikan → 'mem-ba-GEE-kan' — to share / distribute (root 'bagi')",
        ],
      },
      {
        en: "Berita ini benar atau bohong, ya?",
        vi: "Tin này thật hay xạo vậy?",
        pronunciation_focus: [
          "benar → be-NAR, 'đúng/thật'",
          "atau → A-tau, 'hay/hoặc'",
          "bohong → BO-hong, 'dối/giả' (khẩu ngữ); 'ya' làm mềm câu",
        ],
        pronunciation_focus_en: [
          "benar → 'be-NAR' — true / correct",
          "atau → 'A-tau' — or",
          "bohong → 'BOH-hong' — a lie / false (colloquial); 'ya' softens it",
        ],
      },
    ],
    cultural_notes_vi:
      "Indonesia là một trong những nước dùng mạng xã hội nhiều nhất thế giới — Twitter/X, Instagram, TikTok, Facebook đều rất sôi động. Từ khóa: 'viral' (lan nhanh), 'trending' (đang thịnh), 'netizen' (cư dân mạng), 'medsos' (rút gọn của media sosial). 'HOAKS' (tin giả) là vấn nạn lớn; chính phủ và nền tảng kêu gọi 'saring sebelum sharing' (lọc trước khi chia sẻ). Có cả các tổ chức kiểm chứng (cek fakta) như Mafindo, Kompas Cek Fakta. Khi nghi ngờ, người ta hỏi 'Ini hoaks atau bukan?' (Cái này giả hay không?) và kiểm tra 'sumber' (nguồn).",
    cultural_notes_en:
      "Indonesia is one of the world's heaviest social-media users — Twitter/X, Instagram, TikTok and Facebook are all very active. Key terms: 'viral' (spreads fast), 'trending', 'netizen', 'medsos' (short for media sosial). 'HOAKS' (fake news) is a major problem; the government and platforms push 'saring sebelum sharing' (filter before you share). There are fact-checking bodies (cek fakta) like Mafindo and Kompas Cek Fakta. When in doubt people ask 'Ini hoaks atau bukan?' (Is this a hoax or not?) and check the 'sumber' (source).",
    tip_advice_vi:
      "Mẹo cho người Việt: 'sedang' đặt trước động từ = 'đang' (thì tiếp diễn) — 'sedang viral' = đang viral, 'sedang trending'. Đừng quên: tiếng Indonesia không chia động từ, chỉ thêm 'sedang' (đang), 'sudah' (đã), 'akan' (sẽ). 'Sebaiknya' = 'tốt nhất nên' — mẫu khuyên rất lịch sự ('Sebaiknya kita cek dulu'). Phân biệt 'benar' (đúng/thật, trang trọng) với 'bohong' (xạo, khẩu ngữ). Nhiều từ mạng là từ mượn nguyên ('viral', 'trending', 'share') — phát âm gần tiếng Anh, dễ nhớ.",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'sedang' before a verb = the progressive '-ing' — 'sedang viral', 'sedang trending'. Remember Indonesian doesn't conjugate; you just add 'sedang' (now), 'sudah' (already), 'akan' (will). 'Sebaiknya' = 'it's best to / should' — a very polite advice frame ('Sebaiknya kita cek dulu'). Distinguish 'benar' (true/correct, neutral) from 'bohong' (a lie, colloquial). Many internet words are direct loans ('viral', 'trending', 'share') — pronounced close to English, easy to remember.",
    vocabulary: [
      { cell_id: "3970f2c0-a6ef-495f-a3b6-ee724444ce8c", word: "media sosial", en: "social media", vi: "mạng xã hội", pos: "noun", pronunciation_vi: "ME-di-a so-SI-al", pronunciation_en: "MEH-dee-a so-SEE-al" },
      { cell_id: "63fcc2a6-aa7c-42c0-901b-bdb08b5d7a67", word: "viral", en: "viral (spreading fast)", vi: "viral / lan truyền nhanh", pos: "adj.", pronunciation_vi: "VI-ral", pronunciation_en: "VEE-ral" },
      { cell_id: "d61b1ada-3cc9-411b-802e-58a04d8d881c", word: "trending", en: "trending", vi: "đang thịnh hành", pos: "adj.", pronunciation_vi: "TREN-ding", pronunciation_en: "TREN-ding" },
      { cell_id: "a179249c-4d1e-49c3-a025-6296e5072c0b", word: "hoaks", en: "hoax / fake news", vi: "tin giả", pos: "noun", pronunciation_vi: "HO-aks", pronunciation_en: "HOH-aks" },
      { cell_id: "9ffd6b32-b1ce-4120-a331-f95280a37fb0", word: "beredar", en: "to circulate / spread", vi: "lan truyền / lưu hành", pos: "verb", pronunciation_vi: "be-re-DAR", pronunciation_en: "be-re-DAR" },
      { cell_id: "6e9f80fe-d2c9-40e7-a50c-4f3fd59a3427", word: "sumber", en: "source", vi: "nguồn (tin)", pos: "noun", pronunciation_vi: "SUM-ber", pronunciation_en: "SOOM-ber" },
      { cell_id: "f63550e0-aa78-472a-8811-9d045376b76a", word: "membagikan", en: "to share / distribute", vi: "chia sẻ", pos: "verb", pronunciation_vi: "mem-ba-GI-kan", pronunciation_en: "mem-ba-GEE-kan" },
      { cell_id: "1bfcc4a4-a040-4154-bb30-6d81d30cfea4", word: "sedang", en: "currently / -ing", vi: "đang", pos: "aspect marker", pronunciation_vi: "se-DANG", pronunciation_en: "se-DANG" },
      { cell_id: "a6b8dc0e-54b7-4339-bb34-f7dfaa13d165", word: "bohong", en: "a lie / false", vi: "dối / xạo", pos: "adj./noun", pronunciation_vi: "BO-hong", pronunciation_en: "BOH-hong" },
    ],
    dialogue: [
      { cell_id: "071e9e8e-f741-4db6-bb68-45ad46f5e9f1", speaker: "Dewi", text: "Eh, kamu lihat video yang lagi viral itu? Sedang trending banget.", vi: "Này, cậu xem cái video đang viral đó chưa? Đang trending kinh khủng.", en: "Hey, did you see that viral video? It's super trending." },
      { cell_id: "f89febc2-e649-4559-9adb-efbfbb6631b9", speaker: "Joko", text: "Lihat. Tapi menurutku itu hoaks. Sumbernya nggak jelas.", vi: "Xem rồi. Nhưng tớ thấy đó là tin giả. Nguồn không rõ ràng.", en: "I did. But I think it's a hoax. The source is unclear." },
      { cell_id: "a1215cd6-560b-4ad8-b71d-cd6f2c7d76db", speaker: "Dewi", text: "Iya juga, ya. Sebaiknya kita cek dulu sebelum membagikan.", vi: "Ừ cũng đúng. Tốt nhất ta kiểm tra trước khi chia sẻ.", en: "True. We'd better check before sharing." },
      { cell_id: "4fc49417-6472-4e37-a926-627abb985984", speaker: "Joko", text: "Setuju. Saring dulu sebelum sharing, biar nggak ikut menyebar bohong.", vi: "Đồng ý. Lọc trước khi chia sẻ, để khỏi góp phần lan tin xạo.", en: "Agreed. Filter before sharing, so we don't help spread lies." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về tin online còn thiếu:",
        instruction_en: "Fill in the missing online-news word:",
        items: [
          { prompt: "Berita itu sedang ___ di media sosial. (lan truyền nhanh)", answer: "viral", options: ["viral", "vital", "visa"] },
          { prompt: "Hati-hati, banyak ___ beredar. (tin giả)", answer: "hoaks", options: ["hoaks", "harga", "huruf"] },
          { prompt: "Sebaiknya cek dulu ___ sebelum membagikan. (nguồn)", answer: "sumbernya", options: ["sumbernya", "suaranya", "suratnya"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "media sosial", answer: "mạng xã hội" },
          { prompt: "hoaks", answer: "tin giả" },
          { prompt: "sumber", answer: "nguồn (tin)" },
          { prompt: "membagikan", answer: "chia sẻ" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tin đó đang viral trên mạng xã hội.", answer: "Berita itu sedang viral di media sosial." },
          { prompt: "Cẩn thận, nhiều tin giả lan truyền dạo gần đây.", answer: "Hati-hati, banyak hoaks beredar belakangan ini." },
          { prompt: "Tốt nhất ta nên kiểm tra nguồn trước khi chia sẻ.", answer: "Sebaiknya kita cek dulu sumbernya sebelum membagikan." },
        ],
      },
    ],
  },
  {
    id: "indonesian_media_discussing_events",
    level: "B1",
    category: "news-media",
    title_vi: "Bàn luận thời sự — nêu ý kiến và phản biện",
    title_en: "Discussing current events — giving and hedging opinions",
    sentences: [
      {
        en: "Menurut saya, kebijakan baru itu cukup masuk akal.",
        vi: "Theo tôi, chính sách mới đó khá hợp lý.",
        pronunciation_focus: [
          "menurut saya → 'theo tôi' (mẫu nêu ý kiến cốt lõi)",
          "kebijakan → ke-bi-JA-kan, 'chính sách'",
          "masuk akal → 'hợp lý' (thành ngữ: masuk = vào, akal = lý trí)",
        ],
        pronunciation_focus_en: [
          "menurut saya → 'in my opinion' (the core opinion frame)",
          "kebijakan → 'ke-bee-JA-kan' — policy",
          "masuk akal → 'makes sense / reasonable' (idiom: masuk = enter, akal = reason)",
        ],
      },
      {
        en: "Kalau menurut kamu bagaimana soal isu ini?",
        vi: "Còn theo cậu thì vấn đề này thế nào?",
        pronunciation_focus: [
          "bagaimana → ba-gai-MA-na, 'thế nào/ra sao'",
          "soal → SO-al, 'về việc/vấn đề'",
          "isu → I-su, 'vấn đề/sự việc nóng' (mượn 'issue')",
        ],
        pronunciation_focus_en: [
          "bagaimana → 'ba-gai-MA-na' — how / what about",
          "soal → 'SOH-al' — regarding / the matter of",
          "isu → 'EE-soo' — issue (loanword)",
        ],
      },
      {
        en: "Saya kurang setuju karena dampaknya belum jelas.",
        vi: "Tôi không đồng ý lắm vì tác động chưa rõ.",
        pronunciation_focus: [
          "kurang setuju → 'không đồng ý lắm' (kurang = thiếu/ít, làm dịu lời chê)",
          "karena → KA-re-na, 'vì/bởi vì'",
          "dampak → DAM-pak, 'tác động/ảnh hưởng'",
        ],
        pronunciation_focus_en: [
          "kurang setuju → 'not quite agree' (kurang = less, softens disagreement)",
          "karena → 'KA-re-na' — because",
          "dampak → 'DAM-pak' — impact / effect",
        ],
      },
      {
        en: "Banyak orang berpendapat bahwa harga akan naik.",
        vi: "Nhiều người cho rằng giá sẽ tăng.",
        pronunciation_focus: [
          "berpendapat → ber-pen-DA-pat, 'có ý kiến/cho rằng' (gốc pendapat)",
          "bahwa → BAH-wa, 'rằng' (nối mệnh đề)",
          "naik → NA-ik, 'tăng/lên' (ngược turun = giảm/xuống)",
        ],
        pronunciation_focus_en: [
          "berpendapat → 'ber-pen-DA-pat' — to be of the opinion (root 'pendapat')",
          "bahwa → 'BAH-wa' — that (clause connector)",
          "naik → 'NA-ik' — to rise / go up (opposite 'turun' = fall)",
        ],
      },
      {
        en: "Kita lihat saja perkembangannya nanti.",
        vi: "Cứ chờ xem diễn biến sau vậy.",
        pronunciation_focus: [
          "lihat saja → 'cứ xem thôi' (saja = chỉ/thôi, làm nhẹ giọng)",
          "perkembangan → per-kem-BANG-an, 'diễn biến/sự phát triển'",
          "nanti → NAN-ti, 'sau/lát nữa'",
        ],
        pronunciation_focus_en: [
          "lihat saja → 'let's just see' (saja = just, softens)",
          "perkembangan → 'per-kem-BANG-an' — development / how it unfolds",
          "nanti → 'NAN-tee' — later",
        ],
      },
    ],
    cultural_notes_vi:
      "Người Indonesia thích bàn thời sự nhưng giữ giọng ÔN HÒA và GIÁN TIẾP, nhất là về chính trị, tôn giáo, sắc tộc (nhóm vấn đề nhạy cảm gọi tắt SARA: Suku, Agama, Ras, Antargolongan). Để chê hay bất đồng, người ta nói giảm: 'kurang setuju' (không đồng ý lắm) thay vì 'tidak setuju' (không đồng ý) cho đỡ gay gắt; 'belum tepat' (chưa đúng lắm) thay vì 'salah' (sai). Mẫu nêu ý kiến lịch sự: 'Menurut saya…' (Theo tôi…), 'Kalau saya pribadi…' (Riêng tôi thì…), 'Bisa jadi…' (Có thể là…). Kết thúc tranh luận êm bằng 'Kita lihat saja nanti' (Chờ xem sau) để tránh đối đầu thắng-thua.",
    cultural_notes_en:
      "Indonesians enjoy discussing current events but keep a MODERATE, INDIRECT tone — especially on the sensitive cluster SARA (ethnicity, religion, race, intergroup). To criticize or disagree, they soften: 'kurang setuju' (not quite agree) rather than blunt 'tidak setuju'; 'belum tepat' (not yet right) rather than 'salah' (wrong). Polite opinion frames: 'Menurut saya…' (In my view…), 'Kalau saya pribadi…' (Personally…), 'Bisa jadi…' (It could be…). They often close a debate gently with 'Kita lihat saja nanti' (Let's just wait and see) to avoid a win-lose confrontation.",
    tip_advice_vi:
      "Mẹo cho người Việt: 'menurut + người' = 'theo (ai)' — 'menurut saya' (theo tôi), 'menurut kamu' (theo bạn), 'menurut ahli' (theo chuyên gia). Bí quyết lịch sự: dùng 'kurang' (ít/thiếu) để làm dịu lời chê — 'kurang setuju', 'kurang tepat', 'kurang jelas' nghe nhã hơn hẳn 'tidak'. 'Bahwa' = 'rằng' nối sau động từ ý kiến: 'berpendapat bahwa…', 'mengatakan bahwa…'. Cặp đối nghĩa thời sự: naik (tăng) ↔ turun (giảm), setuju (đồng ý) ↔ menolak (phản đối). Tránh chủ đề SARA khi chưa thân; nếu bất đồng, kết bằng 'Kita lihat saja nanti'.",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'menurut + person' = 'according to' — 'menurut saya' (in my view), 'menurut kamu' (in yours), 'menurut ahli' (per experts). Politeness trick: use 'kurang' (less/lacking) to soften criticism — 'kurang setuju', 'kurang tepat', 'kurang jelas' sound far gentler than 'tidak'. 'Bahwa' = 'that', linking after opinion verbs: 'berpendapat bahwa…', 'mengatakan bahwa…'. Current-affairs antonyms: naik (rise) ↔ turun (fall), setuju (agree) ↔ menolak (reject). Avoid SARA topics until you're close; if you disagree, close with 'Kita lihat saja nanti'.",
    vocabulary: [
      { cell_id: "423c0b04-46ef-456c-a71d-d68eccea4122", word: "menurut saya", en: "in my opinion", vi: "theo tôi", pos: "phrase", pronunciation_vi: "me-NU-rut SA-ya", pronunciation_en: "me-NOO-root SA-ya" },
      { cell_id: "874cbe48-257a-450b-ba27-29db1f85226f", word: "isu", en: "issue", vi: "vấn đề / sự việc", pos: "noun", pronunciation_vi: "I-su", pronunciation_en: "EE-soo" },
      { cell_id: "a16b3a69-3148-4beb-9ce9-5733fda466c2", word: "kebijakan", en: "policy", vi: "chính sách", pos: "noun", pronunciation_vi: "ke-bi-JA-kan", pronunciation_en: "ke-bee-JA-kan" },
      { cell_id: "8268d1df-c671-4b31-904b-16d8cce3e627", word: "berpendapat", en: "to be of the opinion", vi: "cho rằng / có ý kiến", pos: "verb", pronunciation_vi: "ber-pen-DA-pat", pronunciation_en: "ber-pen-DA-pat" },
      { cell_id: "c97de7c0-8dac-427a-9850-06a0cb06d2ad", word: "setuju", en: "to agree", vi: "đồng ý", pos: "verb", pronunciation_vi: "se-TU-ju", pronunciation_en: "se-TOO-joo" },
      { cell_id: "6ca58139-367a-4efe-8187-cbecd1c604a6", word: "dampak", en: "impact / effect", vi: "tác động", pos: "noun", pronunciation_vi: "DAM-pak", pronunciation_en: "DAM-pak" },
      { cell_id: "1f67b0d4-2ceb-4423-b16f-40e7bf5e55b9", word: "masuk akal", en: "to make sense / reasonable", vi: "hợp lý", pos: "phrase", pronunciation_vi: "MA-suk A-kal", pronunciation_en: "MA-sook A-kal" },
      { cell_id: "073cfa08-a1e5-4c3b-9720-98861090f2c5", word: "perkembangan", en: "development / how it unfolds", vi: "diễn biến", pos: "noun", pronunciation_vi: "per-kem-BANG-an", pronunciation_en: "per-kem-BANG-an" },
      { cell_id: "c3f05c79-d440-4d4f-8378-02bc514ab1b2", word: "kurang", en: "less / not quite (softener)", vi: "ít / chưa lắm", pos: "adv.", pronunciation_vi: "KU-rang", pronunciation_en: "KOO-rang" },
    ],
    dialogue: [
      { cell_id: "e158b452-1394-49ef-901a-160890c7755f", speaker: "Bayu", text: "Menurut kamu bagaimana soal kebijakan harga BBM yang baru?", vi: "Theo cậu thì chính sách giá xăng dầu mới thế nào?", en: "What do you think about the new fuel-price policy?" },
      { cell_id: "295b9d3a-1448-40c6-819f-a6e277b3a97f", speaker: "Maya", text: "Menurut saya cukup masuk akal, tapi dampaknya ke rakyat kecil belum jelas.", vi: "Theo tôi cũng khá hợp lý, nhưng tác động lên người nghèo chưa rõ.", en: "I think it's fairly reasonable, but its impact on poorer people isn't clear yet." },
      { cell_id: "4d50b621-2d19-4956-bca1-e11595562a0d", speaker: "Bayu", text: "Saya kurang setuju, sih. Banyak orang berpendapat harga lain ikut naik.", vi: "Tôi thì không đồng ý lắm. Nhiều người cho rằng giá khác cũng tăng theo.", en: "I don't quite agree. Many think other prices will rise too." },
      { cell_id: "91e7b61c-b792-48a9-a09a-8a925ffe4f23", speaker: "Maya", text: "Bisa jadi. Ya sudah, kita lihat saja perkembangannya nanti.", vi: "Có thể lắm. Thôi vậy, cứ chờ xem diễn biến sau.", en: "Could be. Well, let's just wait and see how it develops." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về bàn luận thời sự còn thiếu:",
        instruction_en: "Fill in the missing discussion word:",
        items: [
          { prompt: "___ saya, kebijakan itu cukup masuk akal. (theo)", answer: "Menurut", options: ["Menurut", "Membaca", "Menulis"] },
          { prompt: "Saya ___ setuju karena dampaknya belum jelas. (không … lắm)", answer: "kurang", options: ["kurang", "sangat", "selalu"] },
          { prompt: "Banyak orang berpendapat ___ harga akan naik. (rằng)", answer: "bahwa", options: ["bahwa", "bisa", "buruk"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "menurut saya", answer: "theo tôi" },
          { prompt: "kebijakan", answer: "chính sách" },
          { prompt: "dampak", answer: "tác động" },
          { prompt: "masuk akal", answer: "hợp lý" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Theo tôi, chính sách mới đó khá hợp lý.", answer: "Menurut saya, kebijakan baru itu cukup masuk akal." },
          { prompt: "Tôi không đồng ý lắm vì tác động chưa rõ.", answer: "Saya kurang setuju karena dampaknya belum jelas." },
          { prompt: "Cứ chờ xem diễn biến sau vậy.", answer: "Kita lihat saja perkembangannya nanti." },
        ],
      },
    ],
  },
];

export default newsMediaLessons;
