// Library & Study Space Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It mirrors sibling Indonesian `extra/*`
// files: target-language text is stored in `en`, Vietnamese glosses in `vi`,
// Vietnamese-facing L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.
//
// Register note: library Indonesian is polite and rule-focused: `perpustakaan`,
// `kartu anggota`, `pinjam buku`, `ruang belajar`, `Wi-Fi`, `tenang`, `denda
// buku`, and `jam buka`.

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
    id: "indonesian_library_study_space",
    level: "A2",
    category: "education",
    title_vi: "Thư viện và không gian học tập",
    title_en: "Library and study space Indonesian",
    sentences: [
      {
        en: "Di mana perpustakaan terdekat?",
        vi: "Thư viện gần nhất ở đâu?",
        pronunciation_focus: [
          "di MA-na per-pus-ta-KA-an ter-DE-kat - `perpustakaan` = thư viện; `terdekat` = gần nhất.",
          "Lỗi người Việt: nói `library` trong câu Indonesia. Từ tự nhiên là `perpustakaan`.",
          "Luyện: `Di mana perpustakaan terdekat?`",
        ],
        pronunciation_focus_en: [
          "dee MA-na per-poos-ta-KA-an ter-DEH-kat - `perpustakaan` = library; `terdekat` = nearest.",
          "VN-speaker trap: using English `library` inside Indonesian. Natural Indonesian is `perpustakaan`.",
          "Drill: `Di mana perpustakaan terdekat?`",
        ],
      },
      {
        en: "Saya mau membuat kartu anggota.",
        vi: "Tôi muốn làm thẻ thành viên.",
        pronunciation_focus: [
          "SA-ya mau mem-BU-at KAR-tu ang-GO-ta - `kartu anggota` = thẻ thành viên.",
          "Lỗi người Việt: dùng `member card` tiếng Anh. Ở thư viện nói `kartu anggota`.",
          "Luyện: `Saya mau membuat kartu anggota.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau mem-BOO-at KAR-too ang-GO-ta - `kartu anggota` = membership card.",
          "VN-speaker trap: using English `member card`. At a library, say `kartu anggota`.",
          "Drill: `Saya mau membuat kartu anggota.`",
        ],
      },
      {
        en: "Dokumen apa saja yang diperlukan untuk daftar?",
        vi: "Cần những giấy tờ gì để đăng ký?",
        pronunciation_focus: [
          "DO-ku-men A-pa SA-ja yang di-per-LU-kan UN-tuk DAF-tar - `apa saja` = những gì; `daftar` = đăng ký.",
          "Lỗi người Việt: bỏ `saja`, làm câu nghe như hỏi một giấy tờ. `Apa saja` hỏi cả danh sách.",
          "Luyện: `Dokumen apa saja yang diperlukan?`",
        ],
        pronunciation_focus_en: [
          "DO-koo-men A-pa SA-ja yang dee-per-LOO-kan OON-took DAF-tar - `apa saja` = what all; `daftar` = register.",
          "VN-speaker trap: dropping `saja`, making it sound like one document. `Apa saja` asks for the whole list.",
          "Drill: `Dokumen apa saja yang diperlukan?`",
        ],
      },
      {
        en: "Saya ingin pinjam buku ini selama satu minggu.",
        vi: "Tôi muốn mượn cuốn sách này trong một tuần.",
        pronunciation_focus: [
          "SA-ya I-ngin PIN-jam BU-ku I-ni se-LA-ma SA-tu MING-gu - `pinjam buku` = mượn sách; `selama` = trong thời gian.",
          "Lỗi người Việt: lẫn `pinjam` (mượn/vay) với `sewa` (thuê). Sách thư viện là `pinjam`.",
          "Luyện: `Saya ingin pinjam buku ini.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin PIN-jam BOO-koo EE-nee se-LA-ma SA-too MING-goo - `pinjam buku` = borrow a book; `selama` = for a duration.",
          "VN-speaker trap: confusing `pinjam` (borrow) with `sewa` (rent). Library books are `pinjam`.",
          "Drill: `Saya ingin pinjam buku ini.`",
        ],
      },
      {
        en: "Kapan batas pengembalian buku?",
        vi: "Hạn trả sách là khi nào?",
        pronunciation_focus: [
          "KA-pan BA-tas pe-ngem-BA-li-an BU-ku - `batas pengembalian` = hạn trả; `buku` = sách.",
          "Lỗi người Việt: nói `kapan kembali buku`. Cụm danh từ chuẩn là `pengembalian buku`.",
          "Luyện: `Kapan batas pengembalian?`",
        ],
        pronunciation_focus_en: [
          "KA-pan BA-tas pe-ngem-BA-lee-an BOO-koo - `batas pengembalian` = return deadline; `buku` = book.",
          "VN-speaker trap: saying `kapan kembali buku`. The standard noun phrase is `pengembalian buku`.",
          "Drill: `Kapan batas pengembalian?`",
        ],
      },
      {
        en: "Apakah ada denda kalau buku terlambat dikembalikan?",
        vi: "Có phạt nếu sách bị trả muộn không?",
        pronunciation_focus: [
          "a-PA-kah A-da DEN-da KA-lau BU-ku ter-LAM-bat di-kem-BA-li-kan - `denda` = tiền phạt; `terlambat` = trễ.",
          "Lỗi người Việt: dùng `hukuman` cho tiền phạt. Với sách trả trễ, dùng `denda`.",
          "Luyện: `Ada denda kalau terlambat?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah A-da DEN-da KA-lau BOO-koo ter-LAM-bat dee-kem-BA-lee-kan - `denda` = fine; `terlambat` = late.",
          "VN-speaker trap: using `hukuman` for a money fine. For late books, use `denda`.",
          "Drill: `Ada denda kalau terlambat?`",
        ],
      },
      {
        en: "Ruang belajar kelompok ada di lantai dua.",
        vi: "Phòng học nhóm ở tầng hai.",
        pronunciation_focus: [
          "RU-ang be-LA-jar ke-LOM-pok A-da di LAN-tai DU-a - `ruang belajar` = phòng học; `kelompok` = nhóm.",
          "Lỗi người Việt: dùng `kamar` cho mọi phòng. Phòng chức năng công cộng thường là `ruang`.",
          "Luyện: `Ruang belajar ada di lantai dua.`",
        ],
        pronunciation_focus_en: [
          "ROO-ang be-LA-jar ke-LOM-pok A-da dee LAN-tai DOO-a - `ruang belajar` = study room; `kelompok` = group.",
          "VN-speaker trap: using `kamar` for every room. Public function rooms are usually `ruang`.",
          "Drill: `Ruang belajar ada di lantai dua.`",
        ],
      },
      {
        en: "Bisa pesan ruang belajar untuk sore ini?",
        vi: "Có thể đặt phòng học cho chiều nay không?",
        pronunciation_focus: [
          "BI-sa PE-san RU-ang be-LA-jar UN-tuk SO-re I-ni - `pesan` = đặt trước; `sore ini` = chiều nay.",
          "Lỗi người Việt: `pesan` không chỉ là nhắn tin; trong lịch/phòng nghĩa là đặt trước.",
          "Luyện: `Bisa pesan ruang belajar?`",
        ],
        pronunciation_focus_en: [
          "BEE-sa PEH-san ROO-ang be-LA-jar OON-took SO-reh EE-nee - `pesan` = reserve/book; `sore ini` = this afternoon.",
          "VN-speaker trap: `pesan` is not only 'message'; for rooms/schedules it means reserve.",
          "Drill: `Bisa pesan ruang belajar?`",
        ],
      },
      {
        en: "Password Wi-Fi perpustakaan apa?",
        vi: "Mật khẩu Wi-Fi của thư viện là gì?",
        pronunciation_focus: [
          "PAS-word WAI-fai per-pus-ta-KA-an A-pa - `password Wi-Fi` = mật khẩu Wi-Fi.",
          "Lỗi người Việt: hỏi `berapa password` vì có số. Mật khẩu nói chung hỏi `apa`, không phải `berapa`.",
          "Luyện: `Password Wi-Fi apa?`",
        ],
        pronunciation_focus_en: [
          "PAS-word WAI-fai per-poos-ta-KA-an A-pa - `password Wi-Fi` = Wi-Fi password.",
          "VN-speaker trap: asking `berapa password` because it may contain numbers. A password is asked with `apa`.",
          "Drill: `Password Wi-Fi apa?`",
        ],
      },
      {
        en: "Mohon tenang, ada orang sedang belajar.",
        vi: "Xin giữ yên lặng, có người đang học.",
        pronunciation_focus: [
          "MO-hon TE-nang, A-da O-rang se-DANG be-LA-jar - `mohon` = xin/mong; `tenang` = yên lặng/bình tĩnh.",
          "Lỗi người Việt: nói `diam!` nghe gắt. Trong thư viện dùng `mohon tenang` lịch sự hơn.",
          "Luyện: `Mohon tenang.`",
        ],
        pronunciation_focus_en: [
          "MO-hon TEH-nang, A-da O-rang se-DANG be-LA-jar - `mohon` = kindly/please; `tenang` = quiet/calm.",
          "VN-speaker trap: `diam!` sounds harsh. In a library, `mohon tenang` is more polite.",
          "Drill: `Mohon tenang.`",
        ],
      },
      {
        en: "Jam buka perpustakaan sampai jam delapan malam.",
        vi: "Giờ mở cửa thư viện đến tám giờ tối.",
        pronunciation_focus: [
          "jam BU-ka per-pus-ta-KA-an SAM-pai jam de-LA-pan MA-lam - `jam buka` = giờ mở cửa; `sampai` = đến.",
          "Lỗi người Việt: nói `jam membuka`. Danh từ cố định là `jam buka`.",
          "Luyện: `Jam buka sampai jam delapan malam.`",
        ],
        pronunciation_focus_en: [
          "jam BOO-ka per-poos-ta-KA-an SAM-pai jam de-LA-pan MA-lam - `jam buka` = opening hours; `sampai` = until.",
          "VN-speaker trap: saying `jam membuka`. The fixed noun phrase is `jam buka`.",
          "Drill: `Jam buka sampai jam delapan malam.`",
        ],
      },
      {
        en: "Saya mau perpanjang masa pinjam buku.",
        vi: "Tôi muốn gia hạn thời gian mượn sách.",
        pronunciation_focus: [
          "SA-ya mau per-PAN-jang MA-sa PIN-jam BU-ku - `perpanjang` = gia hạn; `masa pinjam` = thời hạn mượn.",
          "Lỗi người Việt: nói `tambah waktu pinjam` vẫn hiểu, nhưng thư viện thường nói `perpanjang masa pinjam`.",
          "Luyện: `Perpanjang masa pinjam buku.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau per-PAN-jang MA-sa PIN-jam BOO-koo - `perpanjang` = extend/renew; `masa pinjam` = loan period.",
          "VN-speaker note: `tambah waktu pinjam` is understood, but libraries commonly say `perpanjang masa pinjam`.",
          "Drill: `Perpanjang masa pinjam buku.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Thư viện ở Indonesia có thể là thư viện trường, thư viện kampus, thư viện thành phố, hoặc ruang baca cộng đồng. Nhiều nơi yêu cầu `kartu anggota` để `pinjam buku`, có `denda` nếu trả trễ, và có khu `ruang belajar` yên tĩnh. Khi hỏi nhân viên, dùng `Pak/Bu` hoặc `Kak` tùy tuổi và bối cảnh.",
    cultural_notes_en:
      "Libraries in Indonesia may be school libraries, campus libraries, city libraries, or community reading rooms. Many require a `kartu anggota` to `pinjam buku`, charge a `denda` for late returns, and provide quiet `ruang belajar` areas. When asking staff, use `Pak/Bu` or `Kak` depending on age and context.",
    tip_advice_vi:
      "Mẹo cho người Việt: nhớ ba khung hữu dụng: `Saya mau membuat kartu anggota`, `Saya ingin pinjam buku ini`, `Kapan batas pengembalian?`. Với không gian học, phân biệt `tenang` = yên lặng/bình tĩnh và `diam` = im đi, có thể nghe thô.",
    tip_advice_en:
      "Tip for Vietnamese speakers: memorize three useful frames: `Saya mau membuat kartu anggota`, `Saya ingin pinjam buku ini`, `Kapan batas pengembalian?`. For study spaces, distinguish `tenang` = quiet/calm from `diam` = be quiet, which can sound blunt.",
    vocabulary: [
      {
        word: "perpustakaan",
        en: "library",
        vi: "thư viện",
        pos: "noun",
        pronunciation_vi: "per-pus-ta-KA-an",
        pronunciation_en: "per-poos-ta-KA-an",
      },
      {
        word: "kartu anggota",
        en: "membership card",
        vi: "thẻ thành viên",
        pos: "noun phrase",
        pronunciation_vi: "KAR-tu ang-GO-ta",
        pronunciation_en: "KAR-too ang-GO-ta",
      },
      {
        word: "pinjam buku",
        en: "borrow a book",
        vi: "mượn sách",
        pos: "verb phrase",
        pronunciation_vi: "PIN-jam BU-ku",
        pronunciation_en: "PIN-jam BOO-koo",
      },
      {
        word: "ruang belajar",
        en: "study room",
        vi: "phòng học / không gian học",
        pos: "noun phrase",
        pronunciation_vi: "RU-ang be-LA-jar",
        pronunciation_en: "ROO-ang be-LA-jar",
      },
      {
        word: "Wi-Fi",
        en: "Wi-Fi",
        vi: "Wi-Fi",
        pos: "noun",
        pronunciation_vi: "WAI-fai",
        pronunciation_en: "WAI-fai",
      },
      {
        word: "tenang",
        en: "quiet / calm",
        vi: "yên lặng / bình tĩnh",
        pos: "adjective",
        pronunciation_vi: "TE-nang",
        pronunciation_en: "TEH-nang",
      },
      {
        word: "denda buku",
        en: "book fine",
        vi: "tiền phạt sách",
        pos: "noun phrase",
        pronunciation_vi: "DEN-da BU-ku",
        pronunciation_en: "DEN-da BOO-koo",
      },
      {
        word: "jam buka",
        en: "opening hours",
        vi: "giờ mở cửa",
        pos: "noun phrase",
        pronunciation_vi: "jam BU-ka",
        pronunciation_en: "jam BOO-ka",
      },
      {
        word: "batas pengembalian",
        en: "return deadline",
        vi: "hạn trả",
        pos: "noun phrase",
        pronunciation_vi: "BA-tas pe-ngem-BA-li-an",
        pronunciation_en: "BA-tas pe-ngem-BA-lee-an",
      },
      {
        word: "perpanjang masa pinjam",
        en: "extend the loan period",
        vi: "gia hạn thời gian mượn",
        pos: "verb phrase",
        pronunciation_vi: "per-PAN-jang MA-sa PIN-jam",
        pronunciation_en: "per-PAN-jang MA-sa PIN-jam",
      },
      {
        word: "ruang baca",
        en: "reading room",
        vi: "phòng đọc",
        pos: "noun phrase",
        pronunciation_vi: "RU-ang BA-ca",
        pronunciation_en: "ROO-ang BA-cha",
      },
      {
        word: "petugas perpustakaan",
        en: "library staff",
        vi: "nhân viên thư viện",
        pos: "noun phrase",
        pronunciation_vi: "pe-TU-gas per-pus-ta-KA-an",
        pronunciation_en: "pe-TOO-gas per-poos-ta-KA-an",
      },
    ],
    dialogue: [
      {
        speaker: "Pengunjung",
        text: "Permisi, saya mau membuat kartu anggota perpustakaan.",
        vi: "Xin phép, tôi muốn làm thẻ thành viên thư viện.",
        en: "Excuse me, I want to make a library membership card.",
      },
      {
        speaker: "Petugas",
        text: "Boleh. Tolong isi formulir ini dan tunjukkan kartu identitas.",
        vi: "Được. Làm ơn điền mẫu này và xuất trình giấy tờ tùy thân.",
        en: "Sure. Please fill in this form and show an ID card.",
      },
      {
        speaker: "Pengunjung",
        text: "Setelah itu, saya bisa pinjam buku hari ini?",
        vi: "Sau đó, hôm nay tôi có thể mượn sách không?",
        en: "After that, can I borrow books today?",
      },
      {
        speaker: "Petugas",
        text: "Bisa. Batas pengembalian dua minggu, dan ada denda kalau terlambat.",
        vi: "Có thể. Hạn trả là hai tuần, và có phạt nếu trễ.",
        en: "Yes. The return deadline is two weeks, and there is a fine if it is late.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi muốn mượn cuốn sách này trong một tuần.",
        answer: "Saya ingin pinjam buku ini selama satu minggu.",
      },
      {
        type: "fill_blank",
        prompt: "Saya mau membuat kartu ____.",
        answer: "anggota",
        explanation_vi: "`kartu anggota` = thẻ thành viên.",
        explanation_en: "`kartu anggota` = membership card.",
      },
      {
        type: "multiple_choice",
        prompt: "Which phrase means 'return deadline'?",
        choices: ["batas pengembalian", "jam buka", "ruang belajar", "denda buku"],
        answer: "batas pengembalian",
      },
      {
        type: "matching",
        pairs: [
          ["perpustakaan", "thư viện"],
          ["pinjam buku", "mượn sách"],
          ["denda buku", "tiền phạt sách"],
          ["jam buka", "giờ mở cửa"],
        ],
      },
    ],
  },
];

export default lessons;
