// Tax office & NPWP Indonesian (Vietnamese -> Indonesian study track).
//
// A1 Wave 13 file. Covers NPWP, pajak, kantor pajak, lapor SPT, penghasilan,
// bukti potong, denda, and konsultasi pajak. Self-contained so no registry or
// sibling agent files are touched.
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
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
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
  /** Part of speech, e.g. "noun", "verb", "phrase". */
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

export const taxOfficeNpwpLessons: IndonesianLesson[] = [
  {
    id: "indonesian_tax_office_npwp",
    level: "B1",
    category: "bureaucracy",
    title_vi: "NPWP và làm việc với kantor pajak",
    title_en: "NPWP and dealing with the tax office",
    sentences: [
      {
        en: "Saya mau membuat NPWP di kantor pajak.",
        vi: "Tôi muốn làm mã số thuế NPWP ở cơ quan thuế.",
        pronunciation_focus: [
          "SA-ya mau mem-BU-at en-pe-we-PE di kan-TOR PA-jak - `NPWP` = mã số thuế; `kantor pajak` = cơ quan thuế.",
          "`membuat` trang trọng hơn `bikin`; hợp với thủ tục hành chính.",
          "Lỗi người Việt: đọc NPWP theo chữ cái tiếng Anh. Trong Indonesia đọc tên chữ cái: en-pe-we-pe.",
        ],
        pronunciation_focus_en: [
          "SA-ya mau mem-BOO-at en-pe-we-PE di kan-TOR PA-jak - `NPWP` = taxpayer number; `kantor pajak` = tax office.",
          "`membuat` is more formal than `bikin`; it fits administrative paperwork.",
          "VN-speaker trap: spelling NPWP with English letter names. In Indonesian, say en-pe-we-pe.",
        ],
      },
      {
        en: "Dokumen apa saja yang diperlukan untuk daftar NPWP?",
        vi: "Cần những giấy tờ gì để đăng ký NPWP?",
        pronunciation_focus: [
          "do-ku-MEN A-pa SA-ja yang di-per-LU-kan UN-tuk DAF-tar en-pe-we-PE - `apa saja` hỏi danh sách đầy đủ.",
          "`diperlukan` = được yêu cầu/cần; bị động `di-` rất phổ biến trong văn phòng.",
          "Lỗi người Việt: hỏi `dokumen apa` nghe như chỉ một thứ. Thêm `saja` để hỏi cả danh sách.",
        ],
        pronunciation_focus_en: [
          "do-koo-MEN A-pa SA-ja yang dee-per-LOO-kan OON-tuk DAF-tar en-pe-we-PE - `apa saja` asks for the full list.",
          "`diperlukan` = required/needed; passive `di-` is common in offices.",
          "VN-speaker trap: asking `dokumen apa`, which can sound like one item. Add `saja` for the whole list.",
        ],
      },
      {
        en: "Nomor NPWP saya sudah terdaftar.",
        vi: "Số NPWP của tôi đã được đăng ký.",
        pronunciation_focus: [
          "NO-mor en-pe-we-PE SA-ya SU-dah ter-DAF-tar - `terdaftar` = đã ở trạng thái đăng ký.",
          "`ter-` ở đây nhấn vào trạng thái kết quả, khác `mendaftar` là hành động đăng ký.",
          "Lỗi người Việt: nói `sudah daftar` cho mọi trường hợp. Khi số đã có trong hệ thống, nói `sudah terdaftar`.",
        ],
        pronunciation_focus_en: [
          "NO-mor en-pe-we-PE SA-ya SOO-dah ter-DAF-tar - `terdaftar` = registered/listed.",
          "`ter-` here marks the resulting state, different from `mendaftar` as the action of registering.",
          "VN-speaker trap: using `sudah daftar` for everything. When the number is already in the system, say `sudah terdaftar`.",
        ],
      },
      {
        en: "Saya ingin konsultasi pajak dengan petugas.",
        vi: "Tôi muốn tư vấn thuế với nhân viên.",
        pronunciation_focus: [
          "SA-ya I-ngin kon-sul-TA-si PA-jak de-NGAN pe-TU-gas - `konsultasi pajak` = tư vấn thuế.",
          "`petugas` = nhân viên/cán bộ phụ trách ở quầy.",
          "Lỗi người Việt: dùng `mau tanya pajak` ở mọi nơi. Hiểu được, nhưng `ingin konsultasi pajak` lịch sự hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin kon-sool-TA-see PA-jak de-NGAN pe-TOO-gas - `konsultasi pajak` = tax consultation.",
          "`petugas` = staff/officer at a service counter.",
          "VN-speaker trap: saying `mau tanya pajak` everywhere. Understandable, but `ingin konsultasi pajak` is more polite.",
        ],
      },
      {
        en: "Penghasilan saya berubah tahun ini.",
        vi: "Thu nhập của tôi thay đổi trong năm nay.",
        pronunciation_focus: [
          "peng-HA-sil-an SA-ya ber-U-bah TA-hun I-ni - `penghasilan` = thu nhập; `berubah` = thay đổi.",
          "`penghasilan` khác `gaji`: gaji là lương, penghasilan là toàn bộ thu nhập.",
          "Lỗi người Việt: dùng `gaji` cho mọi loại tiền kiếm được. Khai thuế nên dùng `penghasilan`.",
        ],
        pronunciation_focus_en: [
          "peng-HA-seel-an SA-ya ber-OO-bah TA-hoon EE-nee - `penghasilan` = income; `berubah` = changed.",
          "`penghasilan` differs from `gaji`: salary is `gaji`, total income is `penghasilan`.",
          "VN-speaker trap: using `gaji` for all earned money. For tax reporting, use `penghasilan`.",
        ],
      },
    ],
    cultural_notes_vi:
      "NPWP là mã số thuế cá nhân hoặc doanh nghiệp ở Indonesia. Khi đến kantor pajak, bạn thường cần nomor antrean, dokumen identitas, thông tin alamat, và đôi khi email/nomor HP để đăng ký dịch vụ online. Cách nói ở cơ quan thuế nên lịch sự, rõ dữ kiện: bạn muốn membuat NPWP, mengecek status NPWP, hoặc konsultasi pajak.",
    cultural_notes_en:
      "NPWP is the Indonesian tax identification number for individuals or businesses. At the tax office, you often need a queue number, identity documents, address information, and sometimes email/phone details for online services. At the tax office, speak politely and factually: you want to make an NPWP, check NPWP status, or ask for tax consultation.",
    tip_advice_vi:
      "Bộ câu sống còn: `Saya mau membuat NPWP`, `Dokumen apa saja yang diperlukan?`, `Nomor NPWP saya sudah terdaftar`, `Saya ingin konsultasi pajak`. Bẫy lớn là acronyms: NPWP đọc en-pe-we-pe, SPT đọc es-pe-te.",
    tip_advice_en:
      "Survival set: `Saya mau membuat NPWP`, `Dokumen apa saja yang diperlukan?`, `Nomor NPWP saya sudah terdaftar`, `Saya ingin konsultasi pajak`. The big trap is acronyms: NPWP is en-pe-we-pe, SPT is es-pe-te.",
    vocabulary: [
      { word: "NPWP", en: "taxpayer number", vi: "mã số thuế", pos: "noun", pronunciation_vi: "en-pe-we-PE", pronunciation_en: "en-pe-we-PE" },
      { word: "pajak", en: "tax", vi: "thuế", pos: "noun", pronunciation_vi: "PA-jak", pronunciation_en: "PA-jak" },
      { word: "kantor pajak", en: "tax office", vi: "cơ quan thuế", pos: "noun phrase", pronunciation_vi: "kan-TOR PA-jak", pronunciation_en: "kan-TOR PA-jak" },
      { word: "terdaftar", en: "registered", vi: "đã đăng ký", pos: "adjective/passive state", pronunciation_vi: "ter-DAF-tar", pronunciation_en: "ter-DAF-tar" },
      { word: "konsultasi pajak", en: "tax consultation", vi: "tư vấn thuế", pos: "noun phrase", pronunciation_vi: "kon-sul-TA-si PA-jak", pronunciation_en: "kon-sool-TA-see PA-jak" },
      { word: "penghasilan", en: "income", vi: "thu nhập", pos: "noun", pronunciation_vi: "peng-HA-sil-an", pronunciation_en: "peng-HA-seel-an" },
    ],
    dialogue: [
      { speaker: "Wajib pajak", text: "Selamat pagi. Saya mau membuat NPWP di kantor pajak.", vi: "Chào buổi sáng. Tôi muốn làm NPWP ở cơ quan thuế.", en: "Good morning. I want to make an NPWP at the tax office." },
      { speaker: "Petugas", text: "Silakan ambil nomor antrean dulu. Dokumennya sudah lengkap?", vi: "Vui lòng lấy số thứ tự trước. Giấy tờ đã đầy đủ chưa?", en: "Please take a queue number first. Are the documents complete?" },
      { speaker: "Wajib pajak", text: "Belum yakin. Saya ingin konsultasi pajak dengan petugas.", vi: "Tôi chưa chắc. Tôi muốn tư vấn thuế với nhân viên.", en: "I am not sure yet. I want a tax consultation with an officer." },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "NPWP", answer: "mã số thuế" },
          { prompt: "kantor pajak", answer: "cơ quan thuế" },
          { prompt: "penghasilan", answer: "thu nhập" },
          { prompt: "konsultasi pajak", answer: "tư vấn thuế" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi muốn làm NPWP.", answer: "Saya mau membuat NPWP." },
          { prompt: "Thu nhập của tôi thay đổi năm nay.", answer: "Penghasilan saya berubah tahun ini." },
        ],
      },
    ],
  },
  {
    id: "indonesian_spt_bukti_potong",
    level: "B1",
    category: "bureaucracy",
    title_vi: "Khai SPT và bukti potong",
    title_en: "Filing SPT and withholding slips",
    sentences: [
      {
        en: "Saya harus lapor SPT setiap tahun.",
        vi: "Tôi phải khai SPT mỗi năm.",
        pronunciation_focus: [
          "SA-ya HA-rus LA-por es-pe-TE se-TI-ap TA-hun - `lapor SPT` = khai/nộp tờ khai thuế.",
          "`setiap tahun` = mỗi năm; động từ không chia theo thời.",
          "Lỗi người Việt: đọc SPT kiểu tiếng Anh. Trong Indonesia đọc es-pe-te.",
        ],
        pronunciation_focus_en: [
          "SA-ya HA-roos LA-por es-pe-TE se-TEE-ap TA-hoon - `lapor SPT` = file a tax return.",
          "`setiap tahun` = every year; the verb does not conjugate.",
          "VN-speaker trap: spelling SPT English-style. In Indonesian, say es-pe-te.",
        ],
      },
      {
        en: "Saya belum menerima bukti potong dari kantor.",
        vi: "Tôi chưa nhận được chứng từ khấu trừ từ công ty/văn phòng.",
        pronunciation_focus: [
          "SA-ya be-LUM me-ne-RI-ma BUK-ti PO-tong da-RI KAN-tor - `bukti potong` = chứng từ khấu trừ thuế.",
          "`belum menerima` = chưa nhận; dùng `belum` khi vẫn còn chờ.",
          "Lỗi người Việt: nói `tidak menerima` khi ý là chưa nhận. Nếu còn chờ, dùng `belum menerima`.",
        ],
        pronunciation_focus_en: [
          "SA-ya be-LOOM me-ne-REE-ma BOOK-tee PO-tong da-REE KAN-tor - `bukti potong` = tax withholding slip.",
          "`belum menerima` = have not received yet; use `belum` when you are still waiting.",
          "VN-speaker trap: saying `tidak menerima` when you mean not yet received. If still waiting, use `belum menerima`.",
        ],
      },
      {
        en: "Bukti potong diperlukan untuk lapor pajak.",
        vi: "Chứng từ khấu trừ cần thiết để khai thuế.",
        pronunciation_focus: [
          "BUK-ti PO-tong di-per-LU-kan UN-tuk LA-por PA-jak - `diperlukan` = được yêu cầu/cần.",
          "Bị động `di-` rất phổ biến trong văn bản thuế: `diperlukan`, `dilaporkan`, `dipotong`.",
          "Lỗi người Việt: né bị động và nói `perlu bukti potong`. Câu chuẩn văn phòng: `bukti potong diperlukan`.",
        ],
        pronunciation_focus_en: [
          "BOOK-tee PO-tong dee-per-LOO-kan OON-tuk LA-por PA-jak - `diperlukan` = required/needed.",
          "Passive `di-` is common in tax writing: `diperlukan`, `dilaporkan`, `dipotong`.",
          "VN-speaker trap: avoiding passive with `perlu bukti potong`. Office-style: `bukti potong diperlukan`.",
        ],
      },
      {
        en: "Apakah pajak penghasilan saya sudah dipotong?",
        vi: "Thuế thu nhập của tôi đã được khấu trừ chưa?",
        pronunciation_focus: [
          "A-pa-kah PA-jak peng-HA-sil-an SA-ya SU-dah di-PO-tong - `dipotong` = bị/được khấu trừ.",
          "`pajak penghasilan` = thuế thu nhập; thường viết tắt PPh.",
          "Lỗi người Việt: nói `saya potong pajak`. Nếu bị trừ từ lương, dùng bị động: `pajak ... dipotong`.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah PA-jak peng-HA-seel-an SA-ya SOO-dah dee-PO-tong - `dipotong` = deducted/withheld.",
          "`pajak penghasilan` = income tax; often abbreviated PPh.",
          "VN-speaker trap: saying `saya potong pajak`. If it is deducted from salary, use passive: `pajak ... dipotong`.",
        ],
      },
      {
        en: "Saya butuh bantuan untuk mengisi SPT online.",
        vi: "Tôi cần hỗ trợ để điền SPT online.",
        pronunciation_focus: [
          "SA-ya BU-tuh ban-TU-an UN-tuk me-NGI-si es-pe-TE ON-line - `mengisi SPT` = điền tờ khai SPT.",
          "`bantuan` = sự hỗ trợ; lịch sự hơn nói `tolong ajari` trong văn phòng.",
          "Lỗi người Việt: nói `tulis SPT`. Với mẫu đơn/tờ khai, dùng `mengisi`.",
        ],
        pronunciation_focus_en: [
          "SA-ya BOO-tooh ban-TOO-an OON-tuk me-NGEE-see es-pe-TE ON-line - `mengisi SPT` = fill in the SPT form.",
          "`bantuan` = assistance; more office-appropriate than `tolong ajari`.",
          "VN-speaker trap: saying `tulis SPT`. For forms/returns, use `mengisi`.",
        ],
      },
    ],
    cultural_notes_vi:
      "SPT là tờ khai thuế hằng năm. Người lao động thường cần `bukti potong` từ công ty để lapor SPT. Nếu có nhiều nguồn penghasilan, công việc freelance, hoặc thay đổi status, nên hỏi kantor pajak hoặc konsultan pajak. Bài này dạy ngôn ngữ thực tế để hỏi và khai báo; không thay thế tư vấn thuế chuyên nghiệp.",
    cultural_notes_en:
      "SPT is the annual tax return. Employees often need `bukti potong` from the employer to file SPT. If you have multiple income sources, freelance work, or changed status, ask the tax office or a tax consultant. This lesson teaches practical language for asking and filing; it is not professional tax advice.",
    tip_advice_vi:
      "Phân biệt `lapor` và `mengisi`: `lapor SPT` là nộp/khai báo SPT; `mengisi SPT` là điền nội dung form. Với chứng từ khấu trừ, học nguyên cụm `bukti potong`; đừng dịch từng chữ thành `bukti dipotong`.",
    tip_advice_en:
      "Distinguish `lapor` and `mengisi`: `lapor SPT` means file/report the SPT; `mengisi SPT` means fill in the form. For withholding slips, learn the fixed phrase `bukti potong`; do not translate it word by word as `bukti dipotong`.",
    vocabulary: [
      { word: "lapor SPT", en: "file a tax return", vi: "khai/nộp SPT", pos: "verb phrase", pronunciation_vi: "LA-por es-pe-TE", pronunciation_en: "LA-por es-pe-TE" },
      { word: "bukti potong", en: "withholding slip", vi: "chứng từ khấu trừ", pos: "noun phrase", pronunciation_vi: "BUK-ti PO-tong", pronunciation_en: "BOOK-tee PO-tong" },
      { word: "pajak penghasilan", en: "income tax", vi: "thuế thu nhập", pos: "noun phrase", pronunciation_vi: "PA-jak peng-HA-sil-an", pronunciation_en: "PA-jak peng-HA-seel-an" },
      { word: "dipotong", en: "deducted/withheld", vi: "bị khấu trừ", pos: "passive verb", pronunciation_vi: "di-PO-tong", pronunciation_en: "dee-PO-tong" },
      { word: "mengisi", en: "fill in", vi: "điền", pos: "verb", pronunciation_vi: "me-NGI-si", pronunciation_en: "me-NGEE-see" },
      { word: "bantuan", en: "assistance", vi: "sự hỗ trợ", pos: "noun", pronunciation_vi: "ban-TU-an", pronunciation_en: "ban-TOO-an" },
    ],
    dialogue: [
      { speaker: "Wajib pajak", text: "Saya harus lapor SPT, tapi belum menerima bukti potong.", vi: "Tôi phải khai SPT, nhưng chưa nhận chứng từ khấu trừ.", en: "I have to file SPT, but I have not received the withholding slip yet." },
      { speaker: "Petugas", text: "Bukti potong biasanya diberikan oleh kantor atau pemberi kerja.", vi: "Chứng từ khấu trừ thường được công ty hoặc người sử dụng lao động cung cấp.", en: "The withholding slip is usually provided by the office or employer." },
      { speaker: "Wajib pajak", text: "Baik. Saya juga butuh bantuan untuk mengisi SPT online.", vi: "Vâng. Tôi cũng cần hỗ trợ để điền SPT online.", en: "Okay. I also need help filling in the online SPT." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng.",
        instruction_en: "Fill in the correct word.",
        items: [
          { prompt: "Saya harus ___ SPT setiap tahun.", answer: "lapor" },
          { prompt: "Saya belum menerima bukti ___ dari kantor.", answer: "potong" },
          { prompt: "Pajak penghasilan saya sudah ___.", answer: "dipotong" },
        ],
      },
      {
        type: "rewrite",
        instruction_vi: "Sửa câu Việt hóa sang câu tự nhiên hơn.",
        instruction_en: "Rewrite the Vietnamese-style sentence into natural Indonesian.",
        items: [
          { prompt: "Saya tulis SPT online.", answer: "Saya mengisi SPT online." },
          { prompt: "Saya tidak menerima bukti potong.", answer: "Saya belum menerima bukti potong." },
        ],
      },
    ],
  },
  {
    id: "indonesian_tax_penalty_consultation",
    level: "B1",
    category: "bureaucracy",
    title_vi: "Denda và tư vấn thuế",
    title_en: "Penalties and tax consultation",
    sentences: [
      {
        en: "Saya terlambat lapor SPT, apakah ada denda?",
        vi: "Tôi nộp SPT trễ, có bị phạt không?",
        pronunciation_focus: [
          "SA-ya ter-LAM-bat LA-por es-pe-TE, A-pa-kah A-da DEN-da - `denda` = tiền phạt.",
          "`terlambat` = trễ/muộn; dùng cho nộp hồ sơ quá hạn.",
          "Lỗi người Việt: nói `kena fine`. Trong văn phòng, dùng từ Indonesia `denda`.",
        ],
        pronunciation_focus_en: [
          "SA-ya ter-LAM-bat LA-por es-pe-TE, A-pa-kah A-da DEN-da - `denda` = fine/penalty.",
          "`terlambat` = late; used for late submissions.",
          "VN-speaker trap: saying `kena fine`. At offices, use Indonesian `denda`.",
        ],
      },
      {
        en: "Bagaimana cara membayar denda pajak?",
        vi: "Cách trả tiền phạt thuế như thế nào?",
        pronunciation_focus: [
          "ba-gai-MA-na CA-ra mem-BA-yar DEN-da PA-jak - `bagaimana cara` = cách ... như thế nào.",
          "`membayar` là dạng trang trọng của `bayar`; hợp trong thủ tục.",
          "Lỗi người Việt: hỏi `bayar denda bagaimana?` được, nhưng `bagaimana cara membayar...` rõ và lịch sự hơn.",
        ],
        pronunciation_focus_en: [
          "ba-gai-MA-na CHA-ra mem-BA-yar DEN-da PA-jak - `bagaimana cara` = what is the way/how to.",
          "`membayar` is the formal form of `bayar`; suitable for procedures.",
          "VN-speaker trap: `bayar denda bagaimana?` works, but `bagaimana cara membayar...` is clearer and more polite.",
        ],
      },
      {
        en: "Saya mau membuat janji untuk konsultasi pajak.",
        vi: "Tôi muốn đặt lịch để tư vấn thuế.",
        pronunciation_focus: [
          "SA-ya mau mem-BU-at JAN-ji UN-tuk kon-sul-TA-si PA-jak - `membuat janji` = đặt lịch hẹn.",
          "`untuk konsultasi pajak` = để tư vấn thuế; dùng khi hẹn gặp petugas/konsultan.",
          "Lỗi người Việt: dịch 'hẹn lịch' thành `pesan jadwal`. Với người/nhân viên, dùng `membuat janji`.",
        ],
        pronunciation_focus_en: [
          "SA-ya mau mem-BOO-at JAN-jee OON-tuk kon-sool-TA-see PA-jak - `membuat janji` = make an appointment.",
          "`untuk konsultasi pajak` = for tax consultation; used when meeting an officer/consultant.",
          "VN-speaker trap: translating 'book a schedule' as `pesan jadwal`. With a person/staff member, use `membuat janji`.",
        ],
      },
      {
        en: "Apakah konsultasi ini gratis atau berbayar?",
        vi: "Buổi tư vấn này miễn phí hay có tính phí?",
        pronunciation_focus: [
          "A-pa-kah kon-sul-TA-si I-ni GRA-tis A-tau ber-BA-yar - `gratis` = miễn phí; `berbayar` = có tính phí.",
          "`atau` = hoặc; dùng để đưa hai lựa chọn.",
          "Lỗi người Việt: nói `bayar atau tidak`. Tự nhiên hơn: `gratis atau berbayar?`",
        ],
        pronunciation_focus_en: [
          "A-pa-kah kon-sool-TA-see EE-nee GRA-tis A-tau ber-BA-yar - `gratis` = free; `berbayar` = paid/fee-based.",
          "`atau` = or; used between two choices.",
          "VN-speaker trap: saying `bayar atau tidak`. More natural: `gratis atau berbayar?`",
        ],
      },
      {
        en: "Mohon jelaskan langkah-langkahnya dengan pelan.",
        vi: "Vui lòng giải thích các bước chậm thôi.",
        pronunciation_focus: [
          "MO-hon je-LAS-kan LANG-kah LANG-kah-nya de-NGAN PE-lan - `langkah-langkah` = các bước.",
          "Lặp từ tạo số nhiều: `langkah` = bước, `langkah-langkah` = các bước.",
          "Lỗi người Việt: bỏ `-kan` trong `jelaskan`. Khi yêu cầu ai giải thích, dùng `jelaskan`.",
        ],
        pronunciation_focus_en: [
          "MO-hon je-LAS-kan LANG-kah LANG-kah-nya de-NGAN PE-lan - `langkah-langkah` = steps.",
          "Reduplication marks plurality: `langkah` = step, `langkah-langkah` = steps.",
          "VN-speaker trap: dropping `-kan` in `jelaskan`. When asking someone to explain, use `jelaskan`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Nếu terlambat lapor SPT hoặc có masalah data, cách tốt nhất là hỏi kantor pajak hoặc konsultan pajak với dữ kiện cụ thể: NPWP, tahun pajak, jenis SPT, bukti potong, và pesan lỗi nếu nộp online. `Denda` là từ quan trọng, nhưng đừng tự đoán mức phạt trong giao tiếp; hãy hỏi `apakah ada denda` và `bagaimana cara membayar denda`.",
    cultural_notes_en:
      "If you file SPT late or have data issues, the best route is to ask the tax office or a tax consultant with concrete details: NPWP, tax year, SPT type, withholding slip, and error message if filing online. `Denda` is an important word, but do not guess the penalty in conversation; ask `apakah ada denda` and `bagaimana cara membayar denda`.",
    tip_advice_vi:
      "Cụm lịch sự ở kantor pajak: `mohon jelaskan`, `saya mau membuat janji`, `apakah konsultasi ini gratis atau berbayar?` Khi chưa hiểu quy trình, yêu cầu `langkah-langkahnya` sẽ rõ hơn hỏi chung chung `bagaimana?`.",
    tip_advice_en:
      "Polite tax-office phrases: `mohon jelaskan`, `saya mau membuat janji`, `apakah konsultasi ini gratis atau berbayar?` When you do not understand the process, asking for `langkah-langkahnya` is clearer than a vague `bagaimana?`.",
    vocabulary: [
      { word: "denda", en: "fine/penalty", vi: "tiền phạt", pos: "noun", pronunciation_vi: "DEN-da", pronunciation_en: "DEN-da" },
      { word: "terlambat", en: "late", vi: "trễ/muộn", pos: "adjective", pronunciation_vi: "ter-LAM-bat", pronunciation_en: "ter-LAM-bat" },
      { word: "membayar denda", en: "pay a fine", vi: "trả tiền phạt", pos: "verb phrase", pronunciation_vi: "mem-BA-yar DEN-da", pronunciation_en: "mem-BA-yar DEN-da" },
      { word: "membuat janji", en: "make an appointment", vi: "đặt lịch hẹn", pos: "verb phrase", pronunciation_vi: "mem-BU-at JAN-ji", pronunciation_en: "mem-BOO-at JAN-jee" },
      { word: "gratis", en: "free of charge", vi: "miễn phí", pos: "adjective", pronunciation_vi: "GRA-tis", pronunciation_en: "GRA-tis" },
      { word: "berbayar", en: "paid/fee-based", vi: "có tính phí", pos: "adjective", pronunciation_vi: "ber-BA-yar", pronunciation_en: "ber-BA-yar" },
      { word: "langkah-langkah", en: "steps", vi: "các bước", pos: "noun", pronunciation_vi: "LANG-kah LANG-kah", pronunciation_en: "LANG-kah LANG-kah" },
    ],
    dialogue: [
      { speaker: "Wajib pajak", text: "Saya terlambat lapor SPT, apakah ada denda?", vi: "Tôi nộp SPT trễ, có bị phạt không?", en: "I filed SPT late. Is there a fine?" },
      { speaker: "Petugas", text: "Kami perlu cek data NPWP dan tahun pajaknya dulu.", vi: "Chúng tôi cần kiểm tra dữ liệu NPWP và năm thuế trước.", en: "We need to check the NPWP data and tax year first." },
      { speaker: "Wajib pajak", text: "Baik. Mohon jelaskan langkah-langkahnya dengan pelan.", vi: "Vâng. Vui lòng giải thích các bước chậm thôi.", en: "Okay. Please explain the steps slowly." },
    ],
    exercises: [
      {
        type: "scenario",
        instruction_vi: "Chọn câu phù hợp cho tình huống.",
        instruction_en: "Choose the suitable sentence for the situation.",
        items: [
          { prompt: "Bạn nộp SPT trễ và hỏi có bị phạt không.", answer: "Saya terlambat lapor SPT, apakah ada denda?" },
          { prompt: "Bạn muốn đặt lịch tư vấn thuế.", answer: "Saya mau membuat janji untuk konsultasi pajak." },
          { prompt: "Bạn muốn hỏi tư vấn miễn phí hay trả phí.", answer: "Apakah konsultasi ini gratis atau berbayar?" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Cách trả tiền phạt thuế như thế nào?", answer: "Bagaimana cara membayar denda pajak?" },
          { prompt: "Vui lòng giải thích các bước chậm thôi.", answer: "Mohon jelaskan langkah-langkahnya dengan pelan." },
        ],
      },
    ],
  },
];
