// Small claims refund Indonesian (Vietnamese -> Indonesian study track).
//
// A6 Wave 28 file. Covers minta refund, barang tidak sesuai, bukti pembayaran,
// chat penjual, batas waktu, komplain sopan, and solusi.
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
    id: "indonesian_small_claims_refund",
    level: "B1",
    category: "shopping",
    title_vi: "Yêu cầu refund và khiếu nại nhỏ",
    title_en: "Small claims and refund requests",
    sentences: [
      {
        en: "Saya mau minta refund karena barang tidak sesuai pesanan.",
        vi: "Tôi muốn yêu cầu hoàn tiền vì hàng không đúng đơn đặt.",
        pronunciation_focus: [
          "SA-ya MAU MIN-ta RI-fan ka-RE-na BA-rang TI-dak se-SU-ai pe-SA-nan - `minta refund` = yêu cầu hoàn tiền; `barang tidak sesuai pesanan` = hàng không đúng đơn.",
          "`tidak sesuai` là cụm lịch sự và rõ trong khiếu nại mua bán.",
          "Lỗi người Việt: nói `barang salah` quá chung. Nếu hàng khác mô tả/đơn, dùng `barang tidak sesuai pesanan`.",
        ],
        pronunciation_focus_en: [
          "SA-ya MAU MIN-ta REE-fund ka-RE-na BA-rang TEE-dak se-SOO-ai pe-SA-nan - `minta refund` = request a refund; `barang tidak sesuai pesanan` = item does not match the order.",
          "`tidak sesuai` is polite and clear in purchase complaints.",
          "VN-speaker trap: saying generic `barang salah`. If the item differs from the listing/order, use `barang tidak sesuai pesanan`.",
        ],
      },
      {
        en: "Saya sudah kirim bukti pembayaran dan foto barang.",
        vi: "Tôi đã gửi bằng chứng thanh toán và ảnh món hàng.",
        pronunciation_focus: [
          "SA-ya SU-dah KI-rim BUK-ti pem-ba-YAR-an dan FO-to BA-rang - `bukti pembayaran` = bằng chứng thanh toán; `foto barang` = ảnh hàng.",
          "`sudah kirim` = đã gửi; `sudah` đứng trước động từ, không đặt cuối như tiếng Việt 'rồi'.",
          "Lỗi người Việt: nói `bukti bayar` trong câu trang trọng. Chat nhanh hiểu được, nhưng `bukti pembayaran` đầy đủ hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah KEE-rim BOOK-tee pem-ba-YAR-an dan FO-to BA-rang - `bukti pembayaran` = proof of payment; `foto barang` = item photo.",
          "`sudah kirim` = already sent; `sudah` comes before the verb, not at the end like Vietnamese 'rồi'.",
          "VN-speaker trap: saying shortened `bukti bayar` in a formal sentence. It is understood, but `bukti pembayaran` is fuller.",
        ],
      },
      {
        en: "Di chat penjual, saya sudah jelaskan masalahnya dengan sopan.",
        vi: "Trong chat với người bán, tôi đã giải thích vấn đề một cách lịch sự.",
        pronunciation_focus: [
          "di chat pen-JU-al, SA-ya SU-dah je-LAS-kan ma-SA-lah-nya de-NGAN SO-pan - `chat penjual` = chat với người bán; `dengan sopan` = một cách lịch sự.",
          "`penjual` = người bán. Người mua là `pembeli`.",
          "Lỗi người Việt: nói `seller` trong câu Indonesia đầy đủ. Trong marketplace có thể nghe, nhưng `penjual` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "di chat pen-JOO-al, SA-ya SOO-dah je-LAS-kan ma-SA-lah-nya de-NGAN SO-pan - `chat penjual` = seller chat; `dengan sopan` = politely.",
          "`penjual` = seller. Buyer is `pembeli`.",
          "VN-speaker trap: using English `seller` inside a full Indonesian sentence. Marketplace users may understand it, but `penjual` is more natural.",
        ],
      },
      {
        en: "Mohon cek kembali bukti yang saya lampirkan.",
        vi: "Mong anh/chị kiểm tra lại bằng chứng tôi đính kèm.",
        pronunciation_focus: [
          "MO-hon cek kem-BA-li BUK-ti yang SA-ya lam-PIR-kan - `mohon` = xin/mong; `lampirkan` = đính kèm.",
          "`mohon` nghe lịch sự hơn `tolong` trong khiếu nại bằng chat/email.",
          "Lỗi người Việt: nói `saya kirim bukti di atas` được hiểu, nhưng `bukti yang saya lampirkan` chuyên nghiệp hơn.",
        ],
        pronunciation_focus_en: [
          "MO-hon chek kem-BA-lee BOOK-tee yang SA-ya lam-PEER-kan - `mohon` = kindly/request; `lampirkan` = attach.",
          "`mohon` sounds more polite than `tolong` in complaint chat/email.",
          "VN-speaker trap: saying `saya kirim bukti di atas`, which is understood, but `bukti yang saya lampirkan` is more professional.",
        ],
      },
      {
        en: "Batas waktu pengajuan refund sampai kapan?",
        vi: "Hạn chót nộp yêu cầu refund là đến khi nào?",
        pronunciation_focus: [
          "BA-tas WAK-tu peng-a-JU-an RI-fan SAM-pai KA-pan - `batas waktu` = hạn chót; `pengajuan refund` = việc nộp yêu cầu hoàn tiền.",
          "`sampai kapan?` hỏi đến khi nào, rất hợp với deadline/batas waktu.",
          "Lỗi người Việt: hỏi `kapan batas waktu sampai?` rối trật tự. Câu gọn: `Batas waktunya sampai kapan?`",
        ],
        pronunciation_focus_en: [
          "BA-tas WAK-too peng-a-JOO-an REE-fund SAM-pai KA-pan - `batas waktu` = deadline/time limit; `pengajuan refund` = refund submission.",
          "`sampai kapan?` asks until when, useful for deadlines/time limits.",
          "VN-speaker trap: asking scrambled `kapan batas waktu sampai?`. Compact: `Batas waktunya sampai kapan?`",
        ],
      },
      {
        en: "Saya tidak ingin memperpanjang masalah, hanya minta solusi yang adil.",
        vi: "Tôi không muốn kéo dài vấn đề, chỉ xin giải pháp công bằng.",
        pronunciation_focus: [
          "SA-ya TI-dak I-ngin mem-per-PAN-jang ma-SA-lah, HA-nya MIN-ta so-LU-si yang A-dil - `memperpanjang masalah` = kéo dài vấn đề; `adil` = công bằng.",
          "`hanya minta...` làm yêu cầu mềm hơn nhưng vẫn rõ ý.",
          "Lỗi người Việt: nói `saya tidak mau ribut` có thể nghe cảm tính. Câu lịch sự hơn: `tidak ingin memperpanjang masalah`.",
        ],
        pronunciation_focus_en: [
          "SA-ya TEE-dak EE-ngin mem-per-PAN-jang ma-SA-lah, HA-nya MIN-ta so-LOO-see yang A-dil - `memperpanjang masalah` = prolong the issue; `adil` = fair.",
          "`hanya minta...` softens the request while staying clear.",
          "VN-speaker trap: saying `saya tidak mau ribut`, which can sound emotional. More polite: `tidak ingin memperpanjang masalah`.",
        ],
      },
      {
        en: "Kalau refund penuh tidak bisa, apakah ada penggantian barang?",
        vi: "Nếu không thể hoàn tiền đầy đủ, có đổi hàng thay thế không?",
        pronunciation_focus: [
          "KA-lau RI-fan PE-nuh TI-dak BI-sa, a-pa-KAH A-da peng-GAN-ti-an BA-rang - `refund penuh` = hoàn tiền đầy đủ; `penggantian barang` = đổi/thay hàng.",
          "`kalau... apakah...` là khung thương lượng nhẹ nhàng.",
          "Lỗi người Việt: dùng `ganti barang` như danh từ. Danh từ quy trình là `penggantian barang`.",
        ],
        pronunciation_focus_en: [
          "KA-lau REE-fund PE-nooh TEE-dak BEE-sa, a-pa-KAH A-da peng-GAN-tee-an BA-rang - `refund penuh` = full refund; `penggantian barang` = item replacement.",
          "`kalau... apakah...` is a gentle negotiation frame.",
          "VN-speaker trap: using `ganti barang` as a noun. The process noun is `penggantian barang`.",
        ],
      },
      {
        en: "Saya minta kepastian hari ini karena batas waktunya hampir habis.",
        vi: "Tôi xin xác nhận chắc chắn hôm nay vì hạn gần hết.",
        pronunciation_focus: [
          "SA-ya MIN-ta ke-PAS-ti-an HA-ri I-ni ka-RE-na BA-tas WAK-tu-nya HAM-pir HA-bis - `kepastian` = sự chắc chắn/xác nhận rõ; `hampir habis` = gần hết.",
          "`minta kepastian` là cụm mạnh nhưng vẫn lịch sự khi cần câu trả lời rõ.",
          "Lỗi người Việt: dịch `chắc chắn` thành tính từ trong mọi câu. Danh từ 'sự xác nhận rõ' là `kepastian`.",
        ],
        pronunciation_focus_en: [
          "SA-ya MIN-ta ke-PAS-tee-an HA-ree EE-nee ka-RE-na BA-tas WAK-too-nya HAM-pir HA-bis - `kepastian` = certainty/clear confirmation; `hampir habis` = almost over.",
          "`minta kepastian` is firm but still polite when you need a clear answer.",
          "VN-speaker trap: translating 'certain' as an adjective everywhere. The noun for clear confirmation is `kepastian`.",
        ],
      },
      {
        en: "Saya akan menyimpan semua bukti chat dan pembayaran.",
        vi: "Tôi sẽ lưu tất cả bằng chứng chat và thanh toán.",
        pronunciation_focus: [
          "SA-ya A-kan me-NYIM-pan se-MU-a BUK-ti chat dan pem-ba-YAR-an - `menyimpan` = lưu/giữ lại; `semua bukti` = tất cả bằng chứng.",
          "`akan` = sẽ, dùng khi nói việc định làm để bảo vệ quyền lợi.",
          "Lỗi người Việt: nói `simpan semua bukti` được trong nói nhanh, nhưng `akan menyimpan semua bukti` đầy đủ hơn.",
        ],
        pronunciation_focus_en: [
          "SA-ya A-kan me-NYIM-pan se-MOO-a BOOK-tee chat dan pem-ba-YAR-an - `menyimpan` = keep/save; `semua bukti` = all evidence.",
          "`akan` = will, useful when stating what you will do to protect your rights.",
          "VN-speaker trap: `simpan semua bukti` is fine in quick speech, but `akan menyimpan semua bukti` is fuller.",
        ],
      },
      {
        en: "Terima kasih, saya tunggu solusi dari pihak penjual.",
        vi: "Cảm ơn, tôi chờ giải pháp từ phía người bán.",
        pronunciation_focus: [
          "te-RI-ma KA-sih, SA-ya TUNG-gu so-LU-si da-ri PI-hak pen-JU-al - `pihak penjual` = phía người bán; `saya tunggu` = tôi chờ.",
          "`pihak` dùng khi nói bên/liên quan trong tranh chấp hoặc dịch vụ.",
          "Lỗi người Việt: kết thúc khiếu nại quá cộc. Câu này giữ lịch sự nhưng nhắc rõ bạn đang chờ giải pháp.",
        ],
        pronunciation_focus_en: [
          "te-REE-ma KA-sih, SA-ya TOONG-goo so-LOO-see da-ree PEE-hak pen-JOO-al - `pihak penjual` = seller side; `saya tunggu` = I await.",
          "`pihak` is used for a side/party in a dispute or service process.",
          "VN-speaker trap: ending a complaint too abruptly. This sentence stays polite while clearly saying you are waiting for a solution.",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong marketplace Indonesia, khi hàng không đúng mô tả hoặc không đúng đơn, người mua thường cần gửi `bukti pembayaran`, foto/video barang, và riwayat `chat penjual`. Giữ giọng `komplain sopan` rất quan trọng: nêu vấn đề, đính kèm bukti, hỏi `batas waktu`, rồi đề xuất `refund`, `penggantian barang`, hoặc solusi lain. Nhiều app có batas waktu untuk komplain/refund, nên hỏi sớm và lưu semua bukti.",
    cultural_notes_en:
      "In Indonesian marketplaces, when an item does not match the listing or order, buyers often need to send `bukti pembayaran`, item photos/videos, and seller chat history. Keeping a `komplain sopan` tone matters: state the problem, attach evidence, ask the `batas waktu`, then propose a refund, replacement, or another solution. Many apps have time limits for complaints/refunds, so ask early and keep all evidence.",
    tip_advice_vi:
      "Mẹo cho người Việt: khung khiếu nại nhỏ nên là: `Saya mau minta refund karena...`, `Saya lampirkan bukti...`, `Batas waktunya sampai kapan?`, `Saya berharap ada solusi yang adil.` Dùng `mohon`, `apakah`, và `terima kasih` để mềm giọng, nhưng giữ yêu cầu rõ.",
    tip_advice_en:
      "Tip for Vietnamese speakers: a small-claim frame should be: `Saya mau minta refund karena...`, `Saya lampirkan bukti...`, `Batas waktunya sampai kapan?`, `Saya berharap ada solusi yang adil.` Use `mohon`, `apakah`, and `terima kasih` to soften the tone while keeping the request clear.",
    vocabulary: [
      { cell_id: "8c8a68bb-5d0f-4072-8bfd-94a1e6e47af0", word: "minta refund", en: "request a refund", vi: "yêu cầu hoàn tiền", pos: "verb phrase", pronunciation_vi: "MIN-ta RI-fan", pronunciation_en: "MIN-ta REE-fund" },
      { cell_id: "83fb9de5-41b0-48f3-81a0-ce5983475b90", word: "barang tidak sesuai", en: "item does not match", vi: "hàng không phù hợp/không đúng", pos: "phrase", pronunciation_vi: "BA-rang TI-dak se-SU-ai", pronunciation_en: "BA-rang TEE-dak se-SOO-ai" },
      { cell_id: "6feb8e16-3d75-4d5c-9cd9-0cbe94984cd8", word: "bukti pembayaran", en: "proof of payment", vi: "bằng chứng thanh toán", pos: "noun phrase", pronunciation_vi: "BUK-ti pem-ba-YAR-an", pronunciation_en: "BOOK-tee pem-ba-YAR-an" },
      { cell_id: "7a05981a-42d0-4c1c-af3b-86541e975114", word: "chat penjual", en: "seller chat", vi: "chat với người bán", pos: "noun phrase", pronunciation_vi: "chat pen-JU-al", pronunciation_en: "chat pen-JOO-al" },
      { cell_id: "b0e36bb8-5333-49b3-86c9-e45def132924", word: "batas waktu", en: "deadline / time limit", vi: "hạn chót/giới hạn thời gian", pos: "noun phrase", pronunciation_vi: "BA-tas WAK-tu", pronunciation_en: "BA-tas WAK-too" },
      { cell_id: "05dfc9e9-02cc-4984-b0b7-816ede80f2cf", word: "komplain sopan", en: "polite complaint", vi: "khiếu nại lịch sự", pos: "noun phrase", pronunciation_vi: "kom-PLAIN SO-pan", pronunciation_en: "kom-PLAIN SO-pan" },
      { cell_id: "309e05f9-dadc-487a-98f3-743b473fb92f", word: "solusi", en: "solution", vi: "giải pháp", pos: "noun", pronunciation_vi: "so-LU-si", pronunciation_en: "so-LOO-see" },
      { cell_id: "747971f1-b7a5-482b-96c2-a6861c65ad38", word: "penggantian barang", en: "item replacement", vi: "đổi/thay hàng", pos: "noun phrase", pronunciation_vi: "peng-GAN-ti-an BA-rang", pronunciation_en: "peng-GAN-tee-an BA-rang" },
      { cell_id: "86a04e3d-8b6e-4f0d-8e2c-c81ff0e1cd11", word: "kepastian", en: "clear confirmation", vi: "sự xác nhận chắc chắn", pos: "noun", pronunciation_vi: "ke-PAS-ti-an", pronunciation_en: "ke-PAS-tee-an" },
      { cell_id: "cb659059-ba42-48d1-9f8f-5903496d5c6b", word: "pihak penjual", en: "seller side", vi: "phía người bán", pos: "noun phrase", pronunciation_vi: "PI-hak pen-JU-al", pronunciation_en: "PEE-hak pen-JOO-al" },
    ],
    dialogue: [
      {
        cell_id: "fb3e52cf-51a8-4fd8-8b59-2ab547f971eb",
        speaker: "Pembeli",
        text: "Halo, Kak. Saya mau minta refund karena barang tidak sesuai pesanan.",
        vi: "Chào anh/chị. Tôi muốn yêu cầu hoàn tiền vì hàng không đúng đơn.",
        en: "Hello. I want to request a refund because the item does not match the order.",
      },
      {
        cell_id: "e52bfed6-9adf-41f7-8fb7-a74da5d476fb",
        speaker: "Penjual",
        text: "Boleh kirim bukti pembayaran dan foto barangnya?",
        vi: "Bạn có thể gửi bằng chứng thanh toán và ảnh hàng không?",
        en: "Can you send proof of payment and a photo of the item?",
      },
      {
        cell_id: "0fc676c3-0a8f-4b24-a96e-a7bf66cd8e7f",
        speaker: "Pembeli",
        text: "Sudah saya lampirkan di chat ini. Mohon dicek kembali.",
        vi: "Tôi đã đính kèm trong chat này. Mong anh/chị kiểm tra lại.",
        en: "I have attached it in this chat. Please check it again.",
      },
      {
        cell_id: "43829018-2d46-4eee-aa20-1772293e6802",
        speaker: "Penjual",
        text: "Kami cek dulu, ya. Batas waktu pengajuan refund masih sampai besok.",
        vi: "Chúng tôi kiểm tra trước nhé. Hạn nộp yêu cầu refund vẫn đến ngày mai.",
        en: "We will check first. The refund submission deadline is still until tomorrow.",
      },
      {
        cell_id: "5d5fe6ca-0753-4ddd-8b2b-b2a53aaa9069",
        speaker: "Pembeli",
        text: "Baik. Saya tunggu solusi yang adil dari pihak penjual.",
        vi: "Được. Tôi chờ giải pháp công bằng từ phía người bán.",
        en: "Okay. I will wait for a fair solution from the seller side.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "minta refund", answer: "yêu cầu hoàn tiền" },
          { prompt: "bukti pembayaran", answer: "bằng chứng thanh toán" },
          { prompt: "batas waktu", answer: "hạn chót" },
          { prompt: "penggantian barang", answer: "đổi/thay hàng" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi muốn yêu cầu hoàn tiền vì hàng không đúng đơn.", answer: "Saya mau minta refund karena barang tidak sesuai pesanan." },
          { prompt: "Tôi đã gửi bằng chứng thanh toán và ảnh món hàng.", answer: "Saya sudah kirim bukti pembayaran dan foto barang." },
          { prompt: "Hạn chót nộp yêu cầu refund là đến khi nào?", answer: "Batas waktu pengajuan refund sampai kapan?" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu.",
        instruction_en: "Fill in the missing word.",
        items: [
          { prompt: "Mohon cek kembali bukti yang saya ___.", answer: "lampirkan" },
          { prompt: "Saya hanya minta solusi yang ___.", answer: "adil" },
          { prompt: "Saya akan menyimpan semua bukti chat dan ___.", answer: "pembayaran" },
        ],
      },
    ],
  },
];
