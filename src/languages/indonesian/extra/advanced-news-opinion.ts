// Advanced news opinion Indonesian (Vietnamese -> Indonesian study track).
//
// A2 Wave 32 file. Covers opini berita, sudut pandang, narasumber, fakta vs
// opini, bias media, menanggapi berita, and diskusi sopan.
// Self-contained so no registry or sibling agent files are touched.
//
// Field convention: sentence `en` holds the target Indonesian line, `vi` holds
// the Vietnamese gloss. `pronunciation_focus` carries Vietnamese-facing notes
// and common L1 traps; `pronunciation_focus_en` mirrors the same order for
// English-speaking companions.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length and order. */
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  /** Indonesian word/phrase. */
  word: string;
  /** English meaning. */
  en: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Part of speech, e.g. "noun", "verb", "phrase". */
  pos: string;
  /** Vietnamese pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English pronunciation hint, stressed syllable in CAPS. */
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

// Loosely typed so per-type fields (translation, fill-blank, matching) can vary.
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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_advanced_news_opinion",
    level: "B2",
    category: "media_literacy",
    title_vi: "Ý kiến về tin tức và thảo luận lịch sự",
    title_en: "Advanced news opinion and polite discussion",
    sentences: [
      {
        en: "Menurut saya, opini berita itu perlu dibedakan dari laporan fakta.",
        vi: "Theo tôi, ý kiến trong tin đó cần được phân biệt với bản tường thuật sự kiện.",
        pronunciation_focus: [
          "me-NU-rut SA-ya, o-PI-ni be-RI-ta I-tu PER-lu di-be-DA-kan da-ri la-PO-ran FAK-ta - `opini berita` = ý kiến/bình luận về tin; `laporan fakta` = tường thuật sự kiện.",
          "`dibedakan dari` = được phân biệt với. Dùng khi tách hai loại thông tin.",
          "Lỗi người Việt: dịch `ý kiến tin tức` thành `pendapat kabar`. Với báo chí, dùng `opini berita` hoặc `opini tentang berita`.",
        ],
        pronunciation_focus_en: [
          "me-NOO-root SA-ya, o-PEE-nee be-REE-ta EE-too PER-loo dee-be-DA-kan da-ree la-PO-ran FAK-ta - `opini berita` = news opinion/commentary; `laporan fakta` = factual report.",
          "`Dibedakan dari` = distinguished from. Use it when separating two kinds of information.",
          "VN-speaker trap: translating 'news opinion' as `pendapat kabar`. In journalism, use `opini berita` or `opini tentang berita`.",
        ],
      },
      {
        en: "Sudut pandang penulis terlihat jelas dari pilihan katanya.",
        vi: "Góc nhìn của tác giả thể hiện rõ qua cách chọn từ.",
        pronunciation_focus: [
          "SU-dut PAN-dang pe-NU-lis ter-LI-hat je-LAS da-ri pi-LI-han KA-ta-nya - `sudut pandang` = góc nhìn; `pilihan kata` = lựa chọn từ ngữ.",
          "`terlihat jelas` = thấy rõ/hiện rõ. Dùng khi phân tích giọng điệu bài viết.",
          "Lỗi người Việt: dùng `sisi lihat` để dịch góc nhìn. Cụm đúng là `sudut pandang`.",
        ],
        pronunciation_focus_en: [
          "SOO-doot PAN-dang peh-NOO-lis ter-LEE-hat je-LAS da-ree pee-LEE-han KA-ta-nya - `sudut pandang` = point of view; `pilihan kata` = word choice.",
          "`Terlihat jelas` = clearly visible/apparent. Use it to analyze an article's tone.",
          "VN-speaker trap: translating point of view as `sisi lihat`. Correct phrase: `sudut pandang`.",
        ],
      },
      {
        en: "Narasumber dalam artikel itu hanya berasal dari satu pihak.",
        vi: "Nguồn/người được trích dẫn trong bài đó chỉ đến từ một phía.",
        pronunciation_focus: [
          "na-ra-SUM-ber DA-lam ar-TI-kel I-tu HA-nya ber-A-sal da-ri SA-tu PI-hak - `narasumber` = nguồn/người cung cấp thông tin; `satu pihak` = một phía.",
          "`berasal dari` = xuất phát từ/đến từ. Câu này giúp nói về cân bằng nguồn tin.",
          "Lỗi người Việt: nói `sumber orang`. Trong ngôn ngữ báo chí Indonesia, người được hỏi là `narasumber`.",
        ],
        pronunciation_focus_en: [
          "na-ra-SOOM-ber DA-lam ar-TEE-kel EE-too HA-nya ber-A-sal da-ree SA-too PEE-hak - `narasumber` = source/interviewee; `satu pihak` = one side.",
          "`Berasal dari` = come from/originate from. This helps discuss balance of sources.",
          "VN-speaker trap: saying `sumber orang`. In Indonesian journalism, an interviewed source is `narasumber`.",
        ],
      },
      {
        en: "Kita perlu memisahkan fakta, opini, dan asumsi pribadi.",
        vi: "Chúng ta cần tách sự kiện, ý kiến, và giả định cá nhân.",
        pronunciation_focus: [
          "KI-ta PER-lu me-mi-SAH-kan FAK-ta, o-PI-ni, dan a-SUM-si pri-BA-di - `fakta` = sự kiện/sự thật; `asumsi pribadi` = giả định cá nhân.",
          "`memisahkan A, B, dan C` là khung rất tốt khi phân tích bài báo.",
          "Lỗi người Việt: dùng `fakta` cho mọi điều nghe có vẻ đúng. `Fakta` cần có bằng chứng/kiểm chứng.",
        ],
        pronunciation_focus_en: [
          "KEE-ta PER-loo meh-mee-SAH-kan FAK-ta, o-PEE-nee, dan a-SOOM-see pree-BA-dee - `fakta` = fact; `asumsi pribadi` = personal assumption.",
          "`Memisahkan A, B, dan C` is a strong frame for article analysis.",
          "VN-speaker note: do not use `fakta` for everything that sounds true. `Fakta` needs evidence/verification.",
        ],
      },
      {
        en: "Kalimat itu terdengar seperti opini, bukan fakta yang sudah diverifikasi.",
        vi: "Câu đó nghe như ý kiến, không phải sự kiện đã được xác minh.",
        pronunciation_focus: [
          "KA-li-mat I-tu ter-DE-ngar se-PER-ti o-PI-ni, BU-kan FAK-ta yang SU-dah di-ve-ri-fi-KA-si - `terdengar seperti` = nghe như; `diverifikasi` = được xác minh.",
          "`bukan fakta yang sudah diverifikasi` là cách phản biện mềm, không công kích người nói.",
          "Lỗi người Việt: nói thẳng `itu salah` dễ gây căng. Câu này chính xác và lịch sự hơn.",
        ],
        pronunciation_focus_en: [
          "KA-lee-mat EE-too ter-DENG-ar seh-PER-tee o-PEE-nee, BOO-kan FAK-ta yang SOO-dah dee-veh-ree-fee-KA-see - `terdengar seperti` = sounds like; `diverifikasi` = verified.",
          "`Bukan fakta yang sudah diverifikasi` is a soft rebuttal, not a personal attack.",
          "VN-speaker trap: saying blunt `itu salah` can escalate. This sentence is more precise and polite.",
        ],
      },
      {
        en: "Saya melihat ada bias media dalam cara berita itu disusun.",
        vi: "Tôi thấy có thiên kiến truyền thông trong cách tin đó được sắp xếp.",
        pronunciation_focus: [
          "SA-ya me-LI-hat A-da BI-as ME-di-a DA-lam CA-ra be-RI-ta I-tu di-SU-sun - `bias media` = thiên kiến truyền thông; `disusun` = được sắp xếp/biên soạn.",
          "`cara berita itu disusun` nói về cấu trúc, thứ tự thông tin, và cách nhấn mạnh.",
          "Lỗi người Việt: `bias` trong Indonesia thường đọc BI-as, không phải tiếng Anh `bai-as`.",
        ],
        pronunciation_focus_en: [
          "SA-ya meh-LEE-hat A-da BEE-as ME-dee-a DA-lam CHA-ra be-REE-ta EE-too dee-SOO-soon - `bias media` = media bias; `disusun` = arranged/composed.",
          "`Cara berita itu disusun` refers to structure, order of information, and emphasis.",
          "VN-speaker note: Indonesian `bias` is commonly pronounced BEE-as, not English `bye-as`.",
        ],
      },
      {
        en: "Judulnya netral, tetapi paragraf pembukanya cukup memihak.",
        vi: "Tiêu đề trung lập, nhưng đoạn mở đầu khá nghiêng về một phía.",
        pronunciation_focus: [
          "JU-dul-nya ne-TRAL, te-TA-pi pa-ra-GRAF pem-BU-ka-nya CU-kup me-MI-hak - `netral` = trung lập; `memihak` = thiên vị/nghiêng về một bên.",
          "`cukup memihak` mềm hơn `sangat tidak netral`, phù hợp khi thảo luận sopan.",
          "Lỗi người Việt: dịch `thiên vị` thành `pilih kasih` trong báo chí. Với lập luận/news, dùng `memihak`.",
        ],
        pronunciation_focus_en: [
          "JOO-dool-nya neh-TRAL, teh-TA-pee pa-ra-GRAF pem-BOO-ka-nya CHOO-kup meh-MEE-hak - `netral` = neutral; `memihak` = side with/be biased toward.",
          "`Cukup memihak` is softer than `sangat tidak netral`, useful for polite discussion.",
          "VN-speaker trap: translating bias as `pilih kasih` in journalism. For arguments/news, use `memihak`.",
        ],
      },
      {
        en: "Saya ingin menanggapi berita itu tanpa menyerang orang yang berbeda pendapat.",
        vi: "Tôi muốn phản hồi tin đó mà không công kích người có ý kiến khác.",
        pronunciation_focus: [
          "SA-ya I-ngin me-nang-GA-pi be-RI-ta I-tu TAN-pa me-nye-RANG O-rang yang ber-BE-da pen-DA-pat - `menanggapi berita` = phản hồi tin; `berbeda pendapat` = có ý kiến khác.",
          "`tanpa menyerang orang` giữ cuộc thảo luận tập trung vào nội dung, không vào cá nhân.",
          "Lỗi người Việt: dùng `jawab berita` nghe như trả lời một tin nhắn. Với news/opinion, dùng `menanggapi`.",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin meh-nang-GA-pee be-REE-ta EE-too TAN-pa meh-nyeh-RANG O-rang yang ber-BEH-da pen-DA-pat - `menanggapi berita` = respond to news; `berbeda pendapat` = hold a different opinion.",
          "`Tanpa menyerang orang` keeps the discussion focused on content, not the person.",
          "VN-speaker trap: `jawab berita` sounds like replying to a message. For news/opinion, use `menanggapi`.",
        ],
      },
      {
        en: "Dalam diskusi sopan, kita bisa tidak setuju tanpa merendahkan pihak lain.",
        vi: "Trong thảo luận lịch sự, chúng ta có thể không đồng ý mà không hạ thấp phía khác.",
        pronunciation_focus: [
          "DA-lam dis-KU-si SO-pan, KI-ta BI-sa ti-DAK se-TU-ju TAN-pa me-ren-DAH-kan PI-hak LA-in - `diskusi sopan` = thảo luận lịch sự; `merendahkan` = hạ thấp/coi thường.",
          "`tidak setuju tanpa...` là khung rất tốt khi nói tranh luận văn minh.",
          "Lỗi người Việt: dùng `tidak sepakat` cũng được, nhưng `tidak setuju` phổ biến hơn trong nói hằng ngày.",
        ],
        pronunciation_focus_en: [
          "DA-lam dis-KOO-see SO-pan, KEE-ta BEE-sa tee-DAK seh-TOO-joo TAN-pa meh-ren-DAH-kan PEE-hak LA-in - `diskusi sopan` = polite discussion; `merendahkan` = belittle.",
          "`Tidak setuju tanpa...` is a strong frame for civil disagreement.",
          "VN-speaker note: `tidak sepakat` is also valid, but `tidak setuju` is more common in daily speech.",
        ],
      },
      {
        en: "Boleh berbeda pendapat, asal kita tetap membahas isi beritanya.",
        vi: "Có thể khác ý kiến, miễn là chúng ta vẫn bàn về nội dung tin.",
        pronunciation_focus: [
          "BO-leh ber-BE-da pen-DA-pat, A-sal KI-ta te-TAP mem-BA-has I-si be-RI-ta-nya - `asal` = miễn là; `isi berita` = nội dung tin.",
          "`boleh berbeda pendapat` nghe cởi mở và giữ không khí tốt.",
          "Lỗi người Việt: dịch `miễn là` thành `gratis`. Ở đây `asal` = miễn là/miễn sao.",
        ],
        pronunciation_focus_en: [
          "BO-leh ber-BEH-da pen-DA-pat, A-sal KEE-ta teh-TAP mem-BA-has EE-see be-REE-ta-nya - `asal` = as long as; `isi berita` = news content.",
          "`Boleh berbeda pendapat` sounds open and keeps a constructive tone.",
          "VN-speaker trap: translating 'as long as' as `gratis`. Here `asal` = as long as/provided that.",
        ],
      },
      {
        en: "Sebelum membagikan opini, saya ingin mengecek sumber dan konteksnya.",
        vi: "Trước khi chia sẻ ý kiến, tôi muốn kiểm tra nguồn và bối cảnh của nó.",
        pronunciation_focus: [
          "se-BE-lum mem-BA-gi-kan o-PI-ni, SA-ya I-ngin me-NGE-cek SUM-ber dan KON-teks-nya - `sumber` = nguồn; `konteks` = bối cảnh.",
          "`mengecek sumber dan konteks` là thói quen media literacy tốt.",
          "Lỗi người Việt: chỉ nói `cek berita` hơi chung. Cụ thể hơn: `cek sumber dan konteks`.",
        ],
        pronunciation_focus_en: [
          "seh-BE-loom mem-BA-gee-kan o-PEE-nee, SA-ya EE-ngin meh-NGE-chek SOOM-ber dan KON-teks-nya - `sumber` = source; `konteks` = context.",
          "`Mengecek sumber dan konteks` is a good media-literacy habit.",
          "VN-speaker note: `cek berita` is broad. More specific: `cek sumber dan konteks`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi membahas berita dalam bahasa Indonesia, người nói thường memisahkan `fakta`, `opini`, `asumsi`, dan `sudut pandang`. Diskusi yang baik tidak langsung menyerang orang lain, tetapi menanyakan `narasumber`, `konteks`, dan apakah ada `bias media`. Để giữ suasana sopan, gunakan pembuka seperti `menurut saya`, `saya melihat`, `kalimat itu terdengar seperti...`, dan `boleh berbeda pendapat, asal...`.",
    cultural_notes_en:
      "When discussing news in Indonesian, speakers often separate facts, opinion, assumptions, and point of view. Good discussion does not attack other people directly, but asks about sources, context, and possible media bias. To keep the tone polite, use openings like `menurut saya`, `saya melihat`, `kalimat itu terdengar seperti...`, and `boleh berbeda pendapat, asal...`.",
    tip_advice_vi:
      "Khung nên thuộc: `Menurut saya...`, `Sudut pandang penulis...`, `Narasumbernya berasal dari...`, `Ini fakta atau opini?`, `Saya melihat ada bias media...`, `Saya ingin menanggapi tanpa menyerang...`.",
    tip_advice_en:
      "Chunks to memorize: `Menurut saya...`, `Sudut pandang penulis...`, `Narasumbernya berasal dari...`, `Ini fakta atau opini?`, `Saya melihat ada bias media...`, `Saya ingin menanggapi tanpa menyerang...`.",
    vocabulary: [
      {
        word: "opini berita",
        en: "news opinion/commentary",
        vi: "ý kiến/bình luận về tin tức",
        pos: "noun",
        pronunciation_vi: "o-PI-ni be-RI-ta",
        pronunciation_en: "o-PEE-nee be-REE-ta",
      },
      {
        word: "sudut pandang",
        en: "point of view",
        vi: "góc nhìn",
        pos: "noun",
        pronunciation_vi: "SU-dut PAN-dang",
        pronunciation_en: "SOO-doot PAN-dang",
      },
      {
        word: "narasumber",
        en: "source; interviewee",
        vi: "nguồn/người cung cấp thông tin",
        pos: "noun",
        pronunciation_vi: "na-ra-SUM-ber",
        pronunciation_en: "na-ra-SOOM-ber",
      },
      {
        word: "fakta",
        en: "fact",
        vi: "sự kiện/sự thật",
        pos: "noun",
        pronunciation_vi: "FAK-ta",
        pronunciation_en: "FAK-ta",
      },
      {
        word: "asumsi pribadi",
        en: "personal assumption",
        vi: "giả định cá nhân",
        pos: "noun",
        pronunciation_vi: "a-SUM-si pri-BA-di",
        pronunciation_en: "a-SOOM-see pree-BA-dee",
      },
      {
        word: "bias media",
        en: "media bias",
        vi: "thiên kiến truyền thông",
        pos: "noun",
        pronunciation_vi: "BI-as ME-di-a",
        pronunciation_en: "BEE-as ME-dee-a",
      },
      {
        word: "menanggapi berita",
        en: "respond to news",
        vi: "phản hồi tin tức",
        pos: "verb phrase",
        pronunciation_vi: "me-nang-GA-pi be-RI-ta",
        pronunciation_en: "meh-nang-GA-pee be-REE-ta",
      },
      {
        word: "diskusi sopan",
        en: "polite discussion",
        vi: "thảo luận lịch sự",
        pos: "noun",
        pronunciation_vi: "dis-KU-si SO-pan",
        pronunciation_en: "dis-KOO-see SO-pan",
      },
      {
        word: "memihak",
        en: "to side with; be biased toward",
        vi: "nghiêng về một phía/thiên vị",
        pos: "verb",
        pronunciation_vi: "me-MI-hak",
        pronunciation_en: "meh-MEE-hak",
      },
      {
        word: "diverifikasi",
        en: "verified",
        vi: "được xác minh",
        pos: "verb",
        pronunciation_vi: "di-ve-ri-fi-KA-si",
        pronunciation_en: "dee-veh-ree-fee-KA-see",
      },
    ],
    dialogue: [
      {
        speaker: "Rina",
        text: "Menurutmu, artikel ini fakta atau opini?",
        vi: "Theo bạn, bài này là sự kiện hay ý kiến?",
        en: "In your view, is this article fact or opinion?",
      },
      {
        speaker: "Adi",
        text: "Sebagian faktanya jelas, tapi sudut pandang penulisnya juga kuat.",
        vi: "Một phần sự kiện rõ ràng, nhưng góc nhìn của tác giả cũng mạnh.",
        en: "Some of the facts are clear, but the writer's point of view is also strong.",
      },
      {
        speaker: "Rina",
        text: "Narasumbernya hanya dari satu pihak, ya?",
        vi: "Nguồn/người được trích dẫn chỉ từ một phía nhỉ?",
        en: "The sources are only from one side, right?",
      },
      {
        speaker: "Adi",
        text: "Iya, karena itu saya belum berani menyimpulkan.",
        vi: "Ừ, vì vậy tôi chưa dám kết luận.",
        en: "Yes, for that reason I am not ready to conclude yet.",
      },
      {
        speaker: "Rina",
        text: "Saya ingin menanggapi berita ini, tapi tetap sopan.",
        vi: "Tôi muốn phản hồi tin này, nhưng vẫn lịch sự.",
        en: "I want to respond to this news, but stay polite.",
      },
      {
        speaker: "Adi",
        text: "Boleh berbeda pendapat, asal kita tetap membahas isi beritanya.",
        vi: "Có thể khác ý kiến, miễn là chúng ta vẫn bàn nội dung tin.",
        en: "Different opinions are fine, as long as we keep discussing the content of the news.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Chúng ta cần tách sự kiện, ý kiến, và giả định cá nhân.",
        prompt_en: "Translate into Indonesian: We need to separate facts, opinions, and personal assumptions.",
        answer: "Kita perlu memisahkan fakta, opini, dan asumsi pribadi.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Saya melihat ada ___ media dalam cara berita itu disusun.",
        prompt_en: "Fill in the blank: Saya melihat ada ___ media dalam cara berita itu disusun.",
        answer: "bias",
      },
      {
        type: "choice",
        prompt_vi: "Câu nào lịch sự nhất khi phản hồi một câu chưa được xác minh?",
        prompt_en: "Which sentence is most polite for responding to an unverified claim?",
        options: [
          "Kalimat itu terdengar seperti opini, bukan fakta yang sudah diverifikasi.",
          "Itu pasti salah dan kamu tidak paham.",
          "Berita itu bodoh sekali.",
        ],
        answer: "Kalimat itu terdengar seperti opini, bukan fakta yang sudah diverifikasi.",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm từ Indonesia với nghĩa tiếng Việt.",
        prompt_en: "Match each Indonesian phrase with its Vietnamese meaning.",
        pairs: [
          ["sudut pandang", "góc nhìn"],
          ["narasumber", "nguồn/người cung cấp thông tin"],
          ["diskusi sopan", "thảo luận lịch sự"],
        ],
      },
    ],
    content:
      "Use this lesson for advanced, polite Indonesian discussions about news opinion: separating fact and opinion, identifying sources and point of view, noticing media bias, responding to news carefully, and disagreeing without personal attacks.",
  },
];
