// src/languages/indonesian/extra/street-food-hygiene.ts
//
// Indonesian street-food hygiene pack for Vietnamese learners.
// Covers: jajanan kaki lima, bersih, pedas, saus, keracunan makanan, bungkus,
// makan di tempat, gerobak, and practical stall-safety questions.
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
};

export const streetFoodHygieneLessons: IndonesianLesson[] = [
  {
    id: "indonesian_street_food_hygiene_ordering",
    level: "A2",
    category: "food",
    title_vi: "Đồ ăn vỉa hè — sạch, cay và gói mang về",
    title_en: "Street food — clean, spicy and takeaway",
    sentences: [
      {
        en: "Saya mau beli jajanan kaki lima di gerobak itu.",
        vi: "Tôi muốn mua đồ ăn vỉa hè ở xe đẩy đó.",
        pronunciation_focus: [
          "jajanan kaki lima → đồ ăn vặt/vỉa hè; `kaki lima` là hàng rong/vỉa hè.",
          "gerobak itu → xe đẩy đó; `itu` đứng sau danh từ.",
          "Lỗi người Việt: dịch từng chữ `năm chân`. Học cả cụm `kaki lima` = hàng vỉa hè.",
        ],
        pronunciation_focus_en: [
          "jajanan kaki lima → street snacks/food; `kaki lima` refers to sidewalk vendors.",
          "gerobak itu → that cart; `itu` follows the noun.",
          "VN-speaker trap: translating `five feet` literally. Learn `kaki lima` as a fixed phrase for street vending.",
        ],
      },
      {
        en: "Tempatnya kelihatan bersih dan ramai.",
        vi: "Chỗ đó trông sạch sẽ và đông khách.",
        pronunciation_focus: [
          "kelihatan bersih → trông có vẻ sạch; `kelihatan` = nhìn thấy/trông có vẻ.",
          "ramai → đông/nhộn nhịp; với quán ăn có thể gợi ý đồ quay vòng nhanh.",
          "Lỗi người Việt: dùng `bersih kelihatan`. Đúng trật tự: `kelihatan bersih`.",
        ],
        pronunciation_focus_en: [
          "kelihatan bersih → looks clean; `kelihatan` = visible/appears.",
          "ramai → busy/crowded; for food stalls it can suggest fast turnover.",
          "VN-speaker trap: saying `bersih kelihatan`. Correct order: `kelihatan bersih`.",
        ],
      },
      {
        en: "Tolong sausnya dipisah, jangan terlalu pedas.",
        vi: "Làm ơn để sốt riêng, đừng cay quá.",
        pronunciation_focus: [
          "sausnya dipisah → phần sốt để riêng; `di-` tạo bị động lịch sự.",
          "jangan terlalu pedas → đừng cay quá; `jangan` dùng để cấm/nhờ không làm.",
          "Lỗi người Việt: nói `tidak terlalu pedas` khi yêu cầu người bán. Yêu cầu dùng `jangan terlalu pedas`.",
        ],
        pronunciation_focus_en: [
          "sausnya dipisah → keep the sauce separate; `di-` makes a polite passive.",
          "jangan terlalu pedas → not too spicy, please; `jangan` is used for 'don't'.",
          "VN-speaker trap: saying `tidak terlalu pedas` as a request. For requests, use `jangan terlalu pedas`.",
        ],
      },
      {
        en: "Makan di tempat atau dibungkus, Mas?",
        vi: "Ăn tại chỗ hay gói mang về vậy anh?",
        pronunciation_focus: [
          "makan di tempat → ăn tại chỗ; cũng nghe `makan di sini`.",
          "dibungkus → được gói mang về; bị động `di-` rất thường dùng ở quán.",
          "Đây là câu người bán hay hỏi bạn, nên học để nghe nhanh.",
        ],
        pronunciation_focus_en: [
          "makan di tempat → eat on site; people also say `makan di sini`.",
          "dibungkus → packed to go; passive `di-` is very common at food stalls.",
          "This is a question vendors often ask you, so learn it for quick recognition.",
        ],
      },
      {
        en: "Dibungkus saja, tapi sambalnya sedikit.",
        vi: "Gói mang về thôi, nhưng cho ít sambal.",
        pronunciation_focus: [
          "dibungkus saja → gói mang về thôi; `saja` = thôi/chỉ.",
          "sambalnya sedikit → phần sambal ít; `sedikit` = một chút/ít.",
          "Lỗi người Việt: nói `sedikit sambal` vẫn hiểu, nhưng ở quán `sambalnya sedikit` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "dibungkus saja → takeaway only; `saja` = just/only.",
          "sambalnya sedikit → make the sambal small/a little; `sedikit` = a little.",
          "VN-speaker trap: `sedikit sambal` is understandable, but at stalls `sambalnya sedikit` sounds more natural.",
        ],
      },
    ],
    cultural_notes_vi:
      "`Jajanan kaki lima` là phần quan trọng của đời sống Indonesia: bakso, sate, gorengan, martabak, nasi goreng, siomay, batagor, cilok. Người bản xứ thường nhìn xem quầy có `bersih`, đồ có nóng mới, người bán có dùng kẹp/túi, và quán có `ramai` không. `Gerobak` là xe đẩy/quầy di động; một số rất sạch và nổi tiếng trong khu phố.",
    cultural_notes_en:
      "`Jajanan kaki lima` is a major part of Indonesian daily life: bakso, sate, gorengan, martabak, nasi goreng, siomay, batagor, and cilok. Locals often check whether the stall is `bersih`, food is hot/fresh, the vendor uses tongs/bags, and the stall is `ramai`. A `gerobak` is a food cart/mobile stall; some are very clean and locally famous.",
    tip_advice_vi:
      "Mẹo cho người Việt: ba khung sống còn ở quán vỉa hè là `jangan terlalu pedas`, `sausnya dipisah`, và `dibungkus saja`. Khi muốn lịch sự, gọi người bán là `Mas`, `Mbak`, `Bang`, `Bu`, hoặc `Pak`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: three survival frames at street stalls are `jangan terlalu pedas`, `sausnya dipisah`, and `dibungkus saja`. To be polite, address the vendor as `Mas`, `Mbak`, `Bang`, `Bu`, or `Pak`.",
    vocabulary: [
      {
        word: "jajanan kaki lima",
        en: "street snacks / street food",
        vi: "đồ ăn vỉa hè",
        pos: "noun phrase",
        pronunciation_vi: "ja-JA-nan KA-ki LI-ma",
        pronunciation_en: "ja-JA-nan KA-kee LEE-ma",
      },
      {
        word: "gerobak",
        en: "food cart",
        vi: "xe đẩy/quầy hàng rong",
        pos: "noun",
        pronunciation_vi: "ge-RO-bak",
        pronunciation_en: "geh-RO-bak",
      },
      {
        word: "bersih",
        en: "clean",
        vi: "sạch",
        pos: "adjective",
        pronunciation_vi: "BER-sih",
        pronunciation_en: "BER-see",
      },
      {
        word: "pedas",
        en: "spicy",
        vi: "cay",
        pos: "adjective",
        pronunciation_vi: "pe-DAS",
        pronunciation_en: "peh-DAS",
      },
      {
        word: "saus",
        en: "sauce",
        vi: "sốt",
        pos: "noun",
        pronunciation_vi: "saus",
        pronunciation_en: "sauce",
      },
      {
        word: "dibungkus",
        en: "packed to go",
        vi: "gói mang về",
        pos: "passive verb",
        pronunciation_vi: "di-bung-KUS",
        pronunciation_en: "dee-boong-KOOS",
      },
      {
        word: "makan di tempat",
        en: "eat on site / dine in",
        vi: "ăn tại chỗ",
        pos: "verb phrase",
        pronunciation_vi: "MA-kan di TEM-pat",
        pronunciation_en: "MA-kan dee TEM-pat",
      },
    ],
    dialogue: [
      {
        speaker: "Pembeli",
        text: "Mas, jajanan ini pedas tidak?",
        vi: "Anh ơi, món này có cay không?",
        en: "Sir, is this snack spicy?",
      },
      {
        speaker: "Penjual",
        text: "Agak pedas, tapi sausnya bisa dipisah.",
        vi: "Hơi cay, nhưng sốt có thể để riêng.",
        en: "A little spicy, but the sauce can be separated.",
      },
      {
        speaker: "Pembeli",
        text: "Kalau begitu, dibungkus saja dan sambalnya sedikit.",
        vi: "Vậy thì gói mang về thôi và cho ít sambal.",
        en: "In that case, takeaway only and just a little sambal.",
      },
      {
        speaker: "Penjual",
        text: "Baik. Mau makan di tempat atau langsung bawa pulang?",
        vi: "Vâng. Muốn ăn tại chỗ hay mang về luôn?",
        en: "Okay. Do you want to eat here or take it home right away?",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đồ ăn vỉa hè còn thiếu:",
        instruction_en: "Fill in the missing street-food word:",
        items: [
          {
            prompt: "Saya mau beli jajanan kaki lima di ___ itu. (xe đẩy)",
            answer: "gerobak",
            options: ["gerobak", "goreng", "gudang"],
          },
          {
            prompt: "Tolong sausnya ___. (để riêng)",
            answer: "dipisah",
            options: ["dipisah", "dibuka", "ditutup"],
          },
          {
            prompt: "Makan di tempat atau ___? (gói mang về)",
            answer: "dibungkus",
            options: ["dibungkus", "dimasak", "dibayar"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "jajanan kaki lima", answer: "đồ ăn vỉa hè" },
          { prompt: "bersih", answer: "sạch" },
          { prompt: "pedas", answer: "cay" },
          { prompt: "makan di tempat", answer: "ăn tại chỗ" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Chỗ đó trông sạch sẽ và đông khách.", answer: "Tempatnya kelihatan bersih dan ramai." },
          { prompt: "Làm ơn để sốt riêng, đừng cay quá.", answer: "Tolong sausnya dipisah, jangan terlalu pedas." },
          { prompt: "Gói mang về thôi, nhưng cho ít sambal.", answer: "Dibungkus saja, tapi sambalnya sedikit." },
        ],
      },
    ],
  },
  {
    id: "indonesian_food_poisoning_hygiene",
    level: "B1",
    category: "food",
    title_vi: "An toàn ăn uống — ngộ độc, nước đá và bụng đau",
    title_en: "Food safety — poisoning, ice and stomach pain",
    sentences: [
      {
        en: "Saya khawatir makanan ini kurang bersih.",
        vi: "Tôi lo món này không đủ sạch.",
        pronunciation_focus: [
          "khawatir → lo lắng; từ trang trọng hơn `takut` trong ngữ cảnh sức khỏe.",
          "kurang bersih → không đủ sạch; `kurang` = thiếu/không đủ.",
          "Lỗi người Việt: nói `tidak bersih` quá mạnh. `kurang bersih` mềm hơn khi nhận xét.",
        ],
        pronunciation_focus_en: [
          "khawatir → worried; more formal than `takut` for health contexts.",
          "kurang bersih → not clean enough; `kurang` = lacking/not enough.",
          "VN-speaker trap: saying blunt `tidak bersih`. `kurang bersih` is softer when commenting.",
        ],
      },
      {
        en: "Es batunya dari air matang atau air mentah?",
        vi: "Đá này làm từ nước đun sôi hay nước sống?",
        pronunciation_focus: [
          "es batu → đá viên; nghĩa đen là đá lạnh.",
          "air matang → nước đã nấu/đun sôi; `air mentah` = nước sống/chưa xử lý.",
          "Lỗi người Việt: `air` trong Indonesia nghĩa là nước, không phải không khí.",
        ],
        pronunciation_focus_en: [
          "es batu → ice cubes; literally ice stone.",
          "air matang → boiled/cooked water; `air mentah` = raw/untreated water.",
          "VN-speaker trap: Indonesian `air` means water, not air.",
        ],
      },
      {
        en: "Saya sakit perut setelah makan jajanan itu.",
        vi: "Tôi đau bụng sau khi ăn món vỉa hè đó.",
        pronunciation_focus: [
          "sakit perut → đau bụng; `perut` = bụng.",
          "setelah makan → sau khi ăn; `setelah` = sau khi.",
          "jajanan itu → món ăn vặt/vỉa hè đó; `itu` đứng sau danh từ.",
        ],
        pronunciation_focus_en: [
          "sakit perut → stomachache; `perut` = stomach/belly.",
          "setelah makan → after eating; `setelah` = after.",
          "jajanan itu → that snack/street food; `itu` follows the noun.",
        ],
      },
      {
        en: "Sepertinya saya keracunan makanan.",
        vi: "Có vẻ tôi bị ngộ độc thực phẩm.",
        pronunciation_focus: [
          "sepertinya → có vẻ/hình như; làm câu bớt chắc chắn.",
          "keracunan makanan → bị ngộ độc thực phẩm; gốc `racun` = độc.",
          "Lỗi người Việt: nói `makanan racun`. Thuật ngữ đúng là `keracunan makanan`.",
        ],
        pronunciation_focus_en: [
          "sepertinya → it seems/apparently; softens the statement.",
          "keracunan makanan → food poisoning; root `racun` = poison.",
          "VN-speaker trap: saying `makanan racun`. Correct term: `keracunan makanan`.",
        ],
      },
      {
        en: "Tolong jangan pakai saus yang sudah lama terbuka.",
        vi: "Làm ơn đừng dùng sốt đã mở lâu rồi.",
        pronunciation_focus: [
          "jangan pakai saus → đừng dùng sốt; `jangan` cho yêu cầu không làm.",
          "sudah lama terbuka → đã mở lâu; `terbuka` = đang mở/bị mở.",
          "Câu này hữu ích khi thấy chai sốt để ngoài nắng quá lâu.",
        ],
        pronunciation_focus_en: [
          "jangan pakai saus → don't use sauce; `jangan` for asking someone not to do something.",
          "sudah lama terbuka → has been open for a long time; `terbuka` = open.",
          "This is useful when a sauce bottle has been sitting in the sun too long.",
        ],
      },
      {
        en: "Kalau rasanya aneh, lebih baik jangan dimakan.",
        vi: "Nếu vị lạ, tốt hơn là đừng ăn.",
        pronunciation_focus: [
          "rasanya aneh → vị của nó lạ; `rasa` = vị/cảm giác.",
          "lebih baik → tốt hơn là; khung khuyên nhủ mềm.",
          "jangan dimakan → đừng ăn; bị động `di-` vì nói về món đó.",
        ],
        pronunciation_focus_en: [
          "rasanya aneh → it tastes strange; `rasa` = taste/feeling.",
          "lebih baik → better to; soft advice frame.",
          "jangan dimakan → don't eat it; passive `di-` because the food is the focus.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ăn hàng rong ở Indonesia rất ngon, nhưng người học nên biết cách hỏi vệ sinh một cách lịch sự. Chọn quầy đông, đồ nấu nóng, nước uống đóng chai, và cẩn thận với `es batu`, `saus` để lâu, hoặc đồ chiên nguội. Nếu bị `sakit perut`, tiêu chảy, sốt, hoặc nghi `keracunan makanan`, dùng từ rõ ràng khi nói với apotek hoặc dokter.",
    cultural_notes_en:
      "Indonesian street food is excellent, but learners should know how to ask about hygiene politely. Choose busy stalls, hot freshly cooked food, bottled drinks, and be careful with `es batu`, sauce left open, or cold fried food. If you get stomach pain, diarrhea, fever, or suspect `keracunan makanan`, use clear words with a pharmacy or doctor.",
    tip_advice_vi:
      "Mẹo cho người Việt: `air` = nước, `angin` = gió/không khí. Khi nói nhẹ nhàng về vệ sinh, dùng `kurang bersih` thay vì buộc tội `kotor`. Khi nghi ngộ độc, nói `Sepertinya saya keracunan makanan`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: `air` = water, `angin` = wind/air. To comment gently about hygiene, use `kurang bersih` instead of accusatory `kotor`. If you suspect poisoning, say `Sepertinya saya keracunan makanan`.",
    vocabulary: [
      {
        word: "kurang bersih",
        en: "not clean enough",
        vi: "không đủ sạch",
        pos: "adjective phrase",
        pronunciation_vi: "KU-rang BER-sih",
        pronunciation_en: "KOO-rang BER-see",
      },
      {
        word: "es batu",
        en: "ice cubes",
        vi: "đá viên",
        pos: "noun phrase",
        pronunciation_vi: "es BA-tu",
        pronunciation_en: "ess BA-too",
      },
      {
        word: "air matang",
        en: "boiled water",
        vi: "nước đun sôi",
        pos: "noun phrase",
        pronunciation_vi: "A-ir MA-tang",
        pronunciation_en: "A-eer MA-tang",
      },
      {
        word: "air mentah",
        en: "raw / untreated water",
        vi: "nước sống",
        pos: "noun phrase",
        pronunciation_vi: "A-ir MEN-tah",
        pronunciation_en: "A-eer MEN-tah",
      },
      {
        word: "sakit perut",
        en: "stomachache",
        vi: "đau bụng",
        pos: "phrase",
        pronunciation_vi: "SA-kit PE-rut",
        pronunciation_en: "SA-kit PEH-root",
      },
      {
        word: "keracunan makanan",
        en: "food poisoning",
        vi: "ngộ độc thực phẩm",
        pos: "noun phrase",
        pronunciation_vi: "ke-ra-CHU-nan ma-KA-nan",
        pronunciation_en: "keh-ra-CHOO-nan ma-KA-nan",
      },
      {
        word: "rasanya aneh",
        en: "it tastes strange",
        vi: "vị lạ",
        pos: "phrase",
        pronunciation_vi: "RA-sa-nya A-neh",
        pronunciation_en: "RA-sa-nya A-neh",
      },
    ],
    dialogue: [
      {
        speaker: "Turis",
        text: "Maaf, es batunya dari air matang?",
        vi: "Xin lỗi, đá viên làm từ nước đun sôi không?",
        en: "Excuse me, are the ice cubes from boiled water?",
      },
      {
        speaker: "Penjual",
        text: "Iya, dari air galon. Aman, Kak.",
        vi: "Đúng, từ nước bình. An toàn ạ.",
        en: "Yes, from bottled-gallon water. It is safe.",
      },
      {
        speaker: "Turis",
        text: "Tolong jangan pakai saus yang sudah lama terbuka.",
        vi: "Làm ơn đừng dùng sốt đã mở lâu rồi.",
        en: "Please do not use sauce that has been open for a long time.",
      },
      {
        speaker: "Penjual",
        text: "Baik, saya pakai saus baru saja.",
        vi: "Vâng, tôi dùng sốt mới thôi.",
        en: "Okay, I will use new sauce only.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ vệ sinh ăn uống còn thiếu:",
        instruction_en: "Fill in the missing food-hygiene word:",
        items: [
          {
            prompt: "Saya khawatir makanan ini kurang ___. (sạch)",
            answer: "bersih",
            options: ["bersih", "berisik", "berat"],
          },
          {
            prompt: "Saya sakit ___ setelah makan jajanan itu. (bụng)",
            answer: "perut",
            options: ["perut", "pintu", "pulau"],
          },
          {
            prompt: "Sepertinya saya keracunan ___. (thực phẩm)",
            answer: "makanan",
            options: ["makanan", "minuman", "mainan"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "es batu", answer: "đá viên" },
          { prompt: "air matang", answer: "nước đun sôi" },
          { prompt: "air mentah", answer: "nước sống" },
          { prompt: "keracunan makanan", answer: "ngộ độc thực phẩm" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi lo món này không đủ sạch.", answer: "Saya khawatir makanan ini kurang bersih." },
          { prompt: "Tôi đau bụng sau khi ăn món vỉa hè đó.", answer: "Saya sakit perut setelah makan jajanan itu." },
          { prompt: "Nếu vị lạ, tốt hơn là đừng ăn.", answer: "Kalau rasanya aneh, lebih baik jangan dimakan." },
        ],
      },
    ],
  },
];
