// Bank transfer & ATM Indonesian (Vietnamese -> Indonesian study track).
//
// A1 Wave 10 file. Covers transfer bank, ATM, nomor rekening, biaya admin,
// saldo, mobile banking, bukti transfer, and gagal transaksi. Self-contained so
// no registry or sibling agent files are touched.
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

export const bankTransferAtmLessons: IndonesianLesson[] = [
  {
    id: "indonesian_bank_transfer_basic",
    level: "A2",
    category: "money",
    title_vi: "Chuyển khoản ngân hàng cơ bản",
    title_en: "Basic bank transfers",
    sentences: [
      {
        en: "Saya mau transfer uang ke rekening ini.",
        vi: "Tôi muốn chuyển tiền vào tài khoản này.",
        pronunciation_focus: [
          "SA-ya mau TRANS-fer U-ang ke re-KE-ning I-ni - `transfer uang` = chuyển tiền; `rekening` = tài khoản ngân hàng.",
          "Lỗi người Việt: nói `ke akun` theo kiểu app. Với ngân hàng, dùng `ke rekening`, không phải `ke akun`.",
          "Luyện: `Saya mau transfer uang ke rekening ini.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau TRANS-fer OO-ang ke re-KE-ning EE-nee - `transfer uang` = transfer money; `rekening` = bank account.",
          "VN-speaker trap: saying app-style `ke akun`. For banking, use `ke rekening`, not `ke akun`.",
          "Drill: `Saya mau transfer uang ke rekening ini.`",
        ],
      },
      {
        en: "Nomor rekeningnya berapa?",
        vi: "Số tài khoản là bao nhiêu?",
        pronunciation_focus: [
          "NO-mor re-KE-ning-nya be-RA-pa - `nomor rekening` = số tài khoản.",
          "`-nya` ở đây nghĩa là 'của tài khoản đó/người đó', làm câu tự nhiên hơn.",
          "Lỗi người Việt: bỏ `nomor` và chỉ hỏi `rekening berapa?`. Người Indonesia hiểu, nhưng `nomor rekeningnya berapa?` rõ hơn.",
        ],
        pronunciation_focus_en: [
          "NO-mor re-KE-ning-nya be-RA-pa - `nomor rekening` = account number.",
          "`-nya` here means 'its/their', making the question sound natural.",
          "VN-speaker trap: dropping `nomor` and asking `rekening berapa?`. Understandable, but `nomor rekeningnya berapa?` is clearer.",
        ],
      },
      {
        en: "Atas nama siapa rekeningnya?",
        vi: "Tài khoản đứng tên ai?",
        pronunciation_focus: [
          "A-tas NA-ma SI-a-pa re-KE-ning-nya - `atas nama` = đứng tên.",
          "`siapa` = ai; đứng sau cụm `atas nama` trong câu hỏi ngân hàng.",
          "Lỗi người Việt: dịch từng chữ 'tên tài khoản là gì' thành `nama rekening apa`. Nói tự nhiên: `atas nama siapa?`",
        ],
        pronunciation_focus_en: [
          "A-tas NA-ma see-A-pa re-KE-ning-nya - `atas nama` = under whose name.",
          "`siapa` = who; it follows `atas nama` in banking questions.",
          "VN-speaker trap: translating 'account name' as `nama rekening apa`. Natural Indonesian: `atas nama siapa?`",
        ],
      },
      {
        en: "Biaya admin transfernya lima ribu rupiah.",
        vi: "Phí admin chuyển khoản là năm nghìn rupiah.",
        pronunciation_focus: [
          "BI-a-ya AD-min TRANS-fer-nya LI-ma RI-bu ru-PI-ah - `biaya admin` = phí hành chính/phí giao dịch.",
          "`lima ribu` = 5.000; trong tiền Indonesia phải giữ bậc `ribu`.",
          "Lỗi người Việt: nói `lima` khi muốn 5.000. Với tiền Indonesia, `lima ribu` mới đúng.",
        ],
        pronunciation_focus_en: [
          "BEE-a-ya AD-min TRANS-fer-nya LEE-ma REE-boo roo-PEE-ah - `biaya admin` = admin/transaction fee.",
          "`lima ribu` = 5,000; Indonesian money needs the `ribu` scale.",
          "VN-speaker trap: saying `lima` when you mean 5,000. For Indonesian money, say `lima ribu`.",
        ],
      },
      {
        en: "Tolong kirim bukti transfer setelah selesai.",
        vi: "Làm ơn gửi bằng chứng chuyển khoản sau khi xong.",
        pronunciation_focus: [
          "TO-long KI-rim BUK-ti TRANS-fer se-TE-lah se-LE-sai - `bukti transfer` = biên lai/ảnh xác nhận chuyển khoản.",
          "`setelah selesai` = sau khi hoàn tất; dùng nhiều trong chat mua bán.",
          "Lỗi người Việt: dịch `bukti` thành `bukti foto`. Nếu cần ảnh, nói `foto bukti transfer`.",
        ],
        pronunciation_focus_en: [
          "TO-long KEE-rim BOOK-tee TRANS-fer se-TE-lah se-LEH-sai - `bukti transfer` = proof/receipt of transfer.",
          "`setelah selesai` = after it is finished; common in buyer-seller chat.",
          "VN-speaker trap: saying `bukti foto`. If you need a photo, say `foto bukti transfer`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, chuyển khoản ngân hàng rất phổ biến khi mua bán online, trả tiền thuê nhà, gửi tiền cho bạn bè, hoặc đặt cọc. Người bán thường hỏi `bukti transfer` sau khi khách trả tiền. Trước khi chuyển, luôn kiểm tra `nomor rekening` và `atas nama` vì nhiều giao dịch không hoàn tác ngay được. `Biaya admin` có thể khác nhau giữa cùng ngân hàng và khác ngân hàng.",
    cultural_notes_en:
      "In Indonesia, bank transfers are common for online shopping, rent, sending money to friends, and deposits. Sellers often ask for `bukti transfer` after payment. Before sending, always check `nomor rekening` and `atas nama` because many transfers cannot be reversed immediately. `Biaya admin` can differ for same-bank and interbank transfers.",
    tip_advice_vi:
      "Bộ câu sống còn: `Nomor rekeningnya berapa?`, `Atas nama siapa?`, `Biaya admin berapa?`, `Tolong kirim bukti transfer.` Bẫy lớn cho người Việt là dùng `akun` thay cho `rekening`; `akun` hợp với app, còn ngân hàng dùng `rekening`.",
    tip_advice_en:
      "Survival set: `Nomor rekeningnya berapa?`, `Atas nama siapa?`, `Biaya admin berapa?`, `Tolong kirim bukti transfer.` The big VN-speaker trap is using `akun` instead of `rekening`; `akun` fits apps, while banking uses `rekening`.",
    vocabulary: [
      { word: "transfer uang", en: "transfer money", vi: "chuyển tiền", pos: "verb phrase", pronunciation_vi: "TRANS-fer U-ang", pronunciation_en: "TRANS-fer OO-ang" },
      { word: "rekening", en: "bank account", vi: "tài khoản ngân hàng", pos: "noun", pronunciation_vi: "re-KE-ning", pronunciation_en: "re-KE-ning" },
      { word: "nomor rekening", en: "account number", vi: "số tài khoản", pos: "noun phrase", pronunciation_vi: "NO-mor re-KE-ning", pronunciation_en: "NO-mor re-KE-ning" },
      { word: "atas nama", en: "under the name of", vi: "đứng tên", pos: "phrase", pronunciation_vi: "A-tas NA-ma", pronunciation_en: "A-tas NA-ma" },
      { word: "biaya admin", en: "admin fee", vi: "phí admin/phí giao dịch", pos: "noun phrase", pronunciation_vi: "BI-a-ya AD-min", pronunciation_en: "BEE-a-ya AD-min" },
      { word: "bukti transfer", en: "proof of transfer", vi: "bằng chứng chuyển khoản", pos: "noun phrase", pronunciation_vi: "BUK-ti TRANS-fer", pronunciation_en: "BOOK-tee TRANS-fer" },
    ],
    dialogue: [
      { speaker: "Pembeli", text: "Saya mau transfer sekarang. Nomor rekeningnya berapa?", vi: "Tôi muốn chuyển khoản bây giờ. Số tài khoản là bao nhiêu?", en: "I want to transfer now. What is the account number?" },
      { speaker: "Penjual", text: "Ini nomor rekening BCA. Atas nama Sari Wijaya.", vi: "Đây là số tài khoản BCA. Đứng tên Sari Wijaya.", en: "This is the BCA account number. It is under Sari Wijaya's name." },
      { speaker: "Penjual", text: "Setelah transfer, tolong kirim bukti transfer, ya.", vi: "Sau khi chuyển khoản, làm ơn gửi bằng chứng chuyển khoản nhé.", en: "After transferring, please send the proof of transfer." },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "nomor rekening", answer: "số tài khoản" },
          { prompt: "atas nama", answer: "đứng tên" },
          { prompt: "biaya admin", answer: "phí giao dịch" },
          { prompt: "bukti transfer", answer: "bằng chứng chuyển khoản" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Số tài khoản là bao nhiêu?", answer: "Nomor rekeningnya berapa?" },
          { prompt: "Làm ơn gửi bằng chứng chuyển khoản.", answer: "Tolong kirim bukti transfer." },
        ],
      },
    ],
  },
  {
    id: "indonesian_atm_mobile_banking",
    level: "A2",
    category: "money",
    title_vi: "ATM, số dư và mobile banking",
    title_en: "ATMs, balances and mobile banking",
    sentences: [
      {
        en: "Saya mau cek saldo di ATM.",
        vi: "Tôi muốn kiểm tra số dư ở cây ATM.",
        pronunciation_focus: [
          "SA-ya mau CEK SAL-do di A-TE-EM - `cek saldo` = kiểm tra số dư.",
          "`c` trong `cek` đọc như 'ch', gần 'chék', không phải 'kek'.",
          "Lỗi người Việt: nói `lihat uang`. Trong ngân hàng, số dư là `saldo`.",
        ],
        pronunciation_focus_en: [
          "SA-ya mau CHEK SAL-do di A-TE-EM - `cek saldo` = check balance.",
          "`c` in `cek` is pronounced like English `ch`, not `k`.",
          "VN-speaker trap: saying `lihat uang`. In banking, balance is `saldo`.",
        ],
      },
      {
        en: "Saldo saya tidak cukup untuk transfer.",
        vi: "Số dư của tôi không đủ để chuyển khoản.",
        pronunciation_focus: [
          "SAL-do SA-ya TI-dak CU-kup UN-tuk TRANS-fer - `tidak cukup` = không đủ.",
          "`cukup` đọc CHU-kup vì `c` = 'ch'.",
          "Lỗi người Việt: đặt `tidak` sau tính từ theo tiếng Việt. Đúng là `tidak cukup`, không phải `cukup tidak`.",
        ],
        pronunciation_focus_en: [
          "SAL-do SA-ya TEE-dak CHOO-kup OON-tuk TRANS-fer - `tidak cukup` = not enough.",
          "`cukup` is CHOO-kup because Indonesian `c` = `ch`.",
          "VN-speaker trap: placing `tidak` after the adjective. Correct: `tidak cukup`, not `cukup tidak`.",
        ],
      },
      {
        en: "Saya pakai mobile banking untuk bayar tagihan.",
        vi: "Tôi dùng mobile banking để trả hóa đơn.",
        pronunciation_focus: [
          "SA-ya PA-kai MO-bail BEN-king UN-tuk BA-yar ta-GIH-an - `tagihan` = hóa đơn/khoản phải trả.",
          "`pakai` = dùng/bằng; rất tự nhiên với phương thức thanh toán.",
          "Lỗi người Việt: dùng `dengan mobile banking` trong chat nhanh. Hiểu được, nhưng `pakai mobile banking` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya PA-kai MO-bile BANK-ing OON-tuk BA-yar ta-GEE-han - `tagihan` = bill/amount due.",
          "`pakai` = use/by means of; very natural for payment methods.",
          "VN-speaker trap: using `dengan mobile banking` in quick chat. Understandable, but `pakai mobile banking` is more natural.",
        ],
      },
      {
        en: "Aplikasi mobile banking saya belum bisa dibuka.",
        vi: "Ứng dụng mobile banking của tôi chưa mở được.",
        pronunciation_focus: [
          "ap-li-KA-si MO-bail BEN-king SA-ya be-LUM BI-sa di-BU-ka - `belum bisa dibuka` = chưa mở được.",
          "`dibuka` là bị động `di-`; ứng dụng 'được mở', không phải tự mở.",
          "Lỗi người Việt: bỏ `di-` và nói `belum bisa buka`. Với app/tài khoản, nói `belum bisa dibuka` chuẩn hơn.",
        ],
        pronunciation_focus_en: [
          "ap-lee-KA-see MO-bile BANK-ing SA-ya be-LOOM BEE-sa dee-BOO-ka - `belum bisa dibuka` = cannot be opened yet.",
          "`dibuka` is passive `di-`; the app is opened, it does not open itself.",
          "VN-speaker trap: dropping `di-` and saying `belum bisa buka`. For apps/accounts, `belum bisa dibuka` is better.",
        ],
      },
      {
        en: "Saya lupa PIN ATM, jadi kartu saya diblokir.",
        vi: "Tôi quên mã PIN ATM, nên thẻ của tôi bị khóa.",
        pronunciation_focus: [
          "SA-ya LU-pa PIN A-TE-EM, JA-di KAR-tu SA-ya di-blo-KIR - `diblokir` = bị khóa.",
          "`jadi` = vì vậy/nên; nối nguyên nhân với kết quả.",
          "Lỗi người Việt: né bị động và nói `bank blokir kartu saya`. Câu tự nhiên hơn: `kartu saya diblokir`.",
        ],
        pronunciation_focus_en: [
          "SA-ya LOO-pa PIN A-TE-EM, JAH-dee KAR-too SA-ya dee-blo-KEER - `diblokir` = blocked.",
          "`jadi` = so/therefore; connects cause and result.",
          "VN-speaker trap: avoiding passive and saying `bank blokir kartu saya`. More natural: `kartu saya diblokir`.",
        ],
      },
    ],
    cultural_notes_vi:
      "ATM vẫn rất quan trọng ở Indonesia, nhất là để rút tiền mặt, kiểm tra saldo, đổi PIN, hoặc chuyển khoản nhanh. Tuy vậy, nhiều người dùng mobile banking cho chuyển tiền, trả hóa đơn, mua pulsa, và quét QRIS. Khi dùng ATM, chú ý phí admin, hạn mức rút tiền, và bảo mật PIN. Nếu thẻ bị nuốt hoặc bị khóa, liên hệ bank ngay qua kênh chính thức.",
    cultural_notes_en:
      "ATMs are still important in Indonesia, especially for withdrawing cash, checking balance, changing PIN, or quick transfers. However, many people use mobile banking for transfers, bill payment, buying phone credit, and QRIS payments. At an ATM, watch admin fees, withdrawal limits, and PIN safety. If a card is swallowed or blocked, contact the bank through official channels.",
    tip_advice_vi:
      "Nhớ ba cụm ngắn: `cek saldo`, `tarik tunai`, `mobile banking`. Người Việt dễ dùng từ chung như `tiền trong thẻ`; tiếng Indonesia ngân hàng dùng `saldo`. Bị động `di-` cũng rất quan trọng: `diblokir` = bị khóa, `dibuka` = được mở.",
    tip_advice_en:
      "Remember three short phrases: `cek saldo`, `tarik tunai`, `mobile banking`. Vietnamese speakers may use generic wording like 'money in the card'; Indonesian banking uses `saldo`. Passive `di-` also matters: `diblokir` = blocked, `dibuka` = opened.",
    vocabulary: [
      { word: "ATM", en: "ATM", vi: "cây ATM", pos: "noun", pronunciation_vi: "A-TE-EM", pronunciation_en: "A-TE-EM" },
      { word: "cek saldo", en: "check balance", vi: "kiểm tra số dư", pos: "verb phrase", pronunciation_vi: "CEK SAL-do", pronunciation_en: "CHEK SAL-do" },
      { word: "saldo", en: "balance", vi: "số dư", pos: "noun", pronunciation_vi: "SAL-do", pronunciation_en: "SAL-do" },
      { word: "mobile banking", en: "mobile banking", vi: "ngân hàng di động", pos: "noun", pronunciation_vi: "MO-bail BEN-king", pronunciation_en: "MO-bile BANK-ing" },
      { word: "tagihan", en: "bill/amount due", vi: "hóa đơn/khoản phải trả", pos: "noun", pronunciation_vi: "ta-GIH-an", pronunciation_en: "ta-GEE-han" },
      { word: "PIN", en: "PIN", vi: "mã PIN", pos: "noun", pronunciation_vi: "PIN", pronunciation_en: "PIN" },
      { word: "diblokir", en: "blocked", vi: "bị khóa", pos: "passive verb", pronunciation_vi: "di-blo-KIR", pronunciation_en: "dee-blo-KEER" },
    ],
    dialogue: [
      { speaker: "Nasabah", text: "Saya mau cek saldo, tapi aplikasi mobile banking belum bisa dibuka.", vi: "Tôi muốn kiểm tra số dư, nhưng ứng dụng mobile banking chưa mở được.", en: "I want to check my balance, but the mobile banking app cannot be opened yet." },
      { speaker: "Petugas bank", text: "Bapak bisa cek saldo di ATM dulu.", vi: "Anh có thể kiểm tra số dư ở ATM trước.", en: "You can check the balance at the ATM first." },
      { speaker: "Nasabah", text: "Baik. Kalau kartu diblokir, saya harus ke bank?", vi: "Vâng. Nếu thẻ bị khóa, tôi phải đến ngân hàng không?", en: "Okay. If the card is blocked, do I have to go to the bank?" },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng.",
        instruction_en: "Fill in the correct word.",
        items: [
          { prompt: "Saya mau cek ___ di ATM.", answer: "saldo" },
          { prompt: "Saldo saya tidak ___ untuk transfer.", answer: "cukup" },
          { prompt: "Kartu saya ___ karena salah PIN.", answer: "diblokir" },
        ],
      },
      {
        type: "rewrite",
        instruction_vi: "Sửa câu Việt hóa sang câu tự nhiên.",
        instruction_en: "Rewrite the Vietnamese-style sentence into natural Indonesian.",
        items: [
          { prompt: "Saya lihat uang di kartu.", answer: "Saya cek saldo." },
          { prompt: "Aplikasi belum bisa buka.", answer: "Aplikasi belum bisa dibuka." },
        ],
      },
    ],
  },
  {
    id: "indonesian_failed_transaction",
    level: "B1",
    category: "money",
    title_vi: "Giao dịch thất bại và cách báo lỗi",
    title_en: "Failed transactions and reporting problems",
    sentences: [
      {
        en: "Transaksi saya gagal, tetapi saldo sudah terpotong.",
        vi: "Giao dịch của tôi thất bại, nhưng số dư đã bị trừ.",
        pronunciation_focus: [
          "trans-AK-si SA-ya GA-gal, te-TA-pi SAL-do SU-dah ter-PO-tong - `gagal transaksi` = giao dịch thất bại.",
          "`terpotong` = bị trừ ngoài ý muốn; rất hay dùng khi tiền bị trừ tự động.",
          "Lỗi người Việt: nói `saldo sudah hilang`. Ngân hàng dùng `saldo terpotong` hoặc `saldo berkurang`.",
        ],
        pronunciation_focus_en: [
          "trans-AK-see SA-ya GA-gal, te-TA-pee SAL-do SOO-dah ter-PO-tong - `gagal transaksi` = failed transaction.",
          "`terpotong` = got deducted unintentionally; common when money is automatically deducted.",
          "VN-speaker trap: saying `saldo sudah hilang`. Banks use `saldo terpotong` or `saldo berkurang`.",
        ],
      },
      {
        en: "Uangnya belum masuk ke rekening penerima.",
        vi: "Tiền vẫn chưa vào tài khoản người nhận.",
        pronunciation_focus: [
          "U-ang-nya be-LUM MA-suk ke re-KE-ning pe-ne-RI-ma - `penerima` = người nhận.",
          "`belum masuk` = chưa vào/chưa nhận được; khác `tidak masuk` = không vào.",
          "Lỗi người Việt: dùng `tidak` khi còn đang chờ. Nếu chưa xong, dùng `belum`.",
        ],
        pronunciation_focus_en: [
          "OO-ang-nya be-LOOM MA-sook ke re-KE-ning pe-ne-REE-ma - `penerima` = recipient.",
          "`belum masuk` = has not arrived yet; different from `tidak masuk` = does not enter.",
          "VN-speaker trap: using `tidak` while still waiting. If it is not done yet, use `belum`.",
        ],
      },
      {
        en: "Saya punya bukti transfer dan nomor referensi.",
        vi: "Tôi có bằng chứng chuyển khoản và số tham chiếu.",
        pronunciation_focus: [
          "SA-ya PUN-ya BUK-ti TRANS-fer dan NO-mor re-fe-REN-si - `nomor referensi` = số tham chiếu giao dịch.",
          "`punya` = có; tự nhiên khi nói mình có bằng chứng/tài liệu.",
          "Lỗi người Việt: gọi `referensi` là `kode` trong mọi trường hợp. Nếu app ghi `nomor referensi`, dùng đúng cụm đó.",
        ],
        pronunciation_focus_en: [
          "SA-ya POON-ya BOOK-tee TRANS-fer dan NO-mor re-fe-REN-see - `nomor referensi` = transaction reference number.",
          "`punya` = have; natural when saying you have proof/documents.",
          "VN-speaker trap: calling every reference a `kode`. If the app says `nomor referensi`, use that phrase.",
        ],
      },
      {
        en: "Kapan dana akan dikembalikan?",
        vi: "Khi nào tiền sẽ được hoàn lại?",
        pronunciation_focus: [
          "KA-pan DA-na A-kan di-kem-BA-li-kan - `dana` = khoản tiền/quỹ; `dikembalikan` = được hoàn lại.",
          "`akan` = sẽ; dùng khi hỏi quy trình xử lý sau.",
          "Lỗi người Việt: nói `uang kembali kapan?` nghe thô. Câu dịch vụ chuẩn: `Kapan dana akan dikembalikan?`",
        ],
        pronunciation_focus_en: [
          "KA-pan DA-na A-kan dee-kem-BA-lee-kan - `dana` = funds; `dikembalikan` = returned/refunded.",
          "`akan` = will; useful when asking about the next process.",
          "VN-speaker trap: saying blunt `uang kembali kapan?`. Service-style wording: `Kapan dana akan dikembalikan?`",
        ],
      },
      {
        en: "Mohon bantu cek status transaksi ini.",
        vi: "Vui lòng giúp kiểm tra trạng thái giao dịch này.",
        pronunciation_focus: [
          "MO-hon BAN-tu CEK STA-tus trans-AK-si I-ni - `mohon bantu` = kính nhờ/vui lòng giúp.",
          "`status transaksi` = trạng thái giao dịch; cụm app/ngân hàng rất phổ biến.",
          "Lỗi người Việt: dùng `tolong` mọi lúc. `Tolong` đúng, nhưng với ngân hàng `mohon bantu` lịch sự hơn.",
        ],
        pronunciation_focus_en: [
          "MO-hon BAN-too CHEK STA-tus trans-AK-see EE-nee - `mohon bantu` = please help, more formal.",
          "`status transaksi` = transaction status; very common in apps and banking.",
          "VN-speaker trap: using `tolong` every time. `Tolong` is correct, but `mohon bantu` is more polite for banks.",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi giao dịch gagal nhưng saldo terpotong, đừng chỉ nói 'tiền mất'. Ngân hàng cần thông tin cụ thể: waktu transaksi, nominal, nomor rekening tujuan, bukti transfer, nomor referensi, và ảnh lỗi nếu có. Ở Indonesia, `dana` trong ngữ cảnh ngân hàng nghĩa là khoản tiền, không nhất thiết là ví DANA. Viết ngắn, lịch sự, có dữ kiện sẽ giúp nhân viên xử lý nhanh hơn.",
    cultural_notes_en:
      "When a transaction fails but the balance is deducted, do not just say 'the money is gone'. Banks need specific information: transaction time, amount, destination account number, proof of transfer, reference number, and an error screenshot if available. In Indonesian banking, `dana` means funds and does not necessarily mean the DANA e-wallet. Short, polite, factual writing helps staff process the case faster.",
    tip_advice_vi:
      "Mẫu báo lỗi tốt: sự việc + bằng chứng + yêu cầu. Ví dụ: `Transaksi saya gagal, tetapi saldo sudah terpotong. Saya punya bukti transfer dan nomor referensi. Mohon bantu cek status transaksi ini.` Đây là câu đủ lịch sự và đủ thông tin.",
    tip_advice_en:
      "A good problem report is: fact + evidence + request. Example: `Transaksi saya gagal, tetapi saldo sudah terpotong. Saya punya bukti transfer dan nomor referensi. Mohon bantu cek status transaksi ini.` It is polite and information-rich.",
    vocabulary: [
      { word: "transaksi", en: "transaction", vi: "giao dịch", pos: "noun", pronunciation_vi: "trans-AK-si", pronunciation_en: "trans-AK-see" },
      { word: "gagal", en: "failed", vi: "thất bại", pos: "adjective/verb", pronunciation_vi: "GA-gal", pronunciation_en: "GA-gal" },
      { word: "terpotong", en: "deducted", vi: "bị trừ", pos: "verb", pronunciation_vi: "ter-PO-tong", pronunciation_en: "ter-PO-tong" },
      { word: "penerima", en: "recipient", vi: "người nhận", pos: "noun", pronunciation_vi: "pe-ne-RI-ma", pronunciation_en: "pe-ne-REE-ma" },
      { word: "nomor referensi", en: "reference number", vi: "số tham chiếu", pos: "noun phrase", pronunciation_vi: "NO-mor re-fe-REN-si", pronunciation_en: "NO-mor re-fe-REN-see" },
      { word: "dikembalikan", en: "returned/refunded", vi: "được hoàn lại", pos: "passive verb", pronunciation_vi: "di-kem-BA-li-kan", pronunciation_en: "dee-kem-BA-lee-kan" },
      { word: "mohon bantu", en: "please help", vi: "vui lòng giúp", pos: "polite phrase", pronunciation_vi: "MO-hon BAN-tu", pronunciation_en: "MO-hon BAN-too" },
    ],
    dialogue: [
      { speaker: "Nasabah", text: "Transaksi saya gagal, tetapi saldo sudah terpotong.", vi: "Giao dịch của tôi thất bại, nhưng số dư đã bị trừ.", en: "My transaction failed, but my balance was deducted." },
      { speaker: "Petugas bank", text: "Mohon kirim bukti transfer dan nomor referensi.", vi: "Vui lòng gửi bằng chứng chuyển khoản và số tham chiếu.", en: "Please send the proof of transfer and reference number." },
      { speaker: "Nasabah", text: "Baik. Kapan dana akan dikembalikan?", vi: "Vâng. Khi nào tiền sẽ được hoàn lại?", en: "Okay. When will the funds be returned?" },
    ],
    exercises: [
      {
        type: "scenario",
        instruction_vi: "Chọn câu phù hợp cho tình huống.",
        instruction_en: "Choose the suitable sentence for the situation.",
        items: [
          { prompt: "Giao dịch lỗi nhưng tiền bị trừ.", answer: "Transaksi saya gagal, tetapi saldo sudah terpotong." },
          { prompt: "Tiền chưa vào tài khoản người nhận.", answer: "Uangnya belum masuk ke rekening penerima." },
          { prompt: "Bạn muốn ngân hàng kiểm tra trạng thái.", answer: "Mohon bantu cek status transaksi ini." },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi có số tham chiếu.", answer: "Saya punya nomor referensi." },
          { prompt: "Khi nào tiền sẽ được hoàn lại?", answer: "Kapan dana akan dikembalikan?" },
        ],
      },
    ],
  },
];
