// Renting a Kost Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It follows the established Indonesian extra
// lesson format: Indonesian target text lives in `en`, Vietnamese glosses live in
// `vi`, and each Vietnamese-facing learning note has an English companion.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus -- same length + order. */
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
    id: "indonesian_renting_kost",
    level: "A2",
    category: "housing",
    title_vi: "Thuê kost và kontrakan ở Indonesia",
    title_en: "Renting a kost or kontrakan in Indonesia",
    sentences: [
      {
        en: "Saya sedang mencari kost dekat tempat kerja.",
        vi: "Tôi đang tìm phòng trọ gần chỗ làm.",
        pronunciation_focus: [
          "SA-ya se-DANG men-CA-ri kost de-KAT TEM-pat KER-ja -- `kost` = phòng trọ/nhà trọ; `tempat kerja` = chỗ làm.",
          "Lỗi người Việt: đọc `mencari` thành 'men-ka-ri'. Trong tiếng Indonesia, `c` đọc như 'ch': men-CHA-ri.",
          "Luyện: `Saya mencari kost dekat tempat kerja.`",
        ],
        pronunciation_focus_en: [
          "SA-ya se-DANG men-CHA-ri kost de-KAT TEM-pat KER-ja -- `kost` = rented room/boarding house; `tempat kerja` = workplace.",
          "VN-speaker trap: reading `mencari` as 'men-ka-ri'. Indonesian `c` sounds like 'ch': men-CHA-ri.",
          "Drill: `Saya mencari kost dekat tempat kerja.`",
        ],
      },
      {
        en: "Kontrakan ini bisa disewa bulanan?",
        vi: "Nhà thuê này có thể thuê theo tháng không?",
        pronunciation_focus: [
          "kon-TRA-kan I-ni BI-sa di-SE-wa bu-LA-nan -- `kontrakan` = nhà thuê; `bulanan` = theo tháng.",
          "`kost` thường là thuê một phòng; `kontrakan` thường là thuê cả căn nhà nhỏ hoặc phần nhà riêng.",
          "Luyện: `Kontrakan ini bisa disewa bulanan?`",
        ],
        pronunciation_focus_en: [
          "kon-TRA-kan I-ni BI-sa di-SE-wa bu-LA-nan -- `kontrakan` = rental house; `bulanan` = monthly.",
          "`kost` usually means renting one room; `kontrakan` usually means renting a small house or separate unit.",
          "Drill: `Kontrakan ini bisa disewa bulanan?`",
        ],
      },
      {
        en: "Uang sewanya berapa per bulan?",
        vi: "Tiền thuê mỗi tháng bao nhiêu?",
        pronunciation_focus: [
          "U-ang SE-wa-nya be-RA-pa per BU-lan -- `uang sewa` = tiền thuê; `berapa` = bao nhiêu.",
          "Lỗi người Việt: hỏi giá bằng `apa`. Hỏi tiền/giá phải dùng `berapa`: `Sewanya berapa?`",
          "Luyện: `Uang sewanya berapa per bulan?`",
        ],
        pronunciation_focus_en: [
          "OO-ang SE-wa-nya be-RA-pa per BU-lan -- `uang sewa` = rent money; `berapa` = how much.",
          "VN-speaker trap: asking a price with `apa`. Money/price questions use `berapa`: `Sewanya berapa?`",
          "Drill: `Uang sewanya berapa per bulan?`",
        ],
      },
      {
        en: "Apakah deposit bisa dikembalikan saat pindah?",
        vi: "Tiền cọc có được trả lại khi dọn đi không?",
        pronunciation_focus: [
          "a-pa-KAH de-PO-sit BI-sa di-kem-BA-li-kan saat PIN-dah -- `deposit` = tiền cọc; `dikembalikan` = được trả lại.",
          "Mẹo: cũng có thể nghe `uang jaminan` cho tiền cọc. Hỏi rõ điều kiện hoàn cọc trước khi trả tiền.",
          "Luyện: `Deposit bisa dikembalikan?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH de-PO-sit BI-sa di-kem-BA-li-kan saat PIN-dah -- `deposit` = deposit; `dikembalikan` = returned/refunded.",
          "Tip: you may also hear `uang jaminan` for deposit. Ask refund conditions before paying.",
          "Drill: `Deposit bisa dikembalikan?`",
        ],
      },
      {
        en: "Listrik dan air sudah termasuk sewa?",
        vi: "Tiền điện và nước đã bao gồm trong tiền thuê chưa?",
        pronunciation_focus: [
          "LIS-trik dan A-ir SU-dah ter-MA-suk SE-wa -- `listrik` = điện; `air` = nước; `termasuk` = bao gồm.",
          "Lỗi người Việt: đọc `air` như tiếng Anh 'e'. Trong Indonesia, `air` đọc gần như A-ir, hai âm rõ.",
          "Luyện: `Listrik dan air sudah termasuk?`",
        ],
        pronunciation_focus_en: [
          "LIS-trik dan A-ir SU-dah ter-MA-suk SE-wa -- `listrik` = electricity; `air` = water; `termasuk` = included.",
          "VN-speaker trap: reading `air` like English 'air'. In Indonesian, say A-ir with two clear vowels.",
          "Drill: `Listrik dan air sudah termasuk?`",
        ],
      },
      {
        en: "Peraturan rumahnya apa saja, Bu?",
        vi: "Nội quy nhà gồm những gì ạ cô?",
        pronunciation_focus: [
          "pe-ra-TU-ran RU-mah-nya A-pa SA-ja, Bu -- `peraturan rumah` = nội quy nhà; `apa saja` = những gì.",
          "Gọi chủ nhà nữ là `Bu` hoặc `Ibu` lịch sự hơn gọi tên trống không.",
          "Luyện: `Peraturan rumahnya apa saja, Bu?`",
        ],
        pronunciation_focus_en: [
          "pe-ra-TU-ran RU-mah-nya A-pa SA-ja, Bu -- `peraturan rumah` = house rules; `apa saja` = what things/which ones.",
          "Addressing a female owner as `Bu` or `Ibu` is more polite than using only her name.",
          "Drill: `Peraturan rumahnya apa saja, Bu?`",
        ],
      },
      {
        en: "Saya harus lapor ke ibu kost kalau ada tamu?",
        vi: "Tôi phải báo với cô chủ nhà trọ nếu có khách không?",
        pronunciation_focus: [
          "SA-ya HA-rus LA-por ke I-bu kost KA-lau A-da TA-mu -- `ibu kost` = cô/chủ nhà trọ; `tamu` = khách.",
          "`harus lapor ke...` = phải báo với...; dùng `ke` cho hướng đến người nhận thông tin.",
          "Luyện: `Saya harus lapor ke ibu kost?`",
        ],
        pronunciation_focus_en: [
          "SA-ya HA-rus LA-por ke I-bu kost KA-lau A-da TA-mu -- `ibu kost` = boarding-house landlady; `tamu` = guest.",
          "`harus lapor ke...` = must report/tell...; use `ke` for direction toward the person receiving the information.",
          "Drill: `Saya harus lapor ke ibu kost?`",
        ],
      },
      {
        en: "Boleh pindah kamar kalau kamar sebelah kosong?",
        vi: "Có được chuyển phòng nếu phòng bên cạnh trống không?",
        pronunciation_focus: [
          "BO-leh PIN-dah KA-mar KA-lau KA-mar se-BE-lah KO-song -- `pindah kamar` = chuyển phòng; `sebelah` = bên cạnh.",
          "Lỗi người Việt: lẫn `boleh` và `bisa`. `Boleh` hỏi xin phép; `bisa` hỏi khả năng/có thể thực hiện.",
          "Luyện: `Boleh pindah kamar?`",
        ],
        pronunciation_focus_en: [
          "BO-leh PIN-dah KA-mar KA-lau KA-mar se-BE-lah KO-song -- `pindah kamar` = move rooms; `sebelah` = next door/beside.",
          "VN-speaker trap: mixing `boleh` and `bisa`. `Boleh` asks permission; `bisa` asks ability/possibility.",
          "Drill: `Boleh pindah kamar?`",
        ],
      },
    ],
    cultural_notes_vi:
      "`Kost` là kiểu thuê phòng rất phổ biến ở Indonesia cho sinh viên, người đi làm, và người mới chuyển thành phố. Chủ nhà thường được gọi là `ibu kost` hoặc `bapak kost`. Một số kost có giờ đóng cổng, quy định khách nam/nữ, cấm nấu ăn trong phòng, hoặc tách tiền điện nước. `Kontrakan` thường riêng tư hơn nhưng phải tự lo nhiều chi phí hơn. Trước khi trả tiền, nên hỏi rõ `uang sewa`, `deposit`, điện, nước, Wi-Fi, nội quy, và điều kiện hoàn cọc.",
    cultural_notes_en:
      "`Kost` is a very common room-rental setup in Indonesia for students, workers, and people new to a city. The owner is often called `ibu kost` or `bapak kost`. Some kosts have gate curfews, guest rules by gender, no cooking inside rooms, or separate utility charges. A `kontrakan` is usually more private but may require handling more costs yourself. Before paying, ask clearly about rent, deposit, electricity, water, Wi-Fi, house rules, and deposit refund conditions.",
    tip_advice_vi:
      "Mẹo cho người Việt: học theo cụm cố định sẽ nhanh hơn học từng từ rời: `sewa per bulan`, `uang deposit`, `sudah termasuk listrik`, `peraturan rumah`, `ibu kost`, `pindah kamar`. Khi hỏi chủ nhà, thêm `Bu/Pak` và dùng câu hỏi mềm như `Apakah... ?` hoặc `Boleh... ?` để lịch sự.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn fixed chunks rather than isolated words: `sewa per bulan`, `uang deposit`, `sudah termasuk listrik`, `peraturan rumah`, `ibu kost`, `pindah kamar`. When asking the owner, add `Bu/Pak` and use soft question frames like `Apakah... ?` or `Boleh... ?` to sound polite.",
    vocabulary: [
      {
        word: "kost",
        en: "rented room / boarding house",
        vi: "phòng trọ / nhà trọ",
        pos: "noun",
        pronunciation_vi: "kost",
        pronunciation_en: "kost",
      },
      {
        word: "kontrakan",
        en: "rental house",
        vi: "nhà thuê",
        pos: "noun",
        pronunciation_vi: "kon-TRA-kan",
        pronunciation_en: "kon-TRA-kan",
      },
      {
        word: "uang sewa",
        en: "rent money",
        vi: "tiền thuê",
        pos: "noun phrase",
        pronunciation_vi: "U-ang SE-wa",
        pronunciation_en: "OO-ang SE-wa",
      },
      {
        word: "deposit",
        en: "deposit",
        vi: "tiền cọc",
        pos: "noun",
        pronunciation_vi: "de-PO-sit",
        pronunciation_en: "de-PO-sit",
      },
      {
        word: "listrik",
        en: "electricity",
        vi: "điện",
        pos: "noun",
        pronunciation_vi: "LIS-trik",
        pronunciation_en: "LIS-trik",
      },
      {
        word: "air",
        en: "water",
        vi: "nước",
        pos: "noun",
        pronunciation_vi: "A-ir",
        pronunciation_en: "A-ir",
      },
      {
        word: "peraturan rumah",
        en: "house rules",
        vi: "nội quy nhà",
        pos: "noun phrase",
        pronunciation_vi: "pe-ra-TU-ran RU-mah",
        pronunciation_en: "pe-ra-TU-ran ROO-mah",
      },
      {
        word: "ibu kost",
        en: "boarding-house landlady",
        vi: "cô/chủ nhà trọ",
        pos: "noun phrase",
        pronunciation_vi: "I-bu kost",
        pronunciation_en: "EE-boo kost",
      },
      {
        word: "pindah kamar",
        en: "move rooms",
        vi: "chuyển phòng",
        pos: "verb phrase",
        pronunciation_vi: "PIN-dah KA-mar",
        pronunciation_en: "PIN-dah KA-mar",
      },
      {
        word: "tamu",
        en: "guest",
        vi: "khách",
        pos: "noun",
        pronunciation_vi: "TA-mu",
        pronunciation_en: "TAH-moo",
      },
    ],
    dialogue: [
      {
        speaker: "Penyewa",
        text: "Permisi, Bu. Masih ada kamar kost yang kosong?",
        vi: "Xin lỗi cô. Còn phòng trọ nào trống không ạ?",
        en: "Excuse me, ma'am. Is there still a vacant kost room?",
      },
      {
        speaker: "Ibu kost",
        text: "Ada. Sewa per bulan satu juta dua ratus ribu.",
        vi: "Có. Tiền thuê mỗi tháng một triệu hai trăm nghìn.",
        en: "Yes. The monthly rent is one million two hundred thousand.",
      },
      {
        speaker: "Penyewa",
        text: "Listrik dan air sudah termasuk?",
        vi: "Điện và nước đã bao gồm chưa ạ?",
        en: "Are electricity and water included?",
      },
      {
        speaker: "Ibu kost",
        text: "Air termasuk, tapi listrik bayar sendiri.",
        vi: "Nước bao gồm, nhưng điện tự trả.",
        en: "Water is included, but electricity is paid separately.",
      },
      {
        speaker: "Penyewa",
        text: "Kalau nanti saya mau pindah kamar, boleh?",
        vi: "Nếu sau này tôi muốn chuyển phòng thì được không ạ?",
        en: "If later I want to move rooms, is that allowed?",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tiền thuê mỗi tháng bao nhiêu?",
        prompt_en: "Translate into Indonesian: How much is the rent per month?",
        answer: "Uang sewanya berapa per bulan?",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Listrik dan air sudah ____ sewa?",
        prompt_en: "Fill in the blank: Listrik dan air sudah ____ sewa?",
        answer: "termasuk",
      },
      {
        type: "matching",
        prompt_vi: "Ghép từ với nghĩa đúng.",
        prompt_en: "Match each word with the correct meaning.",
        pairs: [
          ["kost", "phòng trọ / rented room"],
          ["deposit", "tiền cọc / deposit"],
          ["ibu kost", "cô chủ nhà trọ / landlady"],
          ["pindah kamar", "chuyển phòng / move rooms"],
        ],
      },
    ],
    content:
      "Useful renting chunks: `Masih ada kamar kosong?` (is there a vacant room?), `Sewa per bulan berapa?` (how much is monthly rent?), `Deposit bisa dikembalikan?` (can the deposit be refunded?), `Listrik dan air sudah termasuk?` (are electricity and water included?), and `Boleh pindah kamar?` (may I move rooms?).",
  },
];
