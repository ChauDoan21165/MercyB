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
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  // English-speaker pronunciation hint with stressed syllable in CAPS.
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  cell_id?: string;
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
      { cell_id: "81afd419-01aa-4bbc-ab41-095d5a943279", word: "berita", en: "news", vi: "tin tức", pos: "n.", pronunciation_vi: "bơ-RI-ta", pronunciation_en: "buh-REE-ta" },
      { cell_id: "70952c8d-c37f-447d-b819-394e01e6e80f", word: "wartawan", en: "journalist/reporter", vi: "nhà báo/phóng viên", pos: "n.", pronunciation_vi: "war-ta-WAN", pronunciation_en: "war-ta-WAN" },
      { cell_id: "4bccd895-e345-4fd1-954c-8910297de439", word: "media massa", en: "mass media", vi: "truyền thông đại chúng", pos: "n.", pronunciation_vi: "ME-di-a MAS-sa", pronunciation_en: "MEH-dee-a MAH-sa" },
      { cell_id: "a2d4331e-c9bd-48c6-8f12-f6b09eec1d26", word: "surat kabar / koran", en: "newspaper", vi: "báo (giấy)", pos: "n.", pronunciation_vi: "SU-rat KA-bar / KO-ran", pronunciation_en: "SOO-rat KA-bar / KO-ran" },
      { cell_id: "8466e3b2-64ab-4197-b845-8bf4841dfd31", word: "siaran", en: "broadcast", vi: "buổi phát sóng", pos: "n.", pronunciation_vi: "si-A-ran", pronunciation_en: "see-AH-ran" },
      { cell_id: "b6519ac1-0fd8-4732-9c62-8b6ed44f97b0", word: "menerbitkan", en: "to publish", vi: "xuất bản/đăng", pos: "v.", pronunciation_vi: "mơ-nơr-BIT-kan", pronunciation_en: "muh-nur-BIT-kan" },
      { cell_id: "c24bc0bc-9f7e-4aa0-b83c-0765ff6ff685", word: "berita bohong / hoaks", en: "fake news/hoax", vi: "tin giả", pos: "n.", pronunciation_vi: "bơ-RI-ta bô-HÔNG", pronunciation_en: "buh-REE-ta boh-HONG" },
      { cell_id: "968a425a-70d1-495c-803c-938214c3593d", word: "narasumber", en: "source/interviewee", vi: "nguồn tin", pos: "n.", pronunciation_vi: "na-ra-SUM-bơr", pronunciation_en: "na-ra-SOOM-bur" },
      { cell_id: "65f72492-5207-496b-a35e-4f6e3a724e42", word: "tajuk / judul", en: "headline/title", vi: "tiêu đề", pos: "n.", pronunciation_vi: "TA-juk / JU-dul", pronunciation_en: "TA-jook / JOO-dool" },
      { cell_id: "514b2eb1-b65d-4c67-84e9-5e2644bc3f3a", word: "langsung", en: "live/direct", vi: "trực tiếp", pos: "adv.", pronunciation_vi: "LANG-sung", pronunciation_en: "LAHNG-soong" },
    ],
    dialogue: [
      {
        cell_id: "9e55af61-5f1a-4914-9b8a-8da5b5c05b8c",
        speaker: "A",
        text: "Kamu sudah baca berita tentang banjir di Jakarta?",
        vi: "Bạn đã đọc tin về lũ lụt ở Jakarta chưa?",
        en: "Have you read the news about the flooding in Jakarta?",
      },
      {
        cell_id: "73c802e9-343e-40cb-89ab-6a1ea215b2ef",
        speaker: "B",
        text: "Sudah, tapi judulnya berlebihan. Sepertinya itu hoaks.",
        vi: "Rồi, nhưng tiêu đề phóng đại. Có vẻ đó là tin giả.",
        en: "Yes, but the headline is exaggerated. It seems like a hoax.",
      },
      {
        cell_id: "85616bca-5f18-4e2e-97f1-2c3192535f7a",
        speaker: "A",
        text: "Menurut Kompas, datanya resmi dari pemerintah, kok.",
        vi: "Theo Kompas, dữ liệu là chính thức từ chính phủ mà.",
        en: "According to Kompas, the data is official, from the government.",
      },
      {
        cell_id: "e630dc54-502c-4927-9c56-6ac7d959947a",
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
      { cell_id: "df6b1db9-c37d-4e1f-9c55-815c3b9ed6a7", word: "dikirim", en: "(is/was) sent", vi: "được gửi", pos: "v. (pass.)", pronunciation_vi: "di-KI-rim", pronunciation_en: "dee-KEE-rim" },
      { cell_id: "b35a5720-d969-4e17-9f79-ffaa4fe9f18d", word: "dibaca", en: "(is/was) read", vi: "được đọc", pos: "v. (pass.)", pronunciation_vi: "di-BA-cha", pronunciation_en: "dee-BAH-cha" },
      { cell_id: "c0730a9f-e994-4598-b2f2-9d565ab8f72a", word: "diselesaikan", en: "(is/was) resolved", vi: "được giải quyết", pos: "v. (pass.)", pronunciation_vi: "di-sơ-lơ-SAI-kan", pronunciation_en: "dee-suh-luh-SIGH-kan" },
      { cell_id: "0d7bf4e9-c606-4631-8def-61fccbe45767", word: "diundang", en: "(is/was) invited", vi: "được mời", pos: "v. (pass.)", pronunciation_vi: "di-UN-dang", pronunciation_en: "dee-OON-dang" },
      { cell_id: "720bdf30-3f5e-4b00-9741-28c4c49e2077", word: "diambil", en: "(is/was) taken", vi: "được lấy/đưa ra", pos: "v. (pass.)", pronunciation_vi: "di-AM-bil", pronunciation_en: "dee-AHM-bil" },
      { cell_id: "d57e6f54-219b-4ba8-a91f-a9e8470e3cec", word: "oleh", en: "by (agent marker)", vi: "bởi", pos: "prep.", pronunciation_vi: "Ô-lê", pronunciation_en: "OH-lay" },
      { cell_id: "47a28cb8-64c1-423a-9083-bcc1682cd150", word: "ditulis", en: "(is/was) written", vi: "được viết", pos: "v. (pass.)", pronunciation_vi: "di-TU-lis", pronunciation_en: "dee-TOO-lis" },
      { cell_id: "130c4621-37e0-4529-b5d7-a65cc0a982ef", word: "dilakukan", en: "(is/was) done/carried out", vi: "được thực hiện", pos: "v. (pass.)", pronunciation_vi: "di-la-KU-kan", pronunciation_en: "dee-la-KOO-kan" },
      { cell_id: "d9ca8d2b-a4aa-41a1-87c8-c59fc275283c", word: "diputuskan", en: "(is/was) decided", vi: "được quyết định", pos: "v. (pass.)", pronunciation_vi: "di-pu-TUS-kan", pronunciation_en: "dee-poo-TOOS-kan" },
      { cell_id: "2121323c-4a4b-4c79-bb9b-3febc5f0b779", word: "disetujui", en: "(is/was) approved", vi: "được phê duyệt", pos: "v. (pass.)", pronunciation_vi: "di-sơ-tu-JU-i", pronunciation_en: "dee-suh-too-JOO-ee" },
    ],
    dialogue: [
      {
        cell_id: "9e95a78c-832d-48de-bafa-6c7f9655de58",
        speaker: "Atasan",
        text: "Apakah laporan keuangan sudah diselesaikan?",
        vi: "Báo cáo tài chính đã được hoàn thành chưa?",
        en: "Has the financial report been completed?",
      },
      {
        cell_id: "0821656f-c3a0-4baa-be99-eea064ed540d",
        speaker: "Staf",
        text: "Sudah, Pak. Laporannya saya kirim tadi pagi lewat email.",
        vi: "Rồi ạ. Báo cáo tôi đã gửi sáng nay qua email.",
        en: "Yes, sir. The report, I sent it this morning by email.",
      },
      {
        cell_id: "a1b5b71f-9c2f-4b4b-9f55-9d7e0557616e",
        speaker: "Atasan",
        text: "Bagus. Apakah angka-angkanya sudah diperiksa oleh tim audit?",
        vi: "Tốt. Các con số đã được nhóm kiểm toán kiểm tra chưa?",
        en: "Good. Have the figures been checked by the audit team?",
      },
      {
        cell_id: "cc685c4d-b632-45c2-a091-b60a46f36de9",
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
      { cell_id: "feb65295-9d99-4594-a902-3e6ab65a0f05", word: "kalau / kalo", en: "if (real, casual)", vi: "nếu", pos: "conj.", pronunciation_vi: "KA-lau / KA-lô", pronunciation_en: "KA-low" },
      { cell_id: "8de999ee-86a2-45cf-89d1-c62ef717a135", word: "jika", en: "if (formal)", vi: "nếu (trang trọng)", pos: "conj.", pronunciation_vi: "JI-ka", pronunciation_en: "JEE-ka" },
      { cell_id: "b9e217fb-1d11-4798-8950-5131f633deab", word: "seandainya", en: "if (hypothetical)", vi: "giả sử/giá như", pos: "conj.", pronunciation_vi: "sơ-an-DAI-nya", pronunciation_en: "suh-an-DIGH-nya" },
      { cell_id: "ea4c38fe-d248-417d-a4d7-c07ab7035d5b", word: "andaikata / andai saja", en: "suppose that / if only", vi: "giả như", pos: "conj.", pronunciation_vi: "an-dai-KA-ta", pronunciation_en: "an-digh-KA-ta" },
      { cell_id: "a0419d3e-75f7-4a40-bfdf-d5ef9afd7d16", word: "asalkan", en: "as long as / provided that", vi: "miễn là", pos: "conj.", pronunciation_vi: "a-SAL-kan", pronunciation_en: "a-SAHL-kan" },
      { cell_id: "44f694a1-6ff8-474d-852f-824a1fb4c3cd", word: "kecuali", en: "unless / except", vi: "trừ khi", pos: "conj.", pronunciation_vi: "kơ-chu-A-li", pronunciation_en: "kuh-choo-AH-lee" },
      { cell_id: "9f6db1df-3221-459a-8d4f-9cabd628cdef", word: "akan", en: "will (future marker)", vi: "sẽ", pos: "aux.", pronunciation_vi: "A-kan", pronunciation_en: "AH-kan" },
      { cell_id: "2fe23fac-1e6d-4ed2-b42a-a24c424aa5d2", word: "pasti", en: "surely/definitely", vi: "chắc chắn", pos: "adv.", pronunciation_vi: "PAS-ti", pronunciation_en: "PAHS-tee" },
      { cell_id: "f8335890-3e61-4ceb-b244-04748ae86e1e", word: "mungkin", en: "maybe/possibly", vi: "có lẽ", pos: "adv.", pronunciation_vi: "MUNG-kin", pronunciation_en: "MOONG-kin" },
      { cell_id: "dfe24c41-6be6-4395-ba16-6117d6644802", word: "ditunda", en: "(is/was) postponed", vi: "bị hoãn", pos: "v. (pass.)", pronunciation_vi: "di-TUN-da", pronunciation_en: "dee-TOON-da" },
    ],
    dialogue: [
      {
        cell_id: "c40e59a3-f661-468f-86b3-344f3689734d",
        speaker: "A",
        text: "Kalau besok hujan, acaranya jadi tidak?",
        vi: "Nếu mai mưa, sự kiện còn diễn ra không?",
        en: "If it rains tomorrow, is the event still on?",
      },
      {
        cell_id: "75a5cb6e-61c7-4497-a1e5-99533a9e9c11",
        speaker: "B",
        text: "Kalau hujan deras, pasti ditunda. Tapi kalau gerimis, tetap jalan.",
        vi: "Nếu mưa to, chắc chắn hoãn. Nhưng nếu mưa phùn, vẫn tiến hành.",
        en: "If it pours, it'll surely be postponed. But if it just drizzles, it goes ahead.",
      },
      {
        cell_id: "cb9dd7d1-a625-4f8a-83d5-bfc8596e337a",
        speaker: "A",
        text: "Seandainya kita sewa tenda dari kemarin, kita nggak perlu khawatir.",
        vi: "Giá như hôm qua ta thuê lều, ta đã không phải lo.",
        en: "If only we'd rented a tent yesterday, we wouldn't have to worry.",
      },
      {
        cell_id: "f2b12f31-d41e-47e9-86c7-169a00fc0483",
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
      { cell_id: "95113898-2e5b-48eb-bdef-225a67d1dbd1", word: "menurut saya", en: "in my opinion", vi: "theo tôi", pos: "expr.", pronunciation_vi: "mơ-NU-rut SA-ya", pronunciation_en: "muh-NOO-root SAH-ya" },
      { cell_id: "9b4a779d-9c9f-44fd-bd44-e90eb812e87a", word: "berpendapat", en: "to hold an opinion", vi: "có ý kiến", pos: "v.", pronunciation_vi: "bơr-pơn-DA-pat", pronunciation_en: "bur-pun-DAH-pat" },
      { cell_id: "79632235-0a1e-4ef6-aa1b-b772b26358e5", word: "setuju", en: "to agree", vi: "đồng ý", pos: "v.", pronunciation_vi: "sơ-TU-ju", pronunciation_en: "suh-TOO-joo" },
      { cell_id: "1f6d81a6-1531-49f1-ae4b-c1b43e23da57", word: "kurang setuju", en: "to disagree (softly)", vi: "không đồng ý lắm", pos: "expr.", pronunciation_vi: "KU-rang sơ-TU-ju", pronunciation_en: "KOO-rang suh-TOO-joo" },
      { cell_id: "5d96d62c-109a-492b-9c10-455842153029", word: "sebaliknya", en: "on the contrary", vi: "ngược lại", pos: "adv.", pronunciation_vi: "sơ-ba-LIK-nya", pronunciation_en: "suh-ba-LIK-nya" },
      { cell_id: "45f35e9d-ea13-4b44-951d-49fe0430c812", word: "alasan", en: "reason/argument", vi: "lý do/lập luận", pos: "n.", pronunciation_vi: "a-LA-san", pronunciation_en: "a-LAH-san" },
      { cell_id: "8d54443c-4f2b-4971-9323-a952005e0131", word: "membantah", en: "to rebut/object", vi: "phản bác", pos: "v.", pronunciation_vi: "mơm-BAN-tah", pronunciation_en: "muhm-BAHN-tah" },
      { cell_id: "5b06b764-8e2c-4e16-9f4c-0d7936fdd000", word: "meyakinkan", en: "to convince", vi: "thuyết phục", pos: "v.", pronunciation_vi: "mơ-ya-KIN-kan", pronunciation_en: "muh-ya-KEEN-kan" },
      { cell_id: "66bbafe8-75a4-4da2-81f4-7bef4981d2a9", word: "jalan tengah", en: "middle ground/compromise", vi: "giải pháp dung hòa", pos: "n.", pronunciation_vi: "JA-lan TƠ-ngah", pronunciation_en: "JA-lan TUH-ngah" },
      { cell_id: "c8a1cc5b-682e-460a-b335-1e93672b19e5", word: "musyawarah", en: "deliberation toward consensus", vi: "bàn bạc để đồng thuận", pos: "n.", pronunciation_vi: "mu-sya-WA-rah", pronunciation_en: "moo-sha-WA-rah" },
    ],
    dialogue: [
      {
        cell_id: "9633e4f5-18bb-4338-8ebb-247e09293de8",
        speaker: "Andi",
        text: "Menurut saya, kantor kita harus pindah ke pusat kota.",
        vi: "Theo tôi, văn phòng ta nên chuyển vào trung tâm thành phố.",
        en: "In my opinion, our office should move to the city center.",
      },
      {
        cell_id: "a376ecc2-a58c-4aa6-8215-37572fbcc5ac",
        speaker: "Sari",
        text: "Saya mengerti maksud Anda, tetapi sebaliknya, sewanya jauh lebih mahal.",
        vi: "Tôi hiểu ý bạn, nhưng ngược lại, tiền thuê đắt hơn nhiều.",
        en: "I understand your point, but on the contrary, the rent is much more expensive.",
      },
      {
        cell_id: "56b27766-7045-4def-8eac-6a9cd83acf53",
        speaker: "Andi",
        text: "Mungkin, tapi kita akan lebih dekat dengan klien.",
        vi: "Có thể, nhưng ta sẽ gần khách hàng hơn.",
        en: "Maybe, but we'd be closer to our clients.",
      },
      {
        cell_id: "7b5daf66-3b97-48b3-a3cf-8f9c01ffcf13",
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
      { cell_id: "8009c869-eff2-4a07-8e62-13474b28f38e", word: "perusahaan", en: "company", vi: "công ty", pos: "n.", pronunciation_vi: "pơ-ru-sa-HA-an", pronunciation_en: "puh-roo-sa-HA-an" },
      { cell_id: "650809bd-e7c0-4bc2-a604-b397a61cae36", word: "kerja sama", en: "cooperation/partnership", vi: "hợp tác", pos: "n.", pronunciation_vi: "KƠR-ja SA-ma", pronunciation_en: "KUR-ja SAH-ma" },
      { cell_id: "778466dc-3ec7-4b4a-9bde-8d424413cf42", word: "penawaran", en: "offer/quotation", vi: "lời chào hàng/báo giá", pos: "n.", pronunciation_vi: "pơ-na-WA-ran", pronunciation_en: "puh-na-WA-ran" },
      { cell_id: "4e3072ae-8bf6-4296-bff6-ef23d4684e50", word: "tawar-menawar", en: "bargaining", vi: "mặc cả", pos: "n.", pronunciation_vi: "TA-war mơ-NA-war", pronunciation_en: "TA-war muh-NA-war" },
      { cell_id: "4259a481-979c-4b77-b339-ce763e9ffb93", word: "harga", en: "price", vi: "giá", pos: "n.", pronunciation_vi: "HAR-ga", pronunciation_en: "HAR-ga" },
      { cell_id: "3a552724-9a2a-46b8-8e1f-0cd649e5c396", word: "diskon / potongan harga", en: "discount", vi: "giảm giá", pos: "n.", pronunciation_vi: "DIS-kôn", pronunciation_en: "DIS-kon" },
      { cell_id: "767bee57-bc19-4cac-aa22-78384f98832f", word: "pembayaran", en: "payment", vi: "thanh toán", pos: "n.", pronunciation_vi: "pơm-ba-YA-ran", pronunciation_en: "puhm-ba-YA-ran" },
      { cell_id: "c71797f8-06b4-4d2d-a1e9-a4b9dd100ad7", word: "kontrak", en: "contract", vi: "hợp đồng", pos: "n.", pronunciation_vi: "KÔN-trak", pronunciation_en: "KON-trak" },
      { cell_id: "cf6e8c8b-33e6-4e76-8cbd-aa4f68b29f80", word: "sepakat", en: "to agree (settle a deal)", vi: "thống nhất/chốt", pos: "v.", pronunciation_vi: "sơ-PA-kat", pronunciation_en: "suh-PA-kat" },
      { cell_id: "51838614-849e-4d90-82c7-49e65fcf8bf6", word: "mengajukan", en: "to propose/submit", vi: "đề xuất/đệ trình", pos: "v.", pronunciation_vi: "mơ-nga-JU-kan", pronunciation_en: "muh-nga-JOO-kan" },
    ],
    dialogue: [
      {
        cell_id: "62697500-5730-4f86-b383-773eaa11256d",
        speaker: "Klien",
        text: "Terima kasih sudah datang, Pak. Bagaimana penawaran dari pihak Anda?",
        vi: "Cảm ơn anh đã đến. Bên anh chào giá thế nào?",
        en: "Thank you for coming, sir. What's your offer?",
      },
      {
        cell_id: "08c81997-6fe5-4c06-bd02-7e329ab4a64b",
        speaker: "Penjual",
        text: "Kami ingin mengajukan kerja sama setahun. Kalau jumlahnya besar, harganya bisa kami turunkan.",
        vi: "Chúng tôi muốn đề xuất hợp tác một năm. Nếu số lượng lớn, chúng tôi có thể giảm giá.",
        en: "We'd like to propose a one-year partnership. If the quantity is large, we can lower the price.",
      },
      {
        cell_id: "7fc5df92-c679-4cd5-9777-6c0f37f43238",
        speaker: "Klien",
        text: "Menarik. Tapi tolong potongan harganya ditambah sedikit lagi.",
        vi: "Hấp dẫn đấy. Nhưng làm ơn giảm giá thêm một chút.",
        en: "Interesting. But please add a bit more to the discount.",
      },
      {
        cell_id: "a41c62aa-3e95-40e0-a997-619436fe94fb",
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
      { cell_id: "4fa93333-7afd-45ef-a148-02eef146e1f2", word: "dengan hormat", en: "respectfully (salutation)", vi: "kính thưa", pos: "expr.", pronunciation_vi: "DƠ-ngan HOR-mat", pronunciation_en: "DUH-ngan HOR-mat" },
      { cell_id: "209f11b8-efd0-4336-80bc-538f14654227", word: "melamar", en: "to apply (for a job)", vi: "ứng tuyển", pos: "v.", pronunciation_vi: "mơ-LA-mar", pronunciation_en: "muh-LA-mar" },
      { cell_id: "6db6b265-7b89-4a3f-a695-c33b0b9149d5", word: "terlampir", en: "enclosed/attached", vi: "đính kèm", pos: "adj.", pronunciation_vi: "tơr-LAM-pir", pronunciation_en: "tur-LAHM-pir" },
      { cell_id: "d75d42e4-5ebb-4b02-b1fe-a1fd8aa205af", word: "mohon", en: "kindly request (formal)", vi: "kính mong", pos: "v.", pronunciation_vi: "MÔ-hôn", pronunciation_en: "MOH-hon" },
      { cell_id: "2ef4afa6-86f0-4334-a5ab-15a1ed821ee7", word: "sehubungan dengan", en: "with regard to", vi: "liên quan đến", pos: "conj.", pronunciation_vi: "sơ-hu-BU-ngan DƠ-ngan", pronunciation_en: "suh-hoo-BOO-ngan DUH-ngan" },
      { cell_id: "1b5a6fce-7001-4e68-9175-4eebad308752", word: "perhatian", en: "attention", vi: "sự quan tâm", pos: "n.", pronunciation_vi: "pơr-ha-TI-an", pronunciation_en: "pur-ha-TEE-an" },
      { cell_id: "fa5d490f-ed29-4300-8f8a-dff93ecbbc37", word: "menghubungi", en: "to contact", vi: "liên hệ", pos: "v.", pronunciation_vi: "mơng-hu-BU-ngi", pronunciation_en: "muhng-hoo-BOO-ngee" },
      { cell_id: "cf2769b7-de98-437e-89f1-48be08879286", word: "demikian", en: "thus/so (sign-off)", vi: "như vậy/trên đây", pos: "adv.", pronunciation_vi: "dơ-mi-KI-an", pronunciation_en: "duh-mee-KEE-an" },
      { cell_id: "c3bdc949-80b9-42e9-bc97-c15230b50b38", word: "hormat saya", en: "respectfully yours", vi: "kính thư", pos: "expr.", pronunciation_vi: "HOR-mat SA-ya", pronunciation_en: "HOR-mat SAH-ya" },
      { cell_id: "217a873b-5ff3-4faf-b467-581c2dc10a68", word: "lampiran", en: "attachment/enclosure", vi: "phụ lục/tệp đính kèm", pos: "n.", pronunciation_vi: "lam-PI-ran", pronunciation_en: "lahm-PEE-ran" },
    ],
    dialogue: [
      {
        cell_id: "d815ff13-04f7-4cb9-921e-b3694af1aa41",
        speaker: "HRD",
        text: "Surat lamaran Anda sudah kami terima. Boleh dijelaskan pengalaman Anda?",
        vi: "Chúng tôi đã nhận đơn ứng tuyển của bạn. Bạn có thể nói rõ kinh nghiệm không?",
        en: "We have received your application letter. Could you explain your experience?",
      },
      {
        cell_id: "f05ff9cb-184c-42a8-af81-48964b5b68a7",
        speaker: "Pelamar",
        text: "Tentu. Sehubungan dengan posisi ini, saya melampirkan portofolio dalam dokumen terlampir.",
        vi: "Tất nhiên. Liên quan đến vị trí này, tôi đính kèm hồ sơ năng lực trong tệp đính kèm.",
        en: "Of course. With regard to this position, I've enclosed my portfolio in the attached document.",
      },
      {
        cell_id: "6658ddb1-0a91-4035-85ea-6b222b170a4c",
        speaker: "HRD",
        text: "Baik. Mohon Anda menunggu kabar dari kami dalam satu minggu.",
        vi: "Tốt. Kính mong bạn chờ tin từ chúng tôi trong một tuần.",
        en: "Good. Please await news from us within a week.",
      },
      {
        cell_id: "2e7fe009-ed26-44d2-b5c8-b63bf8a1a7ce",
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
      { cell_id: "04b06d00-12ab-4fd2-80eb-7cac68881eea", word: "meskipun / walaupun", en: "although/even though", vi: "mặc dù", pos: "conj.", pronunciation_vi: "mơs-KI-pun", pronunciation_en: "mus-KEE-poon" },
      { cell_id: "41dffcdf-402c-44f1-be58-cd1f43deaca7", word: "supaya / agar", en: "so that (purpose)", vi: "để", pos: "conj.", pronunciation_vi: "su-PA-ya", pronunciation_en: "soo-PA-ya" },
      { cell_id: "b2c774f6-af4f-4d70-aa94-142c9e23914a", word: "sedangkan", en: "whereas", vi: "trong khi", pos: "conj.", pronunciation_vi: "sơ-DANG-kan", pronunciation_en: "suh-DAHNG-kan" },
      { cell_id: "9ccd77cb-f72e-4eb7-b421-27ae926f4f98", word: "sehingga", en: "so that / such that (result)", vi: "nên/đến nỗi", pos: "conj.", pronunciation_vi: "sơ-HING-ga", pronunciation_en: "suh-HING-ga" },
      { cell_id: "ce3eed7b-60a0-49fb-aea8-cb672c984222", word: "karena", en: "because", vi: "vì/bởi vì", pos: "conj.", pronunciation_vi: "KA-rơ-na", pronunciation_en: "KA-ruh-na" },
      { cell_id: "dd1b2057-c802-41f2-837d-68f82e5bbd51", word: "oleh karena itu", en: "therefore", vi: "vì vậy", pos: "conj.", pronunciation_vi: "Ô-lê KA-rơ-na I-tu", pronunciation_en: "OH-lay KA-ruh-na EE-too" },
      { cell_id: "b65becc4-52ca-4381-96b7-d2a6b2094354", word: "namun", en: "however (formal)", vi: "tuy nhiên", pos: "conj.", pronunciation_vi: "NA-mun", pronunciation_en: "NA-moon" },
      { cell_id: "ac1171f6-dbd3-4364-bd2f-98608c8f8f62", word: "tidak hanya… tetapi juga…", en: "not only… but also…", vi: "không những… mà còn…", pos: "corr.", pronunciation_vi: "TI-dak HA-nya… tơ-TA-pi JU-ga", pronunciation_en: "TEE-dak HA-nya… tuh-TA-pee JOO-ga" },
      { cell_id: "be6a701a-fc3b-4afe-a265-b2e00e08e25f", word: "baik… maupun…", en: "both… and…", vi: "cả… lẫn…", pos: "corr.", pronunciation_vi: "BA-ik… ma-U-pun", pronunciation_en: "BA-ik… ma-OO-poon" },
      { cell_id: "68bc5afe-8075-471d-9638-b8131c88faaa", word: "selama", en: "as long as / while", vi: "trong suốt/miễn là", pos: "conj.", pronunciation_vi: "sơ-LA-ma", pronunciation_en: "suh-LAH-ma" },
    ],
    dialogue: [
      {
        cell_id: "67e26080-c4ef-4dd1-bcac-278eab2222d9",
        speaker: "Guru",
        text: "Meskipun ujiannya sulit, kamu berhasil lulus. Bagaimana caranya?",
        vi: "Mặc dù bài thi khó, em vẫn đỗ. Em làm thế nào vậy?",
        en: "Although the exam was hard, you managed to pass. How did you do it?",
      },
      {
        cell_id: "7863505d-288c-4ff5-aa24-ce20b6248ef4",
        speaker: "Murid",
        text: "Saya belajar tiap malam supaya bisa memahami semua materi.",
        vi: "Em học mỗi tối để có thể hiểu hết bài.",
        en: "I studied every night so that I could understand all the material.",
      },
      {
        cell_id: "8f8bf38f-74bb-4fd8-8131-eb92d787ec58",
        speaker: "Guru",
        text: "Bagus. Tidak hanya rajin, tetapi kamu juga pandai mengatur waktu.",
        vi: "Tốt. Không những siêng năng mà em còn giỏi quản lý thời gian.",
        en: "Excellent. Not only are you diligent, but you also manage your time well.",
      },
      {
        cell_id: "31827793-64f7-4e43-8d6a-04cd18a8f83e",
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
