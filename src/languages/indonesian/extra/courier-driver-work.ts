// Courier Driver Work Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for courier work: picking up packages,
// delivering goods, unclear addresses, absent recipients, daily targets, and
// courier apps. Indonesian target text lives in `en`, Vietnamese glosses in
// `vi`, Vietnamese L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.

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

export const courierDriverWorkLessons: IndonesianLesson[] = [
  {
    id: "indonesian_courier_driver_work",
    level: "A2",
    category: "work_logistics",
    title_vi: "Công việc kurir: lấy paket và giao barang",
    title_en: "Courier work: picking up packages and delivering goods",
    sentences: [
      {
        en: "Saya bekerja sebagai kurir paket di aplikasi kurir.",
        vi: "Tôi làm việc như shipper giao gói hàng trên ứng dụng giao hàng.",
        pronunciation_focus: [
          "KU-rir PA-ket - `kurir paket` = shipper/người giao gói hàng.",
          "`sebagai` = với vai trò/là; trang trọng hơn `jadi` trong giới thiệu nghề.",
          "Lỗi người Việt: nói `shipper` ai cũng hiểu, nhưng từ Indonesia dùng rộng là `kurir`.",
          "Luyện: `Saya bekerja sebagai kurir paket.`",
        ],
        pronunciation_focus_en: [
          "KOO-rir PA-ket - `kurir paket` = parcel courier.",
          "`sebagai` = as/in the role of; more formal than `jadi` when introducing a job.",
          "VN-speaker trap: `shipper` is understood, but the common Indonesian word is `kurir`.",
          "Drill: `Saya bekerja sebagai kurir paket.`",
        ],
      },
      {
        en: "Pagi ini saya harus ambil paket di gudang.",
        vi: "Sáng nay tôi phải lấy gói hàng ở kho.",
        pronunciation_focus: [
          "AM-bil PA-ket di GU-dang - `ambil paket` = lấy/nhận gói hàng để đi giao.",
          "`gudang` = kho; đừng dùng từ Việt `kho` trong câu Indonesia.",
          "`harus` = phải; không chia động từ theo chủ ngữ.",
          "Luyện: `Saya ambil paket di gudang.`",
        ],
        pronunciation_focus_en: [
          "AM-bil PA-ket dee GOO-dang - `ambil paket` = pick up packages for delivery.",
          "`gudang` = warehouse; do not code-switch Vietnamese `kho`.",
          "`harus` = must; no verb conjugation by subject.",
          "Drill: `Saya ambil paket di gudang.`",
        ],
      },
      {
        en: "Saya antar barang sesuai urutan di aplikasi.",
        vi: "Tôi giao hàng theo thứ tự trong ứng dụng.",
        pronunciation_focus: [
          "AN-tar BA-rang se-SU-ai u-RUT-an - `antar barang` = giao/chở hàng.",
          "`sesuai urutan` = theo đúng thứ tự; hay dùng trong lịch giao hàng.",
          "Lỗi người Việt: dùng `kirim` cho mọi hành động. Kurir trực tiếp giao đến người nhận thường nói `antar`.",
          "Luyện: `Saya antar barang sesuai urutan.`",
        ],
        pronunciation_focus_en: [
          "AN-tar BA-rang se-SU-ai oo-ROOT-an - `antar barang` = deliver goods/items.",
          "`sesuai urutan` = according to the order/sequence; common for delivery routes.",
          "VN-speaker trap: using `kirim` for every delivery action. A courier physically delivers with `antar`.",
          "Drill: `Saya antar barang sesuai urutan.`",
        ],
      },
      {
        en: "Alamat penerima kurang jelas di aplikasi.",
        vi: "Địa chỉ người nhận không rõ trong ứng dụng.",
        pronunciation_focus: [
          "a-LA-mat pe-ne-RI-ma KU-rang JE-las - `alamat penerima` = địa chỉ người nhận.",
          "`kurang jelas` = chưa rõ/không đủ rõ; mềm hơn `tidak jelas`.",
          "Lỗi người Việt: nói `alamat tidak terang`. Cụm tự nhiên là `alamat kurang jelas`.",
          "Luyện: `Alamatnya kurang jelas.`",
        ],
        pronunciation_focus_en: [
          "a-LA-mat pe-ne-REE-ma KOO-rang JE-las - `alamat penerima` = recipient address.",
          "`kurang jelas` = unclear/not clear enough; softer than `tidak jelas`.",
          "VN-speaker trap: saying `alamat tidak terang`. Natural phrase: `alamat kurang jelas`.",
          "Drill: `Alamatnya kurang jelas.`",
        ],
      },
      {
        en: "Saya telepon penerima karena rumahnya sulit ditemukan.",
        vi: "Tôi gọi cho người nhận vì nhà khó tìm.",
        pronunciation_focus: [
          "te-le-PON pe-ne-RI-ma - `telepon penerima` = gọi người nhận.",
          "`sulit ditemukan` = khó tìm thấy; bị động `di-` trong `ditemukan`.",
          "Mẹo: khi không tìm được nhà, câu lịch sự là `Bisa share lokasi?` hoặc `Patokannya apa?`.",
          "Luyện: `Rumahnya sulit ditemukan.`",
        ],
        pronunciation_focus_en: [
          "te-le-PON pe-ne-REE-ma - `telepon penerima` = call the recipient.",
          "`sulit ditemukan` = hard to find; passive `di-` in `ditemukan`.",
          "Tip: when you cannot find the house, polite lines are `Bisa share lokasi?` or `Patokannya apa?`.",
          "Drill: `Rumahnya sulit ditemukan.`",
        ],
      },
      {
        en: "Penerima tidak ada di rumah, jadi paket saya bawa kembali.",
        vi: "Người nhận không có ở nhà, nên tôi mang gói hàng về lại.",
        pronunciation_focus: [
          "pe-ne-RI-ma TI-dak A-da di RU-mah - `penerima tidak ada` = người nhận vắng/không có mặt.",
          "`saya bawa kembali` = tôi mang lại/quay về với gói hàng.",
          "Lỗi người Việt: nói `penerima tidak punya`. `Tidak ada` = không có mặt; `tidak punya` = không sở hữu.",
          "Luyện: `Penerima tidak ada di rumah.`",
        ],
        pronunciation_focus_en: [
          "pe-ne-REE-ma TEE-dak A-da dee ROO-mah - `penerima tidak ada` = recipient is not there.",
          "`saya bawa kembali` = I bring it back.",
          "VN-speaker trap: saying `penerima tidak punya`. `Tidak ada` = absent/not there; `tidak punya` = does not own.",
          "Drill: `Penerima tidak ada di rumah.`",
        ],
      },
      {
        en: "Target harian saya lima puluh paket.",
        vi: "Chỉ tiêu hằng ngày của tôi là năm mươi gói hàng.",
        pronunciation_focus: [
          "TAR-get HA-ri-an - `target harian` = chỉ tiêu hằng ngày.",
          "`lima puluh paket` = năm mươi gói; số đứng trước danh từ.",
          "Lỗi người Việt: lẫn `lima belas` (15) và `lima puluh` (50). `Belas` = mười mấy; `puluh` = chục.",
          "Luyện: `Target harian saya lima puluh paket.`",
        ],
        pronunciation_focus_en: [
          "TAR-get HA-ree-an - `target harian` = daily target.",
          "`lima puluh paket` = fifty packages; number comes before the noun.",
          "VN-speaker trap: mixing `lima belas` (15) and `lima puluh` (50). `Belas` = teens; `puluh` = tens.",
          "Drill: `Target harian saya lima puluh paket.`",
        ],
      },
      {
        en: "Setelah paket diterima, saya minta tanda tangan di aplikasi.",
        vi: "Sau khi gói hàng được nhận, tôi xin chữ ký trong ứng dụng.",
        pronunciation_focus: [
          "se-TE-lah PA-ket di-te-RI-ma - `diterima` = được nhận.",
          "`minta tanda tangan` = xin chữ ký; `tanda tangan` nghĩa đen là dấu tay/chữ ký.",
          "`di aplikasi` = trong/trên ứng dụng; `di` dùng cho nền tảng app.",
          "Luyện: `Saya minta tanda tangan.`",
        ],
        pronunciation_focus_en: [
          "se-TE-lah PA-ket dee-te-REE-ma - `diterima` = received.",
          "`minta tanda tangan` = ask for a signature; literally 'hand mark'.",
          "`di aplikasi` = in/on the app; `di` is used for app platforms.",
          "Drill: `Saya minta tanda tangan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Kurir paket ở Indonesia thường làm qua aplikasi kurir hoặc perusahaan ekspedisi. Một ngày làm việc có thể gồm ambil paket di gudang, scan barcode/resi, antar barang theo rute, gọi penerima, cập nhật status di aplikasi, và xử lý paket gagal antar. Nếu alamat kurang jelas, kurir thường hỏi `patokan` (mốc gần đó), share lokasi, hoặc nomor telepon penerima. Nếu penerima tidak ada, paket có thể dibawa kembali hoặc dijadwalkan ulang tùy aturan perusahaan.",
    cultural_notes_en:
      "Parcel couriers in Indonesia often work through courier apps or logistics companies. A workday may include picking up packages at a warehouse, scanning barcodes/tracking numbers, delivering by route, calling recipients, updating app status, and handling failed deliveries. If an address is unclear, couriers often ask for a `patokan` (nearby landmark), shared location, or recipient phone number. If the recipient is absent, the package may be brought back or rescheduled depending on company rules.",
    tip_advice_vi:
      "Mẹo cho người Việt: trong giao hàng, phân biệt `kirim` = gửi, `antar` = giao/đưa đến tận nơi, `ambil` = lấy, `bawa kembali` = mang về lại. Các cụm cần học nguyên khối: `alamat kurang jelas`, `penerima tidak ada`, `target harian`, `aplikasi kurir`, `minta tanda tangan`, `paket gagal antar`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: in delivery work, distinguish `kirim` = send, `antar` = deliver/take to the destination, `ambil` = pick up, and `bawa kembali` = bring back. Learn these chunks whole: `alamat kurang jelas`, `penerima tidak ada`, `target harian`, `aplikasi kurir`, `minta tanda tangan`, `paket gagal antar`.",
    vocabulary: [
      {
        word: "kurir paket",
        en: "parcel courier",
        vi: "người giao gói hàng / shipper",
        pos: "noun phrase",
        pronunciation_vi: "KU-rir PA-ket",
        pronunciation_en: "KOO-rir PA-ket",
      },
      {
        word: "ambil paket",
        en: "pick up a package",
        vi: "lấy gói hàng",
        pos: "verb phrase",
        pronunciation_vi: "AM-bil PA-ket",
        pronunciation_en: "AM-bil PA-ket",
      },
      {
        word: "antar barang",
        en: "deliver goods/items",
        vi: "giao hàng / đưa hàng",
        pos: "verb phrase",
        pronunciation_vi: "AN-tar BA-rang",
        pronunciation_en: "AN-tar BA-rang",
      },
      {
        word: "alamat kurang jelas",
        en: "unclear address",
        vi: "địa chỉ không rõ",
        pos: "phrase",
        pronunciation_vi: "a-LA-mat KU-rang JE-las",
        pronunciation_en: "a-LA-mat KOO-rang JE-las",
      },
      {
        word: "penerima",
        en: "recipient",
        vi: "người nhận",
        pos: "noun",
        pronunciation_vi: "pe-ne-RI-ma",
        pronunciation_en: "pe-ne-REE-ma",
      },
      {
        word: "target harian",
        en: "daily target",
        vi: "chỉ tiêu hằng ngày",
        pos: "noun phrase",
        pronunciation_vi: "TAR-get HA-ri-an",
        pronunciation_en: "TAR-get HA-ree-an",
      },
      {
        word: "aplikasi kurir",
        en: "courier app",
        vi: "ứng dụng giao hàng",
        pos: "noun phrase",
        pronunciation_vi: "a-pli-KA-si KU-rir",
        pronunciation_en: "ap-lee-KA-see KOO-rir",
      },
      {
        word: "tanda tangan",
        en: "signature",
        vi: "chữ ký",
        pos: "noun phrase",
        pronunciation_vi: "TAN-da TA-ngan",
        pronunciation_en: "TAN-da TA-ngan",
      },
      {
        word: "patokan",
        en: "landmark / reference point",
        vi: "mốc chỉ đường",
        pos: "noun",
        pronunciation_vi: "pa-TO-kan",
        pronunciation_en: "pa-TO-kan",
      },
      {
        word: "gagal antar",
        en: "failed delivery",
        vi: "giao không thành công",
        pos: "phrase",
        pronunciation_vi: "GA-gal AN-tar",
        pronunciation_en: "GA-gal AN-tar",
      },
    ],
    dialogue: [
      {
        speaker: "Kurir",
        text: "Halo, saya kurir paket. Alamat rumahnya nomor berapa?",
        vi: "Alo, tôi là shipper giao hàng. Số nhà là bao nhiêu ạ?",
        en: "Hello, I am the parcel courier. What is the house number?",
      },
      {
        speaker: "Penerima",
        text: "Nomor 18, dekat warung hijau. Saya share lokasi sekarang.",
        vi: "Số 18, gần quán màu xanh. Tôi chia sẻ vị trí bây giờ.",
        en: "Number 18, near the green stall. I will share the location now.",
      },
      {
        speaker: "Kurir",
        text: "Baik. Setelah paket diterima, mohon tanda tangan di aplikasi.",
        vi: "Vâng. Sau khi nhận gói hàng, xin ký trong ứng dụng.",
        en: "Okay. After the package is received, please sign in the app.",
      },
      {
        speaker: "Penerima",
        text: "Siap, saya tunggu di depan rumah.",
        vi: "Vâng, tôi đợi trước nhà.",
        en: "Sure, I will wait in front of the house.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ/cụm từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word or phrase with its Vietnamese meaning:",
        items: [
          { prompt: "kurir paket", answer: "người giao gói hàng" },
          { prompt: "alamat kurang jelas", answer: "địa chỉ không rõ" },
          { prompt: "target harian", answer: "chỉ tiêu hằng ngày" },
          { prompt: "tanda tangan", answer: "chữ ký" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu:",
        instruction_en: "Fill in the missing word:",
        items: [
          {
            prompt: "Pagi ini saya harus ___ paket di gudang. (lấy)",
            answer: "ambil",
            options: ["ambil", "antar", "angkat"],
          },
          {
            prompt: "Alamat penerima kurang ___. (rõ)",
            answer: "jelas",
            options: ["jelas", "jauh", "jalan"],
          },
          {
            prompt: "Penerima tidak ___ di rumah. (có mặt)",
            answer: "ada",
            options: ["ada", "ambil", "antar"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi làm việc như shipper giao gói hàng.", answer: "Saya bekerja sebagai kurir paket." },
          { prompt: "Địa chỉ người nhận không rõ trong ứng dụng.", answer: "Alamat penerima kurang jelas di aplikasi." },
          { prompt: "Chỉ tiêu hằng ngày của tôi là năm mươi gói hàng.", answer: "Target harian saya lima puluh paket." },
        ],
      },
    ],
  },
];

export default courierDriverWorkLessons;
