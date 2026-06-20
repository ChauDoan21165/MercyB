// Freight Shipping & Cargo Indonesian (Vietnamese -> Indonesian study track).
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
  /** Vietnamese-facing pronunciation/grammar/culture notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

type IndonesianVocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type IndonesianDialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type IndonesianExercise = Record<string, any>;

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

export const freightShippingCargoLessons: IndonesianLesson[] = [
  {
    id: "indonesian_freight_shipping_cargo",
    level: "B1",
    category: "work_logistics",
    title_vi: "Gửi hàng kargo: ekspedisi, berat, volume và asuransi pengiriman",
    title_en: "Freight shipping: expedition service, weight, volume and shipping insurance",
    sentences: [
      {
        en: "Saya mau kirim barang lewat kargo, bukan paket reguler.",
        vi: "Tôi muốn gửi hàng bằng kargo, không phải gói hàng thường.",
        pronunciation_focus: [
          "`kirim barang lewat kargo` = gửi hàng qua dịch vụ kargo; dùng cho hàng lớn/nặng.",
          "`paket reguler` = gói hàng thường; khác với kargo yang biasanya lebih besar.",
          "Lỗi người Việt: dùng `antar` cho mọi loại gửi hàng. Người gửi nói `kirim`; kurir mới `antar` đến nơi.",
        ],
        pronunciation_focus_en: [
          "`kirim barang lewat kargo` means send goods by cargo service, used for large or heavy shipments.",
          "`paket reguler` means a regular parcel, different from cargo that is usually larger.",
          "VN-speaker trap: using `antar` for every shipping action. The sender `kirim`s; the courier `antar`s to the destination.",
        ],
      },
      {
        en: "Perusahaan ekspedisi ini melayani pengiriman antar pulau.",
        vi: "Công ty vận chuyển này phục vụ gửi hàng giữa các đảo.",
        pronunciation_focus: [
          "`perusahaan ekspedisi` = công ty vận chuyển/giao nhận; rất thường dùng trong logistics Indonesia.",
          "`antar pulau` = giữa các đảo; Indonesia dùng nhiều vì vận chuyển liên đảo phổ biến.",
          "Lỗi người Việt: hiểu `ekspedisi` là chuyến thám hiểm. Trong kinh doanh, `ekspedisi` thường là dịch vụ vận chuyển.",
        ],
        pronunciation_focus_en: [
          "`perusahaan ekspedisi` means a freight/courier/logistics company, common in Indonesian logistics.",
          "`antar pulau` means between islands, common because inter-island shipping matters in Indonesia.",
          "VN-speaker trap: reading `ekspedisi` only as expedition/adventure. In business, it often means shipping service.",
        ],
      },
      {
        en: "Berat barangnya dua puluh lima kilo.",
        vi: "Trọng lượng hàng là hai mươi lăm ký.",
        pronunciation_focus: [
          "`berat barang` = trọng lượng hàng; hỏi số ký bằng `berapa kilo?`.",
          "`dua puluh lima kilo` = 25 kg; số đứng trước đơn vị.",
          "Lỗi người Việt: dùng `nomor` cho trọng lượng. `Nomor` là số định danh; trọng lượng là `berat`.",
        ],
        pronunciation_focus_en: [
          "`berat barang` means item weight; ask the kilogram amount with `berapa kilo?`.",
          "`dua puluh lima kilo` means 25 kg; the number comes before the unit.",
          "VN-speaker trap: using `nomor` for weight. `Nomor` is an ID number; weight is `berat`.",
        ],
      },
      {
        en: "Kalau volumenya besar, biaya kirim bisa dihitung berdasarkan volume.",
        vi: "Nếu thể tích lớn, phí gửi có thể được tính theo thể tích.",
        pronunciation_focus: [
          "`volume` = thể tích/kích thước khối; dùng khi barang besar tapi ringan.",
          "`dihitung berdasarkan volume` = được tính dựa trên thể tích; bị động `di-` rất hay trong quy định.",
          "Lỗi người Việt: chỉ hỏi cân nặng. Với kargo, cần hỏi cả `berat` và `volume`.",
        ],
        pronunciation_focus_en: [
          "`volume` means dimensional volume, used when goods are bulky but light.",
          "`dihitung berdasarkan volume` means calculated based on volume; passive `di-` is common in rules.",
          "VN-speaker trap: asking only about weight. For cargo, ask both `berat` and `volume`.",
        ],
      },
      {
        en: "Barang pecah belah sebaiknya pakai packing kayu.",
        vi: "Hàng dễ vỡ nên dùng đóng gói bằng gỗ.",
        pronunciation_focus: [
          "`barang pecah belah` = hàng dễ vỡ; `c` đọc như 'ch': pe-CHAH.",
          "`packing kayu` = đóng gói/đóng kiện gỗ; từ mượn `packing` rất phổ biến.",
          "Lỗi người Việt: nói `bungkus kayu`. Trong ekspedisi, cụm thực tế là `packing kayu`.",
        ],
        pronunciation_focus_en: [
          "`barang pecah belah` means fragile goods; Indonesian `c` sounds like 'ch': pe-CHAH.",
          "`packing kayu` means wooden packing/crating; the loanword `packing` is very common.",
          "VN-speaker trap: saying `bungkus kayu`. In freight service, the practical phrase is `packing kayu`.",
        ],
      },
      {
        en: "Apakah packing kayu dihitung sebagai biaya tambahan?",
        vi: "Đóng kiện gỗ có được tính là phí bổ sung không?",
        pronunciation_focus: [
          "`biaya tambahan` = phí thêm/phụ phí; hỏi rõ trước khi đồng ý.",
          "`dihitung sebagai` = được tính như/là; cách nói chuẩn cho phí và điều kiện.",
          "Lỗi người Việt: hỏi `ada tambah uang?` nghe quá khẩu ngữ. Ở quầy dịch vụ dùng `biaya tambahan`.",
        ],
        pronunciation_focus_en: [
          "`biaya tambahan` means additional fee; ask clearly before agreeing.",
          "`dihitung sebagai` means counted as; standard for fees and conditions.",
          "VN-speaker trap: asking `ada tambah uang?`, which sounds too casual. At a service counter, use `biaya tambahan`.",
        ],
      },
      {
        en: "Saya mau tambah asuransi pengiriman untuk barang ini.",
        vi: "Tôi muốn thêm bảo hiểm vận chuyển cho món hàng này.",
        pronunciation_focus: [
          "`asuransi pengiriman` = bảo hiểm vận chuyển; dùng khi hàng mahal, fragile, hoặc berisiko.",
          "`tambah asuransi` = thêm bảo hiểm; `tambah` tự nhiên trong giao dịch ở quầy.",
          "Lỗi người Việt: nói `jaminan kirim` cho bảo hiểm. Từ đúng là `asuransi pengiriman`.",
        ],
        pronunciation_focus_en: [
          "`asuransi pengiriman` means shipping insurance; use it for expensive, fragile, or risky goods.",
          "`tambah asuransi` means add insurance; `tambah` sounds natural at a service counter.",
          "VN-speaker trap: saying `jaminan kirim` for insurance. The correct term is `asuransi pengiriman`.",
        ],
      },
      {
        en: "Nomor resinya sudah keluar belum?",
        vi: "Số vận đơn đã có chưa?",
        pronunciation_focus: [
          "`nomor resi` = số vận đơn/tracking number; dùng để cek status pengiriman.",
          "`sudah ... belum?` = đã ... chưa? Đây là khung hỏi rất Indonesia.",
          "Lỗi người Việt: hỏi `nomor resinya apa?` khi muốn biết đã có chưa. Hỏi trạng thái bằng `sudah keluar belum?`.",
        ],
        pronunciation_focus_en: [
          "`nomor resi` means tracking number; use it to check shipment status.",
          "`sudah ... belum?` means has it ... yet? This is a very Indonesian question frame.",
          "VN-speaker trap: asking `nomor resinya apa?` when you mean whether it is available yet. Ask status with `sudah keluar belum?`.",
        ],
      },
      {
        en: "Biaya kirim ke Surabaya berapa untuk barang sebesar ini?",
        vi: "Phí gửi đến Surabaya là bao nhiêu cho hàng lớn cỡ này?",
        pronunciation_focus: [
          "`biaya kirim` = phí vận chuyển; trong app/quầy cũng nghe `ongkir`.",
          "`sebesar ini` = lớn cỡ này; dùng khi chỉ vào hàng hoặc mô tả kích thước.",
          "Lỗi người Việt: hỏi `apa biaya kirim`. Khi hỏi tiền, dùng `berapa`, không dùng `apa`.",
        ],
        pronunciation_focus_en: [
          "`biaya kirim` means shipping cost; in apps/counters you also hear `ongkir`.",
          "`sebesar ini` means this big, used when pointing to the item or describing size.",
          "VN-speaker trap: asking `apa biaya kirim`. For an amount of money, use `berapa`, not `apa`.",
        ],
      },
      {
        en: "Tolong tulis alamat penerima dengan jelas di label pengiriman.",
        vi: "Vui lòng viết rõ địa chỉ người nhận trên nhãn vận chuyển.",
        pronunciation_focus: [
          "`alamat penerima` = địa chỉ người nhận; `penerima` là người nhận hàng.",
          "`label pengiriman` = nhãn vận chuyển; thường dán trên kardus atau packing.",
          "Lỗi người Việt: nói `alamat orang terima`. Cụm tự nhiên và chuẩn là `alamat penerima`.",
        ],
        pronunciation_focus_en: [
          "`alamat penerima` means recipient address; `penerima` is the person receiving the goods.",
          "`label pengiriman` means shipping label, usually attached to the box or packing.",
          "VN-speaker trap: saying `alamat orang terima`. Natural standard phrase: `alamat penerima`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, `ekspedisi` và `kargo` thường dùng cho hàng lớn, nặng, hoặc gửi antar kota/antar pulau. Biaya kirim có thể dựa trên berat aktual, volume, jarak, jenis layanan, packing kayu, dan asuransi pengiriman. `Nomor resi` là số quan trọng để theo dõi trạng thái. Với hàng pecah belah hoặc bernilai tinggi, nên hỏi rõ packing, asuransi, estimasi sampai, và điều kiện klaim nếu barang rusak atau hilang.",
    cultural_notes_en:
      "In Indonesia, `ekspedisi` and `kargo` are often used for large, heavy, intercity, or inter-island shipments. Shipping cost may depend on actual weight, volume, distance, service type, wooden packing, and shipping insurance. `Nomor resi` is the key number for tracking status. For fragile or high-value goods, ask clearly about packing, insurance, estimated arrival, and claim conditions if goods are damaged or lost.",
    tip_advice_vi:
      "Mẹo cho người Việt: trong logistics, học theo cặp: `berat barang` và `volume`, `packing kayu` và `biaya tambahan`, `asuransi pengiriman` và `klaim`, `nomor resi` và `cek status`. Khi hỏi số tiền dùng `berapa`; khi hỏi đã có/chưa dùng `sudah ... belum?`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: in logistics, learn pairs: `berat barang` and `volume`, `packing kayu` and `biaya tambahan`, `asuransi pengiriman` and `klaim`, `nomor resi` and `cek status`. Ask amounts with `berapa`; ask availability/status with `sudah ... belum?`.",
    vocabulary: [
      {
        word: "kargo",
        en: "cargo / freight",
        vi: "hàng kargo / vận tải hàng",
        pos: "noun",
        pronunciation_vi: "KAR-go",
        pronunciation_en: "KAR-go",
      },
      {
        word: "ekspedisi",
        en: "shipping/logistics company",
        vi: "công ty vận chuyển / giao nhận",
        pos: "noun",
        pronunciation_vi: "eks-pe-DI-si",
        pronunciation_en: "eks-pe-DEE-see",
      },
      {
        word: "berat barang",
        en: "goods weight",
        vi: "trọng lượng hàng",
        pos: "noun phrase",
        pronunciation_vi: "BE-rat BA-rang",
        pronunciation_en: "BEH-rat BA-rang",
      },
      {
        word: "volume",
        en: "volume / dimensional size",
        vi: "thể tích / kích thước khối",
        pos: "noun",
        pronunciation_vi: "VO-lu-me",
        pronunciation_en: "VO-loo-meh",
      },
      {
        word: "packing kayu",
        en: "wooden packing / crating",
        vi: "đóng kiện gỗ",
        pos: "noun phrase",
        pronunciation_vi: "PAK-ing KA-yu",
        pronunciation_en: "PAK-ing KA-yoo",
      },
      {
        word: "asuransi pengiriman",
        en: "shipping insurance",
        vi: "bảo hiểm vận chuyển",
        pos: "noun phrase",
        pronunciation_vi: "a-su-RAN-si pe-ngi-RI-man",
        pronunciation_en: "a-soo-RAN-see pe-ngi-REE-man",
      },
      {
        word: "nomor resi",
        en: "tracking number",
        vi: "số vận đơn",
        pos: "noun phrase",
        pronunciation_vi: "NO-mor RE-si",
        pronunciation_en: "NO-mor REH-see",
      },
      {
        word: "biaya kirim",
        en: "shipping cost",
        vi: "phí vận chuyển",
        pos: "noun phrase",
        pronunciation_vi: "bi-A-ya KI-rim",
        pronunciation_en: "bee-A-ya KEE-rim",
      },
    ],
    dialogue: [
      {
        speaker: "Pengirim",
        text: "Saya mau kirim barang lewat kargo ke Surabaya.",
        vi: "Tôi muốn gửi hàng bằng kargo đến Surabaya.",
        en: "I want to send goods by cargo to Surabaya.",
      },
      {
        speaker: "Petugas Ekspedisi",
        text: "Berat barangnya berapa kilo, dan volumenya kira-kira berapa?",
        vi: "Trọng lượng hàng bao nhiêu ký, và thể tích khoảng bao nhiêu?",
        en: "How many kilograms is the item, and roughly what is the volume?",
      },
      {
        speaker: "Pengirim",
        text: "Beratnya dua puluh lima kilo. Barangnya pecah belah, jadi perlu packing kayu.",
        vi: "Nặng hai mươi lăm ký. Hàng dễ vỡ, nên cần đóng kiện gỗ.",
        en: "It weighs twenty-five kilos. It is fragile, so it needs wooden packing.",
      },
      {
        speaker: "Petugas Ekspedisi",
        text: "Bisa. Packing kayu ada biaya tambahan. Mau tambah asuransi pengiriman juga?",
        vi: "Được. Đóng kiện gỗ có phụ phí. Anh/chị có muốn thêm bảo hiểm vận chuyển không?",
        en: "Yes. Wooden packing has an additional fee. Would you also like to add shipping insurance?",
      },
      {
        speaker: "Pengirim",
        text: "Iya, tambah asuransi. Setelah bayar, nomor resinya keluar kapan?",
        vi: "Có, thêm bảo hiểm. Sau khi thanh toán, khi nào có số vận đơn?",
        en: "Yes, add insurance. After payment, when will the tracking number be issued?",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi muốn gửi hàng bằng kargo.",
        prompt_en: "Translate into Indonesian: I want to send goods by cargo.",
        answer: "Saya mau kirim barang lewat kargo.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Barang pecah belah sebaiknya pakai packing ___.",
        prompt_en: "Fill in the blank: Barang pecah belah sebaiknya pakai packing ___.",
        answer: "kayu",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Số vận đơn đã có chưa?",
        prompt_en: "Translate into Indonesian: Has the tracking number been issued yet?",
        answer: "Nomor resinya sudah keluar belum?",
      },
      {
        type: "roleplay",
        prompt_vi: "Bạn ở quầy ekspedisi. Hỏi phí gửi đến Surabaya là bao nhiêu.",
        prompt_en: "You are at a shipping counter. Ask how much the shipping cost to Surabaya is.",
        answer: "Biaya kirim ke Surabaya berapa?",
      },
    ],
  },
];
