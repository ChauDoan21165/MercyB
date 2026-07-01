// Advanced Connectors & Debate Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// register/debate notes with English companions in pronunciation_focus_en.

export type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

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
};

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_advanced_connectors_debate",
    level: "B2",
    category: "debate",
    title_vi: "Liên từ nâng cao và tranh luận lịch sự",
    title_en: "Advanced connectors and polite debate",
    sentences: [
      {
        en: "Menurut saya, kebijakan ini perlu dikaji ulang.",
        vi: "Theo tôi, chính sách này cần được xem xét lại.",
        pronunciation_focus: [
          "me-NU-rut SA-ya, ke-BI-ja-kan I-ni per-LU di-KA-ji U-lang - `menurut saya` = theo tôi; `dikaji ulang` = được xem xét lại.",
          "Lỗi người Việt: mở tranh luận bằng `saya pikir` trong mọi ngữ cảnh. `Menurut saya` tự nhiên hơn trong ý kiến cá nhân lịch sự.",
          "Luyện: `Menurut saya, ini perlu dikaji ulang.`",
        ],
        pronunciation_focus_en: [
          "me-NU-rut SA-ya, ke-BI-ja-kan I-ni per-LU di-KA-ji OO-lang - `menurut saya` = in my opinion; `dikaji ulang` = reviewed/reconsidered.",
          "VN-speaker trap: opening every argument with `saya pikir`. `Menurut saya` is more natural for polite personal opinion.",
          "Drill: `Menurut saya, ini perlu dikaji ulang.`",
        ],
      },
      {
        en: "Di sisi lain, biaya pelaksanaannya juga harus diperhitungkan.",
        vi: "Mặt khác, chi phí thực hiện cũng phải được tính đến.",
        pronunciation_focus: [
          "di SI-si LA-in, bi-A-ya pe-lak-sa-NA-an-nya JU-ga HA-rus di-per-hi-TUNG-kan - `di sisi lain` = mặt khác; `diperhitungkan` = được tính đến.",
          "Lỗi người Việt: dùng `di lain sisi`. Dạng cố định tự nhiên là `di sisi lain`.",
          "Luyện: `Di sisi lain, biayanya besar.`",
        ],
        pronunciation_focus_en: [
          "di SI-si LA-in, bee-A-ya pe-lak-sa-NA-an-nya JOO-ga HA-rus di-per-hi-TOONG-kan - `di sisi lain` = on the other hand; `diperhitungkan` = taken into account.",
          "VN-speaker trap: saying `di lain sisi`. The natural fixed connector is `di sisi lain`.",
          "Drill: `Di sisi lain, biayanya besar.`",
        ],
      },
      {
        en: "Meskipun begitu, manfaatnya tidak bisa diabaikan.",
        vi: "Mặc dù vậy, lợi ích của nó không thể bị bỏ qua.",
        pronunciation_focus: [
          "mes-ki-PUN be-GI-tu, man-FA-at-nya ti-DAK BI-sa di-a-BAI-kan - `meskipun begitu` = mặc dù vậy; `diabaikan` = bị bỏ qua.",
          "Lỗi người Việt: thêm `tetapi` sau `meskipun begitu`. Tiếng Indonesia không cần gấp đôi `mặc dù... nhưng`.",
          "Luyện: `Meskipun begitu, manfaatnya besar.`",
        ],
        pronunciation_focus_en: [
          "mes-kee-POON be-GI-too, man-FA-at-nya ti-DAK BI-sa di-a-BAI-kan - `meskipun begitu` = even so/nevertheless; `diabaikan` = ignored.",
          "VN-speaker trap: adding `tetapi` after `meskipun begitu`. Indonesian does not double 'although... but'.",
          "Drill: `Meskipun begitu, manfaatnya besar.`",
        ],
      },
      {
        en: "Oleh karena itu, kita perlu mencari solusi yang seimbang.",
        vi: "Vì vậy, chúng ta cần tìm giải pháp cân bằng.",
        pronunciation_focus: [
          "O-leh ka-RE-na I-tu, KI-ta per-LU men-CA-ri so-LU-si yang se-IM-bang - `oleh karena itu` = bởi vậy/do đó; `seimbang` = cân bằng.",
          "Lỗi người Việt: dùng `jadi` trong bài nói trang trọng quá nhiều. `Oleh karena itu` trang trọng hơn cho kết luận.",
          "Luyện: `Oleh karena itu, kita perlu solusi.`",
        ],
        pronunciation_focus_en: [
          "O-leh ka-RE-na I-too, KI-ta per-LOO men-CHA-ri so-LOO-si yang se-IM-bang - `oleh karena itu` = therefore; `seimbang` = balanced.",
          "VN-speaker trap: overusing casual `jadi` in formal speech. `Oleh karena itu` is stronger for conclusions.",
          "Drill: `Oleh karena itu, kita perlu solusi.`",
        ],
      },
      {
        en: "Sebagai contoh, program serupa berhasil di kota lain.",
        vi: "Ví dụ, chương trình tương tự đã thành công ở thành phố khác.",
        pronunciation_focus: [
          "se-BA-gai CON-toh, PRO-gram se-RU-pa ber-HAS-il di KO-ta LA-in - `sebagai contoh` = ví dụ; `serupa` = tương tự.",
          "Lỗi người Việt: chỉ nói `contohnya` trong bài tranh luận trang trọng. `Sebagai contoh` mở dẫn chứng rõ hơn.",
          "Luyện: `Sebagai contoh, lihat kota lain.`",
        ],
        pronunciation_focus_en: [
          "se-BA-gai CHON-toh, PRO-gram se-ROO-pa ber-HA-sil di KO-ta LA-in - `sebagai contoh` = for example; `serupa` = similar.",
          "VN-speaker trap: only saying casual `contohnya` in formal debate. `Sebagai contoh` introduces evidence more clearly.",
          "Drill: `Sebagai contoh, lihat kota lain.`",
        ],
      },
      {
        en: "Saya memahami pendapat Anda, tetapi saya kurang setuju.",
        vi: "Tôi hiểu ý kiến của anh/chị, nhưng tôi không hẳn đồng ý.",
        pronunciation_focus: [
          "SA-ya me-ma-HA-mi pen-DA-pat AN-da, te-TA-pi SA-ya KU-rang se-TU-ju - `kurang setuju` = không hẳn đồng ý.",
          "Lỗi người Việt: phản bác thẳng `saya tidak setuju` ngay. `Saya kurang setuju` mềm hơn và giữ lịch sự.",
          "Luyện: `Saya memahami, tetapi kurang setuju.`",
        ],
        pronunciation_focus_en: [
          "SA-ya me-ma-HA-mi pen-DA-pat AN-da, te-TA-pi SA-ya KOO-rang se-TOO-joo - `kurang setuju` = I don't quite agree.",
          "VN-speaker trap: bluntly starting with `saya tidak setuju`. `Saya kurang setuju` is softer and polite.",
          "Drill: `Saya memahami, tetapi kurang setuju.`",
        ],
      },
      {
        en: "Izinkan saya menyanggah pendapat tersebut dengan data.",
        vi: "Cho phép tôi phản biện ý kiến đó bằng dữ liệu.",
        pronunciation_focus: [
          "i-ZIN-kan SA-ya me-NYANG-gah pen-DA-pat ter-se-BUT de-NGAN DA-ta - `menyanggah pendapat` = phản biện ý kiến.",
          "Lỗi người Việt: dùng `melawan` cho phản biện. `Melawan` nghe như chống đối/đánh nhau; tranh luận dùng `menyanggah`.",
          "Luyện: `Saya ingin menyanggah pendapat tersebut.`",
        ],
        pronunciation_focus_en: [
          "i-ZIN-kan SA-ya me-NYANG-gah pen-DA-pat ter-se-BUT de-NGAN DA-ta - `menyanggah pendapat` = rebut an argument.",
          "VN-speaker trap: using `melawan` for rebuttal. `Melawan` sounds like fighting/resisting; debate uses `menyanggah`.",
          "Drill: `Saya ingin menyanggah pendapat tersebut.`",
        ],
      },
      {
        en: "Argumen itu menarik; namun, buktinya belum cukup kuat.",
        vi: "Lập luận đó thú vị; tuy nhiên, bằng chứng chưa đủ mạnh.",
        pronunciation_focus: [
          "ar-gu-MEN I-tu me-NA-rik; NA-mun, BUK-ti-nya be-LUM CU-kup KU-at - `namun` = tuy nhiên, thường mở mệnh đề/câu trang trọng.",
          "Lỗi người Việt: đặt `namun` giữa câu như `tapi` mà không ngắt. Trong văn viết, dùng `; namun,` hoặc câu mới.",
          "Luyện: `Namun, buktinya belum kuat.`",
        ],
        pronunciation_focus_en: [
          "ar-goo-MEN I-too me-NA-rik; NA-mun, BUK-ti-nya be-LUM CHOO-kup KOO-at - `namun` = however, a formal contrast connector.",
          "VN-speaker trap: placing `namun` mid-sentence like `tapi` with no break. In writing, use `; namun,` or a new sentence.",
          "Drill: `Namun, buktinya belum kuat.`",
        ],
      },
      {
        en: "Dengan kata lain, masalahnya bukan pada niat, melainkan pada pelaksanaan.",
        vi: "Nói cách khác, vấn đề không nằm ở ý định mà nằm ở việc thực hiện.",
        pronunciation_focus: [
          "de-NGAN KA-ta LA-in, ma-SA-lah-nya BU-kan PA-da ni-AT, me-LAIN-kan PA-da pe-lak-sa-NA-an - `dengan kata lain` = nói cách khác; `melainkan` = mà là.",
          "Lỗi người Việt: dùng `tapi` sau `bukan`. Khung trang trọng: `bukan A, melainkan B`.",
          "Luyện: `Bukan pada niat, melainkan pada pelaksanaan.`",
        ],
        pronunciation_focus_en: [
          "de-NGAN KA-ta LA-in, ma-SA-lah-nya BOO-kan PA-da ni-AT, me-LAIN-kan PA-da pe-lak-sa-NA-an - `dengan kata lain` = in other words; `melainkan` = but rather.",
          "VN-speaker trap: using `tapi` after `bukan`. Formal frame: `bukan A, melainkan B`.",
          "Drill: `Bukan pada niat, melainkan pada pelaksanaan.`",
        ],
      },
      {
        en: "Saya setuju sebagian, hanya saja ada risiko yang perlu dibahas.",
        vi: "Tôi đồng ý một phần, chỉ là có rủi ro cần được thảo luận.",
        pronunciation_focus: [
          "SA-ya se-TU-ju se-BA-gi-an, HA-nya SA-ja A-da RI-si-ko yang per-LU di-BA-has - `setuju sebagian` = đồng ý một phần; `hanya saja` = chỉ là.",
          "Lỗi người Việt: chỉ nói `setuju tapi`. `Setuju sebagian, hanya saja...` nghe mềm và chuyên nghiệp hơn.",
          "Luyện: `Saya setuju sebagian.`",
        ],
        pronunciation_focus_en: [
          "SA-ya se-TOO-joo se-BA-gi-an, HA-nya SA-ja A-da RI-si-ko yang per-LOO di-BA-has - `setuju sebagian` = partly agree; `hanya saja` = the only thing is.",
          "VN-speaker trap: only saying `setuju tapi`. `Setuju sebagian, hanya saja...` sounds softer and more professional.",
          "Drill: `Saya setuju sebagian.`",
        ],
      },
      {
        en: "Kesimpulannya, kita sepakat pada tujuan, tetapi berbeda soal cara.",
        vi: "Kết luận là, chúng ta đồng ý về mục tiêu nhưng khác nhau về cách làm.",
        pronunciation_focus: [
          "ke-sim-PUL-an-nya, KI-ta se-PA-kat PA-da tu-JU-an, te-TA-pi ber-BE-da so-AL CA-ra - `kesimpulannya` = kết luận là; `sepakat` = đồng thuận.",
          "Lỗi người Việt: kết thúc tranh luận bằng cảm xúc. Dùng `kesimpulannya` để tóm ý và giữ giọng bình tĩnh.",
          "Luyện: `Kesimpulannya, kita sepakat pada tujuan.`",
        ],
        pronunciation_focus_en: [
          "ke-sim-POOL-an-nya, KI-ta se-PA-kat PA-da too-JOO-an, te-TA-pi ber-BE-da so-AL CHA-ra - `kesimpulannya` = in conclusion; `sepakat` = agree/consensus.",
          "VN-speaker trap: ending a debate with emotion. Use `kesimpulannya` to summarize calmly.",
          "Drill: `Kesimpulannya, kita sepakat pada tujuan.`",
        ],
      },
      {
        en: "Mari kita menanggapi gagasan, bukan menyerang orangnya.",
        vi: "Hãy phản hồi ý tưởng, không công kích con người.",
        pronunciation_focus: [
          "MA-ri KI-ta me-nang-GAP-i ga-GAS-an, BU-kan me-NYE-rang O-rang-nya - `menanggapi` = phản hồi; `menyerang orangnya` = công kích cá nhân.",
          "Lỗi người Việt: dịch `attack the idea` bằng `serang`. Trong tranh luận lịch sự, dùng `menanggapi gagasan`.",
          "Luyện: `Tanggapi gagasan, bukan orangnya.`",
        ],
        pronunciation_focus_en: [
          "MA-ri KI-ta me-nang-GAP-i ga-GAS-an, BOO-kan me-NYE-rang O-rang-nya - `menanggapi` = respond to; `menyerang orangnya` = attack the person.",
          "VN-speaker trap: using `serang` too much. In polite debate, say `menanggapi gagasan`.",
          "Drill: `Tanggapi gagasan, bukan orangnya.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong tranh luận lịch sự bằng tiếng Indonesia, người nói thường làm mềm phản bác bằng `menurut saya`, `saya memahami pendapat Anda`, `saya kurang setuju`, hoặc `izinkan saya menyanggah`. Các liên từ như `di sisi lain`, `meskipun begitu`, `oleh karena itu`, `sebagai contoh`, `namun`, và `dengan kata lain` giúp lập luận rõ mà không nghe công kích. Mục tiêu là giữ `debat sopan`: phản hồi gagasan, không menyerang orangnya.",
    cultural_notes_en:
      "In polite Indonesian debate, speakers often soften disagreement with `menurut saya`, `saya memahami pendapat Anda`, `saya kurang setuju`, or `izinkan saya menyanggah`. Connectors such as `di sisi lain`, `meskipun begitu`, `oleh karena itu`, `sebagai contoh`, `namun`, and `dengan kata lain` make arguments clear without sounding aggressive. The goal is `debat sopan`: respond to ideas, not attack the person.",
    tip_advice_vi:
      "Mẹo cho người Việt: tránh bê cấu trúc tiếng Việt `mặc dù... nhưng...` sang Indonesia. Dùng một liên từ là đủ: `Meskipun begitu, ...` hoặc `Namun, ...`. Khi phản bác, tránh `kamu salah`; hãy dùng `saya kurang setuju karena...`, `data menunjukkan...`, hoặc `izinkan saya menyanggah...`. Giữ đại từ trang trọng `saya/Anda/Bapak/Ibu` trong tranh luận công khai.",
    tip_advice_en:
      "Tip for Vietnamese speakers: avoid copying Vietnamese `although... but...` into Indonesian. One connector is enough: `Meskipun begitu, ...` or `Namun, ...`. When disagreeing, avoid `kamu salah`; use `saya kurang setuju karena...`, `data menunjukkan...`, or `izinkan saya menyanggah...`. Keep formal pronouns `saya/Anda/Bapak/Ibu` in public debate.",
    vocabulary: [
      { word: "menurut saya", en: "in my opinion", vi: "theo tôi", pos: "phrase", pronunciation_vi: "me-NU-rut SA-ya", pronunciation_en: "me-NU-root SA-ya" },
      { word: "di sisi lain", en: "on the other hand", vi: "mặt khác", pos: "connector", pronunciation_vi: "di SI-si LA-in", pronunciation_en: "di SI-si LA-in" },
      { word: "meskipun begitu", en: "even so / nevertheless", vi: "mặc dù vậy", pos: "connector", pronunciation_vi: "mes-ki-PUN be-GI-tu", pronunciation_en: "mes-kee-POON be-GI-too" },
      { word: "oleh karena itu", en: "therefore", vi: "do đó / vì vậy", pos: "connector", pronunciation_vi: "O-leh ka-RE-na I-tu", pronunciation_en: "O-leh ka-RE-na I-too" },
      { word: "sebagai contoh", en: "for example", vi: "ví dụ", pos: "connector", pronunciation_vi: "se-BA-gai CON-toh", pronunciation_en: "se-BA-gai CHON-toh" },
      { word: "menyanggah pendapat", en: "rebut an opinion/argument", vi: "phản biện ý kiến", pos: "verb phrase", pronunciation_vi: "me-NYANG-gah pen-DA-pat", pronunciation_en: "me-NYANG-gah pen-DA-pat" },
      { word: "debat sopan", en: "polite debate", vi: "tranh luận lịch sự", pos: "noun phrase", pronunciation_vi: "de-BAT SO-pan", pronunciation_en: "de-BAT SO-pan" },
      { word: "kurang setuju", en: "do not quite agree", vi: "không hẳn đồng ý", pos: "phrase", pronunciation_vi: "KU-rang se-TU-ju", pronunciation_en: "KOO-rang se-TOO-joo" },
      { word: "bukan A, melainkan B", en: "not A, but rather B", vi: "không phải A mà là B", pos: "frame", pronunciation_vi: "BU-kan ... me-LAIN-kan ...", pronunciation_en: "BOO-kan ... me-LAIN-kan ..." },
      { word: "kesimpulannya", en: "in conclusion", vi: "kết luận là", pos: "connector", pronunciation_vi: "ke-sim-PUL-an-nya", pronunciation_en: "ke-sim-POOL-an-nya" },
    ],
    dialogue: [
      {
        speaker: "Moderator",
        text: "Menurut Anda, apakah program ini perlu dilanjutkan?",
        vi: "Theo anh/chị, chương trình này có cần tiếp tục không?",
        en: "In your opinion, should this program be continued?",
      },
      {
        speaker: "Raka",
        text: "Menurut saya, program ini bermanfaat. Sebagai contoh, banyak warga terbantu.",
        vi: "Theo tôi, chương trình này có ích. Ví dụ, nhiều người dân đã được hỗ trợ.",
        en: "In my opinion, this program is useful. For example, many residents were helped.",
      },
      {
        speaker: "Sari",
        text: "Saya memahami pendapat itu. Di sisi lain, biayanya terlalu besar.",
        vi: "Tôi hiểu ý kiến đó. Mặt khác, chi phí quá lớn.",
        en: "I understand that opinion. On the other hand, the cost is too high.",
      },
      {
        speaker: "Raka",
        text: "Meskipun begitu, kita bisa mencari solusi yang lebih seimbang.",
        vi: "Mặc dù vậy, chúng ta có thể tìm giải pháp cân bằng hơn.",
        en: "Even so, we can look for a more balanced solution.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền liên từ/cụm tranh luận phù hợp:",
        instruction_en: "Fill in the appropriate debate connector:",
        items: [
          {
            prompt: "___ saya, kebijakan ini perlu dikaji ulang. (theo tôi)",
            answer: "Menurut",
            options: ["Menurut", "Meskipun", "Melainkan"],
          },
          {
            prompt: "___, biaya pelaksanaannya juga harus diperhitungkan. (mặt khác)",
            answer: "Di sisi lain",
            options: ["Di sisi lain", "Oleh karena itu", "Sebagai contoh"],
          },
          {
            prompt: "___, kita perlu mencari solusi yang seimbang. (do đó)",
            answer: "Oleh karena itu",
            options: ["Oleh karena itu", "Hanya saja", "Menurut saya"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối cụm tiếng Indonesia với nghĩa tiếng Việt:",
        instruction_en: "Match each Indonesian phrase with its Vietnamese meaning:",
        items: [
          { prompt: "meskipun begitu", answer: "mặc dù vậy" },
          { prompt: "sebagai contoh", answer: "ví dụ" },
          { prompt: "kurang setuju", answer: "không hẳn đồng ý" },
          { prompt: "kesimpulannya", answer: "kết luận là" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Theo tôi, chính sách này cần được xem xét lại.", answer: "Menurut saya, kebijakan ini perlu dikaji ulang." },
          { prompt: "Mặt khác, chi phí cũng phải được tính đến.", answer: "Di sisi lain, biaya juga harus diperhitungkan." },
          { prompt: "Tôi hiểu ý kiến của anh/chị, nhưng tôi không hẳn đồng ý.", answer: "Saya memahami pendapat Anda, tetapi saya kurang setuju." },
        ],
      },
    ],
  },
];

export default lessons;
