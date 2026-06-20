// Currency exchange and remittance Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// money-transfer notes with English companions in pronunciation_focus_en.

export type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

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
    id: "indonesian_currency_exchange_remittance",
    level: "B1",
    category: "money",
    title_vi: "Đổi tiền và chuyển tiền quốc tế",
    title_en: "Currency exchange and international remittance",
    sentences: [
      {
        en: "Saya mau tukar uang dolar ke rupiah.",
        vi: "Tôi muốn đổi đô la sang rupiah.",
        pronunciation_focus: [
          "SA-ya mau TU-kar U-ang DO-lar ke RU-pi-ah - `tukar uang` = đổi tiền; `rupiah` = đồng rupiah.",
          "Lỗi người Việt: nói `exchange uang` hoặc `change money` chen tiếng Anh. Trong quầy, `tukar uang` rất tự nhiên.",
          "Luyện: `Saya mau tukar uang.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau TOO-kar OO-ang DO-lar keh ROO-pee-ah - `tukar uang` = exchange money; `rupiah` = Indonesian rupiah.",
          "VN-speaker trap: mixing English `exchange money` or `change money`. At a counter, `tukar uang` is natural.",
          "Drill: `Saya mau tukar uang.`",
        ],
      },
      {
        en: "Kurs hari ini berapa, ya?",
        vi: "Tỷ giá hôm nay là bao nhiêu ạ?",
        pronunciation_focus: [
          "KURS HA-ri I-ni be-RA-pa ya - `kurs` = tỷ giá; `hari ini` = hôm nay.",
          "`berapa` hỏi số cụ thể; trong quầy đổi tiền, đây là câu mở rất phổ biến.",
          "Lỗi người Việt: hỏi `rate` bằng tiếng Anh trong mọi nơi. Dùng `kurs` nghe tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "KOORS HAH-ree EE-nee beh-RAH-pah yah - `kurs` = exchange rate; `hari ini` = today.",
          "`berapa` asks for a number; this is a very common opener at a money changer.",
          "VN-speaker trap: asking `rate` in English everywhere. `Kurs` sounds more natural.",
        ],
      },
      {
        en: "Apakah ada biaya transfer untuk kirim uang ke luar negeri?",
        vi: "Có phí chuyển tiền để gửi tiền ra nước ngoài không?",
        pronunciation_focus: [
          "a-pa-KAH A-da bi-A-ya trans-FER UN-tuk KI-rim U-ang ke LU-ar ne-GE-ri - `biaya transfer` = phí chuyển khoản; `luar negeri` = nước ngoài.",
          "Lỗi người Việt: nói `fee transfer` trộn tiếng Anh. Cặp từ chuẩn là `biaya transfer` dan `kirim uang`.",
          "Luyện: `Biaya transfer berapa?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH AH-dah bee-AH-yah trans-FER OON-took KEE-rim OO-ang keh LOO-ar neh-GEH-ree - `biaya transfer` = transfer fee; `luar negeri` = abroad.",
          "VN-speaker trap: mixing `fee transfer` with English. Standard pair: `biaya transfer` and `kirim uang`.",
          "Drill: `Biaya transfer berapa?`",
        ],
      },
      {
        en: "Saya perlu bukti transaksi untuk arsip.",
        vi: "Tôi cần chứng từ giao dịch để lưu hồ sơ.",
        pronunciation_focus: [
          "SA-ya PER-lu BUK-ti trans-AK-si UN-tuk ar-SIP - `bukti transaksi` = chứng từ giao dịch; `arsip` = lưu hồ sơ.",
          "Lỗi người Việt: nói `bukti transaksi` nhưng bỏ `untuk arsip`. Nếu cần giấy tờ, nói mục đích rõ.",
          "Luyện: `Saya perlu bukti transaksi.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PER-loo BOOK-ti tran-SAK-see OON-took ar-SIP - `bukti transaksi` = transaction proof; `arsip` = archive/records.",
          "VN-speaker trap: saying `bukti transaksi` without the purpose. If you need paperwork, state the reason clearly.",
          "Drill: `Saya perlu bukti transaksi.`",
        ],
      },
      {
        en: "Saya mau kirim uang ke keluarga di Vietnam.",
        vi: "Tôi muốn gửi tiền cho gia đình ở Việt Nam.",
        pronunciation_focus: [
          "SA-ya mau KI-rim U-ang ke ke-LU-ar-ga di Vi-et-NAM - `kirim uang` = gửi tiền; `ke keluarga` = gửi cho gia đình.",
          "Lỗi người Việt: dùng `transfer ke family`. Trong tiếng Indonesia, `keluarga` và `kirim uang` là cặp tự nhiên hơn.",
          "Luyện: `Saya mau kirim uang ke keluarga.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau KEE-rim OO-ang keh ke-LOO-ar-gah dee Vee-et-NAM - `kirim uang` = send money; `ke keluarga` = to the family.",
          "VN-speaker trap: using `transfer ke family`. In Indonesian, `keluarga` and `kirim uang` sound much more natural.",
          "Drill: `Saya mau kirim uang ke keluarga.`",
        ],
      },
      {
        en: "Apakah saya perlu menunjukkan paspor?",
        vi: "Tôi có cần xuất trình hộ chiếu không?",
        pronunciation_focus: [
          "a-pa-KAH SA-ya PER-lu me-NUK-juk-kan PAS-por - `menunjukkan` = xuất trình/chỉ ra; `paspor` = hộ chiếu.",
          "Lỗi người Việt: dùng `show` trong quầy dịch vụ. Với giấy tờ, `menunjukkan paspor` là chuẩn hơn.",
          "Luyện: `Perlu menunjukkan paspor?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH SA-ya PER-loo meh-NOON-jook-kan PAS-por - `menunjukkan` = show/present; `paspor` = passport.",
          "VN-speaker trap: using English `show` at the counter. For documents, `menunjukkan paspor` is better.",
          "Drill: `Perlu menunjukkan paspor?`",
        ],
      },
      {
        en: "Uang rupiah ini bisa ditukar lagi kalau saya belum pakai.",
        vi: "Số tiền rupiah này có thể đổi lại nếu tôi chưa dùng không?",
        pronunciation_focus: [
          "U-ang ru-pi-AH ini BI-sa di-TU-kar LA-gi KA-lau SA-ya be-LUM PA-kai - `ditukar lagi` = đổi lại; `belum pakai` = chưa dùng.",
          "Lỗi người Việt: nói `can refund money` theo kiểu hoàn tiền. Với tiền mặt, thường là `ditukar lagi`.",
          "Luyện: `Bisa ditukar lagi?`",
        ],
        pronunciation_focus_en: [
          "OO-ang roo-pee-AH ee-nee BEE-sa dee-TOO-kar LAH-gee KAH-lau SAH-yah beh-LOOM PAH-kie - `ditukar lagi` = exchanged again; `belum pakai` = not used yet.",
          "VN-speaker trap: saying `refund money` like a product refund. For cash, people usually say `ditukar lagi`.",
          "Drill: `Bisa ditukar lagi?`",
        ],
      },
      {
        en: "Mohon kirim ke rekening bank saya, bukan tunai.",
        vi: "Xin hãy gửi vào tài khoản ngân hàng của tôi, không phải tiền mặt.",
        pronunciation_focus: [
          "MO-hon KI-rim ke re-KE-ning BANK SA-ya, bu-KAN TU-nai - `rekening bank` = tài khoản ngân hàng; `tunai` = tiền mặt.",
          "Lỗi người Việt: nói `cash` hoặc `wire` trong cùng một câu. Với chuyển tiền chính thức, dùng `rekening bank` và `tunai`.",
          "Luyện: `Mohon kirim ke rekening saya.`",
        ],
        pronunciation_focus_en: [
          "MO-hon KEE-rim keh reh-KEH-ning bangk SAH-yah, boo-KAHN TOO-nie - `rekening bank` = bank account; `tunai` = cash.",
          "VN-speaker trap: mixing `cash` or `wire` in one sentence. For official transfers, use `rekening bank` and `tunai`.",
          "Drill: `Mohon kirim ke rekening saya.`",
        ],
      },
      {
        en: "Kalau ada selisih kurs, tolong jelaskan sebelum saya bayar.",
        vi: "Nếu có chênh lệch tỷ giá, làm ơn giải thích trước khi tôi thanh toán.",
        pronunciation_focus: [
          "KA-lau A-da se-LI-sih KURS, TO-long je-LAS-kan se-BE-lum SA-ya BA-yar - `selisih kurs` = chênh lệch tỷ giá; `bayar` = trả tiền.",
          "Lỗi người Việt: nói `beda kurs` được, nhưng `selisih kurs` rõ và mang tính giao dịch hơn.",
          "Luyện: `Selisih kurs berapa?`",
        ],
        pronunciation_focus_en: [
          "KA-lau AH-dah seh-LEE-seeh KOORS, TOH-long jeh-LAHS-kan seh-BEH-lum SAH-yah BAH-yar - `selisih kurs` = exchange-rate difference; `bayar` = pay.",
          "VN-speaker trap: `beda kurs` is understood, but `selisih kurs` is more precise for transactions.",
          "Drill: `Selisih kurs berapa?`",
        ],
      },
      {
        en: "Saya sudah menerima bukti transaksi lewat email.",
        vi: "Tôi đã nhận được chứng từ giao dịch qua email.",
        pronunciation_focus: [
          "SA-ya SU-dah me-ne-RI-ma BUK-ti trans-AK-si LE-wat I-meil - `menerima` = nhận được; `lewat email` = qua email.",
          "Lỗi người Việt: dùng `receive` hoặc `terima` lẻ tẻ. `Menerima bukti transaksi` tự nhiên và đủ ý hơn.",
          "Luyện: `Saya sudah menerima bukti transaksi.`",
        ],
        pronunciation_focus_en: [
          "SAH-yah SOO-dah meh-neh-REE-ma BOOK-ti tran-SAK-see LEH-wat EE-male - `menerima` = receive; `lewat email` = via email.",
          "VN-speaker trap: using scattered English `receive`. `Menerima bukti transaksi` is natural and complete.",
          "Drill: `Saya sudah menerima bukti transaksi.`",
        ],
      },
      {
        en: "Saya perlu uang rupiah untuk transportasi hari ini.",
        vi: "Tôi cần tiền rupiah cho việc đi lại hôm nay.",
        pronunciation_focus: [
          "SA-ya PER-lu U-ang ru-pi-AH UN-tuk trans-por-TA-si HA-ri I-ni - `uang rupiah` = tiền rupiah; `transportasi` = đi lại/di chuyển.",
          "Lỗi người Việt: nói `cash rupiah` hoặc chỉ `uang` mà không nói rõ mata uang. `Uang rupiah` ro hơn.",
          "Luyện: `Perlu uang rupiah.`",
        ],
        pronunciation_focus_en: [
          "SAH-yah PER-loo OO-ang roo-pee-AH OON-took trans-por-TAH-see HAH-ree EE-nee - `uang rupiah` = rupiah cash; `transportasi` = transportation.",
          "VN-speaker trap: saying `cash rupiah` or only `uang` without naming the currency. `Uang rupiah` is clearer.",
          "Drill: `Perlu uang rupiah.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Di Indonesia, `money changer` sering ada di bandara, mall, dan area turis. Người ta thường so sánh `kurs` sebelum đổi tiền, karena mỗi tempat bisa khác nhau và mungkin ada `biaya transfer` atau selisih kurs. Với kirim uang ke luar negeri, beberapa layanan minta paspor, nomor rekening, nama penerima, dan tujuan transfer. Saat menerima `bukti transaksi`, simpan baik-baik karena bisa dipakai untuk cek status atau komplain.",
    cultural_notes_en:
      "In Indonesia, money changers are often found at airports, malls, and tourist areas. People usually compare the `kurs` before exchanging money because rates can vary by location and there may be a `biaya transfer` or exchange-rate spread. For sending money abroad, some services ask for a passport, account number, recipient name, and transfer purpose. When you receive a `bukti transaksi`, keep it safe because it can be used to check status or make a complaint.",
    tip_advice_vi:
      "Mẹo cho người Việt: học bộ câu ngắn nhưng dùng được ngay: `Saya mau tukar uang`, `Kurs hari ini berapa?`, `Biaya transfer berapa?`, `Apakah saya perlu menunjukkan paspor?`, `Mohon kirim ke rekening bank saya`, `Saya sudah menerima bukti transaksi`. Với tiền mặt, nói `ditukar lagi`; với chuyển khoản, nói `transfer` dan `bukti transaksi`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn short phrases you can use immediately: `Saya mau tukar uang`, `Kurs hari ini berapa?`, `Biaya transfer berapa?`, `Apakah saya perlu menunjukkan paspor?`, `Mohon kirim ke rekening bank saya`, `Saya sudah menerima bukti transaksi`. For cash, say `ditukar lagi`; for transfers, use `transfer` and `bukti transaksi`.",
    vocabulary: [
      { word: "tukar uang", en: "exchange money", vi: "đổi tiền", pos: "verb phrase", pronunciation_vi: "TU-kar U-ang", pronunciation_en: "TOO-kar OO-ang" },
      { word: "kurs", en: "exchange rate", vi: "tỷ giá", pos: "noun", pronunciation_vi: "KURS", pronunciation_en: "KOORS" },
      { word: "money changer", en: "money changer", vi: "quầy đổi tiền", pos: "noun phrase", pronunciation_vi: "MA-ni CHEN-ger", pronunciation_en: "MUH-nee CHAYN-jer" },
      { word: "kirim uang", en: "send money", vi: "gửi tiền", pos: "verb phrase", pronunciation_vi: "KI-rim U-ang", pronunciation_en: "KEE-rim OO-ang" },
      { word: "biaya transfer", en: "transfer fee", vi: "phí chuyển khoản", pos: "noun phrase", pronunciation_vi: "BI-a-ya trans-FER", pronunciation_en: "BEE-a-ya trans-FER" },
      { word: "bukti transaksi", en: "transaction proof", vi: "chứng từ giao dịch", pos: "noun phrase", pronunciation_vi: "BUK-ti trans-AK-si", pronunciation_en: "BOOK-ti tran-SAK-see" },
      { word: "paspor", en: "passport", vi: "hộ chiếu", pos: "noun", pronunciation_vi: "PAS-por", pronunciation_en: "PAS-por" },
      { word: "rupiah", en: "rupiah", vi: "đồng rupiah", pos: "noun", pronunciation_vi: "ru-pi-AH", pronunciation_en: "roo-pee-AH" },
      { word: "rekening bank", en: "bank account", vi: "tài khoản ngân hàng", pos: "noun phrase", pronunciation_vi: "re-KE-ning BANK", pronunciation_en: "reh-KEH-ning BANK" },
      { word: "selisih kurs", en: "exchange-rate difference", vi: "chênh lệch tỷ giá", pos: "noun phrase", pronunciation_vi: "se-LI-sih KURS", pronunciation_en: "seh-LEE-seeh KOORS" },
    ],
    dialogue: [
      {
        speaker: "Pelanggan",
        text: "Saya mau tukar uang dolar ke rupiah. Kurs hari ini berapa?",
        vi: "Tôi muốn đổi đô la sang rupiah. Tỷ giá hôm nay là bao nhiêu?",
        en: "I want to exchange dollars into rupiah. What is today's exchange rate?",
      },
      {
        speaker: "Petugas",
        text: "Baik, mohon tunjukkan paspor, ya.",
        vi: "Vâng, xin vui lòng xuất trình hộ chiếu nhé.",
        en: "All right, please show your passport.",
      },
      {
        speaker: "Pelanggan",
        text: "Apakah ada biaya transfer kalau saya kirim uang ke luar negeri?",
        vi: "Có phí chuyển tiền nếu tôi gửi tiền ra nước ngoài không?",
        en: "Is there a transfer fee if I send money abroad?",
      },
      {
        speaker: "Petugas",
        text: "Ada, dan kami akan beri bukti transaksi lewat email.",
        vi: "Có, và chúng tôi sẽ gửi chứng từ giao dịch qua email.",
        en: "Yes, and we will send the transaction proof by email.",
      },
      {
        speaker: "Pelanggan",
        text: "Kalau ada selisih kurs, tolong jelaskan sebelum saya bayar.",
        vi: "Nếu có chênh lệch tỷ giá, làm ơn giải thích trước khi tôi thanh toán.",
        en: "If there is an exchange-rate difference, please explain it before I pay.",
      },
      {
        speaker: "Petugas",
        text: "Tentu, kami bisa kirim ke rekening bank Anda setelah transaksi selesai.",
        vi: "Tất nhiên, chúng tôi có thể gửi vào tài khoản ngân hàng của anh/chị sau khi giao dịch hoàn tất.",
        en: "Of course, we can send it to your bank account after the transaction is complete.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi muốn đổi đô la sang rupiah.",
        prompt_en: "Translate into Indonesian: I want to exchange dollars into rupiah.",
        answer: "Saya mau tukar uang dolar ke rupiah.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Kurs hari ini ____?",
        prompt_en: "Fill in the blank: Kurs hari ini ____?",
        answer: "berapa",
      },
      {
        type: "multiple_choice",
        prompt_vi: "`bukti transaksi` nghĩa là gì?",
        prompt_en: "What does `bukti transaksi` mean?",
        choices: ["chứng từ giao dịch / transaction proof", "hộ chiếu / passport", "tiền mặt / cash"],
        answer: "chứng từ giao dịch / transaction proof",
      },
      {
        type: "rewrite_formal",
        prompt_vi: "Viết lại lịch sự hơn: Saya mau transfer, kasih tahu fee-nya.",
        prompt_en: "Rewrite more politely: I want to transfer, tell me the fee.",
        answer: "Apakah ada biaya transfer untuk kirim uang ke luar negeri?",
      },
    ],
  },
];

export default lessons;
