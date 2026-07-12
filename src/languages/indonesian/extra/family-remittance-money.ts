// Family remittance money Indonesian (Vietnamese -> Indonesian study track).
//
// A6 Wave 19 file. Covers kirim uang, keluarga di kampung, transfer,
// bukti kirim, biaya admin, kebutuhan rumah, and uang bulanan.
// Self-contained so no registry or sibling agent files are touched.
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
  cell_id?: string;
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
  cell_id?: string;
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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_family_remittance_money",
    level: "A2",
    category: "money",
    title_vi: "Gửi tiền về quê cho gia đình",
    title_en: "Sending money home to family",
    sentences: [
      {
        en: "Saya mau kirim uang untuk keluarga di kampung.",
        vi: "Tôi muốn gửi tiền cho gia đình ở quê.",
        pronunciation_focus: [
          "SA-ya mau KI-rim U-ang UN-tuk ke-LU-ar-ga di KAM-pung - `kirim uang` = gửi tiền; `keluarga di kampung` = gia đình ở quê.",
          "Lỗi người Việt: dịch 'về quê' thành `ke kampung` trong mọi câu. Nếu gia đình đang ở đó, dùng `di kampung`; nếu tiền đi đến đó, dùng `ke kampung`.",
          "Luyện: `Saya mau kirim uang untuk keluarga di kampung.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau KEE-rim OO-ang UN-tuk ke-LOO-ar-ga di KAM-pung - `kirim uang` = send money; `keluarga di kampung` = family back in the village/hometown.",
          "VN-speaker trap: translating 'back home' as `ke kampung` everywhere. If family is located there, use `di kampung`; if money moves there, use `ke kampung`.",
          "Drill: `Saya mau kirim uang untuk keluarga di kampung.`",
        ],
      },
      {
        en: "Setiap bulan saya transfer uang bulanan ke ibu.",
        vi: "Mỗi tháng tôi chuyển khoản tiền hằng tháng cho mẹ.",
        pronunciation_focus: [
          "se-TI-ap BU-lan SA-ya TRANS-fer U-ang bu-LA-nan ke I-bu - `uang bulanan` = tiền gửi/tiền hỗ trợ hằng tháng.",
          "`ke ibu` tự nhiên khi nói chuyển tiền đến mẹ. Nếu nói người nhận bằng tên, dùng `ke Ibu Sari` hoặc `kepada Ibu Sari` trang trọng hơn.",
          "Lỗi người Việt: nói `uang bulan` thiếu hậu tố. Cụm đúng là `uang bulanan`.",
        ],
        pronunciation_focus_en: [
          "se-TEE-ap BOO-lan SA-ya TRANS-fer OO-ang boo-LA-nan ke EE-boo - `uang bulanan` = monthly support money/allowance.",
          "`ke ibu` is natural when sending money to your mother. With a named recipient, use `ke Ibu Sari` or more formal `kepada Ibu Sari`.",
          "VN-speaker trap: saying `uang bulan` without the suffix. The phrase is `uang bulanan`.",
        ],
      },
      {
        en: "Uang ini untuk kebutuhan rumah dan biaya sekolah adik.",
        vi: "Số tiền này dùng cho nhu cầu trong nhà và học phí của em.",
        pronunciation_focus: [
          "U-ang I-ni UN-tuk ke-BU-tuh-an RU-mah dan BI-a-ya se-KO-lah A-dik - `kebutuhan rumah` = nhu cầu/chi phí sinh hoạt trong nhà.",
          "`adik` có thể là em trai hoặc em gái; tiếng Indonesia không bắt buộc phân biệt giới tính.",
          "Lỗi người Việt: dịch `kebutuhan` thành `perlu`. `Perlu` = cần; danh từ 'nhu cầu/chi phí cần thiết' là `kebutuhan`.",
        ],
        pronunciation_focus_en: [
          "OO-ang EE-nee UN-tuk ke-BOO-tooh-an ROO-mah dan BEE-a-ya se-KO-lah A-dik - `kebutuhan rumah` = household needs/expenses.",
          "`adik` can be younger brother or younger sister; Indonesian does not require gender here.",
          "VN-speaker trap: translating `kebutuhan` as `perlu`. `Perlu` = need; the noun 'needs/necessary expenses' is `kebutuhan`.",
        ],
      },
      {
        en: "Nomor rekening ayah masih sama, kan?",
        vi: "Số tài khoản của bố vẫn như cũ, đúng không?",
        pronunciation_focus: [
          "NO-mor re-KE-ning A-yah MA-sih SA-ma kan - `masih sama` = vẫn như cũ; `kan?` = đúng không?",
          "`ayah` là bố; trong hội thoại gia đình cũng có thể nghe `bapak` hoặc `papa`, tùy gia đình.",
          "Lỗi người Việt: dùng `akun` cho tài khoản ngân hàng. Ngân hàng dùng `rekening`, không phải `akun`.",
        ],
        pronunciation_focus_en: [
          "NO-mor re-KE-ning A-yah MA-sih SA-ma kan - `masih sama` = still the same; `kan?` = right?",
          "`ayah` means father; in family talk you may also hear `bapak` or `papa`, depending on the family.",
          "VN-speaker trap: using `akun` for a bank account. Banking uses `rekening`, not `akun`.",
        ],
      },
      {
        en: "Biaya adminnya berapa kalau transfer antarbank?",
        vi: "Phí admin là bao nhiêu nếu chuyển khoản liên ngân hàng?",
        pronunciation_focus: [
          "BI-a-ya AD-min-nya be-RA-pa KA-lau TRANS-fer an-tar-BANK - `biaya admin` = phí giao dịch; `antarbank` = liên ngân hàng.",
          "`kalau` = nếu/khi; câu này tự nhiên trước khi bấm chuyển tiền.",
          "Lỗi người Việt: quên hỏi phí vì nghĩ chuyển khoản luôn miễn phí. Nói rõ `biaya adminnya berapa?`",
        ],
        pronunciation_focus_en: [
          "BEE-a-ya AD-min-nya be-RA-pa KA-lau TRANS-fer an-tar-BANK - `biaya admin` = transaction/admin fee; `antarbank` = interbank.",
          "`kalau` = if/when; this is natural before confirming a transfer.",
          "VN-speaker trap: forgetting to ask the fee because you assume transfers are free. Ask clearly: `biaya adminnya berapa?`",
        ],
      },
      {
        en: "Tolong kirim bukti kirim setelah transfer berhasil.",
        vi: "Làm ơn gửi bằng chứng đã gửi tiền sau khi chuyển khoản thành công.",
        pronunciation_focus: [
          "TO-long KI-rim BUK-ti KI-rim se-TE-lah TRANS-fer ber-HA-sil - `bukti kirim` = bằng chứng đã gửi; `berhasil` = thành công.",
          "`bukti transfer` cũng rất phổ biến. `Bukti kirim` rộng hơn, có thể dùng cho app chuyển tiền hoặc dịch vụ gửi tiền.",
          "Lỗi người Việt: nói `bukti sudah kirim` trong cụm danh từ. Tự nhiên hơn: `bukti kirim` hoặc `bukti transfer`.",
        ],
        pronunciation_focus_en: [
          "TO-long KEE-rim BOOK-tee KEE-rim se-TE-lah TRANS-fer ber-HA-sil - `bukti kirim` = proof of sending; `berhasil` = successful.",
          "`bukti transfer` is also very common. `Bukti kirim` is broader and can fit money-transfer apps or remittance services.",
          "VN-speaker trap: saying `bukti sudah kirim` as a noun phrase. More natural: `bukti kirim` or `bukti transfer`.",
        ],
      },
      {
        en: "Saya sudah kirim bukti transfer lewat WhatsApp.",
        vi: "Tôi đã gửi bằng chứng chuyển khoản qua WhatsApp rồi.",
        pronunciation_focus: [
          "SA-ya SU-dah KI-rim BUK-ti TRANS-fer LE-wat WhatsApp - `lewat WhatsApp` = qua WhatsApp.",
          "`sudah` đánh dấu việc đã hoàn tất; trong chat có thể rút gọn thành `sudah saya kirim`.",
          "Lỗi người Việt: đặt `sudah` ở cuối câu theo kiểu 'rồi'. Tiếng Indonesia thường đặt trước động từ: `sudah kirim`.",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah KEE-rim BOOK-tee TRANS-fer LE-wat WhatsApp - `lewat WhatsApp` = via WhatsApp.",
          "`sudah` marks completion; in chat it can be shortened to `sudah saya kirim`.",
          "VN-speaker trap: putting `sudah` at the end like Vietnamese 'rồi'. Indonesian usually puts it before the verb: `sudah kirim`.",
        ],
      },
      {
        en: "Kalau uangnya belum masuk, kabari saya lagi.",
        vi: "Nếu tiền chưa vào tài khoản, báo lại cho tôi nhé.",
        pronunciation_focus: [
          "KA-lau U-ang-nya be-LUM MA-suk, ka-BA-ri SA-ya LA-gi - `uangnya masuk` = tiền vào tài khoản; `kabari` = báo tin cho.",
          "`belum` = chưa; khác với `tidak` = không. Giao dịch chậm thì nói `belum masuk`, không phải `tidak masuk` ngay.",
          "Lỗi người Việt: dịch 'báo tôi' thành `lapor saya`. Trong gia đình/chat thân mật, dùng `kabari saya`.",
        ],
        pronunciation_focus_en: [
          "KA-lau OO-ang-nya be-LOOM MA-suk, ka-BA-ree SA-ya LA-gee - `uangnya masuk` = the money has arrived in the account; `kabari` = let someone know.",
          "`belum` = not yet; different from `tidak` = not. For a delayed transaction, say `belum masuk`, not immediately `tidak masuk`.",
          "VN-speaker trap: translating 'tell/report me' as `lapor saya`. In family/chat contexts, use `kabari saya`.",
        ],
      },
      {
        en: "Bulan ini saya kirim lebih sedikit karena ada pengeluaran mendadak.",
        vi: "Tháng này tôi gửi ít hơn vì có khoản chi đột xuất.",
        pronunciation_focus: [
          "BU-lan I-ni SA-ya KI-rim LE-bih se-DI-kit ka-RE-na A-da pe-nge-LU-ar-an men-DA-dak - `lebih sedikit` = ít hơn; `pengeluaran mendadak` = khoản chi bất ngờ.",
          "`karena ada...` là cách giải thích mềm mại khi số tiền thay đổi.",
          "Lỗi người Việt: dùng `sedikit lagi` để nói 'ít hơn'. `Sedikit lagi` thường nghĩa là 'một chút nữa/sắp'. Dùng `lebih sedikit`.",
        ],
        pronunciation_focus_en: [
          "BOO-lan EE-nee SA-ya KEE-rim LE-bih se-DEE-kit ka-RE-na A-da pe-nge-LOO-ar-an men-DA-dak - `lebih sedikit` = less; `pengeluaran mendadak` = sudden expense.",
          "`karena ada...` is a soft way to explain why the amount changed.",
          "VN-speaker trap: using `sedikit lagi` for 'less'. `Sedikit lagi` often means 'a little more/almost'. Use `lebih sedikit`.",
        ],
      },
      {
        en: "Nanti kalau gajian, saya tambah kiriman untuk bulan depan.",
        vi: "Lát nữa/khi có lương, tôi sẽ gửi thêm cho tháng sau.",
        pronunciation_focus: [
          "NAN-ti KA-lau GA-ji-an, SA-ya TAM-bah ki-RIM-an UN-tuk BU-lan de-PAN - `gajian` = ngày nhận lương; `kiriman` = khoản gửi.",
          "`nanti kalau` ở đây nghĩa là 'sau này/khi'; không nhất thiết là tối nay.",
          "Lỗi người Việt: dịch 'gửi thêm' thành `kirim tambah`. Trật tự tự nhiên là `tambah kiriman` hoặc `kirim tambahan uang`.",
        ],
        pronunciation_focus_en: [
          "NAN-tee KA-lau GA-jee-an, SA-ya TAM-bah kee-RIM-an UN-tuk BOO-lan de-PAN - `gajian` = payday; `kiriman` = the sent amount/remittance.",
          "`nanti kalau` here means 'later/when'; it does not necessarily mean tonight.",
          "VN-speaker trap: translating 'send more' as `kirim tambah`. Natural order: `tambah kiriman` or `kirim tambahan uang`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, nhiều người làm việc ở thành phố thường gửi tiền về cho `keluarga di kampung` để hỗ trợ chi phí nhà, học phí, thuốc men, hoặc nhu cầu hằng ngày. Có thể chuyển qua mobile banking, ATM, ví điện tử, hoặc dịch vụ chuyển tiền. Trong gia đình, người nhận thường xác nhận `uangnya sudah masuk` và người gửi thường gửi `bukti transfer` qua WhatsApp. Khi số tiền thay đổi, giải thích bằng câu mềm như `bulan ini saya kirim lebih sedikit karena...` giúp tránh hiểu lầm.",
    cultural_notes_en:
      "In Indonesia, many people working in cities send money back to `keluarga di kampung` for household costs, school fees, medicine, or daily needs. Transfers can be done through mobile banking, ATMs, e-wallets, or remittance services. In family settings, the recipient often confirms `uangnya sudah masuk`, and the sender often shares `bukti transfer` by WhatsApp. If the amount changes, a soft explanation like `bulan ini saya kirim lebih sedikit karena...` helps avoid misunderstanding.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt `kirim uang` = gửi tiền nói chung, `transfer` = chuyển khoản, `rekening` = tài khoản ngân hàng, và `bukti transfer/bukti kirim` = bằng chứng đã gửi. Với tiền Indonesia, đừng bỏ bậc `ribu` và `juta`; `dua ratus ribu` là 200.000, không phải 200. Khi hỏi gia đình đã nhận chưa, nói tự nhiên: `Uangnya sudah masuk?`",
    tip_advice_en:
      "Tip for Vietnamese speakers: separate `kirim uang` = send money generally, `transfer` = bank transfer, `rekening` = bank account, and `bukti transfer/bukti kirim` = proof of sending. With Indonesian money, do not drop `ribu` and `juta`; `dua ratus ribu` is 200,000, not 200. To ask family whether it arrived, say naturally: `Uangnya sudah masuk?`",
    vocabulary: [
      { cell_id: "7d2a98e2-408b-4b34-abd6-530fe2fea052", word: "kirim uang", en: "send money", vi: "gửi tiền", pos: "verb phrase", pronunciation_vi: "KI-rim U-ang", pronunciation_en: "KEE-rim OO-ang" },
      { cell_id: "a1d97499-8165-434e-9912-b4b5bc55f547", word: "keluarga di kampung", en: "family back in the village/hometown", vi: "gia đình ở quê", pos: "noun phrase", pronunciation_vi: "ke-LU-ar-ga di KAM-pung", pronunciation_en: "ke-LOO-ar-ga di KAM-pung" },
      { cell_id: "7cb7f499-fa89-4387-881d-536c83df0540", word: "transfer", en: "transfer", vi: "chuyển khoản", pos: "verb/noun", pronunciation_vi: "TRANS-fer", pronunciation_en: "TRANS-fer" },
      { cell_id: "72a21929-e631-4236-99cb-04454398045c", word: "bukti kirim", en: "proof of sending", vi: "bằng chứng đã gửi", pos: "noun phrase", pronunciation_vi: "BUK-ti KI-rim", pronunciation_en: "BOOK-tee KEE-rim" },
      { cell_id: "56579c46-f5b3-442e-8d21-0e549107224b", word: "bukti transfer", en: "proof of transfer", vi: "bằng chứng chuyển khoản", pos: "noun phrase", pronunciation_vi: "BUK-ti TRANS-fer", pronunciation_en: "BOOK-tee TRANS-fer" },
      { cell_id: "37b12d4d-000a-4669-ba5e-09bbe33e6ea0", word: "biaya admin", en: "admin fee / transaction fee", vi: "phí admin/phí giao dịch", pos: "noun phrase", pronunciation_vi: "BI-a-ya AD-min", pronunciation_en: "BEE-a-ya AD-min" },
      { cell_id: "36c16e50-4922-4ed5-b0f9-80c2737c63da", word: "kebutuhan rumah", en: "household needs", vi: "nhu cầu/chi phí trong nhà", pos: "noun phrase", pronunciation_vi: "ke-BU-tuh-an RU-mah", pronunciation_en: "ke-BOO-tooh-an ROO-mah" },
      { cell_id: "a779591a-451a-4795-9abe-260d4ee49dc9", word: "uang bulanan", en: "monthly money / monthly support", vi: "tiền hằng tháng", pos: "noun phrase", pronunciation_vi: "U-ang bu-LA-nan", pronunciation_en: "OO-ang boo-LA-nan" },
      { cell_id: "2adea450-b5df-4344-90ef-5ca990b61cde", word: "uangnya masuk", en: "the money arrived in the account", vi: "tiền vào tài khoản", pos: "clause", pronunciation_vi: "U-ang-nya MA-suk", pronunciation_en: "OO-ang-nya MA-suk" },
      { cell_id: "45c01fd9-4a04-45b8-a379-e076c81c7147", word: "gajian", en: "payday", vi: "ngày nhận lương", pos: "noun", pronunciation_vi: "GA-ji-an", pronunciation_en: "GA-jee-an" },
    ],
    dialogue: [
      {
        cell_id: "24d01eaf-aeac-409b-bb6b-8f549377821d",
        speaker: "Rina",
        text: "Bu, nomor rekening Ayah masih sama, kan?",
        vi: "Mẹ ơi, số tài khoản của bố vẫn như cũ, đúng không?",
        en: "Mom, Dad's account number is still the same, right?",
      },
      {
        cell_id: "8bd568e2-fc5b-46f7-b80b-a964ae619511",
        speaker: "Ibu",
        text: "Iya, masih sama. Bulan ini uangnya untuk kebutuhan rumah dan obat nenek.",
        vi: "Ừ, vẫn như cũ. Tháng này tiền dùng cho nhu cầu trong nhà và thuốc của bà.",
        en: "Yes, still the same. This month the money is for household needs and Grandma's medicine.",
      },
      {
        cell_id: "926ec6a1-7c88-4f52-a10b-831384c06a98",
        speaker: "Rina",
        text: "Baik, saya transfer sore ini. Biaya adminnya kecil kalau lewat mobile banking.",
        vi: "Được, chiều nay con chuyển khoản. Phí admin nhỏ nếu chuyển qua mobile banking.",
        en: "Okay, I will transfer this afternoon. The admin fee is small through mobile banking.",
      },
      {
        cell_id: "995b8e28-8bb9-496c-9964-47389039d0f8",
        speaker: "Ibu",
        text: "Setelah transfer, kirim bukti transfer lewat WhatsApp, ya.",
        vi: "Sau khi chuyển khoản, gửi bằng chứng chuyển khoản qua WhatsApp nhé.",
        en: "After the transfer, send the proof of transfer via WhatsApp, okay?",
      },
      {
        cell_id: "45268c0f-9a16-4ed2-88d0-13237efc592c",
        speaker: "Rina",
        text: "Siap, Bu. Kalau uangnya belum masuk, kabari saya lagi.",
        vi: "Dạ được mẹ. Nếu tiền chưa vào tài khoản, báo lại cho con nhé.",
        en: "Sure, Mom. If the money has not arrived, let me know again.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ tiếng Indonesia với nghĩa tiếng Việt.",
        instruction_en: "Match the Indonesian phrase to the Vietnamese meaning.",
        items: [
          { prompt: "uang bulanan", answer: "tiền hằng tháng" },
          { prompt: "biaya admin", answer: "phí giao dịch" },
          { prompt: "kebutuhan rumah", answer: "nhu cầu/chi phí trong nhà" },
          { prompt: "bukti kirim", answer: "bằng chứng đã gửi" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi muốn gửi tiền cho gia đình ở quê.", answer: "Saya mau kirim uang untuk keluarga di kampung." },
          { prompt: "Phí admin là bao nhiêu?", answer: "Biaya adminnya berapa?" },
          { prompt: "Nếu tiền chưa vào tài khoản, báo lại cho tôi nhé.", answer: "Kalau uangnya belum masuk, kabari saya lagi." },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu.",
        instruction_en: "Fill in the missing word.",
        items: [
          { prompt: "Tolong kirim ___ transfer setelah selesai.", answer: "bukti" },
          { prompt: "Setiap bulan saya transfer uang ___ ke ibu.", answer: "bulanan" },
          { prompt: "Uang ini untuk ___ rumah.", answer: "kebutuhan" },
        ],
      },
    ],
  },
];
