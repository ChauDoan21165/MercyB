// src/languages/indonesian/lessons-b2.ts
//
// Indonesian (Bahasa Indonesia) B2 lessons for Vietnamese learners.
// Topics: news/media vocabulary, formal writing, business Indonesian,
// debating opinions, the conditional (kalau / seandainya / andaikata),
// the di- passive voice, and complex (multi-clause) sentences.
//
// Shape mirrors the Portuguese pack (src/languages/portuguese/lessons-b2.ts) so
// the page UI stays consistent across verticals. The Indonesian pack declares
// its own inline type surface here and keeps it structurally compatible — when a
// shared registry lands, swap this for `import type { IndonesianLesson } from "./lessons";`.
//
// Standard Bahasa Indonesia (formal/baku) throughout, with explicit notes on the
// gap between formal Bahasa and colloquial Jakarta slang (gue/lu, gak, banget…)
// that a VN learner needs to read the news AND survive a WhatsApp chat.
//
// Indonesian uses Latin script — no special script rendering needed.
// Hand-crafted; no AI-generated filler. Vietnamese L1 notes + English companions.

// ── Inline type surface (mirrors PortugueseLesson) ──────────────────────────

export type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  // English-speaker companion to pronunciation_focus — same length + order.
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  // English-speaker pronunciation hint with stressed syllable in CAPS.
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields can vary. Known optional fields:
//   fill-blank:  question, answer, hint_vi?, hint_en?
//   matching:    pairs, instruction, instruction_en?
//   translation: vietnamese, indonesian, english?, hint_vi?, hint_en?
export type IndonesianExercise = Record<string, unknown>;

export type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: IndonesianLessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: IndonesianVocabEntry[];
  dialogue?: IndonesianDialogueLine[];
  exercises?: IndonesianExercise[];
  content?: string;
  // B2 calibration fields — optional passthrough; consumed by normalizer + renderer
  dialogue_long?: IndonesianDialogueLine[];
  roleplay_prompts?: string[];
  roleplay_prompts_en?: string[];
  grammar_focus_vi?: string;
  grammar_focus_en?: string;
  register_notes?: string;
  register_notes_vi?: string;
  register_notes_en?: string;
  idiom_glosses?: {
    idiom: string;
    literal: string;
    literal_en?: string;
    meaning: string;
    meaning_en?: string;
    example: string;
    example_en?: string;
  }[];
};

// ── Lessons ─────────────────────────────────────────────────────────────────

export const lessons: IndonesianLesson[] = [
  // ── 1. News / media vocabulary ────────────────────────────────────────────
  {
    id: "indonesian_news_media_vocabulary",
    level: "B2",
    category: "news_media",
    title_vi: "Tin tức và truyền thông",
    title_en: "News and media",
    sentences: [
      {
        en: "According to the latest news, the government will raise the fuel price.",
        vi: "Theo tin tức mới nhất, chính phủ sẽ tăng giá nhiên liệu.",
        pronunciation_focus: ["berita→bơ-RI-ta", "pemerintah→pơ-mơ-RIN-tah"],
        pronunciation_focus_en: ["berita→buh-REE-ta", "pemerintah→puh-muh-RIN-tah"],
      },
      {
        en: "This article was published by a national newspaper yesterday.",
        vi: "Bài báo này được một tờ báo quốc gia đăng hôm qua.",
        pronunciation_focus: ["artikel→ar-TI-kel", "diterbitkan→di-tơr-BIT-kan"],
        pronunciation_focus_en: ["artikel→ar-TEE-kel", "diterbitkan→dee-tur-BIT-kan"],
      },
      {
        en: "The reporter interviewed several eyewitnesses at the scene.",
        vi: "Phóng viên đã phỏng vấn vài nhân chứng tại hiện trường.",
        pronunciation_focus: ["wartawan→war-ta-WAN", "saksi→SAK-si"],
        pronunciation_focus_en: ["wartawan→war-ta-WAN", "saksi→SAHK-see"],
      },
      {
        en: "Don't trust that headline; it could be a hoax spreading on social media.",
        vi: "Đừng tin tiêu đề đó; nó có thể là tin giả lan truyền trên mạng xã hội.",
        pronunciation_focus: ["berita bohong→bơ-RI-ta bô-HÔNG", "media sosial→ME-di-a sô-si-AL"],
        pronunciation_focus_en: ["berita bohong→buh-REE-ta boh-HONG", "media sosial→MEH-dee-a soh-see-AL"],
      },
      {
        en: "The broadcast will air live at eight o'clock tonight.",
        vi: "Buổi phát sóng sẽ được truyền hình trực tiếp lúc tám giờ tối nay.",
        pronunciation_focus: ["siaran→si-A-ran", "langsung→LANG-sung"],
        pronunciation_focus_en: ["siaran→see-AH-ran", "langsung→LAHNG-soong"],
      },
    ],
    cultural_notes_vi:
      "Báo chí Indonesia phân biệt rõ 'berita' (tin tức) và 'opini' (quan điểm). Từ 'hoaks' (mượn từ 'hoax') cực phổ biến từ thời mạng xã hội bùng nổ — chính phủ thường kêu gọi 'cek fakta' (kiểm chứng). Đài lớn: TVRI (quốc gia), Kompas, Tempo, Detik (báo mạng).",
    cultural_notes_en:
      "Indonesian press clearly separates 'berita' (news) from 'opini' (opinion). The word 'hoaks' (from 'hoax') exploded with social media; the government constantly urges 'cek fakta' (fact-check). Big outlets: TVRI (national), Kompas, Tempo, Detik (online).",
    tip_advice_vi:
      "Tiêu đề báo hay dùng thể bị động với tiền tố 'di-': 'Harga BBM dinaikkan' (Giá xăng được tăng). Học nhận ra 'di-' + động từ = bị động — sẽ gặp ở MỌI bản tin. 'Menurut…' = theo (nguồn tin).",
    tip_advice_en:
      "Headlines love the di- passive: 'Harga BBM dinaikkan' (The fuel price is raised). Learn to spot 'di-' + verb = passive — it's in EVERY news report. 'Menurut…' = according to (a source).",
    vocabulary: [
      { word: "berita", en: "news", vi: "tin tức", pos: "n.", pronunciation_vi: "bơ-RI-ta", pronunciation_en: "buh-REE-ta" },
      { word: "wartawan", en: "journalist/reporter", vi: "nhà báo/phóng viên", pos: "n.", pronunciation_vi: "war-ta-WAN", pronunciation_en: "war-ta-WAN" },
      { word: "media massa", en: "mass media", vi: "truyền thông đại chúng", pos: "n.", pronunciation_vi: "ME-di-a MAS-sa", pronunciation_en: "MEH-dee-a MAH-sa" },
      { word: "surat kabar / koran", en: "newspaper", vi: "báo (giấy)", pos: "n.", pronunciation_vi: "SU-rat KA-bar / KO-ran", pronunciation_en: "SOO-rat KA-bar / KO-ran" },
      { word: "siaran", en: "broadcast", vi: "buổi phát sóng", pos: "n.", pronunciation_vi: "si-A-ran", pronunciation_en: "see-AH-ran" },
      { word: "menerbitkan", en: "to publish", vi: "xuất bản/đăng", pos: "v.", pronunciation_vi: "mơ-nơr-BIT-kan", pronunciation_en: "muh-nur-BIT-kan" },
      { word: "berita bohong / hoaks", en: "fake news/hoax", vi: "tin giả", pos: "n.", pronunciation_vi: "bơ-RI-ta bô-HÔNG", pronunciation_en: "buh-REE-ta boh-HONG" },
      { word: "narasumber", en: "source/interviewee", vi: "nguồn tin", pos: "n.", pronunciation_vi: "na-ra-SUM-bơr", pronunciation_en: "na-ra-SOOM-bur" },
      { word: "tajuk / judul", en: "headline/title", vi: "tiêu đề", pos: "n.", pronunciation_vi: "TA-juk / JU-dul", pronunciation_en: "TA-jook / JOO-dool" },
      { word: "langsung", en: "live/direct", vi: "trực tiếp", pos: "adv.", pronunciation_vi: "LANG-sung", pronunciation_en: "LAHNG-soong" },
    ],
    dialogue: [
      {
        speaker: "A",
        text: "Kamu sudah baca berita tentang banjir di Jakarta?",
        vi: "Bạn đã đọc tin về lũ lụt ở Jakarta chưa?",
        en: "Have you read the news about the flooding in Jakarta?",
      },
      {
        speaker: "B",
        text: "Sudah, tapi judulnya berlebihan. Sepertinya itu hoaks.",
        vi: "Rồi, nhưng tiêu đề phóng đại. Có vẻ đó là tin giả.",
        en: "Yes, but the headline is exaggerated. It seems like a hoax.",
      },
      {
        speaker: "A",
        text: "Menurut Kompas, datanya resmi dari pemerintah, kok.",
        vi: "Theo Kompas, dữ liệu là chính thức từ chính phủ mà.",
        en: "According to Kompas, the data is official, from the government.",
      },
      {
        speaker: "B",
        text: "Oke, kalau begitu kita cek fakta dulu sebelum membagikannya.",
        vi: "Được, vậy thì ta kiểm chứng trước khi chia sẻ nó.",
        en: "Okay, then let's fact-check first before sharing it.",
      },
    ],
    roleplay_prompts: [
      "Bạn là phóng viên phỏng vấn một nhân chứng ('narasumber') về một vụ cháy chợ. Hỏi 3 câu, dùng 'menurut Anda'.",
      "Một người bạn chia sẻ một 'hoaks'. Hãy lịch sự khuyên họ 'cek fakta' trước khi tin.",
    ],
    roleplay_prompts_en: [
      "You're a reporter interviewing an eyewitness ('narasumber') about a market fire. Ask 3 questions using 'menurut Anda'.",
      "A friend shares a 'hoaks'. Politely advise them to 'cek fakta' before believing it.",
    ],
    register_notes_vi:
      "Báo viết dùng 'baku' (chuẩn): 'tidak', 'memberi tahu'. Chat đời thường thì 'nggak/gak', 'ngasih tau'. Khi đọc tin chính thống, bạn sẽ thấy đầy 'di-' bị động và từ Hán-tự gốc Sanskrit như 'pemerintah'.",
    register_notes_en:
      "Print news uses 'baku' (standard): 'tidak', 'memberi tahu'. Casual chat: 'nggak/gak', 'ngasih tau'. Formal reporting is full of di- passives and Sanskrit-rooted words like 'pemerintah'.",
    exercises: [
      {
        type: "fill-blank",
        question: "___ berita terbaru, harga BBM akan naik.",
        answer: "Menurut",
        hint_vi: "'theo (nguồn tin)'",
        hint_en: "'according to'",
      },
      {
        type: "matching",
        pairs: [
          ["wartawan", "nhà báo"],
          ["siaran langsung", "phát sóng trực tiếp"],
          ["hoaks", "tin giả"],
        ],
        instruction: "Nối từ với nghĩa tiếng Việt",
        instruction_en: "Match each word with its Vietnamese meaning.",
      },
      {
        type: "translation",
        vietnamese: "Bài báo này được đăng hôm qua.",
        indonesian: "Artikel ini diterbitkan kemarin.",
        english: "This article was published yesterday.",
        hint_vi: "thể bị động: 'di-' + 'terbit' + '-kan'",
        hint_en: "passive: 'di-' + 'terbit' + '-kan'",
      },
    ],
  },

  // ── 2. The di- passive voice ──────────────────────────────────────────────
  {
    id: "indonesian_passive_voice_di_prefix",
    level: "B2",
    category: "grammar",
    title_vi: "Thể bị động với tiền tố 'di-'",
    title_en: "The di- passive voice",
    sentences: [
      {
        en: "The letter was sent by the manager this morning.",
        vi: "Lá thư đã được giám đốc gửi sáng nay.",
        pronunciation_focus: ["dikirim→di-KI-rim", "manajer→ma-NA-jơr"],
        pronunciation_focus_en: ["dikirim→dee-KEE-rim", "manajer→ma-NA-jur"],
      },
      {
        en: "This problem must be resolved before the meeting.",
        vi: "Vấn đề này phải được giải quyết trước cuộc họp.",
        pronunciation_focus: ["diselesaikan→di-sơ-lơ-SAI-kan", "rapat→RA-pat"],
        pronunciation_focus_en: ["diselesaikan→dee-suh-luh-SIGH-kan", "rapat→RAH-pat"],
      },
      {
        en: "The decision was already made by the board of directors.",
        vi: "Quyết định đã được hội đồng quản trị đưa ra.",
        pronunciation_focus: ["diambil→di-AM-bil", "direksi→di-REK-si"],
        pronunciation_focus_en: ["diambil→dee-AHM-bil", "direksi→dee-REK-see"],
      },
      {
        en: "I was invited to the wedding, but I can't come.",
        vi: "Tôi được mời đến đám cưới, nhưng tôi không thể đến.",
        pronunciation_focus: ["diundang→di-UN-dang", "pernikahan→pơr-ni-KA-han"],
        pronunciation_focus_en: ["diundang→dee-OON-dang", "pernikahan→pur-nee-KA-han"],
      },
      {
        en: "The report I wrote was praised by my boss.",
        vi: "Báo cáo tôi viết đã được sếp khen.",
        pronunciation_focus: ["saya tulis→SA-ya TU-lis", "dipuji→di-PU-ji"],
        pronunciation_focus_en: ["saya tulis→SAH-ya TOO-lis", "dipuji→dee-POO-jee"],
      },
    ],
    cultural_notes_vi:
      "Tiếng Indonesia dùng bị động NHIỀU hơn tiếng Việt và tiếng Anh rất nhiều — đặc biệt trong văn viết, tin tức và văn phòng. Câu chủ động 'Manajer mengirim surat' (Giám đốc gửi thư) thường được viết lại thành bị động 'Surat dikirim manajer' để nhấn vào 'lá thư'.",
    cultural_notes_en:
      "Indonesian uses the passive far more than Vietnamese or English — especially in writing, news, and the office. Active 'Manajer mengirim surat' (The manager sends the letter) is often recast as passive 'Surat dikirim manajer' to foreground 'the letter'.",
    tip_advice_vi:
      "HAI loại bị động: (1) ngôi thứ 3 → 'di-' + gốc động từ: 'Surat dikirim (oleh) manajer'. 'oleh' = bởi (có thể bỏ). (2) ngôi thứ 1/2 → đại từ + gốc động từ KHÔNG có 'di-': 'Surat saya kirim' (Lá thư tôi gửi), 'Buku itu kamu baca?' (Cuốn sách đó bạn đọc à?). Đừng nói 'disaya kirim' — SAI.",
    tip_advice_en:
      "TWO passive types: (1) 3rd person → 'di-' + verb root: 'Surat dikirim (oleh) manajer'. 'oleh' = by (often dropped). (2) 1st/2nd person → pronoun + bare verb root, NO 'di-': 'Surat saya kirim' (The letter, I sent), 'Buku itu kamu baca?' (That book, you read it?). Never say 'disaya kirim' — wrong.",
    grammar_focus_vi:
      "Cấu trúc: [đối tượng] + di- + [gốc động từ] + (oleh) + [chủ thể]. Gốc động từ BỎ tiền tố 'me-': mengirim → dikirim, membaca → dibaca, menyelesaikan → diselesaikan.",
    grammar_focus_en:
      "Pattern: [object] + di- + [verb root] + (oleh) + [agent]. The root DROPS the active 'me-' prefix: mengirim → dikirim, membaca → dibaca, menyelesaikan → diselesaikan.",
    vocabulary: [
      { word: "dikirim", en: "(is/was) sent", vi: "được gửi", pos: "v. (pass.)", pronunciation_vi: "di-KI-rim", pronunciation_en: "dee-KEE-rim" },
      { word: "dibaca", en: "(is/was) read", vi: "được đọc", pos: "v. (pass.)", pronunciation_vi: "di-BA-cha", pronunciation_en: "dee-BAH-cha" },
      { word: "diselesaikan", en: "(is/was) resolved", vi: "được giải quyết", pos: "v. (pass.)", pronunciation_vi: "di-sơ-lơ-SAI-kan", pronunciation_en: "dee-suh-luh-SIGH-kan" },
      { word: "diundang", en: "(is/was) invited", vi: "được mời", pos: "v. (pass.)", pronunciation_vi: "di-UN-dang", pronunciation_en: "dee-OON-dang" },
      { word: "diambil", en: "(is/was) taken", vi: "được lấy/đưa ra", pos: "v. (pass.)", pronunciation_vi: "di-AM-bil", pronunciation_en: "dee-AHM-bil" },
      { word: "oleh", en: "by (agent marker)", vi: "bởi", pos: "prep.", pronunciation_vi: "Ô-lê", pronunciation_en: "OH-lay" },
      { word: "ditulis", en: "(is/was) written", vi: "được viết", pos: "v. (pass.)", pronunciation_vi: "di-TU-lis", pronunciation_en: "dee-TOO-lis" },
      { word: "dilakukan", en: "(is/was) done/carried out", vi: "được thực hiện", pos: "v. (pass.)", pronunciation_vi: "di-la-KU-kan", pronunciation_en: "dee-la-KOO-kan" },
      { word: "diputuskan", en: "(is/was) decided", vi: "được quyết định", pos: "v. (pass.)", pronunciation_vi: "di-pu-TUS-kan", pronunciation_en: "dee-poo-TOOS-kan" },
      { word: "disetujui", en: "(is/was) approved", vi: "được phê duyệt", pos: "v. (pass.)", pronunciation_vi: "di-sơ-tu-JU-i", pronunciation_en: "dee-suh-too-JOO-ee" },
    ],
    dialogue: [
      {
        speaker: "Atasan",
        text: "Apakah laporan keuangan sudah diselesaikan?",
        vi: "Báo cáo tài chính đã được hoàn thành chưa?",
        en: "Has the financial report been completed?",
      },
      {
        speaker: "Staf",
        text: "Sudah, Pak. Laporannya saya kirim tadi pagi lewat email.",
        vi: "Rồi ạ. Báo cáo tôi đã gửi sáng nay qua email.",
        en: "Yes, sir. The report, I sent it this morning by email.",
      },
      {
        speaker: "Atasan",
        text: "Bagus. Apakah angka-angkanya sudah diperiksa oleh tim audit?",
        vi: "Tốt. Các con số đã được nhóm kiểm toán kiểm tra chưa?",
        en: "Good. Have the figures been checked by the audit team?",
      },
      {
        speaker: "Staf",
        text: "Sudah diperiksa dan disetujui kemarin.",
        vi: "Đã được kiểm tra và phê duyệt hôm qua.",
        en: "They were checked and approved yesterday.",
      },
    ],
    roleplay_prompts: [
      "Sếp hỏi 4 việc đã 'được làm' chưa. Trả lời bằng bị động: 'Sudah dikirim', 'Sudah diselesaikan'…",
      "Kể lại một ngày làm việc CHỈ dùng câu bị động ngôi thứ 1: 'Email saya balas, laporan saya tulis…'.",
    ],
    roleplay_prompts_en: [
      "Your boss asks if 4 tasks have 'been done'. Answer in the passive: 'Sudah dikirim', 'Sudah diselesaikan'…",
      "Recount a workday using ONLY 1st-person passives: 'Email saya balas, laporan saya tulis…' (The emails, I replied; the report, I wrote).",
    ],
    register_notes_vi:
      "Văn phòng/tin tức rất thích bị động 'di-' vì nghe khách quan, trang trọng. Trong nói chuyện đời thường người ta vẫn dùng nó, nhưng cũng hay quay lại câu chủ động 'aku kirim' (tôi gửi) cho gọn.",
    register_notes_en:
      "Offices and news love the di- passive because it sounds objective and formal. In casual speech people still use it, but often switch back to active 'aku kirim' (I sent) for brevity.",
    exercises: [
      {
        type: "fill-blank",
        question: "Surat itu ___ oleh manajer kemarin. (kirim)",
        answer: "dikirim",
        hint_vi: "'di-' + gốc 'kirim'",
        hint_en: "'di-' + root 'kirim'",
      },
      {
        type: "matching",
        pairs: [
          ["ditulis", "được viết"],
          ["diputuskan", "được quyết định"],
          ["disetujui", "được phê duyệt"],
        ],
        instruction: "Nối động từ bị động với nghĩa tiếng Việt",
        instruction_en: "Match each passive verb with its Vietnamese meaning.",
      },
      {
        type: "translation",
        vietnamese: "Báo cáo tôi đã gửi sáng nay.",
        indonesian: "Laporan itu saya kirim tadi pagi.",
        english: "The report, I sent it this morning.",
        hint_vi: "bị động ngôi 1: KHÔNG có 'di-', dùng 'saya kirim'",
        hint_en: "1st-person passive: NO 'di-', use 'saya kirim'",
      },
    ],
  },

  // ── 3. The conditional (kalau / seandainya / andaikata) ───────────────────
  {
    id: "indonesian_conditional_kalau_seandainya",
    level: "B2",
    category: "grammar",
    title_vi: "Câu điều kiện: kalau / seandainya / andaikata",
    title_en: "The conditional: kalau / seandainya / andaikata",
    sentences: [
      {
        en: "If it rains tomorrow, the event will be postponed.",
        vi: "Nếu ngày mai trời mưa, sự kiện sẽ bị hoãn.",
        pronunciation_focus: ["kalau→KA-lau", "ditunda→di-TUN-da"],
        pronunciation_focus_en: ["kalau→KA-low", "ditunda→dee-TOON-da"],
      },
      {
        en: "If I were rich, I would build a school in my village.",
        vi: "Nếu tôi giàu, tôi sẽ xây một trường học ở làng tôi.",
        pronunciation_focus: ["seandainya→sơ-an-DAI-nya", "kampung→KAM-pung"],
        pronunciation_focus_en: ["seandainya→suh-an-DIGH-nya", "kampung→KAHM-poong"],
      },
      {
        en: "Suppose you had known earlier, what would you have done?",
        vi: "Giả sử bạn biết sớm hơn, bạn sẽ làm gì?",
        pronunciation_focus: ["andaikata→an-dai-KA-ta", "lebih awal→lơ-BIH a-WAL"],
        pronunciation_focus_en: ["andaikata→an-digh-KA-ta", "lebih awal→luh-BEEH a-WAL"],
      },
      {
        en: "As long as you study hard, you'll definitely pass.",
        vi: "Miễn là bạn học chăm chỉ, bạn chắc chắn sẽ đỗ.",
        pronunciation_focus: ["asalkan→a-SAL-kan", "lulus→LU-lus"],
        pronunciation_focus_en: ["asalkan→a-SAHL-kan", "lulus→LOO-loos"],
      },
      {
        en: "If only I had listened to your advice back then.",
        vi: "Giá như hồi đó tôi đã nghe lời khuyên của bạn.",
        pronunciation_focus: ["seandainya→sơ-an-DAI-nya", "nasihat→na-SI-hat"],
        pronunciation_focus_en: ["seandainya→suh-an-DIGH-nya", "nasihat→na-SEE-hat"],
      },
    ],
    cultural_notes_vi:
      "Tiếng Indonesia KHÔNG chia động từ theo thì, nên câu điều kiện chỉ khác nhau ở liên từ + ngữ cảnh — RẤT dễ cho người Việt (giống 'nếu / giả sử / giá như'). 'Kalau' = điều kiện thực tế. 'Seandainya / andaikata' = điều kiện giả định, không có thật (loại 'giá như').",
    cultural_notes_en:
      "Indonesian does NOT conjugate verbs for tense, so conditionals differ only by the conjunction + context — very easy for Vietnamese speakers (just like 'nếu / giả sử / giá như'). 'Kalau' = a real condition. 'Seandainya / andaikata' = a hypothetical, counterfactual one ('if only…').",
    tip_advice_vi:
      "'Kalau' (hay nói tắt 'kalo') là từ đa năng nhất — dùng cho điều kiện thực tế và cả câu hỏi 'còn… thì sao'. 'Jika' là bản trang trọng của 'kalau', hay gặp trong văn viết. 'Seandainya' + 'pasti/mungkin' để diễn đạt 'giá như… thì chắc/có lẽ…'.",
    tip_advice_en:
      "'Kalau' (often shortened to 'kalo') is the all-purpose one — real conditions and 'what about…?' questions. 'Jika' is the formal written version of 'kalau'. Pair 'seandainya' with 'pasti/mungkin' to say 'if only… then surely/maybe…'.",
    grammar_focus_vi:
      "Không có thì giả định riêng. Phân biệt bằng liên từ: kalau/jika (thực tế) ⟷ seandainya/andaikata/andai saja (giả định). Mệnh đề kết quả thường có 'akan' (sẽ), 'pasti' (chắc chắn), hoặc 'mungkin' (có lẽ).",
    grammar_focus_en:
      "There is no separate subjunctive. The conjunction carries the meaning: kalau/jika (real) ⟷ seandainya/andaikata/andai saja (hypothetical). The result clause typically uses 'akan' (will), 'pasti' (surely), or 'mungkin' (maybe).",
    vocabulary: [
      { word: "kalau / kalo", en: "if (real, casual)", vi: "nếu", pos: "conj.", pronunciation_vi: "KA-lau / KA-lô", pronunciation_en: "KA-low" },
      { word: "jika", en: "if (formal)", vi: "nếu (trang trọng)", pos: "conj.", pronunciation_vi: "JI-ka", pronunciation_en: "JEE-ka" },
      { word: "seandainya", en: "if (hypothetical)", vi: "giả sử/giá như", pos: "conj.", pronunciation_vi: "sơ-an-DAI-nya", pronunciation_en: "suh-an-DIGH-nya" },
      { word: "andaikata / andai saja", en: "suppose that / if only", vi: "giả như", pos: "conj.", pronunciation_vi: "an-dai-KA-ta", pronunciation_en: "an-digh-KA-ta" },
      { word: "asalkan", en: "as long as / provided that", vi: "miễn là", pos: "conj.", pronunciation_vi: "a-SAL-kan", pronunciation_en: "a-SAHL-kan" },
      { word: "kecuali", en: "unless / except", vi: "trừ khi", pos: "conj.", pronunciation_vi: "kơ-chu-A-li", pronunciation_en: "kuh-choo-AH-lee" },
      { word: "akan", en: "will (future marker)", vi: "sẽ", pos: "aux.", pronunciation_vi: "A-kan", pronunciation_en: "AH-kan" },
      { word: "pasti", en: "surely/definitely", vi: "chắc chắn", pos: "adv.", pronunciation_vi: "PAS-ti", pronunciation_en: "PAHS-tee" },
      { word: "mungkin", en: "maybe/possibly", vi: "có lẽ", pos: "adv.", pronunciation_vi: "MUNG-kin", pronunciation_en: "MOONG-kin" },
      { word: "ditunda", en: "(is/was) postponed", vi: "bị hoãn", pos: "v. (pass.)", pronunciation_vi: "di-TUN-da", pronunciation_en: "dee-TOON-da" },
    ],
    dialogue: [
      {
        speaker: "A",
        text: "Kalau besok hujan, acaranya jadi tidak?",
        vi: "Nếu mai mưa, sự kiện còn diễn ra không?",
        en: "If it rains tomorrow, is the event still on?",
      },
      {
        speaker: "B",
        text: "Kalau hujan deras, pasti ditunda. Tapi kalau gerimis, tetap jalan.",
        vi: "Nếu mưa to, chắc chắn hoãn. Nhưng nếu mưa phùn, vẫn tiến hành.",
        en: "If it pours, it'll surely be postponed. But if it just drizzles, it goes ahead.",
      },
      {
        speaker: "A",
        text: "Seandainya kita sewa tenda dari kemarin, kita nggak perlu khawatir.",
        vi: "Giá như hôm qua ta thuê lều, ta đã không phải lo.",
        en: "If only we'd rented a tent yesterday, we wouldn't have to worry.",
      },
      {
        speaker: "B",
        text: "Betul. Asalkan ada tenda, acara bisa tetap lanjut walaupun hujan.",
        vi: "Đúng. Miễn là có lều, sự kiện vẫn tiếp tục dù trời mưa.",
        en: "True. As long as there's a tent, the event can continue even if it rains.",
      },
    ],
    roleplay_prompts: [
      "Lập kế hoạch dự phòng cho một chuyến đi: dùng 'kalau' (điều kiện thực) cho 3 tình huống thời tiết.",
      "Tiếc nuối một quyết định cũ: dùng 'seandainya' + 'pasti' để nói 'giá như… thì chắc chắn…'.",
    ],
    roleplay_prompts_en: [
      "Make a backup plan for a trip: use 'kalau' (real condition) for 3 weather scenarios.",
      "Regret a past decision: use 'seandainya' + 'pasti' to say 'if only… then surely…'.",
    ],
    register_notes_vi:
      "'Jika' chỉ dùng văn viết/trang trọng — nói ra miệng nghe cứng. Đời thường gần như luôn là 'kalau' hoặc 'kalo'. Slang Jakarta còn rút thành 'klo' khi nhắn tin.",
    register_notes_en:
      "'Jika' is written/formal only — saying it aloud sounds stiff. Everyday speech is nearly always 'kalau' or 'kalo'. Jakarta slang even shortens it to 'klo' in texts.",
    exercises: [
      {
        type: "fill-blank",
        question: "___ saya kaya, saya akan membangun sekolah. (giả định)",
        answer: "Seandainya",
        hint_vi: "điều kiện không có thật = 'giá như'",
        hint_en: "counterfactual = 'if only / if I were'",
      },
      {
        type: "matching",
        pairs: [
          ["kalau", "nếu (thực tế)"],
          ["seandainya", "giá như"],
          ["asalkan", "miễn là"],
        ],
        instruction: "Nối liên từ với nghĩa tiếng Việt",
        instruction_en: "Match each conjunction with its Vietnamese meaning.",
      },
      {
        type: "translation",
        vietnamese: "Nếu ngày mai trời mưa, sự kiện sẽ bị hoãn.",
        indonesian: "Kalau besok hujan, acaranya akan ditunda.",
        english: "If it rains tomorrow, the event will be postponed.",
        hint_vi: "'kalau' + 'akan' + bị động 'ditunda'",
        hint_en: "'kalau' + 'akan' + passive 'ditunda'",
      },
    ],
  },

  // ── 4. Debating opinions ──────────────────────────────────────────────────
  {
    id: "indonesian_debating_opinions",
    level: "B2",
    category: "debating",
    title_vi: "Tranh luận và bày tỏ quan điểm",
    title_en: "Debating and expressing opinions",
    sentences: [
      {
        en: "In my opinion, this policy will harm small businesses.",
        vi: "Theo ý kiến của tôi, chính sách này sẽ gây hại cho doanh nghiệp nhỏ.",
        pronunciation_focus: ["menurut saya→mơ-NU-rut SA-ya", "kebijakan→kơ-bi-JA-kan"],
        pronunciation_focus_en: ["menurut saya→muh-NOO-root SAH-ya", "kebijakan→kuh-bee-JA-kan"],
      },
      {
        en: "I understand your point, but I see it differently.",
        vi: "Tôi hiểu quan điểm của bạn, nhưng tôi nhìn nhận khác.",
        pronunciation_focus: ["maksud Anda→MAK-sud AN-da", "berbeda→bơr-BE-da"],
        pronunciation_focus_en: ["maksud Anda→MAHK-sood AHN-da", "berbeda→bur-BEH-da"],
      },
      {
        en: "On the contrary, the data shows the opposite.",
        vi: "Ngược lại, dữ liệu cho thấy điều trái ngược.",
        pronunciation_focus: ["sebaliknya→sơ-ba-LIK-nya", "sebaliknya→sơ-ba-LIK-nya"],
        pronunciation_focus_en: ["sebaliknya→suh-ba-LIK-nya", "data→DAH-ta"],
      },
      {
        en: "I partly agree, but I'd like to add one thing.",
        vi: "Tôi đồng ý một phần, nhưng tôi muốn bổ sung một điều.",
        pronunciation_focus: ["sebagian→sơ-ba-GI-an", "menambahkan→mơ-nam-BAH-kan"],
        pronunciation_focus_en: ["sebagian→suh-ba-GEE-an", "menambahkan→muh-nam-BAH-kan"],
      },
      {
        en: "Let's find a middle ground that benefits both sides.",
        vi: "Hãy tìm một giải pháp dung hòa có lợi cho cả hai bên.",
        pronunciation_focus: ["jalan tengah→JA-lan TƠ-ngah", "menguntungkan→mơ-ngun-TUNG-kan"],
        pronunciation_focus_en: ["jalan tengah→JA-lan TUH-ngah", "menguntungkan→muh-ngoon-TOONG-kan"],
      },
    ],
    cultural_notes_vi:
      "Văn hóa Indonesia trọng sự hòa hợp ('rukun') và giữ thể diện. Người ta hiếm khi phản bác thẳng 'Anda salah' (Bạn sai) — nghe rất nặng và mất lịch sự. Thay vào đó: 'Saya kurang setuju' (Tôi không đồng ý lắm) hoặc 'Mungkin, tapi…'. 'Musyawarah' (bàn bạc để đồng thuận) là giá trị cốt lõi.",
    cultural_notes_en:
      "Indonesian culture prizes harmony ('rukun') and saving face. People rarely say a blunt 'Anda salah' (You're wrong) — it lands harshly and rudely. Instead: 'Saya kurang setuju' (I don't quite agree) or 'Mungkin, tapi…'. 'Musyawarah' (deliberation toward consensus) is a core value.",
    tip_advice_vi:
      "Công thức phản bác lịch sự: [thừa nhận] + 'tetapi/tapi' + [quan điểm]. VD: 'Saya mengerti, tapi…'. 'Kurang setuju' (lit. 'thiếu đồng ý') = cách nói 'không đồng ý' nhẹ nhàng, rất Indonesia. 'Sebaliknya' = ngược lại.",
    tip_advice_en:
      "Polite rebuttal formula: [acknowledge] + 'tetapi/tapi' (but) + [your view]. E.g. 'Saya mengerti, tapi…'. 'Kurang setuju' (lit. 'less agree') is the soft, very Indonesian way to disagree. 'Sebaliknya' = on the contrary.",
    vocabulary: [
      { word: "menurut saya", en: "in my opinion", vi: "theo tôi", pos: "expr.", pronunciation_vi: "mơ-NU-rut SA-ya", pronunciation_en: "muh-NOO-root SAH-ya" },
      { word: "berpendapat", en: "to hold an opinion", vi: "có ý kiến", pos: "v.", pronunciation_vi: "bơr-pơn-DA-pat", pronunciation_en: "bur-pun-DAH-pat" },
      { word: "setuju", en: "to agree", vi: "đồng ý", pos: "v.", pronunciation_vi: "sơ-TU-ju", pronunciation_en: "suh-TOO-joo" },
      { word: "kurang setuju", en: "to disagree (softly)", vi: "không đồng ý lắm", pos: "expr.", pronunciation_vi: "KU-rang sơ-TU-ju", pronunciation_en: "KOO-rang suh-TOO-joo" },
      { word: "sebaliknya", en: "on the contrary", vi: "ngược lại", pos: "adv.", pronunciation_vi: "sơ-ba-LIK-nya", pronunciation_en: "suh-ba-LIK-nya" },
      { word: "alasan", en: "reason/argument", vi: "lý do/lập luận", pos: "n.", pronunciation_vi: "a-LA-san", pronunciation_en: "a-LAH-san" },
      { word: "membantah", en: "to rebut/object", vi: "phản bác", pos: "v.", pronunciation_vi: "mơm-BAN-tah", pronunciation_en: "muhm-BAHN-tah" },
      { word: "meyakinkan", en: "to convince", vi: "thuyết phục", pos: "v.", pronunciation_vi: "mơ-ya-KIN-kan", pronunciation_en: "muh-ya-KEEN-kan" },
      { word: "jalan tengah", en: "middle ground/compromise", vi: "giải pháp dung hòa", pos: "n.", pronunciation_vi: "JA-lan TƠ-ngah", pronunciation_en: "JA-lan TUH-ngah" },
      { word: "musyawarah", en: "deliberation toward consensus", vi: "bàn bạc để đồng thuận", pos: "n.", pronunciation_vi: "mu-sya-WA-rah", pronunciation_en: "moo-sha-WA-rah" },
    ],
    dialogue: [
      {
        speaker: "Andi",
        text: "Menurut saya, kantor kita harus pindah ke pusat kota.",
        vi: "Theo tôi, văn phòng ta nên chuyển vào trung tâm thành phố.",
        en: "In my opinion, our office should move to the city center.",
      },
      {
        speaker: "Sari",
        text: "Saya mengerti maksud Anda, tetapi sebaliknya, sewanya jauh lebih mahal.",
        vi: "Tôi hiểu ý bạn, nhưng ngược lại, tiền thuê đắt hơn nhiều.",
        en: "I understand your point, but on the contrary, the rent is much more expensive.",
      },
      {
        speaker: "Andi",
        text: "Mungkin, tapi kita akan lebih dekat dengan klien.",
        vi: "Có thể, nhưng ta sẽ gần khách hàng hơn.",
        en: "Maybe, but we'd be closer to our clients.",
      },
      {
        speaker: "Sari",
        text: "Bagaimana kalau kita cari jalan tengah: kantor di pinggir pusat kota?",
        vi: "Hay là ta tìm giải pháp dung hòa: văn phòng ở rìa trung tâm?",
        en: "How about we find a middle ground: an office on the edge of downtown?",
      },
    ],
    roleplay_prompts: [
      "Tranh luận xem nên làm việc tại văn phòng hay tại nhà. Dùng 'menurut saya', 'kurang setuju', và đề xuất 'jalan tengah'.",
      "Một người bạn đưa ra ý tưởng bạn không tin. Hãy bất đồng lịch sự bằng 'Saya mengerti, tapi…' (tránh 'Anda salah').",
    ],
    roleplay_prompts_en: [
      "Debate whether to work from the office or from home. Use 'menurut saya', 'kurang setuju', and propose a 'jalan tengah'.",
      "A friend pitches an idea you doubt. Disagree politely with 'Saya mengerti, tapi…' (avoid 'Anda salah').",
    ],
    register_notes_vi:
      "Trang trọng: 'Saya kurang sependapat dengan Anda'. Thân mật (Jakarta): 'Gue sih kurang setuju ya', 'Nggak gitu juga kali'. Ở mức trang trọng dùng 'Anda/Bapak/Ibu'; bạn bè dùng 'lu/lo' (slang) hoặc 'kamu'.",
    register_notes_en:
      "Formal: 'Saya kurang sependapat dengan Anda' (I don't quite share your view). Casual (Jakarta): 'Gue sih kurang setuju ya', 'Nggak gitu juga kali' (It's not quite like that). Formal uses 'Anda/Bapak/Ibu'; friends use 'lu/lo' (slang) or 'kamu'.",
    idiom_glosses: [
      {
        idiom: "jalan tengah",
        literal: "đường ở giữa",
        literal_en: "the middle road",
        meaning: "giải pháp dung hòa, thỏa hiệp giữa hai bên",
        meaning_en: "a compromise / middle ground both sides can accept",
        example: "Daripada bertengkar, mari kita cari jalan tengah.",
        example_en: "Rather than argue, let's find a middle ground.",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "Saya mengerti maksud Anda, ___ saya kurang setuju.",
        answer: "tetapi",
        hint_vi: "liên từ 'nhưng' (dạng trang trọng của 'tapi')",
        hint_en: "the conjunction 'but' (formal form of 'tapi')",
      },
      {
        type: "matching",
        pairs: [
          ["sebaliknya", "ngược lại"],
          ["kurang setuju", "không đồng ý lắm"],
          ["jalan tengah", "giải pháp dung hòa"],
        ],
        instruction: "Nối cụm từ với nghĩa tiếng Việt",
        instruction_en: "Match each phrase with its Vietnamese meaning.",
      },
      {
        type: "translation",
        vietnamese: "Theo tôi, chính sách này sẽ gây hại cho doanh nghiệp nhỏ.",
        indonesian: "Menurut saya, kebijakan ini akan merugikan usaha kecil.",
        english: "In my opinion, this policy will harm small businesses.",
        hint_vi: "'menurut saya' = theo tôi; 'merugikan' = gây hại",
        hint_en: "'menurut saya' = in my opinion; 'merugikan' = to harm",
      },
    ],
  },

  // ── 5. Business Indonesian ────────────────────────────────────────────────
  {
    id: "indonesian_business_negotiation",
    level: "B2",
    category: "business",
    title_vi: "Tiếng Indonesia thương mại và đàm phán",
    title_en: "Business Indonesian and negotiation",
    sentences: [
      {
        en: "We'd like to propose a long-term partnership with your company.",
        vi: "Chúng tôi muốn đề xuất hợp tác lâu dài với công ty của bạn.",
        pronunciation_focus: ["kerja sama→KƠR-ja SA-ma", "perusahaan→pơ-ru-sa-HA-an"],
        pronunciation_focus_en: ["kerja sama→KUR-ja SAH-ma", "perusahaan→puh-roo-sa-HA-an"],
      },
      {
        en: "Could we discuss the price and the payment terms?",
        vi: "Chúng ta có thể bàn về giá và điều khoản thanh toán không?",
        pronunciation_focus: ["harga→HAR-ga", "pembayaran→pơm-ba-YA-ran"],
        pronunciation_focus_en: ["harga→HAR-ga", "pembayaran→puhm-ba-YA-ran"],
      },
      {
        en: "This offer is valid until the end of the month.",
        vi: "Lời chào hàng này có hiệu lực đến cuối tháng.",
        pronunciation_focus: ["penawaran→pơ-na-WA-ran", "berlaku→bơr-LA-ku"],
        pronunciation_focus_en: ["penawaran→puh-na-WA-ran", "berlaku→bur-LAH-koo"],
      },
      {
        en: "If you increase the volume, we can give a bigger discount.",
        vi: "Nếu bạn tăng số lượng, chúng tôi có thể giảm giá nhiều hơn.",
        pronunciation_focus: ["jumlah→JUM-lah", "diskon→DIS-kôn"],
        pronunciation_focus_en: ["jumlah→JOOM-lah", "diskon→DIS-kon"],
      },
      {
        en: "Once we agree, the contract will be signed next week.",
        vi: "Khi đôi bên thống nhất, hợp đồng sẽ được ký vào tuần sau.",
        pronunciation_focus: ["sepakat→sơ-PA-kat", "kontrak ditandatangani→KÔN-trak di-tan-da-ta-NGA-ni"],
        pronunciation_focus_en: ["sepakat→suh-PA-kat", "ditandatangani→dee-tan-da-ta-NGA-nee"],
      },
    ],
    cultural_notes_vi:
      "Kinh doanh ở Indonesia rất coi trọng quan hệ ('relasi') và sự tin tưởng trước khi bàn hợp đồng — đừng vào thẳng việc. Mặc cả ('tawar-menawar') là bình thường ngay cả trong B2B. Danh thiếp trao bằng hai tay. Xưng hô lịch sự: 'Bapak' (ông), 'Ibu' (bà) + tên.",
    cultural_notes_en:
      "Business in Indonesia values relationships ('relasi') and trust before contracts — don't dive straight into business. Bargaining ('tawar-menawar') is normal even in B2B. Exchange business cards with both hands. Address people politely: 'Bapak' (Mr.), 'Ibu' (Ms./Mrs.) + name.",
    tip_advice_vi:
      "Đề xuất: 'Kami ingin mengajukan…' (Chúng tôi muốn đề xuất…). Đàm phán có điều kiện rất hợp với 'kalau': 'Kalau jumlahnya naik, diskonnya juga naik'. 'Sepakat' = đã thống nhất (chốt deal). Hợp đồng dùng đầy bị động 'di-': 'ditandatangani' (được ký).",
    tip_advice_en:
      "Propose: 'Kami ingin mengajukan…' (We'd like to put forward…). Conditional bargaining pairs naturally with 'kalau': 'Kalau jumlahnya naik, diskonnya juga naik' (If the quantity goes up, so does the discount). 'Sepakat' = agreed (deal closed). Contracts are full of di- passives: 'ditandatangani' (be signed).",
    vocabulary: [
      { word: "perusahaan", en: "company", vi: "công ty", pos: "n.", pronunciation_vi: "pơ-ru-sa-HA-an", pronunciation_en: "puh-roo-sa-HA-an" },
      { word: "kerja sama", en: "cooperation/partnership", vi: "hợp tác", pos: "n.", pronunciation_vi: "KƠR-ja SA-ma", pronunciation_en: "KUR-ja SAH-ma" },
      { word: "penawaran", en: "offer/quotation", vi: "lời chào hàng/báo giá", pos: "n.", pronunciation_vi: "pơ-na-WA-ran", pronunciation_en: "puh-na-WA-ran" },
      { word: "tawar-menawar", en: "bargaining", vi: "mặc cả", pos: "n.", pronunciation_vi: "TA-war mơ-NA-war", pronunciation_en: "TA-war muh-NA-war" },
      { word: "harga", en: "price", vi: "giá", pos: "n.", pronunciation_vi: "HAR-ga", pronunciation_en: "HAR-ga" },
      { word: "diskon / potongan harga", en: "discount", vi: "giảm giá", pos: "n.", pronunciation_vi: "DIS-kôn", pronunciation_en: "DIS-kon" },
      { word: "pembayaran", en: "payment", vi: "thanh toán", pos: "n.", pronunciation_vi: "pơm-ba-YA-ran", pronunciation_en: "puhm-ba-YA-ran" },
      { word: "kontrak", en: "contract", vi: "hợp đồng", pos: "n.", pronunciation_vi: "KÔN-trak", pronunciation_en: "KON-trak" },
      { word: "sepakat", en: "to agree (settle a deal)", vi: "thống nhất/chốt", pos: "v.", pronunciation_vi: "sơ-PA-kat", pronunciation_en: "suh-PA-kat" },
      { word: "mengajukan", en: "to propose/submit", vi: "đề xuất/đệ trình", pos: "v.", pronunciation_vi: "mơ-nga-JU-kan", pronunciation_en: "muh-nga-JOO-kan" },
    ],
    dialogue: [
      {
        speaker: "Klien",
        text: "Terima kasih sudah datang, Pak. Bagaimana penawaran dari pihak Anda?",
        vi: "Cảm ơn anh đã đến. Bên anh chào giá thế nào?",
        en: "Thank you for coming, sir. What's your offer?",
      },
      {
        speaker: "Penjual",
        text: "Kami ingin mengajukan kerja sama setahun. Kalau jumlahnya besar, harganya bisa kami turunkan.",
        vi: "Chúng tôi muốn đề xuất hợp tác một năm. Nếu số lượng lớn, chúng tôi có thể giảm giá.",
        en: "We'd like to propose a one-year partnership. If the quantity is large, we can lower the price.",
      },
      {
        speaker: "Klien",
        text: "Menarik. Tapi tolong potongan harganya ditambah sedikit lagi.",
        vi: "Hấp dẫn đấy. Nhưng làm ơn giảm giá thêm một chút.",
        en: "Interesting. But please add a bit more to the discount.",
      },
      {
        speaker: "Penjual",
        text: "Baik. Kalau begitu, kita sepakat dan kontraknya ditandatangani minggu depan.",
        vi: "Được. Vậy thì ta thống nhất và hợp đồng sẽ được ký tuần sau.",
        en: "Alright. In that case, we agree and the contract will be signed next week.",
      },
    ],
    roleplay_prompts: [
      "Bạn đàm phán giá cho 100 sản phẩm. Dùng 'kalau jumlahnya naik…' và 'tawar-menawar' để chốt 'sepakat'.",
      "Mở đầu một cuộc gặp đối tác: chào hỏi bằng 'Bapak/Ibu', xã giao một chút rồi mới 'mengajukan' đề xuất.",
    ],
    roleplay_prompts_en: [
      "Negotiate a price for 100 units. Use 'kalau jumlahnya naik…' and 'tawar-menawar' to reach 'sepakat'.",
      "Open a partner meeting: greet with 'Bapak/Ibu', make small talk, then 'mengajukan' your proposal.",
    ],
    register_notes_vi:
      "Email/họp công việc rất trang trọng và đầy bị động: 'Mohon dokumen dikirimkan' (Xin gửi tài liệu). Chat nội bộ thân mật hơn nhiều: 'Tolong dong filenya', 'Oke siap'. 'Mohon' (trang trọng) ⟷ 'tolong' (bình thường) ⟷ 'tolong dong' (nài nỉ, thân).",
    register_notes_en:
      "Work emails/meetings are formal and passive-heavy: 'Mohon dokumen dikirimkan' (Kindly have the document sent). Internal chat is far more casual: 'Tolong dong filenya', 'Oke siap' (OK, ready). 'Mohon' (formal) ⟷ 'tolong' (neutral) ⟷ 'tolong dong' (pleading, friendly).",
    exercises: [
      {
        type: "fill-blank",
        question: "Kami ingin ___ kerja sama jangka panjang.",
        answer: "mengajukan",
        hint_vi: "'đề xuất/đệ trình'",
        hint_en: "'to propose/submit'",
      },
      {
        type: "matching",
        pairs: [
          ["penawaran", "lời chào hàng"],
          ["sepakat", "thống nhất"],
          ["kontrak", "hợp đồng"],
        ],
        instruction: "Nối từ thương mại với nghĩa tiếng Việt",
        instruction_en: "Match each business word with its Vietnamese meaning.",
      },
      {
        type: "translation",
        vietnamese: "Khi đôi bên thống nhất, hợp đồng sẽ được ký tuần sau.",
        indonesian: "Setelah sepakat, kontraknya akan ditandatangani minggu depan.",
        english: "Once both sides agree, the contract will be signed next week.",
        hint_vi: "'setelah' = sau khi; bị động 'ditandatangani'",
        hint_en: "'setelah' = after; passive 'ditandatangani'",
      },
    ],
  },

  // ── 6. Formal writing ─────────────────────────────────────────────────────
  {
    id: "indonesian_formal_writing_letters",
    level: "B2",
    category: "formal_writing",
    title_vi: "Văn viết trang trọng (thư và email)",
    title_en: "Formal writing (letters and emails)",
    sentences: [
      {
        en: "With respect, I am writing to apply for the marketing position.",
        vi: "Kính thưa, tôi viết thư để ứng tuyển vị trí marketing.",
        pronunciation_focus: ["dengan hormat→DƠ-ngan HOR-mat", "melamar→mơ-LA-mar"],
        pronunciation_focus_en: ["dengan hormat→DUH-ngan HOR-mat", "melamar→muh-LA-mar"],
      },
      {
        en: "Attached, I enclose my CV and supporting documents.",
        vi: "Đính kèm, tôi gửi kèm sơ yếu lý lịch và các giấy tờ liên quan.",
        pronunciation_focus: ["terlampir→tơr-LAM-pir", "dokumen→dô-KU-men"],
        pronunciation_focus_en: ["terlampir→tur-LAHM-pir", "dokumen→doh-KOO-men"],
      },
      {
        en: "We would be grateful for your prompt attention to this matter.",
        vi: "Chúng tôi rất biết ơn nếu quý vị quan tâm kịp thời đến vấn đề này.",
        pronunciation_focus: ["perhatian→pơr-ha-TI-an", "secepatnya→sơ-chơ-PAT-nya"],
        pronunciation_focus_en: ["perhatian→pur-ha-TEE-an", "secepatnya→suh-chuh-PAT-nya"],
      },
      {
        en: "Should you need further information, please do not hesitate to contact me.",
        vi: "Nếu quý vị cần thêm thông tin, xin đừng ngần ngại liên hệ với tôi.",
        pronunciation_focus: ["informasi→in-for-MA-si", "menghubungi→mơng-hu-BU-ngi"],
        pronunciation_focus_en: ["informasi→in-for-MAH-see", "menghubungi→muhng-hoo-BOO-ngee"],
      },
      {
        en: "Thus this letter; thank you for your attention and cooperation.",
        vi: "Trên đây là nội dung thư; cảm ơn sự quan tâm và hợp tác của quý vị.",
        pronunciation_focus: ["demikian→dơ-mi-KI-an", "kerja samanya→KƠR-ja SA-ma-nya"],
        pronunciation_focus_en: ["demikian→duh-mee-KEE-an", "kerja samanya→KUR-ja SAH-ma-nya"],
      },
    ],
    cultural_notes_vi:
      "Thư trang trọng Indonesia có cấu trúc cố định: mở bằng 'Dengan hormat,' (Kính thưa,) và kết bằng 'Hormat saya,' (Kính thư,) + tên. Câu chốt gần như bắt buộc: 'Demikian surat ini, atas perhatiannya kami ucapkan terima kasih.' Ngôn ngữ hành chính rất nhiều bị động và từ gốc Sanskrit/Ả Rập.",
    cultural_notes_en:
      "Indonesian formal letters follow a fixed frame: open with 'Dengan hormat,' (Respectfully,) and close with 'Hormat saya,' (Respectfully yours,) + name. The near-mandatory sign-off: 'Demikian surat ini, atas perhatiannya kami ucapkan terima kasih.' (Thus this letter; thank you for your attention.) Bureaucratic language is heavy with passives and Sanskrit/Arabic loanwords.",
    tip_advice_vi:
      "Văn trang trọng KHÔNG dùng từ tắt: viết 'tidak', 'dengan', 'yang' đầy đủ (không 'gak', 'dgn', 'yg'). Dùng 'Bapak/Ibu' và 'Anda', không 'kamu'. Cụm cố định: 'terlampir' (đính kèm), 'mohon' (kính mong), 'sehubungan dengan' (liên quan đến).",
    tip_advice_en:
      "Formal writing uses NO abbreviations: spell out 'tidak', 'dengan', 'yang' (not 'gak', 'dgn', 'yg'). Use 'Bapak/Ibu' and 'Anda', never 'kamu'. Set phrases: 'terlampir' (enclosed), 'mohon' (kindly request), 'sehubungan dengan' (with regard to).",
    vocabulary: [
      { word: "dengan hormat", en: "respectfully (salutation)", vi: "kính thưa", pos: "expr.", pronunciation_vi: "DƠ-ngan HOR-mat", pronunciation_en: "DUH-ngan HOR-mat" },
      { word: "melamar", en: "to apply (for a job)", vi: "ứng tuyển", pos: "v.", pronunciation_vi: "mơ-LA-mar", pronunciation_en: "muh-LA-mar" },
      { word: "terlampir", en: "enclosed/attached", vi: "đính kèm", pos: "adj.", pronunciation_vi: "tơr-LAM-pir", pronunciation_en: "tur-LAHM-pir" },
      { word: "mohon", en: "kindly request (formal)", vi: "kính mong", pos: "v.", pronunciation_vi: "MÔ-hôn", pronunciation_en: "MOH-hon" },
      { word: "sehubungan dengan", en: "with regard to", vi: "liên quan đến", pos: "conj.", pronunciation_vi: "sơ-hu-BU-ngan DƠ-ngan", pronunciation_en: "suh-hoo-BOO-ngan DUH-ngan" },
      { word: "perhatian", en: "attention", vi: "sự quan tâm", pos: "n.", pronunciation_vi: "pơr-ha-TI-an", pronunciation_en: "pur-ha-TEE-an" },
      { word: "menghubungi", en: "to contact", vi: "liên hệ", pos: "v.", pronunciation_vi: "mơng-hu-BU-ngi", pronunciation_en: "muhng-hoo-BOO-ngee" },
      { word: "demikian", en: "thus/so (sign-off)", vi: "như vậy/trên đây", pos: "adv.", pronunciation_vi: "dơ-mi-KI-an", pronunciation_en: "duh-mee-KEE-an" },
      { word: "hormat saya", en: "respectfully yours", vi: "kính thư", pos: "expr.", pronunciation_vi: "HOR-mat SA-ya", pronunciation_en: "HOR-mat SAH-ya" },
      { word: "lampiran", en: "attachment/enclosure", vi: "phụ lục/tệp đính kèm", pos: "n.", pronunciation_vi: "lam-PI-ran", pronunciation_en: "lahm-PEE-ran" },
    ],
    dialogue: [
      {
        speaker: "HRD",
        text: "Surat lamaran Anda sudah kami terima. Boleh dijelaskan pengalaman Anda?",
        vi: "Chúng tôi đã nhận đơn ứng tuyển của bạn. Bạn có thể nói rõ kinh nghiệm không?",
        en: "We have received your application letter. Could you explain your experience?",
      },
      {
        speaker: "Pelamar",
        text: "Tentu. Sehubungan dengan posisi ini, saya melampirkan portofolio dalam dokumen terlampir.",
        vi: "Tất nhiên. Liên quan đến vị trí này, tôi đính kèm hồ sơ năng lực trong tệp đính kèm.",
        en: "Of course. With regard to this position, I've enclosed my portfolio in the attached document.",
      },
      {
        speaker: "HRD",
        text: "Baik. Mohon Anda menunggu kabar dari kami dalam satu minggu.",
        vi: "Tốt. Kính mong bạn chờ tin từ chúng tôi trong một tuần.",
        en: "Good. Please await news from us within a week.",
      },
      {
        speaker: "Pelamar",
        text: "Terima kasih atas perhatiannya. Saya tunggu kabar baiknya.",
        vi: "Cảm ơn sự quan tâm. Tôi chờ tin tốt lành.",
        en: "Thank you for your attention. I'll wait for the good news.",
      },
    ],
    roleplay_prompts: [
      "Viết 3 câu mở đầu một email xin việc trang trọng: 'Dengan hormat,' + 'melamar' + 'terlampir'.",
      "Viết câu chốt một lá thư công việc dùng 'Demikian… atas perhatiannya…' và 'Hormat saya,'.",
    ],
    roleplay_prompts_en: [
      "Write the first 3 lines of a formal job-application email: 'Dengan hormat,' + 'melamar' + 'terlampir'.",
      "Write the closing of a business letter using 'Demikian… atas perhatiannya…' and 'Hormat saya,'.",
    ],
    register_notes_vi:
      "Khoảng cách giữa formal và slang ở đây LỚN nhất. Thư: 'Mohon informasinya dapat segera dikirimkan.' Chat bạn bè: 'Eh, infonya buruan dong.' Cùng một ý, hai thế giới. Viết sai register (dùng 'gue/lu' trong thư) là lỗi nặng.",
    register_notes_en:
      "The formal–slang gap is widest here. Letter: 'Mohon informasinya dapat segera dikirimkan.' (Kindly have the info sent promptly.) Friend chat: 'Eh, infonya buruan dong.' (Hey, hurry up with the info.) Same idea, two worlds. Mixing register (using 'gue/lu' in a letter) is a serious blunder.",
    exercises: [
      {
        type: "fill-blank",
        question: "___ hormat, saya menulis untuk melamar posisi ini.",
        answer: "Dengan",
        hint_vi: "'Dengan hormat' = kính thưa (mở thư)",
        hint_en: "'Dengan hormat' = Respectfully (letter opener)",
      },
      {
        type: "matching",
        pairs: [
          ["terlampir", "đính kèm"],
          ["mohon", "kính mong"],
          ["hormat saya", "kính thư"],
        ],
        instruction: "Nối cụm từ thư từ với nghĩa tiếng Việt",
        instruction_en: "Match each letter phrase with its Vietnamese meaning.",
      },
      {
        type: "translation",
        vietnamese: "Nếu quý vị cần thêm thông tin, xin đừng ngần ngại liên hệ với tôi.",
        indonesian: "Apabila Anda membutuhkan informasi lebih lanjut, mohon jangan ragu untuk menghubungi saya.",
        english: "Should you need further information, please do not hesitate to contact me.",
        hint_vi: "'apabila' = nếu (trang trọng); 'mohon' + 'menghubungi'",
        hint_en: "'apabila' = if (formal); 'mohon' + 'menghubungi'",
      },
    ],
  },

  // ── 7. Complex (multi-clause) sentences ───────────────────────────────────
  {
    id: "indonesian_complex_sentences_conjunctions",
    level: "B2",
    category: "grammar",
    title_vi: "Câu phức và liên từ nối",
    title_en: "Complex sentences and connectors",
    sentences: [
      {
        en: "Although the weather was bad, the event still went ahead.",
        vi: "Mặc dù thời tiết xấu, sự kiện vẫn diễn ra.",
        pronunciation_focus: ["meskipun→mơs-KI-pun", "tetap→TƠ-tap"],
        pronunciation_focus_en: ["meskipun→mus-KEE-poon", "tetap→TUH-tap"],
      },
      {
        en: "He worked hard so that his family could live more comfortably.",
        vi: "Anh ấy làm việc chăm chỉ để gia đình được sống thoải mái hơn.",
        pronunciation_focus: ["supaya→su-PA-ya", "nyaman→NYA-man"],
        pronunciation_focus_en: ["supaya→soo-PA-ya", "nyaman→NYA-man"],
      },
      {
        en: "Prices keep rising, whereas salaries stay the same.",
        vi: "Giá cả cứ tăng, trong khi lương vẫn giữ nguyên.",
        pronunciation_focus: ["sedangkan→sơ-DANG-kan", "gaji→GA-ji"],
        pronunciation_focus_en: ["sedangkan→suh-DAHNG-kan", "gaji→GA-jee"],
      },
      {
        en: "The bridge collapsed because it had not been maintained for years.",
        vi: "Cây cầu sập vì nó đã không được bảo trì nhiều năm.",
        pronunciation_focus: ["runtuh→RUN-tuh", "dirawat→di-RA-wat"],
        pronunciation_focus_en: ["runtuh→ROON-tooh", "dirawat→dee-RA-wat"],
      },
      {
        en: "Not only is he smart, but he is also very diligent.",
        vi: "Anh ấy không những thông minh mà còn rất siêng năng.",
        pronunciation_focus: ["tidak hanya→TI-dak HA-nya", "tetapi juga→tơ-TA-pi JU-ga"],
        pronunciation_focus_en: ["tidak hanya→TEE-dak HA-nya", "tetapi juga→tuh-TA-pee JOO-ga"],
      },
    ],
    cultural_notes_vi:
      "Văn viết B2 (báo, luận, công sở) dày đặc câu phức nối bằng liên từ. Người Việt có lợi thế lớn: cấu trúc 'meskipun… tetap…' (mặc dù… vẫn…) hay 'tidak hanya… tetapi juga…' (không những… mà còn…) ánh xạ gần như 1-1 với tiếng Việt.",
    cultural_notes_en:
      "B2 writing (news, essays, the office) is dense with complex sentences joined by connectors. Vietnamese speakers have a big edge: 'meskipun… tetap…' (although… still…) and 'tidak hanya… tetapi juga…' (not only… but also…) map almost 1-to-1 onto Vietnamese.",
    tip_advice_vi:
      "Nhóm liên từ theo nghĩa: nhượng bộ → 'meskipun/walaupun' (mặc dù); mục đích → 'supaya/agar' (để); đối lập → 'sedangkan/sementara' (trong khi); nguyên nhân → 'karena' (vì); kết quả → 'sehingga' (đến nỗi/nên). Nhớ theo cặp tiếng Việt để học nhanh.",
    tip_advice_en:
      "Group connectors by meaning: concession → 'meskipun/walaupun' (although); purpose → 'supaya/agar' (so that); contrast → 'sedangkan/sementara' (whereas); cause → 'karena' (because); result → 'sehingga' (so that/such that). Anchor each to its Vietnamese pair to learn fast.",
    grammar_focus_vi:
      "Câu phức = mệnh đề chính + liên từ + mệnh đề phụ. Liên từ có thể đứng đầu câu (đảo): 'Meskipun hujan, kami tetap pergi' = 'Kami tetap pergi meskipun hujan'. Cặp tương quan: 'tidak hanya… tetapi juga…', 'baik… maupun…' (cả… lẫn…).",
    grammar_focus_en:
      "Complex sentence = main clause + connector + subordinate clause. The connector can front the sentence (inversion): 'Meskipun hujan, kami tetap pergi' = 'Kami tetap pergi meskipun hujan'. Correlative pairs: 'tidak hanya… tetapi juga…', 'baik… maupun…' (both… and…).",
    vocabulary: [
      { word: "meskipun / walaupun", en: "although/even though", vi: "mặc dù", pos: "conj.", pronunciation_vi: "mơs-KI-pun", pronunciation_en: "mus-KEE-poon" },
      { word: "supaya / agar", en: "so that (purpose)", vi: "để", pos: "conj.", pronunciation_vi: "su-PA-ya", pronunciation_en: "soo-PA-ya" },
      { word: "sedangkan", en: "whereas", vi: "trong khi", pos: "conj.", pronunciation_vi: "sơ-DANG-kan", pronunciation_en: "suh-DAHNG-kan" },
      { word: "sehingga", en: "so that / such that (result)", vi: "nên/đến nỗi", pos: "conj.", pronunciation_vi: "sơ-HING-ga", pronunciation_en: "suh-HING-ga" },
      { word: "karena", en: "because", vi: "vì/bởi vì", pos: "conj.", pronunciation_vi: "KA-rơ-na", pronunciation_en: "KA-ruh-na" },
      { word: "oleh karena itu", en: "therefore", vi: "vì vậy", pos: "conj.", pronunciation_vi: "Ô-lê KA-rơ-na I-tu", pronunciation_en: "OH-lay KA-ruh-na EE-too" },
      { word: "namun", en: "however (formal)", vi: "tuy nhiên", pos: "conj.", pronunciation_vi: "NA-mun", pronunciation_en: "NA-moon" },
      { word: "tidak hanya… tetapi juga…", en: "not only… but also…", vi: "không những… mà còn…", pos: "corr.", pronunciation_vi: "TI-dak HA-nya… tơ-TA-pi JU-ga", pronunciation_en: "TEE-dak HA-nya… tuh-TA-pee JOO-ga" },
      { word: "baik… maupun…", en: "both… and…", vi: "cả… lẫn…", pos: "corr.", pronunciation_vi: "BA-ik… ma-U-pun", pronunciation_en: "BA-ik… ma-OO-poon" },
      { word: "selama", en: "as long as / while", vi: "trong suốt/miễn là", pos: "conj.", pronunciation_vi: "sơ-LA-ma", pronunciation_en: "suh-LAH-ma" },
    ],
    dialogue: [
      {
        speaker: "Guru",
        text: "Meskipun ujiannya sulit, kamu berhasil lulus. Bagaimana caranya?",
        vi: "Mặc dù bài thi khó, em vẫn đỗ. Em làm thế nào vậy?",
        en: "Although the exam was hard, you managed to pass. How did you do it?",
      },
      {
        speaker: "Murid",
        text: "Saya belajar tiap malam supaya bisa memahami semua materi.",
        vi: "Em học mỗi tối để có thể hiểu hết bài.",
        en: "I studied every night so that I could understand all the material.",
      },
      {
        speaker: "Guru",
        text: "Bagus. Tidak hanya rajin, tetapi kamu juga pandai mengatur waktu.",
        vi: "Tốt. Không những siêng năng mà em còn giỏi quản lý thời gian.",
        en: "Excellent. Not only are you diligent, but you also manage your time well.",
      },
      {
        speaker: "Murid",
        text: "Terima kasih, Bu. Soalnya susah, sehingga saya harus benar-benar fokus.",
        vi: "Cảm ơn cô. Đề khó, nên em phải thật sự tập trung.",
        en: "Thank you, ma'am. The questions were hard, so I had to truly focus.",
      },
    ],
    roleplay_prompts: [
      "Giải thích vì sao bạn nghỉ việc, dùng 3 liên từ: 'karena', 'sedangkan', và 'oleh karena itu'.",
      "Khen ai đó bằng cặp tương quan 'tidak hanya… tetapi juga…' và 'baik… maupun…'.",
    ],
    roleplay_prompts_en: [
      "Explain why you quit a job using 3 connectors: 'karena', 'sedangkan', and 'oleh karena itu'.",
      "Praise someone using the correlative pairs 'tidak hanya… tetapi juga…' and 'baik… maupun…'.",
    ],
    register_notes_vi:
      "'Namun' và 'oleh karena itu' là văn viết trang trọng; nói chuyện đời thường dùng 'tapi' và 'jadi' (vì vậy/nên). 'Meskipun' (trang trọng) ⟷ 'walaupun' (trung tính) ⟷ 'walau' (rút gọn, thân mật).",
    register_notes_en:
      "'Namun' and 'oleh karena itu' are formal writing; casual speech uses 'tapi' and 'jadi' (so). 'Meskipun' (formal) ⟷ 'walaupun' (neutral) ⟷ 'walau' (shortened, casual).",
    exercises: [
      {
        type: "fill-blank",
        question: "___ cuacanya buruk, acaranya tetap berlangsung.",
        answer: "Meskipun",
        hint_vi: "liên từ nhượng bộ 'mặc dù'",
        hint_en: "concession connector 'although'",
      },
      {
        type: "matching",
        pairs: [
          ["supaya", "để"],
          ["sedangkan", "trong khi"],
          ["sehingga", "nên/đến nỗi"],
        ],
        instruction: "Nối liên từ với nghĩa tiếng Việt",
        instruction_en: "Match each connector with its Vietnamese meaning.",
      },
      {
        type: "translation",
        vietnamese: "Anh ấy không những thông minh mà còn rất siêng năng.",
        indonesian: "Dia tidak hanya pintar, tetapi juga sangat rajin.",
        english: "He is not only smart, but also very diligent.",
        hint_vi: "cặp tương quan 'tidak hanya… tetapi juga…'",
        hint_en: "correlative pair 'tidak hanya… tetapi juga…'",
      },
    ],
  },
];

export default lessons;
