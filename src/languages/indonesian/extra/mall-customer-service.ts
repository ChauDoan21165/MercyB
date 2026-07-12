// Mall Customer Service Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for mall customer service: information desk,
// lost items, parking, toilets, musala, shopping vouchers, and store complaints.
// Indonesian target text lives in `en`, Vietnamese glosses in `vi`, Vietnamese
// L1 notes in `pronunciation_focus`, and English companions in
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
  cell_id?: string;
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
  cell_id?: string;
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

export const mallCustomerServiceLessons: IndonesianLesson[] = [
  {
    id: "indonesian_mall_customer_service",
    level: "A2",
    category: "shopping_services",
    title_vi: "Dịch vụ khách hàng ở mal Indonesia",
    title_en: "Customer service at an Indonesian mall",
    sentences: [
      {
        en: "Permisi, pusat informasi mal ada di lantai berapa?",
        vi: "Xin lỗi, quầy thông tin của trung tâm thương mại ở tầng mấy?",
        pronunciation_focus: [
          "PU-sat in-for-MA-si - `pusat informasi` = quầy/trung tâm thông tin.",
          "`mal` = trung tâm thương mại; tiếng Indonesia thường viết `mal`, không phải luôn `mall`.",
          "`lantai berapa` hỏi tầng mấy; `berapa` dùng cho số.",
          "Luyện: `Pusat informasi ada di lantai berapa?`",
        ],
        pronunciation_focus_en: [
          "POO-sat in-for-MA-si - `pusat informasi` = information desk/center.",
          "`mal` = shopping mall; Indonesian commonly writes `mal`, not always English `mall`.",
          "`lantai berapa` asks which floor; `berapa` is for numbers.",
          "Drill: `Pusat informasi ada di lantai berapa?`",
        ],
      },
      {
        en: "Saya kehilangan dompet di area food court.",
        vi: "Tôi bị mất ví ở khu food court.",
        pronunciation_focus: [
          "ke-hi-LANG-an DOM-pet - `kehilangan dompet` = bị mất ví.",
          "`area food court` = khu ăn uống; cụm tiếng Anh này rất phổ biến trong mal.",
          "Lỗi người Việt: nói `dompet saya hilang` được, nhưng khi báo với petugas, `saya kehilangan dompet` rõ hơn.",
          "Luyện: `Saya kehilangan dompet.`",
        ],
        pronunciation_focus_en: [
          "ke-hi-LANG-an DOM-pet - `kehilangan dompet` = lost a wallet.",
          "`area food court` = food court area; this English phrase is common in malls.",
          "VN-speaker trap: `dompet saya hilang` works, but when reporting to staff, `saya kehilangan dompet` is clearer.",
          "Drill: `Saya kehilangan dompet.`",
        ],
      },
      {
        en: "Apakah ada layanan barang hilang?",
        vi: "Có dịch vụ/quầy đồ thất lạc không?",
        pronunciation_focus: [
          "BA-rang HI-lang - `barang hilang` = đồ bị mất/thất lạc.",
          "`layanan` = dịch vụ; dùng được cho quầy hỗ trợ trong mal.",
          "`apakah ada...` là câu hỏi lịch sự hơn chỉ hỏi `ada...?`.",
          "Luyện: `Apakah ada layanan barang hilang?`",
        ],
        pronunciation_focus_en: [
          "BA-rang HEE-lang - `barang hilang` = lost item.",
          "`layanan` = service; useful for mall help desks.",
          "`apakah ada...` is more polite than only asking `ada...?`.",
          "Drill: `Apakah ada layanan barang hilang?`",
        ],
      },
      {
        en: "Tiket parkir saya hilang, harus lapor ke mana?",
        vi: "Vé gửi xe của tôi bị mất, tôi phải báo ở đâu?",
        pronunciation_focus: [
          "TI-ket PAR-kir - `tiket parkir` = vé gửi xe/vé bãi đậu xe.",
          "`harus lapor ke mana` = phải báo ở đâu; rất thực dụng khi gặp sự cố.",
          "Lỗi người Việt: dùng `di mana` sau `lapor` khi có hướng đến quầy. Tự nhiên hơn: `lapor ke mana`.",
          "Luyện: `Tiket parkir saya hilang.`",
        ],
        pronunciation_focus_en: [
          "TEE-ket PAR-kir - `tiket parkir` = parking ticket.",
          "`harus lapor ke mana` = where should I report; practical for problems.",
          "VN-speaker trap: using `di mana` after `lapor` when asking direction to a counter. Natural: `lapor ke mana`.",
          "Drill: `Tiket parkir saya hilang.`",
        ],
      },
      {
        en: "Toilet terdekat ada di sebelah mana?",
        vi: "Nhà vệ sinh gần nhất ở phía nào?",
        pronunciation_focus: [
          "toi-LET ter-DE-kat - `toilet terdekat` = nhà vệ sinh gần nhất.",
          "`sebelah mana` = phía nào/bên nào; dùng khi đang ở trong tòa nhà.",
          "Mẹo: cũng có thể hỏi `di mana toilet terdekat?`, nhưng `sebelah mana` nghe tự nhiên khi hỏi hướng.",
          "Luyện: `Toilet terdekat sebelah mana?`",
        ],
        pronunciation_focus_en: [
          "toi-LET ter-DE-kat - `toilet terdekat` = nearest restroom.",
          "`sebelah mana` = which side/direction; useful inside buildings.",
          "Tip: `di mana toilet terdekat?` also works, but `sebelah mana` sounds natural for directions.",
          "Drill: `Toilet terdekat sebelah mana?`",
        ],
      },
      {
        en: "Musala di mal ini ada di dekat parkiran atau lantai atas?",
        vi: "Phòng cầu nguyện trong mal này ở gần bãi xe hay tầng trên?",
        pronunciation_focus: [
          "mu-SA-la - `musala` = phòng cầu nguyện nhỏ, thường có trong mal Indonesia.",
          "`parkiran` = khu/bãi đậu xe; khẩu ngữ rất phổ biến.",
          "`lantai atas` = tầng trên; đối lập với `lantai bawah`.",
          "Luyện: `Musala ada di mana?`",
        ],
        pronunciation_focus_en: [
          "mu-SA-la - `musala` = small prayer room, common in Indonesian malls.",
          "`parkiran` = parking area; very common spoken word.",
          "`lantai atas` = upper floor; opposite of `lantai bawah`.",
          "Drill: `Musala ada di mana?`",
        ],
      },
      {
        en: "Voucher belanja ini bisa dipakai di toko mana saja?",
        vi: "Voucher mua sắm này có thể dùng ở những cửa hàng nào?",
        pronunciation_focus: [
          "VOU-cher be-LAN-ja - `voucher belanja` = phiếu mua sắm/ưu đãi.",
          "`toko mana saja` = những cửa hàng nào; `saja` mở rộng nghĩa 'bất kỳ/những'.",
          "Lỗi người Việt: hỏi `di toko apa` khi cần danh sách nơi dùng. Dùng `toko mana saja`.",
          "Luyện: `Voucher ini bisa dipakai di mana?`",
        ],
        pronunciation_focus_en: [
          "VOU-cher be-LAN-ja - `voucher belanja` = shopping voucher.",
          "`toko mana saja` = which stores; `saja` broadens it to a set/list.",
          "VN-speaker trap: asking `di toko apa` when you need eligible stores. Use `toko mana saja`.",
          "Drill: `Voucher ini bisa dipakai di mana?`",
        ],
      },
      {
        en: "Saya mau mengajukan komplain tentang pelayanan toko ini.",
        vi: "Tôi muốn gửi khiếu nại về dịch vụ của cửa hàng này.",
        pronunciation_focus: [
          "me-nga-JU-kan kom-PLAIN - `mengajukan komplain` = gửi/nộp khiếu nại.",
          "`pelayanan toko` = dịch vụ/phục vụ của cửa hàng.",
          "Lỗi người Việt: nói `saya komplain toko` nghe thiếu rõ. Câu lịch sự: `komplain tentang pelayanan toko ini`.",
          "Luyện: `Saya mau mengajukan komplain.`",
        ],
        pronunciation_focus_en: [
          "me-nga-JOO-kan kom-PLAIN - `mengajukan komplain` = submit a complaint.",
          "`pelayanan toko` = store service.",
          "VN-speaker trap: saying `saya komplain toko`, which is unclear. Polite: `komplain tentang pelayanan toko ini`.",
          "Drill: `Saya mau mengajukan komplain.`",
        ],
      },
      {
        en: "Boleh minta nomor laporan untuk komplain saya?",
        vi: "Tôi xin số hồ sơ/báo cáo cho khiếu nại của tôi được không?",
        pronunciation_focus: [
          "NO-mor la-PO-ran - `nomor laporan` = số báo cáo/số hồ sơ.",
          "`boleh minta` = xin được không; mềm hơn `kasih saya`.",
          "Mẹo: sau khi báo barang hilang hoặc komplain, luôn xin `nomor laporan` để follow up.",
          "Luyện: `Boleh minta nomor laporan?`",
        ],
        pronunciation_focus_en: [
          "NO-mor la-PO-ran - `nomor laporan` = report/reference number.",
          "`boleh minta` = may I ask for; softer than `kasih saya`.",
          "Tip: after reporting lost items or complaints, ask for a `nomor laporan` to follow up.",
          "Drill: `Boleh minta nomor laporan?`",
        ],
      },
      {
        en: "Mohon hubungi saya kalau barangnya ditemukan.",
        vi: "Xin liên hệ với tôi nếu món đồ được tìm thấy.",
        pronunciation_focus: [
          "MO-hon hu-BUNG-i - `mohon hubungi` = xin vui lòng liên hệ; lịch sự cho dịch vụ khách hàng.",
          "`barangnya ditemukan` = món đồ được tìm thấy; bị động không cần nêu người tìm.",
          "`kalau` = nếu; dùng tự nhiên trong lời nhờ.",
          "Luyện: `Mohon hubungi saya.`",
        ],
        pronunciation_focus_en: [
          "MO-hon hu-BOONG-i - `mohon hubungi` = please contact; polite for customer service.",
          "`barangnya ditemukan` = if the item is found; passive without naming the finder.",
          "`kalau` = if; natural in requests.",
          "Drill: `Mohon hubungi saya.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở nhiều mal Indonesia, `pusat informasi` hoặc customer service giúp hỏi hướng, tìm toko, báo `barang hilang`, xử lý tiket parkir, đổi voucher belanja, và menerima komplain toko. `Musala` gần như là tiện ích quen thuộc trong mal lớn, thường nằm gần toilet, food court, hoặc parkiran. Khi báo đồ thất lạc, nên mô tả barang, lokasi terakhir, waktu, nomor HP, và xin `nomor laporan` để theo dõi.",
    cultural_notes_en:
      "In many Indonesian malls, the `pusat informasi` or customer service desk helps with directions, store lookup, lost items, parking-ticket issues, shopping vouchers, and store complaints. A `musala` is a common facility in larger malls, often near restrooms, the food court, or parking areas. When reporting a lost item, describe the item, last location, time, phone number, and ask for a `nomor laporan` for follow-up.",
    tip_advice_vi:
      "Mẹo cho người Việt: trong mal, dùng câu ngắn lịch sự với `permisi`, `boleh minta`, `mohon`, `apakah ada`. Phân biệt `barang hilang` = đồ thất lạc, `tiket parkir` = vé gửi xe, `pusat informasi` = quầy thông tin, `musala` = phòng cầu nguyện. Khi hỏi đường trong tòa nhà, `sebelah mana?` rất tự nhiên.",
    tip_advice_en:
      "Tip for Vietnamese speakers: in malls, use short polite frames with `permisi`, `boleh minta`, `mohon`, and `apakah ada`. Distinguish `barang hilang` = lost item, `tiket parkir` = parking ticket, `pusat informasi` = information desk, and `musala` = prayer room. For indoor directions, `sebelah mana?` is very natural.",
    vocabulary: [
      {
        cell_id: "e373fd8f-a603-4f90-b215-d69fb2a7e0ed",
        word: "pusat informasi",
        en: "information desk",
        vi: "quầy thông tin",
        pos: "noun phrase",
        pronunciation_vi: "PU-sat in-for-MA-si",
        pronunciation_en: "POO-sat in-for-MA-see",
      },
      {
        cell_id: "bdfba9f0-bde8-48ef-95fe-fb8f7554614f",
        word: "mal",
        en: "mall",
        vi: "trung tâm thương mại",
        pos: "noun",
        pronunciation_vi: "mal",
        pronunciation_en: "mal",
      },
      {
        cell_id: "c0c7b37e-b9dc-45a7-95ac-6219df6dfcf7",
        word: "barang hilang",
        en: "lost item",
        vi: "đồ thất lạc",
        pos: "noun phrase",
        pronunciation_vi: "BA-rang HI-lang",
        pronunciation_en: "BA-rang HEE-lang",
      },
      {
        cell_id: "789a4a60-a48f-468e-a0f6-33f8c0cc2298",
        word: "tiket parkir",
        en: "parking ticket",
        vi: "vé gửi xe / vé bãi đậu xe",
        pos: "noun phrase",
        pronunciation_vi: "TI-ket PAR-kir",
        pronunciation_en: "TEE-ket PAR-kir",
      },
      {
        cell_id: "edb6a003-1b85-4f53-a642-f2cbeb834579",
        word: "toilet terdekat",
        en: "nearest restroom",
        vi: "nhà vệ sinh gần nhất",
        pos: "noun phrase",
        pronunciation_vi: "toi-LET ter-DE-kat",
        pronunciation_en: "toi-LET ter-DE-kat",
      },
      {
        cell_id: "3ba05966-a23e-46ca-b78a-6c593859d0e9",
        word: "musala",
        en: "prayer room",
        vi: "phòng cầu nguyện",
        pos: "noun",
        pronunciation_vi: "mu-SA-la",
        pronunciation_en: "mu-SA-la",
      },
      {
        cell_id: "06ce1587-d586-44ac-91d4-d47c1e51db4d",
        word: "voucher belanja",
        en: "shopping voucher",
        vi: "voucher / phiếu mua sắm",
        pos: "noun phrase",
        pronunciation_vi: "VOU-cher be-LAN-ja",
        pronunciation_en: "VOU-cher be-LAN-ja",
      },
      {
        cell_id: "14f55a03-17b2-4834-892e-971397913859",
        word: "komplain toko",
        en: "store complaint",
        vi: "khiếu nại về cửa hàng",
        pos: "noun phrase",
        pronunciation_vi: "kom-PLAIN TO-ko",
        pronunciation_en: "kom-PLAIN TO-ko",
      },
      {
        cell_id: "7adcaa3b-5917-491f-a7a6-e8823ba055cd",
        word: "nomor laporan",
        en: "report number",
        vi: "số báo cáo / số hồ sơ",
        pos: "noun phrase",
        pronunciation_vi: "NO-mor la-PO-ran",
        pronunciation_en: "NO-mor la-PO-ran",
      },
      {
        cell_id: "e9e2d1b0-7534-4cfd-98b6-6769a61c897e",
        word: "ditemukan",
        en: "found",
        vi: "được tìm thấy",
        pos: "verb",
        pronunciation_vi: "di-te-MU-kan",
        pronunciation_en: "dee-te-MOO-kan",
      },
    ],
    dialogue: [
      {
        cell_id: "0822936a-179d-4279-ae3d-7ee3c3bf5bd7",
        speaker: "Pengunjung",
        text: "Permisi, pusat informasi ada di lantai berapa?",
        vi: "Xin lỗi, quầy thông tin ở tầng mấy?",
        en: "Excuse me, which floor is the information desk on?",
      },
      {
        cell_id: "3b90424a-2c18-48bf-90cf-7070a3c122ed",
        speaker: "Petugas",
        text: "Ada di lantai satu, dekat pintu utama.",
        vi: "Ở tầng một, gần cửa chính.",
        en: "It is on the first floor, near the main entrance.",
      },
      {
        cell_id: "3d043022-1d63-4f1c-bdb6-c7b31bdc6096",
        speaker: "Pengunjung",
        text: "Saya kehilangan dompet di area food court. Apakah ada layanan barang hilang?",
        vi: "Tôi bị mất ví ở khu food court. Có dịch vụ đồ thất lạc không?",
        en: "I lost my wallet in the food court area. Is there a lost-item service?",
      },
      {
        cell_id: "dee656d2-c7f9-44cd-b487-269c7392470c",
        speaker: "Petugas",
        text: "Ada. Kami bantu buat laporan. Boleh sebutkan ciri-ciri dompetnya?",
        vi: "Có. Chúng tôi hỗ trợ lập báo cáo. Anh/chị mô tả đặc điểm ví được không?",
        en: "Yes. We can help make a report. Could you describe the wallet?",
      },
      {
        cell_id: "a8219a82-4895-4abf-bf1e-c4048d8f8116",
        speaker: "Pengunjung",
        text: "Terima kasih. Mohon hubungi saya kalau barangnya ditemukan.",
        vi: "Cảm ơn. Xin liên hệ với tôi nếu món đồ được tìm thấy.",
        en: "Thank you. Please contact me if the item is found.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền cụm từ dịch vụ mal còn thiếu:",
        instruction_en: "Fill in the missing mall-service phrase:",
        items: [
          {
            prompt: "Permisi, pusat ___ ada di lantai berapa?",
            answer: "informasi",
            options: ["informasi", "imigrasi", "inflasi"],
          },
          {
            prompt: "Saya kehilangan dompet di area ___.",
            answer: "food court",
            options: ["food court", "formulir", "fotokopi"],
          },
          {
            prompt: "Voucher belanja ini bisa dipakai di ___ mana saja?",
            answer: "toko",
            options: ["toko", "tol", "tiket"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ Indonesia với nghĩa tiếng Việt:",
        instruction_en: "Match the Indonesian phrase with its Vietnamese meaning:",
        items: [
          { prompt: "pusat informasi", answer: "quầy thông tin" },
          { prompt: "barang hilang", answer: "đồ thất lạc" },
          { prompt: "tiket parkir", answer: "vé gửi xe" },
          { prompt: "musala", answer: "phòng cầu nguyện" },
          { prompt: "voucher belanja", answer: "phiếu mua sắm" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          {
            prompt: "Quầy thông tin của mal ở tầng mấy?",
            answer: "Pusat informasi mal ada di lantai berapa?",
          },
          {
            prompt: "Tôi bị mất ví ở khu food court.",
            answer: "Saya kehilangan dompet di area food court.",
          },
          {
            prompt: "Xin liên hệ với tôi nếu món đồ được tìm thấy.",
            answer: "Mohon hubungi saya kalau barangnya ditemukan.",
          },
        ],
      },
    ],
  },
];

export default mallCustomerServiceLessons;
