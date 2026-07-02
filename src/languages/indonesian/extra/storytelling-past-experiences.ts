// Storytelling Past Experiences Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// storytelling/grammar notes with English companions in pronunciation_focus_en.

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
    id: "indonesian_storytelling_past_experiences",
    level: "B1",
    category: "storytelling",
    title_vi: "Kể chuyện về trải nghiệm trong quá khứ",
    title_en: "Storytelling about past experiences",
    sentences: [
      {
        en: "Saya mau bercerita tentang pengalaman masa lalu.",
        vi: "Tôi muốn kể về một trải nghiệm trong quá khứ.",
        pronunciation_focus: [
          "SA-ya MAU ber-ce-RI-ta ten-TANG peng-a-LA-man MA-sa LA-lu - `bercerita` = kể chuyện; `pengalaman masa lalu` = trải nghiệm quá khứ.",
          "Lỗi người Việt: dùng `cerita` như động từ trong văn nói trang trọng. Động từ đầy đủ là `bercerita`.",
          "Luyện: `Saya mau bercerita.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU ber-che-REE-ta ten-TANG peng-a-LA-man MA-sa LA-loo - `bercerita` = tell a story; `pengalaman masa lalu` = past experience.",
          "VN-speaker trap: using `cerita` as the verb in more careful speech. The full verb is `bercerita`.",
          "Drill: `Saya mau bercerita.`",
        ],
      },
      {
        en: "Waktu itu, saya baru pertama kali naik kereta malam.",
        vi: "Lúc đó, đó là lần đầu tiên tôi đi tàu đêm.",
        pronunciation_focus: [
          "WAK-tu I-tu, SA-ya BA-ru per-TA-ma KA-li NAIK ke-RE-ta MA-lam - `waktu itu` = lúc đó; `pertama kali` = lần đầu.",
          "Lỗi người Việt: dùng `ketika itu` trong kể chuyện đời thường nghe hơi sách vở. `Waktu itu` tự nhiên hơn.",
          "Luyện: `Waktu itu, saya baru pertama kali...`",
        ],
        pronunciation_focus_en: [
          "WAK-too I-too, SA-ya BA-roo per-TA-ma KA-li NAIK ke-RE-ta MA-lam - `waktu itu` = at that time; `pertama kali` = first time.",
          "VN-speaker trap: using `ketika itu` in casual storytelling; it can sound bookish. `Waktu itu` is more natural.",
          "Drill: `Waktu itu, saya baru pertama kali...`",
        ],
      },
      {
        en: "Awalnya semuanya berjalan lancar.",
        vi: "Ban đầu mọi thứ diễn ra suôn sẻ.",
        pronunciation_focus: [
          "A-wal-nya se-MU-a-nya ber-JA-lan LAN-car - `awalnya` = ban đầu; `berjalan lancar` = diễn ra suôn sẻ.",
          "Lỗi người Việt: dịch `mọi thứ chạy tốt` thành `semua lari baik`. Sự việc diễn ra là `berjalan lancar`.",
          "Luyện: `Awalnya berjalan lancar.`",
        ],
        pronunciation_focus_en: [
          "A-wal-nya se-MOO-a-nya ber-JA-lan LAN-char - `awalnya` = at first; `berjalan lancar` = went smoothly.",
          "VN-speaker trap: translating 'everything ran well' literally. Events `berjalan lancar`.",
          "Drill: `Awalnya berjalan lancar.`",
        ],
      },
      {
        en: "Tiba-tiba, lampu di gerbong mati.",
        vi: "Đột nhiên, đèn trong toa tàu tắt.",
        pronunciation_focus: [
          "TI-ba-TI-ba, LAM-pu di GER-bong MA-ti - `tiba-tiba` = đột nhiên; `gerbong` = toa tàu; `mati` = tắt/chết.",
          "Lỗi người Việt: dùng `mendadak` cho mọi cú chuyển. `Tiba-tiba` rất tự nhiên để tạo cao trào kể chuyện.",
          "Luyện: `Tiba-tiba, lampu mati.`",
        ],
        pronunciation_focus_en: [
          "TI-ba-TI-ba, LAM-poo di GER-bong MA-ti - `tiba-tiba` = suddenly; `gerbong` = train carriage; `mati` = went out/off.",
          "VN-speaker trap: using `mendadak` for every twist. `Tiba-tiba` is very natural for story turns.",
          "Drill: `Tiba-tiba, lampu mati.`",
        ],
      },
      {
        en: "Saya panik sebentar, lalu tertawa karena ternyata salah gerbong.",
        vi: "Tôi hoảng một chút, rồi cười vì hóa ra lên nhầm toa.",
        pronunciation_focus: [
          "SA-ya PA-nik se-BEN-tar, LA-lu ter-TA-wa ka-RE-na ter-NYA-ta SA-lah GER-bong - `ternyata` = hóa ra; `salah gerbong` = nhầm toa.",
          "Lỗi người Việt: dịch `hóa ra` thành `menjadi`. Trong kể chuyện bất ngờ dùng `ternyata`.",
          "Luyện: `Ternyata saya salah gerbong.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PA-nik se-BEN-tar, LA-loo ter-TA-wa ka-RE-na ter-NYA-ta SA-lah GER-bong - `ternyata` = it turned out; `salah gerbong` = wrong carriage.",
          "VN-speaker trap: translating 'turns out' as `menjadi`. In storytelling surprises, use `ternyata`.",
          "Drill: `Ternyata saya salah gerbong.`",
        ],
      },
      {
        en: "Akhirnya, saya menemukan tempat duduk yang benar.",
        vi: "Cuối cùng, tôi tìm được chỗ ngồi đúng.",
        pronunciation_focus: [
          "a-KHIR-nya, SA-ya me-ne-MU-kan TEM-pat DU-duk yang be-NAR - `akhirnya` = cuối cùng; `tempat duduk` = chỗ ngồi.",
          "Lỗi người Việt: dùng `terakhir` để mở kết quả. `Terakhir` = cuối cùng trong danh sách; kết quả câu chuyện là `akhirnya`.",
          "Luyện: `Akhirnya, saya menemukan...`",
        ],
        pronunciation_focus_en: [
          "a-KHIR-nya, SA-ya me-ne-MOO-kan TEM-pat DOO-dook yang be-NAR - `akhirnya` = finally; `tempat duduk` = seat.",
          "VN-speaker trap: using `terakhir` for story resolution. `Terakhir` = last in a list; the narrative result is `akhirnya`.",
          "Drill: `Akhirnya, saya menemukan...`",
        ],
      },
      {
        en: "Dari pengalaman itu, saya belajar untuk selalu mengecek tiket.",
        vi: "Từ trải nghiệm đó, tôi học được là luôn phải kiểm tra vé.",
        pronunciation_focus: [
          "da-RI peng-a-LA-man I-tu, SA-ya be-LA-jar UN-tuk se-LA-lu me-NGE-cek TI-ket - `dari pengalaman itu` = từ trải nghiệm đó; `belajar untuk` = học được rằng/nên.",
          "Lỗi người Việt: dịch `lesson learned` bằng tiếng Anh. Câu Indonesia tự nhiên: `saya belajar untuk...`.",
          "Luyện: `Saya belajar untuk lebih hati-hati.`",
        ],
        pronunciation_focus_en: [
          "da-REE peng-a-LA-man I-too, SA-ya be-LA-jar UN-tuk se-LA-loo me-NGE-chek TI-ket - `dari pengalaman itu` = from that experience; `belajar untuk` = learned to.",
          "VN-speaker trap: importing English 'lesson learned'. Natural Indonesian: `saya belajar untuk...`.",
          "Drill: `Saya belajar untuk lebih hati-hati.`",
        ],
      },
      {
        en: "Cerita lucu itu masih sering saya ingat sampai sekarang.",
        vi: "Câu chuyện vui đó tôi vẫn thường nhớ đến tận bây giờ.",
        pronunciation_focus: [
          "ce-RI-ta LU-cu I-tu MA-sih SE-ring SA-ya I-ngat SAM-pai se-ka-RANG - `cerita lucu` = chuyện hài/vui; `sampai sekarang` = đến bây giờ.",
          "Lỗi người Việt: `lucu` không chỉ là dễ thương; trong câu chuyện, `cerita lucu` = chuyện buồn cười.",
          "Luyện: `Cerita itu masih saya ingat.`",
        ],
        pronunciation_focus_en: [
          "che-REE-ta LOO-choo I-too MA-sih SE-ring SA-ya I-ngat SAM-pai se-ka-RANG - `cerita lucu` = funny story; `sampai sekarang` = until now.",
          "VN-speaker trap: thinking `lucu` only means cute. In stories, `cerita lucu` = funny story.",
          "Drill: `Cerita itu masih saya ingat.`",
        ],
      },
      {
        en: "Dulu saya takut berbicara dengan orang asing.",
        vi: "Trước đây tôi sợ nói chuyện với người lạ.",
        pronunciation_focus: [
          "DU-lu SA-ya TA-kut ber-bi-CA-ra de-NGAN O-rang A-sing - `dulu` = trước đây; `orang asing` = người lạ/người nước ngoài tùy ngữ cảnh.",
          "Lỗi người Việt: dùng `sebelum` một mình cho 'trước đây'. Kể quá khứ chung dùng `dulu`.",
          "Luyện: `Dulu saya takut...`",
        ],
        pronunciation_focus_en: [
          "DOO-loo SA-ya TA-kut ber-bi-CHA-ra de-NGAN O-rang A-sing - `dulu` = in the past; `orang asing` = stranger/foreigner by context.",
          "VN-speaker trap: using bare `sebelum` for 'before/in the past'. General past storytelling uses `dulu`.",
          "Drill: `Dulu saya takut...`",
        ],
      },
      {
        en: "Sejak saat itu, saya jadi lebih percaya diri.",
        vi: "Từ lúc đó, tôi trở nên tự tin hơn.",
        pronunciation_focus: [
          "SE-jak SA-at I-tu, SA-ya JA-di LE-bih per-CA-ya DI-ri - `sejak saat itu` = từ lúc đó; `percaya diri` = tự tin.",
          "Lỗi người Việt: dịch `tự tin` là `percaya saya`. Cụm đúng là `percaya diri`.",
          "Luyện: `Saya jadi lebih percaya diri.`",
        ],
        pronunciation_focus_en: [
          "SE-jak SA-at I-too, SA-ya JA-di LE-bih per-CHA-ya DI-ri - `sejak saat itu` = since then; `percaya diri` = confident.",
          "VN-speaker trap: translating confidence as `percaya saya`. The correct phrase is `percaya diri`.",
          "Drill: `Saya jadi lebih percaya diri.`",
        ],
      },
      {
        en: "Kalau dipikir-pikir, pengalaman itu sangat berharga.",
        vi: "Nghĩ lại thì trải nghiệm đó rất quý giá.",
        pronunciation_focus: [
          "KA-lau di-PI-kir-PI-kir, peng-a-LA-man I-tu SA-ngat ber-HAR-ga - `kalau dipikir-pikir` = nghĩ lại thì; `berharga` = quý giá.",
          "Lỗi người Việt: dịch `nghĩ đi nghĩ lại` quá sát. Cụm kể chuyện tự nhiên là `kalau dipikir-pikir`.",
          "Luyện: `Kalau dipikir-pikir, itu berharga.`",
        ],
        pronunciation_focus_en: [
          "KA-lau di-PI-kir-PI-kir, peng-a-LA-man I-too SA-ngat ber-HAR-ga - `kalau dipikir-pikir` = when I think about it; `berharga` = valuable.",
          "VN-speaker trap: translating Vietnamese 'thinking back and forth' too literally. Natural storytelling phrase: `kalau dipikir-pikir`.",
          "Drill: `Kalau dipikir-pikir, itu berharga.`",
        ],
      },
      {
        en: "Begitulah cerita saya, semoga bisa menjadi pelajaran hidup.",
        vi: "Câu chuyện của tôi là như vậy, hy vọng có thể trở thành bài học cuộc sống.",
        pronunciation_focus: [
          "be-GI-tu-lah ce-RI-ta SA-ya, se-MO-ga BI-sa men-JA-di pe-la-JAR-an HI-dup - `begitulah` = là như vậy đó; `pelajaran hidup` = bài học cuộc sống.",
          "Lỗi người Việt: kết thúc bằng `selesai`. Trong kể chuyện, `begitulah cerita saya` nghe tự nhiên và mềm hơn.",
          "Luyện: `Begitulah cerita saya.`",
        ],
        pronunciation_focus_en: [
          "be-GI-too-lah che-REE-ta SA-ya, se-MO-ga BI-sa men-JA-di pe-la-JAR-an HI-dup - `begitulah` = that's how it was; `pelajaran hidup` = life lesson.",
          "VN-speaker trap: ending with `selesai`. In storytelling, `begitulah cerita saya` sounds more natural and gentle.",
          "Drill: `Begitulah cerita saya.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi người Indonesia kể chuyện đời thường, họ hay dùng mốc thời gian và từ chuyển cảnh như `dulu`, `waktu itu`, `awalnya`, `lalu`, `tiba-tiba`, `ternyata`, `akhirnya`, `sejak saat itu`. Câu chuyện thường kết bằng cảm xúc hoặc bài học: `saya belajar...`, `pengalaman itu berharga`, `jadi pelajaran hidup`. Vì tiếng Indonesia không chia thì, các từ thời gian này chính là thứ làm câu chuyện rõ quá khứ.",
    cultural_notes_en:
      "In everyday Indonesian storytelling, people rely on time anchors and transition words such as `dulu`, `waktu itu`, `awalnya`, `lalu`, `tiba-tiba`, `ternyata`, `akhirnya`, and `sejak saat itu`. Stories often end with a feeling or lesson: `saya belajar...`, `pengalaman itu berharga`, `jadi pelajaran hidup`. Since Indonesian verbs do not conjugate for tense, these time words are what make the story clearly past.",
    tip_advice_vi:
      "Mẹo cho người Việt: lợi thế lớn là tiếng Việt cũng kể quá khứ bằng từ thời gian, không chia động từ. Hãy xây khung 5 bước: `Dulu/Waktu itu` (bối cảnh), `Awalnya` (ban đầu), `Tiba-tiba` (bước ngoặt), `Akhirnya` (kết quả), `Dari pengalaman itu...` (bài học). Đừng lạm dụng `sudah`; kể chuyện cần mốc thời gian và liên từ hơn là dấu thì.",
    tip_advice_en:
      "Tip for Vietnamese speakers: your advantage is that Vietnamese also tells past stories with time words rather than verb conjugation. Build a five-step frame: `Dulu/Waktu itu` (background), `Awalnya` (beginning), `Tiba-tiba` (turning point), `Akhirnya` (result), `Dari pengalaman itu...` (lesson). Do not overuse `sudah`; storytelling needs time anchors and connectors more than tense markers.",
    vocabulary: [
      { word: "bercerita", en: "to tell a story", vi: "kể chuyện", pos: "verb", pronunciation_vi: "ber-ce-RI-ta", pronunciation_en: "ber-che-REE-ta" },
      { word: "pengalaman masa lalu", en: "past experience", vi: "trải nghiệm quá khứ", pos: "noun phrase", pronunciation_vi: "peng-a-LA-man MA-sa LA-lu", pronunciation_en: "peng-a-LA-man MA-sa LA-loo" },
      { word: "waktu itu", en: "at that time", vi: "lúc đó", pos: "time phrase", pronunciation_vi: "WAK-tu I-tu", pronunciation_en: "WAK-too I-too" },
      { word: "tiba-tiba", en: "suddenly", vi: "đột nhiên", pos: "adverb", pronunciation_vi: "TI-ba-TI-ba", pronunciation_en: "TEE-ba-TEE-ba" },
      { word: "akhirnya", en: "finally / in the end", vi: "cuối cùng", pos: "adverb", pronunciation_vi: "a-KHIR-nya", pronunciation_en: "a-KHIR-nya" },
      { word: "ternyata", en: "it turned out", vi: "hóa ra", pos: "adverb", pronunciation_vi: "ter-NYA-ta", pronunciation_en: "ter-NYA-ta" },
      { word: "pelajaran hidup", en: "life lesson", vi: "bài học cuộc sống", pos: "noun phrase", pronunciation_vi: "pe-la-JAR-an HI-dup", pronunciation_en: "pe-la-JAR-an HI-dup" },
      { word: "cerita lucu", en: "funny story", vi: "câu chuyện vui", pos: "noun phrase", pronunciation_vi: "ce-RI-ta LU-cu", pronunciation_en: "che-REE-ta LOO-choo" },
      { word: "sejak saat itu", en: "since then", vi: "từ lúc đó", pos: "time phrase", pronunciation_vi: "SE-jak SA-at I-tu", pronunciation_en: "SE-jak SA-at I-too" },
      { word: "kalau dipikir-pikir", en: "when I think about it", vi: "nghĩ lại thì", pos: "phrase", pronunciation_vi: "KA-lau di-PI-kir-PI-kir", pronunciation_en: "KA-lau di-PI-kir-PI-kir" },
    ],
    dialogue: [
      {
        speaker: "Ayu",
        text: "Kamu punya cerita lucu waktu pertama kali tinggal di Jakarta?",
        vi: "Bạn có câu chuyện vui nào lúc lần đầu sống ở Jakarta không?",
        en: "Do you have a funny story from when you first lived in Jakarta?",
      },
      {
        speaker: "Minh",
        text: "Ada. Waktu itu saya naik kereta malam untuk pertama kali.",
        vi: "Có. Lúc đó tôi đi tàu đêm lần đầu tiên.",
        en: "Yes. At that time I took a night train for the first time.",
      },
      {
        speaker: "Minh",
        text: "Awalnya lancar, tapi tiba-tiba saya sadar ternyata salah gerbong.",
        vi: "Ban đầu suôn sẻ, nhưng đột nhiên tôi nhận ra hóa ra nhầm toa.",
        en: "At first it went smoothly, but suddenly I realized I was in the wrong carriage.",
      },
      {
        speaker: "Ayu",
        text: "Akhirnya bagaimana?",
        vi: "Cuối cùng thì sao?",
        en: "What happened in the end?",
      },
      {
        speaker: "Minh",
        text: "Akhirnya saya menemukan tempat duduk yang benar. Dari pengalaman itu, saya belajar untuk selalu mengecek tiket.",
        vi: "Cuối cùng tôi tìm được chỗ ngồi đúng. Từ trải nghiệm đó, tôi học được là luôn kiểm tra vé.",
        en: "Finally I found the correct seat. From that experience, I learned to always check my ticket.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ nối kể chuyện phù hợp:",
        instruction_en: "Fill in the appropriate storytelling connector:",
        items: [
          {
            prompt: "___, lampu di gerbong mati. (đột nhiên)",
            answer: "Tiba-tiba",
            options: ["Tiba-tiba", "Akhirnya", "Dulu"],
          },
          {
            prompt: "___, saya menemukan tempat duduk yang benar. (cuối cùng)",
            answer: "Akhirnya",
            options: ["Akhirnya", "Awalnya", "Waktu itu"],
          },
          {
            prompt: "___ pengalaman itu, saya belajar untuk selalu mengecek tiket. (từ)",
            answer: "Dari",
            options: ["Dari", "Di", "Ke"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối cụm tiếng Indonesia với nghĩa tiếng Việt:",
        instruction_en: "Match each Indonesian phrase with its Vietnamese meaning:",
        items: [
          { prompt: "waktu itu", answer: "lúc đó" },
          { prompt: "ternyata", answer: "hóa ra" },
          { prompt: "pelajaran hidup", answer: "bài học cuộc sống" },
          { prompt: "kalau dipikir-pikir", answer: "nghĩ lại thì" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn kể về một trải nghiệm trong quá khứ.", answer: "Saya mau bercerita tentang pengalaman masa lalu." },
          { prompt: "Đột nhiên, tôi nhận ra mình nhầm toa.", answer: "Tiba-tiba, saya sadar ternyata salah gerbong." },
          { prompt: "Từ trải nghiệm đó, tôi học được là phải cẩn thận hơn.", answer: "Dari pengalaman itu, saya belajar untuk lebih hati-hati." },
        ],
      },
    ],
  },
];

export default lessons;
