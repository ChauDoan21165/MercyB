// Real Estate & Buying a House Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file. It mirrors sibling Indonesian `extra/*`
// files: target-language text is stored in `en`, Vietnamese glosses in `vi`,
// Vietnamese-facing L1 notes in `pronunciation_focus`, and English companions in
// `pronunciation_focus_en`.
//
// Property-buying register note: buying a house in Indonesia mixes everyday
// bargaining with finance/legal terms: `beli rumah`, `KPR`, `DP`, `cicilan`,
// `sertifikat`, `notaris`, `agen properti`, and `survei lokasi`.

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
    id: "indonesian_real_estate_buying_house",
    level: "B1",
    category: "housing",
    title_vi: "Mua nhà và bất động sản ở Indonesia",
    title_en: "Buying a house and real estate in Indonesia",
    sentences: [
      {
        en: "Saya sedang mencari rumah untuk dibeli.",
        vi: "Tôi đang tìm nhà để mua.",
        pronunciation_focus: [
          "SA-ya se-DANG men-CA-ri RU-mah UN-tuk di-BE-li - `mencari` = tìm; `dibeli` = được mua/để mua.",
          "Lỗi người Việt: nói `cari rumah beli`. Cụm tự nhiên hơn: `rumah untuk dibeli`.",
          "Luyện: `Saya mencari rumah untuk dibeli.`",
        ],
        pronunciation_focus_en: [
          "SA-ya se-DANG men-CHA-ri ROO-mah OON-took dee-BEH-lee - `mencari` = look for; `dibeli` = to be bought/for purchase.",
          "VN-speaker trap: saying `cari rumah beli`. A more natural phrase is `rumah untuk dibeli`.",
          "Drill: `Saya mencari rumah untuk dibeli.`",
        ],
      },
      {
        en: "Apakah rumah ini bisa dibeli dengan KPR?",
        vi: "Nhà này có thể mua bằng vay mua nhà KPR không?",
        pronunciation_focus: [
          "a-PA-kah RU-mah I-ni BI-sa di-BE-li DE-ngan ka-pe-ER - `KPR` = vay mua nhà/trả góp nhà.",
          "Lỗi người Việt: đọc `KPR` như một từ. Ở Indonesia thường đánh vần `ka-pe-er`.",
          "Luyện: `Bisa dibeli dengan KPR?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah ROO-mah EE-nee BEE-sa dee-BEH-lee DEH-ngan ka-peh-ER - `KPR` = mortgage/home loan.",
          "VN-speaker trap: reading `KPR` as one word. Indonesian usually spells it `ka-pe-er`.",
          "Drill: `Bisa dibeli dengan KPR?`",
        ],
      },
      {
        en: "Berapa DP yang harus dibayar?",
        vi: "Phải trả tiền đặt cọc/trả trước bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa de-PE yang HA-rus di-BA-yar - `DP` = uang muka/tiền trả trước; `dibayar` = được trả.",
          "Lỗi người Việt: dịch DP thành `deposit` trong mọi trường hợp. Mua nhà thường nói `DP` hoặc `uang muka`.",
          "Luyện: `Berapa DP-nya?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa deh-PEH yang HA-roos dee-BA-yar - `DP` = down payment; `dibayar` = paid.",
          "VN-speaker trap: translating DP as `deposit` every time. In house buying, use `DP` or `uang muka`.",
          "Drill: `Berapa DP-nya?`",
        ],
      },
      {
        en: "Cicilan per bulan berapa?",
        vi: "Tiền trả góp mỗi tháng là bao nhiêu?",
        pronunciation_focus: [
          "ci-CI-lan per BU-lan be-RA-pa - `cicilan` = khoản trả góp; `per bulan` = mỗi tháng.",
          "Lỗi người Việt: đọc `cicilan` với âm k. Chữ `c` Indonesia đọc `ch`: `chi-CHI-lan`.",
          "Luyện: `Cicilan per bulan berapa?`",
        ],
        pronunciation_focus_en: [
          "chee-CHEE-lan per BOO-lan be-RA-pa - `cicilan` = installment; `per bulan` = per month.",
          "VN-speaker trap: reading `cicilan` with a k sound. Indonesian `c` = `ch`: `chee-CHEE-lan`.",
          "Drill: `Cicilan per bulan berapa?`",
        ],
      },
      {
        en: "Saya ingin survei lokasi sebelum memutuskan.",
        vi: "Tôi muốn khảo sát vị trí trước khi quyết định.",
        pronunciation_focus: [
          "SA-ya I-ngin sur-VEI lo-KA-si se-BE-lum me-mu-TUS-kan - `survei lokasi` = khảo sát vị trí.",
          "Lỗi người Việt: nói `lihat tempat` được hiểu, nhưng với bất động sản tự nhiên hơn là `survei lokasi`.",
          "Luyện: `Saya ingin survei lokasi.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin soor-VAY lo-KA-see se-BE-lum me-moo-TOOS-kan - `survei lokasi` = location survey/site visit.",
          "VN-speaker trap: `lihat tempat` is understood, but real estate naturally says `survei lokasi`.",
          "Drill: `Saya ingin survei lokasi.`",
        ],
      },
      {
        en: "Agen properti akan menemani kami melihat rumah.",
        vi: "Môi giới bất động sản sẽ đi cùng chúng tôi xem nhà.",
        pronunciation_focus: [
          "A-gen pro-PER-ti A-kan me-ne-MA-ni KA-mi me-LI-hat RU-mah - `agen properti` = môi giới bất động sản.",
          "Lỗi người Việt: dùng `broker` tiếng Anh. Indonesia có thể hiểu, nhưng `agen properti` lịch sự và rõ hơn.",
          "Luyện: `Agen properti menemani kami.`",
        ],
        pronunciation_focus_en: [
          "A-gen pro-PER-tee A-kan me-ne-MA-nee KA-mee me-LEE-hat ROO-mah - `agen properti` = property agent.",
          "VN-speaker trap: using English `broker`. Indonesians may understand, but `agen properti` is clearer and polite.",
          "Drill: `Agen properti menemani kami.`",
        ],
      },
      {
        en: "Apakah sertifikat rumahnya sudah jelas?",
        vi: "Giấy chứng nhận quyền sở hữu nhà đã rõ ràng chưa?",
        pronunciation_focus: [
          "a-PA-kah ser-ti-fi-KAT RU-mah-nya SU-dah JE-las - `sertifikat` = giấy chứng nhận; `jelas` = rõ ràng.",
          "Lỗi người Việt: chỉ hỏi `surat rumah`. Nên hỏi cụ thể `sertifikat` để tránh mơ hồ.",
          "Luyện: `Sertifikatnya sudah jelas?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah ser-tee-fee-KAT ROO-mah-nya SOO-dah JEH-las - `sertifikat` = certificate/title; `jelas` = clear.",
          "VN-speaker trap: asking only `surat rumah`. Ask specifically about the `sertifikat` to avoid ambiguity.",
          "Drill: `Sertifikatnya sudah jelas?`",
        ],
      },
      {
        en: "Notaris akan memeriksa semua dokumen.",
        vi: "Công chứng viên sẽ kiểm tra tất cả giấy tờ.",
        pronunciation_focus: [
          "no-TA-ris A-kan me-me-RIK-sa se-MU-a do-ku-MEN - `notaris` = công chứng viên; `memeriksa` = kiểm tra.",
          "Lỗi người Việt: lẫn `notaris` với `nota` (hóa đơn). Mua bán nhà cần `notaris`.",
          "Luyện: `Notaris memeriksa dokumen.`",
        ],
        pronunciation_focus_en: [
          "no-TA-ris A-kan me-me-RIK-sa se-MOO-a do-koo-MEN - `notaris` = notary; `memeriksa` = check.",
          "VN-speaker trap: confusing `notaris` with `nota` (receipt). House sales need a `notaris`.",
          "Drill: `Notaris memeriksa dokumen.`",
        ],
      },
      {
        en: "Apakah harga masih bisa dinegosiasikan?",
        vi: "Giá còn có thể thương lượng không?",
        pronunciation_focus: [
          "a-PA-kah HAR-ga MA-sih BI-sa di-ne-go-si-A-si-kan - `dinegosiasikan` = được thương lượng.",
          "Lỗi người Việt: nói `bisa kurang?` là tự nhiên khi mua đồ nhỏ; mua nhà lịch sự hơn: `bisa dinegosiasikan?`.",
          "Luyện: `Harga masih bisa dinegosiasikan?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah HAR-ga MA-seeh BEE-sa dee-neh-go-see-A-see-kan - `dinegosiasikan` = negotiated.",
          "VN-speaker trap: `bisa kurang?` is fine for small purchases; for property, `bisa dinegosiasikan?` is more professional.",
          "Drill: `Harga masih bisa dinegosiasikan?`",
        ],
      },
      {
        en: "Lingkungannya aman dan tidak banjir?",
        vi: "Khu vực xung quanh an toàn và không ngập lụt chứ?",
        pronunciation_focus: [
          "ling-KU-ngan-nya A-man dan TI-dak BAN-jir - `lingkungan` = môi trường/khu vực xung quanh; `banjir` = ngập/lũ.",
          "Lỗi người Việt: chỉ hỏi nhà đẹp mà quên `lingkungan`. Ở Indonesia cần hỏi thêm `banjir`.",
          "Luyện: `Lingkungannya aman dan tidak banjir?`",
        ],
        pronunciation_focus_en: [
          "ling-KOO-ngan-nya A-man dan TEE-dak BAN-jeer - `lingkungan` = neighborhood/surroundings; `banjir` = flood.",
          "VN-speaker note: do not ask only whether the house is nice. In Indonesia, also ask about flooding.",
          "Drill: `Lingkungannya aman dan tidak banjir?`",
        ],
      },
      {
        en: "Kapan serah terima kunci dilakukan?",
        vi: "Khi nào bàn giao chìa khóa?",
        pronunciation_focus: [
          "KA-pan SE-rah te-RI-ma KUN-ci di-la-KU-kan - `serah terima kunci` = bàn giao chìa khóa.",
          "Lỗi người Việt: dịch từng chữ 'giao chìa khóa' thành `kasih kunci`. Giao dịch nhà dùng `serah terima kunci`.",
          "Luyện: `Kapan serah terima kunci?`",
        ],
        pronunciation_focus_en: [
          "KA-pan SEH-rah te-REE-ma KOON-chee dee-la-KOO-kan - `serah terima kunci` = handover of keys.",
          "VN-speaker trap: translating 'give keys' as `kasih kunci`. In property deals use `serah terima kunci`.",
          "Drill: `Kapan serah terima kunci?`",
        ],
      },
      {
        en: "Saya perlu waktu untuk membandingkan beberapa rumah.",
        vi: "Tôi cần thời gian để so sánh vài căn nhà.",
        pronunciation_focus: [
          "SA-ya PER-lu WAK-tu UN-tuk mem-ban-DING-kan be-be-RA-pa RU-mah - `membandingkan` = so sánh.",
          "Lỗi người Việt: bỏ tiền tố và nói `banding rumah`. Dạng chuẩn trong câu lịch sự: `membandingkan rumah`.",
          "Luyện: `Saya perlu waktu untuk membandingkan.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PER-loo WAK-too OON-took mem-ban-DING-kan be-be-RA-pa ROO-mah - `membandingkan` = compare.",
          "VN-speaker trap: dropping the prefix and saying `banding rumah`. In polite speech use `membandingkan rumah`.",
          "Drill: `Saya perlu waktu untuk membandingkan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi mua nhà ở Indonesia, người mua thường làm việc với `agen properti`, ngân hàng nếu dùng `KPR`, và `notaris` để kiểm tra giấy tờ. Hỏi kỹ loại `sertifikat`, tình trạng pháp lý, phí pajak/biaya notaris, khu vực có `banjir` không, và thời điểm `serah terima kunci`. Với người nước ngoài, quyền sở hữu đất/nhà có quy định riêng; bài này dạy ngôn ngữ giao tiếp, không thay thế tư vấn pháp lý.",
    cultural_notes_en:
      "When buying a house in Indonesia, buyers often work with an `agen properti`, a bank if using `KPR`, and a `notaris` to check documents. Ask carefully about the type of `sertifikat`, legal status, taxes/notary fees, whether the area floods, and the `serah terima kunci` date. Foreigners face specific ownership rules; this lesson teaches communication language, not legal advice.",
    tip_advice_vi:
      "Mẹo cho người Việt: trong giao dịch lớn, dùng câu lịch sự và cụ thể. Hỏi `Berapa DP?`, `Cicilan per bulan berapa?`, `Sertifikatnya sudah jelas?`, `Harga bisa dinegosiasikan?`. Đừng chỉ hỏi giá; hãy hỏi `survei lokasi`, `lingkungan`, `banjir`, `notaris`, và `sertifikat`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: for large transactions, use polite, specific questions. Ask `Berapa DP?`, `Cicilan per bulan berapa?`, `Sertifikatnya sudah jelas?`, `Harga bisa dinegosiasikan?`. Do not ask only about price; ask about `survei lokasi`, `lingkungan`, flooding, `notaris`, and the `sertifikat`.",
    vocabulary: [
      {
        word: "beli rumah",
        en: "to buy a house",
        vi: "mua nhà",
        pos: "verb phrase",
        pronunciation_vi: "BE-li RU-mah",
        pronunciation_en: "BEH-lee ROO-mah",
      },
      {
        word: "KPR",
        en: "mortgage / home loan",
        vi: "vay mua nhà",
        pos: "noun",
        pronunciation_vi: "ka-pe-ER",
        pronunciation_en: "ka-peh-ER",
      },
      {
        word: "DP",
        en: "down payment",
        vi: "tiền trả trước",
        pos: "noun",
        pronunciation_vi: "de-PE",
        pronunciation_en: "deh-PEH",
      },
      {
        word: "cicilan",
        en: "installment",
        vi: "khoản trả góp",
        pos: "noun",
        pronunciation_vi: "ci-CI-lan",
        pronunciation_en: "chee-CHEE-lan",
      },
      {
        word: "sertifikat",
        en: "certificate / property title",
        vi: "giấy chứng nhận / sổ nhà đất",
        pos: "noun",
        pronunciation_vi: "ser-ti-fi-KAT",
        pronunciation_en: "ser-tee-fee-KAT",
      },
      {
        word: "notaris",
        en: "notary",
        vi: "công chứng viên",
        pos: "noun",
        pronunciation_vi: "no-TA-ris",
        pronunciation_en: "no-TA-ris",
      },
      {
        word: "agen properti",
        en: "property agent",
        vi: "môi giới bất động sản",
        pos: "noun phrase",
        pronunciation_vi: "A-gen pro-PER-ti",
        pronunciation_en: "A-gen pro-PER-tee",
      },
      {
        word: "survei lokasi",
        en: "site visit / location survey",
        vi: "khảo sát vị trí",
        pos: "noun / verb phrase",
        pronunciation_vi: "sur-VEI lo-KA-si",
        pronunciation_en: "soor-VAY lo-KA-see",
      },
      {
        word: "uang muka",
        en: "down payment",
        vi: "tiền trả trước",
        pos: "noun phrase",
        pronunciation_vi: "U-ang MU-ka",
        pronunciation_en: "OO-ang MOO-ka",
      },
      {
        word: "serah terima kunci",
        en: "key handover",
        vi: "bàn giao chìa khóa",
        pos: "noun phrase",
        pronunciation_vi: "SE-rah te-RI-ma KUN-ci",
        pronunciation_en: "SEH-rah te-REE-ma KOON-chee",
      },
      {
        word: "lingkungan",
        en: "neighborhood / surroundings",
        vi: "khu vực xung quanh / môi trường",
        pos: "noun",
        pronunciation_vi: "ling-KU-ngan",
        pronunciation_en: "ling-KOO-ngan",
      },
      {
        word: "dinegosiasikan",
        en: "negotiable / can be negotiated",
        vi: "có thể thương lượng",
        pos: "verb",
        pronunciation_vi: "di-ne-go-si-A-si-kan",
        pronunciation_en: "dee-neh-go-see-A-see-kan",
      },
    ],
    dialogue: [
      {
        speaker: "Pembeli",
        text: "Saya tertarik dengan rumah ini. Apakah bisa dibeli dengan KPR?",
        vi: "Tôi quan tâm căn nhà này. Có thể mua bằng KPR không?",
        en: "I am interested in this house. Can it be bought with a mortgage?",
      },
      {
        speaker: "Agen",
        text: "Bisa. DP minimal dua puluh persen, lalu cicilan per bulan tergantung bank.",
        vi: "Được. Trả trước tối thiểu hai mươi phần trăm, rồi khoản trả góp mỗi tháng tùy ngân hàng.",
        en: "Yes. The minimum down payment is twenty percent, then the monthly installment depends on the bank.",
      },
      {
        speaker: "Pembeli",
        text: "Sebelum memutuskan, saya ingin survei lokasi dan cek sertifikat.",
        vi: "Trước khi quyết định, tôi muốn khảo sát vị trí và kiểm tra giấy chứng nhận.",
        en: "Before deciding, I want to survey the location and check the title.",
      },
      {
        speaker: "Agen",
        text: "Baik. Notaris juga bisa memeriksa dokumen setelah penawaran disetujui.",
        vi: "Vâng. Công chứng viên cũng có thể kiểm tra giấy tờ sau khi đề nghị giá được chấp thuận.",
        en: "Okay. A notary can also check the documents after the offer is approved.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tiền trả góp mỗi tháng là bao nhiêu?",
        answer: "Cicilan per bulan berapa?",
      },
      {
        type: "fill_blank",
        prompt: "Apakah rumah ini bisa dibeli dengan ____?",
        answer: "KPR",
        explanation_vi: "`KPR` = vay mua nhà / mortgage.",
        explanation_en: "`KPR` = mortgage / home loan.",
      },
      {
        type: "multiple_choice",
        prompt: "Which phrase means 'site visit / location survey'?",
        choices: ["survei lokasi", "uang muka", "serah terima kunci", "cicilan"],
        answer: "survei lokasi",
      },
      {
        type: "matching",
        pairs: [
          ["DP", "tiền trả trước"],
          ["cicilan", "khoản trả góp"],
          ["notaris", "công chứng viên"],
          ["sertifikat", "giấy chứng nhận"],
        ],
      },
    ],
  },
];

export default lessons;
