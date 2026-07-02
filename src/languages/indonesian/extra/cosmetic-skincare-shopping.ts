// Cosmetic & Skincare Shopping Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson. Field convention follows the Indonesian extra
// pack: sentence `en` holds TARGET-LANGUAGE Indonesian, `vi` holds Vietnamese,
// Vietnamese L1 notes live in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en` with the same order.

export type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
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

export const cosmeticSkincareShoppingLessons: IndonesianLesson[] = [
  {
    id: "indonesian_skincare_store_recommendation",
    level: "A2",
    category: "shopping",
    title_vi: "Mua skincare ở toko kosmetik",
    title_en: "Buying skincare at a cosmetics store",
    sentences: [
      {
        en: "Saya cari skincare untuk kulit sensitif.",
        vi: "Tôi tìm skincare cho da nhạy cảm.",
        pronunciation_focus: [
          "SA-ya CA-ri skin-ker un-TUK KU-lit sen-si-TIF - `skincare` = sản phẩm chăm sóc da; `kulit sensitif` = da nhạy cảm.",
          "Lỗi người Việt: nói `da sensitif`. Trong tiếng Indonesia, da là `kulit`; cụm tự nhiên là `kulit sensitif`.",
          "Luyện: `Saya cari skincare untuk kulit sensitif.`",
        ],
        pronunciation_focus_en: [
          "SA-ya CHA-ri skin-care un-TOOK KU-lit sen-si-TIF - `skincare` = skincare products; `kulit sensitif` = sensitive skin.",
          "VN-speaker trap: saying `da sensitif`. Indonesian for skin is `kulit`; the natural phrase is `kulit sensitif`.",
          "Drill: `Saya cari skincare untuk kulit sensitif.`",
        ],
      },
      {
        en: "Ada pelembap yang ringan dan tidak lengket?",
        vi: "Có kem dưỡng ẩm nào nhẹ và không dính không?",
        pronunciation_focus: [
          "A-da pe-LEM-bap yang RI-ngan dan TI-dak LENG-ket - `pelembap` = kem dưỡng ẩm; `tidak lengket` = không dính.",
          "Lỗi người Việt: dịch moisturizer thành `krim lembap`. Từ sản phẩm tự nhiên hơn là `pelembap`.",
          "Luyện: `Ada pelembap yang ringan?`",
        ],
        pronunciation_focus_en: [
          "A-da pe-LEM-bap yang REE-ngan dan TEE-dak LENG-ket - `pelembap` = moisturizer; `tidak lengket` = not sticky.",
          "VN-speaker trap: translating moisturizer as `krim lembap`. The product word is `pelembap`.",
          "Drill: `Ada pelembap yang ringan?`",
        ],
      },
      {
        en: "Saya butuh sunscreen untuk dipakai setiap pagi.",
        vi: "Tôi cần kem chống nắng để dùng mỗi sáng.",
        pronunciation_focus: [
          "SA-ya BU-tuh SAN-skrin un-TUK di-PA-kai se-TI-ap PA-gi - `sunscreen` = kem chống nắng; `dipakai` = được dùng/dùng.",
          "Lỗi người Việt: dùng `anti matahari` theo dịch thẳng. Ở toko kosmetik, `sunscreen` rất phổ biến; cũng nghe `tabir surya`.",
          "Luyện: `Saya butuh sunscreen setiap pagi.`",
        ],
        pronunciation_focus_en: [
          "SA-ya BOO-tuh SUN-screen un-TOOK di-PA-kai se-TEE-ap PA-gi - `sunscreen` = sunscreen; `dipakai` = used/worn.",
          "VN-speaker trap: literal `anti matahari`. At cosmetics stores, `sunscreen` is very common; `tabir surya` is also heard.",
          "Drill: `Saya butuh sunscreen setiap pagi.`",
        ],
      },
      {
        en: "Produk ini cocok untuk kulit berminyak?",
        vi: "Sản phẩm này hợp với da dầu không?",
        pronunciation_focus: [
          "PRO-duk I-ni CO-cok un-TUK KU-lit ber-mi-NYAK - `cocok` = hợp/phù hợp; `kulit berminyak` = da dầu.",
          "Lỗi người Việt: đọc `cocok` như ko-kok. Chữ `c` Indonesia đọc như 'ch': CO-cok gần 'cho-chok'.",
          "Luyện: `Cocok untuk kulit berminyak?`",
        ],
        pronunciation_focus_en: [
          "PRO-duk EE-ni CHO-chok un-TOOK KU-lit ber-mi-NYAK - `cocok` = suitable/matches; `kulit berminyak` = oily skin.",
          "VN-speaker trap: pronouncing Indonesian `c` as k. `Cocok` starts with a 'ch' sound.",
          "Drill: `Cocok untuk kulit berminyak?`",
        ],
      },
      {
        en: "Bisa rekomendasi produk yang tidak bikin iritasi?",
        vi: "Có thể giới thiệu sản phẩm không gây kích ứng không?",
        pronunciation_focus: [
          "BI-sa re-ko-men-DA-si PRO-duk yang TI-dak BI-kin i-ri-TA-si - `rekomendasi produk` = giới thiệu sản phẩm; `iritasi` = kích ứng.",
          "Lỗi người Việt: trong cửa hàng nói `membuat iritasi` hơi trang trọng. `Bikin iritasi` tự nhiên trong hội thoại.",
          "Luyện: `Bisa rekomendasi produk?`",
        ],
        pronunciation_focus_en: [
          "BEE-sa re-ko-men-DA-si PRO-duk yang TEE-dak BEE-kin i-ri-TA-si - `rekomendasi produk` = product recommendation; `iritasi` = irritation.",
          "VN-speaker trap: `membuat iritasi` can sound formal in a shop. `Bikin iritasi` is natural in conversation.",
          "Drill: `Bisa rekomendasi produk?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, toko kosmetik, minimarket besar, apotek, dan marketplace đều bán skincare. Từ tiếng Anh như `skincare`, `sunscreen`, `toner`, `serum`, `moisturizer`, và `checkout` rất phổ biến. Khi da dễ kích ứng, hãy nói rõ `kulit sensitif`, `pernah iritasi`, hoặc `tidak cocok`.",
    cultural_notes_en:
      "In Indonesia, cosmetics stores, large minimarkets, pharmacies, and marketplaces all sell skincare. English loanwords such as `skincare`, `sunscreen`, `toner`, `serum`, `moisturizer`, and `checkout` are common. If your skin irritates easily, say clearly `kulit sensitif`, `pernah iritasi`, or `tidak cocok`.",
    tip_advice_vi:
      "Khung cần nhớ: `Saya cari...`, `Ada pelembap...?`, `Cocok untuk kulit...?`, `Bisa rekomendasi produk...?`. `Cocok` rất quan trọng khi nói hợp da hay không hợp da.",
    tip_advice_en:
      "Useful frames: `Saya cari...`, `Ada pelembap...?`, `Cocok untuk kulit...?`, `Bisa rekomendasi produk...?`. `Cocok` is key for whether something suits your skin.",
    vocabulary: [
      {
        word: "skincare",
        en: "skincare",
        vi: "sản phẩm chăm sóc da",
        pos: "noun",
        pronunciation_vi: "skin-ker",
        pronunciation_en: "skin-care",
      },
      {
        word: "pelembap",
        en: "moisturizer",
        vi: "kem dưỡng ẩm",
        pos: "noun",
        pronunciation_vi: "pe-LEM-bap",
        pronunciation_en: "pe-LEM-bap",
      },
      {
        word: "sunscreen",
        en: "sunscreen",
        vi: "kem chống nắng",
        pos: "noun",
        pronunciation_vi: "SAN-skrin",
        pronunciation_en: "SUN-screen",
      },
      {
        word: "cocok kulit",
        en: "suits the skin",
        vi: "hợp da",
        pos: "phrase",
        pronunciation_vi: "CO-cok KU-lit",
        pronunciation_en: "CHO-chok KU-lit",
      },
      {
        word: "iritasi",
        en: "irritation",
        vi: "kích ứng",
        pos: "noun",
        pronunciation_vi: "i-ri-TA-si",
        pronunciation_en: "i-ri-TA-si",
      },
      {
        word: "toko kosmetik",
        en: "cosmetics store",
        vi: "cửa hàng mỹ phẩm",
        pos: "noun phrase",
        pronunciation_vi: "TO-ko kos-ME-tik",
        pronunciation_en: "TO-ko kos-ME-tik",
      },
    ],
    dialogue: [
      {
        speaker: "Pelanggan",
        text: "Mbak, saya cari pelembap untuk kulit sensitif.",
        vi: "Chị ơi, tôi tìm kem dưỡng ẩm cho da nhạy cảm.",
        en: "Miss, I am looking for a moisturizer for sensitive skin.",
      },
      {
        speaker: "Staf Toko",
        text: "Kulitnya berminyak atau kering?",
        vi: "Da của bạn dầu hay khô?",
        en: "Is your skin oily or dry?",
      },
      {
        speaker: "Pelanggan",
        text: "Berminyak, dan saya mudah iritasi.",
        vi: "Da dầu, và tôi dễ bị kích ứng.",
        en: "Oily, and I get irritated easily.",
      },
      {
        speaker: "Staf Toko",
        text: "Kalau begitu, coba yang ringan dan tanpa parfum.",
        vi: "Nếu vậy, thử loại nhẹ và không hương liệu.",
        en: "In that case, try the light one without fragrance.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Ada ___ yang ringan dan tidak lengket?`",
        prompt_en: "Fill in: `Ada ___ yang ringan dan tidak lengket?`",
        answer: "pelembap",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Sản phẩm này hợp với da dầu không?",
        prompt_en: "Translate to Indonesian: Is this product suitable for oily skin?",
        answer: "Produk ini cocok untuk kulit berminyak?",
      },
      {
        type: "choice",
        prompt_vi: "Từ nào nghĩa là kích ứng?",
        prompt_en: "Which word means irritation?",
        options: ["iritasi", "pelembap", "kedaluwarsa"],
        answer: "iritasi",
      },
    ],
  },
  {
    id: "indonesian_skincare_expiry_irritation_return",
    level: "B1",
    category: "shopping",
    title_vi: "Kiểm tra hạn dùng và phản ứng kích ứng",
    title_en: "Checking expiry dates and irritation reactions",
    sentences: [
      {
        en: "Tanggal kedaluwarsa produk ini di mana?",
        vi: "Ngày hết hạn của sản phẩm này ở đâu?",
        pronunciation_focus: [
          "TANG-gal ke-da-lu-WAR-sa PRO-duk I-ni di MA-na - `tanggal kedaluwarsa` = ngày hết hạn.",
          "Lỗi người Việt: nói `tanggal mati` theo dịch thẳng từ hạn dùng. Cụm đúng là `tanggal kedaluwarsa`.",
          "Luyện: `Tanggal kedaluwarsa di mana?`",
        ],
        pronunciation_focus_en: [
          "TANG-gal ke-da-loo-WAR-sa PRO-duk EE-ni di MA-na - `tanggal kedaluwarsa` = expiry date.",
          "VN-speaker trap: literal `tanggal mati`. The correct phrase is `tanggal kedaluwarsa`.",
          "Drill: `Tanggal kedaluwarsa di mana?`",
        ],
      },
      {
        en: "Saya tidak mau beli produk yang sudah hampir kedaluwarsa.",
        vi: "Tôi không muốn mua sản phẩm sắp hết hạn.",
        pronunciation_focus: [
          "SA-ya TI-dak mau be-LI PRO-duk yang SU-dah HAM-pir ke-da-lu-WAR-sa - `hampir kedaluwarsa` = gần hết hạn/sắp hết hạn.",
          "Lỗi người Việt: dùng `mau expired` theo tiếng Anh. Tự nhiên hơn: `hampir kedaluwarsa`.",
          "Luyện: `Produk ini hampir kedaluwarsa.`",
        ],
        pronunciation_focus_en: [
          "SA-ya TEE-dak mau be-LEE PRO-duk yang SOO-dah HAM-pir ke-da-loo-WAR-sa - `hampir kedaluwarsa` = almost expired.",
          "VN-speaker trap: saying `mau expired` from English. Natural phrase: `hampir kedaluwarsa`.",
          "Drill: `Produk ini hampir kedaluwarsa.`",
        ],
      },
      {
        en: "Kulit saya merah dan perih setelah pakai produk ini.",
        vi: "Da của tôi đỏ và rát sau khi dùng sản phẩm này.",
        pronunciation_focus: [
          "KU-lit SA-ya ME-rah dan PE-rih se-TE-lah PA-kai PRO-duk I-ni - `merah` = đỏ; `perih` = rát/xót.",
          "Lỗi người Việt: dùng `sakit` cho mọi cảm giác da. Da rát/xót nói `perih`; ngứa nói `gatal`.",
          "Luyện: `Kulit saya merah dan perih.`",
        ],
        pronunciation_focus_en: [
          "KU-lit SA-ya ME-rah dan PE-rih se-TE-lah PA-kai PRO-duk EE-ni - `merah` = red; `perih` = stinging/sore.",
          "VN-speaker trap: using `sakit` for every skin feeling. Stinging skin is `perih`; itchy is `gatal`.",
          "Drill: `Kulit saya merah dan perih.`",
        ],
      },
      {
        en: "Mungkin saya tidak cocok dengan kandungannya.",
        vi: "Có lẽ tôi không hợp với thành phần của nó.",
        pronunciation_focus: [
          "MUNG-kin SA-ya TI-dak CO-cok de-NGAN kan-DUNG-an-nya - `kandungan` = thành phần/hàm lượng; `tidak cocok` = không hợp.",
          "Lỗi người Việt: dịch thành phần là `bahan` trong mọi ngữ cảnh. Với mỹ phẩm, `kandungan` rất tự nhiên.",
          "Luyện: `Saya tidak cocok dengan kandungannya.`",
        ],
        pronunciation_focus_en: [
          "MOONG-kin SA-ya TEE-dak CHO-chok de-NGAN kan-DOONG-an-nya - `kandungan` = ingredients/content; `tidak cocok` = not suitable.",
          "VN-speaker trap: translating ingredients as `bahan` everywhere. For cosmetics, `kandungan` is very natural.",
          "Drill: `Saya tidak cocok dengan kandungannya.`",
        ],
      },
      {
        en: "Apakah produk yang sudah dibuka bisa ditukar?",
        vi: "Sản phẩm đã mở rồi có thể đổi không?",
        pronunciation_focus: [
          "a-PA-kah PRO-duk yang SU-dah di-BU-ka BI-sa di-TU-kar - `sudah dibuka` = đã được mở; `ditukar` = được đổi.",
          "Lỗi người Việt: nói `sudah buka` khi sản phẩm là chủ ngữ. Với sản phẩm, dùng bị động `sudah dibuka`.",
          "Luyện: `Produk ini bisa ditukar?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah PRO-duk yang SOO-dah di-BOO-ka BEE-sa di-TOO-kar - `sudah dibuka` = already opened; `ditukar` = exchanged.",
          "VN-speaker trap: saying `sudah buka` when the product is the subject. Use passive `sudah dibuka`.",
          "Drill: `Produk ini bisa ditukar?`",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi mua skincare ở Indonesia, người mua thường hỏi jenis kulit, kandungan, BPOM, tanggal kedaluwarsa, dan testimoni. Với sản phẩm đã mở, chính sách tukar/refund khác nhau theo toko; giữ struk, foto reaksi kulit, và kemasan produk nếu cần komplain.",
    cultural_notes_en:
      "When buying skincare in Indonesia, shoppers often ask about skin type, ingredients, BPOM registration, expiry date, and testimonials. For opened products, exchange/refund policies differ by store; keep the receipt, photos of skin reactions, and product packaging if you need to complain.",
    tip_advice_vi:
      "Khi có phản ứng da, nói cụ thể: `merah`, `perih`, `gatal`, `iritasi`, `tidak cocok`. Đừng chỉ nói `sakit`, vì nhân viên cần biết phản ứng như thế nào.",
    tip_advice_en:
      "When you have a skin reaction, be specific: `merah`, `perih`, `gatal`, `iritasi`, `tidak cocok`. Avoid only saying `sakit`, because staff need to know what kind of reaction happened.",
    vocabulary: [
      {
        word: "tanggal kedaluwarsa",
        en: "expiry date",
        vi: "ngày hết hạn",
        pos: "noun phrase",
        pronunciation_vi: "TANG-gal ke-da-lu-WAR-sa",
        pronunciation_en: "TANG-gal ke-da-loo-WAR-sa",
      },
      {
        word: "hampir kedaluwarsa",
        en: "almost expired",
        vi: "sắp hết hạn",
        pos: "adjective phrase",
        pronunciation_vi: "HAM-pir ke-da-lu-WAR-sa",
        pronunciation_en: "HAM-pir ke-da-loo-WAR-sa",
      },
      {
        word: "perih",
        en: "stinging / sore",
        vi: "rát / xót",
        pos: "adjective",
        pronunciation_vi: "PE-rih",
        pronunciation_en: "PE-rih",
      },
      {
        word: "kandungan",
        en: "ingredients / contents",
        vi: "thành phần / hàm lượng",
        pos: "noun",
        pronunciation_vi: "kan-DUNG-an",
        pronunciation_en: "kan-DOONG-an",
      },
      {
        word: "sudah dibuka",
        en: "already opened",
        vi: "đã mở",
        pos: "verb phrase",
        pronunciation_vi: "SU-dah di-BU-ka",
        pronunciation_en: "SOO-dah di-BOO-ka",
      },
      {
        word: "ditukar",
        en: "exchanged",
        vi: "được đổi",
        pos: "verb",
        pronunciation_vi: "di-TU-kar",
        pronunciation_en: "di-TOO-kar",
      },
    ],
    dialogue: [
      {
        speaker: "Pelanggan",
        text: "Maaf, tanggal kedaluwarsa produk ini di mana?",
        vi: "Xin lỗi, ngày hết hạn của sản phẩm này ở đâu?",
        en: "Excuse me, where is the expiry date on this product?",
      },
      {
        speaker: "Staf Toko",
        text: "Ada di bagian bawah botol, Kak.",
        vi: "Ở phần đáy chai đó bạn.",
        en: "It is on the bottom of the bottle.",
      },
      {
        speaker: "Pelanggan",
        text: "Kalau produk sudah dibuka dan bikin iritasi, bisa ditukar?",
        vi: "Nếu sản phẩm đã mở và gây kích ứng, có đổi được không?",
        en: "If the product is opened and causes irritation, can it be exchanged?",
      },
      {
        speaker: "Staf Toko",
        text: "Tergantung kondisi produk dan struk pembelian.",
        vi: "Tùy tình trạng sản phẩm và hóa đơn mua hàng.",
        en: "It depends on the product condition and purchase receipt.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: `Tanggal ___ produk ini di mana?`",
        prompt_en: "Fill in: `Tanggal ___ produk ini di mana?`",
        answer: "kedaluwarsa",
      },
      {
        type: "translation",
        prompt_vi: "Dịch sang Indonesia: Da của tôi đỏ và rát.",
        prompt_en: "Translate to Indonesian: My skin is red and stinging.",
        answer: "Kulit saya merah dan perih.",
      },
      {
        type: "matching",
        prompt_vi: "Ghép nghĩa: `kandungan`, `perih`, `ditukar`.",
        prompt_en: "Match meanings: `kandungan`, `perih`, `ditukar`.",
        pairs: [
          ["kandungan", "thành phần / ingredients"],
          ["perih", "rát / stinging"],
          ["ditukar", "được đổi / exchanged"],
        ],
      },
    ],
  },
];
