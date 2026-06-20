// Electricity & water bill Indonesian (Vietnamese -> Indonesian study track).
//
// A1 Wave 17 file. Covers tagihan listrik, token listrik, meteran, PDAM,
// air mati, bayar tagihan, denda, and kantor layanan. Self-contained so no
// registry or sibling agent files are touched.
//
// Field convention: sentence `en` holds the target Indonesian line, `vi` holds
// the Vietnamese gloss. `pronunciation_focus` carries Vietnamese-facing notes
// and common L1 traps; `pronunciation_focus_en` mirrors the same order for
// English-speaking companions.

export type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
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
  /** Part of speech, e.g. "noun", "verb", "phrase". */
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

// Loosely typed so per-type fields (translation, fill-blank, matching) can vary.
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

export const electricityWaterBillLessons: IndonesianLesson[] = [
  {
    id: "indonesian_electricity_bill_token",
    level: "A2",
    category: "housing",
    title_vi: "Tiền điện và token listrik",
    title_en: "Electricity bills and prepaid tokens",
    sentences: [
      {
        en: "Saya mau bayar tagihan listrik bulan ini.",
        vi: "Tôi muốn trả tiền điện tháng này.",
        pronunciation_focus: [
          "SA-ya mau BA-yar ta-GIH-an LIS-trik BU-lan I-ni - `tagihan listrik` = hóa đơn/tiền điện.",
          "`tagihan` là khoản phải trả; dùng cho điện, nước, internet, thẻ tín dụng.",
          "Lỗi người Việt: nói `bayar listrik uang`. Tự nhiên hơn là `bayar tagihan listrik`.",
        ],
        pronunciation_focus_en: [
          "SA-ya mau BA-yar ta-GEE-han LIS-trik BOO-lan EE-nee - `tagihan listrik` = electricity bill.",
          "`tagihan` is an amount due; used for electricity, water, internet, credit cards.",
          "VN-speaker trap: saying `bayar listrik uang`. Natural Indonesian is `bayar tagihan listrik`.",
        ],
      },
      {
        en: "Nomor pelanggan listriknya berapa?",
        vi: "Mã khách hàng điện là bao nhiêu?",
        pronunciation_focus: [
          "NO-mor pe-lang-GAN LIS-trik-nya be-RA-pa - `nomor pelanggan` = mã/số khách hàng.",
          "`pelanggan` = khách hàng/người đăng ký dịch vụ; khác `tamu` = khách đến chơi.",
          "Lỗi người Việt: hỏi `nomor listrik berapa?` vẫn hiểu, nhưng `nomor pelanggan` rõ hơn với dịch vụ.",
        ],
        pronunciation_focus_en: [
          "NO-mor pe-lang-GAN LIS-trik-nya be-RA-pa - `nomor pelanggan` = customer number.",
          "`pelanggan` = customer/subscriber; different from `tamu` = social guest.",
          "VN-speaker trap: asking `nomor listrik berapa?` is understandable, but `nomor pelanggan` is clearer for utilities.",
        ],
      },
      {
        en: "Saya perlu beli token listrik sebelum habis.",
        vi: "Tôi cần mua token điện trước khi hết.",
        pronunciation_focus: [
          "SA-ya per-LU BE-li TO-ken LIS-trik se-BE-lum HA-bis - `token listrik` = mã nạp điện trả trước.",
          "`sebelum habis` = trước khi hết; dùng cho điện trả trước.",
          "Lỗi người Việt: dùng `pulsa listrik` và `token listrik` lẫn nhau. Cả hai gặp trong đời thường, nhưng `token listrik` rõ với mã nạp.",
        ],
        pronunciation_focus_en: [
          "SA-ya per-LOO BEH-lee TO-ken LIS-trik se-BE-loom HA-bis - `token listrik` = prepaid electricity token.",
          "`sebelum habis` = before it runs out; used for prepaid electricity.",
          "VN-speaker trap: mixing `pulsa listrik` and `token listrik`. Both are heard, but `token listrik` clearly means the recharge code.",
        ],
      },
      {
        en: "Meterannya bunyi terus karena token hampir habis.",
        vi: "Công tơ kêu liên tục vì token gần hết.",
        pronunciation_focus: [
          "me-TE-ran-nya BU-nyi te-RUS ka-RE-na TO-ken HAM-pir HA-bis - `meteran` = công tơ/đồng hồ đo.",
          "`bunyi terus` = kêu liên tục; rất thường với listrik prabayar.",
          "Lỗi người Việt: nói `meteran suara`. Động từ đúng là `bunyi` = phát ra âm thanh.",
        ],
        pronunciation_focus_en: [
          "me-TEH-ran-nya BOO-nyee te-ROOS ka-REH-na TO-ken HAM-pir HA-bis - `meteran` = meter.",
          "`bunyi terus` = keeps beeping/making sound; common with prepaid electricity.",
          "VN-speaker trap: saying `meteran suara`. The correct verb is `bunyi` = make a sound.",
        ],
      },
      {
        en: "Kalau terlambat bayar, apakah ada denda?",
        vi: "Nếu trả trễ, có bị phạt không?",
        pronunciation_focus: [
          "KA-lau ter-LAM-bat BA-yar, A-pa-kah A-da DEN-da - `denda` = tiền phạt.",
          "`terlambat bayar` = trả muộn; cụm ngắn rất tự nhiên.",
          "Lỗi người Việt: nói `kena phạt` bằng tiếng Việt chen vào. Trong Indonesia dùng `ada denda` hoặc `kena denda`.",
        ],
        pronunciation_focus_en: [
          "KA-lau ter-LAM-bat BA-yar, A-pa-kah A-da DEN-da - `denda` = fine/penalty.",
          "`terlambat bayar` = late in paying; a natural short phrase.",
          "VN-speaker trap: code-switching Vietnamese `phạt`. In Indonesian use `ada denda` or `kena denda`.",
        ],
      },
    ],
    cultural_notes_vi:
      "Điện ở Indonesia thường liên quan đến PLN. Có nhà dùng listrik pascabayar (trả sau theo tagihan), có nhà dùng listrik prabayar (mua token trước rồi nhập vào meteran). Khi thuê nhà/kos, nên hỏi tiền điện tính riêng hay termasuk sewa, số meteran ở đâu, và ai chịu denda nếu terlambat bayar.",
    cultural_notes_en:
      "Electricity in Indonesia usually involves PLN. Some homes use postpaid electricity (`pascabayar`) with monthly bills, while others use prepaid electricity (`prabayar`) by buying a token and entering it into the meter. When renting a house or kos, ask whether electricity is separate or included in rent, where the meter is, and who pays any late fee.",
    tip_advice_vi:
      "Bộ câu sống còn: `bayar tagihan listrik`, `nomor pelanggan`, `beli token listrik`, `meterannya bunyi`, `ada denda?`. Bẫy lớn là `tagihan` vs `biaya`: `tagihan` là hóa đơn/khoản đang phải trả; `biaya` là chi phí nói chung.",
    tip_advice_en:
      "Survival set: `bayar tagihan listrik`, `nomor pelanggan`, `beli token listrik`, `meterannya bunyi`, `ada denda?`. The big trap is `tagihan` vs `biaya`: `tagihan` is the bill/amount due; `biaya` is cost in general.",
    vocabulary: [
      { word: "tagihan listrik", en: "electricity bill", vi: "hóa đơn/tiền điện", pos: "noun phrase", pronunciation_vi: "ta-GIH-an LIS-trik", pronunciation_en: "ta-GEE-han LIS-trik" },
      { word: "nomor pelanggan", en: "customer number", vi: "mã khách hàng", pos: "noun phrase", pronunciation_vi: "NO-mor pe-lang-GAN", pronunciation_en: "NO-mor pe-lang-GAN" },
      { word: "token listrik", en: "prepaid electricity token", vi: "token/mã nạp điện", pos: "noun phrase", pronunciation_vi: "TO-ken LIS-trik", pronunciation_en: "TO-ken LIS-trik" },
      { word: "meteran", en: "meter", vi: "công tơ/đồng hồ đo", pos: "noun", pronunciation_vi: "me-TE-ran", pronunciation_en: "me-TEH-ran" },
      { word: "denda", en: "fine/penalty", vi: "tiền phạt", pos: "noun", pronunciation_vi: "DEN-da", pronunciation_en: "DEN-da" },
      { word: "terlambat bayar", en: "late in paying", vi: "trả trễ", pos: "phrase", pronunciation_vi: "ter-LAM-bat BA-yar", pronunciation_en: "ter-LAM-bat BA-yar" },
    ],
    dialogue: [
      { speaker: "Penyewa", text: "Saya mau bayar tagihan listrik bulan ini. Nomor pelanggannya berapa?", vi: "Tôi muốn trả tiền điện tháng này. Mã khách hàng là bao nhiêu?", en: "I want to pay this month's electricity bill. What is the customer number?" },
      { speaker: "Pemilik kos", text: "Ini nomornya. Kalau meteran bunyi, berarti token hampir habis.", vi: "Đây là mã. Nếu công tơ kêu, nghĩa là token gần hết.", en: "Here is the number. If the meter beeps, it means the token is almost out." },
      { speaker: "Penyewa", text: "Baik. Kalau terlambat bayar, apakah ada denda?", vi: "Vâng. Nếu trả trễ, có bị phạt không?", en: "Okay. If payment is late, is there a fine?" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "tagihan listrik", answer: "hóa đơn điện" },
          { prompt: "token listrik", answer: "mã nạp điện" },
          { prompt: "meteran", answer: "công tơ" },
          { prompt: "denda", answer: "tiền phạt" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi muốn trả tiền điện tháng này.", answer: "Saya mau bayar tagihan listrik bulan ini." },
          { prompt: "Công tơ kêu liên tục.", answer: "Meterannya bunyi terus." },
        ],
      },
    ],
  },
  {
    id: "indonesian_water_bill_pdam",
    level: "B1",
    category: "housing",
    title_vi: "PDAM, hóa đơn nước và nước bị cắt",
    title_en: "PDAM, water bills and water outages",
    sentences: [
      {
        en: "Tagihan air bulan ini naik banyak.",
        vi: "Tiền nước tháng này tăng nhiều.",
        pronunciation_focus: [
          "ta-GIH-an A-ir BU-lan I-ni NAIK BA-nyak - `tagihan air` = hóa đơn/tiền nước.",
          "`naik banyak` = tăng nhiều; dùng cho giá, hóa đơn, số liệu.",
          "Lỗi người Việt: nói `tagihan air tinggi banyak`. Tự nhiên hơn là `naik banyak` nếu so với tháng trước.",
        ],
        pronunciation_focus_en: [
          "ta-GEE-han A-eer BOO-lan EE-nee NAIK BA-nyak - `tagihan air` = water bill.",
          "`naik banyak` = rose a lot; used for prices, bills, numbers.",
          "VN-speaker trap: saying `tagihan air tinggi banyak`. `Naik banyak` is natural if comparing with last month.",
        ],
      },
      {
        en: "Air di rumah saya mati sejak pagi.",
        vi: "Nước ở nhà tôi bị cắt từ sáng.",
        pronunciation_focus: [
          "A-ir di RU-mah SA-ya MA-ti se-JAK PA-gi - `air mati` = nước bị cắt/không chảy.",
          "`mati` không chỉ là chết; với điện/nước/máy móc nghĩa là tắt/ngừng hoạt động.",
          "Lỗi người Việt: nói `air tidak hidup`. Cụm tự nhiên là `air mati`.",
        ],
        pronunciation_focus_en: [
          "A-eer di ROO-mah SA-ya MA-tee se-JAK PA-gee - `air mati` = water is off/not running.",
          "`mati` is not only 'dead'; with utilities/machines it means off/not working.",
          "VN-speaker trap: saying `air tidak hidup`. Natural phrase: `air mati`.",
        ],
      },
      {
        en: "Saya mau lapor gangguan air ke PDAM.",
        vi: "Tôi muốn báo sự cố nước cho PDAM.",
        pronunciation_focus: [
          "SA-ya mau LA-por gang-GU-an A-ir ke pe-de-a-EM - `gangguan air` = sự cố nước.",
          "`PDAM` đọc từng chữ Indonesia; là công ty/cơ quan nước sạch địa phương.",
          "Lỗi người Việt: dùng `di PDAM` khi nói báo tới PDAM. Hướng gửi báo cáo dùng `ke PDAM`.",
        ],
        pronunciation_focus_en: [
          "SA-ya mau LA-por gang-GOO-an A-eer ke pe-de-a-EM - `gangguan air` = water service disruption.",
          "`PDAM` is spelled with Indonesian letter names; it is the local water utility.",
          "VN-speaker trap: using `di PDAM` when reporting to PDAM. Direction/recipient uses `ke PDAM`.",
        ],
      },
      {
        en: "Meteran airnya mungkin bermasalah.",
        vi: "Đồng hồ nước có thể có vấn đề.",
        pronunciation_focus: [
          "me-TE-ran A-ir-nya MUNG-kin ber-ma-SA-lah - `bermasalah` = có vấn đề.",
          "`mungkin` = có thể/chắc là; giúp câu bớt khẳng định khi chưa chắc.",
          "Lỗi người Việt: nói `ada masalah meteran` được, nhưng `meterannya bermasalah` tự nhiên hơn.",
        ],
        pronunciation_focus_en: [
          "me-TEH-ran A-eer-nya MOONG-kin ber-ma-SA-lah - `bermasalah` = has a problem.",
          "`mungkin` = maybe/possibly; it softens the claim when you are not sure.",
          "VN-speaker trap: `ada masalah meteran` works, but `meterannya bermasalah` is more natural.",
        ],
      },
      {
        en: "Kantor layanan buka sampai jam empat sore.",
        vi: "Văn phòng dịch vụ mở đến bốn giờ chiều.",
        pronunciation_focus: [
          "KAN-tor la-YA-nan BU-ka SAM-pai jam EM-pat SO-re - `kantor layanan` = văn phòng dịch vụ/chăm sóc khách hàng.",
          "`sampai jam empat sore` = đến 4 giờ chiều; `sampai` chỉ điểm kết thúc.",
          "Lỗi người Việt: dùng `hingga` trong mọi câu. `Hingga` đúng nhưng trang trọng; `sampai` tự nhiên hơn trong hội thoại.",
        ],
        pronunciation_focus_en: [
          "KAN-tor la-YA-nan BOO-ka SAM-pai jam EM-pat SO-re - `kantor layanan` = service/customer office.",
          "`sampai jam empat sore` = until 4 p.m.; `sampai` marks the endpoint.",
          "VN-speaker trap: using formal `hingga` everywhere. It is correct, but `sampai` is more conversational.",
        ],
      },
    ],
    cultural_notes_vi:
      "Nước máy địa phương ở Indonesia thường liên quan đến PDAM, nhưng nhiều nhà/kos cũng dùng sumur, tandon, hoặc pompa air. Vì vậy khi `air mati`, nguyên nhân có thể từ PDAM, pompa, meteran, hoặc tandon kosong. Khi báo lỗi, nói rõ alamat, nomor pelanggan, sejak kapan, và apakah tetangga juga mengalami masalah yang sama.",
    cultural_notes_en:
      "Local piped water in Indonesia often involves PDAM, but many houses/kos also use wells, water tanks, or pumps. So when `air mati`, the cause may be PDAM, the pump, the meter, or an empty tank. When reporting a problem, state the address, customer number, since when, and whether neighbors have the same problem.",
    tip_advice_vi:
      "Cụm nước cần nhớ: `tagihan air`, `air mati`, `lapor gangguan air`, `meteran air`, `kantor layanan`. Bẫy lớn là `air`: trong tiếng Indonesia nghĩa là nước, không phải không khí. Không khí là `udara`.",
    tip_advice_en:
      "Water phrases to remember: `tagihan air`, `air mati`, `lapor gangguan air`, `meteran air`, `kantor layanan`. Big trap: Indonesian `air` means water, not air. Air is `udara`.",
    vocabulary: [
      { word: "tagihan air", en: "water bill", vi: "hóa đơn/tiền nước", pos: "noun phrase", pronunciation_vi: "ta-GIH-an A-ir", pronunciation_en: "ta-GEE-han A-eer" },
      { word: "PDAM", en: "local water utility", vi: "công ty/cơ quan nước địa phương", pos: "noun", pronunciation_vi: "pe-de-a-EM", pronunciation_en: "pe-de-a-EM" },
      { word: "air mati", en: "water is off", vi: "nước bị cắt/không chảy", pos: "phrase", pronunciation_vi: "A-ir MA-ti", pronunciation_en: "A-eer MA-tee" },
      { word: "gangguan air", en: "water disruption", vi: "sự cố nước", pos: "noun phrase", pronunciation_vi: "gang-GU-an A-ir", pronunciation_en: "gang-GOO-an A-eer" },
      { word: "meteran air", en: "water meter", vi: "đồng hồ nước", pos: "noun phrase", pronunciation_vi: "me-TE-ran A-ir", pronunciation_en: "me-TEH-ran A-eer" },
      { word: "kantor layanan", en: "service office", vi: "văn phòng dịch vụ", pos: "noun phrase", pronunciation_vi: "KAN-tor la-YA-nan", pronunciation_en: "KAN-tor la-YA-nan" },
    ],
    dialogue: [
      { speaker: "Pelanggan", text: "Selamat pagi. Air di rumah saya mati sejak pagi.", vi: "Chào buổi sáng. Nước ở nhà tôi bị cắt từ sáng.", en: "Good morning. The water at my house has been off since morning." },
      { speaker: "Petugas PDAM", text: "Mohon sebutkan alamat dan nomor pelanggan.", vi: "Vui lòng cho biết địa chỉ và mã khách hàng.", en: "Please state the address and customer number." },
      { speaker: "Pelanggan", text: "Baik. Meteran airnya juga mungkin bermasalah.", vi: "Vâng. Đồng hồ nước cũng có thể có vấn đề.", en: "Okay. The water meter may also have a problem." },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng.",
        instruction_en: "Fill in the correct word.",
        items: [
          { prompt: "Tagihan ___ bulan ini naik banyak.", answer: "air" },
          { prompt: "Saya mau lapor ___ air ke PDAM.", answer: "gangguan" },
          { prompt: "Kantor ___ buka sampai jam empat sore.", answer: "layanan" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Nước ở nhà tôi bị cắt từ sáng.", answer: "Air di rumah saya mati sejak pagi." },
          { prompt: "Đồng hồ nước có thể có vấn đề.", answer: "Meteran airnya mungkin bermasalah." },
        ],
      },
    ],
  },
];
