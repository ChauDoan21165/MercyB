// src/languages/indonesian/extra/music-entertainment.ts
//
// Indonesian music & entertainment pack for Vietnamese learners.
// Covers: music genres (dangdut, pop Indonesia) and listening, going out
// (bioskop / film, konser, karaoke), and discussing tastes in music and movies.
// Hand-crafted, no filler.
//
// Shape mirrors the named template src/languages/portuguese/lessons-a1.ts so the
// page UI stays consistent across language verticals. The types are defined
// inline because the per-file shapes diverge slightly between authoring waves —
// this file is self-contained on purpose. Types are NOT exported and the lesson
// array uses a unique name so a future barrel `export *` cannot collide with the
// sibling extra packs.
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

export const musicEntertainmentLessons: IndonesianLesson[] = [
  {
    id: "indonesian_music_genres_listening",
    level: "A1",
    category: "entertainment",
    title_vi: "Âm nhạc — thể loại và nghe nhạc",
    title_en: "Music — genres and listening",
    sentences: [
      {
        en: "Saya suka mendengarkan musik setiap hari.",
        vi: "Tôi thích nghe nhạc mỗi ngày.",
        pronunciation_focus: [
          "suka → SU-ka, 'thích'",
          "mendengarkan → 'nghe (chăm chú)' (gốc dengar + meN-…-kan)",
          "setiap hari → 'mỗi ngày' (setiap = mỗi)",
        ],
        pronunciation_focus_en: [
          "suka → 'SOO-ka' — to like",
          "mendengarkan → 'to listen to' (root 'dengar' + 'meN-…-kan')",
          "setiap hari → 'every day' (setiap = each)",
        ],
      },
      {
        en: "Lagu ini enak didengar.",
        vi: "Bài hát này nghe hay/dễ chịu.",
        pronunciation_focus: [
          "lagu → LA-gu, 'bài hát'",
          "enak → É-nak, 'ngon/dễ chịu'; 'enak didengar' = nghe hay",
          "didengar → 'được nghe' (dạng bị động di- + dengar)",
        ],
        pronunciation_focus_en: [
          "lagu → 'LA-goo' — song",
          "enak → 'EH-nak' — tasty/pleasant; 'enak didengar' = pleasant to hear",
          "didengar → 'be heard' (passive 'di-' + dengar)",
        ],
      },
      {
        en: "Penyanyi itu sangat terkenal di Indonesia.",
        vi: "Ca sĩ đó rất nổi tiếng ở Indonesia.",
        pronunciation_focus: [
          "penyanyi → peu-NYA-nyi, 'ca sĩ' (gốc nyanyi = hát + pe-)",
          "itu → I-tu, 'đó/ấy' (chỉ vật ở xa)",
          "terkenal → ter-keu-NAL, 'nổi tiếng'",
        ],
        pronunciation_focus_en: [
          "penyanyi → 'pe-NYA-nyee' — singer (root 'nyanyi' = to sing + 'pe-')",
          "itu → 'EE-too' — that (far demonstrative)",
          "terkenal → 'ter-ke-NAL' — famous",
        ],
      },
      {
        en: "Saya tidak suka musik dangdut, lebih suka pop.",
        vi: "Tôi không thích nhạc dangdut, thích nhạc pop hơn.",
        pronunciation_focus: [
          "dangdut → DANG-dut, dòng nhạc dân gian-pop đặc trưng Indonesia",
          "lebih suka → 'thích hơn' (lebih = hơn)",
          "pop → 'pop', nhạc pop (mượn tiếng Anh)",
        ],
        pronunciation_focus_en: [
          "dangdut → 'DANG-doot' — Indonesia's signature folk-pop genre",
          "lebih suka → 'prefer' (lebih = more)",
          "pop → 'pop' — pop music (loanword)",
        ],
      },
      {
        en: "Boleh putar lagu yang lain?",
        vi: "Có thể mở bài hát khác không?",
        pronunciation_focus: [
          "boleh → BÔ-lèh, 'có thể/được phép' (xin phép)",
          "putar → PU-tar, 'mở/phát (nhạc)'; đen: xoay/quay",
          "yang lain → 'cái khác' (lain = khác)",
        ],
        pronunciation_focus_en: [
          "boleh → 'BOH-leh' — may/be allowed (asking permission)",
          "putar → 'POO-tar' — to play (music); lit. to spin/turn",
          "yang lain → 'another one' (lain = other)",
        ],
      },
    ],
    cultural_notes_vi:
      "'Dangdut' là dòng nhạc đặc trưng nhất của Indonesia — pha trộn nhạc dân gian Mã Lai, Ấn Độ và Ả Rập, nhịp trống dập dìu, rất được yêu thích ở nông thôn và tầng lớp bình dân. Bên cạnh đó là 'pop Indonesia' với các ban nhạc và ca sĩ nổi tiếng. Người Indonesia nghe nhạc khắp nơi: trên xe, ở warung, trong ojek. Phân biệt 'mendengar' (nghe thấy, tình cờ) với 'mendengarkan' (lắng nghe, có chủ đích — nghe nhạc dùng từ này).",
    cultural_notes_en:
      "'Dangdut' is Indonesia's most distinctive genre — a blend of Malay folk, Indian and Arabic influences with a swaying drum beat, hugely popular in rural areas and among working-class listeners. Alongside it is 'pop Indonesia' with famous bands and singers. Indonesians listen to music everywhere: in cars, at the warung, on an ojek. Distinguish 'mendengar' (to hear, incidentally) from 'mendengarkan' (to listen, deliberately — use this one for listening to music).",
    tip_advice_vi:
      "Mẹo cho người Việt: 'suka' (thích) đứng ngay trước danh từ/động từ — 'suka musik' (thích nhạc), 'suka mendengarkan' (thích nghe). So sánh hơn dùng 'lebih … (daripada)': lebih suka pop = thích pop hơn. Xin phép lịch sự dùng 'Boleh + động từ?' (Có thể … không?). Tiền tố 'di-' tạo bị động: didengar = được nghe, diputar = được phát.",
    tip_advice_en:
      "Tip for Vietnamese speakers: 'suka' (to like) sits right before the noun/verb — 'suka musik' (like music), 'suka mendengarkan' (like to listen). Comparatives use 'lebih … (daripada)': lebih suka pop = prefer pop. Polite permission uses 'Boleh + verb?' (May I …?). The 'di-' prefix makes the passive: didengar = be heard, diputar = be played.",
    vocabulary: [
      {
        word: "musik",
        en: "music",
        vi: "âm nhạc",
        pos: "noun",
        pronunciation_vi: "MU-sik",
        pronunciation_en: "MOO-seek",
      },
      {
        word: "lagu",
        en: "song",
        vi: "bài hát",
        pos: "noun",
        pronunciation_vi: "LA-gu",
        pronunciation_en: "LA-goo",
      },
      {
        word: "penyanyi",
        en: "singer",
        vi: "ca sĩ",
        pos: "noun",
        pronunciation_vi: "peu-NYA-nyi",
        pronunciation_en: "pe-NYA-nyee",
      },
      {
        word: "mendengarkan",
        en: "to listen to",
        vi: "nghe (chăm chú)",
        pos: "verb",
        pronunciation_vi: "men-deu-NGAR-kan",
        pronunciation_en: "men-de-NGAR-kan",
      },
      {
        word: "dangdut",
        en: "dangdut (folk-pop genre)",
        vi: "nhạc dangdut",
        pos: "noun",
        pronunciation_vi: "DANG-dut",
        pronunciation_en: "DANG-doot",
      },
      {
        word: "suka",
        en: "to like",
        vi: "thích",
        pos: "verb",
        pronunciation_vi: "SU-ka",
        pronunciation_en: "SOO-ka",
      },
      {
        word: "putar",
        en: "to play (music) / spin",
        vi: "mở / phát (nhạc)",
        pos: "verb",
        pronunciation_vi: "PU-tar",
        pronunciation_en: "POO-tar",
      },
      {
        word: "enak",
        en: "pleasant / tasty",
        vi: "hay / dễ chịu / ngon",
        pos: "adjective",
        pronunciation_vi: "É-nak",
        pronunciation_en: "EH-nak",
      },
    ],
    dialogue: [
      {
        speaker: "Andi",
        text: "Kamu suka musik apa?",
        vi: "Bạn thích nhạc gì?",
        en: "What music do you like?",
      },
      {
        speaker: "Bella",
        text: "Saya lebih suka pop Indonesia. Kalau dangdut, kurang suka.",
        vi: "Mình thích nhạc pop Indonesia hơn. Còn dangdut thì ít thích.",
        en: "I prefer Indonesian pop. As for dangdut, not so much.",
      },
      {
        speaker: "Andi",
        text: "Lagu ini enak, lho. Mau saya putar?",
        vi: "Bài này hay đó. Mình mở cho nghe nhé?",
        en: "This song is nice, you know. Want me to play it?",
      },
      {
        speaker: "Bella",
        text: "Boleh. Penyanyinya terkenal ya?",
        vi: "Được chứ. Ca sĩ nổi tiếng nhỉ?",
        en: "Sure. The singer's famous, right?",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ âm nhạc còn thiếu:",
        instruction_en: "Fill in the missing music word:",
        items: [
          {
            prompt: "Saya suka ___ musik setiap hari. (nghe)",
            answer: "mendengarkan",
            options: ["mendengarkan", "memasak", "membaca"],
          },
          {
            prompt: "___ itu sangat terkenal. (ca sĩ)",
            answer: "Penyanyi",
            options: ["Penyanyi", "Penjual", "Penumpang"],
          },
          {
            prompt: "Boleh ___ lagu yang lain? (mở/phát)",
            answer: "putar",
            options: ["putar", "pulang", "pukul"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "lagu", answer: "bài hát" },
          { prompt: "penyanyi", answer: "ca sĩ" },
          { prompt: "suka", answer: "thích" },
          { prompt: "enak", answer: "hay / dễ chịu" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi thích nghe nhạc mỗi ngày.", answer: "Saya suka mendengarkan musik setiap hari." },
          { prompt: "Tôi không thích nhạc dangdut, thích pop hơn.", answer: "Saya tidak suka musik dangdut, lebih suka pop." },
          { prompt: "Có thể mở bài hát khác không?", answer: "Boleh putar lagu yang lain?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_cinema_karaoke_concert",
    level: "A2",
    category: "entertainment",
    title_vi: "Đi chơi — rạp phim, karaoke, hòa nhạc",
    title_en: "Going out — cinema, karaoke, concert",
    sentences: [
      {
        en: "Akhir pekan ini kita nonton film di bioskop, yuk.",
        vi: "Cuối tuần này mình đi xem phim ở rạp đi.",
        pronunciation_focus: [
          "akhir pekan → 'cuối tuần' (akhir = cuối, pekan = tuần)",
          "nonton → NON-ton, 'xem' (đời thường, = menonton)",
          "bioskop → bi-ÔS-kop, 'rạp chiếu phim'; yuk = rủ rê 'nào/đi'",
        ],
        pronunciation_focus_en: [
          "akhir pekan → 'weekend' (akhir = end, pekan = week)",
          "nonton → 'NON-ton' — to watch (casual, = menonton)",
          "bioskop → 'bee-OS-kop' — cinema; 'yuk' = 'let's' (invitation)",
        ],
      },
      {
        en: "Tiket filmnya berapa harganya?",
        vi: "Vé phim giá bao nhiêu?",
        pronunciation_focus: [
          "tiket → TI-ket, 'vé'",
          "filmnya → 'phim (đó)' (film + -nya)",
          "berapa harganya → 'giá bao nhiêu' (harga = giá)",
        ],
        pronunciation_focus_en: [
          "tiket → 'TEE-ket' — ticket",
          "filmnya → 'the movie' (film + '-nya')",
          "berapa harganya → 'how much is the price' (harga = price)",
        ],
      },
      {
        en: "Setelah itu, mau karaoke bareng?",
        vi: "Sau đó, đi karaoke chung không?",
        pronunciation_focus: [
          "setelah itu → 'sau đó' (setelah = sau khi)",
          "karaoke → ka-ra-Ô-ke, hát karaoke (mượn từ tiếng Nhật/Anh)",
          "bareng → BA-reng, 'chung/cùng nhau' (đời thường, = bersama)",
        ],
        pronunciation_focus_en: [
          "setelah itu → 'after that' (setelah = after)",
          "karaoke → 'ka-ra-OH-keh' — karaoke",
          "bareng → 'BA-reng' — together (casual, = bersama)",
        ],
      },
      {
        en: "Saya mau beli tiket konser band itu.",
        vi: "Tôi muốn mua vé hòa nhạc của ban nhạc đó.",
        pronunciation_focus: [
          "konser → KÔN-ser, 'buổi hòa nhạc/concert'",
          "band → 'bèn', ban nhạc (mượn tiếng Anh)",
          "beli → beu-LI, 'mua'",
        ],
        pronunciation_focus_en: [
          "konser → 'KON-ser' — concert",
          "band → 'band' — music band (loanword)",
          "beli → 'be-LEE' — to buy",
        ],
      },
      {
        en: "Filmnya seru, tapi terlalu panjang.",
        vi: "Phim hấp dẫn, nhưng dài quá.",
        pronunciation_focus: [
          "seru → SEU-ru, 'hấp dẫn/gay cấn'",
          "terlalu → ter-LA-lu, 'quá/quá mức'",
          "panjang → PAN-jang, 'dài'",
        ],
        pronunciation_focus_en: [
          "seru → 'SE-roo' — exciting/thrilling",
          "terlalu → 'ter-LA-loo' — too (excessively)",
          "panjang → 'PAN-jang' — long",
        ],
      },
    ],
    cultural_notes_vi:
      "Đi 'bioskop' (rạp phim) là hoạt động cuối tuần phổ biến — các chuỗi như XXI, CGV, Cinépolis có mặt ở hầu hết trung tâm thương mại. Phim nước ngoài thường giữ tiếng gốc + phụ đề ('subtitle') tiếng Indonesia. Karaoke ('karaokean') rất được ưa chuộng, từ phòng gia đình đến quán hát. Văn hóa rủ rê dùng 'yuk' (nào, đi) ở cuối câu và 'bareng' (cùng nhau). Indonesia có nhiều lễ hội âm nhạc và 'konser' lớn ở Jakarta, Bandung.",
    cultural_notes_en:
      "Going to the 'bioskop' (cinema) is a popular weekend activity — chains like XXI, CGV, and Cinépolis are in most malls. Foreign films usually keep the original audio with Indonesian subtitles. Karaoke ('karaokean') is much loved, from family rooms to singing bars. The inviting style uses 'yuk' (let's) at the end and 'bareng' (together). Indonesia has many music festivals and big 'konser' in Jakarta and Bandung.",
    tip_advice_vi:
      "Mẹo cho người Việt: nhiều động từ giải trí có dạng đời thường bỏ tiền tố — 'nonton' (= menonton, xem), 'bareng' (= bersama, cùng). Rủ rê: đặt 'yuk' cuối câu (Nonton film yuk! = Đi xem phim nào!). 'Terlalu + tính từ' = quá (terlalu panjang = dài quá). Hỏi giá: 'Berapa harganya?'. 'Setelah itu' nối các sự kiện theo trình tự — rất tiện kể kế hoạch.",
    tip_advice_en:
      "Tip for Vietnamese speakers: many leisure verbs have a casual prefix-dropped form — 'nonton' (= menonton, watch), 'bareng' (= bersama, together). To invite, put 'yuk' at the end (Nonton film yuk! = Let's watch a movie!). 'Terlalu + adjective' = too (terlalu panjang = too long). Asking the price: 'Berapa harganya?'. 'Setelah itu' chains events in sequence — handy for laying out a plan.",
    vocabulary: [
      {
        word: "bioskop",
        en: "cinema / movie theater",
        vi: "rạp chiếu phim",
        pos: "noun",
        pronunciation_vi: "bi-ÔS-kop",
        pronunciation_en: "bee-OS-kop",
      },
      {
        word: "film",
        en: "film / movie",
        vi: "phim",
        pos: "noun",
        pronunciation_vi: "fìlm",
        pronunciation_en: "film",
      },
      {
        word: "nonton",
        en: "to watch (casual = menonton)",
        vi: "xem",
        pos: "verb",
        pronunciation_vi: "NON-ton",
        pronunciation_en: "NON-ton",
      },
      {
        word: "tiket",
        en: "ticket",
        vi: "vé",
        pos: "noun",
        pronunciation_vi: "TI-ket",
        pronunciation_en: "TEE-ket",
      },
      {
        word: "karaoke",
        en: "karaoke",
        vi: "karaoke",
        pos: "noun / verb",
        pronunciation_vi: "ka-ra-Ô-ke",
        pronunciation_en: "ka-ra-OH-keh",
      },
      {
        word: "konser",
        en: "concert",
        vi: "buổi hòa nhạc",
        pos: "noun",
        pronunciation_vi: "KÔN-ser",
        pronunciation_en: "KON-ser",
      },
      {
        word: "bareng",
        en: "together (casual = bersama)",
        vi: "chung / cùng nhau",
        pos: "adverb",
        pronunciation_vi: "BA-reng",
        pronunciation_en: "BA-reng",
      },
      {
        word: "seru",
        en: "exciting / thrilling",
        vi: "hấp dẫn / gay cấn",
        pos: "adjective",
        pronunciation_vi: "SEU-ru",
        pronunciation_en: "SE-roo",
      },
    ],
    dialogue: [
      {
        speaker: "Rina",
        text: "Akhir pekan ini nonton film di bioskop, yuk!",
        vi: "Cuối tuần này đi xem phim ở rạp đi!",
        en: "Let's watch a movie at the cinema this weekend!",
      },
      {
        speaker: "Joko",
        text: "Boleh. Tiket filmnya berapa harganya sekarang?",
        vi: "Được đó. Vé phim giờ giá bao nhiêu?",
        en: "Sure. How much are movie tickets now?",
      },
      {
        speaker: "Rina",
        text: "Sekitar lima puluh ribu. Setelah itu, mau karaoke bareng?",
        vi: "Khoảng năm mươi nghìn. Sau đó đi karaoke chung không?",
        en: "Around fifty thousand. After that, want to do karaoke together?",
      },
      {
        speaker: "Joko",
        text: "Mau banget! Tapi jangan pilih film yang terlalu panjang, ya.",
        vi: "Muốn lắm! Nhưng đừng chọn phim dài quá nhé.",
        en: "Definitely! But don't pick a movie that's too long, okay.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ giải trí còn thiếu:",
        instruction_en: "Fill in the missing entertainment word:",
        items: [
          {
            prompt: "Kita ___ film di bioskop, yuk. (xem)",
            answer: "nonton",
            options: ["nonton", "naik", "nanti"],
          },
          {
            prompt: "Saya mau beli tiket ___ band itu. (hòa nhạc)",
            answer: "konser",
            options: ["konser", "kantor", "kamar"],
          },
          {
            prompt: "Filmnya seru, tapi ___ panjang. (quá)",
            answer: "terlalu",
            options: ["terlalu", "terbang", "terkenal"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "bioskop", answer: "rạp chiếu phim" },
          { prompt: "konser", answer: "buổi hòa nhạc" },
          { prompt: "bareng", answer: "chung / cùng nhau" },
          { prompt: "seru", answer: "hấp dẫn" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Cuối tuần này mình đi xem phim ở rạp đi.", answer: "Akhir pekan ini kita nonton film di bioskop, yuk." },
          { prompt: "Sau đó, đi karaoke chung không?", answer: "Setelah itu, mau karaoke bareng?" },
          { prompt: "Phim hấp dẫn, nhưng dài quá.", answer: "Filmnya seru, tapi terlalu panjang." },
        ],
      },
    ],
  },
  {
    id: "indonesian_discussing_entertainment_taste",
    level: "B1",
    category: "entertainment",
    title_vi: "Bàn luận sở thích — phim và nhạc Indonesia",
    title_en: "Discussing tastes — Indonesian films and music",
    sentences: [
      {
        en: "Menurut saya, film Indonesia sekarang semakin berkualitas.",
        vi: "Theo tôi, phim Indonesia bây giờ ngày càng chất lượng.",
        pronunciation_focus: [
          "menurut saya → 'theo tôi (nghĩ)' — mở đầu nêu ý kiến",
          "semakin → seu-MA-kin, 'ngày càng'",
          "berkualitas → 'có chất lượng' (gốc kualitas + ber-)",
        ],
        pronunciation_focus_en: [
          "menurut saya → 'in my opinion' — opinion opener",
          "semakin → 'se-MA-kin' — increasingly/more and more",
          "berkualitas → 'to be of quality' (root 'kualitas' + 'ber-')",
        ],
      },
      {
        en: "Aktor itu berperan dengan sangat baik di film terbaru.",
        vi: "Diễn viên đó diễn rất tốt trong bộ phim mới nhất.",
        pronunciation_focus: [
          "aktor → AK-tor, 'diễn viên (nam)'",
          "berperan → ber-peu-RAN, 'đóng vai/thủ vai' (gốc peran + ber-)",
          "terbaru → ter-BA-ru, 'mới nhất' (gốc baru + ter-, dạng so sánh nhất)",
        ],
        pronunciation_focus_en: [
          "aktor → 'AK-tor' — actor",
          "berperan → 'ber-pe-RAN' — to play a role (root 'peran' + 'ber-')",
          "terbaru → 'ter-BA-roo' — newest/latest (root 'baru' + superlative 'ter-')",
        ],
      },
      {
        en: "Saya lebih suka lagu lama daripada lagu zaman sekarang.",
        vi: "Tôi thích nhạc xưa hơn nhạc thời nay.",
        pronunciation_focus: [
          "lebih … daripada … → 'hơn … so với …' (cấu trúc so sánh)",
          "lagu lama → 'nhạc xưa/cũ' (lama = cũ/lâu)",
          "zaman sekarang → 'thời nay/hiện đại' (zaman = thời đại)",
        ],
        pronunciation_focus_en: [
          "lebih … daripada … → 'more … than …' (comparison frame)",
          "lagu lama → 'old songs' (lama = old/long-standing)",
          "zaman sekarang → 'these days/modern times' (zaman = era)",
        ],
      },
      {
        en: "Banyak penyanyi muda yang go international sekarang.",
        vi: "Nhiều ca sĩ trẻ vươn ra quốc tế bây giờ.",
        pronunciation_focus: [
          "banyak … yang … → 'nhiều … (mà) …' (yang nối mệnh đề mô tả)",
          "muda → MU-da, 'trẻ'",
          "go international → mượn tiếng Anh, 'vươn tầm quốc tế'",
        ],
        pronunciation_focus_en: [
          "banyak … yang … → 'many … who/that …' (yang links the relative clause)",
          "muda → 'MOO-da' — young",
          "go international → English loan phrase, 'to reach the global stage'",
        ],
      },
      {
        en: "Sayang sekali, akhir filmnya kurang memuaskan.",
        vi: "Tiếc thật, đoạn kết phim chưa đã/chưa thỏa mãn.",
        pronunciation_focus: [
          "sayang sekali → 'tiếc thật/đáng tiếc'",
          "akhir → A-khir, 'đoạn kết/cuối'",
          "kurang memuaskan → 'chưa thỏa mãn lắm' (kurang = thiếu/chưa đủ)",
        ],
        pronunciation_focus_en: [
          "sayang sekali → 'what a pity/too bad'",
          "akhir → 'A-kheer' — ending",
          "kurang memuaskan → 'not very satisfying' (kurang = lacking)",
        ],
      },
    ],
    cultural_notes_vi:
      "Điện ảnh Indonesia ('film Indonesia') đang bùng nổ — các phim như 'Laskar Pelangi', 'Pengabdi Setan' hay phim của Joko Anwar gây tiếng vang cả trong và ngoài nước. Nhạc Indonesia cũng có nhiều nghệ sĩ trẻ 'go international'. Khi bàn luận, người Indonesia mở đầu lịch sự bằng 'Menurut saya…' (theo tôi) và chê nhẹ bằng 'kurang…' (chưa đủ/thiếu) thay vì nói thẳng 'dở' — giữ thể diện là rất quan trọng trong văn hóa giao tiếp.",
    cultural_notes_en:
      "Indonesian cinema ('film Indonesia') is booming — films like 'Laskar Pelangi', 'Pengabdi Setan', and Joko Anwar's work have made waves at home and abroad. Indonesian music likewise has many young artists 'going international'. When discussing, Indonesians open politely with 'Menurut saya…' (in my opinion) and soften criticism with 'kurang…' (lacking) rather than bluntly saying 'bad' — face-saving matters a lot in the communication culture.",
    tip_advice_vi:
      "Mẹo cho người Việt: nêu ý kiến lịch sự với 'Menurut saya…' và chê nhẹ bằng 'kurang + tính từ' (kurang bagus = chưa hay lắm) — êm hơn 'jelek' (dở). So sánh đầy đủ: 'lebih X daripada Y' (X hơn Y). Tiền tố 'ter-' tạo so sánh nhất: terbaru (mới nhất), terbaik (tốt nhất). 'Semakin + tính từ' = ngày càng. 'yang' nối mệnh đề mô tả: penyanyi yang terkenal = ca sĩ (mà) nổi tiếng.",
    tip_advice_en:
      "Tip for Vietnamese speakers: give opinions politely with 'Menurut saya…' and soften criticism with 'kurang + adjective' (kurang bagus = not that good) — gentler than 'jelek' (bad). Full comparison: 'lebih X daripada Y' (more X than Y). The 'ter-' prefix forms the superlative: terbaru (latest), terbaik (best). 'Semakin + adjective' = increasingly. 'yang' links a relative clause: penyanyi yang terkenal = a singer who is famous.",
    vocabulary: [
      {
        word: "menurut saya",
        en: "in my opinion",
        vi: "theo tôi",
        pos: "phrase",
        pronunciation_vi: "meu-NU-rut SA-ya",
        pronunciation_en: "me-NOO-root SA-ya",
      },
      {
        word: "film",
        en: "film / movie",
        vi: "phim",
        pos: "noun",
        pronunciation_vi: "fìlm",
        pronunciation_en: "film",
      },
      {
        word: "aktor",
        en: "actor",
        vi: "diễn viên (nam)",
        pos: "noun",
        pronunciation_vi: "AK-tor",
        pronunciation_en: "AK-tor",
      },
      {
        word: "berperan",
        en: "to play a role / act",
        vi: "đóng vai",
        pos: "verb",
        pronunciation_vi: "ber-peu-RAN",
        pronunciation_en: "ber-pe-RAN",
      },
      {
        word: "terbaru",
        en: "newest / latest",
        vi: "mới nhất",
        pos: "adjective (superlative)",
        pronunciation_vi: "ter-BA-ru",
        pronunciation_en: "ter-BA-roo",
      },
      {
        word: "semakin",
        en: "increasingly / more and more",
        vi: "ngày càng",
        pos: "adverb",
        pronunciation_vi: "seu-MA-kin",
        pronunciation_en: "se-MA-kin",
      },
      {
        word: "memuaskan",
        en: "satisfying",
        vi: "thỏa mãn / làm hài lòng",
        pos: "adjective / verb",
        pronunciation_vi: "meu-mu-AS-kan",
        pronunciation_en: "me-moo-AS-kan",
      },
      {
        word: "kurang",
        en: "lacking / not enough",
        vi: "chưa đủ / thiếu",
        pos: "adverb",
        pronunciation_vi: "KU-rang",
        pronunciation_en: "KOO-rang",
      },
    ],
    dialogue: [
      {
        speaker: "Sari",
        text: "Kamu sudah nonton film Indonesia yang terbaru itu?",
        vi: "Bạn xem bộ phim Indonesia mới nhất đó chưa?",
        en: "Have you watched that latest Indonesian movie?",
      },
      {
        speaker: "Budi",
        text: "Sudah. Menurut saya aktornya berperan dengan sangat baik.",
        vi: "Rồi. Theo mình diễn viên diễn rất tốt.",
        en: "Yes. In my opinion the actor played the role really well.",
      },
      {
        speaker: "Sari",
        text: "Setuju. Tapi sayang sekali, akhirnya kurang memuaskan.",
        vi: "Đồng ý. Nhưng tiếc là đoạn kết chưa đã lắm.",
        en: "Agreed. But what a pity, the ending was a bit unsatisfying.",
      },
      {
        speaker: "Budi",
        text: "Betul. Soal musik, aku lebih suka lagu lama daripada zaman sekarang.",
        vi: "Đúng vậy. Còn về nhạc, mình thích nhạc xưa hơn nhạc thời nay.",
        en: "True. As for music, I prefer old songs over today's.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ bàn luận còn thiếu:",
        instruction_en: "Fill in the missing discussion word:",
        items: [
          {
            prompt: "___ saya, film Indonesia semakin berkualitas. (theo)",
            answer: "Menurut",
            options: ["Menurut", "Menulis", "Menunggu"],
          },
          {
            prompt: "Aktor itu ___ dengan sangat baik. (đóng vai)",
            answer: "berperan",
            options: ["berperan", "berhenti", "berangkat"],
          },
          {
            prompt: "Sayang sekali, akhirnya ___ memuaskan. (chưa đủ)",
            answer: "kurang",
            options: ["kurang", "kurus", "kursi"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "terbaru", answer: "mới nhất" },
          { prompt: "semakin", answer: "ngày càng" },
          { prompt: "menurut saya", answer: "theo tôi" },
          { prompt: "memuaskan", answer: "thỏa mãn" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Theo tôi, phim Indonesia ngày càng chất lượng.", answer: "Menurut saya, film Indonesia sekarang semakin berkualitas." },
          { prompt: "Tôi thích nhạc xưa hơn nhạc thời nay.", answer: "Saya lebih suka lagu lama daripada lagu zaman sekarang." },
          { prompt: "Tiếc thật, đoạn kết phim chưa thỏa mãn.", answer: "Sayang sekali, akhir filmnya kurang memuaskan." },
        ],
      },
    ],
  },
];

export default musicEntertainmentLessons;
