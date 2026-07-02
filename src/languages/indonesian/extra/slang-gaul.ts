// src/languages/indonesian/extra/slang-gaul.ts
//
// Bahasa Gaul (Indonesian slang) pack for Vietnamese learners.
// The Indonesian taught in textbooks (Bahasa Indonesia baku = standard/formal)
// is NOT what people actually speak in Jakarta, on TikTok, or in chat. This
// pack teaches the colloquial register: Jakarta slang, particles (sih, dong,
// deh, kok), pronouns (gue/lu), and the chat abbreviations (yg, dgn, tdk, blm)
// every learner meets on day one of texting an Indonesian friend.
//
// Vietnamese-first: `vi` gloss on every line; `pronunciation_focus` carries the
// Vietnamese-facing note (incl. the standard-vs-slang mapping = the key skill),
// `pronunciation_focus_en` is the English companion (same order).
//
// REGISTER WARNING baked into each lesson: gaul is for friends, social media,
// and casual settings ONLY. Using gue/lu with a boss, an official, or an elder
// is rude. The formal forms (saya/Anda) are taught alongside so the learner
// always knows the safe default.
//
// Self-contained inline types (mirrors indonesian-culture.ts / the Italian
// extra packs); swap for a shared import when the registry lands.

export type LessonSentence = {
  en: string; // Indonesian target line
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type VocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

export type Exercise = Record<string, unknown>;

export type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type IndonesianLesson = {
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
  content?: string;
};

export const lessons: IndonesianLesson[] = [
  // ──────────────────────────────────────────────────────────────────────
  // 1. gue / lu — the casual pronouns
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_gaul_pronouns",
    level: "A2",
    category: "slang",
    title_vi: "gue / lu — đại từ thân mật (vs saya / Anda)",
    title_en: "gue / lu — the casual pronouns (vs saya / Anda)",
    sentences: [
      {
        en: "Gue mau makan, lu mau ikut?",
        vi: "Tao muốn đi ăn, mày đi cùng không?",
        pronunciation_focus: [
          "gue → GU-e (cũng viết 'gw') = 'tao/tớ' — thân mật, gốc tiếng Hokkien",
          "lu → LU (cũng viết 'lo') = 'mày/cậu' — thân mật",
          "mau → MA-u = muốn",
          "FORMAL: 'Saya mau makan, Anda mau ikut?' — dùng với người lạ/cấp trên",
        ],
        pronunciation_focus_en: [
          "gue → 'GOO-eh' (also spelled 'gw') = casual 'I/me', from Hokkien Chinese",
          "lu → 'LOO' (also 'lo') = casual 'you'",
          "mau → 'MAH-oo' = want",
          "FORMAL version: 'Saya mau makan, Anda mau ikut?' — use with strangers/superiors",
        ],
      },
      {
        en: "Ini punya gue, bukan punya lu.",
        vi: "Cái này của tao, không phải của mày.",
        pronunciation_focus: [
          "punya → PU-nya = của, sở hữu ('ny' = 'nh')",
          "bukan → BU-kan = không phải (phủ định danh từ)",
          "gue/lu giữ nguyên ở vị trí sở hữu — không biến đổi",
          "FORMAL: 'Ini milik saya, bukan milik Anda.'",
        ],
        pronunciation_focus_en: [
          "punya → 'POO-nyah' = to own/belong to ('ny' = ñ)",
          "bukan → 'BOO-kan' = not (negates nouns)",
          "gue/lu don't change form in the possessive — same word",
          "FORMAL: 'Ini milik saya, bukan milik Anda.'",
        ],
      },
      {
        en: "Lu lagi di mana? Gue tungguin nih.",
        vi: "Mày đang ở đâu? Tao đang đợi đây.",
        pronunciation_focus: [
          "lagi → LA-gi = đang (dạng gaul của 'sedang')",
          "tungguin → tung-GU-in = đợi ai đó (-in = hậu tố gaul thay cho -kan/-i)",
          "nih → NIH = này, đây (rút gọn của 'ini', thêm sắc thái)",
          "FORMAL: 'Anda sedang di mana? Saya menunggu.'",
        ],
        pronunciation_focus_en: [
          "lagi → 'LAH-gee' = the slang form of 'sedang' (-ing marker)",
          "tungguin → 'toong-GOO-in' = wait for someone (-in = slang suffix replacing -kan/-i)",
          "nih → 'NEE' = 'here/this', a shortened 'ini' with extra nuance",
          "FORMAL: 'Anda sedang di mana? Saya menunggu.'",
        ],
      },
    ],
    cultural_notes_vi:
      "'gue' (tôi) và 'lu' (bạn) là cặp đại từ phổ biến nhất trong tiếng lóng Jakarta, có gốc từ tiếng Hokkien của cộng đồng người Hoa. Chúng tương đương 'tao/mày' hoặc 'tớ/cậu' trong tiếng Việt — RẤT thân mật. Dùng với bạn bè, người cùng tuổi, trên mạng xã hội thì hoàn toàn tự nhiên. NHƯNG dùng với sếp, người lớn tuổi, quan chức, khách hàng thì BẤT LỊCH SỰ. Mặc định an toàn luôn là 'saya' (tôi) + 'Anda' (anh/chị) hoặc gọi bằng chức danh (Pak/Bu). Người Indonesia cũng dùng 'aku/kamu' — thân mật vừa phải, lịch sự hơn gue/lu nhưng kém trang trọng hơn saya/Anda.",
    cultural_notes_en:
      "'gue' (I) and 'lu' (you) are the most common Jakarta slang pronouns, borrowed from Hokkien Chinese. They map onto Vietnamese 'tao/mày' — VERY informal. Perfectly natural with friends, peers, and on social media. But with a boss, an elder, an official, or a customer they are rude. The safe default is always 'saya' + 'Anda', or a title (Pak/Bu). Indonesians also use 'aku/kamu' — moderately intimate, politer than gue/lu but less formal than saya/Anda.",
    tip_advice_vi:
      "Học theo 3 nấc thang lịch sự: (1) gue/lu = suồng sã (bạn thân, mạng xã hội); (2) aku/kamu = thân mật lịch sự (bạn bè, người yêu, đồng nghiệp ngang hàng); (3) saya/Anda = trang trọng (người lạ, sếp, công việc). Khi nghi ngờ, LUÔN chọn nấc 3. Hậu tố gaul '-in' thay cho '-kan/-i' chuẩn: bikinin = buatkan, tungguin = tunggu.",
    tip_advice_en:
      "Learn the three politeness tiers: (1) gue/lu = very casual (close friends, social media); (2) aku/kamu = friendly-polite (friends, partner, equal colleagues); (3) saya/Anda = formal (strangers, boss, work). When in doubt, always pick tier 3. The slang suffix '-in' replaces standard '-kan/-i': bikinin = buatkan, tungguin = tunggu.",
    vocabulary: [
      { word: "gue / gw", en: "I, me (casual)", vi: "tao, tớ", pos: "pronoun", pronunciation_vi: "GU-e", pronunciation_en: "GOO-eh" },
      { word: "lu / lo", en: "you (casual)", vi: "mày, cậu", pos: "pronoun", pronunciation_vi: "LU", pronunciation_en: "LOO" },
      { word: "aku", en: "I, me (intimate-polite)", vi: "anh/em/tớ", pos: "pronoun", pronunciation_vi: "A-ku", pronunciation_en: "AH-koo" },
      { word: "kamu", en: "you (intimate-polite)", vi: "bạn, em", pos: "pronoun", pronunciation_vi: "KA-mu", pronunciation_en: "KAH-moo" },
      { word: "saya", en: "I, me (formal)", vi: "tôi", pos: "pronoun", pronunciation_vi: "SA-ya", pronunciation_en: "SAH-yah" },
      { word: "Anda", en: "you (formal)", vi: "anh/chị/ông/bà", pos: "pronoun", pronunciation_vi: "AN-da", pronunciation_en: "AHN-dah" },
    ],
    dialogue: [
      { speaker: "Dito (bạn)", text: "Eh, lu udah makan belum? Gue laper nih.", vi: "Ê, mày ăn chưa? Tao đói rồi đây.", en: "Hey, have you eaten yet? I'm hungry." },
      { speaker: "Bagas", text: "Belum. Yuk, gue ikut. Mau makan apa?", vi: "Chưa. Đi, tao đi cùng. Ăn gì đây?", en: "Not yet. Come on, I'll join. What do you want to eat?" },
      { speaker: "Dito", text: "Bebas. Lu yang pilih deh.", vi: "Tùy. Mày chọn đi.", en: "Whatever. You choose." },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối dạng gaul với dạng trang trọng tương ứng:",
        instruction_en: "Match each slang pronoun to its formal equivalent:",
        items: [
          { prompt: "gue", answer: "saya" },
          { prompt: "lu", answer: "Anda" },
          { prompt: "tungguin", answer: "menunggu" },
          { prompt: "lagi", answer: "sedang" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Chọn đại từ phù hợp ngữ cảnh:",
        instruction_en: "Pick the pronoun that fits the context:",
        items: [
          { prompt: "(với sếp) ___ akan kirim laporan. (tôi)", answer: "Saya", options: ["Saya", "Gue"] },
          { prompt: "(với bạn thân) ___ mau ke mall? (mày)", answer: "Lu", options: ["Lu", "Anda"] },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 2. Particles — sih, dong, deh, kok, lah
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_gaul_particles",
    level: "B1",
    category: "slang",
    title_vi: "Tiểu từ tình thái — sih, dong, deh, kok, lah",
    title_en: "Mood particles — sih, dong, deh, kok, lah",
    sentences: [
      {
        en: "Kenapa sih kamu marah?",
        vi: "Sao mà bạn giận thế? (sih = nhấn mạnh sự tò mò/bực)",
        pronunciation_focus: [
          "sih → SIH = tiểu từ nhấn mạnh, gần như 'thế/vậy' của tiếng Việt",
          "kenapa → ke-NA-pa = tại sao (gaul của 'mengapa')",
          "'sih' không có nghĩa từ điển — thêm sắc thái tò mò, hơi trách",
          "FORMAL bỏ 'sih': 'Mengapa kamu marah?'",
        ],
        pronunciation_focus_en: [
          "sih → 'SEE' = emphasis particle, like adding 'though/exactly' in tone",
          "kenapa → 'kuh-NAH-pah' = why (slang for 'mengapa')",
          "'sih' has no dictionary meaning — it adds curiosity/mild reproach",
          "FORMAL drops 'sih': 'Mengapa kamu marah?'",
        ],
      },
      {
        en: "Ikut dong! Jangan tinggalin gue.",
        vi: "Đi cùng đi mà! Đừng bỏ tao lại.",
        pronunciation_focus: [
          "dong → DONG = tiểu từ nài nỉ/thuyết phục, như 'đi mà' tiếng Việt",
          "ikut → I-kut = đi theo, tham gia",
          "tinggalin → ting-GA-lin = bỏ lại (gaul: tinggal + -in)",
          "'dong' làm câu mềm, dễ thương, có chút năn nỉ",
        ],
        pronunciation_focus_en: [
          "dong → 'DONG' = coaxing/persuading particle, like 'come on' / 'pleeease'",
          "ikut → 'EE-koot' = to join/come along",
          "tinggalin → 'ting-GAH-lin' = leave behind (slang: tinggal + -in)",
          "'dong' softens the request and adds a pleading, friendly tone",
        ],
      },
      {
        en: "Ya udah deh, gue ikut.",
        vi: "Thôi được rồi, tao đi cùng. (deh = nhượng bộ)",
        pronunciation_focus: [
          "deh → DEH = tiểu từ chấp nhận/nhượng bộ, 'thôi vậy'",
          "ya udah → ya u-DAH = 'thôi được rồi' (gaul của 'ya sudah')",
          "kết hợp 'ya udah deh' = cụm chấp nhận miễn cưỡng rất thông dụng",
          "FORMAL: 'Baiklah, saya ikut.'",
        ],
        pronunciation_focus_en: [
          "deh → 'DEH' = particle of acceptance/concession, 'fine then'",
          "ya udah → 'yah oo-DAH' = 'okay then' (slang for 'ya sudah')",
          "'ya udah deh' = a very common reluctant-acceptance chunk",
          "FORMAL: 'Baiklah, saya ikut.'",
        ],
      },
      {
        en: "Kok kamu tahu? Gue nggak pernah cerita.",
        vi: "Ủa sao bạn biết? Tao chưa kể bao giờ. (kok = ngạc nhiên)",
        pronunciation_focus: [
          "kok → KOK = tiểu từ ngạc nhiên/thắc mắc, 'ủa sao'",
          "tahu → TA-hu = biết (hai âm tiết: ta-hu)",
          "nggak → ng-GAK = không (gaul của 'tidak'; cũng viết 'ngga', 'gak')",
          "pernah → PER-nah = từng, đã bao giờ",
        ],
        pronunciation_focus_en: [
          "kok → 'KOK' = surprise/questioning particle, 'how come / wait, why'",
          "tahu → 'TAH-hoo' = to know (two syllables)",
          "nggak → 'NG-gak' = not (slang for 'tidak'; also 'ngga', 'gak')",
          "pernah → 'PER-nah' = ever, have ever",
        ],
      },
    ],
    cultural_notes_vi:
      "Tiểu từ tình thái là 'gia vị' của tiếng Indonesia nói — chúng không thay đổi nghĩa đen mà thêm CẢM XÚC, giống 'à, nhé, mà, thế, đấy' trong tiếng Việt. Người Việt có lợi thế lớn vì tiếng Việt cũng đầy tiểu từ. Bảng nhanh: 'sih' (nhấn mạnh, tò mò), 'dong' (nài nỉ, đi mà), 'deh' (nhượng bộ, thôi vậy), 'kok' (ngạc nhiên, ủa sao), 'lah' (khẳng định nhẹ), 'kan' (đúng không, phải không), 'nih/tuh' (này/kia, chỉ trỏ). Dùng đúng tiểu từ khiến bạn nghe TỰ NHIÊN ngay; dùng sai hoặc thiếu khiến câu nghe cứng như sách giáo khoa.",
    cultural_notes_en:
      "Mood particles are the 'seasoning' of spoken Indonesian — they don't change literal meaning but add EMOTION, just like Vietnamese 'à, nhé, mà, thế, đấy'. Vietnamese learners have a big head start since Vietnamese is full of them too. Quick table: 'sih' (emphasis/curiosity), 'dong' (coaxing, 'come on'), 'deh' (concession, 'fine then'), 'kok' (surprise, 'how come'), 'lah' (gentle assertion), 'kan' (right?/isn't it?), 'nih/tuh' (this/that, pointing). The right particle makes you sound instantly natural; missing them makes you sound like a textbook.",
    tip_advice_vi:
      "Mẹo cho người Việt: ghép tiểu từ Indonesia với tiểu từ Việt tương đương để nhớ — dong ≈ 'đi mà', deh ≈ 'thôi vậy', kan ≈ 'đúng không', sih ≈ 'thế/vậy'. Đừng dịch chúng; CẢM nhận chúng. Lưu ý 'nggak/gak' = 'tidak' (không) là từ gaul quan trọng nhất — nghe khắp nơi.",
    tip_advice_en:
      "Trick for Vietnamese speakers: pair each Indonesian particle with its Vietnamese twin — dong ≈ 'đi mà', deh ≈ 'thôi vậy', kan ≈ 'đúng không', sih ≈ 'thế'. Don't translate them; feel them. Note 'nggak/gak' = 'tidak' (not) is the single most-heard slang word.",
    vocabulary: [
      { word: "sih", en: "emphasis / curiosity particle", vi: "thế, vậy (nhấn mạnh)", pos: "particle", pronunciation_vi: "SIH", pronunciation_en: "SEE" },
      { word: "dong", en: "coaxing particle ('come on')", vi: "đi mà (nài nỉ)", pos: "particle", pronunciation_vi: "DONG", pronunciation_en: "DONG" },
      { word: "deh", en: "concession particle ('fine then')", vi: "thôi vậy", pos: "particle", pronunciation_vi: "DEH", pronunciation_en: "DEH" },
      { word: "kok", en: "surprise particle ('how come')", vi: "ủa sao", pos: "particle", pronunciation_vi: "KOK", pronunciation_en: "KOK" },
      { word: "kan", en: "tag particle ('right?')", vi: "đúng không, phải không", pos: "particle", pronunciation_vi: "KAN", pronunciation_en: "KAN" },
      { word: "nggak / gak", en: "not (slang for tidak)", vi: "không", pos: "adverb", pronunciation_vi: "ng-GAK / GAK", pronunciation_en: "NG-gak / GAK" },
      { word: "nih", en: "this/here (pointing)", vi: "này, đây", pos: "particle", pronunciation_vi: "NIH", pronunciation_en: "NEE" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối tiểu từ với tiểu từ Việt tương đương:",
        instruction_en: "Match the particle to its Vietnamese equivalent:",
        items: [
          { prompt: "dong", answer: "đi mà" },
          { prompt: "deh", answer: "thôi vậy" },
          { prompt: "kan", answer: "đúng không" },
          { prompt: "kok", answer: "ủa sao" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền tiểu từ hợp ngữ cảnh:",
        instruction_en: "Fill the particle that fits:",
        items: [
          { prompt: "Ayo ikut ___! (nài nỉ)", answer: "dong", options: ["dong", "kok", "sih"] },
          { prompt: "___ kamu tahu? Aku belum cerita. (ngạc nhiên)", answer: "Kok", options: ["Kok", "Deh", "Dong"] },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 3. Standard vs slang — the baku ↔ gaul mapping
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_gaul_baku_vs_gaul",
    level: "B1",
    category: "slang",
    title_vi: "Chuẩn vs lóng — bảng ánh xạ baku ↔ gaul",
    title_en: "Standard vs slang — the baku ↔ gaul map",
    sentences: [
      {
        en: "Gaul: Gue gak tahu. — Baku: Saya tidak tahu.",
        vi: "Lóng: Tao không biết. — Chuẩn: Tôi không biết.",
        pronunciation_focus: [
          "gak/nggak → tidak (không)",
          "gue → saya (tôi)",
          "Cùng một câu, hai đăng ký ngôn ngữ khác nhau",
          "Học CẢ HAI: gaul để hiểu/nói tự nhiên, baku để viết/trang trọng",
        ],
        pronunciation_focus_en: [
          "gak/nggak → tidak (not)",
          "gue → saya (I)",
          "Same sentence, two registers",
          "Learn BOTH: gaul to understand/speak naturally, baku to write/be formal",
        ],
      },
      {
        en: "Gaul: Udah, kan? — Baku: Sudah, bukan?",
        vi: "Lóng: Xong rồi, đúng không? — Chuẩn: Đã xong rồi, phải không?",
        pronunciation_focus: [
          "udah/udeh → sudah (đã, rồi) — bỏ chữ 's' đầu là đặc trưng gaul",
          "kan → bukan (rút gọn) trong câu hỏi đuôi",
          "gaul hay 'nuốt' âm tiết đầu: sudah→udah, saja→aja, sama→ama",
          "FORMAL giữ đầy đủ: sudah, saja, sama",
        ],
        pronunciation_focus_en: [
          "udah/udeh → sudah (already) — dropping the initial 's' is classic gaul",
          "kan → shortened tag from 'bukan' in tag questions",
          "gaul swallows first syllables: sudah→udah, saja→aja, sama→ama",
          "FORMAL keeps them full: sudah, saja, sama",
        ],
      },
      {
        en: "Gaul: Bokap gue lagi kerja. — Baku: Ayah saya sedang bekerja.",
        vi: "Lóng: Bố tao đang làm việc. — Chuẩn: Bố tôi đang làm việc.",
        pronunciation_focus: [
          "bokap → bố (gaul); nyokap → mẹ (gaul) — tiếng lóng đảo âm (bahasa walikan)",
          "lagi → sedang (đang)",
          "kerja → bekerja (làm việc) — gaul bỏ tiền tố ber-",
          "bokap/nyokap chỉ dùng cực kỳ thân mật, không bao giờ trang trọng",
        ],
        pronunciation_focus_en: [
          "bokap → dad (slang); nyokap → mum (slang) — from 'walikan' syllable-reversal slang",
          "lagi → sedang (-ing marker)",
          "kerja → bekerja (to work) — gaul drops the ber- prefix",
          "bokap/nyokap are ultra-casual, never formal",
        ],
      },
    ],
    cultural_notes_vi:
      "Indonesia có tình trạng 'diglossia' — hai biến thể song song của cùng một ngôn ngữ: 'baku' (chuẩn, dùng trong văn bản, tin tức, trường học, công sở) và 'gaul' (đường phố, mạng xã hội, bạn bè). Bạn PHẢI học cả hai. Sách giáo khoa chỉ dạy baku, nên người mới học thường sốc khi nghe người Indonesia nói thật — nghe như ngôn ngữ khác. Quy tắc biến đổi gaul phổ biến: (1) tidak→nggak/gak, (2) sudah→udah, (3) saja→aja, (4) bisa→bisa nhưng tahu→tau, (5) bỏ tiền tố meN-/ber- (membeli→beli, bekerja→kerja), (6) hậu tố -kan/-i → -in. Bokap/nyokap (bố/mẹ) đến từ 'bahasa walikan' — tiếng lóng đảo trật tự âm tiết của Malang.",
    cultural_notes_en:
      "Indonesia is diglossic — two parallel varieties of the same language: 'baku' (standard: writing, news, school, office) and 'gaul' (street, social media, friends). You MUST learn both. Textbooks teach only baku, so learners are shocked when real Indonesians speak — it sounds like a different language. Common gaul transformations: (1) tidak→nggak/gak, (2) sudah→udah, (3) saja→aja, (4) tahu→tau, (5) drop meN-/ber- prefixes (membeli→beli, bekerja→kerja), (6) -kan/-i suffixes → -in. Bokap/nyokap (dad/mum) come from 'bahasa walikan', the syllable-reversal slang of Malang.",
    tip_advice_vi:
      "Chiến lược học: NÓI bằng baku khi chưa chắc (luôn an toàn), nhưng tập NGHE-HIỂU gaul ngay từ đầu (vì người ta nói gaul). Lập bảng cá nhân baku↔gaul cho 20 từ hay gặp nhất. Đừng dùng bokap/nyokap, gue/lu với người chưa thân — sẽ bị coi là vô lễ.",
    tip_advice_en:
      "Strategy: SPEAK in baku when unsure (always safe), but train your EAR for gaul from day one (because people speak it). Keep a personal baku↔gaul table for your 20 most-used words. Don't use bokap/nyokap or gue/lu with people you aren't close to — it reads as rude.",
    vocabulary: [
      { word: "baku", en: "standard/formal (language)", vi: "chuẩn, trang trọng", pos: "adjective", pronunciation_vi: "BA-ku", pronunciation_en: "BAH-koo" },
      { word: "gaul", en: "slang, hip, sociable", vi: "lóng, sành điệu", pos: "adjective", pronunciation_vi: "GA-ul", pronunciation_en: "GAH-ool" },
      { word: "udah", en: "already (slang of sudah)", vi: "rồi, đã xong", pos: "adverb", pronunciation_vi: "u-DAH", pronunciation_en: "oo-DAH" },
      { word: "aja", en: "just/only (slang of saja)", vi: "thôi, chỉ", pos: "adverb", pronunciation_vi: "A-ja", pronunciation_en: "AH-jah" },
      { word: "bokap", en: "dad (slang)", vi: "bố (lóng)", pos: "noun", pronunciation_vi: "BO-kap", pronunciation_en: "BOH-kap" },
      { word: "nyokap", en: "mum (slang)", vi: "mẹ (lóng)", pos: "noun", pronunciation_vi: "NYO-kap", pronunciation_en: "NYOH-kap" },
      { word: "banget", en: "very (slang of sangat)", vi: "rất, lắm", pos: "adverb", pronunciation_vi: "BA-nget", pronunciation_en: "BAH-nget" },
    ],
    dialogue: [
      { speaker: "Gaul", text: "Eh, lu udah ngerjain PR belum? Gue belum sama sekali.", vi: "Ê, mày làm bài tập chưa? Tao chưa làm gì cả.", en: "Hey, have you done the homework? I haven't done any." },
      { speaker: "Baku", text: "(setara) Apakah Anda sudah mengerjakan PR? Saya belum sama sekali.", vi: "(tương đương) Bạn đã làm bài tập chưa? Tôi chưa làm gì cả.", en: "(equivalent) Have you done the homework? I haven't done any at all." },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ gaul với dạng chuẩn (baku):",
        instruction_en: "Match each gaul word to its baku form:",
        items: [
          { prompt: "gak / nggak", answer: "tidak" },
          { prompt: "udah", answer: "sudah" },
          { prompt: "aja", answer: "saja" },
          { prompt: "banget", answer: "sangat" },
          { prompt: "bokap", answer: "ayah" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Viết lại câu gaul sang baku:",
        instruction_en: "Rewrite the gaul sentence in baku:",
        items: [
          { prompt: "Gue gak tahu.", answer: "Saya tidak tahu." },
          { prompt: "Udah, kan?", answer: "Sudah, bukan?" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 4. Chat abbreviations — yg, dgn, tdk, blm, dll
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_gaul_chat_abbreviations",
    level: "A2",
    category: "slang",
    title_vi: "Viết tắt khi nhắn tin — yg, dgn, tdk, blm, dll",
    title_en: "Chat abbreviations — yg, dgn, tdk, blm, dll",
    sentences: [
      {
        en: "Yg penting kita ketemu besok.",
        vi: "Cái quan trọng là mai mình gặp nhau. (yg = yang)",
        pronunciation_focus: [
          "yg = yang (cái mà / là / để nối) — viết tắt phổ biến NHẤT",
          "đọc đầy đủ là 'yang' (YANG) khi nói",
          "ketemu → ke-TE-mu = gặp (gaul của 'bertemu')",
          "viết tắt chỉ DÙNG KHI VIẾT — khi nói vẫn đọc đủ",
        ],
        pronunciation_focus_en: [
          "yg = yang (relativizer 'which/that/who') — the MOST common abbreviation",
          "read aloud as full 'yang' (YANG)",
          "ketemu → 'kuh-TUH-moo' = to meet (slang for 'bertemu')",
          "abbreviations are WRITTEN only — you still say the full word aloud",
        ],
      },
      {
        en: "Tdk apa-apa, sy blm sampai.",
        vi: "Không sao đâu, tôi chưa tới. (tdk = tidak, sy = saya, blm = belum)",
        pronunciation_focus: [
          "tdk = tidak (không)",
          "sy = saya (tôi) — chữ 'y' giữ lại để phân biệt",
          "blm = belum (chưa)",
          "apa-apa → A-pa A-pa = gì gì (từ lặp = 'sao cả')",
        ],
        pronunciation_focus_en: [
          "tdk = tidak (not)",
          "sy = saya (I) — the 'y' is kept to disambiguate",
          "blm = belum (not yet)",
          "apa-apa → reduplication = 'anything/nothing' (tdk apa-apa = it's fine)",
        ],
      },
      {
        en: "Aku mau beli buku, pulpen, dll dgn uang ini.",
        vi: "Tôi muốn mua sách, bút, v.v. bằng tiền này. (dll = dan lain-lain, dgn = dengan)",
        pronunciation_focus: [
          "dll = dan lain-lain (và những thứ khác = 'v.v.')",
          "dgn = dengan (với, bằng)",
          "pulpen → PUL-pen = bút bi",
          "uang → U-ang = tiền (hai âm tiết: u-ang)",
        ],
        pronunciation_focus_en: [
          "dll = dan lain-lain (and others = 'etc.')",
          "dgn = dengan (with/by)",
          "pulpen → 'POOL-pen' = ballpoint pen",
          "uang → 'OO-ang' = money (two syllables)",
        ],
      },
      {
        en: "Otw ya, gpp telat dikit. Makasih!",
        vi: "Đang trên đường nhé, không sao trễ chút. Cảm ơn! (otw = on the way, gpp = nggak apa-apa)",
        pronunciation_focus: [
          "otw = 'on the way' (mượn tiếng Anh, đọc 'o-te-we')",
          "gpp = nggak apa-apa (không sao)",
          "makasih = terima kasih (cảm ơn) — rút gọn thân mật",
          "dikit → DI-kit = một chút (gaul của 'sedikit')",
        ],
        pronunciation_focus_en: [
          "otw = 'on the way' (English borrowing, spoken 'oh-teh-weh')",
          "gpp = nggak apa-apa (no problem)",
          "makasih = terima kasih (thanks) — casual contraction",
          "dikit → 'DEE-kit' = a little (slang for 'sedikit')",
        ],
      },
    ],
    cultural_notes_vi:
      "Người Indonesia nhắn tin với rất nhiều viết tắt — vì tiếng Indonesia có nhiều từ dài và họ lười gõ nguyên âm. Quy tắc chung: BỎ NGUYÊN ÂM, giữ phụ âm. yang→yg, dengan→dgn, tidak→tdk, belum→blm, sudah→sdh, dengan→dgn, yang→yg, untuk→utk, karena→krn, jadi→jd, saya→sy, kamu→km, orang→org. Một số là chữ cái đầu: dll (dan lain-lain = v.v.), dst (dan seterusnya = và tiếp tục), dsb (dan sebagainya). Và nhiều từ mượn tiếng Anh viết tắt: otw (on the way), gws (get well soon), btw. QUAN TRỌNG: đây là quy ước VIẾT — khi đọc to vẫn phát âm từ đầy đủ. Đừng dùng viết tắt trong email công việc hay văn bản trang trọng.",
    cultural_notes_en:
      "Indonesians text with heavy abbreviation — many words are long and they skip vowels. General rule: DROP VOWELS, keep consonants. yang→yg, dengan→dgn, tidak→tdk, belum→blm, sudah→sdh, untuk→utk, karena→krn, jadi→jd, saya→sy, kamu→km, orang→org. Some are initialisms: dll (and so on = 'etc.'), dst (and so forth), dsb (and the like). Plus English borrowings: otw (on the way), gws (get well soon), btw. IMPORTANT: these are WRITTEN conventions — you still say the full word aloud. Don't use them in work email or formal writing.",
    tip_advice_vi:
      "Học bảng viết tắt như học mật mã — một lần thuộc là đọc chat trôi chảy. Mẹo bỏ nguyên âm: nhìn phụ âm và đoán (dgn→dengan, krn→karena). Nhưng KHI NÓI và KHI VIẾT TRANG TRỌNG, luôn dùng từ đầy đủ. 'makasih' (cảm ơn) và 'otw' thì nói được vì đã thành từ lóng quen thuộc.",
    tip_advice_en:
      "Treat the abbreviation table like a cipher — learn it once and you read chat fluently. Vowel-drop trick: look at the consonants and guess (dgn→dengan, krn→karena). But SPEAKING and FORMAL writing always use full words. 'makasih' (thanks) and 'otw' are sayable since they've become established slang.",
    vocabulary: [
      { word: "yg", en: "= yang (which/that)", vi: "= yang (cái mà)", pos: "abbrev.", pronunciation_vi: "đọc: yang", pronunciation_en: "read: yang" },
      { word: "dgn", en: "= dengan (with)", vi: "= dengan (với)", pos: "abbrev.", pronunciation_vi: "đọc: dengan", pronunciation_en: "read: dengan" },
      { word: "tdk", en: "= tidak (not)", vi: "= tidak (không)", pos: "abbrev.", pronunciation_vi: "đọc: tidak", pronunciation_en: "read: tidak" },
      { word: "blm", en: "= belum (not yet)", vi: "= belum (chưa)", pos: "abbrev.", pronunciation_vi: "đọc: belum", pronunciation_en: "read: belum" },
      { word: "sdh", en: "= sudah (already)", vi: "= sudah (rồi)", pos: "abbrev.", pronunciation_vi: "đọc: sudah", pronunciation_en: "read: sudah" },
      { word: "dll", en: "= dan lain-lain (etc.)", vi: "= v.v.", pos: "abbrev.", pronunciation_vi: "đọc: dan lain-lain", pronunciation_en: "read: dan lain-lain" },
      { word: "otw", en: "on the way", vi: "đang trên đường", pos: "abbrev.", pronunciation_vi: "o-te-we", pronunciation_en: "oh-teh-weh" },
      { word: "makasih", en: "thanks (casual)", vi: "cảm ơn (thân mật)", pos: "interjection", pronunciation_vi: "ma-KA-sih", pronunciation_en: "mah-KAH-see" },
    ],
    dialogue: [
      { speaker: "A (chat)", text: "Km dmn? Aku udh sampe nih.", vi: "Bạn ở đâu? Tôi tới rồi nè.", en: "Where are you? I've already arrived." },
      { speaker: "B (chat)", text: "Otw! Maaf telat. Tunggu 5 mnt yaa.", vi: "Đang tới! Xin lỗi trễ. Đợi 5 phút nhé.", en: "On the way! Sorry I'm late. Wait 5 minutes." },
      { speaker: "A (chat)", text: "Oke, gpp. Makasih.", vi: "Ok, không sao. Cảm ơn.", en: "Okay, no problem. Thanks." },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Giải mã viết tắt sang từ đầy đủ:",
        instruction_en: "Decode each abbreviation to its full word:",
        items: [
          { prompt: "yg", answer: "yang" },
          { prompt: "dgn", answer: "dengan" },
          { prompt: "tdk", answer: "tidak" },
          { prompt: "blm", answer: "belum" },
          { prompt: "dll", answer: "dan lain-lain" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Viết lại đầy đủ câu chat:",
        instruction_en: "Expand the chat sentence to full words:",
        items: [
          { prompt: "Aku blm sampe.", answer: "Aku belum sampai.", options: ["Aku belum sampai.", "Aku boleh sampai."] },
          { prompt: "Beli buku dll dgn uang ini.", answer: "Beli buku dan lain-lain dengan uang ini." },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 5. Social-media & Gen-Z slang
  // ──────────────────────────────────────────────────────────────────────
  {
    id: "indonesian_gaul_genz_socmed",
    level: "B1",
    category: "slang",
    title_vi: "Tiếng lóng mạng xã hội & Gen-Z",
    title_en: "Social-media & Gen-Z slang",
    sentences: [
      {
        en: "Anjir, film itu bagus banget sumpah!",
        vi: "Trời ơi, phim đó hay xuất sắc thề luôn!",
        pronunciation_focus: [
          "anjir / anjay → AN-jir = 'trời ơi/vãi' (cảm thán, bản né của 'anjing')",
          "banget → BA-nget = rất, cực (gaul của 'sangat')",
          "sumpah → SUM-pah = 'thề' (nhấn mạnh, 'thề luôn')",
          "anjir hơi thô — chỉ dùng với bạn rất thân",
        ],
        pronunciation_focus_en: [
          "anjir / anjay → 'AN-jeer' = 'omg/damn' (a softened form of 'anjing')",
          "banget → 'BAH-nget' = very/super (slang for 'sangat')",
          "sumpah → 'SOOM-pah' = 'I swear' (emphasis)",
          "anjir is mildly crude — only with very close friends",
        ],
      },
      {
        en: "Baper banget sih lu, santai aja kali.",
        vi: "Mày dễ xúc động quá đó, bình tĩnh đi mà.",
        pronunciation_focus: [
          "baper = 'bawa perasaan' = mang cảm xúc vào = dễ tự ái/xúc động",
          "santai → san-TAI = thư giãn, bình tĩnh",
          "kali → KA-li = 'chắc/đấy' (gaul, rút từ 'barangkali')",
          "baper là từ ghép viết tắt rất Gen-Z (akronim)",
        ],
        pronunciation_focus_en: [
          "baper = 'bawa perasaan' = 'bringing feelings' = oversensitive/touchy",
          "santai → 'san-TAI' = relax, chill",
          "kali → 'KAH-lee' = 'maybe/probably' (slang from 'barangkali')",
          "baper is a very Gen-Z acronym-blend word",
        ],
      },
      {
        en: "Gabut nih, mager mau ngapain juga.",
        vi: "Rảnh mà chán quá, lười chẳng muốn làm gì.",
        pronunciation_focus: [
          "gabut = 'gaji buta' = rảnh rỗi chán nản, không có việc",
          "mager = 'malas gerak' = lười nhúc nhích",
          "ngapain → nga-PA-in = làm gì (gaul)",
          "gabut & mager đều là akronim Gen-Z cực phổ biến",
        ],
        pronunciation_focus_en: [
          "gabut = 'gaji buta' = idle/bored with nothing to do",
          "mager = 'malas gerak' = too lazy to move",
          "ngapain → 'nga-PAH-in' = 'doing what' (slang)",
          "gabut & mager are hugely popular Gen-Z acronym words",
        ],
      },
    ],
    cultural_notes_vi:
      "Tiếng lóng Gen-Z Indonesia phần lớn là 'akronim' — ghép chữ đầu của một cụm: baper (bawa perasaan = mang cảm xúc), mager (malas gerak = lười di chuyển), gabut (gaji buta = rảnh chán), gercep (gerak cepat = nhanh nhẹn), bucin (budak cinta = nô lệ tình yêu), kepo (tò mò chuyện người khác), gokil (điên rồ/đỉnh), kuy (= yuk đảo ngược = 'đi thôi'). Nhiều từ lan từ Twitter/X, TikTok ra đời sống. Một số mượn tiếng Anh: spill (kể đi), insecure, healing (đi chơi xả stress). Lưu ý: 'anjir/anjay' là cảm thán phổ biến nhưng gốc là chửi thề ('anjing' = chó) nên hơi thô — đừng dùng nơi trang trọng. Tiếng lóng thay đổi RẤT nhanh; từ hot năm nay có thể lỗi thời năm sau.",
    cultural_notes_en:
      "Indonesian Gen-Z slang is largely 'akronim' — first letters of a phrase: baper (bawa perasaan = bringing feelings/oversensitive), mager (malas gerak = too lazy to move), gabut (gaji buta = idle-bored), gercep (gerak cepat = quick to act), bucin (budak cinta = love slave), kepo (nosy), gokil (crazy/awesome), kuy (= yuk reversed = 'let's go'). Many spread from Twitter/X and TikTok into daily life. Some borrow English: spill (tell us), insecure, healing (a de-stress trip). Note: 'anjir/anjay' is a common exclamation but rooted in a swear ('anjing' = dog), so it's mildly crude — avoid in formal settings. Slang changes FAST; this year's hot word may be dated next year.",
    tip_advice_vi:
      "Đừng cố nhồi nhét tất cả tiếng lóng — học để HIỂU trước, dùng sau khi đã quen môi trường. Dùng sai tiếng lóng nghe gượng hơn là nói chuẩn. An toàn nhất: hiểu khi nghe, nhưng tự mình nói baku cho tới khi thật tự tin. Tránh anjir/bucin với người mới quen.",
    tip_advice_en:
      "Don't cram every slang term — learn to UNDERSTAND first, use only once you know the scene. Misused slang sounds worse than plain standard speech. Safest: comprehend it when heard, but speak baku yourself until genuinely confident. Avoid anjir/bucin with new acquaintances.",
    vocabulary: [
      { word: "baper", en: "oversensitive (bawa perasaan)", vi: "dễ xúc động/tự ái", pos: "adjective", pronunciation_vi: "BA-per", pronunciation_en: "BAH-per" },
      { word: "mager", en: "too lazy to move (malas gerak)", vi: "lười nhúc nhích", pos: "adjective", pronunciation_vi: "MA-ger", pronunciation_en: "MAH-ger" },
      { word: "gabut", en: "idle and bored (gaji buta)", vi: "rảnh chán", pos: "adjective", pronunciation_vi: "GA-but", pronunciation_en: "GAH-boot" },
      { word: "kepo", en: "nosy, overly curious", vi: "tò mò chuyện người", pos: "adjective", pronunciation_vi: "KE-po", pronunciation_en: "KEH-poh" },
      { word: "gokil", en: "crazy, awesome", vi: "điên rồ, đỉnh", pos: "adjective", pronunciation_vi: "GO-kil", pronunciation_en: "GOH-kil" },
      { word: "bucin", en: "love-obsessed (budak cinta)", vi: "nô lệ tình yêu", pos: "noun", pronunciation_vi: "BU-cin", pronunciation_en: "BOO-chin" },
      { word: "kuy", en: "let's go (yuk reversed)", vi: "đi thôi", pos: "interjection", pronunciation_vi: "KUY", pronunciation_en: "KOO-ee" },
      { word: "santai", en: "relax, chill", vi: "thư giãn, bình tĩnh", pos: "adjective", pronunciation_vi: "san-TAI", pronunciation_en: "san-TAI" },
    ],
    dialogue: [
      { speaker: "Sari", text: "Gabut banget nih, mager keluar. Lu ngapain?", vi: "Rảnh chán quá, lười ra ngoài. Mày làm gì đó?", en: "So bored, too lazy to go out. What're you up to?" },
      { speaker: "Tia", text: "Sama. Kuy nonton aja di rumah gue.", vi: "Giống vậy. Đi, qua nhà tao xem phim thôi.", en: "Same. Let's just watch something at my place." },
      { speaker: "Sari", text: "Gokil, gercep dong. Otw!", vi: "Đỉnh, nhanh lên nào. Đang tới!", en: "Awesome, quick then. On the way!" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ lóng với nghĩa đầy đủ:",
        instruction_en: "Match each slang word to its full meaning:",
        items: [
          { prompt: "mager", answer: "malas gerak (lười di chuyển)" },
          { prompt: "baper", answer: "bawa perasaan (dễ xúc động)" },
          { prompt: "gabut", answer: "gaji buta (rảnh chán)" },
          { prompt: "kuy", answer: "yuk (đi thôi)" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ lóng hợp ngữ cảnh:",
        instruction_en: "Fill the slang word that fits:",
        items: [
          { prompt: "Aku ___ banget, gak mau gerak. (lười)", answer: "mager", options: ["mager", "santai", "kepo"] },
          { prompt: "Jangan ___ deh, itu cuma bercanda. (dễ tự ái)", answer: "baper", options: ["baper", "gokil", "kuy"] },
        ],
      },
    ],
  },
];

export default lessons;
