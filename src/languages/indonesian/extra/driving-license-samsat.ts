// Driving license & Samsat Indonesian (Vietnamese -> Indonesian study track).
//
// A1 Wave 14 file. Covers SIM, STNK, Samsat, pajak kendaraan, tilang, ujian
// praktik, perpanjang SIM, and biaya resmi. Self-contained so no registry or
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

export const drivingLicenseSamsatLessons: IndonesianLesson[] = [
  {
    id: "indonesian_sim_license_application",
    level: "A2",
    category: "driving",
    title_vi: "SIM và thi bằng lái ở Indonesia",
    title_en: "SIM and driving tests in Indonesia",
    sentences: [
      {
        en: "Saya mau membuat SIM C untuk motor.",
        vi: "Tôi muốn làm bằng lái SIM C cho xe máy.",
        pronunciation_focus: [
          "SA-ya mau mem-BU-at SIM CE UN-tuk MO-tor - `SIM C` = bằng lái xe máy; `motor` = xe máy.",
          "`SIM` đọc như một từ `sim`, không đọc từng chữ như tiếng Anh.",
          "Lỗi người Việt: hiểu `motor` là động cơ. Ở Indonesia, `motor` thường là cả chiếc xe máy.",
        ],
        pronunciation_focus_en: [
          "SA-ya mau mem-BOO-at SIM CHE OON-tuk MO-tor - `SIM C` = motorbike license; `motor` = motorbike.",
          "`SIM` is pronounced as one word, `sim`, not spelled letter by letter in English.",
          "VN-speaker trap: understanding `motor` as engine. In Indonesia, `motor` usually means the whole motorbike.",
        ],
      },
      {
        en: "Saya harus ikut ujian teori dan ujian praktik.",
        vi: "Tôi phải tham gia thi lý thuyết và thi thực hành.",
        pronunciation_focus: [
          "SA-ya HA-rus I-kut u-JI-an te-O-ri dan u-JI-an PRAK-tik - `ujian praktik` = thi thực hành.",
          "`ikut ujian` = tham gia kỳ thi; dùng `ikut`, không cần động từ dài.",
          "Lỗi người Việt: đọc `praktik` như tiếng Anh. Đọc rõ PRAK-tik, có `k` cuối.",
        ],
        pronunciation_focus_en: [
          "SA-ya HA-roos EE-koot oo-JEE-an te-O-ree dan oo-JEE-an PRAK-tik - `ujian praktik` = practical test.",
          "`ikut ujian` = take/join an exam; `ikut` is enough.",
          "VN-speaker trap: pronouncing `praktik` English-style. Say PRAK-tik with the final `k`.",
        ],
      },
      {
        en: "Apakah ujian praktiknya sulit?",
        vi: "Bài thi thực hành có khó không?",
        pronunciation_focus: [
          "A-pa-kah u-JI-an PRAK-tik-nya SU-lit - `sulit` = khó.",
          "`-nya` ở `praktiknya` nghĩa là bài thực hành đó, làm câu tự nhiên hơn.",
          "Lỗi người Việt: hỏi `praktik sulit?` quá cụt. Câu lịch sự hơn: `Apakah ujian praktiknya sulit?`",
        ],
        pronunciation_focus_en: [
          "A-pa-kah oo-JEE-an PRAK-tik-nya SOO-lit - `sulit` = difficult.",
          "`-nya` in `praktiknya` points to that practical test and sounds natural.",
          "VN-speaker trap: asking blunt `praktik sulit?`. More polite: `Apakah ujian praktiknya sulit?`",
        ],
      },
      {
        en: "Berapa biaya resmi untuk perpanjang SIM?",
        vi: "Lệ phí chính thức để gia hạn bằng lái là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa BI-a-ya res-MI UN-tuk per-PAN-jang SIM - `biaya resmi` = lệ phí chính thức.",
          "`perpanjang SIM` = gia hạn bằng lái; dạng nói thường gặp ở quầy.",
          "Lỗi người Việt: chỉ hỏi `berapa uangnya?`. Với thủ tục, dùng `biaya resmi` để hỏi phí chính thức.",
        ],
        pronunciation_focus_en: [
          "be-RA-pa BEE-a-ya res-MEE OON-tuk per-PAN-jang SIM - `biaya resmi` = official fee.",
          "`perpanjang SIM` = renew a license; common counter phrasing.",
          "VN-speaker trap: asking only `berapa uangnya?`. For procedures, use `biaya resmi` to ask the official fee.",
        ],
      },
      {
        en: "SIM saya hampir habis masa berlakunya.",
        vi: "Bằng lái của tôi gần hết thời hạn hiệu lực.",
        pronunciation_focus: [
          "SIM SA-ya HAM-pir HA-bis MA-sa ber-LA-ku-nya - `masa berlaku` = thời hạn hiệu lực.",
          "`hampir habis` = gần hết; dùng cho hạn giấy tờ.",
          "Lỗi người Việt: nói `SIM mati` ở văn phòng. Cách chuẩn hơn là `hampir habis masa berlakunya`.",
        ],
        pronunciation_focus_en: [
          "SIM SA-ya HAM-pir HA-bis MA-sa ber-LA-koo-nya - `masa berlaku` = validity period.",
          "`hampir habis` = almost expired/used up; works for document validity.",
          "VN-speaker trap: saying casual `SIM mati` at an office. More standard: `hampir habis masa berlakunya`.",
        ],
      },
    ],
    cultural_notes_vi:
      "SIM là Surat Izin Mengemudi, bằng lái ở Indonesia. SIM C thường cho xe máy, SIM A cho ô tô cá nhân. Làm mới SIM thường liên quan đến ujian teori, ujian praktik, kiểm tra sức khỏe, và biaya resmi. Gia hạn SIM nên làm trước khi hết masa berlaku; nếu quá hạn, có thể phải làm mới tùy quy định hiện hành.",
    cultural_notes_en:
      "SIM is Surat Izin Mengemudi, the Indonesian driving license. SIM C is generally for motorbikes, SIM A for private cars. Getting a new SIM usually involves a theory test, practical test, health check, and official fee. Renew before the validity period ends; if it expires, you may need to apply again depending on current rules.",
    tip_advice_vi:
      "Bộ câu sống còn: `Saya mau membuat SIM C`, `ujian teori dan ujian praktik`, `biaya resmi`, `masa berlaku`. Bẫy lớn là từ `motor`: trong Indonesia là xe máy, không phải chỉ động cơ.",
    tip_advice_en:
      "Survival set: `Saya mau membuat SIM C`, `ujian teori dan ujian praktik`, `biaya resmi`, `masa berlaku`. The big trap is `motor`: in Indonesian it means motorbike, not just engine.",
    vocabulary: [
      { word: "SIM", en: "driving license", vi: "bằng lái xe", pos: "noun", pronunciation_vi: "sim", pronunciation_en: "sim" },
      { word: "SIM C", en: "motorbike license", vi: "bằng lái xe máy", pos: "noun", pronunciation_vi: "sim CE", pronunciation_en: "sim CHE" },
      { word: "ujian praktik", en: "practical test", vi: "thi thực hành", pos: "noun phrase", pronunciation_vi: "u-JI-an PRAK-tik", pronunciation_en: "oo-JEE-an PRAK-tik" },
      { word: "perpanjang SIM", en: "renew a license", vi: "gia hạn bằng lái", pos: "verb phrase", pronunciation_vi: "per-PAN-jang SIM", pronunciation_en: "per-PAN-jang SIM" },
      { word: "biaya resmi", en: "official fee", vi: "lệ phí chính thức", pos: "noun phrase", pronunciation_vi: "BI-a-ya res-MI", pronunciation_en: "BEE-a-ya res-MEE" },
      { word: "masa berlaku", en: "validity period", vi: "thời hạn hiệu lực", pos: "noun phrase", pronunciation_vi: "MA-sa ber-LA-ku", pronunciation_en: "MA-sa ber-LA-koo" },
    ],
    dialogue: [
      { speaker: "Pemohon", text: "Selamat pagi. Saya mau membuat SIM C untuk motor.", vi: "Chào buổi sáng. Tôi muốn làm SIM C cho xe máy.", en: "Good morning. I want to make a SIM C for a motorbike." },
      { speaker: "Petugas", text: "Baik. Nanti ada ujian teori dan ujian praktik.", vi: "Vâng. Lát nữa có thi lý thuyết và thi thực hành.", en: "Okay. Later there will be a theory test and a practical test." },
      { speaker: "Pemohon", text: "Berapa biaya resmi untuk membuat SIM baru?", vi: "Lệ phí chính thức để làm bằng lái mới là bao nhiêu?", en: "What is the official fee for making a new license?" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "SIM C", answer: "bằng lái xe máy" },
          { prompt: "ujian praktik", answer: "thi thực hành" },
          { prompt: "biaya resmi", answer: "lệ phí chính thức" },
          { prompt: "masa berlaku", answer: "thời hạn hiệu lực" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi muốn gia hạn bằng lái.", answer: "Saya mau perpanjang SIM." },
          { prompt: "Lệ phí chính thức là bao nhiêu?", answer: "Berapa biaya resminya?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_samsat_stnk_vehicle_tax",
    level: "B1",
    category: "driving",
    title_vi: "Samsat, STNK và pajak kendaraan",
    title_en: "Samsat, STNK and vehicle tax",
    sentences: [
      {
        en: "Saya mau bayar pajak kendaraan di Samsat.",
        vi: "Tôi muốn đóng thuế xe ở Samsat.",
        pronunciation_focus: [
          "SA-ya mau BA-yar PA-jak ken-da-RA-an di SAM-sat - `pajak kendaraan` = thuế phương tiện.",
          "`Samsat` là văn phòng dịch vụ liên quan đăng ký/thuế xe ở Indonesia.",
          "Lỗi người Việt: dùng `pajak motor` cho mọi xe. Cụm chung chuẩn hơn là `pajak kendaraan`.",
        ],
        pronunciation_focus_en: [
          "SA-ya mau BA-yar PA-jak ken-da-RA-an di SAM-sat - `pajak kendaraan` = vehicle tax.",
          "`Samsat` is the office/service for vehicle registration and tax matters in Indonesia.",
          "VN-speaker trap: using `pajak motor` for every vehicle. The broader standard phrase is `pajak kendaraan`.",
        ],
      },
      {
        en: "STNK saya sudah mau habis.",
        vi: "Giấy đăng ký xe STNK của tôi sắp hết hạn.",
        pronunciation_focus: [
          "es-te-en-KA SA-ya SU-dah mau HA-bis - `STNK` = giấy đăng ký xe; đọc từng chữ Indonesia.",
          "`sudah mau habis` = sắp hết hạn; tự nhiên trong hội thoại.",
          "Lỗi người Việt: đọc `STNK` liền thành một từ. Người Indonesia đánh vần: es-te-en-ka.",
        ],
        pronunciation_focus_en: [
          "es-te-en-KA SA-ya SOO-dah mau HA-bis - `STNK` = vehicle registration certificate; spell it with Indonesian letter names.",
          "`sudah mau habis` = about to expire; natural in conversation.",
          "VN-speaker trap: reading `STNK` as one word. Indonesians spell it: es-te-en-ka.",
        ],
      },
      {
        en: "Dokumen apa saja yang harus saya bawa ke Samsat?",
        vi: "Tôi phải mang theo những giấy tờ gì đến Samsat?",
        pronunciation_focus: [
          "do-ku-MEN A-pa SA-ja yang HA-rus SA-ya BA-wa ke SAM-sat - `apa saja` hỏi cả danh sách.",
          "`ke Samsat` = đến Samsat; `ke` là hướng di chuyển.",
          "Lỗi người Việt: dùng `di Samsat` khi nói đi đến. Đi tới nơi dùng `ke`, ở tại nơi dùng `di`.",
        ],
        pronunciation_focus_en: [
          "do-koo-MEN A-pa SA-ja yang HA-roos SA-ya BA-wa ke SAM-sat - `apa saja` asks for the whole list.",
          "`ke Samsat` = to Samsat; `ke` marks movement toward a place.",
          "VN-speaker trap: using `di Samsat` when you mean going there. Movement uses `ke`; static location uses `di`.",
        ],
      },
      {
        en: "Apakah bisa bayar pajak kendaraan secara online?",
        vi: "Có thể đóng thuế xe online không?",
        pronunciation_focus: [
          "A-pa-kah BI-sa BA-yar PA-jak ken-da-RA-an se-CA-ra ON-line - `secara online` = bằng hình thức online.",
          "`apakah bisa` = có thể không; lịch sự khi hỏi dịch vụ.",
          "Lỗi người Việt: bỏ `secara` không sai trong chat, nhưng ở văn phòng `secara online` nghe chuẩn hơn.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah BEE-sa BA-yar PA-jak ken-da-RA-an se-CHA-ra ON-line - `secara online` = online/by online method.",
          "`apakah bisa` = is it possible; polite for service questions.",
          "VN-speaker trap: dropping `secara` is okay in chat, but at an office `secara online` sounds more standard.",
        ],
      },
      {
        en: "Saya butuh bukti pembayaran pajak kendaraan.",
        vi: "Tôi cần bằng chứng thanh toán thuế xe.",
        pronunciation_focus: [
          "SA-ya BU-tuh BUK-ti pem-ba-YA-ran PA-jak ken-da-RA-an - `bukti pembayaran` = bằng chứng/biên lai thanh toán.",
          "`pembayaran` là danh từ từ gốc `bayar`; văn phòng dùng nhiều danh từ dạng `pe-...-an`.",
          "Lỗi người Việt: nói `bukti bayar` trong câu trang trọng. Hiểu được, nhưng `bukti pembayaran` đầy đủ hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya BOO-tooh BOOK-tee pem-ba-YA-ran PA-jak ken-da-RA-an - `bukti pembayaran` = proof/receipt of payment.",
          "`pembayaran` is a noun from `bayar`; offices use many `pe-...-an` nouns.",
          "VN-speaker trap: saying `bukti bayar` in a formal sentence. Understandable, but `bukti pembayaran` is fuller.",
        ],
      },
    ],
    cultural_notes_vi:
      "Samsat là nơi xử lý nhiều việc liên quan xe: pajak kendaraan, STNK, balik nama, và validasi pembayaran tùy dịch vụ địa phương. Khi đi Samsat, thường cần KTP, STNK, BPKB hoặc bản sao, và bukti pembayaran nếu đã trả online. Quy định và kênh online có thể khác theo tỉnh, nên hỏi `dokumen apa saja` và `bisa online atau harus datang langsung?`.",
    cultural_notes_en:
      "Samsat handles many vehicle matters: vehicle tax, STNK, title transfer, and payment validation depending on local services. At Samsat, you often need KTP, STNK, BPKB or a copy, and proof of payment if you already paid online. Rules and online channels vary by province, so ask `dokumen apa saja` and `bisa online atau harus datang langsung?`.",
    tip_advice_vi:
      "Phân biệt `SIM` và `STNK`: SIM là bằng lái của người lái; STNK là giấy đăng ký của xe. Người Việt hay gom chung là 'giấy xe', nhưng ở Indonesia nên gọi đúng tên khi nói với cảnh sát hoặc Samsat.",
    tip_advice_en:
      "Distinguish `SIM` and `STNK`: SIM is the driver's license; STNK is the vehicle registration. Vietnamese speakers may say generic 'vehicle papers', but in Indonesia use the precise names with police or Samsat.",
    vocabulary: [
      { word: "Samsat", en: "vehicle tax/registration office", vi: "cơ quan Samsat về thuế/đăng ký xe", pos: "noun", pronunciation_vi: "SAM-sat", pronunciation_en: "SAM-sat" },
      { word: "STNK", en: "vehicle registration certificate", vi: "giấy đăng ký xe", pos: "noun", pronunciation_vi: "es-te-en-KA", pronunciation_en: "es-te-en-KA" },
      { word: "pajak kendaraan", en: "vehicle tax", vi: "thuế phương tiện", pos: "noun phrase", pronunciation_vi: "PA-jak ken-da-RA-an", pronunciation_en: "PA-jak ken-da-RA-an" },
      { word: "BPKB", en: "vehicle ownership book", vi: "sổ/chứng nhận sở hữu xe", pos: "noun", pronunciation_vi: "be-pe-ka-BE", pronunciation_en: "be-pe-ka-BE" },
      { word: "bukti pembayaran", en: "proof of payment", vi: "bằng chứng thanh toán", pos: "noun phrase", pronunciation_vi: "BUK-ti pem-ba-YA-ran", pronunciation_en: "BOOK-tee pem-ba-YA-ran" },
      { word: "secara online", en: "online/by online method", vi: "bằng hình thức online", pos: "adverb phrase", pronunciation_vi: "se-CA-ra ON-line", pronunciation_en: "se-CHA-ra ON-line" },
    ],
    dialogue: [
      { speaker: "Pemilik kendaraan", text: "Saya mau bayar pajak kendaraan di Samsat.", vi: "Tôi muốn đóng thuế xe ở Samsat.", en: "I want to pay vehicle tax at Samsat." },
      { speaker: "Petugas", text: "Bawa KTP, STNK, dan bukti pembayaran kalau sudah bayar online.", vi: "Mang theo KTP, STNK, và bằng chứng thanh toán nếu đã trả online.", en: "Bring KTP, STNK, and proof of payment if you already paid online." },
      { speaker: "Pemilik kendaraan", text: "Apakah bisa bayar pajak kendaraan secara online?", vi: "Có thể đóng thuế xe online không?", en: "Can vehicle tax be paid online?" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng.",
        instruction_en: "Fill in the correct word.",
        items: [
          { prompt: "Saya mau bayar pajak ___ di Samsat.", answer: "kendaraan" },
          { prompt: "___ saya sudah mau habis.", answer: "STNK" },
          { prompt: "Saya butuh bukti ___ pajak kendaraan.", answer: "pembayaran" },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "SIM", answer: "bằng lái" },
          { prompt: "STNK", answer: "giấy đăng ký xe" },
          { prompt: "Samsat", answer: "cơ quan thuế/đăng ký xe" },
          { prompt: "pajak kendaraan", answer: "thuế xe" },
        ],
      },
    ],
  },
  {
    id: "indonesian_traffic_ticket_tilang",
    level: "B1",
    category: "driving",
    title_vi: "Tilang và hỏi về phạt giao thông",
    title_en: "Traffic tickets and asking about fines",
    sentences: [
      {
        en: "Saya ditilang karena tidak membawa STNK.",
        vi: "Tôi bị phạt vì không mang STNK.",
        pronunciation_focus: [
          "SA-ya di-TI-lang ka-RE-na TI-dak mem-BA-wa es-te-en-KA - `ditilang` = bị lập biên bản/phạt giao thông.",
          "`karena` = vì; nối lỗi với nguyên nhân.",
          "Lỗi người Việt: nói `saya tilang`. Người bị phạt dùng bị động: `saya ditilang`.",
        ],
        pronunciation_focus_en: [
          "SA-ya dee-TEE-lang ka-REH-na TEE-dak mem-BA-wa es-te-en-KA - `ditilang` = was ticketed.",
          "`karena` = because; connects the ticket to the reason.",
          "VN-speaker trap: saying `saya tilang`. The person receiving the ticket uses passive: `saya ditilang`.",
        ],
      },
      {
        en: "Apakah saya harus bayar denda sekarang?",
        vi: "Tôi có phải trả tiền phạt bây giờ không?",
        pronunciation_focus: [
          "A-pa-kah SA-ya HA-rus BA-yar DEN-da se-KA-rang - `denda` = tiền phạt.",
          "`harus` = phải; dùng khi hỏi nghĩa vụ.",
          "Lỗi người Việt: dùng `fine` trong câu Indonesia. Ở đây dùng từ Indonesia `denda`.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah SA-ya HA-roos BA-yar DEN-da se-KA-rang - `denda` = fine/penalty.",
          "`harus` = must/have to; useful for asking obligations.",
          "VN-speaker trap: using English `fine` inside Indonesian. Use Indonesian `denda` here.",
        ],
      },
      {
        en: "Saya mau membayar denda lewat aplikasi resmi.",
        vi: "Tôi muốn trả tiền phạt qua ứng dụng chính thức.",
        pronunciation_focus: [
          "SA-ya mau mem-BA-yar DEN-da LE-wat ap-li-KA-si res-MI - `aplikasi resmi` = ứng dụng chính thức.",
          "`lewat` = qua/thông qua; dùng cho kênh thanh toán.",
          "Lỗi người Việt: dùng `di aplikasi` khi muốn nói qua ứng dụng. Kênh/phương thức dùng `lewat aplikasi`.",
        ],
        pronunciation_focus_en: [
          "SA-ya mau mem-BA-yar DEN-da LEH-wat ap-lee-KA-see res-MEE - `aplikasi resmi` = official app.",
          "`lewat` = via/through; used for payment channels.",
          "VN-speaker trap: using `di aplikasi` when you mean through the app. Channel/method uses `lewat aplikasi`.",
        ],
      },
      {
        en: "Mohon jelaskan pelanggaran saya.",
        vi: "Vui lòng giải thích lỗi vi phạm của tôi.",
        pronunciation_focus: [
          "MO-hon je-LAS-kan pe-lang-GA-ran SA-ya - `pelanggaran` = lỗi vi phạm.",
          "`mohon jelaskan` lịch sự hơn `jelaskan dong` khi nói với petugas.",
          "Lỗi người Việt: bỏ `-kan` và nói `mohon jelas`. Động từ yêu cầu là `jelaskan`.",
        ],
        pronunciation_focus_en: [
          "MO-hon je-LAS-kan pe-lang-GA-ran SA-ya - `pelanggaran` = violation/offense.",
          "`mohon jelaskan` is more polite than `jelaskan dong` with an officer.",
          "VN-speaker trap: dropping `-kan` and saying `mohon jelas`. The request verb is `jelaskan`.",
        ],
      },
      {
        en: "Saya akan lebih hati-hati lain kali.",
        vi: "Lần sau tôi sẽ cẩn thận hơn.",
        pronunciation_focus: [
          "SA-ya A-kan LE-bih HA-ti HA-ti LA-in KA-li - `hati-hati` = cẩn thận.",
          "`lebih` đứng trước tính từ: `lebih hati-hati` = cẩn thận hơn.",
          "Lỗi người Việt: đặt `lebih` sau tính từ. Đúng: `lebih hati-hati`, không phải `hati-hati lebih`.",
        ],
        pronunciation_focus_en: [
          "SA-ya A-kan LEH-bih HA-tee HA-tee LA-in KA-lee - `hati-hati` = careful.",
          "`lebih` comes before the adjective: `lebih hati-hati` = more careful.",
          "VN-speaker trap: putting `lebih` after the adjective. Correct: `lebih hati-hati`, not `hati-hati lebih`.",
        ],
      },
    ],
    cultural_notes_vi:
      "`Tilang` là từ rất thực tế khi bị dừng xe vì vi phạm giao thông hoặc thiếu giấy tờ. Nên giữ giọng lịch sự, dùng `Pak/Bu`, hỏi rõ `pelanggaran saya apa?`, `apakah ada denda?`, và nếu cần thanh toán, hỏi kênh resmi. Tránh đưa tiền mặt không rõ quy trình; hãy hỏi `biaya resmi` hoặc `pembayaran resmi`.",
    cultural_notes_en:
      "`Tilang` is a practical word when stopped for a traffic violation or missing documents. Keep your tone polite, use `Pak/Bu`, ask clearly `pelanggaran saya apa?`, `apakah ada denda?`, and if payment is needed, ask for the official channel. Avoid unclear cash payments; ask for `biaya resmi` or `pembayaran resmi`.",
    tip_advice_vi:
      "Khi bạn là người bị phạt, dùng bị động: `saya ditilang`, `saya diberi surat tilang`. Đừng nói `saya tilang`, vì câu đó nghe như bạn là người đi phạt người khác.",
    tip_advice_en:
      "When you are the person ticketed, use passive: `saya ditilang`, `saya diberi surat tilang`. Do not say `saya tilang`, which sounds like you are the one ticketing someone else.",
    vocabulary: [
      { word: "tilang", en: "traffic ticket", vi: "biên bản/phạt giao thông", pos: "noun/verb", pronunciation_vi: "TI-lang", pronunciation_en: "TEE-lang" },
      { word: "ditilang", en: "ticketed", vi: "bị phạt giao thông", pos: "passive verb", pronunciation_vi: "di-TI-lang", pronunciation_en: "dee-TEE-lang" },
      { word: "denda", en: "fine", vi: "tiền phạt", pos: "noun", pronunciation_vi: "DEN-da", pronunciation_en: "DEN-da" },
      { word: "aplikasi resmi", en: "official app", vi: "ứng dụng chính thức", pos: "noun phrase", pronunciation_vi: "ap-li-KA-si res-MI", pronunciation_en: "ap-lee-KA-see res-MEE" },
      { word: "pelanggaran", en: "violation", vi: "lỗi vi phạm", pos: "noun", pronunciation_vi: "pe-lang-GA-ran", pronunciation_en: "pe-lang-GA-ran" },
      { word: "hati-hati", en: "careful", vi: "cẩn thận", pos: "adjective", pronunciation_vi: "HA-ti HA-ti", pronunciation_en: "HA-tee HA-tee" },
    ],
    dialogue: [
      { speaker: "Polisi", text: "Selamat siang. Mohon tunjukkan SIM dan STNK.", vi: "Chào buổi trưa. Vui lòng xuất trình bằng lái và STNK.", en: "Good afternoon. Please show your license and STNK." },
      { speaker: "Pengendara", text: "Ini SIM saya, Pak. Maaf, STNK tertinggal di rumah.", vi: "Đây là bằng lái của tôi, thưa anh. Xin lỗi, STNK để quên ở nhà.", en: "Here is my license, sir. Sorry, the STNK was left at home." },
      { speaker: "Pengendara", text: "Mohon jelaskan pelanggaran saya dan cara membayar denda resmi.", vi: "Vui lòng giải thích lỗi vi phạm của tôi và cách trả tiền phạt chính thức.", en: "Please explain my violation and how to pay the official fine." },
    ],
    exercises: [
      {
        type: "scenario",
        instruction_vi: "Chọn câu phù hợp cho tình huống.",
        instruction_en: "Choose the suitable sentence for the situation.",
        items: [
          { prompt: "Bạn bị phạt vì không mang STNK.", answer: "Saya ditilang karena tidak membawa STNK." },
          { prompt: "Bạn muốn hỏi có phải trả phạt bây giờ không.", answer: "Apakah saya harus bayar denda sekarang?" },
          { prompt: "Bạn muốn cảnh sát giải thích lỗi vi phạm.", answer: "Mohon jelaskan pelanggaran saya." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi muốn trả tiền phạt qua ứng dụng chính thức.", answer: "Saya mau membayar denda lewat aplikasi resmi." },
          { prompt: "Lần sau tôi sẽ cẩn thận hơn.", answer: "Saya akan lebih hati-hati lain kali." },
        ],
      },
    ],
  },
];
