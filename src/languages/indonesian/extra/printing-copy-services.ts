// Printing & Copy Services Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// pronunciation/service notes with English companions in pronunciation_focus_en.

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
    id: "indonesian_printing_copy_services",
    level: "A2",
    category: "services",
    title_vi: "Tiếng Indonesia ở tiệm in, photocopy và scan",
    title_en: "Indonesian for printing, copy, and scan services",
    sentences: [
      {
        en: "Mbak, saya mau fotokopi KTP dua lembar.",
        vi: "Chị ơi, tôi muốn photo căn cước KTP hai tờ.",
        pronunciation_focus: [
          "Mbak, SA-ya MAU fo-to-KO-pi ka-te-pe DU-a LEM-bar - `fotokopi` = photocopy; `lembar` = tờ.",
          "Lỗi người Việt: dùng `copy` một mình. Ở tiệm, từ rất tự nhiên là `fotokopi`.",
          "Luyện: `Saya mau fotokopi dua lembar.`",
        ],
        pronunciation_focus_en: [
          "Mbak, SA-ya MAU fo-to-KO-pi ka-te-pe DU-a LEM-bar - `fotokopi` = photocopy; `lembar` = sheet/page.",
          "VN-speaker trap: using only `copy`. At print shops, `fotokopi` is the natural word.",
          "Drill: `Saya mau fotokopi dua lembar.`",
        ],
      },
      {
        en: "Tolong print file PDF ini ukuran A4.",
        vi: "Làm ơn in file PDF này khổ A4.",
        pronunciation_focus: [
          "TO-long print fail pe-de-ef I-ni u-KU-ran A-empat - `print` = in; `ukuran A4` = khổ A4.",
          "Lỗi người Việt: nói `size A4` trong câu Indonesia. Hiểu được, nhưng tự nhiên hơn là `ukuran A4`.",
          "Luyện: `Print ukuran A4, ya.`",
        ],
        pronunciation_focus_en: [
          "TO-long print file pe-de-ef I-ni u-KU-ran A-four - `print` = print; `ukuran A4` = A4 size.",
          "VN-speaker trap: saying `size A4` inside Indonesian. It is understood, but `ukuran A4` is more natural.",
          "Drill: `Print ukuran A4, ya.`",
        ],
      },
      {
        en: "Bisa print hitam putih saja, jangan warna.",
        vi: "Có thể in đen trắng thôi, đừng in màu.",
        pronunciation_focus: [
          "BI-sa print HI-tam PU-tih SA-ja, JA-ngan WAR-na - `hitam putih` = đen trắng; `warna` = màu.",
          "Lỗi người Việt: dịch `đen trắng` thành `putih hitam`. Trật tự cố định là `hitam putih`.",
          "Luyện: `Print hitam putih saja.`",
        ],
        pronunciation_focus_en: [
          "BI-sa print HI-tam PU-tih SA-ja, JA-ngan WAR-na - `hitam putih` = black and white; `warna` = color.",
          "VN-speaker trap: translating the Vietnamese order as `putih hitam`. The fixed order is `hitam putih`.",
          "Drill: `Print hitam putih saja.`",
        ],
      },
      {
        en: "File-nya ada di flashdisk, bisa dibuka?",
        vi: "File nằm trong USB, mở được không?",
        pronunciation_focus: [
          "FAIL-nya A-da di FLES-disk, BI-sa di-BU-ka - `flashdisk` = USB; `dibuka` = được mở.",
          "Lỗi người Việt: gọi USB là `USB` vẫn hiểu, nhưng người Indonesia rất hay nói `flashdisk`.",
          "Luyện: `File-nya ada di flashdisk.`",
        ],
        pronunciation_focus_en: [
          "FILE-nya A-da di FLASH-disk, BI-sa di-BU-ka - `flashdisk` = USB drive; `dibuka` = can be opened.",
          "VN-speaker trap: saying only `USB` is understood, but Indonesians often say `flashdisk`.",
          "Drill: `File-nya ada di flashdisk.`",
        ],
      },
      {
        en: "Saya kirim file lewat WhatsApp, boleh?",
        vi: "Tôi gửi file qua WhatsApp được không?",
        pronunciation_focus: [
          "SA-ya KI-rim fail LE-wat wats-ap, BO-leh - `kirim file` = gửi file; `lewat` = qua/kênh.",
          "Lỗi người Việt: dùng `di WhatsApp` cho kênh gửi. Kênh/phương tiện dùng `lewat WhatsApp`.",
          "Luyện: `Saya kirim lewat WhatsApp.`",
        ],
        pronunciation_focus_en: [
          "SA-ya KI-rim file LE-wat WhatsApp, BO-leh - `kirim file` = send a file; `lewat` = via.",
          "VN-speaker trap: using `di WhatsApp` for the sending channel. Channels use `lewat WhatsApp`.",
          "Drill: `Saya kirim lewat WhatsApp.`",
        ],
      },
      {
        en: "Tolong scan dokumen ini jadi PDF.",
        vi: "Làm ơn scan giấy tờ này thành PDF.",
        pronunciation_focus: [
          "TO-long sken DO-ku-men I-ni JA-di pe-de-ef - `scan` = scan; `jadi PDF` = thành PDF.",
          "Lỗi người Việt: nói `menjadi PDF` quá trang trọng ở tiệm. Câu dịch vụ ngắn gọn: `jadi PDF`.",
          "Luyện: `Scan jadi PDF, ya.`",
        ],
        pronunciation_focus_en: [
          "TO-long scan DO-ku-men I-ni JA-di pe-de-ef - `scan` = scan; `jadi PDF` = into a PDF.",
          "VN-speaker trap: saying formal `menjadi PDF` at a shop. Service speech is short: `jadi PDF`.",
          "Drill: `Scan jadi PDF, ya.`",
        ],
      },
      {
        en: "Hasil scan-nya bisa dikirim ke email saya?",
        vi: "Bản scan có thể gửi vào email của tôi không?",
        pronunciation_focus: [
          "HA-sil sken-nya BI-sa di-KI-rim ke I-meil SA-ya - `hasil scan` = kết quả/bản scan; `dikirim` = được gửi.",
          "Lỗi người Việt: quên `ke` khi nói gửi tới địa chỉ. Gửi tới email là `dikirim ke email`.",
          "Luyện: `Kirim ke email saya.`",
        ],
        pronunciation_focus_en: [
          "HA-sil scan-nya BI-sa di-KI-rim ke E-mail SA-ya - `hasil scan` = scanned result; `dikirim` = sent.",
          "VN-speaker trap: dropping `ke` when sending to an address. Send to email = `dikirim ke email`.",
          "Drill: `Kirim ke email saya.`",
        ],
      },
      {
        en: "Berapa biaya laminating per lembar?",
        vi: "Ép plastic mỗi tờ giá bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa bi-A-ya LA-mi-na-ting per LEM-bar - `biaya` = chi phí; `laminating` = ép plastic; `per lembar` = mỗi tờ.",
          "Lỗi người Việt: hỏi `berapa uang laminating`. Hỏi phí dịch vụ dùng `berapa biaya ...`.",
          "Luyện: `Berapa biaya laminating?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa bi-A-ya LA-mi-na-ting per LEM-bar - `biaya` = cost/fee; `laminating` = laminating; `per lembar` = per sheet.",
          "VN-speaker trap: asking `berapa uang laminating`. For service fees, use `berapa biaya ...`.",
          "Drill: `Berapa biaya laminating?`",
        ],
      },
      {
        en: "Dokumen ini jangan dilaminating, cukup dimasukkan ke map.",
        vi: "Giấy tờ này đừng ép plastic, chỉ cần bỏ vào bìa hồ sơ.",
        pronunciation_focus: [
          "DO-ku-men I-ni JA-ngan di-LA-mi-na-ting, CU-kup di-MA-suk-kan ke map - `jangan di-...` = đừng để bị; `map` = bìa hồ sơ.",
          "Lỗi người Việt: quên bị động trong dặn dò. Dặn tiệm làm/không làm gì thường dùng `di-`: `dilaminating`, `dimasukkan`.",
          "Luyện: `Jangan dilaminating.`",
        ],
        pronunciation_focus_en: [
          "DO-ku-men I-ni JA-ngan di-LA-mi-na-ting, CU-kup di-MA-suk-kan ke map - `jangan di-...` = do not have it done; `map` = folder.",
          "VN-speaker trap: dropping the passive in shop instructions. Requests often use `di-`: `dilaminating`, `dimasukkan`.",
          "Drill: `Jangan dilaminating.`",
        ],
      },
      {
        en: "Saya mau jilid spiral untuk laporan ini.",
        vi: "Tôi muốn đóng gáy xoắn cho báo cáo này.",
        pronunciation_focus: [
          "SA-ya MAU JI-lid spi-RAL UN-tuk la-PO-ran I-ni - `jilid` = đóng gáy/đóng quyển; `laporan` = báo cáo.",
          "Lỗi người Việt: nói `ikat buku` theo nghĩa buộc sách. Dịch vụ đóng quyển là `jilid`.",
          "Luyện: `Jilid spiral, ya.`",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU JI-lid spi-RAL UN-tuk la-PO-ran I-ni - `jilid` = bind; `laporan` = report.",
          "VN-speaker trap: saying `ikat buku` literally. Binding as a service is `jilid`.",
          "Drill: `Jilid spiral, ya.`",
        ],
      },
      {
        en: "Tolong cetak bolak-balik supaya hemat kertas.",
        vi: "Làm ơn in hai mặt để tiết kiệm giấy.",
        pronunciation_focus: [
          "TO-long CE-tak BO-lak-BA-lik su-PA-ya HE-mat KER-tas - `cetak` = in; `bolak-balik` = hai mặt/qua lại; `hemat kertas` = tiết kiệm giấy.",
          "Lỗi người Việt: nói `dua muka` cho in hai mặt. Ở tiệm in, nói `bolak-balik` rất tự nhiên.",
          "Luyện: `Cetak bolak-balik.`",
        ],
        pronunciation_focus_en: [
          "TO-long CE-tak BO-lak-BA-lik su-PA-ya HE-mat KER-tas - `cetak` = print; `bolak-balik` = double-sided/back-and-forth; `hemat kertas` = save paper.",
          "VN-speaker trap: saying `dua muka` for double-sided printing. At print shops, `bolak-balik` is natural.",
          "Drill: `Cetak bolak-balik.`",
        ],
      },
      {
        en: "Kertasnya mau A4 atau F4?",
        vi: "Giấy muốn khổ A4 hay F4?",
        pronunciation_focus: [
          "KER-tas-nya MAU A-empat A-tau ef-empat - `kertasnya` = giấy/khổ giấy đó; `F4` là khổ giấy rất hay gặp ở Indonesia.",
          "Lỗi người Việt: chỉ chuẩn bị A4. Nhiều giấy tờ Indonesia dùng F4/folio, dài hơn A4.",
          "Luyện: `Pakai kertas F4 saja.`",
        ],
        pronunciation_focus_en: [
          "KER-tas-nya MAU A-four A-tau ef-four - `kertasnya` = the paper/paper size; `F4` is common in Indonesia.",
          "VN-speaker trap: preparing only A4. Many Indonesian documents use F4/folio, longer than A4.",
          "Drill: `Pakai kertas F4 saja.`",
        ],
      },
      {
        en: "Bisa selesai hari ini atau harus ditinggal?",
        vi: "Có thể xong hôm nay không hay phải để lại?",
        pronunciation_focus: [
          "BI-sa se-le-SAI HA-ri I-ni A-tau HA-rus di-TING-gal - `ditinggal` = để lại; `selesai` = xong.",
          "Lỗi người Việt: hỏi cộc `kapan jadi?` được nhưng hơi gấp. Câu này tự nhiên khi cần biết có phải quay lại không.",
          "Luyện: `Harus ditinggal atau bisa ditunggu?`",
        ],
        pronunciation_focus_en: [
          "BI-sa se-le-SAI HA-ri I-ni A-tau HA-rus di-TING-gal - `ditinggal` = left behind; `selesai` = done.",
          "VN-speaker trap: blunt `kapan jadi?` works but sounds rushed. This sentence naturally asks whether you need to come back.",
          "Drill: `Harus ditinggal atau bisa ditunggu?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, tiệm `fotokopi` quanh trường học, văn phòng, kantor kelurahan và kampus thường làm nhiều dịch vụ cùng lúc: fotokopi, print, scan, laminating, jilid, bán map, giấy và văn phòng phẩm. Người ta hay gửi file qua WhatsApp hoặc flashdisk. Khổ giấy F4/folio rất phổ biến cho hồ sơ hành chính, nên luôn hỏi rõ `A4 atau F4`.",
    cultural_notes_en:
      "In Indonesia, `fotokopi` shops near schools, offices, local government counters, and campuses usually handle many services at once: photocopying, printing, scanning, laminating, binding, folders, paper, and stationery. People often send files through WhatsApp or a flash drive. F4/folio paper is very common for administrative documents, so always clarify `A4 atau F4`.",
    tip_advice_vi:
      "Mẹo cho người Việt: ở tiệm dịch vụ, câu ngắn lịch sự là đủ: `Tolong print...`, `Bisa scan...?`, `Berapa biaya...?`. Học các cụm cố định: `hitam putih`, `bolak-balik`, `per lembar`, `ukuran A4`, `jilid spiral`, `kirim file lewat WhatsApp`. Với yêu cầu cho nhân viên làm gì với tài liệu, thể bị động `di-` rất tự nhiên: `dicetak`, `dikirim`, `dilaminating`, `dimasukkan`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: at service shops, short polite lines are enough: `Tolong print...`, `Bisa scan...?`, `Berapa biaya...?`. Learn fixed chunks: `hitam putih`, `bolak-balik`, `per lembar`, `ukuran A4`, `jilid spiral`, `kirim file lewat WhatsApp`. For instructions about what staff should do to a document, passive `di-` sounds natural: `dicetak`, `dikirim`, `dilaminating`, `dimasukkan`.",
    vocabulary: [
      { word: "fotokopi", en: "photocopy", vi: "photo / photocopy", pos: "noun / verb", pronunciation_vi: "fo-to-KO-pi", pronunciation_en: "fo-to-KO-pee" },
      { word: "print", en: "print", vi: "in", pos: "verb", pronunciation_vi: "print", pronunciation_en: "print" },
      { word: "scan", en: "scan", vi: "scan / quét tài liệu", pos: "verb", pronunciation_vi: "sken", pronunciation_en: "scan" },
      { word: "PDF", en: "PDF", vi: "file PDF", pos: "noun", pronunciation_vi: "pe-de-ef", pronunciation_en: "pee-dee-ef" },
      { word: "flashdisk", en: "USB flash drive", vi: "USB", pos: "noun", pronunciation_vi: "FLES-disk", pronunciation_en: "FLASH-disk" },
      { word: "laminating", en: "laminating", vi: "ép plastic", pos: "noun / verb", pronunciation_vi: "LA-mi-na-ting", pronunciation_en: "LA-mi-na-ting" },
      { word: "jilid", en: "binding", vi: "đóng gáy / đóng quyển", pos: "noun / verb", pronunciation_vi: "JI-lid", pronunciation_en: "JEE-lid" },
      { word: "kirim file", en: "send a file", vi: "gửi file", pos: "verb phrase", pronunciation_vi: "KI-rim fail", pronunciation_en: "KI-rim file" },
      { word: "ukuran kertas", en: "paper size", vi: "khổ giấy", pos: "noun phrase", pronunciation_vi: "u-KU-ran KER-tas", pronunciation_en: "u-KU-ran KER-tas" },
      { word: "hitam putih", en: "black and white", vi: "đen trắng", pos: "adjective phrase", pronunciation_vi: "HI-tam PU-tih", pronunciation_en: "HI-tam POO-tih" },
      { word: "bolak-balik", en: "double-sided / back-and-forth", vi: "hai mặt / qua lại", pos: "adverb", pronunciation_vi: "BO-lak-BA-lik", pronunciation_en: "BO-lak-BA-lik" },
      { word: "per lembar", en: "per sheet", vi: "mỗi tờ", pos: "phrase", pronunciation_vi: "per LEM-bar", pronunciation_en: "per LEM-bar" },
    ],
    dialogue: [
      {
        speaker: "Pelanggan",
        text: "Mbak, saya mau print file PDF ini ukuran A4, hitam putih saja.",
        vi: "Chị ơi, tôi muốn in file PDF này khổ A4, đen trắng thôi.",
        en: "Hi, I want to print this PDF in A4, black and white only.",
      },
      {
        speaker: "Petugas",
        text: "File-nya ada di flashdisk atau mau kirim lewat WhatsApp?",
        vi: "File ở trong USB hay muốn gửi qua WhatsApp?",
        en: "Is the file on a flash drive, or do you want to send it via WhatsApp?",
      },
      {
        speaker: "Pelanggan",
        text: "Saya kirim lewat WhatsApp. Bisa sekalian scan KTP jadi PDF?",
        vi: "Tôi gửi qua WhatsApp. Có thể tiện scan KTP thành PDF luôn không?",
        en: "I will send it through WhatsApp. Can you also scan my ID into a PDF?",
      },
      {
        speaker: "Petugas",
        text: "Bisa. Mau dilaminating juga atau cukup dimasukkan ke map?",
        vi: "Được. Muốn ép plastic luôn hay chỉ cần bỏ vào bìa hồ sơ?",
        en: "Sure. Do you want it laminated too, or just put into a folder?",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng ở tiệm in và photocopy:",
        instruction_en: "Fill in the right word at the print/copy shop:",
        items: [
          {
            prompt: "Tolong ___ file PDF ini ukuran A4. (in)",
            answer: "print",
            options: ["print", "parkir", "potong"],
          },
          {
            prompt: "Berapa biaya laminating per ___? (tờ)",
            answer: "lembar",
            options: ["lembar", "liter", "lantai"],
          },
          {
            prompt: "File-nya ada di ___. (USB)",
            answer: "flashdisk",
            options: ["flashdisk", "fotokopi", "folder"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối cụm tiếng Indonesia với nghĩa tiếng Việt:",
        instruction_en: "Match each Indonesian phrase with its Vietnamese meaning:",
        items: [
          { prompt: "hitam putih", answer: "đen trắng" },
          { prompt: "bolak-balik", answer: "in hai mặt" },
          { prompt: "jilid spiral", answer: "đóng gáy xoắn" },
          { prompt: "ukuran kertas", answer: "khổ giấy" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Làm ơn scan giấy tờ này thành PDF.", answer: "Tolong scan dokumen ini jadi PDF." },
          { prompt: "Tôi gửi file qua WhatsApp.", answer: "Saya kirim file lewat WhatsApp." },
          { prompt: "Đừng ép plastic giấy tờ này.", answer: "Dokumen ini jangan dilaminating." },
        ],
      },
    ],
  },
];

export default lessons;
