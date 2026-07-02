// BPJS employment & work accident Indonesian (Vietnamese -> Indonesian study track).
//
// A1 Wave 18 file. Covers BPJS Ketenagakerjaan, JHT, JKK, kecelakaan kerja,
// kartu peserta, klaim, HRD, and iuran. Self-contained so no registry or
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

export const bpjsEmploymentWorkAccidentLessons: IndonesianLesson[] = [
  {
    id: "indonesian_bpjs_employment_registration",
    level: "B1",
    category: "work",
    title_vi: "BPJS Ketenagakerjaan và đăng ký nhân viên",
    title_en: "BPJS Ketenagakerjaan and employee registration",
    sentences: [
      {
        en: "Apakah saya sudah terdaftar di BPJS Ketenagakerjaan?",
        vi: "Tôi đã được đăng ký vào BPJS lao động chưa?",
        pronunciation_focus: [
          "A-pa-kah SA-ya SU-dah ter-DAF-tar di be-pe-je-ES ke-te-na-ga-ker-JA-an - `terdaftar` = đã được đăng ký/đã có trong hệ thống.",
          "`BPJS Ketenagakerjaan` là bảo hiểm lao động, khác với `BPJS Kesehatan` là bảo hiểm y tế.",
          "Lỗi người Việt: dùng `daftar` trần. Khi hỏi trạng thái trong hệ thống, nói `sudah terdaftar`.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah SA-ya SOO-dah ter-DAF-tar di be-pe-je-ES ke-te-na-ga-ker-JA-an - `terdaftar` = registered/listed in the system.",
          "`BPJS Ketenagakerjaan` is employment social security, different from `BPJS Kesehatan` health insurance.",
          "VN-speaker trap: using bare `daftar`. When asking system status, say `sudah terdaftar`.",
        ],
      },
      {
        en: "Perusahaan wajib mendaftarkan karyawan ke BPJS Ketenagakerjaan.",
        vi: "Công ty bắt buộc đăng ký nhân viên vào BPJS lao động.",
        pronunciation_focus: [
          "pe-ru-sa-HA-an WA-jib men-daf-TAR-kan kar-ya-WAN ke be-pe-je-ES ke-te-na-ga-ker-JA-an - `wajib` = bắt buộc theo luật.",
          "`mendaftarkan` = đăng ký cho ai; khác `mendaftar` = tự đăng ký.",
          "Lỗi người Việt: nói `perusahaan daftar karyawan`. Cần `mendaftarkan` vì công ty đăng ký nhân viên.",
        ],
        pronunciation_focus_en: [
          "pe-ru-sa-HA-an WA-jib men-daf-TAR-kan kar-ya-WAN ke be-pe-je-ES ke-te-na-ga-ker-JA-an - `wajib` = legally required.",
          "`mendaftarkan` = register someone; different from `mendaftar` = register oneself.",
          "VN-speaker trap: saying `perusahaan daftar karyawan`. Use `mendaftarkan` because the company registers the employee.",
        ],
      },
      {
        en: "Saya mau minta nomor kartu peserta BPJS saya.",
        vi: "Tôi muốn xin số thẻ người tham gia BPJS của tôi.",
        pronunciation_focus: [
          "SA-ya mau MIN-ta NO-mor KAR-tu pe-SER-ta be-pe-je-ES SA-ya - `kartu peserta` = thẻ người tham gia.",
          "`peserta` = người tham gia/chủ thẻ; dùng nhiều trong bảo hiểm và chương trình nhà nước.",
          "Lỗi người Việt: dịch `participant` thành `orang ikut`. Từ văn phòng đúng là `peserta`.",
        ],
        pronunciation_focus_en: [
          "SA-ya mau MIN-ta NO-mor KAR-too pe-SER-ta be-pe-je-ES SA-ya - `kartu peserta` = participant/member card.",
          "`peserta` = participant/member; common in insurance and government programs.",
          "VN-speaker trap: translating participant as `orang ikut`. The office term is `peserta`.",
        ],
      },
      {
        en: "Iuran BPJS saya dipotong dari gaji setiap bulan.",
        vi: "Phí BPJS của tôi được trừ từ lương mỗi tháng.",
        pronunciation_focus: [
          "i-U-ran be-pe-je-ES SA-ya di-PO-tong da-ri GA-ji se-TI-ap BU-lan - `iuran` = khoản đóng góp/phí hằng tháng.",
          "`dipotong dari gaji` = bị/được khấu trừ từ lương; bị động `di-` rất quan trọng.",
          "Lỗi người Việt: nói `saya potong iuran`. Nếu công ty trừ từ lương, dùng `iuran dipotong`.",
        ],
        pronunciation_focus_en: [
          "ee-OO-ran be-pe-je-ES SA-ya dee-PO-tong da-ree GA-jee se-TEE-ap BOO-lan - `iuran` = monthly contribution.",
          "`dipotong dari gaji` = deducted from salary; passive `di-` matters here.",
          "VN-speaker trap: saying `saya potong iuran`. If the company deducts it from salary, use `iuran dipotong`.",
        ],
      },
      {
        en: "Saya perlu cek status kepesertaan lewat HRD.",
        vi: "Tôi cần kiểm tra tình trạng tham gia qua HRD.",
        pronunciation_focus: [
          "SA-ya per-LU CEK STA-tus ke-pe-ser-TA-an LE-wat ha-er-DE - `kepesertaan` = tư cách/tình trạng tham gia.",
          "`lewat HRD` = qua phòng nhân sự; HRD thường xử lý giấy tờ lao động.",
          "Lỗi người Việt: nói `status peserta saya`. Có thể hiểu, nhưng thuật ngữ đúng hơn là `status kepesertaan`.",
        ],
        pronunciation_focus_en: [
          "SA-ya per-LOO CHEK STA-tus ke-pe-ser-TA-an LEH-wat ha-er-DE - `kepesertaan` = membership/participation status.",
          "`lewat HRD` = through HR; HR often handles employment paperwork.",
          "VN-speaker trap: saying `status peserta saya`. Understandable, but the better term is `status kepesertaan`.",
        ],
      },
    ],
    cultural_notes_vi:
      "BPJS Ketenagakerjaan là hệ thống bảo hiểm lao động ở Indonesia, khác với BPJS Kesehatan. Nhân viên thường hỏi HRD về kartu peserta, nomor peserta, iuran, và status kepesertaan. Các chương trình như JHT và JKK có mục đích khác nhau, nên khi hỏi quyền lợi phải nói rõ loại chương trình.",
    cultural_notes_en:
      "BPJS Ketenagakerjaan is Indonesia's employment social-security system, different from BPJS Kesehatan. Employees commonly ask HR about the participant card, participant number, contributions, and membership status. Programs such as JHT and JKK serve different purposes, so clarify which program you are asking about.",
    tip_advice_vi:
      "Bộ câu sống còn: `sudah terdaftar`, `kartu peserta`, `iuran dipotong dari gaji`, `cek status kepesertaan lewat HRD`. Bẫy lớn là `mendaftar` vs `mendaftarkan`: tự đăng ký là `mendaftar`, đăng ký cho người khác là `mendaftarkan`.",
    tip_advice_en:
      "Survival set: `sudah terdaftar`, `kartu peserta`, `iuran dipotong dari gaji`, `cek status kepesertaan lewat HRD`. The big trap is `mendaftar` vs `mendaftarkan`: register yourself is `mendaftar`, register someone else is `mendaftarkan`.",
    vocabulary: [
      { word: "BPJS Ketenagakerjaan", en: "employment social security", vi: "bảo hiểm lao động", pos: "noun phrase", pronunciation_vi: "be-pe-je-ES ke-te-na-ga-ker-JA-an", pronunciation_en: "be-pe-je-ES ke-te-na-ga-ker-JA-an" },
      { word: "terdaftar", en: "registered", vi: "đã đăng ký", pos: "adjective/state", pronunciation_vi: "ter-DAF-tar", pronunciation_en: "ter-DAF-tar" },
      { word: "kartu peserta", en: "participant/member card", vi: "thẻ người tham gia", pos: "noun phrase", pronunciation_vi: "KAR-tu pe-SER-ta", pronunciation_en: "KAR-too pe-SER-ta" },
      { word: "iuran", en: "contribution/monthly fee", vi: "phí đóng góp", pos: "noun", pronunciation_vi: "i-U-ran", pronunciation_en: "ee-OO-ran" },
      { word: "HRD", en: "human resources department", vi: "phòng nhân sự", pos: "noun", pronunciation_vi: "ha-er-DE", pronunciation_en: "ha-er-DE" },
      { word: "kepesertaan", en: "membership status", vi: "tình trạng tham gia", pos: "noun", pronunciation_vi: "ke-pe-ser-TA-an", pronunciation_en: "ke-pe-ser-TA-an" },
    ],
    dialogue: [
      { speaker: "Karyawan", text: "Bu, apakah saya sudah terdaftar di BPJS Ketenagakerjaan?", vi: "Chị ơi, tôi đã được đăng ký vào BPJS lao động chưa?", en: "Ma'am, am I already registered with BPJS Ketenagakerjaan?" },
      { speaker: "HRD", text: "Sudah. Iurannya dipotong dari gaji setiap bulan.", vi: "Rồi. Phí được trừ từ lương mỗi tháng.", en: "Yes. The contribution is deducted from your salary every month." },
      { speaker: "Karyawan", text: "Bisa minta nomor kartu peserta BPJS saya?", vi: "Tôi xin số thẻ BPJS của tôi được không?", en: "Could I get my BPJS participant card number?" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "BPJS Ketenagakerjaan", answer: "bảo hiểm lao động" },
          { prompt: "kartu peserta", answer: "thẻ người tham gia" },
          { prompt: "iuran", answer: "phí đóng góp" },
          { prompt: "HRD", answer: "phòng nhân sự" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi đã được đăng ký vào BPJS lao động chưa?", answer: "Apakah saya sudah terdaftar di BPJS Ketenagakerjaan?" },
          { prompt: "Phí BPJS được trừ từ lương.", answer: "Iuran BPJS dipotong dari gaji." },
        ],
      },
    ],
  },
  {
    id: "indonesian_jht_jkk_work_accident",
    level: "B1",
    category: "work",
    title_vi: "JHT, JKK và tai nạn lao động",
    title_en: "JHT, JKK and workplace accidents",
    sentences: [
      {
        en: "Apa bedanya JHT dan JKK?",
        vi: "JHT và JKK khác nhau như thế nào?",
        pronunciation_focus: [
          "A-pa BE-da-nya ji-ha-TE dan ji-ka-KA - `apa bedanya` = khác nhau ở điểm nào.",
          "`JHT` và `JKK` đọc theo chữ cái Indonesia; hỏi `apa bedanya` rất tự nhiên.",
          "Lỗi người Việt: hỏi `apa berbeda JHT dan JKK?`. Câu tự nhiên hơn là `Apa bedanya JHT dan JKK?`",
        ],
        pronunciation_focus_en: [
          "A-pa BEH-da-nya ji-ha-TE dan ji-ka-KA - `apa bedanya` = what is the difference.",
          "`JHT` and `JKK` are spelled with Indonesian letter names; `apa bedanya` is very natural.",
          "VN-speaker trap: asking `apa berbeda JHT dan JKK?`. More natural: `Apa bedanya JHT dan JKK?`",
        ],
      },
      {
        en: "JHT adalah jaminan hari tua.",
        vi: "JHT là bảo hiểm/đảm bảo tuổi già.",
        pronunciation_focus: [
          "ji-ha-TE a-DA-lah ja-MI-nan HA-ri TU-a - `jaminan hari tua` = bảo đảm tuổi già/hưu trí.",
          "`adalah` nối hai danh từ trong văn phong giải thích.",
          "Lỗi người Việt: dùng `adalah` trước tính từ. Ở đây đúng vì `JHT` và `jaminan hari tua` đều là danh từ/cụm danh từ.",
        ],
        pronunciation_focus_en: [
          "ji-ha-TE a-DA-lah ja-MEE-nan HA-ree TOO-a - `jaminan hari tua` = old-age security/savings.",
          "`adalah` links two nouns in explanatory style.",
          "VN-speaker trap: using `adalah` before adjectives. Here it is correct because both sides are noun phrases.",
        ],
      },
      {
        en: "JKK menanggung risiko kecelakaan kerja.",
        vi: "JKK chi trả/bảo đảm rủi ro tai nạn lao động.",
        pronunciation_focus: [
          "ji-ka-KA me-NANG-gung RI-si-ko ke-che-la-KA-an KER-ja - `kecelakaan kerja` = tai nạn lao động.",
          "`menanggung` = chịu/chi trả/bảo đảm; dùng trong bảo hiểm.",
          "Lỗi người Việt: đọc `kecelakaan` thiếu âm `c`. `c` = ch: ke-che-la-KA-an.",
        ],
        pronunciation_focus_en: [
          "ji-ka-KA me-NANG-goong REE-see-ko ke-che-la-KA-an KER-ja - `kecelakaan kerja` = work accident.",
          "`menanggung` = covers/bears responsibility for; common in insurance.",
          "VN-speaker trap: dropping the `c` sound in `kecelakaan`. Indonesian `c` = ch: ke-che-la-KA-an.",
        ],
      },
      {
        en: "Saya mengalami kecelakaan kerja di pabrik.",
        vi: "Tôi gặp tai nạn lao động ở nhà máy.",
        pronunciation_focus: [
          "SA-ya me-nga-LA-mi ke-che-la-KA-an KER-ja di PAB-rik - `mengalami` = trải qua/gặp phải.",
          "`di pabrik` = ở nhà máy; vị trí tĩnh dùng `di`.",
          "Lỗi người Việt: nói `kena kecelakaan` trong văn bản chính thức. Với báo cáo, `mengalami kecelakaan kerja` chuẩn hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya me-nga-LA-mee ke-che-la-KA-an KER-ja di PAB-rik - `mengalami` = experience/suffer.",
          "`di pabrik` = at the factory; static location uses `di`.",
          "VN-speaker trap: saying casual `kena kecelakaan` in formal writing. For reports, `mengalami kecelakaan kerja` is better.",
        ],
      },
      {
        en: "Saya harus lapor ke HRD secepatnya.",
        vi: "Tôi phải báo cho HRD càng sớm càng tốt.",
        pronunciation_focus: [
          "SA-ya HA-rus LA-por ke ha-er-DE se-CE-pat-nya - `secepatnya` = càng sớm càng tốt.",
          "`lapor ke HRD` = báo cho phòng nhân sự; `ke` chỉ người/nơi nhận báo cáo.",
          "Lỗi người Việt: dùng `di HRD` khi nghĩa là báo cho HRD. Người nhận/hướng báo cáo dùng `ke HRD`.",
        ],
        pronunciation_focus_en: [
          "SA-ya HA-roos LA-por ke ha-er-DE se-CHE-pat-nya - `secepatnya` = as soon as possible.",
          "`lapor ke HRD` = report to HR; `ke` marks the recipient/direction.",
          "VN-speaker trap: using `di HRD` when you mean report to HR. Recipient/direction uses `ke HRD`.",
        ],
      },
    ],
    cultural_notes_vi:
      "JHT (Jaminan Hari Tua) liên quan đến khoản tích lũy cho tuổi già/hưu trí, còn JKK (Jaminan Kecelakaan Kerja) liên quan đến tai nạn lao động. Khi xảy ra kecelakaan kerja, hãy báo HRD hoặc atasan càng sớm càng tốt, giữ bukti kejadian, surat dokter, và dokumen liên quan. Bài này dạy ngôn ngữ để hỏi và báo cáo, không thay thế tư vấn pháp lý hoặc bảo hiểm.",
    cultural_notes_en:
      "JHT (Jaminan Hari Tua) relates to old-age savings/security, while JKK (Jaminan Kecelakaan Kerja) covers work accidents. If a workplace accident happens, report to HR or a supervisor as soon as possible, and keep evidence of the incident, doctor's letters, and related documents. This lesson teaches language for asking and reporting, not legal or insurance advice.",
    tip_advice_vi:
      "Phân biệt `JHT` và `JKK`: JHT = hari tua, JKK = kecelakaan kerja. Khi báo sự cố, dùng câu trung tính và rõ: `Saya mengalami kecelakaan kerja...`, không cần mô tả cảm xúc dài.",
    tip_advice_en:
      "Distinguish `JHT` and `JKK`: JHT = old age, JKK = work accident. When reporting an incident, use neutral, clear wording: `Saya mengalami kecelakaan kerja...`, without long emotional detail.",
    vocabulary: [
      { word: "JHT", en: "old-age security", vi: "bảo đảm tuổi già/hưu trí", pos: "noun", pronunciation_vi: "ji-ha-TE", pronunciation_en: "ji-ha-TE" },
      { word: "JKK", en: "work accident insurance", vi: "bảo hiểm tai nạn lao động", pos: "noun", pronunciation_vi: "ji-ka-KA", pronunciation_en: "ji-ka-KA" },
      { word: "jaminan hari tua", en: "old-age security", vi: "bảo đảm tuổi già", pos: "noun phrase", pronunciation_vi: "ja-MI-nan HA-ri TU-a", pronunciation_en: "ja-MEE-nan HA-ree TOO-a" },
      { word: "kecelakaan kerja", en: "workplace accident", vi: "tai nạn lao động", pos: "noun phrase", pronunciation_vi: "ke-che-la-KA-an KER-ja", pronunciation_en: "ke-che-la-KA-an KER-ja" },
      { word: "menanggung", en: "cover/bear responsibility", vi: "chi trả/bảo đảm", pos: "verb", pronunciation_vi: "me-NANG-gung", pronunciation_en: "me-NANG-goong" },
      { word: "secepatnya", en: "as soon as possible", vi: "càng sớm càng tốt", pos: "adverb", pronunciation_vi: "se-CE-pat-nya", pronunciation_en: "se-CHE-pat-nya" },
    ],
    dialogue: [
      { speaker: "Karyawan", text: "Pak, saya mengalami kecelakaan kerja di pabrik.", vi: "Anh ơi, tôi gặp tai nạn lao động ở nhà máy.", en: "Sir, I had a workplace accident at the factory." },
      { speaker: "HRD", text: "Tolong lapor secepatnya dan kirim surat dokter.", vi: "Làm ơn báo càng sớm càng tốt và gửi giấy bác sĩ.", en: "Please report as soon as possible and send the doctor's letter." },
      { speaker: "Karyawan", text: "Apakah ini termasuk klaim JKK?", vi: "Việc này có thuộc klaim JKK không?", en: "Does this count as a JKK claim?" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng.",
        instruction_en: "Fill in the correct word.",
        items: [
          { prompt: "JHT adalah jaminan hari ___.", answer: "tua" },
          { prompt: "JKK menanggung risiko kecelakaan ___.", answer: "kerja" },
          { prompt: "Saya harus lapor ke HRD ___.", answer: "secepatnya" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "JHT", answer: "bảo đảm tuổi già" },
          { prompt: "JKK", answer: "tai nạn lao động" },
          { prompt: "kecelakaan kerja", answer: "workplace accident" },
          { prompt: "HRD", answer: "human resources" },
        ],
      },
    ],
  },
  {
    id: "indonesian_bpjs_claim_process",
    level: "B1",
    category: "work",
    title_vi: "Klaim BPJS và giấy tờ cần chuẩn bị",
    title_en: "BPJS claims and required documents",
    sentences: [
      {
        en: "Saya mau mengajukan klaim BPJS Ketenagakerjaan.",
        vi: "Tôi muốn nộp yêu cầu klaim BPJS lao động.",
        pronunciation_focus: [
          "SA-ya mau me-nga-JU-kan klaim be-pe-je-ES ke-te-na-ga-ker-JA-an - `mengajukan klaim` = nộp yêu cầu bồi thường/quyền lợi.",
          "`klaim` là từ mượn nhưng rất phổ biến trong bảo hiểm.",
          "Lỗi người Việt: nói `buat klaim` trong văn phòng. Tự nhiên và trang trọng hơn: `mengajukan klaim`.",
        ],
        pronunciation_focus_en: [
          "SA-ya mau me-nga-JOO-kan klaim be-pe-je-ES ke-te-na-ga-ker-JA-an - `mengajukan klaim` = submit/file a claim.",
          "`klaim` is a loanword and very common in insurance.",
          "VN-speaker trap: saying `buat klaim` at an office. More natural and formal: `mengajukan klaim`.",
        ],
      },
      {
        en: "Dokumen apa saja yang harus saya siapkan?",
        vi: "Tôi phải chuẩn bị những giấy tờ gì?",
        pronunciation_focus: [
          "do-ku-MEN A-pa SA-ja yang HA-rus SA-ya si-AP-kan - `siapkan` = chuẩn bị.",
          "`apa saja` hỏi cả danh sách, không chỉ một giấy tờ.",
          "Lỗi người Việt: bỏ `saja`, câu nghe như hỏi một món. Nói `dokumen apa saja` để hỏi danh sách đầy đủ.",
        ],
        pronunciation_focus_en: [
          "do-koo-MEN A-pa SA-ja yang HA-roos SA-ya see-AP-kan - `siapkan` = prepare.",
          "`apa saja` asks for the full list, not just one document.",
          "VN-speaker trap: dropping `saja`, making it sound like one item. Say `dokumen apa saja` for the full list.",
        ],
      },
      {
        en: "Saya sudah punya surat keterangan dari dokter.",
        vi: "Tôi đã có giấy xác nhận từ bác sĩ.",
        pronunciation_focus: [
          "SA-ya SU-dah PUN-ya SU-rat ke-te-RANG-an da-RI DOK-ter - `surat keterangan` = giấy xác nhận.",
          "`dari dokter` = từ bác sĩ; nguồn giấy tờ dùng `dari`.",
          "Lỗi người Việt: nói `surat dokter` cho mọi giấy tờ. Nếu là giấy xác nhận, cụm đầy đủ là `surat keterangan dari dokter`.",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah POON-ya SOO-rat ke-te-RANG-an da-REE DOK-ter - `surat keterangan` = certificate/statement letter.",
          "`dari dokter` = from the doctor; source uses `dari`.",
          "VN-speaker trap: saying `surat dokter` for every document. For a certificate, use full `surat keterangan dari dokter`.",
        ],
      },
      {
        en: "Berapa lama proses klaimnya?",
        vi: "Quá trình xử lý klaim mất bao lâu?",
        pronunciation_focus: [
          "be-RA-pa LA-ma PRO-ses klaim-nya - `berapa lama` = bao lâu; `proses klaim` = quá trình xử lý yêu cầu.",
          "`-nya` ở `klaimnya` chỉ hồ sơ klaim cụ thể này.",
          "Lỗi người Việt: hỏi `berapa waktu`. Hỏi thời lượng dùng `berapa lama`.",
        ],
        pronunciation_focus_en: [
          "be-RA-pa LA-ma PRO-ses klaim-nya - `berapa lama` = how long; `proses klaim` = claim process.",
          "`-nya` in `klaimnya` points to this specific claim.",
          "VN-speaker trap: asking `berapa waktu`. For duration, use `berapa lama`.",
        ],
      },
      {
        en: "Mohon bantu cek status klaim saya.",
        vi: "Vui lòng giúp kiểm tra trạng thái klaim của tôi.",
        pronunciation_focus: [
          "MO-hon BAN-tu CEK STA-tus klaim SA-ya - `mohon bantu` = vui lòng giúp, lịch sự.",
          "`status klaim` = trạng thái yêu cầu/quyền lợi bảo hiểm.",
          "Lỗi người Việt: dùng `tolong` mọi lúc. `Tolong` đúng, nhưng `mohon bantu` hợp văn phòng hơn.",
        ],
        pronunciation_focus_en: [
          "MO-hon BAN-too CHEK STA-tus klaim SA-ya - `mohon bantu` = please help, polite.",
          "`status klaim` = claim status.",
          "VN-speaker trap: using `tolong` every time. `Tolong` is correct, but `mohon bantu` fits office settings better.",
        ],
      },
    ],
    cultural_notes_vi:
      "Klaim BPJS Ketenagakerjaan thường cần data peserta, kartu peserta, KTP/paspor/KITAS nếu relevan, surat dokter, kronologi kejadian, và dokumen dari HRD atau perusahaan. Untuk kecelakaan kerja, báo sớm rất quan trọng. Simpan foto, surat, bukti absensi, dan catatan komunikasi dengan HRD.",
    cultural_notes_en:
      "BPJS Ketenagakerjaan claims often require participant data, participant card, KTP/passport/KITAS if relevant, doctor's letters, incident chronology, and documents from HR or the company. For workplace accidents, reporting early is important. Keep photos, letters, attendance evidence, and communication records with HR.",
    tip_advice_vi:
      "Mẫu klaim tốt: sự việc + dokumen + yêu cầu. Ví dụ: `Saya mengalami kecelakaan kerja. Saya sudah punya surat keterangan dari dokter. Mohon bantu cek proses klaim JKK saya.`",
    tip_advice_en:
      "A good claim message is: event + documents + request. Example: `Saya mengalami kecelakaan kerja. Saya sudah punya surat keterangan dari dokter. Mohon bantu cek proses klaim JKK saya.`",
    vocabulary: [
      { word: "mengajukan klaim", en: "submit/file a claim", vi: "nộp yêu cầu klaim", pos: "verb phrase", pronunciation_vi: "me-nga-JU-kan klaim", pronunciation_en: "me-nga-JOO-kan klaim" },
      { word: "dokumen", en: "documents", vi: "giấy tờ", pos: "noun", pronunciation_vi: "do-ku-MEN", pronunciation_en: "do-koo-MEN" },
      { word: "surat keterangan", en: "certificate/statement letter", vi: "giấy xác nhận", pos: "noun phrase", pronunciation_vi: "SU-rat ke-te-RANG-an", pronunciation_en: "SOO-rat ke-te-RANG-an" },
      { word: "proses klaim", en: "claim process", vi: "quá trình xử lý klaim", pos: "noun phrase", pronunciation_vi: "PRO-ses klaim", pronunciation_en: "PRO-ses klaim" },
      { word: "status klaim", en: "claim status", vi: "trạng thái klaim", pos: "noun phrase", pronunciation_vi: "STA-tus klaim", pronunciation_en: "STA-tus klaim" },
      { word: "mohon bantu", en: "please help", vi: "vui lòng giúp", pos: "polite phrase", pronunciation_vi: "MO-hon BAN-tu", pronunciation_en: "MO-hon BAN-too" },
    ],
    dialogue: [
      { speaker: "Karyawan", text: "Saya mau mengajukan klaim BPJS Ketenagakerjaan.", vi: "Tôi muốn nộp klaim BPJS lao động.", en: "I want to submit a BPJS Ketenagakerjaan claim." },
      { speaker: "Petugas", text: "Dokumen apa saja yang sudah Bapak siapkan?", vi: "Anh đã chuẩn bị những giấy tờ gì rồi?", en: "What documents have you prepared?" },
      { speaker: "Karyawan", text: "Saya sudah punya surat keterangan dari dokter. Mohon bantu cek status klaim saya.", vi: "Tôi đã có giấy xác nhận từ bác sĩ. Vui lòng giúp kiểm tra trạng thái klaim của tôi.", en: "I already have a doctor's certificate. Please help check my claim status." },
    ],
    exercises: [
      {
        type: "scenario",
        instruction_vi: "Chọn câu phù hợp cho tình huống.",
        instruction_en: "Choose the suitable sentence for the situation.",
        items: [
          { prompt: "Bạn muốn nộp klaim BPJS.", answer: "Saya mau mengajukan klaim BPJS Ketenagakerjaan." },
          { prompt: "Bạn hỏi cần chuẩn bị giấy tờ gì.", answer: "Dokumen apa saja yang harus saya siapkan?" },
          { prompt: "Bạn muốn kiểm tra trạng thái klaim.", answer: "Mohon bantu cek status klaim saya." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi đã có giấy xác nhận từ bác sĩ.", answer: "Saya sudah punya surat keterangan dari dokter." },
          { prompt: "Quá trình xử lý klaim mất bao lâu?", answer: "Berapa lama proses klaimnya?" },
        ],
      },
    ],
  },
];
