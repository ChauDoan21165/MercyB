// src/languages/indonesian/extra/sinetron-culture.ts
//
// Indonesian TV-drama & entertainment pack for Vietnamese learners.
// Covers: the sinetron (daily soap) and FTV/film world, celebrity gossip and
// the gossip-show register (gosip, infotainment, selebriti), and how to talk
// about plots, characters and variety shows with friends. Hand-crafted, no filler.
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
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields (fill_blank, matching, translation) vary.
type Exercise = Record<string, any>;

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

export const sinetronCultureLessons: IndonesianLesson[] = [
  {
    id: "indonesian_ent_sinetron_basics",
    level: "A1",
    category: "entertainment",
    title_vi: "Sinetron — phim truyền hình dài tập Indonesia",
    title_en: "Sinetron — Indonesian TV soap operas",
    sentences: [
      {
        en: "Setiap malam saya menonton sinetron di televisi.",
        vi: "Mỗi tối tôi xem phim truyền hình trên ti vi.",
        pronunciation_focus: [
          "menonton → me-NON-ton, 'xem' (gốc tonton)",
          "sinetron → si-ne-TRON, phim truyền hình dài tập (sinema elektronik)",
          "setiap malam → 'mỗi tối' (setiap = mỗi, malam = tối)",
        ],
        pronunciation_focus_en: [
          "menonton → 'me-NON-ton' — to watch (root 'tonton')",
          "sinetron → 'see-ne-TRON' — TV soap (from 'sinema elektronik')",
          "setiap malam → 'every night' (setiap = every, malam = night)",
        ],
      },
      {
        en: "Sinetron ini sudah sampai episode seratus.",
        vi: "Phim này đã đến tập một trăm rồi.",
        pronunciation_focus: [
          "episode → e-pi-SO-de, 'tập' (mượn tiếng Anh)",
          "sudah sampai → 'đã đến/tới' (sudah = đã/rồi)",
          "seratus → se-RA-tus, 'một trăm'",
        ],
        pronunciation_focus_en: [
          "episode → 'e-pee-SOH-de' — episode (loanword)",
          "sudah sampai → 'has reached' (sudah = already)",
          "seratus → 'se-RA-toos' — one hundred",
        ],
      },
      {
        en: "Pemeran utamanya cantik sekali.",
        vi: "Nữ diễn viên chính đẹp lắm.",
        pronunciation_focus: [
          "pemeran → pe-me-RAN, 'diễn viên/người đóng vai'",
          "utama → u-TA-ma, 'chính/chủ yếu'; pemeran utama = vai chính",
          "cantik → CHAN-tik, 'đẹp/xinh' (cho nữ)",
        ],
        pronunciation_focus_en: [
          "pemeran → 'pe-me-RAN' — actor / role-player",
          "utama → 'oo-TA-ma' — main; pemeran utama = lead actor",
          "cantik → 'CHAN-teek' — pretty/beautiful (of women)",
        ],
      },
      {
        en: "Ceritanya tentang keluarga kaya dan keluarga miskin.",
        vi: "Câu chuyện kể về một nhà giàu và một nhà nghèo.",
        pronunciation_focus: [
          "cerita → che-RI-ta, 'câu chuyện/cốt truyện'",
          "kaya → KA-ya, 'giàu'; miskin = nghèo",
          "tentang → ten-TANG, 'về (chủ đề)'",
        ],
        pronunciation_focus_en: [
          "cerita → 'che-REE-ta' — story / plot",
          "kaya → 'KA-ya' — rich; miskin = poor",
          "tentang → 'ten-TANG' — about",
        ],
      },
      {
        en: "Saya tidak suka tokoh yang jahat itu.",
        vi: "Tôi không thích nhân vật phản diện đó.",
        pronunciation_focus: [
          "tokoh → TO-koh, 'nhân vật'",
          "jahat → JA-hat, 'ác/xấu xa'; ngược baik = tốt",
          "tidak suka → 'không thích' (tidak phủ định động/tính từ)",
        ],
        pronunciation_focus_en: [
          "tokoh → 'TOH-koh' — character",
          "jahat → 'JA-hat' — evil/wicked; opposite 'baik' = good",
          "tidak suka → 'don't like' (tidak negates verbs/adjectives)",
        ],
      },
    ],
    cultural_notes_vi:
      "'SINETRON' (sinema elektronik) là phim truyền hình dài tập phát hằng ngày — trụ cột giải trí của truyền hình Indonesia, chiếu vào giờ vàng ('prime time') trên RCTI, SCTV, Indosiar. Cốt truyện ('cerita') thường rất kịch tính, kéo dài hàng trăm tập, xoay quanh nhà giàu vs nhà nghèo, tình yêu, âm mưu, người tốt ('protagonis') và kẻ ác ('antagonis'). Một số sinetron nổi tiếng: 'Tukang Bubur Naik Haji', 'Ikatan Cinta'. Khác với sinetron, 'FTV' (Film Televisi) là phim lẻ một tập, thường nhẹ nhàng, lãng mạn. Người Indonesia hay bàn tán diễn biến sinetron như một thú vui xã giao.",
    cultural_notes_en:
      "'SINETRON' (from 'sinema elektronik') is the daily TV soap — the backbone of Indonesian TV entertainment, aired in prime time on RCTI, SCTV, Indosiar. The 'cerita' (plot) is usually highly dramatic, running hundreds of episodes around rich-vs-poor families, romance, scheming, the good guy ('protagonis') and the villain ('antagonis'). Famous ones include 'Tukang Bubur Naik Haji' and 'Ikatan Cinta'. Unlike a sinetron, an 'FTV' (Film Televisi) is a one-off TV movie, usually light and romantic. Indonesians love chatting about sinetron plots as a social pastime.",
    tip_advice_vi:
      "Mẹo cho người Việt: 'menonton' (xem) dùng cho phim/TV, khác 'melihat' (nhìn/thấy) và 'membaca' (đọc) — cùng tiền tố me-. Cặp đối nghĩa hay gặp trong sinetron: kaya (giàu) ↔ miskin (nghèo), baik (tốt) ↔ jahat (ác), cantik (đẹp, nữ) ↔ ganteng (đẹp trai, nam). 'Pemeran utama' = vai chính; 'tokoh' = nhân vật. Đừng nhầm 'cerita' (câu chuyện/cốt truyện) với 'berita' (tin tức) — chỉ khác một chữ! Phủ định bằng 'tidak' cho động/tính từ ('tidak suka' = không thích).",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'menonton' (watch) is for film/TV, distinct from 'melihat' (look/see) and 'membaca' (read) — all 'me-' verbs. Common sinetron antonyms: kaya (rich) ↔ miskin (poor), baik (good) ↔ jahat (evil), cantik (pretty, women) ↔ ganteng (handsome, men). 'Pemeran utama' = lead role; 'tokoh' = character. Don't confuse 'cerita' (story/plot) with 'berita' (news) — one letter apart! Negate with 'tidak' for verbs/adjectives ('tidak suka' = don't like).",
    vocabulary: [
      { word: "sinetron", en: "TV soap opera", vi: "phim truyền hình dài tập", pos: "noun", pronunciation_vi: "si-ne-TRON", pronunciation_en: "see-ne-TRON" },
      { word: "menonton", en: "to watch", vi: "xem", pos: "verb", pronunciation_vi: "me-NON-ton", pronunciation_en: "me-NON-ton" },
      { word: "episode", en: "episode", vi: "tập", pos: "noun", pronunciation_vi: "e-pi-SO-de", pronunciation_en: "e-pee-SOH-de" },
      { word: "pemeran utama", en: "lead actor / main role", vi: "vai chính / diễn viên chính", pos: "noun", pronunciation_vi: "pe-me-RAN u-TA-ma", pronunciation_en: "pe-me-RAN oo-TA-ma" },
      { word: "tokoh", en: "character", vi: "nhân vật", pos: "noun", pronunciation_vi: "TO-koh", pronunciation_en: "TOH-koh" },
      { word: "cerita", en: "story / plot", vi: "câu chuyện / cốt truyện", pos: "noun", pronunciation_vi: "che-RI-ta", pronunciation_en: "che-REE-ta" },
      { word: "jahat", en: "evil / wicked", vi: "ác / xấu xa", pos: "adj.", pronunciation_vi: "JA-hat", pronunciation_en: "JA-hat" },
      { word: "kaya", en: "rich", vi: "giàu", pos: "adj.", pronunciation_vi: "KA-ya", pronunciation_en: "KA-ya" },
      { word: "miskin", en: "poor", vi: "nghèo", pos: "adj.", pronunciation_vi: "MIS-kin", pronunciation_en: "MEES-keen" },
    ],
    dialogue: [
      { speaker: "Ani", text: "Tadi malam kamu menonton sinetron yang di RCTI?", vi: "Tối qua cậu có xem phim trên RCTI không?", en: "Did you watch the sinetron on RCTI last night?" },
      { speaker: "Budi", text: "Nonton dong. Sudah sampai episode seratus, lho. Ceritanya makin seru.", vi: "Xem chứ. Đã đến tập một trăm rồi đấy. Cốt truyện càng lúc càng cuốn.", en: "Of course. It's reached episode one hundred. The plot's getting more exciting." },
      { speaker: "Ani", text: "Iya, tapi aku tidak suka tokoh yang jahat itu. Bikin kesal.", vi: "Ừ, nhưng tớ không thích nhân vật phản diện đó. Bực mình ghê.", en: "Yeah, but I don't like that villain. So annoying." },
      { speaker: "Budi", text: "Sama. Untung pemeran utamanya baik dan cantik.", vi: "Giống tớ. May là vai chính tốt bụng và xinh.", en: "Same. Luckily the lead is kind and pretty." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về phim truyền hình còn thiếu:",
        instruction_en: "Fill in the missing TV-drama word:",
        items: [
          { prompt: "Setiap malam saya ___ sinetron di televisi. (xem)", answer: "menonton", options: ["menonton", "menulis", "membaca"] },
          { prompt: "___ ini sudah sampai episode seratus. (phim dài tập)", answer: "Sinetron", options: ["Sinetron", "Sumber", "Sepatu"] },
          { prompt: "Saya tidak suka tokoh yang ___ itu. (ác)", answer: "jahat", options: ["jahat", "jauh", "jalan"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "sinetron", answer: "phim truyền hình dài tập" },
          { prompt: "tokoh", answer: "nhân vật" },
          { prompt: "cerita", answer: "câu chuyện / cốt truyện" },
          { prompt: "kaya", answer: "giàu" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Mỗi tối tôi xem phim truyền hình trên ti vi.", answer: "Setiap malam saya menonton sinetron di televisi." },
          { prompt: "Câu chuyện kể về một nhà giàu và một nhà nghèo.", answer: "Ceritanya tentang keluarga kaya dan keluarga miskin." },
          { prompt: "Tôi không thích nhân vật phản diện đó.", answer: "Saya tidak suka tokoh yang jahat itu." },
        ],
      },
    ],
  },
  {
    id: "indonesian_ent_gosip_selebriti",
    level: "A2",
    category: "entertainment",
    title_vi: "Gosip nghệ sĩ — chuyện hậu trường và showbiz",
    title_en: "Celebrity gossip — showbiz news and chatter",
    sentences: [
      {
        en: "Katanya artis itu mau menikah bulan depan.",
        vi: "Nghe nói nghệ sĩ đó sắp cưới vào tháng sau.",
        pronunciation_focus: [
          "katanya → KA-ta-nya, 'nghe nói/người ta nói' (mở đầu tin đồn)",
          "artis → AR-tis, 'nghệ sĩ/ngôi sao'",
          "menikah → me-NI-kah, 'kết hôn/cưới'",
        ],
        pronunciation_focus_en: [
          "katanya → 'KA-ta-nya' — they say / reportedly (opens a rumor)",
          "artis → 'AR-tees' — celebrity / star",
          "menikah → 'me-NEE-kah' — to get married",
        ],
      },
      {
        en: "Berita gosip itu belum tentu benar.",
        vi: "Tin đồn đó chưa chắc đã đúng.",
        pronunciation_focus: [
          "gosip → GO-sip, 'chuyện tầm phào/tin đồn'",
          "belum tentu → 'chưa chắc' (belum = chưa, tentu = chắc chắn)",
          "benar → be-NAR, 'đúng/thật'",
        ],
        pronunciation_focus_en: [
          "gosip → 'GOH-seep' — gossip (loanword)",
          "belum tentu → 'not necessarily / not sure yet'",
          "benar → 'be-NAR' — true / correct",
        ],
      },
      {
        en: "Mereka katanya sudah putus sejak tahun lalu.",
        vi: "Nghe nói họ đã chia tay từ năm ngoái.",
        pronunciation_focus: [
          "mereka → me-RE-ka, 'họ/bọn họ'",
          "putus → PU-tus, 'chia tay/đứt' (quan hệ)",
          "sejak → SE-jak, 'từ (khi)'; tahun lalu = năm ngoái",
        ],
        pronunciation_focus_en: [
          "mereka → 'me-REH-ka' — they / them",
          "putus → 'POO-toos' — to break up (a relationship)",
          "sejak → 'SE-jak' — since; tahun lalu = last year",
        ],
      },
      {
        en: "Acara infotainment selalu membahas kehidupan selebriti.",
        vi: "Chương trình showbiz luôn bàn về đời sống nghệ sĩ.",
        pronunciation_focus: [
          "acara → a-CHA-ra, 'chương trình/sự kiện'",
          "membahas → mem-BA-has, 'bàn luận/thảo luận'",
          "kehidupan → ke-hi-DU-pan, 'đời sống' (gốc hidup = sống)",
        ],
        pronunciation_focus_en: [
          "acara → 'a-CHA-ra' — show / program / event",
          "membahas → 'mem-BA-has' — to discuss",
          "kehidupan → 'ke-hee-DOO-pan' — life (root 'hidup' = to live)",
        ],
      },
      {
        en: "Jangan percaya gosip kalau belum ada bukti.",
        vi: "Đừng tin tin đồn khi chưa có bằng chứng.",
        pronunciation_focus: [
          "jangan percaya → 'đừng tin' (jangan = đừng)",
          "kalau → KA-lau, 'nếu/khi'",
          "bukti → BUK-ti, 'bằng chứng'",
        ],
        pronunciation_focus_en: [
          "jangan percaya → 'don't believe' (jangan = don't)",
          "kalau → 'KA-lau' — if / when",
          "bukti → 'BOOK-tee' — proof / evidence",
        ],
      },
    ],
    cultural_notes_vi:
      "Showbiz Indonesia có ngành 'infotainment' (chương trình tin tức giải trí) rất phát triển — như 'Insert', 'Silet', 'Hot Shot' — chuyên đưa tin về 'artis' (nghệ sĩ) và 'selebriti'. Từ vựng gosip thường gặp: 'menikah' (cưới), 'cerai' (ly hôn), 'putus' (chia tay), 'pacar' (người yêu), 'mantan' (người cũ), 'gebetan' (đối tượng đang theo đuổi). Mở đầu một tin đồn bằng 'katanya…' (nghe nói…) hay 'denger-denger…' (nghe phong thanh…). Người Indonesia thích buôn chuyện ('ngegosip') nhưng cũng cẩn trọng: 'belum tentu benar' (chưa chắc đúng) và 'jangan percaya kalau belum ada bukti' (đừng tin khi chưa có bằng chứng).",
    cultural_notes_en:
      "Indonesian showbiz has a thriving 'infotainment' genre (entertainment-news shows) — like 'Insert', 'Silet', 'Hot Shot' — covering 'artis' (celebrities) and 'selebriti'. Common gossip vocabulary: 'menikah' (marry), 'cerai' (divorce), 'putus' (break up), 'pacar' (boy/girlfriend), 'mantan' (ex), 'gebetan' (a crush you're pursuing). A rumor opens with 'katanya…' (they say…) or 'denger-denger…' (I heard…). Indonesians love to gossip ('ngegosip') but also hedge: 'belum tentu benar' (not necessarily true) and 'jangan percaya kalau belum ada bukti' (don't believe it without proof).",
    tip_advice_vi:
      "Mẹo cho người Việt: 'katanya' = 'nghe nói/người ta nói' — dấu hiệu báo đây là tin chưa kiểm chứng, dùng đầu câu. Hậu tố '-nya' rất linh hoạt: kata (lời nói) + nya → katanya (lời người ta nói). Cặp tình cảm: pacaran (yêu nhau) → menikah (cưới) → cerai (ly hôn); hoặc putus (chia tay). 'Mantan' = người yêu/vợ/chồng cũ (rút từ 'mantan pacar'). Phân biệt phủ định: 'tidak' (không, cho động/tính từ) vs 'belum' (chưa, việc có thể xảy ra sau) vs 'bukan' (không phải, cho danh từ). 'Belum tentu' = chưa chắc — cụm cố định hữu ích.",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'katanya' = 'they say / reportedly' — flags unverified info, used sentence-initially. The '-nya' suffix is versatile: kata (word) + nya → katanya (what people say). Relationship arc: pacaran (dating) → menikah (marry) → cerai (divorce); or putus (break up). 'Mantan' = an ex (short for 'mantan pacar'). Distinguish the negators: 'tidak' (not, for verbs/adjectives) vs 'belum' (not yet, may still happen) vs 'bukan' (not, for nouns). 'Belum tentu' = not necessarily — a handy fixed phrase.",
    vocabulary: [
      { word: "artis", en: "celebrity / star", vi: "nghệ sĩ / ngôi sao", pos: "noun", pronunciation_vi: "AR-tis", pronunciation_en: "AR-tees" },
      { word: "selebriti", en: "celebrity", vi: "người nổi tiếng", pos: "noun", pronunciation_vi: "se-le-BRI-ti", pronunciation_en: "se-le-BREE-tee" },
      { word: "gosip", en: "gossip / rumor", vi: "tin đồn / chuyện tầm phào", pos: "noun", pronunciation_vi: "GO-sip", pronunciation_en: "GOH-seep" },
      { word: "katanya", en: "they say / reportedly", vi: "nghe nói", pos: "expr.", pronunciation_vi: "KA-ta-nya", pronunciation_en: "KA-ta-nya" },
      { word: "menikah", en: "to get married", vi: "kết hôn / cưới", pos: "verb", pronunciation_vi: "me-NI-kah", pronunciation_en: "me-NEE-kah" },
      { word: "putus", en: "to break up", vi: "chia tay", pos: "verb", pronunciation_vi: "PU-tus", pronunciation_en: "POO-toos" },
      { word: "mantan", en: "ex (partner)", vi: "người yêu cũ", pos: "noun", pronunciation_vi: "MAN-tan", pronunciation_en: "MAN-tan" },
      { word: "infotainment", en: "entertainment-news show", vi: "chương trình tin giải trí", pos: "noun", pronunciation_vi: "in-fo-TEN-men", pronunciation_en: "in-fo-TAIN-ment" },
      { word: "bukti", en: "proof / evidence", vi: "bằng chứng", pos: "noun", pronunciation_vi: "BUK-ti", pronunciation_en: "BOOK-tee" },
    ],
    dialogue: [
      { speaker: "Lia", text: "Eh, katanya artis itu mau menikah bulan depan, lho!", vi: "Này, nghe nói nghệ sĩ đó sắp cưới tháng sau đấy!", en: "Hey, they say that celeb is getting married next month!" },
      { speaker: "Tio", text: "Masa? Bukannya mereka sudah putus sejak tahun lalu?", vi: "Thật á? Chẳng phải họ đã chia tay từ năm ngoái rồi sao?", en: "Really? Didn't they break up last year?" },
      { speaker: "Lia", text: "Itu kata acara infotainment tadi pagi. Tapi belum tentu benar, sih.", vi: "Đó là theo chương trình showbiz sáng nay. Nhưng chưa chắc đúng đâu.", en: "That's what the infotainment show said this morning. But it's not necessarily true." },
      { speaker: "Tio", text: "Nah, makanya. Jangan percaya gosip kalau belum ada bukti.", vi: "Đấy, vậy mới nói. Đừng tin tin đồn khi chưa có bằng chứng.", en: "Right, exactly. Don't believe gossip without proof." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về gosip nghệ sĩ còn thiếu:",
        instruction_en: "Fill in the missing gossip word:",
        items: [
          { prompt: "___ artis itu mau menikah bulan depan. (nghe nói)", answer: "Katanya", options: ["Katanya", "Karena", "Kapan"] },
          { prompt: "Berita ___ itu belum tentu benar. (tin đồn)", answer: "gosip", options: ["gosip", "gaji", "gula"] },
          { prompt: "Jangan percaya gosip kalau belum ada ___. (bằng chứng)", answer: "bukti", options: ["bukti", "buku", "bulan"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "artis", answer: "nghệ sĩ / ngôi sao" },
          { prompt: "gosip", answer: "tin đồn" },
          { prompt: "menikah", answer: "kết hôn" },
          { prompt: "mantan", answer: "người yêu cũ" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Nghe nói nghệ sĩ đó sắp cưới vào tháng sau.", answer: "Katanya artis itu mau menikah bulan depan." },
          { prompt: "Tin đồn đó chưa chắc đã đúng.", answer: "Berita gosip itu belum tentu benar." },
          { prompt: "Đừng tin tin đồn khi chưa có bằng chứng.", answer: "Jangan percaya gosip kalau belum ada bukti." },
        ],
      },
    ],
  },
  {
    id: "indonesian_ent_discussing_plots",
    level: "B1",
    category: "entertainment",
    title_vi: "Bàn về cốt truyện và phim — chê khen có ý",
    title_en: "Discussing plots and shows — opinions with nuance",
    sentences: [
      {
        en: "Menurutku alur ceritanya terlalu dipanjang-panjangkan.",
        vi: "Theo tớ cốt truyện bị kéo dài lê thê quá.",
        pronunciation_focus: [
          "alur cerita → 'mạch/cốt truyện' (alur = dòng chảy)",
          "terlalu → ter-LA-lu, 'quá/quá mức'",
          "dipanjang-panjangkan → 'bị kéo dài lê thê' (từ láy + bị động di-…-kan)",
        ],
        pronunciation_focus_en: [
          "alur cerita → 'plot / storyline' (alur = flow)",
          "terlalu → 'ter-LA-loo' — too / excessively",
          "dipanjang-panjangkan → 'dragged out' (reduplication + passive di-…-kan)",
        ],
      },
      {
        en: "Akting pemainnya bagus, tapi endingnya mengecewakan.",
        vi: "Diễn xuất của diễn viên tốt, nhưng cái kết gây thất vọng.",
        pronunciation_focus: [
          "akting → AK-ting, 'diễn xuất' (mượn 'acting')",
          "pemain → pe-MAIN, 'diễn viên/người chơi'",
          "mengecewakan → me-nge-che-WA-kan, 'gây thất vọng' (gốc kecewa)",
        ],
        pronunciation_focus_en: [
          "akting → 'AK-teeng' — acting (loanword)",
          "pemain → 'pe-MAIN' — actor / player",
          "mengecewakan → 'me-nge-che-WA-kan' — disappointing (root 'kecewa')",
        ],
      },
      {
        en: "Aku penasaran bagaimana kelanjutan kisahnya.",
        vi: "Tớ tò mò không biết câu chuyện sẽ tiếp diễn ra sao.",
        pronunciation_focus: [
          "penasaran → pe-na-SA-ran, 'tò mò/sốt ruột muốn biết'",
          "kelanjutan → ke-lan-JU-tan, 'phần tiếp/diễn tiến' (gốc lanjut)",
          "kisah → KI-sah, 'câu chuyện' (đồng nghĩa cerita)",
        ],
        pronunciation_focus_en: [
          "penasaran → 'pe-na-SA-ran' — curious / dying to know",
          "kelanjutan → 'ke-lan-JOO-tan' — continuation (root 'lanjut')",
          "kisah → 'KEE-sah' — tale / story (synonym of cerita)",
        ],
      },
      {
        en: "Film ini lebih bagus daripada yang sebelumnya.",
        vi: "Phim này hay hơn phim trước.",
        pronunciation_focus: [
          "lebih … daripada → 'hơn' (so sánh hơn: lebih bagus daripada = hay hơn so với)",
          "bagus → BA-gus, 'hay/tốt/đẹp'",
          "sebelumnya → se-be-LUM-nya, 'trước đó/cái trước'",
        ],
        pronunciation_focus_en: [
          "lebih … daripada → 'more … than' (comparative)",
          "bagus → 'BA-goos' — good / nice",
          "sebelumnya → 'se-be-LOOM-nya' — the previous one / before",
        ],
      },
      {
        en: "Sebenarnya jalan ceritanya bisa lebih singkat.",
        vi: "Thật ra mạch truyện có thể ngắn gọn hơn.",
        pronunciation_focus: [
          "sebenarnya → se-be-NAR-nya, 'thật ra/thực ra'",
          "jalan cerita → 'mạch truyện/diễn tiến' (đồng nghĩa alur)",
          "singkat → SING-kat, 'ngắn gọn/súc tích'",
        ],
        pronunciation_focus_en: [
          "sebenarnya → 'se-be-NAR-nya' — actually / in fact",
          "jalan cerita → 'storyline' (synonym of alur)",
          "singkat → 'SEENG-kat' — short / concise",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi bàn phim ('film'), sinetron hay phim chiếu rạp ('bioskop'), người Indonesia dùng các từ phê bình quen thuộc: 'alur cerita' / 'jalan cerita' (mạch truyện), 'akting' (diễn xuất), 'ending' (cái kết), 'plot twist' (nút thắt bất ngờ — mượn nguyên). Một lời chê sinetron rất phổ biến là 'dipanjang-panjangkan' — kéo dài lê thê để câu tập. Khen thì 'seru' (cuốn/gay cấn), 'bagus' (hay), 'menyentuh' (cảm động); chê thì 'membosankan' (chán), 'mengecewakan' (thất vọng), 'lebay' (cường điệu lố). Phim Indonesia chiếu rạp ngày càng được khen, nhất là dòng kinh dị ('horor') như 'Pengabdi Setan' và phim chuyển thể văn học.",
    cultural_notes_en:
      "When discussing a 'film', a sinetron, or a cinema movie ('bioskop'), Indonesians use familiar critique words: 'alur cerita' / 'jalan cerita' (storyline), 'akting' (acting), 'ending', 'plot twist' (borrowed wholesale). A very common complaint about sinetron is 'dipanjang-panjangkan' — dragged out to milk episodes. Praise: 'seru' (gripping), 'bagus' (good), 'menyentuh' (touching); criticism: 'membosankan' (boring), 'mengecewakan' (disappointing), 'lebay' (over-the-top). Indonesian cinema is increasingly acclaimed, especially horror ('horor') like 'Pengabdi Setan' and literary adaptations.",
    tip_advice_vi:
      "Mẹo cho người Việt: so sánh hơn dùng 'lebih X daripada Y' = 'X hơn Y' ('lebih bagus daripada' = hay hơn so với). Đừng quên 'daripada' (so với), khác 'dari' (từ). Hậu tố '-nya' biến tính từ/động từ thành danh từ hoặc 'cái đó': ending → endingnya (cái kết của nó), lanjut → kelanjutannya (phần tiếp của nó). 'Sebenarnya' và 'sebenernya' (khẩu ngữ) = thật ra — mở đầu khi nêu quan điểm thẳng thắn nhẹ. Cấu trúc bị động láy 'di-…-kan' với từ láy ('dipanjang-panjangkan') diễn tả hành động lặp/quá mức — rất Indonesia, đáng học để nghe tự nhiên.",
    tip_advice_en:
      "Tip for Vietnamese speakers: the comparative is 'lebih X daripada Y' = 'more X than Y' ('lebih bagus daripada' = better than). Don't forget 'daripada' (than), distinct from 'dari' (from). The '-nya' suffix nominalizes or means 'that one's': ending → endingnya (its ending), lanjut → kelanjutannya (its continuation). 'Sebenarnya' (colloquial 'sebenernya') = actually — opens a gently candid opinion. The reduplicated passive 'di-…-kan' with a doubled root ('dipanjang-panjangkan') conveys a repeated/excessive action — very Indonesian, worth learning to sound natural.",
    vocabulary: [
      { word: "alur cerita", en: "plot / storyline", vi: "cốt truyện / mạch truyện", pos: "noun", pronunciation_vi: "A-lur che-RI-ta", pronunciation_en: "A-loor che-REE-ta" },
      { word: "akting", en: "acting", vi: "diễn xuất", pos: "noun", pronunciation_vi: "AK-ting", pronunciation_en: "AK-teeng" },
      { word: "pemain", en: "actor / player", vi: "diễn viên", pos: "noun", pronunciation_vi: "pe-MAIN", pronunciation_en: "pe-MAIN" },
      { word: "ending", en: "ending", vi: "cái kết", pos: "noun", pronunciation_vi: "EN-ding", pronunciation_en: "EN-deeng" },
      { word: "mengecewakan", en: "disappointing", vi: "gây thất vọng", pos: "adj./verb", pronunciation_vi: "me-nge-che-WA-kan", pronunciation_en: "me-nge-che-WA-kan" },
      { word: "penasaran", en: "curious / eager to know", vi: "tò mò", pos: "adj.", pronunciation_vi: "pe-na-SA-ran", pronunciation_en: "pe-na-SA-ran" },
      { word: "seru", en: "exciting / gripping", vi: "cuốn / gay cấn", pos: "adj.", pronunciation_vi: "SE-ru", pronunciation_en: "SE-roo" },
      { word: "membosankan", en: "boring", vi: "chán / nhàm", pos: "adj.", pronunciation_vi: "mem-bo-SAN-kan", pronunciation_en: "mem-bo-SAN-kan" },
      { word: "sebenarnya", en: "actually / in fact", vi: "thật ra", pos: "adv.", pronunciation_vi: "se-be-NAR-nya", pronunciation_en: "se-be-NAR-nya" },
    ],
    dialogue: [
      { speaker: "Nina", text: "Gimana menurutmu film yang kita tonton kemarin?", vi: "Cậu thấy bộ phim bọn mình xem hôm qua thế nào?", en: "What did you think of the film we watched yesterday?" },
      { speaker: "Reza", text: "Aktingnya bagus, tapi menurutku alurnya terlalu dipanjang-panjangkan.", vi: "Diễn xuất hay, nhưng theo tớ mạch truyện bị kéo dài lê thê quá.", en: "The acting was good, but I think the plot was dragged out too much." },
      { speaker: "Nina", text: "Setuju. Endingnya juga agak mengecewakan. Sebenarnya bisa lebih singkat.", vi: "Đồng ý. Cái kết cũng hơi thất vọng. Thật ra có thể ngắn gọn hơn.", en: "Agreed. The ending was a bit disappointing too. It could honestly be shorter." },
      { speaker: "Reza", text: "Tapi aku penasaran sama kelanjutannya. Katanya bakal ada season dua.", vi: "Nhưng tớ tò mò phần tiếp theo. Nghe nói sẽ có mùa hai.", en: "But I'm curious about the continuation. They say there'll be a season two." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về bàn luận phim còn thiếu:",
        instruction_en: "Fill in the missing film-discussion word:",
        items: [
          { prompt: "Menurutku ___ ceritanya terlalu dipanjang-panjangkan. (mạch/cốt)", answer: "alur", options: ["alur", "akting", "artis"] },
          { prompt: "Aktingnya bagus, tapi endingnya ___. (gây thất vọng)", answer: "mengecewakan", options: ["mengecewakan", "menonton", "menikah"] },
          { prompt: "Film ini lebih bagus ___ yang sebelumnya. (so với/hơn)", answer: "daripada", options: ["daripada", "dari", "karena"] },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "alur cerita", answer: "cốt truyện / mạch truyện" },
          { prompt: "akting", answer: "diễn xuất" },
          { prompt: "seru", answer: "cuốn / gay cấn" },
          { prompt: "membosankan", answer: "chán / nhàm" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Diễn xuất của diễn viên tốt, nhưng cái kết gây thất vọng.", answer: "Akting pemainnya bagus, tapi endingnya mengecewakan." },
          { prompt: "Phim này hay hơn phim trước.", answer: "Film ini lebih bagus daripada yang sebelumnya." },
          { prompt: "Thật ra mạch truyện có thể ngắn gọn hơn.", answer: "Sebenarnya jalan ceritanya bisa lebih singkat." },
        ],
      },
    ],
  },
];

export default sinetronCultureLessons;
