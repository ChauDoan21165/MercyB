// Marketplace seller return Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file following the established Indonesian extra
// lesson format: Indonesian target text lives in `en`, Vietnamese glosses live in
// `vi`, and each Vietnamese-facing learning note has an English companion.

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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_marketplace_seller_return",
    level: "B1",
    category: "shopping",
    title_vi: "Trả hàng trên marketplace: đổi trả, video và chính sách shop",
    title_en: "Marketplace returns: refunds, video proof and store policy",
    sentences: [
      {
        en: "Pembeli ini minta retur karena barangnya cacat.",
        vi: "Người mua này yêu cầu trả hàng vì món hàng bị lỗi.",
        pronunciation_focus: [
          "pem-BE-li = người mua; `minta retur` = yêu cầu trả hàng; `cacat` = lỗi/hỏng.",
          "Lỗi người Việt: dùng `rusak` cho mọi trường hợp. `Rusak` là hỏng; `cacat` nhấn vào lỗi sản phẩm từ đầu.",
          "Luyện: `Pembeli minta retur karena barang cacat.`",
        ],
        pronunciation_focus_en: [
          "`pembeli` = buyer; `minta retur` = request a return; `cacat` = defective/badly made.",
          "VN-speaker trap: using `rusak` for every case. `Rusak` = broken; `cacat` emphasizes a product defect.",
          "Drill: `Pembeli minta retur karena barang cacat.`",
        ],
      },
      {
        en: "Silakan kirim video unboxing sebagai bukti.",
        vi: "Vui lòng gửi video mở hộp làm bằng chứng.",
        pronunciation_focus: [
          "`video unboxing` sering dipakai langsung di marketplace; `sebagai bukti` = làm bằng chứng.",
          "Lỗi người Việt: nói `untuk bukti`. Với komplain, `sebagai bukti` tự nhiên hơn.",
          "Luyện: `Kirim video sebagai bukti.`",
        ],
        pronunciation_focus_en: [
          "`video unboxing` is often used directly in marketplaces; `sebagai bukti` = as proof/evidence.",
          "VN-speaker trap: saying `untuk bukti`. In complaints, `sebagai bukti` sounds more natural.",
          "Drill: `Kirim video sebagai bukti.`",
        ],
      },
      {
        en: "Barang ini masih dalam masa garansi toko.",
        vi: "Món hàng này vẫn còn trong thời gian bảo hành của shop.",
        pronunciation_focus: [
          "`masa garansi` = thời hạn bảo hành; `toko` = shop/cửa hàng.",
          "`masih dalam` menegaskan barang itu 아직 còn hợp lệ để xử lý.",
          "Lỗi người Việt: dùng `ada garansi` chung chung. `Masih dalam masa garansi` rõ hơn.",
        ],
        pronunciation_focus_en: [
          "`masa garansi` = warranty period; `toko` = shop/store.",
          "`masih dalam` emphasizes that the item is still valid for handling.",
          "VN-speaker trap: saying vague `ada garansi`. `Masih dalam masa garansi` is clearer.",
        ],
      },
      {
        en: "Berapa ongkir retur yang harus saya bayar?",
        vi: "Tôi phải trả phí gửi trả là bao nhiêu?",
        pronunciation_focus: [
          "`ongkir retur` = phí vận chuyển trả hàng; `harus saya bayar` = tôi phải trả.",
          "Lỗi người Việt: hỏi `retur cost` nửa Anh nửa Indo. Từ tự nhiên là `ongkir retur`.",
          "Luyện: `Berapa ongkir retur?`",
        ],
        pronunciation_focus_en: [
          "`ongkir retur` = return shipping fee; `harus saya bayar` = I have to pay.",
          "VN-speaker trap: half-English `retur cost`. The natural phrase is `ongkir retur`.",
          "Drill: `Berapa ongkir retur?`",
        ],
      },
      {
        en: "Saya sudah chat pelanggan dan minta maaf.",
        vi: "Tôi đã nhắn cho khách và xin lỗi.",
        pronunciation_focus: [
          "`chat pelanggan` = nhắn cho khách; `minta maaf` = xin lỗi.",
          "Lỗi người Việt: nói `chat ke pelanggan` trong konteks pembeli-seller. `Chat pelanggan` sudah cukup alami.",
          "Luyện: `Saya sudah chat pelanggan.`",
        ],
        pronunciation_focus_en: [
          "`chat pelanggan` = message the customer; `minta maaf` = apologize.",
          "VN-speaker trap: saying `chat ke pelanggan` in buyer-seller context. `Chat pelanggan` is already natural.",
          "Drill: `Saya sudah chat pelanggan.`",
        ],
      },
      {
        en: "Apakah toko saya akan kena rating buruk?",
        vi: "Shop của tôi có bị đánh giá xấu không?",
        pronunciation_focus: [
          "`kena rating buruk` = bị rating xấu/bị điểm thấp; `toko` = shop.",
          "Lỗi người Việt: dùng `dapat rating jelek` vẫn hiểu, nhưng `kena rating buruk` rất hay nghe trong marketplace.",
          "Luyện: `Toko saya kena rating buruk.`",
        ],
        pronunciation_focus_en: [
          "`kena rating buruk` = get a bad rating; `toko` = store/shop.",
          "VN-speaker trap: `dapat rating jelek` is understandable, but `kena rating buruk` is common marketplace language.",
          "Drill: `Toko saya kena rating buruk.`",
        ],
      },
      {
        en: "Mohon cek kebijakan toko sebelum retur diproses.",
        vi: "Vui lòng kiểm tra chính sách của shop trước khi xử lý trả hàng.",
        pronunciation_focus: [
          "`kebijakan toko` = chính sách của shop; `retur diproses` = việc trả hàng được xử lý.",
          "`mohon cek` thường dipakai dalam chat CS karena singkat dan sopan.",
          "Lỗi người Việt: nói `periksa policy` nửa Anh nửa Indo. `Kebijakan toko` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "`kebijakan toko` = store policy; `retur diproses` = the return is processed.",
          "`mohon cek` is common in CS chat because it is short and polite.",
          "VN-speaker trap: half-English `periksa policy`. `Kebijakan toko` is more natural.",
        ],
      },
      {
        en: "Kalau barang rusak saat datang, kami siap bantu solusi.",
        vi: "Nếu hàng bị hỏng khi đến, chúng tôi sẵn sàng hỗ trợ giải pháp.",
        pronunciation_focus: [
          "`barang rusak saat datang` = hàng bị hỏng khi nhận được; `siap bantu solusi` = sẵn sàng hỗ trợ giải pháp.",
          "Lỗi người Việt: bỏ `saat datang` khiến lý do không rõ. Trong komplain, chi tiết thời điểm rất penting.",
          "Luyện: `Barang rusak saat datang.`",
        ],
        pronunciation_focus_en: [
          "`barang rusak saat datang` = item damaged on arrival; `siap bantu solusi` = ready to help with a solution.",
          "VN-speaker trap: dropping `saat datang` makes the reason unclear. In complaints, timing details are important.",
          "Drill: `Barang rusak saat datang.`",
        ],
      },
      {
        en: "Saya bisa tukar barang atau minta refund?",
        vi: "Tôi có thể đổi hàng hoặc xin hoàn tiền không?",
        pronunciation_focus: [
          "`tukar barang` = đổi hàng; `minta refund` = xin hoàn tiền.",
          "Lỗi người Việt: dùng `return` như động từ trong mọi câu. Di marketplace Indonesia, `tukar barang` dan `refund` keduanya umum.",
          "Luyện: `Saya minta refund.`",
        ],
        pronunciation_focus_en: [
          "`tukar barang` = exchange the item; `minta refund` = request a refund.",
          "VN-speaker trap: using `return` as a verb in every sentence. In Indonesian marketplaces, `tukar barang` and `refund` are both common.",
          "Drill: `Saya minta refund.`",
        ],
      },
      {
        en: "Tolong berikan solusi penjual yang jelas hari ini.",
        vi: "Vui lòng đưa ra giải pháp rõ ràng của người bán hôm nay.",
        pronunciation_focus: [
          "`solusi penjual` = giải pháp của người bán; `jelas` = rõ ràng.",
          "`hari ini` membuat permintaan terasa tegas về thời gian.",
          "Lỗi người Việt: nói `kasih jalan keluar` terlalu lơi. Nếu muốn resmi, `berikan solusi yang jelas` lebih pas.",
        ],
        pronunciation_focus_en: [
          "`solusi penjual` = seller's solution; `jelas` = clear.",
          "`hari ini` makes the request firm about timing.",
          "VN-speaker trap: `kasih jalan keluar` can sound loose. For a more official tone, `berikan solusi yang jelas` is better.",
        ],
      },
    ],
    cultural_notes_vi:
      "Dalam marketplace Indonesia, pembeli thường gửi foto hoặc video khi barang bermasalah. Penjual yang responsif biasanya menjelaskan kebijakan toko, ongkir retur, pilihan tukar barang, dan kapan refund diproses. Menjawab dengan sopan penting, karena rating toko dan chat history memengaruhi kepercayaan pembeli.",
    cultural_notes_en:
      "In Indonesian marketplaces, buyers often send photos or videos when an item has a problem. Responsive sellers usually explain the store policy, return shipping fee, exchange options, and when the refund will be processed. Polite replies matter because store ratings and chat history affect buyer trust.",
    tip_advice_vi:
      "Mẫu rất hữu ích: `barang cacat`, `video sebagai bukti`, `ongkir retur`, `kebijakan toko`, `minta refund`, và `solusi penjual`. Hãy dùng `mohon cek` hoặc `silakan kirim` để giữ giọng lịch sự nhưng rõ ràng.",
    tip_advice_en:
      "Very useful patterns: `barang cacat`, `video sebagai bukti`, `ongkir retur`, `kebijakan toko`, `minta refund`, and `solusi penjual`. Use `mohon cek` or `silakan kirim` to stay polite but clear.",
    vocabulary: [
      {
        word: "retur",
        en: "return",
        vi: "trả hàng",
        pos: "noun / verb",
        pronunciation_vi: "re-TUR",
        pronunciation_en: "reh-TOOR",
      },
      {
        word: "barang cacat",
        en: "defective item",
        vi: "hàng lỗi",
        pos: "noun phrase",
        pronunciation_vi: "BA-rang CA-cat",
        pronunciation_en: "BA-rang CHA-chat",
      },
      {
        word: "ongkir retur",
        en: "return shipping fee",
        vi: "phí gửi trả",
        pos: "noun phrase",
        pronunciation_vi: "ong-kir re-TUR",
        pronunciation_en: "ong-KEER reh-TOOR",
      },
      {
        word: "video sebagai bukti",
        en: "video as proof",
        vi: "video làm bằng chứng",
        pos: "noun phrase",
        pronunciation_vi: "VI-de-o se-ba-gai BUK-ti",
        pronunciation_en: "VI-dee-oh seh-ba-GUY BOOK-tee",
      },
      {
        word: "kebijakan toko",
        en: "store policy",
        vi: "chính sách của shop",
        pos: "noun phrase",
        pronunciation_vi: "ke-bi-JA-kan TO-ko",
        pronunciation_en: "keh-bee-JA-kan TO-ko",
      },
      {
        word: "rating toko",
        en: "store rating",
        vi: "đánh giá shop",
        pos: "noun phrase",
        pronunciation_vi: "RAT-ing TO-ko",
        pronunciation_en: "RAY-ting TO-ko",
      },
      {
        word: "refund",
        en: "refund",
        vi: "hoàn tiền",
        pos: "noun / verb",
        pronunciation_vi: "RI-fund",
        pronunciation_en: "REE-fund",
      },
      {
        word: "chat pelanggan",
        en: "customer chat",
        vi: "chat với khách",
        pos: "noun phrase",
        pronunciation_vi: "chat pel-LANG-gan",
        pronunciation_en: "chat pel-LANG-gan",
      },
      {
        word: "solusi penjual",
        en: "seller solution",
        vi: "giải pháp của người bán",
        pos: "noun phrase",
        pronunciation_vi: "so-LU-si pen-JU-al",
        pronunciation_en: "so-LOO-see pen-JOO-al",
      },
      {
        word: "masa garansi",
        en: "warranty period",
        vi: "thời hạn bảo hành",
        pos: "noun phrase",
        pronunciation_vi: "MA-sa ga-RAN-si",
        pronunciation_en: "MA-sa ga-RAN-see",
      },
    ],
    dialogue: [
      {
        speaker: "Pembeli",
        text: "Barang ini cacat, saya mau retur.",
        vi: "Món hàng này bị lỗi, tôi muốn trả hàng.",
        en: "This item is defective, I want to return it.",
      },
      {
        speaker: "Penjual",
        text: "Silakan kirim video sebagai bukti, ya.",
        vi: "Vui lòng gửi video làm bằng chứng nhé.",
        en: "Please send a video as proof.",
      },
      {
        speaker: "Pembeli",
        text: "Ongkir retur ini siapa yang bayar?",
        vi: "Phí gửi trả này ai trả?",
        en: "Who pays for this return shipping fee?",
      },
      {
        speaker: "Penjual",
        text: "Mohon cek kebijakan toko dulu. Kita lihat solusi terbaik.",
        vi: "Vui lòng kiểm tra chính sách shop trước. Chúng ta xem giải pháp tốt nhất.",
        en: "Please check the store policy first. Let's see the best solution.",
      },
      {
        speaker: "Pembeli",
        text: "Kalau begitu, saya minta refund saja.",
        vi: "Vậy thì tôi chỉ xin hoàn tiền thôi.",
        en: "In that case, I would like a refund only.",
      },
      {
        speaker: "Penjual",
        text: "Baik, kami proses setelah video dan bukti diterima.",
        vi: "Vâng, chúng tôi sẽ xử lý sau khi nhận được video và bằng chứng.",
        en: "Okay, we will process it after the video and evidence are received.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt: "Dich sang tieng Indonesia: 'Nếu hàng bị hỏng khi đến, chúng tôi sẵn sàng hỗ trợ giải pháp.'",
        answer: "Kalau barang rusak saat datang, kami siap bantu solusi.",
        explanation_vi: "Dung `barang rusak saat datang` va `siap bantu solusi` de noi ro.",
        explanation_en: "Use `barang rusak saat datang` and `siap bantu solusi` for a clear complaint response.",
      },
      {
        type: "fill_blank",
        prompt: "Dien tu dung: Mohon cek kebijakan ____ dulu.",
        answer: "toko",
        explanation_vi: "Cum co dinh la `kebijakan toko`.",
        explanation_en: "The fixed phrase is `kebijakan toko`.",
      },
      {
        type: "choice",
        prompt: "Cau nao tu nhien hon khi yeu cau chung den video bang chung?",
        answer: "Silakan kirim video sebagai bukti.",
        explanation_vi: "Silakan nghe mem va duoc dung nhieu trong chat marketplace.",
        explanation_en: "`Silakan` sounds polite and common in marketplace chat.",
      },
      {
        type: "roleplay",
        prompt: "Dong vai nguoi mua va nguoi ban. Noi ve barang cacat, video sebagai bukti, ongkir retur, kebijakan toko, refund, va rating toko.",
        answer: "Barang ini cacat, saya mau retur. Silakan kirim video sebagai bukti. Kalau ongkir retur siapa yang bayar? Saya minta refund atau tukar barang, dan mohon cek kebijakan toko dulu.",
        explanation_vi: "Giu cau ngan, ro, va lich su.",
        explanation_en: "Keep the sentences short, clear, and polite.",
      },
    ],
  },
];
