// Internet cafe and printing Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It mirrors sibling Indonesian `extra/*`
// files: target-language text is stored in `en`, Vietnamese glosses in `vi`,
// Vietnamese-facing L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.
//
// Register note: warnet/printing-shop Indonesian mixes service and tech terms:
// `warnet`, `komputer umum`, `print dokumen`, `scan KTP`, `kirim email`,
// `bayar per jam`, `file PDF`, and `keamanan akun`.

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
    id: "indonesian_internet_cafe_printing",
    level: "A2",
    category: "technology",
    title_vi: "Warnet, in tài liệu và bảo mật tài khoản",
    title_en: "Internet cafes, printing, and account security",
    sentences: [
      {
        en: "Di dekat sini ada warnet atau tempat print?",
        vi: "Gần đây có quán internet hoặc chỗ in không?",
        pronunciation_focus: [
          "di de-KAT SI-ni A-da WAR-net A-tau TEM-pat prin - `warnet` = quán internet; `tempat print` = chỗ in.",
          "Lỗi người Việt: nói `internet cafe` trong câu Indonesia. Từ đời thường là `warnet`.",
          "Luyện: `Ada warnet dekat sini?`",
        ],
        pronunciation_focus_en: [
          "dee deh-KAT SEE-nee A-da WAR-net A-tau TEM-pat print - `warnet` = internet cafe; `tempat print` = printing place.",
          "VN-speaker trap: saying English `internet cafe` inside Indonesian. Everyday Indonesian uses `warnet`.",
          "Drill: `Ada warnet dekat sini?`",
        ],
      },
      {
        en: "Saya perlu pakai komputer umum sebentar.",
        vi: "Tôi cần dùng máy tính công cộng một lát.",
        pronunciation_focus: [
          "SA-ya PER-lu PA-kai kom-PU-ter U-mum se-BEN-tar - `komputer umum` = máy tính công cộng; `sebentar` = một lát.",
          "Lỗi người Việt: dùng `publik komputer` theo tiếng Anh. Thứ tự tự nhiên là `komputer umum`.",
          "Luyện: `Pakai komputer umum sebentar.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PER-loo PA-kai kom-POO-ter OO-moom seh-BEN-tar - `komputer umum` = public computer; `sebentar` = briefly.",
          "VN-speaker trap: saying `publik komputer` from English order. Natural order is `komputer umum`.",
          "Drill: `Pakai komputer umum sebentar.`",
        ],
      },
      {
        en: "Bayar per jam atau per dokumen?",
        vi: "Trả tiền theo giờ hay theo tài liệu?",
        pronunciation_focus: [
          "BA-yar per JAM A-tau per do-ku-MEN - `bayar per jam` = trả theo giờ; `per dokumen` = theo từng tài liệu.",
          "Lỗi người Việt: hỏi giá bằng `apa`. Khi hỏi tiền/cách tính tiền, dùng `berapa` hoặc hỏi mẫu `per jam atau per dokumen?`.",
          "Luyện: `Bayar per jam?`",
        ],
        pronunciation_focus_en: [
          "BA-yar per JAM A-tau per do-koo-MEN - `bayar per jam` = pay by the hour; `per dokumen` = per document.",
          "VN-speaker note: do not ask prices with `apa`. For payment method, ask a clear choice like `per jam atau per dokumen?`.",
          "Drill: `Bayar per jam?`",
        ],
      },
      {
        en: "Tolong print dokumen ini dua rangkap.",
        vi: "Làm ơn in tài liệu này hai bản.",
        pronunciation_focus: [
          "TO-long prin do-ku-MEN I-ni DU-a RANG-kap - `print dokumen` = in tài liệu; `dua rangkap` = hai bản/bộ.",
          "Lỗi người Việt: nói `dua kopi` dễ bị hiểu là hai ly cà phê. Với tài liệu, dùng `dua rangkap` hoặc `dua lembar`.",
          "Luyện: `Print dua rangkap.`",
        ],
        pronunciation_focus_en: [
          "TO-long print do-koo-MEN EE-nee DOO-a RANG-kap - `print dokumen` = print a document; `dua rangkap` = two copies/sets.",
          "VN-speaker trap: `dua kopi` may sound like two coffees. For documents, use `dua rangkap` or `dua lembar`.",
          "Drill: `Print dua rangkap.`",
        ],
      },
      {
        en: "File PDF-nya ada di flashdisk saya.",
        vi: "File PDF ở trong USB của tôi.",
        pronunciation_focus: [
          "fail pe-de-EF-nya A-da di flash-DISK SA-ya - `file PDF` = file PDF; `flashdisk` = USB.",
          "Lỗi người Việt: nói `di flashdisk` đúng vì file đang ở trong USB; gửi đến máy tính mới dùng `ke komputer`.",
          "Luyện: `File PDF ada di flashdisk.`",
        ],
        pronunciation_focus_en: [
          "file pe-deh-EF-nya A-da dee flash-DISK SA-ya - `file PDF` = PDF file; `flashdisk` = USB drive.",
          "VN-speaker note: `di flashdisk` is correct because the file is on the USB; moving it to a computer uses `ke komputer`.",
          "Drill: `File PDF ada di flashdisk.`",
        ],
      },
      {
        en: "Bisa scan KTP saya menjadi file PDF?",
        vi: "Có thể scan KTP của tôi thành file PDF không?",
        pronunciation_focus: [
          "BI-sa sken ka-te-PE SA-ya men-JA-di fail pe-de-EF - `scan KTP` = scan KTP; `menjadi file PDF` = thành file PDF.",
          "Lỗi người Việt: bỏ `menjadi` khi nói chuyển định dạng. Dùng `menjadi file PDF` để rõ kết quả.",
          "Luyện: `Scan menjadi file PDF.`",
        ],
        pronunciation_focus_en: [
          "BEE-sa scan ka-teh-PEH SA-ya men-JA-dee file peh-deh-EF - `scan KTP` = scan my ID card; `menjadi file PDF` = into a PDF file.",
          "VN-speaker trap: dropping `menjadi` when converting format. Use `menjadi file PDF` to state the result.",
          "Drill: `Scan menjadi file PDF.`",
        ],
      },
      {
        en: "Saya mau kirim email dengan lampiran dokumen.",
        vi: "Tôi muốn gửi email có đính kèm tài liệu.",
        pronunciation_focus: [
          "SA-ya mau KI-rim I-mel de-NGAN lam-PIR-an do-ku-MEN - `kirim email` = gửi email; `lampiran` = tệp đính kèm.",
          "Lỗi người Việt: nói `attach dokumen` trong câu Indonesia. Từ tự nhiên và trang trọng là `lampiran dokumen`.",
          "Luyện: `Kirim email dengan lampiran.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau KEE-rim EE-mail deh-NGAN lam-PEER-an do-koo-MEN - `kirim email` = send email; `lampiran` = attachment.",
          "VN-speaker trap: saying `attach dokumen` inside Indonesian. Natural/formal Indonesian uses `lampiran dokumen`.",
          "Drill: `Kirim email dengan lampiran.`",
        ],
      },
      {
        en: "Tolong jangan simpan password saya di komputer ini.",
        vi: "Vui lòng đừng lưu mật khẩu của tôi trên máy tính này.",
        pronunciation_focus: [
          "TO-long JA-ngan SIM-pan PAS-word SA-ya di kom-PU-ter I-ni - `jangan simpan` = đừng lưu; `password` = mật khẩu.",
          "Lỗi người Việt: dùng `tidak simpan` cho mệnh lệnh cấm. Mệnh lệnh phủ định dùng `jangan`.",
          "Luyện: `Jangan simpan password.`",
        ],
        pronunciation_focus_en: [
          "TO-long JA-ngan SIM-pan PAS-word SA-ya dee kom-POO-ter EE-nee - `jangan simpan` = do not save; `password` = password.",
          "VN-speaker trap: using `tidak simpan` for a negative command. Negative commands use `jangan`.",
          "Drill: `Jangan simpan password.`",
        ],
      },
      {
        en: "Saya harus logout setelah selesai memakai komputer umum.",
        vi: "Tôi phải đăng xuất sau khi dùng xong máy tính công cộng.",
        pronunciation_focus: [
          "SA-ya HA-rus log-AUT se-TE-lah se-LE-sai me-MA-kai kom-PU-ter U-mum - `logout` = đăng xuất; `setelah selesai` = sau khi xong.",
          "Lỗi người Việt: nói `keluar akun` được hiểu, nhưng trong bối cảnh máy tính `logout` rất tự nhiên.",
          "Luyện: `Logout setelah selesai.`",
        ],
        pronunciation_focus_en: [
          "SA-ya HA-roos log-OUT seh-TEH-lah seh-LEH-sai meh-MA-kai kom-POO-ter OO-moom - `logout` = log out; `setelah selesai` = after finishing.",
          "VN-speaker note: `keluar akun` is understood, but with computers `logout` is very natural.",
          "Drill: `Logout setelah selesai.`",
        ],
      },
      {
        en: "Apakah aman membuka akun bank di komputer umum?",
        vi: "Mở tài khoản ngân hàng trên máy tính công cộng có an toàn không?",
        pronunciation_focus: [
          "a-PA-kah A-man mem-BU-ka A-kun bank di kom-PU-ter U-mum - `aman` = an toàn; `akun bank` = tài khoản ngân hàng.",
          "Lỗi người Việt: lẫn `membuka akun` nghĩa đăng nhập/mở tài khoản theo ngữ cảnh. Với bảo mật, hỏi thêm `aman?`.",
          "Luyện: `Aman di komputer umum?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah A-man mem-BOO-ka A-koon bank dee kom-POO-ter OO-moom - `aman` = safe; `akun bank` = bank account.",
          "VN-speaker note: `membuka akun` can mean opening/logging into an account by context. For security, add `aman?`.",
          "Drill: `Aman di komputer umum?`",
        ],
      },
      {
        en: "Komputer ini tidak bisa membuka file saya.",
        vi: "Máy tính này không mở được file của tôi.",
        pronunciation_focus: [
          "kom-PU-ter I-ni TI-dak BI-sa mem-BU-ka fail SA-ya - `tidak bisa membuka` = không mở được.",
          "Lỗi người Việt: dùng `buka tidak bisa` theo trật tự tiếng Việt. Trật tự tự nhiên: `tidak bisa membuka file`.",
          "Luyện: `Tidak bisa membuka file.`",
        ],
        pronunciation_focus_en: [
          "kom-POO-ter EE-nee TEE-dak BEE-sa mem-BOO-ka file SA-ya - `tidak bisa membuka` = cannot open.",
          "VN-speaker trap: saying `buka tidak bisa` from Vietnamese word order. Natural order: `tidak bisa membuka file`.",
          "Drill: `Tidak bisa membuka file.`",
        ],
      },
      {
        en: "Berapa biaya print warna per lembar?",
        vi: "In màu mỗi tờ bao nhiêu tiền?",
        pronunciation_focus: [
          "be-RA-pa BI-a-ya prin WAR-na per LEM-bar - `print warna` = in màu; `per lembar` = mỗi tờ.",
          "Lỗi người Việt: dùng `kertas` khi hỏi đơn vị tính. Đơn vị tờ in là `lembar`.",
          "Luyện: `Print warna per lembar berapa?`",
        ],
        pronunciation_focus_en: [
          "beh-RA-pa BEE-a-ya print WAR-na per LEM-bar - `print warna` = color printing; `per lembar` = per sheet.",
          "VN-speaker trap: using `kertas` when asking the billing unit. The unit for printed pages is `lembar`.",
          "Drill: `Print warna per lembar berapa?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, `warnet` vẫn có thể hữu ích khi cần máy tính, in, scan KTP, hoặc gửi tài liệu gấp. Khi dùng komputer umum, tránh lưu password, nhớ logout, xóa file cá nhân nếu cần, và hạn chế mở tài khoản ngân hàng hoặc dữ liệu nhạy cảm. Bài này dạy ngôn ngữ thực tế, không hứa hỗ trợ kỹ thuật hay bảo mật tuyệt đối.",
    cultural_notes_en:
      "In Indonesia, a `warnet` can still be useful when you need a computer, printing, ID scanning, or urgent document sending. On a public computer, avoid saving passwords, remember to log out, delete personal files if needed, and avoid opening bank accounts or sensitive data. This lesson teaches practical language and does not promise technical support or absolute security.",
    tip_advice_vi:
      "Mẹo cho người Việt: hỏi giá in bằng `berapa biaya...`, hỏi đơn vị bằng `per lembar` hoặc `per jam`, và khi dùng máy công cộng hãy nói rõ `jangan simpan password` và `saya harus logout`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: ask printing prices with `berapa biaya...`, ask the unit with `per lembar` or `per jam`, and on public computers use clear lines like `jangan simpan password` and `saya harus logout`.",
    vocabulary: [
      {
        word: "warnet",
        en: "internet cafe",
        vi: "quán internet",
        pos: "noun",
        pronunciation_vi: "WAR-net",
        pronunciation_en: "WAR-net",
      },
      {
        word: "komputer umum",
        en: "public computer",
        vi: "máy tính công cộng",
        pos: "noun phrase",
        pronunciation_vi: "kom-PU-ter U-mum",
        pronunciation_en: "kom-POO-ter OO-moom",
      },
      {
        word: "print dokumen",
        en: "print a document",
        vi: "in tài liệu",
        pos: "verb phrase",
        pronunciation_vi: "prin do-ku-MEN",
        pronunciation_en: "print do-koo-MEN",
      },
      {
        word: "scan KTP",
        en: "scan an ID card",
        vi: "scan KTP",
        pos: "verb phrase",
        pronunciation_vi: "sken ka-te-PE",
        pronunciation_en: "scan ka-teh-PEH",
      },
      {
        word: "kirim email",
        en: "send email",
        vi: "gửi email",
        pos: "verb phrase",
        pronunciation_vi: "KI-rim I-mel",
        pronunciation_en: "KEE-rim EE-mail",
      },
      {
        word: "bayar per jam",
        en: "pay by the hour",
        vi: "trả theo giờ",
        pos: "verb phrase",
        pronunciation_vi: "BA-yar per JAM",
        pronunciation_en: "BA-yar per JAM",
      },
      {
        word: "file PDF",
        en: "PDF file",
        vi: "file PDF",
        pos: "noun phrase",
        pronunciation_vi: "fail pe-de-EF",
        pronunciation_en: "file peh-deh-EF",
      },
      {
        word: "keamanan akun",
        en: "account security",
        vi: "bảo mật tài khoản",
        pos: "noun phrase",
        pronunciation_vi: "ke-a-MA-nan A-kun",
        pronunciation_en: "keh-a-MA-nan A-koon",
      },
      {
        word: "lampiran",
        en: "attachment",
        vi: "tệp đính kèm",
        pos: "noun",
        pronunciation_vi: "lam-PIR-an",
        pronunciation_en: "lam-PEER-an",
      },
      {
        word: "per lembar",
        en: "per sheet",
        vi: "mỗi tờ",
        pos: "phrase",
        pronunciation_vi: "per LEM-bar",
        pronunciation_en: "per LEM-bar",
      },
    ],
    dialogue: [
      {
        speaker: "Pelanggan",
        text: "Permisi, saya perlu pakai komputer umum dan print dokumen.",
        vi: "Xin lỗi, tôi cần dùng máy tính công cộng và in tài liệu.",
        en: "Excuse me, I need to use a public computer and print a document.",
      },
      {
        speaker: "Petugas Warnet",
        text: "Bisa. Bayar per jam untuk komputer, dan print dihitung per lembar.",
        vi: "Được. Máy tính tính theo giờ, còn in tính theo tờ.",
        en: "Sure. The computer is paid by the hour, and printing is charged per sheet.",
      },
      {
        speaker: "Pelanggan",
        text: "Saya juga mau scan KTP menjadi file PDF dan kirim email.",
        vi: "Tôi cũng muốn scan KTP thành file PDF và gửi email.",
        en: "I also want to scan my ID card into a PDF file and send an email.",
      },
      {
        speaker: "Petugas Warnet",
        text: "Baik. Setelah selesai, jangan lupa logout dari akun Anda.",
        vi: "Được. Sau khi xong, đừng quên đăng xuất khỏi tài khoản của anh/chị.",
        en: "All right. After finishing, do not forget to log out of your account.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: “Tôi cần in tài liệu này.”",
        prompt_en: "Translate into Indonesian: “I need to print this document.”",
        answer: "Saya perlu print dokumen ini.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ còn thiếu: Bayar per ____ atau per dokumen?",
        prompt_en: "Fill in the blank: Bayar per ____ atau per dokumen?",
        answer: "jam",
      },
      {
        type: "multiple_choice",
        prompt_vi: "Cụm nào nghĩa là “máy tính công cộng”?",
        prompt_en: "Which phrase means “public computer”?",
        choices: ["komputer umum", "komputer aman", "komputer warna"],
        answer: "komputer umum",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `lampiran` = ?",
        prompt_en: "Match the meaning: `lampiran` = ?",
        answer: "attachment",
      },
    ],
  },
];

export default lessons;
