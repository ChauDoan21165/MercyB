// src/languages/indonesian/extra/bank-loan-credit.ts
//
// Indonesian bank loan and credit pack for Vietnamese learners.
// Covers: pinjaman, cicilan, bunga, tenor, agunan, skor kredit, kartu kredit,
// telat bayar, loan applications, and repayment conversations.
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
  cell_id?: string;
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
  cell_id?: string;
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

export const bankLoanCreditLessons: IndonesianLesson[] = [
  {
    id: "indonesian_bank_loan_application",
    level: "B1",
    category: "money",
    title_vi: "Vay ngân hàng — khoản vay, lãi và kỳ hạn",
    title_en: "Bank loans — loan amount, interest and term",
    sentences: [
      {
        en: "Saya ingin mengajukan pinjaman ke bank.",
        vi: "Tôi muốn nộp hồ sơ vay ngân hàng.",
        pronunciation_focus: [
          "mengajukan pinjaman → nộp/đề xuất khoản vay; `pinjaman` = khoản vay.",
          "ke bank → đến/với ngân hàng; dùng `ke` vì hướng nộp hồ sơ.",
          "Lỗi người Việt: nói `minta uang bank`. Câu chuyên nghiệp là `mengajukan pinjaman`.",
        ],
        pronunciation_focus_en: [
          "mengajukan pinjaman → apply/submit for a loan; `pinjaman` = loan.",
          "ke bank → to/with the bank; `ke` marks the direction of application.",
          "VN-speaker trap: saying `minta uang bank`. Professional wording is `mengajukan pinjaman`.",
        ],
      },
      {
        en: "Berapa bunga pinjaman per tahun?",
        vi: "Lãi khoản vay mỗi năm là bao nhiêu?",
        pronunciation_focus: [
          "bunga pinjaman → lãi khoản vay; `bunga` cũng nghĩa là hoa, nhưng trong ngân hàng là lãi.",
          "per tahun → mỗi năm/theo năm; dùng khi hỏi lãi suất.",
          "Lỗi người Việt: dịch `lãi` thành `untung`. Với ngân hàng, lãi suất là `bunga`.",
        ],
        pronunciation_focus_en: [
          "bunga pinjaman → loan interest; `bunga` also means flower, but in banking it means interest.",
          "per tahun → per year; used when asking interest rate.",
          "VN-speaker trap: translating profit/interest as `untung`. In banking, interest is `bunga`.",
        ],
      },
      {
        en: "Tenornya bisa tiga tahun atau lima tahun?",
        vi: "Kỳ hạn có thể là ba năm hoặc năm năm không?",
        pronunciation_focus: [
          "tenor → kỳ hạn vay; từ mượn rất phổ biến trong ngân hàng.",
          "tiga tahun atau lima tahun → ba năm hoặc năm năm; sau số không lặp `tahun`.",
          "Lỗi người Việt: nói `tahun-tahun`. Sau số đếm chỉ dùng `tahun` một lần.",
        ],
        pronunciation_focus_en: [
          "tenor → loan term; a very common banking loanword.",
          "tiga tahun atau lima tahun → three years or five years; after numbers, do not reduplicate `tahun`.",
          "VN-speaker trap: saying `tahun-tahun`. After a number, use `tahun` once.",
        ],
      },
      {
        en: "Cicilan per bulan saya maksimal lima juta.",
        vi: "Khoản trả góp mỗi tháng của tôi tối đa năm triệu.",
        pronunciation_focus: [
          "cicilan per bulan → khoản trả góp mỗi tháng.",
          "maksimal lima juta → tối đa năm triệu; nhớ bậc `juta` = triệu.",
          "Lỗi người Việt: bỏ bậc tiền. `lima juta`, không chỉ `lima`.",
        ],
        pronunciation_focus_en: [
          "cicilan per bulan → monthly installment.",
          "maksimal lima juta → maximum five million; remember `juta` = million.",
          "VN-speaker trap: dropping the money scale. Say `lima juta`, not only `lima`.",
        ],
      },
      {
        en: "Apakah pinjaman ini perlu agunan?",
        vi: "Khoản vay này có cần tài sản thế chấp không?",
        pronunciation_focus: [
          "perlu agunan → cần tài sản thế chấp; `agunan` là từ ngân hàng/trang trọng.",
          "pinjaman ini → khoản vay này; `ini` đứng sau danh từ.",
          "Lỗi người Việt: dùng `jaminan` cho mọi thứ. `jaminan` hiểu được, nhưng thuật ngữ ngân hàng là `agunan`.",
        ],
        pronunciation_focus_en: [
          "perlu agunan → need collateral; `agunan` is formal/banking language.",
          "pinjaman ini → this loan; `ini` follows the noun.",
          "VN-speaker trap: using `jaminan` for everything. Understandable, but the banking term is `agunan`.",
        ],
      },
      {
        en: "Skor kredit saya akan dicek dulu.",
        vi: "Điểm tín dụng của tôi sẽ được kiểm tra trước.",
        pronunciation_focus: [
          "skor kredit → điểm tín dụng; từ mượn `skor` + `kredit`.",
          "akan dicek → sẽ được kiểm tra; `di-` là bị động.",
          "dulu → trước đã; làm câu mềm hơn trong quy trình.",
        ],
        pronunciation_focus_en: [
          "skor kredit → credit score; loanword `skor` + `kredit`.",
          "akan dicek → will be checked; `di-` marks passive voice.",
          "dulu → first/for now; softens the process wording.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, khi vay ngân hàng bạn sẽ gặp các từ `pinjaman`, `bunga`, `tenor`, `cicilan`, `agunan`, và `skor kredit`. Ngân hàng thường xem thu nhập, lịch sử pembayaran, pekerjaan, dokumen identitas, và khả năng membayar cicilan. Một số pinjaman có `agunan`, một số là `KTA` (kredit tanpa agunan). Đừng chỉ nhìn cicilan nhỏ; hỏi rõ bunga, biaya admin, denda, và total pembayaran.",
    cultural_notes_en:
      "In Indonesia, loan conversations use `pinjaman`, `bunga`, `tenor`, `cicilan`, `agunan`, and `skor kredit`. Banks usually review income, payment history, job, identity documents, and ability to pay installments. Some loans require `agunan`, while some are `KTA` (unsecured loans). Do not look only at a small installment; ask about interest, admin fees, penalties, and total repayment.",
    tip_advice_vi:
      "Mẹo cho người Việt: `bunga` trong ngân hàng là lãi, không phải hoa. `cicilan` là khoản trả góp định kỳ, còn `pinjaman` là khoản vay gốc. Hỏi bằng khung: `Berapa bunga ...?`, `Tenornya berapa lama?`, `Apakah perlu agunan?`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: in banking, `bunga` means interest, not flower. `cicilan` is the installment, while `pinjaman` is the loan. Use frames: `Berapa bunga ...?`, `Tenornya berapa lama?`, and `Apakah perlu agunan?`.",
    vocabulary: [
      {
        cell_id: "6f6a3cd5-d585-4419-bad3-84d3dfdc7472",
        word: "pinjaman",
        en: "loan",
        vi: "khoản vay",
        pos: "noun",
        pronunciation_vi: "pin-JA-man",
        pronunciation_en: "pin-JA-man",
      },
      {
        cell_id: "751cc137-6441-45b2-a5eb-3c861b8f9b48",
        word: "mengajukan pinjaman",
        en: "to apply for a loan",
        vi: "nộp hồ sơ vay",
        pos: "verb phrase",
        pronunciation_vi: "me-nga-JU-kan pin-JA-man",
        pronunciation_en: "meh-nga-JOO-kan pin-JA-man",
      },
      {
        cell_id: "de701c47-8080-4c35-9028-cd433d8fb7e6",
        word: "bunga",
        en: "interest",
        vi: "lãi / lãi suất",
        pos: "noun",
        pronunciation_vi: "BUNG-a",
        pronunciation_en: "BOONG-a",
      },
      {
        cell_id: "f2b11125-b55b-4955-b69c-024ccac5f373",
        word: "tenor",
        en: "loan term",
        vi: "kỳ hạn vay",
        pos: "noun",
        pronunciation_vi: "TE-nor",
        pronunciation_en: "TEH-nor",
      },
      {
        cell_id: "9fc49c0b-5966-4820-97ef-9ffd8934d770",
        word: "cicilan",
        en: "installment",
        vi: "khoản trả góp",
        pos: "noun",
        pronunciation_vi: "chi-CHI-lan",
        pronunciation_en: "chee-CHEE-lan",
      },
      {
        cell_id: "674b93a0-83a7-44bb-ad8a-71adba42406a",
        word: "agunan",
        en: "collateral",
        vi: "tài sản thế chấp",
        pos: "noun",
        pronunciation_vi: "a-GU-nan",
        pronunciation_en: "a-GOO-nan",
      },
      {
        cell_id: "65610cef-a24e-4c2c-bdc7-89f182defdb1",
        word: "skor kredit",
        en: "credit score",
        vi: "điểm tín dụng",
        pos: "noun phrase",
        pronunciation_vi: "skor KRE-dit",
        pronunciation_en: "score KREH-dit",
      },
    ],
    dialogue: [
      {
        cell_id: "a1b8d4c3-4dfe-45a5-80af-8096efa593e1",
        speaker: "Nasabah",
        text: "Saya ingin mengajukan pinjaman ke bank.",
        vi: "Tôi muốn nộp hồ sơ vay ngân hàng.",
        en: "I would like to apply for a bank loan.",
      },
      {
        cell_id: "69f0564e-2da3-4968-af9b-858f380bf2f4",
        speaker: "Petugas bank",
        text: "Baik. Berapa jumlah pinjaman dan tenornya?",
        vi: "Vâng. Số tiền vay và kỳ hạn là bao nhiêu?",
        en: "Okay. What is the loan amount and term?",
      },
      {
        cell_id: "eba98d2c-2210-4ce6-98b8-3301088b5268",
        speaker: "Nasabah",
        text: "Saya ingin pinjaman seratus juta dengan tenor tiga tahun.",
        vi: "Tôi muốn vay một trăm triệu với kỳ hạn ba năm.",
        en: "I want a loan of one hundred million with a three-year term.",
      },
      {
        cell_id: "0b0da93d-6d9d-47c7-b996-7ff802f4c3e5",
        speaker: "Petugas bank",
        text: "Nanti skor kredit dan dokumen Bapak akan dicek dulu.",
        vi: "Lát nữa điểm tín dụng và giấy tờ của anh sẽ được kiểm tra trước.",
        en: "Your credit score and documents will be checked first.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ vay ngân hàng còn thiếu:",
        instruction_en: "Fill in the missing loan word:",
        items: [
          {
            prompt: "Saya ingin mengajukan ___ ke bank. (khoản vay)",
            answer: "pinjaman",
            options: ["pinjaman", "pakaian", "pelajaran"],
          },
          {
            prompt: "Berapa ___ pinjaman per tahun? (lãi)",
            answer: "bunga",
            options: ["bunga", "bukan", "barang"],
          },
          {
            prompt: "Apakah pinjaman ini perlu ___? (thế chấp)",
            answer: "agunan",
            options: ["agunan", "aturan", "alamat"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "cicilan", answer: "khoản trả góp" },
          { prompt: "tenor", answer: "kỳ hạn vay" },
          { prompt: "skor kredit", answer: "điểm tín dụng" },
          { prompt: "bunga", answer: "lãi / lãi suất" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn nộp hồ sơ vay ngân hàng.", answer: "Saya ingin mengajukan pinjaman ke bank." },
          { prompt: "Khoản trả góp mỗi tháng của tôi tối đa năm triệu.", answer: "Cicilan per bulan saya maksimal lima juta." },
          { prompt: "Điểm tín dụng của tôi sẽ được kiểm tra trước.", answer: "Skor kredit saya akan dicek dulu." },
        ],
      },
    ],
  },
  {
    id: "indonesian_credit_card_late_payment",
    level: "B1",
    category: "money",
    title_vi: "Thẻ tín dụng — hạn mức, trả chậm và phí phạt",
    title_en: "Credit cards — limit, late payment and penalties",
    sentences: [
      {
        en: "Saya mau mengajukan kartu kredit.",
        vi: "Tôi muốn đăng ký thẻ tín dụng.",
        pronunciation_focus: [
          "mengajukan kartu kredit → đăng ký/nộp hồ sơ thẻ tín dụng.",
          "kartu kredit → thẻ tín dụng; khác `kartu debit` = thẻ ghi nợ.",
          "Lỗi người Việt: nói `buat kartu kredit` trong ngân hàng chính thức. Tốt hơn: `mengajukan kartu kredit`.",
        ],
        pronunciation_focus_en: [
          "mengajukan kartu kredit → apply for a credit card.",
          "kartu kredit → credit card; different from `kartu debit` = debit card.",
          "VN-speaker trap: saying `buat kartu kredit` in formal banking. Better: `mengajukan kartu kredit`.",
        ],
      },
      {
        en: "Berapa limit kartu kredit saya?",
        vi: "Hạn mức thẻ tín dụng của tôi là bao nhiêu?",
        pronunciation_focus: [
          "limit kartu kredit → hạn mức thẻ tín dụng; từ `limit` rất phổ biến.",
          "`saya` đứng sau cụm danh từ: `kartu kredit saya`.",
          "Lỗi người Việt: đặt sở hữu trước như `saya kartu kredit`. Đúng: `kartu kredit saya`.",
        ],
        pronunciation_focus_en: [
          "limit kartu kredit → credit card limit; loanword `limit` is very common.",
          "`saya` follows the noun phrase: `kartu kredit saya`.",
          "VN-speaker trap: possessor-first `saya kartu kredit`. Correct: `kartu kredit saya`.",
        ],
      },
      {
        en: "Tanggal jatuh tempo tagihan saya tanggal dua puluh.",
        vi: "Ngày đến hạn hóa đơn của tôi là ngày hai mươi.",
        pronunciation_focus: [
          "tanggal jatuh tempo → ngày đến hạn; cụm tài chính quan trọng.",
          "tagihan saya → hóa đơn/khoản phải trả của tôi.",
          "`tanggal dua puluh` → ngày 20; `puluh` = mươi.",
        ],
        pronunciation_focus_en: [
          "tanggal jatuh tempo → due date; important financial phrase.",
          "tagihan saya → my bill/amount due.",
          "`tanggal dua puluh` → the 20th; `puluh` = tens.",
        ],
      },
      {
        en: "Saya telat bayar cicilan bulan lalu.",
        vi: "Tôi trả chậm khoản góp tháng trước.",
        pronunciation_focus: [
          "telat bayar → trả trễ; khẩu ngữ rất phổ biến.",
          "cicilan bulan lalu → khoản trả góp tháng trước; `lalu` = trước/đã qua.",
          "Lỗi người Việt: nói `bayar lambat`. Người Indonesia tự nhiên hơn với `telat bayar`.",
        ],
        pronunciation_focus_en: [
          "telat bayar → pay late; very common conversational phrase.",
          "cicilan bulan lalu → last month's installment; `lalu` = past/previous.",
          "VN-speaker trap: saying `bayar lambat`. Indonesians naturally say `telat bayar`.",
        ],
      },
      {
        en: "Kalau telat bayar, apakah ada denda?",
        vi: "Nếu trả chậm thì có tiền phạt không?",
        pronunciation_focus: [
          "kalau telat bayar → nếu trả chậm; `kalau` = nếu.",
          "ada denda → có tiền phạt; `denda` = phạt/phí phạt.",
          "Câu sống còn trước khi ký: `Apakah ada denda?`",
        ],
        pronunciation_focus_en: [
          "kalau telat bayar → if paying late; `kalau` = if.",
          "ada denda → is there a penalty; `denda` = fine/penalty fee.",
          "Survival question before signing: `Apakah ada denda?`",
        ],
      },
      {
        en: "Saya ingin melunasi pinjaman lebih cepat.",
        vi: "Tôi muốn tất toán khoản vay sớm hơn.",
        pronunciation_focus: [
          "melunasi pinjaman → trả hết/tất toán khoản vay; gốc `lunas` = đã trả hết.",
          "lebih cepat → nhanh/sớm hơn; so sánh dùng `lebih + tính từ`.",
          "Lỗi người Việt: nói `bayar semua pinjaman`. Hiểu được, nhưng ngân hàng dùng `melunasi pinjaman`.",
        ],
        pronunciation_focus_en: [
          "melunasi pinjaman → pay off/settle a loan; root `lunas` = fully paid.",
          "lebih cepat → faster/earlier; comparison uses `lebih + adjective`.",
          "VN-speaker trap: saying `bayar semua pinjaman`. Understandable, but banks use `melunasi pinjaman`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Với kartu kredit và pinjaman ở Indonesia, các từ quan trọng là `limit`, `tagihan`, `tanggal jatuh tempo`, `telat bayar`, `denda`, và `melunasi`. Trả chậm có thể ảnh hưởng `skor kredit` và tạo phí. Trước khi dùng kartu kredit, hỏi rõ limit, bunga, biaya tahunan, minimum payment, tanggal jatuh tempo, dan denda keterlambatan.",
    cultural_notes_en:
      "For credit cards and loans in Indonesia, key terms are `limit`, `tagihan`, `tanggal jatuh tempo`, `telat bayar`, `denda`, and `melunasi`. Late payment can affect `skor kredit` and create fees. Before using a credit card, clarify the limit, interest, annual fee, minimum payment, due date, and late-payment penalty.",
    tip_advice_vi:
      "Mẹo cho người Việt: `telat bayar` là cách nói tự nhiên cho trả chậm. `Lunas` nghĩa là đã trả hết; động từ ngân hàng là `melunasi`. Đừng ký nếu chưa hiểu `tanggal jatuh tempo` và `denda`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: `telat bayar` is the natural phrase for late payment. `Lunas` means fully paid; the banking verb is `melunasi`. Do not sign if you do not understand `tanggal jatuh tempo` and `denda`.",
    vocabulary: [
      {
        cell_id: "818b28a0-90f2-4824-a7d4-f8925be9cfa2",
        word: "kartu kredit",
        en: "credit card",
        vi: "thẻ tín dụng",
        pos: "noun phrase",
        pronunciation_vi: "KAR-tu KRE-dit",
        pronunciation_en: "KAR-too KREH-dit",
      },
      {
        cell_id: "211dcbeb-9f3f-4f16-acac-2d7b32251ecc",
        word: "limit",
        en: "credit limit",
        vi: "hạn mức",
        pos: "noun",
        pronunciation_vi: "LI-mit",
        pronunciation_en: "LI-mit",
      },
      {
        cell_id: "9c9033a2-51da-4856-843f-d4d07ed9ee73",
        word: "tagihan",
        en: "bill / amount due",
        vi: "hóa đơn / khoản phải trả",
        pos: "noun",
        pronunciation_vi: "ta-GI-han",
        pronunciation_en: "ta-GEE-han",
      },
      {
        cell_id: "b2a4d19b-3530-4f00-8396-c56114dfa7e0",
        word: "tanggal jatuh tempo",
        en: "due date",
        vi: "ngày đến hạn",
        pos: "noun phrase",
        pronunciation_vi: "TANG-gal JA-tuh TEM-po",
        pronunciation_en: "TANG-gal JA-tooh TEM-po",
      },
      {
        cell_id: "89d043b3-eaca-4c5c-b89e-fcf0d6ac41af",
        word: "telat bayar",
        en: "pay late",
        vi: "trả chậm",
        pos: "verb phrase",
        pronunciation_vi: "TE-lat BA-yar",
        pronunciation_en: "TEH-lat BA-yar",
      },
      {
        cell_id: "681f17aa-82d7-4a51-b0b3-764b13fda0da",
        word: "denda",
        en: "fine / penalty",
        vi: "tiền phạt",
        pos: "noun",
        pronunciation_vi: "DEN-da",
        pronunciation_en: "DEN-da",
      },
      {
        cell_id: "a3712d1d-5b04-4f6c-96dd-9e314e005d35",
        word: "melunasi",
        en: "to pay off / settle",
        vi: "tất toán / trả hết",
        pos: "verb",
        pronunciation_vi: "me-lu-NA-si",
        pronunciation_en: "meh-loo-NA-see",
      },
    ],
    dialogue: [
      {
        cell_id: "c01aa2b9-68b1-4a98-943e-fc0761124f2e",
        speaker: "Nasabah",
        text: "Saya mau mengajukan kartu kredit.",
        vi: "Tôi muốn đăng ký thẻ tín dụng.",
        en: "I want to apply for a credit card.",
      },
      {
        cell_id: "b55991e9-f108-4272-9093-a8ff9a193e37",
        speaker: "Petugas bank",
        text: "Baik. Nanti limitnya tergantung skor kredit dan penghasilan.",
        vi: "Vâng. Hạn mức sẽ tùy vào điểm tín dụng và thu nhập.",
        en: "Okay. The limit will depend on credit score and income.",
      },
      {
        cell_id: "c41a3797-a4b3-4b3f-b140-d16fb856bb3f",
        speaker: "Nasabah",
        text: "Kalau telat bayar, apakah ada denda?",
        vi: "Nếu trả chậm thì có tiền phạt không?",
        en: "If I pay late, is there a penalty?",
      },
      {
        cell_id: "d872d681-ffff-4859-9e1f-0d61255d2f6b",
        speaker: "Petugas bank",
        text: "Ada. Karena itu, perhatikan tanggal jatuh tempo tagihan.",
        vi: "Có. Vì vậy, hãy chú ý ngày đến hạn của hóa đơn.",
        en: "Yes. Because of that, pay attention to the bill due date.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ thẻ tín dụng còn thiếu:",
        instruction_en: "Fill in the missing credit-card word:",
        items: [
          {
            prompt: "Saya mau mengajukan kartu ___. (tín dụng)",
            answer: "kredit",
            options: ["kredit", "kritis", "kertas"],
          },
          {
            prompt: "Tanggal jatuh tempo ___ saya tanggal dua puluh. (hóa đơn)",
            answer: "tagihan",
            options: ["tagihan", "tahanan", "tambahan"],
          },
          {
            prompt: "Kalau telat bayar, apakah ada ___? (tiền phạt)",
            answer: "denda",
            options: ["denda", "dengar", "dendaian"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "kartu kredit", answer: "thẻ tín dụng" },
          { prompt: "tanggal jatuh tempo", answer: "ngày đến hạn" },
          { prompt: "telat bayar", answer: "trả chậm" },
          { prompt: "melunasi", answer: "tất toán / trả hết" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Hạn mức thẻ tín dụng của tôi là bao nhiêu?", answer: "Berapa limit kartu kredit saya?" },
          { prompt: "Tôi trả chậm khoản góp tháng trước.", answer: "Saya telat bayar cicilan bulan lalu." },
          { prompt: "Tôi muốn tất toán khoản vay sớm hơn.", answer: "Saya ingin melunasi pinjaman lebih cepat." },
        ],
      },
    ],
  },
];
