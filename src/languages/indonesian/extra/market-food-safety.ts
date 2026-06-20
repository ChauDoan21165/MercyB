// Market food safety Indonesian (Vietnamese -> Indonesian study track).
//
// A6 Wave 31 file. Covers makanan segar, tanggal kedaluwarsa, bau, warna,
// penyimpanan, keracunan makanan, tanya penjual, and aman dimakan.
// Self-contained so no registry or sibling agent files are touched.
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

export const marketFoodSafetyLessons: IndonesianLesson[] = [
  {
    id: "indonesian_market_food_safety",
    level: "B1",
    category: "food",
    title_vi: "An toàn thực phẩm khi đi chợ",
    title_en: "Market food safety",
    sentences: [
      {
        en: "Saya mencari makanan segar untuk dimasak malam ini.",
        vi: "Tôi đang tìm thực phẩm tươi để nấu tối nay.",
        pronunciation_focus: [
          "ma-KA-nan SE-gar → thực phẩm tươi; dùng `segar` cho rau, cá, thịt, trái cây.",
          "`untuk dimasak` = để được nấu; bị động `di-` tự nhiên khi nói mục đích dùng thực phẩm.",
          "Lỗi người Việt: dịch 'tươi' thành `baru`. Với đồ ăn nói `segar`; `makanan baru` nghe như món mới.",
        ],
        pronunciation_focus_en: [
          "ma-KA-nan SE-gar → fresh food; use `segar` for vegetables, fish, meat, and fruit.",
          "`untuk dimasak` = to be cooked; passive `di-` sounds natural for food use.",
          "VN-speaker trap: translating fresh as `baru`. For food use `segar`; `makanan baru` sounds like a new dish.",
        ],
      },
      {
        en: "Tanggal kedaluwarsanya sampai kapan, Pak?",
        vi: "Hạn sử dụng đến ngày nào vậy chú?",
        pronunciation_focus: [
          "tanggal ke-da-lu-WAR-sa-nya → ngày hết hạn của nó; `-nya` chỉ sản phẩm đang cầm.",
          "`sampai kapan` = đến khi nào; dùng để hỏi hạn cuối.",
          "Lỗi người Việt: nói `tanggal mati` theo nghĩa chết/hết. Cụm đúng trên bao bì là `tanggal kedaluwarsa`.",
        ],
        pronunciation_focus_en: [
          "tanggal ke-da-lu-WAR-sa-nya → its expiration date; `-nya` points to the product you are holding.",
          "`sampai kapan` = until when; useful for asking about deadlines.",
          "VN-speaker trap: saying `tanggal mati`. The packaging term is `tanggal kedaluwarsa`.",
        ],
      },
      {
        en: "Baunya agak asam, apakah masih aman dimakan?",
        vi: "Mùi hơi chua, còn an toàn để ăn không?",
        pronunciation_focus: [
          "bau-nya A-gak A-sam → mùi hơi chua; `agak` làm câu mềm hơn.",
          "`aman dimakan` = an toàn để ăn; khung rất hữu ích khi hỏi người bán.",
          "Lỗi người Việt: dùng `rasa` khi mới ngửi. `Bau` là mùi; `rasa` là vị/cảm giác.",
        ],
        pronunciation_focus_en: [
          "bau-nya A-gak A-sam → it smells a bit sour; `agak` softens the sentence.",
          "`aman dimakan` = safe to eat; a very useful frame when asking vendors.",
          "VN-speaker trap: using `rasa` when you only smelled it. `Bau` is smell; `rasa` is taste/feeling.",
        ],
      },
      {
        en: "Warnanya sudah berubah, jadi saya tidak jadi beli.",
        vi: "Màu đã đổi rồi, nên tôi không mua nữa.",
        pronunciation_focus: [
          "WAR-na-nya SU-dah ber-U-bah → màu của nó đã đổi; dấu hiệu không tươi.",
          "`tidak jadi beli` = quyết định không mua nữa, rất tự nhiên trong mua bán.",
          "Lỗi người Việt: dịch 'không mua nữa' thành `tidak beli lagi`. Trong tình huống đổi ý, nói `tidak jadi beli`.",
        ],
        pronunciation_focus_en: [
          "WAR-na-nya SOO-dah ber-OO-bah → its color has changed; a freshness warning sign.",
          "`tidak jadi beli` = decided not to buy after all, very natural in shopping.",
          "VN-speaker trap: translating 'not buying anymore' as `tidak beli lagi`. When changing your mind, say `tidak jadi beli`.",
        ],
      },
      {
        en: "Bagaimana cara penyimpanan daging ini di rumah?",
        vi: "Cách bảo quản thịt này ở nhà như thế nào?",
        pronunciation_focus: [
          "pe-nyim-PA-nan → sự bảo quản/cất giữ; từ gốc `simpan` = cất, giữ.",
          "`Bagaimana cara...` = cách... như thế nào; lịch sự và rõ khi hỏi hướng dẫn.",
          "Lỗi người Việt: hỏi `simpan bagaimana?` vẫn hiểu, nhưng `bagaimana cara penyimpanan...` chuẩn hơn.",
        ],
        pronunciation_focus_en: [
          "pe-nyim-PA-nan → storage/keeping; from root `simpan` = store, keep.",
          "`Bagaimana cara...` = what is the way to...; polite and clear for instructions.",
          "VN-speaker trap: `simpan bagaimana?` is understandable, but `bagaimana cara penyimpanan...` is more standard.",
        ],
      },
      {
        en: "Sebaiknya sayur ini disimpan di kulkas atau suhu ruang?",
        vi: "Rau này nên bảo quản trong tủ lạnh hay ở nhiệt độ phòng?",
        pronunciation_focus: [
          "se-BAIK-nya → tốt nhất là/nên; dùng khi hỏi lời khuyên.",
          "`suhu ruang` = nhiệt độ phòng; `kulkas` = tủ lạnh.",
          "Lỗi người Việt: nói `temperatur kamar` theo tiếng Anh. Trong đời thường nói `suhu ruang`.",
        ],
        pronunciation_focus_en: [
          "se-BAIK-nya → preferably/it is better to; useful for asking advice.",
          "`suhu ruang` = room temperature; `kulkas` = refrigerator.",
          "VN-speaker trap: saying English-like `temperatur kamar`. In daily Indonesian, say `suhu ruang`.",
        ],
      },
      {
        en: "Saya khawatir anak saya bisa keracunan makanan.",
        vi: "Tôi lo con tôi có thể bị ngộ độc thực phẩm.",
        pronunciation_focus: [
          "ke-ra-CU-nan ma-KA-nan → ngộ độc thực phẩm; `keracunan` = bị nhiễm độc/ngộ độc.",
          "`khawatir` = lo lắng; dùng lịch sự hơn `takut` trong câu giải thích.",
          "Lỗi người Việt: nói `racun makanan` cho bệnh. `Racun` là chất độc; tình trạng bị ngộ độc là `keracunan makanan`.",
        ],
        pronunciation_focus_en: [
          "ke-ra-CHOO-nan ma-KA-nan → food poisoning; `keracunan` = poisoned/poisoning condition.",
          "`khawatir` = worried; more neutral than `takut` in an explanation.",
          "VN-speaker trap: saying `racun makanan` for the illness. `Racun` is poison; the condition is `keracunan makanan`.",
        ],
      },
      {
        en: "Boleh saya tanya penjualnya, ini baru datang pagi ini?",
        vi: "Tôi có thể hỏi người bán không, hàng này mới về sáng nay à?",
        pronunciation_focus: [
          "BO-leh SA-ya TA-nya pen-JU-al-nya → tôi có thể hỏi người bán không; mở lời lịch sự.",
          "`baru datang pagi ini` = mới về sáng nay; dùng cho hàng ở chợ.",
          "Lỗi người Việt: dùng `datang baru` sai trật tự. Đúng là `baru datang`.",
        ],
        pronunciation_focus_en: [
          "BO-leh SA-ya TA-nya pen-JOO-al-nya → may I ask the seller; polite opener.",
          "`baru datang pagi ini` = just arrived this morning; common for market stock.",
          "VN-speaker trap: saying `datang baru` with the wrong order. Correct: `baru datang`.",
        ],
      },
      {
        en: "Kalau sudah lewat tanggal kedaluwarsa, jangan dimakan.",
        vi: "Nếu đã quá hạn sử dụng thì đừng ăn.",
        pronunciation_focus: [
          "`lewat tanggal kedaluwarsa` = quá hạn sử dụng; `lewat` ở đây là vượt qua.",
          "`jangan dimakan` = đừng ăn; bị động `di-` tập trung vào món ăn.",
          "Lỗi người Việt: dùng `tidak dimakan` cho lời cảnh báo. Cấm/khuyên không làm dùng `jangan dimakan`.",
        ],
        pronunciation_focus_en: [
          "`lewat tanggal kedaluwarsa` = past the expiration date; `lewat` here means beyond/past.",
          "`jangan dimakan` = do not eat it; passive `di-` focuses on the food.",
          "VN-speaker trap: using `tidak dimakan` for a warning. For prohibition/advice not to do something, use `jangan dimakan`.",
        ],
      },
      {
        en: "Kalau ragu, lebih baik pilih yang lebih segar.",
        vi: "Nếu nghi ngờ, tốt hơn nên chọn loại tươi hơn.",
        pronunciation_focus: [
          "KA-lau RA-gu → nếu nghi ngờ/không chắc; câu ngắn và tự nhiên.",
          "`lebih baik pilih...` = tốt hơn nên chọn; không cần chủ ngữ khi nói lời khuyên chung.",
          "Lỗi người Việt: dịch từng chữ 'nghi ngờ' thành `curiga` trong mua đồ ăn. `Curiga` là nghi ngờ ai đó; với độ an toàn dùng `ragu`.",
        ],
        pronunciation_focus_en: [
          "KA-lau RA-goo → if unsure/in doubt; short and natural.",
          "`lebih baik pilih...` = it is better to choose; no subject needed for general advice.",
          "VN-speaker trap: translating doubt as `curiga` in food shopping. `Curiga` means suspicious of someone; for food safety uncertainty use `ragu`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở chợ truyền thống Indonesia, người mua thường hỏi người bán về hàng mới về, mùi, màu, cách bảo quản, và có an toàn để ăn không. Gọi người bán là `Pak`, `Bu`, `Mas`, hoặc `Mbak` giúp câu hỏi nghe thân thiện hơn. Với thực phẩm dễ hỏng như thịt, cá, sữa, và makanan bersantan, nên chú ý nhiệt độ, mùi, màu, và tanggal kedaluwarsa.",
    cultural_notes_en:
      "At Indonesian traditional markets, buyers commonly ask vendors whether stock just arrived, about smell and color, how to store it, and whether it is safe to eat. Addressing sellers as `Pak`, `Bu`, `Mas`, or `Mbak` makes questions friendlier. For perishable foods like meat, fish, dairy, and coconut-milk dishes, pay attention to temperature, smell, color, and expiration date.",
    tip_advice_vi:
      "Mẹo cho người Việt: `segar` = tươi, `bau` = mùi, `warna` = màu, `kedaluwarsa` = hết hạn, `aman dimakan` = an toàn để ăn. Khi yêu cầu không làm gì, dùng `jangan`: `jangan dimakan`, `jangan dibeli kalau baunya aneh`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: `segar` = fresh, `bau` = smell, `warna` = color, `kedaluwarsa` = expired/expiration, `aman dimakan` = safe to eat. For negative instructions, use `jangan`: `jangan dimakan`, `jangan dibeli kalau baunya aneh`.",
    vocabulary: [
      {
        word: "makanan segar",
        en: "fresh food",
        vi: "thực phẩm tươi",
        pos: "noun phrase",
        pronunciation_vi: "ma-KA-nan SE-gar",
        pronunciation_en: "ma-KA-nan SE-gar",
      },
      {
        word: "tanggal kedaluwarsa",
        en: "expiration date",
        vi: "hạn sử dụng; ngày hết hạn",
        pos: "noun phrase",
        pronunciation_vi: "TANG-gal ke-da-lu-WAR-sa",
        pronunciation_en: "TANG-gal keh-da-loo-WAR-sa",
      },
      {
        word: "bau",
        en: "smell; odor",
        vi: "mùi",
        pos: "noun",
        pronunciation_vi: "BAU",
        pronunciation_en: "BAU",
      },
      {
        word: "warna",
        en: "color",
        vi: "màu sắc",
        pos: "noun",
        pronunciation_vi: "WAR-na",
        pronunciation_en: "WAR-na",
      },
      {
        word: "penyimpanan",
        en: "storage",
        vi: "sự bảo quản; cách cất giữ",
        pos: "noun",
        pronunciation_vi: "pe-nyim-PA-nan",
        pronunciation_en: "peh-nyim-PA-nan",
      },
      {
        word: "keracunan makanan",
        en: "food poisoning",
        vi: "ngộ độc thực phẩm",
        pos: "noun phrase",
        pronunciation_vi: "ke-ra-CU-nan ma-KA-nan",
        pronunciation_en: "keh-ra-CHOO-nan ma-KA-nan",
      },
      {
        word: "tanya penjual",
        en: "ask the seller",
        vi: "hỏi người bán",
        pos: "verb phrase",
        pronunciation_vi: "TA-nya pen-JU-al",
        pronunciation_en: "TA-nya pen-JOO-al",
      },
      {
        word: "aman dimakan",
        en: "safe to eat",
        vi: "an toàn để ăn",
        pos: "phrase",
        pronunciation_vi: "A-man di-MA-kan",
        pronunciation_en: "A-man dee-MA-kan",
      },
      {
        word: "suhu ruang",
        en: "room temperature",
        vi: "nhiệt độ phòng",
        pos: "noun phrase",
        pronunciation_vi: "SU-hu RU-ang",
        pronunciation_en: "SOO-hoo ROO-ang",
      },
      {
        word: "baru datang",
        en: "just arrived",
        vi: "mới về; mới đến",
        pos: "phrase",
        pronunciation_vi: "BA-ru DA-tang",
        pronunciation_en: "BA-roo DA-tang",
      },
    ],
    dialogue: [
      {
        speaker: "Pembeli",
        text: "Bu, ayam ini masih segar? Baunya agak kuat.",
        vi: "Cô ơi, gà này còn tươi không? Mùi hơi nặng.",
        en: "Ma'am, is this chicken still fresh? The smell is a bit strong.",
      },
      {
        speaker: "Penjual",
        text: "Masih segar, Mbak. Baru datang pagi ini.",
        vi: "Còn tươi, chị. Mới về sáng nay.",
        en: "It is still fresh, ma'am. It just arrived this morning.",
      },
      {
        speaker: "Pembeli",
        text: "Tanggal kedaluwarsanya sampai kapan?",
        vi: "Hạn sử dụng đến khi nào?",
        en: "When is the expiration date?",
      },
      {
        speaker: "Penjual",
        text: "Untuk yang kemasan, tanggalnya ada di label. Yang segar sebaiknya langsung dimasak.",
        vi: "Hàng đóng gói thì ngày có trên nhãn. Hàng tươi tốt nhất nên nấu ngay.",
        en: "For packaged items, the date is on the label. Fresh items should preferably be cooked right away.",
      },
      {
        speaker: "Pembeli",
        text: "Kalau disimpan di kulkas sampai besok, masih aman dimakan?",
        vi: "Nếu để trong tủ lạnh đến mai thì vẫn an toàn để ăn không?",
        en: "If it is stored in the refrigerator until tomorrow, is it still safe to eat?",
      },
      {
        speaker: "Penjual",
        text: "Bisa, tapi kalau warna atau baunya berubah, jangan dimakan.",
        vi: "Được, nhưng nếu màu hoặc mùi thay đổi thì đừng ăn.",
        en: "Yes, but if the color or smell changes, do not eat it.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: 'Mùi hơi chua, còn an toàn để ăn không?'",
        prompt_en: "Translate into Indonesian: 'It smells a bit sour; is it still safe to eat?'",
        answer: "Baunya agak asam, apakah masih aman dimakan?",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ đúng: Tanggal ____ sampai kapan?",
        prompt_en: "Fill in the correct word: Tanggal ____ sampai kapan?",
        answer: "kedaluwarsanya",
      },
      {
        type: "matching",
        prompt_vi: "Nối cụm từ với nghĩa: makanan segar, penyimpanan, keracunan makanan, aman dimakan.",
        prompt_en: "Match the phrases with meanings: makanan segar, penyimpanan, keracunan makanan, aman dimakan.",
        answer: "makanan segar = fresh food; penyimpanan = storage; keracunan makanan = food poisoning; aman dimakan = safe to eat.",
      },
      {
        type: "roleplay",
        prompt_vi: "Đóng vai người mua ở chợ: hỏi người bán về độ tươi, hạn sử dụng, mùi, màu, và cách bảo quản.",
        prompt_en: "Roleplay as a market customer: ask the seller about freshness, expiration date, smell, color, and storage.",
        sample_answer: "Bu, ini masih segar? Tanggal kedaluwarsanya sampai kapan? Kalau baunya berubah, masih aman dimakan? Bagaimana cara penyimpanannya di rumah?",
      },
    ],
  },
];
