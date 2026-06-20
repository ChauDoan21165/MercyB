// Online Review Reputation Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for online reviews and store reputation:
// five-star ratings, customer comments, replying to reviews, public complaints,
// and apologizing professionally. Indonesian target text lives in `en`,
// Vietnamese glosses in `vi`, Vietnamese L1 notes in `pronunciation_focus`, and
// English companions in `pronunciation_focus_en`.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
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
  /** Part of speech. */
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

// Loosely typed so per-type fields (translation, fill_blank, matching) can vary.
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

export const onlineReviewReputationLessons: IndonesianLesson[] = [
  {
    id: "indonesian_online_review_reputation",
    level: "B1",
    category: "business_communication",
    title_vi: "Ulasan online và reputasi toko",
    title_en: "Online reviews and store reputation",
    sentences: [
      {
        en: "Ulasan online sangat memengaruhi reputasi toko.",
        vi: "Đánh giá online ảnh hưởng rất lớn đến uy tín của cửa hàng.",
        pronunciation_focus: [
          "u-LA-san ON-lain - `ulasan online` = đánh giá/nhận xét trên mạng.",
          "`memengaruhi reputasi toko` = ảnh hưởng đến uy tín cửa hàng; gốc `pengaruh` = ảnh hưởng.",
          "Lỗi người Việt: dùng `review` mọi lúc được hiểu, nhưng từ Indonesia chuẩn là `ulasan`.",
          "Luyện: `Ulasan online memengaruhi reputasi toko.`",
        ],
        pronunciation_focus_en: [
          "u-LA-san ON-line - `ulasan online` = online review.",
          "`memengaruhi reputasi toko` = affects store reputation; root `pengaruh` = influence.",
          "VN-speaker trap: English `review` is understood, but standard Indonesian is `ulasan`.",
          "Drill: `Ulasan online memengaruhi reputasi toko.`",
        ],
      },
      {
        en: "Kami bersyukur mendapat rating bintang lima dari pelanggan.",
        vi: "Chúng tôi biết ơn vì nhận được đánh giá năm sao từ khách hàng.",
        pronunciation_focus: [
          "BIN-tang LI-ma - `bintang lima` = năm sao.",
          "`pelanggan` = khách hàng; trong bisnis trang trọng hơn `customer`.",
          "`bersyukur mendapat` = biết ơn khi nhận được; nghe ấm và chuyên nghiệp.",
          "Luyện: `Kami mendapat bintang lima.`",
        ],
        pronunciation_focus_en: [
          "BIN-tang LEE-ma - `bintang lima` = five stars.",
          "`pelanggan` = customer; more formal than English `customer` in Indonesian business writing.",
          "`bersyukur mendapat` = grateful to receive; warm and professional.",
          "Drill: `Kami mendapat bintang lima.`",
        ],
      },
      {
        en: "Komentar pelanggan membantu kami memperbaiki pelayanan.",
        vi: "Bình luận của khách hàng giúp chúng tôi cải thiện dịch vụ.",
        pronunciation_focus: [
          "ko-MEN-tar pe-LANG-gan - `komentar pelanggan` = bình luận khách hàng.",
          "`memperbaiki pelayanan` = cải thiện dịch vụ/phục vụ; gốc `baik` = tốt.",
          "Lỗi người Việt: dùng `membetulkan pelayanan` nghe như sửa đồ hỏng. Với chất lượng, dùng `memperbaiki`.",
          "Luyện: `Komentar pelanggan membantu kami.`",
        ],
        pronunciation_focus_en: [
          "ko-MEN-tar pe-LANG-gan - `komentar pelanggan` = customer comment.",
          "`memperbaiki pelayanan` = improve service; root `baik` = good.",
          "VN-speaker trap: `membetulkan pelayanan` sounds like fixing a broken object. For quality, use `memperbaiki`.",
          "Drill: `Komentar pelanggan membantu kami.`",
        ],
      },
      {
        en: "Tolong balas ulasan negatif dengan tenang dan sopan.",
        vi: "Hãy trả lời đánh giá tiêu cực một cách bình tĩnh và lịch sự.",
        pronunciation_focus: [
          "BA-las u-LA-san ne-GA-tif - `balas ulasan negatif` = trả lời đánh giá tiêu cực.",
          "`dengan tenang dan sopan` = một cách bình tĩnh và lịch sự.",
          "Lỗi người Việt: trả lời quá phòng thủ bằng `itu bukan salah kami`. Trong public reply, giữ giọng `tenang dan sopan`.",
          "Luyện: `Balas ulasan dengan sopan.`",
        ],
        pronunciation_focus_en: [
          "BA-las u-LA-san ne-GA-tif - `balas ulasan negatif` = reply to a negative review.",
          "`dengan tenang dan sopan` = calmly and politely.",
          "VN-speaker trap: replying defensively with `itu bukan salah kami`. In public replies, keep it `tenang dan sopan`.",
          "Drill: `Balas ulasan dengan sopan.`",
        ],
      },
      {
        en: "Kami mohon maaf atas pengalaman yang kurang menyenangkan.",
        vi: "Chúng tôi xin lỗi về trải nghiệm chưa vui/chưa hài lòng.",
        pronunciation_focus: [
          "MO-hon MA-af - `mohon maaf` = xin lỗi một cách lịch sự/trang trọng.",
          "`pengalaman yang kurang menyenangkan` = trải nghiệm chưa tốt; mềm hơn nói `pengalaman buruk`.",
          "Mẹo: khi xin lỗi công khai, dùng `kurang menyenangkan` để nhận trách nhiệm mà không làm căng thêm.",
          "Luyện: `Kami mohon maaf atas pengalaman ini.`",
        ],
        pronunciation_focus_en: [
          "MO-hon MA-af - `mohon maaf` = polite/formal apology.",
          "`pengalaman yang kurang menyenangkan` = unpleasant experience; softer than `pengalaman buruk`.",
          "Tip: in public apologies, `kurang menyenangkan` acknowledges the issue without escalating.",
          "Drill: `Kami mohon maaf atas pengalaman ini.`",
        ],
      },
      {
        en: "Mohon kirim nomor pesanan lewat pesan pribadi agar kami bisa cek.",
        vi: "Xin gửi số đơn hàng qua tin nhắn riêng để chúng tôi có thể kiểm tra.",
        pronunciation_focus: [
          "NO-mor pe-SA-nan - `nomor pesanan` = số đơn hàng.",
          "`pesan pribadi` = tin nhắn riêng/private message; hay dùng để chuyển khỏi komplain publik.",
          "`agar kami bisa cek` = để chúng tôi có thể kiểm tra; `agar` trang trọng hơn `supaya`.",
          "Luyện: `Mohon kirim nomor pesanan.`",
        ],
        pronunciation_focus_en: [
          "NO-mor pe-SA-nan - `nomor pesanan` = order number.",
          "`pesan pribadi` = private message; useful for moving away from a public complaint.",
          "`agar kami bisa cek` = so we can check; `agar` is more formal than `supaya`.",
          "Drill: `Mohon kirim nomor pesanan.`",
        ],
      },
      {
        en: "Komplain publik harus ditangani secepat mungkin.",
        vi: "Khiếu nại công khai phải được xử lý nhanh nhất có thể.",
        pronunciation_focus: [
          "kom-PLAIN PUB-lik - `komplain publik` = khiếu nại công khai.",
          "`ditangani` = được xử lý; bị động `di-` từ `tangani`.",
          "`secepat mungkin` = nhanh nhất có thể; cụm rất thường trong layanan pelanggan.",
          "Luyện: `Komplain harus ditangani secepat mungkin.`",
        ],
        pronunciation_focus_en: [
          "kom-PLAIN PUB-lik - `komplain publik` = public complaint.",
          "`ditangani` = handled; passive `di-` from `tangani`.",
          "`secepat mungkin` = as quickly as possible; common in customer service.",
          "Drill: `Komplain harus ditangani secepat mungkin.`",
        ],
      },
      {
        en: "Jangan menghapus komentar pelanggan tanpa alasan yang jelas.",
        vi: "Đừng xóa bình luận của khách hàng nếu không có lý do rõ ràng.",
        pronunciation_focus: [
          "JA-ngan meng-HA-pus - `jangan` dùng cho lệnh cấm; `menghapus` = xóa.",
          "`tanpa alasan yang jelas` = không có lý do rõ ràng.",
          "Lỗi người Việt: dùng `tidak hapus` như lệnh cấm. Mệnh lệnh phủ định phải dùng `jangan`.",
          "Luyện: `Jangan menghapus komentar.`",
        ],
        pronunciation_focus_en: [
          "JA-ngan meng-HA-poos - `jangan` is for negative commands; `menghapus` = delete.",
          "`tanpa alasan yang jelas` = without a clear reason.",
          "VN-speaker trap: using `tidak hapus` as a prohibition. Negative commands need `jangan`.",
          "Drill: `Jangan menghapus komentar.`",
        ],
      },
      {
        en: "Jika masalah sudah selesai, minta pelanggan memperbarui ulasan.",
        vi: "Nếu vấn đề đã được giải quyết, hãy xin khách hàng cập nhật đánh giá.",
        pronunciation_focus: [
          "mem-per-BA-ru-i u-LA-san - `memperbarui ulasan` = cập nhật đánh giá.",
          "`masalah sudah selesai` = vấn đề đã xong/được giải quyết.",
          "`minta pelanggan...` = nhờ/xin khách hàng; không dùng mệnh lệnh quá mạnh với pelanggan.",
          "Luyện: `Minta pelanggan memperbarui ulasan.`",
        ],
        pronunciation_focus_en: [
          "mem-per-BA-roo-i u-LA-san - `memperbarui ulasan` = update a review.",
          "`masalah sudah selesai` = the problem has been resolved.",
          "`minta pelanggan...` = ask the customer; avoid sounding too commanding with customers.",
          "Drill: `Minta pelanggan memperbarui ulasan.`",
        ],
      },
      {
        en: "Reputasi toko dibangun dari respons cepat dan pelayanan yang konsisten.",
        vi: "Uy tín cửa hàng được xây dựng từ phản hồi nhanh và dịch vụ nhất quán.",
        pronunciation_focus: [
          "re-pu-TA-si TO-ko - `reputasi toko` = uy tín/danh tiếng cửa hàng.",
          "`dibangun dari` = được xây dựng từ; bị động `di-` tự nhiên trong câu khái quát.",
          "`pelayanan yang konsisten` = dịch vụ nhất quán; cụm bisnis rất hữu ích.",
          "Luyện: `Reputasi toko dibangun dari pelayanan.`",
        ],
        pronunciation_focus_en: [
          "re-pu-TA-see TO-ko - `reputasi toko` = store reputation.",
          "`dibangun dari` = built from; passive `di-` is natural in general statements.",
          "`pelayanan yang konsisten` = consistent service; useful business phrase.",
          "Drill: `Reputasi toko dibangun dari pelayanan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở marketplace Indonesia, `ulasan online`, rating bintang, và komentar pelanggan ảnh hưởng trực tiếp đến kepercayaan pembeli. Người bán thường trả lời cả ulasan tốt lẫn buruk để cho thấy toko aktif. Với komplain publik, phản hồi nên nhanh, ngắn, lịch sự: cảm ơn, xin lỗi nếu cần, mời khách gửi nomor pesanan lewat pesan pribadi, rồi jelaskan tindak lanjut. Không nên tranh cãi dài trước công chúng.",
    cultural_notes_en:
      "On Indonesian marketplaces, online reviews, star ratings, and customer comments directly affect buyer trust. Sellers often reply to both positive and negative reviews to show the store is active. For public complaints, replies should be quick, short, and polite: thank the customer, apologize if needed, ask for the order number via private message, then explain the follow-up. Avoid long public arguments.",
    tip_advice_vi:
      "Mẹo cho người Việt: phản hồi review nên theo khung `Terima kasih` -> `mohon maaf` nếu có lỗi/trải nghiệm xấu -> `mohon kirim nomor pesanan` -> `kami cek segera`. Tránh câu đổ lỗi như `itu salah pembeli`. Dùng `kami` cho cửa hàng, không dùng `kita` nếu không muốn bao gồm khách.",
    tip_advice_en:
      "Tip for Vietnamese speakers: review replies can follow `Terima kasih` -> `mohon maaf` if there was a bad experience -> `mohon kirim nomor pesanan` -> `kami cek segera`. Avoid blame phrases like `itu salah pembeli`. Use `kami` for the store, not `kita`, unless you intentionally include the customer.",
    vocabulary: [
      {
        word: "ulasan online",
        en: "online review",
        vi: "đánh giá online",
        pos: "noun phrase",
        pronunciation_vi: "u-LA-san ON-lain",
        pronunciation_en: "u-LA-san ON-line",
      },
      {
        word: "bintang lima",
        en: "five stars",
        vi: "năm sao",
        pos: "noun phrase",
        pronunciation_vi: "BIN-tang LI-ma",
        pronunciation_en: "BIN-tang LEE-ma",
      },
      {
        word: "komentar pelanggan",
        en: "customer comment",
        vi: "bình luận khách hàng",
        pos: "noun phrase",
        pronunciation_vi: "ko-MEN-tar pe-LANG-gan",
        pronunciation_en: "ko-MEN-tar pe-LANG-gan",
      },
      {
        word: "reputasi toko",
        en: "store reputation",
        vi: "uy tín cửa hàng",
        pos: "noun phrase",
        pronunciation_vi: "re-pu-TA-si TO-ko",
        pronunciation_en: "re-pu-TA-see TO-ko",
      },
      {
        word: "balas ulasan",
        en: "reply to a review",
        vi: "trả lời đánh giá",
        pos: "verb phrase",
        pronunciation_vi: "BA-las u-LA-san",
        pronunciation_en: "BA-las u-LA-san",
      },
      {
        word: "komplain publik",
        en: "public complaint",
        vi: "khiếu nại công khai",
        pos: "noun phrase",
        pronunciation_vi: "kom-PLAIN PUB-lik",
        pronunciation_en: "kom-PLAIN PUB-lik",
      },
      {
        word: "mohon maaf",
        en: "please accept our apology",
        vi: "xin lỗi / mong thông cảm",
        pos: "phrase",
        pronunciation_vi: "MO-hon MA-af",
        pronunciation_en: "MO-hon MA-af",
      },
      {
        word: "pesan pribadi",
        en: "private message",
        vi: "tin nhắn riêng",
        pos: "noun phrase",
        pronunciation_vi: "PE-san pri-BA-di",
        pronunciation_en: "PE-san pri-BA-dee",
      },
      {
        word: "nomor pesanan",
        en: "order number",
        vi: "số đơn hàng",
        pos: "noun phrase",
        pronunciation_vi: "NO-mor pe-SA-nan",
        pronunciation_en: "NO-mor pe-SA-nan",
      },
      {
        word: "memperbarui ulasan",
        en: "update a review",
        vi: "cập nhật đánh giá",
        pos: "verb phrase",
        pronunciation_vi: "mem-per-BA-ru-i u-LA-san",
        pronunciation_en: "mem-per-BA-roo-i u-LA-san",
      },
    ],
    dialogue: [
      {
        speaker: "Admin Toko",
        text: "Kak, terima kasih atas ulasan online dan rating bintang lima.",
        vi: "Bạn ơi, cảm ơn về đánh giá online và rating năm sao.",
        en: "Hi, thank you for the online review and five-star rating.",
      },
      {
        speaker: "Pelanggan",
        text: "Barangnya bagus, tetapi pengirimannya agak lama.",
        vi: "Hàng tốt, nhưng giao hàng hơi lâu.",
        en: "The item is good, but delivery was a bit slow.",
      },
      {
        speaker: "Admin Toko",
        text: "Kami mohon maaf atas pengalaman yang kurang menyenangkan.",
        vi: "Chúng tôi xin lỗi về trải nghiệm chưa hài lòng.",
        en: "We apologize for the unpleasant experience.",
      },
      {
        speaker: "Admin Toko",
        text: "Mohon kirim nomor pesanan lewat pesan pribadi agar kami bisa cek.",
        vi: "Xin gửi số đơn hàng qua tin nhắn riêng để chúng tôi có thể kiểm tra.",
        en: "Please send the order number via private message so we can check.",
      },
      {
        speaker: "Pelanggan",
        text: "Baik, saya kirim sekarang.",
        vi: "Được, tôi gửi ngay bây giờ.",
        en: "All right, I will send it now.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm từ review/reputasi còn thiếu:",
        instruction_en: "Fill in the missing review/reputation phrase:",
        items: [
          {
            prompt: "Ulasan online memengaruhi ___ toko.",
            answer: "reputasi",
            options: ["reputasi", "resepsi", "rekening"],
          },
          {
            prompt: "Kami bersyukur mendapat rating bintang ___.",
            answer: "lima",
            options: ["lima", "lama", "lupa"],
          },
          {
            prompt: "Mohon kirim nomor pesanan lewat pesan ___.",
            answer: "pribadi",
            options: ["pribadi", "publik", "produk"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ Indonesia với nghĩa tiếng Việt:",
        instruction_en: "Match the Indonesian phrase with its Vietnamese meaning:",
        items: [
          { prompt: "ulasan online", answer: "đánh giá online" },
          { prompt: "bintang lima", answer: "năm sao" },
          { prompt: "komentar pelanggan", answer: "bình luận khách hàng" },
          { prompt: "komplain publik", answer: "khiếu nại công khai" },
          { prompt: "mohon maaf", answer: "xin lỗi / mong thông cảm" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          {
            prompt: "Đánh giá online ảnh hưởng đến uy tín cửa hàng.",
            answer: "Ulasan online memengaruhi reputasi toko.",
          },
          {
            prompt: "Chúng tôi xin lỗi về trải nghiệm chưa hài lòng.",
            answer: "Kami mohon maaf atas pengalaman yang kurang menyenangkan.",
          },
          {
            prompt: "Khiếu nại công khai phải được xử lý nhanh nhất có thể.",
            answer: "Komplain publik harus ditangani secepat mungkin.",
          },
        ],
      },
    ],
  },
];

export default onlineReviewReputationLessons;
