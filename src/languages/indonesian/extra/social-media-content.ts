// Social Media & Content Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack. The shape mirrors sibling Indonesian extra
// files: Indonesian target text lives in `en`, Vietnamese glosses in `vi`,
// `pronunciation_focus` contains Vietnamese L1 notes, and
// `pronunciation_focus_en` is the English companion in the same order.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  /** Indonesian word/phrase. */
  word: string;
  /** English meaning. */
  en: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Part of speech. */
  pos: string;
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  speaker: string;
  /** Indonesian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
  en?: string;
};

// Loosely typed so per-type fields (translation, fill_blank, matching) can vary.
export type IndonesianExercise = Record<string, any>;

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

export const socialMediaContentLessons: IndonesianLesson[] = [
  {
    id: "indonesian_social_media_content",
    level: "B1",
    category: "technology_communication",
    title_vi: "Mạng xã hội, konten và netizen Indonesia",
    title_en: "Social media, content and Indonesian netizens",
    sentences: [
      {
        en: "Saya mau membuat konten tentang makanan Indonesia.",
        vi: "Tôi muốn làm nội dung về đồ ăn Indonesia.",
        pronunciation_focus: [
          "SA-ya mau mem-BU-at KON-ten ten-TANG ma-KA-nan in-do-NE-sia - `konten` = nội dung số.",
          "`membuat konten` tự nhiên hơn `mengerjakan konten` khi nói sáng tạo nội dung.",
          "Lỗi người Việt: đọc `konten` như tiếng Anh. Trong Indonesia, âm cuối rõ: KON-ten.",
          "Luyện: `Saya membuat konten tentang makanan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau mem-BOO-at KON-ten ten-TANG ma-KA-nan in-do-NE-sia - `konten` = digital content.",
          "`membuat konten` is more natural than `mengerjakan konten` for creating content.",
          "VN-speaker trap: reading `konten` like English. In Indonesian, keep the final syllable clear: KON-ten.",
          "Drill: `Saya membuat konten tentang makanan.`",
        ],
      },
      {
        en: "Besok pagi saya akan unggah foto baru di Instagram.",
        vi: "Sáng mai tôi sẽ đăng ảnh mới lên Instagram.",
        pronunciation_focus: [
          "be-SOK PA-gi a-KAN UNG-gah FO-to BA-ru - `unggah` = đăng/tải lên.",
          "`di Instagram` = trên Instagram; dùng `di` cho nền tảng.",
          "Lỗi người Việt: chỉ dùng `post`. Từ Indonesia chuẩn là `unggah`, trong nói chuyện cũng nghe `posting`.",
          "Luyện: `Saya unggah foto baru.`",
        ],
        pronunciation_focus_en: [
          "be-SOK PA-gee a-KAN OONG-gah FO-to BA-roo - `unggah` = upload/post.",
          "`di Instagram` = on Instagram; use `di` for a platform.",
          "VN-speaker trap: only using `post`. Standard Indonesian is `unggah`; casual speech also uses `posting`.",
          "Drill: `Saya unggah foto baru.`",
        ],
      },
      {
        en: "Captionnya harus singkat, jelas, dan menarik.",
        vi: "Caption phải ngắn, rõ và hấp dẫn.",
        pronunciation_focus: [
          "CAP-tion-nya HA-rus SING-kat JE-las dan me-NA-rik - `caption` thường giữ dạng tiếng Anh.",
          "`singkat, jelas, dan menarik` = ngắn, rõ và hấp dẫn; bộ ba rất dùng được trong marketing.",
          "Lỗi người Việt: dùng `pendek` cho caption. `Singkat` tự nhiên hơn cho văn bản ngắn gọn.",
          "Luyện: `Captionnya singkat dan menarik.`",
        ],
        pronunciation_focus_en: [
          "CAP-tion-nya HA-roos SING-kat JE-las dan me-NA-rik - `caption` commonly stays as an English loanword.",
          "`singkat, jelas, dan menarik` = short, clear, and engaging; a useful marketing trio.",
          "VN-speaker trap: using `pendek` for a caption. `Singkat` is more natural for concise text.",
          "Drill: `Captionnya singkat dan menarik.`",
        ],
      },
      {
        en: "Banyak followers meninggalkan komentar positif.",
        vi: "Nhiều người theo dõi để lại bình luận tích cực.",
        pronunciation_focus: [
          "BA-nyak FOL-lo-wers me-ning-GAL-kan ko-MEN-tar po-SI-tif - `followers` dùng phổ biến trong mạng xã hội.",
          "`meninggalkan komentar` = để lại bình luận; trang trọng hơn `komen`.",
          "Lỗi người Việt: lẫn `komentar` và `komen`. `Komentar` trung tính/chuẩn, `komen` thân mật.",
          "Luyện: `Followers meninggalkan komentar.`",
        ],
        pronunciation_focus_en: [
          "BA-nyak FOL-lo-wers me-ning-GAL-kan ko-MEN-tar po-SEE-tif - `followers` is common in social media Indonesian.",
          "`meninggalkan komentar` = leave a comment; more formal than `komen`.",
          "VN-speaker trap: mixing `komentar` and `komen`. `Komentar` is standard, `komen` is casual.",
          "Drill: `Followers meninggalkan komentar.`",
        ],
      },
      {
        en: "Video itu viral karena dibagikan oleh banyak netizen.",
        vi: "Video đó viral vì được nhiều netizen chia sẻ.",
        pronunciation_focus: [
          "VI-de-o I-tu VI-ral ka-RE-na di-ba-GI-kan o-LEH BA-nyak NE-ti-zen.",
          "`dibagikan` = được chia sẻ; bị động `di-` rất hay dùng khi nói nội dung lan truyền.",
          "`netizen` = cư dân mạng; trong Indonesia nghe rất thường xuyên.",
          "Luyện: `Video itu viral.`",
        ],
        pronunciation_focus_en: [
          "VEE-de-o EE-too VEE-ral ka-RE-na dee-ba-GEE-kan o-LEH BA-nyak NE-ti-zen.",
          "`dibagikan` = was shared; passive `di-` is common for content spread.",
          "`netizen` = internet users/netizens; very common in Indonesian media.",
          "Drill: `Video itu viral.`",
        ],
      },
      {
        en: "Malam ini kami live streaming untuk menjawab pertanyaan penonton.",
        vi: "Tối nay chúng tôi livestream để trả lời câu hỏi của người xem.",
        pronunciation_focus: [
          "MA-lam I-ni KA-mi live STREAM-ing un-TUK men-JA-wab per-TA-nya-an pe-NON-ton.",
          "`kami` = chúng tôi không gồm người nghe; nếu gồm người xem, dùng `kita`.",
          "`penonton` = người xem/khán giả; từ gốc `tonton`.",
          "Luyện: `Kami live streaming malam ini.`",
        ],
        pronunciation_focus_en: [
          "MA-lam EE-nee KA-mee live STREAM-ing un-TOOK men-JA-wab per-TA-nya-an pe-NON-ton.",
          "`kami` = we excluding the listener; if including viewers, use `kita`.",
          "`penonton` = viewers/audience; from root `tonton`.",
          "Drill: `Kami live streaming malam ini.`",
        ],
      },
      {
        en: "Brand itu menawarkan kerja sama endorse lewat DM.",
        vi: "Nhãn hàng đó đề nghị hợp tác endorse qua tin nhắn DM.",
        pronunciation_focus: [
          "brand I-tu me-na-WAR-kan KER-ja SA-ma EN-dorse le-WAT de-em.",
          "`kerja sama endorse` = hợp tác quảng bá/endorse; cách nói rất thường trong creator economy.",
          "`lewat DM` = qua tin nhắn trực tiếp; `lewat` dùng cho kênh/phương tiện.",
          "Luyện: `Brand menawarkan kerja sama endorse.`",
        ],
        pronunciation_focus_en: [
          "brand EE-too me-na-WAR-kan KER-ja SA-ma EN-dorse le-WAT dee-em.",
          "`kerja sama endorse` = endorsement collaboration; common in the creator economy.",
          "`lewat DM` = through direct message; `lewat` marks the channel/medium.",
          "Drill: `Brand menawarkan kerja sama endorse.`",
        ],
      },
      {
        en: "Jangan membalas komentar kasar dengan emosi.",
        vi: "Đừng trả lời bình luận thô lỗ bằng cảm xúc nóng giận.",
        pronunciation_focus: [
          "JA-ngan mem-BA-las ko-MEN-tar KA-sar de-NGAN e-MO-si.",
          "`membalas komentar` = phản hồi/trả lời bình luận; `balas` = đáp lại.",
          "`kasar` = thô lỗ/cộc cằn; không phải 'to' như nghĩa gốc vật lý.",
          "Luyện: `Jangan membalas dengan emosi.`",
        ],
        pronunciation_focus_en: [
          "JA-ngan mem-BA-las ko-MEN-tar KA-sar de-NGAN e-MO-si.",
          "`membalas komentar` = reply to a comment; `balas` = respond/answer back.",
          "`kasar` = rude/harsh here, not physically rough.",
          "Drill: `Jangan membalas dengan emosi.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ngôn ngữ mạng xã hội Indonesia pha rất nhiều từ mượn tiếng Anh: `konten`, `caption`, `followers`, `live streaming`, `viral`, `endorse`, `DM`, nhưng vẫn dùng khung Indonesia như `unggah foto`, `meninggalkan komentar`, `dibagikan`, `kerja sama`, `menjawab pertanyaan`. `Netizen` ở Indonesia thường rất aktif: họ có thể làm một nội dung viral, nhưng cũng có thể để lại komentar kasar. Với người học Việt Nam, điểm quan trọng là phân biệt giọng thân mật (`komen`, `posting`) và giọng chuẩn hơn (`komentar`, `unggah`).",
    cultural_notes_en:
      "Indonesian social-media language mixes many English loanwords: `konten`, `caption`, `followers`, `live streaming`, `viral`, `endorse`, `DM`, while still using Indonesian frames such as `unggah foto`, `meninggalkan komentar`, `dibagikan`, `kerja sama`, and `menjawab pertanyaan`. Indonesian `netizen` are very active: they can make content go viral, but can also leave harsh comments. For Vietnamese learners, the key is register: casual (`komen`, `posting`) versus more standard (`komentar`, `unggah`).",
    tip_advice_vi:
      "Mẹo cho người Việt: đừng cố dịch mọi thuật ngữ mạng xã hội sang từ thuần Indonesia. Nhiều từ tiếng Anh đã là cách nói tự nhiên. Nhưng động từ và cấu trúc câu vẫn nên đúng Indonesia: `unggah foto`, `tulis caption`, `balas komentar`, `video itu viral`, `kerja sama endorse lewat DM`. Khi gặp bình luận xấu, câu an toàn là `Terima kasih masukannya` hoặc im lặng, không `membalas dengan emosi`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: do not force every social-media term into pure Indonesian. Many English words are already natural. But keep the Indonesian verbs and sentence frames correct: `unggah foto`, `tulis caption`, `balas komentar`, `video itu viral`, `kerja sama endorse lewat DM`. For negative comments, a safe line is `Terima kasih masukannya`, or simply do not reply emotionally.",
    vocabulary: [
      {
        word: "konten",
        en: "content",
        vi: "nội dung",
        pos: "noun",
        pronunciation_vi: "KON-ten",
        pronunciation_en: "KON-ten",
      },
      {
        word: "unggah foto",
        en: "upload/post a photo",
        vi: "đăng ảnh / tải ảnh lên",
        pos: "verb phrase",
        pronunciation_vi: "UNG-gah FO-to",
        pronunciation_en: "OONG-gah FO-to",
      },
      {
        word: "caption",
        en: "caption",
        vi: "chú thích/caption bài đăng",
        pos: "noun",
        pronunciation_vi: "CAP-tion",
        pronunciation_en: "CAP-tion",
      },
      {
        word: "komentar",
        en: "comment",
        vi: "bình luận",
        pos: "noun",
        pronunciation_vi: "ko-MEN-tar",
        pronunciation_en: "ko-MEN-tar",
      },
      {
        word: "followers",
        en: "followers",
        vi: "người theo dõi",
        pos: "noun",
        pronunciation_vi: "FOL-lo-wers",
        pronunciation_en: "FOL-lo-wers",
      },
      {
        word: "live streaming",
        en: "live streaming",
        vi: "phát trực tiếp / livestream",
        pos: "noun / verb phrase",
        pronunciation_vi: "live STREAM-ing",
        pronunciation_en: "live STREAM-ing",
      },
      {
        word: "viral",
        en: "viral",
        vi: "lan truyền mạnh / viral",
        pos: "adjective",
        pronunciation_vi: "VI-ral",
        pronunciation_en: "VEE-ral",
      },
      {
        word: "endorse",
        en: "endorsement / paid promotion",
        vi: "quảng bá có tài trợ",
        pos: "noun / verb",
        pronunciation_vi: "EN-dorse",
        pronunciation_en: "EN-dorse",
      },
      {
        word: "netizen",
        en: "netizen / internet user",
        vi: "cư dân mạng",
        pos: "noun",
        pronunciation_vi: "NE-ti-zen",
        pronunciation_en: "NE-ti-zen",
      },
      {
        word: "dibagikan",
        en: "shared",
        vi: "được chia sẻ",
        pos: "passive verb",
        pronunciation_vi: "di-ba-GI-kan",
        pronunciation_en: "dee-ba-GEE-kan",
      },
    ],
    dialogue: [
      {
        speaker: "Ayu",
        text: "Caption untuk foto ini sudah oke belum?",
        vi: "Caption cho ảnh này đã ổn chưa?",
        en: "Is the caption for this photo okay yet?",
      },
      {
        speaker: "Linh",
        text: "Sudah bagus, tapi mungkin dibuat lebih singkat.",
        vi: "Đã tốt rồi, nhưng có lẽ nên làm ngắn hơn.",
        en: "It is good, but maybe make it shorter.",
      },
      {
        speaker: "Ayu",
        text: "Kalau video ini viral, brand bisa tertarik endorse.",
        vi: "Nếu video này viral, nhãn hàng có thể quan tâm endorse.",
        en: "If this video goes viral, brands may be interested in endorsement.",
      },
      {
        speaker: "Linh",
        text: "Iya, tapi jangan lupa balas komentar dengan sopan.",
        vi: "Ừ, nhưng đừng quên trả lời bình luận một cách lịch sự.",
        en: "Yes, but do not forget to reply to comments politely.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ/cụm từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word or phrase with its Vietnamese meaning:",
        items: [
          { prompt: "unggah foto", answer: "đăng ảnh" },
          { prompt: "komentar", answer: "bình luận" },
          { prompt: "followers", answer: "người theo dõi" },
          { prompt: "netizen", answer: "cư dân mạng" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu:",
        instruction_en: "Fill in the missing word:",
        items: [
          {
            prompt: "Saya mau membuat ___ tentang makanan Indonesia. (nội dung)",
            answer: "konten",
            options: ["konten", "kantor", "kartu"],
          },
          {
            prompt: "Besok saya akan ___ foto baru. (đăng/tải lên)",
            answer: "unggah",
            options: ["unggah", "undang", "ulang"],
          },
          {
            prompt: "Video itu ___ karena dibagikan banyak netizen. (viral)",
            answer: "viral",
            options: ["viral", "formal", "final"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Caption phải ngắn và rõ.", answer: "Captionnya harus singkat dan jelas." },
          { prompt: "Tối nay chúng tôi livestream.", answer: "Malam ini kami live streaming." },
          { prompt: "Đừng trả lời bình luận thô lỗ bằng cảm xúc.", answer: "Jangan membalas komentar kasar dengan emosi." },
        ],
      },
    ],
  },
];

export default socialMediaContentLessons;
