// src/languages/indonesian/extra/bahasa-gaul-advanced.ts
//
// Advanced Indonesian slang (bahasa gaul) pack for Vietnamese learners.
// Covers: internet reactions (wkwk, gaje, lebay, alay), mood/laziness slang
// (mager, gabut, baper, gercep), and relationship/social-media slang (bucin,
// PHP, kepo, japri, spill). Hand-crafted, no filler.
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
// Register note: this pack TEACHES slang, so the displayed sentences keep the
// colloquial spelling verbatim (gak, lu, gue, wkwk…). The answer-grading
// normalizer (foldIndonesianInformal) maps these to standard forms only for
// comparison — it never rewrites what learners see here.
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

export const bahasaGaulAdvancedLessons: IndonesianLesson[] = [
  {
    id: "indonesian_gaul_internet_reactions",
    level: "B2",
    category: "slang",
    title_vi: "Tiếng lóng mạng — wkwk, gaje, lebay, alay",
    title_en: "Internet slang — wkwk, gaje, lebay, alay",
    sentences: [
      {
        en: "Wkwkwk, postingan kamu lucu banget!",
        vi: "Haha, bài đăng của bạn buồn cười cực kỳ!",
        pronunciation_focus: [
          "wkwk → đọc 'wak-wak', là 'haha' của người Indonesia khi chat",
          "postingan → 'bài đăng' (gốc tiếng Anh 'posting' + -an)",
          "banget → BA-nget, 'cực kỳ/lắm' (= 'sangat' nhưng đời thường)",
        ],
        pronunciation_focus_en: [
          "wkwk → read 'wak-wak'; the Indonesian chat version of 'haha'",
          "postingan → 'a post' (from English 'posting' + '-an')",
          "banget → 'BA-nget' — very/super (= 'sangat' but casual)",
        ],
      },
      {
        en: "Filmnya gaje banget, gak jelas ceritanya.",
        vi: "Phim chả ra gì cả, cốt truyện chẳng rõ ràng.",
        pronunciation_focus: [
          "gaje → 'ga-JÉ', viết tắt của 'gak jelas' = không rõ ràng/vô nghĩa",
          "gak → 'gak', dạng đời thường của 'tidak' (không)",
          "ceritanya → 'cốt truyện (của nó)' (cerita + -nya)",
        ],
        pronunciation_focus_en: [
          "gaje → 'ga-JEH' — short for 'gak jelas' = pointless/makes no sense",
          "gak → casual form of 'tidak' (not)",
          "ceritanya → 'its story/plot' (cerita + '-nya')",
        ],
      },
      {
        en: "Jangan lebay deh, itu cuma luka kecil.",
        vi: "Đừng làm quá lên, đó chỉ là vết thương nhỏ thôi.",
        pronunciation_focus: [
          "lebay → 'LÉ-bai', 'làm quá/cường điệu' (over-dramatic)",
          "deh → tiểu từ cuối câu làm mềm giọng (≈ 'đi/nhé')",
          "cuma → CHU-ma, 'chỉ' (đời thường, = 'hanya')",
        ],
        pronunciation_focus_en: [
          "lebay → 'LEH-bai' — over-dramatic/exaggerating",
          "deh → sentence-final softener (≈ 'come on/just')",
          "cuma → 'CHOO-ma' — only (casual, = 'hanya')",
        ],
      },
      {
        en: "Tulisannya alay, pakai huruf besar-kecil campur.",
        vi: "Chữ viết sến súa, dùng chữ hoa chữ thường lẫn lộn.",
        pronunciation_focus: [
          "alay → 'A-lai', 'sến/màu mè/lố' (tacky, cringe)",
          "huruf besar-kecil → 'chữ hoa chữ thường' (kiểu viết 'aLaY')",
          "campur → CHAM-pur, 'trộn lẫn/lộn xộn'",
        ],
        pronunciation_focus_en: [
          "alay → 'A-lai' — tacky/cringey/try-hard",
          "huruf besar-kecil → 'upper- and lowercase' (the 'aLaY' typing style)",
          "campur → 'CHAM-poor' — mixed/jumbled",
        ],
      },
      {
        en: "Receh banget jokesnya, tapi tetap bikin ketawa.",
        vi: "Mấy câu đùa nhảm thật, nhưng vẫn khiến mình bật cười.",
        pronunciation_focus: [
          "receh → 'RÉ-chèh', đen: 'tiền lẻ'; lóng: 'nhảm/dễ dãi' (câu đùa rẻ tiền)",
          "bikin → BI-kin, 'làm cho' (đời thường, = 'membuat')",
          "ketawa → keu-TA-wa, 'cười' (đời thường, = 'tertawa')",
        ],
        pronunciation_focus_en: [
          "receh → 'REH-cheh' — lit. 'small change'; slang: 'corny/cheap' (a low-effort joke)",
          "bikin → 'BEE-kin' — to make (casual, = 'membuat')",
          "ketawa → 'ke-TA-wa' — to laugh (casual, = 'tertawa')",
        ],
      },
    ],
    cultural_notes_vi:
      "'Bahasa gaul' là tiếng lóng đời thường của giới trẻ Indonesia, đặc biệt trên mạng xã hội. 'Wkwk' (đọc 'wak-wak') là 'haha' — bắt nguồn từ việc gõ 'wk' nhanh trên bàn phím; càng nhiều 'wkwkwk' càng buồn cười. Nhiều từ là viết tắt: 'gaje' = gak jelas (không rõ ràng). 'Lebay' (làm quá), 'alay' (sến/màu mè, kiểu viết 'aLaY cAmPuR') và 'receh' (đùa nhảm) là các từ chê nhẹ rất phổ biến. Đây là register CỰC kỳ thân mật — không bao giờ dùng trong email công việc hay với người lớn tuổi.",
    cultural_notes_en:
      "'Bahasa gaul' is the everyday slang of young Indonesians, especially on social media. 'Wkwk' (read 'wak-wak') is 'haha' — it comes from rapidly typing 'wk' on the keyboard; more 'wkwkwk' = funnier. Many terms are acronyms: 'gaje' = gak jelas (unclear/pointless). 'Lebay' (over-dramatic), 'alay' (tacky, the 'aLaY mIxEd cAsE' typing style) and 'receh' (corny joke) are very common light put-downs. This is an EXTREMELY informal register — never use it in a work email or with elders.",
    tip_advice_vi:
      "Mẹo cho người Việt: nhiều từ gaul là VIẾT TẮT của một cụm chuẩn — học cụm gốc thì hiểu ngay: gaje = gak jelas, gak = tidak. Quy tắc đời thường: 'banget' thay 'sangat' (rất), 'cuma' thay 'hanya' (chỉ), 'bikin' thay 'membuat' (làm), 'ketawa' thay 'tertawa' (cười). Tiểu từ cuối câu 'deh/sih/dong/kok' chỉ để chỉnh giọng điệu, gần như không dịch được — cảm nhận qua ngữ cảnh.",
    tip_advice_en:
      "Tip for Vietnamese speakers: many slang words are ACRONYMS of a standard phrase — learn the source phrase and the meaning clicks: gaje = gak jelas, gak = tidak. Casual swaps: 'banget' for 'sangat' (very), 'cuma' for 'hanya' (only), 'bikin' for 'membuat' (to make), 'ketawa' for 'tertawa' (to laugh). The sentence-final particles 'deh/sih/dong/kok' only tweak tone and are nearly untranslatable — feel them from context.",
    vocabulary: [
      {
        word: "wkwk",
        en: "haha (chat laughter)",
        vi: "haha (cười khi chat)",
        pos: "interjection",
        pronunciation_vi: "wak-wak",
        pronunciation_en: "wak-wak",
      },
      {
        word: "gaje",
        en: "pointless / makes no sense (← gak jelas)",
        vi: "vô nghĩa / chả rõ (← gak jelas)",
        pos: "adjective (slang)",
        pronunciation_vi: "ga-JÉ",
        pronunciation_en: "ga-JEH",
      },
      {
        word: "lebay",
        en: "over-dramatic / exaggerating",
        vi: "làm quá / cường điệu",
        pos: "adjective (slang)",
        pronunciation_vi: "LÉ-bai",
        pronunciation_en: "LEH-bai",
      },
      {
        word: "alay",
        en: "tacky / cringey / try-hard",
        vi: "sến / màu mè / lố",
        pos: "adjective (slang)",
        pronunciation_vi: "A-lai",
        pronunciation_en: "A-lai",
      },
      {
        word: "receh",
        en: "corny / cheap (joke)",
        vi: "nhảm / rẻ tiền (câu đùa)",
        pos: "adjective (slang)",
        pronunciation_vi: "RÉ-chèh",
        pronunciation_en: "REH-cheh",
      },
      {
        word: "banget",
        en: "very / super (casual)",
        vi: "cực kỳ / lắm",
        pos: "adverb (slang)",
        pronunciation_vi: "BA-nget",
        pronunciation_en: "BA-nget",
      },
      {
        word: "bikin",
        en: "to make (casual = membuat)",
        vi: "làm cho",
        pos: "verb (slang)",
        pronunciation_vi: "BI-kin",
        pronunciation_en: "BEE-kin",
      },
      {
        word: "ketawa",
        en: "to laugh (casual = tertawa)",
        vi: "cười",
        pos: "verb (slang)",
        pronunciation_vi: "keu-TA-wa",
        pronunciation_en: "ke-TA-wa",
      },
    ],
    dialogue: [
      {
        speaker: "Rani",
        text: "Wkwkwk, liat meme ini deh, receh banget!",
        vi: "Haha, xem cái meme này đi, nhảm thật sự!",
        en: "Hahaha, look at this meme, it's so corny!",
      },
      {
        speaker: "Doni",
        text: "Gaje sih sebenarnya, tapi tetap bikin ketawa.",
        vi: "Thật ra cũng chả rõ ý gì, nhưng vẫn buồn cười.",
        en: "It's kind of pointless really, but it still makes me laugh.",
      },
      {
        speaker: "Rani",
        text: "Eh, caption-nya alay banget ya, huruf gede-kecil campur.",
        vi: "Ê, cái caption sến ghê, chữ hoa chữ thường lẫn lộn.",
        en: "Hey, the caption is so tacky, mixed upper- and lowercase.",
      },
      {
        speaker: "Doni",
        text: "Iya, jangan lebay ngetiknya. Susah dibaca.",
        vi: "Ừ, gõ chữ đừng làm quá lên. Khó đọc lắm.",
        en: "Yeah, don't go overboard typing like that. It's hard to read.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ lóng mạng còn thiếu:",
        instruction_en: "Fill in the missing internet-slang word:",
        items: [
          {
            prompt: "Filmnya ___, gak jelas ceritanya. (vô nghĩa)",
            answer: "gaje",
            options: ["gaje", "gaji", "gajah"],
          },
          {
            prompt: "Jangan ___ deh, itu cuma luka kecil. (làm quá)",
            answer: "lebay",
            options: ["lebay", "lebar", "lebih"],
          },
          {
            prompt: "Tulisannya ___, huruf besar-kecil campur. (sến)",
            answer: "alay",
            options: ["alay", "alat", "alam"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ lóng với nghĩa tiếng Việt:",
        instruction_en: "Match each slang word with its Vietnamese meaning:",
        items: [
          { prompt: "wkwk", answer: "haha" },
          { prompt: "gaje", answer: "vô nghĩa / chả rõ" },
          { prompt: "receh", answer: "nhảm / rẻ tiền" },
          { prompt: "banget", answer: "cực kỳ / lắm" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Viết lại sang tiếng lóng Indonesia (bahasa gaul):",
        instruction_en: "Render into Indonesian slang (bahasa gaul):",
        items: [
          { prompt: "Bài đăng của bạn buồn cười cực kỳ!", answer: "Postingan kamu lucu banget!" },
          { prompt: "Phim chả ra gì, cốt truyện chẳng rõ.", answer: "Filmnya gaje banget, gak jelas ceritanya." },
          { prompt: "Đừng làm quá lên, đó chỉ là vết thương nhỏ.", answer: "Jangan lebay deh, itu cuma luka kecil." },
        ],
      },
    ],
  },
  {
    id: "indonesian_gaul_mood_laziness",
    level: "B2",
    category: "slang",
    title_vi: "Tiếng lóng tâm trạng — mager, gabut, baper, gercep",
    title_en: "Mood & laziness slang — mager, gabut, baper, gercep",
    sentences: [
      {
        en: "Hari ini gue mager banget, gak mau ke mana-mana.",
        vi: "Hôm nay mình lười ơi là lười, chẳng muốn đi đâu cả.",
        pronunciation_focus: [
          "mager → 'MA-ger', viết tắt 'malas gerak' = lười nhúc nhích",
          "gue → 'gu-é', 'tôi/mình' kiểu Jakarta (= saya)",
          "ke mana-mana → 'đi đâu đó' (mana-mana = đâu đâu, từ lặp)",
        ],
        pronunciation_focus_en: [
          "mager → 'MA-ger' — short for 'malas gerak' = too lazy to move",
          "gue → 'goo-EH' — Jakarta 'I/me' (= saya)",
          "ke mana-mana → 'anywhere' (mana-mana = reduplicated 'where')",
        ],
      },
      {
        en: "Lagi gabut nih, ada yang seru gak?",
        vi: "Đang rảnh chán đây, có gì vui không?",
        pronunciation_focus: [
          "gabut → 'GA-but', gốc 'gaji buta'; nghĩa lóng: rảnh đến phát chán",
          "lagi → 'đang' (chỉ hành động/trạng thái hiện tại, đời thường)",
          "nih → tiểu từ ≈ 'này/đây' nhấn mạnh",
        ],
        pronunciation_focus_en: [
          "gabut → 'GA-boot' — from 'gaji buta'; slang: idle and bored",
          "lagi → 'in the middle of / -ing now' (casual progressive marker)",
          "nih → particle ≈ 'here/this' for emphasis",
        ],
      },
      {
        en: "Jangan baper dong, gue cuma bercanda.",
        vi: "Đừng dỗi/để bụng mà, mình chỉ đùa thôi.",
        pronunciation_focus: [
          "baper → 'BA-per', viết tắt 'bawa perasaan' = mang cảm xúc vào, dễ tự ái",
          "dong → tiểu từ năn nỉ/nhắc nhẹ (≈ 'mà/đi')",
          "bercanda → ber-CHAN-da, 'đùa giỡn'",
        ],
        pronunciation_focus_en: [
          "baper → 'BA-per' — short for 'bawa perasaan' = to take things personally/get in your feelings",
          "dong → coaxing particle (≈ 'come on/please')",
          "bercanda → 'ber-CHAN-da' — to joke",
        ],
      },
      {
        en: "Dia gercep banget, langsung bales chat gue.",
        vi: "Cậu ấy nhanh tay cực, trả lời tin nhắn mình ngay lập tức.",
        pronunciation_focus: [
          "gercep → 'GER-chep', viết tắt 'gerak cepat' = phản ứng nhanh",
          "langsung → LANG-sung, 'ngay/lập tức'",
          "bales → BA-les, 'trả lời/hồi đáp' (đời thường, = membalas)",
        ],
        pronunciation_focus_en: [
          "gercep → 'GER-chep' — short for 'gerak cepat' = quick to act/respond",
          "langsung → 'LANG-soong' — right away/directly",
          "bales → 'BA-les' — to reply (casual, = membalas)",
        ],
      },
      {
        en: "Kepo banget sih lu, bukan urusan lu!",
        vi: "Tò mò gì mà ghê vậy, không phải việc của bạn!",
        pronunciation_focus: [
          "kepo → 'KÉ-po', 'tò mò/hóng chuyện' (nhiều chuyện)",
          "lu → 'lu', 'bạn/mày' kiểu Jakarta (= kamu)",
          "urusan → u-RU-san, 'chuyện/việc (của ai)'",
        ],
        pronunciation_focus_en: [
          "kepo → 'KEH-po' — nosy/overly curious",
          "lu → 'loo' — Jakarta 'you' (= kamu)",
          "urusan → 'oo-ROO-san' — (someone's) business/affair",
        ],
      },
    ],
    cultural_notes_vi:
      "Nhóm từ lóng này mô tả tâm trạng và là viết tắt của cụm chuẩn: 'mager' = malas gerak (lười cử động), 'gabut' = gaji buta (gốc nghĩa 'ăn lương không làm gì', nay là rảnh-chán), 'baper' = bawa perasaan (dễ tự ái/để bụng), 'gercep' = gerak cepat (nhanh tay). 'Kepo' (tò mò, nhiều chuyện) bị cho là gốc Hokkien. Cặp đại từ Jakarta 'gue' (tôi) / 'lu' (bạn) đi kèm gần như bắt buộc trong văn nói gaul — KHÔNG dùng với người lớn tuổi hay cấp trên.",
    cultural_notes_en:
      "This slang cluster describes moods and is acronym-based: 'mager' = malas gerak (too lazy to move), 'gabut' = gaji buta (originally 'paid for doing nothing', now idle-and-bored), 'baper' = bawa perasaan (overly sensitive/takes things to heart), 'gercep' = gerak cepat (quick to act). 'Kepo' (nosy) is thought to come from Hokkien. The Jakarta pronoun pair 'gue' (I) / 'lu' (you) almost always rides along with this slang — NOT used with elders or superiors.",
    tip_advice_vi:
      "Mẹo cho người Việt: kiểu viết tắt 'gaul' lấy âm tiết đầu của mỗi từ — malas+gerak→mager, bawa+perasaan→baper, gerak+cepat→gercep. Học mẹo này thì đoán được từ mới. 'Lagi + động từ' = đang làm gì (thì hiện tại tiếp diễn đời thường). Cặp đại từ: trang trọng saya/Anda → đời thường gue/lu (Jakarta) hoặc aku/kamu (chung). Dùng nhầm gue/lu với sếp là rất bất lịch sự.",
    tip_advice_en:
      "Tip for Vietnamese speakers: the 'gaul' acronym pattern takes the first syllable of each word — malas+gerak→mager, bawa+perasaan→baper, gerak+cepat→gercep. Learn the pattern and you can decode new ones. 'Lagi + verb' = currently doing (casual present continuous). Pronoun tiers: formal saya/Anda → casual gue/lu (Jakarta) or aku/kamu (general). Using gue/lu with a boss is quite rude.",
    vocabulary: [
      {
        word: "mager",
        en: "too lazy to move (← malas gerak)",
        vi: "lười nhúc nhích (← malas gerak)",
        pos: "adjective (slang)",
        pronunciation_vi: "MA-ger",
        pronunciation_en: "MA-ger",
      },
      {
        word: "gabut",
        en: "idle & bored (← gaji buta)",
        vi: "rảnh đến phát chán (← gaji buta)",
        pos: "adjective (slang)",
        pronunciation_vi: "GA-but",
        pronunciation_en: "GA-boot",
      },
      {
        word: "baper",
        en: "overly sensitive (← bawa perasaan)",
        vi: "dễ tự ái / để bụng (← bawa perasaan)",
        pos: "adjective (slang)",
        pronunciation_vi: "BA-per",
        pronunciation_en: "BA-per",
      },
      {
        word: "gercep",
        en: "quick to act (← gerak cepat)",
        vi: "nhanh tay (← gerak cepat)",
        pos: "adjective (slang)",
        pronunciation_vi: "GER-chep",
        pronunciation_en: "GER-chep",
      },
      {
        word: "kepo",
        en: "nosy / overly curious",
        vi: "tò mò / nhiều chuyện",
        pos: "adjective (slang)",
        pronunciation_vi: "KÉ-po",
        pronunciation_en: "KEH-po",
      },
      {
        word: "gue",
        en: "I / me (Jakarta slang = saya)",
        vi: "tôi / mình (lóng Jakarta)",
        pos: "pronoun (slang)",
        pronunciation_vi: "gu-é",
        pronunciation_en: "goo-EH",
      },
      {
        word: "lu",
        en: "you (Jakarta slang = kamu)",
        vi: "bạn / mày (lóng Jakarta)",
        pos: "pronoun (slang)",
        pronunciation_vi: "lu",
        pronunciation_en: "loo",
      },
      {
        word: "bales",
        en: "to reply (casual = membalas)",
        vi: "trả lời / hồi đáp",
        pos: "verb (slang)",
        pronunciation_vi: "BA-les",
        pronunciation_en: "BA-les",
      },
    ],
    dialogue: [
      {
        speaker: "Tio",
        text: "Lagi ngapain? Gue gabut nih di rumah.",
        vi: "Đang làm gì đó? Mình đang rảnh chán ở nhà nè.",
        en: "What are you up to? I'm bored at home.",
      },
      {
        speaker: "Sasa",
        text: "Sama, mager keluar. Hujan terus dari pagi.",
        vi: "Giống mình, lười ra ngoài. Mưa suốt từ sáng.",
        en: "Same, too lazy to go out. It's been raining since morning.",
      },
      {
        speaker: "Tio",
        text: "Yaudah nonton bareng online aja yuk. Eh, jangan baper kalau gue kalah ya.",
        vi: "Vậy xem chung online luôn đi. À, mình mà thua thì đừng dỗi nhé.",
        en: "Then let's watch together online. Hey, don't get butthurt if I lose.",
      },
      {
        speaker: "Sasa",
        text: "Wkwk santai. Lu gercep banget sih bales chat, gue suka.",
        vi: "Haha bình tĩnh. Bạn trả lời tin nhanh ghê, mình thích.",
        en: "Haha, chill. You're so quick to reply, I like that.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ lóng tâm trạng còn thiếu:",
        instruction_en: "Fill in the missing mood-slang word:",
        items: [
          {
            prompt: "Hari ini gue ___ banget, gak mau ke mana-mana. (lười)",
            answer: "mager",
            options: ["mager", "makan", "mahal"],
          },
          {
            prompt: "Lagi ___ nih, ada yang seru gak? (rảnh chán)",
            answer: "gabut",
            options: ["gabut", "gabung", "gampang"],
          },
          {
            prompt: "Jangan ___ dong, gue cuma bercanda. (tự ái)",
            answer: "baper",
            options: ["baper", "bawel", "bagus"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ lóng với cụm gốc chuẩn:",
        instruction_en: "Match each slang word with its standard source phrase:",
        items: [
          { prompt: "mager", answer: "malas gerak" },
          { prompt: "baper", answer: "bawa perasaan" },
          { prompt: "gercep", answer: "gerak cepat" },
          { prompt: "gabut", answer: "gaji buta" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Viết lại sang tiếng lóng Indonesia (bahasa gaul):",
        instruction_en: "Render into Indonesian slang (bahasa gaul):",
        items: [
          { prompt: "Hôm nay mình lười cực, chẳng muốn đi đâu.", answer: "Hari ini gue mager banget, gak mau ke mana-mana." },
          { prompt: "Đừng để bụng mà, mình chỉ đùa thôi.", answer: "Jangan baper dong, gue cuma bercanda." },
          { prompt: "Tò mò gì mà ghê, không phải việc của bạn!", answer: "Kepo banget sih lu, bukan urusan lu!" },
        ],
      },
    ],
  },
  {
    id: "indonesian_gaul_relationship_socmed",
    level: "C1",
    category: "slang",
    title_vi: "Lóng tình cảm & mạng xã hội — bucin, PHP, japri, spill",
    title_en: "Relationship & social-media slang — bucin, PHP, japri, spill",
    sentences: [
      {
        en: "Dia udah jadi bucin sejak pacaran sama anak itu.",
        vi: "Cậu ấy thành 'nô lệ tình yêu' từ lúc yêu đứa đó.",
        pronunciation_focus: [
          "bucin → 'BU-chin', viết tắt 'budak cinta' = nô lệ tình yêu (mê đắm quá mức)",
          "pacaran → pa-cha-RAN, 'yêu nhau/hẹn hò' (gốc pacar = người yêu)",
          "sama → SA-ma, ở đây = 'với' (đời thường, = dengan)",
        ],
        pronunciation_focus_en: [
          "bucin → 'BOO-chin' — short for 'budak cinta' = love-slave (over-devoted, a simp)",
          "pacaran → 'pa-cha-RAN' — to date/be in a relationship (root 'pacar' = boyfriend/girlfriend)",
          "sama → 'SA-ma' — here = 'with' (casual, = dengan)",
        ],
      },
      {
        en: "Awas di-PHP-in, dia cuma kasih harapan palsu.",
        vi: "Coi chừng bị 'thả thính hụt', cậu ta chỉ cho hy vọng hão thôi.",
        pronunciation_focus: [
          "PHP → 'pé-ha-pé', 'pemberi harapan palsu' = kẻ cho hy vọng giả",
          "di-PHP-in → bị PHP (di-…-in = dạng bị động đời thường)",
          "harapan palsu → 'hy vọng giả/hão' (palsu = giả)",
        ],
        pronunciation_focus_en: [
          "PHP → 'peh-ha-peh' — 'pemberi harapan palsu' = giver of false hope (a leader-on)",
          "di-PHP-in → 'to get PHP-ed' (di-…-in = casual passive)",
          "harapan palsu → 'false hope' (palsu = fake)",
        ],
      },
      {
        en: "Japri aja kalau mau ngobrol serius.",
        vi: "Nhắn riêng đi nếu muốn nói chuyện nghiêm túc.",
        pronunciation_focus: [
          "japri → 'JAP-ri', viết tắt 'jalur pribadi' = nhắn tin riêng (DM)",
          "ngobrol → NGO-brol, 'tán gẫu/trò chuyện' (đời thường)",
          "L1 note: âm 'ng-' đầu từ (ngobrol) khó với người Việt — luyện như 'ng' trong 'nga'",
        ],
        pronunciation_focus_en: [
          "japri → 'JAP-ree' — short for 'jalur pribadi' = private message (DM)",
          "ngobrol → 'NGOH-brol' — to chat (casual)",
          "note: word-initial 'ng-' (ngobrol) is hard for VN speakers — like the 'ng' in 'singer', moved to the front",
        ],
      },
      {
        en: "Spill dong, gimana ceritanya kalian bisa jadian?",
        vi: "Kể nghe đi, sao hai người yêu nhau được vậy?",
        pronunciation_focus: [
          "spill → mượn tiếng Anh, lóng: 'kể hết/tiết lộ'",
          "jadian → ja-DI-an, 'chính thức yêu nhau' (gốc jadi = thành + -an)",
          "kalian → ka-LI-an, 'các bạn/hai người' (số nhiều của kamu)",
        ],
        pronunciation_focus_en: [
          "spill → English loan; slang: 'tell all / share the tea'",
          "jadian → 'ja-DEE-an' — to become official (a couple) (root 'jadi' = to become + '-an')",
          "kalian → 'ka-LEE-an' — you (plural)",
        ],
      },
      {
        en: "Mereka putus minggu lalu, sekarang dia move on.",
        vi: "Họ chia tay tuần trước, giờ cậu ấy bước tiếp rồi.",
        pronunciation_focus: [
          "putus → PU-tus, 'chia tay' (đen: đứt/gãy)",
          "minggu lalu → 'tuần trước' (lalu = trước/đã qua)",
          "move on → mượn tiếng Anh, 'quên người cũ, bước tiếp'",
        ],
        pronunciation_focus_en: [
          "putus → 'POO-toos' — to break up (lit. 'to snap/break')",
          "minggu lalu → 'last week' (lalu = past/ago)",
          "move on → English loan; 'to get over an ex'",
        ],
      },
    ],
    cultural_notes_vi:
      "Lóng tình cảm của giới trẻ Indonesia trộn nhiều tiếng Anh: 'bucin' = budak cinta (nô lệ tình yêu, kiểu 'simp'), 'PHP' = pemberi harapan palsu (kẻ thả thính rồi lặn), 'japri' = jalur pribadi (nhắn riêng/DM), 'spill' và 'move on' mượn thẳng tiếng Anh. Chuỗi giai đoạn yêu đương: PDKT (pendekatan — giai đoạn 'cưa cẩm') → jadian (chính thức yêu) → pacaran (đang yêu) → putus (chia tay). Dạng bị động đời thường 'di-…-in' (di-PHP-in = bị PHP) rất hay gặp trong văn nói, khác dạng chuẩn 'di-…' của sách giáo khoa.",
    cultural_notes_en:
      "Indonesian youth relationship slang mixes in lots of English: 'bucin' = budak cinta (love-slave, a 'simp'), 'PHP' = pemberi harapan palsu (someone who leads you on then ghosts), 'japri' = jalur pribadi (private message/DM), with 'spill' and 'move on' borrowed straight from English. The dating-stage sequence: PDKT (pendekatan — the 'making moves' phase) → jadian (become official) → pacaran (dating) → putus (break up). The casual passive 'di-…-in' (di-PHP-in = to get PHP-ed) is very common in speech, distinct from the textbook 'di-…' passive.",
    tip_advice_vi:
      "Mẹo cho người Việt: để ý dạng bị động đời thường 'di-[X]-in' — khác dạng chuẩn 'di-[X]' trong sách. 'Di-PHP-in' = bị PHP, 'ditraktir-in' = được mời (ăn). Học chuỗi giai đoạn yêu (PDKT → jadian → pacaran → putus) để hiểu hội thoại. Nhiều từ là tiếng Anh nhập (spill, move on, ghosting) — phát âm gần như tiếng Anh. Cẩn thận âm 'ng-' đầu từ (ngobrol, nge-spill): người Việt hay bỏ, hãy giữ rõ.",
    tip_advice_en:
      "Tip for Vietnamese speakers: watch the casual passive 'di-[X]-in' — distinct from the textbook 'di-[X]'. 'Di-PHP-in' = to get PHP-ed, 'ditraktir-in' = to get treated (to a meal). Learn the dating-stage chain (PDKT → jadian → pacaran → putus) to follow the conversation. Many terms are English loans (spill, move on, ghosting) — pronounced almost as in English. Mind the word-initial 'ng-' (ngobrol, nge-spill): VN speakers tend to drop it — keep it crisp.",
    vocabulary: [
      {
        word: "bucin",
        en: "love-slave / simp (← budak cinta)",
        vi: "nô lệ tình yêu (← budak cinta)",
        pos: "noun (slang)",
        pronunciation_vi: "BU-chin",
        pronunciation_en: "BOO-chin",
      },
      {
        word: "PHP",
        en: "giver of false hope (← pemberi harapan palsu)",
        vi: "kẻ cho hy vọng hão (← pemberi harapan palsu)",
        pos: "noun (slang)",
        pronunciation_vi: "pé-ha-pé",
        pronunciation_en: "peh-ha-peh",
      },
      {
        word: "japri",
        en: "private message / DM (← jalur pribadi)",
        vi: "nhắn tin riêng (← jalur pribadi)",
        pos: "verb / noun (slang)",
        pronunciation_vi: "JAP-ri",
        pronunciation_en: "JAP-ree",
      },
      {
        word: "spill",
        en: "to tell all / share the tea",
        vi: "kể hết / tiết lộ",
        pos: "verb (slang, English loan)",
        pronunciation_vi: "spill",
        pronunciation_en: "spill",
      },
      {
        word: "jadian",
        en: "to become an official couple",
        vi: "chính thức yêu nhau",
        pos: "verb (slang)",
        pronunciation_vi: "ja-DI-an",
        pronunciation_en: "ja-DEE-an",
      },
      {
        word: "pacaran",
        en: "to date / be in a relationship",
        vi: "yêu nhau / hẹn hò",
        pos: "verb",
        pronunciation_vi: "pa-cha-RAN",
        pronunciation_en: "pa-cha-RAN",
      },
      {
        word: "putus",
        en: "to break up",
        vi: "chia tay",
        pos: "verb",
        pronunciation_vi: "PU-tus",
        pronunciation_en: "POO-toos",
      },
      {
        word: "PDKT",
        en: "making moves / courting phase (← pendekatan)",
        vi: "giai đoạn cưa cẩm (← pendekatan)",
        pos: "noun (slang)",
        pronunciation_vi: "pé-dé-ka-té",
        pronunciation_en: "peh-deh-ka-teh",
      },
    ],
    dialogue: [
      {
        speaker: "Mira",
        text: "Eh, spill dong! Gimana ceritanya kalian bisa jadian?",
        vi: "Ê, kể nghe đi! Sao hai người yêu nhau được vậy?",
        en: "Hey, spill! How did you two end up together?",
      },
      {
        speaker: "Dewi",
        text: "PDKT-nya lama, dia gercep banget tiap gue japri.",
        vi: "Giai đoạn cưa cẩm lâu lắm, mỗi lần mình nhắn riêng là anh ấy trả lời ngay.",
        en: "The courting phase was long; he replied super fast every time I DM'd him.",
      },
      {
        speaker: "Mira",
        text: "Untung gak di-PHP-in kayak yang dulu ya, wkwk.",
        vi: "May là không bị thả thính hụt như lần trước nhỉ, haha.",
        en: "Lucky you didn't get led on like last time, haha.",
      },
      {
        speaker: "Dewi",
        text: "Iya. Sekarang gue malah jadi bucin, parah deh.",
        vi: "Ừ. Giờ mình lại thành 'nô lệ tình yêu', hết thuốc chữa luôn.",
        en: "Yeah. Now I've become a total simp, it's bad.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ lóng tình cảm còn thiếu:",
        instruction_en: "Fill in the missing relationship-slang word:",
        items: [
          {
            prompt: "Dia udah jadi ___ sejak pacaran. (nô lệ tình yêu)",
            answer: "bucin",
            options: ["bucin", "bukan", "bumbu"],
          },
          {
            prompt: "___ aja kalau mau ngobrol serius. (nhắn riêng)",
            answer: "Japri",
            options: ["Japri", "Jajan", "Jualan"],
          },
          {
            prompt: "Mereka ___ minggu lalu, sekarang dia move on. (chia tay)",
            answer: "putus",
            options: ["putus", "pulang", "pusing"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ lóng với cụm gốc / nghĩa:",
        instruction_en: "Match each slang term with its source / meaning:",
        items: [
          { prompt: "bucin", answer: "budak cinta" },
          { prompt: "PHP", answer: "pemberi harapan palsu" },
          { prompt: "japri", answer: "jalur pribadi" },
          { prompt: "jadian", answer: "chính thức yêu nhau" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Viết lại sang tiếng lóng Indonesia (bahasa gaul):",
        instruction_en: "Render into Indonesian slang (bahasa gaul):",
        items: [
          { prompt: "Kể nghe đi, sao hai người yêu nhau được vậy?", answer: "Spill dong, gimana ceritanya kalian bisa jadian?" },
          { prompt: "Nhắn riêng đi nếu muốn nói chuyện nghiêm túc.", answer: "Japri aja kalau mau ngobrol serius." },
          { prompt: "Coi chừng bị thả thính hụt.", answer: "Awas di-PHP-in." },
        ],
      },
    ],
  },
];

export default bahasaGaulAdvancedLessons;
