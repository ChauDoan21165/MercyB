// Warehouse & Logistics Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It mirrors sibling Indonesian `extra/*`
// files: target-language text is stored in `en`, Vietnamese glosses in `vi`,
// Vietnamese-facing L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.
//
// Register note: warehouse Indonesian mixes operational nouns with English loan
// words: `gudang`, `stok barang`, `pengiriman`, `surat jalan`, `barcode`,
// `forklift`, `packing`, and `retur`. The goal is clear shift-floor language.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length and order. */
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
  /** Vietnamese pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English pronunciation hint, stressed syllable in CAPS. */
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
    id: "indonesian_warehouse_logistics",
    level: "B1",
    category: "work",
    title_vi: "Kho hàng và logistics",
    title_en: "Warehouse and logistics Indonesian",
    sentences: [
      {
        en: "Saya bekerja di gudang bagian penerimaan barang.",
        vi: "Tôi làm ở kho, bộ phận nhận hàng.",
        pronunciation_focus: [
          "SA-ya be-KER-ja di GU-dang BA-gi-an pe-ne-RI-ma-an BA-rang - `gudang` = kho; `penerimaan barang` = nhận hàng.",
          "Lỗi người Việt: nói `kho` theo tiếng Việt. Tiếng Indonesia là `gudang`.",
          "Luyện: `Saya bekerja di gudang.`",
        ],
        pronunciation_focus_en: [
          "SA-ya be-KER-ja dee GOO-dang BA-gee-an pe-ne-REE-ma-an BA-rang - `gudang` = warehouse; `penerimaan barang` = goods receiving.",
          "VN-speaker trap: code-switching Vietnamese `kho`. Indonesian uses `gudang`.",
          "Drill: `Saya bekerja di gudang.`",
        ],
      },
      {
        en: "Tolong cek stok barang sebelum dikirim.",
        vi: "Làm ơn kiểm tra tồn kho trước khi gửi hàng.",
        pronunciation_focus: [
          "TO-long cek stok BA-rang se-BE-lum di-KI-rim - `stok barang` = hàng tồn kho; `dikirim` = được gửi.",
          "Lỗi người Việt: né bị động `di-`. Trong kho, `dikirim`, `diterima`, `dipindai` rất thường gặp.",
          "Luyện: `Cek stok barang sebelum dikirim.`",
        ],
        pronunciation_focus_en: [
          "TO-long chek stok BA-rang se-BE-lum dee-KEE-rim - `stok barang` = inventory stock; `dikirim` = sent.",
          "VN-speaker trap: avoiding passive `di-`. Warehouse notices often use `dikirim`, `diterima`, `dipindai`.",
          "Drill: `Cek stok barang sebelum dikirim.`",
        ],
      },
      {
        en: "Pengiriman hari ini harus selesai sebelum jam lima.",
        vi: "Lô hàng/giao hàng hôm nay phải xong trước năm giờ.",
        pronunciation_focus: [
          "pe-ngi-RI-man HA-ri I-ni HA-rus se-LE-sai se-BE-lum jam LI-ma - `pengiriman` = việc gửi/giao hàng.",
          "Lỗi người Việt: dùng `kirim` làm danh từ. Danh từ quy trình là `pengiriman`.",
          "Luyện: `Pengiriman harus selesai.`",
        ],
        pronunciation_focus_en: [
          "pe-ngi-REE-man HA-ree EE-nee HA-roos se-LEH-sai se-BE-lum jam LEE-ma - `pengiriman` = shipment/delivery process.",
          "VN-speaker trap: using bare `kirim` as a noun. The process noun is `pengiriman`.",
          "Drill: `Pengiriman harus selesai.`",
        ],
      },
      {
        en: "Surat jalan harus ikut dengan barang.",
        vi: "Phiếu giao hàng phải đi kèm với hàng.",
        pronunciation_focus: [
          "SU-rat JA-lan HA-rus I-kut DE-ngan BA-rang - `surat jalan` = phiếu giao hàng/chứng từ vận chuyển.",
          "Lỗi người Việt: dịch từng chữ thành 'thư đường'. Trong logistics, `surat jalan` là chứng từ đi kèm hàng.",
          "Luyện: `Surat jalan ikut dengan barang.`",
        ],
        pronunciation_focus_en: [
          "SOO-rat JA-lan HA-roos EE-kut DEH-ngan BA-rang - `surat jalan` = delivery note/waybill.",
          "VN-speaker trap: translating it literally as 'road letter'. In logistics, it is the document accompanying goods.",
          "Drill: `Surat jalan ikut dengan barang.`",
        ],
      },
      {
        en: "Barcode-nya belum bisa dipindai.",
        vi: "Mã vạch vẫn chưa quét được.",
        pronunciation_focus: [
          "BAR-kod-nya be-LUM BI-sa di-PIN-dai - `barcode` = mã vạch; `dipindai` = được quét.",
          "Lỗi người Việt: dùng `scan` được hiểu, nhưng trong ghi chú chuẩn có thể dùng `dipindai`.",
          "Luyện: `Barcode belum bisa dipindai.`",
        ],
        pronunciation_focus_en: [
          "BAR-code-nya be-LOOM BEE-sa dee-PIN-dai - `barcode` = barcode; `dipindai` = scanned.",
          "VN-speaker note: `scan` is understood, but formal notes may use `dipindai`.",
          "Drill: `Barcode belum bisa dipindai.`",
        ],
      },
      {
        en: "Operator forklift harus pakai helm keselamatan.",
        vi: "Người vận hành xe nâng phải đội mũ bảo hộ.",
        pronunciation_focus: [
          "o-pe-RA-tor FORK-lift HA-rus PA-kai helm ke-se-la-MA-tan - `forklift` = xe nâng; `helm keselamatan` = mũ bảo hộ.",
          "Lỗi người Việt: `pakai` không chỉ là dùng; với mũ/đồ bảo hộ nghĩa là đội/mặc.",
          "Luyện: `Pakai helm keselamatan.`",
        ],
        pronunciation_focus_en: [
          "o-pe-RA-tor FORK-lift HA-roos PA-kai helm ke-se-la-MA-tan - `forklift` = forklift; `helm keselamatan` = safety helmet.",
          "VN-speaker trap: `pakai` is not only use; for protective gear it means wear.",
          "Drill: `Pakai helm keselamatan.`",
        ],
      },
      {
        en: "Barang pecah belah harus dipacking lebih aman.",
        vi: "Hàng dễ vỡ phải được đóng gói an toàn hơn.",
        pronunciation_focus: [
          "BA-rang pe-CAH be-LAH HA-rus di-PAK-ing le-BIH A-man - `pecah belah` = dễ vỡ; `packing` = đóng gói.",
          "Lỗi người Việt: đọc `pecah` với âm k. `c` Indonesia đọc `ch`: pe-CHAH.",
          "Luyện: `Barang pecah belah harus dipacking aman.`",
        ],
        pronunciation_focus_en: [
          "BA-rang pe-CHAH be-LAH HA-roos dee-PAK-ing le-BEEH A-man - `pecah belah` = fragile; `packing` = packing.",
          "VN-speaker trap: reading `pecah` with a k sound. Indonesian `c` = `ch`: pe-CHAH.",
          "Drill: `Barang pecah belah harus dipacking aman.`",
        ],
      },
      {
        en: "Ada barang retur dari pelanggan.",
        vi: "Có hàng trả lại từ khách hàng.",
        pronunciation_focus: [
          "A-da BA-rang re-TUR DA-ri pe-LANG-gan - `retur` = trả hàng; `pelanggan` = khách hàng.",
          "Lỗi người Việt: nói `barang kembali` nghe chung chung. Trong kho/marketplace dùng `barang retur`.",
          "Luyện: `Ada barang retur.`",
        ],
        pronunciation_focus_en: [
          "A-da BA-rang re-TOOR DA-ree pe-LANG-gan - `retur` = return; `pelanggan` = customer.",
          "VN-speaker trap: `barang kembali` sounds generic. Warehouse/marketplace language uses `barang retur`.",
          "Drill: `Ada barang retur.`",
        ],
      },
      {
        en: "Barang retur perlu dicek kondisinya dulu.",
        vi: "Hàng trả lại cần được kiểm tra tình trạng trước.",
        pronunciation_focus: [
          "BA-rang re-TUR per-LU di-CEK kon-DI-si-nya DU-lu - `kondisi` = tình trạng; `dulu` = trước đã.",
          "Lỗi người Việt: bỏ `dulu`, làm mất sắc thái 'kiểm tra trước rồi mới xử lý'.",
          "Luyện: `Cek kondisinya dulu.`",
        ],
        pronunciation_focus_en: [
          "BA-rang re-TOOR per-LOO dee-CHEK kon-DEE-see-nya DOO-loo - `kondisi` = condition; `dulu` = first.",
          "VN-speaker trap: dropping `dulu`, losing the 'check first before processing' nuance.",
          "Drill: `Cek kondisinya dulu.`",
        ],
      },
      {
        en: "Jumlah di sistem tidak sama dengan stok fisik.",
        vi: "Số lượng trên hệ thống không giống tồn kho thực tế.",
        pronunciation_focus: [
          "JUM-lah di SIS-tem TI-dak SA-ma DE-ngan stok FI-sik - `jumlah` = số lượng; `stok fisik` = tồn kho thực tế.",
          "Lỗi người Việt: dùng `nomor` cho số lượng. `Nomor` là số định danh; số lượng là `jumlah`.",
          "Luyện: `Jumlah tidak sama dengan stok fisik.`",
        ],
        pronunciation_focus_en: [
          "JOOM-lah dee SIS-tem TEE-dak SA-ma DEH-ngan stok FEE-sik - `jumlah` = quantity; `stok fisik` = physical stock.",
          "VN-speaker trap: using `nomor` for quantity. `Nomor` is an ID number; quantity is `jumlah`.",
          "Drill: `Jumlah tidak sama dengan stok fisik.`",
        ],
      },
      {
        en: "Tolong laporkan selisih stok ke supervisor.",
        vi: "Làm ơn báo cáo chênh lệch tồn kho cho giám sát.",
        pronunciation_focus: [
          "TO-long la-POR-kan se-LI-sih stok ke SU-per-vai-zor - `selisih stok` = chênh lệch tồn kho; `laporkan` = hãy báo cáo.",
          "Lỗi người Việt: dùng `beda stok` trong báo cáo. Từ vận hành rõ hơn là `selisih stok`.",
          "Luyện: `Laporkan selisih stok.`",
        ],
        pronunciation_focus_en: [
          "TO-long la-POR-kan se-LEE-sih stok ke SOO-per-vy-zor - `selisih stok` = stock discrepancy; `laporkan` = report it.",
          "VN-speaker trap: using `beda stok` in reports. Operational language prefers `selisih stok`.",
          "Drill: `Laporkan selisih stok.`",
        ],
      },
      {
        en: "Packing harus rapi supaya barang tidak rusak di perjalanan.",
        vi: "Đóng gói phải gọn chắc để hàng không bị hỏng trên đường.",
        pronunciation_focus: [
          "PAK-ing HA-rus RA-pi su-PA-ya BA-rang TI-dak RU-sak di per-ja-LA-nan - `rapi` = gọn/chỉnh; `di perjalanan` = trên đường.",
          "Lỗi người Việt: dùng `bagus` cho packing. Với đóng gói, `rapi` và `aman` tự nhiên hơn.",
          "Luyện: `Packing harus rapi dan aman.`",
        ],
        pronunciation_focus_en: [
          "PAK-ing HA-roos RA-pee soo-PA-ya BA-rang TEE-dak ROO-sak dee per-ja-LA-nan - `rapi` = neat; `di perjalanan` = in transit.",
          "VN-speaker trap: using `bagus` for packing. For packaging, `rapi` and `aman` are more natural.",
          "Drill: `Packing harus rapi dan aman.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong kho ở Indonesia, nhiều từ tiếng Anh được dùng trực tiếp như `barcode`, `forklift`, `packing`, `scanner`, nhưng tài liệu vận hành vẫn dùng từ Indonesia như `gudang`, `stok barang`, `pengiriman`, `surat jalan`, `retur`, và `selisih stok`. Khi làm việc trong kho, câu ngắn, rõ người chịu trách nhiệm và trạng thái hàng là quan trọng nhất.",
    cultural_notes_en:
      "In Indonesian warehouses, many English terms are used directly, such as `barcode`, `forklift`, `packing`, and `scanner`, while operational documents still use Indonesian terms like `gudang`, `stok barang`, `pengiriman`, `surat jalan`, `retur`, and `selisih stok`. On the warehouse floor, short sentences with clear responsibility and item status matter most.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt `stok` (tồn kho), `jumlah` (số lượng), `barang` (hàng), và `pengiriman` (việc gửi/giao). Trong báo cáo kho, hãy dùng bị động `di-`: `dikirim`, `diterima`, `dipindai`, `dicek`. Đó là văn phong vận hành tự nhiên.",
    tip_advice_en:
      "Tip for Vietnamese speakers: separate `stok` (stock), `jumlah` (quantity), `barang` (goods), and `pengiriman` (shipment/delivery). In warehouse reports, use passive `di-`: `dikirim`, `diterima`, `dipindai`, `dicek`. That is natural operational style.",
    vocabulary: [
      {
        cell_id: "245290fb-4454-452c-923b-803c0a38828b",
        word: "gudang",
        en: "warehouse",
        vi: "kho",
        pos: "noun",
        pronunciation_vi: "GU-dang",
        pronunciation_en: "GOO-dang",
      },
      {
        cell_id: "c451dd54-18bb-4fea-88a2-49f92123b2db",
        word: "stok barang",
        en: "inventory stock",
        vi: "tồn kho hàng hóa",
        pos: "noun phrase",
        pronunciation_vi: "stok BA-rang",
        pronunciation_en: "stok BA-rang",
      },
      {
        cell_id: "cf39a266-34be-4102-8f76-0770698a9616",
        word: "pengiriman",
        en: "shipment / delivery",
        vi: "việc gửi/giao hàng",
        pos: "noun",
        pronunciation_vi: "pe-ngi-RI-man",
        pronunciation_en: "pe-ngi-REE-man",
      },
      {
        cell_id: "12be77e2-3d4d-42f3-97d8-e9fb9195ba51",
        word: "surat jalan",
        en: "delivery note / waybill",
        vi: "phiếu giao hàng / chứng từ vận chuyển",
        pos: "noun phrase",
        pronunciation_vi: "SU-rat JA-lan",
        pronunciation_en: "SOO-rat JA-lan",
      },
      {
        cell_id: "4932fbd4-8876-4738-ae8a-a314c9c0d211",
        word: "barcode",
        en: "barcode",
        vi: "mã vạch",
        pos: "noun",
        pronunciation_vi: "BAR-kod",
        pronunciation_en: "BAR-code",
      },
      {
        cell_id: "b0826c38-85a7-4e4a-be5c-aa6899923037",
        word: "forklift",
        en: "forklift",
        vi: "xe nâng",
        pos: "noun",
        pronunciation_vi: "FORK-lift",
        pronunciation_en: "FORK-lift",
      },
      {
        cell_id: "0f416763-a66c-4541-aaaa-9a34251c77df",
        word: "packing",
        en: "packing / packaging",
        vi: "đóng gói",
        pos: "noun / verb",
        pronunciation_vi: "PAK-ing",
        pronunciation_en: "PAK-ing",
      },
      {
        cell_id: "c2162b5e-9d56-4962-9812-5046538803d8",
        word: "retur",
        en: "return",
        vi: "hàng trả lại",
        pos: "noun",
        pronunciation_vi: "re-TUR",
        pronunciation_en: "re-TOOR",
      },
      {
        cell_id: "010a4b7f-2229-4210-9fe4-c135eb178ddf",
        word: "selisih stok",
        en: "stock discrepancy",
        vi: "chênh lệch tồn kho",
        pos: "noun phrase",
        pronunciation_vi: "se-LI-sih stok",
        pronunciation_en: "se-LEE-sih stok",
      },
      {
        cell_id: "b99d814b-c1bf-468a-9ae1-e91b46227323",
        word: "stok fisik",
        en: "physical stock",
        vi: "tồn kho thực tế",
        pos: "noun phrase",
        pronunciation_vi: "stok FI-sik",
        pronunciation_en: "stok FEE-sik",
      },
      {
        cell_id: "e690ed8e-9002-4939-aaa9-e610fff96bf5",
        word: "barang pecah belah",
        en: "fragile goods",
        vi: "hàng dễ vỡ",
        pos: "noun phrase",
        pronunciation_vi: "BA-rang pe-CAH be-LAH",
        pronunciation_en: "BA-rang pe-CHAH be-LAH",
      },
      {
        cell_id: "f4347e9a-bd76-4e82-9861-cb84162fbfb5",
        word: "dipindai",
        en: "scanned",
        vi: "được quét",
        pos: "verb",
        pronunciation_vi: "di-PIN-dai",
        pronunciation_en: "dee-PIN-dai",
      },
    ],
    dialogue: [
      {
        cell_id: "ee2ba4ea-6d8e-4a83-8482-506cdf4e9cb7",
        speaker: "Supervisor",
        text: "Tolong cek stok barang ini sebelum pengiriman sore.",
        vi: "Làm ơn kiểm tra tồn kho mặt hàng này trước chuyến giao chiều.",
        en: "Please check this stock before the afternoon shipment.",
      },
      {
        cell_id: "8c3d9080-44ea-426d-9a7f-6d36594a8f02",
        speaker: "Staf Gudang",
        text: "Baik. Barcode-nya belum bisa dipindai, jadi saya cek stok fisik dulu.",
        vi: "Vâng. Mã vạch chưa quét được, nên tôi kiểm tra tồn kho thực tế trước.",
        en: "Okay. The barcode cannot be scanned yet, so I will check the physical stock first.",
      },
      {
        cell_id: "1d1e2b0e-75b1-46df-b578-3227a5f205e5",
        speaker: "Supervisor",
        text: "Kalau ada selisih stok, langsung laporkan ke saya.",
        vi: "Nếu có chênh lệch tồn kho, báo ngay cho tôi.",
        en: "If there is a stock discrepancy, report it to me immediately.",
      },
      {
        cell_id: "04dae9fc-ad0a-4991-9ed2-eebc2d2a3f80",
        speaker: "Staf Gudang",
        text: "Siap. Untuk barang retur, saya cek kondisinya dulu.",
        vi: "Rõ. Với hàng trả lại, tôi kiểm tra tình trạng trước.",
        en: "Understood. For returned goods, I will check the condition first.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Làm ơn kiểm tra tồn kho trước khi gửi hàng.",
        answer: "Tolong cek stok barang sebelum dikirim.",
      },
      {
        type: "fill_blank",
        prompt: "Surat ____ harus ikut dengan barang.",
        answer: "jalan",
        explanation_vi: "`surat jalan` = phiếu giao hàng / chứng từ vận chuyển.",
        explanation_en: "`surat jalan` = delivery note / waybill.",
      },
      {
        type: "multiple_choice",
        prompt: "Which phrase means 'stock discrepancy'?",
        choices: ["selisih stok", "surat jalan", "barang pecah belah", "penerimaan barang"],
        answer: "selisih stok",
      },
      {
        type: "matching",
        pairs: [
          ["gudang", "kho"],
          ["pengiriman", "giao/gửi hàng"],
          ["retur", "hàng trả lại"],
          ["barcode", "mã vạch"],
        ],
      },
    ],
  },
];

export default lessons;
