// Advanced reporting problems Indonesian lesson pack for Vietnamese learners.
//
// Self-contained extra lesson file following the established Indonesian format.
// The `en` field holds TARGET-LANGUAGE Indonesian; `vi` holds the Vietnamese
// gloss. Pronunciation notes include Vietnamese L1 traps plus English companions.

type LessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type Exercise = Record<string, any>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: VocabEntry[];
  dialogue?: DialogueLine[];
  exercises?: Exercise[];
  content?: string;
};

export const advancedReportingProblemsLessons: IndonesianLesson[] = [
  {
    id: "indonesian_reporting_problem_kronologi_evidence",
    level: "B2",
    category: "public_services",
    title_vi: "Báo cáo vấn đề: kronologi và bukti",
    title_en: "Reporting a problem: chronology and evidence",
    sentences: [
      {
        en: "Saya ingin melaporkan masalah ini secara resmi.",
        vi: "Tôi muốn báo cáo vấn đề này một cách chính thức.",
        pronunciation_focus: [
          "SA-ya I-ngin me-la-POR-kan ma-SA-lah I-ni se-CA-ra res-MI.",
          "`melaporkan masalah` = báo cáo vấn đề; `secara resmi` = một cách chính thức.",
          "L1 Việt: `lapor` nghe ngắn và khẩu ngữ; trong báo cáo chính thức dùng động từ đầy đủ `melaporkan`.",
        ],
        pronunciation_focus_en: [
          "SA-ya I-ngin me-la-POR-kan ma-SA-lah EE-ni se-CHA-ra res-MEE.",
          "`melaporkan masalah` = report a problem; `secara resmi` = officially/formally.",
          "VN-speaker trap: `lapor` sounds short and spoken; for a formal report, use the full verb `melaporkan`.",
        ],
      },
      {
        en: "Kronologinya dimulai pada hari Senin pagi.",
        vi: "Diễn biến sự việc bắt đầu vào sáng thứ Hai.",
        pronunciation_focus: [
          "kro-no-LO-gi-nya di-MU-lai PA-da HA-ri se-NIN PA-gi.",
          "`kronologi` = diễn biến theo thứ tự thời gian; `dimulai pada` = bắt đầu vào.",
          "L1 Việt: đừng chỉ nói `cerita`. Khi làm báo cáo, `kronologi` nghe rõ ràng và đúng văn cảnh hơn.",
        ],
        pronunciation_focus_en: [
          "kro-no-LO-gi-nya di-MOO-lai PA-da HA-ri se-NEEN PA-gi.",
          "`kronologi` = timeline/chronology of events; `dimulai pada` = started on/at.",
          "VN-speaker note: do not just say `cerita`. In a report, `kronologi` sounds clearer and more appropriate.",
        ],
      },
      {
        en: "Saya sudah melampirkan bukti foto dan tangkapan layar.",
        vi: "Tôi đã đính kèm bằng chứng là ảnh và ảnh chụp màn hình.",
        pronunciation_focus: [
          "SA-ya SU-dah me-lam-PIR-kan BUK-ti FO-to dan tang-KAP-an LA-yar.",
          "`melampirkan` = đính kèm; `bukti foto` = bằng chứng hình ảnh; `tangkapan layar` = ảnh chụp màn hình.",
          "L1 Việt: `bukti` là danh từ, không thêm kiểu `buktian`. Nói `melampirkan bukti`, không phải `menempel bukti` trong email/form.",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah me-lam-PEER-kan BOOK-ti FO-to dan tang-KAP-an LA-yar.",
          "`melampirkan` = attach; `bukti foto` = photo evidence; `tangkapan layar` = screenshot.",
          "VN-speaker trap: `bukti` is already a noun; do not create `buktian`. Say `melampirkan bukti`, not `menempel bukti` in an email/form.",
        ],
      },
      {
        en: "Ada dua saksi yang melihat kejadian tersebut.",
        vi: "Có hai nhân chứng đã nhìn thấy sự việc đó.",
        pronunciation_focus: [
          "A-da DU-a SAK-si yang me-LI-hat ke-JA-di-an ter-SE-but.",
          "`saksi` = nhân chứng; `kejadian tersebut` = sự việc đó, văn phong trang trọng.",
          "L1 Việt: `tersebut` không phải để nói chuyện thân mật; nó hợp với đơn, email khiếu nại, hoặc báo cáo.",
        ],
        pronunciation_focus_en: [
          "A-da DOO-a SAK-si yang me-LEE-hat ke-JA-di-an ter-SE-but.",
          "`saksi` = witness; `kejadian tersebut` = that incident, in a formal register.",
          "VN-speaker note: `tersebut` is not casual chat style; it fits forms, complaint emails, or reports.",
        ],
      },
      {
        en: "Mohon catat nomor laporan untuk tindak lanjut.",
        vi: "Xin hãy ghi số báo cáo để tiện theo dõi xử lý.",
        pronunciation_focus: [
          "MO-hon CA-tat NO-mor la-PO-ran UN-tuk TIN-dak LAN-jut.",
          "`nomor laporan` = số báo cáo/mã vụ việc; `tindak lanjut` = bước xử lý tiếp theo.",
          "L1 Việt: khi hỏi mã hồ sơ, dùng `nomor laporan`, không hỏi mơ hồ `nomor saya`.",
        ],
        pronunciation_focus_en: [
          "MO-hon CHA-tat NO-mor la-PO-ran OON-tuk TIN-dak LAN-jut.",
          "`nomor laporan` = report/reference number; `tindak lanjut` = follow-up action.",
          "VN-speaker trap: when asking for a case reference, use `nomor laporan`, not vague `nomor saya`.",
        ],
      },
      {
        en: "Berdasarkan bukti ini, masalahnya terjadi sebelum barang diterima.",
        vi: "Dựa trên bằng chứng này, vấn đề xảy ra trước khi hàng được nhận.",
        pronunciation_focus: [
          "ber-DA-sar-kan BUK-ti I-ni, ma-SA-lah-nya ter-JA-di se-BE-lum BA-rang di-te-RI-ma.",
          "`berdasarkan bukti` = dựa trên bằng chứng; `sebelum barang diterima` = trước khi hàng được nhận.",
          "L1 Việt: khi chưa chắc thủ phạm, dùng khung trung tính `berdasarkan bukti`, tránh câu buộc tội quá trực tiếp.",
        ],
        pronunciation_focus_en: [
          "ber-DA-sar-kan BOOK-ti EE-ni, ma-SA-lah-nya ter-JA-di se-BE-lum BA-rang di-te-REE-ma.",
          "`berdasarkan bukti` = based on evidence; `sebelum barang diterima` = before the item was received.",
          "VN-speaker note: when responsibility is not proven, use neutral framing like `berdasarkan bukti` and avoid direct accusation.",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi melaporkan masalah di Indonesia, gaya yang paling aman là lịch sự, cụ thể, và có trình tự: waktu, tempat, kronologi, bukti, saksi, lalu yêu cầu tindak lanjut. Trong email hoặc form, câu như `Berdasarkan bukti...` và `Mohon catat nomor laporan...` giúp giọng điệu rõ nhưng không quá gay gắt.",
    cultural_notes_en:
      "When reporting a problem in Indonesia, the safest tone is polite, specific, and ordered: time, place, chronology, evidence, witnesses, then the requested follow-up. In emails or forms, phrases like `Berdasarkan bukti...` and `Mohon catat nomor laporan...` keep the message clear without sounding overly aggressive.",
    tip_advice_vi:
      "Khung nhớ nhanh: `Saya ingin melaporkan masalah` -> `Kronologinya...` -> `Saya melampirkan bukti` -> `Ada saksi` -> `Mohon nomor laporan`. Người Việt nên tránh dịch từng chữ từ `bằng chứng ảnh` thành cấu trúc lạ; nói tự nhiên là `bukti foto` hoặc `foto sebagai bukti`.",
    tip_advice_en:
      "Fast frame to memorize: `Saya ingin melaporkan masalah` -> `Kronologinya...` -> `Saya melampirkan bukti` -> `Ada saksi` -> `Mohon nomor laporan`. Vietnamese speakers should avoid literal phrasing for 'photo proof'; natural Indonesian is `bukti foto` or `foto sebagai bukti`.",
    vocabulary: [
      {
        word: "melaporkan masalah",
        en: "to report a problem",
        vi: "báo cáo vấn đề",
        pos: "verb phrase",
        pronunciation_vi: "me-la-POR-kan ma-SA-lah",
        pronunciation_en: "me-la-POR-kan ma-SA-lah",
      },
      {
        word: "kronologi",
        en: "chronology / timeline of events",
        vi: "diễn biến theo thời gian",
        pos: "noun",
        pronunciation_vi: "kro-no-LO-gi",
        pronunciation_en: "kro-no-LO-gi",
      },
      {
        word: "bukti foto",
        en: "photo evidence",
        vi: "bằng chứng hình ảnh",
        pos: "noun phrase",
        pronunciation_vi: "BUK-ti FO-to",
        pronunciation_en: "BOOK-ti FO-to",
      },
      {
        word: "tangkapan layar",
        en: "screenshot",
        vi: "ảnh chụp màn hình",
        pos: "noun phrase",
        pronunciation_vi: "tang-KAP-an LA-yar",
        pronunciation_en: "tang-KAP-an LA-yar",
      },
      {
        word: "saksi",
        en: "witness",
        vi: "nhân chứng",
        pos: "noun",
        pronunciation_vi: "SAK-si",
        pronunciation_en: "SAK-si",
      },
      {
        word: "nomor laporan",
        en: "report number",
        vi: "số báo cáo / mã vụ việc",
        pos: "noun phrase",
        pronunciation_vi: "NO-mor la-PO-ran",
        pronunciation_en: "NO-mor la-PO-ran",
      },
    ],
    dialogue: [
      {
        speaker: "Pelapor",
        text: "Selamat pagi. Saya ingin melaporkan masalah ini secara resmi.",
        vi: "Chào buổi sáng. Tôi muốn báo cáo vấn đề này một cách chính thức.",
        en: "Good morning. I would like to report this problem formally.",
      },
      {
        speaker: "Petugas",
        text: "Baik. Bisa jelaskan kronologinya dari awal?",
        vi: "Vâng. Anh/chị có thể giải thích diễn biến từ đầu không?",
        en: "Okay. Can you explain the chronology from the beginning?",
      },
      {
        speaker: "Pelapor",
        text: "Saya sudah melampirkan bukti foto dan ada dua saksi.",
        vi: "Tôi đã đính kèm bằng chứng hình ảnh và có hai nhân chứng.",
        en: "I have attached photo evidence and there are two witnesses.",
      },
      {
        speaker: "Petugas",
        text: "Terima kasih. Kami catat nomor laporan untuk tindak lanjut.",
        vi: "Cảm ơn. Chúng tôi ghi số báo cáo để theo dõi xử lý.",
        en: "Thank you. We will record the report number for follow-up.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ phù hợp để báo cáo vấn đề:",
        instruction_en: "Fill in the suitable problem-reporting word:",
        items: [
          {
            prompt: "Saya ingin ___ masalah ini secara resmi. (báo cáo)",
            answer: "melaporkan",
            options: ["melaporkan", "melupakan", "melompatkan"],
          },
          {
            prompt: "Saya sudah melampirkan ___ foto. (bằng chứng)",
            answer: "bukti",
            options: ["bukti", "buka", "buku"],
          },
          {
            prompt: "Ada dua ___ yang melihat kejadian tersebut. (nhân chứng)",
            answer: "saksi",
            options: ["saksi", "sakit", "saku"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          {
            prompt: "Tôi muốn báo cáo vấn đề này một cách chính thức.",
            answer: "Saya ingin melaporkan masalah ini secara resmi.",
          },
          {
            prompt: "Diễn biến bắt đầu vào sáng thứ Hai.",
            answer: "Kronologinya dimulai pada hari Senin pagi.",
          },
          {
            prompt: "Xin hãy ghi số báo cáo để theo dõi xử lý.",
            answer: "Mohon catat nomor laporan untuk tindak lanjut.",
          },
        ],
      },
    ],
  },
  {
    id: "indonesian_escalation_follow_up_solution",
    level: "B2",
    category: "public_services",
    title_vi: "Eskalasi, tindak lanjut và yêu cầu solusi",
    title_en: "Escalation, follow-up, and requesting a solution",
    sentences: [
      {
        en: "Saya sudah menunggu tindak lanjut selama tiga hari kerja.",
        vi: "Tôi đã chờ bước xử lý tiếp theo trong ba ngày làm việc.",
        pronunciation_focus: [
          "SA-ya SU-dah me-NUNG-gu TIN-dak LAN-jut se-LA-ma TI-ga HA-ri KER-ja.",
          "`selama tiga hari kerja` = trong ba ngày làm việc; `tindak lanjut` = xử lý tiếp theo.",
          "L1 Việt: `selama` dùng cho khoảng thời gian; đừng thay bằng `dalam` nếu muốn nhấn mạnh đã chờ bao lâu.",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah me-NOONG-goo TIN-dak LAN-jut se-LA-ma TEE-ga HA-ri KER-ja.",
          "`selama tiga hari kerja` = for three business days; `tindak lanjut` = follow-up action.",
          "VN-speaker note: `selama` marks duration; do not replace it with `dalam` when emphasizing how long you have waited.",
        ],
      },
      {
        en: "Jika belum ada respons, saya ingin meminta eskalasi ke supervisor.",
        vi: "Nếu vẫn chưa có phản hồi, tôi muốn yêu cầu chuyển lên supervisor.",
        pronunciation_focus: [
          "JI-ka be-LUM A-da res-PONS, SA-ya I-ngin me-MIN-ta es-ka-LA-si ke SU-per-vai-zor.",
          "`respons` = phản hồi; `eskalasi ke supervisor` = chuyển cấp lên supervisor.",
          "L1 Việt: `eskalasi` là từ mượn trong dịch vụ/CS; dùng với `ke`, ví dụ `eskalasi ke supervisor`.",
        ],
        pronunciation_focus_en: [
          "JI-ka be-LOOM A-da res-PONS, SA-ya I-ngin me-MIN-ta es-ka-LA-si ke SOO-per-vai-zor.",
          "`respons` = response; `eskalasi ke supervisor` = escalation to a supervisor.",
          "VN-speaker note: `eskalasi` is a service/customer-support loanword; use it with `ke`, as in `eskalasi ke supervisor`.",
        ],
      },
      {
        en: "Mohon jelaskan langkah penyelesaian yang akan dilakukan.",
        vi: "Xin hãy giải thích các bước xử lý sẽ được thực hiện.",
        pronunciation_focus: [
          "MO-hon je-LAS-kan LANG-kah pe-nye-le-SAI-an yang A-kan di-LA-ku-kan.",
          "`langkah penyelesaian` = bước giải quyết; `yang akan dilakukan` = sẽ được thực hiện.",
          "L1 Việt: `penyelesaian` trang trọng hơn `solusi` khi hỏi quy trình xử lý cụ thể.",
        ],
        pronunciation_focus_en: [
          "MO-hon je-LAS-kan LANG-kah pe-nye-le-SAI-an yang A-kan di-LA-ku-kan.",
          "`langkah penyelesaian` = resolution steps; `yang akan dilakukan` = that will be carried out.",
          "VN-speaker note: `penyelesaian` is more formal than `solusi` when asking for a concrete resolution process.",
        ],
      },
      {
        en: "Saya berharap ada solusi yang jelas dan adil.",
        vi: "Tôi hy vọng có một giải pháp rõ ràng và công bằng.",
        pronunciation_focus: [
          "SA-ya ber-HA-rap A-da so-LU-si yang JE-las dan A-dil.",
          "`solusi yang jelas dan adil` = giải pháp rõ ràng và công bằng.",
          "L1 Việt: `adil` là công bằng; đừng dùng `sama rata` nếu ý là xử lý đúng/đáng.",
        ],
        pronunciation_focus_en: [
          "SA-ya ber-HA-rap A-da so-LOO-si yang JE-las dan A-dil.",
          "`solusi yang jelas dan adil` = a clear and fair solution.",
          "VN-speaker trap: `adil` means fair; do not use `sama rata` when you mean proper/fair handling.",
        ],
      },
      {
        en: "Tolong kirim pembaruan melalui email agar ada catatan tertulis.",
        vi: "Làm ơn gửi cập nhật qua email để có ghi chép bằng văn bản.",
        pronunciation_focus: [
          "TO-long KI-rim pem-ba-RU-an me-LA-lui I-mel A-gar A-da ca-TA-tan ter-TU-lis.",
          "`pembaruan` = cập nhật; `melalui email` = qua email; `catatan tertulis` = ghi chép bằng văn bản.",
          "L1 Việt: `melalui` trang trọng hơn `lewat`; trong hồ sơ/khiếu nại, email giúp có `catatan tertulis`.",
        ],
        pronunciation_focus_en: [
          "TO-long KI-rim pem-ba-ROO-an me-LA-lui EE-mail A-gar A-da cha-TA-tan ter-TOO-lis.",
          "`pembaruan` = update; `melalui email` = via email; `catatan tertulis` = written record.",
          "VN-speaker note: `melalui` is more formal than `lewat`; in complaints, email gives you a `catatan tertulis`.",
        ],
      },
      {
        en: "Apakah laporan saya sudah diteruskan ke bagian terkait?",
        vi: "Báo cáo của tôi đã được chuyển đến bộ phận liên quan chưa?",
        pronunciation_focus: [
          "A-pa-kah la-PO-ran SA-ya SU-dah di-te-RUS-kan ke BA-gi-an ter-KA-it.",
          "`diteruskan ke bagian terkait` = được chuyển đến bộ phận liên quan.",
          "L1 Việt: `terkait` = liên quan; cụm `bagian terkait` rất tự nhiên trong văn phòng và dịch vụ.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah la-PO-ran SA-ya SOO-dah di-te-ROOS-kan ke BA-gi-an ter-KA-it.",
          "`diteruskan ke bagian terkait` = forwarded to the relevant department.",
          "VN-speaker note: `terkait` = related/relevant; `bagian terkait` is very natural in office and service contexts.",
        ],
      },
    ],
    cultural_notes_vi:
      "Eskalasi ở Indonesia thường hiệu quả hơn khi bạn giữ câu chữ bình tĩnh: nêu nomor laporan, nhắc thời gian đã chờ, hỏi tindak lanjut, rồi mới meminta eskalasi. Nếu cần bằng chứng sau này, xin pembaruan melalui email để có catatan tertulis thay vì chỉ gọi điện.",
    cultural_notes_en:
      "Escalation in Indonesia is usually more effective when the wording stays calm: mention the report number, state how long you have waited, ask for follow-up, then request escalation. If you may need evidence later, ask for updates via email so there is a written record instead of only a phone call.",
    tip_advice_vi:
      "Mẫu nâng cấp lịch sự: `Saya sudah menunggu...`, `Mohon jelaskan langkah penyelesaian...`, `Jika belum ada respons, saya ingin meminta eskalasi...`. Tránh mở đầu bằng câu buộc tội; hãy đưa nomor laporan và bukti trước.",
    tip_advice_en:
      "Polite escalation template: `Saya sudah menunggu...`, `Mohon jelaskan langkah penyelesaian...`, `Jika belum ada respons, saya ingin meminta eskalasi...`. Avoid opening with an accusation; provide the report number and evidence first.",
    vocabulary: [
      {
        word: "tindak lanjut",
        en: "follow-up action",
        vi: "xử lý tiếp theo",
        pos: "noun phrase",
        pronunciation_vi: "TIN-dak LAN-jut",
        pronunciation_en: "TIN-dak LAN-jut",
      },
      {
        word: "respons",
        en: "response",
        vi: "phản hồi",
        pos: "noun",
        pronunciation_vi: "res-PONS",
        pronunciation_en: "res-PONS",
      },
      {
        word: "eskalasi",
        en: "escalation",
        vi: "chuyển cấp / leo thang xử lý",
        pos: "noun",
        pronunciation_vi: "es-ka-LA-si",
        pronunciation_en: "es-ka-LA-see",
      },
      {
        word: "langkah penyelesaian",
        en: "resolution steps",
        vi: "các bước giải quyết",
        pos: "noun phrase",
        pronunciation_vi: "LANG-kah pe-nye-le-SAI-an",
        pronunciation_en: "LANG-kah pe-nye-le-SAI-an",
      },
      {
        word: "pembaruan",
        en: "update",
        vi: "cập nhật",
        pos: "noun",
        pronunciation_vi: "pem-ba-RU-an",
        pronunciation_en: "pem-ba-ROO-an",
      },
      {
        word: "bagian terkait",
        en: "relevant department",
        vi: "bộ phận liên quan",
        pos: "noun phrase",
        pronunciation_vi: "BA-gi-an ter-KA-it",
        pronunciation_en: "BA-gi-an ter-KA-it",
      },
    ],
    dialogue: [
      {
        speaker: "Pelapor",
        text: "Nomor laporan saya 2418. Saya sudah menunggu tindak lanjut selama tiga hari kerja.",
        vi: "Số báo cáo của tôi là 2418. Tôi đã chờ xử lý tiếp theo trong ba ngày làm việc.",
        en: "My report number is 2418. I have waited for follow-up for three business days.",
      },
      {
        speaker: "Layanan Pelanggan",
        text: "Mohon tunggu sebentar. Saya cek status laporan Bapak.",
        vi: "Xin chờ một lát. Tôi kiểm tra trạng thái báo cáo của anh/chú.",
        en: "Please wait a moment. I will check the status of your report.",
      },
      {
        speaker: "Pelapor",
        text: "Jika belum ada respons, saya ingin meminta eskalasi ke supervisor.",
        vi: "Nếu vẫn chưa có phản hồi, tôi muốn yêu cầu chuyển lên supervisor.",
        en: "If there is still no response, I would like to request escalation to a supervisor.",
      },
      {
        speaker: "Layanan Pelanggan",
        text: "Baik, laporan akan kami teruskan ke bagian terkait dan pembaruan dikirim melalui email.",
        vi: "Vâng, chúng tôi sẽ chuyển báo cáo đến bộ phận liên quan và gửi cập nhật qua email.",
        en: "Okay, we will forward the report to the relevant department and send updates via email.",
      },
    ],
    exercises: [
      {
        type: "multiple_choice",
        instruction_vi: "Chọn câu lịch sự nhất để yêu cầu eskalasi:",
        instruction_en: "Choose the politest sentence for requesting escalation:",
        items: [
          {
            prompt: "Bạn đã chờ 3 ngày và muốn chuyển lên supervisor.",
            answer: "Jika belum ada respons, saya ingin meminta eskalasi ke supervisor.",
            options: [
              "Jika belum ada respons, saya ingin meminta eskalasi ke supervisor.",
              "Kalian lambat sekali, panggil bos sekarang.",
              "Saya marah, cepat urus ini.",
            ],
          },
          {
            prompt: "Bạn muốn biết các bước xử lý.",
            answer: "Mohon jelaskan langkah penyelesaian yang akan dilakukan.",
            options: [
              "Mohon jelaskan langkah penyelesaian yang akan dilakukan.",
              "Apa ini selesai atau tidak?",
              "Saya tidak mau dengar alasan.",
            ],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          {
            prompt: "Tôi đã chờ xử lý tiếp theo trong ba ngày làm việc.",
            answer: "Saya sudah menunggu tindak lanjut selama tiga hari kerja.",
          },
          {
            prompt: "Tôi hy vọng có một giải pháp rõ ràng và công bằng.",
            answer: "Saya berharap ada solusi yang jelas dan adil.",
          },
          {
            prompt: "Làm ơn gửi cập nhật qua email.",
            answer: "Tolong kirim pembaruan melalui email.",
          },
        ],
      },
    ],
  },
];
