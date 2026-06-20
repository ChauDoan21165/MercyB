// Funeral & Condolences Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson following the established Indonesian extra shape.
// Sentence `en` is TARGET-LANGUAGE Indonesian; `vi` is the Vietnamese gloss.
// Vietnamese L1 notes live in `pronunciation_focus`, with English companions in
// `pronunciation_focus_en` in the same order.

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
    id: "indonesian_funeral_condolences",
    level: "B1",
    category: "culture",
    title_vi: "Chia buồn và đi viếng tang ở Indonesia",
    title_en: "Funerals and condolences in Indonesia",
    sentences: [
      {
        en: "Saya turut berduka cita atas meninggalnya Bapak Ahmad.",
        vi: "Tôi xin chia buồn sâu sắc về việc ông Ahmad qua đời.",
        pronunciation_focus: [
          "SA-ya TU-rut ber-DU-ka CI-ta A-tas me-NING-gal-nya BA-pak AH-mad - `turut berduka cita` = xin chia buồn.",
          "Lỗi người Việt: nói thẳng `dia mati`. Trong lời chia buồn, dùng cách nói mềm `meninggal dunia` hoặc `meninggalnya...`.",
          "Luyện: `Saya turut berduka cita.`",
        ],
        pronunciation_focus_en: [
          "SA-ya TU-rut ber-DU-ka CHI-ta A-tas me-NING-gal-nya BA-pak AH-mad - `turut berduka cita` = offer condolences.",
          "VN-speaker trap: saying blunt `dia mati`. In condolences, use softened wording: `meninggal dunia` or `meninggalnya...`.",
          "Drill: `Saya turut berduka cita.`",
        ],
      },
      {
        en: "Kapan almarhum meninggal dunia?",
        vi: "Người quá cố mất khi nào?",
        pronunciation_focus: [
          "KA-pan al-MAR-hum me-NING-gal DU-nia - `almarhum` = người nam quá cố; `meninggal dunia` = qua đời.",
          "Lỗi người Việt: dùng `almarhum` cho mọi người. Với nữ thường dùng `almarhumah`; nếu không chắc, nói tên người.",
          "Luyện: `Beliau meninggal dunia kapan?`",
        ],
        pronunciation_focus_en: [
          "KA-pan al-MAR-hum me-NING-gal DOO-nia - `almarhum` = late/deceased man; `meninggal dunia` = pass away.",
          "VN-speaker trap: using `almarhum` for everyone. For a woman, often `almarhumah`; if unsure, use the person's name.",
          "Drill: `Beliau meninggal dunia kapan?`",
        ],
      },
      {
        en: "Kami mau takziah ke rumah keluarga duka malam ini.",
        vi: "Tối nay chúng tôi muốn đến viếng/chia buồn tại nhà gia đình tang quyến.",
        pronunciation_focus: [
          "KA-mi mau tak-ZI-ah ke RU-mah ke-LU-ar-ga DU-ka MA-lam I-ni - `takziah` = đi viếng/chia buồn; `keluarga duka` = tang quyến.",
          "Lỗi người Việt: nói `datang pesta duka`. Không dùng `pesta`; dùng `takziah` hoặc `melayat`.",
          "Luyện: `Kami mau takziah malam ini.`",
        ],
        pronunciation_focus_en: [
          "KA-mi mau tak-ZI-ah ke RU-mah ke-LU-ar-ga DU-ka MA-lam I-ni - `takziah` = condolence visit; `keluarga duka` = bereaved family.",
          "VN-speaker trap: saying `datang pesta duka`. Do not use `pesta`; use `takziah` or `melayat`.",
          "Drill: `Kami mau takziah malam ini.`",
        ],
      },
      {
        en: "Pemakamannya akan dilaksanakan besok pagi.",
        vi: "Lễ an táng sẽ được tổ chức vào sáng mai.",
        pronunciation_focus: [
          "pe-MA-kam-an-nya A-kan di-lak-SA-na-kan BE-sok PA-gi - `pemakaman` = lễ chôn cất/an táng; `dilaksanakan` = được tổ chức.",
          "Lỗi người Việt: dùng `kuburan` cho buổi lễ. `Kuburan` là mộ/nghĩa trang; sự kiện là `pemakaman`.",
          "Luyện: `Pemakamannya besok pagi.`",
        ],
        pronunciation_focus_en: [
          "pe-MA-kam-an-nya A-kan di-lak-SA-na-kan BE-sok PA-gi - `pemakaman` = burial/funeral; `dilaksanakan` = held/carried out.",
          "VN-speaker trap: using `kuburan` for the ceremony. `Kuburan` is grave/cemetery; the event is `pemakaman`.",
          "Drill: `Pemakamannya besok pagi.`",
        ],
      },
      {
        en: "Semoga keluarga yang ditinggalkan diberi kekuatan.",
        vi: "Mong gia đình ở lại được ban cho sức mạnh.",
        pronunciation_focus: [
          "se-MO-ga ke-LU-ar-ga yang di-ting-GAL-kan di-BE-ri ke-KU-at-an - lời cầu chúc rất thường gặp khi chia buồn.",
          "Lỗi người Việt: dịch `gia đình còn lại` quá thẳng. Cụm tự nhiên là `keluarga yang ditinggalkan`.",
          "Luyện: `Semoga keluarga diberi kekuatan.`",
        ],
        pronunciation_focus_en: [
          "se-MO-ga ke-LU-ar-ga yang di-ting-GAL-kan di-BE-ri ke-KU-at-an - a common condolence wish.",
          "VN-speaker trap: translating 'remaining family' too literally. Natural phrase: `keluarga yang ditinggalkan`.",
          "Drill: `Semoga keluarga diberi kekuatan.`",
        ],
      },
      {
        en: "Kami ikut mendoakan almarhumah.",
        vi: "Chúng tôi cũng cầu nguyện cho người nữ quá cố.",
        pronunciation_focus: [
          "KA-mi I-kut men-do-A-kan al-mar-HU-mah - `mendoakan` = cầu nguyện cho; `almarhumah` = người nữ quá cố.",
          "Lỗi người Việt: nói `doa untuk` được, nhưng động từ tự nhiên hơn là `mendoakan`.",
          "Luyện: `Kami ikut mendoakan beliau.`",
        ],
        pronunciation_focus_en: [
          "KA-mi I-kut men-do-A-kan al-mar-HU-mah - `mendoakan` = pray for; `almarhumah` = late/deceased woman.",
          "VN-speaker trap: `doa untuk` is understood, but the verb `mendoakan` is more natural.",
          "Drill: `Kami ikut mendoakan beliau.`",
        ],
      },
      {
        en: "Boleh saya membantu menyiapkan kursi untuk tamu?",
        vi: "Tôi có thể giúp chuẩn bị ghế cho khách không?",
        pronunciation_focus: [
          "BO-leh SA-ya mem-BAN-tu me-NYI-ap-kan KUR-si un-TUK TA-mu - `boleh saya membantu` = tôi có thể giúp không.",
          "Lỗi người Việt: tự làm ngay mà không hỏi. Ở nhà tang, nên hỏi nhẹ trước: `Boleh saya membantu...?`",
          "Luyện: `Boleh saya membantu?`",
        ],
        pronunciation_focus_en: [
          "BO-leh SA-ya mem-BAN-tu me-NYI-ap-kan KUR-si un-TUK TA-mu - `boleh saya membantu` = may I help.",
          "VN-speaker trap: jumping in without asking. At a mourning house, gently ask first: `Boleh saya membantu...?`",
          "Drill: `Boleh saya membantu?`",
        ],
      },
      {
        en: "Sebaiknya kita memakai pakaian sopan dan tidak terlalu mencolok.",
        vi: "Tốt nhất chúng ta mặc trang phục lịch sự/kín đáo và không quá nổi bật.",
        pronunciation_focus: [
          "se-BA-ik-nya KI-ta me-MA-kai pa-KAI-an SO-pan dan TI-dak ter-LA-lu men-CO-lok - `mencolok` = nổi bật/chói.",
          "Lỗi người Việt: nghĩ `sopan` chỉ là lời nói. Với tang lễ, `pakaian sopan` nghĩa là kín đáo, lịch sự, không lòe loẹt.",
          "Luyện: `Pakai pakaian sopan.`",
        ],
        pronunciation_focus_en: [
          "se-BA-ik-nya KI-ta me-MA-kai pa-KAI-an SO-pan dan TI-dak ter-LA-lu men-CHO-lok - `mencolok` = flashy/standout.",
          "VN-speaker trap: thinking `sopan` only describes speech. At funerals, `pakaian sopan` means modest, respectful, not flashy.",
          "Drill: `Pakai pakaian sopan.`",
        ],
      },
      {
        en: "Mohon maaf, saya baru mendengar kabar duka ini.",
        vi: "Xin lỗi, tôi vừa mới nghe tin buồn này.",
        pronunciation_focus: [
          "MO-hon ma-AF, SA-ya BA-ru men-DE-ngar KA-bar DU-ka I-ni - `kabar duka` = tin buồn/tin tang.",
          "Lỗi người Việt: hỏi quá nhiều chi tiết ngay. Mở đầu bằng câu nhẹ như `saya baru mendengar kabar duka ini`.",
          "Luyện: `Saya baru mendengar kabar duka ini.`",
        ],
        pronunciation_focus_en: [
          "MO-hon ma-AF, SA-ya BA-ru men-DE-ngar KA-bar DU-ka I-ni - `kabar duka` = sad news/news of bereavement.",
          "VN-speaker trap: asking too many details immediately. Start gently with `saya baru mendengar kabar duka ini`.",
          "Drill: `Saya baru mendengar kabar duka ini.`",
        ],
      },
      {
        en: "Ucapan yang halus lebih baik daripada pertanyaan yang terlalu pribadi.",
        vi: "Lời nói nhẹ nhàng tốt hơn những câu hỏi quá riêng tư.",
        pronunciation_focus: [
          "u-CA-pan yang HA-lus le-BIH BA-ik da-ri-PA-da per-TA-nya-an yang ter-LA-lu PRI-ba-di - `ucapan halus` = lời nói mềm/lịch sự.",
          "Lỗi người Việt: hỏi nguyên nhân mất quá trực diện. Trong bối cảnh tang, tránh câu hỏi `meninggal karena apa?` nếu không thân.",
          "Luyện: `Gunakan ucapan yang halus.`",
        ],
        pronunciation_focus_en: [
          "u-CHA-pan yang HA-lus le-BIH BA-ik da-ri-PA-da per-TA-nya-an yang ter-LA-lu PRI-ba-di - `ucapan halus` = gentle/polite wording.",
          "VN-speaker trap: asking the cause of death too directly. In mourning contexts, avoid `meninggal karena apa?` unless close.",
          "Drill: `Gunakan ucapan yang halus.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Indonesia có nhiều truyền thống tang lễ theo tôn giáo và adat địa phương. Với gia đình Muslim, người đến viếng thường nói `Innalillahi wa inna ilaihi raji'un` và `turut berduka cita`, rồi có thể ikut mendoakan. Từ chung lịch sự cho đi viếng là `takziah` hoặc `melayat`. Ở nhà duka, giữ giọng nhỏ, mặc pakaian sopan, không chụp ảnh nếu chưa được phép, và tránh hỏi chi tiết quá riêng tư. Nếu muốn giúp, hỏi trước bằng `Boleh saya membantu...?`.",
    cultural_notes_en:
      "Indonesia has many funeral traditions shaped by religion and local adat. For Muslim families, visitors often say `Innalillahi wa inna ilaihi raji'un` and `turut berduka cita`, then may pray for the deceased. General respectful words for a condolence visit are `takziah` or `melayat`. At a mourning house, keep your voice low, wear modest clothing, do not take photos unless permitted, and avoid overly private questions. If you want to help, ask first with `Boleh saya membantu...?`.",
    tip_advice_vi:
      "Mẹo cho người Việt: tránh từ thẳng và nặng như `mati` khi chia buồn. Dùng `meninggal dunia`, `almarhum/almarhumah`, `keluarga duka`, `kabar duka`, và `turut berduka cita`. Câu an toàn nhất: `Saya turut berduka cita. Semoga keluarga yang ditinggalkan diberi kekuatan.`",
    tip_advice_en:
      "Tip for Vietnamese speakers: avoid blunt wording like `mati` when giving condolences. Use `meninggal dunia`, `almarhum/almarhumah`, `keluarga duka`, `kabar duka`, and `turut berduka cita`. The safest line is: `Saya turut berduka cita. Semoga keluarga yang ditinggalkan diberi kekuatan.`",
    vocabulary: [
      {
        word: "meninggal dunia",
        en: "to pass away",
        vi: "qua đời",
        pos: "verb phrase",
        pronunciation_vi: "me-NING-gal DU-nia",
        pronunciation_en: "me-NING-gal DOO-nia",
      },
      {
        word: "belasungkawa",
        en: "condolence",
        vi: "lời chia buồn",
        pos: "noun",
        pronunciation_vi: "be-la-sung-KA-wa",
        pronunciation_en: "be-la-soong-KA-wa",
      },
      {
        word: "takziah",
        en: "condolence visit",
        vi: "đi viếng / thăm chia buồn",
        pos: "noun / verb",
        pronunciation_vi: "tak-ZI-ah",
        pronunciation_en: "tak-ZEE-ah",
      },
      {
        word: "pemakaman",
        en: "funeral / burial",
        vi: "lễ an táng / chôn cất",
        pos: "noun",
        pronunciation_vi: "pe-MA-kam-an",
        pronunciation_en: "pe-MA-kam-an",
      },
      {
        word: "keluarga duka",
        en: "bereaved family",
        vi: "tang quyến",
        pos: "noun phrase",
        pronunciation_vi: "ke-LU-ar-ga DU-ka",
        pronunciation_en: "ke-LOO-ar-ga DOO-ka",
      },
      {
        word: "doa",
        en: "prayer",
        vi: "lời cầu nguyện",
        pos: "noun",
        pronunciation_vi: "do-A",
        pronunciation_en: "do-A",
      },
      {
        word: "ucapan halus",
        en: "gentle wording",
        vi: "lời nói nhẹ nhàng",
        pos: "noun phrase",
        pronunciation_vi: "u-CA-pan HA-lus",
        pronunciation_en: "u-CHA-pan HA-loos",
      },
      {
        word: "almarhum",
        en: "late/deceased man",
        vi: "người nam quá cố",
        pos: "noun",
        pronunciation_vi: "al-MAR-hum",
        pronunciation_en: "al-MAR-hoom",
      },
      {
        word: "almarhumah",
        en: "late/deceased woman",
        vi: "người nữ quá cố",
        pos: "noun",
        pronunciation_vi: "al-mar-HU-mah",
        pronunciation_en: "al-mar-HOO-mah",
      },
      {
        word: "pakaian sopan",
        en: "modest/respectful clothing",
        vi: "trang phục lịch sự/kín đáo",
        pos: "noun phrase",
        pronunciation_vi: "pa-KAI-an SO-pan",
        pronunciation_en: "pa-KAI-an SO-pan",
      },
    ],
    dialogue: [
      {
        speaker: "Rina",
        text: "Saya baru mendengar kabar duka tentang ayahmu. Saya turut berduka cita.",
        vi: "Tôi vừa nghe tin buồn về bố bạn. Tôi xin chia buồn.",
        en: "I just heard the sad news about your father. My condolences.",
      },
      {
        speaker: "Dian",
        text: "Terima kasih, Rina. Pemakamannya besok pagi.",
        vi: "Cảm ơn Rina. Lễ an táng vào sáng mai.",
        en: "Thank you, Rina. The funeral is tomorrow morning.",
      },
      {
        speaker: "Rina",
        text: "Kami mau takziah malam ini. Boleh saya membantu menyiapkan kursi?",
        vi: "Tối nay chúng tôi muốn đến viếng. Tôi có thể giúp chuẩn bị ghế không?",
        en: "We want to visit tonight. May I help prepare chairs?",
      },
      {
        speaker: "Dian",
        text: "Boleh. Terima kasih atas doa dan bantuannya.",
        vi: "Được. Cảm ơn vì lời cầu nguyện và sự giúp đỡ.",
        en: "Yes. Thank you for your prayers and help.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ chia buồn phù hợp:",
        instruction_en: "Fill in the condolence word:",
        items: [
          {
            prompt: "Saya turut berduka cita atas ___ Bapak Ahmad. (qua đời)",
            answer: "meninggalnya",
            options: ["meninggalnya", "makanannya", "menangisnya"],
          },
          {
            prompt: "Kami mau ___ ke rumah keluarga duka. (đi viếng)",
            answer: "takziah",
            options: ["takziah", "tanya", "tawar"],
          },
          {
            prompt: "Semoga keluarga yang ditinggalkan diberi ___. (sức mạnh)",
            answer: "kekuatan",
            options: ["kekuatan", "kebetulan", "kecepatan"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "belasungkawa", answer: "lời chia buồn" },
          { prompt: "pemakaman", answer: "lễ an táng / chôn cất" },
          { prompt: "keluarga duka", answer: "tang quyến" },
          { prompt: "almarhumah", answer: "người nữ quá cố" },
          { prompt: "ucapan halus", answer: "lời nói nhẹ nhàng" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          {
            prompt: "Tôi xin chia buồn.",
            answer: "Saya turut berduka cita.",
          },
          {
            prompt: "Tối nay chúng tôi muốn đến viếng tại nhà tang quyến.",
            answer: "Kami mau takziah ke rumah keluarga duka malam ini.",
          },
          {
            prompt: "Mong gia đình ở lại được ban cho sức mạnh.",
            answer: "Semoga keluarga yang ditinggalkan diberi kekuatan.",
          },
        ],
      },
    ],
  },
];
