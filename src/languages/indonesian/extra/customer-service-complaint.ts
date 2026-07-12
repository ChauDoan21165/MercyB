// Customer Service Complaint Indonesian (Vietnamese -> Indonesian study track).
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
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_customer_service_complaint",
    level: "B1",
    category: "shopping",
    title_vi: "Khiếu nại với bộ phận chăm sóc khách hàng",
    title_en: "Customer service complaints",
    sentences: [
      {
        en: "Saya mau mengajukan komplain ke layanan pelanggan.",
        vi: "Tôi muốn gửi khiếu nại đến bộ phận chăm sóc khách hàng.",
        pronunciation_focus: [
          "SA-ya mau me-nga-JU-kan kom-PLAIN ke la-YA-nan pe-LANG-gan - `mengajukan komplain` = gửi khiếu nại; `layanan pelanggan` = chăm sóc khách hàng.",
          "Lỗi người Việt: nói `saya komplain` được trong nói nhanh, nhưng câu lịch sự với CS nên dùng `mengajukan komplain`.",
          "Luyện: `Saya mau mengajukan komplain.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau me-nga-JOO-kan kom-PLAIN ke la-YA-nan pe-LANG-gan - `mengajukan komplain` = submit a complaint; `layanan pelanggan` = customer service.",
          "VN-speaker trap: `saya komplain` works casually, but a polite customer-service sentence uses `mengajukan komplain`.",
          "Drill: `Saya mau mengajukan komplain.`",
        ],
      },
      {
        en: "Barang yang saya terima rusak.",
        vi: "Món hàng tôi nhận bị hỏng.",
        pronunciation_focus: [
          "BA-rang yang SA-ya te-RI-ma RU-sak - `barang` = hàng/món đồ; `yang saya terima` = mà tôi nhận; `rusak` = hỏng.",
          "Lỗi người Việt: dịch `hàng hư` thành `barang jelek`. `Jelek` = xấu; hàng bị hỏng là `rusak`.",
          "Luyện: `Barang yang saya terima rusak.`",
        ],
        pronunciation_focus_en: [
          "BA-rang yang SA-ya te-REE-ma ROO-sak - `barang` = item/goods; `yang saya terima` = that I received; `rusak` = damaged/broken.",
          "VN-speaker trap: translating 'bad item' as `barang jelek`. `Jelek` means ugly/bad quality; damaged goods are `rusak`.",
          "Drill: `Barang yang saya terima rusak.`",
        ],
      },
      {
        en: "Saya sudah kirim foto sebagai bukti.",
        vi: "Tôi đã gửi ảnh làm bằng chứng.",
        pronunciation_focus: [
          "SA-ya SU-dah KI-rim FO-to se-BA-gai BUK-ti - `bukti` = bằng chứng; `sebagai` = với tư cách/làm.",
          "Lỗi người Việt: nói `untuk bukti` nghe được nhưng kém tự nhiên. Trong khiếu nại dùng `sebagai bukti`.",
          "Luyện: `Saya kirim foto sebagai bukti.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SOO-dah KI-rim FO-to se-BA-gai BOOK-ti - `bukti` = evidence/proof; `sebagai` = as.",
          "VN-speaker trap: `untuk bukti` may be understood but sounds less natural. In complaints, use `sebagai bukti`.",
          "Drill: `Saya kirim foto sebagai bukti.`",
        ],
      },
      {
        en: "Nomor tiket komplain saya berapa?",
        vi: "Số ticket khiếu nại của tôi là bao nhiêu?",
        pronunciation_focus: [
          "NO-mor TI-ket kom-PLAIN SA-ya be-RA-pa - `nomor tiket` = số ticket/số hồ sơ; `berapa` hỏi số.",
          "Lỗi người Việt: hỏi `apa nomor tiket`. Khi hỏi con số, dùng `berapa`, không dùng `apa`.",
          "Luyện: `Nomor tiket saya berapa?`",
        ],
        pronunciation_focus_en: [
          "NO-mor TEE-ket kom-PLAIN SA-ya be-RA-pa - `nomor tiket` = ticket/reference number; `berapa` asks for a number.",
          "VN-speaker trap: asking `apa nomor tiket`. For a number, use `berapa`, not `apa`.",
          "Drill: `Nomor tiket saya berapa?`",
        ],
      },
      {
        en: "Apakah saya bisa minta refund?",
        vi: "Tôi có thể xin hoàn tiền không?",
        pronunciation_focus: [
          "A-pa-kah SA-ya BI-sa MIN-ta RI-fan - `refund` = hoàn tiền; `minta refund` = xin/yêu cầu hoàn tiền.",
          "Lỗi người Việt: dịch dài `pengembalian uang` trong chat app. Từ mượn `refund` rất thường gặp trong marketplace.",
          "Luyện: `Saya minta refund.`",
        ],
        pronunciation_focus_en: [
          "A-pa-kah SA-ya BEE-sa MIN-ta REE-fund - `refund` = refund; `minta refund` = request a refund.",
          "VN-speaker trap: over-translating to formal `pengembalian uang` in app chat. The loanword `refund` is very common in marketplaces.",
          "Drill: `Saya minta refund.`",
        ],
      },
      {
        en: "Produk ini masih dalam masa garansi.",
        vi: "Sản phẩm này vẫn còn trong thời hạn bảo hành.",
        pronunciation_focus: [
          "PRO-duk I-ni MA-sih DA-lam MA-sa ga-RAN-si - `masa garansi` = thời hạn bảo hành; `masih` = vẫn còn.",
          "Lỗi người Việt: nói `ada garansi` khi muốn nói còn hạn. Chính xác hơn: `masih dalam masa garansi`.",
          "Luyện: `Masih dalam masa garansi.`",
        ],
        pronunciation_focus_en: [
          "PRO-duk EE-ni MA-sih DA-lam MA-sa ga-RAN-see - `masa garansi` = warranty period; `masih` = still.",
          "VN-speaker trap: saying only `ada garansi` when you mean it is still valid. More precise: `masih dalam masa garansi`.",
          "Drill: `Masih dalam masa garansi.`",
        ],
      },
      {
        en: "Mohon follow up hari ini, karena saya sudah menunggu lama.",
        vi: "Mong anh/chị theo dõi xử lý hôm nay, vì tôi đã chờ lâu rồi.",
        pronunciation_focus: [
          "MO-hon FO-low ap HA-ri I-ni, ka-RE-na SA-ya SU-dah me-NUNG-gu LA-ma - `mohon` = xin/mong; `follow up` = theo dõi xử lý.",
          "Lỗi người Việt: dùng `tolong` được, nhưng trong email/chat CS trang trọng hơn dùng `mohon`.",
          "Luyện: `Mohon follow up hari ini.`",
        ],
        pronunciation_focus_en: [
          "MO-hon FO-low up HA-ri EE-ni, ka-RE-na SA-ya SOO-dah me-NOONG-goo LA-ma - `mohon` = kindly/request; `follow up` = follow up.",
          "VN-speaker trap: `tolong` is fine, but in more formal CS email/chat `mohon` sounds smoother.",
          "Drill: `Mohon follow up hari ini.`",
        ],
      },
      {
        en: "Saya berharap ada solusi yang jelas.",
        vi: "Tôi hy vọng có giải pháp rõ ràng.",
        pronunciation_focus: [
          "SA-ya ber-HA-rap A-da so-LU-si yang JE-las - `berharap` = hy vọng; `solusi yang jelas` = giải pháp rõ ràng.",
          "Lỗi người Việt: nói `saya harap` hơi cộc trong khiếu nại. `Saya berharap` nghe lịch sự và đầy đủ hơn.",
          "Luyện: `Saya berharap ada solusi.`",
        ],
        pronunciation_focus_en: [
          "SA-ya ber-HA-rap A-da so-LOO-see yang JE-las - `berharap` = hope/expect; `solusi yang jelas` = clear solution.",
          "VN-speaker trap: `saya harap` can sound blunt in a complaint. `Saya berharap` is more polite and complete.",
          "Drill: `Saya berharap ada solusi.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong chat với layanan pelanggan ở Indonesia, người mua thường giữ giọng lịch sự nhưng rõ ràng: mở bằng `Halo, Kak/Bapak/Ibu`, nêu vấn đề, gửi `bukti`, xin `nomor tiket`, rồi hỏi `refund`, `garansi`, hoặc `solusi`. Với marketplace như Shopee/Tokopedia, các từ mượn `komplain`, `refund`, `follow up`, `ticket` rất phổ biến bên cạnh từ Indonesia như `bukti`, `barang rusak`, `garansi`.",
    cultural_notes_en:
      "In Indonesian customer-service chat, buyers usually keep the tone polite but clear: open with `Halo, Kak/Bapak/Ibu`, state the issue, send `bukti`, ask for a `nomor tiket`, then ask about `refund`, `garansi`, or a `solusi`. In marketplaces like Shopee/Tokopedia, loanwords such as `komplain`, `refund`, `follow up`, and `ticket` are common alongside Indonesian terms like `bukti`, `barang rusak`, and `garansi`.",
    tip_advice_vi:
      "Mẹo cho người Việt: khiếu nại hiệu quả theo khung 4 bước: `Saya mau mengajukan komplain` -> vấn đề (`barang rusak`) -> bằng chứng (`foto sebagai bukti`) -> yêu cầu (`refund`, `garansi`, `solusi`). Dùng `mohon` để lịch sự nhưng vẫn chắc ý.",
    tip_advice_en:
      "Tip for Vietnamese speakers: use a four-step complaint frame: `Saya mau mengajukan komplain` -> issue (`barang rusak`) -> evidence (`foto sebagai bukti`) -> request (`refund`, `garansi`, `solusi`). Use `mohon` to sound polite while staying firm.",
    vocabulary: [
      {
        cell_id: "a41dbe63-13ac-4503-bd4b-322ec5ade0b5",
        word: "layanan pelanggan",
        en: "customer service",
        vi: "chăm sóc khách hàng",
        pos: "noun phrase",
        pronunciation_vi: "la-YA-nan pe-LANG-gan",
        pronunciation_en: "la-YA-nan pe-LANG-gan",
      },
      {
        cell_id: "bd8ea8a2-34b6-4feb-bcd6-87f2eb2a47b5",
        word: "komplain",
        en: "complaint",
        vi: "khiếu nại",
        pos: "noun / verb",
        pronunciation_vi: "kom-PLAIN",
        pronunciation_en: "kom-PLAIN",
      },
      {
        cell_id: "10ba3001-296e-4ba0-ac33-4e37f3037d9c",
        word: "nomor tiket",
        en: "ticket number",
        vi: "số ticket / số hồ sơ",
        pos: "noun phrase",
        pronunciation_vi: "NO-mor TI-ket",
        pronunciation_en: "NO-mor TEE-ket",
      },
      {
        cell_id: "6309c4eb-cfcd-4b54-bf3c-0e966f9ea21c",
        word: "refund",
        en: "refund",
        vi: "hoàn tiền",
        pos: "noun / verb",
        pronunciation_vi: "RI-fan",
        pronunciation_en: "REE-fund",
      },
      {
        cell_id: "d1ee4f89-02f7-4a66-aff6-e96c1a8b7677",
        word: "garansi",
        en: "warranty",
        vi: "bảo hành",
        pos: "noun",
        pronunciation_vi: "ga-RAN-si",
        pronunciation_en: "ga-RAN-see",
      },
      {
        cell_id: "1935ffdc-3f5c-41cb-b841-f4144d5aad9b",
        word: "barang rusak",
        en: "damaged item",
        vi: "hàng bị hỏng",
        pos: "noun phrase",
        pronunciation_vi: "BA-rang RU-sak",
        pronunciation_en: "BA-rang ROO-sak",
      },
      {
        cell_id: "c5230216-e8cb-4ed2-8f9a-b429bed34f4b",
        word: "follow up",
        en: "follow up",
        vi: "theo dõi xử lý",
        pos: "verb phrase / noun",
        pronunciation_vi: "FO-low ap",
        pronunciation_en: "FO-low up",
      },
      {
        cell_id: "590e2a99-a1ec-460f-be92-77fc79b2cff1",
        word: "solusi",
        en: "solution",
        vi: "giải pháp",
        pos: "noun",
        pronunciation_vi: "so-LU-si",
        pronunciation_en: "so-LOO-see",
      },
    ],
    dialogue: [
      {
        cell_id: "c58ab1e0-90d4-438a-9789-09f8cd17982a",
        speaker: "Pelanggan",
        text: "Halo, Kak. Saya mau mengajukan komplain.",
        vi: "Chào bạn. Tôi muốn gửi khiếu nại.",
        en: "Hi. I would like to submit a complaint.",
      },
      {
        cell_id: "fe79de3d-4fe7-47f5-b036-60977eb8bb74",
        speaker: "CS",
        text: "Baik, Kak. Boleh jelaskan kendalanya?",
        vi: "Vâng bạn. Bạn có thể giải thích vấn đề không?",
        en: "Sure. Could you explain the issue?",
      },
      {
        cell_id: "c0b4d203-877a-4793-8073-c8891048aad1",
        speaker: "Pelanggan",
        text: "Barang yang saya terima rusak. Saya sudah kirim foto sebagai bukti.",
        vi: "Hàng tôi nhận bị hỏng. Tôi đã gửi ảnh làm bằng chứng.",
        en: "The item I received is damaged. I have sent photos as proof.",
      },
      {
        cell_id: "c5097d52-a076-4cd5-b317-25f8b053a706",
        speaker: "CS",
        text: "Kami buatkan nomor tiket dulu, ya.",
        vi: "Chúng tôi sẽ tạo số ticket trước nhé.",
        en: "We will create a ticket number first.",
      },
      {
        cell_id: "d927bbb4-d48c-4caa-8baf-d08c003fab89",
        speaker: "Pelanggan",
        text: "Apakah saya bisa minta refund atau klaim garansi?",
        vi: "Tôi có thể xin hoàn tiền hoặc yêu cầu bảo hành không?",
        en: "Can I request a refund or make a warranty claim?",
      },
      {
        cell_id: "f41dd7ed-f060-42e1-b168-3aa24c38724a",
        speaker: "CS",
        text: "Bisa, Kak. Mohon ditunggu, kami follow up hari ini.",
        vi: "Được bạn. Mong bạn chờ, hôm nay chúng tôi sẽ theo dõi xử lý.",
        en: "Yes. Please wait, we will follow up today.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Saya mau mengajukan ___ ke layanan pelanggan.`",
        prompt_en: "Fill in the blank: `Saya mau mengajukan ___ ke layanan pelanggan.`",
        answer: "komplain",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi muốn xin hoàn tiền.",
        prompt_en: "Translate into Indonesian: I want to request a refund.",
        answer: "Saya mau minta refund.",
      },
      {
        type: "matching",
        prompt_vi: "Nối nghĩa đúng.",
        prompt_en: "Match the meanings.",
        pairs: [
          ["layanan pelanggan", "chăm sóc khách hàng"],
          ["nomor tiket", "số ticket / số hồ sơ"],
          ["barang rusak", "hàng bị hỏng"],
          ["garansi", "bảo hành"],
          ["solusi", "giải pháp"],
        ],
      },
    ],
  },
];
