// Moving House Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for moving day: pindahan rumah, renting a
// pickup, boxes, carrying things, new address, new neighbors, and cleaning.
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

export const movingHouseLessons: IndonesianLesson[] = [
  {
    id: "indonesian_moving_house_practical",
    level: "A2",
    category: "housing",
    title_vi: "Chuyển nhà: thuê xe, đóng thùng và chào hàng xóm mới",
    title_en: "Moving house: renting a pickup, boxes and new neighbors",
    sentences: [
      {
        en: "Akhir pekan ini kami pindahan rumah.",
        vi: "Cuối tuần này chúng tôi chuyển nhà.",
        pronunciation_focus: [
          "A-khir PE-kan I-ni KA-mi pin-DA-han RU-mah - `pindahan rumah` = việc chuyển nhà.",
          "`kami` = chúng tôi không gồm người nghe; nếu rủ người nghe cùng làm, dùng `kita`.",
          "Lỗi người Việt: nói `pindah rumah` cho cả sự kiện. Đúng: `pindah rumah` = chuyển nhà; `pindahan rumah` = ngày/việc dọn nhà.",
          "Luyện: `Kami pindahan rumah akhir pekan ini.`",
        ],
        pronunciation_focus_en: [
          "A-khir PE-kan EE-nee KA-mee pin-DA-han ROO-mah - `pindahan rumah` = the house move/moving event.",
          "`kami` = we excluding the listener; if inviting the listener into the action, use `kita`.",
          "VN-speaker trap: using `pindah rumah` for the event. `Pindah rumah` = move house; `pindahan rumah` = the moving day/process.",
          "Drill: `Kami pindahan rumah akhir pekan ini.`",
        ],
      },
      {
        en: "Saya mau sewa mobil bak untuk angkut barang.",
        vi: "Tôi muốn thuê xe bán tải/thùng để chở đồ.",
        pronunciation_focus: [
          "SE-wa MO-bil BAK - `mobil bak` = xe có thùng sau/pickup nhỏ.",
          "`angkut barang` = chở/khuân đồ; `barang` = đồ đạc/hàng hóa.",
          "Lỗi người Việt: dùng `bawa barang` cho đồ nhiều/nặng. Khi chở đồ chuyển nhà, `angkut barang` tự nhiên hơn.",
          "Luyện: `Sewa mobil bak untuk angkut barang.`",
        ],
        pronunciation_focus_en: [
          "SE-wa MO-bil BAK - `mobil bak` = pickup/open-bed vehicle.",
          "`angkut barang` = transport/carry goods; `barang` = belongings/goods.",
          "VN-speaker trap: using `bawa barang` for many heavy items. For moving-house transport, `angkut barang` is more natural.",
          "Drill: `Sewa mobil bak untuk angkut barang.`",
        ],
      },
      {
        en: "Tolong siapkan kardus besar untuk pakaian dan buku.",
        vi: "Làm ơn chuẩn bị thùng carton lớn cho quần áo và sách.",
        pronunciation_focus: [
          "TO-long si-AP-kan KAR-dus be-SAR - `siapkan` = chuẩn bị; `kardus` = thùng carton.",
          "`pakaian dan buku` = quần áo và sách; `pakaian` trang trọng hơn `baju`.",
          "Lỗi người Việt: đọc `kardus` như tiếng Anh `card`. Giữ âm Indonesia: KAR-dus.",
          "Luyện: `Siapkan kardus besar.`",
        ],
        pronunciation_focus_en: [
          "TO-long see-AP-kan KAR-doos be-SAR - `siapkan` = prepare; `kardus` = cardboard box.",
          "`pakaian dan buku` = clothes and books; `pakaian` is broader/more formal than `baju`.",
          "VN-speaker trap: reading `kardus` like English `card`. Keep Indonesian sound: KAR-dus.",
          "Drill: `Siapkan kardus besar.`",
        ],
      },
      {
        en: "Barang yang mudah pecah harus dibungkus dengan koran.",
        vi: "Đồ dễ vỡ phải được bọc bằng giấy báo.",
        pronunciation_focus: [
          "MU-dah PE-chah - `mudah pecah` = dễ vỡ; `pecah` = vỡ/bể.",
          "`dibungkus dengan koran` = được bọc bằng giấy báo; bị động `di-` rất tự nhiên trong hướng dẫn.",
          "Lỗi người Việt: nói `barang pecah mudah`. Tính từ/cụm mô tả đứng sau danh từ: `barang yang mudah pecah`.",
          "Luyện: `Barang mudah pecah harus dibungkus.`",
        ],
        pronunciation_focus_en: [
          "MOO-dah PE-chah - `mudah pecah` = breakable/fragile; `pecah` = break/shatter.",
          "`dibungkus dengan koran` = wrapped with newspaper; passive `di-` is natural in instructions.",
          "VN-speaker trap: saying `barang pecah mudah`. The describing phrase follows the noun: `barang yang mudah pecah`.",
          "Drill: `Barang mudah pecah harus dibungkus.`",
        ],
      },
      {
        en: "Bisa bantu angkat lemari ini ke mobil?",
        vi: "Có thể giúp khiêng cái tủ này ra xe không?",
        pronunciation_focus: [
          "BI-sa BAN-tu ANG-kat le-MA-ri I-ni ke MO-bil - `angkat` = nhấc/khiêng.",
          "`lemari` = tủ; `ke mobil` = ra/đến xe, dùng `ke` cho hướng di chuyển.",
          "Mẹo lịch sự: `Bisa bantu ...?` mềm và tự nhiên khi nhờ người giúp chuyển đồ.",
          "Luyện: `Bisa bantu angkat lemari?`",
        ],
        pronunciation_focus_en: [
          "BEE-sa BAN-too ANG-kat le-MA-ree EE-nee ke MO-bil - `angkat` = lift/carry.",
          "`lemari` = cupboard/wardrobe; `ke mobil` = to the car/truck, using `ke` for direction.",
          "Politeness tip: `Bisa bantu ...?` is soft and natural when asking for moving help.",
          "Drill: `Bisa bantu angkat lemari?`",
        ],
      },
      {
        en: "Alamat baru saya sudah saya kirim lewat WhatsApp.",
        vi: "Địa chỉ mới của tôi tôi đã gửi qua WhatsApp rồi.",
        pronunciation_focus: [
          "a-LA-mat BA-ru SA-ya - `alamat baru` = địa chỉ mới.",
          "`sudah saya kirim` = tôi đã gửi; mẫu bị động thân mật với `saya` trước động từ gốc.",
          "`lewat WhatsApp` = qua WhatsApp; `lewat` dùng cho kênh/phương tiện.",
          "Luyện: `Alamat baru sudah saya kirim.`",
        ],
        pronunciation_focus_en: [
          "a-LA-mat BA-roo SA-ya - `alamat baru` = new address.",
          "`sudah saya kirim` = I have sent it; informal passive-like pattern with `saya` before the root verb.",
          "`lewat WhatsApp` = via WhatsApp; `lewat` marks the channel/medium.",
          "Drill: `Alamat baru sudah saya kirim.`",
        ],
      },
      {
        en: "Kami ingin kenalan dengan tetangga baru.",
        vi: "Chúng tôi muốn làm quen với hàng xóm mới.",
        pronunciation_focus: [
          "ke-NA-lan de-NGAN te-TANG-ga BA-ru - `kenalan` = làm quen/giới thiệu nhau.",
          "`tetangga baru` = hàng xóm mới; `ngg` trong `tetangga` đọc ngậm rồi bật.",
          "Lỗi người Việt: dùng `tahu` cho 'quen biết'. Gặp/làm quen người mới là `kenalan`.",
          "Luyện: `Kami ingin kenalan dengan tetangga.`",
        ],
        pronunciation_focus_en: [
          "ke-NA-lan de-NGAN te-TANG-ga BA-roo - `kenalan` = get acquainted/introduce ourselves.",
          "`tetangga baru` = new neighbors; the `ngg` in `tetangga` is held then released.",
          "VN-speaker trap: using `tahu` for 'know/get to know'. Meeting new people is `kenalan`.",
          "Drill: `Kami ingin kenalan dengan tetangga.`",
        ],
      },
      {
        en: "Setelah pindahan, kami harus bersih-bersih rumah lama.",
        vi: "Sau khi chuyển nhà, chúng tôi phải dọn dẹp nhà cũ.",
        pronunciation_focus: [
          "se-TE-lah pin-DA-han - `setelah` = sau khi.",
          "`bersih-bersih` = dọn dẹp; lặp từ tạo nghĩa hoạt động chung.",
          "`rumah lama` = nhà cũ; tính từ đứng sau danh từ như tiếng Việt.",
          "Luyện: `Kami harus bersih-bersih rumah lama.`",
        ],
        pronunciation_focus_en: [
          "se-TE-lah pin-DA-han - `setelah` = after.",
          "`bersih-bersih` = clean up; reduplication forms a general activity.",
          "`rumah lama` = old house/place; adjective follows the noun like Vietnamese.",
          "Drill: `Kami harus bersih-bersih rumah lama.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Chuyển nhà ở Indonesia thường dùng `mobil bak`, xe pickup nhỏ, hoặc `jasa pindahan` nếu đồ nhiều. Đồ được đóng vào `kardus`, đồ dễ vỡ bọc bằng `koran` hoặc bubble wrap. Khi đến khu mới, nhiều người lịch sự `lapor ke RT` hoặc ít nhất chào `tetangga baru`, nhất là ở khu dân cư. Sau khi chuyển đi, người thuê thường phải `bersih-bersih rumah lama` để lấy lại deposit hoặc giữ quan hệ tốt với chủ nhà.",
    cultural_notes_en:
      "Moving house in Indonesia often uses a `mobil bak`, small pickup, or `jasa pindahan` if there are many items. Belongings go into `kardus`, and fragile items are wrapped with newspaper or bubble wrap. In a new neighborhood, people often politely `lapor ke RT` or at least greet `tetangga baru`, especially in residential areas. After leaving, renters usually clean the old place to recover the deposit or keep good relations with the landlord.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt `pindah` (chuyển chỗ), `pindahan` (việc/ngày chuyển nhà), `memindahkan` (di chuyển một vật). Với đồ nặng, học cụm `angkat barang`, `angkut barang`, `sewa mobil bak`, `kardus besar`, `barang mudah pecah`, `alamat baru`, `tetangga baru`, `bersih-bersih`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: distinguish `pindah` (move/relocate), `pindahan` (the move/moving day), and `memindahkan` (move an object). For heavy belongings, learn these chunks: `angkat barang`, `angkut barang`, `sewa mobil bak`, `kardus besar`, `barang mudah pecah`, `alamat baru`, `tetangga baru`, `bersih-bersih`.",
    vocabulary: [
      {
        word: "pindahan rumah",
        en: "moving house / moving day",
        vi: "việc/ngày chuyển nhà",
        pos: "noun phrase",
        pronunciation_vi: "pin-DA-han RU-mah",
        pronunciation_en: "pin-DA-han ROO-mah",
      },
      {
        word: "mobil bak",
        en: "pickup / open-bed vehicle",
        vi: "xe bán tải / xe thùng hở",
        pos: "noun phrase",
        pronunciation_vi: "MO-bil BAK",
        pronunciation_en: "MO-bil BAK",
      },
      {
        word: "kardus",
        en: "cardboard box",
        vi: "thùng carton",
        pos: "noun",
        pronunciation_vi: "KAR-dus",
        pronunciation_en: "KAR-doos",
      },
      {
        word: "angkat barang",
        en: "lift/carry belongings",
        vi: "khiêng đồ / bê đồ",
        pos: "verb phrase",
        pronunciation_vi: "ANG-kat BA-rang",
        pronunciation_en: "ANG-kat BA-rang",
      },
      {
        word: "angkut barang",
        en: "transport belongings",
        vi: "chở đồ / vận chuyển đồ",
        pos: "verb phrase",
        pronunciation_vi: "ANG-kut BA-rang",
        pronunciation_en: "ANG-koot BA-rang",
      },
      {
        word: "alamat baru",
        en: "new address",
        vi: "địa chỉ mới",
        pos: "noun phrase",
        pronunciation_vi: "a-LA-mat BA-ru",
        pronunciation_en: "a-LA-mat BA-roo",
      },
      {
        word: "tetangga baru",
        en: "new neighbor",
        vi: "hàng xóm mới",
        pos: "noun phrase",
        pronunciation_vi: "te-TANG-ga BA-ru",
        pronunciation_en: "te-TANG-ga BA-roo",
      },
      {
        word: "bersih-bersih",
        en: "clean up",
        vi: "dọn dẹp",
        pos: "verb / activity",
        pronunciation_vi: "BER-sih BER-sih",
        pronunciation_en: "BER-sih BER-sih",
      },
      {
        word: "barang mudah pecah",
        en: "fragile items",
        vi: "đồ dễ vỡ",
        pos: "noun phrase",
        pronunciation_vi: "BA-rang MU-dah PE-chah",
        pronunciation_en: "BA-rang MOO-dah PE-chah",
      },
      {
        word: "jasa pindahan",
        en: "moving service / movers",
        vi: "dịch vụ chuyển nhà",
        pos: "noun phrase",
        pronunciation_vi: "JA-sa pin-DA-han",
        pronunciation_en: "JA-sa pin-DA-han",
      },
    ],
    dialogue: [
      {
        speaker: "Linh",
        text: "Pak, bisa sewa mobil bak untuk pindahan hari Sabtu?",
        vi: "Chú ơi, có thể thuê xe thùng để chuyển nhà ngày thứ Bảy không?",
        en: "Sir, can I rent a pickup for moving on Saturday?",
      },
      {
        speaker: "Pemilik Mobil",
        text: "Bisa. Barangnya banyak? Perlu bantuan angkat barang?",
        vi: "Được. Đồ có nhiều không? Cần hỗ trợ khiêng đồ không?",
        en: "Yes. Are there many items? Do you need help carrying them?",
      },
      {
        speaker: "Linh",
        text: "Lumayan banyak. Ada lemari, meja, dan beberapa kardus.",
        vi: "Khá nhiều. Có tủ, bàn và vài thùng carton.",
        en: "Quite a lot. There is a wardrobe, a table, and several boxes.",
      },
      {
        speaker: "Pemilik Mobil",
        text: "Baik, kirim alamat lama dan alamat baru lewat WhatsApp, ya.",
        vi: "Được, gửi địa chỉ cũ và địa chỉ mới qua WhatsApp nhé.",
        en: "Okay, send the old address and new address via WhatsApp.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ/cụm từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word or phrase with its Vietnamese meaning:",
        items: [
          { prompt: "mobil bak", answer: "xe thùng hở / pickup" },
          { prompt: "kardus", answer: "thùng carton" },
          { prompt: "alamat baru", answer: "địa chỉ mới" },
          { prompt: "bersih-bersih", answer: "dọn dẹp" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Điền từ còn thiếu:",
        instruction_en: "Fill in the missing word:",
        items: [
          {
            prompt: "Saya mau sewa mobil bak untuk ___ barang. (chở đồ)",
            answer: "angkut",
            options: ["angkut", "angkat", "antar"],
          },
          {
            prompt: "Barang yang mudah ___ harus dibungkus. (vỡ)",
            answer: "pecah",
            options: ["pecah", "pindah", "penuh"],
          },
          {
            prompt: "Kami ingin kenalan dengan ___ baru. (hàng xóm)",
            answer: "tetangga",
            options: ["tetangga", "tangga", "tanggal"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Cuối tuần này chúng tôi chuyển nhà.", answer: "Akhir pekan ini kami pindahan rumah." },
          { prompt: "Có thể giúp khiêng cái tủ này không?", answer: "Bisa bantu angkat lemari ini?" },
          { prompt: "Địa chỉ mới tôi đã gửi qua WhatsApp.", answer: "Alamat baru saya sudah saya kirim lewat WhatsApp." },
        ],
      },
    ],
  },
];

export default movingHouseLessons;
