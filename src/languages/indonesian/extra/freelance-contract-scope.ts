// Freelance Contract & Scope Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file following the established Indonesian extra
// format. The `en` field holds TARGET-LANGUAGE Indonesian, `vi` holds the
// Vietnamese gloss, and pronunciation_focus carries Vietnamese L1 notes with
// English companion explanations in the same order.

type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar/culture notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

type IndonesianVocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type IndonesianDialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type IndonesianExercise = Record<string, unknown>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
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

export const freelanceContractScopeLessons: IndonesianLesson[] = [
  {
    id: "indonesian_freelance_contract_scope",
    level: "B1",
    category: "work_business",
    title_vi: "Hợp đồng freelance: phạm vi việc, chỉnh sửa và thanh toán",
    title_en: "Freelance contracts: scope, revisions and payment terms",
    sentences: [
      {
        en: "Sebelum mulai, kita perlu menandatangani kontrak freelance.",
        vi: "Trước khi bắt đầu, chúng ta cần ký hợp đồng freelance.",
        pronunciation_focus: [
          "`kontrak freelance` = hợp đồng freelance; từ `freelance` thường dùng nguyên tiếng Anh.",
          "`menandatangani` = ký; gốc `tanda tangan` nhưng động từ chính thức là `menandatangani`.",
          "Lỗi người Việt: dịch 'ký tên' thành `tulis nama`. Ký hợp đồng là `menandatangani kontrak`.",
        ],
        pronunciation_focus_en: [
          "`kontrak freelance` means freelance contract; `freelance` is commonly used as an English loanword.",
          "`menandatangani` means to sign; the root is `tanda tangan`, but the formal verb is `menandatangani`.",
          "VN-speaker trap: translating 'sign name' as `tulis nama`. Signing a contract is `menandatangani kontrak`.",
        ],
      },
      {
        en: "Ruang lingkup kerja harus ditulis dengan jelas.",
        vi: "Phạm vi công việc phải được viết rõ ràng.",
        pronunciation_focus: [
          "`ruang lingkup kerja` = phạm vi công việc; cụm chuyên nghiệp cho project scope.",
          "`ditulis dengan jelas` = được viết rõ ràng; bị động `di-` hợp với điều khoản hợp đồng.",
          "Lỗi người Việt: nói `scope kerja` ai cũng hiểu trong chat, nhưng văn bản nên dùng `ruang lingkup kerja`.",
        ],
        pronunciation_focus_en: [
          "`ruang lingkup kerja` means scope of work, a professional phrase for project scope.",
          "`ditulis dengan jelas` means written clearly; passive `di-` fits contract clauses.",
          "VN-speaker note: `scope kerja` is understood in chat, but written terms should use `ruang lingkup kerja`.",
        ],
      },
      {
        en: "Harga ini sudah termasuk dua kali revisi kecil.",
        vi: "Giá này đã bao gồm hai lần chỉnh sửa nhỏ.",
        pronunciation_focus: [
          "`sudah termasuk` = đã bao gồm; rất quan trọng khi nói giá và deliverable.",
          "`dua kali revisi kecil` = hai lần chỉnh sửa nhỏ; giới hạn revisi giúp tránh sửa vô hạn.",
          "Lỗi người Việt: bỏ giới hạn revisi. Trong hợp đồng freelance nên ghi rõ jumlah revisi.",
        ],
        pronunciation_focus_en: [
          "`sudah termasuk` means already includes, important for price and deliverables.",
          "`dua kali revisi kecil` means two small revisions; revision limits help avoid endless edits.",
          "VN-speaker trap: leaving revision limits unstated. In a freelance contract, specify `jumlah revisi`.",
        ],
      },
      {
        en: "Revisi besar di luar ruang lingkup akan dikenakan biaya tambahan.",
        vi: "Chỉnh sửa lớn ngoài phạm vi sẽ bị tính phí bổ sung.",
        pronunciation_focus: [
          "`di luar ruang lingkup` = ngoài phạm vi; phrase kunci untuk scope creep.",
          "`dikenakan biaya tambahan` = bị/được tính phí thêm; cách nói formal cho invoice.",
          "Lỗi người Việt: nói `tambah uang` quá khẩu ngữ. Dùng `biaya tambahan` trong kontrak.",
        ],
        pronunciation_focus_en: [
          "`di luar ruang lingkup` means outside the scope, a key phrase for scope creep.",
          "`dikenakan biaya tambahan` means charged an additional fee, formal invoice language.",
          "VN-speaker trap: saying `tambah uang`, which is too casual. Use `biaya tambahan` in contracts.",
        ],
      },
      {
        en: "Saya minta DP tiga puluh persen sebelum pekerjaan dimulai.",
        vi: "Tôi xin đặt cọc ba mươi phần trăm trước khi công việc bắt đầu.",
        pronunciation_focus: [
          "`DP` đọc de-pe, nghĩa là uang muka/down payment.",
          "`sebelum pekerjaan dimulai` = trước khi công việc được bắt đầu; bị động nghe hợp văn bản.",
          "Lỗi người Việt: dùng `deposit` cho mọi khoản cọc. Freelance Indonesia thường nói `DP` hoặc `uang muka`.",
        ],
        pronunciation_focus_en: [
          "`DP` is pronounced de-pe and means down payment.",
          "`sebelum pekerjaan dimulai` means before the work starts; passive wording suits written terms.",
          "VN-speaker note: `deposit` is not always the best word. Indonesian freelancers often say `DP` or `uang muka`.",
        ],
      },
      {
        en: "Termin pembayaran kedua dilakukan setelah draf pertama disetujui.",
        vi: "Đợt thanh toán thứ hai được thực hiện sau khi bản nháp đầu tiên được duyệt.",
        pronunciation_focus: [
          "`termin pembayaran` = đợt/kỳ thanh toán; rất dùng trong proyek.",
          "`draf pertama disetujui` = bản nháp đầu được duyệt; `disetujui` bị động từ `setuju`.",
          "Lỗi người Việt: dùng `tahap bayar` được hiểu, nhưng cụm kinh doanh chuẩn hơn là `termin pembayaran`.",
        ],
        pronunciation_focus_en: [
          "`termin pembayaran` means payment milestone/installment, common in projects.",
          "`draf pertama disetujui` means the first draft is approved; `disetujui` is passive from `setuju`.",
          "VN-speaker note: `tahap bayar` may be understood, but the business phrase is `termin pembayaran`.",
        ],
      },
      {
        en: "Deadline final adalah tanggal lima belas bulan depan.",
        vi: "Deadline cuối cùng là ngày mười lăm tháng sau.",
        pronunciation_focus: [
          "`deadline final` = hạn chót cuối; cũng có thể nói `tenggat akhir`.",
          "`tanggal lima belas bulan depan` = ngày 15 tháng sau; hỏi ngày dùng `tanggal berapa?`.",
          "Lỗi người Việt: lẫn `hari` và `tanggal`. Hạn theo ngày trong tháng dùng `tanggal`.",
        ],
        pronunciation_focus_en: [
          "`deadline final` means final deadline; `tenggat akhir` is also possible.",
          "`tanggal lima belas bulan depan` means the 15th of next month; ask calendar dates with `tanggal berapa?`.",
          "VN-speaker trap: mixing `hari` and `tanggal`. A calendar deadline uses `tanggal`.",
        ],
      },
      {
        en: "Hak cipta berpindah ke klien setelah pembayaran lunas.",
        vi: "Bản quyền chuyển sang khách hàng sau khi thanh toán đầy đủ.",
        pronunciation_focus: [
          "`hak cipta` = bản quyền; cụm quan trọng với desain, tulisan, musik, software.",
          "`pembayaran lunas` = thanh toán đủ/hết; `lunas` rất dùng trong hóa đơn.",
          "Lỗi người Việt: nói `hak copy`. Từ đúng là `hak cipta`.",
        ],
        pronunciation_focus_en: [
          "`hak cipta` means copyright, important for design, writing, music, and software.",
          "`pembayaran lunas` means fully paid; `lunas` is common in invoices.",
          "VN-speaker trap: saying `hak copy`. The correct term is `hak cipta`.",
        ],
      },
      {
        en: "Jika proyek dibatalkan oleh klien, DP tidak dapat dikembalikan.",
        vi: "Nếu dự án bị khách hàng hủy, tiền đặt cọc không thể được hoàn lại.",
        pronunciation_focus: [
          "`dibatalkan oleh klien` = bị khách hàng hủy; formal passive contract wording.",
          "`tidak dapat dikembalikan` = không thể được hoàn lại; trang trọng hơn `tidak bisa balik`.",
          "Lỗi người Việt: dịch `return money` thành `uang balik`. Hoàn tiền trong văn bản là `dikembalikan`.",
        ],
        pronunciation_focus_en: [
          "`dibatalkan oleh klien` means cancelled by the client; formal passive contract wording.",
          "`tidak dapat dikembalikan` means cannot be returned/refunded, more formal than `tidak bisa balik`.",
          "VN-speaker trap: translating 'money back' as `uang balik`. In documents, refund/return is `dikembalikan`.",
        ],
      },
      {
        en: "Mohon konfirmasi semua ketentuan sebelum proyek berjalan.",
        vi: "Xin xác nhận tất cả điều khoản trước khi dự án tiến hành.",
        pronunciation_focus: [
          "`ketentuan` = điều khoản/quy định; dùng trong kontrak và S&K.",
          "`proyek berjalan` = dự án chạy/tiến hành; tự nhiên trong công việc.",
          "Lỗi người Việt: dùng `aturan` cho mọi thứ. Trong hợp đồng, `ketentuan` nghe chuyên nghiệp hơn.",
        ],
        pronunciation_focus_en: [
          "`ketentuan` means terms/conditions, used in contracts and T&C.",
          "`proyek berjalan` means the project proceeds/runs, natural in work contexts.",
          "VN-speaker note: `aturan` works for rules, but in contracts `ketentuan` sounds more professional.",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong freelance ở Indonesia, nhiều giao dịch bắt đầu qua WhatsApp nhưng nên được xác nhận bằng kontrak, email, hoặc dokumen tertulis. Các điểm cần ghi rõ: ruang lingkup kerja, deliverable, jumlah revisi, DP, termin pembayaran, deadline, hak cipta, biaya tambahan, dan pembatalan. Nếu không ghi rõ scope, khách có thể meminta revisi di luar ruang lingkup mà không muốn bayar tambahan.",
    cultural_notes_en:
      "In Indonesian freelance work, many deals start on WhatsApp but should be confirmed through a contract, email, or written document. Key points to state clearly: scope of work, deliverables, revision count, down payment, payment milestones, deadline, copyright, additional fees, and cancellation. If scope is not clear, clients may request revisions outside the scope without wanting to pay extra.",
    tip_advice_vi:
      "Mẹo cho người Việt: học các cụm hợp đồng nguyên khối: `ruang lingkup kerja`, `di luar ruang lingkup`, `biaya tambahan`, `termin pembayaran`, `hak cipta`, `pembayaran lunas`, `tidak dapat dikembalikan`. Dùng `mohon konfirmasi` để chốt điều khoản lịch sự.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn contract phrases as chunks: `ruang lingkup kerja`, `di luar ruang lingkup`, `biaya tambahan`, `termin pembayaran`, `hak cipta`, `pembayaran lunas`, `tidak dapat dikembalikan`. Use `mohon konfirmasi` to close terms politely.",
    vocabulary: [
      {
        cell_id: "c5e51490-fa4a-4ac3-81de-fa7673ca7cc3",
        word: "kontrak freelance",
        en: "freelance contract",
        vi: "hợp đồng freelance",
        pos: "noun phrase",
        pronunciation_vi: "KON-trak FRI-lens",
        pronunciation_en: "KON-trak FREE-lance",
      },
      {
        cell_id: "1d88f10a-75eb-46e3-ada3-34ae18e8aa5b",
        word: "ruang lingkup kerja",
        en: "scope of work",
        vi: "phạm vi công việc",
        pos: "noun phrase",
        pronunciation_vi: "RU-ang LING-kup KER-ja",
        pronunciation_en: "ROO-ang LING-koop KER-ja",
      },
      {
        cell_id: "b5538af6-61fa-49e3-bac8-c0e0cba7bc13",
        word: "revisi",
        en: "revision",
        vi: "chỉnh sửa",
        pos: "noun",
        pronunciation_vi: "re-VI-si",
        pronunciation_en: "reh-VEE-see",
      },
      {
        cell_id: "cfa3c61f-38ce-42ba-a896-d9996d17d2a7",
        word: "DP",
        en: "down payment",
        vi: "tiền cọc / tạm ứng",
        pos: "noun abbreviation",
        pronunciation_vi: "de-PE",
        pronunciation_en: "day-PAY",
      },
      {
        cell_id: "08706d4b-04f1-4a10-bf12-819b9720b609",
        word: "termin pembayaran",
        en: "payment milestone/installment",
        vi: "đợt thanh toán",
        pos: "noun phrase",
        pronunciation_vi: "TER-min pem-ba-YA-ran",
        pronunciation_en: "TER-min pem-ba-YA-ran",
      },
      {
        cell_id: "1f66fd90-b760-4d0b-9039-4a1b62ee506a",
        word: "hak cipta",
        en: "copyright",
        vi: "bản quyền",
        pos: "noun phrase",
        pronunciation_vi: "hak CHIP-ta",
        pronunciation_en: "hak CHIP-ta",
      },
      {
        cell_id: "26bf5e08-0017-4fab-9d9a-839a3463bd12",
        word: "pembatalan",
        en: "cancellation",
        vi: "việc hủy bỏ",
        pos: "noun",
        pronunciation_vi: "pem-ba-TA-lan",
        pronunciation_en: "pem-ba-TA-lan",
      },
      {
        cell_id: "1cd74ca5-3f8f-43b2-add3-3a30ea6355be",
        word: "ketentuan",
        en: "terms / conditions",
        vi: "điều khoản / quy định",
        pos: "noun",
        pronunciation_vi: "ke-ten-TU-an",
        pronunciation_en: "keh-ten-TOO-an",
      },
    ],
    dialogue: [
      {
        cell_id: "04dcf3ad-b913-471f-8e83-6beceeb04d46",
        speaker: "Freelancer",
        text: "Sebelum mulai, saya kirim kontrak freelance dulu, ya.",
        vi: "Trước khi bắt đầu, tôi gửi hợp đồng freelance trước nhé.",
        en: "Before starting, I will send the freelance contract first.",
      },
      {
        cell_id: "9355821c-74dc-41b6-8847-056cc9edbb8d",
        speaker: "Klien",
        text: "Baik. Apa saja yang termasuk dalam ruang lingkup kerja?",
        vi: "Được. Những gì bao gồm trong phạm vi công việc?",
        en: "Okay. What is included in the scope of work?",
      },
      {
        cell_id: "99796943-3f7b-4466-bb78-7cd913faae7c",
        speaker: "Freelancer",
        text: "Harga sudah termasuk dua kali revisi kecil. Revisi besar ada biaya tambahan.",
        vi: "Giá đã bao gồm hai lần chỉnh sửa nhỏ. Chỉnh sửa lớn có phí bổ sung.",
        en: "The price includes two small revisions. Major revisions have an additional fee.",
      },
      {
        cell_id: "a5171e15-ecad-4414-b34f-a82242958a24",
        speaker: "Klien",
        text: "Untuk pembayaran, apakah bisa pakai DP dan termin?",
        vi: "Về thanh toán, có thể dùng tiền cọc và các đợt thanh toán không?",
        en: "For payment, can we use a down payment and milestones?",
      },
      {
        cell_id: "da564180-518b-48df-b2a7-3e7e1ba38b33",
        speaker: "Freelancer",
        text: "Bisa. DP tiga puluh persen, lalu termin kedua setelah draf pertama disetujui.",
        vi: "Có thể. Đặt cọc ba mươi phần trăm, rồi đợt thứ hai sau khi bản nháp đầu được duyệt.",
        en: "Yes. Thirty percent down payment, then the second milestone after the first draft is approved.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Phạm vi công việc phải rõ ràng.",
        prompt_en: "Translate into Indonesian: The scope of work must be clear.",
        answer: "Ruang lingkup kerja harus jelas.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Harga ini sudah termasuk dua kali ___ kecil.",
        prompt_en: "Fill in the blank: Harga ini sudah termasuk dua kali ___ kecil.",
        answer: "revisi",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Bản quyền chuyển sang khách hàng sau khi thanh toán đầy đủ.",
        prompt_en: "Translate into Indonesian: Copyright transfers to the client after full payment.",
        answer: "Hak cipta berpindah ke klien setelah pembayaran lunas.",
      },
      {
        type: "roleplay",
        prompt_vi: "Bạn là freelancer. Hãy nói lịch sự rằng chỉnh sửa lớn ngoài phạm vi sẽ có phí bổ sung.",
        prompt_en: "You are a freelancer. Politely say that major revisions outside the scope will have an additional fee.",
        answer: "Revisi besar di luar ruang lingkup akan dikenakan biaya tambahan.",
      },
    ],
  },
];
