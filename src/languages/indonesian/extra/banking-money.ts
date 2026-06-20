// Banking & Money Indonesian (Vietnamese → Indonesian study track).
//
// NOTE: This file is self-contained — it declares an inline IndonesianLesson type
// that mirrors the sibling Indonesian `extra/*` files (e.g. immigration-government.ts),
// which in turn mirror the French `FrenchLesson` shape. When the shared Indonesian
// registry (src/languages/indonesian/lessons.ts) lands, swap the local types for a
// shared import.
//
// Field convention: the `en` field on a sentence holds the TARGET-LANGUAGE text
// (here: Indonesian), and `vi` holds the Vietnamese gloss. `pronunciation_focus`
// carries Vietnamese-facing pronunciation + grammar notes (incl. the common
// Vietnamese-speaker mistake = L1 note + a correction drill); `pronunciation_focus_en`
// is the English-speaker companion, same length + order.
//
// Banking Indonesian is practical but affix-heavy: the teller window runs on the
// `meN-` verbs `menabung` (save), `mentransfer` (transfer), `mengirim` (send),
// `mengambil`/`menarik` (withdraw), `menyetor` (deposit), and the `-an` nouns
// `tabungan` (savings), `pinjaman` (loan), `cicilan` (installment). For Vietnamese
// speakers the WIN is no conjugation/gender/tone; the trap is dropping `meN-`,
// forgetting the thousands/millions scale (`ribu`/`juta`), and the `di-` passive
// in "kartu saya diblokir".

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
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

// Loosely typed so per-type fields (translation, fill-blank, checklist) can vary.
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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_banking_money",
    level: "A2",
    category: "money",
    title_vi: "Tiếng Indonesia cho ngân hàng và tiền bạc",
    title_en: "Banking and money Indonesian",
    sentences: [
      // ── Opening an account ─────────────────────────────────────────────
      {
        en: "Saya mau membuka rekening tabungan.",
        vi: "Tôi muốn mở một tài khoản tiết kiệm.",
        pronunciation_focus: [
          "SA-ya mau mem-BU-ka re-KE-ning ta-BU-ngan — `membuka rekening` = mở tài khoản; `tabungan` = (tài khoản) tiết kiệm.",
          "Lỗi người Việt: nói `buka akun` (kiểu app). Ở ngân hàng dùng dạng đầy đủ `membuka rekening`.",
          "Luyện: `Saya mau membuka rekening tabungan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau mem-BU-ka re-KE-ning ta-BU-ngan — `membuka rekening` = to open an account; `tabungan` = savings (account).",
          "VN-speaker trap: saying `buka akun` (app-style). At a bank, use the full `membuka rekening`.",
          "Drill: `Saya mau membuka rekening tabungan.`",
        ],
      },
      {
        en: "Ini KTP dan paspor saya.",
        vi: "Đây là chứng minh thư (KTP) và hộ chiếu của tôi.",
        pronunciation_focus: [
          "I-ni KA-TE-PE dan PAS-por SA-ya — `KTP` đọc từng chữ 'ka-te-pe'; là thẻ căn cước Indonesia.",
          "Lỗi người Việt: người nước ngoài tưởng có KTP — bạn dùng `paspor` + `KITAS`. Đọc rõ `s` và `r` trong `paspor`.",
          "Luyện: `Ini paspor dan KITAS saya.`",
        ],
        pronunciation_focus_en: [
          "I-ni KA-TE-PE dan PAS-por SA-ya — `KTP` is spelled out 'ka-te-pe'; the Indonesian ID card.",
          "VN-speaker trap: foreigners have no KTP — you show `paspor` + `KITAS`. Sound both `s` and `r` in `paspor`.",
          "Drill: `Ini paspor dan KITAS saya.`",
        ],
      },
      {
        en: "Berapa setoran awal minimalnya?",
        vi: "Số tiền gửi ban đầu tối thiểu là bao nhiêu ạ?",
        pronunciation_focus: [
          "be-RA-pa se-TO-ran A-wal mi-ni-MAL-nya — `setoran awal` = khoản nộp ban đầu; `minimal` = tối thiểu.",
          "Lỗi người Việt: quên bậc `ribu`/`juta`. 'Năm mươi nghìn' = `lima puluh ribu`, không phải `lima puluh`.",
          "Luyện: `Berapa setoran awal minimalnya?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa se-TO-ran A-wal mi-ni-MAL-nya — `setoran awal` = initial deposit; `minimal` = minimum.",
          "VN-speaker trap: dropping the `ribu`/`juta` scale. 'Fifty thousand' = `lima puluh ribu`, not `lima puluh`.",
          "Drill: `Berapa setoran awal minimalnya?`",
        ],
      },
      // ── ATM & cards ────────────────────────────────────────────────────
      {
        en: "Saya mau menarik uang di ATM.",
        vi: "Tôi muốn rút tiền ở cây ATM.",
        pronunciation_focus: [
          "SA-ya mau me-NA-rik U-ang di A-TE-EM — `menarik uang` = rút tiền (gốc `tarik` + `meN-` → `me-narik`); `tarik tunai` = rút tiền mặt.",
          "Lỗi người Việt: nói `tarik uang` trống. Dạng chuẩn là `menarik`; ở máy thường ghi `tarik tunai`.",
          "Luyện: `Saya mau menarik uang di ATM.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau me-NA-rik U-ang di A-TE-EM — `menarik uang` = to withdraw money (root `tarik` + `meN-`); `tarik tunai` = cash withdrawal.",
          "VN-speaker trap: bare `tarik uang`. The standard verb is `menarik`; the machine label is `tarik tunai`.",
          "Drill: `Saya mau menarik uang di ATM.`",
        ],
      },
      {
        en: "Mesin ATM-nya menelan kartu saya.",
        vi: "Máy ATM nuốt mất thẻ của tôi.",
        pronunciation_focus: [
          "me-SIN A-TE-EM-nya me-ne-LAN KAR-tu SA-ya — `menelan` = nuốt (máy giữ thẻ); `kartu` = thẻ.",
          "Lỗi người Việt: nói `makan kartu`. Đúng chuyên ngành là `menelan kartu`. Đừng quên `-nya` (cái máy ấy).",
          "Luyện: `Mesin ATM-nya menelan kartu saya.`",
        ],
        pronunciation_focus_en: [
          "me-SIN A-TE-EM-nya me-ne-LAN KAR-tu SA-ya — `menelan` = to swallow (the machine keeps the card); `kartu` = card.",
          "VN-speaker trap: `makan kartu`. The proper term is `menelan kartu`. Keep the `-nya` (that machine).",
          "Drill: `Mesin ATM-nya menelan kartu saya.`",
        ],
      },
      {
        en: "Kartu saya hilang, tolong diblokir.",
        vi: "Thẻ của tôi bị mất, làm ơn khóa thẻ giúp.",
        pronunciation_focus: [
          "KAR-tu SA-ya HI-lang, TO-long di-blo-KIR — `hilang` = mất; `diblokir` (bị động `di-`) = bị/được khóa.",
          "Lỗi người Việt: né thể bị động, nói `tolong blokir`. Câu yêu cầu lịch sự chuẩn là `tolong diblokir`.",
          "Luyện: `Kartu saya hilang, tolong diblokir.`",
        ],
        pronunciation_focus_en: [
          "KAR-tu SA-ya HI-lang, TO-long di-blo-KIR — `hilang` = lost; `diblokir` (passive `di-`) = to be blocked.",
          "VN-speaker trap: avoiding the passive, saying `tolong blokir`. The polite request is `tolong diblokir`.",
          "Drill: `Kartu saya hilang, tolong diblokir.`",
        ],
      },
      // ── Transfers & savings ────────────────────────────────────────────
      {
        en: "Saya mau mentransfer uang ke rekening lain.",
        vi: "Tôi muốn chuyển tiền sang một tài khoản khác.",
        pronunciation_focus: [
          "SA-ya mau men-TRANS-fer U-ang ke re-KE-ning LA-in — `mentransfer` = chuyển khoản; `ke rekening lain` = sang tài khoản khác.",
          "Lỗi người Việt: nói `transfer` trống hoặc `chuyển`. Dạng động từ là `mentransfer`; `transfer antarbank` = chuyển liên ngân hàng.",
          "Luyện: `Saya mau mentransfer uang ke rekening lain.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau men-TRANS-fer U-ang ke re-KE-ning LA-in — `mentransfer` = to transfer; `ke rekening lain` = to another account.",
          "VN-speaker trap: bare `transfer`. The verb is `mentransfer`; `transfer antarbank` = interbank transfer.",
          "Drill: `Saya mau mentransfer uang ke rekening lain.`",
        ],
      },
      {
        en: "Berapa biaya admin untuk transfer antarbank?",
        vi: "Phí giao dịch cho chuyển khoản liên ngân hàng là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa BI-a-ya AD-min UN-tuk TRANS-fer an-tar-BANK — `biaya admin` = phí dịch vụ; `antarbank` = giữa các ngân hàng.",
          "Lỗi người Việt: tưởng miễn phí. Hỏi rõ `biaya admin`; chuyển BI-FAST thường chỉ ~Rp 2.500.",
          "Luyện: `Berapa biaya admin untuk transfer antarbank?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa BI-a-ya AD-min UN-tuk TRANS-fer an-tar-BANK — `biaya admin` = service fee; `antarbank` = between banks.",
          "VN-speaker trap: assuming it's free. Ask for the `biaya admin`; a BI-FAST transfer is usually ~Rp 2,500.",
          "Drill: `Berapa biaya admin untuk transfer antarbank?`",
        ],
      },
      {
        en: "Saya ingin menabung lima ratus ribu rupiah.",
        vi: "Tôi muốn gửi tiết kiệm năm trăm nghìn rupiah.",
        pronunciation_focus: [
          "SA-ya I-ngin me-NA-bung LI-ma RA-tus RI-bu ru-PI-ah — `menabung` = gửi tiết kiệm (gốc `tabung` + `meN-` → `me-nabung`); `lima ratus ribu` = 500.000.",
          "Lỗi người Việt: lẫn `menabung` (gửi tiết kiệm) với `menyetor` (nộp tiền vào). Tiết kiệm để dành = `menabung`.",
          "Luyện: `Saya ingin menabung lima ratus ribu rupiah.`",
        ],
        pronunciation_focus_en: [
          "SA-ya I-ngin me-NA-bung LI-ma RA-tus RI-bu ru-PI-ah — `menabung` = to save (root `tabung` + `meN-`); `lima ratus ribu` = 500,000.",
          "VN-speaker trap: confusing `menabung` (to save) with `menyetor` (to deposit). Putting money aside = `menabung`.",
          "Drill: `Saya ingin menabung lima ratus ribu rupiah.`",
        ],
      },
      {
        en: "Tolong cek saldo rekening saya.",
        vi: "Làm ơn kiểm tra số dư tài khoản của tôi.",
        pronunciation_focus: [
          "TO-long cek SAL-do re-KE-ning SA-ya — `cek saldo` = kiểm tra số dư; `saldo` = số dư còn lại.",
          "Lỗi người Việt: nói `số tiền`. Số dư tài khoản gọi đúng là `saldo`; lịch sử giao dịch là `mutasi`.",
          "Luyện: `Tolong cek saldo rekening saya.`",
        ],
        pronunciation_focus_en: [
          "TO-long cek SAL-do re-KE-ning SA-ya — `cek saldo` = check the balance; `saldo` = remaining balance.",
          "VN-speaker trap: saying `số tiền`. The account balance is `saldo`; the transaction history is `mutasi`.",
          "Drill: `Tolong cek saldo rekening saya.`",
        ],
      },
      // ── Credit & loans ─────────────────────────────────────────────────
      {
        en: "Saya mau mengajukan kredit untuk membeli motor.",
        vi: "Tôi muốn xin vay trả góp để mua xe máy.",
        pronunciation_focus: [
          "SA-ya mau me-nga-ju-KAN KRE-dit UN-tuk mem-BE-li MO-tor — `mengajukan` = đệ trình/xin (gốc `aju` + `meN-...-kan`); `kredit` = tín dụng/vay.",
          "Lỗi người Việt: nói `minta kredit`. Văn ngân hàng dùng `mengajukan kredit/pinjaman` (nộp đơn xin vay).",
          "Luyện: `Saya mau mengajukan kredit untuk membeli motor.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau me-nga-ju-KAN KRE-dit UN-tuk mem-BE-li MO-tor — `mengajukan` = to apply/submit (root `aju` + `meN-...-kan`); `kredit` = credit/loan.",
          "VN-speaker trap: `minta kredit`. Bank language is `mengajukan kredit/pinjaman` (to file a loan application).",
          "Drill: `Saya mau mengajukan kredit untuk membeli motor.`",
        ],
      },
      {
        en: "Berapa cicilan dan bunganya per bulan?",
        vi: "Tiền trả góp và lãi mỗi tháng là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa ci-CI-lan dan BU-nga-nya per BU-lan — `cicilan` = khoản trả góp; `bunga` = lãi suất; `per bulan` = mỗi tháng.",
          "Lỗi người Việt: `bunga` còn nghĩa 'hoa' — ở ngân hàng nó là 'lãi'. `cicilan` cũng gọi là `angsuran`.",
          "Luyện: `Berapa cicilan dan bunganya per bulan?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa ci-CI-lan dan BU-nga-nya per BU-lan — `cicilan` = installment; `bunga` = interest; `per bulan` = per month.",
          "VN-speaker trap: `bunga` also means 'flower' — at a bank it means 'interest'. `cicilan` is also `angsuran`.",
          "Drill: `Berapa cicilan dan bunganya per bulan?`",
        ],
      },
      // ── Sending money to Vietnam ───────────────────────────────────────
      {
        en: "Saya mau mengirim uang ke Vietnam.",
        vi: "Tôi muốn gửi tiền về Việt Nam.",
        pronunciation_focus: [
          "SA-ya mau me-NGI-rim U-ang ke vi-et-NAM — `mengirim uang` = gửi tiền (gốc `kirim` + `meN-`, `k` → `ng`); `ke Vietnam` = về Việt Nam.",
          "Lỗi người Việt: nói `kirim uang` trống. Dạng chuẩn `mengirim`; chuyển tiền quốc tế = `transfer/remitansi`.",
          "Luyện: `Saya mau mengirim uang ke Vietnam.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau me-NGI-rim U-ang ke vi-et-NAM — `mengirim uang` = to send money (root `kirim` + `meN-`, `k` → `ng`); `ke Vietnam` = to Vietnam.",
          "VN-speaker trap: bare `kirim uang`. The standard verb is `mengirim`; an international transfer is `transfer/remitansi`.",
          "Drill: `Saya mau mengirim uang ke Vietnam.`",
        ],
      },
      {
        en: "Berapa kursnya dari rupiah ke dong hari ini?",
        vi: "Hôm nay tỷ giá từ rupiah sang đồng là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa KURS-nya da-ri ru-PI-ah ke dong HA-ri I-ni — `kurs` = tỷ giá; `rupiah` → `dong` (đồng VN).",
          "Lỗi người Việt: nói `giá đổi`. Tỷ giá hối đoái gọi là `kurs`; ngoại tệ là `valas` (valuta asing).",
          "Luyện: `Berapa kursnya dari rupiah ke dong hari ini?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa KURS-nya da-ri ru-PI-ah ke dong HA-ri I-ni — `kurs` = exchange rate; `rupiah` → `dong` (VN dong).",
          "VN-speaker trap: saying `giá đổi`. The FX rate is `kurs`; foreign currency is `valas` (valuta asing).",
          "Drill: `Berapa kursnya dari rupiah ke dong hari ini?`",
        ],
      },
      {
        en: "Berapa lama uangnya sampai dan berapa biayanya?",
        vi: "Tiền mất bao lâu để tới và phí là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa LA-ma U-ang-nya SAM-pai dan be-RA-pa BI-a-ya-nya — `berapa lama` = mất bao lâu; `sampai` = tới nơi; `biaya` = phí.",
          "Lỗi người Việt: chỉ hỏi tỷ giá, quên phí + thời gian. Luôn hỏi cả ba: `kurs`, `biaya`, `berapa lama`.",
          "Luyện: `Berapa lama uangnya sampai dan berapa biayanya?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa LA-ma U-ang-nya SAM-pai dan be-RA-pa BI-a-ya-nya — `berapa lama` = how long; `sampai` = to arrive; `biaya` = fee.",
          "VN-speaker trap: asking only the rate, forgetting fee + time. Always ask all three: `kurs`, `biaya`, `berapa lama`.",
          "Drill: `Berapa lama uangnya sampai dan berapa biayanya?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Tiền Indonesia là `rupiah` (Rp), số rất nhiều chữ số: `ribu` = nghìn, `juta` = triệu (lương tháng cỡ `juta`). Các ngân hàng lớn: BCA, Mandiri, BRI, BNI. Chuyển khoản nhanh giữa các ngân hàng dùng hệ thống `BI-FAST` (phí ~Rp 2.500), cổng cũ `transfer antarbank` qua mạng ATM Bersama/Prima đắt hơn (~Rp 6.500). Ví điện tử (`OVO`, `Dana`, `GoPay`, `ShopeePay`) và mã `QRIS` phổ biến cho chi tiêu hằng ngày; ngân hàng dùng cho lương, tiết kiệm (`tabungan`), tiền gửi có kỳ hạn (`deposito`) và vay (`kredit`, trả góp = `cicilan`/`angsuran`). Người nước ngoài mở tài khoản cần `paspor` + `KITAS` (không có `KTP`). Để gửi tiền về Việt Nam, so sánh ngân hàng (SWIFT), `Wise`, `Western Union` và các dịch vụ `remitansi` — hỏi rõ `kurs` (tỷ giá), `biaya` (phí) và thời gian; đồng Việt Nam là `dong`. Lưu ý: MercyBlade không có hạng VIP — đừng dịch 'gói VIP' khi nói về dịch vụ ngân hàng `prioritas`.",
    cultural_notes_en:
      "Indonesia's currency is the `rupiah` (Rp), with many zeros: `ribu` = thousand, `juta` = million (a monthly salary is in `juta`). Major banks: BCA, Mandiri, BRI, BNI. Fast interbank transfers use the `BI-FAST` rail (fee ~Rp 2,500); the older `transfer antarbank` over the ATM Bersama/Prima networks costs more (~Rp 6,500). E-wallets (`OVO`, `Dana`, `GoPay`, `ShopeePay`) and the `QRIS` code dominate daily spending; banks handle salary, savings (`tabungan`), time deposits (`deposito`), and loans (`kredit`, installments = `cicilan`/`angsuran`). Foreigners opening an account bring `paspor` + `KITAS` (no `KTP`). To remit to Vietnam, compare bank SWIFT, `Wise`, `Western Union`, and `remitansi` services — ask for the `kurs` (rate), `biaya` (fee), and timing; the Vietnamese dong is `dong`. Note: MercyBlade has no VIP tier — don't render priority banking (`prioritas`) as a 'VIP package'.",
    tip_advice_vi:
      "Năm câu xương sống cho ngân hàng: (1) nêu việc — `Saya mau membuka rekening / menarik uang / mentransfer ___`; (2) hỏi tối thiểu/phí — `Berapa setoran awal minimalnya?` / `Berapa biaya adminnya?`; (3) kiểm tra — `Tolong cek saldo rekening saya.`; (4) sự cố — `Kartu saya hilang, tolong diblokir.`; (5) gửi về VN — `Saya mau mengirim uang ke Vietnam. Berapa kurs, biaya, dan berapa lama?`. Nhớ dùng dạng động từ ĐẦY ĐỦ (`meN-`): `menarik` không `tarik`, `mengirim` không `kirim`, `mentransfer` không `transfer`; và quen thể bị động `di-` (`diblokir`, `ditolak`). Đừng bao giờ bỏ bậc `ribu`/`juta` khi nói số tiền.",
    tip_advice_en:
      "Five backbone bank lines: (1) state your business — `Saya mau membuka rekening / menarik uang / mentransfer ___`; (2) ask minimum/fee — `Berapa setoran awal minimalnya?` / `Berapa biaya adminnya?`; (3) check — `Tolong cek saldo rekening saya.`; (4) trouble — `Kartu saya hilang, tolong diblokir.`; (5) remit to VN — `Saya mau mengirim uang ke Vietnam. Berapa kurs, biaya, dan berapa lama?`. Use the FULL verb form (`meN-`): `menarik` not `tarik`, `mengirim` not `kirim`, `mentransfer` not `transfer`; and get comfortable with the `di-` passive (`diblokir`, `ditolak`). Never drop the `ribu`/`juta` scale when saying an amount.",
    vocabulary: [
      {
        word: "rekening",
        en: "bank account",
        vi: "tài khoản ngân hàng",
        pos: "noun",
        pronunciation_vi: "re-KE-ning — `nomor rekening` = số tài khoản",
        pronunciation_en: "re-KE-ning — `nomor rekening` = account number",
      },
      {
        word: "tabungan",
        en: "savings (account)",
        vi: "(tài khoản) tiết kiệm",
        pos: "noun (-an)",
        pronunciation_vi: "ta-BU-ngan — từ `tabung` + `-an`; gửi tiết kiệm = `menabung`",
        pronunciation_en: "ta-BOO-ngan — from `tabung` + `-an`; to save = `menabung`",
      },
      {
        word: "menabung",
        en: "to save (money)",
        vi: "gửi tiết kiệm, để dành",
        pos: "verb (meN-)",
        pronunciation_vi: "me-NA-bung — gốc `tabung`, `t` rụng thành `me-nabung`",
        pronunciation_en: "me-NAH-boong — root `tabung`, the `t` drops: `me-nabung`",
      },
      {
        word: "menarik tunai",
        en: "to withdraw cash",
        vi: "rút tiền mặt",
        pos: "verb phrase",
        pronunciation_vi: "me-NA-rik TU-nai — nhãn ở ATM: `tarik tunai`",
        pronunciation_en: "me-NAH-rik TOO-nigh — ATM label: `tarik tunai`",
      },
      {
        word: "menyetor",
        en: "to deposit",
        vi: "nộp tiền vào (tài khoản)",
        pos: "verb (meN-)",
        pronunciation_vi: "me-nye-TOR — gốc `setor`, `s` → `meny-`; `setor tunai` = nộp tiền mặt",
        pronunciation_en: "me-nye-TOR — root `setor`, `s` → `meny-`; `setor tunai` = cash deposit",
      },
      {
        word: "mentransfer",
        en: "to transfer",
        vi: "chuyển khoản",
        pos: "verb (meN-)",
        pronunciation_vi: "men-TRANS-fer — `transfer antarbank` = chuyển liên ngân hàng",
        pronunciation_en: "men-TRANS-fer — `transfer antarbank` = interbank transfer",
      },
      {
        word: "mengirim uang",
        en: "to send money",
        vi: "gửi tiền (đi)",
        pos: "verb phrase",
        pronunciation_vi: "me-NGI-rim U-ang — gốc `kirim`, `k` → `ng`; quốc tế = `remitansi`",
        pronunciation_en: "me-NGEE-rim OO-ang — root `kirim`, `k` → `ng`; international = `remitansi`",
      },
      {
        word: "saldo",
        en: "balance",
        vi: "số dư",
        pos: "noun",
        pronunciation_vi: "SAL-do — `cek saldo` = kiểm tra số dư",
        pronunciation_en: "SAHL-doh — `cek saldo` = check the balance",
      },
      {
        word: "biaya admin",
        en: "administration fee",
        vi: "phí dịch vụ/giao dịch",
        pos: "noun phrase",
        pronunciation_vi: "BI-a-ya AD-min — luôn hỏi trước khi giao dịch",
        pronunciation_en: "BEE-ah-yah AD-min — always ask before a transaction",
      },
      {
        word: "kredit",
        en: "credit / loan",
        vi: "tín dụng, vay",
        pos: "noun",
        pronunciation_vi: "KRE-dit — vay = `mengajukan kredit/pinjaman`",
        pronunciation_en: "KREH-dit — to borrow = `mengajukan kredit/pinjaman`",
      },
      {
        word: "cicilan",
        en: "installment",
        vi: "khoản trả góp",
        pos: "noun (-an)",
        pronunciation_vi: "ci-CI-lan — từ `cicil` + `-an`; đồng nghĩa `angsuran`",
        pronunciation_en: "chee-CHEE-lan — from `cicil` + `-an`; synonym `angsuran`",
      },
      {
        word: "bunga",
        en: "interest (rate)",
        vi: "lãi suất",
        pos: "noun",
        pronunciation_vi: "BU-nga — cũng nghĩa 'hoa'; ở ngân hàng = 'lãi'",
        pronunciation_en: "BOO-ngah — also means 'flower'; at a bank = 'interest'",
      },
      {
        word: "kurs",
        en: "exchange rate",
        vi: "tỷ giá hối đoái",
        pos: "noun",
        pronunciation_vi: "kurs — ngoại tệ = `valas` (valuta asing)",
        pronunciation_en: "koors — foreign currency = `valas` (valuta asing)",
      },
      {
        word: "diblokir",
        en: "to be blocked (card)",
        vi: "bị khóa (thẻ)",
        pos: "verb (di- passive)",
        pronunciation_vi: "di-blo-KIR — `tolong diblokir` = làm ơn khóa thẻ giúp",
        pronunciation_en: "dee-bloh-KIR — `tolong diblokir` = please block (it)",
      },
    ],
    dialogue: [
      {
        speaker: "Nasabah",
        text: "Selamat pagi, Bu. Saya mau membuka rekening tabungan.",
        vi: "Chào buổi sáng, chị. Tôi muốn mở một tài khoản tiết kiệm.",
        en: "Good morning. I'd like to open a savings account.",
      },
      {
        speaker: "Teller",
        text: "Baik, Pak. Boleh saya lihat paspor dan KITAS-nya?",
        vi: "Vâng, anh. Cho tôi xem hộ chiếu và thẻ tạm trú (KITAS) được không ạ?",
        en: "Sure. May I see your passport and KITAS?",
      },
      {
        speaker: "Nasabah",
        text: "Ini. Berapa setoran awal minimalnya?",
        vi: "Đây ạ. Số tiền gửi ban đầu tối thiểu là bao nhiêu?",
        en: "Here you go. What's the minimum initial deposit?",
      },
      {
        speaker: "Teller",
        text: "Lima ratus ribu rupiah. Biaya admin lima belas ribu per bulan.",
        vi: "Năm trăm nghìn rupiah. Phí dịch vụ mười lăm nghìn mỗi tháng.",
        en: "Five hundred thousand rupiah. The admin fee is fifteen thousand per month.",
      },
      {
        speaker: "Nasabah",
        text: "Saya juga mau mengirim uang ke Vietnam. Berapa kurs dan biayanya?",
        vi: "Tôi cũng muốn gửi tiền về Việt Nam. Tỷ giá và phí là bao nhiêu?",
        en: "I also want to send money to Vietnam. What's the rate and the fee?",
      },
      {
        speaker: "Teller",
        text: "Bisa lewat transfer SWIFT, Pak. Nanti saya jelaskan kurs dan biayanya.",
        vi: "Có thể qua chuyển khoản SWIFT, anh. Tôi sẽ giải thích tỷ giá và phí sau.",
        en: "We can do a SWIFT transfer. I'll explain the rate and fee in a moment.",
      },
    ],
    exercises: [
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn mở một tài khoản tiết kiệm.", answer: "Saya mau membuka rekening tabungan." },
          { prompt: "Tôi muốn rút tiền ở cây ATM.", answer: "Saya mau menarik uang di ATM." },
          { prompt: "Làm ơn kiểm tra số dư tài khoản của tôi.", answer: "Tolong cek saldo rekening saya." },
          { prompt: "Thẻ của tôi bị mất, làm ơn khóa thẻ giúp.", answer: "Kartu saya hilang, tolong diblokir." },
          { prompt: "Phí giao dịch là bao nhiêu?", answer: "Berapa biaya adminnya?" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Thực hành thêm — gửi tiền về Việt Nam:",
        instruction_en: "Extra practice — sending money to Vietnam:",
        items: [
          { prompt: "Tôi muốn gửi tiền về Việt Nam.", answer: "Saya mau mengirim uang ke Vietnam." },
          { prompt: "Hôm nay tỷ giá từ rupiah sang đồng là bao nhiêu?", answer: "Berapa kursnya dari rupiah ke dong hari ini?" },
          { prompt: "Tiền mất bao lâu để tới?", answer: "Berapa lama uangnya sampai?" },
          { prompt: "Tôi muốn chuyển tiền sang một tài khoản khác.", answer: "Saya mau mentransfer uang ke rekening lain." },
          { prompt: "Tôi muốn gửi tiết kiệm năm trăm nghìn rupiah.", answer: "Saya ingin menabung lima ratus ribu rupiah." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi:
          "Đổi sang dạng động từ ĐẦY ĐỦ (meN-) dùng ở ngân hàng: `tarik` → ___, `kirim` → ___, `transfer` → ___, `tabung` → ___, `setor` → ___.",
        instruction_en:
          "Give the FULL bank verb form (meN-): `tarik` → ___, `kirim` → ___, `transfer` → ___, `tabung` → ___, `setor` → ___.",
        items: [
          { prompt: "tarik (rút) →", answer: "menarik" },
          { prompt: "kirim (gửi) →", answer: "mengirim" },
          { prompt: "transfer (chuyển) →", answer: "mentransfer" },
          { prompt: "tabung (để dành) →", answer: "menabung" },
          { prompt: "setor (nộp vào) →", answer: "menyetor" },
        ],
      },
      {
        type: "term_match",
        instruction_vi: "Ghép thuật ngữ với nghĩa:",
        instruction_en: "Match the term to its meaning:",
        items: [
          { prompt: "saldo", answer: "số dư tài khoản (account balance)" },
          { prompt: "kurs", answer: "tỷ giá hối đoái (exchange rate)" },
          { prompt: "cicilan", answer: "khoản trả góp (installment)" },
          { prompt: "bunga", answer: "lãi suất (interest)" },
          { prompt: "BI-FAST", answer: "hệ thống chuyển khoản nhanh giữa các ngân hàng (fast interbank transfer rail)" },
        ],
      },
      {
        type: "report_frame",
        instruction_vi:
          "Khung yêu cầu tại quầy — điền chỗ trống: `Selamat pagi, Pak/Bu. Saya mau ___. Ini paspor dan KITAS saya. Berapa biaya adminnya?`",
        instruction_en:
          "Counter-request frame — fill the blanks: `Selamat pagi, Pak/Bu. Saya mau ___. Ini paspor dan KITAS saya. Berapa biaya adminnya?`",
        example:
          "Selamat pagi, Bu. Saya mau mengirim uang ke Vietnam. Ini paspor dan KITAS saya. Berapa kurs, biaya, dan berapa lama uangnya sampai?",
        example_vi:
          "Chào buổi sáng, chị. Tôi muốn gửi tiền về Việt Nam. Đây là hộ chiếu và thẻ KITAS của tôi. Tỷ giá, phí và bao lâu tiền tới nơi?",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra ở ngân hàng — bạn làm được chưa?",
        instruction_en: "Quick bank self-check — can you do each one?",
        items: [
          { vi: "Tôi có thể nêu việc cần làm bằng `Saya mau …`.", en: "I can state my business with `Saya mau …`." },
          { vi: "Tôi nói số tiền có bậc `ribu`/`juta` đầy đủ.", en: "I say amounts with the full `ribu`/`juta` scale." },
          { vi: "Tôi dùng dạng động từ đầy đủ (menarik, mengirim, mentransfer).", en: "I use the full verb forms (menarik, mengirim, mentransfer)." },
          { vi: "Tôi hiểu thể bị động `di-` (diblokir, ditolak).", en: "I understand the `di-` passive (diblokir, ditolak)." },
          { vi: "Tôi hỏi cả tỷ giá, phí và thời gian khi gửi tiền về VN.", en: "I ask the rate, fee, and timing when remitting to Vietnam." },
          { vi: "Tôi phân biệt `menabung` (tiết kiệm) và `menyetor` (nộp vào).", en: "I distinguish `menabung` (save) from `menyetor` (deposit)." },
        ],
      },
    ],
  },
];

export default lessons;
