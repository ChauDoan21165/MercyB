// src/languages/indonesian/extra/warung-business.ts
//
// Indonesian warung business pack for Vietnamese learners.
// Covers: buka warung, modal, stok, supplier, harga, untung, pelanggan tetap,
// izin usaha, daily sales, and practical small-shop conversations.
//
// Shape mirrors the sibling Indonesian extra files. This file is self-contained:
// it declares inline types and exports one uniquely named lesson array.
//
// Field convention: sentence `en` holds TARGET-LANGUAGE Indonesian; `vi` holds
// Vietnamese. `pronunciation_focus` carries Vietnamese-facing pronunciation and
// grammar notes, including L1 traps; `pronunciation_focus_en` is the English
// companion in the same order.

type LessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  /** Vietnamese-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English-speaker pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

type DialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type Exercise = Record<string, unknown>;

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
};

export const warungBusinessLessons: IndonesianLesson[] = [
  {
    id: "indonesian_warung_business_opening",
    level: "A2",
    category: "business",
    title_vi: "Mở warung — vốn, hàng và giá",
    title_en: "Opening a warung — capital, stock and prices",
    sentences: [
      {
        en: "Saya mau buka warung kecil di depan rumah.",
        vi: "Tôi muốn mở một quán/tạp hóa nhỏ trước nhà.",
        pronunciation_focus: [
          "buka warung → mở quán/tiệm nhỏ; `warung` là quán bình dân hoặc tạp hóa nhỏ.",
          "kecil → ke-CHIL, chữ `c` đọc như 'ch', không đọc như 'k'.",
          "di depan rumah → trước nhà; `di` = ở, `depan` = phía trước.",
        ],
        pronunciation_focus_en: [
          "buka warung → open a small shop/food stall; `warung` is a casual eatery or small store.",
          "kecil → ke-CHIL; Indonesian `c` sounds like English 'ch', not 'k'.",
          "di depan rumah → in front of the house; `di` = at/in, `depan` = front.",
        ],
      },
      {
        en: "Modal awal saya belum besar.",
        vi: "Vốn ban đầu của tôi chưa lớn.",
        pronunciation_focus: [
          "modal awal → vốn ban đầu; sở hữu `saya` đứng sau cụm danh từ.",
          "belum besar → chưa lớn; `belum` = chưa, khác `tidak` = không.",
          "Lỗi người Việt: nói `modal saya awal`. Cụm đúng: `modal awal saya`.",
        ],
        pronunciation_focus_en: [
          "modal awal → initial capital; possessive `saya` follows the noun phrase.",
          "belum besar → not big yet; `belum` = not yet, different from `tidak` = not.",
          "VN-speaker trap: saying `modal saya awal`. Correct phrase: `modal awal saya`.",
        ],
      },
      {
        en: "Saya perlu beli stok beras, mi instan, dan air mineral.",
        vi: "Tôi cần mua hàng tồn: gạo, mì gói và nước khoáng.",
        pronunciation_focus: [
          "perlu beli → cần mua; không cần chia động từ theo thì.",
          "stok → hàng có sẵn/hàng tồn; đọc gần như `stôk`.",
          "mi instan → mì ăn liền; `air mineral` = nước khoáng, `air` đọc A-ir.",
        ],
        pronunciation_focus_en: [
          "perlu beli → need to buy; no tense conjugation is needed.",
          "stok → stock/inventory; pronounced close to 'stok'.",
          "mi instan → instant noodles; `air mineral` = bottled/mineral water, `air` is A-ir.",
        ],
      },
      {
        en: "Supplier saya kirim barang setiap Senin.",
        vi: "Nhà cung cấp của tôi giao hàng mỗi thứ Hai.",
        pronunciation_focus: [
          "supplier → su-PLAI-er, từ mượn tiếng Anh rất phổ biến trong kinh doanh nhỏ.",
          "kirim barang → giao/gửi hàng; `barang` = hàng hóa/đồ.",
          "setiap Senin → mỗi thứ Hai; ngày trong tuần viết hoa khi là tên ngày.",
        ],
        pronunciation_focus_en: [
          "supplier → su-PLAI-er, a common English loanword in small business.",
          "kirim barang → send/deliver goods; `barang` = goods/items.",
          "setiap Senin → every Monday; weekday names are capitalized.",
        ],
      },
      {
        en: "Harga jual harus lebih tinggi dari harga modal.",
        vi: "Giá bán phải cao hơn giá vốn.",
        pronunciation_focus: [
          "harga jual → giá bán; `harga modal` → giá vốn.",
          "lebih tinggi dari → cao hơn; khung so sánh: `lebih + tính từ + dari`.",
          "Lỗi người Việt: bỏ `dari`. Nói đủ: `lebih tinggi dari harga modal`.",
        ],
        pronunciation_focus_en: [
          "harga jual → selling price; `harga modal` → cost price.",
          "lebih tinggi dari → higher than; comparison frame: `lebih + adjective + dari`.",
          "VN-speaker trap: dropping `dari`. Say the full phrase: `lebih tinggi dari harga modal`.",
        ],
      },
    ],
    cultural_notes_vi:
      "`Warung` là một phần rất quen thuộc của đời sống Indonesia: có thể là quán ăn nhỏ, tiệm tạp hóa trước nhà, hoặc quầy bán nước/cà phê. Nhiều warung bắt đầu bằng vốn nhỏ (`modal kecil`), bán hàng thiết yếu như gạo, mì gói, nước, thuốc lá, cà phê gói, rồi xây khách quen dần. Người bán thường nhập hàng từ `supplier`, chợ đầu mối, hoặc cửa hàng grosir.",
    cultural_notes_en:
      "A `warung` is a familiar part of Indonesian daily life: it can be a small eatery, a home-front convenience shop, or a drink/coffee stall. Many warung start with small capital (`modal kecil`), sell essentials like rice, instant noodles, water, cigarettes, and sachet coffee, then build regular customers over time. Owners often buy from a `supplier`, wholesale market, or `grosir` shop.",
    tip_advice_vi:
      "Mẹo cho người Việt: học cặp tiền cơ bản `modal` = vốn, `untung` = lãi, `rugi` = lỗ. Khi nói giá, phân biệt `harga modal` (giá vốn) và `harga jual` (giá bán). Đây là cặp sống còn khi bán hàng.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn the money trio `modal` = capital/cost, `untung` = profit, `rugi` = loss. For prices, distinguish `harga modal` (cost price) and `harga jual` (selling price). This pair is essential for shop talk.",
    vocabulary: [
      {
        cell_id: "fdf09d9f-ac09-4f45-82c0-b9289de112d1",
        word: "warung",
        en: "small shop / food stall",
        vi: "quán nhỏ / tiệm tạp hóa nhỏ",
        pos: "noun",
        pronunciation_vi: "WA-rung",
        pronunciation_en: "WA-roong",
      },
      {
        cell_id: "fd64f506-ef18-4392-a8f5-8911e7c9ae67",
        word: "buka warung",
        en: "to open a small shop",
        vi: "mở quán/tiệm nhỏ",
        pos: "verb phrase",
        pronunciation_vi: "BU-ka WA-rung",
        pronunciation_en: "BOO-ka WA-roong",
      },
      {
        cell_id: "7e01a2d5-d69c-4e03-92dd-4c49720ca6a6",
        word: "modal",
        en: "capital / cost basis",
        vi: "vốn",
        pos: "noun",
        pronunciation_vi: "MO-dal",
        pronunciation_en: "MO-dal",
      },
      {
        cell_id: "408443ce-1f8a-4fa4-b0d0-5780cea6f5b0",
        word: "stok",
        en: "stock / inventory",
        vi: "hàng tồn / hàng có sẵn",
        pos: "noun",
        pronunciation_vi: "stôk",
        pronunciation_en: "stok",
      },
      {
        cell_id: "17ca55ee-9c91-4629-a92e-997b2ae4de00",
        word: "supplier",
        en: "supplier",
        vi: "nhà cung cấp",
        pos: "noun",
        pronunciation_vi: "su-PLAI-er",
        pronunciation_en: "su-PLY-er",
      },
      {
        cell_id: "387ae93c-ae76-445b-bf02-06e34aaa8c82",
        word: "harga jual",
        en: "selling price",
        vi: "giá bán",
        pos: "noun phrase",
        pronunciation_vi: "HAR-ga JU-al",
        pronunciation_en: "HAR-ga JOO-al",
      },
      {
        cell_id: "f42ff5ec-186b-4e26-a3b9-83af33f49f06",
        word: "harga modal",
        en: "cost price",
        vi: "giá vốn",
        pos: "noun phrase",
        pronunciation_vi: "HAR-ga MO-dal",
        pronunciation_en: "HAR-ga MO-dal",
      },
      {
        cell_id: "a0a2cac3-30c2-4f6a-842f-2479c6ee5d06",
        word: "grosir",
        en: "wholesale",
        vi: "bán sỉ / sỉ",
        pos: "noun / adjective",
        pronunciation_vi: "GRO-sir",
        pronunciation_en: "GRO-seer",
      },
    ],
    dialogue: [
      {
        cell_id: "2de85dbd-a53b-4d2a-85fc-45ff8a179f05",
        speaker: "Pemilik warung",
        text: "Saya mau buka warung kecil bulan depan.",
        vi: "Tôi muốn mở một quán nhỏ vào tháng sau.",
        en: "I want to open a small warung next month.",
      },
      {
        cell_id: "00dffb9d-5a45-4330-a983-ee0427cbacbb",
        speaker: "Teman",
        text: "Modal awalnya berapa?",
        vi: "Vốn ban đầu bao nhiêu?",
        en: "How much is the initial capital?",
      },
      {
        cell_id: "6119c1ca-431d-437f-8602-8f853ba5c99f",
        speaker: "Pemilik warung",
        text: "Belum besar. Saya mulai dari stok kecil dulu.",
        vi: "Chưa lớn. Tôi bắt đầu từ lượng hàng nhỏ trước.",
        en: "Not much yet. I will start with small stock first.",
      },
      {
        cell_id: "067ea97f-a5d4-44c2-a14e-3639fa8c5f69",
        speaker: "Teman",
        text: "Cari supplier yang harganya stabil.",
        vi: "Tìm nhà cung cấp có giá ổn định.",
        en: "Find a supplier whose prices are stable.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ kinh doanh warung còn thiếu:",
        instruction_en: "Fill in the missing warung-business word:",
        items: [
          {
            prompt: "Saya mau buka ___ kecil di depan rumah. (quán/tiệm nhỏ)",
            answer: "warung",
            options: ["warung", "warisan", "warna"],
          },
          {
            prompt: "___ awal saya belum besar. (vốn)",
            answer: "Modal",
            options: ["Modal", "Motor", "Makan"],
          },
          {
            prompt: "Saya perlu beli ___ beras dan mi instan. (hàng tồn)",
            answer: "stok",
            options: ["stok", "soto", "surat"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "supplier", answer: "nhà cung cấp" },
          { prompt: "harga jual", answer: "giá bán" },
          { prompt: "harga modal", answer: "giá vốn" },
          { prompt: "grosir", answer: "bán sỉ" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn mở một quán nhỏ trước nhà.", answer: "Saya mau buka warung kecil di depan rumah." },
          { prompt: "Vốn ban đầu của tôi chưa lớn.", answer: "Modal awal saya belum besar." },
          { prompt: "Giá bán phải cao hơn giá vốn.", answer: "Harga jual harus lebih tinggi dari harga modal." },
        ],
      },
    ],
  },
  {
    id: "indonesian_warung_business_customers_profit",
    level: "B1",
    category: "business",
    title_vi: "Chạy warung — khách quen, lãi và giấy phép",
    title_en: "Running a warung — regulars, profit and permits",
    sentences: [
      {
        en: "Pelanggan tetap saya biasanya beli kopi sachet setiap pagi.",
        vi: "Khách quen của tôi thường mua cà phê gói mỗi sáng.",
        pronunciation_focus: [
          "pelanggan tetap → khách hàng cố định/khách quen.",
          "biasanya → thường; đặt trước động từ hoặc cụm hành động.",
          "kopi sachet → cà phê gói nhỏ; `sachet` hay gặp ở warung.",
        ],
        pronunciation_focus_en: [
          "pelanggan tetap → regular customer.",
          "biasanya → usually; it sits before the verb/action phrase.",
          "kopi sachet → small sachet coffee; `sachet` is common in warung.",
        ],
      },
      {
        en: "Kalau stok habis, pelanggan bisa pindah ke warung sebelah.",
        vi: "Nếu hết hàng, khách có thể chuyển sang quán bên cạnh.",
        pronunciation_focus: [
          "kalau stok habis → nếu hết hàng; `habis` = hết/xong.",
          "bisa pindah → có thể chuyển; `pindah` = chuyển chỗ.",
          "warung sebelah → quán bên cạnh; `sebelah` = bên cạnh/phía.",
        ],
        pronunciation_focus_en: [
          "kalau stok habis → if stock runs out; `habis` = finished/gone.",
          "bisa pindah → can move/switch; `pindah` = move.",
          "warung sebelah → the shop next door; `sebelah` = side/next to.",
        ],
      },
      {
        en: "Saya catat pemasukan dan pengeluaran setiap hari.",
        vi: "Tôi ghi lại khoản thu và khoản chi mỗi ngày.",
        pronunciation_focus: [
          "catat → CHA-tat, ghi chép; chữ `c` đọc 'ch'.",
          "pemasukan → khoản thu; gốc `masuk` = vào.",
          "pengeluaran → khoản chi; gốc `keluar` = ra.",
        ],
        pronunciation_focus_en: [
          "catat → CHA-tat, to record/write down; Indonesian `c` = 'ch'.",
          "pemasukan → income/revenue; root `masuk` = enter/in.",
          "pengeluaran → expenses; root `keluar` = go out/out.",
        ],
      },
      {
        en: "Untung bersih bulan ini naik sedikit.",
        vi: "Lãi ròng tháng này tăng một chút.",
        pronunciation_focus: [
          "untung bersih → lãi ròng; `bersih` = sạch/ròng sau chi phí.",
          "bulan ini → tháng này; thời gian thường đứng đầu hoặc cuối câu.",
          "naik sedikit → tăng một chút; đối lập `turun` = giảm.",
        ],
        pronunciation_focus_en: [
          "untung bersih → net profit; `bersih` = clean/net after costs.",
          "bulan ini → this month; time can sit at the start or end.",
          "naik sedikit → increased a little; opposite `turun` = decreased.",
        ],
      },
      {
        en: "Saya perlu urus izin usaha di kelurahan.",
        vi: "Tôi cần làm giấy phép kinh doanh ở phường/xã.",
        pronunciation_focus: [
          "urus izin usaha → lo/làm thủ tục giấy phép kinh doanh.",
          "izin → I-zin, giấy phép/sự cho phép; `usaha` = kinh doanh.",
          "kelurahan → cơ quan hành chính cấp phường ở Indonesia.",
        ],
        pronunciation_focus_en: [
          "urus izin usaha → handle/apply for a business permit.",
          "izin → EE-zin, permit/permission; `usaha` = business.",
          "kelurahan → local urban village administrative office in Indonesia.",
        ],
      },
      {
        en: "Kalau ada promo, pembeli lebih ramai.",
        vi: "Nếu có khuyến mãi, người mua đông hơn.",
        pronunciation_focus: [
          "promo → khuyến mãi; từ app/marketing rất thông dụng.",
          "pembeli → người mua; gốc `beli` = mua.",
          "lebih ramai → đông hơn; so sánh không cần chia từ.",
        ],
        pronunciation_focus_en: [
          "promo → promotion/discount; very common in app and marketing language.",
          "pembeli → buyer/customer; root `beli` = buy.",
          "lebih ramai → busier/more crowded; no adjective conjugation needed.",
        ],
      },
      {
        en: "Saya kasih utang hanya untuk pelanggan tetap.",
        vi: "Tôi chỉ cho ghi nợ với khách quen.",
        pronunciation_focus: [
          "kasih utang → cho nợ/cho ghi sổ; cách nói hội thoại.",
          "hanya untuk → chỉ dành cho; `untuk` = cho/dành cho.",
          "Lưu ý văn hóa: nhiều warung có sổ nợ nhỏ cho khách rất quen.",
        ],
        pronunciation_focus_en: [
          "kasih utang → allow credit/let someone owe; conversational phrasing.",
          "hanya untuk → only for; `untuk` = for.",
          "Cultural note: many warung keep a small credit notebook for trusted regulars.",
        ],
      },
    ],
    cultural_notes_vi:
      "Warung sống nhờ quan hệ khu phố. `Pelanggan tetap` mua lặp lại mỗi ngày: cà phê gói, thuốc lá, nước, mì, gas nhỏ, đồ ăn sáng. Một số warung cho khách quen ghi nợ (`utang`) vào sổ, nhưng chủ quán phải quản rủi ro. Với giấy tờ, tên và yêu cầu có thể khác theo địa phương: người bán thường hỏi `kelurahan` hoặc cơ quan địa phương về `izin usaha`, NIB, hoặc giấy keterangan usaha.",
    cultural_notes_en:
      "A warung survives on neighborhood relationships. `Pelanggan tetap` buy repeatedly: sachet coffee, cigarettes, water, noodles, small gas refills, breakfast food. Some warung let trusted regulars buy on credit (`utang`) in a notebook, but the owner must manage the risk. For paperwork, names and requirements vary by locality: sellers often ask the `kelurahan` or local office about `izin usaha`, NIB, or a business statement letter.",
    tip_advice_vi:
      "Mẹo cho người Việt: cặp `pemasukan`/`pengeluaran` rất quan trọng. `masuk` = vào → tiền vào là `pemasukan`; `keluar` = ra → tiền ra là `pengeluaran`. Khi tính lãi, nói `untung bersih` cho lãi ròng sau chi phí.",
    tip_advice_en:
      "Tip for Vietnamese speakers: the pair `pemasukan`/`pengeluaran` is key. `masuk` = enter/in → money coming in is `pemasukan`; `keluar` = go out → money going out is `pengeluaran`. For profit after expenses, say `untung bersih`.",
    vocabulary: [
      {
        cell_id: "436f7736-56f0-4544-af45-45a60341e925",
        word: "pelanggan tetap",
        en: "regular customer",
        vi: "khách quen",
        pos: "noun phrase",
        pronunciation_vi: "pe-lang-GAN TE-tap",
        pronunciation_en: "pe-lang-GAN TEH-tap",
      },
      {
        cell_id: "f44a76e6-d2ed-41a9-8b65-c69ce8b2e609",
        word: "stok habis",
        en: "out of stock",
        vi: "hết hàng",
        pos: "phrase",
        pronunciation_vi: "stôk HA-bis",
        pronunciation_en: "stok HA-bis",
      },
      {
        cell_id: "ccd35592-45bd-4b76-b0a8-81f38a9c1bac",
        word: "pemasukan",
        en: "income / revenue",
        vi: "khoản thu",
        pos: "noun",
        pronunciation_vi: "pe-ma-SU-kan",
        pronunciation_en: "peh-ma-SOO-kan",
      },
      {
        cell_id: "ca525b4e-719d-429a-8d1d-ac4be2b5c30d",
        word: "pengeluaran",
        en: "expenses",
        vi: "khoản chi",
        pos: "noun",
        pronunciation_vi: "pe-nge-lu-A-ran",
        pronunciation_en: "peh-ngeh-loo-A-ran",
      },
      {
        cell_id: "82d58f4a-8793-4bb9-868b-961c6aa604dd",
        word: "untung bersih",
        en: "net profit",
        vi: "lãi ròng",
        pos: "noun phrase",
        pronunciation_vi: "UN-tung BER-sih",
        pronunciation_en: "OON-toong BER-see",
      },
      {
        cell_id: "b519fddc-ebb6-4c3d-8391-2da453748b9c",
        word: "izin usaha",
        en: "business permit",
        vi: "giấy phép kinh doanh",
        pos: "noun phrase",
        pronunciation_vi: "I-zin u-SA-ha",
        pronunciation_en: "EE-zin oo-SA-ha",
      },
      {
        cell_id: "442f8e7b-be50-4520-a76e-2cb22d74eae1",
        word: "kelurahan",
        en: "local urban village office",
        vi: "văn phòng phường/xã",
        pos: "noun",
        pronunciation_vi: "ke-lu-RA-han",
        pronunciation_en: "keh-loo-RA-han",
      },
      {
        cell_id: "1ebb93c9-17ca-4ef7-bf80-f4759131a7af",
        word: "utang",
        en: "debt / credit owed",
        vi: "nợ",
        pos: "noun",
        pronunciation_vi: "U-tang",
        pronunciation_en: "OO-tang",
      },
    ],
    dialogue: [
      {
        cell_id: "c8c0ff6e-7889-4434-8002-abba0ee751c2",
        speaker: "Pelanggan",
        text: "Bu, kopi sachet yang biasa masih ada?",
        vi: "Cô ơi, cà phê gói loại thường mua còn không?",
        en: "Ma'am, is the usual sachet coffee still available?",
      },
      {
        cell_id: "19b70525-6f84-47e4-8c70-bee699ff35b2",
        speaker: "Pemilik warung",
        text: "Masih ada. Mau beli berapa?",
        vi: "Vẫn còn. Muốn mua bao nhiêu?",
        en: "Still available. How many do you want?",
      },
      {
        cell_id: "dcdc4acc-ac06-4373-8be8-be45da02d306",
        speaker: "Pelanggan",
        text: "Lima saja. Boleh utang dulu sampai besok?",
        vi: "Năm gói thôi. Có thể ghi nợ đến mai không?",
        en: "Just five. Can I owe you until tomorrow?",
      },
      {
        cell_id: "f1c33589-b016-4d53-b57b-c9fd052a6302",
        speaker: "Pemilik warung",
        text: "Boleh, karena Ibu pelanggan tetap.",
        vi: "Được, vì cô là khách quen.",
        en: "Sure, because you are a regular customer.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ vận hành warung còn thiếu:",
        instruction_en: "Fill in the missing warung-operations word:",
        items: [
          {
            prompt: "___ tetap saya biasanya beli kopi setiap pagi. (khách quen)",
            answer: "Pelanggan",
            options: ["Pelanggan", "Pelajaran", "Pakaian"],
          },
          {
            prompt: "Saya catat pemasukan dan ___ setiap hari. (khoản chi)",
            answer: "pengeluaran",
            options: ["pengeluaran", "pengalaman", "penginapan"],
          },
          {
            prompt: "Saya perlu urus ___ usaha di kelurahan. (giấy phép)",
            answer: "izin",
            options: ["izin", "ikan", "isi"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "stok habis", answer: "hết hàng" },
          { prompt: "untung bersih", answer: "lãi ròng" },
          { prompt: "utang", answer: "nợ" },
          { prompt: "kelurahan", answer: "văn phòng phường/xã" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Khách quen của tôi thường mua cà phê gói mỗi sáng.", answer: "Pelanggan tetap saya biasanya beli kopi sachet setiap pagi." },
          { prompt: "Lãi ròng tháng này tăng một chút.", answer: "Untung bersih bulan ini naik sedikit." },
          { prompt: "Tôi chỉ cho ghi nợ với khách quen.", answer: "Saya kasih utang hanya untuk pelanggan tetap." },
        ],
      },
    ],
  },
];
