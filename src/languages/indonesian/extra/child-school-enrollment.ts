// Child School Enrollment Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// school/admin notes with English companions in pronunciation_focus_en.

export type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  cell_id?: string;
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
    id: "indonesian_child_school_enrollment",
    level: "A2",
    category: "school_family",
    title_vi: "Đăng ký nhập học cho con",
    title_en: "Child school enrollment",
    sentences: [
      {
        en: "Saya ingin mendaftarkan anak saya ke sekolah ini.",
        vi: "Tôi muốn đăng ký cho con tôi vào trường này.",
        pronunciation_focus: [
          "SA-ya I-ngin men-DAF-tar-kan A-nak SA-ya ke se-KO-lah I-ni - `mendaftarkan anak` = đăng ký cho con; `sekolah ini` = trường này.",
          "Lỗi người Việt: dùng `mendaftar anak` thiếu sắc thái. Khi đăng ký cho người khác, dùng `mendaftarkan anak`.",
          "Luyện: `Saya ingin mendaftarkan anak saya.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin men-DAF-tar-kan A-nak SA-ya ke se-KO-lah I-ni - `mendaftarkan anak` = enroll/register a child; `sekolah ini` = this school.",
          "VN-speaker trap: using `mendaftar anak`. When registering someone else, use `mendaftarkan anak`.",
          "Drill: `Saya ingin mendaftarkan anak saya.`",
        ],
      },
      {
        en: "Di mana saya bisa mengambil formulir pendaftaran?",
        vi: "Tôi có thể lấy mẫu đơn đăng ký ở đâu?",
        pronunciation_focus: [
          "di MA-na SA-ya BI-sa me-NGAM-bil for-mu-LIR pen-DAF-tar-an - `formulir pendaftaran` = mẫu đơn đăng ký; `mengambil` = lấy.",
          "Lỗi người Việt: dịch `form` thành `form` trong văn phòng. Từ Indonesia chuẩn là `formulir`.",
          "Luyện: `Formulir pendaftaran di mana?`",
        ],
        pronunciation_focus_en: [
          "di MA-na SA-ya BI-sa me-NGAM-bil for-moo-LIR pen-DAF-tar-an - `formulir pendaftaran` = registration form; `mengambil` = take/pick up.",
          "VN-speaker trap: using English `form` in an office setting. Standard Indonesian is `formulir`.",
          "Drill: `Formulir pendaftaran di mana?`",
        ],
      },
      {
        en: "Apakah harus membawa akta lahir asli?",
        vi: "Có phải mang bản gốc giấy khai sinh không?",
        pronunciation_focus: [
          "a-pa-KAH HA-rus mem-BA-wa AK-ta LA-hir AS-li - `akta lahir` = giấy khai sinh; `asli` = bản gốc/thật.",
          "Lỗi người Việt: nói `surat lahir` có thể hiểu được nhưng thủ tục thường dùng `akta lahir`.",
          "Luyện: `Saya membawa akta lahir asli.`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH HA-roos mem-BA-wa AK-ta LA-hir AS-li - `akta lahir` = birth certificate; `asli` = original/genuine.",
          "VN-speaker trap: saying `surat lahir` may be understood, but administration usually says `akta lahir`.",
          "Drill: `Saya membawa akta lahir asli.`",
        ],
      },
      {
        en: "Kami juga diminta membawa fotokopi kartu keluarga.",
        vi: "Chúng tôi cũng được yêu cầu mang bản sao sổ hộ khẩu/thẻ gia đình.",
        pronunciation_focus: [
          "KA-mi JU-ga di-MIN-ta mem-BA-wa fo-to-KO-pi KAR-tu ke-LU-ar-ga - `fotokopi` = bản photocopy; `kartu keluarga` = giấy/thẻ hộ gia đình.",
          "Lỗi người Việt: Indonesia dùng `kartu keluarga` hoặc `KK`, không phải dịch sát `buku keluarga`.",
          "Luyện: `Fotokopi kartu keluarga sudah ada.`",
        ],
        pronunciation_focus_en: [
          "KA-mi JOO-ga di-MIN-ta mem-BA-wa fo-to-KO-pi KAR-too ke-LOO-ar-ga - `fotokopi` = photocopy; `kartu keluarga` = family card/household document.",
          "VN-speaker trap: Indonesian uses `kartu keluarga` or `KK`, not literal `buku keluarga`.",
          "Drill: `Fotokopi kartu keluarga sudah ada.`",
        ],
      },
      {
        en: "Kapan batas akhir pendaftaran siswa baru?",
        vi: "Hạn cuối đăng ký học sinh mới là khi nào?",
        pronunciation_focus: [
          "KA-pan BA-tas A-khir pen-DAF-tar-an SIS-wa BA-ru - `batas akhir` = hạn cuối; `siswa baru` = học sinh mới.",
          "Lỗi người Việt: hỏi `deadline kapan` trong thủ tục chính thức. `Batas akhir` nghe rõ và lịch sự hơn.",
          "Luyện: `Batas akhirnya kapan?`",
        ],
        pronunciation_focus_en: [
          "KA-pan BA-tas A-khir pen-DAF-tar-an SIS-wa BA-roo - `batas akhir` = deadline; `siswa baru` = new student.",
          "VN-speaker trap: asking `deadline kapan` in official procedures. `Batas akhir` is clearer and more polite.",
          "Drill: `Batas akhirnya kapan?`",
        ],
      },
      {
        en: "Berapa uang pangkal untuk tahun ajaran ini?",
        vi: "Phí nhập học ban đầu cho năm học này là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa U-ang PANG-kal UN-tuk TA-hun a-JAR-an I-ni - `uang pangkal` = phí nhập học ban đầu; `tahun ajaran` = năm học.",
          "Lỗi người Việt: nhầm `uang pangkal` với học phí tháng. Nó thường là khoản đóng ban đầu khi nhập học.",
          "Luyện: `Berapa uang pangkalnya?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa OO-ang PANG-kal UN-tuk TA-hoon a-JAR-an I-ni - `uang pangkal` = initial enrollment fee; `tahun ajaran` = school year.",
          "VN-speaker trap: confusing `uang pangkal` with monthly tuition. It is often the initial fee at enrollment.",
          "Drill: `Berapa uang pangkalnya?`",
        ],
      },
      {
        en: "Apakah biaya seragam sudah termasuk dalam pembayaran?",
        vi: "Chi phí đồng phục đã bao gồm trong khoản thanh toán chưa?",
        pronunciation_focus: [
          "a-pa-KAH BI-a-ya se-RA-gam SU-dah ter-MA-suk da-LAM pem-ba-YAR-an - `seragam` = đồng phục; `sudah termasuk` = đã bao gồm.",
          "Lỗi người Việt: hỏi giá bằng một từ `berapa` chưa đủ. Với khoản phí, hỏi `sudah termasuk...?` rõ hơn.",
          "Luyện: `Seragam sudah termasuk?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH BEE-a-ya se-RA-gam SOO-dah ter-MA-sook da-LAM pem-ba-YAR-an - `seragam` = uniform; `sudah termasuk` = already included.",
          "VN-speaker trap: asking only `berapa` may be incomplete. For fees, `sudah termasuk...?` is clearer.",
          "Drill: `Seragam sudah termasuk?`",
        ],
      },
      {
        en: "Jadwal orientasi orang tua akan dikirim lewat WhatsApp.",
        vi: "Lịch định hướng cho phụ huynh sẽ được gửi qua WhatsApp.",
        pronunciation_focus: [
          "JAD-wal o-ri-en-TA-si O-rang TU-a A-kan di-KI-rim LE-wat WATS-ap - `jadwal orientasi` = lịch định hướng; `orang tua` = phụ huynh/cha mẹ.",
          "Lỗi người Việt: `orang tua` nghĩa đen là người già, nhưng ở trường học thường là phụ huynh.",
          "Luyện: `Jadwal orientasi dikirim lewat WhatsApp.`",
        ],
        pronunciation_focus_en: [
          "JAD-wal o-ri-en-TA-si O-rang TOO-a A-kan di-KI-rim LE-wat WhatsApp - `jadwal orientasi` = orientation schedule; `orang tua` = parents/guardians.",
          "VN-speaker trap: `orang tua` literally means old person, but in school contexts it usually means parents.",
          "Drill: `Jadwal orientasi dikirim lewat WhatsApp.`",
        ],
      },
      {
        en: "Anak saya akan masuk kelas satu SD.",
        vi: "Con tôi sẽ vào lớp một tiểu học.",
        pronunciation_focus: [
          "A-nak SA-ya A-kan MA-suk KE-las SA-tu ES-DE - `kelas satu` = lớp một; `SD` = trường tiểu học.",
          "Lỗi người Việt: dịch tiểu học là `sekolah kecil`. Từ chuẩn là `SD` hoặc `sekolah dasar`.",
          "Luyện: `Masuk kelas satu SD.`",
        ],
        pronunciation_focus_en: [
          "A-nak SA-ya A-kan MA-sook KE-las SA-too ES-DE - `kelas satu` = first grade; `SD` = elementary school.",
          "VN-speaker trap: translating elementary school as `sekolah kecil`. Standard terms are `SD` or `sekolah dasar`.",
          "Drill: `Masuk kelas satu SD.`",
        ],
      },
      {
        en: "Apakah ada tes masuk atau wawancara singkat?",
        vi: "Có bài kiểm tra đầu vào hoặc phỏng vấn ngắn không?",
        pronunciation_focus: [
          "a-pa-KAH A-da TES MA-suk A-tau wa-WAN-ca-ra SING-kat - `tes masuk` = kiểm tra đầu vào; `wawancara singkat` = phỏng vấn ngắn.",
          "Lỗi người Việt: dùng `interview` trong thủ tục trường học. `Wawancara` là từ Indonesia phù hợp hơn.",
          "Luyện: `Ada tes masuk?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH A-da TES MA-sook A-tau wa-WAN-cha-ra SING-kat - `tes masuk` = entrance test; `wawancara singkat` = short interview.",
          "VN-speaker trap: using English `interview` in school admin. `Wawancara` is the appropriate Indonesian word.",
          "Drill: `Ada tes masuk?`",
        ],
      },
      {
        en: "Tolong beri tahu kami kalau ada dokumen yang kurang.",
        vi: "Làm ơn báo cho chúng tôi nếu còn thiếu giấy tờ.",
        pronunciation_focus: [
          "TO-long be-RI TA-hu KA-mi KA-lau A-da do-ku-MEN yang KU-rang - `dokumen yang kurang` = giấy tờ còn thiếu.",
          "Lỗi người Việt: nói `dokumen kurang` được hiểu nhưng thiếu tự nhiên. Dùng `dokumen yang kurang` rõ hơn.",
          "Luyện: `Kalau ada dokumen yang kurang, beri tahu kami.`",
        ],
        pronunciation_focus_en: [
          "TO-long be-REE TA-hoo KA-mi KA-lau A-da do-koo-MEN yang KOO-rang - `dokumen yang kurang` = missing documents.",
          "VN-speaker trap: `dokumen kurang` is understandable but less natural. `Dokumen yang kurang` is clearer.",
          "Drill: `Kalau ada dokumen yang kurang, beri tahu kami.`",
        ],
      },
      {
        en: "Kami ingin memastikan semua persyaratan sudah lengkap.",
        vi: "Chúng tôi muốn chắc chắn rằng mọi yêu cầu/hồ sơ đã đầy đủ.",
        pronunciation_focus: [
          "KA-mi I-ngin me-mas-TI-kan se-MU-a per-sya-RA-tan SU-dah LENG-kap - `persyaratan` = yêu cầu/hồ sơ điều kiện; `lengkap` = đầy đủ.",
          "Lỗi người Việt: `syarat` là từng điều kiện; `persyaratan` là toàn bộ bộ yêu cầu.",
          "Luyện: `Persyaratan sudah lengkap.`",
        ],
        pronunciation_focus_en: [
          "KA-mi EE-ngin me-mas-TEE-kan se-MOO-a per-sya-RA-tan SOO-dah LENG-kap - `persyaratan` = requirements; `lengkap` = complete.",
          "VN-speaker trap: `syarat` is an individual requirement; `persyaratan` refers to the full set of requirements.",
          "Drill: `Persyaratan sudah lengkap.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi daftar sekolah ở Indonesia, phụ huynh thường chuẩn bị `formulir pendaftaran`, `akta lahir`, `kartu keluarga`, pas foto, dan dokumen pembayaran. Một số trường có `uang pangkal`, biaya seragam, jadwal orientasi, tes masuk, hoặc wawancara singkat. Giao tiếp với văn phòng trường thường dùng giọng lịch sự: `Saya ingin mendaftarkan...`, `Apakah harus membawa...?`, `Tolong beri tahu kami...`.",
    cultural_notes_en:
      "When enrolling a child in an Indonesian school, parents commonly prepare a `formulir pendaftaran`, `akta lahir`, `kartu keluarga`, passport photos, and payment documents. Some schools have an initial `uang pangkal`, uniform fees, orientation schedules, entrance tests, or short interviews. Communication with the school office usually uses polite wording: `Saya ingin mendaftarkan...`, `Apakah harus membawa...?`, `Tolong beri tahu kami...`.",
    tip_advice_vi:
      "Mẹo cho người Việt: trong thủ tục hành chính, đừng chỉ hỏi `apa dokumen?`. Hãy dùng bộ câu an toàn: `Apa saja persyaratannya?`, `Apakah harus membawa yang asli?`, `Kapan batas akhir pendaftaran?`, và `Kalau ada dokumen yang kurang, tolong beri tahu kami.` Nhớ phân biệt `akta lahir` (giấy khai sinh), `kartu keluarga/KK` (giấy hộ gia đình), `seragam` (đồng phục), và `uang pangkal` (phí ban đầu).",
    tip_advice_en:
      "Tip for Vietnamese speakers: in administrative settings, do not only ask `apa dokumen?`. Use the safe question set: `Apa saja persyaratannya?`, `Apakah harus membawa yang asli?`, `Kapan batas akhir pendaftaran?`, and `Kalau ada dokumen yang kurang, tolong beri tahu kami.` Keep the terms separate: `akta lahir` (birth certificate), `kartu keluarga/KK` (family card), `seragam` (uniform), and `uang pangkal` (initial enrollment fee).",
    vocabulary: [
      { cell_id: "1144152b-4bbd-4f31-b0d0-69fb07fe0af1", word: "daftar sekolah", en: "school enrollment", vi: "đăng ký nhập học", pos: "verb/noun phrase", pronunciation_vi: "DAF-tar se-KO-lah", pronunciation_en: "DAF-tar se-KO-lah" },
      { cell_id: "08efb7ba-d0b8-45ad-97e1-f434f416a680", word: "formulir pendaftaran", en: "registration form", vi: "mẫu đơn đăng ký", pos: "noun phrase", pronunciation_vi: "for-mu-LIR pen-DAF-tar-an", pronunciation_en: "for-moo-LIR pen-DAF-tar-an" },
      { cell_id: "bd5477b3-be93-46bf-91d5-0c43b1c79f22", word: "akta lahir", en: "birth certificate", vi: "giấy khai sinh", pos: "noun phrase", pronunciation_vi: "AK-ta LA-hir", pronunciation_en: "AK-ta LA-hir" },
      { cell_id: "5515080e-6ec5-4b63-8bd7-a8223acb04ad", word: "kartu keluarga", en: "family card", vi: "giấy/thẻ hộ gia đình", pos: "noun phrase", pronunciation_vi: "KAR-tu ke-LU-ar-ga", pronunciation_en: "KAR-too ke-LOO-ar-ga" },
      { cell_id: "495c4b9e-09ad-4363-9a8a-bae82c99c1b6", word: "seragam", en: "uniform", vi: "đồng phục", pos: "noun", pronunciation_vi: "se-RA-gam", pronunciation_en: "se-RA-gam" },
      { cell_id: "329fc9e2-4da4-4b03-92c3-22d7a9aa4657", word: "uang pangkal", en: "initial enrollment fee", vi: "phí nhập học ban đầu", pos: "noun phrase", pronunciation_vi: "U-ang PANG-kal", pronunciation_en: "OO-ang PANG-kal" },
      { cell_id: "63f6ec29-a981-4602-b624-c8237b5355fd", word: "jadwal orientasi", en: "orientation schedule", vi: "lịch định hướng", pos: "noun phrase", pronunciation_vi: "JAD-wal o-ri-en-TA-si", pronunciation_en: "JAD-wal o-ri-en-TA-si" },
      { cell_id: "607e4688-699a-492e-949f-b5bc658ace76", word: "persyaratan", en: "requirements", vi: "các yêu cầu/hồ sơ", pos: "noun", pronunciation_vi: "per-sya-RA-tan", pronunciation_en: "per-sya-RA-tan" },
    ],
    dialogue: [
      {
        cell_id: "585e69d1-8522-4685-88ec-ebbff68796c8",
        speaker: "Ibu Maya",
        text: "Selamat pagi, saya ingin mendaftarkan anak saya ke kelas satu SD.",
        vi: "Chào buổi sáng, tôi muốn đăng ký cho con tôi vào lớp một tiểu học.",
        en: "Good morning, I would like to enroll my child in first grade.",
      },
      {
        cell_id: "b0d9eaf5-826d-4921-9ee2-1a6961d42c3b",
        speaker: "Petugas",
        text: "Baik, Ibu. Silakan isi formulir pendaftaran ini.",
        vi: "Vâng, thưa chị. Xin vui lòng điền mẫu đơn đăng ký này.",
        en: "All right, ma'am. Please fill out this registration form.",
      },
      {
        cell_id: "38e6df41-d80a-4130-860d-c3391b0da49c",
        speaker: "Ibu Maya",
        text: "Apakah harus membawa akta lahir asli dan fotokopi kartu keluarga?",
        vi: "Có phải mang bản gốc giấy khai sinh và bản sao thẻ gia đình không?",
        en: "Do I need to bring the original birth certificate and a copy of the family card?",
      },
      {
        cell_id: "468fa0e5-f5a4-42aa-9258-ca282e24f172",
        speaker: "Petugas",
        text: "Betul. Biaya seragam dan uang pangkal bisa dibayar setelah dokumen lengkap.",
        vi: "Đúng vậy. Chi phí đồng phục và phí ban đầu có thể đóng sau khi hồ sơ đầy đủ.",
        en: "Correct. The uniform fee and initial enrollment fee can be paid after the documents are complete.",
      },
      {
        cell_id: "32cd3a07-9337-4ca5-8eb2-44db247114c8",
        speaker: "Ibu Maya",
        text: "Terima kasih. Tolong beri tahu kami kalau ada dokumen yang kurang.",
        vi: "Cảm ơn. Làm ơn báo cho chúng tôi nếu còn thiếu giấy tờ.",
        en: "Thank you. Please let us know if any documents are missing.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối thuật ngữ với nghĩa tiếng Việt.",
        instruction_en: "Match the Indonesian term with its Vietnamese meaning.",
        items: [
          { prompt: "akta lahir", answer: "giấy khai sinh" },
          { prompt: "kartu keluarga", answer: "giấy/thẻ hộ gia đình" },
          { prompt: "seragam", answer: "đồng phục" },
          { prompt: "uang pangkal", answer: "phí nhập học ban đầu" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm phù hợp vào câu.",
        instruction_en: "Fill in the suitable phrase.",
        items: [
          { prompt: "Saya ingin ___ anak saya ke sekolah ini.", answer: "mendaftarkan" },
          { prompt: "Di mana saya bisa mengambil ___?", answer: "formulir pendaftaran" },
          { prompt: "Kapan ___ pendaftaran siswa baru?", answer: "batas akhir" },
          { prompt: "Kami ingin memastikan semua persyaratan sudah ___.", answer: "lengkap" },
        ],
      },
    ],
  },
];

export default lessons;
