// Media & News Discussion Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// media/register notes with English companions in pronunciation_focus_en.

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
    id: "indonesian_media_news_discussion",
    level: "B1",
    category: "media_literacy",
    title_vi: "Thảo luận tin tức và truyền thông",
    title_en: "Media and news discussion",
    sentences: [
      {
        en: "Saya membaca berita itu di media online.",
        vi: "Tôi đọc tin đó trên báo/truyền thông online.",
        pronunciation_focus: [
          "SA-ya mem-BA-ca be-RI-ta I-tu di ME-di-a ON-lain - `berita` = tin tức; `media online` = truyền thông/báo online.",
          "Lỗi người Việt: dùng `kabar` cho mọi tin. `Berita` là tin tức báo chí; `kabar` là tin/tình hình đời thường.",
          "Luyện: `Saya membaca berita itu.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mem-BA-cha be-REE-ta I-too di ME-di-a ON-line - `berita` = news; `media online` = online media.",
          "VN-speaker trap: using `kabar` for every kind of news. `Berita` is news reporting; `kabar` is everyday news/updates.",
          "Drill: `Saya membaca berita itu.`",
        ],
      },
      {
        en: "Sumbernya harus jelas dan terpercaya.",
        vi: "Nguồn của nó phải rõ ràng và đáng tin cậy.",
        pronunciation_focus: [
          "SUM-ber-nya HA-rus je-LAS dan ter-per-CA-ya - `sumber` = nguồn; `terpercaya` = đáng tin cậy.",
          "Lỗi người Việt: dịch `nguồn uy tín` thành `sumber prestise`. Cụm tự nhiên là `sumber terpercaya`.",
          "Luyện: `Cari sumber terpercaya.`",
        ],
        pronunciation_focus_en: [
          "SOOM-ber-nya HA-roos je-LAS dan ter-per-CHA-ya - `sumber` = source; `terpercaya` = trusted/reliable.",
          "VN-speaker trap: translating 'reputable source' as `sumber prestise`. Natural phrase: `sumber terpercaya`.",
          "Drill: `Cari sumber terpercaya.`",
        ],
      },
      {
        en: "Jangan langsung percaya kalau judul beritanya terlalu sensasional.",
        vi: "Đừng tin ngay nếu tiêu đề tin quá giật gân.",
        pronunciation_focus: [
          "JA-ngan LANG-sung per-CA-ya KA-lau JU-dul be-RI-ta-nya ter-LA-lu sen-sa-si-o-NAL - `judul berita` = tiêu đề tin; `sensasional` = giật gân.",
          "Lỗi người Việt: dịch `giật tít` quá sát. Trong Indonesia, nói `judulnya sensasional` hoặc `clickbait` trong văn nói.",
          "Luyện: `Judulnya terlalu sensasional.`",
        ],
        pronunciation_focus_en: [
          "JA-ngan LANG-soong per-CHA-ya KA-lau JOO-dool be-REE-ta-nya ter-LA-loo sen-sa-si-o-NAL - `judul berita` = news headline; `sensasional` = sensational.",
          "VN-speaker trap: translating Vietnamese 'shock headline' too literally. In Indonesian, say `judulnya sensasional` or colloquial `clickbait`.",
          "Drill: `Judulnya terlalu sensasional.`",
        ],
      },
      {
        en: "Berita palsu atau hoaks bisa menyebar sangat cepat.",
        vi: "Tin giả hoặc hoax có thể lan truyền rất nhanh.",
        pronunciation_focus: [
          "be-RI-ta PAL-su A-tau HO-aks BI-sa me-NYE-bar SA-ngat ce-PAT - `berita palsu` = tin giả; `hoaks` = hoax; `menyebar` = lan truyền.",
          "Lỗi người Việt: dùng `salah` cho fake news. `Berita palsu` hoặc `hoaks` chính xác hơn.",
          "Luyện: `Hoaks menyebar cepat.`",
        ],
        pronunciation_focus_en: [
          "be-REE-ta PAL-soo A-tau HO-aks BI-sa me-NYE-bar SA-ngat che-PAT - `berita palsu` = fake news; `hoaks` = hoax; `menyebar` = spread.",
          "VN-speaker trap: using `salah` for fake news. `Berita palsu` or `hoaks` is more precise.",
          "Drill: `Hoaks menyebar cepat.`",
        ],
      },
      {
        en: "Sebelum membagikan berita, sebaiknya kita cek faktanya dulu.",
        vi: "Trước khi chia sẻ tin, tốt nhất là chúng ta kiểm tra sự thật trước.",
        pronunciation_focus: [
          "se-BE-lum mem-BA-gi-kan be-RI-ta, se-BAIK-nya KI-ta CEK FAK-ta-nya DU-lu - `membagikan berita` = chia sẻ tin; `cek fakta` = kiểm chứng sự thật.",
          "Lỗi người Việt: nói `share berita` trong mọi ngữ cảnh. Từ Indonesia là `membagikan berita`; văn nói vẫn hiểu `share`.",
          "Luyện: `Cek faktanya dulu.`",
        ],
        pronunciation_focus_en: [
          "se-BE-lum mem-BA-gi-kan be-REE-ta, se-BAIK-nya KI-ta CHEK FAK-ta-nya DOO-loo - `membagikan berita` = share news; `cek fakta` = fact-check.",
          "VN-speaker trap: saying `share berita` in every context. Indonesian term: `membagikan berita`; casual speech may still use `share`.",
          "Drill: `Cek faktanya dulu.`",
        ],
      },
      {
        en: "Menurut narasumber dalam wawancara itu, data terbaru belum lengkap.",
        vi: "Theo nguồn/người được phỏng vấn trong cuộc phỏng vấn đó, dữ liệu mới nhất chưa đầy đủ.",
        pronunciation_focus: [
          "me-NU-rut na-ra-SUM-ber da-LAM wa-WAN-ca-ra I-tu, DA-ta ter-BA-ru be-LUM LENG-kap - `narasumber` = nguồn/người cung cấp thông tin; `wawancara` = phỏng vấn.",
          "Lỗi người Việt: dùng `sumber orang` cho người được hỏi. Từ báo chí tự nhiên là `narasumber`.",
          "Luyện: `Menurut narasumber, datanya belum lengkap.`",
        ],
        pronunciation_focus_en: [
          "me-NU-root na-ra-SOOM-ber da-LAM wa-WAN-cha-ra I-too, DA-ta ter-BA-roo be-LOOM LENG-kap - `narasumber` = source/interviewee; `wawancara` = interview.",
          "VN-speaker trap: saying `sumber orang` for a quoted person. Journalistic Indonesian uses `narasumber`.",
          "Drill: `Menurut narasumber, datanya belum lengkap.`",
        ],
      },
      {
        en: "Opini publik bisa berubah setelah informasi baru muncul.",
        vi: "Dư luận có thể thay đổi sau khi thông tin mới xuất hiện.",
        pronunciation_focus: [
          "o-PI-ni PUB-lik BI-sa ber-U-bah se-TE-lah in-for-MA-si BA-ru MUN-cul - `opini publik` = dư luận; `berubah` = thay đổi.",
          "Lỗi người Việt: dịch `dư luận` thành `komentar umum`. Cụm đúng trong tin tức là `opini publik`.",
          "Luyện: `Opini publik bisa berubah.`",
        ],
        pronunciation_focus_en: [
          "o-PEE-ni PUB-lik BI-sa ber-OO-bah se-TE-lah in-for-MA-si BA-roo MOON-chool - `opini publik` = public opinion; `berubah` = change.",
          "VN-speaker trap: translating public opinion as `komentar umum`. News Indonesian uses `opini publik`.",
          "Drill: `Opini publik bisa berubah.`",
        ],
      },
      {
        en: "Saya belum berani menyimpulkan karena informasinya masih simpang siur.",
        vi: "Tôi chưa dám kết luận vì thông tin vẫn còn lẫn lộn/trái chiều.",
        pronunciation_focus: [
          "SA-ya be-LUM be-RA-ni me-nyim-PUL-kan ka-RE-na in-for-MA-si-nya MA-sih SIM-pang SI-ur - `menyimpulkan` = kết luận; `simpang siur` = lẫn lộn/chưa rõ.",
          "Lỗi người Việt: dịch `thông tin loạn` quá thẳng. Cụm tự nhiên là `informasinya simpang siur`.",
          "Luyện: `Informasinya masih simpang siur.`",
        ],
        pronunciation_focus_en: [
          "SA-ya be-LOOM be-RA-ni me-nyim-POOL-kan ka-RE-na in-for-MA-si-nya MA-sih SIM-pang SEE-oor - `menyimpulkan` = conclude; `simpang siur` = unclear/conflicting.",
          "VN-speaker trap: translating 'messy information' too literally. Natural phrase: `informasinya simpang siur`.",
          "Drill: `Informasinya masih simpang siur.`",
        ],
      },
      {
        en: "Diskusi soal berita sebaiknya tetap sopan dan berdasarkan fakta.",
        vi: "Thảo luận về tin tức tốt nhất vẫn nên lịch sự và dựa trên sự thật.",
        pronunciation_focus: [
          "dis-KU-si so-AL be-RI-ta se-BAIK-nya te-TAP SO-pan dan ber-da-SAR-kan FAK-ta - `berdasarkan fakta` = dựa trên sự thật.",
          "Lỗi người Việt: `soal` ở đây nghĩa là về/chuyện, không phải bài toán.",
          "Luyện: `Diskusi tetap sopan.`",
        ],
        pronunciation_focus_en: [
          "dis-KOO-si so-AL be-REE-ta se-BAIK-nya te-TAP SO-pan dan ber-da-SAR-kan FAK-ta - `berdasarkan fakta` = based on facts.",
          "VN-speaker trap: `soal` here means about/regarding, not a math problem.",
          "Drill: `Diskusi tetap sopan.`",
        ],
      },
      {
        en: "Saya paham pendapat Anda, tetapi saya melihatnya dari sisi lain.",
        vi: "Tôi hiểu ý kiến của anh/chị, nhưng tôi nhìn nó từ góc khác.",
        pronunciation_focus: [
          "SA-ya PA-ham pen-DA-pat AN-da, te-TA-pi SA-ya me-LI-hat-nya da-ri SI-si LA-in - `dari sisi lain` = từ góc khác.",
          "Lỗi người Việt: phản đối bằng `Anda salah` làm thảo luận căng. Câu này giữ giọng lịch sự.",
          "Luyện: `Saya melihatnya dari sisi lain.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PA-ham pen-DA-pat AN-da, te-TA-pi SA-ya me-LI-hat-nya da-ri SI-si LA-in - `dari sisi lain` = from another angle.",
          "VN-speaker trap: objecting with `Anda salah` makes discussion tense. This sentence keeps a polite tone.",
          "Drill: `Saya melihatnya dari sisi lain.`",
        ],
      },
      {
        en: "Ada baiknya kita membaca lebih dari satu sumber.",
        vi: "Tốt hơn là chúng ta đọc nhiều hơn một nguồn.",
        pronunciation_focus: [
          "A-da BAIK-nya KI-ta mem-BA-ca LE-bih da-ri SA-tu SUM-ber - `ada baiknya` = tốt hơn/nên; `lebih dari satu sumber` = hơn một nguồn.",
          "Lỗi người Việt: nói `harus` quá mạnh trong tranh luận. `Ada baiknya...` mềm hơn khi khuyên.",
          "Luyện: `Ada baiknya cek sumber lain.`",
        ],
        pronunciation_focus_en: [
          "A-da BAIK-nya KI-ta mem-BA-cha LE-bih da-ri SA-too SOOM-ber - `ada baiknya` = it would be good to; `lebih dari satu sumber` = more than one source.",
          "VN-speaker trap: saying `harus` can sound too strong in discussion. `Ada baiknya...` is softer advice.",
          "Drill: `Ada baiknya cek sumber lain.`",
        ],
      },
      {
        en: "Kalau ternyata keliru, kita perlu mengoreksi informasi itu.",
        vi: "Nếu hóa ra sai, chúng ta cần sửa/đính chính thông tin đó.",
        pronunciation_focus: [
          "KA-lau ter-NYA-ta ke-LI-ru, KI-ta per-LU me-ngo-REK-si in-for-MA-si I-tu - `keliru` = sai/nhầm; `mengoreksi` = sửa/đính chính.",
          "Lỗi người Việt: `salah` đúng nhưng thẳng; trong thảo luận lịch sự, `keliru` thường mềm hơn.",
          "Luyện: `Kita perlu mengoreksi informasi itu.`",
        ],
        pronunciation_focus_en: [
          "KA-lau ter-NYA-ta ke-LEE-roo, KI-ta per-LOO me-ngo-REK-si in-for-MA-si I-too - `keliru` = mistaken; `mengoreksi` = correct.",
          "VN-speaker trap: `salah` is correct but blunt; in polite discussion, `keliru` is often softer.",
          "Drill: `Kita perlu mengoreksi informasi itu.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, người nói thường dùng `hoaks` cho tin giả lan truyền trên mạng, và `sumber terpercaya` cho nguồn đáng tin. Khi thảo luận tin tức, đặc biệt về chính trị, tôn giáo, hoặc sự kiện nhạy cảm, cách an toàn là hỏi nguồn, tránh kết luận vội, và giữ giọng `diskusi sopan`. Nói `menurut saya` hoặc `saya melihatnya dari sisi lain` giúp bất đồng nhẹ hơn.",
    cultural_notes_en:
      "In Indonesia, people commonly use `hoaks` for fake news circulating online, and `sumber terpercaya` for a reliable source. When discussing news, especially politics, religion, or sensitive events, the safe approach is to ask for sources, avoid quick conclusions, and keep a `diskusi sopan` tone. Saying `menurut saya` or `saya melihatnya dari sisi lain` makes disagreement softer.",
    tip_advice_vi:
      "Mẹo cho người Việt: đừng chia sẻ tin chỉ vì tiêu đề mạnh. Hãy dùng khung 4 bước: kiểm tra nguồn (`sumber terpercaya`), đọc hơn một nguồn (`lebih dari satu sumber`), nói khi chưa chắc (`informasinya masih simpang siur`), và nếu sai thì sửa (`mengoreksi informasi`). Khi tranh luận, tránh `Anda salah`; nói `Saya paham pendapat Anda, tetapi...` sẽ tự nhiên và lịch sự hơn.",
    tip_advice_en:
      "Tip for Vietnamese speakers: do not share news just because the headline is strong. Use a four-step frame: check the source (`sumber terpercaya`), read more than one source (`lebih dari satu sumber`), speak carefully when uncertain (`informasinya masih simpang siur`), and correct it if wrong (`mengoreksi informasi`). In debate, avoid `Anda salah`; `Saya paham pendapat Anda, tetapi...` sounds more natural and polite.",
    vocabulary: [
      { word: "berita", en: "news", vi: "tin tức", pos: "noun", pronunciation_vi: "be-RI-ta", pronunciation_en: "be-REE-ta" },
      { word: "media online", en: "online media", vi: "truyền thông/báo online", pos: "noun phrase", pronunciation_vi: "ME-di-a ON-lain", pronunciation_en: "ME-di-a ON-line" },
      { word: "sumber terpercaya", en: "trusted source", vi: "nguồn đáng tin cậy", pos: "noun phrase", pronunciation_vi: "SUM-ber ter-per-CA-ya", pronunciation_en: "SOOM-ber ter-per-CHA-ya" },
      { word: "hoaks", en: "hoax", vi: "tin giả/hoax", pos: "noun", pronunciation_vi: "HO-aks", pronunciation_en: "HO-aks" },
      { word: "opini publik", en: "public opinion", vi: "dư luận", pos: "noun phrase", pronunciation_vi: "o-PI-ni PUB-lik", pronunciation_en: "o-PEE-ni PUB-lik" },
      { word: "wawancara", en: "interview", vi: "phỏng vấn", pos: "noun", pronunciation_vi: "wa-WAN-ca-ra", pronunciation_en: "wa-WAN-cha-ra" },
      { word: "judul berita", en: "news headline", vi: "tiêu đề tin", pos: "noun phrase", pronunciation_vi: "JU-dul be-RI-ta", pronunciation_en: "JOO-dool be-REE-ta" },
      { word: "diskusi sopan", en: "polite discussion", vi: "thảo luận lịch sự", pos: "noun phrase", pronunciation_vi: "dis-KU-si SO-pan", pronunciation_en: "dis-KOO-si SO-pan" },
    ],
    dialogue: [
      {
        speaker: "Ayu",
        text: "Kamu sudah baca berita tentang kebijakan baru itu?",
        vi: "Bạn đã đọc tin về chính sách mới đó chưa?",
        en: "Have you read the news about that new policy?",
      },
      {
        speaker: "Rizal",
        text: "Sudah, tapi saya belum yakin sumbernya terpercaya.",
        vi: "Rồi, nhưng tôi chưa chắc nguồn đó đáng tin.",
        en: "Yes, but I am not sure the source is reliable.",
      },
      {
        speaker: "Ayu",
        text: "Benar juga. Judulnya memang agak sensasional.",
        vi: "Cũng đúng. Tiêu đề của nó đúng là hơi giật gân.",
        en: "That's true. The headline is a bit sensational.",
      },
      {
        speaker: "Rizal",
        text: "Ada baiknya kita cek fakta dan baca sumber lain dulu.",
        vi: "Tốt hơn là chúng ta kiểm chứng và đọc nguồn khác trước đã.",
        en: "It would be good to fact-check and read another source first.",
      },
      {
        speaker: "Ayu",
        text: "Setuju. Diskusi soal berita sebaiknya tetap sopan dan berdasarkan fakta.",
        vi: "Đồng ý. Thảo luận tin tức tốt nhất vẫn nên lịch sự và dựa trên sự thật.",
        en: "Agreed. News discussion should stay polite and fact-based.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối thuật ngữ truyền thông với nghĩa tiếng Việt.",
        instruction_en: "Match the media term with its Vietnamese meaning.",
        items: [
          { prompt: "sumber terpercaya", answer: "nguồn đáng tin cậy" },
          { prompt: "hoaks", answer: "tin giả" },
          { prompt: "judul berita", answer: "tiêu đề tin" },
          { prompt: "opini publik", answer: "dư luận" },
        ],
      },
      {
        type: "polite_discussion",
        instruction_vi: "Chọn cách nói lịch sự hơn trong thảo luận tin tức.",
        instruction_en: "Choose the more polite way to speak in news discussion.",
        items: [
          {
            prompt: "Anda salah.",
            answer: "Saya paham pendapat Anda, tetapi saya melihatnya dari sisi lain.",
          },
          {
            prompt: "Berita ini pasti benar.",
            answer: "Ada baiknya kita membaca lebih dari satu sumber.",
          },
          {
            prompt: "Saya mau langsung share.",
            answer: "Sebelum membagikan berita, sebaiknya kita cek faktanya dulu.",
          },
        ],
      },
    ],
  },
];

export default lessons;
