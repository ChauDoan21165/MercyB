// src/languages/indonesian/extra/freelance-online-work.ts
//
// Indonesian freelance online work pack for Vietnamese learners.
// Covers: freelance, klien, deadline, revisi, invoice, portofolio, kerja remote,
// pembayaran, project scope, and polite client chat.
//
// Shape mirrors the sibling Indonesian extra files. This file is self-contained:
// it declares inline types and exports one uniquely named lesson array.
//
// Field convention: sentence `en` holds TARGET-LANGUAGE Indonesian; `vi` holds
// Vietnamese. `pronunciation_focus` carries Vietnamese-facing pronunciation and
// grammar notes, including L1 traps; `pronunciation_focus_en` is the English
// companion in the same order.

type LessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type Exercise = Record<string, unknown>;

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
};

export const freelanceOnlineWorkLessons: IndonesianLesson[] = [
  {
    id: "indonesian_freelance_client_scope",
    level: "B1",
    category: "work",
    title_vi: "Freelance online — khách hàng, portfolio và phạm vi việc",
    title_en: "Online freelance work — clients, portfolio and scope",
    sentences: [
      {
        en: "Saya bekerja freelance sebagai penulis konten.",
        vi: "Tôi làm freelance với vai trò người viết nội dung.",
        pronunciation_focus: [
          "bekerja freelance → làm việc tự do/freelance; trong nói chuyện cũng nghe `kerja freelance`.",
          "sebagai penulis konten → với vai trò người viết nội dung; `sebagai` = là/với tư cách.",
          "Lỗi người Việt: nói `saya freelance penulis`. Câu đầy đủ, chuyên nghiệp hơn là `Saya bekerja freelance sebagai ...`.",
        ],
        pronunciation_focus_en: [
          "bekerja freelance → work freelance; in casual speech you may also hear `kerja freelance`.",
          "sebagai penulis konten → as a content writer; `sebagai` = as/in the role of.",
          "VN-speaker trap: saying `saya freelance penulis`. The fuller professional sentence is `Saya bekerja freelance sebagai ...`.",
        ],
      },
      {
        en: "Boleh saya tahu kebutuhan klien secara detail?",
        vi: "Cho tôi biết chi tiết nhu cầu của khách hàng được không?",
        pronunciation_focus: [
          "boleh saya tahu ...? → mẫu hỏi lịch sự khi lấy brief.",
          "kebutuhan klien → nhu cầu của khách hàng; `klien` dùng trong dịch vụ/chuyên môn.",
          "secara detail → một cách chi tiết; `detail` là từ mượn phổ biến.",
        ],
        pronunciation_focus_en: [
          "boleh saya tahu ...? → polite frame for gathering a brief.",
          "kebutuhan klien → client's needs; `klien` is used in service/professional contexts.",
          "secara detail → in detail; `detail` is a common loanword.",
        ],
      },
      {
        en: "Saya bisa kirim portofolio lewat email atau WhatsApp.",
        vi: "Tôi có thể gửi portfolio qua email hoặc WhatsApp.",
        pronunciation_focus: [
          "kirim portofolio → gửi portfolio; từ này thường đọc por-to-FO-li-o.",
          "lewat email atau WhatsApp → qua email hoặc WhatsApp; `lewat` chỉ kênh gửi.",
          "Lỗi người Việt: dùng `di email`. Với kênh truyền/gửi, dùng `lewat email`.",
        ],
        pronunciation_focus_en: [
          "kirim portofolio → send a portfolio; often pronounced por-to-FO-li-o.",
          "lewat email atau WhatsApp → via email or WhatsApp; `lewat` marks the channel.",
          "VN-speaker trap: using `di email`. For a sending channel, use `lewat email`.",
        ],
      },
      {
        en: "Ruang lingkup pekerjaannya perlu jelas dari awal.",
        vi: "Phạm vi công việc cần rõ ràng ngay từ đầu.",
        pronunciation_focus: [
          "ruang lingkup pekerjaan → phạm vi công việc; cụm chuyên nghiệp khi nói scope.",
          "perlu jelas → cần rõ; tính từ đứng sau `jelas` không cần chia.",
          "dari awal → từ đầu; dùng khi tránh hiểu nhầm sau này.",
        ],
        pronunciation_focus_en: [
          "ruang lingkup pekerjaan → scope of work; professional wording for project scope.",
          "perlu jelas → needs to be clear; the adjective `jelas` does not conjugate.",
          "dari awal → from the beginning; useful for avoiding later misunderstanding.",
        ],
      },
      {
        en: "Deadline proyek ini kapan, ya?",
        vi: "Deadline dự án này là khi nào ạ?",
        pronunciation_focus: [
          "deadline proyek → hạn chót dự án; người Indonesia cũng hay dùng `tenggat waktu`.",
          "kapan, ya? → khi nào ạ; `ya` làm câu hỏi mềm hơn.",
          "Lỗi người Việt: hỏi cộc `deadline kapan?`. Thêm `proyek ini` và `ya` nghe lịch sự hơn.",
        ],
        pronunciation_focus_en: [
          "deadline proyek → project deadline; Indonesians also use `tenggat waktu`.",
          "kapan, ya? → when, please? `ya` softens the question.",
          "VN-speaker trap: blunt `deadline kapan?`. Adding `proyek ini` and `ya` sounds more polite.",
        ],
      },
    ],
    cultural_notes_vi:
      "Freelance online ở Indonesia thường diễn ra qua WhatsApp, email, marketplace jasa, LinkedIn, hoặc giới thiệu cá nhân. Từ tiếng Anh như `freelance`, `deadline`, `brief`, `revisi`, `invoice`, `remote`, `portofolio` rất phổ biến. Với khách mới, freelancer nên làm rõ `ruang lingkup pekerjaan`, deadline, jumlah revisi, DP, và cara pembayaran trước khi bắt đầu.",
    cultural_notes_en:
      "Online freelance work in Indonesia often happens through WhatsApp, email, service marketplaces, LinkedIn, or personal referrals. English loanwords such as `freelance`, `deadline`, `brief`, `revisi`, `invoice`, `remote`, and `portofolio` are common. With a new client, a freelancer should clarify the scope of work, deadline, revision count, deposit, and payment method before starting.",
    tip_advice_vi:
      "Mẹo cho người Việt: trong chat với klien, tránh `kamu`. Dùng `Kak` nếu thân thiện, hoặc `Bapak/Ibu` nếu trang trọng. Khung an toàn: `Boleh saya tahu ...?`, `Saya bisa kirim ...`, `Perlu jelas dari awal`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: in client chat, avoid `kamu`. Use `Kak` for friendly-neutral tone, or `Bapak/Ibu` for formal tone. Safe frames: `Boleh saya tahu ...?`, `Saya bisa kirim ...`, and `Perlu jelas dari awal`.",
    vocabulary: [
      {
        word: "freelance",
        en: "freelance",
        vi: "làm tự do / freelance",
        pos: "adjective / noun",
        pronunciation_vi: "FRI-lens",
        pronunciation_en: "FREE-lance",
      },
      {
        word: "klien",
        en: "client",
        vi: "khách hàng / client",
        pos: "noun",
        pronunciation_vi: "KLI-en",
        pronunciation_en: "KLEE-en",
      },
      {
        word: "portofolio",
        en: "portfolio",
        vi: "hồ sơ sản phẩm / portfolio",
        pos: "noun",
        pronunciation_vi: "por-to-FO-li-o",
        pronunciation_en: "por-to-FO-lee-o",
      },
      {
        word: "ruang lingkup pekerjaan",
        en: "scope of work",
        vi: "phạm vi công việc",
        pos: "noun phrase",
        pronunciation_vi: "RU-ang LING-kup pe-ker-JA-an",
        pronunciation_en: "ROO-ang LING-koop peh-ker-JA-an",
      },
      {
        word: "deadline",
        en: "deadline",
        vi: "hạn chót",
        pos: "noun",
        pronunciation_vi: "DED-lain",
        pronunciation_en: "DED-line",
      },
      {
        word: "brief",
        en: "project brief",
        vi: "bản mô tả yêu cầu",
        pos: "noun",
        pronunciation_vi: "brif",
        pronunciation_en: "brief",
      },
      {
        word: "kerja remote",
        en: "remote work",
        vi: "làm việc từ xa",
        pos: "noun phrase",
        pronunciation_vi: "KER-ja ri-MOT",
        pronunciation_en: "KER-ja ree-MOTE",
      },
    ],
    dialogue: [
      {
        speaker: "Klien",
        text: "Halo, Kak. Saya butuh penulis konten untuk website.",
        vi: "Chào bạn. Tôi cần người viết nội dung cho website.",
        en: "Hello. I need a content writer for a website.",
      },
      {
        speaker: "Freelancer",
        text: "Boleh saya tahu kebutuhan klien secara detail?",
        vi: "Cho tôi biết chi tiết nhu cầu của khách hàng được không?",
        en: "May I know the client's needs in detail?",
      },
      {
        speaker: "Klien",
        text: "Nanti saya kirim brief dan contoh referensi.",
        vi: "Lát nữa tôi gửi brief và ví dụ tham khảo.",
        en: "I will send the brief and reference examples later.",
      },
      {
        speaker: "Freelancer",
        text: "Baik. Saya juga bisa kirim portofolio lewat email.",
        vi: "Vâng. Tôi cũng có thể gửi portfolio qua email.",
        en: "Okay. I can also send my portfolio by email.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ freelance còn thiếu:",
        instruction_en: "Fill in the missing freelance word:",
        items: [
          {
            prompt: "Saya bekerja ___ sebagai penulis konten. (freelance)",
            answer: "freelance",
            options: ["freelance", "final", "formal"],
          },
          {
            prompt: "Boleh saya tahu kebutuhan ___ secara detail? (client)",
            answer: "klien",
            options: ["klien", "kelas", "kunci"],
          },
          {
            prompt: "Saya bisa kirim ___ lewat email. (portfolio)",
            answer: "portofolio",
            options: ["portofolio", "properti", "peraturan"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "deadline", answer: "hạn chót" },
          { prompt: "brief", answer: "bản mô tả yêu cầu" },
          { prompt: "kerja remote", answer: "làm việc từ xa" },
          { prompt: "ruang lingkup pekerjaan", answer: "phạm vi công việc" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi làm freelance với vai trò người viết nội dung.", answer: "Saya bekerja freelance sebagai penulis konten." },
          { prompt: "Tôi có thể gửi portfolio qua email hoặc WhatsApp.", answer: "Saya bisa kirim portofolio lewat email atau WhatsApp." },
          { prompt: "Phạm vi công việc cần rõ ràng ngay từ đầu.", answer: "Ruang lingkup pekerjaannya perlu jelas dari awal." },
        ],
      },
    ],
  },
  {
    id: "indonesian_freelance_revisions_invoice_payment",
    level: "B1",
    category: "work",
    title_vi: "Dự án freelance — sửa, invoice và thanh toán",
    title_en: "Freelance projects — revisions, invoice and payment",
    sentences: [
      {
        en: "Harga ini sudah termasuk dua kali revisi.",
        vi: "Giá này đã bao gồm hai lần chỉnh sửa.",
        pronunciation_focus: [
          "sudah termasuk → đã bao gồm; dùng khi chốt phạm vi dịch vụ.",
          "dua kali revisi → hai lần chỉnh sửa; `kali` = lần.",
          "Lỗi người Việt: không giới hạn số lần sửa. Trong freelance nên nói rõ `dua kali revisi`.",
        ],
        pronunciation_focus_en: [
          "sudah termasuk → already includes; used when confirming service scope.",
          "dua kali revisi → two rounds of revision; `kali` = times/rounds.",
          "VN-speaker trap: not limiting revision rounds. In freelance, state `dua kali revisi` clearly.",
        ],
      },
      {
        en: "Revisi tambahan akan dikenakan biaya.",
        vi: "Chỉnh sửa thêm sẽ bị tính phí.",
        pronunciation_focus: [
          "revisi tambahan → chỉnh sửa bổ sung/thêm.",
          "akan dikenakan biaya → sẽ bị tính phí; cụm bị động rất chuyên nghiệp.",
          "Lỗi người Việt: nói `harus bayar lagi` nghe hơi thô. `akan dikenakan biaya` mềm và rõ hơn.",
        ],
        pronunciation_focus_en: [
          "revisi tambahan → additional revision.",
          "akan dikenakan biaya → will be charged a fee; a professional passive phrase.",
          "VN-speaker trap: saying `harus bayar lagi`, which can sound blunt. `akan dikenakan biaya` is softer and clearer.",
        ],
      },
      {
        en: "Saya akan kirim invoice setelah pekerjaan selesai.",
        vi: "Tôi sẽ gửi invoice sau khi công việc hoàn thành.",
        pronunciation_focus: [
          "akan kirim invoice → sẽ gửi hóa đơn/invoice; trong freelance từ `invoice` rất phổ biến.",
          "setelah pekerjaan selesai → sau khi công việc xong.",
          "Lỗi người Việt: dùng `nota` cho mọi loại hóa đơn. Với khách online, `invoice` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "akan kirim invoice → will send an invoice; `invoice` is very common in freelance work.",
          "setelah pekerjaan selesai → after the work is finished.",
          "VN-speaker trap: using `nota` for every bill. With online clients, `invoice` is more natural.",
        ],
      },
      {
        en: "Pembayaran bisa lewat transfer bank atau e-wallet.",
        vi: "Thanh toán có thể qua chuyển khoản ngân hàng hoặc ví điện tử.",
        pronunciation_focus: [
          "pembayaran → việc thanh toán; gốc `bayar` + pe-...-an.",
          "lewat transfer bank → qua chuyển khoản ngân hàng; `lewat` chỉ kênh.",
          "e-wallet → ví điện tử; cũng nghe `dompet digital`.",
        ],
        pronunciation_focus_en: [
          "pembayaran → payment; root `bayar` + pe-...-an.",
          "lewat transfer bank → by bank transfer; `lewat` marks the channel.",
          "e-wallet → electronic wallet; people also say `dompet digital`.",
        ],
      },
      {
        en: "Mohon konfirmasi setelah pembayaran masuk.",
        vi: "Vui lòng xác nhận sau khi thanh toán vào tài khoản.",
        pronunciation_focus: [
          "mohon konfirmasi → vui lòng xác nhận; trang trọng và lịch sự.",
          "pembayaran masuk → tiền/thanh toán đã vào; tự nhiên trong ngữ cảnh tài khoản.",
          "Lỗi người Việt: dịch `tiền đến`. Tiếng Indonesia nói `pembayaran masuk`.",
        ],
        pronunciation_focus_en: [
          "mohon konfirmasi → please confirm; formal and polite.",
          "pembayaran masuk → payment has come in/been received; natural for accounts.",
          "VN-speaker trap: translating 'money arrived'. Indonesian says `pembayaran masuk`.",
        ],
      },
      {
        en: "Untuk kerja remote, komunikasi rutin sangat penting.",
        vi: "Đối với làm việc từ xa, giao tiếp đều đặn rất quan trọng.",
        pronunciation_focus: [
          "untuk kerja remote → đối với làm việc từ xa; `remote` là từ mượn phổ biến.",
          "komunikasi rutin → giao tiếp đều đặn; `rutin` = thường xuyên/định kỳ.",
          "sangat penting → rất quan trọng; tính từ không đổi theo chủ ngữ.",
        ],
        pronunciation_focus_en: [
          "untuk kerja remote → for remote work; `remote` is a common loanword.",
          "komunikasi rutin → regular communication; `rutin` = regular/routine.",
          "sangat penting → very important; adjectives do not change by subject.",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong freelance online ở Indonesia, cách nói rõ nhưng mềm rất quan trọng. Freelancer thường chốt `harga`, `deadline`, `jumlah revisi`, `DP`, `invoice`, và metode pembayaran qua chat. `Mohon` nghe lịch sự hơn `tolong` trong văn bản công việc. `Pembayaran masuk` nghĩa là tiền đã vào tài khoản hoặc ví điện tử, không phải chỉ khách nói đã chuyển.",
    cultural_notes_en:
      "In Indonesian online freelance work, clear but gentle wording matters. Freelancers often confirm price, deadline, revision count, deposit, invoice, and payment method by chat. `Mohon` sounds more formal than `tolong` in work messages. `Pembayaran masuk` means the payment has actually arrived in the account or e-wallet, not only that the client says they transferred it.",
    tip_advice_vi:
      "Mẹo cho người Việt: khi nói về tiền, dùng danh từ `pembayaran` thay vì chỉ `uang`. Khung chuyên nghiệp: `akan dikenakan biaya`, `saya akan kirim invoice`, `mohon konfirmasi setelah pembayaran masuk`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: when discussing money, use the noun `pembayaran` instead of only `uang`. Professional frames: `akan dikenakan biaya`, `saya akan kirim invoice`, and `mohon konfirmasi setelah pembayaran masuk`.",
    vocabulary: [
      {
        word: "revisi",
        en: "revision",
        vi: "chỉnh sửa",
        pos: "noun",
        pronunciation_vi: "re-VI-si",
        pronunciation_en: "reh-VEE-see",
      },
      {
        word: "revisi tambahan",
        en: "additional revision",
        vi: "chỉnh sửa thêm",
        pos: "noun phrase",
        pronunciation_vi: "re-VI-si tam-BA-han",
        pronunciation_en: "reh-VEE-see tam-BA-han",
      },
      {
        word: "dikenakan biaya",
        en: "to be charged a fee",
        vi: "bị tính phí",
        pos: "passive verb phrase",
        pronunciation_vi: "di-ke-NA-kan bi-A-ya",
        pronunciation_en: "dee-keh-NA-kan bee-A-ya",
      },
      {
        word: "invoice",
        en: "invoice",
        vi: "hóa đơn / invoice",
        pos: "noun",
        pronunciation_vi: "IN-vois",
        pronunciation_en: "IN-voice",
      },
      {
        word: "pembayaran",
        en: "payment",
        vi: "thanh toán",
        pos: "noun",
        pronunciation_vi: "pem-ba-YA-ran",
        pronunciation_en: "pem-ba-YA-ran",
      },
      {
        word: "transfer bank",
        en: "bank transfer",
        vi: "chuyển khoản ngân hàng",
        pos: "noun phrase",
        pronunciation_vi: "TRANS-fer bank",
        pronunciation_en: "TRANS-fer bank",
      },
      {
        word: "e-wallet",
        en: "e-wallet",
        vi: "ví điện tử",
        pos: "noun",
        pronunciation_vi: "i-WA-let",
        pronunciation_en: "EE-wallet",
      },
      {
        word: "pembayaran masuk",
        en: "payment received",
        vi: "thanh toán đã vào",
        pos: "phrase",
        pronunciation_vi: "pem-ba-YA-ran MA-suk",
        pronunciation_en: "pem-ba-YA-ran MA-sook",
      },
    ],
    dialogue: [
      {
        speaker: "Klien",
        text: "Kalau saya minta revisi lagi, apakah bisa?",
        vi: "Nếu tôi yêu cầu sửa thêm nữa thì có được không?",
        en: "If I ask for another revision, is that possible?",
      },
      {
        speaker: "Freelancer",
        text: "Bisa, Kak. Tapi revisi tambahan akan dikenakan biaya.",
        vi: "Được ạ. Nhưng chỉnh sửa thêm sẽ bị tính phí.",
        en: "Yes. But additional revisions will be charged.",
      },
      {
        speaker: "Klien",
        text: "Baik. Nanti invoice-nya dikirim setelah selesai, ya?",
        vi: "Vâng. Lát nữa invoice được gửi sau khi xong nhé?",
        en: "Okay. The invoice will be sent after it is finished, right?",
      },
      {
        speaker: "Freelancer",
        text: "Betul. Pembayaran bisa lewat transfer bank atau e-wallet.",
        vi: "Đúng vậy. Thanh toán có thể qua chuyển khoản ngân hàng hoặc ví điện tử.",
        en: "Correct. Payment can be by bank transfer or e-wallet.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ thanh toán freelance còn thiếu:",
        instruction_en: "Fill in the missing freelance-payment word:",
        items: [
          {
            prompt: "Harga ini sudah termasuk dua kali ___. (chỉnh sửa)",
            answer: "revisi",
            options: ["revisi", "referensi", "rekening"],
          },
          {
            prompt: "Saya akan kirim ___ setelah pekerjaan selesai. (invoice)",
            answer: "invoice",
            options: ["invoice", "izin", "iklan"],
          },
          {
            prompt: "Pembayaran bisa lewat transfer bank atau ___. (ví điện tử)",
            answer: "e-wallet",
            options: ["e-wallet", "e-KTP", "email"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "revisi tambahan", answer: "chỉnh sửa thêm" },
          { prompt: "dikenakan biaya", answer: "bị tính phí" },
          { prompt: "pembayaran", answer: "thanh toán" },
          { prompt: "pembayaran masuk", answer: "thanh toán đã vào" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Chỉnh sửa thêm sẽ bị tính phí.", answer: "Revisi tambahan akan dikenakan biaya." },
          { prompt: "Thanh toán có thể qua chuyển khoản ngân hàng hoặc ví điện tử.", answer: "Pembayaran bisa lewat transfer bank atau e-wallet." },
          { prompt: "Vui lòng xác nhận sau khi thanh toán vào tài khoản.", answer: "Mohon konfirmasi setelah pembayaran masuk." },
        ],
      },
    ],
  },
];
